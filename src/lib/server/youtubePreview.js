import { spawn } from 'node:child_process';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import {
	YTDLP_COOKIES,
	YTDLP_COOKIES_FILE,
	YTDLP_EXTRA_ARGS,
	YTDLP_PROXY
} from '$app/env/private';
import { removeVideoUpload } from '#lib/server/tempUploads.js';

const HIGH_WIDTH = 720;
const LOW_WIDTH = 320;
const HIGH_FPS = 24;
const LOW_FPS = 15;
const DURATION_SECONDS = 7;
/** Extra seconds downloaded past the encode window for keyframe / seek safety */
const DOWNLOAD_PAD_SECONDS = 3;
const HIGH_CRF = 28;
const LOW_CRF = 32;
const CPU_USED = 5;

/** Metadata shared by the upload pipeline and the manual conversion page. */
export const PREVIEW_SPECS = {
	high: { width: HIGH_WIDTH, fps: HIGH_FPS, crf: HIGH_CRF, durationSeconds: DURATION_SECONDS },
	low: { width: LOW_WIDTH, fps: LOW_FPS, crf: LOW_CRF, durationSeconds: DURATION_SECONDS }
};

/** Default clip start: skip intro black frames / channel bumpers */
export const DEFAULT_PREVIEW_START_SECONDS = 2;

const YT_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;

/**
 * Player clients tried in order when YouTube bot-checks datacenter IPs.
 * Non-web clients (android/ios/tv) often work on VPS without browser cookies.
 * @type {ReadonlyArray<{ label: string, extractorArgs?: string }>}
 */
const YT_PLAYER_STRATEGIES = [
	{ label: 'android', extractorArgs: 'youtube:player_client=android' },
	{ label: 'ios', extractorArgs: 'youtube:player_client=ios' },
	{ label: 'tv', extractorArgs: 'youtube:player_client=tv' },
	{ label: 'mweb', extractorArgs: 'youtube:player_client=mweb' },
	{ label: 'default' }
];

/**
 * Flexible format: prefer ≤1080p video-only, then progressive, then anything.
 * 1080p gives the AVIF encoder enough detail for a crisp 720px preview.
 */
const YT_FORMAT =
	'bestvideo[height<=1080][ext=mp4]/bestvideo[height<=1080]/best[height<=1080]/best';

/** @type {Promise<void>} */
let generationQueue = Promise.resolve();

/**
 * Queue an async preview task so only one heavy yt-dlp/ffmpeg encode runs at a
 * time. A rejected task never blocks the queue.
 *
 * @template T
 * @param {() => Promise<T>} task
 * @returns {Promise<T>}
 */
export function enqueuePreviewTask(task) {
	const result = generationQueue.then(task);
	generationQueue = result.then(
		() => undefined,
		() => undefined
	);
	return result;
}

/**
 * Fail early with a clear message when the local conversion tools are missing.
 * The production image installs both; `bun run preview` uses the host binaries.
 *
 * Local video uploads only need ffmpeg, so yt-dlp is checked lazily.
 *
 * @param {{ needsYoutube?: boolean }} [options]
 */
export async function checkPreviewTools({ needsYoutube = true } = {}) {
	try {
		await runCommand('ffmpeg', ['-version'], { timeoutMs: 10_000 });
	} catch {
		throw new Error(
			'ffmpeg non trovato. Installalo e assicurati che sia disponibile nel PATH.'
		);
	}

	if (needsYoutube) {
		await resolveYtDlpBinary();
	}
}

/**
 * @param {unknown} url
 * @returns {boolean}
 */
export function isYoutubeUrl(url) {
	return typeof url === 'string' && YT_REGEX.test(url.trim());
}

/**
 * @param {FormDataEntryValue | null | undefined} value
 * @returns {value is File}
 */
export function hasUploadedFile(value) {
	return Boolean(
		value &&
			typeof value === 'object' &&
			'size' in value &&
			/** @type {File} */ (value).size > 0 &&
			/** @type {File} */ (value).name &&
			/** @type {File} */ (value).name !== 'undefined'
	);
}

/**
 * Parse preview start time from form input (seconds).
 * Accepts plain seconds ("12") or mm:ss / hh:mm:ss ("1:30", "00:01:30").
 * Falls back to DEFAULT_PREVIEW_START_SECONDS when empty/invalid.
 *
 * @param {FormDataEntryValue | string | number | null | undefined} value
 * @returns {number}
 */
export function parsePreviewStartSeconds(value) {
	if (value == null || value === '') return DEFAULT_PREVIEW_START_SECONDS;

	const raw = String(value).trim();
	if (!raw) return DEFAULT_PREVIEW_START_SECONDS;

	// hh:mm:ss or mm:ss
	if (raw.includes(':')) {
		const parts = raw.split(':').map((p) => Number(p));
		if (parts.some((n) => Number.isNaN(n) || n < 0)) {
			return DEFAULT_PREVIEW_START_SECONDS;
		}
		let seconds = 0;
		for (const part of parts) {
			seconds = seconds * 60 + part;
		}
		return Math.max(0, seconds);
	}

	const n = Number(raw);
	if (Number.isNaN(n) || n < 0) return DEFAULT_PREVIEW_START_SECONDS;
	return n;
}

/**
 * Resolve yt-dlp binary: system PATH first, then yt-dlp-exec package.
 * @returns {Promise<string>}
 */
async function resolveYtDlpBinary() {
	try {
		await runCommand('yt-dlp', ['--version'], { timeoutMs: 10_000 });
		return 'yt-dlp';
	} catch {
		// fall through to bundled binary
	}

	try {
		const require = createRequire(import.meta.url);
		const { YOUTUBE_DL_PATH } = require('yt-dlp-exec/src/constants.js');
		if (YOUTUBE_DL_PATH) return YOUTUBE_DL_PATH;
	} catch {
		// continue
	}

	throw new Error(
		'yt-dlp non trovato. Installalo sul sistema (es. pip install yt-dlp) oppure assicurati che yt-dlp-exec sia installato.'
	);
}

/**
 * Optional auth / network args for yt-dlp (VPS bot detection workarounds).
 *
 * Env:
 * - YTDLP_COOKIES_FILE: path to Netscape cookies.txt (recommended on VPS)
 * - YTDLP_COOKIES: raw Netscape cookies content (written to a temp file)
 * - YTDLP_PROXY: optional proxy URL (http://... or socks5://...)
 * - YTDLP_EXTRA_ARGS: space-separated extra args (advanced)
 *
 * @param {string} [workDir] - temp dir for materializing YTDLP_COOKIES content
 * @returns {Promise<{ args: string[], cleanup: () => Promise<void> }>}
 */
async function resolveYtDlpAuthArgs(workDir) {
	/** @type {string[]} */
	const args = [];
	/** @type {string | null} */
	let tempCookiesPath = null;

	const cookiesFile = YTDLP_COOKIES_FILE;
	const cookiesContent = YTDLP_COOKIES;
	const proxy = YTDLP_PROXY;
	const extra = YTDLP_EXTRA_ARGS;

	if (cookiesFile) {
		try {
			await access(cookiesFile, fsConstants.R_OK);
			args.push('--cookies', cookiesFile);
			console.log(`[youtubePreview] Uso cookies da file: ${cookiesFile}`);
		} catch {
			console.warn(
				`[youtubePreview] YTDLP_COOKIES_FILE non leggibile (${cookiesFile}); proseguo senza.`
			);
		}
	} else if (cookiesContent && workDir) {
		tempCookiesPath = join(workDir, 'youtube-cookies.txt');
		// Support env values that used literal \n sequences
		const normalized = cookiesContent.includes('\\n')
			? cookiesContent.replace(/\\n/g, '\n')
			: cookiesContent;
		await writeFile(tempCookiesPath, normalized, 'utf8');
		args.push('--cookies', tempCookiesPath);
		console.log('[youtubePreview] Uso cookies da env YTDLP_COOKIES');
	}

	if (proxy) {
		args.push('--proxy', proxy);
		console.log(`[youtubePreview] Uso proxy: ${proxy}`);
	}

	if (extra) {
		// Simple split; quote-aware parsing is unnecessary for known admin-set flags
		// Example: YTDLP_EXTRA_ARGS=--js-runtimes node
		args.push(...extra.split(/\s+/).filter(Boolean));
	}

	return {
		args,
		cleanup: async () => {
			if (tempCookiesPath) {
				await rm(tempCookiesPath, { force: true }).catch(() => {});
			}
		}
	};
}

/**
 * Build ordered download strategies. With cookies, try default client first;
 * without cookies, prefer android/ios/tv which avoid web bot checks on VPS.
 *
 * @param {boolean} hasCookies
 * @returns {ReadonlyArray<{ label: string, extractorArgs?: string }>}
 */
function buildPlayerStrategies(hasCookies) {
	if (!hasCookies) return YT_PLAYER_STRATEGIES;

	return [
		{ label: 'cookies+default' },
		{ label: 'cookies+android', extractorArgs: 'youtube:player_client=android' },
		...YT_PLAYER_STRATEGIES
	];
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{ cwd?: string, timeoutMs?: number }} [options]
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
function runCommand(command, args, options = {}) {
	const { cwd, timeoutMs = 10 * 60 * 1000 } = options;

	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			cwd,
			stdio: ['ignore', 'pipe', 'pipe'],
			windowsHide: true
		});

		let stdout = '';
		let stderr = '';
		/** @type {ReturnType<typeof setTimeout> | undefined} */
		let timer;

		if (timeoutMs > 0) {
			timer = setTimeout(() => {
				child.kill('SIGKILL');
				reject(new Error(`Timeout eseguendo: ${command} ${args.join(' ')}`));
			}, timeoutMs);
		}

		child.stdout?.on('data', (chunk) => {
			stdout += chunk.toString();
		});
		child.stderr?.on('data', (chunk) => {
			stderr += chunk.toString();
		});

		child.on('error', (err) => {
			if (timer) clearTimeout(timer);
			reject(err);
		});

		child.on('close', (code) => {
			if (timer) clearTimeout(timer);
			if (code === 0) {
				resolve({ stdout, stderr });
			} else {
				reject(
					new Error(
						`${command} uscito con codice ${code}: ${stderr || stdout || 'errore sconosciuto'}`
					)
				);
			}
		});
	});
}

/**
 * Human-readable hint when YouTube blocks the VPS as a bot.
 * @param {string} lastErrorMessage
 */
function botBlockHint(lastErrorMessage) {
	const looksLikeBot =
		/sign in to confirm|not a bot|cookies-from-browser|confirm you.re not a bot/i.test(
			lastErrorMessage
		);
	if (!looksLikeBot) return '';

	return (
		'\n\nYouTube sta bloccando questo server (IP datacenter). Soluzioni:\n' +
		'1) Esporta cookies Netscape da un browser loggato su YouTube e montali sul container:\n' +
		'   - Env YTDLP_COOKIES_FILE=/run/secrets/youtube-cookies.txt\n' +
		'   - Oppure YTDLP_COOKIES con il contenuto del file cookies.txt\n' +
		'2) (Opzionale) YTDLP_PROXY verso un proxy residenziale\n' +
		'Vedi: https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies'
	);
}

/**
 * Encode animated AVIF from a local clip.
 * The clip is assumed to already start near `startSeconds` when downloaded via sections;
 * we still seek `clipSeekSeconds` into the file for a clean window.
 *
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {object} options
 * @param {number} options.width
 * @param {number} options.fps
 * @param {number} options.crf
 * @param {number} [options.clipSeekSeconds=0] - seek within the downloaded clip (usually 0)
 */
async function encodeAnimatedAvif(
	inputPath,
	outputPath,
	{ width, fps, crf, clipSeekSeconds = 0 }
) {
	// libaom-av1 produces animated AVIF compatible with browsers.
	// cpu-used 5 keeps the encode reasonable while preserving preview quality.
	await runCommand(
		'ffmpeg',
		[
			'-y',
			'-hide_banner',
			'-loglevel',
			'error',
			'-ss',
			String(Math.max(0, clipSeekSeconds)),
			'-t',
			String(DURATION_SECONDS),
			'-i',
			inputPath,
			'-an',
			'-vf',
			`fps=${fps},scale=${width}:-2:flags=lanczos`,
			'-c:v',
			'libaom-av1',
			'-strict',
			'experimental',
			'-crf',
			String(crf),
			'-b:v',
			'0',
			'-cpu-used',
			String(CPU_USED),
			'-pix_fmt',
			'yuv420p',
			outputPath
		],
		{ timeoutMs: 15 * 60 * 1000 }
	);
}

/**
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {number} width
 */
async function downscaleAnimatedAvif(inputPath, outputPath, width) {
	await runCommand(
		'ffmpeg',
		[
			'-y',
			'-hide_banner',
			'-loglevel',
			'error',
			'-i',
			inputPath,
			'-an',
			'-vf',
			`fps=${LOW_FPS},scale=${width}:-2:flags=lanczos`,
			'-c:v',
			'libaom-av1',
			'-strict',
			'experimental',
			'-crf',
			String(LOW_CRF + 2),
			'-b:v',
			'0',
			'-cpu-used',
			String(CPU_USED),
			'-pix_fmt',
			'yuv420p',
			outputPath
		],
		{ timeoutMs: 15 * 60 * 1000 }
	);
}

/**
 * Cut a short window from a remote stream URL into a local mp4.
 * Tries libx264 first, then mpeg4 (some Alpine ffmpeg builds differ).
 *
 * @param {string} streamUrl
 * @param {string} outputPath
 * @param {number} start
 * @param {number} duration
 */
async function cutStreamWithFfmpeg(streamUrl, outputPath, start, duration) {
	const base = [
		'-y',
		'-hide_banner',
		'-loglevel',
		'error',
		'-ss',
		String(start),
		'-i',
		streamUrl,
		'-t',
		String(duration),
		'-an',
		'-pix_fmt',
		'yuv420p',
		'-movflags',
		'+faststart'
	];

	try {
		await runCommand(
			'ffmpeg',
			[...base, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', outputPath],
			{ timeoutMs: 5 * 60 * 1000 }
		);
	} catch {
		await runCommand('ffmpeg', [...base, '-c:v', 'mpeg4', '-q:v', '6', outputPath], {
			timeoutMs: 5 * 60 * 1000
		});
	}
}

/**
 * Download a short clip from YouTube for preview generation.
 * Retries with multiple player clients so VPS / datacenter IPs can avoid
 * the web "Sign in to confirm you're not a bot" check. Supports cookies via env.
 *
 * @param {string} youtubeUrl
 * @param {string} outputPath
 * @param {number} startSeconds - absolute start in the source video
 * @param {string} [workDir] - temp dir for cookie materialization
 */
async function downloadYoutubeClip(
	youtubeUrl,
	outputPath,
	startSeconds = DEFAULT_PREVIEW_START_SECONDS,
	workDir
) {
	const ytDlp = await resolveYtDlpBinary();
	const start = Math.max(0, startSeconds);
	const end = start + DURATION_SECONDS + DOWNLOAD_PAD_SECONDS;
	const duration = DURATION_SECONDS + DOWNLOAD_PAD_SECONDS;

	const { args: authArgs, cleanup } = await resolveYtDlpAuthArgs(workDir);
	const hasCookies = authArgs.includes('--cookies');
	const strategies = buildPlayerStrategies(hasCookies);

	/** @type {Error | null} */
	let lastError = null;

	try {
		for (const strategy of strategies) {
			/** @type {string[]} */
			const common = [
				...authArgs,
				'--no-playlist',
				'--no-warnings',
				'--force-overwrites',
				'-f',
				YT_FORMAT,
				'--merge-output-format',
				'mp4'
			];
			if (strategy.extractorArgs) {
				common.push('--extractor-args', strategy.extractorArgs);
			}

			// 1) Preferred: yt-dlp section download (minimal bandwidth).
			// Do NOT pass --force-keyframes-at-cuts: that makes yt-dlp re-encode
			// the section to H.264 before we encode it to AVIF. Without it the
			// original stream is copied and we transcode only once.
			try {
				console.log(
					`[youtubePreview] Tentativo download (${strategy.label}, sections ${start}-${end}s)...`
				);
				await runCommand(
					ytDlp,
					[
						...common,
						'--download-sections',
						`*${start}-${end}`,
						'-o',
						outputPath,
						youtubeUrl
					],
					{ timeoutMs: 5 * 60 * 1000 }
				);
				console.log(`[youtubePreview] Download OK con strategia: ${strategy.label}`);
				return;
			} catch (err) {
				lastError = err instanceof Error ? err : new Error(String(err));
				console.warn(
					`[youtubePreview] Sections fallita (${strategy.label}): ${lastError.message.split('\n')[0]}`
				);
			}

			// 2) Fallback: resolve direct stream URL, let ffmpeg cut the window
			try {
				console.log(
					`[youtubePreview] Tentativo stream URL + ffmpeg (${strategy.label}, start=${start}s)...`
				);
				// -g prints one URL per selected format (video first when video+audio)
				const { stdout } = await runCommand(ytDlp, [...common, '-g', youtubeUrl], {
					timeoutMs: 2 * 60 * 1000
				});
				const streamUrl = stdout
					.trim()
					.split(/\r?\n/)
					.map((l) => l.trim())
					.filter((l) => /^https?:\/\//i.test(l))
					.at(0);

				if (!streamUrl) {
					throw new Error('Nessun URL stream restituito da yt-dlp -g');
				}

				await cutStreamWithFfmpeg(streamUrl, outputPath, start, duration);
				console.log(
					`[youtubePreview] Download OK con strategia: ${strategy.label} (ffmpeg stream)`
				);
				return;
			} catch (err) {
				lastError = err instanceof Error ? err : new Error(String(err));
				console.warn(
					`[youtubePreview] Stream+ffmpeg fallita (${strategy.label}): ${lastError.message.split('\n')[0]}`
				);
			}
		}

		const detail = lastError?.message || 'errore sconosciuto';
		throw new Error(
			`Impossibile scaricare clip YouTube dopo ${strategies.length} strategie: ${detail}${botBlockHint(detail)}`
		);
	} finally {
		await cleanup();
	}
}

/**
 * Generate high-res and/or low-res animated AVIF previews.
 *
 * Provide either a YouTube URL (downloaded with yt-dlp) or `sourcePath`, a
 * local video uploaded only for the duration of the conversion.
 *
 * @param {object} options
 * @param {string} [options.youtubeUrl]
 * @param {string | null} [options.sourcePath] - local video file to extract from
 * @param {boolean} options.needsHigh
 * @param {boolean} options.needsLow
 * @param {File | Buffer | null} [options.existingHighres] - when only low-res is missing
 * @param {number} [options.startSeconds] - absolute start time in the video (default 2s)
 * @param {(stage: string) => void} [options.onStage] - progress callback (human readable)
 * @returns {Promise<{ highres?: File, lowres?: File }>}
 */
export async function generateAnimatedPreviews({
	youtubeUrl,
	sourcePath = null,
	needsHigh,
	needsLow,
	existingHighres = null,
	startSeconds = DEFAULT_PREVIEW_START_SECONDS,
	onStage
}) {
	if (!needsHigh && !needsLow) return {};

	/** @param {string} stage */
	const reportStage = (stage) => {
		try {
			onStage?.(stage);
		} catch {
			// Progress reporting must never break the conversion itself.
		}
	};

	const start = parsePreviewStartSeconds(startSeconds);
	const localSource = typeof sourcePath === 'string' && sourcePath ? sourcePath : null;
	const workDir = await mkdtemp(join(tmpdir(), 'mzey-preview-'));
	const clipPath = join(workDir, 'clip.mp4');
	const highPath = join(workDir, 'preview-hd.avif');
	const lowPath = join(workDir, 'preview-sd.avif');

	/**
	 * Download the YouTube window once, on demand.
	 *
	 * @returns {Promise<void>}
	 */
	let clipReady = Boolean(localSource);
	const ensureClip = async () => {
		if (clipReady) return;

		if (!youtubeUrl || !isYoutubeUrl(youtubeUrl)) {
			throw new Error('URL YouTube valido richiesto per generare le anteprime');
		}

		console.log(`[youtubePreview] Scarico clip da YouTube (start=${start}s)...`);
		reportStage(`Scarico la clip da YouTube (da ${start}s)...`);
		await downloadYoutubeClip(youtubeUrl, clipPath, start, workDir);
		clipReady = true;
	};

	/**
	 * @param {string} outputPath
	 * @param {number} width
	 * @param {number} fps
	 * @param {number} crf
	 * @param {string} stage
	 */
	const encodeVariant = async (outputPath, width, fps, crf, stage) => {
		reportStage(stage);
		await encodeAnimatedAvif(localSource ?? clipPath, outputPath, {
			width,
			fps,
			crf,
			// YouTube clips already start at `start`; a local upload needs a seek.
			clipSeekSeconds: localSource ? start : 0
		});
	};

	try {
		/** @type {{ highres?: File, lowres?: File }} */
		const result = {};

		if (needsHigh) {
			await ensureClip();

			console.log('[youtubePreview] Codifico AVIF HD...');
			await encodeVariant(
				highPath,
				HIGH_WIDTH,
				HIGH_FPS,
				HIGH_CRF,
				localSource
					? 'Codifico la preview AVIF HD dal video caricato...'
					: 'Codifico la preview AVIF HD (720px)...'
			);

			const highBuffer = await readFile(highPath);
			result.highres = new File([highBuffer], 'preview-hd.avif', { type: 'image/avif' });
		}

		if (needsLow) {
			try {
				if (localSource) {
					// Always encode from the original local source: better than
					// downscaling a freshly encoded HD preview.
					console.log('[youtubePreview] Codifico AVIF SD dal video caricato...');
					await encodeVariant(
						lowPath,
						LOW_WIDTH,
						LOW_FPS,
						LOW_CRF,
						'Codifico la preview AVIF SD (320px)...'
					);
				} else if (clipReady) {
					// Encode SD from the same source clip instead of shrinking the
					// freshly encoded HD AVIF, avoiding a second lossy generation.
					console.log('[youtubePreview] Codifico AVIF SD dalla clip sorgente...');
					reportStage('Codifico la preview AVIF SD (320px)...');
					await encodeAnimatedAvif(clipPath, lowPath, {
						width: LOW_WIDTH,
						fps: LOW_FPS,
						crf: LOW_CRF
					});
				} else if (existingHighres) {
					// Write provided high-res preview to disk so we can downscale it
					const sourceFilePath = join(workDir, 'source-hd');
					/** @type {string} */
					let fullSource;

					if (existingHighres instanceof File) {
						const buf = Buffer.from(await existingHighres.arrayBuffer());
						const ext = existingHighres.name?.split('.').pop() || 'avif';
						fullSource = `${sourceFilePath}.${ext}`;
						await writeFile(fullSource, buf);
					} else {
						fullSource = `${sourceFilePath}.avif`;
						await writeFile(fullSource, existingHighres);
					}

					console.log('[youtubePreview] Codifico AVIF SD da preview HD esistente...');
					reportStage('Ridimensiono la preview HD in AVIF SD (320px)...');
					await downscaleAnimatedAvif(fullSource, lowPath, LOW_WIDTH);
				} else {
					await ensureClip();
					console.log('[youtubePreview] Codifico AVIF SD...');
					reportStage('Codifico la preview AVIF SD (320px)...');
					await encodeAnimatedAvif(clipPath, lowPath, {
						width: LOW_WIDTH,
						fps: LOW_FPS,
						crf: LOW_CRF
					});
				}

				const lowBuffer = await readFile(lowPath);
				result.lowres = new File([lowBuffer], 'preview-sd.avif', { type: 'image/avif' });
			} catch (err) {
				// A failed SD derivative must not discard a successful HD preview.
				if (!result.highres) throw err;
				console.error('[youtubePreview] Generazione SD fallita:', err);
			}
		}

		return result;
	} finally {
		await rm(workDir, { recursive: true, force: true }).catch(() => {});
	}
}

/**
 * Attach generated preview files to a PocketBase video record.
 *
 * @param {import('pocketbase').default} pb
 * @param {string} videoId
 * @param {{ highres?: File, lowres?: File }} files
 */
export async function attachPreviewsToVideo(pb, videoId, files) {
	const data = new FormData();
	if (files.highres) data.append('animatedhighres', files.highres);
	if (files.lowres) data.append('animatedlowres', files.lowres);

	if (![...data.keys()].length) return null;

	return pb.collection('videos').update(videoId, data);
}

/**
 * Queue preview generation so only one heavy encode runs at a time.
 * Fire-and-forget safe for the long-running Bun server process.
 *
 * Temporary uploads are removed when the job finishes, whether it succeeds or
 * fails.
 *
 * @param {object} options
 * @param {import('pocketbase').default} options.pb
 * @param {string} options.videoId
 * @param {string} options.youtubeUrl
 * @param {boolean} options.needsHigh
 * @param {boolean} options.needsLow
 * @param {File | null} [options.existingHighres]
 * @param {import('./tempUploads.js').VideoUpload | null} [options.sourceUpload]
 * @param {number} [options.startSeconds]
 */
export function schedulePreviewGeneration(options) {
	const {
		pb,
		videoId,
		youtubeUrl,
		needsHigh,
		needsLow,
		existingHighres = null,
		sourceUpload = null,
		startSeconds = DEFAULT_PREVIEW_START_SECONDS
	} = options;

	const start = parsePreviewStartSeconds(startSeconds);

	return enqueuePreviewTask(async () => {
		console.log(
			`[youtubePreview] Avvio generazione anteprime per video ${videoId} (HD=${needsHigh}, SD=${needsLow}, start=${start}s, origine=${sourceUpload ? 'upload' : 'youtube'})`
		);

		try {
			const files = await generateAnimatedPreviews({
				youtubeUrl,
				sourcePath: sourceUpload?.path ?? null,
				needsHigh,
				needsLow,
				existingHighres,
				startSeconds: start
			});
			await attachPreviewsToVideo(pb, videoId, files);
			console.log(`[youtubePreview] Anteprime allegate al video ${videoId}`);
		} finally {
			if (sourceUpload) {
				await removeVideoUpload(sourceUpload);
			}
		}
	}).catch((err) => {
		console.error(`[youtubePreview] Generazione fallita per video ${videoId}:`, err);
	});
}

/**
 * Generate and attach previews immediately (awaitable).
 * Prefer schedulePreviewGeneration for upload UX.
 *
 * @param {object} options
 * @param {import('pocketbase').default} options.pb
 * @param {string} options.videoId
 * @param {string} options.youtubeUrl
 * @param {boolean} options.needsHigh
 * @param {boolean} options.needsLow
 * @param {File | null} [options.existingHighres]
 * @param {import('./tempUploads.js').VideoUpload | null} [options.sourceUpload]
 * @param {number} [options.startSeconds]
 */
export async function generateAndAttachPreviews(options) {
	try {
		const files = await generateAnimatedPreviews({
			youtubeUrl: options.youtubeUrl,
			sourcePath: options.sourceUpload?.path ?? null,
			needsHigh: options.needsHigh,
			needsLow: options.needsLow,
			existingHighres: options.existingHighres ?? null,
			startSeconds: options.startSeconds ?? DEFAULT_PREVIEW_START_SECONDS
		});
		return attachPreviewsToVideo(options.pb, options.videoId, files);
	} finally {
		if (options.sourceUpload) {
			await removeVideoUpload(options.sourceUpload);
		}
	}
}

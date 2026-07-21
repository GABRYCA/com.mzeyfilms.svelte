import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const HIGH_WIDTH = 480;
const LOW_WIDTH = 240;
const FPS = 15;
const DURATION_SECONDS = 7;
/** Extra seconds downloaded past the encode window for keyframe / seek safety */
const DOWNLOAD_PAD_SECONDS = 3;
const CRF = 32;
const CPU_USED = 6;

/** Default clip start: skip intro black frames / channel bumpers */
export const DEFAULT_PREVIEW_START_SECONDS = 2;

const YT_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;

/** @type {Promise<void>} */
let generationQueue = Promise.resolve();

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
 * Encode animated AVIF from a local clip.
 * The clip is assumed to already start near `startSeconds` when downloaded via sections;
 * we still seek `clipSeekSeconds` into the file for a clean window.
 *
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {number} width
 * @param {number} [clipSeekSeconds=0] - seek within the downloaded clip (usually 0)
 */
async function encodeAnimatedAvif(inputPath, outputPath, width, clipSeekSeconds = 0) {
	// libaom-av1 produces animated AVIF compatible with browsers.
	// cpu-used 6 balances encode time vs quality for server-side generation.
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
			`fps=${FPS},scale=${width}:-2:flags=lanczos`,
			'-c:v',
			'libaom-av1',
			'-strict',
			'experimental',
			'-crf',
			String(CRF),
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
			`scale=${width}:-2:flags=lanczos`,
			'-c:v',
			'libaom-av1',
			'-strict',
			'experimental',
			'-crf',
			String(CRF + 4),
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
 * Download a short clip from YouTube for preview generation.
 * @param {string} youtubeUrl
 * @param {string} outputPath
 * @param {number} startSeconds - absolute start in the source video
 */
async function downloadYoutubeClip(youtubeUrl, outputPath, startSeconds = DEFAULT_PREVIEW_START_SECONDS) {
	const ytDlp = await resolveYtDlpBinary();
	const start = Math.max(0, startSeconds);
	const end = start + DURATION_SECONDS + DOWNLOAD_PAD_SECONDS;

	await runCommand(
		ytDlp,
		[
			'--no-playlist',
			'--no-warnings',
			'--force-keyframes-at-cuts',
			'--download-sections',
			`*${start}-${end}`,
			'-f',
			'bestvideo[height<=720][ext=mp4]/bestvideo[height<=720]/best[height<=720]/best',
			'--merge-output-format',
			'mp4',
			'-o',
			outputPath,
			youtubeUrl
		],
		{ timeoutMs: 5 * 60 * 1000 }
	);
}

/**
 * Generate high-res and/or low-res animated AVIF previews.
 *
 * @param {object} options
 * @param {string} [options.youtubeUrl]
 * @param {boolean} options.needsHigh
 * @param {boolean} options.needsLow
 * @param {File | Buffer | null} [options.existingHighres] - when only low-res is missing
 * @param {number} [options.startSeconds] - absolute start time in the YouTube video (default 2s)
 * @returns {Promise<{ highres?: File, lowres?: File }>}
 */
export async function generateAnimatedPreviews({
	youtubeUrl,
	needsHigh,
	needsLow,
	existingHighres = null,
	startSeconds = DEFAULT_PREVIEW_START_SECONDS
}) {
	if (!needsHigh && !needsLow) return {};

	const start = parsePreviewStartSeconds(startSeconds);
	const workDir = await mkdtemp(join(tmpdir(), 'mzey-preview-'));
	const clipPath = join(workDir, 'clip.mp4');
	const highPath = join(workDir, 'preview-hd.avif');
	const lowPath = join(workDir, 'preview-sd.avif');

	try {
		/** @type {{ highres?: File, lowres?: File }} */
		const result = {};

		if (needsHigh) {
			if (!youtubeUrl || !isYoutubeUrl(youtubeUrl)) {
				throw new Error('URL YouTube valido richiesto per generare la preview HD');
			}

			console.log(`[youtubePreview] Scarico clip da YouTube (start=${start}s)...`);
			await downloadYoutubeClip(youtubeUrl, clipPath, start);

			console.log('[youtubePreview] Codifico AVIF HD...');
			// Clip already starts at `start`; encode from the beginning of the downloaded file
			await encodeAnimatedAvif(clipPath, highPath, HIGH_WIDTH, 0);
			const highBuffer = await readFile(highPath);
			result.highres = new File([highBuffer], 'preview-hd.avif', { type: 'image/avif' });
		} else if (needsLow && existingHighres) {
			// Write provided high-res preview to disk so we can downscale it
			const sourcePath = join(workDir, 'source-hd');
			if (existingHighres instanceof File) {
				const buf = Buffer.from(await existingHighres.arrayBuffer());
				const ext = existingHighres.name?.split('.').pop() || 'avif';
				const fullSource = `${sourcePath}.${ext}`;
				await writeFile(fullSource, buf);
				console.log('[youtubePreview] Codifico AVIF SD da preview HD caricata...');
				await downscaleAnimatedAvif(fullSource, lowPath, LOW_WIDTH);
			} else {
				await writeFile(`${sourcePath}.avif`, existingHighres);
				await downscaleAnimatedAvif(`${sourcePath}.avif`, lowPath, LOW_WIDTH);
			}
			const lowBuffer = await readFile(lowPath);
			result.lowres = new File([lowBuffer], 'preview-sd.avif', { type: 'image/avif' });
			return result;
		}

		if (needsLow) {
			// Prefer downscaling the HD AVIF we just made (or re-encode from clip)
			if (result.highres) {
				console.log('[youtubePreview] Codifico AVIF SD da HD...');
				await downscaleAnimatedAvif(highPath, lowPath, LOW_WIDTH);
			} else {
				if (!youtubeUrl || !isYoutubeUrl(youtubeUrl)) {
					throw new Error('URL YouTube valido richiesto per generare la preview SD');
				}
				console.log(`[youtubePreview] Scarico clip da YouTube per SD (start=${start}s)...`);
				await downloadYoutubeClip(youtubeUrl, clipPath, start);
				console.log('[youtubePreview] Codifico AVIF SD...');
				await encodeAnimatedAvif(clipPath, lowPath, LOW_WIDTH, 0);
			}
			const lowBuffer = await readFile(lowPath);
			result.lowres = new File([lowBuffer], 'preview-sd.avif', { type: 'image/avif' });
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
 * Fire-and-forget safe for adapter-node long-running process.
 *
 * @param {object} options
 * @param {import('pocketbase').default} options.pb
 * @param {string} options.videoId
 * @param {string} options.youtubeUrl
 * @param {boolean} options.needsHigh
 * @param {boolean} options.needsLow
 * @param {File | null} [options.existingHighres]
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
		startSeconds = DEFAULT_PREVIEW_START_SECONDS
	} = options;

	const start = parsePreviewStartSeconds(startSeconds);

	generationQueue = generationQueue
		.then(async () => {
			console.log(
				`[youtubePreview] Avvio generazione anteprime per video ${videoId} (HD=${needsHigh}, SD=${needsLow}, start=${start}s)`
			);
			const files = await generateAnimatedPreviews({
				youtubeUrl,
				needsHigh,
				needsLow,
				existingHighres,
				startSeconds: start
			});
			await attachPreviewsToVideo(pb, videoId, files);
			console.log(`[youtubePreview] Anteprime allegate al video ${videoId}`);
		})
		.catch((err) => {
			console.error(`[youtubePreview] Generazione fallita per video ${videoId}:`, err);
		});

	return generationQueue;
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
 * @param {number} [options.startSeconds]
 */
export async function generateAndAttachPreviews(options) {
	const files = await generateAnimatedPreviews({
		youtubeUrl: options.youtubeUrl,
		needsHigh: options.needsHigh,
		needsLow: options.needsLow,
		existingHighres: options.existingHighres ?? null,
		startSeconds: options.startSeconds ?? DEFAULT_PREVIEW_START_SECONDS
	});
	return attachPreviewsToVideo(options.pb, options.videoId, files);
}

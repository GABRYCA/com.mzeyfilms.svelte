import { randomUUID } from 'node:crypto';
import { access, mkdtemp, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getYoutubeId } from '#lib/utils/utils.js';
import {
	DEFAULT_PREVIEW_START_SECONDS,
	enqueuePreviewTask,
	generateAnimatedPreviews,
	parsePreviewStartSeconds
} from '#lib/server/youtubePreview.js';

/** Completed files stay downloadable for 24 hours. */
export const CONVERSION_JOB_TTL_MS = 24 * 60 * 60 * 1000;

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const JOB_DIR_PREFIX = 'mzey-conversion-';

/**
 * @typedef {'queued' | 'running' | 'completed' | 'failed'} ConversionJobStatus
 */

/**
 * @typedef {object} ConversionJobFile
 * @property {string} path
 * @property {string} name
 * @property {number} size
 */

/**
 * @typedef {object} ConversionJob
 * @property {string} id
 * @property {ConversionJobStatus} status
 * @property {string} stage
 * @property {string} youtubeUrl
 * @property {number} startSeconds
 * @property {number} createdAt
 * @property {number} updatedAt
 * @property {number} expiresAt
 * @property {number} [completedAt]
 * @property {string} [error]
 * @property {string} [warning]
 * @property {string} workDir
 * @property {{ high?: ConversionJobFile, low?: ConversionJobFile }} files
 */

/**
 * In-memory jobs are enough for the single long-running server process.
 * `globalThis` keeps the map across Vite HMR module reloads in development.
 *
 * @returns {Map<string, ConversionJob>}
 */
function getJobs() {
	if (!(globalThis.conversionJobs instanceof Map)) {
		globalThis.conversionJobs = new Map();
	}

	return globalThis.conversionJobs;
}

/**
 * @param {ConversionJob} job
 */
async function removeJob(job) {
	getJobs().delete(job.id);
	await rm(job.workDir, { recursive: true, force: true }).catch(() => {});
}

async function cleanupExpiredJobs() {
	const now = Date.now();

	for (const job of getJobs().values()) {
		if (job.expiresAt <= now) {
			await removeJob(job);
		}
	}
}

/**
 * Remove orphaned conversion directories left behind by a previous server
 * process. Jobs themselves are in memory, so a restart loses their metadata;
 * their files must not stay in the OS temp directory forever.
 */
async function cleanupStaleTempDirs() {
	const root = tmpdir();

	/** @type {import('node:fs').Dirent[]} */
	let entries;
	try {
		entries = await readdir(root, { withFileTypes: true });
	} catch {
		return;
	}

	const now = Date.now();
	await Promise.all(
		entries.map(async (entry) => {
			if (!entry.isDirectory() || !entry.name.startsWith(JOB_DIR_PREFIX)) return;

			const path = join(root, entry.name);
			try {
				const info = await stat(path);
				if (now - info.mtimeMs > CONVERSION_JOB_TTL_MS) {
					await rm(path, { recursive: true, force: true });
				}
			} catch {
				// Another process may have removed it already.
			}
		})
	);
}

function scheduleCleanup() {
	if (globalThis.conversionJobsCleanupStarted) return;

	globalThis.conversionJobsCleanupStarted = true;
	void cleanupStaleTempDirs();

	const timer = setInterval(() => {
		void cleanupExpiredJobs();
		void cleanupStaleTempDirs();
	}, CLEANUP_INTERVAL_MS);

	// Never keep a CLI process or test runner alive because of this timer.
	timer.unref?.();
}

/**
 * @param {ConversionJob} job
 * @param {File} file
 * @param {'hd' | 'sd'} suffix
 * @returns {Promise<ConversionJobFile>}
 */
async function persistPreviewFile(job, file, suffix) {
	const videoId = getYoutubeId(job.youtubeUrl) || job.id.slice(0, 8);
	const name = `mzeyfilms-${videoId}-${suffix}.avif`;
	const path = join(job.workDir, name);
	const buffer = Buffer.from(await file.arrayBuffer());

	await writeFile(path, buffer);

	return { path, name, size: buffer.byteLength };
}

/**
 * @param {ConversionJob} job
 */
async function runConversionJob(job) {
	job.status = 'running';
	job.stage = 'Scarico la clip da YouTube...';
	job.updatedAt = Date.now();

	try {
		const files = await generateAnimatedPreviews({
			youtubeUrl: job.youtubeUrl,
			needsHigh: true,
			needsLow: true,
			startSeconds: job.startSeconds,
			onStage: (stage) => {
				job.stage = stage;
				job.updatedAt = Date.now();
			}
		});

		if (!files.highres) {
			throw new Error('La conversione non ha prodotto la preview HD.');
		}

		job.files.high = await persistPreviewFile(job, files.highres, 'hd');

		if (files.lowres) {
			job.files.low = await persistPreviewFile(job, files.lowres, 'sd');
		} else {
			job.warning =
				'La preview SD non è stata generata. Puoi comunque scaricare la versione HD.';
		}

		job.status = 'completed';
		job.stage = 'Conversione completata.';
		job.completedAt = Date.now();
		job.updatedAt = job.completedAt;
	} catch (err) {
		job.status = 'failed';
		job.error = err instanceof Error ? err.message : String(err);
		job.stage = 'Conversione non riuscita.';
		job.updatedAt = Date.now();
		console.error(`[conversionJobs] Job ${job.id} failed:`, err);
	}
}

/**
 * Create a job and queue the heavy yt-dlp + AVIF work in the background.
 * The shared preview queue keeps only one conversion running at a time.
 *
 * @param {object} options
 * @param {string} options.youtubeUrl
 * @param {number} [options.startSeconds]
 * @returns {Promise<ConversionJob>}
 */
export async function startConversionJob({
	youtubeUrl,
	startSeconds = DEFAULT_PREVIEW_START_SECONDS
}) {
	scheduleCleanup();

	const id = randomUUID();
	const workDir = await mkdtemp(join(tmpdir(), JOB_DIR_PREFIX));
	const now = Date.now();

	/** @type {ConversionJob} */
	const job = {
		id,
		status: 'queued',
		stage: 'In coda: attendo che si liberi il generatore di anteprime...',
		youtubeUrl,
		startSeconds: parsePreviewStartSeconds(startSeconds),
		createdAt: now,
		updatedAt: now,
		expiresAt: now + CONVERSION_JOB_TTL_MS,
		workDir,
		files: {}
	};

	getJobs().set(id, job);

	void enqueuePreviewTask(() => runConversionJob(job)).catch((err) => {
		job.status = 'failed';
		job.error = err instanceof Error ? err.message : String(err);
		job.stage = 'Conversione non riuscita.';
		job.updatedAt = Date.now();
		console.error(`[conversionJobs] Unexpected failure for job ${job.id}:`, err);
	});

	return job;
}

/**
 * @param {string} id
 * @returns {ConversionJob | null}
 */
export function getConversionJob(id) {
	if (typeof id !== 'string' || !id) return null;

	const job = getJobs().get(id);
	if (!job) return null;

	if (job.expiresAt <= Date.now()) {
		void removeJob(job);
		return null;
	}

	return job;
}

/**
 * @param {string} id
 * @param {'high' | 'low'} variant
 * @returns {Promise<ConversionJobFile | null>}
 */
export async function getConversionFile(id, variant) {
	if (variant !== 'high' && variant !== 'low') return null;

	const job = getConversionJob(id);
	if (!job || job.status !== 'completed') return null;

	const file = job.files[variant];
	if (!file) return null;

	try {
		await access(file.path);
	} catch {
		return null;
	}

	return file;
}

/**
 * Strip server paths before sending job state to the browser.
 *
 * @param {ConversionJob | null} job
 */
export function toPublicConversionJob(job) {
	if (!job) return null;

	/**
	 * @param {'high' | 'low'} variant
	 */
	const publicFile = (variant) => {
		const file = job.files[variant];
		if (!file) return null;

		return {
			name: file.name,
			size: file.size,
			url: `/admin/dashboard/conversion/download/${job.id}/${variant}`
		};
	};

	return {
		id: job.id,
		status: job.status,
		stage: job.stage,
		youtubeUrl: job.youtubeUrl,
		startSeconds: job.startSeconds,
		createdAt: job.createdAt,
		updatedAt: job.updatedAt,
		expiresAt: job.expiresAt,
		completedAt: job.completedAt ?? null,
		error: job.error ?? '',
		warning: job.warning ?? '',
		files: {
			high: publicFile('high'),
			low: publicFile('low')
		}
	};
}

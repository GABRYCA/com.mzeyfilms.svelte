import { randomUUID } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

/**
 * Temporary source videos are only used to extract animated AVIF previews.
 * They are never written to PocketBase and are always removed afterwards.
 */
export const MAX_VIDEO_UPLOAD_BYTES = 512 * 1024 * 1024;

/** Unclaimed uploads are removed automatically after this long. */
export const VIDEO_UPLOAD_TTL_MS = 6 * 60 * 60 * 1000;

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const UPLOAD_DIR_PREFIX = 'mzey-upload-';
const ALLOWED_VIDEO_EXTENSIONS = new Set([
	'.mp4',
	'.m4v',
	'.mov',
	'.mkv',
	'.webm',
	'.avi',
	'.ogv',
	'.mpg',
	'.mpeg',
	'.3gp'
]);

/**
 * @typedef {object} VideoUpload
 * @property {string} id
 * @property {string} name
 * @property {string} path
 * @property {string} dir
 * @property {number} size
 * @property {number} createdAt
 * @property {number} expiresAt
 */

export class VideoUploadError extends Error {
	/**
	 * @param {string} message
	 * @param {number} [status]
	 */
	constructor(message, status = 400) {
		super(message);
		this.name = 'VideoUploadError';
		this.status = status;
	}
}

/**
 * @param {number} bytes
 */
export function formatBytes(bytes) {
	if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';

	const units = ['B', 'KB', 'MB', 'GB'];
	let value = bytes;
	let unit = 0;

	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit += 1;
	}

	return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

/**
 * @returns {Map<string, VideoUpload>}
 */
function getUploads() {
	if (!(globalThis.videoUploads instanceof Map)) {
		globalThis.videoUploads = new Map();
	}

	return globalThis.videoUploads;
}

/**
 * Strip directories and control characters from the browser-supplied name.
 *
 * @param {string | null} value
 * @returns {string}
 */
function normalizeOriginalName(value) {
	let decoded = value ?? '';

	try {
		decoded = decodeURIComponent(decoded);
	} catch {
		// Keep the raw value when it is not valid percent-encoding.
	}

	const name = decoded
		.split(/[\\/]/)
		.pop()
		?.replace(/[\u0000-\u001f\u007f]/g, '')
		.trim();

	return name && name !== 'undefined' ? name.slice(0, 180) : 'video.mp4';
}

/**
 * Stream an upload to a private temp directory.
 *
 * @param {Request} request
 * @returns {Promise<VideoUpload>}
 */
export async function receiveVideoUpload(request) {
	const declaredLength = Number(request.headers.get('content-length') ?? Number.NaN);

	if (!Number.isFinite(declaredLength) || declaredLength <= 0) {
		throw new VideoUploadError('Nessun video ricevuto.', 400);
	}

	if (declaredLength > MAX_VIDEO_UPLOAD_BYTES) {
		throw new VideoUploadError(
			`Il video supera il limite di ${formatBytes(MAX_VIDEO_UPLOAD_BYTES)}.`,
			413
		);
	}

	if (!request.body) {
		throw new VideoUploadError('Nessun video ricevuto.', 400);
	}

	const originalName = normalizeOriginalName(request.headers.get('x-file-name'));
	const extension = extname(originalName).toLowerCase();

	if (!ALLOWED_VIDEO_EXTENSIONS.has(extension)) {
		throw new VideoUploadError(
			'Formato video non supportato. Usa MP4, MOV, MKV, WebM o AVI.',
			415
		);
	}

	const dir = await mkdtemp(join(tmpdir(), UPLOAD_DIR_PREFIX));
	const path = join(dir, `source${extension}`);

	/** @type {number} */
	let size = 0;

	try {
		const limiter = new Transform({
			transform(chunk, _encoding, callback) {
				size += chunk.length;

				if (size > MAX_VIDEO_UPLOAD_BYTES) {
					callback(
						new VideoUploadError(
							`Il video supera il limite di ${formatBytes(MAX_VIDEO_UPLOAD_BYTES)}.`,
							413
						)
					);
					return;
				}

				callback(null, chunk);
			}
		});

		await pipeline(
			Readable.fromWeb(
				/** @type {import('node:stream/web').ReadableStream<Uint8Array>} */ (request.body)
			),
			limiter,
			createWriteStream(path)
		);

		if (size === 0) {
			throw new VideoUploadError('Il video caricato è vuoto.', 400);
		}
	} catch (error) {
		await rm(dir, { recursive: true, force: true }).catch(() => {});

		if (error instanceof VideoUploadError) throw error;

		console.error('[tempUploads] Video upload failed:', error);
		throw new VideoUploadError('Caricamento del video non riuscito. Riprova.', 500);
	}

	const now = Date.now();

	/** @type {VideoUpload} */
	const upload = {
		id: randomUUID(),
		name: originalName,
		path,
		dir,
		size,
		createdAt: now,
		expiresAt: now + VIDEO_UPLOAD_TTL_MS
	};

	getUploads().set(upload.id, upload);
	scheduleCleanup();

	return upload;
}

/**
 * Remove an upload's directory. Safe to call more than once.
 *
 * @param {VideoUpload} upload
 */
export async function removeVideoUpload(upload) {
	getUploads().delete(upload.id);
	await rm(upload.dir, { recursive: true, force: true }).catch(() => {});
}

/**
 * Atomically claim an upload for a one-shot conversion. The caller owns the
 * returned directory and must remove it when finished.
 *
 * @param {unknown} id
 * @returns {VideoUpload | null}
 */
export function claimVideoUpload(id) {
	if (typeof id !== 'string' || !id) return null;

	const upload = getUploads().get(id);
	if (!upload) return null;

	getUploads().delete(id);

	if (upload.expiresAt <= Date.now()) {
		void removeVideoUpload(upload);
		return null;
	}

	return upload;
}

/**
 * @param {VideoUpload} upload
 */
export function toPublicVideoUpload(upload) {
	return {
		id: upload.id,
		name: upload.name,
		size: upload.size
	};
}

async function cleanupExpiredUploads() {
	const now = Date.now();

	for (const upload of getUploads().values()) {
		if (upload.expiresAt <= now) {
			await removeVideoUpload(upload);
		}
	}
}

/**
 * Remove temp upload directories left behind by a previous server process.
 */
async function cleanupStaleUploadDirs() {
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
			if (!entry.isDirectory() || !entry.name.startsWith(UPLOAD_DIR_PREFIX)) return;

			const path = join(root, entry.name);
			try {
				const info = await stat(path);
				if (now - info.mtimeMs > VIDEO_UPLOAD_TTL_MS) {
					await rm(path, { recursive: true, force: true });
				}
			} catch {
				// Another process may have removed it already.
			}
		})
	);
}

function scheduleCleanup() {
	if (globalThis.videoUploadCleanupStarted) return;

	globalThis.videoUploadCleanupStarted = true;
	void cleanupStaleUploadDirs();

	const timer = setInterval(() => {
		void cleanupExpiredUploads();
		void cleanupStaleUploadDirs();
	}, CLEANUP_INTERVAL_MS);

	timer.unref?.();
}

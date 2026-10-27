/**
 * Upload a temporary source video to the admin preview pipeline.
 *
 * The file is streamed to the server and stored in the OS temp directory only
 * long enough to extract the animated AVIF previews. It is never saved to
 * PocketBase.
 *
 * @param {File} file
 * @param {(progress: number) => void} [onProgress] - 0..1 while uploading
 * @returns {Promise<{ id: string, name: string, size: number }>}
 */
export function uploadVideoFile(file, onProgress) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open('POST', '/admin/dashboard/video-upload');
		request.responseType = 'json';
		request.setRequestHeader('x-file-name', encodeURIComponent(file.name));

		request.upload.addEventListener('progress', (event) => {
			if (event.lengthComputable) {
				onProgress?.(event.loaded / event.total);
			}
		});

		request.addEventListener('load', () => {
			const body = request.response ?? {};

			if (request.status >= 200 && request.status < 300 && body?.id) {
				onProgress?.(1);
				resolve(body);
				return;
			}

			reject(
				new Error(
					typeof body?.message === 'string'
						? body.message
						: `Caricamento non riuscito (HTTP ${request.status}).`
				)
			);
		});

		request.addEventListener('error', () => {
			reject(new Error('Errore di rete durante il caricamento del video.'));
		});

		request.addEventListener('abort', () => {
			reject(new Error('Caricamento del video annullato.'));
		});

		request.send(file);
	});
}

/**
 * @param {number} bytes
 */
export function formatFileSize(bytes) {
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

/** Extensions accepted by the temp upload endpoint. */
export const VIDEO_FILE_ACCEPT = 'video/*,.mp4,.m4v,.mov,.mkv,.webm,.avi,.ogv,.mpg,.mpeg,.3gp';

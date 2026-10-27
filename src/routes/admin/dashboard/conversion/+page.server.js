import { fail, redirect } from '@sveltejs/kit';
import { requireAdmin } from '#lib/server/adminAuth.js';
import {
	getConversionJob,
	startConversionJob,
	toPublicConversionJob
} from '#lib/server/conversionJobs.js';
import {
	claimVideoUpload,
	removeVideoUpload,
	MAX_VIDEO_UPLOAD_BYTES
} from '#lib/server/tempUploads.js';
import {
	checkPreviewTools,
	isYoutubeUrl,
	parsePreviewStartSeconds
} from '#lib/server/youtubePreview.js';

const TITLE = 'MZEYFILMS - Admin - Conversione video';
const DESCRIPTION = 'Genera e scarica anteprime AVIF animate da YouTube o da un video locale.';

export const load = async ({ cookies, url }) => {
	requireAdmin(cookies);

	const jobId = url.searchParams.get('job')?.trim() ?? '';
	const job = jobId ? toPublicConversionJob(getConversionJob(jobId)) : null;

	return {
		title: TITLE,
		description: DESCRIPTION,
		index: false,
		job,
		jobId,
		jobMissing: Boolean(jobId) && !job,
		maxUploadBytes: MAX_VIDEO_UPLOAD_BYTES
	};
};

export const actions = {
	start: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const sourceType = String(formData.get('source') ?? 'youtube') === 'upload'
			? 'upload'
			: 'youtube';
		const youtubeUrl = String(formData.get('url') ?? '').trim();
		const uploadId = String(formData.get('videoUploadId') ?? '').trim();
		const previewStart = String(formData.get('previewStart') ?? '');
		const startSeconds = parsePreviewStartSeconds(previewStart);

		/** @param {string} message @param {number} status */
		const validationError = (message, status = 400) =>
			fail(status, {
				message,
				source: sourceType,
				url: youtubeUrl,
				previewStart
			});

		if (sourceType === 'upload') {
			const upload = claimVideoUpload(uploadId);

			if (!upload) {
				return validationError(
					'Carica un video valido. Il file potrebbe essere scaduto: selezionalo di nuovo.'
				);
			}

			try {
				await checkPreviewTools({ needsYoutube: false });
			} catch (err) {
				await removeVideoUpload(upload);
				return validationError(
					err instanceof Error ? err.message : 'Strumenti di conversione non disponibili.',
					503
				);
			}

			/** @type {Awaited<ReturnType<typeof startConversionJob>>} */
			let job;
			try {
				job = await startConversionJob({
					sourceType: 'upload',
					sourceUpload: upload,
					startSeconds
				});
			} catch (err) {
				await removeVideoUpload(upload);
				console.error('[conversion] Could not start upload job:', err);
				return validationError(
					'Impossibile avviare la conversione del video. Riprova tra poco.',
					500
				);
			}

			redirect(303, `/admin/dashboard/conversion?job=${job.id}`);
		}

		if (!youtubeUrl) {
			return validationError('Inserisci un URL YouTube.');
		}

		if (!isYoutubeUrl(youtubeUrl)) {
			return validationError('URL YouTube non valido. Usa un link youtube.com o youtu.be.');
		}

		try {
			await checkPreviewTools();
		} catch (err) {
			return validationError(
				err instanceof Error ? err.message : 'Strumenti di conversione non disponibili.',
				503
			);
		}

		/** @type {Awaited<ReturnType<typeof startConversionJob>>} */
		let job;
		try {
			job = await startConversionJob({ sourceType: 'youtube', youtubeUrl, startSeconds });
		} catch (err) {
			console.error('[conversion] Could not start job:', err);
			return validationError(
				'Impossibile avviare la conversione. Riprova tra poco.',
				500
			);
		}

		redirect(303, `/admin/dashboard/conversion?job=${job.id}`);
	}
};

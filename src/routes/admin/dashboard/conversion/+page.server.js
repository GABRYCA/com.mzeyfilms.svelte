import { fail, redirect } from '@sveltejs/kit';
import { requireAdmin } from '#lib/server/adminAuth.js';
import {
	getConversionJob,
	startConversionJob,
	toPublicConversionJob
} from '#lib/server/conversionJobs.js';
import {
	checkPreviewTools,
	isYoutubeUrl,
	parsePreviewStartSeconds
} from '#lib/server/youtubePreview.js';

export const load = async ({ cookies, url }) => {
	requireAdmin(cookies);

	const jobId = url.searchParams.get('job')?.trim() ?? '';
	const job = jobId ? toPublicConversionJob(getConversionJob(jobId)) : null;

	return {
		title: 'MZEYFILMS - Admin - Conversione YouTube',
		description: 'Genera e scarica anteprime AVIF animate da un video YouTube.',
		index: false,
		job,
		jobId,
		jobMissing: Boolean(jobId) && !job
	};
};

export const actions = {
	start: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const youtubeUrl = String(formData.get('url') ?? '').trim();
		const previewStart = String(formData.get('previewStart') ?? '');
		const startSeconds = parsePreviewStartSeconds(previewStart);

		if (!youtubeUrl) {
			return fail(400, {
				message: 'Inserisci un URL YouTube.',
				url: youtubeUrl,
				previewStart
			});
		}

		if (!isYoutubeUrl(youtubeUrl)) {
			return fail(400, {
				message: 'URL YouTube non valido. Usa un link youtube.com o youtu.be.',
				url: youtubeUrl,
				previewStart
			});
		}

		try {
			await checkPreviewTools();
		} catch (err) {
			return fail(503, {
				message: err instanceof Error ? err.message : 'Strumenti di conversione non disponibili.',
				url: youtubeUrl,
				previewStart
			});
		}

		/** @type {Awaited<ReturnType<typeof startConversionJob>>} */
		let job;
		try {
			job = await startConversionJob({ youtubeUrl, startSeconds });
		} catch (err) {
			console.error('[conversion] Could not start job:', err);
			return fail(500, {
				message: 'Impossibile avviare la conversione. Riprova tra poco.',
				url: youtubeUrl,
				previewStart
			});
		}

		redirect(303, `/admin/dashboard/conversion?job=${job.id}`);
	}
};

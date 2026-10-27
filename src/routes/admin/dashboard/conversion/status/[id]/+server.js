import { json } from '@sveltejs/kit';
import { requireAdmin } from '#lib/server/adminAuth.js';
import { getConversionJob, toPublicConversionJob } from '#lib/server/conversionJobs.js';

export async function GET({ cookies, params }) {
	requireAdmin(cookies);

	const job = toPublicConversionJob(getConversionJob(params.id));

	if (!job) {
		return json(
			{ message: 'Conversione non trovata o scaduta.' },
			{ status: 404, headers: { 'cache-control': 'no-store' } }
		);
	}

	return json(job, { headers: { 'cache-control': 'no-store' } });
}

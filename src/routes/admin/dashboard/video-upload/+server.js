import { json } from '@sveltejs/kit';
import { requireAdmin } from '#lib/server/adminAuth.js';
import {
	receiveVideoUpload,
	toPublicVideoUpload,
	VideoUploadError
} from '#lib/server/tempUploads.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, url }) {
	requireAdmin(cookies);

	// `use:enhance` sends SvelteKit's own CSRF header, but this endpoint receives
	// a raw streaming body, so verify the browser origin explicitly.
	const origin = request.headers.get('origin');
	if (origin && origin !== url.origin) {
		return json(
			{ message: 'Origine della richiesta non valida.' },
			{ status: 403, headers: { 'cache-control': 'no-store' } }
		);
	}

	try {
		const upload = await receiveVideoUpload(request);

		return json(toPublicVideoUpload(upload), {
			headers: { 'cache-control': 'no-store' }
		});
	} catch (error) {
		if (!(error instanceof VideoUploadError)) {
			console.error('[video-upload] Unexpected upload failure:', error);
		}

		const status = error instanceof VideoUploadError ? error.status : 500;
		const message =
			error instanceof Error ? error.message : 'Caricamento del video non riuscito.';

		return json({ message }, { status, headers: { 'cache-control': 'no-store' } });
	}
}

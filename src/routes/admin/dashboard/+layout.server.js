import { ensurePocketBaseSchema } from '#lib/server/pocketbase.js';
import { requireAdmin } from '#lib/server/adminAuth.js';

export const load = async ({ cookies, locals: { pb } }) => {
	requireAdmin(cookies);

	let pocketbaseAvailable = Boolean(pb);
	let pocketbaseMessage = '';

	if (pb) {
		try {
			await ensurePocketBaseSchema(pb);
		} catch (schemaError) {
			console.error('[PocketBase] schema bootstrap failed:', schemaError);
			pocketbaseAvailable = false;
			pocketbaseMessage =
				'PocketBase è raggiungibile, ma non è stato possibile preparare le collezioni predefinite.';
		}
	} else {
		pocketbaseMessage =
			'PocketBase non è raggiungibile. La dashboard e la conversione YouTube restano disponibili; Films e Foto richiedono PocketBase.';
	}

	return {
		title: 'MZEYFILMS - Admin - Dashboard',
		description: 'MZEFILMS Admin Dashboard. Manage your films, photos, and more.',
		index: false,
		pocketbaseAvailable,
		pocketbaseMessage
	};
};

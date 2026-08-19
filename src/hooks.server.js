import { getAuthenticatedPocketBase } from '$lib/server/pocketbase.js';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	try {
		event.locals.pb = await getAuthenticatedPocketBase();
	} catch (error) {
		event.locals.pb = null;
		console.error(' [PocketBase] unavailable - continuing without backend:', error?.message ?? error);
	}

	return resolve(event);
};

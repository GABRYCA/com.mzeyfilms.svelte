import {error, redirect} from "@sveltejs/kit";
import {ensurePocketBaseSchema} from '$lib/server/pocketbase.js';

export const load = async ({ cookies, locals: { pb } }) => {
    // Check if user found
    const sessionId = cookies.get('session_id');

    if (!(sessionId && global.sessions && global.sessions[sessionId])) {
        return redirect(303, '/admin/login')
    }

    if (!pb) {
        throw error(503, 'PocketBase is unavailable. Check its connection and superuser environment variables.');
    }

    try {
        await ensurePocketBaseSchema(pb);
    } catch (schemaError) {
        console.error('[PocketBase] schema bootstrap failed:', schemaError);
        throw error(503, 'PocketBase is connected but its default collections could not be created.');
    }

    return {
        title: 'MZEYFILMS - Admin - Dashboard',
        description: 'MZEFILMS Admin Dashboard. Manage your films, photos, and more.',
        index: false
    }
}

import * as db from '$lib/store/db';
import {deleteSession} from "$lib/store/db";
import {redirect} from "@sveltejs/kit";

export const load = async ({ cookies }) => {
    // Get user if found and return cookies, if not redirect to login
    const currentUser = await db.getUserById(cookies.get('session_id'));

    // Could be commented out if fixed redirecting issues in +page.svelte
    throw redirect(303, '/admin/login');

    if (!currentUser) {
        return {
            status: 404,
            body: {
                error: 'User not logged in, redirecting to login...'
            }
        };
    }

    deleteSession(currentUser.id);

    return {
        status: 200,
        body: {
            message: 'Successfully logged out! Redirecting to login...'
        }
    };
}

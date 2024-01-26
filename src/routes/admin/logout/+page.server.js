import * as db from '$lib/store/db';
import {deleteSession} from "$lib/store/db";
import {redirect} from "@sveltejs/kit";

export const load = async ({ cookies }) => {
    // Get user if found and return cookies, if not redirect to login
    const currentUser = await db.getUserById(cookies.get('session_id'));

    if (!currentUser) {
        return {
            status: 404,
            body: {
                error: 'User not logged in...'
            }
        };
    }

    deleteSession(currentUser.id);
    throw redirect(303, '/admin/login');

    /*return {
        status: 200,
        body: {
            message: 'Successfully logged out! Redirecting to login...'
        }
    };*/
}

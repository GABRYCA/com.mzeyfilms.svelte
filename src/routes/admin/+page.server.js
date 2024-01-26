import * as db from '$lib/store/db';
import {deleteSession} from "$lib/store/db";
import {redirect} from "@sveltejs/kit";

export const load = async ({ cookies }) => {
    // Check if user found
    const currentUser = await db.getUserById(cookies.get('session_id'));

    if (currentUser) {
        await redirect(303, '/admin/dashboard')
    } else {
        await redirect(303, '/admin/login')
    }
}
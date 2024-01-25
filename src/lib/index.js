// place files you want to import through the `$lib` alias in this folder.
// place files you want to import through the `$lib` alias in this folder.
import {getUserById} from "$lib/store/db.js";
import { redirect } from "@sveltejs/kit";

export async function redirectLogin(cookies) {
    const currentUser = await getUserById(cookies.get('session_id'));

    if (!currentUser) {
        throw redirect(303, '/admin/login');
    }
}

export async function redirectHome(cookies) {
    const currentUser = await getUserById(cookies.get('session_id'));

    if (currentUser) {
        throw redirect(303, '/');
    }
}

export async function redirectAdmin(cookies) {
    const currentUser = await getUserById(cookies.get('session_id'));

    if (currentUser) {
        throw redirect(303, '/admin/dashboard');
    }
}

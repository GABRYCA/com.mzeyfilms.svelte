import { login } from '$lib/server/login';
import { createSession } from '$lib/store/db';
import { dev } from "$app/environment";
import {redirectAdmin} from "$lib";

export const actions = {
    default: async ({ cookies, request }) => {

        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');
        const result = await login({username, password});

        if (result.status === 200) {
            let session = null;
            session = await createSession(username, password);

            if (session && session.id) {
                cookies.set('session_id', session.id, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: !dev,
                    maxAge: 60 * 60 * 24 * 7
                });

                // Send to /
                await redirectAdmin(cookies);
            } else {
                console.error('Cannot create/retrieve session');
            }
        }

        return result;
    }
}
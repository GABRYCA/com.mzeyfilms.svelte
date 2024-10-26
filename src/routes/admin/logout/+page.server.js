import {redirect} from "@sveltejs/kit";

export const load = async ({ cookies }) => {
    // Get user if found and return cookies, if not redirect to login
    const sessionId = cookies.get('session_id');

    if (sessionId && global.sessions && global.sessions[sessionId]) {
        // delete session
        delete global.sessions[sessionId];
    }

    cookies.set('session_id', '', {
        path: '/',
        expires: new Date(0),
    });

    return redirect(303, '/admin/login');
}

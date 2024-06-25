import {redirect} from "@sveltejs/kit";

export const load = async ({ cookies }) => {
    // Check if user found
    const sessionId = cookies.get('session_id');

    if (!(sessionId && global.sessions && global.sessions[sessionId])) {
        redirect(303, '/admin/login')
    }
}
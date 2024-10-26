import {redirect} from "@sveltejs/kit";

export const load = async ({ cookies }) => {
    // Check if user found
    const sessionId = cookies.get('session_id');

    if (!(sessionId && global.sessions && global.sessions[sessionId])) {
        return redirect(303, '/admin/login')
    }

    return {
        title: 'MZEYFILMS - Admin - Dashboard',
        description: 'MZEFILMS Admin Dashboard. Manage your videos, photos, and more.',
        index: false
    }
}
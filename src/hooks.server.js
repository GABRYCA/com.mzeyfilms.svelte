import { redirect } from '@sveltejs/kit';
import { getUserById } from '$lib/store/db';

const unProtectedRoutes = ['/','/admin/login', '/about', '/contacts', '/photos', '/videos'];
const adminProtectedRoutes = ['/admin']

export const handle = async ({ event, request, resolve }) => {
    const sessionId = event.cookies.get('session_id');
    const currentUser = await getUserById(sessionId);

    const isAuthenticated = currentUser && currentUser.id && !unProtectedRoutes.includes(event.url.pathname);

    if (isAuthenticated) {
        event.locals.user = {
            isAuthenticated: true,
            username: currentUser.username,
            id: currentUser.id
        };
    } else {
        event.locals.user = null;
    }

    if (!isAuthenticated && !unProtectedRoutes.includes(event.url.pathname)) {
        // Check if pathname includes a part of adminProtectedRoutes, if yes redirect to /admin/login, if not to /
        throw redirect(303, adminProtectedRoutes.some(route => event.url.pathname.includes(route)) ? '/admin/login' : '/');
    } else if (isAuthenticated && unProtectedRoutes.includes(event.url.pathname)) {
        throw redirect(303, '/');
    }

    return resolve(event);
};
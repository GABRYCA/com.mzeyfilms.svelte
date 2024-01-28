import { redirect } from '@sveltejs/kit';
import { getUserById } from '$lib/store/db';
import dirman from "fs";
import path from "path";

const unProtectedRoutes = ['/','/admin/login', '/about', '/contacts', '/photos', '/videos'];
const adminProtectedRoutes = ['/admin']

function missingFolders() {
    // Check if 'static' directory exists
    if (!dirman.existsSync('static')) {
        // If it doesn't exist, create it
        dirman.mkdirSync('static');
        // Write in console created folder
        console.log('Created folder: static');
        // With also path to the folder
        console.log(path.resolve('static/'));
    }

    if (!dirman.existsSync('static/videos')) {
        // If it doesn't exist, create it
        dirman.mkdirSync('static/videos');
        dirman.mkdirSync('static/videos/old');
        // Write in console created folder
        console.log('Created folder: static/videos');
        // With also path to the folder
        console.log(path.resolve('static/', 'videos'));
    }

    if (!dirman.existsSync('static/photos')) {
        // If it doesn't exist, create it
        dirman.mkdirSync('static/photos');
        dirman.mkdirSync('static/photos/old');
        // Write in console created folder
        console.log('Created folder: static/photos');
        // With also path to the folder
        console.log(path.resolve('static/', 'photos'));
    }
}

export const handle = async ({ event, request, resolve }) => {

    missingFolders();

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

    /*if (!isAuthenticated && !unProtectedRoutes.includes(event.url.pathname)) {
        // Check if pathname includes a part of adminProtectedRoutes, if yes redirect to /admin/login, if not to /
        console.log('Not authenticated! Current pathname: ', event.url.pathname)
        throw redirect(303, adminProtectedRoutes.some(route => event.url.pathname.includes(route)) ? '/admin/login' : '/');
    } else if (!isAuthenticated && unProtectedRoutes.includes(event.url.pathname)) {
        console.log('Not authenticated type 2! Current pathname: ', event.url.pathname)
        throw redirect(303, '/');
    }*/

    if (isAuthenticated) {
        console.log('Authenticated! Current pathname: ', event.url.pathname)
        return resolve(event);
    }

    // If user is not authenticated
    if (!isAuthenticated) {
        // Check if visiting an unprotected page, if he is, do nothing
        if (unProtectedRoutes.includes(event.url.pathname)) {
            return resolve(event);
        }
        // If visiting a subpage of /admin or /admin itself, it can be redirected to /admin/login
        if (adminProtectedRoutes.some(route => event.url.pathname.includes(route))) {
            console.log('Not authenticated, redirect to Login! Current pathname: ', event.url.pathname)
            throw redirect(303, '/admin/login');
        }
    }

    return resolve(event);
};
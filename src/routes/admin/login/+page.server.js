import {PRIVATE_LOGIN_USERNAME, PRIVATE_LOGIN_PASSWORD} from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from "@sveltejs/kit";

export const load = async ({cookies}) => {
    const sessionId = cookies.get('session_id');

    if (sessionId && global.sessions && global.sessions[sessionId]) {
        return redirect(303, '/admin/dashboard');
    }

    return {
        title: 'MZEYFILMS - Admin - Login',
        description: 'MZEFILMS Admin Login. Login to access the admin dashboard.',
        index: false
    }
}

export const actions = {
    login: async ({cookies, request}) => {

        const formData = Object.fromEntries(await request.formData());
        const username = formData.username;
        const password = formData.password;
        if (username !== PRIVATE_LOGIN_USERNAME || password !== PRIVATE_LOGIN_PASSWORD) {
            return {
                status: 401,
                body: {
                    message: 'Unauthorized'
                }
            }
        }

        const sessionId = uuidv4();
        cookies.set('session_id', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 // 1 day
        });

        // Store session info somewhere (in-memory store, database, etc.)
        // For simplicity, we will use a simple in-memory store (not suitable for production)
        global.sessions = global.sessions || {};
        global.sessions[sessionId] = { username };

        return {
            status: 200,
            body: {
                message: 'Login successful'
            }
        };
    }
}
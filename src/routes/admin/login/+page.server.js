import { fail, redirect } from '@sveltejs/kit';
import {
	createAdminSession,
	getAdminSession,
	verifyAdminCredentials
} from '#lib/server/adminAuth.js';

export const load = async ({ cookies }) => {
	if (getAdminSession(cookies)) {
		redirect(303, '/admin/dashboard');
	}

	return {
		title: 'MZEYFILMS - Admin - Login',
		description: 'MZEFILMS Admin Login. Login to access the admin dashboard.',
		index: false
	};
};

export const actions = {
	login: async ({ cookies, request, url }) => {
		const formData = await request.formData();
		const username = String(formData.get('username') ?? '');
		const password = String(formData.get('password') ?? '');

		if (!verifyAdminCredentials(username, password)) {
			return fail(401, {
				message: 'Credenziali non valide.',
				username
			});
		}

		// Preview and plain-HTTP local deployments must still receive the cookie.
		createAdminSession(cookies, username, url.protocol === 'https:');

		return { success: true };
	}
};

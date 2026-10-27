import { redirect } from '@sveltejs/kit';
import { getAdminSession } from '#lib/server/adminAuth.js';

export const load = async ({ cookies }) => {
	if (getAdminSession(cookies)) {
		redirect(303, '/admin/dashboard');
	}

	redirect(303, '/admin/login');
};

import { redirect } from '@sveltejs/kit';
import { destroyAdminSession } from '#lib/server/adminAuth.js';

export const load = async ({ cookies }) => {
	destroyAdminSession(cookies);
	redirect(303, '/admin/login');
};

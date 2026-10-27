import { randomUUID, timingSafeEqual } from 'node:crypto';
import { redirect } from '@sveltejs/kit';
import { PRIVATE_LOGIN_PASSWORD, PRIVATE_LOGIN_USERNAME } from '$app/env/private';

export const ADMIN_SESSION_COOKIE = 'session_id';

/** Keep admin sessions valid for one day, matching the cookie lifetime. */
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * @typedef {object} AdminSession
 * @property {string} username
 * @property {number} [expiresAt]
 */

/**
 * The site is a single long-running server, so an in-memory session store is
 * enough. `globalThis` keeps sessions alive across Vite HMR module reloads.
 *
 * @returns {Record<string, AdminSession>}
 */
function getSessionStore() {
	if (!globalThis.sessions || typeof globalThis.sessions !== 'object') {
		globalThis.sessions = {};
	}

	return globalThis.sessions;
}

/**
 * @param {string} left
 * @param {string} right
 */
function safeEqual(left, right) {
	const leftBuffer = Buffer.from(left);
	const rightBuffer = Buffer.from(right);

	if (leftBuffer.length !== rightBuffer.length) return false;

	return timingSafeEqual(leftBuffer, rightBuffer);
}

/**
 * Compare submitted credentials with the admin credentials from the
 * environment. Missing configuration always fails closed.
 *
 * @param {unknown} username
 * @param {unknown} password
 */
export function verifyAdminCredentials(username, password) {
	const configuredUsername = PRIVATE_LOGIN_USERNAME;
	const configuredPassword = PRIVATE_LOGIN_PASSWORD;

	if (!configuredUsername || !configuredPassword) return false;

	const usernameMatches = safeEqual(String(username ?? ''), configuredUsername);
	const passwordMatches = safeEqual(String(password ?? ''), configuredPassword);

	return usernameMatches && passwordMatches;
}

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @returns {{ id: string, username: string } | null}
 */
export function getAdminSession(cookies) {
	const sessionId = cookies.get(ADMIN_SESSION_COOKIE);
	if (!sessionId) return null;

	const sessions = getSessionStore();
	const session = sessions[sessionId];
	if (!session) return null;

	if (typeof session.expiresAt === 'number' && session.expiresAt <= Date.now()) {
		delete sessions[sessionId];
		return null;
	}

	return { id: sessionId, username: session.username };
}

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {string} username
 * @param {boolean} secure
 */
export function createAdminSession(cookies, username, secure) {
	const sessionId = randomUUID();

	getSessionStore()[sessionId] = {
		username,
		expiresAt: Date.now() + SESSION_TTL_MS
	};

	cookies.set(ADMIN_SESSION_COOKIE, sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure,
		maxAge: SESSION_TTL_MS / 1000
	});

	return sessionId;
}

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export function destroyAdminSession(cookies) {
	const sessionId = cookies.get(ADMIN_SESSION_COOKIE);

	if (sessionId) {
		delete getSessionStore()[sessionId];
	}

	cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
}

/**
 * Redirect unauthenticated visitors to the login page.
 *
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @returns {{ id: string, username: string }}
 */
export function requireAdmin(cookies) {
	const session = getAdminSession(cookies);

	if (!session) {
		redirect(303, '/admin/login');
	}

	return session;
}

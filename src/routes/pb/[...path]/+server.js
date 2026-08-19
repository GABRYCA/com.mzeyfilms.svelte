import { error } from '@sveltejs/kit';
import {
	getPocketBaseInternalUrl,
	isPocketBaseProxyEnabled
} from '$lib/server/pocketbase.js';

const HOP_BY_HOP_HEADERS = [
	'connection',
	'content-encoding',
	'content-length',
	'host',
	'keep-alive',
	'proxy-authenticate',
	'proxy-authorization',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade'
];

// PocketBase admin uses /_/ with a trailing slash. Keep the proxy path intact
// instead of letting SvelteKit redirect /pb/_/ to /pb/_.
export const trailingSlash = 'ignore';

/**
 * Rewrite PocketBase redirects so the browser stays inside the /pb proxy.
 * - /_/        -> /pb/_/
 * - /api/...   -> /pb/api/...
 * - http://internal:8090/... -> /pb/...
 * External URLs are left untouched.
 */
function rewriteLocation(location, internalUrl, requestUrl) {
	if (!location) return location;

	let locationUrl;
	try {
		locationUrl = new URL(location, requestUrl.origin);
	} catch {
		return location;
	}

	const internal = new URL(internalUrl);
	if (locationUrl.origin === internal.origin) {
		const path = locationUrl.pathname.startsWith('/') ? locationUrl.pathname : `/${locationUrl.pathname}`;
		return `/pb${path}${locationUrl.search}${locationUrl.hash}`;
	}

	// Root-relative redirect from the internal server (e.g. Location: /_/)
	if (location.startsWith('/')) {
		return `/pb${location}`;
	}

	return location;
}

async function proxy({ params, request, url, fetch }) {
	if (!isPocketBaseProxyEnabled()) {
		throw error(404, 'PocketBase proxy is disabled.');
	}

	const internalUrl = getPocketBaseInternalUrl();
	const target = new URL(`${internalUrl}/${params.path}`);
	target.search = url.search;

	const requestHeaders = new Headers(request.headers);
	for (const header of HOP_BY_HOP_HEADERS) requestHeaders.delete(header);

	const init = {
		method: request.method,
		headers: requestHeaders,
		redirect: 'manual'
	};
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		init.body = await request.arrayBuffer();
	}

	const response = await fetch(target, init);
	const responseHeaders = new Headers(response.headers);
	for (const header of HOP_BY_HOP_HEADERS) responseHeaders.delete(header);

	const location = responseHeaders.get('location');
	if (location) {
		responseHeaders.set('location', rewriteLocation(location, internalUrl, url));
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders
	});
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

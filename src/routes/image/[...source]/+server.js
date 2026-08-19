import { error, redirect } from '@sveltejs/kit';
import { getImageProxyInternalUrl, getImageProxyLocalOrigin } from '$lib/server/imageProxy.js';

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

function getSourceUrl(source, requestUrl) {
	try {
		const url = new URL(source, requestUrl.origin);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') {
			throw new Error('Unsupported protocol');
		}
		return url;
	} catch {
		throw error(400, 'The image source must be an HTTP(S) URL.');
	}
}

async function transform({ params, request, url, fetch }) {
	const source = getSourceUrl(params.source, url);
	const imageProxyUrl = getImageProxyInternalUrl();

	// Image optimization is deliberately optional outside compose.yml. Falling
	// back to the original image keeps a frontend-only deployment functional.
	if (!imageProxyUrl) {
		throw redirect(302, source.href);
	}

	let transformerSource = source;
	const localOrigin = getImageProxyLocalOrigin();
	if (localOrigin && source.origin === url.origin) {
		transformerSource = new URL(`${source.pathname}${source.search}`, `${localOrigin}/`);
	}

	const target = new URL(`${imageProxyUrl}/image/${transformerSource.href}`);
	target.search = url.search;

	const headers = new Headers(request.headers);
	for (const header of HOP_BY_HOP_HEADERS) headers.delete(header);

	let response;
	try {
		response = await fetch(target, {
			method: request.method,
			headers,
			redirect: 'manual',
			signal: AbortSignal.timeout(5000)
		});
	} catch (proxyError) {
		console.error('[image proxy] transformation service is unavailable:', proxyError);
		throw redirect(302, source.href);
	}

	const responseHeaders = new Headers(response.headers);
	for (const header of HOP_BY_HOP_HEADERS) responseHeaders.delete(header);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders
	});
}

export const GET = transform;
export const HEAD = transform;

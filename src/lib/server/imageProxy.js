import { env } from '$env/dynamic/private';

function withoutTrailingSlash(value) {
	return String(value || '').trim().replace(/\/+$/, '');
}

/**
 * The Coolify image service's API URL as seen by the SvelteKit server.
 * compose.yml supplies this for the integrated deployment. Leaving it empty
 * makes the /image route redirect to the original file without transforming it.
 */
export function getImageProxyInternalUrl() {
	return withoutTrailingSlash(env.IMAGE_PROXY_INTERNAL_URL);
}

/**
 * Inside Docker Compose this avoids making a round trip through Cloudflare
 * when the source is this website's own /pb/ file URL.
 */
export function getImageProxyLocalOrigin() {
	return withoutTrailingSlash(env.IMAGE_PROXY_LOCAL_ORIGIN);
}

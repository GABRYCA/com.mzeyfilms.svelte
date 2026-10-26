import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * Optional variables are read at runtime and trimmed. Returning `undefined`
 * keeps them optional, so builds do not require production secrets.
 *
 * @param {string | undefined} value
 */
const optional = (value) => value?.trim() || undefined;

export const variables = defineEnvVars({
	PRIVATE_LOGIN_USERNAME: {
		description: 'Username for the site admin area.',
		schema: optional
	},
	PRIVATE_LOGIN_PASSWORD: {
		description: 'Password for the site admin area.',
		schema: optional
	},
	PRIVATE_POCKETBASE_EMAIL: {
		description: 'PocketBase superuser email used by the server.',
		schema: optional
	},
	PRIVATE_POCKETBASE_PASSWORD: {
		description: 'PocketBase superuser password used by the server.',
		schema: optional
	},
	POCKETBASE_EMBEDDED: {
		description: 'Set to "true" when PocketBase runs in the same container.',
		schema: optional
	},
	POCKETBASE_INTERNAL_URL: {
		description: 'PocketBase URL used for server-to-server requests.',
		schema: optional
	},
	PB_INTERNAL_URL: {
		description: 'Legacy alias for POCKETBASE_INTERNAL_URL.',
		schema: optional
	},
	POCKETBASE_PROXY_ENABLED: {
		description: 'Set to "false" to disable the /pb reverse proxy.',
		schema: optional
	},
	IMAGE_PROXY_INTERNAL_URL: {
		description: 'Private URL of the image transformation service.',
		schema: optional
	},
	IMAGE_PROXY_LOCAL_ORIGIN: {
		description: 'Internal origin used to fetch local PocketBase files.',
		schema: optional
	},
	YTDLP_COOKIES_FILE: {
		description: 'Path to a Netscape cookies.txt file for yt-dlp.',
		schema: optional
	},
	YTDLP_COOKIES: {
		description: 'Raw Netscape cookies.txt content for yt-dlp.',
		schema: optional
	},
	YTDLP_PROXY: {
		description: 'Optional HTTP or SOCKS proxy for yt-dlp.',
		schema: optional
	},
	YTDLP_EXTRA_ARGS: {
		description: 'Additional space-separated arguments passed to yt-dlp.',
		schema: optional
	},
	PUBLIC_POCKETBASE_URL: {
		public: true,
		description: 'Browser-visible PocketBase URL, for example /pb.',
		schema: optional
	},
	PUBLIC_POCKETBASE_URL_IMG_API: {
		public: true,
		description: 'Legacy browser-visible PocketBase file API URL.',
		schema: optional
	},
	PUBLIC_IMAGE_PROXY_URL: {
		public: true,
		description: 'Legacy browser-direct image transformer endpoint.',
		schema: optional
	}
});

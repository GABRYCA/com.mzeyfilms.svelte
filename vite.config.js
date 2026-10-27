import adapter from '@sveltejs/adapter-bun';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

let loggedOrigin = false;

/**
 * `paths.origin` must be a bare origin (no path or trailing slash). When it is
 * unset SvelteKit derives the origin from each request, which is what local
 * preview needs. Production builds pass ORIGIN as a Docker build argument.
 *
 * @param {string | undefined} value
 */
function normalizeOrigin(value) {
	const trimmed = value?.trim();
	if (!trimmed) return undefined;

	try {
		const url = new URL(trimmed);

		if (
			(url.protocol !== 'http:' && url.protocol !== 'https:') ||
			url.pathname !== '/' ||
			url.search ||
			url.hash
		) {
			throw new Error('not a bare http(s) origin');
		}

		return url.origin;
	} catch {
		throw new Error(
			`Invalid ORIGIN "${trimmed}". Use a bare absolute URL such as https://example.com.`
		);
	}
}

export default defineConfig(({ command, mode }) => {
	// Vite does not copy .env values into process.env, so read them explicitly.
	// loadEnv also includes process.env, which keeps Docker build arguments
	// authoritative over values from local env files.
	const env = loadEnv(mode, process.cwd(), 'ORIGIN');
	const origin = normalizeOrigin(env.ORIGIN);

	if (
		command === 'build' &&
		process.env.npm_lifecycle_event === 'build' &&
		!loggedOrigin
	) {
		loggedOrigin = true;
		console.log(`[build] paths.origin = ${origin ?? '(derived from each request)'}`);
	}

	return {
		plugins: [
			enhancedImages(),
			sveltekit({
				adapter: adapter({
					precompress: true
				}),
				compilerOptions: {
					experimental: {
						async: true
					}
				},
				experimental: {
					remoteFunctions: true
				},
				paths: {
					origin
				}
			})
		],
		build: {
			rollupOptions: {
				checks: {
					pluginTimings: false
				}
			}
		},
		ssr: {
			noExternal: ['super-sitemap']
		}
	};
});

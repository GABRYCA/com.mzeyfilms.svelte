import adapter from '@sveltejs/adapter-bun';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const origin = process.env.ORIGIN || 'https://mzeyfilms.com';

export default defineConfig({
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
});

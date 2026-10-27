import { spawn } from 'node:child_process';
import { rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vite = join(root, 'node_modules', 'vite', 'bin', 'vite.js');

// A stale SvelteKit server bundle can keep the previous paths.origin after
// ORIGIN changes. Always build from a clean output directory.
for (const dir of ['.svelte-kit', 'build']) {
	rmSync(join(root, dir), { recursive: true, force: true });
}

const child = spawn(process.execPath, [vite, 'build', ...process.argv.slice(2)], {
	cwd: root,
	env: process.env,
	stdio: 'inherit'
});

child.on('error', (error) => {
	console.error(error);
	process.exit(1);
});

child.on('exit', (code) => {
	process.exit(code ?? 1);
});

import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { requireAdmin } from '#lib/server/adminAuth.js';
import { getConversionFile } from '#lib/server/conversionJobs.js';

/** @type {Record<string, string>} */
const VARIANTS = {
	high: 'hd',
	low: 'sd'
};

export async function GET({ cookies, params, url }) {
	requireAdmin(cookies);

	if (!(params.variant in VARIANTS)) {
		error(404, 'Variante non valida.');
	}

	const inline = url.searchParams.get('inline') === '1';

	const file = await getConversionFile(params.id, params.variant);

	if (!file) {
		error(404, 'File non trovato o conversione non ancora completata.');
	}

	let data;
	try {
		data = await readFile(file.path);
	} catch {
		error(404, 'Il file non è più disponibile. La conversione potrebbe essere scaduta.');
	}

	return new Response(data, {
		headers: {
			'content-type': 'image/avif',
			'content-length': String(data.byteLength),
			'content-disposition': `${inline ? 'inline' : 'attachment'}; filename="${file.name}"`,
			'cache-control': 'private, no-store'
		}
	});
}

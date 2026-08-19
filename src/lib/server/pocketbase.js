import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const EMBEDDED_DEFAULT_URL = 'http://127.0.0.1:8090';

let client;
let clientUrl;
let authenticationPromise;
let schemaPromise;

function withoutTrailingSlash(value) {
	return String(value || '').trim().replace(/\/+$/, '');
}

function requiredEnv(name) {
	const value = String(env[name] || '').trim();
	if (!value) {
		throw new Error(`${name} must be set to manage PocketBase from the admin dashboard.`);
	}
	return value;
}

function isPocketBaseEmbedded() {
	// The combined Docker image explicitly sets this to true. Keeping local
	// development opt-in makes a separately started PocketBase convenient.
	return env.POCKETBASE_EMBEDDED === 'true';
}

/** The address used by SvelteKit on the server. */
export function getPocketBaseInternalUrl() {
	return withoutTrailingSlash(
		env.POCKETBASE_INTERNAL_URL ||
			env.PB_INTERNAL_URL ||
			(isPocketBaseEmbedded() ? EMBEDDED_DEFAULT_URL : publicEnv.PUBLIC_POCKETBASE_URL || EMBEDDED_DEFAULT_URL)
	);
}

/** The address browsers use for PocketBase files. */
export function getPocketBasePublicUrl() {
	return withoutTrailingSlash(
		isPocketBaseEmbedded() ? '/pb' : publicEnv.PUBLIC_POCKETBASE_URL || getPocketBaseInternalUrl()
	);
}

export function getPocketBasePublicFilesUrl() {
	const configuredLegacyUrl = isPocketBaseEmbedded()
		? ''
		: withoutTrailingSlash(publicEnv.PUBLIC_POCKETBASE_URL_IMG_API);
	return configuredLegacyUrl
		? `${configuredLegacyUrl}/`
		: `${getPocketBasePublicUrl()}/api/files/`;
}

export function isPocketBaseProxyEnabled() {
	return env.POCKETBASE_PROXY_ENABLED !== 'false';
}

function getClient() {
	const url = getPocketBaseInternalUrl();
	if (!url) {
		throw new Error('Set POCKETBASE_INTERNAL_URL (or PUBLIC_POCKETBASE_URL) to the PocketBase server URL.');
	}

	if (!client || clientUrl !== url) {
		client = new PocketBase(url);
		// Prevent identical SDK requests from different web requests cancelling one another.
		client.autoCancellation(false);
		clientUrl = url;
		authenticationPromise = undefined;
		schemaPromise = undefined;
	}

	return client;
}

async function authenticate(pb) {
	if (!pb.authStore.isValid) {
		if (!authenticationPromise) {
			const email = requiredEnv('PRIVATE_POCKETBASE_EMAIL');
			const password = requiredEnv('PRIVATE_POCKETBASE_PASSWORD');
			authenticationPromise = pb
				.collection('_superusers')
				.authWithPassword(email, password)
				.catch((error) => {
					authenticationPromise = undefined;
					throw error;
				});
		}

		await authenticationPromise;
	}

	// Ensure the default collections exist on a fresh/restored volume. This used
	// to happen only on the admin dashboard, which made the first public page
	// requests fail with "Missing collection context" before the admin was opened.
	await ensurePocketBaseSchema(pb);
	return pb;
}

/**
 * Returns an authenticated, server-only client. A failed startup attempt is
 * never cached so a just-starting embedded/remote PocketBase can recover.
 */
export async function getAuthenticatedPocketBase() {
	return authenticate(getClient());
}

function systemDateFields() {
	return [
		{
			hidden: false,
			id: 'autodate2990389176',
			name: 'created',
			onCreate: true,
			onUpdate: false,
			presentable: false,
			system: true,
			type: 'autodate'
		},
		{
			hidden: false,
			id: 'autodate3332085495',
			name: 'updated',
			onCreate: true,
			onUpdate: true,
			presentable: false,
			system: true,
			type: 'autodate'
		}
	];
}

function baseCollection(name, fields, indexes = []) {
	return {
		name,
		type: 'base',
		listRule: '',
		viewRule: '',
		createRule: null,
		updateRule: null,
		deleteRule: null,
		fields: [...systemDateFields(), ...fields],
		indexes
	};
}

/**
 * PocketBase 0.25+ does not add created/updated to collections created through
 * the API unless the autodate system fields are part of the schema. Old volumes
 * created by earlier versions of this app lack them, which makes `sort=-created`
 * fail with HTTP 400. Add them idempotently when missing.
 */
async function ensureSystemDateFields(pb, collection) {
	const fieldNames = new Set(collection.fields.map((field) => field.name));
	if (fieldNames.has('created') && fieldNames.has('updated')) return collection;

	const fields = [...collection.fields];
	const dateFields = systemDateFields();
	for (const dateField of dateFields) {
		if (!fieldNames.has(dateField.name)) {
			fields.push(dateField);
		}
	}

	return pb.collections.update(collection.id, { fields });
}

function textField(name, { required = false, max = 0 } = {}) {
	return { name, type: 'text', required, min: 0, max, pattern: '' };
}

function fileField(name, { required = false, mimeTypes } = {}) {
	return {
		name,
		type: 'file',
		required,
		maxSelect: 1,
		maxSize: 20 * 1024 * 1024,
		mimeTypes,
		thumbs: [],
		protected: false
	};
}

async function findCollection(pb, name) {
	try {
		return await pb.collections.getOne(name);
	} catch (error) {
		if (error?.status === 404) return null;
		throw error;
	}
}

async function createCollectionIfMissing(pb, definition) {
	const existing = await findCollection(pb, definition.name);
	if (existing) return existing;

	try {
		return await pb.collections.create(definition);
	} catch (error) {
		// A simultaneous first dashboard visit may have created it already.
		const createdByAnotherRequest = await findCollection(pb, definition.name);
		if (createdByAnotherRequest) return createdByAnotherRequest;
		throw error;
	}
}

async function createDefaultSchema(pb) {
	const folders = await createCollectionIfMissing(
		pb,
		baseCollection(
			'folders',
			[textField('name', { required: true, max: 255 })],
			['CREATE UNIQUE INDEX idx_folders_name ON folders (name)']
		)
	);
	await ensureSystemDateFields(pb, folders);

	const images = await createCollectionIfMissing(
		pb,
		baseCollection('images', [
			fileField('image', {
				required: true,
				mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
			}),
			{
				name: 'folder',
				type: 'relation',
				required: true,
				collectionId: folders.id,
				cascadeDelete: true,
				minSelect: 0,
				maxSelect: 1
			},
			textField('url', { max: 2048 })
		])
	);
	await ensureSystemDateFields(pb, images);

	const videos = await createCollectionIfMissing(
		pb,
		baseCollection('videos', [
			textField('name', { required: true, max: 255 }),
			textField('url', { required: true, max: 2048 }),
			textField('description', { max: 4096 }),
			{ name: 'credits', type: 'json', required: false, maxSize: 2 * 1024 * 1024 },
			fileField('animatedhighres', {
				mimeTypes: ['image/gif', 'image/webp', 'image/avif']
			}),
			fileField('animatedlowres', {
				mimeTypes: ['image/gif', 'image/webp', 'image/avif']
			})
		])
	);
	await ensureSystemDateFields(pb, videos);
}

/**
 * Creates only missing collections. Existing collections and records are
 * intentionally never changed, so running this on every dashboard visit is safe.
 */
export async function ensurePocketBaseSchema(pb) {
	if (!schemaPromise) {
		schemaPromise = createDefaultSchema(pb).catch((error) => {
			schemaPromise = undefined;
			throw error;
		});
	}

	return schemaPromise;
}

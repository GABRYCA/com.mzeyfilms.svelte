import { fail } from '@sveltejs/kit';
import {
	DEFAULT_PREVIEW_START_SECONDS,
	hasUploadedFile,
	isYoutubeUrl,
	parsePreviewStartSeconds,
	schedulePreviewGeneration
} from '#lib/server/youtubePreview.js';
import {
	claimVideoUpload,
	removeVideoUpload,
	MAX_VIDEO_UPLOAD_BYTES
} from '#lib/server/tempUploads.js';
import { getPocketBasePublicFilesUrl } from '#lib/server/pocketbase.js';

const OFFLINE_MESSAGE =
	'PocketBase non è disponibile. Riprova quando il backend è online: la conversione video resta utilizzabile.';

export async function load({ locals: { pb } }) {
	const filesUrl = getPocketBasePublicFilesUrl();

	if (!pb) {
		return {
			videos: [],
			pocketbaseAvailable: false,
			maxUploadBytes: MAX_VIDEO_UPLOAD_BYTES,
			title: 'MZEYFILMS - Admin - Videos',
			description: 'MZEFILMS Admin Videos. Manage your films.',
			index: false
		};
	}

	const videos = await pb.collection('videos').getFullList({
		sort: '-created'
	});

	const videosWithUrls = videos.map((video) => ({
		...video,
		animatedhighresUrl: video.animatedhighres
			? `${filesUrl}${video.collectionId}/${video.id}/${video.animatedhighres}`
			: '',
		animatedlowresUrl: video.animatedlowres
			? `${filesUrl}${video.collectionId}/${video.id}/${video.animatedlowres}`
			: '',
		credits: video.credits || []
	}));

	return {
		videos: videosWithUrls,
		pocketbaseAvailable: true,
		maxUploadBytes: MAX_VIDEO_UPLOAD_BYTES,
		title: 'MZEYFILMS - Admin - Videos',
		description: 'MZEFILMS Admin Videos. Manage your films.',
		index: false
	};
}

/**
 * @param {FormData} formData
 */
function stripEmptyPreviewFields(formData) {
	const highres = formData.get('animatedhighres');
	if (!hasUploadedFile(highres)) {
		formData.delete('animatedhighres');
	}

	const lowres = formData.get('animatedlowres');
	if (!hasUploadedFile(lowres)) {
		formData.delete('animatedlowres');
	}
}

/**
 * @param {FormData} formData
 */
function claimFormUpload(formData) {
	const uploadId = String(formData.get('videoUploadId') ?? '').trim();
	formData.delete('videoUploadId');

	return { uploadId, upload: uploadId ? claimVideoUpload(uploadId) : null };
}

export const actions = {
	upload: async ({ request, locals: { pb } }) => {
		if (!pb) return fail(503, { message: OFFLINE_MESSAGE });

		const formData = await request.formData();

		const name = formData.get('name');
		const url = String(formData.get('url') || '');
		const { upload: sourceUpload } = claimFormUpload(formData);

		const existing = await pb.collection('videos').getFullList({
			filter: `name = "${name}"`
		});

		if (existing && existing.length > 0) {
			if (sourceUpload) await removeVideoUpload(sourceUpload);
			return fail(409, { message: 'Video already exists' });
		}

		const highresFile = formData.get('animatedhighres');
		const lowresFile = formData.get('animatedlowres');
		const hasHigh = hasUploadedFile(highresFile);
		const hasLow = hasUploadedFile(lowresFile);
		const startSeconds = parsePreviewStartSeconds(formData.get('previewStart'));

		// Not a PocketBase field — only used for preview generation.
		formData.delete('previewStart');

		stripEmptyPreviewFields(formData);

		if (!formData.has('credits')) {
			formData.append('credits', '[]');
		}

		let record;
		try {
			record = await pb.collection('videos').create(formData);
		} catch (err) {
			console.error('Upload error:', err);
			if (sourceUpload) await removeVideoUpload(sourceUpload);
			return fail(500, {
				message: err.message || 'Error occurred during creation'
			});
		}

		const needsHigh = !hasHigh;
		const needsLow = !hasLow;
		const canAutoGenerate =
			(sourceUpload || isYoutubeUrl(url)) && (needsHigh || needsLow);

		if (canAutoGenerate) {
			// Create returns immediately; heavy ffmpeg/yt-dlp work runs in the
			// background so reverse-proxy timeouts don't kill the admin form submit.
			schedulePreviewGeneration({
				pb,
				videoId: record.id,
				youtubeUrl: url,
				needsHigh,
				needsLow,
				existingHighres: hasHigh && highresFile instanceof File ? highresFile : null,
				sourceUpload,
				startSeconds
			});
		} else if (sourceUpload) {
			await removeVideoUpload(sourceUpload);
		}

		return {
			message: canAutoGenerate
				? 'Video added. Animated previews are generating in the background.'
				: 'Video added successfully',
			generatingPreviews: canAutoGenerate
		};
	},

	update: async ({ request, locals: { pb } }) => {
		if (!pb) return fail(503, { message: OFFLINE_MESSAGE });

		const formData = await request.formData();

		const id = formData.get('id');
		formData.delete('id');

		stripEmptyPreviewFields(formData);

		if (formData.get('deleteHighres') === 'true') {
			formData.set('animatedhighres', '');
		}
		formData.delete('deleteHighres');

		if (formData.get('deleteLowres') === 'true') {
			formData.set('animatedlowres', '');
		}
		formData.delete('deleteLowres');

		try {
			await pb.collection('videos').update(id, formData);
			return { message: 'Video updated successfully' };
		} catch (err) {
			console.error('Update error:', err);
			return fail(500, { message: err.message || 'Error updating video' });
		}
	},

	/**
	 * Manually (re)generate animated previews for an existing video.
	 * Runs in background to avoid reverse-proxy timeouts (AVIF encode is slow).
	 */
	generatePreviews: async ({ request, locals: { pb } }) => {
		if (!pb) return fail(503, { message: OFFLINE_MESSAGE });

		const formData = await request.formData();
		const id = String(formData.get('id') || '');
		const { upload: sourceUpload } = claimFormUpload(formData);

		if (!id) {
			if (sourceUpload) await removeVideoUpload(sourceUpload);
			return fail(400, { message: 'Missing video id' });
		}

		try {
			const video = await pb.collection('videos').getOne(id);
			const url = String(video.url || '');

			if (!sourceUpload && !isYoutubeUrl(url)) {
				return fail(400, {
					message: 'Video does not have a valid YouTube URL'
				});
			}

			const force = formData.get('force') === 'true';
			const startSeconds = parsePreviewStartSeconds(
				formData.get('previewStart') ?? DEFAULT_PREVIEW_START_SECONDS
			);
			const needsHigh = force || !video.animatedhighres;
			const needsLow = force || !video.animatedlowres;

			if (!needsHigh && !needsLow) {
				if (sourceUpload) await removeVideoUpload(sourceUpload);
				return {
					message: 'Previews already present',
					generatingPreviews: false
				};
			}

			/** @type {File | null} */
			let existingHighres = null;
			// When only SD is missing (and not forced), downscale the HD already
			// stored in PocketBase — unless a local source video was provided, in
			// which case encoding SD from the original is better.
			if (!sourceUpload && !needsHigh && needsLow && video.animatedhighres) {
				try {
					const fileUrl = pb.files.getURL(video, video.animatedhighres);
					const res = await fetch(fileUrl);
					if (res.ok) {
						const buf = Buffer.from(await res.arrayBuffer());
						existingHighres = new File([buf], video.animatedhighres, {
							type: 'image/avif'
						});
					}
				} catch (err) {
					console.warn('[generatePreviews] Could not fetch existing HD preview:', err);
				}
			}

			schedulePreviewGeneration({
				pb,
				videoId: id,
				youtubeUrl: url,
				needsHigh,
				needsLow,
				existingHighres,
				sourceUpload,
				startSeconds
			});

			return {
				message: 'Preview generation started in the background',
				generatingPreviews: true
			};
		} catch (err) {
			if (sourceUpload) await removeVideoUpload(sourceUpload);
			console.error('Generate previews error:', err);
			return fail(500, { message: err.message || 'Error generating previews' });
		}
	},

	delete: async ({ request, locals: { pb } }) => {
		if (!pb) return fail(503, { message: OFFLINE_MESSAGE });

		const formData = await request.formData();
		const id = formData.get('id');

		try {
			await pb.collection('videos').delete(id);
			return { message: 'Video deleted successfully' };
		} catch (err) {
			console.error('Delete error:', err);
			return fail(400, { message: 'Unable to delete video' });
		}
	}
};

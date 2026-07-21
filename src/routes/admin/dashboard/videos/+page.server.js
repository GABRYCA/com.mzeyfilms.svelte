import {
	DEFAULT_PREVIEW_START_SECONDS,
	hasUploadedFile,
	isYoutubeUrl,
	parsePreviewStartSeconds,
	schedulePreviewGeneration
} from '$lib/server/youtubePreview.js';

export async function load({ locals: { pb } }) {
	const videos = await pb.collection('videos').getFullList({
		sort: '-created'
	});

	const videosWithUrls = videos.map((video) => ({
		...video,
		animatedhighresUrl: video.animatedhighres
			? `${pb.baseUrl}/api/files/${video.collectionId}/${video.id}/${video.animatedhighres}`
			: '',
		animatedlowresUrl: video.animatedlowres
			? `${pb.baseUrl}/api/files/${video.collectionId}/${video.id}/${video.animatedlowres}`
			: '',
		credits: video.credits || []
	}));

	return {
		videos: videosWithUrls,
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

export const actions = {
	upload: async ({ request, locals: { pb } }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		const url = String(formData.get('url') || '');

		const existing = await pb.collection('videos').getFullList({
			filter: `name = "${name}"`
		});

		if (existing && existing.length > 0) {
			return {
				status: 400,
				body: { message: 'Video already exists' }
			};
		}

		const highresFile = formData.get('animatedhighres');
		const lowresFile = formData.get('animatedlowres');
		const hasHigh = hasUploadedFile(highresFile);
		const hasLow = hasUploadedFile(lowresFile);
		const startSeconds = parsePreviewStartSeconds(formData.get('previewStart'));

		// Not a PocketBase field — only used for auto AVIF generation
		formData.delete('previewStart');

		stripEmptyPreviewFields(formData);

		if (!formData.has('credits')) {
			formData.append('credits', '[]');
		}

		try {
			const record = await pb.collection('videos').create(formData);

			const needsHigh = !hasHigh;
			const needsLow = !hasLow;
			const canAutoGenerate = isYoutubeUrl(url) && (needsHigh || needsLow);

			if (canAutoGenerate) {
				// Create returns immediately; heavy yt-dlp + AVIF encode runs in background
				// so reverse-proxy timeouts don't kill the admin form submit.
				schedulePreviewGeneration({
					pb,
					videoId: record.id,
					youtubeUrl: url,
					needsHigh,
					needsLow,
					existingHighres: hasHigh && highresFile instanceof File ? highresFile : null,
					startSeconds
				});
			}

			return {
				status: 200,
				body: {
					message: canAutoGenerate
						? 'Video added. Animated previews are generating in the background.'
						: 'Video added successfully',
					generatingPreviews: canAutoGenerate
				}
			};
		} catch (err) {
			console.error('Upload error:', err);
			return {
				status: 500,
				body: { message: err.message || 'Error occurred during creation' }
			};
		}
	},

	update: async ({ request, locals: { pb } }) => {
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
			return {
				status: 200,
				body: { message: 'Video updated successfully' }
			};
		} catch (err) {
			console.error('Update error:', err);
			return {
				status: 500,
				body: { message: err.message || 'Error updating video' }
			};
		}
	},

	/**
	 * Manually (re)generate animated previews for an existing video.
	 * Runs in background to avoid reverse-proxy timeouts (AVIF encode is slow).
	 */
	generatePreviews: async ({ request, locals: { pb } }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') || '');

		if (!id) {
			return {
				status: 400,
				body: { message: 'Missing video id' }
			};
		}

		try {
			const video = await pb.collection('videos').getOne(id);
			const url = String(video.url || '');

			if (!isYoutubeUrl(url)) {
				return {
					status: 400,
					body: { message: 'Video does not have a valid YouTube URL' }
				};
			}

			const force = formData.get('force') === 'true';
			const startSeconds = parsePreviewStartSeconds(
				formData.get('previewStart') ?? DEFAULT_PREVIEW_START_SECONDS
			);
			const needsHigh = force || !video.animatedhighres;
			const needsLow = force || !video.animatedlowres;

			if (!needsHigh && !needsLow) {
				return {
					status: 200,
					body: { message: 'Previews already present', generatingPreviews: false }
				};
			}

			/** @type {File | null} */
			let existingHighres = null;
			// When only SD is missing (and not force), downscale the HD already stored in PocketBase
			if (!needsHigh && needsLow && video.animatedhighres) {
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
				startSeconds
			});

			return {
				status: 200,
				body: {
					message: 'Preview generation started in the background',
					generatingPreviews: true
				}
			};
		} catch (err) {
			console.error('Generate previews error:', err);
			return {
				status: 500,
				body: { message: err.message || 'Error generating previews' }
			};
		}
	},

	delete: async ({ request, locals: { pb } }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		try {
			await pb.collection('videos').delete(id);
			return {
				status: 200,
				body: { message: 'Video deleted successfully' }
			};
		} catch (err) {
			console.error('Delete error:', err);
			return {
				status: 400,
				body: { message: 'Unable to delete video' }
			};
		}
	}
};

const pageSize = 2

export async function fetchVideos(page, pb, pageSize= 2) {
    if (!pb) {
        return pageSize <= 0 ? [] : { items: [], page: 1, perPage: pageSize, totalItems: 0, totalPages: 0 };
    }

    if (pageSize <= 0) {
        // Get whole list
        return await pb.collection('videos').getFullList({
            sort: '-created',
        });
    }

    return await pb.collection('videos').getList(page, pageSize, {
        sort: '-created',
    });
}

/**
 * Extracts a YouTube video ID from common URL shapes.
 * Supports watch?v=, youtu.be/, embed/, v/, shorts/, etc.
 * @param {string} url
 * @returns {string}
 */
export function getYoutubeId(url) {
    if (!url) return '';
    const value = String(url).trim();
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = value.match(regExp);
    if (match && match[1]?.length === 11) return match[1];
    const last = value.split('/').pop()?.split('?')[0] || '';
    return last.length === 11 ? last : '';
}
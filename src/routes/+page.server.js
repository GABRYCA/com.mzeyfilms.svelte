import {fetchVideos} from "$lib/utils/utils.js";

export async function load({ locals: { pb }}) {

    const videos = await fetchVideos(1, pb, 0);

    return {
        videos: videos,
        title: 'MZEYFILMS - Official',
    }
}
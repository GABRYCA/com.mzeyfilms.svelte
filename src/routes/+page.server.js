import {fetchVideos} from "$lib/utils/utils.js";
import {getPocketBasePublicFilesUrl} from '$lib/server/pocketbase.js';

export async function load({ locals: { pb }}) {

    const videos = await fetchVideos(1, pb, 0);

    return {
        videos: videos,
        pocketBaseFilesUrl: getPocketBasePublicFilesUrl(),
        title: 'MZEYFILMS - Official',
    }
}

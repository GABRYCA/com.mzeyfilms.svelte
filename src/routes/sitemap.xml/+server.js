import * as sitemap from 'super-sitemap/sveltekit'
import {fetchVideos} from "$lib/utils/utils.js";
import {createSlug} from "$lib/utils/slugify.js";

export const prerender = true;

export const GET = async ({locals: {pb}}) => {

    const videoParams = (await fetchVideos(1, pb, 0))?.map(video =>
        `${createSlug(video.name)}-${video.id}`
    ) ?? [];

    return await sitemap.response({
        origin: 'https://mzeyfilms.com',
        paramValues: {
            '/film/[film]': videoParams,
        },
        excludeRoutePatterns: [
            /^\/admin.*/,
            /^\/about$/,
            /^\/photos$/,
        ],
    });
};
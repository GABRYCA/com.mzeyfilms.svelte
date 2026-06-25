import * as sitemap from 'super-sitemap/sveltekit'
export const prerender = true;

export const GET = async () => {
    return await sitemap.response({
        origin: 'https://mzeyfilms.com',
        excludeRoutePatterns: [
            /^\/admin.*/,
            /^\/about$/,
            /^\/photos$/,
            /^\/film.*/, //TODO Add ParamValues to actually do this
        ],
    });
};
import {PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD} from '$env/static/private';
import {PUBLIC_POCKETBASE_URL} from '$env/static/public';
import PocketBase from "pocketbase";

const pageSize = 2;

async function fetchVideos(page, pb) {
    return await pb.collection('videos').getList(page, pageSize, {
        sort: '+created',
    });
}

export async function load() {

    const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
    await pb.admins.authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);

    //const videos = await pb.collection('videos').getFullList();
    const videos = await fetchVideos(1, pb);

    return {
        videos: videos.items,
        title: 'MZEYFILMS - Videos',
        description: 'MZEFILMS Videos. Watch my latest featured videos.',
    }
}

export const actions = {
    videos: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());
        const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);

        const page = formData.page;

        if (page === null || isNaN(page) || page === 0) {
            return {
                status: 400,
                body: {
                    error: 'Invalid page number',
                }
            }
        }

        let videos = await fetchVideos(page, pb);

        if (videos.items.length === 0) {
            return {
                status: 404,
                body: {
                    error: 'No videos found',
                }
            }
        }

        return {
            status: 200,
            body: {
                videos: videos.items,
            }
        }
    }
}
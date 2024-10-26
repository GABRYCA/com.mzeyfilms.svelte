import { PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from "pocketbase";

export async function load() {

    const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
    await pb.admins.authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);

    const videos = await pb.collection('videos').getFullList();

    return {
        videos: videos,
        title: 'MZEYFILMS - Videos',
        description: 'MZEFILMS Videos. Watch my latest featured videos.',
    }
}
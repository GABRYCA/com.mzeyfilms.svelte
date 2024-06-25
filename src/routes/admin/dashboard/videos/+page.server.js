import { PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from "pocketbase";

export async function load() {

    const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
    await pb.admins.authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);
    const videos = await pb.collection('videos').getFullList();

    return {
        videos: videos
    }
}

export const actions = {
    upload: async ({ cookies, request }) => {
        const formData = Object.fromEntries(await request.formData());

        const sessionId = cookies.get('session_id');
        const currentUser = await getUserById(sessionId);

        const isAuthenticated = currentUser && currentUser.id;

        if (!isAuthenticated) {
            return {
                status: 401,
                body: {
                    message: 'Unauthorized'
                }
            }
        }

        const name = formData.name;
        const url = formData.url;

        // Check if video exists
        const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);

        const video = await pb.collection('videos').getFullList({
            filter: 'name = "' + name + '"',
        });

        if (video && video.length > 0) {
            return {
                status: 400,
                body: {
                    message: 'Video already exists'
                }
            }
        }

        const data = {
            name: name,
            url: url
        };

        await pb.collection('videos').create(data);

        return {
            status: 200,
            body: {
                message: 'Video added successfully'
            }
        }
    },
    rename: async ({ cookies, request }) => {
        const formData = Object.fromEntries(await request.formData());

        const sessionId = cookies.get('session_id');
        const currentUser = await getUserById(sessionId);

        const isAuthenticated = currentUser && currentUser.id;

        if (!isAuthenticated) {
            return {
                status: 401,
                body: {
                    message: 'Unauthorized'
                }
            }
        }

        const oldName = formData.oldName;
        const newName = formData.newName;

        // Check if video exists
        const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);

        const video = await pb.collection('videos').getFullList({
            filter: 'name = "' + oldName + '"',
        });

        if (!video || video.length === 0) {
            return {
                status: 400,
                body: {
                    message: 'Video not found'
                }
            }
        }

        const data = {
            name: newName,
        };

        await pb.collection('videos').update(video[0].id, data);

        return {
            status: 200,
            body: {
                message: 'Video renamed successfully'
            }
        }
    },
    delete: async ({ cookies, request }) => {
        const formData = Object.fromEntries(await request.formData());

        const sessionId = cookies.get('session_id');
        const currentUser = await getUserById(sessionId);

        const isAuthenticated = currentUser && currentUser.id;

        if (!isAuthenticated) {
            return {
                status: 401,
                body: {
                    message: 'Unauthorized'
                }
            }
        }

        const name = formData.name;

        // Check if video exists
        const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);

        const video = await pb.collection('videos').getFullList({
            filter: 'name = "' + name + '"',
        });

        if (!video || video.length === 0) {
            return {
                status: 400,
                body: {
                    message: 'Invalid video'
                }
            }
        }

        await pb.collection('videos').delete(video[0].id);

        return {
            status: 200,
            body: {
                message: 'Video deleted successfully'
            }
        }
    }
}
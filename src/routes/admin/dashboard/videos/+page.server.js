import {getUserById} from "$lib/store/db.js";
import { writeFileSync } from 'fs';

export const actions = {
    default: async ({ cookies, request }) => {
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

        const video = formData.video;

        if (!video || video.type !== 'video/mp4') {
            return {
                status: 400,
                body: {
                    message: 'Invalid video'
                }
            }
        }

        writeFileSync(`static/videos/${video.name}`, Buffer.from(await video.arrayBuffer()));

        return {
            status: 200,
            body: {
                message: 'Video saved'
            }
        }
    }
}
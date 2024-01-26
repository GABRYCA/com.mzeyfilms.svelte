import {getUserById} from "$lib/store/db.js";
import fs from 'fs/promises';
import { writeFileSync } from 'fs';
import path from "path";

export async function load() {
    // Get a list of videos inside 'static/videos' folder, excluding the ones in the subfolder 'old'
    const pathFolders = path.resolve('static/', 'videos');
    const videos = await fs.readdir(pathFolders);
    const index = videos.indexOf('old');
    if (index > -1) {
        videos.splice(index, 1);
    }

    // Get static vite path of each video and save it into videos array
    for (let i = 0; i < videos.length; i++) {
        videos[i] = '\\videos\\' + videos[i];
    }

    return {
        body: {
            videos: videos
        }
    }
}

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
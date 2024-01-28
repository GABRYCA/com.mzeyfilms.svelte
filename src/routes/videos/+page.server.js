import path from "path";
import fs from "fs/promises";

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
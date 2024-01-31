import path from "path";
import fs from "fs/promises";

export async function load() {
    const production = true;
    const pathFolders = path.resolve('static/', 'videos');
    let videos = await fs.readdir(pathFolders);
    const index = videos.indexOf('old');
    if (index > -1) {
        videos.splice(index, 1);
    }

    videos = videos.map(video => production ? `\\static\\videos\\${video}` : `\\videos\\${video}`);

    return {
        body: {
            videos: videos
        }
    }
}
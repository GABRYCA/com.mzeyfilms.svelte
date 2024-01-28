import path from "path";
import fs from "fs/promises";
import dirman from "fs";

function missingFolders() {
    // Check if 'static' directory exists
    if (!dirman.existsSync('static')) {
        // If it doesn't exist, create it
        dirman.mkdirSync('static');
    }

    if (!dirman.existsSync('static/videos')) {
        // If it doesn't exist, create it
        dirman.mkdirSync('static/videos');
        dirman.mkdirSync('static/videos/old');
    }

    if (!dirman.existsSync('static/photos')) {
        // If it doesn't exist, create it
        dirman.mkdirSync('static/photos');
        dirman.mkdirSync('static/photos/old');
    }
}

export async function load() {

    missingFolders();

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
import path from "path";
import fs from "fs/promises";

export async function load() {
    const production = true;
    const pathFolders = path.resolve('static/', 'photos');
    let folders = await fs.readdir(pathFolders);
    const index = folders.indexOf('old');
    if (index > -1) {
        folders.splice(index, 1);
    }

    const foldersWithImages = await Promise.all(folders.map(async folder => {
        const pathFolder = path.resolve('static/', 'photos', folder);
        let images = await fs.readdir(pathFolder);
        images = images.map(image => production ? `\\static\\photos\\${folder}\\${image}` : `\\photos\\${folder}\\${image}`);
        return {
            name: folder,
            images: images
        };
    }));

    return {
        body: {
            folders: folders,
            content: foldersWithImages
        }
    }
}
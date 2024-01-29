import path from "path";
import fs from "fs/promises";

export async function load(){

    const production = true;

    // Get a list of folders inside 'static' folder
    const pathFolders = path.resolve('static/', 'photos');

    // Read folders names
    let folders = await fs.readdir(pathFolders);
    let foldersWithImages = [];

    // Remove from folder array the folder with name 'old'
    const index = folders.indexOf('old');
    if (index > -1) {
        folders.splice(index, 1);
    }

    // Get src of each image and group them by folder in the foldersWithImages array object
    for (let i = 0; i < folders.length; i++) {
        const pathFolder = path.resolve('static/', 'photos', folders[i]);
        const images = await fs.readdir(pathFolder);
        for (let j = 0; j < images.length; j++) {
            if (production){
                images[j] = '\\static\\photos\\' + folders[i] + '\\' + images[j];
            } else {
                images[j] = '\\photos\\' + folders[i] + '\\' + images[j];
            }
        }
        foldersWithImages.push({
            name: folders[i],
            images: images
        });
    }

    return {
        body: {
            folders: folders,
            content: foldersWithImages
        }
    }
}
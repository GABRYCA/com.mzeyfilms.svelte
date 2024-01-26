import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import {getUserById} from "$lib/store/db.js";
import {writeFileSync} from "fs";

export async function load(){
    // Get a list of folders inside 'static' folder
    const pathFolders = path.resolve('static/', 'photos');

    // Read folders names
    const folders = await fs.readdir(pathFolders);

    // Remove from folder array the folder with name 'old'
    const index = folders.indexOf('old');
    if (index > -1) {
        folders.splice(index, 1);
    }

    return {
        body: {
            folders: folders
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

        const folder = formData.folder;
        const image = formData.image;

        // Check type of image, can be any extension, but only images
        if (!image || !image.type.includes('image')) {
            return {
                status: 400,
                body: {
                    message: 'Invalid image'
                }
            }
        }

        // Check if webp, if yes, save it already
        if (image.type === 'image/webp') {
            writeFileSync(`static/photos/${folder.name}/${image.name}`, Buffer.from(await image.arrayBuffer()));

            return {
                status: 200,
                body: {
                    message: 'Image saved'
                }
            }
        }

        // Convert image
        let imageBuffer = Buffer.from(await image.arrayBuffer());
        imageBuffer = await sharp(imageBuffer).toFormat('webp').toBuffer();

        writeFileSync(`static/photos/${folder}/${image.name}.webp`, imageBuffer);

        return {
            status: 200,
            body: {
                message: 'Video saved'
            }
        }
    }
}
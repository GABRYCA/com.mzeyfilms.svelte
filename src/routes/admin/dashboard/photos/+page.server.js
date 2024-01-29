import path from 'path';
import fs from 'fs/promises';
import {getUserById} from "$lib/store/db.js";
import {writeFileSync} from "fs";
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

export async function load(){

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
            images[j] = '\\photos\\' + folders[i] + '\\' + images[j];
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

        const folder = formData.folder;
        const image = formData.image;

        console.log(image)

        // Check type of image, can be any extension, but only images
        if (!image || !image.type.includes('image')) {
            return {
                status: 400,
                body: {
                    message: 'Invalid image'
                }
            }
        }

        // Check if folder exists
        try {
            await fs.access(`static/photos/${folder}`);
        } catch (e) {
            return {
                status: 400,
                body: {
                    message: 'Invalid folder'
                }
            }
        }

        // Check if webp, if yes, save it already
        if (image.type === 'image/webp') {

            // Check if file aleady exists, if yes return error
            try {
                await fs.access(`static/photos/${folder}/${image.name}`);
                return {
                    status: 400,
                    body: {
                        message: 'Image already exists'
                    }
                }
            } catch (e) {}

            writeFileSync(`static/photos/${folder}/${image.name}`, Buffer.from(await image.arrayBuffer()));

            return {
                status: 200,
                body: {
                    message: 'Image saved'
                }
            }
        }

        // Check if file already exists, if yes return error
        try {
            await fs.access(`static/photos/${folder}/${image.name}.webp`);
            return {
                status: 400,
                body: {
                    message: 'Image already exists'
                }
            }
        } catch (e) {}

        // Convert image (use finalImage as name)
        // Save the image temporarily
        const tempPath = `static/photos/${folder}/${image.name}`;
        writeFileSync(tempPath, Buffer.from(await image.arrayBuffer()));

        // Convert image to webp and save it
        const finalImage = await imagemin([tempPath], {
            destination: `static/photos/${folder}`,
            plugins: [
                imageminWebp({quality: 75})
            ]
        });

        // Delete temporary image
        await fs.rm(tempPath);


        // writeFileSync(`static/photos/${folder}/${image.name}.webp`, finalImage);

        return {
            status: 200,
            body: {
                message: 'Video saved'
            }
        }
    },
    create: async ({ cookies, request }) => {
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

        const folderName = formData.folderName;

        // Check if folder already exists, if yes return error
        try {
            await fs.access(`static/photos/${folderName}`);
            return {
                status: 400,
                body: {
                    message: 'Folder already exists'
                }
            }
        } catch (e) {}

        // Create folder
        await fs.mkdir(`static/photos/${folderName}`);

        return {
            status: 200,
            body: {
                message: 'Folder created'
            }
        }
    },
    renameFolder: async ({ cookies, request }) => {
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

        const oldFolderName = formData.folderName;
        const newFolderName = formData.newFolderName;

        // Check if folder already exists, if yes return error
        try {
            await fs.access(`static/photos/${newFolderName}`);
            return {
                status: 400,
                body: {
                    message: 'Folder already exists'
                }
            }
        } catch (e) {}

        // Check if folder exists, if not return error
        try {
            await fs.access(`static/photos/${oldFolderName}`);
        } catch (e) {
            return {
                status: 400,
                body: {
                    message: 'Folder does not exist'
                }
            }
        }

        // Rename folder
        await fs.rename(`static/photos/${oldFolderName}`, `static/photos/${newFolderName}`);

        return {
            status: 200,
            body: {
                message: 'Folder renamed'
            }
        }
    },
    deleteFolder: async ({ cookies, request }) => {
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

        const folderName = formData.folderName;

        // Check if folder exists, if not return error
        try {
            await fs.access(`static/photos/${folderName}`);
        } catch (e) {
            return {
                status: 400,
                body: {
                    message: 'Folder does not exist'
                }
            }
        }

        // Check if folder contains files, if yes, move the folder inside the 'old' folder, and it it exists there too, make a second one with a number
        const pathFolder = path.resolve('static/', 'photos', folderName);
        const files = await fs.readdir(pathFolder);
        if (files.length > 0) {
            const pathOldFolder = path.resolve('static/', 'photos', 'old', folderName);
            try {
                await fs.access(pathOldFolder);
                const folders = await fs.readdir(path.resolve('static/', 'photos', 'old'));
                const index = folders.indexOf(folderName);
                if (index > -1) {
                    folders.splice(index, 1);
                }
                await fs.mkdir(path.resolve('static/', 'photos', 'old', `${folderName} (${folders.length})`));
                await fs.rename(pathFolder, path.resolve('static/', 'photos', 'old', `${folderName} (${folders.length})`, folderName));
            } catch (e) {
                await fs.mkdir(path.resolve('static/', 'photos', 'old', folderName));
                await fs.rename(pathFolder, path.resolve('static/', 'photos', 'old', folderName, folderName));
            }
        } else {
            await fs.rm(pathFolder, { recursive: true });
        }

        return {
            status: 200,
            body: {
                message: 'Folder deleted'
            }
        }
    },
    move: async ({ cookies, request }) => {
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

        const folderName = formData.newFolder;
        const oldFolderName = formData.oldFolder;
        const image = formData.imageName;

        // Check if folder exists, if not return error
        try {
            await fs.access(`static/photos/${folderName}`);
        } catch (e) {
            return {
                status: 400,
                body: {
                    message: 'Folder does not exist'
                }
            }
        }

        // Check if image exists, if not return error
        try {
            await fs.access(`static/photos/${oldFolderName}/${image}`);
        } catch (e) {
            return {
                status: 400,
                body: {
                    message: 'Image does not exist'
                }
            }
        }

        // Move image
        await fs.rename(`static/photos/${oldFolderName}/${image}`, `static/photos/${folderName}/${image}`);

        return {
            status: 200,
            body: {
                message: 'Image moved'
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

        const folderName = formData.folder;
        const image = formData.imageName;

        // Check if folder exists, if not return error
        try {
            await fs.access(`static/photos/${folderName}`);
        } catch (e) {
            return {
                status: 400,
                body: {
                    message: 'Folder does not exist'
                }
            }
        }

        // Check if image exists, if not return error
        try {
            await fs.access(`static/photos/${folderName}/${image}`);
        } catch (e) {
            return {
                status: 400,
                body: {
                    message: 'Image does not exist'
                }
            }
        }

        // Check if 'old'/folderName folder exists, if not create it
        try {
            await fs.access(`static/photos/old/${folderName}`);
        } catch (e) {
            await fs.mkdir(`static/photos/old/${folderName}`);
        }

        // Move image to 'old' folder, including subfolders
        try {
            await fs.rename(`static/photos/${folderName}/${image}`, `static/photos/old/${folderName}/${image}`);
        } catch (e) {
            return {
                status: 400,
                body: {
                    message: 'Error deleting photo'
                }
            }
        }

        return {
            status: 200,
            body: {
                message: 'Image deleted'
            }
        }
    }
}
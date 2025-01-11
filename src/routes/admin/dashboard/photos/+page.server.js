import sharp from 'sharp';
import { PUBLIC_POCKETBASE_URL_IMG_API } from '$env/static/public';

const uploadImage = async (image, folder, pb) => {

    const imageSharp = sharp(await image.arrayBuffer());

    const buffer = await imageSharp
        .webp({ quality: 80 })
        .toBuffer();

    const random = Math.random().toString(36).substring(2, 15);
    const newImageName = `${random}.webp`;

    const file = new File([buffer], newImageName, { type: 'image/webp', lastModified: Date.now() });

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const createdRecord = await pb.collection('images').create(formData);

    const url = PUBLIC_POCKETBASE_URL_IMG_API + createdRecord.collectionId + '/' + createdRecord.id + '/' + createdRecord.image;

    // Update created record with new url
    const data = {
        'url': url
    }

    await pb.collection('images').update(createdRecord.id, data);

    return PUBLIC_POCKETBASE_URL_IMG_API + createdRecord.collectionId + '/' + createdRecord.id + '/' + createdRecord.image;
}

export async function load( { locals: { pb }} ){

    const folders = await pb.collection('folders').getFullList();
    const foldersWithImages = [];

    for (let i = 0; i < folders.length; i++) {
        const images = await pb.collection('images').getFullList({
            filter: 'folder = "' + folders[i].id + '"',
        });
        foldersWithImages.push({
            folder: folders[i],
            images: images
        });
    }

    return {
        folders: folders,
        content: foldersWithImages,
        title: 'MZEYFILMS - Admin - Photos',
        description: 'MZEFILMS Admin Photos. Manage your photos.',
        index: false
    }
}

export const actions = {
    upload: async ({ request, locals: { pb } }) => {
        const formData = Object.fromEntries(await request.formData());

        let folder = formData.folder;
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

        const folderExists = await pb.collection('folders').getFullList({
            filter: 'name = "' + folder + '"',
        });

        if (!folderExists || folderExists.length === 0){
            const folderData = {
                'name': folder
            }

            const record = await pb.collection('folders').create(folderData);

            folder = record.id;

            if (!record) {
                return {
                    status: 400,
                    body: {
                        message: 'Error creating folder'
                    }
                }
            }
        } else {
            folder = folderExists.filter(f => f.name === folder)[0].id;
        }

        const finalURL = await uploadImage(image, folder, pb);

        // If error or object, return it
        if (typeof finalURL === 'object') {
            return finalURL;
        }

        return {
            status: 200,
            body: {
                message: 'Photo saved'
            }
        }
    },
    create: async ({ request, locals: { pb } }) => {
        const formData = Object.fromEntries(await request.formData());

        const folderName = formData.folderName;

        const folderExists = await pb.collection('folders').getFullList({
            filter: 'name = "' + folderName + '"',
        });

        if (!folderExists || folderExists.length === 0){
            const folderData = {
                'name': folderName
            }

            const record = await pb.collection('folders').create(folderData);

            if (!record) {
                return {
                    status: 400,
                    body: {
                        message: 'Error creating folder'
                    }
                }
            }
        } else {
            return {
                status: 400,
                body: {
                    message: 'Folder already exists'
                }
            }
        }

        return {
            status: 200,
            body: {
                message: 'Folder created'
            }
        }
    },
    renameFolder: async ({ request, locals: { pb } }) => {
        const formData = Object.fromEntries(await request.formData());

        const oldFolderName = formData.folderName;
        const newFolderName = formData.newFolderName;

        const folderExists = await pb.collection('folders').getFullList({
            filter: 'name = "' + oldFolderName + '"',
        });

        // If folder doesn't exist, return error
        if (!folderExists || folderExists.length === 0) {
            return {
                status: 400,
                body: {
                    message: 'Folder does not exist'
                }
            }
        }

        const folderData = {
            'name': newFolderName
        }

        await pb.collection('folders').update(folderExists[0].id, folderData);

        return {
            status: 200,
            body: {
                message: 'Folder renamed'
            }
        }
    },
    deleteFolder: async ({ request, locals: { pb } }) => {
        const formData = Object.fromEntries(await request.formData());

        const folderName = formData.folderName;

        const folderExists = await pb.collection('folders').getFullList({
            filter: 'name = "' + folderName + '"',
        });

        // If folder doesn't exist, return error
        if (!folderExists || folderExists.length === 0) {
            return {
                status: 400,
                body: {
                    message: 'Folder does not exist'
                }
            }
        }

        await pb.collection('folders').delete(folderExists[0].id);

        return {
            status: 200,
            body: {
                message: 'Folder deleted'
            }
        }
    },
    move: async ({ request, locals: { pb } }) => {
        const formData = Object.fromEntries(await request.formData());

        const folderName = formData.newFolder;
        const oldFolderName = formData.oldFolder;
        const image = formData.imageName;

        const folderExists = await pb.collection('folders').getFullList({
            filter: 'name = "' + folderName + '" || name = "' + oldFolderName + '"',
        });

        if (!folderExists || folderExists.length === 0){
            return {
                status: 400,
                body: {
                    message: 'Folder does not exist'
                }
            }
        }

        const imageExists = await pb.collection('images').getFullList({
            filter: 'image = "' + image + '"',
        });

        if (!imageExists || imageExists.length === 0){
            return {
                status: 400,
                body: {
                    message: 'Image does not exist'
                }
            }
        }

        const imageId = imageExists[0].id;

        const data = {
            'folder': folderExists.filter(f => f.name === folderName)[0].id
        }

        await pb.collection('images').update(imageId, data);

        return {
            status: 200,
            body: {
                message: 'Image moved'
            }
        }
    },
    delete: async ({ request, locals: { pb } }) => {
        const formData = Object.fromEntries(await request.formData());

        const image = formData.imageName;

        const imageExists = await pb.collection('images').getFullList({
            filter: 'image = "' + image + '"',
        });

        if (!imageExists || imageExists.length === 0){
            return {
                status: 400,
                body: {
                    message: 'Image does not exist'
                }
            }
        }

        await pb.collection('images').delete(imageExists[0].id);

        return {
            status: 200,
            body: {
                message: 'Image deleted'
            }
        }
    }
}
import PocketBase from "pocketbase";
import {PUBLIC_POCKETBASE_URL} from "$env/static/public";
import {PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD} from "$env/static/private";

export async function load() {

    const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
    await pb.admins.authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);

    const foldersWithImages = await pb.collection("folders").getFullList({
        fields: "name, id, expand",
        expand: 'images_via_folder'
    });

    return {
        content: foldersWithImages,
        title: 'MZEYFILMS - Photos',
        description: 'MZEFILMS Photos. Give a look to my beautiful shots.',
    }
}
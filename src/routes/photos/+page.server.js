export async function load({ locals: { pb }}) {

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
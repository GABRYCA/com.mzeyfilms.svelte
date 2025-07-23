export async function load({ locals: { pb }, url}) {

    const foldersWithImages = await pb.collection("folders").getFullList({
        fields: "name, id, expand",
        expand: 'images_via_folder'
    });

    const totalImages = foldersWithImages.reduce((count, folder) => {
        return count + (folder.expand?.images_via_folder?.length || 0);
    }, 0);

    const description = totalImages > 0 
        ? `Explore ${totalImages} professional photos organized in ${foldersWithImages.length} collections by MZEYFILMS.`
        : 'Professional photography gallery by MZEYFILMS.';

    return {
        content: foldersWithImages,
        title: 'MZEYFILMS - Photos',
        description,
        totalImages,
        totalFolders: foldersWithImages.length,
        schemaOrg: false,
        openGraph: false,
        twitter: false,
        canonical: 'https://mzeyfilms.com' + url.pathname,
        author: 'MZEYFILMS',
        imageURL: foldersWithImages[0]?.expand?.images_via_folder?.[0]?.url || `${url.origin}/favicon.webp`
    }
}
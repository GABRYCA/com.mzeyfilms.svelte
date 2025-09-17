import { getOptimizedImageUrl } from '$lib/utils/imageOptimization.js';

export async function load({ locals: { pb }, url}) {

    let foldersWithImages = await pb.collection("folders").getFullList({
        fields: "name, id, expand",
        expand: 'images_via_folder'
    });

    // Remove Cinematography folder
    foldersWithImages = foldersWithImages.filter(folder => folder.name.toLowerCase() !== 'cinematography');

    const totalImages = foldersWithImages.reduce((count, folder) => {
        return count + (folder.expand?.images_via_folder?.length || 0);
    }, 0);

    const description = totalImages > 0 
        ? `Explore ${totalImages} professional photos organized in ${foldersWithImages.length} collections by MZEYFILMS.`
        : 'Professional photography gallery by MZEYFILMS.';

    // Get optimized image URL for social media sharing
    const firstImageUrl = foldersWithImages[0]?.expand?.images_via_folder?.[0]?.url;
    const socialImageUrl = firstImageUrl 
        ? getOptimizedImageUrl(firstImageUrl, { width: 1200, height: 630, quality: 85 })
        : `${url.origin}/favicon.webp`;

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
        imageURL: socialImageUrl
    }
}
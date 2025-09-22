import { getOptimizedImageUrl } from '$lib/utils/imageOptimization.js';

export async function load({ locals: { pb }, url}) {
    // Get images from images collection that have as folder "Cinematography"
    const cinematographyFolder = await pb.collection("folders").getFirstListItem('name="Cinematography"');
    const cinematographyImages = await pb.collection("images").getFullList({
        filter: `folder="${cinematographyFolder.id}"`,
        sort: '-created',
        fields: 'id, url, image, created',
        expand: 'folder'
    });

    const description = cinematographyImages.length > 0
        ? `Explore ${cinematographyImages.length} professional cinematography shots by MZEYFILMS.`
        : 'Professional cinematography gallery by MZEYFILMS.';

    // Get optimized image URL for social media sharing
    const firstImageUrl = cinematographyImages[0]?.url;
    const socialImageUrl = firstImageUrl
        ? getOptimizedImageUrl(firstImageUrl, { width: 1200, height: 630, quality: 85 })
        : `${url.origin}/favicon.webp`;


    return {
        content: cinematographyImages,
        title: 'MZEYFILMS - Cinematography',
        description,
        totalImages: cinematographyImages.length,
        schemaOrg: false,
        openGraph: false,
        twitter: false,
        canonical: 'https://mzeyfilms.com' + url.pathname,
        author: 'MZEYFILMS',
        imageURL: socialImageUrl
    }
}
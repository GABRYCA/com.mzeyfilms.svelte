export const load = async ({url}) => {
    return {
        title: 'MZEYFILMS - Official',
        author: 'MZEYFILMS',
        name: 'MZEYFILMS',
        imageURL: `${url.origin}/favicon.webp`,
        logo: `${url.origin}/favicon.webp`,
        description: 'MZEYFILMS, Filmmaker, Photographer, Aspirant Cinematographer, Always searching for new stories to tell.',
        schemaOrg: true,
        openGraph: true,
        twitter: true,
        canonical: url.href,
        index: true,
    }
}
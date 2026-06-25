export const load = async ({url}) => {
    return {
        title: 'MZEYFILMS - Official',
        author: 'MZEYFILMS',
        name: 'MZEYFILMS',
        imageURL: `${url.origin}/favicon.webp`,
        logo: `${url.origin}/favicon.webp`,
        description: 'MZEYFILMS, Filmmaker, Aspirant Cinematographer, Always searching for new stories to tell.',
        schemaOrg: true,
        openGraph: true,
        twitter: true,
        canonical: 'https://mzeyfilms.com' + url.pathname,
        index: true,
        subtitle: 'Aspirant Cinematographer <br>Director | Editor'
    }
}
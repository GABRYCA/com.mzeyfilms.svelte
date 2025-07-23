<script>
    import {onMount} from "svelte";
    import UserPhoto from "$lib/components/UserPhoto.svelte";

    let {data} = $props();
    const {content} = data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    const structuredData = $derived({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "name": "MZEYFILMS Photo Gallery",
        "description": data.description,
        "url": "https://mzeyfilms.com/photos",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mzeyfilms.com/photos"
        },
        "author": {
            "@type": "Person",
            "name": "MZEYFILMS",
            "url": "https://mzeyfilms.com"
        },
        "publisher": {
            "@type": "Person",
            "name": "MZEYFILMS",
            "url": "https://mzeyfilms.com"
        },
        "numberOfItems": data.totalImages,
        "hasPart": content.map(folder => ({
            "@type": "ImageGallery",
            "name": folder.name,
            "description": `Photo collection: ${folder.name}`,
            "numberOfItems": folder.expand?.images_via_folder?.length || 0,
            "image": folder.expand?.images_via_folder?.map(image => ({
                "@type": "ImageObject",
                "url": image.url,
                "name": image.title || image.name || `Photo from ${folder.name}`,
                "description": image.description || `Professional photo from ${folder.name} collection by MZEYFILMS`,
                "author": {
                    "@type": "Person",
                    "name": "MZEYFILMS"
                },
                "copyrightHolder": {
                    "@type": "Person",
                    "name": "MZEYFILMS"
                },
                "contentUrl": image.url,
                "thumbnailUrl": image.url
            })) || []
        })),
        "image": content.flatMap(folder => 
            folder.expand?.images_via_folder?.map(image => ({
                "@type": "ImageObject",
                "url": image.url,
                "name": image.title || image.name || `Photo from ${folder.name}`,
                "description": image.description || `Professional photo from ${folder.name} collection by MZEYFILMS`,
                "author": {
                    "@type": "Person",
                    "name": "MZEYFILMS"
                },
                "copyrightHolder": {
                    "@type": "Person",
                    "name": "MZEYFILMS"
                },
                "contentUrl": image.url,
                "thumbnailUrl": image.url
            })) || []
        )
    });

</script>

<svelte:head>
    <!-- Primary Meta Tags -->
    <title>{data.title}</title>
    <meta name="title" content="{data.title}">
    <meta name="description" content="{data.description}">
    <meta name="author" content="{data.author}">
    <meta name="keywords" content="MZEYFILMS, photography, photo gallery, professional photographer, images, portfolio">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="{data.canonical}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{data.canonical}">
    <meta property="og:site_name" content="MZEYFILMS">
    <meta property="og:title" content="{data.title}">
    <meta property="og:description" content="{data.description}">
    <meta property="og:image" content="{data.imageURL}">
    <meta property="og:image:alt" content="Photo from MZEYFILMS gallery">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{data.canonical}">
    <meta property="twitter:title" content="{data.title}">
    <meta property="twitter:description" content="{data.description}">
    <meta property="twitter:image" content="{data.imageURL}">

    <!-- Structured Data (JSON-LD) for Image Gallery -->
    {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<div class="container-xxl" data-aos="zoom-in" data-aos-duration="400">
    <div class="row align-items-center" style="min-height: 78vh">
        <div class="col">
            <div class="row text-center justify-content-center px-2 pt-2 mb-3">
                <div class="col theme-main-container theme-shadow pt-4 pb-2 rounded-4">
                    <p class="h1 theme-text-primary">Photos</p>
                </div>
            </div>
            <div class="row text-center justify-content-center px-2 pb-2">
                <div class="col theme-main-container theme-shadow py-3 rounded-4">
                    {#each content as folder, index (folder.id)}
                        <div class="row text-center justify-content-center px-2">
                            <div class="col theme-folder-container theme-shadow-hover pt-3 pb-3 rounded-4">
                                <button class="btn btn-folder theme-button w-100 rounded-3 pt-2" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#collapse{index}">
                                    {folder.name} <i class="fas fa-chevron-down"></i>
                                </button>
                                <div class="collapse" id="collapse{index}">
                                    <hr class="theme-text-secondary">
                                    <div class="row justify-content-center">
                                        {#if !folder.expand || folder.expand.images_via_folder === 0}
                                            <div class="col mt-2">
                                                <p class="h5 theme-text-primary">Empty folder</p>
                                            </div>
                                        {:else}
                                            {#each folder.expand.images_via_folder as image (image.id)}
                                                <UserPhoto src={image} folderName={folder.name}/>
                                            {/each}
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {#if index < content.length - 1}
                            <div class="row my-2"></div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    p {
        color: #ff5555 !important;
    }
</style>



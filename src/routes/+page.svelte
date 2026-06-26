<script>
    import AnimatedMasonry from '$lib/components/AnimatedMasonry.svelte';
    import { PUBLIC_POCKETBASE_URL_IMG_API } from '$env/static/public';
    import {createSlug} from "$lib/utils/slugify.js";

    let { data } = $props();

    let galleryItems = $derived.by(() => {
        if (!data.videos) return [];

        const baseUrl = PUBLIC_POCKETBASE_URL_IMG_API.endsWith('/')
            ? PUBLIC_POCKETBASE_URL_IMG_API
            : `${PUBLIC_POCKETBASE_URL_IMG_API}/`;

        return data.videos.map(video => {
            const slug = createSlug(video.name);
            const href = `/film/${slug}-${video.id}`;

            const src = `${baseUrl}${video.collectionId}/${video.id}/${video.animatedhighres}`;
            const lowResSrc = video.animatedlowres
                ? `${baseUrl}${video.collectionId}/${video.id}/${video.animatedlowres}`
                : null;

            return {
                src,
                lowResSrc,
                title: video.name,
                href
            };
        });
    });
</script>

<div class="container-fluid pt-lg-2 homepage-content">

    <section class="row g-0 mb-4 pb-4 pb-lg-5" id="portfolio-gallery" aria-labelledby="gallery-heading">

        <div class="col-12 px-2 px-md-4" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <AnimatedMasonry items={galleryItems} gap={12}/>
        </div>
    </section>

</div>

<style>
    #portfolio-gallery {
        min-height: 60vh;
    }
</style>
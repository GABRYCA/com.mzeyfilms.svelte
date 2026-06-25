<script>
    import AnimatedImage from '$lib/components/AnimatedImage.svelte';

    /**
     * AnimatedMasonry — A responsive Bootstrap grid gallery of animated images.
     *
     * Props:
     *   items  {Array<{ src: string, lowResSrc?: string, title: string, href?: string|null, alt?: string }>}
     *          — List of image data objects to display
     *   gap    {number}  — Gap between items in pixels (default 16)
     */

    let {
        items = [],
        gap = 16,
    } = $props();
</script>

<div
        class="animated-masonry-grid row g-0"
        style="--masonry-gap: {gap}px;"
        role="list"
        aria-label="Animated portfolio gallery"
>
    {#each items as item (item.src)}
        <div
                class="col-12 col-sm-6 col-lg-4 animated-masonry-item"
                role="listitem"
        >
            <AnimatedImage
                    src={item.src}
                    lowResSrc={item.lowResSrc ?? null}
                    title={item.title}
                    href={item.href ?? null}
                    alt={item.alt ?? item.title}
            />
        </div>
    {/each}
</div>

<style>
    .animated-masonry-grid {
        --masonry-gap: 16px;
        gap: 0 !important;
    }

    .animated-masonry-item {
        padding: calc(var(--masonry-gap) / 2);
    }

    .animated-masonry-item :global(.animated-image-card) {
        /* aspect-ratio: 9 / 14; */
        width: 100%;
    }

    @media (min-width: 992px) {
        .animated-masonry-item :global(.animated-image-card) {
            /* aspect-ratio: 2 / 3; */
        }
    }

    @media (max-width: 575px) {
        .animated-masonry-item :global(.animated-image-card) {
            /* aspect-ratio: 4 / 5; */
        }
    }
</style>

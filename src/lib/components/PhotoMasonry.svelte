<script>
    import {getPhotoThumbnail, getPhotoPlaceholder} from '$lib/utils/imageOptimization.js';

    let {photo, folderName, onClick = null} = $props();

    let isLoading = $state(true);
    let hasLqip = $state(false);

    const altText = $derived(photo.title || photo.name || `Photo from ${folderName || 'MZEYFILMS gallery'}`);
    const imageTitle = $derived(photo.description || photo.title || `MZEYFILMS - ${altText}`);
    const thumbnailImage = $derived(getPhotoThumbnail(photo.url));
    const placeholderSrc = $derived(getPhotoPlaceholder(photo.url));

    /**
     * Attach load handlers and detect already-cached images.
     * Resets loading state when the photo URL changes (action re-runs).
     */
    function fullImageAction(node, url) {
        isLoading = true;

        const markLoaded = () => {
            isLoading = false;
        };

        const onLoad = () => markLoaded();
        const onError = () => {
            isLoading = false;
            console.warn(`Failed to load image: ${url}`);
        };

        node.addEventListener('load', onLoad);
        node.addEventListener('error', onError);

        if (node.complete && node.naturalHeight > 0) {
            markLoaded();
        }

        return {
            update(newUrl) {
                if (newUrl !== url) {
                    url = newUrl;
                    isLoading = true;
                    hasLqip = false;
                    if (node.complete && node.naturalHeight > 0) {
                        markLoaded();
                    }
                }
            },
            destroy() {
                node.removeEventListener('load', onLoad);
                node.removeEventListener('error', onError);
            }
        };
    }

    function lqipAction(node) {
        const onLoad = () => {
            hasLqip = true;
        };

        node.addEventListener('load', onLoad);

        if (node.complete && node.naturalHeight > 0) {
            hasLqip = true;
        }

        return {
            destroy() {
                node.removeEventListener('load', onLoad);
            }
        };
    }

    function handleClick() {
        if (onClick) {
            onClick(photo);
        }
    }
</script>

{#snippet photoContent()}
    <!-- Skeleton holds layout space until LQIP is ready -->
    {#if isLoading && !hasLqip}
        <div class="photo-skeleton" aria-hidden="true">
            <div class="skeleton-shimmer"></div>
        </div>
    {/if}

    <!-- Blur-up LQIP: tiny image that establishes real aspect ratio quickly -->
    {#if placeholderSrc && isLoading}
        <img
                src={placeholderSrc}
                alt=""
                class="photo-lqip"
                class:visible={hasLqip}
                aria-hidden="true"
                decoding="async"
                use:lqipAction
        >
    {/if}

    <!-- Full-resolution thumbnail (absolute while loading so it never double-stacks height) -->
    <img
            src={thumbnailImage.src}
            srcset={thumbnailImage.srcset}
            sizes="(max-width: 576px) 240px, (max-width: 768px) 280px, (max-width: 1200px) 350px, 400px"
            loading="lazy"
            decoding="async"
            class="photo-image"
            class:loaded={!isLoading}
            class:overlay-mode={isLoading}
            alt={altText}
            title={imageTitle}
            itemprop="url"
            use:fullImageAction={photo.url}
    >

    {#if onClick}
        <span class="photo-overlay">
            <span class="overlay-content">
                <i class="fas fa-expand-alt overlay-icon"></i>
            </span>
        </span>
    {/if}

    <span class="visually-hidden">
        <meta itemprop="name" content={altText}>
        <meta itemprop="description" content={imageTitle}>
        <meta itemprop="author" content="MZEYFILMS">
        <meta itemprop="copyrightHolder" content="MZEYFILMS">
    </span>
{/snippet}

{#if onClick}
    <button
            class="photo-masonry-item clickable"
            class:is-loading={isLoading}
            class:has-lqip={hasLqip}
            onclick={handleClick}
            itemscope
            itemtype="https://schema.org/ImageObject"
    >
        {@render photoContent()}
    </button>
{:else}
    <div
            class="photo-masonry-item"
            class:is-loading={isLoading}
            class:has-lqip={hasLqip}
            itemscope
            itemtype="https://schema.org/ImageObject"
    >
        {@render photoContent()}
    </div>
{/if}

<style>
    .photo-masonry-item {
        position: relative;
        width: 100%;
        overflow: hidden;
        background: linear-gradient(145deg, #121212 0%, #0a0a0a 50%, #151515 100%);
        border: 1px solid rgba(255, 255, 255, 0.12);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: block;
        padding: 0;
        /* Prevent the thin "slit" before any image data arrives */
        min-height: 220px;
    }

    .photo-masonry-item.has-lqip,
    .photo-masonry-item:not(.is-loading) {
        min-height: 0;
    }

    .photo-masonry-item.clickable {
        cursor: pointer;
    }

    .photo-masonry-item.clickable:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 40px rgba(255, 255, 255, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.4);
    }

    .photo-masonry-item:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.6);
        outline-offset: 4px;
    }

    /* Solid skeleton block — in document flow so it actually reserves height */
    .photo-skeleton {
        width: 100%;
        /* Cinematic default while waiting for LQIP */
        aspect-ratio: 3 / 4;
        min-height: 220px;
        background: linear-gradient(145deg, #1a1a1a, #0d0d0d 40%, #161616);
        position: relative;
        overflow: hidden;
    }

    .skeleton-shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(
                105deg,
                transparent 35%,
                rgba(255, 255, 255, 0.04) 45%,
                rgba(255, 255, 255, 0.08) 50%,
                rgba(255, 255, 255, 0.04) 55%,
                transparent 65%
        );
        background-size: 200% 100%;
        animation: shimmer 1.6s ease-in-out infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: 100% 0;
        }
        100% {
            background-position: -100% 0;
        }
    }

    /* LQIP stays out of flow until ready, then takes over from the skeleton */
    .photo-lqip {
        width: 100%;
        height: auto;
        display: block;
        filter: blur(16px);
        transform: scale(1.06);
        opacity: 0;
        transition: opacity 0.25s ease;
        pointer-events: none;
        user-select: none;
        position: absolute;
        inset: 0;
        object-fit: cover;
    }

    .photo-lqip.visible {
        position: relative;
        inset: auto;
        object-fit: initial;
        opacity: 1;
    }

    .photo-image {
        width: 100%;
        height: auto;
        display: block;
        transition: opacity 0.45s ease, transform 0.3s ease;
        opacity: 0;
        border-radius: inherit;
    }

    /* While loading, full image overlays the placeholder without double-stacking height */
    .photo-image.overlay-mode {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .photo-image.loaded {
        opacity: 1;
        position: relative;
        inset: auto;
        height: auto;
        object-fit: initial;
    }

    .photo-masonry-item.clickable:hover .photo-image.loaded {
        transform: scale(1.05);
    }

    .photo-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.1) 0%,
                rgba(0, 0, 0, 0.5) 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 2;
    }

    .photo-masonry-item.clickable:hover .photo-overlay {
        opacity: 1;
    }

    .overlay-content {
        text-align: center;
        color: #ffffff;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
    }

    .overlay-icon {
        font-size: 2rem;
        animation: pulse 2s infinite ease-in-out;
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    @media (max-width: 768px) {
        .photo-masonry-item {
            min-height: 160px;
        }

        .photo-skeleton {
            min-height: 160px;
            aspect-ratio: 2 / 3;
        }

        .overlay-icon {
            font-size: 1.5rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .photo-masonry-item,
        .photo-image,
        .photo-overlay,
        .overlay-icon,
        .photo-lqip,
        .skeleton-shimmer {
            transition: none !important;
            animation: none !important;
        }

        .skeleton-shimmer {
            background: rgba(255, 255, 255, 0.03);
        }
    }

    @media (prefers-contrast: more) {
        .photo-masonry-item {
            border-width: 2px;
            border-color: rgba(255, 255, 255, 0.8);
        }

        .photo-overlay {
            background: rgba(0, 0, 0, 0.8);
        }
    }
</style>

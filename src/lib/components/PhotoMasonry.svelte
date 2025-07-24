<script>
    import {getPhotoThumbnail} from '$lib/utils/imageOptimization.js';

    let {photo, folderName, onClick = null} = $props();

    let isLoading = $state(true);
    let imageElement = $state(null);

    function handleImageLoad() {
        isLoading = false;
    }

    function handleImageError() {
        isLoading = false;
        console.warn(`Failed to load image: ${photo.url}`);
    }

    function handleClick() {
        if (onClick) {
            onClick(photo);
        }
    }

    /*function handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    }*/

    const altText = $derived(photo.title || photo.name || `Photo from ${folderName || 'MZEYFILMS gallery'}`);
    const imageTitle = $derived(photo.description || photo.title || `MZEYFILMS - ${altText}`);
    const thumbnailImage = $derived(getPhotoThumbnail(photo.url));
</script>

{#if onClick}
    <button class="photo-masonry-item clickable"
            onclick={handleClick}
            itemscope
            itemtype="https://schema.org/ImageObject">

        <!-- Loading State -->
        {#if isLoading}
            <div class="photo-loading" aria-label="Loading image">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                </div>
            </div>
        {/if}

        <!-- Image -->
        <img
                bind:this={imageElement}
                src={thumbnailImage.src}
                srcset={thumbnailImage.srcset}
                sizes="(max-width: 576px) 240px, (max-width: 768px) 280px, (max-width: 1200px) 350px, 400px"
                loading="lazy"
                class="photo-image"
                class:loaded={!isLoading}
                alt={altText}
                title={imageTitle}
                itemprop="url"
                onload={handleImageLoad}
                onerror={handleImageError}
        >

        <!-- Overlay for clickable images -->
        <span class="photo-overlay">
            <span class="overlay-content">
                <i class="fas fa-expand-alt overlay-icon"></i>
            </span>
        </span>

        <!-- Image Info (Hidden but accessible for SEO) -->
        <span class="visually-hidden">
            <meta itemprop="name" content={altText}>
            <meta itemprop="description" content={imageTitle}>
            <meta itemprop="author" content="MZEYFILMS">
            <meta itemprop="copyrightHolder" content="MZEYFILMS">
        </span>
    </button>
{:else}
    <div class="photo-masonry-item"
         itemscope
         itemtype="https://schema.org/ImageObject">

        <!-- Loading State -->
        {#if isLoading}
            <div class="photo-loading" aria-label="Loading image">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                </div>
            </div>
        {/if}

        <!-- Image -->
        <img
                bind:this={imageElement}
                src={thumbnailImage.src}
                srcset={thumbnailImage.srcset}
                sizes="(max-width: 576px) 240px, (max-width: 768px) 280px, (max-width: 1200px) 350px, 400px"
                loading="lazy"
                class="photo-image"
                class:loaded={!isLoading}
                alt={altText}
                title={imageTitle}
                itemprop="url"
                onload={handleImageLoad}
                onerror={handleImageError}
        >

        <!-- Image Info (Hidden but accessible for SEO) -->
        <div class="visually-hidden">
            <meta itemprop="name" content={altText}>
            <meta itemprop="description" content={imageTitle}>
            <meta itemprop="author" content="MZEYFILMS">
            <meta itemprop="copyrightHolder" content="MZEYFILMS">
        </div>
    </div>
{/if}

<style>
    .photo-masonry-item {
        position: relative;
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        background: linear-gradient(135deg, rgba(40, 0, 0, 0.3), rgba(20, 0, 0, 0.2));
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 85, 85, 0.15);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: block;
        padding: 0;
    }

    .photo-masonry-item.clickable {
        cursor: pointer;
    }

    .photo-masonry-item.clickable:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 85, 85, 0.3);
        border-color: rgba(255, 85, 85, 0.4);
    }

    .photo-masonry-item:focus-visible {
        outline: 2px solid rgba(255, 85, 85, 0.6);
        outline-offset: 4px;
    }

    .photo-loading {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(40, 0, 0, 0.3), rgba(20, 0, 0, 0.2));
        z-index: 1;
        min-height: 200px;
    }

    .loading-spinner {
        position: relative;
        width: 40px;
        height: 40px;
    }

    .spinner-ring {
        width: 100%;
        height: 100%;
        border: 3px solid rgba(255, 85, 85, 0.2);
        border-top-color: #ff5555;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .photo-image {
        width: 100%;
        height: auto;
        display: block;
        transition: all 0.3s ease;
        opacity: 0;
        border-radius: inherit;
    }

    .photo-image.loaded {
        opacity: 1;
    }

    .photo-masonry-item.clickable:hover .photo-image {
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
        transition: all 0.3s ease;
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

    /* Mobile optimizations */
    @media (max-width: 768px) {
        .overlay-icon {
            font-size: 1.5rem;
        }

        .loading-spinner {
            width: 32px;
            height: 32px;
        }

        .photo-loading {
            min-height: 150px;
        }
    }

    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        .photo-masonry-item,
        .photo-image,
        .photo-overlay,
        .overlay-icon {
            transition: none !important;
            animation: none !important;
        }

        .spinner-ring {
            animation: none !important;
            border-top-color: transparent;
        }
    }

    /* High contrast mode support */
    @media (prefers-contrast: more) {
        .photo-masonry-item {
            border-width: 2px;
            border-color: rgba(255, 85, 85, 0.8);
        }

        .photo-overlay {
            background: rgba(0, 0, 0, 0.8);
        }
    }
</style>

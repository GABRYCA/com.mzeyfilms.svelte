<script>
    import {onMount} from "svelte";
    import { getCollectionCoverImage, getPhotoThumbnail, getModalImage } from '$lib/utils/imageOptimization.js';
    import Masonry from '$lib/components/Masonry.svelte';
    import PhotoMasonry from '$lib/components/PhotoMasonry.svelte';

    let {data} = $props();
    const {content} = data;

    let selectedFolder = $state(null);
    let showModal = $state(false);
    let selectedImage = $state(null);
    let currentImageIndex = $state(0);
    let searchTerm = $state('');

    // Masonry configuration
    let masonryWidth = $state(0);
    let masonryHeight = $state(0);
    const minColWidth = 280;
    const gap = 20;

    // Filter folders based on search
    const filteredContent = $derived(
        content.filter(folder =>
            folder.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });

        // Handle keyboard navigation for modal
        const handleKeydown = (e) => {
            if (!showModal) return;

            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            }
        };

        // Handle touch gestures for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        const handleTouchStart = (e) => {
            if (!showModal) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            if (!showModal) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next image
                    navigateImage(1);
                } else {
                    // Swipe right - previous image
                    navigateImage(-1);
                }
            }
        };

        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('touchstart', handleTouchStart, {passive: true});
        document.addEventListener('touchend', handleTouchEnd, {passive: true});

        return () => {
            document.removeEventListener('keydown', handleKeydown);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    });

    function openFolder(folder) {
        selectedFolder = selectedFolder?.id === folder.id ? null : folder;
    }

    function openModal(image, images) {
        selectedImage = image;
        currentImageIndex = images.findIndex(img => img.id === image.id);
        showModal = true;
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        showModal = false;
        selectedImage = null;
        document.body.style.overflow = '';
    }

    function navigateImage(direction) {
        if (!selectedFolder?.expand?.images_via_folder) return;

        const images = selectedFolder.expand.images_via_folder;
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        selectedImage = images[currentImageIndex];
    }

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
                "thumbnailUrl": getPhotoThumbnail(image.url).src
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
                "thumbnailUrl": getPhotoThumbnail(image.url).src
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

    <!-- Preload critical images -->
    {#if content.length > 0 && content[0].expand?.images_via_folder?.length > 0}
        {@const firstImage = getCollectionCoverImage(content[0].expand.images_via_folder[0].url)}
        <link rel="preload" as="image" href={firstImage.src} fetchpriority="high">
    {/if}

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

    <!--(JSON-LD) for Image Gallery -->
    {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<div class="container-fluid px-3" data-aos="fade-up" data-aos-duration="600">
    <!-- Header Section -->
    <div class="row justify-content-center mb-4 mt-4">
        <div class="col-12 col-lg-10">
            <div class="modern-card p-4 text-center">
                <h1 class="enhanced-text display-4 mb-3">Photos</h1>
                <p class="theme-text-secondary mb-4">
                    Discover {data.totalImages} photos across {data.totalFolders} collections
                </p>

                <!-- Search Bar -->
                <div class="row justify-content-center">
                    <div class="col-12 col-md-6">
                        <div class="input-group theme-input-group">
                            <span class="input-group-text theme-input-addon">
                                <i class="fas fa-search theme-text-primary"></i>
                            </span>
                            <input
                                    type="text"
                                    class="form-control theme-input"
                                    placeholder="Search collections..."
                                    bind:value={searchTerm}
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Collections Grid -->
    <div class="row justify-content-center g-4 mb-4">
        {#each filteredContent as folder (folder.id)}
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="collection-card modern-card overflow-hidden hover-lift"
                     class:active={selectedFolder?.id === folder.id}
                     role="button"
                     tabindex="0"
                     onclick={() => openFolder(folder)}
                     onkeydown={(e) => e.key === 'Enter' && openFolder(folder)}>

                    <!-- Collection Cover -->
                    <div class="collection-cover position-relative">
                        {#if folder.expand?.images_via_folder?.length > 0}
                            {@const coverImage = getCollectionCoverImage(folder.expand.images_via_folder[0].url)}
                            <img
                                    src={coverImage.src}
                                    srcset={coverImage.srcset}
                                    sizes="(max-width: 576px) 240px, (max-width: 768px) 280px, (max-width: 992px) 350px, 400px"
                                    alt="Cover for {folder.name}"
                                    class="collection-cover-img"
                                    loading="lazy"
                            >
                            <div class="collection-overlay">
                                <div class="collection-info text-center">
                                    <h3 class="enhanced-text-light h4 mb-2">{folder.name}</h3>
                                    <span class="badge theme-badge">
                                        {folder.expand.images_via_folder.length}
                                        {folder.expand.images_via_folder.length === 1 ? 'photo' : 'photos'}
                                    </span>
                                </div>
                            </div>
                        {:else}
                            <div class="empty-collection">
                                <i class="fas fa-folder-open theme-text-secondary display-1"></i>
                                <h3 class="theme-text-primary h4 mt-3 mb-2">{folder.name}</h3>
                                <p class="theme-text-secondary">Empty collection</p>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Selected Collection Photos -->
    {#if selectedFolder?.expand?.images_via_folder?.length > 0}
        <div class="row justify-content-center mt-3" data-aos="fade-up" data-aos-duration="400">
            <div class="col-12">
                <div class="modern-card p-4">
                    <div class="collection-header mb-4">
                        <div class="d-flex justify-content-lg-between align-items-start gap-3">
                            <h2 class="enhanced-text text-center text-lg-start h3 mb-0">{selectedFolder.name}</h2>
                            <button
                                    class="btn theme-button rounded-pill px-3 py-2 mx-auto me-lg-1"
                                    onclick={() => selectedFolder = null}>
                                <i class="fas fa-times me-md-1 mx-auto"></i>
                                <span class="d-none d-sm-inline">Close</span>
                            </button>
                        </div>
                    </div>

                    <!-- Photos Masonry -->
                    <Masonry
                        items={selectedFolder.expand.images_via_folder}
                        {minColWidth}
                        {gap}
                        animate={true}
                        class="col-12 px-0"
                        bind:masonryWidth
                        bind:masonryHeight
                    >
                        {#snippet children({item})}
                            <PhotoMasonry 
                                photo={item} 
                                folderName={selectedFolder.name}
                                onClick={(image) => openModal(image, selectedFolder.expand.images_via_folder)}
                            />
                        {/snippet}
                    </Masonry>
                </div>
            </div>
        </div>
    {/if}

    <!-- No Results Message -->
    {#if filteredContent.length === 0}
        <div class="row justify-content-center mb-3">
            <div class="col-12 col-md-6 text-center">
                <div class="modern-card p-5">
                    <i class="fas fa-search theme-text-secondary display-1 mb-3"></i>
                    <h3 class="theme-text-primary">No collections found</h3>
                    <p class="theme-text-secondary">Try adjusting your search terms</p>
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- Image Modal -->
{#if showModal && selectedImage}
    {@const modalImage = getModalImage(selectedImage.url)}
    <div
            class="modal-backdrop fade show"
            role="button"
            tabindex="0"
            aria-label="Close modal"
            onclick={closeModal}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeModal(); } }}
    ></div>
    <div class="image-modal d-flex align-items-center justify-content-center">
        <div
                class="modal-content-custom position-relative"
                role="dialog"
                aria-modal="true"
                aria-label={selectedImage.title || selectedImage.name || 'Image viewer'}
                tabindex="0"
                onclick={e => e.stopPropagation()}
                onkeydown={(e) => { if (e.key === 'Escape') closeModal(); }}
        >
            <!-- Image -->
            <img
                    src={modalImage.src}
                    srcset={modalImage.srcset}
                    sizes="(max-width: 768px) 95vw, 90vw"
                    alt={selectedImage.title || selectedImage.name || 'Full size photo'}
                    class="modal-image"
            >
        </div>

        <!-- Close Button -->
        <button
                class="modal-close-btn"
                aria-label="Close modal"
                onclick={closeModal}
        >
            <i class="fas fa-times"></i>
        </button>

        <!-- Navigation Buttons -->
        {#if selectedFolder?.expand?.images_via_folder?.length > 1}
            <button
                    class="modal-nav-btn modal-nav-prev"
                    aria-label="Previous image"
                    onclick={() => navigateImage(-1)}
            >
                <i class="fas fa-chevron-left"></i>
            </button>
            <button
                    class="modal-nav-btn modal-nav-next"
                    aria-label="Next image"
                    onclick={() => navigateImage(1)}
            >
                <i class="fas fa-chevron-right"></i>
            </button>
        {/if}

        <!-- Image Info -->
        {#if selectedImage.title || selectedImage.description}
            <div class="modal-info">
                {#if selectedImage.title}
                    <h4 class="enhanced-text mb-1">{selectedImage.title}</h4>
                {/if}
                {#if selectedImage.description}
                    <p class="theme-text-secondary mb-0">{selectedImage.description}</p>
                {/if}
            </div>
        {/if}
    </div>
{/if}

<style>
    .collection-header h2 {
        word-break: break-word;
        line-height: 1.2;
    }

    /* Collection Cards */
    .collection-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        height: 280px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .collection-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(222, 226, 230, 0.8);
    }

    .collection-card.active {
        border: 2px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 15px 45px rgba(255, 255, 255, 0.2);
    }

    .collection-cover {
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
    }

    .collection-cover-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 1s ease;
        border-radius: inherit;
    }

    .collection-card:hover {
        transform: scale(1.1);
    }

    .collection-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.1) 0%,
                rgba(0, 0, 0, 0.3) 40%,
                rgba(0, 0, 0, 0.7) 100%
        );
        display: flex;
        align-items: flex-end;
        padding: 1.5rem;
        transition: all 0.4s ease;
    }

    .collection-card:hover .collection-overlay {
        background: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.2) 0%,
                rgba(0, 0, 0, 0.5) 30%,
                rgba(0, 0, 0, 0.8) 100%
        );
    }

    .collection-info {
        width: 100%;
    }

    .empty-collection {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
    }

    /* Theme Inputs */
    .theme-input-group .input-group-text {
        background: linear-gradient(135deg, rgba(248, 249, 250, 0.9), rgba(255, 255, 255, 0.7));
        border: 1px solid rgba(222, 226, 230, 0.8);
        border-right: none;
        color: #212529;
    }

    .theme-input {
        background: linear-gradient(135deg, rgba(248, 249, 250, 0.9), rgba(255, 255, 255, 0.7));
        border: 1px solid rgba(222, 226, 230, 0.8);
        border-left: none;
        color: #212529;
        backdrop-filter: blur(8px);
    }

    .theme-input:focus {
        background: linear-gradient(135deg, rgba(248, 249, 250, 1), rgba(255, 255, 255, 0.9));
        border-color: rgba(13, 110, 253, 0.5);
        box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
        color: #212529;
    }

    .theme-input::placeholder {
        color: rgba(108, 117, 125, 0.7);
    }

    .theme-badge {
        background: linear-gradient(135deg, rgba(248, 249, 250, 0.9), rgba(255, 255, 255, 0.8));
        color: #212529;
        font-size: 0.875rem;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        backdrop-filter: blur(4px);
    }

    /* Modal Styles */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1050;
        backdrop-filter: blur(4px);
        touch-action: manipulation;
    }

    .image-modal {
        position: fixed;
        inset: 0;
        z-index: 1051;
        padding: 2rem;
        touch-action: manipulation;
        user-select: none;
    }

    .modal-content-custom {
        max-width: 90vw;
        max-height: 90vh;
        margin: auto;
        position: relative;
        touch-action: manipulation;
    }

    .modal-image {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        user-select: none;
        pointer-events: none;
    }

    .modal-close-btn {
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: rgba(248, 249, 250, 0.9);
        border: 1px solid rgba(222, 226, 230, 0.8);
        color: #212529;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(8px);
        z-index: 1052;
    }

    .modal-close-btn:hover {
        background: rgba(248, 249, 250, 1);
        border-color: rgba(222, 226, 230, 1);
        transform: scale(1.1);
    }

    .modal-close-btn:active {
        transform: scale(0.95);
        background: rgba(222, 226, 230, 0.9);
    }

    .modal-nav-btn {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(248, 249, 250, 0.9);
        border: 1px solid rgba(222, 226, 230, 0.8);
        color: #212529;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(8px);
        z-index: 1052;
    }

    .modal-nav-btn:hover {
        background: rgba(248, 249, 250, 1);
        border-color: rgba(222, 226, 230, 1);
        transform: translateY(-50%) scale(1.1);
    }

    .modal-nav-btn:active {
        transform: translateY(-50%) scale(0.95);
        background: rgba(222, 226, 230, 0.9);
    }

    .modal-nav-prev {
        left: 1rem;
    }

    .modal-nav-next {
        right: 1rem;
    }

    .modal-info {
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        right: 1rem;
        text-align: center;
        color: #212529;
        text-shadow: 0 2px 8px rgba(255, 255, 255, 0.7);
        background: rgba(248, 249, 250, 0.9);
        padding: 1rem;
        border-radius: 8px;
        backdrop-filter: blur(8px);
        z-index: 1052;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
        .collection-card {
            height: 240px;
        }

        .collection-header .btn {
            font-size: 0.875rem;
            padding: 0.5rem 1rem !important;
        }

        .image-modal {
            padding: 0.5rem;
        }

        .modal-content-custom {
            max-width: 95vw;
            max-height: 85vh;
        }

        .modal-image {
            max-width: calc(100vw - 4.5rem); /* Account for navigation buttons */
            max-height: 75vh;
        }

        .modal-close-btn {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1rem;
            top: 0.5rem;
            right: 0.5rem;
        }

        .modal-nav-btn {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1rem;
        }

        .modal-nav-prev {
            left: 0.5rem;
        }

        .modal-nav-next {
            right: 0.5rem;
        }

        .modal-info {
            bottom: 0.5rem;
            left: 0.5rem;
            right: 0.5rem;
            font-size: 0.875rem;
            padding: 0.75rem;
        }
    }

    @media (max-width: 576px) {
        .collection-header {
            margin-bottom: 1rem !important;
        }

        .collection-header h2 {
            font-size: 1.25rem !important;
            margin-bottom: 0.5rem;
        }

        .collection-header .d-flex {
            flex-direction: column;
            align-items: stretch !important;
        }

        .collection-header .btn {
            align-self: flex-end;
            width: auto;
        }

        .modal-close-btn {
            width: 2rem;
            height: 2rem;
            font-size: 0.875rem;
        }

        .modal-nav-btn {
            width: 2rem;
            height: 2rem;
            font-size: 0.875rem;
        }

        .modal-nav-prev {
            left: 0.25rem;
        }

        .modal-nav-next {
            right: 0.25rem;
        }

        .modal-info {
            bottom: 0.25rem;
            left: 0.25rem;
            right: 0.25rem;
            font-size: 0.8rem;
            padding: 0.5rem;
        }

        .modal-info h4 {
            font-size: 1rem !important;
            margin-bottom: 0.25rem !important;
        }
    }

    /* Focus and accessibility */
    .collection-card:focus-visible {
        outline: 2px solid rgba(13, 110, 253, 0.6);
        outline-offset: 4px;
    }

    .modal-close-btn:focus-visible,
    .modal-nav-btn:focus-visible {
        outline: 2px solid rgba(13, 110, 253, 0.6);
        outline-offset: 2px;
    }

    /* Loading states */
    .collection-cover-img,
    .modal-image {
        background: linear-gradient(135deg, rgba(248, 249, 250, 0.5), rgba(255, 255, 255, 0.3));
        transition: opacity 0.3s ease;
    }

    .collection-cover-img:not([src]),
    .modal-image:not([src]) {
        opacity: 0;
    }

    /* Aspect ratio preservation during loading */
    .collection-cover-img {
        aspect-ratio: 4/3;
        object-fit: cover;
    }

    /* Improve image quality on high-DPI displays */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .collection-cover-img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
        }
    }

    /* Smooth animations */
    @media (prefers-reduced-motion: no-preference) {
        .collection-card {
            animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) backwards;
        }

        .collection-card:nth-child(1) {
            animation-delay: 0.1s;
        }

        .collection-card:nth-child(2) {
            animation-delay: 0.2s;
        }

        .collection-card:nth-child(3) {
            animation-delay: 0.3s;
        }

        .collection-card:nth-child(4) {
            animation-delay: 0.4s;
        }

        .collection-card:nth-child(n+5) {
            animation-delay: 0.5s;
        }
    }
</style>



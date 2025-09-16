<script>
    import {onMount} from "svelte";
    import {getCollectionCoverImage, getPhotoThumbnail, getModalImage} from '$lib/utils/imageOptimization.js';
    import Masonry from '$lib/components/Masonry.svelte';
    import PhotoMasonry from '$lib/components/PhotoMasonry.svelte';

    let {data} = $props();
    const {content} = data;

    let showModal = $state(false);
    let selectedImage = $state(null);
    let currentImageIndex = $state(0);

    // Masonry configuration
    let masonryWidth = $state(0);
    let masonryHeight = $state(0);
    const minColWidth = 280;
    const gap = 20;

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
        if (!content) return;

        const images = content;
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        selectedImage = images[currentImageIndex];
    }
</script>

<div class="container-fluid px-3 pt-lg-4" data-aos="fade-up" data-aos-duration="600">
    <!-- Header Section -->
    <div class="row justify-content-center mb-4 mt-4">
        <div class="col-12 col-lg-10">
            <div class="modern-card p-4 text-center">
                <h1 class="enhanced-text display-4 mb-3">Cinematography</h1>
            </div>
        </div>
    </div>

    <!-- Selected Collection Photos -->
    {#if content?.length > 0}
        <div class="row justify-content-center mt-3" data-aos="fade-up" data-aos-duration="400">
            <div class="col-12">
                <div class="modern-card p-4">

                    <!-- Photos Masonry -->
                    <Masonry
                            items={content}
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
                                    onClick={(image) => openModal(image, content)}
                            />
                        {/snippet}
                    </Masonry>
                </div>
            </div>
        </div>
    {/if}

    <!-- No Results Message -->
    {#if content?.length === 0}
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
        {#if content?.length > 1}
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

    @media (max-width: 768px) {
        .image-modal {
            padding: 0.5rem;
        }

        .modal-content-custom {
            max-width: 95vw;
            max-height: 85vh;
        }

        .modal-image {
            max-width: calc(100vw - 4.5rem);
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

    .modal-close-btn:focus-visible,
    .modal-nav-btn:focus-visible {
        outline: 2px solid rgba(13, 110, 253, 0.6);
        outline-offset: 2px;
    }
</style>



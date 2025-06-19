<script>
    import {onMount} from "svelte";
    import MasonryPhoto from "$lib/components/MasonryPhoto.svelte";

    let {data} = $props();
    const {content} = data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

</script>

<!-- Photos Gallery -->
<div class="container-xxl pb-5" data-aos="fade-up" data-aos-duration="400">
    <div class="row align-items-center" style="min-height: 80vh">
        <div class="col">
            <!-- Page Header -->
            <div class="row text-center justify-content-center mb-4 mb-md-5 pt-4 pt-md-5">
                <div class="col-lg-10">
                    <div class="theme-main-container theme-shadow p-4 p-md-5">
                        <h1 class="display-4 theme-text-primary mb-3">Photo Gallery</h1>
                        <p class="lead theme-text-secondary d-none d-md-block">Capturing moments, telling stories
                            through imagery</p>
                        <p class="lead theme-text-secondary d-md-none">Visual stories captured</p>
                    </div>
                </div>
            </div>

            <!-- Photo Collections -->
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="gallery-container theme-main-container theme-shadow p-3 p-md-4">
                        {#each content as folder, index (folder.id)}
                            <div class="photo-collection mb-4">
                                <div class="collection-header theme-folder-container theme-shadow-hover">
                                    <button class="collection-toggle btn-folder w-100" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#collapse{index}"
                                            aria-expanded="false" aria-controls="collapse{index}">
                                        <div class="collection-title">
                                            <i class="fas fa-folder-open me-3"></i>
                                            <span class="folder-name">{folder.name}</span>
                                            <i class="fas fa-chevron-down toggle-icon ms-auto"></i>
                                        </div>
                                    </button>
                                </div>

                                <div class="collapse collection-content" id="collapse{index}">
                                    <div class="collection-gallery p-4">
                                        {#if !folder.expand || folder.expand.images_via_folder === 0}
                                            <div class="empty-folder text-center p-5">
                                                <i class="fas fa-images empty-icon mb-3"></i>
                                                <p class="h5 theme-text-secondary">No images in this collection yet</p>
                                            </div>
                                        {:else}
                                            <div class="masonry-grid">
                                                {#each folder.expand.images_via_folder as image (image.id)}
                                                    <MasonryPhoto src={image}/>
                                                {/each}
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .gallery-container {
        border-radius: 20px;
    }

    .photo-collection {
        position: relative;
    }

    .collection-header {
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .collection-toggle {
        background: transparent;
        border: none;
        padding: 1.5rem;
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 500;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .collection-toggle::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(244, 162, 97, 0.1), transparent);
        transition: left 0.6s ease;
    }

    .collection-toggle:hover::before {
        left: 100%;
    }

    .collection-toggle:hover {
        color: var(--accent-primary);
        background: rgba(244, 162, 97, 0.05);
    }

    .collection-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .folder-name {
        flex: 1;
        text-align: left;
        margin-left: 0.5rem;
    }

    .toggle-icon {
        transition: transform 0.3s ease;
        color: var(--accent-primary);
    }

    .collection-toggle:global([aria-expanded="true"]) .toggle-icon {
        transform: rotate(180deg);
    }

    .collection-content {
        border-top: 1px solid var(--border-secondary);
    }

    .collection-gallery {
        background: linear-gradient(135deg, rgba(31, 31, 31, 0.3), rgba(20, 20, 20, 0.2));
        border-radius: 0 0 12px 12px;
    }

    .empty-folder {
        background: linear-gradient(135deg, rgba(31, 31, 31, 0.4), rgba(20, 20, 20, 0.3));
        border-radius: 12px;
        border: 1px dashed var(--border-secondary);
    }

    .empty-icon {
        font-size: 3rem;
        color: var(--text-muted);
        opacity: 0.5;
    }

    .masonry-grid {
        column-count: 2;
        column-gap: 1.5rem;
        column-fill: balance;
    }

    @media (max-width: 992px) {
        .masonry-grid {
            column-count: 2;
            column-gap: 1rem;
        }
    }

    @media (max-width: 576px) {
        .masonry-grid {
            column-count: 1;
            column-gap: 0;
        }
    }

    @media (max-width: 768px) {
        .collection-toggle {
            padding: 1rem;
            font-size: 1rem;
        }

        .collection-title i {
            font-size: 0.9rem;
        }

        .empty-icon {
            font-size: 2rem;
        }

        .collection-gallery {
            padding: 1rem !important;
        }
    }
</style>



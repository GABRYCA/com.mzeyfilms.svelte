<script>
    import {onMount} from "svelte";
    import UserVideo from "$lib/components/UserVideo.svelte";
    import {deserialize} from "$app/forms";

    let {data} = $props();
    let {videos} = $state(data);
    let isFetching = $state(false);
    let page = 1;
    let loadedAllPages = $state(false);
    let y = $state(0);

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    async function loadMoreVideos() {
        if (isFetching) return;
        isFetching = true;

        page += 1;

        const formData = new FormData();
        formData.append('page', page);

        const response = await fetch('?/videos', {
            method: 'POST',
            body: formData
        });

        const results = deserialize(await response.text());
        if (results.type === 'success') {
            if (results.data.status === 200) {
                if (results.data.body.videos.length > 0) {
                    videos.push(...results.data.body.videos);
                }
            } else if (results.data.status === 404) {
                loadedAllPages = true;
            }
        }

        isFetching = false;
    }

    function handleScroll(event) {
        const target = event.target.body;
        if (y >= target.clientHeight / 4) {
            if (!loadedAllPages) loadMoreVideos();
        }
    }
</script>

<!-- Videos Gallery -->
<svelte:window onscroll={handleScroll} bind:scrollY={y}/>

<div class="container-xxl pb-5">
    <div class="row align-items-center" style="min-height: 80vh">
        <div class="col">
            <!-- Page Header -->
            <div class="row text-center justify-content-center mb-4 mb-md-5 pt-4 pt-md-5" data-aos="fade-up">
                <div class="col-lg-10">
                    <div class="theme-main-container theme-shadow p-4 p-md-5">
                        <h1 class="display-4 theme-text-primary mb-3">Video Portfolio</h1>
                        <p class="lead theme-text-secondary d-none d-md-block">Cinematic stories that move and
                            inspire</p>
                        <p class="theme-text-secondary d-md-none">Cinematic stories</p>
                    </div>
                </div>
            </div>

            <!-- Videos Content -->
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="videos-container theme-main-container theme-shadow p-3 p-md-4">
                        {#if !videos || videos.length === 0}
                            <div class="empty-state text-center p-4 p-md-5">
                                <i class="fas fa-video empty-icon mb-4"></i>
                                <h3 class="theme-text-primary mb-3">No Videos Available</h3>
                                <p class="theme-text-secondary">Check back soon for new content</p>
                            </div>
                        {:else}
                            <div class="videos-grid">
                                {#each videos as video, index (video.id)}
                                    <div class="video-item" data-aos="fade-up" data-aos-delay={index * 100}>
                                        <UserVideo src={video.url} title={video.name}/>
                                    </div>
                                    {#if index < videos.length - 1}
                                        <hr class="video-divider">
                                    {/if}
                                {/each}
                            </div>
                            <!-- Loading State -->
                            {#if isFetching}
                                <div class="loading-indicator text-center mt-4 mt-md-5">
                                    <div class="spinner">
                                        <i class="fas fa-circle-notch fa-spin theme-text-primary fa-2x"></i>
                                    </div>
                                    <p class="theme-text-secondary mt-3">Loading more videos...</p>
                                </div>
                            {/if}
                            <!-- End of Content -->
                            {#if loadedAllPages && !isFetching}
                                <div class="end-indicator text-center mt-4 mt-md-5 p-3 p-md-4">
                                    <i class="fas fa-check-circle theme-text-primary mb-3 fa-2x"></i>
                                    <p class="theme-text-secondary">All videos loaded</p>
                                </div>
                            {/if}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .videos-container {
        border-radius: 20px;
    }

    .videos-grid {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .video-item {
        transition: all 0.3s ease;
        position: relative;
    }

    .video-divider {
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border-primary), transparent);
        margin: 2rem 0;
        opacity: 0.6;
    }

    .empty-state {
        background: linear-gradient(135deg, rgba(31, 31, 31, 0.4), rgba(20, 20, 20, 0.3));
        border-radius: 16px;
        border: 1px dashed var(--border-secondary);
        min-height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .empty-icon {
        font-size: 4rem;
        color: var(--text-muted);
        opacity: 0.6;
    }

    .loading-indicator {
        padding: 2rem;
    }

    .spinner {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .end-indicator {
        background: linear-gradient(135deg, rgba(244, 162, 97, 0.05), rgba(231, 111, 81, 0.02));
        border-radius: 12px;
        border: 1px solid var(--border-primary);
    }

    @media (max-width: 768px) {
        .videos-grid {
            gap: 1.5rem;
        }

        .empty-icon {
            font-size: 3rem;
        }

        .video-divider {
            margin: 1.5rem 0;
        }
    }
</style>
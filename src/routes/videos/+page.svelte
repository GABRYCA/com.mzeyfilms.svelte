<script>
    import {onMount} from "svelte";
    import UserVideo from "$lib/components/UserVideo.svelte";
    import {deserialize} from "$app/forms";

    let {data} = $props();
    let {videos} = $state(data);
    let isFetching = false;
    let page = 1;
    let loadedAllPages = false;
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

<svelte:window onscroll={handleScroll} bind:scrollY={y}/>

<div class="container-xxl pt-lg-5" data-aos="zoom-in" data-aos-duration="400">
    <div class="row align-items-center" style="min-height: 78vh">
        <div class="col">
            <div class="row text-center justify-content-center px-2 pt-4 pt-lg-2 mb-3">
                <div class="col pt-4 pb-2 rounded-4">
                    <h1 class="enhanced-text display-4 mb-3">Videos</h1>
                    <p class="lead fs-3 theme-text-secondary mb-4 hero-subtitle">
                        Browse my video portfolio
                    </p>
                </div>
            </div>
            <!-- Video Gallery -->
            <div class="row text-center justify-content-center pb-2">
                    {#if !videos || videos.length === 0}
                        <p class="h3 my-auto py-2 theme-text-primary">No videos found</p>
                    {:else}
                        {#each videos as video, index (video.id)}
                            <div class="row" data-aos="zoom-in">
                                <div class="col">
                                    <UserVideo src={video.url} title={video.name}/>
                                </div>
                            </div>
                            {#if index < videos.length - 1}
                                <hr class="text-white">
                            {/if}
                        {/each}
                    {/if}
            </div>
        </div>
    </div>
</div>

<style>
    p {
        color: #212529;
    }
</style>
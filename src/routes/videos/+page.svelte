<script>
    import {onMount} from "svelte";
    import UserVideo from "$lib/components/UserVideo.svelte";
    let { data } = $props();
    const { videos } = data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<div class="container-xxl" data-aos="zoom-in" data-aos-duration="400">
    <div class="row align-items-center" style="min-height: 78vh">
        <div class="col">
            <div class="row text-center justify-content-center px-2 pt-2 pt-2 mb-3">
                <div class="col pt-4 pb-3 bg-light bg-opacity-10 rounded-4">
                    <p class="h1">Videos:</p>
                </div>
            </div>
            <!-- Video Gallery -->
            <div class="row text-center justify-content-center px-2 pb-2">
                <div class="col pt-2 pb-2 bg-light bg-opacity-10 rounded-4">
                    {#if !videos || videos.length === 0}
                        <p class="h3 my-auto py-2">No videos found</p>
                    {:else}
                        {#each videos as video, index (video.id)}
                            <div class="row" data-aos="zoom-in">
                                <div class="col">
                                    <UserVideo src={video.url} title={video.name} />
                                </div>
                            </div>
                            {#if index < videos.length - 1}
                                <hr>
                            {/if}
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
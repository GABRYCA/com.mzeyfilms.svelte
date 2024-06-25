<script>
    import {onMount} from "svelte";
    import UserVideo from "$lib/components/UserVideo.svelte";
    export let data;
    const { videos } = data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<svelte:head>
    <!-- meta -->
    <title>MZEYFILMS - Videos</title>
    <meta name="description"
          content="MZEYFILMS, Filmmaker, Photographer, Aspirant Cinematographer, Always searching for new stories to tell. ">
</svelte:head>

<div class="container-xxl" data-aos="zoom-in" data-aos-duration="400">
    <div class="row text-center justify-content-center px-2 pt-2 pt-2">
        <div class="col pt-4 pb-3 bg-light bg-opacity-10 rounded-4">
            <p class="h1">Videos:</p>
        </div>
    </div>
    <hr class="text-light">
    <!-- Video Gallery -->
    <div class="row text-center justify-content-center px-2 pb-2">
        <div class="col pt-2 pb-2 bg-light bg-opacity-10 rounded-4">
            {#if !videos || videos.length === 0}
                <p class="h3 my-auto py-2">Found no videos</p>
            {:else}
                {#each videos as video, index (video.id)}
                    <div class="row">
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
<script>
    import {onMount} from "svelte";
    import UserVideo from "$lib/components/UserVideo.svelte";
    export let data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    const videos = data.body.videos;

    // Remove video extension and make object array of videos with src and title
    const videoArray = videos.map((video) => {
        const videoTitle = video.split('\\').pop().split('.').slice(0, -1).join('.');
        return {
            src: video,
            title: videoTitle
        }
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
            {#if videoArray.length === 0}
                <p class="h3 my-auto py-2">Found no videos</p>
            {/if}
            {#each videoArray as video, index (video.src)}
                <div class="row">
                    <div class="col">
                        <UserVideo src={video.src} title={video.title}/>
                    </div>
                </div>
                {#if index < videoArray.length - 1}
                    <hr>
                {/if}
            {/each}
        </div>
    </div>
</div>
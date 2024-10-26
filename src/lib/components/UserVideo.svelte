<script>
    let { src, title } = $props();

    const videoId = src.split('/').pop();
</script>

<div class="container-fluid">
    <div class="row text-center justify-content-center">
        <div class="col bg-light bg-opacity-10 pt-3 pb-1 rounded-4">
            <p class="h3">{title}</p>
        </div>
    </div>
    <!--<div class="row text-center justify-content-center mt-2 mb-1">
        <div class="col px-1">
            <span class="text-muted">Click the <i class="fa-solid fa-play ms-1 text-secondary"></i> button to start the video</span>
        </div>
    </div>-->
    <div class="row mt-3">
        <div class="col-12">
            <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item w-100 video rounded-3" src={"https://www.youtube.com/embed/" + videoId} title={title} allowfullscreen></iframe>
            </div>
        </div>
    </div>
</div>

<style>
    .video {
        height: 50vh;
    }

    /* mobile */
    @media (max-width: 768px) {
        .video {
            height: 30vh;
        }
    }
</style>
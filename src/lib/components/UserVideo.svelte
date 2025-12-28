<script>
    let {src, title} = $props();

    let videoId = $derived(src.split('/').pop());
</script>


<div class="row text-center justify-content-center">
    <div class="col pt-3 pb-1 rounded-4">
        <p class="h3 pt-1 theme-text-primary">{title}</p>
    </div>
</div>
<div class="row mt-3">
    <div class="col-12">
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item w-100 video rounded-3 theme-folder-container theme-shadow"
                    src={"https://www.youtube.com/embed/" + videoId} title={title} allowfullscreen></iframe>
        </div>
    </div>
</div>

<style>
    .video {
        height: 50vh;
        border: 1px solid rgba(255, 255, 255, 0.3);
        animation: glow-subtle 3s infinite ease-in-out;
    }

    @keyframes glow-subtle {
        0% {
            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.15);
        }
        50% {
            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.25);
        }
        100% {
            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.15);
        }
    }

    @media (max-width: 768px) {
        .video {
            height: 30vh;
        }
    }
</style>
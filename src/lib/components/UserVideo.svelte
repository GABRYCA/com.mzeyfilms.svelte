<script>
    export let src;
    export let title;
</script>

<div class="container-fluid">
    <div class="row text-center justify-content-center">
        <div class="col bg-light bg-opacity-10 pt-3 pb-1 rounded-4">
            <p class="h3">{title}</p>
        </div>
    </div>
    <div class="row text-center justify-content-center mt-2">
        <div class="col px-1">
            <!-- Video -->
            <video class="card-img-top rounded-2" src="{src}" controls preload="metadata"></video>
        </div>
    </div>
</div>

<style>
    video {
        max-height: 500px;
        width: 100%;
        object-fit: contain;
    }
</style>
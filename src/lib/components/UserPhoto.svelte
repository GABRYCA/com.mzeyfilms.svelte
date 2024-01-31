<script>
    export let src;
</script>

<div class="col-12 col-md-6 mt-3 my-md-auto py-md-2">
    <a href="{src}" target="_blank"><img src="{src}" class="img-fluid rounded-4" alt="Gallery Content"></a>
</div>

<style>
    .img-fluid {
        max-width: 100%;
        height: auto;
        transition: all 0.15s ease-in-out;
    }

    .img-fluid:hover {
        transform: scale(1.02);
    }
</style>
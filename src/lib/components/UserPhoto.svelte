<script>
    let {src} = $props();
    let isLoading = $state(true);

    function handleImageLoad() {
        isLoading = false;
    }
</script>

<div class="col-12 col-md-6 mt-3 my-md-auto py-md-2">
    {#if isLoading}
        <div class="spinner-border text-danger-emphasis align-self-center" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    {/if}
    <a href="{src.url}" target="_blank">
        <img src="{src.url}" loading="lazy" class="img-fluid rounded-4 theme-shadow-hover" alt="Gallery Content"
             onload={handleImageLoad}>
    </a>
</div>

<style>
    .img-fluid {
        max-width: 100%;
        height: auto;
        transition: all 0.3s ease-in-out;
        border: 1px solid rgba(255, 85, 85, 0.2);
    }

    .img-fluid:hover {
        transform: scale(1.03);
        border-color: rgba(255, 85, 85, 0.4);
    }
</style>
<script>
    export let src;
    let isLoading = true;

    $: if (src) {
        isLoading = false;
    }
</script>

<div class="col-12 col-md-6 mt-3 my-md-auto py-md-2">
    {#if isLoading}
        <div class="spinner-border text-danger-emphasis align-self-center" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    {:else}
        <a href="{src}" target="_blank"><img src="{src}" loading="lazy" class="img-fluid rounded-4" alt="Gallery Content"></a>
    {/if}
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
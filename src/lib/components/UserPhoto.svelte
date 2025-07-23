<script>
    let {src, folderName} = $props();
    let isLoading = $state(true);

    function handleImageLoad() {
        isLoading = false;
    }

    const altText = $derived(src.title || src.name || `Photo from ${folderName || 'MZEYFILMS gallery'}`);
    const imageTitle = $derived(src.description || src.title || `MZEYFILMS - ${altText}`);
</script>

<div class="col-12 col-md-6 mt-3 my-md-auto py-md-2" itemscope itemtype="https://schema.org/ImageObject">
    {#if isLoading}
        <div class="spinner-border text-danger-emphasis align-self-center" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    {/if}
    <a href="{src.url}" target="_blank" itemprop="contentUrl">
        <img 
            src="{src.url}" 
            loading="lazy" 
            class="img-fluid rounded-4 theme-shadow-hover" 
            alt="{altText}"
            title="{imageTitle}"
            itemprop="url"
            onload={handleImageLoad}>
    </a>
    <!-- Hidden structured data for SEO -->
    <meta itemprop="name" content="{altText}">
    <meta itemprop="description" content="{imageTitle}">
    <meta itemprop="author" content="MZEYFILMS">
    <meta itemprop="copyrightHolder" content="MZEYFILMS">
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
<script>
    let {src} = $props();
    let isLoading = $state(true);

    function handleImageLoad() {
        isLoading = false;
    }
</script>

<div class="col-12 col-md-6 mt-3 my-md-auto py-md-2">
    {#if isLoading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <span class="visually-hidden">Loading...</span>
        </div>
    {/if}
    <a href="{src.url}" target="_blank" class="photo-link" aria-label="View full size image">
        <img src="{src.url}" loading="lazy" class="img-fluid rounded-4 theme-shadow-hover photo-image" alt="Gallery Content"
             onload={handleImageLoad}>
    </a>
</div>

<style>
    .photo-link {
        display: block;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .photo-image {
        max-width: 100%;
        height: auto;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid var(--border-primary);
        box-shadow: var(--shadow-primary);
    }

    .photo-link:hover .photo-image {
        transform: scale(1.02) translateY(-2px);
        border-color: var(--accent-primary);
        box-shadow: 0 12px 40px rgba(244, 162, 97, 0.3);
    }

    .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        flex-direction: column;
        gap: 1rem;
    }

    .loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 2px solid var(--border-secondary);
        border-top: 2px solid var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
        .photo-link:hover .photo-image {
            transform: scale(1.01);
            box-shadow: 0 8px 25px rgba(244, 162, 97, 0.25);
        }
        
        .loading-state {
            min-height: 150px;
        }
        
        .loading-spinner {
            width: 1.5rem;
            height: 1.5rem;
        }
    }

    @media (max-width: 576px) {
        .photo-image {
            border-radius: 12px !important;
        }
        
        .loading-state {
            min-height: 120px;
        }
    }
</style>
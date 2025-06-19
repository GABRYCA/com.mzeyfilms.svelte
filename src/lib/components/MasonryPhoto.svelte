<script>
    let {src} = $props();
    let isLoading = $state(true);
    let imageRef = $state();

    function handleImageLoad() {
        isLoading = false;
    }
</script>

<div class="masonry-item">
    {#if isLoading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <span class="visually-hidden">Loading...</span>
        </div>
    {/if}
    <a href="{src.url}" target="_blank" class="photo-link" aria-label="View full size image">
        <img 
            bind:this={imageRef}
            src="{src.url}" 
            loading="lazy" 
            class="masonry-image" 
            alt="Gallery Content"
            onload={handleImageLoad}
        >
    </a>
</div>

<style>
    .masonry-item {
        break-inside: avoid;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
    }

    .photo-link {
        display: block;
        text-decoration: none;
        transition: all 0.3s ease;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .masonry-image {
        width: 100%;
        height: auto;
        display: block;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid var(--border-primary);
    }

    .photo-link:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(244, 162, 97, 0.3);
    }

    .photo-link:hover .masonry-image {
        border-color: var(--accent-primary);
    }

    .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        flex-direction: column;
        gap: 1rem;
        background: linear-gradient(135deg, rgba(31, 31, 31, 0.1), rgba(20, 20, 20, 0.05));
        border-radius: 16px;
        border: 1px solid var(--border-secondary);
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

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .masonry-item {
            margin-bottom: 1rem;
        }
        
        .photo-link {
            border-radius: 12px;
        }
        
        .photo-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(244, 162, 97, 0.25);
        }
        
        .loading-state {
            min-height: 150px;
            border-radius: 12px;
        }
        
        .loading-spinner {
            width: 1.5rem;
            height: 1.5rem;
        }
    }

    @media (max-width: 576px) {
        .masonry-item {
            margin-bottom: 0.75rem;
        }
        
        .loading-state {
            min-height: 120px;
        }
    }
</style>

<script>
    /**
     * AnimatedImage — A single animated image card with noir hover effect.
     *
     * Animated AVIF is rendered with a native image element: the low-resolution
     * preview reserves the card's aspect ratio and stays visible while the
     * HD preview downloads. The HD image is revealed both by its load event
     * and by a `complete` check on mount, which covers images restored from
     * the bfcache or already cached before hydration.
     */

    let {
        src,
        lowResSrc = null,
        title,
        href = null,
        alt = title,
    } = $props();

    let isExternal = $derived(href?.startsWith('http'));
    let hasLowRes = $derived(typeof lowResSrc === 'string' && lowResSrc.trim().length > 0);

    let loaded = $state(false);
    let failed = $state(false);
    let lowResFailed = $state(false);

    let showLowRes = $derived(hasLowRes && !lowResFailed);
    // Without a working low-res preview the card needs its own aspect ratio,
    // otherwise it would collapse until the HD image finishes decoding.
    let needsFallbackBox = $derived(!showLowRes);

    /**
     * Cached / bfcache-restored images can finish loading before hydration
     * attaches the load handler. The attachment re-checks the element state.
     * @param {HTMLImageElement} node
     */
    function syncCachedImage(node) {
        if (!node.complete) return;

        if (node.naturalWidth > 0) {
            loaded = true;
            failed = false;
        } else {
            loaded = false;
            failed = true;
        }
    }

    function handleLoad() {
        loaded = true;
        failed = false;
    }

    function handleError() {
        loaded = false;
        failed = true;
    }
</script>

{#snippet cardContent()}
    {#if showLowRes}
        <img
                src={lowResSrc}
                alt=""
                class="low-res-image w-100 h-auto"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                onerror={() => (lowResFailed = true)}
        />
    {/if}

    <img
            {@attach syncCachedImage}
            {src}
            {alt}
            class={[
                'animated-image position-absolute top-0 start-0 w-100 h-100',
                { 'is-loaded': loaded, 'is-failed': failed }
            ]}
            loading="lazy"
            decoding="async"
            onload={handleLoad}
            onerror={handleError}
    />

    <div class="animated-image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <span class="animated-image-title">{(title ?? '').toUpperCase()}</span>
    </div>
{/snippet}

{#if href}
    <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            class="animated-image-card d-block position-relative overflow-hidden {needsFallbackBox ? 'is-placeholder-only' : ''} {failed ? 'is-failed' : ''}"
            aria-label={title}
            data-sveltekit-preload-data="hover"
    >
        {@render cardContent()}
    </a>
{:else}
    <div
            class="animated-image-card d-block position-relative overflow-hidden {needsFallbackBox ? 'is-placeholder-only' : ''} {failed ? 'is-failed' : ''}"
    >
        {@render cardContent()}
    </div>
{/if}

<style>
    .animated-image-card {
        border-radius: 8px;
        cursor: default;
        text-decoration: none;
        display: block;
        background: #121212;
        min-height: 180px;
    }

    .animated-image-card.is-placeholder-only {
        aspect-ratio: 16 / 9;
        min-height: 0;
    }

    a.animated-image-card {
        cursor: pointer;
    }

    .low-res-image {
        display: block;
        object-fit: cover;
        filter: blur(10px);
        transform: scale(1.05);
    }

    .animated-image {
        display: block;
        object-fit: cover;
        opacity: 0;
        z-index: 1;
        transition:
            opacity 0.5s ease-in-out,
            filter 0.45s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .animated-image.is-loaded {
        opacity: 1;
    }

    .animated-image-overlay {
        background: rgba(0, 0, 0, 0);
        transition: background 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 2;
    }

    .animated-image-title {
        color: #ffffff;
        font-family: 'Raleway', sans-serif;
        font-weight: 700;
        font-size: clamp(0.8rem, 2.5vw, 1.4rem);
        letter-spacing: 0.18em;
        text-align: center;
        text-shadow:
            0 2px 12px rgba(0, 0, 0, 0.9),
            0 0 40px rgba(0, 0, 0, 0.6);
        opacity: 0;
        transform: translateY(6px);
        transition:
            opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0 1rem;
        word-break: break-word;
        pointer-events: none;
    }

    .animated-image-card:hover .animated-image {
        filter: grayscale(1) contrast(1.15) brightness(0.7);
        transform: scale(1.03);
    }

    .animated-image-card:hover .animated-image-overlay {
        background: rgba(0, 0, 0, 0.38);
    }

    .animated-image-card:hover .animated-image-title {
        opacity: 1;
        transform: translateY(0);
    }

    /* If the HD asset fails, keep the blurred low-res usable instead of
       leaving a permanently hidden image on top of it. */
    .animated-image-card.is-failed .low-res-image {
        filter: none;
        transform: none;
    }

    a.animated-image-card:focus-visible {
        outline: 3px solid #ffffff;
        outline-offset: 3px;
    }

    @media (prefers-reduced-motion: reduce) {
        .animated-image,
        .animated-image-overlay,
        .animated-image-title {
            transition: none;
        }

        .animated-image-card:hover .animated-image {
            transform: none;
        }
    }
</style>

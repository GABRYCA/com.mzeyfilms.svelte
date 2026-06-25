<script>
    /**
     * AnimatedImage — A single animated image card with noir hover effect.
     *
     * Props:
     *   src    {string}       — URL or imported asset path to the animated image (avif/webp/gif)
     *   title  {string}       — Title shown on hover (displayed uppercase)
     *   href   {string|null}  — Optional link destination; if null, card is not clickable
     *   alt    {string}       — Accessibility alt text (defaults to title)
     */

    let {
        src,
        title,
        href = null,
        alt = title,
    } = $props();

    let isExternal = $derived(href?.startsWith('http'));
    let loaded = $state(false);

    let lowResSrc = $derived.by(() => {
        if (!src) return '';
        const lastDot = src.lastIndexOf('.');
        const lastSlash = src.lastIndexOf('/');

        if (lastDot > lastSlash) {
            return src.substring(0, lastDot) + '-low' + src.substring(lastDot);
        }
        return src + '-low';
    });
</script>

{#snippet cardContent()}
    <img
            src={lowResSrc}
            alt=""
            class="low-res-image w-100 h-auto"
            aria-hidden="true"
    />

    <img
            {src}
            {alt}
            class="animated-image position-absolute top-0 start-0 w-100 h-100 {loaded ? 'is-loaded' : ''}"
            loading="lazy"
            decoding="async"
            onload={() => loaded = true}
    />

    <div class="animated-image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <span class="animated-image-title">{title.toUpperCase()}</span>
    </div>
{/snippet}

{#if href}
    <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            class="animated-image-card d-block position-relative overflow-hidden"
            aria-label={title}
    >
        {@render cardContent()}
    </a>
{:else}
    <div
            class="animated-image-card d-block position-relative overflow-hidden"
            aria-label={alt}
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
        min-height: 250px;
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
        transition: opacity 0.5s ease-in-out,
        filter 0.45s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: filter, transform, opacity;
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
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9),
        0 0 40px rgba(0, 0, 0, 0.6);
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
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

    a.animated-image-card:focus-visible {
        outline: 3px solid #ffffff;
        outline-offset: 3px;
    }
</style>
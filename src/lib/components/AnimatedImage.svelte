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
</script>

{#snippet cardContent()}

    {#if !loaded}
        <div class="placeholder-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
            <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    {/if}

    <!--<img
            src={src}
            alt={alt}
    class="animated-image w-100 h-auto"
    loading="lazy"
    decoding="async"
    />
    <div class="animated-image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <span class="animated-image-title">{title.toUpperCase()}</span>
    </div>-->

    <img
            {src}
            {alt}
            class="animated-image w-100 h-auto {loaded ? 'is-loaded' : ''}"
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
        <!--<img
                src={src}
                alt={alt}
                class="animated-image w-100 h-100"
                loading="lazy"
                decoding="async"
        />
        <div class="animated-image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
            <span class="animated-image-title">{title.toUpperCase()}</span>
        </div>-->
        {@render cardContent()}
    </a>
{:else}
    <div
            class="animated-image-card d-block position-relative overflow-hidden"
            aria-label={alt}
    >
        <!--<img
                src={src}
                alt={alt}
                class="animated-image w-100 h-100"
                loading="lazy"
                decoding="async"
        />
        <div class="animated-image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
            <span class="animated-image-title">{title.toUpperCase()}</span>
        </div>-->
        {@render cardContent()}
    </div>
{/if}

<style>
    .animated-image-card {
        border-radius: 8px;
        cursor: default;
        text-decoration: none;
        display: block;
        /* background: #000;*/
        background: #121212;
        min-height: 250px;
    }

    a.animated-image-card {
        cursor: pointer;
    }

    /*.animated-image {
        display: block;
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: filter 0.45s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: filter, transform;
    }*/

    .animated-image {
        display: block;
        object-fit: cover;
        width: 100%;
        height: 100%;
        opacity: 0; /* Hidden initially */
        /* Combined transitions for fade-in, hover filter, and hover scale */
        transition: opacity 0.5s ease-in-out,
        filter 0.45s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: filter, transform, opacity;
    }

    .animated-image.is-loaded {
        opacity: 1;
    }

    .placeholder-overlay {
        background-color: #1a1d20; /* Bootstrap dark gray tint */
        z-index: 1;
    }

    /*.animated-image-overlay {
        background: rgba(0, 0, 0, 0);
        transition: background 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
    }*/

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

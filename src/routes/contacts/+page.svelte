<script>
    import profileImage from "$lib/img/IMG_20260625_101458-optimized.webp?enhanced";

    const email = "manuel.zaffiro03@gmail.com";
    let isLoaded = $state(false);
    let imgLoaded = $state(false);

    $effect(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
        
        // Set loaded state for animations
        setTimeout(() => {
            isLoaded = true;
        }, 100);
    });
</script>

<!-- Contacts Page -->
<div class="container-fluid">

    <div class="container-fluid min-vh-100 d-flex flex-column pt-5">
        <div class="container text-center text-container mt-4 hero-content" class:loaded={isLoaded}>
            <h1 class="enhanced-text display-4 mb-4">Contact</h1>

            <p class="theme-text-secondary mx-auto mb-5 description-text">
                Award-winning Cinematographer, Director and Editor based in Italy.
            </p>

            <a href="mailto:{email}" class="email-link mb-5 d-inline-block">
                {email.toUpperCase()}
            </a>
        </div>

        <div class="container-fluid px-0 px-md-4 pb-5 mt-4 hero-content" class:loaded={isLoaded}>
            <div class="image-wrapper mx-auto rounded-2 {imgLoaded ? '' : 'image-loading'}">
                <enhanced:img
                        src={profileImage}
                        alt="Manuel Zaffiro - Cinematographer"
                        class="img-fluid w-100 object-fit-cover shadow-lg {imgLoaded ? 'is-loaded' : ''}"
                        loading="lazy"
                        onload={() => imgLoaded = true}
                />
            </div>
        </div>
    </div>

</div>

<style>

    .text-container {
        max-width: 800px;
    }

    .description-text {
        font-size: 1.1rem;
        line-height: 1.7;
        max-width: 650px;
    }

    .email-link {
        color: var(--light-black);
        letter-spacing: 0.15em;
        font-size: 0.85rem;
        text-decoration: none;
        transition: color var(--transition-normal) var(--ease-out-cubic);
    }

    .email-link:hover {
        color: var(--primary-black);
    }

    .image-wrapper {
        max-width: 1400px;
        min-height: 50vh;
        position: relative;
    }

    :global(.image-wrapper img) {
        width: 100%;
        height: auto;
        max-height: 80vh;
        border-radius: 4px;

        opacity: 0;
        transition: opacity 1.2s var(--ease-out-cubic);
    }

    :global(.image-wrapper img.is-loaded) {
        opacity: 1;
    }
</style>
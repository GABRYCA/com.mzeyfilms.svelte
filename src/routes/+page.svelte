<script>
    import {onMount} from "svelte";
    import noLightInDeepness from "$lib/img/MVI_7133-optimized.webp?enhanced";
    import naughtyLaundry from "$lib/img/naughty_laundry.webp?enhanced";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<!-- BODY -->
<div class="container-fluid">

    <!-- Hero Section with Clean Typography -->
    <section class="row g-0 min-vh-100 d-flex align-items-center justify-content-center">
        <div class="col-12 col-lg-8 text-center">
            <div class="pb-5">
                <h1 class="display-2 fw-bold theme-text-primary mb-4">
                    Welcome to MZEYFILMS
                </h1>
                <p class="lead theme-text-secondary mb-5 fs-4">
                    Professional cinematography and creative storytelling
                </p>

                <div class="row justify-content-center g-4 mb-5">
                    <div class="col-12 col-md-4">
                        <a href="/videos" class="d-block text-decoration-none">
                            <div class="modern-card p-4 h-100 hover-lift">
                                <div class="mb-3">
                                    <i class="fas fa-video fa-3x theme-text-primary"></i>
                                </div>
                                <h3 class="h4 theme-text-primary mb-2">Videos</h3>
                                <p class="theme-text-secondary mb-0">Explore my video portfolio</p>
                            </div>
                        </a>
                    </div>
                    <div class="col-12 col-md-4">
                        <a href="/photos" class="d-block text-decoration-none">
                            <div class="modern-card p-4 h-100 hover-lift">
                                <div class="mb-3">
                                    <i class="fas fa-camera fa-3x theme-text-primary"></i>
                                </div>
                                <h3 class="h4 theme-text-primary mb-2">Photos</h3>
                                <p class="theme-text-secondary mb-0">Browse my photography</p>
                            </div>
                        </a>
                    </div>
                    <div class="col-12 col-md-4">
                        <a href="/contacts" class="d-block text-decoration-none">
                            <div class="modern-card p-4 h-100 hover-lift">
                                <div class="mb-3">
                                    <i class="fas fa-envelope fa-3x theme-text-primary"></i>
                                </div>
                                <h3 class="h4 theme-text-primary mb-2">Contact</h3>
                                <p class="theme-text-secondary mb-0">Get in touch with me</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Work Section -->
    <section class="row g-4 py-5" id="featured-work">
        <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold theme-text-primary mb-3">Featured Work</h2>
            <p class="lead theme-text-secondary">A selection of my award-winning projects</p>
        </div>

        <div class="col-12 col-lg-6 mb-4 mb-lg-0">
            <div class="modern-card-enhanced overflow-hidden">
                <enhanced:img class="img-fluid w-100" src={naughtyLaundry} alt="Naughty Laundry by MZEYFILMS"
                              style="height: 400px; object-fit: cover;"/>
                <div class="p-4">
                    <h4 class="theme-text-primary mb-2">Naughty Laundry</h4>
                    <!--<p class="theme-text-secondary mb-0">Creative cinematography project</p>-->
                </div>
            </div>
        </div>

        <div class="col-12 col-lg-6">
            <div class="modern-card-enhanced overflow-hidden">
                <enhanced:img class="img-fluid w-100" src={noLightInDeepness} alt="No Light In Deepness by MZEYFILMS"
                              style="height: 400px; object-fit: cover;"/>
                <div class="p-4">
                    <h4 class="theme-text-primary mb-2">No Light In Deepness</h4>
                    <!--<p class="theme-text-secondary mb-0">Atmospheric storytelling</p>-->
                </div>
            </div>
        </div>
    </section>

    <!-- About Preview Section -->
    <section class="row g-0 py-5 bg-light" id="about-preview">
        <div class="col-12 col-lg-8 mx-auto text-center">
            <h2 class="display-5 fw-bold theme-text-primary mb-4">About MZEYFILMS</h2>
            <p class="lead theme-text-secondary mb-4">
                Always searching for new stories to tell.
            </p>
            <a href="/about" class="btn theme-button btn-lg px-5 py-3">
                Learn More About Me
            </a>
        </div>
    </section>

</div>

<style>
    /* Clean, minimal styling for the homepage */

    #hero {
        background: linear-gradient(135deg, var(--pure-white) 0%, var(--off-white) 100%);
    }

    #featured-work {
        background: var(--pure-white);
    }

    #about-preview {
        background: var(--off-white) !important;
    }

    .modern-card {
        border-radius: 12px;
        border: 2px solid var(--border-gray);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modern-card:hover {
        border-color: var(--primary-black);
        transform: translateY(-8px);
        box-shadow: 0 12px 40px var(--shadow-medium);
    }

    .modern-card-enhanced {
        border-radius: 16px;
        border: 2px solid var(--border-gray);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modern-card-enhanced:hover {
        border-color: var(--primary-black);
        transform: translateY(-12px);
        box-shadow: 0 20px 60px var(--shadow-strong);
    }

    .hover-lift {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hover-lift:hover {
        transform: translateY(-4px);
    }

    .fas {
        transition: all 0.3s ease-in-out;
    }

    .modern-card:hover .fas {
        transform: scale(1.1);
    }

    /* Typography enhancements */
    .display-2 {
        letter-spacing: -0.02em;
    }

    .display-5 {
        letter-spacing: -0.01em;
    }

    .lead {
        font-weight: 400;
        line-height: 1.6;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .display-2 {
            font-size: 2.5rem;
        }

        .display-5 {
            font-size: 2rem;
        }

        .min-vh-100 {
            min-height: 80vh;
        }

        /* Reduce section padding on mobile */
        #featured-work,
        #about-preview {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
        }
    }

    @media (min-width: 769px) {
        /* Better spacing on desktop */
        .container-xxl {
            max-width: 1200px;
        }

        #hero {
            padding-top: 2rem;
        }
    }
</style>

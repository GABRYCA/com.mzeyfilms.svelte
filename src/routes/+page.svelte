<script>
    import {onMount} from "svelte";
    import logoHome from "$lib/img/home_bg.webp?enhanced";
    import noLightInDeepness from "$lib/img/MVI_7133-optimized.webp?enhanced";
    import naughtyLaundry from "$lib/img/naughty_laundry.webp?enhanced";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<!-- Hero Section -->
<section class="container-fluid px-0">
    <!-- Main Cover Image -->
    <div class="row justify-content-center mb-5" data-aos="fade-up">
        <div class="col-12 text-center px-3">
            <div class="hero-image-container">
                <enhanced:img src={logoHome} class="img-fluid hero-image" alt="MZEYFILMS Portfolio" id="front-image"/>
                <div class="hero-overlay">
                    <h1 class="hero-title">MZEYFILMS</h1>
                    <p class="hero-subtitle theme-text-secondary d-none d-md-block">Visual Storytelling & Cinematic
                        Excellence</p>
                    <p class="hero-subtitle theme-text-secondary d-md-none">Visual Stories</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Featured Works -->
    <div class="row justify-content-center mb-5" data-aos="fade-in" data-aos-duration="1000">
        <div class="col-12 text-center mb-4">
            <h2 class="section-title theme-text-primary text-glow">Featured Works</h2>
            <p class="section-subtitle theme-text-secondary">Capturing moments that tell extraordinary stories</p>
        </div>
        <div class="col-12 col-lg-6 px-3 mb-4 mb-lg-0">
            <div class="featured-work modern-card h-100">
                <enhanced:img class="img-fluid featured-image" src={naughtyLaundry}
                              alt="Naughty Laundry - A MZEYFILMS Production"/>
                <div class="featured-overlay">
                    <h3 class="featured-title">Naughty Laundry</h3>
                    <!--<p class="featured-description">An intimate exploration of everyday moments</p>-->
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-6 px-3">
            <div class="featured-work modern-card h-100">
                <enhanced:img class="img-fluid featured-image" src={noLightInDeepness}
                              alt="No Light In Deepness - A MZEYFILMS Production"/>
                <div class="featured-overlay">
                    <h3 class="featured-title">No Light In Deepness</h3>
                    <!--<p class="featured-description">A journey through shadows and light</p>-->
                </div>
            </div>
        </div>
    </div>

    <!-- Navigation Cards -->
    <div class="row justify-content-center" data-aos="fade-up" data-aos-duration="700">
        <div class="col-12 text-center mb-4">
            <h2 class="section-title theme-text-primary text-glow">Explore Portfolio</h2>
            <p class="section-subtitle theme-text-secondary d-none d-md-block">Discover the world through my lens</p>
            <p class="section-subtitle theme-text-secondary d-md-none">Visual storytelling</p>
        </div>
        <div class="col-auto mx-2 mb-3">
            <a href="/videos" class="nav-card theme-button hover-lift">
                <div class="nav-card-icon">
                    <i class="fas fa-video"></i>
                </div>
                <h3 class="nav-card-title">Videos</h3>
                <p class="nav-card-desc">Cinematic storytelling</p>
            </a>
        </div>
        <div class="col-auto mx-2 mb-3">
            <a href="/photos" class="nav-card theme-button hover-lift">
                <div class="nav-card-icon">
                    <i class="fas fa-camera"></i>
                </div>
                <h3 class="nav-card-title">Photos</h3>
                <p class="nav-card-desc">Captured moments</p>
            </a></div>
        <div class="col-auto mx-2 mb-3">
            <a href="/contacts" class="nav-card theme-button hover-lift">
                <div class="nav-card-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <h3 class="nav-card-title">Contact</h3>
                <p class="nav-card-desc">Let's collaborate</p>
            </a>
        </div>
    </div>
</section>

<style>
    .hero-image-container {
        position: relative;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: var(--shadow-glass);
        max-width: 1200px;
        margin: 0 auto;
    }

    .hero-image {
        width: 100%;
        height: auto;
        display: block;
        filter: brightness(0.7) contrast(1.1);
        transition: all 0.6s ease;
    }

    .hero-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 2;
        background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%);
        padding: 3rem 2rem;
        border-radius: 20px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .hero-title {
        font-size: 3.5rem;
        font-family: var(--font-display);
        font-weight: 900;
        margin-bottom: 0.5rem;
        color: var(--accent-primary) !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9),
        0 4px 12px rgba(0, 0, 0, 0.7),
        0 8px 24px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(244, 162, 97, 0.3);
        letter-spacing: 0.05em;
        line-height: 1.1;
    }

    .hero-subtitle {
        font-size: 1.2rem;
        font-weight: 500;
        letter-spacing: 0.15em;
        color: var(--text-secondary) !important;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9),
        0 3px 8px rgba(0, 0, 0, 0.6),
        0 6px 16px rgba(0, 0, 0, 0.4);
        text-transform: uppercase;
    }

    .section-title {
        font-size: 2.5rem;
        font-family: var(--font-display);
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .section-subtitle {
        font-size: 1.1rem;
        font-weight: 400;
        margin-bottom: 2rem;
        opacity: 0.9;
    }

    .featured-work {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        cursor: pointer;
        height: 300px;
    }

    .featured-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 0.6s ease;
    }

    .featured-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
        color: white;
        padding: 2rem;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.4s ease;
    }

    .featured-work:hover .featured-overlay {
        transform: translateY(0);
        opacity: 1;
    }

    .featured-work:hover .featured-image {
        transform: scale(1.05);
        filter: brightness(0.8);
    }

    .featured-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--accent-primary);
    }

    .featured-description {
        font-size: 1rem;
        opacity: 0.9;
        margin: 0;
    }

    .nav-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        padding: 2rem 1.5rem;
        border-radius: 20px;
        min-width: 180px;
        min-height: 200px;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .nav-card-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--accent-primary);
        transition: all 0.3s ease;
    }

    .nav-card-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .nav-card-desc {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .nav-card:hover .nav-card-icon {
        transform: scale(1.1);
        color: var(--accent-hover);
    }

    .nav-card:hover .nav-card-title {
        color: var(--accent-primary);
    }

    @media (max-width: 992px) {
        .hero-overlay {
            padding: 2.5rem 1.5rem;
        }

        .hero-title {
            font-size: 2.5rem;
        }

        .hero-subtitle {
            font-size: 1rem;
        }

        .section-title {
            font-size: 2rem;
        }

        .section-subtitle {
            font-size: 1rem;
        }

        .featured-work {
            height: 250px;
            margin-bottom: 1rem;
        }

        .nav-card {
            min-width: 150px;
            min-height: 160px;
            padding: 1.5rem 1rem;
        }

        .nav-card-icon {
            font-size: 2.5rem;
        }
    }

    @media (max-width: 576px) {
        .hero-overlay {
            padding: 2rem 1rem;
            border-radius: 16px;
        }

        .hero-title {
            font-size: 2rem;
            letter-spacing: 0.03em;
        }

        .hero-subtitle {
            font-size: 0.9rem;
            letter-spacing: 0.12em;
        }

        .section-title {
            font-size: 1.75rem;
        }

        .featured-work {
            height: 200px;
        }

        .nav-card {
            min-width: 120px;
            min-height: 140px;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .nav-card-icon {
            font-size: 2rem;
        }

        .nav-card-title {
            font-size: 1.1rem;
        }

        .nav-card-desc {
            font-size: 0.8rem;
        }
    }
</style>

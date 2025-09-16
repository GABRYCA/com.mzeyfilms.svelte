<script>
    import {onMount} from "svelte";
    import noLightInDeepness from "$lib/img/MVI_7133-optimized.webp?enhanced";
    import naughtyLaundry from "$lib/img/naughty_laundry.webp?enhanced";
    import homeBg from "$lib/img/home_bg.webp?enhanced";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<!-- BODY -->
<div class="container-fluid pt-lg-5">

    <!-- Hero Section with Clean Typography -->
    <section class="row g-0 py-5 d-flex align-items-center justify-content-center hero-section rounded-3">
        <enhanced:img src={homeBg} alt="MZEYFILMS Background" class="hero-background" style="z-index: -2;" />
        <div class="hero-overlay" style="z-index: -1;"></div>
        <div class="col-12 col-lg-8 text-center position-relative px-2">
            <div class="pb-5">
                <h1 class="display-2 fw-bold theme-text-primary mb-4 hero-title">
                    MZEYFILMS
                </h1>
                <p class="lead theme-text-secondary mb-5 fs-4 hero-subtitle">
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
                        <a href="/cinematography" class="d-block text-decoration-none">
                            <div class="modern-card p-4 h-100 hover-lift">
                                <div class="mb-3">
                                    <i class="fas fa-clapperboard fa-3x theme-text-primary"></i>
                                </div>
                                <h3 class="h4 theme-text-primary mb-2">Cinematography</h3>
                                <p class="theme-text-secondary mb-0">Browse my cinematography</p>
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

    <!-- Contact Section -->
    <section class="row g-0 py-5" id="contact-section">
        <div class="col-12 col-lg-10 mx-auto text-center">
            <h2 class="display-5 fw-bold theme-text-primary mb-4">Get In Touch</h2>
            <p class="lead theme-text-secondary mb-5">
                Ready to bring your vision to life? Let's create something amazing together.
            </p>
            
            <!-- Email Contact -->
            <div class="row justify-content-center mb-5">
                <div class="col-12 col-md-8">
                    <div class="modern-card p-4 hover-lift">
                        <div class="row align-items-center">
                            <div class="col-12 col-md-8">
                                <h4 class="theme-text-primary mb-2">Email Me</h4>
                                <p class="theme-text-secondary mb-0">
                                    <a href="mailto:manuel.zaffiro03@gmail.com" class="theme-text-secondary text-decoration-none">
                                        manuel.zaffiro03@gmail.com
                                    </a>
                                </p>
                            </div>
                            <div class="col-12 col-md-4 text-center mt-3 mt-md-0">
                                <a href="mailto:manuel.zaffiro03@gmail.com" aria-label="Email">
                                    <i class="fas fa-envelope fa-3x theme-text-primary"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Social Media -->
            <div class="row justify-content-center">
                <div class="col-12">
                    <h4 class="theme-text-primary mb-4">Follow My Work</h4>
                    <div class="row justify-content-center g-4">
                        <div class="col-6 col-md-3">
                            <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g" target="_blank" 
                               aria-label="YouTube" class="text-decoration-none">
                                <div class="social-card text-center p-4 h-100">
                                    <i class="fab fa-youtube fa-3x theme-text-primary mb-2"></i>
                                    <p class="theme-text-secondary mb-0 small">YouTube</p>
                                </div>
                            </a>
                        </div>
                        <div class="col-6 col-md-3">
                            <a href="https://www.instagram.com/mzeyfilms/" target="_blank" 
                               aria-label="Instagram" class="text-decoration-none">
                                <div class="social-card text-center p-4 h-100">
                                    <i class="fab fa-instagram fa-3x theme-text-primary mb-2"></i>
                                    <p class="theme-text-secondary mb-0 small">Instagram</p>
                                </div>
                            </a>
                        </div>
                        <div class="col-6 col-md-3">
                            <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" target="_blank" 
                               aria-label="Spotify" class="text-decoration-none">
                                <div class="social-card text-center p-4 h-100">
                                    <i class="fab fa-spotify fa-3x theme-text-primary mb-2"></i>
                                    <p class="theme-text-secondary mb-0 small">Spotify</p>
                                </div>
                            </a>
                        </div>
                        <div class="col-6 col-md-3">
                            <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie" 
                               target="_blank" aria-label="Amazon Music" class="text-decoration-none">
                                <div class="social-card text-center p-4 h-100">
                                    <i class="fab fa-amazon fa-3x theme-text-primary mb-2"></i>
                                    <p class="theme-text-secondary mb-0 small">Amazon Music</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

</div>

<style>
    .hero-section {
        position: relative;
        overflow: hidden;
    }

    .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }

    .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.7) 100%
        );
        z-index: 2;
    }

    .hero-title {
        color: #ffffff !important;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        z-index: 3;
    }

    .hero-subtitle {
        color: #f8f9fa !important;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        z-index: 3;
    }

    #featured-work {
        background: var(--pure-white);
    }

    #about-preview {
        background: var(--off-white) !important;
    }

    #contact-section {
        background: var(--pure-white);
    }

    .social-card {
        border-radius: 12px;
        border: 2px solid var(--border-gray);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: var(--pure-white);
    }

    .social-card:hover {
        border-color: var(--primary-black);
        transform: translateY(-4px);
        box-shadow: 0 8px 25px var(--shadow-medium);
    }

    .social-card i {
        transition: all 0.3s ease-in-out;
    }

    .social-card:hover i {
        transform: scale(1.1);
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

    @media (max-width: 768px) {
        .display-2 {
            font-size: 2.5rem;
        }

        .display-5 {
            font-size: 2rem;
        }

        #featured-work,
        #about-preview,
        #contact-section {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
        }

        .hero-overlay {
            background: linear-gradient(
                135deg,
                rgba(0, 0, 0, 0.8) 0%,
                rgba(0, 0, 0, 0.6) 50%,
                rgba(0, 0, 0, 0.8) 100%
            );
        }

        .social-card {
            padding: 1rem !important;
        }

        .social-card i {
            font-size: 2rem !important;
        }
    }
</style>

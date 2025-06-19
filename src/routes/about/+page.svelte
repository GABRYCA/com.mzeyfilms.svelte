<script>
    import {onMount} from "svelte";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    const age = new Date().getFullYear() - 2003;
</script>

<!-- About Page -->
<div class="container-xxl pb-5" style="min-height: 80vh">
    <!-- Header Section -->
    <div class="row justify-content-center pt-4 pt-md-5 text-center mb-4 mb-md-5">
        <div class="col-lg-10">
            <div class="theme-main-container theme-shadow p-4 p-md-5" data-aos="fade-up">
                <h1 class="display-4 theme-text-primary mb-3">About Mzeyfilms</h1>
                <p class="lead theme-text-secondary d-none d-md-block">Visual storyteller, filmmaker, and creative
                    artist</p>
                <p class="lead theme-text-secondary d-md-none">Visual storyteller & filmmaker</p>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="row justify-content-center">
        <div class="col-lg-10">
            <div class="theme-main-container theme-shadow p-4 p-md-5" data-aos="fade-up">
                <!-- Biography Section -->
                <div class="row mb-5">
                    <div class="col-12 text-center mb-4">
                        <h2 class="h3 theme-text-primary text-glow">My Journey</h2>
                        <div class="accent-line mx-auto"></div>
                    </div>
                    <div class="col-12">
                        <p class="lead text-center theme-text-secondary mb-4">
                            "Always searching for new stories to tell."
                        </p>
                        <p class="theme-text-secondary fs-5 text-center lh-lg d-none d-md-block">
                            As a passionate filmmaker and photographer, I specialize in capturing the beauty of everyday
                            moments
                            and transforming them into compelling visual narratives. My work spans across various
                            mediums,
                            from cinematic short films to photography sessions, always with an eye for detail
                            and a commitment to artistic excellence.
                        </p>
                        <p class="theme-text-secondary fs-5 text-center lh-lg d-md-none">
                            Passionate filmmaker and photographer specializing in visual narratives.
                            From cinematic films to intimate photography, I create with artistic excellence.
                        </p>
                    </div>
                </div>

                <hr class="theme-divider my-5">

                <!-- Connect Section -->
                <div class="row">
                    <div class="col-12 text-center mb-4">
                        <h2 class="h3 theme-text-primary">Connect & Follow</h2>
                        <p class="theme-text-secondary">Join me on this creative journey</p>
                    </div>
                    <div class="col-12">
                        <div class="row justify-content-center g-4">
                            <div class="col-6 col-md-3">
                                <div class="social-card theme-folder-container theme-shadow-hover text-center p-4"
                                     data-aos="zoom-in" data-aos-delay="100">
                                    <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g"
                                       class="social-link" target="_blank"
                                       data-bs-toggle="tooltip" title="Watch my videos">
                                        <i class="fab fa-youtube social-icon"></i>
                                        <h4 class="social-title">YouTube</h4>
                                        <p class="social-desc">Cinematic content</p>
                                    </a>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="social-card theme-folder-container theme-shadow-hover text-center p-4"
                                     data-aos="zoom-in" data-aos-delay="150">
                                    <a href="https://www.instagram.com/mzeyfilms/"
                                       class="social-link" target="_blank"
                                       data-bs-toggle="tooltip" title="Follow on Instagram">
                                        <i class="fab fa-instagram social-icon"></i>
                                        <h4 class="social-title">Instagram</h4>
                                        <p class="social-desc">Behind the scenes</p>
                                    </a>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="social-card theme-folder-container theme-shadow-hover text-center p-4"
                                     data-aos="zoom-in" data-aos-delay="200">
                                    <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS"
                                       class="social-link" target="_blank"
                                       data-bs-toggle="tooltip" title="Listen to podcast">
                                        <i class="fab fa-spotify social-icon"></i>
                                        <h4 class="social-title">Spotify</h4>
                                        <p class="social-desc">Podcast stories</p>
                                    </a>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="social-card theme-folder-container theme-shadow-hover text-center p-4"
                                     data-aos="zoom-in" data-aos-delay="250">
                                    <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                                       class="social-link" target="_blank"
                                       data-bs-toggle="tooltip" title="Listen on Amazon">
                                        <i class="fab fa-amazon social-icon"></i>
                                        <h4 class="social-title">Amazon</h4>
                                        <p class="social-desc">Podcast platform</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .accent-line {
        width: 80px;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        border-radius: 2px;
        margin-bottom: 2rem;
    }

    .theme-divider {
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border-primary), transparent);
    }

    .social-card {
        border-radius: 16px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .social-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(244, 162, 97, 0.02) 0%, rgba(231, 111, 81, 0.01) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .social-card:hover::before {
        opacity: 1;
    }

    .social-link {
        text-decoration: none;
        color: inherit;
        display: block;
        height: 100%;
    }

    .social-icon {
        font-size: 2.5rem;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 1rem;
        transition: all 0.3s ease;
    }

    .social-card:hover .social-icon {
        transform: scale(1.1) rotate(5deg);
        background: linear-gradient(135deg, var(--accent-hover), var(--accent-tertiary));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .social-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        transition: all 0.3s ease;
    }

    .social-card:hover .social-title {
        color: var(--accent-primary);
    }

    .social-desc {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0;
        transition: all 0.3s ease;
    }

    .social-card:hover .social-desc {
        color: var(--text-primary);
    }

    @media (max-width: 768px) {
        .social-icon {
            font-size: 2rem;
        }

        .social-title {
            font-size: 1rem;
        }

        .social-desc {
            font-size: 0.8rem;
        }
    }
</style>
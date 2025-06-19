<script>
    import {onMount} from "svelte";

    const email = "manuel.zaffiro03@gmail.com"

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<!-- Contact Page -->
<div class="container-fluid pb-5" style="min-height: 80vh">
    <div class="container-xxl">
        <!-- Header Section -->
        <div class="row justify-content-center pt-4 pt-md-5 pb-3 pb-md-4">
            <div class="col-lg-10">
                <div class="theme-main-container theme-shadow p-4 p-md-5 text-center" data-aos="fade-up">
                    <h1 class="display-4 theme-text-primary mb-3">Get In Touch</h1>
                    <p class="lead theme-text-secondary d-none d-md-block">Let's bring your creative vision to life</p>
                    <p class="lead theme-text-secondary d-md-none">Let's create together</p>
                </div>
            </div>
        </div>


        <!-- Main Contact Section -->
        <div class="row justify-content-center mb-4 mb-md-5">
            <div class="col-lg-10">
                <div class="contact-main theme-main-container theme-shadow-hover p-4 p-md-5" data-aos="fade-up">
                    <div class="row align-items-center">
                        <div class="col-12 col-lg-8 mb-4 mb-lg-0">
                            <h2 class="h3 theme-text-primary text-center text-lg-start mb-3">Ready to collaborate?</h2>
                            <p class="fs-5 theme-text-secondary mb-4 d-none d-md-block">
                                Whether you're looking for cinematic videography, professional photography,
                                or creative consultation, I'm here to help tell your story.
                            </p>
                            <p class="fs-5 theme-text-secondary text-center text-lg-start mb-4 d-md-none">
                                Looking for videography, photography, or creative consultation? Let's talk.
                            </p>
                            <a href="mailto:{email}"
                               class="email-link theme-text-primary d-flex align-items-center justify-content-center justify-content-lg-start">
                                <i class="fas fa-envelope me-3"></i>
                                <span class="email-text">{email}</span>
                            </a>
                        </div>
                        <div class="col-12 col-lg-4 text-center">
                            <div class="email-icon-container">
                                <a href="mailto:{email}" aria-label="Send Email" class="email-icon-link">
                                    <i class="fas fa-envelope email-icon" data-bs-toggle="tooltip"
                                       data-bs-placement="top" title="Send me an email"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Social Media Section -->
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="social-section theme-main-container theme-shadow-hover p-5" data-aos="fade-up">
                    <div class="text-center mb-5">
                        <h2 class="h3 theme-text-primary mb-3">Follow My Journey</h2>
                        <p class="theme-text-secondary">Stay connected and see my latest work</p>
                    </div>

                    <div class="row justify-content-center g-4">
                        <div class="col-6 col-md-3">
                            <div class="social-platform" data-aos="zoom-in" data-aos-delay="100">
                                <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g"
                                   target="_blank" aria-label="YouTube" class="social-platform-link">
                                    <div class="social-platform-icon">
                                        <i class="fab fa-youtube"></i>
                                    </div>
                                    <h4 class="social-platform-name">YouTube</h4>
                                    <p class="social-platform-desc">Video content</p>
                                </a>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="social-platform" data-aos="zoom-in" data-aos-delay="200">
                                <a href="https://www.instagram.com/mzeyfilms/"
                                   target="_blank" aria-label="Instagram" class="social-platform-link">
                                    <div class="social-platform-icon">
                                        <i class="fab fa-instagram"></i>
                                    </div>
                                    <h4 class="social-platform-name">Instagram</h4>
                                    <p class="social-platform-desc">Photo stories</p>
                                </a>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="social-platform" data-aos="zoom-in" data-aos-delay="300">
                                <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS"
                                   target="_blank" aria-label="Spotify" class="social-platform-link">
                                    <div class="social-platform-icon">
                                        <i class="fab fa-spotify"></i>
                                    </div>
                                    <h4 class="social-platform-name">Spotify</h4>
                                    <p class="social-platform-desc">Podcast</p>
                                </a>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="social-platform" data-aos="zoom-in" data-aos-delay="400">
                                <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                                   target="_blank" aria-label="Amazon Music" class="social-platform-link">
                                    <div class="social-platform-icon">
                                        <i class="fab fa-amazon"></i>
                                    </div>
                                    <h4 class="social-platform-name">Amazon</h4>
                                    <p class="social-platform-desc">Music platform</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .contact-main, .social-section {
        border-radius: 20px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .email-link {
        display: inline-flex;
        align-items: center;
        font-size: 1.2rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s ease;
        padding: 12px 0;
        border-radius: 8px;
    }

    .email-link:hover {
        color: var(--accent-hover) !important;
        transform: translateX(10px);
    }

    .email-text {
        border-bottom: 2px solid transparent;
        transition: border-color 0.3s ease;
    }

    .email-link:hover .email-text {
        border-bottom-color: var(--accent-primary);
    }

    .email-icon-container {
        position: relative;
        display: inline-block;
    }

    .email-icon-link {
        display: inline-block;
        padding: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(244, 162, 97, 0.1), rgba(231, 111, 81, 0.05));
        border: 2px solid var(--border-primary);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .email-icon-link:hover {
        background: linear-gradient(135deg, rgba(244, 162, 97, 0.2), rgba(231, 111, 81, 0.1));
        border-color: var(--accent-primary);
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 15px 35px rgba(244, 162, 97, 0.3);
    }

    .email-icon {
        font-size: 3rem;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: all 0.3s ease;
    }

    .email-icon-link:hover .email-icon {
        background: linear-gradient(135deg, var(--accent-hover), var(--accent-tertiary));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transform: rotate(-10deg);
    }

    .social-platform {
        text-align: center;
        height: 100%;
        position: relative;
    }

    .social-platform-link {
        display: block;
        padding: 2rem 1rem;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(31, 31, 31, 0.6), rgba(20, 20, 20, 0.4));
        border: 1px solid var(--border-secondary);
        text-decoration: none;
        color: inherit;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .social-platform-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(244, 162, 97, 0.02), rgba(231, 111, 81, 0.01));
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .social-platform-link:hover::before {
        opacity: 1;
    }

    .social-platform-link:hover {
        background: linear-gradient(135deg, rgba(31, 31, 31, 0.8), rgba(20, 20, 20, 0.6));
        border-color: var(--border-primary);
        transform: translateY(-8px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }

    .social-platform-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: all 0.3s ease;
    }

    .social-platform-link:hover .social-platform-icon {
        transform: scale(1.1) rotate(5deg);
        background: linear-gradient(135deg, var(--accent-hover), var(--accent-tertiary));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .social-platform-name {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        transition: all 0.3s ease;
    }

    .social-platform-link:hover .social-platform-name {
        color: var(--accent-primary);
    }

    .social-platform-desc {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0;
        transition: all 0.3s ease;
    }

    .social-platform-link:hover .social-platform-desc {
        color: var(--text-primary);
    }

    @media (max-width: 768px) {
        .email-link {
            font-size: 1rem;
            flex-direction: column;
            text-align: center;
        }

        .email-icon {
            font-size: 2.5rem;
        }

        .social-platform-icon {
            font-size: 2.5rem;
        }

        .social-platform-link {
            padding: 1.5rem 0.8rem;
        }

        .social-platform-name {
            font-size: 1.1rem;
        }

        .social-platform-desc {
            font-size: 0.8rem;
        }
    }
</style>
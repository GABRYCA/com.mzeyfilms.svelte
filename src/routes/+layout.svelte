<script>
    import {onMount} from "svelte";
    import AOS from "aos";
    import "$lib/css/style.css";
    import {page} from "$app/state";
    import Seo from "$lib/components/Seo.svelte";
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let {children} = $props();

    onMount(() => {
        // Close navbar
        document.querySelectorAll('.nav-link').forEach((element) => {
            element.addEventListener('click', () => {
                document.querySelector('.navbar-collapse').classList.remove('show');
            });
        });

        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });

        // Close any leftover bootstrap tooltip
        document.querySelectorAll('.tooltip').forEach((element) => {
            element.addEventListener('click', () => {
                element.classList.remove('show');
            });
        });

        // Init AOS
        AOS.init({
            once: true,
        });
        window.AOS = AOS;
    });

    export function handlePageChange() {
        if (window.AOS) {
            window.AOS.refresh();
        }
    }

    // Automatically update footer year
    const currentYear = new Date().getFullYear();
    const email = "manuel.zaffiro03@gmail.com"
</script>

<Seo/>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark text-center mb-4 theme-main-container theme-shadow">
    <div class="container-fluid py-3 py-lg-4">
        <div class="d-flex justify-content-between w-100 d-lg-none">
            <!-- Navbar title Mobile -->
            <a class="text-decoration-none navbar-title-link my-auto pt-1 navbar-title d-lg-none hover-lift" href="/">
                <h1 class="navbar-title mb-0 enhanced-text">MZEYFILMS</h1>
                <p class="navbar-subtitle mb-0 theme-text-secondary">
                    {@html page.data.subtitle}
                </p>
            </a>
            <button class="navbar-toggler theme-outline" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div class="row align-items-center text-center justify-content-center w-100 mx-0 px-0 py-4 py-lg-0">
                <ul class="col-12 col-lg-4 pe-0 justify-content-start navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link hover-lift { page.url.pathname === '/videos' ? 'active' : '' }"
                           href="/videos">
                            <i class="fas fa-video me-2"></i>Videos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link hover-lift { page.url.pathname === '/photos' ? 'active' : '' }"
                           href="/photos">
                            <i class="fas fa-camera me-2"></i>Photos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link hover-lift { page.url.pathname === '/about' ? 'active' : '' }" href="/about">
                            <i class="fas fa-user me-2"></i>About
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link hover-lift { page.url.pathname === '/contacts' ? 'active' : '' }"
                           href="/contacts">
                            <i class="fas fa-envelope me-2"></i>Contact
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link hover-lift" href="https://www.saal-digital.net/profiles/5TR33T/"
                           target="_blank">
                            <i class="fas fa-shopping-cart me-2"></i>Shop
                        </a>
                    </li>
                </ul>
                <!-- Navbar Title Desktop -->
                <div class="col-12 col-lg-4 d-none d-lg-block">
                    <a class="text-decoration-none navbar-title-link py-0 hover-lift" href="/">
                        <h1 class="navbar-title mb-1 enhanced-text text-glow">MZEYFILMS</h1>
                        <p class="navbar-subtitle mb-0 theme-text-secondary">
                            {@html page.data.subtitle}
                        </p>
                    </a>
                </div>
                <!-- Navbar socials -->
                <div class="col-12 col-lg-4 mt-4 mt-lg-0 justify-content-center justify-content-lg-end navbar-nav">
                    <div class="row justify-content-center">
                        <div class="col-auto">
                            <a class="nav-link nav-icon px-2 interactive-icon"
                               href="https://www.instagram.com/mzeyfilms/" target="_blank" aria-label="Instagram"
                               data-bs-toggle="tooltip" title="Follow on Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </div>
                        <div class="col-auto">
                            <a class="nav-link nav-icon px-2 interactive-icon"
                               href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g" target="_blank"
                               aria-label="Youtube" data-bs-toggle="tooltip" title="Watch videos">
                                <i class="fab fa-youtube"></i>
                            </a>
                        </div>
                        <div class="col-auto">
                            <a class="nav-link nav-icon px-2 interactive-icon"
                               href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" target="_blank"
                               aria-label="Spotify" data-bs-toggle="tooltip" title="Listen to podcast">
                                <i class="fab fa-spotify"></i>
                            </a>
                        </div>
                        <div class="col-auto">
                            <a class="nav-link nav-icon px-2 interactive-icon"
                               href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                               target="_blank" aria-label="Amazon Music" data-bs-toggle="tooltip"
                               title="Listen on Amazon">
                                <i class="fab fa-amazon"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</nav>

{@render children?.()}

<!-- Footer -->
<footer class="row py-4 mx-auto mt-5 mb-0 justify-content-center align-items-center theme-main-container theme-shadow">
    <div class="col-12 col-md-4 text-center pb-3">
        <div class="row justify-content-center">
            <div class="col-12">
                <h3 class="h4 mt-2 mb-3 theme-text-primary">Connect</h3>
            </div>
            <div class="col-auto px-2">
                <a class="footer-icon interactive-icon" href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g"
                   target="_blank" aria-label="Youtube">
                    <i class="fab fa-youtube" data-bs-toggle="tooltip" data-bs-placement="top" title="Watch videos"></i>
                </a>
            </div>
            <div class="col-auto px-2">
                <a class="footer-icon interactive-icon" href="https://www.instagram.com/mzeyfilms/" target="_blank"
                   aria-label="Instagram">
                    <i class="fab fa-instagram" data-bs-toggle="tooltip" data-bs-placement="top"
                       title="Follow on Instagram"></i>
                </a>
            </div>
            <div class="col-auto px-2">
                <a class="footer-icon interactive-icon" href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS"
                   target="_blank" aria-label="Spotify">
                    <i class="fab fa-spotify" data-bs-toggle="tooltip" data-bs-placement="top"
                       title="Listen to podcast"></i>
                </a>
            </div>
            <div class="col-auto px-2">
                <a class="footer-icon interactive-icon"
                   href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                   target="_blank" aria-label="Amazon Music">
                    <i class="fab fa-amazon" data-bs-toggle="tooltip" data-bs-placement="top"
                       title="Listen on Amazon"></i>
                </a>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-4 text-center pb-3 mt-3 mt-md-0">
        <h3 class="h4 mt-2 mb-3 theme-text-primary">Contact</h3>
        <a class="theme-text-secondary text-decoration-none hover-lift custom-link fs-5" href="mailto:{email}"
           data-bs-toggle="tooltip" data-bs-placement="top" title="Send email">
            <i class="fas fa-envelope me-2"></i>Get in touch
        </a>
    </div>
    <div class="col-12 col-md-4 text-center pb-2 mt-3 mt-md-0">
        <h3 class="h4 mt-2 mb-3 theme-text-primary">Credits</h3>
        <p class="small theme-text-secondary mb-2">© MZEYFILMS {currentYear}</p>
        <p class="small">
            Crafted by
            <a class="theme-text-secondary text-decoration-none hover-lift custom-link"
               href="https://github.com/GABRYCA" data-bs-toggle="tooltip"
               data-bs-placement="top" title="Visit Developer" target="_blank">
                AnonymousGCA/GABRYCA
            </a>
        </p>
    </div>
</footer>

<style>
    .footer-icon {
        font-size: 1.75rem;
        color: var(--accent-primary) !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 8px;
        border-radius: 12px;
    }

    .footer-icon:hover {
        color: var(--accent-hover) !important;
        transform: scale(1.1) translateY(-2px);
        background: rgba(244, 162, 97, 0.1);
    }

    .navbar-title {
        font-size: 1.75rem;
        font-family: var(--font-display);
        font-weight: 700;
        letter-spacing: 0.05em;
    }

    .navbar-subtitle {
        font-size: 0.75rem;
        font-weight: 400;
        opacity: 0.8;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .navbar-title-link {
        word-wrap: break-word;
        transition: all 0.3s ease;
    }

    .nav-link {
        color: var(--text-secondary) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        font-weight: 500;
        font-size: var(--font-size-sm);
        padding: 8px 16px;
        border-radius: 8px;
        margin: 0 4px;
    }

    .nav-link::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        transition: width 0.3s ease;
    }

    .nav-link:hover::before,
    .nav-link.active::before {
        width: 100%;
    }

    .nav-link:hover,
    .nav-link.active {
        color: var(--accent-primary) !important;
        background: rgba(244, 162, 97, 0.05);
        transform: translateY(-1px);
    }

    .nav-icon {
        font-size: 1.5rem;
        padding: 8px !important;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .nav-icon:hover {
        background: rgba(244, 162, 97, 0.1);
    }

    .nav-item {
        font-size: var(--font-size-sm);
    }

    @media (max-width: 991px) {
        .nav-link {
            font-size: var(--font-size-sm);
            margin: 4px 0;
        }

        .nav-icon {
            font-size: 1.5rem;
        }

        .navbar-title {
            font-size: 1.5rem;
        }

        .navbar-subtitle {
            font-size: 0.7rem;
        }
    }

    @media (max-width: 576px) {
        .navbar-title {
            font-size: 1.25rem;
        }

        .footer-icon {
            font-size: 1.5rem;
        }
    }
</style>
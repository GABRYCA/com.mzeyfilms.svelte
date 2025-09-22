<script>
    import {onMount} from "svelte";
    import AOS from "aos";
    import "$lib/css/style.css";
    import {page} from "$app/state";
    import Seo from "$lib/components/Seo.svelte";

    /** @type {Props} */
    let {children} = $props();

    // Navbar scroll state
    let isNavbarVisible = $state(true);
    let lastScrollY = $state(0);
    let scrollThreshold = 100;
    let ticking = $state(false);

    onMount(() => {
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }

        function updateNavbar() {
            const currentScrollY = window.scrollY;
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const isMobileMenuOpen = navbarCollapse?.classList.contains('show');

            // Always show navbar if mobile menu is open
            if (isMobileMenuOpen) {
                isNavbarVisible = true;
                lastScrollY = currentScrollY;
                ticking = false;
                return;
            }

            // Show navbar when scrolling up or at the top
            if (currentScrollY < lastScrollY || currentScrollY < scrollThreshold) {
                isNavbarVisible = true;
            }
            // Hide navbar when scrolling down and past threshold
            else if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                isNavbarVisible = false;
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        // Scroll event listener
        window.addEventListener('scroll', handleScroll, {passive: true});

        // Show navbar when user hovers near the top of the screen
        function handleMouseMove(e) {
            if (e.clientY < 80 && !isNavbarVisible) {
                isNavbarVisible = true;
            }
        }

        document.addEventListener('mousemove', handleMouseMove, {passive: true});

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

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    });

    export function handlePageChange() {
        if (window.AOS) {
            window.AOS.refresh();
        }
    }

    // Footer year
    const currentYear = new Date().getFullYear();
    const email = "manuel.zaffiro03@gmail.com"
</script>

<Seo></Seo>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg text-center mb-1 theme-main-container theme-shadow rounded-bottom-3 navbar-autohide {isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}">
    <div class="container-fluid py-2">
        <div class="d-flex justify-content-between w-100 d-lg-none">
            <!-- Navbar title Mobile -->
            <a class="text-decoration-none navbar-title-link my-auto pt-1 navbar-title d-lg-none hover-lift" href="/">
                <p class="navbar-title mb-0 enhanced-text">MZEYFILMS</p>
                <p class="navbar-subtitle mb-0 theme-text-secondary">
                    {@html page.data.subtitle}
                </p>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
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
                           href="/videos">Videos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link hover-lift { page.url.pathname === '/cinematography' ? 'active' : '' }"
                           href="/cinematography">Cinematography</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link hover-lift { page.url.pathname === '/photos' ? 'active' : '' }"
                           href="/photos">Photos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link hover-lift { page.url.pathname === '/about' ? 'active' : '' }" href="/about">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link hover-lift { page.url.pathname === '/contacts' ? 'active' : '' }"
                           href="/contacts">Contacts</a>
                    </li>
                </ul>
                <!-- Navbar Title Desktop -->
                <div class="col-12 col-lg-4 d-none d-lg-block">
                    <a class="text-decoration-none navbar-title-link py-0 hover-lift" href="/">
                        <p class="navbar-title mb-0 enhanced-text text-glow">MZEYFILMS</p>
                        <p class="navbar-subtitle mb-0 theme-text-secondary">
                            {@html page.data.subtitle}
                        </p>
                    </a>
                </div>
                <!-- Navbar socials -->
                <div class="col-12 col-lg-4 mt-4 mt-lg-0 justify-content-center justify-content-lg-end navbar-nav">
                    <div class="row justify-content-center">
                        <div class="col-auto">
                            <a class="nav-link navbar-icon px-0"
                               href="https://www.instagram.com/mzeyfilms/" target="_blank" aria-label="Instagram"
                               data-bs-toggle="tooltip" title="Follow me on Instagram"><i class="fab fa-instagram"></i></a>
                        </div>
                        <div class="col-auto">
                            <a class="nav-link navbar-icon px-0"
                               href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g" target="_blank"
                               aria-label="Youtube" data-bs-toggle="tooltip" title="Watch my videos"><i
                                    class="fab fa-youtube"></i></a>
                        </div>
                        <div class="col-auto">
                            <a class="nav-link navbar-icon px-0"
                               href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" target="_blank"
                               aria-label="Spotify" data-bs-toggle="tooltip" title="Listen to my podcast"><i
                                    class="fab fa-spotify"></i></a>
                        </div>
                        <div class="col-auto">
                            <a class="nav-link navbar-icon px-0"
                               href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                               target="_blank" aria-label="Amazon Music Podcast" data-bs-toggle="tooltip"
                               title="Listen on Amazon"><i class="fab fa-amazon"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</nav>

{@render children?.()}

<!-- Footer -->
<div class="row py-3 mx-auto mt-1 justify-content-center align-items-center theme-main-container theme-shadow rounded-top-3">
    <div class="col-12 col-md-4 text-center pb-2">
        <div class="row justify-content-center">
            <div class="col-12">
                <p class="h5 mt-2 theme-text-primary">Social:</p>
            </div>
            <div class="col-auto px-0">
                <a class="footer-icon" href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g"
                   target="_blank" aria-label="Youtube"><i class="fab fa-youtube mx-3" data-bs-toggle="tooltip"
                                                           data-bs-placement="top" title="Watch my videos"></i></a>
            </div>
            <div class="col-auto px-0">
                <a class="footer-icon" href="https://www.instagram.com/mzeyfilms/" target="_blank"
                   aria-label="Instagram"><i class="fab fa-instagram mx-3" data-bs-toggle="tooltip"
                                             data-bs-placement="top" title="Follow me on Instagram"></i></a>
            </div>
            <div class="col-auto px-0">
                <a class="footer-icon" href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS"
                   target="_blank" aria-label="Spotify"><i class="fab fa-spotify mx-3" data-bs-toggle="tooltip"
                                                           data-bs-placement="top" title="Listen to my podcast"></i></a>
            </div>
            <div class="col-auto px-0">
                <a class="footer-icon"
                   href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                   target="_blank" aria-label="Amazon Music Podcast"><i class="fab fa-amazon mx-3"
                                                                        data-bs-toggle="tooltip" data-bs-placement="top"
                                                                        title="Listen on Amazon"></i></a>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-4 text-center pb-2 mt-3 mt-md-0">
        <p class="h5 mt-2 theme-text-primary">Contacts:</p>
        <p class="h5"><a class="theme-text-secondary text-decoration-none hover-lift" href="mailto:{email}"
                         data-bs-toggle="tooltip" data-bs-placement="top" title="Send me an email">Email</a></p>
    </div>
    <div class="col-12 col-md-4 text-center pb-2 mt-2 mt-md-0">
        <p class="h5 mt-2 theme-text-primary">© Copyright:</p>
        <p class="h6 theme-text-secondary">- MZEYFILMS {currentYear}</p>
        <p class="h6 pt-1">Made by: <a class="theme-text-secondary text-decoration-none hover-lift"
                                       href="https://anonymousgca.eu/" data-bs-toggle="tooltip"
                                       data-bs-placement="top" title="Visit Developer" target="_blank">AnonymousGCA/GABRYCA</a>
        </p>
    </div>
</div>

<style>
    :global(body::-webkit-scrollbar) {
        width: 8px;
        background: var(--light-gray);
    }

    :global(body::-webkit-scrollbar-thumb) {
        background: var(--light-black);
        border-radius: 4px;
    }

    :global(body::-webkit-scrollbar-thumb:hover) {
        background: var(--primary-black);
    }

    .navbar-autohide {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1030;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        margin-bottom: 0 !important;
        will-change: transform;
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
        border-bottom: 2px solid var(--border-gray);
        box-shadow: 0 4px 30px var(--shadow-light);
    }

    .navbar-visible {
        transform: translateY(0);
    }

    .navbar-hidden {
        transform: translateY(-100%);
    }

    :global(body) {
        padding-top: 10vh;
    }

    :global(main) {
        min-height: calc(100vh - 80px);
    }

    @media (max-width: 991px) {
        :global(body) {
            padding-top: 13vh;
        }

        .navbar-autohide {
            transition: transform 0.4s ease-in-out;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .navbar-autohide {
            transition: none;
        }
    }

    .navbar-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--primary-black) !important;
        letter-spacing: -0.02em;
    }

    .navbar-subtitle {
        font-size: 0.9rem;
        color: var(--light-black) !important;
        font-weight: 400;
    }

    .navbar-title-link {
        word-wrap: break-word;
    }

    .nav-link {
        color: var(--primary-black) !important;
        font-weight: 500;
        position: relative;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0.75rem 1rem !important;
        overflow: hidden;
    }

    .nav-link::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-black), var(--soft-black));
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 2px;
    }

    .nav-link::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
        transition: left 0.6s ease-in-out;
        z-index: -1;
    }

    .nav-link:hover::before,
    .nav-link.active::before {
        width: 40px;
    }

    .nav-link:hover::after {
        left: 100%;
    }

    .nav-link:hover,
    .nav-link.active {
        color: var(--primary-black) !important;
        transform: translateY(-2px);
    }

    .nav-link.active {
        font-weight: 600;
    }

    .nav-item {
        padding-left: 0;
        padding-right: 0;
    }

    .theme-main-container {
        background: #ffffff;
        border-top: 2px solid var(--border-gray);
        box-shadow: 0 -2px 20px var(--shadow-light);
    }
</style>
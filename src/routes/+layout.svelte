<script>
    import {onMount} from "svelte";
    import AOS from "aos";
    import "$lib/css/style.css";
    import { page } from "$app/state";
    import Seo from "$lib/components/Seo.svelte";
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();

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

<Seo />

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark text-center mb-1 bg-black bg-opacity-50 rounded-bottom-3">
    <div class="container-fluid py-2 py-lg-4">
        <div class="d-flex justify-content-between w-100 d-lg-none">
            <!-- Navbar title Mobile -->
            <a class="text-decoration-none navbar-title-link my-auto pt-1 navbar-title d-lg-none" href="/">
                <p class="navbar-title mb-0">MZEYFILMS</p>
                <p class="navbar-subtitle mb-0 text-muted">
                    {@html page.data.subtitle}
                </p>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div class="row align-items-center text-center justify-content-center w-100 mx-0 px-0 py-4 py-lg-0">
                <ul class="col-12 col-lg-4 pe-0 justify-content-start navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link { page.url.pathname === '/videos' ? 'active' : '' }" href="/videos">Videos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link { page.url.pathname === '/photos' ? 'active' : '' }" href="/photos">Photos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link { page.url.pathname === '/about' ? 'active' : '' }" href="/about">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link { page.url.pathname === '/contacts' ? 'active' : '' }" href="/contacts">Contacts</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://www.saal-digital.net/profiles/5TR33T/" target="_blank">Shop</a>
                    </li>
                </ul>
                <!-- Navbar Title Desktop -->
                <div class="col-12 col-lg-4 d-none d-lg-block">
                    <a class="text-decoration-none navbar-title-link py-0" href="/">
                        <p class="navbar-title mb-0">MZEYFILMS</p>
                        <p class="navbar-subtitle mb-0 text-muted">
                            {@html page.data.subtitle}
                        </p>
                    </a>
                </div>
                <!-- Navbar socials -->
                <div class="col-12 col-lg-4 mt-4 mt-lg-0 justify-content-center justify-content-lg-end navbar-nav">
                    <div class="row justify-content-center">
                        <div class="col-auto">
                            <a class="nav-link nav-icon px-0" href="https://www.instagram.com/mzeyfilms/" target="_blank" aria-label="Instagram" data-bs-toggle="tooltip" title="Follow me on Instagram"><i class="fab fa-instagram"></i></a>
                        </div>
                        <div class="col-auto">
                            <a class="nav-link nav-icon px-0" href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g" target="_blank" aria-label="Youtube" data-bs-toggle="tooltip" title="Watch my videos"><i class="fab fa-youtube"></i></a>
                        </div>
                        <div class="col-auto">
                            <a class="nav-link nav-icon px-0" href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" target="_blank" aria-label="Spotify" data-bs-toggle="tooltip" title="Listen to my podcast"><i class="fab fa-spotify"></i></a>
                        </div>
                        <div class="col-auto">
                            <a class="nav-link nav-icon px-0" href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie" target="_blank" aria-label="Amazon Music Podcast" data-bs-toggle="tooltip" title="Listen on Amazon"><i class="fab fa-amazon"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</nav>

{@render children?.()}

<!-- Footer -->
<div class="row py-3 mx-auto mt-1 justify-content-center align-items-center bg-black bg-opacity-50 rounded-top-3">
    <div class="col-12 col-md-4 text-center pb-2">
        <div class="row justify-content-center">
            <div class="col-12">
                <p class="h5 mt-2">Social:</p>
            </div>
            <div class="col-auto px-0">
                <a class="footer-icon" href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g" target="_blank" aria-label="Youtube"><i class="fab fa-youtube mx-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Watch my videos"></i></a>
            </div>
            <div class="col-auto px-0">
                <a class="footer-icon" href="https://www.instagram.com/mzeyfilms/" target="_blank" aria-label="Instagram"><i class="fab fa-instagram mx-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Follow me on Instagram"></i></a>
            </div>
            <div class="col-auto px-0">
                <a class="footer-icon" href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" target="_blank" aria-label="Spotify"><i class="fab fa-spotify mx-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Listen to my podcast"></i></a>
            </div>
            <div class="col-auto px-0">
                <a class="footer-icon" href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie" target="_blank" aria-label="Amazon Music Podcast"><i class="fab fa-amazon mx-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Listen on Amazon"></i></a>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-4 text-center pb-2 mt-3 mt-md-0">
        <p class="h5 mt-2">Contacts:</p>
        <p class="h5"><a class="link-secondary text-decoration-none" href="mailto:{email}" data-bs-toggle="tooltip" data-bs-placement="top" title="Send me an email">Email</a></p>
    </div>
    <div class="col-12 col-md-4 text-center pb-2 mt-2 mt-md-0">
        <p class="h5 mt-2">© Copyright:</p>
        <p class="h6 text-muted">- MZEYFILMS {currentYear}</p>
        <p class="h6 pt-1">Made by: <a class="link-secondary text-decoration-none" href="https://github.com/GABRYCA" data-bs-toggle="tooltip" data-bs-placement="top" title="Visit Developer" target="_blank">AnonymousGCA/GABRYCA</a></p>
    </div>
</div>

<style>
    /*#logoTitle {
        text-shadow: 3px 3px #a83613;
    }*/

    :global(body::-webkit-scrollbar) {
        width: 10px;
        background: #230e0e;
    }

    :global(body::-webkit-scrollbar-thumb) {
        background: #B600003F;
        border-radius: 20px;
    }

    :global(body::-webkit-scrollbar-thumb:hover) {
        background: #B6000066;
    }

    .footer-icon {
        font-size: 1.5rem;
        color: #b63d3d !important;
    }

    @media (max-width: 991px) {
        .nav-link {
            font-size: 0.8rem;
        }
        .nav-icon {
            font-size: 1.5rem;
        }
    }

    .navbar-title, .navbar-subtitle, p {
        color: #ff5555 !important;
    }

    .text-muted, .nav-link, .link-secondary {
        color: #b63d3d !important;
    }

    .nav-link:hover {
        color: #ff5555 !important;
    }

    .nav-link.active {
        color: #ff5555 !important;
    }

    .link-secondary:hover {
        color: #ff5555 !important;
    }

    .navbar-title {
        font-size: 1.25rem;
    }

    .navbar-subtitle {
        font-size: 0.5rem;
    }

    .navbar-title-link {
        word-wrap: break-word;
    }

    .h5 {
        font-size: 0.8rem;
    }

    .h6 {
        font-size: 0.5rem;
    }

    .nav-item {
        font-size: 0.6rem;
        padding-left: 0;
        padding-right: 0;
    }
</style>
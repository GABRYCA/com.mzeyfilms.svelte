<script>
    import {onMount} from "svelte";
    import AOS from "aos";
    import "$lib/css/style.css";
    import { page } from "$app/stores";

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

<nav class="navbar navbar-expand-lg navbar-dark mb-1 ps-auto ps-md-2 bg-black bg-opacity-50 rounded-bottom-3">
    <div class="container-fluid pt-2">
        <a class="navbar-brand" href="/"><p class="h1 fw-bold" id="logoTitle">MZEYFILMS</p></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link { $page.url.pathname === '/' ? 'active' : '' }" aria-current="page" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="https://www.saal-digital.net/profiles/5TR33T/" target="_blank">Shop</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link { $page.url.pathname === '/contacts' ? 'active' : '' }" href="/contacts">Contacts</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link { $page.url.pathname === '/videos' ? 'active' : '' }" href="/videos">Videos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link { $page.url.pathname === '/photos' ? 'active' : '' }" href="/photos">Photos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link { $page.url.pathname === '/about' ? 'active' : '' }" href="/about">About me</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<svelte:head>

</svelte:head>

<slot></slot>

<div class="row pt-2 pb-2 mx-auto mt-1 justify-content-center align-items-center bg-black bg-opacity-50 rounded-top-3">
    <div class="col-12 col-md-4 text-white text-center pb-2">
        <div class="row justify-content-center">
            <p class="h5 text-white mt-2">Social:</p>
            <div class="col-3">
                <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g" target="_blank"><i class="fab fa-youtube mx-4 fa-2x link-light pt-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Watch my videos"></i></a>
            </div>
            <div class="col-3">
                <a href="https://www.instagram.com/mzeyfilms/" target="_blank"><i class="fab fa-instagram mx-4 fa-2x link-light pt-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Follow me on Instagram"></i></a>
            </div>
            <div class="col-3">
                <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" target="_blank"><i class="fab fa-spotify mx-4 fa-2x link-light pt-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Listen to my podcast"></i></a>
            </div>
            <div class="col-3">
                <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie" target="_blank"><i class="fab fa-amazon mx-4 fa-2x link-light pt-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Also available on Amazon"></i></a>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-4 text-center pb-2 mt-3 mt-md-0">
        <p class="h5 text-white mt-2">Contacts:</p>
        <p class="h5 text-white"><a class="link-secondary text-decoration-none" href="mailto:{email}" data-bs-toggle="tooltip" data-bs-placement="top" title="Send me an email">Email</a></p>
    </div>
    <div class="col-12 col-md-4 text-center pb-2 mt-2 mt-md-0">
        <p class="h5 text-white mt-2">© Copyright:</p>
        <p class="h6 text-white">- MZEYFILMS {currentYear}</p>
        <p class="h6 text-white pt-1">Made by: <a class="link-secondary text-decoration-none" href="https://github.com/GABRYCA" data-bs-toggle="tooltip" data-bs-placement="top" title="Visit Developer" target="_blank">AnonymousGCA/GABRYCA</a></p>
    </div>
</div>

<style>

    :global(.row, slot, nav, footer, .container, .container-fluid){
        font-family: 'Comfortaa', serif !important;
    }

    #logoTitle {
        text-shadow: 3px 3px #a83613;
    }

</style>
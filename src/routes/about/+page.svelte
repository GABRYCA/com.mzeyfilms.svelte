<script>
    import {onMount} from "svelte";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    const age = new Date().getFullYear() - 2003;
</script>

<!-- CONTENT -->
<div class="container-xxl pb-3 pb-md-5" style="min-height: 77vh">    <!-- Title -->
    <div class="row pt-md-5 text-center rounded-bottom-4 p-2">
        <div class="col theme-main-container theme-shadow rounded-4 pt-4 pb-2" data-aos="zoom-in">
            <p class="h1 rounded-bottom theme-text-primary">
                About me:</p>
        </div>
    </div>
    <!-- Content -->
    <div class="row justify-content-center p-2">
        <div class="col theme-main-container theme-shadow rounded-4 p-4"
             data-aos="zoom-in">
            <!-- Text -->
            <p class="h4 text-center mt-3 mb-4 theme-text-primary" data-aos="zoom-in">
                Always searching for new stories to tell.
            </p>
            <hr class="text-light">
            <div class="row mt-4 mb-3">
                <div class="col-12 text-center">
                    <p class="h4 theme-text-primary" data-aos="zoom-in">Follow me on:</p>
                </div>
            </div>
            <!-- Links -->
            <div class="row justify-content-evenly text-center px-2 px-md-5 gy-3">
                <div class="col-12 col-md-5 theme-folder-container theme-shadow-hover rounded-4 pt-4 pb-3"
                     data-aos="zoom-in" data-aos-delay="150">
                    <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g"
                       class="btn btn-lg border-0 m-2 fs-2 pb-1 theme-button" data-bs-toggle="tooltip"
                       data-bs-placement="top"
                       title="Watch my videos"><i class="fab fa-youtube custom-fa-gradient-about"></i> Youtube</a>
                </div>
                <div class="col-12 col-md-5 theme-folder-container theme-shadow-hover rounded-4 pt-4 pb-3"
                     data-aos="zoom-in" data-aos-delay="200">
                    <a href="https://www.instagram.com/mzeyfilms/"
                       class="btn btn-lg border-0 m-2 fs-2 theme-button"
                       data-bs-toggle="tooltip" data-bs-placement="top" title="Follow me on Instagram"><i
                            class="fab fa-instagram custom-fa-gradient-about"></i> Instagram</a>
                </div>
                <div class="col-12 col-md-5 theme-folder-container theme-shadow-hover rounded-4 pt-4 pb-3"
                     data-aos="zoom-in" data-aos-delay="250">
                    <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS"
                       class="btn btn-lg border-0 m-2 fs-2 theme-button"
                       data-bs-toggle="tooltip" data-bs-placement="top" title="Listen to my podcast"><i
                            class="fab fa-spotify custom-fa-gradient-about"></i> Spotify</a>
                </div>
                <div class="col-12 col-md-5 theme-folder-container theme-shadow-hover rounded-4 pt-4 pb-3"
                     data-aos="zoom-in" data-aos-delay="300">
                    <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                       class="btn btn-lg border-0 m-2 fs-2 theme-button" data-bs-toggle="tooltip"
                       data-bs-placement="top"
                       title="Also available on Amazon"><i class="fab fa-amazon custom-fa-gradient-about"></i>
                        Amazon</a>
                </div>
            </div>
        </div>
    </div>
</div>

<style>

    .btn {
        font-size: 1.55rem !important;
    }

    p {
        color: #ff5555 !important;
    }
</style>
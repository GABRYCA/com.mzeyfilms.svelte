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
<div class="container-xxl pb-3 pb-md-5" style="min-height: 77vh">
    <!-- Title -->
    <div class="row pt-md-5 text-center rounded-bottom-4 p-2">
        <div class="col bg-light bg-opacity-10 rounded-4 pt-4 pb-2" data-aos="zoom-in">
            <!--<p class="h1 mb-0" data-aos="fade-up"><i class="fas fa-film custom-fa-gradient-about"></i> MZEYFILMS: </p>-->
            <p class="h1 rounded-bottom">
                <!--<i class="fas fa-user-astronaut custom-fa-gradient-about"></i>--> About me:</p>
        </div>
    </div>
    <!-- Content -->
    <div class="row justify-content-center p-2">
        <div class="col bg-light bg-opacity-10 rounded-4 p-4"
             data-aos="zoom-in">
            <!-- Text -->
            <p class="h4 text-center mt-3 mb-4" data-aos="zoom-in">
                <!--
                Hi! I'm Manuel, a {age} years old who really wants to create and tell stories through a different,
                dynamic and impactful visual style. Your stories will be safe with me, ready to be created and best
                told.
                -->
                Always searching for new stories to tell.
            </p>
            <hr class="text-light">
            <div class="row mt-4 mb-3">
                <div class="col-12 text-center">
                    <p class="h4" data-aos="zoom-in">Follow me on:</p>
                </div>
            </div>
            <!-- Links -->
            <div class="row justify-content-evenly text-center px-2 px-md-5 gy-3">
                <div class="col-12 col-md-5 bg-custom rounded-4 pt-4 pb-3" style="backdrop-filter: 8px" data-aos="zoom-in" data-aos-delay="150">
                    <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g"
                       class="btn btn-lg border-0 m-2 fs-2 pb-1" data-bs-toggle="tooltip" data-bs-placement="top"
                       title="Watch my videos"><i class="fab fa-youtube custom-fa-gradient-about"></i> Youtube</a>
                </div>
                <div class="col-12 col-md-5 bg-custom rounded-4 pt-4 pb-3" data-aos="zoom-in" data-aos-delay="200">
                    <a href="https://www.instagram.com/mzeyfilms/"
                       class="btn btn-lg border-0 m-2 fs-2"
                       data-bs-toggle="tooltip" data-bs-placement="top" title="Follow me on Instagram"><i
                            class="fab fa-instagram custom-fa-gradient-about"></i> Instagram</a>
                </div>
                <div class="col-12 col-md-5 bg-custom rounded-4 pt-4 pb-3" data-aos="zoom-in" data-aos-delay="250">
                    <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS"
                       class="btn btn-lg border-0 m-2 fs-2"
                       data-bs-toggle="tooltip" data-bs-placement="top" title="Listen to my podcast"><i
                            class="fab fa-spotify custom-fa-gradient-about"></i> Spotify</a>
                </div>
                <div class="col-12 col-md-5 bg-custom rounded-4 pt-4 pb-3" data-aos="zoom-in" data-aos-delay="300">
                    <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                       class="btn btn-lg border-0 m-2 fs-2" data-bs-toggle="tooltip" data-bs-placement="top"
                       title="Also available on Amazon"><i class="fab fa-amazon custom-fa-gradient-about"></i>
                        Amazon</a>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /*#mainDiv {
        background-image: url($lib/img/IMG_0033-optimized.webp);
        background-size: cover;
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: center;
    }

    #textAboutDiv {
        background: linear-gradient(45deg, rgba(30, 0, 0, 0.95), rgba(0, 0, 30, 0.95));
        transition: all 0.5s ease;
    }

    .title-container {
        background-color: rgba(30, 0, 0, 0.3);
    }*/

    /*
    .link-container a {
        transition: all 0.5s ease;
    }

    .link-container a:hover {
        transform: scale(1.1);
    }
    */

    .bg-custom {
        background-color: rgba(145, 0, 0, 0.25);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    }

    .btn {
        font-size: 1.55rem !important;
        color: #ff5555 !important;
    }

    .btn:hover {
        color: #fff !important;
    }

    p {
        color: #ff5555 !important;
    }
</style>
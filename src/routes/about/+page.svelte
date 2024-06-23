<script>
    import {onMount} from "svelte";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    const age = new Date().getFullYear() - 2003;
</script>

<svelte:head>
    <!-- meta -->
    <title>MZEYFILMS - About</title>
    <meta name="description"
          content="MZEYFILMS, Filmmaker, Photographer, Aspirant Cinematographer, Always searching for new stories to tell. ">
</svelte:head>

<!-- CONTENT -->
<div class="container-fluid pb-3 pb-md-5" id="mainDiv">
    <!-- Title -->
    <div class="row bg-dark bg-opacity-25 mb-md-5 pt-5 pb-4 text-center text-white rounded-bottom-4">
        <div class="col">
            <p class="h1 mb-0" data-aos="fade-up"><i class="fas fa-film custom-fa-gradient"></i> MZEYFILMS: </p>
            <p class="h3 rounded-bottom pt-2" data-aos="fade-up"><i class="fas fa-user-astronaut custom-fa-gradient"></i> About me:</p>
        </div>
    </div>
    <div class="row justify-content-center mt-3 mt-md-3 mt-lg-4 p-2">
        <div class="col-auto col-md-11 col-xxl-7 shadow border border-2 border-light border-opacity-25 rounded-3 p-4"
             data-aos="fade-up" data-aos-duration="600" data-aos-delay="95" id="textAboutDiv">
            <!-- Text -->
            <p class="h3 text-center text-light" data-aos="fade-right">
                Hi! I'm Manuel, a {age} years old who really wants to create and tell stories through a different,
                dynamic and impactful visual style. Your stories will be safe with me, ready to be created and best
                told.
            </p>
            <hr class="text-light">
            <div class="row mt-4 mb-3">
                <div class="col-12 text-center">
                    <p class="h4 text-light" data-aos="fade-left">Check out my work and follow me on:</p>
                </div>
            </div>
            <!-- Links -->
            <div class="row justify-content-evenly text-center px-2 px-md-5 gy-3">
                <div class="col-12 col-md-5 bg-light bg-opacity-10 rounded-4 pt-4 pb-3">
                    <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g"
                       class="btn btn-lg btn-outline-light m-2 fs-2" data-bs-toggle="tooltip" data-bs-placement="top"
                       title="Watch my videos"><i class="fab fa-youtube custom-fa-gradient"></i> Youtube</a>
                </div>
                <div class="col-12 col-md-5 bg-light bg-opacity-10 rounded-4 pt-4 pb-3">
                    <a href="https://www.instagram.com/mzeyfilms/" class="btn btn-lg btn-outline-light m-2 fs-2"
                       data-bs-toggle="tooltip" data-bs-placement="top" title="Follow me on Instagram"><i
                            class="fab fa-instagram custom-fa-gradient"></i> Instagram</a>
                </div>
                <div class="col-12 col-md-5 bg-light bg-opacity-10 rounded-4 pt-4 pb-3">
                    <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" class="btn btn-lg btn-outline-light m-2 fs-2"
                       data-bs-toggle="tooltip" data-bs-placement="top" title="Listen to my podcast"><i
                            class="fab fa-spotify custom-fa-gradient"></i> Spotify</a>
                </div>
                <div class="col-12 col-md-5 bg-light bg-opacity-10 rounded-4 pt-4 pb-3">
                    <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                       class="btn btn-lg btn-outline-light m-2 fs-2" data-bs-toggle="tooltip" data-bs-placement="top"
                       title="Also available on Amazon"><i class="fab fa-amazon custom-fa-gradient"></i> Amazon</a>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    #mainDiv {
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

    .link-container a {
        transition: all 0.5s ease;
    }

    .link-container a:hover {
        transform: scale(1.1);
    }

</style>
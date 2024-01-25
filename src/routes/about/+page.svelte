<script>
    import {onMount} from "svelte";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<!-- CONTENT -->
<div class="container-fluid pb-5" id="mainDiv">
    <!-- Title -->
    <div class="row bg-dark bg-opacity-25 text-center text-white">
        <div class="col">
            <p class="h1 pt-5 mb-0" data-aos="fade-up"><i class="fas fa-film"></i> MZEYFILMS: </p>
            <p class="h3 rounded-bottom pt-2 pb-3" data-aos="fade-up"><i class="fas fa-user-astronaut"></i> About me:</p>
        </div>
    </div>
    <hr class="text-white m-0 mb-5">
    <div class="container pt-2 pt-md-5 pb-4">
        <div class="row justify-content-center">
            <div class="col-12 col-md-9 shadow border border-2 border-light border-opacity-25 rounded-3 p-4 mt-5 mt-md-3 mt-lg-4"
                 data-aos="fade-up" data-aos-duration="600" data-aos-delay="95" id="textAboutDiv">
                <!-- Text -->
                <p class="h3 text-center text-light" data-aos="fade-right">
                    Hi! I'm Manuel, a 20 years old who really wants to create and tell stories through a different,
                    dynamic and impactful visual style. Your stories will be safe with me, ready to be created and best
                    told.
                </p>
                <hr class="text-light">
                <!-- Links -->
                <div class="row mt-4">
                    <div class="col text-center">
                        <p class="h4 text-light" data-aos="fade-left">Check out my work and follow me on:</p>
                        <div class="link-container" data-aos="fade-up">
                            <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g"
                               class="btn btn-outline-light m-2" data-bs-toggle="tooltip" data-bs-placement="top"
                               title="Watch my videos"><i class="fab fa-youtube"></i> Youtube</a> <!-- Added tooltip -->
                            <a href="https://www.instagram.com/mzeyfilms/" class="btn btn-outline-light m-2"
                               data-bs-toggle="tooltip" data-bs-placement="top" title="Follow me on Instagram"><i
                                    class="fab fa-instagram"></i> Instagram</a> <!-- Added tooltip -->
                            <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" class="btn btn-outline-light m-2"
                               data-bs-toggle="tooltip" data-bs-placement="top" title="Listen to my podcast"><i
                                    class="fab fa-spotify"></i> Spotify</a> <!-- Added tooltip -->
                            <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                               class="btn btn-outline-light m-2" data-bs-toggle="tooltip" data-bs-placement="top"
                               title="Also available on Amazon"><i class="fab fa-amazon"></i> Amazon</a>
                        </div>
                    </div>
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
        min-height: 78vh;
        background-attachment: fixed;
        background-position: center;
    }

    #textAboutDiv {
        background: linear-gradient(45deg, rgba(30, 0, 0, 0.98), rgba(0, 0, 30, 0.98));
        transition: all 0.5s ease;
    }

    .link-container a {
        transition: all 0.5s ease;
    }

    .link-container a:hover {
        transform: scale(1.1);
    }

</style>
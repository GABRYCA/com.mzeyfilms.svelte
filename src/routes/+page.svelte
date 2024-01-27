<script>
    import {onMount} from "svelte";
    import logoHome from "$lib/img/home_bg.webp?enhanced";
    import noLightInDeepness from "$lib/img/MVI_7133-optimized.webp?enhanced";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<svelte:head>
</svelte:head>

<!-- BODY -->
<div class="container-fluid bg-black bg-opacity-75">
    <div class="row justify-content-center" data-aos="fade-up">
        <div class="col text-center px-0 pickgradient">
            <enhanced:img src={logoHome} class="img-fluid shadow" alt="Logo" id="front-image" />
        </div>
    </div>

    <div class="row h-100 bg-black" data-aos="fade-in" data-aos-duration="1000">
        <div class="col-12 col-md-4 d-flex align-items-center justify-content-center my-auto">
            <div>
                <a class="text-decoration-none" href="https://youtu.be/kjOIvL3PduI?si=n9vPTBDQjV9B7la5" target="_blank"
                   data-bs-toggle="tooltip" data-bs-placement="top" title="View Short">
                    <h1 class="text-center text-white pt-5 pb-3">MZEYFILMS</h1>
                    <p class="text-center text-white mb-5 mb-md-0">No Light In Deepness</p>
                </a>
            </div>
        </div>
        <div class="col-12 col-md-8 px-0 gradient-overlay text-center h-100">
            <div class="gradient-overlay">
                <enhanced:img class="img-fluid shadow rounded-5 shadow" id="noLightItem" src={noLightInDeepness}
                     alt="no_light_in_deepness_by_mzeyfilms" />
            </div>
        </div>
    </div>


    <div class="row pt-5 pb-5 justify-content-center" id="centrale">

        <!-- Hacky way to make background darker with cool effect -->
        <div class="col-12" id="contenutoCentrale"></div>

        <div class="col-sm-8 text-center text-white" data-aos="zoom-in" data-aos-delay="100">
            <p class="h1 fw-bold">MZEYFILMS</p>
            <p class="h4 pt-1">Filmmaker | Photographer | Aspirant Cinematographer<br>
                Always searching for new stories to tell.</p>

            <a href="contacts.html" class="btn btn-outline-light btn-lg rounded-5 mt-4 fw-bold" data-bs-toggle="tooltip"
               data-bs-placement="top" title="Contact Me"><i class="fas fa-envelope"></i> Contact me</a>
            <div class="row justify-content-center">
                <div class="col-4 text-end">
                    <a href="videos.html" class="btn btn-outline-light btn-lg rounded-5 mt-4 fw-bold"
                       data-bs-toggle="tooltip" data-bs-placement="top" title="Videos"><i class="fas fa-video"></i>
                        Videos</a>
                </div>
                <div class="col-4 text-start">
                    <a href="photos.html" class="btn btn-outline-light btn-lg rounded-5 mt-4 fw-bold"
                       data-bs-toggle="tooltip" data-bs-placement="top" title="Photos"><i class="fas fa-camera"></i>
                        Photos</a>
                </div>
            </div>
            <a href="about.html" class="btn btn-outline-light btn-lg rounded-5 mt-4 fw-bold" data-bs-toggle="tooltip"
               data-bs-placement="top" title="About me"><i class="fas fa-user"></i> About me</a>

            <div class="container">
                <div class="row mt-5 justify-content-center">
                    <div class="col-4">
                        <a href="https://www.instagram.com/mzeyfilms/" target="_blank">
                                <span class="fa-stack fa-2x text-light text-opacity-25" data-bs-toggle="tooltip"
                                      data-bs-placement="top" title="Instagram">
                                    <i class="fas fa-circle fa-stack-2x"></i>
                                    <i class="fab fa-instagram fa-stack-1x fa-inverse"></i>
                                </span>
                        </a>
                    </div>
                    <div class="col-4">
                        <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g" target="_blank">
                                <span class="fa-stack fa-2x text-light text-opacity-25" data-bs-toggle="tooltip"
                                      data-bs-placement="top" title="Youtube">
                                    <i class="fas fa-circle fa-stack-2x"></i>
                                    <i class="fab fa-youtube fa-stack-1x fa-inverse"></i>
                                </span>
                        </a>
                    </div>
                </div>
                <hr class="text-white">
                <section data-aos="fade-up">
                    <p class="h2 fw-bold pt-3">Podcast:</p>
                    <!-- Spotify and Amazon Music Icons -->
                    <div class="row mt-4 justify-content-center">
                        <div class="col-3 px-0">
                            <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" target="_blank">
                                        <span class="fa-stack fa-2x text-light text-opacity-25" data-bs-toggle="tooltip"
                                              data-bs-placement="top" title="Spotify">
                                            <i class="fas fa-circle fa-stack-2x"></i>
                                            <i class="fab fa-spotify fa-stack-1x fa-inverse"></i>
                                        </span>
                            </a>
                        </div>
                        <div class="col-3 px-0">
                            <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                               target="_blank">
                                        <span class="fa-stack fa-2x text-light text-opacity-25" data-bs-toggle="tooltip"
                                              data-bs-placement="top" title="Amazon Podcast">
                                            <i class="fas fa-circle fa-stack-2x"></i>
                                            <i class="fab fa-amazon fa-stack-1x fa-inverse"></i>
                                        </span>
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>

<style>
    #centrale {
        background-image: url($lib/img/Video_Moto_31-optimized.webp);
        background-size: cover;
        background-position: 50% 10%;
        background-repeat: no-repeat;
        position: relative;
    }

    #contenutoCentrale {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse closest-side at center, transparent, rgba(0, 0, 0, 0.95));
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
    }

    #noLightItem {
        max-height: 50vh;
        max-width: 1200px;
        width: 100%;
        object-fit: cover;
        margin: auto;
    }

    .pickgradient {
        position: relative;
        display: inline-block;
    }

    .pickgradient:after {
        content: '';
        position: absolute;
        left: 0; top: 0;
        width: 100%; height: 100%;
        display: inline-block;
        background: linear-gradient(to bottom, transparent, #000000);
    }

    .gradient-overlay {
        position: relative;
    }

    .gradient-overlay::after {
        content: '';
        position: absolute;
        left: 0; top: 0;
        width: 100%; height: 100%;
        display: inline-block;
        background: radial-gradient(ellipse closest-side at center, transparent, rgba(0, 0, 0, 0.30));
    }

</style>

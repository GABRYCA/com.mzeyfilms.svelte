<script>
    import {onMount} from "svelte";
    import logoHome from "$lib/img/home_bg.webp?enhanced";
    import noLightInDeepness from "$lib/img/MVI_7133-optimized.webp?enhanced";
    import naughtyLaundry from "$lib/img/naughty_laundry.webp?enhanced";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<!-- BODY -->
<div class="container-fluid bg-opacity-75">

    <!-- Info -->
    <div class="row justify-content-center mt-4" id="info" data-aos="fade-up" data-aos-duration="700">
        <div class="col-12 text-center my-auto">
            <p class="h2 theme-text-primary text-glow">Discover me</p>
        </div>
        <div class="col-auto">
            <a href="/videos" class="btn btn-homepage theme-button hover-lift rounded-5 fw-bold">
                <i class="fas fa-video"></i> <br>Videos
            </a>
        </div>
        <div class="col-auto px-0 mx-sm-5">
            <a href="/photos" class="btn btn-homepage theme-button hover-lift rounded-5 fw-bold">
                <i class="fas fa-camera"></i> <br>Photos
            </a>
        </div>
        <div class="col-auto">
            <a href="/contacts" class="btn btn-homepage theme-button hover-lift rounded-5 fw-bold">
                <i class="fas fa-envelope"></i> <br>Contacts
            </a>
        </div>
    </div>

    <!-- MZEY Cover -->
    <div class="row justify-content-center" data-aos="fade-up">
        <div class="col text-center px-0 pickgradient">
            <enhanced:img src={logoHome} class="img-fluid shadow" alt="Logo" id="front-image"/>
        </div>
    </div>

    <!-- Awards -->
    <div class="row h-100 bg-black justify-content-around" id="awards" data-aos="fade-in" data-aos-duration="1000">
        <div class="col-12 col-md-5 px-0 my-auto gradient-overlay text-center h-100">
            <!--<div>
                <a class="text-decoration-none" href="https://youtu.be/kjOIvL3PduI?si=n9vPTBDQjV9B7la5" target="_blank"
                   data-bs-toggle="tooltip" data-bs-placement="top" title="View Short">
                    <h1 class="text-center text-white pt-5 pb-3">MZEYFILMS</h1>
                    <p class="text-center text-white mb-5 mb-md-0">No Light In Deepness</p>
                </a>
            </div>-->
            <div class="gradient-overlay">
                <enhanced:img class="img-fluid rounded-5 shadow" src={naughtyLaundry}
                              alt="naughty laundry by mzeyfilms"/>
            </div>
        </div>
        <div class="col-12 col-md-6 my-auto px-0 gradient-overlay text-center h-100">
            <div class="gradient-overlay">
                <enhanced:img class="img-fluid rounded-5" src={noLightInDeepness}
                              alt="no light in deepness by mzeyfilms"/>
            </div>
        </div>
    </div>
</div>

<style>
    p {
        color: #212529 !important;
    }

    #awards {
        box-shadow: 0 0 3rem 0 rgba(0, 0, 0, 0.1);
    }

    #info {
        min-height: 35vh;
    }

    .btn-homepage {
        background: linear-gradient(135deg, rgba(248, 249, 250, 0.9), rgba(255, 255, 255, 0.7));
        border: 1px solid rgba(222, 226, 230, 0.8);
        color: #212529;
        backdrop-filter: blur(8px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-homepage:hover {
        background: linear-gradient(135deg, rgba(222, 226, 230, 0.9), rgba(248, 249, 250, 0.8));
        border-color: rgba(222, 226, 230, 1);
        color: #000000 !important;
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
        transform: translateY(-3px) scale(1.05);
    }

    @media (max-width: 991px) {
        .btn-homepage {
            font-size: 0.8rem;
        }

        #info {
            min-height: 30vh;
        }
    }

    .pickgradient {
        position: relative;
        display: inline-block;
    }

    .pickgradient:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: inline-block;
        background: linear-gradient(to bottom, transparent, #000000);
    }

    .gradient-overlay {
        position: relative;
    }

    .gradient-overlay::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: inline-block;
        background: radial-gradient(ellipse closest-side at center, transparent, rgba(0, 0, 0, 0.30));
    }

</style>

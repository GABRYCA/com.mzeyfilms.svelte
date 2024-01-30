<script>
    import {onMount} from "svelte";
    const email = "manuel.zaffiro03@gmail.com"

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<svelte:head>
    <!-- meta -->
    <title>MZEYFILMS - Contacts</title>
    <meta name="description"
          content="MZEYFILMS, Filmmaker, Photographer, Aspirant Cinematographer, Always searching for new stories to tell. ">
</svelte:head>

<!-- BODY -->
<div class="container-fluid pb-5 bg-black bg-opacity-50 rounded-3">
    <div class="container-xxl">
        <div class="row justify-content-center pt-5 pb-5 rounded-3">
            <div class="col-12">
                <p class="h1 text-white text-center">Contacts:</p>
            </div>
        </div>
        <hr class="text-white m-0 mb-5">
        <div class="col-12">
            <div class="row align-items-center pb-4 shadow custom-bg-gradient border border-2 border-light border-opacity-10 rounded-3" data-aos="zoom-in">
                <div class="col-12 col-md-8 justify-content-center pt-5 pt-md-4" data-aos="fade-in" data-aos-delay="250">
                    <p class="h3 text-white text-center">You can reach me by <a class="link-light" href="mailto:{email}" data-bs-toggle="tooltip" data-bs-placement="top" title="Send me an email">Email</a>.</p>
                </div>
                <div class="col-12 col-md-4 text-center justify-content-center" data-aos="slide-right" data-aos-delay="200">
                    <a href="mailto:{email}">
                        <i class="fas fa-envelope fa-10x custom-fa-gradient mt-4" data-bs-toggle="tooltip" data-bs-placement="top" title="Send me an email"></i>
                    </a>
                </div>
            </div>
        </div>

        <hr class="text-white mt-5 mb-5">

        <div class="row align-items-center mt-1 pt-5 pb-5 shadow custom-bg-gradient border border-2 border-light border-opacity-10 rounded-3">
            <div class="col">
                <p class="h2 text-white text-center pb-4" data-aos="fade-in" data-aos-delay="400">Or Socials: </p>
                <hr class="text-white pb-4">
                <!-- Social Icons -->
                <div class="row align-items-center justify-content-center justify-content-md-around text-center">
                    <div class="col-6 col-md-2 mb-4 mb-md-0" data-aos="fade-down" data-aos-delay="450">
                        <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g" target="_blank">
                            <i class="fab fa-youtube fa-5x custom-fa-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Watch my videos"></i>
                        </a>
                    </div>
                    <div class="col-6 col-md-2 mb-4 mb-md-0" data-aos="fade-down" data-aos-delay="550">
                        <a href="https://www.instagram.com/mzeyfilms/" target="_blank">
                            <i class="fab fa-instagram fa-5x custom-fa-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Follow me on Instagram"></i>
                        </a>
                    </div>
                    <div class="col-6 col-md-2" data-aos="fade-down" data-aos-delay="650">
                        <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" target="_blank">
                            <i class="fab fa-spotify fa-5x custom-fa-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Listen to my podcast"></i>
                        </a>
                    </div>
                    <div class="col-6 col-md-2 p-0" data-aos="fade-down" data-aos-delay="750">
                        <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie" target="_blank">
                            <i class="fab fa-amazon fa-5x custom-fa-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="My Amazon Music Podcast"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<style>
    .custom-bg-gradient {
        background: linear-gradient(45deg, rgba(30, 0, 0, 0.98), rgba(0, 0, 30, 0.98));
    }
</style>
<script>
    import {onMount} from "svelte";

    const email = "manuel.zaffiro03@gmail.com"

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<!-- BODY -->
<div class="container-fluid pb-3 pb-md-5 rounded-3" style="min-height: 78vh">
    <div class="container-xxl">        <!-- Contacts Text -->
        <div class="row justify-content-center pt-2 pt-md-5 pb-3">
            <div class="col theme-main-container theme-shadow rounded-4 pt-4 pb-2" data-aos="zoom-in">
                <p class="h1 theme-text-primary text-center">Contacts:</p>
            </div>
        </div>

        <!-- Email -->
        <div class="col-12">
            <div class="row align-items-center pb-2 pt-4 pb-md-4 pt-md-4 mb-3 theme-main-container theme-shadow-hover rounded-3"
                 data-aos="zoom-in">
                <div class="col-12 col-md-8 justify-content-center" data-aos="fade-in" data-aos-delay="250">
                    <p class="h4 theme-text-primary text-center mt-2 my-md-auto">You can reach me by <a
                            href="mailto:{email}" class="theme-text-secondary" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Send me an email">Email</a>.</p>
                </div>
                <div class="col-12 col-md-4 text-center justify-content-center" data-aos="slide-right"
                     data-aos-delay="200">
                    <a href="mailto:{email}" aria-label="Email">
                        <i class="fas fa-envelope fa-10x custom-fa-gradient mt-3 mt-md-auto" data-bs-toggle="tooltip"
                           data-bs-placement="top" title="Send me an email"></i>
                    </a>
                </div>
            </div>
        </div>

        <div class="row align-items-center mt-1 mb-md-5 pt-3 pb-4 py-md-4 pb-md-5 theme-main-container theme-shadow-hover rounded-3"
             data-aos="zoom-in">
            <div class="col">
                <p class="h4 theme-text-primary text-center mt-4 mb-5" data-aos="fade-in" data-aos-delay="400">Or
                    Socials: </p>
                <!-- Social Icons -->
                <div class="row align-items-center justify-content-center justify-content-md-around text-center">
                    <div class="col-5 col-md-2 mb-4 mb-md-0 px-0" data-aos="fade-down" data-aos-delay="450">
                        <a href="https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g" target="_blank"
                           aria-label="Youtube">
                            <i class="fab fa-youtube fa-5x custom-fa-gradient" data-bs-toggle="tooltip"
                               data-bs-placement="top" title="Watch my videos"></i>
                        </a>
                    </div>
                    <div class="col-5 col-md-2 mb-4 mb-md-0 px-0" data-aos="fade-down" data-aos-delay="550">
                        <a href="https://www.instagram.com/mzeyfilms/" target="_blank" aria-label="Instagram">
                            <i class="fab fa-instagram fa-5x custom-fa-gradient" data-bs-toggle="tooltip"
                               data-bs-placement="top" title="Follow me on Instagram"></i>
                        </a>
                    </div>
                    <div class="col-5 col-md-2 px-0" data-aos="fade-down" data-aos-delay="650">
                        <a href="https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS" target="_blank"
                           aria-label="Spotify">
                            <i class="fab fa-spotify fa-5x custom-fa-gradient" data-bs-toggle="tooltip"
                               data-bs-placement="top" title="Listen to my podcast"></i>
                        </a>
                    </div>
                    <div class="col-5 col-md-2 p-0" data-aos="fade-down" data-aos-delay="750">
                        <a href="https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie"
                           target="_blank" aria-label="Amazon Music Podcast">
                            <i class="fab fa-amazon fa-5x custom-fa-gradient" data-bs-toggle="tooltip"
                               data-bs-placement="top" title="My Amazon Music Podcast"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    p, a {
        color: #ff5555 !important;
    }

    a:hover {
        color: #da4747 !important;
    }
</style>
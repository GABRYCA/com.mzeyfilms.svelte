<script>
    const email = "manuel.zaffiro03@gmail.com";
    let isLoaded = $state(false);

    // Contact methods data
    const contactMethods = $state([
        {
            title: "Email",
            description: "Send me an email",
            icon: "fas fa-envelope",
            link: `mailto:${email}`,
            displayText: email,
            primary: true
        }
    ]);

    // Social platforms
    const socialPlatforms = $state([
        {
            name: "YouTube",
            url: "https://m.youtube.com/channel/UCx0Ih65Y_TU86li7eWuM4_g",
            icon: "fab fa-youtube",
            description: "Watch my videos",
            color: "youtube-color",
            stats: "10K+ Views"
        },
        {
            name: "Instagram",
            url: "https://www.instagram.com/mzeyfilms/",
            icon: "fab fa-instagram",
            description: "Follow my journey",
            color: "instagram-color",
            stats: "Most recent projects"
        },
        {
            name: "Spotify",
            url: "https://open.spotify.com/show/22Nsi7J93FcN6kICu6hEaS",
            icon: "fab fa-spotify",
            description: "Listen to my podcast",
            color: "spotify-color",
            stats: "Tachipistorie"
        },
        {
            name: "Amazon Music",
            url: "https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie",
            icon: "fab fa-amazon",
            description: "Available on Amazon",
            color: "amazon-color",
            stats: "Podcast"
        }
    ]);

    $effect(() => {
        // Initialize tooltips after component mounts
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
        
        // Set loaded state for animations
        setTimeout(() => {
            isLoaded = true;
        }, 100);
    });
</script>

<!-- Contacts Page -->
<div class="container-fluid">
    <!-- Hero Section -->
    <section class="py-5 mb-5 mt-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center">
                    <div class="hero-content" class:loaded={isLoaded}>
                        <h1 class="display-3 fw-bold theme-text-primary mb-4">
                            Get In Touch
                        </h1>
                        <p class="lead fs-3 theme-text-secondary mb-5">
                            Ready to bring your vision to life? Let's create something amazing together.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Methods Section -->
    <section class="py-5 mb-5">
        <div class="container">
            <div class="row justify-content-center mb-5">
                <div class="col-lg-8 text-center">
                    <h2 class="display-5 fw-bold theme-text-primary mb-3">Contact Methods</h2>
                    <p class="lead theme-text-secondary">Choose the best way to reach out</p>
                </div>
            </div>

            <div class="row g-4 justify-content-center">
                {#each contactMethods as method}
                    <div class="col-12 col-md-6 col-lg-5">
                        <a href={method.link} class="text-decoration-none d-block h-100">
                            <div class="modern-card-enhanced p-4 h-100 hover-lift rounded-4 {method.primary ? 'pulse-glow' : ''}">
                                <div class="text-center mb-4">
                                    <div class="mb-3">
                                        <i class="{method.icon} fa-4x theme-text-primary contact-icon"></i>
                                    </div>
                                    <h3 class="h3 theme-text-primary mb-2">{method.title}</h3>
                                    <p class="theme-text-secondary mb-3">{method.description}</p>
                                    <p class="h5 theme-text-primary mb-0">{method.displayText}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Social Media Section -->
    <section class="py-5">
        <div class="container">
            <div class="row justify-content-center mb-5">
                <div class="col-lg-8 text-center">
                    <h2 class="display-5 fw-bold theme-text-primary mb-3">Follow My Work</h2>
                    <p class="lead theme-text-secondary">Stay updated with my latest projects and content</p>
                </div>
            </div>

            <div class="row g-4">
                {#each socialPlatforms as platform}
                    <div class="col-12 col-sm-6 col-lg-3">
                        <a href={platform.url} target="_blank" rel="noopener noreferrer" 
                           class="text-decoration-none d-block h-100" 
                           aria-label={platform.name}>
                            <div class="modern-card p-4 h-100 hover-lift rounded-4">
                                <div class="text-center">
                                    <div class="mb-3">
                                        <i class="{platform.icon} fa-3x theme-text-primary contact-social-icon" 
                                           data-bs-toggle="tooltip" 
                                           data-bs-placement="top" 
                                           title={platform.description}></i>
                                    </div>
                                    <h4 class="h5 theme-text-primary mb-2">{platform.name}</h4>
                                    <p class="theme-text-secondary mb-2 small">{platform.description}</p>
                                    <div class="badge bg-light text-dark small">{platform.stats}</div>
                                </div>
                            </div>
                        </a>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center">
                    <div class="modern-card-enhanced p-5 rounded-4">
                        <h3 class="h2 theme-text-primary mb-3">Ready to Start Your Project?</h3>
                        <p class="lead theme-text-secondary mb-4">
                            I'm always excited to work on new creative projects and collaborate with passionate individuals.
                        </p>
                        <a href="mailto:{email}" class="btn theme-button btn-lg px-5 py-3">
                            Send Me an Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    .contact-icon.fas,
    .contact-icon.fab,
    .contact-social-icon.fas,
    .contact-social-icon.fab {
        font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands" !important;
        font-weight: 900;
        display: inline-block;
    }

    .contact-icon.fab,
    .contact-social-icon.fab {
        font-weight: 400 !important;
    }

    .fa-4x.contact-icon {
        font-size: 4rem !important;
    }

    .fa-3x.contact-social-icon {
        font-size: 3rem !important;
    }

    .modern-card:hover .contact-icon,
    .modern-card:hover .contact-social-icon {
        transform: none;
    }

    @media (max-width: 768px) {
        .fa-4x.contact-icon {
            font-size: 3rem !important;
        }

        .fa-3x.contact-social-icon {
            font-size: 2.5rem !important;
        }
    }
</style>
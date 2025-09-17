<script>
    import { onMount } from "svelte";
    import profileImage from "$lib/img/home_bg.webp?enhanced";

    let isLoaded = $state(false);
    const currentYear = new Date().getFullYear();
    const experienceYears = currentYear - 2018;

    // Social media platforms
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
            name: "Amazon",
            url: "https://music.amazon.it/podcasts/1b46e8c5-0b6a-4882-b634-8d18ef578804/tachipistorie",
            icon: "fab fa-amazon",
            description: "Available on Amazon",
            color: "amazon-color",
            stats: "Podcast"
        }
    ]);

    // Skills and services data
    const skills = $state([
        {
            title: "Cinematography",
            description: "Professional camera work and visual storytelling",
            icon: "fas fa-video"
        },
        {
            title: "Video Editing",
            description: "Post-production and color grading expertise",
            icon: "fas fa-cut"
        },
        {
            title: "Photography",
            description: "Portrait and event photography",
            icon: "fas fa-camera"
        },
        {
            title: "Podcast Production",
            description: "Audio recording and podcast creation",
            icon: "fas fa-microphone"
        }
    ]);

    onMount(() => {
        // Initialize tooltips
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
        
        // Set loaded state for animations
        setTimeout(() => {
            isLoaded = true;
        }, 100);
    });
</script>

<!-- Modern About Page -->
<div class="container-fluid">
    <!-- Hero Section -->
    <section class="position-relative py-5 mb-5">
        <div class="container">
            <div class="row align-items-center min-vh-50">
                <div class="col-lg-8 mx-auto text-center">
                    <div class="hero-content" class:loaded={isLoaded}>
                        <h1 class="display-3 fw-bold theme-text-primary mb-4 hero-title">
                            Manuel Zaffiro
                        </h1>
                        <p class="lead fs-3 theme-text-secondary mb-4 hero-subtitle">
                            Cinematographer, Director & Editor
                        </p>
                        <div class="hero-badges d-flex flex-wrap justify-content-center gap-3 mb-4">
                            <span class="badge bg-dark fs-6 px-3 py-2 rounded-pill">Award Winner</span>
                            <span class="badge bg-dark fs-6 px-3 py-2 rounded-pill">Professional</span>
                            <span class="badge bg-dark fs-6 px-3 py-2 rounded-pill">Creative</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Me Section -->
    <section class="py-5 mb-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-10 mx-auto">
                    <div class="modern-card-enhanced p-5">
                        <div class="row align-items-center">
                            <div class="col-lg-8">
                                <h2 class="display-6 fw-bold theme-text-primary mb-4">About Me</h2>
                                <p class="fs-5 theme-text-secondary mb-4 lh-lg">
                                    I'm a passionate cinematographer, director and editor with over {experienceYears} years of experience in creating compelling content. My work spans from award-winning short films to engaging podcasts, always driven by the desire to capture authentic moments and tell meaningful stories.
                                </p>
                                <p class="fs-5 theme-text-secondary mb-4 lh-lg">
                                    Through my lens, I transform everyday moments into cinematic experiences. Whether it's behind the camera or in the editing room, I bring creativity, technical expertise, and a unique perspective to every project.
                                </p>
                                <div class="row g-4 mt-4">
                                    <div class="col-6 col-md-3 text-center">
                                        <div class="stat-number theme-text-primary fw-bold fs-2">{experienceYears}+</div>
                                        <div class="stat-label theme-text-secondary">Years Experience</div>
                                    </div>
                                    <div class="col-6 col-md-3 text-center">
                                        <div class="stat-number theme-text-primary fw-bold fs-2">10+</div>
                                        <div class="stat-label theme-text-secondary">Projects Completed</div>
                                    </div>
                                    <div class="col-6 col-md-3 text-center">
                                        <div class="stat-number theme-text-primary fw-bold fs-2">10K+</div>
                                        <div class="stat-label theme-text-secondary">Total Views</div>
                                    </div>
                                    <div class="col-6 col-md-3 text-center">
                                        <div class="stat-number theme-text-primary fw-bold fs-2">Several</div>
                                        <div class="stat-label theme-text-secondary">Awards Won</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 text-center mt-5 my-lg-auto">
                                <div class="profile-image-container mx-auto" style="width: 250px; height: 250px;">
                                    <enhanced:img 
                                        src={profileImage} 
                                        alt="Manuel Zaffiro - Cinematographer, Director & Editor"
                                        class="profile-image rounded-circle w-100 h-100 object-fit-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <p class="mt-3 theme-text-secondary">M. Zaffiro</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Skills & Services Section -->
    <section class="py-5 mb-5">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center">
                    <h2 class="display-6 fw-bold theme-text-primary mb-3">Skills & Services</h2>
                    <p class="lead theme-text-secondary">What I bring to every project</p>
                </div>
            </div>
            <div class="row g-4">
                {#each skills as skill, index}
                    <div class="col-lg-6">
                        <div class="modern-card p-4 h-100 hover-lift" data-aos="fade-up" data-aos-delay="{index * 100}">
                            <div class="d-flex align-items-start">
                                <div class="skill-icon me-4">
                                    <i class="{skill.icon} fa-2x theme-text-primary"></i>
                                </div>
                                <div>
                                    <h4 class="theme-text-primary mb-2">{skill.title}</h4>
                                    <p class="theme-text-secondary mb-0">{skill.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Social Media Section -->
    <section class="py-5 mb-5">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center">
                    <h2 class="display-6 fw-bold theme-text-primary mb-3">Connect With Me</h2>
                    <p class="lead theme-text-secondary">Follow my creative journey across platforms</p>
                </div>
            </div>
            <div class="row g-4">
                {#each socialPlatforms as platform, index}
                    <div class="col-lg-6">
                        <a href="{platform.url}" 
                           class="text-decoration-none d-block" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           data-bs-toggle="tooltip" 
                           data-bs-placement="top" 
                           title="{platform.description}">
                            <div class="social-card modern-card-enhanced p-4 h-100 hover-lift" 
                                 data-aos="zoom-in" 
                                 data-aos-delay="{index * 150}">
                                <div class="d-flex align-items-center">
                                    <div class="social-icon me-4">
                                        <i class="{platform.icon} fa-3x {platform.color}"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <h4 class="theme-text-primary mb-2">{platform.name}</h4>
                                        <p class="theme-text-secondary mb-1">{platform.description}</p>
                                        <small class="text-muted">{platform.stats}</small>
                                    </div>
                                    <div class="social-arrow">
                                        <i class="fas fa-external-link-alt theme-text-secondary"></i>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <div class="modern-card-enhanced p-5">
                        <h2 class="display-6 fw-bold theme-text-primary mb-4">Ready to Create Something Amazing?</h2>
                        <p class="fs-5 theme-text-secondary mb-5">
                            Let's collaborate on your next project. Whether it's a cinematic story, promotional content, or creative consultation, I'm here to bring your vision to life.
                        </p>
                        <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                            <a href="/contacts" class="btn btn-lg theme-button px-5 py-3">
                                <i class="fas fa-envelope me-2"></i>Get In Touch
                            </a>
                            <a href="/videos" class="btn btn-lg btn-outline-dark px-5 py-3">
                                <i class="fas fa-play me-2"></i>View My Work
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    .min-vh-50 {
        min-height: 50vh;
    }

    .hero-content {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }

    .hero-content.loaded {
        opacity: 1;
        transform: translateY(0);
    }

    .hero-title {
        background: linear-gradient(135deg, var(--primary-black), var(--mid-black));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
    }

    .hero-subtitle {
        font-weight: 400;
        letter-spacing: 0.5px;
    }

    .hero-badges .badge {
        font-weight: 500;
        letter-spacing: 0.5px;
        transition: all 0.4s ease;
    }

    .hero-badges .badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .modern-card {
        background: #ffffff;
        border: 1px solid var(--border-gray);
        border-radius: 16px;
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
    }

    .modern-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.01) 100%);
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
    }

    .modern-card:hover::before {
        opacity: 1;
    }

    .modern-card-enhanced {
        background: #ffffff;
        border: 1px solid var(--border-gray);
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
    }

    .modern-card-enhanced::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%);
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
    }

    .modern-card-enhanced:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
    }

    .modern-card-enhanced:hover::before {
        opacity: 1;
    }

    .hover-lift {
        transition: all 0.4s ease;
    }

    .hover-lift:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .stat-number {
        background: linear-gradient(135deg, var(--primary-black), var(--mid-black));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .stat-label {
        font-size: 0.9rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .profile-image-container {
        border: 3px solid var(--border-gray);
        border-radius: 50%;
        transition: all 0.4s ease;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .profile-image-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
    }

    .profile-image-container:hover {
        border-color: var(--mid-black);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        transform: scale(1.03);
    }

    .profile-image-container:hover::before {
        opacity: 1;
    }

    .profile-image {
        transition: all 0.4s ease;
        filter: brightness(1.02) contrast(1.05);
    }

    .profile-image:hover {
        transform: scale(1.05);
        filter: brightness(1.1) contrast(1.1);
    }

    .skill-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s ease;
        border: 1px solid var(--border-gray);
    }

    .modern-card:hover .skill-icon {
        background: linear-gradient(135deg, var(--primary-black) 0%, var(--mid-black) 100%);
        color: white;
        transform: scale(1.1) rotate(3deg);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    .modern-card:hover .skill-icon i {
        color: white !important;
    }

    .social-card {
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
    }

    .social-card::after {
        content: '';
        position: absolute;
        top: 0;
        right: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
        transition: right 0.6s ease;
        pointer-events: none;
    }

    .social-card:hover::after {
        right: 100%;
    }

    .social-icon {
        transition: all 0.4s ease;
    }

    .social-card:hover .social-icon i {
        transform: scale(1.2) rotate(5deg);
    }

    .social-arrow {
        opacity: 0.6;
        transition: all 0.4s ease;
    }

    .social-card:hover .social-arrow {
        opacity: 1;
        transform: translateX(4px);
    }

    .youtube-color {
        color: #FF0000 !important;
    }

    .instagram-color {
        color: #E4405F !important;
    }

    .spotify-color {
        color: #1DB954 !important;
    }

    .amazon-color {
        color: #FF9900 !important;
    }

    .social-card:hover .youtube-color {
        color: #CC0000 !important;
    }

    .social-card:hover .instagram-color {
        color: #C13584 !important;
    }

    .social-card:hover .spotify-color {
        color: #1ED760 !important;
    }

    .social-card:hover .amazon-color {
        color: #FF7700 !important;
    }

    .btn-lg {
        font-weight: 600;
        letter-spacing: 0.5px;
        border-radius: 12px;
        transition: all 0.4s ease;
    }

    .btn-outline-dark {
        border: 2px solid var(--primary-black);
        color: var(--primary-black);
    }

    .btn-outline-dark:hover {
        background: var(--primary-black);
        border-color: var(--primary-black);
        color: #ffffff;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .hero-title {
            font-size: 2.5rem;
        }
        
        .hero-subtitle {
            font-size: 1.5rem;
        }

        .display-6 {
            font-size: 2rem;
        }

        .modern-card-enhanced {
            border-radius: 16px;
        }

        .profile-image-container {
            width: 200px !important;
            height: 200px !important;
        }
    }

    /* Accessibility Improvements */
    @media (prefers-reduced-motion: reduce) {
        .hero-content,
        .modern-card,
        .modern-card-enhanced,
        .hover-lift,
        .social-card,
        .skill-icon,
        .btn-lg {
            transition: none;
        }
        
        .hero-content.loaded {
            transform: none;
        }
    }

    /* Focus Styles for Accessibility */
    .social-card:focus-within,
    .modern-card:focus-within {
        outline: 2px solid var(--primary-black);
        outline-offset: 2px;
    }
</style>
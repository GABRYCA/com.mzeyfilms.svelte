<script>
    let {src, title} = $props();

    const videoId = src.split('/').pop();
</script>

<div class="video-container">
    <div class="video-header">
        <div class="video-title-container theme-folder-container theme-shadow-hover">
            <h3 class="video-title theme-text-primary">{title}</h3>
        </div>
    </div>
    <div class="video-wrapper">
        <div class="video-frame">
            <iframe class="video-iframe rounded-4 theme-folder-container theme-shadow"
                    src={"https://www.youtube.com/embed/" + videoId} 
                    title={title} 
                    allowfullscreen
                    loading="lazy">
            </iframe>
        </div>
    </div>
</div>

<style>
    .video-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .video-header {
        margin-bottom: 1.5rem;
    }

    .video-title-container {
        padding: 1.5rem 2rem;
        border-radius: 16px;
        text-align: center;
        transition: all 0.3s ease;
    }

    .video-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-accent) !important;
    }

    .video-wrapper {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: var(--shadow-glass);
    }

    .video-frame {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .video-iframe {
        width: 100%;
        height: 100%;
        border: 1px solid var(--border-primary);
        animation: glow-subtle 3s infinite ease-in-out;
        transition: all 0.3s ease;
        background: var(--bg-secondary);
    }

    @keyframes glow-subtle {
        0% {
            box-shadow: 0 8px 32px rgba(244, 162, 97, 0.15);
        }
        50% {
            box-shadow: 0 8px 32px rgba(244, 162, 97, 0.25);
        }
        100% {
            box-shadow: 0 8px 32px rgba(244, 162, 97, 0.15);
        }
    }

    .video-iframe:hover {
        border-color: var(--accent-primary);
        box-shadow: 0 12px 40px rgba(244, 162, 97, 0.3);
    }

    @media (max-width: 768px) {
        .video-title-container {
            padding: 1rem 1.5rem;
        }

        .video-title {
            font-size: 1.25rem;
        }

        .video-wrapper {
            border-radius: 16px;
        }

        .video-iframe {
            border-radius: 16px !important;
        }
    }

    @media (max-width: 576px) {
        .video-title-container {
            padding: 0.75rem 1rem;
        }

        .video-title {
            font-size: 1.1rem;
        }

        .video-wrapper {
            border-radius: 12px;
        }

        .video-iframe {
            border-radius: 12px !important;
        }
    }

    @media (hover: none) and (pointer: coarse) {
        .video-title-container:active {
            transform: scale(0.98);
        }

        .video-iframe:hover {
            border-color: var(--border-primary);
            box-shadow: 0 8px 32px rgba(244, 162, 97, 0.15);
        }
    }
</style>
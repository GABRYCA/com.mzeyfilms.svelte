<script>
    /** @type {import('./$types').PageProps} */
    let { data } = $props();

    const sections = [
        {
            href: '/admin/dashboard/videos',
            icon: 'fa-video',
            title: 'Films',
            description: 'Aggiungi e gestisci i video, le anteprime animate e i crediti.',
            requiresPocketBase: true
        },
        {
            href: '/admin/dashboard/photos',
            icon: 'fa-image',
            title: 'Foto',
            description: 'Carica le foto e organizzale in cartelle.',
            requiresPocketBase: true
        },
        {
            href: '/admin/dashboard/conversion',
            icon: 'fa-wand-magic-sparkles',
            title: 'Conversione YouTube',
            description: 'Genera e scarica le anteprime AVIF HD e SD (FUNZIONA SOLO IN LOCALHOST, NON USARE!).',
            requiresPocketBase: false
        }
    ];
</script>

<div class="container-fluid">
    <div class="row justify-content-center mt-4 mb-4">
        <div class="col-12 col-xl-10">
            <div class="text-center mb-4">
                <p class="h1 mb-2">
                    <i class="fa-solid fa-arrow-up fa-2x"></i>
                    Benvenuto nella dashboard!
                    <i class="fa-solid fa-arrow-up fa-2x"></i>
                </p>
                <p class="fs-5 text-secondary mb-2">Seleziona un'opzione per iniziare.</p>
                <span class="badge {data.pocketbaseAvailable ? 'bg-success' : 'bg-warning text-dark'}">
                    <i class="fa-solid {data.pocketbaseAvailable ? 'fa-circle-check' : 'fa-triangle-exclamation'} me-1"></i>
                    PocketBase {data.pocketbaseAvailable ? 'online' : 'offline'}
                </span>
            </div>

            <div class="row g-3 justify-content-center">
                {#each sections as section (section.href)}
                    <div class="col-12 col-md-6 col-xl-4">
                        <a
                            class="card h-100 bg-black bg-opacity-50 text-white border border-secondary border-opacity-25 rounded-4 text-decoration-none dashboard-card {section.requiresPocketBase && !data.pocketbaseAvailable ? 'opacity-75' : ''}"
                            href={section.href}
                        >
                            <div class="card-body d-flex flex-column text-center p-4 align-items-center">
                                <i class="fa-solid {section.icon} fa-3x mb-3 text-primary"></i>
                                <h2 class="h4">{section.title}</h2>
                                <p class="text-secondary mb-3">{section.description}</p>
                            </div>
                        </a>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .dashboard-card {
        transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
    }

    .dashboard-card:hover,
    .dashboard-card:focus-visible {
        transform: translateY(-3px);
        border-color: rgba(13, 110, 253, 0.6) !important;
        box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.35);
    }

    .dashboard-card:focus-visible {
        outline: 2px solid #0d6efd;
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        .dashboard-card {
            transition: none;
        }

        .dashboard-card:hover,
        .dashboard-card:focus-visible {
            transform: none;
        }
    }
</style>

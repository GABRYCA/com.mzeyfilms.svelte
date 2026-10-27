<script>
    import { onMount } from 'svelte';
    import { page } from "$app/state";
    import { SvelteToast } from '@zerodevx/svelte-toast';

    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     * @property {import('./$types').LayoutData} data
     */

    /** @type {Props} */
    let { children, data } = $props();

    const options = {
        duration: 3000,
        theme: {
            '--toastBackground': '#1a1a1a',
            '--toastColor': '#ffffff',
            '--toastBarBackground': '#2196f3',
            '--toastBtnContent': '❌',
            '--toastBorderRadius': '0.5rem',
            '--toastBoxShadow': '0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -1px rgba(0,0,0,0.1)',
            '--toastBorder': '1px solid #dee2e6'
        }
    }

    let isConversionPage = $derived(page.url.pathname.startsWith('/admin/dashboard/conversion'));

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<div class="admin">
    <nav class="navbar navbar-expand navbar-dark bg-black bg-opacity-50 mt-2 mb-2 mx-1 text-center rounded-4">
        <div class="container-fluid justify-content-center flex-wrap gap-1 fs-6 fs-md-5">
            <a class="navbar-link p-2 pb-1 px-3 rounded-4 text-decoration-none { page.url.pathname === '/admin/dashboard/videos' ? 'aperto border border-primary bg-primary bg-opacity-10' : '' }" href="/admin/dashboard/videos">
                <i class="fas fa-video"></i>
                <span class="ms-2">Films</span>
            </a>
            <a class="navbar-link p-2 pb-1 px-3 rounded-4 text-decoration-none { page.url.pathname === '/admin/dashboard/photos' ? 'aperto border border-primary bg-primary bg-opacity-10' : '' }" href="/admin/dashboard/photos">
                <i class="fas fa-image"></i>
                <span class="ms-2">Foto</span>
            </a>
            <a class="navbar-link p-2 pb-1 px-3 rounded-4 text-decoration-none { isConversionPage ? 'aperto border border-primary bg-primary bg-opacity-10' : '' }" href="/admin/dashboard/conversion">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span class="ms-2">Conversione</span>
            </a>
            <a class="navbar-link p-2 pb-1 px-3 text-decoration-none" data-sveltekit-preload-data="tap" href="/admin/logout">
                <i class="fas fa-sign-out-alt"></i>
                <span class="ms-2">Logout</span>
            </a>
        </div>
    </nav>

    {#if !data.pocketbaseAvailable}
        <div class="alert alert-warning border-warning border-opacity-25 bg-warning bg-opacity-10 text-warning-emphasis mx-2 mt-3 mb-3 d-flex align-items-start gap-2" role="alert">
            <i class="fa-solid fa-triangle-exclamation mt-1"></i>
            <div>
                <strong>PocketBase non disponibile.</strong>
                {data.pocketbaseMessage || 'La dashboard e la conversione YouTube restano utilizzabili; Films e Foto richiedono PocketBase.'}
            </div>
        </div>
    {/if}

    <SvelteToast {options} />

    {@render children?.()}
</div>

<style>

    :global(.admin) {
        font-family: 'Roboto', sans-serif;
    }

    .navbar-link {
        color: #6c757d;
        transition: color 0.3s ease;
        white-space: nowrap;
    }

    .navbar-link:hover {
        color: #0d6efd;
    }

    .aperto {
        color: #0d6efd;
        font-weight: 600;
    }
</style>

<script>
    import { onMount } from 'svelte';
    import { page } from "$app/stores";
    import { SvelteToast } from '@zerodevx/svelte-toast';

    const options = {
        duration: 3000,
        theme: {
            '--toastBackground': '#212121',
            '--toastColor': '#fff',
            '--toastBarBackground': '#2196f3',
            '--toastBtnContent': '❌',
            '--toastBorderRadius': '0.5rem',
            '--toastBoxShadow': '0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -1px rgba(0,0,0,0.1)'
        }
    }

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });
</script>

<svelte:head>
    <meta name="robots" content="noindex">
</svelte:head>

<nav class="navbar navbar-expand navbar-light bg-light bg-opacity-25 mt-2 mb-2 mx-1 text-center rounded-4">
    <div class="container-fluid justify-content-evenly fs-5">
        <a class="navbar-link p-2 pb-1 px-3 rounded-4 text-decoration-none { $page.url.pathname === '/admin/dashboard/videos' ? 'aperto border border-light border-opacity-25 bg-dark bg-opacity-10' : '' }" href="/admin/dashboard/videos">
            <i class="fas fa-video"></i>
            <span class="ms-2">Video</span>
        </a>
        <a class="navbar-link p-2 pb-1 px-3 rounded-4 text-decoration-none { $page.url.pathname === '/admin/dashboard/photos' ? 'aperto border border-light border-opacity-25 bg-dark bg-opacity-10' : '' }" href="/admin/dashboard/photos">
            <i class="fas fa-image"></i>
            <span class="ms-2">Foto</span>
        </a>
        <a class="navbar-link p-2 pb-1 px-3 text-decoration-none" data-sveltekit-preload-data="tap" href="/admin/logout">
            <i class="fas fa-sign-out-alt"></i>
            <span class="ms-2">Logout</span>
        </a>
    </div>
</nav>

<SvelteToast {options} />

<slot></slot>

<style>
    .navbar-link {
        color: #a2a2a2;
    }

    .navbar-link:hover {
        color: #ff6464;
    }

    .aperto {
        color: #ff6464;
    }
</style>
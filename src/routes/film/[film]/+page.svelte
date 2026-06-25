<script>
    import UserVideo from '$lib/components/UserVideo.svelte';

    let { data } = $props();

    let film = $derived(data.film);
</script>

<div class="container py-5 my-4 fade-in-up">
    <header class="text-center mb-5">
        {#if film.name}
            <h1 class="enhanced-text display-6 mb-3">
                {film.name}
            </h1>
        {/if}

        {#if film.credits && !(Array.isArray(film.credits) && film.credits.length === 0)}
            <div class="hero-subtitle theme-text-secondary mx-auto" style="max-width: 700px;">
                {#if Array.isArray(film.credits)}
                    {#each film.credits as credit}
                        {#if typeof credit === 'string'}
                            <p class="mb-2 fs-6 opacity-90">{credit}</p>
                        {:else if typeof credit === 'object' && credit !== null}
                            <p class="mb-2 fs-6 opacity-90">
                                {#if credit.role}
                                    <span class="theme-text-primary fw-semibold">{credit.role}</span>
                                {/if}
                                {#if credit.role && (credit.name || credit.value)} : {/if}
                                <span>{credit.name || credit.value || ''}</span>
                                {#if credit.url}
                                    <a href={credit.url} class="custom-link ms-2" target="_blank" rel="noopener noreferrer" aria-label="External Link">
                                        <i class="fas fa-external-link-alt fa-xs"></i>
                                    </a>
                                {/if}
                            </p>
                        {/if}
                    {/each}
                {:else if typeof film.credits === 'object' && film.credits !== null}
                    {#each Object.entries(film.credits) as [key, value]}
                        <p class="mb-2 fs-6 opacity-90">
                            <span class="theme-text-primary fw-semibold">{key}:</span> {value}
                        </p>
                    {/each}
                {/if}
            </div>
        {:else}
            <div class="hero-subtitle theme-text-secondary mx-auto">
                <p class="mb-2 fs-6 italic opacity-50">Details and credits coming soon</p>
            </div>
        {/if}
    </header>

    <section class="row justify-content-center">
        <div class="col-12 col-xl-10">
            {#if film.url}
                <div
                        id="video-{film.name}"
                        class="row video-anchor-target"
                        data-aos="zoom-in"
                >
                    <div class="col">
                        <UserVideo src={film.url}/>
                    </div>
                </div>
            {:else}
                <div class="modern-card-enhanced theme-border p-5 text-center my-4">
                    <i class="fas fa-video-slash fa-3x mb-3 theme-text-secondary"></i>
                    <p class="theme-text-secondary">This video is currently unavailable or processing.</p>
                </div>
            {/if}
        </div>
    </section>
</div>

<style>
    .fade-in-up {
        animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .fade-in-up {
            animation: none;
        }
    }
</style>
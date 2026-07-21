<script>
    import { deserialize } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { toast } from "@zerodevx/svelte-toast";

    let { video } = $props();

    let name = $derived(video.name);
    let url = $derived(video.url);
    let credits = $derived([...(video.credits || [])]);

    let localHighresFile = $state(null);
    let localLowresFile = $state(null);

    let deleteHighres = $state(false);
    let deleteLowres = $state(false);

    let isUpdating = $state(false);
    let isDeleting = $state(false);
    let isGenerating = $state(false);
    let creditInputLine = $state('');
    /** Clip start for auto AVIF generation (seconds). Default skips first 2s. */
    let previewStart = $state(2);

    let videoId = $derived(getYoutubeId(url));
    let missingPreviews = $derived(!video.animatedhighresUrl || !video.animatedlowresUrl);

    function getYoutubeId(urlPath) {
        if (!urlPath) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = urlPath.match(regExp);
        return (match && match[2].length === 11) ? match[2] : urlPath.split('/').pop();
    }

    function pollForPreviewUpdates() {
        let attempts = 0;
        const maxAttempts = 12;
        const timer = setInterval(async () => {
            attempts += 1;
            await invalidateAll();
            if (attempts >= maxAttempts) clearInterval(timer);
        }, 30_000);
    }

    async function generatePreviews(force = false) {
        if (isGenerating) return;

        if (force) {
            const ok = window.confirm(
                'Rigenerare le anteprime animate da YouTube?\nLe anteprime esistenti verranno sovrascritte quando la generazione termina.'
            );
            if (!ok) return;
        }

        isGenerating = true;
        const toastId = toast.push(
            'Generazione anteprime AVIF avviata in background (può richiedere alcuni minuti)...',
            { duration: 600000 }
        );

        const data = new FormData();
        data.append('id', video.id);
        data.append('previewStart', String(previewStart ?? 2));
        if (force) data.append('force', 'true');

        try {
            const response = await fetch('?/generatePreviews', {
                method: 'POST',
                body: data
            });
            const result = deserialize(await response.text());
            toast.pop(toastId);

            if (result.type === 'success') {
                const generating = result.data?.body?.generatingPreviews;
                toast.push(
                    generating
                        ? 'Generazione in corso. Le badge HD/SD si aggiorneranno a breve.'
                        : (result.data?.body?.message || 'Anteprime già presenti'),
                    {
                        theme: { '--toastBackground': '#28a745' },
                        duration: generating ? 10000 : 4000
                    }
                );
                if (generating) pollForPreviewUpdates();
                await invalidateAll();
            } else {
                toast.push(result.data?.body?.message || 'Errore durante la generazione', {
                    theme: { '--toastBackground': '#dc3545' }
                });
            }
        } catch (err) {
            toast.pop(toastId);
            toast.push('Errore di rete durante la generazione', {
                theme: { '--toastBackground': '#dc3545' }
            });
        }

        isGenerating = false;
    }

    function addCreditLine() {
        if (creditInputLine.trim()) {
            credits = [...credits, creditInputLine.trim()];
            creditInputLine = '';
        }
    }

    function removeCreditLine(index) {
        credits = credits.filter((_, i) => i !== index);
    }

    async function handleUpdate(event) {
        event.preventDefault();
        if (isUpdating) return;

        isUpdating = true;
        const toastId = toast.push('Salvataggio modifiche...', { duration: 60000 });

        const data = new FormData();
        data.append('id', video.id);
        data.append('name', name);
        data.append('url', url);
        data.append('credits', JSON.stringify(credits));

        if (localHighresFile) {
            data.append('animatedhighres', localHighresFile);
        }
        if (localLowresFile) {
            data.append('animatedlowres', localLowresFile);
        }

        data.append('deleteHighres', deleteHighres);
        data.append('deleteLowres', deleteLowres);

        const response = await fetch('?/update', {
            method: 'POST',
            body: data
        });

        toast.pop(toastId);
        const result = deserialize(await response.text());
        await invalidateAll();

        if (result.type === 'success') {
            toast.push("Video salvato con successo!", {
                theme: { '--toastBackground': '#28a745' }
            });

            localHighresFile = null;
            localLowresFile = null;
            deleteHighres = false;
            deleteLowres = false;

            const offcanvasEl = document.getElementById(`editVideo${video.id}`);
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (offcanvasInstance) {
                offcanvasInstance.hide();
            }
        } else {
            toast.push("Errore durante il salvataggio!", {
                theme: { '--toastBackground': '#dc3545' }
            });
        }
        isUpdating = false;
    }

    async function deleteVideo() {
        if (isDeleting) return;

        let confirmDelete = window.confirm(`Sei sicuro di voler eliminare definitivamente questo video?\n"${video.name}"`);
        if (!confirmDelete) return;

        isDeleting = true;
        const data = new FormData();
        data.append('id', video.id);

        const response = await fetch('?/delete', {
            method: 'POST',
            body: data
        });

        const result = deserialize(await response.text());
        await invalidateAll();

        if (result.type === 'success') {
            toast.push("Video cancellato correttamente!", {
                theme: { '--toastBackground': '#28a745' }
            });
        } else {
            toast.push("Errore durante la cancellazione!", {
                theme: { '--toastBackground': '#dc3545' }
            });
        }
        isDeleting = false;
    }
</script>

<div class="card bg-dark bg-opacity-75 text-white border border-secondary border-opacity-20 rounded-3 p-3 d-flex flex-column justify-content-between w-100 position-relative shadow-lg transition-all" style="min-height: 290px;">
    <div>
        <div class="ratio ratio-16x9 rounded overflow-hidden shadow-sm mb-3">
            <iframe class="w-100 h-100" src={"https://www.youtube.com/embed/" + videoId} title={video.name} allowfullscreen></iframe>
        </div>
        <h5 class="fs-6 text-start mb-2 px-1 text-truncate" title={video.name}>{video.name}</h5>

        <div class="d-flex flex-wrap gap-1 mb-2 px-1">
            {#if video.animatedhighresUrl}
                <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style="font-size: 0.7rem;">
                    <i class="fa-solid fa-image me-1"></i> HD GIF
                </span>
            {:else}
                <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25" style="font-size: 0.7rem;">
                    No HD
                </span>
            {/if}

            {#if video.animatedlowresUrl}
                <span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25" style="font-size: 0.7rem;">
                    <i class="fa-solid fa-image me-1"></i> SD GIF
                </span>
            {:else}
                <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25" style="font-size: 0.7rem;">
                    No SD
                </span>
            {/if}

            <span class="badge bg-light bg-opacity-10 text-white border border-light border-opacity-25" style="font-size: 0.7rem;">
                <i class="fa-solid fa-receipt me-1"></i> {video.credits?.length || 0} Crediti
            </span>
        </div>
    </div>

    <div class="d-flex justify-content-end flex-wrap gap-2 border-top border-secondary border-opacity-25 pt-2 mt-2">
        {#if missingPreviews}
            <button
                class="btn btn-outline-warning btn-sm border-0 bg-black bg-opacity-30 px-3"
                onclick={() => generatePreviews(false)}
                aria-label="Genera anteprime"
                disabled={isGenerating}
                title="Genera anteprime AVIF da YouTube"
            >
                {#if isGenerating}
                    <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                {:else}
                    <i class="fa-solid fa-wand-magic-sparkles me-1"></i>
                {/if}
                Genera
            </button>
        {/if}
        <button class="btn btn-outline-light btn-sm border-0 bg-black bg-opacity-30 px-3" data-bs-toggle="offcanvas" data-bs-target="#editVideo{video.id}" aria-label="Edit video">
            <i class="fa-solid fa-pen-to-square me-1"></i> Modifica
        </button>
        <button class="btn btn-outline-danger btn-sm border-0 bg-black bg-opacity-30" onclick={deleteVideo} aria-label="Delete video" disabled={isDeleting}>
            <i class="fa fa-trash"></i>
        </button>
    </div>
</div>

<div class="offcanvas offcanvas-end border-start" tabindex="-1" id="editVideo{video.id}" aria-labelledby="offcanvasEditLabel" style="background-color: var(--off-white); border-color: var(--border-gray) !important; color: var(--primary-black); width: 450px; max-width: 100vw;">
    <div class="offcanvas-header border-bottom border-secondary border-opacity-20 py-3">
        <h5 class="offcanvas-title text-white" id="offcanvasEditLabel">
            <i class="fa-solid fa-sliders text-primary me-2"></i> Impostazioni Video
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body">
        <form onsubmit={handleUpdate} enctype="multipart/form-data">
            <div class="mb-4">
                <h6 class="text-secondary small uppercase tracking-wide border-bottom border-secondary border-opacity-10 pb-1 mb-3">Informazioni Generali</h6>

                <div class="mb-3 text-start">
                    <label class="form-label small text-secondary" for="title{video.id}">Titolo</label>
                    <input type="text" id="title{video.id}" bind:value={name} class="form-control bg-dark text-white border-secondary" required>
                </div>

                <div class="mb-3 text-start">
                    <label class="form-label small text-secondary" for="url{video.id}">URL YouTube</label>
                    <input type="text" id="url{video.id}" bind:value={url} class="form-control bg-dark text-white border-secondary" required>
                </div>
            </div>

            <div class="mb-4 text-start">
                <h6 class="text-secondary small uppercase tracking-wide border-bottom border-secondary border-opacity-10 pb-1 mb-3">Anteprime Animate (GIF/WebP/Avif)</h6>

                <div class="mb-3">
                    <label class="form-label small text-secondary" for="previewStart{video.id}">Inizio clip (secondi)</label>
                    <input
                        id="previewStart{video.id}"
                        type="number"
                        min="0"
                        step="0.5"
                        bind:value={previewStart}
                        class="form-control bg-dark text-white border-secondary"
                        disabled={isGenerating}
                    >
                    <div class="form-text text-secondary">Default 2s. La preview dura ~7 secondi da questo punto.</div>
                </div>

                <div class="d-flex flex-wrap gap-2 mb-3">
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-warning"
                        onclick={() => generatePreviews(false)}
                        disabled={isGenerating || !missingPreviews}
                        title={missingPreviews ? 'Genera le anteprime mancanti da YouTube' : 'Anteprime già presenti — usa Rigenera'}
                    >
                        {#if isGenerating}
                            <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                        {:else}
                            <i class="fa-solid fa-wand-magic-sparkles me-1"></i>
                        {/if}
                        Genera mancanti
                    </button>
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        onclick={() => generatePreviews(true)}
                        disabled={isGenerating}
                        title="Rigenera entrambe le anteprime da YouTube"
                    >
                        <i class="fa-solid fa-arrows-rotate me-1"></i>
                        Rigenera
                    </button>
                </div>
                <p class="small text-secondary mb-3">
                    Auto da YouTube: ~7s da t={previewStart}s, HD max 480px, SD max 240px (.avif). Può richiedere alcuni minuti.
                </p>

                <div class="mb-3">
                    <label class="form-label small text-secondary">Anteprima Alta Risoluzione (HD)</label>
                    {#if video.animatedhighresUrl && !deleteHighres}
                        <div class="position-relative border border-secondary border-opacity-25 rounded overflow-hidden mb-2 bg-black bg-opacity-40" style="height: 110px;">
                            <img src={video.animatedhighresUrl} class="w-100 h-100 object-fit-contain" alt="HD Pre">
                            <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" onclick={() => deleteHighres = true} title="Rimuovi anteprima">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    {:else if deleteHighres}
                        <div class="alert alert-warning py-1 px-2 small d-flex justify-content-between align-items-center mb-2">
                            <span>HD Preview segnata per la rimozione.</span>
                            <button type="button" class="btn btn-sm btn-link text-warning p-0" onclick={() => deleteHighres = false}>Annulla</button>
                        </div>
                    {/if}
                    <input type="file" accept=".webp,.avif,.gif" class="form-control bg-dark text-white border-secondary" onchange={(e) => { localHighresFile = e.target.files[0]; deleteHighres = false; }}>
                </div>

                <div class="mb-3">
                    <label class="form-label small text-secondary">Anteprima Bassa Risoluzione (SD)</label>
                    {#if video.animatedlowresUrl && !deleteLowres}
                        <div class="position-relative border border-secondary border-opacity-25 rounded overflow-hidden mb-2 bg-black bg-opacity-40" style="height: 110px;">
                            <img src={video.animatedlowresUrl} class="w-100 h-100 object-fit-contain" alt="SD Pre">
                            <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" onclick={() => deleteLowres = true} title="Rimuovi anteprima">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    {:else if deleteLowres}
                        <div class="alert alert-warning py-1 px-2 small d-flex justify-content-between align-items-center mb-2">
                            <span>SD Preview segnata per la rimozione.</span>
                            <button type="button" class="btn btn-sm btn-link text-warning p-0" onclick={() => deleteLowres = false}>Annulla</button>
                        </div>
                    {/if}
                    <input type="file" accept=".webp,.avif,.gif" class="form-control bg-dark text-white border-secondary" onchange={(e) => { localLowresFile = e.target.files[0]; deleteLowres = false; }}>
                </div>
            </div>

            <div class="mb-4 text-start">
                <h6 class="text-secondary small uppercase tracking-wide border-bottom border-secondary border-opacity-10 pb-1 mb-3">Crediti e Sottotitoli</h6>

                <div class="input-group mb-3">
                    <input type="text" class="form-control bg-dark text-white border-secondary" placeholder="Esempio: Regista: Alice Rossi" bind:value={creditInputLine}>
                    <button class="btn btn-outline-primary" type="button" onclick={addCreditLine}>
                        <i class="fa fa-plus"></i>
                    </button>
                </div>

                {#if credits.length > 0}
                    <div class="d-flex flex-wrap gap-2 py-2 px-1 rounded bg-black bg-opacity-30 border border-secondary border-opacity-20" style="max-height: 200px; overflow-y: auto;">
                        {#each credits as credit, index}
                            <span class="badge bg-secondary bg-opacity-70 d-flex align-items-center gap-2 py-2 px-3 rounded-pill text-white" style="font-size: 0.8rem;">
                                {credit}
                                <button type="button" class="btn-close btn-close-white" style="font-size: 0.65rem;" onclick={() => removeCreditLine(index)} aria-label="Rimuovi"></button>
                            </span>
                        {/each}
                    </div>
                {:else}
                    <p class="text-muted small text-center my-2">Nessun credito associato a questo video.</p>
                {/if}
            </div>

            <div class="d-flex flex-column gap-2 mt-5">
                <button type="submit" class="btn btn-primary btn-lg w-100" disabled={isUpdating}>
                    {#if isUpdating}
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Salvando...
                    {:else}
                        <i class="fa fa-check me-1"></i> Salva Modifiche
                    {/if}
                </button>
                <button type="button" class="btn btn-outline-secondary w-100" data-bs-dismiss="offcanvas">
                    Annulla
                </button>
            </div>
        </form>
    </div>
</div>
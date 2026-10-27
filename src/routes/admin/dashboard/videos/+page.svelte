<script>
    import { onMount } from "svelte";
    import { deserialize } from '$app/forms';
    import { refreshAll } from "$app/navigation";
    import { toast } from "@zerodevx/svelte-toast";
    import AdminVideoModern from "#lib/components/AdminVideoModern.svelte";
    import { formatFileSize, uploadVideoFile, VIDEO_FILE_ACCEPT } from "#lib/utils/uploadVideo.js";

    let { data } = $props();
    let videos = $derived(data.videos);

    let isUploading = $state(false);
    let showAdvanced = $state(false);

    let newCredits = $state([]);
    let newCreditInput = $state('');

    /** Optional local video, used only to extract the animated AVIF previews. */
    let sourceVideoFile = $state(null);
    let sourceVideoInput = $state(null);
    let sourceUploadProgress = $state(0);
    let sourceVideoError = $state('');

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    function addQuickCredit() {
        if (newCreditInput.trim()) {
            newCredits = [...newCredits, newCreditInput.trim()];
            newCreditInput = '';
        }
    }

    function removeQuickCredit(index) {
        newCredits = newCredits.filter((_, i) => i !== index);
    }

    /**
     * After background AVIF generation starts, re-fetch video list a few times
     * so HD/SD badges update without a full page reload.
     */
    function pollForPreviewUpdates() {
        let attempts = 0;
        const maxAttempts = 12;
        const intervalMs = 30_000;

        const timer = setInterval(async () => {
            attempts += 1;
            await refreshAll();
            if (attempts >= maxAttempts) clearInterval(timer);
        }, intervalMs);
    }

    /**
     * @param {Event & { currentTarget: HTMLInputElement }} event
     */
    function handleSourceVideoChange(event) {
        const file = event.currentTarget.files?.[0] ?? null;
        sourceVideoError = '';
        sourceUploadProgress = 0;

        if (file && file.size > data.maxUploadBytes) {
            sourceVideoFile = null;
            sourceVideoError = `Il video supera il limite di ${formatFileSize(data.maxUploadBytes)}.`;
            event.currentTarget.value = '';
            return;
        }

        sourceVideoFile = file;
    }

    function clearSourceVideo() {
        sourceVideoFile = null;
        sourceVideoError = '';
        sourceUploadProgress = 0;
        if (sourceVideoInput) sourceVideoInput.value = '';
    }

    async function handleUpload(event) {
        event.preventDefault();
        if (isUploading) return;

        isUploading = true;
        sourceVideoError = '';
        const formEl = event.target;
        const formData = new FormData(formEl);

        formData.append('credits', JSON.stringify(newCredits));

        const toastId = toast.push(
            sourceVideoFile
                ? 'Caricamento del video locale e aggiunta del film in corso...'
                : 'Caricamento in corso, attendere...',
            { duration: 600000 }
        );

        if (sourceVideoFile) {
            try {
                const upload = await uploadVideoFile(sourceVideoFile, (progress) => {
                    sourceUploadProgress = progress;
                });
                formData.append('videoUploadId', upload.id);
            } catch (err) {
                toast.pop(toastId);
                sourceVideoError = err instanceof Error ? err.message : 'Caricamento del video non riuscito.';
                toast.push(sourceVideoError, {
                    theme: { '--toastBackground': '#f44336' }
                });
                isUploading = false;
                return;
            }
        }

        const response = await fetch('?/upload', {
            method: 'POST',
            body: formData
        });

        toast.pop(toastId);

        const result = deserialize(await response.text());
        await refreshAll();

        if (result.type === 'success') {
            const generating = result.data?.generatingPreviews ?? result.data?.body?.generatingPreviews;
            toast.push(
                generating
                    ? 'Video aggiunto. Generazione anteprime AVIF in corso in background (può richiedere alcuni minuti)...'
                    : 'Video aggiunto con successo',
                {
                    theme: { '--toastBackground': '#4caf50' },
                    duration: generating ? 12000 : 4000
                }
            );
            if (generating) pollForPreviewUpdates();
            formEl.reset();
            newCredits = [];
            clearSourceVideo();
            showAdvanced = false;
        } else {
            toast.push(
                result.data?.message || result.data?.body?.message || 'Errore durante il caricamento',
                {
                    theme: { '--toastBackground': '#f44336' }
                }
            );
        }

        isUploading = false;
    }
</script>

<div class="container-fluid mt-3 pt-4 pb-4 bg-black bg-opacity-25 rounded-3">
    <div class="row mb-auto mb-md-2">
        <div class="col text-start ms-2 ms-md-3">
            <h1 class="h1 mb-0">Video:</h1>
            <p class="text-secondary">Gestisci i tuoi video</p>
        </div>
    </div>

    {#if !data.pocketbaseAvailable}
        <div class="alert alert-warning border-warning border-opacity-25 bg-warning bg-opacity-10 text-warning-emphasis mx-1 mb-3 d-flex align-items-start gap-2" role="alert">
            <i class="fa-solid fa-triangle-exclamation mt-1"></i>
            <div>
                <strong>PocketBase non disponibile.</strong>
                Non puoi caricare o modificare i film finché il backend non torna online.
                Puoi comunque usare la <a class="alert-link" href="/admin/dashboard/conversion">conversione video</a>.
            </div>
        </div>
    {/if}

    {#if data.pocketbaseAvailable}
    <!-- Upload Section styled in translucent dark theme -->
    <div class="row bg-black bg-opacity-50 border border-secondary border-opacity-25 pt-4 pb-4 px-3 mx-1 rounded-4">
        <div class="col-12 text-start">
            <h3 class="h3 mb-1">Aggiungi <b>VIDEO</b>:</h3>
            <p class="text-secondary mb-3">
                Aggiungi un filmato e configura opzioni avanzate.
                Se non carichi le anteprime animate, verranno generate automaticamente dal video YouTube
                (~7 secondi da t=2s di default, HD max 720px / SD max 320px).
                Puoi anche usare un video locale temporaneo nelle opzioni avanzate per estrarle senza yt-dlp.
            </p>

            <form method="post" enctype="multipart/form-data" action="?/upload" onsubmit={handleUpload}>
                <div class="row g-3">
                    <div class="col-12 col-md-5">
                        <label class="form-label small text-secondary" for="newVideoName">Titolo</label>
                        <input id="newVideoName" type="text" class="form-control bg-dark text-white border-secondary" name="name" placeholder="Titolo del video" required>
                    </div>
                    <div class="col-12 col-md-5">
                        <label class="form-label small text-secondary" for="newVideoUrl">URL YouTube</label>
                        <input id="newVideoUrl" type="text" class="form-control bg-dark text-white border-secondary" name="url" placeholder="https://www.youtube.com/..." required>
                    </div>
                    <div class="col-12 col-md-2 d-flex align-items-end">
                        <button class="btn btn-lg btn-success w-100" type="submit" disabled={isUploading}>
                            {#if isUploading}
                                <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                            {:else}
                                <i class="fa fa-plus me-1"></i> Aggiungi
                            {/if}
                        </button>
                    </div>
                </div>

                <div class="mt-3">
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick={() => showAdvanced = !showAdvanced}>
                        <i class="fa-solid {showAdvanced ? 'fa-chevron-up' : 'fa-chevron-down'} me-1"></i>
                        Opzioni Avanzate (Anteprime, video locale e crediti)
                    </button>
                </div>

                {#if showAdvanced}
                    <div class="row mt-3 p-3 bg-dark bg-opacity-50 border border-white border-opacity-10 rounded-3 g-3">
                        <div class="col-12">
                            <p class="small text-secondary mb-0">
                                <i class="fa-solid fa-wand-magic-sparkles me-1"></i>
                                Opzionale: lascia vuote le anteprime per generarle automaticamente.
                                Puoi estrarle da YouTube oppure da un video locale temporaneo.
                            </p>
                        </div>
                        <div class="col-12 col-md-4">
                            <label class="form-label small text-white" for="previewStartUpload">Inizio clip auto-preview (secondi)</label>
                            <input
                                id="previewStartUpload"
                                type="number"
                                name="previewStart"
                                min="0"
                                step="0.5"
                                value="2"
                                class="form-control bg-dark text-white border-secondary"
                                placeholder="2"
                            >
                            <div class="form-text text-secondary">Default 2s. Accetta anche mm:ss se digiti a mano altrove.</div>
                        </div>
                        <div class="col-12 col-md-8">
                            <label class="form-label small text-white" for="sourceVideoUpload">
                                Video locale per le anteprime (temporaneo)
                            </label>
                            <input
                                id="sourceVideoUpload"
                                type="file"
                                accept={VIDEO_FILE_ACCEPT}
                                bind:this={sourceVideoInput}
                                onchange={handleSourceVideoChange}
                                class="form-control bg-dark text-white border-secondary"
                                disabled={isUploading}
                            >
                            <div class="form-text text-secondary">
                                Se selezionato, le anteprime AVIF vengono estratte da questo file invece che da YouTube.
                                Non viene salvato su PocketBase e viene eliminato dopo la conversione.
                                Max {formatFileSize(data.maxUploadBytes)}.
                            </div>
                            {#if sourceVideoFile}
                                <div class="d-flex flex-wrap align-items-center gap-2 mt-2 small">
                                    <span class="text-white text-truncate" style="max-width: 100%;">
                                        <i class="fa-solid fa-file-video me-1"></i>
                                        {sourceVideoFile.name}
                                        <span class="text-secondary">({formatFileSize(sourceVideoFile.size)})</span>
                                    </span>
                                    <button type="button" class="btn btn-sm btn-link text-warning p-0" onclick={clearSourceVideo} disabled={isUploading}>
                                        Rimuovi
                                    </button>
                                </div>
                            {/if}
                            {#if isUploading && sourceVideoFile}
                                <div class="progress mt-2 bg-black bg-opacity-50" style="height: 6px;" role="progressbar" aria-label="Caricamento video locale" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(sourceUploadProgress * 100)}>
                                    <div class="progress-bar bg-success" style="width: {Math.round(sourceUploadProgress * 100)}%"></div>
                                </div>
                            {/if}
                            {#if sourceVideoError}
                                <div class="alert alert-danger border-danger border-opacity-25 bg-danger bg-opacity-10 text-danger-emphasis py-1 px-2 small mt-2 mb-0" role="alert">
                                    {sourceVideoError}
                                </div>
                            {/if}
                        </div>
                        <div class="col-12 col-md-4">
                            <label class="form-label small text-white" for="animatedhighresUpload">Preview Animata HD (.webp, .avif, .gif)</label>
                            <input id="animatedhighresUpload" type="file" name="animatedhighres" accept=".webp,.avif,.gif" class="form-control bg-dark text-white border-secondary">
                        </div>
                        <div class="col-12 col-md-4">
                            <label class="form-label small text-white" for="animatedlowresUpload">Preview Animata SD (.webp, .avif, .gif)</label>
                            <input id="animatedlowresUpload" type="file" name="animatedlowres" accept=".webp,.avif,.gif" class="form-control bg-dark text-white border-secondary">
                        </div>
                        <div class="col-12">
                            <label class="form-label small text-white" for="newCreditInput">Credits / Sottotitoli</label>
                            <div class="input-group mb-2">
                                <input id="newCreditInput" type="text" bind:value={newCreditInput} class="form-control bg-dark text-white border-secondary" placeholder="Es: Regia: Alice Rossi">
                                <button type="button" class="btn btn-primary" onclick={addQuickCredit}>Aggiungi</button>
                            </div>

                            {#if newCredits.length > 0}
                                <div class="d-flex flex-wrap gap-2 mt-2">
                                    {#each newCredits as credit, idx}
                                        <span class="badge bg-secondary d-flex align-items-center gap-2 py-2 px-3 rounded-pill text-white">
                                            {credit}
                                            <button type="button" class="btn-close btn-close-white" style="font-size: 0.65rem;" onclick={() => removeQuickCredit(idx)} aria-label="Rimuovi"></button>
                                        </span>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            </form>
        </div>
    </div>
    {/if}

    <!-- Active Videos Section -->
    <div class="row w-100 mx-auto justify-content-start align-items-stretch text-center gy-4 mt-2">
        <div class="col-12">
            <h4 class="h4 text-start ms-auto ms-md-2 mt-2 mb-0 border-bottom border-secondary border-opacity-25 pb-2">I tuoi video:</h4>
        </div>

        {#if !data.pocketbaseAvailable}
            <div class="col-12 mt-5 py-5 text-center">
                <i class="fa-solid fa-plug-circle-xmark fa-3x text-warning mb-3"></i>
                <h3 class="h3 text-warning">Film non disponibili</h3>
                <p class="text-secondary mb-4">PocketBase è offline: la lista dei film non può essere caricata.</p>
                <a class="btn btn-primary" href="/admin/dashboard/conversion">
                    <i class="fa-solid fa-wand-magic-sparkles me-1"></i>
                    Vai alla conversione video
                </a>
            </div>
        {:else if !videos || videos.length === 0}
            <div class="col-12 mt-5 py-5 text-center">
                <i class="fa-solid fa-film fa-3x text-secondary mb-3"></i>
                <h3 class="h3 text-secondary">Non hai ancora aggiunto video...</h3>
            </div>
        {:else}
            {#each videos as video (video.id)}
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch justify-content-center">
                    <AdminVideoModern {video} maxUploadBytes={data.maxUploadBytes} />
                </div>
            {/each}
        {/if}
    </div>
</div>

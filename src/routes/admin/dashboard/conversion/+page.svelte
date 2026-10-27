<script>
    import { enhance } from '$app/forms';
    import { untrack } from 'svelte';
    import { formatFileSize, uploadVideoFile, VIDEO_FILE_ACCEPT } from '#lib/utils/uploadVideo.js';

    /** @type {import('./$types').PageProps} */
    let { data, form } = $props();

    let polledJob = $state(null);
    let isStarting = $state(false);
    let isUploading = $state(false);
    let pollError = $state('');

    let sourceType = $state(
        untrack(() =>
            data.job?.sourceType === 'upload' || form?.source === 'upload' ? 'upload' : 'youtube'
        )
    );
    let selectedFile = $state(null);
    let fileInput = $state(null);
    let uploadProgress = $state(0);
    let uploadError = $state('');

    // Polled data wins only for the job currently loaded from the URL. A new
    // navigation (new job id, or no job) immediately uses the server data.
    let job = $derived(polledJob && polledJob.id === data.job?.id ? polledJob : data.job);

    $effect(() => {
        void data.job?.id;
        pollError = '';
    });

    const statuses = {
        queued: {
            label: 'In coda',
            tone: 'text-secondary',
            icon: 'fa-clock'
        },
        running: {
            label: 'In corso',
            tone: 'text-info-emphasis',
            icon: 'fa-spinner fa-spin'
        },
        completed: {
            label: 'Completata',
            tone: 'text-success-emphasis',
            icon: 'fa-circle-check'
        },
        failed: {
            label: 'Errore',
            tone: 'text-danger-emphasis',
            icon: 'fa-triangle-exclamation'
        }
    };

    let status = $derived(job ? (statuses[job.status] ?? statuses.queued) : null);
    let progress = $derived(
        !job
            ? 0
            : job.status === 'completed' || job.status === 'failed'
              ? 100
              : job.status === 'running'
                ? 65
                : 10
    );
    let isJobActive = $derived(job?.status === 'queued' || job?.status === 'running');

    $effect(() => {
        const current = job;
        if (!current || !isJobActive) {
            return;
        }

        let cancelled = false;
        const interval = setInterval(async () => {
            try {
                const response = await fetch(
                    `/admin/dashboard/conversion/status/${encodeURIComponent(current.id)}`,
                    { headers: { accept: 'application/json' } }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const next = await response.json();
                if (!cancelled) {
                    polledJob = next;
                    pollError = '';
                }
            } catch {
                if (!cancelled) {
                    pollError = 'Impossibile aggiornare lo stato. Riprovo automaticamente...';
                }
            }
        }, 2000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    });

    /**
     * @param {Event & { currentTarget: HTMLInputElement }} event
     */
    function handleFileChange(event) {
        const file = event.currentTarget.files?.[0] ?? null;
        uploadError = '';
        uploadProgress = 0;

        if (file && file.size > data.maxUploadBytes) {
            selectedFile = null;
            uploadError = `Il video supera il limite di ${formatFileSize(data.maxUploadBytes)}.`;
            event.currentTarget.value = '';
            return;
        }

        selectedFile = file;
    }

    function clearSelectedFile() {
        selectedFile = null;
        uploadError = '';
        uploadProgress = 0;
        if (fileInput) fileInput.value = '';
    }

    function setSource(next) {
        sourceType = next;
        uploadError = '';
    }

    /**
     * @type {import('$app/forms').SubmitFunction}
     */
    async function enhanceStart({ formData, cancel }) {
        uploadError = '';
        isStarting = true;

        if (sourceType !== 'upload') {
            return async ({ result, update }) => {
                isStarting = false;
                await update();
                if (result.type === 'success' || result.type === 'redirect') {
                    clearSelectedFile();
                }
            };
        }

        if (!selectedFile) {
            uploadError = 'Seleziona un video da caricare.';
            isStarting = false;
            cancel();
            return;
        }

        isUploading = true;
        try {
            const upload = await uploadVideoFile(selectedFile, (value) => {
                uploadProgress = value;
            });
            formData.set('videoUploadId', upload.id);
        } catch (err) {
            uploadError =
                err instanceof Error ? err.message : 'Caricamento del video non riuscito.';
            isStarting = false;
            isUploading = false;
            cancel();
            return;
        }

        isUploading = false;

        return async ({ result, update }) => {
            isStarting = false;
            await update();
            if (result.type === 'success' || result.type === 'redirect') {
                clearSelectedFile();
            }
        };
    }

    /**
     * @param {number} timestamp
     */
    function formatDate(timestamp) {
        return new Intl.DateTimeFormat('it-IT', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(new Date(timestamp));
    }

    /**
     * @param {number} seconds
     */
    function formatSeconds(seconds) {
        const total = Math.max(0, Math.round(seconds));
        const minutes = Math.floor(total / 60);
        const rest = total % 60;

        return minutes > 0 ? `${minutes}:${String(rest).padStart(2, '0')}` : `${rest}s`;
    }
</script>

<svelte:head>
    <title>MZEYFILMS - Admin - Conversione video</title>
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

<div class="conversion-page container-fluid mt-3 mb-2 pt-4 pb-4">
    <div class="row mb-4">
        <div class="col text-start ms-2 ms-md-3">
            <h1 class="h1 mb-1">Conversione video</h1>
            <p class="text-secondary mb-0">
                Estrai anteprime animate AVIF HD e SD da un video YouTube o da un file locale.
            </p>
        </div>
    </div>

    {#if data.jobMissing}
        <div class="notice notice-warning mx-1 mb-4 d-flex align-items-start gap-2" role="alert">
            <i class="fa-solid fa-triangle-exclamation mt-1"></i>
            <div>
                <strong>Conversione non trovata.</strong>
                Il job richiesto non esiste più o è scaduto. Avvia una nuova conversione qui sotto.
            </div>
        </div>
    {/if}

    <div class="row g-4 mx-1">
        <div class="col-12 col-xl-5">
            <section class="admin-panel h-100" aria-labelledby="conversionFormTitle">
                <div class="panel-body">
                    <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
                        <div>
                            <h2 class="h4 mb-1" id="conversionFormTitle">Nuova conversione</h2>
                            <p class="small text-secondary mb-0">Clip di circa 7 secondi in entrambe le versioni.</p>
                        </div>
                        <i class="fa-solid fa-wand-magic-sparkles fa-lg text-secondary" aria-hidden="true"></i>
                    </div>

                    <form method="POST" action="?/start" use:enhance={enhanceStart}>
                        <fieldset class="mb-4">
                            <legend class="form-label small text-secondary mb-2">Origine</legend>

                            <div class="source-picker">
                                <input
                                    class="btn-check"
                                    type="radio"
                                    name="source"
                                    id="sourceYoutube"
                                    value="youtube"
                                    checked={sourceType === 'youtube'}
                                    onchange={() => setSource('youtube')}
                                >
                                <label class="source-option" for="sourceYoutube">
                                    <i class="fa-brands fa-youtube" aria-hidden="true"></i>
                                    <span>
                                        <span class="d-block fw-semibold">YouTube</span>
                                        <span class="small text-secondary">Incolla un link</span>
                                    </span>
                                </label>

                                <input
                                    class="btn-check"
                                    type="radio"
                                    name="source"
                                    id="sourceUpload"
                                    value="upload"
                                    checked={sourceType === 'upload'}
                                    onchange={() => setSource('upload')}
                                >
                                <label class="source-option" for="sourceUpload">
                                    <i class="fa-solid fa-file-video" aria-hidden="true"></i>
                                    <span>
                                        <span class="d-block fw-semibold">File locale</span>
                                        <span class="small text-secondary">Carica un video</span>
                                    </span>
                                </label>
                            </div>
                        </fieldset>

                        {#if sourceType === 'youtube'}
                            <div class="mb-3">
                                <label class="form-label small text-secondary" for="conversionUrl">URL YouTube</label>
                                <input
                                    id="conversionUrl"
                                    type="url"
                                    name="url"
                                    class="form-control admin-input"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={form?.url ?? data.job?.youtubeUrl ?? ''}
                                    autocomplete="off"
                                >
                            </div>
                        {:else}
                            <div class="mb-3">
                                <label class="form-label small text-secondary" for="conversionVideo">
                                    Video locale <span class="text-secondary">(temporaneo)</span>
                                </label>
                                <input
                                    id="conversionVideo"
                                    type="file"
                                    accept={VIDEO_FILE_ACCEPT}
                                    bind:this={fileInput}
                                    onchange={handleFileChange}
                                    class="form-control admin-input admin-file"
                                    disabled={isStarting}
                                >
                                <div class="form-text text-secondary">
                                    Non viene salvato: serve solo a estrarre le anteprime e viene eliminato
                                    alla fine. Max {formatFileSize(data.maxUploadBytes)}.
                                </div>

                                {#if selectedFile}
                                    <div class="selected-file mt-2">
                                        <span class="text-truncate">
                                            <i class="fa-solid fa-file-video me-1" aria-hidden="true"></i>
                                            {selectedFile.name}
                                        </span>
                                        <span class="d-flex align-items-center gap-2">
                                            <span class="small text-secondary">{formatFileSize(selectedFile.size)}</span>
                                            <button
                                                type="button"
                                                class="btn btn-sm btn-link text-warning p-0"
                                                onclick={clearSelectedFile}
                                                disabled={isStarting}
                                            >
                                                Rimuovi
                                            </button>
                                        </span>
                                    </div>
                                {/if}

                                {#if isUploading}
                                    <div class="mt-3">
                                        <div class="d-flex justify-content-between small text-secondary mb-1">
                                            <span>Caricamento video...</span>
                                            <span>{Math.round(uploadProgress * 100)}%</span>
                                        </div>
                                        <div
                                            class="progress admin-progress"
                                            role="progressbar"
                                            aria-label="Caricamento video locale"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            aria-valuenow={Math.round(uploadProgress * 100)}
                                        >
                                            <div class="progress-bar" style="width: {Math.round(uploadProgress * 100)}%"></div>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {/if}

                        <div class="mb-4">
                            <label class="form-label small text-secondary" for="conversionStart">Inizio clip (secondi)</label>
                            <input
                                id="conversionStart"
                                type="number"
                                name="previewStart"
                                class="form-control admin-input"
                                min="0"
                                step="0.5"
                                value={form?.previewStart ?? data.job?.startSeconds ?? 2}
                                required
                            >
                            <div class="form-text text-secondary">
                                Default 2s. Valori decimali consentiti, ad esempio 2.5.
                            </div>
                        </div>

                        {#if uploadError || form?.message}
                            <div class="notice notice-danger py-2 px-3 small mb-3" role="alert">
                                <i class="fa-solid fa-circle-exclamation me-1" aria-hidden="true"></i>
                                {uploadError || form?.message}
                            </div>
                        {/if}

                        <button class="btn btn-accent btn-lg w-100" type="submit" disabled={isStarting}>
                            {#if isStarting}
                                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {isUploading ? 'Caricamento...' : 'Avvio...'}
                            {:else}
                                <i class="fa-solid fa-play me-1" aria-hidden="true"></i>
                                Avvia conversione
                            {/if}
                        </button>
                    </form>

                    <p class="small text-secondary mt-3 mb-0">
                        <i class="fa-solid fa-circle-info me-1" aria-hidden="true"></i>
                        La conversione usa ffmpeg. Per YouTube serve anche yt-dlp. I file generati restano
                        disponibili per 24 ore.
                    </p>
                </div>
            </section>
        </div>

        <div class="col-12 col-xl-7">
            {#if job && status}
                <section class="admin-panel h-100" aria-labelledby="conversionJobTitle">
                    <div class="panel-body">
                        <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                            <div class="text-break min-w-0">
                                <h2 class="h4 mb-1" id="conversionJobTitle">Stato conversione</h2>
                                <p class="small text-secondary mb-0">
                                    <i class="fa-brands {job.sourceType === 'upload' ? 'fa-file-video' : 'fa-youtube'} me-1" aria-hidden="true"></i>
                                    {job.sourceLabel}
                                </p>
                            </div>
                            <span class="status-pill {status.tone}">
                                <i class="fa-solid {status.icon}" aria-hidden="true"></i>
                                {status.label}
                            </span>
                        </div>

                        <div
                            class="progress admin-progress mb-2"
                            role="progressbar"
                            aria-label="Avanzamento conversione"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuenow={progress}
                        >
                            <div
                                class="progress-bar {isJobActive ? 'progress-bar-striped progress-bar-animated' : ''} {job.status === 'completed' ? 'is-complete' : job.status === 'failed' ? 'is-failed' : ''}"
                                style="width: {progress}%"
                            ></div>
                        </div>
                        <p class="small text-secondary mb-3" aria-live="polite">{job.stage}</p>

                        <dl class="job-meta row g-2 small mb-3">
                            <div class="col-12 col-sm-6">
                                <dt><i class="fa-regular fa-clock me-1" aria-hidden="true"></i>Avviata</dt>
                                <dd>{formatDate(job.createdAt)}</dd>
                            </div>
                            <div class="col-12 col-sm-6">
                                <dt><i class="fa-solid fa-hourglass-half me-1" aria-hidden="true"></i>Scade</dt>
                                <dd>{formatDate(job.expiresAt)}</dd>
                            </div>
                            <div class="col-12 col-sm-6">
                                <dt><i class="fa-solid fa-play me-1" aria-hidden="true"></i>Inizio clip</dt>
                                <dd>{formatSeconds(job.startSeconds)}</dd>
                            </div>
                            <div class="col-12 col-sm-6">
                                <dt><i class="fa-solid fa-film me-1" aria-hidden="true"></i>Formato</dt>
                                <dd>AVIF animato</dd>
                            </div>
                        </dl>

                        {#if pollError}
                            <div class="notice notice-warning py-2 px-3 small mb-2" role="status">
                                <i class="fa-solid fa-rotate me-1" aria-hidden="true"></i>
                                {pollError}
                            </div>
                        {/if}

                        {#if job.error}
                            <div class="notice notice-danger py-2 px-3 small mb-2" role="alert">
                                <strong>Errore:</strong> <span class="text-break">{job.error}</span>
                            </div>
                        {/if}

                        {#if job.warning}
                            <div class="notice notice-warning py-2 px-3 small mb-2" role="alert">
                                {job.warning}
                            </div>
                        {/if}

                        {#if job.status === 'completed'}
                            <div class="row g-3 mt-1">
                                {#if job.files.high}
                                    <div class="col-12 col-md-6">
                                        <div class="preview-tile h-100">
                                            <div class="ratio ratio-16x9 preview-frame">
                                                <img
                                                    src="{job.files.high.url}?inline=1"
                                                    class="w-100 h-100 object-fit-contain"
                                                    alt="Anteprima animata AVIF HD"
                                                >
                                            </div>
                                            <div class="p-3 d-flex flex-column gap-2">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <span class="preview-label">HD</span>
                                                    <span class="small text-secondary">{formatFileSize(job.files.high.size)}</span>
                                                </div>
                                                <p class="small text-secondary mb-1">720px, 24 fps, circa 7 secondi.</p>
                                                <a class="btn btn-outline-light btn-sm mt-auto" href={job.files.high.url} download={job.files.high.name}>
                                                    <i class="fa-solid fa-download me-1" aria-hidden="true"></i>
                                                    Scarica HD (.avif)
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                {/if}

                                {#if job.files.low}
                                    <div class="col-12 col-md-6">
                                        <div class="preview-tile h-100">
                                            <div class="ratio ratio-16x9 preview-frame">
                                                <img
                                                    src="{job.files.low.url}?inline=1"
                                                    class="w-100 h-100 object-fit-contain"
                                                    alt="Anteprima animata AVIF SD"
                                                >
                                            </div>
                                            <div class="p-3 d-flex flex-column gap-2">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <span class="preview-label">SD</span>
                                                    <span class="small text-secondary">{formatFileSize(job.files.low.size)}</span>
                                                </div>
                                                <p class="small text-secondary mb-1">320px, 15 fps, circa 7 secondi.</p>
                                                <a class="btn btn-outline-light btn-sm mt-auto" href={job.files.low.url} download={job.files.low.name}>
                                                    <i class="fa-solid fa-download me-1" aria-hidden="true"></i>
                                                    Scarica SD (.avif)
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </div>

                            <div class="d-flex flex-wrap justify-content-end gap-2 mt-4">
                                <a class="btn btn-outline-secondary" href="/admin/dashboard/conversion">
                                    <i class="fa-solid fa-plus me-1" aria-hidden="true"></i>
                                    Nuova conversione
                                </a>
                            </div>
                        {/if}
                    </div>
                </section>
            {:else}
                <section class="admin-panel h-100">
                    <div class="panel-body d-flex flex-column align-items-center justify-content-center text-center empty-state">
                        <span class="empty-icon" aria-hidden="true">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                        </span>
                        <h2 class="h4 mb-2">Nessuna conversione in corso</h2>
                        <p class="text-secondary mb-0">
                            Incolla un link YouTube o carica un video locale per creare le anteprime AVIF.
                        </p>
                    </div>
                </section>
            {/if}
        </div>
    </div>
</div>

<style>
    .conversion-page {
        --panel-border: rgba(255, 255, 255, 0.07);
        --panel-surface: rgba(255, 255, 255, 0.025);
        --input-border: rgba(255, 255, 255, 0.13);
        --muted-line: rgba(255, 255, 255, 0.1);
    }

    .admin-panel {
        background: var(--panel-surface);
        border: 1px solid var(--panel-border);
        border-radius: 1rem;
    }

    .panel-body {
        padding: 1.5rem;
    }

    @media (max-width: 575.98px) {
        .panel-body {
            padding: 1.1rem;
        }
    }

    .source-picker {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
    }

    .source-option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-height: 4.25rem;
        padding: 0.75rem 0.9rem;
        border: 1px solid var(--input-border);
        border-radius: 0.75rem;
        color: #f3f4f6;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .source-option > i {
        width: 1.4rem;
        font-size: 1.25rem;
        color: #9aa3b0;
        text-align: center;
    }

    .source-option:hover {
        background: rgba(255, 255, 255, 0.035);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .btn-check:checked + .source-option {
        background: rgba(255, 255, 255, 0.075);
        border-color: rgba(255, 255, 255, 0.32);
    }

    .btn-check:checked + .source-option > i {
        color: #fff;
    }

    .btn-check:focus-visible + .source-option {
        outline: 2px solid #c5cbd4;
        outline-offset: 2px;
    }

    .admin-input {
        background-color: rgba(0, 0, 0, 0.32);
        border-color: var(--input-border);
        color: #fff;
    }

    .admin-input:focus {
        background-color: rgba(0, 0, 0, 0.45);
        border-color: rgba(255, 255, 255, 0.3);
        color: #fff;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.06);
    }

    .admin-input::file-selector-button {
        background: rgba(255, 255, 255, 0.09);
        border: 0;
        border-radius: 0.45rem;
        color: #fff;
        margin-right: 0.75rem;
        padding: 0.4rem 0.75rem;
    }

    .admin-input::file-selector-button:hover {
        background: rgba(255, 255, 255, 0.16);
    }

    .selected-file {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        max-width: 100%;
        padding: 0.55rem 0.75rem;
        border-radius: 0.55rem;
        background: rgba(255, 255, 255, 0.04);
        color: #f3f4f6;
    }

    .btn-accent {
        background: #e8eaed;
        border-color: #e8eaed;
        color: #080808;
        font-weight: 650;
    }

    .btn-accent:hover,
    .btn-accent:focus-visible {
        background: #fff;
        border-color: #fff;
        color: #000;
    }

    .btn-accent:disabled {
        background: #6f7681;
        border-color: #6f7681;
        color: #111;
    }

    .admin-progress {
        height: 6px;
        background: rgba(255, 255, 255, 0.07);
    }

    .admin-progress .progress-bar {
        background: #c5cbd4;
    }

    .admin-progress .progress-bar.is-complete {
        background: #4ade80;
    }

    .admin-progress .progress-bar.is-failed {
        background: #f87171;
    }

    .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        font-size: 0.82rem;
        font-weight: 600;
        white-space: nowrap;
    }

    .notice {
        display: flex;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.035);
        border: 1px solid var(--panel-border);
        border-radius: 0.65rem;
        color: #e5e7eb;
    }

    .notice-warning {
        background: rgba(234, 179, 8, 0.07);
        border-color: rgba(234, 179, 8, 0.16);
        color: #fde68a;
    }

    .notice-danger {
        background: rgba(248, 113, 113, 0.07);
        border-color: rgba(248, 113, 113, 0.16);
        color: #fecaca;
    }

    .job-meta {
        margin: 0;
    }

    .job-meta dt {
        color: #9aa3b0;
        font-weight: 500;
    }

    .job-meta dd {
        margin: 0.1rem 0 0;
        color: #f3f4f6;
    }

    .preview-tile {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid var(--panel-border);
        border-radius: 0.75rem;
        background: rgba(0, 0, 0, 0.28);
    }

    .preview-frame {
        background: #000;
        border-bottom: 1px solid var(--panel-border);
    }

    .preview-label {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: #9aa3b0;
    }

    .empty-state {
        min-height: 22rem;
    }

    .empty-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        height: 3.5rem;
        margin-bottom: 1rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        color: #9aa3b0;
        font-size: 1.4rem;
    }
</style>

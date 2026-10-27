<script>
    import { enhance } from '$app/forms';

    /** @type {import('./$types').PageProps} */
    let { data, form } = $props();

    let polledJob = $state(null);
    let isStarting = $state(false);
    let pollError = $state('');

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
            badge: 'bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-50',
            icon: 'fa-clock'
        },
        running: {
            label: 'In corso',
            badge: 'bg-primary bg-opacity-25 text-info border border-primary border-opacity-50',
            icon: 'fa-spinner fa-spin'
        },
        completed: {
            label: 'Completata',
            badge: 'bg-success bg-opacity-25 text-success-emphasis border border-success border-opacity-50',
            icon: 'fa-circle-check'
        },
        failed: {
            label: 'Errore',
            badge: 'bg-danger bg-opacity-25 text-danger-emphasis border border-danger border-opacity-50',
            icon: 'fa-triangle-exclamation'
        }
    };

    let status = $derived(job ? (statuses[job.status] ?? statuses.queued) : null);
    let progress = $derived(
        !job
            ? 0
            : job.status === 'completed'
              ? 100
              : job.status === 'failed'
                ? 100
                : job.status === 'running'
                  ? 65
                  : 10
    );

    $effect(() => {
        const current = job;
        if (!current || (current.status !== 'queued' && current.status !== 'running')) {
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

    function enhanceStart() {
        isStarting = true;

        return async ({ update }) => {
            await update();
            isStarting = false;
        };
    }

    /**
     * @param {number} bytes
     */
    function formatBytes(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0) return '—';

        const units = ['B', 'KB', 'MB', 'GB'];
        let value = bytes;
        let unit = 0;

        while (value >= 1024 && unit < units.length - 1) {
            value /= 1024;
            unit += 1;
        }

        return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
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
    <title>MZEYFILMS - Admin - Conversione YouTube</title>
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

<div class="container-fluid mt-3 mb-2 pt-4 pb-4 bg-black bg-opacity-25 rounded-3">
    <div class="row mb-4">
        <div class="col text-start ms-2 ms-md-3">
            <h1 class="h1 mb-0">Conversione YouTube</h1>
            <p class="text-secondary mb-0">
                Genera anteprime animate AVIF HD e SD da un video YouTube, senza PocketBase.
            </p>
        </div>
    </div>

    <div class="alert alert-info border-info border-opacity-25 bg-info bg-opacity-10 text-info-emphasis mx-1 mb-4 d-flex align-items-start gap-2" role="alert">
        <i class="fa-solid fa-circle-info mt-1"></i>
        <div>
            <strong>Funziona anche con PocketBase offline.</strong>
            La conversione usa ffmpeg e yt-dlp sul server. I file generati restano disponibili per 24 ore,
            poi vengono eliminati automaticamente dalla cartella temporanea.
        </div>
    </div>

    {#if data.jobMissing}
        <div class="alert alert-warning border-warning border-opacity-25 bg-warning bg-opacity-10 text-warning-emphasis mx-1 mb-4 d-flex align-items-start gap-2" role="alert">
            <i class="fa-solid fa-triangle-exclamation mt-1"></i>
            <div>
                <strong>Conversione non trovata.</strong>
                Il job richiesto non esiste più o è scaduto. Avvia una nuova conversione qui sotto.
            </div>
        </div>
    {/if}

    <div class="row g-4 mx-1">
        <div class="col-12 col-xl-5">
            <div class="card h-100 bg-black bg-opacity-50 text-white border border-secondary border-opacity-25 rounded-4">
                <div class="card-body p-4">
                    <h2 class="h4 mb-2">
                        <i class="fa-solid fa-wand-magic-sparkles text-primary me-2"></i>
                        Nuova conversione
                    </h2>
                    <p class="text-secondary small mb-4">
                        Incolla l'URL del video. La clip parte dal secondo indicato e dura circa 7 secondi.
                        Vengono create entrambe le versioni, HD (720px) e SD (320px).
                    </p>

                    <form method="POST" action="?/start" use:enhance={enhanceStart}>
                        <div class="mb-3">
                            <label class="form-label small text-secondary" for="conversionUrl">URL YouTube</label>
                            <input
                                id="conversionUrl"
                                type="url"
                                name="url"
                                class="form-control bg-dark text-white border-secondary"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={form?.url ?? data.job?.youtubeUrl ?? ''}
                                autocomplete="off"
                                required
                            >
                        </div>

                        <div class="mb-3">
                            <label class="form-label small text-secondary" for="conversionStart">Inizio clip (secondi)</label>
                            <input
                                id="conversionStart"
                                type="number"
                                name="previewStart"
                                class="form-control bg-dark text-white border-secondary"
                                min="0"
                                step="0.5"
                                value={form?.previewStart ?? data.job?.startSeconds ?? 2}
                                required
                            >
                            <div class="form-text text-secondary">
                                Default 2s. Valori decimali consentiti, ad esempio 2.5.
                            </div>
                        </div>

                        {#if form?.message}
                            <div class="alert alert-danger border-danger border-opacity-25 bg-danger bg-opacity-10 text-danger-emphasis py-2 px-3 small" role="alert">
                                <i class="fa-solid fa-circle-exclamation me-1"></i>
                                {form.message}
                            </div>
                        {/if}

                        <button class="btn btn-primary btn-lg w-100" type="submit" disabled={isStarting}>
                            {#if isStarting}
                                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Avvio...
                            {:else}
                                <i class="fa-solid fa-play me-1"></i>
                                Avvia conversione
                            {/if}
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-12 col-xl-7">
            {#if job && status}
                <div class="card h-100 bg-black bg-opacity-50 text-white border border-secondary border-opacity-25 rounded-4">
                    <div class="card-body p-4">
                        <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                            <div class="text-break">
                                <h2 class="h4 mb-1">Stato conversione</h2>
                                <p class="text-secondary small mb-0">{job.youtubeUrl}</p>
                            </div>
                            <span class="badge rounded-pill {status.badge}">
                                <i class="fa-solid {status.icon} me-1"></i>
                                {status.label}
                            </span>
                        </div>

                        <div class="progress bg-black bg-opacity-50 mb-2" role="progressbar" aria-label="Avanzamento conversione" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                            <div
                                class="progress-bar {job.status === 'running' ? 'progress-bar-striped progress-bar-animated' : ''} {job.status === 'completed' ? 'bg-success' : job.status === 'failed' ? 'bg-danger' : ''}"
                                style="width: {progress}%"
                            ></div>
                        </div>
                        <p class="small text-secondary mb-3" aria-live="polite">{job.stage}</p>

                        <div class="row g-2 small text-secondary mb-3">
                            <div class="col-12 col-sm-6">
                                <i class="fa-regular fa-clock me-1"></i>
                                Avviata: {formatDate(job.createdAt)}
                            </div>
                            <div class="col-12 col-sm-6">
                                <i class="fa-solid fa-hourglass-half me-1"></i>
                                Scade: {formatDate(job.expiresAt)}
                            </div>
                            <div class="col-12 col-sm-6">
                                <i class="fa-solid fa-play me-1"></i>
                                Inizio clip: {formatSeconds(job.startSeconds)}
                            </div>
                            <div class="col-12 col-sm-6">
                                <i class="fa-solid fa-film me-1"></i>
                                Formato: AVIF animato
                            </div>
                        </div>

                        {#if pollError}
                            <div class="alert alert-warning border-warning border-opacity-25 bg-warning bg-opacity-10 text-warning-emphasis py-2 px-3 small" role="status">
                                <i class="fa-solid fa-rotate me-1"></i>
                                {pollError}
                            </div>
                        {/if}

                        {#if job.error}
                            <div class="alert alert-danger border-danger border-opacity-25 bg-danger bg-opacity-10 text-danger-emphasis py-2 px-3 small" role="alert">
                                <strong>Errore:</strong> <span class="text-break">{job.error}</span>
                            </div>
                        {/if}

                        {#if job.warning}
                            <div class="alert alert-warning border-warning border-opacity-25 bg-warning bg-opacity-10 text-warning-emphasis py-2 px-3 small" role="alert">
                                {job.warning}
                            </div>
                        {/if}

                        {#if job.status === 'completed'}
                            <div class="row g-3">
                                {#if job.files.high}
                                    <div class="col-12 col-md-6">
                                        <div class="card h-100 bg-dark bg-opacity-75 text-white border border-secondary border-opacity-25 rounded-3 overflow-hidden">
                                            <div class="ratio ratio-16x9 bg-black bg-opacity-50">
                                                <img
                                                    src="{job.files.high.url}?inline=1"
                                                    class="w-100 h-100 object-fit-contain"
                                                    alt="Anteprima animata AVIF HD"
                                                >
                                            </div>
                                            <div class="card-body p-3 d-flex flex-column">
                                                <div class="d-flex justify-content-between align-items-center mb-2">
                                                    <span class="badge bg-success bg-opacity-25 text-success-emphasis border border-success border-opacity-25">HD</span>
                                                    <span class="small text-secondary">{formatBytes(job.files.high.size)}</span>
                                                </div>
                                                <p class="small text-secondary mb-3">720px, 24 fps, circa 7 secondi.</p>
                                                <a class="btn btn-success mt-auto" href={job.files.high.url} download={job.files.high.name}>
                                                    <i class="fa-solid fa-download me-1"></i>
                                                    Scarica HD (.avif)
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                {/if}

                                {#if job.files.low}
                                    <div class="col-12 col-md-6">
                                        <div class="card h-100 bg-dark bg-opacity-75 text-white border border-secondary border-opacity-25 rounded-3 overflow-hidden">
                                            <div class="ratio ratio-16x9 bg-black bg-opacity-50">
                                                <img
                                                    src="{job.files.low.url}?inline=1"
                                                    class="w-100 h-100 object-fit-contain"
                                                    alt="Anteprima animata AVIF SD"
                                                >
                                            </div>
                                            <div class="card-body p-3 d-flex flex-column">
                                                <div class="d-flex justify-content-between align-items-center mb-2">
                                                    <span class="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25">SD</span>
                                                    <span class="small text-secondary">{formatBytes(job.files.low.size)}</span>
                                                </div>
                                                <p class="small text-secondary mb-3">320px, 15 fps, circa 7 secondi.</p>
                                                <a class="btn btn-info mt-auto" href={job.files.low.url} download={job.files.low.name}>
                                                    <i class="fa-solid fa-download me-1"></i>
                                                    Scarica SD (.avif)
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </div>

                            <div class="d-flex flex-wrap justify-content-end gap-2 mt-4">
                                <a class="btn btn-outline-secondary" href="/admin/dashboard/conversion">
                                    <i class="fa-solid fa-plus me-1"></i>
                                    Nuova conversione
                                </a>
                            </div>
                        {/if}
                    </div>
                </div>
            {:else}
                <div class="card h-100 bg-black bg-opacity-50 text-white border border-secondary border-opacity-25 rounded-4">
                    <div class="card-body d-flex flex-column align-items-center justify-content-center text-center p-5">
                        <i class="fa-solid fa-wand-magic-sparkles fa-3x text-primary mb-3"></i>
                        <h2 class="h4">Nessuna conversione in corso</h2>
                        <p class="text-secondary mb-0">
                            Inserisci l'URL YouTube per creare le anteprime AVIF.
                        </p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

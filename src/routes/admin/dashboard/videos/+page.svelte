<script>
    import {onMount} from "svelte";
    import {deserialize} from '$app/forms';
    import AdminVideo from "$lib/components/AdminVideo.svelte";
    import {invalidateAll} from "$app/navigation";
    import {toast} from "@zerodevx/svelte-toast";
    import AdminVideoModern from "$lib/components/AdminVideoModern.svelte";

    let { data } = $props();
    let { videos } = $state(data);
    $effect(() => {
        ({ videos } = data);
    });

    let isUploading = false;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    async function handleUpload(event) {
        event.preventDefault();

        if (isUploading) {
            return;
        }

        isUploading = true;

        const formData = new FormData(event.target);

        const toastId = toast.push('Caricamento in corso, attendere...', {
            duration: 600000,
        });

        const response = await fetch('?/upload', {
            method: 'POST',
            body: formData
        });

        toast.pop(toastId);

        const result = deserialize(await response.text());
        await invalidateAll();
        if (result.type === 'success') {
            toast.push('Upload completato con successo', {
                theme: {
                    '--toastBackground': '#4caf50'
                }
            });

            event.target.reset();
        } else {
            toast.push('Upload fallito', {
                theme: {
                    '--toastBackground': '#f44336'
                }
            });
        }

        isUploading = false;
    }

</script>

<div class="container-fluid mt-3 pt-4 pb-4 bg-light bg-opacity-10 rounded-3">
    <div class="row mb-auto mb-md-2">
        <div class="col text-start ms-2 ms-md-3">
            <p class="h1 mb-0">Video:</p>
            <p class="text-muted">Gestisci i tuoi video</p>
        </div>
    </div>
    <div class="row bg-light bg-opacity-25 pt-3 pb-3 px-3 mx-1 rounded-4">
        <!-- Area form upload selezione file video -->
        <div class="col-12 text-start">
            <p class="h3 mb-0">Aggiungi <b>VIDEO</b>:</p>
            <p class="text-muted">Aggiungi un video da YouTube</p>
            <div class="row justify-content-center text-center">
                <div class="col">
                    <form method="post" enctype="multipart/form-data" action="?/upload" onsubmit={handleUpload}>
                        <div class="row">
                            <!-- Invece di file, chiedo in input nome "name" e url "url" -->
                            <div class="col-12 col-md-4 mt-2">
                                <input type="text" class="form-control" name="name" placeholder="Titolo" required>
                            </div>
                            <div class="col-12 col-md-4 mt-2">
                                <input type="text" class="form-control" name="url" placeholder="URL" required>
                            </div>
                            <div class="col-12 col-md-4">
                                <button class="btn btn-lg btn-success w-100 mt-2 mt-md-auto" type="submit">Aggiungi</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="row w-100 mx-auto justify-content-evenly align-items-center text-center gy-3">
        <div class="col-12">
            <p class="h4 text-start ms-auto ms-md-2 mt-3 mt-md-4 mb-0">I tuoi video:</p>
        </div>
        {#if !videos || videos.length === 0}
            <div class="col-auto mt-3">
                <p class="h3">Non hai ancora aggiunto video...</p>
            </div>
        {:else}
            <!-- Sezione video -->
            {#each videos as video (video)}
                <div class="col-auto">
                    <AdminVideoModern src={video.url} videoName={video.name} />
                </div>
            {/each}
        {/if}
    </div>
</div>
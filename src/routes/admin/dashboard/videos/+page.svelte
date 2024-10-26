<script>
    import {onMount} from "svelte";
    import {deserialize, enhance} from '$app/forms';
    import AdminVideo from "$lib/components/AdminVideo.svelte";
    import {invalidateAll} from "$app/navigation";
    import {toast} from "@zerodevx/svelte-toast";

    export let data;
    let { videos } = data;
    $: ({videos} = data);

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
    <div class="row">
        <div class="col text-center">
            <p class="h1">Video:</p>
        </div>
    </div>
    <hr class="text-light">
    <div class="row bg-light bg-opacity-25 pt-3 pb-3 mx-2 rounded-4">
        <!-- Area form upload selezione file video -->
        <div class="col-12 text-center">
            <p class="h3">Aggiungi <b>VIDEO</b>:</p>
            <div class="row justify-content-center text-center">
                <div class="col">
                    <form method="post" enctype="multipart/form-data" action="?/upload" on:submit|preventDefault={handleUpload}>
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
    <hr class="text-light">
    <div class="row justify-content-evenly align-items-center text-center">
        {#if !videos || videos.length === 0}
            <div class="col-auto mt-3">
                <p class="h3">Non hai ancora aggiunto video...</p>
            </div>
        {:else}
            <!-- Sezione video -->
            {#each videos as video (video)}
                <div class="col-auto d-flex justify-content-center align-items-center mt-3">
                    <AdminVideo src={video.url} videoName={video.name} />
                </div>
            {/each}
        {/if}
    </div>
</div>
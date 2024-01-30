<script>
    import {onMount} from "svelte";
    import {deserialize, enhance} from '$app/forms';
    import AdminVideo from "$lib/components/AdminVideo.svelte";
    import {invalidateAll} from "$app/navigation";
    import {toast} from "@zerodevx/svelte-toast";

    export let data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    async function handleUpload(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        toast.push('Caricamento in corso, attendere...');

        const response = await fetch('?/upload', {
            method: 'POST',
            body: formData
        });

        const result = deserialize(await response.text());
        await invalidateAll();
        if (result.type === 'success') {
            toast.push('Upload completato con successo', {
                theme: {
                    '--toastBackground': '#4caf50'
                }
            });
        } else {
            toast.push('Upload fallito', {
                theme: {
                    '--toastBackground': '#f44336'
                }
            });
        }
    }

    $: videos = data.body.videos;
</script>

<svelte:head>
    <!-- meta -->
    <title>MZEYFILMS - Admin - Videos</title>
    <meta name="description"
          content="MZEYFILMS, Filmmaker, Photographer, Aspirant Cinematographer, Always searching for new stories to tell. ">
</svelte:head>

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
            <p class="h3">Carica:</p>
            <div class="row justify-content-center text-center">
                <div class="col">
                    <form method="post" use:enhance enctype="multipart/form-data" action="?/upload" on:submit={handleUpload}>
                        <div class="row">
                            <div class="col-12 col-md-8">
                                <input class="form-control form-control-lg" type="file" id="file" name="video" accept="video/mp4" required />
                            </div>
                            <div class="col-12 col-md-4">
                                <button class="btn btn-lg btn-success w-100 mt-2 mt-md-auto" type="submit">Upload</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <hr class="text-light">
    <div class="row justify-content-evenly align-items-center text-center">

        {#if videos.length === 0}
            <div class="col-auto mt-3">
                <p class="h3">Non hai ancora caricato video...</p>
            </div>
        {/if}

        <!-- Sezione video -->
        {#each videos as video (video)}
            <div class="col-auto d-flex justify-content-center align-items-center mt-3">
                <AdminVideo src={video}/>
            </div>
        {/each}
    </div>
</div>
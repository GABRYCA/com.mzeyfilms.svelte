<script>
    import {onMount} from "svelte";
    import AdminVideo from "$lib/components/AdminVideo.svelte";
    import { enhance } from '$app/forms';
    export let data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    $: videos = data.body.videos;

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
            <p class="h3">Carica:</p>
            <div class="row justify-content-center text-center">
                <div class="col">
                    <form method="post" use:enhance enctype="multipart/form-data" action="?/upload">
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
                <p class="h3">Nessun video caricato</p>
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
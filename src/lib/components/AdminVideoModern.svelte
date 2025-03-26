<script>
    import {deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";
    import {toast} from "@zerodevx/svelte-toast";

    let { src, videoName } = $props();
    let newVideoName = $state(videoName);
    let title = $state(videoName);
    // To get id, split at / and get the last element
    const videoId = src.split('/').pop();

    let isRenaming = false;
    let isDeleting = false;

    async function renameVideo() {

        if (isRenaming) {
            return;
        }

        isRenaming = true;

        const data = new FormData();
        data.append('oldName', videoName);
        data.append('newName', newVideoName);
        const response = await fetch('?/rename', {
            method: 'POST',
            body: data
        });

        const result = deserialize(await response.text());
        await invalidateAll();
        if (result.type === 'success') {
            toast.push("Video rinominato con successo", {
                theme: {
                    '--toastBackground': '#28a745',
                    '--toastProgressBackground': '#218838',
                    '--toastProgressAfterBackground': '#28a745',
                    '--toastColor': '#fff'
                }
            });

        } else {
            toast.push("Errore durante la rinomina del video", {
                theme: {
                    '--toastBackground': '#dc3545',
                    '--toastProgressBackground': '#c82333',
                    '--toastProgressAfterBackground': '#dc3545',
                    '--toastColor': '#fff'
                }
            });
        }

        isRenaming = false;
    }

    async function deleteVideo() {

        if (isDeleting) {
            return;
        }

        let confirmDelete = window.confirm("Sei sicuro di voler cancellare questo video? \n" + videoName);
        if (!confirmDelete) {
            return;
        }

        isDeleting = true;

        // Implement delete video logic for backend
        const data = new FormData();
        data.append('name', videoName);
        const response = await fetch('?/delete', {
            method: 'POST',
            body: data
        });

        const result = deserialize(await response.text());
        await invalidateAll();
        if (result.type === 'success') {
            toast.push("Video cancellato con successo!", {
                theme: {
                    '--toastBackground': '#28a745',
                    '--toastProgressBackground': '#218838',
                    '--toastProgressAfterBackground': '#28a745',
                    '--toastColor': '#fff'
                }
            })
        } else {
            toast.push("Errore durante la cancellazione del video!", {
                theme: {
                    '--toastBackground': '#dc3545',
                    '--toastProgressBackground': '#c82333',
                    '--toastProgressAfterBackground': '#dc3545',
                    '--toastColor': '#fff'
                }
            })
        }

        isDeleting = false;
    }
</script>

<div class="card shadow p-3 pb-0" style="width: 18rem;">
    <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item w-100" src={"https://www.youtube.com/embed/" + videoId} title={title} allowfullscreen></iframe>
    </div>
    <div class="card-body text-center">
        <div class="row px-0 justify-content-between align-items-center">
            <div class="col-7 ps-0 text-start">
                <p class="fs-6 my-auto">{title}</p>
            </div>
            <div class="col-auto pe-0">
                <button class="btn btn-outline-light border-0 bg-black bg-opacity-50 btn-sm" data-bs-toggle="offcanvas" data-bs-target="#renameVideo{videoId}" aria-label="Rename video">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-outline-light border-0 bg-black bg-opacity-50 btn-sm" onclick={deleteVideo} aria-label="Delete video">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
        <!--<h5 class="card-title">{title}</h5>
        <input type="text" bind:value={newVideoName} class="form-control" placeholder="Nuovo titolo">
        <button class="btn btn-warning mt-2" onclick={renameVideo}>
            <i class="fa fa-check"></i> Rinomina
        </button>
        <button class="btn btn-danger mt-2" onclick={deleteVideo}>
            <i class="fa fa-trash"></i> Cancella
        </button>-->
    </div>
</div>

<!-- Offcanvas -->
<div class="offcanvas offcanvas-bottom px-4" tabindex="-1" id="renameVideo{videoId}" aria-labelledby="offcanvasBottomLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasBottomLabel">Rinomina video</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body small text-start">
        <label title="Nuovo titolo" class="form-label" for="nuovoNome{videoId}">Nuovo titolo</label>
        <input type="text" bind:value={newVideoName} class="form-control" placeholder="Nuovo titolo" name="nome" id="nuovoNome{videoId}" required>
        <button class="btn btn-light border-light border-opacity-50 mt-3 w-100" onclick={renameVideo}>
            <i class="fa fa-check"></i> Salva Modifiche
        </button>
        <button type="button" class="btn btn-outline-light border-light border-opacity-50 mt-2 w-100" data-bs-dismiss="offcanvas">
            <i class="fa fa-times"></i> Annulla
        </button>
    </div>
</div>

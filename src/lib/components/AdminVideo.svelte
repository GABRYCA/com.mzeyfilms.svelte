<script>
    import {deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";
    import {toast} from "@zerodevx/svelte-toast";

    export let src;
    export let videoName;
    let newVideoName = videoName;
    let title = newVideoName;
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

<div class="card" style="width: 18rem;">
    <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item w-100" src={"https://www.youtube.com/embed/" + videoId} title={title} allowfullscreen></iframe>
    </div>
    <div class="card-body text-center">
        <h5 class="card-title">{title}</h5>
        <input type="text" bind:value={newVideoName} class="form-control" placeholder="Nuovo titolo">
        <button class="btn btn-warning mt-2" on:click={() => renameVideo()}>
            <i class="fa fa-check"></i> Rinomina
        </button>
        <button class="btn btn-danger mt-2" on:click={deleteVideo}>
            <i class="fa fa-trash"></i> Cancella
        </button>
    </div>
</div>


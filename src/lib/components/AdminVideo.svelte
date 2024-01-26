<script>
    import {deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";
    import {toast} from "@zerodevx/svelte-toast";

    export let src;
    let videoName = src.split('\\').pop();
    let newVideoName = videoName;

    async function renameVideo() {

        // videoName = newVideoName;
        // Change the SRC of the video to the new name
        //src = src.replace(src.split('\\').pop(), videoName);
        // Implement the rename video logic here for backend
        const data = new FormData();
        data.append('oldName', videoName);
        data.append('newName', newVideoName); // Adding newName after changing it
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
            })
        } else {
            toast.push("Errore durante la rinomina del video", {
                theme: {
                    '--toastBackground': '#dc3545',
                    '--toastProgressBackground': '#c82333',
                    '--toastProgressAfterBackground': '#dc3545',
                    '--toastColor': '#fff'
                }
            })
        }
    }

    async function deleteVideo() {
        let confirmDelete = window.confirm("Sei sicuro di voler cancellare questo video? \n" + videoName);
        if (!confirmDelete) {
            return;
        }
        // Implement the delete video logic here for backend
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
    }
</script>

<div class="card" style="width: 18rem;">
    <video class="card-img-top" src="{src}" controls preload="metadata"></video>
    <div class="card-body text-center">
        <h5 class="card-title">{videoName}</h5>
        <input type="text" bind:value={newVideoName} class="form-control" placeholder="Nuovo titolo">
        <button class="btn btn-warning mt-2" on:click={() => renameVideo()}>
            <i class="fa fa-check"></i> Rinomina
        </button>
        <button class="btn btn-danger mt-2" on:click={deleteVideo}>
            <i class="fa fa-trash"></i> Cancella
        </button>
    </div>
</div>


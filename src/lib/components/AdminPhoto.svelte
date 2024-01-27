<script>
    import {deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";
    import {toast} from "@zerodevx/svelte-toast";

    export let src;
    export let folder;
    export let folderList;
    let imageName = src.split('\\').pop();
    let newFolder = folder;

    async function changeFolder(event) {
        const data = new FormData();
        data.append('oldFolder', folder);
        data.append('newFolder', newFolder);
        data.append('imageName', imageName);
        const response = await fetch('?/move', {
            method: 'POST',
            body: data
        });

        const result = deserialize(await response.text());
        await invalidateAll();
        if (result.type === 'success') {
            // Success toast
            toast.push("Immagine spostata con successo!", {
                theme: {
                    '--toastBackground': '#28a745',
                    '--toastProgressBackground': '#218838',
                    '--toastProgressAfterBackground': '#1e7e34',
                    '--toastColor': '#fff'
                }
            });
        } else {
            toast.push("Errore durante lo spostamento dell'immagine!", {
                theme: {
                    '--toastBackground': '#dc3545',
                    '--toastProgressBackground': '#c82333',
                    '--toastProgressAfterBackground': '#bd2130',
                    '--toastColor': '#fff'
                }
            });
        }
    }

    async function deleteImage() {
        const confirmDelete = window.confirm("Sei sicuro di voler cancellare l'immagine? \n" + imageName);
        if (!confirmDelete) {
            return;
        }
        const data = new FormData();
        data.append('folder', folder);
        data.append('imageName', imageName);
        const response = await fetch('?/delete', {
            method: 'POST',
            body: data
        });

        const result = deserialize(await response.text());
        await invalidateAll();
        if (result.type === 'success'){
            // Success toast
            toast.push("Immagine eliminata con successo!", {
                theme: {
                    '--toastBackground': '#28a745',
                    '--toastProgressBackground': '#218838',
                    '--toastProgressAfterBackground': '#1e7e34',
                    '--toastColor': '#fff'
                }
            });
        } else {
            toast.push("Errore durante l'eliminazione dell'immagine!", {
                theme: {
                    '--toastBackground': '#dc3545',
                    '--toastProgressBackground': '#c82333',
                    '--toastProgressAfterBackground': '#bd2130',
                    '--toastColor': '#fff'
                }
            });
        }
    }
</script>

<div class="card" style="width: 18rem;">
    <img src="{src}" class="card-img-top" alt="{imageName}">
    <div class="card-body">
        <p class="card-title h5">{imageName}</p>
        <hr>
        <form>
            <label for="folder">Cambia cartella:</label>
            <select bind:value={newFolder} class="form-control" on:change={changeFolder}>
                {#each folderList as folderName (folderName)}
                    <option value={folderName}>{folderName}</option>
                {/each}
            </select>
        </form>
        <hr>
        <button class="btn btn-danger mt-2 w-100" on:click={deleteImage}>Delete</button>
    </div>
</div>
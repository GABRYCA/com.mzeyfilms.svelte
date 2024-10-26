<script>
    import {deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";
    import {toast} from "@zerodevx/svelte-toast";

    let {
        src,
        folder,
        folderList,
        imageName
    } = $props();
    let newFolder = $state(folder);
    let isLoading = $state(true);

    function handleImageLoad() {
        isLoading = false;
    }

    async function changeFolder() {
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
    {#if isLoading}
        <div class="spinner-border text-danger-emphasis align-self-center" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    {/if}
    <img alt="{imageName}" class="card-img-top" loading="lazy" src="{src}" onload={handleImageLoad}>
    <div class="card-body">
        <p class="card-title h5">{imageName}</p>
        <hr>
        <form>
            <label for="folder">Cambia cartella:</label>
            <select bind:value={newFolder} class="form-control" onchange={changeFolder}>
                {#each folderList as folder (folder.id)}
                    <option value={folder.name}>{folder.name}</option>
                {/each}
            </select>
        </form>
        <hr>
        <button class="btn btn-danger mt-2 w-100" onclick={deleteImage}>Cancella</button>
    </div>
</div>
<script>
    import {onMount} from "svelte";
    import {deserialize, enhance} from '$app/forms';
    import AdminPhoto from "$lib/components/AdminPhoto.svelte";
    import {toast} from "@zerodevx/svelte-toast";
    import {invalidateAll} from "$app/navigation";
    let { data } = $props();
    let {folders, content } = $state(data);
    $effect(() => {
        ({folders, content} = data);
    });

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    let isUploading = false;

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
            if (result.data.status === 200){
                toast.push('Upload completato con successo!', {
                    theme: {
                        '--toastBackground': '#4caf50'
                    }
                });

                event.target.reset();
            } else {
                toast.push('⚠️' + result.data.body.message, {
                    theme: {
                        '--toastBackground': '#fff147',
                        '--toastColor': '#000000'
                    }
                });
            }
        } else {
            toast.push('Upload fallito', {
                theme: {
                    '--toastBackground': '#f44336'
                }
            });

            // Print in readable format
            console.log(JSON.stringify(result, null, 2));
        }

        isUploading = false;
    }

    async function handleBulkUpload(event) {
        event.preventDefault();

        if (isUploading) {
            return;
        }

        isUploading = true;

        const formData = new FormData(event.target);
        const images = formData.getAll('images');

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const imageFormData = new FormData();
            imageFormData.append('image', image);
            imageFormData.append('folder', formData.get('folder'));

            const toastId = toast.push(`Upload immagine ${i + 1}/${images.length} in corso...`, {
                duration: 600000,
            });

            const response = await fetch('?/upload', {
                method: 'POST',
                body: imageFormData
            });

            toast.pop(toastId);

            const result = deserialize(await response.text());
            if (result.type === 'success') {
                if (result.data.status === 200){
                    toast.push(`Upload immagine ${i + 1} completato con successo!`, {
                        theme: {
                            '--toastBackground': '#4caf50'
                        }
                    });
                } else {
                    toast.push(`⚠️ Errore durante l'upload dell'immagine ${i + 1}: ${result.data.body.message}`, {
                        theme: {
                            '--toastBackground': '#fff147',
                            '--toastColor': '#000000'
                        }
                    });
                }
            } else {
                toast.push(`Upload immagine ${i + 1} fallito!`, {
                    theme: {
                        '--toastBackground': '#f44336'
                    }
                });

                // Print in readable format
                console.log(JSON.stringify(result, null, 2));
            }
        }

        event.target.reset();

        await invalidateAll();
        isUploading = false;
    }
</script>

<div class="container-fluid mt-3 mb-2 pt-4 pb-4 bg-light bg-opacity-10 rounded-3">
    <div class="row">
        <div class="col text-center">
            <p class="h1">Foto:</p>
        </div>
    </div>
    <hr class="text-light">
    <!-- Upload Foto -->
    <div class="row bg-light bg-opacity-25 pt-3 pb-3 mx-2 rounded-4">
        <div class="col-12 text-center">
            <p class="h3">Carica:</p>
            <!-- Caricamento singolo -->
            <div class="row justify-content-center text-center">
                <div class="col">
                    <form method="post" enctype="multipart/form-data" action="?/upload" onsubmit={handleUpload}>
                        <div class="row">
                            <div class="col-12">
                                <label class="form-label" for="folder">Cartella di destinazione:</label>
                                <!-- Selezione cartella -->
                                <select class="form-select mb-2" aria-label="Seleziona cartella" name="folder" required>
                                    {#each folders as folder (folder.id)}
                                        <option value={folder.name}>{folder.name}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="col-12 col-md-8">
                                <input class="form-control form-control-lg" type="file" id="file" name="image" accept="image/*" required />
                            </div>
                            <div class="col-12 col-md-4">
                                <button class="btn btn-lg btn-success w-100 mt-2 mt-md-auto" type="submit">Upload</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <hr class="text-light">
            <!-- Caricamento intere cartelle -->
            <p class="h3 mb-0">Caricamento cartella:</p>
            <p class="text-muted">Carica tutte le immagini da una cartella del tuo dispositivo</p>
            <div class="row justify-content-center text-center">
                <div class="col">
                    <form method="post" enctype="multipart/form-data" action="?/upload" onsubmit={handleBulkUpload}>
                        <div class="row">
                            <div class="col-12">
                                <label class="form-label" for="folder">Cartella di destinazione:</label>
                                <!-- Selezione cartella -->
                                <select class="form-select mb-2" aria-label="Seleziona cartella" name="folder" required>
                                    {#each folders as folder (folder.id)}
                                        <option value={folder.name}>{folder.name}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="col-12 col-md-8">
                                <input class="form-control form-control-lg" type="file" id="files" name="images" webkitdirectory multiple accept="image/*" required />
                            </div>
                            <div class="col-12 col-md-4">
                                <button class="btn btn-lg btn-success w-100 mt-2 mt-md-auto" type="submit">Upload Cartella</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- Gestione Cartelle -->
    <div class="row bg-light bg-opacity-25 pt-3 pb-3 mt-2 mx-2 rounded-4">
        <div class="col-12 text-center">
            <button class="btn btn-warning" type="button" data-bs-toggle="collapse" data-bs-target="#createFolderForm" aria-expanded="false" aria-controls="createFolderForm"><i class="fa fa-folder"></i> Gestisci cartelle</button>
            <div class="collapse mt-2" id="createFolderForm">
                <!-- Creazione Cartella -->
                <div class="row justify-content-center text-center">
                    <hr class="text-light">
                    <div class="col">
                        <form method="post" use:enhance action="?/create">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <input class="form-control form-control-lg" type="text" id="folderName" name="folderName" placeholder="Nome cartella" required />
                                </div>
                                <div class="col-12 col-md-4 ps-auto ps-md-0">
                                    <button class="btn btn-lg btn-success w-100 mt-1 mt-md-auto" type="submit"><i class="fa fa-plus"></i> Crea</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <hr class="text-light">
                <!-- Rinomina Cartella -->
                <div class="row justify-content-center align-items-center text-center">
                    <div class="col">
                        <form method="post" use:enhance action="?/renameFolder">
                            <div class="row">
                                <div class="col-12">
                                    <label class="form-label" for="folder">Seleziona cartella:</label>
                                    <select class="form-select mb-2" aria-label="Seleziona cartella" name="folderName" required>
                                        {#each folders as folder (folder.id)}
                                            <option value={folder.name}>{folder.name}</option>
                                        {/each}
                                    </select>
                                </div>
                                <div class="col-12 col-md-8">
                                    <label class="form-label" for="newFolderName">Nuovo nome:</label>
                                    <input class="form-control form-control-lg" type="text" id="newFolderName" name="newFolderName" placeholder="Nuovo nome cartella" required />
                                </div>
                                <div class="col-12 col-md-4 text-center ps-auto ps-md-0">
                                    <button class="btn btn-lg btn-primary w-100 h-100 mt-2 mt-md-auto" type="submit"><i class="fa fa-pencil"></i> Rinomina</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <hr class="text-light">
                <!-- Cancella Cartella -->
                <div class="row justify-content-center align-items-center text-center mt-3">
                    <div class="col">
                        <form method="post" use:enhance action="?/deleteFolder">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <label class="form-label" for="folder">Seleziona cartella:</label>
                                    <select class="form-select mb-2" aria-label="Seleziona cartella" name="folderName" required>
                                        {#each folders as folder (folder.id)}
                                            <option value={folder.name}>{folder.name}</option>
                                        {/each}
                                    </select>
                                </div>
                                <div class="col-12 col-md-4 mt-auto mt-md-4 ps-auto ps-md-0">
                                    <button class="btn btn-lg btn-danger w-100" type="submit"><i class="fa fa-trash"></i> Cancella</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr class="text-light">
    <!-- Sezione Foto e Cartelle -->
    <div class="row justify-content-evenly align-items-center text-center">
        <div class="col">
            <!-- Sezione foto -->
            <div class="accordion" id="folderAccordion">
                {#each content as folder (folder.folder.id)}
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading{folder.folder.name}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse{folder.folder.name}" aria-expanded="false" aria-controls="collapse{folder.folder.name}">
                                <span><i class="fa fa-folder"></i> {folder.folder.name} <span class="{(!folder.images || folder.images.length === 0) ? 'text-warning-emphasis' : 'text-primary-emphasis'}">{!folder.images || folder.images.length === 0 ? 'Vuota' : folder.images.length}</span></span>
                            </button>
                        </h2>
                        <div id="collapse{folder.folder.name}" class="accordion-collapse collapse" aria-labelledby="heading{folder.folder.name}" data-bs-parent="#folderAccordion">
                            <div class="accordion-body">
                                <div class="row bg-light bg-opacity-10 justify-content-evenly align-items-center text-center mx-1 py-3 rounded-4">
                                    <div class="col-12 text-center">
                                        <p class="h3">{folder.folder.name}</p>
                                    </div>
                                    {#if !folder.images || folder.images.length === 0}
                                        <div class="col-12 text-center mt-2">
                                            <p class="h5">Cartella vuota...</p>
                                            {folder.images}
                                        </div>
                                    {:else}
                                        {#each folder.images as image (image.id)}
                                            <div class="col-auto d-flex justify-content-center align-items-center mt-3">
                                                <AdminPhoto src={image.url} folder={folder.folder.name} folderList={folders} imageName={image.image}/>
                                            </div>
                                        {/each}
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

</div>
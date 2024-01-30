<script>
    import {onMount} from "svelte";
    import {deserialize, enhance} from '$app/forms';
    import AdminPhoto from "$lib/components/AdminPhoto.svelte";
    import {toast} from "@zerodevx/svelte-toast";
    import {invalidateAll} from "$app/navigation";
    export let data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    async function handleUpload(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const toastId = toast.push('Caricamento in corso, attendere...');

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

            // Pring in readable format
            console.log(JSON.stringify(result, null, 2));
        }
    }

    $: folders = data.body.folders;
    $: content = data.body.content;
</script>

<svelte:head>
    <!-- meta -->
    <title>MZEYFILMS - Admin - Photos</title>
    <meta name="description"
          content="MZEYFILMS, Filmmaker, Photographer, Aspirant Cinematographer, Always searching for new stories to tell. ">
</svelte:head>

<div class="container-fluid mt-3 mb-2 pt-4 pb-4 bg-light bg-opacity-10 rounded-3">
    <div class="row">
        <div class="col text-center">
            <p class="h1">Foto:</p>
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
                            <div class="col-12">
                                <label class="form-label" for="folder">Seleziona cartella:</label>
                                <!-- Select folder -->
                                <select class="form-select mb-2" aria-label="Seleziona cartella" name="folder" required>
                                    {#each folders as folder (folder)}
                                        <option value={folder}>{folder}</option>
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
        </div>
    </div>
    <div class="row bg-light bg-opacity-25 pt-3 pb-3 mt-2 mx-2 rounded-4">
        <!-- Area form creazione cartella -->
        <div class="col-12 text-center">
            <button class="btn btn-warning" type="button" data-bs-toggle="collapse" data-bs-target="#createFolderForm" aria-expanded="false" aria-controls="createFolderForm"><i class="fa fa-folder"></i> Gestisci cartelle</button>
            <div class="collapse mt-2" id="createFolderForm">
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
                <div class="row justify-content-center align-items-center text-center">
                    <div class="col">
                        <form method="post" use:enhance action="?/renameFolder">
                            <div class="row">
                                <div class="col-12">
                                    <label class="form-label" for="folder">Seleziona cartella:</label>
                                    <select class="form-select mb-2" aria-label="Seleziona cartella" name="folderName" required>
                                        {#each folders as folder (folder)}
                                            <option value={folder}>{folder}</option>
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
                <div class="row justify-content-center align-items-center text-center mt-3">
                    <div class="col">
                        <form method="post" use:enhance action="?/deleteFolder">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <label class="form-label" for="folder">Seleziona cartella:</label>
                                    <select class="form-select mb-2" aria-label="Seleziona cartella" name="folderName" required>
                                        {#each folders as folder (folder)}
                                            <option value={folder}>{folder}</option>
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

    <div class="row justify-content-evenly align-items-center text-center">
        <div class="col">
            <!-- Sezione foto -->
            <div class="accordion" id="folderAccordion">
                {#each content as folder (folder)}
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading{folder.name}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse{folder.name}" aria-expanded="false" aria-controls="collapse{folder.name}">
                                <span><i class="fa fa-folder"></i> {folder.name} <span class="{folder.images.length === 0 ? 'text-warning-emphasis' : 'text-primary-emphasis'}">{folder.images.length === 0 ? 'Vuota' : folder.images.length}</span></span>
                            </button>
                        </h2>
                        <div id="collapse{folder.name}" class="accordion-collapse collapse" aria-labelledby="heading{folder.name}" data-bs-parent="#folderAccordion">
                            <div class="accordion-body">
                                <div class="row bg-light bg-opacity-10 justify-content-evenly align-items-center text-center mx-1 py-3 rounded-4">
                                    <div class="col-12 text-center">
                                        <p class="h3">{folder.name}</p>
                                    </div>
                                    {#if folder.images.length === 0}
                                        <div class="col-12 text-center mt-2">
                                            <p class="h5">Cartella vuota...</p>
                                        </div>
                                    {/if}
                                    {#each folder.images as image (image)}
                                        <div class="col-auto d-flex justify-content-center align-items-center mt-3">
                                            <AdminPhoto src={image} folder={folder.name} folderList={folders}/>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

</div>
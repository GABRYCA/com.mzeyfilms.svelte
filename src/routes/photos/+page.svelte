<script>
    import {onMount} from "svelte";
    import UserPhoto from "$lib/components/UserPhoto.svelte";

    let { data } = $props();
    const { content } = data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

</script>

<div class="container-xxl" data-aos="zoom-in" data-aos-duration="400">
    <div class="row align-items-center" style="min-height: 78vh">
        <div class="col">
            <div class="row text-center justify-content-center px-2 pt-2 mb-3">
                <div class="col bg-light bg-opacity-10 pt-4 pb-2 rounded-4">
                    <p class="h1">Photos</p>
                </div>
            </div>
            <div class="row text-center justify-content-center px-2 pb-2">
                <div class="col bg-light bg-opacity-10 py-3 rounded-4">
                    {#each content as folder, index (folder.id)}
                        <div class="row text-center justify-content-center px-2">
                            <div class="col bg-custom pt-3 pb-3 rounded-4">
                                <button class="btn btn-folder w-100 rounded-3 pt-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapse{index}">
                                    {folder.name} <i class="fas fa-chevron-down"></i>
                                </button>
                                <div class="collapse" id="collapse{index}">
                                    <hr>
                                    <div class="row justify-content-center">
                                        {#if !folder.expand || folder.expand.images_via_folder === 0}
                                            <div class="col mt-2">
                                                <p class="h5">Empty folder</p>
                                            </div>
                                        {:else}
                                            {#each folder.expand.images_via_folder as image (image.id)}
                                                <UserPhoto src={image} />
                                            {/each}
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--{#if index < content.length - 1}
                            <hr>
                        {/if}-->
                        {#if index < content.length - 1}
                            <div class="row my-2"></div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .bg-custom {
        background-color: rgba(115, 0, 0, 0.25);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    }

    .btn-folder {
        border: none;
        color: #ff5555 !important;
        font-size: 1.2rem;
    }

    .btn-folder:hover {
        background-color: transparent !important;
        color: white !important;
    }

    p {
        color: #ff5555 !important;
    }
</style>



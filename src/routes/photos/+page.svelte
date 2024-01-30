<script>
    import {onMount} from "svelte";
    import UserPhoto from "$lib/components/UserPhoto.svelte";

    export let data;

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    // Each content has a name, and an array "images" with string src of each image
    const content = data.body.content;
</script>

<div class="container-xxl" data-aos="zoom-in" data-aos-duration="400">
    <div class="row align-items-center" style="min-height: 78vh">
        <div class="col">
            <div class="row text-center justify-content-center px-2 pt-2">
                <div class="col bg-light bg-opacity-10 pt-4 pb-3 rounded-4">
                    <p class="h1">Photos</p>
                </div>
            </div>
            <hr>
            <div class="row text-center justify-content-center px-2 pb-2">
                <div class="col bg-light bg-opacity-10 py-3 rounded-4">
                    {#each content as folder, index}
                        <div class="row text-center justify-content-center px-2">
                            <div class="col bg-light bg-opacity-10 pt-3 pb-3 rounded-4">
                                <button class="btn-custom bg-transparent w-100 rounded-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapse{index}">
                                    <span class="h3">{folder.name} <i class="fas fa-chevron-down"></i></span>
                                </button>
                                <div class="collapse" id="collapse{index}">
                                    <hr>
                                    <div class="row justify-content-center">
                                        <!-- If there aren't images in folder -->
                                        {#if folder.images.length === 0}
                                            <div class="col mt-2">
                                                <p class="h5">Empty folder</p>
                                            </div>
                                        {/if}
                                        {#each folder.images as image}
                                            <UserPhoto src={image} />
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {#if index < content.length - 1}
                            <hr>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .btn-custom {
        border: none;
    }
</style>



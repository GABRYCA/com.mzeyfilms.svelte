<script>
    export let src;
    let videoName = src.split('\\').pop();
    let newVideoName = videoName;

    function renameVideo() {
        videoName = newVideoName;
        // Change the SRC of the video to the new name
        console.log('src prima: ' + src);
        src = src.replace(src.split('\\').pop(), videoName);
        // Implement the rename video logic here for backend
    }

    function deleteVideo() {
        let confirmDelete = window.confirm("Sei sicuro di voler cancellare questo video? \n" + videoName);
        if (!confirmDelete) {
            return;
        }
        console.log('Deleting video: ' + videoName); // REMINDER: use SRC to DELETE the video!
        // Implement the delete video logic here for backend
    }
</script>

<div class="card" style="width: 18rem;">
    <video class="card-img-top" src="{src}" controls></video>
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


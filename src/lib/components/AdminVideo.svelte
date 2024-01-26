<script>
    export let src;
    export let title;
    let newTitle = title;

    function renameVideo() {
        title = newTitle;
        // Implement the rename video logic here
    }

    function deleteVideo() {
        let confirmDelete = window.confirm("Sei sicuro di voler cancellare questo video? (Titolo: " + title + ")");
        if (!confirmDelete) {
            return;
        }
        console.log('Deleting video with title: ' + title); // REMINDER: use SRC to DELETE the video!
        // Implement the delete video logic here
    }
</script>

<div class="card" style="width: 18rem;">
    <video class="card-img-top" src="{src}" controls></video>
    <div class="card-body text-center">
        <h5 class="card-title">{title}</h5>
        <input type="text" bind:value={newTitle} class="form-control" placeholder="Nuovo titolo">
        <button class="btn btn-warning mt-2" on:click={renameVideo}>
            <i class="fa fa-check"></i> Rinomina
        </button>
        <button class="btn btn-danger mt-2" on:click={deleteVideo}>
            <i class="fa fa-trash"></i> Cancella
        </button>
    </div>
</div>


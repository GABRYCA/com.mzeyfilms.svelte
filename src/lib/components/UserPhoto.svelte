<script>
    export let src;
    // Unique modal id
    let modalId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

</script>

<div class="col-12 col-md-6 px-2">
    <a href="{src}" target="_blank"><img src="{src}" class="img-fluid rounded-4" alt="Gallery Content"></a>
</div>

<style>
    .img-fluid {
        max-width: 100%;
        height: auto;
        transition: all 0.15s ease-in-out;
    }

    .img-fluid:hover {
        transform: scale(1.02);
    }

    /*
    .modal-body {
        background: linear-gradient(-45deg, rgba(255, 0, 0, 0.28), rgba(0, 0, 255, 0.28));
    }
    */
</style>
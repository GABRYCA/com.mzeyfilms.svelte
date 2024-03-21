<script>
    export let data;
    let message = data.body.message;

    if (!(data.status === 200 || data.status === 404)) {
        alert("Error! Return status invalid!")
    }
</script>

<svelte:head>
    <!-- meta -->
    <title>MZEYFILMS - Admin - Logout</title>
    <meta name="description"
          content="MZEYFILMS, Filmmaker, Photographer, Aspirant Cinematographer, Always searching for new stories to tell. ">
    <meta name="robots" content="noindex">
</svelte:head>

<div class="container">
    <div class="row text-center justify-content-center align-items-center" style="min-height: 78vh">
        <div class="col">
            <div class="alert {(data.status === 200) ? 'alert-success' : 'alert-danger'}"><h1>{message}</h1></div>
        </div>
    </div>
</div>
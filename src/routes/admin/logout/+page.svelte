<script>
    let { data } = $props();
    let message = $derived(data.body.message);
    let status = $derived(data.status);

    $effect(() => {
        if (!(status === 200 || status === 404)) {
            alert("Error! Return status invalid!")
        }
    });
</script>

<svelte:head>
    <!-- meta -->
    <title>MZEYFILMS - Admin - Logout</title>
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

<div class="container">
    <div class="row text-center justify-content-center align-items-center" style="min-height: 78vh">
        <div class="col">
            <div class="alert {(status === 200) ? 'alert-success' : 'alert-danger'}"><h1>{message}</h1></div>
        </div>
    </div>
</div>
<script>
    import { page } from '$app/stores';
    import {onMount} from "svelte";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    let username = '';
    let password = '';
    let message = '';

    $: if ($page.form) {
        if ($page.form.status === 200) {
            console.log($page.form.body);
            message = $page.form.body.message;
        } else {
            console.log($page.form.body);
            message = $page.form.body.message;
        }
    }
</script>

<div class="container-fluid pt-5 pb-5 text-center">
    <div class="container-sm">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-6">
                <div class="card bg-dark bg-opacity-50 shadow rounded-4">
                    <div class="card-body px-5">
                        <h1 class="card-title fw-bold fs-1 mb-4 mt-4 text-center">Login</h1>
                        <form method="POST">
                            <div class="form-outline mb-3 text-start">
                                <label class="form-label" for="username">Username:</label>
                                <input class="form-control form-control-lg bg-dark bg-opacity-25" type="text" bind:value={username} name="username" id="username" required/>
                            </div>
                            <div class="form-outline mb-3 text-start">
                                <label class="form-label" for="password">Password:</label>
                                <input class="form-control form-control-lg bg-dark bg-opacity-25" type="password" bind:value={password} name="password" id="password" required/>
                            </div>
                            {#if message}
                                <div class="alert {($page.form.status === 200) ? 'alert-success' : 'alert-danger'}">{message}</div>
                            {/if}
                            <button class="btn btn-primary btn-lg mb-3" type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>

</style>
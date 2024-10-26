<script>
    import {onMount} from "svelte";
    import {deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";

    onMount(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
            new bootstrap.Tooltip(element);
        });
    });

    let message = '';
    let status = 0;
    let isLoggingIn = false;

    async function handleLogin(event) {
        event.preventDefault();

        if (isLoggingIn) return;

        isLoggingIn = true;

        const formData = new FormData(event.target);

        const response = await fetch('?/login', {
            method: 'POST',
            body: formData
        });

        const result = deserialize(await response.text());
        if (result.type === 'success') {
            status = result.data.status;
            if (result.data.status === 200) {
                await invalidateAll();
            }
            if (result.data.status === 401) {
                message = result.data.body.message;
            }
        } else {
            message = result.data.body.message;
        }

        isLoggingIn = false;
    }

</script>

<div class="container-fluid pt-5 pb-5 text-center">
    <div class="container-sm">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-6">
                <div class="card bg-dark bg-opacity-50 shadow rounded-4">
                    <div class="card-body px-5">
                        <h1 class="card-title fw-bold fs-1 mb-4 mt-4 text-center">Login</h1>
                        <form method="POST" action="?/login" on:submit|preventDefault={handleLogin}>
                            <div class="form-outline mb-3 text-start">
                                <label class="form-label" for="username">Username:</label>
                                <input class="form-control form-control-lg bg-dark bg-opacity-25" type="text" name="username" id="username" required/>
                            </div>
                            <div class="form-outline mb-3 text-start">
                                <label class="form-label" for="password">Password:</label>
                                <input class="form-control form-control-lg bg-dark bg-opacity-25" type="password" name="password" id="password" required/>
                            </div>
                            {#if message}
                                <div class="alert {(status === 200) ? 'alert-success' : 'alert-danger'}">{message}</div>
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
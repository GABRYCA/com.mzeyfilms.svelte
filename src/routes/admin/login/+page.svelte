<script>
    import { enhance } from '$app/forms';

    /** @type {import('./$types').PageProps} */
    let { form } = $props();

    let isLoggingIn = $state(false);

    function enhanceLogin() {
        isLoggingIn = true;

        return async ({ update }) => {
            await update();
            isLoggingIn = false;
        };
    }
</script>

<svelte:head>
    <title>MZEYFILMS - Admin - Login</title>
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

<div class="container-fluid pt-5 pb-5 text-center">
    <div class="container-sm">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-6">
                <div class="card bg-dark shadow rounded-4">
                    <div class="card-body px-5">
                        <h1 class="card-title fw-bold fs-1 mb-4 mt-4 text-center">Login</h1>
                        <form method="POST" action="?/login" use:enhance={enhanceLogin}>
                            <div class="form-outline mb-3 text-start">
                                <label class="form-label" for="username">Username:</label>
                                <input
                                    class="form-control form-control-lg bg-dark text-white border-secondary"
                                    type="text"
                                    name="username"
                                    id="username"
                                    autocomplete="username"
                                    value={form?.username ?? ''}
                                    required
                                />
                            </div>
                            <div class="form-outline mb-3 text-start">
                                <label class="form-label" for="password">Password:</label>
                                <input
                                    class="form-control form-control-lg bg-dark text-white border-secondary"
                                    type="password"
                                    name="password"
                                    id="password"
                                    autocomplete="current-password"
                                    required
                                />
                            </div>
                            {#if form?.message}
                                <div class="alert alert-danger" role="alert">{form.message}</div>
                            {/if}
                            <button class="btn btn-primary btn-lg mb-3" type="submit" disabled={isLoggingIn}>
                                {#if isLoggingIn}
                                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Accesso...
                                {:else}
                                    Login
                                {/if}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

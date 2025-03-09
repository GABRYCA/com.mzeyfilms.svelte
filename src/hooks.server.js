import PocketBase from 'pocketbase';
import {PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD} from '$env/static/private';
import {PUBLIC_POCKETBASE_URL} from '$env/static/public';

let pb_initiated = null;

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
    if (!pb_initiated) {
        console.log(" [PocketBase] init");

        const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
        await pb.collection('_superusers').authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);

        pb_initiated = pb;
    }

    if (pb_initiated && !pb_initiated.authStore.isValid) {
        console.log(" [PocketBase] re-init");
        pb_initiated.authStore.clear();

        const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
        await pb.collection('_superusers').authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);

        pb_initiated = pb;
    }

    if (!event.locals.pb) event.locals.pb = pb_initiated;

    return resolve(event);
}


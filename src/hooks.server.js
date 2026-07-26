import PocketBase from 'pocketbase';
import {PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD} from '$env/static/private';
import {PUBLIC_POCKETBASE_URL} from '$env/static/public';

let pb_initiated = null;
let pb_init_failed = false;

async function authenticatePocketBase() {
    const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
    await pb.collection('_superusers').authWithPassword(PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD);
    return pb;
}

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
    if (!pb_initiated && !pb_init_failed) {
        console.log(" [PocketBase] init");
        try {
            pb_initiated = await authenticatePocketBase();
        } catch (error) {
            pb_init_failed = true;
            console.error(" [PocketBase] init failed — continuing without backend:", error?.message ?? error);
        }
    }

    if (pb_initiated && !pb_initiated.authStore.isValid) {
        console.log(" [PocketBase] re-init");
        pb_initiated.authStore.clear();
        try {
            pb_initiated = await authenticatePocketBase();
        } catch (error) {
            pb_initiated = null;
            pb_init_failed = true;
            console.error(" [PocketBase] re-init failed — continuing without backend:", error?.message ?? error);
        }
    }

    if (!event.locals.pb) event.locals.pb = pb_initiated;

    return resolve(event);
}


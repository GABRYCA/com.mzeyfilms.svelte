import { error as errorx } from '@sveltejs/kit';
import { extractId, isValidUrlParam } from '$lib/utils/slugify.js';


export async function load({ locals: { pb }, params}) {
    if (!params.film) {
        throw errorx(400, 'Missing required fields');
    }

    if (!isValidUrlParam(params.film)) {
        throw errorx(400, 'Invalid Film Title or ID');
    }

    const filmId = extractId(params.film);

    if (!pb) {
        throw errorx(503, 'PocketBase is currently unavailable. Please try again in a moment.');
    }

    // Get from pocketbase book with id
    let film = null;
    try {
        film = await pb.collection('videos').getOne(filmId)
    } catch (e) {
        throw errorx(e.status || 404, 'Film not found');
    }

    if (!film) {
        throw errorx(404, 'No film found for the given ID');
    }

    return {
        film: film,
        title: film.name,
        description: (film.description ? film.description + ' — ' : '') + 'A film by MZEYFILMS',
        index: true,
    }
}
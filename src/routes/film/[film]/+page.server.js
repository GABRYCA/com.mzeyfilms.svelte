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

    // Get from pocketbase book with id
    let film = null;
    try {
        film = await pb.collection('videos').getOne(filmId)
    } catch (e) {
        throw errorx(e.status, 'Film not found');
    }

    if (!film) {
        throw errorx(400, 'No film found for the given ID');
    }

    return {
        film: film,
        title: film.name,
        description: film.description + " a film by MZEYFILMS",
        index: true,
    }
}
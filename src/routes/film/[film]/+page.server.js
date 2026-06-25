import { error as errorx, redirect } from '@sveltejs/kit';
import { extractId, isValidUrlParam } from '$lib/utils/slugify.js';


export async function load({ locals: { pb }, url, params}) {
    if (!params.film) {
        throw errorx(400, 'Missing required fields');
    }

    if (!isValidUrlParam(params.film)) {
        throw errorx(400, 'Invalid Film Title or ID');
    }

    const filmId = extractId(params.film);

    console.log('filmId', filmId);

    // Get from pocketbase book with id
    const film = await pb.collection('videos').getOne(filmId);

    return {
        film: film,
        title: film.name,
        description: film.description + " a film by MZEYFILMS",
        index: true,
    }
}
/**
 * Converts a string into a URL-friendly slug.
 * e.g. "No Light in Deepness" → "no-light-in-deepness"
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
    return str
        .toLowerCase()
        .normalize('NFD')                        // decompose accented chars
        .replace(/[\u0300-\u036f]/g, '')         // strip diacritics
        .replace(/[^a-z0-9\s-]/g, '')           // keep only alphanum, spaces, hyphens
        .trim()
        .replace(/\s+/g, '-')                   // spaces → hyphens
        .replace(/-+/g, '-');                   // collapse multiple hyphens
}

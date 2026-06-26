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

/**
 * Validates that a URL parameter is either a valid ID or title-id format
 * Supports both numeric and alphanumeric IDs (e.g., "12345" or "blpb41jlsl3c6uk")
 * @param {string} param - URL parameter to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidUrlParam(param) {
    if (!param || typeof param !== 'string') {
        return false;
    }

    // Allow numeric and alphanumeric IDs (e.g., "blpb41jlsl3c6uk")
    if (/^[a-zA-Z0-9]+$/.test(param)) {
        return true;
    }

    // Allow title-id format
    // Must end with a hyphen followed by an alphanumeric ID, and have at least one character before
    if (/^.+-[a-zA-Z0-9]+$/.test(param)) {
        return true;
    }

    return false;
}

/**
 * Extracts ID from either numeric/alphanumeric ID or title-id format
 * @param {string} param - URL parameter (e.g., "blpb41jlsl3c6uk" or "title-blpb41jlsl3c6uk")
 * @returns {string|null} - Extracted ID or null if invalid
 */
export function extractId(param) {
    if (!param || typeof param !== 'string') {
        return null;
    }

    // Check if it's just an alphanumeric or numeric ID
    if (/^[a-zA-Z0-9]+$/.test(param)) {
        return param;
    }

    // Check if it's title-id format by looking for the last hyphen followed by alphanumeric characters
    const parts = param.split('-');
    if (parts.length >= 2) {
        const lastPart = parts[parts.length - 1];
        // Only consider it an ID if the last part is alphanumeric
        if (/^[a-zA-Z0-9]+$/.test(lastPart)) {
            return lastPart;
        }
    }

    return null;
}

export function createSlug(title) {
    if (!title) return '';
    return title
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
import { PUBLIC_IMAGE_PROXY_URL } from '$env/static/public';

/**
 * Generate optimized image URL using next-image-transformation service
 * @param {string} originalUrl - The original image URL
 * @param {Object} options - Optimization options
 * @param {number} [options.width] - Target width
 * @param {number} [options.height] - Target height
 * @param {number} [options.quality] - Image quality (1-100)
 * @returns {string} - Optimized image URL
 */
export function getOptimizedImageUrl(originalUrl, options = {}) {
    if (!PUBLIC_IMAGE_PROXY_URL || !originalUrl) {
        return originalUrl;
    }

    try {
        const { width, height, quality } = options;
        const params = new URLSearchParams();
        
        if (width && width > 0) params.set('width', Math.round(width).toString());
        if (height && height > 0) params.set('height', Math.round(height).toString());
        if (quality && quality > 0 && quality <= 100) params.set('quality', Math.round(quality).toString());

        const queryString = params.toString();
        const proxyUrl = `${PUBLIC_IMAGE_PROXY_URL}${originalUrl}`;
        
        return queryString ? `${proxyUrl}?${queryString}` : proxyUrl;
    } catch (error) {
        console.warn('Error generating optimized image URL:', error);
        return originalUrl;
    }
}

/**
 * Generate srcset for responsive images
 * @param {string} originalUrl - The original image URL
 * @param {Array} sizes - Array of width sizes
 * @param {number} [quality] - Image quality (1-100)
 * @returns {string} - Srcset string
 */
export function generateSrcset(originalUrl, sizes = [320, 640, 960, 1280, 1920], quality = 85) {
    if (!PUBLIC_IMAGE_PROXY_URL || !originalUrl) {
        return originalUrl;
    }

    try {
        return sizes
            .filter(size => size > 0)
            .sort((a, b) => a - b)
            .map(size => `${getOptimizedImageUrl(originalUrl, { width: size, quality })} ${size}w`)
            .join(', ');
    } catch (error) {
        console.warn('Error generating srcset:', error);
        return originalUrl;
    }
}

/**
 * Predefined image sizes for different use cases
 */
export const IMAGE_SIZES = {
    // Collection covers
    COLLECTION_COVER: {
        width: 400,
        height: 300,
        quality: 85
    },
    // Photo grid thumbnails
    PHOTO_THUMBNAIL: {
        width: 400,
        height: 300,
        quality: 85
    },
    // Modal/lightbox images
    PHOTO_MODAL: {
        width: 1920,
        quality: 90
    },
    // Mobile optimized
    MOBILE: {
        width: 640,
        quality: 80
    }
};

/**
 * Generate optimized image for collection covers
 * @param {string} originalUrl - The original image URL
 * @returns {Object} - Object with src and srcset
 */
export function getCollectionCoverImage(originalUrl) {
    if (!originalUrl) return { src: '', srcset: '' };
    
    return {
        src: getOptimizedImageUrl(originalUrl, IMAGE_SIZES.COLLECTION_COVER),
        srcset: generateSrcset(originalUrl, [280, 400, 560, 800], 85)
    };
}

/**
 * Generate optimized image for photo thumbnails
 * @param {string} originalUrl - The original image URL
 * @returns {Object} - Object with src and srcset
 */
export function getPhotoThumbnail(originalUrl) {
    if (!originalUrl) return { src: '', srcset: '' };
    
    return {
        src: getOptimizedImageUrl(originalUrl, IMAGE_SIZES.PHOTO_THUMBNAIL),
        srcset: generateSrcset(originalUrl, [280, 400, 560, 800, 1000], 85)
    };
}

/**
 * Generate optimized image for modal/lightbox view
 * @param {string} originalUrl - The original image URL
 * @returns {Object} - Object with src and srcset
 */
export function getModalImage(originalUrl) {
    if (!originalUrl) return { src: '', srcset: '' };
    
    return {
        src: getOptimizedImageUrl(originalUrl, IMAGE_SIZES.PHOTO_MODAL),
        srcset: generateSrcset(originalUrl, [640, 960, 1280, 1600, 1920, 2560], 90)
    };
}

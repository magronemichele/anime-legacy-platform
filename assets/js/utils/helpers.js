/**
 * @file helpers.js
 * @description Utility functions for the Anime Legacy platform.
 */

/**
 * Debounces a function execution to improve performance on rapid events.
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Escapes HTML to prevent XSS attacks when rendering dynamic data.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

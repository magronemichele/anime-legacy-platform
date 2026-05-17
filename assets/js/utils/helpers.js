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
export function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}
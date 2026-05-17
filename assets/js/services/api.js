/**
 * @file api.js
 * @description Centralized data fetching service simulating a backend API.
 */
import { getAllCards } from '../data/database.js';

export const API = {
    /**
     * Simulates fetching all data with a slight latency.
     * @returns {Promise<Array>}
     */
    async fetchAll() {
        return new Promise((resolve) => {
            // Simulated network delay (50ms) for realistic UX behavior
            setTimeout(() => {
                resolve(getAllCards());
            }, 50);
        });
    },

    /**
     * Fetches a specific item by its ID.
     * @param {number|string} id 
     * @returns {Promise<Object|null>}
     */
    async fetchById(id) {
        const data = await this.fetchAll();
        return data.find(item => item.id === parseInt(id, 10)) || null;
    },

    /**
     * Fetches data filtered by category/type.
     * @param {string} type - 'story', 'world', or 'archetype'
     * @returns {Promise<Array>}
     */
    async fetchByType(type) {
        const data = await this.fetchAll();
        return data.filter(item => item.type === type);
    }
};
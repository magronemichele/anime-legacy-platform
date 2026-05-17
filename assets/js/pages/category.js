/**
 * @file category.js
 * @description Dynamic logic for specific category pages (Stories, Worlds, Archetypes).
 * It reads the required category from the DOM and fetches the corresponding data.
 */
import { API } from '../services/api.js';
import { escapeHTML } from '../utils/helpers.js';

class CategoryPage {
    constructor() {
        this.mainLayout = document.querySelector('.category-layout');
        this.gridContainer = document.getElementById('category-grid');
        
        if (!this.mainLayout || !this.gridContainer) return;
        
        this.categoryType = this.mainLayout.getAttribute('data-category');
        this.init();
    }

    async init() {
        try {
            // Fetch only the data matching the current page's category
            const categoryData = await API.fetchByType(this.categoryType);
            this.renderGrid(categoryData);
        } catch (error) {
            console.error(`Failed to load category data for type: ${this.categoryType}`, error);
            this.gridContainer.innerHTML = `<div class="search-empty-state" style="grid-column: 1 / -1; padding: 4rem;">Failed to load content. Please try again later.</div>`;
        }
    }

    renderGrid(data) {
        if (data.length === 0) {
            this.gridContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--color-bg-surface); border-radius: var(--radius-md);">
                    <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--color-text-muted); margin-bottom: 1rem;"></i>
                    <h3 style="color: white; font-size: 1.5rem;">No entries found</h3>
                    <p style="color: var(--color-text-muted);">It seems there is currently no content available for this category.</p>
                </div>
            `;
            return;
        }

        this.gridContainer.innerHTML = data.map(item => `
            <article class="media-card" onclick="window.location.href='detail.html?id=${item.id}'">
                <div class="card-image-wrapper">
                    <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy">
                </div>
                <div class="card-content">
                    <span class="card-type-badge">${escapeHTML(item.type)}</span>
                    <h3 class="card-title">${escapeHTML(item.name)}</h3>
                    <p class="card-meta" style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--color-text-muted);">
                        ${escapeHTML(item.genres ? item.genres.join(', ') : 'Anime')} <br>
                        Focus: ${escapeHTML(item.title)}
                    </p>
                </div>
            </article>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CategoryPage();
});
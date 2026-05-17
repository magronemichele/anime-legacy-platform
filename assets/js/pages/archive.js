/**
 * @file archive.js
 * @description Logic specific to the Archive page (filtering, searching, grid rendering).
 */
import { API } from '../services/api.js';
import { escapeHTML, debounce } from '../utils/helpers.js';

class ArchivePage {
    constructor() {
        this.gridContainer = document.getElementById('archive-grid');
        this.searchInput = document.getElementById('archive-search');
        this.typeSelect = document.getElementById('filter-type');
        this.resetBtn = document.getElementById('btn-reset-filters');
        
        this.allData = [];
        
        if (!this.gridContainer) return;
        this.init();
    }

    async init() {
        try {
            this.allData = await API.fetchAll();
            this.renderGrid(this.allData);
            this.bindEvents();
        } catch (error) {
            console.error("Failed to load archive data:", error);
            this.gridContainer.innerHTML = `<div class="search-empty-state">Failed to load content. Please try again later.</div>`;
        }
    }

    bindEvents() {
        // Debounced search input
        this.searchInput.addEventListener('input', debounce(() => this.filterData(), 300));
        
        // Dropdown change
        this.typeSelect.addEventListener('change', () => this.filterData());
        
        // Reset button
        this.resetBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.typeSelect.value = 'all';
            this.renderGrid(this.allData);
        });
    }

    filterData() {
        const query = this.searchInput.value.trim().toLowerCase();
        const selectedType = this.typeSelect.value;

        const filtered = this.allData.filter(item => {
            const matchesQuery = item.title.toLowerCase().includes(query) || 
                                 item.name.toLowerCase().includes(query) || 
                                 (item.originalName && item.originalName.toLowerCase().includes(query));
            
            const matchesType = selectedType === 'all' || item.type === selectedType;

            return matchesQuery && matchesType;
        });

        this.renderGrid(filtered);
    }

    renderGrid(data) {
        if (data.length === 0) {
            this.gridContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--color-bg-surface); border-radius: var(--radius-md);">
                    <i class="fas fa-box-open" style="font-size: 3rem; color: var(--color-text-muted); margin-bottom: 1rem;"></i>
                    <h3 style="color: white; font-size: 1.5rem;">No results found</h3>
                    <p style="color: var(--color-text-muted);">Try adjusting your search criteria or resetting the filters.</p>
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
                        Status: ${escapeHTML(item.status || 'Unknown')}
                    </p>
                </div>
            </article>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ArchivePage();
});
/**
 * @file search.js
 * @description Global search modal component logic.
 */
import { API } from '../services/api.js';
import { debounce, escapeHTML } from '../utils/helpers.js';

export class GlobalSearch {
    constructor() {
        this.searchBtn = document.getElementById('btn-open-search');
        this.closeBtn = document.getElementById('btn-close-search');
        this.modal = document.getElementById('search-modal');
        this.backdrop = document.getElementById('search-backdrop');
        this.searchInput = document.getElementById('global-search-input');
        this.resultsContainer = document.getElementById('search-results');

        if (!this.modal || !this.searchBtn) return;
        
        this.initEvents();
    }

    initEvents() {
        this.searchBtn.addEventListener('click', () => this.toggleModal(true));
        this.closeBtn.addEventListener('click', () => this.toggleModal(false));
        this.backdrop.addEventListener('click', () => this.toggleModal(false));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && this.modal.classList.contains('is-active')) {
                this.toggleModal(false);
            }
        });

        this.searchInput.addEventListener('input', debounce(async (e) => {
            const query = e.target.value.trim().toLowerCase();
            
            if (!query) {
                this.resultsContainer.innerHTML = '';
                return;
            }

            try {
                const data = await API.fetchAll();
                const results = data.filter(item => 
                    item.title.toLowerCase().includes(query) || 
                    item.name.toLowerCase().includes(query) ||
                    (item.originalName && item.originalName.toLowerCase().includes(query))
                ).slice(0, 5); // Limit to top 5 results

                this.renderSearchResults(results);
            } catch (err) {
                console.error("Search fetch error:", err);
            }
        }, 250));
    }

    toggleModal(state) {
        if (state) {
            this.modal.classList.add('is-active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => this.searchInput.focus(), 100);
        } else {
            this.modal.classList.remove('is-active');
            document.body.style.overflow = '';
            this.searchInput.value = '';
            this.resultsContainer.innerHTML = '';
        }
    }

    renderSearchResults(results) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = `<div class="search-empty-state">No matching titles or themes found.</div>`;
            return;
        }

        this.resultsContainer.innerHTML = results.map(item => `
            <div class="search-result-item" role="link" tabindex="0" onclick="window.location.href='detail.html?id=${item.id}'">
                <img src="${escapeHTML(item.image)}" alt="Thumbnail" class="result-thumbnail">
                <div class="result-info">
                    <span class="result-type">${escapeHTML(item.type)}</span>
                    <span class="result-title">${escapeHTML(item.name)}: ${escapeHTML(item.title)}</span>
                </div>
            </div>
        `).join('');
    }
}
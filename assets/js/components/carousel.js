/**
 * @file carousel.js
 * @description Modernized UltraCarousel component for rendering media cards.
 */
import { escapeHTML } from '../utils/helpers.js';

export class Carousel {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        this.data = data || [];
        
        if (!this.container) return;
        
        this.render();
        this.initControls();
    }

    render() {
        if (this.data.length === 0) {
            this.container.innerHTML = `<div class="search-empty-state">No content available.</div>`;
            return;
        }

        this.container.innerHTML = this.data.map(item => `
            <article class="media-card" data-id="${item.id}" tabindex="0" role="link">
                <div class="card-image-wrapper">
                    <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy">
                </div>
                <div class="card-content">
                    <span class="card-type-badge">${escapeHTML(item.type)}</span>
                    <h3 class="card-title">${escapeHTML(item.name)}</h3>
                    <p class="card-meta">${escapeHTML(item.genres[0] || 'Anime')} • ${item.year}</p>
                </div>
            </article>
        `).join('');

        // Delegate click events for cards
        this.container.addEventListener('click', (e) => {
            const card = e.target.closest('.media-card');
            if (card) {
                const id = card.getAttribute('data-id');
                window.location.href = `detail.html?id=${id}`;
            }
        });
    }

    initControls() {
        // Find the closest section to scope the controls
        const section = this.container.closest('.content-section');
        if (!section) return;

        const prevBtn = section.querySelector('.carousel-btn.prev');
        const nextBtn = section.querySelector('.carousel-btn.next');

        const scrollAmount = 300; // Pixels to scroll per click

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.container.parentElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.container.parentElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    }
}
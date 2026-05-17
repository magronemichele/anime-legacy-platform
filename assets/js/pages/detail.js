/**
 * @file detail.js
 * @description Logic specific to rendering the detailed view of a single entity.
 */
import { API } from '../services/api.js';
import { escapeHTML } from '../utils/helpers.js';

class DetailPage {
    constructor() {
        this.viewContainer = document.getElementById('detail-view-container');
        this.errorContainer = document.getElementById('detail-error-container');
        
        // DOM Elements for injection
        this.elements = {
            badge: document.getElementById('detail-badge'),
            title: document.getElementById('detail-title'),
            name: document.getElementById('detail-name'),
            image: document.getElementById('detail-image'),
            description: document.getElementById('detail-description'),
            metaGrid: document.getElementById('detail-meta-grid'),
            videoContainer: document.getElementById('detail-video-container'),
            videoFrame: document.getElementById('detail-video')
        };

        this.init();
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');

        if (!itemId) {
            this.showError();
            return;
        }

        try {
            const itemData = await API.fetchById(itemId);
            if (!itemData) {
                this.showError();
                return;
            }
            this.renderData(itemData);
        } catch (error) {
            console.error("Error fetching detail data:", error);
            this.showError();
        }
    }

    renderData(data) {
        // Toggle view containers
        this.errorContainer.style.display = 'none';
        this.viewContainer.style.display = 'block';

        // Set Texts and Images
        this.elements.badge.textContent = data.type.toUpperCase();
        this.elements.title.textContent = data.title;
        this.elements.name.textContent = data.originalName ? `${data.name} (${data.originalName})` : data.name;
        this.elements.image.src = data.image;
        this.elements.image.alt = data.title;
        this.elements.description.textContent = data.description;

        // Construct Meta Grid dynamically based on available data
        let metaHtml = '';
        
        if (data.year) metaHtml += this.createMetaBox('Release Year', data.year);
        if (data.status) metaHtml += this.createMetaBox('Status', data.status);
        if (data.rating) metaHtml += this.createMetaBox('Rating', `${data.rating} / 10`);
        if (data.animationStudio) metaHtml += this.createMetaBox('Studio', data.animationStudio);
        if (data.mangaka) metaHtml += this.createMetaBox('Original Creator', data.mangaka);
        
        if (data.genres && data.genres.length) {
            metaHtml += this.createMetaBox('Genres', data.genres.join(', '));
        }
        
        if (data.themes && data.themes.length) {
            metaHtml += this.createMetaBox('Themes', data.themes.join(', '));
        }

        this.elements.metaGrid.innerHTML = metaHtml;

        // Handle YouTube Trailer
        if (data.youtubeId) {
            this.elements.videoContainer.style.display = 'block';
            this.elements.videoFrame.src = `https://www.youtube.com/embed/${data.youtubeId}?rel=0`;
        } else {
            this.elements.videoContainer.style.display = 'none';
            this.elements.videoFrame.src = '';
        }
    }

    createMetaBox(label, value) {
        return `
            <div style="background: rgba(0,0,0,0.3); padding: 1.2rem; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                <span style="display: block; font-size: 0.8rem; text-transform: uppercase; color: var(--color-accent-primary); font-weight: bold; margin-bottom: 0.3rem;">${escapeHTML(label)}</span>
                <strong style="color: white; font-size: 1.1rem;">${escapeHTML(String(value))}</strong>
            </div>
        `;
    }

    showError() {
        this.viewContainer.style.display = 'none';
        this.errorContainer.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DetailPage();
});
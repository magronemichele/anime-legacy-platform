/**
 * @file app.js
 * @description Main application logic tying the components and UI states together.
 */
import { API } from './services/api.js';
import { Carousel } from './components/carousel.js';
import { GlobalSearch } from './components/search.js';

class AnimeLegacyApp {
    constructor() {
        this.initSearch();
        this.initCarousels();
    }

    initSearch() {
        // Initializes the decoupled search logic
        new GlobalSearch();
    }

    /**
     * Initializes all elements with the 'data-feed' attribute as carousels.
     */
    async initCarousels() {
        const carouselTracks = document.querySelectorAll('.carousel-track');
        if (!carouselTracks.length) return;

        try {
            const allData = await API.fetchAll();
            
            carouselTracks.forEach(track => {
                const feedType = track.dataset.feed;
                let dataToRender = allData;

                if (feedType !== 'recommended' && feedType !== 'all') {
                    dataToRender = allData.filter(item => item.type === feedType);
                }

                new Carousel(track.id, dataToRender);
            });
        } catch (error) {
            console.error("Failed to initialize carousels:", error);
        }
    }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
    new AnimeLegacyApp();
});
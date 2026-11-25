import { API } from '../services/api.js';
import { filterEntries } from '../services/filter.js';
import { debounce } from '../utils/helpers.js';

export class GlobalSearch {
    constructor() {
        this.trigger = document.getElementById('btn-open-search');
        this.modal = document.getElementById('search-modal');
        if (!this.trigger || !this.modal) return;

        this.close = document.getElementById('btn-close-search');
        this.input = document.getElementById('global-search-input');
        this.results = document.getElementById('search-results');
        this.status = document.getElementById('search-status');
        const update = debounce(() => this.update(), 180);
        this.trigger.addEventListener('click', () => this.toggle(true));
        this.close.addEventListener('click', () => this.toggle(false));
        document.getElementById('search-backdrop').addEventListener('click', () => this.toggle(false));
        this.modal.addEventListener('keydown', event => this.handleKeys(event));
        this.input.addEventListener('input', update);
    }

    toggle(open) {
        this.modal.classList.toggle('is-active', open);
        this.modal.setAttribute('aria-hidden', String(!open));
        this.trigger.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('search-open', open);
        if (open) {
            this.input.focus();
        } else {
            this.trigger.focus();
            this.input.value = '';
            this.results.replaceChildren();
            this.status.textContent = '';
        }
    }

    handleKeys(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.toggle(false);
        }
        if (event.key !== 'Tab') return;

        const focusable = Array.from(this.modal.querySelectorAll('input, button, a[href]'));
        const boundary = event.shiftKey ? focusable[0] : focusable.at(-1);
        if (document.activeElement === boundary) {
            event.preventDefault();
            (event.shiftKey ? focusable.at(-1) : focusable[0]).focus();
        }
    }

    async update() {
        const query = this.input.value.trim();
        this.results.replaceChildren();
        this.status.textContent = '';
        if (!query) return;

        try {
            this.entries ??= await API.fetchAll();
            if (this.input.value.trim() !== query || this.modal.getAttribute('aria-hidden') === 'true') return;
            const matches = filterEntries(this.entries, query);
            this.status.textContent = `${matches.length} results`;
            if (!matches.length) {
                this.results.textContent = 'No matches. Try a series title, genre, or theme.';
                return;
            }

            for (const item of matches.slice(0, 6)) {
                const link = document.createElement('a');
                link.className = 'search-result-item';
                link.href = `detail.html?id=${encodeURIComponent(item.id)}`;
                link.textContent = `${item.name} · ${item.title}`;
                this.results.append(link);
            }
            const all = document.createElement('a');
            all.className = 'search-result-item search-all';
            all.href = `archive.html?${new URLSearchParams({ q: query })}`;
            all.textContent = `View all ${matches.length} results`;
            this.results.append(all);
        } catch {
            this.status.textContent = 'Search is temporarily unavailable.';
        }
    }
}

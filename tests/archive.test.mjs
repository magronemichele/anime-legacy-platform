import assert from 'node:assert/strict';
import test from 'node:test';
import { filterEntries } from '../assets/js/services/filter.js';
import { API } from '../assets/js/services/api.js';
import { escapeHTML } from '../assets/js/utils/helpers.js';

test('combines case-insensitive terms across title, theme and genre', () => {
    const story = { name: 'Café Adventure', type: 'story', genres: ['Fantasy'], themes: ['Identity'] };
    const world = { name: 'Cafe World', type: 'world', themes: ['Identity'] };
    assert.deepEqual(filterEntries([story, world], '  CAFE fantasy IDENTITY ', 'story'), [story]);
    assert.deepEqual(filterEntries([story, world], '', 'world'), [world]);
    assert.deepEqual(filterEntries([story, world], 'missing'), []);
});

test('detail lookup accepts exact string and numeric IDs', async () => {
    assert.equal((await API.fetchById(1)).id, 1);
    assert.equal((await API.fetchById('1')).id, 1);
    assert.equal(await API.fetchById('1st'), null);
});

test('escapes quotes in HTML attribute values', () => {
    assert.equal(escapeHTML('"<&\'>'), '&quot;&lt;&amp;&#39;&gt;');
});

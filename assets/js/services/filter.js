function normalize(text) {
    return String(text ?? '').normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function filterEntries(entries, query, type = 'all') {
    const words = normalize(query).trim().split(/\s+/).filter(Boolean);
    return entries.filter(entry => {
        if (type !== 'all' && entry.type !== type) return false;
        const keywords = normalize([
            entry.title, entry.name, entry.originalName, entry.type,
            ...(entry.genres ?? []), ...(entry.themes ?? []), entry.year
        ].join(' '));
        return words.every(word => keywords.includes(word));
    });
}

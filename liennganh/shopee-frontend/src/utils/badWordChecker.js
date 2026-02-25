import viWords from '../data/badwords-vi.json';
import engWords from '../data/badwords-eng.json';

const allBadWords = [...new Set([...viWords, ...engWords])];

const sortedBadWords = allBadWords.sort((a, b) => b.length - a.length);

export function findBadWords(text) {
    if (!text) return [];
    const lowerText = text.toLowerCase();
    const found = [];

    for (const word of sortedBadWords) {
        const lowerWord = word.toLowerCase();
        let startIndex = 0;

        while (true) {
            const idx = lowerText.indexOf(lowerWord, startIndex);
            if (idx === -1) break;

            const before = idx > 0 ? lowerText[idx - 1] : ' ';
            const after = idx + lowerWord.length < lowerText.length
                ? lowerText[idx + lowerWord.length]
                : ' ';

            const isBoundaryBefore = /[\s\W]/.test(before) || idx === 0;
            const isBoundaryAfter = /[\s\W]/.test(after) || (idx + lowerWord.length) === lowerText.length;

            if (isBoundaryBefore && isBoundaryAfter) {
                const alreadyCovered = found.some(
                    f => f.start <= idx && f.end >= idx + lowerWord.length
                );

                if (!alreadyCovered) {
                    found.push({
                        word: text.substring(idx, idx + lowerWord.length),
                        start: idx,
                        end: idx + lowerWord.length,
                    });
                }
            }

            startIndex = idx + 1;
        }
    }

    found.sort((a, b) => a.start - b.start);
    return found;
}

export function hasBadWords(text) {
    return findBadWords(text).length > 0;
}

export function highlightBadWords(text) {
    const matches = findBadWords(text);
    if (matches.length === 0) return [{ text, isBad: false }];

    const parts = [];
    let lastIndex = 0;

    for (const match of matches) {
        if (match.start > lastIndex) {
            parts.push({ text: text.substring(lastIndex, match.start), isBad: false });
        }
        parts.push({ text: text.substring(match.start, match.end), isBad: true });
        lastIndex = match.end;
    }

    if (lastIndex < text.length) {
        parts.push({ text: text.substring(lastIndex), isBad: false });
    }

    return parts;
}

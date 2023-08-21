export function extractPageNumber(path) {
    const match = path.match(/\/documents\/page(\d+)/);
    return match ? parseInt(match[1], 10) : 1; // default to 1 if no match
}
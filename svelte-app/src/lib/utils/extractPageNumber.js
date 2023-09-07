export function extractPageNumber(doc) {
    if (!doc) {
        console.error("Undefined document passed to extractPageNumber");
        return;
    }
    if (doc.text && typeof doc.text === 'string' && doc.text.trim() !== "") {
        const match = doc.path.match(/\/documents\/page(\d+)/);
        return match ? parseInt(match[1], 10) : 1; // default to 1 if no match
    }
  }
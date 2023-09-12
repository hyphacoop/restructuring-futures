import { writable } from 'svelte/store';

const defaultState = {};

export const studioGridStore = writable(defaultState);

export function setIsCellOccupied(documents, pageNumber) {
    const maxX = 9;
    const maxY = 6;

    const positionX = pageNumber === 1 ? 3 : 4;
    const positionY = pageNumber === 1 ? 2 : 3;

    documents = documents.filter(doc => !/^\/documents\/page\d+\/newPage$/.test(doc.path));

    let docGridState = Array(maxY).fill().map(() => Array(maxX).fill().map(() => []));

    documents.forEach((doc) => {
        const x = parseInt(doc.path.split("/")[positionX]);
        const y = parseInt(doc.path.split("/")[positionY]);
        docGridState[y][x].push(doc);
    });

    let occupiedGrid = docGridState.map(row => row.map(cell => cell.length > 0));

    // Update the store with the new grid state for the given pageNumber
    studioGridStore.update(state => {
        state[pageNumber] = occupiedGrid;
        return state;
    });
}

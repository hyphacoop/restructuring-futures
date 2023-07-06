const ONE_WEEK = 7 * 24 * 60 * 60 * 1000 * 1000; // converted to microseconds
const PHASE_DURATION = [4 * ONE_WEEK, 3 * ONE_WEEK, 2 * ONE_WEEK, ONE_WEEK];

export function calculateLunarPhase(documents) {
  let maxX = 0, maxY = 0;
  documents.forEach((doc) => {
    const x = parseInt(doc.path.split("/")[2]);
    const y = parseInt(doc.path.split("/")[3]);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  let gridState = Array(maxY + 1); // create an array with the length maxY + 1

  for (let i = 0; i < maxY + 1; i++) {
    gridState[i] = Array(maxX + 1).fill().map(() => []); // initialize each element of the array as a new array with the length maxX + 1 and filled with empty arrays
  }


  documents.forEach((doc) => {
    const x = parseInt(doc.path.split("/")[2]);
    const y = parseInt(doc.path.split("/")[3]);

    const deleteAfter = doc.deleteAfter; 
    const now = Date.now() * 1000; 
    const timeToDeletion = deleteAfter - now;

    let lunarPhase;
    if (timeToDeletion > PHASE_DURATION[1]) {
      lunarPhase = 0;
    } else if (timeToDeletion > PHASE_DURATION[2]) {
      lunarPhase = 1;
    } else if (timeToDeletion > PHASE_DURATION[3]) {
      lunarPhase = 2;
    } else {
      lunarPhase = 3;
    }

    gridState[y][x].push({ 
        doc: doc,
        lunarPhase: lunarPhase,
      });
    });

  return gridState;
}

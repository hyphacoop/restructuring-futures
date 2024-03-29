const QUARTER_CYCLE = 639360000000; // converted to microseconds
const PHASE_DURATION = [QUARTER_CYCLE * 3, QUARTER_CYCLE * 2, QUARTER_CYCLE * 1, 0];


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
    if (timeToDeletion > PHASE_DURATION[0]) {
      lunarPhase = 0;
    } else if (timeToDeletion > PHASE_DURATION[1]) {
      lunarPhase = 1;
    } else if (timeToDeletion > PHASE_DURATION[2]) {
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


export function countArtefactsInEachPhase(gridState) {
  let artefactsInPhase0 = 0;
  let artefactsInPhase1 = 0;
  let artefactsInPhase2 = 0;
  let artefactsInPhase3 = 0;

  // Iterate through the gridState array
  gridState.forEach(row => {
      row.forEach(cell => {
          cell.forEach(artefact => {
              switch (artefact.lunarPhase) {
                  case 0:
                      artefactsInPhase0++;
                      break;
                  case 1:
                      artefactsInPhase1++;
                      break;
                  case 2:
                      artefactsInPhase2++;
                      break;
                  case 3:
                      artefactsInPhase3++;
                      break;
                  default:
                      break;
              }
          });
      });
  });

  return {
      artefactsInPhase0,
      artefactsInPhase1,
      artefactsInPhase2,
      artefactsInPhase3
  };
}

export function calculateSingleDocLunarPhase(doc) {
  const deleteAfter = doc.deleteAfter;
  const now = Date.now() * 1000;
  const timeToDeletion = deleteAfter - now;

  let lunarPhase;
  if (timeToDeletion > PHASE_DURATION[0]) {
      lunarPhase = 0;
  } else if (timeToDeletion > PHASE_DURATION[1]) {
      lunarPhase = 1;
  } else if (timeToDeletion > PHASE_DURATION[2]) {
      lunarPhase = 2;
  } else {
      lunarPhase = 3;
  }

  return {
      lunarPhase,
      timeToDeletion
  };
}

export function calculateTimeToNextPhase(phase, timeToDeletion) {
  if (phase === 3) {
    return timeToDeletion; // If it's the last phase, just return the total time to deletion.
  } else if (phase === 2) {
    return timeToDeletion - PHASE_DURATION[2];
  } else if (phase === 1) {
    return timeToDeletion - PHASE_DURATION[1];
  } else { // for phase 0
    return timeToDeletion - PHASE_DURATION[0];
  }
}
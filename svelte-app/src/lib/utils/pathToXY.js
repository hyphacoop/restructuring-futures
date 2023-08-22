import numberToLetter from "./numberToLetter.js";

export default function pathToXY(path) {
    let splitPath = path.split("/");

    let selectedX, selectedY;
    console.log('splitPath', splitPath)
    console.log('splitPath length', splitPath.length)
    // If there's no additional page subfolder
    if (splitPath.length === 6) {
        selectedX = splitPath[2];
        selectedY = splitPath[3];
    } 
    // If there's an additional page subfolder
    else if (splitPath.length === 7) {
        selectedX = splitPath[3];
        selectedY = splitPath[4];
    } 

    let scaledX = Number(selectedX) + 1;
    let scaledY = numberToLetter(Number(selectedY));
    return [scaledX, scaledY];
}
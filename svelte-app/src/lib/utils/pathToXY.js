import numberToLetter from "./numberToLetter.js";

export default function pathToXY(path) {
    let splitPath = path.split("/");
    let selectedX = splitPath[2];
    let selectedY = splitPath[3];
    let scaledX = Number(selectedX) + 1;
    let scaledY = numberToLetter(Number(selectedY));
    return [scaledX, scaledY];
}
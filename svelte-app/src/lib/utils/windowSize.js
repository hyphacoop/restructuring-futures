export function getWindowWidth() {
    return window.innerWidth;
  }
  
export function attachResizeListener(callback) {
window.addEventListener("resize", callback);
}
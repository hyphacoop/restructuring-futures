export function createObserver(callback, threshold) {
    return new IntersectionObserver(callback, {threshold: threshold});
  }
  
  export function observeElement(observer, element) {
    if (element) {
        if (observer) {
      observer.observe(element);
        }
    }
  }
  
  export function disconnectObserver(observer) {
    if (observer) {
      observer.disconnect();
    }
  }
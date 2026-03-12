/**
 * Returns a debounced function that delays invoking fn until after wait ms
 * have elapsed since the last time it was invoked.
 */
export function debounce(fn, wait) {
  let timeoutId = null;
  const debounced = function (...args) {
    if (timeoutId != null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn.apply(this, args);
    }, wait);
  };
  debounced.cancel = () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  return debounced;
}

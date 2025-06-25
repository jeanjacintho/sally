// js/common/utilities/dom.js
function throttle(callback) {
  let requestId = null, lastArgs;
  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };
  const throttled = (...args) => {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };
  throttled.cancel = () => {
    cancelAnimationFrame(requestId);
    requestId = null;
  };
  return throttled;
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function waitForEvent(element, eventName) {
  return new Promise((resolve) => {
    const done = (event) => {
      if (event.target === element) {
        element.removeEventListener(eventName, done);
        resolve(event);
      }
    };
    element.addEventListener(eventName, done);
  });
}

export { throttle, debounce, waitForEvent };


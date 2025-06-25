// js/common/behavior/gesture-area.js
var _domElement, _thresholdDistance, _thresholdTime, _signal, _firstClientX, _tracking, _start, _touchStart, touchStart_fn, _preventTouch, preventTouch_fn, _gestureStart, gestureStart_fn, _gestureMove, gestureMove_fn, _gestureEnd, gestureEnd_fn;
var GestureArea = class {
  constructor(domElement, { thresholdDistance = 80, thresholdTime = 500, signal = null } = {}) {
    __privateAdd(this, _touchStart);
    __privateAdd(this, _preventTouch);
    __privateAdd(this, _gestureStart);
    __privateAdd(this, _gestureMove);
    __privateAdd(this, _gestureEnd);
    __privateAdd(this, _domElement, void 0);
    __privateAdd(this, _thresholdDistance, void 0);
    __privateAdd(this, _thresholdTime, void 0);
    __privateAdd(this, _signal, void 0);
    __privateAdd(this, _firstClientX, void 0);
    __privateAdd(this, _tracking, false);
    __privateAdd(this, _start, {});
    __privateSet(this, _domElement, domElement);
    __privateSet(this, _thresholdDistance, thresholdDistance);
    __privateSet(this, _thresholdTime, thresholdTime);
    __privateSet(this, _signal, signal ?? new AbortController().signal);
    __privateGet(this, _domElement).addEventListener("touchstart", __privateMethod(this, _touchStart, touchStart_fn).bind(this), { passive: true, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("touchmove", __privateMethod(this, _preventTouch, preventTouch_fn).bind(this), { passive: false, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerdown", __privateMethod(this, _gestureStart, gestureStart_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointermove", __privateMethod(this, _gestureMove, gestureMove_fn).bind(this), { passive: false, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerup", __privateMethod(this, _gestureEnd, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerleave", __privateMethod(this, _gestureEnd, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointercancel", __privateMethod(this, _gestureEnd, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
  }
};
_domElement = new WeakMap();
_thresholdDistance = new WeakMap();
_thresholdTime = new WeakMap();
_signal = new WeakMap();
_firstClientX = new WeakMap();
_tracking = new WeakMap();
_start = new WeakMap();
_touchStart = new WeakSet();
touchStart_fn = function(event) {
  __privateSet(this, _firstClientX, event.touches[0].clientX);
};
_preventTouch = new WeakSet();
preventTouch_fn = function(event) {
  if (Math.abs(event.touches[0].clientX - __privateGet(this, _firstClientX)) > 10) {
    event.preventDefault();
  }
};
_gestureStart = new WeakSet();
gestureStart_fn = function(event) {
  __privateSet(this, _tracking, true);
  __privateSet(this, _start, {
    time: (/* @__PURE__ */ new Date()).getTime(),
    x: event.clientX,
    y: event.clientY
  });
};
_gestureMove = new WeakSet();
gestureMove_fn = function(event) {
  if (__privateGet(this, _tracking)) {
    event.preventDefault();
  }
};
_gestureEnd = new WeakSet();
gestureEnd_fn = function(event) {
  if (!__privateGet(this, _tracking)) {
    return;
  }
  __privateSet(this, _tracking, false);
  const now = (/* @__PURE__ */ new Date()).getTime(), deltaTime = now - __privateGet(this, _start).time, deltaX = event.clientX - __privateGet(this, _start).x, deltaY = event.clientY - __privateGet(this, _start).y;
  if (deltaTime > __privateGet(this, _thresholdTime)) {
    return;
  }
  let matchedEvent;
  if (deltaX === 0 && deltaY === 0) {
    matchedEvent = "tap";
  } else if (deltaX > __privateGet(this, _thresholdDistance) && Math.abs(deltaY) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swiperight";
  } else if (-deltaX > __privateGet(this, _thresholdDistance) && Math.abs(deltaY) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipeleft";
  } else if (deltaY > __privateGet(this, _thresholdDistance) && Math.abs(deltaX) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipedown";
  } else if (-deltaY > __privateGet(this, _thresholdDistance) && Math.abs(deltaX) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipeup";
  }
  if (matchedEvent) {
    __privateGet(this, _domElement).dispatchEvent(new CustomEvent(matchedEvent, { bubbles: true, composed: true, detail: { originalEvent: event } }));
  }
};

export { GestureArea };
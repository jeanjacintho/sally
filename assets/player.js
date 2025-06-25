
// js/common/utilities/player.js
var _callback, _duration, _remainingTime, _startTime, _timer, _state, _onVisibilityChangeListener, _mustResumeOnVisibility, _onVisibilityChange, onVisibilityChange_fn;
var Player = class extends EventTarget {
  constructor(durationInSec, stopOnVisibility = true) {
    super();
    __privateAdd(this, _onVisibilityChange);
    __privateAdd(this, _callback, void 0);
    __privateAdd(this, _duration, void 0);
    __privateAdd(this, _remainingTime, void 0);
    __privateAdd(this, _startTime, void 0);
    __privateAdd(this, _timer, void 0);
    __privateAdd(this, _state, "paused");
    __privateAdd(this, _onVisibilityChangeListener, __privateMethod(this, _onVisibilityChange, onVisibilityChange_fn).bind(this));
    __privateAdd(this, _mustResumeOnVisibility, true);
    __privateSet(this, _callback, () => this.dispatchEvent(new CustomEvent("player:end")));
    __privateSet(this, _duration, __privateSet(this, _remainingTime, durationInSec * 1e3));
    if (stopOnVisibility) {
      document.addEventListener("visibilitychange", __privateGet(this, _onVisibilityChangeListener));
    }
  }
  pause() {
    if (__privateGet(this, _state) !== "started") {
      return;
    }
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _state, "paused");
    __privateSet(this, _remainingTime, __privateGet(this, _remainingTime) - ((/* @__PURE__ */ new Date()).getTime() - __privateGet(this, _startTime)));
    this.dispatchEvent(new CustomEvent("player:pause"));
  }
  resume(restartTimer = false) {
    if (__privateGet(this, _state) !== "stopped") {
      if (restartTimer) {
        this.start();
      } else {
        clearTimeout(__privateGet(this, _timer));
        __privateSet(this, _startTime, (/* @__PURE__ */ new Date()).getTime());
        __privateSet(this, _state, "started");
        __privateSet(this, _timer, setTimeout(__privateGet(this, _callback), __privateGet(this, _remainingTime)));
        this.dispatchEvent(new CustomEvent("player:resume"));
      }
    }
  }
  start() {
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _startTime, (/* @__PURE__ */ new Date()).getTime());
    __privateSet(this, _state, "started");
    __privateSet(this, _remainingTime, __privateGet(this, _duration));
    __privateSet(this, _timer, setTimeout(__privateGet(this, _callback), __privateGet(this, _remainingTime)));
    this.dispatchEvent(new CustomEvent("player:start"));
  }
  stop() {
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _state, "stopped");
    this.dispatchEvent(new CustomEvent("player:stop"));
  }
};
_callback = new WeakMap();
_duration = new WeakMap();
_remainingTime = new WeakMap();
_startTime = new WeakMap();
_timer = new WeakMap();
_state = new WeakMap();
_onVisibilityChangeListener = new WeakMap();
_mustResumeOnVisibility = new WeakMap();
_onVisibilityChange = new WeakSet();
onVisibilityChange_fn = function() {
  if (document.visibilityState === "hidden") {
    __privateSet(this, _mustResumeOnVisibility, __privateGet(this, _state) === "started");
    this.pause();
    this.dispatchEvent(new CustomEvent("player:visibility-pause"));
  } else if (document.visibilityState === "visible" && __privateGet(this, _mustResumeOnVisibility)) {
    this.resume();
    this.dispatchEvent(new CustomEvent("player:visibility-resume"));
  }
};

export { Player };
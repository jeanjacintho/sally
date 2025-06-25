// js/common/behavior/height-observer.js

var _updateCustomProperties, updateCustomProperties_fn;
var HeightObserver = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _updateCustomProperties);
    if (window.ResizeObserver) {
        const throttle = window.moduleRegistry.throttle;
      new ResizeObserver(throttle(__privateMethod(this, _updateCustomProperties, updateCustomProperties_fn).bind(this))).observe(this);
    }
  }
  connectedCallback() {
    if (!window.ResizeObserver) {
      document.documentElement.style.setProperty(`--${this.getAttribute("variable")}-height`, `${Math.round(this.clientHeight)}px`);
    }
  }
};
_updateCustomProperties = new WeakSet();
updateCustomProperties_fn = function(entries) {
  entries.forEach((entry) => {
    if (entry.target === this) {
      const height = entry.borderBoxSize ? entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.borderBoxSize.blockSize : entry.target.clientHeight;
      document.documentElement.style.setProperty(`--${this.getAttribute("variable")}-height`, `${Math.round(height)}px`);
    }
  });
};
if (!window.customElements.get("height-observer")) {
  window.customElements.define("height-observer", HeightObserver);
}

export { HeightObserver };
// js/common/overlay/modal.js
const animate5 = window.moduleRegistry.animate;
const timeline2 = window.moduleRegistry.timeline;
const DialogElement = window.DialogElement || window.moduleRegistry?.DialogElement;

var Modal = class extends DialogElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-modal", "true");
  }
  get shadowDomTemplate() {
    return this.getAttribute("template") || "modal-default-template";
  }
  get shouldLock() {
    return true;
  }
  get shouldAppendToBody() {
    return true;
  }
  createEnterAnimationControls() {
    if (matchesMediaQuery("sm")) {
      return animate5(this, { opacity: [0, 1] }, { duration: 0.2 });
    } else {
      return timeline2([
        [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
        [this.getShadowPartByName("content"), { transform: ["translateY(100%)", "translateY(0)"] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" }]
      ]);
    }
  }
  createLeaveAnimationControls() {
    if (matchesMediaQuery("sm")) {
      return animate5(this, { opacity: [1, 0] }, { duration: 0.2 });
    } else {
      return timeline2([
        [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
        [this.getShadowPartByName("content"), { transform: ["translateY(0)", "translateY(100%)"] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" }]
      ]);
    }
  }
};
if (!window.customElements.get("x-modal")) {
  window.customElements.define("x-modal", Modal);
}

export { Modal };
// js/common/overlay/drawer.js
const timeline3 = window.moduleRegistry.timeline;
const Modal = window.Modal || window.moduleRegistry?.Modal;

var Drawer = class extends Modal {
  get shadowDomTemplate() {
    return this.getAttribute("template") || "drawer-default-template";
  }
  get openFrom() {
    return this.getAttribute("open-from") || "right";
  }
  createEnterAnimationControls() {
    this.getShadowPartByName("content").style.marginInlineStart = this.openFrom === "right" ? "auto" : 0;
    return timeline3([
      [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
      [this.getShadowPartByName("content"), { transform: [`translateX(calc(var(--transform-logical-flip) * ${this.openFrom === "right" ? "100%" : "-100%"}))`, "translateX(0)"] }, { duration: 0.3, at: "<", easing: [0.645, 0.045, 0.355, 1] }]
    ]);
  }
  createLeaveAnimationControls() {
    return timeline3([
      [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
      [this.getShadowPartByName("content"), { transform: ["translateX(0)", `translateX(calc(var(--transform-logical-flip) * ${this.openFrom === "right" ? "100%" : "-100%"}))`] }, { duration: 0.3, at: "<", easing: [0.645, 0.045, 0.355, 1] }]
    ]);
  }
};
if (!window.customElements.get("x-drawer")) {
  window.customElements.define("x-drawer", Drawer);
}

export { Drawer };
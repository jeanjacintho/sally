// js/sections/header.js
const animate18 = window.moduleRegistry.animate;
const timeline9 = window.moduleRegistry.timeline;
const stagger3 = window.moduleRegistry.stagger;
const Delegate7 = window.moduleRegistry.Delegate;
var _headerTrackerIntersectionObserver, _onHeaderTrackerIntersection, onHeaderTrackerIntersection_fn;
var Header = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onHeaderTrackerIntersection);
    __privateAdd(this, _headerTrackerIntersectionObserver, new IntersectionObserver(__privateMethod(this, _onHeaderTrackerIntersection, onHeaderTrackerIntersection_fn).bind(this)));
  }
  connectedCallback() {
    __privateGet(this, _headerTrackerIntersectionObserver).observe(document.getElementById("header-scroll-tracker"));
  }
};
_headerTrackerIntersectionObserver = new WeakMap();
_onHeaderTrackerIntersection = new WeakSet();
onHeaderTrackerIntersection_fn = function(entries) {
  this.classList.toggle("is-solid", !entries[0].isIntersecting);
};
const MenuDisclosure = window.MenuDisclosure || window.moduleRegistry?.MenuDisclosure;
var DropdownMenuDisclosure = class extends MenuDisclosure {
  createShowAnimationControls() {
    let menuItemsSequence = [];
    if (window.themeVariables?.settings?.staggerMenuApparition) {
      menuItemsSequence = [this.contentElement.querySelectorAll(":scope > li"), { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] }, { duration: 0.15, at: "-0.15", delay: stagger3(0.1) }];
    }
    return timeline9([
      [this.contentElement, { opacity: [0, 1] }, { duration: 0.25 }],
      menuItemsSequence
    ]);
  }
  createHideAnimationControls() {
    return timeline9([
      [this.contentElement, { opacity: [1, 0] }, { duration: 0.4 }]
    ]);
  }
};
var MegaMenuDisclosure = class extends MenuDisclosure {
  createShowAnimationControls() {
    const linklists = Array.from(this.contentElement.querySelectorAll(".mega-menu__linklist > li"));
    let menuItemsSequence = [];
    if (window.themeVariables?.settings?.staggerMenuApparition) {
      menuItemsSequence = [
        { name: "content", at: "-0.5" },
        [linklists, { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] }, { duration: 0.3, at: "content", delay: stagger3(0.1) }],
        [this.contentElement.querySelector(".mega-menu__promo"), { opacity: [0, 1] }, { duration: 0.3, at: "-0.15" }]
      ];
    }
    return timeline9([
      [this.contentElement, { opacity: [0, 1] }, { duration: 0.25 }],
      ...menuItemsSequence
    ]);
  }
  createHideAnimationControls() {
    return timeline9([
      [this.contentElement, { opacity: [1, 0] }, { duration: 0.4 }]
    ]);
  }
};
const DialogElement = window.DialogElement || window.moduleRegistry?.DialogElement;
var _calculateMaxHeight, calculateMaxHeight_fn;
var HeaderSearch = class extends DialogElement {
  constructor() {
    super();
    __privateAdd(this, _calculateMaxHeight);
    this.addEventListener("dialog:before-show", __privateMethod(this, _calculateMaxHeight, calculateMaxHeight_fn).bind(this));
  }
  get shadowDomTemplate() {
    return "header-search-default-template";
  }
  get shouldLock() {
    return true;
  }
  createEnterAnimationControls() {
    return timeline9([
      [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.2, easing: [0.645, 0.045, 0.355, 1] }],
      [this.getShadowPartByName("content"), { opacity: [0, 1], transform: ["translateY(calc(-1 * var(--header-height)))", "translateY(0)"] }, { duration: 0.2, at: "<", easing: [0.645, 0.045, 0.355, 1] }]
    ]);
  }
  createLeaveAnimationControls() {
    return timeline9([
      [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.2, easing: [0.645, 0.045, 0.355, 1] }],
      [this.getShadowPartByName("content"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(calc(-1 * var(--header-height)))"] }, { duration: 0.2, at: "<", easing: [0.645, 0.045, 0.355, 1] }]
    ]);
  }
};
_calculateMaxHeight = new WeakSet();
calculateMaxHeight_fn = function() {
  const boundingRect = this.getBoundingClientRect(), maxHeight = window.innerHeight - boundingRect.top;
  this.style.setProperty("--header-search-max-height", `${maxHeight}px`);
};
const Drawer = window.Drawer || window.moduleRegistry?.Drawer;
var _collapsiblePanel, _buttonElements, _openCollapsiblePanel, openCollapsiblePanel_fn, _onSidebarBeforeShow, onSidebarBeforeShow_fn, _onSidebarAfterShow, onSidebarAfterShow_fn, _onSidebarBeforeHide, onSidebarBeforeHide_fn, _onSidebarAfterHide, onSidebarAfterHide_fn;
var HeaderSidebar = class extends Drawer {
  constructor() {
    super();
    __privateAdd(this, _openCollapsiblePanel);
    __privateAdd(this, _onSidebarBeforeShow);
    __privateAdd(this, _onSidebarAfterShow);
    __privateAdd(this, _onSidebarBeforeHide);
    __privateAdd(this, _onSidebarAfterHide);
    __privateAdd(this, _collapsiblePanel, void 0);
    __privateAdd(this, _buttonElements, void 0);
    this.addEventListener("dialog:before-show", __privateMethod(this, _onSidebarBeforeShow, onSidebarBeforeShow_fn));
    this.addEventListener("dialog:after-show", __privateMethod(this, _onSidebarAfterShow, onSidebarAfterShow_fn));
    this.addEventListener("dialog:before-hide", __privateMethod(this, _onSidebarBeforeHide, onSidebarBeforeHide_fn));
    this.addEventListener("dialog:after-hide", __privateMethod(this, _onSidebarAfterHide, onSidebarAfterHide_fn));
  }
  connectedCallback() {
    super.connectedCallback();
    __privateSet(this, _collapsiblePanel, this.querySelector('[slot="collapsible-panel"]'));
    __privateSet(this, _buttonElements, Array.from(this.querySelectorAll(".header-sidebar__main-panel .header-sidebar__linklist [aria-controls]")));
    __privateGet(this, _buttonElements).forEach((button) => button.addEventListener("click", __privateMethod(this, _openCollapsiblePanel, openCollapsiblePanel_fn).bind(this), { signal: this.abortController.signal }));
  }
  revealItems(withDelay = false) {
    return timeline9([
      [this.querySelector(".header-sidebar__main-panel"), { opacity: 1, transform: "translateX(0)" }, { duration: 0, delay: withDelay ? 0.5 : 0 }],
      [this.querySelectorAll(".header-sidebar__main-panel .header-sidebar__linklist li"), { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] }, { duration: 0.15, at: "-0.15", delay: window.themeVariables?.settings?.staggerMenuApparition ? stagger3(0.1) : 0 }],
      [this.querySelector(".header-sidebar__footer"), { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.3 }]
    ]);
  }
};
_collapsiblePanel = new WeakMap();
_buttonElements = new WeakMap();
_openCollapsiblePanel = new WeakSet();
openCollapsiblePanel_fn = function(event) {
  __privateGet(this, _buttonElements).forEach((button) => button.setAttribute("aria-expanded", button === event.currentTarget ? "true" : "false"));
  __privateGet(this, _collapsiblePanel)?.setAttribute("aria-activedescendant", event.currentTarget.getAttribute("aria-controls"));
  if (matchesMediaQuery("md-max")) {
    animate18(this.querySelector(".header-sidebar__main-panel"), { opacity: [1, 0], transform: ["translateX(0)", "translateX(-10px)"] }, { duration: 0.25 });
  }
};
_onSidebarBeforeShow = new WeakSet();
onSidebarBeforeShow_fn = function() {
  animate18(this.querySelector(".header-sidebar__main-panel"), { opacity: 0, transform: "translateX(0)" }, { duration: 0 });
};
_onSidebarAfterShow = new WeakSet();
onSidebarAfterShow_fn = function() {
  this.revealItems();
};
_onSidebarBeforeHide = new WeakSet();
onSidebarBeforeHide_fn = function() {
  if (matchesMediaQuery("md")) {
    __privateGet(this, _collapsiblePanel)?.removeAttribute("aria-activedescendant");
    __privateGet(this, _buttonElements).forEach((button) => button.setAttribute("aria-expanded", "false"));
  }
};
_onSidebarAfterHide = new WeakSet();
onSidebarAfterHide_fn = function() {
  if (matchesMediaQuery("md-max")) {
    __privateGet(this, _collapsiblePanel)?.removeAttribute("aria-activedescendant");
    __privateGet(this, _buttonElements).forEach((button) => button.setAttribute("aria-expanded", "false"));
  }
  Array.from(this.querySelectorAll("details")).forEach((detail) => detail.open = false);
};
var _sidebarDelegate, _closePanel, closePanel_fn, _switchPanel, switchPanel_fn;
var HeaderSidebarCollapsiblePanel = class extends DialogElement {
  constructor() {
    super();
    __privateAdd(this, _closePanel);
    /**
     * Switch from one panel to another. The fromPanel may be undefined if there was no previously open panel
     */
    __privateAdd(this, _switchPanel);
    __privateAdd(this, _sidebarDelegate, new Delegate7(this));
    __privateGet(this, _sidebarDelegate).on("click", '[data-action="close-panel"]', __privateMethod(this, _closePanel, closePanel_fn).bind(this));
  }
  static get observedAttributes() {
    return [...super.observedAttributes, "aria-activedescendant"];
  }
  hideForOutsideClickTarget(target) {
    return false;
  }
  allowOutsideClickForTarget(target) {
    return target.closest(".header-sidebar") !== void 0;
  }
  createEnterAnimationControls() {
    if (matchesMediaQuery("md-max")) {
      return timeline9([
        [this, { opacity: [0, 1], transform: "translateX(0)" }, { duration: 0.3 }]
      ]);
    } else {
      return timeline9([
        [this, { opacity: [0, 1], transform: ["translateX(0)", "translateX(calc(var(--transform-logical-flip) * 100%)"] }, { duration: 0.3 }]
      ]);
    }
  }
  createLeaveAnimationControls() {
    if (matchesMediaQuery("md-max")) {
      return timeline9([
        [this, { opacity: [1, 0], transform: ["translateX(0)", "translateX(10px)"] }, { duration: 0.3 }]
      ]);
    } else {
      return timeline9([
        [this, { opacity: [1, 0], transform: ["translateX(calc(var(--transform-logical-flip) * 100%))", "translateX(0)"] }, { duration: 0.3 }]
      ]);
    }
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "aria-activedescendant") {
      if (oldValue === newValue) {
        return;
      }
      if (newValue !== null) {
        __privateMethod(this, _switchPanel, switchPanel_fn).call(this, this.querySelector(`#${oldValue}`), this.querySelector(`#${newValue}`));
      } else {
        await this.hide();
        Array.from(this.querySelectorAll(".header-sidebar__sub-panel")).forEach((subPanel) => subPanel.hidden = true);
      }
    }
  }
};
_sidebarDelegate = new WeakMap();
_closePanel = new WeakSet();
closePanel_fn = function() {
  this.removeAttribute("aria-activedescendant");
  this.closest("header-sidebar").revealItems(true);
};
_switchPanel = new WeakSet();
switchPanel_fn = async function(fromPanel, toPanel) {
  if (!this.open) {
    await this.show();
  }
  if (fromPanel) {
    await animate18(fromPanel, { opacity: [1, 0] }, { duration: 0.15 }).finished;
    fromPanel.hidden = true;
    Array.from(fromPanel.querySelectorAll("details")).forEach((detail) => detail.open = false);
  }
  toPanel.hidden = false;
  const listSelector = matchesMediaQuery("md-max") ? ".header-sidebar__back-button, .header-sidebar__linklist li" : ".header-sidebar__linklist li";
  timeline9([
    [toPanel, { opacity: 1 }, { duration: 0 }],
    [toPanel.querySelectorAll(listSelector), { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] }, { duration: 0.15, at: "-0.15", delay: window.themeVariables?.settings?.staggerMenuApparition ? stagger3(0.1) : 0 }],
    [toPanel.querySelector(".header-sidebar__promo"), { opacity: [0, 1] }, { duration: 0.45 }]
  ]);
};
if (!window.customElements.get("x-header")) {
  window.customElements.define("x-header", Header);
}
if (!window.customElements.get("dropdown-menu-disclosure")) {
  window.customElements.define("dropdown-menu-disclosure", DropdownMenuDisclosure, { extends: "details" });
}
if (!window.customElements.get("mega-menu-disclosure")) {
  window.customElements.define("mega-menu-disclosure", MegaMenuDisclosure, { extends: "details" });
}
if (!window.customElements.get("header-search")) {
  window.customElements.define("header-search", HeaderSearch);
}
if (!window.customElements.get("header-sidebar")) {
  window.customElements.define("header-sidebar", HeaderSidebar);
}
if (!window.customElements.get("header-sidebar-collapsible-panel")) {
  window.customElements.define("header-sidebar-collapsible-panel", HeaderSidebarCollapsiblePanel);
}

export { Header, DropdownMenuDisclosure, MegaMenuDisclosure, HeaderSearch, HeaderSidebar, HeaderSidebarCollapsiblePanel };
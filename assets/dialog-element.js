// js/common/overlay/dialog-element.js
const animate4 = window.moduleRegistry.animate;
const FocusTrap = window.FocusTrap || window.moduleRegistry?.FocusTrap;
const Delegate2 = window.Delegate || window.moduleRegistry?.Delegate;
var lockLayerCount = 0;
var _isLocked, _delegate2, _abortController4, _focusTrap, _originalParentBeforeAppend, _allowOutsideClick, allowOutsideClick_fn, _allowOutsideClickTouch, allowOutsideClickTouch_fn, _allowOutsideClickMouse, allowOutsideClickMouse_fn, _onToggleClicked, onToggleClicked_fn, _updateSlotVisibility, updateSlotVisibility_fn;
var DialogElement = class extends HTMLElement {
  constructor() {
    super();
    /**
     * If "clickOutsideDeactivates" is true, then this listener will be called on every click outside the element. This
     * allows function separates touch and non-touch events
     */
    __privateAdd(this, _allowOutsideClick);
    /**
     * If "clickOutsideDeactivates" is true, this listener will be called on every touch click outside the trapped
     * element. By default, this will allow any click outside to cause the dialog to close
     */
    __privateAdd(this, _allowOutsideClickTouch);
    /**
     * If "clickOutsideDeactivates" is true, this listener will be called on every mouse click outside the trapped
     * element. By default, this will allow any click outside to cause the dialog to close.
     */
    __privateAdd(this, _allowOutsideClickMouse);
    /**
     * This function is called whenever a toggle (an element controlling this dialog) is called. This simply open
     * the dialog if closed, or close it if open
     */
    __privateAdd(this, _onToggleClicked);
    /**
     * Hide the slots that do not have any children
     */
    __privateAdd(this, _updateSlotVisibility);
    __privateAdd(this, _isLocked, false);
    __privateAdd(this, _delegate2, new Delegate2(document.body));
    __privateAdd(this, _abortController4, void 0);
    __privateAdd(this, _focusTrap, void 0);
    __privateAdd(this, _originalParentBeforeAppend, void 0);
    if (this.shadowDomTemplate) {
      this.attachShadow({ mode: "open" }).appendChild(document.getElementById(this.shadowDomTemplate).content.cloneNode(true));
      this.shadowRoot.addEventListener("slotchange", (event) => __privateMethod(this, _updateSlotVisibility, updateSlotVisibility_fn).call(this, event.target));
    }
    this.addEventListener("dialog:force-close", (event) => {
      this.hide();
      event.stopPropagation();
    });
  }
  static get observedAttributes() {
    return ["id", "open"];
  }
  connectedCallback() {
    if (this.id) {
      __privateGet(this, _delegate2).off().on("click", `[aria-controls="${this.id}"]`, __privateMethod(this, _onToggleClicked, onToggleClicked_fn).bind(this));
    }
    __privateSet(this, _abortController4, new AbortController());
    this.setAttribute("role", "dialog");
    if (this.shadowDomTemplate) {
      this.getShadowPartByName("overlay")?.addEventListener("click", this.hide.bind(this), { signal: this.abortController.signal });
      Array.from(this.shadowRoot.querySelectorAll("slot")).forEach((slot) => __privateMethod(this, _updateSlotVisibility, updateSlotVisibility_fn).call(this, slot));
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.show(!event.detail.load), { signal: this.abortController.signal });
      this.addEventListener("shopify:block:deselect", this.hide, { signal: this.abortController.signal });
      this._shopifySection = this._shopifySection || this.closest(".shopify-section");
      if (this._shopifySection) {
        if (this.hasAttribute("handle-editor-events")) {
          this._shopifySection.addEventListener("shopify:section:select", (event) => this.show(!event.detail.load), { signal: this.abortController.signal });
          this._shopifySection.addEventListener("shopify:section:deselect", this.hide.bind(this), { signal: this.abortController.signal });
        }
        this._shopifySection.addEventListener("shopify:section:unload", () => this.remove(), { signal: this.abortController.signal });
      }
    }
  }
  disconnectedCallback() {
    __privateGet(this, _delegate2).off();
    this.abortController.abort();
    this.focusTrap?.deactivate({ onDeactivate: () => {
    } });
    if (__privateGet(this, _isLocked)) {
      __privateSet(this, _isLocked, false);
      document.documentElement.classList.toggle("lock", --lockLayerCount > 0);
    }
  }
  /**
   * Open the dialog element (the animation can be disabled by passing false as an argument). This function should
   * normally not be directly overriden on children classes
   */
  show(animate27 = true) {
    if (this.open) {
      return Promise.resolve();
    }
    this.setAttribute("open", animate27 ? "" : "immediate");
    return waitForEvent(this, "dialog:after-show");
  }
  /**
   * Hide the dialog element. This function should normally not be directly overriden on children classes
   */
  hide() {
    if (!this.open) {
      return Promise.resolve();
    }
    this.removeAttribute("open");
    return waitForEvent(this, "dialog:after-hide");
  }
  /**
   * Get the abort controller used to clean listeners. You can retrieve it in children classes to add your own listeners
   * that will be cleaned when the element is removed or re-rendered
   */
  get abortController() {
    return __privateGet(this, _abortController4);
  }
  /**
   * Get all the elements controlling this dialog (typically, button). An element controls this dialog if it has an
   * aria-controls attribute matching the ID of this dialog element
   */
  get controls() {
    return Array.from(this.getRootNode().querySelectorAll(`[aria-controls="${this.id}"]`));
  }
  /**
   * Returns if the dialog is open or closed
   */
  get open() {
    return this.hasAttribute("open");
  }
  /**
   * If true is returned, then FocusTrap will activate and manage all the focus management. This is required for good
   * accessibility (such as keyboard management) and should normally not be set to false in children classes unless
   * there is a very good reason to do so
   */
  get shouldTrapFocus() {
    return true;
  }
  /**
   * When the dialog focus is trapped, define if the page is lock (not scrollable). This is usually desirable on
   * full screen modals
   */
  get shouldLock() {
    return false;
  }
  /**
   * By default, when the focus is trapped on an element, a click outside the trapped element close it. Sometimes, it
   * may be desirable to turn off all interactions so that all clicks outside don't do anything
   */
  get clickOutsideDeactivates() {
    return true;
  }
  /**
   * Sometimes (especially for drawer) we need to ensure that an element is on top of everything else. To do that,
   * we need to move the element to the body. We are doing that on open, and then restore the initial position on
   * close
   */
  get shouldAppendToBody() {
    return false;
  }
  /**
   * Decide which element to focus first when the dialog focus is trapped. By default, the first focusable element
   * will be focused, but this can be overridden by passing a selector in the "initial-focus" attribute
   */
  get initialFocus() {
    return this.hasAttribute("initial-focus") ? this.getAttribute("initial-focus") === "false" ? false : this.querySelector(this.getAttribute("initial-focus")) : this.hasAttribute("tabindex") ? this : this.querySelector('input:not([type="hidden"])') || false;
  }
  /**
   * If set to true, then focus trap will not automatically scroll to the first focused element, which can cause
   * annoying experience.
   */
  get preventScrollWhenTrapped() {
    return true;
  }
  /**
   * Get the focus trap element configured with all the other attributes
   */
  get focusTrap() {
    return __privateSet(this, _focusTrap, __privateGet(this, _focusTrap) || new FocusTrap.createFocusTrap([this, this.shadowRoot], {
      onDeactivate: this.hide.bind(this),
      allowOutsideClick: this.clickOutsideDeactivates ? __privateMethod(this, _allowOutsideClick, allowOutsideClick_fn).bind(this) : false,
      initialFocus: matchesMediaQuery("supports-hover") ? this.initialFocus : false,
      fallbackFocus: this,
      preventScroll: this.preventScrollWhenTrapped
    }));
  }
  /**
   * Get the ShadowDOM template (if any). If there is one defined, the dialog automatically constructs it with the
   * shadow DOM
   */
  get shadowDomTemplate() {
    return this.getAttribute("template");
  }
  /**
   * For dialog that use Shadow DOM, this allows a quick retrieval of parts by name
   */
  getShadowPartByName(name) {
    return this.shadowRoot?.querySelector(`[part="${name}"]`);
  }
  /**
   * Callback called when attributes changes. This is the part that glues everything
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "id":
        if (newValue) {
          __privateGet(this, _delegate2).off().on("click", `[aria-controls="${this.id}"]`, __privateMethod(this, _onToggleClicked, onToggleClicked_fn).bind(this));
        }
        break;
      case "open":
        this.controls.forEach((toggle) => toggle.setAttribute("aria-expanded", newValue === null ? "false" : "true"));
        if (oldValue === null && (newValue === "" || newValue === "immediate")) {
          __privateSet(this, _originalParentBeforeAppend, null);
          this.style.setProperty("display", "block");
          this.dispatchEvent(new CustomEvent("dialog:before-show"));
          if (this.shouldAppendToBody && this.parentElement !== document.body) {
            __privateSet(this, _originalParentBeforeAppend, this.parentElement);
            document.body.append(this);
          }
          const animationControls = this.createEnterAnimationControls();
          if (newValue === "immediate") {
            animationControls.finish();
          }
          animationControls.finished.then(() => {
            this.dispatchEvent(new CustomEvent("dialog:after-show"));
          });
          if (this.shouldTrapFocus) {
            this.focusTrap.activate({
              checkCanFocusTrap: () => animationControls.finished
            });
          }
          if (this.shouldLock) {
            lockLayerCount += 1;
            __privateSet(this, _isLocked, true);
            document.documentElement.classList.add("lock");
          }
        } else if (oldValue !== null && newValue === null) {
          this.dispatchEvent(new CustomEvent("dialog:before-hide"));
          const hideTransitionPromise = this.createLeaveAnimationControls().finished;
          hideTransitionPromise.then(() => {
            if (this.parentElement === document.body && __privateGet(this, _originalParentBeforeAppend)) {
              __privateGet(this, _originalParentBeforeAppend).appendChild(this);
              __privateSet(this, _originalParentBeforeAppend, null);
            }
            this.style.setProperty("display", "none");
            this.dispatchEvent(new CustomEvent("dialog:after-hide"));
          });
          this.focusTrap?.deactivate({
            checkCanReturnFocus: () => hideTransitionPromise
          });
          if (this.shouldLock) {
            __privateSet(this, _isLocked, false);
            document.documentElement.classList.toggle("lock", --lockLayerCount > 0);
          }
        }
        this.dispatchEvent(new CustomEvent("toggle", { bubbles: true }));
        break;
    }
  }
  /**
   * Create the animation controls for the enter animation
   */
  createEnterAnimationControls() {
    return animate4(this, {}, { duration: 0 });
  }
  /**
   * Create the animation controls for the leave animation
   */
  createLeaveAnimationControls() {
    return animate4(this, {}, { duration: 0 });
  }
  /**
   * When "clickOutsideDeactivates" is true, this method is called on the final click destination. If this method
   * returns true, then the dialog closes (if false, the dialog remains in its current state). By default, this
   * will close the dialog if a click is done outside the dialog. However, this may be overridden in children classes
   * to provide custom behavior (for instance, to only allow some elements to close the dialog)
   */
  hideForOutsideClickTarget(target) {
    return !this.contains(target);
  }
  /**
   * When "clickOutsideDeactivates" is set to true, this method allows to control which element, when clicked, allows
   * to pass-through and have its behavior being executed
   */
  allowOutsideClickForTarget(target) {
    return false;
  }
};
_isLocked = new WeakMap();
_delegate2 = new WeakMap();
_abortController4 = new WeakMap();
_focusTrap = new WeakMap();
_originalParentBeforeAppend = new WeakMap();
_allowOutsideClick = new WeakSet();
allowOutsideClick_fn = function(event) {
  if ("TouchEvent" in window && event instanceof TouchEvent) {
    return __privateMethod(this, _allowOutsideClickTouch, allowOutsideClickTouch_fn).call(this, event);
  } else {
    return __privateMethod(this, _allowOutsideClickMouse, allowOutsideClickMouse_fn).call(this, event);
  }
};
_allowOutsideClickTouch = new WeakSet();
allowOutsideClickTouch_fn = function(event) {
  event.target.addEventListener("touchend", (subEvent) => {
    const endTarget = document.elementFromPoint(subEvent.changedTouches.item(0).clientX, subEvent.changedTouches.item(0).clientY);
    if (this.hideForOutsideClickTarget(endTarget)) {
      this.hide();
    }
  }, { once: true, signal: this.abortController.signal });
  return this.allowOutsideClickForTarget(event.target);
};
_allowOutsideClickMouse = new WeakSet();
allowOutsideClickMouse_fn = function(event) {
  if (event.type !== "click") {
    return false;
  }
  if (this.hideForOutsideClickTarget(event.target)) {
    this.hide();
  }
  if (this.allowOutsideClickForTarget(event.target)) {
    return true;
  }
  let target = event.target, closestControl = event.target.closest("[aria-controls]");
  if (closestControl && closestControl.getAttribute("aria-controls") === this.id) {
    target = closestControl;
  }
  return this.id !== target.getAttribute("aria-controls");
};
_onToggleClicked = new WeakSet();
onToggleClicked_fn = function(event) {
  event?.preventDefault();
  this.open ? this.hide() : this.show();
};
_updateSlotVisibility = new WeakSet();
updateSlotVisibility_fn = function(slot) {
  if (!["header", "footer"].includes(slot.name)) {
    return;
  }
  slot.parentElement.hidden = slot.assignedElements({ flatten: true }).length === 0;
};
var DialogCloseButton = class extends HTMLButtonElement {
  constructor() {
    super();
    this.addEventListener("click", () => this.dispatchEvent(new CustomEvent("dialog:force-close", { bubbles: true, cancelable: true, composed: true })));
  }
};
if (!window.customElements.get("dialog-element")) {
  window.customElements.define("dialog-element", DialogElement);
}
if (!window.customElements.get("dialog-close-button")) {
  window.customElements.define("dialog-close-button", DialogCloseButton, { extends: "button" });
}

export { DialogElement, DialogCloseButton };
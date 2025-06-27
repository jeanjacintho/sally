// js/common/navigation/custom-details.js
var _onSummaryClickedListener, _onSummaryClicked, onSummaryClicked_fn;
var CustomDetails = class extends HTMLDetailsElement {
  constructor() {
    super();
    /**
     * By default, when clicking on the summary, the browser directly toggle the "open" attribute, which prevent to
     * perform animation. We therefore block that to allow doing an animation
     */
    __privateAdd(this, _onSummaryClicked);
    __privateAdd(this, _onSummaryClickedListener, __privateMethod(this, _onSummaryClicked, onSummaryClicked_fn).bind(this));
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.toggle(true, !event.detail.load));
      this.addEventListener("shopify:block:deselect", (event) => this.toggle(false, !event.detail.load));
    }
  }
  static get observedAttributes() {
    return ["open", "aria-expanded"];
  }
  connectedCallback() {
    this.setAttribute("aria-expanded", this.open ? "true" : "false");
    this.summaryElement.addEventListener("click", __privateGet(this, _onSummaryClickedListener));
  }
  disconnectedCallback() {
    this.summaryElement.removeEventListener("click", __privateGet(this, _onSummaryClickedListener));
  }
  get summaryElement() {
    return this.firstElementChild;
  }
  get contentElement() {
    return this.lastElementChild;
  }
  toggle(force = void 0, animate27 = true) {
    const newValue = typeof force === "boolean" ? force : !(this.getAttribute("aria-expanded") === "true");
    if (newValue) {
      this.setAttribute("open", animate27 ? "" : "immediate");
    }
    this.setAttribute("aria-expanded", newValue ? "true" : "false");
  }
  /**
   * Sync the "open" attribute with the is-expanded class. We also track the "internal-open" attribute to run
   * the various animation
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "open":
        this.setAttribute("aria-expanded", newValue !== null ? "true" : "false");
        break;
      case "aria-expanded":
        if (oldValue === newValue || !this.isConnected) {
          return;
        }
        if (newValue === "false" && this.open) {
          this.createHideAnimationControls()?.finished.then((event) => {
            if (event !== void 0) {
              this.removeAttribute("open");
            }
          });
        } else if (newValue === "true") {
          const controls = this.createShowAnimationControls();
          if (this.getAttribute("open") === "immediate") {
            controls.finish();
          }
        }
    }
  }
  createShowAnimationControls() {
  }
  createHideAnimationControls() {
  }
};
_onSummaryClickedListener = new WeakMap();
_onSummaryClicked = new WeakSet();
onSummaryClicked_fn = function(event) {
  if (this.open && this.summaryElement.hasAttribute("data-follow-link")) {
    return window.location.href = this.summaryElement.getAttribute("data-follow-link");
  }
  event.preventDefault();
  this.toggle();
};

export { CustomDetails };
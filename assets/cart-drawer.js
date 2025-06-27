// js/sections/cart-drawer.js
const animate14 = window.moduleRegistry.animate;
const timeline7 = window.moduleRegistry.timeline;
const Drawer = window.Drawer || window.moduleRegistry?.Drawer;
var _sectionId, _onBundleSection, onBundleSection_fn, _onCartChange, onCartChange_fn, _onBeforeShow, onBeforeShow_fn, _onPageShow, onPageShow_fn, _refreshCart, refreshCart_fn, _replaceContent, replaceContent_fn;
var CartDrawer = class extends Drawer {
  constructor() {
    super(...arguments);
    /**
     * This method is called when the cart is changing, and allow custom sections to order a "re-render"
     */
    __privateAdd(this, _onBundleSection);
    /**
     * When the cart changes, we need to re-render the cart drawer
     */
    __privateAdd(this, _onCartChange);
    /**
     * Execute the animation when the drawer is opened
     */
    __privateAdd(this, _onBeforeShow);
    /**
     * Modern browsers have a feature called "Back-forward cache" which allows to serve directly from the cache the previous
     * page. Unfortunately, this is causing issues with cart drawer, as it may display stale data. We therefore have to
     * detect the case when a page has been restored from backforward cache, and re-render the section
     */
    __privateAdd(this, _onPageShow);
    /**
     * Allow to refresh the cart when the "cart:refresh" event is triggered
     */
    __privateAdd(this, _refreshCart);
    /**
     * The new HTML element to replace
     */
    __privateAdd(this, _replaceContent);
    __privateAdd(this, _sectionId, void 0);
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _sectionId) ?? __privateSet(this, _sectionId, extractSectionId(this));
    document.addEventListener("cart:prepare-bundled-sections", __privateMethod(this, _onBundleSection, onBundleSection_fn).bind(this), { signal: this.abortController.signal });
    document.addEventListener("cart:change", __privateMethod(this, _onCartChange, onCartChange_fn).bind(this), { signal: this.abortController.signal });
    document.addEventListener("cart:refresh", __privateMethod(this, _refreshCart, refreshCart_fn).bind(this), { signal: this.abortController.signal });
    window.addEventListener("pageshow", __privateMethod(this, _onPageShow, onPageShow_fn).bind(this), { signal: this.abortController.signal });
    this.addEventListener("dialog:before-show", __privateMethod(this, _onBeforeShow, onBeforeShow_fn));
  }
};
_sectionId = new WeakMap();
_onBundleSection = new WeakSet();
onBundleSection_fn = function(event) {
  event.detail.sections.push(__privateGet(this, _sectionId));
};
_onCartChange = new WeakSet();
onCartChange_fn = async function(event) {
  __privateMethod(this, _replaceContent, replaceContent_fn).call(this, event.detail.cart["sections"][__privateGet(this, _sectionId)]);
  
  // Check if themeVariables is available, with fallback
  const cartType = window.themeVariables?.settings?.cartType || 'drawer';
  if ((cartType === "drawer" || event.detail["onSuccessDo"] === "force_open_drawer") && event.detail.baseEvent === "variant:add") {
    this.show();
  }
};
_onBeforeShow = new WeakSet();
onBeforeShow_fn = async function() {
  const drawerFooter = this.shadowRoot.querySelector('[part="footer"]');
  if (!drawerFooter) {
    return;
  }
  drawerFooter.style.opacity = "0";
  await waitForEvent(this, "dialog:after-show");
  animate14(drawerFooter, { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] }, { duration: 0.25, easing: [0.25, 0.46, 0.45, 0.94] });
};
_onPageShow = new WeakSet();
onPageShow_fn = async function(event) {
  if (!event.persisted) {
    return;
  }
  __privateMethod(this, _refreshCart, refreshCart_fn).call(this);
};
_refreshCart = new WeakSet();
refreshCart_fn = async function() {
  __privateMethod(this, _replaceContent, replaceContent_fn).call(this, await (await fetch(`${Shopify.routes.root}?section_id=${__privateGet(this, _sectionId)}`)).text());
};
_replaceContent = new WeakSet();
replaceContent_fn = async function(html) {
  const domElement = new DOMParser().parseFromString(html, "text/html"), newCartDrawer = document.createRange().createContextualFragment(domElement.getElementById(`shopify-section-${__privateGet(this, _sectionId)}`).querySelector("cart-drawer").innerHTML), itemCount = (await fetchCart)["item_count"];
  if (itemCount === 0) {
    const controls = timeline7([
      [this.getShadowPartByName("body"), { opacity: [1, 0] }, { duration: 0.15, easing: "ease-in" }],
      [this.getShadowPartByName("footer"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(30px)"] }, { duration: 0.15, at: "<", easing: "ease-in" }]
    ]);
    await controls.finished;
    this.replaceChildren(...newCartDrawer.children);
    animate14(this.getShadowPartByName("body"), { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] }, { duration: 0.25, easing: [0.25, 0.46, 0.45, 0.94] });
  } else {
    this.replaceChildren(...newCartDrawer.children);
  }
  this.classList.toggle("drawer--center-body", itemCount === 0);
};
const DialogElement = window.DialogElement || window.moduleRegistry?.DialogElement;
var CartNoteDialog = class extends DialogElement {
  createEnterAnimationControls() {
    return animate14(this, { transform: ["translateY(100%)", "translateY(0)"] }, { duration: 0.2, easing: "ease-in" });
  }
  createLeaveAnimationControls() {
    return animate14(this, { transform: ["translateY(0)", "translateY(100%)"] }, { duration: 0.2, easing: "ease-in" });
  }
};
if (!window.customElements.get("cart-drawer")) {
  window.customElements.define("cart-drawer", CartDrawer);
}
if (!window.customElements.get("cart-note-dialog")) {
  window.customElements.define("cart-note-dialog", CartNoteDialog);
}

export { CartDrawer, CartNoteDialog };
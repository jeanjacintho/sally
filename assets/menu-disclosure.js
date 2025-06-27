
// js/common/navigation/menu-disclosure.js
const CustomDetails = window.CustomDetails || window.moduleRegistry?.CustomDetails;

var _hoverTimer, _detectClickOutsideListener, _detectEscKeyboardListener, _detectFocusOutListener, _detectHoverOutsideListener, _detectHoverListener, _detectClickOutside, detectClickOutside_fn, _detectHover, detectHover_fn, _detectHoverOutside, detectHoverOutside_fn, _detectEscKeyboard, detectEscKeyboard_fn, _detectFocusOut, detectFocusOut_fn;
var _MenuDisclosure = class _MenuDisclosure extends CustomDetails {
  constructor() {
    super();
    /**
     * When dropdown menu is configured to open on click, we add a listener to detect click outside and automatically
     * close the navigation.
     */
    __privateAdd(this, _detectClickOutside);
    /**
     * On desktop device, if the mode is set to hover, we open/close the dropdown on hover
     */
    __privateAdd(this, _detectHover);
    /**
     * Try to detect when the user hover a different link, to immediately close the item without extra delay
     */
    __privateAdd(this, _detectHoverOutside);
    /**
     * Detect if we hit the "Escape" key to automatically close the dropdown
     */
    __privateAdd(this, _detectEscKeyboard);
    /**
     * Close the dropdown automatically when the dropdown is focused out
     */
    __privateAdd(this, _detectFocusOut);
    __privateAdd(this, _hoverTimer, void 0);
    __privateAdd(this, _detectClickOutsideListener, __privateMethod(this, _detectClickOutside, detectClickOutside_fn).bind(this));
    __privateAdd(this, _detectEscKeyboardListener, __privateMethod(this, _detectEscKeyboard, detectEscKeyboard_fn).bind(this));
    __privateAdd(this, _detectFocusOutListener, __privateMethod(this, _detectFocusOut, detectFocusOut_fn).bind(this));
    __privateAdd(this, _detectHoverOutsideListener, __privateMethod(this, _detectHoverOutside, detectHoverOutside_fn).bind(this));
    __privateAdd(this, _detectHoverListener, __privateMethod(this, _detectHover, detectHover_fn).bind(this));
    this.addEventListener("mouseover", __privateGet(this, _detectHoverListener));
    this.addEventListener("mouseout", __privateGet(this, _detectHoverListener));
  }
  /**
   * Get the trigger mode (can be "click" or "hover"). However, for touch devices, it is always forced to click
   * to provide a better user experience
   */
  get trigger() {
    return !window.matchMedia("screen and (pointer: fine)").matches ? "click" : this.getAttribute("trigger");
  }
  /**
   * In ms, describe the delay before which we close the menu
   */
  get mouseOverDelayTolerance() {
    return 250;
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PRIVATE API
   * -------------------------------------------------------------------------------------------------------------------
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "aria-expanded") {
      if (oldValue === newValue) {
        return;
      }
      if (newValue === "false") {
        document.removeEventListener("click", __privateGet(this, _detectClickOutsideListener));
        document.removeEventListener("keydown", __privateGet(this, _detectEscKeyboardListener));
        document.removeEventListener("focusout", __privateGet(this, _detectFocusOutListener));
        document.removeEventListener("mouseover", __privateGet(this, _detectHoverOutsideListener));
      } else {
        document.addEventListener("click", __privateGet(this, _detectClickOutsideListener));
        document.addEventListener("keydown", __privateGet(this, _detectEscKeyboardListener));
        document.addEventListener("focusout", __privateGet(this, _detectFocusOutListener));
        document.addEventListener("mouseover", __privateGet(this, _detectHoverOutsideListener));
      }
    }
  }
};
_hoverTimer = new WeakMap();
_detectClickOutsideListener = new WeakMap();
_detectEscKeyboardListener = new WeakMap();
_detectFocusOutListener = new WeakMap();
_detectHoverOutsideListener = new WeakMap();
_detectHoverListener = new WeakMap();
_detectClickOutside = new WeakSet();
detectClickOutside_fn = function(event) {
  if (this.trigger !== "click") {
    return;
  }
  if (!this.contains(event.target) && !(event.target.closest("details") instanceof _MenuDisclosure)) {
    this.toggle(false);
  }
};
_detectHover = new WeakSet();
detectHover_fn = function(event) {
  if (this.trigger !== "hover") {
    return;
  }
  if (event.type === "mouseover") {
    clearTimeout(__privateGet(this, _hoverTimer));
    this.toggle(true);
  } else if (event.type === "mouseout") {
    __privateSet(this, _hoverTimer, setTimeout(() => this.toggle(false), this.mouseOverDelayTolerance));
  }
};
_detectHoverOutside = new WeakSet();
detectHoverOutside_fn = function(event) {
  if (this.trigger !== "hover") {
    return;
  }
  const closestDetails = event.target.closest("details");
  if (closestDetails instanceof _MenuDisclosure && closestDetails !== this && !closestDetails.contains(this) && !this.contains(closestDetails)) {
    clearTimeout(__privateGet(this, _hoverTimer));
    this.toggle(false);
  }
};
_detectEscKeyboard = new WeakSet();
detectEscKeyboard_fn = function(event) {
  if (event.code === "Escape") {
    const targetMenu = event.target.closest("details[open]");
    if (targetMenu && targetMenu instanceof _MenuDisclosure) {
      targetMenu.toggle(false);
      event.stopPropagation();
    }
  }
};
_detectFocusOut = new WeakSet();
detectFocusOut_fn = function(event) {
  if (event.relatedTarget && !this.contains(event.relatedTarget)) {
    this.toggle(false);
  }
};
var MenuDisclosure = _MenuDisclosure;

export { MenuDisclosure };
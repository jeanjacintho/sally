// js/common/carousel/effect-carousel.js
const animate3 = window.moduleRegistry.animate;
const timeline = window.moduleRegistry.timeline;
const inView3 = window.moduleRegistry.inView;
const GestureArea = window.moduleRegistry.GestureArea;
const Player = window.moduleRegistry.Player; 
var _listenersAbortController, _gestureArea, _player, _targetIndex, _preventInitialTransition, _setupListeners, setupListeners_fn, _onKeyboardNavigation, onKeyboardNavigation_fn, _preloadImages, preloadImages_fn;
var EffectCarousel = class extends HTMLElement {
  constructor() {
    super();
    /**
     * -------------------------------------------------------------------------------------------------------------------
     * PRIVATE
     * -------------------------------------------------------------------------------------------------------------------
     */
    __privateAdd(this, _setupListeners);
    /**
     * -------------------------------------------------------------------------------------------------------------------
     * OTHER
     * -------------------------------------------------------------------------------------------------------------------
     */
    __privateAdd(this, _onKeyboardNavigation);
    __privateAdd(this, _preloadImages);
    __privateAdd(this, _listenersAbortController, void 0);
    __privateAdd(this, _gestureArea, void 0);
    __privateAdd(this, _player, void 0);
    __privateAdd(this, _targetIndex, 0);
    __privateAdd(this, _preventInitialTransition, false);
    __privateMethod(this, _setupListeners, setupListeners_fn).call(this);
    inView3(this, () => this.onBecameVisible());
    this.addEventListener("carousel:settle", (event) => {
      this.allCells.forEach((cell) => cell.classList.toggle("is-selected", cell === event.detail.cell));
    });
  }
  connectedCallback() {
    __privateSet(this, _targetIndex, Math.max(0, this.cells.findIndex((item) => item.classList.contains("is-selected"))));
    inView3(this, () => __privateMethod(this, _preloadImages, preloadImages_fn).call(this));
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (PROPERTIES)
   * -------------------------------------------------------------------------------------------------------------------
   */
  get allowSwipe() {
    return this.hasAttribute("allow-swipe");
  }
  get cellSelector() {
    return this.hasAttribute("cell-selector") ? this.getAttribute("cell-selector") : null;
  }
  get allCells() {
    return this.cellSelector ? Array.from(this.querySelectorAll(this.cellSelector)) : Array.from(this.children);
  }
  get cells() {
    return this.allCells.filter((cell) => !cell.hasAttribute("hidden"));
  }
  get selectedCell() {
    return this.cells[this.selectedIndex];
  }
  get selectedIndex() {
    return __privateGet(this, _targetIndex);
  }
  get player() {
    return __privateGet(this, _player);
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (METHODS)
   * -------------------------------------------------------------------------------------------------------------------
   */
  previous({ instant = false } = {}) {
    return this.select((this.selectedIndex - 1 + this.cells.length) % this.cells.length, { instant, direction: "previous" });
  }
  next({ instant = false } = {}) {
    return this.select((this.selectedIndex + 1 + this.cells.length) % this.cells.length, { instant, direction: "next" });
  }
  async select(index, { instant = false, direction = null } = {}) {
    if (!(index in this.cells)) {
      return Promise.resolve();
    }
    this.dispatchEvent(new CustomEvent("carousel:select", { detail: { index, cell: this.cells[index] } }));
    if (index === this.selectedIndex) {
      return Promise.resolve();
    }
    __privateGet(this, _player)?.pause();
    const [fromSlide, toSlide] = [this.selectedCell, this.cells[index]];
    direction ??= index > this.selectedIndex ? "next" : "previous";
    __privateSet(this, _targetIndex, index);
    this.dispatchEvent(new CustomEvent("carousel:change", { detail: { index, cell: this.cells[index] } }));
    const animationControls = this.createOnChangeAnimationControls(fromSlide, toSlide, { direction });
    if ("leaveControls" in animationControls && "enterControls" in animationControls) {
      const leaveAnimationControls = animationControls.leaveControls();
      if (instant) {
        leaveAnimationControls.finish();
      }
      await leaveAnimationControls.finished;
      __privateGet(this, _player)?.resume(true);
      fromSlide.classList.remove("is-selected");
      toSlide.classList.add("is-selected");
      const enterAnimationControls = animationControls.enterControls();
      if (instant) {
        enterAnimationControls.finish();
      }
      await enterAnimationControls.finished;
    } else {
      if (instant) {
        animationControls.finish();
      }
      __privateGet(this, _player)?.resume(true);
      toSlide.classList.add("is-selected");
      await animationControls.finished;
      fromSlide.classList.remove("is-selected");
    }
    this.dispatchEvent(new CustomEvent("carousel:settle", { detail: { index, cell: this.cells[index] } }));
  }
  /**
   * Filter cells by indexes. This will automatically add the "hidden" attribute to cells whose index belong to this
   * list. It will also take care of properly adjusting the controls. As a reaction, a "carousel:filter" with the
   * filtered indexes will be emitted.
   */
  filter(indexes = []) {
    this.allCells.forEach((cell, index) => {
      cell.toggleAttribute("hidden", indexes.includes(index));
    });
    this.dispatchEvent(new CustomEvent("carousel:filter", { detail: { filteredIndexes: indexes } }));
  }
  async onBecameVisible() {
    const animationControls = await this.createOnBecameVisibleAnimationControls(this.selectedCell);
    [this.selectedCell, ...this.selectedCell.querySelectorAll("[reveal-on-scroll]")].forEach((element) => {
      element.removeAttribute("reveal-on-scroll");
    });
    if (__privateGet(this, _preventInitialTransition) && typeof animationControls.finish === "function") {
      animationControls.finish();
    }
    return animationControls.finished.then(() => {
      __privateGet(this, _player)?.resume(true);
      this.dispatchEvent(new CustomEvent("carousel:settle", { detail: { index: this.selectedIndex, cell: this.selectedCell } }));
    });
  }
  /**
   * The animation controls when the carousel enter into the view for the first time (by default, none)
   */
  createOnBecameVisibleAnimationControls(toSlide) {
    return animate3(toSlide, {}, { duration: 0 });
  }
  /**
   * Define the transition when the slide changes
   */
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    return timeline([
      [fromSlide, { opacity: [1, 0] }, { duration: 0.3 }],
      [toSlide, { opacity: [0, 1] }, { duration: 0.3, at: "<" }]
    ]);
  }
  /**
   * When the breakpoint changes (for instance from mobile to desktop), we may have to clean up the existing
   * attributes leave by Motion
   */
  cleanUpAnimations() {
    this.allCells.forEach((cell) => {
      cell.style.removeProperty("opacity");
      cell.style.removeProperty("visibility");
    });
  }
};
_listenersAbortController = new WeakMap();
_gestureArea = new WeakMap();
_player = new WeakMap();
_targetIndex = new WeakMap();
_preventInitialTransition = new WeakMap();
_setupListeners = new WeakSet();
setupListeners_fn = function() {
  if (this.hasAttribute("disabled-on")) {
    mediaQueryListener(this.getAttribute("disabled-on"), (event) => {
      if (event.matches) {
        __privateGet(this, _listenersAbortController)?.abort();
        this.cleanUpAnimations();
      } else {
        __privateMethod(this, _setupListeners, setupListeners_fn).call(this);
      }
    });
    if (matchesMediaQuery(this.getAttribute("disabled-on"))) {
      return;
    }
  }
  __privateSet(this, _listenersAbortController, new AbortController());
  const listenerOptions = { signal: __privateGet(this, _listenersAbortController).signal };
  if (Shopify.designMode) {
    this.closest(".shopify-section").addEventListener("shopify:section:select", (event) => __privateSet(this, _preventInitialTransition, event.detail.load), listenerOptions);
  }
  if (this.allCells.length > 1) {
    this.addEventListener("carousel:change", __privateMethod(this, _preloadImages, preloadImages_fn));
    if (this.allowSwipe) {
      __privateSet(this, _gestureArea, new GestureArea(this, { signal: __privateGet(this, _listenersAbortController).signal }));
      this.addEventListener("swipeleft", this.next, listenerOptions);
      this.addEventListener("swiperight", this.previous, listenerOptions);
    }
    if (!this.hasAttribute("disable-keyboard-navigation")) {
      this.tabIndex = 0;
      this.addEventListener("keydown", __privateMethod(this, _onKeyboardNavigation, onKeyboardNavigation_fn), listenerOptions);
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.select(this.cells.indexOf(event.target), { instant: event.detail.load }), listenerOptions);
    }
    if (this.hasAttribute("autoplay")) {
      __privateGet(this, _player) ?? __privateSet(this, _player, new Player(this.getAttribute("autoplay") ?? 5));
      __privateGet(this, _player).addEventListener("player:end", this.next.bind(this), listenerOptions);
      if (Shopify.designMode) {
        this.addEventListener("shopify:block:select", () => __privateGet(this, _player).stop(), listenerOptions);
        this.addEventListener("shopify:block:deselect", () => __privateGet(this, _player).start(), listenerOptions);
      }
    }
  }
};
_onKeyboardNavigation = new WeakSet();
onKeyboardNavigation_fn = function(event) {
  if (event.target !== this) {
    return;
  }
  if (event.code === "ArrowLeft") {
    this.previous();
  } else if (event.code === "ArrowRight") {
    this.next();
  }
};
_preloadImages = new WeakSet();
preloadImages_fn = function() {
  const previousSlide = this.cells[(this.selectedIndex - 1 + this.cells.length) % this.cells.length], nextSlide = this.cells[(this.selectedIndex + 1 + this.cells.length) % this.cells.length];
  [previousSlide, this.selectedCell, nextSlide].forEach((item) => {
    Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach((img) => img.setAttribute("loading", "eager"));
    Array.from(item.querySelectorAll('video[preload="none"]')).forEach((video) => video.setAttribute("preload", "metadata"));
  });
};
if (!window.customElements.get("effect-carousel")) {
  window.customElements.define("effect-carousel", EffectCarousel);
}

export { EffectCarousel };
// js/common/carousel/carousel-navigation.js
var _abortController, _allItems, _onCarouselFilter, onCarouselFilter_fn;
var CarouselNavigation = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onCarouselFilter);
    __privateAdd(this, _abortController, void 0);
    __privateAdd(this, _allItems, []);
  }
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel navigation component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    __privateSet(this, _abortController, new AbortController());
    __privateSet(this, _allItems, Array.from(this.querySelectorAll("button")));
    __privateGet(this, _allItems).forEach((button) => button.addEventListener("click", () => this.onButtonClicked(this.items.indexOf(button)), { signal: __privateGet(this, _abortController).signal }));
    this.carousel.addEventListener("carousel:change", (event) => this.onNavigationChange(event.detail.index), { signal: __privateGet(this, _abortController).signal });
    this.carousel.addEventListener("carousel:filter", __privateMethod(this, _onCarouselFilter, onCarouselFilter_fn).bind(this), { signal: __privateGet(this, _abortController).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController).abort();
  }
  get items() {
    return __privateGet(this, _allItems).filter((item) => !item.hasAttribute("hidden"));
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
  get selectedIndex() {
    return this.items.findIndex((button) => button.getAttribute("aria-current") === "true");
  }
  onButtonClicked(newIndex) {
    this.carousel.select(newIndex);
    this.onNavigationChange(newIndex);
  }
  onNavigationChange(newIndex) {
    this.items.forEach((button, index) => button.setAttribute("aria-current", newIndex === index ? "true" : "false"));
    if (this.hasAttribute("align-selected") && (this.scrollWidth !== this.clientWidth || this.scrollHeight !== this.clientHeight)) {
      this.scrollTo({
        left: this.items[newIndex].offsetLeft - this.clientWidth / 2 + this.items[newIndex].clientWidth / 2,
        top: this.items[newIndex].offsetTop - this.clientHeight / 2 + this.items[newIndex].clientHeight / 2,
        behavior: matchesMediaQuery("motion-safe") ? "smooth" : "auto"
      });
    }
  }
};
_abortController = new WeakMap();
_allItems = new WeakMap();
_onCarouselFilter = new WeakSet();
onCarouselFilter_fn = function(event) {
  __privateGet(this, _allItems).forEach((item, index) => {
    item.toggleAttribute("hidden", (event.detail.filteredIndexes || []).includes(index));
  });
};
var CarouselPrevButton = class extends HTMLButtonElement {
  #abortController;
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel prev button component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    this.#abortController = new AbortController();
    this.addEventListener("click", () => this.carousel.previous(), { signal: this.#abortController.signal });
    this.carousel.addEventListener("scroll:edge-nearing", (event) => this.disabled = event.detail.position === "start", { signal: this.#abortController.signal });
    this.carousel.addEventListener("scroll:edge-leaving", (event) => this.disabled = event.detail.position === "start" ? false : this.disabled, { signal: this.#abortController.signal });
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
var CarouselNextButton = class extends HTMLButtonElement {
  #abortController;
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel next button component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    this.#abortController = new AbortController();
    this.addEventListener("click", () => this.carousel.next(), { signal: this.#abortController.signal });
    this.carousel.addEventListener("scroll:edge-nearing", (event) => this.disabled = event.detail.position === "end", { signal: this.#abortController.signal });
    this.carousel.addEventListener("scroll:edge-leaving", (event) => this.disabled = event.detail.position === "end" ? false : this.disabled, { signal: this.#abortController.signal });
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
if (!window.customElements.get("carousel-prev-button")) {
  window.customElements.define("carousel-prev-button", CarouselPrevButton, { extends: "button" });
}
if (!window.customElements.get("carousel-next-button")) {
  window.customElements.define("carousel-next-button", CarouselNextButton, { extends: "button" });
}
if (!window.customElements.get("carousel-navigation")) {
  window.customElements.define("carousel-navigation", CarouselNavigation);
}

export { CarouselNavigation, CarouselPrevButton, CarouselNextButton };
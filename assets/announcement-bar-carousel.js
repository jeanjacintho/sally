// js/sections/announcement-bar.js
const animate11 = window.moduleRegistry.animate;
const EffectCarousel = window.EffectCarousel || window.moduleRegistry?.EffectCarousel;

if (!EffectCarousel) {
    throw new Error('EffectCarousel must be loaded before AnnouncementBarCarousel');
}
var AnnouncementBarCarousel = class extends EffectCarousel {
    anima
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () => animate11(fromSlide, { opacity: [1, 0], transform: ["translateY(0)", "translateY(-10px)"] }, { duration: 0.25, easing: [0.55, 0.055, 0.675, 0.19] }),
      enterControls: () => animate11(toSlide, { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"] }, { duration: 0.4, easing: [0.215, 0.61, 0.355, 1] })
    };
  }
};
if (!window.customElements.get("announcement-bar-carousel")) {
  window.customElements.define("announcement-bar-carousel", AnnouncementBarCarousel);
}

export { AnnouncementBarCarousel };
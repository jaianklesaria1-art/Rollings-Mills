/* =========================================================
   SCROLL MOTION (home page). Subtle by design: reveal, settle,
   slight parallax. Off for visitors who prefer reduced motion.
   ========================================================= */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    // hero: headline rises in line by line, photo drifts slowly
    gsap.timeline({ delay: 0.15 })
      .from(".th-line", { yPercent: 60, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: "expo.out" })
      .from(".th-brush", { y: 20, autoAlpha: 0, rotation: -12, duration: 0.8, ease: "back.out(2)" }, "-=0.6")
      .from(".th-kicker, .th-lead, .th-actions", { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }, "-=0.6");
    gsap.to(".th-bg", { yPercent: 8, scale: 1.04, ease: "none", scrollTrigger: { trigger: ".th", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".th-inner", { yPercent: -12, autoAlpha: 0.2, ease: "none", scrollTrigger: { trigger: ".th", start: "center center", end: "bottom top", scrub: true } });

    // section headings
    gsap.utils.toArray(".section-head, .split-copy, .join-title").forEach((el) => {
      gsap.from(el.children.length ? el.children : el, {
        y: 36, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%" },
      });
    });

    // photos settle into place
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });
    gsap.utils.toArray(".photo-frame img").forEach((img) => {
      gsap.fromTo(img, { scale: 1.08 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // list rows (taps, dishes, events) stagger in
    const rows = (selector) => ScrollTrigger.batch(selector, {
      start: "top 92%",
      onEnter: (els) => gsap.fromTo(els, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.7, ease: "power3.out", overwrite: true }),
    });
    rows(".tap"); rows(".dish"); rows(".event"); rows(".facts li"); rows(".place, .book-form");
  });
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
}

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

    // tap takeover: pin the stage, pour one beer per scroll step
    if (document.getElementById("pint-beer")) {
      const n = POUR_BEERS.length;
      let current = 0;
      const EMPTY = 372; // how far the beer drops to look like an empty glass
      gsap.set("#pint-beer", { y: EMPTY });
      const switchTo = (i) => {
        current = i;
        pourInfo(i);
        const c = pourColours(i);
        gsap.to("#liq-top", { attr: { "stop-color": c.top }, duration: 0.6 });
        gsap.to("#liq-bot", { attr: { "stop-color": c.bot }, duration: 0.6 });
        gsap.to("#foam-body, #foam-top", { attr: { fill: c.foam }, duration: 0.6 });
        gsap.to("#pint-haze", { opacity: c.haze, duration: 0.6 });
        gsap.fromTo("#pour-word", { clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% 0% -20% 0)", duration: 0.9, ease: "power2.out" });
        gsap.fromTo(".pour-info > *", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.5, ease: "power3.out" });
      };
      ScrollTrigger.create({
        trigger: ".pour", start: "top top", end: () => "+=" + innerHeight * n * 0.9, pin: true, scrub: true,
        onUpdate: (self) => {
          const pos = self.progress * n;
          const i = Math.min(n - 1, Math.floor(pos));
          if (i !== current) switchTo(i);
          const local = Math.min(1, (pos - i) * 1.7); // glass is full by ~60% of each step
          const fill = 1 - Math.pow(1 - local, 2);
          gsap.set("#pint-beer", { y: EMPTY * (1 - fill) });
          gsap.set(".pint", { rotation: (pos - i - 0.5) * -3 });
        },
      });
    }

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

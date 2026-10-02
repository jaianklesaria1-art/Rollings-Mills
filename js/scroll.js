/* =========================================================
   SCROLL ANIMATIONS (GSAP + ScrollTrigger)
   Turned off for visitors who prefer reduced motion.
   ========================================================= */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    /* ---- 1. HERO: walk down the alley, through the red door ---- */
    const room = document.querySelector(".alley-room");
    const DEPTH = 2800; // keep in sync with --d in styles.css
    const lamps = gsap.utils.toArray(".a-lamp").map((el) => ({ el, z: parseFloat(el.style.getPropertyValue("--z")) }));
    const hideLampsBehindCamera = () => {
      const camZ = gsap.getProperty(room, "z");
      lamps.forEach((l) => (l.el.style.visibility = l.z + camZ > 380 ? "hidden" : "visible"));
    };

    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: ".alley", start: "top top", end: "+=260%", scrub: 1, pin: true },
      onUpdate: hideLampsBehindCamera,
    })
      .to(".alley-ui, .walk-hint", { autoAlpha: 0, y: 30, duration: 0.08 }, 0)
      .to(room, { z: DEPTH - 650, duration: 0.72, ease: "power1.in" }, 0)
      .to(".door-leaf", { rotationY: -110, duration: 0.14, ease: "power2.inOut" }, 0.7)
      .to(room, { z: DEPTH - 60, duration: 0.18, ease: "power2.in" }, 0.8)
      .to(".alley-flash", { opacity: 1, duration: 0.08 }, 0.88)
      .to(".alley", { "--fade": 1, duration: 0.06 }, 0.95);

    // look around with the mouse (desktop only)
    const view = document.querySelector(".alley-view");
    if (matchMedia("(pointer: fine)").matches) {
      document.querySelector(".alley").addEventListener("pointermove", (e) => {
        const x = 50 + (e.clientX / innerWidth - 0.5) * 14;
        const y = 46 + (e.clientY / innerHeight - 0.5) * 10;
        view.style.perspectiveOrigin = `${x}% ${y}%`;
      });
    }
    // lamps sway a little
    gsap.to(".a-lamp", { rotationZ: 2.5, duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.3 });
    // flickering tube lights
    gsap.to(".tube-2", { opacity: 0.35, duration: 0.08, repeat: -1, repeatDelay: 2.7, yoyo: true });

    /* ---- 1b. BRAND HERO: brush lines blur in, photo drifts, ticker slides ---- */
    gsap.timeline({ scrollTrigger: { trigger: ".th", start: "top 60%" } })
      .from(".th-line", { yPercent: 40, autoAlpha: 0, filter: "blur(18px)", scale: 1.08, stagger: 0.16, duration: 0.9, ease: "power3.out" })
      .from(".th-actions .th-btn", { y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.5 }, "-=0.4")
      .from(".th-scroll", { autoAlpha: 0, duration: 0.6 }, "-=0.2");
    const thScrub = { trigger: ".th", start: "top bottom", end: "bottom top", scrub: true };
    gsap.fromTo(".th-bg", { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1, ease: "none", scrollTrigger: thScrub });
    gsap.to(".th-title", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ".th", start: "top top", end: "bottom top", scrub: true } });
    gsap.fromTo(".th-ticker", { x: 80 }, { x: -120, ease: "none", scrollTrigger: { ...thScrub } });

    /* ---- 1b+. the pour: pull the tap, fill the pint, swap the glass, repeat ---- */
    if (document.getElementById("pour-glass")) {
      gsap.set("#pour-glass", { x: -360 });
      gsap.set("#pour-beer", { y: 252 });
      gsap.set("#pour-stream", { scaleY: 0, transformOrigin: "50% 0%" });
      const pour = gsap.timeline({ repeat: -1, repeatDelay: 0.3, paused: true })
        .to("#pour-glass", { x: 0, duration: 0.7, ease: "power3.out" })
        .to("#pour-handle", { rotation: 24, svgOrigin: "300 330", duration: 0.35, ease: "back.out(2)" })
        .to("#pour-stream", { scaleY: 1, duration: 0.25, ease: "power1.in" }, "-=0.1")
        .to("#pour-beer", { y: 0, duration: 3.4, ease: "power1.out" }, "-=0.05")
        .to("#pour-handle", { rotation: 0, svgOrigin: "300 330", duration: 0.3, ease: "power2.in" }, "-=0.3")
        .set("#pour-stream", { transformOrigin: "50% 100%" }, "<")
        .to("#pour-stream", { scaleY: 0, duration: 0.25, ease: "power1.in" }, "<")
        .to("#pour-glass", { x: 360, duration: 0.7, ease: "power3.in" }, "+=1.1")
        .set("#pour-beer", { y: 252 })
        .set("#pour-stream", { transformOrigin: "50% 0%" });
      // only pour while the hero is on screen
      ScrollTrigger.create({ trigger: ".th", start: "top bottom", end: "bottom top", onToggle: (self) => (self.isActive ? pour.play() : pour.pause()) });
    }

    /* ---- 1c. ABOUT: photos get taped up, perks stack in ---- */
    gsap.from(".snap", {
      y: 120, rotation: (i) => [-25, 20, -10][i], autoAlpha: 0, stagger: 0.15, duration: 0.8, ease: "back.out(1.4)",
      scrollTrigger: { trigger: ".about-photos", start: "top 80%" },
    });
    gsap.from(".about-sticker", { scale: 3, autoAlpha: 0, duration: 0.4, ease: "power4.in", delay: 0.6, scrollTrigger: { trigger: ".about-photos", start: "top 80%" } });
    // split the About heading into words so each one can blur in
    document.querySelectorAll(".about-title").forEach((h) => {
      h.querySelectorAll(":scope, :scope > span").forEach((node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType !== 3 || !n.textContent.trim()) return;
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w.trim()) return frag.append(w);
            const span = document.createElement("span");
            span.className = "word";
            span.textContent = w;
            frag.append(span);
          });
          n.replaceWith(frag);
        });
      });
    });
    gsap.from(".about-title .word", { autoAlpha: 0, filter: "blur(14px)", x: -12, stagger: 0.08, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: ".about-title", start: "top 82%" } });
    gsap.from(".about-copy > p, .about-actions", { y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".about-title", start: "top 75%" } });
    gsap.from(".perks li", { y: 40, autoAlpha: 0, scale: 0.9, stagger: 0.07, duration: 0.5, ease: "back.out(1.8)", scrollTrigger: { trigger: ".perks", start: "top 88%" } });

    /* ---- 2. FEATURE: pinned can while the story plays around it ---- */
    const mouth = document.querySelector(".f-mouth");
    gsap.set(mouth, { yPercent: -50, x: () => innerWidth });
    gsap.timeline({
      scrollTrigger: { trigger: ".feature", start: "top top", end: "+=300%", scrub: 1, pin: true, invalidateOnRefresh: true },
      defaults: { ease: "none" },
    })
      .to(".f-can", { rotation: 0, scale: 1.1, duration: 1, ease: "power2.out" }, 0)
      .to(".f-title", { scale: 0.85, autoAlpha: 0.25, duration: 1 }, 0)
      .fromTo(".f-stats", { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power2.out" }, 0.3)
      .to(".f-stats", { autoAlpha: 0, x: 80, duration: 0.4 }, 1.4)
      .to(".f-title", { yPercent: -150, autoAlpha: 0, duration: 0.6 }, 1.4)
      .to(mouth, { x: () => -mouth.offsetWidth, duration: 2.4 }, 1.5)
      .to(".f-can", { rotation: -12, duration: 1 }, 1.6)
      .to(".splat", { scale: 1, rotation: 0, duration: 0.35, stagger: 0.18, ease: "back.out(2)" }, 1.8)
      .to(".splat", { scale: 0, rotation: 40, duration: 0.3, stagger: 0.05 }, 3.4)
      .to(".f-can", { rotation: 360, scale: 0.7, duration: 0.8, ease: "power2.in" }, 3.4)
      .to(".f-can", { yPercent: 160, duration: 0.4, ease: "power2.in" }, 3.9);

    /* ---- 3. BEER WALL: vertical scroll drives a sideways line-up ---- */
    const track = document.getElementById("beers-track");
    const distance = () => track.scrollWidth - innerWidth;
    const wall = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: { trigger: ".beers", start: "top top", end: () => "+=" + distance(), scrub: 1, pin: true, invalidateOnRefresh: true },
    });
    gsap.utils.toArray(".beer-panel").forEach((panel) => {
      const st = { trigger: panel, containerAnimation: wall, start: "left right", end: "right left", scrub: true };
      gsap.fromTo(panel.querySelector(".beer-can"), { rotation: -35, y: 120 }, { rotation: 15, y: -60, ease: "none", scrollTrigger: st });
      gsap.fromTo(panel.querySelector(".beer-bigword"), { xPercent: -20 }, { xPercent: -80, ease: "none", scrollTrigger: { ...st } });
      gsap.from(panel.querySelector(".beer-info"), {
        y: 80, autoAlpha: 0, rotation: 6, duration: 0.6, ease: "back.out(1.6)",
        scrollTrigger: { trigger: panel, containerAnimation: wall, start: "left 60%", toggleActions: "play none none reverse" },
      });
    });

    /* ---- 4. titles get "sprayed" on left-to-right ---- */
    gsap.utils.toArray(".section-head .spray-title, .tagwall-head .spray-title").forEach((t) => {
      gsap.fromTo(t, { clipPath: "inset(-20% 100% -20% 0)" }, {
        clipPath: "inset(-20% 0% -20% 0)", duration: 1.1, ease: "power2.out",
        scrollTrigger: { trigger: t, start: "top 85%" },
      });
    });

    /* ---- 5. cards slap onto the wall ---- */
    const slap = (selector) => ScrollTrigger.batch(selector, {
      start: "top 90%",
      onEnter: (els) => gsap.fromTo(els, { y: 70, autoAlpha: 0, scale: 0.94 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: "back.out(1.5)", overwrite: true }),
    });
    slap(".tonight-card");
    slap(".tap-row");
    slap(".food-card");
    slap(".gig");
    slap(".location, .book-form");

    /* ---- 6. THE MILL: stencil lines stamp in, stickers slap on ---- */
    gsap.from(".mill-title .line", {
      yPercent: 100, autoAlpha: 0, skewY: 6, stagger: 0.12, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".mill-title", start: "top 80%" },
    });
    gsap.from(".mill-cols p, .mill-facts li", {
      y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.7,
      scrollTrigger: { trigger: ".mill-cols", start: "top 85%" },
    });
    gsap.from(".sticker", {
      scale: 3, autoAlpha: 0, stagger: 0.2, duration: 0.4, ease: "power4.in",
      scrollTrigger: { trigger: ".mill", start: "top 50%" },
    });
    gsap.to(".mill-lamps i", { rotation: 4, transformOrigin: "50% -200px", duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.4 });

    /* ---- 7. graffiti layers drift for depth ---- */
    gsap.utils.toArray(".tapboard .wall-tags, .events .wall-tags, .visit .wall-tags, .collage-bg").forEach((layer) => {
      gsap.fromTo(layer, { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  });

  // fonts change text widths, so re-measure once they load
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
}

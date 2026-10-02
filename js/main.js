/* =========================================================
   ROLLING MILLS: interactions + scroll animations (GSAP)
   ========================================================= */

// ---------- age gate ----------
const gate = document.getElementById("age-gate");
const AGE_KEY = "rm-age-ok";

function unlock() {
  gate.classList.add("hidden");
  document.body.classList.remove("is-locked");
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}

let ageOk = false;
try { ageOk = localStorage.getItem(AGE_KEY) === "1"; } catch (e) {}
if (ageOk) unlock();

gate.querySelector('[data-age="yes"]').addEventListener("click", () => {
  try { localStorage.setItem(AGE_KEY, "1"); } catch (e) {}
  unlock();
});
gate.querySelector('[data-age="no"]').addEventListener("click", () => {
  gate.querySelector(".age-no").hidden = false;
});

// ---------- header + mobile nav ----------
const header = document.querySelector(".site-header");
const nav = document.getElementById("site-nav");
const toggle = document.querySelector(".nav-toggle");

addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 40), { passive: true });

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- scroll animations ----------
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    /* ---- 1. HERO: the words split apart while the can spins forward ---- */
    gsap.set(".hero-word", { xPercent: -50 });
    gsap.timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: "+=120%", scrub: 1, pin: true },
    })
      .to(".hero-tag, .drip-hero, .hero-sub, .scroll-hint", { autoAlpha: 0, y: -40, duration: 0.3 }, 0)
      .to(".hero-word-top", { x: () => -innerWidth * 0.75, duration: 1 }, 0)
      .to(".hero-word-bottom", { x: () => innerWidth * 0.75, duration: 1 }, 0)
      .to(".hero-can", { rotation: 360, scale: 1.6, duration: 1, ease: "power1.inOut" }, 0)
      .to(".hero-can", { y: () => -innerHeight * 0.15, autoAlpha: 0, duration: 0.3 }, 0.75);

    // small idle wobble so the can feels alive before you scroll
    gsap.to(".hero-can svg", { y: -12, rotation: 3, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });

    /* ---- 2. FEATURE: pinned can while the story plays around it ---- */
    const mouth = document.querySelector(".f-mouth");
    gsap.set(mouth, { yPercent: -50, x: () => innerWidth });
    gsap.timeline({
      scrollTrigger: { trigger: ".feature", start: "top top", end: "+=300%", scrub: 1, pin: true, invalidateOnRefresh: true },
      defaults: { ease: "none" },
    })
      // beat 1: can straightens, stats card slides in, title squeezes back
      .to(".f-can", { rotation: 0, scale: 1.1, duration: 1, ease: "power2.out" }, 0)
      .to(".f-title", { scale: 0.85, autoAlpha: 0.25, duration: 1 }, 0)
      .fromTo(".f-stats", { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power2.out" }, 0.3)
      // beat 2: stats out, MOUTHFEEL rolls across, splats pop around the can
      .to(".f-stats", { autoAlpha: 0, x: 80, duration: 0.4 }, 1.4)
      .to(".f-title", { yPercent: -150, autoAlpha: 0, duration: 0.6 }, 1.4)
      .to(mouth, { x: () => -mouth.offsetWidth, duration: 2.4 }, 1.5)
      .to(".f-can", { rotation: -12, duration: 1 }, 1.6)
      .to(".splat", { scale: 1, rotation: 0, duration: 0.35, stagger: 0.18, ease: "back.out(2)" }, 1.8)
      // beat 3: splats fly off, can does a flip and drops away
      .to(".splat", { scale: 0, rotation: 40, duration: 0.3, stagger: 0.05 }, 3.4)
      .to(".f-can", { rotation: 360, scale: 0.7, duration: 0.8, ease: "power2.in" }, 3.4)
      .to(".f-can", { yPercent: 160, duration: 0.4, ease: "power2.in" }, 3.9);

    /* ---- 3. BEER WALL: vertical scroll drives a horizontal line-up ---- */
    const track = document.getElementById("beers-track");
    const distance = () => track.scrollWidth - innerWidth;
    const wall = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: ".beers",
        start: "top top",
        end: () => "+=" + distance(),
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
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

    /* ---- 4. THE MILL: stencil lines stamp in, stickers slap on ---- */
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

    /* ---- 5. sections: tags, titles and cards ---- */
    gsap.utils.toArray(".collab, .visit, .ig").forEach((sec) => {
      gsap.from(sec.querySelectorAll(".tag, .spray-title, .ig-handle"), {
        y: 60, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sec, start: "top 75%" },
      });
    });
    gsap.from(".location", {
      y: 100, autoAlpha: 0, rotation: () => gsap.utils.random(-8, 8), stagger: 0.15, duration: 0.8, ease: "back.out(1.4)",
      scrollTrigger: { trigger: ".visit-grid", start: "top 80%" },
    });
    gsap.from(".collab-can", {
      x: 200, rotation: 60, autoAlpha: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".collab", start: "top 70%" },
    });
  });

  // fonts change text widths, so re-measure once they load
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
}

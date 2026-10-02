/* =========================================================
   OUR STORY PAGE: timeline, reviews, Instagram tiles + motion
   (content lives in js/data.js: TIMELINE, REVIEWS)
   ========================================================= */

// ---------- timeline ----------
(function renderTimeline() {
  const list = document.getElementById("tl-list");
  if (!list) return;
  list.insertAdjacentHTML("beforeend", TIMELINE.map((t) => `
    <li class="tl-item">
      <span class="tl-dot" aria-hidden="true"></span>
      <p class="tl-when">${esc(t.when)}</p>
      <h3 class="tl-name">${esc(t.title)}</h3>
      <p class="tl-text">${esc(t.text)}</p>
    </li>`).join(""));
})();

// ---------- reviews (only real ones from data.js) ----------
(function renderReviews() {
  const grid = document.getElementById("rv-grid");
  if (!grid) return;
  const cta = `
    <article class="rv-card rv-cta">
      <p class="rv-stars" aria-hidden="true">★★★★★</p>
      <h3>Been in for a pint?</h3>
      <p>Tell the world what you drank, what you ate, and who you dragged along.</p>
      <a class="th-btn th-btn-fill" href="${GOOGLE_REVIEW_URL}" target="_blank" rel="noopener">Review us on Google</a>
    </article>`;
  grid.classList.toggle("rv-empty", !REVIEWS.length);
  grid.innerHTML = REVIEWS.map((r) => `
    <article class="rv-card">
      <p class="rv-stars" aria-label="${r.stars} out of 5 stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</p>
      <p class="rv-text">“${esc(r.text)}”</p>
      <p class="rv-who"><b>${esc(r.name)}</b>${r.source ? ` · ${esc(r.source)}` : ""}</p>
    </article>`).join("") + cta;
})();

// ---------- Instagram strip (links out; swap tiles for real post images any time) ----------
(function renderInsta() {
  const row = document.getElementById("igs-row");
  if (!row) return;
  const tiles = [
    `<img src="assets/photos/brewhouse-wide.webp" alt="The Rolling Mills brewhouse">`,
    canSVG(BEER_BY_ID.lazy),
    `<img src="assets/photos/brewhouse-bw.webp" alt="Tanks in the Rolling Mills brewhouse">`,
    canSVG(BEER_BY_ID.guns),
    canSVG(BEER_BY_ID.kura),
  ];
  row.innerHTML = tiles.map((t, i) => `
    <a class="igs-tile ${t.includes("can-svg") ? "is-can" : ""}" href="${CONTACT.instagram}" target="_blank" rel="noopener" aria-label="Open Rolling Mills on Instagram">${t}<span class="igs-hover" aria-hidden="true">@rollingmillsbrewery</span></a>`).join("");
})();

// ---------- motion ----------
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    // hero: brush lines blur in, photo swings into place
    gsap.timeline({ delay: 0.2 })
      .from(".sh-line", { yPercent: 40, autoAlpha: 0, filter: "blur(18px)", scale: 1.08, stagger: 0.16, duration: 0.9, ease: "power3.out" })
      .from(".sh-lead", { y: 20, autoAlpha: 0, duration: 0.6 }, "-=0.4")
      .from(".sh-photo", { x: 120, rotation: 14, autoAlpha: 0, duration: 1, ease: "power3.out" }, 0.2);

    // day zero: heading and paragraphs fade up
    gsap.from(".dz-title, .dz-copy p", {
      y: 40, autoAlpha: 0, filter: "blur(8px)", stagger: 0.15, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: ".dz", start: "top 70%" },
    });

    // photo band: slow parallax, words slide in from the left
    gsap.fromTo(".band-img img", { yPercent: -12, scale: 1.15 }, {
      yPercent: 12, scale: 1, ease: "none",
      scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.from(".band-text span", {
      xPercent: -30, autoAlpha: 0, filter: "blur(10px)", stagger: 0.18, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".band", start: "top 60%" },
    });

    // timeline: the rail fills as you scroll, each milestone lights up
    gsap.fromTo(".tl-fill", { scaleY: 0 }, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".tl-wrap", start: "top 70%", end: "bottom 60%", scrub: true },
    });
    gsap.utils.toArray(".tl-item").forEach((item) => {
      gsap.from(item, {
        x: 40, autoAlpha: 0, filter: "blur(6px)", duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 78%", onEnter: () => item.classList.add("is-lit") },
      });
    });

    // reviews, instagram tiles, join
    ScrollTrigger.batch(".rv-card, .igs-tile", {
      start: "top 90%",
      onEnter: (els) => gsap.fromTo(els, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.6, ease: "back.out(1.5)", overwrite: true }),
    });
    gsap.from(".join-title, .join-actions", {
      y: 40, autoAlpha: 0, stagger: 0.15, duration: 0.7,
      scrollTrigger: { trigger: ".join", start: "top 75%" },
    });
  });
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
}

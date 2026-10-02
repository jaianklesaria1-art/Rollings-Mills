// ===== Mobile navigation =====
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// ===== Highlight nav link for the section in view =====
const navLinks = [...nav.querySelectorAll("a:not(.btn)")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// ===== Animated stat counters =====
const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-IN");
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

// ===== Reveal-on-scroll =====
const revealTargets = document.querySelectorAll(
  ".product-card, .process-steps li, .industry, .panel-card, .quality-list li, .section h2"
);
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// ===== Product spec dialog =====
// Edit sizes / grades here to match what the mill actually rolls.
const PRODUCTS = {
  tmt: {
    title: "TMT Bars",
    desc: "Thermo-mechanically treated reinforcement bars with a hard outer surface and a soft, ductile core.",
    specs: {
      Grades: "Fe 500, Fe 500D, Fe 550D, Fe 600",
      Diameters: "8, 10, 12, 16, 20, 25, 32 mm",
      Length: "12 m standard (custom on request)",
      Standard: "IS 1786:2008",
    },
  },
  angles: {
    title: "MS Angles",
    desc: "Equal and unequal mild steel angles for transmission towers, frames and general fabrication.",
    specs: {
      Sizes: "25×25 mm to 100×100 mm",
      Thickness: "3 mm to 10 mm",
      Grades: "E250, E350",
      Standard: "IS 2062",
    },
  },
  channels: {
    title: "MS Channels",
    desc: "ISMC channels for structural support, purlins, sheds and machinery bases.",
    specs: {
      Sizes: "ISMC 75 to ISMC 200",
      Length: "6 m / 12 m",
      Grades: "E250, E350",
      Standard: "IS 2062 / IS 808",
    },
  },
  beams: {
    title: "I-Beams / Joists",
    desc: "ISMB beams and joists for heavy structural and industrial construction.",
    specs: {
      Sizes: "ISMB 100 to ISMB 200",
      Length: "6 m / 12 m",
      Grades: "E250, E350",
      Standard: "IS 2062 / IS 808",
    },
  },
  flats: {
    title: "MS Flats & Squares",
    desc: "Precision-rolled flats and square bars for fabrication, gates, grills and engineering parts.",
    specs: {
      Flats: "20×3 mm to 100×12 mm",
      Squares: "10 mm to 40 mm",
      Grades: "E250",
      Standard: "IS 2062",
    },
  },
  wire: {
    title: "Wire Rods",
    desc: "Hot-rolled coiled wire rods for wire drawing, binding wire, nails and fasteners.",
    specs: {
      Diameters: "5.5 mm to 12 mm",
      "Coil weight": "1.5 – 2.0 MT",
      Grades: "Low & medium carbon",
      Standard: "IS 7887",
    },
  },
};

const dialog = document.getElementById("spec-dialog");
const specTitle = document.getElementById("spec-title");
const specDesc = document.getElementById("spec-desc");
const specBody = document.getElementById("spec-body");

document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", () => {
    const product = PRODUCTS[card.dataset.product];
    if (!product) return;
    specTitle.textContent = product.title;
    specDesc.textContent = product.desc;
    specBody.replaceChildren(
      ...Object.entries(product.specs).map(([label, value]) => {
        const row = document.createElement("tr");
        const th = document.createElement("th");
        const td = document.createElement("td");
        th.textContent = label;
        td.textContent = value;
        row.append(th, td);
        return row;
      })
    );
    document.getElementById("product").value = product.title;
    dialog.showModal();
  });
});

dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
document.getElementById("spec-quote").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close(); // click on backdrop
});

// ===== Quote form =====
// No backend yet: this validates and shows a confirmation. To receive enquiries,
// point the form at a service such as Formspree, or your own server endpoint.
const form = document.getElementById("quote-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const ok = input.value.trim() !== "";
    input.closest(".field").classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    status.textContent = "Please fill in the required fields.";
    status.className = "form-status error";
    return;
  }

  status.textContent = "Thank you! Our sales team will contact you shortly.";
  status.className = "form-status success";
  form.reset();
});

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================================
   BEER DATA + CAN ARTWORK
   Edit this list to add, remove or update beers.
   - colors: [label background, spray accent, text colour]
   - hl: highlight colour for the info card on the beer wall
   - When you have real can photos, set `image: "assets/cans/lazy.png"`
     and the photo will be used instead of the drawn can.
   ========================================================= */
const BEERS = [
  {
    id: "lazy",
    hl: "#e4ff1a",
    name: "Lazy",
    style: "New England IPA",
    abv: "6.0%",
    notes: "Juicy and hazy, dry-hopped with Citra, Simcoe, Azacca and El Dorado.",
    colors: ["#e4ff1a", "#ff2e88", "#121212"],
    bg: "#1d1d1d",
  },
  {
    id: "kura",
    hl: "#ff5a4f",
    name: "Kura Kura",
    style: "Japanese Rice Lager",
    notes: "Super clean and crisp. Brewed with Japanese rice and Japanese hops.",
    colors: ["#f4f1e8", "#e8352a", "#121212"],
    bg: "#e8352a",
  },
  {
    id: "shocktown",
    hl: "#22d3ee",
    name: "Shocktown",
    style: "American IPA",
    notes: "Big pine, bright citrus and a bitter bite that wakes you up.",
    colors: ["#22d3ee", "#e4ff1a", "#121212"],
    bg: "#123c69",
  },
  {
    id: "pastry",
    hl: "#ffb347",
    name: "Pastry Stout",
    style: "Pastry Stout",
    notes: "Super indulgent, with big notes of chocolate, vanilla and coffee. Dessert in a glass.",
    colors: ["#3b2418", "#ffb347", "#f4f1e8"],
    bg: "#2a1a12",
  },
  {
    id: "whitenoise",
    hl: "#c4b5fd",
    name: "White Noise",
    style: "Witbier",
    notes: "Soft wheat, orange peel and coriander. Turn the volume down.",
    colors: ["#ffffff", "#8b5cf6", "#121212"],
    bg: "#8b5cf6",
  },
  {
    id: "bandido",
    hl: "#fde047",
    name: "El Bandido",
    style: "Mexican Lager",
    notes: "Light, crisp and made for squeezing a lime into.",
    colors: ["#16a34a", "#fde047", "#f4f1e8"],
    bg: "#0f5132",
  },
  {
    id: "guns",
    hl: "#ff2e88",
    name: "Guns For Hands",
    style: "American IPA",
    notes: "Resinous, dank and loud. Hops first, questions later.",
    colors: ["#ff2e88", "#121212", "#121212"],
    bg: "#ff2e88",
  },
];

// Extra cans used elsewhere on the page (not in the beer wall)
const EXTRA_CANS = {
  pablos: { id: "pablos", name: "Los Pablos", style: "Mexican Lager · Simba collab", colors: ["#fde047", "#e8352a", "#121212"] },
};

/* ---------- small seeded random so every can looks the same on each load ---------- */
function seeded(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/* ---------- spray-paint splat path ---------- */
function splatPath(cx, cy, r, rand, spikes = 14) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2;
    const rr = i % 2 ? r * (0.55 + rand() * 0.25) : r * (0.85 + rand() * 0.5);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return "M" + pts.map((p) => p.map((n) => n.toFixed(1)).join(" ")).join("L") + "Z";
}

/* ---------- draw a can as inline SVG ---------- */
function canSVG(beer) {
  if (beer.image) return `<img src="${beer.image}" alt="${beer.name} can" class="can-img">`;

  const [label, accent, ink] = beer.colors;
  const rand = seeded(beer.id);
  const uid = beer.id + Math.floor(Math.random() * 1e6);

  // random graffiti blobs + drips on the label
  let blobs = "";
  for (let i = 0; i < 4; i++) {
    blobs += `<path d="${splatPath(20 + rand() * 160, 70 + rand() * 250, 16 + rand() * 26, rand)}" fill="${accent}" opacity="${0.75 + rand() * 0.25}"/>`;
  }
  for (let i = 0; i < 9; i++) {
    blobs += `<circle cx="${(15 + rand() * 170).toFixed(1)}" cy="${(60 + rand() * 270).toFixed(1)}" r="${(1.5 + rand() * 4).toFixed(1)}" fill="${accent}"/>`;
  }
  let drips = "";
  for (let x = 14; x < 190; x += 14 + rand() * 12) {
    const len = 8 + rand() * 40;
    drips += `<rect x="${x.toFixed(1)}" y="56" width="${(3 + rand() * 4).toFixed(1)}" height="${len.toFixed(1)}" rx="3" fill="${accent}"/>`;
  }

  const name = beer.name.toUpperCase();
  const fontSize = name.length > 5 ? 34 : 50;
  // long names get squeezed to fit the can instead of being cut off
  const fit = name.length > 5 ? `textLength="${Math.min(160, name.length * 22)}" lengthAdjust="spacingAndGlyphs"` : "";

  return `
<svg class="can-svg" viewBox="0 0 200 380" role="img" aria-label="${beer.name} can">
  <defs>
    <linearGradient id="m${uid}" x1="0" x2="1">
      <stop offset="0" stop-color="#6b6b6b"/><stop offset=".25" stop-color="#e9e9e9"/>
      <stop offset=".55" stop-color="#9a9a9a"/><stop offset=".85" stop-color="#f2f2f2"/><stop offset="1" stop-color="#5a5a5a"/>
    </linearGradient>
    <linearGradient id="s${uid}" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".18" stop-color="#fff" stop-opacity=".28"/>
      <stop offset=".32" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity=".05"/>
      <stop offset=".88" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".5"/>
    </linearGradient>
    <clipPath id="c${uid}"><rect x="8" y="40" width="184" height="304" rx="10"/></clipPath>
  </defs>
  <!-- lid -->
  <path d="M30 18 Q100 4 170 18 L184 40 H16 Z" fill="url(#m${uid})"/>
  <ellipse cx="100" cy="18" rx="70" ry="9" fill="#cfcfcf" stroke="#8a8a8a"/>
  <!-- body -->
  <g clip-path="url(#c${uid})">
    <rect x="8" y="40" width="184" height="304" fill="${label}"/>
    ${blobs}
    <rect x="8" y="40" width="184" height="18" fill="${ink}"/>
    ${drips}
    <text x="100" y="53" text-anchor="middle" font-family="Saira Stencil One, Impact, sans-serif" font-size="12" letter-spacing="3" fill="${label}">ROLLING MILLS</text>
    <text x="100" y="205" text-anchor="middle" font-family="Permanent Marker, Impact, sans-serif" font-size="${fontSize}" ${fit} fill="${ink}" transform="rotate(-8 100 200)" stroke="${label}" stroke-width="1.5" paint-order="stroke">${name}</text>
    <rect x="8" y="300" width="184" height="44" fill="${ink}"/>
    <text x="100" y="327" text-anchor="middle" font-family="Space Grotesk, Arial, sans-serif" font-weight="700" font-size="11" letter-spacing="2" fill="${label}">${beer.style.toUpperCase()}</text>
    <rect x="8" y="40" width="184" height="304" fill="url(#s${uid})"/>
  </g>
  <!-- base -->
  <path d="M16 344 H184 L170 368 Q100 380 30 368 Z" fill="url(#m${uid})"/>
</svg>`;
}

/* ---------- render cans + beer wall ---------- */
function renderBeers() {
  const all = Object.fromEntries([...BEERS, ...Object.values(EXTRA_CANS)].map((b) => [b.id, b]));

  // every element with data-can="id" gets that can drawn into it
  document.querySelectorAll("[data-can]").forEach((el) => {
    const beer = all[el.dataset.can];
    if (beer) el.innerHTML = canSVG(beer);
  });

  // horizontal beer wall
  const track = document.getElementById("beers-track");
  if (!track) return;
  track.insertAdjacentHTML("beforeend", BEERS.map(
    (b, i) => `
    <article class="beer-panel" style="--bg:${b.bg};--hl:${b.hl}">
      <div class="beer-bigword" aria-hidden="true">${b.style.split(" ").pop().toUpperCase()}</div>
      <div class="beer-can">${canSVG(b)}</div>
      <div class="beer-info">
        <span class="beer-num">${String(i + 1).padStart(2, "0")}</span>
        <h3>${b.name}</h3>
        <p class="beer-style">${b.style}${b.abv ? " · " + b.abv : ""}</p>
        <p>${b.notes}</p>
      </div>
    </article>`
  ).join(""));
}

renderBeers();

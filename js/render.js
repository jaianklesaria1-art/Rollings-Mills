/* =========================================================
   RENDERING: draws cans, graffiti tags, tap list, menu, events
   (reads from js/data.js)
   ========================================================= */

const BEER_BY_ID = Object.fromEntries(BEERS.map((b) => [b.id, b]));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- seeded random so the art is the same on every load ---------- */
function seeded(str) {
  let h = 2166136261;
  for (const c of String(str)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function splatPath(cx, cy, r, rand, spikes = 14) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2;
    const rr = i % 2 ? r * (0.55 + rand() * 0.25) : r * (0.85 + rand() * 0.5);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return "M" + pts.map((p) => p.map((n) => n.toFixed(1)).join(" ")).join("L") + "Z";
}

/* ---------- a can, drawn as SVG ---------- */
let canCount = 0;
function canSVG(beer) {
  if (beer.image) return `<img src="${esc(beer.image)}" alt="${esc(beer.name)} can" class="can-img">`;

  const [label, accent, ink] = beer.colors;
  const rand = seeded(beer.id);
  const uid = beer.id + "-" + canCount++;

  let blobs = "";
  for (let i = 0; i < 4; i++) {
    blobs += `<path d="${splatPath(20 + rand() * 160, 70 + rand() * 250, 16 + rand() * 26, rand)}" fill="${accent}" opacity="${(0.75 + rand() * 0.25).toFixed(2)}"/>`;
  }
  for (let i = 0; i < 9; i++) {
    blobs += `<circle cx="${(15 + rand() * 170).toFixed(1)}" cy="${(60 + rand() * 270).toFixed(1)}" r="${(1.5 + rand() * 4).toFixed(1)}" fill="${accent}"/>`;
  }
  let drips = "";
  for (let x = 14; x < 190; x += 14 + rand() * 12) {
    drips += `<rect x="${x.toFixed(1)}" y="56" width="${(3 + rand() * 4).toFixed(1)}" height="${(8 + rand() * 40).toFixed(1)}" rx="3" fill="${accent}"/>`;
  }

  const name = esc(beer.name.toUpperCase());
  const long = beer.name.length > 5;
  // long names get squeezed to fit the can instead of being cut off
  const fit = long ? `textLength="${Math.min(160, beer.name.length * 22)}" lengthAdjust="spacingAndGlyphs"` : "";

  return `
<svg class="can-svg" viewBox="0 0 200 380" role="img" aria-label="${esc(beer.name)} can">
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
  <path d="M30 18 Q100 4 170 18 L184 40 H16 Z" fill="url(#m${uid})"/>
  <ellipse cx="100" cy="18" rx="70" ry="9" fill="#cfcfcf" stroke="#8a8a8a"/>
  <g clip-path="url(#c${uid})">
    <rect x="8" y="40" width="184" height="304" fill="${label}"/>
    ${blobs}
    <rect x="8" y="40" width="184" height="18" fill="${ink}"/>
    ${drips}
    <text x="100" y="53" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="12" letter-spacing="3" fill="${label}">ROLLING MILLS</text>
    <text x="100" y="205" text-anchor="middle" font-family="Permanent Marker, Impact, sans-serif" font-size="${long ? 34 : 50}" ${fit} fill="${ink}" transform="rotate(-8 100 200)" stroke="${label}" stroke-width="1.5" paint-order="stroke">${name}</text>
    <rect x="8" y="300" width="184" height="44" fill="${ink}"/>
    <text x="100" y="327" text-anchor="middle" font-family="Space Grotesk, Arial, sans-serif" font-weight="700" font-size="11" letter-spacing="2" fill="${label}">${esc(beer.style.toUpperCase())}</text>
    <rect x="8" y="40" width="184" height="304" fill="url(#s${uid})"/>
  </g>
  <path d="M16 344 H184 L170 368 Q100 380 30 368 Z" fill="url(#m${uid})"/>
</svg>`;
}

/* ---------- graffiti tag layers ----------
   Any element with data-tags gets covered in random spray tags.
   data-tags="pink,cyan"  -> colours to use
   data-count="40"        -> how many tags                         */
const TAG_WORDS = [
  "RM", "MILLS", "HOPS", "CHEERS", "BOMBAY", "ANDHERI", "KANDIVALI", "COLD ONE", "IPA", "STOUT",
  "TAPS", "RM CREW", "FRESH", "BREW", "LAZY", "HAZY", "SKOL", "POUR", "NO BORING BEER", "ROLL IT",
  "MALT", "YEAST", "LOUD", "BEER O'CLOCK", "MUMBAI", "TAPROOM", "WET PAINT", "DRINK LOCAL",
];
const TAG_GLYPHS = ["✕", "★", "♛", "➜", "✶", "☠", "♥", "⚡"];
const TAG_COLORS = { pink: "#ff2e88", cyan: "#29e3ff", gold: "#ffc21a", white: "#f5f5f0", red: "#ff2036", lime: "#e4ff1a" };
const TAG_FONTS = ["var(--f-tag)", "var(--f-tag)", "var(--f-marker)", "var(--f-spray)"];

function paintTags(el) {
  const rand = seeded(el.id || el.className || "tags");
  const colors = (el.dataset.tags || "pink,cyan,gold,white").split(",").map((c) => TAG_COLORS[c.trim()] || c.trim());
  const count = Number(el.dataset.count || 34);
  let html = "";
  for (let i = 0; i < count; i++) {
    const glyph = rand() < 0.18;
    const text = glyph ? TAG_GLYPHS[Math.floor(rand() * TAG_GLYPHS.length)] : TAG_WORDS[Math.floor(rand() * TAG_WORDS.length)];
    const color = colors[Math.floor(rand() * colors.length)];
    const size = glyph ? 1.5 + rand() * 3 : 1 + rand() * rand() * 5.5;
    const outline = rand() < 0.25;
    html += `<span style="left:${(rand() * 100).toFixed(1)}%;top:${(rand() * 100).toFixed(1)}%;` +
      `font-family:${TAG_FONTS[Math.floor(rand() * TAG_FONTS.length)]};font-size:${size.toFixed(2)}rem;` +
      `transform:translate(-50%,-50%) rotate(${(rand() * 40 - 20).toFixed(1)}deg);` +
      (outline ? `color:transparent;-webkit-text-stroke:1.5px ${color};` : `color:${color};`) +
      `opacity:${(0.18 + rand() * 0.5).toFixed(2)}">${text}</span>`;
  }
  el.insertAdjacentHTML("afterbegin", html);
}

/* ---------- beer wall (big sideways scroll) ---------- */
function renderBeerWall() {
  const track = document.getElementById("beers-track");
  if (!track) return;
  track.insertAdjacentHTML("beforeend", BEERS.slice(0, WALL_COUNT).map((b, i) => `
    <article class="beer-panel" style="--hl:${b.hl}">
      <div class="panel-tags" data-tags="${i % 2 ? "cyan,white" : "pink,gold"}" data-count="18" id="pt-${b.id}" aria-hidden="true"></div>
      <div class="beer-bigword" aria-hidden="true">${esc(b.name.split(" ")[0].toUpperCase())}</div>
      <div class="beer-can">${canSVG(b)}</div>
      <div class="beer-info">
        <span class="beer-num">tap ${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(b.name)}</h3>
        <p class="beer-style">${esc(b.style)}${b.abv ? " · " + esc(b.abv) : ""}</p>
        <p>${esc(b.notes)}</p>
      </div>
    </article>`).join(""));
}

/* ---------- full tap list (quick-scan board with filters) ---------- */
function renderTapList() {
  const list = document.getElementById("tap-list");
  if (!list) return;
  const pairs = {};
  FOOD.forEach((f) => (pairs[f.pair] = pairs[f.pair] || f.name));
  list.innerHTML = BEERS.map((b, i) => `
    <li class="tap-row" data-type="${esc(b.type)}" style="--hl:${b.hl}">
      <span class="tap-no">${String(i + 1).padStart(2, "0")}</span>
      <div class="tap-can">${canSVG(b)}</div>
      <div class="tap-main">
        <h3>${esc(b.name)}</h3>
        <p class="tap-style">${esc(b.style)}${b.abv ? ` <span class="abv">${esc(b.abv)}</span>` : ""}</p>
        <p class="tap-notes">${esc(b.notes)}</p>
      </div>
      ${pairs[b.id] ? `<p class="tap-pair"><span>pairs with</span>${esc(pairs[b.id])}</p>` : "<span></span>"}
    </li>`).join("");
}

/* ---------- food menu (poster collage) ---------- */
const POSTER_STYLES = ["p-red", "p-gold", "p-cyan", "p-paper", "p-pink", "p-black"];
function renderFood() {
  const grid = document.getElementById("food-grid");
  if (!grid) return;
  grid.innerHTML = FOOD.map((f, i) => {
    const beer = BEER_BY_ID[f.pair];
    return `
    <article class="poster food-card ${POSTER_STYLES[i % POSTER_STYLES.length]}" data-cat="${esc(f.cat)}" data-veg="${f.veg}">
      <span class="poster-kicker">${esc(f.cat)} · ${String(i + 1).padStart(3, "0")}</span>
      <h3>${esc(f.name)}</h3>
      <p>${esc(f.desc)}</p>
      <div class="food-foot">
        <span class="diet ${f.veg ? "veg" : "nonveg"}" title="${f.veg ? "Vegetarian" : "Non-vegetarian"}"><i></i>${f.veg ? "Veg" : "Non-veg"}</span>
        ${beer ? `<span class="pairs">🍺 ${esc(beer.name)}</span>` : ""}
      </div>
    </article>`;
  }).join("");
}

/* ---------- events (upcoming only, weekly ones expanded) ---------- */
function upcomingEvents(limit = 8, weeksAhead = 5) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const out = [];
  EVENTS.forEach((e) => {
    if (e.date) {
      const d = new Date(e.date + "T00:00:00");
      if (d >= today) out.push({ ...e, day: d });
    } else if (e.weekly !== undefined) {
      for (let i = 0; i < weeksAhead * 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        if (d.getDay() === e.weekly) out.push({ ...e, day: d });
      }
    }
  });
  return out.sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)).slice(0, limit);
}

const fmtTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
};

function renderEvents() {
  const wall = document.getElementById("event-wall");
  if (!wall) return;
  const events = upcomingEvents();
  if (!events.length) {
    wall.innerHTML = `<p class="empty">New events are being sprayed up. Check <a href="${CONTACT.instagram}" target="_blank" rel="noopener">our Instagram</a>.</p>`;
    return;
  }
  wall.innerHTML = events.map((e, i) => {
    const d = e.day;
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const rsvp = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi Rolling Mills! I'd like to RSVP for "${e.title}" on ${d.toDateString()}.`)}`;
    return `
    <article class="gig ${["g-red", "g-gold", "g-white", "g-pink"][i % 4]}" data-type="${esc(e.type)}">
      <div class="gig-date">
        <span class="gig-dow">${d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
        <span class="gig-day">${d.getDate()}</span>
        <span class="gig-mon">${d.toLocaleDateString("en-IN", { month: "short" })}</span>
      </div>
      <div class="gig-body">
        <span class="gig-type">${esc(e.type)}${e.weekly !== undefined ? " · weekly" : ""}</span>
        <h3>${esc(e.title)}</h3>
        <p class="gig-time">${fmtTime(e.time)}${e.end ? " – " + fmtTime(e.end) : ""}</p>
        <p>${esc(e.desc)}</p>
        <div class="gig-actions">
          <a class="btn btn-small btn-spray" href="${rsvp}" target="_blank" rel="noopener">RSVP</a>
          <button class="btn btn-small btn-ghost" data-ics="${i}" type="button">+ Calendar</button>
        </div>
      </div>
    </article>`;
  }).join("");
  wall._events = events.map((e) => ({ ...e }));
}

/* ---------- "tonight at the mill" strip ---------- */
function renderTonight() {
  const el = document.getElementById("tonight-event");
  if (!el) return;
  const today = new Date().toDateString();
  const ev = upcomingEvents(20).find((e) => e.day.toDateString() === today);
  el.innerHTML = ev
    ? `<strong>${esc(ev.title)}</strong> from ${fmtTime(ev.time)}`
    : `No event tonight. Just good beer. <a href="#events">See what's coming →</a>`;
  ["tap-count", "perk-taps"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = BEERS.length;
  });
}

/* ---------- run ---------- */
document.querySelectorAll("[data-can]").forEach((el) => {
  const beer = BEER_BY_ID[el.dataset.can];
  if (beer) el.innerHTML = canSVG(beer);
});
renderBeerWall();
renderTapList();
renderFood();
renderEvents();
renderTonight();
document.querySelectorAll("[data-tags]").forEach(paintTags);

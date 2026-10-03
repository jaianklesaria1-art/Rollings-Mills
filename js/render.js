/* =========================================================
   RENDERING: builds the tap list, menu and events from js/data.js
   ========================================================= */

const BEER_BY_ID = Object.fromEntries(BEERS.map((b) => [b.id, b]));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const fmtTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
};

/* ---------- on tap ---------- */
function renderTaps() {
  const list = document.getElementById("tap-list");
  if (!list) return;
  const pairs = {};
  FOOD.forEach((f) => (pairs[f.pair] = pairs[f.pair] || f.name));
  list.innerHTML = BEERS.map((b, i) => `
    <li class="tap" data-type="${esc(b.type)}" style="--tap:${b.hl}">
      <span class="tap-no">${String(i + 1).padStart(2, "0")}</span>
      <div class="tap-main">
        <h3 class="tap-name">${esc(b.name)}</h3>
        <p class="tap-style">${esc(b.style)}</p>
      </div>
      <p class="tap-notes">${esc(b.notes)}</p>
      <div class="tap-meta">
        <span class="tap-abv">${b.abv ? esc(b.abv) : "ABV at the bar"}</span>
        ${pairs[b.id] ? `<span class="tap-pair">Pairs with ${esc(pairs[b.id])}</span>` : ""}
      </div>
    </li>`).join("");
}

/* ---------- food menu ---------- */
function renderFood() {
  const grid = document.getElementById("food-grid");
  if (!grid) return;
  grid.innerHTML = FOOD.map((f) => {
    const beer = BEER_BY_ID[f.pair];
    return `
    <article class="dish" data-cat="${esc(f.cat)}" data-veg="${f.veg}">
      <div class="dish-head">
        <span class="diet ${f.veg ? "veg" : "nonveg"}" role="img" aria-label="${f.veg ? "Vegetarian" : "Non-vegetarian"}"><i></i></span>
        <h3>${esc(f.name)}</h3>
        <span class="dish-cat">${esc(f.cat)}</span>
      </div>
      <p>${esc(f.desc)}</p>
      ${beer ? `<p class="dish-pair">Pour with <b>${esc(beer.name)}</b></p>` : ""}
    </article>`;
  }).join("");
}

/* ---------- events (upcoming only, weekly ones expanded) ---------- */
function upcomingEvents(limit = 6, weeksAhead = 5) {
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

function renderEvents() {
  const wall = document.getElementById("event-wall");
  if (!wall) return;
  const events = upcomingEvents();
  if (!events.length) {
    wall.innerHTML = `<p class="empty">New nights are being planned. Follow <a href="${CONTACT.instagram}" target="_blank" rel="noopener">@rollingmillsbrewery</a> for the next one.</p>`;
    return;
  }
  wall.innerHTML = events.map((e, i) => {
    const d = e.day;
    const rsvp = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi Rolling Mills! I'd like to RSVP for "${e.title}" on ${d.toDateString()}.`)}`;
    return `
    <article class="event" data-type="${esc(e.type)}">
      <div class="event-date">
        <span class="event-mon">${d.toLocaleDateString("en-IN", { month: "short" })}</span>
        <span class="event-day">${d.getDate()}</span>
        <span class="event-dow">${d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
      </div>
      <div class="event-body">
        <p class="event-type">${esc(e.type)}${e.weekly !== undefined ? " · Every week" : ""} · ${fmtTime(e.time)}${e.end ? "–" + fmtTime(e.end) : ""}</p>
        <h3>${esc(e.title)}</h3>
        <p>${esc(e.desc)}</p>
      </div>
      <div class="event-actions">
        <a class="btn btn-small btn-spray" href="${rsvp}" target="_blank" rel="noopener">RSVP</a>
        <button class="btn btn-small btn-ghost" data-ics="${i}" type="button" aria-label="Add ${esc(e.title)} to calendar">+ Calendar</button>
      </div>
    </article>`;
  }).join("");
  wall._events = events.map((e) => ({ ...e }));
}

/* ---------- tonight line in the taproom section ---------- */
function renderTonight() {
  const el = document.getElementById("tonight-event");
  if (!el) return;
  const today = new Date().toDateString();
  const ev = upcomingEvents(20).find((e) => e.day.toDateString() === today);
  el.innerHTML = ev ? `<b>${esc(ev.title)}</b> from ${fmtTime(ev.time)}` : `No event tonight. Just good beer.`;
  document.querySelectorAll("[data-tap-count]").forEach((n) => (n.textContent = BEERS.length));
}

/* ---------- subtle graffiti accents ---------- */
// Any element with data-tags gets a few faint hand-written tags (decoration only).
const TAG_WORDS = ["RM", "MILLS", "CHEERS", "BOMBAY", "FRESH", "TAPS", "RM CREW", "HOPS", "POUR", "LOCAL"];
function paintTags(el) {
  let h = 2166136261;
  for (const c of el.id || "tags") h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rand = () => ((h = Math.imul(h ^ (h >>> 13), 2246822507)) >>> 0) / 4294967296;
  const count = Number(el.dataset.count || 10);
  let html = "";
  for (let i = 0; i < count; i++) {
    html += `<span style="left:${(rand() * 100).toFixed(1)}%;top:${(rand() * 100).toFixed(1)}%;font-size:${(1.2 + rand() * 3.2).toFixed(2)}rem;transform:translate(-50%,-50%) rotate(${(rand() * 24 - 12).toFixed(1)}deg)">${TAG_WORDS[Math.floor(rand() * TAG_WORDS.length)]}</span>`;
  }
  el.innerHTML = html;
}


/* ---------- tap takeover: fills in the details for one beer ---------- */
const POUR_BEERS = BEERS.slice(0, 7);
function pourInfo(i) {
  const b = POUR_BEERS[i];
  if (!b || !document.getElementById("pour-name")) return;
  const pair = FOOD.find((f) => f.pair === b.id);
  document.getElementById("pour-n").textContent = String(i + 1).padStart(2, "0");
  document.getElementById("pour-name").textContent = b.name;
  document.getElementById("pour-word").textContent = b.name;
  document.getElementById("pour-style").textContent = b.style + (b.abv ? " · " + b.abv : "");
  document.getElementById("pour-notes").textContent = b.notes;
  document.getElementById("pour-pair").textContent = pair ? "Pairs with " + pair.name : "";
  document.querySelectorAll("#pour-dots i").forEach((d, k) => d.classList.toggle("on", k === i));
}
function pourColours(i) {
  const [top, bot, foam, haze] = POUR_BEERS[i].pour || ["#f2b544", "#d0801c", "#fff6e3", 0];
  return { top, bot, foam, haze: 0.04 + haze * 0.3 };
}
function setupPour() {
  const total = document.getElementById("pour-total");
  if (!total) return;
  total.textContent = String(POUR_BEERS.length).padStart(2, "0");
  document.getElementById("pour-dots").innerHTML = POUR_BEERS.map(() => "<i></i>").join("");
  pourInfo(0);
  const c = pourColours(0);
  document.getElementById("liq-top").setAttribute("stop-color", c.top);
  document.getElementById("liq-bot").setAttribute("stop-color", c.bot);
}

setupPour();
renderTaps();
renderFood();
renderEvents();
renderTonight();
document.querySelectorAll("[data-tags]").forEach(paintTags);

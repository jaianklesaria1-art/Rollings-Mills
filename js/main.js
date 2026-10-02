/* =========================================================
   INTERACTIONS: age gate, nav, open status, filters,
   calendar files, WhatsApp booking, spray wall
   ========================================================= */

const refreshScroll = () => window.ScrollTrigger && ScrollTrigger.refresh();

// ---------- age gate ----------
const gate = document.getElementById("age-gate");
const AGE_KEY = "rm-age-ok";
function unlock() {
  gate.classList.add("hidden");
  document.body.classList.remove("is-locked");
  refreshScroll();
}
try { if (localStorage.getItem(AGE_KEY) === "1") unlock(); } catch (e) {}
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
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- open / closed (Mumbai time) ----------
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
function mumbaiNow() {
  const d = new Date();
  return new Date(d.getTime() + (d.getTimezoneOffset() + 330) * 60000); // IST = UTC+5:30
}
function updateOpenStatus() {
  const chip = document.getElementById("open-status");
  if (!chip) return;
  const now = mumbaiNow();
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = mins >= toMin(HOURS.open) && mins < toMin(HOURS.close);
  chip.classList.toggle("open", open);
  chip.classList.toggle("closed", !open);
  chip.textContent = open ? `Open now · till ${fmtTime(HOURS.close)}` : `Closed · opens ${fmtTime(HOURS.open)}`;
}
updateOpenStatus();
setInterval(updateOpenStatus, 60000);

// ---------- filter chips (tap list, food, events) ----------
const vegOnly = document.getElementById("veg-only");
function applyFilter(group) {
  const target = document.getElementById(group.dataset.filter);
  const attr = group.dataset.attr || "type";
  const value = group.querySelector(".chip.is-on").dataset.value;
  [...target.children].forEach((item) => {
    let show = value === "all" || item.dataset[attr] === value;
    if (target.id === "food-grid" && vegOnly.checked) show = show && item.dataset.veg === "true";
    item.classList.toggle("is-hidden", !show);
  });
  refreshScroll();
}
document.querySelectorAll(".chips[data-filter]").forEach((group) => {
  group.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    group.querySelectorAll(".chip").forEach((c) => {
      c.classList.toggle("is-on", c === chip);
      c.setAttribute("aria-pressed", String(c === chip));
    });
    applyFilter(group);
  });
});
vegOnly.addEventListener("change", () => applyFilter(document.querySelector('[data-filter="food-grid"]')));

// ---------- add-to-calendar (.ics download) ----------
function icsDate(day, time) {
  const [h, m] = time.split(":").map(Number);
  const utc = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), h, m) - 330 * 60000);
  return utc.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
document.getElementById("event-wall").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-ics]");
  if (!btn) return;
  const ev = e.currentTarget._events[Number(btn.dataset.ics)];
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rolling Mills//Events//EN", "BEGIN:VEVENT",
    `UID:${icsDate(ev.day, ev.time)}-${ev.title.replace(/\W+/g, "")}@rollingmills`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART:${icsDate(ev.day, ev.time)}`,
    `DTEND:${icsDate(ev.day, ev.end || ev.time)}`,
    `SUMMARY:${ev.title} @ Rolling Mills`,
    `DESCRIPTION:${ev.desc.replace(/[,;]/g, "\\$&")}`,
    "LOCATION:Rolling Mills Craft Beer Dispensary\\, New Link Road\\, Andheri West\\, Mumbai",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = ev.title.replace(/\W+/g, "-").toLowerCase() + ".ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

// ---------- booking → WhatsApp ----------
const form = document.getElementById("book");
const bDate = document.getElementById("b-date");
const bTime = document.getElementById("b-time");
const bGuests = document.getElementById("b-guests");
const bStatus = document.getElementById("book-status");

const todayISO = (() => { const n = mumbaiNow(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`; })();
bDate.min = todayISO;
bDate.value = todayISO;

function fillTimes() {
  // half-hour slots from opening until an hour before closing; past slots hidden for today
  const now = mumbaiNow();
  const nowMin = bDate.value === todayISO ? now.getHours() * 60 + now.getMinutes() : -1;
  const slots = [];
  for (let m = toMin(HOURS.open); m <= toMin(HOURS.close) - 60; m += 30) {
    if (m > nowMin) slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  bTime.innerHTML = slots.length
    ? slots.map((s) => `<option value="${s}" ${s === "20:00" ? "selected" : ""}>${fmtTime(s)}</option>`).join("")
    : `<option value="">No slots left today</option>`;
}
fillTimes();
bDate.addEventListener("change", fillTimes);

form.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => {
  bGuests.value = Math.min(40, Math.max(1, Number(bGuests.value || 1) + Number(b.dataset.step)));
}));

document.getElementById("private-cta").addEventListener("click", () => {
  document.getElementById("b-occasion").value = "Private party";
  bGuests.value = Math.max(Number(bGuests.value), 15);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const valid = input.value.trim() !== "";
    input.closest(".field").classList.toggle("invalid", !valid);
    ok = ok && valid;
  });
  if (!ok) {
    bStatus.textContent = "Fill in your name, date and time.";
    bStatus.className = "form-status error";
    return;
  }
  const data = new FormData(form);
  const when = new Date(data.get("date") + "T00:00:00").toDateString();
  const msg = `Hi Rolling Mills! I'd like to book a table.\n` +
    `Name: ${data.get("name")}\nDate: ${when}\nTime: ${fmtTime(data.get("time"))}\nGuests: ${data.get("guests")}` +
    (data.get("occasion") ? `\nOccasion: ${data.get("occasion")}` : "");
  window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  bStatus.textContent = "Opening WhatsApp… send the message and we'll confirm.";
  bStatus.className = "form-status ok";
});

// ---------- spray wall ----------
(function sprayWall() {
  const canvas = document.getElementById("spray-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let color = "#ff2e88";
  let spraying = false;
  let last = null;
  const drips = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const old = canvas.width ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (old) ctx.putImageData(old, 0, 0);
  }
  resize();
  addEventListener("resize", resize);

  function puff(x, y) {
    const radius = 22;
    ctx.fillStyle = color;
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.6) * radius;
      ctx.globalAlpha = 0.08 + Math.random() * 0.25;
      ctx.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r, 1.6, 1.6);
    }
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // linger too long in one spot and the paint drips
    if (Math.random() < 0.02) drips.push({ x: x + (Math.random() - 0.5) * 10, y, len: 20 + Math.random() * 70, c: color });
  }

  function animateDrips() {
    for (let i = drips.length - 1; i >= 0; i--) {
      const d = drips[i];
      ctx.fillStyle = d.c;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(d.x, d.y, 3, 2);
      d.y += 1.2;
      d.len -= 1.2;
      if (d.len <= 0) {
        ctx.beginPath(); ctx.arc(d.x + 1.5, d.y, 3, 0, Math.PI * 2); ctx.fill();
        drips.splice(i, 1);
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateDrips);
  }
  animateDrips();

  const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  canvas.addEventListener("pointerdown", (e) => { spraying = true; last = pos(e); puff(last.x, last.y); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => {
    if (!spraying) return;
    const p = pos(e);
    const dist = Math.hypot(p.x - last.x, p.y - last.y);
    const steps = Math.max(1, Math.floor(dist / 6));
    for (let i = 1; i <= steps; i++) puff(last.x + ((p.x - last.x) * i) / steps, last.y + ((p.y - last.y) * i) / steps);
    last = p;
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((t) => canvas.addEventListener(t, () => (spraying = false)));

  document.querySelectorAll(".can-btn").forEach((b) => b.addEventListener("click", () => {
    color = b.dataset.color;
    document.querySelectorAll(".can-btn").forEach((x) => x.classList.toggle("is-on", x === b));
  }));
  document.getElementById("spray-clear").addEventListener("click", () => { drips.length = 0; ctx.clearRect(0, 0, canvas.width, canvas.height); });
  document.getElementById("spray-save").addEventListener("click", () => {
    // put the brick-wall colour behind the paint so the saved image isn't transparent
    const out = document.createElement("canvas");
    out.width = canvas.width; out.height = canvas.height;
    const o = out.getContext("2d");
    o.fillStyle = "#18181c"; o.fillRect(0, 0, out.width, out.height);
    o.drawImage(canvas, 0, 0);
    o.font = `${28 * (out.width / canvas.clientWidth)}px "Sedgwick Ave Display", cursive`;
    o.fillStyle = "#ffc21a";
    o.fillText("@rollingmillsbrewery", 20, out.height - 24);
    const a = document.createElement("a");
    a.href = out.toDataURL("image/png");
    a.download = "my-rolling-mills-tag.png";
    a.click();
  });
})();

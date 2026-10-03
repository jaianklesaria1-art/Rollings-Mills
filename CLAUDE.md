# Rolling Mills website: project memory

Read this first. It records what's been built, why, and what's still open, so a new session can pick up where the last one stopped.

## The client
- **Rolling Mills Brewery**: an independent craft brewery and taproom in Mumbai, India. Instagram: @rollingmillsbrewery.
- Brewhouse: 146-BCD, Govt. Industrial Estate, Charkop Road, Kandivali West, Mumbai 400067.
- Taproom ("Craft Beer Dispensary"): Shop No. 20, Meera Co-Op, New Link Road, Oshiwara, Andheri West, Mumbai 400053.
- Facts confirmed from public sources: LLP incorporated Nov 2020, brewery founded 2021, Los Pablos (a Mexican lager collab with Simba) launched in Goa in Apr 2025.
- From public listings, **not yet confirmed by the user**: phone/WhatsApp +91 74004 07711, hours 10 AM – 10:30 PM daily.
- Real beer names (from Untappd/search): Lazy (NEIPA, 6%), Kura Kura, Shocktown, Guns For Hands, Sip Your Greens, Pastry Stout, Social Cues, White Noise, El Bandido, Schwarzbrot, Sausage Pretzel, Slippery When Wet, Time Theorists. Only Lazy's ABV and hops are sourced; the other tasting notes were written by Claude.

## What the user wants (design direction), updated Oct 3 2026
- **REDESIGNED.** The user rejected the neon-pink graffiti version as cheap/cartoonish, too busy, too long, the wrong colours and too beer-focused. They chose **"Real Beer Zombies style"**: photo/video-led and dark, big headlines, few sections, a clean layout, graffiti only as accents, built around real photos.
- **The focus is the TAPROOM** (the place, the experience, food and events), not just the beers.
- **Palette:** black `#0b0b0b`, bone `#f2eee6`, brewhouse-sign gold `#e9b44c` (deep gold `#9a6a12` on light backgrounds). No neon pink or cyan. Sections alternate dark and light.
- **Type:** Anton (all headings, uppercase) + one Permanent Marker gold "brush" accent phrase per heading (`.brush`); Space Grotesk body; Space Mono for labels, buttons, chips and nav.
- **Theme is still graffiti + warehouse**, but done with real textures inside the palette: concrete (`.concrete`), whitewashed brick (`.brick`), stencilled warehouse floor numbers (`data-num` → `::after`, font Big Shoulders Stencil Display), hazard-tape dividers (`.hazard`), gold spray accents with overspray and drips (`.brush`), and faint sprayed wall tags.
- **No drawn cans, splats, stickers, 3D alley or cartoon tap-pour.** Use real photos; `assets/video/hero-pour.mp4` (if added) replaces the hero photo.
- Reference site: thebeerzombies.com. Copy its layout and feel, never its copy, footage or green branding.
- The user loves the **"Leave your tag" spray wall** (kept, recoloured gold, bone, red and blue).
- 21st.dev Magic MCP was requested but is unavailable (not connected; 21st.dev is blocked by the sandbox network). To use it: allow `21st.dev` and `magic.21st.dev` in the network settings, add the key as the `TWENTY_FIRST_API_KEY` environment variable, and port the React components to static HTML/CSS.

## What's built (branch `claude/ecstatic-franklin-mdzb7c`)
Static site with no build step. GSAP + ScrollTrigger are bundled in `js/vendor/`.

**index.html, in order:** age gate → hero (full-bleed brewhouse photo, "Your local taproom / brewed in Mumbai", live open/closed chip, buttons, mono ticker) → **The Taproom** (photo + "Pull up a stool", facts grid, tonight card) → **Tap takeover** (`#taps`, pinned beer scroll: a realistic SVG pint refills in each beer's colour from `BEERS[].pour`, the beer name is sprayed on the wall behind, details and progress dots update; first 7 beers) → **Full tap list** (`#tap-board`, clean list, style filters, pairings) → **Food** (two-column menu, category chips, veg toggle) → **Events** (date rows, RSVP via WhatsApp, .ics, private-party box `#private-cta`) → **Story teaser** (tilted B&W photo, Est. 21 badge, link to story.html) → **Visit** (taproom and brewhouse cards + WhatsApp booking form `#book`) → **Leave your tag** → Join → footer → mobile action bar.

**story.html:** hero "Forged in the Mill", "Before the first pour", photo band "Crew owned. Crew operated.", scroll-filled timeline (`TIMELINE`), reviews (`REVIEWS`, CTA when empty), an Instagram strip (photos + text tiles), Join.

**Files:** `js/data.js` (content), `js/render.js` (taps, menu, events, tonight, faint tags; no can art any more), `js/main.js` (shared UI: age gate, nav, open status, filters, .ics, booking, spray wall, progress line, scramble, active nav), `js/scroll.js` (subtle home motion), `js/story.js`, `css/styles.css` (one stylesheet for both pages).

## Rules we've followed. Keep them.
- **Never fabricate reviews, ratings or customer quotes.** `REVIEWS` stays empty until the user gives real ones.
- FOOD and EVENTS in data.js are **samples** and must be replaced with the real menu and events. Prices were never added.
- Don't reuse reference-site footage, copy or artwork. Recreate the layout and motion in our own words and colours.
- Don't publish the site as a hosted artifact, since it uses a real business's branding. Send zips or single-file bundles instead.
- Verify every change in headless Chromium at 1366×800 and 390×844 (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`). Load Google Fonts through Node fetch with `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`.
- The sandbox network blocks most outside sites (instagram, thebeerzombies, awwwards, …). The user can allow domains in the environment settings.

## Open items / waiting on the user
1. Real photos: taproom/bar (last collage slot), crew, pints, food, real graffiti walls.
2. A real pour video, `assets/video/hero-pour.mp4` (10–20 s, landscape, MP4).
3. Confirm the phone/WhatsApp number, the hours, the "21+" age, "beer to go", and the "crew owned & operated" wording.
4. Timeline dates for "Early days" (first beers in bars) and "Andheri W" (dispensary opening).
5. The real food menu, events, beer ABVs and notes, plus real reviews.
6. Optional: deploy via GitHub Pages; spray-wall upgrades (stencils, branded save image, undo, shared wall).

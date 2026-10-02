# Rolling Mills website: project memory

Read this first. It records what's been built, why, and what's still open, so a new session can pick up where the last one stopped.

## The client
- **Rolling Mills Brewery**: an independent craft brewery and taproom in Mumbai, India. Instagram: @rollingmillsbrewery.
- Brewhouse: 146-BCD, Govt. Industrial Estate, Charkop Road, Kandivali West, Mumbai 400067.
- Taproom ("Craft Beer Dispensary"): Shop No. 20, Meera Co-Op, New Link Road, Oshiwara, Andheri West, Mumbai 400053.
- Facts confirmed from public sources: LLP incorporated Nov 2020, brewery founded 2021, Los Pablos (a Mexican lager collab with Simba) launched in Goa in Apr 2025.
- From public listings, **not yet confirmed by the user**: phone/WhatsApp +91 74004 07711, hours 10 AM – 10:30 PM daily.
- Real beer names (from Untappd/search): Lazy (NEIPA, 6%), Kura Kura, Shocktown, Guns For Hands, Sip Your Greens, Pastry Stout, Social Cues, White Noise, El Bandido, Schwarzbrot, Sausage Pretzel, Slippery When Wet, Time Theorists. Only Lazy's ABV and hops are sourced; the other tasting notes were written by Claude.

## What the user wants (design direction)
- Theme: **80% graffiti, 20% warehouse**. Neon pink, cyan and gold tags, spray paint, drips, wheat-paste posters, red pendant lamps, concrete. A dark site.
- It's a **taproom**: tap beers, food and events, with strong UX.
- Main reference site: **thebeerzombies.com** (Beer Zombies, Las Vegas). The user sent screen recordings of its home hero, Our Story page and beer-pour video. We copy the **layout and feel**, never their copy, footage or green branding. Our accent is pink (#ff2e88).
- Early references: two scroll-animation videos (a pinned bottle with huge text behind it, and a horizontal can wall) and five mood images (neon graffiti alley, red neon door, red-lamp concrete corridor, pink drippy poster, poster collage). The mood images are references only and aren't shipped, since some contain copyrighted art.
- The user loves the **"Leave your tag" spray wall**.

## What's built (branch `claude/ecstatic-franklin-mdzb7c`)
Static site with no build step. GSAP + ScrollTrigger are bundled in `js/vendor/`.

**index.html (home), in page order:**
1. Age gate (red neon door, remembered via localStorage).
2. **Alley hero**: a 3D CSS graffiti corridor you walk down on scroll; a red neon door opens at the end. Live open/closed badge (IST).
3. **Brand hero (Beer Zombies style)**: dark brewhouse photo, pink smoke, Permanent Marker headline "NO BORING BEER", Space Mono scramble kicker, buttons, "scroll if you're thirsty", pink ticker, and a header scroll-progress line. A **drawn SVG tap-pour loop** sits on the right. If `assets/video/hero-pour.mp4` exists it plays full-screen instead (`.th.has-video`).
4. **About the taproom**: taped photo collage (2 real brewhouse photos + a taproom placeholder), round "Est. 21" badge, word-by-word blur heading, a perks grid, and a "Dig a little deeper" button linking to story.html.
5. Tonight strip, featured beer (pinned pink poster, MOUTHFEEL sweep), horizontal beer wall, tap list with filters.
6. Food (poster collage, category filter, veg-only toggle), Events (gig posters, filters, WhatsApp RSVP, .ics).
7. The Mill (B&W brewhouse photo backdrop), Visit + WhatsApp booking form, spray wall, footer, mobile bottom action bar.

**story.html (Our Story, Beer Zombies style):** hero "Forged in the Mill", "Before the first pour", photo band "Crew owned. Crew operated.", a scroll-filled timeline (from `TIMELINE`), a reviews wall (from `REVIEWS`; shows a Google review CTA when empty), an Instagram strip, and "Join us".

**Files:** `js/data.js` (all content: BEERS, FOOD, EVENTS, HOURS, CONTACT, TIMELINE, REVIEWS), `js/render.js` (cans, tags, lists), `js/main.js` (shared UI, guarded so it works on both pages), `js/scroll.js` (home animations), `js/story.js`, `css/styles.css`, `assets/photos/` (the user's 2 brewhouse photos), `assets/video/README.txt`.

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

# Rolling Mills Taproom: Website

A one-page site for Rolling Mills, an independent craft brewery and taproom in Mumbai. The look is roughly **80% graffiti and 20% warehouse**: neon tags, spray paint, wheat-paste posters, concrete and red pendant lamps. The scroll animations use [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

There's no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## What's on the page
| Section | What it does |
|---|---|
| Age gate | Red neon door. The visitor's answer is remembered in their browser. |
| Hero: the alley | A 3D graffiti corridor. Scrolling walks you past red lamps until the neon door opens. On desktop, moving the mouse lets you look around. Shows a live "Open now / Closed" badge (Mumbai time). |
| Brand hero | Dark brewhouse photo with drifting neon smoke and a looping animated tap pour (handle pulls, pint fills, glass swaps). Drop a real video at `assets/video/hero-pour.mp4` and it plays full-screen instead. Also: a hand-painted "NO BORING BEER" headline that blurs in, a typewriter-scramble kicker, two buttons, "scroll if you're thirsty" and a pink ticker. A pink line under the header shows scroll progress. |
| About the taproom | "Our story" kicker that scrambles in, heading that blurs in word by word, taped-up photo collage with an Est. 21 badge, the taproom story, and a grid of what you get: taps, kitchen, events, beer to go, hours, 21+. |
| Tonight strip | Hazard tape, plus quick links to Taps / Food / Events. Today's event is shown automatically. |
| Featured beer | Pinned pink-poster section: stats card, "MOUTHFEEL" sweep and tasting-note splats. |
| On tap | A sideways beer wall, then a full **tap list** with style filters and food pairings. |
| Food | Poster-collage menu with category filters, a **veg-only toggle**, veg/non-veg marks and a beer pairing per dish. |
| Events | Gig-poster wall with type filters, **RSVP on WhatsApp** and **add to calendar** (.ics). Past events hide themselves and weekly events repeat on their own. |
| The Mill | Brand story on concrete, with swinging red lamps. |
| Visit + Book | Locations, plus a booking form that opens WhatsApp with the booking already written. |
| Leave your tag | Visitors spray-paint the wall with a mouse or finger and can save their tag as a PNG. |

On phones there's a sticky bottom bar (Taps · Food · Events · Book). People who have "reduce motion" turned on get the same content without the scroll animations.

## Our Story page (`story.html`)
A separate page linked from the menu and the About section's "Dig a little deeper" button: a dark hero ("Forged in the Mill") with a tilted brewhouse photo, a "Before the first pour" intro, a full-width photo band ("Crew owned. Crew operated."), a timeline whose line fills as you scroll, a reviews wall, an Instagram strip and a "Join us" call to action. The timeline and reviews come from `TIMELINE` and `REVIEWS` in `js/data.js`. Only add real reviews; with none, the page shows a "Review us on Google" card.

## Updating content
Almost everything lives in **`js/data.js`**:
- `BEERS`: the tap list and beer wall. Add `image: "assets/cans/name.png"` to use a real can photo.
- `FOOD`: menu items (`veg: true/false`, `pair:` a beer id).
- `EVENTS`: one-off events (`date: "2026-10-31"`) or weekly ones (`weekly: 5` means every Friday).
- `HOURS`, `CONTACT`: opening hours, WhatsApp number, links.

## Adding real photos
In `index.html`, find the `about-photos` block and put an `<img src="assets/photos/your-photo.jpg" alt="...">` inside each `<figure class="snap">`, replacing the `snap-ph` placeholder.

## Files
- `index.html`: page structure
- `css/styles.css`: theme (colours and fonts are variables at the top)
- `js/data.js`: content
- `js/render.js`: draws cans, graffiti tags, tap list, menu and events
- `js/main.js`: age gate, filters, booking, calendar, spray wall
- `js/scroll.js`: scroll animations (home page)
- `story.html` + `js/story.js`: the Our Story page
- `js/vendor/`: GSAP + ScrollTrigger, bundled so the site doesn't depend on a CDN

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
| Tonight strip | Hazard tape, plus quick links to Taps / Food / Events. Today's event is shown automatically. |
| Featured beer | Pinned pink-poster section: stats card, "MOUTHFEEL" sweep and tasting-note splats. |
| On tap | A sideways beer wall, then a full **tap list** with style filters and food pairings. |
| Food | Poster-collage menu with category filters, a **veg-only toggle**, veg/non-veg marks and a beer pairing per dish. |
| Events | Gig-poster wall with type filters, **RSVP on WhatsApp** and **add to calendar** (.ics). Past events hide themselves and weekly events repeat on their own. |
| The Mill | Brand story on concrete, with swinging red lamps. |
| Visit + Book | Locations, plus a booking form that opens WhatsApp with the booking already written. |
| Leave your tag | Visitors spray-paint the wall with a mouse or finger and can save their tag as a PNG. |

On phones there's a sticky bottom bar (Taps · Food · Events · Book). People who have "reduce motion" turned on get the same content without the scroll animations.

## Updating content
Almost everything lives in **`js/data.js`**:
- `BEERS`: the tap list and beer wall. Add `image: "assets/cans/name.png"` to use a real can photo.
- `FOOD`: menu items (`veg: true/false`, `pair:` a beer id).
- `EVENTS`: one-off events (`date: "2026-10-31"`) or weekly ones (`weekly: 5` means every Friday).
- `HOURS`, `CONTACT`: opening hours, WhatsApp number, links.

## Files
- `index.html`: page structure
- `css/styles.css`: theme (colours and fonts are variables at the top)
- `js/data.js`: content
- `js/render.js`: draws cans, graffiti tags, tap list, menu and events
- `js/main.js`: age gate, filters, booking, calendar, spray wall
- `js/scroll.js`: scroll animations
- `js/vendor/`: GSAP + ScrollTrigger, bundled so the site doesn't depend on a CDN

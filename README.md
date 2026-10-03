# Rolling Mills Taproom: Website

Website for Rolling Mills, an independent craft brewery and taproom in Mumbai. Taproom-first, photo-led and dark, with subtle scroll motion from [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

There's no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## What's on the page
**Home (`index.html`):** hero with a live open/closed badge → The Taproom → On tap (filterable) → Food (filterable, veg toggle) → Events (RSVP on WhatsApp, add to calendar) → Our story teaser → Visit + WhatsApp booking → Leave your tag (spray wall) → footer. Phones get a bottom bar (On tap · Food · Events · Book).

**Our Story (`story.html`):** hero, "Before the first pour", photo band, a scroll-filled timeline, reviews, Instagram strip.

Look: black, bone and brewhouse gold; Anton headings with one gold brush accent; real photography. Add a real taproom video at `assets/video/hero-pour.mp4` and it replaces the hero photo.

## Updating content
Almost everything lives in **`js/data.js`**:
- `BEERS`: the tap list and beer wall. Add `image: "assets/cans/name.png"` to use a real can photo.
- `FOOD`: menu items (`veg: true/false`, `pair:` a beer id).
- `EVENTS`: one-off events (`date: "2026-10-31"`) or weekly ones (`weekly: 5` means every Friday).
- `HOURS`, `CONTACT`: opening hours, WhatsApp number, links.

## Adding real photos
Put images in `assets/photos/` and swap the `src` of the hero, taproom or story images in `index.html` / `story.html`. Taproom and bar photos are the most needed.

## Files
- `index.html`: page structure
- `css/styles.css`: theme (colours and fonts are variables at the top)
- `js/data.js`: content
- `js/render.js`: builds the tap list, menu and events
- `js/main.js`: age gate, filters, booking, calendar, spray wall
- `js/scroll.js`: scroll animations (home page)
- `story.html` + `js/story.js`: the Our Story page
- `js/vendor/`: GSAP + ScrollTrigger, bundled so the site doesn't depend on a CDN

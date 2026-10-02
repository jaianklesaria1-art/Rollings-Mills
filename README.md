# Rolling Mills Brewery: Website

A one-page website for Rolling Mills, an independent craft brewery in Mumbai. The look is graffiti and warehouse: brick and concrete walls, corrugated metal, spray paint, stencil type and hazard tape. The scroll animations are built with [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

There's no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Page sections and scroll animations
| Section | What happens on scroll |
|---|---|
| Age gate | Asks whether the visitor is of legal drinking age. The answer is remembered in that browser. |
| Hero | Pinned. "ROLLING" and "MILLS" slide apart while the can spins toward you. |
| Tape strip | Hazard-tape marquee that scrolls on its own. |
| Featured beer (Lazy) | Pinned can with a poster wall behind it. 1) The can straightens and a stats card slides in. 2) "MOUTHFEEL" rolls across and tasting-note paint splats pop in. 3) The can flips and drops away. |
| Beer wall | Scrolling down moves the beers sideways, one coloured brick wall per beer. Cans tilt and info cards slap in. |
| The Mill | Brand story. Stencil lines stamp in and stickers slap onto the corrugated metal. |
| Collab | Los Pablos × Simba. |
| Visit | Dispensary, brewery and phone cards, taped to the wall. |
| Instagram | Big drippy @handle. |

People who have "reduce motion" turned on get the same content without the scroll animations.

## Files
- `index.html` holds the page content
- `css/styles.css` holds the theme. Colours and fonts are variables at the top.
- `js/beers.js` holds **the beer list** (names, styles, notes, colours) and draws the cans
- `js/main.js` holds the age gate, menu and all scroll animations
- `js/vendor/` holds GSAP and ScrollTrigger, bundled so the site works without a CDN

## Customising
- **Add or change a beer:** edit the `BEERS` list in `js/beers.js`. Each beer gets a can drawn in its colours automatically.
- **Use real can photos:** add a transparent PNG to `assets/cans/` and set `image: "assets/cans/lazy.png"` on that beer.
- **Text, addresses, hours and phone:** edit them in `index.html`.

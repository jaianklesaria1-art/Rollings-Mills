# Rolling Mills Website

A static website for a steel rolling mill. It's plain HTML, CSS and JavaScript, with no build step.

## View it locally
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Structure
- `index.html` has all page sections: hero, stats, about, products, process, quality, industries and contact
- `css/styles.css` holds the styles (colours and fonts are set as variables at the top)
- `js/main.js` handles the mobile menu, counters, scroll animations, product spec pop-ups and form validation

## Things to customise
- **Company name, address, phone, email**: search `index.html` for `Apex`, `example.com` and `00000`
- **Product sizes/grades**: the `PRODUCTS` object in `js/main.js`
- **Stats**: the `data-count` attributes in the stats section
- **Contact form**: the form currently only validates and shows a thank-you message. To actually receive enquiries, connect it to a form service (e.g. Formspree) or a backend.

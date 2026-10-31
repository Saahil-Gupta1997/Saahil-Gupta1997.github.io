# Saahil Gupta: AI & automation delivery

Source for my personal website: https://saahil-gupta1997.github.io/

A static site with no build step, hosted on GitHub Pages.

- `index.html`: home page
- `pitch/index.html`: one-page summary
- `styles.css`, `theme.js`, `script.js`: styles and behavior
- `assets/`: images
- `scripts/configure-site.mjs`: sets the public URLs used for link previews

To preview locally, run `python -m http.server 8000` from this folder and open http://localhost:8000/.

Booking buttons stay hidden until `BOOKING_URL` is set at the top of `script.js`.

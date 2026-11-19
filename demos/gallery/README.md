# PeerCompute Demo Atlas

The demo overview opens as a window in the ExoWebTUI desktop. Pick an experiment from the directory or the PeerCompute launcher. Type in the search box (or press `/`) to search titles, descriptions, and demo directories. Category filters combine with the search. Each card remains a standard link, including when JavaScript is disabled.

## Run it

From the repository root, run `npm run docs:dev` and visit `https://localhost:4173/?prod=1` to browse the checked-in demos. Port 4173 otherwise opens each demo’s development server. A static host should mount `docs/` at `/peercompute/` to match the shared runtime asset paths used by the published demos.

## Maintain it

Edit the cards in `docs/index.html`. Both the directory and native launcher read those anchors, including their development ports and paths. Presentation and filtering live in `docs/assets/gallery.css` and `docs/assets/gallery.js`.

The window adapter is `demos/gallery/desktop.js`. To rebuild it, place the Exotui repository beside PeerCompute or set `EXOTUI_DIR` to a checkout containing the revision pinned in `scripts/build-gallery.mjs`. Run `npm run build:gallery` with the root dependencies installed. The builder reads the pinned Git tree. Browsing only needs the generated module and its accompanying license in `docs/assets/`.

Run `node --test demos/tests/gallery-browser.mjs` for desktop, mobile, and script-free coverage. Set `CHROME_BIN` to a system Chromium executable if Playwright’s browser is unavailable.

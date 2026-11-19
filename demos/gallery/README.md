# PeerCompute

The demo overview is an ExoWebTUI desktop. Select a demo from the directory or the PeerCompute menu to open it in an iframe window. Use the arrow keys and Enter to launch from the keyboard. Press `/` or tap **Find a demo** to search. The HTML directory provides ordinary links and works with scripts disabled.

**Settings** controls the desktop theme, wallpaper, window animations and CRT shader stack. The directory and its previews are rendered in terminal cells. Demo windows use compositor filters on their live content so embedded HTML, video, canvas and controls remain interactive. Settings are saved in this browser.

**Back to PeerCompute** returns to the directory and keeps the demo running. Minimize or switch windows to keep a session, or close the window to release it. **Open in tab** opens the standalone demo.

## Run it

From the repository root run `npm run docs:dev` and visit `https://localhost:4173/?prod=1` for the built demos. Port 4173 otherwise points to the individual development servers. Add `view=html` for the searchable HTML directory.

For a static preview, mount `docs/` at `/peercompute/` to match the shared runtime asset URLs. Threaded WASM and GGUF inference in an iframe require cross-origin isolation on the top-level page and the child. The docs development and preview servers set `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`. A host that cannot set these headers can still launch the model console in a separate tab.

## Maintain it

Edit the card anchors in `docs/index.html` to update both directories and the native launcher. The desktop adapter, catalog, demo windows, and frame effects are in `demos/gallery/`. The HTML alternative uses `docs/assets/gallery.css` and `gallery.js`.

To rebuild, place Exotui beside this repository or set `EXOTUI_DIR` to a checkout containing the revision pinned in `scripts/build-gallery.mjs`. Run `npm run build:gallery`. Browsing needs only the static files in `docs/`. The MilkDrop wallpaper bundle loads on demand.

Run `node --test demos/tests/gallery-browser.mjs demos/tests/frame-effects-browser.mjs` for browser coverage. Set `CHROME_BIN` to a system Chromium executable if Playwright’s browser is unavailable.

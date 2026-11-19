# PeerCompute

The demo overview is an ExoWebTUI desktop. Click or tap a demo to preview its image and read what you can do. The preview sits beside the list in wide windows and below it in narrow ones. Choose **Open demo** to launch the selected demo in an iframe window. From the keyboard, use the arrow keys to select, Shift + Up/Down to scroll the summary, and Enter to open. Press `/` or tap **Find a demo** to search names, categories and descriptions. The PeerCompute menu also offers direct launch shortcuts. The loading bar tracks the desktop download and closes after its first frame. During startup you can follow **Browse accessible HTML directory** for ordinary links. This view also opens automatically if the desktop fails to start or scripts are disabled.

**Settings** controls the desktop theme, wallpaper, window animations and CRT shader stack. Under **Settings → Windows**, scrolling defaults to **fast**, and each window transition defaults to **random**. You can change the speed or choose a particular effect for each transition. This browser remembers your choices. A touch flick glides after you lift your finger. Dragging a window to an edge or corner outlines where it will land.

In browsers with HTML-in-Canvas, each same-origin demo supplies its live pixels to the desktop before ExoWebTUI runs its shader passes. The title bar, toolbar, and demo share one CRT curve, scanline grid and degauss clock. The iframe keeps its original document, focus and session. Foreign origins, unsupported browsers, and scenes the browser cannot capture use a regular interactive iframe, labeled **Standard view** when desktop effects are on. Use `?prod=1` on port 4173 to open the same-origin built demos. At maximum curvature Chrome can deliver the initial touch-down at the unwarped location before activating the control under your finger.

Menus and the task switcher cover only their own area. Demos continue loading and repainting underneath. Switching between live demos keeps their documents and takes effect immediately.

**Back to PeerCompute** returns to the directory and keeps the demo running. Minimize or switch windows to keep a session, or close the window to release it. **Open in tab** opens the standalone demo.

## Run it

From the repository root run `npm run docs:dev` and visit `https://localhost:4173/?prod=1` for the built demos. Port 4173 otherwise points to the individual development servers. Add `view=html` for the searchable HTML directory.

For a static preview, mount `docs/` at `/peercompute/` to match the shared runtime asset URLs. Threaded WASM and GGUF inference in an iframe require cross-origin isolation on the top-level page and the child. The docs development and preview servers set `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`. A host that cannot set these headers can still launch the model console in a separate tab.

## Maintain it

Edit the card anchors in `docs/index.html` to update both directories and the native launcher. Keep the short card description in the first paragraph and the full desktop preview in `.demo-summary`. The desktop adapter, catalog, demo windows, HTML capture and shader compositor are in `demos/gallery/`. The HTML alternative uses `docs/assets/gallery.css` and `gallery.js`.

To rebuild, place Exotui beside this repository or set `EXOTUI_DIR` to a checkout containing the revision pinned in `scripts/build-gallery.mjs`. Run `npm run build:gallery` with Node 24. The build regenerates the desktop bundle and the inline progress panel in `docs/index.html` from the same pinned source. Browsing needs only the static files in `docs/`. The MilkDrop wallpaper bundle loads on demand.

Run `node --test demos/tests/gallery-browser.mjs demos/tests/frame-effects-browser.mjs demos/tests/gallery-overlays-browser.mjs` for browser coverage. Set `CHROME_BIN` to a system Chromium executable if Playwright’s browser is unavailable.

# PeerCompute

The demo overview is an ExoWebTUI desktop. Click or tap a demo to preview its image and read what you can do. The preview sits beside the list in wide windows and below it in narrow ones. Above the preview text, **Open demo** launches the selected demo in an iframe window. **Read guide** opens the full README in a native ExoWebTUI document window. Its text and diagrams use the active desktop theme. From the keyboard, use the arrow keys to select, Shift + Up/Down to scroll the summary, Enter to launch the demo, and Shift + Enter to read its guide. Press `/` or tap **Find a demo** to search names, categories and descriptions. The PeerCompute menu also offers direct launch shortcuts. The loading bar tracks the desktop download and closes after its first frame. During startup you can follow **Browse accessible HTML directory** for ordinary links. This view also opens automatically if the desktop fails to start or scripts are disabled.

Charts fit the guide window as you resize it. Click or tap a chart, choose **Enlarge diagram**, or press **D** in the guide to inspect it. Use the wheel, **+** and **−**, or a pinch to zoom. Drag or use the arrow keys to pan. **Fit** or **0** restores the whole diagram. **Close** or **Escape** returns to the guide at the same position. **HTML** opens the accessible standalone version.

**Settings** controls the desktop theme, wallpaper, window animations and CRT shader stack. Under **Settings → Windows**, scrolling defaults to **fast**, and each window transition defaults to **random**. You can change the speed or choose a particular effect for each transition. This browser remembers your choices. A touch flick glides after you lift your finger. Dragging a window to an edge or corner outlines where it will land.

In browsers with HTML-in-Canvas, each same-origin demo supplies its live pixels to the desktop before ExoWebTUI runs its shader passes. The title bar, toolbar, and demo share one CRT curve, scanline grid and degauss clock. The iframe keeps its original document, focus and session. Foreign origins, unsupported browsers, and scenes the browser cannot capture use a regular interactive iframe, labeled **Standard view** when desktop effects are on. Use `?prod=1` on port 4173 to open the same-origin built demos. At maximum curvature Chrome can deliver the initial touch-down at the unwarped location before activating the control under your finger.

Menus and the task switcher cover only their own area. Demos continue loading and repainting underneath. Switching between live demos keeps their documents and takes effect immediately.

Drag a title bar to an edge or corner to snap it, or press **G** to tile the focused window. When you resize the browser, the layout refits after you stop dragging. Open demos keep running in their tiles.

**Back to PeerCompute** returns to the directory and keeps the demo running. Minimize or switch windows to keep a session, or close the window to release it. **Open in tab** opens the standalone demo.

## Run it

From the repository root run `npm run docs:dev` and visit `https://localhost:4173/?prod=1` for the built demos. Port 4173 otherwise points to the individual development servers. Add `view=html` for the searchable HTML directory.

For a static preview, mount `docs/` at `/peercompute/` to match the shared runtime asset URLs. Threaded WASM and GGUF inference in an iframe require cross-origin isolation on the top-level page and the child. The docs development and preview servers set `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`. A host that cannot set these headers can still launch the model console in a separate tab.

## Maintain it

Edit the demo’s `README.md` to change its guide. Its `## Overview` supplies the full preview text. Use one or more paragraphs there and a Mermaid code block in the architecture section. The three WebGpuPhys entries use the READMEs in `demos/webgpuphys/dynamics/`, `mpm/` and `ppf/`. Set the entry’s title, category, thumbnail, development port, route and short HTML card description in [catalog.json](./catalog.json).

Run `npm run build:gallery` with Node 24. The build reads the pinned revision from a sibling Exotui checkout or from `EXOTUI_DIR`. It regenerates the desktop bundle, the inline loading panel, the directory cards and `docs/guides/`. Building the full demo set also refreshes the guides. The build packages each README and renders its Mermaid vectors once. The launcher loads the ExoWebTUI flex Markdown surface and the selected README on demand. Vector diagrams and illustrations have space reserved in the document layout and share the desktop CRT effects. The standalone HTML guide also includes the text, diagrams and illustrations with JavaScript disabled. With scripting enabled, it adopts your saved theme and provides the same zoom controls. Check for out-of-date guide files with `node scripts/gallery-guides.mjs --check`.

The desktop adapter, catalog, demo windows and iframe compositor live in `demos/gallery/`. The HTML alternative uses `docs/assets/gallery.css` and `gallery.js`. Run `node --test demos/tests/gallery-guides.test.mjs demos/tests/gallery-browser.mjs demos/tests/guide-interaction-browser.mjs demos/tests/frame-effects-browser.mjs demos/tests/gallery-overlays-browser.mjs` for coverage. Set `CHROME_BIN` to a system Chromium executable if Playwright’s browser is unavailable.

## Butterchurn wallpaper

Selecting Butterchurn downloads the MilkDrop renderer on demand. On WebGPU, three readback slots let a preset start its next frame while the previous cell colors are transferred. The desktop draws the color grid in one canvas operation and reuses glyphs until their text or style changes. The composed desktop then passes through the usual CRT effects. Butterchurn follows the display cadence up to 120 Hz.

To measure a particular machine, run `node scripts/butterchurn-benchmark.mjs <gallery-url>` in a graphical session. An optional second argument points to a previous build’s asset directory for comparison. The output reports GPU readbacks, distinct wallpaper color grids reaching the CRT, and texture uploads separately. Performance depends on the preset, viewport, refresh rate and other open demos.

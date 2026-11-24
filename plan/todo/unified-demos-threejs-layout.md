# Unified Demos Architecture (Three.js-Style Single-Repo Strict-Boundary Layout)

Status: active
Branch: `feature/unified-demos-threejs-layout`
Worktree: `/home/cos/projects/peercompute-demo-consolidation` (main checkout `/home/cos/projects/peercompute` left untouched while ULG depends on it)

## Goal

Adopt the Three.js single-repo, strict-boundary layout for PeerCompute (`peercompute/` = lean library only; `demos/` = first-class sibling showcase consuming PeerCompute exclusively through public entrypoints) across three cohesive phases:

1. **Phase 1 — Core Boundary Enforcement & ~400 MB+ Artifact Diet**
   - Eliminate all reverse imports from `peercompute/` (`src/` and `tests/`) into `demos/` by promoting reusable inference model-library/Hub helpers into `peercompute/src/peercompute/inference/{hub,library}/` (leaving thin compatibility re-export shims in `demos/inference/src/`), migrating UI/demo-specific tests (`modelCompatibilityHelp.test.js`, `RoomDirectory` test) into `demos/tests/`, and making `peercompute/tests/fixtures/inference/runtime.js` self-contained against `peercompute/src/`.
   - Export zero-inference capability helpers (`capabilities/index.js`) from `peercompute/src/peercompute/core.js` while keeping `peercompute/core` strictly at **0** inference/ORT/Transformers/Wllama edges.
   - Switch all 13 non-inference demos from `@peercompute` (`index.js`) to `@peercompute/core` (`core.js`) so non-inference demos emit **0** ORT/Wllama WASM binaries.
   - Extend `scripts/pagesSharedRuntimePlugin.mjs` to pool `ort-wasm-simd-threaded.asyncify*.wasm`, `ort-wasm-simd-threaded.jsep*.wasm`, and `wllama*.wasm` into a single shared `docs/assets/runtime/` pool across the 4 inference demos (`inference`, `cubechat`, `earth`, `vibeslopdb`).
   - Add automated boundary test `peercompute/tests/unit/workspaceBoundary.test.js`.
   - Remove dead legacy `demos/cubechat/server/` ("Tron Overworld" pre-PeerCompute relay).

2. **Phase 2 — Single-Port Unified Multi-Page Vite Dev Server + Consolidated Demo Workspace**
   - Replace 17 per-demo `demos/*/vite.config.*` files and 17 dev ports (`5175–5191` + `4173`) with one unified `demos/manifest.json`, one `demos/vite.config.js`, and one build driver `scripts/build-demos.mjs`.
   - Serve the ExoWebTUI gallery at `https://localhost:5173/` and every demo at `https://localhost:5173/<demo>/` (1-to-1 URL parity with production, same-origin by default so HTML-in-Canvas CRT capture and VibeSlopDB native multi-window host work live in dev).
   - Consolidate the 17 per-demo `demos/*/package.json` files into one `demos/package.json` workspace, aligning drifting `three` versions (`0.160`/`0.167`/`0.171` → `^0.182.0`) and removing stale demo-only `playwright`/`gh-pages` deps while preserving all per-demo `npm run test:<demo>`, `dev:<demo>`, and `build:<demo>` root commands.
   - Update `scripts/dev-all.sh`, `scripts/dev-local-relay.sh`, `scripts/write-prod-relay-config.mjs`, `demos/gallery/catalog.json`, `demos/tests/demo-ports.test.js`, `demos/tests/demo-release.test.js`, and `demos/README.md`.

3. **Phase 3 — GitHub Actions Pages Deploy & Untrack `docs/` from Git**
   - Move hand-authored gallery source files (`index.html`, `gallery*.{css,js}`, screenshots) out of `docs/` into `demos/gallery/static/` so `docs/` is 100% pure generated build output.
   - Update `README.md` screenshot paths to `demos/gallery/static/assets/*` (preserving all original diagrams and screenshots), `demos/gallery/desktop.js`, and `scripts/gallery-guides.mjs` (to copy static assets into `docs/` on build).
   - Ensure `scripts/build-all.sh` and `scripts/pagesReleaseAssets.mjs` work cleanly from an empty/missing `docs/` directory (fresh CI checkout).
   - Add `.github/workflows/pages.yml` (Node 24 LTS, checkout pinned `ubernaut/exotui` for `EXOTUI_DIR`, `npm ci`, `npm run build:all`, verification tests, `actions/upload-pages-artifact` + `actions/deploy-pages`).
   - Untrack `docs/` from Git (`git rm -r --cached docs`) and add `/docs/` to `.gitignore`.

## Acceptance Checks

- `peercompute/tests/unit/workspaceBoundary.test.js` passes (0 reverse imports `peercompute/` → `demos/`, 0 non-inference demo ORT/inference imports).
- `peercompute/tests/unit/coreEntrypoint.test.js` passes (0 inference/WASM edges from `peercompute/core`).
- Full `npm --prefix peercompute run test:unit` passes.
- Full `rm -rf docs && npm run build:all` succeeds cleanly from scratch; `docs/` total footprint drops sharply (target <200 MB vs 684 MB baseline), with 0 `ort-wasm` files inside non-inference demos and single pooled copies in `docs/assets/runtime/`.
- `node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js demos/tests/backend-server.test.js demos/tests/pages-shared-runtime.test.js demos/tests/pages-release-assets.test.mjs demos/tests/pages-isolation.test.mjs demos/tests/gallery-guides.test.mjs demos/tests/model-compatibility-help.test.js demos/tests/room-directory.test.js packages/exopute/tests/exopute.test.js` all pass.
- Per-demo unit suites (`test:geo-core`, `test:geodata`, `test:earth`, `test:wxglobe`, `test:motorcycle`, `test:vibeslopdb`, `test:eshkols-in-space`, `multiscale`, `planetgen`, `schrodinger`) pass.
- Unified single-port Vite dev server (`https://localhost:5173/<demo>/`) verified live in headless Chromium across representative demos (including aligned Three.js demos `hyperborea`, `sneakywoods`, `planetgen`, `universes`, plus `netviz`, `cubechat`, `earth`, `motorcycle`, `vibeslopdb`, `eshkols-in-space`, `inference`) and shut down cleanly.
- Headless browser release checks (`demos/tests/gallery-browser.mjs`, `demos/tests/runtime-smoke.mjs`, `demos/tests/runtime-p2p.mjs`, `demos/netviz/tests/analysisBrowserCheck.mjs`) pass against freshly built `docs/`.
- `git ls-files docs/` returns 0 tracked files; `.github/workflows/pages.yml` parses cleanly as valid YAML.

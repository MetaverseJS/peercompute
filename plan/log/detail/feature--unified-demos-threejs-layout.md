# Branch Log — `feature/unified-demos-threejs-layout`

Worktree: `/home/cos/projects/peercompute-demo-consolidation` (branched from `main` at `396308a5`; `/home/cos/projects/peercompute` left completely untouched for ULG).

## 2026-11-23 17:42:05 AKST — Prompt: Execute all three phases in a separate worktree

### Baseline Audit
- Created isolated Git worktree `/home/cos/projects/peercompute-demo-consolidation` on branch `feature/unified-demos-threejs-layout`.
- Measured baseline footprint before edits:
  - `docs/`: `684.4 MB` tracked in Git (`465.1 MB` `.wasm`, including 13 identical `28.2 MB` copies of `ort-wasm-simd-threaded.jsep.wasm`, 4 copies of `8.4 MB` `wllama.wasm`, 2 copies of `ort-wasm-simd-threaded.asyncify.wasm`).
  - `demos/`: 17 separate `vite.config.*` files, 17 separate `package.json` workspaces, 17 hardcoded ports (`5175–5191`) + port `4173` for `docs:dev`, drifting `three` versions (`0.160`, `0.167`, `0.171`, `0.182`), stale `playwright@^1.42.0` and `gh-pages`, plus dead legacy `demos/cubechat/server/` ("Tron Overworld").
  - Reverse boundary leaks: `peercompute/src/` has 0 imports into `demos/`, while 21 files under `peercompute/tests/` reach back into `demos/inference/src/*` (18 unit tests + 2 browser runtime fixtures) and `demos/cubechat/src/p2p/roomDirectory.js` (1 unit test).
  - Hand-authored gallery sources (`docs/index.html`, `docs/assets/{gallery*,*.png,*.svg,*.gif}`) currently live inside `docs/`, mixed with generated outputs.
  - Confirmed `https://github.com/ubernaut/exotui.git` is publicly reachable for pinned checkout in GitHub Actions Pages workflow.
  - Observed `npm ci` failed on baseline due to `packages/exopute` missing from `package-lock.json`; Phase 2 will regenerate `package-lock.json` cleanly and validate `npm ci`.

### Execution Plan
- Phase 1: Enforce core/demo boundary, promote reusable inference library helpers into `peercompute/src/peercompute/inference/{hub,library}/` with compatibility re-exports, move demo-only tests to `demos/tests/`, export `capabilities/index.js` from `peercompute/core`, switch 13 non-inference demos to `@peercompute/core`, extend `scripts/pagesSharedRuntimePlugin.mjs` to pool `jsep` and `wllama` WASM alongside `asyncify`, add `workspaceBoundary.test.js`, remove dead `demos/cubechat/server/`.
- Phase 2: Consolidate into `demos/manifest.json` + single-port `demos/vite.config.js` (`5173`) + `scripts/build-demos.mjs` + unified `demos/package.json` workspace; update dev launchers, gallery links, tests, and docs.
- Phase 3: Move hand-authored gallery static files to `demos/gallery/static/`, update `README.md` + `scripts/gallery-guides.mjs` + `scripts/build-all.sh`, add `.github/workflows/pages.yml`, untrack `docs/` from Git, and verify clean from-scratch build + full test suite.

### Phase 1 Completed — Core Boundary Enforcement & Runtime Asset Diet
- Exported zero-inference capability helpers (`export * from './capabilities/index.js'`) from `peercompute/src/peercompute/core.js`.
- Promoted 14 pure domain-agnostic inference library/Hub modules from `demos/inference/src/` into `peercompute/src/peercompute/inference/{hub,library}/`, leaving 1-line compatibility re-export shims in `demos/inference/src/` and updating `scripts/modelEvidenceBuildPlugin.mjs`.
- Updated all 18 `peercompute/tests/unit/*.test.js` files and `peercompute/tests/runtime/diffusion-fixture/runtime.js` to import directly from `peercompute/src/peercompute/inference/`; made `peercompute/tests/fixtures/inference/runtime.js` self-contained against `peercompute/src/peercompute/`.
- Moved UI/demo-owned tests out of `peercompute/tests/unit/` into `demos/tests/model-compatibility-help.test.js` and `demos/tests/room-directory.test.js`.
- Switched all 13 non-inference demos (`daddygo`, `eshkols-in-space`, `fano-reactor`, `hyperborea`, `motorcycle`, `multiscale`, `netviz`, `planetgen`, `schrodinger`, `sneakywoods`, `universes`, `webgpuphys`, `wxglobe`) from `@peercompute` to `@peercompute/core` (including dynamic imports in `hyperborea/src/game/roomDirectory.js` and `schrodinger/src/peercompute/session.js`, plus `DEV`-aware asset resolution in `multiscale/src/main.js`).
- Extended `scripts/pagesSharedRuntimePlugin.mjs` to pool `ort-wasm-simd-threaded.jsep*.wasm` and `wllama*.wasm` alongside `ort-wasm-simd-threaded.asyncify*.wasm` into `docs/assets/runtime/`, with unit coverage added to `demos/tests/pages-shared-runtime.test.js`.
- Added automated boundary enforcement suite `peercompute/tests/unit/workspaceBoundary.test.js`.
- Removed dead legacy `demos/cubechat/server/` ("Tron Overworld" pre-PeerCompute relay).
- Validation:
  - `node --test peercompute/tests/unit/workspaceBoundary.test.js peercompute/tests/unit/coreEntrypoint.test.js demos/tests/pages-shared-runtime.test.js demos/tests/model-compatibility-help.test.js demos/tests/room-directory.test.js packages/exopute/tests/exopute.test.js`: 24/24 PASS.
  - `npm --prefix peercompute run test:unit`: 1392/1393 PASS (only pre-existing external staged-ULG fixture `serviceOrchestration.test.js:4095` blocked, identical to baseline `main`).

### Phase 2 Completed — Single-Port Unified Multi-Page Vite Dev Server + Consolidated `demos/` Workspace
- Replaced 17 per-demo `demos/*/vite.config.{js,ts}` files and 17 per-demo `demos/*/package.json` workspaces with:
  - `demos/manifest.json` (single source of truth for all 17 demos, build flags, and unified `devPort: 5173`)
  - `demos/package.json` (single consolidated workspace package unifying `three@^0.182.0` across all demos, removing drifting `0.160`/`0.167`/`0.171` copies and stale `playwright@^1.42.0`/`gh-pages`)
  - `demos/vite.config.js` (single HTTPS Vite dev server on port `5173` serving `/` ExoWebTUI gallery + `/<demo>/` for all 17 demos on one origin with COOP/COEP headers, per-demo `public/` overlay, live Cesium static mount from `node_modules/cesium`, live `/vibeslopdb/host.js` mapping, `/api` & `/chaos-api` proxies, and `createDemoBuildConfig`/`createDemoServerConfig` for programmatic builds and browser tests)
  - `scripts/build-demos.mjs` (single-process Vite programmatic build driver for all or selected demos)
  - `scripts/dev-demo.mjs` (focused single-port dev launcher printing the exact `https://localhost:5173/<demo>/` URL)
- Collapsed root `package.json` `workspaces` from 21 entries to 5 (`peercompute`, `packages/exopute`, `packages/geo-core`, `services/geodata`, `demos`), refreshed `package-lock.json` cleanly (`removed 40 packages`), and added direct root `test:*` commands for all demo test suites.
- Updated 9 demo HTML entry files from root-relative `/src/...` to `./src/...` for clean single-port `/<demo>/` resolution; updated `scripts/dev-all.sh` and `scripts/dev-local-relay.sh` to spawn 3 processes (`relay`, `geodata`, `demos`) instead of 19–20; updated `scripts/write-prod-relay-config.mjs`, `demos/gallery/catalog.json`, `docs/assets/gallery.js`, `demos/tests/{demo-ports,demo-release}.test.js`, 6 inference browser harnesses, `demos/multiscale/tests/workerBuild.test.mjs`, `demos/webgpuphys/tests/mpm-task-bundle.test.mjs`, `demos/netviz/tests/analysisBrowserCheck.mjs`, `demos/eshkols-in-space/scripts/browser-check.mjs`, `demos/README.md`, `demos/gallery/README.md`, and `README.md`.
- Committed previously untracked `scripts/gallery-pointer.patch` (required by `scripts/build-gallery.mjs`) and fixed two stale `plan/tests.md` / `plan/log.md` links in `demos/wxglobe/README.md` and `demos/cubechat/README.md`.
- Artifact size measurement after full 17-demo build (`docs/`):
  - **684.4 MB -> 228 MB** (**456 MB / 66.7% reduction**).
  - 0 `ort-wasm` files in any of the 13 non-inference demos (`fano-reactor` 40 KB, `eshkols-in-space` 912 KB, `planetgen` 928 KB, `universes` 1.2 MB, `daddygo` 3.0 MB, `sneakywoods`/`schrodinger` 3.1 MB, `netviz` 3.2 MB, `hyperborea` 3.3 MB, `webgpuphys` 4.1 MB, `multiscale` 6.2 MB).
  - Single pooled copy of each inference WASM (`ort-wasm-simd-threaded.jsep`, `ort-wasm-simd-threaded.asyncify` ×2, `wllama`) in `docs/assets/runtime/`.
- Validation:
  - `node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js demos/tests/gallery-guides.test.mjs`: 51/51 PASS.
  - Per-demo & platform suites (`test:geo-core`, `test:geodata`, `test:earth`, `test:wxglobe`, `test:motorcycle`, `test:multiscale`, `mpm-task-bundle.test.mjs`, `test:planetgen`, `test:schrodinger`, `test:vibeslopdb`, `test:eshkols-in-space`, `test:physics`, `test:traffic`, `test:xr`, `test:network-telemetry`, `test:capabilities`, `test:artifacts`, `test:inference`, `test:peer-inference`, `test:gguf`, `test:diffusion`, `console-navigation`, `pages-isolation`, `pages-release-assets`, `backend-server`, `go test ./...`): 100% PASS.
  - `npm pack --dry-run`: `peercompute@0.1.0-alpha.1` (787.5 kB, 228 files), `exopute@0.1.0-alpha.1` (1.8 kB, 6 files).
  - Live single-port unified Vite dev server (`https://127.0.0.1:<port>/`): verified `/netviz` 302 redirect, `crossOriginIsolated === true`, ExoWebTUI gallery `/` + all 17 demo routes cleanly in headless Chrome (including Three.js 0.182 aligned `hyperborea`, `sneakywoods`, `planetgen`, `universes`, plus `vibeslopdb` SQLite/PGlite and `eshkols-in-space` WebGPU).
  - `demos/tests/gallery-browser.mjs`: 6/6 PASS; `demos/netviz/tests/analysisBrowserCheck.mjs`: PASS; `demos/eshkols-in-space/scripts/browser-check.mjs`: PASS (direct + 65,536-body Barnes-Hut octree).
  - `demos/tests/runtime-p2p.mjs`: PASS on both `floodsub` and `gossipsub` (all 5 networked demos: `cubechat`, `hyperborea`, `sneakywoods`, `daddygo`, `netviz`).
  - `demos/tests/world-agent-host.test.js` & `demos/tests/cubechat-native-ui.test.js`: 115/115 PASS.
  - `test:global-chat` (including `inference-global-integration.test.js`): 28/28 PASS; `test:root-host`: 45/45 PASS.
  - `demos/tests/runtime-smoke.mjs`: `hyperborea`, `sneakywoods`, `daddygo`, `planetgen`, `wxglobe`, `motorcycle`, `universes`, `fano-reactor` all PASS with zero errors; `cubechat` & `earth` passed all runtime & 65+ real-data geometry/cache assertions (only expected self-signed HTTPS ServiceWorker console message); `webgpuphys` rejected fallback SwiftShader adapter as documented in `plan/test/test.md`.
- Local commit: `6698cd08` ("Consolidate demos into single-port unified Vite workspace (Phase 2)").

### Phase 3 Completed — GitHub Actions Pages Deploy & Untrack `docs/` from Git
- Copied all hand-authored gallery sources (`index.html`, `assets/{gallery.css,gallery.js,gallery-guide.css,gallery-guide-theme.js,gallery-diagram.js}`, plus all 20 original `.png`/`.svg`/`.gif` screenshots and diagrams) out of `docs/` into `demos/gallery/static/` so `docs/` is 100% pure generated output.
- Updated `README.md` (15 screenshot/diagram links → `demos/gallery/static/assets/*`, preserving every original diagram and screenshot with 0 broken paths and 0 leftover `docs/assets/*` references), `demos/gallery/desktop.js` (imports → `./static/assets/*`), `demos/gallery/README.md`, `scripts/gallery-guides.mjs` (copies `demos/gallery/static/assets/*` into `docs/assets/` and bootstraps `docs/index.html` from `demos/gallery/static/index.html` when absent, preserving deterministic `--check`), and `scripts/build-all.sh` (`mkdir -p "$repo_root/docs"` before `capturePagesRelease`).
- Added `/docs/` to `.gitignore` and created `.github/workflows/pages.yml` (Node 24 LTS, pinned checkout of public `ubernaut/exotui` `e89d2136a96dba9479ecbc984fb28e0927dfd8aa` into `.ci-exotui`, `npm ci`, `EXOTUI_DIR=${{ github.workspace }}/.ci-exotui npm run build:all`, 5-suite boundary/release/guide verification gate, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`).
- Untracked generated `docs/` from Git (`git rm -r --cached -q docs`; verified `git ls-files docs | wc -l` = `0`, removing 3,333 generated files from Git tracking).
- Verified `package-lock.json` workspace sync matches all 5 workspaces (`peercompute`, `packages/exopute`, `packages/geo-core`, `services/geodata`, `demos`) with 0 stale `demos/*` entries for CI `npm ci`.
- Clean from-scratch CI build & validation (`rm -rf docs && npm run build:all` + tests):
  - `git -C /home/cos/projects/exotui branch -r --contains e89d2136a96dba9479ecbc984fb28e0927dfd8aa`: confirmed present on `origin/main`.
  - `.github/workflows/pages.yml` YAML validation: `YAML OK: ['build', 'deploy']`.
  - `rm -rf docs && npm run build:all`: succeeded cleanly from empty `docs/` (`{"captured":0,"bytes":0,"source":"empty"}`, 19 demo guides + all 17 demos + ExoWebTUI gallery + `docs/release-manifest.json`).
  - Fresh `docs/` footprint: **229 MB on disk / 221.6 MiB exact file bytes** across 2,632 active files (0 retained), vs `684.4 MB` baseline (**455 MB / 66.5% reduction**); 0 `ort-wasm` files inside any non-inference demo; single 90 MB shared WASM pool (`ort-wasm-simd-threaded.asyncify` ×2, `ort-wasm-simd-threaded.jsep`, `wllama`) in `docs/assets/runtime/`.
  - `node --test peercompute/tests/unit/workspaceBoundary.test.js peercompute/tests/unit/coreEntrypoint.test.js demos/tests/demo-ports.test.js demos/tests/demo-release.test.js demos/tests/gallery-guides.test.mjs`: **57/57 PASS**.
  - `CHROME_BIN=/usr/bin/google-chrome node --test demos/tests/gallery-browser.mjs`: **6/6 PASS** against fresh `docs/`.
- Updated `vibe-plan` docs (`plan/todo/done/unified-demos-threejs-layout.md`, `plan/todo/priority.md`, `plan/arch/stack.md`, `plan/test/test.md`, `plan/log/log-summary.md`, and this branch log).
- Confirmed `/home/cos/projects/peercompute` remained completely untouched at `396308a5` throughout all 3 phases.

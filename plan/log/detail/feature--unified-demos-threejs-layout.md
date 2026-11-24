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

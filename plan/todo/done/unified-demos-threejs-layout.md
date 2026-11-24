# Unified Demos Architecture (Three.js-Style Single-Repo Strict-Boundary Layout)

Status: done
Branch: `feature/unified-demos-threejs-layout`
Worktree: `/home/cos/projects/peercompute-demo-consolidation` (main checkout `/home/cos/projects/peercompute` left untouched while ULG depends on it)
Commits:
- Phase 1: `8d75cc69` — Enforce core/demo boundary, switch non-inference demos to peercompute/core, pool WASM runtimes
- Phase 2: `6698cd08` — Consolidate demos into single-port unified Vite workspace
- Phase 3: committed on `feature/unified-demos-threejs-layout` (GitHub Actions Pages deploy + untracked `docs/`)

## Goal

Adopt the Three.js single-repo, strict-boundary layout for PeerCompute (`peercompute/` = lean library only; `demos/` = first-class sibling showcase consuming PeerCompute exclusively through public entrypoints) across three cohesive phases:

1. **Phase 1 — Core Boundary Enforcement & Runtime Asset Diet**
   - Eliminated all 21 reverse imports from `peercompute/` (`src/` and `tests/`) into `demos/` by promoting 14 pure inference library/Hub helpers into `peercompute/src/peercompute/inference/{hub,library}/` (leaving thin compatibility re-export shims in `demos/inference/src/`), migrating UI/demo-specific tests (`model-compatibility-help.test.js`, `room-directory.test.js`) into `demos/tests/`, and making `peercompute/tests/fixtures/inference/runtime.js` self-contained against `peercompute/src/`.
   - Exported zero-inference capability helpers (`capabilities/index.js`) from `peercompute/src/peercompute/core.js` while keeping `peercompute/core` strictly at **0** inference/ORT/Transformers/Wllama edges.
   - Switched all 13 non-inference demos from `@peercompute` (`index.js`) to `@peercompute/core` (`core.js`) so non-inference demos emit **0** ORT/Wllama WASM binaries.
   - Extended `scripts/pagesSharedRuntimePlugin.mjs` to pool `ort-wasm-simd-threaded.asyncify*.wasm`, `ort-wasm-simd-threaded.jsep*.wasm`, and `wllama*.wasm` into a single shared `docs/assets/runtime/` pool across the 4 inference demos (`inference`, `cubechat`, `earth`, `vibeslopdb`).
   - Added automated boundary test `peercompute/tests/unit/workspaceBoundary.test.js`.
   - Removed dead legacy `demos/cubechat/server/` ("Tron Overworld" pre-PeerCompute relay).

2. **Phase 2 — Single-Port Unified Multi-Page Vite Dev Server + Consolidated Demo Workspace**
   - Replaced 17 per-demo `demos/*/vite.config.*` files and 17 dev ports (`5175–5191` + `4173`) with one unified `demos/manifest.json`, one `demos/vite.config.js`, one build driver `scripts/build-demos.mjs`, and one focused dev helper `scripts/dev-demo.mjs`.
   - Served the ExoWebTUI gallery at `https://localhost:5173/` and every demo at `https://localhost:5173/<demo>/` (1-to-1 URL parity with production, same-origin by default with COOP/COEP headers).
   - Consolidated the 17 per-demo `demos/*/package.json` workspaces into one `demos/package.json` workspace (root workspaces collapsed from 21 → 5), aligning drifting `three` versions (`0.160`/`0.167`/`0.171` → `^0.182.0`) and removing stale demo-only `playwright`/`gh-pages` deps while preserving all per-demo `npm run test:<demo>`, `dev:<demo>`, and `build:<demo>` root commands.
   - Updated `scripts/dev-all.sh`, `scripts/dev-local-relay.sh`, `scripts/write-prod-relay-config.mjs`, `demos/gallery/catalog.json`, `demos/tests/demo-ports.test.js`, `demos/tests/demo-release.test.js`, 10 demo/browser test harnesses, `demos/README.md`, `demos/gallery/README.md`, and `README.md`; committed `scripts/gallery-pointer.patch`.

3. **Phase 3 — GitHub Actions Pages Deploy & Untrack `docs/` from Git**
   - Moved hand-authored gallery source files (`index.html`, `gallery*.{css,js}`, 20 screenshots/diagrams) out of `docs/` into `demos/gallery/static/` so `docs/` is 100% pure generated build output.
   - Updated `README.md` (15 screenshot links → `demos/gallery/static/assets/*`, preserving all original diagrams and screenshots), `demos/gallery/desktop.js`, `demos/gallery/README.md`, `scripts/gallery-guides.mjs` (copies static assets into `docs/` and bootstraps `docs/index.html` from `demos/gallery/static/index.html`), and `scripts/build-all.sh` (`mkdir -p docs`).
   - Added `.github/workflows/pages.yml` (Node 24 LTS, pinned checkout of `ubernaut/exotui` `e89d2136a96dba9479ecbc984fb28e0927dfd8aa`, `npm ci`, `EXOTUI_DIR=... npm run build:all`, boundary/release/guide verification tests, `actions/configure-pages@v5` + `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`).
   - Untracked `docs/` from Git (`git rm -r --cached docs`, `0` tracked files) and added `/docs/` to `.gitignore`.

## Measured Results & Verification

- **Generated `docs/` clean build footprint (`rm -rf docs && npm run build:all`):** **684.4 MB → 229 MB on disk (221.6 MiB exact bytes)** — a **455 MB / 66.5% reduction** (0 `ort-wasm` files in non-inference demos; single 90 MB shared WASM pool in `docs/assets/runtime/` across the 4 inference demos).
- **Git-tracked `docs/` payload:** **684.4 MB (3,333 files) → 0 bytes (0 tracked files)**.
- **Reverse core → demo imports:** **21 → 0** (enforced by `peercompute/tests/unit/workspaceBoundary.test.js`).
- **Dev ports / processes (`npm run dev`):** **18 ports / ~20 processes → 1 unified HTTPS port (`5173`) / 3 processes (`relay`, `geodata`, `demos`)**.
- **Workspaces & demo config files:** **21 workspaces → 5**, **34 per-demo `package.json`/`vite.config.*` files → 3 unified files** (`demos/manifest.json`, `demos/package.json`, `demos/vite.config.js`).
- **Automated checks passed:**
  - `workspaceBoundary.test.js`, `coreEntrypoint.test.js`, `demo-ports.test.js`, `demo-release.test.js`, `gallery-guides.test.mjs`: **57/57 PASS** against clean from-scratch `docs/` build.
  - `CHROME_BIN=/usr/bin/google-chrome node --test demos/tests/gallery-browser.mjs`: **6/6 PASS** against clean from-scratch `docs/` build.
  - `npm --prefix peercompute run test:unit`: **1392/1393 PASS** (only pre-existing external staged-ULG fixture `serviceOrchestration.test.js:4095`).
  - Full demo, platform, inference, global-chat, root-host, Go relay, `npm pack --dry-run`, live unified Vite dev server (`/` + all 17 demos), `runtime-p2p.mjs` (`floodsub` + `gossipsub`), `world-agent-host`, `cubechat-native-ui`, `analysisBrowserCheck.mjs`, and `eshkols-in-space/scripts/browser-check.mjs`: **100% PASS**.
- **Follow-up GitHub repository setting after merge to `main`:** switch **Settings → Pages → Build and deployment → Source** from `Deploy from a branch (main /docs)` to **`GitHub Actions`**.

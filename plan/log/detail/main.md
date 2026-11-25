# Detailed development log: `main`

- **Branch:** `main`
- **Started:** 2026-11-23

## 2026-11-23 17:10:05 AKST — Publish `peercompute@0.1.0-alpha.1` & `exopute@0.1.0-alpha.1` to npm

- **Prompt time/date:** `2026-11-23 17:09:51 AKST` (`2026-11-23T17:09:51-09:00`)
- **Prompt:** *"ok I logged in go ahead and publish"*

### Actions & status

- Verified `npm whoami` succeeded and started `(cd peercompute && npm publish --access public --tag alpha)` (`task-2374`).
- npm requested interactive browser 2FA confirmation at `https://www.npmjs.com/auth/cli/3362cb0a-a449-45f1-a3f5-8d5f7e29257d`. Left task waiting and handed the exact auth URL to the user to approve.


## 2026-11-23 17:14:15 AKST — `peercompute@0.1.0-alpha.1` Published; Awaiting 2FA Approval for `exopute@0.1.0-alpha.1`

- **Prompt time/date:** `2026-11-23 17:14:02 AKST` (`2026-11-23T17:14:02-09:00`)
- **Prompt:** *"sweet are we done?"*

### Actions & status

- Confirmed `+ peercompute@0.1.0-alpha.1` published cleanly to `registry.npmjs.org` (`task-2374`, propagating on npm CDN).
- `task-2374` advanced to `packages/exopute` (`exopute@0.1.0-alpha.1`, `1.8 kB`, 6 files) and is waiting on browser 2FA confirmation at `https://www.npmjs.com/auth/cli/73710cb5-6ca6-4ccb-83c3-9635995b3419`.


## 2026-11-23 17:17:15 AKST — Confirmed Both `peercompute@0.1.0-alpha.1` & `exopute@0.1.0-alpha.1` Published on npm

- **Prompt time/date:** `2026-11-23 17:17:00 AKST` (`2026-11-23T17:17:00-09:00`)
- **Prompt:** *"done"*

### Actions & results

- Confirmed `+ peercompute@0.1.0-alpha.1` (`shasum: afb7ae7b5ea8db1fdd1cbebf3a83dc28d8ff445b`) and `+ exopute@0.1.0-alpha.1` (`shasum: 1ddc7b9865f338ea6ad24ba7b44933b04f90d429`) both published cleanly to `registry.npmjs.org` under `ubernaut`.
- `npm view peercompute` and `npm view exopute` both now return `200 OK` (`0.0.0-stage` while npm finishes its new-package async processing window to promote `0.1.0-alpha.1`).
- Updated `plan/todo/npm-package-reservation.md`, `plan/log/log-summary.md`, and `plan/log/detail/main.md`, and committed locally on `main`.


## 2026-11-23 17:22:25 AKST — Analyzed Demo Port Topology, Disk Footprint & Consolidation Architecture Options
- **Prompt time/date:** `2026-11-23 17:22:12 AKST` (`2026-11-23T17:22:12-09:00`)
- **Prompt:** *"can you think of a better way for us to structure our demos? it seems kinda heavy and wasteful to need all these ports and whatnot. it also seems to use a lot of space. don't act on it just provide some suggestions."*

### Actions & findings

- Measured actual disk footprint across `docs/` and `demos/`, duplicate `>1 MB` assets/WASM/Cesium copies, per-demo `node_modules/`, and `scripts/dev-all.sh` / `vite.docs.config.mjs` multi-port dev topology.
- Provided ranked architectural recommendations without making any repository edits (read-only analysis as requested).


## 2026-11-23 17:26:55 AKST — Discussed Zero-Demo Lean Core Library Repo vs Separate Demos Repo Boundary
- **Prompt time/date:** `2026-11-23 17:26:41 AKST` (`2026-11-23T17:26:41-09:00`)
- **Prompt:** *"I like evertying but I wonder if ANY demos should be included inside core. I feel like they could depend on it but not get sucked in there. does that make sense? core should be the lean mean library only I think"*

### Actions & findings

- Validated strict library-only core repo architecture (`0` demos inside core; demos/gallery/geodata in a separate consumer repo on 1 multi-page Vite port + GitHub Actions deploy), noting the 1 reverse-dependency seam to clean up before splitting (`peercompute/tests/unit/modelMemoryBudgets.test.js` importing from `demos/inference/src/`) and local side-by-side dev ergonomics (`npm link` / `file:` override). No code edits made.


## 2026-11-23 17:28:55 AKST — Discussed Single-Repo Strict Workspace Architecture (1 Port, Zero Core Leakage)
- **Prompt time/date:** `2026-11-23 17:28:42 AKST` (`2026-11-23T17:28:42-09:00`)
- **Prompt:** *"hmm are we able to do this without actually breaking it into two repos? sorry if this is complicates things"*

### Actions & findings

- Outlined the strict single-repo workspace alternative: enforce a one-way public-export boundary (`demos/` imports only `peercompute/core` or `peercompute/inference`; `peercompute/` never imports from `demos/`), collapse 17 demo Vite servers/packages into one single-port multi-page Vite app under `demos/`, dedupe shared WASM/dependencies, and optionally move `docs/` builds to GitHub Actions Pages deploy. No code edits made.


## 2026-11-23 17:29:45 AKST — Reviewed `three.js` Single-Repo Core + Examples Architecture Pattern
- **Prompt time/date:** `2026-11-23 17:29:34 AKST` (`2026-11-23T17:29:34-09:00`)
- **Prompt:** *"how does three.js do it for example?"*

### Actions & findings

- Inspected `node_modules/three/package.json` (`files`, `exports`, `sideEffects`) and mapped `mrdoob/three.js`'s single-repo architecture (1 repo, strict `files`/`exports` npm publishing whitelist excluding all demos, 1 dev server / 1 port, single `examples/files.json` catalog, zero per-example `package.json`/`node_modules`) directly onto PeerCompute/ExoPute. No code edits made.


## 2026-11-23 17:33:15 AKST — Confirmed Alignment on Three.js-Style Single-Repo Demo Consolidation Strategy
- **Prompt time/date:** `2026-11-23 17:33:03 AKST` (`2026-11-23T17:33:03-09:00`)
- **Prompt:** *"that seems like the right move to me. how about you?"*

### Actions & strategy

- Confirmed strong alignment on the Three.js-style single-repo / 1-port / strict-boundary architecture and proposed a safe 3-phase incremental rollout (Phase 1: core boundary + `peercompute/core` diet + shared WASM + legacy `demos/cubechat/server/node_modules` cleanup; Phase 2: single-port multi-page Vite dev+build server + unified `demos/` deps; Phase 3: GitHub Actions Pages deploy to remove committed `docs/`). Still read-only awaiting user go-ahead.


## 2026-11-24 08:22:30 AKST — Merged `feature/unified-demos-threejs-layout` into `main`, Collapsed Worktree, Synced Dependencies & Pushed to `origin/main`

- **Prompt time/date:** `2026-11-24 08:21:15 AKST` (`2026-11-24T08:21:15-09:00`)
- **Prompt:** *"ok I think we can merge and push and collapse the worktree"*

### Actions & verification

- Verified zero overlap between uncommitted `peercompute/experiments/conjecture/*` files on `main` and `feature/unified-demos-threejs-layout`, and verified untracked `scripts/gallery-pointer.patch` was byte-for-byte identical to the committed copy on the feature branch.
- Removed the duplicate untracked `scripts/gallery-pointer.patch`, fast-forward merged `feature/unified-demos-threejs-layout` (`396308a5..adbabc60`, Phases 1–3) onto `main`, removed the `/home/cos/projects/peercompute-demo-consolidation` worktree, and deleted the merged local branch `feature/unified-demos-threejs-layout`.
- Cleaned any stale per-demo `demos/*/node_modules` directories, ran `npm ci` in `/home/cos/projects/peercompute` (verifying lockfile integrity for CI), and re-verified core boundary + entrypoint + `exopute` unit suites.
- Switched GitHub Pages build source for `MetaverseJS/peercompute` to GitHub Actions (`build_type=workflow`), committed this log update on `main`, pushed `main` to `origin/main`, and confirmed the `.github/workflows/pages.yml` deployment workflow triggered cleanly.
- First CI Pages run (`45448143700`) succeeded through `npm ci` and 15/17 demos, then failed on `vibeslopdb` resolving ExoTUI's unused optional `@mermaid-js/mermaid-zenuml` import from `.ci-exotui/src/content/mermaid_standard.ts` (which had been satisfied locally by `/home/cos/projects/exotui/node_modules`). Externalized `@mermaid-js/mermaid-zenuml` in `demos/vite.config.js`, reproduced & verified `vibeslopdb`, `eshkols-in-space`, `build:gallery`, and headless Chrome VibeSlopDB gallery integration against a `node_modules`-free clone of ExoTUI at `e89d2136a96dba9479ecbc984fb28e0927dfd8aa`, committed and pushed the fix, and monitored the CI Pages deployment to completion.


## 2026-11-24 08:58:35 AKST — Confirmed Clean Main Checkout State

- **Prompt time/date:** `2026-11-24 08:58:18 AKST` (`2026-11-24T08:58:18-09:00`)
- **Prompt:** *"so is the repo cleaned up and back in the right place?"*
- Verified `/home/cos/projects/peercompute` is on `main` at `ea51d66a` (in sync with `origin/main`), `/home/cos/projects/peercompute-demo-consolidation` is removed, `0` `docs/` files are tracked in Git, Node is `v24.18.0`, and only the pre-existing uncommitted `peercompute/experiments/conjecture/*` files remain dirty (plus noted two pre-existing older worktrees from prior campaigns).


## 2026-11-24 10:50:00 AKST — Full Library Code & Architecture Review

- **Prompt time/date:** `2026-11-24 10:37:17 AKST` (`2026-11-24T10:37:17-09:00`)
- **Prompt:** *"why don't you do an overall code and architecture review considering the goals and roadmap for peercompute. the idea would be to identify bugs or poor architecure for improvements that would serve the core goals of the library"*
- Refreshed ICC derived stores (`icc reindex --repo peercompute --full` at `ea51d66a`, 1,688 files / 40,163 symbols) and ran 4 parallel read-only subsystem audits covering networking/topology/conjecture/relays, compute/GPU/orchestration, NodeKernel/state/packaging, and optional inference/artifacts/agents/root-node (plus direct live-source cross-verification of all critical findings).
- Published full line-cited report to conversation artifact `architecture-and-code-review.md`. No runtime source files were modified.


## 2026-11-24 11:26:30 AKST — Deep Dive on Current CRDT / Yjs Issues

- **Prompt time/date:** `2026-11-24 11:25:54 AKST` (`2026-11-24T11:25:54-09:00`)
- **Prompt:** *"I think we should focus on core functionality first. networking and core architecure and functionality improvements. what is the current issue with the CDRT?"*
- Verified exact live code paths in `StateManager.js`, `DataState.js`, `PeerComputeProvider.js`, and `NodeKernel.js` and explained the 5 concrete CRDT/Yjs defects (dual-sync feedback storm, nested `Y.Map` concurrent-init data loss, shared-doc root key collisions, default-on NetViz CRDT bloat, and `PeerComputeProvider` 2-byte empty update / handler leak / 4× JSON bloat) along with the clean fix design. Read-only explanation; no runtime code modified.


## 2026-11-24 15:08:29 AKST — Merged `feature/core-crdt-network-hardening` into Local `main` & Verified End-to-End

- **Prompt time/date:** `2026-11-24 15:01:43 AKST` (`2026-11-24T15:01:43-09:00`)
- **Prompt:** *"I think we're good. can you test what you've got and merge back to main"*
- **Merge:** Fast-forward merged `feature/core-crdt-network-hardening` (`ea51d66a..6021d112`, Slices 1–3, 45 files, +4831/-1157) locally onto `main` in `/home/cos/projects/peercompute` (local only; not pushed). Preserved unrelated local uncommitted files (`peercompute/experiments/conjecture/*`, `plan/log/detail/main.md`).
- **Post-merge verification on `main`:**
  - Targeted Slice 1–3 + `stateManager` + `coreEntrypoint` + `workspaceBoundary` + `exopute`: **43/43 pass**
  - Full `npm --prefix peercompute run test:unit`: **1,417/1,418 pass** (0 regressions; only pre-existing external staged-ULG Eshkol fixture)
  - `test:capabilities` (**41/41**), `test:network-telemetry` (**23/23**), `test:inference` (**109/109**), `test:peer-inference` (**205/205**), `test:artifacts` (**75/75**), `test:global-chat` (**28/28**)
  - Go relay (`go test -v ./...` + `CGO_ENABLED=0 go build`): **5/5 pass** + clean static build
  - `npm run build:all` + `demo-ports.test.js` + `demo-release.test.js`: **clean build, 49/49 pass**
  - Live 2-browser headless Chrome P2P (`runtime-p2p.mjs` across `cubechat`, `hyperborea`, `sneakywoods`, `daddygo`, `netviz`): **PASS on both `floodsub` and `gossipsub`**


## 2026-11-24 15:10:37 AKST — Fix Inference Demo Registration & Vite Bundled ComputeWorker Regression

- **Prompt time/date:** `2026-11-24 15:10:37 AKST` & `2026-11-24 15:15:20 AKST`
- **Prompt:** *"did you break the inference demo?https://metaversejs.github.io/peercompute/inference/"* / *"Model inference runtime is not registered; load the full peercompute or optional inference entrypoint (or call registerModelInferenceFactory)"*
- **Root causes found (originating in `c5c24a76` `peercompute/core` vs `peercompute/inference` split):**
  1. `demos/inference/src/runtime.js` (and `peercompute/src/peercompute/inference/library/modelRuntimeController.js`, `demos/tests/network-telemetry-browser.mjs`) imported internal manager modules directly by relative path without importing `peercompute/src/peercompute/inference/registerInference.js`, leaving `extensionRegistry` unregistered in both `docs/inference/` and `docs/earth/`.
  2. `ComputeManager.createDefaultComputeWorker()` used `new Worker(registeredUrl || new URL('./computeWorker.js', import.meta.url), ...)` and `registerInference.js` passed `new URL('./computeWorker.js', import.meta.url)` to `registerDefaultWorkerBootstrapURL(...)`, defeating Vite's static `new Worker(new URL(...), { type: 'module' })` worker bundling and causing Vite to base64-inline raw unbundled worker source (`data:text/javascript;base64,...import ...`) across all built demos.
- **Fixes:**
  - Added `registerDefaultWorkerFactory` / `getDefaultWorkerFactory` to `peercompute/src/peercompute/runtime/extensionRegistry.js` (exported from `core.js` and `index.js`).
  - Updated `ComputeManager.createDefaultComputeWorker()` and `peercompute/src/peercompute/inference/registerInference.js` to use literal `new Worker(new URL('./computeWorker.js', import.meta.url), { type: 'module' })` calls so Vite/Rollup/Webpack bundle both core and inference workers into real chunks.
  - Imported `registerInference.js` in `demos/inference/src/runtime.js`, `peercompute/src/peercompute/inference/library/modelRuntimeController.js`, and `demos/tests/network-telemetry-browser.mjs`.
  - Updated `peercompute/tests/unit/coreEntrypoint.test.js` and added a built-artifact regression guard in `demos/tests/demo-release.test.js`.
- **Verification:** Rebuilt `inference`, `cubechat`, `earth`, and `vibeslopdb` (`0` raw base64 worker leaks; real bundled `computeWorker-*.js`, `ModelInferenceService-*.js`, `PeerInferenceService-*.js` emitted in all 4 demos); verified built `docs/inference/` directly in headless Chrome (`panelMounted: true`, `hasPrompt: true`, `hasButtons: 75`, real bundled worker task returned `42`, `0` page/console/HTTP errors); passed **613/613** tests across entrypoint/boundary/worker/exopute/demo-ports/demo-release (**80/80**), `test:inference` (**109/109**), `test:inference:ui` (**191/191**), `test:peer-inference` (**205/205**), and `test:global-chat` (**28/28**).


## 2026-11-24 15:35:34 AKST — Pushed `main` (`ea51d66a..81f7dc6d`) to `origin/main`

- **Prompt time/date:** `2026-11-24 15:35:34 AKST` (`2026-11-24T15:35:34-09:00`)
- **Prompt:** *"push"*
- **Actions:** Pushed `main` (`ea51d66a..81f7dc6d`, including Slices 1–3 core hardening and `81f7dc6d` inference registration + Vite `computeWorker` bundling fix) to `origin/main`, triggering `.github/workflows/pages.yml` (`Deploy PeerCompute Demos to GitHub Pages`, run `45519310539`).
- **Live verification:** Run `45519310539` succeeded (`build` 4m22s + `deploy` 14s). Verified live GitHub Pages CDN bundles (`computeWorker-B2YzNGzQ.js`, `computeWorker-CJCGqN2N.js`, `ModelInferenceService-Dp3woliu.js`, `PeerInferenceService-CJhzpr5X.js`, `0` raw base64 worker leaks) and headless Chrome across `https://metaversejs.github.io/peercompute/inference/` (`PeerCompute Chat`, `crossOriginIsolated: true`, `75` controls, `0` errors / `0` failed requests), `https://metaversejs.github.io/peercompute/earth/` (`EarthGrid // Real Data Platform`, `0` errors / `0` failed requests), and `https://metaversejs.github.io/peercompute/cubechat/` (`CubeChat Ready`, `0` errors / `0` failed requests).


## 2026-11-25 12:46:44 AKST — Overview of Tsotchke's `qLLM` (`semiclassical_qllm`)

- **Prompt time/date:** `2026-11-25 12:46:44 AKST` (`2026-11-25T12:46:44-09:00`)
- **Prompt:** *"what do you know about tsotchke's qllm?"*
- **Actions:** Read-only lookup across local sibling repos (`/home/cos/projects/semiclassical_qllm`, `/home/cos/projects/tech-stack`, `/home/cos/projects/GeoRefineInternal`) and PeerCompute's `tsotchkeModelCatalog.js` to summarize `semiclassical_qllm`'s architecture, backends, ecosystem role, and relationship to PeerCompute. No PeerCompute runtime code modified.


## 2026-11-25 12:48:45 AKST — Inspected `semiclassical_qllm` on `old-donkey` & Queried Tailnet ICC (`qchat`)

- **Prompt time/date:** `2026-11-25 12:48:45 AKST` (`2026-11-25T12:48:45-09:00`)
- **Prompt:** *"you should ssh into old-donkey and instpect the semiclassical qllm project there you can also ask icc about it here: https://100.121.14.68:8765/qchat"*
- **Actions:** Read-only SSH inspection of `old-donkey:/home/cos/projects/semiclassical_qllm` (branch `codex/qwen35-native-hybrid-parity-20260908` @ `5d9e9d2`, `build/lib/libsemiclassical_qllm.so`, `docs/QLLM_PAPER_CLAIMS_LEDGER.md`, `docs/QLLM_PRODUCTION_CAMPAIGN.md`, `docs/QLLM_SCIENTIFIC_VALIDATION_CAMPAIGN.md`, `docs/QLLM_ATTENTION_REPORT_2026-08-07.md`, `.icc/evidence/*`, `Selene/QLLM-CLAIMS-AUDIT-2026-08-26.md`), `old-donkey`'s `icc quality-campaign` & `architecture-summary`, and direct query to tailnet ICC via `https://100.121.14.68:8765/api/chat` (`endpoint: "icc"`). No PeerCompute runtime code modified.


## 2026-11-25 12:52:55 AKST — Authored WebGPU + WASM Specification for `semiclassical_qllm` on PeerCompute (Aligned with `humunculus.pdf`)

- **Prompt time/date:** `2026-11-25 12:52:55 AKST` (`2026-11-25T12:52:55-09:00`)
- **Prompt:** *"when you're done there please make a spec in order for us to be able to support models built with that on peercompute. I imagine we're going to need a webgpu enabled wasm runtime for the qllm. consider this while also considering the humunculus.pdf"*
- **Actions:**
  - Read `plan/README.md`, `plan/plan.md`, `plan/todo/priority.md`, `plan/demos/humunculus/humunculus.html` (`humunculus.pdf` source), PeerCompute's existing GGUF/ONNX inference stack (`ModelInferenceService.js`, `ArtifactReadBridge.js`, `GgufArtifactReader.js`, `gguf/{runtimeDefinition,engine,modelTask}.js`, `modelManifest.js`, `registerTaskModules.js`, `wasmRuntime.js`), and `old-donkey`'s `semiclassical_qllm` C backend/loader headers (`backend.h`, `shaders_manifest.json`, `eskb_checkpoint.h`, `eskb_checkpoint_ffi.h`, `grr_inference.h`, `hybrid_inference.h`, `directed_sheaf.h`, `geometric_vocabulary.h`, `CMakeLists.txt`).
  - Wrote durable architecture specification at `plan/arch/qllm-webgpu-wasm-spec.md` covering: lean `QLLM_WASM_INFERENCE` Emscripten target, dual `compact-wasm32` (FP32-first, no `shader-f16`/`memory64`, tailored for Humunculus 20–60 Hz motor/router loops) & `large-wasm64` (JSPI + `memory64` + 4 MiB `ArtifactReadBridge` streaming) profiles, `QLLM_BACKEND_WEBGPU` via `emdawnwebgpu` + `observeGpuDevice` telemetry hook, Tier 1–3 WGSL kernel matrix (including fused causal directed-sheaf top-k + D-operator targeting `T8`/`selection_is_constant_not_exponent`), `WESKB001` / `qllm-grr` / `georefine-v2` fail-closed admission, `QLLMST01` portable entity state snapshot/handoff format, multi-worker contention isolation, honest-claims provenance, and staged `Q0–Q5` acceptance gates.
  - Updated `plan/log/log-summary.md` and `plan/log/detail/main.md`; committed docs locally on `main` (no runtime code touched).

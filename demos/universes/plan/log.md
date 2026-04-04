# Implementation Log

## Initial Setup
-   Switched from React (`index.tsx`) to Vanilla JS (`main.js`).
-   Configured `index.html` to load ES modules.
-   Added `plan/plan.md` and `metadata.json`.

## Graphics Pipeline
-   Chosen `Three.js` (r167+) for `WebGPURenderer`.
-   Implemented a `Galaxy` class that uses TSL (Three Shading Language) or raw compute nodes to position millions of stars.
-   The "Time" variable is passed as a uniform to animate orbits.

## UI
-   Created a "Green Screen" CSS overlay.
-   Added scanline effects using CSS for the retro vibe.

## 2026-04-04 16:01:40 UTC - Cosmic Web Regression Diagnosis

- Prompt: `universes broke. can you identify why its not showing the cosmic web anymore`
- Diagnosis:
  - Current source/dev Universes still rendered the cosmic web correctly.
  - Production-style built/docs and live GitHub Pages Universes rendered black instead.
  - The regression was not in `generateUniverseDensity()` or the volume shader itself.
  - The real failure was in `ComputeManager` worker bootstrap under Vite production bundling: the worker was emitted as a `data:` module whose internal relative imports (`taskRuntime.js` and its runtime dependencies) failed.
  - Before the fix, that worker failure left `runComputeTask()` hanging on `generateUniverseDensity` / `generateUniverseData`, so `generateUniverse()` never reached the inline fallback path and the universe scene stayed empty.
- Fix:
  - Hardened `peercompute/src/peercompute/computeManager/ComputeManager.js` so worker bootstrap uses a self-contained inlined worker source and, more importantly, so worker failure removes the broken worker and re-runs stranded tasks inline instead of leaving them unresolved.
  - Added `peercompute/tests/unit/computeManager.worker.test.js` and `peercompute/tests/fixtures/computeManagerWorkerFixture.js` to lock in the worker-bootstrap and inline-fallback behavior.
- Validation:
  - `node --test peercompute/tests/unit/computeManager.worker.test.js peercompute/tests/unit/computeManager.wasm.test.js` passed.
  - `npm --prefix demos/universes run build` passed and emitted `docs/universes/assets/index-CIrBa6KX.js`.
  - Headless Chromium against locally served `docs/universes/` showed the cosmic web visible again in the rebuilt production artifact.
- Remaining note:
  - The built artifact still logs a warning that worker bootstrap failed and inline fallback is being used. Functionality is restored, but there is still room for a deeper bundler-specific worker cleanup if we want true worker execution in built docs.

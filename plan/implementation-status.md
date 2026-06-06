# Implementation Status

Updated: 2026-06-06 18:35:00 AKDT

## Current Focus
- ULG magnetar handoff orchestration across PeerCompute, Eshkol, MoonLab, and the ULG demo.

## Completed In This Checkpoint
- Durable ULG handoff envelopes now produce `peercompute.ulg.handoff-service-dispatch-plan.v0`.
- MoonLab quantum-response artifacts dispatch as `moonlab.ulg.quantum-response.ingest`.
- Eshkol closure artifacts dispatch as `eshkol.ulg.closure-artifact.ingest` or descriptor-bind tasks.
- `UlgHandoffServiceHost` can optionally execute dispatches through an injected service executor.
- WorkerSupervisor tests prove envelope, dispatch plan, dispatch result, and artifact-cache storage.
- `createUlgHandoffSupervisorServiceExecutor()` can submit dispatch tasks to registered
  MoonLab/Eshkol service hosts through `WorkerSupervisor`, preserving nested
  service results in the handoff dispatch result.
- Supervisor-submitted dispatch service tasks now include
  `peercompute.ulg.handoff-dispatch-artifact-payload.v0`, carrying the
  materialized artifact body/summary and transferred Eshkol WASM bytes while
  keeping the dispatch plan ref-based.
- Exported `UlgDispatchServiceHost` plus MoonLab/Eshkol dispatch service
  manifests so registered service hosts can validate and cache materialized
  dispatch payloads without relying on private test fixtures.
- Multiscale now builds browser module-worker shims for those dispatch adapters
  and exposes `runUlgDispatchServiceAdapterProbe()` /
  `executeUlgHandoffDispatchServices()` for live VPN execution.
- Dispatch adapters now run source-specific probes: MoonLab validates the
  materialized quantum-response calibration payload and Eshkol compiles complete
  transferred WASM modules to record import/export/entry-export metadata.
- Handoff supervisor dispatch results now include compact
  `peercompute.ulg.handoff-supervisor-service-summary.v0` records so callers can
  inspect MoonLab reference readiness, Eshkol descriptor/dry-runtime readiness,
  and gated smoke output-semantics execution without digging through raw nested
  service payloads.
- Multiscale `runUlgDispatchServiceAdapterProbe()` now returns top-level
  `serviceResultSummaries[]` with compact per-dispatch identity, ingest/probe
  status, host-runtime probe/execution, and output-semantics validation fields,
  while intentionally excluding artifact bodies and transferred WASM bytes.
- The Multiscale live browser API now returns `serviceDispatchPlan` from
  `applyUlgDemoHandoffForScenario()` and exposes
  `createUlgHandoffServiceDispatchPlan()` directly for VPN inspection.
- Eshkol descriptor probes now accept the explicit
  `computed-fixture` interpolation-table status only when the table carries the
  expected non-scientific fixture schema/scope, four MoonLab-aligned sample ids,
  a `sha256:` content hash, and `scientificValidation = false`. Compact service
  summaries expose the table status, computed-fixture flag, sample count, and
  hash.

## Verified
- `node --test peercompute/tests/unit/serviceOrchestration.test.js` passed.
- `npm --prefix demos/multiscale run build` passed with the existing large-chunk warning.
- Live VPN probe confirmed ULG `5173` exports two artifacts and Multiscale `5185`
  derives a ready two-dispatch service plan with no blockers.
- Live VPN probe confirmed Multiscale `5185` launches the MoonLab/Eshkol dispatch
  adapter workers, accepts two dispatches, caches two nested dispatch artifacts,
  and preserves Eshkol `53066` transferred WASM bytes with no blockers.
- Live VPN probe confirmed the Eshkol adapter worker compiled the transferred
  `53066`-byte WASM module with `33` imports, `1` export, and `main` present.
- Live VPN probe confirmed the real ULG `hello` smoke handoff reports
  `serviceResultSummaries.length = 2`, Eshkol
  `host-runtime-output-semantics-validated`, `entryResult = 0`,
  output semantics status `output-semantics-validated`, expected stdout SHA-256,
  no summary-level `wasmBytes`, and `scientificExecution = false`.
- Live probe confirmed the default ULG magnetar descriptor handoff reaches
  Multiscale with table status `computed-fixture`, sample count `4`, content
  hash `sha256:82ca16463d7ffe1d170adb266be61c3959b22a6c352751e99f0f510738a14165`,
  Eshkol descriptor probe ready, no blockers, and service-summary
  `scientificValidation = false`.
- Live probe confirmed the default ULG magnetar descriptor handoff now also
  carries guarded output semantics and executes as runtime smoke through the
  Eshkol adapter: `host-runtime-output-semantics-validated`, `entryResult = 0`,
  stdout hash
  `sha256:34a23605b7cacbeb83ef3391ae049c0bbcf38651b552eb9630eeca2165ca5768`,
  no output-semantics blockers, and `scientificExecution = false`.
- Multiscale scenario ingestion now executes descriptor closures as smoke when
  the handoff includes transferred WASM bytes plus explicit output semantics,
  while preserving descriptor readiness and keeping the scientific runtime gate
  blocked on validated solver evidence.
- `git diff --check` passed.

## Next
- Replace deterministic table-fixture acceptance with descriptor-aware
  execution/table-probe logic once the closure runtime contract is ready.
- Keep scientific-readiness language scoped to reduced calibrated magnetar runtime, not full GRMHD/PIC/radiation transport.
- Keep commits local only.

# Implementation Status

Updated: 2026-06-06 08:34:44 AKDT

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
- The Multiscale live browser API now returns `serviceDispatchPlan` from
  `applyUlgDemoHandoffForScenario()` and exposes
  `createUlgHandoffServiceDispatchPlan()` directly for VPN inspection.

## Verified
- `node --test peercompute/tests/unit/serviceOrchestration.test.js` passed.
- `npm --prefix demos/multiscale run build` passed with the existing large-chunk warning.
- Live VPN probe confirmed ULG `5173` exports two artifacts and Multiscale `5185`
  derives a ready two-dispatch service plan with no blockers.
- `git diff --check` passed.

## Next
- Wire the exported dispatch adapter hosts to real MoonLab/Eshkol browser worker
  modules and service assets instead of the current deterministic acceptance
  adapter.
- Keep scientific-readiness language scoped to reduced calibrated magnetar runtime, not full GRMHD/PIC/radiation transport.
- Keep commits local only.

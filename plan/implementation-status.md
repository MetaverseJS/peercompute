# Implementation Status

Updated: 2026-06-08 10:23:44 AKDT

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
- Multiscale `runUlgDispatchServiceAdapterProbe()` now supports compact
  `includeResults: false` raw-result omission and emits optional stage
  diagnostics for browser relay harnesses.
- Multiscale `runUlgDispatchServiceAdapterProbe()` now owns a
  `ResourceLeaseBroker` for the live service-adapter path. Each MoonLab/Eshkol
  dispatch submits a typed `peercompute.multiscale.ulg-dispatch-resource-request.v0`
  GPU-style lease through `WorkerSupervisor`, and the returned probe exposes
  `peercompute.service.resource-pressure.v0` telemetry, released lease counts,
  active lease count, and preemption count.
- The Multiscale live browser API now returns `serviceDispatchPlan` from
  `applyUlgDemoHandoffForScenario()` and exposes
  `createUlgHandoffServiceDispatchPlan()` directly for VPN inspection.
- Eshkol descriptor probes now accept the explicit
  `computed-fixture` interpolation-table status only when the table carries the
  expected non-scientific fixture schema/scope, four MoonLab-aligned sample ids,
  a `sha256:` content hash, and `scientificValidation = false`. Compact service
  summaries expose the table status, computed-fixture flag, sample count, and
  hash.
- Eshkol descriptor probes now expose descriptor-aware interpolation-table
  readiness: a computed fixture is not considered bound unless the table matches
  the tensor contract, the closure tensor runtime contract points at the same
  table id/schema/hash/sample count, and tensor sample-shape validation names
  the same input/output tensors.
- Multiscale now accepts direct ULG browser handoffs over
  `ulg.peercompute.browser-handoff-post.v0`, restricted to trusted ULG demo
  origins on port `5173`, dedupes repeated popup-load posts by `handoffId`, and
  replies with `peercompute.multiscale.browser-handoff-ack.v0`.
- The received browser handoff uses the same
  `applyUlgDemoHandoffAndRefreshCalibratedRuntimeEvidence()` path as manual
  import, so the scenario HUD, handoff readiness, and reduced calibrated runtime
  gate update together.
- Added formal live browser coverage for the ULG browser handoff receiver:
  `npm --prefix demos/multiscale run test:ulg-handoff` verifies the ULG launcher,
  Multiscale origin filtering, browser ack state, `handoff-ready` readiness,
  magnetar proxy visibility, and canonical suite/source/WASM hashes.
- `UlgDispatchServiceHost` now supports handler-backed service adapters through
  `peercompute.ulg.dispatch-service-handler-context.v0`. Real MoonLab/Eshkol
  implementations can consume the same validated materialized dispatch payload,
  probe, ingest summary, task, manifest, and lease context, then attach service
  output to the standard dispatch result/artifact without changing the durable
  ULG handoff envelope.
- Handoff supervisor service summaries now expose compact handler status:
  `serviceHandlerReady`, handler blockers, handler output schema/status/ready,
  and Multiscale per-dispatch summaries include the full handler
  `serviceOutput` for browser inspection.
- PeerCompute now ingests Eshkol's production handler implementation/runtime
  smoke evidence from the staged ULG handoff. Artifact summaries, dispatch
  adapter ingest, handoff supervisor summaries, Multiscale closure ingest,
  scenario readiness, packet boundary conditions, browser handoff smoke, and
  relay dispatch smoke preserve `eshkol.ulg.production-handler-implementation.v0`
  and `eshkol.ulg.production-handler-runtime-execution.v0`.
- The production handler boundary now reports
  `production-handler-runtime-smoke-executed`, `handlerReady = true`,
  `runtimeExecution = true`, implementation evidence count `5`, deterministic
  entry args, changed bytes inside the declared tensor range, tensor outputs,
  and host import call counts while keeping scientific validation, full physics
  validation, and full-fidelity magnetar simulation false.
- PeerCompute now preserves Eshkol's full-physics validation requirements from
  the production handler boundary. Artifact summaries, dispatch ingest, handoff
  supervisor summaries, Multiscale closure ingest/readiness/module probes,
  packet boundary conditions, browser handoff smoke, relay dispatch smoke, and
  the rebuilt docs bundle carry
  `eshkol.ulg.full-physics-validation-requirements.v0`,
  `declared-not-run`, readiness false, five required runtime-evidence families,
  four required hash fields, and the `full-physics-validation-not-run` blocker.
- Multiscale now compares those Eshkol full-physics requirements against the
  scenario runtime-evidence manifest with
  `peercompute.multiscale.scenario-full-physics-validation-compatibility.v0`.
  Handoff readiness and packet boundary conditions report missing, proxy-only,
  schema/scope/hash mismatch, and hash-complete compatible evidence separately.
  The live ULG handoff currently has five matched validated hash-complete
  reduced runtime evidence entries, but remains not ready because Eshkol still
  declares full-physics validation not run.

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
- Live reduced calibrated runtime evidence can now clear the explicit scientific
  gate after the ULG magnetar handoff: `refreshScenarioCalibratedRuntimeEvidence()`
  reports `runtime-evidence-ready`, `validatedCount = 5`,
  `scientific-runtime-ready`, and `scenarioScientificReady = true` for the
  reduced calibrated magnetar runtime.
- The Multiscale browser API now exposes
  `applyUlgDemoHandoffAndRefreshCalibratedRuntimeEvidence()` plus
  `runUlgMagnetarCalibratedDemo()` so a live ULG handoff can apply MoonLab/Eshkol
  artifacts and refresh the reduced calibrated runtime gate in one call. The
  return payload carries `peercompute.multiscale.ulg-calibrated-demo-runtime-scope.v0`
  with `reducedCalibratedRuntimeEvidence = true` and
  `fullFidelityMagnetarSimulation = false`.
- Multiscale calibrated-reference ingest now requires
  `ulg.magnetar.fidelity-runtime-scope.v0` before ready MoonLab magnetar
  references can clear the tolerance suite. The live one-call API now returns
  both `fullFidelityMagnetarSimulation = false` and
  `fullPhysicsValidation = false` in the calibrated runtime scope, and tolerance
  suite entries preserve `fidelityRuntimeScopeReady = true`.
- Strict live ULG `5173` to PeerCompute `5185` probe passed with
  `runtime-evidence-ready`, `validatedCount = 5`, `proxyOnlyCount = 0`,
  `missingCount = 0`, `scenarioScientificReady = true`, no blockers, and
  reduced-scope readiness for the `pic-kinetic-plasma` tolerance entry.
- Direct browser launch probe passed from ULG `http://127.0.0.1:5173/` to
  Multiscale `https://127.0.0.1:5185/?scenario=magnetar`: Multiscale reported
  `handoff-ready`, blocker count `0`, `simulationStatus = scientific-ready`,
  bridge ack `handoff-ready`, and visible magnetar proxy visual on the solar
  layer.
- `npm --prefix demos/multiscale run test:ulg-handoff` passed against the live
  ULG/Multiscale servers and confirmed canonical suite hash
  `sha256:7d4e6372e49689d2202914e210af84d19d776dc6fbc5b7e08b19cbedfb71b455`,
  Eshkol source hash
  `sha256:630b20dd243be58f8e53631e934d09298696fe7e7ea84b15e7d7b89d18809b69`,
  Eshkol WASM hash
  `sha256:e0a3c7d280678a8c1e40865daeab6601dc8a6a64cfa5b29b7b6bfcaddc86c5aa`,
  byte length `169528`, tensor runtime claim
  `deterministic-tensor-runtime-smoke-only`, linear memory status
  `entry-export-runtime-smoke-passed`, offset probe `runtime-smoke-passed`,
  changed bytes `64`, and production handler boundary
  `production-handler-runtime-smoke-executed`.
- `npm --prefix demos/multiscale run test:ulg-handoff` and
  `npm --prefix demos/multiscale run test:ulg-relay-handoff` now also assert the
  full-physics compatibility report from browser handoff readiness:
  status `runtime-evidence-compatible-pending-full-physics-validation`,
  required/matched/validated/hash-complete counts `5/5/5/5`,
  `runtimeEvidenceCompatible = true`, `ready = false`, and blocker
  `full-physics-validation-not-run`.
- PeerCompute descriptor regression now blocks tensor-runtime/table binding
  drift even when the interpolation table itself still reports
  `computed-fixture`: mismatched runtime table hashes and mismatched
  sample-shape tensor ids add explicit blockers before descriptor acceptance.
- Handler-backed dispatch regression proves both MoonLab and Eshkol dispatch
  hosts receive `peercompute.ulg.handoff-dispatch-artifact-payload.v0` through
  `peercompute.ulg.dispatch-service-handler-context.v0`, preserve probe/ingest
  status, and store handler service output in the standard dispatch artifact.
- Handler summary regression proves compact service summaries surface handler
  readiness and output schema/status/ready for both MoonLab and Eshkol dispatch
  results without copying raw artifact payloads.
- Eshkol production handler boundary ingestion now consumes
  `eshkol.ulg.production-handler-boundary.v0` as bounded runtime-smoke evidence.
  Artifact, dispatch, supervisor, browser adapter, and Multiscale summaries
  preserve `handlerReady = true`, `runtimeExecution = true`,
  `scientificValidation = false`, `fullPhysicsValidation = false`, and
  `fullFidelityMagnetarSimulation = false`; full-physics validation remains
  blocked as `full-physics-validation-not-run` and runtime smoke does not relax
  scientific gates.
- Eshkol production dispatch preflight ingestion now preserves
  `eshkol.ulg.production-handler-dispatch-preflight.v0` and production-host
  candidate metadata through artifact summaries, dispatch adapter probes,
  handoff supervisor summaries, Multiscale handoff readiness, module probes,
  and packet boundary conditions. Compact service-summary count fields now
  survive Multiscale normalization even when full import/check arrays are not
  present.
- Eshkol computed production dispatch preflight evidence now preserves
  `eshkol.ulg.production-handler-contract.v0` declaration fields plus
  `eshkol.ulg.production-handler-dispatch-preflight-check-summary.v0`,
  ordered `checkResults`, total required check count, passed check count,
  blocked check count, and passed/blocked check lists through artifact
  summaries, dispatch adapter ingest, handoff supervisor summaries, Multiscale
  scenario readiness, browser handoff smokes, and packet boundary conditions.
  Current evidence is 10 total checks, 9 passed, and 1 blocked after Eshkol's
  production handler implementation and runtime-execution smoke evidence
  landed.
- Eshkol production-candidate runtime probe evidence now preserves
  `eshkol.ulg.production-candidate-runtime-probe.v0` through artifact summaries,
  dispatch adapter ingest, handoff supervisor summaries, Multiscale scenario
  readiness, browser/relay handoff smokes, and packet boundary conditions.
  The current probe is explicitly smoke-only, reports changed bytes `64`, tensor
  outputs produced, host import calls `ulg_read_f64 = 12` /
  `ulg_write_f64 = 9`, and keeps production/science/full-physics readiness
  false.
- ULG service-worker imported Eshkol host-import module/factory evidence now
  preserves `closureHostImportsModule`, asset status `ready`, factory status
  `ready`, factory readiness, requirements schema/status, runtime scope
  `production-candidate-host-imports`, implementation status
  `production-candidate-runtime-imports-present`, and required non-stub import
  count `23` through PeerCompute artifact summaries, dispatch ingest, handoff
  supervisor summaries, Multiscale scenario readiness, packet boundary
  conditions, browser handoff smoke, the relay service envelope, and the relay
  dispatch-adapter service result summary. This confirms runtime import
  availability only; production handler/runtime/full-physics readiness remains
  false.
- Relay-backed focused runtime P2P smoke passed on 2026-06-06:
  `RUNTIME_P2P_DEMOS=hyperborea DEMO_PORT=4191 RELAY_CONFIG_TIMEOUT_MS=15000
  DEMO_TIMEOUT_MS=45000 node demos/tests/runtime-p2p.mjs` started the Go relay
  on a dynamic localhost port, wrote Hyperborea `relay-config.json`, connected
  multiple headless browser peers, and exited with `Runtime P2P tests passed`.
- `demos/tests/runtime-p2p.mjs` now snapshots and restores generated
  `relay-config.json` / `.relay-config.json` files around relay-backed smoke
  runs, preventing transient localhost bootstrap addresses from dirtying the
  tracked docs tree.
- Relay-backed ULG/Multiscale handoff smoke passed on 2026-06-06:
  `npm --prefix demos/multiscale run test:ulg-relay-handoff` started a dynamic
  Go relay, served `docs/multiscale`, injected STUN/TURN ICE config into the
  generated relay config, connected two Multiscale browser peers in one relay
  room, imported the live ULG `5173` handoff by browser `postMessage`, and
  verified `handoff-ready`, `service-envelope-ready`, `relaySafeArtifactCount=2`,
  `dispatch-ready`, the deterministic Eshkol tensor-offset runtime-smoke
  artifact (`169528` bytes, offset consumption true, changed bytes `64`), and
  clean relay-config restoration after teardown.
- Adapter-enabled relay smoke passed on 2026-06-06:
  `ULG_RELAY_HANDOFF_RUN_DISPATCH=1 npm --prefix demos/multiscale run
  test:ulg-relay-handoff` now records
  `dispatchAdapterStatus = dispatch-adapters-ready` and
  `acceptedDispatchCount = 2` with scientific scope flags remaining false. The
  resource-backed path now also reports
  `dispatchResourcePressureSchema = peercompute.service.resource-pressure.v0`,
  `dispatchResourceLeaseCount = 2`, `dispatchResourceActiveLeaseCount = 0`, and
  `dispatchResourcePreemptionCount = 0`. The previous blocker was the
  relay-served docs page resolving dispatch workers to raw hashed source assets
  with bare `@peercompute` imports; Multiscale now points the docs runtime at
  the stable bundled `assets/ulgMoonLabDispatchServiceHost.js` and
  `assets/ulgEshkolDispatchServiceHost.js` worker entries.
- Eshkol deterministic tensor-runtime candidate probing now executes inside the
  PeerCompute dispatch adapter. The adapter consumes the live ULG handoff
  artifact and transferred WASM bytes, instantiates them with deterministic
  `f64` tensor-memory host imports, writes declared input tensors at byte
  offsets `131072` and `131136`, invokes `main(131072, 131136)`, verifies the
  declared `magnetar-closure-update` and `closure-residual` output tensors,
  verifies `64` changed bytes in the declared tensor range, records candidate
  evidence under `peercompute.ulg.eshkol-tensor-runtime-candidate-probe.v0`, and
  still leaves production handler/runtime execution, scientific validation,
  full physics validation, and full-fidelity magnetar simulation flags false.
- MoonLab browser WebGPU parity-scope ingestion now accepts the current ULG
  `scope-ready-backend-detected` reduced artifact with `device-acquired`,
  executed `compute_probabilities`, `hadamard`, `pauli_x`, `pauli_z`, and
  `cnot` coverage, while still accepting legacy no-backend evidence and still
  preserving false full-fidelity/full-physics flags. Live ULG-to-Multiscale
  browser smoke asserts the fields on both sides of the handoff.
- Multiscale docs bundle was rebuilt after the receiver update, refreshing the
  hashed `docs/multiscale` assets for the current source.
- Current host-import bridge validation passed on 2026-06-06: syntax checks for
  the changed PeerCompute/Multiscale files passed; `node --test
  peercompute/tests/unit/serviceOrchestration.test.js` passed `28/28`; `node
  --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern
  "Eshkol closure bundle|descriptor-only Eshkol|production preflight
  counts|production handler boundary"` passed `198/198`; `npm --prefix
  demos/multiscale run build` passed with the existing large-chunk warning;
  `npm --prefix demos/multiscale run test:ulg-handoff` passed; and
  `ULG_RELAY_HANDOFF_TIMEOUT_MS=180000 ULG_RELAY_HANDOFF_RUN_DISPATCH=1 npm
  --prefix demos/multiscale run test:ulg-relay-handoff` passed after an initial
  90-second peer-visibility timeout.
- VPN coturn/backend dry-runs passed on 2026-06-06:
  `bash scripts/dev-vpn-coturn.sh --dry-run` selected VPN host
  `100.86.83.35`, `RELAY_LISTEN_HOST=0.0.0.0`, and TURN host
  `100.86.83.35:3478`; `npm run backend:dry-run` reported relay plus coturn
  launch commands without starting services.
- `git diff --check` passed.
- Current production handler runtime-smoke propagation validation passed on
  2026-06-07: syntax checks for changed PeerCompute service-orchestration
  files, Multiscale source files, and smoke scripts passed; `node --test
  peercompute/tests/unit/serviceOrchestration.test.js` passed `28/28`; `node
  --test demos/multiscale/tests/multiscaleModel.test.mjs` passed `198/198`;
  `npm --prefix demos/multiscale run build` passed with the existing large-
  chunk warning; `npm --prefix demos/multiscale run test:ulg-handoff` passed;
  an initial `ULG_RELAY_HANDOFF_TIMEOUT_MS=180000` relay run timed out before
  handoff dispatch while waiting for peer visibility; the rerun with
  `ULG_RELAY_HANDOFF_TIMEOUT_MS=300000` passed with two accepted dispatches,
  two released resource leases, production handler/runtime smoke summaries,
  `entryResult = 0`, output tensors produced, and all science/full-physics
  scope flags false.
- Current full-physics requirements propagation validation passed on
  2026-06-07: syntax checks for the changed PeerCompute/Multiscale source and
  smoke files passed; `node --test
  peercompute/tests/unit/serviceOrchestration.test.js` passed `28/28`; `node
  --test demos/multiscale/tests/multiscaleModel.test.mjs` passed `198/198`;
  `ULG_HANDOFF_URL=http://127.0.0.1:5173/ npm --prefix demos/multiscale run
  test:ulg-handoff` passed with magnetar visible and the requirements fields
  in the handoff/readiness summary; `npm --prefix demos/multiscale run build`
  passed with the existing large-chunk warning; and the 300s relay dispatch
  smoke passed with two connected browser peers, two accepted dispatches,
  requirements schema/status/family/hash/blocker propagation, and all
  science/full-physics scope flags false.
- Current full-physics runtime-evidence compatibility validation passed on
  2026-06-08: Multiscale syntax checks passed; `node --test
  demos/multiscale/tests/multiscaleModel.test.mjs` passed `200/200`;
  `ULG_HANDOFF_URL=http://127.0.0.1:5173/ npm --prefix demos/multiscale run
  test:ulg-handoff` passed; `npm --prefix demos/multiscale run build` passed
  with the existing large-chunk warning; and `ULG_HANDOFF_URL=http://127.0.0.1:5173/
  ULG_RELAY_HANDOFF_TIMEOUT_MS=300000 ULG_RELAY_HANDOFF_RUN_DISPATCH=1 npm
  --prefix demos/multiscale run test:ulg-relay-handoff` passed. Direct and
  relay handoffs both report runtime evidence compatible but final readiness
  blocked by `full-physics-validation-not-run`.
- Current ULG simulation artifact consumption path is implemented but scoped as
  runtime evidence only. PeerCompute normalizes optional
  `peercompute.ulg.simulation-artifact.v0` handoff entries as
  `simulation-delta`, records `peercompute.multiscale.ulg-simulation-artifact-summary.v0`
  in Multiscale packets/spec contracts, and now preserves ULG
  `peercompute.ulg.edge-message-summary.v0` pass/count/residual/out-of-range
  fields plus `peercompute.ulg.field-observer-summary.v0` observed-field,
  zero-weight, neighbor-count, and weight-sum fields through the handoff
  adapter, packet aggregate, spec-contract handoff, magnetar affordance, and
  `ulg sim edge` / `ulg sim field` readouts. It keeps
  `scientificRuntimeReady`, `fullPhysicsReady`, SPH/material readiness,
  material-property/phase-change readiness, and magnetar full-physics readiness
  false for CPU-reference `carrier-toy` artifacts. Current validation on
  2026-06-08 passed syntax checks, service orchestration `29/29`, Multiscale
  model `201/201`, Multiscale build with the existing large-chunk warning, live
  ULG handoff smoke, and a browser-injected field-observer probe that confirmed
  visible `ulg sim field` and false scientific/full-physics readiness.

## Next
- Promote the production handler runtime smoke into validated production
  physics only after full-physics validation artifacts, calibrated magnetar
  outputs, and named tolerance evidence exist.
- Keep scientific-readiness language scoped to reduced calibrated magnetar runtime, not full GRMHD/PIC/radiation transport.
- Keep commits local only.

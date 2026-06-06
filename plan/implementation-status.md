# Implementation Status

Updated: 2026-06-06 14:31:50 AKDT

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
  `sha256:73f2a89ffe3434d995ffe1174185462cf0c2edb653fbe4d1286342b788763052`,
  and Eshkol WASM hash
  `sha256:38902bb4b3f5ed8abf513a4d739ff9ca99727696df271c3ff17127575785b947`.
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
  `eshkol.ulg.production-handler-boundary.v0` as optional declared-not-executed
  evidence. Artifact, dispatch, supervisor, browser adapter, and Multiscale
  summaries preserve `handlerReady = false`, `runtimeExecution = false`,
  `scientificValidation = false`, `fullPhysicsValidation = false`, and
  `fullFidelityMagnetarSimulation = false`; overclaims are surfaced as boundary
  blockers and do not relax runtime or scientific gates.
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
  `dispatch-ready`, canonical MoonLab/Eshkol hashes, and clean relay-config
  restoration after teardown.
- VPN coturn/backend dry-runs passed on 2026-06-06:
  `bash scripts/dev-vpn-coturn.sh --dry-run` selected VPN host
  `100.86.83.35`, `RELAY_LISTEN_HOST=0.0.0.0`, and TURN host
  `100.86.83.35:3478`; `npm run backend:dry-run` reported relay plus coturn
  launch commands without starting services.
- `git diff --check` passed.

## Next
- Replace descriptor-bound fixture acceptance with execution/table-probe logic
  once the closure runtime contract can produce non-fixture table evidence.
- Wire concrete MoonLab/Eshkol production handlers into the handler-backed
  dispatch host once those services expose their runtime entry points.
- Promote the new relay-backed ULG/Multiscale handoff smoke from durable
  envelope/dispatch-plan coverage to full browser dispatch-adapter execution
  once the relay-served popup no longer destroys the execution context during
  `runUlgDispatchServiceAdapterProbe()`.
- Keep scientific-readiness language scoped to reduced calibrated magnetar runtime, not full GRMHD/PIC/radiation transport.
- Keep commits local only.

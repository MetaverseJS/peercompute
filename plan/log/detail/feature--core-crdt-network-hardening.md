# Detailed development log: `feature/core-crdt-network-hardening`

- **Branch:** `feature/core-crdt-network-hardening`
- **Worktree:** `/home/cos/projects/peercompute-core-hardening` (branched from `main` at `ea51d66a`; `/home/cos/projects/peercompute` left completely untouched for ULG)
- **Started:** 2026-11-24

## 2026-11-24 11:29:58 AKST — Start Core CRDT, Networking, Conjecture & Compute Hardening in Isolated Worktree

- **Prompt time/date:** `2026-11-24 11:29:58 AKST` (`2026-11-24T11:29:58-09:00`)
- **Prompt:** *"yes that sounds great. I'd like you to do this work inside a worktree to as to not disturb another library using this folder. have you already merged the other reorg work back to main?"*

### Setup
- Created isolated worktree `/home/cos/projects/peercompute-core-hardening` on branch `feature/core-crdt-network-hardening` from `main` (`ea51d66a`).
- Ran `npm ci` inside the worktree (`1,634` packages installed cleanly, Node `v24.18.0`).
- Called ICC `codebase_work` (query-only) for `core-crdt-network-hardening`.
- Added task plan `plan/todo/core-crdt-network-hardening.md` and registered it at #1 in `plan/todo/priority.md`.

### 2026-11-24 11:46 AKST — Slice 1 Complete (CRDT & State Core Hardening)

- **Files modified:**
  - `peercompute/src/peercompute/networkManager/NetworkManager.js` (`addMessageHandler` returns unsubscribe fn, added `removeMessageHandler`)
  - `peercompute/src/peercompute/stateManager/PeerComputeProvider.js` (base64 wire encoding with array/Uint8Array compat, skip empty 2-byte `[0, 0]` Yjs updates, suppress re-broadcast on remote origins, guard `destroyed`, detach handler in `destroy()`, `.unref?.()` timer)
  - `peercompute/src/peercompute/stateManager/DataState.js` (deterministic Yjs root named maps `ns:<namespace>` with read-only legacy nested-map fallback)
  - `peercompute/src/peercompute/stateManager/StateManager.js` (root named maps `ns:<namespace>`, read-only `observeNamespace()`, suppress duplicate `state-set` broadcasts when `PeerComputeProvider` is active, safe IndexedDB detection + bounded sync timeout + coalesced `initialize()`, bounded invalidation audit namespace, `onDestroy` unregistration/forwarding for caches/ledgers/brokers)
  - `peercompute/src/peercompute/nodeKernel/NodeKernel.js` (opt-in `enableNetVizDebugTelemetry` default `false`, keep node-local lifecycle metadata out of shared room CRDT root, skip double `yjs-update` apply when provider active, reject pending remote compute/task-graph RPCs & destroy `GPUHub` in `_cleanupManagers()`, reject duplicate `requestId`, ignore spoofed peer compute results without cancelling live RPCs, coalesce `initialize()`/`start()`, forward `start(bootstrapPeers)`, stop timers on failed `start()`, `.unref?.()` timers, wrap async message handlers, fix `normalizeInteger`/`normalizeFiniteNumber` null coercion, fix `_buildPresenceCapabilities` WebGPU advertising, fix hot-buffer refresh predicate & seed lease-rejection guard)
  - `peercompute/src/peercompute/gpu/GPUHubManager.js` (`destroy()`, owned buffer/device lifecycle tracking, `ResidentStageWorkerBackend` error/messageerror/postMessage/timeout handling)
  - `peercompute/src/peercompute/stateManager/ReservationLedger.js` (stale-epoch check before missing-key insert, `onDestroy` callback)
  - `peercompute/src/peercompute/stateManager/SpatialTileLeaseBroker.js` ($O(T)$ `listTiles()`, `maxTotalBoundaryBytes` budget + boundary byte cleanup on release/expiry/eviction/destroy, value-based token matching, anti-reentrancy event collection, expiry-first `evictPeer()`, retire external ledger leases + `onDestroy` in `destroy()`)
  - `peercompute/src/peercompute/stateManager/LocalArtifactCache.js` (eliminate full-store IDB rewrite/getAll on memory hits, run caller `validate` on memory hits, isolate coalesced byte buffers, block stale resurrection on delete/clear/abort, bounded `destroy()` inflight wait)
  - Updated `peercompute/tests/stateManager.unit.test.js`, `peercompute/tests/unit/nodeKernel.netvizDebug.test.js`, `peercompute/tests/unit/nodeKernel.start.test.js`; added `peercompute/tests/unit/coreHardeningSlice1.test.js`.
- **Validation:**
  - `node --test peercompute/tests/stateManager.unit.test.js peercompute/tests/unit/coreHardeningSlice1.test.js peercompute/tests/unit/nodeKernel.start.test.js peercompute/tests/unit/agentRecordStoreBrowser.test.js` -> **37/37 pass**.
  - Full `npm --prefix peercompute run test:unit` -> **1,397/1,400** (1 pre-existing ULG staged artifact test on `main`; the 2 others — `nodeKernel.start.test.js:207` updated and `agentRecordStoreBrowser.test.js` transient Chrome contention — subsequently passed 37/37).
- **Local commit:** `8fdae4ac` (`Harden CRDT sync, StateManager namespaces, NodeKernel lifecycle & lease stores (Slice 1)`).

### 2026-11-24 12:00 AKST — Slice 2 Complete (Networking, Trust Boundaries, Conjecture & Relays)

- **Files modified:**
  - `peercompute/src/peercompute/networkManager/NetworkManager.js`: removed `plaintext()` encrypter (`[noise()]` only); fixed `this.config` merge precedence (`...definedConfig` before `...defaults`, clamped `targetConnections <= maxConnections`); authenticated pubsub sender binding (drop `unsigned` / mismatched `detail.from`, propagate verified `from`) and direct unicast sender binding (`connection.remotePeer`); strict `_matchesScope` requiring non-empty exact `gameId` & `roomId`; direct unicast `newStream` dedup (`directUnicastOpening`), 3s `AbortSignal.timeout`, bounded `pendingWrites` (128), and `.slice()` tail copy; fixed `setConnectionLimits()` (`_getConnectionManager()`, clamp `target <= max`); fixed `_sampleRtt()` `this`-binding, disconnect guard, and `candidatePairRttMs` preservation; fixed `unsubscribeTopic()` libp2p unsubscription; skipped offline/unconnected bootstrap relays in `_getAnnounceAddrs()`; published/stored `hostGroupId` in presence; centralized `_cleanupPeerState(peerId)` & full `disconnect()` cleanup; fixed peer lifecycle parity (`_handlePresence`, `_pruneStalePeers`, `_recordRx`/`_recordTx` guard); fixed trial-link `linkSince` reset, `_ensureTopologyConnections` live-conn check, `_maybeDialPeer` `throughputPendingLinks` cleanup; `.unref?.()` timers.
  - `peercompute/src/peercompute/networkManager/ThroughputTopologyPolicy.js`: aligned `capabilityTierScore` with nested `capabilities.compute` schema from `NodeKernel._buildPresenceCapabilities()` (with flat fallback); removed WAN-spoofable RFC1918 multiaddr regex from `lan-first` `isLanPeer`; fixed double `setCooldown`; bounded `failCounts` (>256); cleared `baselines` on profile switch.
  - `peercompute/src/peercompute/networkManager/TopologyController.js`: clamped `targetConnections <= maxConnections`; time-bucketed `_pickLongRange` seed (`${peerId}:${Math.floor(now / refreshMs)}`) so small-world bridges actually rotate; reserved `longRangeCount` slots when `hasFarCandidates` exists; bounded `referralPeers` (128) + $O(1)$ `candidateMap.get()`.
  - `peercompute/src/peercompute/networkManager/NetworkScheduler.js`: local `Date.now()` in `recordRx`; bounded `seenReliableEventIds` (2048) dedup while always re-ACKing; `try/catch` around handlers; unsubscribe disposers returned from `add*Handler`; bounded `eventQueue` (512) & `pendingReliableEvents` (256); enforced `snapshotsRequireAuthority` before invoking providers.
  - `peercompute/src/peercompute/workMesh/WorkMesh.js`: integer `taskId` & payload validation + `try/catch` around `onResult`/`execute`; bounded `queue`/`results`/`origins`; reentrancy guard in `_pump`; reject pending `jobs` and clear maps in `destroy()`.
  - `peercompute/src/peercompute/networkManager/WorkMeshService.js`: fixed `getPeerTelemetry().inFlight`; idempotent `start()` + `.unref?.()` timer; rejected non-direct/limited inbound streams; cleared `peer.opening` in `_reset()`; re-checked `peer.out` after `shape` delay in `_flush()`.
  - `peercompute/src/peercompute/core.js` & `peercompute/src/peercompute/index.js`: exported `WorkMesh`, `WORK_MESH_SCHEMA`, `WORK_MESH_DEFAULTS`, `WorkMeshService`, `WORK_MESH_PROTOCOL` with zero inference import edges.
  - `peercompute/src/relay-go/main.go` & `peercompute/src/relay-go/main_test.go`: global (`512`) + per-peer (`16`) dynamic auto-sub topic caps & topic name validation; serialized `ensureForPeer` (`joinMu`); lowered `MaxReservationsPerIP` default (`32`) & `MaxReservationsPerASN` (`128`), env-configurable; bounded `/peercompute/keepalive/1.0.0` (4 KiB chunk, 1024 frames, 256 KiB total, 30s idle); peer directory strictly bound to authenticated `msg.GetFrom()` + bounded entries (`4096`) & addrs (`16`) + scoped `*.presence` watching; `errors.Is(err, os.ErrNotExist)` for identity file check; added Go unit tests for per-peer topic quota and directory bounds.
  - `peercompute/src/relay/server.js`: removed `plaintext()` (`[noise()]` only); bounded circuit limits enabled by default (`applyDefaultLimit: !relayInfiniteLimits`); global + per-peer dynamic topic caps & name validation; bounded keepalive handler; authenticated `evt.detail.from` peer directory + bounds + null-safe `from?.toString?.()`; graceful `SIGINT`/`SIGTERM` cleanup + `.unref?.()`.
  - Updated `peercompute/tests/unit/workMesh.test.js`, `peercompute/tests/unit/coreEntrypoint.test.js`, and added `peercompute/tests/unit/coreHardeningSlice2.test.js`.
- **Validation:**
  - Targeted Slice 2 unit + networking + WorkMesh + entrypoint + workspace + exopute tests -> **176/176 pass**.
  - `npm run test:capabilities` -> **41/41 pass**.
  - `cd peercompute/src/relay-go && go test -v ./... && CGO_ENABLED=0 go build` -> **5/5 pass** and static binary builds cleanly.
- **Local commit:** `75466d99` (`Harden P2P trust boundaries, networking, WorkMesh conjecture exports & relays (Slice 2)`).

### 2026-11-24 12:30 AKST — Slice 3 Complete (Compute Security, Provenance, Quorum & Lease Hygiene) + Full E2E Validation

- **Files added / modified:**
  - Added `peercompute/src/peercompute/computeManager/remoteModulePolicy.js`: shared `assertSafeRemoteModuleUrl`, `assertSafeRemoteTaskUrls`, `stableCanonicalValue` (`DataView`, `BigInt`, `-0`, cycle guard), `sha256StableHash` (`@noble/hashes/sha2.js`), and `fnv1a32StableHash`.
  - `peercompute/src/peercompute/computeManager/taskRuntime.js`: enforced safe remote module URL checks & remote `fn` prohibition when `remote: true`; propagated `AbortSignal` & `context` into JS/WASM/WASM-WebGPU execution.
  - `peercompute/src/peercompute/computeManager/runtime/wasmRuntime.js`: evicted rejected promises from `helperModuleCache` & `wasmModuleCache`; validated remote helper/WASM URLs; tracked & destroyed task-created `GPUDevice`s in `finally` unless `keepDeviceAlive: true`; propagated `AbortSignal` into `fetch` and async stages.
  - `peercompute/src/peercompute/nodeKernel/NodeKernel.js`: validated remote compute & task-graph module/WASM URLs against `_getRemoteModulePolicy()`; namespaced responder `affinityKey` (`remote:<peerId>:<key>`); enforced `requireWorker: true` on responders when workers exist (`allowRemoteInlineFallback !== true`); recomputed authoritative task-packet hashes locally on responders; sanitized incoming remote task graphs (stripped `cacheAdmission`, `taskGraphExecutor`, cache writes, forced `advisoryOnly: true` on node placement hints); removed fail-open `|| payload?.taskPacket` fallback in `_buildNetworkPlacementResultEnvelope` and computed SHA-256 `outputHash`/`commitDeltaHash` locally from received payload bytes; wired `options.signal` abort cleanup in `submitRemoteComputeTask`.
  - `peercompute/src/peercompute/computeManager/ComputeManager.js`: removed fail-open `|| taskPacket?.{code,input,task}Hash` provenance backfills; fixed `!placement.advisory` -> `!placement.advisoryOnly`; tracked `pendingPreDispatchTasks` and fixed pre-dispatch broker abort hang (rejecting + releasing lease cleanly on abort/cancel/`destroy()`); centralized `_releaseTaskResourceLease` in `finish()`; mirrored GPU resident lane lease acquisition/completion/rejection and required GPU fence checks in worker dispatch/completion; isolated `DataCloneError` in `postMessage` without killing healthy workers; re-enqueued stranded tasks on worker crash while healthy workers exist instead of falling back inline; propagated `AbortSignal` through inline tasks, remote placement executor/retry sleep (`sleepMs`), and `submitTaskGraph`/`cancelTaskGraph`; deleted dead `// TODO` methods and shadowed `_scheduleNext`; replaced `stableTaskValue` with `stableCanonicalValue`.
  - `peercompute/src/peercompute/computeManager/RemoteResultQuorumValidator.js`: switched hashing to SHA-256 (`@noble/hashes/sha2.js`) with `DataView`/`BigInt`/cycle support; added `verifyPayloadDigests` catching tampered `sha256-`/`fnv1a32-` digests against actual payload values; added `requireDistinctPeers` Sybil deduplication across primary + replicas.
  - `peercompute/src/peercompute/computeManager/PlacementAdmissionPolicy.js`: preserved explicit `allowedPlacements: []`; enforced `requireTrustedPeer` for `'cluster'` as well as `'peer'`; fixed omitted `placement.confidence` bypassing `minConfidence > 0`; fixed `null`/`''`/`boolean` numeric coercion.
  - `peercompute/src/peercompute/computeManager/GpuResidentLaneManager.js`: resolved lease objects through `this.leases.get(leaseId)` (`_resolveLease`); added async `waitForGpuFence()` awaiting real `queue.onSubmittedWorkDone()`; rejected duplicate `stage.id` (`ERR_GPU_RESIDENT_LANE_STAGE_DUPLICATE_ID`) and concurrent lane write-family conflicts (`ERR_GPU_RESIDENT_LANE_FAMILY_CONFLICT`).
  - `peercompute/src/peercompute/serviceOrchestration/ResourceLeaseBroker.js`: rejected `units > pool.units` instead of clamping; implemented atomic two-phase preemption so zero victims are preempted when total capacity cannot satisfy the request.
  - `peercompute/src/peercompute/serviceOrchestration/ChildWorkerLeaseManager.js`: enforced `sameOriginOnly` even without `baseUrl` and rejected opaque/unsafe schemes (`data:`, `blob:`, `file:`, `javascript:`, `//`); serialized `request()` calls to prevent concurrent quota races across async broker awaits.
  - `peercompute/src/peercompute/serviceOrchestration/WorkerSupervisor.js`: skipped `getTreeTelemetry()` when `listeners.size === 0`; failed pending service tasks on host `'error'`, failed `postHostMessage`, and `shutdown()` while releasing resource leases.
  - `peercompute/src/peercompute/serviceOrchestration/ComputeManagerServiceAdapter.js`: forwarded `cancelTask` + `AbortSignal` on cancel; stopped firing host `'error'` event on single-task failures; prevented duplicate `task-error` after cancel.
  - Updated test mocks for fail-closed provenance / allowlist in `computeManager.commitDelta.test.js`, `placementAdmissionPolicy.test.js`, `remoteResultQuorumValidator.test.js`, `nodeKernel.remoteCompute.test.js`; added `peercompute/tests/unit/coreHardeningSlice3.test.js`.
- **Final end-to-end validation:**
  - Slice 1+2+3 targeted suite (`coreHardeningSlice{1,2,3}` + ComputeManager + NodeKernel + serviceOrchestration + coreEntrypoint + workspaceBoundary + exopute): **152/152 pass**.
  - `npm run test:capabilities` (**41/41**), `npm run test:inference` (**109/109**), `npm run test:peer-inference` (**205/205**), `npm run test:artifacts` (**75/75**), `npm run test:global-chat` (**28/28**) -> **100% pass**.
  - Full `npm --prefix peercompute run test:unit`: **1,417/1,418 pass** (0 regressions; single failure is the pre-existing external staged-ULG Eshkol fixture on `main`).
  - `cd peercompute/src/relay-go && go test -v ./... && CGO_ENABLED=0 go build`: **5/5 pass** + clean static binary build.
  - `npm run build:all` + `node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js`: **clean build & 49/49 pass**.
  - Live 2-browser headless Chrome P2P (`CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome node demos/tests/runtime-p2p.mjs`) across `cubechat`, `hyperborea`, `sneakywoods`, `daddygo`, `netviz`: **PASS on both default `floodsub` AND `RELAY_PUBSUB=gossipsub`**.
- **Local commit:** `44813ea5` (`Harden remote compute security, provenance, quorum & lease hygiene (Slice 3)`).

## 2026-11-24 13:25:56 AKST — Demo Behavior Impact Review

- **Prompt time/date:** `2026-11-24 13:25:56 AKST` (`2026-11-24T13:25:56-09:00`)
- **Prompt:** *"great did you notice any improvements to the demo behavior as a result of the changes?"*
- **Actions:** Inspected `demos/tests/runtime-p2p.mjs`, the live 2-browser P2P run logs (`task-3437`), and demo call sites across `demos/*/src/` (`cubechat`, `hyperborea`, `sneakywoods`, `daddygo`, `netviz`, `multiscale`, `vibeslopdb`, `schrodinger`) to separate directly observed pass/fail smoke outcomes from unmeasured A/B performance deltas and architectural behavior changes. No source code modified.

## 2026-11-24 14:05:32 AKST — Next Priority Recommendation

- **Prompt time/date:** `2026-11-24 14:05:32 AKST` (`2026-11-24T14:05:32-09:00`)
- **Prompt:** *"what do you want to attack next?"*
- **Actions:** Reviewed remaining open tasks in `plan/todo/` (`keystone-demo.md`, `root-node.md`, `retire-multiscale-and-webpack.md`) and remaining P1/P2 architectural items from `architecture-and-code-review.md` to recommend the highest-leverage next move. No source code modified.

## 2026-11-24 15:01:43 AKST — Final Test Pass & Merge to Local `main`

- **Prompt time/date:** `2026-11-24 15:01:43 AKST` (`2026-11-24T15:01:43-09:00`)
- **Prompt:** *"I think we're good. can you test what you've got and merge back to main"*
- **Actions:** Committed branch detail log updates on `feature/core-crdt-network-hardening`, fast-forward merged locally into `main` at `/home/cos/projects/peercompute` (preserving unrelated local uncommitted files under `peercompute/experiments/conjecture/` and `plan/log/detail/main.md`), and ran full post-merge validation on `main`.

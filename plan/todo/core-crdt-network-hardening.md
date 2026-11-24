# Core CRDT, Networking, Conjecture & Compute Hardening

Status: active
Branch: `feature/core-crdt-network-hardening`
Worktree: `/home/cos/projects/peercompute-core-hardening` (branched from `main` at `ea51d66a`; `/home/cos/projects/peercompute` left untouched while ULG depends on it)

## Goal

Fix the highest-impact core bugs, trust-boundary holes, CRDT corruption/amplification issues, and conjecture/networking gaps identified in the 2026-11-24 library code & architecture review across three focused slices:

### Slice 1 — CRDT & State Core (`StateManager`, `DataState`, `PeerComputeProvider`, `NodeKernel`, `SpatialTileLeaseBroker`, `ReservationLedger`, `LocalArtifactCache`)
- Eliminate the $O(N^2)$ dual state-sync feedback storm: make `PeerComputeProvider` the sole CRDT sync path when active (disable redundant `state-set` broadcast by default when provider is active, avoid double `yjs-update` handling in `NodeKernel`, recognize remote sync origins in `PeerComputeProvider._onDocumentUpdate`).
- Move scoped namespaces in `StateManager` & `DataState` from nested `new Y.Map()` inside `this.state` to Yjs root named maps (`this.ydoc.getMap('ns:' + namespace)`), eliminating silent concurrent-initialization LWW data loss and making `observeNamespace()` 100% read-only.
- Stop `NodeKernel` from clobbering shared room root keys (`nodeId`, `status`, `connectedPeers`, `topology`, `createdAt`), keep node-local lifecycle state local (with `StateManager.localNodeId`), and default `enableNetVizDebugTelemetry` (2-second CRDT delta pump) to `false` so idle nodes do not bloat Yjs/IndexedDB.
- Harden `PeerComputeProvider`: add `NetworkManager.removeMessageHandler()` + unsubscribe disposer to fix permanent `Y.Doc` leak on `destroy()`, guard post-destroy callbacks, fix 2-byte empty `Uint8Array([0, 0])` sync-storm check, support compact base64 update wire encoding (backward-compatible with byte arrays), and guard `StateManager.initialize()` cleanly when IndexedDB is unavailable.
- Harden `NodeKernel` lifecycle & hot-buffer refresh: cancel/reject pending remote RPC timers on `_cleanupManagers()`, guard duplicate `requestId`, implement `GPUHubManager.destroy()`, fix `refreshRemoteTaskGraphHotBuffersFromSeed` missing failure check & `refreshRemoteGpuResidentStageHotBuffersFromAdmission` `leaseId` lookup bug, guard unhandled async network message rejections (`_handlePing` etc.), and ignore unexpected-peer compute results without aborting pending RPCs.
- Harden `SpatialTileLeaseBroker`, `ReservationLedger`, and `LocalArtifactCache`: eliminate $O(T^2)$ `listTiles()`/`snapshot()`, enforce aggregate boundary byte budget & clear stale `lastBoundary` on expire/evict/release, compare lease tokens by value (worker/RPC safe), fix re-entrancy & `evictPeer` ordering, wire `onDestroy` unregistration in `StateManager`, fix `ReservationLedger` rejected-reserve capacity leak, and fix `LocalArtifactCache` full-store IDB `getAll()` on memory hits + stale resurrection on delete/clear/destroy + aliased mutable buffers.

### Slice 2 — Core Networking, Trust Boundaries, Conjecture & Relays (`NetworkManager`, `ThroughputTopologyPolicy`, `WorkMesh`, `WorkMeshService`, `TopologyController`, `NetworkScheduler`, `relay-go/main.go`, `relay/server.js`)
- Security & trust boundaries: remove `plaintext()` from `NetworkManager` and `relay/server.js` (`[noise()]` only, with explicit test-only opt-in if needed); enforce authenticated libp2p sender identity (`evt.detail.from` / `connection.remotePeer`) on pubsub, direct unicast, and relay peer directories; require exact non-empty `gameId`/`roomId` matching in `_matchesScope`.
- Core `NetworkManager` correctness & leaks: fix detached `ping()` crash/RTT wipe/zombie peer resurrection; fix constructor `...definedConfig` clobbering normalized `pubsubType`, clamped limits, and `expandScoreParamTopics`; fix `setConnectionLimits()` to use `_getConnectionManager()` (`libp2p.components.connectionManager`); fix `DirectUnicast` concurrent-open stream leak, open timeout, and bounded queue; fix `_getAnnounceAddrs()` phantom circuit addrs after dropping relay; fix `unsubscribeTopic()` libp2p unsubscribe; centralize per-peer cleanup and add `.unref?.()` to background timers; fix `NetworkScheduler` remote-clock stall bug & receiver reliable-event dedup.
- Conjecture & Keystone readiness: export `WorkMesh` and `WorkMeshService` from `peercompute/core` and `peercompute/index.js`; fix `WorkMesh._accept()` `taskId` bounds/validation, `_pump()` throw/reentrancy deadlock, `destroy()` pending job rejection, and `WorkMeshService.getPeerTelemetry()` `inFlight` calculation + `_reset()` `opening` flag + direct-only inbound guard; fix `ThroughputTopologyPolicy` (`capabilityTierScore` matching `NodeKernel` schema, ICE-only `lan-first` + presence `hostGroupId`, double cooldown bug, trial `linkSince` zero-duration eviction, `throughputPendingLinks` leak, profile-switch baseline reset); fix `TopologyController` constant-seed `longRangeRefreshMs` and starved small-world links.
- Relay hardening: cap dynamic auto-subscribed topics, per-IP reservations, and keepalive echo frames on `relay-go/main.go` and `relay/server.js`; fix `relay-go` `ensureWithPin` nil-clobber race and scoped `.presence` directory indexing.

### Slice 3 — Core Compute Security, Correctness & Lease Hygiene (`ComputeManager`, `RemoteResultQuorumValidator`, `PlacementAdmissionPolicy`, `GpuResidentLaneManager`, `serviceOrchestration`)
- Lock down remote compute execution in `NodeKernel` / `taskRuntime` / `wasmRuntime`: block unvalidated remote `data:`/`blob:`/`file:`/cross-origin module & WASM URLs by default, forbid inline fallback for remote tasks, namespace remote `task.id`/`affinityKey`, strip untrusted `cacheAdmission`/`placementHint`.
- Fix fail-open remote provenance verification (remove local `taskPacket` hash backfills) and upgrade `RemoteResultQuorumValidator` + `NodeKernel`/`ComputeManager` hashing to compute digests locally over actual bytes with SHA-256 (`@noble/hashes/sha2`), fixing `DataView`/`BigInt`/non-finite floats/cycle guards and responder `peerId` deduplication.
- Fix `PlacementAdmissionPolicy` fail-open empty `allowedPlacements` and `'cluster'` trust bypass.
- Fix `ComputeManager` abort-hang during broker lease acquisition, `!placement.advisory` -> `!placement.advisoryOnly` typo, worker GPU lane lease & fence bypass, centralized lease release in `finish()`, and end-to-end abort propagation; fix `GpuResidentLaneManager` detached clone mutation & real `onSubmittedWorkDone()` async fence; fix `ResourceLeaseBroker` two-phase atomic preemption, `ChildWorkerLeaseManager` `sameOriginOnly` bypass, `WorkerSupervisor` hanging promises + O(N²) telemetry, and `ComputeManagerServiceAdapter` cancellation.

## Acceptance Checks

- All new regression unit tests covering every fixed bug in Slices 1, 2, and 3 pass.
- Full `npm --prefix peercompute run test:unit` passes with zero new regressions (only the pre-existing external staged-ULG fixture `serviceOrchestration.test.js:4095`).
- `node --test peercompute/tests/stateManager.unit.test.js` passes.
- `cd peercompute/src/relay-go && go test -v ./... && CGO_ENABLED=0 go build` passes.
- `node --test peercompute/tests/unit/workspaceBoundary.test.js peercompute/tests/unit/coreEntrypoint.test.js packages/exopute/tests/exopute.test.js` passes.
- `npm run test:network-telemetry`, `npm run test:capabilities`, `npm run test:artifacts`, `npm run test:inference`, `npm run test:peer-inference`, `npm run test:global-chat` pass.
- Live 2-browser headless Chrome P2P (`CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome node demos/tests/runtime-p2p.mjs` on both `floodsub` and `gossipsub`) passes against freshly built `docs/`.
- `/home/cos/projects/peercompute` remains completely untouched throughout.

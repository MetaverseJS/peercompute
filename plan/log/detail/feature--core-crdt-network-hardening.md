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

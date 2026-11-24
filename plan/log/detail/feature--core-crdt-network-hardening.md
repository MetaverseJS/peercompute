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

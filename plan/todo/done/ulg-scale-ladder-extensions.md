# Branch Plan: `feat/ulg-scale-ladder-extensions`

- **Created:** 2026-11-23
- **Branch:** `feat/ulg-scale-ladder-extensions` (off `main` `47b0cbfd`)
- **Source request:** [plan/todo/ulg-scale-ladder-peercompute-extensions.md](../todo/ulg-scale-ladder-peercompute-extensions.md) (requested by ULG `feat/star-spec-generalization-audit`, authorized by **big dog** on 2026-11-23)
- **Design boundary:** Every extension belongs strictly to PeerCompute's core infrastructure layer — slim packaging, epoch-fenced spatial tile leasing with opaque binary payloads, WebRTC ICE/STUN/TURN config surfacing & fail-closed peer-disconnect hooks, and priority-aware warm worker lease affinity bounded by `ResourceLeaseBroker`. Zero ULG physics domain logic inside PeerCompute.

## Goals & Deliverables

### 1. First-Class Slim `peercompute/core` & `peercompute/inference` Entrypoints
- Add `"exports"` (`"."`, `"./core"`, `"./inference"`, `"./*"`) in `peercompute/package.json`.
- Create `peercompute/src/peercompute/core.js` exporting strictly the requested slim core surface (`NodeKernel`, `ComputeManager`, `StateManager`, `ReservationLedger`, `SpatialTileLeaseBroker`, `DataState`, `LocalArtifactCache`, `NetworkManager`, `DIRECT_UNICAST_PROTOCOL`, `THROUGHPUT_TOPOLOGY_PROFILES`, `GPUHubManager`, `ResidentStageWorkerBackend`, `createResidentStageWorkerBackend`, `GpuResidentLaneManager`, `SolverRegistry`, `PlacementAdmissionPolicy`, `RemoteResultQuorumValidator`, `serviceOrchestration`, plus ICE/connection-path helpers and extension registry hooks).
- Decouple optional inference runtimes behind zero-dep `peercompute/src/peercompute/runtime/extensionRegistry.js` so `core.js` has **zero static, dynamic, or worker-URL import edges** into `src/peercompute/inference/`, `networkManager/inference/`, `peercompute-diffusion-ort`, `onnxruntime-web`, `@huggingface/transformers`, `@wllama/wllama`, or `@kaminos/webgpu-inference-kit`:
  - Extract pure `GENERATED_MESH_LIMITS` / `normalizeGeneratedMeshDescriptor` to `src/peercompute/artifacts/GeneratedMeshDescriptor.js` (re-exported by `inference/GeneratedMeshArtifact.js`).
  - Move `PeerConnectionRecovery` to `src/peercompute/networkManager/PeerConnectionRecovery.js` (re-exported by `networkManager/inference/PeerConnectionRecovery.js`).
  - Route `ComputeManager.createModelInferenceService`, `NetworkManager.createPeerInferenceService`, `taskRuntime.js`'s 6 `peercompute:*-inference` loaders, and the default inference compute worker (`src/peercompute/inference/computeWorker.js`) through `extensionRegistry.js`, auto-registered by `src/peercompute/inference.js` and `src/peercompute/index.js` so full-package consumers remain 100% backwards-compatible.

### 2. Distributed Spatial Tile Leases & Multipole Boundary Exchange Primitive (`SpatialTileLeaseBroker`)
- Add `peercompute/src/peercompute/stateManager/SpatialTileLeaseBroker.js` built directly over `ReservationLedger` + `StateManager`:
  - Deterministic single-winner CAS tile acquisition (`tileId + epoch`) with renewal (`renewTile`), release (`releaseTile`), TTL expiry (`expireLeases`), and immediate peer-loss eviction (`evictPeer` / `handlePeerDisconnect`) advancing the tile's epoch fence and emitting `tile-reassignment-needed` events.
  - Compact opaque binary (`ArrayBuffer` / `ArrayBufferView`) boundary summary admission (`admitBoundarySummary`) gated strictly by `summaryEpoch === activeEpoch` and owner/token match, with defensive byte copying, `maxPayloadBytes` bounding, SHA-256 content digest, and fail-closed rejection on stale epoch, non-owner, expired lease, invalid token, empty/oversized/non-binary payload, or destroyed broker.
  - Wire `createSpatialTileLeaseBroker` / `getSpatialTileLeaseBroker` / `destroySpatialTileLeaseBroker` into `StateManager` (with automatic `destroy()` cleanup) and `NodeKernel` (with automatic peer-disconnect binding).

### 3. First-Class Browser WebRTC ICE / STUN / TURN Configuration Surfacing & Fail-Closed Disconnect Hook
- Accept explicit `network.iceServers` and `network.iceTransportPolicy` (`'all' | 'relay'`, validated fail-closed via `normalizeIceTransportPolicy`) in both `NodeKernel` and `NetworkManager`, propagating onto `webrtc.rtcConfiguration` while redacting TURN credentials in diagnostics and telemetry (`getIceConfig()`).
- Add `CONNECTION_PATHS` and `classifyConnectionPath(peer)` distinguishing `'direct-webrtc'`, `'turn-relay'`, and `'ws-relay'` accurately in `NetworkManager.getTelemetrySnapshot()`, `getNetworkStats()`, `getConnectionDiagnostics()`, and `NodeKernel.getStatus().network`.
- Add clean fail-closed disconnect/reconnect hooks on `NodeKernel` (`onPeerDisconnect`, `onPeerReconnect`, `onPeerConnectionChange`, `isPeerAvailable`, `getUnavailablePeers`, `attachSpatialTileLeaseBroker`): dropping a peer immediately marks it unavailable, cancels in-flight `pendingRemoteComputeRequests` and `pendingRemoteTaskGraphRequests` with `ERR_REMOTE_PEER_DISCONNECTED`, evicts attached spatial tile leases, and notifies bound `RemoteResultQuorumValidator` instances (`bindToKernel`, `markPeerUnavailable`, `markPeerAvailable`) to reject results from unavailable responders fail-closed.

### 4. Priority-Aware Warm Eshkol & MoonLab Derivation Worker Pool Scheduling
- Extend `ChildWorkerLeaseManager` (`serviceOrchestration/ChildWorkerLeaseManager.js`) with priority-aware warm-worker lease affinity (`affinityKey`/`warmKey`, `priorityClass`/`priority`, `release(leaseId, { keepWarm: true })`, warm hit reclamation preserving `workerHandleId`, lower-priority warm eviction under `maxChildren` / `maxWarmPerParent` / `maxWarmTotal` and `ResourceLeaseBroker` memory/concurrency caps, TTL expiration releasing broker leases, and `getWarmPoolStats()`).
- Extend `ComputeManager` with priority-ordered task queuing (`_enqueueTask`), warm-worker `affinityKey` steering & eviction (`warmWorkerAffinities`, `warmWorkerHits`/`warmWorkerMisses`/`warmWorkerEvictions`, `getWarmWorkerPoolStats()`, `warmAffinityHit` in `computeExecution`), and optional `ResourceLeaseBroker`-bounded task resource leases while preserving strict `residentWorkerAffinities` exclusivity.
- Forward warm lease parameters and `warmPool` stats through `WorkerSupervisor`, preserving PeerCompute's existing provenance-bound `StateManager` + `RemoteResultQuorumValidator` admission rule at schedule boundaries.

## Verification Plan
- New unit suites:
  - `peercompute/tests/unit/coreEntrypoint.test.js`
  - `peercompute/tests/unit/spatialTileLeaseBroker.test.js`
  - `peercompute/tests/unit/webrtcIceSurfacing.test.js`
  - `peercompute/tests/unit/warmWorkerAffinity.test.js`
- Real Vite production bundle check on `peercompute/core` confirming zero `.wasm` assets and zero inference/ORT/Transformers/Wllama/WebGPU-inference-kit code in emitted chunks.
- Full regression suites: `npm --prefix peercompute run test:unit`, `npm run test:network-telemetry`, `npm run test:inference`, `npm run test:peer-inference`, `npm --prefix peercompute run build`, `demos/tests/demo-ports.test.js`, `demos/tests/demo-release.test.js`.
- Keep commits local on `feat/ulg-scale-ladder-extensions` unless explicitly told to push; leave the 4 pre-existing conjecture/patch WIP files untouched and unstaged.

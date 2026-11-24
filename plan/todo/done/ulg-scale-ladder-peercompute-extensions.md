# PeerCompute Extensions for ULG 40-OOM Foundation-First Scale Ladder

- **Requested by:** ULG (`feat/star-spec-generalization-audit`, authorized by **big dog** on 2026-11-22)
- **Target owner:** PeerCompute (`agy`)
- **Design principle:** Every item below aligns strictly with PeerCompute's core boundary — scheduling, resource leases, epoch fencing, StateManager admission, WebRTC/libp2p transport, and GPUHub residency (zero ULG physics domain logic inside PeerCompute).

---

## 1. First-Class Slim `peercompute-core` Entrypoint (`src/peercompute/core.js` + `package.json` `exports`)

- **Problem:** Importing `peercompute/src/peercompute/index.js` or `ComputeManager.js` (which dynamically imports `../inference/ModelInferenceService.js` → `sf3d` → `peercompute-diffusion-ort` (`npm:onnxruntime-web@1.31.1`), `@huggingface/transformers`, `@wllama/wllama`, `@kaminos/webgpu-inference-kit`) pulls `83+ MB` of unused `ort-wasm-*.wasm` assets into physics-only consumers unless downstream bundlers maintain custom Rollup/Vite virtual-stub plugins.
- **Extension:**
  - Add `peercompute/src/peercompute/core.js` exporting strictly:
    - `NodeKernel`, `ComputeManager`, `StateManager`, `ReservationLedger`, `DataState`, `LocalArtifactCache`
    - `NetworkManager`, `DIRECT_UNICAST_PROTOCOL`, `THROUGHPUT_TOPOLOGY_PROFILES`
    - `GPUHubManager`, `ResidentStageWorkerBackend`, `createResidentStageWorkerBackend`, `GpuResidentLaneManager`
    - `SolverRegistry`, `PlacementAdmissionPolicy`, `RemoteResultQuorumValidator`, `serviceOrchestration`
  - Decouple `ComputeManager.createModelInferenceService` so `core.js` has **zero static or dynamic import edges** into `src/peercompute/inference/` or `peercompute-diffusion-ort` (register the optional inference factory via a plugin hook or separate `peercompute/inference` entrypoint).
  - Export `"."`, `"./core"`, and `"./inference"` in `peercompute/package.json`.

## 2. Distributed Spatial Tile Leases & Multipole Boundary Exchange Primitive

- **Use Case:** ULG Gate 3 (multi-level SS continuum) and Gate 5C/5D (galactic & supergalactic FLRW TreePM domains spanning `10¹⁷ → 10²⁵ m`) partition 3D volumes across `K` browser GPU peers, exchanging only compact ghost-slab / multipole summaries at schedule boundaries (never full hot GPU particle arrays).
- **Extension:**
  - Generalize `ReservationLedger` + `StateManager` with a reusable **Epoch-Fenced Spatial Tile Coordinator** (`SpatialTileLeaseBroker`):
    - Deterministic tile-lease acquisition (`tileId + epoch`) with single-winner CAS ownership and automatic peer-loss TTL expiry / reassignment.
    - Compact binary boundary/multipole summary admission gated strictly by `summaryEpoch === activeEpoch` (rejecting stale-epoch and non-owner submissions fail-closed).
    - Keeps all physics interpretation (multipole tensors, ghost fluxes) opaque to PeerCompute (`ArrayBuffer` / schema-tagged payload).

## 3. First-Class Browser WebRTC ICE / STUN / TURN Configuration Surfacing

- **Use Case:** ULG already passes 2-browser-context single-host WebRTC `RTCDataChannel` derivation (`tests/priority3GpuAndWebRtc.native.test.mjs`) with the signaling WebSocket closed after handshake. Scaling to multi-machine WAN/NAT deployments (ULG Gate 5D / A6) requires clean ICE/STUN/TURN configuration through `NodeKernel`.
- **Extension:**
  - Surface explicit `network.iceServers`, `network.iceTransportPolicy` (`'all' | 'relay'`), and connection-path diagnostics (`direct-webrtc` vs `turn-relay` vs `ws-relay`) in `NodeKernel` / `NetworkManager` constructor options and telemetry snapshots.
  - Add a clean fail-closed disconnect/reconnect event hook so downstream quorum validators immediately mark dropped responders unavailable and trigger tile/derivation reassignment.

## 4. Warm Eshkol & MoonLab Derivation Worker Pool Scheduling (`serviceOrchestration`)

- **Use Case:** ULG Gates 1–3 rely heavily on **Eshkol** (warm browser WASM/AD higher-order Chebyshev & closure approximations) and **MoonLab** (warm browser WASM/WebGPU quantum electronic/many-body response & parity checks) to resolve Polytope Atlas misses (`outside-domain`) across `Z = 1..118` elements, compounds, and continuum regimes without stalling the local GPU step loop.
- **Extension:**
  - Add priority-aware **warm-worker lease affinity** in `ChildWorkerLeaseManager` / `ComputeManager` so repeated closure-miss derivations targeting an already-warm Eshkol or MoonLab worker avoid cold WASM re-instantiation while remaining strictly bounded by `ResourceLeaseBroker` memory/concurrency caps.
  - Preserve PeerCompute's existing authority rule: every remote Eshkol/MoonLab derivation returns a content-addressed provenance-bound artifact admitted strictly through `StateManager` + `RemoteResultQuorumValidator` at schedule boundaries.

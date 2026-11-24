# Project plan

> This file is user-owned. An LLM may change it only with explicit permission.

## Purpose

Explore and validate PeerCompute's **core conjecture**:

> Given a globally distributed set of devices with varying mutual bandwidth and compute resources, an optimal compute topology will emerge automatically through cellular automata in which individual nodes try to maximize compute throughput — like slime mold (*Physarum polycephalum*) designing an optimal transit network.

PeerCompute (future brand: **ExoPute**) provides a browser-native P2P networking, CRDT state, and managed CPU/WASM/WebGPU compute library so ephemeral browser tabs and edge hosts can self-organize into persistent, reliable distributed applications (multiplayer worlds, scientific simulations, procedural generation, and P2P AI inference).

## Scope

### In scope
- **Core P2P + Compute Runtime (`peercompute` / `peercompute/core`):** `NodeKernel`, `NetworkManager` (libp2p WebRTC + WebSockets + GossipSub + direct unicast `/peercompute/direct/1.0.0` + ICE/STUN/TURN surfacing + fail-closed disconnect hooks), `StateManager` (Yjs CRDT + `DataState` hot/warm/cold + `ReservationLedger` + epoch-fenced `SpatialTileLeaseBroker`), `ComputeManager` (managed JS/WASM/WebGPU workers, warm affinity scheduling, task graphs, `GPUHubManager`, `GpuResidentLaneManager`, `PlacementAdmissionPolicy`, `RemoteResultQuorumValidator`), and `serviceOrchestration` (`ChildWorkerLeaseManager`, `ResourceLeaseBroker`, `WorkerSupervisor`).
- **Optional Inference & Artifact Layer (`peercompute/inference`):** content-addressed IPFS/UnixFS `ArtifactStore`, local/peer multimodal inference (`ModelInferenceService`, `PeerInferenceService`), `ModelEvidenceStore`, and embodied `AgentRuntime` / world-agent stores decoupled strictly from `peercompute/core`.
- **Relay, TURN & Root-Node Infrastructure:** Go relay (`peercompute/src/relay-go`), coturn, `NativeCompanion` LAN/Pi relay kit (`scripts/lan-relay.mjs`), and experimental persistent Chromium `root-node/` host.
- **Showcase Demos & ExoWebTUI Gallery:** 17 browser demos (`docs/`, GitHub Pages, `secretworkshop.net` relay) validating real-world networking, WebGPU, geodata, physics, and inference.

### Out of scope
- Embedding domain-specific physics (such as ULG physics solvers) inside PeerCompute's core boundary — PeerCompute owns scheduling, leases, epoch fencing, transport, and opaque binary admission only.
- TypeScript or React rewrites; vanilla ES6 modules and retro-terminal UI remain the project standard.
- Centralizing authoritative browser GPU compute on a cloud backend.

## Success criteria
- **Core Conjecture:** Throughput-driven local topology rewiring (`topology: 'throughput'`) measurably beats static/spatial baselines and scales smoothly across multi-site browser/LAN/WAN meshes.
- **Clean Core Boundary:** `peercompute/core` stays strictly free of inference/ONNX/WASM bloat (`0` `.wasm` files in core bundles) while serving downstream scale-ladder consumers (ULG) and all 17 demos without regression.
- **Persistence Over Ephemeral Chaos:** Spatial tile leases, quorum validation, CRDT state, and artifact caches fail closed on peer churn and recover cleanly across disconnects.
- **Releasable Packages & Pages:** `peercompute` and `exopute` publish cleanly to npm, and GitHub Pages (`docs/`) + `secretworkshop.net` relay remain green under automated headless gates.

## Constraints
- **Node.js 24 LTS** (do not downgrade).
- **Vanilla JavaScript (ES6 modules)**, Three.js, WebGPU compute pipelines, Vite toolchain, retro-terminal UI; no TypeScript or React.
- **Honest browser telemetry & capability reporting:** never claim measured physical VRAM from `deviceMemory` or `maxBufferSize`, never bypass security/isolation checks, and validate headlessly without splitting the user's terminal.
- **Local commits by default:** commit cleanly on feature branches and merge to `main`; push to `origin` only when explicitly authorized.

## High-level roadmap (Current vs Target)

- **Current state:** Core library (`peercompute/core`, `peercompute/inference`, `SpatialTileLeaseBroker`, ICE/TURN surfacing & fail-closed disconnect hooks, warm worker lease affinity), Go relay + `secretworkshop.net` deployment, NetViz whole-network analyzer, ExoWebTUI gallery + 17 demos, and live root-node model-evidence registry are implemented and green on `main`.
- **Target state:** Publish initial `peercompute@0.1.0-alpha.1` and `exopute@0.1.0-alpha.1` to npm, complete installed root-node hosted-model parity & signed execution qualification, deliver the flagship [Keystone](todo/keystone-demo.md) throughput-emergence demo, and retire legacy `demos/multiscale` + `peercompute` webpack tooling.
- See [todo/priority.md](todo/priority.md) for the active queue and [log/log-summary.md](log/log-summary.md) for historical milestones.

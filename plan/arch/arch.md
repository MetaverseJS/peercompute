##Instructions for LLM
This file and the arch folder contain a description of the current and future architectures. it should identify entities and their functions. what those entities are responsible for and what they interact with and how they should be tested. this must be updated continuously. 
###Current arch
- Compute Node (CN) includes NodeKernel, StateManager, NetworkManager, ComputeManager, and Local IO Manager.
- NodeKernel orchestrates managers and policies; managers should be worker-ready.
- NetworkManager uses libp2p v3 (WebRTC + WebSockets + circuit relay v2) with relay bootstrap, floodsub, pubsubPeerDiscovery.
- Relay is Node.js with optional WSS (SSL certs + RELAY_PUBLIC_HOST); browser clients dial via WebRTC or WSS + circuit relay.
- State sync uses Yjs + PeerComputeProvider; DataState persists in IndexedDB; no y-libp2p in the runtime path.
- NetworkScheduler enforces snapshot/command/event cadence; clock policy supports internal or kernel-driven ticks.
- Time sync in cb is anchored to the first joiner; anchor reasserts on conflicts.
- Message model uses JSON payloads (snapshot, command, event, presence, clock); reliable events use ack/retry.
- Local IO Manager handles input and render state on the main thread.
- ComputeManager dispatches CPU and WebGPU workers for heavy workloads.
- IPv6 works out of the box across libp2p transports; prefer dual-stack STUN/TURN and validate with WebRTC stats.
- Diagrams: plan/arch/PeerCompute.drawio, plan/arch/compute-node-block-diagram.png, plan/arch/p2p-network-topology-examples.png.
- Component docs: plan/arch/compute-node.md, plan/arch/nodekernel.md, plan/arch/stateman.md, plan/arch/datastate.md, plan/arch/stateworker.md, plan/arch/netman.md, plan/arch/compman.md, plan/arch/cpuworker.md, plan/arch/wgpuworker.md, plan/arch/main-thread.md, plan/arch/ioman.md, plan/arch/input-handler.md, plan/arch/render-state.md, plan/arch/node-roles.md, plan/arch/topology.md.

###Future arch
- Expand topology modes (authority-hosted, mesh snapshots, hybrid) with clear authority election rules.
- Add interest management, backpressure, and optional binary encoding (CBOR).
- Move heavy managers (network/compute) into workers or service workers.
- Support self-organizing compute topologies based on bandwidth/compute affinity.
- Security: HTTPS/WSS deployment with signed code and data-only replication.

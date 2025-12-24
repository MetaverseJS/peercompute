Instructions: This file contains high level goals for the project and a roadmap.

## Project Overview:
PeerCompute is a browser based p2p compute network library leveraging webGPU and built on top of libp2p.  Use cases for this would range from a networking library for player hosted online gaming, procedural world generation, large scale physics simulations,  backend for a metaverse network etc. 

The most interesting potential configuration for this would be a compute network which dynamically self organizes (hierarchically or otherwise) to optimally compute a workload based on mutual bandwidth and compute resources.

for example, where a high degree of peer communication is necessary nodes should be able to recognize and automatically form fully connected peer sub-groups when located together on a LAN with high mutual bandwidth/compute but perhaps a bottle necked uplink. 

In an example metaverse configuration the root node would set out the basis for interaction in a overworld where players (each a compute node themselves) could explore and interact.  Players could also discover and join another compute node (becoming their child) where the parent could lay out a different basis for interaction (a customized personal sub world or game) 

Security:
The root node should exist on a domain secured with SSL enabling all executable code to be signed with Compute Nodes exchanging non executable data in json (3d models, arrays etc) 

## Project Goals:

### Completed:
- libp2p-first browser stack (relay bootstrap + floodsub + pubsubPeerDiscovery).
- Yjs state sync via PeerComputeProvider (no y-libp2p dependency).
- NetworkScheduler core with clock policy scaffolding.
- cb time sync anchored to the first joiner.

### TODO:
- Stabilize dev/test workflow for relay + Playwright in a non-sandboxed env.
- Validate time sync anchor behavior after reconnects.
- Resume ComputeManager work once P2P stack is stable.
- Keep plan/ and log aligned with ongoing changes.

### TODONT:
- Reintroduce PeerJS or legacy CRDT experiments.
- Redesign NodeKernel/StateManager public APIs mid-branch.
- Add new topology modes before scheduler/tests are stable.

## RoadMap:
1. Hardening: relay config, WSS/HTTP parity, test automation in a real env.
2. Scheduler adoption: migrate demos to snapshots/events; tune profiles.
3. Scale: interest management, health metrics, reliability tiers.
4. Compute: resume WebGPU workloads and worker/service-worker isolation.

## Known Issues / Blockers:
- Playwright tests blocked in sandbox (Chromium EPERM, report port bind).
- WSS relay requires valid certs; use HTTP for local tests if needed.

## Design Principles:
- Modular ES6 modules; managers should be worker-ready where practical.
- Networking layer should be runnable in a worker or service worker.
- NodeKernel owns orchestration policy; NetworkManager owns transport.
- Keep clear module boundaries (input, physics, networking).
- Prefer data/layout choices that keep buffer interop simple.
- DataState is hierarchical and persisted in IndexedDB; state workers handle parallel access.
- Compute runs in CPU/WebGPU workers; IO stays on the main thread.
- Shared-GPU tasks run under a main-thread GPU hub; isolated GPU tasks emit CPU deltas.
- DataState is layered (hot GPU, warm CPU, cold IndexedDB) with explicit commit deltas.

## Architecture Docs:
- See plan/arch for component summaries and topology notes.

## Long-term Intent:
- Browser-based P2P compute network using WebGPU.
- Support hierarchical or emergent topologies based on bandwidth/compute affinity.
- HTTPS/WSS deployment with signed code and data-only replication.

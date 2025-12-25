Instructions: This file contains the implementation plan for distributed compute scheduling and topology formation.

## Goal
Implement a self-organizing distributed compute layer that adapts topology and workload placement based on bandwidth, latency, and compute availability, aligned with the "Key Innovation" in the root README.

## Guiding Principles
- Nodes optimize local throughput while respecting global constraints (latency caps, fairness).
- Topology adapts dynamically (LAN clusters vs. WAN spokes).
- Compute placement is explicit and policy-driven (hot, warm, cold layers + GPU hub).
- Metrics are first-class and feed scheduling decisions.

## Phase 0: Definitions + Data Model
1) Define metrics schema (shared across nodes):
   - Network: RTT, jitter, uplink/downlink throughput, packet loss.
   - Compute: CPU load, GPU availability, VRAM, queue depth.
   - Memory: hot/warm/cold usage, commit backlog.
2) Define node roles:
   - Root (seeded or elected), Cluster Leader, Leaf.
3) Define session scopes:
   - gameId + roomId + taskId.

## Phase 1: Metrics Collection + Telemetry
1) Add a MetricsManager:
   - periodic probes (ping/throughput) to peers.
   - local resource sampling (CPU, GPU, memory, worker backlog).
2) Publish metrics as:
   - NetworkScheduler events (reliable, low-frequency).
   - Warm DataState snapshots for audit/debug.
3) Provide a Metrics API:
   - `getLocalMetrics()`, `getPeerMetrics(peerId)`, `getClusterMetrics()`.

## Phase 2: Topology Formation (Cellular Automata Rules)
1) Implement CA rules per node:
   - If peer RTT < X and throughput > Y, cluster candidate.
   - If uplink saturated, push peers into sub-tree (reduce fan-out).
   - If GPU-rich + low RTT, accept compute-heavy tasks.
2) Form clusters:
   - cluster membership announcements via events.
   - maintain local neighbor lists (close peers + fallback relay).
3) Add leader election (lightweight):
   - stable leader per cluster (lowest RTT + highest compute score).
   - reelect on instability.

## Phase 3: Scheduler Integration (Work Placement)
1) Extend NetworkScheduler with placement hints:
   - `taskProfile: latencySensitive | throughput | batch`.
   - `resourceHints: gpuRequired | cpuOnly | memoryHeavy`.
2) Placement algorithm:
   - prefer local node if resources allow.
   - else choose cluster leader or best-fit peer.
3) Commit path:
   - shared GPU tasks: GPU hub, direct render path.
   - isolated compute: worker + CPU deltas into DataState.

## Phase 4: DataState Coupling
1) Define commit contract per task:
   - `commitDelta({ taskId, scope, version, payload })`.
2) Ensure warm layer contains compact network representations.
3) Add conflict policy:
   - task-owned conflicts -> last-writer or CRDT merge.

## Phase 5: Resilience + Throttling
1) Backoff rules for slow peers.
2) Dynamic fan-out limits:
   - reduce broadcast size when relay load spikes.
3) Graceful degradation:
   - switch to lower snapshot Hz when RTT grows.

## Phase 6: Validation + Simulation
1) Headless simulations:
   - multi-node metrics injection, verify cluster formation.
2) Real-world LAN tests:
   - two clients on LAN + one WAN; verify clustering.
3) Load tests:
   - compute queues with varying GPU availability.

## Deliverables (MVP)
- MetricsManager + API.
- Cluster formation + leader election.
- Scheduler placement hints + best-fit routing.
- Debug UI / log output for topology + placement.

## Open Questions
- How to weight latency vs. throughput for different task profiles?
- Should cluster leaders be fixed or rotate on fairness?
- Do we require explicit admission control for GPU-heavy tasks?

## Immediate Next Steps
1) Write MetricsManager stub and publish local metrics.
2) Add a simple CA rule set for LAN clustering.
3) Integrate placement hints into NetworkScheduler.

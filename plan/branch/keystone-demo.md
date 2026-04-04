Instructions: This file captures the Keystone demo scope, goals, and implementation notes.

# Keystone Demo (Flagship Topology + Compute Showcase)

## Purpose
Demonstrate the key innovation from the root README in real time: a compute network that self-organizes around a workload based on bandwidth and compute availability. The demo should make the topology, task placement, and throughput visible and explainable.

## Core User Story
- A host creates a room and becomes the root node.
- The host selects a predefined workload from a list (CPU, WebGPU, WASM, hybrid WASM+WebGPU).
- Other peers join and are visualized as nodes.
- The network reconfigures as peers join/leave and as task demand changes.
- Users can see how topology and placement decisions affect throughput and latency.

## Visual Goals
- Tron-style grid with nodes as glowing cubes and connections as curved links.
- Live metrics overlay: peer count, RTT, throughput, queue depth, task completion rate.
- Clear labeling for root/parent/peer/child roles and current authority.

## Workloads (initial set)
- CPU baseline: grid diffusion or simple physics step.
- WebGPU path: lightweight compute pass (particle step or field update).
- WASM path: same workload compiled to WASM for portability comparisons.
- Hybrid path: WASM preprocessing + worker-local WebGPU dispatch for capability-aware comparisons.
- Optional batch vs streaming modes for each workload.

## Architecture Mapping
- NodeKernel orchestrates room, role, and scheduler profile.
- NetworkManager publishes presence and warm deltas (topology + metrics).
- StateManager/DataState store warm deltas for visualization and replay.
- ComputeManager dispatches tasks (CPU/WebGPU/WASM/WASM+WebGPU) and emits commitDelta.
- GPU hub used when render-coupled buffers are shared.

## Data Flow
1) MetricsManager (planned) publishes peer stats to warm deltas.
2) ComputeManager emits per-task throughput + queue depth deltas.
3) Visualizer subscribes to warm deltas and renders topology changes.
4) Optional snapshots/events reflect topology role changes.

## Milestones
1) Topology visualizer shell with fake/static data.
2) Live peer presence + RTT/throughput metrics in warm deltas.
3) Workload selection UI + task dispatch with real compute results.
4) Topology reconfiguration rules + visual playback of changes.
5) Polished UX + documentation notes for what the demo validates.

## Dependencies
- Warm DataState deltas published end-to-end.
- Room system + relay config defaults stabilized.
- ComputeManager scheduling + GPU hub integration stable.
- Metrics/telemetry feed for RTT/throughput.

## Definition of Done
- Two+ peers can join and see the network graph update live.
- At least one workload shows measurable scaling as peers join.
- Topology roles are visible and change in response to metrics.
- Demo includes a short README section explaining what it validates.

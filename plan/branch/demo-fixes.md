## Keystone Demo
- We need a demo to visually demonstrate the key innovation from the readme in realtime. where one user is defined as the root node (maybe in a room that they create and others can join) a predefined workload can be selected from a list of varying types. and then you get to see a visualization of the evolution of the network as it reconfigures while computing the workload. 
- Details: plan/branch/keystone-demo.md.


## TODO Demos

- 3d network visualizer to view the p2p network graph and edges and data flows live (do this in a tron style grid with nodes represented as cubes and connections between nodes ans glowing nurbs curves.)


- WASM support for compute workloads
- REAL distributed compute workload examples. 
- Demos for each network topology

- shared 3d editing environment based on https://threejs.org/editor/ where users can make 3d models together github https://github.com/mrdoob/three.js/tree/master/editor
- motorcycle game similar to road rash and the tron lightcycle game
- shared "VR CHAT" style world that uses your webcam to pose your 3d model. based on the input model from daddy go. 


# Physics and engine upgrades
- Apply PPF model to other physics demos
- create a better input model that abstracts/unifies the camera / vr / keyboard / mobile / controller inputs

-fully integrated engine demo that uses the best of webgpuphys, input abstraction, videochat/pose detection, collaborative editing etc. 

- integrated procedural generation library that ties the universe generation up to the planet generator. 

## detailed plan and architecture. 

## Branch Goal
Use the demo suite to prove the PeerCompute architecture end-to-end: layered DataState, NetworkScheduler profiles/topologies, ComputeManager (CPU/GPU/WASM), and GPU hub interop. The demos should double as validation tools for the distributed compute roadmap.

## Scale Plan (current focus)
Goal: reduce relay load so it behaves as a rendezvous/fallback path, not the main pipe.

### Phase 1: Local relay sandbox + config wiring (now)
- Stand up a local relay target for iterative changes (avoid breaking prod).
- Add `pubsubType` + gossipsub options to relay-config outputs and demo bootstraps.
- Ensure relay server can toggle floodsub/gossipsub via config/env.

### Phase 2: WebRTC direct-first + relay pruning (in progress)
- Prefer direct `/webrtc` dialing and drop relayed connections once direct is established.
- Confirm pubsub traffic flows peer-to-peer over direct links.

### Phase 3: Gossipsub rollout (next)
- Switch browsers + relay to gossipsub; keep floodsub as fallback until stable.
- Tune gossipsub mesh (directPeers = relay, allowPublishToZeroPeers).

### Phase 4: Topic scoping + throttles (next)
- Add optional room-scoped topics (per game/room) to reduce cross-room fanout.
- Lower snapshot/presence defaults where safe and expose per-demo overrides.

### Phase 5: Interest management (next)
- Add simple topic filters (only subscribe to required namespaces).
- Gate heavy event topics behind explicit opt-in in demos.

### Phase 6: Multi-relay fallback (later)
- Support multiple relay bootstrap peers with health checks and dial rotation.
- Prefer closest relay; keep relay as fallback when WebRTC fails.

## Topology + Sharded State Plan (current focus)
Goal: move to explicit topologies (fully distributed, three-layer hierarchical, dynamic hierarchical depth) and shard global state so nodes only exchange full data with nearby peers. Stabilize relay behavior and reduce publish churn.

### Problems observed (from plan/logs)
- Relay stops relaying after long runs; nodes isolate even though relay logs show connects.
- Relay crashes on publish to a closed stream.
- NetViz shows high traffic because global state is broadcast to every peer.

### Deliverables
- Topology abstraction above rooms (topologyId + topologyType); roomId is scoped under topologyId.
- Node-resident topology controller with deterministic neighbor selection and connection caps.
- Sharded state topics (vicinity shards) + aggregation in hierarchical rooms.
- NetViz topology selector + topology-specific views (global + per-room).

### Node-resident topology controller (shared)
- New TopologyController loop (1-2s tick) owned by NodeKernel/NetworkManager.
- Inputs: topologyType, topologyId, roomId, metric position, targetConnections, maxConnections.
- Maintains activePeers, candidatePeers, desiredPeers, and a dial queue with backoff.
- Handshake: CONNECT_REQUEST includes metric position, score, and capacity; CONNECT_ACCEPT only when under max; CONNECT_REFERRAL returns under-target peers.
- Invariants: degree <= maxConnections; prefer peers under targetConnections; never drop the last relay/seed when isolated; only swap when the new peer is closer or higher score.

### Fully distributed topology (metric-based, capacity-aware b-matching)
- Each workload provides metric(position) and distance(a,b) (3D player position or problem-space coords).
- Algorithm: capacitated stable matching (b-matching) with preferences by distance and capacity, plus long-range edges for connectivity.
- Steps:
  1) Gather candidates via discovery + neighbor gossip (T-Man/Cyclon style).
  2) Rank candidates by distance; compute k_local = targetConnections - k_long.
  3) Propose connections to the nearest peers under targetConnections first; accept until maxConnections.
  4) If a closer proposal arrives, replace the farthest accepted peer (deterministic tie-break by peerId).
  5) Maintain k_long random long-range links (Kleinberg-style) and refresh them periodically.
  6) If isolated, redial relay/seed; if above target, prune farthest edges with cooldown to avoid churn.
- Guarantees: degree <= maxConnections by construction; no blocking pairs under stable positions; k_long >= 1 yields connected graph with high probability when peer sampling is healthy.

### New node placement (NetViz fully distributed)
- Default positions are placed in an outward spiral on a square grid; new nodes spawn near the edge (largest radius).
- Moving the cube updates the metric coordinate and triggers neighbor recomputation with hysteresis.
- New nodes prefer connecting to under-target peers on the edge before dialing higher-degree interior nodes.

### Hierarchical topology (three-layer)
- Topology: Root -> Hosts -> Clients (rooms).
- Host selection score = f(bandwidth, compute, stability, RTT); hosts announce capacity and room state.
- Join flow: node selects highest-score host with capacity; if none, becomes host and announces a new room.
- Failover: primary host keeps a warm standby (next highest score). Hosts send heartbeats with term/lease; on timeout, standby starts an election (Raft-style term + deterministic tie-breaker). Clients follow highest term/score to avoid split-brain.
- Room capacity: hosts reject joins when full and return referrals.

### Dynamic hierarchical depth (emergent topology)
- Stub for now: build on distributed-compute CA rules with promote/demote based on bandwidth/compute thresholds.
- Implement after fully distributed + three-layer are stable; focus first on metrics and telemetry.

### Sharded global state / interest management
- Introduce shard keys derived from the metric (grid cell or region id). Each node subscribes to local shard + neighbor shards within radius.
- Full state only within shard; summarize/aggregate to parent or higher-level topics for global views.
- Presence messages include metric position, shard id, and joinedAt for relay retention and host election.
- NetViz uses aggregate summaries rather than full per-node state in the hierarchical overview.

### Relay stability + publish-on-closed-stream fixes
- Add a publish guard: per-peer queue with stream state checks; drop or retry on StreamStateError without crashing.
- Track stream lifetimes and error counts; backoff on repeated failures; expose relay health metrics (uptime, pubsub peers, stream errors).
- Add a relay soak test to verify stability over long runs with publish churn.

### NetViz updates
- Topology selector is separate from room selection; topologyId is shared across multiple rooms.
- Fully distributed view: movable cube, edges only to active connections, spiral spawn placement.
- Hierarchical view: global host overview (host nodes + client counts), click host to join; per-room detail view on demand.
- Emergent view: placeholder visualization with collected metrics only.

### Tests (unit + runtime)
- Unit: neighbor selection invariants (<= maxConnections, prefers under-target peers), swap logic correctness, shard topic computation.
- Unit: host election (term monotonicity, single leader), standby promotion, room capacity/referral handling.
- Runtime: topology convergence simulation (N nodes, random positions) asserts connected graph and degree bounds.
- Runtime: shard traffic test verifies messages only within AOI radius.
- Runtime: relay soak test with publish churn to confirm no crashes on closed streams.
- NetViz manual checks: topology selector, drag-to-move triggers connection changes, host join flow.

## How this ties to the larger PeerCompute plan
- Roadmap alignment: the demo work validates "Scheduler adoption" and "Compute" phases in plan/plan.md while stress-testing network hardening (relay, rooms, warm deltas).
- Architecture alignment: new demos should use layered DataState, hot/warm deltas, and shared-GPU hub where render-coupled buffers are needed (plan/arch/*).
- Distributed compute alignment: "real distributed compute examples" should exercise placement, topology roles, and scheduler profiles (plan/branch/distributed-compute.md).

## Prereqs / dependencies (do first or in parallel)
- Finish warm DataState delta publishing end-to-end so demos can visualize and replicate state safely.
- Stabilize room selection + relay config defaults (shared with the demo-ports release tasks).
- Keep ComputeManager scheduling + GPU hub integration stable before adding new compute-heavy demos.

## Branch breakdown (two branches)

### Branch A: demo-foundations (engine + tooling)
Goal: build shared systems that multiple demos reuse, and unblock the larger compute/topology story.
- Input abstraction layer (keyboard/mouse/gamepad/touch/VR) with unified action mapping.
- Physics upgrades: apply the PPF contact model to other physics demos and expose a shared physics adapter.
- WASM compute support in ComputeManager (task type, worker instantiation, DataState commitDelta hooks).
- Network telemetry + metrics feed (peer graph, RTT/throughput, message counts), exposed via warm deltas.
- 3d network visualizer core (tron grid, nodes/edges, nurbs links) built on the telemetry feed.
- WebRTC direct-connection upgrade (relay only for bootstrap/fallback): prefer `/webrtc` addrs over `/p2p-circuit`, allow STUN/TURN config, and optionally drop relayed connections once direct links are established. Difficulty: medium (2-4 days, mostly config + dialing/connection policy + validation).
- Shared procedural generation library that links universes + planetgen with a common data model and task API.

### Branch B: demo-experiences (showcase demos)
Goal: build new demos that prove the platform and the distributed compute narrative.
- Distributed compute workload examples (batch + streaming) that show real scaling across peers.
- Topology demo suite (authority-hosted, mesh snapshots, hierarchical) with an explorable UI and live stats.
- Keystone demo (flagship showcase; see plan/branch/keystone-demo.md).
- Shared 3d editor based on three.js editor, with multi-user scene graph sync and reliable edit events.
- Motorcycle/lightcycle game that exercises input abstraction + physics + network prediction.
- Shared VR world with webcam pose (DaddyGo input model) and avatar sync.
- Fully integrated engine demo that combines webgpuphys + input + pose/video + collaborative editing.

## Suggested order (what to do first)
1) Network telemetry + minimal visualizer: gives visibility into peers/topology and de-risks later demos.
2) WASM compute support: needed for portable distributed compute tasks beyond WebGPU.
3) Shared procedural generation API: unlocks planetgen/universes cross-demo reuse.
4) Input abstraction + PPF rollouts: foundation for the motorcycle game and the integrated engine demo.
5) Distributed compute examples + topology demos: validate scheduler profiles and topology roles.
6) Keystone demo as a flagship integration once the foundations above are stable.
7) Collaboration-heavy demos (3d editor, VR world), then the fully integrated engine demo last.

## Deliverables / definition of done
- Each demo uses PeerCompute APIs directly (NodeKernel + NetworkScheduler + DataState).
- Every demo includes a minimal README update and a short "what this validates" section.
- The network visualizer and topology demos become the debugging tools for future work.

## Progress
- Done (baseline): NetViz (network telemetry + minimal visualizer demo scaffolded).
- Done: NetViz upgrades (RTT/throughput telemetry, NURBS edges, node/edge inspection).

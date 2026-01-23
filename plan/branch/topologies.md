# Topologies (Current Branch)

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

### Pubsub + Topic Design (gossipsub-first, WebRTC transport)
- Default pubsub is gossipsub with floodsub fallback for relay-only environments.
- WebRTC is the preferred direct transport; relay is bootstrap/fallback.
- Topic scope: `pc.<topologyId>.<roomId>.<channel>` and shard channels like `pc.<topologyId>.<roomId>.shard.<shardId>`.
- Mesh tuning: keep D/Dlo/Dhi aligned with targetConnections; avoid forcing the relay into the mesh by default.
- Guard publishes during connection churn (drop or retry on StreamStateError).

### Node-resident topology controller (shared)
- New TopologyController loop (1-2s tick) owned by NodeKernel/NetworkManager.
- Inputs: topologyType, topologyId, roomId, metric position, targetConnections, maxConnections.
- Maintains activePeers, candidatePeers, desiredPeers, and a dial queue with backoff.
- Prune stale peers from the candidate set so refreshed peers can reconnect without getting stuck on dead ids.
- Allow discovery dials while under target connections even if the peer is not yet in desiredPeers.
- Allow discovery dials when isolated (no non-bootstrap connections) to recover after refreshes.
- Advertise relay-backed p2p-circuit multiaddrs when direct announce addrs are missing so peers can re-dial after refresh.
- Handshake: CONNECT_REQUEST includes metric position, score, and capacity; CONNECT_ACCEPT only when under max; CONNECT_REFERRAL returns under-target peers.
- When at capacity, inbound CONNECT_REQUESTs can trigger a swap to a closer peer if the farthest connected peer already has at least two closer connections; otherwise return referrals.
- Invariants: degree <= maxConnections; prefer peers with zero active connections then distance; never drop the last relay/seed when isolated; only swap when the new peer has higher priority and the farthest peer already has at least two closer connections.

### Fully distributed topology (metric-based, radius-limited b-matching)
- Each workload provides metric(position) and distance(a,b) (3D player position or problem-space coords).
- Nodes have a targetConnections (settle point) and maxConnections (hard cap); the controller always enforces the cap.
- Distance metric uses Euclidean radius selection so peers connect within a circle (connectionRadius) rather than Manhattan adjacency.
- Always include the closest peer in fully distributed mode.
- Within the radius, remaining peers with zero active connections are prioritized first, then distance, then peerId.
- Algorithm: capacitated matching with radius constraint and isolation fallback.
- Steps:
  1) Gather candidates via discovery + neighbor gossip (T-Man/Cyclon style).
  2) Filter to peers within connectionRadius; if none, fall back to the isolationMinConnections closest peers.
  3) Sort candidates by (noConnections desc, distance asc, peerId asc) and select up to maxConnections.
  4) If a higher-priority desired peer appears at maxConnections, drop the lowest-priority non-protected connection.
  5) If isolated, redial relay/seed; if above target, prune edges with cooldown to avoid churn.
- Guarantees: degree <= maxConnections by construction; isolated nodes always attempt to connect to the two closest peers when no one is in-range.

### New node placement (NetViz fully distributed)
- Default positions are placed on a square grid with an outward spiral; new nodes spawn near the edge (largest radius).
- Moving the cube updates the metric coordinate and triggers neighbor recomputation with hysteresis.
- New nodes prefer connecting to under-target peers on the edge before dialing higher-degree interior nodes.

### Hierarchical topology (three-layer)
- Topology: Root -> Hosts -> Clients (rooms).
- Host selection score = f(bandwidth, compute, stability, RTT); hosts announce capacity and room state.
- Join flow: node selects highest-score host with capacity; if none, becomes host and announces a new room.
- Failover: primary host keeps a warm standby (next highest score). Hosts send heartbeats with term/lease; on timeout, standby starts an election (Raft-style term + deterministic tie-breaker). Clients follow highest term/score to avoid split-brain.
- Room capacity: hosts reject joins when full and return referrals.
- Relay bootstrap retention: in hierarchical mode, hosts and newly joined peers keep relay connections while leaf nodes drop relay once direct host links are established.
- Clients prioritize connecting to their host first, then a backup host; connection limits can scale by role and device capability.

### Dynamic hierarchical depth (emergent topology)
- Stub for now: build on distributed-compute CA rules with promote/demote based on bandwidth/compute thresholds.
- Implement after fully distributed + three-layer are stable; focus first on metrics and telemetry.

### Sharded global state / interest management
- Introduce shard keys derived from the metric (grid cell or region id). Each node subscribes to local shard + neighbor shards within radius.
- Full state only within shard; summarize/aggregate to parent or higher-level topics for global views.
- Presence messages include metric position, shard id, and joinedAt for relay retention and host election.
- NetViz uses aggregate summaries rather than full per-node state in the hierarchical overview.
 - Snapshot publishing uses shard topics when `enableSharding` is true (per-node shard broadcast).

### Relay stability + publish-on-closed-stream fixes
- Add a publish guard: per-peer queue with stream state checks; drop or retry on StreamStateError without crashing.
- On connection close/peer disconnect, prune pubsub peers so gossipsub stops writing to closed streams.
- Patch gossipsub outbound stream sends to catch async send failures and prune the offending peer.
- Keep the relay bootstrap connection when direct connections fall below target to avoid isolation.
- Track stream lifetimes and error counts; backoff on repeated failures; expose relay health metrics (uptime, pubsub peers, stream errors).
- Add a relay soak test to verify stability over long runs with publish churn.

### NetViz updates
- Topology selector is separate from room selection; topologyId is shared across multiple rooms.
- Fully distributed view: movable cube, edges only to active connections, spiral spawn placement.
- Hierarchical view: relay at top, hosts in the middle, leaf nodes on the grid; global host overview (host nodes + client counts), click host to join; per-room detail view on demand.
- Emergent view: placeholder visualization with collected metrics only.
- NetViz remains a Vite app (no React/TS).

### Tests (unit + runtime)
- Unit: neighbor selection invariants (<= maxConnections, prefers under-target peers), swap logic correctness, shard topic computation.
- Unit: host election (term monotonicity, single leader), standby promotion, room capacity/referral handling.
- Runtime: topology convergence simulation (N nodes, random positions) asserts connected graph and degree bounds.
- Runtime: shard traffic test verifies messages only within AOI radius.
- Runtime: relay soak test with publish churn to confirm no crashes on closed streams.
- Runtime: headless demo P2P suite (`demos/tests/runtime-p2p.mjs`) exercises cubechat video/screen share plus demo peer connectivity.
- NetViz manual checks: topology selector, drag-to-move triggers connection changes, host join flow.

### Progress (2025-01-01)
- TopologyController + topology handshake integrated into NetworkManager/NodeKernel.
- Topology scoping added to messages/presence + shard subscription helpers.
- NetViz topology selector + distributed drag controls + hierarchical layout stub wired.
- TopologyController unit tests + updated network tests for topology scope.

### Progress (2025-01-01)
- Implemented TopologyController + topology handshake messages and wiring in NetworkManager/NodeKernel.
- Added topologyId scoping, presence fields, and shard subscription helpers.
- NetViz: topology selector + topologyId input, distributed layout with spiral fallback + drag-to-move, hierarchical layout stub with host/client grouping.
- Added unit tests for TopologyController and updated network tests for topology scoping.

### Progress (2026-01-01)
- NetViz startup now defers metric initialization until after spiral seeding to prevent overlapping nodes.
- NetworkManager prunes pubsub peers on connection close/peer disconnect to reduce StreamStateError from closed streams.
- NetworkManager patches gossipsub outbound streams to catch async send failures and hang up the peer.
- Distributed topology now swaps out the farthest connected peer when a closer desired peer appears at max connections.
- Distributed topology distance scoring now uses adjacency (Manhattan) to prioritize grid neighbors.
- Sharded snapshots now publish on per-shard topics when `enableSharding` is enabled.

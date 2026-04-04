# NetViz

NetViz is a minimal network telemetry visualizer for PeerCompute. It renders a live node/edge view and surfaces per-peer traffic stats.

## Run From Repo Root
```bash
npm install
npm run dev:netviz
```

NetViz connects when you click the "Connect" button (after selecting topology, topology ID, and room).

## PeerCompute Integration
- NetViz listens for `telemetry:<peerId>` warm deltas and renders peer/link state from those snapshots.
- `NodeKernel` now publishes these debug telemetry deltas by default in every PeerCompute demo.
- Demos publish NetViz session beacons on pubsub topic `peercompute-netviz-sessions`; NetViz consumes those beacons to attach across different demo ports/origins.
- NetViz still listens on `BroadcastChannel("peercompute-netviz-debug-v1")` for same-origin instant attach hints.

## UI Notes
- Click a node or edge to open an inspector panel with RTT, throughput, and traffic counters.
- Topology selection sits above rooms; hierarchical view groups hosts/clients in the layout.
- Use "Attach demo" to target a running demo without manually typing topology/room values (connect NetViz first so it can discover session beacons).
- In distributed topology, drag your local cube to move its metric position and trigger neighbor recomputation.
- Use the "Hide ghosts" toggle to hide inferred nodes that have no telemetry yet.
- Orbit controls are enabled for pan/zoom; optional auto-rotate can be toggled on.
- NURBS links thicken with higher bandwidth and animate pulses when traffic is flowing.
- Local-node inspector now shows `RTC path evidence` (selected candidate-pair summary) so direct ICE success can be detected even when libp2p addresses remain relay-scoped.
- Edge transport rendering now also aggregates peer telemetry `via` from both edge directions, so remote direct links do not depend solely on the local browser's current connection table.
- Edge colors reflect transport truth per link (`webrtc` direct, `relay-webrtc`, `relay`, `unknown`) and avoid coercing unknown or relay-scoped states into direct.
- Add `?chaosApi=/chaos-api` (or `?chaosApi=http://127.0.0.1:8866`) to show live chaos-lab topology + scenario behavior in the NetViz console and 3D graph overlay.
- Add `&autoConnect=0` to watch chaos-lab without immediately dialing relay bootstrap endpoints.

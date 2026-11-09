# NetViz

NetViz is a minimal network telemetry visualizer for PeerCompute. It renders a live node/edge view and surfaces per-peer traffic stats.

## Run From Repo Root
```bash
npm install
npm run dev:netviz
```

Click **Connect** to start observing. **All demos** is the default view; filter by application or connection role. A peer is a network instance, so one browser can have separate world and model connections.

## All demos

The aggregate graph uses bounded operational reports shared across demo scopes.
It shows reported connections, compute worker/task counters and hosted models,
grouped by model with distinct hosting-peer and busy counts. Click a node or edge
for its report. Hosting-status failures are shown as unavailable and counts remain
explicitly partial. Chat, prompts, files and scene positions are not included.

Reports become stale after 15 seconds and leave the view after 60 seconds. Stale
hosts do not count as currently available. **Session only** nodes come from older
demo beacons: refresh those tabs from an updated build for full reports. **Hide
ghosts** controls endpoints named by other peers without reports of their own;
known relay endpoints remain visible when a reporting peer names a connection.
This observes reachable reporting peers, not a guaranteed census of the network.

Use **Selected session** or **Attach demo** for the original scoped topology view.
Attach preserves the selected game's ID, room and topology, so its warm telemetry
passes normal scope checks. It does not combine room state across applications.
`?view=all&autoConnect=1` opens the aggregate observer;
`?view=session&gameId=cubechat&room=global&topology=cubechat&autoConnect=1`
opens a specific scope.

## PeerCompute Integration
- NetViz listens for `telemetry:<peerId>` warm deltas and renders peer/link state from those snapshots.
- `NetworkManager` owns the shared operational reporting lifecycle, covering both NodeKernel demos and standalone model connections. NodeKernel also retains scoped debug telemetry for selected-session inspection.
- Demos publish NetViz session beacons on pubsub topic `peercompute-netviz-sessions`; NetViz consumes those beacons to attach across different demo ports/origins.
- NetViz still listens on `BroadcastChannel("peercompute-netviz-debug-v1")` for same-origin instant attach hints.
- Attach session metadata is preserved in the console. The Session Runtime panel renders worker counts, manager task totals, top task families, solver pressure, autoscale state, and warm-delta counts when a demo publishes structured metadata such as Multiscale Ladder's `peercompute.multiscale.netviz-session.v0`.

## UI Notes
- Click a node or edge to open an inspector panel with RTT, throughput, and traffic counters.
- Topology selection sits above rooms; hierarchical view groups hosts/clients in the layout.
- Use "Attach demo" to target a running demo without manually typing topology/room values (connect NetViz first so it can discover session beacons).
- The Session Runtime panel follows the selected/latest attach session and shows runtime metadata without requiring console access.
- In selected-session distributed topology, drag your local cube to move its metric position and trigger neighbor recomputation.
- Use the "Hide ghosts" toggle to hide inferred nodes that have no telemetry yet.
- Orbit controls are enabled for pan/zoom; optional auto-rotate can be toggled on.
- NURBS links thicken with higher bandwidth and animate pulses when traffic is flowing.
- Local-node inspector now shows `RTC path evidence` (selected candidate-pair summary) so direct ICE success can be detected even when libp2p addresses remain relay-scoped.
- Edge transport rendering now also aggregates peer telemetry `via` from both edge directions, so remote direct links do not depend solely on the local browser's current connection table.
- Edge colors reflect transport truth per link (`webrtc` direct, `relay-webrtc`, `relay`, `unknown`) and avoid coercing unknown or relay-scoped states into direct.
- Add `?chaosApi=/chaos-api` (or `?chaosApi=http://127.0.0.1:8866`) to show live chaos-lab topology + scenario behavior in the NetViz console and 3D graph overlay.
- Add `&autoConnect=0` to watch chaos-lab without immediately dialing relay bootstrap endpoints.

## Tests
```bash
node --test demos/netviz/tests/observedNetwork.test.js demos/netviz/tests/relayOverlay.test.js
npm --prefix demos/netviz run build
env NETVIZ_SMOKE_URL=https://localhost:4173/netviz/?render=off npm --prefix demos/netviz run test:session
```

For controlled UI, filter, mobile layout and actual scoped-reconnect checks, run
`NETVIZ_SMOKE_URL=https://localhost:5182/?view=all\&render=low\&autoConnect=1 node demos/netviz/tests/observedNetworkSmoke.mjs`
against an owned development server. Fixtures in that test validate rendering,
not cross-peer reporting; the shared live-browser integration test covers transport.

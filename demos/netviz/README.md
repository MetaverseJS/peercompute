# NetViz

NetViz is a minimal network telemetry visualizer for PeerCompute. It renders a live node/edge view and surfaces per-peer traffic stats.

## Run From Repo Root
```bash
npm install
npm run dev:netviz
```

NetViz auto-connects to the `telemetry` room on load.

## PeerCompute Integration
- Uses `NodeKernel` with warm deltas (`deltaNamespace: 'telemetry'`).
- Publishes `networkManager.getTelemetrySnapshot()` as `telemetry:<peerId>` deltas.
- Consumes warm delta snapshots to render the peer graph.

## UI Notes
- Click a node or edge to open an inspector panel with RTT, throughput, and traffic counters.
- Use the "Hide ghosts" toggle to hide inferred nodes that have no telemetry yet.
- Orbit controls are enabled for pan/zoom; optional auto-rotate can be toggled on.
- NURBS links thicken with higher bandwidth and animate pulses when traffic is flowing.

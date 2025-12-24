# PeerCompute

PeerCompute is a browser-based P2P networking and distributed compute library built on libp2p. It targets multiplayer games, collaborative simulations, and flexible compute workloads that need to run in the browser with configurable topology and clocking.

## Key Innovation
Given a network of compute nodes with varying mutual bandwidth and compute power it's possible to use cellular automata rules (where each node attempts to maximize it's own compute throughput) to form optimal compute networks for arbitrary workloads. 


## What You Can Use Today
- **libp2p relay + floodsub + presence** for browser P2P sessions.
- **NodeKernel** orchestrator with State, Network, and Compute managers.
- **NetworkScheduler** for decoupled network cadence (snapshots/events/commands).
- **Room + game scoping** so different sessions do not collide.
- **LAN-friendly relay config** via `relay-config.json`.

## Architecture Overview

### Core Components
- **NodeKernel**: orchestration and policy. Chooses what to send, when to send it, and who to send/request from.
- **NetworkManager**: transport, routing, discovery, and scoping (libp2p).
- **NetworkScheduler**: timing primitive (cadence, batching, keepalive, retries).
- **StateManager**: shared state sync (Yjs + scoped namespaces).
- **GPU Hub (main thread)**: shared WebGPU context for render-coupled compute tasks.
- **ComputeManager**: CPU/WebGPU compute worker pool (in progress).
- **ioManager**: controls local input/output (like threejs and your keyboard).
- **DataState (layered)**: hot GPU buffers, warm CPU deltas, cold IndexedDB snapshots.

### Orchestration vs Transport
- NodeKernel defines **policy** (clock mode, profiles, dynamic throttling).
- NetworkManager executes **transport** (dial, pubsub, presence, scope filters).
- NetworkScheduler enforces **cadence** once policy is set.

### Block Diagram
![PeerCompute Node Block Diagram](../plan/arch/compute-node-block-diagram.png)

### Network Topology
![PeerCompute Topology Examples](../plan/arch/p2p-network-topology-examples.png)

### Clocking Modes (Configurable)
PeerCompute supports multiple timing models:
- **independent**: managers run event-driven; best throughput, least deterministic.
- **kernel**: NodeKernel drives ticks; best determinism, higher latency.
- **hybrid**: managers run independently but sync at kernel-defined points.

## Network Scheduler Features
- Separate **snapshot**, **event**, and **command** streams.
- **Keepalive** and **reconnect** behavior when idle.
- **Reliable events** with retries + ack (bounded retry budget).
- **Profile-based rates** so different games or rooms can use different cadence.

## Quick Start

```bash
cd peercompute
npm install

# Start relay + dev server
sh ./start-dev.sh
```

Open:
- `http://localhost:5173/test-p2p.html` (connectivity)
- `games/sw2.html` or `games/cb.html` (examples)

### LAN / Mobile
Start relay with a public host so other devices can dial it:

```bash
RELAY_PUBLIC_HOST=192.168.1.174 ./start-dev.sh
```

Clients will read `relay-config.json` and rewrite loopback addresses to the page host when needed.

## Integration: Minimal Game Setup

```js
const cfg = await fetch('/relay-config.json').then(r => r.ok ? r.json() : null).catch(() => null);
const node = new window.NodeKernel({
  bootstrapPeers: cfg?.bootstrapPeers || [],
  enablePersistence: false,
  gameId: 'my-game',
  roomId: 'lobby-1'
});

await node.initialize();
await node.start();

const network = node.getNetworkManager();

// Scheduler configuration (optional)
network.configureScheduler({
  snapshotHz: 15,
  keepaliveMs: 1000,
  reliableEventTypes: ['spawn', 'join']
});
```

### Publish State via Scheduler
```js
network.registerStateProvider(() => ({
  position: { x, y, z },
  rotation: { y: yaw },
  color,
  ts: Date.now()
}), { id: 'player' });

network.addSnapshotHandler((peerId, message) => {
  const entries = message.payload || [];
  entries.forEach((entry) => {
    if (entry.id !== 'player') return;
    // apply remote player state
  });
});
```

### Send Events (Reliable or Best-Effort)
```js
network.queueEvent({ type: 'attack', victimId, ts: Date.now() }, { reliable: true });
```

## Profiles (Suggested Defaults)
- **Action/FPS**: snapshotHz 10-20, reliable events: spawn/join/attack
- **Co-op**: snapshotHz 5-10, reliable events: spawn/join/revive
- **Turn-based**: event-driven, reliable events: join/turn/commit
- **Sandbox**: low Hz, reliable events: place/delete/join/commit

## Tests
```bash
npm run test:unit
npm run test:auto
```

Note: Playwright is blocked in sandboxed environments (Chromium EPERM).

## Project Structure
```
peercompute/src/peercompute/
├── index.js
├── nodeKernel/NodeKernel.js
├── stateManager/StateManager.js
├── networkManager/NetworkManager.js
├── networkManager/NetworkScheduler.js
├── computeManager/ComputeManager.js
└── utils/Utils.js
```

## Roadmap Highlights
- Adaptive profiles (RTT/peer count aware).
- Authority election + snapshot ownership modes.
- Optional binary encoding for high-throughput channels.
- ComputeManager integration with network scheduler for distributed workloads.

## License
MIT

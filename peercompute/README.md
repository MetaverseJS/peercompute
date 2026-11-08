# PeerCompute core library

PeerCompute is a browser-based P2P networking and compute library built on
libp2p. It provides shared state, worker execution, model hosting and artifact
distribution for multiplayer games, persistent agents and collaborative
simulations. This directory contains the runtime and its core development/test
harness; the Vite applications live in the repository's `demos/` directory.

[Application overview and setup](../README.md) ·
[Live demos](https://metaversejs.github.io/peercompute/) ·
[Models and agents](https://metaversejs.github.io/peercompute/inference/)

## Current capabilities — November 8, 2026

- **libp2p relay, pubsub discovery and WebRTC** for scoped browser P2P sessions,
  including authenticated application streams for artifacts and inference.
- **NodeKernel** orchestrator with State, Network, and Compute managers.
- **NetworkScheduler** for decoupled network cadence (snapshots/events/commands).
- **Room + game scoping** so different sessions do not collide.
- **LAN-friendly relay config** via `relay-config.json`.
- **Persistent artifacts** with verified UnixFS/IPFS blocks, manifests, explicit
  sharing/pins and IndexedDB or Node filesystem backends.
- **Managed model workers** for supported ONNX text/vision, GGUF text, diffusion
  and speech tasks, with progress, cancellation, residency and resource accounting.
- **Local/peer model routing** with capability checks, availability discovery,
  bounded host queues and a local-first Mixed policy in the model application.
- **Private persistent agents** with StateManager-owned identity/context/history
  and reusable routing, speech and world-inhabitant components in the demos.

The [model console](../plan/demos/inference/multimodal-console.md), CubeChat and EarthGrid build on
these services. Model files and private conversations are not replicated through
Yjs. File retention does not keep a closed browser online; serving files and
executing peer inference require an active reachable host. Each inference request
runs on a selected host, not a tensor-parallel model spread across the network.

## Research direction

Resource-aware topology and workload placement remain design goals. The proposed
Keystone demo explores local rules for reorganizing compute networks according
to bandwidth and compute capacity; optimal organization is not an established
runtime guarantee. The [Humunculus design](../plan/demos/humunculus/humunculus.pdf)
builds on the existing agent layer, while learned routing, neural movement,
self-directed training, cloning and migration remain planned.

## Architecture Overview

### Core Components
- **NodeKernel**: orchestration and policy. Chooses what to send, when to send it, and who to send/request from.
- **NetworkManager**: transport, routing, discovery and scoping (libp2p), including
  artifact-provider discovery and authenticated peer inference streams.
- **NetworkScheduler**: timing primitive (cadence, batching, keepalive, retries).
- **StateManager**: shared state sync (Yjs + scoped namespaces), local DataState,
  verified artifact stores and private persistent agent records.
- **GPU Hub (main thread)**: shared WebGPU context for render-coupled compute tasks.
- **ComputeManager**: JS/WASM/WebGPU execution with worker offload, hybrid
  `wasm-webgpu` tasks, `commitDelta`, model residency and acknowledged cleanup.
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

Install the workspace dependencies from the **repository root** with Node.js
**24 LTS**. To use the current application, run:

```bash
nvm use 24
npm install
npm run dev:inference
```

Open `https://localhost:5189/`. The root [Quick Start](../README.md#quick-start)
covers all Vite demos, certificates and the configured SecretWorkshop backend.

For the core library's webpack harness and local relay, run from the repository
root after installing:

```bash
cd peercompute
bash ./start-dev.sh
```

The core server listens on port **5173**. Open `/test-p2p.html` for connectivity
or `/games/sw2.html` and `/games/cb.html` for the legacy examples. The launcher
prefers HTTPS when it finds a certificate/key; use the protocol it prints.
For explicit trusted HTTPS, provide `SSL_CERT` and `SSL_KEY` together, keeping
the private key outside the repository.

### LAN / Mobile
Start relay with a public host so other devices can dial it:

```bash
RELAY_PUBLIC_HOST=192.168.1.174 ./start-dev.sh
```

Clients read `relay-config.json` and rewrite loopback addresses to the page host
when needed. Remote microphone, service-worker and WebGPU use requires a trusted
secure context; use a certificate valid for the hostname opened on that device.

## Integration: Minimal Game Setup

The bundled core harness exposes `window.NodeKernel`. In an ES module
application, import `NodeKernel` from `src/peercompute/index.js` instead. This
minimal example starts the shared-state/network runtime; artifact storage and
model services are opt-in application configuration.

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

## DataState + Compute Examples

### Layered DataState + commitDelta
```js
const node = new window.NodeKernel({
  enableGPUHub: true,
  enableWarmDeltaProvider: true,
  enableWebGPU: true,
  deltaNamespace: 'deltas'
});

await node.initialize();
await node.start();

const state = node.getStateManager();

state.commitDelta({
  taskId: 'physics',
  scope: 'deltas',
  version: performance.now(),
  payload: { positions },
  timestamp: performance.now()
});

const dataState = state.getDataState();
dataState.writeWarm('ui:stats', { fps }, 'ui');

const warmDeltas = dataState.getWarmDeltas('deltas');

// Hot layer (shared GPU buffers)
const gpuHub = node.getGPUHub();
await gpuHub.initialize();
const positionsBuffer = gpuHub.createHotBuffer(
  'hot:positions',
  byteLength,
  GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
);
```

### Compute Workers (JS, WASM, isolated GPU, hybrid WASM+WebGPU)
```js
// CPU task (runs in a worker when available)
const cpuResult = await node.submitTask({
  data: { positions },
  fn: ({ positions }) => {
    const next = positions.map((p) => p + 1);
    return {
      commitDelta: {
        taskId: 'cpu-physics',
        scope: 'deltas',
        version: Date.now(),
        payload: { positions: next }
      },
      value: { count: next.length }
    };
  }
});

// Pure WASM task with memory IO and a result adapter
const wasmResult = await node.submitTask({
  runtime: 'wasm',
  wasm: {
    source: '/compute/scaleField.wasm',
    entry: 'scaleFirst',
    args: [4],
    inputViews: [
      { name: 'input', dataKey: 'input', view: 'Int32Array', byteOffset: 0 }
    ],
    outputViews: [
      { name: 'scaled', view: 'Int32Array', byteOffset: 0, length: 1 }
    ],
    resultModule: '/compute/scaleFieldResult.js',
    resultExport: 'toCommitDelta'
  },
  data: { input: [7] }
});

// WebGPU task in a worker (module-based, isolated GPU)
await node.submitTask({
  module: '/compute/stepWebGPU.js',
  exportName: 'stepWebGPU',
  data: { /* inputs */ }
});

// Hybrid task: WASM preprocessing + worker-local WebGPU orchestration
await node.submitTask({
  runtime: 'wasm-webgpu',
  wasm: {
    source: '/compute/prefixSum.wasm'
  },
  module: '/compute/prefixSumHybrid.js',
  exportName: 'runPrefixSumHybrid',
  data: { values }
});
```

```js
// /compute/stepWebGPU.js
export async function stepWebGPU(input) {
  // Use WebGPU in the worker and emit CPU deltas for DataState.
  return {
    commitDelta: {
      taskId: 'gpu-physics',
      scope: 'deltas',
      version: Date.now(),
      payload: { /* compact CPU delta */ }
    },
    value: { ok: true }
  };
}
```

```js
// /compute/scaleFieldResult.js
export function toCommitDelta({ outputs }) {
  return {
    commitDelta: {
      taskId: 'wasm-scale',
      scope: 'deltas',
      version: Date.now(),
      payload: { scaled: Array.from(outputs.scaled) }
    },
    value: outputs
  };
}
```

## Profiles (Suggested Defaults)
- **Action/FPS**: snapshotHz 10-20, reliable events: spawn/join/attack
- **Co-op**: snapshotHz 5-10, reliable events: spawn/join/revive
- **Turn-based**: event-driven, reliable events: join/turn/commit
- **Sandbox**: low Hz, reliable events: place/delete/join/commit

## Tests

From this `peercompute/` directory:

```bash
npm run test:unit
npm run test:auto
```

The root workspace also exposes focused artifact, inference, peer-inference,
agent and model-library suites. See [the test strategy and evidence](../plan/tests.md)
for hardware/browser prerequisites and remaining gates. Browser execution can be
blocked by sandbox policies; that does not establish a source or model failure.

## Project Structure
```
peercompute/src/peercompute/
├── index.js
├── nodeKernel/NodeKernel.js
├── stateManager/StateManager.js
├── artifacts/
├── agents/
├── inference/
├── networkManager/NetworkManager.js
├── networkManager/NetworkScheduler.js
├── computeManager/ComputeManager.js
└── utils/Utils.js
```

## Roadmap Highlights
- Broader model/device qualification, large persistent peer transfers and
  resource contention between rendering and inference.
- Validated remote task-graph/result admission and portable placement across
  JS, WASM and WebGPU workers, beyond existing metadata and preflight contracts.
- Adaptive topology/workload organization and the planned Keystone demo.
- Opt-in agent model provisioning, migration and cloning, followed by the staged
  learned-control and training work in the Humunculus design.

See [the project plan](../plan/plan.md) for the current work order; implemented
protocol surfaces are not a claim that every distributed/scientific acceptance
gate has passed.

## License
MIT

# PeerCompute

**Core conjecture:** Given a globally distributed set of devices with varying
mutual bandwidth and compute resources, the optimal compute topology will emerge
automatically through cellular automata in which individual nodes try to maximize
compute throughput—like slime mold designing an optimal transit network.

PeerCompute is the JavaScript library for exploring this conjecture: peer-to-peer
networking, shared state and managed CPU/WASM/WebGPU execution for browser
applications. Its current controller provides spatial neighbor selection and
connection recovery; compute placement uses explicit policies and executors.
Demonstrating throughput-driven topology emergence is a research goal of the
[Keystone experiment](plan/todo/keystone-demo.md).

[Try the demos](https://metaversejs.github.io/peercompute/) ·
[Library guide](peercompute/README.md) · [API](peercompute/docs/API.md) ·
[Roadmap](plan/plan.md)

## What it does

- Connects peers through libp2p discovery, relays and WebRTC, with game/room scoping.
- Synchronizes shared state with Yjs and separates it from local buffers and persistent storage.
- Runs JavaScript, WASM and WebGPU workloads through managed workers, with task graphs, affinity, cancellation and resource accounting.
- Supports explicit remote tasks/graphs and optional content-addressed file sharing and peer model inference.
- Provides the foundation for multiplayer worlds, collaborative simulations, procedural generation and shared AI services.

## Quick start

Use **Node.js 24 LTS**. From a checkout of this repository:

```sh
nvm use 24
npm install
npm run dev
```

This starts the local relay and the unified HTTPS demo server on port `5173`. Open the ExoWebTUI overview at `https://localhost:5173/` or NetViz directly at `https://localhost:5173/netviz/` to inspect the network, or choose an application from the [demo directory](demos/README.md), which lists routes and start commands. Use a trusted development certificate for WebGPU and microphone access; certificate and LAN setup are covered in that guide. GPU workloads need a compatible browser/device.

## Use the library

In a bundled browser application served from the repository root, import the source
entry point and provide a reachable relay configuration at `/relay-config.json`:

```js
import { createNode } from './peercompute/src/peercompute/index.js';

const { bootstrapPeers } = await fetch('/relay-config.json').then(r => r.json());
const node = await createNode({
  bootstrapPeers, gameId: 'my-app', roomId: 'lobby', enablePersistence: false
});
await node.start();

const state = node.getStateManager();
state.subscribe('message', value => console.log(value));
state.write('message', 'Hello peers');
// Call await node.stop() when the application closes.
```

Peers using the same game and room can share state. The [library guide](peercompute/README.md)
adds snapshots/events, layered DataState, worker tasks and persistence examples.
[Relay setup](peercompute/docs/RELAY_SERVER.md) explains discovery, configuration and hosting.
An experimental [installed browser host](root-node/README.md) adds persistent
Chromium execution, a bounded native relay companion and versioned model-evidence
collection/query services.

## Architecture

| Component | Responsibility |
| --- | --- |
| **NodeKernel** | Application lifecycle, orchestration and policy. |
| **NetworkManager + NetworkScheduler** | Discovery, topology, scoped transport, message cadence and delivery. |
| **StateManager** | Shared Yjs state, local DataState and persistent artifacts. |
| **ComputeManager** | Managed JS/WASM/WebGPU workers, task graphs and resident services. |
| **Application code + GPU Hub** | App-owned input/rendering; optional shared GPU buffers and stage executors. |

![PeerCompute Node Block Diagram](./plan/arch/compute-node-block-diagram.png)
![PeerCompute Topology Examples](./plan/arch/p2p-network-topology-examples.png)

The diagrams include the intended architecture. The [current status audit](plan/reports/2026-11-08-library-status-audit.md)
distinguishes implemented components, experimental paths and remaining research.

## Demos

| Example | What it demonstrates |
| --- | --- |
| [NetViz](demos/netviz/README.md) | Peer topology, connection paths and runtime telemetry. |
| [CubeChat](demos/cubechat/README.md) | Multiplayer state, video/text chat and embodied agents. |
| [Eshkols in Space](demos/eshkols-in-space/README.md) | WebGPU N-body gravity (up to 2M bodies) using Eshkol laws, Barnes–Hut octrees and shared GPU Hub. |
| [VibeSlopDB](demos/vibeslopdb/README.md) | Natural-language SQL over SQLite/Postgres WASM and IndexedDB with live Mermaid ER and local/peer inference. |
| [Models and agents](demos/inference/README.md) | IPFS model storage and local/peer text, vision, image and voice inference. |
| [PlanetGen](demos/planetgen/README.md) / [Universes](demos/universes/README.md) | Procedural worlds and compute-driven generation. |
| [EarthGrid](demos/earth/README.md) / [RoadVector](demos/motorcycle/README.md) | Geodata rendering, interactive worlds and vehicle simulation. |
| [Multiscale Ladder](demos/multiscale/README.md) / [Schrodinger](demos/schrodinger/README.md) | Experimental scientific workloads with explicit proxy-model boundaries. |

The [full demo directory](demos/README.md) includes the other games, visualizers and
physics experiments. Each demo owns its setup, controls and implementation notes.

## Screenshots

| | | |
| --- | --- | --- |
| [![Hyperborea](demos/gallery/static/assets/hyperborea.png)](demos/hyperborea/README.md) | [![CubeChat](demos/gallery/static/assets/cubechat.png)](demos/cubechat/README.md) | [![SneakyWoods](demos/gallery/static/assets/sneakywoods.png)](demos/sneakywoods/README.md) |
| [![Daddy Go](demos/gallery/static/assets/daddygo.png)](demos/daddygo/README.md) | [![PlanetGen](demos/gallery/static/assets/planetgen.png)](demos/planetgen/README.md) | [![WXGlobe](demos/gallery/static/assets/wxglobe.png)](demos/wxglobe/README.md) |
| [![EarthGrid](demos/gallery/static/assets/earth.png)](demos/earth/README.md) | [![RoadVector](demos/gallery/static/assets/motorcycle.png)](demos/motorcycle/README.md) | [![Universes](demos/gallery/static/assets/universes.png)](demos/universes/README.md) |
| [![Multiscale Ladder](demos/gallery/static/assets/multiscale.svg)](demos/multiscale/README.md) | [![NetViz](demos/gallery/static/assets/netviz.png)](demos/netviz/README.md) | [![WebGPUPhys](demos/gallery/static/assets/webgpuphys.png)](demos/webgpuphys/README.md) |
| [![Schrodinger](demos/gallery/static/assets/schrodinger.svg)](demos/schrodinger/README.md) | [![Eshkols in Space](demos/gallery/static/assets/eshkols-in-space.png)](demos/eshkols-in-space/README.md) | [![VibeSlopDB](demos/gallery/static/assets/vibeslopdb.png)](demos/vibeslopdb/README.md) |

## Development

Run core tests with `npm --prefix peercompute run test:unit`. Build the library and
all demos with `npm run build:all`; `npm run docs:preview` serves the result locally.
See [test coverage](plan/test/test.md), the [network chaos lab](net-chaos-lab/README.md)
and [relay operations](peercompute/docs/RELAY_SERVER.md) for deeper workflows.

## License

MIT

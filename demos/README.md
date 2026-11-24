# PeerCompute demos

The demos exercise PeerCompute's networking, shared state and managed compute in
games, model hosting and simulation. They live in a unified `demos/` workspace
consuming PeerCompute through its public entrypoints (`peercompute/core` for
slim compute/network demos, and `peercompute` / `peercompute/inference` only
where model inference is used). Start with the
[published overview](https://metaversejs.github.io/peercompute/) or the
[library guide](../peercompute/README.md).

The [PeerCompute desktop guide](gallery/README.md) covers the ExoWebTUI launcher, directory filters, and rebuilding the landing page.

## Run locally

Run commands from the repository root with Node.js 24 LTS:

```sh
nvm use 24
npm install
npm run dev
```

This starts the local relay, the optional geodata proxy, and **one unified HTTPS Vite dev server on port `5173`** (`DEMOS_PORT` to override). Open the ExoWebTUI overview at `https://localhost:5173/`, or open any demo directly at `https://localhost:5173/<demo>/` (exact 1-to-1 URL parity with GitHub Pages). Because the gallery and all demos share one origin in development, ExoWebTUI's HTML-in-Canvas CRT shader capture and VibeSlopDB's native multi-window host work live in dev mode.

To run just the unified demo server (pointing at the configured backend relay unless a local relay is running separately), use `npm run dev:demos` or a focused helper such as `npm run dev:netviz`, `npm run dev:cubechat`, or `npm run dev:inference`.

Vite generates a development certificate using OpenSSL when none is supplied.
For phone, LAN or Tailscale access, set both `SSL_CERT` and `SSL_KEY` to a trusted
certificate/key for the hostname you will open, and open `https://<host>:5173/<demo>/`. Keep keys outside Git. The unified dev server binds to `0.0.0.0`;
WebGPU, microphones and service workers require a secure browser context.

## Demo directory

Each name links to its own setup, controls and implementation notes. Both local development (`https://localhost:5173/<path>`) and published Pages (`https://metaversejs.github.io/peercompute/<path>`) use the exact same directory path.

| Demo | What it demonstrates | Path | Runtime Tier |
| --- | --- | --- | --- |
| [Hyperborea](hyperborea/README.md) | Multiplayer action, replicated movement and bots | `hyperborea/` | `peercompute/core` |
| [CubeChat](cubechat/README.md) | Proximity video, world chat and embodied agents | `cubechat/` | `peercompute` (inference) |
| [PlanetGen](planetgen/README.md) | Procedural planets and weather compute | `planetgen/` | `peercompute/core` |
| [Universes](universes/README.md) | Procedural galaxies and compute workloads | `universes/` | `peercompute/core` |
| [WebGPUPhys](webgpuphys/README.md) | GPU rigid bodies and material-particle experiments | `webgpuphys/` | `peercompute/core` |
| [SneakyWoods](sneakywoods/README.md) | Multiplayer stealth/action and shared bot behavior | `sneakywoods/` | `peercompute/core` |
| [Daddy Go!](daddygo/README.md) | Pose-controlled runner and shared score/state | `daddygo/` | `peercompute/core` |
| [NetViz](netviz/README.md) | Live topology, transports and runtime telemetry | `netviz/` | `peercompute/core` |
| [Fano Reactor](fano-reactor/README.md) | Algebraic chemistry scaffold | `fano-reactor/` | `peercompute/core` |
| [Schrodinger Materials Console](schrodinger/README.md) | Atom/orbital and material-property workbench | `schrodinger/` | `peercompute/core` |
| [Multiscale Ladder](multiscale/README.md) | Managed WebGPU workers and multiscale proxy simulations | `multiscale/` | `peercompute/core` |
| [WXGlobe](wxglobe/README.md) | Token-free terrain and bathymetry contours | `wxglobe/` | `peercompute/core` |
| [EarthGrid](earth/README.md) | Real-data Earth/GIS and shared agent services | `earth/` | `peercompute` (inference) |
| [RoadVector](motorcycle/README.md) | Real-road motorcycle physics, traffic and WebXR | `motorcycle/` | `peercompute/core` |
| [Models and agents](inference/README.md) | IPFS model storage and local/peer inference | `inference/` | `peercompute` (inference) |
| [VibeSlopDB](vibeslopdb/README.md) | YOLO LLM SQL playground over SQLite, Postgres WASM, IndexedDB and draggable Mermaid ER | `vibeslopdb/` | `peercompute` (inference) |
| [Eshkols in Space](eshkols-in-space/README.md) | WebGPU N-body gravity simulator with Eshkol laws, Barnes–Hut octrees and sticky mergers | `eshkols-in-space/` | `peercompute/core` |

EarthGrid and RoadVector can use the optional
[geodata service](../services/geodata/README.md), normally on loopback port 8788
behind the development proxy (`/api`). Their READMEs explain source and deployment needs.
Scientific demos document their reduced/proxy models and remaining validation
boundaries; a working visualization does not establish scientific calibration.

## Build and preview

```sh
npm run build:all
npm run docs:preview
```

`npm run build:all` builds the core library, all 17 demos (via `demos/manifest.json` and `demos/vite.config.js`), and the ExoWebTUI gallery into `docs/`, pooling shared inference WASM runtimes (ORT asyncify, ORT JSEP, wllama) once into `docs/assets/runtime/`. Build a single demo with `npm run build:<demo>` or `node scripts/build-demos.mjs <demo>`. `docs/` is generated build output (published automatically on pushes to `main` via `.github/workflows/pages.yml`).

## Shared foundations and checks

The [WebXR toolkit](shared/xr/README.md),
[particle-rigid solver](shared/physics/particle-rigid/README.md) and
[vehicle layer](shared/physics/vehicle/README.md) are reusable across demos.
NetViz can attach to advertised runtime sessions; the optional
[Net Chaos Lab](../net-chaos-lab/README.md) exercises networking under churn,
partitions and bandwidth changes.

`node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js peercompute/tests/unit/workspaceBoundary.test.js`
checks unified demo wiring, strict core/demo boundaries, and release configuration. Each demo guide lists its focused tests; [plan/test/test.md](../plan/test/test.md) records browser, hardware and peer-network acceptance procedures and limitations.

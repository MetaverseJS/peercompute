# PeerCompute demos

The demos exercise PeerCompute's networking, shared state and managed compute in
games, model hosting and simulation. Some focused visualizations are local and
do not join the peer network. Start with the
[published overview](https://metaversejs.github.io/peercompute/) or the
[library guide](../peercompute/README.md).

## Run locally

Run commands from the repository root with Node.js 24 LTS:

```sh
nvm use 24
npm install
npm run dev
```

This starts the local relay and demo servers. Open the overview at
`https://localhost:4173/`. To work on one demo, use its root script, for example
`npm run dev:cubechat` or `npm run dev:inference`; these use the configured backend
unless you launch a local relay separately. `npm run docs:dev` starts just the
overview. The full-stack launchers use strict ports so conflicts fail visibly.

Vite generates a development certificate using OpenSSL when none is supplied.
For phone, LAN or Tailscale access, set both `SSL_CERT` and `SSL_KEY` to a trusted
certificate/key for the hostname you will open, and use that hostname with the
demo's port. Keep keys outside Git. The root demo launchers bind to `0.0.0.0`;
WebGPU, microphones and service workers require a secure browser context.

## Demo directory

Each name links to its own setup, controls and implementation notes. Local URLs
use HTTPS and the listed port; published URLs use the directory shown.

| Demo | What it demonstrates | Directory | Port |
| --- | --- | --- | --- |
| [Hyperborea](hyperborea/README.md) | Multiplayer action, replicated movement and bots | `hyperborea/` | 5175 |
| [CubeChat](cubechat/README.md) | Proximity video, world chat and embodied agents | `cubechat/` | 5176 |
| [PlanetGen](planetgen/README.md) | Procedural planets and weather compute | `planetgen/` | 5177 |
| [Universes](universes/README.md) | Procedural galaxies and compute workloads | `universes/` | 5178 |
| [WebGPUPhys](webgpuphys/README.md) | GPU rigid bodies and material-particle experiments | `webgpuphys/` | 5179 |
| [SneakyWoods](sneakywoods/README.md) | Multiplayer stealth/action and shared bot behavior | `sneakywoods/` | 5180 |
| [Daddy Go!](daddygo/README.md) | Pose-controlled runner and shared score/state | `daddygo/` | 5181 |
| [NetViz](netviz/README.md) | Live topology, transports and runtime telemetry | `netviz/` | 5182 |
| [Fano Reactor](fano-reactor/README.md) | Algebraic chemistry scaffold | `fano-reactor/` | 5183 |
| [Schrodinger Materials Console](schrodinger/README.md) | Atom/orbital and material-property workbench | `schrodinger/` | 5184 |
| [Multiscale Ladder](multiscale/README.md) | Managed WebGPU workers and multiscale proxy simulations | `multiscale/` | 5185 |
| [WXGlobe](wxglobe/README.md) | Token-free terrain and bathymetry contours | `wxglobe/` | 5186 |
| [EarthGrid](earth/README.md) | Real-data Earth/GIS and shared agent services | `earth/` | 5187 |
| [RoadVector](motorcycle/README.md) | Real-road motorcycle physics, traffic and WebXR | `motorcycle/` | 5188 |
| [Models and agents](inference/README.md) | IPFS model storage and local/peer inference | `inference/` | 5189 |

EarthGrid and RoadVector can use the optional
[geodata service](../services/geodata/README.md), normally on loopback port 8788
behind the development proxy. Their READMEs explain source and deployment needs.
Scientific demos document their reduced/proxy models and remaining validation
boundaries; a working visualization does not establish scientific calibration.

## Build and preview

```sh
npm run build:all
npm run docs:preview
```

The build writes the core library and all 15 Vite demos to `docs/`. Open
`https://localhost:4173/?prod=1` to follow the built folder links. Without
`?prod=1`, the local overview switches to development demo ports. The same folder
layout works beneath the published `/peercompute/` path. Building does not deploy;
GitHub Pages currently publishes `main:/docs`.

## Shared foundations and checks

The [WebXR toolkit](shared/xr/README.md),
[particle-rigid solver](shared/physics/particle-rigid/README.md) and
[vehicle layer](shared/physics/vehicle/README.md) are reusable across demos.
NetViz can attach to advertised runtime sessions; the optional
[Net Chaos Lab](../net-chaos-lab/README.md) exercises networking under churn,
partitions and bandwidth changes.

`node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js`
checks demo wiring and release configuration. Each demo guide lists its focused
tests; [plan/tests.md](../plan/tests.md) records browser, hardware and peer-network
acceptance procedures and limitations.

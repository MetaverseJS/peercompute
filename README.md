# PeerCompute

PeerCompute is a browser-based P2P networking and distributed compute library built on libp2p. It targets multiplayer games, collaborative simulations, and flexible compute workloads that need to run in the browser with configurable topology and clocking.

## Key Innovation
Given a network of compute nodes with varying mutual bandwidth and compute power it's possible to use cellular automata rules (where each node attempts to maximize it's own compute throughput) to form optimal compute networks for arbitrary workloads. 
The Keystone demo (planned) will visualize this reconfiguration live with selectable workloads and topology modes.


## What You Can Use Today
- **Browser-first libp2p runtime** with websocket relay bootstrap, relay reservations, gossipsub/floodsub messaging, presence, room/game scoping, and relay-config discovery.
- **NodeKernel orchestration** with `NetworkManager`, `StateManager`, `ComputeManager`, `ioManager`, and configurable clocking/policy modes.
- **NetworkScheduler streams** for snapshots, events, and commands with cadence control, retries, keepalive, and profile-based defaults.
- **Direct-path management** with relay-assisted WebRTC upgrades, relay retention/drop policy, logical `targetConnections` / `maxConnections`, and transport headroom.
- **Layered shared state** through Yjs plus `DataState` hot/warm/cold storage, scoped namespaces, `commitDelta`, and optional IndexedDB persistence.
- **Distributed compute runtimes** for CPU workers, pure WASM, worker-local WebGPU, and hybrid WASM+WebGPU tasks.
- **Cross-demo observability** through NetViz telemetry, attach-session discovery, RTC path diagnostics, and transport/signaling/media-path truth.
- **Playable demo surfaces** including CubeChat, Hyperborea, SneakyWoods, Daddy Go!, NetViz, PlanetGen, Universes, WebGPUPhys, and the Fano Reactor scaffold.
- **Automation + stress tooling** including the shared in-browser bot host, reusable Quake-style bot core, runtime multiplayer browser gates, and the Containernet-based chaos lab.
- **Deployment support** with generated relay config artifacts, Node relay for dev, Go relay for production, coturn integration, and systemd installers for the backend stack.

## Functional Surface Area

### Core Runtime
- `NodeKernel` is the top-level orchestration surface for browser peers. It starts and coordinates networking, shared state, compute, telemetry, and local IO policy.
- Clocking is configurable: independent, kernel-driven, or hybrid sync points depending on determinism vs throughput requirements.
- Profiles and scheduler settings let one app use low-latency action-game cadence while another uses sparse co-op or turn-style messaging.
- Rooms, game IDs, and topology IDs keep sessions isolated even when multiple demos share the same relay fabric.

### Networking and Topology
- Browser peers bootstrap through a relay, then attempt to upgrade to more direct paths when possible instead of staying relay-bound forever.
- Active transport truth is tracked explicitly: plain relay, relay-scoped WebRTC, direct WebRTC/media, websocket relay, and pubsub overlays are not collapsed into one ambiguous state.
- Topology policy includes `connectionRadius`, `targetConnections`, `maxConnections`, unsolicited-peer pruning, relay-assist redials, and direct-upgrade overlap headroom.
- Relay retention is tunable, including logN keeper modes so a swarm can keep only a minority of peers attached to the bootstrap relay after convergence.
- Runtime relay config can be loaded from built artifacts, a default prod URL, or an explicit `?relayConfigUrl=...` override.

### State, Persistence, and Compute
- `StateManager` provides shared Yjs-backed documents plus PeerCompute-specific scoped state publication.
- `DataState` is layered on purpose: hot GPU buffers for render-coupled/high-frequency state, warm CPU deltas for replicated working state and telemetry, and cold IndexedDB persistence for snapshots and durable caches.
- `commitDelta` lets compute tasks emit small authoritative state updates instead of forcing full-state rewrites.
- `ComputeManager` supports inline and worker-safe JS, pure WASM modules with typed memory views, isolated worker WebGPU jobs, and hybrid WASM+WebGPU pipelines.
- The optional GPU hub keeps a shared main-thread WebGPU context available for render-adjacent workloads that should not live in isolated workers.

### Observability, Automation, and Test Infrastructure
- NetViz can attach to any running demo session, discover rooms from shared pubsub beacons, and render peer/edge truth across transport, pubsub, signaling, and media paths.
- Browser telemetry includes warm-delta debug state, RTC selected-candidate evidence, connection counters, and relay-retention diagnostics for live prod investigation.
- `net-chaos-lab/` provides scenario-driven protocol testing with NAT segments, dual-stack/IPv4-only/IPv6-only modes, partitions, churn, bandwidth shifts, and multi-agent browser probes.
- The shared bot system can now spawn hidden same-origin browser peers from demo settings screens and drive them through a reusable bridge contract instead of per-demo hacks.
- The reusable bot behavior core is intentionally modular: world model, navigation, memory, personalities, and combat/steering logic live under `net-chaos-lab/agent/quake3/` and can be adapted to more games.
- The repo includes both lightweight static gates and full headless Chromium runtime gates so transport or demo regressions can be checked locally before deploy.

### Demo and Product Surfaces
- **CubeChat** is a browser 3D social/video world with room/password deep links, remote webcam playback, screen share, themed worlds, and bot spawning from settings.
- **Hyperborea** is a top-down multiplayer action surface used to validate replicated remote-player state, attacks, room flow, bot control, and runtime attach/debug behavior.
- **SneakyWoods** is a stealth/action multiplayer surface with shared room presence, combat hooks, and the same bot/settings integration path as the other live demos.
- **Daddy Go!** is a smaller multiplayer validation surface used for deterministic replicated score/state checks in the browser runtime suite.
- **NetViz** is the live multiplayer debugger and topology viewer, not just a demo. It is the primary surface for inspecting transport truth, room attach, relay keepers, and chaos-lab overlays.
- **PlanetGen**, **Universes**, and **WebGPUPhys** exercise rendering, procedural generation, and compute-oriented browser workloads on the same stack.
- **Fano Reactor** is the current chemistry/scaffold branch for exact sedenion bond classification and future distributed chemistry/compute workloads.

### Backend and Deployment
- Local development can run entirely from Vite plus the repo relay scripts, with strict demo ports and loopback-safe relay defaults.
- Production is designed around the Go relay under systemd, with coturn either bundled through `pcserver.sh` or split into its own hardened systemd unit.
- `npm run build` emits the docs site plus per-demo relay config artifacts so GitHub Pages builds can point back at the live production relay config.
- Repo scripts cover dry-run backend validation, relay-only launch, combined relay+TURN launch, coturn install, and full split-service production install.

## Architecture Overview

### Core Components
- **NodeKernel**: orchestration and policy. Chooses what to send, when to send it, and who to send/request from.
- **NetworkManager**: transport, routing, discovery, and scoping (libp2p).
- **NetworkScheduler**: timing primitive (cadence, batching, keepalive, retries).
- **StateManager**: shared state sync (Yjs + scoped namespaces).
- **GPU Hub (main thread)**: shared WebGPU context for render-coupled compute tasks.
- **ComputeManager**: JS/WASM/WebGPU compute runtime with worker offload, hybrid `wasm-webgpu` tasks, and `commitDelta` support.
- **ioManager**: controls local input/output (like threejs and your keyboard).
- **DataState (layered)**: hot GPU buffers, warm CPU deltas, cold IndexedDB snapshots.

### Orchestration vs Transport
- NodeKernel defines **policy** (clock mode, profiles, dynamic throttling).
- NetworkManager executes **transport** (dial, pubsub, presence, scope filters).
- NetworkScheduler enforces **cadence** once policy is set.

### Block Diagram
![PeerCompute Node Block Diagram](./plan/arch/compute-node-block-diagram.png)

### Network Topology
![PeerCompute Topology Examples](./plan/arch/p2p-network-topology-examples.png)

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
npm install

# Start relay + all demos over HTTPS
npm run dev
```

Dev servers:
- `https://localhost:5175/` (Hyperborea)
- `https://localhost:5176/` (CubeChat)
- `https://localhost:5177/` (PlanetGen)
- `https://localhost:5178/` (Universes)
- `https://localhost:5179/` (WebGPUPhys)
- `https://localhost:5180/` (SneakyWoods)
- `https://localhost:5181/` (Daddy Go!)
- `https://localhost:5183/` (Fano Reactor)
- `https://localhost:5182/` (NetViz)

Multiplayer bot controls:
- CubeChat, Hyperborea, and SneakyWoods now expose a `Bots` section inside their settings menus.
- `Add Bots` spawns hidden same-origin browser peers that join the current room/password and drive themselves through the shared Quake-style bot bridge/runtime.

### NetViz Attach (Any Demo)
- Every `NodeKernel` now publishes NetViz debug telemetry (`telemetry:<peerId>`) by default.
- Demos now also publish lightweight NetViz session beacons on a shared pubsub topic (`peercompute-netviz-sessions`), so NetViz can discover sessions across different demo ports/origins.
- Open NetViz (`https://localhost:5182/`), connect to the relay network, then use **Attach demo** to auto-load topology/room from discovered live sessions.
- NetViz then connects to that session and shows peer graph + link types (direct/relay/pubsub) for the target demo.
- To disable publishing in a demo, set `enableNetVizDebugTelemetry: false` on that demo's `NodeKernel` config.

### Docs Build / Preview
```bash
npm run build
npm run docs:preview
```

- The overview page (`docs/index.html`) now defaults to production folder links (`./hyperborea/`, `./cubechat/`, etc.), so GitHub Pages-style deploys work under nested paths like `https://MetaverseJS.github.io/<repo>/`.
- When the overview is served from local docs dev port `4173`, links automatically switch to local demo ports for dev workflows. Use `?prod=1` to force production links locally.

### Relay Runtime Selection
For local dev, `npm run dev` and `npm run dev:local-relay` launch the Node relay by default.
Production should run the Go relay under systemd, not a detached shell or ad hoc tmux session.

To use the Go relay in dev, install Go 1.24+ and set `RELAY_IMPL=go`:

```bash
go version
RELAY_IMPL=go npm run dev:relay
```

To run the relay directly without the npm wrapper:

```bash
bash scripts/run-go-relay.sh
```

For production launchers, `scripts/start-relay-prod.sh` now treats `RELAY_IMPL=go` as strict and will fail instead of silently falling back to Node when `go` is missing.

`npm run dev` and `npm run dev:local-relay` now default to loopback-safe relay settings (`localhost` / `127.0.0.1`) so HTTPS/WSS certs stay valid and demos consistently discover peers.  
If you explicitly want LAN exposure, opt in:

```bash
RELAY_DEV_EXPOSE_LAN=1 npm run dev:local-relay
```

Dev launchers now run Vite with `--strictPort` by default (`DEV_STRICT_PORT=1`) so port conflicts fail fast instead of silently moving demos to different ports.
If you intentionally want automatic port fallback, opt out:

```bash
DEV_STRICT_PORT=0 npm run dev:local-relay
```

### Relay Host Config (Single File)
Use `config/relay.json` as the single source of truth for dev + prod relay settings:

```json
{
  "relayHost": "secretworkshop.net",
  "relayPort": "8080",
  "relayProtocol": "wss",
  "relayPeerId": "<relay-peer-id>",
  "relayIdentityFile": "config/relay-peer-id.json",
  "relayConfigUrl": "https://secretworkshop.net/peercompute/config/relay-config.json",
  "relayConfigFile": "config/relay-config.json",
  "webrtc": {
    "iceServers": [
      {
        "urls": "stun:stun.l.google.com:19302"
      },
      {
        "urls": [
          "turn:secretworkshop.net:3478?transport=udp",
          "turn:secretworkshop.net:3478?transport=tcp"
        ],
        "username": "peer",
        "credential": "compute"
      }
    ],
    "dropRelayOnDirect": true,
    "dropRelayBootstrapOnDirect": true,
    "countRelayWebrtcAsDirectCapable": true,
    "relayRetention": {
      "mode": "logn",
      "min": 1,
      "max": 10
    }
  },
  "listenHost": "127.0.0.1",
  "listenPort": "8080",
  "publicHost": "",
  "publicPort": ""
}
```

Environment variables (`RELAY_PUBLIC_HOST`, `RELAY_PUBLIC_PORT`, `RELAY_LISTEN_HOST`, `RELAY_LISTEN_PORT`) still override the config file.
Relay peer IDs are logged on startup as `Relay Server ID` / `Relay Address`.
Set `relayIdentityFile` (or `RELAY_IDENTITY_FILE`) so the peerId stays stable across restarts.
If you already have the full multiaddr, set `bootstrapPeers` in `config/relay.json` instead.

### Runtime Relay Config
`npm run build` writes each demo's `public/relay-config.json` and `public/relay-config-source.json`.
Demos resolve the relay config in this order:

1. `?relayConfigUrl=...` query param override.
2. `relay-config-source.json` (default URL from `config/relay.json`).
3. Local `relay-config.json` fallback.

To launch the backend stack with WSS relay plus local STUN/TURN in production, provide certs and run:

```bash
RELAY_SSL_CERT=/path/to/fullchain.pem RELAY_SSL_KEY=/path/to/privkey.pem bash scripts/pcserver.sh
```

This starts the relay and a coturn-compatible TURN/STUN service together.
For production, the intended relay runtime here is Go (`RELAY_IMPL=go`), and the production launcher now fails closed if Go is unavailable.
For a headless config/render check, run `npm run backend:dry-run`.
If you only want the relay process without TURN/STUN, run `bash scripts/start-relay-prod.sh`.

If you terminate TLS in nginx, set `relayHost` to the relay subdomain, keep `relayPort` at `443`,
and set `listenHost`/`listenPort` to the local relay (e.g. `127.0.0.1:8080`) with empty cert fields.
Point nginx at the on-disk `relayConfigFile` location so `/relay-config.json` is served with CORS.
In that proxied setup, keep `RELAY_PUBLIC_HOST` / `RELAY_PUBLIC_PORT` / `RELAY_PUBLIC_PROTOCOL` correct in the systemd environment as well:
the Go relay now uses them for libp2p advertised addresses and relay reservations, not just for writing `relay-config.json`.

### Relay as a systemd Service
The repo includes a helper that installs and enables the recommended production unit for the backend stack:

```bash
sudo -E bash scripts/install-relay-systemd.sh
```

That installer creates `peercompute-relay.service`, runs `scripts/pcserver.sh`, starts both relay + TURN/STUN, and defaults the service to `RELAY_IMPL=go`.
When installed with the Go relay, the generated unit also sets `RELAY_REQUIRE_GO=1` so production cannot silently drift back to Node.
It also writes the install-time `PATH` into the unit so a Go toolchain outside the default systemd search path still resolves correctly.
You can install it as relay-only by passing `PCSERVER_ENABLE_TURN=0`, or leave TURN enabled for the combined backend unit.

Optional overrides:

```bash
RELAY_SERVICE_NAME=peercompute-relay \
RELAY_SERVICE_USER=$USER \
RELAY_SERVICE_GROUP=$USER \
RELAY_IMPL=go \
PCSERVER_ENABLE_TURN=0 \
sudo -E bash scripts/install-relay-systemd.sh
```

The service runs `scripts/pcserver.sh`, so it starts the relay and TURN/STUN together using `config/relay.json` plus the same env overrides from `config/relay.env`.
Use `systemctl status peercompute-relay` (or your custom name) to verify it is running.

If you want one command that installs the recommended split production layout, use:

```bash
sudo -E env "PATH=$PATH" bash scripts/install-prod-systemd-services.sh
```

That wrapper defaults to:
- `peercompute-relay.service` as Go relay only
- `peercompute-coturn.service` as TURN/STUN only

Useful variants:

```bash
sudo -E env "PATH=$PATH" bash scripts/install-prod-systemd-services.sh --dry-run
sudo -E env "PATH=$PATH" bash scripts/install-prod-systemd-services.sh --combined
```

### Production ICE (Google STUN + Coturn)
Current defaults are configured for Google STUN plus your own coturn:
- `stun:stun.l.google.com:19302`
- `turn:secretworkshop.net:3478?transport=udp`
- `turn:secretworkshop.net:3478?transport=tcp`

You can override coturn host/credentials in `config/relay.env`:

```bash
RELAY_TURN_HOST=secretworkshop.net
RELAY_TURN_PORT=3478
RELAY_TURN_USERNAME=peer
RELAY_TURN_CREDENTIAL=compute
```

`scripts/pcserver.sh` and `scripts/start-turn-prod.sh` use the same TURN host/port/credential values when they generate the local coturn config.
If your TURN server is behind NAT, set:

```bash
PCSERVER_TURN_EXTERNAL_IP=<public-ip>
PCSERVER_TURN_RELAY_IP=<local-interface-ip>
```

Minimal coturn config example (`/etc/turnserver.conf`):

```ini
listening-port=3478
fingerprint
lt-cred-mech
user=peer:compute
realm=secretworkshop.net
stale-nonce
no-loopback-peers
no-multicast-peers
min-port=49152
max-port=65535
total-quota=200
bps-capacity=0
```

If you use special characters in TURN credentials, set `RELAY_WEBRTC_CONFIG` directly with a full JSON string instead of composing it via per-field env vars.

### Coturn as a systemd Service
If you want TURN/STUN isolated from the combined backend service, you can still install coturn separately with the repo helper:

Install coturn and create your config first:

```bash
sudo apt update
sudo apt install -y coturn
sudoedit /etc/turnserver.conf
```

Then install and start the hardened systemd unit with the repo helper:

```bash
sudo -E bash scripts/install-coturn-systemd.sh
```

Optional overrides:

```bash
COTURN_SERVICE_NAME=peercompute-coturn \
COTURN_SERVICE_USER=turnserver \
COTURN_SERVICE_GROUP=turnserver \
COTURN_CONFIG_FILE=/etc/turnserver.conf \
sudo -E bash scripts/install-coturn-systemd.sh
```

The helper writes `/etc/systemd/system/<service>.service`, enables it, starts it, and prints `systemctl status`.
Use this together with `PCSERVER_ENABLE_TURN=0` on `scripts/install-relay-systemd.sh` when you want relay and coturn as separate systemd units.

### Coturn Hardening Checklist
- Use long random TURN credentials and rotate them regularly.
- Keep `stale-nonce`, `no-loopback-peers`, and `no-multicast-peers` enabled.
- Open firewall for `3478/tcp`, `3478/udp`, and relay RTP/RTCP UDP range (`49152-65535/udp`).
- If your server is behind NAT, set coturn `external-ip` and `relay-ip` explicitly.
- Keep relay `webrtc.iceServers` aligned with coturn host/port and credentials.

## Demo Gallery
See `docs/index.html` for the full demo index.

Current demos and validation surfaces:
- **CubeChat**: browser video chat world with themed maps, room/password deep links, shared movement/state, screen share, and in-browser bot spawning.
- **Hyperborea**: multiplayer action/adventure surface for replicated movement, attacks, remote-player assertions, and bot-driven room activity.
- **SneakyWoods**: multiplayer stealth/action surface with the shared bot bridge and settings-screen bot host.
- **Daddy Go!**: compact multiplayer score/state validation demo with deterministic runtime checks.
- **NetViz**: transport inspector, room attach tool, relay/debug overlay, and chaos-lab watcher.
- **PlanetGen** and **Universes**: procedural generation / world-building demos on the same runtime stack.
- **WebGPUPhys**: physics and compute-oriented demos that exercise render-coupled compute pipelines.
- **Fano Reactor**: early chemistry demo scaffold for the sedenion/Fano-plane branch.

![Hyperborea](docs/assets/hyperborea.png)
![CubeChat](docs/assets/cubechat.png)
![SneakyWoods](docs/assets/sneakywoods.png)
![Daddy Go](docs/assets/daddygo.png)
![PlanetGen](docs/assets/planetgen.png)
![Universes](docs/assets/universes.png)
![NetViz](docs/assets/netviz.png)
![WebGPUPhys](docs/assets/webgpuphys.png)

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

## Network Chaos Lab
`net-chaos-lab/` includes a Containernet-based internet simulator for stress-testing libp2p behavior across:
- dual-stack and single-stack IP modes
- multiple NAT segments
- in-lab relay/TURN/DNS/HTTPS services
- 10-50 browser agents
- partitions, bandwidth shifts, and churn events
- direct-vs-relay diagnostics (announced `/webrtc` addresses, connection type ratios, post-convergence churn/flip stability metrics, ICE candidate distributions)

This is optional infrastructure for heavy-duty protocol-level testing of PeerCompute itself. It is not required to use PeerCompute in an app, run normal demos, or use the standard dev workflow.
If you are building apps/demos and not debugging protocol internals, you can ignore `net-chaos-lab/` entirely.
Chaos-lab commands are now owned by `net-chaos-lab/package.json`; root `npm run chaos-lab:*` scripts are lightweight wrappers.

### Chaos-Lab Dependencies
- `Node.js` 24 LTS + `npm` (for demo/probe tooling).
- `Python` 3.10+ with `pip` (for chaos-lab runner modules).
- `Docker Engine` running locally (required for agent/service containers).
- `Mininet` + `Containernet` installed (required for real topology mode).
- Linux networking tools available: `iproute2`, `iptables`, and `tc`.

Quick checks:

```bash
node --version
npm --version
python3 --version
docker --version
mn --version
python3 -c "from mininet.net import Containernet; print('containernet ok')"
```

For dry-run only (no real containerized topology), Docker/Mininet/Containernet are not required.

Quick start:

```bash
npm run chaos-lab:deps
npm run chaos-lab
npm run chaos-lab:full
npm run chaos-lab:matrix
npm run chaos-lab:matrix:demos
npm run chaos-lab:matrix:full
npm run chaos-lab:matrix:demos:full
npm run chaos-lab:matrix:demos:loop
npm run chaos-lab:matrix:smoke
npm run chaos-lab:cleanup
```

You can also run chaos-lab commands directly in its own package namespace:

```bash
npm --prefix net-chaos-lab run deps:python
npm --prefix net-chaos-lab run matrix:full
```

`npm run chaos-lab:matrix:full` launches a NetViz watcher automatically and prints a URL preloaded with chaos-lab visualization defaults (including `autoConnect=0`). In watcher mode, NetViz now renders live chaos IP topology plus probe-derived P2P topology from `/chaos-api`, even when the observer browser is not directly peered. Open the printed URL exactly (the script may choose a non-5182 port if 5182 is already in use). Click `Connect` manually only if you also want the observer browser to join a relay-backed P2P session directly.

`npm run chaos-lab:matrix:smoke` is a dry-run orchestration smoke gate (it intentionally reports `probe_total: 0`).

`npm run chaos-lab:matrix:full` must be run from an interactive terminal so sudo can prompt for containernet execution.

If running containernet mode with `sudo`, preserve your Node 24 PATH:

```bash
sudo -E env "PATH=$PATH" PYTHON_BIN=/home/$USER/projects/containernet/.venv/bin/python \
  bash net-chaos-lab/scripts/chaos-lab.sh --mode containernet
```

See `net-chaos-lab/README.md` for topology/scenario config details and dashboard usage.
Default matrix config is `net-chaos-lab/configs/matrix/direct-regression.yaml`.
Cross-demo matrix config is `net-chaos-lab/configs/matrix/demo-regression.yaml`.
Containernet mode performs `mn -c` cleanup at startup (when run as root) to avoid stale Mininet interface collisions.
Containernet mode preflights all planned docker node names and removes stale `mn.<node>` containers before node creation to avoid name conflicts after failed runs.
Default chaos-lab topology uses `peercompute/net-chaos-lab-node:latest` for agents and core services; this image is auto-built from `net-chaos-lab/docker/chaos-node.Dockerfile` when missing and already includes `iproute2` + DNS/HTTPS/TURN tooling.

## Tests
```bash
npm --prefix peercompute run test:unit
node --test demos/tests/demo-ports.test.js
npm --prefix net-chaos-lab run test:behavior
npm run test:runtime:p2p
RUNTIME_P2P_DEMOS=hyperborea npm run test:runtime:p2p
```

Note: Playwright is blocked in sandboxed environments (Chromium EPERM).
`npm run test:runtime` also exercises the built docs bundle, but it includes non-multiplayer demos as well.
`npm run test:runtime:p2p` is the full multiplayer browser gate for `cubechat`, `hyperborea`, `sneakywoods`, `daddygo`, and `netviz`; use `RUNTIME_P2P_DEMOS=...` to isolate a subset while debugging.
`node --test demos/tests/demo-ports.test.js` is the fast static/docs gate for demo wiring, bot bridge registration, and settings-surface expectations.
`npm --prefix net-chaos-lab run test:behavior` verifies the reusable bot behavior core, personalities, navigation, and demo interaction profiles.

## Project Structure
```
config/
docs/
demos/
├── cubechat/
├── daddygo/
├── hyperborea/
├── netviz/
├── sneakywoods/
├── shared/
│   ├── peercomputeBotBridge.js
│   └── peercomputeBots.js
├── universes/
├── planetgen/
└── webgpuphys/
net-chaos-lab/
├── agent/
│   ├── player-behavior-harness.mjs
│   └── quake3/
├── configs/
├── src/
└── tests/
peercompute/src/peercompute/
├── index.js
├── nodeKernel/NodeKernel.js
├── stateManager/StateManager.js
├── networkManager/NetworkManager.js
├── networkManager/NetworkScheduler.js
├── computeManager/ComputeManager.js
└── utils/Utils.js
plan/
scripts/
```

## Roadmap Highlights
- Adaptive profiles (RTT/peer count aware).
- Authority election + snapshot ownership modes.
- Optional binary encoding for high-throughput channels.
- ComputeManager integration with network scheduler for distributed workloads.
- Portable compute placement across JS, WASM, and hybrid WASM+WebGPU task descriptors.

## License
MIT

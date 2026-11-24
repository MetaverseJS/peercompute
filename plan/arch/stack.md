# Application stack

## Current state

- **Runtime & language:** Node.js 24 LTS, Vanilla JavaScript (ES6 modules, no TypeScript, no React).
- **Workspace & boundary layout:** Three.js-style single-repo strict-boundary monorepo (`workspaces`: `peercompute`, `packages/exopute`, `packages/geo-core`, `services/geodata`, `demos`). `peercompute/` is a lean zero-reverse-dependency library; `demos/` is a sibling showcase workspace consuming PeerCompute strictly through public entrypoints (`@peercompute/core` for the 13 non-inference demos, `@peercompute` for the 4 inference demos), enforced by `peercompute/tests/unit/workspaceBoundary.test.js`.
- **Build, dev server & deployment:** Single-port unified HTTPS Vite 6 multi-page dev server on port `5173` (`demos/vite.config.js` + `demos/manifest.json` + `demos/package.json` + `scripts/build-demos.mjs` + `scripts/dev-demo.mjs`), serving the ExoWebTUI gallery at `/` and all 17 demos at `/<demo>/` on one origin with COOP/COEP isolation. Hand-authored gallery sources live in `demos/gallery/static/`; generated `docs/` Pages output (with pooled shared inference WASM runtimes under `docs/assets/runtime/`) is untracked in Git and deployed via `.github/workflows/pages.yml`. Legacy Webpack 5 still builds the `peercompute` standalone bundle (`peercompute/webpack.config.js`).
- **Graphics & GPU compute:** Unified Three.js `^0.182.0` across all demos (`WebGPURenderer`, extensions/built-ins), native WebGPU compute pipelines (`GPUHubManager`, `GpuResidentLaneManager`), WASM / WebAssembly workers.
- **P2P networking & relays:** `libp2p` v3, `@libp2p/webrtc`, `@libp2p/websockets`, `@libp2p/circuit-relay-v2`, `@libp2p/gossipsub`, `@libp2p/noise`, `@libp2p/yamux`, plus production Go relay (`peercompute/src/relay-go`, Go 1.24+) and `coturn` STUN/TURN on `secretworkshop.net`.
- **Distributed state & artifacts:** `yjs` CRDT + `y-indexeddb`, `DataState` (hot/warm/cold), `ReservationLedger`, `SpatialTileLeaseBroker`, Helia / UnixFS content-addressed `ArtifactStore`, `@noble/hashes`.
- **Optional inference (`peercompute/inference`):** `@huggingface/transformers`, `@wllama/wllama`, `peercompute-diffusion-ort` (`onnxruntime-web`), `@kaminos/webgpu-inference-kit` (strictly excluded from `peercompute/core`).
- **UI & testing:** Retro-terminal CSS / ExoWebTUI shell, Node native `node:test`, Playwright with system headless Google Chrome (`/usr/bin/google-chrome`).

## Target state

- Migrate `peercompute`'s standalone library build from Webpack 5 to Vite (see [todo/retire-multiscale-and-webpack.md](../todo/retire-multiscale-and-webpack.md)).
- Publish `peercompute` (`peercompute/core`, `peercompute/inference`) and `exopute` cleanly on npm.

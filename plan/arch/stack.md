# Application stack

## Current state

- **Runtime & language:** Node.js 24 LTS, Vanilla JavaScript (ES6 modules, no TypeScript, no React).
- **Build & bundling:** Vite 6 across all 17 workspace demos and ExoWebTUI gallery; legacy Webpack 5 still present for `peercompute` standalone bundle (`peercompute/webpack.config.js`).
- **Graphics & GPU compute:** Three.js `0.182.0` (`WebGPURenderer`, extensions/built-ins), native WebGPU compute pipelines (`GPUHubManager`, `GpuResidentLaneManager`), WASM / WebAssembly workers.
- **P2P networking & relays:** `libp2p` v3, `@libp2p/webrtc`, `@libp2p/websockets`, `@libp2p/circuit-relay-v2`, `@libp2p/gossipsub`, `@libp2p/noise`, `@libp2p/yamux`, plus production Go relay (`peercompute/src/relay-go`, Go 1.24+) and `coturn` STUN/TURN on `secretworkshop.net`.
- **Distributed state & artifacts:** `yjs` CRDT + `y-indexeddb`, `DataState` (hot/warm/cold), `ReservationLedger`, `SpatialTileLeaseBroker`, Helia / UnixFS content-addressed `ArtifactStore`, `@noble/hashes`.
- **Optional inference (`peercompute/inference`):** `@huggingface/transformers`, `@wllama/wllama`, `peercompute-diffusion-ort` (`onnxruntime-web`), `@kaminos/webgpu-inference-kit` (strictly excluded from `peercompute/core`).
- **UI & testing:** Retro-terminal CSS / ExoWebTUI shell, Node native `node:test`, Playwright with system headless Google Chrome (`/usr/bin/google-chrome`).

## Target state

- Migrate `peercompute`'s standalone library build from Webpack 5 to Vite (see [todo/retire-multiscale-and-webpack.md](../todo/retire-multiscale-and-webpack.md)).
- Publish `peercompute` (`peercompute/core`, `peercompute/inference`) and `exopute` cleanly on npm.

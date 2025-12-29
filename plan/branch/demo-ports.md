Instructions: This file contains short term goals for the current branch.

## Branch Goal: Port all "*-ref" demos into `demos/` as Vite + PeerCompute apps

### Inventory (sources)
- `demos/cubechat-ref` -> `/home/cos/projects/cubechat`
- `demos/planetgen-ref` -> `/home/cos/projects/planetgen`
- `demos/universes-ref` -> `/home/cos/projects/universes`
- `demos/webgpuphys-ref` -> `/home/cos/projects/webgpuphys`

### Additional Demos
- `demos/sneakywoods` (formerly sw2) -> in-repo port
- `demos/daddygo` -> pose runner demo, needs PeerCompute high score sync

### Global Porting Standards
- Each demo is a standalone Vite project under `demos/<name>`.
- Vite server must allow the local PeerCompute source tree and set `@peercompute` alias to `peercompute/src/peercompute/index.js`.
- Multiplayer must use PeerCompute relay only (load `public/relay-config.json`).
- Heavy compute: route through PeerCompute ComputeManager (shared GPU when renderer needs buffers, isolated GPU otherwise).
- No additional backend servers besides the existing PeerCompute relay.
- Each demo owns a small `README.md` with run instructions and a short note on network requirements.

### Shared Wiring Tasks
1) Add a reusable relay config loader helper for demos (fallbacks: `/relay-config.json`, `./relay-config.json`).
2) Add a demo test script to verify each port has required files and relay config where needed.

### Demo-by-demo Plan

#### 1) CubeChat (multiplayer + media)
- Port UI + scene to `demos/cubechat` using Vite.
- Replace WebSocket signaling with PeerCompute network events.
  - Use NodeKernel + NetworkScheduler snapshots for player state.
  - Route WebRTC offer/answer/ICE through `queueEvent` (or warm deltas) so signaling uses PeerCompute relay.
  - Keep media optional: if getUserMedia fails, continue without streams.
- Add a thin `PeerComputeNetworkAdapter` to mirror the old `P2PNetwork` API used by the game code.
- Tests:
  - Node test to verify adapter exports and config usage.
  - Manual: open two tabs, confirm players and messages sync.

#### 2) PlanetGen (heavy compute + rendering)
- Port to `demos/planetgen` using Vite, keep existing renderer.
- Move compute-heavy simulation steps to PeerCompute ComputeManager:
  - Shared GPU mode when buffers feed directly into rendering (GPU hub on main thread).
  - Isolated GPU worker for long-running background simulation; commit CPU deltas to DataState.
- Keep UI + controls on main thread.
- Tests:
  - Node test for module imports.
  - Manual: visual check (planet renders, UI updates, simulation advances).

#### 3) Universes (visual + compute)
- Port to `demos/universes` using Vite.
- Identify core compute loop (particles/galaxy); run via ComputeManager.
  - Shared GPU if renderer consumes GPU buffers, otherwise isolated GPU worker with CPU deltas.
- Wire a minimal PeerCompute node even if multiplayer is optional.
- Tests:
  - Node test for module imports.
  - Manual: visuals update and no console errors.

#### 4) WebGPUPhys (physics, WebGPU-first)
- Port `webgpuphys/demos` into `demos/webgpuphys` with Vite.
- Wrap compute into ComputeManager tasks:
  - Visual demos use shared GPU hub for zero-copy rendering buffers.
  - Headless demos use isolated GPU workers and commit CPU deltas only.
- Replace any custom networking with PeerCompute relay if multiplayer exists.
- Tests:
  - Node test for module imports.
  - Manual: run visual demo, verify simulation steps and UI toggles.

### Validation Plan (run locally)
- `node --test demos/tests/demo-ports.test.js`
- For each ported demo, run `npm install` and `npm run build` when dependencies are available.
- Manual smoke checks for rendering + multiplayer in at least two tabs.

### Status
- [x] Shared wiring helpers + tests
- [x] CubeChat port + PeerCompute network adapter
- [x] PlanetGen port + ComputeManager integration
- [x] Universes port + ComputeManager integration
- [x] WebGPUPhys port + ComputeManager integration

### Release Follow-ups
- Add room selection + room list settings to multiplayer demos (CubeChat, SneakyWoods, Hyperborea).
- Add DaddyGo global high score sync via PeerCompute state.
- Fix Universes init crash + PlanetGen debug defaults.
- Refresh docs index + README(s) with demo screenshots and run instructions.

## Release Tasks (Demo Cleanup)
- Add global high score sync to DaddyGo with a shared HUD element.
- Add room selection + settings windows for multiplayer demos (CubeChat, SneakyWoods, Hyperborea):
  - Public/private rooms, room names, optional passwords.
  - Room list window (open from settings) with join/create flows.
  - Move player config (name/color/etc.) into settings.
- Fix Universes init crash (universeGenerationToken TDZ) and verify startup.
- Turn PlanetGen debug view off by default.
- Add relay domain config file and wire relay server to read it.
- Update docs index to include all demos + screenshots; update main README + demo READMEs with PeerCompute integration samples.
- Refresh plan files to reflect the release scope and new room system.



##Additional demo tasks

investigate slowdowns in cyberborea when loading chunks. maybe we can run that concurrently so it doesn't lock up the main thread. 

universes: galaxies don't load when first approaching them from the universe. improve the gravitional lensing effect for black holes. make it really extreme. 

the planetgen demo is pretty broken when it comes to how the ocean and winds work.  clean up how the code is organized so we don't just have a bunch of files sitting at the root. maybe put them in src at least.  we should actually model the ocean currents correctly and generate waves on the water from the wind.  

## New Tasks (2025-12-25)

### PlanetGen (holistic weather/ocean reset)
- Draft and maintain `demos/planetgen/plan/hollistic-weather-plan.md` for a scalable, physics-based, concurrent weather + ocean model using PeerCompute and WebGPU.
- Add a new Weather sim mode: `Holistic (PeerCompute, planned)` in the water-cycle dropdown; wire it to use the 3D volume path until the new solver lands.
- Rebuild wind + ocean dynamics around coupled atmosphere/ocean physics (asymmetric heating, land/ocean contrast, albedo feedback).
- Fix volumetric cloud glitches (avoid periodic rebuild flicker; keep volume textures stable).
- Re-organize planetgen ocean/weather code into `src/` modules (no root-level clutter).
- Add runtime tests for weather/ocean changes (headless where possible).

### Universes (black holes)
- Remove the visible black sphere; render black holes via lensing-only distortion.
- Make lensing extreme (photon ring + shadow) with optional ray-traced path for high/ultra settings.

### WebGPUPhys (PPF demo)
- Add a new demo implementing the cubic barrier contact algorithm from `plan/refs/cubic-barrier.pdf`, based on https://github.com/st-tech/ppf-contact-solver.
- Add runtime test coverage for the new PPF demo.

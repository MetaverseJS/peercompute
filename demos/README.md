# PeerCompute Demos

Each demo under `demos/` is a standalone Vite app that integrates PeerCompute for networking and/or compute offload.

## Run From Repo Root
```bash
npm install
npm run dev
```

## Run A Single Demo
```bash
cd demos/<demo-name>
npm install
npm run dev
```

## Demo List
- `hyperborea` - WebXR-ready multiplayer scene
- `cubechat` - Proximity video chat + multiplayer cubes
- `sneakywoods` - Lightweight multiplayer arena
- `daddygo` - Pose-controlled runner with global high score sync
- `planetgen` - Procedural planet generator + weather compute
- `universes` - Galaxy/universe generator with ComputeManager
- `webgpuphys` - WebGPU physics + MLS-MPM demos

## TODO Demos
- network visualizer to view the p2p network graph and data flows live
- shared 3d editing environment based on https://threejs.org/editor/ where users can make 3d models together 
- motorcycle game similar to road rash and the tron lightcycle game
- shared "VR CHAT" style world that uses your webcam to pose your 3d model. 
- WASM runtime and compute workloads
- REAL distributed compute workload examples. 
- Demos for each network topology
- Apply PPF model to other physics demos
- create a better input model that abstracts/unifies the camera / vr / keyboard / mobile / controller inputs

-fully integrated engine demo that uses the best of webgpuphys, input abstraction, videochat/pose detection, collaborative editing etc. 

- integrated procedural generation library that ties 
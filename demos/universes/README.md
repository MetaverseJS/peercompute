# Universes

## Run
```bash
cd demos/universes
npm install
npm run dev
```

Open `http://localhost:5178/`.

## Compute
Universe + galaxy generation offloads to the PeerCompute `ComputeManager` when available. If workers/WebGPU are unavailable it falls back to main-thread generation.

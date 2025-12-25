# Universes

Universes is a galaxy + universe generator that uses PeerCompute `ComputeManager` to offload heavy generation work when possible.

## Run
```bash
cd demos/universes
npm install
npm run dev
```

Open `https://localhost:5178/`.

## PeerCompute Integration
The demo submits compute tasks to the worker pool and falls back to main-thread generation if unavailable.

```js
const manager = new ComputeManager({ maxWorkers: 1 });
await manager.initialize();

const result = await manager.submitTask({
  module: new URL('./compute/universeTasks.js', import.meta.url).href,
  exportName: 'generateUniverseData',
  data: { seed }
});
```

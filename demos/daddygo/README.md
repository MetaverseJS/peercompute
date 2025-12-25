# Daddy Go!

Daddy Go! is a pose-controlled runner that uses MediaPipe pose tracking to dodge obstacles and collect items. It syncs a global high score using PeerCompute.

## Run
```bash
cd demos/daddygo
npm install
npm run dev
```

Open `https://localhost:5181/`.

## PeerCompute Integration
Each player publishes their best score into a shared namespace; every client computes the global leader locally.

```js
const node = new NodeKernel({
  bootstrapPeers,
  enablePersistence: false,
  gameId: 'daddygo',
  roomId: 'global'
});

await node.initialize();
await node.start();

const state = node.getStateManager();
state.writeScoped('daddygo', `score-${peerId}`, { score, updatedAt: Date.now() });
```

## Notes
- Update `public/relay-config.json` with your relay bootstrap multiaddr.

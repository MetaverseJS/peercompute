# Hyperborea

Hyperborea is a WebXR-ready multiplayer scene with procedural terrain, time/season sync, and PeerCompute-backed networking.

## Run
```bash
cd demos/hyperborea
npm install
npm run dev
```

Open `https://localhost:5175/`.

## Rooms + Settings
Use the Settings menu to change your player name/color and join public or private rooms.

## PeerCompute Integration
Hyperborea uses the NetworkScheduler snapshots for player state and event sync.

```js
const node = new NodeKernel({
  bootstrapPeers,
  enablePersistence: false,
  gameId: 'hyperborea',
  roomId: 'global'
});

await node.initialize();
await node.start();

const network = node.getNetworkManager();
network.configureScheduler({ snapshotHz: 20, keepaliveMs: 1500 });
```

## Notes
- Update `public/relay-config.json` with your relay bootstrap multiaddr.

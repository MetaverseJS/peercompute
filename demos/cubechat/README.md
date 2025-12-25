# CubeChat

CubeChat is a proximity chat playground: each player is a cube in a Tron-inspired grid, with WebRTC video/audio streams piped through PeerCompute for signaling and discovery.

## Run
```bash
cd demos/cubechat
npm install
npm run dev
```

Open `https://localhost:5176/`.

## Multiplayer Rooms
Use the Settings menu to create or join public/private rooms. Private rooms derive their room ID from a password hash (no raw password is shared).

## PeerCompute Integration
CubeChat uses PeerCompute for discovery, state sync, and WebRTC signaling.

```js
const node = new NodeKernel({
  bootstrapPeers,
  enablePersistence: false,
  gameId: 'cubechat',
  roomId: 'global'
});

await node.initialize();
await node.start();

const network = node.getNetworkManager();
network.configureScheduler({ snapshotHz: 20, keepaliveMs: 1500 });

network.queueEvent({ type: 'webrtc-offer', offer }, { reliable: true });
```

## Notes
- Update `public/relay-config.json` with your relay bootstrap multiaddr.
- Screen share metadata and player snapshots are carried via PeerCompute snapshots/events.

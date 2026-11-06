# CubeChat

CubeChat is a proximity chat playground: each player is a cube in a Tron-inspired grid, with WebRTC video/audio streams piped through PeerCompute for signaling and discovery.

## Run
```bash
cd demos/cubechat
npm install
npm run dev
```

Open `https://localhost:5176/`.

## Controls

Click the scene for mouse look; use WASD or Up/Down to move, Q/E or Left/Right
to turn, and Space to jump. Touch the scene to show the movement/look joysticks
and jump button. The actual mouse, touch or keyboard interaction selects the
controls, including on touchscreen laptops; a connected keyboard always works.
Typing in settings or the model console does not move the avatar. Switching
focus or hiding the tab releases held controls.

Input regression checks: `node --test demos/tests/cubechat-input.test.js` from
the repository root (Node24, installed system Chrome).

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

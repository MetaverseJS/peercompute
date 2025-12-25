# SneakyWoods

SneakyWoods is a lightweight multiplayer arena with shared state sync, mobile controls, and simple combat. It uses PeerCompute for discovery and real-time state updates.

## Controls
- WASD / arrow keys: Move
- Mouse or arrow keys: Look
- Space / click: Attack
- Mobile: twin sticks + attack button

## Run
```bash
cd demos/sneakywoods
npm install
npm run dev
```

Open `https://localhost:5180/`.

## Rooms + Settings
Open the Settings menu to change your name/color and join public or private rooms. Private rooms require a password to compute the room ID.

## PeerCompute Integration
SneakyWoods writes player state into a scoped namespace and listens for updates.

```js
const node = new NodeKernel({
  bootstrapPeers,
  enablePersistence: false,
  gameId: 'sneakywoods',
  roomId: 'global'
});

await node.initialize();
await node.start();

const state = node.getStateManager();
state.writeScoped('sneakywoods', `player-${peerId}`, payload);
state.observeNamespace('sneakywoods', (value, key) => {
  // apply remote updates
});
```

## Notes
- Update `public/relay-config.json` with your relay bootstrap multiaddr.

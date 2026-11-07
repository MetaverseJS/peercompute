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

## Inhabited agents

Choose **Agents → Place an agent**, give it a name and select whether peers can
talk to it. **Models** opens reasoning-model configuration. **Enable voice**
downloads the pinned speech packages once (about376 MB); **Talk / Stop** records
a short message, and voice replies play at the cube's position. The room's
conversation network is separate from global model discovery, so standalone
model hosts remain eligible when local-only is off.

The world agent host places saved agents in labeled cubes. Click or tap an agent
cube to open its conversation; with the scene focused, Enter selects the agent
at the center of the view. Mouse look and movement remain available elsewhere.
An agent's reply appears as a temporary caption above its cube. The conversation
uses the shared agent host's text and speech controls and reports unavailable
models or speech capabilities there.

Agent cubes are stationary scene entities owned by their hosting peer, separate
from human players, camera streams and libp2p identities. Closing a conversation
does not remove the agent. Room changes await conversation cleanup before
replacing the network session; private saved identity and conversation records
remain in the host's local storage. Remote visibility and conversation authority
are handled by the shared host, not by trusting a player snapshot.

The CubeChat adapter owns its meshes, name/caption textures, picking listeners
and static collision bodies. Spawning samples the current rendered floor. It
does not implement autonomous movement or a terrain-aware locomotion policy.

Adapter checks: `node --test demos/tests/cubechat-agents.test.js`. These use native
browser input, canvas text, Three.js raycasting and Cannon physics without a GPU
renderer. Full-scene networking, model and speech qualification are separate
shared-host acceptance checks.
The combined checks are available through `npm run test:world-agents` at the
repository root. Player-to-agent conversations are implemented; automatic
agent-to-agent dialogue and learned movement are later work.

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

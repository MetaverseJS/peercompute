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

## Chat and residents

Press **Enter** to open the world chat bar. **Room** sends typed messages to the
other players in this room and shows the text above your cube. Enter sends,
Shift+Enter adds a line, and Escape returns to the world. The transcript keeps
full messages while overhead bubbles show a brief excerpt and expire.
Delivery status reports peer acknowledgments; it is not a read receipt.

Open **Residents** in the hamburger menu, name a resident and place it in the world. Click its cube
or select it as the chat target to use the same composer for a direct
conversation. Direct visitor histories remain separate from public room chat.
Residents can roam, follow their host's player, or stay stationary. These are
bounded scripted motor policies with a replaceable controller; learned movement
and autonomous agent-to-agent dialogue remain later work.

Describe a resident’s physical appearance when placing it. If an image model is
available, its generated image is saved and displayed on the front of the cube;
otherwise the description is retained for Retry appearance. Shared residents
share their bounded face texture with other players. Reload restores the saved
image without generating again.

Enable **Respond to world chat** for public replies to players. It is off by
default, ignores messages from other residents, and uses a separate history from
direct conversations. The option makes replies public even for an unshared body.
Set your own display name under Player to show it above your cube to others.

The native roster replaces the separate bot and agent interfaces. A resident
uses one mesh and collider. Browser body leases prevent two same-origin tabs
from simultaneously restoring the same saved resident; the other tab sees it
through the room network. The saved position is a spawn anchor; moving does not
write the private agent journal every frame. Remote motion interpolates owner
updates and may lag the owner by a directory update interval.

**Models** in the hamburger menu opens the shared library and runtime configuration without another
chat interface or automatic downloads. The host keeps loaded models when this
window closes. Chat voice options prepare the managed speech packages; Talk /
Stop records a short utterance, and spoken resident replies use positional audio.
Global model discovery remains separate from the current world's room network.

**Settings** opens small Player & controls, World & rooms, and Media windows.
Player microphone/video and screen sharing remain separate from model speech.
The automated `peercomputeBot` launch URLs remain available for network tests;
the normal Residents interface does not create hidden bot browser frames.

Reusable components live in `demos/shared`: authenticated `RoomChatService`,
`SpeechBubbleLayer`, `WorldEmbodimentLease`, `WorldResidentMotion`, and the existing
`WorldAgentHost`, plus `WorldAppearance`, `WorldAppearancePresenter` and
`WorldChatResponder`. The Cube scene supplies rendering, placement and input; agents
retain private IndexedDB identity/history and managed model routing. These seams
support the homunculus architecture without coupling its future policies to DOM
controls or CubeChat-specific physics.

Focused tests: `node --test --test-concurrency=1 demos/tests/room-chat.test.js
 demos/tests/cubechat-social.test.js demos/tests/cubechat-native-ui.test.js
 demos/tests/world-resident-motion.test.js demos/tests/cubechat-agents.test.js
 demos/tests/world-agent-host.test.js demos/tests/cubechat-input.test.js`.
Actual browser-peer delivery and visuals are separate preview acceptance gates;
see `plan/log.md` for results and limitations.

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

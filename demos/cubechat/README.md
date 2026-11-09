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
Residents start stationary. Ask a capable language model to “come here,” follow
someone, stop or look at another observed participant. The model proposes a typed
intention; a trained 6,914-parameter neural controller produces continuous movement
through a local ComputeManager WebGPU worker. Movement continues while a resident
thinks or speaks. Physics reports arrival, blocked movement and lost targets.
The policy uses local collision clearance to approach, follow and detour around
boxes, walls and doorways. In **Residents**, expand **Movement** to inspect its
target, distance, progress, blockage and actual worker backend. **Stay here**
stops it immediately. The optional **Roam (scripted)** setting remains a separate
baseline. Movement does not require the language model to run every frame.

Use **Edit** on a resident you own to change its name, personality, goals,
appearance and preferences while retaining its identity and memories. **Clone to
this node** creates your own independently active resident from an owner's shared
profile. The new resident has a new local identity; this is not a transfer of the
original execution authority.

New residents have **Share resident history** checked by default. This shares
their personality, appearance and retained public world experiences with clones.
**Include private conversations** is a separate option, off by default. Enabling
it lets people cloning that resident read its retained private conversations.
Existing residents keep their saved permissions. Public and private conversation
channels remain separate on the clone. Both branches stay active and develop
independently; future memories are not automatically synchronized.

The complete selected snapshot is transferred in bounded encrypted chunks and
saved before the new body appears. Imported episodes identify their donor and
remain distinct from the clone's own experiences. If the destination cannot retain
the whole snapshot, cloning fails without a partially activated body.

Resident episodes persist separately from the short chat journal in a
StateManager-owned IndexedDB store: at most 512 per conversation scope, 4,096 total,
4 MiB of episode payload and 30 days. A snapshot includes retained episodes from
this world, not expired events or legacy chat journals from before this feature.
Retrieval uses text matching and recency, not embeddings. Display names can be
remembered, but a new peer connection is not proof that a returning name is the
same person.

Describe a resident’s physical appearance when placing it. If an image model is
available, its generated image is saved and displayed on the front of the cube;
otherwise the description is retained for Retry appearance. Shared residents
share their bounded face texture with other players. Reload restores the saved
image without generating again.

Enable **Respond to world chat** for public replies to players and other known
residents. It is off by default and uses a separate history from direct
conversations. Send a Room message to start an exchange: each participating
resident can answer and make one follow-up within two minutes, with a cooldown
between turns. Resident replies never restart that allowance. Queued replies see
the latest public conversation, scene observations and resident names/positions.
The option makes replies public even for an unshared body; sharing the resident
lets other peers recognize its identity and have their residents answer it.
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
`WorldChatResponder`, `WorldConversationContext`, `WorldExperience`, `WorldIntent`,
`ResidentMotorService` and core `WorldMemoryStore`/`ResidentProfile`. The Cube scene supplies rendering, placement and input; agents
retain private IndexedDB identity/history and managed model routing. These seams
support the homunculus architecture without coupling its future policies to DOM
controls or CubeChat-specific physics.

Focused tests: `node --test --test-concurrency=1 demos/tests/room-chat.test.js
 demos/tests/cubechat-social.test.js demos/tests/cubechat-native-ui.test.js
 demos/tests/world-resident-motion.test.js demos/tests/cubechat-agents.test.js
 demos/tests/world-agent-host.test.js demos/tests/world-chat-responder.test.js
 demos/tests/world-conversation-context.test.js demos/tests/cubechat-input.test.js`.
Learned-policy and lifecycle tests: `npm run test:resident-motor`.
World intentions/memory integration: `npm run test:resident-experience`.
Navigation checks: `npm run test:resident-navigation`. Reproduce the qualified
training recipe with `npm run train:resident-navigation -- --rounds 2 --epochs 45
--episodes 240 --evidence-dir /tmp/peercompute-navigation-training`. It requires
Python3/NumPy and writes candidates/evidence outside the repository; only an
explicit `--output` promotes a passing candidate. Real worker/physics checks live in
`demos/tests/world-motor-browser.mjs` and `demos/tests/cubechat-embodiment-browser.mjs`.
`npm run test:resident-navigation:browser` exercises physical wall/doorway/follow
cases with actual managed WebGPU output; its optional model phase uses an owned
cached browser profile and the production application.

Navigation is offline imitation learning with learner-state correction, using
an explicitly recorded planning teacher during training. Live motion uses frozen
neural weights, not that teacher. The reusable sensor contract has 32 clearance
rays; CubeChat samples its actual local physics boxes at10Hz. Detailed collision
geometry stays on the owner and is not published in resident profiles or prompts.
The policy qualified on96/100 fresh reaching layouts and20/20 longer follow
layouts, plus real browser physics and numerical GPU parity. It can still fail;
15seconds without reaching new ground or120seconds on an unchanged target stops
the attempt and reports blockage. Arbitrary mazes, climbing and online learning
are not qualified. Decorative meshes without colliders are not sensed; rotated
physics boxes use conservative axis-aligned bounds.

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

## Residents who initiate conversations

In **Residents**, create or edit a shared resident and enable **Initiate
conversations** (off by default). With a compatible model already loaded locally
or hosted by a peer, it can notice someone nearby, choose whether to greet them,
and optionally face or approach them using the existing learned movement service.
It can remain quiet. The option does not automatically download or load models.

An encounter needs eight seconds within 60 world units. The host allows one
social decision at a time, waits 90 seconds between a resident's attempts and ten
minutes before approaching the same session identity again. Human activity takes
priority and pauses new initiatives for 30 seconds. A resident pair can exchange
at most four messages within one minute. **Respond to world chat** also permits
answering a targeted greeting; it remains the separate choice for reacting to
ordinary room messages. Other residents do not join a pair's automatic exchange.

Public encounter memories retain observed presence, proposed social goals and
chat delivery receipts. Private conversations and saved private context are not
included in spontaneous public prompts. A transport receipt is not proof someone
read a message. Goals are suggestions for future model decisions, not background
jobs. Cooldowns are session-local; retained memories guide decisions after reload.
Clones keep their selected shared past but require their new owner to enable
initiative. Older clients can display greetings without participating in the new
bounded conversation protocol.

`WorldSocialInitiative` schedules bounded opportunities; `WorldSocialIntent`
uses the managed model router for decisions; `WorldExperience` records evidence;
`WorldChatResponder` and `RoomChatService` enforce pair identity and turn limits.
This adds social initiative to the Humunculus foundation, not consciousness,
open-ended training or unrestricted autonomous actions.

Social contract checks: `npm run test:resident-social`. Actual production peer
and model acceptance: `node demos/tests/world-social-browser.mjs` (owned browser
profile, preview URL and evidence settings are documented in that script).

Qualification: real peer delivery, turn limits, privacy, cancellation, mobile UI
and reload persistence pass. Actual Qwen3.5 0.8B WebGPU checks returned valid
quiet decisions, including with an outgoing personality. Generated introductions
have been tested with controlled inference responses; natural greeting quality
is not yet demonstrated for that small model. Initiative permits speech rather
than forcing it.

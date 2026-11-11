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
Conversational turns use one journaled reply followed by a separate model request
for an optional physical intention. The latter uses current observations and an
authenticated speaker reference; it never becomes a remembered chat reply.
Self-speech memory is omitted from a request only when its full text already
appears in the conversation retained by the router. Stored episodes stay intact.
The policy uses local collision clearance to approach, follow and detour around
boxes, walls and doorways. In **Residents**, expand **Movement** to inspect its
target, distance, progress, blockage and actual worker backend. **Stay here**
stops it immediately. The optional **Roam (scripted)** setting remains a separate
baseline. Movement does not require the language model to run every frame.

Long GGUF conversations fit the loaded model's context by leaving older complete
turns out of the current request; saved conversations and memories stay intact.
The runtime measures the native chat template using a private one-token probe
whose text is discarded, then reserves room for the reply. This costs additional
model work. Instructions or a current message that cannot fit receive a specific
error rather than being silently cut.

A resident returns to ready after its first two settled request failures and
pauses after the third consecutive failure. A successful reply resets that count.
Tap a paused cube you own and use **Resume** in its chat to accept new messages;
failed messages are never replayed automatically. Other players cannot resume
your resident. Deliberate pauses, uncertain outcomes and unsaved changes retain
their recovery protections.

Ask a resident you own for a physical task in its normal chat, for example “go
far away and then come back.” A separate model decision admits the original
request to the persistent task planner. The model selects up to six milestones
from approach, look-at, stop and move-to. CubeChat supplies nearby and distant
collision-clear ground destinations; the neural motor still chooses movement.
Fixed destinations and the starting place are saved. An unqualified return or
“back here” means that starting place; “back to me” follows your current location.
The chat shows accepted/current-step/blocked/completed status and task controls.
The **Objective** section in **Residents** also supports explicit assignment and
shows the complete plan and physical results. Only the owner can assign or
control persistent tasks. A new task cannot silently replace unfinished work;
cancel the old task first. Conversational promises do not establish progress:
only matching physical receipts advance milestones.

**Pause task**, **Resume task** and **Cancel task** are available in owner chat;
the detailed Objective panel retains the same controls.
Human conversation takes priority over planning; a new movement command pauses
the superseded objective. Progress is saved privately before work starts. Reload
restores it paused. Resume keeps completed milestones, observes the world again
and requests a fresh action for unfinished work. It never replays an interrupted
request. A saved “return to me” milestone resolves to the current owner after
reload. Active objectives are excluded from public resident data
and clones. In network-assisted mode, the selected inference peer receives the
objective and observations for planning; local-only keeps inference on this
device. Each objective has eight planning decisions, three consecutive failed
attempts and a ten-minute lifetime; Resume does not renew its step/time allowance.
Waiting for an available model does not spend a decision. Small models may choose
incorrect steps or pause; completion is their assessment, not a guarantee that
an arbitrary natural-language task was satisfied. Actual peer-hosted Nemotron 3
Nano 4B tests completed two- and three-step routes in order, including repeated
destinations and pause/reload/resume after the first arrival. Planning, action
and assessment requests have separate instructions; later requests address the
current subtask while retaining the original goal as context. Model explanations
can still be generic or copy schema placeholders; physical receipts establish
the verified progress. Earlier Qwen3.5 2B tests repeated a destination, and that
model/export/runtime combination remains unqualified for multi-step objectives.

Spatial chat has also completed actual peer-model journeys around a physical
wall and back to a saved origin, and to an owner who moved after planning. The
chat's task row reports verified physical progress separately from model speech.
Small models can still misinterpret destinations or emit invalid plans; one local
Qwen0.8 run repeatedly rejected valid nearby points. Peer outages can also pause
work. Reload retained the first completed spatial leg without replay and accepted
Resume; its final return and live cancellation qualification remain open after
the test GPU filled. The storage/controller and neural-physics regressions cover
those paths independently.

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
`ResidentMotorService`, `WorldGoalController`, `WorldGoalDecision`,
`ResidentGoalControls` and core `WorldMemoryStore`/`WorldGoalStore`/`ResidentProfile`. The Cube scene supplies rendering, placement and input; agents
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
Persistent objectives: `npm run test:resident-objectives`; the separate
`test:resident-objectives:browser` script requires an explicitly owned browser
profile, HTTPS production build and a compatible peer-hosted model CID. It uses
real encrypted peer inference and local neural movement with physics receipts.
Its default round-trip case requires both ordered arrivals and completion;
`RESIDENT_GOAL_CASE=lifecycle` separately checks owner controls and reload.
A lifecycle pass does not establish multi-step planning quality.
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

## Generated objects

Ask a resident you own in its private chat to create something, for example
“Generate a small red chair and place it beside you.” Its language model makes a
separate structured action proposal after replying. Only an explicit request in
the owner's conversation can start generation; visitors, room chat and autonomous
resident conversations cannot spend your host's generation capacity this way.
A conversational promise alone does not create an object. Chat reports whether
the object was actually saved and placed, or why the operation failed.

Use **Models** to load the required models, or allow network-assisted inference
and use compatible peers already hosting them:

- A text model handles the conversation and action proposal.
- A text-to-image model creates a reference image from the object's description.
- **TripoSR (Q8)** turns that image into a colored 3D mesh in a managed WebGPU
  worker. Its pipeline uses image input; it is not directly text conditioned.

The router selects providers separately for each step, preferring a capable local
model. Local-only residents require every needed model on this device. This flow
does not automatically download missing models. With network-assisted inference,
the selected providers receive the relevant prompt or reference image over
encrypted peer streams. TripoSR requires hardware WebGPU but does not require
`shader-f16`; the other selected models retain their own requirements.

The reusable `WorldGeneratedObjects.generate({ agentId, action, image, ... })`
API also accepts bounded RGBA source pixels, skipping text-to-image generation.
The current CubeChat composer uses generated reference images; it does not yet
provide a source-image upload control for this action. A single isolated subject
on a plain background is the intended reference input. The current TripoSR
package includes a small U2NetP model that removes the background in its managed
worker before reconstruction. Usable transparent cutouts bypass this step.
Older stored TripoSR packages require a cutout; load the current catalog package
for generated opaque images. Segmentation, shape and color quality depend on the
reference and models; reconstruction is not exact.

Successful output is a validated, self-contained GLB placed on the ground beside
the resident. Geometry and placement are retained together under an artifact CID
in local storage. Reloading the same browser origin restores them without running
inference again. Connected room peers discover placement descriptors, fetch and
verify the mesh through PeerCompute's artifact network, and display it in their
scene. Room display is shared even though the initiating conversation is private;
peers can retrieve the generated artifact. Availability depends on hosts serving
the saved bytes, rather than permanent external IPFS pinning.

This first slice creates cosmetic, static objects: no collision bodies, rigging,
animation, avatar replacement or terrain editing. It admits one generation at a
time per host, up to 32 owned objects per room, and meshes no larger than 16 MiB,
100,000 vertices or 150,000 triangles. The renderer rejects external resources and
unsupported GLB features before loading. General Hugging Face 3D pipelines and
Hunyuan3D-2.1 remain follow-up work; only the pinned TripoSR pipeline is admitted.

`WorldObjectAction`, `WorldGeneratedObjects`, `WorldGeneratedObjectNetwork` and
`WorldGeneratedObjectPresenter` separate agent authority, model routing, artifact
retention and room discovery from `CubeGeneratedObjectLayer`. Core
`GeneratedMeshArtifact` helpers provide the reusable encoding, validation and
storage boundary. Design and acceptance details live in
[the generated-object plan](../../plan/demos/inference/generated-world-objects.md).

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


## Personal guide

CubeChat supplies its controls and application facts separately from the editable
personality, so a new self-description does not erase the guide’s world knowledge.

A new installation gets one **CubeChat Guide** in each room, next to its player.
It uses a compatible loaded local model or an available peer model; creating the
guide does not download model weights. With no provider, Residents shows that it
is waiting for a model. Tap its cube for private chat, or find it in the hamburger
menu → Residents. Existing task controls let you give it physical objectives.

The guide has a standing welcome goal aimed at its own player. Its introduction
is public, but other players' guides will not automatically greet you as well.
A committed encounter record prevents another welcome on reload, even when the
network peer ID changes. Ordinary residents can optionally have a standing goal
for other nearby players; their encounter identity lasts for that peer session.

In private chat it asks short questions about its name, personality, appearance
and purpose. **Let resident update its personality, goals and appearance** permits
a separate model decision to save changes to those fields. The permission is on
for the guide and off for ordinary new residents. Only its owner's conversation
can trigger these changes; visitors cannot edit another player's guide. Model
output cannot change sharing, local-only routing, permissions or executable code.
You can review, edit or turn this off in Edit resident. Profile changes use the
same revision-checked IndexedDB store as manual edits.

Chat reports which fields were actually saved. Invalid model proposals leave the
profile unchanged and show an error; small models can also omit a preference or
put it in the wrong profile field. Review the saved profile in Residents and
correct it there when needed. A successful model response is not proof that
every requested preference was applied.

An appearance description stays saved without an image provider. Generate the
face separately when an image model is available. Automatic welcomes and profile
changes do not turn on the microphone or load speech/image models. Paused, edited
or removed guides stay that way after reload; removed bodies are not recreated.
Clones do not inherit default-guide registration, standing-goal authorization or
self-edit permission. Public/history clone consent remains separate.

Standing encounters are bounded to three attempts per target, 90 seconds between
attempts and six claims per hour per resident. Quiet decisions complete the
encounter. Interrupted or uncertain sends are retained and never replayed
automatically; a transport receipt does not prove a person read the message.
Manual conversation and owner tasks take precedence over automatic introductions.

Reusable components are `AgentRecordStore.ensureDefault`,
`WorldStandingGoalStore`, `WorldStandingGoal` and `WorldSelfProfile`. CubeChat
only supplies its guide preset, scene observations and native controls. This
extends the Humunculus identity/memory/skill architecture; it does not train
weights or implement unrestricted autonomous social errands.


### Generated resident avatars

In a private conversation with your own resident, try “Become a robot”, “Change
your avatar into a car”, or “Choose a cool avatar for yourself and generate it.”
The resident chooses a design, then uses an available image-generation model and
an image-to-3D model such as TripoSR. Local-only residents require local models;
other residents can use compatible peer-hosted models. This does not download
missing models automatically.

The generated shape replaces the visual on the same resident body. Identity,
memories, chat, voice and learned movement continue. Its verified GLB is retained
on the device and shared by CID with room peers when the resident is shared.
“Return to your original cube” resets the appearance. A failed or cancelled
generation leaves the previous appearance in place. A failed IndexedDB commit
keeps the staged mesh for the normal Resume/save recovery path.

Cloning an opted-in resident copies its avatar into an independently retained
artifact; source resets do not remove the clone's copy. Older clone clients
receive the original personality/face profile and retain their cube fallback.
Avatars are coarse static geometry within the existing cube collision bounds;
a car shape does not add driving physics, and limbs are not animated.

Shared implementation: `WorldMeshGeneration`, `WorldResidentAvatars`,
`WorldResidentAvatarPresenter`, `ResidentAvatar`, and `GeneratedMeshView`. World
adapters own rendering; the agent record owns the durable appearance reference.

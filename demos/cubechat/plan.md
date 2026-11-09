using vite with vanilla js and js lib p2p create a minimal peer to peer miltiplayer library that runs in it's own service worker. 

Main Design Principles:

* make things modular with ES6 modules
* large components should be capable of running in their own thread as a service worker

Demo:

create a tron themed overworld consisting of a dark infinite grid of blue lines. players who connect to the p2p network should be visible on the grid and be rendered as a randomly colored cube. each player should be able to move around the grid. players should not spawn in the same place.

## Desktop and touch input follow-up — November 6 2026

- Prefer actual mouse/touch/keyboard activation over the coarse-pointer device
  heuristic. Keep the heuristic only when the event has no input-source evidence.
- Keyboard movement, turning and jumping remain independent of touch controls.
  Use one reusable touch HUD, release joystick/jump captures on mode changes,
  ignore editable/composing/modified key input and release keys on focus loss.
- Validate native mouse start on fine/coarse desktop, keyboard start, phone touch,
  switching modalities, typing in UI and blur recovery. Keep screenshots and
  SecretWorkshop connection receipts outside Git; add controller browser tests.

## Inhabited conversational agents — November 6 2026

- Replace the generic floating model-panel launcher with a scene-owned shared
  world agent host. Saved agents inhabit selectable, labeled cubes; direct text
  and voice conversations use the same persistent identity and model routing.
- Keep agent entities separate from human peer/media maps. CubeAgentLayer owns
  static collision bodies, bounded Three.js objects, raycast selection, local
  transient captions and spatial-audio poses. The shared host owns authenticated
  presence/conversation, private persistence, model resources and speech.
- Do not attach the game ComputeManager to the agent runtime: the shared host
  owns its managed worker allocation. Closing a dialog does not stop the host.
- Serialize room switches and await host cancellation/disposal before replacing
  the NodeKernel. Dispose the old layer, then restore the new room's bindings;
  retain failed-cleanup ownership for retry. Shutdown follows the same ordering.
- Test positions/descriptor limits, distinct agent/human ownership, real Cannon
  collision, native mouse/touch/Enter picking, canvas label text, caption expiry,
  texture/listener/body cleanup, floor placement and audio pose with a GPU-disabled
  browser. Initial adapter run passed7/8; the only failure was exact floating-point
  comparison of raycast height6.999999999999998 against7, corrected to tolerance.
- Full-scene multi-peer text/voice and persistent restart gates remain separate
  until shared host/protocol/speech modules complete. This slice adds stationary
  embodiment, not autonomous wandering, learned control or peer migration.
- The combined initial corrected adapter/input suite passed19/19 in4.60s;
  adapter bounds then aligned with the shared paused/offline240-character-name
  contract. P2PNetwork.stop now awaits its asynchronous NodeKernel shutdown so
  the caller can observe completion or retry a failed cleanup.
- Final scoped check: `node --test demos/tests/cubechat-agents.test.js
  demos/tests/cubechat-input.test.js` passed22/22 in6.15s on Node24. Additional
  tests prove paused/offline name compatibility and that network stop waits for
  acknowledgement, preserves ownership on failure and succeeds on retry.
  Syntax/diff checks passed; owned browsers, Vite and temporary caches closed.
  Evidence: `/home/cos/.cache/peercompute-world-agents/cube-focused-tests.log`.
- Final shared acceptance:70/70 combined world-agent checks and79/79 existing
  console/library/native-storage regressions pass. The complete production scene
  passes native picking, typing isolation, same-agent reload, desktop/mobile
  visuals and independent room/global-model SecretWorkshop connections at
  trusted HTTPS5176. Actual shared-host/CubeAgentLayer/browser fixture separately
  passes real GPU peer replies, visitor isolation, cancellation/disconnect and
  three-resident reasoning/ASR/TTS spatial playback. The fixture used encrypted
  relay requests after direct native upgrade timeouts; tiny Gemma quality was
  inconsistent. Neither movement nor autonomous agent dialogue is claimed.


## Model panel scrolling — November 7 2026

- The shared model panel now offers stored-package multi-selection at startup,
  explicit batch loading, paste/drop image attachments and confirmed overview
  navigation. Saved packages do not automatically consume model memory on opening.
- Phone layouts scroll the embedded model panel when metadata exceeds its fixed
  height. Keep the library bulk controls outside the scrolling package list.
- Camera wheel zoom belongs to the actual world canvas, selected after TronScene
  initialization or passed to PlayerController explicitly. Native dialogs,
  editable fields, UI/image canvases and handled/modified events retain browser
  scrolling. Pointer-lock ownership must not transfer camera input to another UI.
- Native controller tests14/14PASS, including actual wheel and pointer lock;
  actual promoted Cube preview must prove modal wheel reaches target/Attach/Talk/
  Send without camera movement, then prove scene-canvas wheel zoom still works.
  Preserve failed prior wheel/hit-test evidence; no GPU/model download is needed.

- Final actual5176PASS: native dialog wheels reach every composer control on
  desktop/phone with hit-tests true and camera zoom unchanged at1.0; after closing
  UI, world-canvas wheel changes zoom to1.1. Both room and model networks have
  authenticated SecretWorkshop Noise connections; no page/console/HTTP/model/
  cleanup errors. Cube-only build13.05s and internal promotion02:01:55Z preserve
  existing assets; owned browser closed.

## Native social interface — November 7 2026

- One scene composer targets Room or a selected resident. Enter opens/sends,
  Shift+Enter adds a line, and Escape releases chat focus. Human room text travels
  over authenticated room-scoped PeerCompute streams and appears in the room
  transcript and above the authenticated sender's cube. Resident conversations
  retain isolated visitor histories; their direct prompts are not room broadcasts.
- Residents replaces the separate normal bot/agent launchers. One persistent
  identity has one owned body, a movement policy and a conversation endpoint.
  Default grounded roaming, follow and stationary policies have no periodic jump.
  Legacy automated peer launch URLs remain available for network testing.
- Reusable seams: RoomChatService owns delivery/authentication/bounds;
  SpeechBubbleLayer owns Three.js text presentation; WorldEmbodimentLease owns
  cross-tab body lifetime; WorldResidentMotion owns bounded motor decisions;
  WorldAgentHost owns persistence, routing, speech and visitor conversations.
  CubeWorldUi and CubeSettingsUi contain CubeChat presentation only. This is
  infrastructure toward homunculus, not a claim of learned movement or training.
- Split Player, World & Rooms, Media and Residents into focused native dialogs.
  Models reuses storage/runtime management with its secondary chat hidden and
  automatic model loading disabled. Existing loaded models stay with the host.
- Verify native keyboard/focus/touch, text safety and bubble lifecycle, encrypted
  two-peer delivery and scope/replay rejection, one body per ID, no hop impulses,
  same-origin ownership/release, private history and cancellation, then actual
  desktop/phone previews with SecretWorkshop and two-browser text exchange.
  Record failures and final results in plan/log.md; keep browser artifacts outside
  Git and do not touch user profiles or download weights for UI acceptance.
- Qualification complete:203 relevant cases pass; three affected app builds and
  exact internal desktop/phone checks pass. Actual two-browser text exchange,
  room change and receiver reload retain authenticated attribution and one
  delivery to the current receiver. A departed identity may briefly yield an
  honest partial-delivery status. Final phone captures verify readable overhead
  annotations even when a foreground body overlaps them. Resident placement and
  motion preserve one mesh/collider locally and one remote body; remote pose
  retains the five-second directory cadence. No new GPU/voice/model-quality
  qualification or public Pages deployment is claimed by this UI pass.

## Resident appearance, public replies and model windows — November 7 2026

- Keep Residents and Models in the hamburger menu only. Model management owns
  one native dialog across Stored/Browse, details, Config, setup and loading;
  Done/Escape await cleanup and restore focus to the world menu. Failed cleanup
  retains ownership for retry; closing never disposes borrowed world models.
- A private appearance description belongs to the persistent world binding.
  Optional text-to-image generation uses existing local-first agent routing and
  honors local-only. Save the resident even with no provider; expose a retry.
  Retain original generated pixels in the agent store, bind a digest-verified
  thumbnail and place it only on the cube front. Shared peers fetch bounded RGBA
  through the authenticated world service; no private prompt or attachment ID is
  advertised. Presenter reads are bounded, cancel on identity/face changes and
  cannot apply after body teardown. Do not regenerate on reload.
- Respond to world chat is an explicit per-resident opt-in. Human room messages
  alone trigger replies; resident-origin messages do not start reply loops.
  Use one active response, latest-message coalescing, per-resident cooldown and
  bounded public context. Public replies use their own persisted conversation
  channel and authenticated owner+agent attribution. Turning the option off
  cancels owned work and waits for cleanup; absent models do not pause residents.
  Opting in makes these replies public even if the body itself is not shared.
- Human snapshots carry their bounded Player name (Anonymous when blank). Human
  and resident labels fit their text with small padding; unchanged snapshots
  do not allocate replacement textures. Dispose changed labels and face assets.
- Qualification includes native library/host ownership, real encrypted face and
  room transport, persisted appearance/no-provider/cancel/reload, public/private
  history isolation, front-only rendering and desktop/mobile previews. Simulated
  inference fixtures qualify wiring and persistence, not new model quality.
- User authorizes a fresh docs/ build and origin push after all current changes
  pass. Pages source is feature/ipfs-artifacts-webgpu:/docs; preserve the current
  branch and verify the overview/IPFS link plus the complete demo route matrix.


## November 9 — proposed next homunculus milestone: meet and follow

Proposal only, not an implementation commitment or a completed training result.
The smallest visible improvement is richer world awareness and relevant memory;
the recommended next coherent playable slice is “come here, then remember that
we met.” Reuse identities, managed local/peer inference, chat/voice, ownership and
body presentation. A language model chooses a bounded intention; a small local
learned motor executes approach/stop/follow independently of language latency.

1. Give each resident bounded observations: nearby identified players/residents,
   relative positions/directions, recent public speech, its current intention and
   confirmed action outcomes. Scope observations to its senses rather than making
   it omniscient. Start with scene geometry and rays; first-person vision is later.
2. Add reusable observe/intend/act/outcome contracts. Initial intentions: look at,
   approach, follow a named entity, stop and speak. The model selects among them
   using current goals/context; these are capabilities, not scripted dialogue or
   a fixed story. Record the executed outcome before claiming an action succeeded.
3. Add episodic memory with who/where/when/action/outcome and retrieval of relevant
   events. Preserve public/private channel boundaries and provenance; keep derived
   summaries separate from evidence. Existing256-event journal limits require a
   deliberate retention/compaction design, not per-frame appends or silent loss.
   Human recognition across reconnects requires stable authenticated profile
   identity; display names or an assumed permanent transport peer ID are inadequate.
4. Implement the thin M0 fixed-step sensor/action/trajectory interface, then train
   a compact M1 approach/stop/follow policy from recorded demonstrations and test
   unseen starts/targets before promotion. Use continuous model-produced controls
   through ComputeManager on the body owner. Existing scripted motion is a labeled
   baseline/teacher only. Shared weights retain per-resident state. Language work
   may route to peers; frame-to-frame control stays local.

Current constraints: WorldResidentMotion is explicitly scripted; CubeAgentLayer
uses kinematic placement, zeros velocity, and freezes movement while thinking.
Replacing only motionFactory does not fulfill the PDF's physical neural-control
contract. Decouple movement from conversation status, keep pause/stop authority,
and measure the policy in the actual simulator. A WebGPU ONNX deployment path
exists in the upstream runtime, but model operators, latency and actual backend
execution still need qualification. Do not promise a pretrained CubeChat policy.

Acceptance scene: two residents and two players; a player says “come here,” the
resident approaches and stops, a follow request updates its target while it can
continue chatting, and a reload restores an evidenced memory of the encounter.
A private exchange stays private; no provider does not freeze or teleport a body.
Evaluate memory retrieval and actual movement separately from prose fluency.
Afterward: bounded self-initiated greetings, mutual introductions and remembered
social goals. Fly connectome, full3D body generation, policy mobility and open-ended
self-training remain later experiments. No GitHub Pages build/deploy or push.

#### November 9 implementation acceptance

- Train and retain a compact MLP for continuous approach/follow/braking actions; compare held-out rollouts with zero/random weights. Run it locally through a managed worker and verify actual WebGPU/CPU backend reporting, cancellation and scene disposal.
- Supply bounded participant identities/poses/velocities and obstacles to reusable perception/action contracts. LLM chooses a validated observed target; physics verifies outcomes independently. Keep motion running while language is busy; legacy roam is an explicitly scripted baseline.
- Persist scoped event memories separately from the short journal; retrieve relevant episodes after reload without exposing private conversations to world chat. Participant display names are remembered labels, not proof of stable reconnect identity.
- Owners edit personality, goals, appearance, sharing and movement. Owners can opt into sharing a whitelisted clone profile. A clone receives a new local identity/body and fresh memories, never the original authority/private history.
- Verify headless UI and two real isolated peer browsers, then update only the internal CubeChat preview. GitHub Pages remains on hold.

#### November 9 validation and continuity follow-up

The learned motor, bounded perception/intent bridge, scoped episodes, native owner
editor and encrypted peer cloning are implemented. Actual production WebGPU and
Cannon acceptance pass; the two-browser SecretWorkshop clone check verifies saved
identity, shared-memory provenance and private-history exclusion. New residents
have one default-checked **Share resident history** option; existing entitlements
remain unchanged. Current transfer is at most eight public episodes and creates
an independent clone. It is not full-history replication or same-identity migration.

A true host move needs staged durable transfer, a recipient-bound activation grant,
source retirement and idempotent recovery after interruption. Existing local
execution authority cannot provide that guarantee. User clarification is pending
on move-versus-active-clone behavior and whether private conversations may be part
of shared history; no migration or private-history transfer has been enabled.

Initial real Qwen2B action selection returned no intention despite successful peer
inference. The response contract now uses valid action examples and distinguishes
proposed movement from completed outcomes. Controller correctness and actual
language-model adherence remain separate acceptance gates.

#### November 9 final direction — branching residents

The user resolved continuity as **cloning**: both residents remain active with a
shared past, then develop independently. Creation now shows **Share resident
history** (on) and **Include private conversations** (off). The creator controls
both, and enabling private sharing explicitly discloses who can read it.

This supersedes the eight-episode transfer sample and the pending move/private
questions above. Transfer all retained selected world episodes over a credited,
digest-checked profile stream; preserve audience/conversation IDs and import
atomically before placing a body. Capacity failure must leave no partial clone.
The existing retention bounds still apply; legacy journals predating the episode
store are not converted into purported verified world experiences.

Corrected action prompting is qualified with actual local Qwen3.5 0.8B WebGPU
inference for both new and legacy identities. Both approached the correct player
and stopped at approximately10.6units; no CPU inference or scripted movement
substitute was used. Full-history private-sharing integration acceptance passed: 71 core tests, 27 host tests, 21 native UI tests and an actual two-browser encrypted transfer with public-only and explicitly opted-in private histories. The internal HTTPS preview is updated; Pages remains unchanged.

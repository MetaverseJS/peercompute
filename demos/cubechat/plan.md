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

### November 9 — bounded social initiative

Implementing the next explicit meet-and-follow follow-up: opt-in nearby greetings,
mutual introductions and remembered social goals. Existing and cloned residents
start with initiation off. Public world chat remains separately opt-in. Reuse
managed inference and the learned motor; avoid speculative AgentRuntime journal
runs so cancellation cannot pause a healthy resident. Permit silence and validate
any target/action against current observations. No automatic model loading.

Bound each pair to four messages/60seconds and retain root identity/deadline/turn
across authenticated messages; preserve v1 display compatibility. Host limits:
8second proximity dwell under60units,90second resident and10minute target cooldown,
30second human-priority/no-model backoff and one speculative model request at a
time. Public observed/decided/delivery/action memories must never imply fabricated
human messages or completed actions. Exclude private histories and saved context
from public prompts. Validate through focused scheduler/protocol/privacy/lifecycle
checks, actual peer browsers and actual small local model decisions. Internal
preview only; GitHub Pages and push remain on hold.

#### Social implementation and qualification outcome

Implemented locally: native consent, reusable encounter/decision components,
public episode/goal/receipt retention, encrypted pair protocol with old-client
fallback, simultaneous-greeting arbitration and immediate human/owner/target-loss
cancellation. Final81social tests,32host tests,32native UI/contracts and62nearby
regressions pass (overlap retained; not summed). Two actual isolated peer browsers
pass all six network/privacy/lifecycle/visual/reload groups. Quiet and sociable
actual Qwen0.8B probes use26/26GPU layers with no downloads; both choose silence.
A balanced prompt revision still chooses silence. Thus generated conversational
quality remains a model-specific qualification task, not a claimed learning result.
The deterministic fixture proves transport/orchestration, not LLM creativity.
Internal CubeChat5176 is updated; public Pages/deploy/push remain on hold.

### November 9 — next-slice recommendation (not implementation authorization)

Recommend learned obstacle navigation and recovery: a resident can obey “come
here” or “follow me” around a wall and through a doorway. The present motor has
seven target/velocity/stopping inputs, no geometry sensors, and halts after
prolonged lack of progress. Finish this missing M1 capability before expanding
durable autonomous goals. Social goals currently remain memory proposals, not
background jobs; actual Qwen0.8B spontaneous greeting quality remains unqualified.

Add bounded egocentric geometry/contact observations and train a compact policy
against the actual body dynamics, with explicit recurrent state if required.
Keep execution local through ComputeManager and independent of language latency.
Version the observation/checkpoint format and reuse it outside CubeChat. Expose
the active target, progress, blocked state and actual backend in a small resident
inspector. Keep owner stop/pause authoritative and report unreachable targets.
Initial scope is planar boxes, walls and doorways. Existing nearby obstacle
center/radius summaries need physics-derived clearance sensing; the current
training simulator has no collision contacts. Progress detection must permit
necessary detours that temporarily increase target distance, and proximity
through an intervening wall must not count as arrival.

Acceptance should use actual explicit-command inference plus real physics, with
100 held-out layouts and separately reported reach success, collisions, stuck
time and inference latency; the design's proposed reaching target is at least
90%. Compare against the current policy and declared reference controllers;
preserve failed episodes and verify browser/backend parity and lifecycle cleanup.
This is a recommendation only: no training, implementation or deployment starts
from the roadmap question. Persistent model-selected goals are the follow-on.

#### Implementation authorized November 9

The subsequent "do it" authorizes this slice. Separate local physical geometry
from public world observations; use the same bounded clearance contract in
training and live control. Train genuine policy weights with an explicitly
identified offline teacher, retaining the prior obstacle-free checkpoint as a
baseline. Navigation actions execute through the existing managed WebGPU worker.
Actual Cannon contacts, detours, false arrival across walls, stopping, stale
results and model/worker loss are acceptance concerns. Internal preview only.

#### Learned navigation implementation and qualification

The shared v2 motor contract has40 inputs (32 target-relative clearance rays,
target visibility and relative motion) and a40→64→64→2 network with6914 learned
parameters. Local ComputeManager WebGPU workers produce planar acceleration;
CubeChat's adapter samples actual physics boxes at10Hz. The owner-only Movement
inspector reports measured distance, travel, path obstruction, worker proof and
blockage. Private collision bounds do not enter public directories or LLM context.

Offline training uses NumPy behavioral cloning and learner-state corrections
from a declared visibility-graph teacher in the actual Cannon body/contact model.
The teacher is excluded from browser runtime. Frozen v4 checkpoint98e9eb16…bf1aa5
passes96/100 fresh root-held-out layouts and20/20 fresh60second follow layouts.
Earlier v1/v2/v3 candidates failed qualification and remain in external evidence.
Separate real browser WebGPU cases pass wall-end and doorway detours,75second
follow, false-arrival prevention and enclosed-target blockage. Numerical parity,
pause, stale output, target loss and cleanup pass. Owner desktop/mobile visuals
are inspected. A post-training guard fixes coincident targets inside solids;
weights and the archived training sources remain unchanged.

The first actual Qwen “come closer” request selected the exact observed participant
and completed its detour. Its next request exposed repeated per-turn instruction
and verbose context growth. Transient task instructions, exact legacy-decorator
projection and compact prompt-only observations now preserve the complete saved
history and validation evidence. The same-resident production command sequence
now passes: actual Qwen selects approach/follow on the exact participant, the
managed motor detours55.98units then follows12.39units, persists verified physical
receipts, and native Stay here stops velocity immediately. Both calls use the
cached model with no download; desktop/mobile visuals and console are clean.
Only the internal5176 preview is promoted. Generic tokenizer-aware
GGUF history trimming remains separate; small contexts still have finite limits.

Limits: qualified on planar individual boxes/walls/doorways, not arbitrary mazes,
climbing or online learning. Visual-only geometry has no physics obstacle;
rotated boxes use conservative bounds. Stop after15seconds without new ground or
120seconds on an unchanged target. Durable autonomous goals remain the follow-on.

#### Follow-up: conversation budget and Resume in chat

The user confirms successful following but still sees context-budget errors and
frequent pauses. Finish native measured GGUF history fitting and avoid pausing a
healthy resident for a rejected over-budget request. Add Resume beside the native
chat composer when the selected resident is paused. Subsequent user clarification
makes Resume owner-only: visitors cannot resume another host's resident. Settled
errors automatically return to ready until three consecutive failed requests;
success resets the streak. Explicit owner Resume resets it without replaying a
failed prompt. Deliberate pause and unknown/unsaved outcomes remain protected. Preserve
history and movement authority; no automatic prompt replay. Actual multi-turn
model, peer recovery, desktop/mobile and internal-preview acceptance are required.

Context/recovery qualification passes: native measured fitting preserves complete
stored turns and memories; seven actual Qwen turns retain the latest follow
request. A4093token current prompt is rejected and the next valid request works.
First-two-ready/third-paused, owner-only native Resume, success reset, unknown and
deliberate pauses pass with two actual peers. The shipped native backend samples
one token even for max_tokens:0, so measurement now explicitly budgets one token
and discards its text. Model quality remains distinct from context fit. Internal
preview publication follows; public Pages remains on hold.

### November 9 — persistent owner-assigned objectives

Implement the next roadmap slice: an Objective section in Residents lets an
owner request a bounded goal such as “visit Nova, then come back to me.” A language
model selects one supported intention at a time from current observations and
matched physical outcomes. The trained local motor executes it. There is no fixed
visit/return script or new continuous language-model loop.

WorldGoalStore is private StateManager-owned IndexedDB with atomic revision
checks, acknowledged decision/action checkpoints and bounded receipts. Restoring
a page preserves progress but requires owner Resume; interrupted steps never
replay. Only the owner can start/pause/resume/cancel. Clones keep their separately
authorized history/profile and never inherit active jobs. Human chat preempts
planning; newer physical commands supersede a goal. Fixed limits are8decisions,
3consecutive errors and10minutes; unavailable models wait with30second backoff.
Initial finite actions are approach/look-at/stop. Direct-chat follow is unchanged.

Acceptance: two actual ordered model-selected arrivals using managed neural
movement, persisted progress/reload recovery, target loss/blockage, stale or
forged/duplicate receipts, storage failure before effects, human preemption and
owner-only controls. Preserve focused state-machine fixtures separately from
actual model/physics proof. Inspect mobile drafts/focus during live status refresh.
No public Pages build/deploy or push.


Persistent-objective implementation is experimental. Private CAS checkpoints,
finite model-selected actions, physical receipts and owner controls are in place.
Prompt-local participant/receipt references resolve back to exact durable IDs;
this removes repeated network-identity token overhead without choosing a plan.
Missing encrypted inference links now use existing bounded manager relay recovery.
Live Qwen2B selected real approaches, but repeated the first destination in the
ordered visit/return task. Eight actual requests fit the context and the step cap
stopped the loop. Multi-step quality remains an open acceptance gate; do not mark
this broader objective complete or encode the test itinerary as a fixed behavior.
Next: evaluate reliable model-produced plans on varied multi-step tasks, keeping
this failed fixture and distinguishing model/export/runtime quality from delivery.

November10 continuation: the full demo release was published first as requested.
The new candidate uses a reusable WorldGoalPlan contract and immutable model-authored
milestones, with progress credited atomically only by the exact acknowledged
action's successful receipt. Requester-role targets resolve afresh after owner
Resume; completed receipts retain their original identity. The controller asks
the model separately for a plan, an action for the current milestone and a final
assessment. Existing budgets, private state, owner authority and no-replay
restore stay intact. The owner panel shows ordered milestones and receipt-backed
progress. This advances Homunculus composed skills; it does not add learned routing
or self-directed weight training.

Current candidate tests pass146/146. First actual Nano trial rejected three
invalid targeted-stop plans without movement; a captured-input capability
clarification yielded a valid-looking two-step plan. Subsequent trials showed
that repeating the full original goal as the immediate instruction distracted
the small model from its current milestone. Phase-specific schemas plus an
explicit current-subtask request fixed the tested cases while retaining the raw
original goal as data and all validation/budget rules.

Actual Nano qualification now passes two ordered arrivals, a changed-name and
changed-order three-step task, and pause/reload/resume after one completed
milestone. Every credited step binds a model decision, acknowledged action,
real motor event and private durable receipt. Owner controls, visitor denial,
unchanged budgets and clean shutdown pass. The first harness mistakenly required
pending work to survive orderly shutdown; its narrow correction accepts the
recorded shutdown pause followed by restore, without new decisions or progress.
Failed attempts remain in log.md. Generic or placeholder model explanations
remain a quality limitation. Public Pages stays at the earlier qualified release;
this slice is promoted only to the internal CubeChat preview after exact checks.

### November 9 — repeated private replies

The Conan/cube screenshots reproduce repeated replies to distinct current
questions. Native owner/visitor traces preserve the exact new prompt through
journal, routing, raw inference and display. Actual Qwen2B template/token counts
are correct; isolating history versus episodic memories shows history-sensitive
generation. Prompt-contract and memory-only variants failed semantic acceptance
and are not shipped. Preserve custom identity, goals and all stored histories.

Correct the confirmed Transformers.js4.3.2 Qwen text-only position-offset defect
at managed model load; source/tensor/load tests pass70/70. Keep the compatibility
adapter instance-local, version/behavior guarded, and vision/other models intact.
Separately retain bounded CubeChat scene name/theme during context compaction
(39focused/adjacent tests). Exact-weight before/after GPU and native conversation
acceptance remains required before claiming the repeated-reply symptom fixed.
Only internal previews may be updated; Pages/push remain held. Existing hosting
workers will need a page/model reload to receive a runtime correction.

Actual CPU/GPU comparisons now show the numerical Qwen correction does not
resolve dialogue repetition. A separate same-Nemotron peer test also reproduces
old replies/irrelevant stop across new prompts. Standard template/extraction and
request correlation checks pass for these fixtures. Neither a replacement action
contract nor sampled decoding qualifies as a remedy. Continue shared context
projection investigation with complete prior speech retained; keep previews and
saved memories unchanged until native semantic acceptance.

After the tool crash, numerical diagnostics resume cleanly: full-prompt and
cached-prefix Qwen logits agree closely on both the failing long input and an
arithmetic control, with all48caches preserved. This does not establish a cache
arithmetic defect. No tested contract/history/sampling variation qualifies as a
resident fix. Keep the user conversation intact and clarify whether Personal
model chat also exhibits repetition before widening the next diagnostic. Cube
preview5176 is restored with its previous build; only inference5189 received the
separately verified Global image publication fix.

User clarification: repetition has only been observed in CubeChat. The native
Personal-agent versus Global test produced poor agent answers but did not repeat
the prior sentence, so it is not a reproduction of this bug. Return to exact native
CubeChat failing conversations and evaluate changed-question response continuity
separately from model reasoning quality. Preserve identity, history and movement;
do not delete context or randomize outputs to conceal a repeated-answer failure.

Candidate: conversational speech is journaled independently from physical intent
selection. WorldConversationTurn owns pending-decision cancellation and scoped
history; WorldIntentDecision resolves bounded per-request references to observed
participants. Actual local motion state reaches senses even while chat is idle
or thinking. All164 focused checks and external Cube/Earth builds pass; native
current-question plus real Follow/Stop acceptance remains pending. No preview
promotion, public Pages build/deploy or push yet.

Native split acceptance failed: consecutive scene replies share a208-character
suffix and Follow returned null. Keep candidate unpromoted; current-question
salience contrast is next. Passing164 regressions/builds does not close this gate.

Second candidate: remove only exact self-speech memory duplicates of assistant
turns retained by router budgeting; preserve all stored episodes and full chat.
Use compact physical observations and authenticated `speaker` reference. Captured
post-split speech now breaks repetition and Follow resolves the correct requester.
All170 focused checks pass; new Cube build/TLS bytes verified. Three same-channel
owner questions plus visitor Follow/Stop native qualification is running. No
regular preview promotion or public Pages build/deploy/push yet.

Qualified November10: native same-Nano five-turn test passes with full history
and stored memories retained, no repeated reply/paragraph, and actual visitor
Follow/Stop through the WebGPU motor. Answers remain poetic/factually weak; model
quality is not claimed fixed. All170 focused checks, Cube/Earth external builds
and promoted5176 desktop/mobile/SecretWorkshop smoke pass. Only internal CubeChat
updated; no Pages build/deploy or push. Historical failed candidates remain above.

### November 10 — proposed next slice: goal-directed social errands

After qualified saved movement milestones, compose movement, targeted dialogue
and memory into a task such as “Go ask Nova what she knows about this place, then
come back and tell me.” Recommendation only; implementation is not yet requested.

Reuse the neural motor, goal checkpoints, authenticated resident conversations
and scoped memory. Add typed conversational skills/outcomes, durable question/
reply correlation and task-relevant memory retrieval. Transport delivery is not
an answer, and a received answer is an attributed statement rather than proven
fact. Reports must use the real matching reply. Share only the intended question
through its chosen audience; never expose private journals or the entire goal.
Replace blanket social/objective exclusion with explicit task-owned arbitration.

The model composes supported skills; do not script this example's itinerary.
Keep decisions event-driven and budgeted, motor control local, human priority,
owner controls and paused restore. Reconcile uncertain question delivery before
any retry. Show current skill and observed outcome in the existing Objective UI.

Acceptance: two actual peers, varied names/questions, attributed replies, return/
report, retained progress and no duplicate send after reload, target departure,
no reply, cancellation and privacy. The skill interface should serve other worlds.
This advances Humunculus composed skills; learned routing and self-directed
weight training follow measured skill outcomes rather than being claimed here.

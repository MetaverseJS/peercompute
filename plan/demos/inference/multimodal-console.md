# Multimodal resident model console

## Purpose and Humunculus relationship

The console is a reusable specialist execution surface: several independently
managed models can stay loaded, and a task router selects a capable local or
peer provider. Speech, vision, language and image generation share resource
admission, artifact identity, cancellation and route evidence. This is a step
toward the specialist workspace in [Humunculus](../humunculus/humunculus.pdf),
not a claim of learned motor behavior or a trained routing policy.

Agent identity and memory remain separate from the model provider. The same
resident registry and capability policy are available to the console and the
agent adapter. A future learned ranker can choose among eligible candidates;
it cannot bypass task compatibility, locality policy or resource limits.

```mermaid
flowchart TD
  UI[Console: text, attachment, Talk] --> Voice[VoiceSession: owned capture and playback]
  UI --> Intent[Explicit task: text, vision, or Generate image]
  Voice -->|bounded PCM| Router[Shared capability router]
  Router -->|ASR transcript| Intent
  Intent --> Target{Chat target}
  Target -->|Direct model| Router
  Target -->|Persistent agent| Agent[AgentChatSession → AgentRuntime]
  Agent --> Memory[StateManager: private identity and history]
  Agent --> Router
  Router --> Local[ResidentModelRegistry: exact CID and session]
  Router --> Peer[Peer inference: versioned multi-model and audio protocol]
  Local --> CM[ComputeManager workers and shared resource broker]
  Local --> Store[StateManager ArtifactStore: verified retained packages]
  CM --> Result[Text, RGBA image, or bounded PCM result]
  Peer --> Result
  Result --> UI
  Result -->|optional spoken text| Voice
```

## User behavior

- **Load** adds a resident model. Loading another model never silently unloads
  existing models. Stored Models distinguishes saved files from loaded workers,
  provides per-model Unload, and retains Verify locally and Delete.
- **Mixed** is the default. A ready, capable local model with bounded queue
  capacity takes precedence; otherwise a capable peer host is selected.
  Local only prohibits remote dispatch. Explicit model targets remain available.
  The actual selected model/provider is shown with the response.
  An open connection that cannot create an inference stream gets bounded
  same-peer relay recovery before any prompt is sent. Existing streams stay
  untouched, and a request already sent to a model is never replayed automatically.
- An attachment selects image understanding. **Generate image** explicitly
  selects text-to-image; unsupported attachment combinations are explained.
  Image generation is not guessed from a sentence or mixed with chat history.
  A remote vision model enables attachments even when this device cannot run it.
  Full queues keep attachments/drafts available but disable Send until capacity
  returns. Local only and explicit model selections retain their restrictions.
- **Talk** explicitly opens the microphone; **Stop recording** ends the utterance
  and routes ASR, then the conversation task. **Speak replies** routes short TTS
  chunks and plays them sequentially. Voice is usable through loaded local or
  hosted peer specialists. These controls do not silently download speech models.
- Explicit local model selection keeps speech stages local-only. A specific
  remote conversational model uses mixed speech routing because that model need
  not support audio. Explicit locality modes apply to every speech stage.

## Ownership and contracts

Each resident binds an immutable manifest CID to a managed service, session ID,
runtime options, descriptor, artifact-use lease and queue state. One service
retains one worker/session. Multiple models using the same backend remain
independent. A selected-model compatibility accessor must not determine which
service receives cancellation after a request has already started.

Aggregate CPU/GPU estimates remain tracked. Explicit combined limits are enforced
atomically, including a caller's stricter cap on a borrowed broker. Owned-console
Auto imposes no application byte cap; it does not claim automatic hardware fit.
An injected manager's existing limits remain authoritative. Lowering a cap keeps
current/cleanup-pending reservations and rejects additional loads until policy
permits them. Additional worker slots do not prove hardware fit. Admission failure
leaves existing residents usable; unload/delete affects only the selected model.
Startup reuses the remembered compatible conversational model and preserves
pending retained-package recovery. It does not automatically reload every saved
model or make a speech model the default conversation model.

The task contract covers text-generation, image-text-to-text, text-to-image,
automatic-speech-recognition and text-to-speech. It retains exact model/session
identity, request ID, cancellation signal and progress. Route evidence names
the actual provider; a deterministic baseline is not model-quality ranking.
No automatic fallback replays a request after execution has committed or emitted
partial output. Disconnects cannot prove that a remote worker finished cleanup.

Peer hosting advertises bounded per-model capabilities, busy/idle state and
queue capacity. New protocol support carries bounded mono Float32 PCM with
validated dimensions/sample rate, finite samples, chunk credits and digests.
Legacy v2 peers remain usable for their existing text/vision/image tasks, but
are never advertised as audio hosts. Current speech adapter limits remain
16 kHz/20 seconds for input and 256 codepoints per TTS chunk, with bounded output.
Audio and prompts travel over encrypted inference streams; they do not enter
the shared artifact catalog or replicated world state.

VoiceSession owns no model residency. One caller turn signal spans capture,
ASR, language/vision generation and optional playback. Cancellation stops owned
tracks/nodes and waits for cleanup; a late microphone grant is closed. World
speech reuses the same registry where present, while older injected runtimes
keep a compatibility path. Shared speech chunking prevents response truncation.

## Implementation and acceptance

1. Registry/runtime/controller: additive same-backend residents, per-CID loading,
   dispatch, unload, deletion, resource rejection and artifact-use ownership.
2. Shared router/agent adapter and interoperable multi-host/audio protocol:
   local-first capability policy, bounded request/result validation, backpressure,
   cancellation and no replay after commitment.
3. Console controls: default Mixed, explicit image intent, per-model unload,
   useful route labels and native microphone/speech controls.
4. Shared VoiceSession and world-speech registry integration: cancellation and
   cleanup across the entire voice turn without duplicate model loads.
5. Acceptance: focused unit/native UI tests, private two-peer synthetic audio
   transport, actual managed-model checks when resources permit, all affected
   production builds and exact internal HTTPS desktop/mobile/SecretWorkshop
   checks. Preserve the user's active27B session and cached data throughout.

Implementation results, failed experiments and remaining limits are recorded in
[the repository log](../../log.md). Learned selection, motor policies, training,
cloning and migration retain their separate Humunculus/agent-layer gates.

November7 acceptance passes with Gemma270M, SmolVLM256M, Moonshine Tiny and
Supertonic on four independent ComputeManager GPU workers. Mixed selects Gemma
for text and SmolVLM for an image; a separate browser with no local residents
uses real peer ASR, text and TTS, including native microphone controls and
completed playback. Unloading vision preserves the other three residents;
final cleanup releases every CPU/GPU lease. The test uses owned profiles and
separate browsers on one machine, not two physical devices. No27B or diffusion
hardware rerun is claimed for this change. Exact internal console and world
previews pass desktop/mobile and SecretWorkshop connection checks.


## One conversation surface — November 7

The main Chat target menu includes saved agents alongside Mixed, Local only and
explicit model choices. The Agents modal manages identity, instructions, goals,
summary, policy, export/import and deletion. Its Chat button selects that identity
in the main composer; it neither executes work nor resumes a paused agent. New
agents use Network assisted/Mixed, while saved policies and import-as-new's
paused local-only policy are preserved. Resume agent remains explicit.

`agents/agentChatSession.js` adapts the existing controller rather than owning a
second runtime. Direct model turns retain their transient model histories; agent
turns always pass through AgentRuntime's identity/context and acknowledged
request/result checkpoints. Selecting an agent restores bounded private history
(up to 300 inspected events, 24 visible entries, six image previews), excluding
world visitor channels. No agent data is merged into a direct model history.
Switching targets aborts stale reads; failed reads show an error rather than
substituting another identity. Clear conversation is unavailable for agents
because clearing a transcript would not erase persistent memory.

The agent identity is fixed for each complete turn. The selector stays locked
through capture, ASR, agent execution, TTS, cancellation and history refresh.
VoiceSession receives only local-only or mixed speech policies, with the saved
agent policy re-read before every ASR/TTS dispatch. Tightening policy during a
turn blocks subsequent remote stages. Agent cancellation waits for its own
runtime cleanup; disposing the UI aborts its reads and does not take ownership of
unrelated agents or shared model workers.

Controlled native browser acceptance covers history/reload/channel isolation,
image previews, voice policy, failed saves, explicit Resume, cancellation and
late reads. Separate actual GPU acceptance uses Gemma270M, Moonshine Tiny and
Supertonic on a private peer, native Talk/Stop, durable agent request/result and
completed speech playback in the same main composer. It uses two owned browser
contexts on one machine; model output quality and physical-device networking
are not established by that check.


Unified UI acceptance: agent/store/bridge60 tests, console/voice/unified97 tests
and world-agent85 tests pass. All three affected production builds and final
exact internal TLS desktop/mobile/SecretWorkshop checks pass. Native model-load
focus restoration and post-deletion cleanup were included in the final regressions.
The earlier external Earth tile-network failure and generic ICC deletion-size
failure remain in the log; neither was hidden by modifying an acceptance rule.


### November 7 residency and peer recovery qualification

The standalone default now accounts for estimated residency without imposing the
old12GiB CPU/16GiB GPU ceiling. Explicit Config budgets constrain combined
reservations; borrowed manager limits remain authoritative. Actual GPU errors
invalidate the managed session and retain resource ownership until cleanup is
acknowledged, including an error racing with cancellation. Browser memory hints
and estimates do not establish actual free VRAM.

Validated peer directories and completed results survive stream-close errors.
Expired explicit targets refresh the same CID, and Mixed can use a fresh cached
provider immediately. Image-input capability remains available while a queue is
full, with Send using the execution router's shared capacity predicate.

A stalled open WebRTC connection now permits a bounded fresh authenticated relay
path before any application header. Both endpoints protect negotiation and active
inference through bounded connection holds; existing active links remain intact.
An accepted request is never replayed. Manager policy constrains trusted routes,
capacity, coalescing, deadlines, cooldown, cancellation and shutdown ownership.

Validation:166peer,104inference,101native UI/voice and85world aggregate tests pass;
67manager/network tests and49private protocol tests are overlapping focused
evidence. Actual cached Gemma verifies managed native WebGPU binding and healthy
cancellation. Actual SmolVLM256 verifies Mixed/exact-peer red/blue image transfer
and correct GPU replies from a requester without WebGPU. A separate controlled
stalled-direct-link test recovers over Noise and executes exactly once, preserving
the old connection and both-end relay holds. Final leases and owned cleanup are
zero; no model downloads or public inference requests were used.

Three production builds and exact5189/5176/5187 TLS, desktop/mobile and
SecretWorkshop/noise checks pass. The Config gate reserves two8GiB accounting
records per resource; it proves admission/UI behavior, not physical co-residency.
A fresh two-client production discovery run receives the live hosted models and
mutual v3 directories, retaining transient startup errors as evidence. Concurrent
DreamShaper plus Qwen2B physical allocation remains unqualified. Detailed receipts
and corrected fixture failures are recorded in plan/log.md.


## November 7 — explicit saved-model selection and image intake

The shared panel reads the retained library once at startup, independently of
peer discovery. Any saved row (including speech, verification-needed or blocked
packages) opens Stored Models; it never starts a load. A successful empty read
alone allows the existing compatible default. Read failures expose Refresh and
never imply missing files. The remembered choice remains a browsing hint.

Stored Models supports accessible per-package checkboxes and Load selected.
Selection is reconciled by CID on refresh. All rows remain selectable for deletion;
loaded, blocked, checking, deleting or verification-needed rows are excluded from
loading. A snapshot of eligible choices runs sequentially through
loadStoredModel with one cancellation signal and the existing spinner. Ordinary
per-model failures continue; cancellation or incomplete cleanup stops remaining
loads. Completed and preexisting residents stay. Final metadata reads share the
operation signal; failed/cancelled refresh cannot be reported as success.

Reusable ui/chatImageInput.js owns clipboard/drag event intake, bounded same-origin
blob reading, eligibility checks and cancellation. Both file input and transfers
use readImageAttachment for the existing8MiB/512px pixel boundary. File bytes take
precedence over HTML/URL metadata. Plain text keeps native editing behavior;
foreign/expired URLs explain how to attach a file instead. New input supersedes
old decoding/fetch work; removal, identity changes and teardown cancel it.

The page back arrow opens Leave model console? with Stay here/Leave. Stay or
Escape leaves execution/draft untouched. Leave awaits owned panel disposal before
navigation; incomplete cleanup retains a retry action and prevents navigation.
Native browser regressions, three affected builds and exact internal preview
checks are the acceptance scope; this slice does not requalify large-model GPU fit.

The live phone checks also found existing overflow clipping in embedded world
model panels. Only `.world-agent-models .pc-inference-panel` now scrolls when
metadata and controls exceed its fixed height, keeping Talk/Send reachable.
Standalone geometry is unchanged; native wheel/hit-test and exact world previews
qualify the scoped layout fix. Stored-model bulk actions remain outside its
library row scroller so selection controls stay visible.

Acceptance is complete on the feature branch: UI119/119, retained library172/172,
world85/85, affected-layout4/4 and Cube input14/14 pass (counts overlap). Exact
trusted HTTPS5189/5176/5187 visual checks and authenticated SecretWorkshop links
pass. Cube and Earth phone composers are reachable with real wheel input and
hit-tests; Cube camera zoom is unchanged in dialogs and still works on its world
canvas. No user caches, model downloads, public inference, Pages publication or
merge occurred. The overview4173 destination has separate development-HMR
websocket diagnostics; they do not occur on the three changed static previews.


## November 7 — unified Models window

Models now opens one browser/library dialog from the toolbar or menu. Stored
models and Browse models are accessible tabs; saved packages make Stored models
the default, including the startup picker. The startup snapshot is reused instead
of issuing a second metadata read. Exact-CID batch loading, cancellation, local
verification and deletion continue through the same library controller. The main
page keeps Models and Agents, without a separate Load, selected-package label or
metadata/help strip. Compatibility and package details remain in Browse models.

Search has an accessible label/placeholder without the redundant visible helper
paragraphs; result count shares the Filters and sorting row. Phone results and
full-window details are separate views. Done/Escape returns from details to the
same filtered results and scroll position before closing the whole dialog.
Desktop details remain alongside results. Tests and internal previews must cover
both views, stored startup and tab selection persistence before acceptance.

Acceptance:41browser,104panel/voice/history and19image/voice-helper native tests
pass without double-counting focused repeats. Three builds and exact internal
5189/5176/5187 desktop/phone/SecretWorkshop checks pass. Stable keyed rows preserve
native clicks during discovery; synchronous close ownership protects a reopened
Stored view. The generic diff-size gate remains flagged and is recorded with
the reviewed requested removals in log.md; no policy threshold was changed.

## November 7 — compact chat controls

Back, Models and Agents now share the top row. The network glyph immediately
before Menu opens an accessible, dismissible diagnostics popover. The display
module consumes the existing discovery snapshot and owns no polling or network
work. Green requires a connected network, known positive peer/shared/hosted
counts and no reported discovery or artifact issue. Disconnected is red;
connecting, unknown counts, incomplete availability and warnings are yellow.
State text accompanies color. Escape, outside click and modal navigation close
the popover; viewport positioning and native top-layer rendering keep it usable
inside embedded world panels. Discovery health does not prove remote execution.

The cog immediately left of Attach opens Chat options, holding the existing
Chat target, Generate image and Speak replies controls plus route explanation.
The same controls and handlers retain routing, agent identity, history and
attachment semantics. No duplicated state or new model loading is introduced.
The cog is disabled during startup and active operations, including voice turns;
Done/Escape restores focus. Moving between other dialogs closes Chat options.
Queued close events preserve newer user focus, including Enter-to-send from
Message. Agent-history read failures are shown inside the open options dialog.

Routine readiness/load-success text is visually quiet but remains accessible.
Explicit status classification retains visible progress, cancellation, errors,
sharing warnings and incomplete-response notices. Empty-chat guidance follows
available capability and directs users to Models or Chat options. Small screens
retain a single row of navigation and a single row of cog/Attach/Talk/Send.
Native regression tests and exact preview acceptance are recorded in tests.md
and log.md; this presentation change adds no model or remote-inference claim.

Final native acceptance passes134 distinct tests: network6, panel/voice/history109
and unchanged image/voice helpers19. Focused repeats and initial failures are not
included in that total. Three external builds and exact internal5189/5176/5187
desktop/mobile layout and authenticated SecretWorkshop checks pass. Provider
discovery warnings remain visible in the pending network popup; no remote model
execution was performed in this presentation-only acceptance.

## November 7 — shared stored-model batch actions

The library footer contains Load selected and Delete selected, with no per-row
Load, Delete or Retry delete buttons. Any manifest CID is selectable regardless
of runtime availability or recovery state. Selection displays the ready-to-load
count when it differs; successful loads clear only the loaded selections, leaving
ineligible choices and their library window available. Unload and Verify locally
remain row actions. Cleanup pending rows explain how to retry Delete selected.

Deletion snapshots unique selected CIDs and awaits the existing runtime delete
operation sequentially under one panel operation owner. It stops on the first
error or cancellation, records acknowledged results before checking the next
abort, and reports only returned freedBytes. Stop deleting waits for cleanup;
deletion is not rolled back. A fresh metadata read follows any older in-flight
read and uses a fresh signal even after cancellation. Missing rows are pruned;
failed/unstarted retained rows remain selected. Errors and partial completion
stay visible. Cross-tab ownership, worker teardown and reference-aware file
retention remain the runtime's responsibility, with no forced lock release.

Acceptance:136native panel/browser tests pass. Three production builds and exact
internal5189/5176/5187 desktop/mobile, footer and authenticated SecretWorkshop
checks pass. The served console deletes two owned tiny retained fixtures through
the native batch button; no user model data or GPU inference is involved.


## November 8 — explicit chat output modes and hold recording

Network color now follows availability only: connected plus known positive peers,
shared models and hosted models is green; disconnected is red; other states are
yellow. Discovery/artifact diagnostics remain in the popover but do not veto green.
This supersedes the additional warning-based veto in the November7 section.

Generate image and Speak replies are native accessible checkbox glyphs in the
composer (image/ear); selecting one clears the other. Chat options contains target,
routing explanation and default-checked Be concise. The current language-model
user message receives an appended “Be concise.” when enabled, including voice,
vision and agent tasks on local or peer routes. Displayed and saved user text stay
unchanged; ASR, TTS and image-generation prompts are not styled. Core promptStyle
and optional normalized agent concise preference keep this reusable beyond the UI.
Normal byte/context limits include the appended instruction.

HoldToRecord owns a physical pointer or keyboard hold, not audio or inference.
The console owns the async operation: hold Talk to start, release to stop and send;
release before capture readiness cancels rather than starting later. Pointercancel,
lost capture/focus, hidden page and disposal discard capture and await owned audio
cleanup. Native clicks/repeated keys cannot toggle or duplicate turns. A successful
20-second recording limit can progress while still held without a later release
cancelling its transcription. Chat options/mode changes stay disabled during turns.
The same shared console remains borrowed and management-only inside CubeChat.

Verification and deployment results are recorded in plan/log.md and plan/tests.md.

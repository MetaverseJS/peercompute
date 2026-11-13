## PeerCompute Test Strategy

### Planned Hunyuan3D / CubeChat assets acceptance — November 10

- Future tests only: pinned generation adapter, resource measurements, progress,
  cancellation and provider failure; glTF/GLB byte/geometry/texture limits.
- Two peers render the same CID-backed object/avatar, retained files survive
  reload, and missing/corrupt assets fall back without losing the prior body.
- Avatar replacement preserves authoritative movement, collision, ownership,
  identity, nameplate and chat selection. Check desktop/mobile rendering cost.
- See [planned slice](demos/inference/inhabited-agents.md#future-todo-generated-3d-objects-and-avatars).
  No generation, browser compatibility or avatar tests have run for this candidate.

### Gemma4 media acceptance — November10

- November10 22:49AKST native acceptancePASS: exact decoder/companion imported
  with normalSHA/CID checks; managed ChromeWebGPU worker answered5/2, red/blue
  and knownJFKspeech. Source-off ownedbrowserrestart repeatedmedia. Independent
  noGPU/no-weight client repeatedtext/red/blue/audio on exactownedhost via
  encrypted inferencev4/SecretWorkshop. First-tokencancel, subsequenttext5,
  directorywithdrawal andzeroactiveleasesafterunloadPASS. Externalreceipt
  `peercompute-gemma4-native-20261111/peer-run-2/report.json`. Two earlier
  harnessAPI/pollingerrors were preserved and corrected, not counted asnative
  model failures. Currentdisplaycapabilitytested; immutablemanifestunchanged.

- November10 follow-up live peer check: v4 text Gemma returned two correct
  arithmetic answers (~1.1s each); an image request failed at capability routing
  because that host advertises text only. Native companion load/vision/audio
  remain untested. Own peer decoder transfer was deliberately interrupted while
  waiting for GPU availability; preserve that distinction in test reports.
- Unit/transport: run `node --test peercompute/tests/unit/gguf*.test.js peercompute/tests/unit/gemma4*.test.js peercompute/tests/unit/inferenceRouter.test.js peercompute/tests/unit/peerInference*.test.js peercompute/tests/unit/peerMultimodalInference.test.js peercompute/tests/unit/modelConsoleRuntime.test.js demos/tests/voice-session.test.js demos/tests/prompt-style.test.js demos/tests/model-derived-import.test.js`.
  Cover exact source/derived digests, decoder reuse, failed import isolation,
  independent projector mounting, native flags, media ordering on context retries,
  owned input buffers, v4/v3/v2 negotiation, actual Noise transport, complete-input
  per-host capability and queue checks, cancellation and legacy speech.
- Browser fixtures: `node --test demos/tests/console-voice.test.js demos/tests/model-browser.test.js demos/tests/global-chat-session.test.js demos/tests/global-chat-ui.test.js`.
  Verify direct microphone-to-native-model path, Global transcription without
  publishing PCM, text/image regressions, phone layout and task filters.
  Fixtures use owned browsers with GPU disabled.
- Artifact reference: `scripts/derive-gemma4-projector.mjs` reconstructs from
  pinned source ranges; compare against an independent pinned llama.cpp CPU
  conversion. Preserve source-range checks and entire output SHA. Full65536-value
  BF16 conversion parity was checked against CPU Torch; no model weights in Git.
- Build inference/CubeChat/Earth to external cache, verify exact internal HTTPS
  bytes and model detail screenshots, inspect console/network and SecretWorkshop
  authentication. Preserve assets needed by active sessions. No Pages release.
- Native acceptance remains separate: see the Gemma media plan and
  `MODEL_SUPPORT_MEDIA=1` harness mode. Check two distinct known images, known
  speech, actual managed WebGPU dispatch, context limits, cancel/unload and
  source-disabled reload; follow with two-browser actual-model media inference.
  Do not run competing GPU loads while the user is testing. Record native tests
  as unrun until a complete execution receipt exists.

### Peer vision discovery and execution — November 7, 2026

- `npm run test:peer-inference` includes connection-recovery ownership tests.
  A stalled open native link must not trap subsequent directory requests. A
  forced fresh encrypted relay connection must preserve the same peer, honor
  connection capacity/backoff, coalesce recovery, protect both ends only for a
  bounded handshake/operation lifetime, and leave existing work untouched.
  Cancellation/late dial completion and shutdown must release recovery ownership.
  Recovery is allowed before application headers; committed requests never replay.
- Private encrypted protocol tests must preserve fully validated vision
  directories and completed text/image/audio responses after a stream-close
  failure, with bounded cleanup and no replay. Malformed messages, cancellation
  and the existing directory TTL remain authoritative.
- Controller tests exercise expired exact peer selection, same-CID refresh,
  cached-full queues, missing providers, bounded/cancellable shared polls and
  immediate routing through fresh eligible cached peers. Local only never
  queries or substitutes a peer.
- Native UI tests cover remote vision under Mixed and exact selection despite
  local WebGPU incompatibility, actual file chooser input, all-full versus busy
  with queue space, disappearance/recovery preserving drafts, and text-to-image
  models never claiming vision input. Composer capacity uses the router's shared
  predicate; execution still validates model identity and task independently.
- A cached small VLM on an owned GPU host and a GPU-disabled requester exercise
  real image transfer and inference through the native composer and a private
  relay. No public requests or model downloads; preserve exact evidence and
  separately verify the deployed internal preview's TLS and backend connection.

- Final results: `test:peer-inference`166/166, `test:inference`104/104,
  `test:inference:ui`101/101 and `test:world-agents`85/85 PASS. The peer script
  includes the five real encrypted recovery regressions in
  `peerInferenceRecovery.test.js`, alongside the20manager ownership cases.
- Actual cached SmolVLM native-to-Noise recovery executes exactly one GPU request
  with identical transferred pixels, preserves the old connection and both-end
  relay retention, and releases all owned resources. Exact three-demo previews
  and SecretWorkshop connections pass; public discovery's transient initial
  errors remain recorded. See the log for timing, evidence paths and limits.

### Combined model memory admission — November 7, 2026

- Use actual DreamShaper/Qwen catalog reservations with the real lease broker to
  reproduce the old12GiB CPU rejection and admit the pair under owned Auto.
  Exact16GiB GPU caps allow equality; a further speech reservation must fail
  atomically and roll back only its new CPU reservation. These tests allocate
  bookkeeping records, not physical model buffers.
- Cover explicit combined cap updates, both-field atomic validation, lower-than-
  current limits without eviction, borrowed-owner ceilings, accidental unbounded
  initialization rejection, current-use accounting after failed termination and
  per-CID unload/cancel. Real ModelInferenceService with controlled workers tests
  load/OOM cleanup; it is not hardware-fit proof.
- Transformers GPU tests inject actual-device-shaped validation/OOM/internal
  scopes, uncaptured errors and device loss during load/generation. Require all
  scopes drained, failed session invalidation, normal failure/cancel reuse and
  host ownership retention until acknowledged cleanup. Preserve diffusion/speech
  error-path suites. One cached small-model GPU run can qualify binding/runtime
  interoperability without putting the user's large resident models at risk.
- Native Config tests show estimated totals versus effective caps, Auto, borrowed
  ownership and over-budget state. Refresh totals without overwriting draft
  inputs; changing budgets does not load, delete or evict models. Exact trusted
  internal previews may reserve/release synthetic accounting leases in an owned
  profile, explicitly without model allocations or hardware-fit claims.
- Build all affected demos externally and check their HTTPS previews. Leave user
  profiles/model caches and persistent preview services intact; stop owned tests.

### Unified model and agent chat — November 7, 2026

- `npm run test:agent-layer` includes the management-only Agents modal and
  AgentChatSession bridge, alongside durable store/runtime/router checks.
- `npm run test:inference:ui` includes native unified-chat tests using actual
  IndexedDB, Web Locks, AgentRuntime and VoiceSession with controlled inference
  and audio. Assert one composer, explicit Resume, direct/agent isolation,
  private versus world history, bounded images and stale-read rejection,
  local-only ASR/TTS, policy changes, durable-save failure and cancellation.
  Hold final list reads to prove turn ownership, and initial list reads to prove
  panel disposal cannot hang. Controlled outputs do not qualify GPU execution.
- Optional actual hardware: `MULTIMODAL_AGENT_CHAT=1
  MULTIMODAL_AGENTS_ONLY=1 node demos/tests/multimodal-console-browser.mjs`.
  Requires the owned preseeded acceptance profiles; blocks external downloads.
  Check native management Chat → Resume → main Talk/Stop, real peer ASR,
  AgentRuntime reasoning, persisted private request/result and completed TTS.
  The flag skips the separately qualified fourth vision resident. Default full
  multimodal acceptance still covers four residents and vision routing.
- Build inference, CubeChat and Earth to external output directories. Check exact
  internal HTTPS links, native desktop/mobile controls and SecretWorkshop Noise
  connection. Preserve public Pages artifacts, user browser data and unrelated
  running previews; close owned test processes.


### Inhabited world agents — November 6, 2026

- `node --test peercompute/tests/unit/agentWorldContracts.test.js
  peercompute/tests/unit/agentConversation.test.js` checks durable body bindings,
  private visitor channels, public descriptor bounds, real Noise authentication,
  scope/replay/deadline and acknowledged cancellation/teardown. Existing
  agent record/router/runtime suites remain required.
- `node --test demos/tests/world-agent-host.test.js
  demos/tests/world-agent-runtime.test.js demos/tests/world-agent-ui.test.js
  demos/tests/world-agent-voice-controls.test.js`
  checks scene ownership, persistence after close/restart, safe directory
  projection, auxiliary model deletion, pending microphone/voice cancellation,
  native keyboard/dialog controls and phone wrapping. These use explicitly
  simulated inference; they do not prove a model or speech works.
- November7 voice regression coverage must compose the real host and native UI:
  pending microphone permission, Talk/Stop, typed Send and Models during capture,
  cancellation ownership through transcription/generation, and deleted/unloaded
  speech services. Check actionable status and explicit Enable voice recovery;
  never silently synthesize nothing while reporting success. Pinned speech
  compatibility must use the actual 1GiB per-service reservations, accept FP32
  without shader-f16, reject modified packages, and keep auxiliary packages out
  of automatic/main chat loading. CubeChat listener distance follows the player
  while camera translation/zoom leaves it unchanged.
- CubeChat `demos/tests/cubechat-agents.test.js` and existing input tests cover
  separate body/collision ownership, native picking, controller isolation and
  room teardown. Earth `demos/earth/tests/agentLayer.test.mjs` and
  `demos/tests/earth-agent-browser.test.mjs` cover geographic bounds, lazy
  GIS-separated data source, real Cesium picking and audio poses.
- Managed speech: `node --test peercompute/tests/unit/speechRuntime.test.js
  demos/tests/speech-lifecycle.test.js demos/tests/speech-audio.test.js`, followed
  by `node demos/tests/speech-browser.mjs` and
  `node demos/tests/speech-audio-browser.mjs`. Hardware requires the verified
  external speech cache and an owned profile. Require actual WebGPU dispatch,
  intelligible ASR/TTS, generated PCM, cancellation, source-off restart and zero
  worker/resource leases after unload; microphone tracks must end.
- Full acceptance uses owned browsers and external receipts for production
  scene visuals/SecretWorkshop connection and actual two-browser inference.
  Never send tests to an unrelated public model host, claim simulated replies
  as inference, or use a terminal browser/split. Preserve all failures and record
  the precise tested scope in plan/log.md before the local commit.
- Existing bot survey adds a later movement gate: per-agent motor isolation,
  dynamic physics/collision, bounded stale-action rejection, interpolation,
  low-rate saved positions and geographic-to-local-metre conversion for Earth.
  Passing the scripted Quake baseline does not qualify a learned controller.

### Requested9B variants and non-FP16 catalog — 2026-11-03 22:14 AKST

- Check immutable HF commits, sizes, publisher LFS SHA-256, metadata Git blob
  hashes, source/conversion lineage and license closure. Bounded HTTP206 GGUF
  header inspection verifies architecture; it does not prove full-file execution.
- Verify same-revisionQ4/Q8 selection using model precision and exact weight
  identities, with cross-variant/tampered rejection and stable stored/peer names.
  Preserve the old27B manifest and runtime budgets. qwen2/llama additions accept
  text tasks only; unchanged vision and dtype checks remain covered.
- Import the two small pinned ONNX packages into the external verified cache;
  `MODEL_IDS=qwen2.5-coder-0.5b-q4,smollm2-360m-instruct-q4
  MODEL_REQUIRE_NO_F16=1 MODEL_EVIDENCE_PATH=<external JSON>
  node peercompute/tests/runtime/model-inference.mjs` asserts shader-f16 is absent
  from the actual adapter and ORT worker device, then verifies GPU generation,
  reuse, cancellation/unload and restart with origin/model CDNs blocked.
- Built preview checks all16 catalog choices, the two supported no-FP16 entries,
  four new actionable GGUF setup entries, Q4/Q8 distinction, search and responsive
  wrapped selectors, without downloading model weights into the preview profile.
- Full9B imports/execution/persistence/peer transfer remain separate qualification
  work. Do not imply a small-model GPU run or header check proves those models.
- Results:157/157 focused unit tests and36/36 headless UI tests PASS. All three
  inference/CubeChat/Earth production builds pass. Actual no-f16 GPU run PASS:
  Coder loads9.66s, greeting1.14s/2478dispatches; Smol loads3.31s,
  greeting1.82s/4816dispatches. Both reuse/cancel/unload; Coder restart succeeds
  with source disabled. No external requests/page errors. Times are this-machine
  observations and greeting output is not a task-quality benchmark.

### Discovery independent of artifact startup — 2026-11-03 22:05 AKST

- Controller tests keep directory queries running across four simulated20-second
  publication stalls, coalesce background work, preserve teardown, and expose
  bounded errors. Connection tests preserve inference during artifact startup or
  same-store ownership failure, with cancellation and owned/borrowed cleanup.
- Real Noise query tests preserve authenticated error envelopes, legacy bounded
  error-only frames, and full identity/scope validation for model directories.
- Focused controller/connection/library/protocol/help/admission suite103/103 PASS;
  headless UI36/36 PASS, including failed-startup status after later polls. UI covers visible network counts and separate sharing
  errors, actual opened-picker wrapping at866px/390px, keyboard focus, stable
  open menus through refresh, and command-first setup help.
- `PREVIEW_URL=<trusted HTTPS console> DISCOVERY_EVIDENCE=<external JSON> node
  demos/tests/model-network-discovery.mjs` uses an owned GPU host, same-library
  second tab and independent GPU-disabled browser on the production backend.
  Pinned SmolVLM256M bytes are streamed from the existing external artifact cache;
  requires the matching cache and trusted preview TLS certificate. No prompt is
  sent unless the discovered target is hosted solely by the owned browser.
- Staging and exact live HTTPS preview actual-browser PASS: shared files and loaded hosts discovered in both
  requesters despite same-library artifact ownership rejection; encrypted remote
  reply has999 GPU dispatches/86 submissions; hosting off/on updates directory;
  desktop/mobile picker bounds pass, no page errors or cleanup errors.
  This proves separate processes on one machine, not the open physical-host gate.
- First harness run failed when Playwright buffered a large model response through
  CDP. Replaced that fixture path with HTTPS streaming of exact pinned files;
  production model verification and bounds are unchanged. Preserve both receipts.

### Chat completion and output budgets — 2026-11-03 21:12 AKST

- Workers:1,024-token ceiling;2,048-token GGUF context; native stop/length/unknown,
  EOS exactly at the limit, missing completion metadata, cancellation and explicit
  context errors. ONNX retokenizes and drops old complete turns while retaining
  system/latest-user/image input and disposing discarded tensors.
- Peer tests retain optional completion metadata over real loopback Noise streams,
  accept older omissions as unknown, reject invalid enums/types, and preserve image
  output, byte limits, admission and no replay after request commitment.
- Browser tests preserve long local/peer reply text, annotate limits outside model
  history, distinguish unknown from normal stop, and scroll to the latest content.
- Hardware: `GGUF_ARTIFACT_MODE=external GGUF_NVIDIA_F16_OVERRIDE=1 GGUF_SKIP_RESTART=1 GGUF_LONG_RESPONSE=1 node peercompute/tests/runtime/gguf-inference.mjs`
  reuses verified cached0.8B weights, validates actual GPU generation beyond128
  tokens with2,048 context, bounded output, native stop/length, warm reuse and
  cancellation/unload. External mode proves worker behavior, not browser persistence
  or a physical peer transfer. Earlier27B memory proof remains512-context only.
- Mixed-version v2 hosts: verify optional provider-specific limits, missing→256,
  updated→1024, invalid values, per-candidate precommit bounds, and unchanged
  longest-idle routing/no postcommit replay. Config history reset must preserve
  model residency/storage and be unavailable during an active operation.
- Current validation:151/151 integrated unit/network/controller tests and32/32
  headless browser tests pass. Cached0.8B GGUF actual GPU answer exceeds128tokens
  and reaches1024 with native length reason; arithmetic EOS reports stop.
  SmolVLM256M actual ONNX/image lifecycle passes with normal stop metadata.

### Import phase and memory estimate display — 2026-11-03 21:19 AKST

- File events expose initial/throttled/final verified byte counts; manifest
  verification retains hash checks. UI advances from the final LICENSE file to
  verification and GPU component initialization, with bounded elapsed updates.
- Controlled stalled publication proves local readiness is independent; public
  import methods retain awaited sharing behavior. Cancellation before unload,
  load failure, background errors and tracked teardown remain covered.
- Every HF/peer option displays trusted configured RAM/GPU estimates, leaving
  unknowns explicit and avoiding a claim to detect free VRAM. Diffusion8GiB/8GiB
  display is an admission reservation, not a newly measured memory peak.
- Inference, CubeChat and Earth production builds pass with existing chunk-size
  warnings. Final staging HTTPS desktop/mobile check passes with all10 HF labels,
  actionable missing-f16 help, memory estimates, zero page/network errors and no
  weight/WASM requests. Exact live-origin handoff is recorded in plan/log.md.

### Unsupported model setup help — 2026-11-03 20:57 AKST

- Cover browser/OS detection, conditional NVIDIA Vulkan workaround commands,
  non-Chromium/mobile guidance, memory/runtime/isolation reasons and inert model
  names/URLs in the pure guidance module. Do not invent unsupported browser flags.
- Real DOM tests cover selecting a muted model, all-unavailable menus, repeated
  opening, keyboard/focus/Escape, clipboard success/failure, manual browser/OS
  correction, Config navigation, refresh stability and no import/unload side effects.
- Verify production default-browser help at the trusted HTTPS preview on desktop
  and mobile. No weights, GPU allocations or user browser changes are needed.

### Model search and device admission — 2026-11-03 20:19 AKST

- Pure policy tests: absent/fallback GPU, missing f16 and GGUF browser features,
  bounded adapter-probe failures, explicit RAM/GPU budgets, unknown/capped RAM,
  and the27B package staying eligible despite smaller per-buffer limits.
- Controller tests: reject incompatible catalog/peer imports before bytes or
  unloading the resident model; recheck before load; retain remote inference.
- Headless UI tests: search names/sources/tasks, disabled reasons, empty results,
  selection restoration, five-second refresh, optional budget validation/clear,
  and remote targets unaffected by local incompatibility.
- Validate production startup and responsive layout at the exact trusted preview
  URL with an isolated browser. No model downloads or large allocation probing.
- Final focused runtime/policy suite91/91 and headless UI23/23 PASS. Policy15/15
  includes cold null→hardware retry, repeated null, fallback, deadline and late
  result handling without GPU devices. Inference/CubeChat/Earth builds pass.
- Actual cold production startup finds NVIDIA/f16; ten choices, case-insensitive
  filter, empty/clear selection, 8GiB GPU budget disabling27B, programmatic
  rejection before downloads and budget reset pass. Real manifest verifier
  accepts bounded hashed metadata and rejects corrupt/oversized data using a
  synthetic transport response, with no weights or persistent writes.
- Exact trusted HTTPS5189 preview and staging5197 pass at1440×1000/390×844,
  with SecretWorkshop connected, all three services idle, default preferences,
  library dialog and overview link intact. No page errors, failed HTTP responses
  or weights/WASM requests. Receipts: /tmp/peercompute-device-filter-{preview,live}.json.
  Owned browser/profile and temporary5197 server closed; preview5189 remains up.
- Follow-up FP16 diagnosis: catalog matrix16/16 policy tests PASS. With the same
  16GiBGPU budget, missing browser f16 disables six GGUF/diffusion choices while
  four ONNX q4 choices remain eligible; feature exposure enables all ten. Check
  actual production startup separately without the NVIDIA f16 override and with
  it, recording driver/browser identity and avoiding model downloads. Existing
  GPU-model quality evidence applies only to its documented override environment.


### Image generation and abliterated choices — 2026-11-03 19:18 AKST

- Verify immutable catalog metadata, complete package closures, hashes,
  licenses and trusted runtime admission; reject unlisted model/graph changes.
- Exercise diffusion math against upstream scheduler equations, fixed seeds,
  bounded RGBA conversion, worker-only execution and shared residency cleanup.
- Protocol2: explicit task/input/output capabilities, one prompt for image
  generation, bounded result metadata and credited binary frames, digest
  verification, stalled receiver cancellation, no replay after commitment,
  and existing text/vision transport behavior.
- Console: automatic runtime selection, image prompt semantics, attachment
  capability, responsive generated PNG previews, object-URL eviction/disposal,
  remote progress and cancellation; preserve modal library/settings behavior.
- Run actual managed WebGPU generation for each added runtime/model where
  supported, inspect images and verify nonuniform prompt-dependent pixels.
  Include warm reuse/source-off reload/cancel/unload and real independent
  GPU-disabled peer requester. Keep artifact downloads outside Git, serialize
  hardware work and preserve the user's active model/browser and preview servers.

- Actual image **PASS**: DreamShaper receipt
  `/tmp/peercompute-diffusion-dream-20261103-jsep.json`, SD-Turbo receipt
  `/tmp/peercompute-diffusion-sd-20261103.json`. Each verifies all seven source
  files, recognizable prompt-dependent512×512 images, positive GPU dispatches
  in every neural stage, warm reuse, cooperative local cancellation, zero leases
  after unload and identical fixed-seed output after source-blocked browser restart.
- Actual native WebRTC image output **PASS** for both models: independent
  GPU-disabled requester, matching host/pixel SHA-256, hosting-disable rejection,
  zero requester workers/databases/model/WASM requests, no private pubsub fields.
  Protocol cancellation/stalled-output/digest/no-replay tests use real Noise peers
  with injected model callbacks; distinguish them from actual GPU image generation.
- UI19/19 and controller/library23/23 pass; actual production console startup,
  ten model choices, connected backend and desktop/mobile modals pass without
  model downloads. Real console DOM and real GPU generation are separate checks.
  The initial production entry hang and first JSEP/native-EP ABI mismatch receipts
  remain in log.md; both causes were corrected before final passing runs.
- Qwen3.5 0.8B Abliterated **PASS**: 26/26 GPU layers, greeting, exact arithmetic,
  warm reuse, cooperative cancellation, unload with zero leases and persistent
  browser restart with all weight sources blocked. Receipt:
  `/tmp/peercompute-qwen35-abliterated-hardware-20261103.json`.
- Qwen3 0.6B Abliterated **runtime PASS / quality FAIL**: 29/29 GPU layers,
  lifecycle and source-blocked restart pass. The original arithmetic prompt
  returned `2` twice; one clearer prompt calculated `4` but violated the requested
  one-digit format. Both original and bounded diagnostic failures are preserved:
  `/tmp/peercompute-qwen3-abliterated-hardware-20261103.json` and
  `/tmp/peercompute-qwen3-abliterated-quality-diagnostic-20261103.json`.
  No prompt search or sampling change was used to erase the failure.
- Final exact Tailnet preview **PASS**: production snapshot at
  `https://fastbox.tail5c077c.ts.net:5189/?dev=1&v=images1`, ten choices, three idle
  runtime services, connected SecretWorkshop backend, trusted HTTPS/isolation,
  desktop/mobile fullscreen and both dialogs. No weights/WASM requests or page
  errors; owned browser closed. Overview4173 still links the model demo.
  Receipt: `/tmp/peercompute-images-live-20261104.json`.
- Full core408/409 (unchanged ULG Eshkol baseline failure); network/reliability/
  WebRTC63/63; demo contracts49/49; Webpack/CubeChat/Earth builds pass.
  `npm run test:diffusion` and `npm run test:diffusion:browser` are the new focused
  entrypoints. Hardware tests use owned Chrome157/NVIDIA Vulkan f16 override;
  no user browser settings change. Broader parent physical-host gates remain open.

### Modal library and browser storage — 2026-11-03 18:49 AKST

- Native Config and Stored Models dialogs: focus/Escape/close restoration, both
  default-on preferences only inside Config, no capacity selector, meaningful
  empty/loaded/shared/delete/error states, viewport and peer polling preserved.
- Prove advisory low browser estimates do not stop import; exercise actual
  QuotaExceededError with small deterministic storage and verify recovery/cleanup.
- Prove local library capacity can exceed per-DAG block budget without removing
  per-DAG protections. Delete one package while preserving other manifests,
  independently pinned files, shared blocks and active readers/imports.
- Verify deleting loaded/shared models stops inference/publication and awaits
  unload; failures remain truthful/retryable. Use isolated fixture stores only.

- Final **PASS**: artifact41/41; combined artifact/controller/real-IDB63/63;
  modal UI16/16. Exact Tailnet desktop/mobile modal checks pass with no weights,
  GPU work or user-cache mutation. Controlled27B HF418 probe proves a10GiB
  advisory estimate no longer rejects download; tiny actual IDB import/list/delete
  reclaims storage. Injected native IDB put failure verifies quota-error recovery.
- Broader regression: core384/385 (unchanged ULG Eshkol baseline failure), demo
  contracts49/49; Webpack/inference/CubeChat/Earth builds pass. Actual128MiB
  browser WebRTC reseeding passes after original host exit and peer reload,
  with0public HTTP fallback. Evidence in log.md and external ICC runtime archive
  model-library-20261103; `npm run test:model-library` reruns the focused suite.

### Console and peer inference acceptance — 2026-11-03 18:11 AKST

- Verify source selector and automatic fetch→load, default-on sharing/hosting,
  hidden configuration, Enter/Shift+Enter, attachment picker/preview, image
  rejection on text-only models, streaming auto-scroll, five-second refresh and
  teardown without timers or callbacks surviving disposal.
- Verify one entry per hosted model; longest-idle ready host, deterministic busy
  fallback, stale/disconnected host expiry, bounded queues and no duplicate
  execution on retries. Validate scope, peer identity, encryption, frame/image/
  output limits and cancellation on disconnect/disable.
- Use actual independent browser peers with a GPU-disabled requester and a real
  managed SmolVLM GPU host. Send text and red/blue images through encrypted libp2p
  streams; verify streamed output, GPU dispatches, cancellation and cleanup.
  Block external model downloads after seeding the host. Separately verify
  discovery and Bitswap retrieval of the published model package.
- Run focused tests and affected existing regressions/builds; inspect the exact
  Tailnet HTTPS preview headlessly at desktop and mobile sizes. Keep user preview
  servers; close owned acceptance browsers and temporary servers.

- Final actual remote acceptance **PASS**: Chrome157 on NVIDIA RTX5060Ti;
  separate GPU-disabled requester and third receiving browser. Text plus red/blue
  image responses use the same managed worker and exact native-encrypted WebRTC
  streams (red3,605/blue1,694 GPU dispatches). Cancellation/reuse, active host
  disable, disconnect and no-host rejection pass. Third peer verifies15 files,
  1,052 blocks and268,819,304 DAG bytes with HTTP model sources blocked. Requester
  stores0bytes, creates no ComputeManager/worker and requests no WASM. No page
  errors, external requests or prompt/image pubsub fields; unload releases all
  resource leases. /tmp/peercompute-peer-inference-hardware-20261103-direct.json.
- Preserve the first run's failure: functional checks passed but transport chose
  encrypted relay despite available WebRTC. Direct-path preference and exact
  returned-connection assertions fix it; failed receipt remains
  /tmp/peercompute-peer-inference-hardware-20261103.json.
- Protocol plus existing reliability/WebRTC tests **58/58 PASS**, including14
  actual Noise/plaintext-node protocol checks. Shared ONNX/GGUF/controller
  regressions **56/56 PASS** before the final additional reconnect test.
- Exact trusted Tailnet preview passes with the actual facade/backend and GPU
  disabled: six HF choices, both defaults on, no Close/CID/canvas, no weight
  requests or page errors, and390px mobile layout without overflow. Desktop,
  mobile and Config screenshots reviewed; /tmp/peercompute-console-preview-20261104.json.
- Final UI interaction suite **9/9 PASS** via
  `node --test demos/tests/inference-panel.test.js`; final facade suite **9/9 PASS**.
  Fullcore **360/361**, only the pre-existing staged ULG Eshkol contract failure
  at serviceOrchestration.test.js:4137. Demo ports/release/agents **49/49 PASS**.
  Webpack and inference/CubeChat/Earth production builds pass with existing
  large-bundle warnings. Generated outputs are excluded from the commit; the
  inference snapshot is retained under ~/.cache/peercompute-preview.
- The early working-tree ICC guard failed its deletion threshold. Preserve that
  receipt. The complete staged change passes with a warning under ICC's existing
  replacement-implementation rule; policy was not changed. Exact scope and
  counts are recorded in log.md.

- Viewport follow-up **PASS**: panel exactly fills1440x1000,1920x1080,
  1280x1600 and390x844, no outeroverflow, oldheading/canvas/sampleimage, pageerrors
  or weightrequests. UI10/10PASS and follow-up lifecycle/protocol24/24PASS;
  inference buildPASS. Receipts: /tmp/peercompute-console-fullscreen-preview-20261104.json,
  /tmp/peercompute-console-fullscreen-tests.log and /tmp/peercompute-console-lifecycle-followup.log.

### IPFS artifact and model gates - 2026-11-03 AKST

Status: **implementation underway; evidence below is scoped**. The
[IPFS-01 plan](branch/ipfs-large-files-model-inference.md) owns the exact phases,
model/runtime identity, resource limits, and full completion criteria.

- 2026-11-03 implementation checkpoint: core suite **277/278**; only the same
  baseline staged ULG Eshkol tensor-contract failure remains. Manager-focused
  suite **61/61**, worker review regressions **55/55**, inference adapter
  **27/27**, demo-agent contracts **4/4**. Combined foundation scope **124/124**
  preceded the added config-architecture guard; exact counts are command scoped.
- `IPFS_ARTIFACT_BYTES=134217728 node peercompute/tests/runtime/ipfs-artifacts.mjs`
  **PASS**: three independent browser contexts, signed application/artifact
  identity discovery, A exits, B reloads and restores approved publication and
  identity, C retrieves 134,217,728 file bytes / 134,243,523 DAG payload bytes
  over WebRTC, zero public HTTP requests. Fixture generation and comparison
  stream unique chunks and incremental hashes. All owned test processes closed.
- Storage tests additionally exercise a filesystem backend and pull-driven
  multilevel UnixFS range traversal. A paused-reader block-count assertion
  detects read-ahead buffering; RSS alone is not a sufficient backpressure test.
- `IPFS_ARTIFACT_MODEL=smolvlm-256m-q4 node peercompute/tests/runtime/ipfs-artifacts.mjs`
  **PASS**: exact CLI model CID, all15 files /268,763,564 bytes,1,052 unique
  blocks /268,819,304 transferred DAG bytes per hop, independent browser stores,
  A exits /B reloads /C fetches, all per-file SHA-256 digests match, no public HTTP.
- Actual model gate **PASS** for Qwen3-0.6B q4 and both SmolVLM q4 models:
  /tmp/peercompute-all-models-hardware-20261103-admitted.json. Chrome155 with the
  NVIDIA Blackwell adapter; ORT-owned device instrumentation counts actual GPU
  compute dispatches (3,278 /3,605 /2,547 respectively), not merely adapter
  detection or a requested execution-provider string. Warm reuse, cooperative
  cancellation, unload, source-off restart and red-to-blue image-dependence pass.
  No page errors or external model/runtime requests. q4f16 is unverified.
- Qwen3.5-2B **fully q4 hardware acceptance PASS** after restoring the upstream
  image-normalization default omitted by the pinned export: exact package CID
  `bafkreihbfj2knzj47dmtsltvdvjlh7jlxbz32fgwibq4rp7guj4i7lixda`, worker-1 on NVIDIA
  Blackwell, red→Red and blue→Blue, 2,745 GPU dispatches per request, warm reuse,
  cooperative cancel, unload and source-off browser restart. Zero external
  requests/page errors. Evidence:
  /tmp/peercompute-qwen35-2b-hardware-20261103-normalized.json.
  The actual installed image processor regression checks normalized channel
  values and grid shape; explicit do_normalize=false remains respected.
- Latest expanded core suite: **302/303**; only the same historical ULG Eshkol
  failure remains (/tmp/peercompute-ipfs-core-final.log). Artifact and transport
  combined checks **39/39** after source-prefetch and publication-bound changes.
- Final checkpoint after the multi-tab ownership correction: **305/306 core
  tests pass**, with only that same ULG Eshkol baseline failure. Transport scope
  **12/12**; final inference Vite build and core Webpack build pass (existing
  bundle-size warnings). Log: /tmp/peercompute-ipfs-core-ownership-final.log.
- Same-store browser ownership gate **PASS**: a second same-origin tab cannot
  start a competing artifact node with the persisted identity; local import/read
  and inference service remain available. After acknowledged owner disposal, it
  reconnects with the retained identity. Independent BrowserContexts connect
  concurrently with distinct identities. Failed stops/startup cleanup retain
  ownership for retry. Evidence: /tmp/peercompute-same-store-tabs-after.json.
- Core Webpack and all existing Vite demo production builds pass. Legacy
  Webpack needed a specific node:stream replacement; Vite workers need ES module
  output for lazy inference chunks. Bundle-size/import-splitting warnings remain.
  EarthGrid panel lifecycle passes; CubeChat's overlay stacking fix is under
  headless repeat. Static demo and agent checks **49/49**.
- Latest full-core checkpoint: **294/295**, with only the pre-existing staged
  ULG Eshkol tensor-contract mismatch. Exact log:
  /tmp/peercompute-ipfs-core-checkpoint-final.log. CubeChat overlay repeat now passes.
- Tailnet preview: exact overview4173 and inference5189 HTTPS URLs validate their
  certificates; browser click-through confirms the requested second card and
  secure context. Two independent contexts connect both app and artifact nodes
  to Secret Workshop over WSS, discover the authenticated provider and transfer
  a97-byte fixture through Bitswap/WebRTC. Fixture withdrawn and validation
  browsers closed. Evidence: /tmp/peercompute-secretworkshop-live-network.json.
- Expanded publication-bound tests **9/9**: live quota policy, explicit/hard caps,
  65,537 unique synthetic CIDs, shared-block restore deduplication, corrupt or
  over-limit root rollback, and failed persistence preserving the old catalog.
  This validates bounded admission; it is not a full18GB browser transfer run.
- Real large-file gate **PASS** for the exact requested 27B GGUF: 11 files,
  14,199,795,689 total bytes, full download and UnixFS import SHA-256 checks,
  complete pinned manifest verification, persistent filesystem reopen, and
  131,072-byte reads crossing 2^31, 2^32 and ending exactly at EOF. Stable manifest:
  `bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q`.
  Cold import/verification took 1,763.1 s with 237,568,000-byte sampled peak RSS;
  canonical reopen/reverification took 179.5 s with 189,874,176-byte peak RSS.
  Artifact suite **30/30**. Evidence: /tmp/peercompute-qwen38-27b-final-evidence.json.
  This proves local large-file storage, not a full 14 GB browser peer transfer
  or GGUF execution. Those remain separate acceptance scopes.
- FP16 diagnosis follow-up: compare default headless Chrome, the existing Vulkan
  launch, that launch plus the isolated NVIDIA Dawn f16 override, and a minimal
  Vulkan launch. Check adapter features and request a shader-f16 device, then
  compile/dispatch/read back an actual16x16 f16 matrix multiply against exact CPU
  results, on the page and in a worker. The existing Vulkan launch lacks f16;
  adding the override passes worker arithmetic with zero error. Raw Vulkan
  reports shaderFloat16=true. Evidence: /tmp/peercompute-f16-probe.json and
  /tmp/peercompute-nvidia-vulkaninfo.txt. Browser startup can initially return a
  null adapter; the diagnostic repeats bounded adapter discovery. This small
  shader check does not replace full-model correctness or browser conformance.
  Final repeat passes on both page and worker with the override; default and
  minimal headless launches return no adapter. Catalog wording regression and
  artifact suite30/30 pass after the correction; no execution gate changed.
- New requested-model gates: verify complete pinned Qwen2B q4 ONNX external-data
  closure, per-architecture budget and actual image-based worker execution;
  import the exact 27B GGUF by streaming hash/CID with bounded memory and explicit
  quota, and independently qualify a compatible runtime before enabling execution.
  Two physical hosts, durable always-on seeds, renderer preemption and remote
  inference remain separate acceptance gates. A catalog entry, mock, or isolated
  ORT Add graph cannot close actual-model execution gates.
- Authorized GGUF implementation validation: the shared host lifecycle must keep
  CID range access alive after load, terminate the owned worker before releasing
  native residency, and retain admission/affinity on failed termination. New
  ggufService tests4/4 plus existing ONNX31/31 pass. The bounded GGUF range client
  adds12 passing tests for >4GiB offsets, cancellation, queue/credit bounds,
  truncation and host closure; pinned catalog tests3/3 pass (combined50/50).
  Engine unit tests and actual small-Qwen/27B WebGPU receipts are separate gates.
  Large-model harness should read the existing verified Node artifact store to
  avoid a redundant14GB browser copy on this machine; label that scope explicitly.
  Browser IndexedDB persistence/restart and actual peer transfer remain distinct
  from that loopback artifact-range test.
- Managed GGUF focused suite **32/32 PASS**: 12 reader, 13 native/runtime,
  4 host-service and 3 catalog tests. Native ABI tests cover mixed BigInt/Number
  arguments and null pointers; failure tests quarantine native traps and GPU
  completion errors, reject late tokens after cancellation, and retain resource
  reservations when worker termination fails. Command: `npm run test:gguf`;
  receipt `/tmp/peercompute-gguf-final-focused.log`.
- Small Qwen3.5-0.8B Q4_K_M **actual WebGPU PASS** on Chrome155/RTX5060Ti with
  the explicit NVIDIA f16 override. All 26 layers offloaded; greeting and exact
  arithmetic answer `4`, warm reuse, cooperative cancel and acknowledged unload
  with zero retained admission pass. Browser import/persistence/restart with
  the source blocked passes: 554 source requests and579,629,622 bytes total,
  unchanged across generation and restart. Evidence:
  `/tmp/peercompute-gguf-small-browser-20261103.json`. A subsequent actual-GPU
  run validates the final4MiB native read batching (256KiB wire credit), with
  10.99s load and the same inference/lifecycle gates:
  `/tmp/peercompute-gguf-small-4mib-native-20261103.json`. The latter reads the
  existing Node artifact store through a loopback range bridge; it does not
  independently establish browser persistence or network transfer.
- GGUF integration regression checkpoint: **336/337 core**, only the existing
  ULG Eshkol tensor-contract failure at serviceOrchestration.test.js:4137;
  `/tmp/peercompute-gguf-core-final.log`. The final queue-loss guard was added
  afterward and is covered by the32/32 focused pass. Static demo checks49/49,
  legacy core Webpack, all14 existing demo Vite builds, and inference Vite build
  pass. Build receipts: `/tmp/peercompute-gguf-builds/results.json`,
  `/tmp/peercompute-gguf-webpack-build.log`,
  `/tmp/peercompute-gguf-inference-final-build.log`. Existing bundle-size and
  import-splitting warnings remain.
- Exact GeoRefine27B **actual WebGPU generation PASS**:
  `/tmp/peercompute-gguf-27b-56layers-20261103.json`, finished23:26:46.591Z.
  Command: `GGUF_MODEL_ID=qwen3.8-27b-georefine-d14-gguf GGUF_ARTIFACT_MODE=external
  GGUF_GPU_LAYERS=56 GGUF_NVIDIA_F16_OVERRIDE=1 GGUF_SKIP_RESTART=1
  GGUF_EVIDENCE_PATH=/tmp/peercompute-gguf-27b-56layers-20261103.json
  node peercompute/tests/runtime/gguf-inference.mjs` (environment assignments
  belong on one shell command). Context512/batch64/threads1;143.335s load.
  First and warm requests return `Hello!` on worker-1, each with6,722 actual GPU
  dispatches/190 submissions. Arithmetic returns exactly `4`, with5,006
  dispatches/270 submissions. Offload56/66; native CPU model2,618,545,930bytes,
  GPU model11,331,226,829bytes and WASM3,579,052,032bytes. Sampled whole-device
  peak13,823MiB includes other applications; after cleanup it returns2736MiB.
  Cancellation required worker termination (not cooperative warm retention),
  then service is idle and active CPU/GPU admission leases are zero. No page,
  bridge or external-request errors. The bounded bridge served14,346,125,312
  bytes, peak one HTTP read, ≤1MiB HTTP ranges and4MiB worker buffering.
  This proves managed inference from the retained verified Node store; restart
  was explicitly skipped, and no14GB browser IndexedDB or peer transfer is
  claimed. The small-model browser restart gate above remains independent.
- Existing ONNX regression after the GGUF changes **PASS**:
  `MODEL_IDS=smolvlm-256m-q4 MODEL_EVIDENCE_PATH=/tmp/peercompute-onnx-after-gguf-20261103.json
  node peercompute/tests/runtime/model-inference.mjs`. Red and blue images
  produce the corresponding answers, with3,605/1,694 real GPU dispatches;
  cooperative cancellation, unload and source-blocked browser restart pass.
  No external requests or page errors. The owned test processes are closed.
- Final live preview **PASS**, `/tmp/peercompute-gguf-final-preview.json`:
  exact Tailnet HTTPS console, cross-origin isolation, Secret Workshop connected,
  six choices, both services idle, zero weight requests/page errors. With GPU
  disabled, GGUF load is correctly blocked while ONNX selection remains enabled;
  the machine-qualified56-layer hint is visible. Final inference production
  build passes9.12s; `/tmp/peercompute-inference-gguf-final-build.log`.

- Generic artifact tests: deterministic UnixFS/CID imports; streaming 128 MiB
  fixture and opt-in >2 GiB fixture; per-block and whole-file integrity;
  path/manifest/DAG/size bounds; ranges; resume; crash recovery; dedup; reader
  leases; pin-aware GC; cross-tab coordination; quota denial/exhaustion. Measure
  transient transport memory independently from model-loader allocations.
- Ownership/lifecycle: StateManager creates and closes the artifact service;
  inject a NetworkManager transport and verify storage recovery before serving,
  startup rollback, offline reads, and draining transfers before store closure.
- Genuine hosting: independent BrowserContexts/profiles and peer identities,
  empty receiver storage, A imports → B fetches → A closes → fresh C fetches
  from B. Block origin/public gateway fallback and assert actual IPFS serving
  counters. Pages within one context can share IndexedDB and are insufficient
  evidence. Add durable seed restart, one-provider loss, and all-providers-gone
  cases; browser cache retention does not establish durable network availability.
  Restart a browser provider from retained IndexedDB blocks, refresh its
  availability, and fetch the model from a fresh peer without loading it for
  inference or accessing HF. An unrelated cached Blob is not a serving pass.
- Model/compute: exact revision and complete variant closure, approved runtime,
  inference initialization/execution in a ComputeManager-owned worker ID,
  explicit WebGPU backend, no inline fallback or independent inference worker,
  actual WebGPU generation, second request with resident weights, cold worker/
  reload with HF and public runtime CDNs blocked, required-worker readiness,
  bounded token streams/queues and slow-consumer overflow, abort during download/
  load/generation including late load completion, unload, lease retention/renewal
  past TTL and no double-counted GPU units,
  acknowledged cancellation, hard-stop recovery, device loss, resize/preemption,
  rendering contention, and full NodeKernel shutdown. Mock/software GPU tests
  alone cannot establish hardware support or throughput.
- Remote inference: authenticated streams, selected authorized peer/model,
  backpressure, bounded parameters, deadlines, duplicate/late packets, provider
  and requester loss, explicit partial-output semantics, and no prompt/token
  content in Yjs, pubsub, public telemetry, or ordinary logs.
- Release: nested-path Vite worker/WASM closure, local pinned runtime assets,
  cache/fetch policy, adapter range/HEAD behavior where exposed, a non-LLM file
  consumer, NetViz artifact/model state, and bounded loss/latency/churn tests.
  Existing core artifact/service/worker/network tests, Multiscale worker builds,
  and changed demo/static-release checks remain regression gates. Revisit the
  historical Eshkol failure explicitly; do not relabel it as passing.
- Planning-only validation: source/reference review, relative-link checks,
  preserved instructions/history, `git diff --check`, and ICC guard. No runtime
  tests or performance claims are implied by this documentation acceptance.

### Repository survey baseline - 2026-09-14 AKDT

- Scope: run existing deterministic Node and static-release gates against
  `aaa729ebd8330a1f73263948a38fb098f633f246` on Node `v24.18.0` while surveying
  the roadmap. No application code changed. Distinguish this baseline from
  browser/WebGPU/network/scientific acceptance and historical release results.
- `npm --prefix peercompute run test:unit`: FAIL, 213/214 pass, zero skipped.
  `serviceOrchestration.test.js`'s staged Eshkol tensor-runtime candidate reads
  JSON/WASM from the sibling ULG checkout. The adapter reports changed-byte and
  output-tensor mismatch; a read-only reproduction confirms 16 changed bytes
  versus 64 declared and different closure/residual outputs. Keep this failure
  visible until the producer/fixture/consumer contract is reconciled.
- `npm --prefix demos/multiscale test`: PASS 206/206, including its temporary
  production worker build/import-closure test.
- Earth/game commands PASS: `npm run test:geo-core` 87/87;
  `npm run test:geodata` 60/60; `npm run test:earth` 48/48;
  `npm run test:wxglobe` 28/28; `npm run test:xr` 24/24;
  `npm run test:physics` 54/54; `npm run test:traffic` 12/12;
  `npm run test:motorcycle` 117/117. Combined: 430/430.
- `npm run test:backend`: PASS 24/24, including static demo-release checks.
- Total: 873 passed, one failed, zero skipped across 874 tests / 11 commands.
  Raw command output and the diagnostic probe remain outside the repository in
  `/tmp/peercompute-survey-20260914-*`.
- NOT RUN: aggregate builds, mocked browser XR, runtime smoke/P2P, actual WebGPU
  execution, external live-source/private-HTTPS checks, chaos matrices, physical
  headset checks, and scientific reference validation. Historical evidence
  below is not a fresh pass for these gates.
- Documentation-only acceptance: inspect source-backed claims, preserve prior
  instructions/history, validate new relative links, run `git diff --check`,
  and inspect the ICC guard. A documentation commit does not close the failing
  application baseline. See [survey](reports/2026-09-14-project-state-survey.md).

### Earth platform, geodata, motorcycle, and WebXR gate - 2026-08-23 AKDT

- `services/geodata` pure/inject tests must cover strict bbox latitude/order/
  axis/area/dateline bounds, deterministic injection-safe Overpass queries,
  fixed URL validation, redirect/content-type/body/timeout/abort limits,
  semaphore admission, identical-request coalescing, LRU/error eviction,
  visible stale-if-error, exact-origin CORS, rate limiting, ETag/304, security
  headers, and secret-/coordinate-free public health/errors.
- OSM fixture tests must distinguish shared-node junctions from coordinate-only
  crossings; cover `oneway=yes/-1`, roundabout and motorway implications,
  motorcycle/motor-vehicle/vehicle/access hierarchy, surface, bridge, tunnel,
  layer, lane and mph/kmh normalization, restriction relations, multipolygon
  holes/parts, and every reported/derived/clamped building-height path. Graph
  or topology caps fail the region; they never silently produce a partial
  drivable graph.
- `packages/geo-core` keeps all existing WXGlobe terrain/material tests green
  and adds Shortbread MVT decode/projection/style/tile-boundary/LRU tests,
  local ENU/rebase math, source envelopes, building style normalization, and
  nowCOAST capabilities/time descriptor cases.
- Earth browser tests use deterministic source fixtures plus explicit bounded
  live opt-ins. They require a current rendered terrain frame, roads,
  buildings, visible OSM/terrain/weather attribution, geolocation success and
  denial fallback, generation-safe aborts, stale-scope teardown, and truthful
  degraded states. One opt-in live gate covers Shortbread TileJSON/tile, a tiny
  Overpass bbox, nowCOAST capabilities, and NOAA/AWS terrain.
- Particle-rigid tests cover particle-cloud COM/full inertia tensor and
  parallel-axis math, inverse-inertia rotation, contact velocity/torque
  regressions, surfaced grid overflow, hinge/prismatic/spring limits,
  suspension sag/travel, gyroscopic wheel behavior, Coulomb/tire friction
  ellipse, acceleration/braking/grip/breakaway, swept collision/two-metre
  landing, finite
  state, snapshot/reset, fixed-step accumulation, and duplicate long-run CPU
  state hashes.
- Motorcycle road tests cover the exact rendered flat/slope/center-spike and
  projected triangle-seam surfaces, local
  ENU origin-rebase continuity, OSM road graph placement, traffic one-way/lane
  behavior, seeded traffic determinism, traffic impulse transfer, first/third
  person camera state, and the normalized control frame.
- WebXR/input tests mock sessions, input sources, live gamepads, controller
  addition/removal, handedness, `xr-standard` axes/buttons, target-ray vs grip,
  select/squeeze edges, held actions, session enter/exit/restoration, DOM-
  overlay absence/presence, layer opt-in, in-scene ray/poke UI, and idempotent
  teardown. Desktop and multi-touch adapters must produce the same normalized
  actions as XR.
- Motorcycle browser smoke covers keyboard, pointer lock, mocked mobile
  multi-touch, mocked normalized XR controllers, first/third-person switching,
  geolocation permission/denial, real-road region load, visible attribution,
  particle wheel/suspension telemetry, traffic collision, reset/rebase, stale
  async request suppression, and failure recovery. A real-headset gate remains
  manual and must record headset/browser/runtime details.
- RoadVector overview tests cover north-up WGS84 projection, hemisphere camera
  orientation, z5 dateline/pole tile selection and 25-tile caps, bounded ETOPO
  decoding, Shortbread major-road filtering/byte/vertex bounds, discrete
  overview-to-meter-scale transition, and paused physics before entry. Presence
  tests prove fallback privacy, 0.1° quantization, stale/invalid/capped peer
  rejection, fixed-red rendering, nonfatal relay failure, and a genuine
  two-browser PeerCompute discovery check on the private Tailnet candidate.
- Release tests must add the two workspaces/ports/build outputs/gallery cards,
  prove nested-path assets and Cesium notices, traverse generated imports, and
  leave all test browsers/servers/temporary directories stopped. The full
  chaos lab is not a substitute for these focused deterministic and real-data
  gates.

### Latest executed Earth platform evidence - 2026-08-23 AKDT

- Runtime: Node `v24.18.0` on Kubuntu 24.04.
- PASS: `npm run test:earth-platform:unit`. It completed `229` Node tests plus
  the mocked Chromium XR harness: geo-core `23/23`, geodata `44/44`, EarthGrid
  `27/27`, preserved WXGlobe `26/26`, shared XR `21/21`, particle/motorcycle
  physics `32/32`, synthetic traffic `12/12`, and RoadVector `44/44`.
- PASS: `npm run test:earth-platform:release`. It rebuilt WXGlobe, EarthGrid,
  and RoadVector; passed static port/release checks `44/44`; then passed the
  combined built-doc browser smoke for `wxglobe,earth,motorcycle` on test-owned
  HTTPS port `43947`. The runner removed its browser/server state afterward.
- Current built entries are WXGlobe `index-C2CjCt9q.js`, EarthGrid
  `index-DNakLoHI.js`, and RoadVector `index-R_rjvp_J.js`. Cesium runtime and
  third-party notices are present beneath both Cesium demo outputs.
- PASS: `npm run test:earth-platform:live` at
  `2026-08-24T02:52:01Z`–`02:52:05Z`. The bounded gate decoded a `38,983`-byte
  Shortbread z14 tile (`515` streets, `1` building); normalized a
  `267,281`-byte tiny Overpass response (`172` roads, `100` buildings, `705`
  directed edges, first attempt); accepted `132` nowCOAST times with a current
  latest frame aged `7.08` minutes; decoded `16` finite ETOPO samples from
  `13`–`19` m; and fetched a `69,200`-byte AWS Terrarium tile.
- PASS: live, headless gallery captures use the real local service rather than
  committed fixtures. EarthGrid shows NOAA/Shortbread/nowCOAST live plus
  `1,500` rendered local roads and buildings; RoadVector shows a current
  `1,665`-road / `1,894`-building source region, capped visibly to `5,000` road
  segments and `1,500` buildings.
- PASS: `npm audit --prefix services/geodata --omit=dev` reported zero
  vulnerabilities. `git diff --check` and focused syntax checks passed.
- FIXED DURING GATING: malformed deterministic error fixtures, stale generated
  bundles, a direct origin-rebase test that bypassed runtime coordination,
  response-cap retry classification, fixed-date weather expiry, transient
  public Overpass connect failure (bounded retry), fixture-only gallery
  captures, and RoadVector's documented production same-origin environment
  modes. Failed attempts were discarded and are recorded in `plan/log.md`.
- NOT RUN: a physical headset enter/exit/re-enter, controller/hand/haptics,
  comfort, and performance pass. Automated XR is not physical-headset
  certification. Full chaos-lab and unrelated multiplayer matrices were not
  required for this focused slice.
- EXTERNAL HANDOFF BLOCKER: Tailscale reports no Serve configuration and this
  node's HTTPS certificate feature is not enabled. The loopback candidate is
  verified, but no Tailnet URL is valid until the one-time Serve admin action
  is completed and the exact HTTPS origin is re-probed.

### Latest RoadVector hemisphere/presence evidence - 2026-08-23 AKDT

- Runtime: Node `v24.18.0` on Kubuntu 24.04.
- PASS: `npm run test:earth-platform:unit`. It completed `241` Node tests plus
  the mocked Chromium XR harness: geo-core `23/23`, geodata `44/44`, EarthGrid
  `27/27`, WXGlobe `26/26`, shared XR `21/21`, particle/motorcycle physics
  `33/33`, synthetic traffic `12/12`, and RoadVector `55/55`.
- PASS: `npm run test:earth-platform:release`. It rebuilt WXGlobe
  `index-C2CjCt9q.js`, EarthGrid `index-DNakLoHI.js`, and RoadVector
  `index-BJ47J1jP.js` plus `NetworkManager-BwEpE1-w.js`; static port/release
  checks passed `44/44`; the combined deterministic built-browser smoke for
  all three demos passed on test-owned HTTPS port `43947`, which closed during
  cleanup.
- The built RoadVector smoke proves startup browser geolocation, paused
  hemisphere mode, current bounded relief/road fixtures, the explicit ride
  transition, `D/+1 -> physical steering target < 0` and `A/-1 -> target > 0`,
  metric source state, real-road game load, physical traffic impact, controls,
  reset/rebase, failure clearing, generation replacement, and denial fallback.
- PASS: exact direct Tailnet live proof at
  `https://100.68.165.52:5188/` with two independent Chrome contexts. Both
  reported `isSecureContext=true`, auto-selected `browser-geolocation`, stayed
  in overview with physics frame `0`, decoded one `257×129` / `70,451`-byte
  live ETOPO hemisphere, loaded the bounded 25-tile / `3,553,031`-byte
  Shortbread window (`217` major roads / `527` vertices), and discovered the
  other genuine PeerCompute peer. Each published only coarse
  `[-149.9, 61.2]` at `0.1°`; each rendered one fixed-red remote marker; console
  and page-error arrays were empty. The refreshed gallery capture is
  `docs/assets/motorcycle.png`.
- FIXED DURING GATING: the aggregate release smoke originally left WXGlobe on
  live NOAA and timed out in `connecting`; the ordinary release now installs
  the existing deterministic NOAA fixture for WXGlobe while the explicit
  `WXGLOBE_REQUIRE_LIVE_TERRAIN=1` path still reaches real NOAA. Auto-location
  then exposed an obsolete smoke assertion that compared source labels; the
  corrected test proves the actual world-generation counter advances. Both
  failed attempts were followed by focused passes and the final aggregate pass.
- SUPERSEDES the historical Serve blocker above: the user explicitly selected
  direct private-IP HTTPS. The retained service listens only on Tailnet IP
  `100.68.165.52:5188`, proxies `/api` to loopback `8788`, and uses an
  environment-owned IP-SAN self-signed development certificate. No Serve,
  Funnel, public tunnel, or terminal-browser pane is involved. A headset must
  accept or trust that certificate.
- NOT RUN: a physical headset enter/exit/re-enter, controller/hand/haptics,
  comfort, and performance matrix. The direct URL is ready for the user's
  manual run, but no hardware certification is claimed.

### Latest FHWA, NURBS, and terrain-safe camera evidence - 2026-08-24 AKDT

- Runtime: Node `v24.18.0` on Kubuntu 24.04.
- PASS: `npm run sync:federal-highways`. The bounded official refresh validated
  USDOT/BTS item/layer identity, live version `2025.08.08`, all 492,005 DBF
  rows carrying that exact version, the six-member archive allowlist, expanded
  resource limits, and the exact 104,773,728-byte archive SHA-256
  `b5e4969919953bf4f0cd38c1582bd9314e0c26a1e937e35ee7a2392a1e6c3069`.
  It regenerated 1,028 tiles / 2,468,431 bytes from 464,449 simplified points;
  the largest tile is 47,196 bytes. Two earlier bounded attempts failed on a
  transient export timeout; the downloader was corrected to distinguish the
  connection/header timeout from the capped five-minute archive stream and
  retry only transient status/timeout failures. Failed scratch directories
  were removed after the successful atomic replacement.
- PASS: `npm run test:earth-platform:unit`. Counts are geo-core `29/29`,
  geodata `44/44`, EarthGrid `27/27`, WXGlobe `28/28`, shared XR `22/22`,
  particle/motorcycle physics `33/33`, traffic `12/12`, and RoadVector `64/64`
  (`259` Node tests plus the mocked Chromium XR browser harness).
- PASS: `npm run test:earth-platform:release`. Fresh production builds are
  WXGlobe `index-CpLdGMun.js`, EarthGrid `index-BD3Q_QDG.js`, and RoadVector
  `index-pUsf9pMm.js` plus `NetworkManager-Bw1A5fZg.js`; static port/release
  checks passed `44/44`, followed by combined built HTTPS smoke for
  `wxglobe,earth,motorcycle` on test-owned port `43947`. The browser/server
  closed after the run.
- PASS: `npm run test:earth-platform:live` from
  `2026-08-24T18:48:52Z` through `18:49:08Z`: Shortbread 38,983 bytes / 515
  streets / one building; Overpass 267,281 bytes / 172 roads / 100 buildings /
  705 directed edges after one bounded retry; nowCOAST 101 times with the
  latest frame current at 7.93 minutes old; ETOPO 16 finite samples from 13 to
  19 m; and Terrarium 69,200 bytes.
- PASS: direct private HTTPS probes returned 200 for both app roots,
  same-origin catalogs, Cesium workers, and the FHWA manifest. Headless Chrome
  reported `isSecureContext=true` at both origins. RoadVector loaded 1,665
  source roads, current FHWA coverage with Alaska, 14 drawn federal commands,
  transparent NURBS terrain, exactly 13 bike/rider curves, zero default dense
  particles, and finite first-/third-person terrain clearances. EarthGrid
  reached ready with NOAA and Shortbread live. The current gallery RoadVector
  capture is the real private-source overview, not a fixture.
- PASS: `git diff --check` and focused syntax checks. Root
  `npm audit --omit=dev --json` remains non-clean with 21 pre-existing
  production-tree advisories (1 critical, 12 high, 3 moderate, 5 low); no
  broad dependency `audit fix` was attempted. The isolated geodata service's
  prior audit remains clean.
- NOT RUN: physical headset enter/exit/re-enter, controller/hand/haptics,
  comfort, and performance matrix. The direct HTTPS RoadVector link is ready
  for this manual user test; automated XR is not called hardware certification.

### WXGlobe whole-planet terrain gate - 2026-08-22 AKDT

- Pure Node tests cover NOAA ETOPO 2022 signed little-endian BIP decoding,
  optional MSB-first validity masks, exact mosaic pinning, half-post padding,
  pole/dateline repair, bounded same/cross-level boundary canonicalization,
  native z6 request availability, terminal child masks, telemetry, retry/
  cancellation classification, and persistent root-failure diagnostics.
- Pure Node tests cover AWS Terrarium RGBA decoding, fractional and negative
  heights, public US S3 XYZ URLs, a cached symmetric 3 × 3 halo resampled into
  257 endpoint posts, exact neighboring edges, stale-rejection LRU safety,
  native z15 request availability, terminal masks, retries, aborts, telemetry,
  and asynchronous failure classification.
- Material tests require opaque black base terrain plus Cesium
  `ElevationContour` in neon green and prove contour interval/width can update
  without recreating the globe. Contour ink must be suppressed on the exact
  skirt texture boundary so vertical crack guards do not render as meridians.
- Static release gates keep the root workspace, port `5186`, both dev
  launchers, build order, docs card, imagery-free Viewer configuration, retired
  weather dependency exclusions, and production docs output wired.
- The generated artifact gate requires
  `cesium/{Workers,ThirdParty,Assets,Widgets}` plus Cesium `LICENSE.md` and
  `ThirdParty.json` beneath `docs/wxglobe`, rejects a hoisted `node_modules`
  segment and domain-root asset URLs, and inspects the hashed entry bundle for
  the capped-provider, deep-success telemetry, and abortable-retry paths.
- Focused built-doc runtime command:
  `RUNTIME_SMOKE_DEMOS=wxglobe WXGLOBE_REQUIRE_LIVE_TERRAIN=1 WXGLOBE_REQUIRE_AWS_TERRAIN=1 DOCS_HOST=127.0.0.1 DOCS_PORT=43910 DEMO_WAIT_MS=3000 DEMO_READY_TIMEOUT_MS=90000 node demos/tests/runtime-smoke.mjs`.
  It must observe a current-generation rendered NOAA frame, zero imagery,
  settled tiles, positive and negative heights, no terminal failures, then a
  successfully loaded AWS z15 257-post tile with child mask zero and stable
  request counters, followed by a newly rendered NOAA generation.
- `RUNTIME_SMOKE_DEMOS` must reject unknown names before opening a server or
  browser; `RUNTIME_SMOKE_DEMOS=wxglob ...` is the negative regression.
- Manually inspect the whole-Earth NOAA view and a close AWS Mariana view in a
  real browser. This is a focused terrain/network validation, not a chaos-lab
  run.
- PASS: `npm --prefix demos/wxglobe test` passed `26/26` under Node
  `v24.18.0`.
- PASS: `node --test demos/tests/demo-ports.test.js
  demos/tests/demo-release.test.js` passed `40/40`; `npm run test:backend`
  passed `23/23`.
- PASS: final `npm run build` regenerated PeerCompute plus all 12 demos and
  copied 389 Cesium runtime files plus two notice files into
  `docs/wxglobe/cesium`. Expected existing
  circular-chunk, bundle-size, and PlanetGen renderer warnings were non-fatal.
- PASS: full built-doc runtime smoke loaded all nine harness demos. The focused
  live-source command passed NOAA, switched the same page to AWS Terrarium,
  loaded and validated a real z15 terminal tile, observed negative and positive
  heights, stabilized all logical/source counters, retained zero imagery, and
  returned to a later NOAA generation with zero terminal failures.
- PASS: generated config validation covered 12 demos / 24 public+docs config
  pairs with production WSS, STUN, TURN UDP/TCP, and HTTPS source URLs.
- PASS: visually inspected 1440x900 NOAA whole-Earth and close AWS Mariana
  views; the post-repair gallery frame no longer contains the false straight
  prime-meridian contour drawn by Cesium heightmap skirts.
- NOT RUN: full chaos lab, because this standalone non-P2P demo only requires
  the focused terrain, generated-site, and existing-demo regression gates.

### ULG release and production backend gate - 2026-08-21 AKDT

- Required-worker unit coverage must prove the default optional-worker path
  still validates task payloads before initialization and retains inline
  fallback, while opt-in required-worker mode admits every current worker's
  real `ready` acknowledgement and fails closed on unavailable construction,
  partial-pool constructor failure, startup and scale-up handshake timeout,
  concurrent submission before admission, and active/queued worker loss.
  Resize retirement, zero-target clamping, destroy/reinitialize, and late
  callbacks from removed workers must not poison a healthy or replacement pool.
- NodeKernel coverage must prove `requireWorkers` and
  `workerBootstrapTimeoutMs` reach `ComputeManager`, and that initialization
  failure disconnects/destroys already-created managers instead of leaving a
  partially initialized kernel behind.
- Multiscale worker-build coverage must execute the custom worker protocol,
  resolve production solver descriptor URLs, build into a test-owned temporary
  directory, require the stable qgrid/qmat/ULG module filenames, traverse every
  emitted relative import, import the built task modules, and observe the built
  worker readiness acknowledgement.
- The generated release gate must require every demo and docs fallback config
  to advertise the production WSS peer plus STUN and authenticated TURN UDP/TCP,
  every source config to point at the production HTTPS runtime config, and every
  generated HTML/module reference to resolve locally.
- Production backend verification is a focused operational gate, not a chaos
  run: check HTTPS config status/CORS, WSS upgrade, IPv4/IPv6 STUN binding,
  authenticated TURN allocation over UDP/TCP, public listeners, and a two-page
  relay-only CubeChat media path. Remote service mutation additionally requires
  verified administrative access, a pre-change snapshot, and a rollback path.

### Planned root-node validation

- Root node work is tracked in `plan/root-node-todo.md`.
- The first implementation slice should add Deno unit tests for root schemas,
  identity/signing, session registry, leases, policy revisions, storage
  adapters, sync admission, checkpoints, and replay manifests.
- Browser contract tests should prove a `RootAuthorityClient` can fetch a local
  Deno root bootstrap manifest, connect over WebSocket, receive a root lease,
  apply a root scheduler policy without breaking non-root demos, and export an
  admitted namespace checkpoint from `StateManager`.
- Integration tests should spawn a local Deno root plus local relay, join two
  headless browser peers into one root-managed session, verify matching root
  policy revision/lease terms, ingest at least one warm delta into the root
  journal, checkpoint the session, and restore after root restart.
- Security tests should reject stale lease terms, unadmitted namespaces, invalid
  hashes, unsigned/invalid policy updates, disallowed origins, and repeated bad
  WebSocket messages.
- Root-node integration must use test-owned Deno/relay/TURN processes and shut
  them down after each run.

### Current focused result - 2026-08-21 AKDT

- Scope: repair the proven SneakyWoods/CubeChat nested-namespace observer race,
  make CubeChat application media honor configured ICE/TURN, and remove false
  NodeKernel warnings for provider-owned Yjs sync messages. The full chaos lab,
  full ordered demo matrix, and live three/four-peer production soak were not
  run.
- PASS: `node --test peercompute/tests/stateManager.unit.test.js` passed `8/8`,
  including deterministic concurrent-map loss, stale-key removal, winning-map
  replay, later writes, unsubscribe, root deletion/recreation, and callback-
  reentrant writes.
- PASS: a read-only adversarial 40-seed x 250-transition StateManager stress
  probe completed 10,000 checked namespace transitions with observer caches
  always equal to the active Yjs map.
- PASS: `node --test demos/cubechat/src/p2p/rtcConfig.test.js` passed `5/5`;
  direct/nested ICE, TURN credentials, RTC policies, invalid entries, legacy
  `url`, and Google-STUN fallback are covered.
- PASS: after the release worker additions, `npm --prefix peercompute run
  test:unit` passed `204`, skipped `1`, and failed `0`; `npm --prefix
  demos/multiscale test` passed `206/206`; `npm run test:backend` passed
  `23/23`.
- PASS: final `npm run build` completed under Node `v24.18.0` for PeerCompute
  and all twelve demos. Existing circular-chunk, large-bundle, and PlanetGen
  `WebGL1Renderer` warnings remain non-fatal.
- PASS: all 24 demo/docs relay fallback/source pairs have production WSS,
  gossipsub, STUN, authenticated TURN UDP/TCP, and the production HTTPS runtime
  config URL. An 18-HTML-entry traversal reached 83 local files across 135
  HTML/import/new-URL edges with zero missing or escaping references.
- PASS: Multiscale's production build emits stable, import-closed worker/task
  entries. The worker-build regression now parses every emitted JavaScript
  module with `es-module-lexer` and rejects relative imports outside or missing
  from the build root.
- PASS: `node demos/tests/runtime-smoke.mjs` loaded all nine built-doc harness
  demos. The focused built-doc `cubechat,sneakywoods` P2P run passed the full
  two-page interaction assertions against a test-owned local relay.
- PASS: fresh temporary CubeChat and SneakyWoods Vite production builds
  completed. `RUNTIME_P2P_DOCS_ROOT` let the browser gate consume those builds
  without mutating the already-dirty tracked `docs/` tree.
- PASS: three clean isolated SneakyWoods two-page runs completed against
  dynamic local Go relays with both pages present, visible canvas, simulated
  movement, and opposite-page movement observation.
- PASS: three CubeChat two-page direct-path runs covered peer discovery, remote
  camera/audio, data channels, movement in both directions, A-to-B moon and
  B-to-A jungle theme/state/UI convergence, room-directory entries in both
  directions, screen share, and remote track delivery.
- PASS: test-owned loopback coturn with `--allow-loopback-peers` and
  `iceTransportPolicy=relay` carried the CubeChat application media path over
  TURN UDP and TURN TCP in separate runs. On both pages the selected pair was
  succeeded, both candidate types were `relay`, sent/received byte counters
  were positive, and the local relay protocol matched UDP or TCP.
- PASS: all focused browsers, relays, coturn, listeners, and temporary build
  output were stopped or removed. The dependency-only user-space coturn
  extraction from the preceding audit remains outside the repository.
- PASS at the native backend boundary: production config/CORS, apex WSS,
  IPv4/IPv6 STUN binding, and authenticated TURN UDP/TCP relayed-packet probes
  all succeeded.
- PASS after host repair at the production browser boundary: packet-header-only
  capture first proved Chrome Allocate requests and coturn replies crossed the
  network, while a sanitized raw response inspection showed the service was
  answering anonymous Allocate without the fingerprinted long-term-credential
  challenge expected by the advertised runtime config. After installing the
  matched coturn configuration, an independent Chrome 151 RTCPeerConnection
  gathered relay candidates over numeric IPv4 TURN/UDP and TURN/TCP and over
  the combined DNS configuration without error `701`.
- PASS: final built-doc CubeChat ran two pages with application media forced to
  `iceTransportPolicy=relay` against production TURN. On both pages the
  application PC was connected, ICE was connected, the selected pair was
  succeeded, both candidate types were `relay`, and selected-pair sent/received
  byte counters were positive. The existing interaction gate also covered
  bilateral media, movement, theme/directory convergence, and screen share.
- OPEN: the known live four-peer CubeChat convergence regression remains a
  separate production gate; the full chaos lab and full ordered demo matrix
  remain intentionally unrun.

### Current focused result - 2026-06-18 AKDT
- Multiplayer interaction validation with independent browser pages, local
  coturn STUN/TURN/ICE on `127.0.0.1:34790`, dynamic local PeerCompute Go
  relays, fake camera/microphone, and fake display stream:
  - Report:
    `plan/reports/2026-06-18-multiplayer-interaction-report.md`.
  - Test harness strengthened in `demos/tests/runtime-p2p.mjs` using Chaos
    Lab's behavior profiles and the demos' bot-bridge snapshots.
  - PASS: CubeChat two-page local media, remote media, fake screen-share,
    simulated movement input, canvas display, and remote moved-position
    propagation.
  - PASS: Hyperborea two-page local relay connection, canvas display,
    simulated movement input, and remote moved-position propagation.
  - PASS: SneakyWoods two-page local relay connection, canvas display,
    simulated movement input, HUD player count, and remote moved-position
    propagation.
  - PASS: DaddyGo two-page local relay connection, canvas display, obstacle
    toggle input, and bidirectional global high-score propagation.
  - PASS: NetViz attach from a live CubeChat source tab, relay connection,
    peer topology status, and topology canvas display.
  - PASS: `npm --prefix net-chaos-lab run test:behavior` passed `13/13`.
  - FAIL: full ordered `npm run test:runtime:p2p` still closes the shared
    browser context around the Hyperborea-to-SneakyWoods transition.
  - FAIL: `RUNTIME_P2P_DEMOS=hyperborea,sneakywoods` also closes the browser
    context during SneakyWoods simulated input after Hyperborea has completed.
  - CONCERN: repeated local browser sweeps exhausted even the widened coturn
    relay port range `50200-50499`; long soak runs need a much larger TURN
    allocation range or more aggressive allocation cleanup.

### Current focused result - 2026-06-18 AKDT
- ULG/demo regression sweep with local coturn STUN/TURN/ICE on
  `127.0.0.1:34790` and dynamic local PeerCompute Go relays:
  - Report:
    `plan/reports/2026-06-18-ulg-demo-regression-report.md`.
  - PASS: `npm --prefix peercompute run test:unit` passed `187/187`.
  - PASS: `npm run test:backend` passed `20/20`.
  - PASS: `npm --prefix demos/planetgen test`.
  - PASS: `npm --prefix demos/multiscale test` passed `203/203`.
  - PASS: `npm --prefix demos/schrodinger test` passed `20/20`.
  - PASS: `npm --prefix net-chaos-lab run test:behavior` passed `13/13`.
  - PASS: `npm run build:all` completed with existing bundle/chunk/import
    warnings.
  - PASS: non-P2P runtime docs smoke loaded Hyperborea, CubeChat,
    SneakyWoods, DaddyGo, PlanetGen, Universes, Fano Reactor, and WebGpuPhys.
  - PASS: NetViz session smoke after starting a local docs server.
  - PASS: relay-backed ULG handoff with local ICE reached `handoff-ready`,
    service envelope ready, dispatch adapters ready, and two connected
    Multiscale peers.
  - PASS: WebGpuPhys `test:headless`, `test:ppf`, and `test:ppf-contact`
    after the harness was updated to use system Chrome when needed.
  - FAIL: DaddyGo P2P score/state sync times out after the full ordered P2P
    demo matrix, while DaddyGo alone and SneakyWoods plus DaddyGo pass.
  - FAIL: direct ULG browser handoff times out waiting for the Multiscale popup
    to reach `getScenarioHandoffReadiness().status === "handoff-ready"`.
  - FAIL: Multiscale visual smoke reports the Na/Cl live append as 17 atoms
    but only 10 bonds, so the NaCl pair did not propagate into packet state.
  - FAIL: Multiscale live remote placement reaches dispatch-ready policy but
    remote execution/admission fails with `quorum-mismatch`.
  - CONCERN: Multiscale performance probe passed but averaged about `4.29`
    FPS with all sampled frames above 100 ms.
  - BLOCKED: PeerCompute Playwright/direct-path suite is fixed to port `5173`,
    which was occupied by the live ULG target for this sweep.

### Current focused result - 2026-06-17 AKDT
- NodeKernel local hot-buffer refresh from remote resident-stage admission:
  - `node --check` passed for
    `peercompute/src/peercompute/nodeKernel/NodeKernel.js`,
    `peercompute/src/peercompute/index.js`, and
    `peercompute/tests/unit/nodeKernel.start.test.js`.
  - `node --test peercompute/tests/unit/nodeKernel.start.test.js` passed
    `17/17`.
  - Coverage: an admitted remote GPU resident stage metadata record can drive
    `peercompute.nodekernel.remote-gpu-resident-stage-hot-buffer-refresh.v0`
    only through a local refresh executor and local ComputeManager GPU lane
    lease. The test proves the lease carries remote refs as source metadata,
    completes only with executor-returned local refs, commits a refresh warm
    delta, and keeps `remoteRetainedRefsUsableLocally=false`.

### Current focused result - 2026-06-17 AKDT
- NodeKernel remote GPU resident stage result metadata admission:
  - `node --check` passed for
    `peercompute/src/peercompute/nodeKernel/NodeKernel.js`,
    `peercompute/src/peercompute/index.js`, and
    `peercompute/tests/unit/nodeKernel.start.test.js`.
  - `node --test peercompute/tests/unit/nodeKernel.start.test.js` passed
    `16/16`.
  - Coverage: a remote GPU resident stage execution result with compact
    candidate metadata can be recorded through
    `peercompute.nodekernel.remote-gpu-resident-stage-result-admission.v0`
    into StateManager warm deltas only after a remote result preflight and
    allowed state-family check. The admitted record preserves remote retained
    refs as nonlocal metadata with `remoteRetainedRefsUsableLocally=false` and
    `localHotBufferRefreshRequired=true`.

### Current focused result - 2026-06-17 AKDT
- NodeKernel GPU resident stage execution authority:
  - `node --check` passed for
    `peercompute/src/peercompute/nodeKernel/NodeKernel.js`,
    `peercompute/src/peercompute/index.js`, and
    `peercompute/tests/unit/nodeKernel.start.test.js`.
  - `node --test peercompute/tests/unit/nodeKernel.start.test.js` passed
    `15/15`.
  - Coverage: local GPU resident stage execution wraps
    `ComputeManager.executeGpuResidentLaneStagePlan()` with
    `peercompute.nodekernel.gpu-resident-stage-execution-authority.v0`.
    Non-advisory distributed execution uses only a validated resident-stage
    executor, emits
    `peercompute.nodekernel.remote-gpu-resident-stage-execution-request.v0`,
    and records returned remote retained refs as
    `remote-resident-stage-result-received-not-admitted` with
    `remoteRetainedRefsUsableLocally=false` and
    `localHotBufferRefreshRequired=true`.

### Current focused result - 2026-06-17 AKDT
- NodeKernel GPU resident stage placement executor contract:
  - `node --check` passed for
    `peercompute/src/peercompute/nodeKernel/NodeKernel.js`,
    `peercompute/src/peercompute/index.js`, and
    `peercompute/tests/unit/nodeKernel.start.test.js`.
  - `node --test peercompute/tests/unit/nodeKernel.start.test.js` passed
    `13/13`.
  - Coverage: non-advisory distributed GPU resident stage placement remains
    fail-closed without an executor. A registered executor reports
    `distributed-resident-stage-placement-executor-ready` only when its
    `peercompute.nodekernel.gpu-resident-stage-placement-executor-contract.v0`
    declares GPU resident stage capability, metadata-only nonlocal retained
    refs, NodeKernel/StateManager authority, and cache admission requirements.
    An invalid executor contract still throws
    `ERR_NODEKERNEL_DISTRIBUTED_GPU_RESIDENT_STAGE_PLACEMENT_UNAVAILABLE`
    with detailed contract failures and no local ComputeManager preflight.

### Current focused result - 2026-06-17 AKDT
- NodeKernel GPU resident stage placement authority preflight:
  - `node --check` passed for
    `peercompute/src/peercompute/nodeKernel/NodeKernel.js`,
    `peercompute/src/peercompute/index.js`, and
    `peercompute/tests/unit/nodeKernel.start.test.js`.
  - `node --test peercompute/tests/unit/nodeKernel.start.test.js` passed
    `11/11`.
  - Coverage: local GPU resident stage preflight wraps the ComputeManager
    preflight with
    `peercompute.nodekernel.gpu-resident-stage-placement-preflight.v0`;
    advisory distributed requests record local fallback; non-advisory
    distributed resident stage placement fails closed with
    `ERR_NODEKERNEL_DISTRIBUTED_GPU_RESIDENT_STAGE_PLACEMENT_UNAVAILABLE`
    before any local ComputeManager preflight runs.

### Current focused result - 2026-06-17 AKDT
- ComputeManager GPU resident lane placement preflight:
  - `node --check` passed for
    `peercompute/src/peercompute/computeManager/GpuResidentLaneManager.js`,
    `peercompute/src/peercompute/computeManager/ComputeManager.js`,
    `peercompute/src/peercompute/index.js`, and
    `peercompute/tests/unit/gpuResidentLaneManager.test.js`.
  - `node --test peercompute/tests/unit/gpuResidentLaneManager.test.js` passed
    `10/10`.
  - Coverage: `ComputeManager.preflightGpuResidentLaneStagePlacement()`
    reports `peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0`
    before execution, using the same explicit dependency batches and
    state-family conflict deferrals as the stage executor. The test proves the
    report includes GPUHub executor sources, Worker residency status, worker
    ready/fallback counts, missing-executor counts, placement batches, and max
    concurrent stage count.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs` passed
    `16/16`, proving ULG mechanics telemetry records the preflight for both
    mechanics-only and pressure/thermal/reaction Worker-ready stage chains.
  - Cross-repo ULG behavior/visual gates:
    `npm run test:physics-atomics` passed `11` checks with `3` expected
    opt-in skips, and visual matrix
    `codex-stage-placement-preflight-20260617` passed three rows with
    `failedCount=0`.

### Current focused result - 2026-06-17 AKDT
- GPU resident lane state-family conflict batching:
  - `node --check` passed for
    `peercompute/src/peercompute/computeManager/GpuResidentLaneManager.js` and
    `peercompute/tests/unit/gpuResidentLaneManager.test.js`.
  - `node --test peercompute/tests/unit/gpuResidentLaneManager.test.js` passed
    `9/9`.
  - Coverage: explicit dependency plans now apply a
    `defer-read-write-conflicting-ready-stages` policy. A ready stage that
    reads a family another ready stage writes is deferred to a later batch; the
    execution report records conflict type, affected families, blocker stage,
    and batch index. The test also preserves the important distinction that
    conflict deferral orders stages but does not create an implicit `inputFrom`
    data dependency.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs` passed
    `16/16`, proving ULG mechanics stage-chain telemetry records the conflict
    policy with zero deferrals for the current non-conflicting P2G plus
    pressure/interface batch.
  - Cross-repo ULG behavior/visual gates:
    `npm run test:physics-atomics` passed `11` checks with `3` expected
    opt-in skips, and visual matrix
    `codex-state-family-conflict-batching-20260617` passed three rows with
    `failedCount=0`.

### Current focused result - 2026-06-17 AKDT
- GPU resident lane dependency batches:
  - `node --check` passed for
    `peercompute/src/peercompute/computeManager/GpuResidentLaneManager.js` and
    `peercompute/tests/unit/gpuResidentLaneManager.test.js`.
  - `node --test peercompute/tests/unit/gpuResidentLaneManager.test.js` passed
    `8/8`.
  - Coverage: resident stage plans now preserve sequential behavior by
    default, but contracts with `stageDependencyMode:
    explicit-stage-dependencies` can execute dependency-ready batches. The new
    test proves `p2g` and `pressureInterface` are in the first batch,
    `gridUpdate` waits for both and receives its declared `inputFrom`, `g2p`
    waits for `gridUpdate`, and execution metadata reports
    `maxConcurrentStageCount=2`.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs` passed
    `16/16`, proving ULG's mechanics lane reports dependency batches
    `[['p2g'], ['gridUpdate'], ['g2p']]` for mechanics-only and
    `[['p2g', 'pressureInterface'], ['gridUpdate'], ['g2p'], ['thermalPhase'], ['reactionProduct']]`
    for pressure/thermal/reaction stage chains.
  - Cross-repo ULG physics/visual gates:
    `npm run test:physics-atomics` passed `11` checks with `3` expected
    opt-in long-horizon skips, and visual matrix
    `codex-stage-dependency-batches-20260617` passed three representative rows
    with `failedCount=0`.

### Current focused result - 2026-06-14 AKDT
- ComputeManager GPU resident lane stage-plan executor:
  - `node --check` passed for
    `peercompute/src/peercompute/computeManager/GpuResidentLaneManager.js`,
    `peercompute/src/peercompute/computeManager/ComputeManager.js`,
    `peercompute/src/peercompute/index.js`,
    `peercompute/tests/unit/gpuResidentLaneManager.test.js`, and ULG
    `tests/peercomputeComputeManagerIntegration.test.mjs`.
  - `EMSDK_QUIET=1 node --test peercompute/tests/unit/gpuResidentLaneManager.test.js`
    passed `6/6`.
  - `EMSDK_QUIET=1 node --test peercompute/tests/computeManager.unit.test.js`
    passed `2/2`.
  - `EMSDK_QUIET=1 node --test peercompute/tests/unit/computeManager.commitDelta.test.js`
    passed `19/19`.
  - Broader accumulated architecture validation also passed:
    `EMSDK_QUIET=1 node --test peercompute/tests/unit/nodeKernel.start.test.js`
    `7/7`,
    `EMSDK_QUIET=1 node --test peercompute/tests/unit/nodeKernel.remoteCompute.test.js`
    `8/8`,
    `EMSDK_QUIET=1 node --test peercompute/tests/stateManager.unit.test.js`
    `6/6`, and
    `EMSDK_QUIET=1 node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern "ULG|StateManager|ComputeManager|solver descriptors|law graph|quantum material potential"`
    `203/203`.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "resident pass-DAG task runs through real PeerCompute GPU lane authority|GPU resident lane|law graph"`
    passed `11/11`, proving ULG's
    `peercompute.ulg.mls-mpm-resident-sequence-lane-contract.v0` survives
    `ComputeManager.submitTask()` as a GPU resident lane stage plan with
    `defaultEnabled=false`.
  - Cross-repo ULG physics/visual gates:
    `npm run test:physics-atomics` passed `7` with the expected opt-in
    long-horizon liquid skip, and visual matrix
    `codex-lane-stage-plan-executor-20260614` passed `3/3` with two captured
    frames per scenario.
- NodeKernel remote task-graph compact-candidate authority:
  - `node --check` passed for
    `src/peercompute/nodeKernel/NodeKernel.js`, `src/peercompute/index.js`,
    and `tests/unit/nodeKernel.start.test.js`.
  - `node --test tests/unit/nodeKernel.start.test.js` passed `7/7`.
  - Coverage: `NodeKernel.commitRemoteTaskGraphCompactCandidate()` evaluates
    the existing remote task-graph state-family policy, rejects missing or
    disallowed compact candidates, commits
    `peercompute.nodekernel.remote-task-graph-compact-candidate-authority.v0`
    into StateManager for allowed output families, keeps
    `remoteRetainedRefsUsableLocally=false`, and reports
    `compact-candidate-local-refresh-required` until a local retained-lane
    refresh executor exists. The same test now proves
    `NodeKernel.refreshRemoteTaskGraphHotBuffersFromCompactCandidate()` blocks
    without a local compact refresh executor, then completes only when the
    executor returns local retained refs and a satisfied fence. A blocked
    executor result with no local refs is rejected as
    `compact-hot-buffer-refresh-not-completed` and commits no refresh delta.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "remote seed graph builder"`
    passed `11/11`, proving ULG records compact no-full mechanics output
    through the NodeKernel compact-candidate authority path, can opt into the
    compact refresh surface, and still returns a blocked hot-buffer refresh
    plus no local retained refs when no local compact executor is supplied.
  - Cross-repo ULG physics/visual gates:
    `npm run test:physics-atomics` passed `6` with the expected opt-in
    long-horizon liquid skip, and visual matrix
    `codex-compact-executor-contract-20260614` passed five scenarios with
    `failedCount=0` and `frameCount=5`.
- NodeKernel remote task-graph transport:
  - `node --check` passed for
    `src/peercompute/computeManager/ComputeManager.js`,
    `src/peercompute/nodeKernel/NodeKernel.js`, `src/peercompute/index.js`,
    and `tests/unit/nodeKernel.start.test.js`.
  - `node --test tests/unit/nodeKernel.start.test.js` passed `7/7`.
  - Coverage: non-advisory distributed graphs without an executor still throw
    `ERR_NODEKERNEL_DISTRIBUTED_TASK_GRAPH_UNAVAILABLE`; graphs with explicit
    `targetPeerIds` resolve a `network-task-graph:<peer>` executor, emit
    `compute-task-graph`, run on the responder's
    `ComputeManager.submitTaskGraph()`, and return
    `peercompute.nodekernel.remote-task-graph-placement-provenance.v0` while
    the requester-local ComputeManager graph path is not invoked. Remote graph
    cache artifacts also report
    `peercompute.nodekernel.remote-task-graph-cache-artifact-preflight.v0`:
    default behavior is `remote-cache-artifact-received-not-admitted`, while
    explicit admission routes the artifact through NodeKernel/StateManager and
    reports `admitted-through-node-kernel-state-manager`. The explicit
    admission path now imports the result as
    `peercompute.compute.remote-task-graph-cache-import.v0`; a later local
    graph submission with the same admitted cache key returns `cacheStatus:
    hit`, and remote retained GPU refs are preserved as metadata-only
    nonlocal refs. The same focused test now evaluates
    `peercompute.compute.remote-task-graph-state-seed-policy.v0`, proving that
    allowed `particle-kinematics` imports may seed warm state, disallowed
    state families are blocked, and remote retained GPU refs trigger
    `local-refresh-required` rather than becoming local leases. The explicit
    admission path now also carries a compact state seed payload through
    `NodeKernel.commitRemoteTaskGraphStateSeed()` and commits
    `peercompute.nodekernel.remote-task-graph-state-seed-authority.v0` into the
    requester StateManager warm-delta sink. It then calls
    `NodeKernel.refreshRemoteTaskGraphHotBuffersFromSeed()`, proving
    `peercompute.nodekernel.remote-task-graph-hot-buffer-refresh.v0` reads the
    warm seed, acquires a local GPU resident lane lease, runs a local refresh
    executor, completes a local fence, and commits a refresh delta. The blocked
    disallowed-family path does not commit another delta.
  - Regression coverage: `node --test tests/unit/nodeKernel.remoteCompute.test.js`
    passed `8/8`, proving the existing single-task remote compute transport
    and redundant placement paths still work after adding graph messages.
  - ComputeManager cache regression:
    `node --test tests/unit/computeManager.commitDelta.test.js --test-name-pattern "task graph"`
    passed `17/17`, proving existing task-graph cache admission behavior still
    blocks unadmitted artifacts.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "ULG resident solver descriptors publish executable pass-DAG plus metadata law-family nodes"`
    passed `7/7`, proving the local CPU-oracle mechanics graph still reports
    NodeKernel placement preflight and authority metadata.
  - Cross-repo ULG physics gate:
    `npm run test:physics-atomics` passed `5` with the expected opt-in
    long-horizon liquid skip.
  - Cross-repo ULG visual gate:
    `ULG_VISUAL_MATRIX_RUN_ID=codex-hot-buffer-refresh-sequence-20260614 ... npm run probe:sph-visual-matrix`
    passed with `failedCount=0` and `frameCount=3` for H2O/H2O MLS-MPM,
    H2O/H2O CPU-SPH, Fe/H2O contact, and hot H2O phase-change scenarios.
  - Remaining gap: this is the first remote graph transport hop. Admitted
    imports can now commit compact warm-state seed records and run a local
    hot-buffer refresh hook through a local GPU lane lease. ULG still needs to
    plug its real resident SPH/MLS-MPM buffer rebuild into that hook before
    resident workloads run remote by default.
- NodeKernel task-graph placement preflight:
  - `node --check` passed for
    `src/peercompute/nodeKernel/NodeKernel.js`, `src/peercompute/index.js`,
    and `tests/unit/nodeKernel.start.test.js`.
  - `node --test tests/unit/nodeKernel.start.test.js` passed `5/5`.
  - Coverage: local task graphs report `local-placement-accepted`,
    advisory distributed task graphs report
    `advisory-distributed-placement-local-execution-allowed`, and
    non-advisory distributed task graphs throw
    `ERR_NODEKERNEL_DISTRIBUTED_TASK_GRAPH_UNAVAILABLE` before any local
    ComputeManager execution.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "ULG resident solver descriptors publish executable pass-DAG plus metadata law-family nodes"`
    passed `7/7`, proving the mechanics stage-chain artifact records
    `peercompute.nodekernel.task-graph-placement-preflight.v0` and
    `local-placement-accepted`.
  - Cross-repo ULG browser validation:
    `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://127.0.0.1:5173 PLAYWRIGHT_ENABLE_UNSAFE_WEBGPU=1 npx playwright test --config tests/playwright.config.mjs --grep "SPH phase resident steps can use the real browser PeerCompute resident authority host"`
    passed `1/1`.
  - Cross-repo ULG physics gate:
    `npm run test:physics-atomics` passed `5` with the expected opt-in
    long-horizon liquid skip.
  - Hygiene: `git diff --check` passed in ULG and PeerCompute. ULG ICC
    refreshed with `indexedFiles=233` and `memoryChunks=1218`.
- NodeKernel task-graph authority wrapper:
  - `node --check` passed for
    `src/peercompute/nodeKernel/NodeKernel.js`, `src/peercompute/index.js`,
    and `tests/unit/nodeKernel.start.test.js`.
  - `node --test tests/unit/nodeKernel.start.test.js` passed `3/3`, proving
    `NodeKernel.submitTaskGraph()` stamps placement authority as `node-kernel`
    and returns `peercompute.nodekernel.task-graph-authority.v0`.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "ULG resident solver descriptors publish executable pass-DAG plus metadata law-family nodes"`
    passed `7/7`, proving the ULG mechanics stage-chain artifact reports
    `node-kernel-submit-task-graph` and `nodeKernelOwned=true`.
  - Cross-repo ULG browser validation:
    `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://127.0.0.1:5173 PLAYWRIGHT_ENABLE_UNSAFE_WEBGPU=1 npx playwright test --config tests/playwright.config.mjs --grep "SPH phase resident steps can use the real browser PeerCompute resident authority host"`
    passed `1/1`.
  - Cross-repo ULG physics/visual gates:
    `npm run test:physics-atomics` passed `5` with the expected opt-in
    long-horizon liquid skip, and visual matrix run
    `codex-nodekernel-task-graph-sequence-20260614` reported `failedCount=0`
    with `frameCount=3` for H2O/H2O MLS-MPM, H2O/H2O CPU-SPH, Fe/H2O contact,
    and hot H2O phase-change scenarios.
  - Hygiene: `git diff --check` passed in ULG and PeerCompute. ULG ICC
    refreshed with `indexedFiles=233` and `memoryChunks=1218`.
- StateManager/NodeKernel task-graph cache artifact authority:
  - `node --check` passed for
    `src/peercompute/stateManager/StateManager.js`,
    `src/peercompute/computeManager/ComputeManager.js`,
    `src/peercompute/nodeKernel/NodeKernel.js`, `src/peercompute/index.js`,
    `tests/stateManager.unit.test.js`,
    `tests/unit/computeManager.commitDelta.test.js`, and
    `tests/unit/nodeKernel.start.test.js`.
  - `node --test tests/stateManager.unit.test.js tests/unit/computeManager.commitDelta.test.js tests/unit/nodeKernel.start.test.js`
    passed `25/25`.
  - Coverage: StateManager records task-graph cache artifact admission and
    invalidation, ComputeManager read-through remains blocked until authority
    admission and invalidates local cache entries afterward, and NodeKernel
    routes admission/invalidation through StateManager authority.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "ULG resident solver descriptors publish executable pass-DAG plus metadata law-family nodes"`
    passed `7/7`, proving a ULG mechanics native stage-DAG artifact is
    admitted and invalidated through a NodeKernel-owned StateManager.
  - Cross-repo ULG browser validation:
    `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://127.0.0.1:5173 PLAYWRIGHT_ENABLE_UNSAFE_WEBGPU=1 npx playwright test --config tests/playwright.config.mjs --grep "SPH phase resident steps can use the real browser PeerCompute resident authority host"`
    passed `1/1`.
  - Cross-repo ULG physics/visual gates:
    `npm run test:physics-atomics` passed `5` with the expected opt-in
    long-horizon liquid skip, and visual matrix run
    `codex-state-manager-cache-admission-sequence-20260614` reported
    `failedCount=0` with `frameCount=3` for H2O/H2O MLS-MPM, H2O/H2O CPU-SPH,
    Fe/H2O contact, and hot H2O phase-change scenarios.
  - Hygiene: `git diff --check` passed in ULG and PeerCompute. ULG ICC
    refreshed with `indexedFiles=233` and `memoryChunks=1216`.
- ComputeManager task-graph cache artifacts:
  - `node --check /home/cos/projects/peercompute/peercompute/src/peercompute/computeManager/ComputeManager.js`
    passed from `/home/cos/projects/ulg`.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "ULG resident solver descriptors publish executable pass-DAG plus metadata law-family nodes"`
    passed `7/7`, proving mechanics graph writes produce
    `peercompute.compute.task-graph-cache-artifact.v0` with
    `recorded-not-admitted` admission metadata and an `fnv1a32-*` result hash.
  - Cross-repo ULG browser validation:
    `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://127.0.0.1:5173 PLAYWRIGHT_ENABLE_UNSAFE_WEBGPU=1 npx playwright test --config tests/playwright.config.mjs --grep "SPH phase resident steps can use the real browser PeerCompute resident authority host"`
    passed `1/1`, proving the mounted browser authority host exposes the same
    artifact schema/status/admission fields.
- ComputeManager content-addressed task-graph cache inputs:
  - `node --check /home/cos/projects/peercompute/peercompute/src/peercompute/computeManager/ComputeManager.js`
    passed from `/home/cos/projects/ulg`.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "ULG resident solver descriptors publish executable pass-DAG plus metadata law-family nodes"`
    passed `7/7`, proving the mechanics stage graph derives a scoped cache
    key from `peercompute.compute.task-graph-cache-inputs.v0` instead of an
    explicit key.
  - Cross-repo ULG browser validation:
    `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://127.0.0.1:5173 PLAYWRIGHT_ENABLE_UNSAFE_WEBGPU=1 npx playwright test --config tests/playwright.config.mjs --grep "SPH phase resident steps can use the real browser PeerCompute resident authority host"`
    passed `1/1`, proving the mounted browser authority host exposes the same
    cache-input schema/hash evidence.
- ComputeManager task-graph lifecycle primitive:
  - `node --check /home/cos/projects/peercompute/peercompute/src/peercompute/computeManager/ComputeManager.js`
    passed.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "ULG resident solver descriptors publish executable pass-DAG plus metadata law-family nodes"`
    passed `7/7` from `/home/cos/projects/ulg`, proving
    `submitTaskGraph()` dependency execution plus graph-level cache policy,
    placement policy, cancellation status, task stats, and graph-wide GPU
    resident lane lease evidence on the mechanics P2G -> grid-update -> G2P
    DAG.
  - Cross-repo ULG browser validation:
    `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://127.0.0.1:5173 PLAYWRIGHT_ENABLE_UNSAFE_WEBGPU=1 npx playwright test --config tests/playwright.config.mjs --grep "SPH phase resident steps can use the real browser PeerCompute resident authority host"`
    passed `1/1`, proving the real browser authority host exposes the graph
    lifecycle fields.
- NodeKernel provider sync lifecycle hardening:
  - `node --check peercompute/src/peercompute/nodeKernel/NodeKernel.js`
    passed.
  - `node --check peercompute/src/peercompute/stateManager/StateManager.js`
    passed.
  - `node --check peercompute/tests/stateManager.unit.test.js` and
    `node --check peercompute/tests/unit/nodeKernel.start.test.js` passed.
  - `node --test peercompute/tests/stateManager.unit.test.js peercompute/tests/unit/nodeKernel.start.test.js`
    passed `6/6`.
  - `node --test peercompute/tests/stateManager.unit.test.js peercompute/tests/unit/nodeKernel.start.test.js peercompute/tests/unit/gpuResidentLaneManager.test.js peercompute/tests/unit/computeManager.commitDelta.test.js`
    passed `27/27`.
  - Coverage: a provider-backed StateManager can request sync explicitly after
    initialization, local-only StateManagers no-op, and `NodeKernel.start()`
    requests provider sync after NetworkManager connect.
  - Cross-repo ULG live validation:
    `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://127.0.0.1:5173 npx playwright test tests/demo.e2e.mjs --config=tests/playwright.config.mjs --project=chromium --grep "provider transport replays resident warm deltas"`
    passed `1/1` from `/home/cos/projects/ulg`, proving a late browser
    NodeKernel receives a preexisting ULG resident warm delta over a local WSS
    relay and live PeerComputeProvider transport.
- PeerComputeProvider initial Yjs sync handshake:
  - `node --check peercompute/src/peercompute/stateManager/PeerComputeProvider.js`
    passed.
  - `node --check peercompute/tests/stateManager.unit.test.js` passed.
  - `node --test peercompute/tests/stateManager.unit.test.js` passed `3/3`.
  - Coverage: a source `StateManager` commits a warm resident delta before a
    replica joins; the replica's real `PeerComputeProvider` sends
    `yjs-sync-request`; the source provider responds with `yjs-sync-response`
    carrying an encoded Yjs diff; the replica reads the preexisting warm
    delta.
  - Cross-repo ULG validation:
    `node --test tests/peercomputeComputeManagerIntegration.test.mjs --test-name-pattern "PeerComputeProvider transports"`
    passed `6/6` from `/home/cos/projects/ulg`, proving the same handshake for
    a ULG resident `ulg-sph-resident-pass-dag` delta.
  - The live browser/libp2p gate is now covered by the NodeKernel provider
    sync lifecycle result above.

### Current focused result - 2026-06-12 AKDT
- ComputeManager GPU resident lane authority wrapper slice:
  - `node --check peercompute/src/peercompute/computeManager/ComputeManager.js && node --check peercompute/tests/unit/gpuResidentLaneManager.test.js`
    passed.
  - `node --test peercompute/tests/unit/gpuResidentLaneManager.test.js`
    passed `5/5`, covering passive lane leases plus `ComputeManager` wrapping
    declared inline GPU-lane tasks before commit and rejecting missing required
    fences before `commitDelta`.
  - `node --test peercompute/tests/computeManager.unit.test.js peercompute/tests/unit/computeManager.commitDelta.test.js peercompute/tests/unit/computeManager.wasm.test.js peercompute/tests/unit/computeManager.worker.test.js peercompute/tests/unit/gpuResidentLaneManager.test.js`
    passed `32/32`.
  - `git diff --check` passed.
  - `npm --prefix /home/cos/projects/peercompute/peercompute run build` passed
    with the existing circular chunk and large bundle warnings.

### Schrodinger/materials simulation planning gate
- Branch plan: `plan/branch/schrodinger-simulation.md`.
- First implementation slice must add deterministic tests before visual polish or multi-scale integration.
- Planned command: `node --test demos/schrodinger/tests/*.test.mjs`
- Implemented local command: `npm --prefix demos/schrodinger run test`
- Implemented build command: `npm --prefix demos/schrodinger run build`
- Purpose: validate reference math, property packet schema, water reference-property estimators, and the WebGPU-first Schrodinger/materials demo path.
- Current visual smoke: host-run Playwright/Chrome against `https://127.0.0.1:5184/` captures the default material-cell view, the orbital-cloud view, and bond-class material views, verifies the default view is water/material-cell, and checks the viewport canvas size.
- WebGPU orbital/radial smoke: headless browser runtime must verify `peercompute.schrodinger.orbital-grid-webgpu.v0`, `webgpu-orbital-grid-point-sampling`, and `peercompute.schrodinger.radial-webgpu-eigensolver.v0` in the standalone demo when an adapter is available; if no adapter is available, the orbital grid/cloud and radial solve must report unavailable without CPU fallback.
- Standalone visualization gate: `npm --prefix demos/schrodinger run build`, plus a headless browser smoke that renders a nonblank Three.js canvas without joining a PeerCompute swarm, verifies the local atom/orbital controls are present, and checks desktop/mobile control layout.
- Required first gates:
  - analytic particle-in-box / harmonic-oscillator / hydrogenic references within documented tolerances;
  - standalone Schrodinger orbital grid uses the WebGPU orbital-grid schema/backend in browser smoke and reports no CPU fallback path;
  - standalone Schrodinger cloud points use the WebGPU point-sampling mode/backend in browser smoke, with finite point positions for the requested sample count and no CPU CDF sampler in the live path;
  - standalone Schrodinger radial solve uses the WebGPU radial schema/backend in browser smoke and reports no CPU fallback path;
  - radial finite-difference one-electron Schrodinger eigensolver resolves hydrogen 1s, 2s, and 2p energies within the documented grid tolerance and reports finite residual/node diagnostics for screened active orbitals;
  - wavefunction normalization and imaginary-time energy monotonicity;
  - property packets are JSON-serializable warm deltas with model id, tolerance status, and stale/out-of-domain flags;
  - water phase/property estimator covers solid/liquid/gas states and marks unsupported outputs explicitly.
  - water material-cell visualization renders each H2O molecule with one oxygen, two hydrogens, and two O-H bonds;
  - molecule templates publish `chemical.bondEvents` and render visible covalent/ionic bond classes for at least H2O and NaCl;
  - reactive atom sandbox deterministically bonds 5 O + 10 H into five H2O groups, forms NaCl ionic pairs, reports unsupported inert atoms, and breaks water bonds under high-temperature toy conditions;
  - material property packets adapt to the shared `ClosureState -> ClosureResult` contract and can round-trip back to property-packet shape;
  - orbital point sampler is deterministic and avoids exact grid-cell pileups.
- PeerCompute gate after local kernels pass: two-peer sharding must reproduce the single-peer property packet within tolerance and publish shard timing/status through warm deltas.
- Future closure-service gate: material outputs that feed macro solvers must include unit/dimension metadata, validity-domain status, uncertainty/provenance, deterministic input/code/parameter hashes where practical, and a conservation-impact report for mass, momentum, energy, charge, species, and phase fraction.
- Future free-energy closure gate: phase and reaction closure tests must verify smooth phase-fraction evolution, latent-heat energy accounting, species/reaction stoichiometry, sound-speed/modulus continuity across transition bands, out-of-domain uncertainty flags, and no heat creation without corresponding free-energy/species updates.
- Future active-refinement gate: uncertainty-triggered microphysics jobs must cluster similar local states, emit deterministic task/input/model hashes, and update only cache/surrogate metadata unless a validated closure replacement has passed reference tests.
- Future coupling gate: every particle/grid/mesh transfer adapter must prove conservation within documented tolerance before a solver consumes Schrodinger/materials closure outputs in scientific mode.
- Current static scaffold gate: `node --test demos/tests/demo-ports.test.js`

### Multiscale ladder demo gate
- Demo plan: `demos/multiscale/plan/plan.md`.
- Local command: `npm --prefix demos/multiscale run test`
- Visual smoke command: `npm --prefix demos/multiscale run test:visual`
- Live remote-placement smoke command: `npm --prefix demos/multiscale run test:remote-placement`
- Build command: `npm --prefix demos/multiscale run build`
- Static repo wiring command: `node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js`
- Purpose: validate the first WebGPU-first integrated scale ladder scaffold, including the scale list, packet schema, rupture/cooling proxy, weather proxy, WebGPU compute buffer layout, PeerCompute-managed compute task adapter, adaptive compute budgeting, single-manager worker scheduling, StateManager warm-delta application, and per-scale shard aggregation.
- Release/scaffold purpose: keep the root workspace entry, `dev:multiscale`, `build:multiscale`, all-demo build order, dev launcher relay-config dirs, overview card, port `5185`, and `docs/multiscale` output locked by static tests.
- Required first gates:
  - `SCALE_LAYERS` spans supergalactic, galactic, solar, planet, surface, MLS-MPM, molecular, and orbital layers;
  - `WebGpuLadderCompute` owns a real `createComputePipeline` path with CPU fallback and a stable particle buffer layout;
  - `PeerComputeLadderRuntime` submits ladder work through `ComputeManager` module tasks, uses the bundled worker bootstrap, and emits packet-compatible `peercompute.execution` telemetry;
  - `ComputeManager` exposes resource profile, memory/GPU budget hints, WebGPU adapter limits when available, worker policy, min/target/max workers, revisioned worker resize behavior/history, manual worker autoscale hold status, affinity count, worker/memory/GPU-bound workload-budget estimates, and `peercompute.compute.manager-stats.v0` runtime task statistics with per-runtime and per-task-family buckets for device-adaptive simulation sizing;
  - compute-capacity resize publishes `peercompute.multiscale.compute-capacity-resize.v0`, rebudgets shard/particle capacity after worker-target changes or GPU-limit probes, calls `ScaleComputeOrchestrator.resizePool()` through the one shared manager, reuses compatible shard runtimes, seeds replacement shards from prior live particle records or warm-delta snapshot positions when particle counts change, applies first-pass mass/momentum/kinetic proxy correction to replacement records, and exposes pending/ready/error status plus capacity scale, carried-forward shard/record counts, audit/correction summaries, and compute-resize conservation events through state, runtime-debug, readout rows, and packet conservation telemetry;
  - adaptive solver budget derives N-body body count, Maxwell grid size, cosmology expansion sample count, quantum orbital grid size, hydro tile size, radiation tile size, stellar-fusion tile size, magnetosphere plasma tile size, PIC plasma grid/particle size, relativistic correction sample count, combustion plume tile size, SPH particle count, membrane-shell segment count, and per-solver cadence from device profile and URL overrides, with scale-separated default cadence that keeps cosmology/relativity/field tiles slower than local material/molecular/orbital loops;
  - adaptive solver governor raises solver cadence under frame/task pressure and relaxes back toward budget baseline when the runtime has headroom, with `scale-aware-multirate-v0` weighting that backs off coarse/field solvers faster than molecular/SPH/combustion/membrane loops, `active-layer-priority-v0` effective cadence that keeps the active layer responsive while cooling distant inactive solver layers, and `event-sampled-current-view-v0` lower-scale refinement scheduling that promotes event-triggered lower-scale solver runs while disabling background spot checks under high frame pressure;
  - live workload resize APIs expose solver problem-size rebudgeting and compute-worker target resize without a page reload;
  - solver state remap tests verify `peercompute.multiscale.solver-state-remap.v0`, timeline carry-forward, particle/record prefix copy, grid field resampling with mean preservation, compact invariant summaries, and runtime/readout exposure after live workload resize;
  - solver admission tests verify `peercompute.multiscale.solver-admission.v0`, explicit particle overrides clamped to `ComputeManager` effective item ceilings, oversized law-worker overrides clamped through `createAdmittedMultiscaleSolverBudget()`, runtime admission pressure under memory/worker saturation, state/compute-status exposure, and readout/runtime-debug rows;
  - solver submission-budget tests verify `peercompute.multiscale.solver-submission-budget.v0`, event-triggered and active-layer-adjacent admission priority under pressure, active-layer warmup priority for newly viewed native solvers, manager-backlog holds, promoted remote solver refresh admission as urgent `remote-solver-placement` work under backlog, state/compute-status/NetViz/runtime-debug exposure, `getSolverSubmissionBudget()` API exposure, and `solver submit` readout/runtime-debug rows;
  - state-publication budget tests verify `peercompute.multiscale.state-publication-budget.v0`, first-publication admission, high-pressure packet/warm-delta cadence throttling, state/compute-status/NetViz/runtime-debug exposure, `getStatePublicationBudget()` API exposure, and `state publish` readout/runtime-debug rows;
  - runtime-diagnostics budget tests verify `peercompute.multiscale.runtime-diagnostics-budget.v0`, high-pressure snapshot cache admission, due/forced refresh behavior, build/reuse counters, state/compute-status/NetViz/runtime-debug exposure, `getRuntimeDiagnosticsBudget()` API exposure, and `runtime diag` readout/runtime-debug rows;
  - adaptive runtime scaler samples frame time, ComputeManager manager-stats load/duration pressure, worker-utilization saturation/abandonment pressure, queue pressure, solver pressure, solver-load reports, solver-admission reports, browser memory pressure, network/cluster capacity telemetry, and worker policy, then emits worker/global-workload/targeted-solver-workload scaling requests while exposing `setAutoScale()` and packet-readable scaler status;
  - solver-load report tests verify `peercompute.multiscale.solver-load.v0`, dominant scalable solver selection, locked/manual solver exclusion, molecular candidate-pair load telemetry, WebGPU neighbor-list pair/capacity/overflow pressure, and targeted per-solver workload scale-down/scale-up requests;
  - memory-pressure tests verify `peercompute.multiscale.memory-pressure.v0`, browser heap/budget normalization, runtime-scaler pressure decisions, state/compute-status exposure, and readout/runtime-debug rows;
  - network-capacity tests verify `peercompute.multiscale.network-capacity.v0`, browser Network Information API normalization, cluster URL hints, remote worker capacity, placement recommendations, state/compute-status exposure, and readout/runtime-debug rows;
  - placement-plan tests verify advisory `peercompute.multiscale.placement-plan.v0`, local defaults when network capacity is unavailable or save-data constrained, cluster recommendations for coarse/bulk solvers under strong LAN cluster capacity, peer recommendations only for peer-friendly solver classes, pinned local coupled solvers, state/compute-status exposure, and readout/runtime-debug rows;
  - remote-placement-readiness tests verify `peercompute.multiscale.remote-placement-readiness.v0`, default disabled/local-advisory state, explicit `?enableRemotePlacement=1&remotePlacementPeerId=...` arming, module/WASM-only task allowance metadata, request/result schemas, manager capability gates for dispatch-ready status, opt-in loopback dispatch-ready state through `?enableLoopbackRemotePlacement=1`, `window.__multiscaleDemo.configureRemotePlacement()` hook installation, `peercompute.multiscale.remote-placement-configuration.v0`, replica URL override parsing for `remotePlacementReplicaPeerIds` / aliases and `remotePlacementTargetReplicaCount` / aliases, `balanceRemotePlacementPeers` / `remotePlacementBalancePeers` plus `remotePlacementBalanceSeed` override parsing, active executor-backed readiness for balanced auto-primary plans that do not persist the temporary primary override, state/compute-status exposure, and `remote place` / `remote config` readout/runtime-debug rows;
  - remote-peer selection tests verify `peercompute.multiscale.remote-peer-selection.v0`, relay/local/duplicate candidate rejection, deterministic score ordering from trusted/preferred/sticky peer hints, network capacity, local manager pressure, advertised peer worker/GPU/bandwidth metadata, local `peercompute.multiscale.remote-peer-reliability.v0` success/failure scores, `peercompute.multiscale.remote-peer-placement-plan.v0` balanced-primary rotation with deterministic seed override, explicit primary pin preservation, requested replica ordering before ranked fallback replicas, scoped `peercompute.multiscale.remote-peer-reliability-store.v0` save/load behavior, stale-entry pruning, score decay toward the prior, scalable `remoteWorkerCapacity` fallback when active workers are idle-retired, no-target reporting when only local/bootstrap peers are connected, query parsing for `autoSelectRemotePlacementPeer`, state exposure, and `remote peer` / `remote peer plan` / `remote reliability` readout/runtime-debug rows;
  - remote-solver placement policy tests verify `peercompute.multiscale.remote-solver-placement-policy.v0` and `peercompute.multiscale.remote-solver-placement-decisions.v0`, query parsing for `?enableRemoteSolverPlacement=1&remoteSolverFamilies=...`, default disabled/advisory state, dry-run advisory mode, promotion of selected coarse solver families to non-advisory peer/cluster hints only when remote readiness is dispatch-ready, one-shot promoted solver refresh queueing without disturbing an already dispatch-ready NodeKernel placement executor, tight-coupled solver rejection by default, per-solver promote/advisory/block reasons, API exposure through `configureRemoteSolverPlacement()` / `getRemoteSolverPlacementPolicy()` / `getRemoteSolverPlacementDecisions()` / `runLoopbackRemoteSolverPlacementProbe()` / `refreshReadout()`, state/compute-status/runtime-debug exposure, and `remote solver` / `remote decisions` readout/runtime-debug rows;
  - magnetar scenario preset tests verify `peercompute.multiscale.scenario-preset.v0`, normalized magnetar reference fields, MoonLab magnetar-dipole Ising calibration metadata, UI/API/query activation paths, packet/runtime scenario exposure, and stellar/MHD/PIC/relativistic refinement requests while keeping the validation status explicitly proxy-only; calibration-ingest tests verify `peercompute.multiscale.scenario-calibration-ingest.v0`, accepted MoonLab calibration readiness, packet boundary-condition propagation, and unchanged `simulationStatus: "proxy-only"`; closure-ingest tests verify `peercompute.multiscale.scenario-closure-ingest.v0`, accepted Eshkol `wasm-reference` closure readiness, entry signature/start-section/import/export/host-import/output-semantics metadata propagation, descriptor-only `eshkol.ulg.magnetar-closure-descriptor.v0` readiness without output semantics, packet boundary-condition propagation, and unchanged `simulationStatus: "proxy-only"`; closure module-probe tests verify `peercompute.multiscale.scenario-closure-module-probe.v0`, WASM module compile/import/export metadata checks, transferred-byte module source, descriptor-only closure probe readiness, host-runtime-required reporting, packet `scenarioClosureModuleProbe*` fields, and no scientific execution claim; closure host-runtime dry-probe tests verify `peercompute.multiscale.scenario-closure-host-runtime-probe.v0`, no-start-section reporting, inert stub import dry instantiate readiness, packet `scenarioClosureHostRuntimeProbe*` fields, no `main` call, and no scientific execution claim; closure host-runtime execution tests verify `peercompute.multiscale.scenario-closure-host-runtime-execution.v0`, DOM-free Eshkol host import invocation of `main(0, 0)`, captured output/import calls, packet `scenarioClosureHostRuntimeExecution*` fields, smoke-fixture output-semantics validation, and no scientific execution claim; handoff-readiness tests verify `peercompute.multiscale.scenario-handoff-readiness.v0`, combined MoonLab/Eshkol handoff-ready state, packet `scenarioHandoff*` fields, `scientificReady: false`, removal of the output-semantics blocker after smoke validation or descriptor-only probe readiness, guardrail preservation of the output-semantics blocker when smoke validation is missing, and blockers for calibrated magnetar references and tolerance coverage;
  - PeerCompute ULG adapter reference-contract tests verify MoonLab `outputs.reference` readiness only when the contract carries the expected schema/role, `sha256:` hash, normalized energy units, ground-state reference energy, numeric tolerance/delta fields, pass validation, and delta within tolerance.
  - PeerCompute MoonLab WebGPU complex64 parity-scope tests verify `moonlab.webgpu.complex64-parity-scope.v0` evidence is summarized through `peercompute.ulg.artifact-summary.v0`, MoonLab dispatch probe/ingest summaries, `peercompute.ulg.handoff-supervisor-service-summary.v0`, Multiscale calibration ingest, handoff readiness, packet boundary conditions, and live browser handoff smokes. Coverage includes both the legacy no-backend blocked form and the current `scope-ready-backend-detected` reduced browser WebGPU form while preserving `fullFidelityMagnetarSimulation = false`, `fullPhysicsValidation = false`, and unchanged scenario scientific readiness.
  - PeerCompute ULG adapter calibrated-reference tests verify future `outputs.references[]` entries are summarized into `magnetarCalibratedReferences` and only count as ready when they include family, solver id, schema/role, `sha256:` contract and units hashes, field maps/tolerances/observed deltas within tolerance, pass validation, and `scientificCoverage: true`.
  - Multiscale reference-inventory tests verify `magnetarReference*` summary fields propagate into calibration ingest, handoff readiness, packet boundary conditions, and the HUD path, clearing only the MoonLab dipole Ising reference-contract blocker while preserving proxy-only scientific readiness and calibrated-reference/tolerance blockers.
  - Multiscale tolerance-suite manifest tests verify `peercompute.multiscale.scenario-scientific-tolerance-suite.v0` reports partial MoonLab Ising tolerance input, missing/partial/complete MHD/PIC/radiation/relativity calibrated tolerances, calibrated-reference suite counters, blocker clearing only when all four families are ready with scientific coverage, and no scenario scientific-readiness promotion.
  - Multiscale runtime-evidence manifest tests verify `peercompute.multiscale.scenario-runtime-evidence-manifest.v0` inventories magnetosphere MHD, PIC kinetic plasma, radiation transport, relativistic correction, and cross-family conservation/coupling runtime evidence, reports current reduced solver outputs as proxy-only observed evidence, exposes `scenarioRuntimeEvidence*` packet fields, keeps `proxy-runtime-not-scientific` blocked for proxy evidence, and only clears the runtime gate when an explicit validated five-entry manifest is supplied after all transfer/reference/closure prerequisites are ready. Magnetosphere-MHD, PIC kinetic-plasma, radiation-transport, relativistic-correction, and cross-family conservation/coupling runtime evidence tests verify `peercompute.multiscale.magnetosphere-mhd.runtime-validation.v0`, `peercompute.multiscale.pic-kinetic-plasma.runtime-validation.v0`, `peercompute.multiscale.radiation-transport.runtime-validation.v0`, `peercompute.multiscale.relativistic-correction.runtime-validation.v0`, and `peercompute.multiscale.cross-family-conservation-coupling.runtime-validation.v0` record bounded proxy checks, produce digest-shaped evidence hashes, preserve validation schema/scope through manifest ingestion, and still leave validated runtime count plus scenario scientific readiness blocked. Scientific runtime manifest tests also verify validated entries require `peercompute.multiscale.scenario-scientific-runtime-validation.v0`, `magnetar-scientific-runtime-reference-validation` scope, reference/tolerance/runtime-output hashes, and an evidence hash; missing scientific validation artifacts report `runtime-evidence-incomplete`. The live-facing bounded proxy API test verifies `createScenarioBoundedProxyRuntimeEvidenceManifest()` and `refreshScenarioBoundedProxyRuntimeEvidence()` create all five hash-bearing proxy entries from current magnetar state, report `observed=5`, `proxyOnly=5`, `missing=0`, `validated=0`, and keep packet/runtime-gate scientific readiness false.
  - Live ULG-to-Multiscale calibrated inventory probe on 2026-06-06 exports ULG from `http://100.86.83.35:5173/`, applies it to `https://100.86.83.35:5185/?scenario=magnetar`, and verifies four raw MoonLab calibrated families, `handoff-ready`, closure execution ready, `scientificReady: false`, tolerance-suite counts `5/1/0`, calibrated-reference counts `4/0/0`, and only the calibrated-reference plus scientific-tolerance blockers.
  - PeerCompute ULG transfer-manifest tests verify normalized `peercompute.ulg.demo-handoff.v0` artifacts carry `peercompute.ulg.handoff-transfer-manifest.v0` entries with artifact ref/content hashes, transferred WASM byte lengths, declared module SHA-256, source URLs, transfer mode, relay-safe counts, blockers for missing refs, hashes, closure bytes, or module SHA, and an explicit `ulg-handoff-artifacts-missing` blocker for empty exported handoffs.
  - Multiscale transfer-manifest tests verify `peercompute.multiscale.scenario-transfer-manifest.v0` ingests normalized ULG transfer manifests, exposes relay-safe artifact and transferred WASM byte counts through handoff readiness and `scenarioHandoffTransfer*` packet boundary conditions, treats empty handoffs as `transfer-manifest-missing`, renders transfer status in the HUD path, and does not promote magnetar scientific readiness.
  - Multiscale ULG dispatch-summary checks verify `window.__multiscaleDemo.runUlgDispatchServiceAdapterProbe()` returns top-level `serviceResultSummaries[]` with compact MoonLab/Eshkol service summary schemas, Eshkol host-runtime execution/output-semantics validation fields for the real `hello` smoke handoff, no copied `wasmBytes`, and `scientificExecution = false`.
  - Live transfer-manifest probe on 2026-06-06 verifies the VPN ULG-to-Multiscale handoff stays `handoff-ready` with `transferReady: true`, two relay-safe artifacts, `33907` transferred WASM bytes, closure transfer mode `inline-byte-array`, the staged closure module SHA-256, and no transfer blockers.
  - peer-network tests verify `?enablePeerNetwork=1` / `?enableNodeKernel=1` query parsing, relay-config override/source/local fallback discovery, bootstrap peer normalization, non-fatal browser NodeKernel transport-manager startup for relay-listen failures, default-off `peercompute.multiscale.node-kernel-status.v0`, `window.__multiscaleDemo.startPeerNetwork()` / `stopPeerNetwork()` / `getPeerNetworkStatus()` API exposure, state/compute-status/runtime-debug/NetViz metadata exposure, and active `node kernel` readout/runtime-debug rows without starting a swarm in the default visual smoke;
  - task-placement tests verify `peercompute.compute.task-placement.v0`, placement-hint passthrough from `SolverRegistry`, requested local/peer/cluster bucket counts, actual local worker/inline execution counts, `peercompute.compute.task-execution.v0` return-envelope metadata for inline and worker completions, optional non-advisory remote placement executor dispatch with `remote-peer` accounting, `commitDelta` flow, the Multiscale `peercompute.multiscale.loopback-remote-placement.v0` executor running a real solver through that path, `peercompute.multiscale.loopback-remote-solver-placement-probe.v0` running a policy-promoted solver through the same path, post-construction `ComputeManager.configurePlacementHooks()` install/clear behavior, deterministic `peercompute.compute.task-packet.v0` code/input/task hashes, `peercompute.compute.remote-task-envelope.v0` signer metadata through admission/executor/provenance context, `peercompute.compute.remote-placement-verification.v0` hash matching and mismatch rejection, `peercompute.compute.remote-placement-validation.v0` result-validator rejection before delta commit, exported `createRemoteResultQuorumValidator()` replica output/delta hash acceptance and mismatch rejection before delta commit, `peercompute.compute.remote-placement-retry.v0` retry success/exhaustion accounting for transient executor failures, terminal admission/verification/validation failures, admission rejection buckets, timeout failure buckets, `peercompute.compute.remote-placement-provenance.v0`, state exposure, and readout/runtime-debug rows;
  - NodeKernel remote-compute tests verify `peercompute.compute.remote-request.v0` / `peercompute.compute.remote-result.v0`, `submitRemoteComputeTask()`, `createNetworkPlacementExecutor(peerId)`, `createRedundantNetworkPlacementExecutor(peerIds)`, `peercompute.nodekernel.remote-compute-placement-provenance.v0` preservation for placement executors, `peercompute.nodekernel.redundant-network-placement.v0` replica summaries, an in-memory two-kernel requester/responder placement round trip through two `ComputeManager` instances, an in-memory requester/primary/replica quorum round trip, dead-primary/two-replica promotion with `primaryFailure` / `promotedReplica` / `promotedReplicaExecutorId` provenance and no self-quorum, default rejection of unsafe function payloads, guarded responder opt-in, module/WASM task routing through the responder's local `ComputeManager`, requester-only `commitDelta` application, and no responder-local `commitDelta` application when returning task envelopes;
  - live remote-placement smoke verifies four browser `NodeKernel` peers over a local relay, scored auto-selection of a connected non-relay primary responder when `autoSelectRemotePlacementPeer` is enabled, advertised primary and replica capacity from `peercompute.nodekernel.peer-capabilities.v0`, `peercompute.multiscale.remote-peer-selection.v0` schema/candidate/score telemetry with `advertised-capacity` reasons and positive worker capacity, deterministic balanced primary rotation with `remotePlacementBalanceSeed`, active balanced readiness without persisting the temporary primary override, scoped/persisted `peercompute.multiscale.remote-peer-reliability.v0` attempts/successes/score telemetry from runtime/probe remote outcomes, `peercompute.multiscale.remote-peer-reliability-store.v0` persistence status, selected-peer capacity and reliability propagation into admission with positive runtime/probe `remoteWorkerCapacity`, trusted remote primary admission, explicit peer-target dispatch readiness even when advisory placement-plan candidates are absent, preservation of primary/replica peer ids through `ComputeManager` normalization, stable `taskPlacement.lastRemotePlacement` telemetry, sane remote provenance duration, task-packet hash verification, `peercompute.nodekernel.redundant-network-placement.v0` primary-plus-replica quorum validation, matching output/task hashes with commit-delta hash comparison disabled for independently stateful responders, primary and replica compute-task completion on live worker pools, positive primary/replica `workerCount` and `workerTasksCompleted`, concrete `workerId` / `remoteExecution.executionMode === "worker"` provenance for both the runtime cadence task and explicit probe primary/replica reports, closed-primary promoted-replica failover with `remotePlacementPrimaryTimeoutMs`, `remotePlacementReplicaTimeoutMs`, `remotePlacementTargetReplicaCount=3`, `remotePlacementQuorumResultCount=2`, `primaryFailure`, `promotedReplicaExecutorId`, an independent quorum replica that is not the promoted result, actual `remote-peer` placement accounting, requester-side primary/promoted-replica `StateManager` commit for a coarse `cosmology-expansion` solver task, `remote peer` / `remote peer plan` / `remote reliability` / `remote solver` / `remote decisions` readout/runtime-debug visibility, balanced placement preservation during remote-solver policy setup, and remote execution from a one-shot promoted ordinary runtime solver cadence refresh after remote-solver policy is armed, not only the explicit probe API;
  - placement-admission-policy tests verify `peercompute.compute.placement-admission-policy.v0` option normalization, `peercompute.compute.placement-admission.v0` accepted/rejected results, peer bandwidth/RTT/worker/trust checks, cluster node/GPU checks, and ComputeManager integration through the admission hook;
  - worker-utilization tests verify `peercompute.compute.worker-utilization.v0` for inline execution, affinity-key worker dispatch, worker-failure fallback, solver task-family buckets, state exposure, readout/runtime-debug rows, and `peercompute.multiscale.worker-utilization-pressure.v0` autoscaler pressure decisions;
  - runtime debug panel/API exposes `peercompute.multiscale.runtime-debug.v0` with manager worker policy, manager load, worker utilization, task placement, top task families, solver pressure, solver submission budget, render-budget pressure, pixel-ratio scale/effective pixel ratio, dynamic visual cadence/skip count, active overlay commit cadence/reuse counters, embedded `peercompute.multiscale.overlay-data-update.v0` partial/full upload telemetry, `peercompute.multiscale.readback-budget.v0` interval/backlog telemetry, `peercompute.multiscale.state-publication-budget.v0` packet/warm-delta cadence telemetry, `peercompute.multiscale.runtime-diagnostics-budget.v0` snapshot cache telemetry, memory pressure, network capacity, placement plan, remote-placement readiness/configuration, remote-peer selection, remote-solver policy/decisions, autoscaler state, `peercompute.multiscale.readout-cadence.v0` readout throttle telemetry, compact HUD mode telemetry, `peercompute.multiscale.packet-preview.v0`, warm-delta counts, and current quality multipliers through the center panel, `getRuntimeDebug()`, `getRuntimeDiagnosticsBudget()`, `getRenderBudget()`, `getReadbackBudget()`, `getStatePublicationBudget()`, `getHudMode()`, `getPacketPreview()`, `getSolverSubmissionBudget()`, and `getState().runtimeDebug`;
  - mobile output-panel tests verify `peercompute.multiscale.output-panel-visibility.v0`, `getOutputPanels()`, `setOutputPanelVisibility()`, `setOutputPanelsVisibility()`, `toggleOutputPanel()`, HUD/runtime-debug state exposure, fixed controls/runtime/readout/packet toggle buttons, packet/readout/runtime hide/show CSS, and a 390px viewport flex-stack layout bounded above the fixed toggle strip that keeps ladder traversal controls/readout reachable without panel overlap while focus mode keeps molecular response/reconcile/source-buffer/application/replay/mutation/queue/writer rows visible;
  - performance probe coverage uses `npm --prefix demos/multiscale run test:perf` to collect `peercompute.multiscale.frame-phase-timing.v0` from a no-screenshot Playwright run. This is a diagnostic probe rather than a strict fps gate; use it to compare app-loop phase costs while treating headless browser rAF and `ReadPixels` warnings as noisy;
  - visual-reference coverage verifies `peercompute.multiscale.visual-reference.v0` and `peercompute.multiscale.zoom-continuity.v0`: scales 1-3 map to Universes-style star/cosmic visuals, scales 4-5 map to PlanetGen/WebGPUPhys dynamics cues, scales 6-7 map to WebGPUPhys MLS/MPM/material-particle cues, the orbital scale maps to Schrodinger orbital-cloud cues, and layer switches expose the first seamless camera/target interpolation state through state, runtime debug, readout text, and visual-smoke summary assertions;
  - generic ladder snapshot overlay coverage verifies the shared WebGPU ladder snapshot point cloud remains telemetry-only on every scale with no resident scene geometry and zero render capacity, while dedicated visible overlays such as cosmology expansion, N-body, weather/radiation, SPH/material, combustion, molecular atoms/bonds, and orbital clouds continue to render;
  - NetViz session metadata exposes `peercompute.multiscale.netviz-session.v0` through `getNetVizSession()` and same-origin session beacons, with embedded runtime-debug data preserved by NodeKernel and NetViz attach-session normalization;
  - environment controls and `window.__multiscaleDemo.setEnvironment()` update oxygen, stellar flux, gravity, ambient temperature, and ambient pressure controls; packet downward boundary conditions include ambient temperature/pressure; the active-layer readout reflects the same values;
  - `SolverRegistry` validates law/solver worker descriptors and `ComputeManager.submitSolverTask()` runs descriptor-backed tasks through the same commitDelta path;
  - executable N-body gravity task advances a WebGPU-capable direct-sum state with deterministic CPU fallback, emits `multiscale-solver-deltas`, and reports mass/momentum/energy conservation diagnostics;
  - executable N-body Barnes-Hut mode tracks the direct-sum reference with tight theta, reduces interactions at larger body counts, emits approximation diagnostics in warm deltas/packets, and can run in browser smoke with `?nbodyBodies=128&nbodyMode=tree&autoScaleWorkloads=false`;
  - executable stellar-fusion task advances a WebGPU-capable reduced proton-proton-chain/plasma tile with deterministic CPU fallback, emits core temperature/density/H-He/fusion-power/luminosity/neutrino diagnostics, commits warm deltas, feeds solar/radiation packet state, and renders a visible solar-core overlay;
  - executable magnetosphere plasma task advances a WebGPU-capable reduced ideal-MHD/plasma tile with deterministic CPU fallback, emits solar-wind pressure, magnetopause radius, reconnection, ionization, Alfven speed, current-sheet, divergence-B, and mass/magnetic/plasma energy drift diagnostics, commits warm deltas, feeds solar/radiation/debris packet state, and renders a visible solar magnetosphere overlay;
  - executable PIC plasma patch task advances a WebGPU-capable reduced particle-in-cell push/deposit patch with deterministic CPU fallback, emits charge/current, kinetic/field energy, particle escape, reconnection heating, and divergence-E diagnostics, commits warm deltas, feeds magnetosphere/solar packet state, and renders a visible charge-colored kinetic plasma overlay;
  - executable relativistic correction task advances a WebGPU-capable reduced post-Newtonian orbit-shell with deterministic CPU fallback, emits speed, Lorentz, time-dilation, gravitational-redshift, perihelion-precession, frame-dragging, lensing, Shapiro-delay, relativistic-energy, and causality diagnostics, commits warm deltas, feeds solar/galactic/cosmology packet state, and renders a visible relativistic shell overlay;
  - executable cosmology expansion task advances a WebGPU-capable reduced supergalactic expansion/density-contrast tile with deterministic CPU fallback, emits scale factor, Hubble rate, density contrast, filament energy, void fraction, structure growth, expansion-work, and Hubble-tension diagnostics, commits warm deltas, feeds cosmology/galaxy packet state, and renders a visible supergalactic web overlay;
  - executable reactive thermal task advances a WebGPU-capable one-cell thermochemical kernel with CPU fallback, emits temperature/pressure/heat/species/phase closure state, commits warm deltas, and feeds surface packet aggregate state;
  - executable molecular dynamics tests verify `peercompute.multiscale.molecular-quantum-coupling.v0` can be normalized from the quantum orbital `ClosureResult`, converted into `peercompute.multiscale.molecular-quantum-source.v0`, applied to matched oxygen atoms in a water patch, and propagated through MD diagnostics, model aggregate state, packet closures, `upward.closureResults.molecularDynamics`, conservation telemetry, and the active `molecular quantum` readout row. The same gate verifies `peercompute.multiscale.quantum-orbital-grid.statistical-bridge-webgpu.v0` survives the qgrid-to-MD handoff as `quantumStatisticalBridge*` fields with WebGPU source classification, partition/occupation, heat-capacity, ionization, opacity, degeneracy, ensemble-pressure, temperature/charge, damping, and bounded bridge-drive scalars visible in diagnostics, packet aggregate state, closure scalars, and the `molecular qgrid stat` row. Browser smoke must verify the live Chrome/WebGPU path reports `quantumCouplingApplicationMode: "webgpu-neighbor-integrate-quantum-source-term"`, `quantumCouplingWebgpuKernelApplied === true`, `quantumWavefunctionEvolutionSource: "webgpu-worker"`, WebGPU no-fallback policy, finite WebGPU Hamiltonian component fields (`kineticExpectationEv`, `potentialExpectationEv`, `hamiltonianComponentResidualEv`, `virialResidualEv`), radial Schrodinger WebGPU source/residual fields, and finite qgrid statistical-bridge packet/runtime fields; Node/no-adapter coverage is only a regression path and must not be treated as the live backend;
  - quantum material-potential tests verify `peercompute.multiscale.quantum-material-potential.v0` is produced from upper-layer conditions plus the Schrodinger/orbital closure, exposes condition-aware atom/molecule material properties and behavior hooks, reports missing calibrated Born-Oppenheimer force gradients and product stoichiometry, publishes `peercompute.multiscale.quantum-material-reaction-barrier-surface.v0` as a reduced uncalibrated gate, publishes `upward.closureResults.quantumMaterialPotential`, renders the `quantum material` readout row, runs a WebGPU-capable concurrent property-batch solver through the shared `ComputeManager`, validates the WGSL shader source/pipeline, blocks silent all-zero WebGPU readbacks for nonzero batches, and blocks Na-water reactive chemistry until the required calibrated reactive potential/charge-transfer/product artifacts exist;
  - qmat-to-molecular source tests verify the same base MD state changes when a WebGPU qmat concurrent batch is attached: `peercompute.multiscale.molecular-quantum-material-source.v0` must report WebGPU backend/provenance, source record counts, temperature/charge/source diagnostic deltas, pair-force scale, rest-length shift, formula-derived target-pair and target-atom selectivity (`O-H` plus O/H atoms for water), primary/secondary atomic numbers, target/fallback atom counts, selected/fallback pair counts, ensemble pressure ratio/drive, heat-capacity proxy, thermal damping scale, atom-position divergence from the uncoupled state, `forceFieldQuantumMaterialSourceBiasEnergyProxy`, `forceFieldQuantumMaterialPairForceBiasEnergyProxy`, `forceFieldQuantumMaterialEnsembleBiasEnergyProxy`, `forceFieldQuantumMaterialBiasEnergyProxy`, closure/conservation handoff fields, packet scalar exposure, and the `molecular qmat` readout row. The gate now also verifies `peercompute.multiscale.quantum-statistical-source-equation.v0` is attached to qmat ensemble/batch outputs, uses `peercompute.multiscale.molecular-source-equation.v0` as its adapter schema, exposes five source channels, and carries pressure/opacity/ionization/degeneracy/temperature/charge/damping terms into MD diagnostics, conservation, WebGPU status, packet aggregate state, closure scalars, and the `quantum stat source` HUD row. The same gate verifies `peercompute.multiscale.quantum-material-electronic-charge-source.v0`, `peercompute.multiscale.quantum-material-reaction-barrier-surface.v0`, and reduced Na-water product-source metadata are attached to WebGPU qmat batches, folds donor/acceptor, charge-transfer, ionization, mobility, screening, hardness-softening, QEq-mix, activation, probability, gate, damping, blocker, product heat, product charge, product extent, gas, and topology-required terms into MD diagnostics, charge-equilibration reports, conservation fields, closure chemistry scalars, packet aggregate state, WebGPU status, and the `qmat electronic` / `qmat barrier` HUD rows. The same gate verifies `peercompute.multiscale.molecular-force-law.v0`, element-aware mean pair rest length, mean affinity, and ionic/polar candidate counts from the reduced covalent-radius/electronegativity pair law. The focused regression cases include `5 O + 10 H + 1 Na`: one keeps water stable while product stoichiometry is unavailable, and one consumes reduced Na + H2O -> NaOH + 0.5 H2 source metadata while product topology remains unavailable and H2O topology is still projected. Solver-submission tests must also verify active-molecular lower-law dependency candidates carry `dependencyRun` / `dependencyDecision` and admit `quantumMaterialPotential` when MD needs missing qmat source evidence under backlog. Browser smoke must verify the live Chrome/WebGPU path can start on `molecular` and still report `quantumMaterialSourceApplicationMode: "webgpu-neighbor-integrate-quantum-material-source-term"`, `quantumMaterialSourceWebgpuKernelApplied === true`, WebGPU qmat record count, O-H target pairs, finite qmat ensemble pressure/heat-capacity fields, qstat source-equation schema/channel count/drive fields, finite qmat electronic charge-source schema/drive fields, finite qmat reaction-barrier/product source fields, and visible `molecular qmat`, `quantum stat source`, `qmat electronic`, plus `qmat barrier` telemetry; Node/no-adapter coverage is only regression coverage and must not be treated as the live backend;
  - qmat response-derivative tests verify `peercompute.multiscale.quantum-material-response-derivatives.v0` is emitted by the WebGPU qmat batch, mirrored into property-response output, consumed by MD as bounded temperature/pressure/field/radiation derivative drives, and exposed through MD diagnostics, conservation, packet aggregate state, upward closures/scalars, runtime status, and the `qmat derivatives` HUD row. The source-buffer regression must also prove response-derivative side-band fields survive molecular source/sink balance, source equation, conservative source buffer, reactive/SPH source-buffer readers, target response/reconciliation, target application, acceptance, writeback validation, replay, mutation audit, worker-write queue, explicit reduced worker write, and verification while preserving `sourceVectorF32.length === 8`; warmed two-target handoffs should expose at least `55` application/write fields and the `qmat deriv buffer` packet/readout surface. Browser smoke must confirm the live Chrome/WebGPU path reports the derivative schema from the molecular packet and orbital qmat batch after molecular/orbital warmup;
  - packet law-graph consistency tests verify `peercompute.multiscale.law-graph-consistency.v0` merges qmat fragments with environment, orbital, MD, source-buffer, reactive/SPH, coupling, conservation, and scientific-readiness nodes, exposes state/law/constraint/edge counts, reports proxy/scientific blockers separately, nests `peercompute.multiscale.law-graph-update-plan.v0` with runnable/blocked operation, phase, dispatch-ready, and authoritative-mutation readiness counts, nests `peercompute.multiscale.law-graph-consistency-solve.v0` with proxy/scientific residuals and proposed state updates, nests `peercompute.multiscale.law-graph-proposal-admission.v0` with StateManager warm-delta and ComputeManager dispatch admission counts, nests `peercompute.multiscale.law-graph-dispatch-queue.v0` with ComputeManager/model-local queue entries, executor batches, partial-proxy readiness, and scientific blockers, nests `peercompute.multiscale.law-graph-scheduler-manifest.v0` with scheduler lanes, descriptor/export resolution, warm-delta scope links, state-application links, and descriptor/executor/scientific blockers, nests `peercompute.multiscale.law-graph-scheduler-execution-audit.v0` with solverRuntime/warm-delta evidence matching and missing-evidence counts, nests `peercompute.multiscale.law-graph-result-admission.v0` with proxy-admitted worker-result evidence plus missing/scientific-blocked counts, nests `peercompute.multiscale.law-graph-state-application-preflight.v0` with application-ready/waiting/missing-link/scientific-blocked counts, publishes `multiscale-law-graph` warm deltas, and renders `law graph` telemetry in packets/state/readout/runtime-debug surfaces;
  - ULG v0.4 contract-audit tests verify `peercompute.ulg.spec-contract-report.v0` is present in packet aggregate state, reports spec version `0.4`, includes the nine foundation/root contracts, marks the quantum statistical ensemble bridge active when qmat closure evidence exists, audits all 14 required WebGPU core passes with complete pass contracts, exposes hot/warm/cold layout and hard-rule/checklist readiness, exposes the ULG-to-MD handoff, and renders `ulg spec` plus `root contracts` in the active HUD;
  - ULG runtime-manifest tests verify `peercompute.ulg.runtime-manifest.v0` is produced from the current Schrodinger/material state, exposes carrier/state-channel declarations, Hamiltonian and material-closure hashes, canonical WebGPU pass counts, law/quantum task capsule status, `multiscale-ulg-runtime` state surfaces, and rejects live non-WebGPU kernel passes with `blocked-live-backend`;
  - ULG runtime-execution/state-delta tests verify the registered `ulg-runtime` descriptor resolves to `stepUlgRuntime`, the worker publishes `peercompute.ulg.webgpu-execution-result.v0`, nested `peercompute.ulg.webgpu-state-delta.v0`, and `peercompute.ulg.webgpu-execution-delta.v0`, Node/no-adapter runs report `blocked-webgpu-unavailable` with no CPU fallback, browser WebGPU runs execute the pass DAG through worker-local storage buffers and apply reduced ULG channel updates, and packets/state/readout/runtime-debug expose `ulg exec`, `getUlgRuntimeExecution()`, `getUlgRuntimeStateDelta()`, `getUlgRuntimeExecutionDeltas()`, `getState().ulgRuntimeExecution`, `getState().ulgRuntimeStateDelta`, and `getState().ulgRuntimeExecutionState`;
  - ULG-to-molecular source-term tests verify `peercompute.ulg.webgpu-state-delta.v0` can be normalized into `peercompute.multiscale.molecular-ulg-state-source.v0`, applied to the reduced MD patch as lower-law temperature/charge/velocity/magnetic source terms, compared against an uncoupled control using the same base MD state, and propagated through source diagnostics, conservation, model aggregate state, upward closures, the contract-audit handoff, and the `molecular ulg` readout row. The focused Node regression must assert the uncoupled packet reports no source schema/hash, zero applied channels, zero temperature/charge deltas, and inactive `handoffs.ulgToMolecularDynamics`, then assert the coupled packet reports the ULG source schema/hash, changed temperature/charge/source diagnostics, six applied channels, and active contract-audit handoff. Browser smoke must verify the live Chrome/WebGPU path reports `ulgStateDeltaApplicationMode: "webgpu-neighbor-integrate-source-term"` and `ulgStateDeltaWebgpuKernelApplied === true` from the staged MD integrate shader; Node/no-adapter coverage is only a regression path and must not be treated as the live backend. Host-run Chrome/WebGPU smoke on `2026-06-05 05:54:48 AKDT` passed this live gate with ULG execution backend `webgpu-ulg-pass-dag-state-delta`, MD backend `webgpu-molecular-dynamics`, MD kernel `cell-neighbor-list`, six applied ULG channels, nonzero temperature/charge deltas, active `peercompute.ulg.spec-contract-report.v0` handoff, visible `molecular ulg` readout, and screenshot `/tmp/peercompute-multiscale-ulg-md-live-smoke.png`.
  - qmat Na-water product-source tests verify the Schrodinger/qmat material potential exposes reduced Na + H2O -> NaOH + 0.5 H2 stoichiometry, heat, charge-transfer, H2 gas, and topology-required metadata through `peercompute.multiscale.quantum-material-reaction-barrier-surface.v0` plus `peercompute.multiscale.quantum-material-product-stoichiometry.v0`, that the law graph is proxy-consistent while scientific execution remains blocked, and that MD consumes the product source into diagnostics, conservation, `ClosureResult` state fields/chemistry, packet aggregate state, and upward closure scalars while keeping H2O topology projected until a conservative NaOH/H2 topology adapter exists.
  - explicit molecular proxy-apply tests and browser smoke verify `executeMolecularTargetMutationApply()` acknowledges the target-source intake/source-buffer sequence, creates deterministic local `molecular-source-buffer-application` reports for reactive/SPH targets, advances acceptance/writeback/replay/mutation-audit/worker-write queue planning to ready proxy write intents, and still keeps scientific mutation and live worker-buffer queueing blocked;
  - executable bottom-up consumer tests verify hot molecular `ClosureResult` input is accepted by reactive thermal and SPH material workers, converted into reduced heat/chemistry drive, produces higher reactive heat output plus higher SPH material temperature than uncoupled controls, and survives model application as packet/conservation/coupling molecular source-accounting telemetry;
  - molecular source/sink tests verify reactive thermal and SPH material workers emit `peercompute.multiscale.molecular-source-sink.v0`, preserve target solver/field provenance, expose positive reduced heat-flux and energy/species residual proxies in packet aggregate state, fold those residuals into `peercompute.multiscale.conservation-audit.v0`, and surface matching cross-scale coupling/field-metadata entries;
  - molecular source/sink balance tests verify `peercompute.multiscale.molecular-source-sink-balance.v0` compares molecular event-source drive against reactive/SPH consumer reports, exposes active target count, source/cooling coverage, heat/species residual proxies, fanout oversubscription, conservation/coupling exchange fields, metadata, the `molecular balance` readout row, and the `multiscale-source-sink-balances` warm-delta/API path;
  - molecular source-equation tests verify `peercompute.multiscale.molecular-source-equation.v0` is derived from source/sink balance, preserves representative volume/mass/heat-capacity basis values, marks the system open, exposes proxy W and count/s terms with dimensions, surfaces the `molecular equation` readout row, and threads heat-rate/temperature-rate/species-rate/open-residual terms through conservation exchange metadata plus reactive/SPH coupling adapter context without claiming validated enthalpy or stoichiometry;
  - molecular phase-EOS basis tests verify `peercompute.multiscale.molecular-phase-eos-basis.v0` preserves reduced specific free/internal/enthalpy/entropy proxies, latent-heat budget, phase-energy rate, source-temperature delta, and phase-stability residual through MD packets, `ClosureResult` thermodynamics, molecular source/sink and source-equation summaries, reactive/SPH consumer diagnostics, conservation/coupling exchange metadata, and the `molecular eos` readout row while remaining marked as proxy telemetry;
  - molecular conservative-transfer dry-run tests verify `peercompute.multiscale.molecular-conservative-transfer.v0` allocates source-equation heat/species proxy terms to active reactive thermal and SPH consumers, preserves dry-run/applied flags, proxy units, allocation counts, closed-system residuals, packet aggregate summaries, browser API exposure, the `multiscale-source-transfers` warm-delta/state path, conservation/coupling exchange metadata, reactive/SPH adapter context, named molecular reactive thermal field-transfer preview context, `peercompute.multiscale.molecular-transfer-application.v0` validation gates with dry-run/mutation blockers, default-off `configureMolecularTransferApplication()` / `getMolecularTransferApplicationConfig()` API and state exposure, configured gate telemetry that clears operator blockers while dry-run remains blocked, `peercompute.multiscale.molecular-transfer-transaction.v0` default-off non-mutating transaction telemetry, `configureMolecularTransferTransaction()` / `getMolecularTransferTransactionConfig()` API and state exposure, configured transaction telemetry that clears transaction/mutator blockers while application remains blocked, `peercompute.multiscale.molecular-target-mutator-preview.v0` reactive/SPH target before-after preview telemetry, `peercompute.multiscale.molecular-target-mutator-registry.v0` allowed-field/unit/invariant/blocker telemetry with zero validated/applied mutators, `peercompute.multiscale.molecular-target-mutation-preflight.v0` declared-field/invariant/residual/blocker telemetry with zero applied targets, `peercompute.multiscale.molecular-target-mutation-operation-plan.v0` field-level before/after/delta operation telemetry with zero applied operations, `peercompute.multiscale.molecular-target-mutation-invariant-check.v0` operation-plan invariant coverage and residual-budget telemetry with zero applied targets, `peercompute.multiscale.molecular-target-mutation-commit.v0` invariant-gated commit telemetry with zero committable/committed operations, `peercompute.multiscale.molecular-target-mutation-dispatch.v0` commit-gated dispatch batch telemetry with zero dispatchable/queued/dispatched operations, `multiscale-source-transfer-applications`, `multiscale-source-transfer-transactions`, `multiscale-source-transfer-target-previews`, `multiscale-source-transfer-target-mutators`, `multiscale-source-transfer-target-preflights`, `multiscale-source-transfer-target-operation-plans`, `multiscale-source-transfer-target-invariant-checks`, `multiscale-source-transfer-target-commits`, and `multiscale-source-transfer-target-dispatches` warm-delta/state/API exposure, application-gate conservation/coupling exchange fields plus adapter context, target-preview conservation/coupling exchange metadata plus reactive/SPH/field-transfer adapter context, target-mutator registry, target-mutation preflight, target-mutation operation-plan, target-mutation invariant-check, target-mutation commit, and target-mutation dispatch conservation/coupling exchange metadata plus adapter context, and the `molecular transfer`, `molecular apply`, `molecular txn`, `molecular preview`, `molecular mutators`, `molecular preflight`, `molecular op plan`, `molecular invariants`, `molecular commit`, plus `molecular dispatch` readout rows without mutating solver state;
  - molecular target-mutation apply-validation tests verify `peercompute.multiscale.molecular-target-mutation-apply-validation.v0` consumes the dispatch report, validates target before/after write previews, keeps residuals under the `1e-9` proxy tolerance, reports `apply-disabled`, `target-mutator-apply-not-implemented`, and inherited dispatch blockers, publishes `multiscale-source-transfer-target-apply-validations` warm deltas plus API/state exposure, threads conservation/coupling exchange metadata plus reactive/SPH adapter context, and renders the `molecular apply val` readout row with zero applied operations;
  - molecular target-source response exchange tests verify `peercompute.multiscale.molecular-target-source-response.v0` intake/response summaries are preserved in conservation exchange fields, exchange metadata, cross-scale coupling exchange fields, and reactive/SPH adapter context, including responded/pending counts, response heat-flux proxy, response thermal drive, and max target temperature metadata;
  - molecular target-source reconciliation tests verify `peercompute.multiscale.molecular-target-source-reconciliation.v0` compares intake against response acknowledgement, reports reconciled/pending target counts, sequence mismatch count, unacknowledged thermal drive, residual tolerance/pass status, packet/upward summary fields, warm-delta/API/state exposure, and the `molecular reconcile` / `target reconcile` readout path;
  - molecular target-source reconciliation exchange tests verify reconciliation summaries are preserved in conservation exchange fields, exchange metadata, cross-scale coupling exchange fields, and reactive/SPH adapter context, including reconciled/pending counts, residual proxy, unacknowledged drive, intake heat-rate, and response heat-flux metadata;
  - molecular conservative source-buffer tests verify `peercompute.multiscale.molecular-conservative-source-buffer.v0` is emitted after target-source reconciliation, uses an 8-float per-target source vector with explicit proxy layout/units, reports active/dispatchable/reconciled/pending target counts, source-term count, total heat/species proxy rates, finite residuals, reactive/SPH worker acknowledgement echo fields, packet/upward/conservation/coupling metadata, `multiscale-conservative-source-buffers` warm deltas through `getConservativeSourceBufferDeltas()` and `getState().conservativeSourceBufferState`, and the `molecular buffer` readout row;
  - molecular source-buffer application tests verify `peercompute.multiscale.molecular-source-buffer-application.v0` is emitted by reactive thermal and SPH workers after source-buffer consumption, records before/after target fields, applied field/source-term counts, finite residuals, packet aggregate summaries through `peercompute.multiscale.molecular-source-buffer-application-aggregate.v0`, conservation/coupling exchange fields, adapter context, `multiscale-source-buffer-applications` warm deltas through `getSourceBufferApplicationDeltas()` and `getState().sourceBufferApplicationState`, post-apply browser wait behavior, and the `molecular buffer apply` / `buffer apply` readout rows;
  - molecular source-buffer acceptance tests verify `peercompute.multiscale.molecular-source-buffer-acceptance.v0` links the source buffer and application aggregate, accepts reduced proxy application only when schema/stride/sequence/source-term/field-delta/residual checks pass, keeps `scientificMutationReady` false, exposes closure counters plus conservation/coupling exchange fields and adapter context, publishes `multiscale-source-buffer-acceptances` warm deltas through `getSourceBufferAcceptanceDeltas()` and `getState().sourceBufferAcceptanceState`, and renders the `molecular buffer accept` / `buffer accept` rows;
  - molecular source-buffer writeback validation tests verify `peercompute.multiscale.molecular-source-buffer-writeback-validation.v0` links accepted source buffers to target-side application summaries, validates source-term coverage, finite field-delta coverage, residual tolerance, and target blockers, keeps `scientificWritebackReady` false, exposes closure counters plus conservation/coupling exchange fields and adapter context, publishes `multiscale-source-buffer-writeback-validations` warm deltas through `getSourceBufferWritebackValidationDeltas()` and `getState().sourceBufferWritebackValidationState`, and renders the `molecular buffer writeback` / `buffer writeback` rows;
  - molecular target-buffer replay validation tests verify `peercompute.multiscale.molecular-target-buffer-replay-validation.v0` links source-buffer application aggregates and writeback validation to current target snapshots, replays reactive thermal and SPH target fields under reduced tolerance, keeps `scientificReplayReady` and `scientificMutationReady` false, exposes closure counters plus conservation/coupling exchange fields and adapter context, publishes `multiscale-target-buffer-replay-validations` warm deltas through `getTargetBufferReplayValidationDeltas()` and `getState().targetBufferReplayValidationState`, and renders the `molecular buffer replay` / `buffer replay` rows;
  - molecular target-buffer mutation audit tests verify `peercompute.multiscale.molecular-target-buffer-mutation-audit.v0` appears after replay validation, converts replay-validated target fields into reduced write intents, reports ready/blocked target and write-intent counts, keeps `canQueueWorkerWrite === false` and `scientificMutationReady === false`, exposes closure counters plus conservation/coupling exchange fields and adapter context, publishes `multiscale-target-buffer-mutation-audits` warm deltas through `getTargetBufferMutationAuditDeltas()` and `getState().targetBufferMutationAuditState`, and renders the `molecular buffer mutate` / `buffer mutate` rows;
  - molecular target-buffer worker-write queue tests verify `peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0` appears after mutation audit, groups ready write intents into target worker batches, reports ready/blocked batch and ready/blocked/queued write-intent counts, keeps `canPlanWorkerWrite === true`, `canQueueWorkerWrite === false`, and `scientificMutationReady === false`, exposes closure counters plus conservation/coupling exchange fields and adapter context, publishes `multiscale-target-buffer-worker-write-queues` warm deltas through `getTargetBufferWorkerWriteQueueDeltas()` and `getState().targetBufferWorkerWriteQueueState`, and renders the `molecular buffer queue` / `buffer queue` rows;
  - molecular target-buffer worker-write execution tests verify `peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0` appears after queue planning, defaults to blocked/non-mutating, can be explicitly applied through `executeMolecularTargetBufferWorkerWrite({ executionRequested: true, proxyWorkerWriteEnabled: true, targetWorkerWriteImplemented: true })`, reports applied/blocked batch and applied/skipped write-intent counts, keeps residuals finite and near zero for replay-ready writes, keeps `scientificMutationReady === false`, exposes closure counters plus conservation/coupling exchange fields and adapter context, publishes `multiscale-target-buffer-worker-write-executions` warm deltas through `getTargetBufferWorkerWriteExecutionDeltas()` and `getState().targetBufferWorkerWriteExecutionState`, and renders the `molecular buffer writer` / `buffer writer` rows;
  - molecular target-buffer worker-write verification tests verify `peercompute.multiscale.molecular-target-buffer-worker-write-verification.v0` appears after explicit proxy worker-write execution, re-reads current target snapshots, reports verified/blocked target counts plus verified/skipped/missing/mismatched field counts, keeps residuals finite and near zero for matching proxy writes, keeps `scientificMutationReady === false`, exposes closure counters plus conservation/coupling exchange fields and adapter context, publishes `multiscale-target-buffer-worker-write-verifications` warm deltas through `getTargetBufferWorkerWriteVerificationDeltas()` and `getState().targetBufferWorkerWriteVerificationState`, and renders the `molecular buffer verify` / `buffer verify` rows;
  - executable Maxwell field task advances a WebGPU-capable periodic field tile with CPU fallback, emits field energy/net charge/Poynting flux diagnostics, commits warm deltas, and feeds galactic packet aggregate state;
  - executable hydro-atmosphere task advances a WebGPU-capable reduced moist shallow-water tile with CPU fallback, emits weather diagnostics, commits warm deltas, feeds planet packet aggregate state, and renders a visible planet weather overlay;
  - executable radiation-opacity task advances a WebGPU-capable reduced grey-radiation/opacity tile with CPU fallback, emits optical-depth/greenhouse/temperature/heating diagnostics, commits warm deltas, feeds planet/solar packet aggregate state, and renders a visible heat/opacity overlay;
  - executable combustion-plume task advances a WebGPU-capable reduced fuel/oxygen/smoke/water tile with CPU fallback, emits fire-area/smoke/fuel/heat plus smoke-centroid/plume-rise/buoyancy/oxygen/suppression diagnostics, commits warm deltas, feeds surface packet aggregate state, and renders a visible surface plume overlay;
  - radiative heat-feedback gate proves radiation-derived heat flux raises reactive-cell and SPH material temperatures while also feeding the combustion-plume and membrane-shell workers through the same coupling field consumed by CPU and WebGPU kernels;
  - executable SPH material task advances a WebGPU-capable reduced material-particle patch with CPU fallback, emits material temperature, ice/liquid/vapor phase mix, phase-change/latent-heat proxy, `peercompute.multiscale.sph-material.phase-change-evidence.v0` H2O evidence, mass/contact/cooling diagnostics, commits warm deltas, and feeds MPM/surface packet aggregate state;
  - executable molecular-dynamics task advances a WebGPU-capable reduced atom/bond patch with CPU fallback, emits atom/bond/species/reaction/charge/temperature diagnostics, commits warm deltas, feeds molecular/surface packet aggregate state, and renders a visible molecular atom/bond overlay;
  - molecular recipe controls and APIs rebuild or append to the reduced MD patch from counted periodic-table atoms, including a deterministic `5 O + 10 H` water recipe with 15 atoms and ten valence-capped O-H bonds plus a live Na/Cl append that preserves existing atoms and keeps appended species in packet state;
  - molecular charge/electrical diagnostics expose finite mean absolute charge, dipole moment proxy, electrical conductivity proxy, ionic/covalent bond counts, polar-bond fraction, and valence saturation in packet aggregate/closure state after water plus Na/Cl live append, and the active-layer readout exposes molecular bond/electrical/search rows from those aggregate fields;
  - molecular force-energy diagnostics expose `peercompute.multiscale.molecular-force-energy-ledger.v0`, finite total/potential energy, finite bonded/electrostatic/repulsion/QEq component terms, shared closure conserved/chemistry propagation, aggregate packet fields, packet closure scalars, and the active `molecular energy` readout row;
  - molecular thermo-phase diagnostics expose `peercompute.multiscale.molecular-thermo-phase-ledger.v0`, finite solid/liquid/vapor/plasma fractions that normalize to unity, finite phase-change and latent-heat proxy fields, shared closure phase/thermodynamic propagation, aggregate packet fields, packet closure scalars, and the active `molecular phase` readout row;
  - molecular phase consumer tests verify reactive thermal and SPH material workers consume the molecular phase summary through `peercompute.multiscale.molecular-source-sink.v0`, expose finite phase drive, heating/cooling drive, latent heat sink/release proxy fields, packet aggregate state, conservation exchange metadata, and field metadata without claiming conservative thermodynamic mutation;
  - SPH fire-contact suppression gate proves liquid particles near the fire source produce finite contact/cooling diagnostics and increase the model's surface water-contact suppression state;
  - SPH rupture spill gate proves membrane/manual rupture creates a decaying spill impulse, reduced stream placement toward the fire, released-water accounting, finite SPH spill/fire/ground-contact telemetry, and finite momentum/kinetic-energy drift telemetry;
  - executable membrane-shell task advances a WebGPU-capable reduced thin-shell ring with CPU fallback, emits pressure-load/heat-flux/stress/strain/damage/integrity/rupture-risk diagnostics, commits warm deltas, feeds balloon packet aggregate state, and updates rupture state;
  - shared closure contract maps reactive thermal and SPH solver outputs into `ClosureState -> ClosureResult` summaries with validity, uncertainty, and conservation fields, then commits normalized `multiscale-closures` warm deltas through `StateManager`;
  - reduced conservation audit emits `peercompute.multiscale.conservation-audit.v0` with finite mass, energy, species residuals, water inventory, solver drift, optional `peercompute.multiscale.compute-resize-conservation.v0`, and tracked coupling metadata, then commits the audit as a `multiscale-conservation` warm delta through `StateManager`;
  - galactic-layer visual smoke verifies the Maxwell field overlay is accepted, visible, and driven by the solver backend;
  - solar-layer visual smoke verifies the N-body overlay is accepted, visible, and driven by the solver backend;
  - solar-layer visual smoke verifies the stellar-fusion overlay is accepted, visible, has finite core/luminosity/species diagnostics, and is driven by the solver backend;
  - solar-layer visual smoke verifies the magnetosphere plasma overlay is accepted, visible, has finite solar-wind/reconnection/Alfven/ionization/divergence diagnostics, and is driven by the solver backend;
  - solar-layer visual smoke verifies the PIC plasma patch overlay is accepted, visible, has finite charge/current/kinetic/reconnection/divergence diagnostics, and is driven by the solver backend;
  - solar-layer visual smoke verifies the relativistic correction overlay is accepted, visible, has finite speed/Lorentz/time-dilation/redshift/precession/frame-dragging/lensing diagnostics, respects `relativitySamples` overrides, and is driven by the solver backend;
  - supergalactic-layer visual smoke verifies the cosmology expansion overlay is accepted, visible, has finite scale/Hubble/filament/void/expansion-work diagnostics, respects `cosmologySamples` overrides, and is driven by the solver backend;
  - planet-layer visual smoke verifies the hydro-atmosphere overlay is accepted, visible, and driven by the solver backend;
  - planet-layer visual smoke verifies the radiation-opacity overlay is accepted, visible, has finite optical/temperature diagnostics, emits finite `surfaceRadiativeHeatFlux`, and is driven by the solver backend;
  - surface-layer visual smoke verifies the combustion-plume overlay is accepted, visible, has finite fire/smoke/fuel/temperature/centroid/rise/buoyancy/oxygen diagnostics, emits finite combustion closure fields, and is driven by the solver backend;
  - surface-layer visual smoke verifies the SPH material overlay is accepted, visible, and driven by the solver backend while the reactive thermal packet is present; Chrome/WebGPU runs should stay on `webgpu-sph-material` unless the adapter path is unavailable and the documented CPU fallback is reported;
  - surface-layer visual smoke verifies SPH `fireContactFraction`, `coolingPotential`, `spillImpulse`, `groundContactFraction`, ice/liquid/vapor mix, boiling/freezing, phase-change-rate, latent-heat proxy packet fields, and H2O phase-change evidence status/validation/blocker fields are finite and do not claim scientific/EOS validation;
  - surface-layer visual smoke clicks the rupture control and verifies positive released-water plus SPH spill, fire-contact, and cooling telemetry;
  - surface-layer visual smoke verifies membrane-shell packet fields are finite for segment count, integrity, stress, strain, damage, and rupture risk;
  - molecular-layer visual smoke verifies molecular dynamics atom/bond overlays are accepted and visible, reports finite atom count, bond count, mean bond order, heat-release, temperature, ionization, charge telemetry, `peercompute.multiscale.molecular-thermo-phase-ledger.v0`, normalized solid/liquid/vapor/plasma phase fractions, latent-heat proxy fields, reactive/SPH molecular phase handoff fields, and the `molecular phase` HUD row, requires the current Chrome/WebGPU path to stay on `webgpu-molecular-dynamics`, verifies the active WebGPU kernel is the staged `cell-neighbor-list` path or documented all-pairs fallback, captures molecular-phase solver-load telemetry before returning to other layers, verifies flattened packet and solver-load neighbor-list telemetry reports finite capacity/pair pressure and zero overflow when active, verifies finite dynamic neighbor-grid cell size/origin/extent fields, respects `molecularAtoms` / `molecularCadence` overrides, and is driven by the solver backend;
  - molecular-layer visual smoke verifies `peercompute.multiscale.molecular-geometry-force-law.v0` for the default water recipe, including at least five complete H2O triplets, finite mean H-O-H angle, bounded angle error, finite O-H/H-H distances, positive closure fraction, geometry energy telemetry, packet/closure propagation, and the active `molecular geometry` HUD row;
  - molecular-layer visual smoke verifies `peercompute.multiscale.molecular-charge-equilibration.v0` is present in packet/runtime state, exposes finite QEq-style residual and charge-delta fields, renders the `molecular qeq` readout row, and keeps clamp-aware neutralization residuals near zero for the live H10/O5 plus NaCl recipe;
  - `ScaleComputeOrchestrator` creates worker-budgeted affinity-keyed shard jobs per scale, schedules them through one shared `ComputeManager`, commits task deltas into `StateManager`/`DataState`, aggregates active-scale shard snapshots from warm state, can resize its shard pool without allocating a second manager, carries prior live particle records forward when available and prior positions otherwise when particle-count changes require replacement runtimes, redistributes record float 7 across rebuilt records to preserve aggregate record-scale mass proxy, applies first-pass velocity correction to aggregate record-scale-weighted momentum/kinetic proxy residuals, and reports actual shared-manager worker counts, planned shard tasks, manager capabilities/stats, scale-pool `carriedForwardShardCount` / `carriedForwardRecordShardCount`, `resizeAuditSummary`, `resizeCorrectionSummary`, before/after mass-proxy deltas, and per-task-family manager buckets;
  - browser hook `window.__multiscaleDemo` exposes layer selection, environment setting, rupture trigger, and packet readout;
  - warm packet includes active layer, model tier, upward closures, downward boundary conditions/refinement requests, and the reduced conservation audit including compute-resize conservation fields after particle-count-changing capacity resize;
  - visual smoke verifies a nonblank canvas, all eight layer switches, accepted ladder overlay status under the current render budget, `peercompute-worker-pool` or documented fallback execution, `managerCapabilities.workers`, `managerCapabilities.affinityCount`, manager stats, worker-utilization telemetry, task-placement telemetry, per-task-family manager buckets, runtime debug panel/API telemetry, compact HUD focus/telemetry toggles, focus-mode row filtering, compact packet preview schema, `peercompute.multiscale.render-budget.v0` state/API/compute/runtime-debug/readout telemetry including rescue state, min-visible scale, pixel-ratio scale, effective pixel ratio, dynamic visual interval/skip count, commit interval, visible commit limit, visible commit count, reused commit count, and embedded `peercompute.multiscale.overlay-data-update.v0` partial/full update counters, `peercompute.multiscale.readback-budget.v0` state/API/compute/runtime-debug/NetViz/readout telemetry including interval, previous interval, pending readbacks, and backlog frames, `peercompute.multiscale.state-publication-budget.v0` state/API/compute/runtime-debug/NetViz/readout telemetry including packet interval, delta interval, publish/defer decision, publish count, skipped frame count, and last duration, `peercompute.multiscale.runtime-diagnostics-budget.v0` state/API/compute/runtime-debug/NetViz/readout telemetry including snapshot interval, refresh/cache decision, build count, reuse count, and last duration, default-off NodeKernel status telemetry, loopback remote-placement probe execution through `runLoopbackRemotePlacementProbe()`, policy-promoted loopback remote-solver execution through `runLoopbackRemoteSolverPlacementProbe()`, compute-capacity resize telemetry after GPU-limit probe and after `resizeComputeWorkers()`, capacity-budget telemetry/readout rows, scale-pool `carriedForwardShardCount`, `carriedForwardRecordShardCount`, finite `resizeAuditSummary` continuity fields, finite `record-scale` mass-proxy deltas, record-scale mass-conservation summary fields, finite scale-weighted `resizeCorrectionSummary` before/after mass/momentum/kinetic residual fields, and packet conservation `computeResize` fields when particle count changes, NetViz session metadata with embedded runtime debug and NodeKernel status, actual shared-worker counts, StateManager warm-delta count, normalized closure warm deltas, live workload-resize/autoscale/remote-solver/peer-network APIs, packet-readable runtime-scaler, render-budget, readback-budget, state-publication budget, runtime-diagnostics budget, memory-pressure, network-capacity, placement-plan, task-placement, remote-peer selection, remote-solver policy/decisions, solver-admission, solver-submission budget, lower-scale refinement scheduler, solver-load, solver-remap status, and compute-resize status, active readout `manager stats` / `manager families` / `worker util` / `task placement` / `memory pressure` / `network capacity` / `placement plan` / `remote place` / `remote config` / `remote peer` / `remote peer plan` / `remote solver` / `remote decisions` / `node kernel` / `solver admission` / `solver submit` / `refinement schedule` / `render budget` / `readback budget` / `state publish` / `runtime diag` / `hud mode` / `solver load` / `solver remap` / `solver scales` / `particle budget` capacity scale / `compute resize` / `resize corr` rows, runtime-debug `worker util` / `task placement` / `memory pressure` / `network capacity` / `placement plan` / `remote place` / `remote config` / `remote peer` / `remote peer plan` / `remote solver` / `remote decisions` / `node kernel` / `solver admission` / `solver submit` / `refinement schedule` / `render budget` / `readback budget` / `state publish` / `runtime diag` / `hud mode` / `resize corr` rows, and a WebGPU or CPU-fallback compute status without requiring a PeerCompute swarm.
- Infinite Context Coder workflow gate: before broad Multiscale/PeerCompute architecture edits, refresh `/home/cos/projects/infinite_context_coder` with `python3 scripts/codebase_tool.py index --repo peercompute`, `python3 scripts/codebase_tool.py build-memory --repo peercompute`, then use `architecture-summary --repo peercompute --bundle --include-cheatsheet` and targeted `search-chunks` queries for existing compute, placement, NodeKernel, and solver patterns.

### Multiscale compute capacity resize gate
- Command: `node --test peercompute/tests/unit/computeManager.worker.test.js`
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Purpose: verify worker-target resize stays under one shared `ComputeManager`, increments `workerPoolRevision` only on real pool changes, preserves `peercompute.compute.worker-resize.v0` status/history in capabilities/stats, worker/memory/GPU-bounds workload budgets from target worker count and resource limits, briefly holds core queue/idle autoscaling after manual/demo worker resize, and lets `ScaleComputeOrchestrator.resizePool()` rebuild the per-scale shard plan while reusing compatible warm shard runtimes or carrying prior shard particle records/positions into replacement runtimes when particle counts change. Browser smoke must perform a real worker-target transition, see `peercompute.multiscale.compute-capacity-resize.v0` settle to ready state, render `compute resize` and `resize corr` in both runtime-debug and active-layer readouts, expose finite `peercompute.compute.capacity-budget.v0` telemetry with adapter GPU limits when available, expose `carriedForwardShardCount > 0`, `carriedForwardRecordShardCount > 0`, finite `resizeAuditSummary` carried-prefix continuity fields, finite `record-scale` mass-proxy deltas, `massConservedShardCount`, `massConservationMode: "all-record-scale"`, finite `resizeCorrectionSummary` scale-weighted before/after mass/momentum/kinetic residual fields, and packet conservation `peercompute.multiscale.compute-resize-conservation.v0` fields when the resize changes particle count, and expose both scaler `workerCooldownFrames` and manager `workerAutoScaleHold`.
- Boundary: current compute resize rebudgets shard count and particle count, carries full live particle records where available, audits carried-prefix continuity, redistributes record-scale mass proxy, and applies a first-pass record-scale-weighted velocity correction for aggregate momentum/kinetic proxies. Scientific-mode particle/state transfer still needs a real mass field, material-aware mass-conserving projection, energy/species/charge invariant enforcement, unit-aware audits, and cross-peer placement policies before resize can be treated as physically conservative.

### Multiscale solver state remap gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Purpose: verify live solver workload rebudgeting preserves continuity instead of cold-starting every law worker. Record/particle remap must carry timelines and copy stable record prefixes; grid/tile remap must resample scalar/vector fields and preserve component means where requested; mixed solvers must handle both record and grid fields; compact invariant summaries must report mass, momentum, energy, charge, species/phase, or field proxies where available; `resizeSolverWorkloads()` must return a compact remap summary; `getState().solverRemapSummary`, runtime debug, and the active readout must expose `peercompute.multiscale.solver-state-remap.v0`; `getSolverRemapReport()` must keep the full field-level report available for explicit debugging.
- Boundary: current remap reports invariant deltas but does not yet enforce conservative corrections. Scientific mode still needs per-solver invariant policies for mass, momentum, energy, charge, field divergence, species, and phase fractions before resize can be treated as physically conservative.

### Chemistry demo planning gate
- Before any chemistry demo visual polish, lock a deterministic algebra/model suite around the paper invariants: inert CD partner pairs, reactive lower-to-S-layer channels, atomic norm defects limited to `{-4, 0, +4}`, sigma-conjugate sign flips swapping attractive vs anti-bond outcomes, and a sampled `8 -> 2 -> 0` reactivity cascade.
- Command: `node --test demos/tests/fano-reactor.test.mjs`
- Purpose: verify exact sedenion counts, noble-gas inertness, sigma-conjugate bond flips, and the scaffold's reference cascade sample.
- Secondary gate: `npm --prefix demos/fano-reactor run build`
- Purpose: verify the standalone Vite demo still builds into `docs/fano-reactor`.
- Schrodinger integration gate after the chemistry bridge exists: add a deterministic test proving `demos/schrodinger` can consume the reusable Fano/sedenion classifier and emit symbolic `chemical.bondEvents` without changing validated water/property outputs.
- Required boundary assertion: sedenion outputs are marked `modelTier: symbolic` or `confidence: symbolic` and are not treated as thermodynamic, optical, electromagnetic, nuclear, or phase-property validation.

### Baseline unit suite
- Command: `npm --prefix peercompute run test:unit`
- Purpose: guard core `NetworkManager`, scheduler, topology, and NodeKernel policy behavior.
- Gate: must pass before merging networking policy changes.

### Service orchestration gate
- Command: `node --test peercompute/tests/unit/serviceOrchestration.test.js`
- Resource broker command: `node --test peercompute/tests/unit/resourceLeaseBroker.test.js`
- Integrated command: `node --test peercompute/tests/unit/serviceOrchestration.test.js peercompute/tests/unit/computeManager.commitDelta.test.js peercompute/tests/unit/computeManager.worker.test.js peercompute/tests/unit/solverRegistry.test.js`
- Purpose: verify `ComputeServiceRegistry` manifest normalization and task-kind resolution, local Eshkol/MoonLab ULG fixture service manifests and task capsules, ULG v0.5 copied fixture adaptation for `compute_service_manifest`/task capsule inputs plus content-addressed artifact ref handoff, `peercompute.ulg.artifact-summary.v0` validation/quantum-response/parity summary preservation for MoonLab artifacts, magnetar dipole Ising calibration summary fields and MoonLab `outputs.reference` contract summary fields for MoonLab artifacts, staged Eshkol closure bundle readiness fields including entry signature/start-section/import/export/host-import metadata, service-worker imported host-import module/factory readiness, and output-semantics smoke-fixture expectations, descriptor-only Eshkol magnetar closure summaries from `validation.closureDescriptor`, `peercompute.ulg.handoff-service-envelope.v0` ready/blocked envelope normalization with relay-safe content-addressed artifact refs, `UlgHandoffServiceHost` WorkerSupervisor execution and artifact-cache storage for durable envelope tasks, `peercompute.ulg.handoff-service-dispatch-plan.v0` Eshkol/MoonLab dispatch derivation, injected executor results, compact `peercompute.ulg.handoff-supervisor-service-summary.v0` summaries for nested MoonLab/Eshkol service results, registry-backed supervisor executor submission to registered Eshkol/MoonLab service hosts, explicit supervisor service-task overrides for resource metadata, `peercompute.ulg.handoff-dispatch-artifact-payload.v0` materialized artifact payloads in submitted service tasks, exported `UlgDispatchServiceHost` MoonLab/Eshkol adapter manifests and typed dispatch acceptance artifacts, `ChildWorkerLeaseManager` approved-module/quota/expiry/root-revocation behavior, classic/module child-worker type preservation and unsupported-type rejection, `ResourceLeaseBroker` GPU/resource capacity accounting, priority classes, render-priority preemption, non-preemptable lease protection, TTL expiry, release/revoke-by-root cleanup, device-lost quarantine, pressure telemetry, completed-task released-lease telemetry, `WorkerSupervisor` worker-style service-host task and lease flow, cancellation-tree child/resource lease revocation, ULG service-contract telemetry, public exports, and the headless `ComputeManagerServiceAdapter` path for service execution without a browser worker.
- Gate: run when changing `peercompute/src/peercompute/serviceOrchestration/**`, service manifest contracts, ULG service-host adapters, or ComputeManager-backed service execution.

### Local relay + coturn dev stack gate
- Launch command: `npm run dev:vpn-coturn`, or `RELAY_PUBLIC_HOST=<vpn-ip> RELAY_TURN_HOST=<vpn-ip> RELAY_TURN_USERNAME=peer RELAY_TURN_CREDENTIAL=compute npm run dev:vpn-coturn` when overriding detection.
- Health commands: `curl -k -I --max-time 10 https://<vpn-ip>:4173/?dev=1`, `curl -k -I --max-time 10 https://<vpn-ip>:5185/`, `curl -k -I --max-time 10 https://<vpn-ip>:5182/`, and `timeout 15s turnutils_uclient -u peer -w compute -p 3478 -n 1 -m 1 -y <vpn-ip>`.
- Script check: `bash -n scripts/dev-vpn-coturn.sh` and `npm run dev:vpn-coturn -- --dry-run`.
- Config check: `demos/multiscale/public/relay-config.json` and `docs/multiscale/relay-config.json` should advertise the VPN WSS relay multiaddr plus Google STUN and coturn UDP/TCP entries.
- Purpose: keep the demo overview, Multiscale, NetViz, and generated relay configs usable from another machine on the VPN while local coturn is running.

### ComputeManager WASM runtime gate
- Command: `node --test peercompute/tests/unit/computeManager.wasm.test.js`
- Purpose: verify `ComputeManager` can execute pure WASM tasks, memory-view IO, result adapters that emit `commitDelta`, and hybrid `wasm-webgpu` host modules without regressing the existing inline fallback path.
- Gate: run when changing `peercompute/src/peercompute/computeManager/**`, new compute workload descriptors, or compute README examples.

### ComputeManager worker-bootstrap/stats gate
- Command: `node --test peercompute/tests/unit/computeManager.commitDelta.test.js peercompute/tests/unit/computeManager.worker.test.js`
- Purpose: verify `ComputeManager` bootstraps workers with a Vite-visible module worker by default, honors explicit production worker URL overrides, keeps affinity-keyed task streams on their assigned worker, includes `peercompute.compute.task-execution.v0` in return envelopes for inline and worker paths, records revisioned worker resize status/history, revives retained target worker pools before inline fallback when new task demand arrives, holds queue/idle autoscaling after manual/demo worker resizes, worker/memory/GPU-bounds workload-budget shard counts and item counts from target workers plus resource limits, records submitted/completed/failed task stats by runtime and task family for inline and worker paths, records advisory task-placement intent vs actual local worker/inline execution, can delegate a non-advisory remote placement task through one manager hook with deterministic task-packet hashes, signed task-envelope metadata, provenance, hash verification, optional result validation, and bounded transient retry/backoff accounting, can install and clear placement hooks after construction with `configurePlacementHooks()`, retries executor failures before commit, reports retry exhaustion, rejects mismatched remote provenance, rejects denied validator results before delta commit, rejects denied remote placement before executor dispatch, rejects stalled remote placement through timeout accounting, and falls back inline when a worker fails after task dispatch, so production-style Vite builds do not leave module-based JS compute tasks hanging forever.

### `node --test peercompute/tests/unit/placementAdmissionPolicy.test.js`
- Purpose: verify the reusable placement admission helper accepts trusted high-capacity peers, rejects weak or untrusted peers, rejects underspecified clusters, and integrates with `ComputeManager` by admitting a non-advisory peer task before the remote executor runs.
- Gate: run when changing `peercompute/src/peercompute/computeManager/**` or when debugging demos that use `submitTask({ module, exportName, data })` from built/docs artifacts.

### Solver worker registry gate
- Command: `node --test peercompute/tests/unit/solverRegistry.test.js`
- Purpose: verify physics law/rule workers can declare typed inputs, outputs, conserved fields, timestep policy, validity domains, affinity policy, warm-delta schemas, and placement hints, then run through `ComputeManager.submitSolverTask()` with commitDelta flow.
- Gate: run when changing `peercompute/src/peercompute/computeManager/SolverRegistry.js`, solver descriptors, or solver task submission APIs.

### Multiscale N-body solver gate
- Command: `npm --prefix demos/multiscale run test`
- Optional tree visual command: `env MULTISCALE_SMOKE_URL='https://localhost:5185/?nbodyBodies=128&nbodyMode=tree&nbodyTheta=0.7&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify the executable `nbody-gravity` descriptor resolves to `nbodyGravityTasks.js`, the direct-sum CPU reference solver is deterministic, WebGPU backend wiring remains present, CPU Barnes-Hut mode emits approximation diagnostics and reduces interactions for larger body counts, momentum and energy drift stay within documented test tolerances, and ComputeManager commits solver warm deltas.
- Gate: run when changing `demos/multiscale/src/compute/nbodyGravityTasks.js`, solver descriptor module URLs, or Multiscale Ladder solver telemetry.

### Multiscale stellar-fusion solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Pinned visual command: `env 'MULTISCALE_SMOKE_URL=https://localhost:5185/?stellarGrid=16&stellarCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `stellar-fusion` resolves to `stellarFusionTasks.js`, advances a WebGPU-capable reduced proton-proton-chain/plasma tile with CPU fallback, emits core temperature/density/H-He/fusion-power/luminosity/neutrino diagnostics plus reduced energy/species drift, commits warm deltas through ComputeManager, updates solar/radiation packet state, and renders a visible solar-core overlay in browser smoke.
- Gate: run when changing `demos/multiscale/src/compute/stellarFusionTasks.js`, solar/radiation packet coupling, stellar overlay rendering, adaptive stellar budget/cadence, or solver descriptor module URLs.

### Multiscale magnetosphere/MHD plasma solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Pinned visual command: `env 'MULTISCALE_SMOKE_URL=https://localhost:5185/?magnetosphereGrid=16&magnetosphereCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `magnetosphere-plasma` resolves to `magnetospherePlasmaTasks.js`, advances a WebGPU-capable reduced ideal-MHD/plasma tile with CPU fallback, emits solar-wind pressure, magnetopause radius, reconnection rate, ionization fraction, Alfven speed, current-sheet intensity, divergence-B proxy, and reduced mass/magnetic/plasma energy drift, commits warm deltas through ComputeManager, updates solar/radiation/debris packet state, and renders a visible solar magnetosphere overlay in browser smoke.
- Gate: run when changing `demos/multiscale/src/compute/magnetospherePlasmaTasks.js`, solar/magnetosphere/radiation packet coupling, MHD overlay rendering, adaptive magnetosphere budget/cadence, conservation audit MHD fields, or solver descriptor module URLs.

### Multiscale PIC plasma patch solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Pinned visual command: `env 'MULTISCALE_SMOKE_URL=https://localhost:5185/?picParticles=64&picGrid=12&picCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `pic-plasma-patch` resolves to `picPlasmaPatchTasks.js`, advances a WebGPU-capable reduced particle-in-cell push/deposit patch with CPU fallback, emits charge imbalance, current density, kinetic/field energy, particle escape, reconnection heating, and divergence-E proxy, commits warm deltas through ComputeManager, updates magnetosphere/solar packet state, adds reduced charge audit telemetry, and renders a visible charge-colored PIC overlay in browser smoke.
- Gate: run when changing `demos/multiscale/src/compute/picPlasmaPatchTasks.js`, magnetosphere/PIC packet coupling, PIC overlay rendering, adaptive PIC budget/cadence, conservation audit charge/current fields, or solver descriptor module URLs.

### Multiscale relativistic correction solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Pinned visual command: `env 'MULTISCALE_SMOKE_URL=https://localhost:5185/?relativitySamples=64&relativityCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `relativistic-correction` resolves to `relativisticCorrectionTasks.js`, advances a WebGPU-capable reduced post-Newtonian orbit-shell with CPU fallback, emits speed fraction, Lorentz factor, time dilation, gravitational redshift, perihelion precession, frame dragging, lensing, Shapiro-delay, relativistic energy, and causality-clamp diagnostics, commits warm deltas through ComputeManager, updates solar/galactic/cosmology packet state, adds reduced relativity audit telemetry, and renders a visible relativistic shell overlay in browser smoke.
- Gate: run when changing `demos/multiscale/src/compute/relativisticCorrectionTasks.js`, solar/galactic/cosmology relativity packet coupling, relativistic overlay rendering, adaptive relativity budget/cadence, conservation audit relativity fields, or solver descriptor module URLs.

### Multiscale cosmology expansion solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Pinned visual command: `env 'MULTISCALE_SMOKE_URL=https://localhost:5185/?cosmologySamples=64&cosmologyCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `cosmology-expansion` resolves to `cosmologyExpansionTasks.js`, advances a WebGPU-capable reduced supergalactic expansion/density-contrast tile with CPU fallback, emits scale factor, Hubble rate, density contrast, filament energy, void fraction, structure growth, expansion-work, and Hubble-tension diagnostics, commits warm deltas through ComputeManager, updates cosmology/galaxy packet state, adds reduced cosmology audit telemetry, respects sample/cadence URL overrides, and renders a visible supergalactic web overlay in browser smoke.
- Gate: run when changing `demos/multiscale/src/compute/cosmologyExpansionTasks.js`, supergalactic/cosmology packet coupling, cosmology overlay rendering, adaptive cosmology budget/cadence, conservation audit cosmology fields, or solver descriptor module URLs.

### Multiscale reactive thermal solver gate
- Command: `npm --prefix demos/multiscale run test`
- Purpose: verify `reactive-thermal-cell` resolves to `reactiveThermalTasks.js`, emits reduced fire/steam/temperature/pressure closure outputs, exposes a WebGPU-first backend with CPU fallback status, commits warm deltas through ComputeManager, and updates the surface packet aggregate state.
- Gate: run when changing `demos/multiscale/src/compute/reactiveThermalTasks.js`, surface reactive coupling, or solver descriptor module URLs.

### Multiscale Maxwell solver gate
- Command: `npm --prefix demos/multiscale run test`
- Purpose: verify `maxwell-em` resolves to `maxwellTasks.js`, advances a WebGPU-capable reduced periodic field tile with CPU fallback, emits field diagnostics, commits warm deltas through ComputeManager, and updates galactic packet aggregate state.
- Gate: run when changing `demos/multiscale/src/compute/maxwellTasks.js`, electromagnetic packet coupling, or solver descriptor module URLs.

### Multiscale hydro-atmosphere solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Purpose: verify `hydro-atmosphere` resolves to `hydroAtmosphereTasks.js`, advances a WebGPU-capable reduced moist shallow-water/weather tile with CPU fallback, emits weather diagnostics, commits warm deltas through ComputeManager, updates planet packet aggregate state, and renders a visible planet weather overlay in browser smoke.
- Gate: run when changing `demos/multiscale/src/compute/hydroAtmosphereTasks.js`, planet weather packet coupling, weather overlays, adaptive hydro budget/cadence, or solver descriptor module URLs.

### Multiscale radiation-opacity and heat-feedback solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Pinned visual command: `env 'MULTISCALE_SMOKE_URL=https://localhost:5185/?radiationGrid=16&radiationCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `radiation-opacity` resolves to `radiationOpacityTasks.js`, advances a WebGPU-capable reduced grey-radiation/opacity tile with CPU fallback, emits optical-depth/greenhouse/temperature/heating diagnostics, commits warm deltas through ComputeManager, updates planet/solar packet aggregate state, renders a visible heat/opacity overlay in browser smoke, and feeds finite `surfaceRadiativeHeatFlux` into reactive thermal, combustion plume, SPH material, and membrane-shell kernels.
- Gate: run when changing `demos/multiscale/src/compute/radiationOpacityTasks.js`, radiative packet coupling, reactive/combustion/SPH/membrane heat-flux coupling, heat/opacity overlays, adaptive radiation budget/cadence, or solver descriptor module URLs.

### Multiscale combustion-plume solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Pinned visual command: `env 'MULTISCALE_SMOKE_URL=https://localhost:5185/?combustionGrid=16&combustionCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `combustion-plume` resolves to `combustionPlumeTasks.js`, advances a WebGPU-capable reduced fuel/oxygen/smoke/water tile with CPU fallback, emits fire-area/smoke/fuel/heat/temperature plus smoke-centroid/plume-rise/buoyancy/oxygen/suppression diagnostics, commits warm deltas through ComputeManager, updates surface packet aggregate state, consumes reduced radiative heat flux, hydro wind, and water-contact suppression inputs, and renders a visible wind-biased surface/MPM plume overlay in browser smoke.
- Gate: run when changing `demos/multiscale/src/compute/combustionPlumeTasks.js`, combustion packet coupling, plume overlays, adaptive combustion budget/cadence, radiative heat coupling, water/fire suppression coupling, or solver descriptor module URLs.

### Multiscale SPH material solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Purpose: verify `sph-material` resolves to `sphMaterialTasks.js`, advances a WebGPU-capable reduced material-particle patch with CPU fallback, emits material temperature, ice/liquid/vapor phase mix, boiling/freezing fractions, phase-change-rate and latent-heat proxy, H2O phase-change evidence schema/status/validation/blockers, mass/contact/cooling/spill and impulse-drift diagnostics, commits warm deltas through ComputeManager, updates MPM/surface packet aggregate state, feeds liquid fire contact into surface water-contact suppression, consumes rupture spill impulse from the membrane/balloon state, and renders a visible surface/MPM particle overlay in browser smoke.
- Gate: run when changing `demos/multiscale/src/compute/sphMaterialTasks.js`, SPH/MPM packet coupling, material overlays, water/fire suppression coupling, rupture spill coupling, or solver descriptor module URLs.

### Multiscale membrane-shell solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Pinned visual command: `env 'MULTISCALE_SMOKE_URL=https://localhost:5185/?membraneSegments=16&membraneCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `membrane-shell` resolves to `membraneShellTasks.js`, advances a WebGPU-capable reduced thin-shell ring with CPU fallback, emits pressure-load/heat-flux/stress/strain/damage/integrity/rupture-risk/burst diagnostics, commits warm deltas through ComputeManager, updates balloon packet aggregate state, consumes reduced radiative heat, pressure, temperature, and SPH cooling/contact inputs, and tints the visible balloon shell by rupture risk in browser smoke.
- Gate: run when changing `demos/multiscale/src/compute/membraneShellTasks.js`, balloon/membrane packet coupling, surface shell visualization, adaptive membrane budget/cadence, radiative heat or SPH cooling coupling, or solver descriptor module URLs.

### Multiscale molecular dynamics solver gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Pinned visual command: `env 'MULTISCALE_SMOKE_URL=https://localhost:5185/?molecularAtoms=48&molecularCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `molecular-dynamics` resolves to `molecularDynamicsTasks.js`, advances a WebGPU-capable reduced atom/bond patch with CPU fallback, emits finite atom count, bond count, species, mean bond order, reaction progress, heat-release proxy, pressure, temperature, ionization, charge, reduced energy diagnostics, dipole moment proxy, electrical conductivity proxy, ionic/covalent bond counts, polar-bond fraction, valence saturation, spatial search mode, candidate pair count, bond candidate count, and cell count; reports staged WebGPU neighbor-list kernel telemetry when a browser WebGPU backend is active, including dynamic grid layout, neighbor capacity, candidate/accepted pair counts, overflow counters, ULG source-term application mode, and quantum source-term application mode, with tiled all-pairs reference fallback allowed only as an explicit status; commits warm deltas through ComputeManager; updates molecular/surface packet aggregate state; adds reduced molecular conservation telemetry; initializes counted atom recipes for supported periodic-table symbols; applies valence-costed bond inference with deterministic cell-list candidate search to avoid dense nearest-neighbor clutter; appends new atoms without moving existing live atoms; and renders visible atom/bond overlays in browser smoke. Visual smoke must exercise `setMolecularComposition({ O: 5, H: 10 })`, verify the H10/O5 patch propagates into packet state with ten O-H bonds, then append Na and Cl through `addMolecularAtoms()` and verify the 17-atom packet retains Na/Cl species, reports one ionic bond plus ten covalent bonds, exposes finite dipole/conductivity/valence/search telemetry, renders molecular bond/electrical/search/ULG/quantum rows in the active-layer readout, and fails if the molecular backend silently falls back from `webgpu-molecular-dynamics` on the current Chrome/WebGPU path.
- Na-water qmat stability gate: `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'molecular dynamics (consumes quantum material|qmat barrier)'` must pass the 60-step `O5 H10 Na1` qmat barrier regression. Expected result: the qmat reaction barrier is applied, product stoichiometry remains unavailable, unsupported Na-water candidates are strongly gated, at least four H2O molecules and water triplets remain recognizable, component closure stays mostly closed, and stoichiometry debt remains bounded. This validates reduced bottom-up safety for unsupported chemistry only; it is not a calibrated sodium-water reaction model.
- Charge-equilibration gate: MD diagnostics must expose `peercompute.multiscale.molecular-charge-equilibration.v0` with mode `applied-bond-graph-qeq-relaxation`, finite electronegativity residuals, weighted residuals, charge RMS deltas, transfer magnitude, hardness proxy, and clamp-aware neutralization residuals; propagate the report through `ClosureResult` chemistry and aggregate packets; preserve quantum-coupling influence when orbital closure is active; render `molecular qeq`; and keep neutralization residuals near zero for H10/O5 plus NaCl visual smoke. This validates deterministic reduced QEq-style packet plumbing only, not calibrated charge equilibration.
- Force-energy ledger gate: MD diagnostics must expose `peercompute.multiscale.molecular-force-energy-ledger.v0`, use that ledger as the diagnostic total-energy source, split the current reduced force model into kinetic, thermal, bonded-attraction, bond-strain, electrostatic, repulsion, QEq-residual, and quantum-coupling-bias terms, propagate the ledger through `ClosureState.conserved`, `ClosureResult.chemistry`, aggregate packets, runtime status, upward closure scalars, and render `molecular energy` in molecular/orbital focus views. This validates deterministic reduced energy accounting only, not calibrated force fields or ab initio energies.
- Reaction-ledger gate: MD diagnostics must classify H2O, CO2, and NaCl from the bond graph into `peercompute.multiscale.molecular-reaction-ledger.v0`; expose `molecularSpecies`, `dominantMolecule`, `recognizedMoleculeCount`, `stoichiometryResidualProxy`, and `componentClosureFraction`; propagate the ledger through the shared closure contract and molecular source/sink summaries; keep closed water/NaCl recipe residuals at zero; and show `molecular ledger` in browser visual smoke after the water recipe plus Na/Cl append. The companion event gate must expose `peercompute.multiscale.molecular-reaction-event-ledger.v0`, prove appending NaCl creates one formed-bond event and `moleculeSpeciesDelta.NaCl === 1`, propagate event counts through closure chemistry and packet aggregates, and include the event count in the existing `molecular ledger` HUD row.
- Reaction source-term gate: MD diagnostics must expose `peercompute.multiscale.molecular-reaction-source.v0` from the event ledger and timestep; prove an append-created NaCl event yields positive bond-formation, heat-source, and species-rate proxies; propagate source terms through closure chemistry, packet aggregates, source/sink summaries, runtime status, and packet closure scalars; and include the source proxy in the `molecular ledger` HUD row. These tests validate packet plumbing and deterministic rate math only, not physical kinetics or enthalpy.
- Reaction source consumer gate: reactive thermal and SPH material workers must summarize `reactionSource` from the molecular `ClosureResult`, apply positive source drive and cooling drive to their reduced input adaptation, preserve reaction-source schema/heat/species/source-drive fields in diagnostics, model state, packet aggregates, upward closures, and source/sink summaries, and keep the no-source molecular-closure behavior stable.
- Reaction source reporting gate: conservation audit and cross-scale coupling reports must expose reaction heat-source proxy, species-rate proxy, source drive, cooling drive, and field metadata separately from molecular heat-flux and source/sink residual fields; model tests must assert those values survive packet creation.
- Source/sink balance gate: packets must expose `peercompute.multiscale.molecular-source-sink-balance.v0` with active target count, source/cooling coverage, heat/species residuals, and fanout oversubscription; conservation and coupling exchange fields plus metadata must preserve the balance summary; the balance must publish through `multiscale-source-sink-balances` warm deltas and `window.__multiscaleDemo.getSourceSinkBalanceDeltas()`; visual smoke should keep the compact `molecular balance` row visible in molecular/orbital focus views and verify the state/API surfaces.
- Target mutation apply-execution gate: packets must expose `peercompute.multiscale.molecular-target-mutation-apply-execution.v0` with default blocked/non-mutating status, explicit API/config proxy execution, applied target and operation counts, reduced reactive/SPH aggregate-state after-values, conservation/coupling execution counters, and packet summary fields. Browser visual smoke must run explicit proxy execution once, verify API/state/runtime-debug exposure, and check the `molecular apply exec` row reports `applied-proxy` on a water plus NaCl recipe while documenting that this is not scientific conservative worker-buffer mutation.
- Molecular target-source intake gate: unit and visual smoke coverage must verify explicit proxy apply execution emits `peercompute.multiscale.molecular-target-source-intake.v0`, preserves applied source values and field deltas, reports active target and applied operation counts, exposes finite heat-rate and finite non-negative thermal-drive summaries, feeds reactive thermal and SPH material workers through `molecularTargetSourceIntake`, publishes `multiscale-source-transfer-target-source-intakes` warm deltas through `getSourceTransferTargetSourceIntakeDeltas()` and `getState().sourceTransferTargetSourceIntakeState`, and keeps the `molecular intake` HUD row plus `target intake` telemetry row visible. Heat-rate assertions should allow source or sink signs; a zero thermal drive is valid for a near-balanced source state.
- Molecular target-source response gate: unit and visual smoke coverage must verify reactive thermal and SPH material states can acknowledge that intake through `peercompute.multiscale.molecular-target-source-response.v0`, with matching intake schema/sequence, finite responded/pending counts, response thermal drive, heat-flux response, blocker summaries, packet/upward closure fields, `multiscale-source-transfer-target-source-responses` warm deltas through `getSourceTransferTargetSourceResponseDeltas()` and `getState().sourceTransferTargetSourceResponseState`, plus expanded `molecular response` and `target response` telemetry. Focus HUD should keep source response/reconciliation/source-buffer rows visible for mobile bottom-up inspection.
- Molecular target-source reconciliation gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-target-source-reconciliation.v0` is emitted after target response, links source-intake and target-response schemas, reports active/reconciled/pending targets, sequence mismatch count, finite residuals, residual pass status, warm deltas through `getSourceTransferTargetSourceReconciliationDeltas()` and `getState().sourceTransferTargetSourceReconciliationState`, and telemetry `molecular reconcile` / `target reconcile` rows.
- Molecular target-source response exchange gate: conservation and cross-scale coupling coverage must verify intake/response summaries become typed exchange fields and field metadata, and that molecular reactive/SPH coupling links carry both the full response report and compact summary in adapter context.
- Molecular target-source reconciliation exchange gate: conservation and cross-scale coupling coverage must verify reconciliation summaries become typed exchange fields and field metadata, and that molecular reactive/SPH coupling links carry both the full reconciliation report and compact summary in adapter context.
- Molecular conservative source-buffer gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-conservative-source-buffer.v0` is emitted after reconciliation, links source-equation/source-intake/reconciliation schemas, exposes 8-float source vectors for reactive thermal and SPH material targets, feeds those buffers to target workers, records worker echo acknowledgement fields, publishes `multiscale-conservative-source-buffers` warm deltas through `getConservativeSourceBufferDeltas()` and `getState().conservativeSourceBufferState`, threads conservation/coupling exchange metadata plus adapter context, and keeps the `molecular buffer` row visible in focus and telemetry modes.
- Molecular source-buffer application gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-source-buffer-application.v0` appears after reactive thermal and SPH material workers consume conservative source buffers, records source-vector schema/sequence/stride, before/after target fields, applied target/field/source-term counts, residual telemetry, conservation/coupling exchange rows, adapter context, `peercompute.multiscale.molecular-source-buffer-application-aggregate.v0`, `multiscale-source-buffer-applications` warm deltas, `getSourceBufferApplicationDeltas()`, `getState().sourceBufferApplicationState`, and the `molecular buffer apply` / `buffer apply` rows. Browser smoke should wait for worker acknowledgement after explicit apply before asserting the application aggregate.
- Molecular source-buffer acceptance gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-source-buffer-acceptance.v0` appears after source-buffer application, links source-buffer and application-aggregate schemas, reports accepted/blocked/missing target counts, source-term coverage, field-delta coverage, finite residual telemetry, `canMutateProxy === true` only for reduced proxy acceptance, `scientificMutationReady === false`, conservation/coupling exchange rows, adapter context, `multiscale-source-buffer-acceptances` warm deltas, `getSourceBufferAcceptanceDeltas()`, `getState().sourceBufferAcceptanceState`, and the `molecular buffer accept` / `buffer accept` rows. Browser smoke should wait for target-worker application acknowledgement before asserting acceptance.
- Molecular source-buffer writeback validation gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-source-buffer-writeback-validation.v0` appears after acceptance, links source-buffer/application/acceptance schemas, reports validated/blocked target counts, observed target count, source-term coverage, finite field-delta coverage, finite residual telemetry, `canWritebackProxy === true` only for reduced proxy validation, `scientificWritebackReady === false`, conservation/coupling exchange rows, adapter context, `multiscale-source-buffer-writeback-validations` warm deltas, `getSourceBufferWritebackValidationDeltas()`, `getState().sourceBufferWritebackValidationState`, and the `molecular buffer writeback` / `buffer writeback` rows. Browser smoke should wait for target-worker application acknowledgement before asserting writeback validation.
- Molecular target-buffer replay validation gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-target-buffer-replay-validation.v0` appears after writeback validation, links source-buffer application aggregates and target snapshots, reports replayed/blocked target counts, applied/replayed/missing field counts, finite residual telemetry, `canReplayProxy === true` only for reduced target replay, `scientificReplayReady === false`, conservation/coupling exchange rows, adapter context, `multiscale-target-buffer-replay-validations` warm deltas, `getTargetBufferReplayValidationDeltas()`, `getState().targetBufferReplayValidationState`, and the `molecular buffer replay` / `buffer replay` rows. Browser smoke should wait for target-worker application acknowledgement before asserting replay validation.
- Molecular target-buffer mutation audit gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-target-buffer-mutation-audit.v0` appears after replay validation, links target replay/source-buffer writeback/application schemas, reports ready/blocked target counts, ready/blocked write-intent counts, finite residual telemetry, `canMutateProxy === true` only for reduced write-intent readiness, `canQueueWorkerWrite === false`, `scientificMutationReady === false`, conservation/coupling exchange rows, adapter context, `multiscale-target-buffer-mutation-audits` warm deltas, `getTargetBufferMutationAuditDeltas()`, `getState().targetBufferMutationAuditState`, and the `molecular buffer mutate` / `buffer mutate` rows. Browser smoke should wait for replay validation before asserting mutation audit readiness.
- Molecular target-buffer worker-write queue gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0` appears after mutation audit, links mutation audit/replay/writeback/application schemas, reports ready/blocked target-batch counts, ready/blocked/queued/dispatched/applied write-intent counts, finite residual telemetry, `canPlanWorkerWrite === true`, `canQueueWorkerWrite === false`, `scientificMutationReady === false`, conservation/coupling exchange rows, adapter context, `multiscale-target-buffer-worker-write-queues` warm deltas, `getTargetBufferWorkerWriteQueueDeltas()`, `getState().targetBufferWorkerWriteQueueState`, and the `molecular buffer queue` / `buffer queue` rows. Browser smoke should wait for mutation audit before asserting queue planning readiness and should confirm no worker write is queued or applied.
- Molecular target-buffer worker-write execution gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0` appears after queue planning, defaults to blocked/non-mutating, links queue/mutation audit/replay/writeback/application schemas, explicitly applies reduced target writes only when requested through the browser API/config, reports applied/blocked target-batch counts, applied/skipped write-intent counts, finite residual telemetry, `workerWriteExecuted === true` only for the explicit proxy path, `scientificMutationReady === false`, conservation/coupling exchange rows, adapter context, `multiscale-target-buffer-worker-write-executions` warm deltas, `getTargetBufferWorkerWriteExecutionDeltas()`, `getState().targetBufferWorkerWriteExecutionState`, and the `molecular buffer writer` / `buffer writer` rows. Browser smoke should wait for queue readiness, execute the proxy writer, then confirm the packet and warm delta stay in the applied proxy state.
- Molecular target-buffer worker-write verification gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-target-buffer-worker-write-verification.v0` appears after explicit proxy execution, links execution/queue/mutation audit/replay/writeback/application schemas, compares executed field writes against current target snapshots, reports verified/blocked target-batch counts and verified/skipped/missing/mismatched field-write counts, finite residual telemetry, `verified === true` only for matching proxy writes, `scientificMutationReady === false`, conservation/coupling exchange rows, adapter context, `multiscale-target-buffer-worker-write-verifications` warm deltas, `getTargetBufferWorkerWriteVerificationDeltas()`, `getState().targetBufferWorkerWriteVerificationState`, and the `molecular buffer verify` / `buffer verify` rows. Browser smoke should execute the proxy writer, then confirm packet, warm delta, runtime-debug, conservation, coupling, and API state all agree.
- Molecular scientific readiness manifest gate: unit and visual smoke coverage must verify `peercompute.multiscale.molecular-scientific-readiness-manifest.v0` appears downstream of the scientific invariant gate, reports required/proxy-satisfied/authoritative-ready/blocked artifact counts, keeps `scientificMutationReady === false`, `manifestComplete === false`, and `authoritativeReadyArtifactCount === 0`, names `authoritative-gpu-worker-buffer-writer` as the next required artifact, publishes `multiscale-scientific-readiness-manifests` warm deltas through `getScientificReadinessManifestDeltas()` and `getState().scientificReadinessManifestState`, appears in runtime-debug warm-delta counters and packet aggregate state, and renders `molecular sci manifest`. Browser smoke should verify both default blocked state and explicit proxy-write verified state remain scientifically blocked.
- Gate: run when changing `demos/multiscale/src/compute/molecularDynamicsTasks.js`, molecular packet coupling, atom/bond overlay rendering, adaptive molecular budget/cadence, conservation audit molecular fields, or solver descriptor module URLs.

### Multiscale quantum orbital closure gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Purpose: verify `peercompute.multiscale.quantum-orbital-closure.v0` reports a deterministic electron configuration and active screened hydrogenic orbital from the Schrodinger element/orbital reference modules, including finite effective nuclear charge, orbital energy, norm error, ionization energy/fraction, valence/unpaired electron counts, electronegativity, polarizability, dielectric/conductivity proxies, bonding tendency, and a shared `ClosureResult`. The gate also verifies the model-local baseline `peercompute.multiscale.quantum-orbital-finite-grid.v0` summaries for grid size/sample count, normalization drift, boundary mass, radius moments, extent, and spacing; `peercompute.schrodinger.radial-finite-difference-eigensolver.v0` summaries for finite one-electron radial energy, analytic-energy error, residual, mean radius, grid point count, and node counts; and `peercompute.multiscale.quantum-orbital-eigen-residual.v0` summaries for finite relative L2 residual, weighted energy drift, max residual, status, and interior sample count. Oxygen must classify as `polar-covalent-acceptor` rather than metallic, chlorine must classify as `ionic-acceptor`, and the UI/API must switch element, `n`, `l`, `m`, grid size, electric field, and magnetic field. The executable solver gate must verify `quantum-orbital-grid` is registered under the shared `ComputeManager`, emits `peercompute.multiscale.quantum-orbital-grid.result.v0` / `.delta.v0`, commits a solver warm delta, appears in adaptive budget/cadence/placement telemetry, uses `webgpu-only-no-cpu-fallback`, blocks Node/no-adapter or disabled-WebGPU calls with `blocked-webgpu-unavailable` and no finite-grid payload, and, when browser WebGPU is available, reports `webgpu-orbital-grid-probability-evaluation` with `workgroup-probability-evaluation-reduction`, `peercompute.multiscale.quantum-orbital-grid.eigen-residual-webgpu.v0`, `peercompute.multiscale.quantum-orbital-grid.wavefunction-evolution-webgpu.v0`, `peercompute.multiscale.quantum-orbital-grid.hamiltonian-components-webgpu.v0`, `peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0`, `peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0`, `peercompute.multiscale.quantum-orbital-grid.statistical-bridge-webgpu.v0`, and `peercompute.schrodinger.radial-webgpu-eigensolver.v0` with finite GPU-derived values and no CPU parity/fallback telemetry. Browser smoke must see those worker values in `upward.aggregateState.quantumOrbital`, `upward.closures.quantum*`, `upward.closureResults.quantumOrbital`, and active-layer readout rows `quantum basis`, `quantum shell`, `quantum EM`, `quantum grid`, `quantum residual`, `quantum worker`, `quantum evolve`, `quantum qgrid stat`, `quantum radial`, and `quantum closure`, including electric-field, field-energy, dipole, polarizability, Stark-shift proxy, magnetic-field, Zeeman-energy, magnetic-moment, magnetic-response schema, partition/occupation, heat-capacity, ionization, opacity, degeneracy, ensemble-pressure, and statistical source proxy fields.
- Gate: run when changing `demos/multiscale/src/simulation/quantumOrbitalClosure.js`, orbital packet coupling, Schrodinger element/orbital imports, closure publication, or orbital/molecular readout rows.

### Multiscale closure contract gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Purpose: verify molecular dynamics, reactive thermal, SPH material, and reduced quantum orbital outputs normalize into `ClosureState -> ClosureResult` summaries with thermodynamic, latent-heat proxy where applicable, transport, mechanics/phase/chemistry/electromagnetics, validity, uncertainty, provenance, and conservation fields; verify reactive thermal and SPH can consume the molecular closure as a reduced bottom-up source; verify consumed molecular source keys, thermal drive, heat-release proxy, ionization, and heat-flux boosts remain visible in packet aggregate/closure fields, cross-scale coupling links, conservation exchange rows, and field metadata; verify `peercompute.multiscale.molecular-source-sink.v0` reports name reactive/SPH targets and preserve reduced energy/species residual proxies plus reaction-ledger stoichiometry residuals; verify `peercompute.multiscale.molecular-reaction-ledger.v0` molecular species and dominant-molecule fields plus `peercompute.multiscale.molecular-reaction-event-ledger.v0` event counts and molecule deltas propagate through closure chemistry; and verify browser packets plus `StateManager` expose closure summaries as `multiscale-closures` warm deltas.
- Quantum-to-MD coupling subgate: tests must verify `peercompute.multiscale.quantum-orbital-wavefunction-evolution.v0`, `peercompute.multiscale.quantum-orbital-grid.wavefunction-evolution-webgpu.v0`, `peercompute.multiscale.quantum-orbital-grid.hamiltonian-components-webgpu.v0`, `peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0`, `peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0`, and `peercompute.multiscale.quantum-orbital-grid.statistical-bridge-webgpu.v0` survive molecular quantum-coupling normalization, produce finite positive `wavefunctionEvolutionDrive` / `quantumEvolutionDrive` plus bounded `quantumStatisticalBridgeDrive` values for matched atoms, convert to `peercompute.multiscale.molecular-quantum-source.v0`, bias reduced MD charge/ionization/bond-order telemetry without breaking valence closure, appear in `upward.closureResults.molecularDynamics`, packet aggregate state, runtime status, conservation telemetry, and the `molecular quantum` / `molecular qgrid stat` rows, and stay visible in browser smoke for the `H10 O5` water recipe. Browser smoke must assert the live WebGPU path reports `quantumCouplingApplicationMode: "webgpu-neighbor-integrate-quantum-source-term"`, `quantumCouplingWebgpuKernelApplied === true`, `quantumWavefunctionEvolutionSource: "webgpu-worker"`, finite kinetic/potential/component/virial telemetry from the WebGPU Hamiltonian reducer, finite electric-field/field-energy/dipole/polarizability/Stark proxy telemetry from the WebGPU field-response reducer, finite magnetic-field/Zeeman-energy/magnetic-moment telemetry from the WebGPU magnetic-response reducer, radial Schrodinger WebGPU source/residual telemetry, and finite qgrid statistical-bridge partition/heat-capacity/ionization/source-delta fields; CPU/no-adapter mode is only a regression path.
- Gate: run when changing `demos/shared/closureContract.js`, solver closure adapters, packet closure output, or closure warm-delta publication.

### Multiscale quantum material-potential gate
- Command: `node --test --test-name-pattern "model emits solver-agnostic multiscale packets|quantum material potential provides|quantum material potential worker evaluates|ComputeManager runs executable quantum material" demos/multiscale/tests/multiscaleModel.test.mjs`
- Visual command: `env MULTISCALE_SMOKE_URL='https://localhost:5185/?molecularO=5&molecularH=10&molecularCadence=2&quantumGridCadence=2&quantumMaterialCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `peercompute.multiscale.quantum-material-potential.v0`, qmat force-preview telemetry, qmat law-graph fragments, packet-level `peercompute.multiscale.law-graph-update-plan.v0`, reduced `peercompute.multiscale.law-graph-consistency-solve.v0` fixed-point telemetry, `peercompute.multiscale.law-graph-proposal-admission.v0` proposal-admission telemetry, `peercompute.multiscale.law-graph-dispatch-queue.v0` scheduler-facing queue telemetry, `peercompute.multiscale.law-graph-scheduler-manifest.v0` descriptor-resolution telemetry, `peercompute.multiscale.law-graph-scheduler-execution-audit.v0` runtime/warm-delta evidence telemetry, `peercompute.multiscale.law-graph-result-admission.v0` proxy result-admission telemetry, and `peercompute.multiscale.law-graph-state-application-preflight.v0` application-readiness telemetry. The gate must prove ordinary water-like proxy state converges at the proxy residual level, unsupported sodium-water chemistry remains proxy-blocked, scientific residuals stay explicit, proposed state updates are surfaced without authoritative mutation, StateManager warm-delta and ComputeManager dispatch admissions are counted, dispatch queue entries/batches expose ComputeManager/model-local readiness without submitting work, scheduler-manifest entries resolve qmat/MD/reactive/SPH/orbital ComputeManager descriptors with zero unresolved compute descriptors, scheduler-execution audit reports evidence unavailable when no runtime evidence is supplied and observed runtime/warm-delta matches when evidence is supplied, result admission reports proxy-admitted runtime plus warm-delta evidence without authoritative mutation, state-application preflight maps proxy-admitted worker results to StateManager application targets without mutation, and the browser API/readout/warm-delta path exposes `getLawGraphUpdatePlan()`, `getLawGraphConsistencySolve()`, `getLawGraphProposalAdmission()`, `getLawGraphDispatchQueue()`, `getLawGraphSchedulerManifest()`, `getLawGraphSchedulerExecutionAudit()`, `getLawGraphResultAdmission()`, and `getLawGraphStateApplicationPreflight()`.
- Purpose: verify the Schrodinger/orbital layer publishes `peercompute.multiscale.quantum-material-potential.v0` as the lower-layer property/behavior contract for atoms and molecules. The gate checks color/size/orbital descriptors, reference property packets, density/phase, bulk and Young modulus fields, optical/electrical/electromagnetic fields, nuclear fields, bond-strength terms, condition propagation from ambient temperature/pressure/gravity/fields, behavior hooks for phase/thermal/mechanical/EM/chemical responses, `peercompute.multiscale.quantum-material-force-surface-preview.v0` reduced Morse-style bond potential/force-gradient/curvature telemetry, `peercompute.multiscale.quantum-material-reaction-barrier-surface.v0` reduced activation/gate/blocker telemetry, `peercompute.multiscale.law-graph-fragment.v0` state/law/constraint nodes, and explicit unavailable flags for calibrated Born-Oppenheimer force gradients, charge-transfer dynamics, calibrated potential-energy surfaces, product stoichiometry, and reaction networks. It also verifies `quantumMaterialPotentialTasks.js` creates material/atom/bond records, evaluates `peercompute.multiscale.quantum-material-potential.concurrent-batch.v0` through a WebGPU-only storage-buffer batch, reports `blocked-webgpu-unavailable` with `webgpu-only-no-cpu-fallback` and no fake batch when no adapter is available, commits solver warm deltas through the shared `ComputeManager`, and surfaces backend/record-count/behavior-drive/force-preview/barrier/law-graph telemetry in packet/HUD state on the live browser WebGPU path. Na plus water must be reported as `property-ready-reaction-blocked` with required artifacts and a blocked law-graph constraint; until product stoichiometry and reaction energetics exist, MD must preserve seeded water topology rather than faking Na-water products or letting water disintegrate.
- Gate: run when changing `demos/multiscale/src/simulation/quantumMaterialPotential.js`, `demos/multiscale/src/compute/quantumMaterialPotentialTasks.js`, solver descriptors, adaptive budget/governor/scheduler placement, Schrodinger material property packet imports, orbital closure publication, molecular-to-quantum coupling, molecular lower-law dependency scheduling, or the `quantum material` readout row. Keep qmat broad event promotion disabled unless source-buffer readiness is revalidated; use the active-molecular dependency candidate path to warm missing qgrid/qmat evidence for MD instead.

### Multiscale law graph consistency/update-plan gate
- Command: `node --test --test-name-pattern "model emits solver-agnostic multiscale packets|quantum material potential provides|quantum material potential worker evaluates|ComputeManager runs executable quantum material" demos/multiscale/tests/multiscaleModel.test.mjs`
- Visual command: `env MULTISCALE_SMOKE_URL='https://localhost:5185/?molecularO=5&molecularH=10&molecularCadence=2&quantumGridCadence=2&quantumMaterialCadence=2&autoScaleWorkloads=false' npm --prefix demos/multiscale run test:visual`
- Purpose: verify `peercompute.multiscale.law-graph-consistency.v0` assembles the current bottom-up graph from qmat, environment, orbital closure, molecular dynamics, molecular source-buffer, reactive/SPH source consumers, cross-scale coupling, conservation audit, molecular scientific invariant gate, and readiness manifest. The gate checks packet schema/model id, state/law/constraint/edge counts, qmat fragment preservation, a quantum-material-to-MD edge, upward closure scalar counts, `peercompute.multiscale.law-graph-update-plan.v0` operation/phase/dispatch/residual/readiness counts, `peercompute.multiscale.law-graph-dispatch-queue.v0` queue-entry/batch/next-action counts, `peercompute.multiscale.law-graph-scheduler-manifest.v0` scheduler lane/descriptor/export/warm-delta/state-application counts, `peercompute.multiscale.law-graph-scheduler-execution-audit.v0` runtime/warm-delta evidence counts, `peercompute.multiscale.law-graph-result-admission.v0` proxy result-admission counts, `peercompute.multiscale.law-graph-state-application-preflight.v0` proxy application-ready/state-link counts, `multiscale-law-graph` warm-delta/API exposure, proxy consistency for the default water path, scientific-readiness blockers for proxy-only artifacts, and proxy blocking when sodium-water chemistry lacks the required charge-transfer/barrier model.
- Gate: run when changing `demos/multiscale/src/simulation/lawGraph.js`, `demos/multiscale/src/simulation/lawGraphUpdatePlan.js`, `demos/multiscale/src/simulation/lawGraphDispatchQueue.js`, `demos/multiscale/src/simulation/lawGraphSchedulerManifest.js`, `demos/multiscale/src/simulation/lawGraphSchedulerExecutionAudit.js`, `demos/multiscale/src/simulation/lawGraphResultAdmission.js`, `demos/multiscale/src/simulation/lawGraphStateApplicationPreflight.js`, qmat law-graph fragments, packet assembly, cross-scale coupling/conservation reports, molecular scientific readiness gates, runtime debug, NetViz metadata, or `law graph` readout/API state.

### Multiscale conservation audit gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Purpose: verify `peercompute.multiscale.conservation-audit.v0` packets expose finite reduced mass, energy, and species residuals, water inventory including released spill water, solver drift, stellar-fusion exchange, magnetosphere/MHD exchange, PIC charge/current exchange, relativistic redshift/lensing/time-dilation exchange, cosmology scale/Hubble/filament/void exchange, membrane rupture exchange, SPH spill/kinetic-drift exchange fields, molecular-closure reactive/SPH heat-source exchange fields, molecular source/sink energy/species residual fields, molecular source/sink balance coverage/residual fields, molecular source-equation packet basis/rate fields, optional compute-resize conservation residuals, tracked coupling metadata for cosmology/stellar/magnetosphere/PIC/relativity/radiation/combustion/reactive/SPH/membrane/molecular-closure/molecular-source-sink/molecular-source-sink-balance/compute-resize exchange, and `peercompute.multiscale.field-metadata-report.v0` entries for residual and exchange fields, and that `StateManager` exposes `multiscale-conservation` plus `multiscale-source-sink-balances` warm deltas through the browser state API.
- Gate: run when changing `demos/multiscale/src/simulation/conservationAudit.js`, packet conservation output, conservation warm-delta publication, cross-solver coupling fields, or visual smoke packet assertions.

### Multiscale cross-scale coupling report gate
- Command: `npm --prefix demos/multiscale run test`
- Visual command: `npm --prefix demos/multiscale run test:visual`
- Purpose: verify `peercompute.multiscale.cross-scale-coupling.v0` packets expose structured source/target handoff links, upward/downward direction counts, strongest links, environment forcing, refinement requests, validity, uncertainty, provenance, `peercompute.multiscale.field-metadata-report.v0` endpoint metadata with unit/dimension/unitStatus counts, `peercompute.multiscale.field-compatibility-report.v0` adapter-required counts with zero critical physical dimension errors on the current proxy ladder, `peercompute.multiscale.field-adapter-plan.v0` identity/stub/blocked/conversion/named-response counts plus ready identity, named molecular reactive thermal source, named thermal ignition, named SPH water suppression, named membrane rupture spill, named combustion plume weather, named radiation surface heat, named stellar radiation pressure, named Maxwell magnetosphere boundary, and named PIC kinetic/MHD reconnection feedback adapters, `peercompute.multiscale.field-transfer-report.v0` executed/skipped/blocked/named transfer counts plus scalar predicted-target residuals for ready adapters, dry-run conservative-transfer allocation context in the molecular reactive thermal transfer preview, runtime/readout `field adapters` and `field transfer` visibility, and warm `multiscale-couplings` deltas for molecular/reactive/combustion/SPH/membrane/weather/radiation/stellar/magnetosphere/PIC/relativity/cosmology proxy coupling.
- Gate: run when changing `demos/multiscale/src/simulation/crossScaleCoupling.js`, packet coupling output, coupling warm-delta publication, runtime-debug/readout coupling rows, NetViz metadata, or visual smoke packet assertions.

### Local relay launcher smoke
- Command: `timeout 20s env DEV_OPEN_OVERVIEW=0 PEERCOMPUTE_NO_OPEN=1 RELAY_IMPL=node bash scripts/dev-local-relay.sh`
- Purpose: verify local dev launcher emits loopback-safe relay env (`RELAY_PUBLIC_HOST=localhost`, `RELAY_LISTEN_HOST=127.0.0.1`) and writes fresh per-demo `relay-config.json` files.
- Expectation: launcher uses strict ports by default (`DEV_STRICT_PORT=1`) so demo port conflicts fail fast instead of silently rebinding to alternate ports.
- Gate: run when changing relay/dev launcher scripts (`scripts/dev-local-relay.sh`, `scripts/dev-all.sh`).

### Relay ICE config sanity check
- Command: `rg -n "stun:stun\\.l\\.google\\.com:19302|turn:secretworkshop\\.net:3478\\?transport=(udp|tcp)" config/relay.json`
- Purpose: verify production relay defaults include Google STUN and coturn UDP/TCP URLs in `webrtc.iceServers`.
- Gate: run when changing `config/relay.json`, `config/relay.env`, or relay config generation scripts.

### Coturn installer script sanity check
- Command: `bash -n scripts/install-coturn-systemd.sh`
- Purpose: verify coturn systemd installer script stays syntactically valid.
- Gate: run when changing coturn service install automation or related README deployment steps.

### Backend server regression gate
- Command: `npm run test:backend`
- Purpose: verify `start-turn-prod.sh` renders managed coturn config from env/config defaults, `pcserver.sh` mode selection stays correct, backend shell scripts remain syntactically valid, the relay systemd installer still targets `pcserver.sh` at `multi-user.target`, and release docs/scripts continue to reference the backend stack.
- Gate: run when changing backend launch scripts, TURN defaults, package backend scripts, deployment docs, or relay systemd installer behavior.

### Production frontend relay-config freshness check
- Command: `python3 - <<'PY'`
- Command: `import json, ssl, urllib.request`
- Command: `ctx = ssl.create_default_context()`
- Command: `demos = ['netviz', 'cubechat', 'sneakywoods', 'hyperborea', 'daddygo']`
- Command: `for demo in demos:`
- Command: `    source_url = f'https://metaversejs.github.io/peercompute/{demo}/relay-config-source.json'`
- Command: `    cfg_url = f'https://metaversejs.github.io/peercompute/{demo}/relay-config.json'`
- Command: `    try:`
- Command: `        with urllib.request.urlopen(source_url, context=ctx, timeout=10) as r:`
- Command: `            source = json.load(r)`
- Command: `        assert source.get('relayConfigUrl') == 'https://secretworkshop.net/peercompute/config/relay-config.json'`
- Command: `    except Exception as exc:`
- Command: `        raise SystemExit(f'{demo}: missing/invalid relay-config-source.json: {exc}')`
- Command: `    with urllib.request.urlopen(cfg_url, context=ctx, timeout=10) as r:`
- Command: `        cfg = json.load(r)`
- Command: `    bootstrap = ' '.join(cfg.get('bootstrapPeers') or [])`
- Command: `    assert 'localhost' not in bootstrap, f'{demo}: stale localhost bootstrap {bootstrap}'`
- Command: `print('prod relay-config freshness OK')`
- Command: `PY`
- Purpose: verify the live GitHub Pages demos ship `relay-config-source.json` pointing at `https://secretworkshop.net/peercompute/config/relay-config.json` and no longer fall back to stale localhost bootstrap peers.
- Gate: run after any GitHub Pages demo build/deploy or when debugging prod frontend connectivity against the production relay.

### Production Go relay advertised-address verification
- Manual gate after any Go relay restart or `peercompute/src/relay-go/main.go` change.
- Open deployed NetViz against prod and evaluate `window.__NETVIZ__?.getStatus?.()` in the browser console.
- Expectation: `addrs` should include public `/dns4/secretworkshop.net/tcp/443/wss/.../p2p-circuit...` or `/dns6/...` entries, not `[]`.
- Expectation: neither `addrs` nor `announceAddrs` should contain `/ip4/127.0.0.1`, `/dns4/localhost`, or other loopback relay addresses.
- Expectation: after the relay-advertisement fix, browser bootstrap/reservation logs should no longer depend on synthetic fallback announce addrs just to remain dialable.

### Overview link-mode check
- Command: `npm run build && rg -n "data-demo-dir|window\\.location\\.port === '4173'|relativeTarget" docs/index.html`
- Purpose: verify demo overview links are production-folder based by default and only switch to dev-port routing on docs dev port `4173` (or explicit query override).
- Expectation: production deploys use folder routes like `./<demo>/...`; local docs dev keeps port-based navigation.
- Gate: run when changing `docs/index.html` demo-card link wiring or overview link-generation logic.

### Overview tile order check
- Command: `node -e "const fs=require('fs'); const html=fs.readFileSync('docs/index.html','utf8'); const names=[...html.matchAll(/<h2>([^<]+)<\\/h2>/g)].map((m)=>m[1]); const expected=['PeerCompute (GitHub)','CubeChat','Universes','Multiscale Ladder','PlanetGen','NetViz','Fano Reactor','Schrodinger','SneakyWoods','Daddy Go!','Dynamics (WebGpuPhys)','MPM Visual (WebGpuPhys)','PPF Contact Solver (WebGpuPhys)','Hyperborea']; if (!expected.every((label, i) => names[i]===label)) { console.error('Tile order mismatch:', names.slice(0, expected.length)); process.exit(1);} console.log('Overview tile order OK');"`
- Purpose: ensure the overview cards in `docs/index.html` remain in the expected user-facing sequence.
- Gate: run whenever adding/removing/reordering overview cards.

### Direct-path runtime check
- Command: `npm --prefix peercompute run test:direct-path`
- Purpose: verify payload flow survives relay disruption and confirms relay-independent peer path.
- Gate: run whenever relay-drop/direct classification logic changes.

### NetViz runtime scale check
- Command: `node peercompute/tests/runtime/netviz-scale.mjs --peers <N> --dropRelay true --retention sqrt --retentionMin 2 --radius <R> --maxConnections <M> --targetConnections <T> --settle <MS>`
- Purpose: detect relay churn, isolation, and direct/relay mix under multi-peer load.
- Notes:
- Ensure `https://localhost:5182/` is free before running (harness currently expects 5182).
- Capture `[NetworkManager] ICE candidate`, `Connection upgraded`, and `Connection closed` logs when diagnosing churn.
- Expectation for `--maxConnections 3 --targetConnections 2 --dropRelay true --retention logn --retentionMin 2`:
: relay retention should converge to a minority of keepers rather than every node holding bootstrap relay, and average raw connections should stay below the old over-cap repro (~3.67 in the broken state).

### NetViz relay-overlay gate
- Command: `node --test demos/netviz/tests/relayOverlay.test.js`
- Purpose: verify NetViz only draws the light-blue relay/pubsub line when telemetry shows an active direct relay transport neighbor (`connectedAt` + direct signaling/transport), instead of any generic relay association.
- Gate: run when changing `demos/netviz/src/main.js`, `demos/netviz/src/relayOverlay.js`, or relay-line visualization semantics.

### Multiplayer runtime gate

- Command: `npm run test:runtime:p2p`
- Purpose: validate the built docs bundles for all multiplayer demos plus NetViz attach against a local Go relay, including CubeChat media/screen-share negotiation plus bidirectional theme/room-directory convergence, Hyperborea replicated remote-player visibility, SneakyWoods room presence, DaddyGo score replication, and NetViz attach-session discovery.
- Notes:
: `demos/tests/runtime-p2p.mjs` now clears built `relay-config-source.json` files before injecting local relay configs so the harness does not accidentally bootstrap against the live production relay.
: `RUNTIME_P2P_DEMOS` can be used to run a subset while debugging.
: `RUNTIME_P2P_DOCS_ROOT=/absolute/temp/root` can target fresh temporary builds
  laid out as `<root>/<demo>/`, avoiding mutations to tracked `docs/` output.
: For CubeChat, set `CUBECHAT_REQUIRE_RELAY_MEDIA=1` and supply a relay-only
  `RELAY_WEBRTC_CONFIG` backed by test-owned coturn. The gate then requires
  both application media PCs (not libp2p PCs) to report connected/succeeded
  selected pairs, `iceTransportPolicy=relay`, local and remote `relay`
  candidates, positive bidirectional bytes, and remote media.
: Hyperborea now uses a lightweight `?e2e=1` state surface plus `transportManager.faultTolerance = no-fatal` on its browser nodes so transient circuit-listen timeouts do not abort multiplayer startup before remote-player replication can be observed.

### Production CubeChat multi-peer media gate
- Command: host-run Playwright/Chromium probe against `https://metaversejs.github.io/peercompute/cubechat/?e2e=1&room=<isolated>&privacy=private&password=<pw>`
- Purpose: verify the live GitHub Pages CubeChat bundle can sustain real remote video playback in a private prod room, not just local built-docs playback against a local relay.
- Expectation:
: 3-peer prod rooms should reach `peerCount=2`, `remoteStreamCount=2`, and `remoteVideoReadyCount=2` on every page.
: 4-peer prod rooms are currently a known regression target; until fixed, treat any timeout or partial convergence (`remoteStreamCount < 3` or `remoteVideoReadyCount < 3` on any page) as a prod failure even if the local multiplayer gate passes.
- Gate: run after CubeChat media/signaling changes, after prod frontend deploys that touch CubeChat, or when validating reported live multi-peer regressions.

### Chaos-lab player behavior harness gate
- Command: `npm --prefix net-chaos-lab run test:behavior`
- Purpose: verify the reusable simulated player behavior harness stays deterministic and that the standalone `net-chaos-lab/agent/quake3/` bot stack still normalizes snapshots, resolves personality presets, applies recent-goal/nav memory, routes via nav points, patrols, pursues, retreats, and triggers attack intent as expected.
- Gate: run when changing `net-chaos-lab/agent/player-behavior-harness.mjs`, `net-chaos-lab/agent/probe.mjs`, or demo simulation-profile mappings.
- Companion static gate: `node --test demos/tests/demo-ports.test.js`
: now includes assertions that CubeChat, Hyperborea, and SneakyWoods register shared bot bridges, guarding the cross-demo adapter contract.

### Settings-screen bot host smoke
- Command: host-run headless Chromium against locally served `docs/` pages, open the settings menu in `cubechat`, `hyperborea`, and `sneakywoods`, click `Add Bots`, then inspect `window.__PEERCOMPUTE_BOT_HOSTS__[demoId].getStatus()`.
- Purpose: verify the shared in-browser bot host/runtime wiring stays intact end-to-end, including settings controls, hidden iframe spawn, bot bridge registration, and Quake-style runtime ticks.
- Expectation:
: `totalBots >= 1`, `runningBots >= 1`, and `readyBots >= 1` for each demo after one bot is added.
: `status.bots[0].mode` should settle to a live value such as `patrol` instead of remaining empty.
- Gate: run after changes to `demos/shared/peercomputeBots.js`, demo settings UIs, demo bot-bridge adapters, or bot launch/query handling.

### Current direct-connection diagnosis target
- Symptom: peers upgrade from relay to `webrtc`, then churn/disconnect and re-dial relay.
- Key signal from logs: `No local /webrtc addrs to announce; using relay-scoped WebRTC announce addrs.`
- Interpretation: nodes are not publishing dialable direct `/webrtc` addresses; only relay-circuit paths are advertised.
- Secondary signal: ICE candidates are host-only (`*.local`) and not exposed as stable direct multiaddrs.
- Working hypothesis: "upgraded webrtc" links are mostly relay-signaled `/p2p-circuit/webrtc` paths, not stable direct peer-to-peer addresses.
- Mitigation in progress: `NetworkManager` now caches observed direct `/webrtc` dial targets per peer (TTL-based) and reuses them when subsequent presence payloads are relay-scoped.
- Mitigation in progress: NetViz now samples selected RTC candidate-pair stats and surfaces direct-vs-relay evidence in node diagnostics (`RTC path evidence`) so relay-scoped multiaddrs do not hide successful direct ICE pairs.
- Validation expectation: `window.__NETVIZ__?.getStatus?.().rtcPath.peerConnectionCount` should be non-zero during active WebRTC sessions; if zero while `Connection upgraded ... -> webrtc` logs are present, the diagnostics hook path is still incomplete.
- Visualization expectation: edge transport selection should prefer aggregated peer telemetry (`via`) across both edge directions, so direct links observed by remote peers are still reflected when the local browser lacks a direct socket for that edge.
- Telemetry classification expectation: `NetworkManager` should preserve relay-scoped WebRTC links as `via=relay-webrtc` (not `webrtc`) while `_hasDirectPeerConnections()` remains false unless a true non-relay direct address is present.
- Path-truth expectation: NetViz edges should treat `signalingPath` and `mediaPath` independently so relay-scoped signaling can still render amber when media is direct, and plain relay can render green even if signaling metadata is missing.
- Remote-edge truth expectation: NetViz `TelemetryStore` should ignore older telemetry snapshots (`ts` monotonic) so remote edge color does not regress from direct (`webrtc`) to relay due out-of-order delta arrival.
- Relay-retention small-room expectation: bootstrap relay drop should not be blocked solely by unreachable `targetConnections` when observed dialable peers are fewer; retention should converge toward `logn` keep-count in small swarms.
- Upgrade-attempt expectation: when a peer only has plain relay (`/p2p-circuit/p2p/...`) and no direct targets, `NetworkManager` should still attempt relay-webrtc upgrade dials (`/p2p-circuit/webrtc/p2p/...`) instead of suppressing attempts solely because relay is already present.
- Targeted unit check: `node --test peercompute/tests/unit/networkManager.webrtc.test.js` should include:
: `NetworkManager prefers remembered direct /webrtc targets after prior direct hint`
: `NetworkManager counts relay-webrtc as direct-capable by default`
: `NetworkManager does not block relay drop on unreachable targetConnections in small rooms`
: `NetworkManager requests relay assist only once per throttle window`
: `NetworkManager handles relay-assist-request by reacquiring relay and replying ready`
: `NetworkManager handles relay-assist-ready by forcing immediate redial`
: `NetworkManager requests relay assist on relay-webrtc NO_RESERVATION dial failure`
: `NetworkManager uses relay-scaling topology defaults`
: `NetworkManager uses lightweight defaults for room-directory nodes`
: `NetworkManager computes transport connection max with bootstrap headroom`
: `NetworkManager setConnectionLimits updates connection manager using transport max`
: `NetworkManager presence payload reports non-bootstrap active peers`
: `NetworkManager presence advertises and records peer capabilities`
: `NetworkManager treats direct-capable peers as healthy when gossipsub mesh lags`
: `NetworkManager prunes excess unsolicited peers back to logical maxConnections on topology tick`
: `NetworkManager ignores closed connections for direct/drop decisions`
: `NetworkManager keeps bootstrap relay when elected keeper even with direct peers`
: `NetworkManager keeps bootstrap relay during direct stability hysteresis window`
: `NetworkManager delays relay prune until direct upgrade grace window passes`
: `NetworkManager applies dial backoff after transient webrtc-relay failures`

### Internet chaos lab (new)
- Root: `net-chaos-lab/`
- Goal: reproducible, configurable network simulation for direct-vs-relay behavior and convergence testing.

### Chaos-lab topology requirements
- Dual-stack core with configurable IPv4-only / IPv6-only switches.
- Multiple NAT segments with distinct link characteristics.
- Built-in DNS, HTTPS, relay, and TURN service containers.
- 10-50 browser agents running headless probes.

### Chaos-lab scenario requirements
- Partition isolate/heal actions.
- Bandwidth/delay/loss shifts per segment uplink.
- Agent churn (drop/restore).
- Optional media loopback probe validation.
- Direct-path diagnostics scenario: `net-chaos-lab/configs/scenarios/direct-diagnostics.yaml`.

### Chaos-lab metrics requirements
- Persist probe events to JSONL.
- Compute run summary with connection success rate, media success rate, convergence average/p95, and scenario event count.
- Include direct-path diagnostics in summary:
- direct announce rate
- direct connection rate
- relay-webrtc connection rate
- direct-connection stability sample rate
- peer-set churn/change counts
- direct/relay connection flip counts
- RTC local/remote candidate type aggregates
- probe preflight rates (dns/https/hosts) and infra failure rate
- Serve metrics in a local dashboard (`/api/summary`, `/api/events`).

### Chaos-lab execution gates
- Chaos-lab package gate: `npm --prefix net-chaos-lab run chaos-lab -- --help`
: verifies chaos-lab command ownership remains in `net-chaos-lab/package.json` and root wrappers can stay thin.
- Chaos-lab python deps shortcut metadata gate: `jq -r '.scripts["deps:python"]' net-chaos-lab/package.json`
: validates optional dependency setup command is discoverable without executing heavy installs.
- Dry-run gate: `bash net-chaos-lab/scripts/chaos-lab.sh --mode dry-run --skip-scenario --skip-probes --no-dashboard`
- Unit gate: `PYTHONPATH=net-chaos-lab/src python3 -m unittest net-chaos-lab/tests/test_chaoslab.py`
: includes `test_ip_mode_agents_scope_uses_route_family_toggles` to verify agents-only `ip_mode` uses default-route family switching (`ip route`/`ip -6 route`) rather than filter-drop mutation.
- IPv6 failure triage artifact expectation:
: when `ip_mode=ipv6-only` preflight fails, `payload.network_preflight` should now include router/service fields (`router_ip6_addr`, `router_ip6_route`, `router_ip6tables_forward`, `router_to_service_ipv6`, `service_ip6_addr`, `service_ip6_route`, `service_listeners`).
- Python syntax gate: `python3 -m py_compile net-chaos-lab/src/chaoslab/*.py`
- Matrix gate (multi-scenario + threshold checks): `bash net-chaos-lab/scripts/chaos-lab.sh --matrix net-chaos-lab/configs/matrix/direct-regression.yaml`
: writes matrix-level summary to `net-chaos-lab/artifacts/<matrix-run-id>/matrix-summary.json`.
: expected behavior in non-provisioned/non-root hosts is a controlled failure with gate output; expected behavior in provisioned containernet hosts is full matrix execution with evaluated thresholds.
- NPM matrix shortcut: `npm run chaos-lab:matrix` (non-root wrapper around the same matrix config).
- Cross-demo matrix config gate: `npm run chaos-lab:matrix:demos -- --help`
: validates command wiring for `configs/matrix/demo-regression.yaml` and `probe_mode=peercompute` + simulation argument support.
- Cross-demo matrix containernet shortcut: `npm run chaos-lab:matrix:demos:full`
: same watcher/bootstrap flow as `chaos-lab:matrix:full`, but runs demo-focused matrix scenarios with simulated interactions.
- Probe simulation forwarding unit gate: `PYTHONPATH=net-chaos-lab/src python3 -m unittest discover -s net-chaos-lab/tests -p 'test_chaoslab.py'`
: includes `test_harness_passes_simulation_args_to_probe` to verify `--simulateProfile` and `--simulateMs` are propagated to in-agent probe commands.
- Focused IPv6 triage shortcut: `npm run chaos-lab:ipv6:min`.
: runs containernet with a minimal single-segment topology + `ipv6-only` scenario and default `ip_mode_scope=agents` to isolate agent-family behavior.
: default shortcut now uses lower probe concurrency (`--probe-parallelism 1`) and stronger preflight curl tolerance (`max_time=20`, `attempts=4`, retry delay `1200ms`) to reduce CPU-contention noise while debugging IPv6.
- Focused IPv6 triage infra-stress shortcut: `npm run chaos-lab:ipv6:min:all`.
: same minimal topology/scenario, but forces `CHAOSLAB_IP_MODE_SCOPE=all` to include routers/services in ip_mode stage mutation.
- Focused IPv6 unattended loop shortcut: `npm run chaos-lab:ipv6:loop`.
: repeats minimal ipv6 triage runs with sudo keepalive and per-run summary metrics.
: lightweight validation command: `bash net-chaos-lab/scripts/chaos-lab-ipv6-loop.sh --help`.
- NPM matrix loop shortcut: `npm run chaos-lab:matrix:loop`.
: wraps `matrix:full` in a retry loop; default behavior is unattended repeat-until-pass.
: lightweight validation command (no containernet run): `bash net-chaos-lab/scripts/chaos-lab-matrix-loop.sh --help`.
- NPM matrix watcher shortcut: `npm run chaos-lab:matrix:watch`.
: monitors `net-chaos-lab/artifacts/*/matrix-summary.json` and reports the next completed run (or follows continuously).
: lightweight validation command: `bash net-chaos-lab/scripts/chaos-lab-matrix-watch.sh --help`.
- Matrix smoke gate (headless/local, dry-run): `bash net-chaos-lab/scripts/chaos-lab.sh --matrix net-chaos-lab/configs/matrix/dry-run-smoke.yaml`
: verifies matrix orchestration/gate evaluation without requiring containernet services or browser probing.
: expected result is `probe_total == 0` (no runtime probing in smoke mode).
- Containernet preflight gate: `bash net-chaos-lab/scripts/chaos-lab.sh --mode containernet --skip-scenario --skip-probes --no-dashboard`
: expected behavior in unprovisioned hosts is a fail-fast prerequisite error; expected behavior in provisioned hosts is topology startup with healthy services.
- Root containernet gate (provisioned hosts): `sudo -E env "PATH=$PATH" PYTHON_BIN=/home/$USER/projects/containernet/.venv/bin/python bash net-chaos-lab/scripts/chaos-lab.sh --mode containernet --skip-scenario --skip-probes --no-dashboard`
: use this form to preserve Node 24 path under `sudo` and use containernet venv Python.
- NPM root containernet shortcut: `npm run chaos-lab:full`.
- NPM root matrix shortcut: `npm run chaos-lab:matrix:full`.
: requires an interactive sudo-capable terminal; non-interactive sessions should fail fast with a clear sudo/TTY message.
: default behavior should include `--matrix-stop-on-fail` and `--probe-fail-fast` so long-running containernet matrices abort immediately once infra-only failure is detected.
- Matrix watcher preflight expectation: launcher should clear stale NetViz listeners on the requested watcher port and verify `/chaos-api/api/summary` returns HTTP 200 before matrix execution.
- For watcher runs, always use the printed watcher URL.
- Stale container cleanup shortcut: `npm run chaos-lab:cleanup` (removes lingering `mn.*` containers).
- NetViz chaos overlay dev gate: run NetViz with `?chaosApi=/chaos-api&autoConnect=0` and verify live `/api/summary`, `/api/events`, and `/api/topology` panel updates plus visible chaos topology nodes/links in the 3D view during a chaos-lab run.
- NetViz chaos P2P overlay gate: during an active matrix/full run, verify P2P nodes/edges remain visible in watcher mode (`autoConnect=0`) by consuming latest `probe_result` telemetry from `/chaos-api/api/events`; validate inspector on those nodes/edges reports `Source: chaos probe telemetry` / `P2P Edge ...`.
- NetViz proxy gate: `VITE_CHAOS_API_PROXY_TARGET=http://127.0.0.1:8866 npm --prefix demos/netviz run build` (ensures overlay code and proxy config compile).
- NetViz proxy degradation gate: with an intentionally unreachable proxy target, `/chaos-api/api/summary` should return HTTP `200` with `{..., "degraded": true}` fallback JSON instead of surfacing repeated proxy `500`s in the UI.
- NetViz cross-demo attach gate: run one non-NetViz demo + NetViz on different dev ports, connect NetViz to relay network, ensure "Attach demo" lists active pubsub session beacons and auto-fills topology/room; after attach/reconnect, verify peers and link classifications appear for that demo session.
- NodeKernel NetViz debug unit gate: `node --test peercompute/tests/unit/nodeKernel.netvizDebug.test.js` (validates default debug telemetry settings, telemetry delta publish shape, and attach URL composition).
- NodeKernel NetViz session metadata gate: `node --test peercompute/tests/unit/nodeKernel.netvizDebug.test.js` (also validates provider-backed metadata and metadata preservation for discovered sessions).
- NetViz session runtime inspector gate: after `npm --prefix demos/netviz run build`, run `env NETVIZ_SMOKE_URL=https://localhost:4173/netviz/?render=off npm --prefix demos/netviz run test:session`; the smoke injects Multiscale `peercompute.multiscale.netviz-session.v0` metadata over `peercompute-netviz-debug-v1` and verifies the Session Runtime panel plus `__NETVIZ__.getStatus().attachSessions` metadata preservation.
- NetworkManager NetViz session topic gate: `node --test peercompute/tests/unit/networkManager.webrtc.test.js` (includes additional pubsub topic scope-bypass delivery check for `peercompute-netviz-sessions`).
- NetworkManager logical-cap gate: `node --test peercompute/tests/unit/networkManager.webrtc.test.js` must also cover `maxConnections` reservation behavior across pending topology requests, inbound topology accepts, and in-flight new-peer dials, plus separate reporting for logical peer count vs raw transport connection totals.
- Containernet probe preflight expectation: in matrix/full containernet runs, `preflight_probe_count` should match `probe_total` and `preflight_success_rate` should be > 0 before interpreting direct/relay metrics.
- Containernet routing expectation: NAT routers must have reachability to `core_services.subnet_ipv4/subnet_ipv6`, and service containers must have return routes to NAT uplink subnet(s); otherwise DNS/HTTPS preflight will fail with `infra_failure_rate=1`.
- Containernet service-return-route expectation: service containers must install explicit LAN-subnet routes via each segment router uplink gateway (`ip route ... via <uplink_ip> onlink` and IPv6 equivalent), so HTTPS replies do not blackhole when source traffic is non-SNAT or mixed-mode.
- Containernet interface expectation: docker agents/services must be configured on the Mininet data-plane interface (`<node>-eth0` style via `node.intfNames()`), not Docker bridge `eth0`; otherwise probes time out to core services even when processes are healthy.
- Containernet interface remap expectation: if runtime namespace interfaces are exposed as `ethN` instead of `<node>-ethN`, startup should remap automatically and continue; unresolved data-plane interfaces must fail-fast before probes.
- Container isolation expectation: containernet docker nodes should run with `network_mode=none` so Docker bridge routes do not bypass or pollute Mininet topology routing.
- Container image tooling expectation: all containernet docker nodes must provide the `ip` command (`iproute2`) before topology address/route programming runs; missing `ip` must fail-fast with a clear image-provisioning error (no in-lab apt bootstrap dependency).
- Container image revision expectation: default chaos-lab image should carry the current `org.peercompute.chaoslab.image-rev` label and trigger auto-rebuild when stale (unless `CHAOSLAB_SKIP_IMAGE_BUILD=1`).
- Container privilege expectation: containernet docker agents/services must start with sufficient network capabilities (`NET_ADMIN`/`NET_RAW` or equivalent privileged mode) so interface/address/route programming can succeed.
- Agent route sanity expectation: containernet startup should fail-fast if an agent route to core HTTPS service resolves via Docker bridge `eth0` instead of the configured simulated data-plane interface.
- Core HTTPS reachability expectation: containernet startup should verify that at least one agent per segment can reach core HTTPS `:443`; failures must include service-side diagnostics (`ip addr`, `ip route`, listeners, caddy pid/log tail) to avoid probe-only blind failures.
- Core HTTPS TLS-readiness expectation: service health checks must validate a real HTTPS handshake (`curl -k` with host SNI + IPv4 fallback target), not just open TCP `:443`, before probe cycles begin.
- Agent probe runtime expectation: containernet startup must validate Playwright+Chromium launch inside at least one agent container and fail-fast with a clear image-rebuild hint when package/browser versions drift.
- Agent probe module-resolution expectation: in-agent probe runtime should not depend solely on host-mounted `/workspace/node_modules`; image-provided fallback Playwright module path must be available for containernet agents.
- Host-seeding expectation: `/etc/hosts` seeding for service hostnames must run after agent inventory is populated; `preflight_hosts_entry_rate` should stay above 0 in provisioned containernet runs.
- Containernet probe resilience expectation: if DNS host lookup fails but HTTPS service is reachable via known service IP, probes should continue using IP fallback URL and still emit `network_preflight` diagnostics (do not hard-stop on non-fatal preflight warnings).
- Containernet IP-mode preflight expectation: in `ipv6-only` mode preflight HTTPS checks must force IPv6 (`curl -6`) and prefer IPv6 service fallback addresses; in `ipv4-only` mode they must force IPv4 (`curl -4`) so family-selection ambiguity does not create false infra failures.
- Containernet IP-mode probe URL expectation: in `ipv6-only`/`ipv4-only` stages, in-agent probe navigation should prefer a family-matching literal URL (`https://[ipv6]/...` or `https://ipv4/...`) when service host mappings are known.
- Containernet IPv6 readiness expectation: HTTPS service health readiness should include an explicit IPv6 handshake check (`curl -6`) when service IPv6 is configured, not only localhost/IPv4 checks.
- Containernet IPv6 mode-switch warmup expectation: applying `ip_mode=ipv6-only` to agents should warm gateway/service IPv6 path state (gateway ping and service curl best-effort) before probe cycles.
- Containernet IPv6 mode-switch convergence expectation: agents-only `ip_mode` transitions should set default family routes via verified route programming (same validation path as startup) instead of best-effort route shell writes.
- Containernet router IPv6 forwarding expectation: segment routers should set both global/default IPv6 forwarding and per-interface forwarding (`net.ipv6.conf.<lan>.forwarding=1`, `net.ipv6.conf.<wan>.forwarding=1`) to avoid interface-scope forwarding drift during long runs.
- Containernet IPv6 warmup tuning expectation: `CHAOSLAB_IPV6_WARMUP_TIMEOUT_S` and `CHAOSLAB_IPV6_WARMUP_STEP_MS` should control post-switch agent warmup retry window/cadence.
- Containernet IPv6 warmup safety expectation: neighbor flush during warmup should be opt-in (`CHAOSLAB_IPV6_WARMUP_FLUSH_NEIGH=1`) so default behavior preserves learned NDP state.
- Containernet L2 MAC-stability expectation: agent data-plane interfaces should have unique deterministic MAC addresses per agent to avoid segment bridge FDB flapping and one-agent-only reachability patterns.
- Containernet IPv6 neighbor-seeding expectation: startup and agents-scope `ip_mode` transitions should seed static IPv6 neighbors for agent<->router and router<->HTTPS paths to reduce per-agent `curl_rc=7/28` variance in `ipv6-only` stages.
- Containernet IP-mode safety expectation: `ip_mode` stage switches must not rely on `net.ipv6.conf.*.disable_ipv6` sysctl toggles; mode enforcement should stay in packet filters (`iptables`/`ip6tables`) to avoid destructive IPv6 state loss mid-run.
- Containernet host-forwarding expectation: chaos-lab startup should detect non-`ACCEPT` host `FORWARD` policy and apply temporary `FORWARD=ACCEPT` for `iptables`/`ip6tables` during containernet runtime, then restore previous host policies on shutdown.
- Containernet bridge-netfilter expectation: when host bridge sysctls are available, startup should temporarily set `net.bridge.bridge-nf-call-iptables=0` and `net.bridge.bridge-nf-call-ip6tables=0` during runtime and restore original values on shutdown.
- Containernet router-forwarding expectation: segment NAT routers should reset `FORWARD` chains and seed deterministic allow rules on startup so stale/inherited chain order cannot silently block routed IPv6 flows.
- Containernet IPv6 routing expectation: segment routers should not rely on NAT66; startup should remove stale IPv6 `POSTROUTING MASQUERADE` rules and keep IPv6 path routed/forwarded.
- Containernet IPv6 link-local expectation: interface IPv6 reset steps must preserve link-local addresses (`fe80::/64`) by flushing only `scope global` addresses; removing link-local addresses can destabilize ND/NDP and produce intermittent IPv6 preflight failures.
- Containernet preflight timeout/retry expectation: preflight curl checks should retry transient connect/timeouts (for example rc `7`/`28`) with configurable timeout/backoff using `CHAOSLAB_PREFLIGHT_CURL_MAX_TIME`, `CHAOSLAB_PREFLIGHT_CURL_ATTEMPTS`, and `CHAOSLAB_PREFLIGHT_CURL_RETRY_DELAY_MS`.
- Containernet probe classification expectation: when in-agent probe exits non-zero but still emits valid JSON payload, treat it as a functional probe failure (connection metrics) rather than an infra failure, as long as `network_preflight.ok` is true.
- Direct-path classification expectation: when libp2p connection multiaddrs remain relay-scoped, probe classification and stability sampling should still mark direct connectivity if selected WebRTC candidate pairs show active non-relay (`host/srflx/prflx`) paths; this avoids false `direct_connection_rate=0` and under-reported direct sample rates under successful hole-punching.
- NetViz probe URL expectation: when probe mode is `netviz`, missing URL query fields must be auto-filled with `room=telemetry`, `topologyId=netviz-topology`, `topologyType=distributed`, and `autoConnect=1`; otherwise probes can remain permanently disconnected (`localPeerId=null`) despite healthy preflight.
- NetViz asset freshness expectation: containernet probe runs targeting `https://demos.peercompute.test/netviz/` must ensure `docs/netviz` is refreshed from `demos/netviz` when source files change; stale docs bundles can hide new diagnostics fields and produce false gate failures.
- Relay bootstrap config expectation: containernet relay service must publish a local `wss` bootstrap multiaddr into `/workspace/docs/netviz/relay-config.json` (hosted by in-lab HTTPS service), so probe agents do not inherit stale external relay endpoints.
- Relay bootstrap family expectation: when relay public host is a hostname, generated `bootstrapPeers` should include both `/dns4/...` and `/dns6/...` variants so `ipv4-only` and `ipv6-only` stages can both bootstrap.
- Circuit bootstrap family-selection expectation: `NetworkManager` should prefer `/dns6/` or `/ip6/` bootstrap peers for circuit fallback when local IPv6 is available, and fall back to `/dns4/` or `/ip4/` when it is not.
- Focused unit gate for the above: `node --test peercompute/tests/unit/networkManager.webrtc.test.js`
- Relay ICE expectation: containernet relay-generated `relay-config.json` must include in-lab `webrtc.iceServers` that point at `turn.peercompute.test` (`stun:` + `turn:` URLs with test credentials), so WebRTC candidate gathering does not depend on external internet STUN.
- Mixed-content expectation: when probe pages are served over HTTPS, relay transport must be `wss` (not `ws`) or browser bootstrap can fail silently with `connectionState=connected` but `peerCount=0`.
- Probe WebRTC host-candidate expectation: headless Chromium probes should launch with mDNS host obfuscation disabled (`WebRtcHideLocalIpsWithMdns`) so same-segment direct-candidate behavior can be observed and scored in containernet runs.
- Containernet shell-output parsing expectation: command wrappers must strip terminal control sequences and reliably parse sentinel exit codes so DNS/hosts/curl preflight checks are not contaminated by PTY noise.
- Containernet preflight diagnostics expectation: route checks must preserve non-zero `ip route get` exit codes (no masking with `|| true`) so fallback path failures are actionable.
- Containernet endpoint-selection diagnostics expectation: preflight payloads should include curl-selected remote endpoint details (`curl_remote_ip`, `curl_remote_port`, and fallback equivalents) so IPv4-vs-IPv6 path selection can be validated from artifact logs.
- Containernet IPv6 failure-diagnostics expectation: failed `ipv6-only` preflight payloads should include per-agent snapshots of `ip -6 route show default`, `ip -6 route show`, `ip -6 neigh show`, `ip -6 rule show`, and `ip6tables -L FORWARD -n -v`.
- Containernet IPv6 failure-diagnostics expectation (extended): failed `ipv6-only` payloads should also include `agent_ip6_link`, `agent_ip6_addr`, `router_ip6_neigh_lan`, and `router_ipv6_forwarding`.

### Multiscale Bottom-Up Qmat Source-Buffer Gate
- Local relay/TURN smoke: `npm run backend:dry-run` should report the Go relay
  launcher and coturn config without starting services; `npm run dev:vpn-coturn
  -- --dry-run` should resolve the VPN host and planned `0.0.0.0` listener; an
  ephemeral Go relay smoke with `RELAY_LISTEN_PORT=0`,
  `RELAY_PUBLIC_HOST=100.86.83.35`, and WebRTC ICE config containing
  `stun:stun.l.google.com:19302` plus `turn:100.86.83.35:3478` should start,
  write a temp `relay-config.json`, and be stopped by timeout without leaving a
  listener behind.
- ULG demo handoff packet gate: `node --test peercompute/tests/unit/serviceOrchestration.test.js --test-name-pattern 'ULG demo handoff adapter'`.
: expected result is a full pass proving `peercompute.ulg.demo-handoff.v0` normalizes into `peercompute.ulg.demo-handoff-adapter.v0`, classifies ready MoonLab magnetar calibration summaries, ready Eshkol closure summaries, transferred closure WASM bytes, output-semantics smoke-fixture readiness for executable fixtures, descriptor-only closure readiness for `eshkol.ulg.magnetar-closure-descriptor.v0` fixtures, guarded `computed-fixture` interpolation-table metadata with `scientificValidation = false`, and blocker states for missing calibration, missing transferred bytes, or table scientific overclaims. Live browser smoke should use `window.__multiscaleDemo.applyUlgDemoHandoffForScenario()` with a packet from `window.__ulgDemo.createPeerComputeHandoff()` and verify `scenarioHandoffReady`, descriptor probe readiness for descriptor-only closures, table status/count/hash preservation, host-runtime/output-semantics readiness only for executable smoke fixtures, absence of closure handoff blockers once the descriptor or executable probe is ready, and `scenarioScientificReady: false`.
- ULG handoff service-envelope gate: `node --test peercompute/tests/unit/serviceOrchestration.test.js --test-name-pattern 'ULG handoff service envelope|ULG demo handoff adapter'`.
: expected result is a full pass proving `peercompute.ulg.handoff-service-envelope.v0` wraps a normalized demo handoff with source/provenance metadata, preserves the transfer manifest, exposes content-addressed artifact refs for MoonLab and Eshkol artifacts, reports relay-safe and ready artifact counts, preserves transferred closure WASM byte length/SHA metadata, and blocks envelopes with missing refs, hashes, closure bytes, or module SHA. Live browser smoke should verify `window.__multiscaleDemo.applyUlgDemoHandoffForScenario()` returns `serviceEnvelope.ready === true`, `relaySafeArtifactCount === 2`, `contentAddressedArtifactCount === 2`, and no envelope blockers for the VPN ULG handoff.
- ULG handoff service-host gate: `node --test peercompute/tests/unit/serviceOrchestration.test.js --test-name-pattern 'ULG handoff service host|ULG handoff service envelope|ULG demo handoff adapter'`.
: expected result is a full pass proving `UlgHandoffServiceHost` can run under `WorkerSupervisor`, accept a raw `peercompute.ulg.demo-handoff.v0` task, normalize it into `peercompute.ulg.handoff-service-envelope.v0`, derive MoonLab/Eshkol dispatch tasks with relay-safe artifact refs and transferred WASM metadata, execute those dispatches through either an injected service executor or `createUlgHandoffSupervisorServiceExecutor()`, submit nested tasks to registered `UlgDispatchServiceHost` MoonLab/Eshkol service adapters with `peercompute.ulg.handoff-dispatch-artifact-payload.v0` materialized artifact bodies/summaries and transferred Eshkol WASM bytes, emit typed dispatch service results/artifacts, emit `peercompute.ulg.handoff-service-result.v0`, and store the durable envelope plus dispatch plan/result through the supervisor artifact cache.
- Live ULG handoff service-dispatch API gate: use
  `window.__ulgDemo.createPeerComputeHandoff()` from
  `http://100.86.83.35:5173/`, wait for `artifactCache.list().length >= 2`,
  then call `window.__multiscaleDemo.applyUlgDemoHandoffForScenario(handoff)`
  and `window.__multiscaleDemo.createUlgHandoffServiceDispatchPlan(handoff)` on
  `https://100.86.83.35:5185/?scenario=magnetar`.
: expected result is `peercompute.ulg.handoff-service-dispatch-plan.v0`,
  `dispatch-ready`, `dispatchCount = 2`, `readyDispatchCount = 2`, service ids
  `moonlab-ulg-fixture` and `eshkol-ulg-fixture`, task kinds
  `moonlab.ulg.quantum-response.ingest` and
  `eshkol.ulg.closure-artifact.ingest`, Eshkol transferred WASM byte length
  `53066`, and no dispatch blockers.
- Live ULG dispatch adapter-worker gate: after the dispatch-plan API gate, call
  `window.__multiscaleDemo.runUlgDispatchServiceAdapterProbe(handoff)` on
  `https://100.86.83.35:5185/?scenario=magnetar`.
: expected result is `peercompute.multiscale.ulg-dispatch-service-adapter-probe.v0`,
  `dispatch-adapters-ready`, `ready = true`, `dispatchCount = 2`,
  `executedDispatchCount = 2`, `acceptedDispatchCount = 2`,
  `failedDispatchCount = 0`, service result schema
  `peercompute.ulg.dispatch-service-result.v0` for MoonLab and Eshkol,
  nested artifact refs from `moonlab-ulg-fixture` and `eshkol-ulg-fixture`,
  MoonLab probe schema `peercompute.ulg.moonlab-dispatch-payload-probe.v0`
  with `probeStatus = pass`, Eshkol probe schema
  `peercompute.ulg.eshkol-dispatch-wasm-probe.v0` with `moduleCompiled = true`,
  `importCount = 33`, `exportCount = 1`, `hasEntryExport = true`, Eshkol ingest
  `wasmByteLength = 53066`, MoonLab `magnetarDipoleIsingReady = true`, telemetry schema
  `peercompute.ulg.dispatch-service-telemetry.v0`, and no blockers.
- Live ULG calibrated-reference bridge gate: use `window.__ulgDemo.createPeerComputeHandoff()` from `http://100.86.83.35:5173/` and `window.__multiscaleDemo.applyUlgDemoHandoffForScenario()` on `https://100.86.83.35:5185/?scenario=magnetar`; expected result is `transfer-manifest-ready`, Eshkol magnetar closure descriptor probe readiness with transferred WASM bytes preserved, host-runtime/output-semantics smoke execution validated for the descriptor path, `scientific-tolerance-suite-ready`, tolerance ready `5/5`, calibrated reference ready `4/4`, calibrated scientific ready `4/4`, ready MoonLab `magnetosphere-mhd`, `pic-kinetic-plasma`, `radiation-transport`, and `relativistic-correction` reference entries, blockers including only the runtime gate blocker once handoff prerequisites are present, and `scenarioScientificReady: false`. Follow with `window.__multiscaleDemo.refreshScenarioBoundedProxyRuntimeEvidence()` when browser-visible bounded proxy provenance is required; expected runtime evidence counts are `required=5`, `observed=5`, `proxyOnly=5`, `validated=0`, `missing=0`, with five `sha256:` evidence hashes, five proxy-validation passes, `runtime-evidence-proxy-only`, and scientific runtime gate blocker `proxy-runtime-not-scientific`.
- Live ULG magnetar runtime-smoke gate: use
  `window.__ulgDemo.createPeerComputeHandoff()` from `http://100.86.83.35:5173/`
  and `window.__multiscaleDemo.runUlgDispatchServiceAdapterProbe()` on
  `https://100.86.83.35:5185/?scenario=magnetar`; expected result is
  `dispatch-adapters-ready`, `acceptedDispatchCount = 2`, Eshkol probe
  `deterministic-runtime-smoke-executed`, candidate status
  `deterministic-runtime-smoke-candidate-passed`, entry export `main` invoked
  with offsets `[131072, 131136]`, `entryResult = 0`, declared output tensors
  produced, `changedBytesInDeclaredTensorRange = 64`,
  `deterministic-tensor-runtime-smoke-only`, no candidate blockers, and
  production/runtime/scientific/full-physics flags false.
- Live ULG magnetar scenario-ingestion smoke gate: use the same ULG handoff and
  `window.__multiscaleDemo.applyUlgDemoHandoffForScenario()`; expected result is
  `serviceEnvelope.ready = true`, `serviceDispatchPlan.status = "dispatch-ready"`,
  scenario closure descriptor ready with schema
  `eshkol.ulg.magnetar-closure-descriptor.v0`, closure module probe ready,
  deterministic tensor-offset runtime-smoke metadata ready, transferred WASM
  bytes preserved, no production handler/runtime execution claim, and readiness
  blockers containing only `proxy-runtime-not-scientific` once MoonLab tolerance
  references are complete.
- Live ULG reduced calibrated magnetar runtime gate: after the scenario-ingestion
  smoke gate, call `window.__multiscaleDemo.refreshScenarioCalibratedRuntimeEvidence()`.
  Expected result is `scientificRuntimeEvidence.status = "runtime-evidence-ready"`,
  `validatedCount = 5`, `proxyOnlyCount = 0`, `missingCount = 0`,
  `scientificRuntimeGate.status = "scientific-runtime-ready"`, no handoff
  blockers, and `scenarioScientificReady = true` for the reduced calibrated
  runtime. Keep the demo language explicit that this is reduced calibrated
  runtime evidence, not full-fidelity GRMHD/PIC/radiation transport.
- Live ULG one-call reduced calibrated demo gate: after waiting for ULG
  `telemetry.artifacts` to include both MoonLab and Eshkol, export
  `window.__ulgDemo.createPeerComputeHandoff()` and call
  `window.__multiscaleDemo.runUlgMagnetarCalibratedDemo(handoff)`.
  Expected result is `serviceDispatchPlan.status = "dispatch-ready"`,
  `scientificRuntimeEvidence.status = "runtime-evidence-ready"`,
  `validatedCount = 5`, no handoff blockers, `scenarioScientificReady = true`,
  and `calibratedRuntimeScope.fullFidelityMagnetarSimulation = false`.
- Scientific runtime gate Node gate: `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'scientific runtime gate|magnetar scenario'`.
: expected result is a full pass proving incomplete live-like handoffs report `scientific-runtime-pending`, complete proxy fixtures report `scientific-runtime-blocked`, `proxy-runtime-not-scientific` remains the only blocker once transfer/reference/closure prerequisites are all present, and packet boundary conditions expose runtime gate readiness/status/prerequisite/runtime-evidence fields.
- Runtime evidence manifest hardening gate: `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'bounded proxy runtime evidence|runtime evidence manifest|scientific runtime gate|magnetar scenario records proxy runtime evidence'`.
: expected result is a full pass proving external runtime evidence manifests require `sha256:` evidence hashes for validated entries, require `peercompute.multiscale.scenario-scientific-runtime-validation.v0` with reference/tolerance/runtime-output hashes before scientific entries can clear, reject unknown and duplicate evidence records as `runtime-evidence-invalid`, report incomplete scientific entries as `runtime-evidence-incomplete`, keep proxy entries from clearing the runtime gate, create five hash-bearing bounded proxy entries from the live-facing API, and preserve packet boundary runtime-evidence counts.
- Calibrated reduced runtime evidence gate: `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'calibrated reduced runtime evidence|runtime evidence manifest|scientific runtime gate'`.
: expected result is a full pass proving `createScenarioCalibratedRuntimeEvidenceManifest({ includeCrossFamily: false })` can expose the four-entry reduced solver-family validation set, and default `createScenarioCalibratedRuntimeEvidenceManifest()` validates magnetosphere MHD, PIC kinetic plasma, radiation transport, relativistic correction, and reduced cross-family conservation/coupling telemetry, emits `peercompute.multiscale.scenario-scientific-runtime-validation.v0` validation records with reference/tolerance/runtime-output/evidence hashes, ingests as `validatedCount=5`, clears `proxy-runtime-not-scientific`, and sets `scenarioScientificReady: true` for the reduced calibrated magnetar runtime.

- Focused Node gate: `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'quantum material|qmat|source-buffer|ULG state deltas|molecular closure drives reactive'`.
: expected result is a full pass with qmat property and response-derivative side-band fields active on molecular conservative source buffers, reactive thermal source-buffer consumers, and SPH material source-buffer consumers while keeping `sourceVectorF32.length === 8`.
- Focused qmat product-topology gate: `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'molecular dynamics applies qmat Na-water product topology overlay'`.
: expected result is a full pass proving a `5 O + 10 H + 2 Na` state with qmat Na-water product topology exposes `peercompute.multiscale.quantum-material-product-topology.v0`, applies a reduced bond-graph overlay, reports NaOH and H2 product counts through diagnostics/model/closure/packet/upward scalar fields, emits `peercompute.multiscale.molecular-qmat-product-conservation-audit.v0`, closes reduced Na/O/H product residuals plus qmat heat/charge budget residuals for the diagnostic product graph, emits `peercompute.multiscale.molecular-qmat-product-topology-mutation.v0`, relabels existing atoms into persistent reduced NaOH/H2 product groups, reports mutated atom inventory plus retired water groups, maps GPU-visible topology-buffer fields through model/closure/packet state, and leaves scientific/authoritative worker-buffer product chemistry explicitly blocked.
- Molecular WebGPU topology-buffer gate: `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'molecular dynamics task has a WebGPU-first backend with CPU fallback status'`.
: expected result is a full pass; browser/WebGPU-capable environments must report `atomFloatStride: 13`, topology metadata offset `10`, metadata count `3`, fields `moleculeGroupId`, `moleculeGroupType`, and `moleculeLocalIndex`, plus `topologyMetadataGpuVisible` and `topologyMetadataRoundTripApplied` true. Node/no-adapter environments may still report the existing CPU fallback status.
- Molecular qmat product topology WebGPU-writeback gate: `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'molecular dynamics applies qmat Na-water product topology overlay|molecular dynamics task has a WebGPU-first backend with CPU fallback status'`.
: expected result is a full pass proving `peercompute.multiscale.molecular-qmat-product-topology-gpu-writeback.v0` surfaces through diagnostics/model/closure/packet/upward fields with command stride `4`, header size `4`, target atom count matching the MD atom count, and nonzero command counts when qmat product topology is available. Browser/WebGPU smoke should additionally prove `webgpuKernelApplied === true` for live `O:5 H:10 Na:2`; if the fresh live qmat batch reports `product-source-unavailable`, the next failure to fix is qmat product-surface selection, not the MD writeback pass.
- Build gate: `npm --prefix demos/multiscale run build`.
: expected result is a successful Vite build; the existing large-chunk warning is non-fatal.
- Live browser gate: run the Multiscale HTTPS demo with WebGPU enabled on the molecular layer and a water-oriented recipe. Warm the source-buffer path with `window.__multiscaleDemo.warmMolecularSourceBufferTargets()` or the default `executeMolecularTargetMutationApply()` flow, then verify WebGPU MD reports `cell-neighbor-list`, qmat reports `webgpu-quantum-material-property-batch`, source-buffer schema is `peercompute.multiscale.molecular-conservative-source-buffer.v0`, target qmat schema is `peercompute.multiscale.quantum-material-property-response.v0`, target derivative schema is `peercompute.multiscale.quantum-material-response-derivatives.v0`, source-buffer stride remains `8`, two dispatchable targets carry active qmat thermal/phase/material and derivative drives, warmed reactive reports have at least `27` applied fields, SPH reports have at least `28`, reconciliation has `2` reconciled and `0` pending targets, acceptance/writeback/replay all validate both targets, mutation/queue/worker-write reports carry at least `55` write intents, qmat-specific verification fields pass, explicit reduced proxy writer execution applies all write intents, direct `window.__multiscaleDemo.getState()` source-buffer/writer/readiness reports expose the same current schemas and target/write-intent counts, and the scrollable readout contains `MOLECULAR QMAT BUFFER`, `QMAT DERIV BUFFER`, and `MOLECULAR BUFFER WRITER`. The direct molecular-only invariant is now the same warmed two-target path: when natural reactive/SPH target reports are absent, the warm API must synthesize reduced active target source/sink reports from current qmat MD fields and use qmat side-band evidence for reduced response acknowledgement instead of leaving target application idle.

### Multiscale Quantum-Statistical Source-Equation Gate
- Focused Node gate: `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'quantum material potential|molecular dynamics consumes quantum material force surface|molecular closure drives reactive and SPH material consumers'`.
: expected result is a full pass proving qmat potentials, WebGPU qmat batches, and MD qmat source consumers carry `peercompute.multiscale.quantum-statistical-source-equation.v0` with five channels, `peercompute.multiscale.molecular-source-equation.v0` adapter schema, and pressure/opacity/ionization/degeneracy/temperature/charge/damping source terms.
- Live browser gate: run the Multiscale HTTPS demo with WebGPU enabled on the molecular layer. Expected result is qmat backend `webgpu-quantum-material-property-batch`, MD mode `webgpu-neighbor-integrate-quantum-material-source-term`, `quantumMaterialSourceWebgpuKernelApplied === true`, qmat/MD packet source-equation schema `peercompute.multiscale.quantum-statistical-source-equation.v0`, channel count at least `5`, finite qstat pressure/opacity/ionization/degeneracy/temperature drives, and visible `quantum stat source` / `molecular qmat ... stat` readout text.

### NetViz manual diagnosis checklist
- Confirm `Announce addrs` include non-relay `/webrtc` addresses for direct dialing.
- Confirm `window.__NETVIZ__?.getStatus?.().addrs` is non-empty on prod and shows public relay circuit addresses rather than loopback or localhost.
- Check whether upgraded links are `webrtc` direct vs `relay-webrtc` (`/p2p-circuit/webrtc`).
- Confirm relay redial behavior after `remaining: 0` events.
- Capture at least one successful direct candidate pair from WebRTC stats.
- Verify Display toggles render as expected:
: `Show P2P=on, Show IP=off` -> only live libp2p topology is visible.
: `Show P2P=off, Show IP=on` -> only chaos-lab IP topology overlay is visible.
: both on -> merged overlay view with both topologies.
- Verify camera/navigation ergonomics:
: initial framing supports large overlay runs; max zoom-out can reveal full chaos-lab topology footprint.
- Verify inspector detail richness:
: clicking P2P nodes/edges shows connection mode, bandwidth/rates, and address-family hints.
: clicking IP-topology nodes/edges shows segment/NAT/link-profile metadata.
- Record findings and commands in `plan/log.md`.

### CubeChat startup overlay manual regression check
- Run `npm run dev:local-relay` (or `npm --prefix demos/cubechat run dev`) and open CubeChat on Safari/macOS plus iOS/iPadOS.
- Verify the initial welcome overlay dismisses on tap/click even when pointer lock is unavailable or denied.
- Verify first-start settings menu still appears once and gameplay remains usable after closing it.
- Verify desktop users can still re-enter pointer lock by clicking the canvas after the overlay is dismissed.
- Verify player cubes do not render a direction arrow helper above them.
- Verify the local player's cube shows their video feed on the rear-facing face (visible from the default behind-camera view).
- Verify remote players' cubes show video only on the front-facing face (not on the back face).

### CubeChat room-theme sync manual regression check

- Automated baseline: the CubeChat subset of `demos/tests/runtime-p2p.mjs`
  changes theme A-to-B and B-to-A and requires matching application state,
  scene state, selector state, and scoped Yjs state. It also announces and
  observes distinct room-directory entries in both directions. Keep the manual
  checks below for visual theme quality and long-distance procedural behavior.
- In CubeChat settings, verify the `World -> Theme` dropdown includes `Tron`, `Moon`, `Beach`, `Desert`, `Jungle`, `Hyperborea`, and `Ireland`.
- Change `World -> Theme` across multiple options (at minimum `Tron`, `Moon`, `Beach`, `Ireland`, and `Hyperborea`).
- Verify the floor appearance and skybox update immediately on the local client.
- Move long distances in each theme and verify the skybox follows the player/camera position (no visible “reaching the edge of the sky dome” effect).
- Move far enough to trigger grid expansion and verify theme decor (rocks/trees/cows/walls) expands naturally without reshuffling previously seen nearby placements.
- Open two clients in the same area and verify overlapping theme decor placements match (seeded/procedural consistency).
- Verify `Moon` theme includes visible raised terrain variation with pronounced crater rims/ridges and scattered rock geometry.
- Move far enough in `Moon` to trigger grid expansion and verify crater/grain floor markings do not visibly slide/phase-shift relative to nearby terrain after expansion.
- Verify movement in `Moon` theme emits small dust puffs near moving players and stops when stationary.
- Verify landing after a jump in `Moon` emits a larger touchdown dust poof near the player.
- Verify `Beach`, `Desert`, `Jungle`, `Hyperborea`, and `Ireland` all show distinct floor textures/terrain shaping and skyboxes.
- Verify `Beach`, `Desert`, `Jungle`, and `Hyperborea` skybox horizon features (ocean/dunes-jagged mesas/jungle tree-line or hills/ice ridge skyline) are clearly visible above the horizon at normal camera pitch (not clipped to just tips).
- Verify `Jungle` includes dense, tall tree sprites with a canopy that visually covers the sky, and confirm tree trunks visually touch the terrain (no floating gap).
- Verify `Ireland` includes visible cow sprites placed on terrain and low stone-wall pasture dividers (about half player-cube height) across the field.
- Verify `Ireland` pasture walls run in both axis directions (forming squarish fields, not single-direction stripes) with noticeably larger pasture cells than earlier passes (about 4x spacing).
- Verify `Tron` theme skybox shows a neon synthwave sunset with outrun-style mountains/city silhouette, and confirm the city skyline plus most/all of the striped sun are visible above the horizon at normal camera pitch.
- Verify `Tron` theme emits a visible light-train trail behind moving players.
- Verify `Ireland` skybox clearly shows green rolling hills plus a single small distant castle silhouette on the skyline (readable at normal camera pitch), along with gray skies and intermittent rain bursts that start/stop over time.
- Open a second client in the same room and verify it receives the current theme (including late-join after a theme change).
- Verify remote players also show theme-specific movement effects (moon dust / Tron trail) while moving.
- Verify player cubes follow terrain contours in non-`Tron` themes (height conforms to terrain and cubes tilt to slopes rather than floating flat).
- Change theme from one client and verify the other clients in the same room update without changing rooms.
- Switch to a different room and verify the theme is room-scoped (defaults to `Tron` until changed in that room).
- Create/join a private room and verify the browser URL includes `room`, `privacy`, `password`, and `theme` query params.
- Open that URL in a second client and verify it lands in the same private room/theme without manual re-entry.

### Runtime browser harness system-Chrome gate
- Syntax gates: `node --check demos/tests/runtime-smoke.mjs` and `node --check demos/tests/runtime-p2p.mjs`.
: expected result is a full pass with no syntax errors.
- Render smoke gate: `node demos/tests/runtime-smoke.mjs`.
: expected result is a full pass under either the configured
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` / `CHROME_EXECUTABLE_PATH` or local
  `/bin/google-chrome`, walking Hyperborea, CubeChat, SneakyWoods, DaddyGo,
  PlanetGen, Universes, Fano Reactor, and WebGPU Phys. Relay bootstrap probe
  404s and dial-denied relay setup noise should not fail this generic render
  smoke; the dedicated P2P harness owns that behavior.
- Targeted P2P gate:
  `RUNTIME_P2P_DEMOS=cubechat RELAY_CONFIG_TIMEOUT_MS=15000 DEMO_TIMEOUT_MS=20000 npm run test:runtime:p2p`.
: expected result is a full pass with an ephemeral local Go relay, CubeChat
  peer connections observed, `Runtime P2P tests passed.`, a clean shell return,
  and no leftover `runtime-p2p` or `peercompute-relay-go` process/listener.

### Magnetar runtime evidence requirements gate
- Descriptor adapter summary gate:
  `node --test peercompute/tests/unit/serviceOrchestration.test.js --test-name-pattern 'descriptor-only Eshkol closures|descriptor probe blocks interpolation fixture scientific overclaims|descriptor probe blocks tensor runtime contract overclaims|descriptor probe blocks tensor runtime table binding drift|executes only explicit smoke output semantics'`.
: expected result is a full pass proving descriptor-only Eshkol magnetar closure
  handoffs accept tensor/product-topology/runtime-binding metadata through
  `peercompute.ulg.handoff-supervisor-service-summary.v0`, report descriptor
  scientific execution and validation as false, accept runtime status
  `declared-not-executed` or deterministic smoke-only execution, accept explicit
  `closureTensorRuntimeContract`
  metadata only when its hash/ABI/tensor descriptor/interpolation/sample-shape
  gates match, block interpolation-table and tensor-runtime scientific
  overclaims, block tensor-runtime/table binding drift, require sample-shape
  tensor ids to match the descriptor tensor contract, execute the live
  deterministic tensor-runtime candidate when ULG supplies matching WASM bytes,
  verify declared offsets/output tensors/changed bytes, and keep explicit smoke
  output semantics gated separately from descriptor metadata.
- Live browser adapter-summary gate: on
  `https://100.86.83.35:5185/?scenario=magnetar`, call
  `window.__multiscaleDemo.runUlgDispatchServiceAdapterProbe()` with a synthetic
  descriptor handoff carrying `eshkol.ulg.magnetar-closure-descriptor.v0`.
: expected result is `dispatch-adapters-ready`, an Eshkol
  `peercompute.multiscale.ulg-dispatch-service-result-summary.v0` entry with
  `descriptorTensorContract`, `descriptorProductTopologyBinding`,
  `descriptorTensorRuntimeContract`, and `descriptorRuntimeBinding`,
  `descriptorTensorRuntimeContract.ready = true`,
  `descriptorTensorRuntimeDeterministicRuntimeSmokeReady = true` for live
  tensor-offset handoffs, and no production/scientific execution claim.

- Handler-backed dispatch adapter gate:
  `node --test peercompute/tests/unit/serviceOrchestration.test.js --test-name-pattern 'ULG handoff service host submits dispatches to registered Eshkol and MoonLab services'`.
: expected result is a full pass proving registered MoonLab/Eshkol dispatch
  hosts can attach `dispatchHandlers`, receive
  `peercompute.ulg.dispatch-service-handler-context.v0` with the materialized
  `peercompute.ulg.handoff-dispatch-artifact-payload.v0`, preserve probe and
  ingest status, store handler service output in the standard dispatch result
  and cached dispatch artifact, and expose compact handler readiness plus output
  schema/status through `peercompute.ulg.handoff-supervisor-service-summary.v0`.

- MoonLab WebGPU complex64 reduced evidence gate:
  `node --test peercompute/tests/unit/serviceOrchestration.test.js --test-name-pattern 'WebGPU complex64 no-backend parity scope|ULG handoff service host submits dispatches to registered Eshkol and MoonLab services'`
  and
  `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'MoonLab WebGPU complex64 no-backend parity scope|magnetar scenario combines ULG calibration and Eshkol closure handoffs|magnetar scenario clears calibrated reference blockers only when all scientific family references validate'`.
  Expected result is a full pass proving the ULG artifact adapter accepts a
  `moonlab.webgpu.complex64-parity-scope.v0` artifact as bounded reduced
  evidence, accepts successful `scope-ready-backend-detected` browser coverage,
  blocks incomplete backend claims, and preserves false full-fidelity/full-
  physics flags through Multiscale scenario readiness without changing the
  scientific runtime gate.

- Focused Node gate:
  `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'runtime evidence requirements|runtime evidence manifest|scientific runtime gate|bounded proxy runtime evidence|magnetar scenario records proxy runtime evidence|magnetar scenario creates bounded proxy runtime evidence manifest|magnetar scientific runtime gate accepts explicit validated runtime evidence'`.
: expected result is a full pass proving
  `peercompute.multiscale.scenario-runtime-evidence-requirements.v0` names all
  five validated magnetar runtime evidence entries, exposes the scientific
  runtime validation schema/scope and required sha256 hash fields, keeps
  proxy-only evidence blocked, and still accepts an explicit validated manifest
  after all prerequisites are present.
- Live browser gate: on `https://100.86.83.35:5185/?scenario=magnetar`, call
  `window.__multiscaleDemo.getScenarioRuntimeEvidenceRequirements()` and
  `window.__multiscaleDemo.getState().scenarioRuntimeEvidenceRequirements`.
: expected result is schema
  `peercompute.multiscale.scenario-runtime-evidence-requirements.v0`,
  `requiredCount=5`, the MHD/PIC/radiation/relativity/cross-family runtime ids,
  and the scenario runtime gate still pending or blocked until validated
  scientific runtime evidence is attached.

### Magnetar fidelity/runtime scope gate
- Focused Node gate:
  `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'magnetar scenario clears calibrated reference blockers only when all scientific family references validate|magnetar scenario creates calibrated reduced runtime evidence from MoonLab references|magnetar scientific runtime gate accepts explicit validated runtime evidence after prerequisites'`.
: expected result is a full pass proving calibrated MoonLab references carry
  `ulg.magnetar.fidelity-runtime-scope.v0`, tolerance-suite entries expose
  `fidelityRuntimeScopeReady = true`, and reduced calibrated runtime readiness
  does not claim `fullFidelityMagnetarSimulation` or `fullPhysicsValidation`.
- Build gate: `npm --prefix demos/multiscale run build`.
: expected result is a full pass with only the existing large-chunk warning.
- Live browser gate: export a ULG handoff from `http://127.0.0.1:5173/`, apply it
  with `window.__multiscaleDemo.runUlgMagnetarCalibratedDemo()` on
  `https://127.0.0.1:5185/?scenario=magnetar`, and inspect the returned
  handoff readiness.
: current result on 2026-06-06 was `runtime-evidence-ready`,
  `validatedCount = 5`, `proxyOnlyCount = 0`, `missingCount = 0`,
  `scientificReady = true`, no blockers, `pic-kinetic-plasma`
  `fidelityRuntimeScopeReady = true`, and calibrated runtime scope flags
  `fullFidelityMagnetarSimulation = false` and `fullPhysicsValidation = false`.

### Relay-backed runtime P2P gate
- VPN coturn dry-run:
  `bash scripts/dev-vpn-coturn.sh --dry-run`.
: current result on 2026-06-06 selected `RELAY_PUBLIC_HOST=100.86.83.35`,
  `RELAY_LISTEN_HOST=0.0.0.0`, `RELAY_LISTEN_PORT=0`, and TURN host
  `100.86.83.35:3478`.
- Backend dry-run:
  `npm run backend:dry-run`.
: current result on 2026-06-06 reported relay plus coturn commands without
  starting services.
- Focused runtime P2P smoke:
  `RUNTIME_P2P_DEMOS=hyperborea DEMO_PORT=4191 RELAY_CONFIG_TIMEOUT_MS=15000 DEMO_TIMEOUT_MS=45000 node demos/tests/runtime-p2p.mjs`.
: current result on 2026-06-06 passed. The smoke started the Go relay on a
  dynamic localhost port, wrote Hyperborea relay config, connected multiple
  browser peers, disconnected cleanly, and printed `Runtime P2P tests passed`.
- Relay-config restore regression:
  after the focused runtime P2P smoke, `git diff -- docs/hyperborea/relay-config.json`
  returned empty, proving the smoke restored generated relay config files.
- Relay-backed ULG/Multiscale handoff gate:
  `npm --prefix demos/multiscale run test:ulg-relay-handoff`.
: current result on 2026-06-06 passed. The smoke serves the built
  `docs/multiscale` bundle, starts a dynamic local Go relay, injects STUN/TURN
  ICE config into the generated Multiscale relay config, opens a live ULG
  `5173` page, opens two Multiscale browser peers in the same relay room, waits
  for each non-relay peer id to appear in `connectedPeerIds`, posts the ULG
  handoff into the relay-backed Multiscale popup, and verifies `handoff-ready`,
  blocker count `0`, canonical MoonLab suite hash, the deterministic Eshkol
  tensor-offset runtime-smoke artifact, `service-envelope-ready`,
  `relaySafeArtifactCount=2`, `dispatch-ready`, no full-fidelity/full-physics
  scientific overclaim flags, and restored `docs/multiscale/relay-config*.json`
  files after teardown. The Eshkol gate asserts source hash
  `sha256:630b20dd243be58f8e53631e934d09298696fe7e7ea84b15e7d7b89d18809b69`,
  WASM hash
  `sha256:e0a3c7d280678a8c1e40865daeab6601dc8a6a64cfa5b29b7b6bfcaddc86c5aa`,
  WASM byte length `169528`, runtime claim
  `deterministic-tensor-runtime-smoke-only`, linear-memory status
  `entry-export-runtime-smoke-passed`, offset-probe status
  `runtime-smoke-passed`, `entryExportConsumesOffsets = true`, changed bytes
  `64`, production handler boundary status
  `production-handler-runtime-smoke-executed`, handler/runtime readiness true,
  implementation/runtime execution schemas, and production preflight counts
  `10/9/1`.
  It also asserts Eshkol production-candidate runtime-probe and computed
  production-dispatch preflight evidence:
  `eshkol.ulg.production-candidate-runtime-probe.v0`,
  `production-candidate-runtime-smoke-passed`, changed bytes `64`, host import
  calls `ulg_read_f64 = 12` / `ulg_write_f64 = 9`,
	  `eshkol.ulg.production-handler-contract.v0` declared with
	  `linear-memory-offsets` invocation, two `i32` offset parameters, eight
	  required evidence entries, and
	  `eshkol.ulg.production-handler-dispatch-preflight-check-summary.v0` with ten
	  total checks, seven passed checks, three blocked checks, and ordered
	  `checkResults`.
: `ULG_RELAY_HANDOFF_RUN_DISPATCH=1` opts into the browser dispatch-adapter
  probe with compact raw-result omission, a browser-owned async run record, and
  stage/supervisor diagnostics. Current result on 2026-06-06 passes with
  `dispatchAdapterStatus = dispatch-adapters-ready` and
  `acceptedDispatchCount = 2`. The relay-served docs page must resolve the
  MoonLab/Eshkol dispatch workers to the stable bundled
  `assets/ulgMoonLabDispatchServiceHost.js` and
  `assets/ulgEshkolDispatchServiceHost.js` entries; the prior raw hashed worker
  module URLs failed with a worker import error before `ready`.
  `ULG_RELAY_HANDOFF_REQUIRE_DISPATCH=1` can force any future adapter blocker
  to fail the smoke while debugging the adapter execution itself.

- Eshkol computed dispatch-preflight evidence gate:
  focused service orchestration, Multiscale model, browser ULG handoff, and
  relay handoff smokes now preserve the computed preflight `checkResults`,
  check-summary schema, 10 total checks, 9 passed checks, and 1 blocked check.
  These checks promote handler implementation/runtime smoke readiness only; they
  do not promote full-physics readiness.
- Eshkol imported host-import module/factory gate:
  focused service orchestration and Multiscale model tests now preserve
  `closureHostImportsModule`, asset status `ready`, factory status `ready`,
  factory readiness, host-import requirements schema/status, runtime scope,
  implementation status, and required non-stub import count through artifact
  summaries, dispatch ingest, supervisor summaries, scenario readiness, and
  packet boundary conditions. Browser handoff smoke verifies the same runtime
  import availability in the raw live ULG handoff; relay handoff smoke verifies
  it again in the service envelope and the returned dispatch-adapter service
  result summary without promoting production handler/runtime/full-physics
  readiness.

### Eshkol production handler boundary gate
- Focused service orchestration gate:
  `node --test peercompute/tests/unit/serviceOrchestration.test.js --test-name-pattern 'production handler boundary|descriptor-only Eshkol closures without WASM bytes|deterministic tensor runtime candidate'`.
: current result on 2026-06-06 was `28/28` passing. The run proved
  `eshkol.ulg.production-handler-boundary.v0` is surfaced from Eshkol closure
  metadata with `handlerReady = true`, `runtimeExecution = true`,
  `scientificValidation = false`, `fullPhysicsValidation = false`, and
  `fullFidelityMagnetarSimulation = false`; implementation/runtime-smoke
  evidence must carry `eshkol.ulg.production-handler-implementation.v0` and
  `eshkol.ulg.production-handler-runtime-execution.v0`, while full-physics
  validation remains blocked as `full-physics-validation-not-run`.
- Focused Multiscale gate:
  `node --test demos/multiscale/tests/multiscaleModel.test.mjs --test-name-pattern 'production preflight counts|production handler boundary|descriptor-only Eshkol'`.
: current result on 2026-06-06 was `198/198` passing. The run proved
  Multiscale closure ingest, handoff readiness, and packet boundary conditions
  preserve handler/runtime smoke readiness, implementation/runtime execution
  schemas, compact service summary counts for required production non-stub
  imports and dispatch preflight checks, and false science/full-physics/full-
  fidelity flags when full arrays are omitted.
- Build gate:
  `npm --prefix demos/multiscale run build`.
: current result on 2026-06-06 passed with only the existing large-chunk
  warning and refreshed `docs/multiscale`.
- Live handoff smoke:
  `npm --prefix demos/multiscale run test:ulg-handoff`.
: current result on 2026-06-06 passed against ULG `5173` and Multiscale `5185`
  with `handoff-ready`, blocker count `0`, `simulationStatus = scientific-ready`,
  bridge ack `handoff-ready`, visible magnetar proxy visual, Eshkol source hash
  `sha256:630b20dd243be58f8e53631e934d09298696fe7e7ea84b15e7d7b89d18809b69`,
  Eshkol WASM hash
  `sha256:e0a3c7d280678a8c1e40865daeab6601dc8a6a64cfa5b29b7b6bfcaddc86c5aa`,
  byte length `169528`, runtime claim
  `deterministic-tensor-runtime-smoke-only`, linear-memory status
  `entry-export-runtime-smoke-passed`, offset-probe status
  `runtime-smoke-passed`, changed bytes `64`, adapter candidate status
  `deterministic-runtime-smoke-candidate-passed`, declared output tensors
  produced by the entry export, production handler boundary status
  `production-handler-runtime-smoke-executed`, handler/runtime readiness true,
  production implementation/runtime execution schemas, and production preflight
  counts `10/9/1`.
- Production handler runtime execution scalar propagation gate:
  syntax checks for changed PeerCompute service-orchestration files, Multiscale
  source files, and smoke scripts.
: current result on 2026-06-07 passed. `node --test
  peercompute/tests/unit/serviceOrchestration.test.js` passed `28/28`, `node
  --test demos/multiscale/tests/multiscaleModel.test.mjs` passed `198/198`,
  `npm --prefix demos/multiscale run build` passed with the existing large
  chunk warning, and `ULG_HANDOFF_URL=http://127.0.0.1:5173/ npm --prefix
  demos/multiscale run test:ulg-handoff` passed. The relay smoke first timed
  out at peer visibility with `ULG_RELAY_HANDOFF_TIMEOUT_MS=180000`; rerun with
  `ULG_RELAY_HANDOFF_TIMEOUT_MS=300000 ULG_RELAY_HANDOFF_RUN_DISPATCH=1`
  passed with two connected browser peers, two accepted dispatches,
  `entryResult = 0`, output tensors produced, and false
  science/full-physics/full-fidelity scope flags.
- Production full-physics validation requirements propagation gate:
  syntax checks for changed PeerCompute service-orchestration files, Multiscale
  source files, and smoke scripts.
: current result on 2026-06-07 passed. `node --test
  peercompute/tests/unit/serviceOrchestration.test.js` passed `28/28`, `node
  --test demos/multiscale/tests/multiscaleModel.test.mjs` passed `198/198`,
  `ULG_HANDOFF_URL=http://127.0.0.1:5173/ npm --prefix demos/multiscale run
  test:ulg-handoff` passed, `npm --prefix demos/multiscale run build` passed
  with the existing large-chunk warning, and `ULG_HANDOFF_URL=http://127.0.0.1:5173/
  ULG_RELAY_HANDOFF_TIMEOUT_MS=300000 ULG_RELAY_HANDOFF_RUN_DISPATCH=1 npm
  --prefix demos/multiscale run test:ulg-relay-handoff` passed. The checks
  assert `eshkol.ulg.full-physics-validation-requirements.v0`,
  `declared-not-run`, readiness false, required runtime-evidence families
  `magnetosphere-mhd`, `pic-kinetic-plasma`, `radiation-transport`,
  `relativistic-correction`, and `cross-family-conservation-coupling`,
  required hash fields `referenceHash`, `toleranceHash`, `runtimeOutputHash`,
  and `evidenceHash`, and blocker `full-physics-validation-not-run` through
  artifact, dispatch, supervisor, Multiscale readiness, packet, browser, and
  relay surfaces.
- Production full-physics runtime-evidence compatibility gate:
  `node --test demos/multiscale/tests/multiscaleModel.test.mjs` plus live ULG
  browser and relay handoff smokes.
: current result on 2026-06-08 passed. The Multiscale model suite passed
  `200/200`; `ULG_HANDOFF_URL=http://127.0.0.1:5173/ npm --prefix
  demos/multiscale run test:ulg-handoff` passed; `npm --prefix
  demos/multiscale run build` passed with the existing large-chunk warning; and
  `ULG_HANDOFF_URL=http://127.0.0.1:5173/
  ULG_RELAY_HANDOFF_TIMEOUT_MS=300000 ULG_RELAY_HANDOFF_RUN_DISPATCH=1 npm
  --prefix demos/multiscale run test:ulg-relay-handoff` passed. The checks
  assert `peercompute.multiscale.scenario-full-physics-validation-compatibility.v0`,
  `runtime-evidence-compatible-pending-full-physics-validation`,
  required/matched/validated/hash-complete counts `5/5/5/5`, no missing runtime
  evidence, `runtimeEvidenceCompatible = true`, `ready = false`, and blocker
  `full-physics-validation-not-run`.
- ULG simulation artifact consumption gate:
  syntax checks for changed Multiscale, PeerCompute service-orchestration, and
  test files; service-orchestration suite; Multiscale model suite; Multiscale
  build; live ULG handoff smoke; and a browser-injected three-artifact handoff.
: current result on 2026-06-08 passed. `node --test
  peercompute/tests/unit/serviceOrchestration.test.js` passed `29/29`; `node
  --test demos/multiscale/tests/multiscaleModel.test.mjs` passed `201/201`;
  `npm --prefix demos/multiscale run build` passed with the existing
  large-chunk warning; `ULG_HANDOFF_URL=http://127.0.0.1:5173/ npm --prefix
  demos/multiscale run test:ulg-handoff` passed and preserved the default
  two-artifact MoonLab/Eshkol handoff; and an ad hoc Chrome probe injected a
  three-artifact handoff with one `simulation-delta` ULG runtime artifact and
  confirmed `runtimeEvidenceReady = true`, `scientificRuntimeReady = false`,
  and `fullPhysicsReady = false` in packet/spec-contract summaries.
- ULG simulation edge-summary propagation gate:
  syntax checks for changed Multiscale, PeerCompute service-orchestration, and
  test files; focused service-orchestration and Multiscale model edge-summary
  tests; full service-orchestration and Multiscale model suites; Multiscale
  build; live ULG handoff smoke; and a browser-injected simulation artifact
  edge probe against the live `5185` page.
: current result on 2026-06-08 passed. Focused edge-summary tests passed for
  service orchestration and Multiscale; `node --test
  peercompute/tests/unit/serviceOrchestration.test.js` passed `29/29`; `node
  --test demos/multiscale/tests/multiscaleModel.test.mjs` passed `201/201`;
  `ULG_HANDOFF_URL=http://127.0.0.1:5173/ npm --prefix demos/multiscale run
  test:ulg-handoff` passed with the default two-artifact handoff; `npm --prefix
  demos/multiscale run build` passed with the existing large-chunk warning; and
  a browser-injected simulation artifact confirmed edge status `pass`, edge
  count `4`, visible `ulg sim edge`, visible magnetar affordance edge status,
  `scientificRuntimeReady = false`, and `fullPhysicsReady = false`.
- ULG simulation field-observer propagation gate:
  syntax checks for changed Multiscale, PeerCompute service-orchestration, and
  test files; focused service-orchestration and Multiscale model field-observer
  tests; full service-orchestration and Multiscale model suites; Multiscale
  build; live ULG handoff smoke; and a browser-injected simulation artifact
  field-observer probe against the live `5185` page.
: current result on 2026-06-08 passed. Focused field-observer tests passed for
  service orchestration and Multiscale; `node --test
  peercompute/tests/unit/serviceOrchestration.test.js` passed `29/29`; `node
  --test demos/multiscale/tests/multiscaleModel.test.mjs` passed `201/201`;
  `npm --prefix demos/multiscale run build` passed with the existing
  large-chunk warning; `ULG_HANDOFF_URL=http://127.0.0.1:5173/ npm --prefix
  demos/multiscale run test:ulg-handoff` passed with the default two-artifact
  handoff; and a browser-injected simulation artifact confirmed field status
  `pass`, field count `4`, visible `ulg sim field`, visible magnetar
  affordance field status, `scientificRuntimeReady = false`, and
  `fullPhysicsReady = false`.
- ULG simulation field-closure-sample propagation gate:
  syntax checks for changed Multiscale, PeerCompute service-orchestration, and
  test files; focused service-orchestration and Multiscale model closure-sample
  tests; full service-orchestration and Multiscale model suites; Multiscale
  build; live ULG handoff smoke; and a browser-injected simulation artifact
  closure-sample probe against the live `5185` page.
: current result on 2026-06-08 passed. Focused closure-sample tests passed for
  service orchestration and Multiscale; `node --test
  peercompute/tests/unit/serviceOrchestration.test.js` passed `29/29`; `node
  --test demos/multiscale/tests/multiscaleModel.test.mjs` passed `201/201`;
  `npm --prefix demos/multiscale run build` passed with the existing
  large-chunk warning; `ULG_HANDOFF_URL=http://127.0.0.1:5173/ npm --prefix
  demos/multiscale run test:ulg-handoff` passed with the default two-artifact
  handoff; and a browser-injected simulation artifact confirmed closure-sample
  status `pass`, closure-sample count `4`, visible `ulg sim closure`, visible
  magnetar affordance `sim closure pass x4`, `scientificRuntimeReady = false`,
  `fullPhysicsReady = false`, and material/EOS/SPH/phase-change validation
  flags all false.

- GPU resident lane lease-identity injection gate:
  `node --test tests/unit/gpuResidentLaneManager.test.js` and the complete
  `npm run test:unit` suite must prove that `ComputeManager` acquires the lease
  before invoking an inline object-data task, injects
  `peercompute.compute.gpu-resident-lane-lease-identity.v0`, preserves
  `leaseId`/`laneId`/`stateKey`/`sourceFamily`, and returns the same lease ID in
  completion evidence. The submitted task data object must not be mutated.
: current result on 2026-07-11 passed: focused `10/10`; full unit `187/187`.

- ULG out-of-range closure refresh propagation gate (recommended-work item 2):
  feed a ULG simulation artifact whose authoritative artifact-level
  `closureRefreshRequest` is `refresh-recommended` (carrier domain exit; the
  in-range last delta still reads `not-needed`) and assert the
  refresh/invalidation fields plus `closureRefreshRequestSource:'artifact'` and
  `closureDomainExited:true` propagate through summary, `quantumMaterialPotential`
  diagnostics, packet upward aggregate, the `ulgRuntimeArtifact` handoff
  contract, the bridge contracts, and the root validation/provenance envelope —
  without promoting scientific readiness.
: current result on 2026-06-08 passed. `node --test
  demos/multiscale/tests/multiscaleModel.test.mjs` passed `202/202` (+1 new
  fixture); `node --test peercompute/tests/unit/serviceOrchestration.test.js`
  passed `30/30`; `npm --prefix demos/multiscale run build` passed with the
  existing large-chunk warning; `git diff --check` clean; and the live
  two-server handoff smoke `ULG_HANDOFF_URL=http://localhost:5173/ npm --prefix
  demos/multiscale run test:ulg-handoff` exited `0` with HUD `status handoff
  ready / blockers 0` (ULG Vite on `0.0.0.0:5173`, Multiscale dev on localhost
  `:5185`; the smoke was driven via the `localhost` origin because the sandbox
  blocked binding `:5185` to `0.0.0.0`). Refresh recommendation remained
  evidence-only: all scientific/material/EOS/SPH/phase flags false and
  `scientificRuntimeReady = false`.

### RoadVector Cesium migration strategy - 2026-08-24 AKDT

- Unit-test the shared Shortbread Cesium provider with an explicit z5 allowlist,
  one-MiB tile and eight-MiB aggregate limits, a 100,000-vertex cap, major-road
  filtering, transparent rejected tiles, cache bounds, and abortable teardown.
  The fixture must encode a real motorway property and prove positive rendered
  road/vertex counts so a blank layer cannot pass.
- Test RoadVector's Cesium adapter with a token-free/no-base-layer Viewer,
  application-owned render loop, north-up selected-location camera, WGS84
  player entities, fixed-red remote markers, explicit overview/ride mode,
  per-location terrain replacement, imagery destruction, and idempotent
  teardown.
- Use the real Cesium WebMercator tiling scheme to prove the selected rectangle
  maps to the same center-out allowlist at Anchorage, the antimeridian, and both
  polar limits. Preserve the independent one-unit-per-meter local scale test.
- Preserve EarthGrid and WXGlobe consumers after extracting shared browser HTTP
  and imagery code. Add capped ETOPO tests proving admitted-key retry,
  first-unseen-key rejection, telemetry, and unlimited default compatibility.
- Build RoadVector and require release-relative Cesium Workers, ThirdParty,
  Assets, Widgets, `LICENSE.md`, and `ThirdParty.json`. The deterministic built
  browser gate must observe a real Cesium post-render frame, loaded capped NOAA
  terrain, positive filtered road/vertex rendering, physics frame zero in the
  overview, and the existing local ride/control/collision/reset/rebase gates.
- After deterministic gates pass, restart only the retained direct Tailnet
  listener and verify `https://100.68.165.52:5188/`, one Cesium worker/asset,
  and the same-origin geodata catalog. No terminal-browser pane is permitted.

### Executed RoadVector Cesium migration evidence - 2026-08-24 AKDT

- PASS: `npm run test:earth-platform:unit`. It completed `241` Node tests plus
  the mocked Chromium XR harness: geo-core `23/23`, geodata `44/44`, EarthGrid
  `27/27`, WXGlobe `28/28`, shared XR `21/21`, particle/motorcycle physics
  `33/33`, traffic `12/12`, and RoadVector `53/53`.
- PASS: `npm run test:earth-platform:release`. It rebuilt WXGlobe, EarthGrid,
  and RoadVector; copied `391` Cesium runtime/notice items per Cesium build;
  passed static port/release checks `44/44`; and passed the combined
  deterministic built-browser smoke on test-owned HTTPS port `43947` with all
  listeners removed afterward. The final RoadVector entry was rebuilt again as
  `index-Hix4CE5B.js` plus `NetworkManager-TWI5FZR3.js` after the marker
  horizon-occlusion assertion; focused static checks `44/44` and built smoke on
  `43971` passed.
- PASS: exact direct Tailnet browser proof at
  `https://100.68.165.52:5188/` in two independent Chrome contexts. Both were
  secure contexts, used CesiumJS `1.144.0`, retained physics frame `0`, loaded
  two capped NOAA terrain tiles, loaded all `25` allowlisted Shortbread tiles
  (`3,553,031` bytes), rendered `217` major roads / `527` vertices, and
  discovered/rendered the other genuine PeerCompute peer in fixed red at only
  `0.1°` location precision. There were no page or console errors.
- PASS: direct HTTP/TLS probes returned 200 for the private root, same-origin
  geodata catalog, Cesium heightmap worker, and Cesium terrain metadata. The
  retained transient Tailnet service was cleanly restarted and stayed active;
  no Tailscale Serve/Funnel/public listener was introduced.
- PASS: final focused overview `7/7`, changed-source syntax checks, and
  `git diff --check`. The refreshed 1440×900 RoadVector gallery image shows the
  actual Cesium globe and a real red peer marker.
- FIXED DURING GATING: the first extracted imagery import used the attribution
  constant's old re-export path and failed module instantiation; the corrected
  shared source import restored Earth/RoadVector. The first fake presence test
  omitted JSON content type and truthfully stayed unavailable; the fixture now
  satisfies the real bounded config contract. Terrain budgeting was changed
  from a persistent lifetime cap to a fresh abortable 128-tile budget per
  selected location.
- NETWORK-DEPENDENT FAILURE: `npm run test:earth-platform:live` reached the
  unrelated public Overpass dependency but received HTTP 504 after its bounded
  retry policy. This does not contradict the successful direct live RoadVector
  NOAA/Shortbread/geodata/presence proof and was not hidden or relabeled.
- NOT RUN: a physical headset enter/exit/re-enter, controllers/hands, haptics,
  comfort, and performance matrix. The exact HTTPS URL is intentionally left
  running for that user-operated hardware gate; no certification is claimed.

## FHWA highway, globe click, and NURBS-line visual gate - 2026-08-24 AKDT

- The federal-highway sync gate validates the exact ArcGIS item owner/service,
  layer geometry/SR/schema, source count/version/edit date, allowlisted ZIP
  members, CRC/extracted-size/record count, original metadata retention, NHS
  class domain, Alaska coverage, simplified-point count, tile count/bytes, and
  per-tile SHA-256 before atomic replacement.
- Geo-core tests open real generated Alaska and continental tiles, validate the
  manifest and checksum-fail-closed path, and prove the bounded Cesium imagery
  provider never requests outside the snapshot's z0–8 tile manifest.
- RoadVector unit/browser tests prove Cesium terrain-first/ellipsoid-fallback
  picking, sky rejection, rapid-selection generation ownership, roads-only
  local loads, explicit no-usable-road failure, delayed coarse presence,
  successful click-to-start, and click-handler/provider teardown.
- Renderer tests require a transparent exact terrain mesh, contouring phased
  by source elevation rather than local origin, actual finite Three.js NURBS
  curves, deterministic curve/level/vertex caps, exactly two physical-radius
  wheel curves, a bounded line frame/stick rider, no default dense particle or
  contact geometry, an explicit capped debug mode, interpolation, rebasing,
  and complete resource disposal.
- The built browser gate must observe `minimal-nurbs-line-bike`, two wheel
  curves, zero default particle/contact markers, the transparent terrain style,
  positive NURBS contour output, and contour/draw-call caps alongside the
  existing physics/traffic/race/input/provenance assertions.
- Direct Tailnet browser evidence must use the exact private HTTPS origins,
  report `isSecureContext`, prove same-origin geodata/Cesium assets, and leave
  the two requested handoff services running. The physical-headset matrix
  remains manual and must stay recorded as NOT RUN until the user exercises it.

## EarthGrid water-surface strategy and results - 2026-08-24 AKDT

### Deterministic strategy

- Validate the official Shortbread origin, TileJSON contract, and Earth-only
  requirement for both `ocean` and `water_polygons`; retain optional water at
  the shared provider boundary so RoadVector fixtures and behavior stay
  road-only.
- Decode ocean and inland polygon features under the existing 10,000-feature
  tile cap. Exclude `kind=glacier`, omit centerline `water_lines`, and assert
  water commands precede buildings and roads.
- Assert exact `#0080ff` / `rgba(0, 128, 255, 0.5)`, numeric opacity `0.5`,
  flat/non-extruded terrain-draped metadata, even-odd hole fill, zero water
  stroke/shadow, and no opacity leakage into later drawing categories.
- Assert water telemetry, provider-session caps, opt-in isolation, visibility
  toggle behavior, visible source/legend disclosure, one baseline imagery
  layer, and two imagery layers only with NOAA weather.
- Require production bundle sentinels, a built fixture with positive ocean and
  inland-water commands/vertices, and a bounded live fixed Anchorage tile with
  positive ocean and inland polygons. Preserve WXGlobe and RoadVector gates.

### Executed results

- PASS: focused syntax and water tests, `11/11`.
- PASS: `npm run test:geo-core`, `29/29`; `npm run test:earth`, `29/29`;
  `npm run test:motorcycle`, `64/64`; `npm run test:wxglobe`, `28/28`.
- PASS: `npm run test:earth-platform:unit`, `261` Node tests plus the mocked
  Chromium WebXR harness under Node `v24.18.0`.
- PASS: `npm run test:earth-platform:release`; rebuilt WXGlobe, EarthGrid, and
  RoadVector, copied `391` Cesium runtime/notice items per build, passed static
  release checks `44/44`, and passed the combined deterministic built HTTPS
  smoke. The test-owned port `43947` was closed afterward.
- FAIL then PASS: first release smoke required exactly one ocean/inland command
  even though Cesium correctly requested multiple fixture tiles; the assertion
  was fixed to require positive source-category counts. The focused smoke and
  then the full release gate passed.
- FAIL then PASS: the first optional `npm run test:earth-platform:live` hit an
  upstream IPv6 connect timeout. The immediate bounded retry passed at
  `2026-08-24T20:46:31Z`: Shortbread `38,983` bytes with ocean `1`, inland
  polygons `3`, streets `515`, and building `1`; the other live source gates
  also passed.
- PASS: private headless Chrome at `https://100.68.165.52:5187/` reported a
  secure context, ready live terrain/OSM/water, `16` ocean commands / `104,580`
  water vertices, exact blue/`0.5` style, one imagery layer, and zero page or
  console errors. Root, same-origin catalog, and a Cesium worker returned 200;
  the IP/DNS SAN certificate remains valid through 2026-09-23.
- NOT APPLICABLE: no physical-headset gate is required for this EarthGrid-only
  water layer. RoadVector's separate physical WebXR hardware matrix remains
  NOT RUN and is not represented as certified.

## EarthGrid NURBS shoreline and submerged-contour strategy - 2026-08-24 AKDT

- Pure geometry tests must prove exact unit-weight degree-one NURBS output,
  closed internal rings, independent polygon holes and MultiPolygon parts,
  zero source deviation, finite coordinates, deterministic source/sample
  counts, and no downsampling.
- Tile-seam tests must suppress same-edge clipping segments, retain two or more
  disjoint open fragments without an invented closing chord, use butt caps,
  and turn a fully boundary-clipped tile box into zero shoreline curves without
  treating it as a source omission.
- Cap tests must exercise stable ring, per-ring point, aggregate point, curve,
  and sample error codes. The provider gate must reject before creating or
  mutating a canvas and expose the error code plus cap-rejected tile count.
- Canvas tests must preserve the 50%-opacity even-odd water fill, draw one
  consolidated translucent halo and one `#24cfff` core path, restore drawing
  state, and prove the ordered stroke stack is shoreline halo, shoreline core,
  building outline, then road—with roads last and visually authoritative at
  every overlap. RoadVector's default
  water-disabled command filter remains unchanged.
- Cesium material tests must use one `ElevationContour` alpha mask and select
  green/`#24cfff` diffuse color by `materialInput.height <= 0`, keep transparent
  gaps and skirt guards, update spacing/width without reconstruction, expose
  `terrain-source-native-zero`, and leave default consumers unchanged.
- Built and private-browser gates must require positive NURBS curves/sampled
  vertices, zero source deviation, exact shoreline/submerged color equality,
  the source-native-zero threshold, one baseline imagery layer, live terrain,
  and zero page/console errors.

### Executed evidence so far

- PASS: focused NURBS/material/Shortbread/Earth markup suite `22/22`.
- PASS: geo-core `37/37`, EarthGrid `31/31`, RoadVector `64/64`, and WXGlobe
  `28/28` on Node `v24.18.0`.
- PASS: `npm run test:earth-platform:unit`, now `271` Node tests plus the mocked
  Chromium XR harness.
- PASS: fresh EarthGrid production build, static release `44/44`, and focused
  built EarthGrid browser smoke on test-owned HTTPS port `43952`; the port
  closed after teardown.
- PASS: bounded live-source gate at `2026-08-24T22:41:21Z`–`22:41:23Z`, with
  the fixed `38,983`-byte Anchorage Shortbread tile retaining ocean `1`, inland
  polygons `3`, streets `515`, and building `1` alongside current Overpass,
  nowCOAST, ETOPO, and Terrarium checks.
- PASS: direct private HTTPS browser at `https://100.68.165.52:5187/` reported
  secure/ready/live state, one imagery layer, `8,231` NURBS fragments / `104,483`
  sampled vertices across the loaded view, `265` suppressed tile-boundary
  segments, zero omitted source points/cap rejections, exact matching
  `#24cfff` shoreline/submerged colors, source-native-zero threshold, and zero
  page/console errors.
- PASS: final `npm run test:earth-platform:release` after the road-precedence
  change rebuilt WXGlobe, EarthGrid, and RoadVector, copied `391` Cesium
  runtime/notice items per Cesium build, passed static release checks `44/44`,
  and passed the combined deterministic built HTTPS browser smoke. The harness
  closed its owned port `43947`.
- PASS: the post-build direct private HTTPS browser reproduced the exact v2
  water style with `8,231` NURBS fragments / `104,483` sampled vertices, `265`
  suppressed boundary segments, zero omissions/cap rejections, matching
  shoreline/submerged `#24cfff`, one imagery layer, and zero page/console
  errors. The new gallery capture was inspected.
- PASS: ICC indexed `798` files and rebuilt `11,426` memory chunks; the scoped
  authored-source guard passed with zero violations or warnings. The full-tree
  guard's only failure was content-hashed generated bundle replacement, which
  Git recognized as five `77%`–`99%` renames after staging.
- PASS: coherent local implementation/release commit `d5bebe32` (`Add
  EarthGrid NURBS waterlines`) was created without a push. Final task-attempt
  and lease closure are control-plane-only operations after this evidence
  block.

## EarthGrid actual-geometry rendering strategy - 2026-08-24 AKDT

- Pure terrain tests must extract deterministic finite degree-one NURBS paths
  from the same triangular height grid Cesium receives; cover flat grids,
  crossings above and below source-native zero, saddle/diagonal cases,
  adaptive level spacing, hard curve/vertex limits, and observer error
  isolation. No private Cesium terrain tile is a test or runtime dependency.
- Pure Shortbread geometry tests must scramble decoded category order and still
  produce water polygons at `zIndex=10`, shoreline paths at `20`, building
  wires at `30`, and roads at `40`. Cover water holes and multipart bodies,
  tile-edge shoreline suppression, exact 50% blue, one solid unlit line per
  path, `ArcType.RHUMB`, and absence of canvas/glow/halo/depth-fail materials.
- Scheduler tests must cover world, ordinary, antimeridian, and polar view
  rectangles; LOD reduction to 24 or fewer active tiles; six-request
  concurrency; coalescing; 96-entry LRU; stale abort; atomic replacement;
  2 MiB response, 10,000-feature, 192 MiB session, and 4,000,000 active-vertex
  failures. No transparent imagery-provider scheduler is permitted.
- Earth integration tests must require supported Cesium ground polygons and
  polylines, zero normal imagery layers, positive geometry/data-source counts,
  real source attribution, visibility teardown/recovery, source-generation
  isolation, transparent globe settings, and local roads ordered above global
  context. Weather alone changes imagery count from zero to one and back.
- Deterministic built-browser terrain fixtures must span negative and positive
  elevations across several contour intervals. Smoke must observe at least one
  blue at-or-below-zero contour and one green positive contour, positive
  water/shoreline/building/road geometry, roads above water, `glow:false`,
  `rasterPainted:false`, finite counts, and zero page/console errors.
- Preserve the full RoadVector and WXGlobe suites because their legacy shared
  imagery/material consumers are intentionally not migrated by this
  EarthGrid-only request. Keep the optional bounded live-source gate and direct
  private HTTPS proof separate from deterministic fixture CI.

## EarthGrid buffer-geometry verification correction - 2026-08-24 AKDT

This matrix supersedes the preceding ground-primitive/`zIndex` assertions.

- Shortbread unit tests must build actual Cesium `1.144.0` buffer snapshots and
  compare exact primitive, vertex, triangle, hole, and byte counts. Scrambled
  source commands must still submit water, shoreline, building, then road
  categories, with one solid Color pass and no raster, glow, halo, bloom,
  depth-fail material, worker job, or entity.
- Curved-world regressions must inspect the packed Cartesian buffers, not only
  WGS84 endpoints: a road crossing an elevated inland water polygon must have
  every tessellated crossing point physically above the water mesh, and
  representative polygon triangle centroids and low-zoom RHUMB midpoints must
  remain at their declared ellipsoid height within tolerance.
- Water/road overlap work must use bounded tile-space candidate indexing and a
  hard intersection-operation limit with a stable fail-closed code. Adversarial
  dense fixtures must exercise that cap. The synchronous active-water sampler
  used by local roads must use active tile/index candidates rather than scan
  every loaded body for every local vertex.
- Local rendering tests must prove densification and exact-capacity buffer
  counts, sampled terrain heights, matched active-water floors, road clearance,
  hidden-layer refresh behavior, valid settled-empty snapshots, teardown, and
  public post-render/render-error state transitions.
- Application readiness tests must reject fetch failure, active-vertex or
  operation-cap rejection, stale generations, and current-revision render
  errors. An enabled unavailable Shortbread source may never yield
  `READY // REAL SOURCES QUALIFIED`; an explicitly hidden optional layer may
  settle without inventing geometry.
- Built-browser smoke must require zero base imagery layers, positive water,
  shoreline, building, road, submerged-contour, and positive-contour buffer
  counts; exact CPU validation; a successful public post-render for every
  current revision; no current render error; visible blue and green pixels;
  local active-water road-floor wiring; and zero page/console errors. NOAA
  weather alone changes imagery from zero to one and back.
- Retain the complete geo-core, EarthGrid, WXGlobe, and RoadVector suites plus
  the deterministic combined production build/static/browser release gate.
  Run the bounded live-source gate separately, then inspect the direct Tailnet
  HTTPS EarthGrid with a headless browser and a fresh screenshot; do not use an
  in-terminal browser pane.

## RoadVector terrain-startup regression evidence - 2026-08-24 AKDT

- The overview test must prove the selected terrain source is AWS Terrarium,
  that the complete z0–z3 pyramid is structurally capped to 85 possible tiles,
  and that replacing a selected location aborts the old provider generation.
- The local terrain test must resample a finite Terrarium source into the same
  bounded WGS84/ENU triangle grid used by rendering and collision, never fetch
  more than nine z12 source tiles, and retain exact source provenance.
- The location-loader test must inject a terrain request that never settles and
  prove the configured deadline returns an explicitly derived fallback without
  hanging. Caller abort remains distinct from a source deadline.
- Deterministic built smoke intercepts both NOAA and AWS upstreams. Its
  Terrarium PNG is exactly 256×256, crosses provider-native zero and several
  contour intervals, and must yield current overview terrain, current FHWA and
  OSM road layers, non-degraded local relief, ride-mode frames, normalized
  inputs, finite camera/rebase/reset state, and a positive physical synthetic
  traffic impulse.
- Executed evidence: focused terrain/location/overview `16/16` PASS;
  `npm --prefix demos/motorcycle test` `66/66` PASS; production build PASS;
  focused production smoke on port `43973` PASS with teardown. Exact private
  `https://100.68.165.52:5188/` browser proof reached current real sources in
  about 4.5 seconds and completed ride/impact checks with zero browser errors.

## EarthGrid actual-buffer executed evidence - 2026-08-24 AKDT

- Geo-core `65/65`, EarthGrid `48/48`, and RoadVector `66/66` pass. The
  aggregate unit command passes `318/318` Node tests plus the mocked Chromium
  WebXR browser harness with zero failures, skips, or cancellations.

- Real z0 topology regression proves detailed Shortbread geometry is deferred
  below zoom 5 before any Cesium polygon allocation. Telemetry must retain the
  deferred tile/command/source-position counts, report `settledEmpty:true`,
  keep all GPU presentation flags false, and retry on a regional camera move.
- Curved-world water/road tests prove a road remains above an intersected water
  mesh at submitted midpoints, exact segment sampling catches narrow bodies
  with outside endpoints, holes/antimeridian cases remain correct, and both
  per-call and shared lifetime intersection caps fail closed with stable codes.
- Local integration proves matched global/local water revisions, point and
  segment sampler availability, valid-empty snapshots without fabricated GPU
  work, hidden-layer lifecycle, atomic failure retention, and scene-error
  recovery.
- Built EarthGrid smoke proves the safe whole-world deferred revision first,
  then flies to Anchorage and requires presented water, shoreline NURBS,
  building-wire, road, and blue/green terrain-contour buffers. It waits for the
  public camera end and the final bounded height reconciliation before taking
  the detailed snapshot. Focused repeats on `43977` and `43978` pass and close.
- Final `npm run test:earth-platform:release` passes: all three Cesium demos
  rebuild, static release checks pass `44/44`, and combined WXGlobe/EarthGrid/
  RoadVector deterministic browser smoke passes on and closes port `43947`.
- Exact private RoadVector root/catalog and EarthGrid root probes return `200`
  at `https://100.68.165.52:5188/` and
  `https://100.68.165.52:5187/`. Physical-headset validation is explicitly
  NOT RUN; no headset/WebXR certification claim is made.

## EarthGrid land companion and StateManager/backend cache strategy - 2026-08-25 AKDT

- Geometry units must prove outer-ring and hole land-side orientation, open
  tile-edge fragments, antimeridian continuity, bounded miters/offsets, exact
  degree-one NURBS metadata, one solid pass per represented curve, and full
  source/generated vertex accounting. Scrambled input ordering must still keep
  roads physically above water and both shoreline members.
- StateManager cache units must cover local-only/non-replicated storage,
  schema/content-type/byte validation, fresh hit, stale-on-error, request
  coalescing, subscriber abort isolation, deterministic LRU/byte eviction,
  IndexedDB recovery/fallback, namespace clearing, and truthful statistics.
- Geodata service tests must cover allowlisted Shortbread/Terrarium cache keys,
  coordinate/zoom/dimension validation, upstream timeouts and size caps,
  exact response bytes/content types/ETags, fresh/coalesced/stale states,
  byte-cap eviction, and rejection of arbitrary upstream URLs. NOAA ETOPO stays
  a bounded direct-source path and must not be mislabeled as backend-cached.
- EarthGrid and RoadVector browser smokes must prove cold backend/local misses,
  warm cache hits without duplicate upstream calls, unchanged source
  attribution/readiness, a positive green land-companion count beside blue
  shoreline curves, finite bounded geometry, and zero page/console errors.
- Record cold/warm load timing and cache byte/entry telemetry. Run focused
  suites first, then the complete backend/unit/build/static/browser release
  gates; keep live-source and physical-headset checks explicitly separate.

## EarthGrid land companion and cache executed evidence - 2026-08-25 AKDT

- PASS: land-side topology/buffer coverage plus shared source-consumer boundary
  tests. Final geo-core is `80/80`; exact 25,000-feature input succeeds and
  25,001 fails through decoder, legacy imagery, local-cache validation, and
  EarthGrid buffer geometry. The 2 MiB/coordinate/vertex limits are unchanged.
- PASS: PeerCompute StateManager/DataState/local artifact tests `214/214` and
  the focused local-cache slice `19/19`. Tests prove the artifact tier never
  touches Yjs, persists locally when IndexedDB exists, falls back to memory,
  coalesces loads, isolates subscriber abort, reserves bytes, evicts by bounded
  LRU, validates cold records, and degrades cache-admission failure to a direct
  bounded request.
- PASS: geodata `60/60`. Fixed routes preserve validated Shortbread/Terrarium
  bytes, media types, SHA-256 ETags, bodyless 304s, hit/miss/coalesced/stale
  state, bounded retries, stale-on-error, reservation accounting, exact source
  attribution, SSRF resistance, request-rate/concurrency limits, and cache
  health telemetry. A live cached `5/4/7.mvt` probe returned 833,903 bytes and
  then a matching bodyless `304` cache hit.
- PASS: `npm run test:earth-platform:unit` on Node `v24.18.0`: `349/349`
  Node tests—geo-core `80`, geodata `60`, EarthGrid `48`, WXGlobe `28`, XR
  `22`, physics `33`, traffic `12`, RoadVector `66`—plus the mocked Chromium
  RoadVector WebXR harness; zero failures, skips, or cancellations.
- PASS: `npm run test:earth-platform:release`: WXGlobe, EarthGrid, and
  RoadVector rebuilt with 391 Cesium runtime/notice items per build; static
  release checks passed `44/44`; combined deterministic built HTTPS browser
  smoke passed and closed owned port `43947`. Its same-context warm reloads
  prove positive StateManager road/terrain hits with no duplicate fixed-route
  backend request and `yjsReplicated:false`.
- PASS: optional `npm run test:earth-platform:live` completed in 14.1 seconds:
  current Shortbread ocean/water/508-road/one-building tile, bounded Overpass
  172-road/100-building/705-edge region on its second allowed attempt, current
  nowCOAST frame aged 4.88 minutes, finite NOAA ETOPO samples, and a valid
  69,200-byte AWS Terrarium tile.
- PASS: exact private EarthGrid browser proof reached `ready`/`local-live` with
  1,522 road curves, 164 water surfaces, 175 blue shorelines, exactly 175 green
  land companions, a satisfied pair invariant, and zero console/page errors.
  The inspected 1440x900 gallery capture is the current real-source frame.
- PASS: exact private RoadVector browser proof reached ready in 12.195 seconds
  with all 25/25 z5 context tiles, 217 major roads, five current Terrarium
  overview tiles, current FHWA geometry, 1,620 local roads, secure context,
  zero failed responses, and zero console/page errors.
- PASS: direct WXGlobe private HTTPS proof reports secure context, ready,
  `CappedHeightmapTerrainProvider`, positive loaded terrain, zero imagery, no
  fatal error, and zero browser errors at `https://100.68.165.52:5186/`.
- NOT RUN: physical headset enter/exit/re-enter, controller/hand/haptics,
  comfort, and headset performance remain manual hardware gates. No physical
  WebXR certification is claimed.

## RoadVector model, controls, and performance strategy - 2026-08-25 AKDT

- Asset admission must verify the official Sketchfab download archive before
  extraction, reject traversal/oversized members, preserve the CC BY 4.0
  notice, and produce a deterministic optimized derivative. Tests inspect its
  bytes, triangle/draw-call/texture caps, scale/orientation contract, attribution
  sentinel, and absence of runtime requests to Sketchfab/CDN origins.
- Model integration tests keep physics and visuals separate: the six simulated
  bodies, tire particles, suspension travel, wheel contacts, traffic impulses,
  and deterministic hashes remain unchanged while the chassis visual tracks
  interpolated physical transforms and disposes every GPU resource.
- Controller tests cover keyboard A/D and W/S semantics, symmetric steering,
  speed-aware steer/lean bounds, rate limiting, neutral recovery, braking that
  cannot create reverse drive, parking/reset equilibrium, low/high-speed turns,
  acceleration/braking, and identical duplicate-run state hashes. Gamepad,
  touch, and XR normalized signs remain regression-covered.
- Performance tests target measured work rather than loosening physics: exact
  terrain-surface lookup parity, cached inverse inertia correctness, broadphase
  pair equivalence, CCD/contact preservation, determinism, finite state, and
  bounded allocation/resource telemetry. The fixed 120 Hz/twelve-iteration
  contract and physical traffic cages stay asserted.
- Browser acceptance uses actual foreground Playwright keyboard holds and a
  repeatable route/scenario. Record frame count, mean/p50/p95/p99/max frame
  duration, long-frame counts, physics substeps/dropped time, speed, lean,
  steering, slip, contact/overflow state, and before/after CPU hot spots.
- Final gates: focused suites, full physics/traffic/RoadVector unit suites,
  static release assertions, rebuilt RoadVector docs, deterministic built
  browser smoke, private Tailnet HTTPS drive, zero page/console errors, and
  explicit NOT RUN physical-headset evidence when hardware is unavailable.

## RoadVector model, controls, and performance executed evidence - 2026-08-25 AKDT

- PASS: model admission/resource tests `7/7`; the GLB validator reports zero
  errors. Manifest, exact bytes/SHA-256, CC BY records, runtime-relative paths,
  local Meshopt/KTX2 decoders, wheelbase/orientation calibration, caps, shared
  handles, and one-owner disposal are executable contracts.
- PASS: particle-rigid `23/23`; full physics `41/41`; RoadVector `75/75`; XR
  `23/23` plus mocked Chromium. These cover tensor-cache invalidation, pre-cap
  pair pruning, CCD/determinism, fixed-step input filters, compatible 8/20 m/s
  physical turns, nine-second full throttle, service stopping, parking, default
  no-mouse-steer, optional pointer lock, model lifecycle, terrain parity, and
  actual chassis pose following.
- PASS: identical fourteen-traffic fixed-step benchmark improved from 15.9164
  to 5.4705 ms/step (`65.63%`, `2.91x`) with unchanged hash `c8e0778d`, twelve
  contacts, and zero overflow. Terrain sampler parity benchmark improved from
  333.394 to 100.680 ms per 100,000 queries (`3.31x`).
- PASS: foreground keyboard-drive follow-up over straight/right/left/service-
  brake segments rendered 387 frames in 9.574 seconds (`24.74 ms/frame`
  aggregate). Segment means were 27.80, 22.29, 23.01, and 23.71 ms versus the
  intake's 58.84 ms mean; state remained finite with zero capacity overflow.
- PASS: model-integrated production build, static release `17/17`, and built
  RoadVector runtime smoke on owned port `43976` (closed after teardown). Smoke
  proves the 7.5 MB hash-verified model, six-body authority separation, keyboard
  steering/service-brake path, terrain/race/traffic, generation failure/race,
  source cache, and camera/rebase contracts.
- PASS: exact private `https://100.68.165.52:5188/` headless Chromium reached
  ready in 2.796 seconds with permissioned location, secure context, verified
  model SHA, real terrain/roads, no fatal/console/page error, pointer lock off,
  and no physics overflow during W+D/S input.
- NOT RUN: physical headset enter/exit/re-enter, controller/hand/haptics,
  comfort, and headset frame timing remain manual hardware gates.
- PASS follow-up: focused model/particle/renderer tests `39/39`, including the
  single-pass material policy, offscreen-gate culling, shuffled swept-cell
  equivalence, exact candidate-pair ordering, and existing CCD/cap coverage.
  Full physics is now `42/42`; RoadVector remains `75/75`; static release remains
  `17/17` after the final rebuild.
- PASS follow-up built gate: `RUNTIME_SMOKE_DEMOS=motorcycle DOCS_HOST=127.0.0.1
  DOCS_PORT=43977 DEMO_WAIT_MS=500 DEMO_READY_TIMEOUT_MS=45000 node
  demos/tests/runtime-smoke.mjs`; the owned listener closed after the pass. The
  gate requires runtime transmission maximum `0`, no transmission prepass,
  race-gate culling, model authority separation, real data, and zero overflow.
- PASS foreground keyboard drive through the live private source app: `526`
  rAF intervals over `9003.2 ms`, mean `17.116 ms`, p50 `16.7`, p95 `16.8`,
  p99 `33.3`, max `33.4`; ending renderer state was `42` calls / `164,922`
  triangles / `1,074` lines with no fatal error or capacity overflow.
- PASS audit hardening: the vehicle suite now includes a paired parked
  baseline/rebased run that shifts the live parking anchor, advances both for
  one second, and bounds force/velocity/world-position divergence. The model
  fixture uses actual `THREE.DoubleSide` glass, requires `forceSinglePass`,
  zero two-pass transparent materials, one maximum alpha pass, zero
  transmission prepass, and strict numeric grounding metadata/equation checks.
- PASS final post-audit gates on Node `v24.18.0`: focused model plus vehicle
  `26/26`; full physics `43/43`; RoadVector `75/75`; static release `17/17`;
  rebuilt `RUNTIME_SMOKE_DEMOS=motorcycle` on owned port `43978`. The browser
  gate requires positive forced-single-pass material count, zero two-pass
  transparent count, the grounding offset, model/physics authority separation,
  and all existing ride/data/overflow contracts.

## Centered chase, physical road deck, automatic mode, and resident geometry strategy - 2026-08-25 AKDT

- Camera: assert the third-person local X offset and look-target X are centered,
  the camera remains behind the bike on negative local Z, terrain clearance
  still applies, and built public state reports the same values.
- Road contact: build a bounded spatial road-surface index, terrain-drape the
  rendered strip from that same model, and prove tire surface contacts resolve
  on the road deck with finite impulses/friction before and after origin rebase.
  Pose/velocity corrections are forbidden.
- Transmission: prove automatic is default, shifts under physical load, can be
  switched to manual and back (including neutral recovery), survives reset,
  ignores manual shift edges while automatic, and is visible in UI/public state.
- EarthGrid: reproduce view A -> B -> A with no second network request, then
  require compiled-buffer identity/reuse on A's return, atomic old-view retention
  while B loads, exact resident tile/vertex/byte telemetry, LRU destruction at
  caps, and invalidation when terrain height dependencies change.
- Release: rerun geo-core, EarthGrid, physics, RoadVector, static build checks,
  and built runtime smoke; then drive both direct private HTTPS apps and record
  frame/contact/gear/residency evidence. Physical headset remains NOT RUN.

## Centered chase, physical road deck, automatic mode, and resident geometry executed evidence - 2026-08-25 AKDT

- PASS: camera/config tests require local chase X `0`, negative trailing Z,
  centered look X, and desktop pixel-ratio cap `1.5`. Built browser inversion
  of the live chassis quaternion measured local camera offset approximately
  `[0.010, 2.068, -4.557]` after driving.
- PASS: RoadVector `80/80` and physics `44/44`. Road tests prove shared render/
  collider geometry, exact `0.105 m` terrain-relative deck clearance, on-road
  and off-road samples, bounded adaptive sphere sweeps, front/rear tire contact,
  origin rebase, and no capacity overflow. AUTO/manual controller and runtime
  queue-clearing paths are deterministic.
- PASS: the composite collider's Anchorage probe used `14,819` surface samples
  for `14,760` sweeps (`1.004x`), produced physical OSM tire contacts, and ran
  about `5.67 ms` per 120 Hz substep with fourteen traffic cages in the scoped
  Node benchmark.
- PASS: Shortbread focused `26/26` and full geo-core `84/84`. Tests separately
  prove exact object reuse/no fetch/build when height dependencies are unchanged,
  lazy replacement/no fetch after a changed shared resolver, atomic old-view
  retention, hard resident vertex/byte eviction, teardown, and truthful counts.
- PASS: `npm run test:earth-platform:unit` completed geo-core `84/84`, geodata
  `60/60`, Earth `48/48`, WXGlobe `28/28`, XR `23/23` plus mocked browser,
  physics `44/44`, traffic `12/12`, and RoadVector `80/80`.
- PASS: combined static release `44/44`; focused generated Earth/RoadVector
  smoke on owned port `43980`; full `npm run test:earth-platform:release`
  including WXGlobe/Earth/RoadVector built smoke on owned port `43947`. Both
  listeners closed after teardown.
- PASS: direct private RoadVector had centered chase, explicit AUTO, three
  current OSM tire contacts spanning front/rear, one shared render/collider,
  and zero page/console/fatal errors. Direct private Earth z8 A→B→A held source
  `requested=7` and compiled `buildCount=7`, incremented activation reuse `0→2`,
  and retained seven resident buffers / 266,413 vertices / 7,390,098 bytes.
- LIMITATION: system-Chromium software rendering measured only `4.71` rAF/s
  for RoadVector even though isolated physics remained near `88` simulated
  frames/s and road collision sampling was bounded. This is not a headset or
  hardware-GPU result. Physical headset enter/exit/re-enter, hands/controllers,
  haptics, comfort, and frame timing remain NOT RUN.

## RoadVector continuous Cesium-globe ride strategy - 2026-08-25 AKDT

- Baseline first: record full-throttle speed/gear/RPM, suspension travel and
  frame-to-frame deltas, tire contact churn/impulses, dropped fixed time,
  out-of-bounds reset position, and road versus off-road surface metadata on
  flat, slope, rough relief, and the current bounded runtime.
- Geospatial continuity: pure tests must convert the same physical pose among
  WGS84/ECEF, the persistent ride frame, origin-rebased solver coordinates, and
  each streamed terrain window without a position, orientation, or velocity
  discontinuity. Cover antimeridian/high-latitude input and repeated rebases.
- Streaming: deterministic fake-source tests cross the old boundary through
  overlapping terrain windows, retain a physical terrain collider at every
  committed step, abort superseded loads, reuse cached Terrarium/road data,
  respect tile/byte/vertex/concurrency caps, and settle source failures
  truthfully. No boundary reset is allowed in the success path.
- Off-road: front and rear tires must contact terrain outside every road
  footprint, traverse slopes and bounded roughness, and keep suspension travel,
  penetration, slip, attitude, speed, state, and capacity finite. When a road
  exists, its shared rendered/collision deck remains physically above terrain.
- Speed and jitter: duplicated fixed-step runs must reach a materially higher
  stable target on flat terrain, shift through the automatic gearbox, remain
  upright, brake physically, and replay identically. Quantify suspension/contact
  oscillation rather than judging only screenshots; prohibit pose/velocity
  writes, reduced solver iterations, or reduced physics cadence.
- Built runtime: use separate headless Playwright/system Chromium automation to
  hold keyboard controls across at least one old local-boundary distance, then
  leave a road for terrain. Require Cesium ride mode, moving WGS84 position,
  committed terrain generation changes, road/off-road tire contacts, no reset,
  finite physics, no source/cap error, and zero page/console errors. Do not use
  `terminal-browser`. Physical-headset validation remains explicitly NOT RUN
  unless real hardware is available.

### Frozen numeric and stream gates

- Smooth physics: thirty seconds at full automatic throttle on deterministic
  flat terrain, final-five-second mean at least `25 m/s`, chassis-height
  standard deviation at most `0.004 m`, vertical-velocity standard deviation at
  most `0.12 m/s`, axle-load peak at most six times static weight, maximum tilt
  at most eight degrees, finite state, zero overflow, and byte-identical replay.
- Rough/off-road physics: deterministic broad mountain plus short relief,
  twelve seconds at full throttle, peak at least `12.5 m/s`, final at least
  `11 m/s`, maximum tilt at most twenty-five degrees, penetration at most
  `0.025 m`, suspension hard-stop occupancy below five percent, appropriate
  ground-speed gear, finite state, zero overflow, and byte-identical replay.
- Stream state: terrain chunks move through absent, queued, fetching, decoded,
  compiled, resident, active/evicted states. Network completion never mutates
  the live collider. A fixed-step commit publishes one sorted generation shared
  by collider and renderer; a failed/superseded neighbor retains the prior
  overlap and enters `stream-wait` before any unavailable tire query.
- Cache/resource gates: wrapped z12-z14 tile keys; 3x3 active and 5x5 desired
  rings; maximum 32 compiled residents; six source requests; terrain and road
  byte/entry/vertex limits; A -> B -> A exact compiled-buffer reuse without
  refetch; deterministic LRU destruction; terrain required and road missing
  truthfully treated as off-road.
- Frame gates: WGS84/ECEF pose and both linear/angular velocity remain invariant
  through repeated ENU handoffs, including antimeridian/high-latitude cases.
  All current/previous/predicted bodies, kinematic targets, world joint data,
  controller anchors, render chunks, chase state, and XR root transform in one
  transaction; tracked headset camera state is never mutated.
- Runtime gate replaces the bounded-edge reset assertion: drive across at least
  two former regions, observe at least two committed terrain generations, keep
  render/collider generation IDs equal, record no boundary reset/teleport/
  unavailable tire sample, leave the road onto a real slope, meet the physical
  speed gate, and retain bounded cache/resource telemetry. Use standalone
  Playwright/system Chromium only; `terminal-browser` is forbidden.

## RoadVector continuous globe executed evidence - 2026-08-25 AKDT

- PASS: `npm run test:geo-core` -> `87/87`; local-frame tests cover frozen ENU
  point/vector/orientation transforms, inverse round trips, antimeridian and
  high-latitude frames. Particle-world tests cover atomic complete reference-
  frame transformation, local radial-gravity override, isolated post-commit
  listener faults, and legacy translation-shift parity.
- PASS: stream/tile/collider tests cover wrapped z12-z14 keys, explicit polar
  unsupported state, 3x3/5x5 membership, active-first scheduling, deterministic
  reverse completion, stage/reserve/idempotent commit, content identity,
  same-center retry/backoff, supersession, cap/terminal failure, stale-resource
  disposal, A-B-A reuse, exact road precedence, fallback transforms, and
  collision snapshot revision truth.
- PASS: RoadVector `117/117`. Runtime tests cross the former seed boundary onto
  a committed off-road terrain generation, withhold all substeps before a fast
  tire envelope leaves coverage, retain old state on prepare failure, ignore
  inactive desired-content changes, retry rejected preparation, restore the
  seed frame on reset, deactivate far seed traffic/race work, and keep render,
  collision, WGS84/ECEF, camera, and XR frame ownership coherent.
- PASS: decoded-heightmap tests prove concurrent coalescing, subscriber-abort
  isolation, exact Float32 ownership, the 16 MiB hard cap even for injected
  Float64/oversized backing buffers, bounded LRU, transient busy pressure,
  orphan cancellation, destroy/late-completion fencing, and exact `225` logical
  halo reads -> `49` source decodes for one 5x5 window.
- PASS: `npm run test:physics` -> `54/54`. The analytic continuous tread is a
  solver-owned compliant surface-contact shape; wheel rings remain physical for
  inertia/body impacts. Exact final smooth metrics: terminal `30.547739 m/s`,
  final-five-second minimum `26.090229`, mean `28.705664`, chassis-height sigma
  `0.000118162 m`, vertical-speed sigma `0.001767406 m/s`, max tilt `1.04155°`,
  partial-throttle launch `3.200653 m/s`, 147 particles, no overflow, and
  `275.05` fixed steps/s in the instrumented run. Rough mountain, turn,
  physical service braking, reframe/reset, and duplicate determinism pass.
- PASS: `npm run test:xr` -> `24/24`; mocked WebXR browser smoke passes;
  `npm run test:traffic` -> `12/12`. Non-contact renderer/view/camera audits
  additionally pass `38/38`, including no-throw prepared commits and caught GPU
  disposal-listener errors.
- PASS: `npm run build:motorcycle`; Vite transformed `2325` modules, copied
  `391` Cesium runtime/license items, and emitted the current content-hashed
  RoadVector bundle. The expected Cesium-heavy >2.2 MiB chunk warning remains a
  disclosure, not a failed cap.
- PASS: `node --test demos/tests/demo-release.test.js` -> `17/17`. Static
  markers require continuous wheel contact, globe stream/snapshot/reservation,
  WGS84/Cesium authority, Three/WebXR local frame, decoded terrain LRU,
  generated model/license assets, and current HTML disclosures.
- PASS: standalone Playwright/system Chromium built smoke on owned port `43982`
  (closed afterward). It verifies source/cache readiness, complete active
  terrain generation, decoded-cache cap/hits/coalescing, physical fixed-step
  throttle acceleration plus synchronized HUD, compliant tread contact,
  automatic/manual transmission, a ~4 km off-road generation handoff, terrain
  contact outside the seed overlay, no boundary reset, matching renderer/
  collider revisions, reset, supersession, warm caches, and zero page/console
  errors. The first cold run exposed repeated PNG decoding; the second exposed
  a pre-qualification acceleration ordering error; the third exposed a stale
  HUD comparison. Each gate was corrected without weakening stream or physics
  acceptance, and the final rebuilt run passes.
- PASS: the final neighboring-demo compatibility rerun after the RoadVector
  bundle freeze completed EarthGrid `48/48` and WXGlobe `28/28` on Node
  `v24.18.0`.
- PASS: ICC path-scoped guard-diff checks cover `demos/**`,
  `packages/geo-core/**`, `plan/**`, and root `README.md`. The intentionally
  unscoped guard rejects Vite's deletion of inactive hashed bundles by generic
  policy; the fresh build, static `17/17` release gate, referenced-hash checks,
  and exact built runtime smoke prove the generated replacement separately.
- NOT RUN: physical headset entry/re-entry, tracked controllers/hands, haptics,
  comfort, and headset GPU/frame timing. System-Chromium software-render timing
  is not a headset certification. No `terminal-browser` invocation occurred.

## Pages release validation - 2026-11-03 AKST (published November4; scoped limits below)

- Build all15demo packages and run structural release/port checks.
- Serve docs at /peercompute/ without COOP/COEP headers; correct JavaScript .mjs and WASM MIME types. Inspect all17gallery demo cards plus additional shipped HTML routes, desktop/mobile layout, console/page/resource errors and live network state.
- Require authenticated open libp2p connections to the configured SecretWorkshop peer for network demos; config fetch or isConnected alone is insufficient. Exercise opt-in connection controls separately and identify local-only simulations. No relay or geography fixture substitution in this acceptance gate.
- Cold/warm isolation checks must establish crossOriginIsolated/SharedArrayBuffer in document and worker for inference embeddings, with bounded reload and no model/asset caching by the isolation service worker.

### Pages acceptance result - 2026-11-03 23:10 AKST

- `npm run build:all` plus targeted rebuilds of inference embeddings, RoadVector, CubeChat, DaddyGo, Hyperborea and WebGPUPhys: PASS. Final package size/manifest is archived outside Git.
- `node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js demos/tests/pages-isolation.test.mjs demos/webgpuphys/tests/mpm-task-bundle.test.mjs demos/motorcycle/tests/overview/*.test.mjs`:67/67 PASS. Static assertions now follow actual Earth dynamic entry and bundled MPM URL, preserving application/runtime contracts.
- `PAGES_HEADED=1 PAGES_BASE_URL=https://fastbox.tail5c077c.ts.net:5197/peercompute/ PAGES_ROUTE_TIMEOUT_MS=90000 PAGES_OUTPUT_DIR=/tmp/peercompute-pages-final PAGES_CHROME_ARGS='["--enable-unsafe-webgpu"]' node demos/tests/pages-runtime.mjs`:23/23 PASS;46 screenshots visually reviewed, zero console/page/HTTP/request/socket/context-loss errors and no cleanup failures. RealNVIDIA GPU; all owned browsers closed. The authorized static preview remains available on5197.
- Network proof covers inference/CubeChat/Multiscale/RoadVector/NetViz/Schrodinger/SneakyWoods/DaddyGo/Hyperborea, including both Hyperborea HTML routes. It uses actual open encrypted connections to the configured SecretWorkshop identity, without a local relay fixture. Other routes are local-only simulations/galleries.
- Cold/warm static-host isolation and embedded panel startup pass for inference/CubeChat/Earth; inference ComputeManager worker exposes true crossOriginIsolated/SAB/JSPI/memory64. No server header injection.
- Actual owned-peer SmolVLM256M round trip against the rebuilt nested URL PASS46.27s: cached revision-pinned source imported normally into StateManager; independentGPU-disabled requester and same-library tab discover model files and hosting; native managed-worker reply999GPUdispatches/86submissions; hosting off/on and wrapped selectors pass. Native desktop variant of existing model-network-discovery harness archived with exact source; no unrelated host prompted.
- Initial forced-headlessVulkan matrix failures and GPU preset diagnostics are preserved. Native desktop retries establish render/connection readiness; no shader/physics thresholds were weakened. MPM raw source import was independently repaired with an exported bundled task chunk and verified in a worker.
- Limits: RoadVector geography-dependent riding unavailable without deployed geodata; camera/pose gameplay intentionally skipped by DaddyGo automation guard; physical XR untested. Minor nonblocking mobile overlay density/help overlap is recorded in the visual report. Generic ICC generated-asset deletion gate remains a raw failure; it must not be presented as a clean guard.

- Publication follow-up: official Transformers.js4.3.2 package provenance verified against registry/lockfile SHA512 after GitHub flagged minified model identifiers. Supported esbuild lineLimit formatting rebuilds for inference/WebGPUPhys PASS15.27s/11.87s; focused suite repeats67/67 PASS1.24s. Rebuilt-browser and protected-push acceptance are pending; no scanner override.

### Public Pages acceptance - 2026-11-04 05:54 AKST

- Published a281d9b5 to feature/ipfs-artifacts-webgpu/docs after explicit authorization of the verified upstream-identifier false-positive exception. GitHub workflow41851361737 succeeded; /peercompute/inference/ HTTP200 fixes the reported tile404.
- Independent public verifier:33URLs,69,989,814bytes, exact SHA256/size and correct HTML/JS/MJS/CSS/WASM/JSON MIME; second-tile link and all six catalog additions pass. No cache-bypass query. Receipt /tmp/peercompute-pages-public-verification-1104.json.
- Actual public-origin `PAGES_HEADED=1 PAGES_BASE_URL=https://metaversejs.github.io/peercompute/ PAGES_ROUTE_TIMEOUT_MS=90000 PAGES_OUTPUT_DIR=/tmp/peercompute-pages-public-1104 PAGES_CHROME_ARGS='["--enable-unsafe-webgpu"]' node demos/tests/pages-runtime.mjs`:23/23 PASS, all10network routes/9packages show authenticated SecretWorkshop connections. Zero console/page/HTTP/request/socket/context-loss errors; owned browser cleanup clean. Cold/warm document and managed-worker isolation plus embedded panels pass.46desktop/mobile screenshots retained outside Git.
- Scope limitations remain: RoadVector ride needs deployed compatible geodata; DaddyGo camera/pose is excluded by its automation guard; physical XR and two physical-machine inference are not certified by these checks. Prior67focused tests and exact rebuilt-bundle equivalence remain unchanged; no application source changed in this publishing turn.

- Independent46-screenshot/public-console review passes deployment-regression scope. Retain unresolved MPM Headless raw momentum warning (~6.32e5; gravity/wall effects are not subtracted by the UI metric); this is not a numerical conservation PASS. CubeChat62/64 memory64 probes pass, all64 isolation/SAB/JSPI pass; standalone inference worker passes all prerequisites. Minor dense mobile overlays and runtime/teardown warnings remain documented in the external receipt.
- Public owned-peer inference PASS64.56s using normal15pinnedHFfiles, exact manifestCID, owned nonfallbackNVIDIA managed worker and independentGPU-disabled requester;999dispatches/86submissions, native encryptedWebRTC, discovery/hostingoff-on/pickerbounds pass; no page/console/cleanup errors. Command and failed local-seed setup evidence are in plan/log.md. No user profile/storage or unrelated peer prompt used.

### Model console library/navigation/catalog acceptance - November4 2026

- Runtime: stable ascending trusted package-byte ordering; store-scoped successful-load preference; startup/malformed/deleted/incomplete preferences and exact fallback; no startup load; stored-only replacement with zero import/ensure/network calls; cancellation, deletion race, failed load and unavailable-device preservation.
- UI: remembered/default selection survives five-second refresh and filtering; unsupported preferred entry remains labeled and blocked with help; Stored Models Load lifecycle/errors/cancel; About/hamburger focus/Escape/links and back-arrow nested Pages/standalone preview routing; desktop/mobile picker/menu bounds and existing chat/peer controls.
- Catalog: complete seven-repository classification, three custom-codec exclusions, immutable revisions/file integrity/licenses, preserved D14 CID, no execution certification of new large profiles; C30/C20 size admission rejected truthfully. Production builds for standalone and embedded consoles plus owned browser validation on exact preview URL; no unrelated peer prompts or user-store changes.
- PASS150/150 integrated unit tests,44/44UI/navigation and67/67release/ports/isolation/overview checks. Preference race regressions cover two stores/tabs, repeated same-CID loads within one timestamp, delayed/denied lock acquisition, failed loads and cancellation; stale deletion may only clear the exact observed successful-load token. Source logs /tmp/peercompute-console-integrated-unit-final.log, /tmp/peercompute-tsotchke-ui-tests.log and /tmp/peercompute-console-release-tests.log.
- Reproducible real-browser command: `LIBRARY_HEADED=1 PREVIEW_URL='https://fastbox.tail5c077c.ts.net:5189/?dev=1' LIBRARY_EVIDENCE=/tmp/peercompute-console-library-browser node demos/tests/model-library-selection.mjs`. PASS35.924s: normal15pinnedHFfiles imported once, idle remembered selection after reload, Stored Models Load with external model requests blocked (zero repeat downloads), actual local GPU reply999dispatches/86submissions, delete/reload Qwen fallback, five reviewed desktop/mobile screenshots, no page/console/cleanup errors. Native owned Chrome is used because hardware headless probes are unreliable on this system; no terminal browser or user profile touched.
- Owned-peer regression PASS49.987s on the same preview: exact pinned CID, managed NVIDIA host and independentGPU-disabled requester,999dispatches/86submissions over authenticated encrypted WebRTC via SecretWorkshop, host-off/on and same-library discovery pass. Cached pinned files use an owned HTTPS seed; prompts are guarded to the owned peer only. Evidence /tmp/peercompute-console-peer-inference.json.
- Final inference/CubeChat/Earth builds pass11.18s/12.14s/18.78s. Updated docs/inference, docs/cubechat and docs/earth pass four nested Pages-shaped routes on5197 without server-injected isolation headers; cold/warm service-worker isolation and embedded panel startup pass. Both network-enabled affected demos authenticate with SecretWorkshop; Earth remains local-only. All8desktop/mobile screenshots captured, no page/console/HTTP/socket/GPU-loss or cleanup errors. CubeChat's existing pointer-lock warning remains in raw evidence. Actual public delivery is checked separately after publication.
- Public bc392fc8 PASS2026-11-04T16:58:41Z:33HTTP200 exact-byte/SHA256/MIME matches (70,015,458bytes), including gallery second tile,32inference files, isolation worker, all new catalog/About/default/stored-load markers. Actual GitHub Pages overview/inference/CubeChat/Earth browser checks pass4/4 with8reviewed screenshots and0page/console/HTTP/socket/GPU-loss/cleanup errors; networked demos have authenticated SecretWorkshop connections. Console screenshots match nested baseline exactly. CubeChat memory64 probes61/64 (versus62/64 nested) retain the existing universal-worker qualification gap; all64 isolation/SAB/JSPI pass. Evidence /tmp/peercompute-console-public-pages-runtime and /tmp/peercompute-pages-library-public-verification-1104.json. Other19routes retain the preceding full23route validation because their built files were unchanged.


### Resident model lifetime, auto-load/menu and PWA acceptance - November4 2026

- Reproduce exact public remote failure before changes; preserve request acceptance/error stage and route encryption, with no model downloads on requester.
- Owner-lifetime resident reservations must survive many TTLs and clock gaps; ordinary TTLs still expire. Revocation/quarantine/missing workers must remove readiness, retain allocations until acknowledged disposal, and never silently reacquire. Test long load and failed cleanup.
- Startup selects last-used retained model, or another saved compatible package, or default only for an empty library. Execute once, support cancellation, no refresh retry loop; stored startup must avoid downloads. Test accessible menu/modal focus, keyboard and mobile sizing.
- PWA: manifest/icons/start/scope/install event handling; one isolation-compatible worker; bounded versioned same-origin app-shell cache, no model/private/external caching. Verify nested Pages installability and offline shell; network inference and uncached runtimes remain online-dependent.
- Actual managed DreamShaper on public Pages after simulated broker-clock gap, with independentGPU-disabled requester and exactCID/result dimensions; inspect output image and ensure stored startup does not redownload. Existing expired hosting sessions must refresh/reload under the new code.
- Local gates PASS:193integrated unit,49headlessUI,17isolation/PWA and73release/port/navigation/overview checks (overlappingisolationcoverage, not an additive total). Three finalproductionbuilds pass;4nestedroutes/8screenshots and actualfull-console PWA11views pass. RealChromium installabilityerrors[], scopedSW/cold-warm-offlineisolation/hashpinnedcache validated; no modeldownloads inPWAcheck.


### Local loading overlay and GPU-error integrity - November4 2026

- UI: startup saved/default, HF/peer acquisition and Stored Models Load show a native modal spinner with model/stage progress. Cancel and Escape abort the actual load; dialog/focus/background blocking persist until cleanup settles. Verify progress/error/success, cancellation during delayed cleanup, small viewport, reduced motion and absence during ordinary generation.
- Runtime cancellation: abort during post-load metadata, peer setup and preference completion must await resident cleanup, preserve completed artifacts, and conditionally restore the previous preference without overwriting another tab.
- Diffusion: WebGPU validation/allocation/internal errors must fail load/generation and remove hosted readiness rather than return corrupt images. Instrument actual managed GPU execution and visually inspect output separately from dispatch/peer transport evidence.
- Pre-overlay public83b0c1df: library browser PASS40.939s, public4route Pages checks PASS; actual PWA install/offline and empty-library default autoload PASS. Dream lifecycle/transport PASS but bad image output FAIL with captured invalid GPU buffers; root cause and correction remain pending.

- Latest fallback policy supersedes blocked-default idle acceptance: compatible remembered saved→smallest compatible saved→requested default→smallest supported catalog; pending checks avoid speculative downloads. Actual no-f16 browser selects pinnedSmolVLM256. `LIBRARY_VERIFY_LOAD_CANCEL=1` covers real initial/saved-load cancellation, retained bytes, reload/retry and GPU reply. PASS38.244s with no errors.
- Network stream negotiation tries up to4 existing encrypted connections to the exact host, each bounded, before any application write. Test failed preferred native path→actual Noise stream, caller abort/no retry, late-stream abort, complete failure provenance and accepted-request no replay.30/30PASS. No claim that an unrelated console dial warning proves inference failed.
- Final integrated suite213/213PASS; UI55/55, PWA17/17 andrelease73/73PASS. Production builds and local exact-byte/PWA pins pass; real affected Pages startup and live relay fallback validation follow below.

- Final nested Pages PASS4/4 with actual automatic fallback loads and18independently reviewed route/library/overlay screenshots. Controlled real native→encrypted SecretWorkshop relay recovery PASS: same pinnedSmolCID/sameownedpeer, exactlyonegenerationperprompt, GPUdispatches and emptyrequesterstorage; allownedbrowsersclosed. The injected connection-opening failure is explicit; user console-only warning was not reproduced as an inference dial error.

- Public5ab49109 release PASS:38exact-byte/MIME files70,050,283B, actual installability/offline/PWA11views,4actualpublicroutes8views and realownednative→encryptedrelay recovery83.899s. Each of2prompts executesonce; requester0models, zero page/console/cleanup errors. Full startup loading was qualified on3nestedpanels and the publicownedstandalonehost; publicroute smoke explicitly cancelsstartup rather than pretending no model transfer began. Broader full-size Dream image relay-only and current low-memory positive-quality qualification are not claimed.

### Learned embodied agents — proposed acceptance, not executed

- Train a small recurrent policy against the same fixed-step dynamics, actuator limits and observation contract used in the demo. Verify reference-versus-WebGPU outputs, recurrent-state handling and actual control latency before attributing behavior to a deployed policy.
- Evaluate learned target reaching, player following and disturbance recovery on held-out layouts, trajectories and physical parameters across multiple seeds. Record success, collision/stuck rates and latency. Any scripted controller used as an evaluation baseline must be labeled and excluded from learned-policy success claims.
- Compare frozen weights with candidate updates under matched conditions; report recurrent memory, episodic retrieval and weight learning separately. Test retention of prior skills and version/checkpoint recovery. Use algorithm-appropriate rollout provenance rather than mixing arbitrary stale PPO trajectories.
- Test learned router/expert ablations and inference cost to establish whether specialization helps. Check bounded observation access, compatible expert interfaces, continuous control during slow remote inference and exclusive authority after handoff.
- For body adaptation, test changed mass/proportions/joint limits within a declared training range, then report out-of-range failures separately. Preserve identity, learned-state versions and body definitions across restart. No consciousness claim follows from passing these behavioral tests.
- Proposed LLM-directed curriculum acceptance: compare adaptive task selection against a fixed curriculum under matched interaction/compute budgets; measure held-out success, retention and sample efficiency. Keep evaluation metrics independent of proposed training rewards and LLM success narratives. Validate structured task/reward proposals and versioned optimizer updates; small-model inference success alone does not qualify curriculum planning. Not executed.

### Humunculus PDF documentation acceptance — November4 2026

- Run `node plan/demos/humunculus/build-pdf.mjs` with Node24, repository Playwright and system Chrome. Builder generates six SVG diagrams, checks their text fits each box, checks all26pages for overflow and broken internal anchors, blocks external HTTP requests, captures every page and exports a tagged PDF. Browser ownership is bounded and cleanup occurs in finally.
- Independently inspect the actual PDF with `pdfinfo`, `pdftotext -layout` and `pdftoppm` raster pages. Review all pages for clipping, readable diagrams/tables/references and footer separation. Record visual failures before correcting them; HTML screenshots alone are insufficient.
- Verify final local/remote SHA256 after the explicitly requested SCP delivery. Credentials and transport sockets remain outside repository and document. These are document checks, not neural-policy, browser-model or speech qualification.
- Final document PASS:26A4 tagged pages,6vector diagrams,85links,0pageoverflows/diagramtextoverflows/brokenanchors/browsererrors; all26actualPDFpages reviewed and corrected figures4/9/13/14/17 reinspected. Node syntax and `git diff --check` pass. Final PDF547,757bytes; verified local/remote SHA2561deaea3b007c6d72fd8a3ac497adef004a6a62c78fc92a2055021716d996625a. No application-runtime or training test is implied.

### Model browser modal — acceptance, implemented November 5 2026

- Name and description queries, task/source/size filters, explicit unknown sizes, selected-variant package totals and stable ordering across peer refresh. Late or cancelled HF queries must not overwrite newer results; test pagination, offline cache, rate limiting and network failures.
- Separate package/runtime validation, local feature support and unverified memory capacity. Passing features with memory_fit_unverified must remain visible under usable-local filters; local incompatibility must not hide remote inference. GGUF/diffusion search metadata alone must not bypass package admission.
- Responsive desktop/mobile dialog, wrapped names, keyboard search/results navigation, focus restoration and screen-reader labels. No download on browse/selection; explicit Load uses existing acquisition/spinner/cancel flow. Preserve startup preferences, stored loading/deletion, IPFS verification, remote routing, PWA/static-host behavior and existing setup help.

### AGENT-01 full acceptance — remaining stages planned

- Canonical stage gates are in [agent-layer plan](demos/inference/agent-layer-plan.md#validation-and-completion).
  Spawn only the general agent type; multiple instances retain separate identity
  and context, and no role selector is shown. Existing text/vision/image tasks
  remain available through that agent's permitted model routes.
  Verify private transactional IndexedDB saves, restart/schema/export round trips,
  same-origin tab exclusion, storage failures and no public context announcements.
- Train/evaluate the small task–model scorer on versioned outcomes and held-out
  tasks/model families/time splits; compare reference/browser execution, simple
  baselines, quality, total routing/encoder cost and changing host availability.
  Optional peer scores remain bounded/advisory; test timeout/staleness and local
  fallback without recursive routing. Local-only forbids remote inference,
  routing, tools and automatic context transfer at the dispatch boundary.
- Verify separate model-serving, guest-agent, requested-load and mobility grants;
  exact model admission, fair queueing, preserved active user residency, progress,
  cancellation and cleanup. No silent replay after committed remote inference.
- Clone tests require new identity/lineage, selected memories, fresh grants and
  duplicate-request suppression. Migration tests inject failure before/after
  checkpoint, preparation, durable source relinquishment, recipient activation
  and ACK; stale epochs cannot run and timeout cannot elect another owner. Reject
  obsolete authority on backup restore; recheck grants/policy/admission after
  preparation and retain paused ownership if activation is no longer permitted.
  Local-only also blocks automatic remote clones, not only migration.
- Exercise independent browser stores and physical-host operation separately.
  Speech/mesh adapters and dedicated agent types are deferred beyond AGENT-01;
  their eventual implementation needs separate contract and runtime acceptance.

### AGENT-01 first foundation checks — November 5 2026

- `npm run test:agent-layer`:46/46 pass. Contracts/private-store tests cover
  atomic IndexedDB head/event/operation/attachment writes, revision conflicts,
  real cross-tab Web Locks, reload/schema/export-as-new and failed persistence.
  Runtime tests cover eligibility/local-only at dispatch, exact session/CID,
  context packing, bounded FIFO tasks, durable intent, no automatic replay,
  cancellation, stale completions and explicit recovery. Console tests use
  actual dialogs/IndexedDB with simulated inference and label that boundary.
- `node --test demos/tests/inference-panel.test.js demos/tests/agent-console.test.js`:
 68/68 pass, including desktop/mobile bounds, focus, persistence, menus,
  existing model startup/load/delete and cancellation. Separate temporary Vite
  caches prevent optimizer interference between concurrent test servers. Existing
  modelConsoleRuntime/modelLibraryRuntime/stateManager.artifacts suites passed
 71/71 in the integration run; its obsolete toolbar assertion was corrected and
  the whole affected UI suite rerun above.
- `AGENT_MODEL_PROFILE=/mnt/data2/peercompute-support-tests/gemma-profile
  AGENT_MODEL_PORT=5291 AGENT_EVIDENCE=<external-dir> npm run test:agent-layer:browser`:
  owned hardware Chrome, previously cached Gemma270M q4, external source requests
  blocked. Identity/goals/summary affect the response, saved identity/history
  survive browser restart, prior conversation is packed into the next request,
  first-token cancellation settles and the worker remains ready. Actual RTX5060Ti
  GPU dispatches5,951 then5,602; unload leaves zero active CPU/GPU leases. No
  page/console/external/cleanup errors. Never run against a user's browser profile.
- External owned two-process network acceptance also passes: real private agent
  task → model adapter → PeerInferenceService → native WebRTC → managed Gemma
  worker; reply “Blue.”,1,414GPU dispatches/101submissions, provider/CID persisted.
  Requester has no GPU adapter, model bytes, workers or binary WASM. Local-only
  makes zero discovery/generation/wire calls. Cancelled dispatched work becomes
  outcome-unknown and pauses; no replay. Both requests use only the owned allowed
  peer. Context marker/content fields absent from pubsub; zero external traffic,
  browser/cleanup errors and active leases. Same-machine local relay proof only.
- Production builds pass for inference, CubeChat and Earth. Build/runtime/UI
  evidence lives outside Git at `/home/cos/.cache/peercompute-agent-foundation/`.
  Internal preview is updated; public Pages bundles remain unchanged. Learned
  routing, peer rankers, consented loading, cloning/migration, automatic planning,
  journal compaction and restored image previews still need later acceptance.

### Stored-model deletion rejection follow-up — November 5 2026

- Reproduce an unavailable network-owner lock: deletion does not touch the
  package, but the prior controller left a new deleting marker and blocked load.
  Clear that marker only if the protected callback never began and no prior
  cleanup marker existed. Cancellation while queued follows the same rule.
  Once cleanup starts, quarantine remains until acknowledged retry.
- Controller/library suite70/70 passes, including native IndexedDB, denied lock
  preserving error/usability, queued abort, denied retry after prior failure and
  failed unload. Fresh-browser offline UI deletion also removed a synthetic1MiB
  target while preserving another package. The user's original failure is still
  unconfirmed without its footer error; no missing-block GC bypass was introduced.
- Final exact-preview controlled native WebLock check passes: held ownership
  causes the expected explanatory error, unchanged bytes/pins, no cleanupPending
  and button still Delete. Releasing the owned lock permits deletion in109ms,
  frees1,050,004logical bytes and preserves the other package. Zero pending
  operations, workers, leases or publications. Evidence: `deletion-final/`.

### Agent summary document and delivery checks — November 5 2026

- Build with Node24: `node plan/demos/inference/build-summary-pdf.mjs`. Check source
  syntax, one-page layout overflow, actual PDF page count/text and visual raster.
  Validate plan links and TODO ordering. These are document checks, not AGENT-01
  runtime acceptance. Verify SHA256 and byte size after the authorized SCP copy.
- Initial document validation PASS: one tagged A4 page, 419 body words, no page overflow
  or browser errors; actual PDF raster visually reviewed and readable. Builder
  syntax and git diff --check pass; 13 new/relevant local links resolve. PDF
  46,551 bytes; delivery verification recorded in plan/log.md. Runtime gates above
  remain unexecuted.
- General-agent revision PASS: one tagged A4 page, two embedded vector diagrams,
  256 body words, zero page/diagram-label overflow and browser errors. Builder
  regenerates SVGs and validates box text bounds. Final actual PDF visually
  inspected; both ES modules pass syntax checks, 14 local links resolve, and
  scope checks confirm one general type/A0–A6 with speech/mesh work deferred.
  Final PDF65,179bytes; transfer verification recorded in plan/log.md.

### MODEL-BROWSER-01 implementation checks — November 5 2026

- Unit: `node --test peercompute/tests/unit/huggingFace*.test.js peercompute/tests/unit/ggufHub*.test.js peercompute/tests/unit/model*.test.js` checks public API shapes/bounds, exact file closure and hashes, immutable revisions, offline/rate behavior, GGUF tensor/header constraints, acquisition identity and existing library/controller regression behavior.
- DOM: `node --test demos/tests/model-browser.test.js demos/tests/inference-panel.test.js` exercises real native dialogs with an injected no-GPU runtime: filters/unknown sizes, late-response abort, pagination, exact peer-CID matching, host-only visibility, compatibility/setup, keyboard/mobile focus, load cancellation, preferences and chat/library regressions. External requests remain blocked in fixtures.
- Actual runtime: `HF_BROWSER_EVIDENCE=<external-dir> node demos/tests/huggingface-browser.mjs` uses an owned headless system Chrome profile and a small non-catalog Hub model. Require metadata-only browse, explicit modal Load, verified storage, hardware ComputeManager worker generation and source-off browser restart with automatic remembered loading. Record CORS/API requests, renderer/GPU counters, console/page errors, backend discovery and desktop/mobile images. Close its browser/server in finally. No prompts sent to strangers and no model publication.
- Initial actual runtime PASS: SmolLM2-135M-Instruct-ONNX q4,185,376,391B;38,760 GPU dispatches/2,590 submissions on RTX5060Ti without shader-f16; second owned profile session loaded same retainedCID and generated with Hub/CDNs blocked. Zero page/console errors; SecretWorkshop connected3peers/1hosted model, with one unrelated peer-directory timeout retained in report. Source-off model reload does not imply every app asset is offline cached.
- Source/PWA production build, final responsive screenshot review, updated focused DOM suite and generic GGUF runtime result are recorded below when complete. Agent-layer acceptance remains unexecuted.

- Final MODEL-BROWSER-01 result:202/202 focused model/Hub/GGUF-admission tests;55/55 panel regression +16/16 model-browser tests;35/35 existing GGUF regressions;34/34 PWA/isolation/release checks. All3 affected source production builds pass (existing large-chunk warnings). Actual ONNX and GGUF hardware/source-off proofs pass; repeated ONNX retained reacquisition verifies Git-only sidecars locally without fetching weights.
- Actual static Pages-shaped acceptance: inference, CubeChat and Earth3/3PASS, with real cancellation of automatic model startup and cold/warm isolation. Console/page/HTTP/request/WebSocket/cleanup error counts0 in route receipts; Earth has one transient closed-worker diagnostic sample and existing ReadPixels performance warnings, so this is not a claim of every worker probe being error-free. Reviewed10 actual screenshots, including both embedded panels. Earth is intentionally local-only; relay proof applies to inference/CubeChat.
- Exact internal HTTPS preview passes current-build metadata search/variant inspection, mobile/desktop selected-row/action bounds, valid TLS/isolation, SecretWorkshop connection and working overview link. No GPU execution claimed for this final GPU-disabled preview smoke; hardware proof is the separate real workload above. All owned test browsers/servers closed; existing preview service stays available. No public GitHub Pages deployment or generated docs bundle change.

### Hugging Face missing-results follow-up — November 5 2026

- Regression command: `node --test demos/tests/model-browser.test.js` PASS23/23,
  including7new cases for empty HF-only browsing, interrupted debounce/request
  resumption, idle refresh during slow searches, pending filters, alternative quantizations and
  known mismatch exclusion. Existing exact Load/peer identity gates remain covered.
- `node --test peercompute/tests/unit/huggingFaceClient.test.js demos/tests/inference-panel.test.js`
  PASS69/69. Production standalone build passes with the existing chunk-size warning.
- Actual updated HTTPS preview: empty HF-only query returns20repositories; qwen
  returns38, retained as Needs inspection with size, q4 and eligible filters.
  Metadata endpoints return HTTP200, no weights downloaded, zero page/console
  errors; SecretWorkshop connected, TLS/isolation valid. Inspecting the non-catalog
  SmolLM2 package still resolves its exact variants. Desktop1360px and mobile390px
  screenshots visually checked; controls remain within the viewport.
- External receipts: /home/cos/.cache/peercompute-hf-missing/{before.json,after.json,
  after-1360.png,after-390.png,after-inspected.png,model-browser-tests-final.log,base-tests.log}.
  This is metadata/UI acceptance; earlier managed model execution evidence is
  unchanged. No public Pages update or new inference/GPU qualification claimed.

### Broader model-support proposal — November 5 2026

- Metadata-only live resolver probes cover NVIDIA's original Nano4B checkpoint,
  the onnx-community Nano4B conversion and OpenReasoning-Nemotron1.5B conversion.
  Exact revision/package-byte/rejection receipts are outside Git at
  /home/cos/.cache/peercompute-model-support-survey/inspections.json. No weights,
  GPU loads, inference or new architecture acceptance were exercised.
- Before broadening admission: representative actual managed WebGPU runs per
  architecture/precision, prompt/template correctness, repeated-request state
  reset, cancellation/unload, memory budgets, source-off reload and peer use.
  Split packages require missing/duplicate/mixed-revision shards and complete
  tensor/digest validation. These are proposed gates, not executed tests.
### Existing-engine support expansion — November 5 2026

- Core registry/resource/manifest/task/admission tests:82/82 pass. Hub
  client/resolver/conversion tests:34/34 pass. Model-browser DOM checks:32/32
  pass. Existing panel, library, package, console, encrypted peer and GGUF
  regression set:192/192 pass. Evidence in
  `/home/cos/.cache/peercompute-support-expansion/`.
- Real managed hardware acceptance uses `demos/tests/model-support-browser.mjs`.
  Set `MODEL_SUPPORT_REPO`, optional `MODEL_SUPPORT_DTYPE` (q4 default),
  `MODEL_SUPPORT_VARIANT` (exact GGUF filename), `MODEL_SUPPORT_SOURCE` (original
  repository conversion lookup), `MODEL_SUPPORT_EVIDENCE`, disk-backed
  `MODEL_SUPPORT_DATA_DIR` and optional persistent `MODEL_SUPPORT_PROFILE` plus
  stable `MODEL_SUPPORT_PORT`. Run cases sequentially. Existing user GPU work
  must retain enough free host/GPU memory; admission estimates are not measurements.
  `MODEL_SUPPORT_ENABLE_F16=1` enables the previously documented NVIDIA override
  only in this owned test browser for GGUF. Never apply it to the user's browser.
- The harness imports through the shipped runtime/ArtifactStore, requires a
  ComputeManager worker and real hardware dispatches, compares fresh repeated
  prompts, cancels during token streaming, checks recovery/unload and restarts the
  same saved library with external sources blocked. Header-only GGUF Range reads
  are allowed during inspection; full weights are not. Test prompts and packages
  are never shared with other peers. A crashed owned page closes its own context;
  bounded failure diagnostics preserve a receipt instead of hanging cleanup.
- Gemma3-270M-it q4 passes all above hardware/lifecycle gates without shader-f16.
  StableLM2-Zephyr1.6B Q4_K_M also passes all lifecycle gates using the documented
  owned-browser FP16 override;1,031,446,861-byte complete package, revision
  `6da77f49f48f36f1a01753ca27ba531bde13b861`. Both runs have zero page/console errors.
  OpenReasoning-Nemotron1.5B q4 passes metadata and verified import but encountered
  NVIDIA out-of-memory during worker initialization while another browser held
  ~10GiB GPU memory. Its execution gate remains open. Nano4B q4 also passes
  metadata/profile admission; its full hardware lifecycle is pending free resources.
- Standalone, CubeChat and Earth production builds pass with existing size
  warnings. Exact5189 HTTPS preview passes real source→12 related candidates→
  pinned Nano4B ONNX inspection;24 metadata requests, zero weights, no page,
  console-error, HTTP or cleanup errors. Actual authenticated `/noise` connection
  to the configured SecretWorkshop relay verified. Desktop/mobile screenshots
  inspected; owned GPU-disabled browser closed. No public Pages build published.

- 19:39 AKST follow-up: OpenReasoning-Nemotron1.5B q4 retry from the retained
  disk-backed profile passes the managed hardware lifecycle:22,496 dispatches on
  the first32-token request,5,624 on source-off restart, deterministic repeat,
  AbortError on streamed cancellation, recovery and zero active leases after
  unload. No page/console errors or external restart requests. This establishes
  execution, not useful general-chat quality: garden/ocean prompts produced
  unrelated programming continuations. Record that quality gap separately.
  Evidence: `openreason-retry-1939/report.json` in the support-expansion directory.
  Nano4B remains unrun: its7.1GiB host/6.1GiB GPU reservation exceeds current
  available GPU memory before additional loading overhead. Existing browser
  loader retains all external-data chunks simultaneously, so chunked IPFS reads
  do not imply streaming-weight residency. Await released resources for that gate.

- After the user unloaded the resident model, measured GPU free11,125MiB and
  host RAM available14GiB. Nano4B q4 then passes the full real managed GPU
  lifecycle without shader-f16 at19:48:54 AKST: coherent garden/ocean responses
  stop naturally at11/10tokens, repeated garden prompt matches exactly,
  streamed cancellation rejects with AbortError, subsequent generation recovers,
  unload releases every lease and source-off independent-browser restart works.
  First request11,045 dispatches; restart8,279. Zero page/console errors.
  Receipt: `/home/cos/.cache/peercompute-support-expansion/nano/report.json`.
  Its pinned original-to-conversion lookup also passes before acquisition.

- Stored-only OpenReasoning quality probe, separate from lifecycle acceptance:
 256-token math/garden queries make no external requests and execute on the
  managed GPU with no page/console errors. Math recognizes2+2=4 in its reasoning
  but hits length without the requested boxed final answer. Garden repeats an
  unrelated Python word-count task. This fails the bounded response-quality
  screening; do not interpret the harness's execution success as model quality.
  No EOS, sampling or publisher metadata overrides were used. Report/text outputs
  live in `openreason-quality-2026-11-06T04-49-16-113Z` in the evidence directory.
  A future reference comparison should examine export EOS151643 vs upstream151645
  and generation settings; neither difference alone explains the opening text.

### Nano4B suggested catalog — November 5 2026

- 149/149 focused model inference, compatibility, package/library/console and
  resolver checks pass with the new catalog entry. Existing catalog contract
  validates the added profile/files and differentiates its NVIDIA license from
  the Apache entries. Exact profile matches the prior real hardware receipt;
  all9file records match live inspection of the tested immutable revision.
- Catalog lookup recognizes the prior dynamic package despite the display-name
  and catalog-ID change. Model-memory estimates remain7.069GiB host/6.069GiB GPU.
  Production standalone build passes. Exact preview Source=Catalog search returns
  only the new Nano entry without HF metadata/weight/WASM requests. Desktop/mobile
  selection details show2.39GiB/q4 and correct pinned provenance/license; screenshots
  reviewed. SecretWorkshop /noise WSS connected; no browser/HTTP/cleanup errors.

### Interrupted HTTP model download recovery — November 5 2026

- `node --test peercompute/tests/unit/modelDownload.test.js peercompute/tests/unit/modelDownloadBrowser.test.js peercompute/tests/unit/modelLibraryRuntime.test.js`:21/21 pass. Multiple body failures, offset/range/ETag/encoding validation, finite HTTP/header retries, short/oversized bodies, continuous SHA256/Git/CID identity, corruption/quota rejection, inactivity deadlines, abort during read/backoff, stalled cleanup and late fetch disposal. Native headless Chrome cuts a real HTTP body mid-transfer, checks actual206 recovery and persistent IndexedDB, and separately checks abort before any resumed request. Both preserve an unrelated pinned package and close all owned resources.
- `node --test peercompute/tests/unit/artifactStore.test.js peercompute/tests/unit/modelHubPackage.test.js peercompute/tests/unit/modelConsoleRuntime.test.js demos/tests/inference-panel.test.js`:164/164 pass. Includes overlay, cancellation, retention, quota and package-reuse regression coverage.
- The two new suites are included in `npm run test:model-library`. Standalone production build passes; no model weights/runtime changed, so no additional GPU qualification is claimed or needed for the transfer change. Deterministic fixtures prove recovery from native stream failure, not reproduction of the user's exact network-interface change.
- Updated exact Tailscale preview passes desktop/mobile catalog visuals and actual SecretWorkshop /noise WSS connection. Separate native-browser1KiB cross-origin fetch for Nano's pinned large data file returns206 with exact/readable Content-Range and ETag, confirming browser-side recovery prerequisites. No complete model download/GPU run; owned browsers closed. Evidence in /home/cos/.cache/peercompute-download-recovery/preview/.
### Consecutive vision-image context regression — November 5 2026

- Characterize actual managed SmolVLM256M q4 on one worker using A alone, B with
  A's question/answer, and B alone. Record full input RGBA SHA256, prompt/history,
  model CID, worker and GPU dispatches. B's equal hashes isolate history effects
  from stale decoding/transfer/caching. Baseline reproduces red/red/blue for
  “Describe this image.”; explicit dominant-color control gives Red/Blue/Blue.
- UI: native PNG decode of different patterned files with the same name must
  match every expected RGBA byte and independent SHA, distinct request IDs and
  consumed attachments. Delay an earlier native decode to prove it cannot replace
  a newer preview/payload. New image requests on local/peer targets omit prior
  conversational turns but preserve system instructions and visible transcript.
  Following text carries the latest successful exchange; failed/cancelled image
  attempts retain prior committed context. Full panel suite61/61 PASS.
- Agent context/runtime suite22/22 PASS: image requests preserve identity/goals/
  explicit summary and leave persisted events unchanged. Text follow-ups begin
  with the latest completed image exchange. An empty completed caption also
  resets that boundary; incomplete/failed visual requests do not.
- Actual corrected UI and private-agent image sequences use the same source-off
  retained Smol package. Require correct red/blue descriptions, identical expected
  input hashes, visible retained transcript, no worker reload between images and
  zero active resource leases after cleanup. Results and exact-preview screenshots
  live outside Git under `/home/cos/.cache/peercompute-vision-image-reuse/`.

### GGUF FP16 admission clarification — November 6 2026

- Compare raw adapter features with actual collectModelDeviceCapabilities in
  owned Chrome157.0.8103.38, NVIDIA595.91.7.0, identical Vulkan configuration,
  without/with --enable-dawn-features=vulkan_enable_f16_on_nvidia. Both agree:
  absent/present shader-f16, blocked/selectable GGUF respectively. No GPUDevice,
  model downloads or workers. Evidence: /home/cos/.cache/peercompute-gguf-fp16/.
- First external fixture lacked isolation headers and failed that assertion;
  preserve its receipt, add COOP/COEP to the fixture and rerun both fresh browsers.
  Corrected comparison passes. Owned browsers/server are closed.
- Existing compatibility and setup-help suites cover feature/precision gating,
  independent budgets and the startup command:26/26PASS on Node24.22.1.
  Standalone production build passes13.80s. Exact trusted HTTPS preview passes
  desktop/mobile wrapped details, disabled Load and actual Setup help command;
  open /noise WSS to the expected SecretWorkshop relay, no page/console errors.
  Cancelled the fresh-profile automatic Smol README request before transfer;
  zero stored bytes, workers or GPUDevice requests. No model inference rerun.

### CubeChat desktop and touch input — November 6 2026

- `node --test demos/tests/cubechat-input.test.js`: owned browser/controller
  fixture exercises actual keyboard and touch events, coarse-pointer mode,
  idempotent HUD switching, focus/key release and editable fields. The input
  source policy also covers legacy events, keyboard startup and touch fallback.
- Actual app baseline: normal desktop W moves3.839m; coarse-pointer desktop mouse
  start incorrectly selects mobile, records W but returns0movement; phone touch
  correctly enables joysticks. Existing4173 overview Vite HMR errors retained.
- Build CubeChat and validate the exact trusted HTTPS5176 candidate with native
  desktop/hybrid/phone interactions, visible screenshots and actual encrypted
  SecretWorkshop connection. No inferred model output, source-state simulation,
  public Pages publication or user browser/profile changes.
- Evidence/results: `/home/cos/.cache/peercompute-cubechat-input/`; final results
  are recorded in plan/log.md. Temporary owned browsers/fixture servers close;
  the user preview remains available.
- Results: controller11/11PASS, production build16.96sPASS, exact candidate5/5PASS.
  Native desktop/hybrid movement, QE/Space, typing and window blur are verified;
  phone joystick/switching retains one HUD; all connect to expected SecretWorkshop.
  Normal contexts have no page/HTTP/console errors; sandbox denial is intentional.
  Initial headless tab-switch failure emitted no blur; retain it, then use actual
  iframe focus for the native blur assertion. All owned test resources closed.

### November 7 — retained model visibility and local recovery

- Core artifact/provider tests must preserve a complete checkpoint after cancelled
  revalidation, fail closed on missing/corrupt blocks or forged root metadata,
  and serialize audit/pin/deletion while preserving unrelated retained packages.
- `npm run test:artifacts:retention` uses native Chrome with GPU disabled,
  actual IndexedDB/Web Locks and a synthetic32MiB package. Interrupt publication
  by navigation, reopen the same origin, cancel/retry a legacy partial recovery,
  compare SHA/CID and test a second-tab deletion waiting for an active audit.
  Optional ARTIFACT_RETENTION_REPORT writes evidence outside Git. No HF models,
  user profile access or public peer publication.
- Library/controller/panel regressions cover retained partial listing, exact
  GeoRefine catalog identity, remembered startup without replacement download,
  local-only Verify locally progress/cancel and no inference/sharing before
  verification. Actual device compatibility must not disable local verification.
- Model download native-browser test completes4MiB, fails a sidecar, reloads
  persistent IndexedDB and retries. Assert only one weight HTTP request across
  attempts, identical finalCID and rejection of invalid hash/size/partial roots.
  Final verification must detect actual corrupted bytes. Unfinished-file byte
  checkpoints across navigation remain unimplemented and are not a claimed gate.
- Build standalone/CubeChat/Earth shared code and check exact internal HTTPS
  previews with an isolated GPU-disabled browser and model sources blocked;
  inspect desktop/mobile recovery UI and SecretWorkshop connections. Receipts,
  actual outcomes and any limitations belong in plan/log.md.
- Final results: core64/64, controller73/73, importer29/29, native retained
  library5/5, panel65/65, world-agent79/79 and additional integration39/39 PASS.
  Native core32MiB navigation/WebLocks gate passes. All three builds pass.
  Exact5189 native4MiB recovery preserves SHA/CID with zero model HTTP/GPU
  workers; desktop/mobile screenshots fit. Exact CubeChat/Earth scene checks
  pass with expected SecretWorkshop /noise connections and no page/console
  errors or model requests. User27B integrity remains unverified until they
  choose Verify locally. All owned browsers/servers closed; user previews remain.

### November 7 — multimodal resident console acceptance

- Registry/controller: multiple same-runtime residents, additive loading without
  eviction, aggregate memory/slot rejection preserving existing models, exact
  session dispatch/cancel, per-model unload/delete, partial cache recovery and
  unchanged chat startup preference after loading speech.
- Router/protocol: local-first even with a bounded local queue, strict local-only
  dispatch, capability and modality mismatch rejection, multiple hosted models,
  per-model busy state and v2 compatibility. Private actual encrypted peers must
  transfer bounded PCM in both directions with credits/digest validation and
  reject malformed/nonfinite/oversized/truncated audio. No post-commit replay.
- VoiceSession: no mic before Talk, Stop during permission, auto duration limit,
  ASR→conversation→TTS ownership, sequential bounded chunks without truncation,
  cancellation during every stage, late-grant cleanup and no duplicate residents
  between world and console voice. Controlled fixtures are not GPU evidence.
- Native console UI: Mixed default, explicit image intent and attachment
  conflicts, actual selected route label, per-model unload and truthful capacity
  errors, retained Verify locally behavior, responsive keyboard/mobile controls.
- Actual managed specialist runs are gated by available resources; preserve the
  user's active27B model. Build affected demos externally, inspect exact internal
  HTTPS desktop/mobile screenshots and console, and verify SecretWorkshop
  connections. No public deployment unless separately requested. Results and
  limitations belong in plan/log.md and multimodal-console.md.
- Results: registry/controller/router/adapter96/96, model-service/storage68/68,
  full retained library164/164, peer protocol/router64/64, panel/native voice75/75,
  reviewed voice/lifecycle27/27, world-agent85/85, compatibility/help28/28 PASS;
  counts overlap. Three production builds pass. The old world speech directory
  exclusion assertion was updated for v3 sharing with v2/text eligibility checks.
- `npm run test:multimodal:browser` passes with four actual managed workers:
  Gemma270M, SmolVLM256M, Moonshine Tiny and Supertonic. Mixed routes text/vision
  locally; an independent browser with no residents receives real ASR/text/TTS
  over private encrypted WebRTC/v3, including native Talk/Stop and completed
  sequential playback. Per-CID unload leaves three ready residents; final CPU/GPU
  leases and reserved bytes are zero. No external model requests or page/console/
  cleanup errors. Owned test profiles only. Corrected fixture store-name/RGBA-input
  failures are retained separately. A repeat adds standalone mobile composer bounds.
- Exact5189/5176/5187 desktop/mobile visual and SecretWorkshop/noise checks pass.
  All owned browser/server/relay processes close; persistent user previews stay up.
  This pass does not repeat large27B or diffusion numerical hardware qualification,
  nor establish two-physical-device speech performance. Image intent/routes and
  legacy image framing pass controlled/native protocol tests; prior image engine
  qualification remains recorded above.


### Stored selection, pasted images and back confirmation — November 7 2026

- Native startup: any retained/speech/blocked/pending package opens the library
  without inference/import; empty read permits one default; failed read has no
  fallback. Reload/polls/reopening do not trigger selected loads.
- Native batch: eligible checkboxes, CID reconciliation, sequential partial
  success, existing residents, retry only failed choices, middle-item cancel and
  final metadata-read cancel. Failed cleanup keeps ownership/error and stops.
- Native input: actual ClipboardEvent/DragEvent/DataTransfer files and same-origin
  blobs, complete distinct RGBA hashes through Mixed peer routing, retained draft,
  no blob text, non-image/multiple/oversized rejection and no arbitrary HTTP fetch.
  Latest input wins across chooser and blob fetch; removal/disposal cancel intake.
- Native navigation: Stay/Escape preserve draft/residents; Leave navigates only
  after acknowledged cleanup; failed cleanup exposes retry. Desktop/mobile layout.
- npm run test:inference:ui includes the reusable image-input tests. Update the
  actual model-library-selection harness to assert explicit saved selection on
  reload; GPU execution is separate from controlled panel/transport evidence.
- Three external builds and exact trusted HTTPS5189/5176/5187 visual/SecretWorkshop
  probes follow source tests. Preserve old hashed assets for active tabs; no public
  Pages/push/merge. Results and prior failures are recorded in log.md.

- Final isolated Node24 qualification: UI119/119, library172/172, worlds85/85
  PASS. First parallel run and stale fixture failures are retained in evidence;
  no timeout, compatibility or admission checks were relaxed. File input and
  paste/drop send distinct complete native RGBA hashes to the injected peer
  interface. This verifies panel routing/pixels, not another public peer/GPU run.

- Follow-up layout qualification4/4PASS: native wheel scroll reaches embedded
  phone Talk/Send; fixed library footer, desktop/phone standalone bounds and
  loading overlay remain valid. Exact world checks wait for canvas resize to
  settle, then wheel and hit-test composer controls rather than accepting clipped
  bounding boxes. Overview4173 destination HMR diagnostics are retained separately
  from exact5189 console and SecretWorkshop gates.

- Cube global wheel correction: controller tests14/14PASS (previous11 plus3
  native wheel regressions). Explicit/default actual-world canvas ownership allows
  native UI/dialog/editable scrolling, preserves world/pointer-lock zoom, and
  respects handled/modified events. Exact Cube validation separately proves
  constructor default selection against the actual scene and UI hit-testing.

- Final exact trusted previewsPASS: console5189, Earth5187 and correctedCube5176,
  with SecretWorkshop Noise links, desktop/phone screenshots, normal disposal,
  no model transfers or application console/page errors. Cube wheel keeps zoom1.0
  inside dialogs and changes1.0→1.1 on the scene canvas. Retain destination-only
  overview4173 development-HMR diagnostics and earlier failed resize/wheel receipts.
  Evidence: /home/cos/.cache/peercompute-picker-inputs-20261107.


### November 7 — Models tabs and mobile details

- Native browser/panel tests: one Models dialog and two correctly linked tabs,
  automatic Stored models tab only when local packages exist, startup snapshot
  read once, no implicit saved-model activation, and no obsolete main Load/label.
- Keep exact-CID multi-selection, ordinary per-item failure, cleanup failure,
  cancellation, verification, deletion and read-error behavior. Tab changes retain
  checkbox selection and search/filter state without starting model execution.
- Phone detail selection fills the viewport; Done/Escape returns to results and
  their scroll/focus before closing. Desktop retains split results/details. Count
  aligns with Filters and sorting; redundant search/package prose is absent.
- Validate voice guidance, unified agent/direct history, keyboard focus, loading
  overlays and existing image/back behavior through actual new Models controls.
  Run native browser suites serially to avoid host-memory contention.
- Rebuild console/CubeChat/Earth to new external output directories, then verify
  exact Tailscale HTTPS URLs, phone/desktop visual bounds and authenticated
  SecretWorkshop connections. No user profiles, model downloads, public inference
  or GitHub Pages publication are part of this UI acceptance.

- Regression evidence must include stable native result identity under50ms poll
  stress and synchronous close/reopen request ownership. A queued old close event
  cannot cancel the new Stored read; an aborted retained-library read is awaited
  before a new tab open retries it with its own live signal.

- Final acceptance: browser41/41, panel/voice/unified104/104, image/voice helpers
  19/19PASS. Three external builds and exact5189/5176/5187 desktop/mobile and
  authenticated SecretWorkshop checksPASS. Counts exclude focused repeats.
  Preserve the full diff-size gate264>200 failure separately; the passing behavior
  gates do not change that policy or erase initial failure receipts.

### November 7 — compact chat controls

- Network component: healthy/pending/offline truth table, unknown counts and
  artifact/discovery warnings, bounded text diagnostics, keyboard and outside
  dismissal, focus restoration, queued native toggle ownership, disposal and
  non-popover fallback. Native top-layer popup must escape embedded clipping
  and remain in the visual viewport after resize.
- Integrated panel: native 320/390/1280 navigation and composer bounds/order;
  Chat options contains the actual target/check controls, preserves drafts and
  target-specific histories, and restores focus on Done/Escape. Disable it during
  voice/request ownership. Routine status occupies no layout; errors/progress
  remain visible. Open Network status to inspect discovery diagnostics.
- An agent-history failure must remain visible inside open Chat options without
  executing or resuming an agent. Queued native close delivery must not steal a
  newer Message focus or prevent Enter-to-send; verify this deterministically
  with native close followed by explicit focus in the same turn.
- Migrate panel/voice/unified regressions through actual native Chat options,
  then run those three files and image/voice helpers sequentially. Preserve
  saved-library, cancel, back confirmation and paste/drop behavior. Network
  component tests run first; no overlapping browser suites on this host.
- Build console/CubeChat/Earth sequentially into new external roots and verify
  exact HTTPS5189/5176/5187 desktop/mobile visuals, dialog controls and actual
  authenticated SecretWorkshop connectivity. Keep destination-only overview
  diagnostics separate. No user storage, GPU model execution or public deployment.

- Final native acceptance: network6/6, panel/voice/history109/109 and unchanged
  image/voice helpers19/19PASS (134 distinct tests, excluding focused repeats).
  Initial failures are retained; modal-error and queued-close focus defects have
  deterministic regression coverage. All3external builds and exact trusted
  5189/5176/5187 desktop/mobile/SecretWorkshop checksPASS. Preserve separate
  discovered-provider warnings and overview4173 destination diagnostics in log.md.

### November 7 — stored batch actions

- Native library controls have Load selected and Delete selected in the footer,
  without per-row Load/Delete/Retry delete. Keep Unload/Verify locally and linked
  checkboxes. Every retained manifest CID can be selected, including loaded,
  incompatible, verification-needed and cleanup-pending models; only eligible selections
  load. Deletion still works when no local load API exists.
- Batch deletion snapshots unique CIDs, executes serially and stops on error or
  cancellation. Verify partial success, fresh metadata reconciliation, absent-row
  pruning, failed/unstarted selection retention, acknowledged deletion just
  before abort, and disabled controls until delayed cleanup finishes. Repeated or
  stale handlers must not start duplicate operations. Freed totals use returned
  bytes, and runtime reference/ownership rules remain intact.
- Migrate native stored lifecycle and acceptance harnesses through real checkbox
  selection, preserving startup, verification, cancellation, explicit recovery
  and load guards. Run focused new cases then final affected suites serially.
- Rebuild three external previews sequentially. Check desktop/phone footer bounds
  and exact SecretWorkshop connections; exercise Delete selected only on owned
  tiny synthetic layout fixtures. No user model data, weight downloads or public
  publishing. Keep existing provider and overview diagnostics separate.

- Final affected native suite136/136PASS:95panel +41browser. Initial29/30
  exposed a real footer-focus regression; focused7/7 and final full run pass
  after bounded focus restoration. Repeated focused tests are not counted twice.
  All3external builds and exact desktop/mobile previews pass. The real5189 UI
  deletes two owned tiny model fixtures via native Delete selected; counts and
  rows reconcile to zero. All test-owned processes close. See log.md for retained
  provider and overview diagnostics; no user data or model execution was tested.

## CubeChat native social acceptance — November 7

- Run room-chat.test.js against real owned Noise/libp2p instances for authenticated
  authors, exact room scope, bounded UTF-8, replay, partial acknowledgments and
  cleanup; distinguish these local tests from real SecretWorkshop exchange.
- Run core waitForPeerConnection.test.js and agentConversation.test.js for a
  normal dial that is already pending, exact encrypted peer admission, scope
  changes and cancellation without later dispatch. Live room switching must be
  checked from scoped presence, without waiting for connectivity in the harness
  before exercising Send.
- Run cubechat-social.test.js and cubechat-native-ui.test.js headlessly for native
  Enter/Escape/focus, room versus private histories, focused dialogs/mobile fit,
  bubbles following anchors and expiry/disposal, and readable overhead excerpts
  at the normal camera framing on desktop and portrait screens.
- Run world-resident-motion.test.js, cubechat-agents.test.js, world-agent-host.test.js
  and cubechat-input.test.js for one body, ownership takeover, live pose,
  no jump policy, private visitor context and preserved human controls.
- Inference panel managementOnly regression must prove no second composer and no
  automatic download while keeping explicit library operations.
- Build into an external directory, promote only internal previews, use owned
  fresh profiles to exchange real room text between two browser peers and inspect
  both bubbles, connection encryption, console errors and phone/desktop images.
  No model output quality or GPU residency claim follows from this UI gate.
- Results:203 distinct relevant test cases pass, plus all three production builds
  and exact internal preview checks. The real five-phase two-browser run covers
  both directions, room switch, receiver reload and phone delivery; final
  annotation check proves readable phone bubbles. Preserve the failed startup
  dial and test-framing receipts alongside the passing runs; see log.md.

### CubeChat resident presentation and Pages — November 7, 2026

- Native model browser and management panel tests cover one dialog, Stored/
  Browse/Config navigation, paused metadata queries, fresh unload state, loading
  cancellation and failed-cleanup ownership. world-model-window tests exercise
  actual WorldAgentHost with a controlled panel: duplicate opens, awaited/retry
  close, borrowed runtime, focus and teardown during mounting.
- WorldAppearance tests use actual agent persistence and controlled generation:
  no-provider prompt retention without pause/load, local-only versus peers,
  acknowledged image binding, private/shared/digest checks, cancellation and
  removed-body rejection. Real encrypted AgentConversationService tests fetch
  bounded faces with credited frames. Presenter tests own concurrency and reject
  stale/removed/late reads; Cube rendering tests inspect front-only materials,
  compact labels and no unchanged-name texture churn.
- WorldChatResponder and RoomChatService tests cover human-only opt-in,
  authenticated owner+agent IDs, bounded public context, no reply loops, dedup,
  coalescing, cooldown and disposal. Host tests require isolated public history,
  no-provider behavior, stored preference and cancellation before publication.
- Use owned fresh headless profiles for actual production desktop/mobile
  navigation, appearance restoration and two-peer world chat. Controlled image/
  text outputs at the managed inference seam must be labeled; transport and
  persistence remain real. Do not download models or use the user's GPU/store.
- Build all docs/ demos with Node24 npm run build:all, then inspect every demo
  route and console/backend connection. Runtime checks must use current UI and
  block/cancel cold-start model fetches before weight download. After authorized
  push, verify the actual GitHub Pages deployment and critical links.
- Release qualification must distinguish compute from screenshot presentation.
  On this host, headless NVIDIA Vulkan passes default-count compute but produces
  black captures without a working compositor. A known-color canvas with GPU
  readback and screenshot pixels diagnoses this before full suites. Owned Xvfb
  plus software Vulkan provides verified headless presentation; close both owned
  processes. PPF visuals use defaults; `PAGES_REDUCED_PHYSICS=1` uses native controls
  and Pause for bounded Toychest/MPM software captures, with exact counts recorded
  separately from default hardware compute. Do not suppress device-loss messages
  or treat an FPS label as rendering evidence. MPM requires positive mass.
- Preserve prior HEAD hashed docs assets after a release build so open pages can
  still fetch old chunks/workers; verify all new HTML hashes remain unchanged.
  Retention is limited to deleted assets, never old HTML or new direct outputs.


## November 8 chat controls

Run Node24 prompt-style and agent router/runtime/bridge tests, native network
truth-table/panel tests, HoldToRecord real pointer/keyboard tests and console voice
plus unified persisted-agent chat tests. Assert styled local/peer text/vision and
dictated requests, original persisted text, opt-out, exact image/TTS prompts,
mutual exclusion,320px layout and pending-permission/capture cancellation. Tests
use controlled inference/audio with real DOM/IndexedDB/routing; no model-quality
claim. Build all demos; inspect exact inference/Cube Models/Earth preview and
Pages desktop/390/320 screenshots, runtime errors and SecretWorkshop connections.
Public source identity/assets must match the published commit. Preserve old hashed
assets for open pages. Numerical physics is unchanged and uses prior release evidence.

Acceptance so far:193distinct cases pass across focused suites (core36, unified15,
voice/adapter11, hold/console17, panel/network114). The unified total combines
14full-suite passes with the corrected PNG-fixture vision case. Initial harness
failures remain in external receipts. Full15-demo production build passes; internal
3preview routes pass at1440/390/320 with24screenshots and authenticated
SecretWorkshop connections. Headless browser uses software rendering/WebGPU
disabled; no weights, microphone device or user-profile data used. Public results
follow in log.md.

Final public acceptance passes the three affected routes and overview, with 26
reviewed screenshots and actual SecretWorkshop Noise connections. All 114 HTML
and direct-reference assets match; an additional overlapping 54-file check covers
every changed JS/MJS/CSS/HTML release asset, including dynamic application chunks.
Zero accepted-run runtime/request/cleanup errors. Source release dc655b02 is
published; the evidence-only follow-up preserves its exact docs tree.


## README and main integration — November 8

Validate source-grounded README behavior, local Markdown links and npm commands.
Run existing demo-ports/release consistency checks. Preview the merge with
merge-tree, preserve both parents and verify application/docs tree equality to
the already tested feature release; no new application changes imply no redundant
model downloads or full GPU matrix. After push, verify main ancestry/remote SHA,
Pages source main:/docs, exact deployed commit and representative public asset
hashes. Prior full15-demo build/native/public acceptance remains linked in log.md.

Results:43 local README links and89 npm-script references pass; all45 existing
release checks pass after replacing the obsolete CubeChat bot-controls assertion
with its native Residents entry/callback/form contract. Initial44/45 failure is
retained. Merge de73dfd0 has the original main and feature checkpoint as parents;
its full tree equals the feature tree, and docs remains66cce48737e55c075eb589a67d00beb97fc08e39.
Both refs are pushed. Pages source main:/docs and exact de73dfd0 build are verified;
four public entry pages and three direct JS assets match all7 hashes/MIME/HTTP200
(46,032bytes). Evidence under /home/cos/.cache/peercompute-main-merge-20261108.
The concluding plan/log commit changes no application or deployed file.


## Model-network availability follow-up — November 8

Cover image provider arrival/loss, no-provider disabled state, selected request
intent retained, explicit text recovery, offline local generators, local-only
policy, busy queues, disconnected cached targets and failed refresh. Verify the
network directory includes all inference tasks (including speech), unique host
counts, busy/empty states, safe long names, 320px wrapping and stable focus.
Run affected panel/network and shared voice/agent suites; rebuild inference,
CubeChat and Earth. Preserve old hashed assets and qualify changed shared UI on
staging/public, with console errors and authenticated SecretWorkshop connectivity
checked. Final Pages acceptance requires the Actions deploy job and deployment
status for the pushed SHA, plus matching public asset hashes.

Results before publication:247distinct cases pass after the secondary hint uses
aria-live instead of introducing a second primary status region. Initial failures
and an isolated-retry fixture import failure are preserved in external receipts.
Three consumer builds pass with101source hashes unchanged. Staging3routes plus
overview and internal3routes pass (50captures; representative visual review),
actual SecretWorkshop Noise connections and zero accepted-run runtime errors.
Public SHA/deployment and54changed-asset qualification follow.

Final public acceptance passes inference/CubeChat/EarthGrid and overview with
26accepted captures and representative visual review.54changed assets
(14,674,757bytes) match exact913af7f4Git content, HTTP and MIME. Zero accepted-run
console/page/request/model/cleanup errors; actual SecretWorkshop Noise connections.
An initial Earth harness check raced the scheduled network refresh; preserve its
receipt and use bounded12s snapshot convergence. Timed retry waits169/2/2ms.
No application changes were needed. Final evidence-only documentation preserves
docs tree8e3e3e85063ebf32a9c6734245908c2ca84b6749.


## Android microphone startup — November 8

Use fresh documents and raw CDP evaluation with userGesture:false for touch-first
audio tests; ordinary Playwright evaluate can grant activation and hide the bug.
Exercise real WorldAudio/VoiceSession/panel with synthetic input and controlled
inference. First release before capture must cancel, unblock controls and unlock
audio; the next hold must record, and its release must dispatch exactly one ASR
and conversation request. Test default and enforced autoplay policies. Unit cases
cover pending resume, pending worklet, late permission, track cleanup and retry.
No microphone or inference may start after a cancelled hold. Retain normal mouse,
keyboard, cancellation and disposal suites. Browser emulation does not qualify a
physical Android microphone or Safari WebGPU.

Acceptance:54distinct cases pass (33audio/session/hold/console,19world speech,
2actual-panel touch policies). The external six-case real-WebAudio probe also
passes delayed permission/worklet. Removing release-time unlock in an external
negative control fails the actual-panel test as expected; owned cleanup is bounded.
All three consumer builds pass. Staging and exact internal previews pass across
desktop/phone/narrow layouts and authenticated SecretWorkshop connections. These
checks use software rendering and synthetic audio, with no model downloads.


## Library-first documentation — November 8

For the README split, compare root image references and asset hashes to the
pre-edit commit, validate local links/anchors and referenced npm scripts, inspect
the integration example against actual exports/lifecycle methods, and run the
existing demo-release suite after moving its documentation assertions to their
new owners. No runtime build or hardware test is required for prose-only changes.
Record current-versus-research wording and documentation size in plan/log.md.

Results:115local Markdown links/anchors pass; all15root media references and bytes
match58f8c49a. Root integration snippet parses with Node24 and matches live APIs.
17/17existing demo-release cases pass. Library guide checks cover18JS/shell
syntax snippets, JSON and22links; demo guide checks cover45links and15root-script
references (link sets overlap the115total). No runtime/app/build changes.


## 2026-11-08 complete source/status audit

- Coverage:1,047 first-party authored files,25,002,942bytes,466,636lines at173270e1;
  rootlog61,469lines and Multiscalelog23,930lines complete. Exact read ranges/hashes,
  duplicate mappings and exclusions are in the external full-audit evidence folder.
  All5,283tracked paths classified;4,236generated/vendor/data/reference/binary/runtime/
  credential paths excluded. Truncated output was reread before acknowledgement.
- Node24.18 fresh gates: core `node --test --test-concurrency=2 tests/unit/*.test.js`
  from peercompute/:834pass/837,3fail,0skip; Multiscale `node --test tests/*.test.mjs`
  from demos/multiscale/:206/206pass, including temporary build/import checks.
- Failures retained: additionalModelCatalog expected2vs3packages and old rejection
  wording; staged Eshkol serviceOrchestration acceptance. Independent invocation
  produced16changedbytesvs64expected and mismatched tensors; admission blocks it.
  Reconcile producer/contract using independent outputs rather than relaxing checks.
- Other executed scopes: geo-core87/87, geodata60/60, Earth55/55, motorcycle120/120,
  WXGlobe28/28, Schrodinger20/20, CubeRTC5/5, NetViz3/3, sharednested90/90,
  selected13cross-demo Nodefiles83/83, WebGPUPhys bundle1/1+element script,
  chaos JS13/13 and Python54/54. Do not sum overlapping suites or call these
  physicalGPU/browser/device acceptance. Raw receipts retained outside Git.
- Historical Pages/runtime receipts remain dated evidence. Multiscale ordered
  interactions/quorum/SPH and scientific-buffer mutation need independent closure;
  performance acceptance needs a named wall-clock threshold, not merely rendered
  frames. Chaos source concerns require actual routed-packet impairment proof.
- Documentation validation: check local links/anchors, actual API members, executable
  integration/example snippets, original15media references/bytes, existing
  demos/tests/demo-release.test.js and git diff whitespace. No new runtime tests
  are needed for this documentation-only change. Actual results are in log.md.
- [Full status, scientific limits and next gates](reports/2026-11-08-library-status-audit.md).


## Global inference chat — November 8 acceptance

- Service: real local Noise/WebSocket peer streams; authenticated author/scope,
  allowlisted public fields, replay/malformed/oversized input rejection, digest
  verified image/PCM frames, bounded fanout/history, late joins and disposal.
- UI: default Personal, explicit Global/display-name persistence, independent drafts and
  model context, no received-event execution, no Personal publication, frozen
  origin during generation/ASR, perturn text/image/audio, no remote autoplay,
  saved-agent Personal history, management-only exclusion and clear/cleanup.
- Browser fixtures use actual DOM/IndexedDB/VoiceSession with controlled model
  execution and audio; they do not qualify a model, microphone or physical GPU.
  Inspect desktop/mobile screenshots and console. Build consumers into external
  temporary output directories only; docs/Pages must remain unchanged.
- Commands and concrete results are recorded in plan/log.md; existing failure
  baselines from the whole-library audit remain separate.

- `npm run test:global-chat` is the focused28-case command. Final wider evidence:
  75transport/room/inference cases,137existing UI cases,41shared cases and17release
  checks pass (overlap with the focused command is intentional). A73-author
  regression verifies rotating discovery/publish batches and pure status reads.
  Actual isolated SecretWorkshop browsers verify live and late-join text/image/PCM
  without Personal publication. Internal TLS preview checks cover desktop,390px
  and320px; no physical GPU/model or microphone-quality claim.

- Follow-up default is Personal: verify the first submitted prompt stays out of
  public events and later Global context, incoming Global events remain hidden
  from Personal, and explicit Global still shares named prompts/results. Verify
  Personal-first tab order and Home/End keyboard navigation.


### November 8 — CubeChat public resident dialogue regression plan

- WorldChatResponder: current public context at dispatch, same-host/two-host resident exchange, self exclusion, per-human bounded follow-ups and deadline, human-message priority, duplicate suppression, disabled/removed ownership cancellation and no late publication.
- WorldAgentHost/context builder: authenticated owner+agentId match, unknown/spoofed speaker cannot trigger inference, fresh scene/roster under8KiB, latest message retained under multibyte truncation, private visitor history excluded, unavailable models do not persist failures.
- Actual browser acceptance: isolated room, two owned profiles/residents, actual SecretWorkshop encrypted RoomChat transport, deterministic inference capture, bounded exchange then silence, second topic, room isolation and desktop/mobile visual checks. This is not an actual model-quality benchmark. No production-room prompts or public deployment.

- Completed: standard `npm run test:world-agents` includes the new responder/context cases and passes148/148; separate social/input68/68 and core/RoomChat71/71pass (overlapping suites, not summed). Actual two-browser SecretWorkshop room exchange passes two rounds, private owner/visitor freshness and isolation, dedup, room switch, desktop1440/mobile390 bounds and cleanup. External CubeChat/Earth builds pass. Reports: /home/cos/.cache/peercompute-resident-dialogue-20261108/. The controlled inference facade proves prompt/context flow, not real-model dialogue quality.


### November 9 — proposed meet-and-follow acceptance (not yet implemented)

Check sensor scope/age and identity, validated target/intent/outcome sequencing,
private/public memory retrieval isolation and evidence-backed recall after restart.
M0 requires seeded fixed-step episodes, continuous controls and trace recording;
M1 requires actual trained-policy browser execution, held-out approach/stop/follow
outcomes, numerical parity, per-resident state and control continuity during slow
LLM calls. Scripted baselines and deterministic inference fixtures do not prove
neural movement or learning. This planning prompt runs no application tests.

### CubeChat meet-and-follow, edit and clone (November 9; pending)

- Intent parser: unobserved/stale/foreign targets, invalid ranges and malformed output cannot move a body; plain text still chats. LLM output selects intent rather than command-word scripting.
- Memory: exact world/agent/audience/conversation isolation, verified outcome provenance, bounds/eviction/expiry reporting and persistence after close/reopen. No private memory in public context or clone profile.
- Trained motor: reproducible checkpoint/provenance, held-out physical rollouts with zero/random-weight comparisons, learned action parity and real worker GPU execution; no silent scripted fallback. Owner authority, moving during inference, stop/target loss/obstacles and disposal.
- Edit/clone: only owner edits, conflict-safe persistence, appearance replacement, remote source opt-in checked before/after transfer, new destination identity/body, private history/authority excluded, fresh-memory default; UI desktop/mobile.
- Integration: existing world dialogue/voice/appearance, CubeChat input/social and Earth adapter regression; external builds and exact internal HTTPS link. No Pages build/deploy/push.

November9 results: managed motor8/8 plus192actualGPUcomparisons, reproducible
training80/80held-out episodes versuszero/random0/80; realCannon approach/follow,
wallblocking/targetloss and279GPUdispatches withzero leakedreservations. Native
scene/UI/input/social64/64 plus27/27saved-follow restore slice; host24/24,
intent/experience9/9, sharedworld112/112, Earth/voice29/29, memory/profile55/55.
Broadercore103cases initially102pass/1fail; the sole failure reproduced onHEAD
(an old stats expectation omitted three existing artifact-store fields), and the
corrected full assertion's9-casefile now passes. These suites overlap.

Actual two-browser SecretWorkshop clone acceptance passed native UI, public memory
inheritance/donor provenance, private isolation and reload; screenshots fit desktop
and390pxmobile. Language was controlled there. A separate real peer Qwen2B call
completed but declined the requested action; revised contract has unit coverage,
with actual language adherence being qualified separately. External inference and
Earth builds pass; CubeChat production acceptance build passes. No Pages generated
assets or deployment. See plan/log.md and external evidence paths for scope.

Final full-history revision: 71/71 core profile/memory tests, 27/27 world-host
integration tests and 21/21 native private-choice UI tests pass. Actual v2 browser
transfer delivered 42 public/zero private episodes by default, then 42 public/two
private turns after explicit opt-in; scopes, attribution, reload and independently
changing branches verified. Source stayed active. Actual local Qwen0.8B new and
legacy identities selected the correct target; both physically approached and
stopped through the managed learned controller. No further GPU rerun was needed
for subsequent history-only changes. Final preview uses a fresh external build.

Final exact-preview smoke: trusted HTTPS5176 index matches the new external build;
owned isolated-room browser verifies default checkbox states and a live
SecretWorkshop WSS connection, with zero page/console errors. Browser cleaned up.
Public Pages files remain untouched. Build logs and preview-check.json are under
/home/cos/.cache/peercompute-meet-follow-20261109/.

### NetViz All demos — November 9 acceptance

Verify signed-source and bounded telemetry admission; absence of prompt/file/private
state; opt-out and clean connect/reconnect/dispose; stale/replay handling; actual
local host enable/disable/load state. Check aggregation without invented links,
unique per-model hosts, app/role filtering and selected game scope. Exercise
multiple actual browser network instances via SecretWorkshop, compare world/model
reports, inspect mobile/desktop render and console, and preserve legacy session
inspector/chaos overlay behavior. Build consumers into external cache only.
Initial model-provider unit gate: 3/3 passed.

NetViz All demos results:107/107 core/transport/regression checks,12/12 viewer
aggregation/relay checks,14/14 model/provider/runtime checks and27/27 host
regressions pass (overlapping suites). Both existing session inspector and native
viewer smoke pass. Production-browser integration through SecretWorkshop verifies
three publishers, same-model two-host aggregation, disable/busy changes, app
filtering, actual game-scoped attachment and stale removal. Desktop/mobile
screenshots inspected; zero browser/cleanup errors. Actual inline compute ran;
model advertisements were explicit fixtures, with no inference/download claim.
Four external consumer builds and exact HTTPS5182 preview passed.

### CubeChat social initiative — November 9 acceptance

- Scheduler: proximity dwell, authenticated observed IDs, fairness, single slot,
  model-unavailable backoff, resident/target cooldown including re-enable, human
  priority, disappearing targets, edits/pause, monotonic TTL, bounded maps and
  complete timer/controller cleanup. `world-social-initiative.test.js`.
- Decision/context: strict JSON silence/speech, only observed approach/look-at,
  bounded text/goals; managed adapter uses identity/goals/public episodes and no
  private saved summary/journal. `world-social-intent.test.js`.
- Experience/host: observations never become invented heard messages; proposed
  social goals and transport receipts are distinct from completed actions/read
  receipts. Human and owner preemption must not pause/recover AgentRuntime.
- Protocol: real encrypted v2 streams, exact pair/authenticated author, immutable
  root/deadline, contiguous four-turn cap, replay/expiry/cancel, third resident
  exclusion, preserved v1 ordinary chat and fallback display.
- Native UI/contracts: defaultfalse initiative, edit/revoke, distinct reactive
  worldchat, explicit clone consent, bounded mobile status rendering.
- Browser gate: two isolated owned browsers in a unique real SecretWorkshop room,
  controlled language fixture for deterministic network cases and separate actual
  localQwen0.8B decision qualification. Inspect desktop/mobile screenshots and
  console, reload public memories, close owned browsers/server. External build
  only, then exact internal HTTPS preview verification. No Pages writes/push.

Final results:81/81 social contracts,32/32 host,32/32 native UI/bindings and62/62
nearby regressions pass (overlapping suites). Additional final prompt/host suite
runs34checks. Collision tests cover crossed roots, cleanup ownership, spent-turn
carry, deadline preservation and tombstones. Final two-browser acceptance passes
all six groups,10/10exact episodes after reload, zero page/console/HTTP/download/
cleanup errors and inspected desktop/mobile visuals. Actual cached Qwen0.8B
executes on managed worker-1 with26/26layers and native WebGPU buffers; valid quiet
decisions persist correctly, including after balancing prompt wording. No actual
spontaneous greeting is claimed; network dialogue uses a disclosed language
fixture. Evidence: /home/cos/.cache/peercompute-social-initiative-20261109/.

### November 9 — learned obstacle navigation gates (in progress)

- Same bounded local sensor encoding in live physics and training; finite inputs,
  frame transforms, wall/doorway clearance and collision geometry tested.
- Train and retain real weights, teacher provenance, optimization history and
  failures. Compare prior obstacle-free, zero/random and declared teacher controls
  on100 held-out Cannon layouts; report success, collisions, stuck time, latency
  and follow error. Do not substitute the old collision-free simulator.
- Test actual scene motor cancellation, owner pause, stale GPU results, target
  loss, detours and arrival with an intervening wall. Keep private geometry local.
- Verify real managed WebGPU numerical parity and physical wall/doorway reaching,
  actual explicit model-selected actions, native inspector desktop/mobile visuals
  and console/network health in isolated browser contexts. Temporary builds and
  evidence outside docs; promote only internal preview after qualification.

Frozen v4 results:96/100 fresh navigation layouts (wall92%,door100%,box92%,clear100%)
and20/20 fresh60second follow layouts. Development95/100, old checkpoint51/100,
zero/random0/100 are separately reported. Failed candidates and collision/stuck
metrics remain in external receipts; evaluation layouts never enter training.
Real managed WebGPU maximum numerical difference6.26e−6 across192 observations;
five actual browser physics cases pass with delayed1–3substep GPU output delivery.
Reachable browser cases have zero obstacle contacts; enclosed cases report
blockage rather than success. Measured worker wall latency averages3.2–3.5ms in
this test environment, with maximum13.5ms, separate from simulated travel time.

Final focused policy/service14/14, runtime/body43/43, native UI28/28 and host33/33
pass (overlap; do not sum). Post-review coincident-target guard and affected runtime
checks pass. Context correction has37/37 core/intent/experience tests,33/33 host
tests and29/29 social/prompt/world-contract regressions. Real actual-model retry
passes on the same resident:703 then1169 input tokens, actual approach/follow
intentions, wall detour, moving visitor, verified-action memory and native stop.
All208 sampled production-body positions avoid wall penetration. Desktop/mobile
visuals inspected; zero page/console/HTTP/download/cleanup errors. Run details, images,
source hashes and failed attempts: /home/cos/.cache/peercompute-neural-navigation-20261109/.

Exact promoted5176 preview also passes trusted TLS, entry/main asset byte equality,
v4 API, real SecretWorkshop Noise connection and desktop/mobile inspector checks.
Mobile overflow is checked after the canvas resize, with a bounded5second wait.
All owned browsers and the temporary5196server closed; persistent previews remain.

### November 9 — context fitting and resident recovery acceptance

- GGUF: a bounded private one-token probe supplies actual templated token
  counts; reserve requested output, remove oldest complete turns without mutating
  messages/history, retain system/current user, report trimming, bound retries.
  Test cancellation/cleanup, oversized fixed payload, native non-context errors
  and readiness after a rejected request. No invented tokenizer action.
- Agents: first two settled errors return to ready; the third consecutive error
  pauses. Success or explicit owner Resume resets the persisted/derived streak.
  Unknown outcome, persistence failure, owner pause and cleanup remain protected.
  Native clicked-cube chat exposes owner-only Resume; a visitor cannot resume a
  remote resident. Test races, no replay and no loss of history. No private history or
  failure text leaks through public resident descriptors.
- Browser: actual cached Qwen over-budget history and continued conversation,
  then oversized-current-prompt rejection followed by a valid request. Two owned
  peers verify owner chat Resume and forbidden visitor resume, then real follow-up
  inference. Inspect desktop/mobile UI and console in unique SecretWorkshop rooms.
  External builds only; verify exact internal HTTPS previews, close owned processes.

Focused current results:47/47GGUF suite,14/14adjacent admission/service,62/62
agent/protocol,63/63native UI/host and17/17world prompt/intent tests pass (overlap;
not summed). Actual cached Qwen has26/26GPU layers and2048token context; seven
resident turns, native overflow recovery and authentic two-peer recovery pass.
The original zero-token assumption and a near-full repetitive-history model
quality failure remain recorded. Browser-3 final transport assertion was too
narrow: WebRTC exposes native DTLS, while the relay reports Noise. Assess corrected
transport semantics from preserved evidence rather than altering the raw receipt.
Internal final preview checks and local checkpoint still follow.

Final internal previews:5176desktop/mobile native controls and SecretWorkshop
connection pass;5189mobile application connection/390px fit pass. Both owned
browser sessions have zero errors/downloads/cleanup failures. All promoted entry
bytes match external builds under trusted TLS. CubeChat13.03s, Earth18.33s and
inference11.08s builds pass. Public Pages remains unchanged.

### Persistent resident objectives — required checks

- Atomic private objective persistence, host identity and revision checks; strict
  bounds and no active-job inheritance. Save failure before model/action has no
  side effect; uncertain pending checkpoints restore paused.
- Controller validates model choices against fresh observations, correlates
  actual receipts, persists step budgets and avoids replay after interruption.
  Human chat priority, cancellation/cleanup, lost targets, finite retries/deadline
  and model availability backoff are independent gates.
- Native owner controls retain drafts/focus/caret on periodic status and roster
  refresh, including mobile, failures and late callbacks; visitors lack controls.
- Actual peer-model multi-step visit/return uses encrypted inference and real
  local neural worker/physics receipts, retains progress and separates model
  assessment from physical facts. Do not infer remote GPU execution from protocol
  delivery; independently validate local motor execution.
  External build, exact internal HTTPS/network/console and owned-process cleanup.


Persistent-objective results:105/105consolidated checks passed before the two
additional regressions; final focused projection11/11 and controller22/22 pass.
Native UI33/33 and component7/7 passed separately (overlapping suites). Real
relay recovery8/8 plus adjacent73/73 pass. External final Cube13.69s, Earth28.09s
and inference16.94s builds pass; only Cube5176 was promoted. Trusted exact entry
and script bytes, actual SecretWorkshop Noise connection, desktop/mobile390px
controls, console and owned-browser cleanup pass on final preview.

Keep failed model evidence visible: actual peer Qwen2B roundtrip fails because it
repeats the first target until the8step cap. All8inputs fit737–980tokens plus512
reserved, and offline tokenizer replay exactly matches those counts and receipts.
This is not a passed multi-step planner. Browser11 provider absence prevented
resume qualification; browser12 independently demonstrated fresh resumed action
and paused reload, then its diagnostic helper failed on lazy network startup.
Browser13 saw no peers during initial discovery and sent no model requests.
A supplementary saved-checkpoint Cancel test completes that lifecycle separately;
its result must not relabel any original failed report or the roundtrip gate.

Supplemental browser15 passes exact retained-checkpoint restoration, native owner
Cancel and unchanged cancelled state across reload, with no inference or model
download. It accounts for the earlier explicit shutdown's paused event and cleared
pending metadata; no new model/action checkpoint or receipt was introduced. Keep
browser14's stricter pre-cleanup equality failure as harness evidence. Together
with browser12 this verifies the owner lifecycle, not multi-step model quality.
Final host objective integration3/3 passes after the newer-Pause revision fence.


Post-run audit correction: browser15 emitted `Pubsub has not started` during
final cleanup, after the helper's earlier page-error assertion. The functional
persisted Cancel/no-inference checks remain valid, but overall teardown console
cleanliness FAILS; preserve raw report and post-run-audit.json. The final5176
preview smoke independently passed with zero errors through cleanup. The helper
now checks final error arrays; no retry is relabeled a success. Investigate this
startup/shutdown race separately; no source attribution is established yet.
### November 9 — generation admission and peer continuity

The shared console must own a bounded copy of request text/pixels/PCM before
peer discovery, queueing or progress observers. Two calls reusing one mutable
options object must retain their own IDs, messages, settings and callbacks;
callbacks must not receive private request options as their `this` receiver.
Preserve inferred tasks, prompt-only speech/image generation and live aborts.
Run `node --test peercompute/tests/unit/modelConsoleRuntime.test.js`.

- Final controller suite:98/98 PASS. Adjacent model/speech/GGUF/diffusion/agent
  adapter run:171/171 PASS before the final unbound-callback tightening; final
  controller run covers that last change. An external baseline copy without
  admission snapshotting fails all10 mutation regression cases as expected.
- Protocol/audio/router suite:48/48 PASS, including real encrypted Noise peers.
- Live peer probe:7correct short replies including actual Personal history;
  request8 fails before acceptance with ERR_INFERENCE_STREAM_UNAVAILABLE.
  Overall run FAIL, preserving that transport failure; no model-download or
  page/console/cleanup errors.
- Second live probe:6completed requests, same Qwen2B peer and encrypted route.
  Native AgentRuntime Follow→Stop with real persisted history PASS at788/869
  input tokens. Objective receipt-use FAIL:2original prompts and2variants
  omitting only previousStep still approach the already-visited target. No
  truncation; no fabricated body movement. Omitting rationale is not a fix.
- Evidence: `/home/cos/.cache/peercompute-request-continuity-20261109/`.
  Remote app/worker build provenance is unavailable in the current protocol;
  these observations do not inspect decoder tensors or qualify all histories.

- Final internal5189 regression PASS: real peer retains the original SNAPSHOT
  prompt after a routing callback mutates the caller's text to MUTATED; callback
  receiver is undefined. Exact entry/assets, SecretWorkshop connection and
  desktop/mobile390px bounds pass, with zero errors through owned-browser cleanup.
  Root visually inspected the mobile network/model list. Final external builds:
  inference14.22s, Cube13.30s, Earth19.66s; no public Pages artifacts or push.

- Final Cube preview smoke PASS: exact entry/79script bodies, SecretWorkshop
  Noise, desktop/mobile UI, zero errors through cleanup. Earth rendering/network/
  mobile UI and cleanup PASS; raw browser report remains FAIL for a missing
  short-lived Cesium worker response body. A separate trusted HTTPS check matches
  that worker's979bytes/SHA256 to the build; it does not rewrite the failed
  observation. Both owned browsers closed; no residents/prompts were created.

### November 9 — Conan native dialogue reproduction

Use the actual persona supplied by the user, two owned browsers in an isolated
room, and both the owner and visitor's native cube-chat composer. Capture the
current textarea, scoped journal operation, packed messages, request/model/peer
IDs, raw reply, parsed reply and displayed text. Harness integrity and semantic
answer quality are separate gates. Do not resume the user's paused resident,
clear history, replace model replies or silently change providers.

- Native owner/visitor input and display trace PASS; response quality FAIL.
  Both visitor questions receive `I will look-at the owner.`. Normal routing
  switches Nano4B to Qwen0.8B; the first question already produces an unrelated
  movement answer with no prior conversation. Four completed requests, no
  truncation, no downloads and clean owned-browser teardown.
- Four same-Qwen0.8B controlled replays retain exact identity, goals, prior
  messages and settings. The original repeats exactly. Removing only composed
  reply memory or relocating observations causes repetitive512-token output;
  changing only the opening instructions still repeats. All three candidate
  changes FAIL semantic acceptance and remain outside production source.
- Scene compaction must retain the actual CubeChat adapter's `demo` and `theme`
  alongside public `kind`/`world`, bound Unicode labels, preserve exact requester
  identity and remain within3072bytes. The fixed identity remains authoritative
  if labels cannot fit. Focused/adjacent pure suites PASS39/39.
- Evidence: `/home/cos/.cache/peercompute-request-continuity-20261109/conan/`.
  Additional contract experiments must include unrelated questions and explicit
  movement commands; changing sampling or clearing memory cannot stand in for
  correct current-request use. Remote runtime build provenance remains unknown.

- Actual pinned Qwen2B/Nano templates preserve ordered roles and the current
  question; every checked local token count matches its remote receipt. Four2B
  arithmetic ablations isolate prior conversational history: retaining history
  repeats the old answer whether memories are present or absent; omitting history
  answers12 in either memory condition. This is diagnostic, not permission to
  discard history. Full conversation and episodic persistence remain unchanged.
- Confirmed Transformers.js4.3.2 Qwen text-only RoPE defect: actual installed
  tensor preparation continues at3L instead ofL. The scoped compatibility helper
  must fix this for unpadded and padded batches, long prompts and repeated calls;
  retain exact input tensors, image-grid preparation and untouched model instances;
  leave already-corrected or other-version libraries alone; fail unknown behavior
  without leaking tensors; install before a managed session becomes ready.
  `node --test peercompute/tests/unit/qwenTextRope.test.js peercompute/tests/unit/modelInference.test.js peercompute/tests/unit/modelGpuErrors.test.js`
  PASS70/70. This is mathematical/load-boundary proof, not model-output proof.
- External builds PASS: CubeChat12.78s, inference11.88s, Earth26.70s. Only external
  cache output directories used. Actual identical-weight before/after GPU and
  native-chat qualification is pending; internal/public previews remain unchanged.

- Actual GPU pairing completed: same verified1.77GB retainedQwen2B CID/profile,
  identical inputs/options and positive managed NVIDIA dispatches. Baseline scene
  and7+5 both repeat the old assistant sentence. Corrected scene still repeats;
  corrected7+5 and9×4 answer `I will stop.`; Follow lacks an action; Stop passes.
  Semantic gate FAIL, conditional native follow-up SKIPPED. All infrastructure,
  source-off retention and cleanup checks pass. CPU reference exactly reproduces
  both old/fixed pairs; no GPU-only cause established. Evidence in
  `conan/rope-hardware-2` and `conan/cpu-reference-2`; neither passed infrastructure
  field means the repeated-reply goal is complete. Keep previews unchanged.

- Cross-family follow-up: same-Nano four-call baseline/candidate comparison FAILS
  answer relevance, with fresh exact requests, no truncation and clean teardown.
  Six predefined seeded CPU Qwen generations also FAIL robust relevance; output
  diversity does not count as success. Neither change enters production.
- Standard chat comparison matches ordered prompts/tokens/masks for eight inputs
  and output extraction for five generated sequences. Exact pinned Nano ONNX
  graph has all 50 cache names matched; actual JS sentinel cache continuation
  preserves values/identity and advances mask/token inputs. These are structural
  checks, not a numerical model-quality proof. Same-Nano remote build unknown.

### November9 — Global peer-image publication regression

- `node --test demos/tests/global-chat-session.test.js demos/tests/global-inference-chat.test.js`:17/17PASS. Decode a real image-result frame (retaining sha256), publish its owned public pixel snapshot, verify local echo/outbox, ensure no transport/private fields leak, and preserve strict invalid-input rejection. Original peer-image regression FAIL retained before fix.
- `GLOBAL_CHAT_IMAGE_EVIDENCE=/home/cos/.cache/peercompute-global-chat-images-20261109/browser-2 node --test demos/tests/inference-global-media-browser.test.js`:1/1PASS. Two independent owned browsers, unique local scope/Noise relay, actual PeerInferenceService fixed-pixel response, Global binary transfer/render and late original-author history. Check exact intrinsic pixels for attachments/local/remote images; no actual diffusion inference or public messages. All temporary resources closed.
- Production inference build14.95sPASS and exact internal5189 TLS/entry/main/CSS/SecretWorkshop/mobile smoke PASS. Root visually checked phone feed and isolated received images; no console/page/download/cleanup errors. Interrupted build/browser attempts retained.
- Resident numerical diagnostic: completed failing1098-token pair and separate807-token control agree between full prefill and ordinary cached continuation to max3.36e-5/2.48e-5, matching argmax/ranks and48cache hashes. This is a bounded numerical check, not full generated-answer or multi-step acceptance. Original interrupted control report remains unchanged. Repeated dialogue is unresolved.

### November9 — native agent versus Global context diagnostic

- `node --test demos/tests/inference-global-integration.test.js`:2/2PASS,14native UI checks; controlled model/transport only, no external requests. Evidence global-personal-20261109/ui-integration-1.
- External agent-global-native-paired.mjs: four actual same-Nano/peer requests through native Personal saved-agent and Global UI, actual IndexedDB journal, no model/router substitute. Private local publication recorder prevents public feed traffic. Persona is retained Conan fixture; arithmetic12/36 passes direct Global but agent returns unrelated riddles. Current prompts/history, route/CID, no truncation,12sourcehashes and cleanup PASS. Literal stale-answer repetition is not reproduced by this fresh two-turn fixture. No repair accepted.
- Actual protocol generation normalization on captured inputs PASS: first-turn request differs only by identity/goal system text after unique IDs are excluded; current text/options match. No extra network/model calls. Evidence conan/agent-global-native-1/{report,verification,wire-input-comparison}.json.
- First300 history-read theory rejected: actual store caps256events, rejects257. No source change or out-of-contract300+ fixture accepted as evidence for a live bug.

- Scope corrected by user: only CubeChat exhibits repetition. The Personal-agent
  arithmetic/riddle experiment does not reproduce that bug. Primary acceptance
  uses changed current messages in the retained native CubeChat conversation and
  traces request, context, generated output and displayed reply. Assess exact stale
  reply/echo separately from model knowledge or style quality. Randomly varying
  irrelevant answers do not establish restored response continuity. Preserve the
  original journal and movement capabilities; no user-data reset as a remedy.

### November9 — separate resident speech and physical decision candidate

- New `world-intent-decision.test.js`6 and existing `cubechat-agents.test.js`29: final35/35PASS. Validate bounded references, immutable observation ownership, authenticated requester mapping, stale/invalid action rejection, routing/cancellation and actual motor state distinct from chat lifecycle. Controlled motor fixture is not learned-GPU proof. Initial33/35 failure retained (aliased duplicate ID projection fixed; router clone assertion corrected).
- `agentRouter.test.js` + `world-experience.test.js`:26/26PASS; `world-conversation-turn.test.js`:9/9PASS; `world-agent-host.test.js`:38/38PASS in actual browser fixture; adjacent world goal/social/conversation-context checks56/56PASS. Total164 distinct passing cases. Keep exact commands/TAP paths in log.
- Native acceptance uses a separate built HTTPS5191 candidate, two owned profiles/passworded room, five typed turns and ten actual same-Nano/peer requests maximum. Capture current wire inputs, saved request/result pairs, body intents, physical WebGPU Follow/Stop receipts and native rendered replies. No public text, local language weights, manufactured answers, history clearing or user-resident changes. Result pending. First harness attempt failed before inference because events limit300 exceeded API100; preserve and correct harness, never count as product evidence.

- Native split run2 FAIL after4 turns/8same-Nano requests:208-character shared
  scene suffix and null Follow action. Stop unrun. Correct request/history,
  source/assets/transport and clean cleanup pass separately. Retain raw failures
  in conan/native-split-2; no accepted repair or internal-preview promotion.

- Exact post-split captured speech with one duplicate self-memory projected out
  breaks literal repetition while keeping full prior history; current-model
  hallucinated metaphors remain. Symbolic speaker reference selects correct
  Follow target in a separate one-call test. Neither alone proves native repair.
- Final candidate tests: decision7 + Cube body29 + router11 + Experience19 +
  conversation10 + Host38 + adjacent56 =170PASS. Match full episode text before
  excerpt, preserve cross-scope/shared/action records, retain memory when router
  drops the matching turn, and strip local metadata before inference dispatch.
  The worker can further trim by real tokenizer budget; native no-truncation
  checks are separate. v2 five-turn native acceptance pending.

- Native v2 PASS:5typed turns/10actual same-Nano/peer requests, full scoped history
  retained, duplicate memory only projected out, no literal repeats and scene
  shared suffix reduced208→2characters. Threeowner turns change subject; factual
  quality remains weak. VisitorFollow moved14.39units with44WebGPUdispatches and
  durable receipt; Stop clears activeFollow and yields stopped receipt/zero
  velocity. Allsource/assets/private journal/cleanup checks pass. Exact evidence
  conan/native-dedup-1/verification.json; no truncation or local language models.
- Promoted5176 smoke PASS: trusted TLS/exact index,79script byte checks, real
  SecretWorkshop Noise connection, desktop/390px UI and zero error/download
  arrays. Prior private-room assertion and Node/Vite-alias harness failures
  retained. Evidence conan/promoted-dedup-smoke-3/report.json. Temporary5191 and
  owned browsers closed; persistent internal previews remain running.

## November10 full demo release

Use Node24 `npm run build:all` and preserve only deleted prior-HEAD hashed assets;
record new HTML hashes before/after retention. Run release/ports/isolation/MPM
bundle/RoadVector overview checks and the resident-objectives regression. The
`pages-runtime.mjs` matrix has23 entry routes across15 demos and requires actual
authenticated SecretWorkshop connections on11 routes across10 packages. Use owned
headless profiles, cancel automatic model downloads, inspect desktop/mobile
captures and all console/network errors. Separate default hardware physics
compute from reduced-count software presentation as documented above. After
publication verify the deployed commit and local/public file hashes, then repeat
the public browser matrix. Preserve failed attempts and do not treat fixture
success as actual objective-model, microphone/XR or physics numerical proof.

November10 release result: all15 builds; release71 and resident111 focused tests;
23 staged/public route acceptance;11 authenticated production-relay routes;
114 exact public file hashes. PlanetGen's original5s screenshot failures remain;
bounded30s captures pass without changing scene/error gates. Default physics
hardware compute and reduced-count software visuals are separate evidence.
Public captures retain existing mobile panel overlaps and the unqualified MPM
momentum diagnostic. All owned test resources closed. Evidence directory:
/home/cos/.cache/peercompute-pages-release-20261110/.

### November10 persistent model-authored milestones

- Core contract/store: immutable1–6milestone plans, contiguous receipt-derived
  progress, exact action/type/target matches, distinct request IDs, atomic failure
  rollback, legacy migration without invented progress, and paused restore.
- Specialist/controller: plan/current-milestone/assessment separation, current
  participant references, requester-role rebinding after owner Resume, complete
  receipt citation, immutable budgets and no execution before acknowledged state.
- UI: safe labels, ordered current/completed/pending states, escaped content,
  stale-revision rejection, owner controls and mobile fit.
- Network lifecycle: delayed reconnect cannot resubscribe after disconnect or
  replace a new node; scheduler catches rejected async tasks while retaining
  active-session diagnostics.92focused network checks pass; old shutdown failure
  remains preserved separately from the source regression.
- Consolidated `npm run test:resident-objectives`:141/141 PASS after capability
  clarification. This is infrastructure/fixture evidence, not model competence.
- Native `demos/tests/resident-goal-browser.mjs` cases: round-trip, three-step,
  progress-reload. Require frozen source/served-asset hashes, owned private rooms,
  actual unchanged production routing to the advertised model, encrypted peer
  inference, complete input/output token budget, model-authored accepted plan,
  each accepted action tied through a pending decision and acknowledged trace to
  an actual motor receipt, sustained WebGPU motion, exact requested arrival order,
  no replay, owner-only controls, phone screenshots and clean shutdown. Capture
  adjacent trace pairs in acknowledged snapshots because the product retains
  only16trace rows; rejected proposals cannot count as accepted model evidence.
  Owner Pause cancellation is allowed only for the exact uncommitted call pending
  at the actual native click; other errors still fail. No fixtures may substitute
  a model decision, issue a test intention or manufacture a receipt.
- First native candidate failed3invalid plans before movement; preserved under
  `/home/cos/.cache/peercompute-milestones-20261110/native-roundtrip-1/`.
  A single captured-context capability contrast passed its narrow parsing scope;
  physical qualification is still pending. No new public deployment is implied.

Final milestone acceptance: `npm run test:resident-objectives`146/146 PASS;
network lifecycle/regression92/92 PASS; CubeChat/Earth external builds PASS.
Native Nano reports `native-roundtrip-5`, `native-three-step-1` and
`native-progress-reload-1` all PASS under frozen provenance5. Two-/three-step
ordered arrivals, distinct repeated-target receipts, final model assessment,
owner/visitor authority, Pause/Resume/Cancel, paused restore and completion of
only unfinished work are verified through actual peer inference and WebGPU
motor/physics. Model discovery briefly disappeared after reload; it recovered
without consuming a decision. All owned browsers closed with zero page/console/
asset/download/cleanup/late-browser errors. Product source/build is candidate4;
provenance5 only corrects the harness to accept an exact acknowledged orderly
shutdown pause before restore. Every intervening revision must be accounted for,
with unchanged plan/progress/receipts/identity/budgets and no replay. Earlier
failed candidates and narrow one-call contrasts remain separate evidence.
Native model explanations may still copy schema placeholders; physical receipts
and requested arrival order, not prose fluency, establish these results. Phone
modals fit the viewport and scroll internally; their first screenshots do not
show progress lists below the fold. Public assets remain unchanged.

### November10 — standalone inference viewport containment

- Reuse inference-panel.test.js standalone/embedded sizing, menu, chat options and
  attachment checks:6/6PASS. No new implementation-mirroring CSS test.
- External actual-build browser checks cover Personal/Global at390x844,360x640,
  412x915,844x390,390x440,return390x844 and1280x900:14/14PASS. Assert root
  width/height equals viewport, window scroll remains0, composer fits, and long
  transcript/dialog content can scroll internally; focus/resize/close preserved.
- Native mobile address-bar and soft-keyboard behavior is not emulated. Before
  capture also fit in emulation, so do not call this a reproduced native defect.
  WebKit unavailable (missing expected binary, then libmanette on installed one);
  no Safari/device qualification. Chromium console/page/download errors empty;
  real SecretWorkshop Noise connected. Evidence: peercompute-mobile-overflow-20261110
  in the external cache; six unit-browser checks and production build pass.

### Proposed social-errand acceptance — November10

Future tests should prove model-composed movement/question/reply/return/report
across two real peers, with varied names and prompts. Match the exact reply and
its author, distinguish delivery from answer, retain progress without duplicate
sends after reload, and cover departure, timeout, cancellation and privacy. These
are proposed criteria, not tests executed or features implemented in this turn.


### Personal guide / standing welcome acceptance

- `node --test peercompute/tests/unit/agentDefaultResident.test.js peercompute/tests/unit/worldStandingGoalStore.test.js demos/tests/world-standing-goal.test.js demos/tests/world-self-profile.test.js demos/tests/cubechat-guide.test.js`: concurrent provisioning, saved removal, strict IDB transitions, unknown-send suppression, budgets, model-only proposals and input allowlists.
- `node --test demos/tests/world-agent-host.test.js demos/tests/cubechat-native-ui.test.js`: actual IndexedDB/Web Locks and native controls with explicitly simulated inference. Preserve private/public scopes, clone permissions, owner edits/tasks, draft focus and cleanup. Check no-model waiting, rotating peer IDs without regreeting, owner-only self modification, opt-out and concurrent-edit rejection.
- `CUBE_GUIDE_GO=1 CUBE_GUIDE_ORIGIN=https://host:5196 node demos/tests/cubechat-welcome-browser.mjs`: owned private production room, two headless profiles, actual peer inference, automatic guide introduction and co-creation, persistence/removal, live SecretWorkshop connections, desktop/mobile screenshots and console capture. Never use synthetic model responses as actual-model evidence. Do not alter user browsers/models or deploy Pages.

- Final component matrix:195/195PASS (`final-tests-corrected.tap`); the first194/195
  run exposed an obsolete assertion that no taskInstructions existed, now correctly
  checking immutable facts and absence of the legacy action JSON. Presentation-only
  confirmation labels then pass8focused host cases (`final-profile-labels.tap`).
- Retention:85/85targeted/adjacent tests (`retention-adjacent.tap`), four regressions
  fail on original code. Protect active direct/relay inference while allowing idle
  and maintenance-only retirement; actual private Noise service included.
- Native8/build4: actual Nano welcomes/remote receipt and name/appearance CAS pass;
  bundled requested personality missing. Native9: room delivery/capacity failures.
- `CUBE_GUIDE_CASE=local-profile CUBE_GUIDE_PREFERENCE_MODE=focused` with an explicit
  owned cache/profile: actual26/26-layer Qwen0.8 passes goals/name/appearance saves,
  visitor/no rewrite, opt-out, WASD/Q-E knowledge, reload/rotated ID and removal.
  Failed personality-field criteria remain; welcome is disabled for this independent
  scope and cannot establish enabled-welcome browser reload suppression. The latter
  is covered by real IDB host/runner fixtures, not claimed actual-model browser proof.
- Local mapping11 changes only a generic field-mapping sentence in captured input,
  executes once without effects, and returns unchanged profile. Reject this proposal;
  no output repair, hidden retries, downloads or model substitution.
- Build5 differs from actual-model build4 only in friendly profile confirmation
  labels. Cube/Earth builds pass outside docs. Exact promoted5176 desktop/mobile,
  loaded-script bytes and authenticated SecretWorkshop smoke is recorded externally.
  All earlier native failures remain; there is no blanket all-model quality claim.

### Proposed spatial-chat task acceptance — November10

Future acceptance should enter the out-and-back request through ordinary owner
chat, observe both physical legs and receipt-backed completion, and distinguish a
saved return position from a moving requester. Vary wording, starts and distances;
exercise obstacles, unknown targets, unavailable inference, owner Stop and
pause/reload/resume without replay. Assert no hidden direct intent injection or
hardcoded itinerary. These are proposed tests; this recommendation ran no models,
physics, behavioral tests or builds, and did not reproduce the user's exact turn.


### November 10 — spatial tasks from owner chat

Focused suite: worldGoalPlan/Store, world-goal-decision/controller, world-intent/
intent-decision/conversation-turn/chat-task/experience, cubechat-navigation/
spatial-targets, world-agent-host, cubechat-native-ui/guide and resident-goal-controls.
265checks pass. Tests preserve existing suites and explicitly reject guessed
coordinate bypass, visitor task admission, stale resident revisions, aborted
IndexedDB admissions and wrong-target/out-of-radius receipts. CPU-reference
neural weights with real Cannon physics qualify geometry and movement numerics;
they do not qualify the browser WebGPU worker.

`demos/tests/resident-spatial-browser.mjs` requires explicit SPATIAL_GO=1, trusted
SPATIAL_ORIGIN, frozen SPATIAL_PROVENANCE, external SPATIAL_EVIDENCE and an owned
profile. It captures actual inputs/outputs, sampled body movement and physical
receipts for origin/requester/near/obstacle/cancel/reload/unavailable cases.
SPATIAL_LOCAL_CID permits only an already cached owned model; no HF downloads.
Remote cases use ordinary network routing. Failed model/network/harness cases
remain evidence; no synthetic output or scripted itinerary can establish native
acceptance. Final results belong in log.md and the CubeChat plan.

Final spatial slice evidence (November10):266/266 focusedchecks,49motor/geometry
checks,61planner/controllerchecks and Cube/Earth productionbuilds pass. Native
obstacle1 andrequester2 pass actualpeer planning/assessment, bothphysicallegs and
managedWebGPU work. Unavailable1 passes no false task/movement. Reload2 establishes
exact first-leg checkpoint, no replay and acknowledged Resume but harnessrace
stopped before its secondleg. The race is corrected; reload3/cancel1 preflights
refused only554MiB freeGPU, beforebrowser/modelwork. These are notpassingfullcase
results. Near-localcases expose weak-modelplanning; near-peercases failednetwork
discovery. Keepfailedreports. Internal5176smoke passes79scriptbytechecks, normalTLS,
SecretWorkshopNoise and desktop/390px UI. Allownedbrowsers/candidateserver close.


### November 10 — MiMo Q4 catalog admission

- `node --test peercompute/tests/unit/ggufCatalog.test.js peercompute/tests/unit/ggufRuntime.test.js peercompute/tests/unit/ggufHubAdmission.test.js peercompute/tests/unit/qwen9bCatalog.test.js peercompute/tests/unit/modelDeviceCompatibility.test.js demos/tests/model-browser.test.js`: **103/103 pass**. The added case exercises trusted manifest admission and rejects wrong weight size, digest, filename and quantization. Existing legacy manifest identity checks pass.
- Exact upstream GGUF header and complete tensor directory pass the production parser: qwen35, Q4_K_M, 427 tensors, 10,964,088 header bytes, F32/Q4_K/Q6_K tensors. This is bounded file inspection, not a full-weight integrity or execution test.
- Inference, CubeChat and Earth production builds pass outside docs/. Internal preview smoke checks the catalog result, pinned details, desktop/mobile layout and exact served entry files.
- Successful execution of this exact Q4 file is **user-reported**, confirmed November 10; device/browser details were not supplied. No independent inference run is claimed. Evidence: `/home/cos/.cache/peercompute-mimo-20261110/`.


### November 10 — Gemma4 candidate and Qwen image feasibility

- Combined GGUF catalog/runtime/header, Gemma4 catalog, model capability/device
  and model-browser suites: **113/113 pass**. Gemma4 fixtures bind architecture
  to its native tokenizer, reject mismatches and substituted headers, preserve
  text-only scope and pinned package identities. Actual15,822,379-byte publisher
  header passes the production parser; this is not full-weight verification.
- Inference, CubeChat and Earth builds pass outside docs/. Internal preview smoke
  verifies all three exact TLS entry hashes, Gemma catalog details, desktop/mobile
  layout and authenticated SecretWorkshop Noise. No UI-check model downloads or
  page/console errors. Screenshot inspection confirms390px detail containment.
- Native qualification remains **unverified**: isolated attempts were stopped
  during the slow7.38GB download, before model load. No inference, cancellation,
  unload or source-off reload pass is claimed. The owned test profile is retained
  outside Git; no test browser/server remains. A future run should use
  MODEL_SUPPORT_REPO=TrevorJS/gemma-4-12B-it-uncensored-GGUF,
  MODEL_SUPPORT_VARIANT=gemma-4-12B-it-uncensored-Q4_K_M.gguf and
  demos/tests/model-support-browser.mjs with a persistent owned profile. The
  harness now accommodates large transfers and tests changing/multiturn prompts.
- Qwen Image2.1 LoRA evidence is bounded metadata only. Its new plan defines
  separate base-runtime, tensor-mapping/scaling, storage and peer-image gates;
  no Qwen image execution or quality claim.


## November 10–11: GGUF LoRA composition acceptance

- `node --test peercompute/tests/unit/ggufLora.test.js`: canonical original-base
  identity, target/rank/dimension checks, corrupted/stale headers, strength-specific
  identities, shared bytes and runtime admission boundaries.
- `node --test demos/inference/tests/*.test.js`: actual ArtifactStore imports,
  reuse/hash/cancellation, mobile composer and full inference/CubeChat-management
  lifecycle with injected runtime. UI tests do not establish native execution.
- External `lora-acceptance.mjs` local then `LORA_MODE=peers`: actual managed
  Qwen2.5+GGUF adapter GPU execution, zero/active/restored comparisons, changed
  outputs, retained source-off restart, encrypted SecretWorkshop composed-CID
  inference, cancellation/recovery, host withdrawal and zero leases. Both pass.
  Evidence: `/home/cos/.cache/peercompute-lora-native-20261111/`. Fixture training
  provenance/license and model quality are not claimed by this execution test.
- Actual Gemma native/local-peer qualification passed independently; evidence
  `/home/cos/.cache/peercompute-gemma4-native-20261111/{run-2,peer-run-2}/report.json`.
- Remaining 3D gate: real neural output, bounded validated embedded GLB, actual
  two-peer CubeChat placement/CID agreement, source-off retained reload and cancel.

## November 10–11: managed 3D generation and CubeChat objects

- Final core regression: **340/340 pass** covering ArtifactStore and temporary
  retention, mesh geometry/catalog/engine/managed service, strictGLB artifacts,
  model compatibility/library, LoRA, agent routing and v5/v4/v3/v2 inference.
  Command and output: `core-regression-final.log` under
  `/home/cos/.cache/peercompute-mesh-native-20261111/`.
- World regression: **67/67 pass** including actual host owner/visitor behavior,
  object proposals, retained placement, same-request idempotence, stale authority,
  unavailable providers, publish/remove races and real encrypted room snapshots.
  Separate presentation checks cover malformed remote assets, fair retries,
  actual Three GLTFLoader disposal, temporary peer-cache GC and independent pins.
- Actual managed hardware acceptance `acceptance.mjs`, run-6: real pinned Q8
  weights via catalog importer/CID bridge;1,207GPUdispatches per chair; validated
  590,056byteGLB/4,908triangles. Local+encryptedv5peer cancellation/recovery,
  source-off browser restart, identicalmeshSHA and zero leases pass. Two known
  ORT node-placement warnings are retained; no unexpected console errors.
- Actual two full CubeChat apps `full-cube.mjs`: source image through remote
  managed TripoSR, owner-retained placement, authenticated peer discovery and
  Bitswap fetch, second-peer rendered sameCID/pose, owner reload without model
  downloads/regeneration. Observer root remains unpinned/unretained and GC removes
  it after disposal; owner root stays pinned. Zero page/console errors, failed
  requests or HF requests. Visually inspected rendered chair. Evidence:
  `/home/cos/.cache/peercompute-cube3d-native-20261111/report.json` and screenshots.
- The all-model owner-chat→language→image→mesh chain is integration-tested with
  controlled providers; a full real-model chain is not claimed by the image-input
  browser run. No Hunyuan, rigging, avatar or arbitrary3Dexport qualification.
- Final UI/import/management regression:145/145pass, including LoRA composer and
  full actual panel lifecycle. Builds for inference, CubeChat and Earth pass
  outside docs/. Internal5189/5176/5187index hashes match newbuilds; oldhashedassets
  retained. TripoSR desktop/mobile catalog, taskfilter, exactrevision and462.4MiB
  package, mobilecontainment and actualSecretWorkshopNoiseconnection pass with
  zero page/console errors or unexpecteddownloads. Final scope does not publish
  GitHubPages. Nativebrowser/peers closed with zeroowned modelresourceleases.
- Corrected exact internal CubeChat5176 and Earth5187 browser checks also pass:
  initialized actualapps, SecretWorkshopNoise, zero page/console errors and no
  modeldownloads. The first Cube check used a nonexistent hook; preserved its
  timeout report, corrected toworldAgents and reran both pages successfully.

## November 11: complete resident authoring and learned foreground preparation

- Reproduced a stale paused body after resume with a delayed real AgentRuntime
  list; the original refresh failed. The new refresh drain passes 4 regressions
  for the stale snapshot, genuine owner movement, storage error recovery and
  disposal. Combined command (18/18):
  `node --test demos/tests/world-agent-refresh.test.js demos/tests/world-generated-host.test.js demos/tests/world-conversation-turn.test.js`.
- Existing host suite (46/46): `node --test demos/tests/world-agent-host.test.js`.
  World/object/presentation suite (55/55):
  `node --test demos/tests/cubechat-agents.test.js demos/tests/world-generated-action.test.js demos/tests/world-generated-host.test.js demos/tests/world-generated-objects.test.js demos/tests/world-generated-network.test.js demos/tests/world-generated-presentation.test.js demos/tests/world-conversation-context.test.js`.
- Updated mesh/library/import regression (63/63):
  `node --test peercompute/tests/unit/meshImagePreparation.test.js peercompute/tests/unit/meshGeometry.test.js peercompute/tests/unit/meshEngine.test.js peercompute/tests/unit/meshCatalog.test.js peercompute/tests/unit/meshModelService.test.js peercompute/tests/unit/generatedMeshArtifact.test.js peercompute/tests/unit/peerInferenceMesh.test.js peercompute/tests/unit/modelLibraryRuntime.test.js peercompute/tests/unit/modelCatalog.test.js`.
  Covers immutable RGBA, learned mask bounds, alpha bypass, three-session cleanup,
  cancellation/recovery, native loss, package integrity, peer wire and artifacts.
- Legacy/current Stored Models admission (22/22):
  `node --test demos/tests/model-mesh-compatibility.test.js peercompute/tests/unit/modelDeviceCompatibility.test.js`.
  Exact old packages remain trusted; malformed closures fail; catalog selection
  stays current-only. Final metadata-only concise license display preserves full
  component notices; catalog suite rerun 3/3. Suite counts overlap.
- Actual `full-chain.mjs` run3: ordinary owner chat → real peer Qwen0.8 speech
  and independent JSON → DreamShaper opaque image → managed U2NetP+TripoSR →
  two full CubeChat renderers with same retained CID → owner reload without
  generation/HF → unpinned viewer GC. Isolated chair visually accepted, coarse
  geometry explicitly retained as a limitation. No replaced inference stages.
  883820-byte GLB,7356 triangles,SHA277a963c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16.
  Zero page/console errors, failed/HF requests and cleanup errors in both worlds.
- Actual `retained-mesh.mjs`: same origin/profile, current package loaded only
  from IndexedDB with model-source and HF requests blocked; cancellation after
  first density batch returns AbortError and leaves model ready. Recovery
  generates the exact same GLB SHA with1693 GPU dispatches, foregroundRequests2,
  generatedRequests1. No FP16 on the mesh device; zero active leases after unload,
  owned browser/server closed. Two expected ORT node-placement warnings retained.
- Evidence lives under `/home/cos/.cache/peercompute-cube3d-chain-20261111/`.
  Run1 failure (refresh), run2 technical pass/visual failure (background slab),
  and run3 complete pass are preserved. Independent small U2NetP native probe
  on original/grayscale image lives under `peercompute-u2netp-probe-20261112`
  (actual run date November11); not a substitute for managed acceptance.
- Three production builds (inference/CubeChat/Earth) pass externally; no docs/
  assets changed. Internal5189/5176/5187 index hashes and headless checks verify
  actual SecretWorkshop Noise connections, zero page/console errors or model
  downloads. Mobile466.8MiB catalog entry, task filter and viewport containment
  are checked; full original license texts stay in retained provenance while
  the model detail view displays a concise notice.


## November11 complete Pages release

Node24 full15demo build passes; preserve765previoushashedassets and verify23HTML
hashes unchanged by retention. Release/ports/isolation/MPM/RoadVector71cases and
resident-objective172cases pass. Staged23routes pass (19general,4nativephysics);
separate4reducedsoftwarephysics desktop/mobile captures pass. Eleven routes
authenticate to SecretWorkshop. Owned contexts/privateCube room use persisted
paused local-only guide; no model downloads or user inference requests. Existing
Toychest/MPMmobile control overlap and unqualified numerical diagnostics remain.
Public commit/asset/browser verification follows deployment. Evidence outside
repo: ~/.cache/peercompute-pages-release-20261111 and
~/.cache/peercompute-pages-release-audit-20261111.


### Pages runtime pooling and bounded release retention

Full `npm run build:all` now pools both ORT asyncify WASM versions under
`docs/assets/runtime/` before Vite finalizes JavaScript hashes. Individual demo
builds remain standalone. `scripts/pagesReleaseAssets.mjs` snapshots only the
previous manifest's active hashed assets outside the repository, then restores
missing previous assets after rebuilding. `docs/release-manifest.json` separates
active and retained files; retained ancestors never become active on the next
build. The final byte count, including the manifest, must be below1,000,000,000.

Run `node --test demos/tests/pages-shared-runtime.test.js
demos/tests/pages-release-assets.test.mjs` for actual Vite main/worker URL and
hash behavior, immutable bytes, standalone mode, prior-generation retention,
migration, collision/tampering rejection, safe paths, size checks and interrupted
build recovery. Eleven cases pass. Combined release checks are82/82. The first
migration uses the exact November10 build manifest and commit5f3b556a, excluding
its514 already-retained historical files. Corrected full build is984,714,694bytes
(2762active,289retained). Staged/public browser acceptance additionally fetches,
checks SHA/MIME and compiles both pooled WASM assets in the actual browser.

Known transition: the briefly published9e7f9b4c intermediate build is preserved in
Git/evidence, but its new superseded URLs are not another retained generation.
A tab on that intermediate build may need a refresh. Earlier5f3b556a active hashed
URLs are retained byte-for-byte. Future builds use the tracked release manifest.


### Generated resident avatar acceptance — November 11

- Validate strict CID/provenance/GLB bounds before remote transfer or rendering.
- Exercise actual AgentRuntime + IndexedDB commits, cancellation/supersession,
  failed-save/Resume recovery, replacement/reset retention and private sharing.
- Verify one physics body/root keeps movement, picking, labels and current face
  fallback; reject late visual replacements and dispose resources once.
- Exercise real encrypted profile v3 transfer and v2 fallback, permission
  revocation, separately pinned clone wrappers and source-reset independence.
- Run `node --test demos/tests/world-resident-avatar.test.js` plus generated
  object, world conversation, Cube renderer, profile/network and host regressions.
- Native acceptance uses owned private-room browsers and actual available text,
  image and 3D peer providers. Preserve failed outputs. Check peer render, retained
  reload without generation, actual neural movement, cloning and reset. No local
  user model unloading, replacement inference or mock geometry as native proof.

Results: 200 focused regressions pass, followed by 39 renderer/lifecycle cases
after actual-rendered-CID diagnostics. CubeChat, Earth and inference builds pass.
Native robot and creative redesign, same-body neural follow, peer display and
retained reload pass. Remote cloning uses an independent retained manifest.
Native chat reset failed at the peer GGUF provider; direct typed reset subsequently
passed in both browsers and the cloned avatar survived reload. The earlier clone
transfer failure and false-positive harness check are preserved, not counted as
passes. Final internal preview passes exact TLS/index/assets, desktop/390px layout,
authenticated SecretWorkshop and zero browser errors or weight downloads.
Evidence: /home/cos/.cache/peercompute-resident-avatar-20261111/.

### Semantic size and Objects cleanup — November11

- `world-model-scale`, `world-resident-avatar` and `world-generated-*` cover
  explicit/omitted size, malformed bounds/metadata, retained reload/peer display,
  clone file identity, immutable scale, and real Noise v2/v1 range negotiation.
- Cube renderer cases check0.6/6/15-unit avatars and props, natural proportions,
  grounded feet, name/status label refresh, speech anchors, actual mesh picking
  beyond the old cube and no empty oversized hit area. Cannon identity is stable.
- `cubechat-objects-ui` covers owned-only selection/delete, partial failures and
  retry, close/dispose, room changes, delayed startup, mobile wrapping and inert
  untrusted names. Existing Cube native UI/input coverage protects the menu.
- Actual private-room two-browser acceptance reuses already neural-generated
  retained geometry, never substitutes it for a new inference result. Verify
  peer size equality, mobile batch deletion/remote withdrawal, no prop resurrection
  and scaled-avatar reload. Native-scale-delete-1 passes with no browser errors,
  model downloads or new inference calls; all owned browsers/server close.
- Counts:55 core,119 integration,32 renderer,6 new UI,54 existing UI; final14
  prompt/size checks overlap prior scopes. CubeChat/Earth/inference builds pass.
  External evidence: /home/cos/.cache/peercompute-model-scale-20261111/.
- Bounded live planner probe found no remote text candidates and made no model
  requests. Semantic size choice by a real peer LLM remains unqualified; do not
  confuse the passing retained-mesh sizing check with new model inference.

## November 11: Stable Fast 3D managed textured meshes

- `sf3dModelService.test.js`: exact weights/grid/foreground/package admission,
  FP32 compute without shader-f16, source URL and SHA binding, task cancellation.
- `sf3dEngine.test.js`: bounded ranges, actual upstream progress vocabulary
  through peer validation (32 frames), grid export roundoff, partial-load cleanup,
  GPU scratch retirement/live byte evidence, cache preservation and disposal.
  Orchestration tests verify existing DINO/two-stream retirement options and
  phase output lifetimes; these do not substitute for numerical GPU execution.
- `generatedMeshArtifact.test.js`, `generatedMeshTexture.test.js`, and
  `demos/tests/generated-mesh-textures.test.js`: embedded PNG/JPEG/UV/PBR bounds,
  hostile URLs and malformed geometry, real software-WebGL pixels and complete
  bitmap/texture disposal on success, failure and cancellation.
- Peer inference tests preserve v2–v5 behavior and prove v6 textured transfer
  across real authenticated Noise streams. Older directories omit SF3D; stale
  entries cannot downgrade execution or pass textured bytes through v5.
- External native harness: `/home/cos/.cache/peercompute-sf3d-20261111/`.
  Run2 exposed Vulkan OOM from disabled intermediate retirement; preserve that
  receipt. Run3 generates a textured chair (59,928 vertices/19,976 triangles,
  2,508,868 bytes,8,905 GPU dispatches,83.07seconds), with5.40GiB peak requested
  buffers after the lifecycle correction. This excludes driver overhead and is
  not a cross-device performance guarantee. Visual output inspected. Source
  imports reused all existing files without new downloads. Cancellation then
  exposed stale ready state; explicit session retirement and acknowledged stored
  reload fix that lifecycle. Map/Set and module-private shader cache regressions
  prevent scratch cleanup from destroying next-request uniforms.
- Run7 passes repeated opaque local/peer generation with matching SHA and peer
  cancellation/zero leases; its old page fails stored reload. Fresh run8 passes
  cancellation, stored reload, peer generation and browser-restart regeneration
  with source fetches blocked, matching SHA, zero browser errors and zero leases
  after unload. Both test browsers and their server close.
- `native-textures-3` passes actual CubeChat prop/avatar peer display and both
  reloads, with screenshots. Preserve two initial discovery timeout receipts;
  successful first discovery used diagnostic queries on existing connections.
- Final combined affected suite passes340/340, including15engine and101model
  controller tests. Native v6 transfer reports encrypted native transport;
  do not describe that particular receipt as Noise. Exact preview verification
  and final build receipts are recorded in log.md.


### Resident avatar inputs, turn recovery and facing (November 11)

- Host tests use real AgentRuntime journals, WorldMemoryStore and artifact
  managers with deterministic inference fixtures: declined speech starts no
  action/image/mesh call; failure returns idle; the next turn receives the new
  prompt and saved failure; direct owner images and exact prompts bypass speech;
  image pixels are copied; owner authority and command-history restoration hold.
- Reference pixels and exact-prompt mode participate in deduplication. Invalid
  reset combinations fail before dispatch. UTF-8 history fits the memory limit
  without preventing valid non-English commands or losing failure receipts.
- Mesh tests change provider availability between stages and preserve local-only
  routing/cancellation. Literal prompts are not decorated; normal generated
  references retain their existing background instructions.
- Browser UI coverage includes owner/remote/room/busy gating, dropped/pasted/file
  references, preview removal, late decode cancellation, success/failure retention
  and escaped model attribution. 58 UI tests and 9 shared media tests pass.
- Facing: 38 CubeAgentLayer / textured GLB tests pass for SF3D front alignment,
  legacy and prop orientation, local/remote movement, grounding/picking/labels.
  Actual retained chair screenshot inspected; no fresh model inference required.
- Regression fixtures identify action requests by the existing instruction prefix
  plus observation marker, since reply-consistency text now lies between them.
  Earlier failed fixture run is retained; do not mistake it for product acceptance.
- Final test/build/internal HTTPS receipts belong in log.md. No docs/Pages build
  or push is part of this slice.

Final focused avatar/conversation/intent/mesh/object suite:68/68passes. Final
UTF-8 failure-receipt host scope9/9passes and task-attribution scope3/3passes.
Desktop/mobile internal native UI checks pass at1440x1000 and390x844 with no
overflow or JS/console errors; exact final asset/network receipts are external.


### Image avatar height and full Pages release — November11

Use verified mesh bounds to convert target height into the retained max-extent
size. Test non-square geometry, zero/invalid/excessive bounds, appearance body
hints vs incidental small features, inferred-vs-explicit request identity,
private appearance omission, owner CAS, peer reload and clone scale. Render a
wide avatar beside a six-unit cube and measure height12 with grounded feet.
Keep prior prop/explicit sizing tests. Full release uses canonical build:all,
bounded release manifest/ORT pooling,23routes and11network routes, visual review,
public commit/asset hashes and real SecretWorkshop connections. Preserve previous
failed receipts and do not claim these startup checks as model-quality tests.


Current sizing/release results:36focused tests,34renderer tests and82release
checks pass. Actual retained SF3D chair and wide mesh both measure12units high
beside cube6. Canonical site630,687,954bytes; all3064manifest file hashes match,
all prior active assets retained, and211removed files are prior-retained outputs.
Staging general19/19 and all11SecretWorkshop routes pass; remaining physics and
public checks are recorded in log.md. Generated whole-diff guard failures remain
reported separately from passing authored-source/whitespace checks.

Staging acceptance completed:23unique routes plus4software physics presentation
repeats,11authenticated SecretWorkshop routes,68independently reviewed captures,
zero route error counters or generated model responses, allowned sessions closed.
Hardware captures are diagnostic-only; software captures qualify visible physics
scenes. Existing WXGlobe footer overlap and geography/camera/XR limits remain.
Public verification follows publication; do not infer it from local staging.

Public acceptance at5cef8af7 passes119HTTP/MIME/hash checks,19general routes,
4native physics routes and4software presentation repeats:23unique routes,
11authenticated SecretWorkshop routes,68reviewed screenshots, zero recorded
browser/network/GPU-loss errors and clean owned-resource teardown. Existing MPM
headless momentum drift is confirmed against prior35bec9c5 public evidence;
numerical conservation remains unqualified. No model inference was performed
for this deployment. External public-summary.json and public-review.json retain
full evidence and limitations.


### Continuous resident OODA and recovery

Use fake clock/RNG to verify60–180second recovery, owner-pause race protection,
lease loss, cancel acknowledgement, repeated errors without permanent pause,
busy/no-model without failure budget consumption, and fresh request identity.
Exercise two residents receiving one world-chat hello and deferred resident
dialogue without consuming turns or republishing acknowledgements. Vision
checks: no capture until requested, local-only routing, body POV independent
of player camera, no UI/video capture, state restoration and stale-result
rejection. Model recovery checks: exact retained CID/options, cleanup before
reload, explicit unload/delete/cancel wins and no generation replay. Headless
visual and real peer acceptance follow focused tests; keep failures and limits.


November12 crash resumption: authored edits survived, preview services restored,
Node24 retained. Rebuild serially. Full Pages publication is explicitly authorized
once continuous OODA/recovery acceptance passes. Original two-resident hello
context overflow was reproduced on real peer Qwen0.8 at2048context; public scene
projection removes duplicate metadata/current-event context while preserving full
user speech and durable history. Real resident POV vision and fresh postvision
reflection, automatic recovery and owned-worker retained reload pass. A final
original-input social conversation run and final full staging/public checks remain.


November12 functional acceptance complete: unchanged2048-context peer Qwen
successfully answers two resident hellos and reciprocal resident dialogue;
model-selected POV vision and private reflection work, automatic readiness
recovery and retained worker reload pass without replay. Follow cognition keeps
the standing follow command intact. Final full Pages build/route/visual/network
validation and authorized publication are now in progress.


Final staging release checks pass: canonical build630,451,926bytes; independent
3057file manifest;19general+4native physics routes with4software presentation
repeats;11authenticated SecretWorkshop routes and zero recorded route errors.
Final standalone CubeChat/Earth previews also pass. Preserve the documented
whole-generated-diff guard failure and existing numerical/device limitations;
authored guard passes. Publish after final repository review, then verify public
workflow commit, exact assets, full routes and screenshots independently.


November12 release complete at3abaf23b on origin/main and the feature branch.
Public acceptance passes119HTTP/MIME/hash checks,23unique demo routes,
11authenticated SecretWorkshop routes and68reviewed screenshots. Actual peer
hello/dialogue, model-selected resident POV vision/reflection, automatic recovery
and retained-worker reload passed separately. Preserve explicit owner pauses and
unloads; legacy unclassified pauses may need one manual Resume. Existing MPM
numerical drift remains outside this resident slice. Full evidence and limitations
are recorded in log.md; the final documentation receipt stays local.


November12 resident knowledge acceptance: IndexedDB reopen/CAS/forget tombstones;
identity collisions; private/public recall and clone grants; incoming-position
anchoring while a speaker moves; stale/cancelled proposals; named-place grounding
and geometry revalidation; owner Mind correction/forget and desktop/mobile modal
lifecycle. Actual peer model must select remember and return without substituted
actions, and movement must finish with a motor receipt after reload. Existing
conversation/goal/OODA/profile suites remain regression gates. Internal previews
only; results will be appended after execution.


November12 grounded knowledge acceptance results:
- `npm run test:resident-knowledge`:54pass, including real browser IndexedDB
  reopen/cross-tab CAS and Mind UI.
- Decision suite38pass; finalhost52pass; context/goal/OODA67pass; earlier
  encrypted protocol/UI93pass, core/StateManager43pass, motor32pass. These
  scopes overlap and are not a combined test count.
- Native `live/acceptance-8/report.json`: exact original owner prompts, genuine
  peer Nano4B at2048context, unchanged recorded place after reload, neural
  category/task/plan/action decisions and real learned-WebGPU return receipt.
  89.54unit starting separation, arrival7.9966 within radius8,93return-only motor
  samples, dispatches218→402. Eight real peer calls; largest input+output budget
  1937/2048.168asset hashes match, no recorded browser/network/HF errors.
- Native Mind correction/forget plus reload separately pass234asset checks and
  preserve conversation history, with zero inference. Final5176/5187 internal
  previews pass82/46loaded JS/CSS hashes and authenticatedSecretWorkshop.
- Keep earlier failed trials and exact prompt contrasts. Qwen0.8 is not
  qualified for reliable action choice. Nano speech may still quote wrong
  coordinates or copy schema explanation placeholders; physical receipts, not
  prose, establish completion. Earth-specific navigation is not newly qualified.
Evidence root: ~/.cache/peercompute-world-knowledge-20261112/.

Self-directed follow-up validation covers persisted/default movement preferences,
new guide/clone defaults, native roster creation/editing, no scripted motion
without an intention, cancellation on switching profiles, and preservation of
model-issued intentions across status/body refreshes. Existing explicit modes,
owner pauses and missing-motor errors remain covered without scripted fallback.

Self-directed results: 110 combined host/UI/guide/contract tests, final46 native
UI cases, and45 adapter/motion cases passed (overlapping scopes). Initial bounded
floor omission in the new move-to fixture is retained with its failed result.
Serial final8 CubeChat/Earth builds passed. Adapter tests use controlled motor
output and do not add another real-model qualification beyond acceptance8.

Final8 internal preview verification passed exact HTTPS assets (82 CubeChat,
46 Earth), native desktop/mobile Self directed controls, new guide default and
authenticated SecretWorkshop connectivity, with no page/console/cleanup errors.
No GitHub Pages files were rebuilt or published for this slice.

Resident inspector acceptance: owner/peer projection privacy, caller revision
checks, inspection during inference, draft/caret preservation during refresh,
close/switch/authority-loss cancellation, mobile modal and chat entry; separate
bounded diagnostics survive reload without consuming agent history. Trace
world-chat receive/queue/inference/publication/recovery and reproduce original
error visibility races. Use real peer evidence for execution claims and preserve
model/context failures without fake replies or uncertain-operation replay.
<!-- November 12 resident inspector/continuity acceptance -->
`npm run test:resident-inspector` checks private diagnostic retention/lifecycle,
owner/peer inspector boundaries, stale-edit protection, current model/route/error
projection, native desktop/mobile controls and separate Room errors. Extend held
generation cases through close and conversation switches; assert one original
request/result, no cancellation, no delivery to another conversation. Model
quality is a separate real-peer gate: same CID/provider/persona/prompt/512-token
allowance, new agent/request IDs, with and without attributed public speech.

Grounded placement gates: model-selected observed/remembered destination IDs;
unknown/stale/spoofed refs and raw coordinates rejected; current participant
identity after long generation; boundary/surface/object-footprint/obstruction
checks before work and before commit; cancellation/ownership revision loss;
actual retained placement and peer display. Future manipulation additionally
requires acquisition reservation, real approach/carry/release receipts and
interruption without duplicate movement or stealing another host's object.

`npm run test:resident-placement` covers shared navigation/object references,
geometry and retained lifecycle. Native host tests additionally run the real
ArtifactStore with clearly simulated inference, checking remembered destinations
and cross-tab forgetting during generation. Final3 inspector suite353/353 and
placement suite105/105passed. Stage-specific specialist context then passed46
focused cases and a real-Qwen tokenizer18-case matrix (maximum1976/2048tokens,
including512replyreserve); this is budget evidence, not live inference proof.

Budget limitation: stress cases with ~500-word completed replies, or24participants
plus~250words, still exceed2048 and must fail normal preflight. Current Cube
sensors cap participants at16; the passing18-case matrix is not a guarantee for
arbitrary input length. Full stress evidence is preserved externally.

Final5 owner-tool tests: npm run test:resident-inspector passes364/364 and
npm run test:resident-placement passes118/118 (overlapping scopes). Native host
fixtures verify object planning/execution precedes narration; successful commit
survives narration failure/cancellation and display failure; known failed actions
survive narration cancellation without a false commit claim; cross-tab forgetting
revokes placement before mesh dispatch. Fixture model output is simulated, while
ArtifactStore retention and manifests are real. The six actual-tokenizer object-
only contexts fit within2048 tokens, max1544 including512 reply reserve. This is
not proof of a model choosing the correct spatial reference. Live acceptance
keeps distant-placement (>64 units) separate from pipeline/CID/reload acceptance.

Availability attribution adds routed full-queue → absent → ready task tests,
unknown/committed error propagation, bounded Unicode trace storage and no wait
step/failure charge.76 focused cases pass. Authenticated speaker checks cover
unseen owner, nearby named residents, same-host resident speakers and unchanged
private visitor channels.46 unit/contract cases plus the native host owner/visitor
case pass. Seven real Qwen category requests qualify only object admission, not
argument selection or image/mesh execution. Preserve failed final5 acceptance.

Final6 results:367/367 inspector and170/170 placement/task tests pass (overlapping
scopes). Desktop/mobile exact-preview assets and SecretWorkshop Noise checks pass
with no console/page errors. One real Qwen2B/DreamShaper/SF3D owner request passes
planning, image/mesh execution, grounded placement, complete+pinned CID and
identical native reload. Overall semantic acceptance FAIL remains: selected32
rather than96-unit ground, failing the unchanged >64criterion; subsequent model
speech contradicted the true placed receipt. No context truncation, request retry
or local GPU model was involved. Retain that failure as the next spatial/speech
quality regression, not as a waived or passing gate.

November12 Pages release validation: use the canonical build:all pipeline and
its current-plus-previous asset retention. Verify all23 routes at desktop/mobile,
native Cube/Earth Resident modal access, isolation/runtime WASM and authenticated
SecretWorkshop connections using owned headless contexts. Keep guides paused
and local-only; do not download/load inference models. Separate actual physics
compute checks from reduced software-rendered presentation checks. Require
public exact-byte checks and successful Pages workflow at the pushed commit.

Release results:70unique helper/navigation/static checks pass; all15demo builds
pass. Owned staged browser matrix passes19general+4native physics routes,
with4separate reduced physics presentation runs. Cube/Earth inspector and model
dialogs fit desktop/mobile;11network routes establish authenticated relay
connections. Initial Earth Overview captured a transient fail-closed ownership
read; a separate bounded run loaded real metadata after4.591s and captured the
settled view. Preserve the initial screenshot. No page/console/network-request
errors or unexpected model transfers; all owned resources close. Baseline MPM
drift, optional backend/hardware features and model quality are not qualified by
these release smoke tests. Evidence: external peercompute-pages-resident-release-
20261112 reports; public checks are recorded after deployment.

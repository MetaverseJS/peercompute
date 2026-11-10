Instructions: This file contains the goals, architecture, implementation order,
and acceptance gates for IPFS large files and model inference. Keep the generic
artifact layer reusable, distinguish proposed work from executed evidence, and
record implementation decisions and results in ../log.md and ../tests.md.

# IPFS large files and WebGPU model inference

Updated: 2026-11-03 AKST. Status: **implementation in progress** on
`feature/ipfs-artifacts-webgpu`; acceptance gates remain open.
Roadmap TODO: **IPFS-01**. Parent: [overall plan](../plan.md) and
[distributed compute](distributed-compute.md).

## Implementation checkpoint — November 3, 2026

- Implemented StateManager-owned ArtifactStore with canonical manifests,
  incremental file hashing, verified UnixFS blocks, persistent IndexedDB or
  exclusive Node filesystem backends, explicit pins, quotas, reader-safe GC and
  missing-block resume. Binary content and model conversations stay outside Yjs.
- Implemented optional NetworkManager IPFS transport using Helia/libp2p/Bitswap
  and connected-peer discovery. Both application and artifact identities sign
  bounded scope/recipient/root/nonce/expiry records. Only explicitly approved
  complete roots are served; approval and identity survive browser reload.
  A lifetime ownership lock prevents two tabs sharing a persistent store from
  starting competing artifact nodes with that saved identity. Failed shutdown
  retains ownership for retry; storage and local inference remain independent.
- The 128 MiB three-context browser reseeding gate passes after the original
  host exits and the surviving host reloads, with no public HTTP fallback.
- ComputeManager now supports protocol-v2 worker progress, cooperative abort,
  targeted forced termination, protected resident affinity and model-service
  ownership. One shared broker accounts for resident CPU/GPU envelopes; expiry
  or revocation does not free allocations until disposal/termination acknowledgment.
  Initial residents are non-preemptable: rendering-driven eviction is still open.
- Added a pinned model catalog, external-cache CLI importer, and vision+text
  adapters for SmolVLM 256M/500M alongside Qwen3-0.6B. SmolVLM256M imports as
  `bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou`.
  All three initial models now pass actual managed-worker generation, warm reuse,
  cooperative cancellation, unload and source-off restart on Chrome155/NVIDIA
  RTX5060Ti. Both vision models distinguish red and blue images. The complete
  SmolVLM256M package also passes independent-browser IPFS reseeding.
- Qwen q4 is the hardware trial variant because the tested Chrome/NVIDIA worker
  adapter does not expose shader-f16. q4f16 remains conditional. The original
  source-seam findings below describe the pre-implementation survey.
- Found exporter16's asynchronous content queue could run ahead of a stalled
  reader. Replaced content iteration with bounded pull-driven DAG traversal;
  kept the exporter for root metadata. CLI uses native HTTPS stream backpressure.
- Dependencies are pinned for this slice; the resolved libp2p3.5.1 set required
  @libp2p/utils7.4.5 rather than the old global7.0.9 override. Existing network
  regressions and actual browser WebRTC/Bitswap checks passed with this set.
- Remaining parent scope includes operator seed lifecycle, two-host/>2GiB
  acceptance, physical-host remote inference, rendering contention/preemption,
  NetViz model telemetry and final release verification. Do not close IPFS-01
  merely because storage or mocked inference checks pass.

### Less-restrictive options and image generation — November3,19:18:10 AKST

- User requests smaller refusal-free chat choices, Stable Diffusion, and a
  less-restrictive image generation option. Add revision-pinned abliterated
  Qwen GGUF choices; describe the publisher's intended behavior without
  guaranteeing every response. Preserve model cards, licenses and file hashes.
- Add a fixed trusted `onnx-diffusion` runtime in ComputeManager-owned workers.
  Transformers.js4.3.2 does not provide this pipeline; use an isolated
  `peercompute-diffusion-ort` alias pinned to ONNX Runtime Web1.31.1. Never load
  executable runtime code from a model manifest or another peer. Start with
  SD-Turbo one-step512×512 and DreamShaper8LCM four-step512×512 exports, subject
  to actual GPU execution checks. Model files stay in StateManager/IPFS.
- Keep the unified Import Model and inference-target selectors. Image models
  consume one current text prompt and display the generated image in the chat.
  They do not accept attachments unless a future runtime explicitly supports
  image input. Generated images are local previews, not automatically pinned
  or shared. Revoke preview URLs on transcript eviction and disposal.
- Private inference protocol2 distinguishes input modalities, task and output
  modalities. Bound generated RGBA to1024²/4MiB, stream in64KiB frames with one
  outstanding credit, verify SHA-256 and keep cancellation active during
  transfer. Do not replay a committed generation on another peer. Hosts on
  protocol1 need a page refresh; silently stripping image capabilities is invalid.
- Validate fixed-seed prompt-dependent outputs, warm reuse, cancellation,
  acknowledged unload, source-off loading from retained IPFS files, and a real
  independent requester receiving generated pixels over encrypted WebRTC.
  Record transport/unit, browser UI and actual GPU evidence separately. New
  model execution does not close parent physical-host or large-file gates.

- November3 hardware checkpoint: both diffusion pipelines pass on Chrome157 /
  NVIDIA RTX5060Ti with the explicit test-only Vulkan shader-f16 override.
  DreamShaper imports1,037,003,247bytes, loads in12.432s and generates its first
  image in7.015s; SD-Turbo imports2,516,150,032bytes, loads in31.935s and generates
  its first image in4.252s. Actual native WebRTC requests take1.676s/2.075s,
  respectively, with matching host/requester pixel digests and no requester
  weights, WASM, worker or artifact database. These are local-machine observations.
  Both retain fixed-seed output through a source-blocked full browser restart;
  cooperative local cancellation, warm reuse and zero-lease unload pass.
- The protocol's4MiB result limit and bridge's4MiB staging cap do not describe
  total model memory. ORT materializes individual ONNX buffers (up to1.733GB)
  and creates session/WASM/GPU allocations.8GiB CPU/GPU envelopes are configured
  admission, not measured hardware minima. Tokenization, shape operations and
  scheduler math run on CPU; every neural stage proves actual GPU dispatch.
- Production console startup exposed a pre-existing top-level-await/shared-chunk
  cycle; async entry startup fixes it and a built-browser test now proves actual
  runtime initialization. Keep preview on an immutable validated snapshot while
  editing. UI tests and managed-service GPU/peer tests remain separate evidence.

### Additional requested models — November3,12:43:31 AKST

- Add a four-bit multimodal Qwen of approximately2B parameters for the same
  worker and demo-agent flow. Candidate: official
  `onnx-community/Qwen3.5-2B-ONNX-OPT`, revision
  `ed446636739bf426e73c5a00714fd8e010d36c21`;14 files /1,771,280,684 bytes, including
  three q4 graphs and their three external-data files. Pin every digest, validate
  the qwen3_5 architecture and module closure, bound preprocessing/context, and
  measure actual image-dependent execution before claiming support.
  This gate now passes for the fully-q4 variant on the tested Chrome/NVIDIA
  configuration. Restoring Qwen's missing normalization default corrected the
  observed color errors; no higher-precision vision variant is required.
- Include the exact requested
  `Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`, revision
  `5ce3fd841676adf2c1a10d7193637d46007e88f7`. Its
  `Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf` is14,199,740,480 bytes with
  SHA-256`afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d`.
  The sidecar identifies Qwen3.5 architecture and multiple quantization types,
  including IQ3_S; its upstream runtime qualification is explicitly untested.
- Implement its format-independent import, verified pinning and hosting catalog
  separately from the ONNX execution allowlist. Do not rewrite or convert these
  exact requested weights silently. Current GGUF browser WebGPU implementations
  need a pinned compatibility spike for all tensor types, architecture, file-size
  limits and ComputeManager ownership. Enable execution only after that proof.
  A future native selected-peer executor is a separate execution placement path.
- November3 FP16 diagnosis correction: the exact Chrome155.0.8059.84 Dawn revision
  `42d0e90fe3552a2a8e95ca8e506bc19bbda12729` gates NVIDIA Vulkan shader-f16 because
  of conformance failures (Chromium42251215). NVIDIA595.91.07 reports native
  shaderFloat16 and16-bit storage support. Adding only
  `--enable-dawn-features=vulkan_enable_f16_on_nvidia` to the existing Vulkan
  validation launch exposes shader-f16 and passes an actual16x16 FP16 matrix
  multiply in a worker with zero error. This removes the inference that the GPU
  lacks FP16; it does not qualify the full model or authorize default driver
  workaround overrides. Missing managed GGUF integration remains the primary gap.
- Large-model validation must account for cached source plus UnixFS blocks and
  preserve free disk space. Browser storage quotas and GPU memory envelopes are
  explicit budgets, not hardware-capacity claims. Keep all downloaded artifacts
  outside Git and avoid making a14.2GB browser duplicate just to render a catalog.

### Managed GGUF implementation authorization — November3,13:58:59 AKST

- User asked how to support GGUF, confirmed WebGPU support, then authorized
  implementation with “alright go for it”. Continue this feature branch and
  retain the live preview and no-merge constraint.
- Add a trusted runtime definition beside Transformers.js, reusing the host
  service's affinity, admission, cancellation and cleanup. Use fixed task module
  peercompute:gguf-inference; model manifests remain data only.
- Pin published @wllama/wllama3.8.1 (repository master has newer unpublished
  source). Generate a reproducible same-worker adapter from its shipped engine
  and glue into ignored dependency files; keep generator/source hashes in Git.
  Avoid the public wrapper's unmanaged worker creation. Disable pthread spawn,
  require the build's shared-memory/JSPI/memory64 capabilities and actual WebGPU.
- Reuse StateManager's verified range reads through a bounded MessagePort client.
  Keep the artifact bridge alive for the entire GGUF residency, independent of
  the load operation's abort signal. No whole14.2GB Blob/ArrayBuffer materialization.
- Native wllama exit does not prove context disposal in this build; acknowledge
  termination of the actual owned worker before releasing admission/affinity.
  Preserve failed-stop handles and resource reservations for cleanup retry.
- Validate a pinned Qwen3.5-0.8B Q4_K_M GGUF before the exact27B mixed GGUF.
  Browser test flags may explicitly enable the diagnosed NVIDIA f16 override;
  never infer full model correctness from the small FP16 probe. Prove actual GPU
  work, warm reuse, cancellation, unload and origin-blocked CID reads.
- Measure CPU and GPU placement: published WASM maximum heap4GiB and available
  VRAM constrain partial offload. Use explicit layer/context/batch settings and
  report actual offloaded layers. A model must not silently run entirely on CPU.
- Implemented checkpoint: the pinned engine runs directly in the managed
  worker, with no nested worker or whole-file allocation. Small Qwen passes
  real GPU generation, exact arithmetic, warm reuse, cancellation, unload and
  source-blocked browser restart. Native failure cleanup and bounded range
  reads pass32 focused tests. Exact27B now passes real text generation,
  arithmetic and warm reuse on RTX5060Ti16GB at56/66 GPU layers,512 context and
  64 batch. Its143.3s load used bounded verified Node-store ranges. Cancellation
  terminates the worker and releases admission; it does not retain this large
  model warm. Full14GB browser transfer/persistence remain separate gates.
- Historical controls (superseded by the18:11 console revision below):
  clarify the CID actions as **Download from peers**, **Share with peers** and
  **Stop sharing**. A CID identifies content; download requires an online
  provider and saves verified local content. Publication and GPU load are
  separate explicit actions. An unserved server filesystem cache is not a seed.

### Laptop review handoff — November3,12:51:32 AKST

- Make Local Model Console the second overview card, then expose the overview
  and demo on trusted HTTPS bound to0.0.0.0 and reachable over Tailscale.
- Standalone demo connects to the existing secretworkshop.net backend using its
  production relay configuration. Keep local model use available on network
  failure. The18:11 revision below enables sharing/hosting by default with
  independent checkboxes.
- Verify the exact handoff URLs, secure-context WebGPU availability, panel startup
  and actual backend connection. Leave only the requested preview servers running.
- Keep feature/ipfs-artifacts-webgpu separate from ulg until user review and an
  explicit merge instruction. No push, public deployment or merge is implied.

### Console implementation evidence — November3,18:33 AKST

- Unified Import Model fetches/verifies/pins and automatically loads HF or peer
  sources. Manifest CIDs remain internal. Removed Close, sample graphic and
  scene-image checkbox; default-on sharing/hosting, Config, image picker,
  Enter-to-send and auto-scrolling chat are implemented in the shared panel.
- NetworkManager owns the private inference protocol; the facade composes retained
  StateManager packages and the existing ComputeManager model service. Shared
  managers can reconnect without reloading the resident model. Host disable
  cancels inbound requests while preserving local chat and file sharing.
- Five-second discovery groups exact immutable model CIDs; longest-idle ready
  hosts precede deterministic busy fallback. Bounded frames, upload credits,
  queues, token output, deadlines and a start acknowledgment prevent unbounded
  buffering or retrying committed generation on a second host.
- Actual independent Chrome157 browsers pass Smol256 text/red/blue requests,
  streamed output, cancellation/reuse, disable/disconnect and encrypted WebRTC
  transport. A third empty browser receives all15 files/1,052 blocks/268,819,304
  DAG bytes through IPFS with HTTP weights denied. The requester stores0bytes
  and creates no compute worker. All owned test processes closed; user previews
  remain running. Evidence: /tmp/peercompute-peer-inference-hardware-20261103-direct.json.
- This proves the implementation portion of IPFS-01.5; two physical hosts,
  durable operator seeds, renderer contention, full27B browser transfer and
  NetViz/chaos remain open parent gates. Keep the feature branch unmerged.

### Viewport follow-up — November3,18:36:53 AKST

- User screenshot requests filling the available window and removing the old
  square/circle sample. Latest served HTML already omits the old heading/sample;
  remove standalone900px width/980px height caps and outer padding. Preserve
  embedded panel sizing. Verify the exact `?dev=1` URL in fresh desktop/mobile
  browser contexts and provide a fresh navigation link for existing tabs.
  Verified exact viewport bounds at1440x1000,1920x1080,1280x1600 and390x844;
  UI10/10PASS with no oldshell/graphic or pageoverflow.

### Modal library and storage revision — November3,18:49:08 AKST

- Replace inline Config with a native modal and move both default-on sharing/
  hosting checkboxes inside. Add a separate Stored Models window with names,
  sizes, loaded/shared status and explicit per-model deletion.
- Remove selectable console storage budgets and hard rejection based on browser
  estimates. Use actual browser storage enforcement; handle genuine write failures
  without silently deleting other packages. General library callers may still
  choose explicit quotas; per-DAG/frame/admission bounds remain distinct.
- Stop serving/hosting a deleting package, unload it if resident, preserve shared
  blocks and independent file pins, and coordinate deletion with imports/readers
  across contexts. No deletion of real user caches during tests.
- Implementation verified: Config/StoredModels native dialogs, browser-limited
  console capacity, actual-write error handling, scoped imports, per-model use
  leases and durable deletion retry. Artifact41/41, combined63/63, UI16/16;
  false-estimate27B first-fetch and tiny real IndexedDB lifecycle pass without
  model download. Core384/385 preserves baseline ULG failure;128MiB WebRTC
  reseeding and affected builds pass. Parent IPFS-01 remains open.

## Requested outcome and roadmap position

Add IPFS support for large files generally, including small Hugging Face Qwen
models. PeerCompute participants should acquire, verify, retain, and serve these
files to other participants, and capable peers should run approved models through
the existing WebGPU compute structure.

This supplies the missing artifact distribution layer beneath distributed
compute. The current networking, worker, service, and GPU primitives are useful
foundations; they do not yet provide IPFS storage or an LLM inference runtime.
It is a concrete workload for the unfinished placement/resource-management work,
not completion of automatic network organization or scientific calibration.

- [ ] **IPFS-01:** Deliver a generic, bounded, persistent IPFS artifact service,
  prove peer-to-peer reseeding, import a revision-pinned Qwen model package, and
  run it in a resident ComputeManager worker with explicit WebGPU admission,
  streamed output, cancellation, and cleanup. Then support whole inference
  requests on an explicitly selected capable peer.

The first inference milestone runs the entire model on one capable peer. Model
files can come from several providers; that does not split the forward pass
across GPUs. Tensor/pipeline parallel inference, training, arbitrary remote code,
and an inference marketplace are separate future proposals. Storage and local
inference do not depend on the unimplemented Deno root service.

## Repository evidence and review scope

The review inventoried all **4,373 tracked files (173,214,385 bytes)**, scanned
authored source/documentation across the core, all 14 demos, shared packages,
services, scripts, lab, and plans, and deeply inspected the relevant execution,
storage, network, build, and test paths. Generated `docs/` bundles, copied vendor
assets, binary models/images/PDFs, lockfile bodies, credentials, and runtime dumps
were not treated as authored source or read line by line. This is a repository
survey with focused source review, not a claim that every binary was interpreted.

| Existing seam | Finding and consequence |
| --- | --- |
| `stateManager/LocalArtifactCache.js`, `StateManager.createLocalArtifactCache()` | Local-only small-file tier; defaults are 8 MiB/item and 32 MiB total. Whole-buffer copying/hashing and IndexedDB `getAll()` make raising the caps insufficient for models. Keep existing Earth/RoadVector behavior and add a block-oriented store. |
| `stateManager/DataState.js`, Yjs/PeerComputeProvider | Shared commit path replicates state. Store only approved compact artifact descriptors and availability here; keep blocks, model weights, prompts, and token history outside it. |
| `networkManager/NetworkManager.js` | Existing libp2p v3 transports and discovery, but no IPFS Bitswap/DHT service. `sendToPeer()` uses targeted pubsub; it is not a private byte stream. |
| `computeManager/ComputeManager.js`, `taskRuntime.js`, `computeWorker.js` | Module tasks, worker affinity, and required-worker readiness exist. Handler invocation is currently one-shot; resident model sessions, progress streams, abort propagation, and protection against worker resizing need explicit support. `cancelTask()` remains a TODO. |
| `serviceOrchestration/{WorkerSupervisor,ResourceLeaseBroker,ComputeManagerServiceAdapter}.js` | Reusable registry, service, and lease abstractions exist. Adapter cancellation currently discards bookkeeping/results; broker preemption does not stop GPU work. NodeKernel does not automatically construct these services. |
| `gpu/GPUHubManager.js` | GPU ownership policy exists. A third-party inference runtime does not automatically share its device or buffers with Three.js/the hub. |
| `nodeKernel/NodeKernel.js` | Owns manager startup/shutdown and remote execution admission. Add opt-in artifact and model-service lifecycle here; accept registered runtime/model IDs, not model-provided executable URLs. |
| `demos/motorcycle/src/render/motorcycleModel.js` | Bounded fetch plus manifest/hash/license checks provide a useful non-LLM consumer pattern. Its whole-file buffer is appropriate for that small asset, not generic large-file ingestion. |
| Multiscale worker builds, `demos/webgpuphys/demos/shared/mpmComputeTasks.js`, `scripts/sync-federal-highways.mjs` | Reuse production worker import-closure testing, persistent GPU task patterns, and streamed source/provenance practices. |
| `peercompute/src/relay-go`, `services/geodata` | Relay connectivity and fixed-source geodata service are not IPFS storage hosts. Keep those responsibilities separate. |

Paths in the first seven rows are relative to `peercompute/src/peercompute/`.
Current project state remains described by the
[September survey](../reports/2026-09-14-project-state-survey.md). Its 873/874
passing-test result is historical; no application suite was rerun for this plan.

## Architecture and ownership

User ownership clarification on 2026-11-03: **StateManager owns the artifact
service and persistent data**. Implement it as a composable subsystem of the
existing manager, rather than another independently owned top-level manager.

| Owner | Responsibility |
| --- | --- |
| StateManager | ArtifactService/ArtifactStore lifecycle; verified blocks; manifests/CIDs; local completeness; pins, quota, eviction/GC; read leases; restart recovery; policy-approved availability descriptors. |
| NetworkManager | IPFS node/transport lifecycle, provider discovery, authenticated identity binding, advertisements, block requests/responses, connection/upload budgets. Reads/writes use the StateManager-owned store contract. |
| ComputeManager | Required WebGPU workers, inference module/session residency, execution admission, scheduling, output, GPU/CPU reservations, cancellation and disposal. It consumes artifact read handles supplied by StateManager. |
| NodeKernel | Wires the existing managers and controls their startup/shutdown order. It does not independently own the artifact store. |

```text
File / revision-pinned Hugging Face import
                  |
     immutable manifest + UnixFS directory/file CIDs
                  |
     StateManager.ArtifactService: pins, verified reads
          |                         |
  local block store          IPFS block exchange
  IndexedDB + journal        browser peers / durable seeds
          |
  bounded stream bridge to resident ComputeManager worker
          |
  registered inference adapter -> runtime-owned WebGPU device
          |
  streamed text to requester; compact lifecycle metrics to NetViz
```

### 1. Generic artifacts before model-specific behavior

Proposed modules belong under `peercompute/src/peercompute/artifacts/`:
`ArtifactService`, a manifest validator, `ArtifactStore`, and an IPFS transport
adapter. StateManager constructs/owns the service and exposes its API; implementation
modules can stay separate files. Names are proposed targets, not current exports.

- Provide `importStream`, `resolveManifest`, `stat`, `openRead`, `ensureLocal`,
  `pin`, `unpin`, `remove`, `list`, and `getAvailability` operations. Reads accept
  byte ranges and AbortSignals. Import returns a CID only after verification and
  commit. File storage works without any model runtime installed or GPU present.
- Start with persistent IndexedDB block/metadata adapters (`blockstore-idb`,
  `datastore-idb`) behind an interface. Use bounded cursor batches and incremental
  reachability/GC, never load the entire block database into memory. Evaluate
  OPFS only if measured browser storage throughput warrants a second adapter.
- Separate incomplete imports, verified blocks, complete file/directory records,
  pin intent, and active reader leases. Journal crash recovery and resume missing
  blocks. A pin becomes complete only when its whole reachable DAG is available.
  Deduplicate blocks; unpinning one artifact must not delete another artifact's
  shared blocks. Readers/importers/pins protect data from concurrent GC.
- Coordinate multiple tabs/workers using a single store owner or explicit writer
  locking. Test interrupted transactions and cross-tab races; a JS in-memory
  mutex alone does not protect independent browser contexts.
- Track storage quota, request persistent storage when available, and handle
  denied persistence and `QuotaExceededError`. A browser pin protects against
  application GC, not browser eviction, user deletion, suspension, or shutdown.
- StateManager owns optional service startup/shutdown and exposes artifact handles
  and compact descriptor registration. NodeKernel injects the NetworkManager
  transport and coordinates startup/rollback: restore/reconcile the local store
  before advertising, stop advertisements/drain transfers before closing it.
  Local storage/read operations remain usable without an active network or Yjs
  provider. Existing LocalArtifactCache consumers retain their small local
  caches. No file bytes go through Yjs or pubsub.

Define versioned, data-only `peercompute.artifact.manifest.v1` and a model
extension `peercompute.model.manifest.v1`. A generic manifest records a directory
or file root CID, normalized paths, sizes, media types, per-file CIDs and SHA-256
digests, import profile, provenance, and licensing. A model extension adds exact
upstream repository/revision, runtime ID/version compatibility, architecture,
quantization, tokenizer/configuration files, external weight shards, and required
GPU features. Runtime code is an application dependency, never a model file.

The manifest's CID is computed over the finished manifest; do not put that CID
inside its own hashed body. A separately published descriptor names the manifest
CID and optional publisher signature. CID integrity does not establish publisher
trust or model suitability. Validate provenance against local import/admission
policy. Existing task/cache hashes are not interchangeable with IPFS CIDs.

Use deterministic UnixFS imports: CIDv1, SHA-256 multihash, raw leaves, fixed
256 KiB chunks, balanced file layout, stable sorted paths, and explicitly fixed
directory/sharding options. Record the complete importer profile and golden
fixtures so equivalent imports agree across Node/browser implementations. A
UnixFS DAG root is not the SHA-256 digest of the concatenated file bytes; verify
both where the upstream provides a whole-file digest. CAR is an optional exchange
format for the same verified blocks, not a second identity scheme.

Reject path traversal, duplicate/ambiguous paths, unsupported symlinks/codecs,
over-limit manifests/DAGs, inconsistent sizes, unexpected external weight URLs,
and corrupt blocks before publishing completion. Verify each block against its
CID before persistence/use. Whole-file hash validation must be incremental;
WebCrypto's whole-buffer digest alone is insufficient for generic large files.
Authentication tokens for private imports stay local and never enter manifests,
telemetry, Git, or IPFS. Publishing/pinning for other peers is explicit user policy.
The first hosting milestone distributes explicitly published public artifacts;
keeping HF credentials local does not make IPFS content private. Encrypted private
artifact distribution and key management require a separate design.

### 2. Actual IPFS hosting, discovery, and durable availability

User requirement clarified on 2026-11-03: model packages are content-addressable
IPFS artifacts, and a successful local download must be reusable as a provider's
copy. In a hosting-enabled session the lifecycle is **request manifest CID →
retrieve/verify its file DAGs → persist blocks in IndexedDB → announce complete
availability → serve those same blocks to requesting peers**. Another peer names
the CID, discovers a reachable provider, fetches and verifies the blocks, and can
then become a provider itself. The package covers tokenizer/configuration as
well as weights. A new package version has a new CID; human model names map to
approved CIDs through our catalog, not a global IPFS filename search.

Use IndexedDB for binary blocks; `localStorage` is synchronous string storage and
is unsuitable for model weights. Storing a Blob in an unrelated application or
Transformers cache does not register an IPFS provider. The active IPFS service
must use the persistent block store and actually expose block exchange. On
restart reconcile pins/completeness and refresh availability, allowing a fresh
peer to retrieve retained data without HF access or loading the model for compute.
Public-IPFS reachability additionally depends on compatible transports and
configured provider routing; a CID alone does not make every browser globally
discoverable. The same CID remains usable within our connected peer network.

Use standard Bitswap/UnixFS so files interoperate with external IPFS hosts.
Availability advertisements carry only bounded descriptors, provider identity,
expiry, and coarse capacity; verify reachability and blocks when selecting a
provider. A stale advertisement is not proof that a file can still be served.

**Dependency compatibility is the first spike.** On November 3 the registry
reported Helia 7.1.16, `@helia/libp2p` 2.1.5, `@helia/unixfs` 8.0.9,
`@helia/verified-fetch` 8.1.2, `blockstore-idb` 4.0.1, and `datastore-idb` 5.0.1.
The repository declares libp2p `^3.1.2`; compatibility includes transport and
interface versions, not just the major number. Pin the tested dependency set in
the lockfile during implementation rather than updating every networking package.

Helia 7's `libp2p` initialization option is **creation options**, not a supported
way to borrow the existing running NetworkManager node: its wrapper creates and
stops a node itself. The supported starting design is a separately owned artifact
libp2p node coordinated by NetworkManager, with explicit connection/relay budgets,
startup rollback, shutdown, and validated binding between its peer identity and
the application peer identity. Bind both identities with a domain-separated signed
record containing session/scope/expiry and proof of artifact-key possession;
reject forged, replayed, expired, and incorrectly rebound records. Do not reuse
one private identity across two live
nodes or let Helia shutdown stop the application network. A shared-node/custom
block-broker integration is an optional P0 optimization only if documented APIs
and lifecycle tests prove it. Browser transport support determines execution
context; do not assume WebRTC can be moved into a dedicated worker.

Configure bootstrap, discovery, routers, relay use, and gateway fallback
explicitly. Default to approved PeerCompute providers; no hidden public gateway
or provider lookup should turn a supposed P2P/offline test into an HTTP download.
Use verified CAR/raw block retrieval for an optional operator-configured HTTP
fallback. Unverified gateway response bytes must never be accepted as proof of a
CID. Expose transport/source bytes and failures separately in telemetry.

Browser participants are opportunistic hosts while active. For durable hosting,
provide an operator-run IPFS seed recipe (initially a standard Kubo node and Node
24 importer), persistent volumes, recursive pins, health checks, and explicit
retention policy. Prove at least two independent durable providers can retain the
model package and survive one provider's loss. A browser-reachable seed needs
tested compatible transports/relay configuration; an HTTP gateway alone does
not prove browser Bitswap hosting. The existing Go relay does not pin files.
Expose Kubo administrative RPC only to the importer/operator, not to browsers.

### 3. A reproducible first model package

Start with **`onnx-community/Qwen3-0.6B-ONNX`**, revision
`58ca03a5e7b354b480b1a82b34bde8dc7b854cc0`, using the model card's `q4f16`
WebGPU variant. Its `onnx/model_q4f16.onnx` is **569,789,750 bytes (543.4 MiB)**,
with upstream LFS SHA-256
`9e33a5911974174761d0dfdcc0bec975d9c45af0eae5e9eb647b8ba9442a8f91`.
These identify the inspected upstream file, not an already imported IPFS CID.

Build a Node 24 CLI importer that resolves an immutable HF revision, selects one
runtime/quantization variant, downloads with streaming bounds and digest checks,
includes its complete tokenizer/config/generation/chat-template/external-data
closure, and emits a manifest plus UnixFS directory (optionally CAR). Do not
download every weight variant in the repository. Preserve upstream Qwen's Apache
2.0 license, conversion provenance, notices, and file digests; verify the converted
package's redistribution metadata explicitly because its inspected card does not
provide a complete license declaration. Support local-file/directory import for
non-HF assets using the same manifest and storage contracts.

Use **Transformers.js 4.3.2** as the initial inference adapter candidate. Its
versioned source exposes `env.fetch`, making an IPFS-backed verified stream bridge
possible without a mandatory service worker. Set a manifest-scoped virtual local
model path, `allowLocalModels=true`, `allowRemoteModels=false`, and route allowed
paths through StateManager's ArtifactService. Reject unlisted paths; disable redundant
browser/filesystem runtime caches. Transfer bounded chunks over MessagePorts
where the store and inference worker differ, with credits and abort propagation.
The current loader calls `env.fetch` without forwarding an AbortSignal: the
adapter must capture a per-load abort controller, cancel outstanding reads, and
reject/dispose a session that finishes loading after cancellation. Test that race.

Bundle trusted runtime `.mjs`/WASM assets locally with explicit Vite-relative paths.
Transformers.js 4.3.2 declares ONNX Runtime Web
`1.31.0-dev.20260914-8d85527a0`; test that declared dependency set. Do not override it
with the independently newer ORT package without compatibility evidence. Ensure
the production build's fetch hook, worker imports, wasmPaths, CSP, and any required
cross-origin isolation actually work from a nested deployment path.
Set `wasmPaths` before the first load and initially disable `env.useWasmCache`
unless the spike proves its blob-import/CSP behavior is required and acceptable.
`allowRemoteModels=false` does not block runtime CDN downloads. Cold-worker and
reload gates must block both HF and public runtime CDNs and use bundled trusted
runtime assets plus approved artifact transport only.

Transport can be streamed, but the current model loader still materializes model
buffers and the runtime allocates CPU/GPU state. Do not claim constant-memory
inference, zero-copy GPU uploads, or a 543 MiB total runtime footprint. P0 measures
load-time CPU peak, GPU allocation behavior, context/KV-cache cost, and disposal
on actual supported hardware before setting admission limits.

WebLLM 0.2.87 is a fallback candidate, not a second initial implementation. The
Qwen3-0.6B q4f16 MLC variant has smaller inspected weight shards (~320 MiB), but
needs its matching compiled model WASM and a proven IPFS loading adapter or
verified same-origin route. Its documented URL/cache path is not evidence of an
equivalent `env.fetch` hook. Re-evaluate after the primary runtime spike if needed.

### 4. Resident inference through existing compute orchestration

User requirement clarified on 2026-11-03: **actual inference must execute in a
WebGPU-capable compute worker created and managed by ComputeManager**. The
execution chain is ComputeManager → managed module worker → registered inference
module → Transformers.js → ONNX Runtime WebGPU → GPU compute dispatches. Import
and initialize the inference runtime inside that worker. The UI submits commands
and consumes streamed results; an independent demo-created worker does not meet
this requirement.

A WebGPU compute worker is a Web Worker with WebGPU access, as described in
[the worker architecture](../arch/wgpuworker.md). In today's task runtime, the
appropriate entry point is a registered JS module task running in a required
worker, with an explicit WebGPU resource/backend requirement and worker affinity.
The `runtime: 'js'` tag describes its host module; it does not imply CPU-only
execution. The existing MPM task module uses this general pattern. Transformers
is not a drop-in module for the repository's custom `wasm-webgpu` host ABI merely
because ONNX Runtime also ships WASM. Report host runtime and actual execution
provider separately, and reject inline fallback for this service.

ComputeManager schedules model sessions and inference requests; ONNX Runtime
owns graph/operator execution, GPU allocations, and kernel dispatch inside the
worker. Transformers.js supplies model loading, tokenization, and generation.
This meets managed-worker inference; instruction/kernel-level preemption or
automatic sharing of the renderer's GPU buffers requires further runtime-specific
integration. Keep `env.backends.onnx.wasm.proxy=false`; ORT's proxy-worker mode
does not support its WebGPU execution provider. Initially set `numThreads=1` for
WASM support work to keep helper threads within the declared worker budget;
additional CPU threads require explicit accounting and compatibility tests.

The implemented entry point is `ComputeManager.createModelInferenceService()`;
NodeKernel can construct it using its existing managers. The generic registry
adapter currently describes one-shot work, so resident session ownership stays
with this manager factory rather than being forced through that adapter.
`loadModel`, `generate`, `cancel`, `unloadModel`, and status operate on the same
managed worker pool. Each loaded session keeps affinity until acknowledged
disposal. Registry exposure for remote services is later work.

- Extend task/worker messaging compatibly for progress, token chunks, AbortSignal
  propagation, request/session IDs, bounded queues, readiness, and terminal
  completion. Existing one-shot module handlers must continue to work. Supervisor
  startup must await readiness and reject pending work on worker failure/shutdown.
- The inference worker initially owns its runtime's GPUDevice. Reserve GPU/CPU
  capacity via ResourceLeaseBroker for **the entire model residency**. The initial
  implementation uses one conservative envelope covering load/KV/generation;
  separately measured sub-reservations remain future work. Weight memory does
  not become free after each reply. WebGPU does not expose reliable free VRAM;
  use conservative policy budgets and measured envelopes, not invented capacity.
- Add residency renewal and safe expiry: today's broker defaults to a 30-second
  lease and expiry removes accounting without stopping resident work. Keep expired
  residency counted/quarantined until disposal or worker termination is
  acknowledged. Test idle and generating sessions beyond TTL. Avoid charging two
  GPU execution units for residency plus generation on a one-unit pool: use one
  execution reservation with memory sub-reservations, or an equivalent explicitly
  tested accounting model; current `requestLease` enforces a minimum unit of one.
- Require actual WebGPU support and model-required features (including
  `shader-f16` for variants using half precision), fail admission if unsupported,
  and load the verified variant with `{ device: 'webgpu', dtype: 'q4' }`;
  callers cannot override the
  admitted provider. Verify actual GPU execution. CPU tokenization/helper operators are allowed;
  silent replacement of the inference backend with CPU is not a passing gate.
- Use the runtime's streamer and interruptible stopping criteria for bounded
  generation cancellation. Stop/dispose acknowledgment precedes lease release.
  If cooperative stop times out, terminate/recreate only the owned worker and
  invalidate its sessions. Broker preemption must invoke this path rather than
  merely deleting a lease. Test GPU device loss and pool resize while resident.
- TextStreamer callbacks are synchronous and do not await returned promises.
  Transport credits alone cannot pause decoding. Bound/coalesce output buffers
  and cancel on overflow or sustained slow consumption unless P0 proves a real
  decode-pause mechanism. Never let a slow requester accumulate unbounded tokens.
- Prioritize interactive rendering; initially allow one resident model and one
  active generation per admitted device. Queue/reject explicitly when physics or
  rendering already consumes the budget. Keep outputs CPU-friendly; future
  same-device tensor interop is a separate measured integration.

### 5. Remote requests after local execution is proven

Add an authenticated libp2p stream protocol for inference request/response/cancel.
Do not carry prompts or token streams over `sendToPeer()` pubsub or Yjs. The
selected peer can see the prompt; the UI must identify that peer before sending.
Publish no prompt/history/token content in public telemetry.

Requests name a locally allowlisted runtime and immutable model manifest CID,
bounded generation parameters, and request/session IDs. They cannot supply code
or arbitrary runtime URLs. Apply per-peer admission, queue limits, stream credits,
sequencing, deadlines, cancellation, and terminal-result acknowledgment. Handle
peer loss and duplicate requests explicitly; do not silently replay generation
after output has started. First placement is local or a user-selected peer with
verified capabilities/model readiness. Automated placement can later consider
model locality, cold-load cost, network speed, available budgets, and measured
token throughput through existing scheduler hooks.

Artifact integrity does not prove a remote peer computed honestly. Text generation
may be nondeterministic across runtimes/devices, so existing exact-hash result
quorums must not be advertised as general LLM correctness verification.

## Initial policy bounds to implement and measure

These are proposed defaults, not performance results. Keep them configurable and
reject over-budget work before allocation; P0 may tighten them with measurements.

| Area | Initial bound / behavior |
| --- | --- |
| Metadata | Manifest ≤256 KiB, ≤1,024 files, normalized path ≤512 bytes; separate bounded DAG depth/block count; reject overflow. |
| File transport | 256 KiB import chunks, ≤4 outstanding block requests per transfer, ≤32 MiB total transient transfer buffers per node including bridges/verification. Measure overhead separately. |
| Storage | 2 GiB application quota by default, constrained by available browser quota; configurable larger quota for generic multi-GiB files. File/import closure must fit admitted quota; no eviction of pins or active readers. |
| Model baseline | Admit only the selected complete variant; download bytes, materialized CPU bytes, GPU/KV estimates, and current resident allocations are separate budgets. No claim that storage quota establishes GPU capacity. |
| Generation | One resident model and active generation initially; queue ≤4; input + output ≤2,048 tokens, output ≤256; caller cancellation and explicit load/generation deadlines. Reject overlong prompts rather than silently truncating history. |
| Serving | Explicit hosting opt-in; configurable upload/connection ceilings; short-lived availability records and bounded retries. Public advertisements reveal only approved manifest IDs and coarse capacity. |

## Ordered implementation TODOs

### Console and peer inference revision — 2026-11-03 18:11:01 AKST

- Replace manual import/fetch/load/CID controls with a model/source selector and
  **Import Model**. List HF and discovered peer sources; verify retained content
  and load automatically after acquisition. Never download weights on page open.
- Default **Share with peers** and **Host inference** to checked. Sharing controls
  package publication; inference hosting advertises only an actually loaded model
  and dispatches remote work through its ComputeManager service. Disable hosting
  and disconnect must cancel remote work and release stream resources.
- Move storage quota and GGUF layer settings behind Config. Remove the sample
  square/circle scene, scene-image checkbox, internal Close button and manifest
  CID field. Keep programmatic disposal for embedded demos.
- Simplify chat: arbitrary questions, explicit image attachment through **+**
  beside Send, Enter submits (Shift+Enter adds a line), transcript auto-scrolls.
- Refresh the execution selector every five seconds: local model plus one entry
  per remotely hosted model identity, grouped by immutable manifest CID. Route
  to the longest-idle available host; if all hosts are busy, mark the model
  **(busy)** and submit to the first reachable host's bounded queue.
- Prompts, images and streamed replies use authenticated encrypted PeerCompute
  streams, with scope checks, bounded frames/queues, cancellation and deadlines.
  They do not enter pubsub/Yjs. Images are decoded/downsampled to bounded RGBA;
  text-only models reject image input. Preserve optional embedded scene text and
  explicitly applied demo action proposals.
- Acceptance: focused routing/stream/lifecycle tests; actual separate-browser
  GPU host and GPU-disabled requester exchange text/images; host toggle and
  disconnect cleanup; actual peer package discovery/download; headless desktop
  and mobile UI checks; existing ONNX/GGUF/build regressions; verified Tailnet URL.

The current implementation has passed the local/browser slices below. Parent
phases with remaining exit criteria stay open. Each slice updates this file, `plan/log.md`, and
`plan/tests.md`, runs its relevant gates, and reaches a local validated commit.

| Phase | Verified checkpoint | Remaining broader gate |
| --- | --- | --- |
| .0–.2 | Pinned dependencies, StateManager store, lifecycle/unit checks, 128 MiB and complete SmolVLM package reseeding across independent browser contexts; actual WebGPU worker inference. | Two physical hosts, broader churn and measured transport peaks. |
| .3 | External-cache importer and exact pinned packages; requested 27B passes full hash/import/manifest verification, persistence and ranges beyond 4 GiB. | Two always-on seed providers, operator lifecycle and seed-loss acceptance. |
| .4 | Four ONNX models plus small GGUF, image dependence for all three vision models, warm reuse, cooperative cancel, unload and source-off restart. Exact27B generation/arithmetic/warm reuse from Node-store ranges, forced cancellation and release; worker failure/accounting regressions. | Exact27B browser persistence/peer transfer; actual GPU-loss/render-preemption and resource-contention acceptance. |
| .5 | Authenticated private remote inference implemented; separate-browser WebGPU host and GPU-disabled requester text/image generation, streaming, cancellation, host toggles and peer loss tested. Model-level discovery, longest-idle/busy routing and legacy output-cap negotiation covered. | Two physical-host acceptance, durable always-on hosting and NetViz model telemetry. |
| .6 | Inference console, CubeChat/Earth agents, nested production builds, second overview card and trusted Tailnet preview connected to Secret Workshop. | NetViz artifact/model telemetry and full chaos/release gates. |

| ID | Work and main file targets | Exit gate |
| --- | --- | --- |
| IPFS-01.0 | Compatibility spike: exact Helia/libp2p/IDB dependency set, browser Bitswap reachability, node ownership, Transformers worker fetch hook and pinned runtime assets. Measure the selected Qwen on actual WebGPU. | Two independent browser contexts exchange a verified block; artifact shutdown leaves application networking alive; production worker loads the pinned model through the adapter, generates text, and disposes. Record hardware/browser/peaks and dependency lock. No production-wide networking upgrade. |
| IPFS-01.1 | StateManager-owned `artifacts/` service, schemas/store/import/read/range/pins/resume/GC/quota; manager API, lifecycle, exports and pure tests. | Deterministic CID fixtures; corruption/path/size rejection; bounded 128 MiB ingestion; crash recovery, dedup, GC, pin and active-read safety; manager startup/rollback/teardown with injected transport. Non-model files work without inference dependencies. |
| IPFS-01.2 | NetworkManager-coordinated IPFS adapter, provider binding/discovery, bounded blocks and advertisements, optional verified HTTP fallback. | A→B→C reseeding test below, independent identities/storage, actual serving counters, no origin/gateway escape, relay/peer-loss cleanup. |
| IPFS-01.3 | Node importer under `scripts/`, generic file and HF manifest workflow, operator seed recipe and pin inventory; no weights in Git. | Exact revision/digests/complete variant closure, reproducible directory CID, two durable providers, seed restart and one-provider-loss recovery. |
| IPFS-01.4 | ModelInferenceService adapter, compatible compute worker streaming/cancel/residency, broker/supervisor/NodeKernel lifecycle, actual GPU admission. | Model acquired by CID generates on real WebGPU; second request reuses residency; restart uses retained artifacts with origin blocked; abort/dispose/device loss/preemption release resources correctly. |
| IPFS-01.5 | Authenticated remote inference protocol, registered-model admission, explicit model selection with longest-idle/busy placement, and NetViz metadata. | Two physical capable peers serve and request bounded generation; output/cancel/backpressure/peer-loss behavior proven; no prompt/token leakage to shared state. |
| IPFS-01.6 | `demos/inference` retro-terminal artifact/model console, generic non-LLM consumer, workspace/dev/build/gallery/static-test registration, nested Vite worker/runtime packaging, bounded chaos regression. | Production build works at a nested HTTPS path with no live HF dependency; same files reseed to fresh peers; NetViz distinguishes fetching/hosting/loaded/running; existing relevant suites and release checks pass. |

The implemented first slice follows compatibility → generic store → peer
transfer → managed inference. Preserve that separation: a standalone chat worker
or an HTTP gateway download does not establish managed execution or peer hosting.

## Acceptance tests and completion definition

The detailed matrix is part of [the test strategy](../tests.md). The checkpoint
above and dated test receipts distinguish executed gates from remaining plans.

1. **Generic large-file hosting:** A imports a deterministic 128 MiB file, B with
   empty storage retrieves and verifies it over actual IPFS block exchange. Close
   A; a fresh C retrieves from B with origin/public gateway fallback blocked.
   Verify source/transport counters and digests. Separate BrowserContexts/profiles
   and libp2p identities are mandatory: several existing P2P tests use pages in
   one BrowserContext, which can share IndexedDB and produce a false pass here.
   Add a slower >2 GiB fixture with an explicitly raised store quota to cover
   integer/range/streaming boundaries; measure transient memory independently.
2. **Failure and retention:** interrupt/resume, corrupt/missing blocks, malicious
   manifests, quota denial/exhaustion, cancelled reads, duplicate imports, mixed
   pins, cross-tab GC, seed restart, provider restart/reannouncement from retained
   IndexedDB blocks with no model loaded, relay loss, and all providers unavailable.
   Show an honest unavailable state when the last complete provider disappears.
3. **Model package:** fetch the exact variant through its manifest CID, validate
   every required file, and generate on a real WebGPU adapter. Verify a second
   request does not reload weights, retained files survive restart, and HF plus
   public runtime CDNs are blocked after import, including a cold worker/reload.
   Document model/runtime/revision/browser/GPU, cold/warm
   timings, transfer bytes, estimated/measured memory, and actual backend evidence.
   Headless software GPU or mocked inference is not hardware-performance proof.
4. **Compute integration:** real worker readiness, required-worker failure,
   proof that runtime initialization/session execution occur in the worker ID
   owned by ComputeManager, actual WebGPU dispatch/profiling evidence, no inline
   fallback or independent inference worker, and compatible one-shot handlers;
   token ordering/backpressure and slow-consumer overflow, abort during
   download/load/generation including late load completion after abort, unload,
   device loss, preemption, lease renewal/expiry beyond TTL, no double-counted GPU
   units, queue bounds, worker crash/resize and NodeKernel
   teardown. Releasing a bookkeeping record alone is not successful cancellation.
5. **Remote inference:** independent machines, explicit selected provider,
   authorized model/runtime IDs, over-limit rejection, privacy checks, timeout,
   duplicate/late messages, requester/provider loss, and clear partial-output
   behavior. Availability metadata must expire and cannot override local admission.
6. **Release/regression:** nested-path Vite worker/WASM/import closure, explicit
   runtime cache policy, correct range/HEAD semantics where the adapter exposes
   HTTP, generic-file consumer, and bounded network chaos while rendering stays
   responsive. Close all owned test browsers/servers. Rerun existing relevant
   core/service/network/cache and Multiscale build tests plus changed demo/static
   checks. Reconcile or explicitly preserve the historical staged Eshkol failure;
   this plan does not waive it or claim a new green baseline.

Storage MVP closes after .0–.3's applicable storage gates; local model inference
closes after .4; the complete IPFS-01 item also requires .5–.6. No model-size,
throughput, production-readiness, or multi-GPU claim is earned by planning alone.

## Primary references checked on 2026-11-03

- IPFS browser limitations and long-running providers:
  [IPFS in web apps](https://docs.ipfs.tech/how-to/ipfs-in-web-apps/),
  [pinning](https://docs.ipfs.tech/how-to/pin-files/),
  [Bitswap](https://docs.ipfs.tech/concepts/bitswap/),
  [UnixFS](https://specs.ipfs.tech/unixfs/), and
  [trustless gateways](https://specs.ipfs.tech/http-gateways/trustless-gateway/).
- Helia's current lifecycle/composition contracts:
  [Helia 7.1.16 source](https://github.com/ipfs/helia/blob/helia-v7.1.16/packages/helia/src/index.ts),
  [libp2p wrapper 2.1.5 source](https://github.com/ipfs/helia/blob/libp2p-v2.1.5/packages/libp2p/src/index.ts),
  [verified fetch](https://github.com/ipfs/helia-verified-fetch/blob/main/packages/verified-fetch/README.md).
  Package versions were cross-checked against their npm registry metadata.
- Browser persistence limits:
  [MDN storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
- Model identity and packaging:
  [converted Qwen model card](https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX),
  [immutable ONNX file metadata](https://huggingface.co/api/models/onnx-community/Qwen3-0.6B-ONNX/tree/58ca03a5e7b354b480b1a82b34bde8dc7b854cc0/onnx),
  [upstream Qwen/license](https://huggingface.co/Qwen/Qwen3-0.6B).
- Runtime integration:
  [Transformers.js 4.3.2 environment](https://github.com/huggingface/transformers.js/blob/4.3.2/packages/transformers/src/env.js),
  [loader](https://github.com/huggingface/transformers.js/blob/4.3.2/packages/transformers/src/utils/hub.js),
  [streamers](https://github.com/huggingface/transformers.js/blob/4.3.2/packages/transformers/src/generation/streamers.js),
  [stopping criteria](https://github.com/huggingface/transformers.js/blob/4.3.2/packages/transformers/src/generation/stopping_criteria.js),
  [ORT large-model constraints](https://onnxruntime.ai/docs/tutorials/web/large-models.html),
  [ORT WebGPU device options](https://onnxruntime.ai/docs/api/js/interfaces/Env.WebGpuFlags.html),
  [ORT worker/proxy/thread constraints](https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html),
  [Transformers.js WebGPU execution](https://huggingface.co/docs/transformers.js/guides/webgpu).
- Alternative runtime investigation:
  [WebLLM 0.2.87 model/runtime config](https://github.com/mlc-ai/web-llm/blob/v0.2.87/src/config.ts),
  [MLC Qwen package revision](https://huggingface.co/mlc-ai/Qwen3-0.6B-q4f16_1-MLC/tree/8c14ce481d4c692769976ad52afea453a102df19).

## Decisions still requiring implementation evidence

- Confirm the minimal mutually compatible IPFS/browser transport versions and
  whether shared-node composition is practical. Separate ownership is the
  baseline until proven otherwise.
- Confirm Qwen q4f16 load/generation/disposal on the target GPUs and exact
  Transformers/ORT build. Reduce the baseline model/context if measurements do
  not fit; update the manifest and gates explicitly.
- Measure IDB throughput and peak memory before selecting OPFS or setting wider
  file/model limits. Ensure chosen import and range APIs genuinely stream.
- Select operator seed locations, quotas, and retention during deployment work.
  No external service, paid pinning account, or live deployment is created here.

## Added Scope: Small Multimodal Demo Agents - 2026-11-03

Support small vision-and-text models alongside Qwen through the same artifact
and managed-worker path. Evaluate revision-pinned SmolVLM 256M and 500M ONNX
packages, including their image processors, tokenizer/configuration, and exact
per-module weight variants. Record supported input modalities, runtime adapter,
dtype map, required GPU features, and measured admission envelope in the approved
model catalog. Candidate support is not a claim of proven generation until the
actual browser/GPU gate runs.

Add a reusable demo-agent session that supplies bounded text, structured scene
context, and optional resized image frames to ModelInferenceService. Keep context
and conversation local to the chosen execution session. Register demo-owned
actions with schemas and validation; model output proposes data, never executable
JavaScript, module URLs, or unrestricted tool calls. Bound steps, output, image
dimensions, queued requests, and observation cadence; allow the user to stop it.
Demonstrate integration through a narrow existing-demo adapter and the inference
console, with image-dependent behavior and rejected unknown/invalid actions.
Avoid granting models authority over arbitrary shared state or network messages.

- Final small-GGUF qualification: Qwen3.5 0.8B Abliterated passes generation,
  arithmetic, warm reuse, cancellation, unload and source-blocked browser restart
  with all 26 layers on the GPU. Qwen3 0.6B Abliterated passes its 29-layer GPU
  lifecycle but fails arithmetic/instruction-format checks; keep its experimental
  limitation visible rather than describing every catalog option as quality-qualified.
- The validated production build is live at the existing Tailnet origin, port5189,
  with ten choices and the SecretWorkshop backend. Serving a fixed build directory
  prevents unfinished source edits from interrupting the preview again. Both host
  and requester tabs must refresh for inference protocol2 capability discovery.


### November3 20:19 - Search and device compatibility

- Defer the abliterated multimodal2B candidate. Add a native filter to unified
  HF/peer import choices, preserving query/selection through periodic discovery.
- Show unsupported or over-budget models as disabled with a specific reason;
  enforce this before imports and local loads. Keep peer inference independent
  of requester GPU capability and memory budgets.
- Probe adapter features and GGUF browser prerequisites without loading weights
  or allocating GPU buffers. Browser RAM is approximate; WebGPU does not expose
  freeVRAM. Do not compare package size to per-buffer limits or storage quota.
- Optional Config RAM/GPU inference budgets compare against the existing model
  reservation estimates. Unknown actual fit remains selectable and labelled;
  these controls do not limit disk storage or change existing runtime estimates.
- Implemented and verified:91 focused unit/runtime tests,23 headless UI tests,
  affected production builds and exact desktop/mobile Tailnet preview pass.
  Peer root metadata is hash-checked before weight transfer; rejected imports
  preserve the resident model and remote inference. Cold-adapter retry stays
  within the original3s deadline and performs no device/allocation stress probe.
  This completes the search/admission slice, not the broader physical-host gates.
- November3 20:43 follow-up: 16GB GPU screenshot reflects missing browser
  shader-f16, which the pinned GGUF backend and both diffusion profiles require.
  Separate feature-blocked copy from memory-budget failures. Validate both the
  normal NVIDIA driver policy and the explicitly overridden test environment;
  do not imply that one proves the other. FP32 fallback remains unimplemented.
- November3 20:57: make unavailable model choices actionable for setup help;
  native disabled options cannot trigger a modal. They remain visually muted,
  labeled and blocked from import. The modal explains the actual limitation,
  detects browser/OS with manual correction, offers applicable fixed launch
  commands, supports copying/reopening/keyboard navigation, and preserves the
  prior selection, resident model and independent peer inference.
- November3 21:12: fix silent early response cutoff. Request1,024 output tokens
  with a2,048-token context; preserve manager admission, cancellation and deadlines.
  Keep stop/length/unknown completion metadata over peer transport and display
  limit notices with each answer. Tokenize ONNX history before dropping old turns;
  preserve the latest request, images and system instructions. GGUF context errors
  remain explicit, without silent replay or automatic context shifting. Qualify
  the larger context with cached small-model WebGPU execution; retain the earlier
  27B512-context measurement scope until separately measured.
- November3 21:19: show RAM/GPU estimates for HF and peer model entries. Replace
  last-file stale status with byte progress, verification and component loading
  phases plus elapsed time. Keep verification intact and allow local model readiness
  without waiting for tracked sharing publication; expose errors in the library.
- Updated peers advertise output caps; callers negotiate each chosen provider's
  limit before admission, using256 for legacy hosts. Config can clear conversation
  context without unloading models or deleting artifact storage.

### Conversation audit and discovery repair — November3 22:05 AKST

- Requests: restore missing network models (including DreamShaper), wrap selector
  entries within the window, and make trying the browser command the first help
  step. Discovery now runs independently of expensive publication and persistent
  artifact startup; a same-library ownership failure preserves the application
  connection. Show separate counts/errors for shared files and loaded inference
  hosts. Authentication, actual host freshness and artifact ownership remain intact.
- Actual production-backend proof covers an owned managed GPU host, a second tab
  sharing its IndexedDB library, and an independent GPU-disabled browser. Both
  clients discover the host and its package. Private inference returns actual GPU
  evidence; hosting off/on removes/restores the model. The final live check also
  observes DreamShaper hosted by an existing peer, without sending that peer a
  test prompt. All owned browsers close after validation.
- Remaining IPFS-01 qualification: full27B browser persistence/restart/transfer;
  27B at2048 context (the earlier56-layer proof used512); two physical machines;
  durable seeds/seed-loss; GPU loss/render contention; NetViz model telemetry;
  real-model scene/actions in the implemented CubeChat/Earth integrations.
- Ordinary disk-file/handle storage was discussed, but is not implemented.
  Abliterated multimodal2B remains explicitly deferred. Wrapping is verified for
  native customizable selects; unsupported browsers retain their native picker.
  Merge into ulg stays pending user review.

### Model catalog expansion — November3 22:14 AKST

- Add requested Qwen3.5 9B Bowman EvilQ5_K_M; DavidAU HighIQ Thinking Heretic
  via a clearly identified GGUF conversion; Mradermacher EvilQ8_0 andQ4_K_M.
  Retain exact revisions, file digests, original/conversion model cards and licenses.
- Find useful ONNX chat/coding/translation options that execute without shader-f16.
  Quantized weights alone do not establish this; validate actual managed WebGPU
  execution on the default browser feature set.
- Preserve capability-based local admission, remote inference availability,
  text-only GGUF behavior and existing runtime/resource bounds. Multiple
  quantizations of one repository revision must remain distinct trusted packages.

## 2026-11-03 22:33 AKST - Pages handoff

Build the complete docs gallery with the expanded model catalog and verify every demo visually and through console/network evidence. Include static-host cross-origin isolation for managed GGUF inference in standalone and embedded consoles. Existing developer-server headers are insufficient for GitHub Pages. Keep runtime evidence outside Git, preserve user preview origins, and keep build commits local.

- Pages local acceptance complete: full docs includes the16-entry catalog and second overview card; scoped isolation supports static hosting; actual owned SmolVLM peer inference passes against /peercompute/inference/. All23shipped routes/46visual captures and67focused tests pass within documented non-camera/non-XR/available-backend scope. Public404 persists until this feature branch’s /docs build is pushed; ulg merge remains separate.

- November3 23:32 AKST: user approved publishing the verified docs build to feature/ipfs-artifacts-webgpu; no ulg merge. Initial push was rejected by a generated Transformers.js secret-scanner false-positive candidate. Verify official upstream provenance and preserve all identifiers/licenses while limiting generated line lengths; retry only normal protected push after validation.
- Protected retry8bbba3d2 rejected on the same unchanged upstream identifier. Public publication remains pending a separately approved GitHub false-positive exception. Preserve scanner protection, provenance receipts, and the already verified local preview.
- November4 05:47 AKST: explicit user approval received for the verified GitHub false-positive exception; API approval succeeded. Continue publication and public-origin validation without changing repository scanner configuration or merging ulg.

- November4 public closure: Pagesa281d9b5 deployed; secondtile/modelconsoleHTTP200;33exact-file/MIME checks,23public route checks and46visual reviews complete. Real public owned-peer managed WebGPU inference passes with exact pinned model CID and encrypted transport. Outstanding geodata/MPM numerical diagnostics/CubeChat2of64memory64 probes/camera-XR limits are recorded; parentIPFS-01 and ulg merge remain open.

## November4 07:23 AKST - Library defaults, navigation and complete Tsotchke GGUF catalog

Add size-sorted model choices, remembered successful stored-model default (fallback Qwen3.5 0.8B Abliterated), and explicit Stored Models loading. Selection does not auto-load. Add overview back arrow plus top-right About/link hamburger. Include all four standard-GGUF Tsotchke releases with immutable provenance and codec exclusions; retain the current large-file/runtime admission bounds and candidacy labels. Preserve existing local/peer workflow, accessibility and persistent model identities.

- November4 steering: investigate live remoteDreamShaper failures; move library/config/About into hamburger with separate About modal; rename ImportModel toLoad and automatically load saved/default model on startup; make model console installablePWA. This supersedes earlier no-autoload selection-only requirement.

### November4 loading feedback follow-up

- User requests a spinner overlay and Cancel during local model loading. Cover startup retained/default models, HF/peer acquisition and Stored Models → Load. Keep stage progress visible and wait for operation cleanup before dismissing; Escape cancels and background controls remain inaccessible.
- Original public Dream failure was expired admission; owner-lifetime repair is deployed. Separate gray/noisy image output remains under hardware/runtime investigation despite valid peer transfer and unchanged diffusion source.

- November4 additional request: an unsupported default must automatically select and load a supported model. Prefer existing compatible stored models to downloads; if needed choose the smallest compatible catalog profile, preserving honest setup state when none are available.

- Console-only dial warnings are not request outcomes. Preserve direct/relay encryption and avoid replay; retry same-host stream negotiation safely before writing application data. Actual request errors and remote model/session readiness remain authoritative.

### November 4 — embodied-agent research steering

- The next agent concept should learn behavior, navigation and motor control through small specialist neural networks with learned information/skill routing. Persistent identity, memories and evolving bodies remain part of the goal. This supersedes the brainstorming suggestion of scripted/deterministic behavioral controllers. Retain engine physics and authority checks, distinguish memory from weight learning, and use versioned artifacts for policies/body/checkpoints. This records design intent; implementation and training have not started.

- November4 document request: preserve this direction in [Humunculus design v0.1](../demos/humunculus/humunculus.pdf), including browser/peer architecture, candidate multimodal and speech models, curriculum and training, body adaptation, fly-controller experiments, milestones and measurable acceptance. The requested PDF delivery is separate from application implementation and does not authorize an ulg merge or app release.

### November 5 — model browser design discussion

- Propose replacing the top filter/select controls with Browse models, a responsive modal with name/model-card search, source/task/size/compatibility filters, compact result rows and selected-variant details. Quantization, exact package size and memory estimates remain distinct; optional publisher/license/FP16 filters can live under More filters.
- Combine current catalog, live HF discovery, stored packages and peer availability without confusing file hosting with hosted inference. Preserve model-level remote targets, five-second peer refresh and selected source while results update. Variants retain immutable revision/package identity; names alone cannot establish equivalence.
- Reuse acquisition, cancellation, stored-model loading and preferences. Add a bounded discovery/metadata adapter and runtime-specific package resolver; known GGUF/diffusion catalog checks cannot simply be bypassed for arbitrary Hub results. Unverified or unsupported results explain their status; memory-unknown models with supported features are not automatically excluded.
- Suggested delivery order after approval: modal over current sources; live HF name/description search plus exact variant/package validation; peer integration and accessibility/mobile/PWA regression checks. This records a proposal only; no UI/runtime implementation or publication is authorized yet.

### November 5 — ordered discovery and agent TODOs

1. [x] **MODEL-BROWSER-01:** completed November 5, covering the
   modal and wider Hugging Face discovery/package resolution above.
2. [ ] **AGENT-01:** immediately afterward, implement the
   [persistent agent layer](../demos/inference/agent-layer-plan.md), summarized in
   [one page](../demos/inference/agentlayer.pdf). One general agent type creates identity,
   goals and context in IndexedDB; a compact learned router uses eligible hosted
   models or strict local-only inference. The router itself may optionally run on
   a peer. Model-request loading, open/invited agent hosting, independent clones
   and acknowledged same-identity migration are separate permissioned stages.

- This is the initial software-agent foundation for Humunculus. The agent record
  stays independent of answering model and execution peer. Model serving is not
  permission to accept an agent or replace/download a model. Keep context private,
  use acknowledged IndexedDB commits, and preserve pre-commit inference retry
  rules and single active authority on cooperative hosts.
- Routing includes eligibility checks plus trained task–model scoring, offline
  outcome/preference data, held-out evaluation and a local fallback. Optional
  peer ranking is advisory and nonrecursive; local-only prohibits it. Voice and
  direct mesh generation remain new adapter work; learned movement/fly controllers
  remain later Humunculus work. No application code or publication in this slice.
- User requests the one-page PDF be copied to cos@stinkpad:/home/cos/Desktop/agentlayer.pdf;
  this delivery is distinct from implementing or deploying either TODO.

### November 5 — general agent scope and architecture diagrams

- User narrows AGENT-01 to one general-purpose agent type. Multiple instances
  retain independent identities/goals/context; remove the proposed type selector
  and role-specific template catalog. Existing text/vision/image adapters remain
  usable by the same general agent. Dedicated agent types and new speech/direct
  mesh adapters are deferred beyond this TODO, without changing MODEL-BROWSER-01's
  first priority or the requested optional routing/loading/mobility capabilities.
- Add reusable vector diagrams to the detailed plan and one-page PDF showing
  PeerCompute manager ownership, local versus optional peer routing, managed
  inference and private checkpoint persistence. Refresh the previously authorized
  Stinkpad PDF destination after document and visual validation.

### November 5 — MODEL-BROWSER-01 implementation authorized

- User authorized the HF TODO. Implement responsive modal selection, public Hub name/card search, bounded caching/paging, exact variant resolution and source/task/package-size/precision/compatibility filters. Agent-layer implementation remains separate.
- Preserve managed WebGPU execution, immutable CID packages, current startup preferences, cancellation, stored loading and peer inference. Wider GGUF admission validates standard headers independently in the worker; unsupported codecs and unadapted diffusion packages explain their limits.
- Acceptance: focused unit and real DOM tests, live API/CORS inspection, an actual discovered package import/load through ComputeManager, source-off stored reuse, responsive visual checks and verified HTTPS preview/backend connection. Implementation results will be appended after checks.

- Completion: responsive production modal, wider live Hub name/card search and exact package resolution delivered. New ONNX and single-file standard GGUF both generated in managed hardware WebGPU workers and reloaded from saved CID after browser restart with sources blocked. Final focused unit202/202, panel55/55 plus browser16/16, existing GGUF35/35 and PWA/release34/34 pass. Built standalone, CubeChat and Earth; all3 affected Pages-shaped routes pass and10 actual screenshots were independently reviewed.
- Verified internal preview: https://fastbox.tail5c077c.ts.net:5189/?dev=1 (SecretWorkshop connected; valid isolation; overview arrow resolves). GitHub Pages and docs/ published bundles remain unchanged in this slice. See [model browser implementation](../demos/inference/model-browser.md); AGENT-01 is next.

### November 5 — missing Hub results follow-up

- User reports no Hugging Face models on the Tailscale preview and asks whether
  requests were throttled. Actual name/card searches returned HTTP200 and38results;
  restrictive filters hid every summary before package inspection.
- Preserve an explicitly labeled Needs inspection group for missing facts while
  excluding known mismatches. Match alternative inspected variants without
  silently replacing the chosen package. Explicit HF-only browsing works without
  a query; reopening resumes interrupted searches. No automatic model downloads
  or new runtime support is implied by metadata visibility.

### November 5 — broader model support priorities (proposal)

- User asks for the lowest-effort path to many more supported HF models after
  inspection, citing Nemotron. This is research/discussion; implementation is not
  authorized and the ordered AGENT-01 queue is unchanged.
- Live metadata inspection separates three limits: original publisher checkpoints
  may have no browser package; our architecture lists are narrower than installed
  engines; generic ONNX packages still have a1.5GiB admission ceiling. The latter
  is an inference-package policy, separate from browser storage quota.
- Concrete probes: onnx-community/OpenReasoning-Nemotron-1.5B-ONNX uses qwen2;
  q4f16 passes package admission at1,251,475,659bytes and requires shader-f16;
  q4 is rejected solely by the ceiling at1,833,957,106bytes. This is inspection,
  not successful execution evidence. onnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-ONNX
  q4 is2,568,544,283bytes and q4f16 is2,315,723,636bytes; nemotron_h is blocked
  by our list despite a built-in Transformers.js4.3.2 adapter and upstream WebGPU
  example. Both architecture and resource admission need qualification.
- Recommended first slice: resolve related ONNX/GGUF conversions with explicit
  source lineage; widen measured ONNX package profiles; qualify existing built-in
  text architectures and dense GGUF families; then support complete split-GGUF
  packages. Keep per-file digest/closure checks, managed workers, memory bounds,
  cancellation/reset and real WebGPU execution gates. Do not equate upstream
  architecture registration or successful inspection with tested device support.
- Later work: hybrid/MoE families, new codecs and vision projector adapters.
  Nemotron30B-A3B's ggml-org Q4 file is22.422GB despite only~3B active parameters;
  active expert count is not total model storage. Its footprint differs markedly
  from the small4B candidate.
- Primary sources: [OpenReasoning ONNX](https://huggingface.co/onnx-community/OpenReasoning-Nemotron-1.5B-ONNX),
  [Nano4B ONNX](https://huggingface.co/onnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-ONNX),
  [upstream WebGPU demo](https://huggingface.co/spaces/webml-community/Nemotron-3-Nano-WebGPU),
  [pinned llama.cpp architecture registry](https://github.com/ggml-org/llama.cpp/blob/46ca246de9bb1c35269722a6240d37d9dfd79cad/src/llama-arch.cpp).

### November 5 — support expansion authorized

- User approved the first three support priorities. Implement a shared capability
  registry, size/config-aware ONNX admission and related browser-conversion UI.
  Preserve managed-worker execution, digest-bound artifacts and explicit loading.
- Acceptance starts with OpenReasoning-Nemotron1.5Bq4 and NemotronNano4Bq4,
  then representative newly admitted architecture families. Record metadata-only,
  candidate and actual GPU execution evidence separately. Split GGUF and AGENT-01
  implementation remain outside this slice.
- Implementation checkpoint: shared capability registry, bounded config-aware
  text envelopes and related conversion UI implemented. Core82, Hub34,
  browser32 and regression192 tests pass; all3 affected production builds and
  exact Tailscale preview/SecretWorkshop checks pass. Gemma270M ONNX and
  StableLM1.6B GGUF pass actual managed GPU lifecycle/source-off restart gates.
  Nemotron1.5B q4 initialization hit an NVIDIA allocation failure with existing
  user GPU residency; Nano4B q4 execution remains unrun pending free resources.
  These acceptance gates remain open even though structural inspection succeeds.
- 19:49 AKST update: the user released GPU resources and both Nemotron runtime
  gates now pass. Nano4B q4 returns coherent responses and passes managed-worker
  reset/cancel/recovery/source-off restart with no errors and no FP16 override.
  OpenReasoning1.5B q4 also passes the complete lifecycle, but short general-chat
  prompts produced unrelated programming continuations. Keep response-quality
  evidence separate. The256-token comparison recognizes2+2=4 but never produces
  its requested final answer before the limit; the garden prompt remains off-topic
  and repetitive. Do not recommend this export for reliable chat without further
  reference/model-generation-setting comparison. Nano4B's execution and chat
  screening pass independently.

### November 5 — Nano4B suggested catalog omission

- User asks why the tested model was not added to suggestions. Dynamic discovery
  and qualification had been completed, but catalog promotion was missed.
- Add **Nemotron 3 Nano 4B (q4)** to the built-in catalog with the same pinned
  revision,9files, digest identities and memory profile. Preserve upstream NVIDIA
  source/license metadata. Catalog identity matching must recognize the prior
  downloaded dynamic package; this is not a new model/precision qualification.

### November 5 — Nano HTTP download interruption follow-up

User reported repeated ERR_NETWORK_CHANGED on Nano4B's2,089,224,480-byte ONNX
external data file. HTTP200 only established headers; it did not prove the body
finished. The shared importer previously had no response-body recovery. Add
in-operation offset recovery with exact byte ranges, canonical URL re-resolution,
continuous hash/import state, bounded transient retries/timeouts, and retry status
in the existing cancellable overlay. Keep PWA notices separate from this network
failure. Do not alter model/runtime compatibility or bypass source integrity.
Native Chrome/IndexedDB recovery and cancel checks pass. Durable partial download
journaling across reloads is deferred; original interface-change cause is unknown.

### November 5 — first persistent general-agent implementation

- User authorized starting AGENT-01. Deliver the first A0/A1 local foundation
  and A2 baseline route, keeping the full A0–A6 TODO open. One general type,
  private IndexedDB identity/goals/summary/history, explicit direct tasks,
  local-only by default and optional existing peer inference. StateManager owns
  private records; existing ComputeManager and model controller own execution.
- Add an Agents dialog beside Browse models, shared by standalone/CubeChat/Earth.
  Save/edit, pause/resume/cancel, route history, export/restore-as-new and delete
  are usable. Only resident models participate; no silent model loads or replay.
  Learned quality ranking, grants, host loading and mobility remain planned.
- Foundation46/46 and combined UI68/68 checks pass. Actual cached Gemma WebGPU,
  private-memory reuse, browser restart and cancellation pass. A separate browser
  with no GPU/model sends a real task over native WebRTC to an owned GPU host;
  response/provider/CID persist. Both owned environments clean up with zero active
  leases. The internal HTTPS preview is updated; no public Pages release.
- Concurrent user report: model deletion still fails for them; exact error not
  yet known. Fresh-browser synthetic package deletion through the real preview
  passes, preserving another package. This does not qualify connected withdrawal
  or reproduce the user's failure; retain a separate follow-up.
- Correct a separately reproduced deletion-state bug: denied owner lock or queued
  cancellation restores a previously healthy model's availability. Started or
  earlier cleanup remains quarantined; retain the explanatory ownership error.
  Controller/library70/70 checks pass; no storage integrity checks are bypassed.
### November 5 — fresh visual context for consecutive image attachments

- User reports identical SmolVLM256M replies to two different attached images.
  Managed GPU comparison confirms current pixels are correct: red alone → red,
  blue with prior red conversation → exact repeated red answer, identical blue
  pixels alone → blue. No cross-request pixel/KV reuse was found.
- A new attachment starts fresh visual conversation context in ordinary chat and
  agent requests. Retain the transcript/private journal and system/agent identity,
  goals and explicit summary. Only a successful visual task replaces the model's
  follow-up context; failures/cancellation preserve the previous successful one.
- Unit/UI tests cover complete pixel identity, same filenames, late decoding,
  local and peer targets, system instructions, following text, empty results and
  cancellation. Actual sequential managed Smol and final preview checks accompany
  this fix. The single-image transport and model's caption-quality limits remain.

### November 6 — investigate apparently unsupported small GGUF models

- User reports disabled Load for Qwen3 0.6B Abliterated Q4. Confirmed native
  backend and shaders require FP16, independently of stored quantization.
- Clarify that reason in model details; preserve Setup help and the runtime gate.
  Owned current-Chrome probes confirm the existing NVIDIA startup flag exposes
  the required feature; the user's effective launch flags remain unconfirmed.
- A genuine FP32 GGUF backend requires shader/layout/precision changes and
  fresh managed GPU qualification. It is not implemented by this clarification.

### November 6 — CubeChat desktop input follow-up

- Fix coarse-pointer desktop startup selecting touch-only controls. Actual mouse,
  keyboard and touch events select the HUD; keyboard movement remains available.
- Keep settings/model-console typing separate from avatar controls and clear
  held input/captures when focus is lost. Validate native desktop/hybrid/mobile
  interaction in a dedicated HTTPS preview without changing public Pages assets.

### November 6 — inhabited conversational agents in both worlds

- Correct the old console-only demo integration. CubeChat agents inhabit cubes;
  EarthGrid agents inhabit georeferenced bodies. Players select a body and type
  or speak, receiving text and optional positional managed speech.
- The user explicitly confirmed other players should see and talk to the agent.
  Authenticate its owner through encrypted libp2p streams, isolate visitor
  histories and keep private agent records in StateManager-owned IndexedDB.
- Keep scene/model/voice lifetimes separate from open windows; await cancellation
  and cleanup before room replacement. Reuse the existing routing and aggregate
  resource broker. No automatic microphone capture or speech-model downloads.
- Detailed boundaries and acceptance: [inhabited-agent plan](../demos/inference/inhabited-agents.md).

### November 7 — CubeChat speech follow-up

- Diagnose “Unsupported model runtime” on loaded voice packages and reported
  silence. Classify the pinned auxiliary speech runtimes with their actual
  reservations, and keep them separate from main chat-model loading.
- Protect microphone/transcription ownership from overlapping Send/Models,
  preserve cancellation, and resynchronize controls after speech unload/deletion.
  CubeChat positional audio follows the player body rather than orbit-camera
  distance. Preserve explicit microphone/model-loading actions.
- Validate the real native Talk/Stop path and controlled failure regressions;
  publish corrected internal previews only. Standalone agent administration is
  the Agents button in the existing inference console on HTTPS5189.

### November 7 — recover retained models after navigation

- User reports successfully running27B, navigating away and finding an empty
  library despite14.3GB still in IndexedDB at the same5189 origin. Preserve all
  data; recovery should inspect local blocks before any new download.
- Do not revoke a verified complete checkpoint just because sharing or an audit
  is interrupted. Idempotent pinning checks root identity; provider publication
  still validates the serving closure. Proven damage remains unavailable.
- Show retained partial packages with Verify locally, byte progress and cancel;
  retain their startup preference and prevent implicit HF replacement. Recovery
  is separate from GPU loading and does not contact model sources.
- Reuse completed files across package retries by pinned SHA256/size, then
  validate the final manifest. Partial-file HTTP checkpoints across page reload
  remain separate future work. Use synthetic native-browser tests and update
  internal previews; preserve user GPU capacity and existing model storage.

### November 7 — multimodal console and reusable specialist routing

- User confirms storage recovery works. Backport managed voice to the dedicated
  console and allow multiple simultaneous residents, including same-engine
  models. Loading another model must not silently evict an existing resident.
- Default Mixed uses a capable local resident first, then eligible peers when
  local capability/queue admission is absent. Preserve Local only and explicit
  targets. Generate image is explicit; attachments select vision understanding.
- Add per-model unload, meaningful route labels, explicit Talk/Stop and optional
  spoken replies. Share registry/routing/audio orchestration with agent/world
  consumers and extend peer hosting to multiple models plus bounded audio.
- Preserve16GiB GPU/12GiB CPU admission envelopes, model retention/recovery,
  cancellation and exact-CID provenance. No learned-router or motor-training
  claim. Detailed design: ../demos/inference/multimodal-console.md.


### November 7 — unify model and agent conversation UI

User: “there should only be one chat interface as well not one for agents and
one for models.” Put agent identity selection in the main Chat target menu and
reuse text, attachments, image intent, Talk and Speak replies. Agents becomes
management only, with Chat selecting the main conversation. Preserve independent
direct context, acknowledged private agent memory, explicit Resume/recovery,
local-only speech and cancellation across the whole turn. New identities use
Mixed; existing policies remain unchanged. See the multimodal console plan and
repository log for implementation and acceptance evidence. No public deployment
or merge is included in this correction.


### November 7 — truthful combined memory admission

User reports a16GB GPU cannot load DreamShaper and Qwen2B together. The code
reserves8GiB RAM/GPU per model but caps aggregate RAM at12GiB. Correct the
artificial default and Config's disconnected per-model-only limits. Owned Auto
tracks estimates without an invented byte cap; explicit combined budgets and
borrowed-host limits remain authoritative. Expose estimated residency and effective
caps, preserve already loaded models when limits change, and cleanly invalidate
GPU-failed sessions. Do not equate package bytes, configured reservations or a
browser memory hint with actual/freeVRAM. Actual co-resident hardware qualification
is separate from deterministic admission tests and individual model success.


### November 7 — reliable peer discovery and vision attachments

User reports intermittent missing peer models, execution failures and unavailable
attachments. Preserve valid authenticated replies despite close-only transport
errors, refresh expired exact selections without changing CID, and avoid waiting
for unrelated discovery when an eligible cached provider exists. Separate image
input capability from transient queue capacity; maintain Mixed/local-only and
explicit target behavior. Validate real private peer vision from a GPU-disabled
client, and keep text-to-image input restrictions accurate.

The user's two-browser screenshot adds a concrete stream-opening timeout before
a directory is received. Investigate and repair nominally open but unusable
connections with a bounded authenticated relay path to the same peer. Protect
new negotiation and active inference on both ends without closing older active
connections. Recovery must happen before application data; committed prompts
never replay. Keep connection capacity, cancellation, cooldown and shutdown
ownership explicit, and qualify this using the actual private vision worker.


### November 7 — stored picker, image input and navigation

User requests multi-select saved packages with **Load selected models**, opening this library on startup whenever any saved model exists. Empty storage alone retains compatible default loading. Paste/drop images on Message through the bounded attachment pipeline, preserving draft text and avoiding pasted blob URL strings. Confirm the page back arrow with Stay here/Leave; retain sessions until confirmed cleanup. Keep existing models resident across sequential additions and cancellation.

- 2026-11-07 Models consolidation: replace main Load/current-model label with a single Models entry (also in the menu). Stored models becomes a tab, default when retained packages exist, with existing multi-select/additive loading and deletion preserved; Browse models supplies discovery. Remove crowded search/package helper prose, place count with Filters and sorting, and show phone details full-window with Done returning to results. Internal previews only; no Pages publication requested in this slice.

- 2026-11-07 compact conversation UI: one top row with Back/Models/Agents and network glyph/Menu. Click the glyph for discovery details; green needs peers plus shared and hosted models, red means disconnected, yellow covers connecting/incomplete/warning states. Put target, image-generation, spoken-reply and routing text behind a Chat options cog before Attach. Keep progress/errors actionable, silence routine status layout, and update empty guidance for the new controls. Preserve shared console/world routing and lifecycle contracts.
- November7 stored-library batch follow-up: remove per-row Load/Delete, rename Load selected, and add Delete selected. Shared selection includes loaded/unsupported/verification/cleanup packages; load eligibility remains separate. Keep Unload/Verify locally; sequential deletion preserves acknowledged results, waits for cleanup and supports visible retry of failures.

## November 7 — CubeChat native social follow-up

The requested next integration is world-native human/resident keyboard chat with
overhead text bubbles, a unified Residents interface, smaller settings windows,
and one smoothly moving body per resident. Use reusable delivery, ownership,
motor and presentation components toward homunculus. Keep agent private histories,
model lifecycle and existing automated peer URLs; no learned-control claim.

## November 7 — resident presentation and Pages publication

Follow-up instructions: remove floating Residents/Models buttons and keep menu
entries; simplify model management windows; persist a resident appearance prompt,
use an available image model and put its image on the cube front; allow opt-in
world-chat replies; show human names and compact resident nameplates. Implement
reusable appearance/presentation and public-response orchestration toward the
homunculus plan. Human-only triggering is the current default to prevent loops.
The user explicitly requests a new GitHub Pages docs/ build and push to origin
when these changes finish. This supersedes earlier internal-only publication
limits for this release; no merge to ulg is requested.


### November 8 — chat control follow-up

User requests network green on connected+positive peer/shared/hosted counts, image
and ear glyphs in the bottom row with mutually exclusive output modes, hold Talk
recording and default-on concise text/vision prompts. Preserve saved user text and
local/peer routing. Build/publish the feature-branch Pages output and internal
previews after native and affected-route visual/console checks. No merge to ulg.

Completed and published November 8 as dc655b02: native tests, full build, internal
and public layout/connection checks pass. Recovered the interrupted build after
a workstation reboot without losing source changes. No merge to ulg.


### November 8 — integration into main

The user now requests an up-to-date PeerCompute README and merging this feature
branch into main. Update both application/library documentation, preserve main
history with a normal merge, verify the resulting application/build tree, push
main and align GitHub Pages to main:/docs. This supersedes the temporary feature
publication workflow; it does not request an ulg merge or branch deletion.

Completed: README checkpoint c4430844 and normal merge de73dfd0 are pushed.
Main retains both histories and the exact feature tree. Pages source is main:/docs,
and the merge commit built successfully on November8 at22:16:10Z. Documentation,
release checks and public bytes pass; feature branch retained, no ulg merge.


### November 8 — peer inference availability follow-up

Return to this model-demo branch for capability-based Generate image availability
and a network-status directory of inference models with hosting peer counts.
Preserve local/Mixed routing, draft task intent, existing publication setup and
main history. Rebuild affected shared consumers and deploy GitHub Pages.

Completed and published as913af7f4:247distinct cases, three consumer builds,
staging/internal/public UI and network checks pass;54changed public assets
match. Main:/docs remains the publication source and both branches retain the
change. Image intent is preserved during provider loss with explicit text recovery.


### November 8 — Android microphone diagnosis

The user reports repeated mic-not-ready on Android, plus a separate Safari WebGPU
report from a Mac Studio without versions/error. Fix demonstrated console
touch-first startup/cancellation lockout, retain hold recording semantics and
validate owned touch audio plus internal preview consumers. Document Safari's
macOS requirement without asserting the unknown report's exact cause. No broader
voice redesign, new model qualification or Pages/main publication in this slice.

Completed locally:54focused cases, three external builds and staging/internal
layout plus SecretWorkshop checks pass. Internal5189/5176/5187 previews updated;
Pages/docs and main remain unchanged. Physical-device confirmation remains open.


### November 8 — keep project documentation library-first

The root README describes PeerCompute, its cellular-automata topology insight,
usage and architecture. Inference/agent operational detail belongs in
demos/inference/README.md; other demos own their respective guides. Preserve
original root media, retain implementation limits and avoid long release history
in the project introduction. This corrects the earlier application-first framing.


## 2026-11-08 library-wide status reconciliation

User requested full library, demo and plan/log reading before final README status.
Completed authored-source coverage is1,047files/25.0MB. Root documentation remains
library-first and conjecture-led; models/agents are an optional application of the
network/state/compute/artifact framework. The [audit](../reports/2026-11-08-library-status-audit.md)
records current managed runtimes, whole-request routing, retention/reseed scope,
scripted body behavior and remaining physical/multi-host qualification. It does
not reopen superseded one-model/storage-cap/bootstrap limitations or claim learned
agents, model sharding, publicDHT or optimalCA topology. No runtime/release change.


### 2026-11-08 documentation publication

User authorized pushing the reviewed library documentation to main. Commits
173270e1/853c986c were selectively integrated as c640b991/b844a376 and pushed;
the separate microphone runtime fix stays on this feature branch. Reviewed docs
and original media are preserved; existing generated Pages assets are unchanged.


### November 8 — Global/Personal chat

User requests a default named Global feed for explicitly Global prompts and generated results, alongside an isolated Personal tab. Saved agent contexts remain Personal; local-first/peer model routing is unchanged. Shared history is bounded and available from online authors, not a permanent archive. New reusable chat transport and UI must preserve world management-only mounts. User explicitly holds all GitHub Pages deployments pending further instruction; this work remains local/internal.

- Later November8 steering: Personal is the initial tab, listed first; Global sharing requires selecting Global. Preserve independent drafts/context, named shared output, recent-peer history and the no-Pages-deploy hold.


### November 8 — resident conversation follow-up

User reports two CubeChat residents repeating themselves and requests that
residents talk to each other. Inspect the live room, repair queued public
context and resident-message routing through reusable world components, preserve
authenticated ownership/private-history boundaries and bound follow-up turns.
The user's explicit GitHub Pages deployment hold remains in force.


### November 9 — next resident milestone proposed

User asks which resident enhancements offer the most immediate value toward
homunculus. Recommend world awareness, scoped episodic memory and a bounded
intention/action interface, demonstrated by learned approach/stop/follow. Current
kinematic/scripted motor is not a trained controller. Detailed proposed sequence
and acceptance scene are in demos/cubechat/plan.md. Await direction on scope; this
review changes planning records only and preserves the Pages deployment hold.

### November 9 — accepted CubeChat resident increment

User approved meet-and-follow and added editing existing residents and cloning them onto their own node. Build reusable bounded senses, typed model intentions, trained local continuous movement, scoped episodic memory, owner edit controls and opt-in public clone profiles. Clones start with fresh identity, authority and memories. Validate actual policy execution separately from controlled language fixtures. Internal preview only; do not build/push/deploy GitHub Pages.

- Follow-up supersedes the separate default-off clone/history controls: new
  residents expose one **Share resident history** checkbox, checked by default.
  Current scope copies personality, appearance and up to eight public world
  episodes to an independent new resident; inherited episodes retain donor
  attribution. Existing residents' permissions are preserved. Same-identity host
  migration and private-history sharing await clarification and a separate durable
  authority-handoff implementation; do not label cloning as migration.

- Final continuity choice: independent active clone branches, with creator choices
  for public history (default on) and private conversations (default off). Replace
  the recent-episode sample with full retained selected world-history transfer,
  bounded credited chunks, permission rechecks, and atomic destination import.
  No same-identity authority migration or automatic future-memory merging.

November 9: user authorized NetViz All demos telemetry across games and standalone
model hosts. Add shared operational reports and aggregate filters/model-host counts,
then continue the next Humunculus/CubeChat slice after verification. Keep public
Pages publication on hold; internal previews remain the review surface.

November9 follow-through: implement the next documented social-initiative slice
after NetViz. Native resident initiation opt-in, model choice of silence/greeting,
nearby identity checks, bounded pair exchanges, public encounter/goal memories and
human preemption. Keep the components reusable towards Humunculus. Do not turn
cloning/history consent into permission for automatic new-host initiative. No
Pages deployment or push; qualify external builds and internal previews.

Social increment complete locally with tested consent, bounded pair arbitration,
public memory and human priority. Actual Qwen0.8B qualification establishes valid
silence, not natural introduction quality; retain that limit in user-facing
results. Real peer delivery/reload/mobile acceptance passes. Internal CubeChat
preview promoted; no public Pages change or push authorized.

November9 subsequent approval: implement learned obstacle navigation/recovery
for CubeChat residents, reusing managed workers and local control contracts.
Keep training provenance and real collision-aware held-out acceptance, add a
small native movement inspector, and update only the internal HTTPS preview.
Persistent autonomous goals remain a later slice; public Pages and push stay held.

Navigation increment qualified locally: trained6914parameter managed WebGPU
motor, shared bounded sensing, native movement inspection and stop/recovery.
Fresh96/100 reaching and20/20 following cases pass; actual Qwen come/follow
commands and native stop pass with physical memory receipts. Transient agent
task instructions and compact prompt projection fix repeated instruction growth
without clearing history. Internal CubeChat5176 updated; no public build or push.

November9 user reports continuing context-budget errors and frequent resident
pauses, while following works. Add actual GGUF context fitting and recoverable
request handling, plus local/remote Resume in the native chat opened from a cube.
Preserve durable memory and owner control over deliberate pause/unknown outcomes
unless user explicitly changes that policy. Validate actual long conversations
and peer recovery, update internal previews only; no Pages publication or push.

Clarification during this work: automatically resume after settled errors until
three consecutive failed requests, then pause. A successful response or explicit
owner Resume resets the streak. Users cannot resume someone else's paused peer;
the native chat Resume control is owner-only. This replaces the earlier proposed
remote-resume action. Never replay a failed request automatically.


November9 continuation: after the context/recovery fix, implement the next
bounded Humunculus slice, persistent owner-assigned objectives. Add reusable
private StateManager persistence, model routing/decision contracts, an outcome-
driven controller and native owner controls. Actual neural movement and physical
receipts must support the model's separately labeled completion assessment.
Restore paused without replay; no visitor control or active-job clone transfer.
Use only internal previews and local commits; public Pages/push remain held.

- Existing peer-hosted Qwen2B used for real objective planning; no further local
  download. Private request-scoped references reduce context growth. Physical
  approaches work, while ordered visit/return quality remains unqualified for the
  tested setup. Keep experimental controls separate from this open model-quality
  gate. Internal preview only; public Pages and push remain on hold.

- November9 clarification: repeated/echoed replies are definitely observed with
  peer-hosted inference; local behavior is unknown. Audit request ownership and
  history through actual peer calls. Fix the reproduced mutable-admission race;
  distinguish prompt feedback, model behavior and transport failure using retained
  exact inputs/results. No Pages build/deploy or push.

- November9 Conan/cube screenshots reproduce ordinary-chat repetition on peer
  models despite correct current requests. Preserve exact persona and stored
  history while testing. Failed prompt/memory variants are retained as failures.
  A confirmed Transformers.js4.3.2 Qwen3.5 text-position offset defect now has a
  version/behavior-guarded managed-worker correction and70passing focused tests.
  Real identical-model before/after history qualification is required before
  attributing the user's symptom to that defect. No Pages deployment or push;
  old loaded hosting workers must eventually reload to receive runtime changes.

Actual CPU/GPU comparisons now show the numerical Qwen correction does not
resolve dialogue repetition. A separate same-Nemotron peer test also reproduces
old replies/irrelevant stop across new prompts. Standard template/extraction and
request correlation checks pass for these fixtures. Neither a replacement action
contract nor sampled decoding qualifies as a remedy. Continue shared context
projection investigation with complete prior speech retained; keep previews and
saved memories unchanged until native semantic acceptance.

- November9 Global images: normalize peer-decoded pixels at public publication;
  strict canonical input/wire validation remains.17focused cases plus isolated
  two-browser exact-pixel transfer/history pass. Internal5189updated and all four
  preview services restored after crash. Public Pages/build/push remains held.
  Preserve the separate unresolved resident repetition investigation; no failed
  context or sampling experiment is promoted as a fix.

- User clarifies that the failing Personal target is an agent; Global is direct
  model chat. Same exact Nano host now returns correct direct arithmetic and
  unrelated fresh Conan riddles with correct journal/current-request delivery.
  Preserve this context difference separately from earlier literal repetition.
  Request affected agent instructions/history; do not clear memory or change
  persona based on an unrelated fixture. No additional runtime patch or public
  deployment is qualified by the comparison.

- Subsequent clarification supersedes the Personal-agent repetition assumption:
  user observes repetition only in CubeChat. Return to the captured native
  resident failure; poor inference-demo answers are a separate quality issue.
  Do not gate this bug fix on arithmetic competence or request Personal settings.

- Candidate separates conversational speech from physical decision routing while
  keeping identity/history and owner authority. New observations include actual
  motor state. Focused164 checks and external Cube/Earth builds pass; native
  current-question responsiveness and real Follow/Stop remain release gates.
  No public Pages build/deploy or push; temporary candidate5191 only.

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

- November10 user renews permission to rebuild/push the entire Pages demo set.
  Publish the current qualified source first, then begin the next Homunculus
  slice: bounded model-authored resident milestones, durable evidence-backed
  progress, owner-only controls and paused reload recovery. Source changes for
  the new slice must follow publication; actual-model ordered completion remains
  a separate gate from infrastructure fixtures and the fixed dialogue repetition.

- November10 full demo release5f3b556a published and public23-route verification
  passed before new edits. New local milestone candidate adds immutable
  model-authored plans, exact receipt-derived progress, reusable owner UI and
  no-replay restore. Native qualification remains open despite141fixture tests;
  keep actual model failures and late-network cleanup evidence. The published
  build stays fixed while this Homunculus slice is tested internally.
- November10 milestone slice qualified locally:146objective and92network checks,
  two consumer builds, actual Nano two-/three-step plans and saved-progress reload
  complete with exact physical receipts and no replay. Failed prompt candidates
  remain recorded. The winning framing separates current subtask from retained
  original goal; generic model explanations remain a limitation. Promote only
  internal CubeChat after exact UI/backend checks; no second Pages deployment.

November10 mobile report: constrain standalone inference document scrolling,
keeping transcript/dialog and embedded-world scrolling intact. Local CSS-shell
change plus internal5189 preview only; Pages publication is not part of this fix.
Native device overscroll remains distinct from passing emulated viewport checks.

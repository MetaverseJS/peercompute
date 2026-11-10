# MODEL-BROWSER-01 — Hugging Face model browser

Discovery implemented and verified November 5, 2026. The unified Models window
and mobile details are the November 7 follow-up; agent-layer work has a separate
plan.

## User flow

Models opens a responsive native dialog with Stored models and Browse models
tabs. Stored models is the default whenever packages exist on this device;
otherwise Browse models is selected. The same window opens from the main toolbar
or menu, and the main page has no separate Load/current-model controls.
Search local source descriptions,
public Hub model names and model-card text, or enter a repository URL. Filter by
source, task, package size, precision and compatibility. Default ordering is
smallest selected package first; unknown sizes stay explicit and sort last.

Selecting Hugging Face search in Source also browses Hub metadata with no query.
An untouched All sources view stays network-free. Search keeps an accessible name
and placeholder without redundant labels or helper paragraphs. The live result
count sits on the Filters and sorting row. On phones, a selected result opens
full-window details; Done or Escape first returns to the same results and scroll
position. A second Done or Escape closes the window. Tabs retain search, filters,
selection and stored-package checkboxes. Periodic refresh cannot open details.
Unknown Hub packages remain in a separate Needs inspection group when size,
precision or compatibility cannot yet be checked; known mismatches are excluded.
Filters consider every inspected variant, name a matching alternative and preserve
the explicit package selection. Closing and reopening resumes an interrupted
search, without repeating completed searches during periodic discovery refresh.

A Hub repository is not a runnable package. Inspect selects an immutable revision,
resolves variants and reports exact file closure, format and device eligibility.
GGUF header inspection is performed for the selected variant, not every
quantization in a repository. Candidate labels distinguish package admission from
successful execution on this device. Unknown memory fit does not mean unsupported.

Load uses the existing spinner/cancel, verified artifact import, retention,
ComputeManager worker and remembered startup path. Stored packages reload without
Hub access. Use peer changes the chat target without downloading weights. Peer
inference and shared files remain separate availability states; target identity is
manifest CID, not a display name or publisher-supplied model ID. Five-second
refresh preserves an open dialog's selection and keyboard focus. Unchanged result
rows retain their DOM identity so discovery cannot detach an active click target.
Closing ends the old metadata requests synchronously; a queued close event cannot
cancel requests started by a newer opening.

## Modules and ownership

- `huggingface/hubClient.js`: anonymous public name/full-card API queries, bounded
  responses, pagination, cancellation, timeouts/rate handling and metadata cache.
  All model-file URLs are fixed to the public Hub and immutable revisions.
- `huggingface/packageResolver.js`: immutable tree/config/card resolution, exact
  ONNX modules and external-data closure, existing catalog matching and selected
  standard GGUF header inspection. Repository content is data; custom code is not
  installed or executed. License claims retain publisher provenance.
- `ui/modelBrowser.js`, `modelBrowserData.js`, `modelBrowser.css`: presentation,
  query lifecycle, filters, variant details, load/setup/peer actions and focus.
- `modelHubPackage.js`: acquisition-boundary shape, size, digest and immutable
  identity checks; no placeholder identity is persisted or used to fetch bytes.
- `runtime.js`, `modelRuntimeController.js`: existing ArtifactStore acquisition,
  mutation queue, verified import, automatic activation, successful preference
  commit, worker cleanup, shared-library retention and network publication.
- `inference/gguf/hubAdmission.js`: bounded standard GGUF metadata/tensor-directory
  parser, architecture/codec constraints and independent worker verification of
  the selected file header before native execution. Pinned catalog digest checks
  remain in place.

## Supported scope and limits

The shared capability registry admits Qwen2/Qwen3/Llama, Phi/Phi3,
Gemma/Gemma2/Gemma3-text, Mistral, Granite, StarCoder2, SmolLM3, OLMo/OLMo2 and
Nemotron-H text packages supported by the pinned Transformers.js4.3.2 engine.
SmolVLM/Idefics3/Qwen3.5 vision keeps its existing modules and limits. Generic
families are candidates, not a promise that every graph export has been tested.
Text packages are bounded to8GiB total and individual files below2GiB; the managed
context remains2,048 tokens. New families and larger legacy text packages carry a
canonical geometry profile including attention and, for Nemotron-H, recurrent
state. Verified config is checked before reservation and again in the worker.
Unaccounted native dimension overrides are rejected for these dynamic profiles.
Reservations account for package bytes and double-buffered float32 state/cache;
actual graph intermediates and browser/free GPU memory remain uncertain.
Runtime file/context/resource envelopes remain enforced. ONNX q4
without FP16 operators/cache can work without shader-f16; a nominal quantization
label alone does not establish GPU feature requirements.

Dynamic GGUF supports one self-contained standard text model, known architectures,
standard supported tensor codecs, immutable SHA256 file identity and the existing
16 GiB package ceiling. Complete tensor-directory/header inspection is bounded to
16 MiB per selected file. Shared memory, memory64, JSPI, isolation and hardware
shader-f16 prerequisites remain. Split files, custom GeoRefine layouts, unsupported
codecs and projector-only packages are not admitted through discovery. No CPU
fallback or arbitrary runtime assets are introduced.

After an inspection, **Find browser conversions** queries publisher-declared
base-model relationships, requiring actual ONNX/GGUF files at a pinned revision.
It inspects at most12 related repositories from a bounded40-result metadata page;
ONNX candidates are ordered first. Names/tags alone do not establish lineage,
and a publisher declaration does not prove equivalent weights or conversion from
the exact selected source revision. Selecting a related package performs normal
pinned inspection; loading remains explicit. Discovery can be cancelled and
completed metadata is reused without periodic re-query. Current filters remain
active and cannot silently substitute or load a hidden variant.

Diffusion discovery can identify the pinned catalog profiles. Additional image
pipelines need their own adapter and validation; merely having ONNX files does not
make a random diffusion repository runnable. Public search may return unsupported
results so the UI can explain their status. Private/gated authentication is outside
this feature. Browser-reported memory is advisory; explicit budgets and runtime
bounds still apply. Offline cache freshness and live provider availability are
separate from complete local model storage.

## Verification

Run with Node24:

```sh
node --test peercompute/tests/unit/huggingFace*.test.js peercompute/tests/unit/ggufHub*.test.js peercompute/tests/unit/model*.test.js
node --test demos/tests/model-browser.test.js demos/tests/inference-panel.test.js
node demos/tests/huggingface-browser.mjs
```

The real-browser harness searches a non-catalog SmolLM2 135M ONNX package, proves
browsing fetched no weights, imports via the modal, checks actual managed hardware
GPU generation, connects to SecretWorkshop, and restarts an owned profile with
Hub/CDN requests blocked to verify remembered stored loading. It does not send
inference prompts to strangers or publish its model. Desktop/mobile screenshots,
console errors, API receipts and GPU evidence are written outside the repository.

Additional checks cover unsupported/tampered metadata, stale query completion,
pagination/rate/offline behavior, package closure, exact-variant identity,
local-incompatible but peer-available models, cancellation, library deletion,
startup and PWA/static nested-route behavior. Current run outcomes and limitations
are recorded in `plan/log.md` and `plan/tests.md`; no unrun architecture is claimed
as qualified.

Final acceptance:202 focused unit tests;71 UI checks across final panel/browser
runs;35 existing GGUF checks;34 PWA/release checks. Both novel ONNX and GGUF
packages generated on actual managed hardware WebGPU and survived source-off
browser restart. All3 affected production builds and Pages-shaped routes pass.
[Internal preview](https://fastbox.tail5c077c.ts.net:5189/?dev=1) connects to
SecretWorkshop. This slice is local to the feature branch and internal preview;
it does not publish new GitHub Pages bundles.

November5 support expansion checkpoint:82 core,34 Hub,32 model-browser and192
integration checks pass. Gemma3-270M-it q4 ONNX and StableLM2-Zephyr1.6B Q4_K_M
GGUF pass real managed WebGPU generation, deterministic fresh-state repeat,
streamed cancellation/recovery and source-off browser restart. The GGUF run used
the documented NVIDIA FP16 override in its owned browser; Gemma did not.
OpenReasoning-Nemotron1.5B q4 and Nano4B q4 also pass the full managed GPU lifecycle
after the user released memory. Nano4B gives coherent short chat responses and
needs no shader-f16 override. OpenReasoning's general-chat responses remain
unrelated and repetitive at256tokens; simple math recognizes4 but does not finish
the requested answer before the limit. Runtime success is not a quality
endorsement, and its publisher/export EOS discrepancy needs a separate reference
comparison before changing application behavior. The first
OpenReasoning attempt encountered an NVIDIA allocation failure under existing
memory pressure. Browser loading materializes external-data buffers as well as
ORT/GPU allocations, despite bounded IPFS transfer chunks. All three affected
production builds and the exact internal preview/source-to-conversion UI/
SecretWorkshop check pass.

### November 5 — interrupted model downloads

The shared HTTP importer now resumes a failed body from the last byte yielded
into the same ArtifactStore import. Each retry resolves the original pinned
source URL; signed CDN redirect URLs are neither cached as identity nor logged.
Resume requires a pinned SHA256/Git digest, a206 response, exact Content-Range
start/end/total, consistent available ETags and unencoded bytes. The final
size/digest/CID checks remain mandatory. Ignored ranges, source changes, quota,
malformed bytes, integrity failures and cancellation do not retry.

Five transient retries use1/2/4/8/8-second waits; each network request/read has a
30-second inactivity deadline, excluding storage-write time. The overlay shows
retry count and received bytes. Cancelling also interrupts waits and stalled
reads; cleanup does not wait forever on a broken stream. Page reloads do not
retain a partial-transfer journal. The native Chrome fixture cuts an actual
HTTP200 body after a positive prefix, then proves206 recovery produces the
uninterrupted CID in IndexedDB; another case proves cancellation prevents retry.

### November 6 — quantized GGUF and the FP16 requirement

Model details now distinguish stored weight precision from the engine's GPU math.
The pinned Wllama/llama.cpp WebGPU build requires shader-f16 even for Q4/Q8 GGUF;
Load remains disabled when the adapter does not expose it and Setup help remains
available. Actual Chrome157.0.8103.38/NVIDIA595.91.7.0 adapter probes agree with
our collector: the existing NVIDIA startup override exposes the feature and
makes the same entry selectable. No model download or GPU device allocation was
needed for this comparison; it does not requalify model output or memory fit.

### November 7 — local library recovery after interrupted verification

A previously complete package remains complete if revalidation is cancelled or
navigation interrupts background sharing. Only observed missing blocks or
integrity failures invalidate that checkpoint. Pinning an already retained
complete package checks its root identity without repeating every file hash;
publication still checks actual blocks before allowing peer reads.

Legacy retained partial manifests remain visible as Needs local verification.
The Stored models tab offers Verify locally with streamed byte progress and cancellation,
independently of device model compatibility. Successful verification returns the
same CID and enables Load selected; missing/corrupt bytes report a local failure
and remain listed. No model HTTP or GPU worker is involved. Startup preserves
pending last-used models, and catalog/Hub acquisition cannot silently download
another copy while that retained package needs verification.

If a package retry follows a failed sidecar, complete local file roots with the
exact pinned SHA256 and size are reused even without catalog CIDs. Candidates
are rechecked inside retention; the final manifest still checks actual bytes.
Git-only sidecars retain their existing digest path. This does not persist an
unfinished file's byte offset across page reloads.

Native IndexedDB/Web Locks tests use synthetic files, isolated browser profiles
and GPU-disabled Chrome. They cover interrupted publication, reopen, legacy
recovery/cancel, missing/corrupt blocks, concurrent deletion and sidecar failure
followed by retry with zero repeated weight requests. Test results and exact
preview evidence are recorded in plan/log.md.

### November 7 — stored batch action controls

Stored models uses one selection for the footer Load selected and Delete selected
actions. Loaded, unavailable and pending-verification/cleanup packages can be
selected for deletion; only compatible complete unloaded packages are loaded.
Per-row Unload and Verify locally remain. Failure/cancellation keeps completed
deletions completed and retained failed/unstarted selections available for retry.
Refresh reconciles actual storage before controls unlock. Browsing a catalog or
Hub result still uses its detail Load button; only stored-row actions change.

## Embedded world model management — November 7 2026

CubeChat now opens the library directly from its hamburger menu. One native
model dialog contains Stored/Browse, Config, setup help and loading state. Done
inside Config/setup returns to the same library tab/selection; the final Done or
Escape awaits the host's close callback and restores focus to the world menu.
Metadata requests remain paused while a subpage is shown; Browse resumes them
on return. Config return refreshes Stored residency after explicit unload.
The panel borrows and preserves the scene runtime. Failed cleanup permits close
retry without leaving half-disposed mutable controls; a retained model worker
must be explicitly unloaded/recovered before final disposal. Standalone chat
and Earth retain their existing default window ownership.

### November10 — standalone viewport ownership

The standalone HTML shell constrains document scrolling to keep mobile bottom
space outside the chat from becoming a second scroll area. Transcript, model
library and other dialogs retain internal scrolling; shared embedded world
panels are unchanged. Verify root height and composer bounds across viewport
resizes, focus and modal close as well as the existing internal scroll checks.
Native phone keyboard/address-bar behavior still requires device confirmation.

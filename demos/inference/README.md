# Models and agents

This demo uses PeerCompute to retain model files, host inference for other peers
and route chat to loaded text, vision, image and speech models. Persistent general
agents use the same model services and conversation interface. It is an example
application of the [PeerCompute library](../../peercompute/README.md).

[Open the demo](https://metaversejs.github.io/peercompute/inference/) ·
[All demos](../README.md) · [Architecture and plan](../../plan/demos/inference/multimodal-console.md)

## Run

Use Node.js 24 LTS and run from the repository root:

```sh
nvm use 24
npm install
npm run dev:inference
```

Open `https://localhost:5189/`. The console connects to the configured relay;
the published configuration uses SecretWorkshop. For trusted HTTPS access from a
phone or laptop, follow the [shared demo setup](../README.md). Run
`npm run build:inference` to build `docs/inference/`; this does not publish it.

## Load models

Open **Models**. **Stored models** is the default tab when this origin has saved
packages; otherwise use **Browse models** to search the catalog, peer packages or
Hugging Face by name, description or repository URL. Filters cover task, source,
package size, precision and compatibility. Inspect a result for its revision,
files, license, download size and estimated RAM/GPU requirements before **Load**.
**Find browser conversions** can locate ONNX/GGUF exports of an original
checkpoint. Metadata search does not download full weights.

Loading fetches, verifies, stores and initializes the model. The overlay shows
progress and **Cancel** waits for owned worker cleanup. With stored packages,
select several and choose **Load selected** to add them sequentially while keeping
existing loaded models. Failed choices remain selected for retry. Only an empty
library attempts the default Qwen3.5 0.8B Abliterated model, or the smallest
supported catalog alternative; a storage-read failure does not trigger a download.

Runtime support depends on the export, not just its model name:

For GGUF LoRAs, select one package in **Stored models**, then **Add LoRA**.
Inspect an adapter repository or file URL and choose its strength. Saving creates
a separate model that reuses the base's downloaded files; loading replaces that
selected base in memory. Ordinary compatible GGUF matrix adapters are supported;
Safetensors diffusion LoRAs require a different backend. See the
[adapter contract and qualification](../../plan/demos/inference/model-adapters.md).

| Runtime | Tasks and example candidates |
| --- | --- |
| Transformers.js / ONNX | Text and vision: small Qwen, SmolVLM and inspected supported conversions |
| wllama / llama.cpp GGUF | Text: quantized Qwen and standard GGUF packages; pinned Gemma4 companion package adds image/audio input |
| ONNX diffusion | Image generation: pinned Stable Diffusion Turbo and DreamShaper 8 LCM exports |
| Managed speech workers | Recognition with Moonshine Tiny; synthesis with Supertonic |
| Managed ONNX mesh worker | Image-to-3D: pinned TripoSR Q8; used by CubeChat resident object tools |
| Managed SF3D worker | Image-to-3D: pinned Stable Fast 3D with UVs, albedo and normal textures |

Exact files and revisions live in the [ONNX catalog](../../peercompute/src/peercompute/inference/modelCatalog.js),
[additional ONNX catalog](../../peercompute/src/peercompute/inference/additionalModelCatalog.js),
[GGUF catalog](../../peercompute/src/peercompute/artifacts/ggufModelCatalog.js),
[diffusion catalog](../../peercompute/src/peercompute/artifacts/diffusionModelCatalog.js)
[speech catalog](../../peercompute/src/peercompute/inference/speech/speechCatalog.js)
and [3D catalog](../../peercompute/src/peercompute/artifacts/meshModelCatalog.js).
Discovery rejects unsupported architectures, split/custom-codec GGUF packages
and arbitrary diffusion pipelines. Anonymous Hub access does not load gated or
private packages. Catalog inclusion is not a guarantee of model quality, device
fit or successful execution of every publisher export.

The catalog includes **MiMo V2.6 Distill Qwen 9B Abliterated (Q4_K_M)** from
[BoldingBuilds](https://huggingface.co/BoldingBuilds/Abliterated-MiMo-V2.6-Distill-Qwen-9B-GGUF),
using `MiMo-V2.6-Distill-Qwen-9B-Abliterated-Q4_K_M.gguf` (5.24 GiB).
It was reported working in PeerCompute by a user on November 10, 2026; this is
a user test, not an independently reproduced hardware qualification. The pinned
package includes the MIT-declared model card and supports text only through the
managed GGUF runtime. Normal device checks still apply.

The catalog also includes **Gemma 4 12B Uncensored (Q4_K_M)** from
[TrevorJS](https://huggingface.co/TrevorJS/gemma-4-12B-it-uncensored-GGUF), a
publisher-described abliterated variant with 6.87 GiB of weights. Its Gemma4
architecture and tokenizer are admitted by the managed GGUF runtime. This package
is text-only. The separate **Gemma 4 12B Uncensored (Q4_K_M, vision + audio)**
package reuses those saved decoder bytes and adds a 116.4 MiB companion with
image/audio projections. It fetches about 99.9 MiB of pinned source tensor ranges
and constructs the companion locally; it does not download the 22.3 GiB source
checkpoint. A user confirmed the text package works in PeerCompute on November
10, 2026. Independent hardware Chrome tests on an RTX 5060 Ti subsequently
passed text, changing image inputs and speech transcription, both locally and
over encrypted peer inference. Retained reload with downloads blocked,
cancellation/recovery and resource release also passed. Companion reconstruction
matches the pinned upstream CPU converter byte for byte. See
[the media plan](../../plan/demos/inference/gemma4-media.md) for evidence and scope.

To upgrade a saved Gemma text package, unload it, then choose the **vision + audio**
entry in Browse models. Loading the new entry reuses complete verified decoder
files. The two packages remain separate stored entries sharing the same decoder;
deleting one does not delete files retained by the other. Image/audio support is
advertised only after the native worker confirms both modalities at load time.
The **Image understanding** and **Audio understanding** filters include this
package. Gemma produces text; voice replies still require a speech-synthesis model.

[Qwen Image 2.1 with LoRA support](../../plan/demos/inference/qwen-image21-lora.md)
is a separate planned image backend, not an available catalog model.

To host 3D generation, choose **TripoSR · image to 3D (Q8)** in Models and load
its approximately 467 MiB package. It uses WebGPU without requiring `shader-f16`.
The 4 GiB RAM / 3 GiB GPU figures are planning budgets, not measurements of free
device memory. A loaded host accepts `image-to-3d` requests from CubeChat residents
over the same inference network. It is a tool provider, not a conversational
model: ask your CubeChat resident to generate and place an object. Text requests
also need a text model and an image generator. The package includes a small
U2NetP foreground model, run in the same managed worker, to remove opaque image
backgrounds before reconstruction. Existing transparent cutouts are preserved.
Older stored TripoSR packages still accept cutouts; load the current catalog
package to use automatic background removal. Output is static colored geometry;
rigging, animated avatars and Hunyuan3D are later work. See
[generated objects](../../plan/demos/inference/generated-world-objects.md).

**Stable Fast 3D · textured meshes (WebGPU)** adds a textured alternative with
an approximately 2.18 GiB package. It also removes opaque backgrounds and does
not require `shader-f16`; FP16 stored weights expand for FP32 GPU computation.
Its 8 GiB RAM/GPU estimates are planning figures. Choose it in **Models**, load
it and enable **Host inference** to make it available to CubeChat residents.
The same resident object/avatar tools select a compatible image-to-3D provider.
Textured peer results require inference protocol v6; older hosts keep their
existing TripoSR support. Powered by Stability AI; licenses and notices are
included with the catalog package. See the
[SF3D integration and qualification record](../../plan/demos/inference/stable-fast-3d.md).

## Chat, images and voice

**Personal** is the default tab. It has its own draft and conversation history
and does not publish to the Global feed. Saved-agent conversations open here.
Personal can still use a remote inference provider when your routing choice
allows it.

Choose **Global** and set your display name to share your submitted prompts,
image attachments and generated text, images and spoken replies with other
connected participants. Audio appears with playback controls; other people's
messages never start inference or enter your model's context. Names are labels;
authenticated peer connections identify senders.

Recent Global messages are held in bounded memory and can be fetched from their
original authors while they remain online. This is not a permanent archive.
Offline Global turns wait in a bounded outbox for a connection; the status line
reports pending or incomplete sharing. Clearing Global clears your view and
context, not messages already received by other participants.

Type in **Message** and press Enter to send; Shift+Enter inserts a newline. Use
**+**, paste or drop an image to attach its bytes. Same-origin blob images work;
arbitrary external image URLs are not fetched. Attaching a new image starts fresh
visual context while previous messages remain visible and saved where applicable.

The **⚙ Chat options** button selects the target and default-on **Be concise**
preference. Concision is appended to language-model prompts without changing
the displayed user message. **Mixed** prefers a capable loaded local model and
otherwise uses an eligible peer. **Local only** prevents remote dispatch,
including speech. An explicit model or persistent agent is also selectable.
Responses identify the model and provider actually used.

The image glyph enables **Generate image**; describe the result in the message
box. It is disabled when the selected route has no capable image provider.
Generated previews are shared in Global and stay out of the public feed in
Personal. The ear glyph enables
**Speak replies**. These two output modes are mutually exclusive.

Hold **Talk** to record, then release to send. Personal direct-model chat sends
the recording to a capable audio-understanding model when one is available;
text in Message becomes the question about the recording. Otherwise it transcribes
first, then sends the text. Agent conversations and Global always use transcription;
raw microphone audio is not published in Global. A native audio model can provide
that transcription when no speech-recognition provider has capacity. Keyboard users hold
Space or Enter on the Talk button. Load speech models through Models, or use
peers hosting those tasks; voice controls do not download them automatically.
Recording is limited to 20 seconds. Releasing before startup finishes, losing
focus or cancelling discards capture. If first-use setup is cancelled, allow
microphone access if prompted and try another hold. **Stop** cancels the active
turn and releases owned microphone/playback resources.

Gemma image input uses a bounded 280-token image profile; audio is mono 16 kHz.
Media consumes the same context budget as text. Old turns can be omitted, and a
request that still exceeds the native context gets an explicit budget error.
Native media input requires an updated peer host; older hosts remain available
for their supported text, vision or speech tasks.

Text generation is bounded to 1,024 output tokens within a 2,048-token context;
length limits and omitted older context are reported. **Config → Clear
conversation** clears chat history without unloading models or deleting files.

## Share files and host inference

Open **Menu → Config**. **Share with peers** and **Host inference** start enabled
and are independent: the first serves retained model files; the second executes
requests on loaded models. Stored files alone are not a running inference host.
Both services need an active, connected browser.

The network glyph opens connection status and a directory of peer inference
models with hosting-peer counts. It is green when connected peers, shared models
and hosted models are all available, red when disconnected, and yellow otherwise.
The directory refreshes every five seconds and groups hosts by immutable model
package. Requests choose the longest-idle available host, or an eligible host's
bounded queue when all are busy. Discovery is not proof that every advertised
provider is reachable.

Prompts, images, audio and replies travel through encrypted application streams,
not public state or pubsub. The selected remote host processes their contents.
Remote inference does not require the requester to download weights or have a
compatible local GPU. Model files use the separate content-addressed artifact
service.

## Storage and memory

**Models → Stored models** lists packages and their loaded/shared status.
**Unload** releases a model's worker while retaining files. **Verify locally**
checks an incomplete retained package without downloading weights or using the
GPU. **Delete selected** stops selected models' sharing/hosting, unloads them and
frees files no longer retained by another owner. An error stops the batch;
completed deletions remain complete. Unload a package in another tab before
retrying if that tab still owns it.

StateManager stores verified IPFS/UnixFS blocks and manifests in IndexedDB.
Completed verified files can be reused after an interrupted import; HTTP range
retries resume an unfinished transfer during the active import, not across a page
reload. Browser storage belongs to the exact origin, including its port. Separate
demo ports and GitHub Pages do not share a local model library. Retaining bytes
does not make them available to peers while the browser is closed.

Browser quota estimates are advisory; actual storage writes determine capacity.
There is no user-configured disk-storage cap. CPU/GPU memory is separate:
**Auto** tracks residency estimates without a fixed application byte cap, while
explicit Config budgets and embedding-application limits still apply. Estimates
are not measurements of free VRAM. Worker, package and queue bounds remain, and
an actual allocation can fail even when an estimate fits. A failed additional
load preserves other models when cleanup completes normally.

## Browser requirements and installation

Local model execution needs the selected runtime's actual browser features.
GGUF requires cross-origin isolation, shared WebAssembly memory64, JSPI and
`shader-f16`; diffusion also needs FP16 GPU support. Quantized storage does not
remove those runtime requirements. **Setup help** explains the detected reason
and applicable browser/OS configuration. More VRAM alone does not expose a
missing feature. Safari's WebGPU implementation requires macOS Tahoe 26 or later
([WebKit requirement](https://bugs.webkit.org/show_bug.cgi?id=299237#c3)).

Use **Menu → Install** or the browser's installation action for the PWA. Its
cache retains the application shell, not model weights, private requests or every
execution runtime. Offline launch can show the UI; uncached resources and peer
requests still need a connection. Installation does not create a background host.

## Persistent agents and reusable architecture

**Agents** creates a general identity with instructions, goals and saved context.
Choose **Chat**, then **Resume agent** when needed. Agents share the main composer
and router; their identity and bounded conversation records remain private in
IndexedDB. Pause/cancel waits for cleanup, and reload does not replay interrupted
work. Export is a text/history backup; restoring creates a new paused local-only
identity rather than transferring private image bytes.

NodeKernel connects NetworkManager's discovery and streams, StateManager's
artifact/agent persistence and ComputeManager's owned workers, residency and
cancellation. Shared console, voice and routing components are reused by
[CubeChat](../cubechat/README.md) and [EarthGrid](../earth/README.md).
Routing is currently a capability policy, not a learned quality selector or
tensor-parallel execution across peers. Agent migration, cloning, autonomous
training and learned embodiment remain in the [agent-layer plan](../../plan/demos/inference/agent-layer-plan.md)
and [Humunculus design](../../plan/demos/humunculus/humunculus.pdf).

The shared runtime snapshots bounded message, image and audio inputs when
`generate()` is called, before asynchronous discovery or progress callbacks.
Reusing a caller's input object cannot rewrite a waiting request. Cancellation
signals remain live. This protects request ownership; it does not guarantee a
model follows instructions or reasons correctly about earlier action outcomes.

## Validation and further detail

Run these from the repository root:

```sh
npm run test:artifacts
npm run test:inference
npm run test:inference:ui
npm run test:global-chat
npm run test:peer-inference
npm run test:agent-layer
```

Hardware/peer-browser harnesses have separate setup and resource requirements;
passing unit tests does not qualify every model on every device. See
[test evidence](../../plan/tests.md), the [artifact plan](../../plan/branch/ipfs-large-files-model-inference.md),
[model discovery](../../plan/demos/inference/model-browser.md) and
[implementation log](../../plan/log.md) for dated trials and remaining gates.

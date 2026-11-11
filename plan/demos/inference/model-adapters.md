# Model adapters and immutable compositions

User authorization: November 10, 2026, after actual Gemma media qualification.
Implement compatible LoRAs before generated 3D objects in CubeChat. No Pages
publication or remote Git push is included.

## Contract

A composition binds an exact retained base manifest CID, one to four independently
retained adapter files, their pinned source/header evidence, and strengths from
-2 to 2. Its manifest CID identifies the complete execution configuration. Changing
strength changes model identity without duplicating stored weights. Base packages
remain independently loadable. Composition does not grant runtime support: each
backend must explicitly admit its adapter format and execute it.

The first implementation supports ordinary GGUF LoRA A/B matrices with F16/F32
weights on one complete admitted GGUF base. Header inspection checks architecture,
all matrix targets, dimensions, rank, byte extents and alpha. The worker rechecks
actual retained headers before native loading. DoRA, aLoRA, replacement tensors,
custom codecs and split base files are rejected. Safetensors image adapters and
ONNX adapters are not supported by this GGUF implementation; Qwen Image 2.1 still
needs its separate diffusion backend.

The native worker mounts each adapter through the existing bounded CID reader
and supplies native `lora_paths` and `lora_scales`. No full adapter copy into
MEMFS or native-engine fork is required. Composed models use ordinary managed
residency, inference routing, encrypted peer serving and artifact sharing.

## User flow

In Models → Stored models, select one GGUF package and choose **Add LoRA**.
Inspect a Hugging Face repository or exact file URL, select an admitted adapter,
choose strength/name, then save or save and load. Downloaded bytes are hash
verified. Existing adapter/base files are reused. Save-and-load admits the new
package before unloading the selected base; other loaded models remain managed
independently. Cancellation stays visible in both the full inference page and
CubeChat's model-management modal.

## Acceptance

Contract, importer and browser UI tests cover incompatible target rejection,
immutable identities, source/hash failures, reuse, cancellation, selected-model
gating, CubeChat modal lifecycle and error display. Actual GPU acceptance must
also compare base / scale-zero / scale-one / restored-base results, prove an
observable adapter effect, and verify retained restart plus actual encrypted peer
inference to the composed identity. A changed answer is not a model-quality score.

The current external qualification fixture pairs QuantFactory/Qwen2.5-0.5B-GGUF
revision `808e875628eb5b8d1e30728425039f4067b6ae16` with the ordinary GGUF adapter
from baranqr/StrxiAI-Qwen2.5-0.5B-F16-GGUF revision
`91a66db2124ce660f6ccdfc7e79130c7246472da`. Its 168 matrix targets match. Historical
training-base revision and explicit adapter license are not supplied by that
publisher; this is an execution fixture, not a curated recommendation. The base
is pretrained, not its Instruct sibling. Native acceptance passed on RTX 5060 Ti / hardware Chrome: base and zero-strength
outputs match, the active adapter changes five of six fixed prompts, adapted
repeats match, and unloading restores the base. Actual source-blocked browser
restart and encrypted inference-v4 peer requests return the same adapted outputs.
Local/remote cancellation, recovery, advertisement withdrawal and zero remaining
resource leases also pass. These results do not imply adapter quality.

Evidence is outside Git at
`/home/cos/.cache/peercompute-lora-native-20261111/`; preserve failed attempts and
distinguish header/unit/browser qualification from actual GPU results.

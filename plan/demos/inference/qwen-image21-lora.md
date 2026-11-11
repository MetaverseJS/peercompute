# Qwen Image 2.1 and LoRA support

November 10 update: user authorized broader reusable LoRA implementation after
the active Gemma reproduction, followed by CubeChat agent 3D generation/placement.
Use explicit base/adapter identities and runtime capabilities; initial GGUF
load-time adapters can reuse native Wllama support. This does not establish that
the separate Qwen Image 2.1 pipeline or its Safetensors adapter is executable.

Status: requested follow-up; feasibility inspected November 10, 2026. No runnable
Qwen Image entry or new backend has been added. Finish the active Gemma4 slice
separately. Internal qualification first; no Pages publication is authorized.

## Target and evidence

The requested [chfm adapter](https://huggingface.co/chfm/NSFW-LORA-Qwen-Image-2.1)
is not a standalone generator. Pin revision
`8f0d915ff8b323b88400869cfdcf00cf0e7339ff`, file `NSFW Qwen Lora.safetensors`,
159,436,456 bytes, SHA256
`c29f503f3515877882fd6b10f6849c78a4f2337c09021f4bd4b93d060c311aea`.
Its sparse card does not declare a license or exact training-base revision.

[Qwen Image 2.1](https://github.com/QwenLM/Qwen-Image-2.1) uses a 7B diffusion
transformer, Qwen3-VL 8B encoder and 64-channel RGBA VAE with flow-matching
scheduling. Official weights at `d26bb61231c349cf6b7896fa83353113880e1ba3`
total30.84GiB before runtime allocations. Preserve the actual
[Qwen Research License](https://huggingface.co/Qwen/Qwen-Image-2.1/blob/d26bb61231c349cf6b7896fa83353113880e1ba3/LICENSE)
and notices; do not label this package Apache-2.0.

The current SD/LCM worker uses CLIP77-token conditioning, UNet, four-channel
latents and a3GiB package limit. Raising that limit cannot implement this graph.
A distinct runtime definition/engine is required.

## Browser backend candidates

| Candidate | Evidence and remaining qualification |
| --- | --- |
| [inventwithdean Rust/Burn/WebGPU engine](https://github.com/inventwithdean/Qwen-Image-2.1/tree/46bfc19bc147e08c623b34ba07bc8d7453ffe19a) | MIT runtime code, INT8 and OPFS layer streaming. Author claims512px on4GB VRAM; not reproduced here. Inspected API exposes no LoRA loader. First candidate for a managed-worker spike. |
| [cgb experimental Turbo ONNX](https://huggingface.co/cgb/Qwen-Image-2.1-Turbo-ONNX/tree/2af441fa21bbf8185c9f7b4b7c61bff543c6eb05) | Q4 denoiser with a different fused Turbo adapter, mixed encoders, up to17.2GB repository assets. Publisher reports256px user testing. Referenced FreeGen pipeline repository/source returned404; not an available drop-in dependency. |

## Implementation sequence

1. **Base runtime qualification.** Pin/reproduce one browser engine build and
   complete a neutral256px image in a ComputeManager-owned worker. Measure
   dispatches, actual RAM/VRAM, first-token/step timing, device limits and output.
   Validate512px separately. Do not use author memory claims as device admission.
2. **Reusable staged image service.** Define explicit encode, denoise and decode
   phases with cancellable progress and stage-specific resource reservations.
   ArtifactService provides verified CID-backed ranges; adapt OPFS layer handles
   as an owned cache instead of introducing a second untracked model library.
   No worker-side arbitrary Hub fetches or nested unmanaged workers. Unload must
   release devices, tensors, file handles and reservations, including failed loads.
3. **Exact adapter conversion.** Validate base/adapter tensor targets, ranks,
   scaling and shapes before offline fusion followed by quantization. Produce a
   reproducible recipe; include base revision, adapter digest, strength, conversion
   tool version and output hashes. Dynamic LoRA switching is a later capability.
4. **Package and routing.** Extend manifests with immutable component dependencies
   and pipeline identity. Advertise a composed model CID/capabilities through the
   existing inference service so local and remote calls use identical inputs and
   outputs. UI distinguishes base pipelines from adapters and shows missing base
   dependencies explicitly; a152MiB adapter must never look like a complete model.
5. **Acceptance and catalog.** Neutral local and peer image generation, independent
   prompts/seeds, cancellation in each stage, unload/reload with source blocked,
   failed/missing component recovery, Global image return and CubeChat portrait
   integration. Add a curated entry only after the composed package is qualified.

## Adapter-specific conversion work

A52,904-byte bounded Safetensors inspection found384BF16 tensors:192rank32A/B
pairs over32denoiser blocks, with no text-encoder/VAE targets and no explicit
alpha. Attention targets are `attn.to_q`, `to_k`, `to_v`, `to_out.0`; MLP targets
are `img_mlp.gate_up` and `img_mlp.out`.160targets map to the official base after
removing `diffusion_model.`. The32fused gate_up targets do not: the base stores
separate `gate_layer` and `proj`. Verify split ordering and scaling numerically
against the training/conversion implementation before fusion. Never silently drop
unmatched tensors or assume a prefix rewrite establishes compatibility.

## Test strategy

Use bounded metadata fixtures for malformed ranks, unknown targets, wrong base
revision, dependency closure, immutable composite identity and cancellation.
Compare adapter deltas/merged tensors against an independent reference before
browser quantization. GPU acceptance must show actual WebGPU work and recognizable
neutral output; stubbed stage calls and saved images cannot qualify execution.
Retain failed model/device cases and distinguish publisher claims from our runs.

Research receipts and pinned metadata are external at
`/home/cos/.cache/peercompute-gemma4-20261110/qwen-image-lora/`.

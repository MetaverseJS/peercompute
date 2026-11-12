# Vendored Stable Fast 3D WebGPU route

Powered by Stability AI.

Source: [lyonsno/sf3d-webgpu](https://github.com/lyonsno/sf3d-webgpu), commit
`86b7b68109434ffc33218f5fb697c7057c2518f9`. `upstream-files.json` records SHA-256
digests of the original files before the integration changes below. The closure
starts at `src/lib/sf3d_producer.js`. No checkpoint or tetrahedron-grid binaries
are committed here.

The upstream port is derived from [Stability AI Stable Fast 3D](https://github.com/Stability-AI/stable-fast-3d).
Its README refers to the original project's license and supplies no separate
permissive port license. `LICENSE.md` preserves the Stability AI Community
License distributed with the pinned
[BasinShapers weights](https://huggingface.co/BasinShapers/sf3d-webgpu-weights/tree/53cfd8926e0abe77443b97d8684da1ea36bc4af7).
Do not describe this source or checkpoint as MIT/Apache licensed. The retained
license includes research/noncommercial and commercial-use terms, attribution,
distribution, and acceptable-use conditions.

The original port uses `@kaminos/webgpu-inference-kit` `0.1.53`. PeerCompute pins
MIT-licensed `0.1.60`; all twelve imported APIs remain available. Its used API
bundle is identical to the first MIT release `0.1.57` after normalizing the
version literal and source comments. Native qualification is recorded separately
in the project log. The dependency retains its own license. The catalog pins model,
grid, foreground graph and notice/license provenance.

## Integration changes

- `sf3d_producer.js`: omit optional resident diagnostics and unrelated host
  tooling re-exports; check cancellation at progress boundaries and pass the
  signal into the complete route. Producer construction receives PeerCompute's
  device, already-loaded weights, and `workers: {}`.
- `product_route.js`: the worker factory fails closed and the worker URL map is
  empty. All CPU phases run in ComputeManager's existing worker.
- `weights.js`: the old network loader fails closed. `loadWeightsFromSource`
  uses the existing component builders and FP16-to-FP32 conversion with bounded
  artifact reads, streaming eager tensors directly into GPU backing. Lazy
  material-estimator tensors retain their needed CPU bytes.
- `flat_tensor_ranges.js`: retain the original strict tensor-header parser;
  disable HTTP range loading. PeerCompute supplies authenticated artifact ranges.
- `marching_tet.js`: disable network grid reads. `inference.js` receives checked
  artifact-backed tet arrays and raw RGBA rather than DOM image elements.
- `clip_estimator.js`: import the same WGSL statically instead of fetching shader
  URLs during execution.
- `inference.js`: enable upstream DINO/two-stream intermediate retirement and
  release dead phase buffers after queue settlement, preserving live outputs and
  cached weights. `full_pipeline.js` releases CLIP and texture-bake scratch at
  their completed phase boundaries. No mathematical kernels change.
- `texture_baker.js`: encode embedded JPEG textures using OffscreenCanvas.
  `full_pipeline.js` requires the normal texture and checks cancellation at
  stage boundaries. `foreground_scope.js` checks before CPU phases.
- `shader_ops.js`: expose its persistent uniform and dummy-bias buffers to the
  trusted adapter's lifetime collector. Preserve those module caches and the
  pipeline's Map/Set caches across requests; retire them when the device closes.
  Without these roots, scratch cleanup destroys uniforms needed by the next
  generation. Three-request regressions and actual repeated GPU generation
  cover both cache kinds.

WGSL kernels and their mathematical operations are unchanged. The authored
adapter one directory above owns artifact intake, foreground segmentation,
device/error evidence, allocation lifetime, output validation, and cancellation.
Allocation ownership is scoped to SF3D weight loading and generation; ORT
foreground buffers remain exclusively session-owned and are excluded from the
SF3D buffer-byte inventory. Dispatch evidence still covers both runtimes.
Cancellation retires the model device; a synchronous CPU stage may need the
existing ComputeManager worker-termination fallback. We do not claim an abort
signal can immediately interrupt arbitrary CPU work or submitted GPU commands.

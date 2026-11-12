# SF3D WebGPU

Single-image 3D mesh generation running entirely in WebGPU compute shaders. A browser port of Stability AI's [Stable Fast 3D](https://github.com/Stability-AI/stable-fast-3d).

No server, no Python, no ONNX at inference time. Image in, textured GLB out.

Built on the [Kaminos WebGPU Inference Kit](https://github.com/lyonsno/kaminos/tree/main/webgpu-inference-kit),
whose cooperative scheduling lets long inference share one GPU with a live
WebGPU application — the same runtime spine used by the
[MoGe](https://github.com/lyonsno/moge-webgpu),
[Kimodo](https://github.com/lyonsno/kimodo-webgpu), and
[SHARP](https://github.com/lyonsno/sharp-webgpu) browser ports.

![Input photo of a chair transformed into a generated 3D mesh](docs/assets/hero-before-after.png)

*A single photo becomes a textured, UV-unwrapped GLB in about 40 s on an M4 Max (the default product route; about 22 s single-submit) — generated entirely by WebGPU compute shaders in the browser. Output above is the bundled `demo_chair.png` example.*

## Quick Start

```bash
# 1. Install JS dependencies
npm install

# 2. Download the model weights (~2.1 GB) into public/
hf download BasinShapers/sf3d-webgpu-weights weights.bin --local-dir public/

# 3. Run
npm run dev            # or: npx vite --port 5177
# Open http://localhost:5177/
# Click "Try Demo (Chair)" or drop any image
# Click "Generate 3D Mesh" (about 40 s on M4 Max)
# Click "Download GLB"
```

### Image preparation

SF3D centers the alpha-masked foreground, preserves its aspect ratio, and fits
it to 85% of the square input using upstream-style framing and bicubic resizing.
Geometry and material estimation share the resulting 512 x 512 image. Pass the
source image directly to the app or producer; callers do not need to crop or
resize it first. Transparent-background images provide the foreground mask;
opaque images use their full bounds. This step does not remove backgrounds.

### Model weights

Inference needs `public/weights.bin` — a ~2.1 GB fp16 flat binary (gitignored,
never committed). The quickest path is the pre-converted download above from
[`BasinShapers/sf3d-webgpu-weights`](https://huggingface.co/BasinShapers/sf3d-webgpu-weights)
(needs the [`hf` CLI](https://huggingface.co/docs/huggingface_hub/guides/cli):
`pip install -U huggingface_hub`).

**Or build it yourself** from Stability AI's original checkpoint with
`tools/convert_weights.py`, which requires:

- **PyTorch** and the [`stable-fast-3d`](https://github.com/Stability-AI/stable-fast-3d)
  package importable on `PYTHONPATH` (the converter imports `sf3d.system`; point
  it at a checkout with `SF3D_REPO=/path/to/stable-fast-3d`).
- **HuggingFace access** to the gated
  [`stabilityai/stable-fast-3d`](https://huggingface.co/stabilityai/stable-fast-3d)
  model — accept its license and authenticate (`huggingface-cli login`), then:

  ```bash
  python tools/convert_weights.py --output public/weights.bin --dtype fp16
  ```

  Pass `--model-path /local/checkout` to convert from a local copy instead of
  downloading.

Both the hosted weights and the original model are governed by the
[Stability AI Community License](https://huggingface.co/BasinShapers/sf3d-webgpu-weights/blob/main/LICENSE.md)
(free for research, non-commercial, and commercial use under US $1M annual
revenue). **Powered by Stability AI.**

## Production Build

```bash
npm run build
```

Production builds preserve the application and non-model files from `public/`,
but intentionally omit `public/weights.bin` from `dist/`. Deployments must mount
or stage that model file separately at `/weights.bin`; an ordinary local build
must not create another multi-gigabyte copy.

### Library build

`npx vite build -c vite.lib.config.js` builds the producer as a library for a
host that mounts SF3D into its own page: `dist-lib/sf3d-producer.js` (the
producer with the inference kit bundled, no other dependencies), the five
worker chunks under `dist-lib/assets/`, and the tet grid under
`dist-lib/tets/`. URLs are relative to the module, so the host serves the
directory wherever it likes and points `weightsUrl` at its own copy of
`weights.bin` (never bundled).

## Smoke Test

```bash
node tools/smoke_inference.mjs --image public/demo_chair.png
```

Produces `/tmp/sf3d-inference-smoke.glb` and a report at `/tmp/sf3d-inference-smoke-report.txt`. Previous smoke outputs are versioned in `/tmp/sf3d-smokes/` for A/B comparison.

To regenerate the README imagery from a GLB:

```bash
node tools/render_glb_hero.mjs --glb /tmp/sf3d-inference-smoke.glb --out docs/assets/hero-chair.png
node tools/compose_before_after.mjs --input public/demo_chair.png \
  --render docs/assets/hero-chair.png --out docs/assets/hero-before-after.png
```

## Pipeline

| Stage | Module | Runs on |
|-------|--------|---------|
| Image preprocessing | `inference.js` | CPU (Web Worker) |
| Camera embedding | `inference.js` | GPU |
| DINOv2 ViT-Large backbone | `sf3d_backbone.js` | GPU (cooperative duties) |
| Two-stream interleave transformer | `two_stream.js` | GPU (cooperative duties) |
| PixelShuffle post-processor | `post_processor.js` | GPU (cooperative duties, bounded-prefix) |
| Triplane query + MaterialMLP decoder | `triplane_decoder.js` | GPU |
| Marching tetrahedra | `marching_tet.js` | CPU (Web Worker) |
| CLIP material estimate | `clip_estimator.js` | CPU prep (Web Worker) + GPU |
| UV unwrap (PCA + cube projection + BVH overlap) | `texture_baker.js` | CPU (Web Worker) |
| Texture bake (triplane query per texel) | `texture_baker.js` | GPU (cooperative duties) + CPU materialization (Web Worker) |
| GLB export | `texture_baker.js` | CPU |

14 WGSL compute shaders (shared from MOGE port) + 5 inline shaders in `triplane_decoder.js`.

## Kaminos WebGPU Inference Kit

SF3D WebGPU is a model port of the
[Kaminos WebGPU Inference Kit](https://github.com/lyonsno/kaminos/tree/main/webgpu-inference-kit)
([`@kaminos/webgpu-inference-kit`](https://www.npmjs.com/package/@kaminos/webgpu-inference-kit)
on npm) — a shared runtime that gives browser model ports a common session and
device lifecycle, persistent model routes, queued invocations, cooperative
scheduling, and runtime telemetry, while the port keeps ownership of its
weights, kernels, and output construction.

What the kit buys this port:

- **Cooperative execution.** The DINO backbone, two-stream transformer,
  post-processor, and texture bake are decomposed into bounded GPU duties the
  kit can schedule cooperatively, so a live application keeps rendering on the
  same device while a mesh generates.
- **Scheduling-independent output.** The final GLB is byte-identical across the
  monolithic and cooperative scheduling paths (see the
  [deterministic output receipt](#deterministic-output-receipt)).
- **Runtime primitives.** Kit resource caches compile the CLIP estimator's
  inline kernels once per device, and the kit's numerical-parity comparison
  drives the PyTorch parity tooling (`tools/smoke_parity.mjs`).
- **Route identity and receipts.** Inference runs under a registered route ID
  with kit-validated route receipts and staged-submit profiles, so what
  actually executed — backend, stages, kit version — is inspectable rather
  than assumed.

Sibling ports on the same runtime: [MoGe](https://github.com/lyonsno/moge-webgpu)
(depth, normals, and point maps from one image),
[Kimodo](https://github.com/lyonsno/kimodo-webgpu) (browser motion diffusion),
and [SHARP](https://github.com/lyonsno/sharp-webgpu) (long image-to-splat
inference). The kit itself lives in the
[Kaminos](https://github.com/lyonsno/kaminos) browser-native workbench.

## Foreground liveness

The app runs the **product route**: every long GPU stage executes as
cooperative duties through the kit, and the five heavy CPU stages run on Web
Workers (image upload and UV rasterization stay on the main thread), so the
page — and any other WebGPU work sharing the GPU — keeps its frame cadence
while a mesh generates. This is the default in `src/main.js`, composed
in one place by [`src/lib/product_route.js`](src/lib/product_route.js):

| Stage | Mechanism |
|-------|-----------|
| Image preprocessing (foreground framing, bicubic resize, blend, normalize) | Web Worker |
| DINOv2 ViT-Large | 24 cooperative GPU duties (one per block) |
| Two-stream transformer | cooperative attention-tile duties, 256 linear rows per duty (2,922 duties) |
| PixelShuffle post-processor | 702 cooperative channel-range duties, bounded-prefix completion, depth 2 |
| Marching tetrahedra | Web Worker owning the resident tet grid |
| CLIP material estimate | blend / resize / patch-embed on a Web Worker; transformer on GPU with kit-cached pipelines |
| UV unwrap | Web Worker |
| Texture bake | 4,096-texel cooperative GPU duties over a scratch arena; albedo/normal materialization on a Web Worker |

Historical measurements, before the foreground-preparation default changed,
with [`tools/smoke_product_route.mjs`](tools/smoke_product_route.mjs)
on an M4 Max in Chrome (`apple/metal-3`) under a GPU Greenroom lease (no other
GPU tenant), same commit and `demo_chair.png`, requestAnimationFrame intervals
scoped to the inference window. `--contend` adds a same-page WebGPU contender
on a second `GPUDevice` of the same GPU that submits compute work continuously,
so "smooth" means smooth while sharing the GPU. Every row's cooperative reports
pass the kit's report validator with the exact route, manifest and invocation
identity, and the product rows carry the measured duty counts
(24 / 2,922 / 702 / 61):

| Route | Wall | Frame intervals | p95 / p99 | Max gap | > 33.3 ms | Contender submissions |
|-------|------|-----------------|-----------|---------|-----------|-----------------------|
| Single submit, CPU stages on the main thread | 22.6 s | 2,602 | 9.1 / 9.3 ms | 191.6 ms | 5 | — |
| Single submit + contender | 21.0 s | 2,445 | 9.2 / 9.3 ms | 179.3 ms | 4 | 9,503 |
| **Product route (default)** | 40.2 s | 4,789 | 9.1 / 9.3 ms | **40.9 ms** | **1** | — |
| **Product route + contender** | 41.9 s | 4,992 | 9.1 / 9.3 ms | **132.7 ms** | **5** | **83,813** |

The whole-route tail drops from hundreds of milliseconds (image preprocess,
CLIP, UV unwrap, texture bake) to 40.9 ms idle, and a co-tenant sharing the
GPU gets about 4.4× more submissions per second (1,999/s vs 452/s), because
the two-stream stage no longer monopolizes the device between submissions.
With a contender the largest remaining gap (132.7 ms) sits in the CLIP
material estimate, the one GPU stage that still runs as a single submission;
the cooperative stages stay under 60 ms. The cost is wall time: the fine
two-stream duties make the route about 1.8× longer than the single-submit
path. The GLB is byte-identical in every row. Receipts:
[`smoke-receipts/product-route-witness-*_ba2b157.json`](smoke-receipts/).

```bash
npm run smoke:product-route                      # product route, idle page
npm run smoke:product-route -- --contend         # with a same-page WebGPU contender
npm run smoke:product-route -- --arm monolithic  # the single-submit baseline
```

### Composing SF3D into a host route

A host that already owns a `GPUDevice` (the Kaminos kiln, for example) runs
SF3D on that device through [`src/lib/sf3d_producer.js`](src/lib/sf3d_producer.js)
instead of the app. The producer keeps the product route above and adds the
kit's foreground-opportunity interlock so the host's own frames are encoded
between SF3D's GPU duties rather than behind them:

```js
import { createSf3dProducer } from './src/lib/sf3d_producer.js';

const producer = await createSf3dProducer({ device, adapter, weightsUrl: 'weights.bin' });

// Each host frame: submitted before the next SF3D duty encodes.
producer.requestForegroundOpportunity({
  requestId: `frame:${n}`,
  run(ctx) { const enc = ctx.device.createCommandEncoder(); /* host pass */ ctx.submit([enc.finish()]); },
});

const { glb, receipt, cooperativeReports, foregroundOpportunityReport } = await producer.run(image, { runId: 'run-1' });
await producer.dispose().completion; // drains admitted foreground work, then releases producer-owned resources
```

Host frames are serviced at the next cooperative duty boundary; during
SF3D's CPU-only stretches (UV unwrap, GLB export) the producer services them
itself within a frame, and outside a run they execute immediately. Every
receipt says where it was serviced. `npm run smoke:product-route -- --contend-same-device`
witnesses this shape: a host contender on SF3D's own device, one frame per
`requestAnimationFrame`. On the same machine as the table above, the host loop
submitted 3,644 frames across the witness interval of a 41.9 s run and all
3,644 completed: 3,619 during the run (3,161 at duty boundaries, 457 by the
producer's idle drain, 1 at run finish) and 25 before or after it; the page's
largest frame gap was 92.4 ms and the GLB byte-identical. Receipt:
[`smoke-receipts/product-route-witness-product-default-contend-same-device_ba2b157.json`](smoke-receipts/).

### In the live Kaminos flame

The first real host is the [Kaminos](https://github.com/lyonsno/kaminos)
volume renderer: branch `cc/slow-sf3d-live-flame-0916` loads the library
build above through the app's composition-module seam
(`#composition_module_url=./sf3d-live-flame-inject.mjs`) and runs SF3D beside
a live basin flame in one page. That app route does not lend out its
`GPUDevice`, so this composition is the second-device shape: SF3D on its own
device, the flame on the app's, one GPU underneath, both labeled so in the
page's HUD. The HUD carries the page's own frame-cadence witness, the duty
counts, and the GLB hash against the canonical demo-chair hash, and
[`tools/smoke_live_flame_composition.mjs`](tools/smoke_live_flame_composition.mjs)
drives the same page in Chrome and records a flame-only baseline before the
run.

What the first run measured, honestly: the page kept animating throughout,
but the flame's own per-frame GPU work and SF3D's per-duty fences serialize on
one GPU with neither side aware of the other, so the two-stream stage advanced
about ten times slower than standalone (roughly 200 ms per duty against 12 ms)
and the page's worst frame gap reached 316 ms. That is the measurement that
decides the next step: the same-device interlock above once the host lends its
device, or a coarser composition profile of the product route.

## Numerical Match to PyTorch

The comparisons in this section and the deterministic hash below were recorded
before upstream-style foreground preparation became the default. They describe
those source revisions, not a new parity measurement of the current preparation.

Measured against the original PyTorch pipeline on the bundled `demo_chair.png`
(figures from the provenance-bound receipt below):

- Raw mesh vertex count: 9988 vs 10014 (99.7%)
- SDF max: 28.34 vs 28.58
- Density field cosine similarity 0.99876 (per-stage table below)
- Textured output matches the PyTorch reference render under side-by-side visual inspection
- Remaining gap is fp16 precision + Lanczos resize interpolation difference

Per-stage, provenance-bound comparison (`npm run smoke:parity` against a
reference generated by `tools/dump_parity_reference.py`, whose `manifest.json`
binds the input image hash, the SF3D source revision, the model snapshot and
weight hash, and every artifact hash; the harness refuses an unbound
directory). On `demo_chair.png`, WebGPU fp16 weights vs PyTorch MPS fp16,
model snapshot `f0c9a8ff…`:

| Stage | Elements | Cosine similarity | Relative L2 | Max abs error |
|-------|----------|-------------------|-------------|---------------|
| Camera embedding | 768 | 0.99999992 | 3.9e-4 | 1.5e-4 |
| Grid positions | 1,607,646 | 1.00000000 | 6.2e-8 | 6.0e-8 |
| Density | 535,882 | 0.99876 | 5.0e-2 | 3.86 |
| Vertex offsets | 1,607,646 | 0.98243 | 1.9e-1 | 0.57 |

Scene codes are compared by range and mean only (channel/spatial layout
differs). The reference side is bound to the PyTorch checkpoint
(`model.safetensors`, SHA-256 `a3416e1c…`); the WebGPU side records the
converted `weights.bin` it ran (`0e5c23c8…`), which `tools/convert_weights.py`
derives from that checkpoint, but the report does not itself prove that
derivation. A report is evidentiary only when the reference provenance
verified and every required stage compared on both sides; the receipt
records that admission. Receipt:
[`smoke-receipts/parity-report_41af338.json`](smoke-receipts/).

### Deterministic output receipt

The recorded pre-framing-default route produces a **bit-for-bit reproducible**
GLB for `demo_chair.png`:

```
SHA-256(demo_chair GLB) = e1f70de3407df24d571bf68f70fac2b59373bdd948075a2387f1834e4faff8b7
9988 vertices · 19976 faces · about 40 s end-to-end (M4 Max, product route)
```

The same hash is emitted by both scheduling paths (monolithic and
arena-plus-worker) across the A/B/C/D product harness — the output is
independent of GPU-duty scheduling. The cooperative post-processor also passes
[`@kaminos/webgpu-inference-kit`](https://github.com/lyonsno/kaminos/tree/main/webgpu-inference-kit)'s
`validateWebGpuCooperativeExecutionReport` against the exact 702-duty
bounded-prefix contract. Receipts are versioned under
[`smoke-receipts/`](smoke-receipts/).

## Architecture

```
src/
  lib/
    inference.js          Pipeline orchestration, preprocessing, camera embed
    sf3d_backbone.js      DINOv2 ViT-Large with AdaNorm modulation
    two_stream.js         TwoStreamInterleaveTransformer backbone
    post_processor.js     PixelShuffle post-processor
    triplane_decoder.js   Triplane query + MaterialMLP decoder
    marching_tet.js       CPU marching tetrahedra mesh extraction
    texture_baker.js      UV unwrap, rasterize, bake albedo+normal, GLB export
    weights.js            Weight file loader with tensor name mapping
    product_route.js      Product default composition (cooperative duties + workers)
    full_pipeline.js      The complete route as one callable (app + harnesses)
    clip_prep_core.js     CLIP CPU prep (pure); clip_prep_worker.js runs it
    marching_tet_worker.js  Marching tetrahedra on a worker owning the tet grid
    preprocess_worker.js / uv_unwrap_worker.js / materialize_worker.js  CPU offloads
    gpu.js                WebGPU initialization + buffer helpers
    shader_ops.js         Shared shader dispatch helpers
  main.js                 Browser UI wiring
  shaders/                WGSL compute shaders
tools/
  convert_weights.py      PyTorch -> flat binary fp16 weight converter
  smoke_inference.mjs     Puppeteer-driven browser smoke test
  smoke_product_route.mjs   Foreground-liveness witness (rAF probe, contender, receipts)
  smoke_parity.mjs        Per-stage PyTorch parity via the kit's parity primitives
  render_glb_hero.mjs     Render a GLB to a hero still (model-viewer)
  compose_before_after.mjs  Compose input-photo / generated-mesh banner
  compare_density.py      PyTorch reference density comparison
  evidence/               Durable smoke artifacts
public/
  tets/                   Marching tetrahedra grid data
  demo_chair.png          Demo input image
```

## UV Unwrap Pipeline

The texture baker implements SF3D's cube-projection UV unwrapper with:

1. **PCA alignment** — rotates vertex positions so principal axes align with canonical X/Y/Z (Jacobi eigendecomposition, matching PyTorch `_align_mesh_with_main_axis`)
2. **Cube projection** — assigns faces to 6 cube faces by normal direction, projects matching PyTorch axis conventions
3. **Tangent-aligned UV rotation** — rotates UVs per cube face to align with canonical tangent direction (matching PyTorch `_rotate_uv_slices_consistent_space`)
4. **BVH overlap detection** — triangle-triangle intersection via Sutherland-Hodgman polygon clipping with area threshold, replacing initial grid-based approach
5. **Three-tier atlas packing** — primary (3x2 grid), secondary (3x2 half-size), remaining (per-face sub-cells)
6. **Conditional sub-texel coverage** — fills unoccupied texels for sub-texel faces without overwriting correctly-rasterized data

## Development History

| Session | Date | Key deliverables |
|---------|------|-----------------|
| 1 | 2026-06-27 | MPS bring-up, initial scaffold, DINOv2+backbone dispatch, weight converter |
| 2 | 2026-06-28 | End-to-end pipeline, 6 bug fixes, coherent mesh, first full visual validation |
| 3 | 2026-06-29 | Texture baking, normal maps, smooth normals, GLB export, 2 reviews |
| 4 | 2026-06-30 | UV atlas splitting: bbox normalization, overlap detection, sub-texel fixes |
| 5 | 2026-07-01 | Tangent UV rotation, PyTorch-matching axes, PCA alignment, BVH overlap detection, visual parity |
| 6–11 | 2026-07 | Cooperative WebGPU execution: DINO/two-stream/post-processor duty decomposition, scratch-arena + worker offload, bounded-prefix scheduling, `@kaminos/webgpu-inference-kit` conformance, byte-identical output across scheduling paths |
| 12 | 2026-09-15 | Kit 0.1.48; product route composed by default (every cooperative boundary + five workers); two-stream submit-contract fix; CLIP-prep and marching-tet workers; four-arm liveness witness with same-page contender; kit parity primitives in the parity tooling |

## License

This is a port of [Stability AI's Stable Fast 3D](https://github.com/Stability-AI/stable-fast-3d) for research and educational purposes. See the original repository for license terms.

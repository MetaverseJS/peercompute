/**
 * triplane_decoder.js — Triplane query and MaterialMLP decoder for SF3D.
 *
 * Triplane query (from system.py query_triplane):
 *   For each 3D point [x, y, z]:
 *     - Project onto XY plane → sample features[0] at (x, y) → [40]
 *     - Project onto XZ plane → sample features[1] at (x, z) → [40]
 *     - Project onto YZ plane → sample features[2] at (y, z) → [40]
 *     - Concatenate → [120]
 *
 * MaterialMLP decoder (from network.py MaterialMLP):
 *   in_channels: 120, n_neurons: 64, activation: silu
 *   Heads:
 *     density:        Linear(120→64)+SiLU, Linear(64→64)+SiLU, Linear(64→1)  + bias(-1) + trunc_exp
 *     features:       Linear(120→64)+SiLU, Linear(64→64)+SiLU, Linear(64→64)+SiLU, Linear(64→3) + sigmoid
 *     perturb_normal: Linear(120→64)+SiLU, Linear(64→64)+SiLU, Linear(64→64)+SiLU, Linear(64→3) + normalize
 *     vertex_offset:  Linear(120→64)+SiLU, Linear(64→64)+SiLU, Linear(64→3)
 */

import { createStorageBuffer, createEmptyBuffer, readBuffer, createUniformBuffer } from './gpu.js';

import linearWGSL from '../shaders/linear.wgsl?raw';
import gridSampleWGSL from '../shaders/grid_sample.wgsl?raw';
import activationsWGSL from '../shaders/activations.wgsl?raw';

const WG_SIZE = 256;
const MAX_WG = 65535;
function splitWG(total) {
  if (total <= MAX_WG) return [total, 1];
  return [MAX_WG, Math.ceil(total / MAX_WG)];
}
function ceilDiv(a, b) { return Math.ceil(a / b); }

const DECODER_CONFIG = {
  inChannels: 120,   // 3 planes × 40 features
  nNeurons: 64,
  planeChannels: 40,
  radius: 0.87,
  isosurfaceThreshold: 10.0,
};

export class TriplaneDecoder {
  constructor(device) {
    this.device = device;
    this.pipelines = {};
    this._uniformCache = new Map();
    // Optional scratch-slot provider. When set (during an arena-backed decode),
    // _alloc(slotKey, size) returns a reusable pre-allocated buffer bound to that
    // stable slot key instead of allocating a fresh transient buffer. Default
    // null → createEmptyBuffer (unchanged behavior). Slot keys are deterministic
    // per decode call site (+ plane/head/layer index), which is exactly the
    // reusable slot graph the arena is proven against.
    this._slotProvider = null;
  }

  /**
   * Allocate (or reuse) a scratch buffer for a decode dispatch.
   * @param {string} slotKey  stable slot identity (arena binding key)
   * @param {number} size     byte size needed for this range's N
   */
  _alloc(slotKey, size) {
    if (this._slotProvider) return this._slotProvider.acquire(slotKey, size);
    // Pass the slot key as the buffer label so allocation capture records slot
    // identity (the arena binding key), not just the byte size.
    return createEmptyBuffer(this.device, size, 0, slotKey);
  }

  init() {
    const device = this.device;
    const make = (code, entry) => device.createComputePipeline({
      layout: 'auto',
      compute: { module: device.createShaderModule({ code }), entryPoint: entry },
    });

    this.pipelines.gridSample = make(gridSampleWGSL, 'grid_sample_main');
    this.pipelines.linear = make(linearWGSL, 'main');
    this.pipelines.activation = make(activationsWGSL, 'activation_main');

    // Concat 3 sampled planes: [N, 40] × 3 → [N, 120]
    this.pipelines.concatPlanes = make(`
      struct P { N: u32, C: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> plane0: array<f32>;
      @group(0) @binding(2) var<storage, read> plane1: array<f32>;
      @group(0) @binding(3) var<storage, read> plane2: array<f32>;
      @group(0) @binding(4) var<storage, read_write> output: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        let total = p.N * p.C * 3u;
        if (idx >= total) { return; }
        let n = idx / (p.C * 3u);
        let rem = idx % (p.C * 3u);
        let planeIdx = rem / p.C;
        let c = rem % p.C;
        let srcIdx = n * p.C + c;
        switch planeIdx {
          case 0u: { output[idx] = plane0[srcIdx]; }
          case 1u: { output[idx] = plane1[srcIdx]; }
          case 2u: { output[idx] = plane2[srcIdx]; }
          default: {}
        }
      }
    `, 'main');

    // trunc_exp: output = exp(input)
    // normalize_channel_last: output[n, :] = input[n, :] / ||input[n, :]||
    // These are small enough to use inline shaders
    this.pipelines.truncExp = make(`
      struct P { count: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> input: array<f32>;
      @group(0) @binding(2) var<storage, read_write> output: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.count) { return; }
        output[idx] = exp(input[idx]);
      }
    `, 'main');

    this.pipelines.sigmoid = make(`
      struct P { count: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> input: array<f32>;
      @group(0) @binding(2) var<storage, read_write> output: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.count) { return; }
        output[idx] = 1.0 / (1.0 + exp(-input[idx]));
      }
    `, 'main');

    this.pipelines.normalize3 = make(`
      struct P { N: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> input: array<f32>;
      @group(0) @binding(2) var<storage, read_write> output: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.N) { return; }
        let base = idx * 3u;
        let x = input[base]; let y = input[base + 1]; let z = input[base + 2];
        let len = sqrt(x*x + y*y + z*z) + 1e-8;
        output[base] = x / len;
        output[base + 1] = y / len;
        output[base + 2] = z / len;
      }
    `, 'main');

    // Add bias (scalar broadcast to all elements)
    this.pipelines.addBias = make(`
      struct P { count: u32, bias: f32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read_write> data: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.count) { return; }
        data[idx] = data[idx] + p.bias;
      }
    `, 'main');
  }

  _cachedUniform(data) {
    const bytes = new Uint8Array(data.buffer || data);
    let h = 0;
    for (let i = 0; i < bytes.length; i++) h = (h * 31 + bytes[i]) | 0;
    const key = `td_${bytes.length}_${h}`;
    if (this._uniformCache.has(key)) return this._uniformCache.get(key);
    // Resident queries own the entire cache until the awaited consumer ends.
    // Default cooperative bake captures and retires range scratch, not its
    // persistent cached uniforms; preserve that lifetime contract.
    let buf;
    if (this._residentQueryWorkOwner) {
      buf = createUniformBuffer(this.device, bytes, key);
    } else {
      buf = this.device.createBuffer({
        size: Math.max(bytes.byteLength, 16),
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
      });
      new Uint8Array(buf.getMappedRange()).set(bytes);
      buf.unmap();
    }
    this._uniformCache.set(key, buf);
    return buf;
  }

  /**
   * Query triplane features at 3D positions and decode with MaterialMLP.
   *
   * @param {GPUCommandEncoder} encoder
   * @param {GPUBuffer} positionsBuf - [N, 3] query positions in model space
   * @param {GPUBuffer} triplanesBuf - [3, 40, 384, 384] from post-processor
   * @param {number} N - number of query points
   * @param {Object} weights - decoder weights
   * @param {string[]} heads - which heads to run (default: all)
   * @returns {Object} - { density, features, perturb_normal, vertex_offset } buffers
   */
  decode(encoder, positionsBuf, triplanesBuf, N, weights, heads) {
    const device = this.device;
    const C = DECODER_CONFIG.planeChannels; // 40
    const H = 384, W = 384;
    const radius = DECODER_CONFIG.radius;

    // 1. Scale positions from model space to [-1, 1] for grid_sample
    //    PyTorch: scale_tensor(positions, (-radius, radius), (-1, 1))
    //    → pos_norm = pos / radius
    const scaledPosBuf = this._dispatchScalePositions(encoder, positionsBuf, N, radius, 'scaledPos');

    // 2. Create grid coordinates for each plane
    //    XY plane: (x, y), XZ plane: (x, z), YZ plane: (y, z)
    const gridXY = this._dispatchExtractGrid(encoder, scaledPosBuf, N, 0, 1, 'grid:XY'); // x, y
    const gridXZ = this._dispatchExtractGrid(encoder, scaledPosBuf, N, 0, 2, 'grid:XZ'); // x, z
    const gridYZ = this._dispatchExtractGrid(encoder, scaledPosBuf, N, 1, 2, 'grid:YZ'); // y, z

    // 3. Grid sample each plane
    const planeSize = C * H * W * 4; // bytes per plane
    const sampledXY = this._dispatchGridSample(encoder, triplanesBuf, 0, gridXY, C, H, W, N, 'sampled:XY');
    const sampledXZ = this._dispatchGridSample(encoder, triplanesBuf, planeSize, gridXZ, C, H, W, N, 'sampled:XZ');
    const sampledYZ = this._dispatchGridSample(encoder, triplanesBuf, planeSize * 2, gridYZ, C, H, W, N, 'sampled:YZ');

    // 4. Concatenate: [N, 40] × 3 → [N, 120]
    const featuresBuf = this._dispatchConcatPlanes(encoder, sampledXY, sampledXZ, sampledYZ, N, C, 'concatFeatures');

    // 5. Run MLP heads
    const results = {};
    const headsToRun = heads || ['density', 'features', 'perturb_normal', 'vertex_offset'];

    for (const headName of headsToRun) {
      const headLayers = weights.heads[headName];
      results[headName] = this._dispatchMLPHead(encoder, featuresBuf, headLayers, N, headName);
    }

    return results;
  }

  // --- Scale positions: pos / radius ---
  _dispatchScalePositions(encoder, posBuf, N, radius, slotKey = 'scaledPos') {
    if (!this.pipelines.scalePos) {
      this.pipelines.scalePos = this.device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: this.device.createShaderModule({
            code: `
              struct P { count: u32, invRadius: f32, numWgX: u32 }
              @group(0) @binding(0) var<uniform> p: P;
              @group(0) @binding(1) var<storage, read> input: array<f32>;
              @group(0) @binding(2) var<storage, read_write> output: array<f32>;
              @compute @workgroup_size(256)
              fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
                let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
                if (idx >= p.count) { return; }
                output[idx] = input[idx] * p.invRadius;
              }
            `,
          }),
          entryPoint: 'main',
        },
      });
    }

    const count = N * 3;
    const totalWG = ceilDiv(count, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const paramsData = new ArrayBuffer(12);
    const u32 = new Uint32Array(paramsData);
    const f32 = new Float32Array(paramsData);
    u32[0] = count; f32[1] = 1.0 / radius; u32[2] = wgX;
    const params = this._cachedUniform(new Uint8Array(paramsData));

    const outBuf = this._alloc(slotKey, count * 4);
    const bg = this.device.createBindGroup({
      layout: this.pipelines.scalePos.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: posBuf } },
        { binding: 2, resource: { buffer: outBuf } },
      ],
    });
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.scalePos);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
    return outBuf;
  }

  // --- Extract 2D grid from 3D positions ---
  _dispatchExtractGrid(encoder, posBuf, N, dim0, dim1, slotKey = 'grid') {
    if (!this.pipelines.extractGrid) {
      this.pipelines.extractGrid = this.device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: this.device.createShaderModule({
            code: `
              struct P { N: u32, dim0: u32, dim1: u32, numWgX: u32 }
              @group(0) @binding(0) var<uniform> p: P;
              @group(0) @binding(1) var<storage, read> positions: array<f32>;
              @group(0) @binding(2) var<storage, read_write> grid: array<f32>;
              @compute @workgroup_size(256)
              fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
                let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
                if (idx >= p.N) { return; }
                grid[idx * 2] = positions[idx * 3 + p.dim0];
                grid[idx * 2 + 1] = positions[idx * 3 + p.dim1];
              }
            `,
          }),
          entryPoint: 'main',
        },
      });
    }

    const totalWG = ceilDiv(N, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([N, dim0, dim1, wgX]));
    const gridBuf = this._alloc(slotKey, N * 2 * 4);

    const bg = this.device.createBindGroup({
      layout: this.pipelines.extractGrid.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: posBuf } },
        { binding: 2, resource: { buffer: gridBuf } },
      ],
    });
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.extractGrid);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
    return gridBuf;
  }

  // --- Grid sample from one triplane plane ---
  _dispatchGridSample(encoder, triplanesBuf, planeOffsetBytes, gridBuf, C, H, W, N, slotKey = 'sampled') {
    const totalWG = ceilDiv(N * C, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([C, H, W, N, wgX]));

    const outBuf = this._alloc(slotKey, N * C * 4);
    const bg = this.device.createBindGroup({
      layout: this.pipelines.gridSample.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: triplanesBuf, offset: planeOffsetBytes, size: C * H * W * 4 } },
        { binding: 2, resource: { buffer: gridBuf } },
        { binding: 3, resource: { buffer: outBuf } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.gridSample);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
    return outBuf;
  }

  // --- Concat 3 planes → [N, 120] ---
  _dispatchConcatPlanes(encoder, plane0, plane1, plane2, N, C, slotKey = 'concatFeatures') {
    const total = N * C * 3;
    const totalWG = ceilDiv(total, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([N, C, wgX]));

    const outBuf = this._alloc(slotKey, total * 4);
    const bg = this.device.createBindGroup({
      layout: this.pipelines.concatPlanes.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: plane0 } },
        { binding: 2, resource: { buffer: plane1 } },
        { binding: 3, resource: { buffer: plane2 } },
        { binding: 4, resource: { buffer: outBuf } },
      ],
    });
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.concatPlanes);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
    return outBuf;
  }

  // --- Run one MLP head ---
  _dispatchMLPHead(encoder, inputBuf, headLayers, N, headName) {
    const { inChannels, nNeurons } = DECODER_CONFIG;

    // Head architecture: headLayers is an array of { weight, bias } from the weight loader.
    // All hidden layers output nNeurons (64), final layer outputs head-specific channels.
    const HEAD_OUT_CHANNELS = { density: 1, features: 3, perturb_normal: 3, vertex_offset: 3 };
    const outChannels = HEAD_OUT_CHANNELS[headName];

    let current = inputBuf;
    let currentDim = inChannels;

    // Hidden layers: Linear + SiLU (all but the last layer). Slot keys are
    // stable per head+layer so the arena reuses the same physical buffer for the
    // same layer across ranges.
    const hk = `head:${headName}`;
    for (let i = 0; i < headLayers.length - 1; i++) {
      const layer = headLayers[i];
      const outBuf = this._alloc(`${hk}:lin:${i}`, N * nNeurons * 4);
      this._dispatchLinear(encoder, current, outBuf, layer.weight, layer.bias, N, currentDim, nNeurons);

      // SiLU activation
      const siluBuf = this._dispatchSiLU(encoder, outBuf, N * nNeurons, `${hk}:silu:${i}`);
      current = siluBuf;
      currentDim = nNeurons;
    }

    // Final layer: Linear (no activation yet)
    const lastLayer = headLayers[headLayers.length - 1];
    const rawOutBuf = this._alloc(`${hk}:rawOut`, N * outChannels * 4);
    this._dispatchLinear(encoder, current, rawOutBuf, lastLayer.weight, lastLayer.bias, N, currentDim, outChannels);

    // Apply output bias and activation
    let resultBuf = rawOutBuf;

    if (headName === 'density') {
      // bias(-1.0) then trunc_exp
      this._dispatchAddBias(encoder, resultBuf, N * outChannels, -1.0);
      const expBuf = this._dispatchTruncExp(encoder, resultBuf, N * outChannels, `${hk}:truncExp`);
      resultBuf = expBuf;
    } else if (headName === 'features') {
      // sigmoid
      resultBuf = this._dispatchSigmoid(encoder, resultBuf, N * outChannels, `${hk}:sigmoid`);
    } else if (headName === 'perturb_normal') {
      // normalize per-vector (3 components)
      resultBuf = this._dispatchNormalize3(encoder, resultBuf, N, `${hk}:normalize3`);
    }
    // vertex_offset: no output activation

    return resultBuf;
  }

  // --- Low-level dispatchers ---

  _dispatchLinear(encoder, input, output, weight, bias, rows, inDim, outDim) {
    const totalWG = ceilDiv(rows * outDim, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([rows, inDim, outDim, wgX, 1]));
    const bg = this.device.createBindGroup({
      layout: this.pipelines.linear.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: input } },
        { binding: 2, resource: { buffer: weight } },
        { binding: 3, resource: { buffer: bias } },
        { binding: 4, resource: { buffer: output } },
      ],
    });
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.linear);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }

  _dispatchSiLU(encoder, inputBuf, count, slotKey = 'silu') {
    const totalWG = ceilDiv(count, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([count, 1, wgX])); // op=1 = SiLU
    const dummyBuf = this._alloc(slotKey + ':dummy', 4);
    const outBuf = this._alloc(slotKey, count * 4);
    const bg = this.device.createBindGroup({
      layout: this.pipelines.activation.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: inputBuf } },
        { binding: 2, resource: { buffer: dummyBuf } },
        { binding: 3, resource: { buffer: outBuf } },
      ],
    });
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.activation);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
    return outBuf;
  }

  _dispatchTruncExp(encoder, inputBuf, count, slotKey = 'truncExp') {
    const totalWG = ceilDiv(count, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([count, wgX]));
    const outBuf = this._alloc(slotKey, count * 4);
    const bg = this.device.createBindGroup({
      layout: this.pipelines.truncExp.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: inputBuf } },
        { binding: 2, resource: { buffer: outBuf } },
      ],
    });
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.truncExp);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
    return outBuf;
  }

  _dispatchSigmoid(encoder, inputBuf, count, slotKey = 'sigmoid') {
    const totalWG = ceilDiv(count, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([count, wgX]));
    const outBuf = this._alloc(slotKey, count * 4);
    const bg = this.device.createBindGroup({
      layout: this.pipelines.sigmoid.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: inputBuf } },
        { binding: 2, resource: { buffer: outBuf } },
      ],
    });
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.sigmoid);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
    return outBuf;
  }

  _dispatchNormalize3(encoder, inputBuf, N, slotKey = 'normalize3') {
    const totalWG = ceilDiv(N, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([N, wgX]));
    const outBuf = this._alloc(slotKey, N * 3 * 4);
    const bg = this.device.createBindGroup({
      layout: this.pipelines.normalize3.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: inputBuf } },
        { binding: 2, resource: { buffer: outBuf } },
      ],
    });
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.normalize3);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
    return outBuf;
  }

  _dispatchAddBias(encoder, buf, count, bias) {
    const totalWG = ceilDiv(count, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const paramsData = new ArrayBuffer(12);
    const u32 = new Uint32Array(paramsData);
    const f32 = new Float32Array(paramsData);
    u32[0] = count; f32[1] = bias; u32[2] = wgX;
    const params = this._cachedUniform(new Uint8Array(paramsData));
    const bg = this.device.createBindGroup({
      layout: this.pipelines.addBias.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: buf } },
      ],
    });
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.addBias);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }
}

export { DECODER_CONFIG };

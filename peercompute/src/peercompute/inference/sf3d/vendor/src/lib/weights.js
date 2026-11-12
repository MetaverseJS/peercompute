/**
 * weights.js — Load SF3D weights from flat binary format.
 *
 * Binary format (from convert_weights.py):
 *   Header: 4 (magic) + 4 (version) + 4 (num_tensors) + 4 (header_size) = 16 bytes
 *   Tensor table: num_tensors × 160 bytes each
 *     128 bytes: name (null-padded ASCII)
 *     4 bytes: dtype (0=fp32, 1=fp16)
 *     4 bytes: ndim
 *     16 bytes: shape (4 x u32)
 *     4 bytes: offset
 *     4 bytes: size
 *   Weight data: packed tensors
 */

import { createStorageBuffer,createMappedStorageBuffer,createEmptyBuffer } from './gpu.js';
import { isLoaderMemoryBudget } from './loader_memory_budget.js';
import { createFlatTensorRangeSource } from './flat_tensor_ranges.js';

const MAGIC = 0x33445346; // "SF3D" in little-endian
const ENTRY_SIZE = 160;

function parseHeader(buffer) {
  const view = new DataView(buffer);
  const magic = view.getUint32(0, true);
  if (magic !== MAGIC) {
    throw new Error(`Invalid weight file magic: 0x${magic.toString(16)} (expected 0x${MAGIC.toString(16)})`);
  }
  const version = view.getUint32(4, true);
  if (version !== 1) throw new Error(`Unsupported weight file version: ${version}`);

  const numTensors = view.getUint32(8, true);
  const headerSize = view.getUint32(12, true);

  const tensors = new Map();
  for (let i = 0; i < numTensors; i++) {
    const off = 16 + i * ENTRY_SIZE;
    const nameBytes = new Uint8Array(buffer, off, 128);
    let nameEnd = nameBytes.indexOf(0);
    if (nameEnd === -1) nameEnd = 128;
    const name = new TextDecoder().decode(nameBytes.slice(0, nameEnd));

    const dtype = view.getUint32(off + 128, true);
    const ndim = view.getUint32(off + 132, true);
    const shape = [];
    for (let d = 0; d < ndim; d++) {
      shape.push(view.getUint32(off + 136 + d * 4, true));
    }
    const dataOffset = view.getUint32(off + 152, true);
    const size = view.getUint32(off + 156, true);
    tensors.set(name, { dtype, shape, offset: dataOffset + headerSize, size });
  }

  return { tensors, headerSize };
}

function fp16ToFp32(h) {
  const sign = (h >> 15) & 1;
  const exp = (h >> 10) & 0x1f;
  const mant = h & 0x3ff;
  if (exp === 0) {
    if (mant === 0) return sign ? -0.0 : 0.0;
    let val = mant / 1024.0 * Math.pow(2, -14);
    return sign ? -val : val;
  }
  if (exp === 31) return mant === 0 ? (sign ? -Infinity : Infinity) : NaN;
  const val = Math.pow(2, exp - 15) * (1 + mant / 1024.0);
  return sign ? -val : val;
}

function allocateCpu(context, size, label, make, leases = context?.ownedCpu) {
  const lease = context?.budget.reserveCpu(size, label);
  try { const value = make(); if (lease) leases.add(lease); return value; }
  catch (error) { lease?.release(); throw error; }
}

function cpuScope(context, work) {
  const temporary = new Set();
  try { return work(context ? {...context, temporary} : null); }
  finally { for (const lease of temporary) lease.release(); }
}

function retireOwnedBuffers(buffers) {
  const errors=[];
  for(const buffer of buffers) {
    try { buffer.destroy(); buffers.delete(buffer); }
    catch(error) { errors.push(error); }
  }
  return errors;
}

function extractTensor(device, buffer, info, context) {
  return cpuScope(context, scoped => {
  const { dtype, offset, size } = info;
  const raw = extractBytes(buffer, offset, size, scoped);
  if (dtype === 0) {
    // fp32 — raw bytes are already float32
    const fp32 = new Float32Array(raw.buffer, raw.byteOffset, size / 4);
    return createStorageBuffer(device, fp32);
  } else {
    const fp16 = new Uint16Array(raw.buffer, raw.byteOffset, size / 2);
    // Keep the existing conversion/mapped-upload allowance and fresh physical
    // guards, but initialize the actual mapped GPU destination directly.
    // Do not materialize another full FP32 CPU array merely to copy it here.
    const lease=scoped?.budget.reserveCpu(fp16.length*4,'fp16-conversion');
    if(lease)scoped.temporary.add(lease);
    return createMappedStorageBuffer(device,fp16.length*4,mapped=>{
      const fp32=new Float32Array(mapped);
      for(let i=0;i<fp16.length;i++)fp32[i]=fp16ToFp32(fp16[i]);
    },{ownedBuffers:scoped?.ownedBuffers??null});
  }
  });
}

function extractTensorCPU(buffer, info, context) {
  return cpuScope(context, scoped => {
  const { dtype, offset, size } = info;
  const raw = extractBytes(buffer, offset, size, scoped);
  if (dtype === 0) {
    const fp32 = new Float32Array(raw.buffer, raw.byteOffset, size / 4);
    return allocateCpu(scoped, size, 'cpu-tensor-copy', () => new Float32Array(fp32));
  }
  const fp16 = new Uint16Array(raw.buffer, raw.byteOffset, size / 2);
  const fp32 = allocateCpu(scoped, fp16.length * 4, 'cpu-fp16-conversion', () => new Float32Array(fp16.length));
  for (let i = 0; i < fp16.length; i++) fp32[i] = fp16ToFp32(fp16[i]);
  return fp32;
  });
}

/**
 * Extract a byte range from the chunked buffer.
 * Returns a Uint8Array view if the range falls within a single chunk,
 * otherwise copies into a new buffer (only for tensors that span chunk boundaries).
 */
/** Families read lazily through the raw accessors after load (CLIP estimator, CPU heads). */
export const LAZILY_READ_TENSOR_PREFIXES = Object.freeze(['image_estimator.']);

/**
 * After the eager builders have uploaded their tensors, copy out only the
 * tensors that will still be read lazily (retainPrefixes) or were never
 * consumed, then release the streamed chunks so ~2 GB of JS heap can go.
 * Returns { retained: Map<name, Uint8Array copy>, rawBytes(name), retainedBytes, droppedBytes }.
 */
export function compactRetainedTensors(tensors, chunkedBuffer, consumed, retainPrefixes = LAZILY_READ_TENSOR_PREFIXES, context = null) {
  const retained = new Map();
  let disposed = false;
  let retainedBytes = 0;
  let droppedBytes = 0;
  for (const [name, info] of tensors) {
    const keep = !consumed.has(name) || retainPrefixes.some(prefix => name.startsWith(prefix));
    if (keep) {
      retained.set(name, cpuScope(context, scoped => {
        const raw = extractBytes(chunkedBuffer, info.offset, info.size, scoped);
        return allocateCpu(scoped, info.size, 'retained-raw-copy', () => raw.slice());
      }));
      retainedBytes += info.size;
    } else {
      droppedBytes += info.size;
    }
  }
  if (Array.isArray(chunkedBuffer?.chunks)) { chunkedBuffer.chunks.length = 0; chunkedBuffer.offsets.length = 0; }
  const rawBytes = (name) => {
    if (disposed) throw new Error('SF3D weights are disposed');
    const bytes = retained.get(name);
    if (!bytes) {
      throw new Error(tensors.has(name)
        ? `tensor ${name} was uploaded at load and its raw bytes were released; lazy raw access covers ${retainPrefixes.join(', ')}`
        : `Missing weight: ${name}`);
    }
    return bytes;
  };
  return {
    retained, rawBytes, retainedBytes, droppedBytes,
    dispose() { disposed = true; retained.clear(); },
  };
}

export function extractBytesFromChunks(chunkedBuffer, offset, size) { return extractBytes(chunkedBuffer, offset, size); }

function extractBytes(chunkedBuffer, offset, size, context = null) {
  if (chunkedBuffer instanceof ArrayBuffer) {
    // Legacy single-buffer path
    return new Uint8Array(chunkedBuffer, offset, size);
  }
  // chunkedBuffer is { chunks, offsets, totalSize }
  const { chunks, offsets } = chunkedBuffer;
  const end = offset + size;

  // Find the first chunk that contains the start
  let startChunk = -1;
  for (let i = 0; i < offsets.length; i++) {
    if (offsets[i] + chunks[i].length > offset) { startChunk = i; break; }
  }
  if (startChunk === -1) {
    throw new Error(`Weight data offset ${offset} (size ${size}) is beyond end of file (${chunkedBuffer.totalSize} bytes)`);
  }

  const localOffset = offset - offsets[startChunk];
  // Check if entirely within this chunk
  if (localOffset + size <= chunks[startChunk].length) {
    // Ensure 4-byte alignment for typed array views (Float32Array, Uint16Array)
    const chunkBaseOffset = chunks[startChunk].byteOffset + localOffset;
    if (chunkBaseOffset % 4 !== 0) {
      const copy = allocateCpu(context, size, 'aligned-tensor-copy', () => new Uint8Array(size), context?.temporary);
      copy.set(chunks[startChunk].subarray(localOffset, localOffset + size));
      return copy;
    }
    return chunks[startChunk].subarray(localOffset, localOffset + size);
  }

  // Spans multiple chunks — copy into aligned buffer
  const result = allocateCpu(context, size, 'cross-chunk-tensor-copy', () => new Uint8Array(size), context?.temporary);
  let written = 0;
  for (let i = startChunk; i < chunks.length && written < size; i++) {
    const chunkStart = Math.max(0, offset + written - offsets[i]);
    const avail = chunks[i].length - chunkStart;
    const take = Math.min(avail, size - written);
    result.set(chunks[i].subarray(chunkStart, chunkStart + take), written);
    written += take;
  }
  return result;
}

/**
 * Load SF3D weights and organize into component structure.
 */
export async function loadWeights() { throw new Error('PeerCompute requires artifact-backed SF3D weights'); }

/** PeerCompute integration: use the unchanged component builders and FP16
 * conversion with an authenticated bounded artifact source. Eager operands
 * stream directly into their GPU destinations; only lazy CLIP/CPU operands
 * retain raw bytes. No whole checkpoint backing or remote fetch is needed. */
export async function loadWeightsFromSource(device, source) {
  const ownedBuffers = new Set(), retained = new Map(), buffers = new Map();
  let disposed = false, retainedBytes = 0, droppedBytes = 0;
  const compact = {
    retained,
    get retainedBytes() { return retainedBytes; },
    get droppedBytes() { return droppedBytes; },
    rawBytes(name) {
      if (disposed || !retained.has(name)) throw new Error('SF3D raw tensor is unavailable: ' + name);
      return retained.get(name);
    },
    dispose() { disposed = true; retained.clear(); },
  };
  try {
    const consumed = buildWeightSet(device, null, source.tensors, new Set(), null, { dryRun: true });
    for (const [name, info] of source.tensors) {
      const keep = !consumed.has(name) || LAZILY_READ_TENSOR_PREFIXES.some(prefix => name.startsWith(prefix));
      if (keep) { retained.set(name, await source.readTensor(name)); retainedBytes += info.size; }
      else droppedBytes += info.size;
      if (!consumed.has(name)) continue;
      const size = info.dtype === 1 ? info.size * 2 : info.size;
      if (size > device.limits.maxBufferSize || size > device.limits.maxStorageBufferBindingSize) {
        throw new Error('SF3D tensor exceeds device buffer limits: ' + name);
      }
      const buffer = createEmptyBuffer(device, size, 0, 'sf3d-weight:' + name);
      ownedBuffers.add(buffer); buffers.set(name, buffer);
      await source.consumeTensor(name, async (bytes, offset) => {
        if (info.dtype === 0) device.queue.writeBuffer(buffer, offset, bytes);
        else {
          const values = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
          const expanded = new Float32Array(bytes.byteLength / 2);
          for (let i = 0; i < expanded.length; i++) expanded[i] = fp16ToFp32(values.getUint16(i * 2, true));
          device.queue.writeBuffer(buffer, offset * 2, expanded);
        }
        await device.queue.onSubmittedWorkDone();
      });
    }
    return buildWeightSet(device, null, source.tensors, ownedBuffers, null,
      { buffers, compact, report: source.report });
  } catch (error) {
    compact.dispose();
    const cleanup = retireOwnedBuffers(ownedBuffers);
    if (cleanup.length) throw new AggregateError([error, ...cleanup], 'SF3D artifact load cleanup failed', { cause: error });
    throw error;
  }
}

function buildWeightSet(device, chunkedBuffer, tensors, ownedBuffers, context = null, staged = null) {
  const upload = (buffer, info) => {
    const gpuBuffer = extractTensor(device, buffer, info, context);
    ownedBuffers.add(gpuBuffer);
    return gpuBuffer;
  };
  const consumed = new Set();
  const get = (name) => {
    const info = tensors.get(name);
    if (!info) throw new Error(`Missing weight: ${name}`);
    consumed.add(name);
    return staged?.references ? staged.references(name) : staged?.dryRun ? {} : staged ? staged.buffers.get(name) : upload(chunkedBuffer, info);
  };

  const tryGet = (name) => {
    const info = tensors.get(name);
    if (!info) return null;
    consumed.add(name);
    return staged?.references ? staged.references(name) : staged?.dryRun ? {} : staged ? staged.buffers.get(name) : upload(chunkedBuffer, info);
  };

  const getCPU = (name) => {
    const info = tensors.get(name);
    if (!info) throw new Error(`Missing weight: ${name}`);
    consumed.add(name);
    return extractTensorCPU(chunkedBuffer, info, context);
  };

  const getInfo = (name) => {
    const info = tensors.get(name);
    if (!info) throw new Error(`Missing weight info: ${name}`);
    return info;
  };

  // === Image Tokenizer (DINOv2 ViT-Large with modulation) ===
  const imageTokenizer = {
    imageMean: get('image_tokenizer.image_mean'),
    imageStd: get('image_tokenizer.image_std'),
    patchEmbed: {
      weight: get('image_tokenizer.model.embeddings.patch_embeddings.projection.weight'),
      bias: get('image_tokenizer.model.embeddings.patch_embeddings.projection.bias'),
    },
    clsToken: get('image_tokenizer.model.embeddings.cls_token'),
    posEmbed: get('image_tokenizer.model.embeddings.position_embeddings'),
    layernorm: {
      weight: get('image_tokenizer.model.layernorm.weight'),
      bias: get('image_tokenizer.model.layernorm.bias'),
    },
    blocks: [],
  };

  // 24 DINOv2 transformer blocks with AdaNorm modulation
  for (let l = 0; l < 24; l++) {
    const p = `image_tokenizer.model.encoder.layer.${l}`;
    imageTokenizer.blocks.push({
      norm1: { weight: get(`${p}.norm1.weight`), bias: get(`${p}.norm1.bias`) },
      attn: {
        q: { weight: get(`${p}.attention.attention.query.weight`), bias: get(`${p}.attention.attention.query.bias`) },
        k: { weight: get(`${p}.attention.attention.key.weight`), bias: get(`${p}.attention.attention.key.bias`) },
        v: { weight: get(`${p}.attention.attention.value.weight`), bias: get(`${p}.attention.attention.value.bias`) },
        proj: { weight: get(`${p}.attention.output.dense.weight`), bias: get(`${p}.attention.output.dense.bias`) },
      },
      layerScale1: get(`${p}.layer_scale1.lambda1`),
      norm2: { weight: get(`${p}.norm2.weight`), bias: get(`${p}.norm2.bias`) },
      mlp: {
        fc1: { weight: get(`${p}.mlp.fc1.weight`), bias: get(`${p}.mlp.fc1.bias`) },
        fc2: { weight: get(`${p}.mlp.fc2.weight`), bias: get(`${p}.mlp.fc2.bias`) },
      },
      layerScale2: get(`${p}.layer_scale2.lambda1`),
      // AdaNorm modulation from camera embeddings
      norm1Mod: { weight: get(`${p}.norm1_modulation.linear2.weight`), bias: get(`${p}.norm1_modulation.linear2.bias`) },
      norm2Mod: { weight: get(`${p}.norm2_modulation.linear2.weight`), bias: get(`${p}.norm2_modulation.linear2.bias`) },
    });
  }

  // === Camera Embedder ===
  const cameraEmbedder = {
    weight: get('camera_embedder.linear.weight'),
    bias: get('camera_embedder.linear.bias'),
  };

  // === Triplane Tokenizer ===
  const tokenizer = {
    embeddings: get('tokenizer.embeddings'), // [3, 1024, 96, 96]
  };

  // === Two-Stream Backbone ===
  const backbone = {
    latentInit: get('backbone.latent_init'),         // [1, 1792, 1024]
    normTriplane: { weight: get('backbone.norm_triplane.weight'), bias: get('backbone.norm_triplane.bias') },
    projTriplane: { weight: get('backbone.proj_triplane.weight'), bias: get('backbone.proj_triplane.bias') },
    normImage: { weight: get('backbone.norm_image.weight'), bias: get('backbone.norm_image.bias') },
    projImage: { weight: get('backbone.proj_image.weight'), bias: get('backbone.proj_image.bias') },
    normLatent: { weight: get('backbone.norm_latent.weight'), bias: get('backbone.norm_latent.bias') },
    projLatent: { weight: get('backbone.proj_latent.weight'), bias: get('backbone.proj_latent.bias') },
    projOut: { weight: get('backbone.proj_out.weight'), bias: get('backbone.proj_out.bias') },
    mainBlocks: [],
  };

  // 4 TwoStreamBlocks, each with fuse_block_in, 3 transformer_blocks, fuse_block_out
  for (let b = 0; b < 4; b++) {
    const bp = `backbone.main_blocks.${b}`;

    // Helper to load a FuseBlock
    function loadFuseBlock(prefix) {
      return {
        attn: {
          wq: get(`${prefix}.attn.wq.weight`),
          wk: get(`${prefix}.attn.wk.weight`),
          wv: get(`${prefix}.attn.wv.weight`),
          proj: { weight: get(`${prefix}.attn.proj.weight`), bias: get(`${prefix}.attn.proj.bias`) },
        },
        normZ1: { weight: get(`${prefix}.norm_z1.weight`), bias: get(`${prefix}.norm_z1.bias`) },
        normX: tensors.has(`${prefix}.norm_x.weight`) ? {
          weight: get(`${prefix}.norm_x.weight`), bias: get(`${prefix}.norm_x.bias`),
        } : null,
        normZ2: { weight: get(`${prefix}.norm_z2.weight`), bias: get(`${prefix}.norm_z2.bias`) },
        ff: {
          geglu: { weight: get(`${prefix}.ff.net.0.proj.weight`), bias: get(`${prefix}.ff.net.0.proj.bias`) },
          proj: { weight: get(`${prefix}.ff.net.2.weight`), bias: get(`${prefix}.ff.net.2.bias`) },
        },
      };
    }

    // Helper to load a BasicBlock
    function loadBasicBlock(prefix) {
      return {
        norm1: { weight: get(`${prefix}.norm1.weight`), bias: get(`${prefix}.norm1.bias`) },
        attn1: {  // self-attention
          wq: get(`${prefix}.attn1.wq.weight`),
          wk: get(`${prefix}.attn1.wk.weight`),
          wv: get(`${prefix}.attn1.wv.weight`),
          proj: { weight: get(`${prefix}.attn1.proj.weight`), bias: get(`${prefix}.attn1.proj.bias`) },
        },
        norm2: { weight: get(`${prefix}.norm2.weight`), bias: get(`${prefix}.norm2.bias`) },
        attn2: {  // cross-attention (or self if no encoder_hidden_states)
          wq: get(`${prefix}.attn2.wq.weight`),
          wk: get(`${prefix}.attn2.wk.weight`),
          wv: get(`${prefix}.attn2.wv.weight`),
          proj: { weight: get(`${prefix}.attn2.proj.weight`), bias: get(`${prefix}.attn2.proj.bias`) },
        },
        norm3: { weight: get(`${prefix}.norm3.weight`), bias: get(`${prefix}.norm3.bias`) },
        ff: {
          geglu: { weight: get(`${prefix}.ff.net.0.proj.weight`), bias: get(`${prefix}.ff.net.0.proj.bias`) },
          proj: { weight: get(`${prefix}.ff.net.2.weight`), bias: get(`${prefix}.ff.net.2.bias`) },
        },
      };
    }

    backbone.mainBlocks.push({
      fuseBlockIn: loadFuseBlock(`${bp}.fuse_block_in`),
      transformerBlocks: [0, 1, 2].map(i => loadBasicBlock(`${bp}.transformer_block.${i}`)),
      fuseBlockOut: loadFuseBlock(`${bp}.fuse_block_out`),
    });
  }

  // === Post-Processor (PixelShuffle) ===
  const postProcessor = {
    convLayers: [
      { weight: get('post_processor.upsample.0.weight'), bias: get('post_processor.upsample.0.bias') },
      { weight: get('post_processor.upsample.2.weight'), bias: get('post_processor.upsample.2.bias') },
      { weight: get('post_processor.upsample.4.weight'), bias: get('post_processor.upsample.4.bias') },
      { weight: get('post_processor.upsample.6.weight'), bias: get('post_processor.upsample.6.bias') },
    ],
  };

  // === Decoder (MaterialMLP) ===
  const decoder = {
    heads: {},
  };
  for (const headName of ['density', 'features', 'perturb_normal', 'vertex_offset']) {
    const layers = [];
    for (let i = 0; ; i += 2) {
      const w = tryGet(`decoder.heads.${headName}.${i}.weight`);
      const b = tryGet(`decoder.heads.${headName}.${i}.bias`);
      if (!w) break;
      layers.push({ weight: w, bias: b });
    }
    decoder.heads[headName] = layers;
  }

  // === Image Estimator (CLIP for roughness/metallic) ===
  // For v1, we can run this on CPU or skip and use defaults.
  // Load the estimation heads at minimum.
  const imageEstimator = {
    // CLIP visual encoder weights would go here
    // For now, just load the roughness/metallic prediction heads
    heads: {},
  };
  for (const headName of ['roughness', 'metallic']) {
    const subLayers = [];
    for (let sub = 0; sub < 3; sub++) {
      const layers = [];
      for (let i = 0; ; i += 2) {
        const w = tryGet(`image_estimator.heads.${headName}.${sub}.${i}.weight`);
        const b = tryGet(`image_estimator.heads.${headName}.${sub}.${i}.bias`);
        if (!w) break;
        layers.push({ weight: w, bias: b });
      }
      if (layers.length > 0) subLayers.push(layers);
    }
    imageEstimator.heads[headName] = subLayers;
  }

  if(staged?.dryRun)return consumed;
  const components={imageTokenizer,cameraEmbedder,tokenizer,backbone,postProcessor,decoder,imageEstimator};
  if(staged?.references)return components;
  console.log(`Loaded ${tensors.size} SF3D tensors from weight file`);

  // Raw tensor access for modules that read weights lazily by name (the CLIP
  // visual encoder and CPU heads in clip_estimator.js). Only those families
  // (and anything the builders above did not consume) are kept, as standalone
  // copies; the streamed chunks are released so the page does not carry the
  // whole weight file in JS heap for the producer's lifetime.
  const compact = staged?.compact ?? compactRetainedTensors(tensors, chunkedBuffer, consumed, LAZILY_READ_TENSOR_PREFIXES, context);
  console.log(`Retained ${(compact.retainedBytes / 1048576).toFixed(0)} MB of raw tensor bytes for lazy readers; released ${(compact.droppedBytes / 1048576).toFixed(0)} MB of streamed chunks`);
  const lazyBuffers = new Map();
  let disposed = false;
  const _assertActive = (requestedDevice = device) => {
    if (disposed) throw new Error('SF3D weights are disposed');
    if (requestedDevice !== device) throw new Error('SF3D weights belong to a different GPUDevice');
  };
  const rawInfo = (name) => {
    _assertActive();
    const info = tensors.get(name);
    if (!info) throw new Error(`Missing weight: ${name}`);
    return { dtype: info.dtype, offset: 0, size: info.size };
  };
  // Lazy uploads belong to this same weight set. Reuse by tensor name also
  // makes a partially failed CLIP initialization retry without duplicate GPU
  // uploads; ownership never moves into the estimator's cache.
  const _rawGet = (name) => {
    _assertActive();
    if (!lazyBuffers.has(name)) {
      lazyBuffers.set(name, upload(compact.rawBytes(name).buffer, rawInfo(name)));
    }
    return lazyBuffers.get(name);
  };
  const _rawGetCPU = (name) => {
    _assertActive();
    return extractTensorCPU(compact.rawBytes(name).buffer, rawInfo(name), context);
  };
  const _rawTryGet = (name) => { _assertActive(); return tensors.has(name) ? _rawGet(name) : null; };
  const _rawHas = (name) => { _assertActive(); return tensors.has(name); };
  const dispose = () => {
    if (disposed && ownedBuffers.size===0) return 0;
    disposed = true;
    const count = ownedBuffers.size;
    const cleanupErrors=retireOwnedBuffers(ownedBuffers);
    lazyBuffers.clear();
    compact.dispose();
    for (const lease of context?.ownedCpu ?? []) lease.release();
    context?.ownedCpu.clear();
    if(cleanupErrors.length)throw new AggregateError(cleanupErrors,'SF3D weight cleanup encountered failures');
    return count;
  };

  return {
    ...components,
    ...(staged ? {loadingReport:staged.report} : {}),
    dispose,
    _assertActive,
    _rawGet,
    _rawGetCPU,
    _rawTryGet,
    _rawHas,
  };
}

function rangeLoadContext(device,memoryBudget){
  if(!isLoaderMemoryBudget(memoryBudget))throw TypeError('tensor-ranges requires authenticated loader budget');
  memoryBudget.assertDevice(device);
  const ownedBuffers=new Set(),ownedCpu=new Set();
  const context={budget:memoryBudget,ownedCpu,ownedBuffers};
  const cleanup=error=>{
    const failures=retireOwnedBuffers(ownedBuffers);
    for(const lease of ownedCpu)lease.release();ownedCpu.clear();
    if(failures.length)throw new AggregateError(error?[error,...failures]:failures,'SF3D range cleanup encountered failures',{cause:error});
  };
  return {ownedBuffers,ownedCpu,context,cleanup};
}

// Complete conversion into one full GPU operand. The reusable working store
// changes pacing, not coverage. Keep the existing full expansion allowance;
// an unresolved queue prefix retains that allowance and exact GPU owner until
// the actual phase disposer obtains a new successful drain.
async function uploadRangeFp16(device,bytes,owner){
  const half=new Uint16Array(bytes.buffer,bytes.byteOffset,bytes.byteLength/2);
  const expandedBytes=half.length*4;
  const lease=owner.context.budget.reserveCpu(expandedBytes,'fp16-conversion');
  owner.ownedCpu.add(lease);
  const working=new Float32Array(Math.min(half.length,262144));
  const buffer=createEmptyBuffer(device,expandedBytes,0,'complete-phase-fp16-upload');
  owner.ownedBuffers.add(buffer);
  for(let start=0;start<half.length;start+=working.length){
    const count=Math.min(working.length,half.length-start);
    for(let i=0;i<count;i++)working[i]=fp16ToFp32(half[start+i]);
    device.queue.writeBuffer(buffer,start*4,working,0,count);
    await device.queue.onSubmittedWorkDone();
  }
  lease.release();owner.ownedCpu.delete(lease);
  return buffer;
}

// Consume the entire authenticated range without a complete raw CPU copy.
// Packed halves and expanded values share one working backing; expand backward
// so unread halves survive. Keep all old full-range/conversion declarations.
async function uploadRangeFp16Source(device,source,name,owner){
  const info=source.tensors.get(name),expandedBytes=info.size*2;
  const conversion=owner.context.budget.reserveCpu(expandedBytes,'fp16-conversion');
  let working;
  const lease={release(){conversion.release();working=null;}};
  owner.ownedCpu.add(lease);
  working=new Float32Array(Math.min(info.size/2,262144));
  const packed=new Uint8Array(working.buffer,0,working.length*2),half=new Uint16Array(working.buffer,0,working.length);
  const buffer=createEmptyBuffer(device,expandedBytes,0,'complete-phase-fp16-upload');
  owner.ownedBuffers.add(buffer);
  let used=0,uploaded=0;
  const flush=async()=>{
    if(used%2)throw Error('complete FP16 prefix has an incomplete element');
    const count=used/2;
    for(let i=count-1;i>=0;i--)working[i]=fp16ToFp32(half[i]);
    device.queue.writeBuffer(buffer,uploaded,working,0,count);
    await device.queue.onSubmittedWorkDone();
    uploaded+=count*4;used=0;
  };
  await source.consumeTensor(name,async value=>{
    for(let offset=0;offset<value.length;){
      const count=Math.min(packed.length-used,value.length-offset);
      packed.set(value.subarray(offset,offset+count),used);used+=count;offset+=count;
      if(used===packed.length)await flush();
    }
  });
  if(used)await flush();
  if(uploaded!==expandedBytes)throw Error('complete FP16 source upload coverage mismatch');
  lease.release();owner.ownedCpu.delete(lease);
  return buffer;
}

async function uploadRangeTensor(device,source,name,owner,{retain=false,streamFp16Uploads=false}={}){
  const info=source.tensors.get(name);
  if(streamFp16Uploads&&info.dtype===1&&!retain){
    const buffer=await uploadRangeFp16Source(device,source,name,owner);
    await device.queue.onSubmittedWorkDone();
    return {buffer};
  }
  let unit=await source.readTensor(name);
  try{
    const info=source.tensors.get(name);
    const buffer=streamFp16Uploads&&info.dtype===1?
      await uploadRangeFp16(device,unit.bytes,owner):
      extractTensor(device,unit.bytes.buffer,{...info,offset:0},owner.context);
    owner.ownedBuffers.add(buffer);
    // Backpressure before another source unit; queue completion is not GC or
    // proven physical reclamation. The parent process observer remains needed.
    await device.queue.onSubmittedWorkDone();
    if(retain){owner.ownedCpu.add(unit);const bytes=unit.bytes;unit=null;return {buffer,bytes};}
    return {buffer};
  }finally{unit?.release();if(unit)unit.bytes=null;}
}

/** Small identified tensor consumer, not a truncated model or inference route. */
export async function loadWeightTensorUnit(device,url,tensorNames,options={}){
  const owner=rangeLoadContext(device,options.memoryBudget);
  if(!Array.isArray(tensorNames)||!tensorNames.length||new Set(tensorNames).size!==tensorNames.length)
    throw TypeError('explicit unique nonempty tensorNames required');
  try{
    const source=await createFlatTensorRangeSource(url,options),tensors=new Map();
    for(const name of tensorNames)if(!source.tensors.has(name))throw Error('Missing weight: '+name);
    for(const name of tensorNames)tensors.set(name,(await uploadRangeTensor(device,source,name,owner)).buffer);
    return {tensors,loadingReport:source.report,dispose:()=>{owner.cleanup();tensors.clear();}};
  }catch(error){owner.cleanup(error);throw error;}
}

async function loadRangeWeights(device,url,onProgress,options){
  const owner=rangeLoadContext(device,options.memoryBudget);
  try{
    const source=await createFlatTensorRangeSource(url,{...options,onProgress});
    // Exercise the SAME builders without allocation to identify eager consumers
    // and validate required names before payload acquisition. No second model
    // schema or asynchronous consumer API is introduced.
    const consumed=buildWeightSet(device,null,source.tensors,new Set(),null,{dryRun:true});
    const retained=new Map(),buffers=new Map();let retainedBytes=0,droppedBytes=0,disposed=false;
    for(const [name,info]of source.tensors){
      const keep=!consumed.has(name)||LAZILY_READ_TENSOR_PREFIXES.some(p=>name.startsWith(p));
      if(consumed.has(name)){
        const result=await uploadRangeTensor(device,source,name,owner,{retain:keep});buffers.set(name,result.buffer);
        if(keep){retained.set(name,result.bytes);retainedBytes+=info.size;}else droppedBytes+=info.size;
      }else{
        const unit=await source.readTensor(name);owner.ownedCpu.add(unit);retained.set(name,unit.bytes);retainedBytes+=info.size;
      }
    }
    const compact={retained,retainedBytes,droppedBytes,rawBytes(name){
      if(disposed)throw Error('SF3D weights are disposed');
      if(!retained.has(name))throw Error(`tensor ${name} was uploaded at load and its raw bytes were released`);
      return retained.get(name);
    },dispose(){disposed=true;retained.clear();}};
    return buildWeightSet(device,null,source.tensors,owner.ownedBuffers,owner.context,{buffers,compact,report:source.report});
  }catch(error){owner.cleanup(error);throw error;}
}

/**
 * Opt-in computation-bound residency over the SAME model builders/converter.
 * Construction validates the complete eager model schema from the range table,
 * but allocates no payload. A caller selects actual template leaves for one
 * computation; those buffers retire only after its submitted queue work drains.
 * This is explicit lifetime accounting, never host-fit or physical reclaim authority.
 */
export async function createWeightPhaseSource(device,url,options={}){
  const streamFp16Uploads=options.streamFp16Uploads===undefined?false:options.streamFp16Uploads;
  if(typeof streamFp16Uploads!=='boolean')throw TypeError('explicit boolean phase FP16 upload mode required');
  const onAfterWeightsLoaded=options.onAfterWeightsLoaded;
  if(onAfterWeightsLoaded!==undefined&&typeof onAfterWeightsLoaded!=='function')
    throw TypeError('weight observation callback must be a function');
  if(!isLoaderMemoryBudget(options.memoryBudget))throw TypeError('authenticated loader budget required');
  options.memoryBudget.assertDevice(device);
  const source=await createFlatTensorRangeSource(url,options),references=new WeakMap();
  source.report.gpuFp16UploadMode=streamFp16Uploads?'queue-write-complete-source-prefix-v1':'direct-mapped-v1';
  const template=buildWeightSet(device,null,source.tensors,new Set(),null,{references(name){
    const ref=Object.freeze({});references.set(ref,name);return ref;
  }});
  let active=false,disposed=false,quarantined=false,unresolvedOwner=null;
  const phases=[];
  const assertActive=()=>{
    if(disposed)throw Error('weight phase source is disposed');
    if(quarantined)throw Error('weight phase source queue cleanup is quarantined');
    if(active)throw Error('weight phase source has an active phase');
  };
  const select=(value,names,buffers=null)=>{
    if(value===null)return null;
    if(!value||typeof value!=='object')throw TypeError('authenticated weight phase selection required');
    if(references.has(value)){
      const name=references.get(value);names.add(name);return buffers?buffers.get(name):value;
    }
    if(Array.isArray(value))return value.map(v=>select(v,names,buffers));
    const entries=Object.entries(value);
    if(!entries.length)throw TypeError('authenticated weight phase selection required');
    return Object.fromEntries(entries.map(([key,v])=>[key,select(v,names,buffers)]));
  };
  const withPhase=async(selection,work,storageKind)=>{
      assertActive();if(typeof work!=='function')throw TypeError('weight phase computation required');
      const names=new Set();
      if(selection&&typeof selection==='object'&&!Object.keys(selection).length)throw TypeError('nonempty weight phase selection required');
      const pinned=select(selection,names);if(!names.size)throw TypeError('nonempty weight phase selection required');
      active=true;
      const owner=rangeLoadContext(device,options.memoryBudget),buffers=new Map();
      const phase={tensorNames:[...names],storageKind,status:'loading',retirementAuthority:
        storageKind==='cpu-fp32'?'owned CPU lease release; not physical reclamation':'API destruction after queue drain; not physical reclamation'};
      phases.push(phase);
      let value,error,failed=false;
      try{
        for(const name of names){
          if(storageKind==='cpu-fp32'){
            const unit=await source.readTensor(name);
            try{buffers.set(name,extractTensorCPU(unit.bytes.buffer,{...source.tensors.get(name),offset:0},owner.context));}
            finally{unit.release();unit.bytes=null;}
          }else buffers.set(name,(await uploadRangeTensor(device,source,name,owner,{streamFp16Uploads})).buffer);
        }
        // Opt-in borrowed observation, while the original phase owns every
        // buffer/lease. The observer must complete before compute or retirement.
        if(onAfterWeightsLoaded){
          if(owner.ownedBuffers.size)await device.queue.onSubmittedWorkDone();
          phase.status='observing-loaded-weights';
          await onAfterWeightsLoaded(Object.freeze({storageKind,sourceETag:source.report.sourceETag,
            tensors:Object.freeze([...buffers].map(([name,value])=>Object.freeze({
              name,value,...source.tensors.get(name)})))}));
        }
        phase.status='computing';value=await work(select(pinned,new Set(),buffers));
      }catch(failure){failed=true;error=failure;phase.error=String(failure?.message??failure);}
      try{
        if(owner.ownedBuffers.size)await device.queue.onSubmittedWorkDone();
        owner.cleanup();buffers.clear();phase.status=failed?'failed-retired':'completed-retired';
      }catch(failure){
        quarantined=true;unresolvedOwner=owner;phase.status='cleanup-unresolved';phase.cleanupError=String(failure?.message??failure);
        error=failed?new AggregateError([error,failure],'weight phase failed and cleanup is unresolved',{cause:error}):failure;failed=true;
      }finally{active=false;}
      if(failed)throw error;return value;
    };
  return Object.freeze({template,loadingReport:source.report,phases,
    reference(name){
      assertActive();if(typeof name!=='string'||!source.tensors.has(name))throw Error('Missing weight: '+name);
      const ref=Object.freeze({});references.set(ref,name);return ref;
    },
    describe(selection){
      assertActive();const names=new Set();select(selection,names);
      if(!names.size)throw TypeError('nonempty weight phase selection required');
      return Object.freeze([...names].map(name=>Object.freeze({name,...source.tensors.get(name)})));
    },
    withWeights(selection,work){return withPhase(selection,work,'gpu-buffer');},
    withCpuWeights(selection,work){return withPhase(selection,work,'cpu-fp32');},
    async dispose(){
      if(active)throw Error('cannot dispose an active weight phase');
      if(disposed&&!unresolvedOwner)return;
      disposed=true;
      if(unresolvedOwner){
        await device.queue.onSubmittedWorkDone();unresolvedOwner.cleanup();unresolvedOwner=null;
      }
    },
  });
}

import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { GEMMA4_PROJECTOR_RECIPE as recipe } from './gemma4ProjectorRecipe.js';

const CHUNK_BYTES = 1024 * 1024;
const MAX_ATTEMPTS = 3;
const RANGE_TIMEOUT_MS = 45000;
const nextTurn = () => new Promise((resolve) => setTimeout(resolve, 0));
const invalid = (message) => Object.assign(new Error(`Gemma4 projector: ${message}`), { permanent: true });

/** Exact BF16 to IEEE half conversion, including round-to-nearest/even subnormals. */
export function gemma4Bfloat16ToFloat16(bits) {
  const sign = bits & 0x8000, exponent = (bits >>> 7) & 255, fraction = bits & 127;
  if (exponent === 255) return sign | (fraction ? 0x7e00 | (fraction << 3) : 0x7c00);
  if (exponent > 142) return sign | 0x7c00;
  if (exponent >= 113) return sign | ((exponent - 112) << 10) | (fraction << 3);
  if (exponent < 102) return sign;
  const significand = 128 + fraction;
  if (exponent >= 110) return sign | (significand << (exponent - 110));
  const shift = 110 - exponent, quotient = significand >>> shift;
  const remainder = significand & ((1 << shift) - 1), halfway = 1 << (shift - 1);
  return sign | (quotient + (remainder > halfway || (remainder === halfway && (quotient & 1)) ? 1 : 0));
}

/** Converter's fixed Gemma4Unified HWC→CHW and position-axis permutations. */
export function gemma4ProjectorSourceIndex(transform, index) {
  if (transform === 'identity') return index;
  if (transform === 'patch-chw') {
    const column = index % 6912;
    return index - column + 3 * (column % 2304) + Math.floor(column / 2304);
  }
  if (transform === 'position-xy') {
    const feature = index % 3840, position = Math.floor(index / 3840) % 1120;
    return (position * 2 + Math.floor(index / (1120 * 3840))) * 3840 + feature;
  }
  throw invalid('unknown trusted tensor transform');
}

// Fetch normally honors AbortSignal itself. Also bound a stalled body reader or
// injected fetch implementation, so cancellation cannot wait for another chunk.
async function abortable(promise, signal) {
  let onAbort;
  try {
    return await Promise.race([promise, new Promise((resolve, reject) => {
      onAbort = () => reject(signal.reason);
      signal.addEventListener('abort', onAbort, { once: true });
      if (signal.aborted) onAbort();
    })]);
  } finally { signal.removeEventListener('abort', onAbort); }
}

async function fetchRange(fetchImpl, start, length, signal) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    signal?.throwIfAborted();
    const activeSignal = signal ? AbortSignal.any([signal, AbortSignal.timeout(RANGE_TIMEOUT_MS)])
      : AbortSignal.timeout(RANGE_TIMEOUT_MS);
    let response, reader;
    try {
      response = await abortable(fetchImpl(recipe.source.url, {
        headers: { Range: `bytes=${start}-${start + length - 1}` }, signal: activeSignal,
      }), activeSignal);
      activeSignal.throwIfAborted();
      if (response.status !== 206) {
        if (response.status === 429 || response.status >= 500) throw new Error(`source HTTP ${response.status}`);
        throw invalid(`source must honor bounded ranges (HTTP ${response.status})`);
      }
      const expected = `bytes ${start}-${start + length - 1}/${recipe.source.size}`;
      if (response.headers.get('content-range') !== expected) throw invalid('source Content-Range mismatch');
      const declared = response.headers.get('content-length');
      if (declared !== null && Number(declared) !== length) throw invalid('source Content-Length mismatch');
      if (!response.body?.getReader) throw invalid('streaming source response required');
      reader = response.body.getReader();
      const bytes = new Uint8Array(length); let offset = 0;
      for (;;) {
        activeSignal.throwIfAborted();
        const { done, value } = await abortable(reader.read(), activeSignal);
        activeSignal.throwIfAborted();
        if (done) break;
        if (!(value instanceof Uint8Array) || offset + value.length > length) throw invalid('oversized source range');
        bytes.set(value, offset); offset += value.length;
      }
      if (offset !== length) throw new Error('truncated source range');
      return bytes;
    } catch (error) {
      signal?.throwIfAborted();
      if (error.permanent) throw error;
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        const delay = new Promise((resolve) => setTimeout(resolve, attempt * 100));
        await (signal ? abortable(delay, signal) : delay);
        signal?.throwIfAborted();
      }
    } finally {
      try {
        // Do not let an uncooperative source's cancel promise hold up abort.
        Promise.resolve(reader ? reader.cancel() : response?.body?.cancel()).catch(() => {});
        reader?.releaseLock();
      } catch { /* Preserve the source error. */ }
    }
  }
  throw new Error(`Gemma4 projector: source range failed after ${MAX_ATTEMPTS} attempts`, { cause: lastError });
}

/** Reconstruct only the pinned companion; callers cannot supply executable recipes.
 * ArtifactStore must still verify expectedSize/SHA before committing its normal CID. */
export async function* createGemma4ProjectorSource({ fetchImpl = globalThis.fetch, signal, onProgress } = {}) {
  signal?.throwIfAborted();
  const outputHash = sha256.create();
  let outputBytes = 0, sourceBytes = 0;
  const report = (stage, tensor) => onProgress?.({ stage, tensor,
    loaded: outputBytes, totalBytes: recipe.size, sourceLoaded: sourceBytes, sourceTotalBytes: recipe.sourceTensorBytes });
  const emit = (bytes) => { outputHash.update(bytes); outputBytes += bytes.length; return bytes; };
  const header = hexToBytes(recipe.headerHex);
  yield emit(header);
  for (const tensor of recipe.tensors) {
    signal?.throwIfAborted();
    const source = new Uint8Array(tensor.sourceBytes), sourceHash = sha256.create();
    for (let offset = 0; offset < source.length; offset += CHUNK_BYTES) {
      const bytes = await fetchRange(fetchImpl, tensor.sourceOffset + offset,
        Math.min(CHUNK_BYTES, source.length - offset), signal);
      source.set(bytes, offset); sourceHash.update(bytes); sourceBytes += bytes.length;
      report('projector-download', tensor.sourceName);
    }
    if (bytesToHex(sourceHash.digest()) !== tensor.sourceSha256) throw invalid(`source tensor digest mismatch: ${tensor.sourceName}`);
    const padding = tensor.outputOffset - outputBytes;
    if (padding < 0 || padding >= 32) throw invalid('trusted tensor alignment mismatch');
    if (padding) yield emit(new Uint8Array(padding));
    const input = new DataView(source.buffer), width = tensor.outputType === 'f32' ? 4 : 2;
    if (tensor.outputBytes !== source.length / 2 * width) throw invalid('trusted tensor shape mismatch');
    for (let offset = 0; offset < tensor.outputBytes; offset += CHUNK_BYTES) {
      signal?.throwIfAborted();
      const bytes = new Uint8Array(Math.min(CHUNK_BYTES, tensor.outputBytes - offset)), output = new DataView(bytes.buffer);
      for (let at = 0; at < bytes.length; at += width) {
        const index = gemma4ProjectorSourceIndex(tensor.transform, (offset + at) / width);
        const bits = input.getUint16(index * 2, true);
        if (width === 4) output.setUint32(at, bits << 16, true);
        else output.setUint16(at, gemma4Bfloat16ToFloat16(bits), true);
      }
      yield emit(bytes); report('projector-convert', tensor.sourceName);
      await nextTurn();
    }
  }
  signal?.throwIfAborted();
  const padding = recipe.size - outputBytes;
  if (padding < 0 || padding >= 32) throw invalid('trusted final alignment mismatch');
  if (padding) yield emit(new Uint8Array(padding));
  if (outputBytes !== recipe.size || bytesToHex(outputHash.digest()) !== recipe.sha256) throw invalid('derived file digest mismatch');
  report('projector-complete');
}

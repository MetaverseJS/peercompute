import { throwIfAborted } from '../modelManifest.js';
import { parseFlatWeightHeader } from './vendor/src/lib/flat_tensor_ranges.js';

export const SF3D_READ_BYTES = 4 * 1024 ** 2;

/** No fetch, URL resolution, or tensor-sized transfer across the worker port.
 * Integrity is established by the admitted artifact manifest/read bridge. */
export function createSf3dArtifactSource(reader, { signal, onProgress } = {}) {
  async function consume(path, offset, size, accept) {
    const file = reader.stat(path);
    if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0
        || size < 0 || offset > file.size || size > file.size - offset) throw new Error('Invalid SF3D artifact range');
    for (let start = 0; start < size; start += SF3D_READ_BYTES) {
      throwIfAborted(signal);
      const length = Math.min(SF3D_READ_BYTES, size - start);
      const bytes = await reader.read(path, offset + start, length, { signal });
      throwIfAborted(signal);
      if (!(bytes instanceof Uint8Array) || bytes.byteLength !== length) throw new Error('Truncated SF3D artifact read');
      await accept(bytes, start);
      onProgress?.({ type: 'model-load', stage: path, loaded: offset + start + length, total: file.size });
    }
  }
  async function read(path, offset, size, maximum = 64 * 1024 ** 2) {
    if (!Number.isSafeInteger(size) || size < 0 || size > maximum) throw new Error('SF3D CPU source allocation exceeds its budget');
    const bytes = new Uint8Array(size);
    await consume(path, offset, size, (chunk, start) => bytes.set(chunk, start));
    return bytes;
  }
  async function weights() {
    const file = reader.stat('weights.bin');
    const prefix = await read(file.path, 0, 16);
    const view = new DataView(prefix.buffer), count = view.getUint32(8, true), headerSize = view.getUint32(12, true);
    if (headerSize !== 16 + count * 160 || headerSize > SF3D_READ_BYTES || headerSize > file.size) {
      throw new Error('Invalid SF3D tensor table bounds');
    }
    const header = await read(file.path, 0, headerSize);
    const { tensors } = parseFlatWeightHeader(header.buffer, file.size);
    return {
      tensors,
      report: { mode: 'peercompute-artifact-ranges', expectedWeightBytes: file.size, tensorCount: tensors.size,
        maximumReadBytes: SF3D_READ_BYTES, sha256: file.sha256 },
      consumeTensor(name, accept) {
        const tensor = tensors.get(name);
        if (!tensor) throw new Error(`Missing SF3D tensor: ${name}`);
        return consume(file.path, tensor.offset, tensor.size, accept);
      },
      async readTensor(name) {
        const tensor = tensors.get(name);
        if (!tensor) throw new Error(`Missing SF3D tensor: ${name}`);
        return read(file.path, tensor.offset, tensor.size, 256 * 1024 ** 2);
      },
    };
  }
  async function tetData() {
    const vertices = reader.stat('tets/vertices.bin'), indicesFile = reader.stat('tets/indices.bin');
    if (vertices.size % 12 || indicesFile.size % 16) throw new Error('Invalid SF3D tet array layout');
    const gridVertices = new Float32Array((await read(vertices.path, 0, vertices.size)).buffer);
    const indices = new Int32Array((await read(indicesFile.path, 0, indicesFile.size)).buffer);
    const numVertices = gridVertices.length / 3;
    // The pinned grid has a minimum of -9.015202806e-8 from export rounding.
    // Admit that bounded roundoff without clamping or changing trained inputs.
    if (!numVertices || !indices.length || gridVertices.some(n => !Number.isFinite(n) || n < -1e-6 || n > 1 + 1e-6)
        || indices.some(n => n < 0 || n >= numVertices)) throw new Error('Invalid SF3D tet values');
    return { gridVertices, indices, numVertices, numTets: indices.length / 4 };
  }
  return { read, consume, weights, tetData };
}

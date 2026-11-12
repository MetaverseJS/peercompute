import { normalizeGeneratedMeshDescriptor, validateGeneratedMesh } from '../../inference/GeneratedMeshArtifact.js';
import { PEER_INFERENCE_LIMITS as LIMITS } from './protocol.js';

/** One credited chunk at a time; never put geometry bytes into JSON/pubsub. */
export async function writeResultMesh(io, { mesh, requestId, controls, signal }) {
  const metadata = normalizeGeneratedMeshDescriptor(mesh);
  const ready = controls.expect(0);
  await io.write({ type: 'result-mesh', requestId, mesh: metadata }, signal);
  await ready;
  for (let offset = 0; offset < mesh.data.byteLength;) {
    const end = Math.min(offset + LIMITS.imageChunkBytes, mesh.data.byteLength);
    const credit = controls.expect(end);
    await io.rpc.write(mesh.data.subarray(offset, end), { signal });
    await credit; offset = end;
  }
}

export async function readResultMesh(io, { mesh, requestId, signal, allowTextures = false }) {
  const metadata = normalizeGeneratedMeshDescriptor(mesh);
  const data = new Uint8Array(metadata.byteLength);
  await io.write({ type: 'result-credit', requestId, offset: 0 }, signal);
  let offset = 0, result;
  while (offset < data.byteLength) {
    const frame = await io.rpc.read({ signal });
    if (!frame.byteLength || frame.byteLength > LIMITS.imageChunkBytes || frame.byteLength > data.byteLength - offset) {
      throw new Error('Invalid generated mesh transfer frame');
    }
    data.set(frame.subarray(), offset); offset += frame.byteLength;
    // Invalid geometry or a digest mismatch never receives a final credit.
    if (offset === data.byteLength) result = validateGeneratedMesh({ ...metadata, data }, { allowTextures });
    await io.write({ type: 'result-credit', requestId, offset }, signal);
  }
  return result;
}

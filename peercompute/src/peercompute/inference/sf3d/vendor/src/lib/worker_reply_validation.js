/**
 * Pure validators for Web Worker replies at SF3D's fail-loud worker
 * boundaries (preprocess, UV unwrap). A malformed reply throws here and never
 * reaches the GPU or the texture baker as an apparently successful offload;
 * the caller (callWorker) rejects and no main-thread retry is attempted.
 *
 * Review 2026-09-16 (HIGH): length-correct non-finite preprocessing output and
 * truncated / non-finite / out-of-range UV geometry were previously accepted.
 */

/**
 * unwrapUV returns faceAssignment as an Int32Array of atlas slots per face:
 * 0-5 primary box-projection charts, 6-11 first overlap tier, 12 remaining
 * (sub-cell grid). Valid values are 0..12 inclusive.
 */
export const UV_ATLAS_SLOT_COUNT = 13;

function requireBuffer(reply, key, label) {
  if (!(reply?.[key] instanceof ArrayBuffer)) throw new Error(`${label} reply must carry ${key} ArrayBuffer`);
  return reply[key];
}

function requireFinite(arr, label) {
  for (let i = 0; i < arr.length; i++) {
    if (!Number.isFinite(arr[i])) throw new Error(`${label} value non-finite at ${i}`);
  }
}

/** Preprocess worker reply → Float32Array CHW of exactly expectedLen finite values. */
export function validatePreprocessReply(reply, expectedLen) {
  const chw = new Float32Array(requireBuffer(reply, 'chwBuffer', 'preprocess'));
  if (chw.length !== expectedLen) throw new Error(`CHW length ${chw.length} != expected ${expectedLen}`);
  requireFinite(chw, 'preprocess CHW');
  return chw;
}

/**
 * UV-unwrap worker reply → { uvs, newVertices, newNormals, newFaces,
 * faceAssignment, newNumVertices, newNumFaces } with every array at its
 * declared length, finite floats, in-range face indices and chart ids.
 */
export function validateUvUnwrapReply(reply) {
  const nv = reply?.newNumVertices;
  const nf = reply?.newNumFaces;
  if (!Number.isSafeInteger(nv) || nv <= 0) throw new Error(`uv-unwrap newNumVertices invalid: ${nv}`);
  if (!Number.isSafeInteger(nf) || nf <= 0) throw new Error(`uv-unwrap newNumFaces invalid: ${nf}`);
  const assignmentBuffer = requireBuffer(reply, 'faceAssignment', 'uv-unwrap');
  if (assignmentBuffer.byteLength % 4 !== 0) {
    throw new Error(`uv-unwrap faceAssignment byte length ${assignmentBuffer.byteLength} is not a multiple of 4 (expected Int32 atlas slots)`);
  }
  const r = {
    uvs: new Float32Array(requireBuffer(reply, 'uvs', 'uv-unwrap')),
    newVertices: new Float32Array(requireBuffer(reply, 'newVertices', 'uv-unwrap')),
    newNormals: new Float32Array(requireBuffer(reply, 'newNormals', 'uv-unwrap')),
    newFaces: new Uint32Array(requireBuffer(reply, 'newFaces', 'uv-unwrap')),
    faceAssignment: new Int32Array(assignmentBuffer),
    newNumVertices: nv,
    newNumFaces: nf,
  };
  const expectLen = (arr, expected, label) => {
    if (arr.length !== expected) throw new Error(`uv-unwrap ${label} length ${arr.length} != ${expected}`);
  };
  expectLen(r.newVertices, nv * 3, 'newVertices');
  expectLen(r.newNormals, nv * 3, 'newNormals');
  expectLen(r.uvs, nv * 2, 'uvs');
  expectLen(r.newFaces, nf * 3, 'newFaces');
  expectLen(r.faceAssignment, nf, 'faceAssignment');
  requireFinite(r.newVertices, 'uv-unwrap newVertices');
  requireFinite(r.newNormals, 'uv-unwrap newNormals');
  requireFinite(r.uvs, 'uv-unwrap uvs');
  for (let i = 0; i < r.newFaces.length; i++) {
    if (r.newFaces[i] >= nv) throw new Error(`uv-unwrap face index ${r.newFaces[i]} out of range (${nv} vertices) at ${i}`);
  }
  for (let i = 0; i < r.faceAssignment.length; i++) {
    const v = r.faceAssignment[i];
    if (v < 0 || v >= UV_ATLAS_SLOT_COUNT) {
      throw new Error(`uv-unwrap faceAssignment value ${v} out of range (${UV_ATLAS_SLOT_COUNT} atlas slots) at ${i}`);
    }
  }
  return r;
}

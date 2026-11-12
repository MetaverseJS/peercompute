/**
 * texture_baker.js — UV unwrapping + texture baking for SF3D WebGPU.
 *
 * Pipeline:
 *   1. Cube-projection UV unwrapping with bbox normalization
 *   2. CPU rasterization of UV space → 3D positions (with depth buffer)
 *   3. GPU triplane query + features decoder → RGB
 *   4. Texture dilation to fill seams
 *
 * The triplane query and decoder reuse triplane_decoder.js.
 */

import {
  captureGpuBufferAllocations,
  createStorageBuffer,
  createEmptyBuffer,
  readBuffer,
} from './gpu.js';
import { materializeTextures } from './materialize_core.js';
import { callWorker } from './worker_call.js';
import { withForegroundScope } from './foreground_scope.js';

/**
 * UV unwrap a mesh using cube projection with bounding-box normalization.
 *
 * Each triangle is assigned to one of 6 cube faces based on its face normal,
 * then projected onto that face's 2D plane using the mesh's actual bounding
 * box (not a fixed radius) for UV normalization. The 6 projections are packed
 * into a 3×2 grid in UV space.
 *
 * Vertices are duplicated per-face (no sharing across faces) to allow
 * per-face UVs without seam issues.
 *
 * @param {Float32Array} vertices - [N_v * 3] vertex positions
 * @param {Uint32Array} faces - [N_f * 3] triangle indices
 * @param {number} numVertices
 * @param {number} numFaces
 * @param {number} radius - model space radius (unused, kept for API compat)
 * @returns {{ uvs, newVertices, newNormals, newFaces, newNumVertices, newNumFaces, faceAssignment }}
 */
export function unwrapUV(vertices, faces, numVertices, numFaces, radius = 0.87, streamOverlaps = false) {
  // --- PCA alignment: rotate vertex positions so principal axes align with
  // canonical X/Y/Z, matching PyTorch _align_mesh_with_main_axis.
  // ONLY used for UV generation; output newVertices remain unrotated. ---
  const rotMat = _computePCARotation(vertices, numVertices);
  const rotVerts = new Float32Array(numVertices * 3);
  for (let i = 0; i < numVertices; i++) {
    const x = vertices[i*3], y = vertices[i*3+1], z = vertices[i*3+2];
    rotVerts[i*3]   = rotMat[0]*x + rotMat[1]*y + rotMat[2]*z;
    rotVerts[i*3+1] = rotMat[3]*x + rotMat[4]*y + rotMat[5]*z;
    rotVerts[i*3+2] = rotMat[6]*x + rotMat[7]*y + rotMat[8]*z;
  }

  // Compute smooth vertex normals from ROTATED vertex positions.
  // Area-weighted: each face contributes its (unnormalized) cross product
  // to all 3 vertices. Larger faces contribute more. Then normalize.
  const smoothNormals = new Float32Array(numVertices * 3);
  const faceAssignment = new Uint8Array(numFaces);

  for (let f = 0; f < numFaces; f++) {
    const i0 = faces[f * 3], i1 = faces[f * 3 + 1], i2 = faces[f * 3 + 2];
    const v0x = rotVerts[i0*3], v0y = rotVerts[i0*3+1], v0z = rotVerts[i0*3+2];
    const v1x = rotVerts[i1*3], v1y = rotVerts[i1*3+1], v1z = rotVerts[i1*3+2];
    const v2x = rotVerts[i2*3], v2y = rotVerts[i2*3+1], v2z = rotVerts[i2*3+2];

    const e1x = v1x - v0x, e1y = v1y - v0y, e1z = v1z - v0z;
    const e2x = v2x - v0x, e2y = v2y - v0y, e2z = v2z - v0z;
    let nx = e1y * e2z - e1z * e2y;
    let ny = e1z * e2x - e1x * e2z;
    let nz = e1x * e2y - e1y * e2x;

    // Accumulate unnormalized face normal to each vertex (area-weighted)
    for (const idx of [i0, i1, i2]) {
      smoothNormals[idx * 3] += nx;
      smoothNormals[idx * 3 + 1] += ny;
      smoothNormals[idx * 3 + 2] += nz;
    }
  }

  // Normalize accumulated normals
  for (let i = 0; i < numVertices; i++) {
    const nx = smoothNormals[i*3], ny = smoothNormals[i*3+1], nz = smoothNormals[i*3+2];
    const len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
    smoothNormals[i*3] /= len;
    smoothNormals[i*3+1] /= len;
    smoothNormals[i*3+2] /= len;
  }

  // Assign face to cube face using mean vertex normal (matching PyTorch)
  for (let f = 0; f < numFaces; f++) {
    const i0 = faces[f * 3], i1 = faces[f * 3 + 1], i2 = faces[f * 3 + 2];
    const fnx = smoothNormals[i0*3] + smoothNormals[i1*3] + smoothNormals[i2*3];
    const fny = smoothNormals[i0*3+1] + smoothNormals[i1*3+1] + smoothNormals[i2*3+1];
    const fnz = smoothNormals[i0*3+2] + smoothNormals[i1*3+2] + smoothNormals[i2*3+2];
    const ax = Math.abs(fnx), ay = Math.abs(fny), az = Math.abs(fnz);
    if (ax >= ay && ax >= az) {
      faceAssignment[f] = fnx > 0 ? 0 : 1;
    } else if (ay >= ax && ay >= az) {
      faceAssignment[f] = fny > 0 ? 2 : 3;
    } else {
      faceAssignment[f] = fnz > 0 ? 4 : 5;
    }
  }

  // Compute bbox from ROTATED vertices for UV normalization
  let bboxMin = [Infinity, Infinity, Infinity];
  let bboxMax = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < numVertices; i++) {
    for (let a = 0; a < 3; a++) {
      const v = rotVerts[i * 3 + a];
      if (v < bboxMin[a]) bboxMin[a] = v;
      if (v > bboxMax[a]) bboxMax[a] = v;
    }
  }
  const bboxRange = [
    (bboxMax[0] - bboxMin[0]) || 1,
    (bboxMax[1] - bboxMin[1]) || 1,
    (bboxMax[2] - bboxMin[2]) || 1,
  ];

  // Normalize ROTATED vertex positions to [-1, 1] matching PyTorch
  const vNorm = new Float32Array(numVertices * 3);
  for (let i = 0; i < numVertices; i++) {
    for (let a = 0; a < 3; a++) {
      vNorm[i * 3 + a] = (rotVerts[i * 3 + a] - bboxMin[a]) / bboxRange[a] * 2 - 1;
    }
  }

  // UV projection axes matching PyTorch exactly:
  //   +X (0): uc = y,  vc = -z
  //   -X (1): uc = y,  vc = -z
  //   +Y (2): uc = x,  vc = -z
  //   -Y (3): uc = x,  vc = -z
  //   +Z (4): uc = x,  vc = y
  //   -Z (5): uc = x,  vc = -y
  // abs_axis uses the corresponding position axis for max_dim_div
  // +X/-X use abs(x), +Y/-Y use abs(y), +Z/-Z use abs(z)

  // Depth axis per cube face (perpendicular to projection plane)
  const depthAxis = [0, 0, 1, 1, 2, 2];
  const depthKeepMax = [true, false, true, false, true, false];

  // --- Step 1: Compute raw [0,1] UVs and depth centroids ---
  // Matching PyTorch: project normalized positions, divide by max_dim_div per face, then to [0,1]
  const rawU = new Float32Array(numFaces * 3);
  const rawV = new Float32Array(numFaces * 3);
  const centroidDepth = new Float32Array(numFaces);

  for (let f = 0; f < numFaces; f++) {
    const cubeF = faceAssignment[f];
    const dAxis = depthAxis[cubeF];

    let depthSum = 0;
    for (let vi = 0; vi < 3; vi++) {
      const idx = faces[f * 3 + vi];
      let uc, vc;
      // Project matching PyTorch axes (positions already in [-1, 1])
      if (cubeF <= 1) {       // +X, -X: uc = y, vc = -z
        uc = vNorm[idx * 3 + 1];
        vc = -vNorm[idx * 3 + 2];
      } else if (cubeF <= 3) { // +Y, -Y: uc = x, vc = -z
        uc = vNorm[idx * 3];
        vc = -vNorm[idx * 3 + 2];
      } else if (cubeF === 4) { // +Z: uc = x, vc = y
        uc = vNorm[idx * 3];
        vc = vNorm[idx * 3 + 1];
      } else {                  // -Z: uc = x, vc = -y
        uc = vNorm[idx * 3];
        vc = -vNorm[idx * 3 + 1];
      }
      // Map from [-1, 1] to [0, 1] (max_dim_div is always 1.0 in PyTorch)
      rawU[f * 3 + vi] = Math.max(0, Math.min(1, (uc + 1) * 0.5));
      rawV[f * 3 + vi] = Math.max(0, Math.min(1, (vc + 1) * 0.5));
      depthSum += rotVerts[idx * 3 + dAxis];
    }
    centroidDepth[f] = depthSum / 3;
  }

  // --- Step 1b: Rotate UV slices to consistent tangent space ---
  // Uses ROTATED positions and normals (same coordinate space as UV projection).
  _rotateUVSlicesConsistentSpace(
    rotVerts, smoothNormals, faces, rawU, rawV, faceAssignment, numVertices, numFaces
  );

  // --- Step 2: Detect UV overlaps and assign atlas indices ---
  // 0-5 = primary, 6-11 = first overlap, 12 = remaining
  const atlasIndex = new Int32Array(numFaces);
  for (let f = 0; f < numFaces; f++) atlasIndex[f] = faceAssignment[f];

  _detectOverlapsBVH(numFaces, atlasIndex, rawU, rawV, centroidDepth, depthKeepMax, 0, streamOverlaps);
  _detectOverlapsBVH(numFaces, atlasIndex, rawU, rawV, centroidDepth, depthKeepMax, 6, streamOverlaps);

  // --- Step 2b: Per-island UV normalization for secondary tier (slots 6-11) ---
  // Matching PyTorch _handle_slice_uvs: rescale all faces in each secondary
  // slot so their UVs fill [0,1], with max 2x magnification (clip denom at 0.5).
  for (let slot = 6; slot < 12; slot++) {
    let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
    let count = 0;
    for (let f = 0; f < numFaces; f++) {
      if (atlasIndex[f] !== slot) continue;
      count++;
      for (let vi = 0; vi < 3; vi++) {
        const u = rawU[f*3+vi], v = rawV[f*3+vi];
        if (u < minU) minU = u; if (u > maxU) maxU = u;
        if (v < minV) minV = v; if (v > maxV) maxV = v;
      }
    }
    if (count === 0) continue;
    const rangeU = Math.max(maxU - minU, 0.5); // clip at 0.5 = max 2x magnification
    const rangeV = Math.max(maxV - minV, 0.5);
    for (let f = 0; f < numFaces; f++) {
      if (atlasIndex[f] !== slot) continue;
      for (let vi = 0; vi < 3; vi++) {
        rawU[f*3+vi] = (rawU[f*3+vi] - minU) / rangeU;
        rawV[f*3+vi] = (rawV[f*3+vi] - minV) / rangeV;
      }
    }
  }

  // --- Step 3: Build per-face-vertex arrays ---
  // Compute UNROTATED smooth normals for GLB export (from original vertices).
  const origNormals = new Float32Array(numVertices * 3);
  for (let f = 0; f < numFaces; f++) {
    const i0 = faces[f * 3], i1 = faces[f * 3 + 1], i2 = faces[f * 3 + 2];
    const e1x = vertices[i1*3] - vertices[i0*3];
    const e1y = vertices[i1*3+1] - vertices[i0*3+1];
    const e1z = vertices[i1*3+2] - vertices[i0*3+2];
    const e2x = vertices[i2*3] - vertices[i0*3];
    const e2y = vertices[i2*3+1] - vertices[i0*3+1];
    const e2z = vertices[i2*3+2] - vertices[i0*3+2];
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;
    for (const idx of [i0, i1, i2]) {
      origNormals[idx*3] += nx; origNormals[idx*3+1] += ny; origNormals[idx*3+2] += nz;
    }
  }
  for (let i = 0; i < numVertices; i++) {
    const nx = origNormals[i*3], ny = origNormals[i*3+1], nz = origNormals[i*3+2];
    const len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
    origNormals[i*3] /= len; origNormals[i*3+1] /= len; origNormals[i*3+2] /= len;
  }

  const newNumVertices = numFaces * 3;
  const newNumFaces = numFaces;
  const newVertices = new Float32Array(newNumVertices * 3);
  const newNormals = new Float32Array(newNumVertices * 3);
  const newFaces = new Uint32Array(newNumFaces * 3);
  const uvs = new Float32Array(newNumVertices * 2);

  for (let f = 0; f < numFaces; f++) {
    for (let vi = 0; vi < 3; vi++) {
      const origIdx = faces[f * 3 + vi];
      const newIdx = f * 3 + vi;
      // ORIGINAL unrotated vertices and normals for output (triplane queries + GLB export)
      newVertices[newIdx * 3] = vertices[origIdx * 3];
      newVertices[newIdx * 3 + 1] = vertices[origIdx * 3 + 1];
      newVertices[newIdx * 3 + 2] = vertices[origIdx * 3 + 2];
      newNormals[newIdx * 3] = origNormals[origIdx * 3];
      newNormals[newIdx * 3 + 1] = origNormals[origIdx * 3 + 1];
      newNormals[newIdx * 3 + 2] = origNormals[origIdx * 3 + 2];
      newFaces[f * 3 + vi] = newIdx;
    }
  }

  // --- Step 4: Pack UVs into atlas ---
  // Layout matching PyTorch _find_slice_offset_and_scale:
  //   Primary (0-5):   3×2 grid, cell=1/3×1/3, region [0,1]×[0,2/3]
  //   Secondary (6-11): 3×2 grid, cell=1/6×1/6, region [0,1/2]×[2/3,1]
  //   Remaining (12+):  sub-cell grid in region [1/2,1]×[2/3,1]
  const pad = 0.005;

  const slotCol = [0, 1, 2, 0, 1, 2];
  const slotRow = [0, 0, 0, 1, 1, 1];

  // Collect remaining faces (atlasIndex >= 12) and compute their sub-cell grid
  const remainingFaces = [];
  for (let f = 0; f < numFaces; f++) {
    if (atlasIndex[f] >= 12) remainingFaces.push(f);
  }
  // Sub-cell grid for remaining faces: pack into [0.5,1]×[2/3,1] = 0.5 × 1/3
  const remRegionW = 0.5, remRegionH = 1 / 3;
  const remRegionX = 0.5, remRegionY = 2 / 3;
  let remGridW = 1, remGridH = 1;
  if (remainingFaces.length > 0) {
    const ratio = remRegionW / remRegionH; // aspect ratio of remaining region
    const mult = Math.sqrt(remainingFaces.length / ratio);
    remGridW = Math.max(1, Math.ceil(ratio * mult));
    remGridH = Math.max(1, Math.ceil(remainingFaces.length / remGridW));
  }
  const remCellW = remRegionW / remGridW;
  const remCellH = remRegionH / remGridH;

  // Build a map from face index to remaining-grid position
  const remFaceGridIdx = new Map();
  for (let i = 0; i < remainingFaces.length; i++) {
    remFaceGridIdx.set(remainingFaces[i], i);
  }

  for (let f = 0; f < numFaces; f++) {
    const ai = atlasIndex[f];
    const tier = Math.floor(ai / 6);
    const slot = ai % 6;
    const sc = slotCol[slot], sr = slotRow[slot];

    let offX, offY, cellW, cellH;
    if (tier === 0) {
      cellW = 1/3; cellH = 1/3;
      offX = cellW * sc;
      offY = cellH * sr;
    } else if (tier === 1) {
      cellW = 1/6; cellH = 1/6;
      offX = cellW * sc;
      offY = 2/3 + cellH * sr;
    } else {
      // Remaining: each face gets its own sub-cell
      cellW = remCellW; cellH = remCellH;
      const gi = remFaceGridIdx.get(f) || 0;
      const gx = gi % remGridW;
      const gy = Math.floor(gi / remGridW);
      offX = remRegionX + gx * cellW;
      offY = remRegionY + gy * cellH;
    }

    for (let vi = 0; vi < 3; vi++) {
      const idx = f * 3 + vi;
      // Per-face UV normalization for remaining tier:
      // normalize each triangle's UVs to fill [0,1] within its sub-cell
      let u = rawU[idx], v = rawV[idx];
      if (tier >= 2) {
        // Normalize per-triangle: find min/max across this triangle's 3 verts
        const u0 = rawU[f*3], u1 = rawU[f*3+1], u2 = rawU[f*3+2];
        const v0 = rawV[f*3], v1 = rawV[f*3+1], v2 = rawV[f*3+2];
        const uMin = Math.min(u0, u1, u2), uMax = Math.max(u0, u1, u2);
        const vMin = Math.min(v0, v1, v2), vMax = Math.max(v0, v1, v2);
        const uRange = uMax - uMin || 1;
        const vRange = vMax - vMin || 1;
        // Clamp scale to prevent extreme magnification (match PyTorch clip_val)
        const clipVal = Math.min(cellW, cellH) * 1.5;
        u = (u - uMin) / Math.max(uRange, clipVal);
        v = (v - vMin) / Math.max(vRange, clipVal);
      }
      uvs[idx * 2] = offX + pad + u * (cellW - 2 * pad);
      uvs[idx * 2 + 1] = offY + pad + v * (cellH - 2 * pad);
    }
  }

  // Diagnostic: check for degenerate UVs and out-of-bounds
  let degenerateCount = 0, oobCount = 0;
  const degFaces = [];
  for (let f = 0; f < numFaces; f++) {
    const u0 = uvs[f*6], v0 = uvs[f*6+1];
    const u1 = uvs[f*6+2], v1 = uvs[f*6+3];
    const u2 = uvs[f*6+4], v2 = uvs[f*6+5];
    // UV triangle area via cross product
    const area = Math.abs((u1-u0)*(v2-v0) - (u2-u0)*(v1-v0)) * 0.5;
    if (area < 1e-10) {
      degenerateCount++;
      if (degFaces.length < 10) degFaces.push({ f, tier: Math.floor(atlasIndex[f]/6), ai: atlasIndex[f], area, u0, v0, u1, v1, u2, v2 });
    }
    // Check OOB
    if (u0 < 0 || u0 > 1 || v0 < 0 || v0 > 1 ||
        u1 < 0 || u1 > 1 || v1 < 0 || v1 > 1 ||
        u2 < 0 || u2 > 1 || v2 < 0 || v2 > 1) oobCount++;
  }
  console.log(`UV diagnostics: degenerate=${degenerateCount}, out-of-bounds=${oobCount}, total=${numFaces}`);
  if (degFaces.length > 0) console.log(`Sample degenerate faces: ${JSON.stringify(degFaces.slice(0, 5))}`);

  // Also check: faces where all 3 UV verts map to the same texel at 1024 res
  let sameTexelCount = 0;
  const sameTexelFaces = [];
  for (let f = 0; f < numFaces; f++) {
    const px0 = Math.floor(uvs[f*6] * 1024), py0 = Math.floor(uvs[f*6+1] * 1024);
    const px1 = Math.floor(uvs[f*6+2] * 1024), py1 = Math.floor(uvs[f*6+3] * 1024);
    const px2 = Math.floor(uvs[f*6+4] * 1024), py2 = Math.floor(uvs[f*6+5] * 1024);
    if (px0 === px1 && px1 === px2 && py0 === py1 && py1 === py2) {
      sameTexelCount++;
      if (sameTexelFaces.length < 5) sameTexelFaces.push({ f, tier: Math.floor(atlasIndex[f]/6), ai: atlasIndex[f] });
    }
  }
  console.log(`Faces mapping to single texel at 1024: ${sameTexelCount} (these get 0 rasterized texels)`);
  // Check: how many secondary/remaining faces have UV area < 1 texel at 1024?
  let subTexelSecondary = 0, subTexelRemaining = 0;
  for (let f = 0; f < numFaces; f++) {
    const tier = Math.floor(atlasIndex[f] / 6);
    if (tier === 0) continue;
    const u0 = uvs[f*6], v0 = uvs[f*6+1];
    const u1 = uvs[f*6+2], v1 = uvs[f*6+3];
    const u2 = uvs[f*6+4], v2 = uvs[f*6+5];
    const texelArea = Math.abs((u1-u0)*(v2-v0) - (u2-u0)*(v1-v0)) * 0.5 * 1024 * 1024;
    if (texelArea < 1.0) {
      if (tier === 1) subTexelSecondary++;
      else subTexelRemaining++;
    }
  }
  console.log(`Sub-texel faces: secondary=${subTexelSecondary}, remaining=${subTexelRemaining}`);
  if (sameTexelFaces.length > 0) console.log(`Sample same-texel faces: ${JSON.stringify(sameTexelFaces)}`);

  // Diagnostic: count faces per tier
  const tierCounts = [0, 0, 0];
  for (let f = 0; f < numFaces; f++) {
    const t = Math.min(Math.floor(atlasIndex[f] / 6), 2);
    tierCounts[t]++;
  }
  console.log(`Atlas tiers: primary=${tierCounts[0]}, secondary=${tierCounts[1]}, remaining=${tierCounts[2]}, total=${numFaces}`);

  return { uvs, newVertices, newNormals, newFaces, newNumVertices, newNumFaces, faceAssignment: atlasIndex };
}

/**
 * Detect UV overlaps using BVH-accelerated triangle-triangle intersection.
 * Matching PyTorch's BVH approach: build a BVH per cube face slot, test each
 * triangle against the BVH, bump the occluded face (by depth) to slot+6.
 */
function _detectOverlapsBVH(numFaces, atlasIndex, rawU, rawV, centroidDepth,
    depthKeepMax, slotOffset, streamOverlaps = false) {

  for (let slot = slotOffset; slot < slotOffset + 6; slot++) {
    const slotFaces = [];
    for (let f = 0; f < numFaces; f++) {
      if (atlasIndex[f] === slot) slotFaces.push(f);
    }
    if (slotFaces.length < 2) continue;

    const baseSlot = slot % 6;
    const keepMax = depthKeepMax[baseSlot];

    // Build BVH from triangles in this slot
    const tris = slotFaces.map(f => ({
      f,
      u0: rawU[f*3], v0: rawV[f*3],
      u1: rawU[f*3+1], v1: rawV[f*3+1],
      u2: rawU[f*3+2], v2: rawV[f*3+2],
      minU: Math.min(rawU[f*3], rawU[f*3+1], rawU[f*3+2]),
      maxU: Math.max(rawU[f*3], rawU[f*3+1], rawU[f*3+2]),
      minV: Math.min(rawV[f*3], rawV[f*3+1], rawV[f*3+2]),
      maxV: Math.max(rawV[f*3], rawV[f*3+1], rawV[f*3+2]),
    }));

    const bvh = _buildBVH2D(tris);

    // For each triangle, query the BVH for overlapping triangles
    const bumped = new Set();
    // Collect all unique intersection pairs first (matching PyTorch)
    const pairs = streamOverlaps ? null : [];
    const occludedSet = new Set();

    for (const tri of tris) {
      if (bumped.has(tri.f)) continue;
      const candidates = _queryBVH2D(bvh, tri);
      for (const other of candidates) {
        if (other.f === tri.f || bumped.has(other.f)) continue;
        if (_trianglesOverlap2D(tri, other)) {
          const a = Math.min(tri.f, other.f);
          const b = Math.max(tri.f, other.f);
          if(streamOverlaps) {
            // Duplicate intersections select the same face; Set insertion is
            // idempotent. Still bump only after the complete unchanged query.
            occludedSet.add(keepMax ? (centroidDepth[a]>=centroidDepth[b]?a:b) :
              (centroidDepth[a]<=centroidDepth[b]?a:b));
          } else pairs.push([a, b]);
        }
      }
    }

    // Deduplicate pairs and determine which face to bump (by depth)
    const seen = new Set();
    for (const [a, b] of pairs ?? []) {
      const key = a * numFaces + b;
      if (seen.has(key)) continue;
      seen.add(key);

      // Determine which is occluded based on depth along cube face axis
      let occluded;
      if (keepMax) {
        occluded = (centroidDepth[a] >= centroidDepth[b]) ? a : b;
      } else {
        occluded = (centroidDepth[a] <= centroidDepth[b]) ? a : b;
      }
      occludedSet.add(occluded);
    }

    // Bump all occluded faces
    for (const f of occludedSet) {
      atlasIndex[f] = Math.min(atlasIndex[f] + 6, 12);
      bumped.add(f);
    }
  }
}

/** Same complete UV algorithm; discard duplicate-pair storage, not faces. */
export function unwrapResidentUV(vertices,faces,numVertices,numFaces) {
  return unwrapUV(vertices,faces,numVertices,numFaces,0.87,true);
}

/** Build a simple 2D AABB BVH over triangles. */
function _buildBVH2D(tris) {
  if (tris.length <= 4) return { tris, left: null, right: null };

  // Find split axis (longest extent)
  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
  for (const t of tris) {
    if (t.minU < minU) minU = t.minU;
    if (t.maxU > maxU) maxU = t.maxU;
    if (t.minV < minV) minV = t.minV;
    if (t.maxV > maxV) maxV = t.maxV;
  }

  const extU = maxU - minU, extV = maxV - minV;
  const axis = extU >= extV ? 'u' : 'v';

  // Sort by centroid on split axis and split at median
  const sorted = tris.slice().sort((a, b) => {
    const ca = axis === 'u' ? (a.minU + a.maxU) : (a.minV + a.maxV);
    const cb = axis === 'u' ? (b.minU + b.maxU) : (b.minV + b.maxV);
    return ca - cb;
  });

  const mid = sorted.length >> 1;
  return {
    tris: null,
    minU, maxU, minV, maxV,
    left: _buildBVH2D(sorted.slice(0, mid)),
    right: _buildBVH2D(sorted.slice(mid)),
  };
}

/** Query a 2D BVH for triangles whose AABB overlaps the query triangle's AABB. */
function _queryBVH2D(node, tri) {
  if (node.tris) {
    // Leaf: return triangles whose AABBs overlap
    const result = [];
    for (const t of node.tris) {
      if (t.maxU >= tri.minU && t.minU <= tri.maxU &&
          t.maxV >= tri.minV && t.minV <= tri.maxV) {
        result.push(t);
      }
    }
    return result;
  }

  // Interior: check AABB overlap with node bounds
  if (node.maxU < tri.minU || node.minU > tri.maxU ||
      node.maxV < tri.minV || node.minV > tri.maxV) {
    return [];
  }

  const left = _queryBVH2D(node.left, tri);
  const right = _queryBVH2D(node.right, tri);
  return left.concat(right);
}

/**
 * 2D triangle-triangle overlap test with area threshold.
 * Matching PyTorch: two triangles "overlap" only if their intersection polygon
 * has area > 1e-10. This filters out edge-touching adjacent faces (zero area)
 * while catching true UV overlaps from different surfaces.
 */
function _trianglesOverlap2D(a, b) {
  // Compute intersection polygon via Sutherland-Hodgman clipping
  const area = _triangleIntersectionArea2D(
    a.u0, a.v0, a.u1, a.v1, a.u2, a.v2,
    b.u0, b.v0, b.u1, b.v1, b.u2, b.v2
  );
  return area > 1e-10;
}

/** Compute the area of intersection between two 2D triangles via polygon clipping. */
function _triangleIntersectionArea2D(
  au0,av0,au1,av1,au2,av2,
  bu0,bv0,bu1,bv1,bu2,bv2
) {
  // Sutherland-Hodgman: clip triangle B against all edges of triangle A
  let poly = [[bu0,bv0],[bu1,bv1],[bu2,bv2]];
  const clip = [[au0,av0],[au1,av1],[au2,av2]];

  for (let i = 0; i < 3; i++) {
    if (poly.length === 0) return 0;
    const [ex, ey] = clip[i];
    const [fx, fy] = clip[(i + 1) % 3];
    const output = [];

    for (let j = 0; j < poly.length; j++) {
      const [cx, cy] = poly[j];
      const [dx, dy] = poly[(j + 1) % poly.length];
      const cSide = (fx - ex) * (cy - ey) - (fy - ey) * (cx - ex);
      const dSide = (fx - ex) * (dy - ey) - (fy - ey) * (dx - ex);

      if (cSide >= 0) {
        output.push([cx, cy]);
        if (dSide < 0) {
          output.push(_lineIntersect2D(cx, cy, dx, dy, ex, ey, fx, fy));
        }
      } else if (dSide >= 0) {
        output.push(_lineIntersect2D(cx, cy, dx, dy, ex, ey, fx, fy));
      }
    }
    poly = output;
  }

  if (poly.length < 3) return 0;

  // Shoelace formula for polygon area
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) * 0.5;
}

function _lineIntersect2D(ax, ay, bx, by, cx, cy, dx, dy) {
  const denom = (ax - bx) * (cy - dy) - (ay - by) * (cx - dx);
  if (Math.abs(denom) < 1e-15) return [(ax + bx) * 0.5, (ay + by) * 0.5];
  const t = ((ax - cx) * (cy - dy) - (ay - cy) * (cx - dx)) / denom;
  return [ax + t * (bx - ax), ay + t * (by - ay)];
}

/** 2D segment-segment intersection test using orientation predicates. */
function _segmentsIntersect2D(ax1,ay1,ax2,ay2, bx1,by1,bx2,by2) {
  const d1 = _orient2D(bx1,by1,bx2,by2, ax1,ay1);
  const d2 = _orient2D(bx1,by1,bx2,by2, ax2,ay2);
  const d3 = _orient2D(ax1,ay1,ax2,ay2, bx1,by1);
  const d4 = _orient2D(ax1,ay1,ax2,ay2, bx2,by2);

  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }

  // Collinear cases
  if (d1 === 0 && _onSegment2D(bx1,by1,bx2,by2, ax1,ay1)) return true;
  if (d2 === 0 && _onSegment2D(bx1,by1,bx2,by2, ax2,ay2)) return true;
  if (d3 === 0 && _onSegment2D(ax1,ay1,ax2,ay2, bx1,by1)) return true;
  if (d4 === 0 && _onSegment2D(ax1,ay1,ax2,ay2, bx2,by2)) return true;

  return false;
}

function _orient2D(ax,ay,bx,by,cx,cy) {
  const det = (ax - cx) * (by - cy) - (bx - cx) * (ay - cy);
  if (det < -1e-10) return -1;
  if (det > 1e-10) return 1;
  return 0;
}

function _onSegment2D(ax,ay,bx,by,px,py) {
  return Math.min(ax,bx) <= px + 1e-10 && px <= Math.max(ax,bx) + 1e-10 &&
         Math.min(ay,by) <= py + 1e-10 && py <= Math.max(ay,by) + 1e-10;
}

function _pointInTriangle2D(px,py, ax,ay,bx,by,cx,cy) {
  const d1 = _orient2D(ax,ay,bx,by,px,py);
  const d2 = _orient2D(bx,by,cx,cy,px,py);
  const d3 = _orient2D(cx,cy,ax,ay,px,py);
  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(hasNeg && hasPos);
}

/**
 * Rasterize UV space to get 3D positions and TBN basis at each texel.
 *
 * For each triangle in UV space, rasterize its bounding box and compute
 * barycentric interpolation of 3D positions. Also computes per-face
 * tangent/bitangent/normal basis from UV edges and position edges.
 *
 * @param {Float32Array} uvs - [N_v * 2] UV coordinates
 * @param {Float32Array} positions - [N_v * 3] vertex positions
 * @param {Uint32Array} faces - [N_f * 3] face indices
 * @param {number} numFaces
 * @param {number} resolution - texture resolution (default 1024)
 * @param {Uint8Array} [_faceAssignment] - unused, kept for API compat
 * @returns {{ positions3D: Float32Array, mask: Uint8Array, tbnData: Float32Array }}
 */
export function rasterizeUV(uvs, positions, faces, numFaces, resolution = 1024, _faceAssignment = null) {
  const positions3D = new Float32Array(resolution * resolution * 3);
  const mask = new Uint8Array(resolution * resolution);
  // TBN: 9 floats per texel (tangent[3], bitangent[3], normal[3])
  const tbnData = new Float32Array(resolution * resolution * 9);

  for (let f = 0; f < numFaces; f++) {
    const i0 = faces[f * 3], i1 = faces[f * 3 + 1], i2 = faces[f * 3 + 2];

    const u0 = uvs[i0 * 2], v0 = uvs[i0 * 2 + 1];
    const u1 = uvs[i1 * 2], v1 = uvs[i1 * 2 + 1];
    const u2 = uvs[i2 * 2], v2 = uvs[i2 * 2 + 1];

    const p0x = positions[i0*3], p0y = positions[i0*3+1], p0z = positions[i0*3+2];
    const p1x = positions[i1*3], p1y = positions[i1*3+1], p1z = positions[i1*3+2];
    const p2x = positions[i2*3], p2y = positions[i2*3+1], p2z = positions[i2*3+2];

    // Compute face TBN from edges and UV deltas
    const e1x = p1x-p0x, e1y = p1y-p0y, e1z = p1z-p0z;
    const e2x = p2x-p0x, e2y = p2y-p0y, e2z = p2z-p0z;
    const duv1u = u1-u0, duv1v = v1-v0;
    const duv2u = u2-u0, duv2v = v2-v0;

    // Face normal
    let fnx = e1y*e2z - e1z*e2y;
    let fny = e1z*e2x - e1x*e2z;
    let fnz = e1x*e2y - e1y*e2x;
    let fnLen = Math.sqrt(fnx*fnx + fny*fny + fnz*fnz) || 1;
    fnx /= fnLen; fny /= fnLen; fnz /= fnLen;

    // Tangent from UV gradients: T = (e1 * duv2v - e2 * duv1v) / det
    const det = duv1u * duv2v - duv1v * duv2u;
    let tx, ty, tz, bx, by, bz;
    if (Math.abs(det) > 1e-10) {
      const invDet = 1.0 / det;
      tx = (e1x * duv2v - e2x * duv1v) * invDet;
      ty = (e1y * duv2v - e2y * duv1v) * invDet;
      tz = (e1z * duv2v - e2z * duv1v) * invDet;
    } else {
      // Degenerate UV: pick arbitrary tangent perpendicular to normal
      tx = 1; ty = 0; tz = 0;
      if (Math.abs(fnx) > 0.9) { tx = 0; ty = 1; }
    }

    // Orthogonalize tangent against normal (Gram-Schmidt)
    const tDotN = tx*fnx + ty*fny + tz*fnz;
    tx -= tDotN * fnx; ty -= tDotN * fny; tz -= tDotN * fnz;
    let tLen = Math.sqrt(tx*tx + ty*ty + tz*tz) || 1;
    tx /= tLen; ty /= tLen; tz /= tLen;

    // Bitangent = cross(normal, tangent)
    bx = fny*tz - fnz*ty;
    by = fnz*tx - fnx*tz;
    bz = fnx*ty - fny*tx;
    let bLen = Math.sqrt(bx*bx + by*by + bz*bz) || 1;
    bx /= bLen; by /= bLen; bz /= bLen;

    // Bounding box in pixel coords
    const minPx = Math.max(0, Math.floor(Math.min(u0, u1, u2) * resolution));
    const maxPx = Math.min(resolution - 1, Math.ceil(Math.max(u0, u1, u2) * resolution));
    const minPy = Math.max(0, Math.floor(Math.min(v0, v1, v2) * resolution));
    const maxPy = Math.min(resolution - 1, Math.ceil(Math.max(v0, v1, v2) * resolution));

    const denom = (v1 - v2) * (u0 - u2) + (u2 - u1) * (v0 - v2);
    if (Math.abs(denom) < 1e-10) continue;
    const invDenom = 1.0 / denom;

    for (let py = minPy; py <= maxPy; py++) {
      for (let px = minPx; px <= maxPx; px++) {
        const u = (px + 0.5) / resolution;
        const v = (py + 0.5) / resolution;

        const w0 = ((v1 - v2) * (u - u2) + (u2 - u1) * (v - v2)) * invDenom;
        const w1 = ((v2 - v0) * (u - u2) + (u0 - u2) * (v - v2)) * invDenom;
        const w2 = 1 - w0 - w1;

        if (w0 >= -0.001 && w1 >= -0.001 && w2 >= -0.001) {
          const pixIdx = py * resolution + px;
          mask[pixIdx] = 1;
          positions3D[pixIdx * 3] = w0 * p0x + w1 * p1x + w2 * p2x;
          positions3D[pixIdx * 3 + 1] = w0 * p0y + w1 * p1y + w2 * p2y;
          positions3D[pixIdx * 3 + 2] = w0 * p0z + w1 * p1z + w2 * p2z;
          // TBN is constant per face (vertices are duplicated per face)
          const tbnBase = pixIdx * 9;
          tbnData[tbnBase]   = tx; tbnData[tbnBase+1] = ty; tbnData[tbnBase+2] = tz;
          tbnData[tbnBase+3] = bx; tbnData[tbnBase+4] = by; tbnData[tbnBase+5] = bz;
          tbnData[tbnBase+6] = fnx; tbnData[tbnBase+7] = fny; tbnData[tbnBase+8] = fnz;
        }
      }
    }
  }

  // Sub-texel face coverage: for faces whose UV triangle is smaller than
  // 1 texel, write face centroid position to unoccupied texels only.
  // CONDITIONAL write: never overwrite texels already covered by the main
  // rasterization pass, to avoid corrupting larger faces' data.
  for (let f = 0; f < numFaces; f++) {
    const i0 = faces[f * 3], i1 = faces[f * 3 + 1], i2 = faces[f * 3 + 2];
    const u0 = uvs[i0*2], v0 = uvs[i0*2+1];
    const u1 = uvs[i1*2], v1 = uvs[i1*2+1];
    const u2 = uvs[i2*2], v2 = uvs[i2*2+1];

    // Check UV triangle area in texels
    const texelArea = Math.abs((u1-u0)*(v2-v0) - (u2-u0)*(v1-v0)) * 0.5 * resolution * resolution;
    if (texelArea >= 1.0) continue; // adequately rasterized, skip

    // Face centroid in 3D
    const p0x = positions[i0*3], p0y = positions[i0*3+1], p0z = positions[i0*3+2];
    const p1x = positions[i1*3], p1y = positions[i1*3+1], p1z = positions[i1*3+2];
    const p2x = positions[i2*3], p2y = positions[i2*3+1], p2z = positions[i2*3+2];
    const cx = (p0x + p1x + p2x) / 3;
    const cy = (p0y + p1y + p2y) / 3;
    const cz = (p0z + p1z + p2z) / 3;

    // Face TBN
    const e1x = p1x-p0x, e1y = p1y-p0y, e1z = p1z-p0z;
    const e2x = p2x-p0x, e2y = p2y-p0y, e2z = p2z-p0z;
    let fnx = e1y*e2z - e1z*e2y, fny = e1z*e2x - e1x*e2z, fnz = e1x*e2y - e1y*e2x;
    const fnLen = Math.sqrt(fnx*fnx + fny*fny + fnz*fnz) || 1;
    fnx /= fnLen; fny /= fnLen; fnz /= fnLen;
    let tx = 1, ty = 0, tz = 0;
    if (Math.abs(fnx) > 0.9) { tx = 0; ty = 1; }
    const tDotN = tx*fnx + ty*fny + tz*fnz;
    tx -= tDotN*fnx; ty -= tDotN*fny; tz -= tDotN*fnz;
    const tLen = Math.sqrt(tx*tx + ty*ty + tz*tz) || 1;
    tx /= tLen; ty /= tLen; tz /= tLen;
    const bx = fny*tz - fnz*ty, by = fnz*tx - fnx*tz, bz = fnx*ty - fny*tx;

    // Write to unoccupied texels at vertex and centroid positions
    const texels = new Set();
    for (const [pu, pv] of [[u0,v0],[u1,v1],[u2,v2],[(u0+u1+u2)/3,(v0+v1+v2)/3]]) {
      const px = Math.min(resolution-1, Math.max(0, Math.floor(pu * resolution)));
      const py = Math.min(resolution-1, Math.max(0, Math.floor(pv * resolution)));
      texels.add(py * resolution + px);
    }

    for (const pixIdx of texels) {
      if (mask[pixIdx]) continue; // don't overwrite correctly-rasterized texels
      mask[pixIdx] = 1;
      positions3D[pixIdx * 3] = cx;
      positions3D[pixIdx * 3 + 1] = cy;
      positions3D[pixIdx * 3 + 2] = cz;
      const tbnBase = pixIdx * 9;
      tbnData[tbnBase] = tx; tbnData[tbnBase+1] = ty; tbnData[tbnBase+2] = tz;
      tbnData[tbnBase+3] = bx; tbnData[tbnBase+4] = by; tbnData[tbnBase+5] = bz;
      tbnData[tbnBase+6] = fnx; tbnData[tbnBase+7] = fny; tbnData[tbnBase+8] = fnz;
    }
  }

  return { positions3D, mask, tbnData };
}

/**
 * Bake albedo texture and normal map by querying the triplane decoder.
 *
 * @param {GPUDevice} device
 * @param {Object} triplaneDecoder - TriplaneDecoder instance
 * @param {GPUBuffer} triplanesBuf - [3, 40, 384, 384] triplane features
 * @param {Object} decoderWeights - decoder weights
 * @param {Float32Array} positions3D - [res*res, 3] from rasterizeUV
 * @param {Uint8Array} mask - [res*res] from rasterizeUV
 * @param {Float32Array} tbnData - [res*res, 9] TBN basis from rasterizeUV
 * @param {number} resolution
 * @returns {{ albedo: Uint8Array, normalMap: Uint8Array }} - [res, res, 4] RGBA textures
 */
/**
 * Decode features + perturb_normal for numOccupied query positions.
 *
 * Monolithic by default (one decode dispatch + one fence + one readback).
 * When `options.cooperativeBatch(batchStart, batchEnd, decodeBatch)` is supplied,
 * the texels are split into fixed batches and each batch is decoded as its own
 * GPU command duty via the caller's cooperative driver — collapsing the single
 * ~231ms contiguous decode+readback into yieldable batches. Per-texel decode is
 * independent, so batch outputs concatenated in order are byte-identical to the
 * monolithic path.
 *
 * @returns {Promise<{featuresCPU: Float32Array, normalsCPU: Float32Array}>}
 */
export async function decodeTexelFeatures(device, triplaneDecoder, triplanesBuf, decoderWeights,
                                          queryPositions, numOccupied, options = {}) {
  const decodeRange = async (start, end) => {
    const count = end - start;
    const sub = queryPositions.subarray(start * 3, end * 3);
    const startedAtMs = performance.now();
    const { value, allocations } = captureGpuBufferAllocations(() => {
      const posBuf = createStorageBuffer(device, sub);
      const encoder = device.createCommandEncoder({ label: `texel-decode-${start}-${end}` });
      const decoded = triplaneDecoder.decode(
        encoder, posBuf, triplanesBuf, count, decoderWeights, ['features', 'perturb_normal']);
      return { encoder, decoded, count };
    });
    return {
      ...value,
      hostEncodeMs: performance.now() - startedAtMs,
      scratchResources: allocations,
    };
  };

  const featuresCPU = new Float32Array(numOccupied * 3);
  const normalsCPU = new Float32Array(numOccupied * 3);

  if (typeof options.cooperativeBatch === 'function') {
    // Cooperative path: each batch's decode is a GPU duty (submit + facade
    // fence + browser yield). Crucially, batch outputs are copied into ONE
    // shared persistent buffer on the GPU (no per-batch readback) and read back
    // exactly ONCE at the end — otherwise a per-batch mapAsync forces a GPU sync
    // per batch and fine batching regresses badly (measured 1808ms at 61
    // batches). Coalesced readback keeps cooperation between decode duties only.
    //
    // Optional decoder scratch arena (options.arena): when present, the decoder
    // reuses one pre-allocated buffer per slot across all ranges instead of
    // rebuilding ~30 transient buffers per range (~1.015GB churn per Cranial's
    // assay). Arena slots bypass createEmptyBuffer, so captureGpuBufferAllocations
    // no longer records them — per-range scratchResources collapses to just the
    // small query-position buffer, and the existing per-prefix retire logic
    // still lawfully retires that. Exact per-range prefix completion is unchanged.
    const priorSlotProvider = triplaneDecoder._slotProvider;
    if (options.arena) triplaneDecoder._slotProvider = options.arena;
    const featuresAll = createEmptyBuffer(device, numOccupied * 3 * 4);
    const normalsAll = createEmptyBuffer(device, numOccupied * 3 * 4);
    try {
    await options.cooperativeBatch(numOccupied, async (start, end) => {
      const { encoder, decoded, count, hostEncodeMs, scratchResources } = await decodeRange(start, end);
      // Copy this batch's decode outputs into their slice of the shared buffers,
      // in the SAME command buffer, so no extra submit/sync is needed.
      encoder.copyBufferToBuffer(decoded.features, 0, featuresAll, start * 3 * 4, count * 3 * 4);
      encoder.copyBufferToBuffer(decoded.perturb_normal, 0, normalsAll, start * 3 * 4, count * 3 * 4);
      return {
        encode: () => encoder.finish(),
        submit: (cb) => device.queue.submit([cb]),
        hostEncodeMs,
        scratchResources,
      };
    });
    // Single coalesced readback of all batches.
    const readbackStartedAtMs = performance.now();
    let f;
    let n;
    try {
      f = await readBuffer(device, featuresAll, numOccupied * 3 * 4);
      n = await readBuffer(device, normalsAll, numOccupied * 3 * 4);
    } finally {
      featuresAll.destroy();
      normalsAll.destroy();
    }
    if (options.telemetry) {
      const readbackCompletedAtMs = performance.now();
      options.telemetry.readbackMs = readbackCompletedAtMs - readbackStartedAtMs;
      options.telemetry.readbackInterval = {
        startMs: readbackStartedAtMs,
        endMs: readbackCompletedAtMs,
      };
      options.telemetry.aggregateOutputBytes = numOccupied * 3 * 4 * 2;
      options.telemetry.aggregateOutputsRetired = true;
    }
    featuresCPU.set(f.subarray(0, numOccupied * 3));
    normalsCPU.set(n.subarray(0, numOccupied * 3));
    return { featuresCPU, normalsCPU };
    } finally {
      // Restore the decoder's slot provider so a non-arena decode later is
      // unaffected. The arena's own lifetime (allocation/retirement) is owned by
      // the phase-resource lease at the call site, not here.
      triplaneDecoder._slotProvider = priorSlotProvider;
    }
  }

  // Monolithic default (unchanged behavior).
  const { encoder, decoded } = await decodeRange(0, numOccupied);
  device.queue.submit([encoder.finish()]);
  await device.queue.onSubmittedWorkDone();
  const f = await readBuffer(device, decoded.features, numOccupied * 3 * 4);
  const n = await readBuffer(device, decoded.perturb_normal, numOccupied * 3 * 4);
  featuresCPU.set(f.subarray(0, numOccupied * 3));
  normalsCPU.set(n.subarray(0, numOccupied * 3));
  return { featuresCPU, normalsCPU };
}

export async function bakeTexture(device, triplaneDecoder, triplanesBuf, decoderWeights,
                                   positions3D, mask, tbnData, resolution = 1024, options = {}) {
  const cpuPrepStartedAtMs = performance.now();
  // Collect occupied texel positions
  const occupiedIndices = [];
  for (let i = 0; i < resolution * resolution; i++) {
    if (mask[i]) occupiedIndices.push(i);
  }

  const numOccupied = occupiedIndices.length;
  console.log(`Texture bake: ${numOccupied} occupied texels out of ${resolution * resolution}`);

  const emptyTex = new Uint8Array(resolution * resolution * 4);
  if (numOccupied === 0) {
    return { albedo: emptyTex, normalMap: new Uint8Array(emptyTex) };
  }

  // Pack occupied positions into a dense array
  const queryPositions = new Float32Array(numOccupied * 3);
  for (let i = 0; i < numOccupied; i++) {
    const idx = occupiedIndices[i];
    queryPositions[i * 3] = positions3D[idx * 3];
    queryPositions[i * 3 + 1] = positions3D[idx * 3 + 1];
    queryPositions[i * 3 + 2] = positions3D[idx * 3 + 2];
  }

  // Decode features + perturb_normal for every occupied texel. Per-texel decode
  // is fully independent, so this is monolithic by default but can be driven in
  // cooperative batches via options.cooperativeBatch (see decodeTexelFeatures).
  if (options.telemetry) {
    const cpuPrepCompletedAtMs = performance.now();
    options.telemetry.cpuPrepMs = cpuPrepCompletedAtMs - cpuPrepStartedAtMs;
    options.telemetry.cpuPrepInterval = {
      startMs: cpuPrepStartedAtMs,
      endMs: cpuPrepCompletedAtMs,
    };
  }
  const { featuresCPU, normalsCPU } = await decodeTexelFeatures(
    device, triplaneDecoder, triplanesBuf, decoderWeights, queryPositions, numOccupied, options);
  const materializationStartedAtMs = performance.now();

  // Materialize albedo + normal textures (+ dilation). Cranial's assay's ~752ms
  // single-threaded CPU tail. Optionally offloaded to a Web Worker
  // (options.materializeWorker) — byte-identical (same materialize_core math),
  // with no GPU sync and no per-duty fence floor. Main-thread path is the same
  // pure function.
  let albedo, normalMap, workerTransferMs = null;
  const matInput = { featuresCPU, normalsCPU, occupiedIndices, tbnData, mask, resolution, numOccupied };

  if (options.materializeWorker) {
    const worker = options.materializeWorker;
    const id = `mat-${Math.random().toString(36).slice(2)}`;
    // Copy the transferables so the caller's arrays stay intact; one copy each.
    const featuresBuf = featuresCPU.slice().buffer;
    const normalsBuf = normalsCPU.slice().buffer;
    const occupiedBuf = (occupiedIndices instanceof Uint32Array ? occupiedIndices : Uint32Array.from(occupiedIndices)).slice().buffer;
    const tbnBuf = tbnData.slice().buffer;
    const maskBuf = mask.slice().buffer;
    const transferStart = performance.now();
    const out = await withForegroundScope(options, 'texture-materialize-worker', () => callWorker(
      worker,
      { featuresBuf, normalsBuf, occupiedBuf, tbnBuf, maskBuf, resolution, numOccupied, id },
      [featuresBuf, normalsBuf, occupiedBuf, tbnBuf, maskBuf],
      {
        timeoutMs: options.workerTimeoutMs || 60000,
        onResult: (d) => {
          const a = new Uint8Array(d.albedo);
          const n = new Uint8Array(d.normalMap);
          const expected = resolution * resolution * 4;
          if (a.length !== expected || n.length !== expected) {
            throw new Error(`materialize output size ${a.length}/${n.length} != ${expected}`);
          }
          return { albedo: a, normalMap: n };
        },
      },
    ));
    albedo = out.albedo; normalMap = out.normalMap;
    workerTransferMs = performance.now() - transferStart;
  } else {
    const m = materializeTextures(matInput);
    albedo = m.albedo; normalMap = m.normalMap;
  }
  const materializationCompletedAtMs = performance.now();

  if (options.telemetry) {
    options.telemetry.cpuMaterializationMs = materializationCompletedAtMs - materializationStartedAtMs;
    options.telemetry.cpuMaterializationInterval = {
      startMs: materializationStartedAtMs,
      endMs: materializationCompletedAtMs,
    };
    options.telemetry.materializationOffloaded = Boolean(options.materializeWorker);
    options.telemetry.materializationWorkerTransferMs = workerTransferMs;
  }
  return { albedo, normalMap };
}

/**
 * Export mesh as GLB (binary glTF 2.0).
 *
 * @param {Float32Array} vertices - [N_v * 3]
 * @param {Float32Array} vertexNormals - [N_v * 3] pre-computed smooth normals
 * @param {Uint32Array} faces - [N_f * 3]
 * @param {Float32Array} uvs - [N_v * 2]
 * @param {Uint8Array} albedoTexture - [res, res, 4] RGBA
 * @param {Uint8Array|null} normalMapTexture - [res, res, 4] RGBA or null
 * @param {number} numVertices
 * @param {number} numFaces
 * @param {number} textureResolution
 * @param {number} roughness
 * @param {number} metallic
 * @returns {ArrayBuffer} GLB binary
 */
export async function exportGLB(vertices, vertexNormals, faces, uvs,
                                 albedoTexture, normalMapTexture,
                                 numVertices, numFaces, textureResolution = 1024,
                                 roughness = 0.5, metallic = 0.0, options = {}) {
  if (numVertices === 0 || numFaces === 0) {
    throw new Error('Cannot export empty mesh as GLB');
  }

  // Apply coordinate transforms to match glTF conventions
  // Combined: rot(-90, X) then rot(+90, Y) gives (x,y,z) → (-y, z, -x)
  // Then invert face winding to match PyTorch's mesh.invert()
  await options.onBeforeCpuAllocation?.('glb-transforms',24*numVertices+12*numFaces);
  const transformedVerts = new Float32Array(numVertices * 3);
  for (let i = 0; i < numVertices; i++) {
    const x = vertices[i * 3];
    const y = vertices[i * 3 + 1];
    const z = vertices[i * 3 + 2];
    const rx = x, ry = z, rz = -y;
    transformedVerts[i * 3] = rz;
    transformedVerts[i * 3 + 1] = ry;
    transformedVerts[i * 3 + 2] = -rx;
  }

  const invertedFaces = new Uint32Array(numFaces * 3);
  for (let f = 0; f < numFaces; f++) {
    invertedFaces[f * 3] = faces[f * 3];
    invertedFaces[f * 3 + 1] = faces[f * 3 + 2];
    invertedFaces[f * 3 + 2] = faces[f * 3 + 1];
  }

  // Apply same rotation to pre-computed smooth normals, then negate
  // for face inversion (winding flip makes outward normals point inward)
  // Rotation (x,y,z)→(-y,z,-x), then negate: (y,-z,x)
  const normals = new Float32Array(numVertices * 3);
  for (let i = 0; i < numVertices; i++) {
    const nx = vertexNormals[i * 3];
    const ny = vertexNormals[i * 3 + 1];
    const nz = vertexNormals[i * 3 + 2];
    normals[i * 3] = ny;
    normals[i * 3 + 1] = -nz;
    normals[i * 3 + 2] = nx;
  }

  // Encode textures as JPEG
  await options.onBeforeCpuAllocation?.('glb-albedo-image-data',4*textureResolution*textureResolution);
  const albedoBlob = await _textureToJPEG(albedoTexture, textureResolution);
  if (!albedoBlob) throw new Error('Failed to encode albedo texture as JPEG');
  await options.onBeforeCpuAllocation?.('glb-albedo-encoded',albedoBlob.size);
  const albedoBytes = new Uint8Array(await albedoBlob.arrayBuffer());

  let normalBytes = null;
  if (normalMapTexture) {
    await options.onBeforeCpuAllocation?.('glb-normal-image-data',4*textureResolution*textureResolution);
    const normalBlob = await _textureToJPEG(normalMapTexture, textureResolution, 0.95);
    if (normalBlob) {
      await options.onBeforeCpuAllocation?.('glb-normal-encoded',normalBlob.size);
      normalBytes = new Uint8Array(await normalBlob.arrayBuffer());
    }
  }
  if(options.requireNormalTexture&&!normalBytes)throw Error('complete learned normal texture encode required');

  // Compute bounding box
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < numVertices; i++) {
    const x = transformedVerts[i*3], y = transformedVerts[i*3+1], z = transformedVerts[i*3+2];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }

  const pad4 = (n) => (n + 3) & ~3;

  const vertexBytes = new Uint8Array(transformedVerts.buffer, transformedVerts.byteOffset, transformedVerts.byteLength);
  const vnormalBytes = new Uint8Array(normals.buffer, normals.byteOffset, normals.byteLength);
  const indexBytes = new Uint8Array(invertedFaces.buffer, invertedFaces.byteOffset, invertedFaces.byteLength);
  const uvBytes = new Uint8Array(uvs.buffer, uvs.byteOffset, uvs.byteLength);

  const vertexLen = pad4(vertexBytes.byteLength);
  const vnormalLen = pad4(vnormalBytes.byteLength);
  const indexLen = pad4(indexBytes.byteLength);
  const uvLen = pad4(uvBytes.byteLength);
  const albedoLen = pad4(albedoBytes.byteLength);
  const normalTexLen = normalBytes ? pad4(normalBytes.byteLength) : 0;
  const totalBinLen = vertexLen + vnormalLen + indexLen + uvLen + albedoLen + normalTexLen;

  let off = 0;
  const bufferViews = [
    { buffer: 0, byteOffset: (off), byteLength: vertexBytes.byteLength, target: 34962 },
    { buffer: 0, byteOffset: (off += vertexLen), byteLength: vnormalBytes.byteLength, target: 34962 },
    { buffer: 0, byteOffset: (off += vnormalLen), byteLength: indexBytes.byteLength, target: 34963 },
    { buffer: 0, byteOffset: (off += indexLen), byteLength: uvBytes.byteLength, target: 34962 },
    { buffer: 0, byteOffset: (off += uvLen), byteLength: albedoBytes.byteLength }, // albedo image
  ];
  const albedoImageBV = 4;
  let normalImageBV = -1;
  if (normalBytes) {
    normalImageBV = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset: (off += albedoLen), byteLength: normalBytes.byteLength });
  }

  const accessors = [
    { bufferView: 0, componentType: 5126, count: numVertices, type: 'VEC3',
      min: [minX, minY, minZ], max: [maxX, maxY, maxZ] },
    { bufferView: 1, componentType: 5126, count: numVertices, type: 'VEC3' },
    { bufferView: 2, componentType: 5125, count: numFaces * 3, type: 'SCALAR' },
    { bufferView: 3, componentType: 5126, count: numVertices, type: 'VEC2' },
  ];

  const images = [{ bufferView: albedoImageBV, mimeType: 'image/jpeg' }];
  const textures = [{ source: 0, sampler: 0 }];
  if (normalBytes) {
    images.push({ bufferView: normalImageBV, mimeType: 'image/jpeg' });
    textures.push({ source: 1, sampler: 0 });
  }

  const material = {
    pbrMetallicRoughness: {
      baseColorTexture: { index: 0 },
      roughnessFactor: roughness,
      metallicFactor: metallic,
    },
  };
  if (normalBytes) {
    material.normalTexture = { index: 1 };
  }

  const gltf = {
    asset: { version: '2.0', generator: 'SF3D-WebGPU' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{
      primitives: [{
        attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 3 },
        indices: 2,
        material: 0,
      }],
    }],
    materials: [material],
    textures,
    images,
    samplers: [{ magFilter: 9729, minFilter: 9729 }],
    accessors,
    bufferViews,
    buffers: [{ byteLength: totalBinLen }],
  };

  const jsonStr = JSON.stringify(gltf);
  // This exporter authors ASCII-only keys/values and finite numeric metadata.
  // Refuse drift rather than underdeclare TextEncoder's actual byte count.
  if(options.onBeforeCpuAllocation){
    if(/[^\x00-\x7f]/.test(jsonStr))throw Error('GLB authored JSON UTF8 demand changed');
    await options.onBeforeCpuAllocation('glb-json',jsonStr.length);
  }
  const jsonBytes = new TextEncoder().encode(jsonStr);
  const jsonPadLen = pad4(jsonBytes.byteLength);

  const glbLen = 12 + 8 + jsonPadLen + 8 + totalBinLen;
  await options.onBeforeCpuAllocation?.('glb-complete-buffer',glbLen);
  const glb = new ArrayBuffer(glbLen); // zero-initialized per JS spec (BIN padding = 0x00)
  const view = new DataView(glb);
  const bytes = new Uint8Array(glb);

  view.setUint32(0, 0x46546C67, true); // "glTF"
  view.setUint32(4, 2, true);
  view.setUint32(8, glbLen, true);

  let offset = 12;
  view.setUint32(offset, jsonPadLen, true);
  view.setUint32(offset + 4, 0x4E4F534A, true); // "JSON"
  offset += 8;
  bytes.set(jsonBytes, offset);
  for (let i = jsonBytes.byteLength; i < jsonPadLen; i++) bytes[offset + i] = 0x20;
  offset += jsonPadLen;

  view.setUint32(offset, totalBinLen, true);
  view.setUint32(offset + 4, 0x004E4942, true); // "BIN\0"
  offset += 8;

  bytes.set(vertexBytes, offset); offset += vertexLen;
  bytes.set(vnormalBytes, offset); offset += vnormalLen;
  bytes.set(indexBytes, offset); offset += indexLen;
  bytes.set(uvBytes, offset); offset += uvLen;
  bytes.set(albedoBytes, offset); offset += albedoLen;
  if (normalBytes) { bytes.set(normalBytes, offset); }

  return glb;
}

/**
 * Compute PCA rotation matrix that aligns the mesh's principal axes
 * with canonical X/Y/Z. Matching PyTorch _align_mesh_with_main_axis.
 *
 * Returns a 9-element Float32Array representing a 3×3 row-major rotation matrix.
 */
function _computePCARotation(vertices, numVertices) {
  // Center vertices
  let cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < numVertices; i++) {
    cx += vertices[i*3]; cy += vertices[i*3+1]; cz += vertices[i*3+2];
  }
  cx /= numVertices; cy /= numVertices; cz /= numVertices;

  // Compute 3×3 covariance matrix (symmetric)
  let c00 = 0, c01 = 0, c02 = 0, c11 = 0, c12 = 0, c22 = 0;
  for (let i = 0; i < numVertices; i++) {
    const dx = vertices[i*3] - cx, dy = vertices[i*3+1] - cy, dz = vertices[i*3+2] - cz;
    c00 += dx*dx; c01 += dx*dy; c02 += dx*dz;
    c11 += dy*dy; c12 += dy*dz; c22 += dz*dz;
  }

  // Jacobi eigendecomposition for symmetric 3×3 matrix.
  // Matrix A (symmetric, row-major): [c00, c01, c02, c01, c11, c12, c02, c12, c22]
  // Eigenvector matrix V starts as identity.
  const A = [c00, c01, c02, c01, c11, c12, c02, c12, c22];
  const V = [1,0,0, 0,1,0, 0,0,1]; // eigenvectors as columns

  for (let iter = 0; iter < 50; iter++) {
    // Find largest off-diagonal element
    let maxVal = 0, p = 0, q = 1;
    for (let i = 0; i < 3; i++) {
      for (let j = i + 1; j < 3; j++) {
        const absVal = Math.abs(A[i*3+j]);
        if (absVal > maxVal) { maxVal = absVal; p = i; q = j; }
      }
    }
    if (maxVal < 1e-12) break; // converged

    // Compute Jacobi rotation
    const app = A[p*3+p], aqq = A[q*3+q], apq = A[p*3+q];
    const tau = (aqq - app) / (2 * apq);
    const t = Math.sign(tau) / (Math.abs(tau) + Math.sqrt(1 + tau*tau));
    const c = 1 / Math.sqrt(1 + t*t);
    const s = t * c;

    // Update A: rotate rows/cols p and q
    const newA = A.slice();
    newA[p*3+p] = c*c*app - 2*s*c*apq + s*s*aqq;
    newA[q*3+q] = s*s*app + 2*s*c*apq + c*c*aqq;
    newA[p*3+q] = 0; newA[q*3+p] = 0;
    for (let r = 0; r < 3; r++) {
      if (r === p || r === q) continue;
      const arp = A[r*3+p], arq = A[r*3+q];
      newA[r*3+p] = c*arp - s*arq; newA[p*3+r] = newA[r*3+p];
      newA[r*3+q] = s*arp + c*arq; newA[q*3+r] = newA[r*3+q];
    }
    for (let i = 0; i < 9; i++) A[i] = newA[i];

    // Update V: rotate columns p and q
    for (let r = 0; r < 3; r++) {
      const vp = V[r*3+p], vq = V[r*3+q];
      V[r*3+p] = c*vp - s*vq;
      V[r*3+q] = s*vp + c*vq;
    }
  }

  // Eigenvalues are diagonal of A; eigenvectors are columns of V
  const eigenvalues = [A[0], A[4], A[8]];
  // Sort eigenvectors by descending eigenvalue (largest variance = main axis)
  const order = [0, 1, 2].sort((a, b) => eigenvalues[b] - eigenvalues[a]);

  // Extract sorted eigenvectors
  let mainAxis = [V[0*3+order[0]], V[1*3+order[0]], V[2*3+order[0]]];
  let secAxis  = [V[0*3+order[1]], V[1*3+order[1]], V[2*3+order[1]]];

  // Normalize main axis
  let len = Math.sqrt(mainAxis[0]**2 + mainAxis[1]**2 + mainAxis[2]**2) || 1;
  mainAxis = mainAxis.map(v => v / len);

  // Orthogonalize secondary against main (Gram-Schmidt)
  const dot = secAxis[0]*mainAxis[0] + secAxis[1]*mainAxis[1] + secAxis[2]*mainAxis[2];
  secAxis = secAxis.map((v, i) => v - dot * mainAxis[i]);
  len = Math.sqrt(secAxis[0]**2 + secAxis[1]**2 + secAxis[2]**2) || 1;
  secAxis = secAxis.map(v => v / len);

  // Third axis = cross(main, secondary)
  let thirdAxis = [
    mainAxis[1]*secAxis[2] - mainAxis[2]*secAxis[1],
    mainAxis[2]*secAxis[0] - mainAxis[0]*secAxis[2],
    mainAxis[0]*secAxis[1] - mainAxis[1]*secAxis[0],
  ];
  len = Math.sqrt(thirdAxis[0]**2 + thirdAxis[1]**2 + thirdAxis[2]**2) || 1;
  thirdAxis = thirdAxis.map(v => v / len);

  // Assign each PCA axis to the canonical axis it's most aligned with
  let mainIdx = _argmaxAbs(mainAxis);
  let secIdx = _argmaxAbs(secAxis);
  let thirdIdx = _argmaxAbs(thirdAxis);

  // Resolve conflicts (matching PyTorch logic)
  const used = new Set([mainIdx, secIdx, thirdIdx]);
  if (used.size !== 3) {
    const all = new Set([0, 1, 2]);
    let curIndex = 1;
    while (new Set([mainIdx, secIdx, thirdIdx]).size !== 3) {
      const missing = [...all].filter(x => ![mainIdx, secIdx, thirdIdx].includes(x))[0];
      if (curIndex === 1) thirdIdx = missing;
      else if (curIndex === 2) secIdx = missing;
      curIndex++;
      if (curIndex > 3) break;
    }
  }

  // Build rotation matrix: place each PCA axis in the row of its canonical axis
  // rot_mat = stack(axes, dim=1).T → axes[canonicalIdx] = pcaAxis → row canonicalIdx = pcaAxis
  const rotMat = new Float32Array(9);
  const axes = [mainAxis, secAxis, thirdAxis];
  const indices = [mainIdx, secIdx, thirdIdx];
  for (let i = 0; i < 3; i++) {
    rotMat[indices[i]*3 + 0] = axes[i][0];
    rotMat[indices[i]*3 + 1] = axes[i][1];
    rotMat[indices[i]*3 + 2] = axes[i][2];
  }

  return rotMat;
}

function _argmaxAbs(v) {
  const a0 = Math.abs(v[0]), a1 = Math.abs(v[1]), a2 = Math.abs(v[2]);
  if (a0 >= a1 && a0 >= a2) return 0;
  if (a1 >= a0 && a1 >= a2) return 1;
  return 2;
}

/**
 * Rotate UV slices so adjacent cube faces have consistent texture flow.
 *
 * For each cube face, computes the mean UV-derived tangent direction and
 * compares it against a canonical "expected" tangent derived from world-space
 * position and normals. Rotates all UVs in that face by the angle between
 * actual and expected tangents, then renormalizes to [0,1].
 *
 * Matches PyTorch's _rotate_uv_slices_consistent_space.
 */
function _rotateUVSlicesConsistentSpace(
  vertices, smoothNormals, faces, rawU, rawV, faceAssignment, numVertices, numFaces
) {
  // Step 1: Compute per-vertex tangents from UV gradients (area-weighted)
  const tangents = new Float32Array(numVertices * 3);
  const tanCount = new Float32Array(numVertices * 3);

  for (let f = 0; f < numFaces; f++) {
    const i0 = faces[f * 3], i1 = faces[f * 3 + 1], i2 = faces[f * 3 + 2];

    // Position edges
    const dp1x = vertices[i1*3] - vertices[i0*3];
    const dp1y = vertices[i1*3+1] - vertices[i0*3+1];
    const dp1z = vertices[i1*3+2] - vertices[i0*3+2];
    const dp2x = vertices[i2*3] - vertices[i0*3];
    const dp2y = vertices[i2*3+1] - vertices[i0*3+1];
    const dp2z = vertices[i2*3+2] - vertices[i0*3+2];

    // UV edges
    const du1 = rawU[f*3+1] - rawU[f*3];
    const dv1 = rawV[f*3+1] - rawV[f*3];
    const du2 = rawU[f*3+2] - rawU[f*3];
    const dv2 = rawV[f*3+2] - rawV[f*3];

    // Tangent numerator: dpos1 * dv2 - dpos2 * dv1
    const tx = dp1x * dv2 - dp2x * dv1;
    const ty = dp1y * dv2 - dp2y * dv1;
    const tz = dp1z * dv2 - dp2z * dv1;

    // Denominator: du1 * dv2 - dv1 * du2
    const denom = Math.max(du1 * dv2 - dv1 * du2, 1e-6);
    const ttx = tx / denom, tty = ty / denom, ttz = tz / denom;

    // Accumulate to all 3 vertices
    for (const idx of [i0, i1, i2]) {
      tangents[idx*3] += ttx;
      tangents[idx*3+1] += tty;
      tangents[idx*3+2] += ttz;
      tanCount[idx*3] += 1;
      tanCount[idx*3+1] += 1;
      tanCount[idx*3+2] += 1;
    }
  }

  // Average, normalize, then Gram-Schmidt orthogonalize against normals
  for (let i = 0; i < numVertices; i++) {
    const c = tanCount[i*3] || 1;
    let tx = tangents[i*3] / c, ty = tangents[i*3+1] / c, tz = tangents[i*3+2] / c;

    // Normalize
    let len = Math.sqrt(tx*tx + ty*ty + tz*tz) || 1;
    tx /= len; ty /= len; tz /= len;

    // Gram-Schmidt: t = normalize(t - dot(t, n) * n)
    const nx = smoothNormals[i*3], ny = smoothNormals[i*3+1], nz = smoothNormals[i*3+2];
    const tdn = tx*nx + ty*ny + tz*nz;
    tx -= tdn * nx; ty -= tdn * ny; tz -= tdn * nz;
    len = Math.sqrt(tx*tx + ty*ty + tz*tz) || 1;
    tangents[i*3] = tx / len;
    tangents[i*3+1] = ty / len;
    tangents[i*3+2] = tz / len;
  }

  // Step 2: Compute expected tangents per vertex
  // expected = normalize(cross(normal, cross([-y, x, 0], normal)))
  const expectedTangents = new Float32Array(numVertices * 3);
  for (let i = 0; i < numVertices; i++) {
    const nx = smoothNormals[i*3], ny = smoothNormals[i*3+1], nz = smoothNormals[i*3+2];
    // pos_stack = [-y, x, 0]
    const px = -vertices[i*3+1], py = vertices[i*3], pz = 0;

    // inner = cross(pos_stack, normal)
    const ix = py * nz - pz * ny;
    const iy = pz * nx - px * nz;
    const iz = px * ny - py * nx;

    // outer = cross(normal, inner)
    let ex = ny * iz - nz * iy;
    let ey = nz * ix - nx * iz;
    let ez = nx * iy - ny * ix;

    // Normalize
    const len = Math.sqrt(ex*ex + ey*ey + ez*ez) || 1;
    expectedTangents[i*3] = ex / len;
    expectedTangents[i*3+1] = ey / len;
    expectedTangents[i*3+2] = ez / len;
  }

  // Step 3: Per cube face, compute mean actual and expected tangent (3D),
  // find 2D rotation angle, rotate UVs
  for (let slot = 0; slot < 6; slot++) {
    // Collect mean actual and expected tangents across all faces in this slot
    // (averaged over all 3 vertices of each face, matching PyTorch's mean(dim=(0,1)))
    let actSumX = 0, actSumY = 0, actSumZ = 0;
    let expSumX = 0, expSumY = 0, expSumZ = 0;
    let count = 0;

    for (let f = 0; f < numFaces; f++) {
      if (faceAssignment[f] !== slot) continue;
      for (let vi = 0; vi < 3; vi++) {
        const idx = faces[f * 3 + vi];
        actSumX += tangents[idx*3];
        actSumY += tangents[idx*3+1];
        actSumZ += tangents[idx*3+2];
        expSumX += expectedTangents[idx*3];
        expSumY += expectedTangents[idx*3+1];
        expSumZ += expectedTangents[idx*3+2];
        count++;
      }
    }

    if (count === 0) continue;

    // Mean tangent vectors (3D)
    const amx = actSumX / count, amy = actSumY / count, amz = actSumZ / count;
    const emx = expSumX / count, emy = expSumY / count, emz = expSumZ / count;

    // 2D angle between actual and expected: dot and cross of 3D vectors
    // PyTorch does dot and cross on the mean 3D tangent vectors directly
    const dot = amx * emx + amy * emy + amz * emz;
    const cross = amx * emy - amy * emx;
    const angle = Math.atan2(cross, dot);

    const cosA = Math.cos(angle), sinA = Math.sin(angle);

    // Rotate all UVs in this slot:
    // Center to [-1, 1], rotate, then rescale to [0, 1]
    // First pass: rotate
    for (let f = 0; f < numFaces; f++) {
      if (faceAssignment[f] !== slot) continue;
      for (let vi = 0; vi < 3; vi++) {
        const idx = f * 3 + vi;
        const u = rawU[idx] * 2 - 1;
        const v = rawV[idx] * 2 - 1;
        rawU[idx] = cosA * u - sinA * v;
        rawV[idx] = sinA * u + cosA * v;
      }
    }

    // Second pass: rescale to [0, 1] using joint min/max across both U and V
    // (matching PyTorch: uv[mask] = (uv[mask] - uv[mask].min()) / (uv[mask].max() - uv[mask].min()))
    // This preserves aspect ratio after rotation.
    let jointMin = Infinity, jointMax = -Infinity;
    for (let f = 0; f < numFaces; f++) {
      if (faceAssignment[f] !== slot) continue;
      for (let vi = 0; vi < 3; vi++) {
        const idx = f * 3 + vi;
        if (rawU[idx] < jointMin) jointMin = rawU[idx];
        if (rawU[idx] > jointMax) jointMax = rawU[idx];
        if (rawV[idx] < jointMin) jointMin = rawV[idx];
        if (rawV[idx] > jointMax) jointMax = rawV[idx];
      }
    }
    const jointRange = jointMax - jointMin || 1;
    for (let f = 0; f < numFaces; f++) {
      if (faceAssignment[f] !== slot) continue;
      for (let vi = 0; vi < 3; vi++) {
        const idx = f * 3 + vi;
        rawU[idx] = (rawU[idx] - jointMin) / jointRange;
        rawV[idx] = (rawV[idx] - jointMin) / jointRange;
      }
    }
  }
}

function _textureToJPEG(texture, resolution, quality = 0.92) {
  if (typeof OffscreenCanvas !== 'function') throw new Error('SF3D texture encoding requires OffscreenCanvas');
  const canvas = new OffscreenCanvas(resolution, resolution);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('SF3D texture canvas is unavailable');
  const imgData = ctx.createImageData(resolution, resolution);
  imgData.data.set(texture);
  ctx.putImageData(imgData, 0, 0);
  return canvas.convertToBlob({ type: 'image/jpeg', quality });
}

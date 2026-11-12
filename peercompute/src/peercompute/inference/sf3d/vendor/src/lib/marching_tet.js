/**
 * marching_tet.js — CPU-side marching tetrahedra mesh extraction.
 *
 * Port of sf3d/models/isosurface.py MarchingTetrahedraHelper._forward.
 *
 * Input: SDF values at grid vertices + vertex offsets
 * Output: { vertices: Float32Array([x,y,z,...]), faces: Uint32Array([i,j,k,...]) }
 */

import { callWorker } from './worker_call.js';
import {isLoaderMemoryBudget} from './loader_memory_budget.js';

// Lookup tables (matching the buffers in system.py)
const TRIANGLE_TABLE = [
  [-1, -1, -1, -1, -1, -1],
  [1, 0, 2, -1, -1, -1],
  [4, 0, 3, -1, -1, -1],
  [1, 4, 2, 1, 3, 4],
  [3, 1, 5, -1, -1, -1],
  [2, 3, 0, 2, 5, 3],
  [1, 4, 0, 1, 5, 4],
  [4, 2, 5, -1, -1, -1],
  [4, 5, 2, -1, -1, -1],
  [4, 1, 0, 4, 5, 1],
  [3, 2, 0, 3, 5, 2],
  [1, 3, 5, -1, -1, -1],
  [4, 1, 2, 4, 3, 1],
  [3, 0, 4, -1, -1, -1],
  [2, 0, 1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1],
];

const NUM_TRIANGLES_TABLE = [0, 1, 1, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 1, 0];

const BASE_TET_EDGES = [0, 1, 0, 2, 0, 3, 1, 2, 1, 3, 2, 3];
const SOURCE_PUBLIC_BASE_PATH = import.meta.env?.BASE_URL || '/';
const SOURCE_PUBLIC_BASE_URL = resolveSourcePublicBaseUrl(
  SOURCE_PUBLIC_BASE_PATH,
  import.meta.url,
  import.meta.env?.DEV === true,
);
const DEFAULT_TET_BASE_PATH = new URL('tets/', SOURCE_PUBLIC_BASE_URL).href;

export function resolveSourcePublicBaseUrl(basePath, moduleUrl, development = false) {
  const value = String(basePath || '');
  if (!value || value.startsWith('.')) {
    if (development) return new URL('/', moduleUrl);
    // Built layouts: Vite emits chunks (the app entry, every worker) under
    // assets/ with the public directory one level up; a library build's
    // entry sits at the library root with its workers under assets/. In both
    // the public base is the directory that contains assets/.
    const dir = new URL('./', moduleUrl);
    return dir.pathname.endsWith('/assets/') ? new URL('../', dir) : dir;
  }
  return new URL(value, moduleUrl);
}

async function fetchTetArrayBuffer(url, bytesPerElement) {
  throw new Error('PeerCompute requires artifact-backed SF3D tet data');
}

/**
 * Load tetrahedra grid data from binary files.
 *
 * Relative paths resolve from the SF3D source's Vite public base, never the host document.
 *
 * @param {string|URL} basePath - path or URL to a tets directory (e.g., 'tets/')
 * @returns {Object} - { gridVertices, indices }
 */
/**
 * Grid vertices only (the decoder's query positions). Used by the main thread
 * when a Worker owns marching tetrahedra and the 47 MB index table is not
 * needed there.
 */
export async function loadTetGridVertices(basePath = DEFAULT_TET_BASE_PATH) {
  const normalizedBase = String(basePath).endsWith('/') ? String(basePath) : `${basePath}/`;
  const resolvedBase = new URL(normalizedBase, SOURCE_PUBLIC_BASE_URL);
  const gridUrl = new URL('_grid_vertices.bin', resolvedBase).href;
  const gridVertices = new Float32Array(await fetchTetArrayBuffer(gridUrl, Float32Array.BYTES_PER_ELEMENT));
  if (gridVertices.length % 3 !== 0) {
    throw new Error(`Tet vertex asset ${gridUrl} has ${gridVertices.length} values; expected xyz triples`);
  }
  return { gridVertices, indices: null, numVertices: gridVertices.length / 3, numTets: null };
}

export async function loadTetData(basePath = DEFAULT_TET_BASE_PATH) {
  const normalizedBase = String(basePath).endsWith('/') ? String(basePath) : `${basePath}/`;
  const resolvedBase = new URL(normalizedBase, SOURCE_PUBLIC_BASE_URL);
  const gridUrl = new URL('_grid_vertices.bin', resolvedBase).href;
  const indicesUrl = new URL('indices.bin', resolvedBase).href;
  const [vertsBuf, indicesBuf] = await Promise.all([
    fetchTetArrayBuffer(gridUrl, Float32Array.BYTES_PER_ELEMENT),
    fetchTetArrayBuffer(indicesUrl, Int32Array.BYTES_PER_ELEMENT),
  ]);

  const gridVertices = new Float32Array(vertsBuf);  // [N_v, 3]
  const indices = new Int32Array(indicesBuf);        // [N_t, 4]
  if (gridVertices.length % 3 !== 0) {
    throw new Error(`Tet vertex asset ${gridUrl} has ${gridVertices.length} values; expected xyz triples`);
  }
  if (indices.length % 4 !== 0) {
    throw new Error(`Tet index asset ${indicesUrl} has ${indices.length} values; expected tetrahedra quads`);
  }

  return {
    gridVertices,
    numVertices: gridVertices.length / 3,
    indices,
    numTets: indices.length / 4,
  };
}

/**
 * Run marching tetrahedra to extract a mesh from SDF values.
 *
 * @param {Float32Array} gridVertices - [N_v, 3] grid vertex positions
 * @param {Float32Array} sdf - [N_v] signed distance values (positive = inside)
 * @param {Int32Array} tetIndices - [N_t, 4] tetrahedra vertex indices
 * @param {Float32Array|null} vertexOffsets - [N_v, 3] optional vertex deformations
 * @param {number} resolution - grid resolution (for normalizing deformation)
 * @returns {{ vertices: Float32Array, faces: Uint32Array, numVertices: number, numFaces: number }}
 */
export function marchingTetrahedra(gridVertices, sdf, tetIndices, vertexOffsets = null, resolution = 160) {
  const N_v = gridVertices.length / 3;
  const N_t = tetIndices.length / 4;

  // Apply vertex deformation if provided
  let positions;
  if (vertexOffsets) {
    // normalize_grid_deformation: PyTorch uses (1-0)/resolution in [0,1] space,
    // then post-scales by bbox range (1.74). We're already in bbox space, so
    // apply the full factor directly: 1.74 / resolution.
    const scale = 1.74 / resolution;
    positions = new Float32Array(N_v * 3);
    for (let i = 0; i < N_v * 3; i++) {
      positions[i] = gridVertices[i] + scale * Math.tanh(vertexOffsets[i]);
    }
  } else {
    positions = gridVertices;
  }

  // Determine occupancy: sdf > 0 means inside
  const occ = new Uint8Array(N_v);
  for (let i = 0; i < N_v; i++) {
    occ[i] = sdf[i] > 0 ? 1 : 0;
  }

  // Find valid tetrahedra (partially occupied: 0 < occ_sum < 4)
  const validTets = [];
  for (let t = 0; t < N_t; t++) {
    const base = t * 4;
    const sum = occ[tetIndices[base]] + occ[tetIndices[base + 1]] +
                occ[tetIndices[base + 2]] + occ[tetIndices[base + 3]];
    if (sum > 0 && sum < 4) {
      validTets.push(t);
    }
  }

  // Collect all edges from valid tetrahedra
  // Each tet has 6 edges (from BASE_TET_EDGES: pairs of vertex indices within tet)
  const edgeMap = new Map(); // "v0,v1" → edge index
  const edgeList = [];       // [[v0, v1], ...]
  const tetEdgeIndices = new Int32Array(validTets.length * 6); // per-valid-tet edge mapping

  for (let vi = 0; vi < validTets.length; vi++) {
    const t = validTets[vi];
    const tetBase = t * 4;
    for (let e = 0; e < 6; e++) {
      let v0 = tetIndices[tetBase + BASE_TET_EDGES[e * 2]];
      let v1 = tetIndices[tetBase + BASE_TET_EDGES[e * 2 + 1]];
      // Sort edge vertices
      if (v0 > v1) { const tmp = v0; v0 = v1; v1 = tmp; }
      const key = `${v0},${v1}`;
      let edgeIdx;
      if (edgeMap.has(key)) {
        edgeIdx = edgeMap.get(key);
      } else {
        edgeIdx = edgeList.length;
        edgeMap.set(key, edgeIdx);
        edgeList.push([v0, v1]);
      }
      tetEdgeIndices[vi * 6 + e] = edgeIdx;
    }
  }

  // Find edges that cross the isosurface (one vertex inside, one outside)
  const crossingEdges = [];
  const edgeToVertex = new Int32Array(edgeList.length).fill(-1);
  let vertexCount = 0;

  for (let i = 0; i < edgeList.length; i++) {
    const [v0, v1] = edgeList[i];
    if (occ[v0] !== occ[v1]) {
      edgeToVertex[i] = vertexCount++;
      crossingEdges.push(i);
    }
  }

  // Interpolate vertex positions along crossing edges
  const vertices = new Float32Array(vertexCount * 3);
  for (const edgeIdx of crossingEdges) {
    const [v0, v1] = edgeList[edgeIdx];
    const s0 = sdf[v0];
    const s1 = sdf[v1];
    // Linear interpolation: find zero crossing
    // s0 + t*(s1-s0) = 0 → t = -s0/(s1-s0) = s0/(s0-s1)
    const denom = s0 - s1;
    const t = denom !== 0 ? s0 / denom : 0.5;

    const outIdx = edgeToVertex[edgeIdx] * 3;
    for (let d = 0; d < 3; d++) {
      vertices[outIdx + d] = positions[v0 * 3 + d] * (1 - t) + positions[v1 * 3 + d] * t;
    }
  }

  // Generate triangle faces using lookup table
  const faceList = [];
  for (let vi = 0; vi < validTets.length; vi++) {
    const t = validTets[vi];
    const tetBase = t * 4;

    // Compute tet index for lookup table
    let tetindex = 0;
    for (let j = 0; j < 4; j++) {
      if (occ[tetIndices[tetBase + j]]) {
        tetindex |= (1 << j);
      }
    }

    const numTri = NUM_TRIANGLES_TABLE[tetindex];
    const triRow = TRIANGLE_TABLE[tetindex];

    for (let tri = 0; tri < numTri; tri++) {
      const i0 = edgeToVertex[tetEdgeIndices[vi * 6 + triRow[tri * 3]]];
      const i1 = edgeToVertex[tetEdgeIndices[vi * 6 + triRow[tri * 3 + 1]]];
      const i2 = edgeToVertex[tetEdgeIndices[vi * 6 + triRow[tri * 3 + 2]]];

      if (i0 >= 0 && i1 >= 0 && i2 >= 0) {
        faceList.push(i0, i1, i2);
      }
    }
  }

  const faces = new Uint32Array(faceList);

  return {
    vertices,
    faces,
    numVertices: vertexCount,
    numFaces: faces.length / 3,
  };
}

/**
 * Opt-in complete marching with counted typed backing. The edge hash contains
 * crossing edges only, in the same first-encounter order as the ordinary
 * routine's filtered all-edge list. Math/tables/winding are unchanged.
 * Escaping mesh storage stays charged to the caller's handle until disposal.
 * Lease release is not a statement of physical reclamation.
 */
export async function runResidentMarchingTetrahedra({handle,memoryBudget,gridVertices,sdf,tetIndices,
  vertexOffsets=null,resolution=160,onBeforePhase}) {
  if(!isLoaderMemoryBudget(memoryBudget))throw TypeError('authenticated marching budget required');
  if(!handle||handle._residentMarchingOwner)throw Error('unoccupied owned marching handle required');
  if(typeof onBeforePhase!=='function')throw TypeError('fresh before-allocation marching guard required');
  if(!(gridVertices instanceof Float32Array)||gridVertices.length%3||!(sdf instanceof Float32Array)||
    sdf.length!==gridVertices.length/3||!(tetIndices instanceof Int32Array)||tetIndices.length%4||
    (vertexOffsets!==null&&(!(vertexOffsets instanceof Float32Array)||vertexOffsets.length!==gridVertices.length))||
    !Number.isFinite(resolution)||resolution<=0)throw TypeError('complete finite marching shape required');
  const nv=sdf.length,nt=tetIndices.length/4;
  for(const array of [gridVertices,sdf,vertexOffsets])if(array)
    for(const value of array)if(!Number.isFinite(value))throw Error('nonfinite marching input');
  const caseAt=t=>{
    let bits=0;
    for(let j=0;j<4;j++){
      const v=tetIndices[t*4+j];
      if(v<0||v>=nv)throw Error('marching tet index outside complete grid');
      if(sdf[v]>0)bits|=1<<j;
    }
    return bits;
  };
  let validCount=0,numTriangles=0,edgeCapacity=0;
  // Count before any large allocation; all input indices are validated here.
  for(let t=0;t<nt;t++){
    const bits=caseAt(t),triangles=NUM_TRIANGLES_TABLE[bits];
    if(triangles){
      validCount++;numTriangles+=triangles;
      for(let e=0;e<6;e++)if(((bits>>BASE_TET_EDGES[e*2])&1)!==
        ((bits>>BASE_TET_EDGES[e*2+1])&1))edgeCapacity++;
    }
  }
  let hashSlots=1;
  while(hashSlots<2*edgeCapacity)hashSlots*=2;
  const scratchBytes=(vertexOffsets?gridVertices.byteLength:0)+nv+validCount*28+
    edgeCapacity*8+hashSlots*4;
  if(!Number.isSafeInteger(scratchBytes))throw Error('marching backing demand exceeds exact integer capacity');
  const owner={scratch:null,scratchLease:null,outputLease:null,value:null};
  handle._residentMarchingOwner=owner;
  try{
    await onBeforePhase({name:'marching-counted-scratch',rangeCpuBytes:scratchBytes,workGpuBytes:0,
      requiredBytes:scratchBytes,validTets:validCount,edgeCapacity,hashSlots,numTriangles,gridPoints:nv});
    if(handle._residentMarchingOwner!==owner)throw Error('marching owner disposed during guard');
    owner.scratchLease=memoryBudget.reserveCpu(scratchBytes,'marching-counted-scratch');
    const s=owner.scratch={};
    s.positions=vertexOffsets?new Float32Array(gridVertices.length):gridVertices;
    s.occ=new Uint8Array(nv);s.valid=new Uint32Array(validCount);
    s.tetEdges=new Int32Array(validCount*6).fill(-1);
    s.edge0=new Uint32Array(edgeCapacity);s.edge1=new Uint32Array(edgeCapacity);
    s.hash=new Uint32Array(hashSlots);
    if(vertexOffsets){const scale=1.74/resolution;
      for(let i=0;i<gridVertices.length;i++)s.positions[i]=gridVertices[i]+scale*Math.tanh(vertexOffsets[i]);}
    for(let i=0;i<nv;i++)s.occ[i]=sdf[i]>0?1:0;
    let vi=0,vertexCount=0,faceCount=0;
    for(let t=0;t<nt;t++){
      const bits=caseAt(t);
      if(!NUM_TRIANGLES_TABLE[bits])continue;
      if(vi>=validCount)throw Error('marching input changed during guarded allocation');
      s.valid[vi]=t;faceCount+=NUM_TRIANGLES_TABLE[bits];
      for(let e=0;e<6;e++){
        let v0=tetIndices[t*4+BASE_TET_EDGES[e*2]],v1=tetIndices[t*4+BASE_TET_EDGES[e*2+1]];
        if(s.occ[v0]===s.occ[v1])continue;
        if(v0>v1){const v=v0;v0=v1;v1=v;}
        let slot=((Math.imul(v0,0x9e3779b1)^Math.imul(v1,0x85ebca6b))>>>0)%hashSlots;
        let id;
        for(;;){
          const entry=s.hash[slot];
          if(!entry){
            if(vertexCount>=edgeCapacity)throw Error('marching crossing demand changed');
            id=vertexCount++;s.edge0[id]=v0;s.edge1[id]=v1;s.hash[slot]=id+1;break;
          }
          id=entry-1;
          if(s.edge0[id]===v0&&s.edge1[id]===v1)break;
          slot=(slot+1)%hashSlots;
        }
        s.tetEdges[vi*6+e]=id;
      }
      vi++;
    }
    if(vi!==validCount||faceCount!==numTriangles)throw Error('marching counted topology changed');
    const outputBytes=vertexCount*12+numTriangles*12;
    await onBeforePhase({name:'marching-complete-mesh',rangeCpuBytes:outputBytes,workGpuBytes:0,
      requiredBytes:outputBytes,numVertices:vertexCount,numFaces:numTriangles,gridPoints:nv});
    if(handle._residentMarchingOwner!==owner)throw Error('marching owner disposed during guard');
    owner.outputLease=memoryBudget.reserveCpu(outputBytes,'marching-complete-mesh');
    const output=owner.value={vertices:new Float32Array(vertexCount*3),faces:new Uint32Array(numTriangles*3),
      numVertices:vertexCount,numFaces:numTriangles};
    for(let id=0;id<vertexCount;id++){
      const v0=s.edge0[id],v1=s.edge1[id],s0=sdf[v0],s1=sdf[v1],denom=s0-s1;
      const t=denom!==0?s0/denom:0.5;
      for(let d=0;d<3;d++)output.vertices[id*3+d]=s.positions[v0*3+d]*(1-t)+s.positions[v1*3+d]*t;
    }
    let f=0;
    for(let v=0;v<validCount;v++){
      const bits=caseAt(s.valid[v]),row=TRIANGLE_TABLE[bits];
      for(let j=0;j<NUM_TRIANGLES_TABLE[bits]*3;j++){
        const id=s.tetEdges[v*6+row[j]];
        if(id<0||id>=vertexCount)throw Error('marching lookup has no crossing vertex');
        output.faces[f++]=id;
      }
    }
    if(f!==output.faces.length)throw Error('marching complete face count drift');
    owner.scratch=null;owner.scratchLease.release();owner.scratchLease=null;
    return output;
  }catch(error){if(handle._residentMarchingOwner===owner)disposeResidentMarchingTetrahedra(handle);throw error;}
}

export function disposeResidentMarchingTetrahedra(handle){
  const owner=handle?._residentMarchingOwner;if(!owner)return;
  owner.scratch=null;owner.scratchLease?.release();owner.scratchLease=null;
  if(owner.value){owner.value.vertices=new Float32Array(0);owner.value.faces=new Uint32Array(0);owner.value=null;}
  owner.outputLease?.release();owner.outputLease=null;handle._residentMarchingOwner=null;
}

/**
 * Scale tensor from one range to another.
 * Matches sf3d.models.utils.scale_tensor.
 */
export function scaleTensor(data, fromRange, toRange) {
  const [fromMin, fromMax] = fromRange;
  const [toMin, toMax] = toRange;
  const scale = (toRange[1] - toRange[0]) / (fromMax - fromMin);
  const offset = toRange[0] - fromMin * scale;
  const result = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] * scale + offset;
  }
  return result;
}

/**
 * Validate a marching-tet worker reply before it reaches the texture pipeline.
 * Rejects malformed geometry (wrong lengths, out-of-range indices, non-finite
 * positions) instead of passing it downstream.
 */
export function validateMarchingTetReply(d) {
  const numVertices = d?.numVertices;
  const numFaces = d?.numFaces;
  if (!Number.isSafeInteger(numVertices) || numVertices <= 0) throw new Error(`marching-tet reply numVertices invalid: ${numVertices}`);
  if (!Number.isSafeInteger(numFaces) || numFaces <= 0) throw new Error(`marching-tet reply numFaces invalid: ${numFaces}`);
  if (!(d.vertices instanceof ArrayBuffer) || !(d.faces instanceof ArrayBuffer)) {
    throw new Error('marching-tet reply must carry vertices and faces ArrayBuffers');
  }
  const vertices = new Float32Array(d.vertices);
  const faces = new Uint32Array(d.faces);
  if (vertices.length !== numVertices * 3) throw new Error(`marching-tet vertices length ${vertices.length} != ${numVertices * 3}`);
  if (faces.length !== numFaces * 3) throw new Error(`marching-tet faces length ${faces.length} != ${numFaces * 3}`);
  for (let i = 0; i < vertices.length; i++) {
    if (!Number.isFinite(vertices[i])) throw new Error(`marching-tet vertex value non-finite at ${i}`);
  }
  for (let i = 0; i < faces.length; i++) {
    if (faces[i] >= numVertices) throw new Error(`marching-tet face index ${faces[i]} out of range at ${i}`);
  }
  return { vertices, faces, numVertices, numFaces };
}

/**
 * Run marching tetrahedra on a Worker (marching_tet_worker.js), which owns the
 * resident tet grid and scales it to `bbox` itself. The caller's sdf and
 * vertexOffsets are copied, not detached (inference still returns sdf for
 * parity). Fail-loud through callWorker; never falls back silently.
 */
export async function runMarchingTetOnWorker(worker, { sdf, vertexOffsets, bbox, resolution }, { timeoutMs = 30000 } = {}) {
  if (!(sdf instanceof Float32Array)) throw new TypeError('sdf must be a Float32Array');
  if (vertexOffsets != null && !(vertexOffsets instanceof Float32Array)) throw new TypeError('vertexOffsets must be a Float32Array or null');
  const sdfBuf = sdf.slice().buffer;
  const offBuf = vertexOffsets ? vertexOffsets.slice().buffer : null;
  const transfer = offBuf ? [sdfBuf, offBuf] : [sdfBuf];
  return await callWorker(
    worker,
    { id: `marching-tet-${Math.random().toString(36).slice(2)}`, sdf: sdfBuf, vertexOffsets: offBuf, bbox, resolution },
    transfer,
    { timeoutMs, onResult: validateMarchingTetReply },
  );
}

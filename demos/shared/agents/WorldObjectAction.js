import { artifactCID } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { normalizeWorldModelSize, resolveWorldModelSize, WORLD_MODEL_SIZE } from '../world/WorldModelScale.js';

export const WORLD_OBJECT_SCHEMA = 'peercompute.world.generated-object.v1';
export const WORLD_OBJECT_LIMITS = Object.freeze({ perOwner: 32, visible: 128, promptBytes: 1024, nameBytes: 120,
  minimumSize: WORLD_MODEL_SIZE.minimum, maximumSize: WORLD_MODEL_SIZE.maximum, maximumCoordinate: 100000, meshBytes: 16 * 1024 * 1024 });
const bytes = value => new TextEncoder().encode(value).length;
export function objectText(value, maximum, label) {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u001f\u007f]/.test(value)
      || bytes(value) > maximum || !value.isWellFormed()) throw new TypeError(`Invalid generated object ${label}`);
  return value;
}
function fields(value, names) {
  if (!value || Array.isArray(value) || typeof value !== 'object' || Object.keys(value).some(key => !names.includes(key))) {
    throw new TypeError('Unexpected generated object fields');
  }
}
const identifier = value => {
  if (typeof value !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(value)) throw new TypeError('Invalid generated object identity');
  return value;
};
export function objectPosition(value) {
  if (!Array.isArray(value) || value.length !== 3 || value.some(n => !Number.isFinite(n) || Math.abs(n) > WORLD_OBJECT_LIMITS.maximumCoordinate)) {
    throw new TypeError('Invalid generated object position');
  }
  return [...value];
}
function objectSize(value) {
  return normalizeWorldModelSize(value);
}

/** A proposal is descriptive data; it never grants ownership or arbitrary code. */
export function normalizeWorldObjectAction(value) {
  fields(value, ['name', 'prompt', 'size']);
  const action = { name: objectText(value.name, WORLD_OBJECT_LIMITS.nameBytes, 'name'),
    prompt: objectText(value.prompt, WORLD_OBJECT_LIMITS.promptBytes, 'description') };
  return { ...action, size: resolveWorldModelSize(value.size, action) };
}
export const WORLD_OBJECT_ACTION_INSTRUCTIONS = 'You may also create a 3D object when the owner explicitly asks you to generate/build/place a new object. '
  + 'Return an object with name, prompt and size, for example {"object":{"name":"Coffee mug","prompt":"One ceramic coffee mug on a plain white background","size":0.8}}. '
  + 'The object is placed beside your cube. This only proposes generation; do not claim it already exists. '
  + 'Do not create objects for questions, hypothetical examples, avatars, or movement requests.';

export function normalizeWorldObjectPlacement(value, { worldId, ownerHostId } = {}) {
  fields(value, ['schema', 'worldId', 'ownerHostId', 'agentId', 'objectId', 'requestId', 'requestHash', 'name', 'position', 'size']);
  if (value.schema !== WORLD_OBJECT_SCHEMA || (worldId !== undefined && value.worldId !== worldId)
      || (ownerHostId !== undefined && value.ownerHostId !== ownerHostId)) throw new Error('Generated object world or owner mismatch');
  if (!/^[a-f0-9]{64}$/.test(value.requestHash)) throw new Error('Generated object requires a request fingerprint');
  return { schema: WORLD_OBJECT_SCHEMA, worldId: objectText(value.worldId, 240, 'world'),
    ownerHostId: objectText(value.ownerHostId, 128, 'host'), agentId: identifier(value.agentId),
    objectId: identifier(value.objectId), requestId: identifier(value.requestId), requestHash: value.requestHash,
    name: objectText(value.name, 120, 'name'),
    position: objectPosition(value.position), size: objectSize(value.size) };
}
export function normalizeWorldObjectDescriptor(value, options = {}) {
  fields(value, ['artifactCid', 'placement']);
  return { artifactCid: artifactCID(value.artifactCid).toString(), placement: normalizeWorldObjectPlacement(value.placement, options) };
}

/** Check the immutable manifest before following any remote file references. */
export function worldObjectDescriptorFromManifest(artifactCid, manifest, options = {}) {
  const placement = normalizeWorldObjectPlacement(manifest?.provenance?.worldObject, options);
  if (manifest.model || manifest.files?.length !== 1) throw new Error('A world object must contain one static mesh');
  const file = manifest.files[0];
  if (file.path !== 'mesh.glb' || file.mediaType !== 'model/gltf-binary' || !Number.isSafeInteger(file.size)
      || file.size < 20 || file.size > WORLD_OBJECT_LIMITS.meshBytes || !/^[a-f0-9]{64}$/.test(file.sha256)) {
    throw new Error('Generated object mesh exceeds the supported profile');
  }
  artifactCID(file.cid);
  return { artifactCid: artifactCID(artifactCid).toString(), placement };
}

export function sameWorldObject(a, b) {
  return a.artifactCid === b.artifactCid && JSON.stringify(a.placement) === JSON.stringify(b.placement);
}

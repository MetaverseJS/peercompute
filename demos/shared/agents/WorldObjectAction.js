import { artifactCID } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { normalizeWorldObjectSize, resolveWorldObjectSize, WORLD_OBJECT_SIZE } from '../world/WorldModelScale.js';
export { normalizeWorldObjectTarget } from './WorldSpatialReferences.js';

export const WORLD_OBJECT_SCHEMA = 'peercompute.world.generated-object.v1';
export const WORLD_OBJECT_TRANSFORM_SCHEMA = 'peercompute.world.generated-object.v2';
export const worldObjectRevision = value => value.placement?.revision ?? value.revision ?? 0;
export const WORLD_OBJECT_LIMITS = Object.freeze({ perOwner: 32, visible: 128, promptBytes: 1024, nameBytes: 120,
  minimumSize: WORLD_OBJECT_SIZE.minimum, maximumSize: WORLD_OBJECT_SIZE.maximum, maximumCoordinate: 100000, meshBytes: 16 * 1024 * 1024 });
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
  return normalizeWorldObjectSize(value);
}

/** A proposal is descriptive data; it never grants ownership or arbitrary code. */
export function normalizeWorldObjectAction(value) {
  fields(value, ['name', 'prompt', 'size']);
  const action = { name: objectText(value.name, WORLD_OBJECT_LIMITS.nameBytes, 'name'),
    prompt: objectText(value.prompt, WORLD_OBJECT_LIMITS.promptBytes, 'description') };
  return { ...action, size: resolveWorldObjectSize(value.size, action) };
}
function objectInstructions(allowPlacement) {
  const shape = { object: { name: 'Object name', prompt: 'Description of one isolated object on a plain background',
    ...(allowPlacement ? { placement: { locationId: 'l1' } } : {}) } };
  return 'Resolve only arguments for the selected object action. Return exactly one JSON object with no prose or code fences. '
    + `Use this complete shape: ${JSON.stringify(shape)}. `
    + 'The object response has no other top-level keys: do not add action, intent, type, coordinates or extra fields. '
    + 'Choose its name and description from the current request; the description excludes placement instructions. '
    + 'Omit size unless the owner explicitly requests a scale; the world assigns an appropriate object size. If specified, size is the largest dimension, 0.3 to 1024 world units. A person/cube is 6, a chair 3, a car 15, a house 36 and a castle 96. Honor requested scale. '
    + (allowPlacement ? 'If the request specifies a destination, placement is required: choose one listed locationId (lN) matching its direction/distance, '
      + 'or use {"targetId":"speaker"} inside placement for beside an observed person (speaker/pN). '
      + 'Never invent coordinates or references. Never copy example l1 unless it fits the actual request. '
      + 'If no destination was requested, omit placement for nearby placement. '
      : 'The object is placed beside your cube. ')
    + 'The only alternative response is {"intent":null} when the required target is unavailable or no creation was requested. Never claim execution success.';
}
export const WORLD_OBJECT_ACTION_INSTRUCTIONS = objectInstructions(false);
export const WORLD_OBJECT_TARGET_INSTRUCTIONS = objectInstructions(true);

export function normalizeWorldObjectPlacement(value, { worldId, ownerHostId } = {}) {
  fields(value, ['schema', 'worldId', 'ownerHostId', 'agentId', 'objectId', 'requestId', 'requestHash', 'name', 'position', 'size', 'revision', 'previousArtifactCid', 'actorAgentId']);
  if (![WORLD_OBJECT_SCHEMA, WORLD_OBJECT_TRANSFORM_SCHEMA].includes(value.schema) || (worldId !== undefined && value.worldId !== worldId)
      || (ownerHostId !== undefined && value.ownerHostId !== ownerHostId)) throw new Error('Generated object world or owner mismatch');
  if (!/^[a-f0-9]{64}$/.test(value.requestHash)) throw new Error('Generated object requires a request fingerprint');
  const transformed = value.schema === WORLD_OBJECT_TRANSFORM_SCHEMA;
  if (transformed ? (!Number.isSafeInteger(value.revision) || value.revision < 1)
    : ['revision', 'previousArtifactCid', 'actorAgentId'].some(key => Object.hasOwn(value, key))) throw new TypeError('Invalid generated object transform revision');
  return { schema: value.schema, worldId: objectText(value.worldId, 240, 'world'),
    ownerHostId: objectText(value.ownerHostId, 128, 'host'), agentId: identifier(value.agentId),
    objectId: identifier(value.objectId), requestId: identifier(value.requestId), requestHash: value.requestHash,
    name: objectText(value.name, 120, 'name'),
    position: objectPosition(value.position), size: objectSize(value.size),
    ...(transformed ? { revision: value.revision, previousArtifactCid: artifactCID(value.previousArtifactCid).toString(), actorAgentId: identifier(value.actorAgentId) } : {}) };
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

import { normalizeWorldObjectSize } from '../world/WorldModelScale.js';

export const WORLD_OBJECT_RESIZE_INSTRUCTIONS = 'Resize an existing owned world object; never create a replacement. '
  + 'Return only {"resize":{"targetId":"oN","multiplier":10}} for ten times its current size, '
  + 'or {"resize":{"targetId":"oN","size":60}} for an absolute largest dimension in world units. '
  + 'Use exactly one multiplier or size. Use only an observed object reference. '
  + 'If the target or amount is unclear, return {"intent":null}; do not guess between equally matching objects. '
  + 'Never supply coordinates, identities, revisions, or artifact CIDs. One cube is 6 units tall.';

const invalid = () => new TypeError('Resize requires a current, unambiguous owned object and a valid size');
const finitePosition = value => Array.isArray(value) && value.length === 3 && value.every(Number.isFinite);

/** A bounded request-local vocabulary. Private IDs and CAS preconditions never
 * come from a model. Host execution checks them again against retained state. */
export function projectWorldObjectResizeRequest(observed) {
  const snapshot = structuredClone(observed);
  if (!Number.isFinite(snapshot?.observedAt) || !snapshot.self) throw invalid();
  const originals = new Map(), context = [];
  const objects = snapshot.objects ?? [];
  if (!Array.isArray(objects) || objects.length > 32) throw invalid();
  const identities = new Set();
  for (const object of objects) {
    if (object.local !== true) continue;
    if (typeof object.objectId !== 'string' || !object.objectId || identities.has(object.objectId)
        || typeof object.artifactCid !== 'string' || !object.artifactCid
        || !Number.isSafeInteger(object.revision) || object.revision < 0
        || typeof object.name !== 'string' || !object.name.trim() || object.name.length > 120
        || !finitePosition(object.position)) throw invalid();
    normalizeWorldObjectSize(object.size); identities.add(object.objectId);
    const id = `o${context.length + 1}`;
    originals.set(id, object);
    const self = snapshot.self.position;
    context.push({ id, name: object.name, size: object.size,
      ...(finitePosition(self) ? { distance: Math.round(Math.hypot(...object.position.map((value, axis) => value - self[axis]))),
        relativePosition: object.position.map((value, axis) => Math.round(value - self[axis])) } : {}) });
  }
  return { context,
    resolve(value, { now = Date.now() } = {}) {
      if (now < snapshot.observedAt || now - snapshot.observedAt > 120000 || !value || Array.isArray(value)
          || Object.keys(value).some(key => !['targetId', 'size', 'multiplier'].includes(key))) throw invalid();
      const object = originals.get(value.targetId);
      if (!object || Object.hasOwn(value, 'size') === Object.hasOwn(value, 'multiplier')) throw invalid();
      const factor = value.multiplier;
      if (factor !== undefined && (!Number.isFinite(factor) || factor <= 0)) throw invalid();
      normalizeWorldObjectSize(factor === undefined ? value.size : object.size * factor);
      return { objectId: object.objectId, expectedArtifactCid: object.artifactCid, expectedObjectRevision: object.revision,
        ...(factor === undefined ? { size: value.size } : { multiplier: factor }) };
    },
  };
}

/** Validate already resolved proposals from injected decision services too. */
export function validateWorldObjectResize(value, observed) {
  if (!value || Array.isArray(value) || Object.keys(value).some(key => !['objectId', 'expectedArtifactCid', 'expectedObjectRevision', 'size', 'multiplier'].includes(key))) throw invalid();
  const projection = projectWorldObjectResizeRequest(observed);
  const candidates = (observed.objects ?? []).filter(object => object.local === true);
  const index = candidates.findIndex(object => object.objectId === value.objectId
    && object.artifactCid === value.expectedArtifactCid && object.revision === value.expectedObjectRevision);
  if (index < 0) throw invalid();
  return projection.resolve({ targetId: `o${index + 1}`, ...(Object.hasOwn(value, 'size') ? { size: value.size } : {}),
    ...(Object.hasOwn(value, 'multiplier') ? { multiplier: value.multiplier } : {}) });
}

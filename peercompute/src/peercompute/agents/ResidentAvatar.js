import { artifactCID } from '../artifacts/ArtifactManifest.js';
import { normalizeGeneratedMeshDescriptor } from '../inference/GeneratedMeshArtifact.js';

export const RESIDENT_AVATAR_SCHEMA = 'peercompute.resident-avatar.v1';
const only = (value, fields) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some(key => !fields.includes(key))) throw new TypeError('Invalid resident avatar fields');
};
const text = (value, max) => {
  if (typeof value !== 'string' || !value.trim() || !value.isWellFormed() || /[\u0000-\u001f\u007f]/.test(value)
      || new TextEncoder().encode(value).length > max) throw new TypeError('Invalid resident avatar text');
  return value;
};
const cid = value => {
  const normalized = artifactCID(value).toString();
  if (normalized !== value) throw new TypeError('Resident avatar requires a canonical CID');
  return normalized;
};
export function normalizeResidentAvatar(value) {
  only(value, ['kind', 'artifactCid']);
  if (value.kind !== 'generated-mesh') throw new TypeError('Unsupported resident avatar');
  return { kind: 'generated-mesh', artifactCid: cid(value.artifactCid) };
}
export function normalizeResidentAvatarProvenance(value) {
  only(value, ['schema', 'worldId', 'ownerHostId', 'agentId', 'requestId', 'requestHash', 'name', 'sourceArtifactCid']);
  if (value.schema !== RESIDENT_AVATAR_SCHEMA || !/^[a-f0-9]{64}$/.test(value.requestHash)
      || !/^[A-Za-z0-9._:-]{1,128}$/.test(value.agentId) || !/^[A-Za-z0-9._:-]{1,128}$/.test(value.requestId)) {
    throw new TypeError('Invalid resident avatar provenance');
  }
  return { schema: RESIDENT_AVATAR_SCHEMA, worldId: text(value.worldId, 240), ownerHostId: text(value.ownerHostId, 128),
    agentId: value.agentId, requestId: value.requestId, requestHash: value.requestHash, name: text(value.name, 120),
    ...(value.sourceArtifactCid ? { sourceArtifactCid: cid(value.sourceArtifactCid) } : {}) };
}
export function residentAvatarFromManifest(artifactCid, manifest, { worldId, agentId, ownerHostId } = {}) {
  const provenance = normalizeResidentAvatarProvenance(manifest?.provenance?.residentAvatar);
  for (const [key, expected] of Object.entries({ worldId, agentId, ownerHostId })) {
    if (expected !== undefined && provenance[key] !== expected) throw new Error('Resident avatar identity mismatch');
  }
  const metadata = normalizeGeneratedMeshDescriptor(manifest?.provenance?.generatedMesh), file = manifest?.files?.[0];
  if (manifest.model !== undefined || manifest.provenance.worldObject !== undefined || manifest.files.length !== 1
      || file.path !== 'mesh.glb' || file.mediaType !== metadata.mimeType || file.size !== metadata.byteLength
      || file.sha256 !== metadata.sha256) throw new Error('Resident avatar must contain one validated static mesh');
  cid(file.cid);
  return normalizeResidentAvatar({ kind: 'generated-mesh', artifactCid });
}
export const sameResidentAvatar = (a, b) => a?.kind === b?.kind && a?.artifactCid === b?.artifactCid;

import { sha256 } from '@noble/hashes/sha2.js';
import { CID } from 'multiformats/cid';
import { create as createDigest } from 'multiformats/hashes/digest';
import { artifactCID, encodeArtifactManifest, normalizeArtifactManifest,
  ARTIFACT_MANIFEST_SCHEMA, ARTIFACT_MAXIMUM_FILE_BYTES } from '../artifacts/ArtifactManifest.js';

export const MODEL_COMPOSITION_SCHEMA = 'peercompute.model.composition.v1';
export const MODEL_COMPOSITION_LIMITS = Object.freeze({ adapters: 4, scaleMagnitude: 2,
  maximumBytes: ARTIFACT_MAXIMUM_FILE_BYTES });
const invalid = (message) => new Error(`Invalid model composition: ${message}`);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Same canonical raw/SHA-256 identity used by ArtifactStore.importManifest. */
export function modelManifestCid(manifest) {
  return CID.createV1(0x55, createDigest(0x12, sha256(encodeArtifactManifest(manifest)))).toString();
}

function baseIdentity(input, suppliedCid) {
  const base = normalizeArtifactManifest(input);
  if (!base.model || base.model.composition !== undefined) throw invalid('a model base without nested composition is required');
  const cid = modelManifestCid(base);
  if (suppliedCid !== undefined && artifactCID(suppliedCid).toString() !== cid) throw invalid('base manifest CID does not match canonical base bytes');
  return { base, cid };
}

function normalizeAdapters(adapters, { remap = false } = {}) {
  if (!Array.isArray(adapters) || !adapters.length || adapters.length > MODEL_COMPOSITION_LIMITS.adapters) {
    throw invalid('one to four adapters are required');
  }
  const cids = new Set(), digests = new Set();
  return adapters.map((item, index) => {
    if (!item || Object.keys(item).some((key) => !['role', 'format', 'file', 'scale', 'source', 'profile'].includes(key))
        || typeof item.role !== 'string' || !/^[a-z][a-z0-9-]{0,31}$/.test(item.role)
        || typeof item.format !== 'string' || !/^[A-Za-z][A-Za-z0-9._-]{0,31}$/.test(item.format)
        || !Number.isFinite(item.scale) || Math.abs(item.scale) > MODEL_COMPOSITION_LIMITS.scaleMagnitude
        || !item.profile || typeof item.profile !== 'object' || Array.isArray(item.profile)
        || !item.source || typeof item.source !== 'object' || Array.isArray(item.source)) throw invalid('adapter descriptor or strength');
    // Artifact normalization validates CID, path, integer bounds and SHA format.
    const file = normalizeArtifactManifest({ schema: ARTIFACT_MANIFEST_SCHEMA, files: [item.file] }).files[0];
    if (!file.sha256 || !file.size) throw invalid('adapter requires a nonempty file with a pinned SHA-256');
    const identity = `${file.sha256}:${file.size}`;
    if (cids.has(file.cid) || digests.has(identity)) throw invalid('duplicate adapter bytes');
    cids.add(file.cid); digests.add(identity);
    return { role: item.role, format: item.format, scale: Object.is(item.scale, -0) ? 0 : item.scale,
      file: { ...file, ...(remap ? { path: `adapters/${index + 1}-${file.sha256.slice(0, 16)}.${item.format.toLowerCase()}` } : {}) },
      source: { ...item.source }, profile: { ...item.profile } };
  });
}

/** A new identity references existing base and adapter CIDs; no weight copying.
 * This is composition integrity, not runtime/model/adapter compatibility. */
export function createModelComposition({ baseManifest, baseManifestCid, adapters, name } = {}) {
  const { base, cid } = baseIdentity(baseManifest, baseManifestCid);
  const components = normalizeAdapters(adapters, { remap: true });
  const manifest = normalizeArtifactManifest({ ...base,
    ...(name === undefined ? {} : { name }),
    files: [...base.files, ...components.map((item) => item.file)],
    model: { ...base.model, composition: { schema: MODEL_COMPOSITION_SCHEMA,
      baseManifestCid: cid, baseManifest: base, adapters: components } } });
  splitModelComposition(manifest);
  return manifest;
}

/** Recover the exact original base for its normal runtime admission path.
 * Adapters are admitted separately; unknown runtime roles must never be ignored. */
export function splitModelComposition(input) {
  const manifest = normalizeArtifactManifest(input), composition = manifest.model?.composition;
  if (composition === undefined) return { manifest, baseManifest: manifest,
    baseManifestCid: modelManifestCid(manifest), adapters: [] };
  if (!composition || composition.schema !== MODEL_COMPOSITION_SCHEMA || typeof composition.baseManifestCid !== 'string'
      || Object.keys(composition).some((key) => !['schema', 'baseManifestCid', 'baseManifest', 'adapters'].includes(key))) {
    throw invalid('unsupported composition schema');
  }
  const { base, cid } = baseIdentity(composition.baseManifest, composition.baseManifestCid);
  const adapters = normalizeAdapters(composition.adapters);
  const { composition: ignored, ...model } = manifest.model;
  if (!same(model, base.model)) throw invalid('composed model changed the base runtime identity');
  const expected = normalizeArtifactManifest({ ...base, files: [...base.files, ...adapters.map((item) => item.file)] }).files;
  if (!same(manifest.files, expected)) throw invalid('composed file closure differs from exact base and adapters');
  const totalBytes = manifest.files.reduce((sum, file) => sum + file.size, 0);
  if (!Number.isSafeInteger(totalBytes) || totalBytes > MODEL_COMPOSITION_LIMITS.maximumBytes) throw invalid('combined package exceeds runtime byte budget');
  return { manifest, baseManifest: base, baseManifestCid: cid, adapters };
}

import { sha1 } from '@noble/hashes/legacy.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { CID } from 'multiformats/cid';
import { create as createDigest } from 'multiformats/hashes/digest';
import { normalizeArtifactManifest, artifactCID } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { validateModelManifest } from '../../../peercompute/src/peercompute/inference/modelManifest.js';
import { validateGgufManifest } from '../../../peercompute/src/peercompute/inference/gguf/runtimeDefinition.js';
import { validateDiffusionManifest } from '../../../peercompute/src/peercompute/inference/diffusion/runtimeDefinition.js';
import { huggingFaceFileUrl } from './huggingface/hubClient.js';

/** Validate data-only Hub packages again at the acquisition boundary. This is
 * a shape check, not a content proof; importModelPackage verifies downloaded
 * Git/LFS digests and the worker independently validates the resulting CIDs. */
export function validateHubPackage(input) {
  if (!input || JSON.stringify(input).length > 256 * 1024) throw new Error('Invalid Hub package metadata');
  const entry = structuredClone(input);
  const model = entry.model;
  if (!model || entry.repository !== model.repository || entry.revision !== model.revision
      || !/^[a-f0-9]{40}$/.test(entry.revision ?? '')) throw new Error('Hub packages require a pinned immutable revision');
  if (!Array.isArray(entry.files) || !entry.files.length || entry.files.length > 1024) throw new Error('Invalid Hub package files');
  let totalBytes = 0;
  const files = entry.files.map((file) => {
    huggingFaceFileUrl(entry.repository, entry.revision, file.path);
    if (!Number.isSafeInteger(file.size) || file.size < 0) throw new Error('Invalid Hub file size');
    if (file.sha256 !== undefined && !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error('Invalid Hub SHA256');
    if (file.gitBlobSha1 !== undefined && !/^[a-f0-9]{40}$/.test(file.gitBlobSha1)) throw new Error('Invalid Hub Git digest');
    if (!file.sha256 && !file.gitBlobSha1) throw new Error('Hub file has no verifiable digest');
    if (/\.(onnx(?:_data(?:_\d+)?)?|gguf|bin)$/i.test(file.path) && !file.sha256) throw new Error('Model weight files require SHA256');
    totalBytes += file.size;
    // Metadata-only sentinel for existing structural validators. Never persisted,
    // advertised, fetched or passed to a model worker as a real artifact identity.
    const digest = file.sha256 ?? '0'.repeat(64);
    const bytes = Uint8Array.from(digest.match(/../g), (part) => Number.parseInt(part, 16));
    return { path: file.path, size: file.size, sha256: digest,
      cid: CID.createV1(0x55, createDigest(0x12, bytes)).toString() };
  });
  if (!Number.isSafeInteger(totalBytes) || entry.totalBytes !== totalBytes) throw new Error('Hub package size does not match selected files');
  const manifest = { schema: 'peercompute.artifact.manifest.v1', name: String(entry.name ?? entry.repository).slice(0, 256),
    ...(entry.description ? { description: String(entry.description).slice(0, 4000) } : {}),
    model, files, provenance: { ...entry.provenance, source: 'huggingface', repository: entry.repository, revision: entry.revision,
      ...(entry.license ? { license: entry.license } : {}) } };
  const normalized = normalizeArtifactManifest(manifest);
  if (model.runtime === 'transformers.js') validateModelManifest(normalized);
  else if (model.runtime === 'llama.cpp') validateGgufManifest(normalized);
  else if (model.runtime === 'onnx-diffusion') validateDiffusionManifest(normalized);
  else throw new Error('This Hub package has no supported runtime');
  return { ...manifest, files: entry.files.map(({ path, size, sha256, gitBlobSha1 }) => ({ path, size,
    ...(sha256 ? { sha256 } : {}), ...(gitBlobSha1 ? { gitBlobSha1 } : {}) })) };
}

/** Candidate package identity. Git-only sidecars additionally require byte
 * verification below; a manifest's provenance claims are not a source receipt. */
const canonical = (value) => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])])) : value;
const identity = (value) => JSON.stringify(canonical(value));
export function matchesHubPackage(manifest, entry) {
  if (!manifest || !entry || manifest.model?.repository !== entry.model?.repository
      || manifest.model?.revision !== entry.model?.revision || manifest.model?.runtime !== entry.model?.runtime
      || identity(manifest.model) !== identity(entry.model)) return false;
  return manifest.files?.length === entry.files?.length && entry.files.every((file) => manifest.files.some((stored) =>
    stored.path === file.path && stored.size === file.size && (!file.sha256 || stored.sha256 === file.sha256)));
}

/** Check untrusted retained bytes against Hub Git identities before reuse. */
export async function verifyStoredHubPackage(store, manifest, entry, { signal } = {}) {
  if (!matchesHubPackage(manifest, entry)) return false;
  for (const file of entry.files.filter((item) => item.gitBlobSha1 && !item.sha256)) {
    signal?.throwIfAborted();
    const stored = manifest.files.find((item) => item.path === file.path);
    const hash = sha1.create().update(new TextEncoder().encode(`blob ${file.size}\0`));
    let length = 0;
    try {
      for await (const bytes of store.openRead(stored.cid, { signal })) {
        signal?.throwIfAborted(); length += bytes.byteLength;
        if (length > file.size) return false;
        hash.update(bytes);
      }
    } catch (error) { signal?.throwIfAborted(); return false; }
    if (length !== file.size || bytesToHex(hash.digest()) !== file.gitBlobSha1) return false;
  }
  signal?.throwIfAborted();
  return true;
}

/** Reuse only exact SHA-bound files from a candidate package. The importer
 * checks the local store record again; Git-only sidecars are fetched and verified
 * when package reuse failed, without downloading matching large weights again. */
export function reuseVerifiedHubFiles(manifest, candidate) {
  if (!candidate?.files) return manifest;
  return { ...manifest, files: manifest.files.map((file) => {
    if (!file.sha256) return file;
    const prior = candidate.files.find((item) => item.path === file.path && item.size === file.size && item.sha256 === file.sha256);
    if (!prior?.cid) return file;
    try { return { ...file, cid: artifactCID(prior.cid).toString() }; }
    catch { return file; }
  }) };
}

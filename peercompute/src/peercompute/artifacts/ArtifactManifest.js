import { CID } from 'multiformats/cid';

export const ARTIFACT_MANIFEST_SCHEMA = 'peercompute.artifact.manifest.v1';
export const ARTIFACT_MANIFEST_MAXIMUM_BYTES = 256 * 1024;
export const ARTIFACT_MAXIMUM_FILE_BYTES = 16 * 1024 ** 3;
const encoder = new TextEncoder();

export function artifactCID(value) {
  const cid = CID.asCID(value) || CID.parse(String(value));
  if (![0x55, 0x70].includes(cid.code) || cid.multihash.code !== 0x12
      || cid.multihash.digest.byteLength !== 32) {
    throw new TypeError('Artifacts require raw or dag-pb CIDs with SHA-256.');
  }
  return cid.toV1();
}

function canonical(value, depth = 0, budget = { remaining: ARTIFACT_MANIFEST_MAXIMUM_BYTES }) {
  if (depth > 12) throw new RangeError('Manifest nesting exceeds 12 levels.');
  if ((budget.remaining -= 2) < 0) throw new RangeError('Manifest exceeds byte limit.');
  if (typeof value === 'string') {
    if (value.length > budget.remaining || (budget.remaining -= encoder.encode(value).length) < 0) throw new RangeError('Manifest exceeds byte limit.');
    return value;
  }
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (Array.isArray(value)) {
    if (value.length > 4096) throw new RangeError('Manifest array exceeds item limit.');
    return value.map((item) => canonical(item, depth + 1, budget));
  }
  if (!value || typeof value !== 'object' || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new TypeError('Manifest values must be JSON values.');
  }
  const keys = Object.keys(value);
  if (keys.length > 1024) throw new RangeError('Manifest object exceeds key limit.');
  return Object.fromEntries(keys.sort().map((key) => {
    canonical(key, depth + 1, budget);
    return [key, canonical(value[key], depth + 1, budget)];
  }));
}

export function normalizeArtifactManifest(input, {
  maximumBytes = ARTIFACT_MANIFEST_MAXIMUM_BYTES,
  maximumFiles = 1024,
  maximumFileBytes = ARTIFACT_MAXIMUM_FILE_BYTES
} = {}) {
  if (!input || input.schema !== ARTIFACT_MANIFEST_SCHEMA || !Array.isArray(input.files)
      || input.files.length === 0 || input.files.length > maximumFiles) {
    throw new TypeError('Manifest requires the supported schema and a bounded, nonempty files array.');
  }
  const allowed = new Set(['schema', 'name', 'description', 'files', 'model', 'provenance']);
  if (Object.keys(input).some((key) => !allowed.has(key))) throw new TypeError('Unsupported manifest field.');
  for (const field of ['name', 'description']) {
    if (input[field] !== undefined && typeof input[field] !== 'string') throw new TypeError(`Manifest ${field} must be a string.`);
  }
  if (input.model !== undefined && (!input.model || typeof input.model !== 'object' || Array.isArray(input.model))) {
    throw new TypeError('Manifest model extension must be an object.');
  }
  const paths = new Set();
  const files = input.files.map((file) => {
    if (!file || typeof file !== 'object') throw new TypeError('Invalid manifest file.');
    if (Object.keys(file).some((key) => !['path', 'cid', 'size', 'sha256', 'mediaType'].includes(key))) {
      throw new TypeError('Unsupported manifest file field.');
    }
    const { path, size } = file;
    if (typeof path !== 'string' || !path || encoder.encode(path).length > 512
        || /[\\?#%\u0000-\u001f\u007f:]/u.test(path)
        || path.split('/').some((part) => !part || part === '.' || part === '..') || paths.has(path)) {
      throw new TypeError('Manifest paths must be unique, relative POSIX paths without traversal or URL escapes.');
    }
    if (!Number.isSafeInteger(size) || size < 0 || size > maximumFileBytes) throw new RangeError('Invalid file size.');
    if (file.sha256 !== undefined && !/^[a-f0-9]{64}$/u.test(file.sha256)) throw new TypeError('Invalid SHA-256.');
    if (file.mediaType !== undefined && (typeof file.mediaType !== 'string' || file.mediaType.length > 256)) {
      throw new TypeError('Invalid media type.');
    }
    paths.add(path);
    return { ...file, cid: artifactCID(file.cid).toString() };
  }).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  const result = canonical({ ...input, files }, 0, { remaining: maximumBytes });
  if (encoder.encode(JSON.stringify(result)).byteLength > maximumBytes) throw new RangeError('Manifest exceeds byte limit.');
  return result;
}

export function encodeArtifactManifest(input, options) {
  return encoder.encode(JSON.stringify(normalizeArtifactManifest(input, options)));
}

export function decodeArtifactManifest(bytes, options = {}) {
  if (bytes.byteLength > (options.maximumBytes ?? ARTIFACT_MANIFEST_MAXIMUM_BYTES)) {
    throw new RangeError('Manifest exceeds byte limit.');
  }
  return normalizeArtifactManifest(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)), options);
}

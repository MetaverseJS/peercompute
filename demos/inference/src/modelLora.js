import { createHuggingFaceClient, parseHuggingFaceRepository, validateRevision,
  huggingFaceFileUrl } from './huggingface/hubClient.js';
import { normalizeHubFile } from './huggingface/packageResolver.js';
import { downloadModelFile } from './modelDownload.js';
import { modelStorageError } from './modelLibrary.js';
import { artifactCID } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { inspectGgufHeader, GGUF_HUB_LIMITS } from '../../../peercompute/src/peercompute/inference/gguf/hubAdmission.js';
import { resolveGgufLoraProfile, validateGgufLoraPair,
  normalizeGgufLoraProfile } from '../../../peercompute/src/peercompute/inference/gguf/loraAdmission.js';
import { validateGgufManifest } from '../../../peercompute/src/peercompute/inference/gguf/runtimeDefinition.js';
import { createModelComposition, splitModelComposition,
  MODEL_COMPOSITION_LIMITS } from '../../../peercompute/src/peercompute/inference/modelComposition.js';

const MAX_VARIANTS = 16;
const INSPECTION_BYTES = 32 * 1024 ** 2;
const provenanceNotice = 'Tensor compatibility is checked before download. The publisher may not specify the training base revision.';
const abort = (signal) => signal?.throwIfAborted();

function inspectAdapter(client, repository, revision, file, signal, countBytes = () => {}) {
  return inspectGgufHeader({ size: file.size, kind: 'lora', includeTensorInfo: true, signal,
    readRange(offset, length, options) {
      countBytes(length);
      return client.readRange(repository, revision, file.path, offset, length, options);
    } });
}

/** Discover adapter files separately from executable models. Never fetch a full
 * weight through metadata inspection or interpret a safetensors file as GGUF. */
export async function inspectLoraHub(reference, { client = createHuggingFaceClient(), signal } = {}) {
  abort(signal);
  const requested = parseHuggingFaceRepository(reference);
  const info = await client.getModel(requested.repository, { revision: requested.revision, signal });
  abort(signal);
  if (info.gated || info.private) throw new Error('This adapter is not available through anonymous Hugging Face access.');
  const revision = validateRevision(info.sha);
  if (requested.revision && requested.revision !== revision) throw new Error('Adapter metadata changed the requested revision.');
  const repository = requested.repository;
  const listing = await client.listFiles(repository, revision, { signal });
  abort(signal);
  if (!Array.isArray(listing) || listing.length > 8192) throw new Error('Adapter repository exceeds the file listing budget.');
  const files = listing.filter((file) => typeof (file.path ?? file.rfilename) === 'string'
    && /\.gguf$/i.test(file.path ?? file.rfilename)
    && (!requested.path || (file.path ?? file.rfilename) === requested.path));
  if (!files.length) throw new Error('No GGUF LoRA files found. Safetensors adapters need conversion for this runtime.');
  if (files.length > MAX_VARIANTS) throw new Error('This repository has many GGUF files. Paste a specific adapter file URL.');
  const variants = [], errors = [];
  let inspectedBytes = 0;
  const countBytes = (length) => {
    inspectedBytes += length;
    if (inspectedBytes > INSPECTION_BYTES) throw new Error('Adapter inspection budget reached. Paste a specific file URL.');
  };
  for (const raw of files) {
    abort(signal);
    const path = raw.path ?? raw.rfilename;
    try {
      const file = normalizeHubFile(raw);
      if (!file.sha256 || file.size < 24 || file.size > GGUF_HUB_LIMITS.maximumBytes) {
        throw new Error('Adapter weights require a bounded file size and a published SHA-256.');
      }
      const header = await inspectAdapter(client, repository, revision, file, signal, countBytes);
      const descriptor = resolveGgufLoraProfile({ repository, revision, file, header });
      variants.push({ key: `${repository}@${revision}:${file.path}`, name: file.path.split('/').at(-1),
        repository, revision, file, profile: descriptor.profile, provenanceNotice });
    } catch (error) {
      abort(signal);
      errors.push({ path, message: String(error?.message ?? error).slice(0, 500) });
      if (inspectedBytes > INSPECTION_BYTES) break;
    }
  }
  if (!variants.length) throw new Error(errors[0]?.message ?? 'No supported GGUF LoRA adapter was found.');
  variants.sort((left, right) => left.file.size - right.file.size || left.name.localeCompare(right.name));
  return { repository, revision, variants, errors, provenanceNotice,
    ...(info.warning || listing.warning ? { warning: info.warning || listing.warning } : {}) };
}

async function storedRange(store, cid, offset, length, { signal } = {}) {
  const bytes = new Uint8Array(length);
  let at = 0;
  for await (const chunk of store.openRead(cid, { offset, length, signal })) {
    abort(signal);
    if (!(chunk instanceof Uint8Array) || at + chunk.length > length) throw new Error('Stored GGUF header range is invalid.');
    bytes.set(chunk, at); at += chunk.length;
  }
  if (at !== length) throw new Error('Stored GGUF header range is incomplete.');
  return bytes;
}

function candidate(input, scale) {
  if (!input || typeof input !== 'object') throw new Error('Inspect a GGUF LoRA adapter first.');
  const descriptor = resolveGgufLoraProfile({ repository: input.repository, revision: input.revision,
    file: input.file, header: input.profile, scale });
  // Keep only source fields validated by the public Hub URL builder. Caller CIDs
  // are not receipts for downloaded bytes and may not shortcut the import.
  huggingFaceFileUrl(input.repository, input.revision, descriptor.file.path);
  descriptor.file = { path: descriptor.file.path, size: descriptor.file.size, sha256: descriptor.file.sha256 };
  return descriptor;
}

/** Save a new immutable composition while retaining the original base. Reads
 * happen before retention: nesting openRead behind a waiting GC writer can
 * deadlock. The retained scope checks every base file again before mutation. */
export async function createStoredLoraComposition(store, baseCid, { adapter, scale = 1, name,
  signal, onProgress, fetchImpl = globalThis.fetch } = {}) {
  abort(signal);
  const selectedCid = artifactCID(baseCid).toString();
  const descriptor = candidate(adapter, scale);
  if (name !== undefined && (typeof name !== 'string' || !name.trim() || name.length > 256)) {
    throw new Error('Model name must contain 1 to 256 characters.');
  }
  const selected = await store.getManifest(selectedCid, { signal });
  const { baseManifest, baseManifestCid, adapters } = splitModelComposition(selected);
  const validated = validateGgufManifest(baseManifest);
  if (validated.weights.length !== 1 || adapters.length >= 4) throw new Error('Choose one complete GGUF base with fewer than four adapters.');
  if (adapters.some((item) => item.file.sha256 === descriptor.file.sha256 && item.file.size === descriptor.file.size)) {
    throw new Error('This adapter is already part of the selected model.');
  }
  if (selected.files.reduce((sum, file) => sum + file.size, descriptor.file.size) > MODEL_COMPOSITION_LIMITS.maximumBytes) {
    throw new Error('The base and adapters exceed this runtime’s package size limit.');
  }
  const weight = validated.weights[0];
  onProgress?.({ stage: 'inspect', path: descriptor.file.path });
  abort(signal);
  const baseHeader = await inspectGgufHeader({ size: weight.size, kind: 'model', includeTensorInfo: true, signal,
    readRange: (offset, length, options) => storedRange(store, weight.cid, offset, length, options) });
  if (baseManifest.model.gguf && baseHeader.headerSha256 !== baseManifest.model.gguf.headerSha256) {
    throw new Error('Stored base header differs from its model package.');
  }
  const client = createHuggingFaceClient({ fetchImpl, storage: null });
  const actual = await inspectAdapter(client, descriptor.source.repository, descriptor.source.revision, descriptor.file, signal);
  if (JSON.stringify(normalizeGgufLoraProfile(actual)) !== JSON.stringify(descriptor.profile)) {
    throw new Error('The adapter header differs from the inspected file. Inspect it again.');
  }
  validateGgufLoraPair(baseHeader, actual);
  abort(signal);
  const file = descriptor.file;
  // Find reusable bytes without taking another store lock inside retention.
  let reuseCid;
  for await (const record of store.list({ signal })) {
    abort(signal);
    if (record.kind === 'file' && record.status === 'complete' && record.size === file.size && record.sha256 === file.sha256) {
      reuseCid = record.cid; break;
    }
  }
  try {
    return await store.withRetention(async (scoped) => {
      abort(signal);
      const selection = await scoped.stat(selectedCid, { signal });
      if (selection?.kind !== 'manifest' || selection.status !== 'complete') throw new Error('The selected base is no longer stored.');
      for (const baseFile of selected.files) {
        const stat = await scoped.stat(baseFile.cid, { signal });
        if (stat?.kind !== 'file' || stat.status !== 'complete' || stat.size !== baseFile.size || stat.sha256 !== baseFile.sha256) {
          throw new Error('A base model file is no longer available. Load it again before adding an adapter.');
        }
      }
      let imported = reuseCid ? await scoped.stat(reuseCid, { signal }) : null;
      const reusable = imported?.kind === 'file' && imported.status === 'complete'
        && imported.size === file.size && imported.sha256 === file.sha256;
      if (!reusable) {
        let loaded = 0, lastAt = 0;
        const report = (extra = {}) => onProgress?.({ stage: 'import', path: file.path, loaded, totalBytes: file.size, ...extra });
        report();
        const sourceUrl = (path) => huggingFaceFileUrl(descriptor.source.repository, descriptor.source.revision, path);
        async function* source() {
          for await (const bytes of downloadModelFile(file, sourceUrl, { signal, fetchImpl, onRetry: report })) {
            abort(signal); loaded += bytes.byteLength; yield bytes;
            const at = Date.now();
            if (loaded < file.size && at - lastAt >= 100) { lastAt = at; report(); }
          }
        }
        imported = await scoped.importFile(source(), { expectedSize: file.size, expectedSha256: file.sha256, pin: false, signal });
      }
      abort(signal);
      onProgress?.({ stage: 'verify', path: file.path, loaded: file.size, totalBytes: file.size, reused: reusable });
      abort(signal);
      const component = { ...descriptor, file: { ...file, cid: imported.cid }, source: { ...descriptor.source, path: file.path } };
      const manifest = createModelComposition({ baseManifest, baseManifestCid, adapters: [...adapters, component],
        name: name?.trim() ?? `${selected.name ?? 'Model'} + ${adapter.name ?? file.path.split('/').at(-1)}`.slice(0, 256) });
      return scoped.importManifest(manifest, { pin: true, signal });
    }, { signal });
  } catch (error) { throw modelStorageError(error); }
}

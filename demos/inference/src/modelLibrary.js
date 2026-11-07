import { sha1 } from '@noble/hashes/legacy.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { downloadModelFile } from './modelDownload.js';
import { normalizeArtifactManifest } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';

/** Serialize package mutations without holding inference or network callbacks. */
export function createModelMutationQueue() {
  let pending = Promise.resolve();
  return {
    run(operation, { signal } = {}) {
      const next = pending.catch(() => {}).then(() => { signal?.throwIfAborted(); return operation(); });
      pending = next;
      return next;
    },
    settled: () => pending.catch(() => {}),
  };
}

/** Browser estimates are advisory; only an actual failed write rejects storage. */
export function modelStorageError(error) {
  if (error?.code === 'ERR_MODEL_STORAGE_FULL') return error;
  if (error?.name !== 'QuotaExceededError') return error;
  const explained = new Error('The browser refused additional storage. Delete an unused stored model or free device storage, then retry the import.', { cause: error });
  explained.name = 'QuotaExceededError';
  explained.code = 'ERR_MODEL_STORAGE_FULL';
  return explained;
}

// Keep only requested immutable identities, rather than copying the whole library.
// Scan before taking retention: nesting store.list's shared lock behind a queued
// GC writer could deadlock. Every candidate is checked again inside retention.
async function completedFileCandidates(store, files, signal) {
  const identity = (file) => `${file.sha256}:${file.size}`;
  const wanted = new Set(files.filter((file) => !file.cid && !file.gitBlobSha1
    && /^[a-f0-9]{64}$/.test(file.sha256) && Number.isSafeInteger(file.size) && file.size >= 0).map(identity));
  const candidates = new Map();
  signal?.throwIfAborted();
  if (!wanted.size) return candidates;
  for await (const record of store.list({ signal })) {
    signal?.throwIfAborted();
    if (record.kind !== 'file' || record.status !== 'complete') continue;
    const key = identity(record);
    if (!wanted.delete(key)) continue;
    candidates.set(key, record.cid);
    if (!wanted.size) break;
  }
  return candidates;
}

/** Hold package retention across files, including gaps between individual writes. */
export async function importModelPackage(store, entry, sourceUrl, { signal, onProgress, fetchImpl = fetch } = {}) {
  try {
    const candidates = await completedFileCandidates(store, entry.files, signal);
    return await store.withRetention(async (scopedStore) => {
      const imported = [];
      for (let index = 0; index < entry.files.length; index += 1) {
        signal?.throwIfAborted();
        const file = entry.files[index];
        const clock = () => globalThis.performance?.now() ?? Date.now();
        let loaded = 0, lastProgressAt = clock();
        const report = (extra = {}) => onProgress?.({ stage: 'import', path: file.path, index, total: entry.files.length,
          loaded, totalBytes: file.size, ...extra });
        report();
        const candidateCid = file.cid || (!file.gitBlobSha1 && candidates.get(`${file.sha256}:${file.size}`));
        let result = candidateCid ? await scopedStore.stat(candidateCid, { signal }) : null;
        const reused = result?.kind === 'file' && result.status === 'complete'
          && result.size === file.size && result.sha256 === file.sha256;
        if (!reused) {
          const git = file.gitBlobSha1 ? sha1.create().update(new TextEncoder().encode(`blob ${file.size}\0`)) : null;
          async function* verifiedSource() {
            for await (const bytes of downloadModelFile(file, sourceUrl, { signal, fetchImpl, onRetry: report })) {
              signal?.throwIfAborted();
              git?.update(bytes); loaded += bytes.byteLength;
              yield bytes;
              const at = clock();
              if (loaded < file.size && at - lastProgressAt >= 100) { lastProgressAt = at; report(); }
            }
            if (git && bytesToHex(git.digest()) !== file.gitBlobSha1) throw new Error(`Source Git blob SHA-1 mismatch: ${file.path}`);
          }
          result = await scopedStore.importFile(verifiedSource(), { expectedSize: file.size,
            ...(file.sha256 ? { expectedSha256: file.sha256 } : {}), signal, pin: false });
        }
        if (file.cid && result.cid !== file.cid) throw new Error(`Imported CID differs: ${file.path}`);
        signal?.throwIfAborted();
        loaded = file.size; report(reused ? { reused: true } : {});
        imported.push({ path: file.path, cid: result.cid, size: result.size, sha256: result.sha256 });
      }
      signal?.throwIfAborted();
      onProgress?.({ stage: 'verify', total: entry.files.length,
        totalBytes: imported.reduce((sum, file) => sum + file.size, 0) });
      signal?.throwIfAborted();
      return scopedStore.importManifest({ ...entry, files: imported }, { pin: true, signal });
    }, { signal });
  } catch (error) { throw modelStorageError(error); }
}

export async function listStoredModelRecords(store, { signal } = {}) {
  const records = [];
  for await (const record of store.list({ signal })) {
    signal?.throwIfAborted();
    if (record.kind === 'manifest' && record.status === 'partial' && (record.pinned || record.retain)) {
      try {
        const manifest = normalizeArtifactManifest(record.manifest);
        if (manifest.model?.runtime !== undefined) {
          if (typeof manifest.model.runtime !== 'string' || !manifest.model.runtime.trim()) throw new Error('Invalid model runtime');
          records.push(record);
        }
      } catch (cause) {
        throw new Error(`Stored package ${record.cid} has invalid recovery metadata: ${cause.message}`, { cause });
      }
      continue;
    }
    if (record.kind === 'manifest' && ['complete', 'deleting'].includes(record.status)
        && record.manifest?.model?.runtime) records.push(record);
  }
  return records;
}

/** Refuse deletion while another context owns this store's serving identity. */
export async function withModelDeletionOwnership(runtime, operation, { signal } = {}) {
  const store = runtime.store;
  const transport = runtime.networkManager?.getArtifactTransport?.();
  if (!store.persistent || (transport?.store === store && transport.releaseOwnership)) return operation();
  if (!store.lockManager?.request) {
    if (store.backend?.hasExclusiveLock) return operation();
    throw new Error('Stored model deletion requires exclusive network ownership for this store');
  }
  return store.lockManager.request(`${store.lockName}:network-owner`, { mode: 'exclusive', ifAvailable: true }, async (lock) => {
    if (!lock) throw new Error('Another tab owns file sharing for this library. Delete the model from that tab, or close that tab and retry.');
    signal?.throwIfAborted();
    return operation();
  });
}

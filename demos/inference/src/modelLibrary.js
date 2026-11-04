import { sha1 } from '@noble/hashes/legacy.js';
import { bytesToHex } from '@noble/hashes/utils.js';

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

/** Hold package retention across files, including gaps between individual writes. */
export async function importModelPackage(store, entry, sourceUrl, { signal, onProgress, fetchImpl = fetch } = {}) {
  try {
    return await store.withRetention(async (scopedStore) => {
      const imported = [];
      for (let index = 0; index < entry.files.length; index += 1) {
        signal?.throwIfAborted();
        const file = entry.files[index];
        onProgress?.({ stage: 'import', path: file.path, index, total: entry.files.length });
        let result = file.cid ? await scopedStore.stat(file.cid, { signal }) : null;
        if (!result || result.status !== 'complete' || result.size !== file.size || result.sha256 !== file.sha256) {
          const response = await fetchImpl(sourceUrl(file.path), { signal });
          if (!response.ok || !response.body) throw new Error(`Artifact source failed: ${file.path} (${response.status})`);
          const git = file.gitBlobSha1 ? sha1.create().update(new TextEncoder().encode(`blob ${file.size}\0`)) : null;
          async function* verifiedSource() {
            for await (const bytes of response.body) { git?.update(bytes); yield bytes; }
            if (git && bytesToHex(git.digest()) !== file.gitBlobSha1) throw new Error(`Source Git blob SHA-1 mismatch: ${file.path}`);
          }
          result = await scopedStore.importFile(verifiedSource(), { expectedSize: file.size,
            ...(file.sha256 ? { expectedSha256: file.sha256 } : {}), signal, pin: false });
        }
        if (file.cid && result.cid !== file.cid) throw new Error(`Imported CID differs: ${file.path}`);
        imported.push({ path: file.path, cid: result.cid, size: result.size, sha256: result.sha256 });
      }
      return scopedStore.importManifest({ ...entry, files: imported }, { pin: true, signal });
    }, { signal });
  } catch (error) { throw modelStorageError(error); }
}

export async function listStoredModelRecords(store, { signal } = {}) {
  const records = [];
  for await (const record of store.list({ signal })) {
    signal?.throwIfAborted();
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

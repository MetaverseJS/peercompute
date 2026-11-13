import { readGeneratedMesh } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { normalizeWorldObjectDescriptor, sameWorldObject, worldObjectDescriptorFromManifest, WORLD_OBJECT_LIMITS } from './WorldObjectAction.js';

export const generatedObjectKey = value => `${value.local ? 'local' : value.ownerPeerId}:${value.placement.objectId}`;
const receipt = value => ({ artifactCid: value.artifactCid, placement: value.placement });

/** Admission and lifecycle around an interchangeable Three/world renderer. */
export function createWorldGeneratedObjectPresenter({ runtime, adapter, worldId, onError = () => {}, concurrency = 2, now = Date.now }) {
  const desired = new Map(), pending = new Map(), rendered = new Map(), failures = new Map(), files = new Map();
  let closed = false;
  async function read(descriptor, signal, key) {
    // Inspect only a bounded manifest before accepting its file references.
    const manifest = descriptor.local ? await runtime.store.getManifest(descriptor.artifactCid, { signal })
      : await runtime.inspectPeerPackage(descriptor.artifactCid, { signal });
    try {
      const actual = worldObjectDescriptorFromManifest(descriptor.artifactCid, manifest, { worldId });
      if (!sameWorldObject(actual, descriptor)) throw new Error('Generated object descriptor does not match its CID');
    } catch (error) { error.invalidObject = true; throw error; }
    signal.throwIfAborted();
    const fileCid = manifest.files[0].cid;
    if (files.get(key) === fileCid && rendered.has(key) && typeof adapter.updateTransform === 'function') return { fileCid };
    if (!descriptor.local) return runtime.withArtifactRetention(async retained => {
      await retained.ensure(descriptor.artifactCid, { signal, pin: false });
      return { mesh: await readGeneratedMesh(retained, descriptor.artifactCid, { signal }), fileCid };
    }, { signal });
    return { mesh: await readGeneratedMesh(runtime.store, descriptor.artifactCid, { signal }), fileCid };
  }
  function sync(values) {
    if (closed) return;
    desired.clear();
    for (const value of values.slice(0, WORLD_OBJECT_LIMITS.visible)) {
      const checked = normalizeWorldObjectDescriptor(receipt(value), { worldId });
      if (!value.local && (typeof value.ownerPeerId !== 'string' || !value.ownerPeerId)) continue;
      const descriptor = { ...checked, local: value.local === true, ownerPeerId: value.ownerPeerId };
      desired.set(generatedObjectKey(descriptor), descriptor);
    }
    for (const [key, work] of pending) if (!desired.has(key) || !sameWorldObject(desired.get(key), work.descriptor)) work.controller.abort();
    for (const [key, descriptor] of rendered) if (!desired.has(key)) {
      adapter.remove(key); rendered.delete(key); files.delete(key);
    }
    for (const [key, failure] of failures) if (!desired.has(key) || !sameWorldObject(desired.get(key), failure.descriptor)) failures.delete(key);
    pump();
  }
  function pump() {
    if (closed) return;
    for (const [key, descriptor] of desired) {
      if (pending.size >= concurrency) break;
      if (pending.has(key) || (rendered.has(key) && sameWorldObject(rendered.get(key), descriptor)) || (failures.get(key)?.retryAt ?? 0) > now()) continue;
      const work = { descriptor, controller: new AbortController() }; pending.set(key, work);
      work.done = (async () => {
        let prepared;
        try {
          const { mesh, fileCid } = await read(descriptor, work.controller.signal, key);
          if (mesh) prepared = await adapter.prepare(mesh, { signal: work.controller.signal });
          work.controller.signal.throwIfAborted();
          if (closed || !desired.has(key) || !sameWorldObject(desired.get(key), descriptor)) return;
          if (prepared) prepared.commit(key, receipt(descriptor)); else adapter.updateTransform(key, receipt(descriptor));
          rendered.set(key, descriptor); files.set(key, fileCid); failures.delete(key); prepared = null;
        } catch (error) {
          if (!closed && !work.controller.signal.aborted) {
            const count = Math.min(5, (failures.get(key)?.count ?? 0) + 1);
            failures.set(key, { descriptor, count, retryAt: error.invalidObject ? Infinity : now() + Math.min(60000, 5000 * 2 ** (count - 1)) });
            try { onError({ descriptor, error }); } catch { /* Observer only. */ }
          }
        } finally {
          prepared?.dispose(); if (pending.get(key) === work) pending.delete(key);
          queueMicrotask(pump);
        }
      })();
    }
  }
  return { sync,
    async whenLocalReady({ signal } = {}) {
      for (;;) {
        signal?.throwIfAborted();
        if (closed) throw new Error('Generated object presentation is closed');
        const unsettled = [...desired].filter(([key, descriptor]) => descriptor.local
          && (!rendered.has(key) || !sameWorldObject(rendered.get(key), descriptor)));
        if (!unsettled.length) return;
        if (unsettled.some(([key]) => failures.has(key))) throw new Error('An owned object is not ready for collision validation');
        pump();
        const waits = unsettled.map(([key]) => pending.get(key)?.done).filter(Boolean);
        if (!waits.length) throw new Error('Owned object geometry is unavailable');
        await Promise.allSettled(waits);
      }
    },
    prepare: (mesh, options) => adapter.prepare(mesh, options),
    commitLocal(descriptor, prepared) {
      if (closed) throw new Error('Generated object presentation is closed');
      const checked = { ...normalizeWorldObjectDescriptor(receipt(descriptor), { worldId }), local: true };
      const key = generatedObjectKey(checked);
      pending.get(key)?.controller.abort();
      prepared.commit(key, receipt(checked)); desired.set(key, checked); rendered.set(key, checked);
    },
    transformLocal(descriptor, fileCid) {
      if (closed) throw new Error('Generated object presentation is closed');
      const checked = { ...normalizeWorldObjectDescriptor(receipt(descriptor), { worldId }), local: true };
      const key = generatedObjectKey(checked);
      if (!rendered.has(key) || typeof adapter.updateTransform !== 'function') throw new Error('Object is not yet visible for resizing');
      pending.get(key)?.controller.abort();
      adapter.updateTransform(key, receipt(checked));
      desired.set(key, checked); rendered.set(key, checked); files.set(key, fileCid); failures.delete(key);
    },
    getStatus: () => ({ pending: pending.size, rendered: rendered.size, closed }),
    async dispose() {
      if (closed) return; closed = true;
      for (const work of pending.values()) work.controller.abort();
      await Promise.allSettled([...pending.values()].map(work => work.done));
      for (const key of rendered.keys()) adapter.remove(key);
      desired.clear(); rendered.clear(); pending.clear(); failures.clear(); files.clear();
    },
  };
}

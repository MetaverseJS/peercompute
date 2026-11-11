import { readGeneratedMesh } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { normalizeResidentAvatar, residentAvatarFromManifest, sameResidentAvatar } from '../../../peercompute/src/peercompute/agents/ResidentAvatar.js';

/** A renderer-neutral, bounded cache of cosmetic resident bodies. */
export function createWorldResidentAvatarPresenter({ runtime, adapter, worldId, onError = () => {}, concurrency = 2, now = Date.now }) {
  const desired = new Map(), pending = new Map(), rendered = new Map(), failures = new Map();
  let closed = false;
  const same = (a, b) => a?.agentId === b?.agentId && a?.ownerPeerId === b?.ownerPeerId
    && a?.local === b?.local && sameResidentAvatar(a?.avatar, b?.avatar);
  async function read(body, signal) {
    const cid = body.avatar.artifactCid;
    const manifest = body.local ? await runtime.store.getManifest(cid, { signal }) : await runtime.inspectPeerPackage(cid, { signal });
    try { residentAvatarFromManifest(cid, manifest, { worldId, agentId: body.agentId }); }
    catch (error) { error.invalidAvatar = true; throw error; }
    signal.throwIfAborted();
    if (body.local) return readGeneratedMesh(runtime.store, cid, { signal });
    return runtime.withArtifactRetention(async retained => {
      await retained.ensure(cid, { signal, pin: false });
      return readGeneratedMesh(retained, cid, { signal });
    }, { signal });
  }
  function pump() {
    if (closed) return;
    for (const [key, body] of desired) {
      if (pending.size >= concurrency) break;
      if (pending.has(key) || same(rendered.get(key), body) || (failures.get(key)?.retryAt ?? 0) > now()) continue;
      const work = { body, controller: new AbortController() }; pending.set(key, work);
      work.done = (async () => {
        let prepared;
        try {
          const mesh = await read(body, work.controller.signal);
          prepared = await adapter.prepare(mesh, { signal: work.controller.signal });
          work.controller.signal.throwIfAborted();
          if (closed || !same(desired.get(key), body)) return;
          prepared.commit(key, body); rendered.set(key, body); failures.delete(key); prepared = null;
        } catch (error) {
          if (!closed && !work.controller.signal.aborted) {
            const count = Math.min(5, (failures.get(key)?.count ?? 0) + 1);
            failures.set(key, { body, count, retryAt: error.invalidAvatar ? Infinity : now() + Math.min(60000, 5000 * 2 ** (count - 1)) });
            try { onError({ body, error }); } catch { /* Observer only. */ }
          }
        } finally { prepared?.dispose(); if (pending.get(key) === work) pending.delete(key); queueMicrotask(pump); }
      })();
    }
  }
  return {
    sync(bodies) {
      if (closed) return;
      desired.clear();
      for (const body of bodies.slice(0, 64)) if (body.avatar) {
        desired.set(body.key, { ...body, avatar: normalizeResidentAvatar(body.avatar) });
      }
      for (const [key, work] of pending) if (!same(desired.get(key), work.body)) work.controller.abort();
      // Keep the prior visual until a replacement is fully prepared. Only an
      // explicit reset/removal clears it immediately.
      for (const key of rendered.keys()) if (!desired.has(key)) { adapter.remove(key); rendered.delete(key); }
      for (const [key, failure] of failures) if (!same(desired.get(key), failure.body)) failures.delete(key);
      pump();
    },
    prepare: (mesh, options) => adapter.prepare(mesh, options),
    commitLocal(body, prepared) {
      if (closed) throw new Error('Avatar presentation closed');
      normalizeResidentAvatar(body.avatar); pending.get(body.key)?.controller.abort();
      prepared.commit(body.key, body); desired.set(body.key, body); rendered.set(body.key, body); failures.delete(body.key);
    },
    getStatus: () => ({ pending: pending.size, rendered: rendered.size, closed,
      avatars: [...rendered].map(([key, body]) => ({ key, artifactCid: body.avatar.artifactCid })) }),
    async dispose() {
      closed = true; for (const work of pending.values()) work.controller.abort();
      await Promise.allSettled([...pending.values()].map(work => work.done));
      for (const key of rendered.keys()) adapter.remove(key);
      desired.clear(); pending.clear(); rendered.clear(); failures.clear();
    },
  };
}

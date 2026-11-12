import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { retainGeneratedMesh, readGeneratedMesh } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { RESIDENT_AVATAR_SCHEMA, normalizeResidentAvatarProvenance, residentAvatarFromManifest } from '../../../peercompute/src/peercompute/agents/ResidentAvatar.js';
import { generateWorldMesh } from './WorldMeshGeneration.js';
import { normalizeWorldAvatarAction } from './WorldAvatarAction.js';
import { createWorldResidentAvatarPresenter } from './WorldResidentAvatarPresenter.js';
import { worldModelScale, worldModelSizeFromManifest } from '../world/WorldModelScale.js';
import { validateImageInput } from '../../../peercompute/src/peercompute/inference/modelTask.js';
import { referenceAvatarSize } from './WorldAvatarScale.js';

/** Durable avatars belong to agent bindings; they never create a second actor. */
export function createWorldResidentAvatars({ runtime, agents, adapter, worldId, ownerHostId, isOwner, onSaved, onStatus = () => {} }) {
  if (typeof onSaved !== 'function') throw new TypeError('Avatar changes require an acknowledged body refresh callback');
  const lifetime = new AbortController(), requests = new Map(), published = new Set(), operations = new Set();
  let closed = false, busy = false, bodies = [], sharing;
  const binding = head => head?.embodiments?.find(item => item.worldId === worldId);
  const emit = event => { try { onStatus(event); } catch { /* Observer only. */ } };
  const presenter = createWorldResidentAvatarPresenter({ runtime, adapter, worldId,
    onError: ({ error }) => emit({ message: `Saved avatar could not be displayed: ${error.message}`, status: 'error' }) });
  const track = promise => { operations.add(promise); promise.catch(() => {}).finally(() => operations.delete(promise)); return promise; };
  const combined = signal => AbortSignal.any([lifetime.signal, ...(signal ? [signal] : [])]);
  async function authority(agentId, revision, signal) {
    signal.throwIfAborted(); const head = await agents.get(agentId); signal.throwIfAborted();
    if (closed || !isOwner(agentId) || !binding(head) || head.status === 'paused' || head.recoveryRequired || head.activity?.unsaved
        || head.revision !== revision) throw new Error('Resident ownership or settings changed before avatar update');
    return head;
  }
  const hash = value => bytesToHex(sha256(new TextEncoder().encode(JSON.stringify(value))));
  function provenance(agentId, requestId, requestHash, name, sourceArtifactCid) {
    return normalizeResidentAvatarProvenance({ schema: RESIDENT_AVATAR_SCHEMA, worldId, ownerHostId, agentId,
      requestId, requestHash, name, ...(sourceArtifactCid ? { sourceArtifactCid } : {}) });
  }
  function syncSharing(values = bodies) {
    bodies = values.map(body => ({ ...body })); presenter.sync(bodies);
    if (closed) return Promise.resolve();
    if (sharing) return sharing;
    sharing = track((async () => {
      const desired = () => new Set(bodies.filter(body => body.local && body.shared && isOwner(body.agentId)).map(body => body.avatar?.artifactCid).filter(Boolean));
      for (const cid of [...published]) if (!desired().has(cid)) { await runtime.withdraw(cid); published.delete(cid); }
      if (!runtime.artifactReady) return;
      for (const cid of desired()) if (!published.has(cid)) {
        await runtime.publish(cid);
        if (closed || !desired().has(cid)) await runtime.withdraw(cid); else published.add(cid);
      }
    })().catch(error => { if (!closed) emit({ status: 'sharing', message: `Avatar sharing will retry: ${error.message}` }); })
      .finally(() => { sharing = null; }));
    return sharing;
  }
  async function release(avatar) {
    if (!avatar) return;
    await sharing;
    if (published.has(avatar.artifactCid)) { await runtime.withdraw(avatar.artifactCid); published.delete(avatar.artifactCid); }
    await runtime.store.unpin(avatar.artifactCid);
  }
  function generate({ agentId, action, image, exactPrompt = false, expectedRevision, requestId = crypto.randomUUID(), signal: callerSignal } = {}) {
    if (typeof exactPrompt !== 'boolean') throw new TypeError('Exact prompt must be a boolean');
    const proposal = normalizeWorldAvatarAction(action);
    if (proposal.reset && (image != null || exactPrompt)) throw new TypeError('Reset does not accept generation inputs');
    const reference = image == null ? null : validateImageInput(image);
    const pixels = reference ? { ...reference, data: new Uint8Array(reference.data) } : undefined;
    const appearanceSizing = !!pixels && action.size === undefined;
    const fingerprint = hash({ agentId, proposal, exactPrompt, appearanceSizing, ...(pixels ? { image: { width: pixels.width, height: pixels.height,
      channels: pixels.channels, sha256: bytesToHex(sha256(pixels.data)) } } : {}) });
    const previous = requests.get(requestId);
    if (previous) return previous.fingerprint === fingerprint ? previous.promise : Promise.reject(new Error('Conflicting repeated avatar request'));
    if (busy) return Promise.reject(new Error('Wait for the current avatar generation or cancel it'));
    const signal = combined(callerSignal); signal.throwIfAborted(); busy = true;
    const promise = track((async () => {
      const head = await authority(agentId, expectedRevision, signal), old = binding(head).avatar;
      let prepared, avatar, saving = false;
      try {
        if (!proposal.reset) {
          const mesh = await generateWorldMesh({ inference: agents.inference, head, name: proposal.name, description: proposal.prompt,
            image: pixels, exactPrompt, signal, assertCurrent: () => authority(agentId, expectedRevision, signal), onEvent: event => emit({ agentId, ...event }) });
          const size = appearanceSizing ? referenceAvatarSize(mesh, binding(head).appearancePrompt ?? '') : proposal.size;
          prepared = await presenter.prepare(mesh, { signal, size });
          await authority(agentId, expectedRevision, signal);
          const record = await retainGeneratedMesh(runtime.store, mesh, { name: proposal.name, signal,
            provenance: { residentAvatar: provenance(agentId, requestId, fingerprint, proposal.name), worldScale: worldModelScale(size) },
            beforeCommit: () => authority(agentId, expectedRevision, signal) });
          avatar = { kind: 'generated-mesh', artifactCid: record.artifactCid };
        }
        await authority(agentId, expectedRevision, signal);
        const next = { ...binding(head) }; delete next.avatar; if (avatar) next.avatar = avatar;
        // Retention precedes CAS. A failed save may remain in AgentRuntime.unsaved
        // and be committed by Resume: preserve the new pin on ambiguous failure.
        saving = true;
        const updated = await agents.update(agentId, { embodiments: head.embodiments.map(item => item.worldId === worldId ? next : item) },
          { expectedRevision, signal });
        let displayError;
        try { await onSaved(); } catch (error) { displayError = error; }
        const body = { ...bodies.find(item => item.local && item.agentId === agentId), key: `local:${agentId}`, agentId, local: true, avatar };
        if (prepared) {
          try {
            const latest = await agents.get(agentId);
            if (!isOwner(agentId) || binding(latest)?.avatar?.artifactCid !== avatar.artifactCid) throw new Error('A newer resident update superseded this display');
            presenter.commitLocal(body, prepared); prepared = null;
          } catch (error) { displayError = error; }
        }
        // onSaved refreshes the owner directory from acknowledged records.
        await syncSharing();
        try { await release(old); } catch (error) { emit({ status: 'error', message: `Avatar saved; old asset cleanup will need retry: ${error.message}` }); }
        emit({ agentId, status: 'saved', message: proposal.reset ? 'Original cube restored.' : `${proposal.name} saved as this resident’s avatar.` });
        if (displayError) emit({ status: 'error', message: `Avatar saved; display will retry: ${displayError.message}` });
        return { head: updated, avatar, ...(displayError ? { displayError: displayError.message } : {}), name: proposal.reset ? 'original cube' : proposal.name };
      } catch (error) {
        if (avatar && !saving) await release(avatar).catch(() => {});
        throw error;
      } finally { prepared?.dispose(); }
    })().finally(() => { busy = false; }));
    if (requests.size >= 256) requests.delete(requests.keys().next().value);
    requests.set(requestId, { fingerprint, promise });
    promise.catch(() => { if (requests.get(requestId)?.promise === promise) requests.delete(requestId); });
    return promise;
  }
  function retainClone({ sourceBody, avatar, agentId, signal: callerSignal }) {
    return track((async () => {
    const signal = combined(callerSignal), cid = avatar.artifactCid;
    const manifest = sourceBody.local ? await runtime.store.getManifest(cid, { signal }) : await runtime.inspectPeerPackage(cid, { signal });
    residentAvatarFromManifest(cid, manifest, { worldId, agentId: sourceBody.agentId });
    const size = worldModelSizeFromManifest(manifest);
    const mesh = sourceBody.local ? await readGeneratedMesh(runtime.store, cid, { signal }) : await runtime.withArtifactRetention(async retained => {
      await retained.ensure(cid, { signal, pin: false }); return readGeneratedMesh(retained, cid, { signal });
    }, { signal });
    const record = await retainGeneratedMesh(runtime.store, mesh, { signal, name: manifest.name,
      provenance: { residentAvatar: provenance(agentId, crypto.randomUUID(), hash({ agentId, cid }), manifest.provenance.residentAvatar.name, cid), worldScale: worldModelScale(size) } });
    return { kind: 'generated-mesh', artifactCid: record.artifactCid };
    })());
  }
  return { generate, retainClone, release, syncSharing, getStatus: () => ({ busy, ...presenter.getStatus() }),
    async dispose() {
      closed = true; lifetime.abort(); await Promise.allSettled([...operations]); await presenter.dispose(); requests.clear();
      // Durable bindings intentionally keep their meshes pinned across reloads.
    } };
}

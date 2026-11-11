import { generateWorldMesh } from './WorldMeshGeneration.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { validateImageInput } from '../../../peercompute/src/peercompute/inference/modelTask.js';
import { retainGeneratedMesh } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { createWorldGeneratedObjectPresenter } from './WorldGeneratedObjectPresenter.js';
import { WorldGeneratedObjectNetwork } from './WorldGeneratedObjectNetwork.js';
import { WORLD_OBJECT_SCHEMA, WORLD_OBJECT_LIMITS, normalizeWorldObjectAction, normalizeWorldObjectPlacement,
  normalizeWorldObjectDescriptor, worldObjectDescriptorFromManifest, objectText } from './WorldObjectAction.js';

/** A world owns placement, an agent proposes, and managed model services compute.
 * The persistent object is one pinned manifest owning its exact generated GLB. */
export function createWorldGeneratedObjects({ runtime, agents, adapter, worldId, ownerHostId, getNetwork,
  isOwner, onStatus = () => {}, networkFactory = options => new WorldGeneratedObjectNetwork(options) }) {
  objectText(worldId, 240, 'world'); objectText(ownerHostId, 128, 'host');
  if (!runtime?.store || !agents?.inference || !adapter?.prepare || !adapter?.getPlacement || typeof isOwner !== 'function') {
    throw new TypeError('Generated objects need retained artifacts, model routing and an owned scene');
  }
  const lifetime = new AbortController(), local = new Map(), requests = new Map(), published = new Set();
  const operations = new Set(); let remote = [], network, syncing, closed = false, generating = false;
  const emit = event => { try { onStatus(event); } catch { /* Presentation is observational. */ } };
  const presenter = createWorldGeneratedObjectPresenter({ runtime, adapter, worldId,
    onError: ({ descriptor, error }) => emit({ status: 'error', message: `Object ${descriptor.placement.name}: ${error.message}` }) });
  const list = () => [...local.values()].map(value => structuredClone(value));
  const show = () => { if (!closed) presenter.sync([...list().map(value => ({ ...value, local: true })), ...remote]); };
  const track = promise => { operations.add(promise); promise.catch(() => {}).finally(() => operations.delete(promise)); return promise; };
  const signalFor = signal => AbortSignal.any([lifetime.signal, ...(signal ? [signal] : [])]);
  const ready = (async () => {
    for await (const record of runtime.store.list({ signal: lifetime.signal })) {
      if (record.status !== 'complete' || !record.pinned || record.kind !== 'manifest'
          || record.manifest?.provenance?.worldObject?.worldId !== worldId
          || record.manifest?.provenance?.worldObject?.ownerHostId !== ownerHostId) continue;
      try {
        const descriptor = worldObjectDescriptorFromManifest(record.cid, record.manifest, { worldId, ownerHostId });
        if (local.size < WORLD_OBJECT_LIMITS.perOwner) local.set(descriptor.placement.objectId, descriptor);
      } catch (error) { emit({ status: 'error', message: `Stored object unavailable: ${error.message}` }); }
    }
    lifetime.signal.throwIfAborted(); show();
  })();
  async function authority(agentId, revision, signal) {
    signal.throwIfAborted();
    const head = await agents.get(agentId); signal.throwIfAborted();
    if (closed || !isOwner(agentId) || !head || head.status === 'paused' || head.recoveryRequired
        || head.activity?.unsaved || (revision !== undefined && head.revision !== revision)
        || !head.embodiments?.some(binding => binding.worldId === worldId)) throw new Error('Resident ownership or settings changed before object placement');
    return head;
  }
  function generate({ agentId, action, image: sourceImage, requestId = crypto.randomUUID(), expectedRevision, signal: callerSignal } = {}) {
    const proposal = normalizeWorldObjectAction(action);
    const reference = sourceImage ? { ...validateImageInput(sourceImage), data: sourceImage.data.slice() } : null;
    const fingerprint = bytesToHex(sha256(new TextEncoder().encode(JSON.stringify({ agentId, proposal,
      ...(reference ? { image: { width: reference.width, height: reference.height, channels: reference.channels,
        sha256: bytesToHex(sha256(reference.data)) } } : {}) }))));
    const previous = requests.get(requestId);
    if (previous) {
      if (previous.fingerprint !== fingerprint) return Promise.reject(new Error('Conflicting repeated object request'));
      return previous.promise;
    }
    if (generating) return Promise.reject(new Error('Wait for the current object generation or cancel it'));
    const signal = signalFor(callerSignal); signal.throwIfAborted();
    generating = true;
    const work = track((async () => {
      await ready; const saved = [...local.values()].find(value => value.placement.requestId === requestId);
      if (saved) {
        await authority(agentId, undefined, signal);
        if (saved.placement.agentId !== agentId || saved.placement.requestHash !== fingerprint) throw new Error('Conflicting saved object request');
        show(); return { status: 'saved', ...saved };
      }
      if (local.size >= WORLD_OBJECT_LIMITS.perOwner) throw new Error('This host has reached 32 generated objects in this room');
      const head = await authority(agentId, expectedRevision, signal);
      const mesh = await generateWorldMesh({ inference: agents.inference, head, description: proposal.prompt,
        name: proposal.name, image: reference, signal, assertCurrent: () => authority(agentId, expectedRevision, signal),
        onEvent: event => emit({ agentId, ...event }) });
      const placement = normalizeWorldObjectPlacement({ schema: WORLD_OBJECT_SCHEMA, worldId, ownerHostId, agentId,
        objectId: requestId, requestId, requestHash: fingerprint, name: proposal.name,
        position: adapter.getPlacement(agentId, proposal.size), size: proposal.size });
      let prepared;
      try {
        prepared = await presenter.prepare(mesh, { signal });
        await authority(agentId, expectedRevision, signal);
        emit({ agentId, status: 'saving', message: `Saving ${proposal.name} on this device…` });
        const record = await retainGeneratedMesh(runtime.store, mesh, { name: proposal.name,
          provenance: { worldObject: placement }, signal, beforeCommit: () => authority(agentId, expectedRevision, signal) });
        // Acknowledged retention is the commit boundary. Later cancellation
        // cannot erase the saved object; restoration does not rerun generation.
        const descriptor = normalizeWorldObjectDescriptor({ artifactCid: record.artifactCid, placement });
        local.set(placement.objectId, descriptor);
        presenter.commitLocal(descriptor, prepared); prepared = null;
        emit({ agentId, status: 'placed', message: `Placed ${proposal.name}. Shared with this room when connected.` });
        void syncNetwork(); return { status: 'placed', ...descriptor };
      } finally { prepared?.dispose(); }
    })().catch(error => { emit({ agentId, status: 'error', message: error.name === 'AbortError' ? 'Object creation cancelled.' : error.message }); throw error; })
      .finally(() => { generating = false; }));
    requests.set(requestId, { fingerprint, promise: work });
    work.catch(() => { if (requests.get(requestId)?.promise === work) requests.delete(requestId); });
    return work;
  }
  async function remove(objectId, { signal: callerSignal } = {}) {
    const signal = signalFor(callerSignal); await ready; signal.throwIfAborted();
    const descriptor = local.get(objectId); if (!descriptor) throw new Error('Only this host can remove its generated objects');
    if (published.has(descriptor.artifactCid)) { await runtime.withdraw(descriptor.artifactCid); published.delete(descriptor.artifactCid); }
    signal.throwIfAborted(); await runtime.store.unpin(descriptor.artifactCid, { signal });
    local.delete(objectId); requests.delete(descriptor.placement.requestId); show();
  }
  function syncNetwork() {
    if (closed) return Promise.resolve();
    if (syncing) return syncing;
    syncing = track((async () => {
      await ready; lifetime.signal.throwIfAborted();
      show();
      if (runtime.artifactReady) for (const descriptor of local.values()) {
        if (!published.has(descriptor.artifactCid)) {
          try {
            await runtime.publish(descriptor.artifactCid);
            if (closed || local.get(descriptor.placement.objectId)?.artifactCid !== descriptor.artifactCid) {
              await runtime.withdraw(descriptor.artifactCid);
            } else published.add(descriptor.artifactCid);
          }
          catch (error) { emit({ status: 'sharing', message: `Object saved locally; peer sharing will retry: ${error.message}` }); }
        }
      }
      const manager = getNetwork?.(), node = manager?.getLibp2pNode?.() ?? manager?.libp2p;
      if (network && (network.node !== node || manager?.isConnected === false)) { await network.close(); network = null; remote = []; show(); }
      if (!node || manager.isConnected === false) return;
      if (!network) {
        const next = networkFactory({ networkManager: manager, worldId, listLocalObjects: list,
          onDirectory: values => { if (!closed) { remote = values; show(); } } });
        try { await next.start(); lifetime.signal.throwIfAborted(); network = next; }
        catch (error) { await next.close(); throw error; }
      }
      await network.refresh();
    })()).catch(error => { if (!closed) emit({ status: 'sharing', message: `Object discovery will retry: ${error.message}` }); })
      .finally(() => { syncing = null; });
    return syncing;
  }
  return { ready, generate, remove, list, syncNetwork,
    getStatus: () => ({ local: local.size, remote: remote.length, ...presenter.getStatus() }),
    async dispose() {
      if (closed) return; closed = true; lifetime.abort(new DOMException('Generated objects closed', 'AbortError'));
      await ready.catch(() => {}); await network?.close(); await Promise.allSettled([...operations]);
      await presenter.dispose(); adapter.dispose();
      // Saved placement artifacts intentionally remain retained for reload.
      local.clear(); remote = []; requests.clear();
    },
  };
}

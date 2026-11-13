import { acquireArtifactLock } from '../../../peercompute/src/peercompute/artifacts/ArtifactLocks.js';
import { WorldObjectStore } from '../../../peercompute/src/peercompute/agents/WorldObjectStore.js';
import { ARTIFACT_MANIFEST_SCHEMA } from '../../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { normalizeWorldObjectSize } from '../world/WorldModelScale.js';
import { generateWorldMesh } from './WorldMeshGeneration.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { validateImageInput } from '../../../peercompute/src/peercompute/inference/modelTask.js';
import { retainGeneratedMesh } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { createWorldGeneratedObjectPresenter } from './WorldGeneratedObjectPresenter.js';
import { WorldGeneratedObjectNetwork } from './WorldGeneratedObjectNetwork.js';
import { WORLD_OBJECT_SCHEMA, WORLD_OBJECT_TRANSFORM_SCHEMA, worldObjectRevision, WORLD_OBJECT_LIMITS, normalizeWorldObjectAction, normalizeWorldObjectPlacement,
  normalizeWorldObjectDescriptor, worldObjectDescriptorFromManifest, objectText, objectPosition, normalizeWorldObjectTarget } from './WorldObjectAction.js';

const fallbackStores = new WeakMap();

/** A world owns placement, an agent proposes, and managed model services compute.
 * The persistent object is one pinned manifest owning its exact generated GLB. */
export function createWorldGeneratedObjects({ runtime, agents, adapter, worldId, ownerHostId, getNetwork,
  isOwner, isCurrent, assertPlacementCurrent, objectStore: suppliedObjectStore, onStatus = () => {}, networkFactory = options => new WorldGeneratedObjectNetwork(options) }) {
  objectText(worldId, 240, 'world'); objectText(ownerHostId, 128, 'host');
  if (!runtime?.store || !agents?.inference || !adapter?.prepare || !adapter?.getPlacement || typeof isOwner !== 'function') {
    throw new TypeError('Generated objects need retained artifacts, model routing and an owned scene');
  }
  if (isCurrent !== undefined && typeof isCurrent !== 'function') throw new TypeError('Object current authority must be a synchronous callback');
  if (assertPlacementCurrent !== undefined && typeof assertPlacementCurrent !== 'function') throw new TypeError('Placement authority requires a callback');
  let objectStore = suppliedObjectStore ?? fallbackStores.get(runtime.store);
  if (!objectStore || objectStore.closed) {
    objectStore = new WorldObjectStore({ name: runtime.store.name, persistent: runtime.store.persistent,
      indexedDBImpl: runtime.store.backend?.indexedDB });
    fallbackStores.set(runtime.store, objectStore);
  }
  const scope = { worldId, ownerHostId };
  const mutationLock = signal => acquireArtifactLock(`world-objects:${runtime.store.lockName}:${JSON.stringify(scope)}`, 'exclusive', signal, runtime.store.lockManager);
  const lifetime = new AbortController(), local = new Map(), requests = new Map(), published = new Set();
  const operations = new Set(); let remote = [], network, syncing, closed = false, generating = false;
  const emit = event => { try { onStatus(event); } catch { /* Presentation is observational. */ } };
  const presenter = createWorldGeneratedObjectPresenter({ runtime, adapter, worldId,
    onError: ({ descriptor, error }) => emit({ status: 'error', message: `Object ${descriptor.placement.name}: ${error.message}` }) });
  const list = () => [...local.values()].map(value => structuredClone(value));
  const show = () => { if (!closed) presenter.sync([...list().map(value => ({ ...value, local: true })), ...remote]); };
  const track = promise => { operations.add(promise); promise.catch(() => {}).finally(() => operations.delete(promise)); return promise; };
  const signalFor = signal => AbortSignal.any([lifetime.signal, ...(signal ? [signal] : [])]);
  async function descriptorFor(head, signal) {
    if (head.deleted) return null;
    const manifest = await runtime.store.getManifest(head.artifactCid, { signal });
    const descriptor = worldObjectDescriptorFromManifest(head.artifactCid, manifest, scope);
    if (descriptor.placement.objectId !== head.objectId || worldObjectRevision(descriptor) !== head.revision) {
      throw new Error('Stored object head does not match its immutable placement');
    }
    return descriptor;
  }
  async function refreshHeads(signal, wait = false) {
    const heads = await objectStore.list(scope, { signal });
    for (const head of heads) {
      if (head.deleted) local.delete(head.objectId);
      else if (local.get(head.objectId)?.artifactCid !== head.artifactCid) {
        local.set(head.objectId, await descriptorFor(head, signal));
      }
    }
    show();
    if (wait) await presenter.whenLocalReady({ signal });
  }
  const ready = (async () => {
    await objectStore.open();
    // Legacy creation records are adopted once. Transform candidates alone are
    // not committed heads, including those left pinned by an interrupted CAS.
    for await (const record of runtime.store.list({ signal: lifetime.signal })) {
      if (record.status !== 'complete' || !record.pinned || record.kind !== 'manifest'
          || record.manifest?.provenance?.worldObject?.schema !== WORLD_OBJECT_SCHEMA
          || record.manifest.provenance.worldObject.worldId !== worldId
          || record.manifest.provenance.worldObject.ownerHostId !== ownerHostId) continue;
      try {
        const descriptor = worldObjectDescriptorFromManifest(record.cid, record.manifest, scope);
        await objectStore.adopt({ ...descriptor.placement, artifactCid: descriptor.artifactCid }, { signal: lifetime.signal });
      } catch (error) { emit({ status: 'error', message: `Stored object unavailable: ${error.message}` }); }
    }
    for (const head of await objectStore.list(scope, { signal: lifetime.signal })) {
      if (head.deleted) continue;
      try { const descriptor = await descriptorFor(head, lifetime.signal); local.set(head.objectId, descriptor); }
      catch (error) { emit({ status: 'error', message: `Stored object unavailable: ${error.message}` }); }
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
  function generate({ agentId, action, placementTarget, image: sourceImage, requestId = crypto.randomUUID(), expectedRevision, signal: callerSignal } = {}) {
    const proposal = normalizeWorldObjectAction(action);
    const target = placementTarget === undefined ? undefined : normalizeWorldObjectTarget(placementTarget);
    const reference = sourceImage ? { ...validateImageInput(sourceImage), data: sourceImage.data.slice() } : null;
    const fingerprint = bytesToHex(sha256(new TextEncoder().encode(JSON.stringify({ agentId, proposal,
      ...(target ? { placementTarget: target } : {}),
      ...(reference ? { image: { width: reference.width, height: reference.height, channels: reference.channels,
        sha256: bytesToHex(sha256(reference.data)) } } : {}) }))));
    const previous = requests.get(requestId);
    if (previous) {
      if (previous.fingerprint !== fingerprint) return Promise.reject(new Error('Conflicting repeated object request'));
      return previous.promise;
    }
    if (generating) return Promise.reject(new Error('Wait for the current object generation or cancel it'));
    const signal = signalFor(callerSignal); signal.throwIfAborted();
    const currentAuthority = async () => {
      const head = await authority(agentId, expectedRevision, signal);
      if (target) {
        if (adapter.supportsGroundedPlacement !== true) throw new Error('This world does not support requested object destinations');
        await assertPlacementCurrent?.({ agentId, placementTarget: structuredClone(target), signal });
        await authority(agentId, expectedRevision, signal);
      }
      return head;
    };
    const position = () => objectPosition(adapter.getPlacement(agentId, proposal.size, target ? structuredClone(target) : undefined));
    generating = true;
    const work = track((async () => {
      await ready; const operation = await objectStore.operation(scope, requestId, { signal });
      const saved = operation ? await descriptorFor({ ...operation, deleted: false }, signal) : undefined;
      if (saved) {
        await authority(agentId, undefined, signal);
        if (operation.agentId !== agentId || operation.requestHash !== fingerprint) throw new Error('Conflicting saved object request');
        show(); return { status: 'saved', ...saved };
      }
      if (local.size >= WORLD_OBJECT_LIMITS.perOwner) throw new Error('This host has reached 32 generated objects in this room');
      const head = await currentAuthority();
      position(); // Reject unavailable destinations before consuming model resources.
      const mesh = await generateWorldMesh({ inference: agents.inference, head, description: proposal.prompt,
        name: proposal.name, image: reference, signal, assertCurrent: async () => { await currentAuthority(); position(); },
        onEvent: event => emit({ agentId, ...event }) });
      const placement = normalizeWorldObjectPlacement({ schema: WORLD_OBJECT_SCHEMA, worldId, ownerHostId, agentId,
        objectId: requestId, requestId, requestHash: fingerprint, name: proposal.name,
        position: position(), size: proposal.size });
      let prepared;
      const release = await mutationLock(signal);
      try {
        await refreshHeads(signal, true);
        if (local.size >= WORLD_OBJECT_LIMITS.perOwner) throw new Error('This host has reached 32 generated objects in this room');
        prepared = await presenter.prepare(mesh, { signal });
        await currentAuthority(); placement.position = position();
        emit({ agentId, status: 'saving', message: `Saving ${proposal.name} on this device…` });
        const record = await retainGeneratedMesh(runtime.store, mesh, { name: proposal.name,
          provenance: { worldObject: placement }, signal, beforeCommit: async () => {
            await currentAuthority();
            // Retention calls this after importing bytes but before constructing
            // the pinned manifest. Reobserve people and geometry here; both the
            // saved manifest and visible receipt use this exact final point.
            placement.position = position();
          } });
        // Acknowledged retention is the commit boundary. Later cancellation
        // cannot erase the saved object; restoration does not rerun generation.
        const descriptor = normalizeWorldObjectDescriptor({ artifactCid: record.artifactCid, placement });
        let savedHead;
        try { savedHead = await objectStore.adopt({ ...placement, artifactCid: record.artifactCid }); }
        catch (error) {
          const displayError = `Object was saved, but its local index could not be updated: ${String(error?.message || 'storage unavailable')}`
            .replaceAll('\0', '').slice(0, 240).toWellFormed();
          emit({ agentId, status: 'saved', message: displayError });
          return { status: 'saved', ...descriptor, displayError, indexError: true };
        }
        if (savedHead.deleted || savedHead.artifactCid !== record.artifactCid) throw new Error('Object identity was already replaced or removed');
        local.set(placement.objectId, descriptor);
        try { presenter.commitLocal(descriptor, prepared); prepared = null; }
        catch (error) {
          // The mesh and final placement already belong to a pinned manifest.
          // A full/lost renderer cannot turn that durable result into a failed
          // generation or cause an identical request to regenerate the object.
          let displayError = String(error?.message || 'Object display failed').replaceAll('\0', '').slice(0, 240).toWellFormed();
          try { prepared?.dispose(); }
          catch (cleanupError) {
            displayError = `${displayError}; display cleanup: ${String(cleanupError?.message || 'failed')}`
              .replaceAll('\0', '').slice(0, 480).toWellFormed();
          }
          prepared = null;
          emit({ agentId, status: 'saved', message: `Saved ${proposal.name}, but could not display it: ${displayError}` });
          void syncNetwork();
          return { status: 'saved', ...descriptor, displayError };
        }
        emit({ agentId, status: 'placed', message: `Placed ${proposal.name}. Shared with this room when connected.` });
        void syncNetwork(); return { status: 'placed', ...descriptor };
      } finally { prepared?.dispose(); release(); }
    })().catch(error => { emit({ agentId, status: 'error', message: error.name === 'AbortError' ? 'Object creation cancelled.' : error.message }); throw error; })
      .finally(() => { generating = false; }));
    requests.set(requestId, { fingerprint, promise: work });
    work.catch(() => { if (requests.get(requestId)?.promise === work) requests.delete(requestId); });
    return work;
  }
  function resize({ agentId, objectId, expectedObjectRevision, expectedArtifactCid, multiplier, size,
    requestId = crypto.randomUUID(), expectedRevision, signal: callerSignal } = {}) {
    if (!Number.isSafeInteger(expectedObjectRevision) || expectedObjectRevision < 0 || !expectedArtifactCid
        || (multiplier === undefined) === (size === undefined)
        || (multiplier !== undefined && (!Number.isFinite(multiplier) || multiplier <= 0))) throw new TypeError('Resize needs a current object revision and one exact scale');
    if (size !== undefined) normalizeWorldObjectSize(size);
    const fingerprint = bytesToHex(sha256(new TextEncoder().encode(JSON.stringify({ operation: 'resize', agentId, objectId,
      expectedObjectRevision, expectedArtifactCid, ...(size === undefined ? { multiplier } : { size }) }))));
    const prior = requests.get(requestId);
    if (prior) {
      if (prior.fingerprint !== fingerprint) return Promise.reject(new Error('Conflicting repeated object request'));
      return prior.promise;
    }
    const signal = signalFor(callerSignal);
    const work = track((async () => {
      await ready;
      const release = await mutationLock(signal);
      try {
        await authority(agentId, expectedRevision, signal);
        const replay = await objectStore.operation(scope, requestId, { signal });
        if (replay) {
          if (replay.requestHash !== fingerprint || replay.objectId !== objectId || replay.agentId !== agentId) throw new Error('Conflicting saved object request');
          const current = await objectStore.get(scope, objectId, { signal });
          if (current?.deleted) throw new Error('This object was removed');
          const saved = await descriptorFor({ ...replay, deleted: false }, signal);
          const before = worldObjectDescriptorFromManifest(replay.previousArtifactCid,
            await runtime.store.getManifest(replay.previousArtifactCid, { signal }), scope);
          await authority(agentId, undefined, signal);
          return { status: 'saved', ...saved, oldSize: before.placement.size, newSize: saved.placement.size,
            multiplier: saved.placement.size / before.placement.size, replayed: true };
        }
        await refreshHeads(signal, true);
        const head = await objectStore.get(scope, objectId, { signal });
        if (!head || head.deleted || head.revision !== expectedObjectRevision || head.artifactCid !== expectedArtifactCid) {
          throw new Error('Object revision changed or object is not owned by this host');
        }
        const before = await descriptorFor(head, signal);
        const newSize = normalizeWorldObjectSize(size ?? before.placement.size * multiplier);
        if (typeof adapter.validateTransform !== 'function') throw new Error('This world does not support resizing existing objects');
        const placement = normalizeWorldObjectPlacement({ ...before.placement, schema: WORLD_OBJECT_TRANSFORM_SCHEMA,
          revision: expectedObjectRevision + 1, previousArtifactCid: before.artifactCid, actorAgentId: agentId,
          requestId, requestHash: fingerprint, size: newSize });
        const key = `local:${objectId}`;
        const validate = () => {
          const point = objectPosition(adapter.validateTransform(key, { artifactCid: before.artifactCid, placement }, { agentId }));
          if (point[0] !== before.placement.position[0] || point[2] !== before.placement.position[2]) throw new Error('A resize cannot move an object');
          placement.position = point;
        };
        await authority(agentId, expectedRevision, signal); validate();
        const manifest = await runtime.store.getManifest(before.artifactCid, { signal });
        worldObjectDescriptorFromManifest(before.artifactCid, manifest, scope);
        let candidate, committed = false;
        try {
          await runtime.store.withRetention(async retained => {
            await authority(agentId, expectedRevision, signal); validate();
            const writtenPosition = [...placement.position];
            candidate = await retained.importManifest({ schema: ARTIFACT_MANIFEST_SCHEMA, name: manifest.name,
              files: manifest.files, provenance: { ...manifest.provenance, worldObject: placement } }, { signal, pin: true });
            await authority(agentId, expectedRevision, signal); validate();
            if (JSON.stringify(placement.position) !== JSON.stringify(writtenPosition)) throw new Error('Object support changed while saving its transform');
            await objectStore.commit({ ...scope, objectId, agentId, expectedRevision: expectedObjectRevision,
              expectedArtifactCid, artifactCid: candidate.cid, requestId, requestHash: fingerprint },
            { signal, isCurrent: () => !closed && isOwner(agentId) && (isCurrent === undefined || isCurrent(agentId, expectedRevision) === true) });
            committed = true;
          }, { signal });
        } catch (error) {
          if (!committed) {
            if (candidate) await runtime.store.unpin(candidate.cid).catch(() => {});
            throw error;
          }
          // The retention wrapper can notice cancellation after the head CAS.
          // Acknowledged durable effects still return their actual receipt.
        }
        const descriptor = normalizeWorldObjectDescriptor({ artifactCid: candidate.cid, placement });
        local.set(objectId, descriptor);
        const result = { ...descriptor, oldSize: before.placement.size, newSize, multiplier: newSize / before.placement.size };
        try {
          presenter.transformLocal(descriptor, manifest.files[0].cid);
          emit({ agentId, status: 'resized', message: `Resized ${placement.name} from ${result.oldSize} to ${newSize} world units.` });
          void syncNetwork(); return { status: 'resized', ...result };
        } catch (error) {
          const displayError = String(error?.message || 'Object display failed').replaceAll('\0', '').slice(0, 240).toWellFormed();
          emit({ agentId, status: 'saved', message: `Saved ${placement.name} at size ${newSize}; display will retry: ${displayError}` });
          show(); void syncNetwork(); return { status: 'saved', ...result, displayError };
        }
      } finally { release(); }
    })().catch(error => { emit({ agentId, status: 'error', message: error.message }); throw error; }));
    requests.set(requestId, { fingerprint, promise: work });
    work.catch(() => { if (requests.get(requestId)?.promise === work) requests.delete(requestId); });
    return work;
  }
  async function remove(objectId, { signal: callerSignal } = {}) {
    const signal = signalFor(callerSignal); await ready; signal.throwIfAborted();
    const release = await mutationLock(signal);
    try {
      const descriptor = local.get(objectId); if (!descriptor) throw new Error('Only this host can remove its generated objects');
      await objectStore.commit({ ...scope, objectId, agentId: descriptor.placement.agentId,
        expectedRevision: worldObjectRevision(descriptor), expectedArtifactCid: descriptor.artifactCid,
        artifactCid: descriptor.artifactCid, requestId: crypto.randomUUID(), requestHash: '0'.repeat(64), deleted: true }, { signal });
      local.delete(objectId); requests.clear(); show();
      // Tombstone first: a crash midway through unpinning historical manifests
      // cannot restore either the old scale or the deleted object.
      for await (const record of runtime.store.list()) {
        const placement = record.manifest?.provenance?.worldObject;
        if (placement?.worldId !== worldId || placement.ownerHostId !== ownerHostId || placement.objectId !== objectId) continue;
        if (published.has(record.cid)) { await runtime.withdraw(record.cid); published.delete(record.cid); }
        if (record.pinned) await runtime.store.unpin(record.cid);
      }
    } finally { release(); }
  }
  function syncNetwork() {
    if (closed) return Promise.resolve();
    if (syncing) return syncing;
    syncing = track((async () => {
      await ready; lifetime.signal.throwIfAborted();
      const release = await mutationLock(lifetime.signal);
      try { await refreshHeads(lifetime.signal); } finally { release(); }
      if (runtime.artifactReady) for (const descriptor of local.values()) {
        if (!published.has(descriptor.artifactCid)) {
          try {
            await runtime.publish(descriptor.artifactCid);
            if (closed || local.get(descriptor.placement.objectId)?.artifactCid !== descriptor.artifactCid) {
              await runtime.withdraw(descriptor.artifactCid);
            } else {
              published.add(descriptor.artifactCid);
              for (const cid of [...published]) {
                if (cid === descriptor.artifactCid || [...local.values()].some(value => value.artifactCid === cid)) continue;
                await runtime.withdraw(cid); published.delete(cid);
              }
            }
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
  return { ready, generate, resize, remove, list, syncNetwork,
    getStatus: () => ({ local: local.size, remote: remote.length, ...presenter.getStatus() }),
    async dispose() {
      if (closed) return; closed = true; lifetime.abort(new DOMException('Generated objects closed', 'AbortError'));
      await ready.catch(() => {}); await network?.close(); await Promise.allSettled([...operations]);
      await presenter.dispose(); adapter.dispose();
      if (!suppliedObjectStore && objectStore.persistent) await objectStore.destroy();
      // Saved placement artifacts intentionally remain retained for reload.
      local.clear(); remote = []; requests.clear();
    },
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { attachModelRuntimeController } from '../../../demos/inference/src/modelRuntimeController.js';

const cid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const model = { runtime: 'transformers.js', repository: 'test/model', revision: 'a'.repeat(40), modalities: ['text', 'image'] };
const manifest = { name: 'Test vision model', model, files: [{ size: 100 }] };
const catalog = { test: { id: 'test', name: manifest.name, model, totalBytes: 100 } };
const descriptor = { manifestCid: cid, modelId: 'test', name: manifest.name, ...model, totalBytes: 100 };

function fixture({ retained = false, connected = true, failRelease = false, hooks = {}, modelInfo = model } = {}) {
  const calls = [], records = new Map(), published = new Set();
  const localManifest = { ...manifest, model: modelInfo };
  const record = { cid, manifest: localManifest, kind: 'manifest', pinned: true, status: 'complete' };
  if (retained) records.set(cid, record);
  let status = { status: 'idle', manifestCid: null };
  let callbacks, released = false;
  const peer = {
    models: [], hosts: [], enabled: true,
    listModels() { return this.models; }, listHosts() { return this.hosts; },
    async refresh() { calls.push('refresh'); },
    async setHostingEnabled(value) { this.enabled = value; calls.push(`hosting:${value}`); },
    async generate(_cid, options) { calls.push('remote'); return hooks.remoteGenerate?.(options) ?? { text: 'Remote answer', image: options.image }; },
    async cancel() { calls.push('cancel-remote'); },
  };
  const network = { isConnected: connected,
    getPublishedArtifactCids: () => [...published],
    async createPeerInferenceService(options) { callbacks = options; peer.closed = false; calls.push('attach'); return peer; },
    async releasePeerInferenceService(owner) {
      assert.equal(owner, callbacks.owner); calls.push('release');
      if (failRelease) { failRelease = false; throw new Error('Stop failed'); }
      released = true;
    },
  };
  const service = { getStatus: () => status,
    async generate(options) {
      calls.push('local');
      if (hooks.localGenerate) return hooks.localGenerate(options);
      if (options.prompt === 'wait') return new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true }));
      return { text: 'Local answer', workerId: 'worker-1' };
    },
    async unloadModel() { calls.push('unload'); await hooks.unload?.(); status = { status: 'idle' }; },
    async cancel() { calls.push('cancel-local'); },
  };
  const runtime = { service, networkManager: network,
    ...(hooks.compatibility ? { getModelCompatibility: hooks.compatibility } : {}),
    ...(hooks.inspectPeerPackage ? { inspectPeerPackage: hooks.inspectPeerPackage } : {}),
    ...(hooks.deviceCheck ? { checkDeviceCapabilities: hooks.deviceCheck } : {}),
    ...(hooks.setBudgets ? { setMemoryBudgets: hooks.setBudgets } : {}),
    get networkReady() { return network.isConnected; },
    store: { async *list() { yield* records.values(); }, async getManifest() { return localManifest; },
      async acquireUse() { calls.push('use'); return async () => { calls.push('release-use'); }; },
      async stat(key) { return records.get(key); },
      async remove(key) { calls.push('remove'); await hooks.remove?.(key, records); const removed = records.delete(key); return { removed, freedBytes: removed ? 100 : 0 }; } },
    async importCatalog() { calls.push('import'); await hooks.import?.(); records.set(cid, record); return record; },
    async importPackage() { records.set(cid, record); return record; },
    async load(key) { calls.push('load'); status = { status: 'ready', manifestCid: key };
      await hooks.load?.((value) => { status = value; }); return { workerId: 'worker-1' }; },
    async ensure() { calls.push('fetch-peer'); records.set(cid, record); return record; },
    async publish(key) { calls.push('publish'); await hooks.publish?.(); published.add(key); },
    async withdraw(key) { calls.push('withdraw'); published.delete(key); },
    async connect() { network.isConnected = true; }, async connectBackend() { network.isConnected = true; },
    async dispose() { calls.push('dispose'); },
  };
  const controller = attachModelRuntimeController(runtime, { catalog: { test: { ...catalog.test, model: modelInfo } } });
  return { runtime, controller, calls, peer, published, records, get callbacks() { return callbacks; }, get released() { return released; } };
}

test('opening the console enables both preferences without fetching or loading weights', async () => {
  const f = fixture(); await f.controller.initialize();
  assert.deepEqual(f.runtime.getPreferences(), { sharing: true, hostInference: true });
  assert.equal(f.calls.includes('load'), false); assert.equal(f.calls.includes('import'), false);
  assert.equal((await f.callbacks.getLocalState()).hostedModel, null);
  assert.equal(f.runtime.listInferenceTargets()[0].available, false);
  await f.runtime.dispose();
});

test('blocked catalog and peer imports do not download or unload; remote inference still works', async () => {
  const blocked = { status: 'unavailable', code: 'gpu-budget', reason: 'Exceeds configured GPU memory budget' };
  const f = fixture({ hooks: { compatibility: () => blocked } });
  await f.controller.initialize();
  f.peer.models = [{ ...descriptor, providers: [{ peerId: 'remote', local: false }] }];
  f.peer.hosts = [{ ...descriptor, hosts: [{ peerId: 'remote', local: false, busy: false }] }];
  assert(f.runtime.listModelSources().every((source) => source.localAvailability === blocked));
  for (const key of ['hf:test', `peer:${cid}`]) {
    await assert.rejects(f.runtime.acquireModel(key), (error) => error.code === 'ERR_MODEL_LOCAL_UNAVAILABLE');
  }
  assert(!f.calls.some((call) => ['import', 'fetch-peer', 'load', 'unload', 'use'].includes(call)));
  const remote = f.runtime.listInferenceTargets().find((target) => !target.local);
  assert.equal(remote.available, true);
  assert.equal((await f.runtime.generate(remote.key, { prompt: 'Hello' })).text, 'Remote answer');
  await f.runtime.dispose();
});

test('cached device check completes before exposing local choices and unknown fit remains usable', async () => {
  let checked = false;
  const f = fixture({ hooks: {
    deviceCheck: async () => { await Promise.resolve(); checked = true; },
    compatibility: () => ({ status: checked ? 'unknown' : 'checking', reason: 'Memory fit unverified' }),
  } });
  await assert.rejects(f.runtime.acquireModel('hf:test'), /Memory fit unverified/);
  assert(!f.calls.includes('import'));
  await f.controller.initialize();
  assert.equal(f.runtime.listModelSources()[0].localAvailability.status, 'unknown');
  await f.runtime.acquireModel('hf:test'); assert(f.calls.includes('load'));
  await f.runtime.dispose();
});

test('stale selections and direct local load recheck capability before acquiring a file lease', async () => {
  let blocked = false;
  const f = fixture({ retained: true, hooks: { compatibility: () => ({
    status: blocked ? 'unavailable' : 'unknown', reason: 'Device limit changed',
  }) } });
  await f.controller.initialize();
  const choice = f.runtime.listModelSources()[0];
  blocked = true;
  await assert.rejects(f.runtime.acquireModel(choice.key), /Device limit changed/);
  await assert.rejects(f.runtime.load(cid), /Device limit changed/);
  assert(!f.calls.some((call) => ['import', 'load', 'unload', 'use'].includes(call)));
  await f.runtime.dispose();
});

test('peer display metadata cannot lower the trusted model requirements', async () => {
  let checked;
  const f = fixture({ hooks: { compatibility: (entry) => {
    checked = entry;
    return { status: entry.totalBytes === 100 ? 'unavailable' : 'unknown', reason: 'Trusted model exceeds budget' };
  } } });
  await f.controller.initialize();
  f.peer.models = [{ ...descriptor, totalBytes: 1, providers: [{ peerId: 'remote', local: false }] }];
  await assert.rejects(f.runtime.acquireModel(`peer:${cid}`), /Trusted model exceeds budget/);
  assert.equal(checked.totalBytes, 100);
  assert(!f.calls.includes('fetch-peer'));
  await f.runtime.dispose();
});

test('peer manifest preflight rejects large actual requirements before fetching weights', async () => {
  const seen = [];
  const f = fixture({ hooks: {
    compatibility: (entry) => ({ status: entry.name === 'Too large' ? 'unavailable' : 'unknown', reason: 'Actual package exceeds budget' }),
    inspectPeerPackage: async (key) => { seen.push(key); return { ...manifest, name: 'Too large' }; },
  } });
  await f.controller.initialize(); await f.runtime.acquireModel('hf:test');
  f.calls.length = 0;
  f.peer.models = [{ ...descriptor, providers: [{ peerId: 'remote', local: false }] }];
  await assert.rejects(f.runtime.acquireModel(`peer:${cid}`), /Actual package exceeds budget/);
  assert.deepEqual(seen, [cid]);
  assert(!f.calls.some((call) => ['fetch-peer', 'unload', 'load'].includes(call)));
  assert.equal(f.runtime.listInferenceTargets()[0].available, true);
  await f.runtime.dispose();
});

test('memory budget changes wait for an active import and actual manifest is rechecked before unload', async () => {
  let completeImport, imported = false, writes = 0;
  const wait = new Promise((resolve) => { completeImport = resolve; });
  const f = fixture({ hooks: {
    setBudgets: () => { writes++; return {}; },
    import: async () => { await wait; imported = true; },
    compatibility: (entry) => ({ status: imported && entry.files ? 'unavailable' : 'unknown', reason: 'Actual manifest exceeds budget' }),
  } });
  await f.controller.initialize();
  const acquiring = f.runtime.acquireModel('hf:test');
  assert.throws(() => f.runtime.setMemoryBudgets({ gpuBytes: 1 }), /Wait for the model import/);
  assert.equal(writes, 0);
  completeImport();
  await assert.rejects(acquiring, /Actual manifest exceeds budget/);
  assert(!f.calls.includes('unload')); assert(!f.calls.includes('load'));
  f.runtime.setMemoryBudgets({ gpuBytes: null }); assert.equal(writes, 1);
  await f.runtime.dispose();
});

test('failed startup retains underlying resources until manager-owned cleanup can be retried', async () => {
  const f = fixture(); let owned, releases = 0;
  f.runtime.networkManager.createPeerInferenceService = async ({ owner }) => {
    owned = owner; throw new AggregateError([new Error('Start failed'), new Error('Unhandle failed')], 'Startup cleanup failed');
  };
  f.runtime.networkManager.releasePeerInferenceService = async (owner) => {
    assert.equal(owner, owned);
    if (++releases === 1) throw new Error('Unhandle still failing');
    owned = null;
  };
  await assert.rejects(f.controller.initialize(), /Startup cleanup failed/);
  await assert.rejects(f.runtime.dispose(), /Unhandle still failing/);
  assert.equal(f.calls.includes('dispose'), false);
  assert(owned);
  await f.runtime.dispose();
  assert.equal(releases, 2);
  assert.equal(owned, null);
  assert.equal(f.calls.filter((call) => call === 'dispose').length, 1);
});

test('a surviving console reattaches hosting after the shared network manager reconnects', async () => {
  const f = fixture(); await f.controller.initialize();
  await f.runtime.acquireModel('hf:test');
  await f.runtime.setHostInference(false);
  f.peer.closed = true;
  f.runtime.networkManager.isConnected = false;
  await f.runtime.connect();
  assert.equal(f.calls.filter((call) => call === 'attach').length, 2);
  assert.equal(f.peer.enabled, false);
  assert.equal(f.calls.filter((call) => call === 'load').length, 1);
  await f.runtime.refreshPeers();
  assert.equal(f.runtime.listInferenceTargets()[0].available, true);
  await f.runtime.dispose();
});

test('one HF acquisition pins publishes and automatically loads the managed model', async () => {
  const f = fixture(); await f.controller.initialize();
  await f.runtime.acquireModel('hf:test');
  assert(f.calls.indexOf('import') < f.calls.indexOf('publish'));
  assert(f.calls.indexOf('publish') < f.calls.indexOf('load'));
  assert.equal((await f.callbacks.getLocalState()).hostedModel.manifestCid, cid);
  assert.equal(f.runtime.listInferenceTargets()[0].available, true);
  assert.equal(f.runtime.listInferenceTargets()[0].task, 'image-text-to-text');
  assert.deepEqual(f.runtime.listInferenceTargets()[0].outputModalities, ['text']);
  assert.equal(f.published.has(cid), true);
  await f.runtime.dispose();
});

test('retained model acquisition uses local artifacts without redownloading', async () => {
  const f = fixture({ retained: true }); await f.controller.initialize();
  await f.runtime.acquireModel('hf:test');
  assert.equal(f.calls.includes('import'), false); assert.equal(f.calls.filter((x) => x === 'load').length, 1);
  await f.runtime.acquireModel('hf:test');
  assert.equal(f.calls.filter((x) => x === 'load').length, 1);
  await f.runtime.dispose();
});

test('diffusion capabilities survive import hosting discovery and local or remote generation', async () => {
  const diffusion = { runtime: 'onnx-diffusion', repository: 'test/diffusion', revision: 'b'.repeat(40),
    task: 'text-to-image', modalities: ['text'], outputModalities: ['image'] };
  const image = { width: 1, height: 1, channels: 4, data: new Uint8Array([255, 0, 0, 255]) };
  const inputs = [];
  const generate = (input) => { inputs.push(input); return { text: '', image, seed: input.seed, steps: input.steps }; };
  const f = fixture({ modelInfo: diffusion, hooks: { localGenerate: generate, remoteGenerate: generate } });
  await f.controller.initialize();
  assert.equal(f.runtime.listModelSources()[0].task, 'text-to-image');
  assert.deepEqual(f.runtime.listModelSources()[0].outputModalities, ['image']);
  await f.runtime.acquireModel('hf:test');
  const advertised = (await f.callbacks.getLocalState()).hostedModel;
  assert.equal(advertised.task, 'text-to-image'); assert.deepEqual(advertised.modalities, ['text']);
  assert.deepEqual(advertised.outputModalities, ['image']);
  f.peer.hosts = [{ ...advertised, hosts: [{ peerId: 'remote', local: false, busy: false }] }];
  f.peer.models = [{ ...advertised, providers: [{ peerId: 'remote', local: false }] }];
  const targets = f.runtime.listInferenceTargets();
  assert(targets.every((target) => target.task === 'text-to-image' && target.outputModalities.includes('image')));
  assert.equal(f.runtime.listModelSources()[1].task, 'text-to-image');
  for (const target of targets) {
    const output = await f.runtime.generate(target.key, { prompt: 'A lighthouse', seed: 42, steps: 1,
      width: 512, height: 512, task: 'text-generation' });
    assert.equal(output.image, image);
    const input = inputs.at(-1);
    assert.equal(input.task, 'text-to-image'); assert.equal(input.prompt, 'A lighthouse');
    assert.equal(input.seed, 42); assert.equal(input.steps, 1); assert.equal(input.width, 512);
    await assert.rejects(f.runtime.generate(target.key, { prompt: 'Do not attach', image }), /accepts text only/);
  }
  assert.equal(inputs.length, 2);
  await f.runtime.dispose();
});

test('peer sources acquire by hidden CID and automatically load; local-only providers are omitted', async () => {
  const f = fixture(); await f.controller.initialize();
  f.peer.models = [{ ...descriptor, providers: [{ peerId: 'remote', local: false }] },
    { ...descriptor, manifestCid: 'local-only', providers: [{ peerId: 'self', local: true }] }];
  assert.equal(f.runtime.listModelSources().length, 2);
  await f.runtime.acquireModel(`peer:${cid}`);
  assert(f.calls.indexOf('fetch-peer') < f.calls.indexOf('load')); assert(!f.calls.includes('import'));
  await f.runtime.dispose();
});

test('sharing and inference hosting toggles operate independently and persist across model load', async () => {
  const f = fixture(); await f.controller.initialize();
  await f.runtime.setSharing(false); await f.runtime.setHostInference(false);
  await f.runtime.acquireModel('hf:test');
  assert.equal(f.published.size, 0); assert.equal(f.peer.enabled, false);
  assert.equal((await f.callbacks.getLocalState()).hostedModel, null);
  assert.equal((await f.runtime.generate('local', { prompt: 'hello' })).text, 'Local answer');
  await f.runtime.setSharing(true); assert.equal(f.published.size, 1);
  await f.runtime.setHostInference(true); assert((await f.callbacks.getLocalState()).hostedModel);
  await f.runtime.setSharing(false); assert.equal(f.published.size, 0); assert.equal(f.peer.enabled, true);
  await f.runtime.dispose();
});

test('remote model choices aggregate busy status after excluding the local host', async () => {
  const f = fixture(); await f.controller.initialize();
  f.peer.hosts = [{ ...descriptor, hosts: [{ peerId: 'self', local: true, busy: false },
    { peerId: 'a', local: false, busy: true }, { peerId: 'b', local: false, busy: true }] }];
  let target = f.runtime.listInferenceTargets()[1]; assert.equal(target.busy, true); assert.equal(target.providerCount, 2);
  f.peer.hosts[0].hosts[2].busy = false;
  target = f.runtime.listInferenceTargets()[1]; assert.equal(target.busy, false);
  const image = { width: 1, height: 1, channels: 4, data: new Uint8Array([255, 0, 0, 255]) };
  assert.equal((await f.runtime.generate(target.key, { prompt: 'color?', image })).image, image);
  assert(!f.calls.includes('load')); assert(!f.calls.includes('local'));
  await f.runtime.dispose();
});

test('local cancellation reaches the managed service and advertises idle after completion', async () => {
  const f = fixture(); await f.controller.initialize(); await f.runtime.acquireModel('hf:test');
  const generation = f.runtime.generate('local', { requestId: 'active', prompt: 'wait' });
  const failure = assert.rejects(generation);
  assert.equal((await f.callbacks.getLocalState()).busy, true);
  await f.runtime.cancel('active'); await failure;
  assert(f.calls.includes('cancel-local')); assert.equal((await f.callbacks.getLocalState()).busy, false);
  await f.runtime.dispose();
});

test('failed network teardown retains owned model resources until an explicit retry succeeds', async () => {
  const f = fixture({ failRelease: true }); await f.controller.initialize(); await f.runtime.acquireModel('hf:test');
  await assert.rejects(f.runtime.dispose(), /Stop failed/);
  assert.equal(f.calls.includes('dispose'), false); assert.equal(f.released, false);
  await f.runtime.dispose(); assert.equal(f.released, true);
  assert(f.calls.lastIndexOf('release') < f.calls.indexOf('dispose'));
});

test('stored library lists actual local manifests and deletes a resident only after stopping its work', async () => {
  const f = fixture(); await f.controller.initialize(); await f.runtime.acquireModel('hf:test');
  assert.deepEqual(await f.runtime.listStoredModels(), [{ manifestCid: cid, name: manifest.name,
    totalBytes: 100, runtime: model.runtime, loaded: true, shared: true }]);
  const local = assert.rejects(f.runtime.generate('local', { requestId: 'local-delete', prompt: 'wait' }), /deleted/);
  const remote = assert.rejects(f.callbacks.generate({ manifestCid: cid, requestId: 'remote-delete', prompt: 'wait',
    signal: new AbortController().signal }), /deleted/);
  const result = await f.runtime.deleteStoredModel(cid);
  await Promise.all([local, remote]);
  assert.deepEqual(result, { deleted: true, freedBytes: 100, unloaded: true });
  assert(f.calls.indexOf('withdraw') < f.calls.lastIndexOf('unload'));
  assert(f.calls.lastIndexOf('unload') < f.calls.indexOf('remove'));
  assert.deepEqual(await f.runtime.listStoredModels(), []);
  assert.equal((await f.callbacks.getLocalState()).hostedModel, null);
  await f.runtime.dispose();
});

test('failed unload keeps storage intact and quarantines the model until deletion retry succeeds', async () => {
  let fail = true;
  const f = fixture({ hooks: { unload() { if (fail && f.calls.includes('withdraw')) throw new Error('GPU termination not acknowledged'); } } });
  await f.controller.initialize(); await f.runtime.acquireModel('hf:test');
  await assert.rejects(f.runtime.deleteStoredModel(cid), /not acknowledged/);
  assert(f.records.has(cid)); assert(!f.calls.includes('remove'));
  assert(!f.calls.includes('release-use'));
  assert.equal((await f.callbacks.getLocalState()).hostedModel, null);
  await assert.rejects(f.runtime.generate('local', { prompt: 'hello' }), /Import a model/);
  fail = false;
  assert.equal((await f.runtime.deleteStoredModel(cid)).deleted, true);
  await f.runtime.dispose();
});

test('delete waits for an in-flight import and prevents that package from being republished', async () => {
  let release;
  const wait = new Promise((resolve) => { release = resolve; });
  const f = fixture({ hooks: { import: () => wait } }); await f.controller.initialize();
  const importing = f.runtime.importCatalog('test');
  await Promise.resolve(); await Promise.resolve();
  const deleting = f.runtime.deleteStoredModel(cid);
  assert(!f.calls.includes('remove'));
  release(); await importing; await deleting;
  assert(!f.calls.includes('publish')); assert.deepEqual(await f.runtime.listStoredModels(), []);
  await f.runtime.dispose();
});

test('a sharing budget failure preserves local import and auto-load with accurate per-model warning', async () => {
  const f = fixture({ hooks: { publish() { throw new Error('Serving closure exceeds block limit'); } } });
  await f.controller.initialize();
  await f.runtime.acquireModel('hf:test');
  assert.equal(f.runtime.listInferenceTargets()[0].available, true);
  const [stored] = await f.runtime.listStoredModels();
  assert.equal(stored.loaded, true); assert.equal(stored.shared, false);
  assert.match(stored.shareError, /block limit/);
  assert.equal(f.runtime.getPreferences().sharing, true);
  await f.runtime.dispose();
});

test('deleting an unloaded model does not cancel or unload another resident', async () => {
  const f = fixture(); await f.controller.initialize(); await f.runtime.acquireModel('hf:test');
  const other = 'bafkreihffolxaess6g3df2lzjiac5cpokwfnfhddbzjf22xfmkvhmrjaja';
  f.records.set(other, { cid: other, manifest, kind: 'manifest', pinned: true, status: 'complete' });
  const unloads = f.calls.filter((call) => call === 'unload').length;
  assert.deepEqual(await f.runtime.deleteStoredModel(other), { deleted: true, freedBytes: 100, unloaded: false });
  assert.equal(f.calls.filter((call) => call === 'unload').length, unloads);
  assert.equal((await f.runtime.generate('local', { prompt: 'hello' })).text, 'Local answer');
  await f.runtime.dispose();
});

test('an aborted load caller cannot release a successful residency lease', async () => {
  const f = fixture({ retained: true }); await f.controller.initialize();
  const caller = new AbortController();
  await f.runtime.load(cid, { signal: caller.signal });
  caller.abort('Caller stopped waiting');
  assert(!f.calls.includes('release-use'));
  await f.runtime.unload();
  assert.equal(f.calls.filter((value) => value === 'release-use').length, 1);
  await f.runtime.dispose();
});

test('failed load cleanup holds the model use lease until acknowledged cleanup retry', async () => {
  const f = fixture({ retained: true, hooks: { load(setStatus) {
    setStatus({ status: 'cleanup-failed', manifestCid: cid }); throw new Error('Worker termination failed');
  } } });
  await f.controller.initialize();
  await assert.rejects(f.runtime.load(cid), /termination failed/);
  assert(!f.calls.includes('release-use'));
  await f.runtime.unload();
  assert.equal(f.calls.filter((value) => value === 'release-use').length, 1);
  await f.runtime.dispose();
});

test('interrupted deletion remains visible after controller restart and retry completes cleanup', async () => {
  const f = fixture({ retained: true });
  f.records.set(cid, { ...f.records.get(cid), status: 'deleting', pinned: false });
  await f.controller.initialize();
  const [stored] = await f.runtime.listStoredModels();
  assert.equal(stored.cleanupPending, true); assert.equal(stored.shared, false);
  assert.equal((await f.callbacks.getLocalState()).sharedModels.length, 0);
  await assert.rejects(f.runtime.load(cid), /being deleted/);
  assert.equal((await f.runtime.deleteStoredModel(cid)).deleted, true);
  assert.deepEqual(await f.runtime.listStoredModels(), []);
  await f.runtime.dispose();
});

test('library enumeration refreshes descriptors removed by a different context', async () => {
  const f = fixture({ retained: true }); await f.controller.initialize();
  assert.equal((await f.callbacks.getLocalState()).sharedModels.length, 1);
  f.records.delete(cid);
  assert.deepEqual(await f.runtime.listStoredModels(), []);
  await f.runtime.refreshPeers();
  assert.equal((await f.callbacks.getLocalState()).sharedModels.length, 0);
  assert.equal(f.published.size, 0);
  await f.runtime.dispose();
});

test('local library can exceed the bounded network model directory', async () => {
  const f = fixture();
  for (let index = 0; index < 130; index++) f.records.set(`fixture-${index}`, {
    cid: `fixture-${index}`, manifest, kind: 'manifest', status: 'complete', pinned: true,
  });
  await f.controller.initialize();
  assert.equal((await f.runtime.listStoredModels()).length, 130);
  assert.equal((await f.callbacks.getLocalState()).sharedModels.length, 128);
  await f.runtime.dispose();
});

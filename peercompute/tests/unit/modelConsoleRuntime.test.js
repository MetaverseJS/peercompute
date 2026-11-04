import test from 'node:test';
import assert from 'node:assert/strict';
import { attachModelRuntimeController } from '../../../demos/inference/src/modelRuntimeController.js';

const cid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const model = { runtime: 'transformers.js', repository: 'test/model', revision: 'a'.repeat(40), modalities: ['text', 'image'] };
const manifest = { name: 'Test vision model', model, files: [{ size: 100 }] };
const catalog = { test: { id: 'test', name: manifest.name, model, totalBytes: 100 } };
const descriptor = { manifestCid: cid, modelId: 'test', name: manifest.name, ...model, totalBytes: 100 };

function fixture({ retained = false, connected = true, failRelease = false } = {}) {
  const calls = [], records = new Map(), published = new Set();
  const record = { cid, manifest, kind: 'manifest', pinned: true, status: 'complete' };
  if (retained) records.set(cid, record);
  let status = { status: 'idle', manifestCid: null };
  let callbacks, released = false;
  const peer = {
    models: [], hosts: [], enabled: true,
    listModels() { return this.models; }, listHosts() { return this.hosts; },
    async refresh() { calls.push('refresh'); },
    async setHostingEnabled(value) { this.enabled = value; calls.push(`hosting:${value}`); },
    async generate(_cid, options) { calls.push('remote'); return { text: 'Remote answer', image: options.image }; },
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
      if (options.prompt === 'wait') return new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true }));
      return { text: 'Local answer', workerId: 'worker-1' };
    },
    async unloadModel() { calls.push('unload'); status = { status: 'idle' }; },
    async cancel() { calls.push('cancel-local'); },
  };
  const runtime = { service, networkManager: network,
    get networkReady() { return network.isConnected; },
    store: { async *list() { yield* records.values(); }, async getManifest() { return manifest; },
      async stat(key) { return records.get(key); } },
    async importCatalog() { calls.push('import'); records.set(cid, record); return record; },
    async importPackage() { records.set(cid, record); return record; },
    async load(key) { calls.push('load'); status = { status: 'ready', manifestCid: key }; return { workerId: 'worker-1' }; },
    async ensure() { calls.push('fetch-peer'); records.set(cid, record); return record; },
    async publish(key) { calls.push('publish'); published.add(key); },
    async withdraw(key) { calls.push('withdraw'); published.delete(key); },
    async connect() { network.isConnected = true; }, async connectBackend() { network.isConnected = true; },
    async dispose() { calls.push('dispose'); },
  };
  const controller = attachModelRuntimeController(runtime, { catalog });
  return { runtime, controller, calls, peer, published, get callbacks() { return callbacks; }, get released() { return released; } };
}

test('opening the console enables both preferences without fetching or loading weights', async () => {
  const f = fixture(); await f.controller.initialize();
  assert.deepEqual(f.runtime.getPreferences(), { sharing: true, hostInference: true });
  assert.equal(f.calls.includes('load'), false); assert.equal(f.calls.includes('import'), false);
  assert.equal((await f.callbacks.getLocalState()).hostedModel, null);
  assert.equal(f.runtime.listInferenceTargets()[0].available, false);
  await f.runtime.dispose();
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

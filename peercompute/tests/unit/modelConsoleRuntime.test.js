import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { attachModelRuntimeController } from '../../../demos/inference/src/modelRuntimeController.js';
import { GGUF_MODEL_CATALOG } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { evaluateModelCompatibility } from '../../../demos/inference/src/modelDeviceCompatibility.js';
import { createModelPreferences, DEFAULT_MODEL_ID } from '../../../demos/inference/src/modelPreferences.js';
import { SPEECH_MODEL_CATALOG } from '../../src/peercompute/inference/speech/speechCatalog.js';
import { PEER_INFERENCE_LIMITS } from '../../src/peercompute/networkManager/inference/protocol.js';
import { MODEL_POLICY } from '../../src/peercompute/inference/modelManifest.js';

const cid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const model = { runtime: 'transformers.js', repository: 'test/model', revision: 'a'.repeat(40), task: 'image-text-to-text', modalities: ['text', 'image'] };
const manifest = { name: 'Test vision model', model, files: [{ size: 100 }] };
const catalog = { test: { id: 'test', name: manifest.name, model, totalBytes: 100 } };
const descriptor = { manifestCid: cid, modelId: 'test', name: manifest.name, ...model, totalBytes: 100 };

function fixture({ retained = false, retainedRecords = [], catalogInfo, connected = true, failRelease = false, hooks = {}, modelInfo = model, now, preferences, multi = false } = {}) {
  const calls = [], records = new Map(), published = new Set();
  const localManifest = { ...manifest, model: modelInfo };
  const record = { cid, manifest: localManifest, kind: 'manifest', pinned: true, status: 'complete' };
  if (retained) records.set(cid, record);
  for (const entry of retainedRecords) records.set(entry.cid, entry);
  let status = { status: 'idle', manifestCid: null };
  let callbacks, released = false;
  const peer = {
    models: [], hosts: [], enabled: true,
    listModels() { return this.models; }, listHosts() { return this.hosts; },
    async refresh(options) { calls.push('refresh'); return await hooks.refresh?.(options, this) ?? { errors: [] }; },
    async setHostingEnabled(value) { this.enabled = value; calls.push(`hosting:${value}`); },
    async generate(_cid, options) { calls.push('remote'); return hooks.remoteGenerate?.(options, _cid) ?? { text: 'Remote answer', image: options.image }; },
    async cancel() { calls.push('cancel-remote'); },
  };
  const network = { isConnected: connected,
    getPublishedArtifactCids: () => [...published],
    async createPeerInferenceService(options) { callbacks = options; peer.closed = false; calls.push('attach'); await hooks.attach?.(); return peer; },
    async releasePeerInferenceService(owner) {
      if (!callbacks) return false;
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
    ...(hooks.artifactReady ? { get artifactReady() { return hooks.artifactReady(); } } : {}),
    store: { async *list() { await hooks.list?.(); yield* records.values(); }, async getManifest(key, options) {
      await hooks.manifest?.(key, options); return records.get(key)?.manifest ?? localManifest;
    },
      async acquireUse() { calls.push('use'); return async () => { calls.push('release-use'); }; },
      async stat(key) { return records.get(key); },
      async ensureLocal(key, options) {
        calls.push('verify-local');
        assert.equal(options.fetchBlock, undefined, 'Recovery cannot fetch missing blocks');
        await hooks.recover?.(key, options);
        options.signal?.throwIfAborted();
        const record = { ...records.get(key), status: 'complete' }; records.set(key, record); return record;
      },
      async remove(key) { calls.push('remove'); await hooks.remove?.(key, records); const removed = records.delete(key); return { removed, freedBytes: removed ? 100 : 0 }; } },
    async importCatalog(id) { calls.push('import'); const imported = await hooks.import?.(id) ?? record; records.set(imported.cid, imported); return imported; },
    async importPackage() { records.set(cid, record); return record; },
    async importHub(entry, options) { calls.push('import-hub'); const imported = await hooks.importHub(entry, options); records.set(imported.cid, imported); return imported; },
    async load(key) { calls.push('load'); status = { status: 'ready', manifestCid: key };
      await hooks.load?.((value) => { status = value; }); return { workerId: 'worker-1' }; },
    async ensure() { calls.push('fetch-peer'); records.set(cid, record); return record; },
    async publish(key) { calls.push('publish'); await hooks.publish?.(); published.add(key); },
    async withdraw(key) { calls.push('withdraw'); published.delete(key); },
    async connect() { network.isConnected = true; }, async connectBackend() { network.isConnected = true; },
    async dispose() { calls.push('dispose'); },
  };
  if (multi) {
    const pool = new Map(); let selected = service;
    Object.defineProperty(runtime, 'service', { get: () => selected });
    Object.defineProperty(runtime, 'services', { get: () => Object.fromEntries(pool) });
    runtime.getServiceForModel = (key) => pool.get(key) ?? null;
    runtime.getResidentModelStates = () => [...pool.values()].map((candidate) => candidate.getStatus());
    runtime.load = async (key) => {
      calls.push(`load:${key}`);
      let local = { status: 'ready', manifestCid: key, sessionId: `session-${key}` };
      const candidate = {
        getStatus: () => local,
        async generate(options) {
          calls.push(`local:${key}`);
          return hooks.localGenerate?.(options, key) ?? { text: key, workerId: `worker-${key}` };
        },
        async unloadModel() { calls.push(`unload:${key}`); await hooks.unload?.(key); local = { status: 'idle' }; },
        async cancel() { calls.push(`cancel-local:${key}`); },
      };
      pool.set(key, candidate);
      await hooks.load?.((value) => { local = value; });
      if (records.get(key)?.manifest.model.runtime !== 'transformers-speech' || selected.getStatus().status !== 'ready') selected = candidate;
      return { workerId: `worker-${key}` };
    };
    runtime.unloadResidentModel = async (key) => {
      for (const [cid, candidate] of [...pool]) if (key === undefined || key === cid) {
        await candidate.unloadModel(); pool.delete(cid);
      }
      if (selected.getStatus().status !== 'ready') selected = [...pool.values()][0] ?? service;
    };
    runtime.dispose = async () => { await runtime.unloadResidentModel(); calls.push('dispose'); };
  }
  const controller = attachModelRuntimeController(runtime, { catalog: catalogInfo ?? { test: { ...catalog.test, model: modelInfo } },
    ...(now ? { now } : {}), ...(preferences ? { preferences } : {}) });
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

test('pooled loads are additive and expose separate same-runtime local targets and peer hosts', async () => {
  const other = { cid: secondCid, kind: 'manifest', status: 'complete', pinned: true,
    manifest: { ...manifest, name: 'Second model', model: { ...model, repository: 'test/second' } } };
  const f = fixture({ multi: true, retained: true, retainedRecords: [other] });
  await f.controller.initialize();
  await f.runtime.loadStoredModel(cid); const first = f.runtime.getServiceForModel(cid);
  await f.runtime.loadStoredModel(secondCid);
  assert.equal(first.getStatus().status, 'ready');
  assert.equal(f.runtime.listResidentModels().length, 2);
  assert.deepEqual(f.runtime.listInferenceTargets().map((entry) => entry.key).sort(), [`local:${cid}`, `local:${secondCid}`].sort());
  assert.equal((await f.callbacks.getLocalState()).hostedModels.length, 2);
  const routed = await f.runtime.generate(`local:${cid}`, { prompt: 'Explain rain.' });
  assert.equal(routed.text, cid); assert.equal(routed.route.manifestCid, cid);
  await f.runtime.unload(secondCid);
  assert.equal(first.getStatus().status, 'ready'); assert.equal(f.runtime.listResidentModels().length, 1);
  await f.runtime.dispose();
});

test('mixed routes to a busy local queue before peers, while local-only never refreshes or dispatches peers', async () => {
  const f = fixture({ multi: true, retained: true }); await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  f.peer.hosts = [{ ...descriptor, hosts: [{ peerId: 'remote', local: false, busy: false }] }];
  const service = f.runtime.getServiceForModel(cid), status = service.getStatus();
  status.activeRequestId = 'other'; status.queuedRequests = 1;
  const local = await f.runtime.generate('mixed', { prompt: 'Explain rain.' });
  assert.equal(local.route.local, true);
  status.queuedRequests = 4;
  const peer = await f.runtime.generate('mixed', { prompt: 'Explain rain.' });
  assert.equal(peer.route.local, false);
  const before = f.calls.filter((call) => call === 'refresh' || call === 'remote').length;
  await assert.rejects(f.runtime.generate('local-only', { prompt: 'Explain rain.' }), /No compatible local/);
  assert.equal(f.calls.filter((call) => call === 'refresh' || call === 'remote').length, before);
  status.activeRequestId = null; status.queuedRequests = 0;
  await f.runtime.dispose();
});

test('native media operations survive local and peer routing without becoming the primary text task', async () => {
  const requests = [], native = { ...model, runtime: 'llama.cpp', task: 'text-generation', modalities: ['text', 'image', 'audio'] };
  const f = fixture({ retained: true, modelInfo: native, hooks: {
    localGenerate(input) { requests.push({ local: true, input }); return { text: 'Local recording understood.' }; },
    remoteGenerate(input) { requests.push({ local: false, input }); return { text: 'Peer recording understood.' }; },
  } });
  try {
    await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
    const audio = { samples: new Float32Array(1600).fill(0.25), sampleRate: 16000 };
    const image = { width: 1, height: 1, channels: 4, data: new Uint8Array([1, 2, 3, 255]) };
    await f.runtime.generate('mixed', { prompt: 'What is said?', audio });
    assert.equal(requests[0].input.task, 'audio-text-to-text'); assert.equal(requests[0].input.audio.samples[0], 0.25);
    f.peer.hosts = [{ ...descriptor, ...native, hosts: [{ peerId: 'native', busy: false, ...native }] }];
    await f.runtime.generate(`peer:${cid}`, { task: 'audio-text-to-text', prompt: 'Compare these.', image, audio });
    assert.equal(requests[1].local, false); assert.equal(requests[1].input.task, 'audio-text-to-text');
    assert.equal(requests[1].input.image.data[0], 1); assert.equal(requests[1].input.audio.samples.length, 1600);
    await f.runtime.generate(`peer:${cid}`, { task: 'image-text-to-text', prompt: 'Describe this.', image });
    assert.equal(requests[2].input.task, 'image-text-to-text');
    f.peer.hosts[0].hosts[0].modalities = ['text', 'audio'];
    await assert.rejects(f.runtime.generate(`peer:${cid}`, { task: 'audio-text-to-text', prompt: 'Compare.', audio, image }), /No compatible/);
    assert.equal(requests.length, 3, 'a group-level claim cannot send images to an audio-only host');
  } finally { await f.runtime.dispose(); }
});

test('automatic peer routing excludes models whose every advertised host queue is full', async () => {
  const f = fixture({ multi: true }); await f.controller.initialize();
  f.peer.hosts = [
    { ...descriptor, hosts: [{ peerId: 'full', local: false, busy: true, queuedRequests: 4, queueCapacity: 4, queueAvailable: false }] },
    { ...descriptor, manifestCid: secondCid, name: 'Ready remote', hosts: [{ peerId: 'ready', local: false, busy: false, queuedRequests: 0, queueCapacity: 4 }] },
  ];
  const targets = f.runtime.listInferenceTargets();
  assert.equal(targets.find((entry) => entry.manifestCid === cid).queueAvailable, false);
  const result = await f.runtime.generate('mixed', { prompt: 'Explain rain.' });
  assert.equal(result.route.manifestCid, secondCid); assert.equal(result.route.local, false);
  await f.runtime.dispose();
});

test('an expired explicit peer selection refreshes once and dispatches only that same model CID', async () => {
  let at = 0, receivedAt = 0, dispatched;
  const selected = { ...descriptor, hosts: [{ peerId: 'selected-host', local: false, busy: false }] };
  const another = { ...descriptor, manifestCid: secondCid, hosts: [{ peerId: 'other-host', local: false, busy: false }] };
  const f = fixture({ now: () => at, hooks: {
    refresh(_options, peer) { receivedAt = at; peer.hosts = [another, selected]; },
    remoteGenerate(_options, key) { dispatched = key; return { text: 'Exact selected model' }; },
  } });
  await f.controller.initialize();
  f.peer.hosts = [selected];
  f.peer.listHosts = () => at - receivedAt > 15000 ? [] : f.peer.hosts;
  const key = f.runtime.listInferenceTargets().find((entry) => !entry.local).key;
  at = 16000;
  const result = await f.runtime.generate(key, { prompt: 'Describe leaves.' });
  assert.equal(dispatched, cid); assert.equal(result.route.manifestCid, cid);
  assert.equal(f.calls.filter((call) => call === 'refresh').length, 1);
  assert.equal(f.calls.filter((call) => call === 'remote').length, 1);
  await f.runtime.generate(key, { prompt: 'Describe rain.' });
  assert.equal(f.calls.filter((call) => call === 'refresh').length, 1, 'fresh exact selection needs no controller refresh');
  await f.runtime.dispose();
});

test('a missing explicit peer remains unavailable after one refresh even when another model is available', async () => {
  const f = fixture({ hooks: { refresh(_options, peer) {
    peer.hosts = [{ ...descriptor, manifestCid: secondCid, hosts: [{ peerId: 'other', local: false, busy: false }] }];
  } } });
  await f.controller.initialize();
  await assert.rejects(f.runtime.generate(`peer:${cid}`, { prompt: 'Describe leaves.' }), /selected model is no longer available/);
  assert.equal(f.calls.filter((call) => call === 'refresh').length, 1);
  assert(!f.calls.includes('remote')); assert(!f.calls.includes('local'));
  await f.runtime.dispose();
});

test('a selected peer with a full cached queue refreshes capacity once without switching models', async () => {
  for (const remainsFull of [false, true]) {
    const selected = { ...descriptor, hosts: [{ peerId: 'selected', local: false, busy: true,
      queuedRequests: 4, queueCapacity: 4, queueAvailable: false }] };
    const f = fixture({ hooks: { refresh(_options, peer) {
      if (!remainsFull) selected.hosts[0] = { peerId: 'selected', local: false, busy: false };
      peer.hosts = [{ ...descriptor, manifestCid: secondCid,
        hosts: [{ peerId: 'another', local: false, busy: false }] }, selected];
    } } });
    await f.controller.initialize(); f.peer.hosts = [selected];
    const request = f.runtime.generate(`peer:${cid}`, { prompt: 'Describe leaves.' });
    if (remainsFull) {
      await assert.rejects(request, { code: 'ERR_INFERENCE_NO_MODEL' });
      assert(!f.calls.includes('remote'));
    } else assert.equal((await request).route.manifestCid, cid);
    assert.equal(f.calls.filter((call) => call === 'refresh').length, 1);
    await f.runtime.dispose();
  }
});

test('fresh eligible mixed peer targets avoid an unrelated directory refresh; full queues refresh once', async () => {
  const selected = { ...descriptor, hosts: [{ peerId: 'selected', local: false, busy: true,
    queuedRequests: 1, queueCapacity: 4 }] };
  const f = fixture({ hooks: { refresh(_options, peer) {
    peer.hosts = [{ ...descriptor, hosts: [{ peerId: 'selected', local: false, busy: false }] }];
  } } });
  await f.controller.initialize(); f.peer.hosts = [selected];
  const cached = await f.runtime.generate('mixed', { prompt: 'Describe leaves.' });
  assert.equal(cached.route.manifestCid, cid); assert(!f.calls.includes('refresh'));
  selected.hosts[0].queuedRequests = 4;
  const refreshed = await f.runtime.generate('mixed', { prompt: 'Describe rain.' });
  assert.equal(refreshed.route.manifestCid, cid);
  assert.equal(f.calls.filter((call) => call === 'refresh').length, 1);
  await f.runtime.dispose();
});

test('local targets never refresh peers and an already aborted peer selection does not start discovery', async () => {
  const f = fixture({ multi: true, retained: true });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  for (const key of ['local', `local:${cid}`, 'local-only', 'mixed']) {
    assert.equal((await f.runtime.generate(key, { prompt: 'Describe leaves.' })).route.local, true);
  }
  await assert.rejects(f.runtime.generate(`local:${secondCid}`, { prompt: 'Missing local model.' }), /selected model is no longer available/);
  const signal = AbortSignal.abort(new DOMException('Caller cancelled', 'AbortError'));
  await assert.rejects(f.runtime.generate(`peer:${secondCid}`, { prompt: 'Do not send.', signal }), { name: 'AbortError' });
  assert(!f.calls.includes('refresh')); assert(!f.calls.includes('remote'));
  await f.runtime.dispose();
});

test('cancelling an explicit peer refresh does not dispatch a late discovered target or cancel an unrelated shared poll', async () => {
  let release, started;
  const blocked = new Promise((resolve) => { release = resolve; });
  const entered = new Promise((resolve) => { started = resolve; });
  const f = fixture({ hooks: { async refresh(options, peer) {
    started(options.signal); await blocked;
    peer.hosts = [{ ...descriptor, hosts: [{ peerId: 'selected', local: false, busy: false }] }];
  } } });
  await f.controller.initialize();
  const poll = f.runtime.refreshPeers();
  const pollSignal = await entered;
  const controller = new AbortController();
  const generation = f.runtime.generate(`peer:${cid}`, { prompt: 'Do not send late.', signal: controller.signal });
  const rejected = assert.rejects(generation, { name: 'AbortError' });
  controller.abort(new DOMException('Caller cancelled', 'AbortError'));
  await rejected;
  assert.equal(pollSignal.aborted, false); assert(!f.calls.includes('remote'));
  release(); await poll;
  assert(!f.calls.includes('remote')); assert.equal(f.calls.filter((call) => call === 'refresh').length, 1);
  await f.runtime.dispose();
});

test('an explicit peer refresh has one directory deadline while underlying shared work remains tracked for shutdown', async (t) => {
  let release, started;
  const blocked = new Promise((resolve) => { release = resolve; });
  const entered = new Promise((resolve) => { started = resolve; });
  const f = fixture({ hooks: { async refresh() { started(); await blocked; } } });
  await f.controller.initialize();
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const request = f.runtime.generate(`peer:${cid}`, { prompt: 'Describe leaves.' });
  const rejected = assert.rejects(request, /selected model is no longer available/);
  try {
    await entered;
    t.mock.timers.tick(PEER_INFERENCE_LIMITS.queryTimeoutMs * 2 + 100);
    await rejected;
    assert.equal(f.calls.filter((call) => call === 'refresh').length, 1);
    assert(!f.calls.includes('remote'));
    let closed = false;
    const closing = f.runtime.dispose().then(() => { closed = true; });
    await nextTurn(); assert.equal(closed, false);
    release(); await closing;
  } finally { t.mock.timers.reset(); release(); await rejected; await f.runtime.dispose(); }
});

test('cancellation from a routing callback prevents the selected peer request from being dispatched', async () => {
  const f = fixture(); await f.controller.initialize();
  f.peer.hosts = [{ ...descriptor, hosts: [{ peerId: 'selected', local: false, busy: false }] }];
  const controller = new AbortController();
  await assert.rejects(f.runtime.generate(`peer:${cid}`, { prompt: 'Do not send.', signal: controller.signal,
    onProgress() { controller.abort(new DOMException('Caller cancelled', 'AbortError')); } }), { name: 'AbortError' });
  assert(!f.calls.includes('remote')); assert(!f.calls.includes('refresh'));
  await f.runtime.dispose();
});

test('requests admitted during shared peer discovery retain their own messages, pixels, settings and callbacks', async () => {
  let release, started;
  const blocked = new Promise((resolve) => { release = resolve; });
  const entered = new Promise((resolve) => { started = resolve; });
  const dispatched = [], progress = [], tokens = [];
  const f = fixture({ hooks: {
    async refresh(_options, peer) {
      started(); await blocked;
      peer.hosts = [{ ...descriptor, hosts: [{ peerId: 'selected', local: false, busy: false }] }];
    },
    remoteGenerate(input) {
      dispatched.push(input);
      input.onToken(input.messages.at(-1).content);
      return { text: input.messages.at(-1).content, requestId: input.requestId };
    },
  } });
  await f.controller.initialize();
  const options = { requestId: 'request-A', sessionId: 'session-A',
    messages: [{ role: 'system', content: 'Use the newest question.' }, { role: 'user', content: 'Question A' }],
    image: { width: 1, height: 1, channels: 4, data: new Uint8Array([11, 22, 33, 255]) },
    maxNewTokens: 128, task: 'image-text-to-text',
    onProgress: (event) => progress.push(`A:${event.requestId}`), onToken: (text) => tokens.push(`A:${text}`) };
  let first, second;
  try {
    first = f.runtime.generate(`peer:${cid}`, options);
    await entered;
    options.requestId = 'request-B'; options.sessionId = 'session-B';
    options.messages[1].content = 'Question B'; options.image.data[0] = 44; options.maxNewTokens = 256;
    options.onProgress = (event) => progress.push(`B:${event.requestId}`);
    options.onToken = (text) => tokens.push(`B:${text}`);
    second = f.runtime.generate(`peer:${cid}`, options);
    options.messages.push({ role: 'user', content: 'Never submitted' });
    options.messages[0].content = 'Never submitted system'; options.image.data.fill(0); options.maxNewTokens = 512;
    options.image.width = 99; options.task = 'text-generation';
    release();
    const replies = await Promise.all([first, second]);
    assert.deepEqual(replies.map(({ requestId, text }) => ({ requestId, text })), [
      { requestId: 'request-A', text: 'Question A' }, { requestId: 'request-B', text: 'Question B' },
    ]);
    assert.equal(f.calls.filter((call) => call === 'refresh').length, 1);
    for (const [index, input] of dispatched.entries()) {
      assert.equal(input.sessionId, `session-${index ? 'B' : 'A'}`);
      assert.equal(input.task, 'image-text-to-text'); assert.equal(input.maxNewTokens, index ? 256 : 128);
      assert.deepEqual(input.messages, [{ role: 'system', content: 'Use the newest question.' },
        { role: 'user', content: index ? 'Question B' : 'Question A' }]);
      assert.deepEqual(input.image, { width: 1, height: 1, channels: 4,
        data: new Uint8Array([index ? 44 : 11, 22, 33, 255]) });
      assert.notEqual(input.messages, options.messages); assert.notEqual(input.image.data.buffer, options.image.data.buffer);
    }
    assert.deepEqual(progress.sort(), ['A:request-A', 'B:request-B']);
    assert.deepEqual(tokens.sort(), ['A:Question A', 'B:Question B']);
  } finally { release(); await Promise.allSettled([first, second]); await f.runtime.dispose(); }
});

test('ready local and peer requests snapshot before calling routing observers while retaining live cancellation', async (t) => {
  for (const local of [true, false]) await t.test(local ? 'local' : 'peer', async () => {
    let dispatched;
    const observations = [], observersThis = [], tokens = [], controller = new AbortController();
    const generate = (input) => {
      dispatched = input;
      input.onProgress({ type: 'accepted', requestId: input.requestId }); input.onToken('Original token');
      return { text: input.messages[0].content };
    };
    const f = fixture({ hooks: { localGenerate: generate, remoteGenerate: generate } });
    await f.controller.initialize();
    if (local) await f.runtime.acquireModel('hf:test');
    else f.peer.hosts = [{ ...descriptor, hosts: [{ peerId: 'selected', local: false, busy: false }] }];
    const options = { messages: [{ role: 'user', content: 'Original question' }], prompt: 'Original fallback',
      image: { width: 1, height: 1, channels: 4, data: new Uint8ClampedArray([1, 2, 3, 255]) },
      maxNewTokens: 100, signal: controller.signal, onToken: (text) => tokens.push(text),
      onProgress(event) {
        observersThis.push(this);
        observations.push(event.type);
        if (event.type !== 'routing') return;
        // The private snapshot must not leak through a method-call receiver.
        if (this?.messages) this.messages[0].content = 'Changed via callback receiver';
        options.messages[0].content = 'Changed in routing callback'; options.prompt = 'Changed fallback';
        options.image.data.fill(0); options.maxNewTokens = 800;
        options.signal = AbortSignal.abort('Different signal');
        options.onProgress = () => assert.fail('Replaced progress callback');
        options.onToken = () => assert.fail('Replaced token callback');
      } };
    try {
      assert.equal((await f.runtime.generate(local ? 'local' : `peer:${cid}`, options)).text, 'Original question');
      assert.equal(dispatched.prompt, 'Original fallback'); assert.equal(dispatched.maxNewTokens, 100);
      assert.deepEqual(dispatched.image.data, new Uint8Array([1, 2, 3, 255]));
      assert.deepEqual(observations, ['routing', 'accepted']); assert.deepEqual(tokens, ['Original token']);
      assert.deepEqual(observersThis, [undefined, undefined]);
      assert.equal(dispatched.signal.aborted, false);
      controller.abort('Original signal still controls the request');
      assert.equal(dispatched.signal.aborted, true);
      assert.equal(dispatched.signal.reason, controller.signal.reason);
      assert(!f.calls.includes('refresh'));
    } finally { await f.runtime.dispose(); }
  });
});

test('discovery admission preserves ASR PCM and prompt-only TTS, diffusion and GGUF task forms', async (t) => {
  const cases = [
    { name: 'ASR', model: SPEECH_MODEL_CATALOG['moonshine-tiny-fp32'].model,
      input: () => ({ task: null, audio: { sampleRate: 16000, samples: new Float32Array(1600).fill(0.25) } }),
      mutate(input) { input.audio.samples.fill(-0.5); input.audio.sampleRate = 8000; },
      check(input) { assert.equal(input.audio.sampleRate, 16000); assert(input.audio.samples.every((value) => value === 0.25));
        assert.equal(input.prompt, undefined); assert.equal(input.messages, undefined); } },
    { name: 'TTS', model: SPEECH_MODEL_CATALOG['supertonic-fp32'].model,
      input: () => ({ prompt: 'The original spoken sentence.' }),
      mutate(input) { input.prompt = 'Different sentence'; input.messages = [{ role: 'user', content: 'Do not add messages to TTS' }]; },
      check(input) { assert.equal(input.prompt, 'The original spoken sentence.'); assert.equal(input.messages, undefined); } },
    { name: 'diffusion', model: { ...model, runtime: 'onnx-diffusion', task: 'text-to-image', modalities: ['text'], outputModalities: ['image'] },
      input: () => ({ prompt: 'A lighthouse', seed: 42, steps: 1, width: 512, height: 512 }),
      mutate(input) { input.prompt = 'A forest'; input.seed = 99; input.steps = 4; input.width = 256; input.height = 256; },
      check(input) { assert.equal(input.prompt, 'A lighthouse'); assert.equal(input.messages, undefined);
        assert.deepEqual([input.seed, input.steps, input.width, input.height], [42, 1, 512, 512]); } },
    { name: 'GGUF', model: { ...model, runtime: 'llama.cpp', task: 'text-generation', modalities: ['text'] },
      input: () => ({ prompt: 'Newest question', maxNewTokens: 120 }),
      mutate(input) { input.prompt = 'Old question'; input.maxNewTokens = 700; },
      check(input) { assert.equal(input.prompt, 'Newest question'); assert.equal(input.maxNewTokens, 120); } },
  ];
  for (const scenario of cases) await t.test(scenario.name, async () => {
    let release, started, dispatched;
    const blocked = new Promise((resolve) => { release = resolve; });
    const entered = new Promise((resolve) => { started = resolve; });
    const f = fixture({ hooks: { async refresh(_options, peer) {
      started(); await blocked;
      peer.hosts = [{ ...descriptor, ...scenario.model, hosts: [{ peerId: 'selected', local: false, busy: false }] }];
    }, remoteGenerate(input) { dispatched = input; return { text: 'Fixture result' }; } } });
    await f.controller.initialize();
    const options = scenario.input(); let request;
    try {
      // No explicit task: selecting this model must still infer its task after discovery.
      request = f.runtime.generate(`peer:${cid}`, options);
      await entered; scenario.mutate(options); release(); await request;
      assert.equal(dispatched.task, scenario.model.task); scenario.check(dispatched);
      if (options.audio) assert.notEqual(dispatched.audio.samples.buffer, options.audio.samples.buffer);
    } finally { release(); await Promise.allSettled([request]); await f.runtime.dispose(); }
  });
});

test('oversized text, invalid pixels and invalid PCM are rejected before peer discovery or generation', async () => {
  const f = fixture(); await f.controller.initialize();
  const cases = [
    { prompt: 'x'.repeat(MODEL_POLICY.maxPromptBytes + 1) },
    { messages: [{ role: 'user', content: 'x'.repeat(MODEL_POLICY.maxPromptBytes + 1) }] },
    { messages: Array.from({ length: MODEL_POLICY.maxMessages + 1 }, () => ({ role: 'user', content: 'x' })) },
    { prompt: 'Describe this', image: { width: 1025, height: 1024, channels: 4, data: new Uint8Array(4) } },
    { audio: { sampleRate: 16000, samples: new Float32Array(16000 * 20 + 1) } },
    { audio: { sampleRate: 16000, samples: new Float32Array(1600).fill(NaN) } },
  ];
  try {
    for (const options of cases) await assert.rejects(f.runtime.generate(`peer:${cid}`, options),
      /byte budget|Invalid inference messages|bounded RGBA|Speech input|Invalid PCM/);
    assert(!f.calls.includes('refresh')); assert(!f.calls.includes('remote')); assert(!f.calls.includes('local'));
  } finally { await f.runtime.dispose(); }
});

test('pooled cancellation and deletion address the original service after another model is selected', async () => {
  const other = { cid: secondCid, kind: 'manifest', status: 'complete', pinned: true,
    manifest: { ...manifest, model: { ...model, repository: 'test/second' } } };
  const f = fixture({ multi: true, retained: true, retainedRecords: [other], hooks: {
    localGenerate: (options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true })),
  } });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  const running = f.runtime.generate(`local:${cid}`, { requestId: 'stable-target', prompt: 'Wait.' });
  const rejected = assert.rejects(running);
  await nextTurn(); await f.runtime.loadStoredModel(secondCid); await f.runtime.cancel('stable-target'); await rejected;
  assert(f.calls.includes(`cancel-local:${cid}`)); assert(!f.calls.includes(`cancel-local:${secondCid}`));
  f.calls.length = 0;
  await f.runtime.deleteStoredModel(cid);
  assert.equal(f.runtime.getServiceForModel(secondCid).getStatus().status, 'ready');
  assert(!f.calls.includes('hosting:false'), 'deletion does not disable unrelated hosts');
  assert.equal((await f.callbacks.getLocalState()).hostedModels[0].manifestCid, secondCid);
  await f.runtime.dispose();
});

test('pooled speech loading preserves the chat selection and durable startup preference', async () => {
  const entry = SPEECH_MODEL_CATALOG['moonshine-tiny-fp32'];
  const speech = customStoredRecord({ manifest: { name: entry.name, model: entry.model, files: entry.files } });
  const preferences = preferenceStore();
  const f = fixture({ multi: true, retained: true, retainedRecords: [speech], preferences: preferences() });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  await f.runtime.loadStoredModel(speech.cid);
  assert.equal(f.runtime.service.getStatus().manifestCid, cid);
  assert.equal(preferences().readLastLoaded().manifestCid, cid);
  assert.equal(f.runtime.listResidentModels().length, 2);
  assert.equal((await f.runtime.listStoredModels()).find((row) => row.manifestCid === speech.cid).loadMode, undefined);
  await f.runtime.dispose();
});

test('pooled late load cancellation cleans its new resident without touching a previously ready model', async () => {
  let block = false, entered, release;
  const started = new Promise((resolve) => { entered = resolve; });
  const held = new Promise((resolve) => { release = resolve; });
  const other = customStoredRecord();
  const f = fixture({ multi: true, retained: true, retainedRecords: [other], hooks: {
    manifest: async (key) => { if (block && key === secondCid) { entered(); await held; } },
    load: () => { if (block) return; },
  } });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  // Pause the post-load manifest/remember phase, after the second worker is ready.
  const original = f.runtime.store.getManifest.bind(f.runtime.store); let reads = 0;
  f.runtime.store.getManifest = (key, options) => {
    if (key === secondCid && ++reads === 2) block = true;
    return original(key, options);
  };
  const controller = new AbortController();
  const loading = f.runtime.loadStoredModel(secondCid, { signal: controller.signal });
  const rejected = assert.rejects(loading, { name: 'AbortError' });
  await started;
  assert(!f.runtime.listInferenceTargets().some((entry) => entry.manifestCid === secondCid), 'uncommitted ready worker is not routed');
  controller.abort(); await rejected; release(); await nextTurn();
  assert.equal(f.runtime.getServiceForModel(secondCid), null);
  assert.equal(f.runtime.getServiceForModel(cid).getStatus().status, 'ready');
  assert.equal(f.records.get(secondCid).status, 'complete');
  await f.runtime.dispose();
});

test('guarded unload checks service identity inside the queue and preserves a user replacement of the same CID', async () => {
  let entered, release, blocked = true;
  const started = new Promise((resolve) => { entered = resolve; });
  const held = new Promise((resolve) => { release = resolve; });
  const f = fixture({ multi: true, retained: true, hooks: {
    async unload() { if (blocked) { entered(); await held; } },
  } });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  const oldService = f.runtime.getServiceForModel(cid), oldSession = oldService.getStatus().sessionId;
  const firstUnload = f.runtime.unload(cid); await started;
  const replacement = f.runtime.loadStoredModel(cid);
  const staleCleanup = f.runtime.unload(cid, { expectedService: oldService, expectedSessionId: oldSession });
  blocked = false; release(); await firstUnload; await replacement;
  const result = await staleCleanup;
  assert.equal(result.status, 'replaced');
  assert.notEqual(f.runtime.getServiceForModel(cid), oldService);
  assert.equal(f.runtime.getServiceForModel(cid).getStatus().status, 'ready');
  await f.runtime.dispose();
});

test('directory polling stays fresh across multiple TTLs while one background publication is stalled', async () => {
  let at = 0, receivedAt = -Infinity, scans = 0, release, started;
  const blocked = new Promise((resolve) => { release = resolve; });
  const publishing = new Promise((resolve) => { started = resolve; });
  const remoteModel = { ...descriptor, providers: [{ peerId: 'remote', local: false }] };
  const remoteHost = { ...descriptor, hosts: [{ peerId: 'remote', local: false, busy: false }] };
  const f = fixture({ retained: true, connected: false, now: () => at, hooks: {
    list() { scans++; }, publish() { started(); return blocked; },
    refresh(_options, peer) { receivedAt = at; peer.models = [remoteModel]; peer.hosts = [remoteHost]; return { errors: [] }; },
  } });
  f.peer.listModels = () => at - receivedAt > 15000 ? [] : f.peer.models;
  f.peer.listHosts = () => at - receivedAt > 15000 ? [] : f.peer.hosts;
  f.runtime.networkManager.peers = new Map([['remote', {}]]);
  await f.controller.initialize();
  let connected = false, disposed = false;
  const connecting = f.runtime.connectBackend().then(() => { connected = true; });
  try {
    await publishing; await nextTurn();
    assert.equal(connected, true, 'application connection must not wait for file publication');
    for (let index = 1; index <= 4; index++) {
      at = index * 20000;
      const result = await f.runtime.refreshPeers();
      assert.equal(result.discovery.checkedAt, at);
      assert.equal(result.discovery.connected, true); assert.equal(result.discovery.peerCount, 1);
      assert.equal(result.discovery.sharedModelCount, 1); assert.equal(result.discovery.hostedModelCount, 1);
      assert.equal(result.models.filter((entry) => entry.source === 'peers').length, 1);
      assert.equal(result.targets.filter((entry) => !entry.local).length, 1);
    }
    assert.equal(f.calls.filter((call) => call === 'refresh').length, 4);
    assert.equal(f.calls.filter((call) => call === 'publish').length, 1);
    assert.equal(scans, 2, 'periodic queries must not queue or run more sharing scans while one is pending');
    release(); await nextTurn();
    assert.equal(scans, 2, 'coalesced calls must not leave queued publication passes');
    await f.runtime.dispose(); disposed = true;
  } finally { release(); await connecting; if (!disposed) await f.runtime.dispose(); }
});

test('opening with retained files does not await publication and disposal still tracks it', async () => {
  let release, started;
  const blocked = new Promise((resolve) => { release = resolve; });
  const publishing = new Promise((resolve) => { started = resolve; });
  const f = fixture({ retained: true, hooks: { publish() { started(); return blocked; } } });
  let ready = false;
  const initializing = f.controller.initialize().then(() => { ready = true; });
  try {
    await publishing; await nextTurn(); assert.equal(ready, true);
    let disposed = false;
    const closing = f.runtime.dispose().then(() => { disposed = true; });
    await nextTurn(); assert.equal(disposed, false); assert.equal(f.calls.includes('dispose'), false);
    release(); await closing; assert.equal(disposed, true);
  } finally { release(); await initializing; await f.runtime.dispose(); }
});

test('discovery retains bounded errors and counts unique application peers separately from model groups', async () => {
  let at = 100;
  const errors = [{ peerId: 'peer-b', code: 'ERR_UNSUPPORTED_PROTOCOL', message: 'Peer does not host this protocol' },
    { peerId: 'p'.repeat(300), message: 'm'.repeat(600) }];
  const f = fixture({ now: () => at, hooks: { refresh: () => ({ errors }) } });
  const manager = f.runtime.networkManager;
  manager.peers = new Map([['self', {}], ['relay', {}], ['peer-a', {}], ['peer-b', {}]]);
  manager.bootstrapPeerIds = new Set(['relay']);
  manager.libp2p = { peerId: { toString: () => 'self' }, getConnections: () => [
    { status: 'open', remotePeer: { toString: () => 'relay' } },
    { status: 'open', remotePeer: { toString: () => 'peer-a' } },
    { status: 'open', remotePeer: { toString: () => 'peer-c' } },
    { status: 'closed', remotePeer: { toString: () => 'old-connection' } },
  ] };
  await f.controller.initialize();
  f.peer.models = [{ ...descriptor, providers: [{ peerId: 'self', local: true }, { peerId: 'peer-a', local: false }] },
    { ...descriptor, manifestCid: 'own-only', providers: [{ peerId: 'self', local: true }] }];
  f.peer.hosts = [{ ...descriptor, hosts: [{ peerId: 'peer-a', local: false }, { peerId: 'peer-c', local: false }] }];
  const result = await f.runtime.refreshPeers();
  assert.deepEqual({ ...result.discovery, errors: [] }, { connected: true, peerCount: 3, sharedModelCount: 1,
    hostedModelCount: 1, checkedAt: 100, errors: [] });
  assert.deepEqual(result.discovery.errors[0], errors[0]);
  assert.equal(result.discovery.errors[1].peerId.length, 128);
  assert.equal(result.discovery.errors[1].message.length, 256);
  assert.equal(result.discovery.errors[1].code, 'ERR_PEER_DISCOVERY');
  result.discovery.errors[0].message = 'Changed by UI';
  assert.equal(f.runtime.getDiscoveryStatus().errors[0].message, errors[0].message);
  at = 200; errors.length = 0;
  const healthy = await f.runtime.refreshPeers();
  assert.equal(healthy.discovery.checkedAt, 200); assert.deepEqual(healthy.discovery.errors, []);
  manager.isConnected = false;
  const offline = await f.runtime.refreshPeers();
  assert.equal(offline.discovery.connected, false); assert.equal(offline.discovery.peerCount, 0);
  assert.equal(offline.discovery.sharedModelCount, 0); assert.equal(offline.discovery.hostedModelCount, 0);
  await f.runtime.dispose();
});

test('a directory failure is visible after rejection and a later refresh can recover', async () => {
  let fail = true;
  const f = fixture({ hooks: { refresh() {
    if (fail) throw Object.assign(new Error('Directory query timed out'), { code: 'ERR_DIRECTORY_TIMEOUT' });
    return { errors: [] };
  } } });
  await f.controller.initialize();
  await assert.rejects(f.runtime.refreshPeers(), /timed out/);
  assert.deepEqual(f.runtime.getDiscoveryStatus().errors, [{ peerId: '', code: 'ERR_DIRECTORY_TIMEOUT', message: 'Directory query timed out' }]);
  fail = false;
  assert.deepEqual((await f.runtime.refreshPeers()).discovery.errors, []);
  await f.runtime.dispose();
});

test('artifact ownership failure does not prevent directory queries or advertising a loaded inference host', async () => {
  const f = fixture({ retained: true, hooks: { artifactReady: () => false } });
  await f.controller.initialize(); await f.runtime.acquireModel('hf:test');
  const state = await f.callbacks.getLocalState();
  assert.equal(state.hostedModel.manifestCid, cid); assert.deepEqual(state.sharedModels, []);
  assert.equal(f.calls.includes('publish'), false);
  const result = await f.runtime.refreshPeers();
  assert.equal(result.discovery.connected, true); assert.equal(f.calls.includes('refresh'), true);
  assert.equal((await f.runtime.generate('local', { prompt: 'Explain leaves.' })).text, 'Local answer');
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

test('same-revision GGUF variants retain their identities through import, restored loading and sharing', async () => {
  const entries = ['qwen3.5-9b-evil-mradermacher-q4-k-m-gguf', 'qwen3.5-9b-evil-mradermacher-q8-0-gguf']
    .map((id) => GGUF_MODEL_CATALOG[id]);
  const cids = [cid, 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q'];
  const records = entries.map((entry, index) => ({ cid: cids[index], kind: 'manifest', status: 'complete', pinned: true,
    manifest: { model: entry.model, files: entry.files } }));
  const catalogInfo = Object.fromEntries(entries.map((entry) => [entry.id, entry]));
  for (const restored of [false, true]) {
    const f = fixture({ catalogInfo, retainedRecords: restored ? records : [], hooks: {
      import: (id) => records[entries.findIndex((entry) => entry.id === id)],
    } });
    try {
      await f.controller.initialize();
      for (const index of [1, 0, 1]) {
        const entry = entries[index];
        await f.runtime.acquireModel(`hf:${entry.id}`);
        await f.runtime.setSharing(true);
        const state = await f.callbacks.getLocalState();
        assert.equal(state.hostedModel.modelId, entry.id);
        assert.equal(state.hostedModel.name, entry.name);
        assert.equal(state.hostedModel.manifestCid, cids[index]);
        assert.equal(f.runtime.listInferenceTargets()[0].name, entry.name);
      }
      assert.equal(f.calls.filter((call) => call === 'import').length, restored ? 0 : 2);
      const shared = (await f.callbacks.getLocalState()).sharedModels;
      assert.equal(shared.length, 2);
      const library = await f.runtime.listStoredModels();
      for (const [index, entry] of entries.entries()) {
        assert.equal(shared.find((item) => item.manifestCid === cids[index]).modelId, entry.id);
        assert.equal(library.find((item) => item.manifestCid === cids[index]).name, entry.name);
      }
    } finally { await f.runtime.dispose(); }
  }
});

test('peer variant hints select matching requirements and actual-manifest tampering blocks before transfer', async () => {
  const entries = ['qwen3.5-9b-evil-mradermacher-q4-k-m-gguf', 'qwen3.5-9b-evil-mradermacher-q8-0-gguf']
    .map((id) => GGUF_MODEL_CATALOG[id]);
  const [q4, q8] = entries;
  const inspected = [];
  const device = { webgpu: true, features: ['shader-f16'], crossOriginIsolated: true, sharedArrayBuffer: true, jspi: true, memory64: true };
  const f = fixture({ catalogInfo: Object.fromEntries(entries.map((entry) => [entry.id, entry])), hooks: {
    compatibility(entry) { inspected.push(entry); return evaluateModelCompatibility(entry, { device }); },
    inspectPeerPackage: async () => ({ model: q8.model, files: q4.files }),
  } });
  try {
    await f.controller.initialize();
    f.peer.models = [{ manifestCid: cid, modelId: q8.id, name: q8.name, repository: q8.repository, revision: q8.revision,
      runtime: q8.model.runtime, task: 'text-generation', modalities: ['text'], totalBytes: 1, providers: [{ peerId: 'remote', local: false }] }];
    f.runtime.listModelSources();
    assert.equal(inspected.at(-1), q8, 'Q8 descriptor must not borrow the first revision variant');
    await assert.rejects(f.runtime.acquireModel(`peer:${cid}`), /approved local runtime catalog/);
    assert(!f.calls.some((call) => ['fetch-peer', 'load', 'unload'].includes(call)));
    f.peer.models[0].modelId = 'unknown-variant';
    assert.equal(f.runtime.listModelSources().find((source) => source.source === 'peers').localAvailability.code, 'model_metadata_unverified');
  } finally { await f.runtime.dispose(); }
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

test('one HF acquisition loads before background publication and reports acquisition stages', async () => {
  const f = fixture(); await f.controller.initialize();
  const events = [];
  await f.runtime.acquireModel('hf:test', { onProgress: (event) => events.push(event) });
  await f.runtime.setSharing(true);
  assert.deepEqual(events, [{ stage: 'unload' }, { stage: 'load' }]);
  assert(f.calls.indexOf('import') < f.calls.indexOf('publish'));
  assert(f.calls.indexOf('load') < f.calls.indexOf('publish'));
  assert.equal((await f.callbacks.getLocalState()).hostedModel.manifestCid, cid);
  assert.equal(f.runtime.listInferenceTargets()[0].available, true);
  assert.equal(f.runtime.listInferenceTargets()[0].task, 'image-text-to-text');
  assert.deepEqual(f.runtime.listInferenceTargets()[0].outputModalities, ['text']);
  assert.equal(f.published.has(cid), true);
  await f.runtime.dispose();
});

test('stalled background publication does not delay local readiness and shutdown still awaits it', async () => {
  let release, started;
  const blocked = new Promise((resolve) => { release = resolve; });
  const publishing = new Promise((resolve) => { started = resolve; });
  const f = fixture({ hooks: { publish() { started(); return blocked; } } });
  const progress = [];
  await f.controller.initialize();
  let ready = false, disposed = false;
  const loading = f.runtime.acquireModel('hf:test', { onProgress: (event) => progress.push(event) }).then((result) => { ready = true; return result; });
  try {
    await publishing; await nextTurn();
    assert.equal(ready, true);
    assert.equal((await loading).workerId, 'worker-1');
    assert.equal(f.runtime.listInferenceTargets()[0].available, true);
    assert.equal((await f.runtime.generate('local', { prompt: 'Explain photosynthesis briefly.' })).text, 'Local answer');
    const eventCount = progress.length;
    const closing = f.runtime.dispose().then(() => { disposed = true; });
    await nextTurn();
    assert.equal(disposed, false); assert.equal(f.calls.includes('dispose'), false);
    release(); await closing;
    assert.equal(disposed, true); assert.equal(progress.length, eventCount, 'sharing cannot overwrite later chat status');
  } finally { release(); await loading; await f.runtime.dispose(); }
});

test('public import methods retain awaited sharing semantics', async () => {
  for (const method of ['importCatalog', 'importPackage', 'ensure']) {
    let release, started;
    const blocked = new Promise((resolve) => { release = resolve; });
    const publishing = new Promise((resolve) => { started = resolve; });
    const f = fixture({ hooks: { publish() { started(); return blocked; } } });
    await f.controller.initialize(); let done = false;
    const importing = f.runtime[method](method === 'importPackage' ? manifest : 'test', ...(method === 'importPackage' ? ['fixture'] : []))
      .then((value) => { done = true; return value; });
    try {
      await publishing; await nextTurn(); assert.equal(done, false, method);
      assert.equal(f.calls.includes('load'), false);
      release(); assert.equal((await importing).cid, cid); assert.equal(f.published.has(cid), true);
    } finally { release(); await importing; await f.runtime.dispose(); }
  }
});

test('cancelling before local loading avoids publication and releases acquisition for retry', async () => {
  const f = fixture(); await f.controller.initialize();
  for (const stage of ['unload', 'load']) {
    const controller = new AbortController();
    await assert.rejects(f.runtime.acquireModel('hf:test', { signal: controller.signal,
      onProgress(event) { if (event.stage === stage) controller.abort(new DOMException('Cancel before load', 'AbortError')); },
    }), { name: 'AbortError' });
    assert.equal(f.calls.includes('load'), false); assert.equal(f.calls.includes('publish'), false);
    assert.equal(f.calls.includes('use'), false);
  }
  await f.runtime.acquireModel('hf:test');
  assert.equal(f.runtime.listInferenceTargets()[0].available, true);
  await f.runtime.dispose();
});

test('a failed local load does not enqueue publication of its imported package', async () => {
  const f = fixture({ hooks: { load(setStatus) { setStatus({ status: 'idle' }); throw new Error('GPU initialization failed'); } } });
  await f.controller.initialize();
  await assert.rejects(f.runtime.acquireModel('hf:test'), /GPU initialization failed/);
  assert.equal(f.calls.includes('publish'), false); assert.equal(f.calls.includes('release-use'), true);
  assert.equal(f.records.get(cid).pinned, true);
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
      width: 512, height: 512, task: 'text-to-image' });
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
  const events = [];
  await f.runtime.acquireModel(`peer:${cid}`, { onProgress: (event) => events.push(event) });
  assert.deepEqual(events, [{ stage: 'download-peers' }, { stage: 'unload' }, { stage: 'load' }]);
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
  const received = (await f.runtime.generate(target.key, { prompt: 'color?', image })).image;
  assert.deepEqual(received, image); assert.notEqual(received.data.buffer, image.data.buffer);
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
    modelId: 'test', totalBytes: 100, runtime: model.runtime, loaded: true, shared: true,
    localAvailability: { status: 'unknown', reason: 'Local memory fit is unverified.' } }]);
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

test('denied deletion ownership preserves the original error and leaves a retained model usable', async () => {
  const f = fixture({ retained: true, connected: false });
  await f.controller.initialize();
  Object.assign(f.runtime.store, { persistent: true, lockName: 'test-library', lockManager: {
    async request(name, options, callback) {
      assert.equal(name, 'test-library:network-owner');
      assert.deepEqual(options, { mode: 'exclusive', ifAvailable: true });
      return callback(null);
    },
  } });
  await assert.rejects(f.runtime.deleteStoredModel(cid), {
    message: 'Another tab owns file sharing for this library. Delete the model from that tab, or close that tab and retry.',
  });
  assert.equal(f.calls.includes('remove'), false);
  assert.equal(f.calls.includes('withdraw'), false);
  assert.equal(f.calls.includes('unload'), false);
  const [stored] = await f.runtime.listStoredModels();
  assert.equal(stored.cleanupPending, undefined);
  assert.notEqual(stored.localAvailability.code, 'model_deleting');
  await f.runtime.loadStoredModel(cid);
  assert.equal(f.runtime.service.getStatus().status, 'ready');
  assert.equal(f.calls.includes('import'), false);
  await f.runtime.dispose();
});

test('cancelling a queued deletion clears only its unstarted marker', async () => {
  let release, started;
  const blocked = new Promise((resolve) => { release = resolve; });
  const importing = new Promise((resolve) => { started = resolve; });
  const f = fixture({ connected: false, hooks: { import() { started(); return blocked; } } });
  await f.controller.initialize();
  const importTask = f.runtime.importCatalog('test');
  await importing;
  const abort = new AbortController();
  const reason = new DOMException('Cancelled before deletion could start', 'AbortError');
  const deletion = assert.rejects(f.runtime.deleteStoredModel(cid, { signal: abort.signal }), (error) => error === reason);
  abort.abort(reason);
  release();
  await Promise.all([importTask, deletion]);
  assert.equal(f.calls.includes('remove'), false);
  assert.equal(f.records.get(cid).pinned, true);
  const [stored] = await f.runtime.listStoredModels();
  assert.equal(stored.cleanupPending, undefined);
  assert.notEqual(stored.localAvailability.code, 'model_deleting');
  await f.runtime.loadStoredModel(cid);
  assert.equal(f.runtime.service.getStatus().status, 'ready');
  await f.runtime.dispose();
});

test('denied retry ownership preserves quarantine from an earlier cleanup failure', async () => {
  let failRemoval = true, denyOwnership = false;
  const f = fixture({ retained: true, connected: false, hooks: {
    remove() { if (failRemoval) throw new Error('Storage cleanup failed'); },
  } });
  await f.controller.initialize();
  Object.assign(f.runtime.store, { persistent: true, lockName: 'test-library', lockManager: {
    async request(_name, _options, callback) { return callback(denyOwnership ? null : {}); },
  } });
  await assert.rejects(f.runtime.deleteStoredModel(cid), /Storage cleanup failed/);
  assert.equal((await f.runtime.listStoredModels())[0].cleanupPending, true);
  denyOwnership = true;
  await assert.rejects(f.runtime.deleteStoredModel(cid), /Another tab owns file sharing/);
  const [stored] = await f.runtime.listStoredModels();
  assert.equal(stored.cleanupPending, true);
  assert.equal(stored.localAvailability.code, 'model_deleting');
  await assert.rejects(f.runtime.loadStoredModel(cid), /being deleted/);
  assert.equal(f.calls.filter((call) => call === 'remove').length, 1);
  failRemoval = false; denyOwnership = false;
  assert.equal((await f.runtime.deleteStoredModel(cid)).deleted, true);
  assert.deepEqual(await f.runtime.listStoredModels(), []);
  await f.runtime.dispose();
});

test('failed unload keeps storage intact and quarantines the model until deletion retry succeeds', async () => {
  let fail = true;
  const f = fixture({ hooks: { unload() { if (fail && f.calls.includes('withdraw')) throw new Error('GPU termination not acknowledged'); } } });
  await f.controller.initialize(); await f.runtime.acquireModel('hf:test');
  await f.runtime.setSharing(true);
  await assert.rejects(f.runtime.deleteStoredModel(cid), /not acknowledged/);
  assert(f.records.has(cid)); assert(!f.calls.includes('remove'));
  assert(!f.calls.includes('release-use'));
  assert.equal((await f.runtime.listStoredModels())[0].cleanupPending, true);
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
  await f.runtime.refreshPeers();
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

test('cancelling metadata after worker readiness waits for cleanup and keeps complete stored artifacts', async () => {
  let finishMetadata, reachedMetadata, finishCleanup, reachedCleanup;
  const metadata = new Promise((resolve) => { finishMetadata = resolve; });
  const atMetadata = new Promise((resolve) => { reachedMetadata = resolve; });
  const cleanup = new Promise((resolve) => { finishCleanup = resolve; });
  const atCleanup = new Promise((resolve) => { reachedCleanup = resolve; });
  const preferences = preferenceStore();
  const previous = await preferences().rememberLoaded({ manifestCid: secondCid, modelId: secondCid });
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false, preferences: preferences(), hooks: {
    manifest() { if (f.calls.includes('load')) { reachedMetadata(); return metadata; } },
    unload() { if (f.calls.includes('load')) { reachedCleanup(); return cleanup; } },
  } });
  await f.controller.initialize();
  const caller = new AbortController(); let settled = false;
  const loading = f.runtime.loadStoredModel(cid, { signal: caller.signal });
  const rejected = assert.rejects(loading, { name: 'AbortError' }).finally(() => { settled = true; });
  try {
    await atMetadata; caller.abort(); await atCleanup; await nextTurn();
    assert.equal(settled, false); assert(!f.calls.includes('release-use'));
    assert.equal(f.runtime.listInferenceTargets()[0].available, false);
    finishCleanup(); await rejected;
    assert.equal(f.runtime.service.getStatus().status, 'idle'); assert(f.calls.includes('release-use'));
    assert.equal(f.records.get(cid).status, 'complete'); assert.equal(f.records.get(cid).pinned, true);
    assert.deepEqual(preferences().readLastLoaded(), previous); assert(!f.calls.includes('publish'));
    finishMetadata(); await nextTurn();
    assert.equal(f.runtime.service.getStatus().status, 'idle', 'late metadata cannot revive a cancelled load');
  } finally { finishCleanup(); finishMetadata(); await rejected; await f.runtime.dispose(); }
});

test('cancelling pending peer registration unloads promptly and consumes late registration failure', async () => {
  let failAttach, reachedAttach;
  const attaching = new Promise((_resolve, reject) => { failAttach = reject; });
  const atAttach = new Promise((resolve) => { reachedAttach = resolve; });
  const f = fixture({ retained: true, connected: false, hooks: { attach() { reachedAttach(); return attaching; } } });
  await f.controller.initialize(); f.runtime.networkManager.isConnected = true;
  const caller = new AbortController();
  const loading = f.runtime.loadStoredModel(cid, { signal: caller.signal });
  const rejected = assert.rejects(loading, { name: 'AbortError' });
  try {
    await atAttach; caller.abort(); await rejected;
    assert.equal(f.runtime.service.getStatus().status, 'idle'); assert(f.calls.includes('release-use'));
    assert.equal(f.callbacks.getLocalState().hostedModel, null); assert(!f.calls.includes('publish'));
    assert.equal(f.records.get(cid).pinned, true);
    failAttach(new Error('Late network failure')); await nextTurn();
  } finally { failAttach(new Error('Registration closed')); await rejected; await f.runtime.dispose(); }
});

test('optional peer registration has a bounded local-load wait and remains tracked for shutdown', async (t) => {
  let finishAttach, reachedAttach;
  const attaching = new Promise((resolve) => { finishAttach = resolve; });
  const atAttach = new Promise((resolve) => { reachedAttach = resolve; });
  const f = fixture({ retained: true, connected: false, hooks: { attach() { reachedAttach(); return attaching; } } });
  await f.controller.initialize(); f.runtime.networkManager.isConnected = true;
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const loading = f.runtime.loadStoredModel(cid);
  try {
    await atAttach; t.mock.timers.tick(3000); await loading;
    assert.equal(f.runtime.service.getStatus().status, 'ready');
    let disposed = false; const closing = f.runtime.dispose().then(() => { disposed = true; });
    await nextTurn(); assert.equal(disposed, false);
    finishAttach(); await closing; assert.equal(disposed, true);
  } finally { t.mock.timers.reset(); finishAttach(); await loading; await f.runtime.dispose(); }
});

test('late load cancellation reports failed cleanup and retains its model-use lease for retry', async () => {
  const caller = new AbortController(); let fail = true;
  const f = fixture({ retained: true, connected: false, hooks: {
    load() { caller.abort(); }, unload() { if (fail && f.calls.includes('load')) throw new Error('Worker stop failed'); },
  } });
  await f.controller.initialize();
  await assert.rejects(f.runtime.loadStoredModel(cid, { signal: caller.signal }), (error) =>
    error instanceof AggregateError && /cleanup is incomplete/.test(error.message)
      && error.errors.some((cause) => /Worker stop failed/.test(cause.message)));
  assert(!f.calls.includes('release-use')); assert.equal(f.records.get(cid).pinned, true);
  fail = false; await f.runtime.unload(); assert(f.calls.includes('release-use')); await f.runtime.dispose();
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
  await f.runtime.setSharing(true);
  assert.equal((await f.callbacks.getLocalState()).sharedModels.length, 1);
  f.records.delete(cid);
  assert.deepEqual(await f.runtime.listStoredModels(), []);
  await f.runtime.setSharing(true);
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
  await f.runtime.setSharing(true);
  assert.equal((await f.runtime.listStoredModels()).length, 130);
  assert.equal((await f.callbacks.getLocalState()).sharedModels.length, 128);
  await f.runtime.dispose();
});

const secondCid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
function preferenceStore() {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key) };
  return () => createModelPreferences({ storeName: 'test-library', storage });
}

function pendingCatalogRecord(entry) {
  return { cid, kind: 'manifest', status: 'partial', pinned: true, retain: true,
    manifest: { schema: 'peercompute.artifact.manifest.v1', name: entry.name, model: structuredClone(entry.model),
      files: entry.files.map((file) => ({ path: file.path, size: file.size, cid: secondCid,
        sha256: file.sha256 ?? '0'.repeat(64) })) } };
}

test('exact legacy GeoRefine27B retained partial metadata blocks HF reimport and preserves startup recovery', async () => {
  const entry = GGUF_MODEL_CATALOG['qwen3.8-27b-georefine-d14-gguf'];
  for (const remembered of [false, true]) {
    const preferences = preferenceStore();
    if (remembered) await preferences().rememberLoaded({ manifestCid: cid, modelId: entry.id });
    const f = fixture({ connected: true, preferences: preferences(), catalogInfo: { [entry.id]: entry },
      retainedRecords: [pendingCatalogRecord(entry)] });
    await f.controller.initialize();
    const rows = await f.runtime.listStoredModels();
    assert.equal(rows.length, 1); assert.equal(rows[0].needsVerification, true);
    assert.equal(rows[0].modelId, entry.id); assert.equal(rows[0].totalBytes, entry.totalBytes);
    const startup = f.runtime.getStartupModel();
    assert.equal(startup.sourceKey, `hf:${entry.id}`); assert.equal(startup.manifestCid, cid);
    assert.equal(startup.needsVerification, true); assert.equal(startup.localAvailability.status, 'unavailable');
    const source = f.runtime.listModelSources().find((item) => item.key === startup.sourceKey);
    assert.equal(source.needsVerification, true); assert.equal(source.manifestCid, cid);
    await assert.rejects(f.runtime.acquireModel(startup.sourceKey), { code: 'ERR_MODEL_VERIFICATION_REQUIRED' });
    await assert.rejects(f.runtime.loadStoredModel(cid), { code: 'ERR_MODEL_VERIFICATION_REQUIRED' });
    assert.deepEqual((await f.callbacks.getLocalState()).sharedModels, []);
    assert.equal((await f.callbacks.getLocalState()).hostedModel, null);
    assert(!f.calls.some((call) => ['import', 'fetch-peer', 'publish', 'load'].includes(call)));
    if (remembered) assert.equal(preferences().readLastLoaded().manifestCid, cid);
    await f.runtime.dispose();
  }
});

test('explicit local verification promotes the same package without loading, downloading or publishing it', async () => {
  const entry = GGUF_MODEL_CATALOG['qwen3.8-27b-georefine-d14-gguf'];
  const f = fixture({ connected: false, catalogInfo: { [entry.id]: entry }, retainedRecords: [pendingCatalogRecord(entry)],
    hooks: { recover(key, options) { assert.equal(key, cid); assert.equal(options.kind, 'manifest'); assert.equal(options.pin, true);
      options.onProgress({ stage: 'verify', loaded: 1, totalBytes: 2 }); } } });
  await f.controller.initialize(); const progress = [];
  assert.equal((await f.runtime.recoverStoredModel(cid, { onProgress: (event) => progress.push(event) })).verified, true);
  assert.equal(progress.length, 1); assert.equal((await f.runtime.listStoredModels())[0].needsVerification, undefined);
  assert(!f.calls.some((call) => ['import', 'fetch-peer', 'publish', 'load'].includes(call)));
  await f.runtime.loadStoredModel(cid); assert.equal(f.calls.filter((call) => call === 'load').length, 1);
  await f.runtime.dispose();
});

test('HF Load uses a complete retained copy even when another manifest of that catalog model needs verification', async () => {
  const entry = GGUF_MODEL_CATALOG['qwen3.8-27b-georefine-d14-gguf'];
  const partial = pendingCatalogRecord(entry), complete = { ...partial, cid: secondCid, status: 'complete' };
  const f = fixture({ connected: false, catalogInfo: { [entry.id]: entry }, retainedRecords: [partial, complete] });
  await f.controller.initialize();
  const source = f.runtime.listModelSources().find((entry) => entry.source === 'hf');
  assert.equal(source.manifestCid, secondCid); assert.equal(source.needsVerification, undefined);
  await f.runtime.acquireModel(source.key);
  assert.equal(f.runtime.service.getStatus().manifestCid, secondCid);
  assert(!f.calls.includes('import')); assert(!f.calls.includes('verify-local'));
  await f.runtime.dispose();
});

test('failed or cancelled local verification retains its row, startup recovery and preference', async () => {
  const entry = GGUF_MODEL_CATALOG['qwen3.8-27b-georefine-d14-gguf'];
  for (const cancel of [false, true]) {
    const preferences = preferenceStore(), abort = new AbortController();
    await preferences().rememberLoaded({ manifestCid: cid, modelId: entry.id });
    const f = fixture({ connected: false, preferences: preferences(), catalogInfo: { [entry.id]: entry },
      retainedRecords: [pendingCatalogRecord(entry)], hooks: { recover() {
        if (cancel) { abort.abort(new DOMException('User cancelled verification', 'AbortError')); throw abort.signal.reason; }
        throw new Error('Required block is missing');
      } } });
    await f.controller.initialize();
    await assert.rejects(f.runtime.recoverStoredModel(cid, { signal: abort.signal }), cancel ? /cancelled/ : /No files were downloaded/);
    assert.equal((await f.runtime.listStoredModels())[0].needsVerification, true);
    assert.equal(f.runtime.getStartupModel().manifestCid, cid); assert.equal(preferences().readLastLoaded().manifestCid, cid);
    assert(!f.calls.some((call) => ['import', 'fetch-peer', 'publish', 'load'].includes(call)));
    await f.runtime.dispose();
  }
});
function customStoredRecord(overrides = {}) {
  return { cid: secondCid, kind: 'manifest', pinned: true, status: 'complete',
    manifest: { ...manifest, name: 'Custom offline model', model: { ...model, repository: 'custom/offline' }, files: [{ size: 50 }] },
    ...overrides };
}

test('stored speech models stay voice-managed and cannot replace or become the default chat model', async () => {
  const speech = SPEECH_MODEL_CATALOG['moonshine-tiny-fp32'];
  const saved = customStoredRecord({ manifest: { name: speech.name, model: speech.model, files: speech.files } });
  const preferences = preferenceStore(); await preferences().rememberLoaded({ manifestCid: secondCid, modelId: secondCid });
  const f = fixture({ retained: true, connected: false, retainedRecords: [saved], preferences: preferences(), hooks: {
    compatibility: (entry) => entry.model?.runtime === 'transformers-speech'
      ? evaluateModelCompatibility(entry, { device: { webgpu: true, features: [] } })
      : { status: 'unknown', reason: 'Memory fit unverified' },
  } });
  let speechStatus = 'ready';
  f.runtime.services = { speech: { getStatus: () => ({ status: speechStatus, manifestCid: secondCid }) } };
  await f.controller.initialize();
  assert.equal(f.runtime.getStartupModel().manifestCid, cid);
  assert(!f.runtime.getPreferredModelSourceKey().includes(secondCid));
  assert(!f.runtime.listModelSources().some((entry) => entry.manifestCid === secondCid));
  await f.runtime.loadStoredModel(cid);
  for (const loaded of [true, false]) {
    speechStatus = loaded ? 'ready' : 'idle';
    const row = (await f.runtime.listStoredModels()).find((entry) => entry.manifestCid === secondCid);
    assert.equal(row.loaded, loaded); assert.equal(row.loadMode, 'voice');
    assert.match(row.loadHint, /Enable voice/); assert.equal(row.localAvailability.code, 'voice_managed');
    assert.equal(row.localAvailability.cpuBytes, 1024 ** 3); assert.equal(row.localAvailability.gpuBytes, 1024 ** 3);
    const before = f.calls.length;
    await assert.rejects(f.runtime.loadStoredModel(secondCid), { code: 'ERR_MODEL_VOICE_MANAGED' });
    await assert.rejects(f.runtime.load(secondCid), { code: 'ERR_MODEL_VOICE_MANAGED' });
    assert(!f.calls.slice(before).some((call) => ['load', 'unload', 'import', 'fetch-peer', 'use'].includes(call)));
    assert.equal(f.runtime.service.getStatus().manifestCid, cid);
  }
  await assert.rejects(f.runtime.acquireModel(`stored:${secondCid}`), /source is no longer available/);
  assert.equal(f.runtime.getPreferredModelSourceKey(), 'hf:test');
  await f.runtime.deleteStoredModel(secondCid);
  assert.equal(f.runtime.service.getStatus().manifestCid, cid);
  assert(!(await f.runtime.listStoredModels()).some((entry) => entry.manifestCid === secondCid));
  await f.runtime.dispose();
});

test('speech library metadata remains unavailable when its file digest is changed', async () => {
  const speech = structuredClone(SPEECH_MODEL_CATALOG['supertonic-fp32']); speech.files[0].sha256 = '0'.repeat(64);
  const f = fixture({ connected: false, retainedRecords: [customStoredRecord({
    manifest: { name: speech.name, model: speech.model, files: speech.files },
  })], hooks: { compatibility: (entry) => evaluateModelCompatibility(entry, { device: { webgpu: true, features: [] } }) } });
  await f.controller.initialize();
  const row = (await f.runtime.listStoredModels())[0];
  assert.equal(row.loadMode, 'voice'); assert.equal(row.localAvailability.status, 'unavailable');
  assert.equal(row.localAvailability.code, 'catalog_unsupported');
  await assert.rejects(f.runtime.loadStoredModel(secondCid), { code: 'ERR_MODEL_LOCAL_UNAVAILABLE' });
  assert(!f.calls.includes('load')); assert(!f.calls.includes('unload'));
  await f.runtime.dispose();
});

test('startup selects the default when only unretained failed import debris remains', async () => {
  const defaultCatalog = { [DEFAULT_MODEL_ID]: { ...catalog.test, id: DEFAULT_MODEL_ID } };
  const f = fixture({ connected: false, catalogInfo: defaultCatalog,
    retainedRecords: [customStoredRecord({ status: 'partial', pinned: false, retain: false })] });
  await f.controller.initialize();
  const selected = f.runtime.getStartupModel();
  assert.equal(selected.sourceKey, `hf:${DEFAULT_MODEL_ID}`);
  assert.equal(selected.manifestCid, undefined);
  assert(!f.calls.includes('load')); assert(!f.calls.includes('import'), 'selection itself does not start execution');
  await f.runtime.dispose();
});

test('startup prefers remembered stored model over a smaller saved alternative', async () => {
  const preferences = preferenceStore(); await preferences().rememberLoaded({ manifestCid: cid, modelId: 'test' });
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], preferences: preferences(), connected: false });
  await f.controller.initialize();
  assert.equal(f.runtime.getStartupModel().manifestCid, cid);
  await f.runtime.loadStoredModel(f.runtime.getStartupModel().manifestCid);
  assert(!f.calls.includes('import')); assert(!f.calls.includes('fetch-peer'));
  await f.runtime.dispose();
});

test('startup without a valid hint reuses a compatible saved package instead of downloading default', async () => {
  const preferences = preferenceStore(); await preferences().rememberLoaded({ manifestCid: secondCid, modelId: secondCid });
  const f = fixture({ retained: true, preferences: preferences(), connected: false });
  await f.controller.initialize();
  assert.equal(f.runtime.getStartupModel().manifestCid, cid);
  assert.equal(f.runtime.getStartupModel().sourceKey, 'hf:test');
  await f.runtime.dispose();
  const choices = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false, hooks: {
    compatibility: (entry) => ({ status: entry.model.repository === 'custom/offline' ? 'unavailable' : 'unknown' }),
  } });
  await choices.controller.initialize();
  assert.equal(choices.runtime.getStartupModel().manifestCid, cid, 'skip an incompatible alternative only when no remembered choice exists');
  await choices.runtime.dispose();
});

test('startup preserves a blocked choice for help only when all alternatives are blocked, and excludes deleting packages', async () => {
  const preferences = preferenceStore(); await preferences().rememberLoaded({ manifestCid: secondCid, modelId: secondCid });
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], preferences: preferences(), connected: false, hooks: {
    compatibility: () => ({ status: 'unavailable', reason: 'GPU setup required' }),
  } });
  await f.controller.initialize();
  assert.equal(f.runtime.getStartupModel().manifestCid, secondCid);
  assert.equal(f.runtime.getStartupModel().localAvailability.status, 'unavailable');
  f.records.set(secondCid, customStoredRecord({ status: 'deleting' }));
  await f.runtime.listStoredModels();
  assert.equal(f.runtime.getStartupModel().manifestCid, cid);
  await f.runtime.dispose();
});

test('startup replaces an unsupported remembered package with compatible saved artifacts without downloading', async () => {
  const preferences = preferenceStore();
  const previous = await preferences().rememberLoaded({ manifestCid: secondCid, modelId: secondCid });
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false, preferences: preferences(), hooks: {
    compatibility: (entry) => ({ status: entry.model.repository === 'custom/offline' ? 'unavailable' : 'unknown' }),
  } });
  await f.controller.initialize();
  const selected = f.runtime.getStartupModel();
  assert.equal(selected.manifestCid, cid); assert.equal(selected.sourceKey, 'hf:test');
  assert.deepEqual(preferences().readLastLoaded(), previous, 'selection alone cannot overwrite the successful hint');
  await f.runtime.loadStoredModel(selected.manifestCid);
  assert(!f.calls.includes('import')); assert(!f.calls.includes('fetch-peer'));
  assert.equal(preferences().readLastLoaded().manifestCid, cid);
  await f.runtime.dispose();
});

test('startup prefers a supported requested default, otherwise chooses the smallest supported catalog entry', async () => {
  const entry = (id, totalBytes, name = id) => ({ ...catalog.test, id, totalBytes, name,
    model: { ...model, repository: `catalog/${id}` } });
  const catalogInfo = { [DEFAULT_MODEL_ID]: entry(DEFAULT_MODEL_ID, 1000),
    tinyBlocked: entry('tinyBlocked', 1), beta: entry('beta', 10, 'Same'), alpha: entry('alpha', 10, 'Same'),
    unknownSize: entry('unknownSize', undefined), large: entry('large', 500) };
  let blockDefault = false;
  const f = fixture({ connected: false, catalogInfo, hooks: { compatibility: (value) => ({
    status: value.id === 'tinyBlocked' || (blockDefault && value.id === DEFAULT_MODEL_ID) ? 'unavailable' : 'unknown',
    reason: 'Physical memory fit remains unverified',
  }) } });
  await f.controller.initialize();
  assert.equal(f.runtime.getStartupModel().sourceKey, `hf:${DEFAULT_MODEL_ID}`);
  blockDefault = true;
  assert.equal(f.runtime.getStartupModel().sourceKey, 'hf:alpha', 'size then name/key order is deterministic');
  assert.equal(f.runtime.getStartupModel().manifestCid, undefined);
  assert(!f.calls.includes('import')); assert(!f.calls.includes('load'));
  await f.runtime.dispose();
});

test('startup does not download an alternative while saved or requested-default capability checks are pending', async () => {
  const catalogInfo = { ...catalog, [DEFAULT_MODEL_ID]: { ...catalog.test, id: DEFAULT_MODEL_ID, totalBytes: 500 } };
  for (const retained of [false, true]) {
    const f = fixture({ retained, connected: false, catalogInfo, hooks: {
      compatibility: (entry) => ({ status: entry.id === 'test' ? 'available' : 'checking' }),
    } });
    await f.controller.initialize();
    const selected = f.runtime.getStartupModel();
    assert.equal(selected.localAvailability.status, 'checking');
    assert.equal(selected.manifestCid, retained ? cid : undefined);
    assert(!f.calls.includes('import')); assert(!f.calls.includes('load'));
    await f.runtime.dispose();
  }
});

test('sources and library sort by bytes, keep catalog keys and expose custom offline packages', async () => {
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false,
    catalogInfo: { huge: { ...catalog.test, id: 'huge', name: 'Huge', totalBytes: 1000,
      model: { ...model, repository: 'test/huge' } }, ...catalog } });
  await f.controller.initialize();
  const choices = f.runtime.listModelSources();
  assert.deepEqual(choices.map((entry) => entry.key), [`stored:${secondCid}`, 'hf:test', 'hf:huge']);
  assert.equal(choices.filter((entry) => entry.manifestCid === cid).length, 1, 'stored catalog identity is attached to its single catalog row');
  assert.equal(choices.find((entry) => entry.manifestCid === cid).key, 'hf:test');
  assert.equal(choices.find((entry) => entry.manifestCid === cid).stored, true);
  assert.equal(choices[0].source, 'stored');
  assert.deepEqual((await f.runtime.listStoredModels()).map((entry) => entry.totalBytes), [50, 100]);
  await f.runtime.dispose();
});

test('unknown peer sizes sort last and equal-size rows have stable name/key ordering', async () => {
  const f = fixture(); await f.controller.initialize();
  f.peer.models = [
    { ...descriptor, manifestCid: 'unknown', name: 'A unknown', totalBytes: undefined, providers: [{ local: false }] },
    { ...descriptor, manifestCid: 'z', name: 'Z peer', totalBytes: 10, providers: [{ local: false }] },
    { ...descriptor, manifestCid: 'a', name: 'A peer', totalBytes: 10, providers: [{ local: false }] },
  ];
  assert.deepEqual(f.runtime.listModelSources().map((entry) => entry.key), ['peer:a', 'peer:z', 'hf:test', 'peer:unknown']);
  await f.runtime.dispose();
});

test('only a successful local load persists selection; reopen selects without importing or loading', async () => {
  const preferences = preferenceStore();
  const first = fixture({ retained: true, connected: false, preferences: preferences() });
  await first.controller.initialize();
  assert.equal(first.runtime.getPreferredModelSourceKey(), `hf:${DEFAULT_MODEL_ID}`);
  assert.equal(preferences().readLastLoaded(), null);
  await first.runtime.loadStoredModel(cid);
  assert.equal(first.runtime.getPreferredModelSourceKey(), 'hf:test');
  assert.equal(preferences().readLastLoaded().manifestCid, cid);
  await first.runtime.dispose();
  const reopened = fixture({ retained: true, connected: false, preferences: preferences() });
  await reopened.controller.initialize();
  assert.equal(reopened.runtime.getPreferredModelSourceKey(), 'hf:test');
  assert(!reopened.calls.includes('load')); assert(!reopened.calls.includes('import'));
  await reopened.runtime.dispose();
});

test('stored-only load replaces a resident offline and reuses it without imports or peer downloads', async () => {
  const preferences = preferenceStore();
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false, preferences: preferences() });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  const progress = [];
  const result = await f.runtime.loadStoredModel(secondCid, { onProgress: ({ stage }) => progress.push(stage) });
  assert.equal(result.manifestCid, secondCid); assert.deepEqual(progress, ['unload', 'load']);
  assert.equal(f.runtime.getPreferredModelSourceKey(), `stored:${secondCid}`);
  assert.equal(f.runtime.service.getStatus().manifestCid, secondCid);
  const calls = f.calls.length; await f.runtime.acquireModel(`stored:${secondCid}`);
  assert.equal(f.calls.length, calls, 'already resident package does not reload or acquire another lease');
  assert(!f.calls.includes('import')); assert(!f.calls.includes('fetch-peer'));
  await f.runtime.dispose();
  const reopened = fixture({ retainedRecords: [customStoredRecord()], connected: false, preferences: preferences() });
  await reopened.controller.initialize();
  assert.equal(reopened.runtime.getPreferredModelSourceKey(), `stored:${secondCid}`);
  assert(!reopened.calls.includes('load'));
  await reopened.runtime.dispose();
});

test('missing, incomplete, deleting and unretained stored packages never download or replace a resident', async () => {
  for (const target of [null, customStoredRecord({ status: 'partial' }), customStoredRecord({ status: 'deleting' }),
    customStoredRecord({ pinned: false })]) {
    const f = fixture({ retained: true, connected: false });
    await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
    if (target) f.records.set(secondCid, target);
    const calls = f.calls.length;
    await assert.rejects(f.runtime.loadStoredModel(secondCid), /stored and retained|needs local verification/);
    assert.equal(f.runtime.service.getStatus().manifestCid, cid);
    assert.equal(f.calls.length, calls);
    await f.runtime.dispose();
  }
});

test('stored load checks actual compatibility before releasing the current model', async () => {
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false, hooks: {
    compatibility(entry) { return entry.model?.repository === 'custom/offline'
      ? { status: 'unavailable', reason: 'Configured GPU budget is too small' } : { status: 'unknown' }; },
  } });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  const calls = f.calls.length;
  await assert.rejects(f.runtime.loadStoredModel(secondCid), /budget is too small/);
  assert.equal(f.calls.length, calls); assert.equal(f.runtime.service.getStatus().manifestCid, cid);
  const row = (await f.runtime.listStoredModels()).find((entry) => entry.manifestCid === secondCid);
  assert.equal(row.localAvailability.status, 'unavailable');
  await f.runtime.dispose();
});

test('failed and cancelled stored loads do not replace the last successful preference', async () => {
  const preferences = preferenceStore(); let fail = false;
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false, preferences: preferences(), hooks: {
    load(setStatus) { if (fail) { setStatus({ status: 'idle' }); throw new Error('GPU initialization failed'); } },
  } });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  fail = true;
  await assert.rejects(f.runtime.loadStoredModel(secondCid), /GPU initialization failed/);
  assert.equal(preferences().readLastLoaded().manifestCid, cid);
  fail = false;
  const abort = new AbortController();
  await assert.rejects(f.runtime.loadStoredModel(secondCid, { signal: abort.signal,
    onProgress({ stage }) { if (stage === 'load') abort.abort(new DOMException('Cancelled', 'AbortError')); },
  }), { name: 'AbortError' });
  assert.equal(preferences().readLastLoaded().manifestCid, cid);
  assert(!f.calls.includes('import')); assert(!f.calls.includes('fetch-peer'));
  await f.runtime.dispose();
});

test('cancellation after preference commit restores only this operation\'s hint after cleanup', async () => {
  for (const newerTab of [false, true]) {
    const preferences = preferenceStore(), caller = new AbortController();
    const previous = await preferences().rememberLoaded({ manifestCid: secondCid, modelId: secondCid });
    const local = preferences(), write = local.rememberLoadedWithReceipt;
    let newer;
    local.rememberLoadedWithReceipt = async (...args) => {
      const receipt = await write(...args);
      if (newerTab) newer = await preferences().rememberLoaded({ manifestCid: cid, modelId: 'test' });
      caller.abort();
      return receipt;
    };
    const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false, preferences: local });
    await f.controller.initialize();
    await assert.rejects(f.runtime.loadStoredModel(cid, { signal: caller.signal }), { name: 'AbortError' });
    assert.equal(f.runtime.service.getStatus().status, 'idle'); assert(f.calls.includes('release-use'));
    assert.deepEqual(preferences().readLastLoaded(), newerTab ? newer : previous);
    assert.equal(f.runtime.getPreferredModelSourceKey(), newerTab ? 'hf:test' : `stored:${secondCid}`);
    assert.equal(f.records.get(cid).pinned, true); assert(!f.calls.includes('publish'));
    await f.runtime.dispose();
  }
});

test('removed remembered packages fall back, but unsupported retained preferences remain selected for help', async () => {
  const preferences = preferenceStore(); await preferences().rememberLoaded({ manifestCid: cid, modelId: 'test' });
  const blocked = fixture({ retained: true, connected: false, preferences: preferences(), hooks: {
    compatibility: () => ({ status: 'unavailable', reason: 'GPU feature shader-f16 is required' }),
  } });
  await blocked.controller.initialize();
  assert.equal(blocked.runtime.getPreferredModelSourceKey(), 'hf:test');
  assert.equal(blocked.runtime.listModelSources()[0].localAvailability.status, 'unavailable');
  assert(!blocked.calls.includes('load')); await blocked.runtime.dispose();
  const removed = fixture({ connected: false, preferences: preferences() });
  await removed.controller.initialize();
  assert.equal(removed.runtime.getPreferredModelSourceKey(), `hf:${DEFAULT_MODEL_ID}`);
  assert.equal(preferences().readLastLoaded(), null); await removed.runtime.dispose();
});

test('deleting the preferred package clears the durable hint after successful removal', async () => {
  const preferences = preferenceStore();
  const f = fixture({ retained: true, connected: false, preferences: preferences() });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  await f.runtime.deleteStoredModel(cid);
  assert.equal(preferences().readLastLoaded(), null);
  assert.equal(f.runtime.getPreferredModelSourceKey(), `hf:${DEFAULT_MODEL_ID}`);
  await f.runtime.dispose();
});

test('stale controller deletion preserves another tab\'s newer successful selection', async () => {
  const preferences = preferenceStore();
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false, preferences: preferences() });
  await f.controller.initialize(); await f.runtime.loadStoredModel(cid);
  const latest = await preferences().rememberLoaded({ manifestCid: secondCid, modelId: secondCid });
  await f.runtime.deleteStoredModel(cid);
  assert.deepEqual(preferences().readLastLoaded(), latest);
  assert.equal(f.runtime.getPreferredModelSourceKey(), `stored:${secondCid}`);
  assert.equal(f.calls.filter((call) => call === 'load').length, 1, 'adopting a hint must not load it');
  await f.runtime.dispose();
});

test('stale library refresh adopts newer retained selection instead of deleting shared preferences', async () => {
  const preferences = preferenceStore();
  await preferences().rememberLoaded({ manifestCid: cid, modelId: 'test' });
  const f = fixture({ retained: true, retainedRecords: [customStoredRecord()], connected: false, preferences: preferences() });
  await f.controller.initialize();
  const latest = await preferences().rememberLoaded({ manifestCid: secondCid, modelId: secondCid });
  f.records.delete(cid);
  await f.runtime.listStoredModels();
  assert.deepEqual(preferences().readLastLoaded(), latest);
  assert.equal(f.runtime.getPreferredModelSourceKey(), `stored:${secondCid}`);
  assert(!f.calls.includes('load')); assert(!f.calls.includes('import'));
  await f.runtime.dispose();
});

function hubPackage() {
  const files = ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'onnx/model_q4.onnx']
    .map((path) => ({ path, size: 64, sha256: 'a'.repeat(64) }));
  return { id: 'discovered-q4', repository: 'test/discovered', revision: 'b'.repeat(40), name: 'Discovered text model',
    totalBytes: 256, files, model: { runtime: 'transformers.js', runtimeVersion: '4.3.2', architecture: 'qwen2',
      task: 'text-generation', dtype: 'q4', modalities: ['text'], repository: 'test/discovered', revision: 'b'.repeat(40) } };
}
test('discovered packages acquire through the managed queue, retain identity and reuse stored files', async () => {
  const entry = hubPackage(), preferences = preferenceStore();
  const stored = { cid: secondCid, kind: 'manifest', status: 'complete', pinned: true, manifest: {
    schema: 'peercompute.artifact.manifest.v1', name: entry.name, model: entry.model,
    files: entry.files.map((file) => ({ ...file, cid })) } };
  const f = fixture({ connected: false, preferences: preferences(), hooks: { importHub: async () => stored } });
  await f.controller.initialize();
  await f.runtime.acquireHubModel(entry);
  assert.equal(f.calls.filter((call) => call === 'import-hub').length, 1);
  assert.equal(f.runtime.getPreferredModelSourceKey(), `stored:${secondCid}`);
  assert.equal(f.runtime.getStartupModel().manifestCid, secondCid);
  assert.equal(f.runtime.listModelSources().find((item) => item.key === `stored:${secondCid}`).model.repository, entry.repository);
  await f.runtime.unload();
  await f.runtime.acquireHubModel(entry);
  assert.equal(f.calls.filter((call) => call === 'import-hub').length, 1, 'same exact immutable package reuses retained files');
  await f.runtime.dispose();
  const reopened = fixture({ connected: false, preferences: preferences(), retainedRecords: [stored] });
  await reopened.controller.initialize();
  await reopened.runtime.loadStoredModel(secondCid);
  assert.equal(reopened.runtime.getStartupModel().manifestCid, secondCid);
  assert(!reopened.calls.includes('import-hub'));
  await reopened.runtime.dispose();
});
test('invalid or locally unsupported Hub packages cannot replace the resident model or import files', async () => {
  const f = fixture({ connected: false, hooks: { compatibility: () => ({ status: 'unavailable', reason: 'GPU unavailable' }) } });
  await f.controller.initialize();
  assert.throws(() => f.runtime.acquireHubModel(hubPackage()), /GPU unavailable/);
  const invalid = hubPackage(); invalid.revision = 'main';
  assert.throws(() => f.runtime.acquireHubModel(invalid), /immutable/);
  assert(!f.calls.includes('unload')); assert(!f.calls.includes('import-hub'));
  await f.runtime.dispose();
});

test('Hub matching partial package cannot reimport, while an independent complete copy remains loadable', async () => {
  const entry = hubPackage();
  const partial = { cid, kind: 'manifest', status: 'partial', pinned: true, retain: true, manifest: {
    schema: 'peercompute.artifact.manifest.v1', name: entry.name, model: entry.model,
    files: entry.files.map((file) => ({ ...file, cid: secondCid })) } };
  const f = fixture({ connected: false, retainedRecords: [partial] });
  await f.controller.initialize();
  await assert.rejects(f.runtime.acquireHubModel(entry), { code: 'ERR_MODEL_VERIFICATION_REQUIRED' });
  assert(!f.calls.includes('import-hub')); assert(!f.calls.includes('load'));
  f.records.set(secondCid, { ...partial, cid: secondCid, status: 'complete' });
  await f.runtime.acquireHubModel(entry);
  assert.equal(f.runtime.service.getStatus().manifestCid, secondCid);
  assert(!f.calls.includes('import-hub')); assert(!f.calls.includes('verify-local'));
  await f.runtime.dispose();
});

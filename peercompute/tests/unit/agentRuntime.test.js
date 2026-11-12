import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as tick } from 'node:timers/promises';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../src/peercompute/agents/AgentRuntime.js';
import { encodeGeneratedMesh } from '../../src/peercompute/inference/GeneratedMeshArtifact.js';

const candidate = { key: 'local', manifestCid: 'model-cid', sessionId: 'session-1', local: true, available: true,
  runtime: 'transformers.js', name: 'Model', task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
const image = { width: 1, height: 1, channels: 4, data: new Uint8Array([1, 2, 3, 255]) };
const deferred = () => { let resolve; const promise = new Promise((done) => { resolve = done; }); return { promise, resolve }; };
function locks() { const held = new Set(); return { async request(name, options, callback) {
  if (held.has(name)) return callback(null); held.add(name);
  try { return await callback({ name }); } finally { held.delete(name); }
} }; }
async function fixture(t, options = {}) {
  const store = new AgentRecordStore({ indexedDBImpl: new IDBFactory(), keyRange: IDBKeyRange, lockManager: locks(), ...options.store });
  await store.open(); const calls = [];
  const inference = { async listCandidates(input) { calls.push({ type: 'list', input }); return [candidate]; },
    async generate(selected, input, callbacks) { calls.push({ type: 'generate', selected, input }); callbacks.onToken?.('Hello'); return { text: 'Hello', finishReason: 'stop' }; },
    async cancel(id) { calls.push({ type: 'cancel', id }); }, ...options.inference };
  const runtime = new AgentRuntime({ store, inference, ...options.runtime });
  t.after(async () => { await runtime.dispose(); await store.destroy(); });
  const head = await runtime.create({ name: 'Ada', instructions: 'Be brief.', goals: ['Observe'], ...options.input });
  return { store, runtime, inference, calls, id: head.agentId, head };
}

test('agent mesh jobs route explicit image input, validate output and journal metadata without binary mesh', async (t) => {
  const meshModel = { ...candidate, task: 'image-to-3d', modalities: ['image'], outputModalities: ['mesh'] };
  const mesh = encodeGeneratedMesh({ positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), indices: new Uint16Array([0, 1, 2]) });
  const f = await fixture(t, { inference: { async listCandidates() { return [meshModel]; },
    async generate(selected, input) {
      assert.equal(selected.task, 'image-to-3d'); assert.equal(input.prompt, undefined);
      assert.equal(input.messages, undefined); assert.equal(input.worldContext, undefined);
      assert.deepEqual(input.image, image); return { text: '', mesh };
    } } });
  await f.runtime.resume(f.id);
  const result = await f.runtime.run(f.id, { task: 'image-to-3d', prompt: 'Place the pictured chair', image,
    worldContext: 'Private observations', taskInstructions: 'Private identity details' });
  assert.equal(result.result.mesh.sha256, mesh.sha256);
  const events = await f.runtime.events(f.id);
  assert.equal(events.find((event) => event.type === 'request').text, 'Place the pictured chair');
  assert.equal(events.at(-1).generatedMesh.sha256, mesh.sha256);
  assert.equal(events.at(-1).generatedMesh.data, undefined);
  assert.equal(events.at(-1).generatedMesh.artifactCid, undefined);
  f.inference.generate = async () => ({ text: '', mesh: { ...mesh, data: new Uint8Array(mesh.byteLength) } });
  await assert.rejects(f.runtime.run(f.id, { task: 'image-to-3d', image }), /GLB header/u);
});

test('private direct task checkpoints intent before dispatch and survives reopen with identity/history', async (t) => {
  const f = await fixture(t); const events = [];
  f.runtime.subscribe((event) => events.push(event));
  await assert.rejects(f.runtime.run(f.id, { prompt: 'x' }), { code: 'ERR_AGENT_PAUSED' });
  await f.runtime.resume(f.id);
  f.inference.generate = async (_candidate, input, callbacks) => {
    const record = await f.store.get(f.id);
    assert.equal(record.pendingOperation.status, 'dispatched'); assert.equal(record.pendingOperation.id, input.requestId);
    assert.equal((await f.store.events(f.id)).at(-1).type, 'request');
    assert.match(input.messages[0].content, /Ada/);
    callbacks.onToken('Hello'); return { text: 'Hello', finishReason: 'stop' };
  };
  const first = await f.runtime.run(f.id, { prompt: 'Describe the room' });
  assert.equal(first.result.text, 'Hello'); assert.equal(first.head.pendingOperation, null);
  assert.equal(first.route.kind, 'baseline'); assert.equal(events.filter((e) => e.type === 'token').length, 1);
  const second = await f.runtime.run(f.id, { prompt: 'Again' });
  assert.equal(second.head.status, 'completed');
  const restored = new AgentRuntime({ store: f.store, inference: f.inference });
  assert.equal((await restored.get(f.id)).identity.name, 'Ada');
  assert.equal((await restored.events(f.id)).filter((e) => e.type === 'result').length, 2); await restored.dispose();
});

test('task response instructions remain transient across persisted multi-turn conversations', async (t) => {
  const f = await fixture(t), taskInstructions = 'Return one bounded movement intention.';
  await f.runtime.resume(f.id);
  for (const prompt of ['Come closer', 'Follow me', 'Stop']) {
    await f.runtime.run(f.id, { prompt, taskInstructions, conversationId: 'world:owner' });
  }
  const requests = (await f.runtime.events(f.id)).filter(event => event.type === 'request');
  assert.deepEqual(requests.map(event => event.text), ['Come closer', 'Follow me', 'Stop']);
  assert.equal(requests.some(event => JSON.stringify(event).includes(taskInstructions)), false);
  const dispatched = f.calls.filter(call => call.type === 'generate').at(-1).input;
  assert.equal(dispatched.messages.filter(message => message.content.includes(taskInstructions)).length, 1);
  assert.equal(dispatched.messages[0].role, 'system');
  assert.deepEqual(dispatched.messages.filter(message => message.role === 'user').map(message => message.content),
    ['Come closer', 'Follow me', 'Stop']);
});

test('local-only rejects injected peer selection and never requests network discovery mode', async (t) => {
  const peer = { ...candidate, local: false, key: 'peer:other', manifestCid: 'other' };
  const f = await fixture(t, { runtime: { router: () => ({ candidate: peer }) },
    inference: { async listCandidates(input) { assert.equal(input.mode, 'local-only'); return [candidate, peer]; },
      generate() { assert.fail('Must not generate on peer'); } } });
  await f.runtime.resume(f.id);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'Private' }), { code: 'ERR_AGENT_NO_MODEL' });
  assert.equal((await f.store.operations(f.id)).length, 0);
});

test('router cannot substitute a session or spoof capabilities outside the candidate snapshot', async (t) => {
  const f = await fixture(t, { runtime: { router: () => ({ candidate: { ...candidate, sessionId: 'foreign' } }) } });
  await f.runtime.resume(f.id); await assert.rejects(f.runtime.run(f.id, { prompt: 'x' }), /outside.*snapshot/);
  assert.equal(f.calls.filter((x) => x.type === 'generate').length, 0);
});

test('FIFO tasks share inference; queued cancellation is prompt and active cancellation waits for cleanup', async (t) => {
  const started = deferred(), cleanup = deferred();
  const f = await fixture(t); await f.runtime.resume(f.id);
  const other = await f.runtime.create({ name: 'Other' }); await f.runtime.resume(other.agentId);
  f.inference.generate = async (_candidate, input, { signal }) => {
    started.resolve(); await new Promise((done) => signal.addEventListener('abort', done, { once: true }));
    await cleanup.promise; throw new DOMException('Cancelled', 'AbortError');
  };
  const running = f.runtime.run(f.id, { prompt: 'wait' }); await started.promise;
  const queued = f.runtime.run(other.agentId, { prompt: 'queued' });
  await f.runtime.cancel(other.agentId); await assert.rejects(queued, { name: 'AbortError' });
  assert.equal((await f.store.operations(other.agentId)).length, 0);
  let cancelled = false; const cancelling = f.runtime.cancel(f.id).then(() => { cancelled = true; });
  await tick(); assert.equal(cancelled, false); assert.equal((await f.runtime.get(f.id)).activity.status, 'cancelling');
  await assert.rejects(f.store.withRun(f.id, () => {}), { code: 'ERR_AGENT_BUSY' });
  cleanup.resolve(); await cancelling; await assert.rejects(running, { name: 'AbortError' });
  await f.runtime.pause(f.id); assert.equal((await f.runtime.get(f.id)).status, 'paused');
});

test('remote accepted provider is recorded and committed failure is not replayed', async (t) => {
  const peer = { ...candidate, key: 'peer:peer-model', manifestCid: 'peer-model', local: false };
  let count = 0;
  const f = await fixture(t, { input: { inferenceMode: 'network-assisted' }, inference: {
    async listCandidates({ mode }) { assert.equal(mode, 'network-assisted'); return [peer]; },
    async generate(_candidate, input, callbacks) {
      count++; callbacks.onProgress({ type: 'accepted', peerId: 'authenticated-peer' });
      throw Object.assign(new Error('Disconnected after start'), { committed: true });
    },
  } });
  await f.runtime.resume(f.id); await assert.rejects(f.runtime.run(f.id, { prompt: 'Remote' }), /Disconnected/);
  assert.equal(count, 1);
  const operation = (await f.store.operations(f.id))[0];
  assert.equal(operation.status, 'outcome-unknown'); assert.equal(operation.route.peerId, 'authenticated-peer');
});

test('recovered dispatch requires explicit acknowledgement and never sends an old request', async (t) => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  let head = await f.store.get(f.id);
  head = await f.store.commit(f.id, { expectedRevision: head.revision, head: { ...head, status: 'running' }, operation: { id: 'interrupted', status: 'prepared' } });
  await f.store.commit(f.id, { expectedRevision: head.revision, operation: { id: 'interrupted', status: 'dispatched' } });
  assert.equal((await f.runtime.get(f.id)).recoveryRequired, true);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'New' }), { code: 'ERR_AGENT_RECOVERY_REQUIRED' });
  await f.runtime.resume(f.id); assert.equal((await f.store.getOperation(f.id, 'interrupted')).status, 'outcome-unknown');
  assert.equal(f.calls.length, 0); assert.equal((await f.runtime.get(f.id)).status, 'waiting');
});

test('failed result persistence blocks new work and explicit reconciliation saves without regeneration', async (t) => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  const commit = f.store.commit.bind(f.store); let writesFail = true;
  f.store.commit = (id, change, options) => {
    if (writesFail && change.event?.type === 'result') return Promise.reject(new DOMException('Quota denied', 'QuotaExceededError'));
    return commit(id, change, options);
  };
  await assert.rejects(f.runtime.run(f.id, { prompt: 'x' }), { name: 'QuotaExceededError' });
  assert.equal((await f.runtime.get(f.id)).activity.unsaved, true);
  assert.throws(() => f.runtime.run(f.id, { prompt: 'Again' }), { code: 'ERR_AGENT_UNSAVED' });
  assert.equal((await f.store.get(f.id)).pendingOperation.status, 'dispatched');
  writesFail = false; await f.runtime.resume(f.id);
  assert.equal((await f.store.get(f.id)).pendingOperation, null);
  assert.equal((await f.store.events(f.id)).at(-1).text, 'Hello');
  assert.equal(f.calls.filter((item) => item.type === 'generate').length, 1);
});

test('stale completion cannot overwrite another saved context and Resume discards it explicitly', async (t) => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  f.inference.generate = async () => {
    const head = await f.store.get(f.id);
    await f.store.commit(f.id, { expectedRevision: head.revision, head: { ...head, context: { summary: 'Newer context' } } });
    return { text: 'Stale response' };
  };
  await assert.rejects(f.runtime.run(f.id, { prompt: 'x' }), { code: 'ERR_AGENT_CONFLICT' });
  await f.runtime.resume(f.id);
  assert.equal((await f.runtime.get(f.id)).context.summary, 'Newer context');
  assert.equal((await f.runtime.events(f.id)).at(-1).type, 'stale-discarded');
  assert(!(await f.runtime.events(f.id)).some((event) => event.type === 'result'));
});

test('private image input/output use acknowledged attachment records and enforce result task shape', async (t) => {
  const vision = { ...candidate, task: 'image-text-to-text', modalities: ['text', 'image'] };
  const diffusion = { ...candidate, task: 'text-to-image', outputModalities: ['image'] };
  let selected = vision;
  const f = await fixture(t, { inference: { async listCandidates() { return [selected]; },
    async generate(_model, input) { return selected === diffusion ? { text: '', image } : { text: 'A pixel' }; } } });
  await f.runtime.resume(f.id);
  await f.runtime.run(f.id, { prompt: 'Describe', image });
  const request = (await f.runtime.events(f.id)).find((event) => event.inputAttachmentId);
  assert.deepEqual((await f.runtime.getAttachment(f.id, request.inputAttachmentId)).data, image.data);
  selected = diffusion; const generated = await f.runtime.run(f.id, { task: 'text-to-image', prompt: 'Draw' });
  const result = (await f.runtime.events(f.id)).find((event) => event.imageAttachmentId);
  assert.equal(generated.imageAttachmentId, result.imageAttachmentId);
  assert.deepEqual((await f.runtime.getAttachment(f.id, result.imageAttachmentId)).data, image.data);
  f.inference.generate = async () => ({ text: 'No pixels' });
  await assert.rejects(f.runtime.run(f.id, { task: 'text-to-image', prompt: 'Draw' }), /no image/);
});

test('facade update/export/import/delete preserve new identities and never own inference disposal', async (t) => {
  const f = await fixture(t);
  const updated = await f.runtime.update(f.id, { name: 'Renamed', summary: 'Saved memory' }, { expectedRevision: f.head.revision });
  const bundle = await f.runtime.export(f.id); const restored = await f.runtime.importAsNew(bundle);
  assert.notEqual(restored.agentId, f.id); assert.equal(restored.status, 'paused'); assert.equal(restored.context.summary, 'Saved memory');
  await assert.rejects(f.runtime.update(f.id, { name: 'Stale' }, { expectedRevision: 1 }), { code: 'ERR_AGENT_REVISION' });
  await f.runtime.remove(f.id, { expectedRevision: updated.revision }); assert.equal(await f.runtime.get(f.id), undefined);
  assert.equal(f.calls.length, 0);
});

test('malformed policies and foreign authority cannot invoke discovery or inference', async (t) => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  const withRun = f.store.withRun.bind(f.store);
  for (const mutate of [(head) => { head.policy.inferenceMode = 'evil-network'; },
    (head) => { head.authority.hostId = 'foreign'; }]) {
    f.store.withRun = (id, callback, options) => withRun(id, (context) => { mutate(context.head); return callback(context); }, options);
    await assert.rejects(f.runtime.run(f.id, { prompt: 'Private' }));
  }
  assert.equal(f.calls.length, 0);
});

test('invalid edits do not quarantine the agent; an explicitly deleted unsaved agent does not replay', async (t) => {
  const f = await fixture(t);
  await assert.rejects(f.runtime.update(f.id, { name: '' }), /name/);
  assert.equal((await f.runtime.get(f.id)).activity?.unsaved, undefined);
  await f.runtime.resume(f.id);
  const commit = f.store.commit.bind(f.store);
  f.store.commit = (id, change, options) => change.event?.type === 'result'
    ? Promise.reject(new DOMException('Quota refused', 'QuotaExceededError')) : commit(id, change, options);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'x' }), { name: 'QuotaExceededError' });
  assert.equal((await f.runtime.get(f.id)).activity.unsaved, true);
  const exported = await f.runtime.export(f.id); assert.equal(exported.agent.identity.name, 'Ada');
  await f.runtime.remove(f.id); assert.equal(await f.runtime.get(f.id), undefined);
});

test('a failed initial intent write reconciles as unsent without inventing an operation receipt', async (t) => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  const commit = f.store.commit.bind(f.store); let fail = true;
  f.store.commit = (id, change, options) => fail && change.operation?.status === 'prepared'
    ? Promise.reject(new DOMException('Quota refused', 'QuotaExceededError')) : commit(id, change, options);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'Never send' }), { name: 'QuotaExceededError' });
  assert.equal(f.calls.filter((item) => item.type === 'generate').length, 0);
  fail = false; await f.runtime.resume(f.id);
  assert.equal((await f.store.operations(f.id)).length, 0);
  assert.match((await f.runtime.events(f.id)).at(-1).text, /Unsent task discarded/);
  assert.equal((await f.runtime.get(f.id)).status, 'waiting');
});

test('several agents execute in FIFO order and disposal waits for late cancellation cleanup', async (t) => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  const b = await f.runtime.create({ name: 'B' }), c = await f.runtime.create({ name: 'C' });
  await f.runtime.resume(b.agentId); await f.runtime.resume(c.agentId);
  const started = deferred(), finishFirst = deferred(), order = [];
  f.inference.generate = async (_selected, input) => {
    order.push(input.prompt); if (input.prompt === 'first') { started.resolve(); await finishFirst.promise; }
    return { text: input.prompt };
  };
  const aRun = f.runtime.run(f.id, { prompt: 'first' }); await started.promise;
  const bRun = f.runtime.run(b.agentId, { prompt: 'second' }), cRun = f.runtime.run(c.agentId, { prompt: 'third' });
  assert.throws(() => f.runtime.run(b.agentId, { prompt: 'duplicate' }), { code: 'ERR_AGENT_BUSY' });
  finishFirst.resolve(); await Promise.all([aRun, bRun, cRun]); assert.deepEqual(order, ['first', 'second', 'third']);
  const cleanup = deferred(), running = deferred();
  f.inference.generate = async (_selected, _input, { signal }) => {
    running.resolve(); await new Promise((done) => signal.addEventListener('abort', done, { once: true }));
    await cleanup.promise; throw new DOMException('Cancelled', 'AbortError');
  };
  const task = f.runtime.run(f.id, { prompt: 'wait' }); await running.promise;
  let disposed = false; const disposing = f.runtime.dispose().then(() => { disposed = true; });
  await tick(); assert.equal(disposed, false); cleanup.resolve(); await disposing;
  await assert.rejects(task, { name: 'AbortError' }); assert.equal(f.runtime.entries.size, 0);
});

test('a no-model failure returns to waiting without an execution receipt or retry', async (t) => {
  const f = await fixture(t, { inference: { async listCandidates() { return []; } } });
  await f.runtime.resume(f.id);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'Private task' }), { code: 'ERR_AGENT_NO_MODEL' });
  const restored = new AgentRuntime({ store: f.store, inference: f.inference });
  assert.equal((await restored.get(f.id)).status, 'waiting');
  assert.equal((await f.runtime.get(f.id)).activity.status, 'waiting');
  const event = (await restored.events(f.id)).at(-1);
  assert.equal(event.type, 'waiting'); assert.equal(event.waiting, 'model-unavailable');
  assert.equal(event.dispatched, false); assert.match(event.text, /No compatible local model/);
  assert.equal((await f.store.operations(f.id)).length, 0); assert.equal(f.calls.filter((item) => item.type === 'generate').length, 0);
  await restored.dispose();
});

test('repeated settled failures remain automatically recoverable without replay or overriding owner pause', async t => {
  let calls = 0, failing = true;
  const f = await fixture(t, { inference: { async generate() {
    calls++; if (failing) throw new Error('Provider unavailable'); return { text: 'Recovered' };
  } } });
  await f.runtime.resume(f.id);
  const reopened = new AgentRuntime({ store: f.store, inference: f.inference });
  t.after(() => reopened.dispose());
  for (let i = 0; i < 5; i++) {
    await assert.rejects(reopened.run(f.id, { prompt: `Fresh attempt ${i}` }), /Provider unavailable/);
    const head = await reopened.get(f.id);
    assert.equal(head.status, 'paused'); assert.equal(head.pauseCause, 'automatic');
    assert.equal(head.pendingOperation, null);
    await assert.rejects(reopened.run(f.id, { prompt: 'Before coordinator cooldown' }), { code: 'ERR_AGENT_PAUSED' });
    await reopened.recoverReady(f.id, { expectedRevision: head.revision });
    assert.equal(calls, i + 1, 'recovery changes readiness, never resubmits the failed input');
    assert.equal((await reopened.get(f.id)).status, 'waiting');
  }
  failing = false; await reopened.run(f.id, { prompt: 'Successful new turn' });
  const revision = (await reopened.get(f.id)).revision;
  await reopened.recoverReady(f.id); assert.equal((await reopened.get(f.id)).revision, revision, 'clean continuity needs no new checkpoint');
  await reopened.pause(f.id); assert.equal((await reopened.get(f.id)).pauseCause, 'owner');
  await assert.rejects(reopened.recoverReady(f.id), { code: 'ERR_AGENT_OWNER_PAUSED' });
  await assert.rejects(reopened.run(f.id, { prompt: 'Owner paused' }), { code: 'ERR_AGENT_PAUSED' });
});

test('confirmed context rejection after peer admission cools down automatically and never replays', async t => {
  let calls = 0;
  const f = await fixture(t, { inference: { async generate(_candidate, _input, callbacks) {
    calls++; callbacks.onProgress({ type: 'accepted', peerId: 'host' });
    throw Object.assign(new Error('Input cannot fit'), { code: 'ERR_MODEL_CONTEXT_BUDGET', committed: true });
  } } });
  await f.runtime.resume(f.id);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'Large request' }), { code: 'ERR_MODEL_CONTEXT_BUDGET' });
  const head = await f.runtime.get(f.id);
  assert.equal(head.status, 'paused'); assert.equal(head.pauseCause, 'automatic');
  assert.equal(head.pendingOperation, null); assert.equal(calls, 1);
  assert.equal((await f.store.operations(f.id))[0].status, 'failed');
  await f.runtime.recoverReady(f.id); assert.equal(calls, 1);
  f.inference.generate = async () => { calls++; return { text: 'New request' }; };
  await f.runtime.run(f.id, { prompt: 'Smaller separate request' }); assert.equal(calls, 2);
});

test('context error code cannot hide output already emitted or bypass an unsaved checkpoint', async t => {
  const f = await fixture(t, { inference: { async generate(_candidate, _input, callbacks) {
    callbacks.onToken('Partial output');
    throw Object.assign(new Error('Invalid late budget error'), { code: 'ERR_MODEL_CONTEXT_BUDGET', committed: true });
  } } });
  await f.runtime.resume(f.id);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'Request' }), /Invalid late/);
  assert.equal((await f.runtime.get(f.id)).status, 'paused');
  assert.equal((await f.store.operations(f.id))[0].status, 'outcome-unknown');
  await f.runtime.resume(f.id);
  f.inference.generate = async () => { throw Object.assign(new Error('Rejected'), { code: 'ERR_MODEL_CONTEXT_BUDGET' }); };
  const commit = f.store.commit.bind(f.store);
  f.store.commit = async (id, change, options) => {
    if (change.event?.type === 'failed') throw new Error('Storage unavailable');
    return commit(id, change, options);
  };
  await assert.rejects(f.runtime.run(f.id, { prompt: 'Rejected' }), { code: 'ERR_MODEL_CONTEXT_BUDGET' });
  assert.equal((await f.runtime.get(f.id)).activity.unsaved, true);
  assert.throws(() => f.runtime.run(f.id, { prompt: 'Blocked' }), { code: 'ERR_AGENT_UNSAVED' });
  f.store.commit = commit;
  await f.runtime.resume(f.id);
  for (let i = 0; i < 2; i++) {
    await assert.rejects(f.runtime.run(f.id, { prompt: 'Fresh attempt' }), { code: 'ERR_MODEL_CONTEXT_BUDGET' });
    assert.equal((await f.runtime.get(f.id)).pauseCause, 'automatic');
    await f.runtime.recoverReady(f.id);
  }
});

test('two residents superseded by world-chat turns remain ready and isolated from deliberate owner pause', async t => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  const other = await f.runtime.create({ name: 'Second resident' }); await f.runtime.resume(other.agentId);
  const calls = [];
  f.inference.generate = async (_candidate, input, { signal }) => {
    calls.push(input.prompt);
    await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
    throw new DOMException('New world-chat message superseded this reply', 'AbortError');
  };
  for (const id of [f.id, other.agentId]) {
    const controller = new AbortController();
    const task = f.runtime.run(id, { prompt: `Current hello for ${id}`, signal: controller.signal });
    while (f.runtime.activities.get(id)?.status !== 'running') await tick();
    controller.abort(new DOMException('Conversation changed', 'AbortError'));
    await assert.rejects(task, { name: 'AbortError' });
    const head = await f.runtime.get(id), events = await f.runtime.events(id);
    assert.equal(head.status, 'waiting'); assert.equal(head.pauseCause, null);
    assert.equal(head.pendingOperation, null); assert.equal(events.at(-1).type, 'cancelled');
    assert.equal(events.at(-1).superseded, true); assert.equal(events.some(event => event.type === 'failed'), false);
  }
  await f.runtime.pause(f.id); await assert.rejects(f.runtime.recoverReady(f.id), { code: 'ERR_AGENT_OWNER_PAUSED' });
  await f.runtime.recoverReady(other.agentId);
  assert.equal((await f.runtime.get(other.agentId)).status, 'waiting'); assert.equal(calls.length, 2);
  f.inference.generate = async (_candidate, input) => ({ text: input.prompt });
  const result = await f.runtime.run(other.agentId, { prompt: 'A completely new hello' });
  assert.equal(result.result.text, 'A completely new hello');
  assert.equal((await f.runtime.get(f.id)).pauseCause, 'owner');
});

test('automatic recovery reconciles interrupted work and unsaved output without invoking inference', async t => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  let head = await f.store.get(f.id);
  head = await f.store.commit(f.id, { expectedRevision: head.revision, head: { ...head, status: 'running' },
    operation: { id: 'interrupted', status: 'prepared' } });
  await f.store.commit(f.id, { expectedRevision: head.revision, operation: { id: 'interrupted', status: 'dispatched' } });
  assert.equal((await f.runtime.get(f.id)).pauseCause, 'automatic');
  await f.runtime.recoverReady(f.id);
  assert.equal((await f.store.getOperation(f.id, 'interrupted')).status, 'outcome-unknown');
  assert.equal(f.calls.length, 0);
  const commit = f.store.commit.bind(f.store); let failing = true;
  f.store.commit = (id, change, options) => failing && change.event?.type === 'result'
    ? Promise.reject(new DOMException('Storage refused', 'QuotaExceededError')) : commit(id, change, options);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'One generation' }), { name: 'QuotaExceededError' });
  assert.equal((await f.runtime.get(f.id)).pauseCause, 'automatic');
  failing = false; await f.runtime.recoverReady(f.id);
  assert.equal(f.calls.filter(call => call.type === 'generate').length, 1);
  assert.equal((await f.runtime.events(f.id)).at(-1).text, 'Hello');
  assert.equal((await f.runtime.get(f.id)).pendingOperation, null);
});

test('busy model admission never consumes an error budget or mutates another resident', async t => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  const other = await f.runtime.create({ name: 'Do not touch' });
  f.inference.generate = async () => { throw Object.assign(new Error('Host is occupied'), { code: 'ERR_INFERENCE_BUSY' }); };
  for (let i = 0; i < 5; i++) {
    await assert.rejects(f.runtime.run(f.id, { prompt: `Current request ${i}` }), { code: 'ERR_INFERENCE_BUSY' });
    assert.equal((await f.runtime.get(f.id)).status, 'waiting');
    assert.equal((await f.runtime.events(f.id)).at(-1).type, 'waiting');
  }
  assert.equal((await f.runtime.events(f.id)).some(event => event.type === 'failed'), false);
  assert.deepEqual(await f.store.get(other.agentId), other);
  assert.equal((await f.runtime.get(f.id)).pendingOperation, null);
});

test('late automatic recovery cannot overrule an owner pause or a changed revision', async t => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  f.inference.generate = async () => { throw new Error('Transient failure'); };
  await assert.rejects(f.runtime.run(f.id, { prompt: 'Failure' }), /Transient/);
  const failed = await f.runtime.get(f.id);
  await f.runtime.pause(f.id);
  await assert.rejects(f.runtime.recoverReady(f.id, { expectedRevision: failed.revision }), { code: 'ERR_AGENT_REVISION' });
  await assert.rejects(f.runtime.recoverReady(f.id), { code: 'ERR_AGENT_OWNER_PAUSED' });
  assert.equal((await f.runtime.get(f.id)).pauseCause, 'owner');
});

test('queued owner cancellation fences recovery and new work until its pause is durable', async t => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  const other = await f.runtime.create({ name: 'Queued resident' }); await f.runtime.resume(other.agentId);
  const started = deferred(), finish = deferred(), checkpoint = deferred(), release = deferred();
  f.inference.generate = async () => { started.resolve(); await finish.promise; return { text: 'Finished' }; };
  const active = f.runtime.run(f.id, { prompt: 'Current work' }); await started.promise;
  const queued = f.runtime.run(other.agentId, { prompt: 'Not yet dispatched' });
  const withRun = f.store.withRun.bind(f.store); let delay = true;
  f.store.withRun = async (id, callback, options) => {
    if (id === other.agentId && delay) { delay = false; checkpoint.resolve(); await release.promise; }
    return withRun(id, callback, options);
  };
  const cancelled = f.runtime.cancel(other.agentId); await checkpoint.promise;
  await assert.rejects(queued, { name: 'AbortError' });
  assert.equal((await f.store.get(other.agentId)).status, 'waiting', 'Owner checkpoint is deliberately still pending');
  await assert.rejects(f.runtime.recoverReady(other.agentId), { code: 'ERR_AGENT_OWNER_PAUSED' });
  assert.throws(() => f.runtime.run(other.agentId, { prompt: 'Must not sneak in' }), { code: 'ERR_AGENT_BUSY' });
  release.resolve(); await cancelled;
  assert.equal((await f.runtime.get(other.agentId)).pauseCause, 'owner');
  finish.resolve(); await active;
  assert.equal((await f.store.operations(other.agentId)).length, 0);
});

test('residency lost after dispatch preserves unknown outcome without replaying generation', async t => {
  const f = await fixture(t); await f.runtime.resume(f.id); let generated = 0;
  f.inference.generate = async () => {
    generated++; throw Object.assign(new Error('Model left memory'), { code: 'ERR_MODEL_RESIDENCY_INACTIVE' });
  };
  await assert.rejects(f.runtime.run(f.id, { prompt: 'One uncertain request' }), { code: 'ERR_MODEL_RESIDENCY_INACTIVE', committed: true });
  assert.equal((await f.runtime.get(f.id)).status, 'paused');
  assert.equal((await f.runtime.get(f.id)).pauseCause, 'automatic');
  assert.equal((await f.store.operations(f.id)).at(-1).status, 'outcome-unknown');
  assert.equal((await f.runtime.events(f.id)).at(-1).waiting, undefined);
  await f.runtime.recoverReady(f.id); assert.equal(generated, 1);
});

test('an owner pause during a failed checkpoint remains owner-controlled until acknowledged', async t => {
  const f = await fixture(t); await f.runtime.resume(f.id);
  const commit = f.store.commit.bind(f.store); let blocked = true;
  f.store.commit = (id, change, options) => blocked && change.event?.type === 'result'
    ? Promise.reject(new DOMException('Storage denied', 'QuotaExceededError')) : commit(id, change, options);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'One saved result' }), { name: 'QuotaExceededError' });
  await assert.rejects(f.runtime.pause(f.id), { code: 'ERR_AGENT_UNSAVED' });
  assert.equal((await f.runtime.get(f.id)).pauseCause, 'owner');
  blocked = false;
  await assert.rejects(f.runtime.recoverReady(f.id), { code: 'ERR_AGENT_OWNER_PAUSED' });
  await f.runtime.resume(f.id);
  assert.equal((await f.runtime.events(f.id)).at(-1).text, 'Hello');
  assert.equal(f.calls.filter(call => call.type === 'generate').length, 1);
});

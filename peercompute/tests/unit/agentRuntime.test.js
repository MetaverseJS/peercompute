import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as tick } from 'node:timers/promises';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../src/peercompute/agents/AgentRuntime.js';

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

test('a no-model failure persists a paused activity record without an execution receipt', async (t) => {
  const f = await fixture(t, { inference: { async listCandidates() { return []; } } });
  await f.runtime.resume(f.id);
  await assert.rejects(f.runtime.run(f.id, { prompt: 'Private task' }), { code: 'ERR_AGENT_NO_MODEL' });
  const restored = new AgentRuntime({ store: f.store, inference: f.inference });
  assert.equal((await restored.get(f.id)).status, 'paused');
  const event = (await restored.events(f.id)).at(-1);
  assert.equal(event.type, 'failed'); assert.equal(event.dispatched, false); assert.match(event.text, /No compatible local model/);
  assert.equal((await f.store.operations(f.id)).length, 0); assert.equal(f.calls.filter((item) => item.type === 'generate').length, 0);
  await restored.dispose();
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as tick } from 'node:timers/promises';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { createAgentChatSession } from '../inference/src/agents/agentChatSession.js';
import { AgentRecordStore } from '../../peercompute/src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../peercompute/src/peercompute/agents/AgentRuntime.js';

const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const head = (agentId = 'one', mode = 'local-only') => ({ agentId, identity: { name: agentId }, revision: 1,
  status: 'waiting', policy: { inferenceMode: mode } });
const image = () => ({ width: 1, height: 1, channels: 4, data: new Uint8Array([12, 34, 56, 255]) });
function fixture(overrides = {}, onChange) {
  const listeners = new Set(), calls = [], heads = new Map([['one', head()], ['two', head('two', 'network-assisted')]]);
  const controller = {
    async list() { calls.push('list'); return [...heads.values()]; },
    async get(id) { return heads.get(id); }, async events() { return []; },
    async getAttachment(id, attachmentId) { return { agentId: id, id: attachmentId, ...image() }; },
    async run(id, input) { calls.push({ id, input }); return { agentId: id, requestId: 'request', result: { text: 'Reply', finishReason: 'stop' }, route: { local: true } }; },
    async cancel(id) { calls.push({ cancel: id }); return true; },
    async resume(id) { const next = { ...heads.get(id), status: 'waiting' }; heads.set(id, next); return next; },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    ...overrides,
  };
  const session = createAgentChatSession({ controller, onChange });
  return { session, controller, calls, heads, listeners, emit: (event) => { for (const listener of listeners) listener(event); } };
}

test('refresh coalesces reads, discards pre-mutation snapshots and returns isolated heads', async () => {
  const pending = deferred(), updates = []; let reads = 0;
  const f = fixture({ async list() { return ++reads === 1 ? pending.promise : [head('new')]; } }, (heads) => updates.push(heads));
  assert.equal(reads, 0, 'constructing a bridge does not start reads before the UI assigns it');
  const first = f.session.refresh(), joined = f.session.refresh(); assert.equal(first, joined);
  await tick(); f.emit({ type: 'changed', agentId: 'new' }); pending.resolve([head('stale')]);
  const records = await first;
  assert.equal(reads, 2); assert.deepEqual(updates.map((items) => items[0].agentId), ['new']);
  records[0].identity.name = 'mutated'; const snapshot = f.session.list(); snapshot[0].status = 'paused';
  assert.equal(f.session.list()[0].identity.name, 'new'); assert.equal(f.session.list()[0].status, 'waiting');
  f.session.dispose();
});

test('history is paged and private-channel-only, including old unscoped visitor failures', async () => {
  const events = Array.from({ length: 256 }, (_, index) => ({ agentId: 'one', sequence: index + 1,
    type: 'result', text: `saved-${index}` }));
  events[0] = { ...events[0], type: 'request', operationId: 'visitor', conversationId: 'visitor:peer', text: 'Private visitor prompt' };
  events[1] = { ...events[1], type: 'failed', operationId: 'visitor', text: 'Visitor failure' };
  events[100] = { ...events[100], conversationId: 'other-world', text: 'World history' };
  const cursors = [];
  const f = fixture({ async events(id, { after, limit }) {
    assert.equal(id, 'one'); assert.equal(limit, 100); cursors.push(after);
    return events.filter((event) => event.sequence > (after ?? 0)).slice(0, limit);
  } });
  const saved = await f.session.history('one');
  assert.deepEqual(cursors, [undefined, 100, 200]); assert.equal(saved.length, 253);
  assert(saved.every((event) => !['Private visitor prompt', 'Visitor failure', 'World history'].includes(event.text)));
  saved[0].text = 'changed'; assert.notEqual(events[2].text, 'changed'); f.session.dispose();
});

test('history rejects a foreign identity or repeated cursor instead of mixing or looping', async () => {
  for (const events of [[{ agentId: 'two', sequence: 1 }], [{ agentId: 'one', sequence: 1 }, { agentId: 'one', sequence: 1 }]]) {
    const f = fixture({ async events() { return events; } });
    await assert.rejects(f.session.history('one'), /another agent|cursor/); f.session.dispose();
  }
  let calls = 0;
  const f = fixture({ async events(id, { after = 0 }) { calls++; return Array.from({ length: 100 }, (_, i) => ({ agentId: id, sequence: after + i + 1 })); } });
  assert.equal((await f.session.history('one')).length, 300); assert.equal(calls, 3); f.session.dispose();
});

test('attachment reads are agent-scoped, bounded, copied and cancellable during a late read', async () => {
  const source = { id: 'image', agentId: 'one', ...image() }, pending = deferred();
  const f = fixture({ async getAttachment() { return source; } });
  const pixels = await f.session.attachment('one', 'image'); pixels.data.fill(0); assert.equal(source.data[0], 12);
  source.agentId = 'two'; await assert.rejects(f.session.attachment('one', 'image'), /another agent/);
  source.agentId = 'one'; source.width = 1025; await assert.rejects(f.session.attachment('one', 'image'), /RGBA/);
  f.controller.getAttachment = () => pending.promise;
  const abort = new AbortController(), reading = f.session.attachment('one', 'image', { signal: abort.signal });
  await tick(); abort.abort(); await assert.rejects(reading, { name: 'AbortError' });
  pending.reject(new Error('Late storage failure')); await tick(); f.session.dispose();
});

test('run sends only the current task, snapshots pixels, projects streams and flattens the acknowledged result', async () => {
  const gate = deferred(), pixels = image(), tokens = [], progress = []; let received;
  const f = fixture({ async get() { await gate.promise; return head(); }, async run(id, input) {
    received = input;
    input.onEvent({ type: 'token', agentId: 'two', text: 'wrong agent' });
    input.onEvent({ type: 'token', agentId: id, text: 'Reply' });
    input.onEvent({ type: 'progress', agentId: id, event: { type: 'accepted', route: { local: true } } });
    return { agentId: id, requestId: 'actual', result: { text: 'Reply', finishReason: 'stop' }, route: { local: true } };
  } });
  const running = f.session.run('one', { task: 'image-text-to-text', prompt: 'Describe this', image: pixels,
    messages: [{ role: 'user', content: 'Direct chat secret' }], conversationId: 'visitor:someone',
    onToken: (value) => tokens.push(value), onProgress: (value) => progress.push(value) });
  pixels.data.fill(0); gate.resolve(); const result = await running;
  assert.equal(received.image.data[0], 12); assert.equal(received.messages, undefined); assert.equal(received.conversationId, undefined);
  assert.deepEqual(tokens, ['Reply']); assert.equal(progress[0].type, 'accepted');
  assert.deepEqual(result, { text: 'Reply', finishReason: 'stop', route: { local: true }, agentId: 'one', requestId: 'actual' }); f.session.dispose();
});

test('voice rereads current policy and rejects paused, unsaved, recovering or busy agents before capture', async () => {
  const f = fixture();
  assert.equal(await f.session.speechTarget('one'), 'local-only');
  f.heads.set('one', head('one', 'network-assisted')); assert.equal(await f.session.speechTarget('one'), 'mixed');
  f.heads.set('one', head()); assert.equal(await f.session.speechTarget('one'), 'local-only');
  for (const [patch, code] of [[{ status: 'paused' }, 'ERR_AGENT_PAUSED'], [{ activity: { unsaved: true } }, 'ERR_AGENT_UNSAVED'],
    [{ recoveryRequired: true }, 'ERR_AGENT_RECOVERY_REQUIRED'], [{ activity: { status: 'queued' } }, 'ERR_AGENT_BUSY'], [{ status: 'running' }, 'ERR_AGENT_BUSY']]) {
    f.heads.set('one', { ...head(), ...patch }); await assert.rejects(f.session.speechTarget('one'), { code });
    await assert.rejects(f.session.run('one', { prompt: 'Blocked' }), { code });
  }
  f.heads.delete('one'); await assert.rejects(f.session.speechTarget('one'), { code: 'ERR_AGENT_NOT_FOUND' });
  assert.equal(f.calls.length, 0); f.session.dispose();
});

test('resume is explicit, never sends a prompt, and failed checkpoint errors do not create results', async () => {
  const f = fixture({ async run() { throw Object.assign(new Error('Not saved: quota'), { code: 'ERR_AGENT_UNSAVED' }); } });
  f.heads.set('one', { ...head(), status: 'paused' });
  await assert.rejects(f.session.run('one', { prompt: 'No replay' }), { code: 'ERR_AGENT_PAUSED' });
  await f.session.resume('one'); assert.equal(f.session.list()[0].status, 'waiting');
  assert.equal(f.calls.filter((call) => typeof call === 'object').length, 0);
  await assert.rejects(f.session.run('one', { prompt: 'Try' }), { code: 'ERR_AGENT_UNSAVED' }); f.session.dispose();
});

test('dispose invalidates pending reads and subscriptions but leaves shared runtime execution ownership with the caller', async () => {
  const pending = deferred(), generated = deferred(); let cancelled = 0, changed = 0;
  const f = fixture({ list: () => pending.promise, run: () => generated.promise, cancel() { cancelled++; } }, () => { changed++; });
  const running = f.session.run('one', { prompt: 'Wait' }); await tick();
  const reading = f.session.refresh(); await tick(); f.session.dispose(); f.session.dispose();
  await assert.rejects(reading, { name: 'AbortError' }); assert.equal(f.listeners.size, 0);
  pending.resolve([head('late')]); generated.resolve({ result: { text: 'Saved completion' }, route: { local: true } });
  assert.equal((await running).text, 'Saved completion'); await tick();
  assert.equal(changed, 0); assert.equal(cancelled, 0); assert.deepEqual(f.session.list(), []);
});

async function persistentFixture(t) {
  const database = new IDBFactory(), held = new Set(), calls = [];
  const locks = { async request(name, _options, callback) {
    if (held.has(name)) return callback(null); held.add(name);
    try { return await callback({ name }); } finally { held.delete(name); }
  } };
  const store = new AgentRecordStore({ name: 'unified-chat', indexedDBImpl: database, keyRange: IDBKeyRange, lockManager: locks });
  await store.open();
  const candidate = { key: 'local:model', manifestCid: 'model', sessionId: 'session', local: true, available: true,
    runtime: 'transformers.js', task: 'image-text-to-text', modalities: ['text', 'image'], outputModalities: ['text'] };
  const inference = { async listCandidates(options) { calls.push({ list: options }); return [candidate]; },
    async generate(_candidate, input, callbacks) { calls.push({ input }); callbacks.onToken?.('Saved'); return { text: 'Saved reply', finishReason: 'stop' }; },
    async cancel() {} };
  const controller = new AgentRuntime({ store, inference }), session = createAgentChatSession({ controller });
  t.after(async () => { session.dispose(); await controller.dispose(); await store.destroy(); });
  return { database, locks, store, controller, session, calls, inference };
}

test('real persistence restores private conversation and images, without direct, other-agent or world visitor context', async (t) => {
  const f = await persistentFixture(t), one = await f.controller.create({ name: 'Ada', instructions: 'Be kind.' }), two = await f.controller.create({ name: 'Bea' });
  await f.session.resume(one.agentId); await f.session.resume(two.agentId);
  await f.session.run(one.agentId, { prompt: 'Private first', image: image() });
  await f.session.run(two.agentId, { prompt: 'Other agent secret' });
  await f.controller.run(one.agentId, { prompt: 'Visitor secret', conversationId: 'visitor:peer' });
  f.session.dispose();
  const restartedStore = new AgentRecordStore({ name: 'unified-chat', indexedDBImpl: f.database, keyRange: IDBKeyRange, lockManager: f.locks });
  await restartedStore.open(); const restartedController = new AgentRuntime({ store: restartedStore, inference: f.inference });
  const restored = createAgentChatSession({ controller: restartedController });
  t.after(async () => { restored.dispose(); await restartedController.dispose(); await restartedStore.destroy(); });
  const saved = await restored.history(one.agentId), request = saved.find((event) => event.type === 'request');
  assert.equal(request.text, 'Private first'); assert(!saved.some((event) => /secret/.test(event.text)));
  assert.deepEqual((await restored.attachment(one.agentId, request.inputAttachmentId)).data, image().data);
  await restored.run(one.agentId, { prompt: 'Private follow-up', messages: [{ role: 'user', content: 'Direct secret' }] });
  const packed = f.calls.filter((call) => call.input).at(-1).input.messages;
  assert(packed.some((message) => message.content === 'Private first')); assert(packed.some((message) => message.content === 'Saved reply'));
  assert(!packed.some((message) => /secret/.test(message.content)));
  await restored.run(one.agentId, { prompt: 'New image', image: image() });
  assert(!f.calls.filter((call) => call.input).at(-1).input.messages.some((message) => message.content === 'Private first'));
});

test('cancel waits for real agent inference cleanup and keeps the per-agent run lock until acknowledgement', async (t) => {
  const f = await persistentFixture(t), agent = await f.controller.create({ name: 'Ada' }); await f.session.resume(agent.agentId);
  const started = deferred(), cleanup = deferred();
  f.inference.generate = async (_candidate, _input, { signal }) => {
    started.resolve(); await new Promise((done) => signal.addEventListener('abort', done, { once: true }));
    await cleanup.promise; throw new DOMException('Cancelled', 'AbortError');
  };
  const running = f.session.run(agent.agentId, { prompt: 'Wait' }); running.catch(() => {}); await started.promise;
  let settled = false; const cancelling = f.session.cancel(agent.agentId).then(() => { settled = true; });
  await tick(); assert.equal(settled, false);
  await assert.rejects(f.store.withRun(agent.agentId, () => {}), { code: 'ERR_AGENT_BUSY' });
  cleanup.resolve(); await cancelling; await assert.rejects(running, { name: 'AbortError' });
  const saved = await f.session.history(agent.agentId); assert(saved.some((event) => event.type === 'cancelled'));
  assert(!saved.some((event) => event.type === 'result'));
});

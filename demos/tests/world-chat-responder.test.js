import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createWorldChatResponder, WORLD_CHAT_LIMITS as L } from '../shared/agents/WorldChatResponder.js';

const body = (id = 'ada', extra = {}) => ({ key: `local:${id}`, agentId: id, name: id, local: true,
  respondToWorldChat: true, status: 'idle', ...extra });
const message = (id = 'one', extra = {}) => ({ id, peerId: 'authenticated-peer', name: 'Human', text: `Public ${id}`, ...extra });
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const until = async check => { for (let i = 0; i < 100; i++) { if (check()) return; await delay(2); } throw Error('Condition did not settle'); };
function fixture(t, options = {}) {
  const state = { bodies: [body()], replies: [], publications: [], statuses: [] };
  state.responder = createWorldChatResponder({ getResidents: () => state.bodies,
    respond: async (...args) => { state.replies.push(args); return 'A short reply'; },
    publish: async (...args) => { state.publications.push(args); },
    onStatus: value => state.statuses.push(value), cooldownMs: 0, ...options });
  t.after(() => state.responder.dispose()); return state;
}

test('only opted local residents answer humans; public context contains no private metadata and duplicates never run', async t => {
  const f = fixture(t); f.bodies.push(body('remote', { local: false }), body('disabled', { respondToWorldChat: false }), body('paused', { status: 'paused' }));
  const human = message('one', { privateHistory: 'never copy', instruction: 'not an instruction' });
  assert.equal(f.responder.receive({ ...human, agentId: 'other-agent' }).reason, 'resident-message');
  assert.equal(f.responder.receive(human).queued, 1);
  assert.equal(f.responder.receive(human).reason, 'duplicate');
  await until(() => f.publications.length === 1);
  assert.equal(f.replies.length, 1); assert.equal(f.replies[0][0].agentId, 'ada');
  assert.deepEqual(f.replies[0][1], message());
  assert.deepEqual(f.replies[0][2].context, { kind: 'public-room-chat', messages: [message()] });
  assert(Object.isFrozen(f.replies[0][2].context.messages));
  assert.deepEqual(f.publications[0][0], { agentId: 'ada', name: 'ada', text: 'A short reply' });
  assert.equal(f.publications[0][1].signal, f.replies[0][2].signal);
});

test('one global response and one latest pending message per bounded resident, with no replay of replaced work', async t => {
  const gate = deferred(), calls = [], publications = [];
  const f = fixture(t, { respond: async (resident, input) => { calls.push({ resident: resident.agentId, id: input.id }); if (calls.length === 1) await gate.promise; return 'Reply'; },
    publish: async output => publications.push(output) });
  f.bodies = Array.from({ length: 40 }, (_, i) => body(`resident${i}`));
  f.responder.receive(message('first')); await until(() => calls.length === 1);
  for (let i = 0; i < 100; i++) f.responder.receive(message(`queued${i}`));
  assert.equal(f.responder.getStatus().residents, L.residents);
  assert.equal(f.responder.getStatus().pending, L.residents);
  assert.equal(calls.length, 1);
  gate.resolve(); await until(() => !f.responder.getStatus().active && !f.responder.getStatus().pending);
  assert.equal(calls.length, L.residents + 1);
  assert(calls.slice(1).every(call => call.id === 'queued99'));
  assert.equal(publications.length, calls.length);
});

test('unavailable queues without dispatch; availability changes from its own response do not cancel it', async t => {
  let f;
  f = fixture(t, { respond: async (_resident, _input, { signal }) => {
    f.bodies[0].available = false; f.bodies[0].status = 'thinking'; f.responder.sync();
    assert.equal(signal.aborted, false); return 'Ready';
  } });
  f.bodies[0].available = false;
  f.responder.receive(message('old')); f.responder.receive(message('latest'));
  await delay(5); assert.equal(f.responder.getStatus().active, null); assert.equal(f.responder.getStatus().pending, 1);
  f.bodies[0].available = true; f.responder.sync(); await until(() => f.publications.length === 1);
  assert.equal(f.publications[0][1].signal.aborted, false);
});

test('cooldown preserves only the latest request and drains after the bounded interval', async t => {
  const f = fixture(t, { cooldownMs: 25 });
  f.responder.receive(message('first')); await until(() => f.publications.length === 1);
  f.responder.receive(message('second')); f.responder.receive(message('third'));
  assert.equal(f.publications.length, 1); assert.equal(f.responder.getStatus().pending, 1);
  await until(() => f.publications.length === 2);
  assert.deepEqual(f.replies.map(args => args[1].id), ['first', 'third']);
});

test('a manual operation claiming availability before dispatch retains the latest queued request', async t => {
  const f = fixture(t);
  f.responder.receive(message('first'));
  f.bodies[0].available = false;
  f.responder.receive(message('latest'));
  await delay(5);
  assert.equal(f.replies.length, 0); assert.equal(f.responder.getStatus().pending, 1);
  f.bodies[0].available = true; f.responder.sync();
  await until(() => f.publications.length === 1);
  assert.deepEqual(f.replies.map(args => args[1].id), ['latest']);
});

test('disable, removal, paused and ownership loss cancel without publishing a late result', async t => {
  for (const change of [f => { f.bodies[0].respondToWorldChat = false; }, f => { f.bodies = []; },
    f => { f.bodies[0].status = 'paused'; }, f => { f.bodies[0].local = false; }]) {
    const gate = deferred(); let signal;
    const f = fixture(t, { respond: async (_body, _message, options) => { signal = options.signal; await gate.promise; return 'Too late'; } });
    f.responder.receive(message()); await until(() => signal);
    f.responder.receive(message('pending')); change(f); f.responder.sync();
    assert.equal(signal.aborted, true); assert.equal(f.responder.getStatus().pending, 0);
    assert(f.responder.getStatus().active, 'Retain ownership until callback cleanup settles');
    gate.resolve(); await until(() => !f.responder.getStatus().active);
    assert.equal(f.publications.length, 0);
  }
});

test('dispatch revalidates opt-in even without a preceding sync, and observer revocation prevents publish', async t => {
  const gate = deferred(); let started = false;
  const f = fixture(t, { respond: async () => { started = true; await gate.promise; return 'Late'; } });
  f.responder.receive(message()); await until(() => started); f.bodies[0].respondToWorldChat = false;
  gate.resolve(); await until(() => !f.responder.getStatus().active); assert.equal(f.publications.length, 0);
  let g;
  g = fixture(t, { onStatus: status => { if (status.status === 'publishing') g.bodies = []; } });
  g.responder.receive(message()); await until(() => g.replies.length === 1 && !g.responder.getStatus().active);
  assert.equal(g.publications.length, 0);
});

test('disable then re-enable never revives cancelled work; cleanup must settle before a new response', async t => {
  const gate = deferred(), calls = [];
  const f = fixture(t, { respond: async (_body, input) => { calls.push(input.id); if (calls.length === 1) await gate.promise; return 'Reply'; } });
  f.responder.receive(message('old')); await until(() => calls.length === 1);
  f.bodies[0].respondToWorldChat = false; f.responder.sync();
  f.bodies[0].respondToWorldChat = true; f.responder.sync(); f.responder.receive(message('new'));
  assert.equal(calls.length, 1); gate.resolve(); await until(() => f.publications.length === 1);
  assert.deepEqual(calls, ['old', 'new']);
});

test('dispose aborts publication, waits actual cleanup, clears bounded state and blocks future work', async () => {
  const gate = deferred(); let signal;
  const responder = createWorldChatResponder({ getResidents: () => [body()], respond: async () => 'Reply',
    publish: async (_output, options) => { signal = options.signal; await gate.promise; }, cooldownMs: 0 });
  responder.receive(message()); await until(() => signal);
  let closed = false; const closing = responder.dispose().then(() => { closed = true; });
  assert.equal(signal.aborted, true); await delay(5); assert.equal(closed, false);
  assert.equal(responder.receive(message('new')).reason, 'closed');
  gate.resolve(); await closing;
  assert.deepEqual(responder.getStatus(), { closed: true, active: null, pending: 0, residents: 0, seen: 0, contextMessages: 0, contextBytes: 0 });
});

test('errors never automatically replay; input/output and public-context size are bounded', async t => {
  const f = fixture(t, { respond: async () => '😀'.repeat(513) });
  assert.equal(f.responder.receive(message('bad', { text: '\ud800' })).reason, 'invalid-message');
  f.responder.receive(message()); await until(() => f.statuses.some(status => status.status === 'error'));
  assert.equal(f.publications.length, 0); f.responder.sync(); await delay(5);
  assert.equal(f.statuses.filter(status => status.status === 'responding').length, 1);
  const g = fixture(t); g.bodies[0].available = false;
  for (let i = 0; i < 30; i++) g.responder.receive(message(`long${i}`, { text: '😀'.repeat(512) }));
  assert(g.responder.getStatus().contextMessages <= L.contextMessages);
  assert(g.responder.getStatus().contextBytes <= L.contextBytes);
  g.bodies[0].available = true; g.responder.sync(); await until(() => g.publications.length === 1);
  assert.equal(g.replies[0][1].id, 'long29');
  assert.equal(g.replies[0][2].context.messages.at(-1).id, 'long29');
});

test('dedup window fails closed at its cap and expires by clock without accepting duplicate payload changes', async t => {
  let clock = 0;
  const f = fixture(t, { now: () => clock }); f.bodies[0].available = false;
  for (let i = 0; i < L.seenEntries; i++) assert.equal(f.responder.receive(message(`id${i}`)).accepted, true);
  assert.equal(f.responder.receive(message('id0', { text: 'Changed duplicate' })).reason, 'duplicate');
  assert.equal(f.responder.receive(message('overflow')).reason, 'dedup-full');
  assert.equal(f.responder.getStatus().seen, L.seenEntries);
  clock += L.seenMs;
  assert.equal(f.responder.receive(message('overflow')).accepted, true);
  assert.equal(f.responder.getStatus().seen, 1);
});

test('failed publication is reported once without retry and malformed resident enumeration fails closed', async t => {
  let publications = 0;
  const f = fixture(t, { publish: async () => { publications++; throw Error('Partial delivery is not retry authorization'); } });
  f.responder.receive(message()); await until(() => f.statuses.some(status => status.status === 'error'));
  f.responder.sync(); await delay(5); assert.equal(publications, 1);
  const g = fixture(t, { getResidents: () => { throw Error('Unavailable owner'); } });
  assert.equal(g.responder.receive(message()).queued, 0); assert.equal(g.replies.length, 0);
  const h = fixture(t, { getResidents: async () => { throw Error('Invalid async callback'); } });
  assert.equal(h.responder.receive(message()).queued, 0); await delay(5);
  assert.equal(h.replies.length, 0);
});

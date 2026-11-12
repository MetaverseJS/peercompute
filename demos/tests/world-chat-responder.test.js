import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createWorldChatResponder, WORLD_CHAT_LIMITS as L } from '../shared/agents/WorldChatResponder.js';

const body = (id = 'ada', extra = {}) => ({ key: `local:${id}`, agentId: id, name: id, local: true,
  ownerPeerId: 'local-owner', respondToWorldChat: true, status: 'idle', ...extra });
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
  assert.equal(f.responder.receive({ ...human, agentId: 'invalid agent' }).reason, 'invalid-message');
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
  assert.equal(publications.length, calls.length - 1, 'Superseded in-flight human answer is never published');
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

test('two residents wait through contested inference and each answer the same human once', async t => {
  let firstBusy = true;
  const calls = [], output = [];
  const f = fixture(t, { retryMs: 10, respond: async (resident, incoming) => {
    calls.push([resident.agentId, incoming.id]);
    if (resident.agentId === 'ada' && firstBusy) { firstBusy = false; throw Object.assign(Error('Peer is busy'), { code: 'ERR_INFERENCE_BUSY' }); }
    return `Hello from ${resident.agentId}`;
  }, publish: async message => output.push(message) });
  f.bodies.push(body('bea')); f.responder.receive(message('hello', { text: 'Hello' }));
  await until(() => output.length === 2);
  assert.deepEqual(output.map(x => x.agentId).sort(), ['ada', 'bea']);
  assert(calls.every(([, id]) => id === 'hello'));
  assert.equal(f.statuses.filter(x => x.status === 'error' || x.status === 'cancelled').length, 0);
  assert(f.statuses.some(x => x.status === 'waiting'));
});

test('typed deferral preserves a conversation turn; publication failure is never retried', async t => {
  let attempts = 0, publishes = 0;
  const f = fixture(t, { retryMs: 10, respond: async () => ++attempts < 4 ? { status: 'waiting', reason: 'Queue full' } : 'Ready',
    publish: async () => { publishes++; throw Object.assign(Error('Delivery unknown'), { code: 'ERR_INFERENCE_BUSY' }); } });
  f.responder.receive(message('wait'));
  await until(() => publishes === 1); await delay(30);
  assert.equal(attempts, 4); assert.equal(publishes, 1);
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

test('resident messages are remembered without opening a discussion or triggering inference', async t => {
  const f = fixture(t);
  assert.deepEqual(f.responder.receive(message('resident-only', { agentId: 'bert' })), { accepted: true, queued: 0 });
  await delay(5); assert.equal(f.replies.length, 0);
  assert.equal(f.responder.getStatus().contextMessages, 1);
  f.responder.receive(message('human'));
  await until(() => f.publications.length === 1);
  assert.deepEqual(f.replies[0][2].context.messages.map(item => item.id), ['resident-only', 'human']);
  assert.equal(f.replies[0][2].context.messages[0].agentId, 'bert');
});

test('two local residents hear current room replies, keep the pending human question, and stop after bounded turns', async t => {
  let f, next = 0; const calls = [], outputs = [];
  f = fixture(t, {
    respond: async (resident, incoming, { context }) => {
      calls.push({ resident: resident.agentId, incoming, context });
      return `${resident.name} contribution ${calls.length}`;
    },
    publish: async output => {
      outputs.push(output);
      f.responder.receive({ ...output, peerId: 'local-owner', id: `echo${++next}` });
    },
  });
  f.bodies.push(body('bert'));
  f.responder.receive(message('human'));
  await until(() => calls.length === 4 && !f.responder.getStatus().active);
  assert.deepEqual(calls.map(call => call.resident), ['ada', 'bert', 'ada', 'bert']);
  assert.equal(calls[0].incoming.agentId, undefined);
  assert.equal(calls[1].incoming.agentId, undefined, 'Ada must not replace Bert’s pending human question');
  assert.deepEqual(calls[1].context.messages.map(item => item.text), ['Public human', 'ada contribution 1']);
  assert.equal(calls[2].incoming.agentId, 'bert'); assert.equal(calls[3].incoming.agentId, 'ada');
  assert.equal(calls[3].context.messages.at(-1).text, 'ada contribution 3');
  assert.equal(outputs.length, 4); assert.equal(f.responder.getStatus().pending, 0);
  f.responder.receive(message('later-resident', { agentId: 'visitor-agent', text: 'Keep talking' }));
  await delay(5); assert.equal(calls.length, 4, 'Resident messages never renew spent budgets');
});

test('two independent peer responders exchange resident turns without an endless network echo', async t => {
  const peers = [], calls = [], outputs = [];
  for (const owner of ['alpha', 'beta']) {
    const f = fixture(t, {
      respond: async (resident, incoming, { context }) => {
        calls.push({ owner, incoming, context }); return `${resident.name} reply ${calls.length}`;
      },
      publish: async output => {
        const event = { ...output, peerId: owner, id: `network${outputs.length}` }; outputs.push(event);
        for (const peer of peers) {
          peer.responder.receive(event);
          assert.equal(peer.responder.receive(event).reason, 'duplicate');
        }
      },
    });
    f.bodies = [body(owner, { ownerPeerId: owner })]; peers.push(f);
  }
  for (const peer of peers) peer.responder.receive(message('human'));
  await until(() => outputs.length === 4 && peers.every(peer => !peer.responder.getStatus().active));
  for (const owner of ['alpha', 'beta']) {
    const own = calls.filter(call => call.owner === owner), other = owner === 'alpha' ? 'beta' : 'alpha';
    assert.equal(own.length, 2); assert.equal(own[1].incoming.agentId, other);
    assert(own[1].context.messages.some(item => item.agentId === other && item.peerId === other));
  }
  assert(peers.every(peer => peer.responder.getStatus().pending === 0));
  await delay(10); assert.equal(outputs.length, 4);
});

test('self echoes are retained but do not respond; matching agent IDs on another owner are distinct speakers', async t => {
  const f = fixture(t);
  f.responder.receive(message('human')); await until(() => f.publications.length === 1);
  const echo = message('self', { agentId: 'ada', peerId: 'local-owner' });
  assert.equal(f.responder.receive(echo).queued, 0);
  assert.equal(f.responder.getStatus().contextMessages, 2);
  assert.equal(f.responder.receive({ ...echo, id: 'remote', peerId: 'different-owner' }).queued, 1);
  await until(() => f.replies.length === 2 && !f.responder.getStatus().active);
  assert.equal(f.replies[1][1].peerId, 'different-owner');
});

test('repeated automatic follow-ups are suppressed without retry, while identical human answers remain valid', async t => {
  const f = fixture(t);
  f.responder.receive(message('human')); await until(() => f.publications.length === 1);
  f.responder.receive(message('resident', { agentId: 'bert' }));
  await until(() => f.statuses.some(status => status.reason === 'repeated-followup'));
  assert.equal(f.replies.length, 2); assert.equal(f.publications.length, 1);
  f.responder.sync(); await delay(5); assert.equal(f.replies.length, 2);
  f.responder.receive(message('next-human')); await until(() => f.publications.length === 2);
  assert.equal(f.publications[0][0].text, f.publications[1][0].text);
});

test('joining and re-enabling residents do not replenish this discussion’s response budgets', async t => {
  const f = fixture(t);
  f.responder.receive(message('human')); await until(() => f.publications.length === 1);
  f.responder.receive(message('resident1', { agentId: 'bert' }));
  await until(() => f.replies.length === 2 && !f.responder.getStatus().active);
  f.bodies[0].respondToWorldChat = false; f.responder.sync();
  f.bodies[0].respondToWorldChat = true; f.bodies.push(body('newcomer')); f.responder.sync();
  assert.equal(f.responder.receive(message('resident2', { agentId: 'bert' })).queued, 0);
  await delay(5); assert.equal(f.replies.length, 2);
  f.bodies = []; f.responder.sync();
  f.bodies = [body(), body('newcomer')]; f.responder.sync();
  assert.equal(f.responder.receive(message('resident-after-rejoin', { agentId: 'bert' })).queued, 0);
  f.responder.receive(message('next-human'));
  await until(() => f.replies.length === 4 && !f.responder.getStatus().active);
  assert.deepEqual(f.replies.slice(2).map(args => args[0].agentId).sort(), ['ada', 'newcomer']);
});

test('discussion expiry permits a slow initial human answer and its queued human recipients, but no follow-ups', async t => {
  const gate = deferred(); let firstSignal;
  const f = fixture(t, { discussionMs: 25, respond: async (resident, incoming, { signal }) => {
    f.replies.push([resident, incoming]);
    if (f.replies.length === 1) { firstSignal = signal; await gate.promise; }
    return `Answer ${f.replies.length}`;
  } });
  f.bodies.push(body('bert'));
  f.responder.receive(message('human')); await until(() => firstSignal);
  await delay(35); assert.equal(firstSignal.aborted, false, 'Slow human inference must not time out with the social window');
  assert.equal(f.responder.receive(message('late-resident', { agentId: 'visitor-agent' })).queued, 0);
  gate.resolve(); await until(() => f.publications.length === 2 && !f.responder.getStatus().active);
  assert.deepEqual(f.replies.map(args => args[1].id), ['human', 'human']);
  assert.equal(f.responder.receive(message('later-resident', { agentId: 'visitor-agent' })).queued, 0);
});

test('expiry suppresses a late automatic follow-up without aborting or releasing dispatched inference', async t => {
  const gate = deferred(); let followupSignal, mayAct;
  const f = fixture(t, { discussionMs: 35, respond: async (_resident, incoming, { signal, isCurrent }) => {
    if (incoming.agentId) { followupSignal = signal; await gate.promise; mayAct = isCurrent(); }
    return incoming.id;
  } });
  f.responder.receive(message('human')); await until(() => f.publications.length === 1);
  f.responder.receive(message('resident', { agentId: 'bert' })); await until(() => followupSignal);
  await delay(45);
  assert.equal(followupSignal.aborted, false, 'Aborting inference would persistently pause AgentRuntime');
  assert(f.responder.getStatus().active);
  gate.resolve(); await until(() => !f.responder.getStatus().active);
  assert.equal(f.publications.length, 1);
  assert.equal(f.statuses.some(status => status.status === 'error'), false);
  assert.equal(mayAct, false, 'The host must suppress physical actions as well as late text');
});

test('a superseded active turn cannot publish late or spend the new human discussion’s budget', async t => {
  const gate = deferred(), calls = []; let staleSignal;
  const f = fixture(t, { respond: async (_resident, incoming, { signal }) => {
    calls.push(incoming.id);
    if (incoming.id === 'old') { staleSignal = signal; await gate.promise; }
    return incoming.id;
  } });
  f.responder.receive(message('old')); await until(() => staleSignal);
  f.responder.receive(message('new')); assert.equal(staleSignal.aborted, false, 'Supersession must not pause the persisted agent');
  assert.equal(calls.length, 1, 'Superseded inference keeps the single slot until cleanup');
  gate.resolve(); await until(() => f.publications.length === 1 && !f.responder.getStatus().active);
  assert.equal(f.publications[0][0].text, 'new');
  f.responder.receive(message('followup', { agentId: 'bert' }));
  await until(() => f.publications.length === 2 && !f.responder.getStatus().active);
  assert.deepEqual(calls, ['old', 'new', 'followup']);
  assert.equal(f.responder.receive(message('exhausted', { agentId: 'bert' })).queued, 0);
  assert.equal(f.statuses.some(status => status.status === 'error'), false);
});

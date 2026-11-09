import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createWorldChatResponder } from '../shared/agents/WorldChatResponder.js';
import { normalizeChatInput, ROOM_SOCIAL_LIMITS } from '../shared/chat/roomChatContracts.js';
import { worldPublicMessage } from '../shared/agents/WorldConversationContext.js';

const wall = 1000000;
const social = extra => ({ rootId: 'greeting-1', rootPeerId: 'alpha', rootAgentId: 'ada', targetPeerId: 'beta',
  targetAgentId: 'bert', startedAt: wall, expiresAt: wall + 60000, turn: 0, ...extra });
const message = extra => ({ id: 'message-1', peerId: 'alpha', agentId: 'ada', name: 'Ada', text: 'Hello Bert', social: social(), ...extra });
const body = (id = 'bert', extra = {}) => ({ key: id, agentId: id, name: id, local: true,
  ownerPeerId: 'beta', initiateConversations: true, respondToWorldChat: false, status: 'idle', ...extra });
const until = async check => { for (let i = 0; i < 100; i++) { if (check()) return; await delay(2); } throw Error('Condition did not settle'); };
function fixture(t, options = {}) {
  const f = { bodies: [body(), body('unrelated')], calls: [], outputs: [], statuses: [], delivered: [], clock: 0 };
  f.responder = createWorldChatResponder({ getResidents: () => f.bodies, now: () => f.clock, wallNow: () => wall + f.clock,
    cooldownMs: 0, respond: async (body, input, options) => { f.calls.push({ body, input, options }); return 'Hi Ada'; },
    publish: async (output, options) => { f.outputs.push(output); return { delivery: { status: 'delivered' } }; },
    onDelivered: value => f.delivered.push(value), onStatus: value => f.statuses.push(value), ...options });
  t.after(() => f.responder.dispose()); return f;
}

test('social metadata strictly validates pair, lifetime, turns and prohibits human autonomous roots', () => {
  const input = { agentId: 'ada', text: 'Hello', social: social() };
  assert.deepEqual(normalizeChatInput(input).social, social());
  assert(Object.isFrozen(normalizeChatInput(input).social));
  for (const invalid of [{ ...input, agentId: undefined }, { ...input, social: { ...social(), injected: 'secret' } },
    ...[{ turn: 4 }, { turn: -1 }, { expiresAt: wall + 60001 }, { startedAt: wall + 60000 },
      { targetPeerId: 'alpha', targetAgentId: 'ada' }, { targetAgentId: undefined, turn: 1 }]
      .map(extra => ({ ...input, social: social(extra) }))]) assert.throws(() => normalizeChatInput(invalid));
  assert.deepEqual(worldPublicMessage({ ...message(), hidden: 'private' }).social, social());
  assert.equal(worldPublicMessage(message()).hidden, undefined);
});

test('targeted social replies preserve root/deadline and report actual publication result; normal humans remain opt-in', async t => {
  const f = fixture(t);
  assert.equal(f.responder.receive(message()).queued, 1);
  await until(() => f.delivered.length === 1);
  assert.equal(f.calls[0].body.agentId, 'bert');
  assert.deepEqual(f.outputs[0].social, social({ turn: 1 }));
  assert.equal(f.delivered[0].result.delivery.status, 'delivered');
  assert.equal(f.responder.receive({ id: 'human', peerId: 'person', name: 'Person', text: 'Hey all' }).queued, 0);
});

test('author mismatches, unknown roots, changed deadlines, participant switches and root replays never replenish budgets', async t => {
  const f = fixture(t);
  assert.equal(f.responder.receive(message({ peerId: 'impostor' })).reason, 'invalid-message');
  assert.equal(f.responder.receive(message({ social: social({ turn: 2 }) })).queued, 0);
  f.responder.receive(message({ id: 'root' })); await until(() => f.outputs.length === 1);
  for (const [index, change] of [{ expiresAt: wall + 50000 }, { targetAgentId: 'unrelated' }, { turn: 0 }, { turn: 2 }].entries()) {
    assert.equal(f.responder.receive(message({ id: `bad-${index}`, social: social(change) })).queued, 0);
  }
  await delay(5); assert.equal(f.calls.length, 1);
});

test('quiet social result ends follow-ups without publication or errors', async t => {
  const f = fixture(t, { respond: async () => '' });
  f.responder.receive(message()); await until(() => f.statuses.some(item => item.reason === 'quiet'));
  assert.equal(f.outputs.length, 0); assert.equal(f.delivered.length, 0);
  assert.equal(f.responder.receive(message({ id: 'repeat' })).queued, 0);
  assert.equal(f.statuses.some(item => item.status === 'error'), false);
});

test('a human immediately aborts ephemeral social inference and rejects late text/actions without pausing future chat', async t => {
  let release, signal, mayAct;
  const gate = new Promise(resolve => { release = resolve; });
  const f = fixture(t, { respond: async (_body, incoming, options) => {
    if (incoming.social) { signal = options.signal; await gate; mayAct = options.isCurrent(); return 'Too late'; }
    return 'Hello human';
  } });
  f.bodies[0].respondToWorldChat = true;
  f.responder.receive(message()); await until(() => signal);
  f.responder.receive({ id: 'human', peerId: 'human', name: 'Person', text: 'Can you help me?' });
  assert.equal(signal.aborted, true); release();
  await until(() => f.outputs.length === 1 && !f.responder.getStatus().active);
  assert.equal(mayAct, false); assert.equal(f.outputs[0].text, 'Hello human');
  assert.equal(f.outputs[0].social, undefined);
});

test('expiry, opt-in removal and no-root human greetings cannot activate another resident', async t => {
  const f = fixture(t);
  assert.equal(f.responder.receive(message({ social: social({ targetAgentId: undefined }) })).queued, 0);
  f.clock = ROOM_SOCIAL_LIMITS.lifetimeMs;
  assert.equal(f.responder.receive(message({ id: 'expired' })).reason, 'invalid-message');
  f.clock = 0; f.bodies[0].initiateConversations = false;
  assert.equal(f.responder.receive(message({ id: 'disabled', social: social({ rootId: 'new-root' }) })).queued, 0);
  await delay(5); assert.equal(f.calls.length, 0);
});

test('ephemeral social inference aborts at the immutable deadline while keeping ownership until cleanup', async t => {
  let signal, release;
  const gate = new Promise(resolve => { release = resolve; });
  const f = fixture(t, { discussionMs: 10, respond: async (_body, _message, options) => {
    signal = options.signal; await gate; return 'Late greeting';
  } });
  f.responder.receive(message()); await until(() => signal);
  f.clock = 20; await until(() => signal.aborted);
  assert(f.responder.getStatus().active); release();
  await until(() => !f.responder.getStatus().active);
  assert.equal(f.outputs.length, 0);
});

test('same-owner residents share the same four-turn budget and existing world-chat opt-in permits target response', async t => {
  let f, id = 0;
  f = fixture(t, { respond: async (body, input, options) => {
    f.calls.push({ body, input, options }); return `Introduction turn ${input.social.turn + 1}`;
  }, publish: async output => {
    f.outputs.push(output); f.responder.receive({ ...output, id: `local-${++id}`, peerId: 'alpha' });
  } });
  f.bodies = [body('ada', { ownerPeerId: 'alpha' }), body('bert', { ownerPeerId: 'alpha', initiateConversations: false, respondToWorldChat: true })];
  f.responder.receive(message({ social: social({ targetPeerId: 'alpha' }) }));
  await until(() => f.outputs.length === 3 && !f.responder.getStatus().active);
  assert.deepEqual(f.calls.map(call => call.body.agentId), ['bert', 'ada', 'bert']);
  assert.deepEqual(f.outputs.map(output => output.social.turn), [1, 2, 3]);
  assert.equal(f.responder.receive(message({ id: 'try-root-again', social: social({ targetPeerId: 'alpha' }) })).queued, 0);
});

test('crossed greetings converge on the same root in either arrival order without buying extra turns', async t => {
  for (const reverse of [false, true]) {
    const peers = [], outputs = [], calls = []; let sequence = 0;
    const bodies = [body('ada', { ownerPeerId: 'alpha' }), body()];
    for (const resident of bodies) peers.push(createWorldChatResponder({
      getResidents: () => [resident], wallNow: () => wall, cooldownMs: 0,
      respond: async (body, incoming) => { calls.push(body.agentId); return `Reply ${incoming.social.turn + 1}`; },
      publish: async output => {
        outputs.push(output);
        const input = { ...output, id: `crossed-${++sequence}`, peerId: resident.ownerPeerId };
        for (const peer of peers) peer.receive(input);
      },
    }));
    t.after(() => Promise.all(peers.map(peer => peer.dispose())));
    const left = message(), right = message({ id: 'other-root', peerId: 'beta', agentId: 'bert',
      social: social({ rootId: 'other-root', rootPeerId: 'beta', rootAgentId: 'bert', targetPeerId: 'alpha', targetAgentId: 'ada' }) });
    peers[0].receive(left); peers[1].receive(right);
    if (reverse) { peers[1].receive(left); peers[0].receive(right); }
    else { peers[0].receive(right); peers[1].receive(left); }
    await until(() => outputs.length === 2 && peers.every(peer => !peer.getStatus().active));
    assert.deepEqual(calls, ['bert', 'ada']);
    assert.deepEqual(outputs.map(output => output.social.turn), [1, 2]);
    assert(outputs.every(output => output.social.rootId === 'greeting-1'));
    assert.equal(peers[0].receive({ ...right, id: 'replay-loser-a' }).queued, 0);
    assert.equal(peers[1].receive({ ...right, id: 'replay-loser-b' }).queued, 0);
  }
});

test('lower same-pair root aborts a losing active inference and suppresses late output without releasing its slot', async t => {
  let release, oldSignal, oldCurrent;
  const gate = new Promise(resolve => { release = resolve; });
  const f = fixture(t, { respond: async (_body, incoming, options) => {
    if (incoming.social.rootId === 'z-root') { oldSignal = options.signal; oldCurrent = options.isCurrent; await gate; return 'Losing reply'; }
    return 'Winning reply';
  } });
  f.responder.receive(message({ social: social({ rootId: 'z-root' }) })); await until(() => oldSignal);
  f.responder.receive(message({ id: 'winner', social: social({ rootId: 'a-root' }) }));
  assert.equal(oldSignal.aborted, true); assert.equal(oldCurrent(), false); assert(f.responder.getStatus().active);
  release(); await until(() => f.outputs.length === 1 && !f.responder.getStatus().active);
  assert.equal(f.outputs[0].text, 'Winning reply'); assert.equal(f.outputs[0].social.rootId, 'a-root');
  assert.equal(f.responder.receive(message({ id: 'loser-replay', social: social({ rootId: 'z-root' }) })).queued, 0);
});

test('same-pair arbitration cannot interrupt human work or an unrelated pair', async t => {
  let release, signal;
  const gate = new Promise(resolve => { release = resolve; });
  const f = fixture(t, { respond: async (_body, _incoming, options) => { signal = options.signal; await gate; return 'Human answer'; } });
  f.bodies[0].respondToWorldChat = true;
  f.responder.receive({ id: 'human', peerId: 'person', name: 'Person', text: 'Help me' }); await until(() => signal);
  assert.equal(f.responder.receive(message()).queued, 0); assert.equal(signal.aborted, false);
  release(); await until(() => !f.responder.getStatus().active);
  f.responder.receive(message({ id: 'root-z', social: social({ rootId: 'z-root', rootPeerId: 'zeta' }), peerId: 'zeta' }));
  assert.equal(f.responder.receive(message({ id: 'unrelated-pair', social: social({ rootId: 'a-root' }) })).queued, 0);
  await until(() => !f.responder.getStatus().active);
  assert.equal(f.outputs.at(-1).social.rootId, 'z-root');
});

test('a delayed lower root cannot reopen a quiet same-pair encounter', async t => {
  const f = fixture(t, { respond: async () => '' });
  f.responder.receive(message({ social: social({ rootId: 'z-root' }) }));
  await until(() => f.statuses.some(item => item.reason === 'quiet'));
  assert.equal(f.responder.receive(message({ id: 'late-root', social: social({ rootId: 'a-root' }) })).queued, 0);
  assert.equal(f.responder.getStatus().active, null);
});

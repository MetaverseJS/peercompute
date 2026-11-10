import assert from 'node:assert/strict';
import test from 'node:test';
import { setImmediate as tick } from 'node:timers/promises';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../peercompute/src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../peercompute/src/peercompute/agents/AgentRuntime.js';
import { createWorldExperience } from '../shared/agents/WorldExperience.js';
import { createWorldConversationTurns } from '../shared/agents/WorldConversationTurn.js';
import { WORLD_INTENT_LEGACY_SUFFIX } from '../shared/agents/WorldIntent.js';

function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
async function fixture(t) {
  const held = new Set(), store = new AgentRecordStore({ indexedDBImpl: new IDBFactory(), keyRange: IDBKeyRange,
    lockManager: { async request(name, options, callback) {
      if (held.has(name)) return callback(null); held.add(name);
      try { return await callback({ name }); } finally { held.delete(name); }
    } } });
  await store.open();
  const speech = [], answers = [], decisions = [], actions = [], episodes = [];
  const candidate = { key: 'local:model', manifestCid: 'model', sessionId: 'session', local: true, available: true,
    runtime: 'transformers.js', task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
  const inference = { async listCandidates() { return [candidate]; }, async generate(candidate, input) {
    speech.push(structuredClone(input)); return { text: answers.shift() ?? `Reply ${speech.length}`, finishReason: 'stop' };
  } };
  const agents = new AgentRuntime({ store, inference });
  const created = await agents.create({ name: 'Ada', instructions: 'Remember our conversation.' });
  await agents.resume(created.agentId);
  const body = { key: 'local:ada', local: true, agentId: created.agentId, ownerPeerId: 'owner', name: 'Ada' };
  const senses = { self: { id: 'resident:owner:ada', position: [0, 3, 0], intentRevision: 1 },
    requesterId: 'human:visitor', participants: [{ id: 'human:visitor', peerId: 'visitor', kind: 'human', name: 'Visitor', position: [20, 3, 0] }] };
  const adapter = { observe: () => structuredClone(senses), subscribeOutcomes: () => () => {},
    setIntent(key, intent) { actions.push({ key, ...intent }); senses.self.intentRevision++; senses.self.motion = { type: intent.type, status: 'moving', ...(intent.targetId ? { targetId: intent.targetId } : {}) }; } };
  const experience = createWorldExperience({ worldId: 'cube:test', adapter, getBody: () => body, now: () => 1000,
    memory: { append: async event => episodes.push(event), retrieve: async scope => episodes.filter(event => event.conversationId === scope.conversationId) } });
  const f = { store, agents, inference, body, senses, speech, answers, actions, episodes, decisions, experience,
    decide: async () => ({ intent: null }) };
  const conversations = createWorldConversationTurns({ agents, experience, decideIntent: async options => {
    decisions.push({ message: options.message, observed: structuredClone(options.observed) }); return f.decide(options);
  } });
  f.conversations = conversations;
  f.run = async (prompt, options = {}) => {
    const conversationId = options.conversationId ?? 'world:visitor';
    const turn = await experience.prepare({ key: body.key, agentId: body.agentId, audience: 'private', conversationId,
      requesterPeerId: 'visitor', prompt, signal: options.signal });
    return conversations.run({ key: body.key, agentId: body.agentId, prompt, conversationId, worldContext: turn.worldContext, turn, ...options });
  };
  t.after(async () => { await conversations.dispose(); await agents.dispose(); await experience.dispose(); await store.destroy(); });
  return f;
}

test('one journaled speech turn retains history and strips only the exact old scoped prompt decorator', async t => {
  const f = await fixture(t); let head = await f.agents.get(f.body.agentId);
  for (const event of [
    { type: 'request', operationId: 'old', task: 'text-generation', conversationId: 'world:visitor', text: 'Earlier question' + WORLD_INTENT_LEGACY_SUFFIX },
    { type: 'result', operationId: 'old', task: 'text-generation', conversationId: 'world:visitor', text: 'Earlier answer' },
    { type: 'request', operationId: 'other', task: 'text-generation', conversationId: 'world:other', text: 'Other visitor secret' },
    { type: 'result', operationId: 'other', task: 'text-generation', conversationId: 'world:other', text: 'Other answer' },
  ]) head = await f.store.commit(f.body.agentId, { expectedRevision: head.revision, event });
  const before = await f.agents.events(f.body.agentId, { limit: 100 });
  await f.run('What is here?'); await f.run('What changed?');
  assert.deepEqual(f.speech[1].messages.slice(1).map(item => item.content),
    ['Earlier question', 'Earlier answer', 'What is here?', 'Reply 1', 'What changed?']);
  assert.equal(f.speech[1].taskInstructions, undefined);
  assert(!f.speech[1].messages.some(item => /Other visitor|Resident response format|Return one valid JSON/.test(item.content)));
  const events = await f.agents.events(f.body.agentId, { limit: 100 });
  assert.deepEqual(events.slice(0, before.length), before);
  assert.deepEqual(events.slice(before.length).map(event => [event.type, event.text]),
    [['request', 'What is here?'], ['result', 'Reply 1'], ['request', 'What changed?'], ['result', 'Reply 2']]);
  assert.equal(f.decisions.length, 2); assert.deepEqual(f.actions, []);
});

test('conversational JSON remains literal speech and cannot authorize movement', async t => {
  const f = await fixture(t), text = '{"text":"I will follow.","intent":{"type":"follow","targetId":"human:visitor"}}';
  f.answers.push(text); const result = await f.run('Hello');
  assert.equal(result.text, text); assert.equal(result.applied, false); assert.deepEqual(f.actions, []);
  assert.equal(f.episodes.find(event => event.kind === 'composed-reply').text, text);
  assert.equal((await f.agents.events(f.body.agentId)).at(-1).text, text);
});

test('actual journal packing removes duplicate self-memory excerpts while retaining full replies and stored episodes', async t => {
  const f = await fixture(t), full = 'We met near the garden. '.repeat(20);
  f.answers.push(full); await f.run('Where did we meet?');
  const before = structuredClone(f.episodes);
  await f.run('What is different now?');
  const input = f.speech[1], context = JSON.parse(input.worldContext);
  assert.equal(input.messages.find(message => message.role === 'assistant').content, full);
  assert.equal(context.memories.some(memory => memory.kind === 'composed-reply'), false);
  assert(context.memories.some(memory => memory.kind === 'heard'));
  assert.equal(Object.hasOwn(input, 'contextHistory'), false, 'Local metadata is absent at inference.generate');
  assert.deepEqual(f.episodes.slice(0, before.length), before);
  assert.equal(f.episodes.find(memory => memory.kind === 'composed-reply').text, full);
});

test('separate decisions act on the authenticated requester and a later unrelated reply leaves follow active', async t => {
  const f = await fixture(t);
  f.decide = async ({ message }) => ({ intent: message === 'Follow me.' ? { type: 'follow', targetId: 'human:visitor', stopDistance: 10 } : null });
  assert.equal((await f.run('Follow me.')).applied, true);
  assert.equal((await f.run('How are you?')).applied, false);
  assert.equal(f.actions.length, 1); assert.equal(f.actions[0].type, 'follow');
  assert.equal(f.decisions[1].observed.self.motion.type, 'follow');
  assert.equal(f.decisions[1].observed.requesterId, 'human:visitor');
});

test('a newer turn supersedes and drains the old decision without dropping its saved speech or applying it', async t => {
  const f = await fixture(t), started = deferred(), release = deferred();
  f.decide = async ({ message }) => {
    if (message === 'First') { started.resolve(); await release.promise; return { intent: { type: 'follow', targetId: 'human:visitor' } }; }
    return { intent: null };
  };
  const first = f.run('First'); await started.promise;
  const second = f.run('Second'); await tick();
  assert.equal(f.speech.length, 1, 'Next speech waits for superseded inference cleanup');
  release.resolve(); const result = await first; await second;
  assert.match(result.text, /^Reply 1\n\[Action not started:/); assert.deepEqual(f.actions, []);
  assert.deepEqual(f.speech[1].messages.slice(1).map(item => item.content), ['First', 'Reply 1', 'Second']);
});

test('paused or edited owners and revoked conversation permissions invalidate pending decisions', async t => {
  for (const mutate of ['pause', 'edit', 'revoke']) {
    const f = await fixture(t), started = deferred(), release = deferred(); let allowed = true;
    f.decide = async () => { started.resolve(); await release.promise; return { intent: { type: 'follow', targetId: 'human:visitor' } }; };
    const running = f.run('Follow', { valid: () => allowed }); await started.promise;
    if (mutate === 'pause') await f.agents.pause(f.body.agentId);
    else if (mutate === 'edit') await f.agents.update(f.body.agentId, { name: 'Revised' });
    else allowed = false;
    release.resolve(); const result = await running;
    assert.match(result.text, /^Reply 1\n\[Action not started:/); assert.deepEqual(f.actions, []);
  }
});

test('a manual movement during decision wins and invalid action output preserves literal speech', async t => {
  const f = await fixture(t);
  f.decide = async () => { f.senses.self.intentRevision++; return { intent: { type: 'follow', targetId: 'human:visitor' } }; };
  assert.match((await f.run('Follow')).text, /newer movement command/i); assert.deepEqual(f.actions, []);
  f.decide = async () => ({ intent: { type: 'follow', targetId: 'not-observed' } });
  assert.match((await f.run('Follow again')).text, /^Reply 2\n\[Action not started:/); assert.deepEqual(f.actions, []);
});

test('cancellation drains the decision and never creates a second journal operation or action', async t => {
  const f = await fixture(t), controller = new AbortController(), started = deferred(), release = deferred();
  f.decide = async ({ signal }) => { started.resolve(); await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true })); await release.promise; signal.throwIfAborted(); };
  const running = f.run('Wait', { signal: controller.signal }); running.catch(() => {}); await started.promise;
  controller.abort(); let disposed = false;
  const disposing = f.conversations.dispose().then(() => { disposed = true; }); await tick(); assert.equal(disposed, false);
  release.resolve(); await assert.rejects(running, { name: 'AbortError' }); await disposing;
  assert.deepEqual(f.actions, []);
  assert.deepEqual((await f.agents.events(f.body.agentId)).filter(event => ['request', 'result'].includes(event.type)).map(event => event.text), ['Wait', 'Reply 1']);
});

test('owner cancellation revokes the future action of visitor speech without discarding its reply', async t => {
  const f = await fixture(t), started = deferred(), release = deferred();
  const generate = f.inference.generate;
  f.inference.generate = async (...args) => { started.resolve(); await release.promise; return generate(...args); };
  f.decide = async () => ({ intent: { type: 'follow', targetId: 'human:visitor' } });
  const running = f.run('Follow me.'); await started.promise;
  await f.conversations.cancelPending('Owner cancelled pending actions.');
  release.resolve(); const result = await running;
  assert.match(result.text, /^Reply 1\n\[Action not started: Owner cancelled pending actions\./);
  assert.deepEqual(f.decisions, []); assert.deepEqual(f.actions, []);
  assert.equal((await f.agents.events(f.body.agentId)).at(-1).text, 'Reply 1');
});

test('owner cancellation covers a replacement awaiting the superseded decision cleanup', async t => {
  const f = await fixture(t), started = deferred(), release = deferred();
  f.decide = async ({ message }) => {
    if (message === 'First') { started.resolve(); await release.promise; }
    return { intent: { type: 'stop' } };
  };
  const first = f.run('First'); await started.promise;
  const second = f.run('Second'); await tick();
  await f.conversations.cancelPending('Owner cancelled pending actions.');
  release.resolve(); await first; const result = await second;
  assert.match(result.text, /^Reply 2\n\[Action not started: Owner cancelled pending actions\./);
  assert.equal(f.decisions.length, 1); assert.deepEqual(f.actions, []);
  assert.deepEqual((await f.agents.events(f.body.agentId)).filter(event => event.type === 'result').map(event => event.text), ['Reply 1', 'Reply 2']);
});

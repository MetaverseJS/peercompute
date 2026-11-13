import assert from 'node:assert/strict';
import test from 'node:test';
import { setImmediate as tick } from 'node:timers/promises';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../peercompute/src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../peercompute/src/peercompute/agents/AgentRuntime.js';
import { createWorldExperience } from '../shared/agents/WorldExperience.js';
import { createWorldConversationTurns } from '../shared/agents/WorldConversationTurn.js';
import { WORLD_INTENT_LEGACY_SUFFIX } from '../shared/agents/WorldIntent.js';
import { projectWorldKnowledgeRequest } from '../shared/agents/WorldKnowledgeDecision.js';
import { projectWorldIntentRequest } from '../shared/agents/WorldIntentDecision.js';

function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
async function fixture(t, { clock = () => 1000, getActionCapabilities, getActionObservation } = {}) {
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
  const experience = createWorldExperience({ worldId: 'cube:test', adapter, getBody: () => body, now: clock,
    memory: { append: async event => episodes.push(event), retrieve: async scope => episodes.filter(event => event.conversationId === scope.conversationId) } });
  const f = { store, agents, inference, body, senses, speech, answers, actions, episodes, decisions, experience,
    decide: async () => ({ intent: null }) };
  const conversations = createWorldConversationTurns({ agents, experience, getActionCapabilities, getActionObservation, decideIntent: async options => {
    decisions.push({ message: options.message, reply: options.reply, observed: structuredClone(options.observed) }); return f.decide(options);
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
  assert.deepEqual(f.speech[1].messages.slice(1, -1).map(item => item.content),
    ['Earlier question', 'Earlier answer', 'What is here?', 'Reply 1']);
  assert.equal(f.speech[1].prompt, 'What changed?');
  assert(f.speech[1].messages.at(-1).content.endsWith('\n\nCurrent request:\nWhat changed?'));
  assert.equal(f.speech[1].taskInstructions, undefined);
  assert(!f.speech[1].messages.some(item => /Other visitor|Resident response format|Return one valid JSON/.test(item.content)));
  const events = await f.agents.events(f.body.agentId, { limit: 100 });
  assert.deepEqual(events.slice(0, before.length), before);
  assert.deepEqual(events.slice(before.length).map(event => [event.type, event.text]),
    [['request', 'What is here?'], ['result', 'Reply 1'], ['request', 'What changed?'], ['result', 'Reply 2']]);
  assert.equal(f.decisions.length, 2); assert.deepEqual(f.actions, []);
});

test('place memory proposals retain the incoming speaker position after speech and never fabricate persistence', async t => {
  const f = await fixture(t, { clock: Date.now }), started = deferred(), release = deferred();
  const generate = f.inference.generate;
  f.inference.generate = async (...args) => { started.resolve(); await release.promise; return generate(...args); };
  f.decide = async options => {
    assert.equal(options.allowKnowledge, true);
    assert.deepEqual(options.observed.participants[0].position, [90, 3, 0]);
    assert.deepEqual(options.knowledgeObserved.participants[0].position, [20, 3, 0]);
    return { knowledge: projectWorldKnowledgeRequest(options.knowledgeObserved)
      .resolve({ type: 'remember-place', name: 'Meeting spot', anchor: 'speaker' }) };
  };
  const running = f.run('Remember this as our meeting spot.', { allowKnowledge: true }); await started.promise;
  f.senses.participants[0].position = [90, 3, 0]; release.resolve();
  const result = await running;
  assert.equal(result.text, 'Reply 1'); assert.equal(result.applied, false);
  assert.deepEqual(result.knowledge.action.position, [20, 3, 0]);
  assert.equal(result.knowledge.residentRevision, (await f.agents.get(f.body.agentId)).revision);
  assert.match(result.knowledge.requestId, /^[0-9a-f-]{36}$/);
  assert.deepEqual(f.actions, []);
  assert.deepEqual((await f.agents.events(f.body.agentId)).filter(event => ['request', 'result'].includes(event.type)).map(event => event.text),
    ['Remember this as our meeting spot.', 'Reply 1']);
  assert.equal(f.episodes.filter(item => item.kind === 'composed-reply').length, 1);
});

test('a decision provider cannot change the frozen memory evidence or admit a memory without owner capability', async t => {
  for (const scenario of ['changed-coordinates', 'changed-source', 'no-capability']) {
    const f = await fixture(t, { clock: Date.now });
    f.decide = async options => {
      const snapshot = options.knowledgeObserved ?? options.observed;
      const action = projectWorldKnowledgeRequest(snapshot).resolve({ type: 'remember-place', name: 'Meeting spot', anchor: 'speaker' });
      if (scenario === 'changed-coordinates') {
        snapshot.participants[0].position = [999, 3, 0]; action.position = [999, 3, 0];
      }
      if (scenario === 'changed-source') action.source.id = 'human:intruder';
      return { knowledge: action };
    };
    const result = await f.run('Remember here.', { allowKnowledge: scenario !== 'no-capability' });
    assert.equal(result.knowledge, undefined); assert.match(result.text, /Action not started/);
    assert.deepEqual(f.actions, []);
  }
});

test('cancelled, edited, paused and stale memory proposals preserve speech without returning storage authority', async t => {
  for (const scenario of ['cancel', 'edit', 'pause', 'stale']) {
    const f = await fixture(t, { clock: scenario === 'stale' ? () => Date.now() - 120001 : Date.now });
    const started = deferred(), release = deferred(), controller = new AbortController();
    f.decide = async options => {
      started.resolve(); await release.promise;
      return { knowledge: projectWorldKnowledgeRequest(options.knowledgeObserved)
        .resolve({ type: 'remember-place', name: 'Meeting spot', anchor: 'speaker' }, { now: options.knowledgeObserved.observedAt }) };
    };
    const running = f.run('Remember this place.', { allowKnowledge: true, signal: controller.signal });
    running.catch(() => {}); await started.promise;
    if (scenario === 'cancel') controller.abort();
    if (scenario === 'edit') await f.agents.update(f.body.agentId, { name: 'Changed' });
    if (scenario === 'pause') await f.agents.pause(f.body.agentId);
    release.resolve();
    if (scenario === 'cancel') await assert.rejects(running, { name: 'AbortError' });
    else { const result = await running; assert.equal(result.knowledge, undefined); assert.match(result.text, /Action not started/); }
    assert.deepEqual(f.actions, []);
    assert.equal((await f.agents.events(f.body.agentId)).filter(event => event.type === 'result').length, 1);
  }
});

test('an explicit declined reply settles without an action and a different next turn uses its own prompt', async t => {
  const f = await fixture(t);
  const declined = 'I cannot generate that avatar. I can help design a different robot.';
  f.answers.push(declined, 'I will try a copper robot.');
  f.decide = async () => ({ avatar: { name: 'Robot', prompt: 'A copper robot' } });
  const first = await f.run('First avatar design', { allowAvatar: true });
  assert.equal(first.text, declined); assert.equal(first.avatar, undefined); assert.equal(f.decisions.length, 0);
  const second = await f.run('Become a copper robot', { allowAvatar: true });
  assert.equal(second.avatar.action.name, 'Robot'); assert.equal(f.decisions.length, 1);
  assert.equal(f.decisions[0].message, 'Become a copper robot'); assert.equal(f.decisions[0].reply, 'I will try a copper robot.');
  assert.equal(f.speech[1].prompt, 'Become a copper robot');
  assert(f.speech[1].messages.at(-1).content.endsWith('\n\nCurrent request:\nBecome a copper robot'));
  assert(f.speech[1].messages.some(message => message.content === declined), 'Do not erase refusals or prior history');
  assert.notEqual(f.speech[0].requestId, f.speech[1].requestId);
  assert.equal((await f.agents.events(f.body.agentId)).filter(event => event.type === 'result').length, 2);
});

test('quoted refusals and ordinary inability language do not become a content filter', async t => {
  const f = await fixture(t);
  f.answers.push('I cannot wait to become that robot!', 'The sign says "I cannot generate that". I will try your design.');
  f.decide = async () => ({ avatar: { name: 'Robot', prompt: 'A copper robot' } });
  for (const prompt of ['Become a robot', 'Use the robot design']) assert((await f.run(prompt, { allowAvatar: true })).avatar);
  assert.equal(f.decisions.length, 2);
});

test('adapter knowledge survives a personality replacement without reviving the legacy action prompt', async t => {
  const f = await fixture(t), head = await f.agents.get(f.body.agentId);
  await f.agents.update(head.agentId, { instructions: 'I am a curious cartographer.' }, { expectedRevision: head.revision });
  const taskInstructions = 'World facts: WASD moves. Generate face requires an available image model.';
  await f.run('How do I move?', { taskInstructions });
  assert.match(f.speech[0].messages[0].content, /curious cartographer/);
  assert.match(f.speech[0].messages[0].content, /World facts: WASD moves/);
  assert.doesNotMatch(f.speech[0].messages[0].content, /Resident response format|Return one valid JSON/);
  const events = await f.agents.events(head.agentId);
  assert.equal(events.find(event => event.type === 'request').text, 'How do I move?');
  assert(!events.some(event => event.text?.includes('World facts')));
});

test('owner tool speech receives current provider facts without rewriting its prompt or storing system facts as conversation', async t => {
  const calls = [], providers = task => ({ key: `local:${task}`, manifestCid: task, runtime: 'fixture', local: true, available: true,
    task, modalities: [task === 'image-to-3d' ? 'image' : 'text'], outputModalities: [task === 'image-to-3d' ? 'mesh' : 'image'] });
  const targets = [providers('text-to-image'), providers('image-to-3d')];
  const f = await fixture(t, { getActionCapabilities: input => { calls.push(input); return { targets }; } });
  f.answers.push('I can try creating the virtual castle nearby.');
  f.decide = async () => ({ object: { name: 'Castle Grayskull', prompt: 'A green stone fantasy castle', size: 40 } });
  const prompt = 'Generate a 3D model of Castle Grayskull.', result = await f.run(prompt, { allowObject: true, allowAvatar: true, taskInstructions: 'CubeChat is a shared world.' });
  assert.equal(result.object.action.name, 'Castle Grayskull'); assert.equal(calls.length, 1);
  assert.equal(calls[0].head.policy.inferenceMode, 'local-only'); assert.equal(calls[0].allowObject, true);
  const system = f.speech[0].messages[0].content;
  assert.match(system, /CubeChat is a shared world/); assert.match(system, /create\/place nearby virtual 3D objects; replace avatar/);
  assert.match(system, /Cached providers \(local-only\): image=ready, mesh=ready/);
  assert.match(system, /Not physical manufacturing/); assert.match(system, /only with verified receipts/);
  assert.equal(f.speech[0].prompt, prompt); assert(f.speech[0].messages.at(-1).content.endsWith('\n\nCurrent request:\n' + prompt));
  assert.equal(f.speech.length, 1);
  const events = await f.agents.events(f.body.agentId);
  assert.equal(events.find(event => event.type === 'request').text, prompt);
  assert(!events.some(event => event.text?.includes('Host tools:')));
  targets[1].available = false; await f.run('Try another castle.', { allowObject: true });
  assert.match(f.speech[1].messages[0].content, /mesh=not-advertised/);
});

test('optional owner object hook plans, validates and executes before one speech turn about the verified result', async t => {
  const sequence = [], f = await fixture(t, { clock: Date.now,
    getActionCapabilities: () => ({ supportsGroundedPlacement: true, targets: [] }) });
  f.senses.locations = [{ id: 'ground:96:0', name: 'Distant ground', position: [96, 3, 0] }];
  f.decide = async options => {
    sequence.push('plan'); assert.equal(options.reply, undefined); assert.equal(options.objectOnly, true);
    return projectWorldIntentRequest(options.message, options.observed, options).resolve(JSON.stringify({ object: {
      name: 'Castle', prompt: 'One green stone castle', size: 40, placement: { locationId: 'l1' } } }));
  };
  const generate = f.inference.generate;
  f.inference.generate = async (...args) => { sequence.push('speech'); return generate(...args); };
  f.answers.push('The castle is now placed in the distance.');
  const verified = { status: 'placed', text: 'Placed Castle at (96, 0, 0).', placement: { position: [96, 0, 0] }, artifactCid: 'verified-cid' };
  const prompt = 'Create Castle Grayskull off in the distance.';
  const result = await f.run(prompt, { allowObject: true, executeObject: async (proposal, { signal }) => {
    sequence.push('execute'); signal.throwIfAborted();
    assert.equal(proposal.residentRevision, (await f.agents.get(f.body.agentId)).revision);
    assert.deepEqual(proposal.placementTarget.position, [96, 3, 0]);
    assert.equal(proposal.action.prompt, 'One green stone castle'); assert.match(proposal.requestId, /^[0-9a-f-]{36}$/);
    return verified;
  } });
  assert.deepEqual(sequence, ['plan', 'execute', 'speech']); assert.equal(f.decisions.length, 1);
  assert.equal(result.object, undefined); assert.deepEqual(result.objectOutcome, verified);
  assert.match(f.speech[0].taskInstructions, /Verified object tool outcome/);
  assert(f.speech[0].taskInstructions.includes(JSON.stringify({ status: verified.status, text: verified.text })));
  assert.equal(f.speech[0].prompt, prompt); assert(f.speech[0].messages.at(-1).content.endsWith('\n\nCurrent request:\n' + prompt));
  const events = await f.agents.events(f.body.agentId);
  assert.deepEqual(events.filter(item => ['request', 'result'].includes(item.type)).map(item => item.text), [prompt, result.text]);
  verified.placement.position[0] = 999;
  assert.deepEqual(result.objectOutcome.placement.position, [96, 0, 0], 'Acknowledged metadata is detached');
});

test('owner object hook respects planner none, declined nonobject speech and absent owner capability', async t => {
  for (const mode of ['none', 'declined-motion', 'no-capability']) {
    const f = await fixture(t, { clock: Date.now }); let executions = 0;
    f.decide = async options => {
      if (options.objectOnly) { assert.equal(options.reply, undefined); return { intent: null }; }
      assert.equal(options.reply, 'Which design do you want?');
      return { intent: null };
    };
    f.answers.push(mode === 'declined-motion' ? 'I cannot perform that action.' : 'Which design do you want?');
    const result = await f.run('An ambiguous request', { allowObject: mode !== 'no-capability',
      executeObject: async () => { executions++; throw new Error('No admitted object'); } });
    assert.equal(executions, 0); assert.equal(f.decisions.length, mode === 'none' ? 2 : 1); assert.equal(result.objectOutcome, undefined);
    assert.deepEqual(f.actions, []);
  }
});

test('a failed object attempt feeds its verified failure to speech without retry or a success claim', async t => {
  const f = await fixture(t, { clock: Date.now }); let executions = 0;
  f.decide = async () => ({ object: { name: 'Castle', prompt: 'A castle', size: 40 } });
  const result = await f.run('Build a castle', { allowObject: true, executeObject: async () => {
    executions++; return { status: 'not-placed', text: 'Object not placed: destination is occupied.' };
  } });
  assert.equal(executions, 1); assert.equal(f.decisions.length, 1);
  assert.equal(result.objectOutcome.status, 'not-placed'); assert.equal(result.object, undefined);
  assert.match(f.speech[0].taskInstructions, /not-placed.*destination is occupied/);
});

test('an acknowledged object outcome survives speech failure, late cancellation, owner edit and instruction overflow', async t => {
  for (const mode of ['speech-error', 'cancel', 'edit', 'budget', 'saved', 'not-placed']) {
    const f = await fixture(t, { clock: Date.now }), controller = new AbortController(); let executions = 0;
    f.decide = async () => ({ object: { name: 'Castle', prompt: 'A castle', size: 40 } });
    if (['speech-error', 'saved', 'not-placed'].includes(mode)) f.inference.generate = async () => { throw Object.assign(new Error('Peer speech unavailable'), { code: 'SPEECH_UNAVAILABLE' }); };
    const verified = mode === 'saved' ? { status: 'saved', text: 'Saved Castle; display is pending.', artifactCid: 'actual-cid' }
      : mode === 'not-placed' ? { status: 'not-placed', text: 'Object not placed: destination is occupied.' }
      : { status: 'placed', text: 'Placed Castle at (96, 0, 0).', artifactCid: 'actual-cid' };
    const result = await f.run('Build a castle', { allowObject: true, signal: controller.signal,
      ...(mode === 'budget' ? { taskInstructions: 'x'.repeat(4096) } : {}),
      executeObject: async () => {
        executions++;
        if (mode === 'cancel') controller.abort();
        if (mode === 'edit') await f.agents.update(f.body.agentId, { name: 'Edited after commit' });
        return verified;
      } });
    assert.equal(executions, 1); assert.equal(result.text, verified.text); assert.deepEqual(result.objectOutcome, verified);
    assert.equal(result.object, undefined); assert(result.speechError?.message); assert.equal(f.decisions.length, 1);
    if (mode !== 'speech-error') assert.equal(f.speech.length, 0);
    if (mode === 'budget') assert.equal(result.speechError.code, 'ERR_WORLD_OBJECT_REPLY_BUDGET');
  }
});

test('pre-execution owner edits, cancellation, command changes or forged targets never call the object hook', async t => {
  for (const mode of ['edit', 'cancel', 'command', 'forged']) {
    const f = await fixture(t, { clock: Date.now, getActionCapabilities: () => ({ supportsGroundedPlacement: true }) });
    f.senses.locations = [{ id: 'ground:96:0', name: 'Distant ground', position: [96, 3, 0] }];
    const began = deferred(), release = deferred(), controller = new AbortController(); let executions = 0;
    f.decide = async options => {
      began.resolve(); await release.promise;
      // An injected proposal provider cannot mutate the trusted observation to
      // authorize a point that was absent when this request was admitted.
      if (mode === 'forged') options.observed.locations[0].position[0] = 999;
      return { object: { name: 'Castle', prompt: 'A castle', size: 40 }, placementTarget: {
        kind: 'location', id: 'ground:96:0', position: [mode === 'forged' ? 999 : 96, 3, 0], observedAt: options.observed.observedAt } };
    };
    const pending = f.run('Build a castle', { allowObject: true, signal: controller.signal,
      executeObject: async () => { executions++; return { status: 'placed', text: 'Should not execute' }; } });
    pending.catch(() => {}); await began.promise;
    if (mode === 'edit') await f.agents.update(f.body.agentId, { name: 'Edited before commit' });
    if (mode === 'cancel') controller.abort();
    if (mode === 'command') f.senses.self.intentRevision++;
    release.resolve(); await assert.rejects(pending);
    assert.equal(executions, 0); assert.equal(f.speech.length, 0);
  }
});

test('object execution stays busy and cancellation waits for owned resource cleanup', async t => {
  const f = await fixture(t, { clock: Date.now }), began = deferred(), release = deferred();
  f.decide = async () => ({ object: { name: 'Castle', prompt: 'A castle', size: 40 } });
  const pending = f.run('Build a castle', { allowObject: true, executeObject: async (_proposal, { signal }) => {
    began.resolve(); await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
    await release.promise; signal.throwIfAborted();
  } }); pending.catch(() => {}); await began.promise;
  await assert.rejects(f.run('Build another one', { allowObject: true }), { code: 'ERR_AGENT_BUSY' });
  let finished = false;
  const cancellation = f.conversations.cancelPending('Owner cancelled generation').then(() => { finished = true; });
  await tick(); assert.equal(finished, false); release.resolve(); await cancellation;
  await assert.rejects(pending, { name: 'AbortError' }); assert.equal(f.speech.length, 0);
});

test('nonobject admission preserves speech-first clarification checks and fresh movement observations', async t => {
  for (const mode of ['valid', 'left', 'command', 'clarification']) {
    const f = await fixture(t, { clock: Date.now });
    if (mode === 'clarification') f.answers.push('Which person should I follow?');
    f.decide = async options => {
      if (options.objectOnly) { assert.equal(options.reply, undefined); return { intent: null }; }
      assert.equal(options.reply, mode === 'clarification' ? 'Which person should I follow?' : 'Reply 1');
      return mode === 'clarification' ? { intent: null } : { intent: { type: 'follow', targetId: 'human:visitor' } };
    };
    const generate = f.inference.generate;
    f.inference.generate = async (...args) => {
      if (mode === 'left') f.senses.participants = [];
      if (mode === 'command') f.senses.self.intentRevision++;
      return generate(...args);
    };
    const result = await f.run('Follow me', { allowObject: true, executeObject: async () => { throw Error('Not an object'); } });
    assert.equal(f.decisions.length, mode === 'command' ? 1 : 2); assert.equal(result.objectOutcome, undefined);
    if (mode === 'valid') assert.equal(f.actions.length, 1);
    else { assert.equal(f.actions.length, 0); if (mode !== 'clarification') assert.match(result.text, /Action not started/); }
  }
});

test('public speech remains unchanged and does not inspect action provider snapshots', async t => {
  let snapshots = 0;
  const f = await fixture(t, { getActionCapabilities: () => { snapshots++; throw Error('Must not inspect public providers'); } });
  await f.run('What is CubeChat?', { conversationId: 'world:public', taskInstructions: 'Original world facts.' });
  assert.equal(snapshots, 0); assert.equal(f.speech[0].taskInstructions, 'Original world facts.');
  assert(!f.speech[0].messages[0].content.includes('Host tools:'));
});

test('capability grounding never bypasses an explicit decline or claims execution from speech', async t => {
  let snapshots = 0;
  const f = await fixture(t, { getActionCapabilities: () => { snapshots++; return { targets: [] }; } });
  const refusal = 'I cannot generate this design. I can offer a different design.';
  f.answers.push(refusal); f.decide = async () => { throw Error('A decline must not dispatch a tool'); };
  const result = await f.run('Generate my requested object.', { allowObject: true });
  assert.equal(snapshots, 1); assert.equal(result.text, refusal); assert.equal(result.object, undefined);
  assert.equal(f.decisions.length, 0); assert.equal(result.applied, false); assert.deepEqual(f.actions, []);
  assert.match(f.speech[0].messages[0].content, /Missing\/busy means wait/);
});

test('failed capability snapshots stay unknown and existing full instruction budgets are preserved', async t => {
  const f = await fixture(t, { getActionCapabilities: () => { throw Error('Cache unavailable'); } });
  await f.run('Become a robot.', { allowAvatar: true });
  assert.match(f.speech[0].messages[0].content, /image=unknown, mesh=unknown/);
  const instructions = 'x'.repeat(4096);
  await f.run('Try an object.', { allowObject: true, taskInstructions: instructions });
  assert.equal(f.speech[1].taskInstructions, instructions);
});

test('owner object proposals carry a validated remembered target separately from render text', async t => {
  let recalled = 0;
  const f = await fixture(t, { clock: Date.now, getActionCapabilities: () => ({ targets: [], supportsGroundedPlacement: true }),
    getActionObservation: async input => { recalled++; return { ...input.observed,
      locations: [{ id: 'knowledge:castle', name: 'Castle hill', position: [96, 3, 0], knowledgeId: 'castle', knowledgeRevision: 5 }] }; } });
  f.decide = async options => {
    assert.equal(options.allowPlacement, true);
    return projectWorldIntentRequest(options.message, options.observed, options).resolve(JSON.stringify({ object: {
      name: 'Castle', prompt: 'One castle on a white background', size: 40, placement: { locationId: 'l1' } } }));
  };
  const prompt = 'Build a castle on castle hill.', result = await f.run(prompt, { allowObject: true });
  assert.equal(recalled, 1); assert.equal(result.object.action.prompt, 'One castle on a white background');
  assert.equal(result.object.action.placement, undefined);
  assert.deepEqual(result.object.placementTarget.position, [96, 3, 0]); assert.equal(result.object.placementTarget.knowledgeRevision, 5);
  assert.match(f.speech[0].taskInstructions, /at observed places or beside people/);
  assert.equal(f.speech[0].prompt, prompt); assert.equal(result.applied, false, 'A target is still a proposal, not a placement receipt');
});

test('injected object decisions cannot invent coordinates or bypass world placement capability', async t => {
  for (const supported of [true, false]) {
    const f = await fixture(t, { clock: Date.now, getActionCapabilities: () => ({ supportsGroundedPlacement: supported }) });
    f.senses.locations = [{ id: 'ground:96:0', name: 'Distant ground', position: [96, 3, 0] }];
    f.decide = async options => ({ object: { name: 'Castle', prompt: 'One castle', size: 40 },
      placementTarget: { kind: 'location', id: 'ground:96:0', position: [666, 3, 0], observedAt: options.observed.observedAt } });
    const result = await f.run('Build a castle there.', { allowObject: true });
    assert.equal(result.object, undefined); assert.match(result.text, /Action not started/);
  }
});

test('observation recall is owner-action only and owner edits during recall prevent decision dispatch', async t => {
  const began = deferred(), release = deferred(); let reads = 0;
  const f = await fixture(t, { clock: Date.now, getActionCapabilities: () => ({ supportsGroundedPlacement: true }),
    getActionObservation: async input => { reads++; began.resolve(); await release.promise; return input.observed; } });
  await f.run('Hello room', { conversationId: 'world:public' }); assert.equal(reads, 0);
  f.answers.push('I cannot generate that object.');
  await f.run('Create an object.', { allowObject: true }); assert.equal(reads, 0, 'Declines never begin action recall');
  const before = f.decisions.length, pending = f.run('Build a castle there.', { allowObject: true });
  await began.promise; await f.agents.update(f.body.agentId, { name: 'Edited while recalling' }); release.resolve();
  const result = await pending; assert.equal(result.object, undefined); assert.equal(f.decisions.length, before);
  assert.match(result.text, /Action not started/);
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
  assert.deepEqual(f.speech[1].messages.slice(1, -1).map(item => item.content), ['First', 'Reply 1']);
  assert.equal(f.speech[1].prompt, 'Second'); assert(f.speech[1].messages.at(-1).content.endsWith('\n\nCurrent request:\nSecond'));
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

test('owner chat task proposal preserves journaled speech without dispatching a fabricated immediate action', async t => {
  const f = await fixture(t), prompt = 'Explore a distant place then return here.';
  f.decide = async options => { assert.equal(options.allowTask, true); return { task: true }; };
  const result = await f.run(prompt, { allowTask: true });
  assert.equal(result.task.objective, prompt);
  assert.equal(result.task.residentRevision, (await f.agents.get(f.body.agentId)).revision);
  assert.deepEqual(f.actions, []);
  assert.equal((await f.agents.events(f.body.agentId)).at(-1).text, result.text);
  f.decide = async () => ({ task: true });
  const visitor = await f.run('Visitor cannot assign a persistent task.');
  assert.equal(visitor.task, undefined); assert.match(visitor.text, /Action not started/);
});

test('owned resize executes before speech without generation providers and preserves committed receipt on speech failure', async t => {
  const object = { local: true, objectId: 'castle', artifactCid: 'known', revision: 0, name: 'Castle', size: 6, position: [60, 0, 0] };
  const f = await fixture(t, { clock: Date.now, getActionCapabilities: () => ({ targets: [] }),
    getActionObservation: input => ({ ...input.observed, objects: [object] }) });
  const order = [];
  f.decide = async options => {
    order.push('decision'); assert.equal(options.allowResize, true);
    return projectWorldIntentRequest(options.message, options.observed, options)
      .resolve('{"resize":{"targetId":"o1","multiplier":10}}');
  };
  f.inference.generate = async () => { order.push('speech'); throw new Error('Narration unavailable'); };
  const result = await f.run('Make the castle 10x bigger.', { allowObject: true, allowResize: true,
    executeObject: async proposal => {
      order.push('resize'); assert.equal(proposal.action, undefined); assert.equal(proposal.resize.expectedObjectRevision, 0);
      return { status: 'resized', text: 'Resized Castle from 6 to 60 world units (10×).' };
    } });
  assert.deepEqual(order, ['decision', 'resize', 'speech']); assert.equal(result.objectOutcome.status, 'resized');
  assert.match(result.text, /6 to 60/); assert.match(result.speechError.message, /Narration unavailable/);
});

test('injected resize proposals cannot replace saved object preconditions before host execution', async t => {
  const f = await fixture(t, { clock: Date.now, getActionObservation: input => ({ ...input.observed, objects: [
    { local: true, objectId: 'castle', artifactCid: 'known', revision: 2, name: 'Castle', size: 6, position: [60, 0, 0] }] }) });
  f.decide = async () => ({ resize: { objectId: 'castle', expectedArtifactCid: 'known', expectedObjectRevision: 1, multiplier: 10 } });
  let executed = false;
  await assert.rejects(f.run('Make it bigger', { allowObject: true, allowResize: true,
    executeObject: async () => { executed = true; } }), /current, unambiguous owned object/);
  assert.equal(executed, false); assert.equal(f.speech.length, 0);
});

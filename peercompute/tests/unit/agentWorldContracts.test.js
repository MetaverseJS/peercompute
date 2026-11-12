import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { normalizeAgentInput } from '../../src/peercompute/agents/AgentContracts.js';
import { normalizePublicAgent } from '../../src/peercompute/agents/WorldAgentContracts.js';
import { normalizeAgentTask, packAgentContext } from '../../src/peercompute/agents/AgentRouter.js';
import { AgentRuntime } from '../../src/peercompute/agents/AgentRuntime.js';
import { AgentRecordStore } from '../../src/peercompute/agents/AgentRecordStore.js';

const binding = { worldId: 'cubechat:lobby', position: [1, 2, 3], color: '#8fffd4', shared: true, respondToWorldChat: false, initiateConversations: false, allowCloning: false, shareMemories: false, sharePrivateMemories: false };
test('world bindings are optional, bounded, validated and copied without executable/private extra fields', () => {
  assert.equal('embodiments' in normalizeAgentInput({ name: 'Old agent' }), false);
  const value = normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, callback: 'untrusted' }] });
  assert.deepEqual(value.embodiments, [binding]); assert.notEqual(value.embodiments[0].position, binding.position);
  for (const embodiments of [[binding, binding], [{ ...binding, position: [NaN, 0, 0] }],
    [{ ...binding, color: 'url(javascript:x)' }], [{ ...binding, shared: 'yes' }], [{ ...binding, worldId: '' }]]) {
    assert.throws(() => normalizeAgentInput({ name: 'Ada', embodiments }));
  }
});
test('public body whitelist never includes private instructions, memory, caption or owner-supplied authority', () => {
  const body = normalizePublicAgent({ agentId: 'a', name: 'Ada', ...binding, status: 'paused',
    goals: ['secret'], identity: { instructions: 'secret' }, caption: 'private reply', ownerPeerId: 'spoof' });
  assert.deepEqual(Object.keys(body).sort(), ['agentId', 'color', 'name', 'position', 'status']);
  assert.throws(() => normalizePublicAgent({ ...body, name: 'é'.repeat(121) }));
});
test('visitor channels isolate complete turns from both private console and other visitors', () => {
  const events = ['owner', 'visitor-a', 'visitor-b', undefined].flatMap((conversationId, i) => [
    { type: 'request', operationId: String(i), conversationId, text: `question-${i}` },
    { type: 'result', operationId: String(i), conversationId, text: `secret-${i}` },
  ]);
  const head = normalizeAgentInput({ name: 'Ada' });
  const packed = packAgentContext(head, normalizeAgentTask({ prompt: 'Now', conversationId: 'visitor-a', worldContext: '{"position":[1,2,3]}' }), events);
  assert.deepEqual(packed.messages.slice(1).map((message) => message.content), ['question-1', 'secret-1', 'Now']);
  assert.match(packed.messages[0].content, /World|world/);
  const privateContext = packAgentContext(head, normalizeAgentTask({ prompt: 'Private' }), events);
  assert.deepEqual(privateContext.messages.slice(1).map((message) => message.content), ['question-3', 'secret-3', 'Private']);
  for (const conversationId of [123, {}, '', 'x\ny', 'x'.repeat(129)]) assert.throws(() => normalizeAgentTask({ prompt: 'x', conversationId }));
  assert.throws(() => normalizeAgentTask({ prompt: 'x', worldContext: 'é'.repeat(4097) }));
});
test('body bindings and isolated journal events survive acknowledged IndexedDB commits and body removal', async (t) => {
  const indexedDBImpl = new IDBFactory();
  const store = new AgentRecordStore({ indexedDBImpl, keyRange: IDBKeyRange,
    lockManager: { request: async (_name, _options, callback) => callback({}) } });
  await store.open();
  const candidate = { key: 'local', manifestCid: 'model', sessionId: 'session', local: true, available: true,
    runtime: 'transformers.js', task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
  const calls = [];
  const runtime = new AgentRuntime({ store, inference: { listCandidates: async () => [candidate],
    generate: async (_selected, input) => { calls.push(input); return { text: `response-${calls.length}` }; }, cancel: async () => {} } });
  t.after(async () => { await runtime.dispose(); await store.destroy(); });
  const head = await runtime.create({ name: 'Ada', embodiments: [binding] }); await runtime.resume(head.agentId);
  await runtime.run(head.agentId, { prompt: 'Alpha private', conversationId: 'alpha' });
  await runtime.run(head.agentId, { prompt: 'Beta private', conversationId: 'beta' });
  await runtime.run(head.agentId, { prompt: 'Alpha again', conversationId: 'alpha' });
  assert.equal(JSON.stringify(calls[1].messages).includes('Alpha private'), false);
  assert.equal(JSON.stringify(calls[2].messages).includes('Alpha private'), true);
  assert.equal(JSON.stringify(calls[2].messages).includes('Beta private'), false);
  assert.deepEqual((await runtime.get(head.agentId)).embodiments, [binding]);
  const events = await runtime.events(head.agentId);
  assert.deepEqual(events.filter((event) => event.type === 'result').map((event) => event.conversationId), ['alpha', 'beta', 'alpha']);
  const current = await runtime.get(head.agentId);
  await runtime.update(head.agentId, { embodiments: [] }, { expectedRevision: current.revision });
  assert.deepEqual((await runtime.get(head.agentId)).embodiments, []);
  assert.equal((await runtime.events(head.agentId)).filter((event) => event.type === 'result').length, 3);
});

test('appearance references are private and world-chat replies default off', () => {
  const face = { sha256: 'a'.repeat(64), width: 256, height: 256, channels: 4, attachmentId: 'private-image' };
  const value = normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, respondToWorldChat: undefined,
    appearancePrompt: 'A bright robot', appearanceRequestId: 'request-1', face }] });
  assert.equal(value.embodiments[0].respondToWorldChat, false);
  assert.deepEqual(value.embodiments[0].face, face);
  const publicBody = normalizePublicAgent({ ...bodyForFace(), face, appearancePrompt: 'private', respondToWorldChat: true });
  assert.deepEqual(publicBody.face, { sha256: face.sha256, width: 256, height: 256, channels: 4 });
  assert.equal('respondToWorldChat' in publicBody, false); assert.equal('appearancePrompt' in publicBody, false);
  for (const change of [{ width: 257 }, { channels: 3 }, { sha256: 'https://remote/image' }, { height: 0 }]) {
    assert.throws(() => normalizeAgentInput({ name: 'A', embodiments: [{ ...binding, face: { ...face, ...change } }] }));
  }
  assert.throws(() => normalizeAgentInput({ name: 'A', embodiments: [{ ...binding, respondToWorldChat: 'yes' }] }));
  assert.throws(() => normalizeAgentInput({ name: 'A', embodiments: [{ ...binding, appearancePrompt: 'é'.repeat(1025) }] }));
});
function bodyForFace() { return { agentId: 'agent', name: 'Ada', color: '#44ffaa', position: [0, 3, 0], status: 'idle' }; }

test('automatic reflection preference persists without entering the public body directory', () => {
  for (const autonomous of [true, false]) {
    const value = normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, autonomous }] });
    assert.equal(value.embodiments[0].autonomous, autonomous);
    assert.equal('autonomous' in normalizePublicAgent({ ...bodyForFace(), autonomous }), false);
  }
  assert.throws(() => normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, autonomous: 'yes' }] }));
});

test('cloning requires explicit owner preference and movement is a bounded persisted preference', () => {
  const legacy = normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, allowCloning: undefined }] });
  assert.equal(legacy.embodiments[0].allowCloning, false);
  assert.equal(legacy.embodiments[0].shareMemories, false);
  const current = normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, allowCloning: true, movement: 'follow' }] });
  assert.equal(current.embodiments[0].allowCloning, true); assert.equal(current.embodiments[0].movement, 'follow');
  assert.equal(normalizePublicAgent({ ...bodyForFace(), cloneable: true }).cloneable, true);
  assert.equal(normalizePublicAgent({ ...bodyForFace(), cloneable: true, sharesMemories: true }).sharesMemories, true);
  for (const change of [{ movement: 'run-code' }, { allowCloning: 'yes' }, { shareMemories: 'yes' }]) assert.throws(() => normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, ...change }] }));
  assert.throws(() => normalizePublicAgent({ ...bodyForFace(), cloneable: 'yes' }));
});


test('private history sharing defaults off and public permission requires all owner grants', () => {
  const legacy = normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, sharePrivateMemories: undefined }] });
  assert.equal(legacy.embodiments[0].sharePrivateMemories, false);
  const granted = normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, sharePrivateMemories: true }] });
  assert.equal(granted.embodiments[0].sharePrivateMemories, true);
  for (const grants of [{}, { cloneable: true }, { sharesMemories: true }]) {
    assert.equal(normalizePublicAgent({ ...bodyForFace(), ...grants, sharesPrivateMemories: true }).sharesPrivateMemories, false);
  }
  assert.equal(normalizePublicAgent({ ...bodyForFace(), cloneable: true, sharesMemories: true, sharesPrivateMemories: true }).sharesPrivateMemories, true);
  assert.throws(() => normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, sharePrivateMemories: 'yes' }] }));
  assert.throws(() => normalizePublicAgent({ ...bodyForFace(), sharesPrivateMemories: 'yes' }));
});

test('conversation initiative is a separate explicit persisted consent and legacy bindings stay off', () => {
  const legacy = normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, initiateConversations: undefined, respondToWorldChat: true }] });
  assert.equal(legacy.embodiments[0].initiateConversations, false);
  assert.equal(legacy.embodiments[0].respondToWorldChat, true);
  const enabled = normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, initiateConversations: true }] });
  assert.equal(enabled.embodiments[0].initiateConversations, true);
  assert.equal(enabled.embodiments[0].respondToWorldChat, false);
  for (const invalid of ['yes', 1, null, {}]) assert.throws(() => normalizeAgentInput({ name: 'Ada', embodiments: [{ ...binding, initiateConversations: invalid }] }), /initiative/);
  const body = normalizePublicAgent({ ...bodyForFace(), initiateConversations: true, socialStatus: 'considering' });
  assert.equal(Object.hasOwn(body, 'initiateConversations'), false);
  assert.equal(Object.hasOwn(body, 'socialStatus'), false);
});

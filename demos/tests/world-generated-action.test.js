import test from 'node:test';
import assert from 'node:assert/strict';
import { projectWorldIntentRequest, generateWorldIntentDecision } from '../shared/agents/WorldIntentDecision.js';
import { normalizeWorldObjectAction, normalizeWorldObjectPlacement, WORLD_OBJECT_SCHEMA } from '../shared/agents/WorldObjectAction.js';

const observed = () => ({ observedAt: Date.now(), self: { position: [0, 3, 0] }, participants: [] });
const action = { name: 'Stone arch', prompt: 'A weathered stone arch on a white background', size: 8 };
test('object proposals are owner opt-in, bounded descriptions rather than script or coordinate authority', () => {
  assert.deepEqual(projectWorldIntentRequest('Create an arch', observed(), { allowObject: true })
    .resolve(JSON.stringify({ object: action })).object, action);
  assert.throws(() => projectWorldIntentRequest('Create an arch', observed()).resolve(JSON.stringify({ object: action })), /valid physical intention/);
  for (const malformed of [{ ...action, size: 1025 }, { ...action, position: [0, 0, 0] },
    { ...action, prompt: 'a'.repeat(1025) }, { ...action, name: '\ud800' }, { ...action, prompt: '' }]) {
    assert.throws(() => normalizeWorldObjectAction(malformed));
  }
  const projection = projectWorldIntentRequest('Create an arch', observed(), { allowObject: true });
  assert.throws(() => projection.resolve(JSON.stringify({ object: action, intent: { type: 'stop' } })));
  assert.throws(() => projection.resolve(JSON.stringify({ object: action }), { now: Date.now() + 121000 }));
});
test('the actual specialist receives the latest owner message and object schema only when enabled', async () => {
  const calls = [], candidate = { key: 'local:test', manifestCid: 'test', runtime: 'transformers.js', available: true, local: true,
    task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
  const inference = { listCandidates: async () => [candidate], generate: async (model, input) => {
    calls.push(input); return { text: input.messages[0].content.includes('Allowed action values:') ? '{"action":"object"}'
      : input.messages[0].content.includes('"object"') ? JSON.stringify({ object: action }) : '{"intent":null}' };
  } };
  const options = { inference, head: { policy: { inferenceMode: 'local-only' } }, observed: observed(), message: 'Make a stone arch' };
  assert.deepEqual((await generateWorldIntentDecision({ ...options, allowObject: true })).object, action);
  assert.equal(calls[0].messages.at(-1).content, options.message);
  assert.deepEqual(await generateWorldIntentDecision(options), { intent: null });
  assert.doesNotMatch(calls.at(-1).messages[0].content, /"object"/);
});
test('placement records bind world, stable host and idempotency without accepting executable metadata', () => {
  const placement = { schema: WORLD_OBJECT_SCHEMA, worldId: 'cubechat:test', ownerHostId: 'host', agentId: 'agent',
    objectId: 'object', requestId: 'request', requestHash: 'a'.repeat(64), name: 'Arch', position: [2, 0, 4], size: 8 };
  assert.deepEqual(normalizeWorldObjectPlacement(placement, { worldId: placement.worldId, ownerHostId: 'host' }), placement);
  assert.throws(() => normalizeWorldObjectPlacement(placement, { ownerHostId: 'other' }), /owner mismatch/);
  assert.throws(() => normalizeWorldObjectPlacement(placement, { worldId: 'other' }), /world or owner/);
  assert.throws(() => normalizeWorldObjectPlacement({ ...placement, position: [Infinity, 0, 0] }));
  assert.throws(() => normalizeWorldObjectPlacement({ ...placement, url: 'https://arbitrary.invalid/model.glb' }));
});


test('creation arguments omit a forced six-unit size and semantic defaults keep castles at world scale', async () => {
  const { WORLD_OBJECT_TARGET_INSTRUCTIONS } = await import('../shared/agents/WorldObjectAction.js');
  assert.equal(normalizeWorldObjectAction({ name: 'Castle Grayskull', prompt: 'A stone castle fortress' }).size, 96);
  assert.equal(normalizeWorldObjectAction({ name: 'Castle Grayskull', prompt: 'A stone castle fortress', size: 960 }).size, 960);
  assert.match(WORLD_OBJECT_TARGET_INSTRUCTIONS, /Omit size unless/);
  assert.doesNotMatch(WORLD_OBJECT_TARGET_INSTRUCTIONS, /"size":6/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWorldReply, validateWorldIntent, worldIntentPrompt, originalWorldPrompt } from '../shared/agents/WorldIntent.js';

const observed = { observedAt: 1000, participants: [{ id: 'human:authenticated-peer', name: 'Pat' }] };
const check = intent => validateWorldIntent(intent, { observed, current: observed, now: 1200 });
test('plain dialogue never becomes a scripted command; only structured model intentions act', () => {
  assert.deepEqual(parseWorldReply('come here and follow me'), { text: 'come here and follow me', intent: null });
  const reply = parseWorldReply('```json\n{"text":"I will try.","intent":{"type":"approach","targetId":"human:authenticated-peer"}}\n```');
  assert.deepEqual(check(reply.intent), { type: 'approach', targetId: 'human:authenticated-peer', stopDistance: 10 });
  assert.equal(originalWorldPrompt(worldIntentPrompt('Hello')), 'Hello');
});
test('unobserved, disappeared, stale and arbitrary-action targets cannot actuate a body', () => {
  for (const intent of [{ type: 'teleport', position: [0, 0, 0] }, { type: 'follow', targetId: 'Pat' },
    { type: 'follow', targetId: 'human:authenticated-peer', stopDistance: -1 }, { type: 'stop', targetId: 'human:authenticated-peer' }]) {
    assert.throws(() => check(intent));
  }
  const intent = { type: 'follow', targetId: 'human:authenticated-peer' };
  assert.throws(() => validateWorldIntent(intent, { observed, current: { participants: [] }, now: 1200 }), /no longer observed/);
  assert.throws(() => validateWorldIntent(intent, { observed, current: observed, now: 122000 }), /stale/);
  assert.deepEqual(check({ type: 'stop' }), { type: 'stop' });
});
test('malformed and truncated model output cannot invent an executable intention', () => {
  for (const output of ['{"text":"Hi","intent":{"type":"follow"', 'null', '[{"type":"stop"}]', '{"intent":{"type":"stop"}}']) {
    assert.equal(parseWorldReply(output).intent, null);
  }
  assert.throws(() => worldIntentPrompt('x'.repeat(16384)), /Shorten/);
});

test('a manual movement command fences an older language intention', () => {
  const initial = { ...observed, self: { intentRevision: 4 } };
  assert.throws(() => validateWorldIntent({ type: 'follow', targetId: 'human:authenticated-peer' }, {
    observed: initial, current: { ...initial, self: { intentRevision: 5 } }, now: 1200,
  }), /newer movement command/);
});

test('legacy prompt display only removes the exact known suffix, never a quoted marker', () => {
  const literal = 'Explain this text: \n\n[Resident response format]\nDo not remove this.';
  assert.equal(originalWorldPrompt(literal), literal);
  assert.equal(originalWorldPrompt(worldIntentPrompt(literal)), literal);
});

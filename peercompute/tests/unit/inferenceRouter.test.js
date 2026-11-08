import test from 'node:test';
import assert from 'node:assert/strict';
import { supportsTask, routeInferenceTask } from '../../src/peercompute/inference/InferenceRouter.js';

const model = (key, task, local = true, extra = {}) => ({ key: `${local ? 'local' : 'peer'}:${key}`, manifestCid: key,
  name: key, runtime: 'fixture', task, local, available: true, busy: false, queuedRequests: 0, queueCapacity: 4,
  modalities: task === 'automatic-speech-recognition' ? ['audio'] : task === 'image-text-to-text' ? ['text', 'image'] : ['text'],
  outputModalities: task === 'text-to-speech' ? ['audio'] : task === 'text-to-image' ? ['image'] : ['text'], ...extra });
test('all five tasks require real matching input and output capabilities', () => {
  for (const task of ['text-generation', 'image-text-to-text', 'text-to-image', 'automatic-speech-recognition', 'text-to-speech']) {
    const candidate = model(task, task);
    assert(supportsTask(candidate, task));
    assert.equal(routeInferenceTask({ task, candidates: [candidate] }).candidate.manifestCid, task);
    assert(!supportsTask({ ...candidate, outputModalities: [] }, task));
    assert(!supportsTask({ ...candidate, modalities: [] }, task));
  }
  assert(supportsTask(model('vision', 'image-text-to-text'), 'text-generation'));
  assert(!supportsTask(model('text', 'text-generation'), 'image-text-to-text'));
});
test('mixed prefers a bounded busy local queue; full or unavailable locals permit peer selection', () => {
  const local = model('local', 'text-generation', true, { busy: true, queuedRequests: 3 });
  const peer = model('peer', 'text-generation', false);
  assert.equal(routeInferenceTask({ task: local.task, mode: 'mixed', candidates: [peer, local] }).candidate.local, true);
  for (const extra of [{ queuedRequests: 4 }, { queueAvailable: false }, { available: false }]) {
    assert.equal(routeInferenceTask({ task: local.task, mode: 'mixed', candidates: [{ ...local, ...extra }, peer] }).candidate.local, false);
  }
  assert.throws(() => routeInferenceTask({ task: local.task, mode: 'local', candidates: [peer] }), { code: 'ERR_INFERENCE_NO_MODEL' });
  assert.throws(() => routeInferenceTask({ task: local.task, mode: 'peers', candidates: [local] }), { code: 'ERR_INFERENCE_NO_MODEL' });
});
test('ranking is deterministic and returned snapshots cannot mutate the source', () => {
  const first = model('a', 'text-generation'), second = model('b', 'text-generation');
  const a = routeInferenceTask({ task: first.task, candidates: [second, first] });
  const b = routeInferenceTask({ task: first.task, candidates: [first, second] });
  assert.deepEqual(a, b); a.candidate.modalities.push('image'); assert.deepEqual(first.modalities, ['text']);
  assert.throws(() => routeInferenceTask({ task: first.task, mode: 'unknown', candidates: [first] }));
});

test('exact task specialization wins over a compatible vision superset within the same locality and busy tier', () => {
  const text = model('z-text', 'text-generation'), vision = model('a-vision', 'image-text-to-text');
  assert.equal(routeInferenceTask({ task: 'text-generation', candidates: [vision, text] }).candidate.key, text.key);
  assert.equal(routeInferenceTask({ task: 'image-text-to-text', candidates: [text, vision] }).candidate.key, vision.key);
  assert.equal(routeInferenceTask({ task: 'text-generation', candidates: [vision, { ...text, busy: true }] }).candidate.key, vision.key);
  assert.equal(routeInferenceTask({ task: 'text-generation', mode: 'mixed', candidates: [vision, { ...text, local: false }] }).candidate.key, vision.key);
});

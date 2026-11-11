import test from 'node:test';
import assert from 'node:assert/strict';
import { supportsTask, supportsInferenceInput, inferInferenceTask, routeInferenceTask } from '../../src/peercompute/inference/InferenceRouter.js';

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

test('native media conversation is capability-based and stays separate from ASR and TTS', () => {
  const unified = model('unified', 'text-generation', true, { modalities: ['text', 'image', 'audio'] });
  for (const task of ['text-generation', 'image-text-to-text', 'audio-text-to-text']) {
    assert(supportsTask(unified, task));
    const { route } = routeInferenceTask({ task, candidates: [unified] });
    assert.equal(route.task, task); assert.equal(route.modelTask, 'text-generation');
  }
  assert(!supportsTask(unified, 'automatic-speech-recognition'));
  assert(!supportsTask(unified, 'text-to-speech'));
  assert(!supportsTask(model('asr', 'automatic-speech-recognition'), 'audio-text-to-text'));
  assert.equal(inferInferenceTask({ audio: {} }), 'automatic-speech-recognition');
  assert.equal(inferInferenceTask({ audio: {}, prompt: 'What is happening?' }), 'audio-text-to-text');
  assert.equal(inferInferenceTask({ audio: {}, task: 'audio-text-to-text' }), 'audio-text-to-text');
  assert.equal(inferInferenceTask({ image: {} }), 'image-text-to-text');
  assert(supportsInferenceInput(unified, { audio: {}, image: {}, prompt: 'Compare them.' }));
  assert(!supportsInferenceInput({ ...unified, modalities: ['text', 'audio'] }, { audio: {}, image: {}, prompt: 'Compare them.' }));
});

test('combined-media routing requires one capable host with capacity, not a union of separate hosts', () => {
  const group = model('unified', 'text-generation', false, { modalities: ['text', 'image', 'audio'], hosts: [
    { task: 'text-generation', modalities: ['text', 'audio'], outputModalities: ['text'], busy: false },
    { task: 'text-generation', modalities: ['text', 'image', 'audio'], outputModalities: ['text'], busy: true, queuedRequests: 4 },
  ] });
  const input = { task: 'audio-text-to-text', mode: 'peers', inputModalities: ['image', 'audio'], candidates: [group] };
  assert.throws(() => routeInferenceTask(input), { code: 'ERR_INFERENCE_NO_MODEL' });
  group.hosts[1].queuedRequests = 3;
  assert.equal(routeInferenceTask(input).candidate.manifestCid, group.manifestCid);
  assert.throws(() => routeInferenceTask({ ...input, inputModalities: ['video'] }), /policy/);
});

test('a peer group cannot inherit media capabilities from a filtered local host', () => {
  const group = model('unified', 'text-generation', false, { modalities: ['text', 'image', 'audio'], hosts: [
    { local: true, task: 'text-generation', modalities: ['text', 'image', 'audio'], outputModalities: ['text'] },
    { local: false, task: 'text-generation', modalities: ['text'], outputModalities: ['text'] },
  ] });
  assert(supportsTask(group, 'audio-text-to-text'));
  const remoteOnly = { ...group, hosts: group.hosts.filter((host) => !host.local) };
  assert(supportsTask(remoteOnly, 'text-generation'));
  assert(!supportsTask(remoteOnly, 'audio-text-to-text'));
  assert(!supportsTask(remoteOnly, 'image-text-to-text'));
  assert(!supportsTask({ ...group, hosts: [] }, 'text-generation'));
});

test('mesh generation is an explicit separate capability and never captures attached-image chat', () => {
  const mesh = model('mesh', 'image-to-3d', true, { modalities: ['image'], outputModalities: ['mesh'] });
  const remoteMesh = { ...mesh, local: false, key: 'peer:mesh' };
  const vision = model('vision', 'image-text-to-text');
  assert(supportsTask(mesh, 'image-to-3d'));
  assert(!supportsTask(mesh, 'image-text-to-text')); assert(!supportsTask(vision, 'image-to-3d'));
  assert.equal(inferInferenceTask({ image: {} }), 'image-text-to-text');
  assert.equal(routeInferenceTask({ task: 'image-to-3d', mode: 'mixed', inputModalities: ['image'],
    candidates: [remoteMesh, vision, mesh] }).candidate.local, true);
  assert.equal(routeInferenceTask({ task: 'image-to-3d', mode: 'mixed',
    candidates: [{ ...mesh, available: false }, remoteMesh] }).candidate.local, false);
  assert.throws(() => routeInferenceTask({ task: 'image-to-3d', candidates: [vision] }), { code: 'ERR_INFERENCE_NO_MODEL' });
});

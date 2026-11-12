import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWorldMesh } from '../shared/agents/WorldMeshGeneration.js';
import { imageFixture, meshFixture } from './world-generated-fixtures.js';

function provider(task, id, local = false) {
  return { key: `${local ? 'local' : 'peer'}:${id}`, manifestCid: id, sessionId: id,
    local, available: true, task, runtime: 'fixture',
    modalities: [task === 'image-to-3d' ? 'image' : 'text'],
    outputModalities: [task === 'image-to-3d' ? 'mesh' : 'image'] };
}

function fixture({ mode = 'network-assisted', local = false } = {}) {
  const image = provider('text-to-image', 'image', local), mesh = provider('image-to-3d', 'mesh', local);
  const queries = [], calls = [], output = meshFixture();
  const state = { providers: [image, mesh], current: true, afterImage: () => {}, beforeList: () => {}, meshError: null };
  const controller = new AbortController();
  const inference = {
    async listCandidates(query) { queries.push(query); await state.beforeList(query); return state.providers; },
    async generate(candidate, input) {
      calls.push({ candidate, input });
      if (input.task === 'text-to-image') { await state.afterImage(); return { image: imageFixture() }; }
      if (state.meshError) throw state.meshError;
      return { mesh: output };
    },
  };
  const generate = options => generateWorldMesh({ inference, head: { policy: { inferenceMode: mode } },
    description: 'A copper robot', name: 'Robot', signal: controller.signal,
    assertCurrent: () => { if (!state.current) throw new Error('Resident ownership changed'); }, ...options });
  return { generate, state, calls, queries, output, controller, image, mesh };
}

test('missing mesh provider fails before paying for a reference image', async () => {
  const f = fixture(); f.state.providers = [f.image];
  await assert.rejects(f.generate(), /No 3D generation model is available/);
  assert.equal(f.calls.length, 0);
  assert.deepEqual(f.queries.map(query => query.task), ['image-to-3d']);
});

test('a mesh host disappearing during image generation is never dispatched from the old snapshot', async () => {
  const f = fixture(); f.state.afterImage = () => { f.state.providers = [f.image]; };
  await assert.rejects(f.generate(), /No 3D generation model is available/);
  assert.deepEqual(f.calls.map(call => call.input.task), ['text-to-image']);
  assert.deepEqual(f.queries.map(query => query.task), ['image-to-3d', 'text-to-image', 'image-to-3d']);
  assert(f.queries.every(query => query.refresh === true));
});

test('a replacement mesh provider receives the generated image under the same routing policy', async () => {
  const f = fixture(), replacement = provider('image-to-3d', 'replacement');
  f.state.afterImage = () => { f.state.providers = [f.image, replacement]; };
  const result = await f.generate();
  assert.equal(result.sha256, f.output.sha256);
  assert.deepEqual(f.calls.map(call => call.candidate.key), [f.image.key, replacement.key]);
  assert.deepEqual(f.calls[1].input.image, imageFixture());
  assert(f.queries.every(query => query.mode === 'network-assisted' && query.refresh === true));
  assert.notEqual(f.calls[0].input.requestId, f.calls[1].input.requestId);
});

test('local-only does not use a peer replacement after the local mesh model disappears', async () => {
  const f = fixture({ mode: 'local-only', local: true });
  f.state.afterImage = () => { f.state.providers = [f.image, provider('image-to-3d', 'remote')]; };
  await assert.rejects(f.generate(), /No 3D generation model is available/);
  assert.deepEqual(f.calls.map(call => call.input.task), ['text-to-image']);
  assert(f.queries.every(query => query.mode === 'local-only'));
});

for (const duringRefresh of [false, true]) {
  test(`cancellation ${duringRefresh ? 'during final discovery' : 'after image generation'} prevents mesh dispatch`, async () => {
    const f = fixture();
    if (duringRefresh) f.state.beforeList = () => { if (f.queries.length === 3) f.controller.abort(); };
    else f.state.afterImage = () => f.controller.abort();
    await assert.rejects(f.generate(), { name: 'AbortError' });
    assert.deepEqual(f.calls.map(call => call.input.task), ['text-to-image']);
  });
  test(`ownership change ${duringRefresh ? 'during final discovery' : 'after image generation'} prevents mesh dispatch`, async () => {
    const f = fixture();
    if (duringRefresh) f.state.beforeList = () => { if (f.queries.length === 3) f.state.current = false; };
    else f.state.afterImage = () => { f.state.current = false; };
    await assert.rejects(f.generate(), /Resident ownership changed/);
    assert.deepEqual(f.calls.map(call => call.input.task), ['text-to-image']);
  });
}

test('a generation failure is returned unchanged without retrying either model', async () => {
  const f = fixture(), failure = new Error('Model session lost: 3D model is not ready');
  f.state.meshError = failure;
  await assert.rejects(f.generate(), error => error === failure);
  assert.deepEqual(f.calls.map(call => call.input.task), ['text-to-image', 'image-to-3d']);
  assert.equal(f.queries.length, 3);
});

test('a supplied image skips image inference and still dispatches a freshly selected mesh provider', async () => {
  const f = fixture(), image = imageFixture(), replacement = provider('image-to-3d', 'replacement');
  f.state.beforeList = () => { if (f.queries.length === 2) f.state.providers = [replacement]; };
  await f.generate({ image });
  assert.deepEqual(f.queries.map(query => query.task), ['image-to-3d', 'image-to-3d']);
  assert.deepEqual(f.calls.map(call => call.candidate.key), [replacement.key]);
  assert.deepEqual(f.calls[0].input.image.data, image.data);
  assert.notEqual(f.calls[0].input.image.data, image.data);
});

test('trusted exact prompt preserves all supplied text without decoration or whitespace changes', async () => {
  const f = fixture(), description = '  Copper robot\nengraved with "A&B" 🛠️  ';
  await f.generate({ description, exactPrompt: true });
  assert.equal(f.calls[0].input.task, 'text-to-image');
  assert.equal(f.calls[0].input.prompt, description);
});

test('ordinary prompts retain the reference-image guidance by default and when explicitly selected', async () => {
  for (const options of [{}, { exactPrompt: false }]) {
    const f = fixture(); await f.generate(options);
    assert.equal(f.calls[0].input.prompt, 'A copper robot. Single isolated object, plain white background, no text.');
  }
});

test('invalid exact-prompt values reject before provider discovery or inference', async () => {
  for (const exactPrompt of ['true', 'false', 0, 1, null, {}, []]) {
    const f = fixture();
    await assert.rejects(f.generate({ exactPrompt }), { name: 'TypeError', message: 'Exact prompt must be a boolean' });
    assert.equal(f.queries.length, 0); assert.equal(f.calls.length, 0);
  }
});

test('exact-prompt mode does not generate a reference image when pixels are already supplied', async () => {
  const f = fixture(); await f.generate({ image: imageFixture(), exactPrompt: true });
  assert.deepEqual(f.calls.map(call => call.input.task), ['image-to-3d']);
});

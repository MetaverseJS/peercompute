import test from 'node:test';
import assert from 'node:assert/strict';
import { observeVision, WORLD_VISION_INSTRUCTIONS } from '../shared/agents/WorldVision.js';

const candidate = (local, patch = {}) => ({ key: `${local ? 'local' : 'peer'}:vision`, manifestCid: 'vision', runtime: 'transformers',
  local, available: true, task: 'image-text-to-text', modalities: ['text', 'image'], outputModalities: ['text'], ...patch });
function fixture(mode = 'network-assisted') {
  const calls = [], self = { id: 'resident:owner:ada', agentId: 'ada', ownerPeerId: 'owner', status: 'idle', intentRevision: 4 };
  const head = { policy: { inferenceMode: mode }, identity: { instructions: 'PRIVATE_IDENTITY' }, goals: ['PRIVATE_GOAL'], context: { summary: 'PRIVATE_MEMORY' } };
  const frame = () => ({ pixels: { width: 2, height: 2, channels: 4, data: new Uint8Array(16).fill(90) },
    observedAt: Date.now(), pose: { position: [10, 4.8, 20], direction: [0, 0, 1] }, intentRevision: 4 });
  const adapter = { observe: () => ({ self: { ...self } }), captureVision: async (...args) => { calls.push(['capture', ...args]); return frame(); } };
  const inference = { listCandidates: async input => { calls.push(['list', input]); return [candidate(false), candidate(true)]; },
    generate: async (...args) => { calls.push(['generate', ...args]); return { text: 'A blue cube stands ahead.' }; } };
  return { calls, self, head, adapter, inference, frame, run: (extra = {}) => observeVision({ adapter, inference, head, key: 'local:ada', ...extra }) };
}

test('vision discovers a capable local-first provider before capturing and returns attributed descriptions without pixels', async () => {
  const f = fixture(), signal = new AbortController().signal;
  const result = await f.run({ question: 'What is ahead?', signal });
  assert.deepEqual(f.calls.map(call => call[0]), ['list', 'capture', 'generate']);
  assert.deepEqual(f.calls[0][1], { mode: 'network-assisted', task: 'image-text-to-text', signal, refresh: true });
  const [, selected, input, options] = f.calls[2];
  assert.equal(selected.local, true); assert.equal(input.task, 'image-text-to-text');
  assert.equal(options.signal, signal); assert.equal(input.maxNewTokens, 192);
  assert.deepEqual(input.messages, [{ role: 'system', content: WORLD_VISION_INSTRUCTIONS }, { role: 'user', content: 'What is ahead?' }]);
  assert.equal(input.prompt, 'What is ahead?'); assert.equal(input.image.data.length, 16);
  assert.match(input.requestId, /^[a-f\d-]{36}$/); assert.doesNotMatch(JSON.stringify(f.calls), /PRIVATE_/);
  assert.equal(result.kind, 'model-description'); assert.equal(result.route.local, true);
  assert.equal(result.description, 'A blue cube stands ahead.'); assert(result.completedAt >= result.observedAt);
  assert.deepEqual(result.pose, { position: [10, 4.8, 20], direction: [0, 0, 1] });
  assert.equal(result.intentRevision, 4); assert(!('pixels' in result)); assert(!('image' in result));
});

test('local-only never captures or sends to a peer; network mode can select admitted vision but not an image generator', async () => {
  const f = fixture('local-only');
  f.inference.listCandidates = async () => [candidate(false), candidate(true, { task: 'text-to-image', outputModalities: ['image'] })];
  await assert.rejects(f.run(), { code: 'ERR_AGENT_NO_MODEL' }); assert.deepEqual(f.calls, []);
  f.head.policy.inferenceMode = 'network-assisted'; const result = await f.run();
  assert.equal(result.route.local, false); assert.equal(f.calls[1][1].local, false);
  f.inference.listCandidates = async () => [candidate(true, { modalities: ['text'] })];
  await assert.rejects(f.run(), { code: 'ERR_AGENT_NO_MODEL' }); assert.equal(f.calls.length, 2);
});

test('cancellation at discovery, capture or inference never returns stale visual results', async () => {
  for (const phase of ['before', 'discovery', 'capture', 'inference']) {
    const f = fixture(), controller = new AbortController(); let captures = 0, generated = 0;
    if (phase === 'before') controller.abort();
    f.inference.listCandidates = async () => { if (phase === 'discovery') controller.abort(); return [candidate(true)]; };
    f.adapter.captureVision = async () => { captures++; if (phase === 'capture') controller.abort(); return f.frame(); };
    f.inference.generate = async () => { generated++; controller.abort(); return { text: 'Late description' }; };
    await assert.rejects(f.run({ signal: controller.signal }), { name: 'AbortError' });
    assert.equal(captures, ['capture', 'inference'].includes(phase) ? 1 : 0);
    assert.equal(generated, phase === 'inference' ? 1 : 0);
  }
});

test('tightening an in-flight inference policy prevents dispatch to a previously selected peer', async () => {
  const f = fixture(); let dispatched = false;
  f.inference.listCandidates = async () => [candidate(false)];
  f.adapter.captureVision = async () => { f.head.policy.inferenceMode = 'local-only'; return f.frame(); };
  f.inference.generate = async () => { dispatched = true; return { text: 'Should not be sent' }; };
  await assert.rejects(f.run(), { code: 'ERR_WORLD_VISION_STALE' }); assert.equal(dispatched, false);
});

test('body replacement, pause or a new intent invalidates an asynchronous visual observation', async () => {
  for (const phase of ['discovery', 'capture', 'inference']) {
    for (const change of [() => ({ intentRevision: 5 }), () => ({ status: 'paused' }), () => ({ id: 'resident:new:ada' })]) {
      const f = fixture(); let generated = 0;
      f.inference.listCandidates = async () => { if (phase === 'discovery') Object.assign(f.self, change()); return [candidate(true)]; };
      f.adapter.captureVision = async () => { if (phase === 'capture') Object.assign(f.self, change()); return f.frame(); };
      f.inference.generate = async () => { generated++; Object.assign(f.self, change()); return { text: 'Late description' }; };
      await assert.rejects(f.run(), { code: 'ERR_WORLD_VISION_STALE' });
      assert.equal(generated, phase === 'inference' ? 1 : 0);
    }
  }
});

test('invalid or stale frames never reach inference and unavailable capture has a distinct capability error', async () => {
  const invalid = [null, { pixels: {} }, { observedAt: Date.now() - 30_001 }, { observedAt: Date.now() + 60_000 },
    { intentRevision: -1 }, { pose: { position: [NaN, 0, 0], direction: [0, 0, 1] } },
    { pixels: { width: 513, height: 2, channels: 4, data: new Uint8Array(513 * 2 * 4) } },
    { pixels: { width: 2, height: 2, channels: 4, data: new Uint8Array(15) } }];
  for (const patch of invalid) {
    const f = fixture(); f.adapter.captureVision = async () => patch === null ? null : { ...f.frame(), ...patch };
    await assert.rejects(f.run(), { code: 'ERR_WORLD_VISION_INVALID' }); assert.equal(f.calls.length, 1);
  }
  const f = fixture(); delete f.adapter.captureVision;
  await assert.rejects(f.run(), { code: 'ERR_WORLD_VISION_UNAVAILABLE' }); assert.deepEqual(f.calls, []);
});

test('each frame uses fresh pixels and only the current question, never earlier descriptions or chat', async () => {
  const f = fixture(); let original, imageNumber = 0;
  f.adapter.captureVision = async () => { original = f.frame(); original.pixels.data.fill(++imageNumber); return original; };
  const images = [], messages = [];
  f.inference.generate = async (_candidate, input) => {
    original.pixels.data.fill(255); original.pose.position[0] = 999;
    images.push([...input.image.data]); messages.push(input.messages);
    return { text: imageNumber === 1 ? 'Previous red room' : 'Current blue room' };
  };
  const one = await f.run({ question: 'First view?' }), two = await f.run({ question: 'Second view?' });
  assert(images[0].every(n => n === 1)); assert(images[1].every(n => n === 2));
  assert.equal(one.pose.position[0], 10); assert.equal(two.pose.position[0], 10);
  assert.equal(messages[1].length, 2); assert.equal(messages[1][1].content, 'Second view?');
  assert.doesNotMatch(JSON.stringify(messages[1]), /First view|Previous red room/);
});

test('descriptions have bounded valid Unicode and malformed outputs remain errors', async () => {
  const f = fixture(); f.inference.generate = async () => ({ text: '🌲'.repeat(1000) });
  const result = await f.run(); assert.equal(result.description, '🌲'.repeat(512));
  for (const text of [undefined, {}, '', '  ', 'bad\0text', 'x'.repeat(16_385)]) {
    f.inference.generate = async () => ({ text });
    await assert.rejects(f.run(), { code: 'ERR_WORLD_VISION_INVALID' });
  }
});

test('malformed questions and policies fail before discovery, capture or model calls', async () => {
  const f = fixture();
  for (const question of ['', '  ', '\0', '🌲'.repeat(513), {}]) await assert.rejects(f.run({ question }), { code: 'ERR_WORLD_VISION_INVALID' });
  f.head.policy.inferenceMode = 'anywhere'; await assert.rejects(f.run(), { code: 'ERR_WORLD_VISION_INVALID' });
  assert.deepEqual(f.calls, []);
});

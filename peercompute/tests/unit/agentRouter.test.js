import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAgentTask, packAgentContext, routeAgentTask } from '../../src/peercompute/agents/AgentRouter.js';
import { createAgentModelAdapter } from '../../../demos/inference/src/agentModelAdapter.js';

const local = { key: 'local', manifestCid: 'local-cid', sessionId: 'session-1', local: true, available: true,
  runtime: 'transformers.js', name: 'Local', task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
const remote = { ...local, key: 'peer:remote-cid', manifestCid: 'remote-cid', local: false, sessionId: undefined, name: 'Peer' };
const image = { width: 1, height: 1, channels: 4, data: new Uint8Array([255, 0, 0, 255]) };

test('baseline routing hard-filters policy and modalities before idle/local tie-breaking', () => {
  assert.equal(routeAgentTask({ task: 'text-generation', candidates: [remote, { ...local, busy: true }] }).candidate.local, true);
  assert.equal(routeAgentTask({ task: 'text-generation', inferenceMode: 'network-assisted', candidates: [remote, { ...local, busy: true }] }).candidate.local, false);
  assert.throws(() => routeAgentTask({ task: 'image-text-to-text', candidates: [local] }), { code: 'ERR_AGENT_NO_MODEL' });
  assert.throws(() => routeAgentTask({ task: 'text-generation', inferenceMode: 'unexpected', candidates: [remote] }));
  const vision = { ...local, task: 'image-text-to-text', modalities: ['text', 'image'] };
  assert.match(routeAgentTask({ task: 'text-generation', candidates: [vision] }).route.reason, /baseline.*not learned/);
  assert.throws(() => routeAgentTask({ task: 'text-to-image', candidates: [vision] }));
  assert.throws(() => routeAgentTask({ task: 'text-generation', candidates: [{ ...local, available: false }] }));
});

test('task normalization owns image bytes and bounds unsupported input before dispatch', () => {
  const input = normalizeAgentTask({ prompt: 'Describe it', image });
  assert.equal(input.task, 'image-text-to-text'); assert.notEqual(input.image.data, image.data);
  assert.throws(() => normalizeAgentTask({ task: 'text-generation', prompt: 'x', image }));
  assert.throws(() => normalizeAgentTask({ task: 'image-text-to-text', prompt: 'x' }));
  assert.throws(() => normalizeAgentTask({ task: 'text-to-image', prompt: 'é'.repeat(2049) }));
  assert.throws(() => normalizeAgentTask({ prompt: 'x', maxNewTokens: 1025 }));
  assert.throws(() => normalizeAgentTask({ task: 'execute-code', prompt: 'x' }));
});

test('context includes identity and complete successful turns, excludes failed and image-output history', () => {
  const head = { identity: { name: 'Ada', instructions: 'Be brief.' }, goals: ['Observe'], context: { summary: 'A red room.' } };
  const events = [{ type: 'request', operationId: 'a', task: 'text-generation', text: 'Earlier question' },
    { type: 'result', operationId: 'a', task: 'text-generation', text: 'Earlier answer' },
    { type: 'request', operationId: 'b', task: 'text-generation', text: 'Unanswered' },
    { type: 'result', operationId: 'c', task: 'text-to-image', text: 'Image output' }];
  const packed = packAgentContext(head, normalizeAgentTask({ prompt: 'Now' }), events);
  assert.match(packed.messages[0].content, /Ada.*\n.*Be brief/s); assert.match(packed.messages[0].content, /A red room/);
  assert.deepEqual(packed.messages.slice(1).map((x) => x.content), ['Earlier question', 'Earlier answer', 'Now']);
  const diffusion = packAgentContext(head, normalizeAgentTask({ task: 'text-to-image', prompt: 'A boat' }), events);
  assert.deepEqual(diffusion.messages, [{ role: 'user', content: 'A boat' }]);
});

test('context packing removes whole old turns and never truncates current instructions or prompt', () => {
  const events = Array.from({ length: 12 }, (_, i) => [{ type: 'request', operationId: `${i}`, text: 'q'.repeat(4000) },
    { type: 'result', operationId: `${i}`, text: 'a'.repeat(4000) }]).flat();
  const packed = packAgentContext({ identity: { name: 'Ada', instructions: 'Keep me' } }, normalizeAgentTask({ prompt: 'Latest' }), events);
  assert.equal(packed.messages.at(-1).content, 'Latest'); assert.equal(packed.messages.length % 2, 0);
  assert.match(packed.messages[0].content, /Keep me/); assert(packed.messages.length < 26);
  assert.throws(() => packAgentContext({ identity: { instructions: 'x'.repeat(65536) } }, normalizeAgentTask({ prompt: 'Latest' })));
});

test('new images use fresh visual context and follow-ups retain only the latest successful image exchange', () => {
  const head = { identity: { name: 'Ada', instructions: 'Be brief.' }, goals: ['Observe'], context: { summary: 'Prefer concise captions.' } };
  const turn = (id, task, question, answer) => [
    { type: 'request', operationId: id, task, text: question },
    { type: 'result', operationId: id, task, text: answer },
  ];
  const events = [
    ...turn('old-text', 'text-generation', 'Old question', 'Old answer'),
    ...turn('red', 'image-text-to-text', 'Describe red', 'A red square.'),
    ...turn('red-followup', 'text-generation', 'Is it bright?', 'Yes, bright red.'),
  ];
  const original = structuredClone(events);
  const fresh = packAgentContext(head, normalizeAgentTask({ prompt: 'Describe blue', image }), events);
  assert.deepEqual(fresh.messages.map((message) => message.role), ['system', 'user']);
  assert.match(fresh.messages[0].content, /Ada/); assert.match(fresh.messages[0].content, /Be brief/);
  assert.match(fresh.messages[0].content, /Prefer concise captions/); assert.match(fresh.messages[0].content, /Observe/);
  assert.equal(fresh.messages[1].content, 'Describe blue'); assert.deepEqual(events, original);

  const failed = [...events, { type: 'request', operationId: 'failed-blue', task: 'image-text-to-text', text: 'Describe blue' },
    { type: 'failed', operationId: 'failed-blue', text: 'Cancelled' }];
  assert.deepEqual(packAgentContext(head, normalizeAgentTask({ prompt: 'Continue' }), failed).messages.slice(1).map((message) => message.content),
    ['Describe red', 'A red square.', 'Is it bright?', 'Yes, bright red.', 'Continue']);

  const next = [...failed, ...turn('blue', 'image-text-to-text', 'Describe blue', 'A blue square.'),
    ...turn('blue-followup', 'text-generation', 'Is that dark?', 'Yes, dark blue.')];
  assert.deepEqual(packAgentContext(head, normalizeAgentTask({ prompt: 'Continue' }), next).messages.slice(1).map((message) => message.content),
    ['Describe blue', 'A blue square.', 'Is that dark?', 'Yes, dark blue.', 'Continue']);
  const empty = [...events, ...turn('empty-blue', 'image-text-to-text', 'Describe blue', '')];
  assert.deepEqual(packAgentContext(head, normalizeAgentTask({ prompt: 'Continue' }), empty).messages.slice(1),
    [{ role: 'user', content: 'Continue' }]);
});

function adapterFixture() {
  let status = { status: 'ready', sessionId: 'session-1', manifestCid: 'local-cid' };
  const calls = [];
  const runtime = { service: { getStatus: () => status },
    store: { async getManifest() { calls.push('manifest'); return { model: local }; } },
    listInferenceTargets: () => [local, remote],
    async refreshPeers() { calls.push('refresh'); },
    async generate(target, input) { calls.push({ target, input }); return { text: 'ok' }; },
    cancel: (id) => calls.push(`cancel:${id}`) };
  return { runtime, calls, setStatus(value) { status = value; }, adapter: createAgentModelAdapter(runtime) };
}
test('adapter local-only never discovers peers and pins the exact local session without creating workers', async () => {
  const f = adapterFixture(); const candidates = await f.adapter.listCandidates({ mode: 'local-only' });
  assert.equal(candidates.length, 1); assert.deepEqual(f.calls, ['manifest']);
  await f.adapter.generate(candidates[0], { prompt: 'x', requestId: 'r' });
  assert.equal(f.calls.at(-1).input.sessionId, 'session-1');
  f.setStatus({ status: 'ready', sessionId: 'replacement', manifestCid: 'local-cid' });
  assert.throws(() => f.adapter.generate(candidates[0], { prompt: 'x' }), { code: 'ERR_AGENT_STALE_MODEL' });
});
test('adapter network-assisted discovery preserves local fallback and rejects replacement during metadata read', async () => {
  const f = adapterFixture(); assert.equal((await f.adapter.listCandidates({ mode: 'network-assisted' })).length, 2);
  f.runtime.refreshPeers = async () => { throw new Error('Offline'); };
  assert.equal((await f.adapter.listCandidates({ mode: 'network-assisted' })).length, 1);
  f.runtime.store.getManifest = async () => { f.setStatus({ status: 'idle' }); return { model: local }; };
  assert.deepEqual(await f.adapter.listCandidates({ mode: 'local-only' }), []);
  await assert.rejects(f.adapter.listCandidates({ mode: 'unknown' }));
});

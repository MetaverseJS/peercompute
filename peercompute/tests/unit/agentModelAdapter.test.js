import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgentModelAdapter } from '../../../demos/inference/src/agentModelAdapter.js';

test('agents bind distinct resident sessions and mixed local execution does not need discovery', async () => {
  const calls = [], statuses = new Map(['a', 'b'].map((cid) => [cid, { status: 'ready', manifestCid: cid, sessionId: `session-${cid}` }]));
  const services = new Map([...statuses].map(([cid]) => [cid, { getStatus: () => statuses.get(cid) }]));
  const runtime = { service: services.get('a'), getServiceForModel: (cid) => services.get(cid),
    listInferenceTargets: () => [...statuses].map(([cid]) => ({ key: `local:${cid}`, manifestCid: cid, local: true, available: true,
      task: 'text-generation', modalities: ['text'], outputModalities: ['text'] })),
    store: { getManifest: async () => ({ model: { runtime: 'fixture', task: 'text-generation', modalities: ['text'], outputModalities: ['text'] } }) },
    refreshPeers: async () => { calls.push('discovery'); },
    generate: async (target, input) => { calls.push({ target, sessionId: input.sessionId }); return { text: 'ok' }; }, cancel() {} };
  const adapter = createAgentModelAdapter(runtime);
  const candidates = await adapter.listCandidates({ mode: 'network-assisted', task: 'text-generation' });
  assert.equal(candidates.length, 2); assert.deepEqual(calls, []);
  await adapter.generate(candidates[1], { prompt: 'Hello' });
  assert.deepEqual(calls, [{ target: 'local:b', sessionId: 'session-b' }]);
  statuses.set('b', { ...statuses.get('b'), sessionId: 'replaced' });
  assert.throws(() => adapter.generate(candidates[1], { prompt: 'Hello' }), { code: 'ERR_AGENT_STALE_MODEL' });
});

function capacityFixture() {
  const state = { full: true, sessionId: 'session-before', peers: [], refreshes: 0, generates: 0 };
  const status = () => ({ status: 'ready', manifestCid: 'local', sessionId: state.sessionId });
  const model = { runtime: 'fixture', task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
  const service = { getStatus: status };
  const runtime = { service, getServiceForModel: () => service,
    listInferenceTargets: () => [{ key: 'local:local', manifestCid: 'local', local: true, available: true,
      ...model, busy: state.full, queueAvailable: !state.full, queuedRequests: state.full ? 4 : 0, queueCapacity: 4 }, ...state.peers],
    store: { getManifest: async () => ({ model }) },
    refreshPeers: async () => { state.refreshes++; },
    generate: async () => { state.generates++; return { text: 'Only explicit dispatch executes' }; }, cancel() {} };
  return { state, model, adapter: createAgentModelAdapter(runtime) };
}

test('capacity waiting binds the current local session and never executes the queued prompt itself', async () => {
  const { state, adapter } = capacityFixture();
  const waiting = [];
  const selected = await adapter.waitForCandidate({ mode: 'local-only', task: 'text-generation', pollMs: 1, timeoutMs: 1000,
    onWaiting: event => { waiting.push(event); state.full = false; state.sessionId = 'session-recovered'; } });
  assert.equal(selected.candidate.sessionId, 'session-recovered');
  assert.equal(waiting[0].code, 'ERR_INFERENCE_BUSY'); assert.equal(state.refreshes, 0); assert.equal(state.generates, 0);
  await adapter.generate(selected.candidate, { prompt: 'The current request' }); assert.equal(state.generates, 1);
});

test('network-assisted selection can use a ready peer while a local queue is full', async () => {
  const { state, model, adapter } = capacityFixture();
  state.peers = [{ ...model, key: 'peer:other', manifestCid: 'other', available: true, local: false }];
  const selected = await adapter.waitForCandidate({ mode: 'network-assisted', task: 'text-generation', timeoutMs: 1000 });
  assert.equal(selected.candidate.key, 'peer:other'); assert.equal(state.refreshes, 1); assert.equal(state.generates, 0);
});

test('a local-only capacity wait never falls through to a peer and cancellation stops it', async () => {
  const { state, model, adapter } = capacityFixture(), controller = new AbortController();
  state.peers = [{ ...model, key: 'peer:other', manifestCid: 'other', available: true, local: false }];
  await assert.rejects(adapter.waitForCandidate({ mode: 'local-only', task: 'text-generation', signal: controller.signal,
    onWaiting: () => controller.abort() }), { name: 'AbortError' });
  assert.equal(state.refreshes, 0); assert.equal(state.generates, 0);
});

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

import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldResidentInspector } from '../shared/agents/WorldResidentInspector.js';

const worldId = 'cubechat:room', key = 'local:skeletor';
function fixture(overrides = {}) {
  const calls = [], state = {
    owned: true, closed: false,
    body: { key, agentId: 'skeletor', name: 'Skeletor', local: true, ownerPeerId: 'owner', status: 'idle', position: [1, 2, 3] },
    head: { agentId: 'skeletor', revision: 7, authority: { hostId: 'installation-a' }, status: 'waiting', pauseCause: null,
      identity: { name: 'Skeletor', instructions: 'Be curious.' }, context: { summary: 'Saved context' }, goals: ['Explore'],
      policy: { inferenceMode: 'network-assisted' }, embodiments: [{ worldId, position: [1, 2, 3], shared: true,
        allowCloning: true, autonomous: true, movement: 'self-directed', appearancePrompt: 'A purple wizard',
        shareMemories: true, sharePrivateMemories: false, respondToWorldChat: true, initiateConversations: true,
        standingGoal: { id: 'welcome', enabled: true, target: 'new-players', objective: 'Greet visitors' } }] },
    events: [], diagnostics: [], candidates: [{ name: 'Qwen', manifestCid: 'bafy-qwen', runtime: 'gguf', local: false,
      available: true, providerCount: 2, hosts: [{ peerId: 'host', secret: 'UNPROJECTED_HOST_DATA' }] }],
    facts: [{ kind: 'person', note: 'PRIVATE_FACT' }, { kind: 'place', label: 'PRIVATE_PLACE' }],
    goal: null, journalError: null
  };
  const getEvents = async (_id, options) => { calls.push(['events', options]); return state.events.filter(value => value.sequence > (options.after ?? 0)).slice(0, options.limit); };
  const inspector = createWorldResidentInspector({ worldId,
    getBody: value => { assert.equal(value, key); return state.body; }, owns: () => state.owned,
    getAgent: async id => { calls.push(['agent', id]); return state.head; }, getEvents,
    getKnowledge: async input => { calls.push(['memory', input]); return state.facts; },
    getObjective: async value => { calls.push(['objective', value]); return state.goal; },
    getStates: () => ({ worldChat: { status: 'waiting', reason: 'A model is busy', prompt: 'PRIVATE_STATE_PROMPT' },
      ooda: 'reflecting', social: 'ready', standing: 'observing', profile: 'idle', appearance: { appearanceStatus: 'ready' } }),
    getNavigation: () => ({ key, status: 'moving', type: 'follow', targetName: 'Owner', distance: 18, backend: 'webgpu', worker: true,
      progress: { distanceTravelled: 4, targetClear: true }, tensor: 'PRIVATE_TENSOR' }),
    getDiagnostics: () => ({
      list: async (scope, options) => { calls.push(['diagnostics', scope, options]); return state.diagnostics; },
      status: () => ({ persistent: true, open: true, dropped: 0, pending: 0, evicted: 0, lastError: state.journalError }),
      append: () => { throw new Error('Inspector must not write diagnostics'); }, clear: () => { throw new Error('Inspector must not clear diagnostics'); }
    }),
    getRuntime: () => ({ listInferenceTargets: () => { calls.push(['cached-targets']); return state.candidates; },
      refreshPeers: () => { throw new Error('No network discovery'); }, load: () => { throw new Error('No model loading'); },
      generate: () => { throw new Error('No inference'); }, connectBackend: () => { throw new Error('No network connection'); } }),
    isClosed: () => state.closed, ...overrides
  });
  return { inspector, state, calls, getEvents };
}
const saved = (sequence, type, extra = {}) => ({ agentId: 'skeletor', sequence, at: 1000 + sequence,
  type, operationId: `operation-${sequence}`, ...extra });
const diagnostic = (id, change = {}) => ({ id, agentId: 'skeletor', worldId, when: 2000, lastWhen: 2000,
  source: 'world-chat', stage: 'routing', status: 'waiting', severity: 'info', message: 'Waiting for capacity', ...change });

test('owned projection contains profile CAS revision, measured state and cached routes without starting work', async () => {
  const { inspector, state, calls } = fixture();
  state.events = [saved(1, 'result', { text: 'SECRET_ASSISTANT_REPLY', route: { modelName: 'Nano', local: false,
    manifestCid: 'bafy-nano', peerId: 'actual-host', runtime: 'transformers' } })];
  const snapshot = await inspector.read({ key });
  assert.equal(snapshot.local, true); assert.equal(snapshot.revision, 7); assert.equal(snapshot.profile.summary, 'Saved context');
  assert.equal(snapshot.profile.movement, 'self-directed'); assert.equal(snapshot.profile.respondToWorldChat, true);
  assert.equal(snapshot.runtime.worldChat.reason, 'A model is busy'); assert.equal(snapshot.runtime.appearance.status, 'ready');
  assert.equal(snapshot.navigation.distance, 18); assert.equal(snapshot.navigation.progress.targetClear, true);
  assert.deepEqual(snapshot.memorySummary, { people: 1, places: 1, total: 2 });
  assert.equal(snapshot.routing.lastModelLabel, 'Nano'); assert.equal(snapshot.routing.lastRoute.peerId, 'actual-host');
  assert.equal(snapshot.routing.candidates[0].providerCount, 2); assert.equal(snapshot.routing.candidates[0].kind, 'peer');
  assert.equal(calls.filter(([name]) => name === 'cached-targets').length, 1);
  const json = JSON.stringify(snapshot); for (const secret of ['SECRET_ASSISTANT_REPLY', 'PRIVATE_FACT', 'PRIVATE_PLACE', 'PRIVATE_STATE_PROMPT', 'PRIVATE_TENSOR', 'UNPROJECTED_HOST_DATA']) assert(!json.includes(secret));
  snapshot.profile.goals.push('mutated'); assert.deepEqual(state.head.goals, ['Explore']); inspector.dispose();
});

test('peer residents expose only public body metadata even when private fields are injected into that body', async () => {
  const { inspector, state, calls } = fixture();
  state.body = { ...state.body, local: false, cloneable: true, instructions: 'PRIVATE_INSTRUCTIONS', goals: ['PRIVATE_GOALS'],
    runtime: { error: 'PRIVATE_ERROR' }, profile: { summary: 'PRIVATE_SUMMARY' }, owner: { token: 'PRIVATE_TOKEN' } };
  const snapshot = await inspector.read({ key });
  assert.equal(snapshot.local, false); assert.equal(snapshot.permissions.clone, true); assert.equal(snapshot.permissions.edit, false);
  assert.deepEqual(calls, []); assert(!JSON.stringify(snapshot).includes('PRIVATE')); assert(!Object.hasOwn(snapshot, 'routing'));
  state.body.local = true; state.owned = false; assert.equal((await inspector.read({ key })).permissions.clone, false);
  assert.deepEqual(calls, []); inspector.dispose();
});

test('ownership loss during an asynchronous read rejects instead of returning a private snapshot', async () => {
  let finish; const gate = new Promise(resolve => { finish = resolve; });
  const { inspector, state } = fixture({ getKnowledge: () => gate });
  const pending = inspector.read({ key }); await new Promise(resolve => setImmediate(resolve));
  state.owned = false; finish([{ kind: 'place', note: 'PRIVATE_LATE_FACT' }]);
  await assert.rejects(pending, { name: 'AbortError' }); inspector.dispose();
});

test('body replacement, host closure, request abort and facade disposal fence late private reads', async () => {
  for (const change of ['identity', 'peer', 'closed', 'signal', 'dispose']) {
    let finish; const gate = new Promise(resolve => { finish = resolve; }); const controller = new AbortController();
    const { inspector, state } = fixture({ getKnowledge: () => gate });
    const pending = inspector.read({ key, signal: controller.signal }); await new Promise(resolve => setImmediate(resolve));
    if (change === 'identity') state.body.agentId = 'different';
    if (change === 'peer') state.body.ownerPeerId = 'different';
    if (change === 'closed') state.closed = true;
    if (change === 'signal') controller.abort();
    if (change === 'dispose') inspector.dispose();
    finish([]); await assert.rejects(pending, { name: 'AbortError' }); inspector.dispose();
  }
});

test('a changed head cannot substitute its newer revision onto an older captured profile', async () => {
  let finish; const gate = new Promise(resolve => { finish = resolve; });
  const { inspector, state } = fixture({ getKnowledge: () => gate });
  const pending = inspector.read({ key }); await new Promise(resolve => setImmediate(resolve));
  state.head.revision = 8; state.head.identity.name = 'Updated'; state.head.context.summary = 'New summary'; finish([]);
  const captured = await pending;
  assert.equal(captured.revision, 7); assert.equal(captured.profile.name, 'Skeletor'); assert.equal(captured.profile.summary, 'Saved context');
  const latest = await inspector.read({ key }); assert.equal(latest.revision, 8); assert.equal(latest.profile.name, 'Updated'); inspector.dispose();
});

test('binding removal or a changed local installation during reads revokes the result', async () => {
  for (const change of ['binding', 'installation']) {
    let finish; const gate = new Promise(resolve => { finish = resolve; });
    const { inspector, state } = fixture({ getKnowledge: () => gate });
    const pending = inspector.read({ key }); await new Promise(resolve => setImmediate(resolve));
    if (change === 'binding') state.head.embodiments = []; else state.head.authority.hostId = 'installation-b';
    finish([]); await assert.rejects(pending, { name: 'AbortError' }); inspector.dispose();
  }
});

test('saved event pagination reaches the latest failure, preserves actual routing and excludes conversation text', async () => {
  const { inspector, state, calls } = fixture();
  state.events = Array.from({ length: 256 }, (_, index) => saved(index + 1, index % 2 ? 'result' : 'request', {
    text: 'SECRET_TRANSCRIPT_' + index, route: { modelName: 'Old model', local: true, manifestCid: 'bafy-old' } }));
  state.events[254] = saved(255, 'failed', { text: 'The input exceeds the model context', errorCode: 'ERR_MODEL_CONTEXT_BUDGET',
    requestId: 'late-request', contextBudget: { inputTokens: 9999, contextTokens: 8192, reservedOutputTokens: 512, secret: 'PRIVATE_BUDGET' },
    route: { modelName: 'Nano', local: false, peerId: 'failed-host' } });
  state.events[255] = saved(256, 'recovered', { text: 'Recovery description' });
  state.diagnostics = [diagnostic('linked', { operationId: 'operation-255', lastWhen: 1300 })];
  const snapshot = await inspector.read({ key });
  assert.deepEqual(calls.filter(([name]) => name === 'events').map(([, options]) => options.after), [undefined, 100, 200]);
  assert.equal(snapshot.activity.length, 100); assert.equal(snapshot.runtime.status, 'waiting');
  assert.match(snapshot.runtime.error, /^Last failure: The input exceeds/); assert.equal(snapshot.runtime.lastFailure.source, 'world-chat');
  assert.equal(snapshot.runtime.lastFailure.code, 'ERR_MODEL_CONTEXT_BUDGET');
  assert.equal(snapshot.runtime.lastFailure.details.inputTokens, 9999); assert.equal(snapshot.runtime.lastFailure.route.peerId, 'failed-host');
  assert.equal(snapshot.routing.lastRoute.modelLabel, 'Old model', 'a rejected route must not claim successful inference');
  assert(!JSON.stringify(snapshot).includes('SECRET_TRANSCRIPT')); assert(!JSON.stringify(snapshot).includes('PRIVATE_BUDGET'));
  assert(snapshot.activity.every((row, index, all) => index === 0 || all[index - 1].when <= row.when)); inspector.dispose();
});

test('diagnostic storage and optional component failures stay visible without hiding the profile', async () => {
  const { inspector, state } = fixture({ getKnowledge: () => { throw new Error('Memory unavailable'); },
    getObjective: () => { throw new Error('Objectives unavailable'); } });
  state.journalError = { when: 3000, operation: 'write', code: 'QuotaExceededError', message: 'Disk write failed' };
  state.diagnostics = [diagnostic('bad', { agentId: 'other', message: 'PRIVATE_OTHER_AGENT' }),
    diagnostic('other-world', { worldId: 'elsewhere', message: 'PRIVATE_OTHER_WORLD' })];
  const snapshot = await inspector.read({ key });
  assert.equal(snapshot.profile.name, 'Skeletor'); assert.equal(snapshot.memorySummary, undefined); assert.equal(snapshot.objective, null);
  assert.equal(snapshot.diagnosticsStatus.lastError.code, 'QuotaExceededError');
  assert(snapshot.activity.some(value => value.source === 'storage' && value.message === 'Diagnostic storage: Disk write failed'));
  assert(snapshot.activity.some(value => value.message === 'memory unavailable: Memory unavailable'));
  assert(!JSON.stringify(snapshot).includes('PRIVATE_OTHER')); inspector.dispose();
});

test('local-only routing excludes peers and capabilities determine owner controls', async () => {
  const { inspector, state } = fixture({ canMemory: () => false, canGoals: () => false });
  state.head.policy.inferenceMode = 'local-only'; state.head.status = 'paused'; state.head.pauseCause = 'owner';
  state.candidates.push({ name: 'Local', available: true, local: true, manifestCid: 'bafy-local' },
    { name: 'Unavailable', local: true, available: false, manifestCid: 'bafy-nope' });
  const snapshot = await inspector.read({ key });
  assert.equal(snapshot.routing.mode, 'local-only'); assert.deepEqual(snapshot.routing.candidates.map(value => value.modelLabel), ['Local']);
  assert.equal(snapshot.permissions.memory, false); assert.equal(snapshot.permissions.goals, false); assert.equal(snapshot.permissions.resume, true);
  assert.equal(snapshot.runtime.pauseCause, 'owner'); inspector.dispose();
});

test('malformed or non-advancing history is bounded and visible as a read warning', async () => {
  let requests = 0;
  const { inspector } = fixture({ getEvents: async () => { requests++; return Array.from({ length: 100 }, () => saved(1, 'request', { text: 'SECRET_LOOP' })); } });
  const snapshot = await inspector.read({ key }); assert.equal(requests, 1);
  assert(snapshot.activity.some(value => /cursor did not advance/.test(value.message))); assert(!JSON.stringify(snapshot).includes('SECRET_LOOP')); inspector.dispose();
});

test('objective plans retain physical receipts and CAS while dropping arbitrary payloads', async () => {
  const { inspector, state } = fixture();
  state.goal = { agentId: 'skeletor', worldId, goalId: 'goal-a', revision: 3, status: 'acting', objective: 'Come back',
    currentStep: 'Go home', plan: { version: 1, milestones: [{ type: 'move-to', label: 'Go home', position: [1, 2, 3] }] },
    completedMilestones: [{ index: 0, requestId: 'move-a' }], receipts: [{ requestId: 'move-a', type: 'move-to',
      status: 'arrived', at: 2000, position: [1, 2, 3], targetPosition: [1, 2, 3], tensor: 'PRIVATE_GOAL_DATA' }], prompt: 'PRIVATE_GOAL_PROMPT' };
  const snapshot = await inspector.read({ key });
  assert.equal(snapshot.objective.revision, 3); assert.deepEqual(snapshot.objective.plan.milestones[0].position, [1, 2, 3]);
  assert.deepEqual(snapshot.objective.completedMilestones, [{ index: 0, requestId: 'move-a' }]);
  assert.equal(snapshot.objective.receipts[0].status, 'arrived'); assert(!JSON.stringify(snapshot).includes('PRIVATE_GOAL')); inspector.dispose();
});

test('completed specialist diagnostics contribute actual routing while current unsaved issues stay distinct from past failures', async () => {
  const { inspector, state } = fixture();
  state.head.activity = { status: 'paused', unsaved: true, error: 'Not saved: storage write failed', prompt: 'PRIVATE_ACTIVITY_PROMPT' };
  state.events = [saved(1, 'failed', { text: 'Earlier context failure', errorCode: 'ERR_MODEL_CONTEXT_BUDGET' })];
  state.diagnostics = [diagnostic('ooda-result', { status: 'completed', source: 'ooda', route: { modelLabel: 'Specialist', local: false, peerId: 'actual-peer' } }),
    diagnostic('proposed-route', { status: 'waiting', lastWhen: 2100, route: { modelLabel: 'Unexecuted' } })];
  const snapshot = await inspector.read({ key });
  assert.equal(snapshot.routing.lastModelLabel, 'Specialist'); assert.equal(snapshot.routing.lastRoute.peerId, 'actual-peer');
  assert.equal(snapshot.runtime.lastFailure.message, 'Earlier context failure');
  assert.equal(snapshot.runtime.currentIssue, 'Not saved: storage write failed'); assert.equal(snapshot.runtime.recoveryRequired, true);
  assert.match(snapshot.runtime.error, /^Current runtime issue: Not saved/); assert.match(snapshot.runtime.error, /Last failure: Earlier context failure/);
  assert(!JSON.stringify(snapshot).includes('PRIVATE_ACTIVITY_PROMPT')); inspector.dispose();
});

import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

let server, browser, origin, cache;
const repo = fileURLToPath(new URL('../../', import.meta.url));
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'world-agent-host-'));
  server = await createServer({ configFile: false, root: repo, cacheDir: cache, logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: ['netmask'] },
    server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'world-host-fixture', configureServer(vite) {
      vite.middlewares.use('/__world_fixture', (_request, response) => {
        response.setHeader('Content-Type', 'text/html'); response.end('<!doctype html><title>World lifecycle fixture — simulated inference</title>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); });
async function fixture(t) {
  const context = await browser.newContext(), page = await context.newPage(), errors = [], external = [];
  await page.route('**/*', (route) => { if (new URL(route.request().url()).origin === origin) return route.continue(); external.push(route.request().url()); return route.abort(); });
  page.on('pageerror', (error) => errors.push(error.message));
  t.after(async () => { await page.evaluate(() => window.host?.dispose()); await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []); });
  await page.goto(origin + '/__world_fixture');
  await page.evaluate(boot);
  return page;
}
async function boot() {
    const { installWorldAgents, speechChunks, worldConversationId } = await import('/demos/shared/agents/WorldAgentHost.js');
    const { AgentRuntime } = await import('/peercompute/src/peercompute/agents/AgentRuntime.js');
    const { AgentRecordStore } = await import('/peercompute/src/peercompute/agents/AgentRecordStore.js');
    const { WorldMemoryStore } = await import('/peercompute/src/peercompute/agents/WorldMemoryStore.js');
    const { WorldGoalStore } = await import('/peercompute/src/peercompute/agents/WorldGoalStore.js');
    const { WorldStandingGoalStore } = await import('/peercompute/src/peercompute/agents/WorldStandingGoalStore.js');
    const { cubeGuidePreset, CUBECHAT_GUIDE_FACTS } = await import('/demos/cubechat/src/agents/cubeGuide.js');
    const { WORLD_GOAL_INSTRUCTIONS, WORLD_GOAL_OBSERVATIONS_MARKER } = await import('/demos/shared/agents/WorldGoalDecision.js');
    const { WORLD_PHYSICAL_INTENT_INSTRUCTIONS, WORLD_CHAT_TASK_INSTRUCTIONS, WORLD_PHYSICAL_OBSERVATIONS_MARKER } = await import('/demos/shared/agents/WorldIntentDecision.js');
    Object.assign(window, { calls: [], view: {}, speechChunks, worldConversationId });
    const candidate = { key: 'local', local: true, available: true, manifestCid: 'fixture', sessionId: 'fixture', runtime: 'transformers.js',
      task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
    window.start = async () => {
      const bodies = new Map(); window.bodyMap = bodies;
      host = installWorldAgents({ worldId: 'cubechat:test', worldLabel: 'CubeChat', socialOptions: window.socialOptions ?? {}, goalOptions: { tickMs: 100 },
        worldKnowledge: CUBECHAT_GUIDE_FACTS.join(' '),
        ...(window.defaultGuide ? { defaultResident: cubeGuidePreset('cubechat:test') } : {}),
        publishWorldMessage: async (input, options) => {
          options.signal.throwIfAborted(); calls.push(['public-message', input]);
          host.receiveWorldMessage({ ...input, peerId: window.fixturePeerId ?? 'owner', id: crypto.randomUUID() });
          if (window.holdPublicReceipt) {
            await new Promise(resolve => { window.releasePublicReceipt = resolve; });
            return { delivery: { delivered: 1, status: 'delivered' } };
          }
          return { delivery: { id: crypto.randomUUID(), delivered: 0, total: 0, status: 'local-only' } };
        },
        exclusiveEmbodiments: window.exclusiveBodies ?? false,
        getRuntimeOptions: () => ({ networkManager: window.roomManager }),
        beforeOpen: () => calls.push('input-release'),
        adapter: { upsert: (body) => bodies.set(body.key, body), remove: (key) => bodies.delete(key), normalizePosition: (value) => [...value],
          getSpawnPosition: () => [1, 3, 5], getPosition: (key) => bodies.get(key)?.position,
          ...(window.navigationFixture ? { getResidentMotorStatus: key => {
            calls.push(['navigation-read', key]); return { key, status: 'moving', distance: 24, backend: 'webgpu',
              progress: { targetClear: false }, blockedReason: 'local-only-geometry-detail' };
          } } : {}),
          getContext: (body) => ({ position: [...body.position], ...window.fixtureScene }), focus: () => {},
          setAppearance: (key, image) => calls.push(['face', key, image]),
          ...(window.embodiedFixture ? {
            observe: key => ({ self: { id: `resident:${bodies.get(key)?.ownerPeerId}:${bodies.get(key)?.agentId}`, position: [1, 3, 5] }, participants: window.fixtureParticipants ?? [{ id: 'human:owner', peerId: 'owner', kind: 'human', name: 'Owner', position: [25, 3, 5], distance: 24 }], requesterId: 'human:owner', obstacles: [] }),
            setIntent: (key, intent) => { calls.push(['intent', key, intent]); window.lastIntent = { key, ...intent }; },
            setMovement: (key, mode) => calls.push(['movement', key, mode]),
            subscribeOutcomes: listener => { window.physicalOutcome = listener; return () => { window.physicalOutcome = null; }; },
          } : {}),
          getAudioPose: () => ({}), dispose: () => { calls.push('adapter-dispose'); bodies.clear(); } },
        uiFactory: (callbacks) => { window.callbacks = callbacks; return {
          open: () => { callbacks.onOpen?.(); view.open = true; }, dispose: () => { view.open = false; calls.push('ui-dispose'); },
          select: (body) => { view.selected = body; }, setAgents: (list) => { view.agents = list; }, setMessages: (items) => { view.messages = items; },
          setStatus: (value) => { view.status = value; }, setBusy: (value) => { view.busy = value; }, setVoiceStatus: (value) => { view.voice = value; },
          setNavigationStatus: (key, value) => { view.navigation ??= {}; view.navigation[key] = value; calls.push(['navigation-ui', key]); },
          setGoalStatus: (key, value) => { view.objectives ??= {}; view.objectives[key] = value; },
          isNavigationVisible: () => window.navigationVisible === true,
        }; },
        runtimeFactory: async (options) => {
          calls.push(['runtime', options.residentModelSlots]);
          if (options.networkManager) throw new Error('Room networking must not restrict global model discovery');
          const store = new AgentRecordStore({ name: 'world-fixture' }); await store.open();
          const imageCandidate = { ...candidate, task: 'text-to-image', runtime: 'onnx-diffusion', outputModalities: ['image'] };
          const agents = new AgentRuntime({ store, inference: { listCandidates: async ({ task }) => {
            if (window.waitPreflight && task === 'text-generation') await new Promise(resolve => { window.finishPreflight = resolve; });
            return window.noTextProvider && task === 'text-generation' ? [] : [task === 'text-to-image' ? imageCandidate : candidate];
          },
            generate: async (_candidate, input, { signal }) => {
              if (input.prompt?.startsWith('{"currentProfile":')) {
                calls.push(['profile-decision', input]);
                if (window.waitProfile) await new Promise(resolve => { window.finishProfile = resolve; });
                signal.throwIfAborted();
                if (window.profileError) throw Object.assign(new Error('Profile context is too large'), { code: 'ERR_MODEL_CONTEXT_BUDGET' });
                return { text: JSON.stringify(window.fixtureProfilePatch ?? null), finishReason: 'stop' };
              }
              if ([WORLD_PHYSICAL_INTENT_INSTRUCTIONS, WORLD_CHAT_TASK_INSTRUCTIONS].some(prefix => input.messages?.[0]?.content.startsWith(prefix + WORLD_PHYSICAL_OBSERVATIONS_MARKER))) {
                calls.push(['intent-decision', input]);
                return { text: JSON.stringify(window.fixtureIntentDecision ?? { intent: null }), finishReason: 'stop' };
              }
              calls.push(['generate', input]);
              if (input.messages?.[0]?.content.startsWith(WORLD_GOAL_INSTRUCTIONS)
                  && input.messages[0].content.includes(WORLD_GOAL_OBSERVATIONS_MARKER)) {
                calls.push(['objective-generation']);
                if (window.waitObjective) {
                  await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
                  calls.push(['objective-aborted']); signal.throwIfAborted();
                }
                return { text: JSON.stringify(window.objectiveAnswers?.shift() ?? { decision: 'pause', reason: 'Fixture has no next decision.' }) };
              }
              if (window.waitSocial && input.prompt.includes('brief public encounter')) {
                await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
                calls.push(['social-aborted']); signal.throwIfAborted();
              }
              if (window.holdWorldGeneration && input.prompt.includes('public world-chat')) {
                await new Promise((resolve, reject) => {
                  const aborted = () => reject(signal.reason);
                  window.finishWorldGeneration = () => { signal.removeEventListener('abort', aborted); resolve(); };
                  signal.addEventListener('abort', aborted, { once: true });
                });
              }
              if (input.prompt === 'wait' || window.waitWorld && input.prompt.includes('public world-chat')) {
                await new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
                await new Promise((resolve) => { window.finishCleanup = resolve; });
                signal.throwIfAborted();
              }
              return { text: window.fixtureAnswer ?? 'Fixture response (not real inference).', finishReason: 'stop',
                ...(input.task === 'text-to-image' ? { image: { width: 2, height: 2, channels: 4, data: new Uint8Array(16).fill(123) } } : {}) };
            }, cancel: async () => {} } });
          window.agents = agents;
          const memories = new Map(), objectives = new Map(), standing = new Map();
          const stateManager = { getWorldMemoryStore: name => memories.get(name),
            createWorldMemoryStore: ({ name }) => { const memory = new WorldMemoryStore({ name }); memories.set(name, memory); window.episodeStore = memory; return memory; },
            getWorldGoalStore: name => objectives.get(name),
            createWorldGoalStore: options => { const value = new WorldGoalStore(options); objectives.set(options.name, value); window.objectiveStore = value; return value; },
            getWorldStandingGoalStore: name => standing.get(name),
            createWorldStandingGoalStore: options => { const value = new WorldStandingGoalStore(options); standing.set(options.name, value); window.standingStore = value; return value; } };
          return { stateManager, networkReady: true, networkManager: { peerId: window.fixturePeerId ?? 'owner' }, getAgentController: async () => agents,
            listInferenceTargets: () => window.imageAvailable ? [imageCandidate] : [],
            service: { getStatus: () => ({ status: 'ready', manifestCid: 'fixture', sessionId: 'fixture' }) },
            store: { getManifest: async () => ({ model: imageCandidate }) }, refreshPeers: async () => {},
            dispose: async () => { await agents.dispose(); await store.destroy(); for (const memory of memories.values()) await memory.close();
              for (const value of objectives.values()) await value.close(); for (const value of standing.values()) await value.destroy(); calls.push('runtime-dispose'); } };
        },
        serviceFactory: (options) => { window.networkOptions = options; return {
          start: async () => calls.push('network-start'), close: async () => calls.push('network-close'),
          requestProfile: async (owner, args) => { calls.push(['clone-request', owner, args]); return window.remoteProfile; },
          request: async (...args) => { calls.push(['remote-request', args]); return { text: 'Remote fixture response', finishReason: 'stop' }; },
        }; },
        speechFactory: async () => ({ getStatus: () => ({ status: 'ready' }), prepare: async () => calls.push('prepare-voice'),
          synthesize: async (text) => { calls.push(['synthesize', text]); return { audio: new Float32Array(100), sampleRate: 16000 }; },
          dispose: async () => calls.push('speech-dispose') }),
        audioFactory: async () => {
          if (window.holdAudioFactory) await new Promise((resolve) => { window.releaseAudioFactory = resolve; });
          return { unlock: async () => calls.push('audio-unlock'), cancelRecording: async () => calls.push('cancel-mic'),
            startRecording: async ({ signal }) => {
              calls.push('mic-starting');
              await new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
            },
            play: async (_pcm, options) => calls.push(['play', options.key]), stopPlayback: () => {}, dispose: async () => calls.push('audio-dispose') };
        },
      });
      await host.ready; await new Promise((resolve) => setTimeout(resolve, 0));
    };
    await start();
}

test('native chat Resume is owner-only and never dispatches a previous request', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const head = await host.spawn({ name: 'Ada' }), key = `local:${head.agentId}`;
    await agents.pause(head.agentId); await host.openConversation(key);
    await callbacks.onResume(key);
    const resumed = await agents.get(head.agentId), resumedStatus = view.status;
    networkOptions.onDirectory([{ agentId: 'remote', ownerPeerId: 'visitor', name: 'Peer resident',
      position: [25, 3, 5], color: '#8fffd4', status: 'paused', canResume: true }]);
    await host.openConversation('visitor:remote');
    let denied;
    try { await callbacks.onResume('visitor:remote'); } catch (error) { denied = error.message; }
    return { resumed, resumedStatus, denied, bodies: host.getStatus().bodies, calls, status: view.status,
      hasRemoteResumeCallback: Object.hasOwn(networkOptions, 'resume') };
  });
  assert.equal(result.resumed.status, 'waiting'); assert.equal(result.resumed.pendingOperation, null);
  assert.match(result.denied, /Only the owner/);
  assert.equal(result.bodies.find(body => !body.local).status, 'paused');
  assert.equal(result.calls.some(call => Array.isArray(call) && ['generate', 'remote-request'].includes(call[0])), false);
  assert.equal(result.hasRemoteResumeCallback, false);
  assert.match(result.resumedStatus, /No previous request was replayed/);
  assert.equal(result.status, 'Paused. Only its owner can resume this resident.');
});

test('opening chat reads current readiness even while the roster retains a pre-resume snapshot', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const head = await host.spawn({ name: 'Ada' }), key = `local:${head.agentId}`;
    await agents.pause(head.agentId);
    const stale = await agents.list(), list = agents.list.bind(agents);
    agents.list = async () => structuredClone(stale);
    await agents.resume(head.agentId);
    await host.openConversation(key);
    const result = { status: view.status, head: await agents.get(head.agentId) };
    agents.list = list;
    return result;
  });
  assert.equal(result.head.status, 'waiting');
  assert.equal(result.status, 'Talk to Ada.');
});

test('navigation inspection is owner-local, visibility-gated and stops polling on disposal', async t => {
  const page = await fixture(t);
  const key = await page.evaluate(async () => {
    await host.dispose(); window.navigationFixture = true; window.navigationVisible = false;
    await start(); const head = await host.spawn({ name: 'Ada' });
    networkOptions.onDirectory([{ agentId: 'bert', ownerPeerId: 'visitor', name: 'Bert', position: [25, 3, 5], color: '#8fffd4', status: 'idle' }]);
    return `local:${head.agentId}`;
  });
  await page.waitForTimeout(600);
  assert.equal(await page.evaluate(() => calls.filter(c => c[0] === 'navigation-read').length), 0);
  await page.evaluate(() => { window.navigationVisible = true; });
  await page.waitForFunction(key => view.navigation?.[key]?.status === 'moving', key);
  const result = await page.evaluate(() => ({ calls, bodies: host.getStatus().bodies, published: networkOptions.listLocalAgents() }));
  assert(result.calls.filter(c => c[0] === 'navigation-read').every(c => c[1] === key));
  assert(!JSON.stringify(result.bodies).includes('local-only-geometry-detail'));
  assert(!JSON.stringify(result.published).includes('local-only-geometry-detail'));
  const count = await page.evaluate(async () => { await host.dispose(); return calls.filter(c => c[0] === 'navigation-read').length; });
  await page.waitForTimeout(600);
  assert.equal(await page.evaluate(() => calls.filter(c => c[0] === 'navigation-read').length), count);
});

test('scene lifecycle preserves identity/body/history across close and restart without an automatic model or microphone', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const initial = [...calls]; await host.spawn({ name: 'Ada', goals: ['Observe'], localOnly: true, shared: true });
    const key = host.getStatus().selectedKey, id = view.selected.agentId;
    await host.send({ key, text: 'Remember this conversation' }); await callbacks.onClose();
    const afterClose = { ...host.getStatus(), events: await agents.events(id) };
    await host.dispose(); const cleanup = [...calls]; await start(); await host.openConversation(key);
    return { initial, id, key, afterClose, cleanup, restored: host.getStatus(), messages: view.messages };
  });
  assert.deepEqual(result.initial.filter((call) => Array.isArray(call) && call[0] === 'runtime'), [['runtime', 3]]);
  assert.equal(result.initial.includes('prepare-voice'), false);
  assert.equal(result.afterClose.bodies.length, 1); assert.equal(result.afterClose.disposed, false);
  assert.equal(result.restored.bodies[0].agentId, result.id);
  assert.equal(result.messages[0].text, 'Remember this conversation');
  assert(result.cleanup.indexOf('network-close') < result.cleanup.indexOf('runtime-dispose'));
  assert(result.cleanup.indexOf('runtime-dispose') < result.cleanup.indexOf('adapter-dispose'));
});
test('owner derives visitor channels, advertises only public bodies and refuses unshared requests', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.spawn({ name: 'Ada', shared: true }); const id = view.selected.agentId;
    const respond = (requesterPeerId, prompt) => networkOptions.respond({ agentId: id, requesterPeerId, prompt });
    await respond('visitor-a', 'Alpha secret'); await respond('visitor-b', 'Beta secret'); await respond('visitor-a', 'Alpha again');
    const generated = calls.filter((call) => call[0] === 'generate').map((call) => call[1]);
    const published = networkOptions.listLocalAgents();
    const head = await agents.get(id); await agents.update(id, { embodiments: head.embodiments.map((entry) => ({ ...entry, shared: false })) });
    let denied; try { await respond('visitor-a', 'Denied'); } catch (error) { denied = error.message; }
    await host.remove(`local:${id}`);
    return { generated, published, denied, stillSaved: (await agents.get(id)).identity.name, bodies: host.getStatus().bodies };
  });
  assert.equal(JSON.stringify(result.generated[1].messages).includes('Alpha secret'), false);
  assert.equal(JSON.stringify(result.generated[2].messages).includes('Alpha secret'), true);
  assert.deepEqual(Object.keys(result.published[0]).sort(), ['agentId', 'color', 'name', 'position', 'status']);
  assert.match(result.denied, /not shared/); assert.equal(result.stillSaved, 'Ada'); assert.deepEqual(result.bodies, []);
});
test('conversation cancellation keeps the body and waits for acknowledged model cleanup', async (t) => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    await host.spawn({ name: 'Ada' });
    window.pending = host.send({ text: 'wait' }).catch((error) => { window.sendError = error.name; });
  });
  await page.waitForFunction(() => calls.some((call) => call[0] === 'generate'));
  await page.evaluate(() => { window.cancelled = false; window.cancelling = host.cancel().then(() => { cancelled = true; }); });
  await page.waitForFunction(() => window.finishCleanup);
  assert.equal(await page.evaluate(() => cancelled), false);
  const result = await page.evaluate(async () => { finishCleanup(); await cancelling; await pending; return { cancelled, sendError, state: host.getStatus() }; });
  assert.equal(result.cancelled, true); assert.equal(result.sendError, 'AbortError'); assert.equal(result.state.bodies.length, 1);
});
test('remote bodies are addressed to their authenticated owner and optional speech is positional', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    networkOptions.onDirectory([{ agentId: 'remote-agent', ownerPeerId: 'visitor-owner', name: 'Visitor Ada', position: [2, 3, 4], color: '#aabbcc', status: 'idle' }]);
    await host.openConversation('visitor-owner:remote-agent'); await host.enableVoice(true);
    await host.send({ text: 'Hello', voiceReply: true });
    const chunks = speechChunks('😀'.repeat(520));
    return { calls, chunks: chunks.map((value) => Array.from(value).length), reconstructed: chunks.join('') };
  });
  const request = result.calls.find((call) => call[0] === 'remote-request'); assert.equal(request[1][0], 'visitor-owner');
  assert.deepEqual(result.calls.find((call) => call[0] === 'play'), ['play', 'visitor-owner:remote-agent']);
  assert.deepEqual(result.chunks, [256, 256, 8]); assert.equal(result.reconstructed, '😀'.repeat(520));
});
test('world teardown tracks late voice factories and disposes them before releasing the runtime', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => { window.holdAudioFactory = true; window.preparing = host.enableVoice(true).catch((error) => error.name); });
  await page.waitForFunction(() => window.releaseAudioFactory);
  await page.evaluate(() => { window.closed = false; window.teardown = host.dispose().then(() => { closed = true; }); });
  assert.equal(await page.evaluate(() => closed), false);
  const result = await page.evaluate(async () => { releaseAudioFactory(); await teardown; return { outcome: await preparing, calls }; });
  assert.equal(result.outcome, 'AbortError'); assert(result.calls.includes('audio-dispose'));
  assert(result.calls.indexOf('audio-dispose') < result.calls.indexOf('runtime-dispose'));
  assert.equal(result.calls.includes('prepare-voice'), false);
});
test('Stop cancels pending microphone permission instead of starting a late recording', async (t) => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    await host.spawn({ name: 'Ada' }); await host.enableVoice(true);
    window.startingMic = callbacks.onRecord({ key: host.getStatus().selectedKey, recording: true }).catch((error) => error.name);
  });
  await page.waitForFunction(() => calls.includes('mic-starting'));
  const result = await page.evaluate(async () => {
    await callbacks.onRecord({ recording: false }); return { outcome: await startingMic, state: host.getStatus(), calls };
  });
  assert.equal(result.outcome, 'AbortError'); assert.equal(result.state.recording, false); assert(result.calls.includes('cancel-mic'));
});
test('room conversation identity stays separate from global model discovery', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.dispose(); window.roomManager = { peerId: 'room-owner', isConnected: true };
    await start(); await host.spawn({ name: 'Ada' });
    return { same: networkOptions.networkManager === roomManager, owner: host.getStatus().bodies[0].ownerPeerId };
  });
  assert.deepEqual(result, { same: true, owner: 'room-owner' });
});

test('live owner pose survives activity refresh and feeds public directory and private observations without journal writes', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.spawn({ name: 'Walking Ada' });
    const key = host.getStatus().selectedKey, id = view.selected.agentId;
    const before = await agents.get(id);
    bodyMap.get(key).position = [17, 3, -8];
    const publicBody = networkOptions.listLocalAgents()[0];
    const afterMotion = await agents.get(id);
    await agents.update(id, { name: 'Still walking Ada' });
    // update emits a refresh; wait for its acknowledged store read and render.
    while (view.agents[0]?.name !== 'Still walking Ada') await new Promise((resolve) => setTimeout(resolve, 0));
    await host.send({ key, text: 'Where are you?' });
    return { before, afterMotion, publicBody, final: host.getStatus().bodies[0],
      generated: calls.find((call) => call[0] === 'generate')[1] };
  });
  assert.deepEqual(result.publicBody.position, [17, 3, -8]);
  assert.equal(result.afterMotion.revision, result.before.revision);
  assert.deepEqual(result.afterMotion.embodiments[0].position, [1, 3, 5]);
  assert.deepEqual(result.final.position, [17, 3, -8]);
  assert.match(JSON.stringify(result.generated.messages), /17,3,-8/);
});

test('metadata and directory polling preserve the last private caption without publishing it', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.spawn({ name: 'Ada' }); const id = view.selected.agentId, key = host.getStatus().selectedKey;
    await host.send({ key, text: 'A private conversation.' });
    await agents.update(id, { name: 'Still Ada' });
    for (let count = 0; count < 200 && view.agents[0]?.name !== 'Still Ada'; count++) await new Promise((resolve) => setTimeout(resolve, 0));
    const local = bodyMap.get(key);
    const remote = { agentId: 'remote-agent', ownerPeerId: 'visitor-owner', name: 'Visitor', position: [2, 3, 4], color: '#aabbcc', status: 'idle' };
    networkOptions.onDirectory([remote]); await host.openConversation('visitor-owner:remote-agent');
    await host.send({ text: 'Another private conversation.' }); networkOptions.onDirectory([remote]);
    return { name: local.name, localCaption: local.caption, remoteCaption: bodyMap.get('visitor-owner:remote-agent').caption,
      published: networkOptions.listLocalAgents() };
  });
  assert.equal(result.name, 'Still Ada'); assert.equal(result.localCaption, 'Fixture response (not real inference).');
  assert.equal(result.remoteCaption, 'Remote fixture response');
  assert.equal(JSON.stringify(result.published).includes('caption'), false);
});

test('real same-origin tabs grant one local body owner and permit takeover only after owner cleanup', async (t) => {
  const owner = await fixture(t), context = owner.context();
  const id = await owner.evaluate(async () => {
    await host.dispose(); window.exclusiveBodies = true; window.fixturePeerId = 'first-owner';
    await start(); await host.spawn({ name: 'One identity' }); return view.selected.agentId;
  });
  const visitor = await context.newPage(), errors = [];
  visitor.on('pageerror', (error) => errors.push(error.message));
  await visitor.goto(origin + '/__world_fixture');
  await visitor.evaluate(() => { window.exclusiveBodies = true; window.fixturePeerId = 'second-owner'; });
  await visitor.evaluate(boot);
  t.after(async () => { if (!visitor.isClosed()) { await visitor.evaluate(() => host.dispose()); await visitor.close(); } assert.deepEqual(errors, []); });
  assert.equal(await owner.evaluate(() => host.getStatus().crossTabOwnership), true);
  assert.deepEqual(await visitor.evaluate(() => host.getStatus().bodies), []);
  const publicBody = await owner.evaluate(() => networkOptions.listLocalAgents()[0]);
  await visitor.evaluate((entry) => networkOptions.onDirectory([{ ...entry, ownerPeerId: 'first-owner' }]), publicBody);
  assert.deepEqual(await visitor.evaluate(() => host.getStatus().bodies.map(({ local, ownerPeerId }) => ({ local, ownerPeerId }))),
    [{ local: false, ownerPeerId: 'first-owner' }]);
  const denied = await visitor.evaluate(async (agentId) => {
    try { await networkOptions.respond({ agentId, requesterPeerId: 'guest', prompt: 'Do not run here' }); }
    catch (error) { return error.message; }
  }, id);
  assert.match(denied, /no body/);
  // Repeated local refresh cannot create a second body while the first tab owns it.
  await visitor.evaluate(async (agentId) => { const head = await agents.get(agentId); await agents.update(agentId, { name: head.identity.name }); }, id);
  assert.equal(await visitor.evaluate(() => networkOptions.listLocalAgents().length), 0);
  await owner.evaluate(() => host.dispose());
  await visitor.evaluate(async () => { await host.dispose(); await start(); });
  assert.deepEqual(await visitor.evaluate(() => host.getStatus().bodies.map(({ agentId, local, ownerPeerId }) => ({ agentId, local, ownerPeerId }))),
    [{ agentId: id, local: true, ownerPeerId: 'second-owner' }]);
  await visitor.evaluate((entry) => networkOptions.onDirectory([{ ...entry, ownerPeerId: 'first-owner' }]), publicBody);
  assert.equal(await visitor.evaluate(() => host.getStatus().bodies.length), 1, 'old directory TTL cannot duplicate the newly owned persisted identity');
  await visitor.evaluate(() => host.dispose()); await visitor.close();
});

test('appearance spawn persists description without a provider, retries into a shared face and restores from storage', async t => {
  const page = await fixture(t);
  await page.evaluate(() => host.spawn({ name: 'Painter', localOnly: true, appearancePrompt: 'Blue robot with green eyes' }));
  await page.waitForFunction(() => view.agents?.[0]?.appearanceStatus === 'waiting' && !view.busy);
  const result = await page.evaluate(async () => {
    const key = host.getStatus().selectedKey, before = host.getStatus().bodies[0];
    const notPaused = (await agents.get(before.agentId)).status !== 'paused';
    window.imageAvailable = true; await callbacks.onAppearance({ key });
    await new Promise(resolve => setTimeout(resolve, 100));
    const published = networkOptions.listLocalAgents()[0], generated = calls.filter(c => c[0] === 'generate');
    const face = calls.find(c => c[0] === 'face')?.[2];
    await host.dispose(); await start(); await new Promise(resolve => setTimeout(resolve, 100));
    return { before, notPaused, published, generated, face, restored: host.getStatus().bodies[0],
      faceReads: calls.filter(c => c[0] === 'face').length };
  });
  assert.equal(result.before.appearancePrompt, 'Blue robot with green eyes'); assert.equal(result.notPaused, true);
  assert.equal(result.generated.length, 1); assert.equal(result.generated[0][1].task, 'text-to-image');
  assert.equal(result.face.width, 2); assert(result.faceReads >= 2);
  assert.equal(result.restored.face.sha256, result.published.face.sha256);
  assert.equal('appearancePrompt' in result.published, false); assert.equal('attachmentId' in result.published.face, false);
});

test('public room replies are opt-in, use a separate history and only caption the authenticated resident owner', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.spawn({ name: 'Ada' }); const key = host.getStatus().selectedKey, id = view.selected.agentId;
    await host.send({ text: 'Visitor private secret' });
    const incoming = { peerId: 'human', name: 'Human', text: 'Hello room', id: 'one' };
    host.receiveWorldMessage(incoming); await new Promise(r => setTimeout(r, 40));
    const before = calls.filter(c => c[0] === 'public-message').length;
    await callbacks.onWorldChat({ key, enabled: true }); host.receiveWorldMessage({ ...incoming, id: 'two' });
    for (let i = 0; i < 100 && !calls.some(c => c[0] === 'public-message'); i++) await new Promise(r => setTimeout(r, 10));
    const generated = calls.filter(c => c[0] === 'generate'), published = calls.filter(c => c[0] === 'public-message');
    const publicBody = host.getStatus().bodies[0];
    host.receiveWorldMessage({ ...incoming, id: 'three', peerId: 'impostor', agentId: id, text: 'wrong owner' });
    const caption = host.getStatus().bodies[0].caption;
    await callbacks.onWorldChat({ key, enabled: false });
    host.receiveWorldMessage({ ...incoming, id: 'four' });
    await host.openConversation(key);
    return { before, generated, published, publicBody, caption, messages: view.messages, saved: (await agents.get(id)).embodiments[0] };
  });
  assert.equal(result.before, 0); assert.equal(result.published.length, 1);
  assert.equal(result.generated.length, 2); assert.equal(JSON.stringify(result.generated[1][1]).includes('Visitor private secret'), false);
  assert.match(result.generated[1][1].worldContext, /public-room-chat/);
  assert.equal(result.publicBody.caption, 'Fixture response (not real inference).');
  assert.equal(result.caption, result.publicBody.caption); assert.equal(result.saved.respondToWorldChat, false);
  assert.equal(result.messages.length, 2); assert.equal(result.messages[0].text, 'Visitor private secret');
});

test('revoking world-chat opt-in waits for active cleanup and never publishes the cancelled response', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    await host.spawn({ name: 'Ada', respondToWorldChat: true }); window.waitWorld = true;
    host.receiveWorldMessage({ peerId: 'human', id: 'one', name: 'Human', text: 'Hello' });
  });
  await page.waitForFunction(() => calls.some(c => c[0] === 'generate'));
  await page.evaluate(() => {
    window.disabled = false; window.disabling = callbacks.onWorldChat({ key: host.getStatus().selectedKey, enabled: false }).then(() => { disabled = true; });
  });
  await page.waitForFunction(() => window.finishCleanup); assert.equal(await page.evaluate(() => disabled), false);
  const result = await page.evaluate(async () => {
    finishCleanup(); await disabling; return { disabled, published: calls.filter(c => c[0] === 'public-message'), saved: (await agents.list())[0] };
  });
  assert.equal(result.disabled, true); assert.equal(result.saved.embodiments[0].respondToWorldChat, false); assert.deepEqual(result.published, []);
});

test('verified resident messages reach the responder with fresh scene, public roster and isolated history', async t => {
  const page = await fixture(t);
  const first = await page.evaluate(async () => {
    await host.spawn({ name: 'Ada', respondToWorldChat: true });
    await host.send({ text: 'My private secret must stay private' });
    const key = host.getStatus().selectedKey;
    networkOptions.onDirectory([{ ownerPeerId: 'remote-owner', agentId: 'bert', name: 'Bert',
      position: [4, 3, 2], color: '#aabbcc', status: 'idle' }]);
    window.fixtureScene = { theme: 'forest', nearbyPlayers: 3 };
    host.receiveWorldMessage({ peerId: 'human', id: 'hello', name: 'Human', text: 'What do you see here?' });
    return { key };
  });
  await page.waitForFunction(() => calls.some(call => call[0] === 'public-message'));
  const rejected = await page.evaluate(() => {
    const input = { id: 'spoof', peerId: 'impostor', agentId: 'bert', name: 'Bert', text: 'Forged owner request' };
    return { result: host.receiveWorldMessage(input), before: calls.filter(call => call[0] === 'generate').length };
  });
  assert.equal(rejected.result, undefined);
  const accepted = await page.evaluate(({ key }) => {
    bodyMap.get(key).position = [21, 3, -9]; window.fixtureScene = { theme: 'moon', nearbyPlayers: 4 };
    window.fixtureAnswer = 'The moon terrain makes your idea interesting, Bert.';
    return host.receiveWorldMessage({ peerId: 'remote-owner', id: 'bert-reply', agentId: 'bert', name: 'Impersonated Ada',
      text: 'I think we should look at the moon terrain.' });
  }, first);
  assert.equal(accepted.accepted, true); assert.equal(accepted.queued, 1);
  await page.waitForFunction(() => calls.filter(call => call[0] === 'public-message').length === 2, null, { timeout: 15000 });
  const result = await page.evaluate(() => ({ generated: calls.filter(call => call[0] === 'generate').map(call => call[1]),
    body: host.getStatus().bodies.find(body => body.agentId === 'bert') }));
  assert.equal(result.generated.length, rejected.before + 1);
  const followup = result.generated.at(-1), observations = JSON.parse(followup.worldContext);
  assert.equal(observations.scene.theme, 'moon'); assert.equal(observations.scene.nearbyPlayers, 4);
  assert.deepEqual(observations.self.position, [21, 3, -9]); assert.equal(observations.self.name, 'Ada');
  assert.deepEqual(observations.residents.map(body => body.name), ['Bert']);
  assert(observations.messages.some(message => message.agentId === 'bert' && message.id === 'bert-reply'));
  assert(observations.messages.some(message => message.agentId === observations.self.agentId));
  assert(followup.messages.some(message => message.role === 'system' && message.content.includes('bert-reply')
    && message.content.includes('Fixture response (not real inference).')));
  assert.match(followup.prompt, /from resident "Bert"/);
  assert.equal(JSON.stringify(followup).includes('Impersonated Ada'), false);
  assert.equal(JSON.stringify(followup).includes('My private secret'), false);
  assert.equal(JSON.stringify(followup).includes('Forged owner request'), false);
  assert.equal(result.body.caption, 'I think we should look at the moon terrain.');
});

test('resident messages before directory discovery require a matching owner, expire without replay renewal and forward once', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    await host.spawn({ name: 'Ada', respondToWorldChat: true });
    host.receiveWorldMessage({ peerId: 'human', id: 'hello', name: 'Human', text: 'Say hello to the room.' });
  });
  await page.waitForFunction(() => calls.some(call => call[0] === 'public-message'));
  const admission = await page.evaluate(() => {
    const originalNow = Date.now, base = Date.now(); let clock = base;
    const body = { ownerPeerId: 'late-owner', agentId: 'late-agent', name: 'Late resident',
      position: [4, 3, 2], color: '#aabbcc', status: 'idle' };
    const message = { peerId: 'late-owner', agentId: 'late-agent', id: 'expired', name: 'Untrusted alias', text: 'Old statement' };
    let expiredCaption;
    try {
      Date.now = () => clock;
      host.receiveWorldMessage(message);
      clock = base + 14000; host.receiveWorldMessage({ ...message, text: 'Changed replay' });
      clock = base + 16000; networkOptions.onDirectory([body]);
      expiredCaption = host.getStatus().bodies.find(entry => entry.agentId === 'late-agent').caption;
      networkOptions.onDirectory([]);
    } finally { Date.now = originalNow; }
    window.fixtureAnswer = 'Welcome, late resident. I can hear your new statement.';
    host.receiveWorldMessage({ ...message, id: 'current', text: 'My current statement' });
    networkOptions.onDirectory([{ ...body, ownerPeerId: 'wrong-owner' }]);
    const wrongCaption = host.getStatus().bodies.find(entry => entry.agentId === 'late-agent').caption;
    networkOptions.onDirectory([body]);
    const rightCaption = host.getStatus().bodies.find(entry => entry.agentId === 'late-agent').caption;
    networkOptions.onDirectory([]); networkOptions.onDirectory([body]);
    const replay = host.receiveWorldMessage({ ...message, id: 'current', text: 'My current statement' });
    return { expiredCaption, wrongCaption, rightCaption, replay };
  });
  assert.equal(admission.expiredCaption, undefined); assert.equal(admission.wrongCaption, undefined);
  assert.equal(admission.rightCaption, 'My current statement'); assert.equal(admission.replay.reason, 'duplicate');
  await page.waitForFunction(() => calls.filter(call => call[0] === 'public-message').length === 2, null, { timeout: 15000 });
  const generated = await page.evaluate(() => calls.filter(call => call[0] === 'generate').map(call => call[1]));
  assert.equal(generated.length, 2);
  assert.match(generated[1].prompt, /from resident "Late resident"/);
  assert.equal(/Old statement|Changed replay|Untrusted alias/.test(JSON.stringify(generated[1])), false);
});

test('removing a body while model availability is pending cannot create a persisted inference turn', async t => {
  const page = await fixture(t);
  const id = await page.evaluate(async () => {
    await host.spawn({ name: 'Ada', respondToWorldChat: true }); window.waitPreflight = true;
    host.receiveWorldMessage({ peerId: 'human', id: 'hello', name: 'Human', text: 'Hello there' });
    return host.getStatus().selectedKey.slice('local:'.length);
  });
  await page.waitForFunction(() => window.finishPreflight);
  await page.evaluate(async id => {
    await agents.update(id, { embodiments: [] }); window.waitPreflight = false; finishPreflight();
  }, id);
  await page.waitForFunction(() => !view.busy && host.getStatus().bodies.length === 0);
  const result = await page.evaluate(async id => ({ events: await agents.events(id), calls }), id);
  assert.equal(result.calls.some(call => call[0] === 'generate' || call[0] === 'public-message'), false);
  assert.equal(result.events.some(event => event.type === 'request'), false);
});

test('a newer human message suppresses an obsolete reply without pausing the real agent runtime', async t => {
  const page = await fixture(t);
  const id = await page.evaluate(async () => {
    await host.spawn({ name: 'Ada', respondToWorldChat: true }); window.holdWorldGeneration = true;
    host.receiveWorldMessage({ peerId: 'human', id: 'old', name: 'Human', text: 'Old question' });
    return host.getStatus().selectedKey.slice('local:'.length);
  });
  await page.waitForFunction(() => window.finishWorldGeneration);
  await page.evaluate(() => {
    host.receiveWorldMessage({ peerId: 'human', id: 'new', name: 'Human', text: 'New current question' });
    window.holdWorldGeneration = false; window.fixtureAnswer = 'The current question has my attention.';
    finishWorldGeneration();
  });
  await page.waitForFunction(() => calls.some(call => call[0] === 'public-message'), null, { timeout: 15000 });
  const result = await page.evaluate(async id => ({ generated: calls.filter(call => call[0] === 'generate'),
    published: calls.filter(call => call[0] === 'public-message'), head: await agents.get(id) }), id);
  assert.equal(result.generated.length, 2); assert.equal(result.published.length, 1);
  assert.match(result.generated[0][1].prompt, /Old question/);
  assert.match(result.generated[1][1].prompt, /New current question/);
  assert.notEqual(result.head.status, 'paused');
});

test('world-chat without a capable model does not pause the resident or create a failed inference turn', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    await host.spawn({ name: 'Ada', respondToWorldChat: true }); window.noTextProvider = true;
    host.receiveWorldMessage({ peerId: 'human', id: 'one', name: 'Human', text: 'Hello' });
  });
  await page.waitForFunction(() => view.status?.startsWith('World chat:'));
  const result = await page.evaluate(async () => ({ head: (await agents.list())[0], calls }));
  assert.notEqual(result.head.status, 'paused'); assert.equal(result.calls.filter(c => c[0] === 'generate').length, 0);
});

test('public resident text arriving before its body is anchored only to its authenticated owner once', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(() => {
    host.receiveWorldMessage({ peerId: 'speaker', agentId: 'new-agent', text: 'First public reply' });
    const entry = { ownerPeerId: 'other-owner', agentId: 'new-agent', name: 'Resident', position: [0, 3, 0], color: '#aabbcc', status: 'idle' };
    networkOptions.onDirectory([entry]); const wrong = host.getStatus().bodies[0];
    networkOptions.onDirectory([{ ...entry, ownerPeerId: 'speaker' }]); const matched = host.getStatus().bodies[0];
    networkOptions.onDirectory([]); networkOptions.onDirectory([{ ...entry, ownerPeerId: 'speaker' }]);
    return { wrong, matched, reappeared: host.getStatus().bodies[0] };
  });
  assert.equal(result.wrong.caption, undefined); assert.equal(result.matched.caption, 'First public reply');
  assert.equal(result.reappeared.caption, undefined);
});

test('owner edits persist identity and private history; local clones start new bodies without private history', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.spawn({ name: 'Ada', instructions: 'Be curious', goals: ['Meet people'] });
    const key = host.getStatus().selectedKey, original = view.selected.agentId;
    await host.send({ text: 'Private secret only for Ada.' });
    await callbacks.onEdit({ key, name: 'Ada revised', instructions: 'Be patient', goals: ['Listen'], localOnly: true,
      movement: 'stationary', allowCloning: true, shared: true, respondToWorldChat: true });
    const head = await agents.get(original), published = networkOptions.listLocalAgents()[0];
    const clone = await callbacks.onClone({ key });
    const cloneEvents = await agents.events(clone.agentId);
    await host.dispose(); await start();
    return { original, head, published, clone, cloneEvents, restored: host.getStatus().bodies };
  });
  assert.equal(result.head.agentId, result.original); assert.equal(result.head.identity.name, 'Ada revised');
  assert.equal(result.head.policy.inferenceMode, 'local-only'); assert.equal(result.published.cloneable, true);
  assert.equal(result.published.instructions, undefined); assert.equal(result.published.goals, undefined);
  assert.notEqual(result.clone.agentId, result.original); assert.equal(result.clone.identity.instructions, 'Be patient');
  assert.deepEqual(result.clone.goals, ['Listen']); assert.equal(result.clone.context.summary, '');
  assert.equal(result.clone.embodiments[0].respondToWorldChat, false); assert.equal(result.clone.embodiments[0].allowCloning, false);
  assert.equal(JSON.stringify(result.cloneEvents).includes('Private secret'), false);
  assert.equal(result.restored.length, 2);
});

test('remote clone uses authenticated owner profile and cannot edit the source or bypass opt-in', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const descriptor = { agentId: 'peer-agent', ownerPeerId: 'peer-owner', name: 'Peer Ada', position: [0, 3, 0], color: '#aabbcc', status: 'idle' };
    networkOptions.onDirectory([descriptor]); const key = 'peer-owner:peer-agent';
    let denied, editDenied;
    try { await host.clone({ key }); } catch (error) { denied = error.message; }
    try { await host.edit({ key, name: 'Hijacked' }); } catch (error) { editDenied = error.message; }
    networkOptions.onDirectory([{ ...descriptor, cloneable: true }]);
    window.remoteProfile = { schema: 'peercompute.resident-profile.v1', sourceAgentId: 'peer-agent', name: 'Peer Ada',
      instructions: 'Explore', goals: ['Look around'], appearancePrompt: '', color: '#aabbcc' };
    const clone = await host.clone({ key, name: 'My Ada' });
    return { denied, editDenied, clone, calls };
  });
  assert.match(result.denied, /not enabled cloning/); assert.match(result.editDenied, /Only the owner/);
  assert.equal(result.clone.identity.name, 'My Ada'); assert.notEqual(result.clone.agentId, 'peer-agent');
  assert.deepEqual(result.calls.find(c => c[0] === 'clone-request').slice(1), ['peer-owner', { agentId: 'peer-agent' }]);
});

test('embodied replies use real durable scoped memory and display text instead of JSON after reload', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; await start();
    await host.spawn({ name: 'Ada' }); const key = host.getStatus().selectedKey, agentId = view.selected.agentId;
    window.fixtureAnswer = 'I will come closer.';
    window.fixtureIntentDecision = { intent: { type: 'approach', targetId: 'speaker' } };
    await host.send({ key, text: 'Please come here.' });
    physicalOutcome({ ...lastIntent, status: 'arrived', position: [15, 3, 5], policyId: 'controlled-physical-fixture', backend: 'fixture' });
    await new Promise(resolve => setTimeout(resolve, 20));
    const originalMessages = view.messages;
    await host.dispose(); await start(); await host.openConversation(key);
    const restoredMessages = view.messages;
    window.fixtureAnswer = 'We met here earlier.'; window.fixtureIntentDecision = { intent: null };
    await host.send({ key, text: 'Do you remember meeting me?' });
    const input = calls.filter(c => c[0] === 'generate').at(-1)[1];
    return { originalMessages, restoredMessages, input, memory: await episodeStore.stats(), agentId };
  });
  assert.equal(result.originalMessages[1].text, 'I will come closer.');
  assert.equal(result.restoredMessages[0].text, 'Please come here.'); assert.equal(result.restoredMessages[1].text, 'I will come closer.');
  const input = JSON.stringify(result.input.messages); assert.match(input, /verified-action/); assert.match(input, /approach: arrived/);
  assert.deepEqual(result.input.messages.filter(message => message.role === 'user').map(message => message.content),
    ['Please come here.', 'Do you remember meeting me?']);
  assert.match(result.input.taskInstructions, /WASD moves/);
  assert.equal(result.input.contextHistory, undefined);
  assert(!JSON.parse(result.input.worldContext).memories.some(memory => memory.kind === 'composed-reply'));
  assert(!result.input.messages.some(message => message.content.includes('Return one valid JSON object')));
  assert.equal(result.memory.retainedEntries >= 3, true);
});

test('clone history copies only owner-shared public episodes and labels their donor', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; await start();
    await host.spawn({ name: 'Ada', shareMemories: true }); const key = host.getStatus().selectedKey, source = view.selected.agentId;
    const make = async (audience, conversationId, text) => episodeStore.append({ agentId: source, worldId: 'cubechat:test', audience,
      conversationId, kind: 'heard', who: { peerId: 'owner', name: 'Owner' }, where: [1, 3, 5], outcome: 'A participant said this', text,
      source: { kind: 'authenticated-message', eventId: crypto.randomUUID(), peerId: 'owner' } });
    const publicId = await worldConversationId('cubechat:test', 'public-room');
    for (let i = 0; i < 12; i++) await make('public', publicId, `We met at the blue cube, episode ${i}.`);
    await make('private', await worldConversationId('cubechat:test', 'owner'), 'Private password conversation.');
    const profile = await networkOptions.getProfile({ agentId: source });
    const clone = await host.clone({ key });
    const episodes = await episodeStore.retrieve({ agentId: clone.agentId, worldId: 'cubechat:test', audience: 'public', conversationId: publicId });
    await host.edit({ key, sharePrivateMemories: true });
    const privateProfile = await networkOptions.getProfile({ agentId: source });
    const privateClone = await host.clone({ key });
    const inheritedPrivate = await episodeStore.retrieve({ agentId: privateClone.agentId, worldId: 'cubechat:test',
      audience: 'private', conversationId: await worldConversationId('cubechat:test', 'owner') });
    const inheritedPublic = await episodeStore.retrieve({ agentId: privateClone.agentId, worldId: 'cubechat:test', audience: 'public', conversationId: publicId });
    await host.edit({ key, shareMemories: false });
    const optedOut = await networkOptions.getProfile({ agentId: source });
    return { source, profile, clone, episodes, optedOut, privateProfile, privateClone, inheritedPrivate, inheritedPublic };
  });
  assert.equal(result.profile.memories.length, 12); assert.equal(result.clone.inheritedMemories, 12);
  assert(result.profile.memories.some(e => e.text.endsWith('episode 0.')));
  assert.equal(result.episodes[0].source.kind, 'shared-memory'); assert.equal(result.episodes[0].source.sourceAgentId, result.source);
  assert.match(result.episodes[0].text, /blue cube/); assert.equal(JSON.stringify(result.profile).includes('Private password'), false);
  assert.equal(result.optedOut.memories, undefined);
  assert.equal(result.privateProfile.memories.length, 13); assert.equal(result.privateClone.inheritedMemories, 13);
  assert.equal(result.inheritedPrivate.length, 1); assert.match(result.inheritedPrivate[0].text, /Private password/);
  assert.equal(JSON.stringify(result.inheritedPublic).includes('Private password'), false);
});

test('explicit stationary selection stops a model intention even when saved preference was already stationary', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; await start();
    await host.spawn({ name: 'Ada', movement: 'stationary' }); const key = host.getStatus().selectedKey;
    window.fixtureAnswer = 'I will follow.'; window.fixtureIntentDecision = { intent: { type: 'follow', targetId: 'speaker' } };
    await host.send({ text: 'Follow me' });
    await host.edit({ key, movement: 'stationary' });
    return { key, actions: calls.filter(c => c[0] === 'intent' || c[0] === 'movement') };
  });
  assert.equal(result.actions[0][2].type, 'follow');
  assert.deepEqual(result.actions.at(-1), ['movement', result.key, 'stationary']);
});

test('failed full-history import leaves no activated clone or partial inherited memories', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; await start();
    await host.spawn({ name: 'Ada', shareMemories: true }); const key = host.getStatus().selectedKey, source = view.selected.agentId;
    await episodeStore.append({ agentId: source, worldId: 'cubechat:test', audience: 'public',
      conversationId: await worldConversationId('cubechat:test', 'public-room'), kind: 'heard',
      who: { peerId: 'owner', name: 'Owner' }, where: [1, 3, 5], outcome: 'Heard', text: 'Retain this original memory.',
      source: { kind: 'authenticated-message', eventId: 'source-event', peerId: 'owner' } });
    episodeStore.maximumEntries = 1;
    let failure; try { await host.clone({ key }); } catch (error) { failure = error.message; }
    await new Promise(resolve => setTimeout(resolve, 20));
    return { failure, bodies: host.getStatus().bodies, heads: await agents.list(), stats: await episodeStore.stats(), source };
  });
  assert.match(result.failure, /capacity|retain|space|limit/i);
  assert.equal(result.heads.length, 1); assert.equal(result.heads[0].agentId, result.source);
  assert.equal(result.bodies.length, 1); assert.equal(result.stats.retainedEntries, 1);
});

test('a clone has no advertised body until its whole inherited history is durable', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; await start();
    await host.spawn({ name: 'Ada', shareMemories: true }); const key = host.getStatus().selectedKey, source = view.selected.agentId;
    await host.send({ text: 'Remember this public test setup.' });
    await host.edit({ key, sharePrivateMemories: true });
    const inherit = episodeStore.inheritSnapshot.bind(episodeStore);
    episodeStore.inheritSnapshot = async (...args) => {
      await new Promise(resolve => { window.releaseHistory = resolve; }); return inherit(...args);
    };
    window.cloning = host.clone({ key });
  });
  await page.waitForFunction(() => window.releaseHistory);
  const staged = await page.evaluate(async () => ({ heads: await agents.list(), bodies: host.getStatus().bodies,
    published: networkOptions.listLocalAgents() }));
  assert.equal(staged.heads.length, 2); assert.equal(staged.bodies.length, 1); assert.equal(staged.published.length, 1);
  assert.equal(staged.heads.filter(h => h.embodiments.length === 0).length, 1);
  const after = await page.evaluate(async () => { releaseHistory(); const head = await cloning; return { head, bodies: host.getStatus().bodies }; });
  assert.equal(after.bodies.length, 2); assert.equal(after.head.inheritedMemories, 2);
});

test('profile chunk permissions read persisted consent even while an older directory refresh is pending', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    await host.spawn({ name: 'Ada', shareMemories: true }); window.sourceId = view.selected.agentId;
    const originalList = agents.list.bind(agents); let held = false;
    agents.list = async (...args) => {
      const snapshot = await originalList(...args);
      if (!held) { held = true; await new Promise(resolve => { window.releaseList = resolve; }); }
      return snapshot;
    };
    await agents.update(sourceId, { name: 'Ada before revocation' });
  });
  await page.waitForFunction(() => window.releaseList);
  const result = await page.evaluate(async () => {
    const head = await agents.get(sourceId);
    await agents.update(sourceId, { embodiments: head.embodiments.map(binding => ({ ...binding, shareMemories: false, allowCloning: false })) });
    const cached = networkOptions.listLocalAgents()[0];
    const authoritative = await networkOptions.getProfilePermissions({ agentId: sourceId });
    releaseList(); return { cached, authoritative };
  });
  assert.equal(result.cached.cloneable, true);
  assert.deepEqual(result.authoritative, { cloneable: false, sharesMemories: false, sharesPrivateMemories: false });
});

test('opted-in residents greet nearby people through managed inference and retain only public encounter memories', async t => {
  const page = await fixture(t);
  const id = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true;
    window.socialOptions = { tickMs: 100, dwellMs: 0, humanQuietMs: 0 };
    window.fixtureAnswer = JSON.stringify({ decision: 'speak', text: 'Hello there!', intent: null, goal: 'Learn about their garden' });
    await start(); const head = await host.spawn({ name: 'Ada', initiateConversations: true, localOnly: true, shared: true });
    return head.agentId;
  });
  try { await page.waitForFunction(() => calls.some(c => c[0] === 'public-message'), null, { timeout: 8000 }); }
  catch (error) { console.error('Social start diagnostic', await page.evaluate(() => ({ status: host.getStatus(), calls, view }))); throw error; }
  const result = await page.evaluate(async id => ({
    published: calls.filter(c => c[0] === 'public-message'), head: await agents.get(id), events: await agents.events(id),
    episodes: await episodeStore.snapshot({ agentId: id, worldId: 'cubechat:test' }),
    bodies: host.getStatus().bodies, social: host.getStatus().social,
  }), id);
  assert.equal(result.published.length, 1); assert.equal(result.published[0][1].text, 'Hello there!');
  assert.equal(result.published[0][1].social.turn, 0); assert.equal(result.published[0][1].social.targetPeerId, 'owner');
  assert.equal(result.head.status, 'waiting'); assert(!result.events.some(e => ['request', 'prepared', 'dispatched'].includes(e.type)));
  assert(result.episodes.some(e => e.kind === 'encounter')); assert(!result.episodes.some(e => e.kind === 'heard'));
  assert(result.episodes.some(e => e.kind === 'social-goal')); assert(result.episodes.every(e => e.audience === 'public'));
  await page.waitForTimeout(350);
  assert.equal(await page.evaluate(() => calls.filter(c => c[0] === 'public-message').length), 1, 'cooldown prevents repeated greeting');
});

test('a human can preempt speculative speech without pausing the resident or publishing stale text', async t => {
  const page = await fixture(t);
  const id = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; window.waitSocial = true;
    window.socialOptions = { tickMs: 100, dwellMs: 0, humanQuietMs: 1000 };
    await start(); const head = await host.spawn({ name: 'Ada', initiateConversations: true, localOnly: true });
    return head.agentId;
  });
  await page.waitForFunction(() => calls.some(c => c[0] === 'generate'));
  const result = await page.evaluate(async id => {
    window.fixtureAnswer = 'Human reply';
    await host.send({ key: 'local:' + id, text: 'Talk to me instead' });
    return { head: await agents.get(id), calls, status: host.getStatus(), events: await agents.events(id) };
  }, id);
  assert(result.calls.some(c => c[0] === 'social-aborted'));
  assert.equal(result.calls.filter(c => c[0] === 'public-message').length, 0);
  assert.equal(result.head.status, 'completed'); assert.notEqual(result.head.recoveryRequired, true);
  assert.equal(result.events.filter(e => e.type === 'request').length, 1);
});

test('no model creates no failed resident run, and opting out prevents later automatic work', async t => {
  const page = await fixture(t);
  const id = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; window.noTextProvider = true;
    window.socialOptions = { tickMs: 100, dwellMs: 0, humanQuietMs: 0 };
    await start(); return (await host.spawn({ name: 'Ada', initiateConversations: true })).agentId;
  });
  await page.waitForFunction(() => host.getStatus().bodies.some(b => b.socialStatus === 'waiting-for-model'));
  const result = await page.evaluate(async id => {
    await host.edit({ key: 'local:' + id, initiateConversations: false }); window.noTextProvider = false;
    return { head: await agents.get(id), calls, episodes: await episodeStore.snapshot({ agentId: id, worldId: 'cubechat:test' }) };
  }, id);
  assert.equal(result.head.status, 'waiting'); assert.equal(result.head.embodiments[0].initiateConversations, false);
  assert(!result.calls.some(c => c[0] === 'generate')); assert.equal(result.episodes.length, 0);
  await page.waitForTimeout(250); assert.equal(await page.evaluate(() => calls.filter(c => c[0] === 'generate').length), 0);
});

test('a greeting committed before human interruption still records the eventual transport receipt', async t => {
  const page = await fixture(t);
  const id = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; window.holdPublicReceipt = true;
    window.socialOptions = { tickMs: 100, dwellMs: 0, humanQuietMs: 0 };
    window.fixtureAnswer = '{"decision":"speak","text":"Hello!","intent":null}';
    await start(); return (await host.spawn({ name: 'Ada', initiateConversations: true })).agentId;
  });
  await page.waitForFunction(() => window.releasePublicReceipt);
  await page.evaluate(() => { window.cancelledSocial = host.cancel(); releasePublicReceipt(); });
  const result = await page.evaluate(async id => {
    await cancelledSocial;
    return { episodes: await episodeStore.snapshot({ agentId: id, worldId: 'cubechat:test' }), calls, head: await agents.get(id) };
  }, id);
  assert.equal(result.calls.filter(c => c[0] === 'public-message').length, 1);
  assert.equal(result.episodes.filter(e => e.kind === 'social-delivery').length, 1);
  assert.match(result.episodes.find(e => e.kind === 'social-delivery').outcome, /acknowledged by 1/);
  assert.equal(result.head.status, 'waiting');
});

test('social follow-ups cancel promptly when their observed participant leaves', async t => {
  const page = await fixture(t);
  const id = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; window.waitSocial = true; await start();
    const head = await host.spawn({ name: 'Ada', respondToWorldChat: true });
    window.fixtureParticipants = [{ id: 'resident:visitor:bert', ownerPeerId: 'visitor', agentId: 'bert', kind: 'resident', name: 'Bert', position: [25,3,5], distance: 24 }];
    networkOptions.onDirectory([{ agentId: 'bert', ownerPeerId: 'visitor', name: 'Bert', position: [25,3,5], color: '#8fffd4', status: 'idle' }]);
    const startedAt = Date.now();
    host.receiveWorldMessage({ id: 'greeting', peerId: 'visitor', agentId: 'bert', name: 'Bert', text: 'Hello Ada',
      social: { rootId: 'root', rootPeerId: 'visitor', rootAgentId: 'bert', targetPeerId: 'owner', targetAgentId: head.agentId,
        startedAt, expiresAt: startedAt + 60000, turn: 0 } });
    return head.agentId;
  });
  await page.waitForFunction(() => calls.some(c => c[0] === 'generate'));
  await page.evaluate(() => { window.fixtureParticipants = []; });
  await page.waitForFunction(() => calls.some(c => c[0] === 'social-aborted'), null, { timeout: 3000 });
  const result = await page.evaluate(async id => ({ head: await agents.get(id), events: await agents.events(id), calls }), id);
  assert.equal(result.head.status, 'waiting'); assert(!result.events.some(e => e.type === 'request'));
  assert(!result.calls.some(c => c[0] === 'public-message' || c[0] === 'intent'));
});

test('objectives checkpoint two ordered physical steps without publishing private goals', async t => {
  const page = await fixture(t);
  const key = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true;
    window.fixtureParticipants = [
      { id: 'human:owner', peerId: 'owner', kind: 'human', name: 'Owner', position: [0,3,5], distance: 1 },
      { id: 'resident:visitor:nova', ownerPeerId: 'visitor', agentId: 'nova', kind: 'resident', name: 'Nova', position: [25,3,5], distance: 24 },
    ];
    window.objectiveAnswers = [
      { decision: 'plan', milestones: [{ label: 'Visit Nova', type: 'approach', targetId: 'p2' },
        { label: 'Return to owner', type: 'approach', targetId: 'speaker' }] },
      { decision: 'act', intent: { type: 'approach', targetId: 'p2', stopDistance: 10 }, reason: 'Visit Nova first.' },
      { decision: 'act', intent: { type: 'approach', targetId: 'speaker', stopDistance: 10 }, reason: 'Return to the owner after arrival.' },
    ];
    await start(); const head = await host.spawn({ name: 'Ada', shared: true });
    const key = 'local:' + head.agentId;
    await host.assignGoal({ key, objective: 'Private objective marker: visit Nova, then come back to me.' }); return key;
  });
  await page.waitForFunction(() => window.lastIntent?.targetId === 'resident:visitor:nova');
  const first = await page.evaluate(async key => {
    const saved = await host.getObjective(key), action = { ...lastIntent };
    if (saved.pendingAction?.requestId !== action.requestId) throw Error('Action preceded its durable checkpoint');
    physicalOutcome({ ...action, status: 'arrived', position: [15,3,5] }); return action;
  }, key);
  await page.waitForFunction(() => window.lastIntent?.targetId === 'human:owner');
  await page.evaluate(({ first }) => {
    const action = { ...lastIntent };
    objectiveAnswers.push({ decision: 'done', assessment: 'Both requested arrivals are recorded.', receiptIds: ['r1', 'r2'] });
    physicalOutcome({ ...action, status: 'arrived', position: [8,3,5] });
  }, { first });
  await page.waitForFunction(key => view.objectives?.[key]?.status === 'completed', key);
  const result = await page.evaluate(async key => ({ saved: await host.getObjective(key),
    directory: await networkOptions.listLocalAgents(), events: await agents.events(key.slice(6)), calls }), key);
  assert.equal(result.saved.receipts.length, 2);
  assert.deepEqual(result.saved.receipts.map(r => r.targetId), ['resident:visitor:nova', 'human:owner']);
  assert.equal(result.saved.pendingAction, null); assert.equal(result.saved.steps, 4);
  assert.deepEqual(result.saved.completedMilestones.map(item => item.index), [0, 1]);
  assert.doesNotMatch(JSON.stringify(result.directory), /Private objective marker|Both requested arrivals/);
  assert(!result.events.some(e => e.type === 'request'), 'Planner uses its own checkpoint, not a fabricated human journal turn');
  assert(!result.calls.some(c => c[0] === 'public-message'));
});

test('objective progress restores paused, never replays, and visitors cannot control it', async t => {
  const page = await fixture(t);
  const saved = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true;
    window.objectiveAnswers = [
      { decision: 'plan', milestones: [{ label: 'Approach owner', type: 'approach', targetId: 'speaker' }] },
      { decision: 'act', intent: { type: 'approach', targetId: 'speaker' }, reason: 'Approach owner.' }];
    await start(); const head = await host.spawn({ name: 'Ada', shared: true }); const key = 'local:' + head.agentId;
    await host.assignGoal({ key, objective: 'Come to the owner and wait.' }); return { key, id: head.agentId };
  });
  await page.waitForFunction(() => !!window.lastIntent?.requestId);
  const result = await page.evaluate(async ({ key, id }) => {
    const before = await host.getObjective(key); await host.dispose(); calls.length = 0; await start(); await host.ready;
    const restored = await host.getObjective(key);
    networkOptions.onDirectory([{ agentId: 'foreign', ownerPeerId: 'visitor', name: 'Foreign', position: [20,3,5], color: '#8fffd4', status: 'paused' }]);
    const remote = 'visitor:foreign', denied = [];
    for (const method of ['assignGoal','pauseGoal','resumeGoal','cancelGoal']) {
      try { await host[method]({ key: remote, objective: 'Unauthorized', goalId: before.goalId, expectedRevision: before.revision }); }
      catch (e) { denied.push(e.message); }
    }
    return { before, restored, denied, calls, head: await agents.get(id) };
  }, saved);
  assert.equal(result.restored.goalId, result.before.goalId); assert.equal(result.restored.status, 'paused');
  assert.equal(result.denied.length, 4); assert(result.denied.every(message => /owner/i.test(message)));
  assert(!result.calls.some(c => c[0] === 'objective-generation' || c[0] === 'intent'), 'Restoring never replays pending effects');
  assert.notEqual(result.head.status, 'paused', 'Objective state is separate from resident chat readiness');
});

test('a human conversation preempts objective planning without pausing the resident', async t => {
  const page = await fixture(t);
  const key = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; window.waitObjective = true; await start();
    const head = await host.spawn({ name: 'Ada' }); const key = 'local:' + head.agentId;
    await host.assignGoal({ key, objective: 'Consider moving toward the owner.' }); return key;
  });
  await page.waitForFunction(() => calls.some(c => c[0] === 'objective-generation'));
  const result = await page.evaluate(async key => {
    await host.send({ key, text: 'Hello, answer this human first.' });
    return { goal: await host.getObjective(key), head: await agents.get(key.slice(6)), calls };
  }, key);
  assert.equal(result.goal.pendingDecision, null); assert.equal(result.head.status, 'completed');
  const interrupted = result.calls.findIndex(c => c[0] === 'objective-aborted');
  const human = result.calls.findIndex(c => c[0] === 'generate' && c[1].prompt === 'Hello, answer this human first.');
  assert(interrupted >= 0 && human > interrupted, 'The old planner settles before human inference starts');
  assert(!result.calls.some(c => c[0] === 'intent'));
});

test('default guide is persistent without opening chat, and preserves owner edits, pause and removal', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.dispose(); window.defaultGuide = true; await start();
    const first = (await agents.list())[0], selected = host.getStatus().selectedKey;
    await host.edit({ key: `local:${first.agentId}`, name: 'My guide', selfModifiable: false });
    await agents.pause(first.agentId); await host.dispose(); await start();
    const reloaded = (await agents.list())[0];
    await host.remove(`local:${first.agentId}`); await host.dispose(); await start();
    return { first, selected, reloaded, records: await agents.list(), bodies: host.getStatus().bodies,
      generations: calls.filter(item => Array.isArray(item) && item[0] === 'generate').length };
  });
  assert.equal(result.selected, undefined);
  assert.equal(result.reloaded.agentId, result.first.agentId);
  assert.equal(result.reloaded.identity.name, 'My guide');
  assert.equal(result.reloaded.status, 'paused');
  assert.equal(result.reloaded.embodiments[0].selfModifiable, false);
  assert.equal(result.records.length, 1);
  assert.equal(result.bodies.length, 0);
  assert.equal(result.generations, 0);
});

test('default standing welcome waits for a model then survives a rotated owner peer ID without another generation', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    await host.dispose(); window.defaultGuide = true; window.embodiedFixture = true; window.noTextProvider = true;
    window.socialOptions = { tickMs: 100, dwellMs: 0, modelBackoffMs: 1000, cooldownMs: 0, targetCooldownMs: 0, humanQuietMs: 0 };
    window.fixtureAnswer = JSON.stringify({ decision: 'speak', text: 'Welcome from the deterministic fixture.', intent: null });
    await start();
  });
  await page.waitForFunction(() => host.getStatus().bodies[0]?.standingStatus === 'waiting-for-model');
  assert.equal(await page.evaluate(() => calls.filter(item => Array.isArray(item) && item[0] === 'generate').length), 0);
  await page.evaluate(() => { window.noTextProvider = false; });
  await page.waitForFunction(() => host.getStatus().bodies[0]?.standingStatus === 'spoken');
  const first = await page.evaluate(async () => {
    const body = host.getStatus().bodies[0];
    return { id: body.agentId, scope: { worldId: 'cubechat:test', agentId: body.agentId, goalId: 'welcome-v1', targetId: `owner:${agents.store.hostId}` },
      sends: calls.filter(item => Array.isArray(item) && item[0] === 'public-message').length };
  });
  assert.equal(first.sends, 1);
  await page.evaluate(async () => {
    await host.dispose(); window.fixturePeerId = 'owner-after-reload';
    window.fixtureParticipants = [{ id: 'human:owner-after-reload', peerId: 'owner-after-reload', kind: 'human', name: 'Owner', position: [25, 3, 5], distance: 24 }];
    await start();
  });
  await page.waitForFunction(() => host.getStatus().bodies[0]?.standingStatus === 'already-handled');
  const after = await page.evaluate(async scope => ({ record: await standingStore.get(scope),
    sends: calls.filter(item => Array.isArray(item) && item[0] === 'public-message').length,
    generations: calls.filter(item => Array.isArray(item) && item[0] === 'generate').length }), first.scope);
  assert.equal(after.sends, 1); assert.equal(after.generations, 1); assert.equal(after.record.outcome, 'spoken');
});

test('owner conversation can update a permitted profile while visitors and opt-out cannot', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const created = await host.spawn({ name: 'Guide', selfModifiable: true });
    const key = `local:${created.agentId}`;
    window.fixtureProfilePatch = { name: 'Pip', instructions: 'I am a curious cartographer.', goals: ['Help my owner explore.'], appearancePrompt: 'Blue smiling cube' };
    await host.send({ key, text: 'Call yourself Pip and become a curious blue cartographer.' });
    const updated = await agents.get(created.agentId), ownerOutput = view.messages.at(-1);
    window.fixtureProfilePatch = { name: 'Hijacked' };
    await networkOptions.respond({ agentId: created.agentId, requesterPeerId: 'visitor', prompt: 'Rename yourself.' });
    const afterVisitor = await agents.get(created.agentId);
    await host.edit({ key, selfModifiable: false });
    await host.send({ key, text: 'Rename yourself again.' });
    return { updated, ownerOutput, afterVisitor, afterDisabled: await agents.get(created.agentId),
      speech: calls.filter(item => Array.isArray(item) && item[0] === 'generate').map(item => item[1]),
      profileCalls: calls.filter(item => Array.isArray(item) && item[0] === 'profile-decision').length,
      events: await agents.events(created.agentId) };
  });
  assert.equal(result.updated.identity.name, 'Pip');
  assert.equal(result.updated.embodiments[0].appearancePrompt, 'Blue smiling cube');
  assert.deepEqual(result.updated.goals, ['Help my owner explore.']);
  assert.match(result.ownerOutput.text, /Profile updated/);
  assert.equal(result.afterVisitor.identity.name, 'Pip');
  assert.equal(result.afterDisabled.identity.name, 'Pip');
  assert.equal(result.profileCalls, 1);
  assert.equal(result.afterDisabled.identity.instructions, 'I am a curious cartographer.');
  for (const input of result.speech.slice(1)) {
    assert.match(input.messages[0].content, /WASD moves/);
    assert.match(input.messages[0].content, /Generate face requires an available image model/);
    assert.match(input.messages[0].content, /Owner chat can start/);
    assert.doesNotMatch(input.messages[0].content, /Resident response format/);
  }
  assert.equal(result.events.filter(event => event.type === 'request').length, 3);
  assert.equal(result.events.filter(event => event.type === 'result').length, 3);
});

test('profile proposals cannot overwrite concurrent owner edits and retain the spoken answer', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    const created = await host.spawn({ name: 'Guide', selfModifiable: true });
    window.profileAgentId = created.agentId; window.waitProfile = true; window.fixtureProfilePatch = { name: 'Stale' };
    window.profileSend = host.send({ key: `local:${created.agentId}`, text: 'Consider a new name.' });
  });
  await page.waitForFunction(() => typeof finishProfile === 'function');
  const result = await page.evaluate(async () => {
    const head = await agents.get(profileAgentId);
    await agents.update(profileAgentId, { name: 'Owner chose this' }, { expectedRevision: head.revision });
    finishProfile(); await profileSend;
    return { head: await agents.get(profileAgentId), answer: view.messages.at(-1).text };
  });
  assert.equal(result.head.identity.name, 'Owner chose this');
  assert.match(result.answer, /Fixture response/);
  assert.match(result.answer, /Profile not updated/);
});

test('profile context failure preserves completed speech and does not pause the guide', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const head = await host.spawn({ name: 'Guide', selfModifiable: true }); window.profileError = true;
    await host.send({ key: `local:${head.agentId}`, text: 'Tell me about yourself.' });
    return { answer: view.messages.at(-1).text, head: await agents.get(head.agentId) };
  });
  assert.match(result.answer, /Fixture response/); assert.match(result.answer, /Profile not updated: Profile context/);
  assert.equal(result.head.status, 'completed'); assert.equal(result.head.identity.name, 'Guide');
});

test('a roster refresh failure cannot hide successful profile persistence or completed speech', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    const head = await host.spawn({ name: 'Guide', selfModifiable: true }); window.profileAgentId = head.agentId;
    window.waitProfile = true; window.fixtureProfilePatch = { name: 'Saved name' };
    window.profileSend = host.send({ key: `local:${head.agentId}`, text: 'Choose a new name.' });
  });
  await page.waitForFunction(() => typeof finishProfile === 'function');
  const result = await page.evaluate(async () => {
    const original = agents.list.bind(agents); agents.list = async () => { throw new Error('Roster fixture unavailable'); };
    finishProfile(); await profileSend; agents.list = original;
    return { answer: view.messages.at(-1).text, head: await agents.get(profileAgentId) };
  });
  assert.match(result.answer, /Fixture response/); assert.match(result.answer, /Profile updated: name/);
  assert.equal(result.head.identity.name, 'Saved name'); assert.equal(result.head.status, 'completed');
});

test('cold standing-goal discovery does not consume the separate inference deadline', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    await host.dispose(); window.defaultGuide = true; window.embodiedFixture = true;
    window.socialOptions = { tickMs: 100, dwellMs: 0, humanQuietMs: 0 };
    window.fixtureAnswer = JSON.stringify({ decision: 'speak', text: 'Welcome after cold discovery.', intent: null });
    // Scale only the old host-wide 45s timer: the earlier code aborts while
    // discovery is pending. All scene, IDB and real host code remains in use.
    window.originalTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, ms, ...args) => originalTimeout(callback, ms === 45000 ? 25 : ms, ...args);
    window.waitPreflight = true; await start();
  });
  await page.waitForFunction(() => typeof finishPreflight === 'function');
  await page.waitForTimeout(100);
  await page.evaluate(() => { window.setTimeout = originalTimeout; window.waitPreflight = false; finishPreflight(); });
  await page.waitForFunction(() => host.getStatus().bodies[0]?.standingStatus === 'spoken', null, { timeout: 5000 });
  assert.equal(await page.evaluate(() => calls.filter(item => Array.isArray(item) && item[0] === 'public-message').length), 1);
});

test('owner chat admits original task durably, pauses immediate control and never grants visitors task authority', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    await host.dispose(); window.embodiedFixture = true; await start();
    const head = await host.spawn({ name: 'Ada', shared: true, selfModifiable: true });
    const key = 'local:' + head.agentId, prompt = 'Explore a distant place and return to this spot.';
    window.fixtureIntentDecision = { task: true };
    await host.send({ key, text: prompt });
    const goal = await host.getObjective(key);
    const profiles = calls.filter(c => c[0] === 'profile-decision').length;
    window.fixtureIntentDecision = { intent: { type: 'stop' } };
    await host.send({ key, text: 'Stop moving.' });
    const paused = await host.getObjective(key);
    const before = calls.filter(c => c[0] === 'intent-decision').length;
    window.fixtureIntentDecision = { task: true };
    const visitor = await networkOptions.respond({ agentId: head.agentId, prompt: 'Go away and return.', requesterPeerId: 'visitor' }, { signal: new AbortController().signal });
    return { key, prompt, goal, profiles, paused, visitor, visitorCalls: calls.filter(c => c[0] === 'intent-decision').slice(before),
      current: await host.getObjective(key), events: await agents.events(head.agentId) };
  });
  assert.equal(result.goal.objective, result.prompt);
  assert.deepEqual(result.goal.originPosition, [1, 3, 5]);
  assert.equal(result.goal.status, 'ready'); assert.equal(result.profiles, 0);
  assert.equal(result.paused.status, 'paused');
  assert.equal(result.current.goalId, result.goal.goalId);
  assert.match(result.visitor.text, /Action not started/);
  assert(!result.visitorCalls[0][1].messages[0].content.includes('Classify the owner'));
  assert(result.events.some(e => e.type === 'request' && e.text === result.prompt));
  assert(!result.events.some(e => e.type === 'result' && e.text?.includes('task":true')));
});

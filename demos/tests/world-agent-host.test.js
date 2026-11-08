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
    Object.assign(window, { calls: [], view: {}, speechChunks, worldConversationId });
    const candidate = { key: 'local', local: true, available: true, manifestCid: 'fixture', sessionId: 'fixture', runtime: 'transformers.js',
      task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
    window.start = async () => {
      const bodies = new Map(); window.bodyMap = bodies;
      host = installWorldAgents({ worldId: 'cubechat:test', worldLabel: 'CubeChat',
        publishWorldMessage: async (input, options) => {
          options.signal.throwIfAborted(); calls.push(['public-message', input]);
          host.receiveWorldMessage({ ...input, peerId: window.fixturePeerId ?? 'owner', id: crypto.randomUUID() });
        },
        exclusiveEmbodiments: window.exclusiveBodies ?? false,
        getRuntimeOptions: () => ({ networkManager: window.roomManager }),
        beforeOpen: () => calls.push('input-release'),
        adapter: { upsert: (body) => bodies.set(body.key, body), remove: (key) => bodies.delete(key), normalizePosition: (value) => [...value],
          getSpawnPosition: () => [1, 3, 5], getPosition: (key) => bodies.get(key)?.position,
          getContext: (body) => ({ position: [...body.position] }), focus: () => {},
          setAppearance: (key, image) => calls.push(['face', key, image]),
          getAudioPose: () => ({}), dispose: () => { calls.push('adapter-dispose'); bodies.clear(); } },
        uiFactory: (callbacks) => { window.callbacks = callbacks; return {
          open: () => { callbacks.onOpen?.(); view.open = true; }, dispose: () => { view.open = false; calls.push('ui-dispose'); },
          select: (body) => { view.selected = body; }, setAgents: (list) => { view.agents = list; }, setMessages: (items) => { view.messages = items; },
          setStatus: (value) => { view.status = value; }, setBusy: (value) => { view.busy = value; }, setVoiceStatus: (value) => { view.voice = value; },
        }; },
        runtimeFactory: async (options) => {
          calls.push(['runtime', options.residentModelSlots]);
          if (options.networkManager) throw new Error('Room networking must not restrict global model discovery');
          const store = new AgentRecordStore({ name: 'world-fixture' }); await store.open();
          const imageCandidate = { ...candidate, task: 'text-to-image', runtime: 'onnx-diffusion', outputModalities: ['image'] };
          const agents = new AgentRuntime({ store, inference: { listCandidates: async ({ task }) => window.noTextProvider && task === 'text-generation'
            ? [] : [task === 'text-to-image' ? imageCandidate : candidate],
            generate: async (_candidate, input, { signal }) => {
              calls.push(['generate', input]);
              if (input.prompt === 'wait' || window.waitWorld && input.prompt.includes('public world-chat')) {
                await new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
                await new Promise((resolve) => { window.finishCleanup = resolve; });
                signal.throwIfAborted();
              }
              return { text: window.fixtureAnswer ?? 'Fixture response (not real inference).', finishReason: 'stop',
                ...(input.task === 'text-to-image' ? { image: { width: 2, height: 2, channels: 4, data: new Uint8Array(16).fill(123) } } : {}) };
            }, cancel: async () => {} } });
          window.agents = agents;
          return { networkReady: true, networkManager: { peerId: window.fixturePeerId ?? 'owner' }, getAgentController: async () => agents,
            listInferenceTargets: () => window.imageAvailable ? [imageCandidate] : [],
            service: { getStatus: () => ({ status: 'ready', manifestCid: 'fixture', sessionId: 'fixture' }) },
            store: { getManifest: async () => ({ model: imageCandidate }) }, refreshPeers: async () => {},
            dispose: async () => { await agents.dispose(); await store.destroy(); calls.push('runtime-dispose'); } };
        },
        serviceFactory: (options) => { window.networkOptions = options; return {
          start: async () => calls.push('network-start'), close: async () => calls.push('network-close'),
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

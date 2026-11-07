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
  await page.evaluate(async () => {
    const { installWorldAgents, speechChunks, worldConversationId } = await import('/demos/shared/agents/WorldAgentHost.js');
    const { AgentRuntime } = await import('/peercompute/src/peercompute/agents/AgentRuntime.js');
    const { AgentRecordStore } = await import('/peercompute/src/peercompute/agents/AgentRecordStore.js');
    Object.assign(window, { calls: [], view: {}, speechChunks, worldConversationId });
    const candidate = { key: 'local', local: true, available: true, manifestCid: 'fixture', sessionId: 'fixture', runtime: 'transformers.js',
      task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
    window.start = async () => {
      const bodies = new Map();
      host = installWorldAgents({ worldId: 'cubechat:test', worldLabel: 'CubeChat',
        getRuntimeOptions: () => ({ networkManager: window.roomManager }),
        beforeOpen: () => calls.push('input-release'),
        adapter: { upsert: (body) => bodies.set(body.key, body), remove: (key) => bodies.delete(key), normalizePosition: (value) => [...value],
          getSpawnPosition: () => [1, 3, 5], getContext: () => ({ position: [1, 3, 5] }), focus: () => {},
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
          const agents = new AgentRuntime({ store, inference: { listCandidates: async () => [candidate],
            generate: async (_candidate, input, { signal }) => {
              calls.push(['generate', input]);
              if (input.prompt === 'wait') {
                await new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
                await new Promise((resolve) => { window.finishCleanup = resolve; });
                signal.throwIfAborted();
              }
              return { text: 'Fixture response (not real inference).', finishReason: 'stop' };
            }, cancel: async () => {} } });
          window.agents = agents;
          return { networkReady: true, networkManager: { peerId: 'owner' }, getAgentController: async () => agents,
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
  });
  return page;
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

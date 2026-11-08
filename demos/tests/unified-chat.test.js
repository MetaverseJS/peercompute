import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Native DOM, Web Locks and durable IndexedDB, real AgentRuntime/adapter and
// VoiceSession. Only model execution and microphone/playback hardware are
// controlled; these checks do not claim model, audio-device or GPU quality.
let browser, server, origin, cache;
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'peercompute-unified-chat-'));
  server = await createServer({ configFile: false, root: fileURLToPath(new URL('../../', import.meta.url)),
    cacheDir: cache, logLevel: 'error', optimizeDeps: { entries: ['demos/inference/src/agentPanel.js'] },
    server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'unified-chat-fixture', configureServer(vite) {
      vite.middlewares.use('/__unified_chat', (_req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><style>body{margin:0}</style><main class="pc-inference-standalone" id="app"></main>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); });

async function mount(page, options = {}) {
  await page.evaluate(async (options) => {
    const [{ mountInferencePanel }, { AgentRecordStore }, { AgentRuntime }, { createAgentModelAdapter }, { routeInferenceTask }] = await Promise.all([
      import('/demos/inference/src/agentPanel.js'),
      import('/peercompute/src/peercompute/agents/AgentRecordStore.js'),
      import('/peercompute/src/peercompute/agents/AgentRuntime.js'),
      import('/demos/inference/src/agentModelAdapter.js'),
      import('/peercompute/src/peercompute/inference/InferenceRouter.js'),
    ]);
    window.calls = []; window.control = {}; window.captureActive = false;
    window.previewUrls = { created: [], revoked: [] };
    const createURL = URL.createObjectURL.bind(URL), revokeURL = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (blob) => { const url = createURL(blob); previewUrls.created.push(url); return url; };
    URL.revokeObjectURL = (url) => { previewUrls.revoked.push(url); revokeURL(url); };
    const base = [
      ['chat', 'Fixture reasoning', 'text-generation', ['text'], ['text']],
      ['vision', 'Fixture vision', 'image-text-to-text', ['text', 'image'], ['text']],
      ['image', 'Fixture image', 'text-to-image', ['text'], ['image']],
      ['asr', 'Fixture recognition', 'automatic-speech-recognition', ['audio'], ['text']],
      ['tts', 'Fixture speech', 'text-to-speech', ['text'], ['audio']],
    ];
    const descriptors = base.flatMap(([cid, name, task, modalities, outputModalities]) => {
      const descriptor = { manifestCid: cid, name, task, modalities, outputModalities,
        runtime: 'test-managed-runtime', available: true, busy: false, queueAvailable: true };
      const local = options.remoteOnly !== true && !(options.peerSpeechOnly && ['asr', 'tts'].includes(cid));
      return [...(local ? [{ ...descriptor, key: `local:${cid}`, local: true, sessionId: `session-${cid}` }] : []),
        { ...descriptor, key: `peer:${cid}`, local: false }];
    });
    const services = new Map(descriptors.filter((item) => item.local).map((item) => [item.manifestCid,
      { getStatus: () => ({ status: 'ready', manifestCid: item.manifestCid, sessionId: item.sessionId }) }]));
    async function hold(phase, signal) {
      if (control.hold !== phase) return;
      calls.push({ type: 'held', phase });
      await new Promise((resolve) => { if (signal.aborted) resolve(); else signal.addEventListener('abort', resolve, { once: true }); });
      if (control.cleanup) await new Promise((resolve) => { window.releaseCleanup = resolve; });
      signal.throwIfAborted();
    }
    window.nativeStore = new AgentRecordStore({ name: 'unified-chat-native' }); await nativeStore.open();
    window.runtime = {
      networkReady: true,
      store: { async getManifest(cid) { return { model: base.find((entry) => entry[0] === cid) && {
        runtime: 'test-managed-runtime', task: base.find((entry) => entry[0] === cid)[2],
        modalities: base.find((entry) => entry[0] === cid)[3], outputModalities: base.find((entry) => entry[0] === cid)[4],
      } }; } },
      getServiceForModel: (cid) => services.get(cid),
      getPreferences: () => ({ sharing: true, hostInference: true }),
      listModelSources: () => [], listInferenceTargets: () => descriptors,
      async refreshPeers() { calls.push({ type: 'discovery' }); },
      async listStoredModels() { return []; },
      async setSharing() {}, async setHostInference() {}, async unload() {},
      async generate(target, input) {
        input.signal?.throwIfAborted();
        const mode = target === 'local-only' || target.startsWith('local:') ? 'local' : 'mixed';
        const candidates = target.includes(':') ? descriptors.filter((entry) => entry.key === target) : descriptors;
        const { candidate, route } = routeInferenceTask({ task: input.task, mode, candidates });
        const actualRoute = { ...route, ...(candidate.local ? {} : { peerId: 'owned-fixture-peer' }) };
        calls.push({ type: 'execute', target, task: input.task, requestId: input.requestId, local: candidate.local,
          messages: structuredClone(input.messages), prompt: input.prompt, image: input.image ? [...input.image.data] : null });
        input.onProgress?.({ type: 'routing', route: actualRoute });
        if (!candidate.local) input.onProgress?.({ type: 'accepted', peerId: 'owned-fixture-peer', route: actualRoute });
        await hold(input.task, input.signal); input.signal?.throwIfAborted();
        if (input.task === 'automatic-speech-recognition') return { text: 'Recognized private message', route: actualRoute };
        if (input.task === 'text-to-speech') return { audio: new Float32Array(1600), sampleRate: 16000, route: actualRoute };
        if (input.task === 'text-to-image') return { text: '', finishReason: 'stop', route: actualRoute,
          image: { width: 2, height: 2, channels: 4, data: Uint8Array.from([255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255]) } };
        const text = `Reply to ${input.messages?.at(-1)?.content ?? input.prompt}`;
        input.onToken?.(text);
        return { text, finishReason: 'stop', route: actualRoute, ...(candidate.local ? {} : { peerId: 'owned-fixture-peer' }) };
      },
      async cancel(id) { calls.push({ type: 'cancel', id }); },
      async getAgentController() { return nativeController; },
      async dispose() { await nativeController.dispose(); await nativeStore.destroy(); calls.push({ type: 'disposed' }); },
    };
    window.nativeController = new AgentRuntime({ store: nativeStore, inference: createAgentModelAdapter(runtime) });
    let records = await nativeController.list({ limit: 100 });
    if (!records.length) {
      for (const name of ['Ada', 'Beta']) {
        const record = await nativeController.create({ name, instructions: `You are ${name}.`, goals: [`Help ${name}'s visitor`],
          summary: `${name} private memory`, inferenceMode: options.networkAssisted ? 'network-assisted' : 'local-only' });
        if (options.ready || name === 'Beta') await nativeController.resume(record.agentId);
      }
      records = await nativeController.list({ limit: 100 });
    }
    window.ids = Object.fromEntries(records.map((record) => [record.identity.name, record.agentId]));
    if (options.holdInitialList) {
      const list = nativeController.list.bind(nativeController);
      nativeController.list = async (...args) => {
        const records = await list(...args);
        await new Promise((resolve) => { window.releaseInitialList = resolve; });
        calls.push({ type: 'late-initial-list' }); return records;
      };
    }
    window.panel = await mountInferencePanel({ container: document.querySelector('#app'), runtimeFactory: async () => runtime,
      refreshIntervalMs: 600000, audioFactory: async () => ({
        async startRecording({ signal }) { calls.push({ type: 'capture-start' }); await hold('permission', signal); captureActive = true; },
        async stopRecording() { captureActive = false; calls.push({ type: 'capture-stop' }); return { samples: new Float32Array(1600), sampleRate: 16000 }; },
        async cancelRecording() { captureActive = false; calls.push({ type: 'capture-cleanup' }); },
        async play(pcm, { signal }) { calls.push({ type: 'play', samples: pcm.audio.length }); await hold('playback', signal); },
        async stopPlayback() { calls.push({ type: 'playback-cleanup' }); }, async dispose() { calls.push({ type: 'audio-disposed' }); },
      }) });
  }, options);
}

async function fixture(t, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1050, height: 900 } }), page = await context.newPage();
  page.setDefaultTimeout(8000);
  const errors = [], external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  t.after(async () => {
    await page.evaluate(async () => {
      window.releaseCleanup?.(); window.releaseHistory?.(); window.releaseAttachment?.(); window.releaseFinalList?.(); window.releaseInitialList?.();
      await window.panel?.dispose();
    }).catch(() => {});
    await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin + '/__unified_chat'); await mount(page, options);
  return page;
}
const button = (page, name) => page.getByRole('button', { name, exact: true });
const transcript = (page) => page.getByRole('log', { name: 'Conversation', exact: true });
async function agent(page, name = 'Ada') {
  const id = await page.evaluate((name) => ids[name], name);
  await page.locator(`[aria-label="Chat target"] option[value="agent:${id}"]`).waitFor({ state: 'attached' });
  await page.getByLabel('Chat target', { exact: true }).selectOption(`agent:${id}`);
  return id;
}
async function send(page, text) {
  await page.getByLabel('Message', { exact: true }).fill(text);
  await button(page, 'Send').click();
  await transcript(page).getByText(`Reply to ${text}`, { exact: true }).waitFor();
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
}
async function menu(page, name) {
  await button(page, 'Menu').click();
  await page.getByRole('dialog', { name: 'Menu', exact: true }).getByRole('button', {
    name: name === 'Config' ? 'Configure model chat' : name, exact: true,
  }).click();
}

test('one main composer selects a paused saved identity, resumes explicitly and manager only manages', async (t) => {
  const page = await fixture(t); const id = await agent(page);
  await button(page, 'Resume agent').waitFor();
  assert(await button(page, 'Send').isDisabled()); assert(await button(page, 'Talk').isDisabled());
  assert.equal(await page.getByLabel('Message', { exact: true }).count(), 1);
  await button(page, 'Resume agent').click();
  await page.waitForFunction(async (id) => (await nativeController.get(id)).status === 'waiting', id);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'execute').length), 0);
  await button(page, 'Agents').click();
  const manager = page.getByRole('dialog', { name: 'Agents', exact: true });
  assert.equal(await manager.getByLabel('Agent message', { exact: true }).count(), 0);
  assert.equal(await manager.getByRole('button', { name: 'Run task', exact: true }).count(), 0);
  await manager.getByRole('button', { name: 'Chat', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('dialog.pc-agent-console')?.open);
  assert.match(await page.getByLabel('Chat target').inputValue(), /^agent:/);
  await send(page, 'My first main-chat task');
  const calls = await page.evaluate(() => window.calls.filter((call) => call.type === 'execute'));
  assert.equal(calls.length, 1); assert.match(calls[0].messages[0].content, /Ada private memory/);
});

test('agent A, agent B and direct chat retain separate context; Clear conversation cannot erase agent memory', async (t) => {
  const page = await fixture(t, { ready: true });
  await page.getByLabel('Chat target').selectOption('local:chat'); await send(page, 'Direct secret');
  await agent(page, 'Ada'); await send(page, 'Alpha secret');
  await agent(page, 'Beta'); await send(page, 'Beta secret');
  const beta = await page.evaluate(() => calls.filter((call) => call.type === 'execute').at(-1));
  assert.match(beta.messages[0].content, /Beta private memory/);
  assert.doesNotMatch(JSON.stringify(beta.messages), /Alpha secret|Direct secret|Ada private memory/);
  await agent(page, 'Ada'); await transcript(page).getByText('Reply to Alpha secret', { exact: true }).waitFor();
  assert.doesNotMatch(await transcript(page).textContent(), /Beta secret|Direct secret/);
  const selectedAgent = await page.getByLabel('Chat target').inputValue();
  await button(page, 'Models').click();
  const models = page.getByRole('dialog', { name: 'Models', exact: true });
  await models.getByRole('tab', { name: 'Stored models', exact: true }).click();
  await models.getByRole('tab', { name: 'Browse models', exact: true }).click();
  await models.getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await page.getByLabel('Chat target').inputValue(), selectedAgent);
  assert.match(await transcript(page).textContent(), /Alpha secret/);
  assert.doesNotMatch(await transcript(page).textContent(), /Beta secret|Direct secret/);
  await menu(page, 'Config');
  assert(await button(page, 'Clear conversation').isDisabled());
  assert.match(await button(page, 'Clear conversation').getAttribute('title'), /agent|persist|memory/i);
  await page.keyboard.press('Escape');
  await page.getByLabel('Chat target').selectOption('local:chat'); await send(page, 'Direct follow-up');
  const direct = await page.evaluate(() => calls.filter((call) => call.type === 'execute').at(-1));
  assert.match(JSON.stringify(direct.messages), /Direct secret/);
  assert.doesNotMatch(JSON.stringify(direct.messages), /Alpha secret|Beta secret|private memory/);
});

test('local-only Talk routes ASR, persisted agent task and TTS locally with one acknowledged reply', async (t) => {
  const page = await fixture(t, { ready: true }); const id = await agent(page);
  await page.getByLabel('Speak replies', { exact: true }).check();
  await page.evaluate(() => { calls.length = 0; });
  await button(page, 'Talk').click(); await page.waitForFunction(() => captureActive);
  await button(page, 'Stop recording').click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'play'));
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  const calls = await page.evaluate(() => window.calls);
  assert.deepEqual(calls.filter((call) => call.type === 'execute').map((call) => call.task),
    ['automatic-speech-recognition', 'text-generation', 'text-to-speech']);
  assert(calls.filter((call) => call.type === 'execute').every((call) => call.local));
  assert.equal(calls.filter((call) => call.type === 'discovery').length, 0);
  const events = await page.evaluate((id) => nativeController.events(id, { limit: 100 }), id);
  assert.equal(events.filter((event) => event.type === 'request').length, 1);
  assert.equal(events.filter((event) => event.type === 'result').length, 1);
  assert.equal(await transcript(page).getByText('Reply to Recognized private message', { exact: true }).count(), 1);
});

test('local-only agent cannot send microphone audio to peer-only speech even when Mixed was previously selected', async (t) => {
  const page = await fixture(t, { ready: true, peerSpeechOnly: true }); await agent(page);
  await page.evaluate(() => { calls.length = 0; });
  await button(page, 'Talk').click(); await page.waitForFunction(() => captureActive);
  await button(page, 'Stop recording').click();
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  const calls = await page.evaluate(() => window.calls);
  assert.equal(calls.filter((call) => call.type === 'execute').length, 0);
  assert.equal(calls.filter((call) => call.type === 'discovery').length, 0);
  assert.match(await page.locator('.pc-inference-panel > .pc-inference-status').textContent(), /speech|compatible|local/i);
  assert.equal(await page.evaluate(() => captureActive), false);
});

test('network-assisted voice preserves actual remote provider receipts and never changes agent identity', async (t) => {
  const page = await fixture(t, { ready: true, networkAssisted: true, remoteOnly: true }); const id = await agent(page);
  await page.getByLabel('Speak replies', { exact: true }).check();
  await button(page, 'Talk').click(); await page.waitForFunction(() => captureActive);
  await button(page, 'Stop recording').click(); await page.waitForFunction(() => calls.some((call) => call.type === 'play'));
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  const executions = await page.evaluate(() => calls.filter((call) => call.type === 'execute'));
  assert.equal(executions.length, 3); assert(executions.every((call) => !call.local));
  assert.equal(await page.getByLabel('Chat target').inputValue(), `agent:${id}`);
  const result = await page.evaluate(async (id) => (await nativeController.events(id, { limit: 100 })).find((event) => event.type === 'result'), id);
  assert.equal(result.route.peerId, 'owned-fixture-peer'); assert.equal(result.route.manifestCid, 'chat');
});

test('a newly local-only policy prevents remote TTS after an already completed peer reply', async (t) => {
  const page = await fixture(t, { ready: true, networkAssisted: true, remoteOnly: true }); const id = await agent(page);
  await page.evaluate(() => {
    const run = nativeController.run.bind(nativeController);
    nativeController.run = async (id, options) => {
      const outcome = await run(id, options);
      // A settings change after acknowledged reasoning but before UI playback.
      await nativeController.update(id, { inferenceMode: 'local-only' });
      return outcome;
    };
  });
  await page.getByLabel('Speak replies', { exact: true }).check();
  await button(page, 'Talk').click(); await page.waitForFunction(() => captureActive);
  await button(page, 'Stop recording').click();
  await transcript(page).getByText('Reply to Recognized private message', { exact: true }).waitFor();
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  const calls = await page.evaluate(() => window.calls);
  assert.deepEqual(calls.filter((call) => call.type === 'execute').map((call) => call.task),
    ['automatic-speech-recognition', 'text-generation']);
  assert.equal(calls.filter((call) => call.type === 'play').length, 0);
  assert.equal(await page.evaluate(async (id) => (await nativeController.get(id)).policy.inferenceMode, id), 'local-only');
});

test('a failed result checkpoint disables further chat and speech until explicit save reconciliation', async (t) => {
  const page = await fixture(t, { ready: true }); const id = await agent(page);
  await page.evaluate(() => {
    const commit = nativeStore.commit.bind(nativeStore); control.rejectResult = true;
    nativeStore.commit = (id, change, options) => control.rejectResult && change.event?.type === 'result'
      ? Promise.reject(new DOMException('Fixture storage refused result', 'QuotaExceededError')) : commit(id, change, options);
  });
  await page.getByLabel('Speak replies', { exact: true }).check();
  await page.getByLabel('Message', { exact: true }).fill('A response requiring persistence'); await button(page, 'Send').click();
  await page.waitForFunction(async (id) => (await nativeController.get(id)).activity?.unsaved === true, id);
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  assert(await button(page, 'Talk').isDisabled()); assert(await button(page, 'Send').isDisabled());
  assert.equal(await page.evaluate(() => calls.filter((call) => call.task === 'text-to-speech').length), 0);
  await page.evaluate(() => { control.rejectResult = false; });
  await button(page, 'Resume agent').click();
  await page.waitForFunction(async (id) => !(await nativeController.get(id)).activity?.unsaved, id);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'execute').length), 1);
  assert.equal(await page.evaluate(async (id) => (await nativeController.events(id, { limit: 100 })).filter((event) => event.type === 'result').length, id), 1);
});

test('cancel holds the selected identity until actual agent cleanup settles and never writes a completed reply', async (t) => {
  const page = await fixture(t, { ready: true }); const id = await agent(page);
  await page.evaluate(() => { control.hold = 'text-generation'; control.cleanup = true; });
  await page.getByLabel('Message', { exact: true }).fill('Cancel this task'); await button(page, 'Send').click();
  await page.waitForFunction(() => calls.some((call) => call.type === 'held'));
  await button(page, 'Stop').click(); await page.waitForFunction(() => typeof releaseCleanup === 'function');
  assert(await page.getByLabel('Chat target').isDisabled()); assert(await button(page, 'Talk').isDisabled());
  await page.evaluate(() => releaseCleanup());
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  const events = await page.evaluate((id) => nativeController.events(id, { limit: 100 }), id);
  assert.equal(events.filter((event) => event.type === 'result').length, 0);
  assert.equal(events.filter((event) => event.type === 'cancelled').length, 1);
  await page.evaluate(() => { control.hold = null; });
  await agent(page, 'Beta'); await send(page, 'After cancellation');
  const latest = await page.evaluate(() => calls.filter((call) => call.type === 'execute').at(-1));
  assert.doesNotMatch(JSON.stringify(latest.messages), /Cancel this task|Ada private memory/);
});

test('reload restores native identity, generated pixels and console history but excludes world visitor events', async (t) => {
  const page = await fixture(t, { ready: true }); const id = await agent(page);
  await send(page, 'Durable console memory');
  await page.getByLabel('Generate image', { exact: true }).check();
  await page.getByLabel('Message', { exact: true }).fill('A red square'); await button(page, 'Send').click();
  await transcript(page).locator('img').waitFor();
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  await page.evaluate(async (id) => { await nativeController.run(id, { prompt: 'Private world visitor', conversationId: 'world:visitor' }); }, id);
  await page.evaluate(async () => { await panel.dispose(); });
  await page.reload(); await mount(page, { ready: true }); await agent(page);
  await transcript(page).getByText('Reply to Durable console memory', { exact: true }).waitFor();
  await transcript(page).locator('img').waitFor();
  assert.equal(await page.evaluate(() => ids.Ada), id);
  assert.doesNotMatch(await transcript(page).textContent(), /Private world visitor/);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'execute').length), 0);
  const pixel = await transcript(page).locator('img').evaluate(async (image) => {
    await image.decode(); const canvas = document.createElement('canvas'); canvas.width = canvas.height = 2;
    const context = canvas.getContext('2d'); context.drawImage(image, 0, 0); return [...context.getImageData(0, 0, 1, 1).data];
  });
  assert.deepEqual(pixel, [255, 0, 0, 255]); assert.equal(page.workers().length, 0);
});

test('late saved-image reads cannot contaminate a newly selected identity', async (t) => {
  const page = await fixture(t, { ready: true });
  await page.evaluate(async () => {
    await nativeController.run(ids.Ada, { task: 'text-to-image', prompt: 'A hidden old image' });
    const original = nativeController.getAttachment.bind(nativeController);
    nativeController.getAttachment = async (...args) => {
      if (args[0] === ids.Ada) { calls.push({ type: 'held-attachment' }); await new Promise((resolve) => { window.releaseAttachment = resolve; }); }
      return original(...args);
    };
  });
  await agent(page); await page.waitForFunction(() => typeof releaseAttachment === 'function');
  await agent(page, 'Beta'); await page.evaluate(() => releaseAttachment());
  await send(page, 'New identity message');
  assert.equal(await transcript(page).locator('img').count(), 0);
  assert.doesNotMatch(await transcript(page).textContent(), /hidden old image/);
  assert.equal(await page.getByLabel('Chat target').inputValue(), `agent:${await page.evaluate(() => ids.Beta)}`);
});

test('a completed agent turn retains UI ownership through its final saved-history refresh', async (t) => {
  const page = await fixture(t, { ready: true }); const id = await agent(page);
  await page.evaluate(() => {
    control.holdFinalList = true;
    const list = nativeController.list.bind(nativeController); let barrier;
    nativeController.list = async (...args) => {
      const records = await list(...args);
      if (control.holdFinalList && records.some((head) => head.status === 'completed')) {
        barrier ??= new Promise((resolve) => { window.releaseFinalList = () => { control.holdFinalList = false; resolve(); }; });
        calls.push({ type: 'held-final-list' }); await barrier;
      }
      return records;
    };
  });
  await page.getByLabel('Message', { exact: true }).fill('First saved turn'); await button(page, 'Send').click();
  await page.waitForFunction(() => typeof releaseFinalList === 'function');
  assert.equal(await page.evaluate(async (id) => (await nativeController.get(id)).status, id), 'completed');
  await page.getByLabel('Message', { exact: true }).fill('Must wait for finalization');
  // Exercise the same render path as the periodic peer refresh while the turn's
  // final controller.list is still pending. It must not release the composer.
  await page.evaluate(() => panel.refreshPeers());
  assert(await button(page, 'Send').isDisabled());
  assert(await page.getByLabel('Chat target').isDisabled());
  assert(await button(page, 'Talk').isDisabled());
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'execute').length), 1);
  await page.evaluate(() => releaseFinalList());
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  await agent(page, 'Beta'); await send(page, 'Second identity turn');
  assert.doesNotMatch(await transcript(page).textContent(), /First saved turn/);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'execute').length), 2);
});

test('disposing during a stalled initial agent list aborts the bridge read before awaiting initialization', async (t) => {
  const page = await fixture(t, { ready: true, holdInitialList: true });
  await page.waitForFunction(() => typeof releaseInitialList === 'function');
  const completed = await page.evaluate(async () => {
    let timer;
    try {
      return await Promise.race([panel.dispose().then(() => true),
        new Promise((resolve) => { timer = setTimeout(() => resolve(false), 1500); })]);
    } finally { clearTimeout(timer); }
  });
  assert.equal(completed, true, 'Panel disposal must not wait for an unabortable initial controller.list');
  assert.equal(await page.locator('.pc-inference-panel').count(), 0);
  await page.evaluate(() => releaseInitialList());
  await page.waitForFunction(() => calls.some((call) => call.type === 'late-initial-list'));
  assert.equal(await page.locator('.pc-inference-panel').count(), 0);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'disposed').length), 1);
  assert.equal(await page.evaluate(() => calls.filter((call) => call.type === 'execute').length), 0);
});

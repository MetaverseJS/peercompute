import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Real native UI + reusable VoiceSession; controlled audio and inference only.
// No microphone device, model download, GPU work or user profile is accessed.
let server, browser, origin, cache;
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'peercompute-console-voice-'));
  server = await createServer({ configFile: false, root: fileURLToPath(new URL('../../', import.meta.url)), cacheDir: cache,
    logLevel: 'error', optimizeDeps: { entries: ['demos/inference/src/agentPanel.js'] }, server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'console-voice-fixture', configureServer(vite) { vite.middlewares.use('/__console_voice', (_req, res) => {
      res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><meta name="viewport" content="width=device-width"><link rel="icon" href="data:,"><style>body{margin:0}</style><main class="pc-inference-standalone" id="app"></main>');
    }); } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); });

async function fixture(t, { width = 390, height = 844 } = {}) {
  const context = await browser.newContext({ viewport: { width, height } }), page = await context.newPage();
  const errors = [], external = []; page.setDefaultTimeout(5000);
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(new URL(route.request().url()).origin); return route.abort();
  });
  t.after(async () => {
    await page.evaluate(async () => { window.releaseCleanup?.(); await panel?.dispose(); }).catch(() => {});
    await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin + '/__console_voice');
  await page.evaluate(async () => {
    const { mountInferencePanel } = await import('/demos/inference/src/agentPanel.js');
    window.calls = []; window.control = {}; window.captureActive = false;
    const descriptors = [
      ['chat', 'Fixture reasoning', 'image-text-to-text', ['text', 'image'], ['text']],
      ['asr', 'Fixture recognition', 'automatic-speech-recognition', ['audio'], ['text']],
      ['tts', 'Fixture speech', 'text-to-speech', ['text'], ['audio']],
      ['image', 'Fixture image', 'text-to-image', ['text'], ['image']],
    ].map(([cid, name, task, modalities, outputModalities]) => ({ key: `local:${cid}`, manifestCid: cid, name, task, modalities, outputModalities, local: true, available: true }));
    async function hold(phase, signal) {
      if (control.hold !== phase) return;
      calls.push({ type: 'held', phase });
      await new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
      if (control.cleanup) await new Promise((resolve) => { window.releaseCleanup = resolve; });
      signal.throwIfAborted();
    }
    window.runtime = {
      networkReady: true, store: {}, getPreferences: () => ({ sharing: true, hostInference: true }),
      listModelSources: () => descriptors.map((entry) => ({ ...entry, key: `hf:${entry.manifestCid}`, source: 'hf', modelId: entry.manifestCid,
        runtime: entry.task.includes('speech') ? 'transformers-speech' : 'transformers.js', localAvailability: { status: 'unknown' } })),
      listInferenceTargets: () => [...descriptors, { ...descriptors[0], local: false, key: 'peer:chat', manifestCid: 'chat', name: 'Peer reasoning' }],
      async acquireModel(key) { calls.push({ type: 'load', key }); },
      async refreshPeers() {}, async setSharing() {}, async setHostInference() {}, async unload(cid) { calls.push({ type: 'unload', cid }); },
      async listStoredModels() { return []; },
      async generate(target, input) {
        const task = input.task;
        calls.push({ type: 'execute', target, task, requestId: input.requestId, prompt: input.prompt, audio: input.audio?.samples?.length });
        await hold(task, input.signal); input.signal.throwIfAborted();
        if (control.missing === task) throw new Error('No compatible model is loaded for ' + task);
        const descriptor = descriptors.find((entry) => entry.task === task || (task === 'text-generation' && entry.manifestCid === 'chat'));
        const route = { local: !target.startsWith('peer:'), target: descriptor.key, manifestCid: descriptor.manifestCid,
          modelName: descriptor.name, task };
        input.onProgress?.({ type: 'routing', route });
        if (task === 'automatic-speech-recognition') return { text: 'Recognized voice message', route };
        if (task === 'text-to-speech') return { audio: new Float32Array(100), sampleRate: 16000, route };
        if (task === 'text-to-image') return { text: '', image: { width: 2, height: 2, channels: 4, data: new Uint8Array(16) }, route };
        return { text: 'Controlled reasoning reply.', finishReason: 'stop', route };
      },
      async cancel(requestId) { calls.push({ type: 'cancel-request', requestId }); }, async dispose() { calls.push({ type: 'dispose-runtime' }); },
    };
    window.panel = await mountInferencePanel({ container: document.querySelector('#app'), runtimeFactory: async () => runtime,
      audioFactory: async () => {
        calls.push({ type: 'create-audio' });
        return {
          async startRecording({ signal }) { calls.push({ type: 'capture-start' }); await hold('permission', signal);
            if (control.denied) throw new DOMException('Microphone permission denied', 'NotAllowedError'); captureActive = true; },
          async stopRecording() { calls.push({ type: 'capture-stop' }); captureActive = false; return { samples: new Float32Array(1600), sampleRate: 16000 }; },
          async cancelRecording() { calls.push({ type: 'capture-cancel' }); captureActive = false; },
          async play(pcm, { signal }) { calls.push({ type: 'play', samples: pcm.audio.length }); await hold('playing', signal); },
          async stopPlayback() { calls.push({ type: 'play-stop' }); }, async dispose() { calls.push({ type: 'dispose-audio' }); },
        };
      } });
  });
  return page;
}

test('console defaults Mixed with explicit image and speech opt-ins and no microphone or loads', async (t) => {
  const page = await fixture(t);
  assert.equal(await page.getByLabel('Chat target').inputValue(), 'mixed');
  assert.equal(await page.getByLabel('Generate image', { exact: true }).isChecked(), false);
  assert.equal(await page.getByLabel('Speak replies', { exact: true }).isChecked(), false);
  assert.deepEqual(await page.evaluate(() => calls), []);
  for (const size of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(size);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const box = await page.getByRole('button', { name: 'Talk', exact: true }).boundingBox();
    assert(box.x >= 0 && box.x + box.width <= size.width && box.y + box.height <= size.height);
  }
});

test('native Talk/Stop invokes real VoiceSession ASR, routed reasoning and optional TTS without loading models', async (t) => {
  const page = await fixture(t);
  await page.getByLabel('Speak replies', { exact: true }).check();
  await page.getByRole('button', { name: 'Talk', exact: true }).click();
  await page.waitForFunction(() => captureActive);
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Models', exact: true }).isDisabled(), true);
  await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
  await page.waitForFunction(() => calls.some((entry) => entry.type === 'play'));
  await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  const executions = await page.evaluate(() => calls.filter((entry) => entry.type === 'execute'));
  assert.deepEqual(executions.map((entry) => entry.task), ['automatic-speech-recognition', 'text-generation', 'text-to-speech']);
  assert(executions.every((entry) => entry.target === 'mixed')); assert.equal(new Set(executions.map((entry) => entry.requestId)).size, 3);
  assert.match(await page.getByRole('log').textContent(), /Recognized voice message/);
  assert.match(await page.locator('.pc-chat-message-assistant .pc-chat-speaker').textContent(), /Local · Fixture reasoning/);
  assert.equal(await page.evaluate(() => captureActive), false);
  assert.equal(await page.evaluate(() => calls.some((entry) => entry.type === 'load')), false);
  if (process.env.CONSOLE_UI_EVIDENCE) {
    await mkdir(process.env.CONSOLE_UI_EVIDENCE, { recursive: true });
    for (const size of [{ width: 1440, height: 1000, name: 'desktop' }, { width: 390, height: 844, name: 'mobile' }]) {
      await page.setViewportSize(size);
      await page.screenshot({ path: join(process.env.CONSOLE_UI_EVIDENCE, `controlled-voice-${size.name}.png`) });
    }
  }
});

test('explicit local reasoning selection keeps ASR and TTS local and preserves the reasoning target', async (t) => {
  const page = await fixture(t);
  await page.getByLabel('Chat target').selectOption('local:chat');
  await page.getByLabel('Speak replies', { exact: true }).check();
  await page.getByRole('button', { name: 'Talk', exact: true }).click(); await page.waitForFunction(() => captureActive);
  await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
  await page.waitForFunction(() => calls.some((entry) => entry.type === 'play'));
  assert.deepEqual(await page.evaluate(() => calls.filter((entry) => entry.type === 'execute').map((entry) => entry.target)), ['local-only', 'local:chat', 'local-only']);
});

test('cancel during transcription retains operation ownership until cleanup and never submits a late reply', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => { control.hold = 'automatic-speech-recognition'; control.cleanup = true; });
  await page.getByRole('button', { name: 'Talk', exact: true }).click(); await page.waitForFunction(() => captureActive);
  await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
  await page.waitForFunction(() => calls.some((entry) => entry.type === 'held'));
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.waitForFunction(() => typeof releaseCleanup === 'function');
  assert.equal(await page.getByRole('button', { name: 'Talk', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Models', exact: true }).isDisabled(), true);
  await page.evaluate(() => releaseCleanup());
  await page.getByText(/Cancelled: User cancelled/).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Talk', exact: true }).isEnabled(), true);
  assert.equal(await page.evaluate(() => calls.filter((entry) => entry.type === 'execute').length), 1);
  assert.equal(await page.getByRole('log').locator('.pc-chat-message').count(), 0);
});

test('permission rejection and missing speech remain actionable without silently downloading', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => { control.denied = true; });
  await page.getByRole('button', { name: 'Talk', exact: true }).click();
  await page.getByText(/Microphone permission denied/).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Talk', exact: true }).isEnabled(), true);
  await page.evaluate(() => { control.denied = false; control.missing = 'automatic-speech-recognition'; });
  await page.getByRole('button', { name: 'Talk', exact: true }).click();
  await page.waitForFunction(() => captureActive);
  await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
  await page.getByText(/Load a speech-recognition model in Models/).waitFor();
  assert.equal(await page.evaluate(() => calls.some((entry) => entry.type === 'execute' && entry.task === 'text-generation')), false);
  await page.evaluate(() => { control.denied = false; control.missing = 'text-to-speech'; });
  await page.getByLabel('Speak replies', { exact: true }).check();
  await page.getByLabel('Message', { exact: true }).fill('Keep the text response');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.getByText(/Text reply received.*Load a speech-synthesis model/).waitFor();
  assert.match(await page.getByRole('log').textContent(), /Controlled reasoning reply/);
  assert.equal(await page.evaluate(() => calls.some((entry) => entry.type === 'load')), false);
});

test('a spoken image prompt uses explicit image generation and never synthesizes the image as speech', async (t) => {
  const page = await fixture(t);
  await page.getByLabel('Generate image', { exact: true }).check();
  await page.getByLabel('Speak replies', { exact: true }).check();
  await page.getByLabel('Message', { exact: true }).fill('Retained unsent draft');
  await page.getByRole('button', { name: 'Talk', exact: true }).click();
  await page.waitForFunction(() => captureActive);
  await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
  await page.getByRole('log').locator('img').waitFor();
  assert.deepEqual(await page.evaluate(() => calls.filter((entry) => entry.type === 'execute').map((entry) => entry.task)),
    ['automatic-speech-recognition', 'text-to-image']);
  assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), 'Retained unsent draft');
  assert.match(await page.locator('.pc-chat-message-assistant .pc-chat-speaker').textContent(), /Local · Fixture image/);
  assert.equal(await page.evaluate(() => calls.some((entry) => entry.type === 'play' || entry.type === 'load')), false);
});

test('dispose cancels pending microphone permission and waits before releasing the shared runtime', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => { control.hold = 'permission'; control.cleanup = true; });
  await page.getByRole('button', { name: 'Talk', exact: true }).click();
  await page.waitForFunction(() => calls.some((entry) => entry.type === 'held'));
  await page.evaluate(() => { window.disposing = panel.dispose(); });
  await page.waitForFunction(() => typeof releaseCleanup === 'function');
  assert.equal(await page.evaluate(() => calls.some((entry) => entry.type === 'dispose-runtime')), false);
  await page.evaluate(async () => { releaseCleanup(); await disposing; });
  assert.equal(await page.evaluate(() => captureActive), false);
  assert.equal(await page.evaluate(() => calls.some((entry) => entry.type === 'dispose-audio')), true);
  assert.equal(await page.evaluate(() => calls.some((entry) => entry.type === 'dispose-runtime')), true);
});

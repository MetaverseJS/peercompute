import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Real panel, VoiceSession, AudioContext and capture worklet. Only media input
// and model execution are synthetic; no microphone, weights or user profile.
let server, origin, cache;
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'peercompute-mobile-audio-'));
  server = await createServer({ configFile: false, root: fileURLToPath(new URL('../../', import.meta.url)), cacheDir: cache,
    logLevel: 'error', optimizeDeps: { entries: ['demos/inference/src/agentPanel.js'] },
    server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'mobile-audio-fixture', configureServer(vite) { vite.middlewares.use('/__mobile_audio', (_req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.end('<!doctype html><meta name="viewport" content="width=device-width"><link rel="icon" href="data:,"><main class="pc-inference-standalone" id="app"></main>');
    }); } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
});
after(async () => { await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function mountFixture() {
  const { mountInferencePanel } = await import('/demos/inference/src/agentPanel.js');
  const { createWorldAudio } = await import('/demos/shared/agents/speech/WorldAudio.js');
  window.calls = []; window.streams = []; window.recordings = 0; window.resumes = 0; window.deferGrant = false;
  class Context extends AudioContext {
    constructor(...args) { super(...args); window.audioContext = this; }
    resume() { resumes++; return super.resume(); }
  }
  const descriptors = [
    ['chat', 'Fixture reasoning', 'text-generation', ['text'], ['text']],
    ['asr', 'Fixture recognition', 'automatic-speech-recognition', ['audio'], ['text']],
  ].map(([cid, name, task, modalities, outputModalities]) => ({ key: `local:${cid}`, manifestCid: cid,
    name, task, modalities, outputModalities, local: true, available: true }));
  const runtime = {
    networkReady: true, store: {}, getPreferences: () => ({ sharing: true, hostInference: true }),
    listModelSources: () => descriptors.map((entry) => ({ ...entry, key: `hf:${entry.manifestCid}`, source: 'hf',
      modelId: entry.manifestCid, runtime: 'transformers.js', localAvailability: { status: 'unknown' } })),
    listInferenceTargets: () => descriptors, async listStoredModels() { return []; },
    async refreshPeers() {}, async setSharing() {}, async setHostInference() {}, async dispose() {},
    async generate(target, input) {
      input.signal.throwIfAborted();
      calls.push({ task: input.task, target, samples: input.audio?.samples?.length, sampleRate: input.audio?.sampleRate });
      const descriptor = descriptors.find((entry) => entry.task === input.task);
      const route = { local: true, target: descriptor.key, manifestCid: descriptor.manifestCid,
        modelName: descriptor.name, task: input.task };
      return { text: input.task === 'automatic-speech-recognition' ? 'Recognized touch message' : 'Touch reply.', finishReason: 'stop', route };
    },
    async cancel() {},
  };
  window.panel = await mountInferencePanel({ container: document.querySelector('#app'), runtimeFactory: async () => runtime,
    audioFactory: async () => {
      const audio = createWorldAudio({ AudioContextImpl: Context, mediaDevices: {
        async getUserMedia() {
          const stream = audioContext.createMediaStreamDestination().stream; streams.push(stream);
          if (deferGrant) {
            deferGrant = false;
            await new Promise((resolve) => { window.grant = () => { window.grant = null; resolve(); }; });
          }
          return stream;
        },
      } });
      const start = audio.startRecording;
      audio.startRecording = async (options) => { await start(options); recordings++; };
      return audio;
    } });
}

for (const policy of ['default', 'document-user-activation-required']) {
  test(`touch-first audio recovers and cleans late permission with ${policy} autoplay`, { timeout: 45000 }, async (t) => {
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
      args: ['--disable-gpu', ...(policy === 'default' ? [] : [`--autoplay-policy=${policy}`])] });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage(), cdp = await context.newCDPSession(page), errors = [], external = [];
    // Playwright evaluate/locator helpers can grant userGesture:true. Every
    // script evaluation here explicitly avoids inventing user activation.
    const evaluate = async (expression) => {
      const result = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: false });
      assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const until = async (expression) => {
      const deadline = Date.now() + 5000;
      while (!await evaluate(expression)) {
        assert(Date.now() < deadline, `Timed out: ${expression}`); await sleep(20);
      }
    };
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      external.push(route.request().url()); return route.abort();
    });
    t.after(async () => {
      let cleanupTimer;
      try { await Promise.race([
        evaluate('(async () => { window.grant?.(); await window.panel?.dispose(); })()'),
        new Promise((_, reject) => { cleanupTimer = setTimeout(() => reject(new Error('Panel audio cleanup did not settle')), 2000); }),
      ]); }
      finally { clearTimeout(cleanupTimer); await context.close(); await browser.close(); }
      assert.deepEqual(errors, []); assert.deepEqual(external, []);
    });
    await page.goto(origin + '/__mobile_audio');
    await evaluate(`(${mountFixture.toString()})()`);
    assert.equal(await evaluate('navigator.userActivation.hasBeenActive'), false);
    const press = async () => {
      const point = await evaluate(`(() => { const b = document.querySelector('[aria-label="Talk"]').getBoundingClientRect();
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; })()`);
      assert(point.x > 0 && point.x < 390 && point.y > 0 && point.y < 844, 'Talk is visible in the mobile viewport');
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
    };
    const release = () => cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    const recovered = '!document.querySelector(\'[aria-label="Talk"]\').disabled';

    await press();
    await until('window.resumes > 0 && audioContext.state === "suspended"');
    assert.equal(await evaluate('navigator.userActivation.hasBeenActive'), false);
    assert.equal(await evaluate('streams.length'), 0, 'Touch down must not bypass the audio activation gate');
    await release();
    await until(`${recovered} && audioContext.state === "running"`);
    assert.deepEqual(await evaluate('[recordings, streams.length, calls.length]'), [0, 0, 0], 'Released startup cannot become a late recording');

    await press(); await until('recordings === 1');
    await sleep(100); // Allow the real capture worklet to produce PCM.
    assert.equal(await evaluate('calls.length'), 0, 'Holding must not send a request');
    await release(); await until(`${recovered} && calls.length === 2`);
    const calls = await evaluate('calls');
    assert.deepEqual(calls.map((call) => call.task), ['automatic-speech-recognition', 'text-generation']);
    assert(calls[0].samples > 0); assert.equal(calls[0].sampleRate, 16000);
    assert(calls.every((call) => call.target === 'mixed'));
    assert.match(await evaluate('document.querySelector(\'[role="log"]\').textContent'), /Touch reply\./);
    assert.equal(await evaluate('streams.every(s => s.getTracks().every(t => t.readyState === "ended"))'), true);

    await evaluate('window.deferGrant = true');
    await press(); await until('typeof window.grant === "function"');
    await release(); await until(recovered);
    assert.deepEqual(await evaluate('[recordings, calls.length]'), [1, 2]);
    await evaluate('window.grant()');
    await until('streams.every(s => s.getTracks().every(t => t.readyState === "ended"))');
    assert.deepEqual(await evaluate('[recordings, calls.length]'), [1, 2], 'Late permission must neither capture nor submit');
  });
}

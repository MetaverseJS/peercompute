import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Real host, native UI and private AgentRuntime journal; controlled speech/audio
// and model replies. These tests qualify state/cancellation, not speech quality.
let server, browser, origin, cache;
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'world-voice-controls-'));
  server = await createServer({ configFile: false, root: fileURLToPath(new URL('../../', import.meta.url)),
    cacheDir: cache, logLevel: 'error', optimizeDeps: { noDiscovery: true, include: ['netmask'] },
    server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'controlled-world-voice', configureServer(vite) {
      vite.middlewares.use('/__voice_controls', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><title>Controlled world voice</title><link rel="icon" href="data:,">');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => {
  await browser?.close(); await server?.close();
  if (cache) await rm(cache, { recursive: true, force: true });
});
async function fixture(t) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 950 } });
  const page = await context.newPage(), errors = [], external = [];
  page.setDefaultTimeout(5000);
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  t.after(async () => {
    try { await page.evaluate(async () => { window.releaseCleanup?.(); await window.host?.dispose(); }); }
    finally { await context.close(); }
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin + '/__voice_controls');
  await page.evaluate(async () => {
    const { installWorldAgents } = await import('/demos/shared/agents/WorldAgentHost.js');
    const { createWorldAgentUi } = await import('/demos/shared/agents/worldAgentUi.js');
    const { AgentRuntime } = await import('/peercompute/src/peercompute/agents/AgentRuntime.js');
    const { AgentRecordStore } = await import('/peercompute/src/peercompute/agents/AgentRecordStore.js');
    window.calls = []; window.speechReady = false; window.captureActive = false;
    const hold = async (phase, signal) => {
      if (window.holdPhase !== phase) return;
      window.phaseSignal = signal; calls.push({ type: `${phase}-held` });
      await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
      calls.push({ type: `${phase}-aborted` });
      if (window.holdCleanup) await new Promise(resolve => { window.releaseCleanup = resolve; });
      signal.throwIfAborted();
    };
    const store = new AgentRecordStore({ name: 'world-voice-controls' }); await store.open();
    const candidate = { key: 'local', local: true, available: true, manifestCid: 'fixture', sessionId: 'fixture',
      runtime: 'transformers.js', task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
    const agents = new AgentRuntime({ store, inference: {
      listCandidates: async () => [candidate],
      generate: async (_candidate, input, { signal }) => {
        calls.push({ type: 'generate', prompt: input.prompt }); await hold('reply', signal);
        return { text: 'Controlled response.', finishReason: 'stop' };
      }, cancel: async () => {},
    } });
    window.host = installWorldAgents({ worldId: 'cubechat:voice-controls', worldLabel: 'CubeChat',
      uiFactory: callbacks => { window.hostCallbacks = callbacks; return createWorldAgentUi(callbacks); },
      adapter: { upsert() {}, remove() {}, normalizePosition: value => [...value], getSpawnPosition: () => [1, 3, 5],
        getContext: () => ({}), focus() {}, getAudioPose: () => ({}), dispose() {} },
      runtimeFactory: async () => ({ networkReady: true, networkManager: { peerId: 'fixture-owner' },
        getAgentController: async () => agents, dispose: async () => { await agents.dispose(); await store.destroy(); } }),
      serviceFactory: () => ({ start: async () => {}, close: async () => {} }),
      speechFactory: async () => ({
        getStatus: () => ({ status: speechReady ? 'ready' : 'idle' }),
        prepare: async () => { speechReady = true; calls.push({ type: 'prepare' }); },
        transcribe: async (_input, { signal }) => {
          calls.push({ type: 'transcribe' }); await hold('asr', signal);
          if (!speechReady) throw new Error('Enable and prepare voice models first');
          return { text: 'Controlled voice prompt' };
        },
        synthesize: async text => { calls.push({ type: 'synthesize', text }); return { audio: new Float32Array(100), sampleRate: 16000 }; },
        dispose: async () => { speechReady = false; },
      }),
      audioFactory: async () => ({ unlock: async () => {},
        startRecording: async ({ signal }) => {
          calls.push({ type: 'start-record' });
          if (window.denyMicrophone) throw new DOMException('Microphone permission denied', 'NotAllowedError');
          await hold('record', signal); captureActive = true;
        },
        stopRecording: async () => { captureActive = false; calls.push({ type: 'stop-record' }); return { samples: new Float32Array(1600), sampleRate: 16000 }; },
        cancelRecording: async () => { captureActive = false; calls.push({ type: 'cancel-record' }); },
        stopPlayback() {}, play: async () => { calls.push({ type: 'play' }); }, dispose: async () => { captureActive = false; },
      }),
      panelFactory: async ({ container }) => {
        calls.push({ type: 'models-open', captureActive });
        const unload = document.createElement('button'); unload.textContent = 'Simulate auxiliary unload';
        unload.onclick = () => { speechReady = false; }; container.append(unload);
        return { dispose: async () => {} };
      },
    });
    await host.ready; await host.spawn({ name: 'Voice probe', localOnly: true, shared: false });
  });
  await page.getByLabel('Enable voice', { exact: true }).check();
  await page.waitForFunction(() => host.getStatus().voiceEnabled);
  return page;
}
const button = (page, name) => page.getByRole('button', { name, exact: true });
const prompt = page => page.getByLabel('Message to agent', { exact: true });
const status = page => page.locator('.pc-world-agent-status');

test('native Talk and Stop run ASR, one agent task and spoken playback through the real host', async t => {
  const page = await fixture(t);
  await button(page, 'Talk').click(); await page.waitForFunction(() => host.getStatus().recording);
  await button(page, 'Stop').click(); await page.waitForFunction(() => calls.some(call => call.type === 'play'));
  const calls = await page.evaluate(() => window.calls.map(call => call.type));
  assert.deepEqual(calls.filter(type => ['transcribe', 'generate', 'synthesize', 'play'].includes(type)), ['transcribe', 'generate', 'synthesize', 'play']);
  assert.match(await page.getByRole('log', { name: 'Agent conversation' }).textContent(), /Controlled response/);
  assert.equal(await prompt(page).isEnabled(), true);
});

test('recording excludes Send, Models and mutations; Cancel stops capture without starting an agent task', async t => {
  const page = await fixture(t);
  await prompt(page).fill('draft is preserved');
  await button(page, 'Talk').click(); await page.waitForFunction(() => host.getStatus().recording);
  for (const name of ['Send', 'Models', 'Place agent', 'Remove body']) {
    assert.equal(await page.getByRole('button', { name, exact: true, includeHidden: true }).isDisabled(), true, name);
  }
  assert.equal(await prompt(page).isDisabled(), true); assert.equal(await button(page, 'Cancel').isEnabled(), true);
  const rejection = await page.evaluate(() => host.send({ text: 'bypass disabled UI' }).catch(error => error.message));
  assert.match(rejection, /Stop or cancel the microphone/);
  const modelRejection = await page.evaluate(() => hostCallbacks.onModels().catch(error => error.message));
  assert.match(modelRejection, /Stop or cancel the microphone/);
  assert.equal(await page.evaluate(() => calls.some(call => call.type === 'models-open')), false);
  await button(page, 'Cancel').click(); await page.waitForFunction(() => !host.getStatus().recording);
  assert.equal(await page.evaluate(() => captureActive), false); assert.equal(await prompt(page).inputValue(), 'draft is preserved');
  assert.equal(await button(page, 'Models').isEnabled(), true);
  assert.equal(await page.evaluate(() => calls.some(call => call.type === 'generate')), false);
});

test('typed reply keeps its owner when a direct capture start is rejected, and Cancel aborts it', async t => {
  const page = await fixture(t); await page.evaluate(() => { holdPhase = 'reply'; });
  await prompt(page).fill('held typed request'); await button(page, 'Send').click();
  await page.waitForFunction(() => calls.some(call => call.type === 'reply-held'));
  assert.equal(await button(page, 'Talk').isDisabled(), true);
  const captureRejection = await page.evaluate(() => hostCallbacks.onRecord({ recording: true }).catch(error => error.message));
  assert.match(captureRejection, /current conversation/);
  assert.equal(await page.evaluate(() => calls.some(call => call.type === 'start-record')), false);
  const rejection = await page.evaluate(() => host.send({ text: 'second task' }).catch(error => error.message));
  assert.match(rejection, /current conversation/);
  await button(page, 'Cancel').click(); await page.waitForFunction(() => phaseSignal.aborted);
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'generate').length), 1);
  assert.equal(await page.evaluate(() => calls.some(call => call.type === 'synthesize')), false);
});

for (const phase of ['asr', 'reply']) test(`voice Stop retains cancellation ownership through ${phase} and waits for cleanup`, async t => {
  const page = await fixture(t); await page.evaluate(phase => { holdPhase = phase; holdCleanup = true; }, phase);
  await button(page, 'Talk').click(); await page.waitForFunction(() => host.getStatus().recording);
  await button(page, 'Stop').click(); await page.waitForFunction(phase => calls.some(call => call.type === `${phase}-held`), phase);
  assert.equal(await button(page, 'Talk').isDisabled(), true); assert.equal(await button(page, 'Models').isDisabled(), true);
  await button(page, 'Cancel').click(); await page.waitForFunction(() => !!window.releaseCleanup);
  assert.equal(await button(page, 'Cancelling…').isDisabled(), true); assert.equal(await prompt(page).isDisabled(), true);
  await page.evaluate(() => releaseCleanup()); await page.waitForFunction(() => !document.querySelector('.pc-world-agent-actions button:last-child').textContent.includes('Cancelling'));
  assert.equal(await page.evaluate(() => phaseSignal.aborted), true);
  assert.equal(await page.evaluate(() => calls.some(call => call.type === 'synthesize' || call.type === 'play')), false);
});

test('Stop during pending microphone permission keeps capture controls blocked until cancellation settles', async t => {
  const page = await fixture(t); await page.evaluate(() => { holdPhase = 'record'; holdCleanup = true; });
  await button(page, 'Talk').click(); await page.waitForFunction(() => calls.some(call => call.type === 'record-held'));
  await button(page, 'Stop').click(); await page.waitForFunction(() => !!window.releaseCleanup);
  assert.equal(await prompt(page).isDisabled(), true); assert.equal(await button(page, 'Models').isDisabled(), true);
  assert.equal(await button(page, 'Talk').isDisabled(), true);
  await page.evaluate(() => releaseCleanup()); await page.waitForFunction(() => !document.querySelector('[aria-label="Message to agent"]').disabled);
  assert.equal(await page.evaluate(() => captureActive), false); assert.match(await status(page).textContent(), /Recording cancelled/);
  assert.equal(await button(page, 'Talk').isEnabled(), true);
});

test('speech unloaded after enabling produces an explicit text-only warning and re-enable recovers', async t => {
  const page = await fixture(t); await page.evaluate(() => { speechReady = false; });
  await prompt(page).fill('Still provide this text reply'); await button(page, 'Send').click();
  await page.waitForFunction(() => document.querySelector('.pc-world-agent-status').textContent.includes('no longer loaded'));
  assert.match(await status(page).textContent(), /Text reply received.*Enable voice/);
  assert.equal(await page.getByLabel('Enable voice', { exact: true }).isChecked(), false);
  assert.equal(await page.evaluate(() => calls.some(call => call.type === 'synthesize')), false);
  await page.getByLabel('Enable voice', { exact: true }).check(); await page.waitForFunction(() => host.getStatus().voiceEnabled);
  await prompt(page).fill('Now speak'); await button(page, 'Send').click(); await page.waitForFunction(() => calls.some(call => call.type === 'play'));
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'prepare').length), 2);
});

test('closing Models resynchronizes unloaded speech, and stale Talk does not open the microphone', async t => {
  const page = await fixture(t);
  await button(page, 'Models').click(); await button(page, 'Simulate auxiliary unload').click(); await button(page, 'Back to world').click();
  assert.equal(await page.getByLabel('Enable voice', { exact: true }).isChecked(), false);
  assert.equal(await button(page, 'Talk').isDisabled(), true); assert.match(await status(page).textContent(), /Enable voice/);
  await page.getByLabel('Enable voice', { exact: true }).check(); await page.waitForFunction(() => host.getStatus().voiceEnabled);
  await page.evaluate(() => { speechReady = false; }); await button(page, 'Talk').click();
  await page.waitForFunction(() => !host.getStatus().voiceEnabled);
  assert.equal(await page.evaluate(() => calls.some(call => call.type === 'start-record')), false);
  assert.match(await status(page).textContent(), /Enable voice/);
});

test('microphone permission error is visible and restores usable text and retry controls', async t => {
  const page = await fixture(t); await page.evaluate(() => { denyMicrophone = true; });
  await button(page, 'Talk').click(); await page.waitForFunction(() => document.querySelector('.pc-world-agent-status').textContent.includes('permission denied'));
  assert.equal(await prompt(page).isEnabled(), true); assert.equal(await button(page, 'Talk').isEnabled(), true);
  assert.equal(await page.evaluate(() => captureActive), false);
  await page.evaluate(() => { denyMicrophone = false; }); await button(page, 'Talk').click();
  await page.waitForFunction(() => host.getStatus().recording); await button(page, 'Cancel').click();
});

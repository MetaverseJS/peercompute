import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

let browser, server, origin, cacheDir;
const repo = fileURLToPath(new URL('../../', import.meta.url));
before(async () => {
  cacheDir = await mkdtemp(path.join(tmpdir(), 'peercompute-agent-console-vite-'));
  server = await createServer({ configFile: false, root: repo, logLevel: 'error', cacheDir, optimizeDeps: { entries: ['demos/inference/src/agents/agentConsole.js'] },
    server: { host: '127.0.0.1', port: 0, hmr: false }, plugins: [{ name: 'agent-console-fixture', configureServer(vite) {
      vite.middlewares.use('/__agent_fixture', (_req, res) => { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent fixture</title><button id="launch">Agents</button><main id="root"></main>'); });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await server?.close(); if (cacheDir) await rm(cacheDir, { recursive: true, force: true }); });

async function fixture(t, options = {}) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, acceptDownloads: true });
  page.setDefaultTimeout(8000);
  const errors = [], external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://**/*', (route) => { external.push(route.request().url()); return route.abort(); });
  t.after(async () => {
    await page.evaluate(async () => { window.releaseCleanup?.(); await window.consoleUI?.dispose(); }).catch(() => {});
    await page.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin + '/__agent_fixture');
  await page.evaluate(async (options) => {
    const { createAgentConsole } = await import('/demos/inference/src/agents/agentConsole.js');
    // Match the containing model panel and its later-loaded shared stylesheet.
    document.querySelector('#root').classList.add('pc-inference-panel');
    await import('/demos/inference/src/panel.css');
    window.calls = []; window.state = { failSave: false, failList: false, cleanupFailure: false, ...options };
    const state = window.state, listeners = new Set(); let count = 0, active;
    const clone = (value) => structuredClone(value);
    const make = (id, input = {}) => ({ schema: 'peercompute.agent.v1', agentId: id, agentKind: 'general', identity: { name: input.name || 'Ada', instructions: input.instructions || 'Be concise' },
      goals: input.goals || ['Help with ideas'], context: { summary: input.summary || 'Saved private context' }, policy: { inferenceMode: input.inferenceMode || 'local-only' },
      authority: { kind: 'local', hostId: 'local-installation', epoch: 0 }, revision: 1, status: 'paused', updatedAt: 1770000000000, createdAt: 1770000000000, pendingOperation: null });
    state.records = options.empty ? [] : [{ ...make('agent-1'), status: options.paused ? 'paused' : 'waiting', ...(options.unsaved ? { activity: { status: 'paused', unsaved: true } } : {}) }];
    state.history = options.history || [{ type: 'request', text: '<script>not executed</script>', operationId: 'old' }, { type: 'result', text: 'Saved reply', operationId: 'old', route: { kind: 'local', modelId: 'fixture', manifestCid: 'bafy-fixture' } }];
    const emit = (type, agentId = 'agent-1', extra = {}) => { for (const listener of listeners) listener({ type, agentId, ...extra }); };
    const change = (id, values) => { const record = state.records.find((item) => item.agentId === id); Object.assign(record, values, { revision: record.revision + 1 }); emit('changed', id); return clone(record); };
    const controller = {
      async list() { if (state.failList) throw new Error('Agent database unavailable'); return clone(state.records); },
      async get(id) { return clone(state.records.find((item) => item.agentId === id)); },
      async events(_id, { after, limit } = {}) { return clone(state.history.filter((event) => after === undefined || event.sequence > after).slice(0, limit)); },
      async create(input) { calls.push({ type: 'create', input }); if (state.failSave) throw new Error('Storage quota exceeded'); const record = make(`new-${++count}`, input); state.records.push(record); emit('changed', record.agentId); return clone(record); },
      async update(id, input, meta) { calls.push({ type: 'update', id, input, meta }); if (state.failSave) throw new Error('Storage quota exceeded'); const prior = state.records.find((item) => item.agentId === id); return change(id, { ...make(id, input), revision: prior.revision }); },
      async remove(id) { calls.push({ type: 'remove', id }); state.records = state.records.filter((item) => item.agentId !== id); emit('removed', id); },
      async export(id) { calls.push({ type: 'export', id }); return { schema: 'test-backup', record: await this.get(id) }; },
      async importAsNew(bundle) { calls.push({ type: 'restore', bundle }); const record = make('restored-new', { name: bundle.record.identity.name }); state.records.push(record); return clone(record); },
      async resume(id) { calls.push({ type: 'resume', id }); return change(id, { status: 'waiting', activity: null }); },
      async pause(id) { calls.push({ type: 'pause', id }); await this.cancel(id); return change(id, { status: 'paused' }); },
      run(id, options) {
        calls.push({ type: 'run', id, task: options.task, prompt: options.prompt, image: options.image ? { width: options.image.width, height: options.image.height } : null });
        const promise = (async () => {
          change(id, { activity: { status: 'running', route: { kind: 'local', modelId: 'fixture', manifestCid: 'bafy-fixture' } } });
          state.history.push({ type: 'request', text: options.prompt, task: options.task, operationId: 'request-1' });
          try {
            await new Promise((resolve, reject) => {
              const timer = setTimeout(resolve, state.holdTask ? 60000 : 30);
              options.signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')); }, { once: true });
            });
            const result = options.task === 'text-to-image' ? { text: '', image: { width: 2, height: 2, channels: 4, data: new Uint8Array(16).fill(255) } } : { text: 'A useful answer', finishReason: 'stop' };
            state.history.push({ type: 'result', text: result.text, task: options.task, operationId: 'request-1', ...(result.image ? { imageAttachmentId: 'image-1' } : {}) });
            return { agentId: id, requestId: 'request-1', result, route: { kind: 'local', modelId: 'fixture', manifestCid: 'bafy-fixture' } };
          } catch (error) {
            if (state.cleanupBarrier) await new Promise((resolve) => { window.releaseCleanup = resolve; });
            if (state.cleanupFailure) throw new AggregateError([error], 'Worker termination failed');
            throw error;
          } finally { change(id, { status: 'completed', activity: null }); }
        })(); active = promise; promise.finally(() => { if (active === promise) active = null; }).catch(() => {}); return promise;
      },
      async cancel(id) { calls.push({ type: 'cancel', id }); try { await active; } catch (error) { if (error.name !== 'AbortError') throw error; } },
      subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); calls.push({ type: 'unsubscribe' }); }; },
    };
    window.controller = controller; window.emit = emit;
    window.consoleUI = createAgentConsole({ container: document.querySelector('#root'), controller, onBrowseModels: () => calls.push({ type: 'browse' }) });
    document.querySelector('#launch').addEventListener('click', () => { void consoleUI.open(); });
  }, options);
  await page.locator('#launch').click();
  await page.getByRole('dialog', { name: 'Agents', exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelector('.pc-agent-list').textContent.length > 0);
  return page;
}
const button = (page, name) => page.getByRole('button', { name, exact: true });
const calls = (page, type) => page.evaluate((type) => window.calls.filter((call) => call.type === type), type);

test('create persists a single general agent, defaults local, starts paused and never auto-runs', async (t) => {
  const page = await fixture(t, { empty: true });
  await button(page, 'New agent').click();
  assert.equal(await page.getByLabel('Inference policy', { exact: true }).inputValue(), 'local-only');
  await page.getByLabel('Agent name', { exact: true }).fill('Helper');
  await page.getByLabel('Goals', { exact: true }).fill('First goal\n\nSecond goal');
  await page.getByLabel('Saved memory summary', { exact: true }).fill('Remember my project');
  await button(page, 'Save agent').click(); await page.getByRole('heading', { name: 'Helper' }).waitFor();
  assert.deepEqual((await calls(page, 'create'))[0].input.goals, ['First goal', 'Second goal']);
  await page.getByLabel('Agent message', { exact: true }).fill('Hello');
  assert.equal(await button(page, 'Run task').isDisabled(), true);
  await button(page, 'Resume').click(); await page.waitForFunction(() => window.state.records[0].status === 'waiting');
  assert.deepEqual(await calls(page, 'run'), []);
  await page.getByLabel('Agent message', { exact: true }).press('Enter');
  await page.getByLabel('Current agent result').getByText('A useful answer').waitFor();
  assert.equal((await calls(page, 'run')).length, 1);
});

test('failed save keeps draft visible and only acknowledged records replace identity', async (t) => {
  const page = await fixture(t); await button(page, 'Edit agent').click();
  await page.getByLabel('Agent name', { exact: true }).fill('New name');
  await page.getByLabel('Inference policy', { exact: true }).selectOption('network-assisted');
  assert.match(await page.locator('.pc-agent-editor .pc-agent-policy').textContent(), /executing peer/);
  await page.evaluate(() => { state.failSave = true; }); await button(page, 'Save agent').click();
  await page.getByRole('status').getByText('Storage quota exceeded').waitFor();
  assert.equal(await page.getByLabel('Agent name', { exact: true }).inputValue(), 'New name');
  assert.equal(await page.evaluate(() => state.records[0].identity.name), 'Ada');
  await page.evaluate(() => { state.failSave = false; }); await button(page, 'Save agent').click();
  await page.getByRole('heading', { name: 'New name' }).waitFor();
  assert.equal((await calls(page, 'update'))[1].meta.expectedRevision, 1);
  assert.match(await page.locator('.pc-agent-workspace>.pc-agent-policy').textContent(), /Peer inference allowed/);
});

test('history is safe text, route is explicit baseline and closing/reopening never executes', async (t) => {
  const page = await fixture(t);
  assert.match(await page.getByRole('log', { name: 'Saved agent history' }).textContent(), /<script>not executed<\/script>/);
  assert.equal(await page.locator('.pc-agent-history script').count(), 0);
  await page.locator('.pc-agent-route summary').click();
  assert.match(await page.locator('.pc-agent-route pre').textContent(), /Baseline routing[\s\S]*bafy-fixture/);
  await button(page, 'Done').click(); assert.equal(await page.locator('#launch').evaluate((el) => el === document.activeElement), true);
  await page.locator('#launch').click();
  assert.deepEqual(await calls(page, 'run'), []);
  await button(page, 'Browse models').click(); assert.equal((await calls(page, 'browse')).length, 1);
});

test('Shift+Enter stays multiline; attached image selects vision and image output remains explicit', async (t) => {
  const page = await fixture(t); const prompt = page.getByLabel('Agent message', { exact: true });
  await prompt.fill('First'); await prompt.press('Shift+Enter'); await prompt.type('Second');
  assert.equal(await prompt.inputValue(), 'First\nSecond'); assert.deepEqual(await calls(page, 'run'), []);
  const encoded = await page.evaluate(() => { const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1; canvas.getContext('2d').fillRect(0, 0, 1, 1); return canvas.toDataURL('image/png').split(',')[1]; });
  const png = Buffer.from(encoded, 'base64');
  await page.getByLabel('Agent image file', { exact: true }).setInputFiles({ name: 'pixel.png', mimeType: 'image/png', buffer: png });
  await page.getByText('Image attached for a vision task.', { exact: true }).waitFor();
  await button(page, 'Run task').click(); await page.getByLabel('Current agent result').getByText('A useful answer').waitFor();
  assert.equal((await calls(page, 'run'))[0].task, 'image-text-to-text');
  assert.deepEqual((await calls(page, 'run'))[0].image, { width: 1, height: 1 });
  await page.getByLabel('Agent output', { exact: true }).selectOption('image'); await prompt.fill('A white square');
  await button(page, 'Run task').click(); await page.getByAltText('Generated image: A white square').waitFor();
  assert.equal((await calls(page, 'run'))[1].task, 'text-to-image');
  assert.match(await page.getByRole('log', { name: 'Saved agent history' }).textContent(), /Image attachment recorded/);
});

test('cancellation stays busy until controller cleanup settles; failure is not labelled success', async (t) => {
  const page = await fixture(t, { holdTask: true, cleanupBarrier: true });
  await page.getByLabel('Agent message', { exact: true }).fill('Long task'); await button(page, 'Run task').click();
  await button(page, 'Cancel task').click();
  await page.waitForFunction(() => typeof window.releaseCleanup === 'function');
  assert.equal(await button(page, 'Cancelling…').isDisabled(), true);
  assert.equal(await button(page, 'Run task').isDisabled(), true);
  await page.evaluate(() => { state.cleanupFailure = true; releaseCleanup(); });
  await page.getByRole('status').getByText('Cleanup incomplete: Worker termination failed', { exact: true }).waitFor();
  assert.notEqual(await page.getByRole('status').textContent(), 'Task cancelled.');
});

test('Pause awaits the task, Resume does not replay, and paused Enter cannot dispatch', async (t) => {
  const page = await fixture(t, { holdTask: true, cleanupBarrier: true });
  await page.getByLabel('Agent message', { exact: true }).fill('Keep working'); await button(page, 'Run task').click();
  await button(page, 'Pause').click(); await page.waitForFunction(() => typeof releaseCleanup === 'function');
  assert.equal(await button(page, 'Run task').isDisabled(), true);
  await page.evaluate(() => releaseCleanup()); await page.waitForFunction(() => state.records[0].status === 'paused');
  await page.getByLabel('Agent message', { exact: true }).press('Enter'); assert.equal((await calls(page, 'run')).length, 1);
  await button(page, 'Resume').click(); await page.waitForFunction(() => state.records[0].status === 'waiting');
  assert.equal((await calls(page, 'run')).length, 1);
});

test('unsaved outcome blocks new dispatch and exposes Resume for reconciliation', async (t) => {
  const page = await fixture(t, { unsaved: true });
  await page.getByLabel('Agent message', { exact: true }).fill('No replay');
  assert.equal(await button(page, 'Run task').isDisabled(), true);
  await page.getByLabel('Agent message', { exact: true }).press('Enter'); assert.deepEqual(await calls(page, 'run'), []);
  await button(page, 'Resume').click(); await page.waitForFunction(() => state.records[0].activity === null);
  assert.deepEqual(await calls(page, 'run'), []);
});

test('restore calls importAsNew, delete affects only the chosen identity, export is an owned JSON download', async (t) => {
  const page = await fixture(t);
  const downloadEvent = page.waitForEvent('download'); await button(page, 'Export').click(); const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), 'agent-agent-1.json'); await download.delete();
  await page.getByLabel('Restore agent file', { exact: true }).setInputFiles({ name: 'agent.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ record: { identity: { name: 'Restored' } } })) });
  await page.getByRole('heading', { name: 'Restored', exact: true }).waitFor();
  assert.equal((await calls(page, 'restore')).length, 1); assert.deepEqual(await calls(page, 'run'), []);
  assert.equal(await page.evaluate(() => state.records.find((r) => r.agentId === 'restored-new').status), 'paused');
  await button(page, 'Delete agent').click(); await page.getByRole('heading', { name: 'Ada', exact: true }).waitFor();
  assert.equal((await calls(page, 'remove'))[0].id, 'restored-new');
});

test('read failures are visible, refresh events do not overwrite an unsaved editor draft', async (t) => {
  const page = await fixture(t); await button(page, 'Edit agent').click(); await page.getByLabel('Instructions', { exact: true }).fill('Unsaved draft');
  await page.evaluate(() => { state.records[0].revision++; emit('changed'); });
  assert.equal(await page.getByLabel('Instructions', { exact: true }).inputValue(), 'Unsaved draft');
  await page.evaluate(() => { state.failList = true; emit('changed'); });
  await page.getByRole('status').getByText('Could not read saved agents: Agent database unavailable', { exact: true }).waitFor();
});

test('all bounded history pages are available, including results beyond the first 100 events', async (t) => {
  const history = Array.from({ length: 205 }, (_, index) => ({ sequence: index + 1, type: 'result', text: `Saved event ${index + 1}` }));
  const page = await fixture(t, { history });
  await page.getByText('Saved event 205', { exact: true }).waitFor();
  assert.equal(await page.locator('.pc-agent-history article').count(), 205);
});

test('disposal shares one cleanup promise, aborts its task and waits before removing the UI', async (t) => {
  const page = await fixture(t, { holdTask: true, cleanupBarrier: true });
  await page.getByLabel('Agent message', { exact: true }).fill('Active task'); await button(page, 'Run task').click();
  await page.evaluate(() => { window.disposedSettled = false; window.firstDispose = consoleUI.dispose(); window.sameDisposal = firstDispose === consoleUI.dispose(); firstDispose.then(() => { disposedSettled = true; }); });
  await page.waitForFunction(() => typeof releaseCleanup === 'function');
  assert.equal(await page.evaluate(() => sameDisposal && !disposedSettled), true);
  assert.equal(await page.locator('.pc-agent-console').count(), 1);
  await page.evaluate(async () => { releaseCleanup(); await firstDispose; });
  assert.equal(await page.locator('.pc-agent-console').count(), 0);
  assert.equal((await calls(page, 'unsubscribe')).length, 1);
});

test('responsive native dialog traps focus and disposal unsubscribes without owning the controller', async (t) => {
  const page = await fixture(t); const directory = process.env.AGENT_UI_EVIDENCE;
  await button(page, 'Edit agent').click();
  await page.getByLabel('Agent name', { exact: true }).fill('An agent with a long descriptive name that must wrap inside its sidebar');
  await button(page, 'Save agent').click();
  assert.equal(await page.locator('.pc-agent-list button').evaluate((el) =>
    getComputedStyle(el).whiteSpace === 'normal' && el.scrollWidth <= el.clientWidth), true);
  if (directory) { await mkdir(directory, { recursive: true }); await page.screenshot({ path: `${directory}/agent-desktop.png` }); }
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.locator('.pc-agent-console').evaluate((el) => el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().right <= innerWidth), true);
  if (directory) await page.screenshot({ path: `${directory}/agent-mobile-workspace.png` });
  await button(page, 'New agent').click(); await page.getByLabel('Agent name', { exact: true }).fill('Mobile agent');
  if (directory) await page.screenshot({ path: `${directory}/agent-mobile.png` });
  await button(page, 'Cancel edit').focus(); await page.keyboard.press('Tab');
  assert.equal(await button(page, 'Done').evaluate((el) => el === document.activeElement), true);
  await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog', { name: 'Agents', exact: true }).count(), 0);
  await page.evaluate(() => consoleUI.dispose());
  assert.equal((await calls(page, 'unsubscribe')).length, 1);
  assert.equal(await page.locator('.pc-agent-console').count(), 0);
});

test('native IndexedDB and real AgentRuntime persist the UI-created identity, route and task across reload', async (t) => {
  const page = await browser.newPage(); page.setDefaultTimeout(8000);
  const errors = [], external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://**/*', (route) => { external.push(route.request().url()); return route.abort(); });
  t.after(async () => {
    await page.evaluate(async () => { await window.consoleUI?.dispose(); await window.nativeController?.dispose(); await window.nativeStore?.destroy(); }).catch(() => {});
    await page.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  const mount = () => page.evaluate(async () => {
    const [{ createAgentConsole }, { AgentRecordStore }, { AgentRuntime }] = await Promise.all([
      import('/demos/inference/src/agents/agentConsole.js'),
      import('/peercompute/src/peercompute/agents/AgentRecordStore.js'),
      import('/peercompute/src/peercompute/agents/AgentRuntime.js'),
    ]);
    window.nativeCalls = [];
    window.nativeStore = new AgentRecordStore({ name: 'ui-native-acceptance' }); await nativeStore.open();
    window.nativeController = new AgentRuntime({ store: nativeStore, inference: {
      listCandidates: async () => [{ key: 'local', available: true, local: true, manifestCid: 'bafy-native-fixture', runtime: 'test', task: 'text-generation', modalities: ['text'], outputModalities: ['text'] }],
      generate: async (candidate, input) => { nativeCalls.push({ candidate, input }); return { text: 'Native persistence answer', finishReason: 'stop' }; },
    } });
    window.consoleUI = createAgentConsole({ container: document.querySelector('#root'), controller: nativeController }); await consoleUI.open();
  });
  await page.goto(origin + '/__agent_fixture'); await mount();
  await button(page, 'New agent').click(); await page.getByLabel('Agent name', { exact: true }).fill('Durable helper');
  await page.getByLabel('Saved memory summary', { exact: true }).fill('Remember the green project'); await button(page, 'Save agent').click();
  await page.getByRole('heading', { name: 'Durable helper' }).waitFor(); await button(page, 'Resume').click();
  await page.waitForFunction(async () => (await nativeController.list())[0].status === 'waiting');
  await page.getByLabel('Agent message', { exact: true }).fill('Recall our project'); await button(page, 'Run task').click();
  await page.getByLabel('Current agent result').getByText('Native persistence answer', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => nativeCalls.length), 1);
  assert.match(await page.evaluate(() => nativeCalls[0].input.messages[0].content), /Remember the green project/);
  const id = await page.evaluate(async () => (await nativeController.list())[0].agentId);
  await page.evaluate(async () => { await consoleUI.dispose(); await nativeController.dispose(); await nativeStore.destroy(); });
  await page.reload(); await mount();
  await page.getByRole('heading', { name: 'Durable helper' }).waitFor();
  await page.getByRole('log', { name: 'Saved agent history' }).getByText('Native persistence answer', { exact: true }).waitFor();
  assert.equal(await page.evaluate(async () => (await nativeController.list())[0].agentId), id);
  assert.equal(await page.evaluate(() => nativeCalls.length), 0);
  assert.match(await page.locator('.pc-agent-route pre').textContent(), /bafy-native-fixture/);
  assert.equal(page.workers().length, 0);
});

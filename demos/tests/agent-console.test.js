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
      vite.middlewares.use('/__agent_fixture', (_req, res) => { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent fixture</title><button id="launch">Agents</button><main id="root"></main><textarea id="main-prompt" aria-label="Main message"></textarea>'); });
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
    state.records = options.empty ? [] : [{ ...make('agent-1'), status: options.paused ? 'paused' : 'waiting', ...(options.unsaved ? { activity: { status: 'paused', unsaved: true } } : {}), ...(options.busy ? { activity: {status:'running'} } : {}) }];
    state.history = options.history || [{ type: 'request', text: '<script>not executed</script>', operationId: 'old' }, { type: 'result', text: 'Saved reply', operationId: 'old', route: { kind: 'local', modelId: 'fixture', manifestCid: 'bafy-fixture' } }];
    const emit = (type, agentId = 'agent-1', extra = {}) => { for (const listener of listeners) listener({ type, agentId, ...extra }); };
    const change = (id, values) => { const record = state.records.find((item) => item.agentId === id); Object.assign(record, values, { revision: record.revision + 1 }); emit('changed', id); return clone(record); };
    const controller = {
      async list() { if (state.failList) throw new Error('Agent database unavailable'); return clone(state.records); },
      async get(id) { return clone(state.records.find((item) => item.agentId === id)); },
      async events(_id, { after, limit } = {}) { calls.push({type:'events'}); return clone(state.history.filter((event) => after === undefined || event.sequence > after).slice(0, limit)); },
      async create(input) { calls.push({ type: 'create', input }); if (state.failSave) throw new Error('Storage quota exceeded'); if(state.holdSave) await new Promise(resolve=>{window.releaseSave=resolve}); const record = make(`new-${++count}`, input); state.records.push(record); emit('changed', record.agentId); return clone(record); },
      async update(id, input, meta) { calls.push({ type: 'update', id, input, meta }); if (state.failSave) throw new Error('Storage quota exceeded'); const prior = state.records.find((item) => item.agentId === id); if(state.failAfterSave) state.failList=true; return change(id, { ...make(id, input), revision: prior.revision }); },
      async remove(id) { calls.push({ type: 'remove', id }); state.records = state.records.filter((item) => item.agentId !== id); emit('removed', id); },
      async export(id) { calls.push({ type: 'export', id }); return { schema: 'test-backup', record: await this.get(id) }; },
      async importAsNew(bundle) { calls.push({ type: 'restore', bundle }); const record = make('restored-new', { name: bundle.record.identity.name }); state.records.push(record); return clone(record); },
      async resume(id) { calls.push({ type: 'resume', id }); return change(id, { status: 'waiting', activity: null }); },
      async pause(id) { calls.push({ type: 'pause', id }); if(state.pauseBarrier) await new Promise(resolve=>{window.releaseCleanup=resolve}); if(state.cleanupFailure) throw Error('Worker termination failed'); await this.cancel(id); return change(id, { status: 'paused' }); },
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
    window.consoleUI = createAgentConsole({ container: document.querySelector('#root'), controller, onChat: async id => { calls.push({type:'chat',id}); if(state.holdChat) await new Promise(resolve=>{window.releaseChat=resolve}); if(state.failChat) throw Error('Selected agent no longer exists'); requestAnimationFrame(()=>document.querySelector('#main-prompt').focus()); } });
    document.querySelector('#launch').addEventListener('click', () => { void consoleUI.open(); });
  }, options);
  await page.locator('#launch').click();
  await page.getByRole('dialog', { name: 'Agents', exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelector('.pc-agent-list').textContent.length > 0);
  return page;
}
const button = (page, name) => page.getByRole('button', { name, exact: true });
const calls = (page, type) => page.evaluate((type) => window.calls.filter((call) => call.type === type), type);

test('create defaults Mixed, persists paused identity and never runs or fetches conversation history', async (t) => {
  const page = await fixture(t, { empty: true });
  await button(page, 'New agent').click();
  assert.equal(await page.getByLabel('Inference policy', { exact: true }).inputValue(), 'network-assisted');
  await page.getByLabel('Agent name', { exact: true }).fill('Helper');
  await page.getByLabel('Goals', { exact: true }).fill('First goal\n\nSecond goal');
  await page.getByLabel('Saved memory summary', { exact: true }).fill('Remember my project');
  await button(page, 'Save agent').click(); await page.getByRole('heading', { name: 'Helper' }).waitFor();
  assert.deepEqual((await calls(page, 'create'))[0].input.goals, ['First goal', 'Second goal']);
  assert.equal((await calls(page, 'create'))[0].input.inferenceMode, 'network-assisted');
  assert.equal(await page.evaluate(() => state.records[0].status), 'paused');
  assert.equal(await button(page, 'Chat').isEnabled(), true);
  assert.equal(await page.getByLabel('Agent message', {exact:true}).count(), 0);
  assert.equal(await button(page, 'Run task').count(), 0);
  assert.equal(await page.locator('.pc-agent-history,.pc-agent-live,.pc-agent-route').count(), 0);
  assert.deepEqual(await calls(page, 'run'), []); assert.deepEqual(await calls(page, 'events'), []);
});

test('failed save keeps draft visible and only acknowledged records replace identity', async (t) => {
  const page = await fixture(t); await button(page, 'Edit agent').click();
  await page.getByLabel('Agent name', { exact: true }).fill('New name');
  await page.getByLabel('Inference policy', { exact: true }).selectOption('network-assisted');
  assert.match(await page.locator('.pc-agent-editor .pc-agent-policy').textContent(), /messages and attachments may be sent to that peer/);
  await page.evaluate(() => { state.failSave = true; }); await button(page, 'Save agent').click();
  await page.getByRole('status').getByText('Storage quota exceeded').waitFor();
  assert.equal(await page.getByLabel('Agent name', { exact: true }).inputValue(), 'New name');
  assert.equal(await page.evaluate(() => state.records[0].identity.name), 'Ada');
  await page.evaluate(() => { state.failSave = false; }); await button(page, 'Save agent').click();
  await page.getByRole('heading', { name: 'New name' }).waitFor();
  assert.equal((await calls(page, 'update'))[1].meta.expectedRevision, 1);
  assert.match(await page.locator('.pc-agent-workspace>.pc-agent-policy').textContent(), /Mixed · local first, then peers/);
});

test('identity details are safe text; existing local policy and saved memory remain unchanged', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => { state.records[0].identity.instructions='<script>not executed</script>'; emit('changed'); });
  await page.locator('.pc-agent-record').getByText('<script>not executed</script>', {exact:true}).waitFor();
  assert.equal(await page.locator('.pc-agent-record script').count(), 0);
  assert.match(await page.locator('.pc-agent-record').textContent(), /Saved private context/);
  assert.match(await page.locator('.pc-agent-workspace>.pc-agent-policy').textContent(), /Local only/);
  await button(page, 'Edit agent').click();
  assert.equal(await page.getByLabel('Inference policy', {exact:true}).inputValue(), 'local-only');
  await button(page, 'Cancel edit').click();
  await button(page, 'Done').click(); assert.equal(await page.locator('#launch').evaluate(el=>el===document.activeElement), true);
  await page.locator('#launch').click();
  assert.deepEqual(await calls(page,'events'), []); assert.deepEqual(await calls(page,'run'), []);
});

test('Chat selects a paused agent once, waits for handoff and leaves focus to main chat', async (t) => {
  const page = await fixture(t, {paused:true,holdChat:true});
  await button(page, 'Chat').click();
  await page.waitForFunction(()=>typeof releaseChat==='function');
  assert.equal(await page.getByRole('dialog',{name:'Agents',exact:true}).isVisible(), true);
  assert.equal(await button(page, 'Chat').isDisabled(), true);
  await button(page, 'Chat').evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true})));
  assert.equal((await calls(page,'chat')).length,1);
  await page.evaluate(()=>releaseChat());
  await page.getByRole('dialog',{name:'Agents',exact:true}).waitFor({state:'hidden'});
  await page.waitForFunction(()=>document.activeElement===document.querySelector('#main-prompt'));
  assert.deepEqual(await calls(page,'chat'),[{type:'chat',id:'agent-1'}]);
  assert.deepEqual(await calls(page,'resume'),[]); assert.deepEqual(await calls(page,'run'),[]);
});

test('failed Chat leaves management open and permits an explicit retry', async (t) => {
  const page = await fixture(t, {failChat:true});
  await button(page,'Chat').click();
  await page.getByRole('status').getByText('Could not open chat: Selected agent no longer exists',{exact:true}).waitFor();
  assert.equal(await page.getByRole('dialog',{name:'Agents',exact:true}).isVisible(), true);
  await page.evaluate(()=>{state.failChat=false}); await button(page,'Chat').click();
  await page.getByRole('dialog',{name:'Agents',exact:true}).waitFor({state:'hidden'});
  assert.equal((await calls(page,'chat')).length,2); assert.deepEqual(await calls(page,'run'),[]);
});

test('open selectedId synchronizes identity without execution and falls back after deletion', async (t) => {
  const page = await fixture(t);
  await page.evaluate(async()=>{const second=structuredClone(state.records[0]);second.agentId='agent-2';second.identity.name='Second';state.records.push(second);await consoleUI.open({selectedId:'agent-2'})});
  await page.getByRole('heading',{name:'Second',exact:true}).waitFor();
  assert.equal(await page.locator('[data-agent-id="agent-2"]').getAttribute('aria-current'),'true');
  await button(page,'Delete agent').click(); await page.getByRole('heading',{name:'Ada',exact:true}).waitFor();
  assert.equal((await calls(page,'remove'))[0].id,'agent-2'); assert.deepEqual(await calls(page,'run'),[]);
});

test('Pause awaits external task cleanup and failed cleanup remains visible', async (t) => {
  const page=await fixture(t,{busy:true,pauseBarrier:true});
  assert.equal(await button(page,'Edit agent').isDisabled(),true);
  assert.equal(await button(page,'Chat').isDisabled(),true);
  await button(page,'Pause').click();await page.waitForFunction(()=>typeof releaseCleanup==='function');
  assert.equal(await button(page,'Resume').isDisabled(),true);
  await page.evaluate(()=>{state.cleanupFailure=true;releaseCleanup()});
  await page.getByRole('status').getByText('Cleanup incomplete: Worker termination failed',{exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>state.records[0].status),'waiting');
  await page.evaluate(()=>{state.cleanupFailure=false;state.pauseBarrier=false;state.records[0].activity=null;emit('changed')});
  await button(page,'Pause').click(); await page.waitForFunction(()=>state.records[0].status==='paused');
  await button(page,'Resume').click();await page.waitForFunction(()=>state.records[0].status==='waiting');
  assert.deepEqual(await calls(page,'run'),[]);
});

test('unsaved outcome exposes reconciliation without replay and Chat remains selection only', async (t) => {
  const page=await fixture(t,{unsaved:true});
  assert.match(await page.locator('.pc-agent-workspace').textContent(),/Unsaved outcome/);
  assert.equal(await button(page,'Chat').isEnabled(),true);
  await button(page,'Resume').click();await page.waitForFunction(()=>state.records[0].activity===null);
  assert.deepEqual(await calls(page,'run'),[]);
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

test('a failed read after acknowledged save is not overwritten by a success label', async (t) => {
  const page=await fixture(t);await button(page,'Edit agent').click();
  await page.getByLabel('Agent name',{exact:true}).fill('Saved but unreadable');
  await page.evaluate(()=>{state.failAfterSave=true});await button(page,'Save agent').click();
  await page.getByRole('status').getByText('Could not read saved agents: Agent database unavailable',{exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>state.records[0].identity.name),'Saved but unreadable');
  assert.equal(await page.getByRole('status').getAttribute('data-error'),'true');
});

test('manager disposal leaves caller-owned active conversation and controller untouched', async (t) => {
  const page=await fixture(t,{busy:true});
  await page.evaluate(async()=>{window.firstDispose=consoleUI.dispose();window.sameDisposal=firstDispose===consoleUI.dispose();await firstDispose});
  assert.equal(await page.evaluate(()=>sameDisposal),true);
  assert.equal(await page.locator('.pc-agent-console').count(),0);
  assert.equal((await calls(page,'unsubscribe')).length,1);
  assert.deepEqual(await calls(page,'cancel'),[]);assert.deepEqual(await calls(page,'run'),[]);
  assert.equal(await page.evaluate(()=>state.records[0].activity.status),'running');
});

test('dispose waits for its own save without cancelling the shared controller', async (t) => {
  const page=await fixture(t,{empty:true,holdSave:true});
  await button(page,'New agent').click();await page.getByLabel('Agent name',{exact:true}).fill('Durable save');await button(page,'Save agent').click();
  await page.waitForFunction(()=>typeof releaseSave==='function');
  await page.evaluate(()=>{window.disposedSettled=false;window.disposing=consoleUI.dispose().then(()=>{disposedSettled=true})});
  assert.equal(await page.evaluate(()=>disposedSettled),false);
  await page.evaluate(async()=>{releaseSave();await disposing});
  assert.equal(await page.locator('.pc-agent-console').count(),0);
  assert.equal(await page.evaluate(()=>state.records[0].identity.name),'Durable save');
  assert.deepEqual(await calls(page,'cancel'),[]);
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

test('native IndexedDB preserves managed identities and existing conversation history across reload', async (t) => {
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
    window.consoleUI = createAgentConsole({ container: document.querySelector('#root'), controller: nativeController, onChat: id=>{window.selectedNativeAgent=id} }); await consoleUI.open();
  });
  await page.goto(origin + '/__agent_fixture'); await mount();
  await button(page, 'New agent').click(); await page.getByLabel('Agent name', { exact: true }).fill('Durable helper');
  await page.getByLabel('Saved memory summary', { exact: true }).fill('Remember the green project'); await button(page, 'Save agent').click();
  await page.getByRole('heading', { name: 'Durable helper' }).waitFor(); await button(page, 'Resume').click();
  await page.waitForFunction(async () => (await nativeController.list())[0].status === 'waiting');
  await button(page,'Chat').click();
  await page.getByRole('dialog',{name:'Agents',exact:true}).waitFor({state:'hidden'});
  assert.equal(await page.evaluate(()=>nativeCalls.length),0);
  // The caller-owned main chat supplies execution; the manager never calls run.
  await page.evaluate(()=>nativeController.run(selectedNativeAgent,{task:'text-generation',prompt:'Recall our project'}));
  assert.equal(await page.evaluate(()=>nativeCalls.length),1);
  assert.match(await page.evaluate(()=>nativeCalls[0].input.messages[0].content),/Remember the green project/);
  const id = await page.evaluate(async () => (await nativeController.list())[0].agentId);
  await page.evaluate(async () => { await consoleUI.dispose(); await nativeController.dispose(); await nativeStore.destroy(); });
  await page.reload(); await mount();
  await page.getByRole('heading', { name: 'Durable helper' }).waitFor();
  assert.equal(await page.getByRole('log').count(),0);
  assert.match(await page.evaluate(async()=>JSON.stringify(await nativeController.events((await nativeController.list())[0].agentId))),/Native persistence answer/);
  assert.equal(await page.evaluate(async () => (await nativeController.list())[0].agentId), id);
  assert.equal(await page.evaluate(() => nativeCalls.length), 0);
  assert.match(await page.locator('.pc-agent-record').textContent(),/Remember the green project/);
  assert.equal(page.workers().length, 0);
});

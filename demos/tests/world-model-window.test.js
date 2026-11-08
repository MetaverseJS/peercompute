import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

let server, browser, origin, cache;
before(async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  cache = await mkdtemp(join(tmpdir(), 'world-model-window-'));
  server = await createServer({ configFile: false, root, cacheDir: cache, logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: ['netmask'] },
    server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'world-model-window-fixture', configureServer(vite) {
      vite.middlewares.use('/__window_fixture', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><title>World window lifecycle — simulated models only</title>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); });

async function fixture(t, options = {}) {
  const page = await browser.newPage(), errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  t.after(async () => {
    await page.evaluate(async () => { state.failDispose = false; window.releaseMount?.(); window.releaseCleanup?.(); await host?.dispose(); }).catch(() => {});
    await page.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin + '/__window_fixture');
  await page.evaluate(async options => {
    const { installWorldAgents } = await import('/demos/shared/agents/WorldAgentHost.js');
    window.calls = []; window.state = { holdMount: !!options.holdMount, holdCleanup: !!options.holdCleanup, failDispose: !!options.failDispose };
    const head = { agentId: 'ada', identity: { name: 'Ada' }, policy: { inferenceMode: 'local-only' }, revision: 1, status: 'idle',
      embodiments: [{ worldId: 'cubechat:test', position: [1, 3, 5], color: '#22ff99', shared: true }] };
    const agents = { list: async () => [head], get: async () => head, subscribe: () => () => calls.push('unsubscribe'),
      events: async () => [], update: async () => {}, getAttachment: async () => null,
      run: async () => { calls.push('agent-run'); return { result: { text: 'Simulated fixture reply', finishReason: 'stop' } }; } };
    const runtime = { networkReady: true, networkManager: { peerId: 'owner' }, getAgentController: async () => agents,
      dispose: async () => calls.push('runtime-dispose'), unload: async () => calls.push('runtime-unload') };
    window.host = installWorldAgents({ worldId: 'cubechat:test', worldLabel: 'Fixture', panelOwnsWindow: options.direct !== false,
      beforeOpen: () => calls.push('release-input'), runtimeFactory: async () => runtime,
      adapter: { upsert() {}, normalizePosition: value => [...value], dispose: () => calls.push('adapter-dispose') },
      serviceFactory: () => ({ start: async () => {}, close: async () => calls.push('network-close') }),
      uiFactory: callbacks => {
        window.callbacks = callbacks;
        const button = document.createElement('button'); button.textContent = 'World Models'; button.id = 'models';
        const status = document.createElement('p'); status.id = 'status';
        button.onclick = () => { window.opening = callbacks.onModels().catch(error => { status.textContent = error.message; }); };
        document.body.append(button, status);
        return { open() {}, setAgents() {}, setMessages() {}, setVoiceStatus() {}, setBusy() {}, select() {},
          setStatus: value => { status.textContent = value; }, dispose: () => { button.remove(); status.remove(); calls.push('ui-dispose'); } };
      },
      panelFactory: async ({ container, runtimeFactory, onRequestClose, autoConnect }) => {
        calls.push('panel-mount'); if (autoConnect !== false) throw new Error('Panel must not own a new connection');
        if (state.holdMount) await new Promise(resolve => { window.releaseMount = resolve; });
        const borrowed = await runtimeFactory();
        const dialog = document.createElement('dialog'); dialog.setAttribute('aria-label', 'Fixture Models');
        const done = document.createElement('button'); done.textContent = 'Done'; const status = document.createElement('p');
        dialog.append(done, status); container.append(dialog); dialog.showModal();
        window.requestClose = onRequestClose;
        const close = () => { window.closingWindow = onRequestClose?.().catch(error => { status.textContent = error.message; }); };
        done.onclick = close; dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
        return { dispose: async () => {
          calls.push('panel-dispose-start');
          if (state.holdCleanup) await new Promise(resolve => { window.releaseCleanup = resolve; });
          if (state.failDispose) { state.failDispose = false; throw new Error('Panel cleanup not acknowledged'); }
          await borrowed.dispose(); dialog.remove(); calls.push('panel-dispose-end');
        } };
      },
    });
    await host.ready;
  }, options);
  return page;
}
const models = page => page.getByRole('dialog', { name: 'Fixture Models', exact: true });

test('direct world Models has one dialog, restores world focus and preserves runtime through reopening', async t => {
  const page = await fixture(t);
  await page.getByRole('button', { name: 'World Models', exact: true }).click(); await models(page).waitFor();
  assert.equal(await page.locator('dialog[open]').count(), 1);
  assert.equal(await page.locator('.world-agent-models').count(), 0);
  assert.equal(await page.locator('.world-agent-model-host').count(), 1);
  assert.equal(await page.evaluate(async () => { try { await host.send({ key: 'local:ada', text: 'Blocked until closed' }); } catch (error) { return error.message; } }), 'Close Models before starting a conversation');
  await models(page).getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.world-agent-model-host'));
  assert.equal(await page.locator('#models').evaluate(element => element === document.activeElement), true);
  assert.deepEqual(await page.evaluate(() => calls.filter(call => ['runtime-dispose', 'runtime-unload'].includes(call))), []);
  assert.equal(await page.evaluate(async () => (await host.send({ key: 'local:ada', text: 'Fixture request' })).text), 'Simulated fixture reply');
  await page.locator('#models').click(); await models(page).waitFor(); await page.keyboard.press('Escape');
  await page.waitForFunction(() => calls.filter(call => call === 'panel-dispose-end').length === 2);
  await page.evaluate(() => host.dispose());
  assert.equal(await page.evaluate(() => calls.filter(call => call === 'runtime-dispose').length), 1);
});

test('duplicate opening during mount keeps one panel and blocks world work until acknowledged cleanup', async t => {
  const page = await fixture(t, { holdMount: true, holdCleanup: true });
  await page.locator('#models').click(); await page.waitForFunction(() => typeof releaseMount === 'function');
  await page.evaluate(() => callbacks.onModels());
  assert.equal(await page.evaluate(() => calls.filter(call => call === 'panel-mount').length), 1);
  assert.match(await page.evaluate(async () => { try { await host.send({ key: 'local:ada', text: 'Blocked' }); } catch (error) { return error.message; } }), /Close Models/);
  await page.evaluate(() => releaseMount()); await models(page).waitFor();
  await models(page).getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForFunction(() => typeof releaseCleanup === 'function');
  await page.evaluate(() => { window.duplicateClose = requestClose(); });
  assert.equal(await page.evaluate(() => calls.filter(call => call === 'panel-dispose-start').length), 1);
  assert.equal(await models(page).isVisible(), true);
  assert.match(await page.evaluate(async () => { try { await host.send({ key: 'local:ada', text: 'Still blocked' }); } catch (error) { return error.message; } }), /Close Models/);
  await page.evaluate(async () => { releaseCleanup(); await duplicateClose; });
  assert.equal(await page.locator('dialog[open]').count(), 0);
  assert.equal(await page.evaluate(() => calls.filter(call => call === 'runtime-dispose').length), 0);
});

test('world teardown waits for pending panel mounting and disposes its runtime only afterward', async t => {
  const page = await fixture(t, { holdMount: true, holdCleanup: true });
  await page.locator('#models').click(); await page.waitForFunction(() => typeof releaseMount === 'function');
  await page.evaluate(() => { window.worldClosed = false; window.worldClosing = host.dispose().then(() => { worldClosed = true; }); });
  assert.equal(await page.evaluate(() => worldClosed), false);
  assert.equal(await page.evaluate(() => calls.includes('runtime-dispose')), false);
  await page.evaluate(() => releaseMount());
  await page.waitForFunction(() => typeof releaseCleanup === 'function');
  assert.equal(await page.evaluate(() => calls.includes('runtime-dispose')), false);
  await page.evaluate(async () => { releaseCleanup(); await worldClosing; });
  assert.equal(await page.locator('dialog[open]').count(), 0);
  const recorded = await page.evaluate(() => calls);
  assert(recorded.indexOf('panel-dispose-end') < recorded.indexOf('runtime-dispose'));
  assert.equal(recorded.filter(call => call === 'runtime-dispose').length, 1);
});

test('failed panel disposal retains the owned host and permits a successful explicit retry', async t => {
  const page = await fixture(t, { failDispose: true });
  await page.locator('#models').click(); await models(page).waitFor();
  await models(page).getByRole('button', { name: 'Done', exact: true }).click();
  await models(page).getByText('Panel cleanup not acknowledged', { exact: true }).waitFor();
  assert.equal(await page.locator('.world-agent-model-host').count(), 1);
  await page.evaluate(() => callbacks.onModels());
  assert.equal(await page.evaluate(() => calls.filter(call => call === 'panel-mount').length), 1);
  assert.match(await page.evaluate(async () => { try { await host.send({ key: 'local:ada', text: 'Blocked' }); } catch (error) { return error.message; } }), /Close Models/);
  await models(page).getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.world-agent-model-host'));
  assert.equal(await page.evaluate(() => calls.filter(call => call === 'panel-dispose-start').length), 2);
  assert.equal(await page.evaluate(() => calls.filter(call => call === 'runtime-dispose').length), 0);
});

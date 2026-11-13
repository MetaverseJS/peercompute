import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

test('native diagnostic persistence, cross-tab retention and scoped clearing stay independent of conversation history', { timeout: 45000 }, async () => {
  const root = fileURLToPath(new URL('../../../', import.meta.url)), cacheDir = await mkdtemp(join(tmpdir(), 'resident-diagnostics-'));
  let server, browser;
  try {
    server = await createServer({ configFile: false, root, cacheDir, logLevel: 'error',
      optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false },
      plugins: [{ name: 'resident-diagnostic-fixture', configureServer(vite) {
        vite.middlewares.use('/__diagnostics', (_request, response) => {
          response.setHeader('Content-Type', 'text/html');
          response.end('<!doctype html><title>Owned resident diagnostics fixture</title><script type="module">'
            + 'import {ResidentDiagnosticsStore} from "/peercompute/src/peercompute/agents/ResidentDiagnosticsStore.js";'
            + 'window.store=new ResidentDiagnosticsStore({name:"owned-reload",maximumPerResident:3,maximumEntries:4});'
            + 'await store.open();window.ready=true;</script>');
        });
      } }] });
    await server.listen(); const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
    const context = await browser.newContext(), page = await context.newPage(), other = await context.newPage(), errors = [], external = [];
    for (const tab of [page, other]) tab.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      external.push(route.request().url()); return route.abort();
    });
    for (const tab of [page, other]) { await tab.goto(origin + '/__diagnostics'); await tab.waitForFunction(() => window.ready); }
    const scope = { agentId: 'skeletor', worldId: 'cubechat:room' };
    const original = await page.evaluate(async scope => {
      const first = await store.append({ ...scope, source: 'runtime', stage: 'inference', status: 'error', severity: 'error',
        errorCode: 'ERR_MODEL_CONTEXT_BUDGET', operationId: 'first', message: 'Request does not fit context',
        route: { modelLabel: 'Reasoning model', manifestCid: 'bafy-test', local: false, peerId: 'peer-1' },
        details: { requiredTokens: 9000, contextLength: 8192 }, prompt: 'PRIVATE SHOULD NOT PERSIST' });
      await store.append({ ...scope, agentId: 'other-resident', source: 'runtime', stage: 'inference', status: 'ready' });
      return first;
    }, scope);
    await page.reload(); await page.waitForFunction(() => window.ready);
    assert.deepEqual(await page.evaluate(scope => store.list(scope), scope), [original]);
    assert.equal(JSON.stringify(original).includes('PRIVATE'), false);
    const writes = await Promise.all([page, other].map((tab, index) => tab.evaluate(({ scope, index }) => store.append({
      ...scope, source: 'room-chat', stage: 'inference', status: 'running', operationId: `parallel-${index}`
    }), { scope, index })));
    assert(writes.every(Boolean)); assert.equal((await page.evaluate(scope => store.list(scope), scope)).length, 3);
    await other.evaluate(scope => store.append({ ...scope, source: 'room-chat', stage: 'inference', status: 'completed', operationId: 'latest' }), scope);
    const retained = await page.evaluate(scope => store.list(scope), scope);
    assert.equal(retained.length, 3); assert(!retained.some(row => row.operationId === 'first'));
    assert.equal(await page.evaluate(scope => store.clear(scope), scope), 3);
    await page.reload(); await page.waitForFunction(() => window.ready);
    assert.deepEqual(await page.evaluate(scope => store.list(scope), scope), []);
    assert.equal((await page.evaluate(scope => store.list({ ...scope, agentId: 'other-resident' }), scope)).length, 1);
    const databases = await page.evaluate(async () => (await indexedDB.databases()).map(database => database.name));
    assert.deepEqual(databases, ['peercompute-resident-diagnostics-v1-owned-reload']);
    for (const tab of [page, other]) await tab.evaluate(() => store.close());
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
  } finally { await browser?.close(); await server?.close(); await rm(cacheDir, { recursive: true, force: true }); }
});

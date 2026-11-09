import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

test('actual browser IndexedDB preserves scoped episodes after reload without sharing visitor memories', { timeout: 45000 }, async () => {
  const root = fileURLToPath(new URL('../../../', import.meta.url)), cacheDir = await mkdtemp(join(tmpdir(), 'world-memory-'));
  let server, browser;
  try {
    server = await createServer({ configFile: false, root, cacheDir, logLevel: 'error',
      optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false },
      plugins: [{ name: 'memory-browser-fixture', configureServer(vite) {
        vite.middlewares.use('/__memory', (_request, response) => {
          response.setHeader('Content-Type', 'text/html');
          response.end('<!doctype html><title>Owned world-memory fixture</title><script type="module">'
            + 'import {WorldMemoryStore} from "/peercompute/src/peercompute/agents/WorldMemoryStore.js";'
            + 'window.store=new WorldMemoryStore({name:"owned-reload"});await store.open();window.ready=true;</script>');
        });
      } }] });
    await server.listen(); const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
    const context = await browser.newContext(), page = await context.newPage(), errors = [], external = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      external.push(route.request().url()); return route.abort();
    });
    await page.goto(origin + '/__memory'); await page.waitForFunction(() => window.ready);
    const record = await page.evaluate(() => store.append({ agentId: 'ada', worldId: 'cubechat:room', audience: 'private',
      conversationId: 'visitor-a', kind: 'meeting', who: { peerId: 'authenticated-session-a', name: 'Alice' }, where: [4, 3, -2],
      text: 'Alice said she likes green cubes.', outcome: 'Attributed statement received',
      source: { kind: 'authenticated-message', eventId: 'one', peerId: 'authenticated-session-a' } }));
    await page.reload(); await page.waitForFunction(() => window.ready);
    const result = await page.evaluate(async record => {
      const scope = { agentId: record.agentId, worldId: record.worldId, audience: record.audience, conversationId: record.conversationId };
      return { stored: await store.get(scope, record.id), other: await store.retrieve({ ...scope, conversationId: 'visitor-b' }),
        public: await store.retrieve({ ...scope, audience: 'public' }), stats: await store.stats() };
    }, record);
    assert.deepEqual(result.stored, record); assert.deepEqual(result.other, []); assert.deepEqual(result.public, []);
    assert.equal(result.stats.retainedEntries, 1); await page.evaluate(() => store.close());
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
  } finally { await browser?.close(); await server?.close(); await rm(cacheDir, { recursive: true, force: true }); }
});

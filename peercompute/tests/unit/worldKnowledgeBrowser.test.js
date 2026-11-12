import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

test('native IndexedDB reload and cross-tab CAS preserve scoped knowledge and durable forgetting', { timeout: 45000 }, async () => {
  const root = fileURLToPath(new URL('../../../', import.meta.url)), cacheDir = await mkdtemp(join(tmpdir(), 'world-knowledge-'));
  let server, browser;
  try {
    server = await createServer({ configFile: false, root, cacheDir, logLevel: 'error',
      optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false },
      plugins: [{ name: 'knowledge-browser-fixture', configureServer(vite) {
        vite.middlewares.use('/__knowledge', (_request, response) => {
          response.setHeader('Content-Type', 'text/html');
          response.end('<!doctype html><title>Owned world knowledge fixture</title><script type="module">'
            + 'import {WorldKnowledgeStore} from "/peercompute/src/peercompute/agents/WorldKnowledgeStore.js";'
            + 'window.store=new WorldKnowledgeStore({name:"owned-reload"});await store.open();window.ready=true;</script>');
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
    for (const tab of [page, other]) { await tab.goto(origin + '/__knowledge'); await tab.waitForFunction(() => window.ready); }
    const record = await page.evaluate(() => {
      const scope = { agentId: 'ada', worldId: 'cubechat:room', audience: 'private', conversationId: 'owner-a' }, when = Date.now();
      return store.put({ ...scope, id: 'meeting', kind: 'place', subjectType: 'place', subjectId: 'meeting-place',
        label: 'Our meeting spot', note: 'Owner asked to remember here', position: [12, 3, -9], confidence: 'observed', lastSeenAt: when,
        evidence: [{ ...scope, episodeId: 'episode-one', eventId: 'event-one', sourceKind: 'authenticated-message', when, provenance: 'observed', peerId: 'owner-a' }] },
      { expectedRevision: 0 });
    });
    await page.reload(); await page.waitForFunction(() => window.ready);
    assert.deepEqual(await page.evaluate(record => store.get(record, record.id), record), record);
    const results = await Promise.all([page, other].map((tab, index) => tab.evaluate(async ({ record, index }) => {
      try { return { result: await store.put({ ...record, note: `Correction ${index}` }, { expectedRevision: record.revision }) }; }
      catch (error) { return { code: error.code }; }
    }, { record, index })));
    assert.equal(results.filter(result => result.result).length, 1);
    assert.equal(results.find(result => result.code).code, 'ERR_WORLD_KNOWLEDGE_CONFLICT');
    const updated = results.find(result => result.result).result;
    const scopes = await page.evaluate(async record => ({
      otherVisitor: await store.list({ ...record, conversationId: 'visitor-b' }), public: await store.list({ ...record, audience: 'public' }),
      clone: await store.inheritSnapshot({ agentId: 'clone', worldId: record.worldId, sourceAgentId: record.agentId, sourcePeerId: 'owner-peer', records: [record] })
    }), updated);
    assert.deepEqual(scopes.otherVisitor, []); assert.deepEqual(scopes.public, []);
    assert.equal(scopes.clone[0].confidence, 'shared'); assert.equal(scopes.clone[0].evidence[0].agentId, 'ada');
    await page.evaluate(record => store.forget(record, record.id, { expectedRevision: record.revision }), updated);
    await page.reload(); await page.waitForFunction(() => window.ready);
    const after = await page.evaluate(async record => {
      let replay;
      try { await store.put({ ...record, id: 'fresh-id' }, { expectedRevision: 0 }); }
      catch (error) { replay = error.code; }
      return { record: await store.get(record, record.id), replay, stats: await store.stats() };
    }, updated);
    assert.equal(after.record, undefined); assert.equal(after.replay, 'ERR_WORLD_KNOWLEDGE_FORGOTTEN');
    assert.equal(after.stats.retainedEntries, 1); assert.equal(after.stats.forgottenEntries, 1);
    for (const tab of [page, other]) await tab.evaluate(() => store.close());
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
  } finally { await browser?.close(); await server?.close(); await rm(cacheDir, { recursive: true, force: true }); }
});

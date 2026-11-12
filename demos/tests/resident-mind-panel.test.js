import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Presentation tests use controlled authorized-host callbacks. They do not
// establish storage durability, world movement, or inference behavior.
let server, browser, origin, cache;
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'resident-mind-ui-'));
  server = await createServer({ configFile: false, root: fileURLToPath(new URL('../../', import.meta.url)), cacheDir: cache,
    logLevel: 'error', optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'mind-fixture', configureServer(vite) {
      vite.middlewares.use('/__mind', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><style>body{background:#07141b;color:#c7edf3;font:14px monospace}</style><button id="opener">Open Mind</button>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/opt/google/chrome/chrome', headless: true,
    args: ['--disable-gpu', '--disable-webgpu'] });
});
after(async () => { try { await browser?.close(); } finally { await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); } });

async function fixture(t, { mobile = false, open = true } = {}) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1200, height: 900 } });
  const page = await context.newPage(), errors = [], external = [];
  page.setDefaultTimeout(5000); page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []); });
  await page.goto(origin + '/__mind');
  await page.evaluate(async open => {
    const { createResidentMindPanel } = await import('/demos/shared/agents/ResidentMindPanel.js');
    const now = Date.now();
    const scope = { agentId: 'ada', worldId: 'cubechat', audience: 'private', conversationId: 'owner-conversation' };
    window.entries = [
      { ...scope, id: 'place-1', revision: 3, kind: 'place', subjectType: 'place', subjectId: 'place-1', label: 'Home', note: 'Beside the first tree.',
        position: { x: 1, y: 2, z: 3 }, confidence: 'observed', status: 'fresh', lastSeenAt: now,
        createdAt: now, updatedAt: now, evidence: [{ ...scope, sourceKind: 'verified-action', provenance: 'observed', when: now, episodeId: 'episode-1', eventId: 'event-1' }] },
      { ...scope, audience: 'public', conversationId: 'world-conversation', id: 'person-1', revision: 5, kind: 'person', subjectType: 'peer', subjectId: 'peer-nova',
        label: 'Nova', note: 'Enjoys exploring.', position: { x: 4, y: 0, z: 5 }, confidence: 'shared', status: 'unverified',
        lastSeenAt: now - 100000, createdAt: now, updatedAt: now, origin: { sourceAgentId: 'old-ada', sourceRecordId: 'person-old' },
        evidence: [{ ...scope, audience: 'public', conversationId: 'world-conversation', sourceKind: 'shared-memory', provenance: 'shared', when: now - 100000 }] },
    ];
    window.calls = []; window.pending = []; window.worldKeys = 0;
    document.addEventListener('keydown', () => { worldKeys += 1; });
    const callback = kind => async input => {
      calls.push({ kind, ...input });
      if (window.hold === kind) return new Promise((resolve, reject) => pending.push({ kind, resolve, reject, signal: input.signal }));
      if (window.fail === kind) throw Error('Owner operation rejected: resident is reasoning');
      if (kind === 'list') return structuredClone(entries);
      if (kind === 'correct') {
        const record = entries.find(item => item.id === input.id);
        if (record.revision !== input.expectedRevision) throw Error('Revision changed; refresh before correcting');
        Object.assign(record, input.patch, { revision: record.revision + 1 });
      } else entries = entries.filter(item => item.id !== input.id);
      if (window.failAfterMutation) window.fail = 'list';
    };
    window.mind = createResidentMindPanel({ onList: callback('list'), onCorrect: callback('correct'), onForget: callback('forget') });
    document.querySelector('#opener').onclick = () => mind.open({ key: 'local:ada', name: 'Ada', returnFocus: document.querySelector('#opener') });
    if (open) document.querySelector('#opener').click();
  }, open);
  if (open) await page.getByRole('heading', { name: 'Home', exact: true }).waitFor();
  return page;
}
const card = (page, id = 'place-1') => page.locator(`[data-knowledge-id="${id}"]`);
const action = (page, name, id = 'place-1') => card(page, id).getByRole('button', { name, exact: true });
const mutationCalls = page => page.evaluate(() => calls.filter(call => call.kind !== 'list').map(({ signal, ...call }) => call));

test('inspection preserves category, audience, provenance and historical position without executing anything', async t => {
  const page = await fixture(t);
  assert.match(await card(page).innerText(), /Place · Private conversation · observed · recent evidence/);
  assert.match(await card(page, 'person-1').innerText(), /historical position.*current whereabouts are unknown/);
  await card(page, 'person-1').getByText('Source and audience', { exact: true }).click();
  assert.match(await card(page, 'person-1').innerText(), /Inherited from shared resident history/);
  assert.match(await card(page, 'person-1').innerText(), /Conversation: world-conversation/);
  assert.match(await card(page, 'person-1').innerText(), /Shared memory · inherited/);
  if (process.env.RESIDENT_MIND_SCREENSHOT_DIR) {
    await mkdir(process.env.RESIDENT_MIND_SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: join(process.env.RESIDENT_MIND_SCREENSHOT_DIR, 'resident-mind-desktop.png') });
  }
  await page.getByRole('combobox', { name: 'Knowledge category' }).selectOption('person');
  assert.equal(await page.locator('article').count(), 1); assert.equal(await card(page, 'person-1').isVisible(), true);
  await page.getByRole('combobox', { name: 'Knowledge category' }).selectOption('place');
  assert.equal(await card(page).isVisible(), true); assert.equal(await page.getByRole('textbox').count(), 0);
  assert.deepEqual(await mutationCalls(page), []);
});

test('correction sends only label and note with the exact resident and revision; errors retain the draft', async t => {
  const page = await fixture(t); await action(page, 'Correct').click();
  await page.getByRole('textbox', { name: 'Knowledge name', exact: true }).fill('  My home  ');
  await page.getByRole('textbox', { name: 'Knowledge note', exact: true }).fill('Owner correction\nStill private.');
  await page.evaluate(() => { window.hold = 'correct'; });
  await action(page, 'Save correction').click();
  await page.evaluate(() => document.querySelector('form').requestSubmit());
  assert.equal(await action(page, 'Save correction').isEnabled(), false);
  assert.deepEqual(await mutationCalls(page), [{ kind: 'correct', key: 'local:ada', id: 'place-1', expectedRevision: 3,
    patch: { label: 'My home', note: 'Owner correction\nStill private.' } }]);
  await page.evaluate(() => pending[0].reject(Error('Storage write failed')));
  await page.getByRole('status').filter({ hasText: 'Storage write failed' }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: 'Knowledge name', exact: true }).inputValue(), '  My home  ');
  assert.equal(await action(page, 'Save correction').isEnabled(), true);
  assert.match(await card(page).innerText(), /Private conversation/);
  assert.equal(await page.evaluate(() => worldKeys), 0, 'Editing keys stay out of world movement');
  await page.evaluate(() => { window.hold = ''; });
  await action(page, 'Save correction').click();
  await page.getByRole('heading', { name: 'My home', exact: true }).waitFor();
  assert.equal(await page.getByRole('textbox').count(), 0); assert.match(await page.getByRole('status').innerText(), /Correction saved/);
});

test('UTF-8 limits and blank labels cannot be submitted', async t => {
  const page = await fixture(t); await action(page, 'Correct').click();
  const name = page.getByRole('textbox', { name: 'Knowledge name', exact: true });
  await name.fill('🙂'.repeat(61)); assert.equal(await name.getAttribute('aria-invalid'), 'true');
  assert.equal(await action(page, 'Save correction').isEnabled(), false);
  await name.fill('   '); assert.equal(await action(page, 'Save correction').isEnabled(), false);
  await name.fill('Home');
  await page.getByRole('textbox', { name: 'Knowledge note', exact: true }).fill('🙂'.repeat(257));
  assert.equal(await action(page, 'Save correction').isEnabled(), false);
  await page.evaluate(() => document.querySelector('form').requestSubmit());
  assert.deepEqual(await mutationCalls(page), []);
});

test('forget is explicit, explains its limits and cannot duplicate or silently retry a failed write', async t => {
  const page = await fixture(t); await action(page, 'Forget').click();
  assert.match(await card(page).innerText(), /not the original conversation history/);
  assert.match(await card(page).innerText(), /cancel it in objective controls/);
  assert.deepEqual(await mutationCalls(page), []);
  await page.evaluate(() => { window.hold = 'forget'; }); await action(page, 'Forget entry').click();
  await page.evaluate(() => document.querySelector('[data-knowledge-id="place-1"] button').click());
  assert.deepEqual(await mutationCalls(page), [{ kind: 'forget', key: 'local:ada', id: 'place-1', expectedRevision: 3 }]);
  await page.evaluate(() => pending[0].reject(Error('Revision changed')));
  await page.getByRole('status').filter({ hasText: 'Revision changed' }).waitFor();
  assert.equal(await action(page, 'Forget entry').isEnabled(), true);
  await action(page, 'Keep entry').click(); assert.equal(await action(page, 'Forget').isVisible(), true);
  assert.equal((await mutationCalls(page)).length, 1);
  await page.evaluate(() => { window.hold = ''; }); await action(page, 'Forget').click(); await action(page, 'Forget entry').click();
  await page.getByRole('status').filter({ hasText: 'Entry forgotten' }).waitFor(); assert.equal(await card(page).count(), 0);
});

test('switching residents aborts and ignores a late knowledge list from the previous resident', async t => {
  const page = await fixture(t, { open: false });
  await page.evaluate(() => {
    window.hold = 'list'; mind.open({ key: 'local:first', name: 'First' });
    mind.open({ key: 'local:second', name: 'Second' });
    pending[1].resolve([{ ...entries[0], label: 'Second home' }]);
  });
  await page.getByRole('heading', { name: 'Second home', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => pending[0].signal.aborted), true);
  await page.evaluate(() => pending[0].resolve([{ ...entries[0], label: 'PRIVATE FIRST' }]));
  assert.equal(await page.getByRole('heading', { name: 'PRIVATE FIRST', exact: true }).count(), 0);
  assert.equal(await page.evaluate(() => mind.selectedKey), 'local:second');
  assert.deepEqual(await page.evaluate(() => calls.map(call => call.key)), ['local:first', 'local:second']);
});

test('Escape and Done restore focus; close aborts mutation and late errors cannot leak into a reopened panel', async t => {
  const page = await fixture(t); await action(page, 'Correct').click();
  await page.getByRole('textbox', { name: 'Knowledge name', exact: true }).fill('New home');
  await page.evaluate(() => { window.hold = 'correct'; }); await action(page, 'Save correction').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'opener');
  assert.equal(await page.evaluate(() => pending[0].signal.aborted), true);
  await page.getByRole('button', { name: 'Open Mind' }).click(); await action(page, 'Correct').waitFor();
  await page.evaluate(() => pending[0].reject(Error('LATE PRIVATE FAILURE')));
  assert.doesNotMatch(await page.getByRole('dialog').innerText(), /LATE PRIVATE FAILURE/);
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'opener');
});

test('acknowledged correction followed by read failure cannot expose a stale mutation for replay', async t => {
  const page = await fixture(t); await action(page, 'Correct').click();
  await page.getByRole('textbox', { name: 'Knowledge name', exact: true }).fill('Saved home');
  await page.evaluate(() => { window.failAfterMutation = true; }); await action(page, 'Save correction').click();
  await page.getByRole('status').filter({ hasText: 'Correction saved. Could not refresh:' }).waitFor();
  assert.equal(await card(page).count(), 0); assert.equal(await page.getByRole('textbox').count(), 0);
  assert.equal((await mutationCalls(page)).length, 1);
  await page.evaluate(() => { window.fail = ''; }); await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByRole('heading', { name: 'Saved home', exact: true }).waitFor();
  assert.equal((await mutationCalls(page)).length, 1);
});

test('refresh preserves a conflicting correction draft and its original revision rather than overwriting newer data', async t => {
  const page = await fixture(t); await action(page, 'Correct').click();
  await page.getByRole('textbox', { name: 'Knowledge name', exact: true }).fill('My draft');
  await page.evaluate(() => { entries[0].revision = 4; entries[0].note = 'New observation'; });
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByText('This entry changed while you were editing.', { exact: false }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: 'Knowledge name', exact: true }).inputValue(), 'My draft');
  await action(page, 'Save correction').click(); await page.getByRole('status').filter({ hasText: 'Revision changed' }).waitFor();
  assert.equal((await mutationCalls(page))[0].expectedRevision, 3);
  assert.equal(await page.evaluate(() => entries[0].note), 'New observation');
  assert.equal(await page.getByRole('textbox', { name: 'Knowledge name', exact: true }).inputValue(), 'My draft');
});

test('owner rejection remains visible and dispose aborts reads without permitting future operations', async t => {
  const page = await fixture(t); await action(page, 'Correct').click();
  await page.evaluate(() => { window.fail = 'correct'; }); await action(page, 'Save correction').click();
  await page.getByRole('status').filter({ hasText: 'resident is reasoning' }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: 'Knowledge name', exact: true }).inputValue(), 'Home');
  await page.evaluate(() => { window.fail = ''; window.hold = 'list'; }); await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.evaluate(() => { mind.dispose(); mind.open({ key: 'local:other', name: 'Other' }); pending[0].reject(Error('LATE')); });
  assert.equal(await page.locator('dialog').count(), 0);
  assert.equal(await page.evaluate(() => pending[0].signal.aborted), true);
  assert.equal(await page.evaluate(() => calls.some(call => call.key === 'local:other')), false);
});

test('mobile Mind wraps hostile long text, keeps Done reachable and constrains scrolling to the dialog', async t => {
  const page = await fixture(t, { mobile: true });
  if (process.env.RESIDENT_MIND_SCREENSHOT_DIR) {
    await mkdir(process.env.RESIDENT_MIND_SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: join(process.env.RESIDENT_MIND_SCREENSHOT_DIR, 'resident-mind-mobile-overview.png') });
  }
  await page.evaluate(() => { entries[0].label = '<img src=x onerror=alert(1)>'.repeat(8); entries[0].note = 'Long words: ' + '模'.repeat(180); });
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByRole('heading', { name: '<img src=x', exact: false }).waitFor();
  assert.equal(await page.locator('img').count(), 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const bounds = await page.getByRole('dialog').boundingBox();
  assert.deepEqual(bounds, { x: 0, y: 0, width: 390, height: 844 });
  await action(page, 'Correct').click();
  const save = action(page, 'Save correction'); await save.scrollIntoViewIfNeeded(); assert.equal(await save.isVisible(), true);
  const done = await page.getByRole('button', { name: 'Done', exact: true }).boundingBox(); assert(done.y >= 0 && done.y + done.height < 100);
  assert.equal(await page.evaluate(() => document.querySelector('dialog').scrollWidth <= innerWidth), true);
  if (process.env.RESIDENT_MIND_SCREENSHOT_DIR) {
    await mkdir(process.env.RESIDENT_MIND_SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: join(process.env.RESIDENT_MIND_SCREENSHOT_DIR, 'resident-mind-mobile.png') });
  }
});

test('detached old controls cannot send a mutation for a different resident or steal the original return focus', async t => {
  const page = await fixture(t);
  await page.evaluate(() => {
    window.oldCorrect = document.querySelector('[data-knowledge-id="place-1"] button');
    mind.open({ key: 'local:second', name: 'Second' });
  });
  await page.getByRole('heading', { name: 'Mind · Second', exact: true }).waitFor();
  await page.getByRole('heading', { name: 'Home', exact: true }).waitFor();
  await page.evaluate(() => oldCorrect.click());
  assert.equal(await page.getByRole('textbox').count(), 0);
  assert.deepEqual(await mutationCalls(page), []);
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'opener');
});

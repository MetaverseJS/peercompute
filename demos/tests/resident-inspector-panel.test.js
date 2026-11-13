import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Controlled host projections validate presentation, authority boundaries and
// callback lifetimes. These tests do not claim inference or storage acceptance.
let server, browser, origin, cache;
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'resident-inspector-'));
  server = await createServer({ configFile: false, root: fileURLToPath(new URL('../../', import.meta.url)), cacheDir: cache,
    logLevel: 'error', optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'inspector-fixture', configureServer(vite) {
      vite.middlewares.use('/__inspector', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><style>*{margin:0}body{font:14px monospace;background:#081820;color:#cdf5ff}</style><button id="opener">Inspect resident</button>');
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
  page.setDefaultTimeout(6000); page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => { if (new URL(route.request().url()).origin === origin) return route.continue(); external.push(route.request().url()); return route.abort(); });
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []); });
  await page.goto(origin + '/__inspector');
  await page.evaluate(async shouldOpen => {
    const { createResidentInspectorPanel } = await import('/demos/shared/agents/ResidentInspectorPanel.js');
    window.local = { key: 'local:ada', name: 'Ada', local: true, revision: 7, ownerPeerId: 'peer-owner', worldId: 'test-world', status: 'thinking', position: [1, 2, 3],
      profile: { name: 'Ada', instructions: 'Be curious.', goals: ['Explore'], summary: 'Remember visitors.', appearancePrompt: 'A blue robot', movement: 'self-directed',
        localOnly: false, shared: true, respondToWorldChat: true, initiateConversations: true, autonomous: true,
        allowCloning: true, shareMemories: true, sharePrivateMemories: false, selfModifiable: true,
        standingGoal: { id: 'original-standing', enabled: true, objective: 'Greet new visitors.', target: 'new-players' } },
      runtime: { status: 'thinking', activity: 'Processing a world message', error: 'No route: waiting for an available model',
        worldChat: { status: 'waiting-for-model', reason: 'No available provider' }, ooda: 'waiting', social: 'busy', standing: 'observing', profile: 'updated', appearance: 'ready' },
      navigation: { key: 'local:ada', status: 'moving', type: 'follow', targetName: 'Owner', distance: 19, backend: 'webgpu', worker: true },
      memorySummary: { places: 2, people: 3, total: 5, episodes: 8 },
      routing: { mode: 'network-assisted', lastModelLabel: 'Nano · peer', candidates: [{ modelLabel: 'Qwen', kind: 'peer', peerId: 'provider' }] },
      objective: { goalId: 'goal-1', revision: 3, status: 'acting', objective: 'Return to our meeting spot.', currentStep: 'Move to saved point' },
      activity: [{ id: 'event-1', when: Date.now(), source: 'world-chat', stage: 'routing', status: 'waiting', severity: 'warning',
        message: 'No compatible model available', code: 'ERR_NO_ROUTE', operationId: 'op-1', messageId: 'message-1', details: { requestId: 'req-1', promptChars: 12, inputDigest: 'sha256:abc', prompt: 'NEVER_RENDER_PRIVATE_PROMPT' } }],
      permissions: { edit: true, memory: true, goals: true, resume: true, appearance: true, remove: true, clone: true } };
    window.peer = { key: 'peer:bea', name: 'Bea', local: false, ownerPeerId: 'remote-owner', worldId: 'test-world', status: 'idle', position: [3, 4, 5],
      profile: { ...local.profile, instructions: 'PRIVATE_PEER_INSTRUCTIONS' }, runtime: { error: 'PRIVATE_PEER_ERROR' },
      routing: { lastModelLabel: 'PRIVATE_PEER_MODEL' }, memorySummary: { total: 999 }, activity: [{ message: 'PRIVATE_PEER_LOG' }],
      objective: { ...local.objective, objective: 'PRIVATE_PEER_GOAL' }, permissions: { ...local.permissions } };
    window.records = { [local.key]: local, [peer.key]: peer }; window.calls = []; window.pending = []; window.worldKeys = 0;
    document.addEventListener('keydown', () => worldKeys++);
    const callback = kind => async input => {
      calls.push({ kind, ...input });
      if (window.hold === kind) return new Promise((resolve, reject) => pending.push({ kind, resolve, reject, signal: input.signal }));
      if (window.fail === kind) throw Error(kind === 'edit' ? 'Owner changed: revision conflict' : 'Host is unavailable');
      if (kind === 'read') return structuredClone(records[input.key]);
      if (kind === 'edit') {
        const record = records[input.key];
        if (record.revision !== input.expectedRevision) throw Error('Owner changed: revision conflict');
        Object.assign(record.profile, input.patch); record.name = record.profile.name; record.revision++;
        if (window.failRefreshAfterSave) window.fail = 'read';
      }
    };
    window.inspector = createResidentInspectorPanel({ onRead: callback('read'), onEdit: callback('edit'), onMind: callback('mind'),
      onAssignGoal: callback('assign'), onPauseGoal: callback('pause-goal'), onResumeGoal: callback('resume-goal'), onCancelGoal: callback('cancel-goal'),
      onResume: callback('resume'), onAppearance: callback('appearance'), onRemove: callback('remove'), onClone: callback('clone') });
    document.querySelector('#opener').onclick = () => inspector.open({ key: local.key, name: local.name, returnFocus: document.querySelector('#opener') });
    if (shouldOpen) document.querySelector('#opener').click();
  }, open);
  if (open) await page.getByText('No route: waiting for an available model', { exact: true }).waitFor();
  return page;
}
const tab = (page, name) => page.getByRole('tab', { name, exact: true });
const modal = page => page.getByRole('dialog', { name: /^Resident ·/ });
const action = (page, name) => modal(page).getByRole('button', { name, exact: true });
const calls = (page, kind) => page.evaluate(kind => window.calls.filter(call => call.kind === kind).map(({ signal, ...call }) => call), kind);
async function group(page, name) { await tab(page, 'Profile').click(); const summary = page.locator('summary').filter({ hasText: name }); if (!await summary.evaluate(node => node.parentElement.open)) await summary.click(); }

test('owner inspection exposes current failure, routing, movement and memory without starting work', async t => {
  const page = await fixture(t);
  assert.match(await modal(page).innerText(), /waiting-for-model · No available provider/);
  assert.match(await modal(page).innerText(), /Nano · peer/);
  await page.getByLabel('Movement details for Ada').click(); assert.match(await modal(page).innerText(), /WebGPU · managed worker/);
  await tab(page, 'Goals & memory').click(); assert.match(await modal(page).innerText(), /2 places · 3 people · 5 knowledge entries · 8 episodes/);
  assert.equal(await action(page, 'Open Mind').isEnabled(), true);
  await action(page, 'Open Mind').click(); assert.equal((await calls(page, 'mind'))[0].key, 'local:ada');
  assert.equal(await page.evaluate(() => calls.find(call => call.kind === 'mind').returnFocus.textContent), 'Open Mind');
  assert.deepEqual(await page.evaluate(() => calls.filter(call => !['read', 'mind'].includes(call.kind))), []);
  await tab(page, 'Profile').click(); assert.equal(await page.getByRole('textbox', { name: 'Resident name', exact: true }).isEnabled(), true);
});

test('peer view ignores injected private data and owner permissions but allows explicitly offered cloning', async t => {
  const page = await fixture(t);
  await page.evaluate(() => inspector.open({ key: peer.key, name: peer.name })); await page.getByRole('heading', { name: 'Resident · Bea' }).waitFor();
  for (const name of ['Overview', 'Profile', 'Goals & memory', 'Activity']) {
    await tab(page, name).click(); assert.doesNotMatch(await modal(page).textContent(), /PRIVATE_PEER|999/);
  }
  assert.equal(await modal(page).getByRole('textbox').count(), 0);
  await tab(page, 'Overview').click();
  assert.equal(await action(page, 'Resume').count(), 0); assert.equal(await action(page, 'Remove body').count(), 0);
  await action(page, 'Clone to this device').click(); assert.equal((await calls(page, 'clone'))[0].key, 'peer:bea');
  assert.deepEqual(await calls(page, 'mind'), []);
});

test('dirty profile, caret and captured revision survive refresh, and a conflict preserves the draft', async t => {
  const page = await fixture(t); await tab(page, 'Profile').click();
  const name = page.getByRole('textbox', { name: 'Resident name', exact: true }); await name.fill('Ada owner draft');
  await name.evaluate(element => element.setSelectionRange(3, 8));
  await page.evaluate(async () => { local.revision = 8; local.profile.name = 'Ada self edit'; local.name = 'Ada self edit'; await inspector.refresh(); });
  assert.equal(await name.inputValue(), 'Ada owner draft');
  assert.deepEqual(await name.evaluate(element => [element.selectionStart, element.selectionEnd, document.activeElement === element]), [3, 8, true]);
  await action(page, 'Save changes').click(); await page.getByText('Owner changed: revision conflict', { exact: true }).first().waitFor();
  assert.deepEqual(await calls(page, 'edit'), [{ kind: 'edit', key: 'local:ada', expectedRevision: 7, patch: { name: 'Ada owner draft' } }]);
  assert.equal(await name.inputValue(), 'Ada owner draft');
  await action(page, 'Discard draft').click(); assert.equal(await name.inputValue(), 'Ada self edit');
});

test('profile edits send only changed fields, including context summary, without resetting consent', async t => {
  const page = await fixture(t); await tab(page, 'Profile').click();
  await page.getByRole('textbox', { name: 'Persistent context summary', exact: true }).fill('Owner-supplied context.');
  await action(page, 'Save changes').click(); await page.getByText('Resident saved.', { exact: true }).waitFor();
  assert.deepEqual(await calls(page, 'edit'), [{ kind: 'edit', key: 'local:ada', expectedRevision: 7, patch: { summary: 'Owner-supplied context.' } }]);
  assert.equal(await action(page, 'Save changes').isDisabled(), true);
});

test('history sharing controls make consent changes explicit and clear a revoked private-sharing prerequisite', async t => {
  const page = await fixture(t); await group(page, 'Sharing and cloning');
  await page.getByRole('checkbox', { name: 'Include private conversations', exact: true }).check();
  await action(page, 'Save changes').click(); await page.waitForFunction(() => local.revision === 8);
  assert.deepEqual((await calls(page, 'edit'))[0].patch, { sharePrivateMemories: true });
  await page.getByRole('checkbox', { name: 'Let peers talk to this resident', exact: true }).uncheck();
  assert.equal(await page.getByRole('checkbox', { name: 'Include private conversations', exact: true }).isChecked(), false);
  assert.equal(await page.getByRole('checkbox', { name: 'Include private conversations', exact: true }).isDisabled(), true);
  await action(page, 'Save changes').click(); await page.waitForFunction(() => local.revision === 9);
  assert.deepEqual((await calls(page, 'edit'))[1].patch, { shared: false, sharePrivateMemories: false });
});

test('standing goal edits preserve identity and validate enabled objectives and UTF-8 lengths', async t => {
  const page = await fixture(t); await group(page, 'Standing social goal');
  const objective = page.getByRole('textbox', { name: 'Standing social objective', exact: true });
  await objective.fill(''); assert.equal(await action(page, 'Save changes').isDisabled(), true);
  await objective.fill('🙂'.repeat(600)); assert.equal(await action(page, 'Save changes').isDisabled(), true);
  await objective.fill('Tell visitors about this world.'); await action(page, 'Save changes').click();
  await page.waitForFunction(() => local.revision === 8);
  assert.deepEqual((await calls(page, 'edit'))[0].patch, { standingGoal: { id: 'original-standing', enabled: true, objective: 'Tell visitors about this world.', target: 'new-players' } });
  const name = page.getByRole('textbox', { name: 'Resident name', exact: true }); await name.fill('🙂'.repeat(61));
  assert.equal(await action(page, 'Save changes').isDisabled(), true);
});

test('acknowledged edit followed by read failure cannot replay a stale write', async t => {
  const page = await fixture(t); await tab(page, 'Profile').click(); await page.getByRole('textbox', { name: 'Resident name', exact: true }).fill('Renamed');
  await page.evaluate(() => window.failRefreshAfterSave = true); await action(page, 'Save changes').click();
  await page.getByText('Host is unavailable', { exact: true }).waitFor();
  assert.equal(await action(page, 'Save changes').isDisabled(), true); assert.equal((await calls(page, 'edit')).length, 1);
  await page.evaluate(async () => { window.fail = null; await inspector.refresh(); });
  assert.equal(await page.getByRole('textbox', { name: 'Resident name', exact: true }).inputValue(), 'Renamed');
  assert.equal(await action(page, 'Save changes').isDisabled(), true);
});

test('goal actions carry the actual goal revision and owner-only controls disappear on ownership loss', async t => {
  const page = await fixture(t); await tab(page, 'Goals & memory').click();
  await action(page, 'Pause objective for Ada').click();
  assert.deepEqual((await calls(page, 'pause-goal'))[0], { kind: 'pause-goal', key: 'local:ada', goalId: 'goal-1', expectedRevision: 3 });
  await page.evaluate(async () => { local.local = false; await inspector.refresh(); });
  assert.equal(await action(page, 'Open Mind').count(), 0); assert.equal(await action(page, 'Pause objective for Ada').count(), 0);
  assert.doesNotMatch(await modal(page).textContent(), /Return to our meeting spot|No route: waiting|Be curious/);
});

test('activity is bounded, filterable, escaped and does not render prompt transcript fields', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => { local.activity = Array.from({ length: 130 }, (_, index) => ({ ...local.activity[0],
    id: `event-${index}`, source: index % 2 ? 'world-chat' : 'inference', message: `<img src=x onerror=alert(1)> ${index}`, details: { prompt: 'SECRET_TRANSCRIPT', inputDigest: `digest-${index}` } })); await inspector.refresh(); });
  await tab(page, 'Activity').click(); const log = page.getByRole('list', { name: 'Recent resident activity' });
  assert.equal(await log.locator(':scope > li').count(), 100); assert.equal(await log.locator('img').count(), 0);
  assert.doesNotMatch(await log.textContent(), /SECRET_TRANSCRIPT/);
  await page.getByRole('combobox', { name: 'Activity source', exact: true }).selectOption('inference');
  assert.equal(await log.locator(':scope > li').count(), 50);
  await log.locator('summary').first().click();
  const id = await log.locator('details[open]').first().getAttribute('data-event-id'); await page.evaluate(() => inspector.refresh());
  assert.equal(await log.locator('details[open]').getAttribute('data-event-id'), id);
});

test('activity exposes stored context budgets, retry state and error codes without requiring a model label', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    local.activity = [{ id: 'budget-event', when: Date.now(), source: 'inference', stage: 'admission', status: 'failed',
      errorCode: 'ERR_MODEL_CONTEXT_BUDGET', message: 'The request exceeds this model’s context budget.',
      route: { manifestCid: 'bafkreimodel', kind: 'peer' }, details: { requiredTokens: 1900, contextLength: 2048, maxNewTokens: 512,
        contextBytes: 5000, messageCount: 4, outputChars: 0, attempt: 2, nextAt: 1794530000000, pauseCause: 'automatic',
        committed: false, outputStarted: false, queueDepth: 3, durationMs: 120 } }];
    await inspector.refresh();
  });
  await tab(page, 'Activity').click(); const log = page.getByRole('list', { name: 'Recent resident activity' });
  await log.getByText('Diagnostic details', { exact: true }).click();
  const entries = await log.locator('dl').evaluate(element => Object.fromEntries([...element.querySelectorAll('dt')].map(term => [term.textContent, term.nextElementSibling.textContent])));
  assert.equal(entries.Code, 'ERR_MODEL_CONTEXT_BUDGET'); assert.equal(entries.Route, 'bafkreimodel · peer');
  assert.equal(entries['Required tokens'], '1900'); assert.equal(entries['Context capacity'], '2048'); assert.equal(entries['Output token allowance'], '512');
  assert.equal(entries['Context bytes'], '5000'); assert.equal(entries.Messages, '4'); assert.equal(entries['Output characters'], '0');
  assert.equal(entries.Attempt, '2'); assert.equal(entries['Next attempt'], '1794530000000'); assert.equal(entries['Pause cause'], 'automatic');
  assert.equal(entries['Request committed'], 'false'); assert.equal(entries['Output started'], 'false');
  assert.equal(entries['Queue depth'], '3'); assert.equal(entries['Duration (ms)'], '120');
});

test('switching residents ignores late reads and closing aborts a pending mutation without leaking errors', async t => {
  const page = await fixture(t); await page.evaluate(() => { window.hold = 'read'; void inspector.refresh(); });
  await page.waitForFunction(() => pending.length === 1);
  await page.evaluate(() => { window.hold = null; inspector.open({ key: peer.key, name: peer.name }); pending[0].resolve({ ...local, name: 'WRONG RESIDENT' }); });
  await page.getByRole('heading', { name: 'Resident · Bea' }).waitFor(); assert.equal(await page.evaluate(() => pending[0].signal.aborted), true);
  assert.doesNotMatch(await modal(page).textContent(), /WRONG RESIDENT/);
  await page.evaluate(() => inspector.open({ key: local.key, name: local.name })); await tab(page, 'Profile').click();
  await page.getByRole('textbox', { name: 'Resident name', exact: true }).fill('Pending name'); await page.evaluate(() => window.hold = 'edit');
  await action(page, 'Save changes').click(); await action(page, 'Done').click();
  assert.equal(await page.evaluate(() => pending.at(-1).signal.aborted), true);
  await page.evaluate(() => { window.hold = null; inspector.open({ key: peer.key, name: peer.name }); pending.at(-1).reject(Error('OLD_ERROR')); });
  await page.getByRole('heading', { name: 'Resident · Bea' }).waitFor(); assert.doesNotMatch(await modal(page).textContent(), /OLD_ERROR|Pending name/);
});

test('a pre-mutation read cannot overwrite the snapshot acknowledged by a successful edit', async t => {
  const page = await fixture(t); await tab(page, 'Profile').click(); await page.getByRole('textbox', { name: 'Resident name', exact: true }).fill('Saved current name');
  await page.evaluate(() => { window.stale = structuredClone(local); window.hold = 'read'; void inspector.refresh(); });
  await page.waitForFunction(() => pending.length === 1); await action(page, 'Save changes').click(); await page.waitForFunction(() => local.revision === 8);
  await page.evaluate(() => { window.hold = null; pending[0].resolve(stale); });
  await page.getByRole('heading', { name: 'Resident · Saved current name' }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: 'Resident name', exact: true }).inputValue(), 'Saved current name');
});

test('tabs support keyboard navigation, world keys are isolated, and Escape restores the opener', async t => {
  const page = await fixture(t); await tab(page, 'Overview').focus();
  await page.keyboard.press('ArrowRight'); assert.equal(await tab(page, 'Profile').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('End'); assert.equal(await tab(page, 'Activity').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home'); assert.equal(await tab(page, 'Overview').getAttribute('aria-selected'), 'true');
  assert.equal(await page.evaluate(() => worldKeys), 0); await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'opener');
  assert.equal(await page.evaluate(() => inspector.selectedKey), '');
});

test('polling stops when the inspector closes and disposal prevents later reads', async t => {
  const page = await fixture(t); const first = (await calls(page, 'read')).length;
  await page.waitForFunction(first => calls.filter(call => call.kind === 'read').length > first, first);
  await action(page, 'Done').click(); const count = (await calls(page, 'read')).length;
  await page.waitForTimeout(2150); assert.equal((await calls(page, 'read')).length, count);
  await page.evaluate(() => { inspector.dispose(); inspector.open({ key: local.key }); void inspector.refresh(); });
  assert.equal((await calls(page, 'read')).length, count); assert.equal(await page.locator('dialog').count(), 0);
});

test('body removal requires confirmation, sends once, and closes without refetching a removed body', async t => {
  const page = await fixture(t); await action(page, 'Remove body').click();
  assert.deepEqual(await calls(page, 'remove'), []);
  await page.getByText('Remove this body from the world? Its saved identity and conversation history remain.', { exact: true }).waitFor();
  await action(page, 'Keep body').click(); assert.deepEqual(await calls(page, 'remove'), []);
  await action(page, 'Remove body').click();
  await page.locator('.pc-resident-inspector__confirmation').getByRole('button', { name: 'Remove body', exact: true }).click();
  await modal(page).waitFor({ state: 'hidden' }); assert.equal((await calls(page, 'remove')).length, 1);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'opener');
});

test('desktop and mobile inspector layout keeps Done visible and confines long content to its scroll area', async t => {
  const page = await fixture(t, { mobile: true });
  await page.evaluate(async () => { local.name = 'Resident'.repeat(30); local.runtime.error = 'Diagnostic'.repeat(80); await inspector.refresh(); });
  await tab(page, 'Activity').click();
  const bounds = await modal(page).evaluate(element => { const box = element.getBoundingClientRect(), header = element.querySelector('header').getBoundingClientRect();
    return { x: box.x, y: box.y, right: box.right, bottom: box.bottom, width: innerWidth, height: innerHeight, headerBottom: header.bottom,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth }; });
  assert.equal(bounds.x, 0); assert.equal(bounds.y, 0); assert.equal(bounds.right, bounds.width); assert.equal(bounds.bottom, bounds.height);
  assert.equal(bounds.horizontalOverflow, false); assert.ok(bounds.headerBottom < bounds.height);
  assert.ok(bounds.headerBottom < 150, 'a long name must not consume the mobile viewport');
  const done = await action(page, 'Done').evaluate(element => { const box = element.getBoundingClientRect(); return { width: box.width, right: box.right, screen: innerWidth }; });
  assert.ok(done.width >= 50); assert.ok(done.right <= done.screen);
  const output = process.env.RESIDENT_INSPECTOR_SCREENSHOT_DIR;
  if (output) { await mkdir(output, { recursive: true }); await page.screenshot({ path: join(output, 'resident-inspector-mobile.png') }); }
  await page.setViewportSize({ width: 1200, height: 900 });
  const desktop = await modal(page).evaluate(element => { const box = element.getBoundingClientRect(); return { left: box.left, right: box.right, width: innerWidth }; });
  assert.ok(desktop.left > 0); assert.ok(Math.abs(desktop.left - (desktop.width - desktop.right)) < 2);
  if (output) await page.screenshot({ path: join(output, 'resident-inspector-desktop.png') });
});

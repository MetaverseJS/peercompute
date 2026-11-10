import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Presentation only: controlled host callbacks; no model, storage, physics or network is claimed.
let server, browser, origin, cache;
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'resident-goal-ui-'));
  server = await createServer({ configFile: false, root: fileURLToPath(new URL('../../', import.meta.url)), cacheDir: cache,
    logLevel: 'error', optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'goal-controls-fixture', configureServer(vite) {
      vite.middlewares.use('/__goals', (_request, response) => { response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><style>body{font:14px monospace}textarea,button{font:inherit;max-width:100%;box-sizing:border-box}button{min-height:40px}details{max-width:600px}</style>'); });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu', '--disable-webgpu'] });
});
after(async () => { try { await browser?.close(); } finally { await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); } });
async function fixture(t, mobile = false) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1200, height: 900 } });
  const page = await context.newPage(), errors = [], external = []; page.setDefaultTimeout(5000);
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => { if (new URL(route.request().url()).origin === origin) return route.continue(); external.push(route.request().url()); return route.abort(); });
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []); });
  await page.goto(origin + '/__goals');
  await page.evaluate(async () => {
    const { createResidentGoalControls } = await import('/demos/shared/agents/ResidentGoalControls.js');
    window.calls = []; window.pending = {};
    const callback = kind => async input => { calls.push({ kind, input });
      if (window.hold === kind) await new Promise((resolve, reject) => { pending[kind] = { resolve, reject }; });
      if (window.fail === kind) throw Error('Controlled save failure'); };
    window.controls = createResidentGoalControls({ key: 'local:ada', name: 'Ada',
      onAssignGoal: callback('assign'), onPauseGoal: callback('pause'), onResumeGoal: callback('resume'), onCancelGoal: callback('cancel') });
    document.body.append(controls.element); controls.element.open = true;
    window.snapshot = { goalId: 'goal-1', revision: 3, objective: 'Approach the visitor, then stop.', status: 'planning', currentStep: 'Considering the nearby visitor', lastReceipt: null };
  });
  return page;
}
const objective = page => page.getByRole('textbox', { name: 'Objective for Ada', exact: true });
const action = (page, label) => page.getByRole('button', { name: `${label} objective for Ada`, exact: true });

test('owner explicitly starts a bounded objective once and failed saving preserves its draft', async t => {
  const page = await fixture(t), input = objective(page);
  assert.equal(await action(page, 'Start').isEnabled(), false);
  await input.fill('  Walk to the visitor.  '); assert.deepEqual(await page.evaluate(() => calls), []);
  await page.evaluate(() => { window.hold = 'assign'; }); await action(page, 'Start').click();
  assert.equal(await action(page, 'Start').isEnabled(), false);
  await page.evaluate(() => document.querySelector('form').requestSubmit());
  assert.deepEqual(await page.evaluate(() => calls), [{ kind: 'assign', input: { key: 'local:ada', objective: 'Walk to the visitor.' } }]);
  await page.evaluate(() => pending.assign.reject(Error('Storage unavailable')));
  await action(page, 'Start').waitFor({ state: 'visible' }); await page.waitForFunction(() => !document.querySelector('button').disabled);
  assert.equal(await input.inputValue(), '  Walk to the visitor.  '); assert.match(await page.locator('body').innerText(), /Storage unavailable/);
  await input.fill('🙂'.repeat(300)); assert.equal(await input.getAttribute('aria-invalid'), 'true');
  assert.equal(await action(page, 'Start').isEnabled(), false); assert.match(await page.locator('body').innerText(), /Shorten/);
});

test('phase controls use current goal and revision while planning or acting, with no implicit restart', async t => {
  const page = await fixture(t); await page.evaluate(() => controls.setStatus(snapshot));
  assert.equal(await objective(page).isVisible(), false); assert.equal(await action(page, 'Start').isVisible(), false);
  await action(page, 'Pause').click();
  assert.deepEqual(await page.evaluate(() => calls.at(-1)), { kind: 'pause', input: { key: 'local:ada', goalId: 'goal-1', expectedRevision: 3 } });
  await page.evaluate(() => controls.setStatus({ ...snapshot, revision: 4, status: 'acting' }));
  await action(page, 'Cancel').click();
  assert.deepEqual(await page.evaluate(() => calls.at(-1)), { kind: 'cancel', input: { key: 'local:ada', goalId: 'goal-1', expectedRevision: 4 } });
  await page.evaluate(() => controls.setStatus({ ...snapshot, revision: 5, status: 'paused', reason: 'Reloaded; inspect progress before resuming.' }));
  assert.equal(await action(page, 'Pause').isVisible(), false); await action(page, 'Resume').click();
  assert.deepEqual(await page.evaluate(() => calls.at(-1)), { kind: 'resume', input: { key: 'local:ada', goalId: 'goal-1', expectedRevision: 5 } });
  assert.equal(await page.evaluate(() => calls.some(call => call.kind === 'assign')), false);
});

test('stale revisions are ignored and clearing state preserves a dirty objective draft', async t => {
  const page = await fixture(t), input = objective(page); await input.fill('My unfinished draft');
  await page.evaluate(() => {
    controls.setStatus(snapshot); controls.setStatus({ ...snapshot, revision: 6, status: 'paused', currentStep: 'Current step' });
    controls.setStatus({ ...snapshot, revision: 4, status: 'acting', currentStep: 'STALE_STEP' });
  });
  assert.equal(await page.locator('[data-goal-field="step"]').innerText(), 'Current step');
  assert.equal(await action(page, 'Resume').isVisible(), true);
  await page.evaluate(() => controls.setStatus(null));
  assert.equal(await input.inputValue(), 'My unfinished draft'); assert.equal(await action(page, 'Start').isEnabled(), true);
  assert.equal(await page.locator('[data-goal-field="receipt"]').innerText(), 'No physical result yet');
});

test('completed status distinguishes model assessment from verified physical outcome and allows a fresh objective', async t => {
  const page = await fixture(t); await page.evaluate(() => controls.setStatus({ ...snapshot, status: 'completed',
    currentStep: 'Finished considering the scene', modelAssessment: 'I think this satisfies the objective.',
    lastReceipt: { requestId: 'physical-1', type: 'approach', status: 'arrived', at: Date.now() } }));
  assert.equal(await page.locator('[data-goal-field="status"]').innerText(), 'Complete · model assessment');
  assert.equal(await page.locator('[data-goal-field="receipt"]').innerText(), 'Approach · Reached stopping distance');
  assert.equal(await page.locator('[data-goal-field="assessment"]').innerText(), 'I think this satisfies the objective.');
  assert.equal(await action(page, 'Start').isEnabled(), true); assert.equal(await action(page, 'Cancel').isVisible(), false);
  await objective(page).fill('A different objective'); await action(page, 'Start').click();
  assert.equal(await page.evaluate(() => calls.at(-1).input.objective), 'A different objective');
});

test('disabled and disposed controls cannot invoke the host and late failure cannot recreate UI', async t => {
  const page = await fixture(t); await page.evaluate(() => { controls.setStatus(snapshot); controls.setEnabled(false); });
  assert.equal(await action(page, 'Pause').isEnabled(), false);
  await page.evaluate(() => document.querySelector('[aria-label="Pause objective for Ada"]').onclick());
  assert.deepEqual(await page.evaluate(() => calls), []);
  await page.evaluate(() => { controls.setEnabled(true); window.hold = 'cancel'; }); await action(page, 'Cancel').click();
  await page.evaluate(() => { controls.dispose(); controls.setStatus(snapshot); pending.cancel.reject(Error('Late failure')); });
  await page.waitForTimeout(20); assert.equal(await page.locator('[data-resident-goal]').count(), 0);
  assert.equal(await page.evaluate(() => calls.length), 1);
});

test('mobile controls wrap bounded untrusted text and reject unsupported receipt claims', async t => {
  const page = await fixture(t, true); await page.evaluate(() => controls.setStatus({ ...snapshot, status: 'paused',
    objective: '<img src=x onerror=alert(1)>'.repeat(100), currentStep: 'x'.repeat(1000), reason: '<script>unsafe()</script>'.repeat(100),
    lastReceipt: { type: 'teleport', status: 'arrived' } }));
  assert.equal(await page.locator('img,script[src=x]').count(), 0);
  assert((await page.locator('[data-goal-field="step"]').innerText()).length <= 240);
  assert((await page.locator('[data-goal-field="reason"]').innerText()).length <= 512);
  assert.equal(await page.locator('[data-goal-field="receipt"]').innerText(), 'No physical result yet');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
});


test('saved multiline objectives rehydrate without changing their text and never resume by rendering', async t => {
  const page = await fixture(t);
  const saved = 'Approach the visitor.\nThen look at them and stop.';
  await page.evaluate(saved => controls.setStatus({ ...snapshot, status: 'paused', objective: saved }), saved);
  assert.equal(await page.locator('[data-goal-field="objective"]').textContent(), saved);
  assert.deepEqual(await page.evaluate(() => calls), []);
  await page.evaluate(() => controls.setStatus(null));
  assert.equal(await objective(page).inputValue(), saved);
});

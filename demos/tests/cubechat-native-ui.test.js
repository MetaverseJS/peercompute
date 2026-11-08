import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Native presentation/input tests with controlled host callbacks. No model,
// network transport, microphone or physics inference is simulated as real work.
let server, browser, origin, cache;
before(async () => {
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  cache = await mkdtemp(join(tmpdir(), 'cube-native-ui-'));
  server = await createServer({ configFile: false, root: repo, cacheDir: cache, logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [{ name: 'cube-native-ui-fixture', configureServer(vite) {
      vite.middlewares.use('/__cube_native_ui', (_req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><div id="app"><div id="scene-container"><canvas width="900" height="700" tabindex="0" aria-label="World"></canvas></div></div><button id="outside" style="position:fixed;right:8px;top:8px">Outside action</button>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu', '--disable-webgpu'] });
});
after(async () => {
  try { await browser?.close(); } finally { await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); }
});
async function fixture(t, { mobile = false, enabled = true } = {}) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1200, height: 900 }, hasTouch: mobile });
  const page = await context.newPage(), errors = [], external = [];
  page.setDefaultTimeout(5000); page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []); });
  await page.goto(origin + '/__cube_native_ui');
  await page.evaluate(async ({ enabled, mobile }) => {
    await import('/demos/cubechat/src/style.css');
    const { createCubeWorldUi } = await import('/demos/cubechat/src/ui/CubeWorldUi.js');
    const { PlayerController } = await import('/demos/cubechat/src/controls/input.js');
    window.calls = []; window.player = new PlayerController(); if (mobile) player.setMobileMode(true);
    window.residents = [
      { key: 'local:ada', agentId: 'ada', local: true, name: 'Ada', status: 'idle' },
      { key: 'peer:remote', agentId: 'remote', local: false, name: 'Peer resident', status: 'idle' },
      { key: 'local:paused', agentId: 'paused', local: true, name: 'Paused resident', status: 'paused', recoveryRequired: true }
    ];
    window.pending = {};
    const hold = key => new Promise((resolve, reject) => { pending[key] = { resolve, reject }; });
    window.ui = createCubeWorldUi({ roomLabel: 'Test room',
      onOpen() { calls.push({ type: 'open' }); player.clearInput(); },
      onSelect: async key => { calls.push({ type: 'select', key }); ui.open(); ui.select(residents.find(row => row.key === key)); ui.setMessages([{ role: 'assistant', text: 'Saved ' + key }]); },
      onRoomSend: async ({ text }, { signal }) => {
        calls.push({ type: 'room-send', text }); if (window.failRoom) throw Error('Room delivery failed');
        if (window.holdRoom) {
          window.roomSignal = signal;
          await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
          calls.push({ type: 'room-aborted' });
          if (window.holdRoomCleanup) await hold('room-cleanup');
          if (window.resolveCancelledRoom) return { delivery: { cancelled: true, delivered: 1, total: 2 } };
          signal.throwIfAborted();
        }
        ui.appendRoomMessage({ id: 'own-' + calls.length, peerId: 'owner-peer', name: 'Me', text });
        ui.setRoomStatus('Delivered to 1 player.');
      },
      onSend: async input => {
        calls.push({ type: 'agent-send', ...input }); ui.setBusy(true);
        ui.setMessages([{ role: 'user', text: input.text }]);
        try { if (window.holdReply) await hold('reply'); ui.setMessages([{ role: 'user', text: input.text }, { role: 'assistant', text: 'Controlled reply' }]); }
        finally { ui.setBusy(false); }
      },
      onCancel: async () => {
        calls.push({ type: 'cancel' }); if (window.failCancel) throw Error('Cleanup incomplete');
        if (window.holdCancel) await hold('cancel');
        pending.reply?.reject(new DOMException('Cancelled', 'AbortError')); delete pending.reply;
        pending.record?.resolve(); delete pending.record;
        ui.setBusy(false); ui.setVoiceStatus({ enabled: true, preparing: false, recording: false });
      },
      onClose: async () => {
        calls.push({ type: 'close' }); if (window.holdClose) await hold('close');
        pending.reply?.reject(new DOMException('Cancelled', 'AbortError')); delete pending.reply; ui.setBusy(false);
      },
      onSpawn: async input => {
        calls.push({ type: 'spawn', input }); const agent = { key: 'local:new', agentId: 'new', local: true, name: input.name, status: 'idle' };
        residents.push(agent); ui.setAgents(residents); ui.open(); ui.select(agent); ui.setMessages([]);
      },
      onMovement: async input => { calls.push({ type: 'movement', ...input }); },
      onRemove: async key => { calls.push({ type: 'remove', key }); residents = residents.filter(row => row.key !== key); ui.setAgents(residents); },
      onResume: async key => { calls.push({ type: 'resume', key }); residents = residents.map(row => row.key === key ? { ...row, status: 'idle', recoveryRequired: false } : row); ui.setAgents(residents); },
      onPlayerCaption: text => calls.push({ type: 'caption', text }),
      onModels: async () => { calls.push({ type: 'models' }); },
      onVoice: async enabled => { calls.push({ type: 'voice', enabled }); if (window.holdVoice) await hold('voice'); ui.setVoiceStatus({ enabled, preparing: false, recording: false }); },
      onRecord: async input => {
        calls.push({ type: 'record', ...input });
        if (input.recording) { if (!window.holdPermission) ui.setVoiceStatus({ enabled: true, recording: true }); await hold('record'); }
        else { pending.record?.resolve(); delete pending.record; ui.setVoiceStatus({ enabled: true, recording: false }); }
      }
    });
    ui.setAgents(residents); ui.setEnabled(enabled);
    window.canvasEnters = 0; document.querySelector('canvas').addEventListener('keydown', event => { if (event.key === 'Enter') canvasEnters++; });
    window.outsideClicks = 0; document.querySelector('#outside').onclick = () => outsideClicks++;
  }, { enabled, mobile });
  return page;
}
const prompt = page => page.getByRole('textbox', { name: 'World message', exact: true });
const target = page => page.getByRole('combobox', { name: 'Chat with', exact: true });
const transcript = page => page.getByRole('log', { name: 'World conversation', exact: true });
async function openChat(page) { await page.getByRole('button', { name: /^Chat ·/ }).click(); }
async function selectAgent(page, key = 'local:ada') { await target(page).selectOption(key); await page.waitForFunction(key => ui.getTarget() === key && !document.querySelector('[aria-label="World message"]').disabled, key); }

test('world Enter opens one composer before canvas picking, clears movement, and respects startup/native button focus', async t => {
  const page = await fixture(t, { enabled: false });
  await page.locator('canvas').focus(); await page.keyboard.press('Enter');
  assert.equal(await prompt(page).isVisible(), false);
  await page.evaluate(() => { ui.setEnabled(true); player.keys.w = true; });
  const before = await page.evaluate(() => canvasEnters);
  await page.keyboard.press('Enter'); await prompt(page).waitFor({ state: 'visible' });
  assert.equal(await page.evaluate(() => canvasEnters), before);
  assert.equal(await prompt(page).evaluate(element => document.activeElement === element), true);
  assert.deepEqual(await page.evaluate(() => player.getMovementInput()), { forward: 0, strafe: 0 });
  await prompt(page).fill('wasd draft');
  assert.deepEqual(await page.evaluate(() => player.getMovementInput()), { forward: 0, strafe: 0 });
  await page.keyboard.press('Escape'); await prompt(page).waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Outside action', exact: true }).focus(); await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => outsideClicks), 1); assert.equal(await prompt(page).isVisible(), false);
  await page.locator('canvas').focus(); await page.keyboard.press('Enter'); assert.equal(await prompt(page).inputValue(), 'wasd draft');
});

test('Room sends native Enter/ShiftEnter text, keeps failed drafts, validates bytes and renders bounded plain-text authenticated metadata', async t => {
  const page = await fixture(t); await openChat(page);
  await prompt(page).fill('hello'); await page.keyboard.press('Shift+Enter'); await page.keyboard.type('world'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => calls.some(call => call.type === 'room-send'));
  assert.equal((await page.evaluate(() => calls.find(call => call.type === 'room-send'))).text, 'hello\nworld');
  await page.waitForFunction(() => document.querySelector('[aria-label="World message"]').value === '');
  await page.evaluate(() => { failRoom = true; }); await prompt(page).fill('keep this'); await page.keyboard.press('Enter');
  await page.getByRole('status').filter({ hasText: 'Room delivery failed' }).first().waitFor();
  assert.equal(await prompt(page).inputValue(), 'keep this');
  await page.evaluate(() => { failRoom = false; }); await prompt(page).fill('界'.repeat(700)); await page.keyboard.press('Enter');
  assert.match(await page.locator('.cube-native-chat .cube-native-status').innerText(), /2048 UTF-8/);
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'room-send').length), 2);
  await page.evaluate(() => {
    const message = { id: 'remote-1', peerId: 'authenticated-peer', name: '<img src=x>', text: '<script>window.BAD=true</script>' };
    ui.appendRoomMessage(message); ui.appendRoomMessage(message);
  });
  const row = transcript(page).locator('[data-message-id="remote-1"]');
  assert.equal(await row.count(), 1); assert.equal(await row.getAttribute('data-peer-id'), 'authenticated-peer');
  assert.match(await row.innerText(), /<script>/); assert.equal(await row.locator('img,script').count(), 0);
  assert.equal(await page.evaluate(() => Boolean(window.BAD)), false);
});

test('Room and resident drafts/history stay separate and private captions never use Room transport', async t => {
  const page = await fixture(t); await openChat(page); await prompt(page).fill('room draft');
  await page.evaluate(() => ui.appendRoomMessage({ id: 'room', peerId: 'human', name: 'Human', text: 'Room history' }));
  await selectAgent(page); assert.match(await transcript(page).innerText(), /Saved local:ada/);
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'caption').length), 0, 'Restoring a saved conversation must not speak old text');
  await prompt(page).fill('private question'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => calls.some(call => call.type === 'caption'));
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'room-send').length), 0);
  assert.equal((await page.evaluate(() => calls.find(call => call.type === 'caption'))).text, 'private question');
  await prompt(page).fill('agent draft'); await target(page).selectOption('room');
  await page.waitForFunction(() => ui.getTarget() === 'room');
  assert.equal(await prompt(page).inputValue(), 'room draft'); assert.match(await transcript(page).innerText(), /Room history/);
  assert.doesNotMatch(await transcript(page).innerText(), /private question|Controlled reply/);
  await page.evaluate(() => ui.setMessages([{ role: 'assistant', text: 'Late private state' }]));
  assert.doesNotMatch(await transcript(page).innerText(), /Late private/);
  await selectAgent(page); assert.equal(await prompt(page).inputValue(), 'agent draft');
});

test('Room Cancel and Close abort their transport signal and wait for acknowledged cleanup without dropping drafts', async t => {
  const page = await fixture(t); await openChat(page);
  await page.evaluate(() => { holdRoom = true; holdRoomCleanup = true; });
  await prompt(page).fill('owned room request'); await page.keyboard.press('Enter'); await page.waitForFunction(() => Boolean(window.roomSignal));
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => Boolean(pending['room-cleanup']));
  assert.equal(await page.evaluate(() => roomSignal.aborted), true);
  assert.equal(await page.getByRole('button', { name: 'Cancelling…', exact: true }).isDisabled(), true);
  assert.equal(await prompt(page).isDisabled(), true);
  await page.evaluate(() => pending['room-cleanup'].resolve());
  await page.waitForFunction(() => !document.querySelector('[aria-label="World message"]').disabled);
  assert.equal(await prompt(page).inputValue(), 'owned room request');
  assert.equal(await prompt(page).evaluate(element => document.activeElement === element), true);
  await page.evaluate(() => { delete pending['room-cleanup']; roomSignal = null; resolveCancelledRoom = true; });
  await page.keyboard.press('Enter'); await page.waitForFunction(() => Boolean(window.roomSignal));
  await page.getByRole('button', { name: 'Close chat', exact: true }).click();
  await page.waitForFunction(() => Boolean(pending['room-cleanup']));
  assert.equal(await prompt(page).isVisible(), true);
  await page.evaluate(() => pending['room-cleanup'].resolve()); await prompt(page).waitFor({ state: 'hidden' });
  await openChat(page); assert.equal(await prompt(page).inputValue(), 'owned room request');
  assert.equal(await transcript(page).locator('article').count(), 0);
});

test('target change waits for cancellation cleanup, and failure retains the selected resident and draft', async t => {
  const page = await fixture(t); await openChat(page); await selectAgent(page);
  await page.evaluate(() => { holdReply = true; holdCancel = true; }); await prompt(page).fill('pending reply'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => Boolean(pending.reply)); await target(page).selectOption('room');
  await page.waitForFunction(() => Boolean(pending.cancel));
  assert.equal(await page.evaluate(() => ui.getTarget()), 'local:ada'); assert.equal(await target(page).isDisabled(), true);
  await page.evaluate(() => pending.cancel.resolve()); await page.waitForFunction(() => ui.getTarget() === 'room');
  await selectAgent(page); assert.equal(await prompt(page).inputValue(), 'pending reply');
  await page.evaluate(() => { failCancel = true; holdCancel = false; }); await page.keyboard.press('Enter');
  await page.waitForFunction(() => Boolean(pending.reply)); await target(page).selectOption('room');
  await page.getByRole('status').filter({ hasText: 'Cleanup incomplete' }).first().waitFor();
  assert.equal(await page.evaluate(() => ui.getTarget()), 'local:ada'); assert.equal(await target(page).inputValue(), 'local:ada');
  await page.evaluate(() => { failCancel = false; }); await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('[aria-label="World message"]').disabled);
});

test('Residents is one accessible roster with owner-only movement/recovery/removal and spawn defaults', async t => {
  const page = await fixture(t); await page.getByRole('button', { name: 'Residents', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  const peer = dialog.locator('[data-agent-key="peer:remote"]');
  assert.equal(await peer.getByRole('button').count(), 1); assert.equal(await peer.getByRole('combobox').count(), 0);
  await dialog.getByRole('button', { name: 'Acknowledge and resume', exact: true }).click();
  await page.waitForFunction(() => calls.some(call => call.type === 'resume'));
  await dialog.getByRole('combobox', { name: 'Movement for Ada', exact: true }).selectOption('follow');
  await page.waitForFunction(() => calls.some(call => call.type === 'movement' && call.mode === 'follow'));
  await dialog.locator('summary').click(); await dialog.getByRole('textbox', { name: 'Resident name', exact: true }).fill('New resident');
  await dialog.getByRole('textbox', { name: 'Resident goals', exact: true }).fill('Listen\nHelp visitors');
  assert.equal(await dialog.getByRole('combobox', { name: 'Movement', exact: true }).inputValue(), 'roam');
  await dialog.getByRole('button', { name: 'Place resident', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  const created = await page.evaluate(() => calls.find(call => call.type === 'spawn').input);
  assert.deepEqual(created, { name: 'New resident', goals: ['Listen', 'Help visitors'], localOnly: false, shared: true });
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'movement').at(-1)), { type: 'movement', key: 'local:new', mode: 'roam' });
  assert.equal(await page.evaluate(() => ui.getTarget()), 'local:new');
  await page.getByRole('button', { name: 'Residents', exact: true }).click();
  await dialog.getByRole('button', { name: 'Remove body New resident', exact: true }).click();
  await page.waitForFunction(() => ui.getTarget() === 'room');
});

test('Models awaits active cancellation, closes its own dialogs and keeps one composer', async t => {
  const page = await fixture(t); await openChat(page); await selectAgent(page);
  await page.evaluate(() => { holdReply = true; holdCancel = true; }); await prompt(page).fill('running'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => Boolean(pending.reply));
  await page.getByRole('button', { name: 'Residents', exact: true }).click();
  await page.evaluate(() => { void ui.openModels(); }); await page.waitForFunction(() => Boolean(pending.cancel));
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'models').length), 0);
  await page.evaluate(() => pending.cancel.resolve()); await page.waitForFunction(() => calls.some(call => call.type === 'models'));
  assert.equal(await page.getByRole('dialog', { name: 'Residents', exact: true }).isVisible(), false);
  assert.equal(await prompt(page).count(), 1); assert.equal(await prompt(page).inputValue(), 'running');
});

test('roster Chat reopens the current resident without losing its draft and modal gameplay keys remain owned by the UI', async t => {
  const page = await fixture(t); await openChat(page); await selectAgent(page);
  await prompt(page).fill('current resident draft');
  await page.getByRole('button', { name: 'Residents', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  await dialog.getByRole('button', { name: 'Done', exact: true }).focus();
  await page.keyboard.down('w');
  assert.deepEqual(await page.evaluate(() => player.getMovementInput()), { forward: 0, strafe: 0 });
  await page.keyboard.up('w');
  await dialog.getByRole('button', { name: 'Chat with Ada', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  assert.equal(await prompt(page).inputValue(), 'current resident draft');
  assert.equal(await prompt(page).evaluate(element => document.activeElement === element), true);
});

test('Voice is explicit, pending permission can Stop, and switching to Room awaits capture cleanup', async t => {
  const page = await fixture(t); await openChat(page); assert.equal(await page.getByRole('button', { name: 'Talk', exact: true }).isVisible(), false);
  await selectAgent(page); assert.equal(await page.getByRole('button', { name: 'Talk', exact: true }).isDisabled(), true);
  await page.getByRole('button', { name: 'Voice options', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Voice options', exact: true });
  assert.match(await dialog.innerText(), /376 MB/); await dialog.getByRole('checkbox', { name: 'Enable voice', exact: true }).check();
  await page.waitForFunction(() => calls.some(call => call.type === 'voice'));
  assert.equal(await dialog.getByRole('checkbox', { name: 'Speak replies', exact: true }).isChecked(), true);
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await page.evaluate(() => { holdPermission = true; }); await page.getByRole('button', { name: 'Talk', exact: true }).click();
  await page.waitForFunction(() => Boolean(pending.record));
  assert.equal(await page.getByRole('button', { name: 'Stop', exact: true }).isEnabled(), true);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.waitForFunction(() => !pending.record);
  await page.getByRole('button', { name: 'Talk', exact: true }).click(); await page.waitForFunction(() => Boolean(pending.record));
  await page.evaluate(() => { holdCancel = true; }); await target(page).selectOption('room'); await page.waitForFunction(() => Boolean(pending.cancel));
  assert.equal(await page.evaluate(() => ui.getTarget()), 'local:ada');
  await page.evaluate(() => pending.cancel.resolve()); await page.waitForFunction(() => ui.getTarget() === 'room');
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'room-send').length), 0);
});

test('voice preparation keeps text usable and long received Room messages are not clipped to composer length', async t => {
  const page = await fixture(t); await openChat(page); await selectAgent(page);
  await page.evaluate(() => { holdVoice = true; });
  await page.getByRole('button', { name: 'Voice options', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Voice options', exact: true });
  await dialog.getByRole('checkbox', { name: 'Enable voice', exact: true }).check(); await page.waitForFunction(() => Boolean(pending.voice));
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await prompt(page).isEnabled(), true);
  await prompt(page).fill('text during preparation'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => calls.some(call => call.type === 'agent-send'));
  await page.evaluate(() => pending.voice.resolve());
  await target(page).selectOption('room'); await page.waitForFunction(() => ui.getTarget() === 'room');
  await page.evaluate(() => ui.appendRoomMessage({ id: 'long', peerId: 'peer', name: 'Peer', text: 'a'.repeat(2048) }));
  assert.equal((await transcript(page).locator('[data-message-id="long"] p').innerText()).length, 2048);
});

test('chat close waits for cleanup and retains its draft; UI disposal never owns runtime cancellation', async t => {
  const page = await fixture(t); await openChat(page); await prompt(page).fill('retain draft');
  await page.evaluate(() => { holdClose = true; }); await page.keyboard.press('Escape');
  await page.waitForFunction(() => Boolean(pending.close));
  assert.equal(await prompt(page).isVisible(), true); assert.equal(await page.getByRole('button', { name: 'Closing…', exact: true }).isDisabled(), true);
  await page.evaluate(() => pending.close.resolve()); await prompt(page).waitFor({ state: 'hidden' });
  await openChat(page); assert.equal(await prompt(page).inputValue(), 'retain draft');
  const count = await page.evaluate(() => calls.filter(call => ['cancel', 'close'].includes(call.type)).length);
  await page.evaluate(() => { ui.dispose(); ui.dispose(); });
  assert.equal(await page.locator('.cube-native-ui').count(), 0);
  assert.equal(await page.evaluate(() => calls.filter(call => ['cancel', 'close'].includes(call.type)).length), count);
  await page.locator('canvas').focus(); const before = await page.evaluate(() => canvasEnters); await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => canvasEnters), before + 1);
});

test('mobile chat and Residents wrap within the viewport and suspend touch HUD only while interacting', async t => {
  const page = await fixture(t, { mobile: true });
  assert.equal(await page.locator('#mobile-controls').evaluate(element => getComputedStyle(element).visibility), 'visible');
  await openChat(page);
  assert.equal(await page.locator('#mobile-controls').evaluate(element => getComputedStyle(element).visibility), 'hidden');
  assert.equal(await page.locator('#mobile-controls').evaluate(element => getComputedStyle(element).display), 'none');
  await selectAgent(page); await prompt(page).fill('mobile draft');
  const bounds = await page.locator('.cube-native-chat-body').boundingBox(); assert(bounds.x >= 0 && bounds.x + bounds.width <= 391 && bounds.y + bounds.height <= 845);
  for (const control of await page.locator('.cube-native-chat-body button:visible').all()) {
    const r = await control.boundingBox(); assert(r.x >= 0 && r.x + r.width <= 391 && r.y + r.height <= 845);
  }
  await page.getByRole('button', { name: 'Residents', exact: true }).click();
  await page.evaluate(() => { residents[0].name = 'Long resident name '.repeat(12); ui.setAgents(residents); });
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  assert.equal(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth), true);
  await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Close chat', exact: true }).click(); await prompt(page).waitFor({ state: 'hidden' });
  assert.equal(await page.locator('#mobile-controls').evaluate(element => getComputedStyle(element).visibility), 'visible');
  if (process.env.CUBE_NATIVE_UI_EVIDENCE) {
    await mkdir(process.env.CUBE_NATIVE_UI_EVIDENCE, { recursive: true });
    await openChat(page); await page.screenshot({ path: join(process.env.CUBE_NATIVE_UI_EVIDENCE, 'native-chat-mobile.png') });
    await page.getByRole('button', { name: 'Residents', exact: true }).click();
    await page.screenshot({ path: join(process.env.CUBE_NATIVE_UI_EVIDENCE, 'native-residents-mobile.png') });
  }
});

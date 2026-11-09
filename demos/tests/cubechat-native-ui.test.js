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
        calls.push({ type: 'spawn', input }); if (window.failSpawn) throw Error('Save failed');
        const agent = { key: 'local:new', agentId: 'new', local: true, name: input.name, status: 'idle', appearancePrompt: input.appearancePrompt, respondToWorldChat: input.respondToWorldChat, appearanceStatus: input.appearancePrompt ? 'waiting' : undefined };
        residents.push(agent); ui.setAgents(residents); ui.open(); ui.select(agent); ui.setMessages([]);
      },
      onMovement: async input => { calls.push({ type: 'movement', ...input }); },
      onEdit: async input => {
        calls.push({ type: 'edit', input });
        if (window.failEdit) throw Error('Profile save failed');
        if (window.holdEdit) await hold('edit');
        residents = residents.map(agent => agent.key === input.key ? { ...agent, ...input } : agent); ui.setAgents(residents);
      },
      onClone: async input => { calls.push({ type: 'clone', input }); if (window.failClone) throw Error('Cloning permission changed'); },
      onAppearance: async input => {
        calls.push({ type: 'appearance', ...input });
        if (window.holdAppearance) await hold('appearance');
        if (window.failAppearance) throw Error('Image provider unavailable; description remains saved.');
      },
      onWorldChat: async input => {
        calls.push({ type: 'world-chat', ...input });
        if (window.holdWorldChat) await hold('world-chat');
        if (window.failWorldChat) throw Error('World-chat preference was not saved.');
        residents = residents.map(agent => agent.key === input.key ? { ...agent, respondToWorldChat: input.enabled } : agent);
        ui.setAgents(residents);
      },
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
    // The application owns this external menu; CubeWorldUi only exposes actions.
    const menuButton = document.createElement('button'); menuButton.textContent = 'World menu';
    menuButton.id = 'fixture-menu'; menuButton.style.cssText = 'position:fixed;right:8px;top:58px;z-index:2200';
    const menu = document.createElement('dialog'); menu.setAttribute('aria-label', 'World menu'); menu.className = 'cube-settings';
    for (const action of ['Residents', 'Models']) {
      const entry = document.createElement('button'); entry.textContent = action; menu.append(entry);
      entry.onclick = () => { menu.close(); if (action === 'Residents') ui.openResidents({ returnFocus: menuButton }); else void ui.openModels(); };
    }
    menuButton.onclick = () => menu.showModal(); document.body.append(menuButton, menu);
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
async function openResidents(page) {
  await page.getByRole('button', { name: 'World menu', exact: true }).click();
  await page.getByRole('dialog', { name: 'World menu', exact: true }).getByRole('button', { name: 'Residents', exact: true }).click();
}
async function selectAgent(page, key = 'local:ada') { await target(page).selectOption(key); await page.waitForFunction(key => ui.getTarget() === key && !document.querySelector('[aria-label="World message"]').disabled, key); }

test('world HUD has no Residents or Models launchers; external menu and hidden-opener focus remain usable', async t => {
  const page = await fixture(t);
  const uiRoot = page.locator('.cube-native-ui');
  assert.equal(await uiRoot.getByRole('button', { name: /^(Residents|Models)$/ }).count(), 0);
  assert.equal(await uiRoot.locator('.cube-native-nav').count(), 0);
  await openResidents(page);
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
  assert.equal(await page.locator('#fixture-menu').evaluate(element => document.activeElement === element), true);
  await page.getByRole('button', { name: 'World menu', exact: true }).click();
  await page.getByRole('dialog', { name: 'World menu', exact: true }).getByRole('button', { name: 'Models', exact: true }).click();
  await page.waitForFunction(() => calls.some(call => call.type === 'models'));
  await page.evaluate(() => {
    const hiddenOpener = document.querySelector('dialog[aria-label="World menu"] button');
    ui.openResidents({ returnFocus: hiddenOpener });
  });
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: /^Chat ·/ }).evaluate(element => document.activeElement === element), true);
});

test('appearance presentation is bounded and local-only; retries await the host without repeating work', async t => {
  const page = await fixture(t);
  await page.evaluate(() => {
    residents = residents.map(agent => ({ ...agent, appearancePrompt: 'Blue robot face', appearanceStatus: 'waiting' }));
    ui.setAgents(residents);
  });
  await openResidents(page);
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  const ada = dialog.locator('[data-agent-key="local:ada"]'), peer = dialog.locator('[data-agent-key="peer:remote"]');
  assert.equal(await peer.getByRole('button', { name: /appearance/ }).count(), 0);
  assert.equal(await peer.locator('.cube-native-appearance-status').count(), 0);
  const retry = ada.getByRole('button', { name: 'Retry appearance for Ada', exact: true });
  await page.evaluate(() => { holdAppearance = true; failAppearance = true; });
  await retry.click(); await page.waitForFunction(() => Boolean(pending.appearance));
  assert.equal(await retry.isDisabled(), true);
  await retry.evaluate(element => element.onclick());
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'appearance').length), 1);
  await page.evaluate(() => pending.appearance.resolve());
  await dialog.getByRole('status').filter({ hasText: 'Image provider unavailable; description remains saved.' }).waitFor();
  assert.equal(await retry.isEnabled(), true);
  assert.equal(await page.evaluate(() => residents[0].appearancePrompt), 'Blue robot face');
  await page.evaluate(() => { residents[0].appearanceStatus = 'generating'; ui.setAgents(residents); });
  assert.equal(await ada.getByRole('button', { name: 'Generate appearance for Ada', exact: true }).isDisabled(), true);
  assert.match(await ada.innerText(), /Generating appearance/);
  await page.evaluate(() => {
    residents[0].appearanceStatus = 'error'; residents[0].appearanceError = '<img src=x>'.repeat(200); ui.setAgents(residents);
  });
  assert.equal(await ada.locator('img').count(), 0);
  assert((await ada.locator('.cube-native-appearance-status').innerText()).length < 600);
  assert.equal(await ada.getByRole('button', { name: 'Retry appearance for Ada', exact: true }).isEnabled(), true);
});

test('optional appearance prompt preserves failed-save draft and rejects injected over-limit text', async t => {
  const page = await fixture(t); await openResidents(page);
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  await dialog.locator('summary').click();
  await dialog.getByRole('textbox', { name: 'Resident name', exact: true }).fill('Saved look');
  const appearance = dialog.getByRole('textbox', { name: 'Physical appearance', exact: true });
  await appearance.evaluate(element => { element.value = 'x'.repeat(1001); });
  await dialog.getByRole('button', { name: 'Place resident', exact: true }).click();
  assert.match(await dialog.innerText(), /at most 1000 characters/);
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'spawn').length), 0);
  await appearance.fill('A silver face'); await page.evaluate(() => { failSpawn = true; });
  await dialog.getByRole('button', { name: 'Place resident', exact: true }).click();
  await dialog.getByRole('status').filter({ hasText: 'Save failed' }).waitFor();
  assert.equal(await appearance.inputValue(), 'A silver face');
  await appearance.fill(''); await page.evaluate(() => { failSpawn = false; });
  await dialog.getByRole('checkbox', { name: 'Respond to world chat', exact: true }).check();
  await dialog.getByRole('button', { name: 'Place resident', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'spawn').at(-1).input.appearancePrompt), '');
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'spawn').at(-1).input.respondToWorldChat), true);
});

test('world-chat response preference is owner-only, serialized, and restored when saving fails', async t => {
  const page = await fixture(t); await openResidents(page);
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  const ada = dialog.locator('[data-agent-key="local:ada"]');
  const respond = ada.getByRole('checkbox', { name: 'Respond to world chat for Ada', exact: true });
  assert.equal(await respond.isChecked(), false);
  assert.equal(await dialog.locator('[data-agent-key="peer:remote"]').getByRole('checkbox').count(), 0);
  await page.evaluate(() => { holdWorldChat = true; failWorldChat = true; });
  await respond.check(); await page.waitForFunction(() => Boolean(pending['world-chat']));
  assert.equal(await respond.isDisabled(), true);
  assert.equal(await ada.getByRole('button', { name: 'Remove body Ada', exact: true }).isDisabled(), true);
  await respond.evaluate(element => element.onchange());
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'world-chat').length), 1);
  await page.evaluate(() => pending['world-chat'].resolve());
  await dialog.getByRole('status').filter({ hasText: 'World-chat preference was not saved.' }).waitFor();
  assert.equal(await respond.isChecked(), false);
  await page.evaluate(() => { holdWorldChat = false; failWorldChat = false; });
  await respond.check(); await page.waitForFunction(() => residents[0].respondToWorldChat === true);
  assert.equal(await respond.isChecked(), true);
  await page.evaluate(() => ui.setBusy(true)); assert.equal(await respond.isDisabled(), true);
  await page.evaluate(() => ui.setBusy(false)); await respond.uncheck();
  await page.waitForFunction(() => residents[0].respondToWorldChat === false);
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'world-chat').map(({key,enabled})=>({key,enabled}))), [
    { key: 'local:ada', enabled: true }, { key: 'local:ada', enabled: true }, { key: 'local:ada', enabled: false }
  ]);
});

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
  const page = await fixture(t); await openResidents(page);
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  const peer = dialog.locator('[data-agent-key="peer:remote"]');
  assert.equal(await peer.getByRole('button').count(), 1); assert.equal(await peer.getByRole('combobox').count(), 0);
  await dialog.getByRole('button', { name: 'Acknowledge and resume', exact: true }).click();
  await page.waitForFunction(() => calls.some(call => call.type === 'resume'));
  await dialog.getByRole('combobox', { name: 'Movement for Ada', exact: true }).selectOption('follow');
  await page.waitForFunction(() => calls.some(call => call.type === 'movement' && call.mode === 'follow'));
  await dialog.locator('summary').click(); await dialog.getByRole('textbox', { name: 'Resident name', exact: true }).fill('New resident');
  await dialog.getByRole('textbox', { name: 'Resident goals', exact: true }).fill('Listen\nHelp visitors');
  await dialog.getByRole('textbox', { name: 'Physical appearance', exact: true }).fill('  A friendly blue robot face  ');
  assert.equal(await dialog.getByRole('textbox', { name: 'Physical appearance', exact: true }).getAttribute('maxlength'), '1000');
  assert.equal(await dialog.getByRole('checkbox', { name: 'Respond to world chat', exact: true }).isChecked(), false);
  assert.equal(await dialog.getByRole('combobox', { name: 'Movement', exact: true }).inputValue(), 'stationary');
  await dialog.getByRole('button', { name: 'Place resident', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  const created = await page.evaluate(() => calls.find(call => call.type === 'spawn').input);
  assert.deepEqual(created, { name: 'New resident', instructions: '', allowCloning: true, shareMemories: true, sharePrivateMemories: false, movement: 'stationary', goals: ['Listen', 'Help visitors'], appearancePrompt: 'A friendly blue robot face', respondToWorldChat: false, localOnly: false, shared: true });
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'movement').at(-1)), { type: 'movement', key: 'local:new', mode: 'stationary' });
  assert.equal(await page.evaluate(() => ui.getTarget()), 'local:new');
  await openResidents(page);
  assert.match(await dialog.locator('[data-agent-key="local:new"]').innerText(), /Appearance saved/);
  await dialog.getByRole('button', { name: 'Remove body New resident', exact: true }).click();
  await page.waitForFunction(() => ui.getTarget() === 'room');
});

test('Models awaits active cancellation, closes its own dialogs and keeps one composer', async t => {
  const page = await fixture(t); await openChat(page); await selectAgent(page);
  await page.evaluate(() => { holdReply = true; holdCancel = true; }); await prompt(page).fill('running'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => Boolean(pending.reply));
  await openResidents(page);
  await page.evaluate(() => { void ui.openModels(); }); await page.waitForFunction(() => Boolean(pending.cancel));
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'models').length), 0);
  await page.evaluate(() => pending.cancel.resolve()); await page.waitForFunction(() => calls.some(call => call.type === 'models'));
  assert.equal(await page.getByRole('dialog', { name: 'Residents', exact: true }).isVisible(), false);
  assert.equal(await page.locator('.cube-native-composer textarea').count(), 1);
  if (!await prompt(page).isVisible()) await openChat(page);
  assert.equal(await prompt(page).inputValue(), 'running');
});

test('roster Chat reopens the current resident without losing its draft and modal gameplay keys remain owned by the UI', async t => {
  const page = await fixture(t); await openChat(page); await selectAgent(page);
  await prompt(page).fill('current resident draft');
  await openResidents(page);
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
  await openResidents(page);
  await page.evaluate(() => { residents[0].name = 'Long resident name '.repeat(12); ui.setAgents(residents); });
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  assert.equal(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth), true);
  await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
  if (!await prompt(page).isVisible()) await openChat(page);
  await page.getByRole('button', { name: 'Close chat', exact: true }).click(); await prompt(page).waitFor({ state: 'hidden' });
  assert.equal(await page.locator('#mobile-controls').evaluate(element => getComputedStyle(element).visibility), 'visible');
  if (process.env.CUBE_NATIVE_UI_EVIDENCE) {
    await mkdir(process.env.CUBE_NATIVE_UI_EVIDENCE, { recursive: true });
    await openChat(page); await page.screenshot({ path: join(process.env.CUBE_NATIVE_UI_EVIDENCE, 'native-chat-mobile.png') });
    await openResidents(page);
    await page.screenshot({ path: join(process.env.CUBE_NATIVE_UI_EVIDENCE, 'native-residents-mobile.png') });
  }
});

test('owner profile editor saves appearance, identity, policy and clone consent without exposing peer private controls', async t => {
  const page=await fixture(t);
  await page.evaluate(()=>{residents[0]={...residents[0],instructions:'Keep owner instructions private',goals:['Explore'],appearancePrompt:'Blue cube',movement:'stationary',localOnly:true,shared:true,allowCloning:false};ui.setAgents(residents);ui.openResidents();});
  const roster=page.getByRole('dialog',{name:'Residents',exact:true});
  assert.equal(await roster.getByRole('button',{name:'Edit Peer resident',exact:true}).count(),0);
  assert.equal(await roster.getByRole('button',{name:'Clone Peer resident',exact:true}).count(),0);
  await roster.getByRole('button',{name:'Edit Ada',exact:true}).click();
  const editor=page.getByRole('dialog',{name:'Edit resident',exact:true});
  if(process.env.CUBE_SCENE_ARTIFACTS){await mkdir(process.env.CUBE_SCENE_ARTIFACTS,{recursive:true});await page.screenshot({path:join(process.env.CUBE_SCENE_ARTIFACTS,'desktop-resident-editor.png'),fullPage:true});}
  assert.equal(await editor.getByRole('textbox',{name:'Resident instructions',exact:true}).inputValue(),'Keep owner instructions private');
  await editor.getByRole('textbox',{name:'Resident name',exact:true}).fill('Ada updated');
  await editor.getByRole('textbox',{name:'Resident instructions',exact:true}).fill('Be curious');
  await editor.getByRole('textbox',{name:'Resident goals',exact:true}).fill('Meet visitors\nLearn shapes');
  await editor.getByRole('textbox',{name:'Physical appearance',exact:true}).fill('A green cube face');
  await editor.getByRole('combobox',{name:'Movement',exact:true}).selectOption('follow');
  await editor.getByRole('checkbox',{name:'Respond to world chat',exact:true}).check();
  assert.equal(await editor.getByRole('checkbox',{name:'Include private conversations',exact:true}).isChecked(),false);
  await editor.getByRole('checkbox',{name:'Share resident history',exact:true}).check();
  await editor.getByRole('checkbox',{name:'Include private conversations',exact:true}).check();
  await editor.getByRole('button',{name:'Save resident',exact:true}).click();await editor.waitFor({state:'hidden'});
  const saved=await page.evaluate(()=>calls.find(c=>c.type==='edit').input);
  assert.deepEqual(saved,{key:'local:ada',name:'Ada updated',instructions:'Be curious',goals:['Meet visitors','Learn shapes'],appearancePrompt:'A green cube face',movement:'follow',localOnly:true,shared:true,respondToWorldChat:true,allowCloning:true,shareMemories:true,sharePrivateMemories:true});
  await roster.getByRole('button',{name:'Clone Ada updated',exact:true}).click();
  assert.deepEqual(await page.evaluate(()=>calls.find(c=>c.type==='clone').input),{key:'local:ada'});
});

test('peer clone action requires advertised permission and failed profile saves preserve the draft', async t => {
  const page=await fixture(t,{mobile:true});
  await page.evaluate(()=>{residents[1]={...residents[1],cloneable:true,instructions:'Do not expose peer private fields'};ui.setAgents(residents);ui.openResidents();});
  const roster=page.getByRole('dialog',{name:'Residents',exact:true});
  await roster.getByRole('button',{name:'Clone Peer resident',exact:true}).click();
  assert.deepEqual(await page.evaluate(()=>calls.find(c=>c.type==='clone').input),{key:'peer:remote'});
  assert.equal(await roster.getByText('Do not expose peer private fields',{exact:true}).count(),0);
  await roster.getByRole('button',{name:'Edit Ada',exact:true}).click();const editor=page.getByRole('dialog',{name:'Edit resident',exact:true});
  await editor.getByRole('textbox',{name:'Resident name',exact:true}).fill('Unsaved Ada');await page.evaluate(()=>window.failEdit=true);
  await editor.getByRole('button',{name:'Save resident',exact:true}).click();await editor.getByRole('status').filter({hasText:'Profile save failed'}).waitFor();
  assert.equal(await editor.getByRole('textbox',{name:'Resident name',exact:true}).inputValue(),'Unsaved Ada');
  const box=await editor.evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,screenW:innerWidth,screenH:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth};});
  assert(box.x>=0&&box.y>=0&&box.x+box.w<=box.screenW+1&&box.y+box.h<=box.screenH+1&&!box.overflow);
  if(process.env.CUBE_SCENE_ARTIFACTS){await mkdir(process.env.CUBE_SCENE_ARTIFACTS,{recursive:true});await page.screenshot({path:join(process.env.CUBE_SCENE_ARTIFACTS,'mobile-resident-editor.png'),fullPage:true});}
});

test('one history-sharing control defaults on for new residents and preserves legacy consent on unrelated edits', async t=>{
 const page=await fixture(t);await openResidents(page);
 const dialog=page.getByRole('dialog',{name:'Residents',exact:true});await dialog.locator('summary').click();
 const history=dialog.getByRole('checkbox',{name:'Share resident history',exact:true});
 assert.equal(await history.isChecked(),true);assert.equal(await history.isEnabled(),true);
 assert.equal(await dialog.getByRole('checkbox',{name:/Allow peers to clone|Share public world memories/}).count(),0);
 await page.evaluate(()=>{residents[0]={...residents[0],allowCloning:true,shareMemories:false};ui.setAgents(residents);});
 await dialog.getByRole('button',{name:'Edit Ada',exact:true}).click();const editor=page.getByRole('dialog',{name:'Edit resident',exact:true});
 assert.equal(await editor.getByRole('checkbox',{name:'Share resident history',exact:true}).isChecked(),false);
 await editor.getByRole('textbox',{name:'Resident name',exact:true}).fill('Rename only');await editor.getByRole('button',{name:'Save resident',exact:true}).click();await editor.waitFor({state:'hidden'});
 const request=await page.evaluate(()=>calls.find(c=>c.type==='edit').input);assert.equal(Object.hasOwn(request,'allowCloning'),false);assert.equal(Object.hasOwn(request,'shareMemories'),false);assert.equal(Object.hasOwn(request,'sharePrivateMemories'),false);
});

test('creation has public history on and private conversations off, with explicit consent and dependency gates', async t=>{
 const page=await fixture(t);await openResidents(page);const dialog=page.getByRole('dialog',{name:'Residents',exact:true});await dialog.locator('summary').click();
 const history=dialog.getByRole('checkbox',{name:'Share resident history',exact:true}),privateChoice=dialog.getByRole('checkbox',{name:'Include private conversations',exact:true});
 assert.equal(await history.isChecked(),true);assert.equal(await privateChoice.isChecked(),false);assert.equal(await privateChoice.isEnabled(),true);
 assert.equal(await dialog.getByText(/other players who clone this resident can read them/).count(),1);
 await privateChoice.check();await history.uncheck();assert.equal(await privateChoice.isDisabled(),true);assert.equal(await privateChoice.isChecked(),false);
 await history.check();await privateChoice.check();await dialog.getByRole('checkbox',{name:'Let peers talk to this resident',exact:true}).uncheck();
 assert.equal(await privateChoice.isDisabled(),true);assert.equal(await privateChoice.isChecked(),false);
 await dialog.getByRole('checkbox',{name:'Let peers talk to this resident',exact:true}).check();await privateChoice.check();
 await dialog.getByRole('textbox',{name:'Resident name',exact:true}).fill('History sharing resident');await dialog.getByRole('button',{name:'Place resident',exact:true}).click();await dialog.waitFor({state:'hidden'});
 assert.equal(await page.evaluate(()=>calls.find(c=>c.type==='spawn').input.sharePrivateMemories),true);
 await openResidents(page);assert.equal(await privateChoice.isChecked(),false);assert.equal(await history.isChecked(),true);
});

test('owner can revoke private history without changing public history; unrelated edits retain existing private consent', async t=>{
 const page=await fixture(t);await page.evaluate(()=>{residents[0]={...residents[0],allowCloning:true,shareMemories:true,sharePrivateMemories:true,shared:true};ui.setAgents(residents);ui.openResidents();});
 const roster=page.getByRole('dialog',{name:'Residents',exact:true});await roster.getByRole('button',{name:'Edit Ada',exact:true}).click();
 const editor=page.getByRole('dialog',{name:'Edit resident',exact:true});assert.equal(await editor.getByRole('checkbox',{name:'Include private conversations',exact:true}).isChecked(),true);
 await editor.getByRole('textbox',{name:'Resident name',exact:true}).fill('Ada renamed');await editor.getByRole('button',{name:'Save resident',exact:true}).click();await editor.waitFor({state:'hidden'});
 assert.equal(await page.evaluate(()=>Object.hasOwn(calls.find(c=>c.type==='edit').input,'sharePrivateMemories')),false);
 await roster.getByRole('button',{name:'Edit Ada renamed',exact:true}).click();await editor.getByRole('checkbox',{name:'Include private conversations',exact:true}).uncheck();
 await editor.getByRole('button',{name:'Save resident',exact:true}).click();await editor.waitFor({state:'hidden'});
 const request=await page.evaluate(()=>calls.filter(c=>c.type==='edit').at(-1).input);assert.equal(request.sharePrivateMemories,false);assert.equal(Object.hasOwn(request,'shareMemories'),false);
});

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
        const agent = { key: 'local:new', agentId: 'new', local: true, name: input.name, status: 'idle', appearancePrompt: input.appearancePrompt, respondToWorldChat: input.respondToWorldChat, initiateConversations: input.initiateConversations, appearanceStatus: input.appearancePrompt ? 'waiting' : undefined,
          selfModifiable: input.selfModifiable, ...(input.standingGoal ? { standingGoal: input.standingGoal } : {}) };
        residents.push(agent); ui.setAgents(residents); ui.open(); ui.select(agent); ui.setMessages([]);
      },
      onAssignGoal: async input => { calls.push({ type: 'goal-assign', ...input }); if (window.failGoal) throw Error('Goal save failed'); if (window.holdGoal) await hold('goal'); },
      onPauseGoal: async input => { calls.push({ type: 'goal-pause', ...input }); },
      onResumeGoal: async input => { calls.push({ type: 'goal-resume', ...input }); },
      onCancelGoal: async input => { calls.push({ type: 'goal-cancel', ...input }); },
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
      onResume: async key => {
        calls.push({ type: 'resume', key });
        if (window.holdResume) await hold('resume');
        if (window.failResume) throw Error('Resume was not saved');
        residents = residents.map(row => row.key === key ? { ...row, status: 'idle', recoveryRequired: false } : row); ui.setAgents(residents);
      },
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
  await dialog.locator('summary').filter({ hasText: 'Place a resident' }).click();
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

test('native cube chat resumes only owned residents, preserving drafts and waiting for saved recovery', async t => {
  const page = await fixture(t, { mobile: true }); await openChat(page); await selectAgent(page);
  await prompt(page).fill('A new message after recovery');
  await page.evaluate(() => {
    holdResume = true;
    residents = residents.map(row => row.key === 'local:ada' ? { ...row, status: 'paused' } : row);
    ui.setAgents(residents);
  });
  const resume = page.locator('.cube-native-chat').getByRole('button', { name: 'Resume', exact: true });
  assert.equal(await resume.isVisible(), true); assert.equal(await prompt(page).isDisabled(), true);
  await resume.click(); await page.waitForFunction(() => Boolean(pending.resume));
  assert.equal(await resume.isDisabled(), true); assert.equal(await target(page).isDisabled(), true);
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'agent-send').length), 0);
  await page.evaluate(() => pending.resume.resolve());
  await page.waitForFunction(() => !document.querySelector('[aria-label="World message"]').disabled);
  assert.equal(await resume.isVisible(), false);
  assert.equal(await prompt(page).inputValue(), 'A new message after recovery');
  assert.equal(await prompt(page).evaluate(element => document.activeElement === element), true);

  await page.evaluate(() => {
    residents = residents.map(row => row.key === 'peer:remote' ? { ...row, status: 'paused', canResume: true } : row);
    ui.setAgents(residents);
  });
  await target(page).selectOption('peer:remote');
  assert.equal(await resume.isVisible(), false);
  assert.match(await page.locator('.cube-native-chat .cube-native-note').innerText(), /Only its owner can resume/);
  assert.equal(await prompt(page).isDisabled(), true);
  await page.evaluate(() => [...document.querySelectorAll('.cube-native-chat button')].find(button => button.textContent === 'Resume').click());
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'resume').length), 1);

  await target(page).selectOption('local:paused');
  const acknowledge = page.locator('.cube-native-chat').getByRole('button', { name: 'Acknowledge and resume', exact: true });
  assert.equal(await acknowledge.isVisible(), true);
  assert.match(await page.locator('.cube-native-chat .cube-native-note').innerText(), /old request will not replay/);
  await page.evaluate(() => { holdResume = false; failResume = true; }); await acknowledge.click();
  await page.locator('.cube-native-chat [role="status"]').filter({ hasText: 'Resume was not saved' }).waitFor();
  assert.equal(await prompt(page).isDisabled(), true); assert.equal(await acknowledge.isEnabled(), true);
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'agent-send').length), 0);
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
  await dialog.locator('summary').filter({ hasText: 'Place a resident' }).click(); await dialog.getByRole('textbox', { name: 'Resident name', exact: true }).fill('New resident');
  await dialog.getByRole('textbox', { name: 'Resident goals', exact: true }).fill('Listen\nHelp visitors');
  await dialog.getByRole('textbox', { name: 'Physical appearance', exact: true }).fill('  A friendly blue robot face  ');
  assert.equal(await dialog.getByRole('textbox', { name: 'Physical appearance', exact: true }).getAttribute('maxlength'), '1000');
  assert.equal(await dialog.getByRole('checkbox', { name: 'Respond to world chat', exact: true }).isChecked(), false);
  assert.equal(await dialog.getByRole('combobox', { name: 'Movement', exact: true }).inputValue(), 'stationary');
  await dialog.getByRole('button', { name: 'Place resident', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  const created = await page.evaluate(() => calls.find(call => call.type === 'spawn').input);
  assert.deepEqual(created, { name: 'New resident', instructions: '', allowCloning: true, shareMemories: true, sharePrivateMemories: false, initiateConversations: false, selfModifiable: false, movement: 'stationary', goals: ['Listen', 'Help visitors'], appearancePrompt: 'A friendly blue robot face', respondToWorldChat: false, localOnly: false, shared: true });
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
  assert.deepEqual(saved,{key:'local:ada',name:'Ada updated',instructions:'Be curious',goals:['Meet visitors','Learn shapes'],appearancePrompt:'A green cube face',movement:'follow',localOnly:true,shared:true,respondToWorldChat:true,initiateConversations:false,selfModifiable:false,allowCloning:true,shareMemories:true,sharePrivateMemories:true});
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
 const dialog=page.getByRole('dialog',{name:'Residents',exact:true});await dialog.locator('summary').filter({hasText:'Place a resident'}).click();
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
 const page=await fixture(t);await openResidents(page);const dialog=page.getByRole('dialog',{name:'Residents',exact:true});await dialog.locator('summary').filter({hasText:'Place a resident'}).click();
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

test('resident initiation defaults off, is independent from world replies, and resets for the next creation', async t => {
  const page = await fixture(t); await openResidents(page);
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  await dialog.locator('summary').filter({ hasText: 'Place a resident' }).click();
  const initiate = dialog.getByRole('checkbox', { name: 'Initiate conversations', exact: true });
  const respond = dialog.getByRole('checkbox', { name: 'Respond to world chat', exact: true });
  assert.equal(await initiate.isChecked(), false); assert.equal(await respond.isChecked(), false);
  assert.equal(await dialog.getByRole('checkbox', { name: 'Share resident history', exact: true }).isChecked(), true);
  assert.equal(await dialog.getByRole('checkbox', { name: 'Include private conversations', exact: true }).isChecked(), false);
  assert.match(await dialog.innerText(), /someone is nearby and a model is available/);
  await initiate.check();
  assert.equal(await respond.isChecked(), false);
  await dialog.getByRole('textbox', { name: 'Resident name', exact: true }).fill('Greeter');
  await dialog.getByRole('button', { name: 'Place resident', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  const saved = await page.evaluate(() => calls.find(call => call.type === 'spawn').input);
  assert.equal(saved.initiateConversations, true); assert.equal(saved.respondToWorldChat, false);
  await openResidents(page); assert.equal(await initiate.isChecked(), false);
});

test('owner explicitly enables and revokes initiative while legacy residents remain off', async t => {
  const page = await fixture(t); await openResidents(page);
  const roster = page.getByRole('dialog', { name: 'Residents', exact: true });
  await roster.getByRole('button', { name: 'Edit Ada', exact: true }).click();
  const editor = page.getByRole('dialog', { name: 'Edit resident', exact: true });
  const initiate = editor.getByRole('checkbox', { name: 'Initiate conversations', exact: true });
  assert.equal(await initiate.isChecked(), false);
  await initiate.check(); await editor.getByRole('button', { name: 'Save resident', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => residents[0].initiateConversations), true);
  await roster.getByRole('button', { name: 'Edit Ada', exact: true }).click();
  assert.equal(await initiate.isChecked(), true); await initiate.uncheck();
  await editor.getByRole('button', { name: 'Save resident', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'edit').map(call => call.input.initiateConversations)), [true, false]);
  assert.equal(await roster.getByRole('button', { name: 'Edit Peer resident', exact: true }).count(), 0);
});

test('social status stays inside local resident controls and renders bounded friendly labels', async t => {
  const page = await fixture(t, { mobile: true });
  await page.evaluate(() => { residents[0].socialStatus = 'waiting-for-model'; residents[1].socialStatus = 'considering'; ui.setAgents(residents); });
  await openResidents(page);
  const dialog = page.getByRole('dialog', { name: 'Residents', exact: true });
  const local = dialog.locator('[data-agent-key="local:ada"]');
  assert.match(await local.innerText(), /Waiting for an available model/);
  assert.equal(await dialog.locator('[data-agent-key="peer:remote"] [data-social-status]').count(), 0);
  assert.equal(await page.locator('.cube-native-chat [data-social-status]').count(), 0);
  await page.evaluate(() => { residents[0].socialStatus = 'resting'; ui.setAgents(residents); });
  assert.match(await local.innerText(), /Resting between conversations/);
  await page.evaluate(() => { residents[0].socialStatus = '<img src=x onerror=alert(1)>'; ui.setAgents(residents); });
  assert.equal(await local.locator('img').count(), 0);
  assert.match(await local.innerText(), /Watching for someone nearby/);
  assert.equal(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth), true);
});

test('local movement inspector shows measured navigation and retains expansion and focus across resident refreshes', async t => {
  const page = await fixture(t);
  assert.equal(await page.evaluate(() => ui.isNavigationVisible()), false);
  await openResidents(page); assert.equal(await page.evaluate(() => ui.isNavigationVisible()), true);
  await page.evaluate(() => {
    ui.setNavigationStatus('local:ada', { key:'local:ada', type:'approach', targetId:'human:visitor', targetName:'Visitor',
      status:'detouring', distance:24.5, stopDistance:10, progress:{distanceTravelled:8.2,unproductiveSeconds:1.5,targetClear:false},
      backend:'webgpu',worker:true,policyId:'held-out-navigation-test',dispatches:42 });
    ui.setNavigationStatus('peer:remote', { status:'moving',targetName:'PRIVATE_REMOTE_DETAIL' });
    ui.setNavigationStatus('unknown', { status:'moving',targetName:'UNKNOWN_DETAIL' });
  });
  const roster=page.getByRole('dialog',{name:'Residents',exact:true});
  const panel=roster.locator('[data-agent-key="local:ada"] [data-resident-navigation]');
  assert.equal(await panel.evaluate(element=>element.open),false);
  await panel.locator('summary').click();
  assert.equal(await panel.locator('[data-navigation-field="target"]').innerText(),'Visitor');
  assert.equal(await panel.locator('[data-navigation-field="status"]').innerText(),'Going around an obstacle');
  assert.equal(await panel.locator('[data-navigation-field="distance"]').innerText(),'24.5 units · stop at 10');
  assert.equal(await panel.locator('[data-navigation-field="progress"]').innerText(),'8.2 units travelled · 1.5s since progress');
  assert.equal(await panel.locator('[data-navigation-field="direct-path"]').innerText(),'Obstructed');
  assert.equal(await panel.locator('[data-navigation-field="controller"]').innerText(),'WebGPU · managed worker');
  assert(!await roster.innerText().then(value=>value.includes('PRIVATE_REMOTE_DETAIL')||value.includes('UNKNOWN_DETAIL')||value.includes('%')));
  assert.equal(await roster.locator('[data-agent-key="peer:remote"] [data-resident-navigation]').count(),0);
  await panel.locator('summary').focus();
  const unchanged=await page.evaluate(() => {
    const old=document.querySelector('[data-agent-key="local:ada"] [data-resident-navigation]');
    ui.setAgents(residents);return old===document.querySelector('[data-agent-key="local:ada"] [data-resident-navigation]');
  });
  assert.equal(unchanged,true);assert.equal(await panel.evaluate(element=>element.open),true);
  assert.equal(await panel.locator('summary').evaluate(element=>element===document.activeElement),true);
  await page.evaluate(()=>ui.setNavigationStatus('local:ada',{key:'wrong-body',status:'failed',blockedReason:'WRONG_BODY'}));
  assert(!await panel.innerText().then(value=>value.includes('WRONG_BODY')));
  await roster.getByRole('button',{name:'Edit Ada',exact:true}).click();
  assert.equal(await page.evaluate(()=>ui.isNavigationVisible()),false);
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>ui.isNavigationVisible()),true);
  assert.equal(await page.evaluate(()=>calls.filter(call=>call.type==='movement').length),0,'Displaying navigation never issues a movement command');
});

test('blocked mobile inspector bounds text and marks missing worker evidence without inventing progress', async t => {
  const page=await fixture(t,{mobile:true});await openResidents(page);
  await page.evaluate(()=>ui.setNavigationStatus('local:ada',{key:'local:ada',type:'follow',status:'blocked',targetName:'<img src=x>'.repeat(100),
    distance:Infinity,stopDistance:-1,progress:{distanceTravelled:NaN,unproductiveSeconds:-2,targetClear:false},
    blockedReason:'<script>unsafe()</script>'.repeat(100),backend:'webgpu',worker:false,policyId:'test-policy'}));
  const roster=page.getByRole('dialog',{name:'Residents',exact:true});
  const panel=roster.locator('[data-agent-key="local:ada"] [data-resident-navigation]');await panel.locator('summary').click();
  assert.equal(await panel.locator('[data-navigation-field="controller"]').innerText(),'Execution not verified');
  assert.equal(await panel.locator('[data-navigation-field="distance"]').innerText(),'Unavailable');
  assert.equal(await panel.locator('[data-navigation-field="progress"]').innerText(),'No measurements yet');
  assert((await panel.locator('[data-navigation-field="details"]').innerText()).length<=240);
  assert((await panel.locator('[data-navigation-field="target"]').innerText()).length<=160);
  assert.equal(await panel.locator('img,script').count(),0);
  assert.equal(await roster.evaluate(element=>element.scrollWidth<=element.clientWidth),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
});

test('navigation snapshots are removed when local ownership ends and cannot recreate a removed resident', async t => {
  const page=await fixture(t);await openResidents(page);
  await page.evaluate(()=>{ui.setNavigationStatus('local:ada',{status:'moving',targetName:'OWNER_ONLY_TARGET'});residents[0].local=false;ui.setAgents(residents);ui.setNavigationStatus('local:ada',{status:'moving',targetName:'OWNER_ONLY_TARGET'});});
  assert.equal(await page.locator('[data-agent-key="local:ada"] [data-resident-navigation]').count(),0);
  assert(!await page.locator('.cube-native-ui').innerText().then(value=>value.includes('OWNER_ONLY_TARGET')));
  await page.evaluate(()=>ui.dispose());assert.equal(await page.evaluate(()=>ui.isNavigationVisible()),false);
  assert.equal(await page.locator('[data-resident-navigation]').count(),0);
});

test('legacy roaming is explicitly scripted while the learned controller is idle', async t => {
  const page=await fixture(t);await openResidents(page);
  await page.evaluate(()=>ui.setNavigationStatus('local:ada',{key:'local:ada',type:'roam',status:'idle'}));
  const panel=page.locator('[data-agent-key="local:ada"] [data-resident-navigation]');
  assert.equal(await panel.locator('summary').innerText(),'Movement · Roam (scripted)');await panel.locator('summary').click();
  assert.equal(await panel.locator('[data-navigation-field="action"]').innerText(),'Roam (scripted)');
  assert.equal(await panel.locator('[data-navigation-field="status"]').innerText(),'Learned controller idle');
  await page.evaluate(()=>ui.setNavigationStatus('local:ada',{key:'local:ada',type:'stationary',status:'idle'}));
  assert.equal(await panel.locator('[data-navigation-field="action"]').innerText(),'Stay here');
});


test('objective editor retains its node, draft, caret and expansion during status and roster refreshes', async t => {
  const page = await fixture(t); await openResidents(page);
  const roster = page.getByRole('dialog', { name: 'Residents', exact: true });
  const panel = roster.locator('[data-agent-key="local:ada"] [data-resident-goal]'); await panel.locator('summary').click();
  const input = panel.getByRole('textbox', { name: 'Objective for Ada', exact: true }); await input.fill('Inspect the bridge, then return.');
  await input.evaluate(element => { element.focus(); element.setSelectionRange(8, 18); window.originalObjectiveInput = element; });
  const before = await roster.evaluate(element => element.scrollTop);
  await page.evaluate(async () => {
    for (let i = 0; i < 6; i++) {
      ui.setGoalStatus('local:ada', null);
      ui.setNavigationStatus('local:ada', { status: 'moving', distance: 40 - i });
      residents = residents.map(agent => ({ ...agent, socialStatus: i % 2 ? 'observing' : 'resting' }));
      ui.setAgents(residents);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  });
  assert.deepEqual(await input.evaluate(element => ({ same: element === window.originalObjectiveInput, focused: element === document.activeElement,
    start: element.selectionStart, end: element.selectionEnd, value: element.value })),
  { same: true, focused: true, start: 8, end: 18, value: 'Inspect the bridge, then return.' });
  assert.equal(await panel.evaluate(element => element.open), true);
  assert.equal(await roster.evaluate(element => element.scrollTop), before);
  assert.equal(await page.evaluate(() => calls.filter(call => call.type.startsWith('goal-')).length), 0);
});

test('owner objective controls stay available during active chat while peer snapshots cannot expose them', async t => {
  const page = await fixture(t); await openResidents(page);
  const snapshot = { goalId: 'owned-goal', revision: 9, objective: 'Inspect the visitor', status: 'acting', currentStep: 'Approaching', lastReceipt: null };
  await page.evaluate(snapshot => {
    ui.setGoalStatus('local:ada', snapshot); ui.setGoalStatus('peer:remote', { ...snapshot, objective: 'PRIVATE_REMOTE_GOAL' });
    ui.setGoalStatus('unknown', snapshot); ui.setBusy(true);
  }, snapshot);
  const roster = page.getByRole('dialog', { name: 'Residents', exact: true });
  const panel = roster.locator('[data-agent-key="local:ada"] [data-resident-goal]'); await panel.locator('summary').click();
  const pause = panel.getByRole('button', { name: 'Pause objective for Ada', exact: true });
  assert.equal(await pause.isEnabled(), true); await pause.click();
  await panel.getByRole('button', { name: 'Cancel objective for Ada', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type.startsWith('goal-'))), [
    { type: 'goal-pause', key: 'local:ada', goalId: 'owned-goal', expectedRevision: 9 },
    { type: 'goal-cancel', key: 'local:ada', goalId: 'owned-goal', expectedRevision: 9 }
  ]);
  assert.equal(await roster.locator('[data-agent-key="peer:remote"] [data-resident-goal]').count(), 0);
  assert(!await roster.innerText().then(value => value.includes('PRIVATE_REMOTE_GOAL')));
  await page.evaluate(() => ui.setGoalStatus('local:ada', { key: 'wrong', goalId: 'wrong', revision: 99, status: 'paused', objective: 'WRONG_GOAL' }));
  assert(!await panel.innerText().then(value => value.includes('WRONG_GOAL')));
});

test('objective drafts are isolated by resident and cleared from UI when local ownership ends', async t => {
  const page = await fixture(t); await openResidents(page);
  await page.locator('[data-agent-key="local:ada"] [data-resident-goal] summary').click();
  await page.getByRole('textbox', { name: 'Objective for Ada', exact: true }).fill('Ada draft');
  await page.locator('[data-agent-key="local:paused"] [data-resident-goal] summary').click();
  await page.getByRole('textbox', { name: 'Objective for Paused resident', exact: true }).fill('Second draft');
  await page.evaluate(() => { ui.setAgents([...residents].reverse()); ui.setGoalStatus('local:ada', null); });
  assert.equal(await page.getByRole('textbox', { name: 'Objective for Ada', exact: true }).inputValue(), 'Ada draft');
  assert.equal(await page.getByRole('textbox', { name: 'Objective for Paused resident', exact: true }).inputValue(), 'Second draft');
  await page.evaluate(() => { residents[0].local = false; ui.setAgents(residents); ui.setGoalStatus('local:ada', { goalId: 'old', revision: 1, objective: 'PRIVATE', status: 'paused' }); });
  assert.equal(await page.locator('[data-agent-key="local:ada"] [data-resident-goal]').count(), 0);
  assert(!await page.locator('.cube-native-ui').innerText().then(value => value.includes('PRIVATE')));
  await page.evaluate(() => ui.dispose()); assert.equal(await page.locator('[data-resident-goal]').count(), 0);
});

test('mobile objective panel wraps progress and keeps controls inside Residents rather than the world dock', async t => {
  const page = await fixture(t, { mobile: true }); await openResidents(page);
  await page.evaluate(() => ui.setGoalStatus('local:ada', { goalId: 'restored', revision: 7, objective: 'Visit the nearby person and stop.',
    status: 'paused', currentStep: 'Resume from the last saved physical result.', reason: 'Reloaded. Resume to continue without repeating the last action.',
    lastReceipt: { type: 'approach', status: 'arrived', requestId: 'receipt', at: Date.now() } }));
  const roster = page.getByRole('dialog', { name: 'Residents', exact: true });
  const panel = roster.locator('[data-agent-key="local:ada"] [data-resident-goal]'); await panel.locator('summary').click();
  assert.match(await panel.innerText(), /Approach · Reached stopping distance/);
  await panel.getByRole('button', { name: 'Resume objective for Ada', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => calls.find(call => call.type === 'goal-resume')),
    { type: 'goal-resume', key: 'local:ada', goalId: 'restored', expectedRevision: 7 });
  assert.equal(await page.locator('.cube-native-chat [data-resident-goal]').count(), 0);
  assert.equal(await roster.evaluate(element => element.scrollWidth <= element.clientWidth), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
});

test('standing social creation is opt-in, preserves custom fields, and resets for the next resident', async t => {
  const page = await fixture(t, { mobile: true }); await openResidents(page);
  const roster = page.getByRole('dialog', { name: 'Residents', exact: true });
  await roster.locator('summary').filter({ hasText: 'Place a resident' }).click();
  const panel = roster.locator('[data-standing-goal-fields]');
  assert.equal(await panel.evaluate(element => element.open), false);
  const self = roster.getByRole('checkbox', { name: 'Let resident update its personality, goals and appearance', exact: true });
  assert.equal(await self.isChecked(), false);
  await panel.locator('summary').click();
  const enabled = panel.getByRole('checkbox', { name: 'Enable standing social goal', exact: true });
  assert.equal(await enabled.isChecked(), false);
  await enabled.check(); await panel.getByRole('textbox', { name: 'Standing social objective', exact: true }).fill('Introduce yourself to visitors.');
  await panel.getByRole('combobox', { name: 'Standing social audience', exact: true }).selectOption('new-players'); await self.check();
  await roster.getByRole('textbox', { name: 'Resident name', exact: true }).fill('Welcome resident');
  assert.equal(await panel.evaluate(element => element.scrollWidth <= element.clientWidth), true);
  await roster.getByRole('button', { name: 'Place resident', exact: true }).click(); await roster.waitFor({ state: 'hidden' });
  const saved = await page.evaluate(() => calls.find(call => call.type === 'spawn').input);
  assert.deepEqual(saved.standingGoal, { id: 'social-goal-v1', enabled: true, objective: 'Introduce yourself to visitors.', target: 'new-players' });
  assert.equal(saved.selfModifiable, true); assert.equal(saved.initiateConversations, false); assert.equal(saved.respondToWorldChat, false);
  await openResidents(page); assert.equal(await panel.evaluate(element => element.open), false);
  assert.equal(await self.isChecked(), false); await panel.locator('summary').click();
  assert.equal(await enabled.isChecked(), false);
  assert.equal(await panel.getByRole('textbox', { name: 'Standing social objective', exact: true }).inputValue(), '');
  assert.equal(await panel.getByRole('combobox', { name: 'Standing social audience', exact: true }).inputValue(), 'owner');
});

test('guide edits retain standing goal identity and drafts across roster updates and allow opting out', async t => {
  const page = await fixture(t);
  await page.evaluate(() => {
    residents[0] = { ...residents[0], selfModifiable: true, standingGoal: { id: 'welcome-v1', enabled: true, objective: 'Welcome my owner.', target: 'owner' } };
    ui.setAgents(residents); ui.openResidents();
  });
  const roster = page.getByRole('dialog', { name: 'Residents', exact: true });
  await roster.getByRole('button', { name: 'Edit Ada', exact: true }).click();
  const editor = page.getByRole('dialog', { name: 'Edit resident', exact: true }), panel = editor.locator('[data-standing-goal-fields]');
  await panel.locator('summary').click();
  const objective = panel.getByRole('textbox', { name: 'Standing social objective', exact: true });
  const self = editor.getByRole('checkbox', { name: 'Let resident update its personality, goals and appearance', exact: true });
  assert.equal(await self.isChecked(), true); assert.equal(await objective.inputValue(), 'Welcome my owner.');
  await objective.fill('Show visitors how to chat.'); await objective.evaluate(element => element.setSelectionRange(5, 12));
  const sameNode = await page.evaluate(() => {
    const dialog = [...document.querySelectorAll('dialog[open]')].find(element => element.querySelector('h2')?.textContent === 'Edit resident');
    const control = dialog.querySelector('[aria-label="Standing social objective"]');
    for (let i = 0; i < 4; i++) {
      residents[0] = { ...residents[0], standingStatus: 'considering', standingGoal: { ...residents[0].standingGoal, objective: 'Fresh profile data' } };
      ui.setAgents(residents);
    }
    return control === dialog.querySelector('[aria-label="Standing social objective"]') && document.activeElement === control;
  });
  assert.equal(sameNode, true); assert.equal(await objective.inputValue(), 'Show visitors how to chat.');
  assert.deepEqual(await objective.evaluate(element => [element.selectionStart, element.selectionEnd]), [5, 12]);
  assert.equal(await panel.evaluate(element => element.open), true);
  await panel.getByRole('combobox', { name: 'Standing social audience', exact: true }).selectOption('new-players');
  await panel.getByRole('checkbox', { name: 'Enable standing social goal', exact: true }).uncheck(); await self.uncheck();
  await editor.getByRole('button', { name: 'Save resident', exact: true }).click(); await editor.waitFor({ state: 'hidden' });
  const saved = await page.evaluate(() => calls.find(call => call.type === 'edit').input);
  assert.deepEqual(saved.standingGoal, { id: 'welcome-v1', enabled: false, objective: 'Show visitors how to chat.', target: 'new-players' });
  assert.equal(saved.selfModifiable, false);
  await roster.getByRole('button', { name: 'Edit Ada', exact: true }).click(); await panel.locator('summary').click();
  assert.equal(await panel.getByRole('checkbox', { name: 'Enable standing social goal', exact: true }).isChecked(), false);
  await objective.fill(''); await editor.getByRole('button', { name: 'Save resident', exact: true }).click(); await editor.waitFor({ state: 'hidden' });
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'edit').at(-1).input.standingGoal),
    { id: 'welcome-v1', enabled: false, objective: '', target: 'new-players' });
});

test('standing objectives enforce UTF8 capacity and enabled text before calling the host', async t => {
  const page = await fixture(t); await openResidents(page);
  const roster = page.getByRole('dialog', { name: 'Residents', exact: true });
  await roster.locator('summary').filter({ hasText: 'Place a resident' }).click();
  await roster.getByRole('textbox', { name: 'Resident name', exact: true }).fill('Bounded resident');
  const panel = roster.locator('[data-standing-goal-fields]'); await panel.locator('summary').click();
  await panel.getByRole('checkbox', { name: 'Enable standing social goal', exact: true }).check();
  await roster.getByRole('button', { name: 'Place resident', exact: true }).click();
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'spawn').length), 0);
  assert.match(await roster.getByRole('status').innerText(), /needs an objective/);
  const objective = panel.getByRole('textbox', { name: 'Standing social objective', exact: true }); await objective.fill('é'.repeat(1025));
  await roster.getByRole('button', { name: 'Place resident', exact: true }).click();
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'spawn').length), 0);
  assert.match(await roster.getByRole('status').innerText(), /2048 UTF-8 bytes/);
  assert.equal(await objective.inputValue(), 'é'.repeat(1025));
  await objective.fill('é'.repeat(1024)); await roster.getByRole('button', { name: 'Place resident', exact: true }).click(); await roster.waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => new TextEncoder().encode(calls.find(call => call.type === 'spawn').input.standingGoal.objective).length), 2048);
});

test('standing and profile statuses are owner-only, bounded, and never promise remote delivery', async t => {
  const page = await fixture(t, { mobile: true });
  await page.evaluate(() => {
    residents[0] = { ...residents[0], selfModifiable: true, standingGoal: { id: 'welcome-v1', enabled: true, objective: 'PRIVATE_OWNER_OBJECTIVE', target: 'owner' } };
    residents[1] = { ...residents[1], selfModifiable: true, standingGoal: { id: 'welcome-v1', enabled: true, objective: 'PRIVATE_REMOTE_OBJECTIVE', target: 'owner' }, standingStatus: 'spoken', profileStatus: 'updated' };
    ui.setAgents(residents); ui.openResidents();
  });
  const roster = page.getByRole('dialog', { name: 'Residents', exact: true }), local = roster.locator('[data-agent-key="local:ada"]');
  assert.equal(await local.locator('[data-profile-status]').count(), 0);
  assert.equal(await roster.locator('[data-agent-key="peer:remote"] [data-standing-status], [data-agent-key="peer:remote"] [data-profile-status]').count(), 0);
  assert.equal(await roster.getByText('PRIVATE_REMOTE_OBJECTIVE', { exact: true }).count(), 0);
  for (const state of ['observing', 'waiting-for-model', 'considering', 'spoken', 'already-handled', 'quiet', 'unknown', 'blocked', 'failed', 'cooldown', 'disabled']) {
    await page.evaluate(state => { residents[0].standingStatus = state; ui.setAgents(residents); }, state);
    const note = local.locator('[data-standing-status]'); assert.equal(await note.getAttribute('data-standing-status'), state);
    assert.match(await note.innerText(), /Standing goal:/);
    if (state === 'spoken') assert.match(await note.innerText(), /peer delivery is not confirmed here/);
    if (state === 'unknown') assert.match(await note.innerText(), /will not repeat automatically/);
  }
  for (const state of ['updating', 'updated', 'failed', 'disabled']) {
    await page.evaluate(state => { residents[0].profileStatus = state; ui.setAgents(residents); }, state);
    assert.equal(await local.locator('[data-profile-status]').getAttribute('data-profile-status'), state);
  }
  await page.evaluate(() => { residents[0].standingStatus = '__proto__'; residents[0].profileStatus = '<img src=x onerror=alert(1)>'; ui.setAgents(residents); });
  assert.equal(await local.locator('img').count(), 0); assert.equal(await local.locator('[data-standing-status]').innerText(), 'Standing goal: Status unavailable.');
  assert.equal(await roster.evaluate(element => element.scrollWidth <= element.clientWidth), true);
});

test('guide controls respect busy state, failed save drafts, and loss of local ownership', async t => {
  const page = await fixture(t); await openResidents(page);
  const roster = page.getByRole('dialog', { name: 'Residents', exact: true });
  await roster.getByRole('button', { name: 'Edit Ada', exact: true }).click();
  const editor = page.getByRole('dialog', { name: 'Edit resident', exact: true }), panel = editor.locator('[data-standing-goal-fields]');
  await panel.locator('summary').click(); const objective = panel.getByRole('textbox', { name: 'Standing social objective', exact: true });
  await objective.fill('Remember this draft'); await panel.getByRole('checkbox', { name: 'Enable standing social goal', exact: true }).check();
  await page.evaluate(() => ui.setBusy(true));
  assert.equal(await objective.isDisabled(), true);
  assert.equal(await editor.getByRole('checkbox', { name: 'Let resident update its personality, goals and appearance', exact: true }).isDisabled(), true);
  await page.evaluate(() => { ui.setBusy(false); window.failEdit = true; });
  await editor.getByRole('button', { name: 'Save resident', exact: true }).click(); await editor.getByRole('status').filter({ hasText: 'Profile save failed' }).waitFor();
  assert.equal(await objective.inputValue(), 'Remember this draft'); assert.equal(await objective.isDisabled(), false);
  await page.evaluate(() => { residents[0].local = false; ui.setAgents(residents); }); await editor.waitFor({ state: 'hidden' });
  assert.equal(await roster.getByRole('button', { name: 'Edit Ada', exact: true }).count(), 0);
  assert.equal(await roster.locator('[data-agent-key="local:ada"] [data-standing-status]').count(), 0);
});

test('resident chat presents owner task progress and interrupt controls without opening Residents', async t => {
  const page = await fixture(t, { mobile: true });
  await page.evaluate(() => {
    ui.open(); ui.select(residents[0]);
    ui.setGoalStatus('local:ada', { goalId: 'task1', revision: 4, status: 'acting', objective: 'Explore then return.',
      requesterId: 'human:owner', plan: { version: 1, milestones: [{ label: 'Explore', type: 'move-to', position: [80, 3, 0] }] },
      completedMilestones: [], receipts: [] });
  });
  const task = page.getByRole('region', { name: 'Current resident task' });
  assert.match(await task.innerText(), /Step 1\/1: Explore/);
  await task.getByRole('button', { name: 'Pause task' }).click();
  assert.deepEqual(await page.evaluate(() => calls.find(c => c.type === 'goal-pause')),
    { type: 'goal-pause', key: 'local:ada', goalId: 'task1', expectedRevision: 4 });
  await page.evaluate(() => ui.setGoalStatus('local:ada', { goalId: 'task1', revision: 5, status: 'paused', objective: 'Explore then return.', reason: 'Owner paused' }));
  await task.getByRole('button', { name: 'Resume task' }).click();
  assert.equal(await page.evaluate(() => calls.find(c => c.type === 'goal-resume').expectedRevision), 5);
  await page.evaluate(() => ui.select(residents[1]));
  assert.equal(await task.isVisible(), false);
  await page.evaluate(() => ui.setGoalStatus('peer:remote', { goalId: 'foreign', revision: 6, status: 'paused' }));
  assert.equal(await task.isVisible(), false);
});

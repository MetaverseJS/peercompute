import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

let browser, server, origin, cache;
before(async () => {
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  cache = await mkdtemp(join(tmpdir(), 'peercompute-world-agent-ui-'));
  server = await createServer({ configFile: false, root: repo, cacheDir: cache, logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [repo] } },
    plugins: [{ name: 'world-agent-ui-fixture', configureServer(vite) {
      vite.middlewares.use('/__world_agents', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><button id="outside">World control</button>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => {
  const results = await Promise.allSettled([browser?.close(), server?.close()]);
  if (cache) await rm(cache, { recursive: true, force: true });
  for (const result of results) if (result.status === 'rejected') throw result.reason;
});

async function fixture(t, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 950 } });
  const page = await context.newPage(), errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    requests.push(route.request().url()); return route.abort();
  });
  t.after(async () => {
    await page.evaluate(() => window.ui?.dispose()); await context.close();
    assert.deepEqual(errors, []); assert.deepEqual(requests, []);
  });
  await page.goto(origin + '/__world_agents');
  await page.evaluate(async options => {
    await import('/demos/cubechat/src/style.css');
    await import('/demos/inference/src/panel.css');
    const { createWorldAgentUi } = await import('/demos/shared/agents/worldAgentUi.js');
    window.calls = []; window.fixtureOptions = options;
    window.local = { key: 'local:ada', agentId: 'ada', name: 'Ada', local: true, status: 'idle' };
    window.remote = { key: 'peer:bob', agentId: 'bob', name: 'Bob', local: false, status: 'idle' };
    window.heads = [local, remote];
    const capture = (type, value) => calls.push({ type, value });
    window.ui = createWorldAgentUi({ worldLabel: 'CubeChat',
      onOpen: () => { window.openedWithoutDialog = !ui.dialog.open; },
      onSpawn: async value => { capture('spawn', value); if (fixtureOptions.failSpawn) throw new Error('Identity could not be saved'); },
      onSelect: async key => { capture('select', key); ui.select(heads.find(item => item.key === key)); },
      onSend: async value => {
        capture('send', value); ui.setBusy(true);
        try {
          if (fixtureOptions.pendingSend) await new Promise((resolve, reject) => Object.assign(window, { finishSend: resolve, failSend: reject }));
          if (fixtureOptions.failSend) throw new Error('No model is available for this agent');
          ui.appendMessage('user', value.text); ui.appendMessage('assistant', 'A real host result goes here; this fixture does not run a model.');
        } finally { ui.setBusy(false); }
      },
      onModels: () => capture('models'),
      onVoice: async enabled => {
        capture('voice', enabled);
        if (enabled && fixtureOptions.pendingVoice) {
          ui.setVoiceStatus({ preparing: true });
          await new Promise((resolve, reject) => Object.assign(window, { finishVoice: resolve, failVoice: reject }));
        } else ui.setVoiceStatus({ enabled, recording: false, preparing: false });
      },
      onRecord: async value => { capture('record', value); ui.setVoiceStatus({ enabled: true, recording: value.recording, preparing: false }); },
      onCancel: async () => {
        capture('cancel');
        if (fixtureOptions.pendingCancel) await new Promise(resolve => { window.finishCancel = resolve; });
        if (fixtureOptions.failCancel) throw new Error('Cancellation cleanup is incomplete');
        window.failSend?.(new DOMException('Cancelled', 'AbortError'));
      },
      onClose: async () => {
        capture('close');
        if (fixtureOptions.pendingClose) await new Promise(resolve => { window.finishClose = resolve; });
        if (fixtureOptions.failClose) throw new Error('Voice cleanup is incomplete');
      },
      onRemove: key => capture('remove', key), onResume: key => capture('resume', key),
    });
    ui.setAgents(heads);
  }, options);
  return page;
}
const dialog = page => page.getByRole('dialog', { name: 'Agents · CubeChat', exact: true });
async function open(page) { await page.getByRole('button', { name: 'Agents', exact: true }).click(); }
async function choose(page, name = 'Ada') { await dialog(page).getByRole('button', { name: `${name} ${name === 'Ada' ? 'Local' : 'Peer'} agent`, exact: true }).click(); }

test('opening has no model, speech or execution side effects; spawn defaults disclose peer routing and sharing', async t => {
  const page = await fixture(t);
  assert.deepEqual(await page.evaluate(() => calls), []);
  await open(page);
  assert.equal(await page.evaluate(() => openedWithoutDialog), true);
  assert.deepEqual(await page.evaluate(() => calls), []);
  await dialog(page).locator('summary').click();
  assert.equal(await page.getByLabel('Use only models on this device').isChecked(), false);
  assert.equal(await page.getByLabel('Let peers talk to this agent').isChecked(), true);
  assert.match(await dialog(page).textContent(), /context may be sent to an inference host/);
  await page.getByLabel('Agent name', { exact: true }).fill('Helper');
  await page.getByLabel('Agent goals', { exact: true }).fill('Explain the world\n Answer briefly');
  await page.getByRole('button', { name: 'Place agent', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => calls), [{ type: 'spawn', value: { name: 'Helper', goals: ['Explain the world', 'Answer briefly'], localOnly: false, shared: true } }]);
});

test('native Enter sends once, Shift+Enter preserves a newline, and successful replies scroll into view', async t => {
  const page = await fixture(t); await open(page); await choose(page);
  const prompt = page.getByLabel('Message to agent', { exact: true });
  await prompt.fill('First line'); await prompt.press('Shift+Enter'); await page.keyboard.type('Second line');
  assert.equal(await prompt.inputValue(), 'First line\nSecond line');
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'send').length), 0);
  await prompt.press('Enter');
  await page.waitForFunction(() => document.querySelector('.pc-world-agent-composer textarea').value === '');
  assert.deepEqual(await page.evaluate(() => calls.find(call => call.type === 'send').value), { key: 'local:ada', text: 'First line\nSecond line', voiceReply: false });
  await page.evaluate(() => { for (let i = 0; i < 40; i++) ui.appendMessage('assistant', 'Reply ' + i + ' '.repeat(4) + 'Word '.repeat(80)); });
  assert.equal(await page.getByRole('log', { name: 'Agent conversation' }).locator('article').count(), 32);
  assert.ok(await page.getByRole('log', { name: 'Agent conversation' }).evaluate(node => node.scrollHeight - node.scrollTop - node.clientHeight < 3));
});

test('paused and interrupted owned agents require explicit resume; remote agents have no ownership controls', async t => {
  const page = await fixture(t); await open(page);
  await page.evaluate(() => { local.status = 'paused'; ui.setAgents(heads); ui.select(local); });
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => calls.at(-1)), { type: 'resume', value: 'local:ada' });
  await page.evaluate(() => { local.recoveryRequired = true; ui.setAgents(heads); });
  assert.match(await dialog(page).textContent(), /unknown outcome/);
  await page.getByRole('button', { name: 'Acknowledge and resume', exact: true }).click();
  await page.evaluate(() => { remote.status = 'paused'; ui.setAgents(heads); ui.select(remote); });
  assert.equal(await page.getByRole('button', { name: 'Remove body', exact: true }).isVisible(), false);
  assert.equal(await page.getByRole('button', { name: /resume/i }).count(), 0);
  assert.match(await dialog(page).textContent(), /paused by its host/);
  assert.equal(await page.evaluate(() => calls.some(call => call.type === 'send')), false);
});

test('periodic discovery keeps selection, focused row and draft while updating names and ownership labels', async t => {
  const page = await fixture(t); await open(page); await choose(page);
  await page.getByLabel('Message to agent', { exact: true }).fill('Unsent draft');
  await page.locator('[data-agent-key="local:ada"]').focus();
  await page.evaluate(() => { local.name = 'Ada renamed'; for (let i = 0; i < 3; i++) ui.setAgents([...heads].reverse()); });
  assert.equal(await page.evaluate(() => document.activeElement.dataset.agentKey), 'local:ada');
  assert.equal(await page.locator('[aria-current="true"]').getAttribute('data-agent-key'), 'local:ada');
  assert.equal(await page.getByLabel('Message to agent', { exact: true }).inputValue(), 'Unsent draft');
  assert.equal(await page.evaluate(() => calls.filter(call => call.type !== 'select').length), 0);
  await page.evaluate(() => ui.setAgents([remote]));
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
});

test('pending cancellation stays visible and disabled until cleanup completes, without accepting duplicate sends', async t => {
  const page = await fixture(t, { pendingSend: true, pendingCancel: true }); await open(page); await choose(page);
  await page.getByLabel('Message to agent', { exact: true }).fill('Wait for me');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => Boolean(window.finishSend));
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Cancelling…', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  await page.evaluate(() => finishCancel());
  await page.waitForFunction(() => !document.querySelector('.pc-world-agent-composer textarea').disabled);
  assert.equal(await page.getByLabel('Message to agent', { exact: true }).inputValue(), 'Wait for me');
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'send').length), 1);
});

test('generation and storage failures stay readable and preserve the retry draft', async t => {
  const page = await fixture(t, { failSend: true, failSpawn: true }); await open(page); await choose(page);
  await page.getByLabel('Message to agent', { exact: true }).fill('A retryable question');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('No model'));
  assert.equal(await page.getByLabel('Message to agent', { exact: true }).inputValue(), 'A retryable question');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  await dialog(page).locator('summary').click(); await page.getByLabel('Agent name', { exact: true }).fill('Kept draft');
  await page.getByRole('button', { name: 'Place agent', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('could not be saved'));
  assert.equal(await page.getByLabel('Agent name', { exact: true }).inputValue(), 'Kept draft');
});

test('failed cancellation retains busy controls and exposes retry instead of reporting success', async t => {
  const page = await fixture(t, { pendingSend: true, failCancel: true }); await open(page); await choose(page);
  await page.getByLabel('Message to agent', { exact: true }).fill('Keep this draft');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('cleanup is incomplete'));
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Cancel', exact: true }).isEnabled(), true);
  await page.evaluate(() => { fixtureOptions.failCancel = false; });
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.pc-world-agent-composer textarea').disabled);
  assert.equal(await page.getByLabel('Message to agent', { exact: true }).inputValue(), 'Keep this draft');
});

test('voice preparation is explicit and cancellable, while its stale failure cannot replace the current status', async t => {
  const page = await fixture(t, { pendingVoice: true }); await open(page); await choose(page);
  assert.match(await dialog(page).textContent(), /about 376 MB/);
  assert.equal(await page.getByRole('button', { name: 'Talk', exact: true }).isDisabled(), true);
  await page.getByLabel('Enable voice', { exact: true }).check();
  await page.waitForFunction(() => Boolean(window.failVoice));
  assert.equal(await page.getByLabel('Enable voice', { exact: true }).isEnabled(), true);
  await page.getByLabel('Message to agent', { exact: true }).fill('Text can still be sent');
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isEnabled(), true);
  await page.getByLabel('Enable voice', { exact: true }).uncheck();
  await page.evaluate(() => { ui.setStatus('Voice preparation cancelled'); failVoice(new Error('Late preparation failure')); });
  await page.waitForTimeout(20);
  assert.equal(await page.getByRole('status').textContent(), 'Voice preparation cancelled');
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'voice').map(call => call.value)), [true, false]);
});

test('enabled voice defaults to spoken replies, Talk and Stop pass the selected agent and explicit capture intent', async t => {
  const page = await fixture(t); await open(page); await choose(page, 'Bob');
  await page.getByLabel('Enable voice', { exact: true }).check();
  assert.equal(await page.getByLabel('Speak replies', { exact: true }).isChecked(), true);
  await page.getByRole('button', { name: 'Talk', exact: true }).click();
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => calls.filter(call => call.type === 'record').map(call => call.value)), [
    { key: 'peer:bob', recording: true, voiceReply: true }, { key: 'peer:bob', recording: false, voiceReply: true },
  ]);
  await page.getByLabel('Speak replies', { exact: true }).uncheck();
  await page.getByLabel('Message to agent', { exact: true }).fill('Text response please');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  assert.equal(await page.evaluate(() => calls.find(call => call.type === 'send').value.voiceReply), false);
});

test('Escape waits for close cleanup and restores focus without removing the host or agent controls', async t => {
  const page = await fixture(t, { pendingClose: true }); await open(page); await choose(page);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => Boolean(window.finishClose));
  assert.equal(await dialog(page).isVisible(), true);
  assert.equal(await page.getByRole('button', { name: 'Closing…', exact: true }).isDisabled(), true);
  await page.evaluate(() => finishClose());
  await dialog(page).waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Agents');
  await open(page);
  assert.equal(await page.locator('[data-agent-key]').count(), 2);
  assert.deepEqual(await page.evaluate(() => calls.filter(call => !['select', 'close'].includes(call.type))), []);
  for (let index = 0; index < 16; index++) { await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => ui.dialog.contains(document.activeElement)), true); }
});

test('failed close remains open for retry; disposing ignores late work and removes only this UI', async t => {
  const page = await fixture(t, { failClose: true }); await open(page);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('cleanup is incomplete'));
  assert.equal(await dialog(page).isVisible(), true);
  await page.evaluate(async () => { fixtureOptions.failClose = false; await ui.close(); ui.dispose(); ui.dispose(); ui.setStatus('Late callback'); ui.setAgents([]); });
  assert.equal(await page.locator('.pc-world-agent-ui').count(), 0);
  assert.equal(await page.locator('#outside').count(), 1);
});

test('native mobile and desktop layout wraps long names and messages with usable conversation actions', async t => {
  const page = await fixture(t); await open(page);
  await page.evaluate(() => {
    local.name = 'VeryLongUnbrokenAgentName'.repeat(8); ui.setAgents(heads); ui.select(local);
    ui.setMessages([{ role: 'user', text: '<img src=x onerror=alert(1)>' }, { role: 'assistant', text: 'A long reply '.repeat(80) }]);
  });
  assert.equal(await dialog(page).locator('img').count(), 0);
  const evidence = process.env.WORLD_AGENT_UI_EVIDENCE;
  if (evidence) { await mkdir(evidence, { recursive: true }); await page.screenshot({ path: join(evidence, 'world-agents-desktop.png'), fullPage: true }); }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel('Message to agent', { exact: true }).fill('A mobile message');
  await page.getByRole('button', { name: 'Send', exact: true }).scrollIntoViewIfNeeded();
  const bounds = await dialog(page).evaluate(node => {
    const box = node.getBoundingClientRect();
    const buttons = [...node.querySelectorAll('button')].filter(button => button.offsetParent !== null);
    return { x: box.x, right: box.right, bottom: box.bottom, width: innerWidth, height: innerHeight,
      noOverflow: node.scrollWidth <= node.clientWidth + 1,
      wrappedRows: [...node.querySelectorAll('[data-agent-key]')].every(button => button.scrollWidth <= button.clientWidth + 1),
      controlsWithin: buttons.every(button => { const b = button.getBoundingClientRect(); return b.x >= box.x - 1 && b.right <= box.right + 1; }) };
  });
  assert.ok(bounds.x >= 0 && bounds.right <= bounds.width && bounds.bottom <= bounds.height, JSON.stringify(bounds));
  assert.equal(bounds.noOverflow, true); assert.equal(bounds.wrappedRows, true); assert.equal(bounds.controlsWithin, true);
  if (evidence) await page.screenshot({ path: join(evidence, 'world-agents-mobile.png'), fullPage: true });
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  assert.equal(await page.evaluate(() => calls.filter(call => call.type === 'send').length), 1);
});

import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

let server, browser, origin;
before(async () => {
  const modules = new Map(await Promise.all(['chatChannels.js', 'globalChatFeed.js', 'generatedImages.js'].map(async (name) => [
    `/${name}`, (await readFile(new URL(`../inference/src/ui/${name}`, import.meta.url), 'utf8')).replace("import './chatChannels.css';", ''),
  ])));
  const css = await readFile(new URL('../inference/src/ui/chatChannels.css', import.meta.url), 'utf8');
  const panelCss = await readFile(new URL('../inference/src/panel.css', import.meta.url), 'utf8');
  server = createServer((request, response) => {
    if (modules.has(request.url)) { response.setHeader('Content-Type', 'text/javascript'); response.end(modules.get(request.url)); return; }
    if (request.url === '/style.css') { response.setHeader('Content-Type', 'text/css'); response.end(panelCss + '\n' + css); return; }
    response.setHeader('Content-Type', 'text/html');
    response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"><style>body{margin:0}.pc-inference-panel{height:100dvh;min-height:0}</style><main class="pc-inference-panel"><div class="pc-inference-transcript" role="log" aria-label="Conversation"><p class="pc-chat-empty">Private empty state</p></div><textarea aria-label="Message"></textarea></main>');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve)); origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await new Promise((resolve) => server?.close(resolve)); });

async function fixture(t, options = {}) {
  const page = await browser.newPage({ viewport: options.viewport ?? { width: 1000, height: 700 } }), errors = [], external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => {
    if (route.request().url().startsWith(origin + '/')) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  t.after(async () => {
    await page.evaluate(() => { feed?.dispose(); channels?.dispose(); }).catch(() => {});
    await page.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  });
  await page.goto(origin);
  await page.evaluate(async (options) => {
    const { createChatChannels, normalizeChatName } = await import('/chatChannels.js');
    const { createGlobalChatFeed } = await import('/globalChatFeed.js');
    window.normalizeChatName = normalizeChatName;
    const createURL = URL.createObjectURL.bind(URL), revokeURL = URL.revokeObjectURL.bind(URL);
    window.urls = { created: [], revoked: [] };
    URL.createObjectURL = (blob) => { const url = createURL(blob); urls.created.push(url); return url; };
    URL.revokeObjectURL = (url) => { urls.revoked.push(url); return revokeURL(url); };
    window.panel = document.querySelector('main'); window.prompt = document.querySelector('textarea');
    window.personalView = { transcript: document.querySelector('[role=log]'), empty: document.querySelector('.pc-chat-empty') };
    window.selections = []; window.attachment = null;
    window.channels = createChatChannels({ panel, personalView,
      ...(options.noStorage ? { storage: { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } } } : {}),
      onSelect({ previous, current }) {
        previous.draft = { text: prompt.value, attachment }; prompt.value = current.draft.text; attachment = current.draft.attachment;
        selections.push([previous.id, current.id]);
      },
    });
    window.feed = createGlobalChatFeed({ ...channels.getChannel('global').view, maxTurns: options.maxTurns ?? 60 });
    window.event = (phase = 'prompt', extra = {}) => ({ peerId: 'peer-A', turnId: 'turn-1', id: crypto.randomUUID(), phase,
      name: 'Alice', text: phase === 'prompt' ? 'Hello' : 'A model reply', ...extra });
    window.pixel = (red = 255) => ({ data: new Uint8Array([red, 0, 255 - red, 255]), width: 1, height: 1, channels: 4 });
    window.speech = () => ({ samples: new Float32Array([0, 0.5, -0.5, 2, -2]), sampleRate: 16000 });
    if (options.openGlobal !== false) channels.select('global');
  }, options);
  return page;
}

test('Personal is initially selected, Global requires selection and keeps separate context and composer drafts', async (t) => {
  const page = await fixture(t, { openGlobal: false });
  assert.equal(await page.getByRole('tab', { name: 'Personal', exact: true }).getAttribute('aria-selected'), 'true');
  assert.deepEqual(await page.getByRole('tab').allTextContents(), ['Personal', 'Global']);
  assert.equal(await page.getByRole('log', { name: 'Global conversation', includeHidden: true }).isVisible(), false);
  assert.equal(await page.getByRole('log', { name: 'Conversation', exact: true }).isVisible(), true);
  assert.equal(await page.getByRole('textbox', { name: 'Display name' }).count(), 0);
  const state = await page.evaluate(() => {
    prompt.value = 'Private draft'; attachment = { name: 'private.png' };
    channels.getChannel('personal').histories.set('mixed', [{ content: 'private context' }]);
    personalView.transcript.append(Object.assign(document.createElement('p'), { textContent: 'Private response' }));
    channels.select('global');
    prompt.value = 'Public draft'; attachment = { name: 'public.png' };
    channels.getChannel('global').histories.set('mixed', [{ content: 'public context' }]);
    channels.select('personal');
    return { active: channels.active, text: prompt.value, attachment, selections,
      publicContext: channels.getChannel('global').histories.get('mixed'), privateContext: channels.getChannel('personal').histories.get('mixed'),
      publicText: channels.getChannel('global').view.transcript.textContent };
  });
  assert.equal(state.active, 'personal'); assert.equal(state.text, 'Private draft'); assert.equal(state.attachment.name, 'private.png');
  assert.equal(state.publicContext[0].content, 'public context'); assert.equal(state.privateContext[0].content, 'private context');
  assert(!state.publicText.includes('Private')); assert.deepEqual(state.selections, [['personal', 'global'], ['global', 'personal']]);
  await page.getByRole('tab', { name: 'Global', exact: true }).click();
  assert.equal(await page.getByRole('textbox', { name: 'Message', exact: true }).inputValue(), 'Public draft');
  assert.equal(await page.getByRole('textbox', { name: 'Display name' }).count(), 1);
});

test('tab keyboard navigation and busy state preserve an immutable submission origin', async (t) => {
  const page = await fixture(t, { openGlobal: false });
  await page.getByRole('tab', { name: 'Personal', exact: true }).focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tab', { name: 'Global', exact: true }).evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press('Home');
  assert.equal(await page.getByRole('tab', { name: 'Personal', exact: true }).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('End');
  const state = await page.evaluate(() => {
    channels.nameInput.value = 'Frozen author'; const origin = { channel: channels.getChannel(channels.active), name: channels.getName() };
    channels.setBusy(true); const changed = channels.select('personal');
    return { changed, active: channels.active, name: origin.name, id: origin.channel.id, disabled: Object.values(channels.tabs).every((tab) => tab.disabled), nameDisabled: channels.nameInput.disabled };
  });
  assert.deepEqual(state, { changed: false, active: 'global', name: 'Frozen author', id: 'global', disabled: true, nameDisabled: true });
  await page.evaluate(() => channels.setBusy(false)); await page.getByRole('tab', { name: 'Personal', exact: true }).click();
  assert.equal(await page.getByRole('tab', { name: 'Personal', exact: true }).getAttribute('aria-selected'), 'true');
});

test('display name is persisted, UTF-8 bounded and optional even with storage denied', async (t) => {
  const page = await fixture(t);
  const saved = await page.evaluate(() => {
    channels.nameInput.value = '  <b>Alice</b> ' + '🦊'.repeat(40);
    const name = channels.getName(); return { name, bytes: new TextEncoder().encode(name).length, saved: localStorage.getItem('peercompute:inference:display-name:v1') };
  });
  assert(saved.bytes <= 80); assert(saved.name.startsWith('<b>Alice</b> ')); assert.equal(saved.name, saved.saved);
  assert.equal(await page.locator('.pc-chat-channels b').count(), 0);
  const persisted = await page.evaluate(async () => {
    feed.dispose(); channels.dispose();
    const { createChatChannels } = await import('/chatChannels.js'); channels = createChatChannels({ panel, personalView }); return channels.getName();
  });
  assert.equal(persisted, saved.name);
  const noStorage = await fixture(t, { noStorage: true });
  assert.equal(await noStorage.evaluate(() => { channels.nameInput.value = 'Guest'; return channels.getName(); }), 'Guest');
});

test('public authors and replies are inert text, separate by authenticated peer, and tolerate result-before-prompt', async (t) => {
  const page = await fixture(t);
  const state = await page.evaluate(async () => {
    await feed.append(event('result', { name: '<img src=x onerror=alert(1)>', modelName: '<script>model</script>', text: '<b>reply</b>' }));
    await feed.append(event('prompt', { name: '<img src=x onerror=alert(1)>', text: '<a href=https://evil.test>prompt</a>' }));
    await feed.append(event('prompt', { text: 'Duplicate must not replace original' }));
    await feed.append(event('prompt', { peerId: 'peer-B', text: 'Other authenticated sender' }));
    return { size: feed.size, text: channels.getChannel('global').view.transcript.textContent, privateText: personalView.transcript.textContent };
  });
  assert.equal(state.size, 2); assert.match(state.text, /<b>reply<\/b>/); assert.match(state.text, /<a href=https:\/\/evil.test>prompt<\/a>/);
  assert(!state.text.includes('Duplicate must')); assert.equal(state.privateText, 'Private empty state');
  assert.equal(await page.locator('.pc-global-turn img,.pc-global-turn script,.pc-global-turn a').count(), 0);
  assert.equal(await page.locator('.pc-global-pending:visible').count(), 1);
});

test('Global prompt and result images preserve their actual different pixels', async (t) => {
  const page = await fixture(t);
  const colors = await page.evaluate(async () => {
    await feed.append(event('prompt', { image: pixel(255) })); await feed.append(event('result', { image: pixel(0), text: '' }));
    const colors = [];
    for (const image of document.querySelectorAll('.pc-global-turn img')) {
      await image.decode(); const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0); colors.push([...context.getImageData(0, 0, 1, 1).data]);
    }
    return colors;
  });
  assert.deepEqual(colors, [[255, 0, 0, 255], [0, 0, 255, 255]]);
  assert.equal(await page.getByAltText('Image attached by Alice').count(), 1);
});

test('speech is a bounded playable WAV, ordered and deduplicated without autoplay', async (t) => {
  const page = await fixture(t);
  const state = await page.evaluate(async () => {
    await feed.append(event('audio', { part: 1, audio: speech() })); await feed.append(event('audio', { part: 0, audio: speech() }));
    await feed.append(event('audio', { part: 1, audio: speech() }));
    const audios = [...document.querySelectorAll('.pc-global-audio')], bytes = await (await fetch(audios[0].src)).arrayBuffer();
    const view = new DataView(bytes);
    return { count: audios.length, controls: audios.every((audio) => audio.controls), paused: audios.every((audio) => audio.paused),
      autoplay: audios.some((audio) => audio.autoplay), order: audios.map((audio) => Number(audio.parentElement.dataset.part)),
      type: new TextDecoder().decode(bytes.slice(0, 4)), sampleRate: view.getUint32(24, true),
      samples: Array.from({ length: 5 }, (_, i) => view.getInt16(44 + i * 2, true)) };
  });
  assert.deepEqual(state, { count: 2, controls: true, paused: true, autoplay: false, order: [0, 1], type: 'RIFF', sampleRate: 16000, samples: [0, 16384, -16384, 32767, -32768] });
});

test('public feed updates leave a Personal draft and transcript unchanged', async (t) => {
  const page = await fixture(t);
  const state = await page.evaluate(async () => {
    channels.select('personal'); prompt.value = 'Never publish this'; attachment = { name: 'private.png' };
    personalView.transcript.textContent = 'Private saved memory';
    await feed.append(event('prompt')); await feed.append(event('result', { image: pixel() }));
    return { active: channels.active, draft: prompt.value, attachment, privateText: personalView.transcript.textContent,
      privateHistory: channels.getChannel('personal').histories.size, publicHistory: channels.getChannel('global').histories.size,
      publicText: channels.getChannel('global').view.transcript.textContent };
  });
  assert.equal(state.active, 'personal'); assert.equal(state.draft, 'Never publish this'); assert.equal(state.attachment.name, 'private.png');
  assert.equal(state.privateText, 'Private saved memory'); assert.equal(state.privateHistory, 0); assert.equal(state.publicHistory, 0);
  assert(!state.publicText.includes('Never publish')); assert(!state.publicText.includes('Private saved'));
});

test('retention, clear and disposal revoke owned media without touching Personal content', async (t) => {
  const page = await fixture(t, { maxTurns: 2 });
  const state = await page.evaluate(async () => {
    await feed.append(event('prompt', { image: pixel() })); await feed.append(event('audio', { part: 0, audio: speech() }));
    await feed.append(event('prompt', { turnId: 'turn-2' })); await feed.append(event('prompt', { turnId: 'turn-3' }));
    const afterEviction = { size: feed.size, revoked: urls.revoked.length };
    await feed.append(event('result', { turnId: 'turn-3', image: pixel() })); feed.clear();
    const afterClear = { size: feed.size, empty: document.querySelectorAll('.pc-global-turn').length };
    await feed.append(event('audio', { turnId: 'turn-4', part: 0, audio: speech() })); feed.dispose(); feed.dispose();
    await feed.append(event('prompt'));
    return { afterEviction, afterClear, created: urls.created, revoked: urls.revoked, privateText: personalView.transcript.textContent, size: feed.size };
  });
  assert.deepEqual(state.afterEviction, { size: 2, revoked: 2 }); assert.deepEqual(state.afterClear, { size: 0, empty: 0 });
  assert.deepEqual(new Set(state.revoked), new Set(state.created)); assert.equal(state.revoked.length, state.created.length);
  assert.equal(state.privateText, 'Private empty state'); assert.equal(state.size, 0);
});

test('clearing during image encoding cannot attach a late image or leak an object URL', async (t) => {
  const page = await fixture(t);
  const state = await page.evaluate(async () => {
    const original = OffscreenCanvas.prototype.convertToBlob;
    let release;
    OffscreenCanvas.prototype.convertToBlob = async function (...args) { const blob = await original.apply(this, args); await new Promise((resolve) => { release = resolve; }); return blob; };
    const pending = feed.append(event('result', { image: pixel() }));
    while (!release) await new Promise((resolve) => setTimeout(resolve, 5));
    feed.clear(); release(); await pending; OffscreenCanvas.prototype.convertToBlob = original;
    return { size: feed.size, images: document.querySelectorAll('.pc-global-turn img').length, created: urls.created.length };
  });
  assert.deepEqual(state, { size: 0, images: 0, created: 0 });
});

test('malformed media, names, identities and large payloads never create public rows', async (t) => {
  const page = await fixture(t);
  const state = await page.evaluate(async () => {
    const invalid = [event('prompt', { image: 'https://evil.test/pixels.png' }), event('prompt', { image: { ...pixel(), width: 2048 } }),
      event('prompt', { name: '🦊'.repeat(21) }), event('prompt', { peerId: '' }), event('prompt', { turnId: '../../bad' }),
      event('prompt', { text: 'x'.repeat(65537) }), event('audio', { part: 0, audio: { samples: new Float32Array([NaN]), sampleRate: 16000 } }),
      event('audio', { part: 1024, audio: speech() }), event('audio', { part: 0, audio: { samples: new Float32Array(48000 * 30 + 1), sampleRate: 48000 } })];
    let failures = 0; for (const item of invalid) try { await feed.append(item); } catch { failures++; }
    return { failures, count: invalid.length, size: feed.size, urls: urls.created.length };
  });
  assert.equal(state.failures, state.count); assert.equal(state.size, 0); assert.equal(state.urls, 0);
});

test('speech preview and DOM part budgets remain bounded under a long public response', async (t) => {
  const page = await fixture(t);
  const state = await page.evaluate(async () => {
    for (let part = 0; part < 40; part++) await feed.append(event('audio', { part, audio: speech() }));
    return { parts: document.querySelector('.pc-global-audio-parts').children.length, audios: document.querySelectorAll('audio').length,
      live: urls.created.length - urls.revoked.length };
  });
  assert.deepEqual(state, { parts: 32, audios: 8, live: 8 });
});

test('mobile channels, long text, images and audio fit the available window', async (t) => {
  const page = await fixture(t, { viewport: { width: 320, height: 640 } });
  await page.evaluate(async () => {
    channels.nameInput.value = 'A'.repeat(80); channels.setStatus('Connected · ' + 'x'.repeat(200));
    await feed.append(event('prompt', { text: 'x'.repeat(1000), image: pixel() }));
    await feed.append(event('audio', { part: 0, audio: speech() }));
  });
  const geometry = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth,
    panels: [...document.querySelectorAll('.pc-chat-channels,.pc-global-audio')].map((element) => ({ left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right })) }));
  assert(geometry.document <= geometry.viewport);
  for (const box of geometry.panels) { assert(box.left >= 0); assert(box.right <= geometry.viewport); }
});

import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

let server, browser, origin;
before(async () => {
  const modules = new Map(await Promise.all([
    ['/chatImageInput.js', '../inference/src/ui/chatImageInput.js'],
    ['/imageAttachment.js', '../inference/src/ui/imageAttachment.js'],
  ].map(async ([url, file]) => [url, await readFile(new URL(file, import.meta.url), 'utf8')])));
  server = createServer((request, response) => {
    if (modules.has(request.url)) { response.setHeader('Content-Type', 'text/javascript'); response.end(modules.get(request.url)); return; }
    response.setHeader('Content-Type', 'text/html'); response.end('<!doctype html><title>Owned image input fixture</title><textarea aria-label="Message"></textarea>');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await new Promise((resolve) => server?.close(resolve)); });

async function fixture(t, options = {}) {
  const page = await browser.newPage(), pageErrors = [], externalRequests = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('**/*', (route) => {
    if (route.request().url().startsWith(origin + '/')) return route.continue();
    externalRequests.push(route.request().url()); return route.abort();
  });
  t.after(async () => {
    await page.evaluate(async () => {
      await binding.dispose(); for (const resolve of heldDecodes.values()) resolve();
      for (const url of blobUrls) URL.revokeObjectURL(url);
    }).catch(() => {});
    await page.close(); assert.deepEqual(pageErrors, []); assert.deepEqual(externalRequests, []);
  });
  await page.goto(origin);
  await page.evaluate(async (options) => {
    const { bindChatImageInput } = await import('/chatImageInput.js');
    const { readImageAttachment } = await import('/imageAttachment.js');
    window.state = { accepted: [], errors: [], pending: [], fetches: [], allowed: true, fileSignals: [] };
    window.blobUrls = []; window.heldDecodes = new Map(); window.holdNames = new Set();
    window.textarea = document.querySelector('textarea');
    window.makeFile = async (name = 'image.png', color = 'red', width = 2, height = 1) => {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const context = canvas.getContext('2d'); context.fillStyle = color; context.fillRect(0, 0, width, height);
      return new File([await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))], name, { type: 'image/png' });
    };
    window.eventFor = (kind, transfer) => kind === 'paste'
      ? new ClipboardEvent('paste', { clipboardData: transfer, bubbles: true, cancelable: true })
      : new DragEvent(kind, { dataTransfer: transfer, bubbles: true, cancelable: true });
    window.dispatch = (kind, transfer) => { const event = eventFor(kind, transfer); textarea.dispatchEvent(event); return event.defaultPrevented; };
    window.binding = bindChatImageInput({ textarea, timeoutMs: options.timeoutMs ?? 1000,
      canAccept: () => state.allowed, onError: (error) => state.errors.push({ message: error.message, code: error.code }),
      onPendingChange: (pending) => state.pending.push(pending),
      fetchImpl: (url, fetchOptions) => { state.fetches.push(url); return window.fetchOverride ? fetchOverride(url, fetchOptions) : fetch(url, fetchOptions); },
      async onFile(file, { signal, source }) {
        state.fileSignals.push(signal);
        if (holdNames.has(file.name)) await new Promise((resolve) => heldDecodes.set(file.name, resolve));
        const decoded = await readImageAttachment(file, { signal }); signal.throwIfAborted();
        state.accepted.push({ name: decoded.name, source, width: decoded.image.width, height: decoded.image.height,
          pixel: [...decoded.image.data.slice(0, 4)] });
      },
    });
  }, options);
  return page;
}

test('native clipboard File wins over accompanying remote HTML and URL, using the existing bounded image decoder', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    textarea.value = 'Describe this: ';
    const transfer = new DataTransfer(); transfer.items.add(await makeFile('wide.png', 'red', 1024, 512));
    transfer.setData('text/html', '<img src="https://untrusted.example/image.png">');
    transfer.setData('text/plain', 'blob:https://untrusted.example/ignored');
    const prevented = dispatch('paste', transfer); await binding.whenIdle();
    return { prevented, text: textarea.value, ...state };
  });
  assert.equal(result.prevented, true); assert.equal(result.text, 'Describe this: ');
  assert.deepEqual(result.accepted, [{ name: 'wide.png', source: 'paste', width: 512, height: 256, pixel: [255, 0, 0, 255] }]);
  assert.deepEqual(result.fetches, []); assert.deepEqual(result.errors, []); assert.deepEqual(result.pending, [true, false]);
});

test('native image dragover/drop attaches one image without inserting its URL or changing the prompt', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    textarea.value = 'Existing text';
    const transfer = new DataTransfer(); transfer.items.add(await makeFile('blue.png', 'blue'));
    transfer.setData('text/uri-list', 'https://untrusted.example/not-fetched');
    const over = dispatch('dragover', transfer), drop = dispatch('drop', transfer); await binding.whenIdle();
    return { over, drop, text: textarea.value, ...state };
  });
  assert(result.over && result.drop); assert.equal(result.text, 'Existing text');
  assert.equal(result.accepted[0].source, 'drop'); assert.deepEqual(result.accepted[0].pixel, [0, 0, 255, 255]);
  assert.deepEqual(result.errors, []); assert.deepEqual(result.fetches, []);
});

test('ordinary clipboard text, web links and text drags preserve native insertion and undo behavior', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(() => {
    textarea.value = 'keep'; textarea.setSelectionRange(1, 3);
    const outcomes = [];
    for (const text of ['Hello world', 'https://example.com/image.png', 'Discuss blob URLs in this paragraph.']) {
      const transfer = new DataTransfer(); transfer.setData('text/plain', text);
      outcomes.push(dispatch('paste', transfer), dispatch('dragover', transfer), dispatch('drop', transfer));
    }
    const rich = new DataTransfer(); rich.setData('text/html', '<strong>ordinary text</strong>'); rich.setData('text/plain', 'ordinary text');
    outcomes.push(dispatch('paste', rich));
    return { outcomes, value: textarea.value, start: textarea.selectionStart, end: textarea.selectionEnd, ...state };
  });
  assert(result.outcomes.every((prevented) => !prevented));
  assert.equal(result.value, 'keep'); assert.equal(result.start, 1); assert.equal(result.end, 3);
  assert.deepEqual(result.accepted, []); assert.deepEqual(result.fetches, []); assert.deepEqual(result.pending, []);
});

test('same-origin blob images in HTML, plain text and URI drops become actual image files', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const url = URL.createObjectURL(await makeFile('source.png', 'lime')); blobUrls.push(url);
    const formats = [['paste', 'text/html', `<img src="${url}">`], ['paste', 'text/plain', url], ['drop', 'text/uri-list', `# dragged image\r\n${url}`]];
    const prevented = [];
    for (const [kind, format, data] of formats) { const transfer = new DataTransfer(); transfer.setData(format, data); prevented.push(dispatch(kind, transfer)); await binding.whenIdle(); }
    return { prevented, ...state, text: textarea.value };
  });
  assert(result.prevented.every(Boolean)); assert.equal(result.text, ''); assert.equal(result.accepted.length, 3);
  assert(result.accepted.every((item) => item.pixel[1] === 255 && item.width === 2));
  assert.equal(result.fetches.length, 3); assert(result.fetches.every((url) => url.startsWith('blob:' + origin)));
  assert.deepEqual(result.errors, []);
});

test('foreign, expired, remote and non-image URLs fail visibly without remote fetching or literal insertion', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const expired = URL.createObjectURL(await makeFile()); URL.revokeObjectURL(expired);
    const wrong = URL.createObjectURL(new Blob(['not an image'], { type: 'text/plain' })); blobUrls.push(wrong);
    const values = [['text/plain', 'blob:https://foreign.example/foreign'], ['text/plain', expired],
      ['text/html', '<img src="https://untrusted.example/image.png" onerror="window.executed=true">'],
      ['text/html', '<img src="data:image/png;base64,AAAA">'], ['text/plain', wrong]];
    const prevented = [];
    for (const [type, value] of values) { const transfer = new DataTransfer(); transfer.setData(type, value); prevented.push(dispatch('paste', transfer)); await binding.whenIdle(); }
    return { prevented, executed: !!window.executed, text: textarea.value, ...state };
  });
  assert(result.prevented.every(Boolean)); assert.equal(result.text, ''); assert.equal(result.executed, false);
  assert.equal(result.errors.length, 5); assert.match(result.errors[0].message, /another website/); assert.match(result.errors[1].message, /expired|unavailable/);
  assert.equal(result.fetches.length, 2); assert(result.fetches.every((url) => url.startsWith('blob:' + origin)));
  assert.deepEqual(result.accepted, []);
});

test('multiple, oversized and unsupported image files are explicitly rejected before decoding or fetching', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const cases = [[await makeFile('one.png'), await makeFile('two.png')],
      [new File([new Uint8Array(8 * 1024 ** 2 + 1)], 'large.png', { type: 'image/png' })],
      [new File(['<svg/>'], 'vector.svg', { type: 'image/svg+xml' })]];
    for (const files of cases) { const transfer = new DataTransfer(); for (const file of files) transfer.items.add(file); dispatch('drop', transfer); await binding.whenIdle(); }
    const multiHtml = new DataTransfer(); multiHtml.setData('text/html', '<img src="blob:https://foreign.example/a"><img src="blob:https://foreign.example/b">');
    dispatch('paste', multiHtml); await binding.whenIdle(); return state;
  });
  assert.equal(result.errors.length, 4); assert.match(result.errors[0].message, /one image/); assert.match(result.errors[1].message, /8 MiB/);
  assert.deepEqual(result.accepted, []); assert.deepEqual(result.fetches, []); assert.deepEqual(result.fileSignals, []);
});

test('busy/incompatible gates reject image input and recheck eligibility after a pending blob fetch', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    state.allowed = 'Finish the current request before attaching an image.';
    const busy = new DataTransfer(); busy.items.add(await makeFile()); dispatch('paste', busy); await binding.whenIdle();
    state.allowed = true;
    const file = await makeFile(), url = URL.createObjectURL(file); blobUrls.push(url);
    let release; window.fetchOverride = () => new Promise((resolve) => { release = () => resolve(new Response(file, { headers: { 'content-type': 'image/png' } })); });
    const pending = new DataTransfer(); pending.setData('text/plain', url); dispatch('paste', pending);
    state.allowed = 'This target does not accept images.'; release(); await binding.whenIdle();
    return state;
  });
  assert.equal(result.errors.length, 2); assert.match(result.errors[0].message, /Finish/); assert.match(result.errors[1].message, /does not accept/);
  assert.deepEqual(result.accepted, []); assert.deepEqual(result.fileSignals, []);
});

test('latest image wins even when an older decoder finishes late, and disposal removes all handlers', async (t) => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    holdNames.add('old.png');
    const old = new DataTransfer(); old.items.add(await makeFile('old.png', 'red')); dispatch('paste', old);
    const latest = new DataTransfer(); latest.items.add(await makeFile('new.png', 'blue')); dispatch('drop', latest); await binding.whenIdle();
    const oldAborted = state.fileSignals[0].aborted; heldDecodes.get('old.png')(); await new Promise((resolve) => setTimeout(resolve, 0));
    holdNames.add('closing.png'); const closing = new DataTransfer(); closing.items.add(await makeFile('closing.png')); dispatch('paste', closing);
    await binding.dispose(); heldDecodes.get('closing.png')(); await new Promise((resolve) => setTimeout(resolve, 0));
    const after = dispatch('paste', latest);
    return { oldAborted, after, ...state };
  });
  assert.equal(result.oldAborted, true); assert.equal(result.after, false);
  assert.deepEqual(result.accepted.map((item) => item.name), ['new.png']); assert.deepEqual(result.accepted[0].pixel, [0, 0, 255, 255]);
  assert.deepEqual(result.errors, []); assert.equal(result.pending.at(-1), false);
});

test('blob streams are bounded by actual bytes and timeout even if the fetch body ignores abort', async (t) => {
  const page = await fixture(t, { timeoutMs: 60 });
  const result = await page.evaluate(async () => {
    const url = URL.createObjectURL(await makeFile()); blobUrls.push(url);
    let cancelled = 0;
    window.fetchOverride = () => Promise.resolve(new Response(new ReadableStream({
      start(controller) { controller.enqueue(new Uint8Array(8 * 1024 ** 2 + 1)); }, cancel() { cancelled++; },
    }), { headers: { 'content-type': 'image/png' } }));
    const transfer = new DataTransfer(); transfer.setData('text/plain', url); dispatch('paste', transfer); await binding.whenIdle();
    window.fetchOverride = () => Promise.resolve(new Response(new ReadableStream({ cancel() { cancelled++; } }), { headers: { 'content-type': 'image/png' } }));
    const start = performance.now(); dispatch('drop', transfer); await binding.whenIdle();
    return { elapsed: performance.now() - start, cancelled, ...state };
  });
  assert.equal(result.errors.length, 2); assert.match(result.errors[0].message, /8 MiB/); assert.equal(result.errors[1].code, 'ERR_CHAT_IMAGE_TIMEOUT');
  assert.equal(result.cancelled, 2); assert(result.elapsed < 1000); assert.deepEqual(result.accepted, []);
});

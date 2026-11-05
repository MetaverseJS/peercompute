import test from 'node:test';
import assert from 'node:assert/strict';
import { createHuggingFaceClient, huggingFaceFileUrl, parseHuggingFaceRepository } from '../../../demos/inference/src/huggingface/hubClient.js';

const revision = 'a'.repeat(40);
const response = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers });

test('Hub search merges name and full-card results, preserving description-only matches and paging', async () => {
  const calls = [];
  const client = createHuggingFaceClient({ fetchImpl: async (input, options) => {
    const url = new URL(input); calls.push({ url, options });
    if (url.pathname === '/api/models') return response([{ id: 'org/named', pipeline_tag: 'text-generation', tags: [], sha: revision }], 200,
      { link: '<https://huggingface.co/api/models?cursor=next-name>; rel="next"' });
    return response({ estimatedTotalHits: 2, hits: [
      { name: 'org/named', type: 'model', tags: 'text-generation', formatted: { fileContent: [{ text: 'Card text' }] } },
      { name: 'org/different-title', type: 'model', tags: 'text-generation, license:apache-2.0',
        formatted: { fileContent: [{ text: 'A model for ' }, { text: 'submarine navigation', type: 'highlight' }] } },
    ] });
  } });
  const found = await client.search({ query: 'submarine navigation', task: 'text-generation' });
  assert.deepEqual(found.items.map((item) => item.repository), ['org/named', 'org/different-title']);
  assert.equal(found.items[0].source, 'name+card');
  assert.equal(found.items[1].description, 'A model for submarine navigation');
  assert.equal(found.items[1].license, 'apache-2.0');
  assert.equal(calls[1].url.pathname, '/api/search/full-text');
  assert.equal(calls[1].url.searchParams.get('type'), 'model');
  assert.ok(calls.every(({ options }) => options.credentials === 'omit'));
  await client.search({ query: 'submarine navigation', task: 'text-generation', cursor: found.nextCursor });
  assert.equal(calls[2].url.searchParams.get('cursor'), 'next-name');
  assert.equal(calls.length, 3);
  await assert.rejects(client.search({ query: 'another', cursor: found.nextCursor }), /cursor/);
});

test('full-card failure is surfaced, not disguised as name-only full search', async () => {
  const client = createHuggingFaceClient({ fetchImpl: async (url) => url.includes('full-text') ? response({}, 502) : response([{ id: 'org/model' }]) });
  const found = await client.search({ query: 'anything' });
  assert.equal(found.items.length, 1); assert.match(found.warning, /Full-card search unavailable/);
});

test('metadata cache supports a later offline client without storing credentials or model bytes', async () => {
  const values = new Map(); const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const online = createHuggingFaceClient({ storage, fetchImpl: async (url) => url.includes('full-text')
    ? response({ hits: [], estimatedTotalHits: 0 }) : response([{ id: 'org/model' }]) });
  await online.search({ query: 'test' });
  const offline = createHuggingFaceClient({ storage, fetchImpl: async () => { throw new TypeError('offline'); } });
  const found = await offline.search({ query: 'test' });
  assert.equal(found.cached, true); assert.equal(found.items[0].repository, 'org/model'); assert.match(found.warning, /cached/);
  assert.ok([...values.values()].every((text) => !text.includes('Authorization')));
});

test('browser metadata persists by default, explicit null opts out, and storage denial is harmless', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const values = new Map();
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
      getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value),
    } });
    await createHuggingFaceClient({ fetchImpl: async () => response({ sha: revision }) }).getModel('org/model');
    const offlineFetch = async () => { throw new TypeError('offline'); };
    assert.equal((await createHuggingFaceClient({ fetchImpl: offlineFetch }).getModel('org/model')).cached, true);
    await assert.rejects(createHuggingFaceClient({ storage: null, fetchImpl: offlineFetch }).getModel('org/model'), /offline/);
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new DOMException('Denied', 'SecurityError'); } });
    assert.equal((await createHuggingFaceClient({ fetchImpl: async () => response({ sha: revision }) }).getModel('org/model')).sha, revision);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
});

test('stale metadata is not returned after its bounded offline retention window', async () => {
  const values = new Map(); let time = 1_000_000;
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  await createHuggingFaceClient({ storage, now: () => time, fetchImpl: async () => response({ sha: revision }) }).getModel('org/model');
  time += 8 * 86400_000;
  const client = createHuggingFaceClient({ storage, now: () => time, fetchImpl: async () => { throw new TypeError('offline'); } });
  await assert.rejects(client.getModel('org/model'), /offline/);
});

test('rate limit respects bounded Retry-After and does not repeatedly hammer a blocked endpoint', async () => {
  let calls = 0; const delays = [];
  const client = createHuggingFaceClient({ fetchImpl: async () => { calls += 1; return response({}, 429, { 'retry-after': '120' }); } });
  await assert.rejects(client.getModel('org/model'), (error) => error.status === 429 && error.retryAfterMs === 120000);
  await assert.rejects(client.getModel('org/other'), (error) => error.status === 429);
  assert.equal(calls, 1);
  let shortCalls = 0;
  const retry = createHuggingFaceClient({ sleep: async (ms) => delays.push(ms), fetchImpl: async () => ++shortCalls === 1
    ? response({}, 429, { 'retry-after': '1' }) : response({ sha: revision }) });
  assert.equal((await retry.getModel('org/model')).sha, revision); assert.deepEqual(delays, [1000]);
});

test('abort never silently returns cached search data and timeout interrupts actual fetch', async () => {
  const client = createHuggingFaceClient({ timeoutMs: 15, fetchImpl: async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  }) });
  await assert.rejects(client.getModel('org/model'), (error) => error.name === 'TimeoutError');
  const controller = new AbortController(); controller.abort();
  await assert.rejects(client.search({ query: 'test', signal: controller.signal }), (error) => error.name === 'AbortError');
});

test('untrusted pagination cannot redirect metadata fetching off the Hub', async () => {
  const client = createHuggingFaceClient({ fetchImpl: async () => response([], 200,
    { link: '<https://evil.example/api/models?cursor=steal>; rel="next"' }) });
  await assert.rejects(client.search(), /pagination/);
});

test('repo/URL parser and pinned file URL reject credentials, branches, traversal and other Hub resource types', () => {
  assert.deepEqual(parseHuggingFaceRepository('https://huggingface.co/org/model/tree/main'), { repository: 'org/model' });
  assert.equal(parseHuggingFaceRepository(`https://huggingface.co/org/model/blob/${revision}/README.md`).revision, revision);
  assert.equal(huggingFaceFileUrl('org/model', revision, 'onnx/model_q4.onnx'), `https://huggingface.co/org/model/resolve/${revision}/onnx/model_q4.onnx`);
  for (const input of ['https://x:y@huggingface.co/org/model', 'https://evil.example/org/model', 'org/../model',
    'https://huggingface.co/org/model?token=secret', 'https://huggingface.co/org/model/tree/dev', 'spaces/org/model']) assert.throws(() => parseHuggingFaceRepository(input));
  assert.throws(() => huggingFaceFileUrl('org/model', 'main', 'model.onnx'));
  assert.throws(() => huggingFaceFileUrl('org/model', revision, '../secret'));
});

test('file listing follows bounded same-revision pages and rejects duplicate page loops', async () => {
  let calls = 0;
  const base = `https://huggingface.co/api/models/org/model/tree/${revision}`;
  const client = createHuggingFaceClient({ fetchImpl: async () => ++calls === 1
    ? response([{ type: 'file', path: 'config.json' }], 200, { link: `<${base}?cursor=second>; rel="next"` })
    : response([{ type: 'file', path: 'tokenizer.json' }]) });
  assert.equal((await client.listFiles('org/model', revision)).length, 2);
});

test('metadata byte and range bounds prevent whole-model reads', async () => {
  let cancelled = false;
  const client = createHuggingFaceClient({ fetchImpl: async () => new Response(new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(100)); }, cancel() { cancelled = true; },
  }), { status: 200, headers: { 'content-length': '10000000000' } }) });
  await assert.rejects(client.readText('org/model', revision, 'model.onnx'), /Only text metadata/);
  await assert.rejects(client.readRange('org/model', revision, 'model.gguf', 0, 16), /bounded metadata range/);
  assert.equal(cancelled, true);
  const ranges = createHuggingFaceClient({ fetchImpl: async (_url, { headers }) => {
    assert.equal(headers.Range, 'bytes=8-11');
    return new Response(new Uint8Array([1,2,3,4]), { status: 206, headers: { 'content-range': 'bytes 8-11/100' } });
  } });
  assert.deepEqual(await ranges.readRange('org/model', revision, 'model.gguf', 8, 4), new Uint8Array([1,2,3,4]));
});

test('timeout bounds an uncooperative fetch and cancels its late body', async () => {
  let resolveFetch, cancelled = false;
  const client = createHuggingFaceClient({ timeoutMs: 10, fetchImpl: () => new Promise((resolve) => { resolveFetch = resolve; }) });
  await assert.rejects(client.getModel('org/model'), (error) => error.name === 'TimeoutError');
  resolveFetch(new Response(new ReadableStream({ cancel() { cancelled = true; } })));
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(cancelled, true);
});

test('timeout also bounds a stalled metadata response body', async () => {
  let cancelled = false;
  const client = createHuggingFaceClient({ timeoutMs: 10, fetchImpl: async () => new Response(new ReadableStream({
    start(controller) { controller.enqueue(new TextEncoder().encode('{')); }, cancel() { cancelled = true; },
  })) });
  await assert.rejects(client.getModel('org/model'), (error) => error.name === 'TimeoutError');
  assert.equal(cancelled, true);
});

test('rejecting an oversized response never waits for an uncooperative stream cancellation', async () => {
  const client = createHuggingFaceClient({ timeoutMs: 10, fetchImpl: async () => new Response(new ReadableStream({
    cancel() { return new Promise(() => {}); },
  }), { headers: { 'content-length': '99999999' } }) });
  await assert.rejects(client.getModel('org/model'), /response budget/);
});

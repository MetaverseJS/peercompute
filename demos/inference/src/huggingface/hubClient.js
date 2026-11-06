// Public, anonymous Hub metadata only. API contracts: huggingface.co/.well-known/openapi.json
// and huggingface.co/docs/hub/search (checked 2026-11-05).
export const HUGGING_FACE_ORIGIN = 'https://huggingface.co';
const CACHE_KEY = 'peercompute.huggingface-metadata.v1';
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_CACHE_BYTES = 2 * 1024 * 1024;
const PAGE_SIZE = 20;
const encoder = new TextEncoder();
const clone = (value) => JSON.parse(JSON.stringify(value));
const bounded = (value, maximum = 1600) => typeof value === 'string' ? value.slice(0, maximum) : '';

export function parseHuggingFaceRepository(input) {
  if (typeof input !== 'string' || input.length > 1024) throw new Error('Enter a Hugging Face owner/model repository');
  let value = input.trim(), revision, path;
  if (value.startsWith('https://')) {
    const url = new URL(value);
    if (url.origin !== HUGGING_FACE_ORIGIN || url.username || url.password || url.search || url.hash) {
      throw new Error('Use a public huggingface.co repository URL without credentials or query parameters');
    }
    const parts = url.pathname.replace(/\/$/, '').slice(1).split('/');
    value = parts.slice(0, 2).join('/');
    if (parts.length > 2) {
      if (!['tree', 'blob', 'resolve'].includes(parts[2]) || !parts[3]) throw new Error('Unsupported Hugging Face repository URL');
      if (parts[3] !== 'main') revision = validateRevision(parts[3]);
      if (parts.length > 4) path = validateHubPath(parts.slice(4).join('/'));
    }
  }
  const parts = value.split('/');
  if (parts.length !== 2 || parts.some((part) => !/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(part)
      || part.includes('..') || part.includes('--')) || ['datasets', 'spaces', 'api'].includes(parts[0])) {
    throw new Error('Enter a Hugging Face owner/model repository');
  }
  return { repository: value, ...(revision ? { revision } : {}), ...(path ? { path } : {}) };
}

export function validateRevision(value) {
  if (typeof value !== 'string' || !/^[a-f0-9]{40}$/i.test(value)) throw new Error('An immutable 40-character model revision is required');
  return value.toLowerCase();
}

export function validateHubPath(path) {
  if (typeof path !== 'string' || !path || encoder.encode(path).length > 512
      || /[\\%?#:\u0000-\u001f\u007f]/.test(path) || path.startsWith('/')
      || path.split('/').some((part) => !part || part === '.' || part === '..')) throw new Error('Invalid Hugging Face file path');
  return path;
}

export function huggingFaceFileUrl(repository, revision, path) {
  repository = parseHuggingFaceRepository(repository).repository;
  return `${HUGGING_FACE_ORIGIN}/${repository}/resolve/${validateRevision(revision)}/${validateHubPath(path).split('/').map(encodeURIComponent).join('/')}`;
}

export class HuggingFaceError extends Error {
  constructor(message, { status, retryAfterMs, cause, code } = {}) {
    super(message, { cause }); this.name = 'HuggingFaceError';
    this.status = status; this.retryAfterMs = retryAfterMs; this.code = code;
  }
}

function aborted(signal) { signal?.throwIfAborted(); }
function abortFailure(signal) { return signal?.reason ?? new DOMException('Operation cancelled', 'AbortError'); }
function abortable(promise, signal, onLate) {
  if (signal?.aborted) { Promise.resolve(promise).then(onLate, () => {}); return Promise.reject(abortFailure(signal)); }
  return new Promise((resolve, reject) => {
    let stopped = false;
    const stop = () => { stopped = true; reject(abortFailure(signal)); };
    signal?.addEventListener('abort', stop, { once: true });
    Promise.resolve(promise).then((value) => {
      signal?.removeEventListener('abort', stop);
      if (stopped) { onLate?.(value); return; }
      resolve(value);
    }, (error) => { signal?.removeEventListener('abort', stop); reject(error); });
  });
}
function retryDelay(value, now) {
  if (!value) return 1000;
  const seconds = Number(value);
  return Math.max(0, Math.min(3600_000, Number.isFinite(seconds) ? seconds * 1000 : Date.parse(value) - now || 1000));
}

async function bodyBytes(response, maximum, signal) {
  const declared = response.headers.get('content-length');
  if (declared && Number(declared) > maximum) { void response.body?.cancel().catch(() => {}); throw new HuggingFaceError('Hub metadata exceeds the response budget'); }
  if (!response.body) throw new HuggingFaceError('Hub returned an empty metadata response');
  const reader = response.body.getReader(), chunks = []; let length = 0;
  try {
    while (true) {
      aborted(signal); const { done, value } = await abortable(reader.read(), signal);
      if (done) break;
      length += value.byteLength;
      if (length > maximum) throw new HuggingFaceError('Hub metadata exceeds the response budget');
      chunks.push(value);
    }
    aborted(signal);
  } catch (error) { void reader.cancel().catch(() => {}); throw error; }
  finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}

function plainDescription(text) {
  return bounded(text, 12000).replace(/^---[\s\S]*?---\s*/, '').replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`#*_]/g, '').replace(/\s+/g, ' ').trim().slice(0, 1600);
}
export { plainDescription };

function normalizeSearchItem(raw, source) {
  let repository;
  try { repository = parseHuggingFaceRepository(raw.id ?? raw.name ?? raw.modelId).repository; } catch { return null; }
  if (raw.private || raw.isPrivate || (raw.type && raw.type !== 'model')) return null;
  const tags = (Array.isArray(raw.tags) ? raw.tags : typeof raw.tags === 'string' ? raw.tags.split(',').map((s) => s.trim()) : [])
    .filter((tag) => typeof tag === 'string').slice(0, 80).map((tag) => bounded(tag, 150));
  const card = Array.isArray(raw.formatted?.fileContent) ? raw.formatted.fileContent.slice(0, 500).map((part) => bounded(part.text, 12000)).join('') : '';
  const task = bounded(raw.pipeline_tag ?? raw.cardData?.pipeline_tag ?? tags.find((tag) =>
    ['text-generation', 'image-text-to-text', 'text-to-image', 'automatic-speech-recognition', 'text-to-speech', 'feature-extraction'].includes(tag)), 100);
  return { repository, name: repository.split('/')[1], description: plainDescription(card || raw.description || raw.cardData?.model_description || ''),
    task: task || null, tags, license: bounded(raw.cardData?.license ?? tags.find((tag) => tag.startsWith('license:'))?.slice(8), 100) || null,
    url: `${HUGGING_FACE_ORIGIN}/${repository}`, gated: Boolean(raw.gated), source,
    downloads: Number.isSafeInteger(raw.downloads) ? raw.downloads : null,
    likes: Number.isSafeInteger(raw.likes) ? raw.likes : null,
    revision: /^[a-f0-9]{40}$/i.test(raw.sha ?? '') ? raw.sha.toLowerCase() : null };
}

function nextLink(response, currentUrl, path) {
  const match = response.headers.get('link')?.match(/<([^>]+)>;\s*rel="next"/);
  if (!match) return null;
  const url = new URL(match[1], currentUrl);
  if (url.origin !== HUGGING_FACE_ORIGIN || url.pathname !== path || url.username || url.password || url.hash) {
    throw new HuggingFaceError('Hub supplied an invalid pagination URL');
  }
  return url.href;
}

/** Uses localStorage when available; explicit null keeps the cache in memory only. */
export function createHuggingFaceClient({ fetchImpl = globalThis.fetch, storage, timeoutMs = 15_000,
  now = () => Date.now(), sleep = (ms, signal) => new Promise((resolve, reject) => {
    const stop = () => { clearTimeout(timer); reject(abortFailure(signal)); };
    const timer = setTimeout(() => { signal?.removeEventListener('abort', stop); resolve(); }, ms);
    signal?.addEventListener('abort', stop, { once: true });
    if (signal?.aborted) stop();
  }) } = {}) {
  if (typeof fetchImpl !== 'function') throw new Error('A fetch implementation is required');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1 || timeoutMs > 60_000) throw new Error('Invalid metadata timeout');
  if (storage === undefined) {
    try { storage = globalThis.localStorage; } catch { storage = null; }
  }
  const cache = new Map(); let blockedUntil = 0;
  try {
    const stored = storage?.getItem(CACHE_KEY);
    if (typeof stored === 'string' && encoder.encode(stored).length <= MAX_CACHE_BYTES) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) for (const entry of parsed.slice(-40)) {
        if (Array.isArray(entry) && typeof entry[0] === 'string' && Number.isFinite(entry[1]?.at)
            && entry[1].at <= now() && entry[1].at > now() - 7 * 86400_000
            && typeof entry[1].value?.text === 'string') cache.set(entry[0], entry[1]);
      }
    }
  } catch { /* unavailable, full or invalid browser metadata cache */ }
  function save(key, value) {
    if (encoder.encode(JSON.stringify(value)).length > 512 * 1024) return;
    cache.delete(key); cache.set(key, { at: now(), value });
    let serialized = JSON.stringify([...cache]);
    while (cache.size > 40 || encoder.encode(serialized).length > MAX_CACHE_BYTES) {
      cache.delete(cache.keys().next().value); serialized = JSON.stringify([...cache]);
    }
    try { storage?.setItem(CACHE_KEY, serialized); } catch { /* best-effort metadata cache */ }
  }
  async function request(url, { signal, maximum = MAX_RESPONSE_BYTES, headers, raw = false, cacheable = true, validateResponse } = {}) {
    aborted(signal);
    const parsedUrl = new URL(url);
    if (parsedUrl.origin !== HUGGING_FACE_ORIGIN || parsedUrl.username || parsedUrl.password) throw new Error('Only public Hugging Face metadata is allowed');
    const key = url, previous = cache.get(key);
    const controller = new AbortController();
    const forward = () => controller.abort(abortFailure(signal));
    signal?.addEventListener('abort', forward, { once: true });
    const timer = setTimeout(() => controller.abort(new DOMException('Hugging Face metadata request timed out', 'TimeoutError')), timeoutMs);
    try {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        if (blockedUntil > now()) throw new HuggingFaceError('Hugging Face is rate limiting requests. Retry shortly.',
          { status: 429, retryAfterMs: blockedUntil - now(), code: 'ERR_HF_RATE_LIMIT' });
        const response = await abortable(fetchImpl(url, { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer', headers }),
          controller.signal, (late) => { void late.body?.cancel().catch(() => {}); });
        if (response.status === 429 || response.status === 503) {
          const retryAfterMs = retryDelay(response.headers.get('retry-after'), now());
          void response.body?.cancel().catch(() => {});
          if (attempt === 0 && retryAfterMs <= 2000) { await sleep(retryAfterMs, controller.signal); continue; }
          if (response.status === 429) blockedUntil = now() + retryAfterMs;
          throw new HuggingFaceError('Hugging Face is temporarily unavailable or rate limiting requests. Retry shortly.',
            { status: response.status, retryAfterMs, code: 'ERR_HF_RATE_LIMIT' });
        }
        if (!response.ok) {
          void response.body?.cancel().catch(() => {});
          throw new HuggingFaceError(response.status === 401 || response.status === 403
            ? 'This model requires Hugging Face access approval or authentication; anonymous import is unavailable.'
            : `Hugging Face metadata request failed (${response.status})`, { status: response.status });
        }
        if (validateResponse) {
          try { validateResponse(response); }
          catch (error) { void response.body?.cancel().catch(() => {}); throw error; }
        }
        if (raw) return { response, bytes: await bodyBytes(response, maximum, controller.signal) };
        const text = new TextDecoder().decode(await bodyBytes(response, maximum, controller.signal));
        const value = { text, link: response.headers.get('link') };
        if (cacheable) save(key, value);
        return { ...value, cached: false };
      }
    } catch (error) {
      if (signal?.aborted) throw abortFailure(signal);
      if (cacheable && previous && previous.at > now() - 7 * 86400_000
          && (!error.status || error.status === 429 || error.status >= 500)) {
        return { ...clone(previous.value), cached: true, warning: 'Showing cached metadata; Hugging Face could not be refreshed.' };
      }
      throw controller.signal.aborted ? controller.signal.reason : error;
    } finally { clearTimeout(timer); signal?.removeEventListener('abort', forward); }
  }
  async function json(url, options) {
    const result = await request(url, options);
    try { return { ...result, data: JSON.parse(result.text) }; }
    catch { throw new HuggingFaceError('Hugging Face returned malformed metadata'); }
  }
  const api = {
    /** Hub model-card lineage filter; no names or model weights are fetched. */
    async listDerivedModels(repository, { signal } = {}) {
      repository = parseHuggingFaceRepository(repository).repository;
      const url = new URL('/api/models', HUGGING_FACE_ORIGIN);
      url.searchParams.set('filter', `base_model:${repository}`);
      url.searchParams.set('full', 'true'); url.searchParams.set('cardData', 'true');
      url.searchParams.set('limit', '40');
      const result = await json(url.href, { signal });
      if (!Array.isArray(result.data) || result.data.length > 40) throw new HuggingFaceError('Invalid related-model metadata');
      const next = nextLink({ headers: new Headers({ link: result.link ?? '' }) }, url.href, '/api/models');
      return { items: result.data, truncated: Boolean(next), ...(result.cached ? { cached: true } : {}),
        ...(result.warning ? { warning: result.warning } : {}) };
    },
    async search({ query = '', task, cursor, signal } = {}) {
      if (typeof query !== 'string' || query.length > 250 || /[\u0000-\u001f]/.test(query)) throw new Error('Model search must be at most 250 characters');
      query = query.trim();
      if (task && !/^[a-z][a-z-]{0,79}$/.test(task)) throw new Error('Invalid model task filter');
      let state = { query, task: task || null, nameCursor: null, namesDone: false, skip: 0, cardsDone: !query };
      if (cursor) {
        if (typeof cursor !== 'string' || cursor.length > 16000) throw new Error('Invalid search cursor');
        try {
          const parsed = JSON.parse(decodeURIComponent(cursor));
          if (parsed.query !== query || parsed.task !== (task || null) || !Number.isSafeInteger(parsed.skip)
              || parsed.skip < 0 || parsed.skip > 10000 || typeof parsed.namesDone !== 'boolean'
              || typeof parsed.cardsDone !== 'boolean' || (parsed.nameCursor !== null && (typeof parsed.nameCursor !== 'string' || parsed.nameCursor.length > 12000))) throw new Error();
          state = parsed;
        } catch { throw new Error('Invalid search cursor'); }
      }
      const names = new URL('/api/models', HUGGING_FACE_ORIGIN);
      names.searchParams.set('search', query); names.searchParams.set('limit', PAGE_SIZE);
      names.searchParams.set('full', 'true'); names.searchParams.set('cardData', 'true');
      if (task) names.searchParams.set('filter', task);
      if (state.nameCursor) names.searchParams.set('cursor', state.nameCursor);
      const cards = new URL('/api/search/full-text', HUGGING_FACE_ORIGIN);
      cards.searchParams.set('q', query); cards.searchParams.set('type', 'model'); cards.searchParams.set('limit', PAGE_SIZE); cards.searchParams.set('skip', state.skip);
      const pending = await Promise.allSettled([
        state.namesDone ? Promise.resolve(null) : json(names.href, { signal }),
        state.cardsDone ? Promise.resolve(null) : json(cards.href, { signal }),
      ]);
      aborted(signal);
      const items = new Map(), warnings = []; let cached = false, successes = 0, failure;
      for (let source = 0; source < pending.length; source += 1) {
        const result = pending[source];
        if (result.status === 'rejected') {
          failure = result.reason; warnings.push(`${source ? 'Full-card' : 'Name'} search unavailable: ${bounded(result.reason.message, 220)}`);
          if (source) state.cardsDone = true; else state.namesDone = true;
          continue;
        }
        const value = result.value; if (!value) continue;
        successes += 1; cached ||= value.cached;
        if (value.warning) warnings.push(value.warning);
        const records = source ? value.data?.hits : value.data;
        if (!Array.isArray(records) || records.length > 100) throw new HuggingFaceError('Invalid Hub search result');
        for (const raw of records) {
          const item = normalizeSearchItem(raw, source ? 'card' : 'name');
          if (!item || (task && item.task !== task && !item.tags.includes(task))) continue;
          const existing = items.get(item.repository);
          items.set(item.repository, existing ? { ...existing, description: item.description || existing.description, source: 'name+card' } : item);
        }
        if (source) {
          state.skip += records.length;
          state.cardsDone = records.length < PAGE_SIZE || state.skip >= (value.data.estimatedTotalHits ?? Infinity) || state.skip >= 10000;
        } else {
          const next = nextLink({ headers: new Headers({ link: value.link ?? '' }) }, names.href, '/api/models');
          state.nameCursor = next ? new URL(next).searchParams.get('cursor') : null;
          state.namesDone = !state.nameCursor;
        }
      }
      if (!successes && failure) throw failure;
      return { items: [...items.values()], nextCursor: state.namesDone && state.cardsDone ? null : encodeURIComponent(JSON.stringify(state)),
        ...(warnings.length ? { warning: [...new Set(warnings)].join(' ') } : {}), ...(cached ? { cached: true } : {}) };
    },
    async getModel(repository, { revision, signal } = {}) {
      repository = parseHuggingFaceRepository(repository).repository;
      const url = `${HUGGING_FACE_ORIGIN}/api/models/${repository}${revision ? `/revision/${validateRevision(revision)}` : ''}?blobs=true`;
      const result = await json(url, { signal });
      if (!result.data || typeof result.data !== 'object' || Array.isArray(result.data)) throw new HuggingFaceError('Invalid model metadata');
      return { ...result.data, ...(result.cached ? { cached: true, warning: result.warning } : {}) };
    },
    async listFiles(repository, revision, { signal } = {}) {
      repository = parseHuggingFaceRepository(repository).repository; revision = validateRevision(revision);
      const path = `/api/models/${repository}/tree/${revision}`;
      let url = `${HUGGING_FACE_ORIGIN}${path}?recursive=true&limit=1000`; const files = [], visited = new Set();
      while (url) {
        if (visited.has(url) || visited.size >= 16) throw new HuggingFaceError('Repository file listing exceeds its page budget');
        visited.add(url); const result = await json(url, { signal });
        if (result.cached) { files.cached = true; files.warning = result.warning; }
        if (!Array.isArray(result.data) || result.data.length > 1000) throw new HuggingFaceError('Invalid repository file listing');
        files.push(...result.data.filter((file) => file.type === 'file'));
        if (files.length > 8192) throw new HuggingFaceError('Repository contains too many files to inspect safely');
        url = nextLink({ headers: new Headers({ link: result.link ?? '' }) }, url, path);
      }
      return files;
    },
    async readText(repository, revision, path, { signal, maxBytes = 256 * 1024 } = {}) {
      if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > 512 * 1024) throw new Error('Invalid metadata file budget');
      // Prevent accidental model-weight downloads through a metadata helper.
      if (!/\.(json|md|txt|jinja)$/i.test(validateHubPath(path)) && !/^(LICENSE|NOTICE)(\.[A-Za-z]+)?$/i.test(path)) throw new Error('Only text metadata may be inspected');
      return (await request(huggingFaceFileUrl(repository, revision, path), { signal, maximum: maxBytes })).text;
    },
    async readRange(repository, revision, path, offset, length, { signal } = {}) {
      if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(length) || length < 1
          || length > 1024 * 1024 || !Number.isSafeInteger(offset + length)) throw new Error('Invalid bounded metadata range');
      const { response, bytes } = await request(huggingFaceFileUrl(repository, revision, path), { signal,
        maximum: length, raw: true, cacheable: false, headers: { Range: `bytes=${offset}-${offset + length - 1}` },
        validateResponse(response) {
          const range = response.headers.get('content-range')?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
          if (response.status !== 206 || !range || Number(range[1]) !== offset || Number(range[2]) !== offset + length - 1) {
            throw new HuggingFaceError('The model server did not honor the bounded metadata range');
          }
        } });
      const match = response.headers.get('content-range')?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
      if (response.status !== 206 || !match || Number(match[1]) !== offset || Number(match[2]) !== offset + length - 1
          || bytes.length !== length) throw new HuggingFaceError('The model server did not honor the bounded metadata range');
      return bytes;
    },
    clearCache() { cache.clear(); try { storage?.removeItem(CACHE_KEY); } catch { /* optional */ } },
  };
  return api;
}

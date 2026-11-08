const __PEERCOMPUTE_APP_SHELL__ = null;
// Header isolation, with an optional build-pinned app shell for the model console.
// Never cache model data, WASM, arbitrary URLs, requests with query data, or POSTs.
export function createIsolationFetchHandler({ scopeUrl, fetchImpl = globalThis.fetch, appShell = null } = {}) {
  const owned = new URL(scopeUrl);
  if (!owned.pathname.endsWith('/')) throw new Error('Isolation worker scope must be a directory');
  return (request) => {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method) || url.origin !== owned.origin
        || !url.pathname.startsWith(owned.pathname)
        || (request.cache === 'only-if-cached' && request.mode !== 'same-origin')) return undefined;
    return Promise.resolve().then(() => fetchImpl(request)).catch(async (error) => {
      const cached = await appShell?.match(request);
      if (!cached) throw error;
      return cached;
    }).then((response) => {
      // Preserve opaque/redirect responses and HTTP errors; never substitute HTML.
      if (response.status === 0) return response;
      const headers = new Headers(response.headers);
      headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      // Modern GGUF-capable browsers support credentialless. Public no-cors
      // images remain usable, without third-party ambient credentials.
      headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
      return new Response(response.body, {
        status: response.status, statusText: response.statusText, headers,
      });
    });
  };
}

/** Immutable, bounded snapshot; online responses never overwrite pinned assets. */
export function createAppShellCache({ scopeUrl, configuration, cacheStorage = globalThis.caches,
  fetchImpl = globalThis.fetch, cryptoImpl = globalThis.crypto } = {}) {
  if (!configuration) return null;
  const owned = new URL(scopeUrl);
  if (!owned.pathname.endsWith('/') || !/^[a-f0-9]{64}$/.test(configuration.version)
      || !Array.isArray(configuration.files) || configuration.files.length < 1 || configuration.files.length > 128) {
    throw new Error('Invalid app-shell configuration');
  }
  const files = new Map(); let total = 0;
  for (const file of configuration.files) {
    if (!/^(?:index\.html|assets\/[\w.-]+\.(?:js|css)|manifest\.webmanifest|icons\/[\w.-]+\.(?:png|svg))$/.test(file.path)
        || !Number.isSafeInteger(file.bytes) || file.bytes < 0 || file.bytes > 8 * 1024 * 1024
        || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error('Invalid app-shell asset');
    const url = new URL(file.path, owned).href;
    if (files.has(url)) throw new Error('Duplicate app-shell asset');
    files.set(url, file); total += file.bytes;
  }
  if (total > 16 * 1024 * 1024 || !files.has(new URL('index.html', owned).href)) throw new Error('Invalid app-shell budget');
  const prefix = `peercompute-app-shell:${encodeURIComponent(owned.pathname)}:`;
  const cacheName = `${prefix}${configuration.version}`;
  let population = null;
  const populate = async () => {
    const signal = AbortSignal.timeout(30000);
    const cache = await cacheStorage.open(cacheName);
    // HTML is last: a partial failed cache cannot advertise a usable offline shell.
    const ordered = [...files].sort((a, b) => Number(a[1].path === 'index.html') - Number(b[1].path === 'index.html'));
    for (const [url, file] of ordered) {
      if (await cache.match(url)) continue;
      const response = await fetchImpl(new Request(url, { signal, cache: 'reload', credentials: 'same-origin', mode: 'same-origin', redirect: 'error' }));
      if (response.status !== 200 || response.redirected || !response.body) throw new Error('App-shell asset unavailable');
      const reader = response.body.getReader(), bytes = new Uint8Array(file.bytes);
      let offset = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (offset + value.byteLength > bytes.byteLength) throw new Error('App-shell asset exceeds pinned size');
          bytes.set(value, offset); offset += value.byteLength;
        }
      } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
      const digest = [...new Uint8Array(await cryptoImpl.subtle.digest('SHA-256', bytes))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
      if (offset !== file.bytes || digest !== file.sha256) throw new Error('App-shell asset integrity mismatch');
      // Fetch already decoded HTTP compression; do not label these bytes gzip/br.
      const headers = new Headers(response.headers);
      headers.delete('Content-Encoding'); headers.set('Content-Length', String(bytes.byteLength));
      await cache.put(url, new Response(bytes, { status: 200, headers }));
    }
    // Preserve all other app caches and StateManager's independent IndexedDB data.
    for (const name of await cacheStorage.keys()) {
      if (name.startsWith(prefix) && name !== cacheName) await cacheStorage.delete(name).catch(() => {});
    }
    return { files: files.size, bytes: total };
  };
  return Object.freeze({
    cacheName,
    populate() {
      if (!population) population = populate().catch(async (error) => {
        // Failed deployments must not accumulate a partial cache per version.
        await cacheStorage.delete(cacheName).catch(() => {});
        population = null; throw error;
      });
      return population;
    },
    async match(request) {
      const url = new URL(request.url);
      if (request.method !== 'GET' || url.search || url.hash || request.headers.has('range')
          || url.origin !== owned.origin) return undefined;
      const key = url.href === owned.href ? new URL('index.html', owned).href : url.href;
      if (!files.has(key)) return undefined;
      // A failed/evicted CacheStorage entry must not break ordinary online access.
      try { return await (await cacheStorage.open(cacheName)).match(key); } catch { return undefined; }
    },
  });
}

if (typeof ServiceWorkerGlobalScope !== 'undefined' && globalThis instanceof ServiceWorkerGlobalScope) {
  const appShell = createAppShellCache({ scopeUrl: globalThis.registration.scope,
    configuration: typeof __PEERCOMPUTE_APP_SHELL__ === 'undefined' ? null : __PEERCOMPUTE_APP_SHELL__ });
  globalThis.addEventListener('install', (event) => {
    // Shell updates wait for existing app windows to close: no mid-model reload.
    if (!appShell || !globalThis.registration.active) event.waitUntil(globalThis.skipWaiting());
  });
  globalThis.addEventListener('activate', (event) => event.waitUntil((async () => {
    await globalThis.clients.claim();
    // Offline storage is optional. Quota/fetch failures cannot prevent isolation.
    await appShell?.populate().catch(() => {});
  })()));
  const handle = createIsolationFetchHandler({ scopeUrl: globalThis.registration.scope, appShell });
  globalThis.addEventListener('fetch', (event) => {
    const response = handle(event.request);
    if (response) {
      event.respondWith(response);
      if (appShell && event.request.mode === 'navigate') event.waitUntil(appShell.populate().catch(() => {}));
    }
  });
}

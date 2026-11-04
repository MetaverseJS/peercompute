// Header-only isolation, following the strategy in gzuidhof/coi-serviceworker.
// No CacheStorage, model downloads, message commands, or cross-origin proxying.
export function createIsolationFetchHandler({ scopeUrl, fetchImpl = globalThis.fetch } = {}) {
  const owned = new URL(scopeUrl);
  if (!owned.pathname.endsWith('/')) throw new Error('Isolation worker scope must be a directory');
  return (request) => {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method) || url.origin !== owned.origin
        || !url.pathname.startsWith(owned.pathname)
        || (request.cache === 'only-if-cached' && request.mode !== 'same-origin')) return undefined;
    return fetchImpl(request).then((response) => {
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

if (typeof ServiceWorkerGlobalScope !== 'undefined' && globalThis instanceof ServiceWorkerGlobalScope) {
  globalThis.addEventListener('install', (event) => event.waitUntil(globalThis.skipWaiting()));
  globalThis.addEventListener('activate', (event) => event.waitUntil(globalThis.clients.claim()));
  const handle = createIsolationFetchHandler({ scopeUrl: globalThis.registration.scope });
  globalThis.addEventListener('fetch', (event) => {
    const response = handle(event.request);
    if (response) event.respondWith(response);
  });
}

const __PEERCOMPUTE_APP_SHELL__ = {"version":"968e53ae4a3887178341612b182b822efd7c58fbcb8bfcff147bbc4ea186688d","files":[{"path":"assets/ArtifactProviderRecord-D4WVSHSf.js","bytes":13335,"sha256":"220b06e2001a75524278867b6ee36777d00cf740efd9d103af42f050f5510f0a"},{"path":"assets/computeWorker-CudUBl_m.js","bytes":6757,"sha256":"833abb967b34df70954386b375fc4c8742ec56100a192b1165dfd3c50bd23f2e"},{"path":"assets/GgufArtifactReader-BNrO4g7x.js","bytes":4026,"sha256":"1dfc0a4c47784dfacd9606fe40aa866627dfb42dde08b5deb73621cc58260dcb"},{"path":"assets/GgufArtifactReader-BV3uUvNA.js","bytes":6979,"sha256":"9fbb0a5a1dd197e5beb9fa1a1a5403b8826cfb1cd643ddf5dd3c48b68bf006d6"},{"path":"assets/index-Douplpni.js","bytes":3985,"sha256":"d8ee8e1328a2ee40b9a228f504ad4d8cd35dcde1d9ed0b2157d04c529e55bf3d"},{"path":"assets/IpfsArtifactTransport-BsmKcUX2.js","bytes":504526,"sha256":"329b70495c2159da261e2d372e3ce5aab674d837ea15096528b44f2036ca4d73"},{"path":"assets/main-Bi25mBGM.js","bytes":757559,"sha256":"f83131cc4cd3a2f8d113cb2d1a9c793c1382119125e34c1ae0eccc4e07dd69ff"},{"path":"assets/main-CkJDghZg.css","bytes":8803,"sha256":"f2b2a0340f8662b86bea135b6a5353ea844ba841eba8de17b7a84b4ff623e88a"},{"path":"assets/ModelInferenceService-BIMo8qtF.js","bytes":13876,"sha256":"2daccbbf845736de0e8a1b3ae33835e9b047f7abfd9dccf41d435a7ca9c5ee2f"},{"path":"assets/modelTask-B3yYydpp.js","bytes":22361,"sha256":"00b31ca5822a41f3f1c682e9f003da78ce7221b9ef91e31a5dd6909774fbd83a"},{"path":"assets/modelTask-CB1DhJUx.js","bytes":104741,"sha256":"6da3c25eb6ae53c6bbb5307d6b0aee2b801070d64331adfbcd0160e17ba4fb76"},{"path":"assets/modelTask-D40M3yPC.js","bytes":133822,"sha256":"7e2543caf81f83a51af3c327a8544b71044935c113375c816264bcbe76cc7e3c"},{"path":"assets/modelTask-dQfjl6lX.js","bytes":32055,"sha256":"cca6aadff8def4fcd9ff86063643063387ec645b48fa2738d166c401c1bf29bd"},{"path":"assets/modelTask-DX7CJdwf.js","bytes":13125,"sha256":"c9f855d47109dd061eb3cd5af4f29a9202ee69e2c518f5d107652ebd6ac63c20"},{"path":"assets/NetworkManager-CvvmHw9V.js","bytes":1035964,"sha256":"88e3de52817e3c2745b974a2904e70a676f3007cdc6882cf3d18f19118accb1a"},{"path":"assets/ort.all.bundle.min-Yg0WefYz.js","bytes":872281,"sha256":"32e4bb67f0eafff26f05c9231a1e1a59c3d35cf831e633721e4dbf081d26c582"},{"path":"assets/PeerInferenceService-4zpDK9bF.js","bytes":18172,"sha256":"a26568eb8f0cb425fe25074f77d44b63e1664ba08e73b7c5a4cd5f3df97c7e7f"},{"path":"assets/ResidentModelAdmission-DVtD0-m7.js","bytes":1388,"sha256":"8be529702a4486120e230c8b9adbfa08d72b2c4e8707969f1a9db325a6fc7191"},{"path":"assets/ResourceLeaseBroker-BgqO15eI.js","bytes":6290,"sha256":"31ac611cfa0ecd569f0729210c5ada1df43d9229fba11dd60e1ad797629703f1"},{"path":"assets/runtimeDefinition-CN5yHgpg.js","bytes":3415,"sha256":"d6f2e3bf79932449b71346c553c7a83874f5b5d217246a5f08fbf92993bf0f99"},{"path":"assets/runtimeDefinition-CztcbSX9.js","bytes":3866,"sha256":"924a0c41630f656d77f23ae0fa75b4f9a145997b6eb0382c780a80054d2b784d"},{"path":"assets/transformers.web-CsR9rRO0.js","bytes":594996,"sha256":"c2e067316978078e1aeba82175bb2e9808f090e1d63de440f6f2b13ea8e6849e"},{"path":"assets/transformers.web-DGNMtDcj.js","bytes":595048,"sha256":"c7b82527feef029ff081fb462604f159bfc7bbc737136b3117744a131baeeec3"},{"path":"icons/peercompute-192.png","bytes":994,"sha256":"236c8aeb96d0b23b5d7fa4dea502ef628e61ec3a51691e2e5aa99da078f00ce7"},{"path":"icons/peercompute-512.png","bytes":3212,"sha256":"5254738bc2bdbf7ef3e202f47a1071847cb628f00b382c77372203cc290ef0c2"},{"path":"icons/peercompute-maskable-512.png","bytes":3212,"sha256":"5254738bc2bdbf7ef3e202f47a1071847cb628f00b382c77372203cc290ef0c2"},{"path":"icons/peercompute.svg","bytes":355,"sha256":"e2b68ca7db509c436ce02efbbf56d4280da77d90ca06ed121f92cac7ae126ec8"},{"path":"index.html","bytes":927,"sha256":"dbd98340f6f2839a7369067fe49fc7f2aebecae30ca49273602ec4ebc21ea630"},{"path":"manifest.webmanifest","bytes":685,"sha256":"7f8cdb53c0d24afadad6e80ea41e377615ded82bfc8683e7f9d872e142ce02b0"}]};
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

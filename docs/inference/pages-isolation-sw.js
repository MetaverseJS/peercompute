const __PEERCOMPUTE_APP_SHELL__ = {"version":"78f79380c23f3e8d265302d067e0f269a5a550010a363760aed3b97e47d43d71","files":[{"path":"assets/ArtifactProviderRecord-DakRSuja.js","bytes":13335,"sha256":"8be2378d124ea720ab32d95d70815764ea49440f8e67a0a8fc8c9d22db9f0b7d"},{"path":"assets/computeWorker-CVoC4HQV.js","bytes":6757,"sha256":"9ef7e09225d2f9335c20ddd654dcb3e3a6910abbe64c5a3dbbd600549bc909e8"},{"path":"assets/GgufArtifactReader-BV3uUvNA.js","bytes":6979,"sha256":"9fbb0a5a1dd197e5beb9fa1a1a5403b8826cfb1cd643ddf5dd3c48b68bf006d6"},{"path":"assets/GgufArtifactReader-D-AKJ8ex.js","bytes":4026,"sha256":"b227ac60570422e6521d70ae096d207f7d88eeabdadee05f7f8d887eff2d7c39"},{"path":"assets/index-BbhYZWtV.js","bytes":3985,"sha256":"ceaefcf6dd4662628a5e7969326ace9a4da2f12ac99e26e6d38e50f26cf18b0e"},{"path":"assets/IpfsArtifactTransport-B2iXzlhg.js","bytes":504526,"sha256":"85102449118d6f67e806a65f74e483a9cafd796c411b855e28cb2607693b05a4"},{"path":"assets/main-BDHli8sO.js","bytes":753540,"sha256":"473500df3cc9a2944f98a3eda362e02e917ea3cbe3ab463a83fc22ecb567a05c"},{"path":"assets/main-Br4FEl2j.css","bytes":8084,"sha256":"155325e0a7dfbdacbcb2330edcb77818a7e9cf2fef41fe1e82ccd2c9a4672e7a"},{"path":"assets/ModelInferenceService-Gy9kAP4d.js","bytes":13876,"sha256":"2fbb7a07ead9646ae50f306b0df90ce04a9f7061c5925a1ca64e56133a829b11"},{"path":"assets/modelTask-_nqpry9E.js","bytes":11200,"sha256":"4dc1ba8aa656c3f61543dcac1573284823901dc927d3261d140ebdfeb75a5f5c"},{"path":"assets/modelTask-CSw5u1sQ.js","bytes":20429,"sha256":"950258c2a33445a8d5a687328c49c4a448486359d0cede2613738402f72aaade"},{"path":"assets/modelTask-D40M3yPC.js","bytes":133822,"sha256":"7e2543caf81f83a51af3c327a8544b71044935c113375c816264bcbe76cc7e3c"},{"path":"assets/modelTask-dQfjl6lX.js","bytes":32055,"sha256":"cca6aadff8def4fcd9ff86063643063387ec645b48fa2738d166c401c1bf29bd"},{"path":"assets/modelTask-unobKtl8.js","bytes":104741,"sha256":"710414cc2bb74d2035a0feb3696670d52f492be3e8780083777284c56c22bf0e"},{"path":"assets/NetworkManager-Ca7bkWsa.js","bytes":1035964,"sha256":"9125614e631b26193bfe51d66ff3c442fc40e5774cb9ce795ff66f02c731e6e4"},{"path":"assets/ort.all.bundle.min-Yg0WefYz.js","bytes":872281,"sha256":"32e4bb67f0eafff26f05c9231a1e1a59c3d35cf831e633721e4dbf081d26c582"},{"path":"assets/PeerInferenceService-CwQRBD4M.js","bytes":17403,"sha256":"ce21d22b3086c7315e638c4f9c6e374e5169e179a147a8ebb41eb6b424a6e0ae"},{"path":"assets/ResidentModelAdmission-DVtD0-m7.js","bytes":1388,"sha256":"8be529702a4486120e230c8b9adbfa08d72b2c4e8707969f1a9db325a6fc7191"},{"path":"assets/ResourceLeaseBroker-BgqO15eI.js","bytes":6290,"sha256":"31ac611cfa0ecd569f0729210c5ada1df43d9229fba11dd60e1ad797629703f1"},{"path":"assets/runtimeDefinition-CuF6Fycr.js","bytes":3866,"sha256":"27b392153a9ed6eedc26cbd88a6dc11a312953f54a5f043d45ee68749a3b8b08"},{"path":"assets/runtimeDefinition-V89Xz8gA.js","bytes":3415,"sha256":"3e9fd19138c8b33bd1c5ca06df9d9f9ff96eb723a7316fa6d2194d10f4216de3"},{"path":"assets/transformers.web-CsR9rRO0.js","bytes":594996,"sha256":"c2e067316978078e1aeba82175bb2e9808f090e1d63de440f6f2b13ea8e6849e"},{"path":"assets/transformers.web-DGNMtDcj.js","bytes":595048,"sha256":"c7b82527feef029ff081fb462604f159bfc7bbc737136b3117744a131baeeec3"},{"path":"icons/peercompute-192.png","bytes":994,"sha256":"236c8aeb96d0b23b5d7fa4dea502ef628e61ec3a51691e2e5aa99da078f00ce7"},{"path":"icons/peercompute-512.png","bytes":3212,"sha256":"5254738bc2bdbf7ef3e202f47a1071847cb628f00b382c77372203cc290ef0c2"},{"path":"icons/peercompute-maskable-512.png","bytes":3212,"sha256":"5254738bc2bdbf7ef3e202f47a1071847cb628f00b382c77372203cc290ef0c2"},{"path":"icons/peercompute.svg","bytes":355,"sha256":"e2b68ca7db509c436ce02efbbf56d4280da77d90ca06ed121f92cac7ae126ec8"},{"path":"index.html","bytes":927,"sha256":"e0a6fe52c3bcaae1e18cff7c2b955428f4f970d030a41cb1e0b8482579703d63"},{"path":"manifest.webmanifest","bytes":685,"sha256":"7f8cdb53c0d24afadad6e80ea41e377615ded82bfc8683e7f9d872e142ce02b0"}]};
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

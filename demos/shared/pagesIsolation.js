const RELOAD_KEY = 'peercompute:pages-isolation:v1:';

function controlledBy(serviceWorker, workerUrl) {
  return serviceWorker.controller?.scriptURL === workerUrl;
}

function waitForController(serviceWorker, workerUrl, signal) {
  if (controlledBy(serviceWorker, workerUrl)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      serviceWorker.removeEventListener('controllerchange', changed);
      signal.removeEventListener('abort', aborted);
    };
    const changed = () => {
      if (controlledBy(serviceWorker, workerUrl)) { cleanup(); resolve(); }
    };
    const aborted = () => { cleanup(); reject(signal.reason); };
    serviceWorker.addEventListener('controllerchange', changed);
    signal.addEventListener('abort', aborted, { once: true });
    if (signal.aborted) aborted(); else changed();
  });
}

/** Static-host isolation only. Failure leaves the existing application usable. */
export async function ensurePagesIsolation({ scope = globalThis, timeoutMs = 3000 } = {}) {
  const unavailable = (reason) => ({ status: 'unavailable', reloading: false,
    reason: String(reason?.message ?? reason).slice(0, 240) });
  if (scope.crossOriginIsolated === true) return { status: 'isolated', reloading: false };
  if (!scope.isSecureContext || !scope.navigator?.serviceWorker) {
    return unavailable('This browser context cannot install the isolation service worker');
  }
  const controller = new AbortController();
  let timer;
  try {
    if (!Number.isFinite(timeoutMs) || timeoutMs < 1 || timeoutMs > 10000) {
      throw new Error('Invalid isolation startup deadline');
    }
    const directory = new URL('./', scope.location.href);
    const workerUrl = new URL('pages-isolation-sw.js', directory).href;
    const serviceWorker = scope.navigator.serviceWorker;
    if (serviceWorker.controller && !controlledBy(serviceWorker, workerUrl)) {
      return unavailable('Another service worker controls this page');
    }
    const key = `${RELOAD_KEY}${directory.pathname}`;
    // Keep a failed attempt for this tab/session: repeated navigation must not loop.
    if (scope.sessionStorage.getItem(key)) return unavailable('Isolation reload was already attempted');
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => {
        const error = new Error('Isolation startup timed out');
        controller.abort(error); reject(error);
      }, timeoutMs);
    });
    const registration = (async () => {
      await serviceWorker.register(workerUrl, {
        scope: directory.href, type: 'module', updateViaCache: 'none',
      });
      controller.signal.throwIfAborted();
      await waitForController(serviceWorker, workerUrl, controller.signal);
    })();
    await Promise.race([registration, deadline]);
    scope.sessionStorage.setItem(key, 'attempted');
    scope.location.reload();
    return { status: 'reloading', reloading: true, workerUrl, scope: directory.href };
  } catch (error) {
    return unavailable(error);
  } finally {
    clearTimeout(timer);
    controller.abort(new Error('Isolation startup finished'));
  }
}

/** No top-level await: the application entry must finish before shared chunks load. */
export async function startPagesDemo(start, options = {}) {
  const scope = options.scope ?? globalThis;
  const status = await ensurePagesIsolation(options);
  scope.__peercomputeIsolation = status;
  if (!status.reloading) return start();
}

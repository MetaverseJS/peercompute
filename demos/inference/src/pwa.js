/** Installation is browser-owned and requires an explicit user gesture. */
export function createPwaInstallController({ scope = globalThis, onChange } = {}) {
  const listeners = new Set(onChange ? [onChange] : []);
  const displayMode = scope.matchMedia?.('(display-mode: standalone)');
  let installed = displayMode?.matches === true || scope.navigator?.standalone === true;
  let pending = null, installing = false, disposed = false;
  const secure = scope.isSecureContext === true;
  const supportsPrompt = 'onbeforeinstallprompt' in scope;
  const instructions = () => installed ? 'PeerCompute is installed on this device.'
    : !secure ? 'Open this console over HTTPS to install it.'
      : /iPad|iPhone|iPod/.test(scope.navigator?.userAgent ?? '')
        ? 'In Safari, open Share, then Add to Home Screen. The app shell can open offline; models remain managed by the browser’s storage.'
        : 'Use your browser’s Install app or Add to Home Screen menu, if available. The app shell can open offline; downloading models and peer connections need a network.';
  const getState = () => Object.freeze({ supported: secure && supportsPrompt,
    available: secure && !!pending && !installed && !installing && !disposed,
    installed, installing, instructions: instructions() });
  const emit = () => {
    if (disposed) return;
    const state = getState();
    for (const listener of listeners) { try { listener(state); } catch {} }
  };
  const beforeInstall = (event) => {
    if (!secure || installed || disposed || typeof event.prompt !== 'function') return;
    event.preventDefault(); pending = event; emit();
  };
  const appInstalled = () => { installed = true; pending = null; installing = false; emit(); };
  const modeChanged = () => { installed = displayMode?.matches === true || scope.navigator?.standalone === true; emit(); };
  scope.addEventListener?.('beforeinstallprompt', beforeInstall);
  scope.addEventListener?.('appinstalled', appInstalled);
  displayMode?.addEventListener?.('change', modeChanged);
  return Object.freeze({
    getState,
    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('Install listener must be a function');
      if (disposed) return () => {};
      listeners.add(listener); listener(getState());
      return () => listeners.delete(listener);
    },
    async install() {
      if (installed) return { outcome: 'installed' };
      if (!pending || installing || disposed || !secure) return { outcome: 'unavailable', instructions: instructions() };
      const event = pending; pending = null; installing = true; emit();
      try {
        // Call synchronously in the click's user activation, before any other await.
        const result = await event.prompt();
        const choice = event.userChoice ? await event.userChoice : result;
        return { outcome: choice?.outcome === 'accepted' ? 'accepted' : 'dismissed' };
      } finally { installing = false; emit(); }
    },
    dispose() {
      if (disposed) return;
      disposed = true; pending = null; listeners.clear();
      scope.removeEventListener?.('beforeinstallprompt', beforeInstall);
      scope.removeEventListener?.('appinstalled', appInstalled);
      displayMode?.removeEventListener?.('change', modeChanged);
    },
  });
}

/** Same URL/scope as Pages isolation; never replace an unrelated controller. */
export async function registerConsoleAppShell({ scope = globalThis } = {}) {
  if (!scope.isSecureContext || !scope.navigator?.serviceWorker) return null;
  const directory = new URL('./', scope.location.href);
  const workerUrl = new URL('pages-isolation-sw.js', directory).href;
  const workers = scope.navigator.serviceWorker;
  if (workers.controller && workers.controller.scriptURL !== workerUrl) return null;
  return workers.register(workerUrl, { scope: directory.href, type: 'module', updateViaCache: 'none' });
}

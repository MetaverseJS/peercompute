import { createNetworkStatus } from '../../../inference/src/ui/networkStatus.js';

// Borrow the world's model runtime; this widget owns only its view and refresh cadence.
export function mountCubeNetworkStatus({ container, actions, getRuntime }) {
  let visible = false, enabled = true, disposed = false, pending, issue, timer;
  function update() {
    if (!enabled || disposed) return;
    const runtime = getRuntime();
    const discovery = runtime?.getDiscoveryStatus?.();
    const connected = discovery?.connected ?? runtime?.networkReady;
    widget.update({ ...discovery, connected, connecting: !connected && (pending !== undefined || !runtime),
      inferenceModels: visible && connected ? runtime.listInferenceTargets() : [],
      issue: issue ?? discovery?.errors?.[0]?.message, artifacts: runtime?.getArtifactNetworkStatus?.() });
  }
  function tick() {
    if (!enabled || disposed) return;
    const runtime = getRuntime();
    if (visible && (runtime?.networkReady ?? runtime?.getDiscoveryStatus?.()?.connected) && !pending) {
      pending = Promise.resolve().then(() => runtime.refreshPeers()).then(
        () => { issue = undefined; }, error => { issue = error; },
      ).finally(() => { pending = undefined; update(); });
    }
    update();
  }
  const widget = createNetworkStatus({ container, onVisibilityChange(open) {
    visible = open;
    if (open) tick();
  } });
  actions.append(widget.trigger);
  function setEnabled(value) {
    enabled = value;
    if (enabled) { timer ??= setInterval(tick, 5000); update(); }
    else { clearInterval(timer); timer = undefined; widget.close({ restoreFocus: false }); }
  }
  setEnabled(true);
  return { setEnabled, dispose() { disposed = true; setEnabled(false); widget.dispose(); } };
}

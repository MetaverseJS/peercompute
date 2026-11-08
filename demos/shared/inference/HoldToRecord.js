/**
 * Bind a single physical hold to an application's recording lifecycle.
 * Callbacks are synchronous notifications: the caller owns async startup,
 * permission, recording and cleanup. In particular, release during startup
 * must cancel that startup; this helper never waits and then starts recording.
 */
export function bindHoldToRecord({ button, onStart, onRelease, onCancel }) {
  if (!button?.ownerDocument || typeof onStart !== 'function'
    || typeof onRelease !== 'function' || typeof onCancel !== 'function') {
    throw new TypeError('HoldToRecord requires a button and start/release/cancel callbacks');
  }
  const document = button.ownerDocument, window = document.defaultView;
  const listeners = [], previousTouchAction = button.style.touchAction;
  let gesture = null, disposed = false;
  button.style.touchAction = 'none';

  function listen(target, type, callback, options) {
    target.addEventListener(type, callback, options);
    listeners.push(() => target.removeEventListener(type, callback, options));
  }
  function clear() {
    const previous = gesture;
    // Clear ownership before releasing capture: lostpointercapture may follow.
    gesture = null;
    if (previous?.kind === 'pointer') {
      try {
        if (button.hasPointerCapture(previous.pointerId)) button.releasePointerCapture(previous.pointerId);
      } catch { /* The browser may already have cancelled this pointer. */ }
    }
    return previous;
  }
  function finish(callback, event, reason) {
    const previous = clear();
    if (previous) callback({ ...previous, event, reason });
  }
  function cancel(event, reason) { finish(onCancel, event, reason); }
  function allowed() { return !disposed && !gesture && !button.disabled && button.getAttribute('aria-disabled') !== 'true'; }
  function start(next, event) {
    gesture = next;
    if (next.kind === 'pointer') {
      // Capture before notifying the caller, which may synchronously reset us.
      try { button.setPointerCapture(next.pointerId); } catch { /* Window listeners cover release without capture. */ }
    }
    try { onStart({ ...next, event }); }
    catch (error) { clear(); throw error; }
  }
  const heldKey = (event) => event.key === ' ' || event.key === 'Spacebar' ? 'Space' : event.key === 'Enter' ? 'Enter' : null;

  listen(button, 'pointerdown', (event) => {
    if (!allowed() || event.isPrimary === false || event.button !== 0) return;
    event.preventDefault();
    button.focus({ preventScroll: true });
    start({ kind: 'pointer', pointerId: event.pointerId }, event);
  });
  listen(window, 'pointerup', (event) => {
    if (gesture?.kind !== 'pointer' || event.pointerId !== gesture.pointerId) return;
    event.preventDefault();
    finish(onRelease, event, 'release');
  }, true);
  listen(window, 'pointercancel', (event) => {
    if (gesture?.kind === 'pointer' && event.pointerId === gesture.pointerId) cancel(event, 'pointercancel');
  }, true);
  listen(button, 'lostpointercapture', (event) => {
    if (gesture?.kind === 'pointer' && event.pointerId === gesture.pointerId) cancel(event, 'lostpointercapture');
  });
  listen(button, 'keydown', (event) => {
    const key = heldKey(event);
    if (!key) return;
    event.preventDefault();
    if (!event.repeat && allowed()) start({ kind: 'keyboard', key }, event);
  });
  listen(window, 'keyup', (event) => {
    if (gesture?.kind !== 'keyboard' || heldKey(event) !== gesture.key) return;
    event.preventDefault();
    finish(onRelease, event, 'release');
  }, true);
  // Native keyboard activation, touch compatibility clicks and .click() must
  // never create a second recording or act as a toggle.
  listen(button, 'click', (event) => event.preventDefault());
  listen(button, 'contextmenu', (event) => event.preventDefault());
  listen(button, 'blur', (event) => cancel(event, 'blur'));
  listen(window, 'blur', (event) => cancel(event, 'blur'));
  listen(document, 'visibilitychange', (event) => {
    if (document.hidden) cancel(event, 'hidden');
  });

  return {
    getState: () => gesture ? { ...gesture } : null,
    reset() { clear(); },
    dispose() {
      if (disposed) return;
      disposed = true;
      try { cancel(undefined, 'dispose'); }
      finally {
        for (const remove of listeners) remove();
        if (button.style.touchAction === 'none') button.style.touchAction = previousTouchAction;
      }
    },
  };
}

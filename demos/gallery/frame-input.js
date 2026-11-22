// A drawable iframe or native DOM surface has one rectangular native hit surface.
// Translate that invisible surface at the pointer so the browser can dispatch its own
// trusted events, focus controls, open selects, scroll and drag at the displayed pixel.
// The desktop compositor always draws its pixels at their unwarped location.
export function createFrameInput({ stage, frame = null, root, shader }) {
  const own = new AbortController();
  let childEvents;
  let active = false;
  let lastScreenX, lastScreenY;

  function align(x, y) {
    const desk = root.getBoundingClientRect();
    if (!desk.width || !desk.height) return;
    const u = (x - desk.left) / desk.width;
    const v = (y - desk.top) / desk.height;
    if (u < 0 || v < 0 || u > 1 || v > 1) return;
    const pixel = shader.warpPoint(u, v);
    const dx = Math.round((u - pixel.u) * desk.width * 4) / 4;
    const dy = Math.round((v - pixel.v) * desk.height * 4) / 4;
    const translate = dx || dy ? dx + 'px ' + dy + 'px' : '';
    if (stage.style.translate !== translate) stage.style.translate = translate;
  }

  function listen(target, signal, child = false) {
    const adjust = event => {
      if (!active || stage.hidden || !event.isTrusted || event.isPrimary === false) return;
      // Chrome can deliver pointerover and pointermove for one physical
      // position using client coordinates from before the first translation.
      // Reapplying that stale position would move the native target twice.
      if (child && event.screenX === lastScreenX && event.screenY === lastScreenY) return;
      lastScreenX = event.screenX;
      lastScreenY = event.screenY;
      let { clientX: x, clientY: y } = event;
      if (child && frame) {
        // Events don't bubble out of the iframe. Its current bounds already
        // include the last translation, so this recovers viewport coordinates.
        const box = frame.getBoundingClientRect();
        x += box.left;
        y += box.top;
      }
      align(x, y);
    };
    const options = { capture: true, passive: true, signal };
    // A first touch emits pointerover ahead of the eventual native click. The
    // initial touchstart itself stays associated with its original hit target.
    for (const type of ['pointerover', 'pointermove', 'wheel']) {
      target.addEventListener(type, adjust, options);
    }
  }

  function bindChild() {
    childEvents?.abort();
    lastScreenX = lastScreenY = undefined;
    if (!frame) return;
    const doc = frame.contentDocument;
    if (!doc) return;
    childEvents = new AbortController();
    listen(doc, childEvents.signal, true);
  }
  listen(window, own.signal);
  if (frame) {
    frame.addEventListener('load', bindChild, { signal: own.signal });
    bindChild();
  }

  return {
    setActive(value) {
      if (active === value) return;
      active = value;
      lastScreenX = lastScreenY = undefined;
      if (!active) stage.style.translate = '';
    },
    dispose() {
      active = false;
      stage.style.translate = '';
      childEvents?.abort();
      own.abort();
    },
  };
}

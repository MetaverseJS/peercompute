// The launcher and standalone guides both supply SVGs generated from the repository's READMEs.
export function openDiagram({ svg, title = 'Architecture diagram', returnFocus }) {
  const existing = document.querySelector('dialog.pc-diagram-viewer[open]');
  if (existing) return existing;
  const source = typeof svg === 'string'
    ? new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement
    : svg;
  if (source?.localName !== 'svg') throw new Error('The guide diagram is missing its SVG.');
  const vector = document.importNode(source, true);
  const width = vector.viewBox.baseVal.width || vector.width.baseVal.value;
  const height = vector.viewBox.baseVal.height || vector.height.baseVal.value;
  if (!(width > 0 && height > 0)) throw new Error('The guide diagram needs a positive size.');

  const previousFocus = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'pc-diagram-viewer';
  dialog.setAttribute('aria-label', title);
  dialog.innerHTML = `
    <div class="pc-diagram-toolbar">
      <strong></strong>
      <button type="button" aria-label="Zoom out" title="Zoom out (−)">−</button>
      <button type="button" aria-label="Zoom in" title="Zoom in (+)">+</button>
      <button type="button" aria-label="Fit diagram" title="Fit diagram (0)">Fit</button>
      <button type="button" aria-label="Close" title="Close (Esc)">Close</button>
    </div>
    <div class="pc-diagram-viewport" tabindex="0" role="region" aria-label="Diagram viewport"
      aria-description="Use + or − to zoom, arrow keys to pan, and 0 to fit.">
      <div class="pc-diagram-art"></div>
    </div>`;
  dialog.querySelector('strong').textContent = title;
  const [zoomOut, zoomIn, fit, close] = dialog.querySelectorAll('button');
  const viewport = dialog.querySelector('.pc-diagram-viewport');
  const art = dialog.querySelector('.pc-diagram-art');
  art.style.width = width + 'px';
  art.style.height = height + 'px';
  // Isolate the SVG's styles and marker IDs from other diagrams on the page,
  // as ExoWebTUI's MermaidSvgDesktopLayer does with its diagram stages.
  vector.setAttribute('width', '100%');
  vector.setAttribute('height', '100%');
  vector.setAttribute('role', 'img');
  vector.setAttribute('aria-label', title);
  for (const [token, color] of Object.entries({
    bg: 'var(--paper)', fg: 'var(--ink)', line: 'var(--guide-muted, #82b59b)',
    accent: 'var(--accent-ink)', border: 'var(--rule)',
  })) vector.style.setProperty('--' + token, color);
  vector.style.display = 'block';
  art.attachShadow({ mode: 'open' }).append(vector);
  document.body.append(dialog);
  dialog.showModal();
  viewport.focus({ preventScroll: true });

  const maxZoom = 16;
  let zoom = 1;
  let centerX = width / 2, centerY = height / 2;
  let stageWidth, stageHeight, fitScale;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function constrainCenter(center, length, visible) {
    return visible >= length ? length / 2 : clamp(center, visible / 2, length - visible / 2);
  }
  function paint() {
    const scale = zoom * fitScale;
    centerX = constrainCenter(centerX, width, stageWidth / scale);
    centerY = constrainCenter(centerY, height, stageHeight / scale);
    const left = stageWidth / 2 - centerX * scale;
    const top = stageHeight / 2 - centerY * scale;
    art.style.transform = 'translate(' + left + 'px, ' + top + 'px) scale(' + scale + ')';
    viewport.classList.toggle('can-pan', zoom > 1);
    zoomOut.disabled = zoom <= 1;
    zoomIn.disabled = zoom >= maxZoom;
  }
  function measure() {
    stageWidth = viewport.clientWidth;
    stageHeight = viewport.clientHeight;
    if (!stageWidth || !stageHeight) return;
    fitScale = Math.min(stageWidth / width, stageHeight / height);
    paint();
  }
  measure();
  const resize = new ResizeObserver(measure);
  resize.observe(viewport);

  // Keep the diagram point under the old pointer position under the new one.
  // A drag translates that point, a wheel scales around it, and a pinch does both.
  function transform(from, to, factor) {
    if (!fitScale) return;
    const oldScale = fitScale * zoom;
    zoom = clamp(zoom * factor, 1, maxZoom);
    const newScale = fitScale * zoom;
    centerX += (from.x - stageWidth / 2) / oldScale - (to.x - stageWidth / 2) / newScale;
    centerY += (from.y - stageHeight / 2) / oldScale - (to.y - stageHeight / 2) / newScale;
    paint();
  }
  function centeredZoom(factor) {
    const center = { x: stageWidth / 2, y: stageHeight / 2 };
    transform(center, center, factor);
  }
  function reset() {
    zoom = 1;
    paint();
  }
  zoomOut.onclick = () => centeredZoom(1 / 1.5);
  zoomIn.onclick = () => centeredZoom(1.5);
  fit.onclick = reset;
  close.onclick = () => dialog.close();

  // Chrome may suppress the compatibility click for a tap following a pan.
  // Activate an in-bounds toolbar tap on release and suppress its synthetic click.
  const toolbar = dialog.querySelector('.pc-diagram-toolbar');
  let tap;
  toolbar.addEventListener('touchstart', event => {
    const button = event.target.closest('button');
    const finger = event.changedTouches[0];
    tap = event.touches.length === 1 && button && !button.disabled
      ? { button, id: finger.identifier, x: finger.clientX, y: finger.clientY } : undefined;
  }, { passive: true });
  toolbar.addEventListener('touchmove', event => {
    const finger = event.changedTouches[0];
    if (tap && Math.hypot(finger.clientX - tap.x, finger.clientY - tap.y) > 12) tap = undefined;
  }, { passive: true });
  toolbar.addEventListener('touchcancel', () => { tap = undefined; });
  toolbar.addEventListener('touchend', event => {
    const press = tap, finger = event.changedTouches[0];
    tap = undefined;
    if (!press || event.touches.length || finger.identifier !== press.id) return;
    if (!press.button.contains(document.elementFromPoint(finger.clientX, finger.clientY))) return;
    event.preventDefault();
    press.button.focus({ preventScroll: true });
    press.button.click();
  }, { passive: false });

  const point = event => {
    const box = viewport.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  viewport.addEventListener('wheel', event => {
    event.preventDefault();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stageHeight : 1);
    const anchor = point(event);
    transform(anchor, anchor, Math.exp(clamp(-delta / 350, -1, 1)));
  }, { passive: false });

  const pointers = new Map();
  function gesture() {
    const [a, b] = pointers.values();
    if (!b) return { center: a, distance: 0 };
    return {
      center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      distance: Math.hypot(a.x - b.x, a.y - b.y),
    };
  }
  viewport.onpointerdown = event => {
    if (event.button !== 0 || pointers.size >= 2) return;
    viewport.focus({ preventScroll: true });
    pointers.set(event.pointerId, point(event));
    viewport.setPointerCapture(event.pointerId);
  };
  viewport.onpointermove = event => {
    if (!pointers.has(event.pointerId)) return;
    const before = gesture();
    pointers.set(event.pointerId, point(event));
    const after = gesture();
    const factor = before.distance > 1 && after.distance > 1 ? after.distance / before.distance : 1;
    transform(before.center, after.center, factor);
  };
  const ended = event => pointers.delete(event.pointerId);
  viewport.onlostpointercapture = ended;
  viewport.onpointerup = ended;
  viewport.onpointercancel = ended;

  dialog.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const step = (event.shiftKey ? 128 : 48) / (fitScale * zoom);
    switch (event.key) {
      case '+': case '=': centeredZoom(1.5); break;
      case '-': case '_': centeredZoom(1 / 1.5); break;
      case '0': case 'Home': reset(); break;
      case 'ArrowLeft': centerX -= step; paint(); break;
      case 'ArrowRight': centerX += step; paint(); break;
      case 'ArrowUp': centerY -= step; paint(); break;
      case 'ArrowDown': centerY += step; paint(); break;
      case 'Escape': dialog.close(); break;
      default: return;
    }
    event.stopPropagation();
    event.preventDefault();
  });
  dialog.addEventListener('close', () => {
    resize.disconnect();
    dialog.remove();
    if (returnFocus) returnFocus();
    else if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  }, { once: true });
  return dialog;
}

for (const wrapper of document.querySelectorAll('body.pc-guide .diagram')) {
  const svg = wrapper.querySelector('svg');
  if (!svg) continue;
  const title = wrapper.getAttribute('aria-label') || 'Architecture diagram';
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'button');
  wrapper.setAttribute('aria-haspopup', 'dialog');
  wrapper.setAttribute('aria-label', 'Enlarge ' + title);
  wrapper.title = 'Enlarge ' + title;
  const open = () => openDiagram({ svg, title, returnFocus: () => wrapper.focus({ preventScroll: true }) });
  wrapper.onclick = open;
  wrapper.onkeydown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  };
}

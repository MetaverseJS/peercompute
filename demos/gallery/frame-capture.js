const samplePositions = [[.5, .5], [.25, .25], [.75, .75], [.25, .75], [.75, .25],
  [.5, .2], [.5, .8], [.2, .5], [.8, .5]];
const retryDelays = [400, 700, 1200, 2400, 4800, 8000];

// A drawable ancestor lets Chrome paint the toolbar and the live same-origin
// iframe into one bitmap. drawElementImage also keeps the nested DOM hittable.
export function createFrameCapture({ stage, surface, frame }) {
  if (surface.hasAttribute('data-pc-foreign')) return null;
  const canvas = document.createElement('canvas');
  if (!('content' in canvas) || typeof canvas.requestPaint !== 'function' ||
      typeof CanvasRenderingContext2D.prototype.drawElementImage !== 'function' ||
      typeof stage.moveBefore !== 'function') return null;
  canvas.setAttribute('content', 'drawable');
  const context = canvas.getContext('2d');
  if (!context) return null;
  canvas.className = 'pc-demo-capture';
  Object.assign(canvas.style, { display: 'block', width: '100%', height: '100%' });
  surface.setAttribute('drawable', '');
  canvas.append(surface);
  stage.append(canvas);

  let width = 0, height = 0, ready = false, stopped = false, nextSceneScan = 0;
  let pendingCheck;
  let scheduled = Infinity;
  let samples;
  const checks = new WeakMap();

  function dispose() {
    stopped = true;
    ready = false;
    clearTimeout(pendingCheck);
    frame.removeEventListener('load', loaded);
    canvas.onpaint = null;
  }

  function fallback(reason) {
    dispose();
    stage.dataset.captureFallback = reason;
    // moveBefore preserves the iframe's browsing context and running workers.
    stage.moveBefore(surface, canvas);
    canvas.remove();
    surface.removeAttribute('drawable');
    surface.style.removeProperty('width');
    surface.style.removeProperty('height');
  }

  // Some browsers flatten HTML but omit a separately composited GPU canvas.
  // Compare unobscured pixels during startup. One stale frame, a translucent
  // HUD, or a cleared GPU backbuffer can legitimately change individual samples.
  // Acquiring a context on the child here would preempt its own renderer.
  function compareCanvas(child, bounds, doc) {
    if (!samples) {
      const buffer = document.createElement('canvas');
      buffer.width = 2;
      buffer.height = samplePositions.length;
      samples = buffer.getContext('2d', { willReadFrequently: true });
      samples.imageSmoothingEnabled = false;
    }
    const sx = canvas.width / width, sy = canvas.height / height;
    samples.clearRect(0, 0, 2, samplePositions.length);
    let count = 0;
    for (const [u, v] of samplePositions) {
      const x = bounds.left + bounds.width * u, y = bounds.top + bounds.height * v;
      if (x < 0 || y < 0 || x >= frame.clientWidth || y >= frame.clientHeight ||
          doc.elementFromPoint(x, y) !== child) continue;
      samples.drawImage(child, Math.floor(u * child.width), Math.floor(v * child.height), 1, 1, 0, count, 1, 1);
      samples.drawImage(canvas, Math.floor((frame.offsetLeft + x) * sx),
        Math.floor((frame.offsetTop + y) * sy), 1, 1, 1, count, 1, 1);
      count++;
    }
    if (!count) return 'unknown';
    const pairs = samples.getImageData(0, 0, 2, count).data;
    let opaque = 0, close = 0, distant = 0;
    for (let p = 0; p < pairs.length; p += 8) {
      if (pairs[p + 3] < 250) continue;
      opaque++;
      const delta = Math.max(Math.abs(pairs[p] - pairs[p + 4]), Math.abs(pairs[p + 1] - pairs[p + 5]),
        Math.abs(pairs[p + 2] - pairs[p + 6]), Math.abs(pairs[p + 3] - pairs[p + 7]));
      if (delta <= 16) close++;
      if (delta >= 32) distant++;
    }
    if (opaque && close >= Math.ceil(opaque * .65)) return 'match';
    if (opaque >= 2 && distant >= Math.ceil(opaque * .75)) return 'mismatch';
    return 'unknown';
  }

  function schedule(at) {
    if (at >= scheduled) return;
    clearTimeout(pendingCheck);
    scheduled = at;
    pendingCheck = setTimeout(() => {
      scheduled = Infinity;
      canvas.requestPaint();
    }, Math.max(0, Math.ceil(at - performance.now())));
  }

  function verifyCanvases(doc, now) {
    for (const child of doc.getElementsByTagName('canvas')) {
      const check = checks.get(child) || { attempts: 0, next: 0, mismatches: 0, firstMismatch: 0 };
      if (check.next > now) {
        nextSceneScan = Math.min(nextSceneScan, check.next);
        schedule(check.next);
        continue;
      }
      if (!child.width || !child.height) continue;
      const bounds = child.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1 || bounds.right <= 0 || bounds.bottom <= 0 ||
          bounds.left >= frame.clientWidth || bounds.top >= frame.clientHeight) continue;
      let result = compareCanvas(child, bounds, doc);
      // DOM compositing can intentionally alter every pixel of a translucent
      // or filtered canvas. A raw bitmap can't verify that presentation.
      if (result === 'mismatch') {
        const style = doc.defaultView.getComputedStyle(child);
        if (Number(style.opacity) < 1 || style.filter !== 'none' || style.mixBlendMode !== 'normal') result = 'unknown';
      }
      if (result === 'mismatch') {
        if (!check.mismatches) check.firstMismatch = now;
        check.mismatches++;
        if (check.mismatches >= 3 && now - check.firstMismatch >= 1500) return false;
      } else {
        check.mismatches = 0;
      }
      check.next = result === 'match' || check.attempts >= retryDelays.length
        ? Infinity : now + retryDelays[check.attempts];
      check.attempts++;
      checks.set(child, check);
      nextSceneScan = Math.min(nextSceneScan, check.next);
      schedule(check.next);
    }
    return true;
  }

  canvas.onpaint = () => {
    if (stopped || !width || !height || stage.hidden) return;
    try {
      const doc = frame.contentDocument;
      if (!doc) { fallback('foreign-document'); return; }
      context.clearRect(0, 0, canvas.width, canvas.height);
      // The element snapshot has its own physical pixel density. An explicit
      // destination size avoids applying devicePixelRatio a second time.
      context.drawElementImage(surface, 0, 0, canvas.width, canvas.height);
      const now = performance.now();
      if (now >= nextSceneScan) {
        nextSceneScan = now + 500;
        if (!verifyCanvases(doc, now)) { fallback('uncaptured-canvas'); return; }
      }
      ready = true;
    } catch {
      fallback('capture-unavailable');
    }
  };

  function loaded() {
    if (stopped) return;
    nextSceneScan = 0;
    canvas.requestPaint();
    schedule(performance.now() + 650);
  }
  frame.addEventListener('load', loaded);
  return {
    canvas,
    isReady: () => ready,
    resize(nextWidth, nextHeight) {
      if (stopped || nextWidth <= 0 || nextHeight <= 0) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(nextWidth * dpr));
      const h = Math.max(1, Math.round(nextHeight * dpr));
      if (width === nextWidth && height === nextHeight && canvas.width === w && canvas.height === h) return;
      width = nextWidth;
      height = nextHeight;
      surface.style.width = width + 'px';
      surface.style.height = height + 'px';
      canvas.width = w;
      canvas.height = h;
      ready = false;
      canvas.requestPaint();
    },
    dispose,
  };
}

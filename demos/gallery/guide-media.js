// Project media into the same unwarped surface as the document's text. A higher
// window covers diagrams exactly as it covers text, including in shaderless mode.
import { drawFrameLayers } from './frame-compositor.js';
import { subtract } from './frame-windows.js';

const normalize = (rect, origin, size) => ({
  left: (rect.column + origin.column) / size.columns, top: (rect.row + origin.row) / size.rows,
  width: rect.width / size.columns, height: rect.height / size.rows,
});

function intersect(a, b) {
  const left = Math.max(a.left, b.left), top = Math.max(a.top, b.top);
  return { left, top, width: Math.min(a.left + a.width, b.left + b.width) - left,
    height: Math.min(a.top + a.height, b.top + b.height) - top };
}

function themedImage(svg, theme) {
  const colors = { bg: theme.surface, fg: theme.text, accent: theme.accent, line: theme.muted, border: theme.border };
  // SVG loaded as an image has its own CSS scope. Supply its resolved tokens
  // here as well as in the zoom viewer, where the actual DOM inherits them.
  const style = Object.entries(colors).map(([key, rgb]) => '--' + key + ':rgb(' + rgb.join(',') + ');').join('');
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/(<svg\b[^>]*\bstyle=")([^"]*)"/, '$1$2;' + style + '"'));
}

export function createGuideMedia(root, presenter, mediaWindows) {
  const flat = document.createElement('canvas');
  flat.className = 'pc-guide-media';
  flat.setAttribute('aria-hidden', 'true');
  flat.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
  flat.hidden = true;
  root.appendChild(flat);
  const images = new Map();
  let layers = [], previousFlat = '', palette;

  function project(windows, theme, covers, animating) {
    layers = [];
    if (theme !== palette) { images.clear(); palette = theme; previousFlat = ''; }
    if (animating || !windows.some(win => mediaWindows.has(win.id))) {
      flat.hidden = true;
      previousFlat = '';
      return;
    }
    const size = presenter.size();
    const origin = { column: 0, row: 0 };
    const occluders = [...windows.map(win => win.rect), ...covers].map(rect => normalize(rect, origin, size));
    const screen = { left: 0, top: 0, width: 1, height: 1 };
    for (const [index, win] of windows.entries()) {
      const targets = mediaWindows.get(win.id)?.mediaTargets?.() || [];
      for (const target of targets) {
        const box = normalize(target.rect, win.clientRect, size);
        if (target.image) {
          const { width, height } = presenter.host.element;
          const w = target.image.naturalWidth || target.image.width;
          const h = target.image.naturalHeight || target.image.height;
          const scale = Math.min(box.width * width / w, box.height * height / h);
          const fittedWidth = w * scale / width, fittedHeight = h * scale / height;
          box.left += (box.width - fittedWidth) / 2;
          box.top += (box.height - fittedHeight) / 2;
          box.width = fittedWidth;
          box.height = fittedHeight;
        }
        const clip = intersect(intersect(box, normalize(target.clip, win.clientRect, size)), screen);
        if (clip.width <= 0 || clip.height <= 0) continue;
        let parts = [clip];
        for (const cover of occluders.slice(index + 1)) parts = parts.flatMap(p => subtract(p, cover));
        if (!parts.length) continue;
        const key = win.id + '/' + target.key;
        let image = target.image || images.get(key);
        if (!image) {
          image = new Image();
          image.src = target.svg ? themedImage(target.svg, theme) : target.href;
          images.set(key, image);
        }
        if (target.image || (image.complete && image.naturalWidth)) layers.push({ key, canvas: image, parts, box });
      }
    }
    const showFlat = layers.length > 0 && !presenter.shader.isPresenting();
    flat.hidden = !showFlat;
    if (!showFlat) { previousFlat = ''; return; }
    const { width, height } = presenter.host.element;
    const layout = JSON.stringify([width, height, layers.map(({key, parts, box}) => [key, parts, box])]);
    if (previousFlat === layout) return;
    if (flat.width !== width) flat.width = width;
    if (flat.height !== height) flat.height = height;
    const ctx = flat.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    drawFrameLayers(ctx, width, height, layers);
    previousFlat = layout;
  }
  return { project, layers: () => layers, dispose() { images.clear(); flat.remove(); } };
}

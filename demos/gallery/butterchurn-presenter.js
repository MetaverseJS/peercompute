// Butterchurn changes thousands of cell colors per frame. Scale one pixel per
// cell for the colors, and reuse the native terminal painter for the glyph ink.
import { BrowserCellCanvasSink } from 'exowebtui-cell-sink';

const foreground = [219, 234, 254];
const background = [7, 11, 18];
const shades = { '░': 1, '▒': 2, '▓': 3, '█': 4 };
const pack = (r, g, b) => r << 16 | g << 8 | b;

export function createButterchurnPresenter(host) {
  const canvas = host.element;
  const context = canvas.getContext('2d');
  const paper = document.createElement('canvas');
  const ink = document.createElement('canvas');
  const paperContext = paper.getContext('2d');
  const inkContext = ink.getContext('2d');
  const { cellWidth, cellHeight } = host.sink.inspectSink();
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const sink = new BrowserCellCanvasSink({ canvas: ink, cellWidth, cellHeight,
    font: '14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', background: 'transparent',
    devicePixelRatio: pixelRatio });
  let colors, glyphs, glyphColors, glyphBold, xEdges, yEdges;
  const edges = (count, extent, last) => Array.from({ length: count + 1 }, (_, i) =>
    (i === count ? last : Math.round(i * extent * pixelRatio)) / pixelRatio);
  function present(frame) {
    const rows = frame.length, columns = frame[0]?.length;
    if (!rows || !columns) return;
    if (!colors || colors.width !== columns || colors.height !== rows) {
      paper.width = columns;
      paper.height = rows;
      colors = paperContext.createImageData(columns, rows);
      sink.resize(columns, rows);
      xEdges = edges(columns, cellWidth, ink.width);
      yEdges = edges(rows, cellHeight, ink.height);
      glyphs = new Array(rows * columns).fill(' ');
      glyphColors = new Uint32Array(rows * columns);
      glyphBold = new Uint8Array(rows * columns);
    }
    const pixels = colors.data;
    const updates = [];
    let changed = false;
    for (let y = 0, index = 0; y < rows; y++) {
      const line = frame[y];
      for (let x = 0; x < columns; x++, index++) {
        const cell = line[x];
        const fg = cell.foreground ?? foreground;
        const bg = cell.background ?? background;
        const alpha = shades[cell.char] || 0;
        const char = alpha ? ' ' : cell.char;
        const offset = index * 4;
        for (let k = 0; k < 3; k++) {
          const value = alpha ? Math.round((bg[k] * (4 - alpha) + fg[k] * alpha) / 4) : bg[k];
          if (pixels[offset + k] !== value) changed = true;
          pixels[offset + k] = value;
        }
        if (!pixels[offset + 3]) { pixels[offset + 3] = 255; changed = true; }
        const color = char === ' ' ? 0 : pack(fg[0], fg[1], fg[2]);
        const bold = char !== ' ' && cell.bold ? 1 : 0;
        if (glyphs[index] === char && glyphColors[index] === color && glyphBold[index] === bold) continue;
        // A wide glyph can leave ink in its empty continuation cell when erased.
        const end = x + 1 < columns && glyphs[index + 1] === '' ? x + 2 : x + 1;
        inkContext.clearRect(xEdges[x], yEdges[y], xEdges[end] - xEdges[x], yEdges[y + 1] - yEdges[y]);
        glyphs[index] = char;
        glyphColors[index] = color;
        glyphBold[index] = bold;
        const value = char === ' ' ? ' ' : '\x1b[38;2;' + fg.join(';') + 'm' + (bold ? '\x1b[1m' : '') + char;
        updates.push({ row: y, column: x, value });
      }
    }
    if (!changed && !updates.length) return;
    if (changed) paperContext.putImageData(colors, 0, 0);
    if (updates.length) sink.flush(updates, {});
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.imageSmoothingEnabled = false;
    context.drawImage(paper, 0, 0, canvas.width, canvas.height);
    context.drawImage(ink, 0, 0, canvas.width, canvas.height);
    context.restore();
  }
  return { present, dispose() { ink.width = paper.width = 0; } };
}

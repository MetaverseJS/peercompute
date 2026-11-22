import mermaid from 'mermaid';
import {
  MermaidStandardRenderer,
  renderMermaidNativeFrame
} from '@exotui/mermaid';

let rendererInstance = null;

function rgbHex(rgb = [14, 21, 34]) {
  return `#${rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
}

export function getExotuiMermaidRenderer() {
  if (!rendererInstance) {
    rendererInstance = new MermaidStandardRenderer(mermaid, {
      document: globalThis.document,
      requiresDOM: true
    });
  }
  return rendererInstance;
}

export function buildMermaidThemeConfig(theme) {
  const bg = rgbHex(theme?.background ?? [8, 12, 20]);
  const surface = rgbHex(theme?.surface ?? [14, 21, 34]);
  const surfaceStrong = rgbHex(theme?.surfaceStrong ?? [24, 35, 54]);
  const border = rgbHex(theme?.border ?? [73, 101, 134]);
  const text = rgbHex(theme?.text ?? [224, 235, 246]);
  const muted = rgbHex(theme?.muted ?? [132, 154, 178]);
  const accent = rgbHex(theme?.accent ?? [76, 201, 240]);

  return {
    theme: 'base',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    er: {
      useMaxWidth: false,
      layoutDirection: 'TB',
      entityPadding: 14
    },
    themeVariables: {
      darkMode: true,
      background: bg,
      primaryColor: surfaceStrong,
      primaryTextColor: text,
      primaryBorderColor: accent,
      secondaryColor: surface,
      secondaryTextColor: text,
      secondaryBorderColor: border,
      tertiaryColor: surface,
      tertiaryTextColor: muted,
      lineColor: accent,
      textColor: text,
      mainBkg: surface,
      attributeBackgroundColorOdd: surface,
      attributeBackgroundColorEven: surfaceStrong,
      rowOdd: surface,
      rowEven: surfaceStrong,
      edgeLabelBackground: bg,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      fontSize: '13px'
    }
  };
}

/**
 * Compiles Mermaid ER source via ExoTUI's official MermaidStandardRenderer
 * (pinned to Mermaid 12.1.0) and optionally rasterizes the extracted scene
 * into an ExoTUI native terminal cell frame.
 */
export async function compileExotuiErDiagram({
  source,
  theme,
  containerWidth = 960,
  includeNativeCells = false
}) {
  const renderer = getExotuiMermaidRenderer();
  const config = buildMermaidThemeConfig(theme);
  const diagram = await renderer.compile(source, {
    config,
    containerWidth: Math.max(320, Math.min(2400, Math.round(containerWidth))),
    scene: includeNativeCells,
    trusted: false
  });

  let nativeFrame = null;
  let nativeAscii = '';
  let nativeDiagnostics = [];
  if (includeNativeCells && diagram.scene) {
    try {
      nativeFrame = renderMermaidNativeFrame(diagram.scene, {
        columnUnits: 8,
        rowUnits: 16,
        maxCells: 180_000,
        background: rgbHex(theme?.background ?? [8, 12, 20])
      });
      nativeAscii = nativeFrameToText(nativeFrame);
      nativeDiagnostics = [...(nativeFrame.diagnostics || [])];
    } catch (err) {
      nativeDiagnostics = [`Native cell rasterization skipped: ${err?.message || err}`];
    }
  }

  return {
    diagram,
    nativeFrame,
    nativeAscii,
    diagnostics: [...(diagram.diagnostics || []), ...nativeDiagnostics]
  };
}

export function nativeFrameToText(frame) {
  if (!frame || !Array.isArray(frame.cells)) return '';
  const lines = frame.cells.map((row) => row.map((cell) => cell?.char ?? ' ').join('').replace(/\s+$/, ''));
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  return lines.join('\n');
}

export function nativeFrameToHtml(frame) {
  if (!frame || !Array.isArray(frame.cells)) return '';
  const rows = frame.cells;
  let firstRow = 0;
  let lastRow = rows.length - 1;
  while (firstRow <= lastRow && rows[firstRow].every((c) => !c?.char || c.char === ' ')) firstRow += 1;
  while (lastRow >= firstRow && rows[lastRow].every((c) => !c?.char || c.char === ' ')) lastRow -= 1;
  if (firstRow > lastRow) return '';

  const htmlLines = [];
  for (let r = firstRow; r <= lastRow; r += 1) {
    const row = rows[r];
    let lastCol = row.length - 1;
    while (lastCol >= 0 && (!row[lastCol]?.char || row[lastCol].char === ' ')) lastCol -= 1;
    let line = '';
    for (let c = 0; c <= lastCol; c += 1) {
      const cell = row[c];
      const ch = escapeHtml(cell?.char ?? ' ');
      if (cell?.foreground || cell?.bold) {
        const style = [
          cell.foreground ? `color:${cell.foreground}` : '',
          cell.bold ? 'font-weight:700' : ''
        ].filter(Boolean).join(';');
        line += `<span style="${style}">${ch}</span>`;
      } else {
        line += ch;
      }
    }
    htmlLines.push(line);
  }
  return htmlLines.join('\n');
}

function escapeHtml(ch) {
  if (ch === '&') return '&amp;';
  if (ch === '<') return '&lt;';
  if (ch === '>') return '&gt;';
  return ch;
}

export function disposeExotuiMermaidRenderer() {
  rendererInstance?.dispose?.();
  rendererInstance = null;
}

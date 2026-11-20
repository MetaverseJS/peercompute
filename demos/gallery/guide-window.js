import MarkdownIt from 'markdown-it';
import { FlexMarkdownSurface } from 'exowebtui-flex-document';
import { TITLE_HEADING_FONTS } from 'exowebtui-document-fonts';
import { ansiLineToCells } from 'exowebtui-ansi';

const parser = new MarkdownIt();
const headingId = text => text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '-');
const docInset = 2;
const cellWidth = 9, cellHeight = 18;

// Use the parser's source ranges so image syntax inside examples stays literal.
// Each media block occupies ordinary measured Markdown rows. Keeping a single
// document preserves references, list numbering, heading anchors and link focus.
function prepareDocument(data, base) {
  const lines = data.markdown.split(/\r?\n/);
  const output = [], media = new Map();
  const diagrams = new Map(data.diagrams.map(chart => [chart.source.trim(), chart]));
  const images = new Map(data.images.map(image => [image.href, image]));
  let nextLine = 0;
  for (const token of parser.parse(data.markdown, {})) {
    if (!token.map || token.map[0] < nextLine) continue;
    const image = token.type === 'inline' && token.children?.length === 1 && token.children[0].type === 'image'
      ? token.children[0] : null;
    let asset;
    if (token.type === 'fence' && token.info.trim() === 'mermaid') asset = diagrams.get(token.content.trim());
    if (image) {
      const src = image.attrGet('src');
      const href = data.links[src] || src;
      const known = images.get(href) || images.get(src);
      if (known) asset = { ...known, href: new URL(href, base).href, alt: image.content || known.alt };
    }
    if (!asset) continue;
    const key = 'guide-media-' + media.size;
    media.set(key, asset);
    output.push(...lines.slice(nextLine, token.map[0]), '', '```mermaid', key, '```', '');
    nextLine = token.map[1];
  }
  return { source: output.concat(lines.slice(nextLine)).join('\n'), media };
}

function mediaSize(asset, columns, rows) {
  const fit = Math.min(columns * cellWidth / asset.width, Math.max(1, rows - 2) * cellHeight / asset.height);
  const scale = asset.svg ? fit : Math.min(1, fit);
  return { width: asset.width * scale / cellWidth, height: asset.height * scale / cellHeight };
}

function mediaFrame(key, asset, width, height) {
  const rows = Math.max(1, Math.ceil(mediaSize(asset, width, height).height));
  const label = (asset.svg ? '[Enlarge diagram]' : asset.alt || 'View image').slice(0, width);
  const columns = Math.max(1, label.length);
  const blank = Array(columns).fill({ char: ' ' });
  const action = { href: key };
  const caption = Array.from(label, char => ({ char, href: key, interaction: action }));
  return { columns, cells: [...Array(rows).fill(blank), caption] };
}

export function createGuideWindow({ id, title, href, load, openAtlas, openDemo, follow, openDiagram }) {
  const base = new URL(href, document.baseURI);
  let surface, model, data, media, request, error, disposed = false;
  let width = 1, height = 1, left = 1, targets = [], buttons = [], pendingAnchor;
  let cache;

  function activate(key) {
    const asset = media?.get(key);
    if (asset?.svg) openDiagram({ svg: asset.svg, title: title.replace(/ guide$/i, '') + ' architecture diagram' });
    else if (asset) follow(asset.href);
    else {
      const url = new URL(data.links[key] || key, base);
      if (url.origin === base.origin && url.pathname === base.pathname && url.hash) goToAnchor(url.hash);
      else follow(url.href);
    }
  }

  function start() {
    if (request || disposed) return;
    error = undefined;
    request = Promise.resolve().then(load).then(result => {
      if (disposed) return;
      const doc = prepareDocument(result, base);
      data = result;
      media = doc.media;
      surface = new FlexMarkdownSurface({
        sections: [{ id: 'document', label: title, rows: [{ panels: [{ id: 'body', source: doc.source }] }] }],
        showFirstSectionHeader: false,
        render: {
          headingFonts: TITLE_HEADING_FONTS, headingArt: 'title', wrapHeadingArt: false, tableCells: 'wrap',
          showLinkDestinations: false, mermaid: false,
          diagram: (source, columns) => {
            const key = source.trim();
            const asset = media.get(key);
            if (asset) return mediaFrame(key, asset, columns, height);
          },
        },
        onLink: activate,
      });
      model = surface.controller.panelController('body');
      cache = undefined;
    }).catch(issue => {
      error = issue.message || String(issue);
      cache = undefined;
    });
  }

  function goToAnchor(hash) {
    pendingAnchor = String(hash || '').replace(/^#/, '');
    if (!pendingAnchor) surface?.controller.scrollTo(0, width, height);
    try { pendingAnchor = decodeURIComponent(pendingAnchor); } catch { /* Treat a literal % as text. */ }
    cache = undefined;
  }

  function measure() {
    const rect = surface.controller.layout(width).panels[0].contentRect;
    const rows = model.render(rect.width);
    const blocks = model.document.peek().blocks;
    const placed = [];
    const headingCounts = new Map();
    let last = -1;
    for (const [i, line] of rows.entries()) {
      if (line.blockIndex === last) continue;
      last = line.blockIndex;
      const block = blocks[last];
      if (!block) continue;
      if (pendingAnchor && block.kind === 'heading') {
        const slug = headingId(block.inlines.map(span => span.text).join(''));
        const count = headingCounts.get(slug) || 0;
        headingCounts.set(slug, count + 1);
        if ((count ? slug + '-' + count : slug) === pendingAnchor) {
          surface.controller.scrollTo(rect.row + i, width, height);
          pendingAnchor = undefined;
        }
      }
      if (block.kind !== 'code' || block.language !== 'mermaid') continue;
      const key = block.code.trim(), asset = media.get(key);
      if (!asset) continue;
      const size = mediaSize(asset, rect.width, height);
      placed.push({ key, asset, size, column: left + rect.column + (rect.width - size.width) / 2,
        row: rect.row + i + (Math.ceil(size.height) - size.height) / 2 });
    }
    pendingAnchor = undefined;
    const offset = surface.controller.inspect(width, height).offset;
    const clip = { column: left, row: docInset, width, height };
    targets = placed.map(({ key, asset, size, column, row }) => ({
      key, svg: asset.svg, href: asset.href, clip,
      rect: { ...size, column, row: docInset + row - offset },
    })).filter(({rect}) => rect.row < docInset + height && rect.row + rect.height > docInset);
  }

  function toolbar(columns, palette) {
    const items = [
      ['[← Back]', openAtlas], [columns >= 28 ? '[Open demo]' : '[Demo]', openDemo],
      ['[HTML]', () => globalThis.open(base.href, '_blank', 'noopener')],
    ];
    const row = ansiLineToCells('', columns, palette.surface);
    buttons = [];
    let x = 0;
    for (const [label, action] of items) {
      if (x + label.length > columns) break;
      buttons.push({ x, end: x + label.length, action });
      for (const char of label) row[x++] = { char, foreground: palette.accent, background: palette.surface };
      x++;
    }
    return row;
  }

  return {
    id, title, summary: title, menu: false,
    window: { width: 116, height: 46, minWidth: 25, minHeight: 10, widthRatio: .74, heightRatio: .86, fullscreenBelow: 960 },
    render(columns, rows, _now, theme) {
      if (!request) start();
      left = columns >= 60 ? 2 : 1;
      width = Math.max(1, columns - left * 2);
      const nextHeight = Math.max(1, rows - docInset);
      if (nextHeight !== height) {
        height = nextHeight;
        model?.invalidate();
      }
      const rev = surface?.controller.revision.peek(), offset = surface?.controller.offset.peek();
      const focus = surface?.interactions.revision.peek();
      if (cache && cache.columns === columns && cache.rows === rows && cache.theme === theme &&
          cache.rev === rev && cache.offset === offset && cache.focus === focus) return cache.frame;

      const frame = Array.from({ length: rows }, () => ansiLineToCells('', columns, theme.surface));
      frame[0] = toolbar(columns, theme);
      if (surface) {
        if (surface.palette.peek() !== theme) surface.palette.value = theme;
        measure();
        surface.render(width, height).forEach((line, i) => {
          if (i + docInset < rows) frame[i + docInset].splice(left, width, ...ansiLineToCells(line, width, theme.surface));
        });
      } else if (rows > 2) {
        const message = error ? 'Guide unavailable. [Retry]' : 'Loading guide…';
        frame[docInset] = ansiLineToCells(message, columns, theme.surface);
      }
      cache = { columns, rows, theme, rev, offset, focus, frame };
      return frame;
    },
    onPointerUp(column, row) {
      if (row === 0) return buttons.find(button => column >= button.x && column < button.end)?.action();
      if (error && row === docInset) { request = undefined; start(); cache = undefined; return; }
      if (!surface || row < docInset || row >= docInset + height) return;
      const x = column + 0.5, y = row + 0.5;
      const hit = targets.find(({ rect }) => x >= rect.column && x < rect.column + rect.width &&
        y >= rect.row && y < rect.row + rect.height);
      if (hit) activate(hit.key);
      else surface.press(column - left, row - docInset);
    },
    onKey(event) {
      if (event.ctrl || event.meta) return false;
      if (event.key === 'escape') { openAtlas(); return true; }
      if (event.key === 'd' && media) {
        const chartKey = targets.find(t => t.svg)?.key || [...media].find(([, asset]) => asset.svg)?.[0];
        if (chartKey) { activate(chartKey); return true; }
      }
      if (error && event.key === 'return') { request = undefined; start(); cache = undefined; return true; }
      return surface?.key(event) || false;
    },
    onWheel(direction) { surface?.scroll(direction); return true; },
    scrollTo(offset) { surface?.controller.scrollTo(offset, width, height); },
    vscroll() {
      const info = surface?.controller.inspect(width, height);
      return { offset: info?.offset || 0, total: (info?.lines || 0) + docInset };
    },
    goToAnchor,
    mediaTargets: () => targets,
    dispose() { disposed = true; surface?.dispose(); targets = []; cache = undefined; },
  };
}

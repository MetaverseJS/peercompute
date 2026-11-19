import { glyphTextFont, renderGlyphText } from 'exowebtui-glyphs';

// A client of ExoWebTUI's cell compositor. The shell owns its scroll thumb,
// input coordinates, color palette, shader pass and window chrome.
const heading = title => renderGlyphText(glyphTextFont('small'), title, 'font')
  .map(line => line.trimEnd()).filter(line => line.length);
const titleArt = heading('PeerCompute');
const compactTitleArt = [...heading('Peer'), ...heading('Compute')];
const peerDiagram = [
  '╭──────────╮           ╭──────────╮',
  '│  PEER A  ├── libp2p ─┤  PEER B  │',
  '╰────┬─────╯           ╰─────┬────╯',
  '   WebGPU                  WebGPU',
];
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const trim = (text, width) => text.length <= width ? text : text.slice(0, Math.max(0, width - 1)) + '…';

function wrap(text, width) {
  const lines = [];
  for (const word of text.split(/\s+/)) {
    const last = lines.length - 1;
    if (last >= 0 && lines[last].length + 1 + word.length <= width) lines[last] += ' ' + word;
    else lines.push(trim(word, width));
  }
  return lines;
}

// Downsample the real gallery preview to half-block glyphs. The palette and
// every character around it still pass through the native theme and shaders.
function previewCells(image, width, height, background) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight) return [];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height * 2;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return [];
  context.fillStyle = 'rgb(' + background.join(',') + ')';
  context.fillRect(0, 0, width, canvas.height);
  const scale = Math.min(width / sourceWidth, canvas.height / sourceHeight);
  const w = sourceWidth * scale, h = sourceHeight * scale;
  context.drawImage(image, (width - w) / 2, (canvas.height - h) / 2, w, h);
  const pixels = context.getImageData(0, 0, width, canvas.height).data;
  const colorAt = i => [pixels[i], pixels[i + 1], pixels[i + 2]];
  return Array.from({ length: height }, (_, row) => Array.from({ length: width }, (_, col) => {
    const i = (row * 2 * width + col) * 4;
    return { char: '▀', foreground: colorAt(i), background: colorAt(i + width * 4) };
  }));
}

export function createCatalogWindow({ entries, openDemo, openSearch, openSettings, openHtml }) {
  const categories = ['All', ...new Set(entries.map(entry => entry.category))];
  const images = new Map();
  let category = categories[0], search = '', filtered = entries;
  let selected = 0, offset = 0, visibleRows = 1, rowHeight = 1;
  let revision = 0, rendered = {}, hits = [];
  let preview = {};

  function changeFilter() {
    const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    filtered = entries.filter(entry => {
      const text = [entry.title, entry.category, entry.description, entry.id].join(' ').toLowerCase();
      return (category === categories[0] || entry.category === category) && words.every(word => text.includes(word));
    });
    selected = 0;
    offset = 0;
    revision++;
  }
  function selectCategory(name) {
    category = name;
    changeFilter();
  }
  function select(index) {
    selected = clamp(index, 0, Math.max(0, filtered.length - 1));
    const start = selected * rowHeight;
    if (start < offset) offset = start;
    else if (start + rowHeight > offset + visibleRows) offset = start + rowHeight - visibleRows;
    revision++;
  }
  function scroll(row) {
    const next = clamp(row, 0, Math.max(0, filtered.length * rowHeight - visibleRows));
    if (next !== offset) { offset = next; revision++; }
  }
  function getImage(entry) {
    const src = entry.image;
    if (!src) return null;
    if (typeof src !== 'string' && src.tagName === 'CANVAS') return src;
    // Gallery card images are lazy-loaded and their HTML view may be hidden.
    // Request a preview only when its demo is selected.
    const url = typeof src === 'string' ? src : src.currentSrc || src.src;
    if (!url) return null;
    if (!images.has(url)) {
      const image = new Image();
      images.set(url, image);
      image.onload = () => { revision++; };
      image.src = url;
    }
    const image = images.get(url);
    return image.complete && image.naturalWidth ? image : null;
  }
  function paint(width, height, theme) {
    const blank = { char: ' ', background: theme.surface };
    const frame = Array.from({ length: height }, () => Array(width).fill(blank));
    hits = [];
    function write(x, y, text, color = theme.text, bg = theme.surface) {
      if (y < 0 || y >= height) return;
      for (const char of text) {
        if (x >= width) break;
        if (x >= 0) frame[y][x] = { char, foreground: color, background: bg };
        x++;
      }
    }
    function link(x, y, text, action, color = theme.accent, bg = theme.surface) {
      write(x, y, text, color, bg);
      hits.push({ x, y, width: text.length, action });
    }
    const pad = width >= 84 ? 3 : 1;
    const end = width - pad - 1;
    const usable = Math.max(1, end - pad);
    let y = 0;
    const art = titleArt.every(line => line.length <= usable) ? titleArt : compactTitleArt;
    const banner = height >= 16 + art.length && art.every(line => line.length <= usable);
    if (height >= 15) {
      write(pad, y++, 'DEMO DIRECTORY', theme.muted);
      if (banner) {
        const top = y;
        for (const line of art) write(pad, y++, line, theme.accent);
        if (usable >= 96) {
          const x = end - peerDiagram[0].length;
          peerDiagram.forEach((line, i) => write(x, top + i, line, i === 1 ? theme.text : theme.muted));
        }
      } else write(pad, y++, 'PeerCompute', theme.accent);
      if (height >= 22) {
        const intro = 'Explore shared worlds, browser AI and distributed simulations.';
        wrap(intro, usable).forEach(line => write(pad, y++, line));
        y++;
      }
    }
    link(pad, y, trim(search ? '[ / ] Find: ' + search : '[ / ] Find a demo', usable),
      () => openSearch(), theme.accent);
    y++;
    if (height >= 13) {
      let x = pad;
      for (const name of categories) {
        const text = name === category ? '[' + name + ']' : ' ' + name + ' ';
        if (x > pad && x + text.length > end) { y++; x = pad; }
        link(x, y, text, () => selectCategory(name),
          name === category ? theme.background : theme.muted,
          name === category ? theme.accent : theme.surface);
        x += text.length + 1;
      }
      y++;
    } else {
      link(pad, y++, trim('Filter: ' + category + '  ›', usable), () => cycle(1));
    }
    write(pad, y++, '─'.repeat(usable), theme.border);
    const columns = usable >= 80 && height >= 19;
    const divider = columns ? pad + Math.floor(usable * .53) : end;
    const columnWidth = Math.max(1, divider - pad - 2);
    write(pad, y, filtered.length + (filtered.length === 1 ? ' DEMO' : ' DEMOS'), theme.muted);
    if (columns) write(divider + 3, y, 'PREVIEW', theme.muted);
    const top = ++y;
    const footer = height - 1;
    visibleRows = Math.max(1, footer - 1 - top);
    rowHeight = height < 18 ? 1 : columns ? 2 : 3;
    offset = clamp(offset, 0, Math.max(0, filtered.length * rowHeight - visibleRows));
    if (!filtered.length) {
      write(pad, y, trim('No matching demos.', usable));
      link(pad, y + 1, '[ Clear filters ]', () => { search = ''; selectCategory(categories[0]); });
    }
    for (let row = 0; row < visibleRows; row++) {
      const index = Math.floor((row + offset) / rowHeight);
      const entry = filtered[index];
      if (!entry) break;
      const part = (row + offset) % rowHeight;
      const active = selected === index;
      const bg = active ? theme.surfaceStrong : theme.surface;
      const mark = active ? '› ' : '  ';
      let label = mark + entry.title;
      if (part > 0) {
        const lines = columns ? [entry.category] : wrap(entry.description, Math.max(1, columnWidth - 2));
        label = '  ' + (lines[part - 1] || '');
        if (part === rowHeight - 1 && lines.length > part) label = label.trimEnd() + '…';
      }
      const titleWidth = part === 0 ? columnWidth - 2 : columnWidth;
      write(pad, top + row, trim(label, titleWidth).padEnd(columnWidth),
        part === 0 ? (active ? theme.accent : theme.text) : theme.muted, bg);
      if (part === 0) write(divider - 3, top + row, '↗', active ? theme.accent : theme.muted, bg);
      hits.push({ x: pad, y: top + row, width: columnWidth, action: () => { select(index); openDemo(entry.id); } });
    }
    if (columns && filtered.length) {
      for (let row = top; row < footer - 1; row++) write(divider, row, '│', theme.border);
      const x = divider + 3, available = end - x;
      const entry = filtered[selected];
      let info = top;
      const artHeight = Math.max(0, Math.min(Math.round(available / 3), visibleRows - 9, 15));
      if (artHeight >= 3) {
        const image = getImage(entry);
        if (image) {
          if (preview.image !== image || preview.width !== available || preview.height !== artHeight || preview.theme !== theme) {
            preview = { image, width: available, height: artHeight, theme,
              cells: previewCells(image, available, artHeight, theme.surface) };
          }
          preview.cells.forEach((line, r) => line.forEach((cell, c) => { frame[info + r][x + c] = cell; }));
          info += artHeight + 1;
        }
      }
      for (const line of wrap(entry.title, available)) write(x, info++, line, theme.accent);
      write(x, info++, trim(entry.category, available), theme.muted);
      info++;
      for (const line of wrap(entry.description, available)) {
        if (info >= footer - 3) break;
        write(x, info++, line);
      }
      link(x, Math.min(info + 1, footer - 2), '[ Open demo ↗ ]', () => openDemo(entry.id));
    }
    write(pad, footer - 1, '─'.repeat(usable), theme.border);
    link(pad, footer, '[ Settings ]', openSettings);
    if (usable >= 22) link(pad + 14, footer, '[ HTML view ]', openHtml);
    if (usable >= 75) write(end - 31, footer, '↑ ↓ select  ·  Enter to open', theme.muted);
    return frame;
  }
  function cycle(direction) {
    selectCategory(categories[(categories.indexOf(category) + direction + categories.length) % categories.length]);
  }
  return {
    id: 'demo-atlas', title: 'PeerCompute', summary: 'Browse and launch PeerCompute demos.',
    window: { width: 148, height: 51, minWidth: 25, minHeight: 12,
      widthRatio: .84, heightRatio: .88, fullscreenBelow: 1280 },
    getSearch: () => search,
    setSearch(value) { search = value; changeFilter(); },
    render(width, height, _now, theme) {
      if (rendered.width !== width || rendered.height !== height || rendered.theme !== theme || rendered.revision !== revision) {
        rendered = { width, height, theme, revision, frame: paint(width, height, theme) };
      }
      return rendered.frame;
    },
    onKey(event) {
      if (event.ctrl || event.meta) return false;
      switch (event.key) {
        case '/': openSearch(); break;
        case 'left': cycle(-1); break;
        case 'right': cycle(1); break;
        case 'up': select(selected - 1); break;
        case 'down': select(selected + 1); break;
        case 'home': select(0); break;
        case 'end': select(filtered.length - 1); break;
        case 'pageup': select(selected - Math.max(1, Math.floor(visibleRows / rowHeight))); break;
        case 'pagedown': select(selected + Math.max(1, Math.floor(visibleRows / rowHeight))); break;
        case 'return': if (filtered[selected]) openDemo(filtered[selected].id); break;
        default: return false;
      }
      return true;
    },
    onPointerUp(column, row) {
      const hit = hits.find(item => item.y === row && column >= item.x && column < item.x + item.width);
      hit?.action();
    },
    onWheel(direction) { scroll(offset + direction * rowHeight); return true; },
    scrollTo: scroll,
    vscroll(_width, height) {
      return { offset, total: height + Math.max(0, filtered.length * rowHeight - visibleRows) };
    },
  };
}

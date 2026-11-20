import { glyphTextFont, renderGlyphText } from 'exowebtui-glyphs';

// A client of ExoWebTUI's cell compositor. The shell owns its scroll thumb,
// input coordinates, color palette, shader pass and window chrome.
const heading = title => renderGlyphText(glyphTextFont('small'), title, 'font')
  .map(line => line.trimEnd()).filter(line => line.length);
const titleArt = heading('PeerCompute');
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
  let line = '';
  for (let word of text.trim().split(/\s+/)) {
    if (line && line.length + 1 + word.length > width) {
      lines.push(line);
      line = '';
    }
    while (word.length > width) {
      lines.push(word.slice(0, width));
      word = word.slice(width);
    }
    line = line ? line + ' ' + word : word;
  }
  if (line) lines.push(line);
  return lines;
}

export function createCatalogWindow({ entries, openDemo, openSearch, openSettings, openHtml }) {
  const categories = ['All', ...new Set(entries.map(entry => entry.category))];
  const images = new Map();
  let category = categories[0], search = '', filtered = entries;
  let selected = 0, offset = 0, visibleRows = 1, rowHeight = 1;
  let revision = 0, rendered = {}, hits = [];
  let media = [];
  let previewOffset = 0, previewLimit = 0, previewBounds;
  let scrollingPreview = false;

  function changeFilter() {
    const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    filtered = entries.filter(entry => {
      const text = [entry.title, entry.category, entry.description, entry.summary, entry.id].join(' ').toLowerCase();
      return (category === categories[0] || entry.category === category) && words.every(word => text.includes(word));
    });
    selected = 0;
    offset = 0;
    previewOffset = 0;
    scrollingPreview = false;
    revision++;
  }
  function selectCategory(name) {
    category = name;
    changeFilter();
  }
  function select(index) {
    const next = clamp(index, 0, Math.max(0, filtered.length - 1));
    if (selected !== next) previewOffset = 0;
    selected = next;
    scrollingPreview = false;
    const start = selected * rowHeight;
    if (start < offset) offset = start;
    else if (start + rowHeight > offset + visibleRows) offset = start + rowHeight - visibleRows;
    revision++;
  }
  function scroll(row) {
    const next = clamp(row, 0, Math.max(0, filtered.length * rowHeight - visibleRows));
    if (next !== offset) { offset = next; revision++; }
  }
  function scrollPreview(row) {
    const next = clamp(row, 0, previewLimit);
    if (next !== previewOffset) { previewOffset = next; revision++; }
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
    media = [];
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
    const columns = usable >= 80;
    if (columns && height >= 15) {
      write(pad, y++, 'DEMO DIRECTORY', theme.muted);
      if (height >= 16 + titleArt.length && titleArt.every(line => line.length <= usable)) {
        const top = y;
        for (const line of titleArt) write(pad, y++, line, theme.accent);
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
    } else if (!columns && height >= 15) write(pad, y++, 'PeerCompute', theme.accent);
    link(pad, y, trim(search ? '[ / ] Find: ' + search : '[ / ] Find a demo', usable),
      () => openSearch(), theme.accent);
    y++;
    if (height >= (columns ? 13 : 23) && usable >= 32) {
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
    if (height >= 15) write(pad, y++, '─'.repeat(usable), theme.border);
    const divider = columns ? pad + Math.floor(usable * .48) : end;
    const listWidth = columns ? divider - pad - 1 : usable;
    const footer = height - 1;
    const footerRule = height >= 15;
    const lastBodyRow = footer - (footerRule ? 2 : 1);
    const listHeading = y;
    const listTop = listHeading + 1;
    const bodyRows = Math.max(1, lastBodyRow - listTop);
    const oldRows = visibleRows, oldRowHeight = rowHeight;
    const selectionWasVisible = selected * rowHeight >= offset && selected * rowHeight < offset + visibleRows;
    visibleRows = columns || !filtered.length
      ? bodyRows + 1
      : Math.max(1, Math.floor((bodyRows - 1) * .43));
    rowHeight = columns && visibleRows >= 10 ? 2 : 1;
    if (selectionWasVisible && (oldRows !== visibleRows || oldRowHeight !== rowHeight)) {
      const start = selected * rowHeight;
      offset = clamp(offset, start + rowHeight - visibleRows, start);
    }
    offset = clamp(offset, 0, Math.max(0, filtered.length * rowHeight - visibleRows));

    write(pad, listHeading, filtered.length + (filtered.length === 1 ? ' DEMO' : ' DEMOS'), theme.muted);
    if (filtered.length * rowHeight > visibleRows && listWidth >= 19) {
      const pageRows = Math.max(rowHeight, Math.floor(visibleRows / rowHeight) * rowHeight);
      link(pad + listWidth - 7, listHeading, '[↑]', () => { scrollingPreview = false; scroll(offset - pageRows); });
      link(pad + listWidth - 3, listHeading, '[↓]', () => { scrollingPreview = false; scroll(offset + pageRows); });
    }
    if (!filtered.length) {
      write(pad, listTop, trim('No matching demos.', usable));
      link(pad, listTop + 1, '[ Clear filters ]', () => { search = ''; selectCategory(categories[0]); });
    }
    for (let row = 0; row < visibleRows; row++) {
      const index = Math.floor((row + offset) / rowHeight);
      const entry = filtered[index];
      if (!entry) break;
      const part = (row + offset) % rowHeight;
      const active = selected === index;
      const bg = active ? theme.surfaceStrong : theme.surface;
      const label = part ? '  ' + entry.category : (active ? '› ' : '  ') + entry.title;
      write(pad, listTop + row, trim(label, listWidth).padEnd(listWidth),
        part ? theme.muted : active ? theme.accent : theme.text, bg);
      hits.push({ x: pad, y: listTop + row, width: listWidth, action: () => select(index) });
    }

    previewBounds = undefined;
    previewLimit = 0;
    if (filtered.length) {
      const x = columns ? divider + 2 : pad;
      const available = Math.max(1, end - x);
      const headingRow = columns ? listHeading : listTop + visibleRows;
      if (columns) {
        for (let row = headingRow; row <= lastBodyRow; row++) write(divider, row, '│', theme.border);
      } else if (height >= 15) write(x, headingRow, '─'.repeat(available), theme.border);
      write(x, headingRow, 'PREVIEW', theme.muted);
      previewBounds = { x, top: headingRow, bottom: lastBodyRow };

      const entry = filtered[selected];
      const headerSpace = lastBodyRow - headingRow - 1;
      const title = wrap(entry.title, available).slice(0, Math.max(0, headerSpace));
      title.forEach((line, i) => write(x, headingRow + 1 + i, line, theme.accent));
      let actionRow = headingRow + 1 + title.length;
      if (headerSpace - title.length >= 6) write(x, actionRow++, trim(entry.category, available), theme.muted);
      link(x, actionRow, '[ Open demo ↗ ]', () => openDemo(entry.id));
      const guideText = available >= 31 ? '[ Read guide ]' : '[Guide]';
      if (available >= 16 + guideText.length) {
        link(x + 16, actionRow, guideText, () => openDemo('guide-' + entry.id));
      } else if (actionRow < lastBodyRow) {
        link(x, ++actionRow, guideText, () => openDemo('guide-' + entry.id));
      }
      const previewTop = actionRow + 1;
      const viewport = Math.max(0, lastBodyRow - previewTop + 1);
      const summary = (entry.summary || entry.description).split(/\n\s*\n/)
        .flatMap((paragraph, i) => [...(i ? [''] : []), ...wrap(paragraph, available)]);
      const spaceForArt = viewport - summary.length - 1;
      const artHeight = Math.min(columns ? 15 : 8, Math.round(available / 3),
        Math.max(viewport >= 10 ? 4 : 0, spaceForArt));
      const image = artHeight >= 3 ? getImage(entry) : null;
      const gap = viewport >= 7 ? 1 : 0;
      const summaryStart = (image ? artHeight : 0) + gap;
      previewLimit = Math.max(0, summaryStart + summary.length - viewport);
      previewOffset = clamp(previewOffset, 0, previewLimit);
      const start = previewTop - previewOffset;
      const inView = row => row >= previewTop && row <= lastBodyRow;
      if (image) {
        media.push({ key: entry.id, image,
          rect: { column: x, row: start, width: available, height: artHeight },
          clip: { column: x, row: previewTop, width: available, height: viewport },
        });
      }
      summary.forEach((line, i) => {
        const row = start + summaryStart + i;
        if (inView(row)) write(x, row, line);
      });
      if (previewLimit && viewport) {
        const page = Math.max(1, viewport - 1);
        const narrow = available < 22;
        link(end - (narrow ? 3 : 7), headingRow, narrow ? '↑' : '[↑]', () => scrollPreview(previewOffset - page),
          previewOffset ? theme.accent : theme.muted);
        link(end - (narrow ? 1 : 3), headingRow, narrow ? '↓' : '[↓]', () => scrollPreview(previewOffset + page),
          previewOffset < previewLimit ? theme.accent : theme.muted);
      }
    }
    if (footerRule) write(pad, footer - 1, '─'.repeat(usable), theme.border);
    link(pad, footer, '[ Settings ]', openSettings);
    if (usable >= 46) link(pad + 14, footer, '[ HTML view ]', openHtml);
    else if (usable >= 21) link(pad + 13, footer, '[ HTML ]', openHtml);
    if (usable >= 75) {
      const hint = usable >= 93 ? '↑ ↓ select  ·  Enter open  ·  Shift+Enter guide' : '↑ ↓ select  ·  Enter to open';
      write(width - 12 - hint.length, footer, hint, theme.muted);
    }
    return frame;
  }
  function cycle(direction) {
    selectCategory(categories[(categories.indexOf(category) + direction + categories.length) % categories.length]);
  }
  return {
    id: 'demo-atlas', title: 'PeerCompute', summary: 'Browse and launch PeerCompute demos.',
    window: { width: 148, height: 51, minWidth: 25, minHeight: 12,
      widthRatio: .84, heightRatio: .88, fullscreenBelow: 1280 },
    mediaTargets: () => media,
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
        case 'up': event.shift ? scrollPreview(previewOffset - 1) : select(selected - 1); break;
        case 'down': event.shift ? scrollPreview(previewOffset + 1) : select(selected + 1); break;
        case 'home': select(0); break;
        case 'end': select(filtered.length - 1); break;
        case 'pageup': select(selected - Math.max(1, Math.floor(visibleRows / rowHeight))); break;
        case 'pagedown': select(selected + Math.max(1, Math.floor(visibleRows / rowHeight))); break;
        case 'return': {
          const entry = filtered[selected];
          if (entry) openDemo(event.shift ? 'guide-' + entry.id : entry.id);
          break;
        }
        default: return false;
      }
      return true;
    },
    onPointerUp(column, row) {
      const hit = hits.find(item => item.y === row && column >= item.x && column < item.x + item.width);
      hit?.action();
    },
    onWheel(direction, column, row) {
      const overPreview = previewBounds && column >= previewBounds.x && row >= previewBounds.top && row <= previewBounds.bottom;
      scrollingPreview = Boolean(overPreview);
      if (overPreview) scrollPreview(previewOffset + direction * 3);
      else scroll(offset + direction * rowHeight);
      return true;
    },
    scrollTo(row) { scrollingPreview ? scrollPreview(row) : scroll(row); },
    vscroll(_width, height) {
      return scrollingPreview
        ? { offset: previewOffset, total: height + previewLimit }
        : { offset, total: height + Math.max(0, filtered.length * rowHeight - visibleRows) };
    },
  };
}

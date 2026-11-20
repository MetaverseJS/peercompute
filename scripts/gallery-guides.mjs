import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import { imageSize } from 'image-size';
import { renderMermaidSVG } from 'beautiful-mermaid';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = path.join(root, 'docs');
const catalog = JSON.parse(await readFile(path.join(root, 'demos/gallery/catalog.json'), 'utf8'));
const guides = catalog.map(entry => {
  const slug = [entry.dir, entry.guide].filter(Boolean).join('-');
  const readme = path.join('demos', entry.dir, entry.guide || '', 'README.md');
  return { ...entry, slug, readme, href: './' + entry.dir + (entry.path || '/') };
});
const byReadme = new Map(guides.map(entry => [entry.readme, entry]));
const outputs = new Map();
const repoUrl = 'https://github.com/MetaverseJS/peercompute';
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const urlPath = value => value.split('/').map(encodeURIComponent).join('/');

function inlineText(tokens) {
  return tokens.map(token => token.tokens ? inlineText(token.tokens) : token.text || '').join('');
}

function overview(tokens) {
  const sections = tokens.filter(t => t.type === 'heading' && t.depth === 2 && t.text === 'Overview');
  if (sections.length !== 1) throw new Error('Expected one ## Overview');
  const paragraphs = [];
  for (const token of tokens.slice(tokens.indexOf(sections[0]) + 1)) {
    if (token.type === 'heading') break;
    if (token.type === 'paragraph') paragraphs.push(inlineText(token.tokens).replace(/\s+/g, ' ').trim());
  }
  if (!paragraphs.length) throw new Error('The Overview needs a paragraph for the launcher');
  return paragraphs.join('\n\n');
}

// Markdown links are relative to their README. Keep guides and their images
// on the same origin; source-file links take the reader to the repository.
async function rebaseLink(token, entry) {
  const href = token.href;
  if (/^(?:https?:|mailto:|#)/i.test(href)) return;
  const origin = new URL(entry.readme, 'https://repository.invalid/');
  const url = new URL(href, origin);
  if (url.origin !== origin.origin) throw new Error('Unsupported link: ' + href);
  const relative = decodeURIComponent(url.pathname.slice(1)).replace(/\/$/, '');
  const fullPath = path.join(root, relative);
  if (path.relative(root, fullPath).startsWith('..' + path.sep)) throw new Error('Link outside repository: ' + href);
  const info = await stat(fullPath);
  const linked = byReadme.get(info.isDirectory() ? path.join(relative, 'README.md') : relative);
  if (linked && token.type === 'link') {
    token.href = './' + linked.slug + '.html' + url.search + url.hash;
  } else if (token.type === 'image') {
    const dest = path.join(pages, 'guides/media', relative);
    outputs.set(dest, await readFile(fullPath));
    token.href = './media/' + urlPath(relative);
  } else {
    token.href = repoUrl + (info.isDirectory() ? '/tree/main/' : '/blob/main/') + urlPath(relative) + url.hash;
  }
}

async function renderGuide(entry) {
  const markdown = new Marked();
  const diagrams = [];
  const images = [];
  const links = {};
  const ids = new Map();
  markdown.use({ renderer: {
    html: token => escape(token.text),
    heading({ depth, tokens }) {
      const slug = inlineText(tokens).toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '-');
      const count = ids.get(slug) || 0;
      ids.set(slug, count + 1);
      const id = count ? slug + '-' + count : slug;
      return '<h' + depth + ' id="' + escape(id) + '">' + this.parser.parseInline(tokens) + '</h' + depth + '>\n';
    },
    code(token) {
      if (token.lang !== 'mermaid') return false;
      const svg = renderMermaidSVG(token.text, {
        bg: '#101918', fg: '#e0eee4', line: '#82b59b', accent: '#c3ed8e', font: 'Inter', padding: 20,
      }).replace(/^\s*@import [^;]+;[^\n]*$/gm, '').replace(/[ \t]+$/gm, '');
      const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1].split(/\s+/).map(Number);
      if (!viewBox || !(viewBox[2] > 0 && viewBox[3] > 0)) throw new Error('Missing diagram dimensions');
      diagrams.push({ source: token.text, svg, width: viewBox[2], height: viewBox[3] });
      return '<figure><div class="diagram" tabindex="0" role="img" aria-label="' + escape(entry.title) +
        ' architecture diagram">' + svg + '</div><details><summary>Mermaid source</summary><pre>' +
        escape(token.text) + '</pre></details></figure>\n';
    },
  } });
  const source = await readFile(path.join(root, entry.readme), 'utf8');
  const tokens = markdown.lexer(source);
  const summary = overview(tokens);
  const references = markdown.walkTokens(tokens, token =>
    token.type === 'link' || token.type === 'image' ? [{ token, original: token.href }] : []);
  for (const { token, original } of references) {
    await rebaseLink(token, entry);
    links[original] = token.href;
    if (token.type === 'image' && token.href.startsWith('./media/')) {
      const file = path.resolve(pages, 'guides', decodeURIComponent(token.href));
      const { width, height } = imageSize(outputs.get(file));
      images.push({ href: token.href, width, height, alt: token.text });
    }
  }
  const content = markdown.parser(tokens);
  if (!diagrams.length) throw new Error('Expected a Mermaid architecture diagram');
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(entry.title)} guide · PeerCompute</title><link rel="stylesheet" href="../assets/gallery-guide.css">
<script type="module" src="../assets/gallery-guide-theme.js"></script>
<script type="module" src="../assets/gallery-diagram.js"></script></head>
<body class="pc-guide"><nav aria-label="Demo navigation"><a href="../">← PeerCompute</a><a href=".${escape(entry.href)}" target="_blank" rel="noopener">Open demo in tab ↗</a></nav>
<main>${content}</main></body></html>\n`;
  outputs.set(path.join(pages, 'guides', entry.slug + '.html'), html);
  outputs.set(path.join(pages, 'guides', entry.slug + '.json'), JSON.stringify({ markdown: source, links, diagrams, images }) + '\n');
  return summary;
}

function card(entry, summary) {
  const guide = './guides/' + entry.slug + '.html';
  const picture = entry.image
    ? `<img src="./assets/${escape(entry.image)}" alt="" loading="lazy" decoding="async">`
    : '<canvas id="model-wave" width="600" height="210" aria-hidden="true"></canvas><span class="wave-label">IPFS → WebGPU</span>';
  return `          <article class="card"><a class="demo-link" href="${escape(entry.href)}" data-demo-dir="${escape(entry.dir)}" data-demo-port="${entry.port}" data-demo-path="${escape(entry.path || '/')}" data-category="${escape(entry.category)}" data-guide="${guide}">
            <div class="thumb ${escape(entry.dir)}">${picture}</div>
            <div class="card-body"><span class="category">${escape(entry.category)}</span><h2>${escape(entry.title)}</h2>
              <p>${escape(entry.description)}</p><p class="demo-summary" hidden>${escape(summary)}</p><span class="arrow" aria-hidden="true">↗</span></div>
          </a><a class="guide-link" href="${guide}" aria-label="Read the ${escape(entry.title)} guide">Read guide</a></article>`;
}

const cards = [];
for (const entry of guides) {
  try {
    cards.push(card(entry, await renderGuide(entry)));
  } catch (error) {
    throw new Error(entry.readme + ': ' + error.message, { cause: error });
  }
}
const indexPath = path.join(pages, 'index.html');
const html = await readFile(indexPath, 'utf8');
const slot = /(<!-- gallery cards -->)\n[\s\S]*?(\n *<!-- end gallery cards -->)/;
if (!slot.test(html)) throw new Error('Gallery card markers are missing');
outputs.set(indexPath, html.replace(slot, (_, start, end) => start + '\n' + cards.join('\n') + end));
const check = process.argv.includes('--check');
for (const [file, content] of outputs) {
  if (check) {
    if (!(await readFile(file)).equals(Buffer.from(content))) {
      throw new Error(path.relative(root, file) + ' is stale. Run npm run build:gallery.');
    }
  } else {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content);
  }
}
console.log((check ? 'Verified ' : 'Built ') + guides.length + ' demo guides and previews.');

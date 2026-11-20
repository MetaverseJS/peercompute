import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { test } from 'node:test';
import { promisify } from 'node:util';

const root = new URL('../../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('demos/gallery/catalog.json', root), 'utf8'));
const guideDir = new URL('docs/guides/', root);

test('published guides and launcher previews match the current demo READMEs', async () => {
  await promisify(execFile)(process.execPath, ['scripts/gallery-guides.mjs', '--check'], { cwd: root });
});

test('every catalog destination has a distinct illustrated HTML guide with working local links', async () => {
  const expected = catalog.map(({ dir, guide }) => [dir, guide].filter(Boolean).join('-') + '.html');
  assert.equal(new Set(expected).size, catalog.length);
  assert.deepEqual((await readdir(guideDir)).filter(name => name.endsWith('.html')).sort(), [...expected].sort());

  for (const [i, file] of expected.entries()) {
    const guide = new URL(file, guideDir);
    const html = await readFile(guide, 'utf8');
    const entry = catalog[i];
    const sourcePath = ['demos', entry.dir, entry.guide, 'README.md'].filter(Boolean).join('/');
    const source = await readFile(new URL(sourcePath, root), 'utf8');
    const native = JSON.parse(await readFile(new URL(file.replace(/\.html$/, '.json'), guideDir), 'utf8'));
    assert.equal(native.markdown.trim(), source.trim(), file + ' preserves the original README for ExoWebTUI');
    const chartSources = [...source.matchAll(/^```mermaid\s*\n([\s\S]*?)^```/gm)].map(([, text]) => text.trim());
    assert.deepEqual(native.diagrams.map(chart => chart.source.trim()), chartSources, file);
    for (const chart of native.diagrams) {
      assert.match(chart.svg, /<svg\b[^>]*viewBox=/i, file);
      assert.ok(chart.width > 0 && chart.height > 0, file);
    }
    assert.match(html, /<h1\b/, file);
    assert.match(html, /<h2 id="overview">/, file);
    assert.match(html, /<figure><div class="diagram"[^>]*><svg\b/, file);
    assert.match(html, /<summary>Mermaid source<\/summary>/, file);
    assert.doesNotMatch(html, /@import|<iframe\b/i, file);
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
    for (const [, attributes, body] of scripts) {
      assert.match(attributes, /type="module"/, file);
      assert.match(attributes, /src="\.\.\/assets\/[^"]+"/, file);
      assert.equal(body.trim(), '', file);
    }
    const launch = /<a href="([^"]+)"[^>]*>Open demo in tab/.exec(html);
    assert.ok(launch, file);
    const destination = new URL('../' + entry.dir + (entry.path || '/'), guide);
    assert.equal(new URL(launch[1], guide).href, destination.href, file);
    for (const [, link] of html.matchAll(/(?:href|src)="(\.[^"]+)"/g)) {
      const target = new URL(link, guide);
      assert.ok(await stat(target), file + ' links to ' + link);
    }
  }
});

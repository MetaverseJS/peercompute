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

test('every catalog destination has a distinct, script-free illustrated guide with working local links', async () => {
  const expected = catalog.map(({ dir, guide }) => [dir, guide].filter(Boolean).join('-') + '.html');
  assert.equal(new Set(expected).size, catalog.length);
  assert.deepEqual((await readdir(guideDir)).filter(name => name.endsWith('.html')).sort(), [...expected].sort());

  for (const [i, file] of expected.entries()) {
    const guide = new URL(file, guideDir);
    const html = await readFile(guide, 'utf8');
    assert.match(html, /<h1\b/, file);
    assert.match(html, /<h2 id="overview">/, file);
    assert.match(html, /<figure><div class="diagram"[^>]*><svg\b/, file);
    assert.match(html, /<summary>Mermaid source<\/summary>/, file);
    assert.doesNotMatch(html, /<script\b|@import|<iframe\b/i, file);
    const launch = /<a href="([^"]+)"[^>]*>Open demo in tab/.exec(html);
    assert.ok(launch, file);
    const entry = catalog[i];
    const destination = new URL('../' + entry.dir + (entry.path || '/'), guide);
    assert.equal(new URL(launch[1], guide).href, destination.href, file);
    for (const [, link] of html.matchAll(/(?:href|src)="(\.[^"]+)"/g)) {
      const target = new URL(link, guide);
      assert.ok(await stat(target), file + ' links to ' + link);
    }
  }
});

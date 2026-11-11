import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { build } from 'vite';
import { pagesSharedRuntimePlugin } from '../../scripts/pagesSharedRuntimePlugin.mjs';

const wasmName = 'ort-wasm-simd-threaded.asyncify.wasm';
const bytes = Buffer.from([0, 97, 115, 109, 1, 0, 0, 0]);
async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'peercompute-pages-runtime-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = path.join(root, 'source'), docsRoot = path.join(root, 'docs');
  await mkdir(source); await mkdir(docsRoot);
  await writeFile(path.join(source, 'index.html'), '<script type="module" src="/main.js"></script>');
  await writeFile(path.join(source, wasmName), bytes);
  await writeFile(path.join(source, 'keep.wasm'), Buffer.from([...bytes, 7]));
  await writeFile(path.join(source, 'worker.js'), `import binary from './${wasmName}?url'; postMessage(binary);`);
  await writeFile(path.join(source, 'main.js'), `import binary from './${wasmName}?url';
    import keep from './keep.wasm?url';
    globalThis.runtimeUrls = [binary, keep, new URL('./${wasmName}', import.meta.url).href];
    globalThis.worker = new Worker(new URL('./worker.js', import.meta.url), {type:'module'});`);
  async function compile(name, pluginOptions = {}) {
    const outDir = path.join(docsRoot, name);
    await build({ root: source, configFile: false, base: './', publicDir: false, logLevel: 'silent',
      plugins: [pagesSharedRuntimePlugin({ enabled: true, docsRoot, ...pluginOptions })],
      worker: { format: 'es' },
      build: { outDir, emptyOutDir: true, assetsInlineLimit: 0, minify: false } });
    const names = await readdir(path.join(outDir, 'assets'));
    const js = new Map(await Promise.all(names.filter(name => name.endsWith('.js'))
      .map(async name => [name, await readFile(path.join(outDir, 'assets', name), 'utf8')])));
    return { outDir, names, js };
  }
  return { root, source, docsRoot, compile, pool: path.join(docsRoot, 'assets', 'runtime') };
}

test('actual Vite main and worker URLs share exact WASM bytes before their chunk hashes are finalized', async t => {
  const f = await fixture(t), standalone = await f.compile('standalone', { enabled: false });
  assert(standalone.names.some(name => name.startsWith('ort-wasm') && name.endsWith('.wasm')));
  await assert.rejects(readdir(f.pool), { code: 'ENOENT' });
  const first = await f.compile('first'), second = await f.compile('second');
  const pooled = await readdir(f.pool);
  assert.equal(pooled.length, 1);
  assert.deepEqual(await readFile(path.join(f.pool, pooled[0])), bytes);
  for (const output of [first, second]) {
    assert(!output.names.some(name => name.startsWith('ort-wasm') && name.endsWith('.wasm')));
    assert(output.names.some(name => /^keep-.*\.wasm$/.test(name)), 'unselected binaries stay standalone');
    assert.equal(output.js.size, 2);
    for (const [name, code] of output.js) {
      assert(code.includes(`/peercompute/assets/runtime/${pooled[0]}`), `${name} refers to shared bytes`);
      assert(!standalone.js.has(name), 'URL change yields a new chunk hash, rather than editing an existing hash');
    }
  }
  assert.deepEqual(first.js, second.js, 'repeated builds preserve deterministic hashes and URLs');
});

test('changed binary content creates a new URL and retains the previous immutable pooled bytes', async t => {
  const f = await fixture(t); const before = await f.compile('before');
  const [oldName] = await readdir(f.pool);
  await writeFile(path.join(f.source, wasmName), Buffer.from([...bytes, 9]));
  const after = await f.compile('after');
  const files = await readdir(f.pool); assert.equal(files.length, 2);
  assert.deepEqual(await readFile(path.join(f.pool, oldName)), bytes);
  const newName = files.find(name => name !== oldName);
  assert.deepEqual(await readFile(path.join(f.pool, newName)), Buffer.from([...bytes, 9]));
  for (const [name, code] of after.js) {
    assert(code.includes(newName)); assert(!code.includes(oldName)); assert(!before.js.has(name));
  }
});

test('a binary imported only by a worker is collected into the shared pool', async t => {
  const f = await fixture(t);
  await writeFile(path.join(f.source, 'main.js'),
    "globalThis.worker = new Worker(new URL('./worker.js', import.meta.url), {type:'module'});");
  const output = await f.compile('worker-only');
  const [name, ...extra] = await readdir(f.pool);
  assert.equal(extra.length, 0);
  assert.deepEqual(await readFile(path.join(f.pool, name)), bytes);
  assert(!output.names.some(name => name.endsWith('.wasm')), 'worker emission is removed from the demo directory');
  const worker = [...output.js].find(([name]) => name.startsWith('worker-'));
  assert(worker, 'a real worker chunk was built');
  assert(worker[1].includes(`/peercompute/assets/runtime/${name}`));
});

test('a conflicting published asset aborts the build without overwriting it or leaving temporary files', async t => {
  const f = await fixture(t); await f.compile('before');
  const [name] = await readdir(f.pool), file = path.join(f.pool, name), conflicting = Buffer.from('unchanged existing bytes');
  await writeFile(file, conflicting);
  await assert.rejects(f.compile('after'), /Shared runtime asset collision/);
  assert.deepEqual(await readFile(file), conflicting);
  assert.deepEqual(await readdir(f.pool), [name]);
});

test('Pages activation is explicit and unsafe output destinations are rejected', async t => {
  assert.equal(pagesSharedRuntimePlugin({ enabled: false }), null);
  assert.throws(() => pagesSharedRuntimePlugin({ enabled: true, publicBase: 'https://outside.invalid/' }), /same-origin/);
  const f = await fixture(t), plugin = pagesSharedRuntimePlugin({ enabled: true, docsRoot: f.docsRoot });
  assert.throws(() => plugin.configResolved({ root: f.root, build: { outDir: '../outside' } }), /docs root/);
  assert.throws(() => plugin.configResolved({ root: f.root, build: { outDir: f.pool } }), /docs root/);
  const hook = plugin.config({ experimental: { renderBuiltUrl: filename => '/existing/' + filename } }).experimental.renderBuiltUrl;
  assert.equal(hook('assets/keep.wasm', { type: 'asset' }), '/existing/assets/keep.wasm');
  assert.equal(hook('assets/entry.js', { type: 'asset' }), '/existing/assets/entry.js');
  assert.throws(() => hook(`../${wasmName}`, { type: 'asset' }), /Invalid shared/);
});

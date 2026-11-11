import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { capturePagesRelease, finalizePagesRelease, PAGES_RELEASE_SCHEMA } from '../../scripts/pagesReleaseAssets.mjs';

const fingerprint = value => ({ sha256: createHash('sha256').update(value).digest('hex'), bytes: Buffer.byteLength(value) });
async function fixture(t) {
  const base = await mkdtemp(path.join(os.tmpdir(), 'pages-retention-test-'));
  t.after(() => rm(base, { recursive: true, force: true }));
  const repo = path.join(base, 'repo'), docs = path.join(repo, 'docs'), snapshot = path.join(base, 'snapshot');
  await mkdir(docs, { recursive: true });
  const put = async (file, value) => { await mkdir(path.dirname(path.join(docs, file)), { recursive: true }); await writeFile(path.join(docs, file), value); };
  const manifest = (active, retained = {}) => put('release-manifest.json', JSON.stringify({ schema: PAGES_RELEASE_SCHEMA,
    active: Object.fromEntries(Object.entries(active).map(([name, value]) => [name, fingerprint(value)])),
    retained: Object.fromEntries(Object.entries(retained).map(([name, value]) => [name, fingerprint(value)])) }));
  return { base, repo, docs, snapshot, put, manifest };
}

test('retains only the immediately previous active hashes and preserves fresh HTML and bytes', async t => {
  const f = await fixture(t), old = 'demo/assets/old-12345678.js', ancient = 'demo/assets/ancient-abcdefgh.js', fresh = 'demo/assets/new-87654321.js';
  await f.put(old, 'old'); await f.put(ancient, 'ancient'); await f.manifest({ [old]: 'old' }, { [ancient]: 'ancient' });
  assert.equal((await capturePagesRelease(f)).captured, 1);
  await rm(path.join(f.docs, 'demo'), { recursive: true });
  await f.put(fresh, 'fresh'); await f.put('demo/index.html', 'current HTML');
  const result = await finalizePagesRelease(f);
  assert.equal(result.retained, 1);
  assert.equal(await readFile(path.join(f.docs, old), 'utf8'), 'old');
  await assert.rejects(readFile(path.join(f.docs, ancient)), { code: 'ENOENT' });
  assert.equal(await readFile(path.join(f.docs, 'demo/index.html'), 'utf8'), 'current HTML');
  const manifest = JSON.parse(await readFile(path.join(f.docs, 'release-manifest.json'), 'utf8'));
  assert(!manifest.active[old]); assert(manifest.retained[old]); assert(manifest.active[fresh]);
  const next = { ...f, snapshot: path.join(f.base, 'next') };
  assert.equal((await capturePagesRelease(next)).captured, 1);
  await assert.rejects(finalizePagesRelease(f), /already been finalized/);
});

test('size gate includes manifest bytes and fails before restoring or publishing', async t => {
  const f = await fixture(t), old = 'demo/assets/old-12345678.js';
  await f.put(old, 'old'); await f.manifest({ [old]: 'old' }); await capturePagesRelease(f);
  await rm(path.join(f.docs, 'demo'), { recursive: true }); await f.put('index.html', 'new');
  const before = await readFile(path.join(f.docs, 'release-manifest.json'));
  await assert.rejects(finalizePagesRelease({ ...f, maximumBytes: 6 }), /must be below/);
  assert.deepEqual(await readFile(path.join(f.docs, 'release-manifest.json')), before);
  await assert.rejects(readFile(path.join(f.docs, old)), { code: 'ENOENT' });
});

test('same-name changed bytes and tampered backup bytes fail without overwriting current output', async t => {
  const f = await fixture(t), old = 'demo/assets/old-12345678.js';
  await f.put(old, 'old'); await f.manifest({ [old]: 'old' }); await capturePagesRelease(f);
  await f.put(old, 'different'); await assert.rejects(finalizePagesRelease(f), /collision/);
  assert.equal(await readFile(path.join(f.docs, old), 'utf8'), 'different');
  await f.put(old, 'old'); await writeFile(path.join(f.snapshot, 'assets', old), 'tampered');
  await assert.rejects(finalizePagesRelease(f), /Snapshot hash mismatch/);
});

test('unsafe paths, symlinks and an in-repository snapshot are rejected', async t => {
  const f = await fixture(t);
  await assert.rejects(capturePagesRelease({ ...f, snapshot: path.join(f.repo, 'snapshot') }), /outside/);
  await f.manifest({ '../outside-12345678.js': 'bad' }); await assert.rejects(capturePagesRelease(f), /Invalid release asset path/);
  await f.manifest({}); await capturePagesRelease(f);
  await symlink(f.base, path.join(f.docs, 'link'));
  await assert.rejects(finalizePagesRelease(f), /symbolic links/);
});

test('migration reads exact committed active bytes and excludes historical retained files', async t => {
  const f = await fixture(t), old = 'demo/assets/old-12345678.js', ancient = 'demo/assets/ancient-abcdefgh.js';
  await f.put(old, 'old'); await f.put(ancient, 'ancient');
  const git = (...args) => execFileSync('git', args, { cwd: f.repo, encoding: 'utf8' }).trim();
  git('init', '-q'); git('add', 'docs'); git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'fixture');
  const revision = git('rev-parse', 'HEAD'), migrationManifest = path.join(f.base, 'migration.json');
  await writeFile(migrationManifest, JSON.stringify({ files: { [old]: fingerprint('old').sha256, [ancient]: fingerprint('ancient').sha256 }, restored: ['docs/' + ancient] }));
  await f.put(old, 'uncommitted replacement');
  assert.equal((await capturePagesRelease({ ...f, migrationManifest, migrationRevision: revision })).captured, 1);
  await rm(path.join(f.docs, 'demo'), { recursive: true }); await f.put('index.html', 'new');
  await finalizePagesRelease(f); assert.equal(await readFile(path.join(f.docs, old), 'utf8'), 'old');
  await assert.rejects(readFile(path.join(f.docs, ancient)), { code: 'ENOENT' });
});

test('a missing active file after an interrupted build is recovered only from exact HEAD bytes', async t => {
  const f = await fixture(t), old = 'demo/assets/old-12345678.js';
  await f.put(old, 'old'); await f.manifest({ [old]: 'old' });
  const git = (...args) => execFileSync('git', args, { cwd: f.repo, encoding: 'utf8' });
  git('init', '-q'); git('add', 'docs'); git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'fixture');
  await rm(path.join(f.docs, old)); assert.equal((await capturePagesRelease(f)).captured, 1);
  assert.equal(await readFile(path.join(f.snapshot, 'assets', old), 'utf8'), 'old');
});

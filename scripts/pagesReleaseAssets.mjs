import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, constants } from 'node:fs';
import { copyFile, lstat, mkdir, readFile, readdir, realpath, rename, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execute = promisify(execFile);
export const PAGES_RELEASE_SCHEMA = 'peercompute.pages-release.v1';
const SNAPSHOT_SCHEMA = 'peercompute.pages-release-snapshot.v1';
const MANIFEST = 'release-manifest.json';
export const PAGES_MAXIMUM_BYTES = 1_000_000_000;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const within = (root, file) => {
  const relative = path.relative(root, file);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
};
function relativePath(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || /[\u0000-\u001f\u007f:]/.test(value)
      || value.split('/').some(part => !part || part === '.' || part === '..') || path.isAbsolute(value)) {
    throw new Error('Invalid release asset path');
  }
  return value;
}
export function isHashedReleaseAsset(value) {
  relativePath(value);
  return value.split('/').includes('assets') && /-[A-Za-z0-9_-]{8,64}\.(?:js|mjs|css|wasm|png|jpe?g|svg|webp|gif|woff2?|ttf|glb)$/.test(path.posix.basename(value));
}
function fileRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || !/^[a-f0-9]{64}$/.test(value.sha256) || !Number.isSafeInteger(value.bytes) || value.bytes < 0) {
    throw new Error('Invalid release asset fingerprint');
  }
  return { sha256: value.sha256, bytes: value.bytes };
}
const same = (a, b) => a.sha256 === b.sha256 && a.bytes === b.bytes;
const sorted = input => Object.fromEntries(Object.entries(input).sort(([a], [b]) => a.localeCompare(b, 'en')));
async function optionalStat(file) { try { return await lstat(file); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } }
/** Reject links in every existing component, including a not-yet-created destination. */
async function safePath(root, relative, { createParents = false } = {}) {
  const parts = relativePath(relative).split('/'); let current = root;
  for (let index = 0; index < parts.length; index++) {
    current = path.join(current, parts[index]); let info = await optionalStat(current);
    if (info?.isSymbolicLink()) throw new Error('Release assets cannot follow symbolic links');
    if (index < parts.length - 1) {
      if (!info && createParents) { await mkdir(current); info = await lstat(current); }
      if (info && !info.isDirectory()) throw new Error('Release asset parent is not a directory');
    }
  }
  return current;
}
async function roots(repo, snapshot, { createSnapshot = false } = {}) {
  const repoRoot = await realpath(path.resolve(repo));
  const docs = await safePath(repoRoot, 'docs');
  if (!(await lstat(docs)).isDirectory()) throw new Error('Pages docs directory is missing');
  const destination = path.resolve(snapshot);
  if (within(repoRoot, destination) || within(destination, repoRoot)) throw new Error('Release snapshot must be outside the repository');
  // Inspect ancestors before creating an external snapshot through a hidden link.
  await safePath(path.parse(destination).root, path.relative(path.parse(destination).root, destination));
  if (createSnapshot) await mkdir(destination, { recursive: true });
  const external = await realpath(destination);
  if (external !== destination || within(repoRoot, external) || within(external, repoRoot)) throw new Error('Unsafe release snapshot directory');
  if (!(await lstat(external)).isDirectory()) throw new Error('Release snapshot must be a directory');
  return { repoRoot, docs, external };
}
async function fingerprint(file) {
  const info = await lstat(file);
  if (!info.isFile() || info.isSymbolicLink()) throw new Error('Release assets must be regular files');
  const hash = createHash('sha256'); let bytes = 0;
  for await (const chunk of createReadStream(file)) { hash.update(chunk); bytes += chunk.length; }
  if (bytes !== info.size) throw new Error('Release asset changed while reading');
  return { sha256: hash.digest('hex'), bytes };
}
async function inventory(root, relative = '') {
  const result = {};
  for (const entry of (await readdir(path.join(root, relative), { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const name = relative ? `${relative}/${entry.name}` : entry.name;
    relativePath(name);
    if (entry.isSymbolicLink()) throw new Error('Release assets cannot follow symbolic links');
    if (entry.isDirectory()) Object.assign(result, await inventory(root, name));
    else if (entry.isFile()) { if (name !== MANIFEST) result[name] = await fingerprint(path.join(root, name)); }
    else throw new Error('Release assets must be regular files');
  }
  return sorted(result);
}
async function gitBytes(repo, revision, relative) {
  const { stdout } = await execute('git', ['show', `${revision}:docs/${relativePath(relative)}`],
    { cwd: repo, encoding: 'buffer', maxBuffer: 128 * 1024 * 1024 });
  return stdout;
}
async function jsonFile(file) { return JSON.parse(await readFile(file, 'utf8')); }
async function atomicJson(file, value) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try { await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' }); await rename(temporary, file); }
  finally { await rm(temporary, { force: true }); }
}

/** Snapshot only the previous build's active hashed files. Retained ancestors
 * never become the next release's active files, bounding retention to one step. */
export async function capturePagesRelease({ repo, snapshot, migrationManifest, migrationRevision } = {}) {
  const { repoRoot, docs, external } = await roots(repo, snapshot, { createSnapshot: true });
  if ((await readdir(external)).length) throw new Error('Release snapshot directory must be empty');
  if (!!migrationManifest !== !!migrationRevision) throw new Error('Migration requires both manifest and revision');
  let records = {}, source = 'empty';
  if (migrationManifest) {
    if (!/^[a-f0-9]{7,40}$/.test(migrationRevision)) throw new Error('Migration requires an explicit Git commit');
    const migration = await jsonFile(migrationManifest);
    if (!migration.files || typeof migration.files !== 'object' || Array.isArray(migration.files) || !Array.isArray(migration.restored)) {
      throw new Error('Invalid migration manifest');
    }
    const historical = new Set(migration.restored.map(value => {
      if (typeof value !== 'string' || !value.startsWith('docs/')) throw new Error('Invalid migration retained path');
      return relativePath(value.slice(5));
    }));
    for (const [relative, sha256] of Object.entries(migration.files)) {
      relativePath(relative);
      if (!/^[a-f0-9]{64}$/.test(sha256)) throw new Error('Invalid migration asset hash');
      if (isHashedReleaseAsset(relative) && !historical.has(relative)) records[relative] = { sha256 };
    }
    source = `git:${migrationRevision}`;
  } else {
    const manifestPath = await safePath(docs, MANIFEST), info = await optionalStat(manifestPath);
    if (info) {
      const manifest = await jsonFile(manifestPath);
      if (manifest.schema !== PAGES_RELEASE_SCHEMA || !manifest.active || typeof manifest.active !== 'object' || Array.isArray(manifest.active)) {
        throw new Error('Invalid current release manifest');
      }
      for (const [relative, value] of Object.entries(manifest.active)) {
        relativePath(relative); const record = fileRecord(value);
        if (isHashedReleaseAsset(relative)) records[relative] = record;
      }
      source = 'release-manifest';
    }
  }
  records = sorted(records);
  for (const [relative, expected] of Object.entries(records)) {
    const output = await safePath(external, `assets/${relative}`, { createParents: true });
    if (migrationManifest) {
      const bytes = await gitBytes(repoRoot, migrationRevision, relative);
      if (digest(bytes) !== expected.sha256) throw new Error(`Migration hash mismatch: ${relative}`);
      await writeFile(output, bytes, { flag: 'wx' });
    } else {
      const current = await safePath(docs, relative);
      if (await optionalStat(current)) {
        if (!same(await fingerprint(current), expected)) throw new Error(`Current release hash mismatch: ${relative}`);
        await copyFile(current, output, constants.COPYFILE_EXCL | constants.COPYFILE_FICLONE);
      } else {
        // A failed previous build may have emptied a demo directory. Recover
        // only exact manifest bytes already committed at HEAD, never guess.
        const bytes = await gitBytes(repoRoot, 'HEAD', relative);
        if (bytes.length !== expected.bytes || digest(bytes) !== expected.sha256) throw new Error(`Git recovery hash mismatch: ${relative}`);
        await writeFile(output, bytes, { flag: 'wx' });
      }
    }
    const actual = await fingerprint(output);
    if (actual.sha256 !== expected.sha256 || (expected.bytes !== undefined && actual.bytes !== expected.bytes)) throw new Error('Snapshot fingerprint mismatch');
    records[relative] = actual;
  }
  await atomicJson(path.join(external, 'snapshot.json'), { schema: SNAPSHOT_SCHEMA, repoRoot, source, files: records });
  return { captured: Object.keys(records).length, bytes: Object.values(records).reduce((sum, record) => sum + record.bytes, 0), source };
}

/** Caller rebuilds every demo output and clears the generated shared pool first.
 * The manifest is computed before restoring old files; no arbitrary tree pruning. */
export async function finalizePagesRelease({ repo, snapshot, maximumBytes = PAGES_MAXIMUM_BYTES } = {}) {
  if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 1) throw new Error('Invalid Pages size limit');
  const { repoRoot, docs, external } = await roots(repo, snapshot);
  const marker = await safePath(external, 'finalization.json');
  if (await optionalStat(marker)) throw new Error('This release snapshot has already been finalized or interrupted; capture and rebuild again');
  const saved = await jsonFile(await safePath(external, 'snapshot.json'));
  if (saved.schema !== SNAPSHOT_SCHEMA || saved.repoRoot !== repoRoot || !saved.files || typeof saved.files !== 'object' || Array.isArray(saved.files)) {
    throw new Error('Invalid release snapshot');
  }
  const active = await inventory(docs), retained = {};
  for (const [relative, value] of Object.entries(saved.files)) {
    if (!isHashedReleaseAsset(relative)) throw new Error('Snapshot contains a non-hashed asset');
    const record = fileRecord(value), backup = await safePath(external, `assets/${relative}`);
    if (!same(await fingerprint(backup), record)) throw new Error(`Snapshot hash mismatch: ${relative}`);
    if (active[relative]) {
      if (!same(active[relative], record)) throw new Error(`Hashed release asset collision: ${relative}`);
    } else retained[relative] = record;
  }
  const manifest = { schema: PAGES_RELEASE_SCHEMA, active, retained: sorted(retained) };
  const manifestBytes = Buffer.byteLength(JSON.stringify(manifest, null, 2) + '\n');
  const bytes = [...Object.values(active), ...Object.values(retained)].reduce((sum, record) => sum + record.bytes, manifestBytes);
  if (bytes >= maximumBytes) throw new Error(`Pages release is ${bytes} bytes; must be below ${maximumBytes} bytes`);
  const manifestPath = await safePath(docs, MANIFEST);
  // A single-use marker prevents restored files becoming active on a retry
  // after a crash between restoration and manifest publication.
  await writeFile(marker, JSON.stringify({ status: 'started', bytes }) + '\n', { flag: 'wx' });
  for (const relative of Object.keys(retained)) {
    const destination = await safePath(docs, relative, { createParents: true });
    await copyFile(await safePath(external, `assets/${relative}`), destination, constants.COPYFILE_EXCL | constants.COPYFILE_FICLONE);
    if (!same(await fingerprint(destination), retained[relative])) throw new Error(`Restored asset changed: ${relative}`);
  }
  await atomicJson(manifestPath, manifest);
  await atomicJson(marker, { status: 'complete', bytes, active: Object.keys(active).length, retained: Object.keys(retained).length });
  return { bytes, maximumBytes, active: Object.keys(active).length, retained: Object.keys(retained).length, manifest: manifestPath };
}

async function main(args) {
  const command = args.shift(), values = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index], value = args[index + 1];
    if (!['--repo', '--snapshot', '--migration-manifest', '--migration-revision'].includes(key) || !value || Object.hasOwn(values, key)) throw new Error('Invalid release asset argument');
    values[key] = value;
  }
  if (!values['--repo'] || !values['--snapshot']) throw new Error('Expected --repo and --snapshot');
  const options = { repo: values['--repo'], snapshot: values['--snapshot'], migrationManifest: values['--migration-manifest'], migrationRevision: values['--migration-revision'] };
  if (command === 'finalize' && (options.migrationManifest || options.migrationRevision)) throw new Error('Migration is only available during capture');
  if (!['capture', 'finalize'].includes(command)) throw new Error('Expected capture or finalize');
  console.log(JSON.stringify(await (command === 'capture' ? capturePagesRelease(options) : finalizePagesRelease(options))));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
}

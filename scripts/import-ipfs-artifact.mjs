#!/usr/bin/env node
import { createHash, randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, lstat, opendir, open, realpath, rename, statfs, unlink, writeFile, link } from 'node:fs/promises';
import { homedir } from 'node:os';
import { get as httpsGet } from 'node:https';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';
import { ArtifactStore, ARTIFACT_IMPORT_PROFILE } from '../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { FileSystemArtifactBackend } from '../peercompute/src/peercompute/artifacts/node/FileSystemArtifactBackend.js';
import { ARTIFACT_MANIFEST_SCHEMA, normalizeArtifactManifest } from '../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { MODEL_CATALOG, modelFileUrl as inferenceModelFileUrl } from '../peercompute/src/peercompute/inference/modelCatalog.js';
import { MODEL_ARTIFACT_CATALOG, modelArtifactFileUrl } from '../peercompute/src/peercompute/artifacts/modelArtifactCatalog.js';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../peercompute/src/peercompute/artifacts/ggufModelCatalog.js';

export const IMPORT_MODEL_CATALOG = Object.freeze({ ...MODEL_CATALOG, ...GGUF_MODEL_CATALOG, ...MODEL_ARTIFACT_CATALOG });
const modelFileUrl = (id, path) => MODEL_CATALOG[id] ? inferenceModelFileUrl(id, path)
  : GGUF_MODEL_CATALOG[id] ? ggufModelFileUrl(id, path) : modelArtifactFileUrl(id, path);

const repositoryDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_ARTIFACT_CACHE = join(homedir(), '.cache', 'peercompute-artifacts');
const defaultQuota = 4 * 1024 ** 3;
const emptyCid = 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku';
function outsideRepository(path) {
  const inside = relative(repositoryDirectory, path);
  if (!inside || (!inside.startsWith(`..${sep}`) && inside !== '..' && !inside.startsWith(sep))) {
    throw new Error('Artifact cache must be outside the repository.');
  }
}

function abort(signal) { signal?.throwIfAborted(); }
function emit(progress, event) { progress?.({ ...event, timestamp: new Date().toISOString() }); }

async function streamResponse(input, { signal } = {}, redirects = 0) {
  const url = new URL(input);
  const officialHost = url.hostname === 'huggingface.co' || url.hostname.endsWith('.huggingface.co')
    || url.hostname === 'hf.co' || url.hostname.endsWith('.hf.co');
  if (url.protocol !== 'https:' || url.username || url.password || !officialHost || redirects > 5) {
    throw new Error('HF redirects must stay on approved HTTPS Hugging Face/CDN hosts within five hops.');
  }
  const response = await new Promise((resolve, reject) => {
    const request = httpsGet(url, { signal, headers: { 'Accept-Encoding': 'identity' } }, resolve);
    request.setTimeout(30_000, () => request.destroy(new Error('HF download stalled.')));
    request.on('error', reject);
  });
  if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
    const location = response.headers.location;
    response.destroy();
    if (!location) throw new Error('HF redirect has no location.');
    return streamResponse(new URL(location, url), { signal }, redirects + 1);
  }
  return { ok: response.statusCode >= 200 && response.statusCode < 300, status: response.statusCode,
    headers: { get: (name) => response.headers[name.toLowerCase()] ?? null }, body: response };
}

async function cancelBody(body) {
  if (body?.cancel) await body.cancel(); else body?.destroy();
}

async function digestFile(path, expected = {}, signal) {
  const stat = await lstat(path);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Artifact source must be a regular file.');
  if (expected.size !== undefined && stat.size !== expected.size) throw new Error(`Source size mismatch: ${basename(path)}`);
  const sha256 = createHash('sha256');
  const git = expected.gitBlobSha1 ? createHash('sha1').update(`blob ${stat.size}\0`) : null;
  let bytes = 0;
  for await (const chunk of createReadStream(path, { highWaterMark: 256 * 1024, signal })) {
    abort(signal); bytes += chunk.byteLength; sha256.update(chunk); git?.update(chunk);
    if (bytes > stat.size) throw new Error('Source grew while being verified.');
  }
  const digest = sha256.digest('hex');
  if (bytes !== stat.size || (expected.sha256 && digest !== expected.sha256)) throw new Error(`Source SHA-256/size mismatch: ${basename(path)}`);
  if (git && git.digest('hex') !== expected.gitBlobSha1) throw new Error(`Source Git blob SHA-1 mismatch: ${basename(path)}`);
  return { size: bytes, sha256: digest };
}

async function writeAll(handle, bytes) {
  let offset = 0;
  while (offset < bytes.length) {
    const { bytesWritten } = await handle.write(bytes, offset, bytes.length - offset);
    if (!bytesWritten) throw new Error('Artifact source write made no progress.');
    offset += bytesWritten;
  }
}

async function downloadFile(model, file, destination, { signal, progress, fetchImpl = streamResponse, guardDisk } = {}) {
  try {
    const verified = await digestFile(destination, file, signal);
    emit(progress, { stage: 'cached', model: model.id, path: file.path, bytes: verified.size });
    return verified;
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
  const temporary = `${destination}.part-${randomUUID()}`;
  const url = modelFileUrl(model.id, file.path);
  for (let attempt = 0; attempt < 3; attempt++) {
    let handle;
    try {
      abort(signal);
      await guardDisk?.();
      emit(progress, { stage: 'download', model: model.id, path: file.path, expectedBytes: file.size, attempt: attempt + 1 });
      const response = await fetchImpl(url, { signal, headers: { 'Accept-Encoding': 'identity' } });
      if (!response.ok || !response.body) { await cancelBody(response.body); throw new Error(`HF download failed with HTTP ${response.status} for ${file.path}`); }
      const length = response.headers.get('content-length');
      if (length !== null && Number(length) !== file.size) {
        await cancelBody(response.body);
        throw new Error(`HF Content-Length differs from pinned catalog for ${file.path}`);
      }
      handle = await open(temporary, 'wx', 0o600);
      const sha256 = createHash('sha256');
      const git = file.gitBlobSha1 ? createHash('sha1').update(`blob ${file.size}\0`) : null;
      let bytes = 0; let reported = 0;
      for await (const chunk of response.body) {
        abort(signal); bytes += chunk.byteLength;
        if (bytes > file.size) throw new Error('HF body exceeds the pinned file size.');
        sha256.update(chunk); git?.update(chunk);
        await writeAll(handle, chunk);
        if (bytes - reported >= 32 * 1024 ** 2) {
          await guardDisk?.();
          reported = bytes;
          emit(progress, { stage: 'download-progress', model: model.id, path: file.path, bytes, expectedBytes: file.size });
        }
      }
      const digest = sha256.digest('hex');
      if (bytes !== file.size || (file.sha256 && file.sha256 !== digest)) throw new Error(`HF size/SHA-256 mismatch for ${file.path}`);
      if (git && git.digest('hex') !== file.gitBlobSha1) throw new Error(`HF Git blob SHA-1 mismatch for ${file.path}`);
      await handle.sync(); await handle.close(); handle = null;
      await rename(temporary, destination);
      return { size: bytes, sha256: digest };
    } catch (error) {
      await handle?.close();
      await unlink(temporary).catch((cleanup) => { if (cleanup.code !== 'ENOENT') throw cleanup; });
      if (signal?.aborted || attempt === 2 || /mismatch|exceeds|differs|reserved free disk/u.test(error.message)) throw error;
      emit(progress, { stage: 'retry', model: model.id, path: file.path, error: error.message });
      await delay(500 * (attempt + 1), undefined, { signal });
    }
  }
}

async function localFiles(source, directory, maximumFileBytes) {
  const entries = [];
  async function walk(path, prefix = '') {
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) throw new Error('Symlink artifact sources are not supported.');
    if (stat.isFile()) {
      entries.push({ path: prefix || basename(path), source: path, size: stat.size });
      if (entries.length > 1024) throw new Error('Artifact directory exceeds the manifest file limit.');
      return;
    }
    if (!stat.isDirectory()) throw new Error('Artifact source must be a regular file or directory.');
    const children = await opendir(path);
    for await (const entry of children) await walk(join(path, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
  }
  const sourceStat = await lstat(source);
  if (directory !== sourceStat.isDirectory()) throw new Error(directory ? '--directory requires a directory.' : '--file requires a file.');
  await walk(source);
  entries.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  normalizeArtifactManifest({ schema: ARTIFACT_MANIFEST_SCHEMA,
    files: entries.map(({ path, size }) => ({ path, size, cid: emptyCid })) }, { maximumFileBytes });
  return entries;
}

async function atomicJson(path, value) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temporary = `${path}.${randomUUID()}.tmp`;
  try { await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600, flag: 'wx' }); await rename(temporary, path); }
  finally { await unlink(temporary).catch((error) => { if (error.code !== 'ENOENT') throw error; }); }
}

async function availableDiskBytes(directory) {
  const info = await statfs(directory, { bigint: true });
  return Number(info.bavail * info.bsize);
}

// Download verified catalog sources without opening the exclusive artifact
// blockstore. This lets a second browser validation consume new model sources
// while an independent, longer import owns the store. Equal pinned upstream
// digests permit verified hard-link reuse; a model name alone never does.
export async function prefetchArtifactModelSources({ model: modelId, cache = DEFAULT_ARTIFACT_CACHE,
  minimumFreeBytes = 8 * 1024 ** 3, signal, progress, fetchImpl, diskAvailable = availableDiskBytes } = {}) {
  const model = IMPORT_MODEL_CATALOG[modelId];
  if (!model) throw new Error(`Unknown model: ${modelId}`);
  if (!Number.isSafeInteger(minimumFreeBytes) || minimumFreeBytes < 0) throw new Error('Invalid free disk reserve.');
  outsideRepository(resolve(cache));
  await mkdir(resolve(cache), { recursive: true, mode: 0o700 });
  cache = await realpath(resolve(cache));
  outsideRepository(cache);
  const sourceDirectory = join(cache, 'sources', model.id, model.revision);
  const signature = (file) => `${file.size}:${file.sha256 ? `sha256:${file.sha256}` : `git:${file.gitBlobSha1}`}`;
  const reusable = new Map();
  for (const candidate of Object.values(IMPORT_MODEL_CATALOG)) {
    if (candidate.id === modelId) continue;
    for (const file of candidate.files) {
      const key = signature(file);
      if (!reusable.has(key)) reusable.set(key, []);
      reusable.get(key).push(join(cache, 'sources', candidate.id, candidate.revision, ...file.path.split('/')));
    }
  }
  const selected = model.files.map((entry) => ({ ...entry, source: join(sourceDirectory, ...entry.path.split('/')) }));
  let remainingBytes = 0;
  for (const file of selected) {
    abort(signal);
    try { await lstat(file.source); continue; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    let reused = false;
    for (const source of reusable.get(signature(file)) || []) {
      let verified;
      try { verified = await digestFile(source, file, signal); }
      catch (error) { if (error.code === 'ENOENT') continue; throw error; }
      await mkdir(dirname(file.source), { recursive: true, mode: 0o700 });
      await link(source, file.source);
      reused = true;
      emit(progress, { stage: 'source-reused', model: modelId, path: file.path, bytes: verified.size });
      break;
    }
    if (!reused) remainingBytes += file.size;
  }
  const freeBytes = await diskAvailable(cache);
  if (freeBytes < remainingBytes + minimumFreeBytes + 64 * 1024 ** 2) {
    throw new Error(`Source prefetch needs ${remainingBytes} bytes plus ${minimumFreeBytes} reserved free disk.`);
  }
  const guardDisk = async () => {
    if (await diskAvailable(cache) < minimumFreeBytes + 160 * 1024 ** 2) throw new Error('Source prefetch reached the reserved free disk boundary.');
  };
  emit(progress, { stage: 'source-preflight', model: modelId, remainingBytes, freeBytes, minimumFreeBytes });
  const files = [];
  for (const file of selected) {
    const verified = await downloadFile(model, file, file.source, { signal, progress, fetchImpl, guardDisk });
    files.push({ path: file.path, source: file.source, ...verified });
  }
  return { modelId, sourceDirectory, files, totalBytes: model.totalBytes };
}

async function preflightImport(store, selected, cache, { minimumFreeBytes, diskAvailable }) {
  const presentDigests = new Set();
  for await (const root of store.list()) if (root.status === 'complete' && root.kind === 'file' && root.sha256) {
    presentDigests.add(`${root.sha256}:${root.size}`);
  }
  let newFileBytes = 0; let newSourceBytes = 0; let blockCount = 0;
  for (const file of selected) {
    if (!file.sha256 || !presentDigests.has(`${file.sha256}:${file.size}`)) {
      newFileBytes += file.size;
      blockCount += Math.ceil(file.size / ARTIFACT_IMPORT_PROFILE.chunkSize) + 1;
    }
    if (file.download) {
      try {
        const existing = await lstat(file.source);
        if (!existing.isFile() || existing.isSymbolicLink() || existing.size !== file.size) newSourceBytes += file.size;
      } catch (error) { if (error.code === 'ENOENT') newSourceBytes += file.size; else throw error; }
    }
  }
  // CID parent blocks and the bounded package manifest require additional
  // payload space. Quota is still enforced atomically at every block write.
  const requiredPayloadBytes = newFileBytes + blockCount * 96 + selected.length * 4096 + 256 * 1024;
  if (store.getStats().storedBytes + requiredPayloadBytes > store.maximumBytes) {
    throw new DOMException(`Import preflight exceeds artifact quota; allow at least ${store.getStats().storedBytes + requiredPayloadBytes} bytes.`, 'QuotaExceededError');
  }
  // Sources are retained for browser fixtures. Account for their separate copy,
  // filesystem block allocation/header overhead, and a bounded staging margin.
  const requiredDiskBytes = newSourceBytes + requiredPayloadBytes + blockCount * 8192 + 64 * 1024 ** 2;
  const freeBytes = await diskAvailable(cache);
  if (freeBytes < requiredDiskBytes + minimumFreeBytes) {
    throw new Error(`Import preflight needs ${requiredDiskBytes} free bytes plus ${minimumFreeBytes} reserved; only ${freeBytes} bytes are available.`);
  }
  return { requiredPayloadBytes, requiredDiskBytes, freeBytes, minimumFreeBytes };
}

export async function importArtifactPackage({ file, directory, model: modelId, cache = DEFAULT_ARTIFACT_CACHE,
  quotaBytes = defaultQuota, expectedSha256, signal, progress, fetchImpl,
  minimumFreeBytes, diskAvailable = availableDiskBytes } = {}) {
  if ([file, directory, modelId].filter(Boolean).length !== 1) throw new Error('Choose exactly one of --file, --directory or --model.');
  if (!Number.isSafeInteger(quotaBytes) || quotaBytes < 1) throw new Error('Quota must be a positive safe integer.');
  if (expectedSha256 !== undefined && (!file || !/^[a-f0-9]{64}$/u.test(expectedSha256))) throw new Error('--sha256 requires --file and a lowercase whole-file SHA-256.');
  const model = modelId ? IMPORT_MODEL_CATALOG[modelId] : null;
  if (modelId && !model) throw new Error(`Unknown model: ${modelId}`);
  minimumFreeBytes ??= model?.status === 'storage-only' ? 8 * 1024 ** 3 : 0;
  if (!Number.isSafeInteger(minimumFreeBytes) || minimumFreeBytes < 0) throw new Error('Free disk reserve must be a nonnegative safe integer.');
  outsideRepository(resolve(cache));
  await mkdir(resolve(cache), { recursive: true, mode: 0o700 });
  cache = await realpath(resolve(cache));
  outsideRepository(cache);
  const started = Date.now();
  const storeDirectory = join(cache, 'store');
  const maximumTraversalBlocks = Math.max(65536, Math.ceil(quotaBytes / ARTIFACT_IMPORT_PROFILE.chunkSize) + 4096);
  const backend = new FileSystemArtifactBackend({ directory: storeDirectory,
    maximumIndexEntries: Math.max(131072, maximumTraversalBlocks + 8192) });
  const store = new ArtifactStore({ name: 'cli-import', persistent: true, backend, ownsBackend: true,
    maximumBytes: quotaBytes, maximumTraversalBlocks });
  let sampledPeakRssBytes = process.memoryUsage().rss;
  const memorySampler = setInterval(() => { sampledPeakRssBytes = Math.max(sampledPeakRssBytes, process.memoryUsage().rss); }, 25);
  memorySampler.unref();
  try {
    await store.open();
    const sourceDirectory = model ? join(cache, 'sources', model.id, model.revision) : resolve(directory || dirname(file));
    const selected = model ? model.files.map((entry) => ({ ...entry, download: true, source: join(sourceDirectory, ...entry.path.split('/')) }))
      : await localFiles(resolve(file || directory), Boolean(directory), store.maximumFileBytes);
    const admission = await preflightImport(store, selected, cache, { minimumFreeBytes, diskAvailable });
    emit(progress, { stage: 'preflight', model: modelId || null, ...admission });
    const guardDisk = minimumFreeBytes ? async () => {
      // The margin covers bytes written between checks. This remains a single
      // process import, not a reservation against unrelated disk writers.
      if (await diskAvailable(cache) < minimumFreeBytes + 160 * 1024 ** 2) {
        throw new Error('Artifact import reached the reserved free disk boundary.');
      }
    } : undefined;
    const files = [];
    for (const entry of selected) {
      abort(signal);
      const verified = model ? await downloadFile(model, entry, entry.source, { signal, progress, fetchImpl, guardDisk })
        : await digestFile(entry.source, { size: entry.size, sha256: expectedSha256 }, signal);
      emit(progress, { stage: 'import', model: modelId || null, path: entry.path, bytes: verified.size });
      async function* diskGuardedSource() {
        let sinceCheck = 128 * 1024 ** 2;
        for await (const bytes of createReadStream(entry.source, { highWaterMark: 256 * 1024, signal })) {
          if (minimumFreeBytes && sinceCheck >= 128 * 1024 ** 2) {
            await guardDisk();
            sinceCheck = 0;
          }
          sinceCheck += bytes.byteLength;
          yield bytes;
        }
      }
      const descriptor = await store.importFile(diskGuardedSource(), {
        signal, expectedSize: verified.size, expectedSha256: verified.sha256, pin: false
      });
      files.push({ path: entry.path, cid: descriptor.cid, size: descriptor.size, sha256: descriptor.sha256 });
    }
    const manifest = { schema: ARTIFACT_MANIFEST_SCHEMA, name: model?.name || basename(resolve(file || directory)), files,
      ...(model ? { model: model.model, provenance: { ...model.provenance, license: model.license } }
        : { provenance: { source: 'local', fileCount: files.length } }) };
    emit(progress, { stage: 'verify-package', model: modelId || null, fileCount: files.length });
    const imported = await store.importManifest(manifest, { signal, pin: true });
    const packageDirectory = join(cache, 'packages', modelId || imported.cid);
    const manifestPath = join(packageDirectory, 'manifest.json');
    const report = { manifestCid: imported.cid, manifestPath, descriptorPath: join(packageDirectory, 'descriptor.json'),
      modelId: modelId || null, sourceDirectory, storeDirectory, fileCount: files.length,
      totalFileBytes: files.reduce((total, entry) => total + entry.size, 0),
      completedAt: new Date().toISOString(), elapsedMs: Date.now() - started,
      admission, executionStatus: model?.capabilities?.executionStatus || 'requires-device-validation',
      sampledPeakRssBytes: Math.max(sampledPeakRssBytes, process.memoryUsage().rss), memorySampleIntervalMs: 25,
      // Linux may retain the launcher's pre-exec high-water mark; this value
      // alone is not evidence of memory allocated by this importing process.
      kernelMaxRssBytes: process.resourceUsage().maxRSS * 1024, storage: store.getStats() };
    await atomicJson(manifestPath, imported.manifest);
    await atomicJson(report.descriptorPath, report);
    emit(progress, { stage: 'complete', ...report });
    return report;
  } finally { clearInterval(memorySampler); await store.destroy(); }
}

async function main() {
  const { values } = parseArgs({ options: { file: { type: 'string' }, directory: { type: 'string' },
    model: { type: 'string' }, cache: { type: 'string' }, 'quota-bytes': { type: 'string' },
    'minimum-free-bytes': { type: 'string' },
    sha256: { type: 'string' }, help: { type: 'boolean' }, 'list-models': { type: 'boolean' } } });
  if (values.help) {
    process.stdout.write('Usage: node scripts/import-ipfs-artifact.mjs --file PATH | --directory PATH | --model ID\nOptions: --cache PATH --quota-bytes N --minimum-free-bytes N --sha256 HEX --list-models\nDefault cache: ~/.cache/peercompute-artifacts (outside Git); quota: 4 GiB. Storage-only models reserve 8 GiB free disk by default.\n');
    return;
  }
  if (values['list-models']) {
    process.stdout.write(`${JSON.stringify(Object.values(IMPORT_MODEL_CATALOG).map((entry) => ({ id: entry.id, name: entry.name,
      format: entry.format || entry.provenance.format, status: entry.status, totalBytes: entry.totalBytes,
      capabilities: entry.capabilities || { import: true, pin: true, peerHosting: true, executionStatus: 'requires-device-validation' }
    })), null, 2)}\n`); return;
  }
  const controller = new AbortController();
  const stop = () => controller.abort(new DOMException('Import interrupted.', 'AbortError'));
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
  try {
    const report = await importArtifactPackage({ ...values, quotaBytes: values['quota-bytes'] === undefined ? defaultQuota : Number(values['quota-bytes']),
      expectedSha256: values.sha256, signal: controller.signal,
      ...(values['minimum-free-bytes'] === undefined ? {} : { minimumFreeBytes: Number(values['minimum-free-bytes']) }),
      progress: (event) => process.stderr.write(`${JSON.stringify(event)}\n`) });
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } finally { process.removeListener('SIGINT', stop); process.removeListener('SIGTERM', stop); }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => { process.stderr.write(`${error.name}: ${error.message}\n`); process.exitCode = 1; });
}

import { CID } from 'multiformats/cid';
import { sha256 as multihashSha256 } from 'multiformats/hashes/sha2';
import { sha256 } from '@noble/hashes/sha2.js';
import * as dagPb from '@ipld/dag-pb';
import { importByteStream } from 'ipfs-unixfs-importer';
import { fixedSize } from 'ipfs-unixfs-importer/chunker';
import { balanced } from 'ipfs-unixfs-importer/layout';
import { exporter } from 'ipfs-unixfs-exporter';
import { UnixFS, Node as UnixFSNode } from 'ipfs-unixfs';
import { Key } from 'interface-datastore';
import { MemoryArtifactBackend, IndexedDBArtifactBackend } from './ArtifactBackends.js';
import { acquireArtifactLock, throwIfAborted } from './ArtifactLocks.js';
import { ARTIFACT_MANIFEST_SCHEMA, ARTIFACT_MANIFEST_MAXIMUM_BYTES,
  ARTIFACT_MAXIMUM_FILE_BYTES, artifactCID, normalizeArtifactManifest,
  encodeArtifactManifest, decodeArtifactManifest } from './ArtifactManifest.js';

export const ARTIFACT_IMPORT_PROFILE = Object.freeze({
  name: 'peercompute.unixfs.v1', cidVersion: 1, hash: 'sha2-256', rawLeaves: true,
  chunkSize: 256 * 1024, maxChildrenPerNode: 174, layout: 'balanced', reduceSingleLeafToSelf: true
});
export { ARTIFACT_MANIFEST_SCHEMA };
const hex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
const RETENTION = Symbol('artifact-import-retention');
const DAMAGE = Symbol('verified-artifact-damage');
function integer(value, name, minimum = 1) {
  if (!Number.isSafeInteger(value) || value < minimum) throw new RangeError(`Invalid ${name}.`);
  return value;
}
function missing(cid) {
  const error = new Error(`Artifact block not found: ${cid}`);
  error.name = 'NotFoundError'; error.code = 'ERR_NOT_FOUND'; error[DAMAGE] = true;
  return error;
}
const integrity = (message) => Object.assign(new Error(message), { code: 'ERR_ARTIFACT_INTEGRITY', [DAMAGE]: true });
const damaged = (error) => error?.[DAMAGE] === true;
function abortable(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) { Promise.resolve(promise).catch(() => {}); throwIfAborted(signal); }
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason || new DOMException('Aborted', 'AbortError'));
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
async function* sourceChunks(source, signal) {
  if (source instanceof Uint8Array) { yield source; return; }
  // Prefer the reader API so cancellation can interrupt a pending read. The
  // built-in async iterator's return() may wait behind its unresolved next().
  if (source?.getReader) {
    const reader = source.getReader();
    let finished = false;
    try {
      while (true) { const next = await abortable(reader.read(), signal); if (next.done) { finished = true; return; } yield next.value; }
    } finally { if (!finished) void reader.cancel().catch(() => {}); reader.releaseLock(); }
    return;
  }
  if (source?.[Symbol.asyncIterator] || source?.[Symbol.iterator]) {
    const iterator = source[Symbol.asyncIterator]?.() || source[Symbol.iterator]();
    let finished = false;
    try {
      while (true) { const next = await abortable(iterator.next(), signal); if (next.done) { finished = true; return; } yield next.value; }
    } finally { if (!finished) void Promise.resolve(iterator.return?.()).catch(() => {}); }
    return;
  }
  throw new TypeError('Artifact source must be bytes or a byte stream.');
}

/** StateManager-owned persistent UnixFS storage. Network facades borrow its lifecycle. */
export class ArtifactStore {
  constructor({ name = 'default', persistent = true, backend, ownsBackend = backend === undefined,
    capacity = 'bounded', maximumBytes = capacity === 'browser' ? Number.MAX_SAFE_INTEGER : 2 * 1024 ** 3,
    maximumBlockBytes = 2 * 1024 ** 2,
    maximumFileBytes = ARTIFACT_MAXIMUM_FILE_BYTES, maximumTraversalBlocks = 65536,
    maximumStoredBlocks = capacity === 'browser' ? Number.MAX_SAFE_INTEGER : maximumTraversalBlocks,
    maximumRoots = capacity === 'browser' ? Number.MAX_SAFE_INTEGER : 1024, maximumRoutingBytes = 16 * 1024 ** 2,
    maximumConcurrentBlockWrites = 4, maximumQueuedBlockWrites = 16,
    lockManager = globalThis.navigator?.locks, onDestroy, indexedDBImpl, keyRange } = {}) {
    if (typeof name !== 'string' || !/^[\w.-]{1,80}$/u.test(name)) throw new TypeError('Invalid artifact store name.');
    if (!['bounded', 'browser'].includes(capacity)) throw new TypeError('Invalid artifact storage capacity policy.');
    this.capacity = capacity;
    this.name = name;
    this.persistent = persistent;
    this.backend = backend || (persistent ? new IndexedDBArtifactBackend({ name, indexedDBImpl, keyRange })
      : new MemoryArtifactBackend({ name }));
    this.ownsBackend = ownsBackend;
    this.maximumBytes = integer(maximumBytes, 'maximumBytes');
    this.maximumBlockBytes = integer(maximumBlockBytes, 'maximumBlockBytes');
    this.maximumFileBytes = integer(maximumFileBytes, 'maximumFileBytes');
    this.maximumTraversalBlocks = integer(maximumTraversalBlocks, 'maximumTraversalBlocks');
    this.maximumStoredBlocks = integer(maximumStoredBlocks, 'maximumStoredBlocks');
    this.maximumRoots = integer(maximumRoots, 'maximumRoots');
    this.maximumRoutingBytes = integer(maximumRoutingBytes, 'maximumRoutingBytes');
    this.maximumConcurrentBlockWrites = integer(maximumConcurrentBlockWrites, 'maximumConcurrentBlockWrites');
    this.maximumQueuedBlockWrites = integer(maximumQueuedBlockWrites, 'maximumQueuedBlockWrites', 0);
    this.activeBlockWrites = 0;
    this.waitingBlockWrites = [];
    this.lockManager = lockManager;
    this.lockName = `peercompute-artifacts:${this.backend.name || name}`;
    this.onDestroy = onDestroy;
    this.controller = new AbortController();
    this.operations = new Set();
    this.isOpen = false;
    this.destroyed = false;
    this.usage = { bytes: 0, entries: 0 };
    this.rootUsage = { bytes: 0, entries: 0 };
    this.blockstore = this._createBlockstore();
    this.datastore = this._createDatastore();
  }

  async open() {
    if (this.destroyed) throw new Error('Artifact store is destroyed.');
    if (this.opening) return this.opening;
    if (this.isOpen) return;
    this.opening = (async () => {
      if (this.persistent && !this.lockManager?.request && !this.backend.supportsExclusiveAccess) {
        throw new Error('Persistent artifact storage requires Web Locks for cross-context GC safety.');
      }
      await this.backend.open();
      if (this.persistent && !this.lockManager?.request && !this.backend.hasExclusiveLock) {
        throw new Error('Persistent artifact backend did not acquire its exclusive storage lock.');
      }
      this.usage = await this.backend.getUsage('blocks');
      this.rootUsage = await this.backend.getUsage('roots');
      this.isOpen = true;
    })();
    try { await this.opening; } finally { this.opening = null; }
  }

  async _begin(signal, mode = 'shared') {
    if (this.destroyed) throw new Error('Artifact store is destroyed.');
    const combined = signal ? AbortSignal.any([signal, this.controller.signal]) : this.controller.signal;
    throwIfAborted(combined);
    await this.open();
    const unlock = mode === 'none' ? () => {} : await acquireArtifactLock(`${this.lockName}:gc`, mode, combined, this.lockManager);
    try { throwIfAborted(combined); } catch (error) { unlock(); throw error; }
    let release;
    const settled = new Promise((resolve) => { release = resolve; });
    const operation = { settled, paused: false, finish: () => {
      combined.removeEventListener('abort', onAbort);
      unlock(); this.operations.delete(operation); release();
    } };
    // Paused generators must not hold a lock forever after cancellation. Their
    // next yield still checks the aborted signal before touching persistent data.
    const onAbort = () => { if (operation.paused) operation.finish(); };
    combined.addEventListener('abort', onAbort, { once: true });
    this.operations.add(operation);
    return { signal: combined, finish: operation.finish,
      pause: () => { operation.paused = true; if (combined.aborted) operation.finish(); },
      resume: () => { operation.paused = false; throwIfAborted(combined); } };
  }

  async _run(signal, callback, mode, retention) {
    if (retention && (retention.store !== this || !retention.held || mode === 'exclusive')) {
      throw new Error('Artifact retention scope is no longer active.');
    }
    // Scoped imports already own the shared GC lock. Reacquiring it behind a
    // queued exclusive writer would deadlock under Web Locks writer fairness.
    const activeSignal = retention ? AbortSignal.any([retention.signal, ...(signal ? [signal] : [])]) : signal;
    const operation = await this._begin(activeSignal, retention ? 'none' : mode);
    try {
      const result = await callback(operation.signal);
      throwIfAborted(operation.signal);
      return result;
    } finally { operation.finish(); }
  }

  async _writeRoot(cid, update, signal) {
    const unlock = await acquireArtifactLock(`${this.lockName}:roots`, 'exclusive', signal, this.lockManager);
    try {
      throwIfAborted(signal);
      const previous = await this.backend.get('roots', cid);
      const record = update(previous);
      throwIfAborted(signal);
      if (record === undefined) return undefined; // Conditional metadata update; never recreate a deleted root.
      await this.backend.put('roots', cid, record, { maximumEntries: this.maximumRoots,
        maximumBytes: Math.min(Number.MAX_SAFE_INTEGER, this.maximumRoots * (ARTIFACT_MANIFEST_MAXIMUM_BYTES + 2048)) });
      this.rootUsage = await this.backend.getUsage('roots');
      return structuredClone(record);
    } finally { unlock(); }
  }

  async _readBlock(cid, signal) {
    throwIfAborted(signal);
    const parsed = artifactCID(cid);
    const bytes = await this.backend.get('blocks', parsed.toString());
    if (!bytes) throw missing(parsed);
    await this._verifyBlock(parsed, bytes);
    throwIfAborted(signal);
    return bytes;
  }

  async _verifyBlock(cid, bytes) {
    if (!(bytes instanceof Uint8Array) || bytes.byteLength > this.maximumBlockBytes) throw new RangeError('Artifact block exceeds byte limit.');
    const digest = await multihashSha256.digest(bytes);
    if (!CID.createV1(cid.code, digest).equals(cid)) throw integrity('Artifact block CID verification failed.');
  }

  async _blockWritePermit(signal) {
    throwIfAborted(signal);
    if (this.activeBlockWrites >= this.maximumConcurrentBlockWrites) {
      if (this.waitingBlockWrites.length >= this.maximumQueuedBlockWrites) throw new Error('Artifact block write queue is full.');
      await new Promise((resolve, reject) => {
        const waiter = { resolve, signal, abort: () => {
          const index = this.waitingBlockWrites.indexOf(waiter);
          if (index >= 0) this.waitingBlockWrites.splice(index, 1);
          reject(signal.reason || new DOMException('Aborted', 'AbortError'));
        } };
        signal?.addEventListener('abort', waiter.abort, { once: true });
        this.waitingBlockWrites.push(waiter);
      });
    } else this.activeBlockWrites++;
    return () => {
      const next = this.waitingBlockWrites.shift();
      if (next) { next.signal?.removeEventListener('abort', next.abort); next.resolve(); }
      else this.activeBlockWrites--;
    };
  }

  async _putBlock(cid, source, signal) {
    const release = await this._blockWritePermit(signal);
    try { return await this._persistBlock(cid, source, signal); } finally { release(); }
  }

  async _persistBlock(cid, source, signal) {
    throwIfAborted(signal);
    const parsed = artifactCID(cid);
    // A list of one-byte chunks can itself consume unbounded metadata memory.
    // Reserve one bounded block buffer for iterable inputs instead.
    const buffer = source instanceof Uint8Array ? null : new Uint8Array(this.maximumBlockBytes);
    let size = 0;
    let bytes;
    for await (const chunk of sourceChunks(source, signal)) {
      throwIfAborted(signal);
      if (!(chunk instanceof Uint8Array)) throw new TypeError('Artifact streams require Uint8Array chunks.');
      size += chunk.byteLength;
      if (size > this.maximumBlockBytes) throw new RangeError('Artifact block exceeds byte limit.');
      if (buffer) buffer.set(chunk, size - chunk.byteLength); else bytes = chunk.slice();
    }
    bytes = buffer ? buffer.slice(0, size) : bytes;
    await this._verifyBlock(parsed, bytes);
    throwIfAborted(signal);
    await this.backend.put('blocks', parsed.toString(), bytes,
      { maximumBytes: this.maximumBytes, maximumEntries: this.maximumStoredBlocks });
    this.usage = await this.backend.getUsage('blocks');
    return parsed;
  }

  _localBlocks(signal) {
    const store = this;
    return {
      async *get(cid) { yield await store._readBlock(cid, signal); },
      put: (cid, source) => store._putBlock(cid, source, signal)
    };
  }

  async importFile(source, { signal, expectedSize, expectedSha256, pin = true, [RETENTION]: retention } = {}) {
    if (expectedSize !== undefined) integer(expectedSize, 'expectedSize', 0);
    if (expectedSize > this.maximumFileBytes) throw new RangeError('File exceeds byte limit.');
    if (expectedSha256 !== undefined && !/^[a-f0-9]{64}$/u.test(expectedSha256)) throw new TypeError('Invalid expected SHA-256.');
    return this._run(signal, async (activeSignal) => {
      const hash = sha256.create();
      let size = 0;
      const store = this;
      async function* bounded() {
        for await (const chunk of sourceChunks(source, activeSignal)) {
          throwIfAborted(activeSignal);
          if (!(chunk instanceof Uint8Array)) throw new TypeError('Artifact streams require Uint8Array chunks.');
          size += chunk.byteLength;
          if (size > store.maximumFileBytes || (expectedSize !== undefined && size > expectedSize)) throw new RangeError('File exceeds declared byte limit.');
          // Large caller buffers are not copied as a whole by the importer.
          for (let offset = 0; offset < chunk.byteLength; offset += ARTIFACT_IMPORT_PROFILE.chunkSize) {
            const part = chunk.subarray(offset, offset + ARTIFACT_IMPORT_PROFILE.chunkSize);
            hash.update(part); yield part;
          }
        }
      }
      const result = await importByteStream(bounded(), this._localBlocks(activeSignal), {
        cidVersion: 1, rawLeaves: true, reduceSingleLeafToSelf: true, wrapWithDirectory: false,
        chunker: fixedSize({ chunkSize: ARTIFACT_IMPORT_PROFILE.chunkSize }),
        layout: balanced({ maxChildrenPerNode: ARTIFACT_IMPORT_PROFILE.maxChildrenPerNode }),
        fileImportConcurrency: 1, blockWriteConcurrency: 1
      });
      const digest = hex(hash.digest());
      if (expectedSize !== undefined && expectedSize !== size) throw new Error('File size does not match expected size.');
      if (expectedSha256 !== undefined && expectedSha256 !== digest) throw new Error('File SHA-256 does not match expected digest.');
      const cid = result.cid.toV1().toString();
      return this._writeRoot(cid, (previous) => ({ cid, kind: 'file', size, sha256: digest,
        status: 'complete', pinned: Boolean(pin || previous?.pinned), retain: false,
        profile: ARTIFACT_IMPORT_PROFILE.name }), activeSignal);
    }, undefined, retention);
  }

  async importManifest(input, { signal, pin = true, [RETENTION]: retention } = {}) {
    const manifest = normalizeArtifactManifest(input, { maximumFileBytes: this.maximumFileBytes });
    const bytes = encodeArtifactManifest(manifest);
    return this._run(signal, async (activeSignal) => {
      for (const file of manifest.files) await this._recordVerifiedFile(file, activeSignal);
      const cid = CID.createV1(0x55, await multihashSha256.digest(bytes));
      await this._putBlock(cid, bytes, activeSignal);
      return this._writeRoot(cid.toString(), (previous) => ({ cid: cid.toString(), kind: 'manifest',
        size: bytes.byteLength, manifest, status: 'complete', pinned: Boolean(pin || previous?.pinned),
        retain: false }), activeSignal);
    }, undefined, retention);
  }

  async _verifyFile(cid, expected = {}, signal, onBytes) {
    const entry = await exporter(artifactCID(cid).toString(), this._localBlocks(signal));
    if (!['file', 'raw'].includes(entry.type)) throw integrity('Artifact root must identify a file.');
    const size = Number(entry.type === 'raw' ? entry.node.byteLength : entry.unixfs.fileSize());
    if (!Number.isSafeInteger(size) || size > this.maximumFileBytes) throw new RangeError('Artifact file exceeds its size limit.');
    if (expected.size !== undefined && size !== expected.size) throw integrity('Artifact file size differs from its manifest.');
    const hash = sha256.create();
    let read = 0;
    for await (const chunk of this._fileChunks(cid, { size, signal })) {
      throwIfAborted(signal); read += chunk.byteLength;
      if (read > size) throw integrity('Artifact content exceeds declared size.');
      hash.update(chunk); onBytes?.(chunk.byteLength);
    }
    const digest = hex(hash.digest());
    if (read !== size || (expected.sha256 !== undefined && digest !== expected.sha256)) {
      throw integrity('Artifact file integrity differs from its manifest.');
    }
    return { size, sha256: digest };
  }

  // exporter16's content() starts an unbounded background push queue, even
  // with blockReadConcurrency:1. Keep its root metadata parsing, but consume
  // file DAGs here on demand so a paused reader never loads the remaining file.
  async *_fileChunks(input, { size, offset = 0, length = size - offset, signal }) {
    const end = offset + length;
    const pending = [{ cid: artifactCID(input), start: 0, size, depth: 0 }];
    let visited = 0;
    let emitted = 0;
    while (pending.length) {
      throwIfAborted(signal);
      const frame = pending.pop();
      if (++visited > this.maximumTraversalBlocks || frame.depth > 64) throw new RangeError('Artifact file traversal exceeds its bounds.');
      const bytes = await this._readBlock(frame.cid, signal);
      if (frame.cid.code === 0x55) {
        if (bytes.byteLength !== frame.size) throw integrity('Raw file block size differs from its UnixFS link.');
        const part = bytes.subarray(Math.max(0, offset - frame.start), Math.min(bytes.length, end - frame.start));
        if (part.length) { emitted += part.length; yield part; }
        continue;
      }
      const node = dagPb.decode(bytes);
      if (!node.Data) throw integrity('UnixFS file node has no metadata.');
      const file = UnixFS.unmarshal(node.Data);
      const declaredSize = UnixFSNode.decode(bytes).data?.fileSize;
      if (!['file', 'raw'].includes(file.type) || node.Links.length !== file.blockSizes.length
          || Number(file.fileSize()) !== frame.size
          || (declaredSize !== undefined && declaredSize !== BigInt(frame.size))) throw integrity('UnixFS file metadata is inconsistent.');
      const data = file.data || new Uint8Array();
      let position = frame.start + data.length;
      const children = [];
      for (let i = 0; i < node.Links.length; i++) {
        const childSize = Number(file.blockSizes[i]);
        if (!Number.isSafeInteger(childSize) || childSize < 0) throw integrity('Invalid UnixFS child size.');
        const childCid = artifactCID(node.Links[i].Hash);
        const dagSize = node.Links[i].Tsize;
        if (dagSize !== undefined && (!Number.isSafeInteger(dagSize) || dagSize < childSize
            || (childCid.code === 0x55 && dagSize !== childSize))) throw integrity('Invalid UnixFS link DAG size.');
        if (position < end && position + childSize > offset) {
          children.push({ cid: childCid, start: position, size: childSize, depth: frame.depth + 1 });
        }
        position += childSize;
        if (!Number.isSafeInteger(position)) throw integrity('Invalid UnixFS file extent.');
      }
      if (position !== frame.start + frame.size) throw integrity('UnixFS child sizes differ from their parent.');
      if (pending.length + children.length > this.maximumTraversalBlocks) throw new RangeError('UnixFS pending traversal exceeds limit.');
      for (let i = children.length - 1; i >= 0; i--) pending.push(children[i]);
      if (data.length && frame.start < end && frame.start + data.length > offset) {
        const part = data.subarray(Math.max(0, offset - frame.start), Math.min(data.length, end - frame.start));
        emitted += part.length; yield part;
      }
    }
    if (emitted !== length) throw integrity('UnixFS read did not produce the requested number of bytes.');
  }

  async _recordVerifiedFile(file, signal, onBytes) {
    const verified = await this._verifyFile(file.cid, file, signal, onBytes);
    return this._writeRoot(file.cid, (previous) => ({ ...previous, cid: file.cid,
      kind: 'file', ...verified, status: 'complete', pinned: Boolean(previous?.pinned), retain: false }), signal);
  }

  async *_walk(roots, { signal, fetchBlock, allowMissing = false, onMissing } = {}) {
    const pending = roots.map((cid) => artifactCID(cid));
    const seen = new Set();
    while (pending.length) {
      throwIfAborted(signal);
      const cid = pending.pop();
      const key = cid.toString();
      if (seen.has(key)) continue;
      if (seen.size >= this.maximumTraversalBlocks) throw new RangeError('Artifact DAG traversal exceeds block limit.');
      seen.add(key);
      let bytes;
      try { bytes = await this._readBlock(cid, signal); } catch (error) {
        if (error.code !== 'ERR_NOT_FOUND') throw error;
        onMissing?.(error);
        if (fetchBlock) { await this._putBlock(cid, await abortable(fetchBlock(cid, { signal }), signal), signal); bytes = await this._readBlock(cid, signal); }
        else if (allowMissing) continue;
        else throw error;
      }
      yield key;
      if (cid.code === dagPb.code) {
        const links = dagPb.decode(bytes).Links;
        if (pending.length + links.length > this.maximumTraversalBlocks) throw new RangeError('Artifact DAG links exceed limit.');
        for (const link of links) pending.push(artifactCID(link.Hash));
      }
    }
  }

  async _invalidateRoot(cid, error) {
    if (!damaged(error)) return;
    // Persist an observed integrity failure even if cancellation races it. This
    // bounded metadata write still owns the operation's GC lock; destroy waits.
    await this._writeRoot(cid, (previous) => !previous || previous.status === 'deleting' ? undefined : ({ ...previous, cid,
      kind: previous.kind || 'file', status: 'partial', pinned: Boolean(previous.pinned), retain: true }));
  }

  async _checkRootIdentity(cid, root, signal) {
    const bytes = await this._readBlock(cid, signal);
    if (root.kind === 'manifest') {
      let canonical;
      try { canonical = encodeArtifactManifest(root.manifest); }
      catch { throw integrity('Artifact manifest metadata is invalid.'); }
      if (canonical.length !== bytes.length || canonical.some((byte, index) => byte !== bytes[index])) {
        throw integrity('Artifact manifest metadata differs from its verified root.');
      }
    }
    return bytes;
  }

  async _withRootVerification(cid, signal, callback) {
    return this._run(signal, async (activeSignal) => {
      const unlock = await acquireArtifactLock(`${this.lockName}:verify:${cid}`, 'exclusive', activeSignal, this.lockManager);
      try { return await callback(activeSignal); } finally { unlock(); }
    });
  }

  /** A full audit, optionally fetching missing CID blocks. Omitting fetchBlock
   * is strictly local recovery. Cancellation never revokes an earlier complete
   * checkpoint; only a proven missing block or integrity error does so.
   */
  async ensureLocal(input, { signal, fetchBlock, pin = true, kind, onProgress } = {}) {
    const cid = artifactCID(input).toString();
    if (onProgress !== undefined && typeof onProgress !== 'function') throw new TypeError('Artifact progress must be a function.');
    return this._withRootVerification(cid, signal,
      (activeSignal) => this._ensureLocal(cid, { signal: activeSignal, fetchBlock, pin, kind, onProgress }));
  }

  async _ensureLocal(cid, { signal: activeSignal, fetchBlock, pin, kind, onProgress }) {
    const previous = await this.backend.get('roots', cid);
    if (previous?.status === 'deleting') throw new Error('Artifact deletion is pending; finish deletion before importing this root.');
    let loaded = 0; let totalBytes = previous?.size || 0; let completedFiles = 0; let totalFiles = 1;
    let path = null; let lastProgress = -Infinity;
    const progress = (force = false) => {
      const now = performance.now();
      if (onProgress && (force || now - lastProgress >= 100)) {
        lastProgress = now;
        try { Promise.resolve(onProgress({ stage: 'verify', path, loaded, totalBytes, completedFiles, totalFiles })).catch(() => {}); }
        catch { /* Progress is advisory and cannot alter integrity or durability. */ }
      }
      throwIfAborted(activeSignal);
    };
    const onBytes = (count) => { loaded += count; progress(); };
    let observedDamage;
    const onMissing = (error) => { if (damaged(error)) observedDamage = error; };
    try {
      if (previous?.status !== 'complete') await this._writeRoot(cid, (current) => ({ ...current, cid,
        kind: kind || current?.kind || 'file', status: 'partial',
        pinned: Boolean(current?.pinned), retain: true }), activeSignal);
      // Network recovery needs a DAG download pass. Local verification streams
      // each file once; its range walker already verifies every CID block.
      if (fetchBlock) for await (const _ of this._walk([cid], { signal: activeSignal, fetchBlock, onMissing })) { /* Download missing blocks. */ }
      let manifest;
      const rootBytes = artifactCID(cid).code === 0x55 ? await this._readBlock(cid, activeSignal) : null;
      if (rootBytes && rootBytes.byteLength <= ARTIFACT_MANIFEST_MAXIMUM_BYTES) {
        let parsed;
        try { parsed = JSON.parse(new TextDecoder().decode(rootBytes)); } catch { /* Ordinary binary file. */ }
        if (parsed?.schema === ARTIFACT_MANIFEST_SCHEMA || kind === 'manifest') manifest = decodeArtifactManifest(rootBytes, { maximumFileBytes: this.maximumFileBytes });
      }
      if (kind === 'manifest' && !manifest) throw new TypeError('Manifest must be a bounded canonical JSON raw block.');
      if (manifest) {
        if (previous?.status !== 'complete') await this._writeRoot(cid, (current) => ({ ...current, kind: 'manifest', manifest, retain: true }), activeSignal);
        totalBytes = manifest.files.reduce((sum, file) => sum + file.size, 0); totalFiles = manifest.files.length;
        if (!Number.isSafeInteger(totalBytes)) throw new RangeError('Artifact verification byte count exceeds safe bounds.');
        progress(true);
        for (const file of manifest.files) {
          path = file.path;
          if (fetchBlock) for await (const _ of this._walk([file.cid], { signal: activeSignal, fetchBlock, onMissing })) { /* Resume missing blocks. */ }
          await this._recordVerifiedFile(file, activeSignal, onBytes);
          completedFiles++; progress(true);
        }
      }
      const verified = manifest ? { size: rootBytes.byteLength, manifest } : await this._verifyFile(cid, {}, activeSignal, onBytes);
      const result = await this._writeRoot(cid, (current) => ({ cid, kind: manifest ? 'manifest' : 'file', ...verified,
        status: 'complete', pinned: Boolean(pin || current?.pinned), retain: false }), activeSignal);
      observedDamage = undefined; // A repaired closure is now durably complete.
      totalBytes = loaded; completedFiles = totalFiles; path = null; progress(true);
      return result;
    } catch (error) { await this._invalidateRoot(cid, observedDamage || error); throw error; }
  }

  async stat(input, { signal, [RETENTION]: retention } = {}) {
    const cid = artifactCID(input).toString();
    return this._run(signal, () => this.backend.get('roots', cid), undefined, retention);
  }

  async getManifest(input, { signal, [RETENTION]: retention } = {}) {
    const cid = artifactCID(input).toString();
    return this._run(signal, async (activeSignal) => decodeArtifactManifest(await this._readBlock(cid, activeSignal),
      { maximumFileBytes: this.maximumFileBytes }), undefined, retention);
  }

  async *openRead(input, { offset = 0, length, signal } = {}) {
    integer(offset, 'offset', 0);
    if (length !== undefined) integer(length, 'length', 0);
    const operation = await this._begin(signal);
    try {
      const entry = await exporter(artifactCID(input).toString(), this._localBlocks(operation.signal));
      if (!['file', 'raw'].includes(entry.type)) throw new TypeError('Artifact root must identify a file.');
      const size = Number(entry.type === 'raw' ? entry.node.byteLength : entry.unixfs.fileSize());
      if (size > this.maximumFileBytes || offset > size || (length !== undefined && length > size - offset)) throw new RangeError('Artifact range exceeds file size.');
      if (length === 0 || offset === size) return;
      for await (const chunk of this._fileChunks(input, { size, offset, length, signal: operation.signal })) {
        throwIfAborted(operation.signal);
        operation.pause(); yield chunk; operation.resume();
      }
    } finally { operation.finish(); }
  }

  /** Idempotent retention, not a fresh audit. Complete retained records are
   * written only after verification; immutable blocks stay protected from GC.
   * Still verify the root and its manifest identity. Serving separately checks
   * the entire block closure, and ensureLocal explicitly audits file digests.
   */
  async pin(input, { signal } = {}) {
    const cid = artifactCID(input).toString();
    return this._withRootVerification(cid, signal, async (activeSignal) => {
      const root = await this.backend.get('roots', cid);
      if (root?.status !== 'complete' || (!root.pinned && !root.retain)) {
        return this._ensureLocal(cid, { signal: activeSignal, pin: true });
      }
      try {
        await this._checkRootIdentity(cid, root, activeSignal);
        if (root.pinned) return structuredClone(root);
        return this._writeRoot(cid, (current) => ({ ...current, pinned: true }), activeSignal);
      } catch (error) { await this._invalidateRoot(cid, error); throw error; }
    });
  }

  async unpin(input, { signal } = {}) {
    const cid = artifactCID(input).toString();
    return this._run(signal, (activeSignal) => this._writeRoot(cid, (previous) => {
      if (!previous) throw missing(cid);
      return { ...previous, pinned: false, retain: false };
    }, activeSignal));
  }

  /** Keep a multi-file import alive until its manifest owns the file closure.
   * Use the supplied scoped methods inside the callback, never the outer store's
   * locking methods. Child roots remain unpinned; this leaves no persistent pin
   * journal behind if an import is cancelled or the browser exits.
   */
  async withRetention(callback, { signal } = {}) {
    if (typeof callback !== 'function') throw new TypeError('Artifact retention requires a callback.');
    const operation = await this._begin(signal);
    const retention = { store: this, signal: operation.signal, held: true, accepting: true };
    const pending = new Set();
    const scoped = {};
    for (const method of ['stat', 'getManifest', 'importFile', 'importManifest']) {
      scoped[method] = (input, options = {}) => {
        if (!retention.accepting) return Promise.reject(new Error('Artifact retention scope is no longer active.'));
        if (pending.size >= 32) return Promise.reject(new Error('Artifact retention operation queue is full.'));
        const task = this[method](input, { ...options, [RETENTION]: retention });
        pending.add(task);
        task.finally(() => pending.delete(task)).catch(() => {});
        return task;
      };
    }
    scoped.getStats = () => this.getStats();
    Object.freeze(scoped);
    try {
      const result = await abortable(Promise.resolve().then(() => {
        throwIfAborted(operation.signal); return callback(scoped);
      }), operation.signal);
      retention.accepting = false;
      await Promise.all([...pending]);
      throwIfAborted(operation.signal);
      return result;
    } finally {
      retention.accepting = false;
      await Promise.allSettled([...pending]);
      retention.held = false; operation.finish();
    }
  }

  /** Hold one root across a resident model's on-demand range reads. The caller
   * signal cancels acquisition only; after grant, release must follow confirmed
   * worker unload. Store destruction also releases owned use leases.
   */
  async acquireUse(input, { signal } = {}) {
    const cid = artifactCID(input).toString();
    const operation = await this._begin(signal, 'none');
    let unlock;
    try {
      unlock = await acquireArtifactLock(`${this.lockName}:use:${cid}`, 'shared', operation.signal, this.lockManager);
      const root = await this.stat(cid, { signal: operation.signal });
      if (root?.status !== 'complete' || (!root.pinned && !root.retain)) {
        throw new Error('Artifact use requires a complete retained root.');
      }
      throwIfAborted(operation.signal);
      let released = false;
      const release = () => {
        if (released) return;
        released = true; this.controller.signal.removeEventListener('abort', release);
        unlock(); operation.finish();
      };
      this.controller.signal.addEventListener('abort', release, { once: true });
      if (this.controller.signal.aborted) { release(); throwIfAborted(this.controller.signal); }
      return release;
    } catch (error) { unlock?.(); operation.finish(); throw error; }
  }

  async *_entries(collection, keysOnly = false) {
    let after;
    while (true) {
      const batch = await this.backend.scan(collection, { after, limit: 16, keysOnly });
      if (!batch.length) return;
      for (const entry of batch) yield entry;
      after = batch.at(-1).key;
    }
  }

  async *list({ signal } = {}) {
    const operation = await this._begin(signal);
    try {
      for await (const row of this._entries('roots')) { throwIfAborted(operation.signal); operation.pause(); yield row.value; operation.resume(); }
    } finally { operation.finish(); }
  }

  /** Verified local DAG closure for an explicitly approved serving root.
   * Consumers must complete traversal successfully before publishing approval;
   * an error may follow a yielded prefix. This method never fetches remotely.
   */
  async *listBlockCids(input, { signal } = {}) {
    const cid = artifactCID(input).toString();
    const operation = await this._begin(signal);
    try {
      const root = await this.backend.get('roots', cid);
      if (root?.status !== 'complete') throw new Error('Artifact serving requires a complete local root.');
      await this._checkRootIdentity(cid, root, operation.signal);
      const roots = [cid, ...(root.manifest?.files || []).map((file) => file.cid)];
      for await (const key of this._walk(roots, { signal: operation.signal })) {
        operation.pause(); yield key; operation.resume();
      }
    } catch (error) { await this._invalidateRoot(cid, error); throw error; }
    finally { operation.finish(); }
  }

  async _collectGarbage(activeSignal, removeCid) {
      const before = await this.backend.getUsage('blocks');
      const cutoff = before.generation || 0;
      const marked = new Set();
      for await (const { value } of this._entries('roots')) {
        if (value.cid === removeCid) continue;
        if (!value.pinned && !value.retain) continue;
        const roots = [value.cid, ...(value.manifest?.files || []).map((file) => file.cid)];
        for await (const key of this._walk(roots, { signal: activeSignal, allowMissing: value.status !== 'complete' })) {
          marked.add(key);
          // Each DAG is still bounded by _walk. The union is bounded by the
          // actual exclusive-lock snapshot, not by one package's DAG budget.
          if (marked.size > before.entries) throw new RangeError('Artifact GC exceeds the stored block collection.');
        }
      }
      // Finish all reachability checks before changing the selected root. No
      // scratch writes are required to reclaim storage from a full database.
      const removedRoot = removeCid ? await this.backend.get('roots', removeCid) : null;
      const retainedByOtherRoot = Boolean(removeCid && marked.has(removeCid));
      if (removedRoot) {
        if (retainedByOtherRoot) {
          // A root can also be a file in another package. Preserve its verified
          // file descriptor; deleting a manifest must not retain its child pins.
          const record = removedRoot.kind === 'manifest' ? {
            cid: removeCid, kind: 'file', size: removedRoot.size,
            sha256: hex(artifactCID(removeCid).multihash.digest), status: removedRoot.status,
            pinned: false, retain: false
          } : { ...removedRoot, pinned: false, retain: false };
          await this._writeRoot(removeCid, () => record, activeSignal);
        } else {
          // Keep a durable retry row if sweeping fails or the page exits. Drop
          // optional retention/profile fields so replacing a complete record
          // does not need extra logical metadata capacity in a full database.
          const tombstone = { ...removedRoot, pinned: false, status: 'deleting' };
          delete tombstone.retain; delete tombstone.profile;
          await this._writeRoot(removeCid, () => tombstone, activeSignal);
        }
      }
      let deletedBlocks = 0;
      for await (const { key, generation } of this._entries('blocks', true)) {
        throwIfAborted(activeSignal);
        if (generation <= cutoff && !marked.has(key) && await this.backend.delete('blocks', key)) deletedBlocks++;
      }
      for await (const { key, value } of this._entries('roots')) {
        if (!value.pinned && !value.retain && !marked.has(key)) await this.backend.delete('roots', key);
      }
      this.usage = await this.backend.getUsage('blocks');
      this.rootUsage = await this.backend.getUsage('roots');
      return { deletedBlocks, freedBytes: before.bytes - this.usage.bytes,
        storedBytes: this.usage.bytes, blockCount: this.usage.entries,
        ...(removeCid ? { cid: removeCid, removed: Boolean(removedRoot), retainedByOtherRoot } : {}) };
  }

  async gc({ signal } = {}) {
    return this._run(signal, (activeSignal) => this._collectGarbage(activeSignal), 'exclusive');
  }

  /** Forget one explicit root and reclaim only unreachable blocks. Callers own
   * network withdrawal and resident-worker teardown before invoking this.
   * Interrupted sweeping leaves a non-pinned `deleting` catalog row for retry;
   * repeating remove, including for an absent root, safely resumes collection.
   */
  async remove(input, { signal, useWaitMs = 1000 } = {}) {
    const cid = artifactCID(input).toString();
    integer(useWaitMs, 'useWaitMs');
    if (useWaitMs > 30000) throw new RangeError('Artifact use wait exceeds limit.');
    await this.open();
    const busy = new AbortController();
    const timer = setTimeout(() => busy.abort(Object.assign(new Error('This model is in use in another session. Unload it before deleting.'),
      { code: 'ERR_ARTIFACT_IN_USE' })), useWaitMs);
    timer.unref?.();
    let unlock;
    try {
      unlock = await acquireArtifactLock(`${this.lockName}:use:${cid}`, 'exclusive',
        AbortSignal.any([busy.signal, this.controller.signal, ...(signal ? [signal] : [])]), this.lockManager);
    } finally { clearTimeout(timer); }
    try {
      return await this._run(signal, async (activeSignal) => {
        try { return await this._collectGarbage(activeSignal, cid); }
        finally {
          this.usage = await this.backend.getUsage('blocks');
          this.rootUsage = await this.backend.getUsage('roots');
        }
      }, 'exclusive');
    } finally { unlock(); }
  }

  getStats() {
    return Object.freeze({ name: this.name, isOpen: this.isOpen, persistent: this.persistent,
      storedBytes: this.usage.bytes, blockCount: this.usage.entries, rootCount: this.rootUsage.entries,
      maximumBytes: this.maximumBytes, maximumStoredBlocks: this.maximumStoredBlocks,
      capacity: this.capacity, pending: this.operations.size });
  }

  getBlockstore() { return this.blockstore; }
  getDatastore() { return this.datastore; }

  _createBlockstore() {
    const store = this;
    const facade = {
      open: async () => {}, close: async () => {}, start: async () => {}, stop: async () => {},
      async *get(cid, { signal } = {}) {
        const operation = await store._begin(signal, 'none');
        try { const bytes = await store._readBlock(cid, operation.signal); operation.pause(); yield bytes; operation.resume(); } finally { operation.finish(); }
      },
      // These immutable, atomic block operations must not reacquire the outer
      // file read lock: a queued GC writer would deadlock a Helia fetch inside
      // ensureLocal. GC snapshots insertion generations and skips new blocks.
      put: (cid, bytes, { signal } = {}) => store._run(signal, (activeSignal) => store._putBlock(cid, bytes, activeSignal), 'none'),
      has: (cid, { signal } = {}) => store._run(signal, async () => (await store.backend.get('blocks', artifactCID(cid).toString())) !== undefined, 'none'),
      // GC has to honor StateManager pins/read leases; Helia must not delete its
      // borrowed blocks independently. Use ArtifactStore.gc() explicitly.
      delete: async () => { throw new Error('Artifact blocks can only be removed through StateManager garbage collection.'); },
      async *getAll({ signal } = {}) {
        const operation = await store._begin(signal);
        try {
          for await (const { key } of store._entries('blocks', true)) {
            throwIfAborted(operation.signal);
            operation.pause(); yield { cid: artifactCID(key), bytes: facade.get(key, { signal: operation.signal }) }; operation.resume();
          }
        } finally { operation.finish(); }
      }
    };
    facade.putMany = async function* (source, options) { for await (const { cid, bytes } of source) yield await facade.put(cid, bytes, options); };
    facade.getMany = async function* (source, options) { for await (const cid of source) yield { cid, bytes: facade.get(cid, options) }; };
    facade.deleteMany = async function* () { throw new Error('Use ArtifactStore.gc() to remove blocks.'); };
    return facade;
  }

  _createDatastore() {
    const store = this;
    const keyString = (key) => {
      const value = key.toString();
      if (value.length > 2048) throw new RangeError('Datastore key exceeds limit.');
      return value;
    };
    const facade = {
      open: async () => {}, close: async () => {}, start: async () => {}, stop: async () => {},
      get: (key, { signal } = {}) => store._run(signal, async () => {
        const value = await store.backend.get('routing', keyString(key));
        if (value === undefined) throw missing(key);
        return value;
      }, 'none'),
      has: (key, { signal } = {}) => store._run(signal, async () => (await store.backend.get('routing', keyString(key))) !== undefined, 'none'),
      put: (key, value, { signal } = {}) => store._run(signal, async (activeSignal) => {
        throwIfAborted(activeSignal);
        if (!(value instanceof Uint8Array) || value.byteLength > ARTIFACT_MANIFEST_MAXIMUM_BYTES) throw new RangeError('Datastore value exceeds limit.');
        await store.backend.put('routing', keyString(key), value, { maximumBytes: store.maximumRoutingBytes, maximumEntries: 4096 });
        return key;
      }, 'none'),
      delete: (key, { signal } = {}) => store._run(signal, async () => { await store.backend.delete('routing', keyString(key)); }, 'none'),
      query: (query = {}, options = {}) => store._queryDatastore(query, options, false),
      queryKeys: (query = {}, options = {}) => store._queryDatastore(query, options, true),
      batch: () => {
        const actions = [];
        let bytes = 0;
        const add = (key, value) => {
          if (actions.length >= 4096 || (bytes += value?.byteLength || 0) > store.maximumRoutingBytes) throw new RangeError('Datastore batch exceeds limit.');
          actions.push({ key, value: value?.slice() });
        };
        return { put: (key, value) => add(key, value), delete: (key) => add(key),
          commit: async (options) => {
            for (const { key, value } of actions) {
              if (value === undefined) await facade.delete(key, options); else await facade.put(key, value, options);
            }
            actions.length = 0;
          } };
      }
    };
    facade.putMany = async function* (source, options) { for await (const pair of source) { await facade.put(pair.key, pair.value, options); yield pair; } };
    facade.getMany = async function* (source, options) { for await (const key of source) yield { key, value: await facade.get(key, options) }; };
    facade.deleteMany = async function* (source, options) { for await (const key of source) { await facade.delete(key, options); yield key; } };
    return facade;
  }

  async *_queryDatastore(query, { signal } = {}, keysOnly) {
    const operation = await this._begin(signal, 'none');
    try {
      const selected = [];
      let skipped = 0; let emitted = 0;
      const offset = integer(query.offset ?? 0, 'query offset', 0);
      const limit = integer(query.limit ?? 4096, 'query limit', 0);
      for await (const row of this._entries('routing', keysOnly)) {
        throwIfAborted(operation.signal);
        if (query.prefix && !row.key.startsWith(query.prefix)) continue;
        const key = new Key(row.key);
        const item = keysOnly ? key : { key, value: row.value };
        if (query.filters?.some((filter) => !filter(item))) continue;
        if (query.orders?.length) selected.push(item);
        else if (skipped++ >= offset && emitted < limit) { emitted++; operation.pause(); yield item; operation.resume(); }
        if (!query.orders?.length && emitted >= limit) return;
      }
      if (query.orders?.length) {
        selected.sort((a, b) => { for (const order of query.orders) { const result = order(a, b); if (result) return result; } return 0; });
        for (const item of selected.slice(offset, offset + limit)) { operation.pause(); yield item; operation.resume(); }
      }
    } finally { operation.finish(); }
  }

  async destroy() {
    if (this.destroying) return this.destroying;
    this.destroyed = true;
    this.controller.abort(new DOMException('Artifact store destroyed.', 'AbortError'));
    this.destroying = (async () => {
      try {
        await this.opening?.catch(() => {});
        await Promise.allSettled([...this.operations].map((operation) => operation.settled));
        if (this.ownsBackend) await this.backend.close();
      } finally { this.isOpen = false; this.onDestroy?.(this); }
    })();
    return this.destroying;
  }
}

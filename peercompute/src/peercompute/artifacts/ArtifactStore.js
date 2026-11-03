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
function integer(value, name, minimum = 1) {
  if (!Number.isSafeInteger(value) || value < minimum) throw new RangeError(`Invalid ${name}.`);
  return value;
}
function missing(cid) {
  const error = new Error(`Artifact block not found: ${cid}`);
  error.name = 'NotFoundError'; error.code = 'ERR_NOT_FOUND';
  return error;
}
function abortable(promise, signal) {
  if (!signal) return promise;
  throwIfAborted(signal);
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
    maximumBytes = 2 * 1024 ** 3, maximumBlockBytes = 2 * 1024 ** 2,
    maximumFileBytes = ARTIFACT_MAXIMUM_FILE_BYTES, maximumTraversalBlocks = 65536,
    maximumRoots = 1024, maximumRoutingBytes = 16 * 1024 ** 2,
    maximumConcurrentBlockWrites = 4, maximumQueuedBlockWrites = 16,
    lockManager = globalThis.navigator?.locks, onDestroy, indexedDBImpl, keyRange } = {}) {
    if (typeof name !== 'string' || !/^[\w.-]{1,80}$/u.test(name)) throw new TypeError('Invalid artifact store name.');
    this.name = name;
    this.persistent = persistent;
    this.backend = backend || (persistent ? new IndexedDBArtifactBackend({ name, indexedDBImpl, keyRange })
      : new MemoryArtifactBackend({ name }));
    this.ownsBackend = ownsBackend;
    this.maximumBytes = integer(maximumBytes, 'maximumBytes');
    this.maximumBlockBytes = integer(maximumBlockBytes, 'maximumBlockBytes');
    this.maximumFileBytes = integer(maximumFileBytes, 'maximumFileBytes');
    this.maximumTraversalBlocks = integer(maximumTraversalBlocks, 'maximumTraversalBlocks');
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

  async _run(signal, callback, mode) {
    const operation = await this._begin(signal, mode);
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
      await this.backend.put('roots', cid, record, { maximumEntries: this.maximumRoots,
        maximumBytes: this.maximumRoots * (ARTIFACT_MANIFEST_MAXIMUM_BYTES + 2048) });
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
    if (!CID.createV1(cid.code, digest).equals(cid)) throw new Error('Artifact block CID verification failed.');
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
      { maximumBytes: this.maximumBytes, maximumEntries: this.maximumTraversalBlocks });
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

  async importFile(source, { signal, expectedSize, expectedSha256, pin = true } = {}) {
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
    });
  }

  async importManifest(input, { signal, pin = true } = {}) {
    const manifest = normalizeArtifactManifest(input, { maximumFileBytes: this.maximumFileBytes });
    const bytes = encodeArtifactManifest(manifest);
    return this._run(signal, async (activeSignal) => {
      for (const file of manifest.files) await this._recordVerifiedFile(file, activeSignal);
      const cid = CID.createV1(0x55, await multihashSha256.digest(bytes));
      await this._putBlock(cid, bytes, activeSignal);
      return this._writeRoot(cid.toString(), (previous) => ({ cid: cid.toString(), kind: 'manifest',
        size: bytes.byteLength, manifest, status: 'complete', pinned: Boolean(pin || previous?.pinned),
        retain: false }), activeSignal);
    });
  }

  async _verifyFile(cid, expected = {}, signal) {
    const entry = await exporter(artifactCID(cid).toString(), this._localBlocks(signal));
    if (!['file', 'raw'].includes(entry.type)) throw new TypeError('Artifact root must identify a file.');
    const size = Number(entry.type === 'raw' ? entry.node.byteLength : entry.unixfs.fileSize());
    if (!Number.isSafeInteger(size) || size > this.maximumFileBytes || (expected.size !== undefined && size !== expected.size)) {
      throw new RangeError('Artifact file size differs from its manifest or limit.');
    }
    const hash = sha256.create();
    let read = 0;
    for await (const chunk of this._fileChunks(cid, { size, signal })) {
      throwIfAborted(signal); read += chunk.byteLength;
      if (read > size) throw new RangeError('Artifact content exceeds declared size.');
      hash.update(chunk);
    }
    const digest = hex(hash.digest());
    if (read !== size || (expected.sha256 !== undefined && digest !== expected.sha256)) {
      throw new Error('Artifact file integrity differs from its manifest.');
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
        if (bytes.byteLength !== frame.size) throw new Error('Raw file block size differs from its UnixFS link.');
        const part = bytes.subarray(Math.max(0, offset - frame.start), Math.min(bytes.length, end - frame.start));
        if (part.length) { emitted += part.length; yield part; }
        continue;
      }
      const node = dagPb.decode(bytes);
      if (!node.Data) throw new Error('UnixFS file node has no metadata.');
      const file = UnixFS.unmarshal(node.Data);
      const declaredSize = UnixFSNode.decode(bytes).data?.fileSize;
      if (!['file', 'raw'].includes(file.type) || node.Links.length !== file.blockSizes.length
          || Number(file.fileSize()) !== frame.size
          || (declaredSize !== undefined && declaredSize !== BigInt(frame.size))) throw new Error('UnixFS file metadata is inconsistent.');
      const data = file.data || new Uint8Array();
      let position = frame.start + data.length;
      const children = [];
      for (let i = 0; i < node.Links.length; i++) {
        const childSize = Number(file.blockSizes[i]);
        if (!Number.isSafeInteger(childSize) || childSize < 0) throw new RangeError('Invalid UnixFS child size.');
        const childCid = artifactCID(node.Links[i].Hash);
        const dagSize = node.Links[i].Tsize;
        if (dagSize !== undefined && (!Number.isSafeInteger(dagSize) || dagSize < childSize
            || (childCid.code === 0x55 && dagSize !== childSize))) throw new Error('Invalid UnixFS link DAG size.');
        if (position < end && position + childSize > offset) {
          children.push({ cid: childCid, start: position, size: childSize, depth: frame.depth + 1 });
        }
        position += childSize;
        if (!Number.isSafeInteger(position)) throw new RangeError('Invalid UnixFS file extent.');
      }
      if (position !== frame.start + frame.size) throw new Error('UnixFS child sizes differ from their parent.');
      if (pending.length + children.length > this.maximumTraversalBlocks) throw new RangeError('UnixFS pending traversal exceeds limit.');
      for (let i = children.length - 1; i >= 0; i--) pending.push(children[i]);
      if (data.length && frame.start < end && frame.start + data.length > offset) {
        const part = data.subarray(Math.max(0, offset - frame.start), Math.min(data.length, end - frame.start));
        emitted += part.length; yield part;
      }
    }
    if (emitted !== length) throw new Error('UnixFS read did not produce the requested number of bytes.');
  }

  async _recordVerifiedFile(file, signal) {
    const verified = await this._verifyFile(file.cid, file, signal);
    return this._writeRoot(file.cid, (previous) => ({ ...previous, cid: file.cid,
      kind: 'file', ...verified, status: 'complete', pinned: Boolean(previous?.pinned), retain: false }), signal);
  }

  async *_walk(roots, { signal, fetchBlock, allowMissing = false } = {}) {
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

  async ensureLocal(input, { signal, fetchBlock, pin = true, kind } = {}) {
    const cid = artifactCID(input).toString();
    return this._run(signal, async (activeSignal) => {
      await this._writeRoot(cid, (previous) => ({ ...previous, cid,
        kind: kind || previous?.kind || 'file', status: 'partial',
        pinned: Boolean(previous?.pinned), retain: true }), activeSignal);
      for await (const _ of this._walk([cid], { signal: activeSignal, fetchBlock })) { /* Verified persistent blocks. */ }
      let manifest;
      const rootBytes = artifactCID(cid).code === 0x55 ? await this._readBlock(cid, activeSignal) : null;
      if (rootBytes && rootBytes.byteLength <= ARTIFACT_MANIFEST_MAXIMUM_BYTES) {
        let parsed;
        try { parsed = JSON.parse(new TextDecoder().decode(rootBytes)); } catch { /* Ordinary binary file. */ }
        if (parsed?.schema === ARTIFACT_MANIFEST_SCHEMA || kind === 'manifest') manifest = decodeArtifactManifest(rootBytes, { maximumFileBytes: this.maximumFileBytes });
      }
      if (kind === 'manifest' && !manifest) throw new TypeError('Manifest must be a bounded canonical JSON raw block.');
      if (manifest) {
        await this._writeRoot(cid, (previous) => ({ ...previous, kind: 'manifest', manifest, retain: true }), activeSignal);
        for (const file of manifest.files) {
          for await (const _ of this._walk([file.cid], { signal: activeSignal, fetchBlock })) { /* Resume only missing blocks. */ }
          await this._recordVerifiedFile(file, activeSignal);
        }
      }
      const verified = manifest ? { size: rootBytes.byteLength, manifest } : await this._verifyFile(cid, {}, activeSignal);
      return this._writeRoot(cid, (previous) => ({ cid, kind: manifest ? 'manifest' : 'file', ...verified,
        status: 'complete', pinned: Boolean(pin || previous?.pinned), retain: false }), activeSignal);
    });
  }

  async stat(input, { signal } = {}) {
    const cid = artifactCID(input).toString();
    return this._run(signal, () => this.backend.get('roots', cid));
  }

  async getManifest(input, { signal } = {}) {
    const cid = artifactCID(input).toString();
    return this._run(signal, async (activeSignal) => decodeArtifactManifest(await this._readBlock(cid, activeSignal),
      { maximumFileBytes: this.maximumFileBytes }));
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

  async pin(input, { signal } = {}) { return this.ensureLocal(input, { signal, pin: true }); }

  async unpin(input, { signal } = {}) {
    const cid = artifactCID(input).toString();
    return this._run(signal, (activeSignal) => this._writeRoot(cid, (previous) => {
      if (!previous) throw missing(cid);
      return { ...previous, pinned: false, retain: false };
    }, activeSignal));
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
      const roots = [cid, ...(root.manifest?.files || []).map((file) => file.cid)];
      for await (const key of this._walk(roots, { signal: operation.signal })) {
        operation.pause(); yield key; operation.resume();
      }
    } finally { operation.finish(); }
  }

  async gc({ signal } = {}) {
    return this._run(signal, async (activeSignal) => {
      const cutoff = (await this.backend.getUsage('blocks')).generation || 0;
      const marked = new Set();
      for await (const { value } of this._entries('roots')) {
        if (!value.pinned && !value.retain) continue;
        const roots = [value.cid, ...(value.manifest?.files || []).map((file) => file.cid)];
        for await (const key of this._walk(roots, { signal: activeSignal, allowMissing: value.status !== 'complete' })) {
          marked.add(key);
          if (marked.size > this.maximumTraversalBlocks) throw new RangeError('Artifact GC exceeds block limit.');
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
      return { deletedBlocks, storedBytes: this.usage.bytes, blockCount: this.usage.entries };
    }, 'exclusive');
  }

  getStats() {
    return Object.freeze({ name: this.name, isOpen: this.isOpen, persistent: this.persistent,
      storedBytes: this.usage.bytes, blockCount: this.usage.entries, rootCount: this.rootUsage.entries,
      maximumBytes: this.maximumBytes, pending: this.operations.size });
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

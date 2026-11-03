// Node-only backend. Do not export this module from the browser entry point.
// One exclusive directory lock admits one process/handle. Each atomic record
// contains its own accounting metadata; reopening rebuilds counters by reading
// bounded headers, never all model bytes. Stale locks are deliberately not stolen.
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, open, opendir, realpath, rename, unlink, lstat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const collections = ['blocks', 'roots', 'routing'];
const headerLimit = 16 * 1024;
const emptyUsage = () => ({ bytes: 0, entries: 0, generation: 0 });
const filename = (key) => `${createHash('sha256').update(key).digest('hex')}.record`;

export class FileSystemArtifactBackend {
  constructor({ directory, maximumRecordBytes = 4 * 1024 ** 2, maximumIndexEntries = 131072 } = {}) {
    if (typeof directory !== 'string' || !directory) throw new TypeError('Filesystem artifacts require a directory.');
    for (const value of [maximumRecordBytes, maximumIndexEntries]) {
      if (!Number.isSafeInteger(value) || value < 1) throw new RangeError('Invalid filesystem artifact bound.');
    }
    this.directory = resolve(directory);
    this.name = `filesystem:${this.directory}`;
    this.maximumRecordBytes = maximumRecordBytes;
    this.maximumIndexEntries = maximumIndexEntries;
    this.supportsExclusiveAccess = true;
    this.hasExclusiveLock = false;
    this.index = new Map(collections.map((collection) => [collection, new Map()]));
    this.usage = new Map(collections.map((collection) => [collection, emptyUsage()]));
    this.mutations = Promise.resolve();
    this.isOpen = false;
  }

  async open() {
    if (this.isOpen) return;
    if (this.opening) return this.opening;
    if (this.closing) throw new Error('Filesystem artifact backend is closing.');
    this.opening = this._open();
    try { await this.opening; } finally { this.opening = null; }
  }

  async _open() {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    this.directory = await realpath(this.directory);
    this.name = `filesystem:${this.directory}`;
    this.lockPath = join(this.directory, '.peercompute-artifacts.lock');
    try { this.lockHandle = await open(this.lockPath, 'wx', 0o600); }
    catch (error) {
      if (error.code === 'EEXIST') throw new Error(`Artifact directory is exclusively locked: ${this.lockPath}. Stop its owner before inspecting a possibly stale lock.`);
      throw error;
    }
    this.hasExclusiveLock = true;
    try {
      this.lockIdentity = await this.lockHandle.stat();
      await this.lockHandle.writeFile(JSON.stringify({ pid: process.pid, token: randomUUID(), createdAt: new Date().toISOString() }));
      await this.lockHandle.sync();
      let count = 0;
      for (const collection of collections) {
        this.index.get(collection).clear();
        this.usage.set(collection, emptyUsage());
        await mkdir(join(this.directory, collection), { recursive: true, mode: 0o700 });
        const entries = await opendir(join(this.directory, collection));
        for await (const entry of entries) {
          if (entry.name.startsWith('.tmp-')) continue; // Interrupted, uncommitted writes are never admitted.
          if (!entry.isFile() || !/^[a-f0-9]{64}\.record$/u.test(entry.name)) throw new Error('Unexpected file in artifact collection.');
          const handle = await open(join(this.directory, collection, entry.name), 'r');
          let header;
          try { header = await this._header(handle, collection, entry.name); } finally { await handle.close(); }
          if (++count > this.maximumIndexEntries) throw new RangeError('Filesystem artifact index exceeds entry limit.');
          this.index.get(collection).set(header.key, { size: header.size, generation: header.generation });
          const usage = this.usage.get(collection);
          usage.entries++;
          usage.bytes += header.size;
          usage.generation = Math.max(usage.generation, header.generation);
          if (!Number.isSafeInteger(usage.bytes)) throw new RangeError('Filesystem artifact accounting exceeds safe integer range.');
        }
      }
      this.isOpen = true;
    } catch (error) {
      await this._releaseLock();
      throw error;
    }
  }

  _assertOpen(collection) {
    if (!this.isOpen || !this.hasExclusiveLock || this.closing) throw new Error('Filesystem artifact backend is closed.');
    if (!collections.includes(collection)) throw new TypeError('Unknown artifact collection.');
  }

  _key(key) {
    if (typeof key !== 'string' || !key || key.length > 2048) throw new TypeError('Invalid artifact record key.');
    return key;
  }

  async _header(handle, collection, name) {
    const buffer = Buffer.alloc(headerLimit);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    const newline = buffer.subarray(0, bytesRead).indexOf(10);
    if (newline < 0) throw new Error('Artifact record has no bounded header.');
    const header = JSON.parse(buffer.subarray(0, newline).toString('utf8'));
    this._key(header.key);
    if (header.version !== 1 || header.collection !== collection || filename(header.key) !== name
        || !Number.isSafeInteger(header.size) || header.size < 0 || header.size > this.maximumRecordBytes
        || !Number.isSafeInteger(header.generation) || header.generation < 1) {
      throw new Error('Artifact record header is invalid.');
    }
    const stat = await handle.stat();
    if (stat.size !== newline + 1 + header.size) throw new Error('Artifact record length differs from its header.');
    return { ...header, offset: newline + 1 };
  }

  async _read(collection, key) {
    const name = filename(key);
    let handle;
    try { handle = await open(join(this.directory, collection, name), 'r'); }
    catch (error) { if (error.code === 'ENOENT') return undefined; throw error; }
    try {
      const header = await this._header(handle, collection, name);
      const value = new Uint8Array(header.size);
      let offset = 0;
      while (offset < value.byteLength) {
        const { bytesRead } = await handle.read(value, offset, value.byteLength - offset, header.offset + offset);
        if (!bytesRead) throw new Error('Artifact record truncated while reading.');
        offset += bytesRead;
      }
      return collection === 'roots' ? JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(value)) : value;
    } finally { await handle.close(); }
  }

  async get(collection, key) {
    this._assertOpen(collection);
    this._key(key);
    if (!this.index.get(collection).has(key)) return undefined;
    return this._read(collection, key);
  }

  async getUsage(collection) {
    this._assertOpen(collection);
    return { ...this.usage.get(collection) };
  }

  _mutate(collection, callback) {
    this._assertOpen(collection);
    const result = this.mutations.then(callback);
    this.mutations = result.catch(() => {});
    return result;
  }

  async _syncDirectory(collection) {
    const handle = await open(join(this.directory, collection), 'r');
    try { await handle.sync(); } finally { await handle.close(); }
  }

  async put(collection, key, value, { maximumBytes = Number.MAX_SAFE_INTEGER,
    maximumEntries = Number.MAX_SAFE_INTEGER } = {}) {
    this._key(key);
    // Snapshot before queueing so the caller cannot mutate bytes during an await.
    const bytes = collection === 'roots' ? Buffer.from(JSON.stringify(value))
      : value instanceof Uint8Array ? Buffer.from(value) : null;
    if (!bytes || bytes.byteLength > this.maximumRecordBytes) throw new RangeError('Filesystem artifact record exceeds byte limit.');
    return this._mutate(collection, async () => {
      const index = this.index.get(collection);
      const old = index.get(key);
      if (collection === 'blocks' && old) return false;
      const usage = this.usage.get(collection);
      const next = { bytes: usage.bytes - (old?.size || 0) + bytes.byteLength,
        entries: usage.entries + (old ? 0 : 1), generation: usage.generation + 1 };
      const totalEntries = [...this.index.values()].reduce((total, items) => total + items.size, 0) + (old ? 0 : 1);
      if (next.bytes > maximumBytes || next.entries > maximumEntries || totalEntries > this.maximumIndexEntries) {
        throw new DOMException('Artifact storage quota exceeded.', 'QuotaExceededError');
      }
      if (!Number.isSafeInteger(next.generation)) throw new RangeError('Artifact generation exceeds safe integer range.');
      const header = Buffer.from(`${JSON.stringify({ version: 1, collection, key, size: bytes.byteLength, generation: next.generation })}\n`);
      if (header.byteLength > headerLimit) throw new RangeError('Artifact record header exceeds byte limit.');
      const temporary = join(this.directory, collection, `.tmp-${randomUUID()}`);
      let handle;
      try {
        handle = await open(temporary, 'wx', 0o600);
        for (const part of [header, bytes]) {
          let offset = 0;
          while (offset < part.byteLength) {
            const { bytesWritten } = await handle.write(part, offset, part.byteLength - offset);
            if (!bytesWritten) throw new Error('Artifact record write made no progress.');
            offset += bytesWritten;
          }
        }
        await handle.sync();
        await handle.close(); handle = null;
        await rename(temporary, join(this.directory, collection, filename(key)));
        index.set(key, { size: bytes.byteLength, generation: next.generation });
        this.usage.set(collection, next);
        await this._syncDirectory(collection);
        return true;
      } finally {
        await handle?.close();
        await unlink(temporary).catch((error) => { if (error.code !== 'ENOENT') throw error; });
      }
    });
  }

  async delete(collection, key) {
    this._key(key);
    return this._mutate(collection, async () => {
      const index = this.index.get(collection);
      const old = index.get(key);
      if (!old) return false;
      await unlink(join(this.directory, collection, filename(key)));
      index.delete(key);
      const usage = this.usage.get(collection);
      this.usage.set(collection, { ...usage, bytes: usage.bytes - old.size, entries: usage.entries - 1 });
      await this._syncDirectory(collection);
      return true;
    });
  }

  async scan(collection, { after, limit = 16, keysOnly = false } = {}) {
    this._assertOpen(collection);
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1024) throw new RangeError('Invalid artifact scan batch size.');
    // Only the explicitly bounded metadata index is sorted; block bytes remain
    // on disk. The requested batch is the only payload materialized.
    const keys = [...this.index.get(collection).keys()].filter((key) => after === undefined || key > after).sort().slice(0, limit);
    const result = [];
    for (const key of keys) {
      const entry = this.index.get(collection).get(key);
      if (!entry) continue;
      if (keysOnly) result.push({ key, generation: entry.generation });
      else {
        const value = await this._read(collection, key);
        if (value !== undefined) result.push({ key, generation: entry.generation, value });
      }
    }
    return result;
  }

  async _releaseLock() {
    if (!this.lockHandle) return;
    const handle = this.lockHandle;
    this.lockHandle = null;
    this.hasExclusiveLock = false;
    try {
      const current = await lstat(this.lockPath);
      if (current.ino !== this.lockIdentity?.ino || current.dev !== this.lockIdentity?.dev) {
        throw new Error('Artifact lock changed ownership; refusing to remove it.');
      }
      await unlink(this.lockPath);
    } finally { await handle.close(); }
  }

  async close() {
    if (this.closing) return this.closing;
    this.closing = (async () => {
      await this.opening?.catch(() => {});
      await this.mutations;
      this.isOpen = false;
      await this._releaseLock();
    })();
    return this.closing;
  }
}

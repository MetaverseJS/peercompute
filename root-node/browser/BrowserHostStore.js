import { generateKeyPair, privateKeyFromProtobuf, privateKeyToProtobuf } from '@libp2p/crypto/keys';
import { peerIdFromPrivateKey } from '@libp2p/peer-id';

export function hostInstallationId(value = 'default') {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/.test(value)) {
    throw new TypeError('installationId must contain 1–80 letters, digits, dots, underscores or hyphens');
  }
  return value;
}

const requestResult = request => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

/** Installation-private data. Never enters the shared Y.Doc or peer advertisements. */
export class BrowserHostStore {
  constructor({ installationId = 'default', indexedDBImpl = globalThis.indexedDB } = {}) {
    this.installationId = hostInstallationId(installationId);
    this.databaseName = `peercompute-root-host-v1-${this.installationId}`;
    this.indexedDB = indexedDBImpl;
    this.transactions = new Set();
    this.persistent = true;
  }

  async open() {
    if (this.closed || this.closing) throw new Error('Host storage is closed');
    if (this.database) return this;
    if (this.opening) return this.opening;
    if (!this.indexedDB?.open) throw new Error('Root identity requires persistent IndexedDB');
    this.opening = new Promise((resolve, reject) => {
      const request = this.indexedDB.open(this.databaseName, 1);
      let failed = false;
      request.onupgradeneeded = () => {
        request.result.createObjectStore('metadata');
        request.result.createObjectStore('markers');
      };
      request.onerror = () => { failed = true; reject(request.error); };
      request.onblocked = () => { failed = true; reject(new Error('Host database upgrade is blocked by another tab')); };
      request.onsuccess = () => {
        if (failed) { request.result.close(); return; }
        this.database = request.result;
        this.database.onversionchange = () => {
          this.database.close(); this.database = null; this.closed = true;
        };
        resolve(this);
      };
    });
    try { return await this.opening; } finally { this.opening = null; }
  }

  async _transaction(collection, mode, operation) {
    if (!this.database || this.closed || this.closing) throw new Error('Host storage is unavailable');
    const transaction = this.database.transaction(collection, mode, { durability: 'strict' });
    const completed = new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onabort = () => reject(transaction.error ?? new Error('Host transaction aborted'));
      transaction.onerror = () => {};
    });
    this.transactions.add(completed); completed.catch(() => {});
    try {
      const result = await operation(transaction.objectStore(collection));
      await completed;
      return result === undefined ? undefined : structuredClone(result);
    } catch (error) {
      try { transaction.abort(); } catch { /* A committed write stays committed. */ }
      await completed.catch(() => {});
      throw error;
    } finally { this.transactions.delete(completed); }
  }

  async loadIdentity() {
    await this.open();
    let record = await this._transaction('metadata', 'readonly', store => requestResult(store.get('identity')));
    if (record === undefined) {
      // Generate before opening the write transaction. The subsequent read/add
      // is atomic even when two tabs both observed a missing record.
      const key = await generateKeyPair('Ed25519');
      const candidate = { schema: 'peercompute.host-identity.v1', privateKey: privateKeyToProtobuf(key),
        peerId: peerIdFromPrivateKey(key).toString(), createdAt: Date.now() };
      record = await this._transaction('metadata', 'readwrite', async store => {
        const existing = await requestResult(store.get('identity'));
        if (existing !== undefined) return existing;
        await requestResult(store.add(candidate, 'identity'));
        return candidate;
      });
    }
    if (record?.schema !== 'peercompute.host-identity.v1' || !(record.privateKey instanceof Uint8Array)) {
      throw new Error('Stored host identity is invalid; refusing to replace it');
    }
    const privateKey = privateKeyFromProtobuf(record.privateKey);
    const peerId = peerIdFromPrivateKey(privateKey).toString();
    if (peerId !== record.peerId) throw new Error('Stored host identity does not match its peer ID');
    return { privateKey, peerId, createdAt: record.createdAt };
  }

  async writeMarker({ key, value }) {
    this._markerKey(key);
    const json = JSON.stringify(value);
    if (json === undefined || new TextEncoder().encode(json).byteLength > 16384) {
      throw new TypeError('Host marker must be JSON data of at most 16 KiB');
    }
    const record = { value: JSON.parse(json), updatedAt: Date.now() };
    return this._transaction('markers', 'readwrite', async store => {
      const existing = await requestResult(store.getKey(key));
      if (existing === undefined && await requestResult(store.count()) >= 128) throw new Error('Host marker capacity reached');
      await requestResult(store.put(record, key));
      return { key, ...record };
    });
  }

  async readMarker(key) {
    this._markerKey(key);
    const record = await this._transaction('markers', 'readonly', store => requestResult(store.get(key)));
    return record === undefined ? null : { key, ...record };
  }

  _markerKey(key) {
    if (typeof key !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/.test(key)) throw new TypeError('Invalid host marker key');
  }

  async close() {
    if (this.closing) return this.closing;
    this.closing = (async () => {
      await this.opening?.catch(() => {});
      await Promise.allSettled([...this.transactions]);
      this.database?.close(); this.database = null; this.closed = true;
    })();
    return this.closing;
  }
}

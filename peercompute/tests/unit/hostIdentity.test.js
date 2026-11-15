import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { generateKeyPair, privateKeyToProtobuf } from '@libp2p/crypto/keys';
import { peerIdFromPrivateKey } from '@libp2p/peer-id';
import { BrowserHostStore } from '../../../root-node/browser/BrowserHostStore.js';
import { resolveApplicationPrivateKey } from '../../src/peercompute/networkManager/NetworkManager.js';
import { NodeKernel } from '../../src/peercompute/nodeKernel/NodeKernel.js';

test('host identity and acknowledged markers survive closing and reopening their database', async () => {
  const indexedDBImpl = new IDBFactory();
  const first = new BrowserHostStore({ installationId: 'restart', indexedDBImpl });
  const identity = await first.loadIdentity();
  const receipt = await first.writeMarker({ key: 'restart-check', value: { count: 12 } });
  assert.deepEqual(receipt.value, { count: 12 });
  await first.close();
  const second = new BrowserHostStore({ installationId: 'restart', indexedDBImpl });
  try {
    const restored = await second.loadIdentity();
    assert.equal(restored.peerId, identity.peerId);
    assert.deepEqual(privateKeyToProtobuf(restored.privateKey), privateKeyToProtobuf(identity.privateKey));
    assert.deepEqual((await second.readMarker('restart-check')).value, { count: 12 });
    assert.equal(await second.readMarker('missing'), null);
  } finally { await second.close(); }
});

test('concurrent first opens retain one identity and different installations stay distinct', async () => {
  const indexedDBImpl = new IDBFactory();
  const stores = ['same', 'same', 'other'].map(installationId => new BrowserHostStore({ installationId, indexedDBImpl }));
  try {
    const identities = await Promise.all(stores.map(store => store.loadIdentity()));
    assert.equal(identities[0].peerId, identities[1].peerId);
    assert.notEqual(identities[0].peerId, identities[2].peerId);
  } finally { await Promise.all(stores.map(store => store.close())); }
});

test('corrupt retained identity fails closed without replacing its record', async () => {
  const store = new BrowserHostStore({ indexedDBImpl: new IDBFactory() });
  try {
    await store.open();
    await store._transaction('metadata', 'readwrite', target => new Promise((resolve, reject) => {
      const request = target.put({ schema: 'corrupt', peerId: 'must-not-replace' }, 'identity');
      request.onsuccess = () => resolve(); request.onerror = () => reject(request.error);
    }));
    await assert.rejects(store.loadIdentity(), /refusing to replace/);
    const retained = await store._transaction('metadata', 'readonly', target => new Promise(resolve => {
      const request = target.get('identity'); request.onsuccess = () => resolve(request.result);
    }));
    assert.equal(retained.peerId, 'must-not-replace');
  } finally { await store.close(); }
});

test('marker write rejects transaction abort after the write request succeeded', async () => {
  const store = new BrowserHostStore({ indexedDBImpl: new IDBFactory() });
  await store.open();
  const original = store.database.transaction.bind(store.database);
  store.database.transaction = (...args) => {
    const transaction = original(...args);
    const objectStore = transaction.objectStore.bind(transaction);
    transaction.objectStore = name => {
      const target = objectStore(name), put = target.put.bind(target);
      target.put = (...values) => {
        const request = put(...values);
        request.addEventListener('success', () => transaction.abort());
        return request;
      };
      return target;
    };
    return transaction;
  };
  try { await assert.rejects(store.writeMarker({ key: 'aborted', value: 42 }), /aborted/i); }
  finally { store.database.transaction = original; }
  assert.equal(await store.readMarker('aborted'), null);
  await store.close();
});

test('host markers are bounded and reject writes after close', async () => {
  const store = new BrowserHostStore({ indexedDBImpl: new IDBFactory() });
  await store.open();
  await assert.rejects(store.writeMarker({ key: 'oversize', value: 'x'.repeat(16385) }), /16 KiB/);
  await assert.rejects(store.writeMarker({ key: '../unsafe', value: 1 }), /marker key/);
  await store.close();
  await assert.rejects(store.writeMarker({ key: 'closed', value: 1 }), /unavailable/);
  assert.throws(() => new BrowserHostStore({ installationId: '../profile' }), /installationId/);
});

test('missing durable storage cannot silently produce an ephemeral host identity', async () => {
  const store = new BrowserHostStore({ indexedDBImpl: null });
  await assert.rejects(store.loadIdentity(), /persistent IndexedDB/);
  await store.close();
});

test('application identity accepts explicit or provider keys, preserves ephemeral default, and fails closed', async () => {
  const key = await generateKeyPair('Ed25519');
  const expected = peerIdFromPrivateKey(key).toString();
  for (const options of [{ privateKey: key }, { privateKey: privateKeyToProtobuf(key) }, { privateKeyProvider: async () => key }]) {
    assert.equal(peerIdFromPrivateKey(await resolveApplicationPrivateKey(options)).toString(), expected);
  }
  const ephemeral = await Promise.all([resolveApplicationPrivateKey(), resolveApplicationPrivateKey()]);
  assert.notEqual(peerIdFromPrivateKey(ephemeral[0]).toString(), peerIdFromPrivateKey(ephemeral[1]).toString());
  await assert.rejects(resolveApplicationPrivateKey({ privateKey: key, privateKeyProvider: () => key }), /not both/);
  await assert.rejects(resolveApplicationPrivateKey({ privateKeyProvider: 'invalid' }), /function/);
  await assert.rejects(resolveApplicationPrivateKey({ privateKeyProvider: () => null }), /unavailable/);
  await assert.rejects(resolveApplicationPrivateKey({ privateKey: Uint8Array.of(255) }));
});

test('NodeKernel forwards the retained application identity without connecting or changing client defaults', async () => {
  const key = await generateKeyPair('Ed25519');
  let calls = 0;
  const kernel = new NodeKernel({ privateKeyProvider: () => { calls++; return key; },
    enableGPUHub: false, enableWorkers: false, enablePersistence: false,
    disableStateNetworkProvider: true, disableStateBroadcast: true,
    enableNetworkTelemetry: false, enableNetVizDebugTelemetry: false, enableNetVizSessionBroadcast: false });
  try {
    await kernel.initialize();
    assert.equal(kernel.networkManager.libp2p.peerId.toString(), peerIdFromPrivateKey(key).toString());
    assert.equal(calls, 1);
    assert.equal(kernel.networkManager.isConnected, false);
    assert.equal(kernel.isStarted, false);
  } finally { await kernel.stop(); }
});

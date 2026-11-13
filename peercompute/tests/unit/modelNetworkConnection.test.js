import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { createModelNetworkConnection } from '../../../demos/inference/src/modelNetworkConnection.js';

function fixture({ connected = false, existing = null, hooks = {} } = {}) {
  const store = {}, calls = [];
  let current = existing === true ? { store } : existing;
  const manager = {
    isConnected: connected, libp2p: connected ? {} : null,
    artifactStarting: null, artifactStopping: null,
    getArtifactTransport() { return current; },
    async initialize() { calls.push('initialize'); await hooks.initialize?.(); this.libp2p = {}; },
    async connect() { calls.push('connect'); await hooks.connect?.(); this.isConnected = true; },
    async createArtifactTransport(requestedStore) {
      calls.push('artifacts');
      if (current) {
        if (current.store !== requestedStore) throw new Error('Different artifact store');
        if (current.requiresCleanup) throw new Error('Cleanup required');
        return current;
      }
      if (this.artifactStarting) return this.artifactStarting;
      this.artifactStarting = (async () => {
        const result = await hooks.artifacts?.(this);
        current = result ?? { store: requestedStore };
        return current;
      })();
      try { return await this.artifactStarting; } finally { this.artifactStarting = null; }
    },
    async _stopArtifactTransport() {
      calls.push('stop-artifacts');
      await this.artifactStarting?.catch(() => {});
      await hooks.stop?.(); current = null;
    },
    async disconnect() {
      calls.push('disconnect'); await this._stopArtifactTransport();
      await hooks.disconnect?.(); this.isConnected = false;
    },
  };
  return { store, calls, manager, createManager: async () => { calls.push('create'); return manager; } };
}

test('application discovery connects while persisted artifact startup is still pending', async () => {
  const gate = Promise.withResolvers();
  const f = fixture({ hooks: { artifacts: () => gate.promise } });
  const connection = createModelNetworkConnection(f);
  // Standalone rather than injected ownership.
  const standalone = createModelNetworkConnection({ ...f, manager: null });
  assert.equal(await standalone.connect({}), null);
  assert.equal(standalone.manager, f.manager);
  assert.equal(standalone.networkReady, true); assert.equal(standalone.artifactReady, false);
  assert.deepEqual(standalone.getArtifactNetworkStatus(), { status: 'starting', error: null });
  assert.equal(f.calls.includes('disconnect'), false);
  gate.resolve(); await standalone.requireArtifacts();
  assert.equal(standalone.artifactReady, true);
  await standalone.dispose(); await connection.dispose();
  assert.equal(f.calls.filter((value) => value === 'disconnect').length, 1);
});

test('artifact ownership failure preserves app connectivity and explicit Connect retries it', async () => {
  let locked = true;
  const ownershipError = new Error('This library is being shared by another tab');
  const f = fixture({ hooks: { artifacts() { if (locked) throw ownershipError; } } });
  const connection = createModelNetworkConnection({ ...f, manager: null });
  await connection.connect({}); await connection.startArtifacts();
  assert.equal(connection.networkReady, true); assert.equal(connection.artifactReady, false);
  assert.equal(connection.getArtifactNetworkStatus().status, 'error');
  assert.equal(connection.getArtifactNetworkStatus().error, ownershipError.message);
  assert(connection.getArtifactNetworkStatus().retryAt > Date.now());
  await assert.rejects(connection.requireArtifacts(), (error) => error === ownershipError);
  assert.equal(f.calls.includes('disconnect'), false);
  locked = false;
  await connection.connect(() => { throw new Error('Must reuse application connection'); });
  await connection.requireArtifacts();
  assert.equal(connection.artifactReady, true); assert.equal(connection.error, null);
  assert.equal(f.calls.filter((value) => value === 'create').length, 1);
  await connection.dispose();
});

test('passive artifact recovery uses capped backoff and a later transfer recovers without reconnecting the application', async () => {
  let clock = 1000, failing = true;
  const f = fixture({ connected: true, hooks: { artifacts() { if (failing) throw new Error('Temporary relay startup failure'); } } });
  const connection = createModelNetworkConnection({ ...f, now: () => clock });
  try {
    await connection.connect(); await nextTurn();
    let attempts = 1;
    for (const delay of [5000, 10000, 20000, 40000, 60000, 60000]) {
      assert.deepEqual(connection.getArtifactNetworkStatus(), { status: 'error', error: 'Temporary relay startup failure', retryAt: clock + delay });
      assert.equal(connection.networkReady, true); assert.equal(connection.artifactReady, false);
      for (let i = 0; i < 3; i++) {
        assert.equal(await connection.retryArtifacts(), null);
        await assert.rejects(connection.requireArtifacts(), /Temporary relay startup failure/);
      }
      assert.equal(f.calls.filter(value => value === 'artifacts').length, attempts);
      clock += delay - 1; await connection.retryArtifacts();
      assert.equal(f.calls.filter(value => value === 'artifacts').length, attempts);
      clock++; await connection.retryArtifacts(); attempts++;
      assert.equal(f.calls.filter(value => value === 'artifacts').length, attempts);
    }
    failing = false; clock = connection.getArtifactNetworkStatus().retryAt;
    const transport = await connection.requireArtifacts();
    assert.equal(transport, f.manager.getArtifactTransport());
    assert.equal(connection.artifactReady, true); assert.equal(connection.error, null);
    assert.deepEqual(connection.getArtifactNetworkStatus(), { status: 'ready', error: null });
    assert.equal(f.calls.filter(value => ['initialize', 'connect', 'disconnect', 'create'].includes(value)).length, 0);
  } finally { await connection.dispose(); }
});

test('due maintenance and transfer retries share one startup; cancelling a waiter never cancels the shared retry', async () => {
  let clock = 1000, failing = true;
  const gate = Promise.withResolvers();
  const f = fixture({ connected: true, hooks: { artifacts() { if (failing) throw new Error('Not yet available'); return gate.promise; } } });
  const connection = createModelNetworkConnection({ ...f, now: () => clock });
  try {
    await connection.connect(); await nextTurn();
    clock = connection.getArtifactNetworkStatus().retryAt; failing = false;
    const controller = new AbortController();
    const first = connection.retryArtifacts({ signal: controller.signal });
    const second = connection.retryArtifacts(), third = connection.requireArtifacts();
    controller.abort(); await assert.rejects(first, { name: 'AbortError' });
    assert.equal(connection.getArtifactNetworkStatus().status, 'starting');
    assert.equal(f.calls.filter(value => value === 'artifacts').length, 2);
    gate.resolve(); assert.equal(await second, await third);
    assert.equal(connection.artifactReady, true);
    await connection.dispose();
    assert.throws(() => connection.retryArtifacts(), /disposed/);
  } finally { gate.resolve(); await connection.dispose(); }
});

test('explicit retry can bypass backoff but aborted and disconnected maintenance cannot start a transport', async () => {
  let failing = true;
  const f = fixture({ connected: true, hooks: { artifacts() { if (failing) throw new Error('Not ready'); } } });
  const connection = createModelNetworkConnection({ ...f, now: () => 1000 });
  try {
    await connection.connect(); await nextTurn(); failing = false;
    const controller = new AbortController(); controller.abort();
    assert.throws(() => connection.retryArtifacts({ signal: controller.signal }), { name: 'AbortError' });
    assert.equal(f.calls.filter(value => value === 'artifacts').length, 1);
    f.manager.isConnected = false;
    assert.equal(await connection.retryArtifacts({ force: true }), null);
    assert.equal(f.calls.filter(value => value === 'artifacts').length, 1);
    f.manager.isConnected = true;
    await connection.retryArtifacts({ force: true }); assert.equal(connection.artifactReady, true);
    assert.equal(f.calls.filter(value => value === 'artifacts').length, 2);
  } finally { await connection.dispose(); }
});

test('concurrent Connect calls deduplicate config loading, app creation and artifact startup', async () => {
  const configGate = Promise.withResolvers(), artifactGate = Promise.withResolvers();
  const f = fixture({ hooks: { artifacts: () => artifactGate.promise } });
  const connection = createModelNetworkConnection({ ...f, manager: null });
  let configurations = 0;
  const config = async () => { configurations++; await configGate.promise; return {}; };
  const first = connection.connect(config), second = connection.connect(config);
  configGate.resolve(); await Promise.all([first, second]);
  await connection.connect(config);
  assert.equal(configurations, 1);
  for (const value of ['create', 'initialize', 'connect', 'artifacts']) {
    assert.equal(f.calls.filter((item) => item === value).length, 1, value);
  }
  artifactGate.resolve(); await connection.dispose();
});

test('aborted pending application startup never adopts a late owned manager', async () => {
  const gate = Promise.withResolvers();
  const f = fixture({ hooks: { initialize: () => gate.promise } });
  const connection = createModelNetworkConnection({ ...f, manager: null });
  const controller = new AbortController();
  const opening = connection.connect({}, { signal: controller.signal });
  await nextTurn(); controller.abort(new DOMException('Cancelled', 'AbortError'));
  await assert.rejects(opening, { name: 'AbortError' });
  let disposed = false;
  const closing = connection.dispose().then(() => { disposed = true; });
  await nextTurn(); assert.equal(disposed, false, 'cleanup must track unfinished initialize');
  gate.resolve(); await closing;
  assert.equal(connection.manager, null); assert.equal(connection.networkReady, false);
  assert.equal(f.calls.includes('connect'), false); assert.equal(f.calls.includes('artifacts'), false);
  assert.equal(f.calls.filter((value) => value === 'disconnect').length, 1);
});

test('dispose tracks config loading and prevents creation after its abort', async () => {
  const gate = Promise.withResolvers();
  const f = fixture(), connection = createModelNetworkConnection({ ...f, manager: null });
  let startupSignal;
  const opening = connection.connect(async ({ signal }) => { startupSignal = signal; await gate.promise; return {}; });
  const rejected = assert.rejects(opening, { name: 'AbortError' });
  const closing = connection.dispose();
  assert.equal(startupSignal.aborted, true);
  gate.resolve(); await Promise.all([rejected, closing]);
  assert.equal(f.calls.includes('create'), false);
  assert.throws(() => connection.connect({}), /disposed/);
});

test('aborting a completed Connect request cannot tear down app or file startup', async () => {
  const gate = Promise.withResolvers(), controller = new AbortController();
  const f = fixture({ hooks: { artifacts: () => gate.promise } });
  const connection = createModelNetworkConnection({ ...f, manager: null });
  await connection.connect({}, { signal: controller.signal });
  controller.abort(); await nextTurn();
  assert.equal(connection.networkReady, true); assert.equal(f.calls.includes('disconnect'), false);
  gate.resolve(); await connection.requireArtifacts(); await connection.dispose();
});

test('dispose waits for optional startup and only stops the artifact node it added to an injected manager', async () => {
  const gate = Promise.withResolvers();
  const f = fixture({ connected: true, hooks: { artifacts: () => gate.promise } });
  const connection = createModelNetworkConnection(f);
  await connection.connect();
  let disposed = false;
  const closing = connection.dispose().then(() => { disposed = true; });
  await nextTurn(); assert.equal(disposed, false);
  assert.deepEqual(connection.getArtifactNetworkStatus(), { status: 'offline', error: null });
  gate.resolve(); await closing;
  assert.equal(connection.artifactReady, false);
  assert.equal(f.manager.isConnected, true); assert.equal(f.calls.includes('disconnect'), false);
  assert.equal(f.calls.filter((value) => value === 'stop-artifacts').length, 1);
});

test('borrowed transports and borrowed startup are never stopped by console disposal', async () => {
  for (const pending of [false, true]) {
    const gate = Promise.withResolvers();
    const f = fixture({ connected: true, existing: pending ? null : true,
      hooks: { artifacts: () => gate.promise } });
    const started = pending ? f.manager.createArtifactTransport(f.store) : null;
    const connection = createModelNetworkConnection(f);
    await connection.connect();
    const closing = connection.dispose(); gate.resolve();
    await started; await closing;
    assert.equal(f.calls.includes('disconnect'), false); assert.equal(f.calls.includes('stop-artifacts'), false);
    assert.equal(f.manager.isConnected, true); assert.ok(f.manager.getArtifactTransport());
  }
});

test('a transport belonging to another store reports a file error without disconnecting the embedding app', async () => {
  const borrowed = { store: {} };
  const f = fixture({ connected: true, existing: borrowed });
  const connection = createModelNetworkConnection(f);
  await connection.connect(); await connection.startArtifacts();
  assert.equal(connection.networkReady, true); assert.equal(connection.artifactReady, false);
  assert.match(connection.getArtifactNetworkStatus().error, /Different artifact store/);
  await connection.dispose();
  assert.equal(f.manager.getArtifactTransport(), borrowed);
  assert.equal(f.calls.includes('disconnect'), false); assert.equal(f.calls.includes('stop-artifacts'), false);
});

test('failed owned cleanup remains tracked and can be retried without affecting injected app connectivity', async () => {
  for (const injected of [false, true]) {
    let fail = true;
    const f = fixture({ connected: injected, hooks: { stop() { if (fail) throw new Error('Stop failed'); } } });
    const connection = createModelNetworkConnection({ ...f, manager: injected ? f.manager : null });
    await connection.connect({}); await connection.requireArtifacts();
    await assert.rejects(connection.dispose(), /cleanup failed/);
    assert.ok(f.manager.getArtifactTransport(), 'failed stop retains ownership for retry');
    fail = false; await connection.dispose();
    assert.equal(f.manager.getArtifactTransport(), null);
    assert.equal(f.manager.isConnected, injected);
  }
});

test('a cancelled transfer waiter does not cancel the shared artifact startup', async () => {
  const gate = Promise.withResolvers(), controller = new AbortController();
  const f = fixture({ connected: true, hooks: { artifacts: () => gate.promise } });
  const connection = createModelNetworkConnection(f);
  await connection.connect();
  const waiting = connection.requireArtifacts({ signal: controller.signal });
  controller.abort(); await assert.rejects(waiting, { name: 'AbortError' });
  assert.equal(connection.getArtifactNetworkStatus().status, 'starting');
  gate.resolve(); await connection.requireArtifacts();
  assert.equal(connection.artifactReady, true); await connection.dispose();
});

test('reconnecting an initialized shared app does not reinitialize or take application ownership', async () => {
  const f = fixture({ connected: true }); f.manager.isConnected = false;
  const connection = createModelNetworkConnection(f);
  await connection.connect(); await connection.requireArtifacts();
  assert.equal(f.calls.includes('initialize'), false); assert.equal(connection.networkReady, true);
  await connection.dispose(); assert.equal(f.calls.includes('disconnect'), false);
});

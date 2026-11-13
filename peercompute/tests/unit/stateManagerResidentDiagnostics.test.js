import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';

test('StateManager owns private diagnostics and closes handles without deleting retained failures', async () => {
  const indexedDBImpl = new IDBFactory(), manager = new StateManager();
  const store = manager.createResidentDiagnosticsStore({ name: 'owned', indexedDBImpl }); await store.open();
  assert.equal(manager.getResidentDiagnosticsStore('owned'), store);
  assert.throws(() => manager.createResidentDiagnosticsStore({ name: 'owned' }), /registered/);
  const scope = { agentId: 'ada', worldId: 'world' };
  await store.append({ ...scope, source: 'world-chat', stage: 'execution', status: 'failed',
    errorCode: 'ERR_MODEL_CONTEXT_BUDGET', message: 'Input exceeds context window' });
  await manager.destroy();
  assert.equal(store.closed, true); assert.equal(manager.getResidentDiagnosticsStore('owned'), null);
  assert.throws(() => manager.createResidentDiagnosticsStore(), /destroyed/);
  const reopened = new StateManager(), retained = reopened.createResidentDiagnosticsStore({ name: 'owned', indexedDBImpl });
  await retained.open(); assert.equal((await retained.list(scope))[0].errorCode, 'ERR_MODEL_CONTEXT_BUDGET');
  assert.equal(reopened.state.size, 0, 'Diagnostics never enter shared Yjs state');
  await reopened.destroy();
});

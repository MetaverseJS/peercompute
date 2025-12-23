import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StateManager } from '../src/peercompute/stateManager/StateManager.js';

const makeStateManager = async () => {
  const sm = new StateManager(null, { enablePersistence: false });
  await sm.initialize();
  return sm;
};

test('listNamespaceKeys enumerates scoped entries', async () => {
  const sm = await makeStateManager();
  sm.writeScoped('ns', 'a', 1);
  sm.writeScoped('ns', 'b', 2);
  const keys = sm.listNamespaceKeys('ns').sort();
  assert.deepEqual(keys, ['a', 'b']);
});

test('clearNamespace removes entries and broadcasts delete intent', async () => {
  const sm = await makeStateManager();
  sm.writeScoped('ns', 'a', 1);
  sm.writeScoped('ns', 'b', 2);
  sm.clearNamespace('ns');
  assert.deepEqual(sm.listNamespaceKeys('ns'), []);
  assert.equal(sm.readScoped('ns', 'a'), undefined);
});

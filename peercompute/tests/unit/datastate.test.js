import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from 'yjs';
import { DataState } from '../../src/peercompute/stateManager/DataState.js';

test('DataState commitDelta writes into warm namespace', () => {
  const ydoc = new Y.Doc();
  const state = ydoc.getMap('state');
  const dataState = new DataState({ ydoc, stateMap: state });

  dataState.commitDelta({
    taskId: 'task-1',
    payload: { value: 123 },
    version: 2,
    timestamp: 42
  });

  const stored = dataState.readWarm('task-1', 'deltas');
  assert.deepEqual(stored, { version: 2, payload: { value: 123 }, ts: 42 });
});

test('DataState hot buffer helpers manage the hot store', () => {
  const ydoc = new Y.Doc();
  const state = ydoc.getMap('state');
  const dataState = new DataState({ ydoc, stateMap: state });

  const buffer = { id: 'buf' };
  dataState.setHotBuffer('gpu-buffer', buffer);
  assert.equal(dataState.getHotBuffer('gpu-buffer'), buffer);

  dataState.deleteHotBuffer('gpu-buffer');
  assert.equal(dataState.getHotBuffer('gpu-buffer'), undefined);
});

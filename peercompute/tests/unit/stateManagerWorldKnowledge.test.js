import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';

test('StateManager owns knowledge store lifetime, rejects duplicate registrations and preserves retained data', async () => {
  const indexedDBImpl = new IDBFactory(), manager = new StateManager();
  const store = manager.createWorldKnowledgeStore({ name: 'owned', indexedDBImpl }); await store.open();
  assert.equal(manager.getWorldKnowledgeStore('owned'), store);
  assert.throws(() => manager.createWorldKnowledgeStore({ name: 'owned' }), /registered/);
  const scope = { agentId: 'ada', worldId: 'world', audience: 'public', conversationId: 'room' }, when = Date.now();
  await store.put({ ...scope, id: 'place', kind: 'place', subjectType: 'place', subjectId: 'meeting', label: 'Meeting spot',
    note: '', confidence: 'observed', position: [1, 3, 4], lastSeenAt: when,
    evidence: [{ ...scope, episodeId: 'e1', eventId: 'event1', when, sourceKind: 'local-observation', provenance: 'observed' }] }, { expectedRevision: 0 });
  await manager.destroy(); assert.equal(store.closed, true); assert.equal(manager.getWorldKnowledgeStore('owned'), null);
  assert.throws(() => manager.createWorldKnowledgeStore(), /destroyed/);
  const reopened = new StateManager(), retained = reopened.createWorldKnowledgeStore({ name: 'owned', indexedDBImpl });
  await retained.open(); assert.equal((await retained.get(scope, 'place')).label, 'Meeting spot'); await reopened.destroy();
});

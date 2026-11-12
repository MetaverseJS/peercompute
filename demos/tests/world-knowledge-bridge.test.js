import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { WorldKnowledgeStore } from '../../peercompute/src/peercompute/agents/WorldKnowledgeStore.js';
import { WorldMemoryStore } from '../../peercompute/src/peercompute/agents/WorldMemoryStore.js';
import { createWorldKnowledgeBridge } from '../shared/agents/WorldKnowledgeBridge.js';
import { projectWorldKnowledgeRequest } from '../shared/agents/WorldKnowledgeDecision.js';
import { projectWorldGoal } from '../shared/agents/WorldGoalDecision.js';
import { projectWorldOoda } from '../shared/agents/WorldOodaDecision.js';

const worldId = 'cubechat:knowledge', at = 100000;
const scope = { worldId, agentId: 'ada', audience: 'private', conversationId: 'owner' };
const participant = { id: 'human:owner-peer', peerId: 'owner-peer', kind: 'human', name: 'Same name', position: [24, 3, 30], distance: 30 };
const senses = () => ({ observedAt: at, self: { id: 'resident:host:ada', position: [0, 3, 0], intentRevision: 1 },
  participants: [structuredClone(participant)], requesterId: participant.id, obstacles: [], locations: [],
  spatial: { frame: 'planar-xz', bounds: { min: [-100, -100], max: [100, 100] }, maximumLegDistance: 160 } });
async function fixture(t) {
  const indexedDBImpl = new IDBFactory(); let clock = at, allowed = true, obstructed = false;
  const store = new WorldKnowledgeStore({ indexedDBImpl, now: () => clock });
  const memory = new WorldMemoryStore({ indexedDBImpl, now: () => clock });
  await store.open(); await memory.open(); t.after(() => Promise.all([store.destroy(), memory.destroy()]));
  const adapter = { normalizePosition: point => point, validateSpatialTarget: (_key, point) => {
    if (obstructed) throw new Error('Occupied'); return [...point];
  } };
  const create = source => createWorldKnowledgeBridge({ worldId, store: source, memory, adapter,
    conversationId: async (_world, name) => name, now: () => clock, isCurrent: () => allowed });
  const bridge = create(store);
  async function turn({ channel = scope, observed = senses(), who = { peerId: 'owner-peer', name: participant.name } } = {}) {
    const episode = await memory.append({ ...channel, kind: 'heard', who, where: observed.self.position,
      text: 'Remember this as our meeting spot', outcome: 'An authenticated message was received.',
      source: { kind: 'authenticated-message', eventId: crypto.randomUUID(), peerId: who.peerId } });
    const result = { key: 'local:ada', scope: channel, speaker: who, senses: observed, prompt: episode.text, episode,
      signal: new AbortController().signal };
    const prepared = await bridge.prepare(result); result.knowledgeRecords = prepared.records; return result;
  }
  const action = turn => projectWorldKnowledgeRequest(turn.senses).resolve({ type: 'remember-place', name: 'Meeting spot', anchor: 'speaker' }, { now: clock });
  return { store, memory, indexedDBImpl, bridge, create, turn, action,
    advance: n => { clock += n; }, revoke: () => { allowed = false; }, block: () => { obstructed = true; } };
}

test('remembered incoming point survives reopening and becomes an exact goal destination with auditable position evidence', async t => {
  const f = await fixture(t), turn = await f.turn();
  const record = await f.bridge.rememberPlace({ turn, action: f.action(turn) });
  assert.deepEqual(record.position, participant.position);
  const episodes = await f.memory.retrieve({ ...scope, query: '', limit: 32 });
  const anchor = episodes.find(item => item.id === record.evidence.at(-1).episodeId);
  assert.deepEqual(anchor.where, participant.position); assert.equal(anchor.kind, 'place-observation');
  await f.store.destroy();
  const reloaded = new WorldKnowledgeStore({ indexedDBImpl: f.indexedDBImpl, now: () => at }); await reloaded.open(); t.after(() => reloaded.destroy());
  const observed = await f.create(reloaded).observe({ key: turn.key, agentId: 'ada', observed: senses(), query: 'Take me to the meeting spot' });
  assert.equal(observed.locations[0].name, 'Meeting spot');
  assert.deepEqual(observed.knowledge.find(item => item.kind === 'place').position, participant.position);
  assert(observed.knowledge.filter(item => item.kind === 'person').every(item => !Object.hasOwn(item, 'position')));
  const goal = { objective: 'Take me to the meeting spot', requesterId: participant.id, steps: 0, limits: { maxSteps: 8 }, receipts: [], completedMilestones: [] };
  const projection = projectWorldGoal(goal, observed);
  const decision = projection.resolve(JSON.stringify({ decision: 'plan', milestones: [{ label: 'Visit meeting spot', type: 'move-to', locationId: 'l1' }] }), { now: at });
  assert.deepEqual(decision.milestones[0].position, participant.position);
});

test('knowledge never crosses visitor, public or world scope; names do not establish person identity', async t => {
  const f = await fixture(t), owner = await f.turn(); await f.bridge.rememberPlace({ turn: owner, action: f.action(owner) });
  for (const options of [{ audience: 'public' }, { requester: 'visitor' }]) {
    const current = await f.bridge.observe({ key: owner.key, agentId: 'ada', observed: senses(), ...options });
    assert.deepEqual(current.knowledge, []); assert.deepEqual(current.locations, []);
  }
  const duplicate = senses(); duplicate.participants[0] = { ...participant, id: 'human:other-peer', peerId: 'other-peer' }; duplicate.requesterId = 'human:other-peer';
  await f.turn({ observed: duplicate, who: { peerId: 'other-peer', name: participant.name } });
  const people = (await f.bridge.list('ada')).filter(item => item.kind === 'person');
  assert.equal(people.length, 2); assert.notEqual(people[0].subjectId, people[1].subjectId);
  const absent = senses(); absent.participants = []; delete absent.requesterId;
  const result = await f.bridge.observe({ key: owner.key, agentId: 'ada', observed: absent });
  assert(result.knowledge.filter(item => item.kind === 'person').every(item => item.currentlyObserved === false));
  assert.equal(result.participants.length, 0);
});

test('corrections and forgetting invalidate pending knowledge decisions and cannot be overwritten by late remembering', async t => {
  const f = await fixture(t), turn = await f.turn();
  const record = await f.bridge.rememberPlace({ turn, action: f.action(turn) });
  const late = await f.turn(), observed = await f.bridge.observe({ key: turn.key, agentId: 'ada', observed: senses() });
  const corrected = await f.bridge.correct('ada', { ownerPeerId: 'owner-peer', id: record.id, expectedRevision: record.revision, patch: { note: 'Use the west entrance' } });
  assert.equal(corrected.confidence, 'reported'); assert.equal(corrected.lastSeenAt, record.lastSeenAt);
  assert.equal(corrected.evidence.at(-1).sourceKind, 'authenticated-message');
  await assert.rejects(f.bridge.assertCurrent(observed), { name: 'AbortError' });
  await assert.rejects(f.bridge.rememberPlace({ turn: late, action: f.action(late) }), { code: 'ERR_WORLD_KNOWLEDGE_CONFLICT' });
  await f.bridge.forget('ada', { id: corrected.id, expectedRevision: corrected.revision });
  const fresh = await f.turn();
  await assert.rejects(f.bridge.rememberPlace({ turn: fresh, action: f.action(fresh) }), { code: 'ERR_WORLD_KNOWLEDGE_FORGOTTEN' });
  assert.equal((await f.bridge.list('ada')).filter(item => item.kind === 'place').length, 0);
});

test('remembering occupied anchors is allowed; unreachable retained places are excluded from current movement options', async t => {
  const f = await fixture(t), turn = await f.turn(); f.block();
  const record = await f.bridge.rememberPlace({ turn, action: f.action(turn) });
  const observed = await f.bridge.observe({ key: turn.key, agentId: 'ada', observed: senses() });
  assert.deepEqual(observed.locations, []); assert((await f.bridge.list('ada')).some(item => item.id === record.id));
  const outside = senses(); outside.participants[0].position = [200, 3, 0];
  const bad = await f.turn({ observed: outside });
  await assert.rejects(f.bridge.rememberPlace({ turn: bad, action: f.action(bad) }), /world bounds/);
});

test('a mistaken remember decision cannot replace a saved destination, including when bounded recall omits it', async t => {
  const f = await fixture(t), first = await f.turn();
  const saved = await f.bridge.rememberPlace({ turn: first, action: f.action(first) });
  const moved = senses(); moved.participants[0].position = [80, 3, 40];
  const next = await f.turn({ observed: moved }); next.prompt = 'Take me back to our meeting spot.';
  await assert.rejects(f.bridge.rememberPlace({ turn: next, action: f.action(next) }), { code: 'ERR_WORLD_KNOWLEDGE_CONFLICT' });
  assert.deepEqual(await f.store.get(scope, saved.id), saved);
  next.knowledgeRecords = [];
  await assert.rejects(f.bridge.rememberPlace({ turn: next, action: f.action(next) }), { code: 'ERR_WORLD_KNOWLEDGE_CONFLICT' });
  assert.deepEqual(await f.store.get(scope, saved.id), saved);
  const fresh = { ...f.action(next), name: 'Garden' };
  await assert.rejects(f.bridge.rememberPlace({ turn: next, action: fresh }), /name must come from your message/);
  next.prompt = 'Remember this as Garden';
  const created = await f.bridge.rememberPlace({ turn: next, action: fresh });
  assert.deepEqual(created.position, moved.participants[0].position); assert.equal(created.revision, 1);
});

test('missing durable evidence, identity mismatch, cancellation and revoked ownership cannot create knowledge', async t => {
  const f = await fixture(t), observed = senses(); observed.participants[0].peerId = 'spoof';
  const turn = await f.turn({ observed }); assert.equal((await f.bridge.list('ada')).length, 0);
  await assert.rejects(f.bridge.rememberPlace({ turn: { ...turn, episode: undefined }, action: f.action(turn) }), /saved conversation episode/);
  f.revoke(); await assert.rejects(f.bridge.rememberPlace({ turn, action: f.action(turn) }), { name: 'AbortError' });
  assert.equal((await f.bridge.list('ada')).length, 0);
});

test('inherited familiarity receives new local evidence without duplicating or replacing owner corrections', async t => {
  const f = await fixture(t); await f.turn();
  const records = await f.store.snapshot({ agentId: 'ada', worldId, includePrivate: true });
  const inherited = await f.store.inheritSnapshot({ agentId: 'clone', worldId, records, sourceAgentId: 'ada', sourcePeerId: 'source-peer' });
  await f.bridge.correct('clone', { ownerPeerId: 'owner-peer', id: inherited[0].id, expectedRevision: 1, patch: { label: 'My friend', note: 'Owner correction' } });
  await f.turn({ channel: { ...scope, agentId: 'clone' } });
  const after = await f.bridge.list('clone'); assert.equal(after.length, 1); assert.equal(after[0].label, 'My friend');
  assert.equal(after[0].confidence, 'reported'); assert.equal(after[0].revision, 3);
  assert(after[0].evidence.some(item => item.provenance === 'shared')); assert(after[0].evidence.some(item => item.provenance === 'observed'));
});

test('current knowledge identities use the same short references as each specialist request', async t => {
  const f = await fixture(t); await f.turn();
  const observed = await f.bridge.observe({ key: 'local:ada', agentId: 'ada', observed: senses() });
  const ooda = projectWorldOoda(observed); assert.equal(ooda.data.knowledge[0].participantId, 'p1');
  const goal = projectWorldGoal({ objective: 'Visit my friend', requesterId: participant.id, steps: 0,
    limits: { maxSteps: 8 }, receipts: [], completedMilestones: [] }, observed);
  assert.equal(JSON.parse(goal.worldContext).knowledge[0].participantId, 'speaker');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { projectWorldKnowledgeRequest, validateWorldKnowledgeAction } from '../shared/agents/WorldKnowledgeDecision.js';

const observed = () => ({ observedAt: Date.now(), self: { id: 'resident:owner:ada', position: [4, 3, 6], intentRevision: 2 },
  participants: [{ id: 'human:owner', name: 'Alex', position: [20, 3, 10] },
    { id: 'human:other', name: 'Alex', position: [-20, 3, 10] }], requesterId: 'human:owner',
  locations: [{ id: 'ground:80:30', name: 'Clearing', position: [80, 3, 30] }] });
const proposal = anchor => ({ type: 'remember-place', name: 'Meeting spot', anchor });

test('memory anchors resolve identity-bound incoming observations without exposing opaque IDs or coordinates', () => {
  const senses = observed(), projection = projectWorldKnowledgeRequest(senses);
  assert.deepEqual(projection.context.anchors.map(item => item.id), ['self', 'speaker']);
  assert.deepEqual(projection.context.locations, [{ id: 'l1', name: 'Clearing' }]);
  assert.doesNotMatch(JSON.stringify(projection.context), /resident:owner|human:owner|ground:80|position":\[/);
  const action = projection.resolve(proposal('speaker'));
  assert.deepEqual(action, { type: 'remember-place', name: 'Meeting spot', position: [20, 3, 10],
    source: { kind: 'participant', id: 'human:owner' }, observedAt: senses.observedAt, intentRevision: 2 });
  assert.deepEqual(projection.resolve(proposal('self')).position, [4, 3, 6]);
  assert.deepEqual(projection.resolve(proposal('l1')).source, { kind: 'location', id: 'ground:80:30' });
  assert.deepEqual(validateWorldKnowledgeAction(action, { observed: senses }), action);
});

test('source movement, duplicate display names and mutated returned actions cannot rewrite an in-flight place', () => {
  const senses = observed(), projection = projectWorldKnowledgeRequest(senses);
  senses.participants[0].position[0] = 999; senses.participants.reverse();
  senses.locations[0].position[0] = 999; projection.context.locations[0].id = 'forged';
  const action = projection.resolve(proposal('speaker'));
  assert.deepEqual(action.position, [20, 3, 10]); assert.equal(action.source.id, 'human:owner');
  action.position[0] = 999; action.source.id = 'human:other';
  assert.deepEqual(projection.resolve(proposal('speaker')).position, [20, 3, 10]);
  assert.deepEqual(projection.resolve(proposal('l1')).position, [80, 3, 30]);
});

test('missing requester or unsensed coordinates cannot be guessed from names or a known transport identity', () => {
  const senses = observed(); delete senses.requesterId;
  const projection = projectWorldKnowledgeRequest(senses);
  assert.throws(() => projection.resolve(proposal('speaker')));
  for (const anchor of ['human:owner', 'Alex', 'p1', 'l2', 'here', {}, [20, 3, 10]]) {
    assert.throws(() => projection.resolve(proposal(anchor)), { code: 'ERR_WORLD_KNOWLEDGE_DECISION' });
  }
  senses.requesterId = 'human:owner'; delete senses.participants[0].position; delete senses.self.position;
  assert.deepEqual(projectWorldKnowledgeRequest(senses).context.anchors, []);
  assert.throws(() => projectWorldKnowledgeRequest(senses).resolve(proposal('speaker')));
});

test('strict bounded proposals cannot introduce coordinates, update authority, alternate schemas or invalid Unicode', () => {
  const projection = projectWorldKnowledgeRequest(observed());
  for (const value of [null, [], {}, { ...proposal('speaker'), position: [1, 2, 3] },
    { ...proposal('speaker'), ownerId: 'attacker' }, { ...proposal('speaker'), type: 'forget-place' },
    ...['', '\0', 'a\nb', '\u007f', '\ud800', '😀'.repeat(31)].map(name => ({ ...proposal('speaker'), name }))]) {
    assert.throws(() => projection.resolve(value), { code: 'ERR_WORLD_KNOWLEDGE_DECISION' });
  }
  assert.equal(projection.resolve({ ...proposal('speaker'), name: '😀'.repeat(30) }).name, '😀'.repeat(30));
  const inherited = Object.create({ anchor: 'speaker' }); Object.assign(inherited, { type: 'remember-place', name: 'Trap' });
  assert.throws(() => projection.resolve(inherited));
});

test('stale or future observations, changed identity and changed intent revisions fail independent boundary validation', () => {
  const senses = observed(), projection = projectWorldKnowledgeRequest(senses), action = projection.resolve(proposal('speaker'));
  for (const now of [senses.observedAt - 1, senses.observedAt + 120001, NaN, Infinity]) {
    assert.throws(() => projection.resolve(proposal('speaker'), { now }));
    assert.throws(() => validateWorldKnowledgeAction(action, { observed: senses, now }));
  }
  assert(projection.resolve(proposal('speaker'), { now: senses.observedAt + 120000 }));
  const forged = [
    { ...action, position: [-20, 3, 10] }, { ...action, observedAt: action.observedAt + 1 },
    { ...action, intentRevision: 3 }, { ...action, arbitrary: true },
    { ...action, source: { ...action.source, peerId: 'human:owner' } },
    { ...action, source: { kind: 'participant', id: 'human:other' } },
  ];
  for (const value of forged) assert.throws(() => validateWorldKnowledgeAction(value, { observed: senses }));
  const changed = structuredClone(senses); changed.self.intentRevision++;
  assert.throws(() => validateWorldKnowledgeAction(action, { observed: changed }));
});

test('invalid coordinate snapshots and duplicate IDs do not produce ambiguous anchors', () => {
  for (const position of [[1, 2], [1, , 3], [Infinity, 2, 3], [1e9, 2, 3]]) {
    const senses = observed(); senses.participants[0].position = position;
    assert.throws(() => projectWorldKnowledgeRequest(senses).resolve(proposal('speaker')));
  }
  const duplicate = observed(); duplicate.participants.push({ ...duplicate.participants[0], position: [100, 3, 0] });
  assert.throws(() => projectWorldKnowledgeRequest(duplicate));
  const locations = observed(); locations.locations.push({ ...locations.locations[0], position: [100, 3, 0] });
  assert.throws(() => projectWorldKnowledgeRequest(locations));
  const overflow = observed(); overflow.locations = Array.from({ length: 13 }, (_, index) => ({ id: `place:${index}`, name: 'Place', position: [0, 3, 0] }));
  assert.throws(() => projectWorldKnowledgeRequest(overflow));
});

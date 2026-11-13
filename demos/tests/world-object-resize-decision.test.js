import test from 'node:test';
import assert from 'node:assert/strict';
import { projectWorldObjectResizeRequest, validateWorldObjectResize } from '../shared/agents/WorldObjectResizeDecision.js';
import { generateWorldIntentDecision, projectWorldIntentRequest, WORLD_PHYSICAL_OBSERVATIONS_MARKER } from '../shared/agents/WorldIntentDecision.js';

const observation = () => ({ observedAt: Date.now(), self: { id: 'resident:ada', position: [0, 3, 0] }, participants: [],
  objects: [{ local: true, objectId: 'saved-castle', artifactCid: 'PRIVATE_CID', revision: 2,
    name: 'Castle', size: 6, position: [100, 0, 0] },
  { local: false, objectId: 'foreign-castle', artifactCid: 'FOREIGN', revision: 0, name: 'Foreign castle', size: 8, position: [200, 0, 0] }] });

test('resize references freeze current object identity, exact size and CAS revision without exposing private IDs', () => {
  const observed = observation(), projection = projectWorldObjectResizeRequest(observed);
  observed.objects[0].revision = 99; observed.objects[0].size = 100;
  assert.equal(projection.context.length, 1); assert.equal(projection.context[0].size, 6);
  assert.doesNotMatch(JSON.stringify(projection.context), /PRIVATE|saved-castle|FOREIGN/);
  assert.deepEqual(projection.resolve({ targetId: 'o1', multiplier: 10 }), {
    objectId: 'saved-castle', expectedArtifactCid: 'PRIVATE_CID', expectedObjectRevision: 2, multiplier: 10 });
  assert.equal(projection.resolve({ targetId: 'o1', size: 96 }).size, 96);
  assert.throws(() => projection.resolve({ targetId: 'o1', multiplier: 10 }, { now: observed.observedAt + 120001 }));
});

test('resize rejects invented or foreign targets, multiple amounts, invalid scales and substituted preconditions', () => {
  const observed = observation(), projection = projectWorldObjectResizeRequest(observed);
  for (const value of [{ targetId: 'o2', multiplier: 10 }, { targetId: 'saved-castle', multiplier: 10 },
    { targetId: 'o1', size: 60, multiplier: 10 }, { targetId: 'o1', multiplier: 0 }, { targetId: 'o1', multiplier: '10' },
    { targetId: 'o1', multiplier: 1000 }, { targetId: 'o1', size: 0.1 }, { targetId: 'o1', position: [1, 0, 1], size: 60 }]) {
    assert.throws(() => projection.resolve(value));
  }
  const valid = projection.resolve({ targetId: 'o1', multiplier: 10 });
  assert.deepEqual(validateWorldObjectResize(valid, observed), valid);
  assert.throws(() => validateWorldObjectResize({ ...valid, expectedObjectRevision: 3 }, observed));
  assert.throws(() => validateWorldObjectResize({ ...valid, expectedArtifactCid: 'OTHER' }, observed));
  assert.throws(() => projectWorldIntentRequest('Resize it', observed).resolve('{"resize":{"targetId":"o1","multiplier":10}}'));
});

test('managed resize selection preserves current prompt and only receives existing-object grounding', async () => {
  const requests = [], observed = observation(), outputs = [{ action: 'resize' }, { resize: { targetId: 'o1', multiplier: 10 } }];
  const result = await generateWorldIntentDecision({ inference: {
    listCandidates: async () => [{ key: 'peer:llm', manifestCid: 'model', runtime: 'wllama', local: false, available: true, task: 'text-generation', modalities: ['text'], outputModalities: ['text'] }],
    generate: async (_candidate, input) => { requests.push(input); return { text: JSON.stringify(outputs.shift()) }; },
  }, head: { policy: { inferenceMode: 'network-assisted' } }, message: 'Make the castle 10x bigger.', observed,
  allowObject: true, allowResize: true, objectOnly: true });
  assert.equal(requests.length, 2); assert(requests.every(input => input.prompt === 'Make the castle 10x bigger.'));
  assert.doesNotMatch(requests[0].messages[0].content, /PRIVATE_CID|saved-castle/);
  const context = JSON.parse(requests[1].messages[0].content.split(WORLD_PHYSICAL_OBSERVATIONS_MARKER)[1]);
  assert.deepEqual(Object.keys(context), ['objects']); assert.equal(context.objects[0].id, 'o1');
  assert.equal(result.resize.expectedObjectRevision, 2); assert.equal(result.resize.multiplier, 10);
});

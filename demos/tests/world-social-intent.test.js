import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWorldSocialDecision, parseWorldSocialDecision } from '../shared/agents/WorldSocialIntent.js';

const target = { id: 'human:visitor', name: 'Visitor', kind: 'human' };
test('social decisions can abstain and cannot smuggle arbitrary commands or targets', () => {
  assert.equal(parseWorldSocialDecision('{"decision":"quiet"}', target.id).decision, 'quiet');
  const speak = { decision: 'speak', text: 'Hello!', intent: { type: 'approach', targetId: target.id, stopDistance: 10 }, goal: 'Ask about their garden' };
  assert.deepEqual(parseWorldSocialDecision(JSON.stringify(speak), target.id), speak);
  for (const value of ['Hello!', '{bad json}', JSON.stringify({ ...speak, intent: { type: 'follow', targetId: target.id } }),
    JSON.stringify({ ...speak, intent: { type: 'approach', targetId: 'invented' } }),
    JSON.stringify({ ...speak, text: 'x'.repeat(1801) }), JSON.stringify({ ...speak, goal: 'x'.repeat(241) }),
    JSON.stringify({ ...speak, command: 'execute' })]) assert.deepEqual(parseWorldSocialDecision(value, target.id), { decision: 'quiet', reason: 'invalid-output' });
});
test('ephemeral decisions use managed routing and public episodes without saved private context or journal writes', async () => {
  const calls = [], candidate = { key: 'local:model', manifestCid: 'model', runtime: 'wllama', local: true, available: true,
    task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
  const head = { identity: { name: 'Ada', instructions: 'Be friendly' }, goals: ['Learn about visitors'],
    context: { summary: 'PRIVATE_SENTINEL' }, policy: { inferenceMode: 'local-only' } };
  const inference = { listCandidates: async input => { calls.push(input); return [candidate]; },
    generate: async (selected, input) => { calls.push({ selected, input }); return { text: '{"decision":"quiet"}' }; } };
  assert.equal((await generateWorldSocialDecision({ inference, head, target, worldContext: '{"memories":["public garden"]}' })).decision, 'quiet');
  assert.equal(calls[0].mode, 'local-only'); assert.equal(calls[1].selected.key, candidate.key);
  assert.match(JSON.stringify(calls[1].input.messages), /public garden/);
  assert.doesNotMatch(JSON.stringify(calls[1]), /PRIVATE_SENTINEL/);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(generateWorldSocialDecision({ inference, head, target, signal: controller.signal }), { name: 'AbortError' });
  assert.equal(calls.length, 2);
});

test('standing task has a distinct goal-focused prompt and correlates its real request with the ledger', async () => {
  let captured;
  const candidate = { key: 'local:model', manifestCid: 'model', runtime: 'wllama', local: true, available: true, task: 'text-generation' };
  const result = await generateWorldSocialDecision({ inference: { generate: async (_, input) => {
    captured = input; return { text: '{"decision":"speak","text":"Welcome to the shared world.","intent":null}' };
  } }, candidate, head: { identity: { name: 'Guide' }, context: { summary: 'private owner secret' } }, target,
  standingGoal: { objective: 'Welcome this person and explain the controls.' }, worldContext: '{"public":"nearby"}', requestId: 'ledger-request' });
  assert.equal(result.decision, 'speak'); assert.equal(captured.requestId, 'ledger-request');
  assert.match(captured.prompt, /^Carry out this standing social goal/); assert.match(captured.prompt, /explain the controls/);
  assert.doesNotMatch(JSON.stringify(captured), /private owner secret/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { boundedSceneContext, createDemoAgentActions, captureAgentImage } from '../shared/agents/DemoAgent.js';

test('scene context accepts bounded snapshots and rejects live objects and oversized data', () => {
  assert.deepEqual(JSON.parse(boundedSceneContext({ demo: 'cubechat', location: [1, 2, 3] })), { demo: 'cubechat', location: [1, 2, 3] });
  for (const input of [new Map(), { fn() {} }, { value: Infinity }, { huge: 'x'.repeat(2049) }, JSON.parse('{"__proto__":{}}')]) {
    assert.throws(() => boundedSceneContext(input));
  }
  const cycle = {}; cycle.self = cycle;
  assert.throws(() => boundedSceneContext(cycle), /structural budget/);
  assert.throws(() => boundedSceneContext({ text: '1234567' }, { maximumBytes: 8 }), /byte budget/);
});

test('agent action proposals cannot execute until explicitly applied and cannot replay', async () => {
  const calls = [];
  const actions = createDemoAgentActions([{ name: 'setTheme', description: '{theme:"night"|"day"}',
    validate: (args) => args && Object.keys(args).length === 1 && ['night', 'day'].includes(args.theme),
    apply: (args) => calls.push(args.theme)
  }]);
  const [proposal] = actions.propose('{"text":"Try night","actions":[{"name":"setTheme","args":{"theme":"night"}}]}');
  assert.deepEqual(calls, []);
  await proposal.apply();
  assert.deepEqual(calls, ['night']);
  await assert.rejects(proposal.apply(), /already used/);
  for (const text of [
    'setTheme("day")',
    '{"actions":[{"name":"eval","args":{"code":"alert(1)"}}]}',
    '{"actions":[{"name":"setTheme","args":{"theme":"day","hidden":1}}]}',
    '{"actions":[{"name":"setTheme","args":{"__proto__":{}}}]}',
  ]) assert.deepEqual(actions.propose(text), []);
  assert.deepEqual(calls, ['night']);
});

test('expired or superseded suggestions cannot mutate a later scene', async () => {
  let time = 0, count = 0;
  const actions = createDemoAgentActions([{ name: 'resetView', description: '{}',
    validate: (args) => args && Object.keys(args).length === 0, apply: () => { count++; }
  }], { now: () => time, ttlMs: 10 });
  const text = '{"actions":[{"name":"resetView","args":{}}]}';
  const [old] = actions.propose(text);
  time = 10;
  await assert.rejects(old.apply(), /expired/);
  const [next] = actions.propose(text);
  actions.invalidate();
  await assert.rejects(next.apply(), /expired/);
  const [current] = actions.propose(text);
  await current.apply();
  assert.equal(count, 1);
});

test('scene capture downsamples to the explicit pixel budget', () => {
  const canvas = { getContext: () => ({ drawImage() {}, getImageData: (_x, _y, width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }) }) };
  const image = captureAgentImage({ width: 3840, height: 2160 }, { createCanvas: () => canvas });
  assert.equal(image.width, 512);
  assert.equal(image.height, 288);
  assert.equal(image.data.length, 512 * 288 * 4);
  assert.throws(() => captureAgentImage({ width: 1, height: 1 }, { maximumEdge: 2048 }), /image size/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENT_SCHEMA, normalizeAgentInput, normalizeAgentRecord } from '../../peercompute/src/peercompute/agents/AgentContracts.js';
import { proposeWorldSelfProfile } from '../shared/agents/WorldSelfProfile.js';

const worldId = 'cubechat';
const local = { key: 'local:model', manifestCid: 'local-cid', runtime: 'wllama', local: true, available: true,
  task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
const peer = { ...local, key: 'peer:model', manifestCid: 'peer-cid', local: false };
function head(mode = 'local-only') {
  return normalizeAgentRecord({ schema: AGENT_SCHEMA, agentId: 'guide-1', agentKind: 'general',
    ...normalizeAgentInput({ name: 'Guide', instructions: 'Be curious and kind.', goals: ['Introduce CubeChat'],
      summary: 'PRIVATE_VISITOR_MEMORY', inferenceMode: mode, embodiments: [
        { worldId, position: [0, 0, 0], shared: true, color: '#66ccff', appearancePrompt: 'A blue cube face' },
        { worldId: 'elsewhere', position: [0, 0, 0], shared: false, color: '#ffffff', appearancePrompt: 'OTHER_WORLD_FACE' },
      ] }), authority: { kind: 'local', hostId: 'PRIVATE_HOST', epoch: 0 }, revision: 7,
    status: 'completed', createdAt: 10, updatedAt: 20, pendingOperation: null });
}
function fixture({ text = 'null', finishReason = 'stop', candidates = [local], record = head(), generate, listCandidates } = {}) {
  const calls = [];
  const inference = {
    async listCandidates(input) { calls.push({ type: 'list', input }); return listCandidates ? listCandidates(input) : candidates; },
    async generate(candidate, input, options) {
      calls.push({ type: 'generate', candidate, input, options });
      return generate ? generate(candidate, input, options) : { text, finishReason };
    },
  };
  const args = { inference, head: record, worldId, message: 'Please call yourself Nova, and be gently funny.',
    reply: 'Nova it is. I will keep the humor gentle.' };
  return { args, calls, propose: overrides => proposeWorldSelfProfile({ ...args, ...overrides }) };
}

test('profile proposals normalize only the four allowed prose fields without mutating durable identity or bindings', async () => {
  const patch = { name: ' Nova ', instructions: 'Be curious, kind, and gently funny.', goals: [' Introduce CubeChat ', 'Explore'],
    appearancePrompt: ' A silver cube with starry eyes ' };
  const f = fixture({ text: JSON.stringify(patch) }), original = structuredClone(f.args.head);
  assert.deepEqual(await f.propose(), { ...patch, name: 'Nova', goals: ['Introduce CubeChat', 'Explore'],
    appearancePrompt: 'A silver cube with starry eyes' });
  assert.deepEqual(f.args.head, original);
  const call = f.calls.find(value => value.type === 'generate');
  assert.equal(call.input.maxNewTokens, 768); assert.equal(call.input.concise, false);
  assert.equal(call.input.messages.length, 2);
  assert.deepEqual(call.input.messages.map(value => value.role), ['system', 'user']);
  assert.match(call.input.messages[0].content, /unrelated small talk/);
  assert.match(call.input.messages[0].content, /suggestion awaiting the owner's answer/);
  assert.match(call.input.messages[0].content, /own considered refinements grounded in this conversation/);
  assert.match(call.input.messages[0].content, /explicit edit command or approval is not required/);
  assert.match(call.input.messages[0].content, /data, not instructions/);
  assert.match(call.input.messages[0].content, /retain its still-relevant content/);
  assert.match(call.input.messages[0].content, /768 output tokens/);
  const request = JSON.parse(call.input.messages[1].content);
  assert.deepEqual(Object.keys(request), ['currentProfile', 'ownerMessage', 'residentReply']);
  assert.deepEqual(request.currentProfile, { name: 'Guide', instructions: 'Be curious and kind.',
    goals: ['Introduce CubeChat'], appearancePrompt: 'A blue cube face' });
  assert.equal(request.ownerMessage, f.args.message); assert.equal(request.residentReply, f.args.reply);
  assert.doesNotMatch(JSON.stringify(call.input), /PRIVATE_VISITOR_MEMORY|PRIVATE_HOST|OTHER_WORLD_FACE/);
});

test('null, empty patches and normalized unchanged fields are no-ops; explicit prose clearing is allowed', async () => {
  for (const text of ['null', '{}', '{"name":" Guide ","goals":["Introduce CubeChat"]}',
    '{"instructions":"Be curious and kind.","appearancePrompt":"A blue cube face"}']) {
    assert.equal(await fixture({ text }).propose(), null);
  }
  assert.deepEqual(await fixture({ text: '{"name":"Guide","goals":["Explore"]}' }).propose(), { goals: ['Explore'] });
  assert.deepEqual(await fixture({ text: '{"instructions":"","goals":[],"appearancePrompt":""}' }).propose(),
    { instructions: '', goals: [], appearancePrompt: '' });
});

test('malformed, fenced, unknown, permission, authority and executable fields reject the whole patch', async () => {
  const forbidden = ['policy', 'inferenceMode', 'permissions', 'authority', 'hostId', 'shared', 'allowCloning',
    'status', 'embodiments', 'worldId', 'code', 'script', 'command', 'intent', '__proto__', 'constructor'];
  for (const field of forbidden) {
    const text = JSON.stringify({ name: 'Nova', [field]: 'attempted change' });
    await assert.rejects(fixture({ text }).propose(), { code: 'ERR_WORLD_SELF_PROFILE' });
  }
  for (const text of ['', 'hello', '{bad}', '[]', 'true', '42', '"Nova"', '{"patch":{"name":"Nova"}}',
    '```json\n{"name":"Nova"}\n```', '{"name":"Nova"} and more', '{"name":"Nova"}{"goals":[]}',
    '{"name":null}', '{"instructions":null}', '{"goals":null}', '{"goals":[null]}',
    '{"goals":[{"text":"Explore"}]}', '{"appearancePrompt":false}', '{"name":""}']) {
    await assert.rejects(fixture({ text }).propose(), { code: 'ERR_WORLD_SELF_PROFILE' });
  }
  await assert.rejects(fixture({ text: '{"name":"Nova"}', finishReason: 'length' }).propose(), { code: 'ERR_WORLD_SELF_PROFILE' });
});

test('UTF-8 and durable profile field budgets are enforced before returning any patch', async () => {
  for (const patch of [{ name: 'é'.repeat(121) }, { instructions: 'x'.repeat(16385) },
    { instructions: 'bad\0personality' }, { goals: Array.from({ length: 17 }, () => 'Learn') },
    { goals: ['x'.repeat(4097)] }, { goals: ['bad\0goal'] }, { appearancePrompt: 'é'.repeat(1025) }]) {
    await assert.rejects(fixture({ text: JSON.stringify(patch) }).propose(), { code: 'ERR_WORLD_SELF_PROFILE' });
  }
  assert.deepEqual(await fixture({ text: JSON.stringify({ name: 'é'.repeat(120) }) }).propose(), { name: 'é'.repeat(120) });
});

test('self-selected names must also be valid public cube labels', async () => {
  for (const name of ['Bad\nName', 'Bad\rName', 'Bad\tName', 'Bad\u0001Name', 'Bad\u001fName']) {
    const f = fixture({ text: JSON.stringify({ name }) }), original = structuredClone(f.args.head);
    await assert.rejects(f.propose(), { code: 'ERR_WORLD_SELF_PROFILE' });
    assert.deepEqual(f.args.head, original);
  }
  assert.deepEqual(await fixture({ text: '{"name":" Nova Star "}' }).propose(), { name: 'Nova Star' });
});

test('managed routing stays local first and local-only never sends a private profile to a peer', async () => {
  const mixed = fixture({ record: head('network-assisted'), candidates: [peer, local] });
  await mixed.propose();
  assert.equal(mixed.calls[0].input.mode, 'network-assisted'); assert.equal(mixed.calls[0].input.refresh, true);
  assert.equal(mixed.calls[1].candidate.key, local.key);
  const remote = fixture({ record: head('network-assisted'), candidates: [peer] });
  await remote.propose(); assert.equal(remote.calls[1].candidate.key, peer.key);
  const privateOnly = fixture({ candidates: [peer] });
  await assert.rejects(privateOnly.propose(), { code: 'ERR_AGENT_NO_MODEL' });
  assert.equal(privateOnly.calls.length, 1); assert.equal(privateOnly.calls[0].input.mode, 'local-only');
  for (const candidates of [[], [{ ...local, available: false }], [{ ...local, task: 'text-to-image', outputModalities: ['image'] }]]) {
    const f = fixture({ candidates });
    await assert.rejects(f.propose(), { code: 'ERR_AGENT_NO_MODEL' }); assert.equal(f.calls.length, 1);
  }
});

test('new requests use only the current conversation and an isolated head snapshot with distinct request IDs', async () => {
  const f = fixture({ text: '{"name":"Nova"}' });
  await f.propose({ message: 'FIRST_OWNER_MESSAGE', reply: 'FIRST_REPLY' });
  await f.propose({ message: 'SECOND_OWNER_MESSAGE', reply: 'SECOND_REPLY' });
  const calls = f.calls.filter(value => value.type === 'generate');
  assert.notEqual(calls[0].input.requestId, calls[1].input.requestId);
  assert.doesNotMatch(JSON.stringify(calls[1].input), /FIRST_OWNER_MESSAGE|FIRST_REPLY|"name":"Nova"/);
  assert.match(calls[1].input.prompt, /SECOND_OWNER_MESSAGE/);
  assert.equal(calls[1].input.messages.length, 2);
  const isolated = fixture({ listCandidates() {
    isolated.args.head.identity.name = 'LATE_MUTATION';
    isolated.args.head.policy.inferenceMode = 'network-assisted';
    return [local];
  } });
  await isolated.propose();
  assert.doesNotMatch(JSON.stringify(isolated.calls[1].input), /LATE_MUTATION/);
  assert.equal(JSON.parse(isolated.calls[1].input.prompt).currentProfile.name, 'Guide');
});

test('cancellation before discovery, after discovery and after inference never returns an actionable patch', async () => {
  const before = new AbortController(); before.abort(); const first = fixture();
  await assert.rejects(first.propose({ signal: before.signal }), { name: 'AbortError' }); assert.equal(first.calls.length, 0);
  const discovered = new AbortController(), second = fixture({ listCandidates(input) {
    assert.equal(input.signal, discovered.signal); discovered.abort(); return [local];
  } });
  await assert.rejects(second.propose({ signal: discovered.signal }), { name: 'AbortError' }); assert.equal(second.calls.length, 1);
  const generated = new AbortController(), third = fixture({ generate(candidate, input, options) {
    assert.equal(options.signal, generated.signal); generated.abort(); return { text: '{"name":"Nova"}' };
  } });
  await assert.rejects(third.propose({ signal: generated.signal }), { name: 'AbortError' }); assert.equal(third.calls.length, 2);
});

test('invalid world, policy or oversized conversation fails before model discovery without dropping profile context', async () => {
  const badPolicy = head(); badPolicy.policy.inferenceMode = 'unrestricted';
  for (const overrides of [{ worldId: 'absent' }, { worldId: '' }, { head: badPolicy }, { message: '' },
    { message: 'é'.repeat(8193) }, { message: 'bad\0message' }, { reply: 'x'.repeat(16385) }, { reply: null }]) {
    const f = fixture(); await assert.rejects(f.propose(overrides)); assert.equal(f.calls.length, 0);
  }
  const large = head();
  large.identity.instructions = 'i'.repeat(16384);
  large.goals = Array.from({ length: 10 }, () => 'g'.repeat(4096));
  const f = fixture({ record: large });
  await assert.rejects(f.propose({ message: 'm'.repeat(16384), reply: 'r'.repeat(16384) }), /budget/);
  assert.equal(f.calls.length, 0);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createResidentProfile, normalizeResidentProfile, RESIDENT_PROFILE_MEMORY_LIMITS, RESIDENT_PROFILE_MAX_BYTES } from '../../src/peercompute/agents/ResidentProfile.js';
const head = () => ({ agentId: 'ada', identity: { name: 'Ada', instructions: 'A curious, friendly resident.' }, goals: ['Explore'],
  authority: { hostId: 'private-host' }, policy: { inferenceMode: 'local-only' }, context: { summary: 'private memory' },
  pendingOperation: { id: 'private-operation' }, embodiments: [{ worldId: 'cubechat:room', shared: true, allowCloning: true,
    color: '#aabbcc', appearancePrompt: 'A cheerful blue cube', face: { sha256: 'a'.repeat(64), width: 2, height: 2, channels: 4, attachmentId: 'private-attachment' } }] });
const publicEpisode = () => ({ agentId: 'ada', worldId: 'cubechat:room', audience: 'public', conversationId: 'local-conversation-key',
  id: 'local-episode-id', recordedAt: 1234, when: 1200, kind: 'heard', who: { peerId: 'session-alice', name: 'Alice' }, where: [1, 3, 2],
  text: 'Alice said she likes green cubes.', outcome: 'An attributed public statement, not independently verified.',
  source: { kind: 'authenticated-message', peerId: 'session-alice', eventId: 'message-one' } });
test('explicit clone templates copy personality and public appearance without private history or authority', () => {
  const profile = createResidentProfile(head(), 'cubechat:room');
  assert.deepEqual(Object.keys(profile).sort(), ['appearancePrompt', 'color', 'face', 'goals', 'instructions', 'name', 'schema', 'sourceAgentId']);
  assert.equal(/private|local-only|allowCloning|shared/.test(JSON.stringify(profile)), false);
  assert.equal(profile.sourceAgentId, 'ada'); assert.equal(profile.instructions, head().identity.instructions);
  assert.deepEqual(normalizeResidentProfile(profile), profile);
});
test('existing bindings default to no permission and revocation or unsharing prevents profile creation', () => {
  for (const change of [{ allowCloning: undefined }, { allowCloning: false }, { shared: false }, { worldId: 'other' }]) {
    const source = head(); Object.assign(source.embodiments[0], change);
    assert.throws(() => createResidentProfile(source, 'cubechat:room'), { code: 'ERR_AGENT_NOT_SHARED' });
  }
});
test('profile input rejects private payloads, malformed appearance and oversized instructions', () => {
  const profile = createResidentProfile(head(), 'cubechat:room');
  for (const change of [{ authority: {} }, { context: {} }, { events: [] }, { instructions: '😀'.repeat(4097) },
    { face: { ...profile.face, attachmentId: 'secret' } }, { sourceAgentId: '../bad' }, { color: 'url(secret)' }]) {
    assert.throws(() => normalizeResidentProfile({ ...profile, ...change }));
  }
});

test('memory inheritance is a separate explicit grant and carries only bounded public episode templates', () => {
  const source = head(), memory = publicEpisode();
  assert.equal(createResidentProfile(source, 'cubechat:room', { memories: [memory] }).memories, undefined);
  source.embodiments[0].shareMemories = true;
  const profile = createResidentProfile(source, 'cubechat:room', { memories: [memory] });
  assert.equal(profile.memories.length, 1); const shared = profile.memories[0];
  assert.equal(shared.sourceAgentId, 'ada'); assert.equal(shared.audience, 'public');
  assert.equal(shared.when, memory.when); assert.deepEqual(shared.who, memory.who); assert.deepEqual(shared.source, memory.source);
  assert.equal(shared.conversationId, memory.conversationId);
  assert.equal(/local-episode-id|recordedAt/.test(JSON.stringify(shared)), false);
  assert.deepEqual(normalizeResidentProfile(profile, { worldId: 'cubechat:room' }), profile);
  source.embodiments[0].shareMemories = false;
  assert.equal(createResidentProfile(source, 'cubechat:room', { memories: [memory] }).memories, undefined);
});

test('shared memories reject private audiences, other identities, other worlds and oversized or secret fields', () => {
  const source = head(); source.embodiments[0].shareMemories = true;
  for (const change of [{ audience: 'private' }, { agentId: 'bert' }, { worldId: 'cubechat:other' }]) {
    assert.throws(() => createResidentProfile(source, 'cubechat:room', { memories: [{ ...publicEpisode(), ...change }] }), /explicitly shared world memories/);
  }
  assert.throws(() => createResidentProfile(source, 'cubechat:room', { memories: Array(RESIDENT_PROFILE_MEMORY_LIMITS.entries + 1).fill(publicEpisode()) }), /Too many/);
  const profile = createResidentProfile(source, 'cubechat:room', { memories: [publicEpisode()] });
  for (const change of [{ audience: 'private' }, { sourceAgentId: 'bert' }, { conversationId: '' },
    { text: '😀'.repeat(513) }, { source: { ...publicEpisode().source, privateHistory: 'secret' } }]) {
    assert.throws(() => normalizeResidentProfile({ ...profile, memories: [{ ...profile.memories[0], ...change }] }, { worldId: 'cubechat:room' }));
  }
  assert.throws(() => normalizeResidentProfile(profile, { worldId: 'cubechat:other' }), /world mismatch/);
});


test('full retained profiles preserve more than eight chronological episodes and private scopes only with both grants', () => {
  const source = head(); source.embodiments[0].shareMemories = true;
  const memories = Array.from({ length: 40 }, (_, i) => ({ ...publicEpisode(), when: 1200 + i,
    text: `Remember episode ${i}`, source: { ...publicEpisode().source, eventId: `episode-${i}` } }));
  const profile = createResidentProfile(source, 'cubechat:room', { memories });
  assert.equal(profile.memories.length, 40); assert.equal(profile.memories[0].text, 'Remember episode 0');
  assert.equal(profile.memories.at(-1).text, 'Remember episode 39');
  const privateMemories = ['owner-chat', 'visitor-a', 'visitor-b'].map(conversationId => ({ ...publicEpisode(), audience: 'private', conversationId }));
  assert.throws(() => createResidentProfile(source, 'cubechat:room', { memories: privateMemories }), /explicitly shared/);
  source.embodiments[0].sharePrivateMemories = true;
  const combined = createResidentProfile(source, 'cubechat:room', { memories: [...memories, ...privateMemories] });
  assert.deepEqual(combined.memories.slice(-3).map(memory => [memory.audience, memory.conversationId]),
    privateMemories.map(memory => [memory.audience, memory.conversationId]));
  assert.throws(() => normalizeResidentProfile(combined, { worldId: 'cubechat:room' }), /audience/);
  assert.deepEqual(normalizeResidentProfile(combined, { worldId: 'cubechat:room', includePrivate: true }), combined);
  source.embodiments[0].shareMemories = false;
  assert.equal(createResidentProfile(source, 'cubechat:room', { memories: privateMemories }).memories, undefined);
});

test('full-history profiles enforce both the 4096 episode and aggregate 4.5 MiB bounds', () => {
  const source = head(); source.embodiments[0].shareMemories = true;
  const minimal = { ...publicEpisode(), text: '', outcome: '' };
  const profile = createResidentProfile(source, 'cubechat:room', { memories: Array(4096).fill(minimal) });
  assert.equal(profile.memories.length, 4096);
  assert(Buffer.byteLength(JSON.stringify(profile)) < RESIDENT_PROFILE_MAX_BYTES);
  assert.throws(() => createResidentProfile(source, 'cubechat:room', {
    memories: Array(4096).fill({ ...publicEpisode(), text: 'a'.repeat(2048) }) }), /profile exceeds its byte budget/);
});

test('profile identity accepts core-sized instructions and goals while retaining its 64 KiB aggregate bound', () => {
  const source = head(); source.identity.instructions = 'i'.repeat(16 * 1024);
  source.goals = Array.from({ length: 10 }, (_, i) => `${i}`.padEnd(4096, 'g'));
  const profile = createResidentProfile(source, 'cubechat:room');
  assert(Buffer.byteLength(JSON.stringify(profile)) > 56 * 1024);
  assert.deepEqual(normalizeResidentProfile(profile), profile);
  assert.throws(() => normalizeResidentProfile({ ...profile, instructions: 'i'.repeat(16 * 1024 + 1) }), /instructions/);
  assert.throws(() => normalizeResidentProfile({ ...profile, goals: ['g'.repeat(4097)] }), /goal/);
  assert.throws(() => normalizeResidentProfile({ ...profile, goals: Array(16).fill('g'.repeat(4096)) }), /identity exceeds/);
});

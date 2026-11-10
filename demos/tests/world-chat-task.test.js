import test from 'node:test';
import assert from 'node:assert/strict';
import { admitWorldChatTask } from '../shared/agents/WorldChatTask.js';

function fixture() {
  const message = 'Go to a distant place and then return here.', assigned = [];
  const options = { message, proposal: { objective: message, residentRevision: 8 }, agentId: 'ada', requesterId: 'human:owner',
    isOwner: () => true, getHead: async () => ({ revision: 8, status: 'idle' }),
    assign: async input => { assigned.push(input); return { goalId: 'accepted', status: 'ready' }; } };
  return { options, assigned };
}
test('only acknowledged durable assignment establishes task acceptance using the original owner message', async () => {
  const { options, assigned } = fixture();
  assert.equal((await admitWorldChatTask(options)).goalId, 'accepted');
  assert.equal(assigned[0].objective, options.message);
  assert.equal(assigned[0].requesterId, 'human:owner');
  options.assign = async () => { throw new Error('storage failed'); };
  await assert.rejects(admitWorldChatTask(options), /storage failed/);
});
test('visitors, stale revisions, pause, cancellation, forged or oversized proposals never persist tasks', async () => {
  for (const change of [ { isOwner: () => false }, { getHead: async () => ({ revision: 9 }) },
    { getHead: async () => ({ revision: 8, status: 'paused' }) }, { getHead: async () => ({ revision: 8, recoveryRequired: true }) },
    { proposal: { objective: 'rewritten', residentRevision: 8 } },
    { message: 'a'.repeat(1025), proposal: { objective: 'a'.repeat(1025), residentRevision: 8 } },
    { signal: AbortSignal.abort() } ]) {
    const { options, assigned } = fixture();
    await assert.rejects(admitWorldChatTask({ ...options, ...change })); assert.deepEqual(assigned, []);
  }
});
test('ownership and cancellation are rechecked after asynchronous head read', async () => {
  for (const cancel of [true, false]) {
    const { options, assigned } = fixture(), controller = new AbortController(); let owner = true;
    options.signal = controller.signal; options.isOwner = () => owner;
    options.getHead = async () => { if (cancel) controller.abort(); else owner = false; return { revision: 8 }; };
    await assert.rejects(admitWorldChatTask(options)); assert.deepEqual(assigned, []);
  }
});

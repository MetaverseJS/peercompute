import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldAppearancePresenter } from '../shared/agents/WorldAppearancePresenter.js';

const tick = () => new Promise(resolve => setImmediate(resolve));
const body = (key, hash = 'a', local = false) => ({ key, agentId: key, ownerPeerId: 'owner', local, face: { sha256: hash } });
function fixture() {
  const reads = [], applied = [], errors = [];
  const read = (...args) => new Promise((resolve, reject) => reads.push({ args, resolve, reject }));
  const presenter = createWorldAppearancePresenter({ appearance: { getLocal: read, loadRemote: read },
    adapter: { setAppearance: (...args) => applied.push(args) }, getNetwork: () => ({ requestAppearance() {} }),
    onError: value => errors.push(value) });
  return { presenter, reads, applied, errors };
}
test('bounded reads apply each digest once, use local persistence and restore original face when cleared', async () => {
  const { presenter, reads, applied } = fixture(), bodies = [body('one', 'a', true), body('two'), body('three')];
  presenter.sync(bodies); await tick(); assert.equal(reads.length, 2); assert.equal(reads[0].args[0], 'one');
  reads[0].resolve({ pixels: 1 }); reads[1].resolve({ pixels: 2 }); await tick();
  presenter.sync(bodies); await tick(); assert.equal(reads.length, 3); reads[2].resolve({ pixels: 3 }); await tick();
  presenter.sync(bodies); await tick(); assert.equal(reads.length, 3); assert.equal(applied.length, 3);
  presenter.sync([{ ...bodies[0], face: undefined }]); assert.deepEqual(applied.at(-1), ['one', null]);
  await presenter.dispose(); assert.equal(presenter.getStatus().pending, 0);
});
test('digest change, removal and shutdown suppress late textures and await actual cleanup', async () => {
  const { presenter, reads, applied } = fixture();
  presenter.sync([body('one')]); await tick(); presenter.sync([body('one', 'b')]);
  assert.equal(reads[0].args[1].signal.aborted, true); reads[0].resolve({ stale: true }); await tick();
  assert.equal(applied.length, 0); presenter.sync([body('one', 'b')]); await tick();
  presenter.sync([]); reads[1].resolve({ removed: true }); await tick(); assert.equal(applied.length, 0);
  presenter.sync([body('two')]); await tick(); let done = false;
  const closing = presenter.dispose().then(() => { done = true; }); await tick(); assert.equal(done, false);
  reads[2].resolve({ late: true }); await closing; assert.equal(applied.length, 0);
});
test('a failed transport remains retryable on a later directory tick without an automatic retry loop', async () => {
  const { presenter, reads, applied, errors } = fixture();
  presenter.sync([body('one')]); await tick(); reads[0].reject(new Error('owner offline')); await tick();
  assert.equal(errors.length, 1); assert.equal(reads.length, 1);
  presenter.sync([body('one')]); await tick(); reads[1].resolve({ pixels: true }); await tick();
  assert.equal(applied.length, 1); await presenter.dispose();
});

test('same pixel digest with a different shape replaces the texture geometry', async () => {
  const { presenter, reads, applied } = fixture(), first = body('one');
  first.face = { ...first.face, width: 1, height: 2, channels: 4 };
  presenter.sync([first]); await tick(); reads[0].resolve({ width: 1, height: 2 }); await tick();
  presenter.sync([{ ...first, face: { ...first.face, width: 2, height: 1 } }]); await tick();
  assert.equal(reads.length, 2); reads[1].resolve({ width: 2, height: 1 }); await tick();
  assert.deepEqual(applied.at(-1), ['one', { width: 2, height: 1 }]); await presenter.dispose();
});

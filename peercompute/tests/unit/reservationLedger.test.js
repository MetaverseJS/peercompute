import assert from 'node:assert/strict';
import test from 'node:test';
import { ReservationLedger } from '../../src/peercompute/stateManager/ReservationLedger.js';

// Bounded model: one ledger in one realm; consumers are interleaved async
// tasks. These tests make no distributed claim.

const yieldRandomly = (rand) => new Promise((resolve) => {
  const r = rand();
  if (r < 0.3) resolve(); else if (r < 0.7) queueMicrotask(resolve); else setTimeout(resolve, 0);
});
const lcg = (seed) => () => { seed = (seed * 1103515245 + 12345) >>> 0; return seed / 4294967296; };

test('single winner: 64 interleaved consumers race for one key', async () => {
  const ledger = new ReservationLedger({ name: 'race' });
  const rand = lcg(7);
  const results = await Promise.all(Array.from({ length: 64 }, async (_, i) => {
    await yieldRandomly(rand);
    return ledger.reserve({ key: 'token', consumerId: `c${i}`, expectedEpoch: 0 });
  }));
  const winners = results.filter((r) => r.ok);
  assert.equal(winners.length, 1);
  assert.ok(results.filter((r) => !r.ok).every((r) => r.reason === 'busy' && r.owner === winners[0].token.owner));
});

test('exactly-once commit; replay and later reservations are refused', () => {
  const ledger = new ReservationLedger();
  const { token } = ledger.reserve({ key: 'k', consumerId: 'a' });
  assert.deepEqual({ ...ledger.commit(token, { admissionId: 'adm-1' }) }, { ok: true, admissionId: 'adm-1', epoch: 0 });
  assert.equal(ledger.commit(token).reason, 'replay');
  assert.equal(ledger.reserve({ key: 'k', consumerId: 'b' }).reason, 'consumed');
  assert.equal(ledger.snapshot().counters.committed, 1);
});

test('loser retry after cancellation; cancellation releases resources once', () => {
  const ledger = new ReservationLedger();
  const winner = ledger.reserve({ key: 'k', consumerId: 'a', expectedEpoch: 0 }).token;
  const loser = ledger.reserve({ key: 'k', consumerId: 'b', expectedEpoch: 0 });
  assert.equal(loser.reason, 'busy');
  let released = 0;
  assert.ok(ledger.attach(winner, () => { released += 1; }).ok);
  assert.ok(ledger.cancel(winner).ok);
  assert.equal(released, 1);
  assert.equal(ledger.cancel(winner).reason, 'not-owner');
  assert.equal(ledger.commit(winner).reason, 'not-owner', 'a cancelled token cannot commit');
  const retry = ledger.reserve({ key: 'k', consumerId: 'b', expectedEpoch: loser.epoch });
  assert.ok(retry.ok);
  assert.ok(ledger.commit(retry.token).ok);
  assert.equal(released, 1);
});

test('epoch fencing: retirement invalidates old tokens and expected epochs', () => {
  const ledger = new ReservationLedger();
  const old = ledger.reserve({ key: 'k', consumerId: 'a' }).token;
  let released = 0;
  ledger.attach(old, () => { released += 1; });
  assert.deepEqual({ ...ledger.retire('k') }, { ok: true, epoch: 1 });
  assert.equal(released, 1, 'retirement releases the reservation resources');
  assert.equal(ledger.commit(old).reason, 'stale-epoch');
  assert.equal(ledger.cancel(old).reason, 'stale-epoch');
  assert.equal(ledger.reserve({ key: 'k', consumerId: 'b', expectedEpoch: 0 }).reason, 'stale-epoch');
  assert.equal(ledger.retire('k', { expectedEpoch: 0 }).reason, 'stale-epoch');
  const fresh = ledger.reserve({ key: 'k', consumerId: 'b', expectedEpoch: 1 });
  assert.ok(fresh.ok && fresh.token.epoch === 1);
  // A committed reservation keeps its resources until retirement.
  ledger.attach(fresh.token, () => { released += 1; });
  ledger.commit(fresh.token);
  assert.equal(released, 1);
  ledger.retire('k');
  assert.equal(released, 2);
});

test('tokens are bound to their ledger (restart cannot replay)', () => {
  const first = new ReservationLedger({ name: 'same' });
  const token = first.reserve({ key: 'k', consumerId: 'a' }).token;
  const restarted = new ReservationLedger({ name: 'same' });
  restarted.reserve({ key: 'k', consumerId: 'b' });
  assert.equal(restarted.commit(token).reason, 'foreign-ledger');
});

test('bounded capacity and destruction release every resource exactly once', () => {
  const ledger = new ReservationLedger({ maxKeys: 3 });
  let released = 0;
  for (const key of ['a', 'b', 'c']) {
    const { token } = ledger.reserve({ key, consumerId: key });
    ledger.attach(token, () => { released += 1; });
  }
  assert.equal(ledger.reserve({ key: 'd', consumerId: 'd' }).reason, 'capacity');
  assert.equal(ledger.destroy(), true);
  assert.equal(ledger.destroy(), false);
  assert.equal(released, 3);
  assert.equal(ledger.reserve({ key: 'a', consumerId: 'x' }).reason, 'destroyed');
  assert.equal(ledger.snapshot().liveResources, 0);
});

test('randomized model check: invariants hold under interleaved consumers', async () => {
  for (const seed of [1, 2, 3, 4, 5]) {
    const rand = lcg(seed * 7919);
    const ledger = new ReservationLedger({ maxKeys: 16 });
    const keys = ['k0', 'k1', 'k2', 'k3'];
    const attached = new Map();
    const releasedById = new Map();
    const admissions = new Set();
    const consumedEpochs = new Map();
    let resourceSerial = 0;
    const consumer = async (id) => {
      for (let op = 0; op < 60; op++) {
        await yieldRandomly(rand);
        const key = keys[Math.floor(rand() * keys.length)];
        const fence = ledger.fence(key);
        const res = ledger.reserve({ key, consumerId: id, expectedEpoch: fence.epoch });
        if (!res.ok) {
          if (rand() < 0.1) ledger.retire(key);
          continue;
        }
        const rid = ++resourceSerial;
        attached.set(rid, res.token);
        ledger.attach(res.token, () => releasedById.set(rid, (releasedById.get(rid) ?? 0) + 1));
        await yieldRandomly(rand);
        // Invariant: while we hold it, the fence names us as owner.
        const live = ledger.fence(key);
        if (live.epoch === res.token.epoch) assert.equal(live.owner, id);
        const choice = rand();
        if (choice < 0.5) {
          const done = ledger.commit(res.token);
          if (done.ok) {
            assert.ok(!admissions.has(done.admissionId), 'admission ids are unique');
            admissions.add(done.admissionId);
            const epochKey = `${key}@${res.token.epoch}`;
            assert.ok(!consumedEpochs.has(epochKey), 'each (key, epoch) is consumed at most once');
            consumedEpochs.set(epochKey, id);
            assert.equal(ledger.commit(res.token).reason, 'replay');
          } else {
            assert.equal(done.reason, 'stale-epoch', 'only a retirement can beat a live owner');
          }
        } else if (choice < 0.8) {
          const cancelled = ledger.cancel(res.token);
          assert.ok(cancelled.ok || cancelled.reason === 'stale-epoch');
        } else {
          ledger.retire(key);
        }
      }
    };
    await Promise.all(Array.from({ length: 12 }, (_, i) => consumer(`c${i}`)));
    ledger.destroy();
    // Every attached resource was released exactly once by the end.
    for (const rid of attached.keys()) assert.equal(releasedById.get(rid), 1, `resource ${rid} released once`);
    const counters = ledger.snapshot().counters;
    assert.equal(counters.committed, admissions.size);
    assert.equal(counters.released, attached.size);
    assert.equal(counters.releaseErrors, 0);
  }
});

test('StateManager owns reservation ledgers, mirrors audit records, and releases on destroy', async () => {
  const { StateManager } = await import('../../src/peercompute/stateManager/StateManager.js');
  const manager = new StateManager();
  const ledger = manager.createReservationLedger({ name: 'tokens', auditNamespace: 'reservation-audit' });
  assert.equal(manager.getReservationLedger('tokens'), ledger);
  assert.throws(() => manager.createReservationLedger({ name: 'tokens' }), /registered/);
  const { token } = ledger.reserve({ key: 'schedule-7', consumerId: 'lane-a' });
  let released = 0;
  ledger.attach(token, () => { released += 1; });
  ledger.commit(token, { admissionId: 'adm-7' });
  const audit = manager.readScoped('reservation-audit', 'schedule-7');
  assert.equal(audit?.event, 'commit');
  assert.equal(audit?.admissionId, 'adm-7');
  // The audit record is evidence, not authority: overwriting it changes nothing.
  manager.writeScoped('reservation-audit', 'schedule-7', { event: 'forged' });
  assert.equal(ledger.reserve({ key: 'schedule-7', consumerId: 'lane-b' }).reason, 'consumed');
  await manager.destroy();
  assert.equal(released, 1);
  assert.equal(manager.getReservationLedger('tokens'), null);
});

test('destroy rejects new attachments before, during and after resource cleanup', () => {
  const ledger = new ReservationLedger();
  const token = ledger.reserve({ key: 'k', consumerId: 'a' }).token;
  const observed = {};
  ledger.attach(token, () => {
    observed.destroyed = ledger.snapshot().destroyed;
    observed.attach = ledger.attach(token, () => {});
    observed.reserve = ledger.reserve({ key: 'new', consumerId: 'b' });
    observed.nestedDestroy = ledger.destroy();
  });
  assert.equal(ledger.destroy(), true);
  assert.equal(observed.destroyed, true);
  assert.equal(observed.attach.reason, 'destroyed');
  assert.equal(observed.reserve.reason, 'destroyed');
  assert.equal(observed.nestedDestroy, false);
  assert.equal(ledger.attach(token, () => {}).reason, 'destroyed');
  assert.equal(ledger.snapshot().liveResources, 0);
  assert.equal(ledger.snapshot().counters.releaseErrors, 0);
  assert.equal(ledger.snapshot().counters.released, 1);
});

test('retirement fences old tokens before callbacks and retains callback-created ownership', () => {
  const ledger = new ReservationLedger();
  const old = ledger.reserve({ key: 'k', consumerId: 'a' }).token;
  const observed = {};
  let freshReleased = 0;
  ledger.attach(old, () => {
    observed.fence = ledger.fence('k');
    observed.oldCommit = ledger.commit(old);
    observed.oldAttach = ledger.attach(old, () => {});
    observed.fresh = ledger.reserve({ key: 'k', consumerId: 'b', expectedEpoch: 1 });
    observed.freshAttach = ledger.attach(observed.fresh.token, () => { freshReleased += 1; });
    observed.freshCommit = ledger.commit(observed.fresh.token);
  });
  assert.deepEqual(ledger.retire('k'), { ok: true, epoch: 1 });
  assert.deepEqual(observed.fence, { epoch: 1, state: 'free', owner: null });
  assert.equal(observed.oldCommit.reason, 'stale-epoch');
  assert.equal(observed.oldAttach.reason, 'stale-epoch');
  assert.ok(observed.fresh.ok && observed.freshAttach.ok && observed.freshCommit.ok);
  assert.deepEqual(ledger.fence('k'), { epoch: 1, state: 'consumed', owner: 'b' });
  assert.equal(ledger.snapshot().liveResources, 1);
  assert.equal(freshReleased, 0);
  assert.ok(ledger.retire('k', { expectedEpoch: 1 }).ok);
  assert.equal(freshReleased, 1);
  assert.equal(ledger.snapshot().counters.released, 2);
  assert.equal(ledger.snapshot().counters.releaseErrors, 0);
});

test('cancellation result and audit describe its own transition despite nested retirement', () => {
  const events = [];
  const ledger = new ReservationLedger({ audit: (event) => events.push(event) });
  const token = ledger.reserve({ key: 'k', consumerId: 'a' }).token;
  ledger.attach(token, () => ledger.retire('k'));
  assert.deepEqual(ledger.cancel(token), { ok: true, epoch: 0 });
  assert.equal(ledger.fence('k').epoch, 1);
  assert.deepEqual(events.map(({ event, epoch, state }) => [event, epoch, state]),
    [['reserve', 0, 'reserved'], ['cancel', 0, 'free'], ['retire', 1, 'free']]);
});

test('audit callbacks cannot rewrite the returned reservation or commit receipt', () => {
  let onAudit = () => {};
  const ledger = new ReservationLedger({ audit: (event) => onAudit(event) });
  onAudit = ({ event }) => { if (event === 'reserve') ledger.retire('k'); };
  const result = ledger.reserve({ key: 'k', consumerId: 'a' });
  assert.ok(result.ok);
  assert.deepEqual([result.token.epoch, result.token.reservationId, result.token.owner], [0, 1, 'a']);
  assert.equal(ledger.commit(result.token).reason, 'stale-epoch');
  onAudit = () => {};
  const next = ledger.reserve({ key: 'k', consumerId: 'b', expectedEpoch: 1 }).token;
  onAudit = ({ event }) => { if (event === 'commit') ledger.retire('k'); };
  assert.deepEqual(ledger.commit(next, { admissionId: 'original' }), { ok: true, admissionId: 'original', epoch: 1 });
  assert.equal(ledger.fence('k').epoch, 2);
});

test('release errors cannot skip remaining resources or reopen destroyed authority', () => {
  const ledger = new ReservationLedger();
  const a = ledger.reserve({ key: 'a', consumerId: 'a' }).token;
  const b = ledger.reserve({ key: 'b', consumerId: 'b' }).token;
  const calls = [];
  ledger.attach(a, () => { calls.push('throw'); throw new Error('owned cleanup failure'); });
  ledger.attach(a, () => calls.push('second'));
  ledger.attach(b, () => calls.push('other-key'));
  assert.ok(ledger.destroy());
  assert.deepEqual(calls, ['throw', 'second', 'other-key']);
  assert.equal(ledger.snapshot().counters.releaseErrors, 1);
  assert.equal(ledger.snapshot().counters.released, 2);
  assert.equal(ledger.snapshot().liveResources, 0);
  assert.equal(ledger.destroy(), false);
});

test('a free or consumed record cannot accept a null-id attachment', () => {
  const ledger = new ReservationLedger();
  const token = ledger.reserve({ key: 'k', consumerId: 'a' }).token;
  ledger.cancel(token);
  const free = { ...token, reservationId: null, owner: null };
  assert.equal(ledger.attach(free, () => {}).ok, false);
  const next = ledger.reserve({ key: 'k', consumerId: 'b' }).token;
  ledger.commit(next);
  assert.equal(ledger.attach({ ...next, reservationId: null }, () => {}).ok, false);
  assert.equal(ledger.snapshot().liveResources, 0);
});

test('StateManager named-ledger destruction preserves a replacement created by cleanup', async () => {
  const { StateManager } = await import('../../src/peercompute/stateManager/StateManager.js');
  const manager = new StateManager();
  const first = manager.createReservationLedger({ name: 'tokens' });
  const token = first.reserve({ key: 'k', consumerId: 'old' }).token;
  let replacement;
  let replacementReleased = 0;
  first.attach(token, () => {
    replacement = manager.createReservationLedger({ name: 'tokens' });
    const fresh = replacement.reserve({ key: 'k', consumerId: 'new' }).token;
    replacement.attach(fresh, () => { replacementReleased += 1; });
  });
  assert.equal(manager.destroyReservationLedger('tokens'), true);
  assert.ok(replacement, 'cleanup could create a replacement after detachment');
  assert.equal(manager.getReservationLedger('tokens'), replacement);
  assert.equal(first.snapshot().counters.releaseErrors, 0);
  assert.equal(first.attach(token, () => {}).reason, 'destroyed');
  assert.equal(replacement.commit(token).reason, 'foreign-ledger');
  await manager.destroy();
  assert.equal(replacementReleased, 1);
  assert.equal(replacement.snapshot().liveResources, 0);
});

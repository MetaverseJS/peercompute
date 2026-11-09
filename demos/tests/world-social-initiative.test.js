import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as flush } from 'node:timers/promises';
import { createWorldSocialInitiative, WORLD_SOCIAL_LIMITS as L } from '../shared/agents/WorldSocialInitiative.js';

const resident = (id = 'ada', extra = {}) => ({ key: `local:${id}`, agentId: id, ownerPeerId: 'owner',
  local: true, shared: true, initiateConversations: true, available: true, name: id, status: 'idle', ...extra });
const human = (id = 'visitor', extra = {}) => ({ id: `human:${id}`, peerId: id, kind: 'human', name: 'Visitor', distance: 10, ...extra });
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; };

function fixture(t, options = {}) {
  const f = { clock: 0, bodies: [resident()], targets: [human()], calls: [], statuses: [], timers: new Map(), nextTimer: 0 };
  f.scheduler = createWorldSocialInitiative({ getResidents: () => f.bodies,
    observe: body => ({ self: { id: `resident:${body.ownerPeerId}:${body.agentId}` }, participants: f.targets }),
    decide: async input => { f.calls.push(input); return { status: 'spoken' }; },
    onStatus: status => f.statuses.push(status), now: () => f.clock,
    setTimer: (callback, ms) => { const id = ++f.nextTimer; f.timers.set(id, { callback, ms }); return id; },
    clearTimer: id => f.timers.delete(id), ...options });
  t?.after(() => f.scheduler.dispose()); return f;
}
async function poll(f, at = f.clock) { f.clock = at; await f.scheduler.tick(); await flush(); }
async function advance(f, to) {
  while (f.clock < to) await poll(f, Math.min(f.clock + 1000, to));
}

test('a nearby authenticated identity must dwell eight observed seconds before one model decision', async t => {
  const f = fixture(t);
  f.targets.push(human('boundary', { distance: 60 }), human('outside', { distance: 200 }),
    human('spoofed', { id: 'human:someone-else' }), human('visitor'));
  await poll(f); await advance(f, 7000); assert.equal(f.calls.length, 0);
  await advance(f, 8000); assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].target.id, 'human:visitor');
  assert.deepEqual(f.calls[0].observation.participants, [human()]);
  assert.equal(f.statuses.at(-1).status, 'spoken');
  await advance(f, 16000); assert.equal(f.calls.length, 1);
  assert.equal(f.timers.size, 1); assert.equal([...f.timers.values()][0].ms, 1000);
});

test('only shared opted local awake residents can initiate; unavailable hosts do not infer', async t => {
  const f = fixture(t, { dwellMs: 0 });
  f.bodies = [resident('remote', { local: false }), resident('private', { shared: false }),
    resident('off', { initiateConversations: false }), resident('paused', { status: 'paused' }),
    resident('recovering', { recoveryRequired: true }), resident('busy', { available: false }),
    resident('thinking', { status: 'thinking' }), resident('allowed')];
  await poll(f); assert.deepEqual(f.calls.map(call => call.resident.agentId), ['allowed']);
});

test('disappearance, boundary crossing, and suspended polling reset continuous dwell', async t => {
  const f = fixture(t);
  await poll(f); await advance(f, 7000);
  f.targets[0].distance = 60; await poll(f, 8000);
  f.targets[0].distance = 10; await poll(f, 9000); await advance(f, 16000);
  assert.equal(f.calls.length, 0);
  f.targets = []; await poll(f, 17000);
  f.targets = [human()]; await poll(f, 18000); await advance(f, 25000);
  assert.equal(f.calls.length, 0);
  await poll(f, 60000); assert.equal(f.calls.length, 0, 'A suspended tab does not establish dwell');
  await advance(f, 68000); assert.equal(f.calls.length, 1);
});

test('resident and same-target cooldowns survive rename, pause, and target reentry', async t => {
  const f = fixture(t, { dwellMs: 0 });
  await poll(f); assert.equal(f.calls.length, 1);
  f.bodies[0].initiateConversations = false; await poll(f, 1000);
  f.bodies[0].initiateConversations = true;
  f.targets.push(human('second')); await poll(f, 2000);
  assert.equal(f.calls.length, 1, 'Opt-out does not reset spent resident cooldown');
  f.targets[0].name = 'A different display name';
  await poll(f, 89999); assert.equal(f.calls.length, 1);
  await poll(f, 90000); assert.equal(f.calls.length, 2); assert.equal(f.calls[1].target.id, 'human:second');
  f.targets = []; await poll(f, 180000); f.targets = [human()]; await poll(f, 599999);
  assert.equal(f.calls.length, 2); await poll(f, 600000); assert.equal(f.calls.length, 3);
});

test('least recently attempted resident and encounter get the next bounded opportunity', async t => {
  const f = fixture(t, { dwellMs: 0, cooldownMs: 0, targetCooldownMs: 0 });
  f.bodies = [resident('ada'), resident('bea')];
  f.targets = [human('near', { distance: 1 }), human('far', { distance: 20 })];
  for (let at = 0; at < 4; at++) await poll(f, at);
  assert.deepEqual(f.calls.map(call => [call.resident.agentId, call.target.id]), [
    ['ada', 'human:near'], ['bea', 'human:near'], ['ada', 'human:far'], ['bea', 'human:far']
  ]);
});

test('no provider backs off thirty seconds without consuming ten minutes of encounter cooldown', async t => {
  const calls = [];
  const f = fixture(t, { dwellMs: 0, decide: async input => { calls.push(input); return { status: 'waiting-for-model' }; } });
  await poll(f); assert.equal(calls.length, 1); assert.equal(f.statuses.at(-1).status, 'waiting-for-model');
  await poll(f, 29999); assert.equal(calls.length, 1);
  await poll(f, 30000); assert.equal(calls.length, 2);
  await poll(f, 30001); assert.equal(calls.length, 2);
});

test('quiet is a real model result and consumes the same bounded opportunity as speech', async t => {
  const calls = [];
  const f = fixture(t, { dwellMs: 0, decide: async input => { calls.push(input); return { status: 'quiet' }; } });
  await poll(f); assert.equal(f.statuses.at(-1).status, 'quiet');
  await poll(f, 90000); assert.equal(calls.length, 1);
});

test('human interruption aborts stale work, holds the inference slot until cleanup, then respects quiet period', async t => {
  const gate = deferred(), calls = [];
  const f = fixture(t, { dwellMs: 0, cooldownMs: 0, targetCooldownMs: 0, decide: async input => {
    calls.push(input); if (calls.length === 1) await gate.promise; return { status: 'spoken' };
  } });
  await poll(f); f.scheduler.interrupt('human chat');
  assert.equal(calls[0].signal.aborted, true); assert.equal(calls[0].isCurrent(), false);
  await poll(f, 31000); assert.equal(calls.length, 1); assert(f.scheduler.getStatus().active);
  gate.resolve(); await flush(); await poll(f, 31000); assert.equal(calls.length, 2);
  f.scheduler.interrupt('manual request'); await poll(f, 60999); assert.equal(calls.length, 2);
  await poll(f, 61000); assert.equal(calls.length, 3);
});

test('target disappearance and changes of authority, state, or identity invalidate in-flight publication', async t => {
  for (const change of [f => { f.targets = []; }, f => { f.targets[0].distance = 60; },
    f => { f.bodies = []; }, f => { f.bodies[0].local = false; }, f => { f.bodies[0].shared = false; },
    f => { f.bodies[0].initiateConversations = false; }, f => { f.bodies[0].status = 'paused'; },
    f => { f.bodies[0].recoveryRequired = true; }, f => { f.bodies[0].instructions = 'New identity'; }]) {
    const gate = deferred(), calls = [], published = [];
    const f = fixture(t, { dwellMs: 0, decide: async input => {
      calls.push(input); await gate.promise; if (input.isCurrent()) published.push(input.target.id); return { status: 'spoken' };
    } });
    await poll(f); change(f); f.scheduler.sync();
    assert.equal(calls[0].signal.aborted, true); assert.equal(calls[0].isCurrent(), false);
    gate.resolve(); await flush(); assert.equal(published.length, 0);
  }
});

test('a manual reservation before dispatch blocks it, but its own busy status does not self-cancel', async t => {
  let f;
  f = fixture(t, { dwellMs: 0, decide: async input => {
    f.calls.push(input); f.bodies[0].available = false; f.bodies[0].status = 'thinking';
    f.scheduler.sync(); assert.equal(input.signal.aborted, false); assert.equal(input.isCurrent(), true);
    return { status: 'spoken' };
  } });
  const first = f.scheduler.tick(); f.bodies[0].available = false; await first; await flush();
  assert.equal(f.calls.length, 0);
  f.bodies[0].available = true; await poll(f, 600000);
  assert.equal(f.calls.length, 1); assert.equal(f.statuses.at(-1).status, 'spoken');
});

test('decision TTL aborts even when the provider ignores cancellation and prevents slot overlap', async t => {
  const gate = deferred(), calls = [];
  const f = fixture(t, { dwellMs: 0, decide: async input => { calls.push(input); await gate.promise; return { status: 'spoken' }; } });
  await poll(f); await poll(f, 59999); assert.equal(calls[0].signal.aborted, false);
  await poll(f, 60000); assert.equal(calls[0].signal.aborted, true); assert.equal(calls[0].isCurrent(), false);
  assert(f.scheduler.getStatus().active); assert.equal(calls.length, 1);
  gate.resolve(); await flush(); assert.equal(f.scheduler.getStatus().active, null);
  assert.equal(f.statuses.at(-1).status, 'cancelled');
});

test('clock rollback invalidates work and preserves remaining cooldown and human quiet time', async t => {
  const f = fixture(t, { dwellMs: 0 });
  await poll(f, 100000); assert.equal(f.calls.length, 1);
  await poll(f, 10000); assert.equal(f.scheduler.getStatus().quietUntil, 40000);
  await poll(f, 609999); assert.equal(f.calls.length, 1);
  await poll(f, 610000); assert.equal(f.calls.length, 2);
});

test('malformed, mismatched, asynchronous, and oversized scene snapshots fail closed without busy-looping', async t => {
  for (const observe of [() => null, () => ({ self: { id: 'wrong-resident' }, participants: [human()] }),
    async () => { throw Error('Async scene unavailable'); },
    body => ({ self: { id: `resident:${body.ownerPeerId}:${body.agentId}` }, participants: [human()], extra: 'x'.repeat(L.observationBytes) })]) {
    const f = fixture(t, { dwellMs: 0, observe }); await poll(f);
    assert.equal(f.calls.length, 0); assert.equal(f.statuses.at(-1).status, 'unavailable'); assert.equal(f.timers.size, 1);
  }
  const f = fixture(t, { dwellMs: 0, getResidents: async () => { throw Error('Unavailable residents'); } });
  await poll(f); assert.equal(f.calls.length, 0); assert.equal(f.statuses.at(-1).status, 'unavailable');
});

test('residents, targets, retention, and timers remain bounded across many changing scene participants', async t => {
  const f = fixture(t, { dwellMs: 60000 });
  f.bodies = Array.from({ length: 40 }, (_, index) => resident(`resident${index}`));
  f.targets = Array.from({ length: 40 }, (_, index) => human(`visitor${index}`, { distance: index + 1 }));
  await poll(f); assert.equal(f.scheduler.getStatus().residents, L.residents);
  assert.equal(f.scheduler.getStatus().encounters, L.encounters);
  f.targets = [human('new-visitor')]; await poll(f, 1000);
  assert.equal(f.scheduler.getStatus().encounters, L.encounters); assert.equal(f.timers.size, 1);
  f.targets = []; await poll(f, L.encounterRetentionMs + 1001);
  assert.equal(f.scheduler.getStatus().encounters, 0);
  const [, scheduled] = [...f.timers][0]; f.timers.clear(); scheduled.callback(); await flush();
  assert.equal(f.timers.size, 1);
});

test('dispose cancels work and timers, waits for callback cleanup, and rejects future dispatch', async () => {
  const gate = deferred(), calls = [];
  const f = fixture(null, { dwellMs: 0, decide: async input => { calls.push(input); await gate.promise; return { status: 'spoken' }; } });
  await poll(f); let finished = false; const closing = f.scheduler.dispose().then(() => { finished = true; });
  assert.equal(f.timers.size, 0); assert.equal(calls[0].signal.aborted, true);
  await flush(); assert.equal(finished, false); await poll(f, 900000); assert.equal(calls.length, 1);
  gate.resolve(); await closing; await f.scheduler.dispose();
  assert.deepEqual(f.scheduler.getStatus(), { closed: true, active: null, targetId: null, residents: 0, encounters: 0, quietUntil: 0 });
  f.scheduler.sync(); f.scheduler.interrupt(); assert.equal(f.timers.size, 0);
});

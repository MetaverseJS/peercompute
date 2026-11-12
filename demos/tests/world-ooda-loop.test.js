import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldOodaLoop, residentRecoveryDelay } from '../shared/agents/WorldOodaLoop.js';
const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
function fixture(t, options = {}) {
  let at = 1000;
  const f = { bodies: [{ key: 'local:a', agentId: 'a', local: true, revision: 1, autonomous: true, available: true, status: 'idle' }],
    cycles: [], recoveries: [], events: [], advance: ms => { at += ms; } };
  f.loop = createWorldOodaLoop({ getResidents: () => f.bodies, cycle: async value => { f.cycles.push(value); return {}; },
    recover: async body => { f.recoveries.push(body.agentId); f.bodies[0] = { ...f.bodies[0], status: 'idle', pauseCause: null }; },
    now: () => at, random: () => 0, setTimer: () => 1, clearTimer: () => {}, initialDelayMs: 0,
    onStatus: event => f.events.push(event), ...options });
  t.after(() => f.loop.dispose()); return f;
}
test('recovery delay stays within one to three minutes and rejects an invalid RNG', () => {
  assert.equal(residentRecoveryDelay(() => 0), 60000);
  assert.equal(residentRecoveryDelay(() => .5), 120000);
  assert.equal(residentRecoveryDelay(() => .999999), 180000);
  assert.throws(() => residentRecoveryDelay(() => 1));
});
test('healthy residents keep reflecting fairly beyond a finite batch', async t => {
  const f = fixture(t); f.bodies.push({ ...f.bodies[0], key: 'local:b', agentId: 'b' });
  for (let i = 0; i < 12; i++) { f.loop.tick(); await flush(); f.advance(60000); }
  assert.equal(f.cycles.length, 12); assert.deepEqual(f.cycles.slice(0, 4).map(x => x.resident.agentId), ['a', 'b', 'a', 'b']);
});
test('automatic pauses recover after jitter; owner pauses and disabled cycles are respected', async t => {
  const f = fixture(t); f.bodies[0] = { ...f.bodies[0], status: 'paused', pauseCause: 'automatic' };
  f.loop.tick(); f.advance(59999); f.loop.tick(); await flush(); assert.equal(f.recoveries.length, 0);
  f.advance(1); f.loop.tick(); await flush(); assert.deepEqual(f.recoveries, ['a']);
  f.bodies[0] = { ...f.bodies[0], status: 'paused', pauseCause: 'owner' };
  f.advance(180000); f.loop.tick(); await flush(); assert.equal(f.cycles.length, 0);
  f.bodies[0] = { ...f.bodies[0], status: 'idle', pauseCause: null, autonomous: false };
  f.loop.tick(); await flush(); assert.equal(f.cycles.length, 0);
});
test('owner pause wins just before automatic recovery dispatch', async t => {
  const f = fixture(t); f.bodies[0] = { ...f.bodies[0], status: 'paused', pauseCause: 'automatic' };
  f.loop.tick(); f.advance(60000); f.loop.tick();
  f.bodies[0] = { ...f.bodies[0], pauseCause: 'owner' };
  await flush(); assert.equal(f.recoveries.length, 0);
});
test('busy/no-model waits without permanently stopping and can run when capacity returns', async t => {
  let calls = 0;
  const f = fixture(t, { cycle: async () => { calls++; if (calls <= 5) throw Object.assign(Error('Full'), { code: 'ERR_INFERENCE_BUSY' }); } });
  for (let i = 0; i < 7; i++) { f.loop.tick(); await flush(); f.advance(5000); }
  assert.equal(calls, 6); assert.equal(f.events.filter(x => x.status === 'waiting').length, 5);
});
test('repeated real failures cool down but do not permanently halt the loop', async t => {
  let calls = 0;
  const f = fixture(t, { cycle: async () => { calls++; throw Error('Provider lost'); } });
  for (let i = 0; i < 5; i++) { f.loop.tick(); await flush(); f.advance(60000); }
  assert.equal(calls, 5); assert.equal(f.events.filter(x => x.status === 'recovering').length, 5);
});
test('human interruption invalidates stale work and retains slot until cleanup', async t => {
  let release, stale;
  const f = fixture(t, { cycle: async options => { stale = options; await new Promise(resolve => { release = resolve; }); } });
  f.loop.tick(); await flush(); const pending = f.loop.interrupt();
  assert(stale.signal.aborted); assert.equal(stale.isCurrent(), false);
  f.advance(180000); f.loop.tick(); assert(f.loop.getStatus().active);
  release(); await pending; assert.equal(f.loop.getStatus().active, null);
});

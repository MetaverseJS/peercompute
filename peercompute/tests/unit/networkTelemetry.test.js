import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { PeerInferenceService } from '../../src/peercompute/networkManager/inference/PeerInferenceService.js';
import { NetworkTelemetryService, normalizeNetworkTelemetry, NETWORK_TELEMETRY_TOPIC as TOPIC,
  NETWORK_TELEMETRY_TYPE as TYPE, NETWORK_TELEMETRY_SCHEMA as SCHEMA,
  NETWORK_TELEMETRY_LIMITS as LIMITS } from '../../src/peercompute/networkManager/NetworkTelemetryService.js';

const encoder = new TextEncoder();
const report = (peerId = 'peer-a') => ({ peerId, ts: 100, gameId: 'cubechat', roomId: 'global',
  topologyId: 'cubechat', topology: 'distributed', application: 'cubechat', role: 'world',
  isConnected: true, peerCount: 1, counts: { rx: 3, tx: 2 }, rates: { rxBps: 8 },
  peers: [{ peerId: 'peer-b', via: 'webrtc', mediaPath: 'direct' }],
  compute: { workerCount: 2, activeTaskCount: 1 }, models: [] });
const message = (snapshot = report(), extra = {}) => ({ topic: TOPIC, type: 'signed', from: snapshot.peerId,
  data: encoder.encode(JSON.stringify({ type: TYPE, schema: SCHEMA, instanceId: 'boot-1', sequence: 1, snapshot, ...extra })) });
function fixture(t, config = {}) {
  let time = 1000;
  const published = [];
  const manager = { config: { networkTelemetryPublish: false, ...config }, peerId: 'local', isConnected: true,
    libp2p: { services: { pubsub: { globalSignaturePolicy: 'StrictSign', publish: async (topic, data) => published.push({ topic, data }) } } },
    getTelemetrySnapshot: () => report('local') };
  const service = new NetworkTelemetryService(manager, { now: () => time });
  service.start(); t.after(() => service.stop());
  return { service, manager, published, advance: ms => { time += ms; } };
}

test('operational whitelist removes private and executable fields and bounds nested reports', () => {
  const input = { ...report(), prompt: 'SECRET', addresses: ['/ip4/1.2.3.4'], metric: { x: 123 },
    compute: { workerCount: 2, activeTaskCount: 1, tasks: [{ prompt: 'SECRET' }] },
    peers: Array.from({ length: 100 }, (_, i) => ({ peerId: `peer-${i}`, via: 'webrtc', address: 'SECRET', metric: { x: 2 } })),
    models: Array.from({ length: 100 }, (_, i) => ({ manifestCid: `cid-${i}`, name: 'N'.repeat(1000), task: 'text-generation',
      runtime: 'llama.cpp', modalities: ['text'], busy: i === 1, messages: ['SECRET'], file: 'SECRET' })) };
  const value = normalizeNetworkTelemetry(input);
  assert.equal(value.peers.length, LIMITS.maximumPeers);
  assert.equal(value.models.length, LIMITS.maximumModels);
  assert.equal(value.models[0].name.length, 160);
  assert.equal(value.compute.activeTasks, 1);
  assert.ok(!JSON.stringify(value).includes('SECRET'));
  assert.equal(value.metric, undefined);
  assert.equal(value.peers[0].metric, undefined);
});

test('signed sender binding, schema and byte admission reject spoofing without updating records', t => {
  const { service } = fixture(t);
  assert.equal(service.handlePubsubMessage(message()), true);
  assert.equal(service.list().length, 1);
  for (const bad of [
    { ...message(report('spoof')), from: 'real' },
    { ...message(report('unsigned')), type: 'unsigned' },
    message(report('schema'), { schema: 'wrong' }),
    { ...message(report('large')), data: new Uint8Array(LIMITS.maximumBytes + 1) },
    { ...message(report('malformed')), data: encoder.encode('{') }
  ]) assert.equal(service.handlePubsubMessage(bad), true);
  assert.equal(service.list().length, 1);
  assert.equal(service.handlePubsubMessage({ ...message(), topic: 'some-room' }), false);
  assert.equal(service.handlePubsubMessage({ ...message(), data: encoder.encode('{"type":"netviz-session-upsert"}') }), false);
});

test('local receipt freshness, rate limits, ordering and retired sessions prevent stale report revival', t => {
  const { service, advance } = fixture(t);
  service.handlePubsubMessage(message({ ...report(), ts: Number.MAX_SAFE_INTEGER }));
  advance(100); service.handlePubsubMessage(message(report(), { sequence: 2 }));
  assert.equal(service.order.get('peer-a').sequence, 1, 'per-sender rate gate');
  advance(500); service.handlePubsubMessage(message(report(), { sequence: 2 }));
  advance(1000); service.handlePubsubMessage(message(report(), { sequence: 1 }));
  assert.equal(service.order.get('peer-a').sequence, 2);
  service.handlePubsubMessage(message(report(), { instanceId: 'boot-2', sequence: 1 }));
  advance(1000); service.handlePubsubMessage(message(report(), { instanceId: 'boot-1', sequence: 3 }));
  assert.equal(service.order.get('peer-a').instanceId, 'boot-2');
  advance(LIMITS.staleMs); assert.equal(service.list()[0].stale, true);
  advance(LIMITS.expiryMs); assert.equal(service.list().length, 0, 'future publisher clock cannot extend TTL');
  service.handlePubsubMessage(message(report(), { instanceId: 'boot-2', sequence: 1 }));
  assert.equal(service.list().length, 0, 'expiry retains bounded ordering tombstone');
});

test('report and ordering tables are bounded independently of signed peer count', t => {
  const { service } = fixture(t);
  for (let i = 0; i < LIMITS.maximumReports + 20; i++) service.handlePubsubMessage(message(report(`peer-${i}`)));
  assert.equal(service.list().length, LIMITS.maximumReports);
  assert.equal(service.order.size, LIMITS.maximumReports);
});

test('provider ownership restores lower providers and never resurrects a released one', t => {
  const { service } = fixture(t);
  const a = () => ({}), b = () => ({}), c = () => ({});
  const releaseA = service.setProvider(a), releaseB = service.setProvider(b);
  assert.equal(service.provider, b); releaseB(); assert.equal(service.provider, a);
  const releaseC = service.setProvider(c); releaseA(); releaseC();
  assert.equal(service.provider, null);
});

test('publish includes only local hosted summaries, cancels provider work and restarts without leaked records', async t => {
  const { service, manager, published } = fixture(t);
  manager.config.networkTelemetryPublish = true;
  service.setProvider(() => ({ application: 'inference', role: 'models', compute: { workerCount: 3 }, prompt: 'SECRET' }));
  manager.getPeerInferenceService = () => ({ closed: false, getTelemetrySummary: async () => [{ manifestCid: 'cid', name: 'Model', task: 'text-generation', busy: true }] });
  await service.publish();
  assert.equal(published.length, 1);
  const packet = JSON.parse(new TextDecoder().decode(published[0].data));
  assert.equal(packet.snapshot.models[0].busy, true);
  assert.equal(packet.snapshot.application, 'inference');
  assert.ok(!JSON.stringify(packet).includes('SECRET'));
  assert.equal(service.list()[0].local, true);
  service.setProvider(() => new Promise(() => {}));
  const pending = service.publish(); await service.stop(); await pending;
  assert.equal(service.pending, null); assert.equal(service.list().length, 0);
  manager.config.networkTelemetryPublish = false;
  service.start(); assert.equal(service.getStatus().publishing, false);
});

test('manager defaults expose telemetry, opt-out does not subscribe, disabled consumers swallow new reports', t => {
  const enabled = new NetworkManager({ additionalPubsubTopics: ['legacy'] });
  assert.ok(enabled.additionalPubsubTopics.has(TOPIC));
  assert.ok(enabled.allowedTopics.has(TOPIC));
  const disabled = new NetworkManager({ enableNetworkTelemetry: false });
  assert.equal(disabled.additionalPubsubTopics.has(TOPIC), false);
  const { service } = fixture(t, { enableNetworkTelemetry: false });
  assert.equal(service.handlePubsubMessage(message()), true);
  assert.equal(service.list().length, 0);
});

test('hosted-summary timeout aborts callback signal and transmits an explicitly unavailable model state', async t => {
  const { service, manager, published } = fixture(t);
  manager.config.networkTelemetryPublish = true;
  let childSignal;
  manager.getPeerInferenceService = () => ({ getTelemetrySummary: ({ signal }) => {
    childSignal = signal; return new Promise(() => {});
  } });
  // Keep a test-owned handle while the production deadline is correctly unref'd.
  const keepAlive = setTimeout(() => {}, 2000); t.after(() => clearTimeout(keepAlive));
  await service.publish();
  assert.equal(childSignal.aborted, true);
  assert.equal(service.getStatus().error, 'Hosted-model telemetry unavailable');
  const packet = JSON.parse(new TextDecoder().decode(published[0].data));
  assert.equal(packet.snapshot.modelsStatus, 'unavailable');
  assert.deepEqual(packet.snapshot.models, []);
});

test('host telemetry never overlaps an application state callback that ignores abort', async () => {
  let calls = 0, resolveState;
  const service = new PeerInferenceService({}, { generate() {}, getLocalState: () => {
    calls++; return new Promise(resolve => { resolveState = resolve; });
  } });
  const first = new AbortController();
  const one = service.getTelemetrySummary({ signal: first.signal });
  await Promise.resolve(); first.abort(new Error('deadline one'));
  await assert.rejects(one, /deadline one/);
  const pending = service.telemetryStatePending, originalThen = pending.then;
  let additionalWaiters = 0;
  pending.then = function (...args) { additionalWaiters++; return originalThen.apply(this, args); };
  for (let i = 0; i < 100; i++) await assert.rejects(service.getTelemetrySummary(), /still pending/);
  assert.equal(additionalWaiters, 0, 'subsequent ticks do not attach listeners to a hung promise');
  assert.equal(calls, 1);
  resolveState({ sharedModels: [], hostedModels: [] });
  await Promise.resolve(); await Promise.resolve();
  assert.equal(service.telemetryStatePending, null);
});

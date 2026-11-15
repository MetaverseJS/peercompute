import test from 'node:test';
import assert from 'node:assert/strict';
import { MODEL_EVIDENCE_SCHEMA, normalizeModelEvidence, modelPackageFingerprint, evidenceApplicability,
  normalizeEvidenceQuery } from '../../src/peercompute/modelEvidence/ModelEvidenceContracts.js';

const fixture = () => ({ schema: MODEL_EVIDENCE_SCHEMA, observedAt: 123,
  source: { repository: 'fixture/model', revision: 'a'.repeat(40), packageFingerprint: 'b'.repeat(64) },
  compatibility: { clientBuild: 'build-1', inspectorVersion: '1', policyVersion: '1', runtime: 'llama.cpp', runtimeVersion: '3.8.1' },
  environment: { kind: 'browser', gpu: { features: ['shader-f16'] } },
  executorPeerId: 'peer-one', stage: 'generation', outcome: 'success' });

test('model evidence strips prompts, media, raw errors, arbitrary metadata at every boundary', () => {
  const input = fixture(); Object.assign(input, { prompt: 'SECRET', output: 'SECRET', image: new Uint8Array([1]), error: new Error('SECRET') });
  input.source.description = 'SECRET'; input.compatibility.metadata = 'SECRET'; input.environment.userAgent = 'SECRET';
  input.environment.gpu.limits = { maxBufferSize: 1024, secret: 'SECRET' };
  input.workload = { task: 'text-generation', inputTokens: 8, messages: ['SECRET'] };
  input.metrics = [{ name: 'estimatedGpuBytes', value: 100, unit: 'bytes', scope: 'model-planning-envelope', method: 'planner', prompt: 'SECRET' }];
  const normalized = normalizeModelEvidence(input);
  assert(!JSON.stringify(normalized).includes('SECRET')); assert(!Object.hasOwn(normalized, 'image'));
  assert.deepEqual(normalized.workload, { task: 'text-generation', inputTokens: 8 });
  assert.deepEqual(normalizeModelEvidence(normalized), normalized, 'normalization is idempotent');
  assert.match(normalized.id, /^sha256-[a-f0-9]{64}$/);
  assert.throws(() => normalizeModelEvidence({ ...normalized, outcome: 'failed' }), /identity/);
});

test('package identity follows immutable bytes, not filename alone or runtime labels', () => {
  const one = { path: 'model.gguf', size: 123, sha256: 'b'.repeat(64) }, two = { path: 'config.json', size: 2, gitBlobSha1: 'c'.repeat(40) };
  const fingerprint = modelPackageFingerprint([one, two]);
  assert.equal(fingerprint, modelPackageFingerprint([two, one]));
  assert.notEqual(fingerprint, modelPackageFingerprint([{ ...one, sha256: 'd'.repeat(64) }, two]));
  for (const files of [[one, one], [{ ...one, path: '../private' }], [{ ...one, path: 'https://private/model' }], [{ path: 'model', size: 1 }]]) {
    assert.throws(() => modelPackageFingerprint(files));
  }
  assert.throws(() => normalizeModelEvidence({ ...fixture(), source: { repository: 'fixture/model', revision: 'main' } }), /immutable/);
});

test('execution evidence distinguishes actual host and scoped observations from estimates', () => {
  const base = fixture();
  assert.throws(() => normalizeModelEvidence({ ...base, source: { repository: 'fixture/model', revision: 'a'.repeat(40) } }), /exact package/);
  for (const change of [{ executorPeerId: undefined }, { environment: { kind: 'unknown' } },
    { compatibility: { clientBuild: 'x', inspectorVersion: '1', policyVersion: '1' } }]) assert.throws(() => normalizeModelEvidence({ ...base, ...change }), /actual host/);
  const physical = { name: 'physicalGpuPeakBytes', value: 100, unit: 'bytes', scope: 'device', method: 'native-driver-sampler', sampleIntervalMs: 100 };
  assert.throws(() => normalizeModelEvidence({ ...base, metrics: [physical] }), /browser/);
  assert.equal(normalizeModelEvidence({ ...base, environment: { kind: 'native' }, metrics: [physical] }).metrics[0].scope, 'device');
  const buffers = { name: 'requestedGpuBufferPeakBytes', value: 4096, unit: 'bytes', scope: 'runtime-owned-buffers', method: 'allocation-counter' };
  assert.equal(normalizeModelEvidence({ ...base, metrics: [buffers] }).metrics[0].value, 4096);
  assert.throws(() => normalizeModelEvidence({ ...base, metrics: [{ ...buffers, scope: 'device' }] }), /scope/);
  for (const value of [Infinity, NaN, -1, '100', 1.2]) assert.throws(() => normalizeModelEvidence({ ...base, workload: { inputTokens: value } }));
  assert.throws(() => normalizeModelEvidence({ ...base, errorCode: 'my secret prompt' }));
});

test('runtime, policy and device changes require new evidence without erasing past outcomes', () => {
  const original = fixture(), record = normalizeModelEvidence(original);
  assert.deepEqual(evidenceApplicability(record, { compatibility: { ...original.compatibility, clientBuild: 'new-ui-build' }, environment: original.environment }),
    { current: true, changed: [], action: 'compare-workload' });
  assert.equal(evidenceApplicability(record, { compatibility: { ...original.compatibility, runtimeVersion: '4.0' } }).action, 'retest');
  assert.deepEqual(evidenceApplicability(record, { compatibility: original.compatibility, environment: { kind: 'browser', gpu: { features: [] } } }).changed, ['environment']);
  const inspected = normalizeModelEvidence({ ...original, stage: 'inspection', outcome: 'unsupported', reason: 'architecture-unsupported' });
  assert.equal(evidenceApplicability(inspected, { compatibility: { ...original.compatibility, inspectorVersion: '2' } }).action, 'reinspect');
  assert.equal(inspected.outcome, 'unsupported');
  assert.throws(() => normalizeEvidenceQuery({ limit: 51 }));
  assert.throws(() => normalizeEvidenceQuery({ revision: 'main' }));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { executionEvidence, inspectionEvidence, evidenceWorkload, evidenceSource } from '../../src/peercompute/modelEvidence/ModelEvidenceAdapters.js';
import { MODEL_EVIDENCE_SCHEMA, normalizeModelEvidence } from '../../src/peercompute/modelEvidence/ModelEvidenceContracts.js';
const manifest = { model: { repository: 'fixture/model', revision: 'a'.repeat(40), runtime: 'transformers.js', runtimeVersion: '4.0.0' },
  files: [{ path: 'model.onnx', size: 123, sha256: 'b'.repeat(64) }] };

test('execution facts omit all content and distinguish allocation counters from physical memory', () => {
  const facts = executionEvidence({ entry: { manifest, estimate: { cpuBytes: 1024, gpuBytes: 2048 } },
    stage: 'generation', result: { text: 'SECRET', inputTokens: 3, outputTokens: 7, peakBufferBytes: 8000, gpuDispatches: 12 },
    startedAt: performance.now(), workload: evidenceWorkload({ prompt: 'SECRET', image: { width: 8, height: 4, data: 'SECRET' } }, 'image-text-to-text') });
  const report = normalizeModelEvidence({ ...facts, schema: MODEL_EVIDENCE_SCHEMA, observedAt: 1, executorPeerId: 'host',
    environment: { kind: 'browser' }, compatibility: { clientBuild: 'test', policyVersion: '1', inspectorVersion: '1', runtime: facts.runtime, runtimeVersion: facts.runtimeVersion } });
  assert(!JSON.stringify(report).includes('SECRET'));
  assert.equal(report.workload.imageWidth, 8); assert.equal(report.workload.outputTokens, 7);
  assert.equal(report.metrics.find(value => value.name === 'requestedGpuBufferPeakBytes').scope, 'runtime-owned-buffers');
  assert.equal(report.metrics.find(value => value.name === 'estimatedGpuBytes').method, 'planner');
  assert(!report.metrics.some(value => value.name === 'physicalGpuPeakBytes'));
});

test('lazy inspection, access restrictions and actual incompatibility are different evidence', () => {
  const input = { repository: 'fixture/model', revision: 'a'.repeat(40), variants: [
    { ...manifest, loadable: false, requiresInspection: true, reason: 'Inspect this header' },
    { ...manifest, loadable: false, reason: 'Unsupported architecture' }, { ...manifest, loadable: true } ] };
  const result = inspectionEvidence(input);
  assert.deepEqual(result.map(value => value.outcome), ['incomplete', 'unsupported', 'success']);
  assert.equal(result[1].reason, 'architecture-unsupported');
  assert.equal(inspectionEvidence({ ...input, gated: true })[0].reason, 'access-required');
});


test('source selection matches before and after Git metadata becomes verified file bytes without conflating byte fingerprints', () => {
  const before = { ...manifest, files: [{ path: 'config.json', size: 128, gitBlobSha1: 'c'.repeat(40) }] };
  const after = { ...manifest, files: [{ path: 'config.json', size: 128, sha256: 'd'.repeat(64) }] };
  assert.equal(evidenceSource(before).selectionDigest, evidenceSource(after).selectionDigest);
  assert.notEqual(evidenceSource(before).packageFingerprint, evidenceSource(after).packageFingerprint);
  assert.notEqual(evidenceSource(before).selectionDigest, evidenceSource({ ...before, files: [{ ...before.files[0], path: 'other.json' }] }).selectionDigest);
});

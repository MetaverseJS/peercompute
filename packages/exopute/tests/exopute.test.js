import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');

test('packages/exopute/package.json exports ".", "./core", and "./inference"', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8'));
  assert.equal(pkg.name, 'exopute');
  assert.equal(pkg.license, 'MIT');
  assert.equal(pkg.exports['.'], './src/index.js');
  assert.equal(pkg.exports['./core'], './src/core.js');
  assert.equal(pkg.exports['./inference'], './src/inference.js');
});

test('exopute/core re-exports strictly peercompute/core without direct inference edges', async () => {
  const coreSrc = fs.readFileSync(path.join(pkgRoot, 'src/core.js'), 'utf8').trim();
  assert.equal(coreSrc, "export * from 'peercompute/core';");

  const exoputeCore = await import('../src/core.js');
  const peercomputeCore = await import('peercompute/core');
  for (const name of [
    'NodeKernel',
    'ComputeManager',
    'StateManager',
    'ReservationLedger',
    'SpatialTileLeaseBroker',
    'NetworkManager',
    'GPUHubManager',
    'RemoteResultQuorumValidator',
    'serviceOrchestration'
  ]) {
    assert.equal(exoputeCore[name], peercomputeCore[name], `exopute/core must re-export ${name}`);
  }
});

test('exopute full and inference entrypoints match peercompute', async () => {
  const exoputeFull = await import('../src/index.js');
  const peercomputeFull = await import('peercompute');
  assert.equal(exoputeFull.NodeKernel, peercomputeFull.NodeKernel);
  assert.equal(exoputeFull.SpatialTileLeaseBroker, peercomputeFull.SpatialTileLeaseBroker);

  const exoputeInference = await import('../src/inference.js');
  const peercomputeInference = await import('peercompute/inference');
  assert.equal(exoputeInference.ModelInferenceService, peercomputeInference.ModelInferenceService);
  assert.equal(exoputeInference.PeerInferenceService, peercomputeInference.PeerInferenceService);
});

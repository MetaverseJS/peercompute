import test from 'node:test';
import assert from 'node:assert/strict';
import { createModelNetworkTelemetry } from '../inference/src/modelNetworkTelemetry.js';

test('model connection reports current operational counts without private runtime state', () => {
  let active = 2, provider;
  const binding = createModelNetworkTelemetry({ application: 'cubechat', computeManager: {
    getStats: () => ({ workerCount: 4, activeTaskCount: active, queuedTaskCount: 1,
      totalTasksCompleted: 12, totalTasksFailed: 0, prompt: 'private', activeTaskGraphs: ['private'] })
  } });
  binding.attach({ setNetworkTelemetryProvider: next => { provider = next; } });
  assert.deepEqual(provider(), { application: 'cubechat', role: 'models', compute: {
    workerCount: 4, activeTasks: 2, queuedTasks: 1, totalTasksCompleted: 12, totalTasksFailed: 0
  } });
  active = 0;
  assert.equal(provider().compute.activeTasks, 0);
  binding.dispose();
});

test('reconnect reuses binding and disposal releases each owned or borrowed manager exactly once', () => {
  let installs = 0, releases = 0;
  const manager = () => ({ setNetworkTelemetryProvider() { installs++; return () => { releases++; }; } });
  const a = manager(), b = manager();
  const binding = createModelNetworkTelemetry();
  binding.attach(a); binding.attach(a); binding.attach(b);
  assert.equal(installs, 2);
  binding.dispose(); binding.dispose(); binding.attach(manager());
  assert.equal(releases, 2); assert.equal(installs, 2);
});

test('missing telemetry support remains compatible and invalid counters are not advertised', () => {
  let provider;
  const binding = createModelNetworkTelemetry({ computeManager: { getStats: () => ({
    workerCount: NaN, activeTaskCount: -1, queuedTaskCount: Infinity, totalTasksCompleted: 2.8
  }) } });
  binding.attach({}); binding.attach(null);
  binding.attach({ setNetworkTelemetryProvider: value => { provider = value; } });
  assert.deepEqual(provider().compute, { workerCount: 0, activeTasks: 0, queuedTasks: 0,
    totalTasksCompleted: 2, totalTasksFailed: 0 });
  binding.dispose();
});

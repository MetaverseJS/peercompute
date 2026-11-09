/** Bind operational compute counters to this runtime's model connection. */
export function createModelNetworkTelemetry({ computeManager, application = 'inference' } = {}) {
  const releases = new Map();
  let closed = false;
  const count = value => Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  const provider = () => {
    const stats = computeManager?.getStats?.() ?? {};
    return {
      application: String(application || 'inference').slice(0, 80),
      role: 'models',
      compute: {
        workerCount: count(stats.workerCount),
        activeTasks: count(stats.activeTaskCount),
        queuedTasks: count(stats.queuedTaskCount),
        totalTasksCompleted: count(stats.totalTasksCompleted),
        totalTasksFailed: count(stats.totalTasksFailed)
      }
    };
  };
  return {
    attach(manager) {
      if (closed || !manager || releases.has(manager) || !manager.setNetworkTelemetryProvider) return;
      releases.set(manager, manager.setNetworkTelemetryProvider(provider));
    },
    dispose() {
      closed = true;
      for (const release of releases.values()) release?.();
      releases.clear();
    }
  };
}

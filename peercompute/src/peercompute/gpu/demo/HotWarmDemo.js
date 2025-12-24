/**
 * Minimal demo: register a hot GPU buffer and commit a warm delta.
 */
export async function runHotWarmDemo({ gpuHub, stateManager, computeManager, device }) {
  if (!gpuHub || !stateManager || !computeManager) {
    throw new Error('gpuHub, stateManager, and computeManager are required');
  }
  if (!gpuHub.getHotStore().size && device) {
    gpuHub.setDevice(device);
  }

  if (!gpuHub.getHotBuffer('demo:positions')) {
    gpuHub.createHotBuffer('demo:positions', 16, 0x20, 'demo-positions');
  }

  computeManager.commitDelta({
    taskId: 'demo',
    payload: { status: 'ok' },
    version: 1
  });

  return {
    hotKeys: gpuHub.getHotStore().size,
    warm: stateManager.getWarmDeltas()
  };
}

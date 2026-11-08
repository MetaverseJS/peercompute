export function run({ value = 0, scope = 'nodekernel-two-kernel' } = {}) {
  return {
    value: {
      schema: 'peercompute.test.two-kernel-result.v0',
      doubled: value * 2
    },
    commitDelta: {
      taskId: 'remote-placement-module-task',
      scope,
      version: 1,
      payload: {
        doubled: value * 2
      }
    }
  };
}

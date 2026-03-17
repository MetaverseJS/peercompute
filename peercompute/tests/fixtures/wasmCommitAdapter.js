export function toCommitDelta({ returnValue, data }) {
  const sum = Number(returnValue);
  return {
    commitDelta: {
      taskId: data?.taskId || 'wasm-task',
      scope: data?.scope || 'deltas',
      version: data?.version || 1,
      payload: {
        sum,
        runtime: 'wasm'
      }
    },
    value: {
      sum,
      runtime: 'wasm'
    }
  };
}


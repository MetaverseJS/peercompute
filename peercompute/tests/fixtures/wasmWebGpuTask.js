export async function runWasmWebGPU({ wasm, webgpu, data }) {
  const sum = Number(wasm.callExport(data?.entry || 'add', data?.args || [0, 0]));
  return {
    commitDelta: {
      taskId: data?.taskId || 'wasm-webgpu-task',
      scope: data?.scope || 'deltas',
      version: data?.version || 1,
      payload: {
        sum,
        gpuSupported: webgpu.supported,
        runtime: 'wasm-webgpu'
      }
    },
    value: {
      sum,
      gpuSupported: webgpu.supported,
      runtime: 'wasm-webgpu'
    }
  };
}


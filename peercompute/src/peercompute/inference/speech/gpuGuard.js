/** A queue fence alone can succeed after failed GPU commands. Fail closed. */
export async function guardSpeechGpu({ getDevice, capture, operation, fail }) {
  let device, result, failure;
  const filters = [];
  const attach = (actual) => {
    if (device === actual) return;
    if (device) throw new Error('Speech runtime changed GPU device');
    device = actual;
    for (const filter of ['validation', 'out-of-memory', 'internal']) { device.pushErrorScope(filter); filters.push(filter); }
  };
  try {
    if (getDevice()) attach(getDevice());
    capture?.(attach);
    result = await operation();
    if (!device) throw new Error('Speech runtime did not create a WebGPU device');
    await device.queue.onSubmittedWorkDone();
  } catch (error) { failure = error; }
  finally { capture?.(null); }
  const errors = await Promise.all(filters.reverse().map(async (filter) => {
    try { return { filter, error: await device.popErrorScope() }; }
    catch (error) { return { filter, error }; }
  }));
  const gpuError = ['out-of-memory', 'internal', 'validation'].map((kind) => errors.find((item) => item.filter === kind && item.error)).find(Boolean);
  if (gpuError) {
    const error = new Error(gpuError.filter === 'out-of-memory'
      ? 'Model session lost: speech GPU out of memory. Unload other models or close GPU-heavy apps, then retry.'
      : `Model session lost: speech GPU ${gpuError.filter}: ${gpuError.error.message}`, { cause: gpuError.error });
    fail(error); throw error;
  }
  if (failure) throw failure;
  return result;
}

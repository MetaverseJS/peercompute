import checkpoint from './residentMotorCheckpoint.js';
import { MOTOR_INPUTS, validateMotorBatch, encodeMotorObservation, decodeMotorAction } from './motorContracts.js';

const taskModule = new URL('./residentMotorTask.js', import.meta.url).href;
const aborted = () => new DOMException('Resident motor closed', 'AbortError');
function waitForOperation(promise, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason ?? aborted());
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
    if (signal.aborted) abort();
  });
}

/** One reserved managed worker batches all local bodies. No neural inference runs on the UI thread. */
export function createResidentMotorService({ computeManager } = {}) {
  for (const name of ['submitTask', 'reserveWorkerAffinity', 'releaseWorkerAffinity', 'terminateWorkerAffinity', 'getWorkerAffinityState']) {
    if (typeof computeManager?.[name] !== 'function') throw new TypeError('Resident motor requires a managed worker lifecycle');
  }
  const sessionId = crypto.randomUUID(), affinityKey = `resident-motor:${sessionId}`, lifetime = new AbortController();
  let reserved = false, ready, active, closing, closed = false, status = 'idle', backend = null, failure = null, dispatches = 0;
  const submit = (command, data = {}, signal = lifetime.signal) => computeManager.submitTask({
    module: taskModule, exportName: 'handleResidentMotorTask', data: { command, sessionId, ...data },
    affinityKey, requireWorker: true, signal, suppressCommitDelta: true,
  });
  async function initialize() {
    if (ready) return ready;
    status = 'loading';
    // The shared resident policy survives cancellation of one body's request.
    // Only disposal or the bounded loading deadline cancels its initialization.
    const signal = AbortSignal.any([lifetime.signal, AbortSignal.timeout(10000)]);
    ready = (async () => {
      await computeManager.reserveWorkerAffinity(affinityKey); reserved = true;
      signal.throwIfAborted();
      const result = await submit('load', { policyId: checkpoint.policyId, weights: Float32Array.from(checkpoint.weights) }, signal);
      signal.throwIfAborted();
      if (result?.backend !== 'webgpu' || result.worker !== true || result.policyId !== checkpoint.policyId) throw new Error('Resident motor did not establish WebGPU worker execution');
      backend = result.backend; status = 'ready'; return result;
    })().catch(async error => {
      failure = error; status = closed ? 'closing' : 'error';
      if (reserved) {
        await computeManager.terminateWorkerAffinity(affinityKey, { reason: 'Resident motor initialization failed' });
        await computeManager.releaseWorkerAffinity(affinityKey); reserved = false;
      }
      throw error;
    });
    return ready;
  }
  function infer(batch, { signal } = {}) {
    if (closed) return Promise.reject(aborted());
    if (active) return Promise.reject(new Error('Resident motor inference is busy'));
    signal?.throwIfAborted(); const residents = validateMotorBatch(batch);
    const encoded = residents.map(item => encodeMotorObservation(item.observation));
    const inputs = new Float32Array(residents.length * MOTOR_INPUTS);
    encoded.forEach((item, i) => inputs.set(item.input, i * MOTOR_INPUTS));
    const combined = AbortSignal.any([lifetime.signal, ...(signal ? [signal] : []), AbortSignal.timeout(10000)]);
    active = (async () => {
      await waitForOperation(initialize(), combined); combined.throwIfAborted();
      if (!computeManager.getWorkerAffinityState(affinityKey)?.workerId) throw new Error('Resident motor worker was lost');
      status = 'running'; const result = await submit('infer', { inputs }, combined);
      combined.throwIfAborted();
      if (result?.backend !== 'webgpu' || result.worker !== true || result.policyId !== checkpoint.policyId
          || !(result.values instanceof Float32Array) || result.values.length !== residents.length * 2) throw new Error('Invalid resident motor worker result');
      dispatches = result.dispatches;
      return { backend, worker: true, policyId: checkpoint.policyId, dispatches,
        results: residents.map((item, i) => ({ id: item.id, acceleration: decodeMotorAction(result.values.subarray(i * 2, i * 2 + 2), encoded[i].direction) })) };
    })().catch(error => { if (error.name !== 'AbortError') failure = error; throw error; })
      .finally(() => { active = null; status = closed ? 'closing' : failure ? 'error' : backend ? 'ready' : 'loading'; });
    return active;
  }
  async function dispose() {
    if (closing) return closing;
    closed = true; status = 'closing'; lifetime.abort(aborted());
    closing = (async () => {
      await Promise.allSettled([ready, active].filter(Boolean));
      if (reserved) {
        try { await submit('unload', {}, AbortSignal.timeout(5000)); }
        catch { await computeManager.terminateWorkerAffinity(affinityKey, { reason: 'Resident motor disposal' }); }
        await computeManager.releaseWorkerAffinity(affinityKey); reserved = false;
      }
      status = 'closed'; backend = null;
    })().catch(error => { status = 'cleanup-failed'; closing = null; throw error; });
    return closing;
  }
  return { infer, dispose, getStatus: () => ({ status, backend, policyId: checkpoint.policyId, dispatches, reserved,
    error: failure?.message ?? null }) };
}

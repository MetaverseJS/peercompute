import { normalizeModelMemoryBudgets } from './modelDeviceCompatibility.js';

const GiB = 1024 ** 3;
const limit = (value) => Number.isSafeInteger(value) && value > 0 ? value : null;
const minimum = (a, b) => a === null ? b : b === null ? a : Math.min(a, b);

/** Console policy over the manager's real aggregate lease accounting. Browser
 * memory/VRAM telemetry is deliberately not inferred here. An injected manager
 * retains its owner's capacities; only the console's private manager is resized.
 */
export function createModelMemoryBudgets({ computeManager, owned = false, initial } = {}) {
  if (!computeManager || typeof owned !== 'boolean') throw new TypeError('Model budgets require a manager and explicit ownership');
  let configured = normalizeModelMemoryBudgets(initial);
  const get = () => ({ ...configured });
  const admissionOptions = { allowUnboundedMemory: owned, getMemoryBudgets: get };
  function initialResourceBudgets(units) {
    if (!Number.isInteger(units) || units < 1 || units > 8) throw new RangeError('Invalid resident capacity');
    // Preserve the pre-existing initialization policy for an injected manager
    // without a broker. ComputeManager ignores these when it already has one.
    return { cpu: { units, memoryBytes: owned ? configured.cpuBytes ?? 0 : 12 * GiB },
      gpu: { units, memoryBytes: owned ? configured.gpuBytes ?? 0 : 16 * GiB } };
  }
  function set(value) {
    const next = normalizeModelMemoryBudgets(value);
    if (owned) {
      const broker = computeManager.resourceBroker;
      if (!broker?.setMemoryBudgets) throw new Error('The owned model resource broker is not initialized');
      broker.setMemoryBudgets({ cpu: next.cpuBytes, gpu: next.gpuBytes });
    }
    configured = next;
    return get();
  }
  function status() {
    const pools = computeManager.resourceBroker?.reportPressure().pools ?? {};
    const result = { owned };
    for (const kind of ['cpu', 'gpu']) {
      const brokerBytes = limit(pools[kind]?.memoryBytes), configuredBytes = configured[`${kind}Bytes`];
      const budgetBytes = minimum(configuredBytes, brokerBytes);
      const reservedBytes = pools[kind]?.activeMemoryBytes ?? 0;
      result[kind] = { reservedBytes, budgetBytes, configuredBytes, brokerBytes,
        overBudget: budgetBytes !== null && reservedBytes > budgetBytes };
    }
    return result;
  }
  return { get, set, status, initialResourceBudgets, admissionOptions };
}

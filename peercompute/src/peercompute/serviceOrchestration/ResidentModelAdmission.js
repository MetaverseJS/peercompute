/** Keep explicit CPU/GPU envelopes admitted for the complete model lifetime. */
export class ResidentModelAdmission {
  constructor({ broker } = {}) {
    if (!broker?.requestLease || !broker.releaseLease || !broker.get || !broker.expireLeases) {
      throw new TypeError('ResourceLeaseBroker is required');
    }
    for (const kind of ['cpu', 'gpu']) {
      if (!(broker.reportPressure().pools[kind]?.memoryBytes > 0)) {
        throw new Error(`An explicit ${kind} memory budget is required for inference`);
      }
    }
    this.broker = broker;
  }

  async acquire({ sessionId, manifestCid, estimatedCpuBytes, estimatedGpuBytes }) {
    for (const bytes of [estimatedCpuBytes, estimatedGpuBytes]) {
      if (!Number.isSafeInteger(bytes) || bytes <= 0) throw new RangeError('Invalid resident memory envelope');
    }
    const leases = [];
    try {
      for (const [resourceKind, memoryBytes] of [['cpu', estimatedCpuBytes], ['gpu', estimatedGpuBytes]]) {
        leases.push(await this.broker.requestLease({ resourceKind, memoryBytes,
          rootTaskId: sessionId, serviceId: 'model-inference', units: 1,
          resident: true, preemptable: false, priorityClass: 'interactive', lifetime: 'owner',
          metadata: { manifestCid, policy: 'configured-resident-envelope' } }));
      }
    } catch (error) {
      await Promise.all(leases.map((lease) => this.broker.releaseLease(lease.leaseId)));
      throw error;
    }
    let released = false;
    // Browser suspension is not disposal. These allocations remain owned until
    // the model service acknowledges worker/runtime cleanup; no timer can prove it.
    const assertActive = () => {
      this.broker.expireLeases();
      if (released || leases.some((lease) => this.broker.get(lease.leaseId)?.status !== 'active')) {
        throw Object.assign(new Error('Resident admission was revoked or is unavailable; unload the model before reuse'),
          { code: 'ERR_RESIDENT_ADMISSION_INACTIVE' });
      }
    };
    return {
      leaseIds: leases.map((lease) => lease.leaseId),
      assertActive,
      // Explicit synchronous health API for cached readiness/discovery. Custom
      // admissions may instead expose only an asynchronous assertActive guard.
      assertActiveSync: assertActive,
      release: async () => {
        if (released) return;
        await Promise.all(leases.map((lease) => this.broker.releaseLease(lease.leaseId)));
        released = true;
      }
    };
  }
}

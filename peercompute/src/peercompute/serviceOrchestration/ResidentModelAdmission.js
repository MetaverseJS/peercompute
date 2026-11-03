/** Keep explicit CPU/GPU envelopes admitted for the complete model lifetime. */
export class ResidentModelAdmission {
  constructor({ broker, ttlMs = 30_000 } = {}) {
    if (!broker?.requestLease || !broker.renewLease) throw new TypeError('ResourceLeaseBroker is required');
    if (!Number.isSafeInteger(ttlMs) || ttlMs < 300) throw new RangeError('Invalid resident lease TTL');
    for (const kind of ['cpu', 'gpu']) {
      if (!(broker.reportPressure().pools[kind]?.memoryBytes > 0)) {
        throw new Error(`An explicit ${kind} memory budget is required for inference`);
      }
    }
    this.broker = broker;
    this.ttlMs = ttlMs;
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
          resident: true, preemptable: false, priorityClass: 'interactive', ttlMs: this.ttlMs,
          metadata: { manifestCid, policy: 'configured-resident-envelope' } }));
      }
    } catch (error) {
      await Promise.all(leases.map((lease) => this.broker.releaseLease(lease.leaseId)));
      throw error;
    }
    let released = false;
    let renewalError = null;
    const timer = setInterval(() => {
      Promise.all(leases.map((lease) => this.broker.renewLease(lease.leaseId, { ttlMs: this.ttlMs })))
        .catch((error) => { renewalError = error; clearInterval(timer); });
    }, Math.floor(this.ttlMs / 3));
    timer.unref?.();
    return {
      leaseIds: leases.map((lease) => lease.leaseId),
      assertActive: () => {
        this.broker.expireLeases();
        if (released || renewalError || leases.some((lease) => this.broker.get(lease.leaseId)?.status !== 'active')) {
          throw new Error('Resident admission expired or was revoked; unload the model before reuse');
        }
      },
      release: async () => {
        if (released) return;
        clearInterval(timer);
        await Promise.all(leases.map((lease) => this.broker.releaseLease(lease.leaseId)));
        released = true;
      }
    };
  }
}

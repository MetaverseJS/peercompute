// Minimal engine to sequence multiple domains (solvers).
// Domains may implement either `step(encoder, dt)` (preferred) or `step(dt)` (legacy `World`).
export class Engine {
  constructor(device) {
    this.device = device;
    this.domains = [];
  }

  addDomain(domain) {
    this.domains.push(domain);
    return domain;
  }

  /**
   * Step all domains.
   * - If a domain implements step(encoder, dt), a shared encoder is passed.
   * - If a domain only implements step(dt), it runs self-contained.
   */
  step(dt, encoder) {
    const hasExternalEncoder = Boolean(encoder);
    const cmdEncoder = encoder ?? this.device.createCommandEncoder({ label: "engine-step" });
    let anyRecorded = false;

    for (const domain of this.domains) {
      if (!domain || typeof domain.step !== "function") continue;
      if (domain.step.length >= 2) {
        domain.step(cmdEncoder, dt);
        anyRecorded = true;
      } else {
        domain.step(dt);
      }
    }

    if (!hasExternalEncoder) {
      const commandBuffer = cmdEncoder.finish();
      if (anyRecorded) {
        this.device.queue.submit([commandBuffer]);
      }
    }
  }
}

import {
  MPM_WORKGROUP_SIZE,
  DEFAULT_SIMULATION_CONSTANTS
} from "./schema.js";

const ceilDiv = (n, d) => Math.ceil(n / d);

/**
 * Minimal MLS-MPM domain scaffold.
 * Pipelines and bind groups are injected externally so this file stays agnostic of WGSL until kernels are wired.
 */
export class MpmDomain {
  constructor(device, options = {}) {
    this.device = device;
    this.constants = { ...DEFAULT_SIMULATION_CONSTANTS, ...(options.constants ?? {}) };
    this.iterations = options.iterations ?? 1;
    this.pipelines = {};
    this.bindGroups = {};
    this.particleCount = 0;
    this.gridCount = 0;
  }

  configure({ pipelines, bindGroups }) {
    this.pipelines = { ...pipelines };
    this.bindGroups = { ...bindGroups };
  }

  setCounts({ particleCount, gridCount }) {
    this.particleCount = particleCount ?? this.particleCount;
    this.gridCount = gridCount ?? this.gridCount;
  }

  step(encoder, dt) {
    if (!encoder) throw new Error("MpmDomain.step requires a command encoder");
    if (!this._hasPipelines()) throw new Error("MpmDomain pipelines not configured");
    const particleDispatch = ceilDiv(this.particleCount, MPM_WORKGROUP_SIZE);
    const gridDispatch = ceilDiv(this.gridCount, MPM_WORKGROUP_SIZE);

    for (let i = 0; i < this.iterations; i += 1) {
      this._runPass(encoder, "clearGrid", gridDispatch);
      this._runPass(encoder, "p2g1", particleDispatch);
      this._runPass(encoder, "p2g2", particleDispatch);
      this._runPass(encoder, "updateGrid", gridDispatch);
      this._runPass(encoder, "g2p", particleDispatch);
      if (this.pipelines.copyPosition && this.bindGroups.copyPosition) {
        this._runPass(encoder, "copyPosition", particleDispatch);
      }
    }
  }

  _runPass(encoder, name, dispatch) {
    const pipeline = this.pipelines[name];
    const bindGroup = this.bindGroups[name];
    if (!pipeline || !bindGroup) throw new Error(`Missing pipeline or bind group for ${name}`);
    const pass = encoder.beginComputePass({ label: `mpm-${name}` });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(dispatch);
    pass.end();
  }

  _hasPipelines() {
    return (
      this.pipelines.clearGrid &&
      this.pipelines.p2g1 &&
      this.pipelines.p2g2 &&
      this.pipelines.updateGrid &&
      this.pipelines.g2p &&
      this.bindGroups.clearGrid &&
      this.bindGroups.p2g1 &&
      this.bindGroups.p2g2 &&
      this.bindGroups.updateGrid &&
      this.bindGroups.g2p
    );
  }
}

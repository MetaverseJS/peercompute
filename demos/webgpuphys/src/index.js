import { World } from "./world.js";
import { initWebGPU, isWebGPUSupported } from "./device.js";
import { Vec3, Vec4, Quat, Mat3 } from "./math.js";
import { Engine } from "./engine.js";
import * as mpm from "./domains/mpm/index.js";
const VERSION = "1.0.0";
export {
  Engine,
  mpm,
  Mat3,
  Quat,
  VERSION,
  Vec3,
  Vec4,
  World,
  initWebGPU,
  isWebGPUSupported
};

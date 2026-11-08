import { createParticleRigidWorld } from '../particle-rigid/index.js';
import { MotorcycleController, createMotorcycleController } from './motorcycleController.js';
import { createMotorcycleRig } from './motorcycleRig.js';

export {
  CONTROL_FRAME_FIELDS,
  controlFramesEqual,
  createNeutralControlFrame,
  normalizeControlFrame,
} from './controlFrame.js';
export {
  createMotorcycleParticleClouds,
  createMotorcycleRig,
} from './motorcycleRig.js';
export {
  MotorcycleController,
  createMotorcycleController,
} from './motorcycleController.js';

export function createMotorcyclePhysics({
  world = null,
  worldOptions = {},
  rigOptions = {},
  controllerOptions = {},
} = {}) {
  const ownsWorld = world === null;
  const physicsWorld = world ?? createParticleRigidWorld(worldOptions);
  const rig = createMotorcycleRig(physicsWorld, rigOptions);
  const controller = createMotorcycleController(physicsWorld, rig, controllerOptions);
  return Object.freeze({
    world: physicsWorld,
    rig,
    controller,
    stepFrame(frameDt, controlFrame) {
      return physicsWorld.stepFrame(frameDt, controlFrame);
    },
    getTelemetry() {
      return {
        physics: physicsWorld.getTelemetry(),
        motorcycle: controller.getTelemetry(),
      };
    },
    reset() {
      controller.reset();
    },
    dispose() {
      controller.dispose();
      if (ownsWorld) physicsWorld.dispose();
    },
  });
}

export const createParticleMotorcycle = createMotorcyclePhysics;

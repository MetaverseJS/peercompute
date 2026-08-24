# Particle-rigid CPU physics

This ES-module package is the authoritative deterministic physics path for the
location motorcycle demo. Each rigid component owns a full pose/inertia state
and a body-local cloud of mass/collision spheres. It does not use the MPM domain
or GPU atomics.

The fixed-step world exposes bodies, hinge/prismatic/spring/fixed/distance
joints, bounded particle and swept-surface contacts, Coulomb or anisotropic
friction, force/torque application, snapshots, reset, and interpolated render
transforms. Capacity pressure is returned in telemetry and can be configured to
throw; grid occupancy is never silently discarded.

```js
import {
  createParticleRigidWorld,
  createPlaneSurfaceCollider,
} from './index.js';

const world = createParticleRigidWorld({ fixedDt: 1 / 120 });
world.addSurfaceCollider(createPlaneSurfaceCollider());
world.stepFrame(frameSeconds, controlFrame);
```

Simulation state is canonical `Float32Array` data. The accumulator, stable ID
ordering, fixed iteration count, and deterministic spatial hash make replay
repeatable on the same JavaScript engine. A future WebGPU backend must prove
short-horizon parity and snapshot fallback before it can be authoritative.

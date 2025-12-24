import * as CANNON from 'cannon-es';

export class PhysicsWorld {
  constructor() {
    this.world = null;
    this.bodies = new Map(); // Map player IDs to physics bodies
    this.init();
  }

  init() {
    // Create physics world
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -40, 0) // Stronger gravity for better feel
    });

    // Configure world properties for smooth, responsive physics
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 20; // More iterations for stability
    this.world.defaultContactMaterial.friction = 0.0001; // Very low friction for smooth movement
    this.world.defaultContactMaterial.restitution = 0.05; // Minimal bounciness

    // Create ground plane
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane()
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to be horizontal
    this.world.addBody(groundBody);
  }

  createPlayerBody(id, position) {
    // Create a box shape for the player (6x6x6 units to match visual cube)
    const shape = new CANNON.Box(new CANNON.Vec3(3, 3, 3)); // Half extents
    
    const body = new CANNON.Body({
      mass: 5, // Heavier for more stable physics
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: shape,
      linearDamping: 0.001, // Low damping for responsive movement
      angularDamping: 0.001, // Rotational damping to stay upright
      fixedRotation: false // Allow rotation from collisions
    });

    // Add the body to the world
    this.world.addBody(body);
    
    // Store reference
    this.bodies.set(id, body);
    
    return body;
  } 

  removePlayerBody(id) {
    const body = this.bodies.get(id);
    if (body) {
      this.world.removeBody(body);
      this.bodies.delete(id);
    }
  }

  getPlayerBody(id) {
    return this.bodies.get(id);
  }

  applyForce(id, force) {
    const body = this.bodies.get(id);
    if (body) {
      // Apply force at center of mass
      body.applyForce(
        new CANNON.Vec3(force.x, force.y, force.z)
      );
    }
  }

  applyImpulse(id, impulse) {
    const body = this.bodies.get(id);
    if (body) {
      // Apply impulse at center of mass
      body.applyImpulse(
        new CANNON.Vec3(impulse.x, impulse.y, impulse.z)
      );
    }
  }

  setVelocity(id, velocity) {
    const body = this.bodies.get(id);
    if (body) {
      body.velocity.set(velocity.x, velocity.y, velocity.z);
    }
  }

  getVelocity(id) {
    const body = this.bodies.get(id);
    if (body) {
      return {
        x: body.velocity.x,
        y: body.velocity.y,
        z: body.velocity.z
      };
    }
    return { x: 0, y: 0, z: 0 };
  }

  getPosition(id) {
    const body = this.bodies.get(id);
    if (body) {
      return {
        x: body.position.x,
        y: body.position.y,
        z: body.position.z
      };
    }
    return null;
  }

  getRotation(id) {
    const body = this.bodies.get(id);
    if (body) {
      return {
        x: body.quaternion.x,
        y: body.quaternion.y,
        z: body.quaternion.z,
        w: body.quaternion.w
      };
    }
    return null;
  }

  step(deltaTime) {
    // Fixed timestep for stability
    const fixedTimeStep = 1 / 60;
    this.world.step(fixedTimeStep, deltaTime, 3);
  }

  // Check if a player is grounded (touching something below)
  isGrounded(id) {
    const body = this.bodies.get(id);
    if (!body) return false;

    // Check if there are contacts below the body
    for (let contact of this.world.contacts) {
      if (contact.bi === body || contact.bj === body) {
        // Get contact normal - ni points from bi to bj
        // We want to check if there's a contact pushing UP on the player
        let normalY;
        if (contact.bi === body) {
          // Player is first body, normal points from player to other
          // We want the opposite - from other to player
          normalY = -contact.ni.y;
        } else {
          // Player is second body, normal points from other to player
          normalY = contact.ni.y;
        }
        
        // If normal points upward (from below the player), we're grounded
        if (normalY > 0.3) {
          return true;
        }
      }
    }
    return false;
  }

  // Apply movement force (for WASD controls)
  applyMovementForce(id, direction, magnitude) {
    const body = this.bodies.get(id);
    if (!body) return;

    // Only apply horizontal forces at center of mass
    const force = new CANNON.Vec3(
      direction.x * magnitude,
      0,
      direction.z * magnitude
    );

    body.applyForce(force);
  }

  // Apply movement impulse (frame-rate independent)
  applyMovementImpulse(id, impulse) {
    const body = this.bodies.get(id);
    if (!body) return;

    // Apply impulse for immediate velocity change at center of mass
    body.applyImpulse(
      new CANNON.Vec3(impulse.x, 0, impulse.z)
    );
  }

  // Jump impulse
  jump(id, force) {
    const body = this.bodies.get(id);
    if (!body) return false;

    const grounded = this.isGrounded(id);
    
    // Only jump if grounded
    if (grounded) {
      // Apply impulse at center of mass (no second parameter needed)
      body.applyImpulse(
        new CANNON.Vec3(0, force, 0)
      );
      return true;
    }
    
    return false;
  }

  // Reset player rotation to upright (prevent tumbling)
  stabilizeRotation(id) {
    const body = this.bodies.get(id);
    if (!body) return;

    // Gradually dampen x and z rotations to keep player upright
    body.quaternion.x *= 0.9;
    body.quaternion.z *= 0.9;
    body.quaternion.normalize();

    // Limit angular velocity to prevent spinning
    body.angularVelocity.x *= 0.8;
    body.angularVelocity.z *= 0.8;
  }

  // Create a generic box body (for screen billboards, etc.)
  createBox(position, size, mass = 1) {
    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
    
    const body = new CANNON.Body({
      mass: mass,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: shape
    });

    this.world.addBody(body);
    return body;
  }
}

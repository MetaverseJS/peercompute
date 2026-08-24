import {
  MOTORCYCLE_RENDER_LIMITS,
  NEON_TOPO_PALETTE,
  motorcycleComponentColor,
  trafficCategoryColor,
} from './constants.js';
import { createNeonBasicMaterial } from './materials.js';

const TRAFFIC_SNAPSHOT_SCHEMA = 'peercompute.synthetic-road-traffic.snapshot.v1';
const KNOWN_TRAFFIC_CATEGORIES = Object.freeze([
  'traffic-cyan',
  'traffic-magenta',
  'traffic-amber',
  'other',
]);

function boundedInteger(value, fallback, maximum, label) {
  const selected = value ?? fallback;
  if (!Number.isInteger(selected) || selected < 0 || selected > maximum) {
    throw new RangeError(`${label} must be an integer between 0 and ${maximum}.`);
  }
  return selected;
}

function finiteVector(value, size, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < size) {
    throw new TypeError(`${label} must contain ${size} components.`);
  }
  const output = Array.from(value).slice(0, size).map(Number);
  if (!output.every(Number.isFinite)) throw new TypeError(`${label} must contain finite values.`);
  return output;
}

function componentNameByBodyId(rig) {
  return new Map(Object.entries(rig.bodyIds ?? {}).map(([component, bodyId]) => [bodyId, component]));
}

function componentGeometry(THREE, component, rig) {
  if (component === 'chassis') return new THREE.BoxGeometry(0.5, 0.46, 1.1);
  if (component === 'rearWheel' || component === 'frontWheel') {
    const geometry = new THREE.TorusGeometry(rig.wheelRadius ?? 0.34, rig.tireRadius ?? 0.072, 8, 20);
    geometry.rotateY(Math.PI / 2);
    return geometry;
  }
  if (component === 'upperFork') return new THREE.BoxGeometry(0.62, 0.5, 0.12);
  if (component === 'lowerFork') return new THREE.BoxGeometry(0.3, 0.54, 0.12);
  if (component === 'rearSwingarm') return new THREE.BoxGeometry(0.36, 0.18, 0.72);
  return new THREE.SphereGeometry(0.2, 8, 6);
}

function matrixFromParticle(THREE, matrix, particle) {
  const position = finiteVector(particle.position, 3, `${particle.id}.position`);
  const radius = Number(particle.radius);
  if (!Number.isFinite(radius) || radius <= 0) throw new TypeError(`${particle.id}.radius must be positive.`);
  matrix.compose(
    new THREE.Vector3(...position),
    new THREE.Quaternion(),
    new THREE.Vector3(radius, radius, radius),
  );
}

export function createMotorcycleVisuals(THREE, physicsWorld, rig, {
  maximumMotorcycleParticles = MOTORCYCLE_RENDER_LIMITS.maximumMotorcycleParticles,
} = {}) {
  if (typeof physicsWorld?.getInterpolatedTransforms !== 'function'
    || typeof physicsWorld?.getParticleTransforms !== 'function') {
    throw new TypeError('Motorcycle renderer requires particle-world transform methods.');
  }
  if (!Array.isArray(rig?.bodyIdList) || !rig.bodyIds) {
    throw new TypeError('Motorcycle renderer requires canonical rig body ids.');
  }
  const limit = boundedInteger(
    maximumMotorcycleParticles,
    MOTORCYCLE_RENDER_LIMITS.maximumMotorcycleParticles,
    MOTORCYCLE_RENDER_LIMITS.maximumMotorcycleParticles,
    'maximumMotorcycleParticles',
  );
  const root = new THREE.Group();
  root.name = 'motorcycle-particle-rig-visuals';
  const guides = new THREE.Group();
  guides.name = 'motorcycle-component-guides';
  const particlesRoot = new THREE.Group();
  particlesRoot.name = 'motorcycle-particle-clouds';
  root.add(guides, particlesRoot);

  const bodyIds = new Set(rig.bodyIdList);
  const componentByBody = componentNameByBodyId(rig);
  const initialParticles = physicsWorld.getParticleTransforms(0)
    .filter((particle) => bodyIds.has(particle.bodyId));
  const sourceParticleCount = initialParticles.length;
  const selectedParticles = initialParticles.slice(0, limit);
  const particleCapacityByBody = new Map();
  for (const particle of selectedParticles) {
    particleCapacityByBody.set(particle.bodyId, (particleCapacityByBody.get(particle.bodyId) ?? 0) + 1);
  }

  const guideByBody = new Map();
  const particleMeshByBody = new Map();
  const particleGeometry = new THREE.SphereGeometry(1, 8, 6);
  for (const bodyId of rig.bodyIdList) {
    const component = componentByBody.get(bodyId) ?? 'other';
    const color = motorcycleComponentColor(component);
    const guide = new THREE.Mesh(
      componentGeometry(THREE, component, rig),
      createNeonBasicMaterial(THREE, color, {
        category: `motorcycle-${component}`,
        opacity: 0.48,
        depthWrite: false,
        wireframe: true,
      }),
    );
    guide.name = `motorcycle-component-${component}`;
    guide.userData = { kind: 'motorcycle-component', bodyId, component, color };
    guides.add(guide);
    guideByBody.set(bodyId, guide);

    const capacity = particleCapacityByBody.get(bodyId) ?? 0;
    if (capacity === 0) continue;
    const particleMesh = new THREE.InstancedMesh(
      particleGeometry,
      createNeonBasicMaterial(THREE, color, {
        category: `motorcycle-particles-${component}`,
        opacity: 0.76,
        depthWrite: false,
        wireframe: true,
      }),
      capacity,
    );
    particleMesh.name = `motorcycle-particles-${component}`;
    particleMesh.count = 0;
    particleMesh.frustumCulled = false;
    particleMesh.userData = { kind: 'motorcycle-particles', bodyId, component, capacity, color };
    particlesRoot.add(particleMesh);
    particleMeshByBody.set(bodyId, particleMesh);
  }

  const matrix = new THREE.Matrix4();
  let lastRenderedParticleCount = 0;
  let invalidParticleCount = 0;
  const update = (alpha = 0) => {
    const blend = Math.min(1, Math.max(0, Number(alpha)));
    if (!Number.isFinite(blend)) throw new TypeError('Motorcycle interpolation alpha must be finite.');
    const transforms = physicsWorld.getInterpolatedTransforms(blend);
    for (const transform of transforms) {
      const guide = guideByBody.get(transform.id);
      if (!guide) continue;
      guide.position.fromArray(finiteVector(transform.position, 3, `${transform.id}.position`));
      guide.quaternion.fromArray(finiteVector(transform.orientation, 4, `${transform.id}.orientation`));
    }
    const particles = physicsWorld.getParticleTransforms(blend).filter((particle) => bodyIds.has(particle.bodyId));
    const particlesByBody = new Map();
    for (const particle of particles) {
      if (!particlesByBody.has(particle.bodyId)) particlesByBody.set(particle.bodyId, []);
      particlesByBody.get(particle.bodyId).push(particle);
    }
    lastRenderedParticleCount = 0;
    invalidParticleCount = 0;
    for (const [bodyId, mesh] of particleMeshByBody) {
      const source = particlesByBody.get(bodyId) ?? [];
      let rendered = 0;
      for (const particle of source.slice(0, mesh.userData.capacity)) {
        try {
          matrixFromParticle(THREE, matrix, particle);
        } catch {
          invalidParticleCount += 1;
          continue;
        }
        mesh.setMatrixAt(rendered, matrix);
        rendered += 1;
      }
      mesh.count = rendered;
      mesh.instanceMatrix.needsUpdate = true;
      lastRenderedParticleCount += rendered;
    }
    return lastRenderedParticleCount;
  };
  update(0);
  root.userData = {
    kind: 'particle-component-motorcycle',
    componentCount: rig.bodyIdList.length,
    sourceParticleCount,
    rendererCapOmittedCount: Math.max(0, sourceParticleCount - selectedParticles.length),
  };
  return {
    root,
    update,
    getTelemetry() {
      return {
        componentCount: rig.bodyIdList.length,
        sourceParticleCount,
        renderedParticleCount: lastRenderedParticleCount,
        rendererCapOmittedCount: Math.max(0, sourceParticleCount - selectedParticles.length),
        invalidOmittedCount: invalidParticleCount,
        bodyTransformCount: guideByBody.size,
      };
    },
  };
}

export function createContactVisuals(THREE, physicsWorld, {
  maximumContactMarkers = MOTORCYCLE_RENDER_LIMITS.maximumContactMarkers,
} = {}) {
  if (typeof physicsWorld?.getContacts !== 'function') {
    throw new TypeError('Contact renderer requires the particle world getContacts method.');
  }
  const limit = boundedInteger(
    maximumContactMarkers,
    MOTORCYCLE_RENDER_LIMITS.maximumContactMarkers,
    MOTORCYCLE_RENDER_LIMITS.maximumContactMarkers,
    'maximumContactMarkers',
  );
  const root = new THREE.Group();
  root.name = 'motorcycle-contact-markers';
  root.userData = {
    kind: 'particle-contact-markers',
    derivedVisualization: true,
    operationalUse: false,
  };
  const geometry = new THREE.SphereGeometry(1, 10, 8);
  const material = createNeonBasicMaterial(THREE, NEON_TOPO_PALETTE.contact, {
    category: 'physics-contact',
    opacity: 0.98,
    depthWrite: false,
    wireframe: false,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, Math.max(1, limit));
  mesh.name = 'motorcycle-contact-marker-instances';
  mesh.count = 0;
  mesh.frustumCulled = false;
  mesh.renderOrder = 20;
  mesh.userData = {
    kind: 'particle-contact-markers',
    category: 'physics-contact',
    color: NEON_TOPO_PALETTE.contact,
    capacity: limit,
    derivedVisualization: true,
  };
  root.add(mesh);

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const orientation = new THREE.Quaternion();
  let telemetry = {
    sourceContactCount: 0,
    selectedContactCount: 0,
    renderedContactCount: 0,
    rendererCapOmittedCount: 0,
    invalidOmittedCount: 0,
    maximumContactMarkers: limit,
    category: 'physics-contact',
    color: NEON_TOPO_PALETTE.contact,
    derivedVisualization: true,
  };
  const update = () => {
    const contacts = physicsWorld.getContacts();
    if (!Array.isArray(contacts)) {
      throw new TypeError('Particle world contacts must be an array.');
    }
    const selected = contacts.slice(0, limit);
    let rendered = 0;
    let invalid = 0;
    for (const contact of selected) {
      try {
        const point = finiteVector(contact?.point, 3, `${contact?.id ?? 'contact'}.point`);
        const impulse = Math.abs(Number(contact?.normalImpulse) || 0);
        const penetration = Math.max(0, Number(contact?.penetration) || 0);
        const radius = 0.045 + Math.min(0.12, Math.sqrt(impulse) * 0.012 + penetration * 0.5);
        position.fromArray(point);
        scale.setScalar(radius);
        matrix.compose(position, orientation, scale);
        mesh.setMatrixAt(rendered, matrix);
        rendered += 1;
      } catch {
        invalid += 1;
      }
    }
    mesh.count = rendered;
    mesh.instanceMatrix.needsUpdate = true;
    telemetry = {
      sourceContactCount: contacts.length,
      selectedContactCount: selected.length,
      renderedContactCount: rendered,
      rendererCapOmittedCount: Math.max(0, contacts.length - selected.length),
      invalidOmittedCount: invalid,
      maximumContactMarkers: limit,
      category: 'physics-contact',
      color: NEON_TOPO_PALETTE.contact,
      derivedVisualization: true,
    };
    return rendered;
  };
  update();
  return {
    root,
    update,
    getTelemetry() {
      return { ...telemetry };
    },
  };
}

function normalizeTrafficCoordinate(vehicle) {
  if (Array.isArray(vehicle?.coordinates)) return finiteVector(vehicle.coordinates, 2, `${vehicle.id}.coordinates`);
  const longitude = Number(vehicle?.wgs84?.longitudeDegrees);
  const latitude = Number(vehicle?.wgs84?.latitudeDegrees);
  if (Number.isFinite(longitude) && Number.isFinite(latitude)) return [longitude, latitude];
  throw new TypeError(`${vehicle?.id ?? 'traffic vehicle'} is missing finite WGS84 coordinates.`);
}

function validateTrafficSnapshot(snapshot) {
  if (snapshot === null || snapshot === undefined) return null;
  if (snapshot.schemaVersion !== TRAFFIC_SNAPSHOT_SCHEMA || !Array.isArray(snapshot.vehicles)) {
    throw new TypeError(`Traffic snapshots must use ${TRAFFIC_SNAPSHOT_SCHEMA}.`);
  }
  if (snapshot.provenance?.synthetic !== true || snapshot.provenance?.liveTraffic !== false) {
    throw new TypeError('Traffic snapshot provenance must truthfully identify synthetic, non-live traffic.');
  }
  return snapshot;
}

export function createTrafficVisuals(THREE, terrain, {
  maximumTrafficVehicles = MOTORCYCLE_RENDER_LIMITS.defaultMaximumTrafficVehicles,
} = {}) {
  const limit = boundedInteger(
    maximumTrafficVehicles,
    MOTORCYCLE_RENDER_LIMITS.defaultMaximumTrafficVehicles,
    MOTORCYCLE_RENDER_LIMITS.absoluteMaximumTrafficVehicles,
    'maximumTrafficVehicles',
  );
  if (typeof terrain?.sampleRawHeight !== 'function' || typeof terrain?.frame?.toLocal !== 'function') {
    throw new TypeError('Traffic renderer requires terrain height and local-frame samplers.');
  }
  const root = new THREE.Group();
  root.name = 'motorcycle-synthetic-traffic';
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const meshes = new Map();
  for (const category of KNOWN_TRAFFIC_CATEGORIES) {
    const mesh = new THREE.InstancedMesh(
      geometry,
      createNeonBasicMaterial(THREE, trafficCategoryColor(category), {
        category,
        opacity: 0.82,
        depthWrite: false,
        wireframe: true,
      }),
      Math.max(1, limit),
    );
    mesh.name = `motorcycle-${category}`;
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.userData = { kind: 'synthetic-traffic', category, capacity: limit };
    root.add(mesh);
    meshes.set(category, mesh);
  }

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  let telemetry = {
    status: 'awaiting-snapshot',
    snapshotVehicleCount: 0,
    selectedVehicleCount: 0,
    renderedVehicleCount: 0,
    rendererCapOmittedCount: 0,
    invalidOmittedCount: 0,
    provenance: null,
    synthetic: null,
    liveTraffic: null,
  };
  const update = (candidate) => {
    const snapshot = validateTrafficSnapshot(candidate);
    for (const mesh of meshes.values()) mesh.count = 0;
    if (!snapshot) {
      for (const mesh of meshes.values()) mesh.instanceMatrix.needsUpdate = true;
      telemetry = {
        status: 'awaiting-snapshot',
        snapshotVehicleCount: 0,
        selectedVehicleCount: 0,
        renderedVehicleCount: 0,
        rendererCapOmittedCount: 0,
        invalidOmittedCount: 0,
        provenance: null,
        synthetic: null,
        liveTraffic: null,
      };
      return 0;
    }
    const selected = snapshot.vehicles.slice(0, limit);
    const counts = new Map(KNOWN_TRAFFIC_CATEGORIES.map((category) => [category, 0]));
    let rendered = 0;
    let invalid = 0;
    for (const vehicle of selected) {
      try {
        const [longitude, latitude] = normalizeTrafficCoordinate(vehicle);
        const rawHeight = terrain.sampleRawHeight(longitude, latitude);
        if (!Number.isFinite(rawHeight)) throw new TypeError('terrain height is non-finite');
        const local = finiteVector(terrain.frame.toLocal({ longitude, latitude, height: rawHeight }), 3, 'traffic local position');
        const dimensions = finiteVector(vehicle.dimensionsMeters, 3, `${vehicle.id}.dimensionsMeters`);
        if (dimensions.some((dimension) => dimension <= 0)) throw new TypeError('traffic dimensions must be positive');
        const heading = Number(vehicle.headingRadians);
        if (!Number.isFinite(heading)) throw new TypeError('traffic heading must be finite');
        const category = meshes.has(vehicle.colorCategory) ? vehicle.colorCategory : 'other';
        const mesh = meshes.get(category);
        const instanceIndex = counts.get(category);
        position.set(local[0], local[1] + dimensions[2] * 0.5 + 0.08, local[2]);
        // Traffic headings are clockwise from geodetic north. The local Three
        // frame is east/up/south, so north is -Z and requires PI-heading yaw.
        // Keep this identical to the physical collision-cage transform.
        quaternion.setFromAxisAngle(up, Math.PI - heading);
        scale.set(dimensions[1], dimensions[2], dimensions[0]);
        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(instanceIndex, matrix);
        counts.set(category, instanceIndex + 1);
        rendered += 1;
      } catch {
        invalid += 1;
      }
    }
    for (const [category, mesh] of meshes) {
      mesh.count = counts.get(category);
      mesh.instanceMatrix.needsUpdate = true;
    }
    telemetry = {
      status: snapshot.status ?? 'unknown',
      snapshotVehicleCount: snapshot.vehicles.length,
      selectedVehicleCount: selected.length,
      renderedVehicleCount: rendered,
      rendererCapOmittedCount: Math.max(0, snapshot.vehicles.length - selected.length),
      invalidOmittedCount: invalid,
      provenance: snapshot.provenance,
      synthetic: true,
      liveTraffic: false,
    };
    return rendered;
  };
  return {
    root,
    update,
    getTelemetry() {
      return { ...telemetry };
    },
  };
}

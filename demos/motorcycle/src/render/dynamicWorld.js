import {
  MOTORCYCLE_RENDER_LIMITS,
  NEON_TOPO_PALETTE,
  trafficCategoryColor,
} from './constants.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { createNeonBasicMaterial, createNeonLineMaterial } from './materials.js';
import { createNurbsCircleCurve, createNurbsCurveFromPoints } from './nurbs.js';

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

function sampledCurveGeometry(curve, sampleSegments, name) {
  const sampled = curve.getPoints(sampleSegments);
  const geometry = new LineGeometry();
  geometry.name = `${name}-geometry`;
  geometry.setPositions(sampled.flatMap((point) => [point.x, point.y, point.z]));
  geometry.userData = {
    ...curve.userData,
    sampledPointCount: sampled.length,
  };
  return geometry;
}

function createGlowingCurve(THREE, curve, {
  name,
  color,
  category,
  sampleSegments = 32,
  coreWidth = 2,
  haloWidth = 5,
} = {}) {
  const geometry = sampledCurveGeometry(curve, sampleSegments, name);
  const root = new THREE.Group();
  root.name = name;
  root.userData = {
    kind: 'minimal-nurbs-line',
    category,
    curveModel: 'NURBS',
    degree: curve.userData.degree,
    controlPointCount: curve.userData.controlPointCount,
    sampledPointCount: geometry.userData.sampledPointCount,
  };
  const halo = new Line2(
    geometry,
    createNeonLineMaterial(THREE, color, {
      category: `${category}-halo`,
      opacity: 0.24,
      linewidth: haloWidth,
    }),
  );
  halo.name = `${name}-halo`;
  halo.computeLineDistances();
  halo.renderOrder = 32;
  const core = new Line2(
    geometry,
    createNeonLineMaterial(THREE, color, {
      category: `${category}-core`,
      opacity: 0.96,
      linewidth: coreWidth,
    }),
  );
  core.name = `${name}-core`;
  core.computeLineDistances();
  core.renderOrder = 33;
  root.add(halo, core);
  return root;
}

function createBodyGroup(THREE, root, bodyGroups, bodyId, component) {
  const group = new THREE.Group();
  group.name = `motorcycle-line-body-${component}`;
  group.userData = { kind: 'motorcycle-line-body', component, bodyId };
  bodyGroups.set(bodyId, group);
  root.add(group);
  return group;
}

function addStroke(THREE, parent, points, options) {
  const curve = createNurbsCurveFromPoints(THREE, points);
  const stroke = createGlowingCurve(THREE, curve, options);
  parent.add(stroke);
  return stroke;
}

function createMinimalLineBike(THREE, rig) {
  const root = new THREE.Group();
  root.name = 'motorcycle-minimal-nurbs-line-bike';
  root.userData = {
    kind: 'minimal-nurbs-line-bike',
    worldUnits: rig.worldUnits ?? 'meters',
  };
  const bodyGroups = new Map();
  const groups = {};
  for (const [component, bodyId] of Object.entries(rig.bodyIds)) {
    groups[component] = createBodyGroup(THREE, root, bodyGroups, bodyId, component);
  }

  const rollingRadius = Number(
    rig.rollingRadiusMeters ?? ((rig.wheelRadius ?? 0.34) + (rig.tireRadius ?? 0.072)),
  );
  if (!Number.isFinite(rollingRadius) || rollingRadius <= 0) {
    throw new RangeError('Motorcycle rolling radius must be positive.');
  }
  const wheelCurves = [];
  for (const [component, color] of [
    ['rearWheel', NEON_TOPO_PALETTE.motorcycle.rearWheel],
    ['frontWheel', NEON_TOPO_PALETTE.motorcycle.frontWheel],
  ]) {
    const wheel = createGlowingCurve(THREE, createNurbsCircleCurve(THREE, rollingRadius, { plane: 'yz' }), {
      name: `motorcycle-${component}-nurbs-wheel-line`,
      category: `motorcycle-${component}-wheel-line`,
      color,
      sampleSegments: 64,
      coreWidth: 2.2,
      haloWidth: 6,
    });
    groups[component].add(wheel);
    wheelCurves.push(wheel);
  }

  const frameStrokes = [
    addStroke(THREE, groups.chassis, [
      [0, -0.26, -0.44], [0, -0.19, 0.08], [0, 0.02, 0.48],
      [0, 0.18, -0.26], [0, -0.26, -0.44],
    ], {
      name: 'motorcycle-frame-main-nurbs-line',
      category: 'motorcycle-frame',
      color: NEON_TOPO_PALETTE.motorcycle.chassis,
      sampleSegments: 32,
    }),
    addStroke(THREE, groups.rearSwingarm, [
      [0, -0.3, -0.34], [0, -0.08, -0.12], [0, 0.06, 0.06],
    ], {
      name: 'motorcycle-rear-swingarm-nurbs-line',
      category: 'motorcycle-frame',
      color: NEON_TOPO_PALETTE.motorcycle.rearSwingarm,
      sampleSegments: 16,
    }),
    addStroke(THREE, groups.upperFork, [
      [-0.31, 0.24, -0.02], [0, 0.28, -0.03], [0.31, 0.24, -0.02],
    ], {
      name: 'motorcycle-handlebar-nurbs-line',
      category: 'motorcycle-frame',
      color: NEON_TOPO_PALETTE.motorcycle.upperFork,
      sampleSegments: 16,
    }),
    addStroke(THREE, groups.lowerFork, [
      [-0.075, 0.22, -0.05], [-0.075, -0.04, 0.05], [-0.075, -0.28, 0.17],
    ], {
      name: 'motorcycle-left-fork-nurbs-line',
      category: 'motorcycle-frame',
      color: NEON_TOPO_PALETTE.motorcycle.lowerFork,
      sampleSegments: 16,
    }),
    addStroke(THREE, groups.lowerFork, [
      [0.075, 0.22, -0.05], [0.075, -0.04, 0.05], [0.075, -0.28, 0.17],
    ], {
      name: 'motorcycle-right-fork-nurbs-line',
      category: 'motorcycle-frame',
      color: NEON_TOPO_PALETTE.motorcycle.lowerFork,
      sampleSegments: 16,
    }),
  ];

  const riderColor = NEON_TOPO_PALETTE.motorcycle.rider;
  const riderStrokes = [
    addStroke(THREE, groups.chassis, [[0, 0.2, -0.14], [0, 0.5, -0.04], [0, 0.78, 0.1]], {
      name: 'motorcycle-rider-spine-nurbs-line', category: 'motorcycle-rider', color: riderColor, sampleSegments: 16,
    }),
    addStroke(THREE, groups.chassis, [[0, 0.66, 0.05], [-0.18, 0.5, 0.3], [-0.28, 0.31, 0.47]], {
      name: 'motorcycle-rider-left-arm-nurbs-line', category: 'motorcycle-rider', color: riderColor, sampleSegments: 16,
    }),
    addStroke(THREE, groups.chassis, [[0, 0.66, 0.05], [0.18, 0.5, 0.3], [0.28, 0.31, 0.47]], {
      name: 'motorcycle-rider-right-arm-nurbs-line', category: 'motorcycle-rider', color: riderColor, sampleSegments: 16,
    }),
    addStroke(THREE, groups.chassis, [[0, 0.22, -0.12], [-0.14, -0.02, -0.12], [-0.18, -0.24, 0.02]], {
      name: 'motorcycle-rider-left-leg-nurbs-line', category: 'motorcycle-rider', color: riderColor, sampleSegments: 16,
    }),
    addStroke(THREE, groups.chassis, [[0, 0.22, -0.12], [0.14, -0.02, -0.12], [0.18, -0.24, 0.02]], {
      name: 'motorcycle-rider-right-leg-nurbs-line', category: 'motorcycle-rider', color: riderColor, sampleSegments: 16,
    }),
  ];
  const head = createGlowingCurve(THREE, createNurbsCircleCurve(THREE, 0.13, { plane: 'xy' }), {
    name: 'motorcycle-rider-head-nurbs-line',
    category: 'motorcycle-rider',
    color: riderColor,
    sampleSegments: 40,
    coreWidth: 1.7,
    haloWidth: 4.2,
  });
  head.position.set(0, 0.97, 0.1);
  groups.chassis.add(head);
  riderStrokes.push(head);
  return {
    root,
    bodyGroups,
    wheelCurves,
    frameStrokes,
    riderStrokes,
    rollingRadius,
  };
}

function createDebugParticleClouds(THREE, physicsWorld, bodyIds, initialParticles, limit) {
  const root = new THREE.Group();
  root.name = 'motorcycle-debug-particle-clouds';
  const selected = initialParticles.slice(0, limit);
  if (selected.length === 0) {
    return { root, selected, update: () => ({ rendered: 0, invalid: 0 }) };
  }
  const geometry = new THREE.SphereGeometry(1, 8, 6);
  const mesh = new THREE.InstancedMesh(
    geometry,
    createNeonBasicMaterial(THREE, NEON_TOPO_PALETTE.motorcycle.other, {
      category: 'motorcycle-debug-particles', opacity: 0.72, depthWrite: false, wireframe: true,
    }),
    selected.length,
  );
  mesh.name = 'motorcycle-debug-particle-instances';
  mesh.count = 0;
  mesh.frustumCulled = false;
  root.add(mesh);
  const matrix = new THREE.Matrix4();
  const update = (alpha) => {
    const particles = physicsWorld.getParticleTransforms(alpha).filter((particle) => bodyIds.has(particle.bodyId));
    let rendered = 0;
    let invalid = 0;
    for (const particle of particles.slice(0, selected.length)) {
      try {
        matrixFromParticle(THREE, matrix, particle);
        mesh.setMatrixAt(rendered, matrix);
        rendered += 1;
      } catch {
        invalid += 1;
      }
    }
    mesh.count = rendered;
    mesh.instanceMatrix.needsUpdate = true;
    return { rendered, invalid };
  };
  return { root, selected, update };
}

export function createMotorcycleVisuals(THREE, physicsWorld, rig, {
  maximumMotorcycleParticles = MOTORCYCLE_RENDER_LIMITS.maximumMotorcycleParticles,
  physicsDebug = false,
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
  const bodyIds = new Set(rig.bodyIdList);
  const initialParticles = physicsWorld.getParticleTransforms(0)
    .filter((particle) => bodyIds.has(particle.bodyId));
  const sourceParticleCount = initialParticles.length;
  const minimal = createMinimalLineBike(THREE, rig);
  const root = minimal.root;
  const debug = createDebugParticleClouds(THREE, physicsWorld, bodyIds, initialParticles, physicsDebug ? limit : 0);
  if (physicsDebug) root.add(debug.root);
  let lastRenderedParticleCount = 0;
  let invalidParticleCount = 0;
  const update = (alpha = 0) => {
    const blend = Math.min(1, Math.max(0, Number(alpha)));
    if (!Number.isFinite(blend)) throw new TypeError('Motorcycle interpolation alpha must be finite.');
    const transforms = physicsWorld.getInterpolatedTransforms(blend);
    for (const transform of transforms) {
      const group = minimal.bodyGroups.get(transform.id);
      if (!group) continue;
      group.position.fromArray(finiteVector(transform.position, 3, `${transform.id}.position`));
      group.quaternion.fromArray(finiteVector(transform.orientation, 4, `${transform.id}.orientation`));
    }
    const debugResult = physicsDebug ? debug.update(blend) : { rendered: 0, invalid: 0 };
    lastRenderedParticleCount = debugResult.rendered;
    invalidParticleCount = debugResult.invalid;
    return lastRenderedParticleCount;
  };
  update(0);
  root.userData = {
    kind: 'minimal-nurbs-line-bike',
    componentCount: rig.bodyIdList.length,
    sourceParticleCount,
    rendererCapOmittedCount: physicsDebug ? Math.max(0, sourceParticleCount - debug.selected.length) : 0,
    debugDisabledOmittedCount: physicsDebug ? 0 : sourceParticleCount,
  };
  return {
    root,
    update,
    getTelemetry() {
      return {
        componentCount: rig.bodyIdList.length,
        sourceParticleCount,
        renderedParticleCount: lastRenderedParticleCount,
        rendererCapOmittedCount: physicsDebug ? Math.max(0, sourceParticleCount - debug.selected.length) : 0,
        debugDisabledOmittedCount: physicsDebug ? 0 : sourceParticleCount,
        invalidOmittedCount: invalidParticleCount,
        bodyTransformCount: minimal.bodyGroups.size,
        style: 'minimal-nurbs-line-bike',
        wheelCurveCount: minimal.wheelCurves.length,
        frameCurveCount: minimal.frameStrokes.length,
        riderCurveCount: minimal.riderStrokes.length,
        nurbsCurveCount: minimal.wheelCurves.length + minimal.frameStrokes.length + minimal.riderStrokes.length,
        rollingRadiusMeters: minimal.rollingRadius,
        worldUnits: rig.worldUnits ?? 'meters',
        physicsDebugEnabled: physicsDebug,
      };
    },
  };
}

export function createContactVisuals(THREE, physicsWorld, {
  maximumContactMarkers = MOTORCYCLE_RENDER_LIMITS.maximumContactMarkers,
  enabled = false,
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
    debugOnly: true,
  };
  if (!enabled) {
    let telemetry = {
      sourceContactCount: 0,
      selectedContactCount: 0,
      renderedContactCount: 0,
      rendererCapOmittedCount: 0,
      debugDisabledOmittedCount: 0,
      invalidOmittedCount: 0,
      maximumContactMarkers: limit,
      category: 'physics-contact',
      color: NEON_TOPO_PALETTE.contact,
      derivedVisualization: true,
      physicsDebugEnabled: false,
    };
    const update = () => {
      const contacts = physicsWorld.getContacts();
      if (!Array.isArray(contacts)) throw new TypeError('Particle world contacts must be an array.');
      telemetry = {
        ...telemetry,
        sourceContactCount: contacts.length,
        rendererCapOmittedCount: 0,
        debugDisabledOmittedCount: contacts.length,
      };
      return 0;
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
    debugDisabledOmittedCount: 0,
    invalidOmittedCount: 0,
    maximumContactMarkers: limit,
    category: 'physics-contact',
    color: NEON_TOPO_PALETTE.contact,
    derivedVisualization: true,
    physicsDebugEnabled: true,
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
      debugDisabledOmittedCount: 0,
      invalidOmittedCount: invalid,
      maximumContactMarkers: limit,
      category: 'physics-contact',
      color: NEON_TOPO_PALETTE.contact,
      derivedVisualization: true,
      physicsDebugEnabled: true,
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

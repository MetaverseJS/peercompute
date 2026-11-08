const ROAD_RACE_COURSE_SCHEMA = 'peercompute.motorcycle.road-race-course.v1';
const MAXIMUM_RACE_GATES = 64;

function finiteVector(value, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < 3) {
    throw new TypeError(`${label} must contain three coordinates.`);
  }
  const vector = Array.from(value).slice(0, 3).map(Number);
  if (!vector.every(Number.isFinite)) throw new TypeError(`${label} must be finite.`);
  return vector;
}

function makeBeam(THREE, fromValue, toValue, radius, material, name) {
  const from = new THREE.Vector3(...finiteVector(fromValue, `${name} start`));
  const to = new THREE.Vector3(...finiteVector(toValue, `${name} end`));
  const direction = to.clone().sub(from);
  const length = direction.length();
  if (!(length > 0)) throw new RangeError(`${name} must have positive length.`);
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 8, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.frustumCulled = true;
  return mesh;
}

function gateMaterial(THREE, color, category) {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.96,
    depthWrite: false,
    toneMapped: false,
  });
  material.name = `motorcycle-${category}`;
  material.userData = { neon: true, category, emissiveDisplayIntensity: 4 };
  return material;
}

export function createRaceVisuals(THREE, raceCourse) {
  if (!THREE?.Group || !THREE?.CylinderGeometry || !THREE?.Mesh) {
    throw new TypeError('Race visuals require a Three.js namespace.');
  }
  if (raceCourse?.schemaVersion !== ROAD_RACE_COURSE_SCHEMA) {
    throw new TypeError(`Race visuals require ${ROAD_RACE_COURSE_SCHEMA}.`);
  }
  if (!Array.isArray(raceCourse.gates) || raceCourse.gates.length < 2
    || raceCourse.gates.length > MAXIMUM_RACE_GATES) {
    throw new RangeError(`Race course must contain 2-${MAXIMUM_RACE_GATES} gates.`);
  }

  const root = new THREE.Group();
  root.name = 'motorcycle-race-course';
  root.userData = {
    kind: 'game-derived-real-road-race-course',
    courseId: raceCourse.id,
    truthStatus: raceCourse.truthStatus,
    navigationGrade: false,
  };
  const gateRoot = new THREE.Group();
  gateRoot.name = 'motorcycle-race-gates';
  root.add(gateRoot);

  const materialByCategory = new Map();
  for (const gate of raceCourse.gates) {
    const render = gate?.render;
    if (!render || typeof render.colorCategory !== 'string') {
      throw new TypeError('Every race gate requires bounded render metadata.');
    }
    let material = materialByCategory.get(render.colorCategory);
    if (!material) {
      material = gateMaterial(THREE, render.color, render.colorCategory);
      materialByCategory.set(render.colorCategory, material);
    }
    const radius = Number(render.postRadiusMeters);
    if (!Number.isFinite(radius) || radius <= 0 || radius > 2) {
      throw new RangeError('Race gate post radius must be finite and bounded.');
    }
    const group = new THREE.Group();
    group.name = `motorcycle-race-gate-${gate.order}`;
    group.userData = {
      kind: gate.kind,
      gateId: gate.id,
      order: gate.order,
      label: gate.label,
      colorCategory: render.colorCategory,
      sourceOsmWayId: gate.sourceOsmWayId,
      navigationGrade: false,
    };
    group.add(
      makeBeam(THREE, render.leftPostBaseLocal, render.leftPostTopLocal,
        radius, material, `${group.name}-left-post`),
      makeBeam(THREE, render.rightPostBaseLocal, render.rightPostTopLocal,
        radius, material, `${group.name}-right-post`),
      makeBeam(THREE, render.bannerLeftLocal, render.bannerRightLocal,
        radius * 1.35, material, `${group.name}-banner`),
    );
    gateRoot.add(group);
  }

  const routePoints = raceCourse.route?.points?.map((point) => (
    new THREE.Vector3(...finiteVector(point.positionLocal, 'Race route point'))
  ));
  if (routePoints?.length >= 2) {
    const geometry = new THREE.BufferGeometry().setFromPoints(routePoints);
    const material = new THREE.LineBasicMaterial({
      color: 0x2dffcb,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      toneMapped: false,
    });
    const route = new THREE.Line(geometry, material);
    route.name = 'motorcycle-race-route-guide';
    route.position.y += 0.12;
    route.userData = { derivedGameplayGuide: true, navigationGrade: false };
    root.add(route);
  }

  const telemetry = Object.freeze({
    schemaVersion: 'peercompute.motorcycle.race-visuals.telemetry.v1',
    courseId: raceCourse.id,
    truthStatus: raceCourse.truthStatus,
    raceMode: raceCourse.raceMode,
    gateCount: raceCourse.gates.length,
    renderedGateCount: gateRoot.children.length,
    routeGuideRendered: routePoints?.length >= 2,
    courseLengthMeters: raceCourse.route.distanceMeters,
    source: raceCourse.source,
    provenance: raceCourse.provenance,
    navigationGrade: false,
    offscreenGateCulling: true,
  });
  return Object.freeze({ root, telemetry });
}

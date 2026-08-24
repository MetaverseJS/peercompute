import {
  MOTORCYCLE_RENDER_LIMITS,
  NEON_TOPO_PALETTE,
  roadCategoryColor,
} from './constants.js';
import {
  createBuildingGeometry,
  createRoadRibbonGeometry,
  createTerrainGeometry,
} from './geometry.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import {
  createNeonBasicMaterial,
  createNeonLineMaterial,
  createTopoTerrainMaterial,
} from './materials.js';
import { createTerrainNurbsContourGeometry } from './nurbs.js';

function boundedLimit(value, fallback, maximum, label) {
  const selected = value ?? fallback;
  if (!Number.isInteger(selected) || selected < 0 || selected > maximum) {
    throw new RangeError(`${label} must be an integer between 0 and ${maximum}.`);
  }
  return selected;
}

export function createTerrainVisual(THREE, terrain, materialOptions = {}) {
  const geometry = createTerrainGeometry(THREE, terrain);
  const material = createTopoTerrainMaterial(THREE, materialOptions);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'motorcycle-transparent-terrain-surface';
  mesh.receiveShadow = false;
  mesh.frustumCulled = true;
  mesh.renderOrder = 1;
  mesh.userData = {
    kind: 'transparent-real-terrain-surface',
    source: terrain.source ?? null,
    vertexCount: geometry.userData.vertexCount,
    triangleCount: geometry.userData.triangleCount,
  };
  const contours = createTerrainNurbsContourGeometry(THREE, terrain, materialOptions);
  const root = new THREE.Group();
  root.name = 'motorcycle-real-topographic-terrain';
  const contourRoot = new THREE.Group();
  contourRoot.name = 'motorcycle-terrain-nurbs-contours';
  const createPasses = (sourceGeometry, contourClass, color, coreWidth, haloWidth) => {
    const position = sourceGeometry.getAttribute('position');
    if (!position || position.count === 0) return;
    const wideGeometry = new LineSegmentsGeometry();
    wideGeometry.name = `motorcycle-terrain-nurbs-${contourClass}-wide-geometry`;
    wideGeometry.setPositions(position.array);
    const halo = new LineSegments2(
      wideGeometry,
      createNeonLineMaterial(THREE, color, {
        category: `terrain-nurbs-${contourClass}-halo`,
        opacity: contourClass === 'major' ? 0.28 : 0.16,
        linewidth: haloWidth,
      }),
    );
    halo.name = `motorcycle-terrain-nurbs-${contourClass}-halo`;
    halo.renderOrder = 3;
    halo.computeLineDistances();
    const core = new LineSegments2(
      wideGeometry,
      createNeonLineMaterial(THREE, color, {
        category: `terrain-nurbs-${contourClass}-core`,
        opacity: contourClass === 'major' ? 0.96 : 0.62,
        linewidth: coreWidth,
      }),
    );
    core.name = `motorcycle-terrain-nurbs-${contourClass}-core`;
    core.renderOrder = 4;
    core.computeLineDistances();
    contourRoot.add(halo, core);
  };
  createPasses(contours.minor, 'minor', NEON_TOPO_PALETTE.terrain, 1.0, 3.2);
  createPasses(contours.major, 'major', NEON_TOPO_PALETTE.terrainMajor, 1.8, 5.2);
  contours.minor.dispose();
  contours.major.dispose();
  contourRoot.userData = {
    kind: 'terrain-nurbs-contours',
    ...contours.telemetry,
    drawCallCount: contourRoot.children.length,
  };
  root.add(mesh, contourRoot);
  root.userData = {
    kind: 'real-terrain',
    source: terrain.source ?? null,
    vertexCount: geometry.userData.vertexCount,
    triangleCount: geometry.userData.triangleCount,
    style: 'transparent-terrain-with-bounded-nurbs-contours',
    surfaceOpacity: material.userData.surfaceOpacity,
    contours: contourRoot.userData,
  };
  return root;
}

export function groupRoadSegmentsByStyle(roadSegments) {
  if (!Array.isArray(roadSegments)) throw new TypeError('Road segments must be an array.');
  const groups = new Map();
  for (const segment of roadSegments) {
    const category = typeof segment?.category === 'string' ? segment.category : 'other';
    const color = roadCategoryColor(category, segment?.color);
    const key = `${category}/${color.toString(16).padStart(6, '0')}`;
    if (!groups.has(key)) groups.set(key, { key, category, color, segments: [] });
    groups.get(key).segments.push(segment);
  }
  return [...groups.values()].sort((left, right) => left.key.localeCompare(right.key));
}

export function createRoadVisuals(THREE, roadSegments, {
  maximumRoadSegments = MOTORCYCLE_RENDER_LIMITS.maximumRoadSegments,
} = {}) {
  const limit = boundedLimit(
    maximumRoadSegments,
    MOTORCYCLE_RENDER_LIMITS.maximumRoadSegments,
    MOTORCYCLE_RENDER_LIMITS.maximumRoadSegments,
    'maximumRoadSegments',
  );
  const requested = Array.isArray(roadSegments) ? roadSegments.length : 0;
  if (!Array.isArray(roadSegments)) throw new TypeError('Road segments must be an array.');
  const selected = roadSegments.slice(0, limit);
  const group = new THREE.Group();
  group.name = 'motorcycle-osm-road-ribbons';
  let rendered = 0;
  let invalid = 0;
  for (const style of groupRoadSegmentsByStyle(selected)) {
    const geometry = createRoadRibbonGeometry(THREE, style.segments);
    rendered += geometry.userData.renderedSegmentCount;
    invalid += geometry.userData.invalidSegmentCount;
    if (geometry.userData.renderedSegmentCount === 0) {
      geometry.dispose();
      continue;
    }
    const material = createNeonBasicMaterial(THREE, style.color, {
      category: style.category,
      opacity: 0.72,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `motorcycle-road-${style.category}`;
    mesh.renderOrder = 20;
    mesh.userData = {
      kind: 'osm-road-ribbon',
      category: style.category,
      color: style.color,
      segmentCount: geometry.userData.renderedSegmentCount,
      sourceAuthoritative: style.segments.every((segment) => segment.sourceAuthoritative === true),
      navigationGrade: false,
    };
    group.add(mesh);
  }
  group.userData = {
    kind: 'osm-road-ribbons',
    requestedSegmentCount: requested,
    selectedSegmentCount: selected.length,
    renderedSegmentCount: rendered,
    rendererCapOmittedCount: Math.max(0, requested - selected.length),
    invalidOmittedCount: invalid,
  };
  return group;
}

export function createBuildingVisuals(THREE, buildings, {
  maximumBuildings = MOTORCYCLE_RENDER_LIMITS.maximumBuildings,
} = {}) {
  const limit = boundedLimit(
    maximumBuildings,
    MOTORCYCLE_RENDER_LIMITS.maximumBuildings,
    MOTORCYCLE_RENDER_LIMITS.maximumBuildings,
    'maximumBuildings',
  );
  if (!Array.isArray(buildings)) throw new TypeError('Buildings must be an array.');
  const selected = buildings.slice(0, limit);
  const group = new THREE.Group();
  group.name = 'motorcycle-osm-buildings';
  const fillMaterial = createNeonBasicMaterial(THREE, NEON_TOPO_PALETTE.buildingFill, {
    category: 'osm-building-fill',
    opacity: 0.14,
    depthWrite: false,
  });
  const wireMaterial = new THREE.LineBasicMaterial({
    color: NEON_TOPO_PALETTE.buildingWire,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    toneMapped: false,
  });
  wireMaterial.userData = { category: 'osm-building-wire', neon: true };
  let rendered = 0;
  let invalid = 0;
  let renderedHoles = 0;
  for (const building of selected) {
    let geometry;
    try {
      geometry = createBuildingGeometry(THREE, building);
    } catch {
      invalid += 1;
      continue;
    }
    const buildingGroup = new THREE.Group();
    buildingGroup.name = `motorcycle-building-${building.id ?? rendered}`;
    buildingGroup.userData = {
      kind: 'osm-building',
      buildingId: building.id ?? null,
      heightMeters: geometry.userData.heightMeters,
      heightSource: building.heightSource ?? null,
      heightDerived: building.heightDerived === true,
      holeCount: geometry.userData.holeCount,
      sourceAuthoritative: building.sourceAuthoritative === true,
      navigationGrade: false,
    };
    const fill = new THREE.Mesh(geometry, fillMaterial);
    fill.name = `${buildingGroup.name}-translucent-fill`;
    fill.renderOrder = 10;
    const edgesGeometry = new THREE.EdgesGeometry(geometry, 12);
    const wire = new THREE.LineSegments(edgesGeometry, wireMaterial);
    wire.name = `${buildingGroup.name}-wireframe`;
    wire.renderOrder = 11;
    buildingGroup.add(fill, wire);
    group.add(buildingGroup);
    rendered += 1;
    renderedHoles += geometry.userData.holeCount;
  }
  if (rendered === 0) {
    fillMaterial.dispose();
    wireMaterial.dispose();
  }
  group.userData = {
    kind: 'osm-buildings',
    requestedBuildingCount: buildings.length,
    selectedBuildingCount: selected.length,
    renderedBuildingCount: rendered,
    rendererCapOmittedCount: Math.max(0, buildings.length - selected.length),
    invalidOmittedCount: invalid,
    renderedHoleCount: renderedHoles,
  };
  return group;
}

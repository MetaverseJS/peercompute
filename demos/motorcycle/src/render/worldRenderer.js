import { MOTORCYCLE_RENDER_LIMITS } from './constants.js';
import { createContactVisuals, createMotorcycleVisuals, createTrafficVisuals } from './dynamicWorld.js';
import { createRaceVisuals } from './raceVisuals.js';
import { createBuildingVisuals, createRoadVisuals, createTerrainVisual } from './staticWorld.js';

function clonePlain(value) {
  if (value === null || value === undefined || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(clonePlain);
  const output = {};
  for (const [key, child] of Object.entries(value)) output[key] = clonePlain(child);
  return output;
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function countKnownOmitted(sceneOmitted, rendererCapOmitted, invalidOmitted) {
  return Math.max(0, Number(sceneOmitted) || 0)
    + Math.max(0, Number(rendererCapOmitted) || 0)
    + Math.max(0, Number(invalidOmitted) || 0);
}

export function disposeThreeObject(root) {
  if (!root?.traverse) return Object.freeze({ geometries: 0, materials: 0, textures: 0 });
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  root.traverse((object) => {
    if (object.geometry?.dispose) geometries.add(object.geometry);
    const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of sourceMaterials) {
      if (!material?.dispose) continue;
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value?.isTexture && value.dispose) textures.add(value);
      }
      for (const uniform of Object.values(material.uniforms ?? {})) {
        if (uniform?.value?.isTexture && uniform.value.dispose) textures.add(uniform.value);
      }
    }
  });
  for (const texture of textures) texture.dispose();
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
  return Object.freeze({ geometries: geometries.size, materials: materials.size, textures: textures.size });
}

export function createMotorcycleWorldRenderer(threeOrOptions, options = undefined) {
  const objectForm = options === undefined && threeOrOptions?.THREE;
  const THREE = objectForm ? threeOrOptions.THREE : threeOrOptions;
  const configuration = objectForm ? threeOrOptions : (options ?? {});
  const {
    scene,
    terrain,
    sceneData,
    rig,
    raceCourse,
    maximumTrafficVehicles = MOTORCYCLE_RENDER_LIMITS.defaultMaximumTrafficVehicles,
    maximumRoadSegments = MOTORCYCLE_RENDER_LIMITS.maximumRoadSegments,
    maximumBuildings = MOTORCYCLE_RENDER_LIMITS.maximumBuildings,
    maximumMotorcycleParticles = MOTORCYCLE_RENDER_LIMITS.maximumMotorcycleParticles,
    maximumContactMarkers = MOTORCYCLE_RENDER_LIMITS.maximumContactMarkers,
    physicsDebug = false,
    terrainMaterial = {},
    motorcycleModelInstance,
  } = configuration;
  const physicsWorld = configuration.physicsWorld ?? configuration.world;
  if (typeof scene?.add !== 'function' || typeof scene?.remove !== 'function') {
    throw new TypeError('Motorcycle world renderer requires a Three.js scene or Object3D.');
  }
  if (terrain?.schemaVersion !== 'peercompute.geo.local-terrain-grid.v1') {
    throw new TypeError('Motorcycle world renderer requires canonical local terrain.');
  }
  if (sceneData?.schemaVersion !== 'peercompute.motorcycle.scene-data.v1') {
    throw new TypeError('Motorcycle world renderer requires canonical motorcycle scene data.');
  }
  const root = new THREE.Group();
  root.name = 'motorcycle-world-renderer';
  root.userData = {
    kind: 'motorcycle-world-renderer',
    terrainSource: terrain.source?.id ?? null,
    osmStatus: sceneData.status ?? null,
    navigationGrade: false,
  };
  const terrainVisual = createTerrainVisual(THREE, terrain, {
    ...terrainMaterial,
    maximumContourLevels: MOTORCYCLE_RENDER_LIMITS.maximumTerrainContourLevels,
    maximumNurbsCurves: MOTORCYCLE_RENDER_LIMITS.maximumTerrainNurbsCurves,
    maximumSampledVertices: MOTORCYCLE_RENDER_LIMITS.maximumTerrainContourVertices,
  });
  const roads = createRoadVisuals(THREE, sceneData.roadSegments, { maximumRoadSegments });
  const buildings = createBuildingVisuals(THREE, sceneData.buildings, { maximumBuildings });
  const motorcycle = createMotorcycleVisuals(THREE, physicsWorld, rig, {
    maximumMotorcycleParticles,
    physicsDebug,
    modelInstance: motorcycleModelInstance,
  });
  const contacts = createContactVisuals(THREE, physicsWorld, {
    maximumContactMarkers,
    enabled: physicsDebug,
  });
  const traffic = createTrafficVisuals(THREE, terrain, { maximumTrafficVehicles });
  const race = createRaceVisuals(THREE, raceCourse);
  const geospatialRoot = new THREE.Group();
  geospatialRoot.name = 'motorcycle-geospatial-origin';
  geospatialRoot.add(terrainVisual, roads, buildings, traffic.root, race.root);
  root.add(geospatialRoot, motorcycle.root, contacts.root);
  scene.add(root);

  let disposed = false;
  let frameCount = 0;
  let lastInterpolationAlpha = 0;
  let disposal = null;
  const originOffset = [0, 0, 0];
  const telemetry = () => {
    const roadCounts = roads.userData;
    const buildingCounts = buildings.userData;
    const motorcycleCounts = motorcycle.getTelemetry();
    const trafficCounts = traffic.getTelemetry();
    const contactCounts = contacts.getTelemetry();
    const dataCounts = sceneData.counts ?? {};
    return deepFreeze({
      schemaVersion: 'peercompute.motorcycle.world-renderer.telemetry.v1',
      disposed,
      frameCount,
      lastInterpolationAlpha,
      origin: {
        offset: [...originOffset],
        geospatialRootPosition: geospatialRoot.position.toArray(),
      },
      navigationGrade: false,
      terrain: {
        source: clonePlain(terrain.source ?? null),
        authoritative: terrain.source?.authoritative === true,
        derived: terrain.source?.derived === true,
        vertexCount: terrainVisual.userData.vertexCount,
        triangleCount: terrainVisual.userData.triangleCount,
        style: terrainVisual.userData.style,
        surfaceOpacity: terrainVisual.userData.surfaceOpacity,
        contours: clonePlain(terrainVisual.userData.contours),
      },
      roads: {
        sourceFeatureCount: Number(dataCounts.sourceRoads) || 0,
        sceneSegmentCount: sceneData.roadSegments.length,
        renderedSegmentCount: roadCounts.renderedSegmentCount,
        sceneOmittedCount: Math.max(0, Number(dataCounts.omittedRoadSegments) || 0),
        rendererCapOmittedCount: roadCounts.rendererCapOmittedCount,
        invalidOmittedCount: roadCounts.invalidOmittedCount,
        totalKnownOmittedCount: countKnownOmitted(
          dataCounts.omittedRoadSegments,
          roadCounts.rendererCapOmittedCount,
          roadCounts.invalidOmittedCount,
        ),
        provenance: clonePlain(sceneData.provenance ?? null),
        navigationGrade: false,
      },
      buildings: {
        sourceFeatureCount: Number(dataCounts.sourceBuildings) || 0,
        sceneBuildingCount: sceneData.buildings.length,
        renderedBuildingCount: buildingCounts.renderedBuildingCount,
        renderedHoleCount: buildingCounts.renderedHoleCount,
        sceneOmittedCount: Math.max(0, Number(dataCounts.omittedBuildings) || 0),
        rendererCapOmittedCount: buildingCounts.rendererCapOmittedCount,
        invalidOmittedCount: buildingCounts.invalidOmittedCount,
        totalKnownOmittedCount: countKnownOmitted(
          dataCounts.omittedBuildings,
          buildingCounts.rendererCapOmittedCount,
          buildingCounts.invalidOmittedCount,
        ),
        provenance: clonePlain(sceneData.provenance ?? null),
        navigationGrade: false,
      },
      motorcycle: clonePlain(motorcycleCounts),
      contacts: clonePlain(contactCounts),
      traffic: clonePlain(trafficCounts),
      race: clonePlain(race.telemetry),
      limits: {
        maximumRoadSegments,
        maximumBuildings,
        maximumMotorcycleParticles,
        maximumContactMarkers,
        maximumTrafficVehicles,
        physicsDebug,
        maximumTerrainContourLevels: terrainVisual.userData.contours.maximumContourLevels,
        maximumTerrainNurbsCurves: terrainVisual.userData.contours.maximumNurbsCurves,
        maximumTerrainContourVertices: terrainVisual.userData.contours.maximumSampledVertices,
      },
      disposal: clonePlain(disposal),
    });
  };

  const publicApi = {
    root,
    update({
      alpha = 0,
      trafficSnapshot = null,
      interpolatedTransforms = null,
      collectTelemetry = true,
    } = {}) {
      if (disposed) throw new Error('Cannot update a disposed motorcycle world renderer.');
      const blend = Number(alpha);
      if (!Number.isFinite(blend)) throw new TypeError('Renderer interpolation alpha must be finite.');
      if (typeof collectTelemetry !== 'boolean') {
        throw new TypeError('Renderer collectTelemetry must be boolean.');
      }
      lastInterpolationAlpha = Math.min(1, Math.max(0, blend));
      motorcycle.update(lastInterpolationAlpha, interpolatedTransforms);
      // In minimalist mode this samples counts only; it never creates or
      // updates marker geometry. Keeping it live prevents stale collision
      // telemetry while preserving the sparse default rendering contract.
      contacts.update();
      traffic.update(trafficSnapshot);
      frameCount += 1;
      // The animation loop does not consume the deep immutable status tree.
      // Avoid cloning/freezing it at frame rate; diagnostics retain the prior
      // return contract by default and may opt into the lightweight counter.
      return collectTelemetry ? telemetry() : frameCount;
    },
    getTelemetry: telemetry,
    getStatus: telemetry,
    shiftOrigin(shift) {
      if (disposed) throw new Error('Cannot rebase a disposed motorcycle world renderer.');
      if ((!Array.isArray(shift) && !ArrayBuffer.isView(shift)) || shift.length < 3) {
        throw new TypeError('Renderer origin shift must contain three components.');
      }
      const value = Array.from(shift).slice(0, 3).map(Number);
      if (!value.every(Number.isFinite)) throw new TypeError('Renderer origin shift must be finite.');
      for (let index = 0; index < 3; index += 1) originOffset[index] += value[index];
      geospatialRoot.position.set(-originOffset[0], -originOffset[1], -originOffset[2]);
      geospatialRoot.updateMatrixWorld(true);
      return Object.freeze([...originOffset]);
    },
    dispose() {
      if (disposed) return false;
      scene.remove(root);
      // Model instances share GPU resources owned by the application-level
      // model resource. Detach/release before the generic world disposer walks
      // this location snapshot, then dispose the shared resource only at app
      // shutdown.
      motorcycle.releaseModel();
      disposal = disposeThreeObject(root);
      root.clear();
      disposed = true;
      return true;
    },
  };
  return Object.freeze(publicApi);
}

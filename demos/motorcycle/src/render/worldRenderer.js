import { MOTORCYCLE_RENDER_LIMITS } from './constants.js';
import { createContactVisuals, createMotorcycleVisuals, createTrafficVisuals } from './dynamicWorld.js';
import { createRaceVisuals } from './raceVisuals.js';
import { createBuildingVisuals, createRoadVisuals, createTerrainVisual } from './staticWorld.js';
import {
  createTerrainDrapedRoadSurface,
  MOTORCYCLE_ROAD_SURFACE_SCHEMA,
} from '../world/roadSurface.js';

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

function referenceFrameMatrix(THREE, transform) {
  for (const method of ['transformPoint', 'transformVector']) {
    if (typeof transform?.[method] !== 'function') {
      throw new TypeError(`Renderer reference-frame transform requires ${method}().`);
    }
  }
  const origin = transform.transformPoint([0, 0, 0]);
  const basisX = transform.transformVector([1, 0, 0]);
  const basisY = transform.transformVector([0, 1, 0]);
  const basisZ = transform.transformVector([0, 0, 1]);
  const values = [...origin, ...basisX, ...basisY, ...basisZ].map(Number);
  if (values.length !== 12 || !values.every(Number.isFinite)) {
    throw new TypeError('Renderer reference-frame transform returned non-finite coordinates.');
  }
  const matrix = new THREE.Matrix4();
  matrix.makeBasis(
    new THREE.Vector3(...basisX),
    new THREE.Vector3(...basisY),
    new THREE.Vector3(...basisZ),
  );
  matrix.setPosition(new THREE.Vector3(...origin));
  return matrix;
}

function chunkFrameMatrix(THREE, transform) {
  for (const method of ['chunkToCurrentPoint', 'chunkToCurrentVector']) {
    if (typeof transform?.[method] !== 'function') {
      throw new TypeError(`Terrain chunk transform requires ${method}().`);
    }
  }
  const origin = transform.chunkToCurrentPoint([0, 0, 0]);
  const basisX = transform.chunkToCurrentVector([1, 0, 0]);
  const basisY = transform.chunkToCurrentVector([0, 1, 0]);
  const basisZ = transform.chunkToCurrentVector([0, 0, 1]);
  const values = [...origin, ...basisX, ...basisY, ...basisZ].map(Number);
  if (values.length !== 12 || !values.every(Number.isFinite)) {
    throw new TypeError('Terrain chunk transform returned non-finite coordinates.');
  }
  const matrix = new THREE.Matrix4();
  matrix.makeBasis(
    new THREE.Vector3().fromArray(basisX),
    new THREE.Vector3().fromArray(basisY),
    new THREE.Vector3().fromArray(basisZ),
  );
  matrix.setPosition(new THREE.Vector3().fromArray(origin));
  return matrix;
}

function createTerrainCoreRenderView(terrain) {
  const halo = Number(terrain?.halo?.geometryOverlapVertices ?? 0);
  if (!Number.isSafeInteger(halo) || halo <= 0) return terrain;
  const sourceWidth = Number(terrain.width);
  const sourceHeight = Number(terrain.height);
  const width = sourceWidth - halo * 2;
  const height = sourceHeight - halo * 2;
  if (width < 2 || height < 2) {
    throw new RangeError('Terrain render core must retain at least a 2x2 grid.');
  }
  const positions = new Float32Array(width * height * 3);
  const heights = new Float32Array(width * height);
  const localBounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
    minZ: Number.POSITIVE_INFINITY,
    maxZ: Number.NEGATIVE_INFINITY,
  };
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const sourceIndex = (row + halo) * sourceWidth + column + halo;
      const targetIndex = row * width + column;
      heights[targetIndex] = terrain.heights[sourceIndex];
      for (let axis = 0; axis < 3; axis += 1) {
        const value = terrain.positions[sourceIndex * 3 + axis];
        positions[targetIndex * 3 + axis] = value;
        const minimumKey = axis === 0 ? 'minX' : axis === 1 ? 'minY' : 'minZ';
        const maximumKey = axis === 0 ? 'maxX' : axis === 1 ? 'maxY' : 'maxZ';
        localBounds[minimumKey] = Math.min(localBounds[minimumKey], value);
        localBounds[maximumKey] = Math.max(localBounds[maximumKey], value);
      }
    }
  }
  return Object.freeze({
    ...terrain,
    bbox: terrain.coreBbox ?? terrain.bbox,
    width,
    height,
    positions,
    heights,
    localBounds: Object.freeze(localBounds),
    surfaceIndex: null,
    renderCore: Object.freeze({
      sourceWidth,
      sourceHeight,
      haloVertices: halo,
      overlapGeometryRendered: false,
      vertexCount: width * height,
    }),
  });
}

export function disposeThreeObject(root) {
  if (!root?.traverse) {
    return Object.freeze({
      geometries: 0, materials: 0, textures: 0, failureCount: 0, lastError: null,
    });
  }
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  let failureCount = 0;
  let lastError = null;
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
  const disposeResource = (resource, kind) => {
    try {
      resource.dispose();
    } catch (error) {
      failureCount += 1;
      lastError = Object.freeze({
        kind,
        name: error?.name ?? 'Error',
        message: error?.message ?? String(error),
      });
    }
  };
  for (const texture of textures) disposeResource(texture, 'texture');
  for (const geometry of geometries) disposeResource(geometry, 'geometry');
  for (const material of materials) disposeResource(material, 'material');
  return Object.freeze({
    geometries: geometries.size,
    materials: materials.size,
    textures: textures.size,
    failureCount,
    lastError,
  });
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
    roadSurface = null,
    maximumResidentTerrainChunks = 32,
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
  if (roadSurface !== null && roadSurface?.schemaVersion !== MOTORCYCLE_ROAD_SURFACE_SCHEMA) {
    throw new TypeError('Motorcycle world renderer requires a canonical terrain-draped road surface.');
  }
  if (!Number.isSafeInteger(maximumResidentTerrainChunks)
    || maximumResidentTerrainChunks < 9
    || maximumResidentTerrainChunks > 64) {
    throw new RangeError('maximumResidentTerrainChunks must be an integer between 9 and 64.');
  }
  const resolvedRoadSurface = roadSurface ?? createTerrainDrapedRoadSurface(
    terrain,
    sceneData.roadSegments,
    { maximumRoadSegments },
  );
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
  const roads = createRoadVisuals(THREE, sceneData.roadSegments, {
    maximumRoadSegments,
    roadSurface: resolvedRoadSurface,
  });
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
  const streamedTerrainRoot = new THREE.Group();
  streamedTerrainRoot.name = 'motorcycle-streamed-terrain-chunks';
  root.add(geospatialRoot, streamedTerrainRoot, motorcycle.root, contacts.root);
  scene.add(root);

  let disposed = false;
  let frameCount = 0;
  let lastInterpolationAlpha = 0;
  let disposal = null;
  const originOffset = [0, 0, 0];
  let referenceFrameTransformCount = 0;
  let lastReferenceFrameTransform = null;
  let streamedRevision = 0;
  let streamedAccessSequence = 0;
  let streamedBuildCount = 0;
  let streamedReuseCount = 0;
  let streamedEvictionCount = 0;
  let streamedDisposalFailureCount = 0;
  let streamedLastDisposalError = null;
  let streamedTerrainEnabled = true;
  let streamedActiveKeys = new Set();
  const streamedTerrainCache = new Map();
  const disposeStreamedRoot = (object) => {
    const result = disposeThreeObject(object);
    streamedDisposalFailureCount += result.failureCount;
    if (result.lastError) streamedLastDisposalError = result.lastError;
    return result;
  };
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
        geospatialRootQuaternion: geospatialRoot.quaternion.toArray(),
        referenceFrameTransformCount,
        lastReferenceFrameTransform: clonePlain(lastReferenceFrameTransform),
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
        terrainDraped: roadCounts.terrainDraped,
        deckClearanceMeters: roadCounts.deckClearanceMeters,
        collisionModel: roadCounts.collisionModel,
        renderedPatchCount: roadCounts.renderedPatchCount,
        renderedTriangleCount: roadCounts.renderedTriangleCount,
        outsideTerrainOmittedCount: roadCounts.outsideTerrainOmittedCount,
        surface: clonePlain(roadCounts.surfaceTelemetry),
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
      streamingTerrain: {
        schemaVersion: 'peercompute.motorcycle.streamed-terrain-renderer.v1',
        revision: streamedRevision,
        activeChunkCount: streamedTerrainRoot.children.length,
        residentChunkCount: streamedTerrainCache.size,
        buildCount: streamedBuildCount,
        reuseCount: streamedReuseCount,
        evictionCount: streamedEvictionCount,
        maximumResidentTerrainChunks,
        initialTerrainVisible: terrainVisual.visible,
        visible: streamedTerrainEnabled,
        geometryModel: 'immutable-three-terrain-chunks-in-current-enu',
        haloPolicy: 'collision-only-render-core-bounds',
        overlapGeometryRendered: false,
        renderedCoreVertexCount: [...streamedTerrainCache.values()].reduce(
          (sum, entry) => sum + (
            entry.root.parent === streamedTerrainRoot
              ? entry.renderTerrain?.renderCore?.vertexCount ?? 0
              : 0
          ),
          0,
        ),
        residentCoreVertexCount: [...streamedTerrainCache.values()].reduce(
          (sum, entry) => sum + (entry.renderTerrain?.renderCore?.vertexCount ?? 0),
          0,
        ),
        disposalFailureCount: streamedDisposalFailureCount,
        lastDisposalError: clonePlain(streamedLastDisposalError),
      },
      limits: {
        maximumRoadSegments,
        maximumBuildings,
        maximumMotorcycleParticles,
        maximumContactMarkers,
        maximumTrafficVehicles,
        maximumResidentTerrainChunks,
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
    roadSurface: resolvedRoadSurface,
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
    syncSurfaceSnapshot(snapshot) {
      return this.prepareSurfaceSnapshot(snapshot).commit();
    },
    prepareSurfaceSnapshot(snapshot) {
      if (disposed) throw new Error('Cannot synchronize a disposed motorcycle world renderer.');
      if (snapshot?.schemaVersion !== 'peercompute.motorcycle.globe-surface-snapshot.v1') {
        throw new TypeError('Renderer requires a canonical globe-surface snapshot.');
      }
      if (snapshot.revision === streamedRevision) {
        return Object.freeze({
          schemaVersion: 'peercompute.motorcycle.prepared-surface-snapshot.v1',
          commitModel: 'validated-synchronous-noexcept',
          revision: snapshot.revision,
          commit: () => false,
          dispose: () => false,
        });
      }
      const activeKeys = new Set(snapshot.activeKeys);
      const prepared = [];
      let nextAccessSequence = streamedAccessSequence;
      try {
        for (const record of snapshot.records) {
          const resident = streamedTerrainCache.get(record.key) ?? null;
          let entry = resident?.terrain === record.terrain ? resident : null;
          const created = entry === null;
          if (created) {
            const renderTerrain = createTerrainCoreRenderView(record.terrain);
            const visual = createTerrainVisual(THREE, renderTerrain, {
              ...terrainMaterial,
              maximumContourLevels: Math.min(
                24,
                MOTORCYCLE_RENDER_LIMITS.maximumTerrainContourLevels,
              ),
              maximumNurbsCurves: Math.min(
                64,
                MOTORCYCLE_RENDER_LIMITS.maximumTerrainNurbsCurves,
              ),
              maximumSampledVertices: Math.min(
                12_000,
                MOTORCYCLE_RENDER_LIMITS.maximumTerrainContourVertices,
              ),
            });
            visual.name = `motorcycle-streamed-terrain-${record.key.replaceAll('/', '-')}`;
            visual.matrixAutoUpdate = false;
            entry = {
              key: record.key,
              terrain: record.terrain,
              renderTerrain,
              root: visual,
              lastAccess: 0,
            };
          }
          prepared.push({
            record,
            entry,
            replaced: created ? resident : null,
            created,
            access: ++nextAccessSequence,
            matrix: chunkFrameMatrix(THREE, record.transform),
          });
        }
      } catch (error) {
        for (const item of prepared) {
          if (item.created) disposeStreamedRoot(item.entry.root);
        }
        throw error;
      }
      let committed = false;
      let released = false;
      return Object.freeze({
        schemaVersion: 'peercompute.motorcycle.prepared-surface-snapshot.v1',
        commitModel: 'validated-synchronous-noexcept',
        revision: snapshot.revision,
        commit() {
          if (committed) return true;
          if (released || disposed) {
            if (!released) {
              for (const item of prepared) {
                if (item.created) disposeStreamedRoot(item.entry.root);
              }
              released = true;
            }
            return false;
          }
          for (const entry of streamedTerrainCache.values()) {
            if (!activeKeys.has(entry.key) && entry.root.parent === streamedTerrainRoot) {
              streamedTerrainRoot.remove(entry.root);
            }
          }
          for (const item of prepared) {
            if (item.replaced) {
              item.replaced.root.removeFromParent?.();
              disposeStreamedRoot(item.replaced.root);
            }
            item.entry.lastAccess = item.access;
            item.entry.root.matrix.copy(item.matrix);
            item.entry.root.matrixWorldNeedsUpdate = true;
            streamedTerrainCache.set(item.record.key, item.entry);
            if (item.entry.root.parent !== streamedTerrainRoot) {
              streamedTerrainRoot.add(item.entry.root);
            }
            if (item.created) streamedBuildCount += 1;
            else streamedReuseCount += 1;
          }
          streamedAccessSequence = nextAccessSequence;
          while (streamedTerrainCache.size > maximumResidentTerrainChunks) {
            const candidate = [...streamedTerrainCache.values()]
              .filter((entry) => !activeKeys.has(entry.key))
              .sort((left, right) => left.lastAccess - right.lastAccess
                || left.key.localeCompare(right.key))[0];
            if (!candidate) break;
            candidate.root.removeFromParent?.();
            disposeStreamedRoot(candidate.root);
            streamedTerrainCache.delete(candidate.key);
            streamedEvictionCount += 1;
          }
          terrainVisual.visible = snapshot.records.length === 0;
          streamedTerrainEnabled = true;
          streamedActiveKeys = new Set(snapshot.activeKeys);
          streamedRevision = snapshot.revision;
          streamedTerrainRoot.updateMatrixWorld(true);
          committed = true;
          return true;
        },
        dispose() {
          if (committed || released) return false;
          for (const item of prepared) {
            if (item.created) disposeStreamedRoot(item.entry.root);
          }
          released = true;
          return true;
        },
      });
    },
    setStreamedTerrainVisible(visible) {
      if (disposed) throw new Error('Cannot change a disposed motorcycle world renderer.');
      streamedTerrainEnabled = Boolean(visible);
      for (const entry of streamedTerrainCache.values()) {
        const shouldAttach = streamedTerrainEnabled && streamedActiveKeys.has(entry.key);
        if (shouldAttach && entry.root.parent !== streamedTerrainRoot) streamedTerrainRoot.add(entry.root);
        if (!shouldAttach && entry.root.parent === streamedTerrainRoot) streamedTerrainRoot.remove(entry.root);
      }
      terrainVisual.visible = !streamedTerrainEnabled || streamedTerrainRoot.children.length === 0;
      streamedTerrainRoot.updateMatrixWorld(true);
      return streamedTerrainEnabled;
    },
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
    transformReferenceFrame(transform) {
      return this.prepareReferenceFrameTransform(transform).commit();
    },
    prepareReferenceFrameTransform(transform) {
      if (disposed) throw new Error('Cannot transform a disposed motorcycle world renderer.');
      const frameMatrix = referenceFrameMatrix(THREE, transform);
      geospatialRoot.updateMatrix();
      const composed = frameMatrix.clone().multiply(geospatialRoot.matrix);
      const preparedPosition = new THREE.Vector3();
      const preparedQuaternion = new THREE.Quaternion();
      const preparedScale = new THREE.Vector3();
      composed.decompose(
        preparedPosition,
        preparedQuaternion,
        preparedScale,
      );
      let committed = false;
      return Object.freeze({
        schemaVersion: 'peercompute.motorcycle.prepared-render-reference-frame-transform.v1',
        commitModel: 'validated-synchronous-noexcept',
        commit() {
          if (committed) return lastReferenceFrameTransform;
          if (disposed) return false;
          geospatialRoot.position.copy(preparedPosition);
          geospatialRoot.quaternion.copy(preparedQuaternion);
          geospatialRoot.scale.copy(preparedScale);
          geospatialRoot.updateMatrixWorld(true);
          referenceFrameTransformCount += 1;
          lastReferenceFrameTransform = Object.freeze({
            sequence: referenceFrameTransformCount,
            position: Object.freeze(geospatialRoot.position.toArray()),
            orientation: Object.freeze(geospatialRoot.quaternion.toArray()),
          });
          committed = true;
          return lastReferenceFrameTransform;
        },
      });
    },
    dispose() {
      if (disposed) return false;
      scene.remove(root);
      // Model instances share GPU resources owned by the application-level
      // model resource. Detach/release before the generic world disposer walks
      // this location snapshot, then dispose the shared resource only at app
      // shutdown.
      motorcycle.releaseModel();
      for (const entry of streamedTerrainCache.values()) {
        entry.root.removeFromParent?.();
        disposeStreamedRoot(entry.root);
      }
      streamedTerrainCache.clear();
      disposal = disposeThreeObject(root);
      root.clear();
      disposed = true;
      return true;
    },
  };
  return Object.freeze(publicApi);
}

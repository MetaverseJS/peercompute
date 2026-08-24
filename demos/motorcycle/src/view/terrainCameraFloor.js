function finiteVector(value, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < 3) {
    throw new TypeError(`${label} must contain three components.`);
  }
  const result = Array.from(value).slice(0, 3).map(Number);
  if (!result.every(Number.isFinite)) throw new TypeError(`${label} must be finite.`);
  return result;
}

/**
 * Keeps a desktop camera or the tracked XR camera above the exact rendered
 * terrain triangles. XR correction moves the locomotion root; it never writes
 * the headset-controlled camera pose.
 */
export function createTerrainCameraFloor(THREE, {
  minimumClearanceMeters = 0.35,
} = {}) {
  if (!THREE?.Vector3) throw new TypeError('Three.js Vector3 is required.');
  const clearance = Number(minimumClearanceMeters);
  if (!Number.isFinite(clearance) || clearance <= 0 || clearance > 5) {
    throw new RangeError('minimumClearanceMeters must be between zero and five metres.');
  }
  const cameraWorld = new THREE.Vector3();
  const targetWorld = new THREE.Vector3();
  let telemetry = Object.freeze({
    status: 'uninitialized',
    mode: null,
    clamped: false,
    correctionMeters: 0,
    terrainHeightMeters: null,
    clearanceMeters: clearance,
  });

  const minimumViewY = ({ position, mode, terrain, originOffset = [0, 0, 0] } = {}) => {
    if (!['first', 'third', 'xr'].includes(mode)) throw new RangeError('Camera floor mode is invalid.');
    const cameraPosition = finiteVector(position, 'position');
    if (terrain?.schemaVersion !== 'peercompute.geo.local-terrain-grid.v1'
      || typeof terrain.sampleLocalHeight !== 'function') {
      telemetry = Object.freeze({
        status: 'no-terrain', mode, clamped: false, correctionMeters: 0,
        terrainHeightMeters: null, clearanceMeters: clearance,
      });
      return Number.NEGATIVE_INFINITY;
    }
    const offset = finiteVector(originOffset, 'originOffset');
    let sourceX = cameraPosition[0] + offset[0];
    let sourceZ = cameraPosition[2] + offset[2];
    let sampleMode = 'exact-triangle';
    const bounds = terrain.localBounds;
    if (bounds && [bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ].every(Number.isFinite)) {
      const clampedX = Math.min(bounds.maxX, Math.max(bounds.minX, sourceX));
      const clampedZ = Math.min(bounds.maxZ, Math.max(bounds.minZ, sourceZ));
      if (clampedX !== sourceX || clampedZ !== sourceZ) sampleMode = 'nearest-terrain-edge';
      sourceX = clampedX;
      sourceZ = clampedZ;
    }
    let sourceTerrainHeight = Number(terrain.sampleLocalHeight(sourceX, sourceZ));
    if (!Number.isFinite(sourceTerrainHeight)) {
      const fallback = Number(bounds?.maxY);
      if (!Number.isFinite(fallback)) throw new Error('Terrain camera floor could not resolve a finite safe height.');
      sourceTerrainHeight = fallback;
      sampleMode = 'terrain-maximum-fallback';
    }
    const terrainHeight = sourceTerrainHeight - offset[1];
    const minimumCameraHeight = terrainHeight + clearance;
    telemetry = Object.freeze({
      status: cameraPosition[1] < minimumCameraHeight ? 'requires-clamp' : 'clear',
      mode,
      clamped: cameraPosition[1] < minimumCameraHeight,
      correctionMeters: Math.max(0, minimumCameraHeight - cameraPosition[1]),
      terrainHeightMeters: terrainHeight,
      minimumCameraHeightMeters: minimumCameraHeight,
      cameraHeightMeters: cameraPosition[1],
      clearanceMeters: clearance,
      sampleMode,
      sampledSourcePosition: Object.freeze([sourceX, sourceZ]),
      coordinateSpace: 'rebased-local-meters',
    });
    return minimumCameraHeight;
  };

  const apply = ({ camera, xrRoot = null, mode, terrain, originOffset = [0, 0, 0] } = {}) => {
    if (!['first', 'third', 'xr'].includes(mode)) throw new RangeError('Camera floor mode is invalid.');
    if (!camera?.getWorldPosition || !camera?.position) throw new TypeError('A Three.js camera is required.');
    const targetObject = mode === 'xr' ? xrRoot : camera;
    if (!targetObject?.position || !targetObject?.getWorldPosition) {
      throw new TypeError('XR camera clamping requires the tracked locomotion root.');
    }
    targetObject.parent?.updateMatrixWorld?.(true);
    targetObject.updateMatrixWorld?.(true);
    camera.updateMatrixWorld?.(true);
    camera.getWorldPosition(cameraWorld);
    const minimumCameraHeight = minimumViewY({
      position: cameraWorld.toArray(), mode, terrain, originOffset,
    });
    const correction = Math.max(0, minimumCameraHeight - cameraWorld.y);
    if (correction > 0) {
      targetObject.getWorldPosition(targetWorld);
      targetWorld.y += correction;
      if (targetObject.parent?.worldToLocal) targetObject.parent.worldToLocal(targetWorld);
      targetObject.position.copy(targetWorld);
      targetObject.updateMatrixWorld?.(true);
      camera.updateMatrixWorld?.(true);
      camera.getWorldPosition(cameraWorld);
    }
    telemetry = Object.freeze({
      ...telemetry,
      status: correction > 0 ? 'clamped' : 'clear',
      clamped: correction > 0,
      correctionMeters: correction,
      cameraHeightMeters: cameraWorld.y,
      xrPolicy: mode === 'xr' ? 'move-locomotion-root-not-tracked-camera' : null,
    });
    return telemetry;
  };

  return Object.freeze({
    apply,
    minimumViewY,
    getTelemetry: () => telemetry,
  });
}

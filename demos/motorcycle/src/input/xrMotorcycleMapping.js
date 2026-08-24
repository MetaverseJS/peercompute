function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, Number(value) || 0));
}

function applyDeadzone(value, deadzone) {
  const normalized = clamp(value, -1, 1);
  const threshold = clamp(deadzone, 0, 0.95);
  const magnitude = Math.abs(normalized);
  if (magnitude <= threshold) return 0;
  return Math.sign(normalized) * ((magnitude - threshold) / (1 - threshold));
}

function button(snapshot, index) {
  const candidate = snapshot.buttons[index];
  if (!candidate) return 0;
  return candidate.value > 0 ? candidate.value : (candidate.pressed ? 1 : 0);
}

function primaryAxes(snapshot) {
  const pairs = [[snapshot.axes[0] ?? 0, snapshot.axes[1] ?? 0]];
  if (snapshot.axes.length >= 4) pairs.push([snapshot.axes[2] ?? 0, snapshot.axes[3] ?? 0]);
  return pairs.reduce((selected, pair) => (
    Math.abs(pair[0]) + Math.abs(pair[1]) > Math.abs(selected[0]) + Math.abs(selected[1])
      ? pair
      : selected
  ), pairs[0]);
}

function wrapAngle(value) {
  return Math.atan2(Math.sin(value), Math.cos(value));
}

function targetRayYaw(sourceState) {
  const pose = sourceState?.poses?.targetRay;
  if (pose?.visible === false) return null;
  const orientation = pose?.orientation;
  if ((!Array.isArray(orientation) && !ArrayBuffer.isView(orientation)) || orientation.length < 4) return null;
  const [x, y, z, w] = Array.from(orientation).slice(0, 4).map(Number);
  if (![x, y, z, w].every(Number.isFinite)) return null;
  const forwardX = -2 * (x * z + w * y);
  const forwardZ = -(1 - 2 * (x * x + y * y));
  return Math.atan2(-forwardX, -forwardZ);
}

/** RoadVector's application-level mapping for W3C `xr-standard` controls. */
export function mapXRStandardMotorcycle(snapshot, entry, { deadzone = 0.14 } = {}) {
  const [axisX] = primaryAxes(snapshot);
  const steer = applyDeadzone(axisX, deadzone);
  if (entry.handedness === 'left') {
    return {
      steer,
      rearBrake: button(snapshot, 0),
      clutch: button(snapshot, 1),
      shiftDelta: button(snapshot, 4) ? -1 : 0,
      handbrake: button(snapshot, 3),
      cameraToggle: button(snapshot, 5),
    };
  }
  if (entry.handedness === 'right') {
    return {
      throttle: button(snapshot, 0),
      frontBrake: button(snapshot, 1),
      shiftDelta: button(snapshot, 4) ? 1 : 0,
      reset: button(snapshot, 3),
      recenter: button(snapshot, 5),
    };
  }
  return {
    steer,
    throttle: button(snapshot, 0),
    frontBrake: button(snapshot, 1),
    reset: button(snapshot, 3),
    cameraToggle: button(snapshot, 4),
    recenter: button(snapshot, 5),
  };
}

/**
 * Maps the generic copied WebXR input contract into RoadVector controls.
 * Controllers retain their xr-standard mapping. Tracked hands and controllers
 * without a Gamepad use select/squeeze as conservative continuous inputs so
 * no live XRInputSource object crosses into the game simulation.
 */
export function mapMotorcycleXrInput(sourceState, entry, {
  deadzone = 0.14,
  handSteer = 0,
} = {}) {
  const mapped = sourceState?.xrStandard
    ? mapXRStandardMotorcycle(sourceState.xrStandard, entry, { deadzone })
    : {};
  const select = sourceState?.select?.held ? 1 : 0;
  const squeeze = sourceState?.squeeze?.held ? 1 : 0;
  const handedness = sourceState?.handedness ?? entry?.handedness ?? 'none';
  if (handedness === 'left') {
    return {
      ...mapped,
      steer: sourceState?.role === 'hand' ? handSteer : (mapped.steer ?? 0),
      rearBrake: Math.max(mapped.rearBrake ?? 0, select),
      clutch: Math.max(mapped.clutch ?? 0, squeeze),
    };
  }
  if (handedness === 'right') {
    return {
      ...mapped,
      steer: mapped.steer ?? 0,
      throttle: Math.max(mapped.throttle ?? 0, select),
      frontBrake: Math.max(mapped.frontBrake ?? 0, squeeze),
    };
  }
  return {
    ...mapped,
    steer: sourceState?.role === 'hand' ? handSteer : (mapped.steer ?? 0),
    throttle: Math.max(mapped.throttle ?? 0, select),
    rearBrake: Math.max(mapped.rearBrake ?? 0, squeeze),
  };
}

/** Stateful hand-pose calibration wrapped around the pure RoadVector mapping. */
export function createMotorcycleXrInputMapper({
  deadzone = 0.14,
  handSteerRangeRadians = 0.5,
} = {}) {
  if (!Number.isFinite(handSteerRangeRadians) || handSteerRangeRadians <= 0 || handSteerRangeRadians > Math.PI) {
    throw new RangeError('handSteerRangeRadians must be finite and between 0 and PI.');
  }
  const neutralYawBySource = new WeakMap();
  return function motorcycleXrMapper(sourceState, entry) {
    let handSteer = 0;
    const sourceKey = entry?.inputSource;
    if (sourceState?.role === 'hand'
      && sourceState?.handedness === 'left'
      && sourceKey && typeof sourceKey === 'object') {
      const yaw = targetRayYaw(sourceState);
      if (yaw !== null) {
        if (!neutralYawBySource.has(sourceKey)) neutralYawBySource.set(sourceKey, yaw);
        const normalized = clamp(wrapAngle(yaw - neutralYawBySource.get(sourceKey)) / handSteerRangeRadians, -1, 1);
        handSteer = applyDeadzone(normalized, deadzone);
      }
    }
    return mapMotorcycleXrInput(sourceState, entry, { deadzone, handSteer });
  };
}

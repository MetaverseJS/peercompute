export const ROADVECTOR_WORLD_UNITS = 'meters';

export const ROADVECTOR_CAMERA_CONFIG = Object.freeze({
  firstPersonFovDegrees: 68,
  thirdPersonFovDegrees: 60,
  xrFallbackFovDegrees: 68,
  firstOffsetMeters: Object.freeze([0, 1.36, 0.12]),
  thirdOffsetMeters: Object.freeze([0, 2.1, -4.8]),
  thirdLookOffsetMeters: Object.freeze([0, 0.82, 1.15]),
  nearMeters: 0.05,
  farMeters: 20_000,
  fogDensityPerMeter: 0.0009,
});

export const ROADVECTOR_SCALE_DISCLOSURE = Object.freeze({
  worldUnits: ROADVECTOR_WORLD_UNITS,
  localRegionDiameterMeters: 2_400,
  hemisphereDiameterKilometers: 12_742,
  transition: 'discrete-overview-to-local',
});

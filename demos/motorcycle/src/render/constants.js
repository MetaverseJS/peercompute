export const MOTORCYCLE_RENDER_LIMITS = Object.freeze({
  maximumRoadSegments: 5_000,
  maximumBuildings: 1_500,
  maximumMotorcycleParticles: 512,
  maximumContactMarkers: 512,
  maximumTerrainContourLevels: 96,
  maximumTerrainNurbsCurves: 512,
  maximumTerrainContourVertices: 60_000,
  defaultMaximumTrafficVehicles: 64,
  absoluteMaximumTrafficVehicles: 256,
});

export const NEON_TOPO_PALETTE = Object.freeze({
  terrain: 0x37ff78,
  terrainMajor: 0xc9ff35,
  buildingFill: 0x168bff,
  buildingWire: 0x24eaff,
  roads: Object.freeze({
    motorway: 0xff31f6,
    trunk: 0xff6b2c,
    primary: 0xffe74a,
    secondary: 0x24eaff,
    tertiary: 0x6eff8d,
    residential: 0x37ff78,
    service: 0x16ba58,
    path: 0xa4ff4f,
    rail: 0xb45cff,
    other: 0x35ff76,
  }),
  motorcycle: Object.freeze({
    chassis: 0xff31f6,
    rearSwingarm: 0xff8a2b,
    rearWheel: 0x24eaff,
    upperFork: 0xffe74a,
    lowerFork: 0x6eff8d,
    frontWheel: 0x37f2ff,
    rider: 0xfff36a,
    other: 0xffffff,
  }),
  traffic: Object.freeze({
    'traffic-cyan': 0x24eaff,
    'traffic-magenta': 0xff31f6,
    'traffic-amber': 0xffb52b,
    other: 0x9dff38,
  }),
  contact: 0xff405f,
});

function validHexString(value) {
  return typeof value === 'string' && /^#?[0-9a-f]{6}$/iu.test(value);
}

export function normalizeColorValue(value, fallback = 0xffffff) {
  if (Number.isInteger(value) && value >= 0 && value <= 0xffffff) return value;
  if (validHexString(value)) return Number.parseInt(value.replace('#', ''), 16);
  return fallback;
}

export function roadCategoryColor(category, sourceColor = null) {
  const fallback = NEON_TOPO_PALETTE.roads[category] ?? NEON_TOPO_PALETTE.roads.other;
  return normalizeColorValue(sourceColor, fallback);
}

export function motorcycleComponentColor(component) {
  return NEON_TOPO_PALETTE.motorcycle[component] ?? NEON_TOPO_PALETTE.motorcycle.other;
}

export function trafficCategoryColor(category) {
  return NEON_TOPO_PALETTE.traffic[category] ?? NEON_TOPO_PALETTE.traffic.other;
}

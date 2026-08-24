export const ROAD_RACE_COURSE_SCHEMA = 'peercompute.motorcycle.road-race-course.v1';
export const ROAD_RACE_SNAPSHOT_SCHEMA = 'peercompute.motorcycle.road-race-snapshot.v1';
export const CANONICAL_ROAD_GRAPH_SCHEMA = 'peercompute.geo.road-graph.v1';
export const LOCAL_ROAD_GRAPH_SCHEMA = 'peercompute.geo.local-road-graph.v1';

export const RACE_LIMITS = Object.freeze({
  absoluteMaxGraphNodes: 50_000,
  absoluteMaxGraphEdges: 100_000,
  absoluteMaxCourseEdges: 512,
  defaultMaxCourseEdges: 192,
  absoluteMaxGates: 64,
  defaultMaxGates: 24,
  absoluteMaxSearchTransitions: 250_000,
  defaultMaxSearchTransitions: 100_000,
  absoluteMaxSearchStartNodes: 1_024,
  defaultMaxSearchStartNodes: 256,
  absoluteMaxLaps: 99,
  defaultLaps: 3,
  absoluteMaxPassageHistory: 1_024,
  defaultMaxPassageHistory: 256,
  absoluteMaxRejectionHistory: 512,
  defaultMaxRejectionHistory: 128,
  absoluteMaxCrossingsPerStep: 64,
  defaultMaxCrossingsPerStep: 64,
  absoluteMaxCourseLengthMeters: 100_000,
  defaultMaxCourseLengthMeters: 20_000,
  defaultPreferredCourseLengthMeters: 1_200,
  defaultPreferredMinimumCourseLengthMeters: 100,
  defaultCheckpointSpacingMeters: 125,
  defaultGateWidthMeters: 14,
  defaultGateHeightMeters: 7,
  defaultSpawnBackMeters: 8,
});

export const RACE_COURSE_PROVENANCE = Object.freeze({
  geometrySource: 'real OSM road graph',
  courseNature: 'game-derived course',
  navigationGrade: false,
  operationalUse: 'gameplay-only',
  attribution: '© OpenStreetMap contributors',
  licenseUrl: 'https://www.openstreetmap.org/copyright',
  derivedDatabase: true,
  disclaimer: 'Game-derived race course over real OSM road geometry; not for navigation, routing, or safety decisions.',
});

export const RACE_GATE_COLORS = Object.freeze({
  startFinish: '#F8FF3D',
  checkpoint: '#2DFFCB',
  finish: '#FF4FD8',
});

export function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

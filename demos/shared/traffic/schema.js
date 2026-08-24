export const ROAD_GRAPH_SCHEMA = 'peercompute.geo.road-graph.v1';
export const TRAFFIC_SNAPSHOT_SCHEMA = 'peercompute.synthetic-road-traffic.snapshot.v1';

export const TRAFFIC_LIMITS = Object.freeze({
  absoluteMaxVehicles: 256,
  defaultMaxVehicles: 64,
  absoluteMaxGraphNodes: 50_000,
  absoluteMaxGraphEdges: 100_000,
  absoluteMaxRestrictions: 2_000,
  absoluteMaxDerivedTotalLanes: 12,
  absoluteMaxLaneCenterOffsetMeters: 20,
  unresolvedRestrictionDetailCap: 64,
  derivedLaneWidthMeters: 3.2,
  absoluteMaxSubsteps: 32,
  absoluteMaxTransitionsPerVehicleStep: 32,
  defaultFixedDtSeconds: 1 / 30,
  defaultMaxFrameDeltaSeconds: 0.25,
  defaultMaxSubsteps: 8,
  defaultMaxTransitionsPerVehicleStep: 8,
  defaultVehicleCount: 18,
  maximumTrafficSpeedKph: 110
});

export const LANE_GEOMETRY_PROVENANCE = Object.freeze({
  sourceField: 'graph.edges[].lanes',
  sourceSemantics: 'OpenStreetMap-reported total lanes for the source way; null means unavailable.',
  derived: true,
  gameOnly: true,
  navigationGrade: false,
  trafficSideAssumption: 'right-hand traffic',
  laneWidthAssumptionMeters: TRAFFIC_LIMITS.derivedLaneWidthMeters,
  missingLaneAssumption: 'one lane for a one-way edge; two total lanes for reciprocal directions',
  fractionalLaneAssumption: 'round source total to the nearest integer before bounded game derivation',
  bidirectionalSplitAssumption: 'split total between reciprocal directions; forward receives any odd remainder; every represented direction receives at least one game lane',
  oneWayPlacementAssumption: 'center the derived carriageway on the source geometry',
  bidirectionalPlacementAssumption: 'place lane centers to the right of each directed source geometry',
  disclaimer: 'Derived lane geometry is synthetic placement for this game, not surveyed roadway geometry.'
});

export const TURN_RESTRICTION_PROVENANCE = Object.freeze({
  sourceField: 'graph.restrictions',
  appliedScope: 'machine-evaluable simple via-node prohibited-transition and only-transition records',
  unresolvedPolicy: 'preserved in bounded telemetry and not enforced',
  conditionalEvaluated: false,
  navigationGrade: false,
  disclaimer: 'Restriction handling is bounded game routing, not navigation-grade turn guidance.'
});

export const DEFAULT_SPEED_LIMITS_KPH = Object.freeze({
  motorway: 100,
  motorway_link: 60,
  trunk: 90,
  trunk_link: 55,
  primary: 65,
  primary_link: 45,
  secondary: 55,
  secondary_link: 40,
  tertiary: 45,
  tertiary_link: 35,
  unclassified: 35,
  residential: 30,
  living_street: 15,
  service: 20,
  road: 30
});

export const TRAFFIC_PROVENANCE = Object.freeze({
  dataNature: 'synthetic-game-simulation',
  synthetic: true,
  liveTraffic: false,
  navigationGrade: false,
  graphSchema: ROAD_GRAPH_SCHEMA,
  geometrySource: 'OpenStreetMap-derived directed road geometry',
  attribution: '© OpenStreetMap contributors',
  licenseUrl: 'https://www.openstreetmap.org/copyright',
  laneGeometry: LANE_GEOMETRY_PROVENANCE,
  turnRestrictions: TURN_RESTRICTION_PROVENANCE,
  disclaimer: 'Synthetic game traffic only; not for navigation, routing, or real-world traffic decisions.'
});

export function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

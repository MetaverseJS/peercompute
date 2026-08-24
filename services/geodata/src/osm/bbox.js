import { z } from 'zod';
import { GeodataError } from '../errors.js';

const EARTH_RADIUS_METERS = 6_371_008.8;
const BBOX_NUMBER_PATTERN = /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u;
const LAYER_ORDER = Object.freeze(['roads', 'buildings']);

function radians(degrees) {
  return degrees * Math.PI / 180;
}

function roundedCoordinate(value) {
  return Number(value.toFixed(6));
}

function outwardSnap(value, increment, direction) {
  const scaled = value / increment;
  const snapped = direction === 'down' ? Math.floor(scaled) : Math.ceil(scaled);
  return roundedCoordinate(snapped * increment);
}

export function measureBbox(bbox) {
  const latitudeRadians = radians(bbox.north - bbox.south);
  const longitudeRadians = radians(bbox.east - bbox.west);
  const middleLatitude = radians((bbox.south + bbox.north) / 2);
  const northSouthMeters = EARTH_RADIUS_METERS * latitudeRadians;
  const eastWestMeters = EARTH_RADIUS_METERS * Math.abs(Math.cos(middleLatitude)) * longitudeRadians;
  return Object.freeze({
    northSouthMeters,
    eastWestMeters,
    areaSquareMeters: northSouthMeters * eastWestMeters
  });
}

export function parseAndSnapBbox(value, limits) {
  if (typeof value !== 'string' || value.length > 160) {
    throw new GeodataError('INVALID_BBOX', 'bbox must contain south,west,north,east decimal coordinates.', {
      statusCode: 400
    });
  }

  const parts = value.split(',').map((part) => part.trim());
  if (parts.length !== 4 || parts.some((part) => !BBOX_NUMBER_PATTERN.test(part))) {
    throw new GeodataError('INVALID_BBOX', 'bbox must contain south,west,north,east decimal coordinates.', {
      statusCode: 400
    });
  }

  const [south, west, north, east] = parts.map(Number);
  if (!parts.every((_, index) => Number.isFinite([south, west, north, east][index]))) {
    throw new GeodataError('INVALID_BBOX', 'bbox coordinates must be finite decimal numbers.', {
      statusCode: 400
    });
  }
  if (south < -90 || north > 90 || west < -180 || east > 180) {
    throw new GeodataError('INVALID_BBOX', 'bbox coordinates are outside latitude or longitude bounds.', {
      statusCode: 400
    });
  }
  if (south >= north || west >= east) {
    throw new GeodataError(
      'INVALID_BBOX_ORDER',
      'bbox must not span the dateline and must satisfy south < north and west < east.',
      { statusCode: 400 }
    );
  }

  const snap = limits.bboxSnapDegrees;
  const bbox = Object.freeze({
    south: Math.max(-90, outwardSnap(south, snap, 'down')),
    west: Math.max(-180, outwardSnap(west, snap, 'down')),
    north: Math.min(90, outwardSnap(north, snap, 'up')),
    east: Math.min(180, outwardSnap(east, snap, 'up'))
  });
  const dimensions = measureBbox(bbox);

  if (dimensions.northSouthMeters > limits.bboxMaxAxisMeters
    || dimensions.eastWestMeters > limits.bboxMaxAxisMeters
    || dimensions.areaSquareMeters > limits.bboxMaxAreaSquareMeters) {
    throw new GeodataError(
      'BBOX_TOO_LARGE',
      'The outward-snapped region exceeds 8 km on an axis or 64 km²; request a smaller region.',
      { statusCode: 422, notes: ['Start near a 2 km radius and narrow the region in dense areas.'] }
    );
  }

  return Object.freeze({
    ...bbox,
    dimensions: Object.freeze({
      northSouthMeters: Number(dimensions.northSouthMeters.toFixed(3)),
      eastWestMeters: Number(dimensions.eastWestMeters.toFixed(3)),
      areaSquareMeters: Number(dimensions.areaSquareMeters.toFixed(3))
    }),
    requestOrder: 'south,west,north,east',
    values: Object.freeze([bbox.south, bbox.west, bbox.north, bbox.east]),
    geoJsonValues: Object.freeze([bbox.west, bbox.south, bbox.east, bbox.north])
  });
}

const querySchema = z.object({
  bbox: z.string(),
  layers: z.string().default('roads,buildings'),
  vehicle: z.enum(['motorcycle']).default('motorcycle')
}).strict();

export function parseOsmRegionQuery(query, limits) {
  const parsed = querySchema.safeParse(query);
  if (!parsed.success) {
    throw new GeodataError(
      'INVALID_QUERY',
      'The OSM query accepts bbox, layers, and vehicle=motorcycle only.',
      { statusCode: 400 }
    );
  }

  const requestedLayers = parsed.data.layers.split(',').map((layer) => layer.trim()).filter(Boolean);
  const uniqueLayers = new Set(requestedLayers);
  if (requestedLayers.length === 0
    || uniqueLayers.size !== requestedLayers.length
    || requestedLayers.some((layer) => !LAYER_ORDER.includes(layer))) {
    throw new GeodataError(
      'INVALID_LAYERS',
      'layers must be a comma-separated subset of roads,buildings without duplicates.',
      { statusCode: 400 }
    );
  }

  return Object.freeze({
    bbox: parseAndSnapBbox(parsed.data.bbox, limits),
    layers: Object.freeze(LAYER_ORDER.filter((layer) => uniqueLayers.has(layer))),
    vehicle: parsed.data.vehicle
  });
}

export function formatOverpassBbox(bbox) {
  return [bbox.south, bbox.west, bbox.north, bbox.east]
    .map((value) => value.toFixed(6))
    .join(',');
}

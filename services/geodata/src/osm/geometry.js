import { GeodataError } from '../errors.js';

const COORDINATE_PRECISION = 7;

function invalidGeometry(message) {
  return new GeodataError('UPSTREAM_GEOMETRY_INVALID', message, {
    statusCode: 502,
    retryable: false
  });
}

export function normalizeCoordinate(point) {
  const latitude = Number(point?.lat);
  const longitude = Number(point?.lon);
  if (!Number.isFinite(latitude)
    || !Number.isFinite(longitude)
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180) {
    throw invalidGeometry('The OSM source returned an invalid geometry coordinate.');
  }
  return Object.freeze([
    Number(longitude.toFixed(COORDINATE_PRECISION)),
    Number(latitude.toFixed(COORDINATE_PRECISION))
  ]);
}

export function coordinateKey(coordinate) {
  return `${coordinate[0].toFixed(COORDINATE_PRECISION)},${coordinate[1].toFixed(COORDINATE_PRECISION)}`;
}

function coordinatesEqual(left, right) {
  return left[0] === right[0] && left[1] === right[1];
}

export function normalizeLineGeometry(geometry, minimumPoints = 2) {
  if (!Array.isArray(geometry)) {
    throw invalidGeometry('The OSM source omitted required way geometry.');
  }
  const coordinates = [];
  for (const point of geometry) {
    const coordinate = normalizeCoordinate(point);
    if (!coordinates.at(-1) || !coordinatesEqual(coordinates.at(-1), coordinate)) {
      coordinates.push(coordinate);
    }
  }
  if (coordinates.length < minimumPoints) {
    throw invalidGeometry('The OSM source returned a degenerate way geometry.');
  }
  return coordinates;
}

function signedRingArea(openRing) {
  let area = 0;
  for (let index = 0; index < openRing.length; index += 1) {
    const current = openRing[index];
    const next = openRing[(index + 1) % openRing.length];
    area += current[0] * next[1] - next[0] * current[1];
  }
  return area / 2;
}

function rotateToCanonicalStart(openRing) {
  let startIndex = 0;
  for (let index = 1; index < openRing.length; index += 1) {
    const current = openRing[index];
    const best = openRing[startIndex];
    if (current[0] < best[0] || (current[0] === best[0] && current[1] < best[1])) {
      startIndex = index;
    }
  }
  return [...openRing.slice(startIndex), ...openRing.slice(0, startIndex)];
}

export function canonicalizeRing(coordinates, role = 'outer') {
  const deduplicated = [];
  for (const coordinate of coordinates) {
    if (!deduplicated.at(-1) || !coordinatesEqual(deduplicated.at(-1), coordinate)) {
      deduplicated.push(coordinate);
    }
  }
  if (deduplicated.length > 1 && coordinatesEqual(deduplicated[0], deduplicated.at(-1))) {
    deduplicated.pop();
  }
  if (deduplicated.length < 3) {
    throw invalidGeometry('The OSM source returned a building ring with fewer than three vertices.');
  }
  const area = signedRingArea(deduplicated);
  if (Math.abs(area) < 1e-15) {
    throw invalidGeometry('The OSM source returned a zero-area building ring.');
  }

  const wantsCounterClockwise = role === 'outer';
  const isCounterClockwise = area > 0;
  const oriented = wantsCounterClockwise === isCounterClockwise
    ? deduplicated
    : [...deduplicated].reverse();
  const canonical = rotateToCanonicalStart(oriented);
  canonical.push(canonical[0]);
  return canonical;
}

function fragmentSortKey(fragment) {
  return `${fragment.ref.padStart(20, '0')}:${String(fragment.index).padStart(8, '0')}`;
}

export function stitchRelationRings(members, role) {
  const fragments = members.map((member, index) => ({
    ref: String(member.ref),
    index,
    coordinates: normalizeLineGeometry(member.geometry)
  })).sort((left, right) => fragmentSortKey(left).localeCompare(fragmentSortKey(right)));
  const rings = [];

  while (fragments.length > 0) {
    const seed = fragments.shift();
    const path = [...seed.coordinates];

    while (!coordinatesEqual(path[0], path.at(-1))) {
      const endpoint = path.at(-1);
      const matchIndex = fragments.findIndex((fragment) => (
        coordinatesEqual(fragment.coordinates[0], endpoint)
        || coordinatesEqual(fragment.coordinates.at(-1), endpoint)
      ));
      if (matchIndex < 0) {
        throw invalidGeometry('The OSM source returned an open multipolygon building ring.');
      }
      const [fragment] = fragments.splice(matchIndex, 1);
      const coordinates = coordinatesEqual(fragment.coordinates[0], endpoint)
        ? fragment.coordinates
        : [...fragment.coordinates].reverse();
      path.push(...coordinates.slice(1));
    }

    rings.push(canonicalizeRing(path, role));
  }

  return rings.sort((left, right) => coordinateKey(left[0]).localeCompare(coordinateKey(right[0])));
}

function pointInRing(point, ring) {
  let inside = false;
  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current, current += 1) {
    const [currentX, currentY] = ring[current];
    const [previousX, previousY] = ring[previous];
    const intersects = ((currentY > point[1]) !== (previousY > point[1]))
      && point[0] < (previousX - currentX) * (point[1] - currentY)
        / ((previousY - currentY) || Number.EPSILON) + currentX;
    if (intersects) inside = !inside;
  }
  return inside;
}

function absoluteArea(ring) {
  return Math.abs(signedRingArea(ring.slice(0, -1)));
}

export function assembleMultipolygon(outerRings, innerRings) {
  if (outerRings.length === 0) {
    throw invalidGeometry('The OSM source returned a building relation without an outer ring.');
  }
  const polygons = outerRings.map((outer) => ({ outer, inner: [] }));

  for (const inner of innerRings) {
    const candidates = polygons
      .filter(({ outer }) => pointInRing(inner[0], outer))
      .sort((left, right) => absoluteArea(left.outer) - absoluteArea(right.outer));
    if (candidates.length === 0) {
      throw invalidGeometry('The OSM source returned a building inner ring outside every outer ring.');
    }
    candidates[0].inner.push(inner);
  }

  const coordinates = polygons
    .sort((left, right) => coordinateKey(left.outer[0]).localeCompare(coordinateKey(right.outer[0])))
    .map(({ outer, inner }) => [
      outer,
      ...inner.sort((left, right) => coordinateKey(left[0]).localeCompare(coordinateKey(right[0])))
    ]);

  if (coordinates.length === 1) {
    return Object.freeze({ type: 'Polygon', coordinates: coordinates[0] });
  }
  return Object.freeze({ type: 'MultiPolygon', coordinates });
}

export function featureCollectionBbox(bbox) {
  return [bbox.west, bbox.south, bbox.east, bbox.north];
}

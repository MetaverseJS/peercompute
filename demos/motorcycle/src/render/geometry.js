import { MOTORCYCLE_ROAD_STYLE_GROUP_SCHEMA } from '../world/roadSurface.js';

function finite(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be finite.`);
  return number;
}

function finitePoint(value, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < 3) {
    throw new TypeError(`${label} must be a three-component point.`);
  }
  return [
    finite(value[0], `${label}[0]`),
    finite(value[1], `${label}[1]`),
    finite(value[2], `${label}[2]`),
  ];
}

function assertThree(THREE, names) {
  if (!THREE || typeof THREE !== 'object') throw new TypeError('A Three.js namespace is required.');
  for (const name of names) {
    if (typeof THREE[name] !== 'function' && typeof THREE[name] !== 'object') {
      throw new TypeError(`Three.js namespace is missing ${name}.`);
    }
  }
}

export function geometryHasOnlyFiniteAttributes(geometry) {
  if (!geometry?.isBufferGeometry) return false;
  for (const attribute of Object.values(geometry.attributes)) {
    for (let index = 0; index < attribute.array.length; index += 1) {
      if (!Number.isFinite(attribute.array[index])) return false;
    }
  }
  if (geometry.index) {
    for (let index = 0; index < geometry.index.array.length; index += 1) {
      if (!Number.isFinite(geometry.index.array[index])) return false;
    }
  }
  return true;
}

export function createTerrainGeometry(THREE, terrain) {
  assertThree(THREE, ['BufferGeometry', 'BufferAttribute']);
  const width = Number(terrain?.width);
  const height = Number(terrain?.height);
  if (!Number.isInteger(width) || width < 2 || !Number.isInteger(height) || height < 2) {
    throw new TypeError('Terrain width and height must be grid dimensions of at least two.');
  }
  if ((!ArrayBuffer.isView(terrain.positions) && !Array.isArray(terrain.positions))
    || terrain.positions.length !== width * height * 3) {
    throw new TypeError('Terrain positions must contain width * height finite XYZ values.');
  }
  const positions = Float32Array.from(terrain.positions, (value, index) => finite(value, `positions[${index}]`));
  const indices = new (width * height > 21_845 ? Uint32Array : Uint16Array)(
    (width - 1) * (height - 1) * 6,
  );
  let cursor = 0;
  for (let row = 0; row < height - 1; row += 1) {
    for (let column = 0; column < width - 1; column += 1) {
      const a = row * width + column;
      const b = a + 1;
      const c = a + width;
      const d = c + 1;
      indices.set([a, b, c, b, d, c], cursor);
      cursor += 6;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.name = 'motorcycle-real-terrain-geometry';
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData = {
    sourceId: terrain.source?.id ?? null,
    authoritative: terrain.source?.authoritative === true,
    derived: terrain.source?.derived === true,
    vertexCount: width * height,
    triangleCount: (width - 1) * (height - 1) * 2,
  };
  return geometry;
}

export function createRoadRibbonGeometry(THREE, roadSegments) {
  assertThree(THREE, ['BufferGeometry', 'BufferAttribute']);
  if (roadSegments?.schemaVersion === MOTORCYCLE_ROAD_STYLE_GROUP_SCHEMA) {
    const geometry = new THREE.BufferGeometry();
    geometry.name = `motorcycle-terrain-draped-road-${roadSegments.category}-geometry`;
    geometry.setAttribute('position', new THREE.BufferAttribute(roadSegments.positions, 3));
    geometry.setIndex(new THREE.BufferAttribute(roadSegments.indices, 1));
    if (roadSegments.positions.length > 0) {
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
    }
    geometry.userData = {
      terrainDraped: true,
      elevationModel: 'exact-terrain-triangle-plus-shared-deck-clearance',
      requestedSegmentCount: roadSegments.sourceSegmentCount,
      renderedSegmentCount: roadSegments.sourceSegmentCount,
      renderedPatchCount: roadSegments.patchCount,
      triangleCount: roadSegments.triangleCount,
      vertexCount: roadSegments.vertexCount,
      invalidSegmentCount: 0,
    };
    return geometry;
  }
  if (!Array.isArray(roadSegments)) throw new TypeError('Road segments must be an array.');
  const positions = [];
  const indices = [];
  let renderedSegmentCount = 0;
  let invalidSegmentCount = 0;
  for (let index = 0; index < roadSegments.length; index += 1) {
    let from;
    let to;
    let width;
    try {
      from = finitePoint(roadSegments[index]?.from, `roadSegments[${index}].from`);
      to = finitePoint(roadSegments[index]?.to, `roadSegments[${index}].to`);
      width = finite(roadSegments[index]?.widthMeters, `roadSegments[${index}].widthMeters`);
    } catch {
      invalidSegmentCount += 1;
      continue;
    }
    const dx = to[0] - from[0];
    const dz = to[2] - from[2];
    const planarLength = Math.hypot(dx, dz);
    if (planarLength <= 1e-5 || width <= 0) {
      invalidSegmentCount += 1;
      continue;
    }
    const halfWidth = Math.min(30, Math.max(0.2, width * 0.5));
    const perpendicularX = (-dz / planarLength) * halfWidth;
    const perpendicularZ = (dx / planarLength) * halfWidth;
    const lift = 0.025;
    const base = positions.length / 3;
    positions.push(
      from[0] + perpendicularX, from[1] + lift, from[2] + perpendicularZ,
      from[0] - perpendicularX, from[1] + lift, from[2] - perpendicularZ,
      to[0] + perpendicularX, to[1] + lift, to[2] + perpendicularZ,
      to[0] - perpendicularX, to[1] + lift, to[2] - perpendicularZ,
    );
    indices.push(base, base + 2, base + 1, base + 2, base + 3, base + 1);
    renderedSegmentCount += 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.name = 'motorcycle-road-ribbon-geometry';
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  if (positions.length > 0) {
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
  }
  geometry.userData = {
    requestedSegmentCount: roadSegments.length,
    renderedSegmentCount,
    invalidSegmentCount,
  };
  return geometry;
}

function samePoint(left, right) {
  return Math.abs(left[0] - right[0]) < 1e-7
    && Math.abs(left[1] - right[1]) < 1e-7
    && Math.abs(left[2] - right[2]) < 1e-7;
}

function normalizeRing(value, label) {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array.`);
  const points = value.map((point, index) => finitePoint(point, `${label}[${index}]`));
  if (points.length > 1 && samePoint(points[0], points.at(-1))) points.pop();
  if (points.length < 3) throw new RangeError(`${label} must contain at least three unique points.`);
  return points;
}

function orientRing(THREE, ring, clockwise) {
  const points2 = ring.map((point) => new THREE.Vector2(point[0], point[2]));
  if (THREE.ShapeUtils.isClockWise(points2) !== clockwise) ring.reverse();
  return ring;
}

function triangleUpward(points, a, b, c) {
  const pointA = points[a];
  const pointB = points[b];
  const pointC = points[c];
  const abX = pointB[0] - pointA[0];
  const abZ = pointB[2] - pointA[2];
  const acX = pointC[0] - pointA[0];
  const acZ = pointC[2] - pointA[2];
  return abZ * acX - abX * acZ >= 0;
}

export function createBuildingGeometry(THREE, building) {
  assertThree(THREE, ['BufferGeometry', 'BufferAttribute', 'Vector2', 'ShapeUtils']);
  if (!Array.isArray(building?.rings) || building.rings.length === 0) {
    throw new TypeError('Building rings are required.');
  }
  const heightMeters = finite(building.heightMeters, 'building.heightMeters');
  if (heightMeters <= 0) throw new RangeError('Building height must be greater than zero.');
  const baseHeightMeters = finite(building.baseHeightMeters ?? 0, 'building.baseHeightMeters');
  const extrusionMeters = heightMeters - baseHeightMeters;
  if (baseHeightMeters < 0 || extrusionMeters <= 0) {
    throw new RangeError('Building height must be greater than its non-negative base height.');
  }
  const rings = building.rings.map((ring, index) => normalizeRing(ring, `building.rings[${index}]`));
  orientRing(THREE, rings[0], true);
  for (let index = 1; index < rings.length; index += 1) orientRing(THREE, rings[index], false);

  const contour = rings[0].map((point) => new THREE.Vector2(point[0], point[2]));
  const holes = rings.slice(1).map((ring) => ring.map((point) => new THREE.Vector2(point[0], point[2])));
  const topFaces = THREE.ShapeUtils.triangulateShape(contour, holes);
  const flattened = rings.flat();
  const positions = [];
  for (const point of flattened) positions.push(point[0], point[1], point[2]);
  for (const point of flattened) positions.push(point[0], point[1] + extrusionMeters, point[2]);
  const pointCount = flattened.length;
  const indices = [];
  for (const face of topFaces) {
    let [a, b, c] = face;
    if (!triangleUpward(flattened, a, b, c)) [b, c] = [c, b];
    indices.push(pointCount + a, pointCount + b, pointCount + c);
    indices.push(c, b, a);
  }
  let ringOffset = 0;
  for (const ring of rings) {
    for (let index = 0; index < ring.length; index += 1) {
      const next = (index + 1) % ring.length;
      const a = ringOffset + index;
      const b = ringOffset + next;
      const topA = pointCount + a;
      const topB = pointCount + b;
      indices.push(a, topA, b, b, topA, topB);
    }
    ringOffset += ring.length;
  }

  const IndexArray = positions.length / 3 > 65_535 ? Uint32Array : Uint16Array;
  const geometry = new THREE.BufferGeometry();
  geometry.name = `motorcycle-building-${building.id ?? 'unknown'}`;
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(new THREE.BufferAttribute(new IndexArray(indices), 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData = {
    buildingId: building.id ?? null,
    heightMeters,
    baseHeightMeters,
    extrusionMeters,
    ringCount: rings.length,
    holeCount: Math.max(0, rings.length - 1),
    topTriangleCount: topFaces.length,
    sourceAuthoritative: building.sourceAuthoritative === true,
  };
  return geometry;
}

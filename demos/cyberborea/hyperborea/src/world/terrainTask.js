// Self-contained terrain generator for worker use (no external imports)
const ELEV_MAX = 3000;
const TERRAIN_THRESHOLDS = {
  peak: 0.9 * ELEV_MAX,
  summit: 0.8 * ELEV_MAX,
  alpine: 0.6 * ELEV_MAX,
  boreal: 0.15 * ELEV_MAX,
  beach: 0.025 * ELEV_MAX,
};

class SeededRandom {
  constructor(seed) { this.seed = seed; }
  next() { this.seed = (this.seed * 9301 + 49297) % 233280; return this.seed / 233280; }
}

class SimplexNoise {
  constructor(seed) {
    const rng = new SeededRandom(seed);
    this.perm = [];
    for (let i = 0; i < 256; i++) this.perm[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      [this.perm[i], this.perm[j]] = [this.perm[j], this.perm[i]];
    }
    this.perm = [...this.perm, ...this.perm];
  }
  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(t, a, b) { return a + t * (b - a); }
  grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
  noise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.fade(x);
    const v = this.fade(y);
    const a = this.perm[X] + Y;
    const b = this.perm[X + 1] + Y;
    return this.lerp(v,
      this.lerp(u, this.grad(this.perm[a], x, y), this.grad(this.perm[b], x - 1, y)),
      this.lerp(u, this.grad(this.perm[a + 1], x, y - 1), this.grad(this.perm[b + 1], x - 1, y - 1))
    );
  }
  octave(x, y, octaves, persistence, scale) {
    let total = 0, frequency = 1, amplitude = 1, maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      total += this.noise(x * frequency / scale, y * frequency / scale) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }
    return total / maxValue;
  }
}

class TerrainGenerator {
  constructor(seed) {
    this.heightNoise = new SimplexNoise(seed);
    this.moistureNoise = new SimplexNoise(seed + 1);
    this.treeNoise = new SimplexNoise(seed + 2);
    this.structureNoise = new SimplexNoise(seed + 3);
    this.macroNoise = new SimplexNoise(seed + 4);
    this.warpNoise1 = new SimplexNoise(seed + 5);
    this.warpNoise2 = new SimplexNoise(seed + 6);
  }

  warpCoords(x, z, scale = 8000, amp = 220) {
    const rot = 0.37;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);
    const rx = x * cosR - z * sinR;
    const rz = x * sinR + z * cosR;
    const wx = this.warpNoise1.octave(rx, rz, 2, 0.5, scale) * amp;
    const wz = this.warpNoise2.octave(rx + 1337, rz + 1337, 2, 0.5, scale) * amp;
    return { x: x + wx, z: z + wz };
  }

  getHeight(x, z) {
    const warped = this.warpCoords(x, z, 9000, 260);
    const wx = warped.x;
    const wz = warped.z;
    const macro = this.macroNoise.octave(wx, wz, 5, 0.5, 16000);
    const large = this.heightNoise.octave(wx, wz, 5, 0.5, 4096);
    const medium = this.heightNoise.octave(wx, wz, 5, 0.5, 1024);
    let height = macro * 6000;
    height += large * 600;
    height += medium * 60;
    return height;
  }

  getMoisture(x, z) {
    const warped = this.warpCoords(x, z, 6500, 220);
    const base = this.moistureNoise.octave(warped.x, warped.z, 4, 0.45, 3200);
    const elevation = this.getHeight(x, z);
    const elevFactor = 1 - Math.min(Math.max(elevation / 6000, 0), 1);
    return base * 0.9 + elevFactor * 0.1;
  }

  shouldPlaceTree(x, z, height, moisture) {
    const minTreeH = ELEV_MAX * 0.15;
    const maxTreeH = ELEV_MAX * 0.6;
    if (height < minTreeH || height > maxTreeH) return false;
    const d = 3;
    const h1 = this.getHeight(x + d, z);
    const h2 = this.getHeight(x - d, z);
    const slope = Math.abs(h1 - h2) / (d * 2);
    if (slope > 0.5) return false;
    const density = moisture > 0.05 ? 0.55 : 0.35;
    const warped = this.warpCoords(x, z, 6000, 150);
    return this.treeNoise.noise(warped.x * 0.18, warped.z * 0.18) > (1 - density);
  }

  shouldPlaceStructure(x, z, height) {
    if (height < 20 || height > 150) return false;
    const d = 15;
    const h1 = this.getHeight(x + d, z);
    const h2 = this.getHeight(x - d, z);
    const h3 = this.getHeight(x, z + d);
    const h4 = this.getHeight(x, z - d);
    const flatness = Math.max(
      Math.abs(h1 - height),
      Math.abs(h2 - height),
      Math.abs(h3 - height),
      Math.abs(h4 - height)
    );
    if (flatness > 20) return false;
    const warped = this.warpCoords(x, z, 8000, 220);
    return this.structureNoise.noise(warped.x * 0.01, warped.z * 0.01) > 0.95;
  }
}

/**
 * Compute terrain chunk data off the main thread.
 * @param {Object} params
 * @param {number} params.seed
 * @param {number} params.startX
 * @param {number} params.startZ
 * @param {number} params.lodStep
 * @param {number} params.size
 * @param {string|null} params.treeLevel
 * @param {boolean} params.includeStructures
 */
export function computeTerrainChunk(params) {
  const { seed, startX, startZ, lodStep, size, treeLevel, includeStructures } = params;
  const gridSize = Math.floor(size / lodStep);
  const heights = new Array((gridSize + 1) * (gridSize + 1));
  const moisture = new Array((gridSize + 1) * (gridSize + 1));
  const terrainTypes = new Array((gridSize + 1) * (gridSize + 1));
  const generator = new TerrainGenerator(seed);
  let maxHeight = -Infinity;

  const peakTh = TERRAIN_THRESHOLDS.peak;
  const summitTh = TERRAIN_THRESHOLDS.summit;
  const alpineTh = TERRAIN_THRESHOLDS.alpine;
  const borealTh = TERRAIN_THRESHOLDS.boreal;
  const beachTh = TERRAIN_THRESHOLDS.beach;

  for (let z = 0; z <= gridSize; z++) {
    for (let x = 0; x <= gridSize; x++) {
      const wx = startX + x * lodStep;
      const wz = startZ + z * lodStep;
      const idx = z * (gridSize + 1) + x;
      const h = generator.getHeight(wx, wz);
      const m = generator.getMoisture(wx, wz);
      heights[idx] = h;
      moisture[idx] = m;
      maxHeight = Math.max(maxHeight, h);

      const moistNorm = Math.max(0, Math.min(1, (m + 1) * 0.5));
      const threshOffset = (moistNorm - 0.5) * 0.03 * ELEV_MAX;
      const localPeak = peakTh + threshOffset;
      const localSummit = summitTh + threshOffset;
      const localAlpine = alpineTh + threshOffset;
      const localBoreal = borealTh + threshOffset;
      const localBeach = beachTh + threshOffset;

      let terrainType = 'boreal';
      if (h < localBeach) terrainType = 'water';
      else if (h >= localPeak) terrainType = 'peak';
      else if (h >= localSummit) terrainType = 'summit';
      else if (h >= localAlpine) terrainType = 'alpine';
      else if (h >= localBoreal) terrainType = 'boreal';
      else terrainType = 'beach';
      terrainTypes[idx] = { type: terrainType, height: h, moisture: m };
    }
  }

  const trees = [];
  if (treeLevel) {
    const step = Math.max(16, lodStep * 2);
    for (let z = 0; z < size; z += step) {
      for (let x = 0; x < size; x += step) {
        const wx = startX + x;
        const wz = startZ + z;
        const h = generator.getHeight(wx, wz);
        const m = generator.getMoisture(wx, wz);
        if (generator.shouldPlaceTree(wx, wz, h, m)) {
          const seedVal = Math.sin(wx * 12.9898 + wz * 78.233) * 43758.5453;
          const treeH = 8 + (Math.abs(seedVal) % 1) * 6;
          const treeR = 1.5 + (Math.abs(seedVal * 7) % 1) * 1;
          trees.push({
            x: wx,
            y: h + treeH * 0.65,
            z: wz,
            radius: treeR,
            height: treeH,
            level: treeLevel
          });
        }
      }
    }
  }

  const structures = [];
  if (includeStructures) {
    const centerX = startX + size / 2;
    const centerZ = startZ + size / 2;
    const h = generator.getHeight(centerX, centerZ);
    if (generator.shouldPlaceStructure(centerX, centerZ, h)) {
      structures.push({ x: centerX, y: h, z: centerZ });
    }
  }

  return {
    seed,
    startX,
    startZ,
    size,
    lodStep,
    gridSize,
    heights,
    moisture,
    terrainTypes,
    maxHeight,
    trees,
    structures
  };
}

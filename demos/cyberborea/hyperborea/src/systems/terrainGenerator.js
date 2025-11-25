import { SimplexNoise } from '../utils/noise.js';

export class TerrainGenerator {
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
    // Rotate domain slightly to break axis-aligned repetition
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
    const macro = this.macroNoise.octave(wx, wz, 5, 0.5, 16000); // very large, stronger trends
    const large = this.heightNoise.octave(wx, wz, 5, 0.5, 4096);
    const medium = this.heightNoise.octave(wx, wz, 5, 0.5, 1024);
    const small = this.heightNoise.octave(wx, wz, 5, 0.5, 256);

    let height = macro * 6000;         // more pronounced broad mountains/valleys
    height += large * 600;              // regional variation
    height += medium * 60;             // local undulation
    // height += small * 20;
    return height;
  }

  getMoisture(x, z) {
    const warped = this.warpCoords(x, z, 6500, 220);
    const base = this.moistureNoise.octave(warped.x, warped.z, 4, 0.45, 3200);
    const elevation = this.getHeight(x, z);
    // Elevation-weighted but balanced with noise
    const elevFactor = 1 - Math.min(Math.max(elevation / 6000, 0), 1);
    return base * 0.9 + elevFactor * 0.1;
  }

  shouldPlaceTree(x, z, height, moisture) {
    const ELEV_MAX = 3000;
    const minTreeH = ELEV_MAX * 0.15; // align with boreal band lower bound
    const maxTreeH = ELEV_MAX * 0.6;  // align with boreal upper bound
    if (height < minTreeH || height > maxTreeH) return false;

    const d = 3;
    const h1 = this.getHeight(x + d, z);
    const h2 = this.getHeight(x - d, z);
    const slope = Math.abs(h1 - h2) / (d * 2);
    if (slope > 0.5) return false;

    // Higher baseline density to repopulate trees after mountain amplification
    const density = moisture > 0.05 ? 0.55 : 0.35;
    const warped = this.warpCoords(x, z, 6000, 150);
    return this.treeNoise.noise(warped.x * 0.18, warped.z * 0.18) > (1 - density);
  }

  shouldPlaceStructure(x, z, height) {
    if (height < 20 || height > 150) return false;

    // Check if relatively flat area
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

    // Very rare structures
    const warped = this.warpCoords(x, z, 8000, 220);
    return this.structureNoise.noise(warped.x * 0.01, warped.z * 0.01) > 0.95;
  }
}

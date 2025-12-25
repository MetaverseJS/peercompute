const COLOR_A = [0x44 / 255, 0x88 / 255, 0xff / 255];
const COLOR_B = [0xff / 255, 0xaa / 255, 0xee / 255];
const COLOR_C = [0xff / 255, 0xdd / 255, 0xaa / 255];

const lerp = (a, b, t) => a + (b - a) * t;
const lerpColor = (c1, c2, t) => [
  lerp(c1[0], c2[0], t),
  lerp(c1[1], c2[1], t),
  lerp(c1[2], c2[2], t)
];

const randFactory = (seed) => {
  let localSeed = seed;
  return () => {
    const x = Math.sin(localSeed++) * 10000;
    return x - Math.floor(x);
  };
};

const randomSpherical = (rand, radius) => {
  const theta = rand() * Math.PI * 2;
  const phi = Math.acos(2 * rand() - 1);
  const sinPhi = Math.sin(phi);
  return {
    x: radius * sinPhi * Math.cos(theta),
    y: radius * sinPhi * Math.sin(theta),
    z: radius * Math.cos(phi)
  };
};

export function generateUniverseData({
  seed = 1337,
  starCount = 250000,
  clusterCount = 300,
  scale = 100000000,
  filamentScatter = 0.04
} = {}) {
  const rand = randFactory(seed);
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  const clusters = [];
  for (let i = 0; i < clusterCount; i++) {
    const radius = Math.pow(rand(), 0.5) * scale;
    const p = randomSpherical(rand, radius);
    clusters.push(p);
  }

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const idx1 = Math.floor(rand() * clusterCount);
    let idx2 = idx1;
    let minDist = Infinity;
    for (let k = 0; k < 3; k++) {
      const tryIdx = Math.floor(rand() * clusterCount);
      if (tryIdx === idx1) continue;
      const dx = clusters[idx1].x - clusters[tryIdx].x;
      const dy = clusters[idx1].y - clusters[tryIdx].y;
      const dz = clusters[idx1].z - clusters[tryIdx].z;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < minDist) {
        minDist = distSq;
        idx2 = tryIdx;
      }
    }

    let t = rand();
    t = (t < 0.5) ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;

    const c1 = clusters[idx1];
    const c2 = clusters[idx2];
    const bx = c1.x + (c2.x - c1.x) * t;
    const by = c1.y + (c2.y - c1.y) * t;
    const bz = c1.z + (c2.z - c1.z) * t;

    const noiseScale = scale * filamentScatter;
    const rNoise = rand() * noiseScale;
    const p = randomSpherical(rand, rNoise);

    positions[i3] = bx + p.x;
    positions[i3 + 1] = by + p.y;
    positions[i3 + 2] = bz + p.z;

    const mixVal = rand();
    let c;
    if (mixVal < 0.33) {
      c = lerpColor(COLOR_A, COLOR_B, rand());
    } else if (mixVal < 0.66) {
      c = lerpColor(COLOR_B, COLOR_C, rand());
    } else {
      c = lerpColor(COLOR_C, COLOR_A, rand());
    }
    colors[i3] = c[0];
    colors[i3 + 1] = c[1];
    colors[i3 + 2] = c[2];
    sizes[i] = rand() * 40000.0 + 10000.0;
  }

  return { positions, colors, sizes };
}

export function generateGalaxyData({
  starCount = 250000,
  radius = 1000000,
  type = 0
} = {}) {
  const rand = Math.random;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const orbitParams = new Float32Array(starCount * 3);

  const irregularAttractors = [];
  if (type === 2) {
    for (let k = 0; k < 4; k++) {
      irregularAttractors.push({
        x: (rand() - 0.5) * radius * 1.2,
        y: (rand() - 0.5) * radius * 0.8,
        z: (rand() - 0.5) * radius * 1.2
      });
    }
  }

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    let x = 0;
    let y = 0;
    let z = 0;
    let speed = 1.0;

    if (type === 0) {
      const isBulge = rand() < 0.2;
      if (isBulge) {
        const r = rand() * radius * 0.25;
        const p = randomSpherical(rand, r);
        x = p.x;
        y = p.y * 0.8;
        z = p.z;
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.8;
        colors[i3 + 2] = 0.4;
      } else {
        const r = (rand() * 0.1 + Math.pow(rand(), 2.0) * 0.9) * radius;
        const arms = 2;
        const armOffset = (Math.PI * 2 / arms) * (i % arms);
        const spiralAngle = armOffset + 7.0 * Math.log(r / radius * 10.0 + 1.0);
        x = Math.cos(spiralAngle) * r + (rand() - 0.5) * radius * 0.1;
        z = Math.sin(spiralAngle) * r + (rand() - 0.5) * radius * 0.1;
        y = (rand() - 0.5) * radius * 0.02 * (1.0 + r / radius);
        speed = Math.sqrt(1.0 / (r / radius + 0.1));
        if (rand() > 0.3) {
          colors[i3] = 0.6;
          colors[i3 + 1] = 0.7;
          colors[i3 + 2] = 1.0;
        } else {
          colors[i3] = 1.0;
          colors[i3 + 1] = 1.0;
          colors[i3 + 2] = 1.0;
        }
      }
    } else if (type === 1) {
      const r = Math.pow(rand(), 2.5) * radius * 0.6;
      const p = randomSpherical(rand, r);
      x = p.x * 0.8;
      y = p.y * 0.6;
      z = p.z * 0.8;
      speed = 0.1;
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.7;
      colors[i3 + 2] = 0.3;
    } else {
      const attr = irregularAttractors[i % irregularAttractors.length];
      const locR = rand() * radius * 0.3;
      const p = randomSpherical(rand, locR);
      x = attr.x + p.x;
      y = attr.y + p.y;
      z = attr.z + p.z;
      speed = 0.5;
      if (rand() > 0.9) {
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.1;
        sizes[i] = rand() * 8000 + 4000;
      } else {
        colors[i3] = 0.6;
        colors[i3 + 1] = 0.8;
        colors[i3 + 2] = 1.0;
      }
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    if (sizes[i] === 0) {
      sizes[i] = rand() * 4000.0 + 1000.0;
    }

    orbitParams[i3] = Math.sqrt(x * x + z * z);
    orbitParams[i3 + 1] = speed;
    orbitParams[i3 + 2] = Math.atan2(z, x);
  }

  return {
    positions,
    colors,
    sizes,
    orbitParams
  };
}

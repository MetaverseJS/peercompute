import { clamp, createRng, hashSeed } from '../core/random.js';
import { estimateOrbitalExtentBohr, hydrogenicEnergyEv } from './references.js';

export const L_LABELS = ['s', 'p', 'd', 'f', 'g'];
export const FINE_STRUCTURE_ALPHA = 1 / 137.035999084;

const factorial = (n) => {
  if (n < 0) return 1;
  let out = 1;
  for (let i = 2; i <= n; i++) out *= i;
  return out;
};

const binomial = (n, k) => {
  if (k < 0 || k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
};

const associatedLaguerre = (p, k, x) => {
  let sum = 0;
  for (let i = 0; i <= p; i++) {
    sum += ((-1) ** i) * binomial(p + k, p - i) * (x ** i) / factorial(i);
  }
  return sum;
};

const associatedLegendre = (l, m, x) => {
  const absX = clamp(x, -1, 1);
  let pmm = 1;
  if (m > 0) {
    const root = Math.sqrt((1 - absX) * (1 + absX));
    let fact = 1;
    for (let i = 1; i <= m; i++) {
      pmm *= -fact * root;
      fact += 2;
    }
  }
  if (l === m) return pmm;

  let pmmp1 = absX * (2 * m + 1) * pmm;
  if (l === m + 1) return pmmp1;

  let pll = 0;
  for (let ll = m + 2; ll <= l; ll++) {
    pll = ((2 * ll - 1) * absX * pmmp1 - (ll + m - 1) * pmm) / (ll - m);
    pmm = pmmp1;
    pmmp1 = pll;
  }
  return pll;
};

export const realSphericalHarmonic = (l, m, theta, phi) => {
  const absM = Math.abs(m);
  const plm = associatedLegendre(l, absM, Math.cos(theta));
  const norm = Math.sqrt(((2 * l + 1) / (4 * Math.PI)) * (factorial(l - absM) / factorial(l + absM)));
  if (m > 0) return Math.sqrt(2) * norm * plm * Math.cos(absM * phi);
  if (m < 0) return Math.sqrt(2) * norm * plm * Math.sin(absM * phi);
  return norm * plm;
};

export const effectiveNuclearCharge = (element, n, l, options = {}) => {
  if (!options.screeningExchange || element.Z <= 1) return element.Z;
  const sameShellCapacity = 2 * n * n;
  const lowerShellCapacity = Math.max(0, 2 * (n - 1) * (n - 1));
  const sameShellElectrons = clamp(element.Z - lowerShellCapacity, 0, sameShellCapacity);
  const innerElectrons = Math.max(0, element.Z - sameShellElectrons);
  const sameShellShield = Math.max(0, sameShellElectrons - 1) * 0.35;
  const innerShield = innerElectrons * (l <= 1 ? 0.85 : 0.95);
  const exchangeTerm = l > 0 ? 0.015 * (2 * l + 1) : 0;
  return clamp(element.Z - sameShellShield - innerShield + exchangeTerm, 1, element.Z);
};

export const correctedRadialCharge = (zEff, n, l, options = {}) => {
  if (!options.relativisticSpinOrbit) return zEff;
  const beta = (FINE_STRUCTURE_ALPHA * zEff) ** 2;
  return zEff * (1 + (0.28 * beta) / Math.max(1, n * (l + 1)));
};

export const radialComponent = (n, l, rBohr, zEff) => {
  const rho = (2 * zEff * Math.max(rBohr, 1e-6)) / n;
  const prefactor = Math.sqrt(((2 * zEff) / n) ** 3 * (factorial(n - l - 1) / (2 * n * factorial(n + l))));
  return prefactor * Math.exp(-rho / 2) * (rho ** l) * associatedLaguerre(n - l - 1, 2 * l + 1, rho);
};

const spinOrbitDensityFactor = (theta, n, l, m, zEff, options = {}) => {
  if (!options.relativisticSpinOrbit || l === 0 || m === 0) return 1;
  const beta = (FINE_STRUCTURE_ALPHA * zEff) ** 2;
  const coupling = (0.24 * beta * l) / Math.max(1, n * n);
  return clamp(1 + coupling * Math.cos(theta) * (m / Math.max(1, l)), 0.5, 1.5);
};

const correlationProbability = ({ n, l, m, r, theta, phi, zEff, baseProbability, options }) => {
  if (!options.correlationMixing || n < 2) return baseProbability;
  const candidates = [
    { n: n - 1, l: Math.max(0, Math.min(l, n - 2)), weight: 0.42 },
    { n, l: Math.max(0, l - 1), weight: 0.29 },
    { n, l: Math.min(n - 1, l + 1), weight: 0.29 }
  ].filter((item, index, array) => (
    item.l < item.n && array.findIndex((other) => other.n === item.n && other.l === item.l) === index
  ));
  if (!candidates.length) return baseProbability;

  let mixed = 0;
  let weight = 0;
  for (const item of candidates) {
    const termM = clamp(m, -item.l, item.l);
    const rr = radialComponent(item.n, item.l, r, zEff);
    const yy = realSphericalHarmonic(item.l, termM, theta, phi);
    mixed += item.weight * Math.max(0, rr * rr * yy * yy);
    weight += item.weight;
  }
  const strength = clamp(0.04 + zEff * 0.002, 0.04, 0.18);
  return (1 - strength) * baseProbability + strength * (weight > 0 ? mixed / weight : baseProbability);
};

export const orbitalProbabilityAt = ({ x, y, z, n, l, m, element, options = {} }) => {
  const r = Math.sqrt(x * x + y * y + z * z);
  const theta = r <= 1e-12 ? 0 : Math.acos(clamp(z / r, -1, 1));
  const phi = Math.atan2(y, x);
  const zEff = effectiveNuclearCharge(element, n, l, options);
  const radialZ = correctedRadialCharge(zEff, n, l, options);
  const radial = radialComponent(n, l, r, radialZ);
  const ylm = realSphericalHarmonic(l, m, theta, phi);
  const so = spinOrbitDensityFactor(theta, n, l, m, zEff, options);
  const baseProbability = Math.max(0, radial * radial * ylm * ylm * so);
  return correlationProbability({ n, l, m, r, theta, phi, zEff: radialZ, baseProbability, options });
};

export const buildOrbitalGrid = ({
  element,
  n = 1,
  l = 0,
  m = 0,
  gridSize = 28,
  extentBohr,
  options = {}
}) => {
  const zEff = effectiveNuclearCharge(element, n, l, options);
  const extent = extentBohr || estimateOrbitalExtentBohr({ n, zEff });
  const count = gridSize * gridSize * gridSize;
  const positions = new Float32Array(count * 3);
  const probabilities = new Float64Array(count);
  const spacing = (extent * 2) / Math.max(1, gridSize - 1);

  let total = 0;
  let maxProbability = 0;
  let maxRadius = 0;
  for (let idx = 0; idx < count; idx++) {
    const zIndex = Math.floor(idx / (gridSize * gridSize));
    const yIndex = Math.floor((idx - zIndex * gridSize * gridSize) / gridSize);
    const xIndex = idx % gridSize;
    const x = -extent + xIndex * spacing;
    const y = -extent + yIndex * spacing;
    const z = -extent + zIndex * spacing;
    const p = orbitalProbabilityAt({ x, y, z, n, l, m, element, options });
    const base = idx * 3;
    positions[base] = x;
    positions[base + 1] = y;
    positions[base + 2] = z;
    probabilities[idx] = p;
    total += p;
    if (p > maxProbability) {
      maxProbability = p;
      maxRadius = Math.sqrt(x * x + y * y + z * z);
    }
  }

  const norm = total > 0 ? total : 1;
  for (let i = 0; i < probabilities.length; i++) probabilities[i] /= norm;

  const boundaryMass = estimateBoundaryMass(probabilities, gridSize);
  return {
    positions,
    probabilities,
    extentBohr: extent,
    spacingBohr: spacing,
    gridSize,
    zEff,
    energyEv: hydrogenicEnergyEv({ n, zEff }),
    normalization: probabilities.reduce((a, b) => a + b, 0),
    maxProbability,
    maxRadiusBohr: maxRadius,
    boundaryMass
  };
};

export const estimateBoundaryMass = (probabilities, gridSize) => {
  const area = gridSize * gridSize;
  let boundary = 0;
  let total = 0;
  for (let i = 0; i < probabilities.length; i++) {
    const p = probabilities[i] || 0;
    total += p;
    const z = Math.floor(i / area);
    const yz = i - z * area;
    const y = Math.floor(yz / gridSize);
    const x = yz - y * gridSize;
    if (x === 0 || y === 0 || z === 0 || x === gridSize - 1 || y === gridSize - 1 || z === gridSize - 1) {
      boundary += p;
    }
  }
  return total > 0 ? boundary / total : 0;
};

export const sampleOrbitalPoints = ({
  positions,
  probabilities,
  sampleCount = 60000,
  seed = 'orbital',
  jitterScale = 0.72,
  spacingBohr = 1
}) => {
  const points = new Float32Array(sampleCount * 3);
  const colors = new Float32Array(sampleCount * 3);
  const cdf = new Float64Array(probabilities.length);
  const rng = createRng(hashSeed(seed));
  const cdfOffset = rng();
  const cdfJitter = 0.37 / Math.max(1, sampleCount);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  let total = 0;
  for (let i = 0; i < probabilities.length; i++) {
    total += probabilities[i];
    cdf[i] = total;
  }

  for (let i = 0; i < sampleCount; i++) {
    const quantile = (cdfOffset + (i + 0.5) / sampleCount + (rng() - 0.5) * cdfJitter) % 1;
    const r = quantile * total;
    let lo = 0;
    let hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (r <= cdf[mid]) hi = mid;
      else lo = mid + 1;
    }
    const source = lo * 3;
    const target = i * 3;
    const z = 1 - 2 * rng();
    const ring = Math.sqrt(Math.max(0, 1 - z * z));
    const angle = i * goldenAngle + rng() * Math.PI * 2;
    const jitterRadius = Math.cbrt(rng()) * spacingBohr * jitterScale;
    points[target] = positions[source] + Math.cos(angle) * ring * jitterRadius;
    points[target + 1] = positions[source + 1] + Math.sin(angle) * ring * jitterRadius;
    points[target + 2] = positions[source + 2] + z * jitterRadius;
    const pointRadius = Math.sqrt(points[target] ** 2 + points[target + 1] ** 2 + points[target + 2] ** 2);
    const shade = clamp(1 - pointRadius / 48, 0.28, 1);
    colors[target] = shade;
    colors[target + 1] = shade;
    colors[target + 2] = shade;
  }
  return { points, colors };
};

export const orbitalRunId = ({ element, n, l, m, gridSize, options }) => (
  `${element.symbol}:${n}:${l}:${m}:${gridSize}:${Boolean(options.screeningExchange)}:${Boolean(options.relativisticSpinOrbit)}:${Boolean(options.correlationMixing)}`
);

import { getElementBySymbol } from '../../../schrodinger/src/data/elements.js';
import {
  estimateOrbitalExtentBohr,
  hydrogenicEnergyEv
} from '../../../schrodinger/src/quantum/references.js';
import {
  correctedRadialCharge,
  effectiveNuclearCharge
} from '../../../schrodinger/src/quantum/orbitals.js';
import {
  RADIAL_WEBGPU_EIGENSOLVER_SCHEMA,
  solveRadialSchrodingerEigenstateGpu
} from '../../../schrodinger/src/quantum/webgpuWaveSolver.js';
import {
  buildElectronConfiguration,
  QUANTUM_ORBITAL_FINITE_GRID_SCHEMA
} from '../simulation/quantumOrbitalClosure.js';

export const QUANTUM_ORBITAL_GRID_RESULT_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.result.v0';
export const QUANTUM_ORBITAL_GRID_DELTA_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.delta.v0';
export const QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.webgpu.v0';
export const QUANTUM_ORBITAL_GRID_PARITY_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.parity.v0';
export const QUANTUM_ORBITAL_GRID_EIGEN_RESIDUAL_WEBGPU_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.eigen-residual-webgpu.v0';
export const QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.wavefunction-evolution-webgpu.v0';
export const QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.hamiltonian-components-webgpu.v0';
export const QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0';
export const QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0';
export const QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA = 'peercompute.multiscale.quantum-orbital-grid.statistical-bridge-webgpu.v0';
export const QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA = RADIAL_WEBGPU_EIGENSOLVER_SCHEMA;
export const QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY = 'webgpu-only-no-cpu-fallback';
export const QUANTUM_ORBITAL_GRID_MAX_SAMPLES = 32768;

const DEFAULT_STATE_KEY = 'orbital:quantum-orbital-grid:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const WORKGROUP_SIZE = 64;
const WEBGPU_EVALUATION_BACKEND = 'webgpu-orbital-grid-probability-evaluation';
const WEBGPU_EIGEN_RESIDUAL_BACKEND = 'webgpu-orbital-grid-eigen-residual-reduction';
const WEBGPU_WAVEFUNCTION_EVOLUTION_BACKEND = 'webgpu-orbital-grid-wavefunction-evolution-reduction';
const HARTREE_EV = 27.211386245988;
const BOLTZMANN_EV_PER_K = 8.617333262145e-5;
const ATOMIC_ELECTRIC_FIELD_VM = 5.14220674763e11;
const MAX_INTERACTIVE_ELECTRIC_FIELD_AU = 0.05;
const ATOMIC_MAGNETIC_FIELD_T = 2.35051756758e5;
const MAX_INTERACTIVE_MAGNETIC_FIELD_AU = 0.05;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const ORBITAL_EVALUATION_REDUCTION_SHADER = `
const PI: f32 = 3.141592653589793;
const SQRT2: f32 = 1.4142135623730951;
const FINE_STRUCTURE_ALPHA: f32 = 0.0072973525693;

@group(0) @binding(0) var<storage, read> params: array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<vec4f>;

var<workgroup> localPartial: array<vec4f, ${WORKGROUP_SIZE}>;

fn paramU(index: u32) -> u32 {
  return u32(max(0.0, params[index]) + 0.5);
}

fn paramI(index: u32) -> i32 {
  let value = params[index];
  if (value < 0.0) {
    return -i32(abs(value) + 0.5);
  }
  return i32(value + 0.5);
}

fn factorialF(n: u32) -> f32 {
  var out = 1.0;
  var i = 2u;
  loop {
    if (i > n) {
      break;
    }
    out = out * f32(i);
    i = i + 1u;
  }
  return out;
}

fn binomialF(n: u32, k: u32) -> f32 {
  if (k > n) {
    return 0.0;
  }
  return factorialF(n) / max(1.0, factorialF(k) * factorialF(n - k));
}

fn associatedLaguerre(p: u32, k: u32, x: f32) -> f32 {
  var sum = 0.0;
  var i = 0u;
  loop {
    if (i > p) {
      break;
    }
    var sign = 1.0;
    if ((i % 2u) == 1u) {
      sign = -1.0;
    }
    sum = sum + sign * binomialF(p + k, p - i) * pow(x, f32(i)) / max(1.0, factorialF(i));
    i = i + 1u;
  }
  return sum;
}

fn associatedLegendre(l: u32, m: u32, x: f32) -> f32 {
  let absX = clamp(x, -1.0, 1.0);
  var pmm = 1.0;
  if (m > 0u) {
    let root = sqrt(max(0.0, (1.0 - absX) * (1.0 + absX)));
    var fact = 1.0;
    var i = 1u;
    loop {
      if (i > m) {
        break;
      }
      pmm = pmm * (-fact * root);
      fact = fact + 2.0;
      i = i + 1u;
    }
  }
  if (l == m) {
    return pmm;
  }

  var pmmp1 = absX * f32(2u * m + 1u) * pmm;
  if (l == m + 1u) {
    return pmmp1;
  }

  var pll = 0.0;
  var ll = m + 2u;
  loop {
    if (ll > l) {
      break;
    }
    pll = (f32(2u * ll - 1u) * absX * pmmp1 - f32(ll + m - 1u) * pmm) / max(1.0, f32(ll - m));
    pmm = pmmp1;
    pmmp1 = pll;
    ll = ll + 1u;
  }
  return pll;
}

fn absI(value: i32) -> u32 {
  if (value < 0) {
    return u32(-value);
  }
  return u32(value);
}

fn clampM(value: i32, l: u32) -> i32 {
  let limit = i32(l);
  if (value < -limit) {
    return -limit;
  }
  if (value > limit) {
    return limit;
  }
  return value;
}

fn radialComponent(n: u32, l: u32, rBohr: f32, zEff: f32) -> f32 {
  let safeR = max(rBohr, 1.0e-6);
  let rho = (2.0 * zEff * safeR) / max(1.0, f32(n));
  let radialOrder = n - l - 1u;
  let prefactor = sqrt(
    max(0.0, pow((2.0 * zEff) / max(1.0, f32(n)), 3.0)
      * (factorialF(radialOrder) / max(1.0, 2.0 * f32(n) * factorialF(n + l))))
  );
  return prefactor * exp(-rho / 2.0) * pow(rho, f32(l)) * associatedLaguerre(radialOrder, 2u * l + 1u, rho);
}

fn realSphericalHarmonicSq(l: u32, mSigned: i32, x: f32, y: f32, z: f32, r: f32) -> f32 {
  let absM = absI(mSigned);
  let cosTheta = select(1.0, clamp(z / max(r, 1.0e-12), -1.0, 1.0), r > 1.0e-12);
  let plm = associatedLegendre(l, absM, cosTheta);
  let norm = sqrt(
    max(0.0, ((2.0 * f32(l) + 1.0) / (4.0 * PI))
      * (factorialF(l - absM) / max(1.0, factorialF(l + absM))))
  );
  var ylm = norm * plm;
  if (mSigned > 0) {
    ylm = SQRT2 * norm * plm * cos(f32(absM) * atan2(y, x));
  } else if (mSigned < 0) {
    ylm = SQRT2 * norm * plm * sin(f32(absM) * atan2(y, x));
  }
  return max(0.0, ylm * ylm);
}

fn orbitalBasisProbability(
  x: f32,
  y: f32,
  z: f32,
  n: u32,
  l: u32,
  mSigned: i32,
  radialZ: f32,
  zEff: f32,
  spinOrbitEnabled: bool
) -> f32 {
  let r = sqrt(x * x + y * y + z * z);
  let radial = radialComponent(n, l, r, radialZ);
  let ylmSq = realSphericalHarmonicSq(l, mSigned, x, y, z, r);
  var spinFactor = 1.0;
  if (spinOrbitEnabled && l > 0u && mSigned != 0) {
    let cosTheta = select(1.0, clamp(z / max(r, 1.0e-12), -1.0, 1.0), r > 1.0e-12);
    let beta = pow(FINE_STRUCTURE_ALPHA * zEff, 2.0);
    let coupling = (0.24 * beta * f32(l)) / max(1.0, f32(n * n));
    spinFactor = clamp(1.0 + coupling * cosTheta * (f32(mSigned) / max(1.0, f32(l))), 0.5, 1.5);
  }
  return max(0.0, radial * radial * ylmSq * spinFactor);
}

fn sameBasis(aN: u32, aL: u32, bN: u32, bL: u32) -> bool {
  return aN == bN && aL == bL;
}

fn addCorrelationCandidate(
  current: vec2f,
  x: f32,
  y: f32,
  z: f32,
  n: u32,
  l: u32,
  mSigned: i32,
  weight: f32,
  radialZ: f32,
  seenAN: u32,
  seenAL: u32,
  seenBN: u32,
  seenBL: u32,
  hasSeenB: bool
) -> vec2f {
  if (l >= n || sameBasis(n, l, seenAN, seenAL) || (hasSeenB && sameBasis(n, l, seenBN, seenBL))) {
    return current;
  }
  let termM = clampM(mSigned, l);
  let probability = orbitalBasisProbability(x, y, z, n, l, termM, radialZ, radialZ, false);
  return vec2f(current.x + weight * probability, current.y + weight);
}

fn orbitalProbabilityRaw(x: f32, y: f32, z: f32) -> f32 {
  let zEff = params[3];
  let radialZ = params[4];
  let n = max(1u, paramU(5u));
  let l = min(paramU(6u), max(0u, n - 1u));
  let mSigned = clampM(paramI(7u), l);
  let correlationEnabled = params[8] > 0.5 && n >= 2u;
  let spinOrbitEnabled = params[9] > 0.5;
  let baseProbability = orbitalBasisProbability(x, y, z, n, l, mSigned, radialZ, zEff, spinOrbitEnabled);
  if (!correlationEnabled) {
    return baseProbability;
  }

  let c1N = n - 1u;
  let c1L = min(l, n - 2u);
  let c2N = n;
  var c2L = 0u;
  if (l > 0u) {
    c2L = l - 1u;
  }
  let c3N = n;
  let c3L = min(n - 1u, l + 1u);
  var mixed = addCorrelationCandidate(vec2f(0.0, 0.0), x, y, z, c1N, c1L, mSigned, 0.42, radialZ, 999u, 999u, 999u, 999u, false);
  mixed = addCorrelationCandidate(mixed, x, y, z, c2N, c2L, mSigned, 0.29, radialZ, c1N, c1L, 999u, 999u, false);
  mixed = addCorrelationCandidate(mixed, x, y, z, c3N, c3L, mSigned, 0.29, radialZ, c1N, c1L, c2N, c2L, true);
  let strength = clamp(0.04 + radialZ * 0.002, 0.04, 0.18);
  let mixedProbability = select(baseProbability, mixed.x / max(1.0e-12, mixed.y), mixed.y > 0.0);
  return (1.0 - strength) * baseProbability + strength * mixedProbability;
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(workgroup_id) wid: vec3u
) {
  let index = gid.x;
  let localIndex = lid.x;
  let gridSize = max(1u, paramU(0u));
  let sampleCount = gridSize * gridSize * gridSize;
  let extent = params[1];
  let spacing = params[2];
  var sum = vec4f(0.0, 0.0, 0.0, 0.0);
  if (index < sampleCount) {
    let area = gridSize * gridSize;
    let zIndex = index / area;
    let yIndex = (index - zIndex * area) / gridSize;
    let xIndex = index % gridSize;
    let x = -extent + f32(xIndex) * spacing;
    let y = -extent + f32(yIndex) * spacing;
    let z = -extent + f32(zIndex) * spacing;
    let r = sqrt(x * x + y * y + z * z);
    let p = max(0.0, orbitalProbabilityRaw(x, y, z));
    let isBoundary = xIndex == 0u || yIndex == 0u || zIndex == 0u || xIndex == gridSize - 1u || yIndex == gridSize - 1u || zIndex == gridSize - 1u;
    sum = vec4f(p, p * r, p * r * r, select(0.0, p, isBoundary));
  }
  localPartial[localIndex] = sum;
  workgroupBarrier();

  var stride = ${WORKGROUP_SIZE / 2}u;
  loop {
    if (stride == 0u) {
      break;
    }
    if (localIndex < stride) {
      localPartial[localIndex] = localPartial[localIndex] + localPartial[localIndex + stride];
    }
    workgroupBarrier();
    stride = stride / 2u;
  }

  if (localIndex == 0u) {
    partials[wid.x] = localPartial[0];
  }
}
`;

const ORBITAL_EIGEN_RESIDUAL_SHADER = `
const PI: f32 = 3.141592653589793;
const SQRT2: f32 = 1.4142135623730951;

@group(0) @binding(0) var<storage, read> params: array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<vec4f>;

var<workgroup> localPartial: array<vec4f, ${WORKGROUP_SIZE}>;

fn paramU(index: u32) -> u32 {
  return u32(max(0.0, params[index]) + 0.5);
}

fn paramI(index: u32) -> i32 {
  let value = params[index];
  if (value < 0.0) {
    return -i32(abs(value) + 0.5);
  }
  return i32(value + 0.5);
}

fn factorialF(n: u32) -> f32 {
  var out = 1.0;
  var i = 2u;
  loop {
    if (i > n) {
      break;
    }
    out = out * f32(i);
    i = i + 1u;
  }
  return out;
}

fn binomialF(n: u32, k: u32) -> f32 {
  if (k > n) {
    return 0.0;
  }
  return factorialF(n) / max(1.0, factorialF(k) * factorialF(n - k));
}

fn associatedLaguerre(p: u32, k: u32, x: f32) -> f32 {
  var sum = 0.0;
  var i = 0u;
  loop {
    if (i > p) {
      break;
    }
    var sign = 1.0;
    if ((i % 2u) == 1u) {
      sign = -1.0;
    }
    sum = sum + sign * binomialF(p + k, p - i) * pow(x, f32(i)) / max(1.0, factorialF(i));
    i = i + 1u;
  }
  return sum;
}

fn associatedLegendre(l: u32, m: u32, x: f32) -> f32 {
  let absX = clamp(x, -1.0, 1.0);
  var pmm = 1.0;
  if (m > 0u) {
    let root = sqrt(max(0.0, (1.0 - absX) * (1.0 + absX)));
    var fact = 1.0;
    var i = 1u;
    loop {
      if (i > m) {
        break;
      }
      pmm = pmm * (-fact * root);
      fact = fact + 2.0;
      i = i + 1u;
    }
  }
  if (l == m) {
    return pmm;
  }

  var pmmp1 = absX * f32(2u * m + 1u) * pmm;
  if (l == m + 1u) {
    return pmmp1;
  }

  var pll = 0.0;
  var ll = m + 2u;
  loop {
    if (ll > l) {
      break;
    }
    pll = (f32(2u * ll - 1u) * absX * pmmp1 - f32(ll + m - 1u) * pmm) / max(1.0, f32(ll - m));
    pmm = pmmp1;
    pmmp1 = pll;
    ll = ll + 1u;
  }
  return pll;
}

fn absI(value: i32) -> u32 {
  if (value < 0) {
    return u32(-value);
  }
  return u32(value);
}

fn clampM(value: i32, l: u32) -> i32 {
  let limit = i32(l);
  if (value < -limit) {
    return -limit;
  }
  if (value > limit) {
    return limit;
  }
  return value;
}

fn radialComponent(n: u32, l: u32, rBohr: f32, radialZ: f32) -> f32 {
  let safeR = max(rBohr, 1.0e-6);
  let rho = (2.0 * radialZ * safeR) / max(1.0, f32(n));
  let radialOrder = n - l - 1u;
  let prefactor = sqrt(
    max(0.0, pow((2.0 * radialZ) / max(1.0, f32(n)), 3.0)
      * (factorialF(radialOrder) / max(1.0, 2.0 * f32(n) * factorialF(n + l))))
  );
  return prefactor * exp(-rho / 2.0) * pow(rho, f32(l)) * associatedLaguerre(radialOrder, 2u * l + 1u, rho);
}

fn realSphericalHarmonic(l: u32, mSigned: i32, x: f32, y: f32, z: f32, r: f32) -> f32 {
  let absM = absI(mSigned);
  let cosTheta = select(1.0, clamp(z / max(r, 1.0e-12), -1.0, 1.0), r > 1.0e-12);
  let plm = associatedLegendre(l, absM, cosTheta);
  let norm = sqrt(
    max(0.0, ((2.0 * f32(l) + 1.0) / (4.0 * PI))
      * (factorialF(l - absM) / max(1.0, factorialF(l + absM))))
  );
  if (mSigned > 0) {
    return SQRT2 * norm * plm * cos(f32(absM) * atan2(y, x));
  }
  if (mSigned < 0) {
    return SQRT2 * norm * plm * sin(f32(absM) * atan2(y, x));
  }
  return norm * plm;
}

fn wavefunctionAt(x: f32, y: f32, z: f32, n: u32, l: u32, mSigned: i32, radialZ: f32) -> f32 {
  let r = sqrt(x * x + y * y + z * z);
  return radialComponent(n, l, r, radialZ) * realSphericalHarmonic(l, mSigned, x, y, z, r);
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(workgroup_id) wid: vec3u
) {
  let index = gid.x;
  let localIndex = lid.x;
  let gridSize = max(1u, paramU(0u));
  let sampleCount = gridSize * gridSize * gridSize;
  let extent = params[1];
  let spacing = max(params[2], 1.0e-6);
  let radialZ = max(params[4], 1.0e-6);
  let n = max(1u, paramU(5u));
  let l = min(paramU(6u), max(0u, n - 1u));
  let mSigned = clampM(paramI(7u), l);
  let singularSkipRadius = spacing * 0.75;
  var sum = vec4f(0.0, 0.0, 0.0, 0.0);
  if (index < sampleCount) {
    let area = gridSize * gridSize;
    let zIndex = index / area;
    let yIndex = (index - zIndex * area) / gridSize;
    let xIndex = index % gridSize;
    if (xIndex > 0u && yIndex > 0u && zIndex > 0u && xIndex < gridSize - 1u && yIndex < gridSize - 1u && zIndex < gridSize - 1u) {
      let x = -extent + f32(xIndex) * spacing;
      let y = -extent + f32(yIndex) * spacing;
      let z = -extent + f32(zIndex) * spacing;
      let radius = sqrt(x * x + y * y + z * z);
      if (radius > singularSkipRadius) {
        let center = wavefunctionAt(x, y, z, n, l, mSigned, radialZ);
        let laplacian = (
          wavefunctionAt(x + spacing, y, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x - spacing, y, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y + spacing, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y - spacing, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y, z + spacing, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y, z - spacing, n, l, mSigned, radialZ)
          - 6.0 * center
        ) / (spacing * spacing);
        let energyHartree = -0.5 * radialZ * radialZ / max(1.0, f32(n * n));
        let hPsi = -0.5 * laplacian - (radialZ / max(radius, singularSkipRadius)) * center;
        let ePsi = energyHartree * center;
        let residual = hPsi - ePsi;
        let weight = center * center;
        sum = vec4f(residual * residual, ePsi * ePsi, abs(residual) * weight, weight);
      }
    }
  }
  localPartial[localIndex] = sum;
  workgroupBarrier();

  var stride = ${WORKGROUP_SIZE / 2}u;
  loop {
    if (stride == 0u) {
      break;
    }
    if (localIndex < stride) {
      localPartial[localIndex] = localPartial[localIndex] + localPartial[localIndex + stride];
    }
    workgroupBarrier();
    stride = stride / 2u;
  }

  if (localIndex == 0u) {
    partials[wid.x] = localPartial[0];
  }
}
`;

const ORBITAL_WAVEFUNCTION_EVOLUTION_SHADER = `
const PI: f32 = 3.141592653589793;
const SQRT2: f32 = 1.4142135623730951;

@group(0) @binding(0) var<storage, read> params: array<f32>;
@group(0) @binding(1) var<storage, read_write> sampleTerms: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> partials: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> fieldPartials: array<vec4f>;

var<workgroup> localPartial: array<vec4f, ${WORKGROUP_SIZE}>;
var<workgroup> localFieldPartial: array<vec4f, ${WORKGROUP_SIZE}>;

fn paramU(index: u32) -> u32 {
  return u32(max(0.0, params[index]) + 0.5);
}

fn paramI(index: u32) -> i32 {
  let value = params[index];
  if (value < 0.0) {
    return -i32(abs(value) + 0.5);
  }
  return i32(value + 0.5);
}

fn factorialF(n: u32) -> f32 {
  var out = 1.0;
  var i = 2u;
  loop {
    if (i > n) {
      break;
    }
    out = out * f32(i);
    i = i + 1u;
  }
  return out;
}

fn binomialF(n: u32, k: u32) -> f32 {
  if (k > n) {
    return 0.0;
  }
  return factorialF(n) / max(1.0, factorialF(k) * factorialF(n - k));
}

fn associatedLaguerre(p: u32, k: u32, x: f32) -> f32 {
  var sum = 0.0;
  var i = 0u;
  loop {
    if (i > p) {
      break;
    }
    var sign = 1.0;
    if ((i % 2u) == 1u) {
      sign = -1.0;
    }
    sum = sum + sign * binomialF(p + k, p - i) * pow(x, f32(i)) / max(1.0, factorialF(i));
    i = i + 1u;
  }
  return sum;
}

fn associatedLegendre(l: u32, m: u32, x: f32) -> f32 {
  let absX = clamp(x, -1.0, 1.0);
  var pmm = 1.0;
  if (m > 0u) {
    let root = sqrt(max(0.0, (1.0 - absX) * (1.0 + absX)));
    var fact = 1.0;
    var i = 1u;
    loop {
      if (i > m) {
        break;
      }
      pmm = pmm * (-fact * root);
      fact = fact + 2.0;
      i = i + 1u;
    }
  }
  if (l == m) {
    return pmm;
  }

  var pmmp1 = absX * f32(2u * m + 1u) * pmm;
  if (l == m + 1u) {
    return pmmp1;
  }

  var pll = 0.0;
  var ll = m + 2u;
  loop {
    if (ll > l) {
      break;
    }
    pll = (f32(2u * ll - 1u) * absX * pmmp1 - f32(ll + m - 1u) * pmm) / max(1.0, f32(ll - m));
    pmm = pmmp1;
    pmmp1 = pll;
    ll = ll + 1u;
  }
  return pll;
}

fn absI(value: i32) -> u32 {
  if (value < 0) {
    return u32(-value);
  }
  return u32(value);
}

fn clampM(value: i32, l: u32) -> i32 {
  let limit = i32(l);
  if (value < -limit) {
    return -limit;
  }
  if (value > limit) {
    return limit;
  }
  return value;
}

fn radialComponent(n: u32, l: u32, rBohr: f32, radialZ: f32) -> f32 {
  let safeR = max(rBohr, 1.0e-6);
  let rho = (2.0 * radialZ * safeR) / max(1.0, f32(n));
  let radialOrder = n - l - 1u;
  let prefactor = sqrt(
    max(0.0, pow((2.0 * radialZ) / max(1.0, f32(n)), 3.0)
      * (factorialF(radialOrder) / max(1.0, 2.0 * f32(n) * factorialF(n + l))))
  );
  return prefactor * exp(-rho / 2.0) * pow(rho, f32(l)) * associatedLaguerre(radialOrder, 2u * l + 1u, rho);
}

fn realSphericalHarmonic(l: u32, mSigned: i32, x: f32, y: f32, z: f32, r: f32) -> f32 {
  let absM = absI(mSigned);
  let cosTheta = select(1.0, clamp(z / max(r, 1.0e-12), -1.0, 1.0), r > 1.0e-12);
  let plm = associatedLegendre(l, absM, cosTheta);
  let norm = sqrt(
    max(0.0, ((2.0 * f32(l) + 1.0) / (4.0 * PI))
      * (factorialF(l - absM) / max(1.0, factorialF(l + absM))))
  );
  if (mSigned > 0) {
    return SQRT2 * norm * plm * cos(f32(absM) * atan2(y, x));
  }
  if (mSigned < 0) {
    return SQRT2 * norm * plm * sin(f32(absM) * atan2(y, x));
  }
  return norm * plm;
}

fn wavefunctionAt(x: f32, y: f32, z: f32, n: u32, l: u32, mSigned: i32, radialZ: f32) -> f32 {
  let r = sqrt(x * x + y * y + z * z);
  return radialComponent(n, l, r, radialZ) * realSphericalHarmonic(l, mSigned, x, y, z, r);
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(workgroup_id) wid: vec3u
) {
  let index = gid.x;
  let localIndex = lid.x;
  let gridSize = max(1u, paramU(0u));
  let sampleCount = gridSize * gridSize * gridSize;
  let extent = params[1];
  let spacing = max(params[2], 1.0e-6);
  let radialZ = max(params[4], 1.0e-6);
  let n = max(1u, paramU(5u));
  let l = min(paramU(6u), max(0u, n - 1u));
  let mSigned = clampM(paramI(7u), l);
  let dtAtomicUnits = clamp(params[11], 1.0e-5, 0.02);
  let electricFieldAtomicUnits = clamp(params[12], -0.05, 0.05);
  let magneticFieldAtomicUnits = clamp(params[14], -0.05, 0.05);
  let zeemanProjection = clamp(params[16], -8.0, 8.0);
  let zeemanShiftHartree = 0.5 * magneticFieldAtomicUnits * zeemanProjection;
  let singularSkipRadius = spacing * 0.75;
  var sum = vec4f(0.0, 0.0, 0.0, 0.0);
  var fieldSum = vec4f(0.0, 0.0, 0.0, 0.0);
  if (index < sampleCount) {
    sampleTerms[index] = vec4f(0.0, 0.0, 0.0, 0.0);
    let area = gridSize * gridSize;
    let zIndex = index / area;
    let yIndex = (index - zIndex * area) / gridSize;
    let xIndex = index % gridSize;
    if (xIndex > 0u && yIndex > 0u && zIndex > 0u && xIndex < gridSize - 1u && yIndex < gridSize - 1u && zIndex < gridSize - 1u) {
      let x = -extent + f32(xIndex) * spacing;
      let y = -extent + f32(yIndex) * spacing;
      let z = -extent + f32(zIndex) * spacing;
      let radius = sqrt(x * x + y * y + z * z);
      if (radius > singularSkipRadius) {
        let center = wavefunctionAt(x, y, z, n, l, mSigned, radialZ);
        let laplacian = (
          wavefunctionAt(x + spacing, y, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x - spacing, y, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y + spacing, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y - spacing, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y, z + spacing, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y, z - spacing, n, l, mSigned, radialZ)
          - 6.0 * center
        ) / (spacing * spacing);
        let kineticPsi = -0.5 * laplacian;
        let potentialPsi = -(radialZ / max(radius, singularSkipRadius)) * center;
        let fieldPotentialPsi = electricFieldAtomicUnits * z * center;
        let magneticPotentialPsi = zeemanShiftHartree * center;
        let hPsi = kineticPsi + potentialPsi + fieldPotentialPsi + magneticPotentialPsi;
        let initialDensity = center * center;
        let evolvedDensity = initialDensity + dtAtomicUnits * dtAtomicUnits * hPsi * hPsi;
        sampleTerms[index] = vec4f(initialDensity, evolvedDensity, center * kineticPsi, center * potentialPsi);
        sum = vec4f(initialDensity, evolvedDensity, center * hPsi, hPsi * hPsi);
        fieldSum = vec4f(
          z * initialDensity,
          center * fieldPotentialPsi,
          z * z * initialDensity,
          abs(center * fieldPotentialPsi)
        );
      }
    }
  }
  localPartial[localIndex] = sum;
  localFieldPartial[localIndex] = fieldSum;
  workgroupBarrier();

  var stride = ${WORKGROUP_SIZE / 2}u;
  loop {
    if (stride == 0u) {
      break;
    }
    if (localIndex < stride) {
      localPartial[localIndex] = localPartial[localIndex] + localPartial[localIndex + stride];
      localFieldPartial[localIndex] = localFieldPartial[localIndex] + localFieldPartial[localIndex + stride];
    }
    workgroupBarrier();
    stride = stride / 2u;
  }

  if (localIndex == 0u) {
    partials[wid.x] = localPartial[0];
    fieldPartials[wid.x] = localFieldPartial[0];
  }
}
`;

function getExecutionContext() {
  const scope = globalThis.self;
  const workerScope = globalThis.WorkerGlobalScope;
  if (scope && workerScope && scope instanceof workerScope) {
    return 'dedicated-worker';
  }
  return 'inline';
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeInteger(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeElectricFieldVm(input = {}) {
  const environment = input.environment && typeof input.environment === 'object' ? input.environment : {};
  return clamp(
    finiteNumber(
      input.options?.electricFieldVm
        ?? input.electricFieldVm
        ?? input.electricFieldStrengthVm
        ?? input.electricFieldVpm
        ?? environment.electricFieldVm
        ?? environment.electricFieldStrengthVm
        ?? environment.electricFieldVpm,
      0
    ),
    -ATOMIC_ELECTRIC_FIELD_VM * MAX_INTERACTIVE_ELECTRIC_FIELD_AU,
    ATOMIC_ELECTRIC_FIELD_VM * MAX_INTERACTIVE_ELECTRIC_FIELD_AU
  );
}

function normalizeMagneticFieldT(input = {}) {
  const environment = input.environment && typeof input.environment === 'object' ? input.environment : {};
  return clamp(
    finiteNumber(
      input.options?.magneticFieldT
        ?? input.magneticFieldT
        ?? input.magneticFluxDensityT
        ?? environment.magneticFieldT
        ?? environment.magneticFluxDensityT,
      0
    ),
    -ATOMIC_MAGNETIC_FIELD_T * MAX_INTERACTIVE_MAGNETIC_FIELD_AU,
    ATOMIC_MAGNETIC_FIELD_T * MAX_INTERACTIVE_MAGNETIC_FIELD_AU
  );
}

function orbitalCapacity(l) {
  return 2 * (2 * l + 1);
}

function estimateUnpairedElectronCount(shells = []) {
  let unpaired = 0;
  for (const shell of shells) {
    const orbitalCount = 2 * shell.l + 1;
    const occupancy = clamp(shell.occupancy, 0, orbitalCapacity(shell.l));
    unpaired += occupancy <= orbitalCount
      ? occupancy
      : Math.max(0, orbitalCapacity(shell.l) - occupancy);
  }
  return unpaired;
}

function estimateSpinProjection(element) {
  const unpaired = estimateUnpairedElectronCount(buildElectronConfiguration(element.Z));
  return unpaired > 0 ? 0.5 : 0;
}

function normalizeOrbitalInput(input = {}) {
  const element = getElementBySymbol(input.elementSymbol || input.element?.symbol || 'O');
  const environment = input.environment && typeof input.environment === 'object' ? input.environment : {};
  const principalN = normalizeInteger(input.principalN ?? input.n, 2, 1, 7);
  const angularL = normalizeInteger(input.angularL ?? input.l, 1, 0, Math.max(0, principalN - 1));
  const magneticM = normalizeInteger(input.magneticM ?? input.m, 0, -angularL, angularL);
  const gridSize = normalizeInteger(input.finiteGridSize ?? input.gridSize, 18, 8, 32);
  const electricFieldVm = normalizeElectricFieldVm(input);
  const magneticFieldT = normalizeMagneticFieldT(input);
  const spinProjection = clamp(
    finiteNumber(input.options?.spinProjection ?? input.spinProjection, estimateSpinProjection(element)),
    -0.5,
    0.5
  );
  const zeemanProjection = clamp(
    finiteNumber(input.options?.zeemanProjection ?? input.zeemanProjection, magneticM + 2 * spinProjection),
    -8,
    8
  );
  const options = {
    screeningExchange: input.options?.screeningExchange ?? input.screeningExchange ?? true,
    relativisticSpinOrbit: input.options?.relativisticSpinOrbit ?? input.relativisticSpinOrbit ?? element.Z >= 30,
    correlationMixing: input.options?.correlationMixing ?? input.correlationMixing ?? element.Z >= 6,
    wavefunctionDtAtomicUnits: clamp(
      finiteNumber(
        input.options?.wavefunctionDtAtomicUnits ?? input.wavefunctionDtAtomicUnits ?? input.dtAtomicUnits,
        0.002
      ),
      1e-5,
      0.02
    ),
    electricFieldVm,
    electricFieldAtomicUnits: clamp(
      electricFieldVm / ATOMIC_ELECTRIC_FIELD_VM,
      -MAX_INTERACTIVE_ELECTRIC_FIELD_AU,
      MAX_INTERACTIVE_ELECTRIC_FIELD_AU
    ),
    magneticFieldT,
    magneticFieldAtomicUnits: clamp(
      magneticFieldT / ATOMIC_MAGNETIC_FIELD_T,
      -MAX_INTERACTIVE_MAGNETIC_FIELD_AU,
      MAX_INTERACTIVE_MAGNETIC_FIELD_AU
    ),
    ambientTemperatureK: clamp(
      finiteNumber(input.options?.ambientTemperatureK ?? input.ambientTemperatureK ?? environment.ambientTemperatureK ?? environment.temperatureK, 298.15),
      0.001,
      1e9
    ),
    ambientPressurePa: clamp(
      finiteNumber(input.options?.ambientPressurePa ?? input.ambientPressurePa ?? environment.ambientPressurePa ?? environment.pressurePa, 101325),
      1e-9,
      1e18
    ),
    spinProjection,
    zeemanProjection
  };
  const inputKey = [
    element.symbol,
    principalN,
    angularL,
    magneticM,
    gridSize,
    Boolean(options.screeningExchange),
    Boolean(options.relativisticSpinOrbit),
    Boolean(options.correlationMixing),
    options.wavefunctionDtAtomicUnits.toExponential(4),
    options.electricFieldVm.toExponential(4),
    options.magneticFieldT.toExponential(4),
    options.zeemanProjection.toFixed(3),
    options.ambientTemperatureK.toExponential(4),
    options.ambientPressurePa.toExponential(4)
  ].join(':');
  return {
    element,
    elementSymbol: element.symbol,
    principalN,
    angularL,
    magneticM,
    gridSize,
    options,
    inputKey
  };
}

function createOrbitalGridMetadata(normalized) {
  const zEff = effectiveNuclearCharge(
    normalized.element,
    normalized.principalN,
    normalized.angularL,
    normalized.options
  );
  const extentBohr = estimateOrbitalExtentBohr({ n: normalized.principalN, zEff });
  const spacingBohr = (extentBohr * 2) / Math.max(1, normalized.gridSize - 1);
  return {
    extentBohr,
    spacingBohr,
    gridSize: normalized.gridSize,
    zEff,
    energyEv: hydrogenicEnergyEv({ n: normalized.principalN, zEff }),
    normalization: null,
    maxProbability: null,
    maxRadiusBohr: null,
    boundaryMass: null
  };
}

function momentsFromRawEvaluationPartials(partials, sampleCount = 0) {
  let rawProbabilityMass = 0;
  let rawMeanRadiusBohr = 0;
  let rawMeanRadiusSquaredBohr2 = 0;
  let rawBoundaryMass = 0;
  for (let i = 0; i < partials.length; i += 4) {
    rawProbabilityMass += Number(partials[i] || 0);
    rawMeanRadiusBohr += Number(partials[i + 1] || 0);
    rawMeanRadiusSquaredBohr2 += Number(partials[i + 2] || 0);
    rawBoundaryMass += Number(partials[i + 3] || 0);
  }
  const safeMass = rawProbabilityMass > 0 ? rawProbabilityMass : 1;
  const probabilityMass = rawProbabilityMass > 0 ? 1 : 0;
  return {
    probabilityMass,
    meanRadiusBohr: rawMeanRadiusBohr / safeMass,
    rmsRadiusBohr: Math.sqrt(Math.max(0, rawMeanRadiusSquaredBohr2 / safeMass)),
    normalizationError: Math.abs(1 - probabilityMass),
    boundaryMass: rawProbabilityMass > 0 ? rawBoundaryMass / safeMass : 0,
    countedSamples: normalizeInteger(sampleCount, 0, 0, Number.MAX_SAFE_INTEGER),
    rawProbabilityMass,
    rawBoundaryMass,
    rawNormalizationMode: 'webgpu-self-normalized-density-moments'
  };
}

function createEigenResidualWebGpuReport(partials, grid, normalized) {
  let residualSquared = 0;
  let referenceSquared = 0;
  let weightedAbsResidual = 0;
  let probabilityWeight = 0;
  for (let i = 0; i < partials.length; i += 4) {
    residualSquared += Number(partials[i] || 0);
    referenceSquared += Number(partials[i + 1] || 0);
    weightedAbsResidual += Number(partials[i + 2] || 0);
    probabilityWeight += Number(partials[i + 3] || 0);
  }
  const safeReference = referenceSquared > 1e-18 ? referenceSquared : 1;
  const safeWeight = probabilityWeight > 1e-18 ? probabilityWeight : 1;
  const relativeL2 = Math.sqrt(Math.max(0, residualSquared) / safeReference);
  const weightedMeanResidualHartree = weightedAbsResidual / safeWeight;
  return {
    schema: QUANTUM_ORBITAL_GRID_EIGEN_RESIDUAL_WEBGPU_SCHEMA,
    backend: WEBGPU_EIGEN_RESIDUAL_BACKEND,
    modelId: 'webgpu-screened-hydrogenic-central-difference-eigencheck-v0',
    mode: 'wgsl-atomic-units-central-difference-reduction',
    status: relativeL2 < 0.08 ? 'finite-grid-pass' : relativeL2 < 0.25 ? 'finite-grid-watch' : 'finite-grid-divergent',
    relativeL2,
    weightedMeanResidualHartree,
    weightedMeanResidualEv: weightedMeanResidualHartree * HARTREE_EV,
    referenceNorm: Math.sqrt(Math.max(0, referenceSquared)),
    residualNorm: Math.sqrt(Math.max(0, residualSquared)),
    probabilityWeight,
    gridSize: normalized.gridSize,
    sampleCount: normalized.gridSize ** 3,
    spacingBohr: grid.spacingBohr,
    extentBohr: grid.extentBohr
  };
}

function countWavefunctionEvolutionSamples(grid, normalized) {
  const gridSize = normalized.gridSize;
  const spacing = Math.max(finiteNumber(grid.spacingBohr), 1e-6);
  const extent = finiteNumber(grid.extentBohr);
  const singularSkipRadius = spacing * 0.75;
  let interiorSampleCount = 0;
  let singularSkippedCount = 0;
  for (let zIndex = 1; zIndex < gridSize - 1; zIndex += 1) {
    const z = -extent + zIndex * spacing;
    for (let yIndex = 1; yIndex < gridSize - 1; yIndex += 1) {
      const y = -extent + yIndex * spacing;
      for (let xIndex = 1; xIndex < gridSize - 1; xIndex += 1) {
        const x = -extent + xIndex * spacing;
        const radius = Math.sqrt(x * x + y * y + z * z);
        if (radius <= singularSkipRadius) {
          singularSkippedCount += 1;
          continue;
        }
        interiorSampleCount += 1;
      }
    }
  }
  return {
    interiorSampleCount,
    singularSkippedCount,
    boundarySkippedCount: Math.max(0, gridSize ** 3 - interiorSampleCount - singularSkippedCount)
  };
}

function createWavefunctionEvolutionWebGpuReport(partials, sampleTerms, fieldPartials, grid, normalized) {
  let normBefore = 0;
  let normAfterEuler = 0;
  let energyNumerator = 0;
  let hPsiSquared = 0;
  for (let i = 0; i < partials.length; i += 4) {
    normBefore += Number(partials[i] || 0);
    normAfterEuler += Number(partials[i + 1] || 0);
    energyNumerator += Number(partials[i + 2] || 0);
    hPsiSquared += Number(partials[i + 3] || 0);
  }
  let dipoleZNumerator = 0;
  let fieldEnergyNumerator = 0;
  let zSquaredNumerator = 0;
  let absFieldEnergyNumerator = 0;
  for (let i = 0; i < fieldPartials.length; i += 4) {
    dipoleZNumerator += Number(fieldPartials[i] || 0);
    fieldEnergyNumerator += Number(fieldPartials[i + 1] || 0);
    zSquaredNumerator += Number(fieldPartials[i + 2] || 0);
    absFieldEnergyNumerator += Number(fieldPartials[i + 3] || 0);
  }
  const safeNormBefore = normBefore > 1e-18 ? normBefore : 1;
  const safeNormAfter = normAfterEuler > 1e-18 ? normAfterEuler : 1;
  const renormalizationScale = Math.sqrt(safeNormBefore / safeNormAfter);
  let densityDriftL1 = 0;
  let maxDensityDelta = 0;
  let kineticNumerator = 0;
  let potentialNumerator = 0;
  for (let i = 0; i < sampleTerms.length; i += 4) {
    const initialDensity = Number(sampleTerms[i] || 0);
    const evolvedDensity = Number(sampleTerms[i + 1] || 0);
    kineticNumerator += Number(sampleTerms[i + 2] || 0);
    potentialNumerator += Number(sampleTerms[i + 3] || 0);
    const initial = initialDensity / safeNormBefore;
    const evolved = (evolvedDensity * renormalizationScale * renormalizationScale) / safeNormBefore;
    const delta = Math.abs(evolved - initial);
    densityDriftL1 += delta;
    maxDensityDelta = Math.max(maxDensityDelta, delta);
  }
  const energyExpectationHartree = energyNumerator / safeNormBefore;
  const kineticExpectationHartree = kineticNumerator / safeNormBefore;
  const potentialExpectationHartree = potentialNumerator / safeNormBefore;
  const fieldEnergyExpectationHartree = fieldEnergyNumerator / safeNormBefore;
  const absFieldEnergyExpectationHartree = absFieldEnergyNumerator / safeNormBefore;
  const dipoleMomentZBohrElectron = dipoleZNumerator / safeNormBefore;
  const fieldRmsExtentBohr = Math.sqrt(Math.max(0, zSquaredNumerator / safeNormBefore));
  const electricFieldAtomicUnits = clamp(
    finiteNumber(normalized.options?.electricFieldAtomicUnits, 0),
    -MAX_INTERACTIVE_ELECTRIC_FIELD_AU,
    MAX_INTERACTIVE_ELECTRIC_FIELD_AU
  );
  const electricFieldVm = finiteNumber(
    normalized.options?.electricFieldVm,
    electricFieldAtomicUnits * ATOMIC_ELECTRIC_FIELD_VM
  );
  const polarizabilityProxyBohr3 = electricFieldAtomicUnits === 0
    ? 0
    : Math.max(
      Math.abs(dipoleMomentZBohrElectron / electricFieldAtomicUnits),
      fieldRmsExtentBohr ** 3
    );
  const starkShiftProxyHartree = -0.5 * polarizabilityProxyBohr3 * electricFieldAtomicUnits * electricFieldAtomicUnits;
  const magneticFieldAtomicUnits = clamp(
    finiteNumber(normalized.options?.magneticFieldAtomicUnits, 0),
    -MAX_INTERACTIVE_MAGNETIC_FIELD_AU,
    MAX_INTERACTIVE_MAGNETIC_FIELD_AU
  );
  const magneticFieldT = finiteNumber(
    normalized.options?.magneticFieldT,
    magneticFieldAtomicUnits * ATOMIC_MAGNETIC_FIELD_T
  );
  const orbitalMagneticM = finiteNumber(normalized.magneticM, 0);
  const spinProjection = clamp(finiteNumber(normalized.options?.spinProjection, 0), -0.5, 0.5);
  const zeemanProjection = clamp(
    finiteNumber(normalized.options?.zeemanProjection, orbitalMagneticM + 2 * spinProjection),
    -8,
    8
  );
  const zeemanEnergyExpectationHartree = 0.5 * magneticFieldAtomicUnits * zeemanProjection;
  const absZeemanEnergyExpectationHartree = Math.abs(zeemanEnergyExpectationHartree);
  const magneticMomentProjectionBohrMagneton = -zeemanProjection;
  const larmorAngularFrequencyProxyAu = Math.abs(magneticFieldAtomicUnits);
  const componentEnergyExpectationHartree = kineticExpectationHartree + potentialExpectationHartree + fieldEnergyExpectationHartree + zeemanEnergyExpectationHartree;
  const hamiltonianComponentResidualHartree = componentEnergyExpectationHartree - energyExpectationHartree;
  const virialResidualHartree = 2 * kineticExpectationHartree + potentialExpectationHartree;
  const dtAtomicUnits = clamp(finiteNumber(normalized.options?.wavefunctionDtAtomicUnits, 0.002), 1e-5, 0.02);
  const phaseRotationRad = -energyExpectationHartree * dtAtomicUnits;
  const normDrift = Math.abs((normAfterEuler / safeNormBefore) - 1);
  const sampleCounts = countWavefunctionEvolutionSamples(grid, normalized);
  const hamiltonianComponents = {
    schema: QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA,
    backend: WEBGPU_WAVEFUNCTION_EVOLUTION_BACKEND,
    mode: 'wgsl-central-difference-hamiltonian-component-reduction',
    kineticExpectationHartree,
    kineticExpectationEv: kineticExpectationHartree * HARTREE_EV,
    potentialExpectationHartree,
    potentialExpectationEv: potentialExpectationHartree * HARTREE_EV,
    componentEnergyExpectationHartree,
    componentEnergyExpectationEv: componentEnergyExpectationHartree * HARTREE_EV,
    energyExpectationHartree,
    energyExpectationEv: energyExpectationHartree * HARTREE_EV,
    fieldEnergyExpectationHartree,
    fieldEnergyExpectationEv: fieldEnergyExpectationHartree * HARTREE_EV,
    absFieldEnergyExpectationHartree,
    absFieldEnergyExpectationEv: absFieldEnergyExpectationHartree * HARTREE_EV,
    electricFieldVm,
    electricFieldAtomicUnits,
    dipoleMomentZBohrElectron,
    fieldRmsExtentBohr,
    polarizabilityProxyBohr3,
    starkShiftProxyHartree,
    starkShiftProxyEv: starkShiftProxyHartree * HARTREE_EV,
    magneticFieldT,
    magneticFieldAtomicUnits,
    orbitalMagneticM,
    spinProjection,
    zeemanProjection,
    zeemanEnergyExpectationHartree,
    zeemanEnergyExpectationEv: zeemanEnergyExpectationHartree * HARTREE_EV,
    absZeemanEnergyExpectationHartree,
    absZeemanEnergyExpectationEv: absZeemanEnergyExpectationHartree * HARTREE_EV,
    magneticMomentProjectionBohrMagneton,
    larmorAngularFrequencyProxyAu,
    hamiltonianComponentResidualHartree,
    hamiltonianComponentResidualEv: hamiltonianComponentResidualHartree * HARTREE_EV,
    virialResidualHartree,
    virialResidualEv: virialResidualHartree * HARTREE_EV
  };
  const fieldResponse = {
    schema: QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA,
    backend: WEBGPU_WAVEFUNCTION_EVOLUTION_BACKEND,
    modelId: 'webgpu-screened-hydrogenic-stark-response-proxy-v0',
    mode: 'first-order-electric-field-hamiltonian-perturbation',
    status: Math.abs(electricFieldAtomicUnits) > 0 ? 'field-coupled' : 'zero-field',
    electricFieldVm,
    electricFieldAtomicUnits,
    maxInteractiveElectricFieldAtomicUnits: MAX_INTERACTIVE_ELECTRIC_FIELD_AU,
    atomicElectricFieldVm: ATOMIC_ELECTRIC_FIELD_VM,
    dipoleMomentZBohrElectron,
    fieldEnergyExpectationHartree,
    fieldEnergyExpectationEv: fieldEnergyExpectationHartree * HARTREE_EV,
    absFieldEnergyExpectationHartree,
    absFieldEnergyExpectationEv: absFieldEnergyExpectationHartree * HARTREE_EV,
    fieldRmsExtentBohr,
    polarizabilityProxyBohr3,
    starkShiftProxyHartree,
    starkShiftProxyEv: starkShiftProxyHartree * HARTREE_EV,
    responseBasis: 'finite-grid-z-axis-field-proxy',
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This is a bounded finite-grid Stark-response proxy, not a calibrated polarizability or TDSE/DFT response calculation.',
        'The field term is included in the WebGPU Hamiltonian as F*z in atomic units and clamped for interactive stability.'
      ]
    }
  };
  const magneticResponse = {
    schema: QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA,
    backend: WEBGPU_WAVEFUNCTION_EVOLUTION_BACKEND,
    modelId: 'webgpu-screened-hydrogenic-zeeman-response-proxy-v0',
    mode: 'reduced-zeeman-hamiltonian-shift',
    status: Math.abs(magneticFieldAtomicUnits) > 0 ? 'field-coupled' : 'zero-field',
    magneticFieldT,
    magneticFieldAtomicUnits,
    maxInteractiveMagneticFieldAtomicUnits: MAX_INTERACTIVE_MAGNETIC_FIELD_AU,
    atomicMagneticFieldT: ATOMIC_MAGNETIC_FIELD_T,
    orbitalMagneticM,
    spinProjection,
    zeemanProjection,
    magneticMomentProjectionBohrMagneton,
    zeemanEnergyExpectationHartree,
    zeemanEnergyExpectationEv: zeemanEnergyExpectationHartree * HARTREE_EV,
    absZeemanEnergyExpectationHartree,
    absZeemanEnergyExpectationEv: absZeemanEnergyExpectationHartree * HARTREE_EV,
    larmorAngularFrequencyProxyAu,
    responseBasis: 'finite-grid-magnetic-field-zeeman-proxy',
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This is a bounded reduced Zeeman-response proxy, not a calibrated magnetic susceptibility, spin-orbit, or many-electron magnetic response.',
        'The magnetic term is included in the WebGPU Hamiltonian as a constant 0.5*B*(m+2s) shift in atomic units.'
      ]
    }
  };
  return {
    schema: QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA,
    backend: WEBGPU_WAVEFUNCTION_EVOLUTION_BACKEND,
    modelId: 'webgpu-central-difference-real-time-wavefunction-step-v0',
    mode: 'wgsl-single-step-explicit-real-time-schrodinger',
    status: normDrift < 1e-4 ? 'finite-difference-stable' : normDrift < 5e-3 ? 'finite-difference-watch' : 'finite-difference-unstable',
    hamiltonian: 'H = -1/2 laplacian - Z_eff/r + Fz + 0.5*B*(m+2s)',
    integrator: 'first-order-explicit-complex-euler-renormalized',
    dtAtomicUnits,
    dtAttoseconds: dtAtomicUnits * 24.188843265857,
    energyExpectationHartree,
    energyExpectationEv: energyExpectationHartree * HARTREE_EV,
    kineticExpectationHartree,
    kineticExpectationEv: kineticExpectationHartree * HARTREE_EV,
    potentialExpectationHartree,
    potentialExpectationEv: potentialExpectationHartree * HARTREE_EV,
    fieldEnergyExpectationHartree,
    fieldEnergyExpectationEv: fieldEnergyExpectationHartree * HARTREE_EV,
    absFieldEnergyExpectationHartree,
    absFieldEnergyExpectationEv: absFieldEnergyExpectationHartree * HARTREE_EV,
    electricFieldVm,
    electricFieldAtomicUnits,
    dipoleMomentZBohrElectron,
    fieldRmsExtentBohr,
    polarizabilityProxyBohr3,
    starkShiftProxyHartree,
    starkShiftProxyEv: starkShiftProxyHartree * HARTREE_EV,
    magneticFieldT,
    magneticFieldAtomicUnits,
    orbitalMagneticM,
    spinProjection,
    zeemanProjection,
    zeemanEnergyExpectationHartree,
    zeemanEnergyExpectationEv: zeemanEnergyExpectationHartree * HARTREE_EV,
    absZeemanEnergyExpectationHartree,
    absZeemanEnergyExpectationEv: absZeemanEnergyExpectationHartree * HARTREE_EV,
    magneticMomentProjectionBohrMagneton,
    larmorAngularFrequencyProxyAu,
    componentEnergyExpectationHartree,
    componentEnergyExpectationEv: componentEnergyExpectationHartree * HARTREE_EV,
    hamiltonianComponentResidualHartree,
    hamiltonianComponentResidualEv: hamiltonianComponentResidualHartree * HARTREE_EV,
    virialResidualHartree,
    virialResidualEv: virialResidualHartree * HARTREE_EV,
    hamiltonianComponents,
    fieldResponse,
    fieldResponseSchema: fieldResponse.schema,
    magneticResponse,
    magneticResponseSchema: magneticResponse.schema,
    phaseRotationRad,
    normBefore,
    normAfterEuler,
    normDrift,
    renormalizationScale,
    densityDriftL1,
    maxDensityDelta,
    hPsiNorm: Math.sqrt(Math.max(0, hPsiSquared)),
    gridSize: normalized.gridSize,
    sampleCount: normalized.gridSize ** 3,
    spacingBohr: grid.spacingBohr,
    extentBohr: grid.extentBohr,
    ...sampleCounts,
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This is a WebGPU reducer for the single explicit finite-difference Hamiltonian step, not a stable production time propagator.',
        'The step starts from the base real screened hydrogenic orbital and renormalizes after the Euler update.'
      ]
    }
  };
}

function createQuantumOrbitalGridStatisticalBridge({
  normalized,
  grid,
  wavefunctionEvolution = null,
  radialEigenstate = null
}) {
  const temperatureK = clamp(finiteNumber(normalized.options?.ambientTemperatureK, 298.15), 0.001, 1e9);
  const pressurePa = clamp(finiteNumber(normalized.options?.ambientPressurePa, 101325), 1e-9, 1e18);
  const thermalEnergyEv = Math.max(1e-12, temperatureK * BOLTZMANN_EV_PER_K);
  const baseEnergyEv = finiteNumber(
    radialEigenstate?.energyEv
      ?? wavefunctionEvolution?.energyExpectationEv
      ?? grid.energyEv,
    grid.energyEv
  );
  const componentEnergyEv = finiteNumber(
    wavefunctionEvolution?.componentEnergyExpectationEv
      ?? wavefunctionEvolution?.hamiltonianComponents?.componentEnergyExpectationEv,
    baseEnergyEv
  );
  const nextN = Math.min(12, Math.max(normalized.principalN + 1, normalized.principalN));
  const excitedReferenceEv = hydrogenicEnergyEv({ n: nextN, zEff: finiteNumber(grid.zEff, normalized.element.Z) });
  const excitationGapEv = clamp(
    Math.max(
      1e-9,
      excitedReferenceEv - Math.min(baseEnergyEv, componentEnergyEv)
    ),
    1e-9,
    1e9
  );
  const groundDegeneracy = Math.max(1, 2 * (2 * normalized.angularL + 1));
  const excitedDegeneracy = Math.max(1, 2 * nextN * nextN);
  const excitedWeight = excitedDegeneracy * Math.exp(-Math.min(700, excitationGapEv / thermalEnergyEv));
  const partitionRelative = Math.max(1e-300, groundDegeneracy + excitedWeight);
  const partitionFunctionLog = Math.log(partitionRelative);
  const excitedOccupation = clamp(excitedWeight / partitionRelative, 0, 1);
  const groundOccupation = clamp(groundDegeneracy / partitionRelative, 0, 1);
  const internalEnergyEv = baseEnergyEv + excitedOccupation * excitationGapEv;
  const freeEnergyEv = baseEnergyEv - thermalEnergyEv * partitionFunctionLog;
  const energyVarianceEv2 = groundOccupation * (baseEnergyEv - internalEnergyEv) ** 2
    + excitedOccupation * (baseEnergyEv + excitationGapEv - internalEnergyEv) ** 2;
  const heatCapacityProxy = clamp(energyVarianceEv2 / Math.max(thermalEnergyEv * thermalEnergyEv, 1e-24), 0, 64);
  const entropyProxyKb = clamp(partitionFunctionLog + (internalEnergyEv - baseEnergyEv) / thermalEnergyEv, 0, 128);
  const ionizationThresholdEv = Math.max(0.1, Math.abs(baseEnergyEv));
  const pressureRatio = clamp(pressurePa / 101325, 1e-12, 1e12);
  const ionizationBoltzmann = Math.exp(-Math.min(700, ionizationThresholdEv / thermalEnergyEv));
  const ionizationFraction = clamp(
    ionizationBoltzmann * (1 + excitedOccupation * 8) / Math.sqrt(Math.max(1e-9, pressureRatio)),
    0,
    1
  );
  const degeneracyParameter = clamp(
    Math.max(0, normalized.element.Z) * Math.pow(pressureRatio, 2 / 3) / Math.pow(Math.max(1, temperatureK / 300), 1.5) * 1e-4,
    0,
    128
  );
  const opacityPopulationProxy = clamp(
    excitedOccupation * 0.75
      + ionizationFraction * 0.42
      + Math.abs(finiteNumber(wavefunctionEvolution?.fieldEnergyExpectationEv, 0)) / 100
      + Math.abs(finiteNumber(wavefunctionEvolution?.zeemanEnergyExpectationEv, 0)) / 100,
    0,
    64
  );
  const ensemblePressurePa = clamp(
    pressurePa * (1 + excitedOccupation * 0.02 + ionizationFraction * 0.14 + Math.min(0.2, degeneracyParameter * 0.01)),
    1e-9,
    1e18
  );
  const pressureDriveProxy = clamp(Math.log2(Math.max(1e-12, ensemblePressurePa / Math.max(1e-9, pressurePa))) * 0.16, -0.4, 0.4);
  const opacityDriveProxy = clamp(opacityPopulationProxy * 0.05 + ionizationFraction * 0.08, 0, 1.35);
  const degeneracyPressureDriveProxy = clamp(degeneracyParameter * 0.012, 0, 0.32);
  const temperatureDeltaKProxy = clamp(excitedOccupation * 38 + ionizationFraction * 45 + heatCapacityProxy * 0.12, 0, 90);
  const chargeDeltaProxy = clamp(ionizationFraction * 0.08 + degeneracyPressureDriveProxy * 0.02, 0, 0.1);
  const thermalDampingScale = clamp(1 - Math.min(0.08, heatCapacityProxy * 0.0025 + Math.max(0, pressureDriveProxy) * 0.08), 0.82, 1.05);
  return {
    schema: QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA,
    backend: WEBGPU_WAVEFUNCTION_EVOLUTION_BACKEND,
    modelId: 'webgpu-orbital-two-level-statistical-bridge-v0',
    mode: 'hamiltonian-spectrum-to-reduced-ensemble-closure',
    status: 'webgpu-energy-derived-ensemble-ready',
    distribution: 'reduced-boltzmann-two-level-saha-degeneracy',
    sourceHamiltonianSchema: wavefunctionEvolution?.hamiltonianComponents?.schema || null,
    sourceWavefunctionEvolutionSchema: wavefunctionEvolution?.schema || null,
    sourceRadialEigenstateSchema: radialEigenstate?.schema || null,
    temperatureK,
    pressurePa,
    thermalEnergyEv,
    referenceEnergyEv: baseEnergyEv,
    componentEnergyEv,
    excitedReferenceEnergyEv: baseEnergyEv + excitationGapEv,
    excitationGapEv,
    groundDegeneracy,
    excitedDegeneracy,
    partitionFunctionLog,
    groundOccupation,
    excitedOccupation,
    freeEnergyEv,
    internalEnergyEv,
    energyVarianceEv2,
    heatCapacityProxy,
    entropyProxyKb,
    ionizationThresholdEv,
    ionizationFraction,
    opacityPopulationProxy,
    degeneracyParameter,
    ensemblePressurePa,
    sourceTerms: {
      pressureDriveProxy,
      opacityDriveProxy,
      ionizationDriveProxy: ionizationFraction,
      degeneracyPressureDriveProxy,
      temperatureDeltaKProxy,
      chargeDeltaProxy,
      heatCapacityProxy,
      thermalDampingScale
    },
    channels: [
      { id: 'orbital-partition', quantity: 'relative-partition-function', unit: 'log', driveProxy: partitionFunctionLog },
      { id: 'orbital-excitation', quantity: 'excited-state-occupation', unit: 'fraction', driveProxy: excitedOccupation },
      { id: 'orbital-ionization', quantity: 'saha-like-ionization-population', unit: 'fraction', driveProxy: ionizationFraction },
      { id: 'orbital-opacity', quantity: 'opacity-population-proxy', unit: 'reduced', driveProxy: opacityDriveProxy },
      { id: 'orbital-heat-capacity', quantity: 'heat-capacity-proxy', unit: 'reduced', driveProxy: heatCapacityProxy }
    ],
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This is a reduced two-level Boltzmann/Saha-style bridge derived from WebGPU qgrid energy reductions, not a calibrated EOS or many-electron partition function.',
        'The bridge is intended to make ensemble/statistical handoff explicit for lower-layer coupling before calibrated quantum statistical closures are available.'
      ]
    }
  };
}

function createFiniteGridSummary({
  normalized,
  grid,
  moments,
  backend,
  webgpuStatus = null,
  webgpuError = null,
  reference = null,
  parity = null,
  webgpuEigenResidual = null,
  webgpuEigenResidualError = null,
  webgpuWavefunctionEvolution = null,
  webgpuWavefunctionEvolutionError = null,
  webgpuRadialEigenstate = null,
  webgpuRadialEigenstateError = null
}) {
  const activeOrbital = {
    n: normalized.principalN,
    l: normalized.angularL,
    magneticM: normalized.magneticM
  };
  const eigenResidual = webgpuEigenResidual || null;
  const wavefunctionEvolution = webgpuWavefunctionEvolution || null;
  const statisticalBridge = wavefunctionEvolution
    ? createQuantumOrbitalGridStatisticalBridge({
      normalized,
      grid,
      wavefunctionEvolution,
      radialEigenstate: webgpuRadialEigenstate
    })
    : null;
  return {
    schema: QUANTUM_ORBITAL_FINITE_GRID_SCHEMA,
    liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
    backend,
    elementSymbol: normalized.element.symbol,
    atomicNumber: normalized.element.Z,
    principalN: normalized.principalN,
    angularL: normalized.angularL,
    magneticM: normalized.magneticM,
    gridSize: normalized.gridSize,
    sampleCount: normalized.gridSize ** 3,
    extentBohr: grid.extentBohr,
    spacingBohr: grid.spacingBohr,
    zEff: grid.zEff,
    energyEv: grid.energyEv,
    normalization: moments.probabilityMass,
    normalizationError: moments.normalizationError,
    boundaryMass: moments.boundaryMass ?? grid.boundaryMass ?? null,
    maxProbability: grid.maxProbability ?? null,
    maxRadiusBohr: grid.maxRadiusBohr ?? null,
    meanRadiusBohr: moments.meanRadiusBohr,
    rmsRadiusBohr: moments.rmsRadiusBohr,
    probabilityMass: moments.probabilityMass,
    rawProbabilityMass: moments.rawProbabilityMass ?? null,
    rawNormalizationMode: moments.rawNormalizationMode || null,
    reductionMode: webgpuStatus?.reductionMode || 'webgpu-float32-orbital-evaluation-reduction',
    webgpuStatus,
    webgpuError,
    reference,
    parity,
    eigenResidual,
    eigenResidualSchema: eigenResidual?.schema || null,
    eigenResidualStatus: eigenResidual?.status || (webgpuEigenResidualError ? 'webgpu-error' : 'unavailable'),
    eigenResidualRelativeL2: eigenResidual?.relativeL2 ?? null,
    eigenResidualWeightedMeanHartree: eigenResidual?.weightedMeanResidualHartree ?? null,
    eigenResidualWeightedMeanEv: eigenResidual?.weightedMeanResidualEv ?? null,
    eigenResidualMaxAbsHartree: eigenResidual?.maxAbsResidualHartree ?? null,
    eigenResidualInteriorSampleCount: eigenResidual?.interiorSampleCount ?? null,
    eigenResidualWebgpu: webgpuEigenResidual ? {
      ...webgpuEigenResidual
    } : null,
    eigenResidualWebgpuError: webgpuEigenResidualError,
    eigenResidualWebgpuSchema: webgpuEigenResidual?.schema || null,
    eigenResidualWebgpuStatus: webgpuEigenResidual?.status || null,
    eigenResidualWebgpuRelativeL2: webgpuEigenResidual?.relativeL2 ?? null,
    eigenResidualWebgpuWeightedMeanEv: webgpuEigenResidual?.weightedMeanResidualEv ?? null,
    eigenResidualWebgpuParity: null,
    eigenResidualWebgpuParityOk: null,
    wavefunctionEvolution,
    wavefunctionEvolutionSchema: wavefunctionEvolution?.schema || null,
    wavefunctionEvolutionStatus: wavefunctionEvolution?.status || (webgpuWavefunctionEvolutionError ? 'webgpu-error' : 'unavailable'),
    wavefunctionEvolutionDtAtomicUnits: wavefunctionEvolution?.dtAtomicUnits ?? null,
    wavefunctionEvolutionNormDrift: wavefunctionEvolution?.normDrift ?? null,
    wavefunctionEvolutionDensityDriftL1: wavefunctionEvolution?.densityDriftL1 ?? null,
    wavefunctionEvolutionEnergyExpectationEv: wavefunctionEvolution?.energyExpectationEv ?? null,
    wavefunctionEvolutionKineticExpectationEv: wavefunctionEvolution?.kineticExpectationEv ?? null,
    wavefunctionEvolutionPotentialExpectationEv: wavefunctionEvolution?.potentialExpectationEv ?? null,
    wavefunctionEvolutionFieldEnergyExpectationEv: wavefunctionEvolution?.fieldEnergyExpectationEv ?? null,
    wavefunctionEvolutionAbsFieldEnergyExpectationEv: wavefunctionEvolution?.absFieldEnergyExpectationEv ?? null,
    wavefunctionEvolutionElectricFieldVm: wavefunctionEvolution?.electricFieldVm ?? null,
    wavefunctionEvolutionElectricFieldAtomicUnits: wavefunctionEvolution?.electricFieldAtomicUnits ?? null,
    wavefunctionEvolutionDipoleMomentZBohrElectron: wavefunctionEvolution?.dipoleMomentZBohrElectron ?? null,
    wavefunctionEvolutionFieldRmsExtentBohr: wavefunctionEvolution?.fieldRmsExtentBohr ?? null,
    wavefunctionEvolutionPolarizabilityProxyBohr3: wavefunctionEvolution?.polarizabilityProxyBohr3 ?? null,
    wavefunctionEvolutionStarkShiftProxyEv: wavefunctionEvolution?.starkShiftProxyEv ?? null,
    wavefunctionEvolutionFieldResponse: wavefunctionEvolution?.fieldResponse ?? null,
    wavefunctionEvolutionFieldResponseSchema: wavefunctionEvolution?.fieldResponse?.schema ?? null,
    wavefunctionEvolutionMagneticFieldT: wavefunctionEvolution?.magneticFieldT ?? null,
    wavefunctionEvolutionMagneticFieldAtomicUnits: wavefunctionEvolution?.magneticFieldAtomicUnits ?? null,
    wavefunctionEvolutionZeemanEnergyExpectationEv: wavefunctionEvolution?.zeemanEnergyExpectationEv ?? null,
    wavefunctionEvolutionAbsZeemanEnergyExpectationEv: wavefunctionEvolution?.absZeemanEnergyExpectationEv ?? null,
    wavefunctionEvolutionMagneticMomentProjectionBohrMagneton: wavefunctionEvolution?.magneticMomentProjectionBohrMagneton ?? null,
    wavefunctionEvolutionZeemanProjection: wavefunctionEvolution?.zeemanProjection ?? null,
    wavefunctionEvolutionSpinProjection: wavefunctionEvolution?.spinProjection ?? null,
    wavefunctionEvolutionLarmorAngularFrequencyProxyAu: wavefunctionEvolution?.larmorAngularFrequencyProxyAu ?? null,
    wavefunctionEvolutionMagneticResponse: wavefunctionEvolution?.magneticResponse ?? null,
    wavefunctionEvolutionMagneticResponseSchema: wavefunctionEvolution?.magneticResponse?.schema ?? null,
    wavefunctionEvolutionComponentEnergyExpectationEv: wavefunctionEvolution?.componentEnergyExpectationEv ?? null,
    wavefunctionEvolutionHamiltonianComponentResidualEv: wavefunctionEvolution?.hamiltonianComponentResidualEv ?? null,
    wavefunctionEvolutionVirialResidualEv: wavefunctionEvolution?.virialResidualEv ?? null,
    wavefunctionEvolutionHamiltonianComponents: wavefunctionEvolution?.hamiltonianComponents ?? null,
    wavefunctionEvolutionHamiltonianComponentsSchema: wavefunctionEvolution?.hamiltonianComponents?.schema ?? null,
    wavefunctionEvolutionPhaseRotationRad: wavefunctionEvolution?.phaseRotationRad ?? null,
    wavefunctionEvolutionInteriorSampleCount: wavefunctionEvolution?.interiorSampleCount ?? null,
    wavefunctionEvolutionWebgpu: webgpuWavefunctionEvolution ? {
      ...webgpuWavefunctionEvolution
    } : null,
    wavefunctionEvolutionWebgpuError: webgpuWavefunctionEvolutionError,
    wavefunctionEvolutionWebgpuSchema: webgpuWavefunctionEvolution?.schema || null,
    wavefunctionEvolutionWebgpuStatus: webgpuWavefunctionEvolution?.status || null,
    wavefunctionEvolutionWebgpuDtAtomicUnits: webgpuWavefunctionEvolution?.dtAtomicUnits ?? null,
    wavefunctionEvolutionWebgpuNormDrift: webgpuWavefunctionEvolution?.normDrift ?? null,
    wavefunctionEvolutionWebgpuDensityDriftL1: webgpuWavefunctionEvolution?.densityDriftL1 ?? null,
    wavefunctionEvolutionWebgpuEnergyExpectationEv: webgpuWavefunctionEvolution?.energyExpectationEv ?? null,
    wavefunctionEvolutionWebgpuKineticExpectationEv: webgpuWavefunctionEvolution?.kineticExpectationEv ?? null,
    wavefunctionEvolutionWebgpuPotentialExpectationEv: webgpuWavefunctionEvolution?.potentialExpectationEv ?? null,
    wavefunctionEvolutionWebgpuFieldEnergyExpectationEv: webgpuWavefunctionEvolution?.fieldEnergyExpectationEv ?? null,
    wavefunctionEvolutionWebgpuAbsFieldEnergyExpectationEv: webgpuWavefunctionEvolution?.absFieldEnergyExpectationEv ?? null,
    wavefunctionEvolutionWebgpuElectricFieldVm: webgpuWavefunctionEvolution?.electricFieldVm ?? null,
    wavefunctionEvolutionWebgpuElectricFieldAtomicUnits: webgpuWavefunctionEvolution?.electricFieldAtomicUnits ?? null,
    wavefunctionEvolutionWebgpuDipoleMomentZBohrElectron: webgpuWavefunctionEvolution?.dipoleMomentZBohrElectron ?? null,
    wavefunctionEvolutionWebgpuFieldRmsExtentBohr: webgpuWavefunctionEvolution?.fieldRmsExtentBohr ?? null,
    wavefunctionEvolutionWebgpuPolarizabilityProxyBohr3: webgpuWavefunctionEvolution?.polarizabilityProxyBohr3 ?? null,
    wavefunctionEvolutionWebgpuStarkShiftProxyEv: webgpuWavefunctionEvolution?.starkShiftProxyEv ?? null,
    wavefunctionEvolutionWebgpuFieldResponse: webgpuWavefunctionEvolution?.fieldResponse ?? null,
    wavefunctionEvolutionWebgpuFieldResponseSchema: webgpuWavefunctionEvolution?.fieldResponse?.schema ?? null,
    wavefunctionEvolutionWebgpuMagneticFieldT: webgpuWavefunctionEvolution?.magneticFieldT ?? null,
    wavefunctionEvolutionWebgpuMagneticFieldAtomicUnits: webgpuWavefunctionEvolution?.magneticFieldAtomicUnits ?? null,
    wavefunctionEvolutionWebgpuZeemanEnergyExpectationEv: webgpuWavefunctionEvolution?.zeemanEnergyExpectationEv ?? null,
    wavefunctionEvolutionWebgpuAbsZeemanEnergyExpectationEv: webgpuWavefunctionEvolution?.absZeemanEnergyExpectationEv ?? null,
    wavefunctionEvolutionWebgpuMagneticMomentProjectionBohrMagneton: webgpuWavefunctionEvolution?.magneticMomentProjectionBohrMagneton ?? null,
    wavefunctionEvolutionWebgpuZeemanProjection: webgpuWavefunctionEvolution?.zeemanProjection ?? null,
    wavefunctionEvolutionWebgpuSpinProjection: webgpuWavefunctionEvolution?.spinProjection ?? null,
    wavefunctionEvolutionWebgpuLarmorAngularFrequencyProxyAu: webgpuWavefunctionEvolution?.larmorAngularFrequencyProxyAu ?? null,
    wavefunctionEvolutionWebgpuMagneticResponse: webgpuWavefunctionEvolution?.magneticResponse ?? null,
    wavefunctionEvolutionWebgpuMagneticResponseSchema: webgpuWavefunctionEvolution?.magneticResponse?.schema ?? null,
    wavefunctionEvolutionWebgpuComponentEnergyExpectationEv: webgpuWavefunctionEvolution?.componentEnergyExpectationEv ?? null,
    wavefunctionEvolutionWebgpuHamiltonianComponentResidualEv: webgpuWavefunctionEvolution?.hamiltonianComponentResidualEv ?? null,
    wavefunctionEvolutionWebgpuVirialResidualEv: webgpuWavefunctionEvolution?.virialResidualEv ?? null,
    wavefunctionEvolutionWebgpuHamiltonianComponents: webgpuWavefunctionEvolution?.hamiltonianComponents ?? null,
    wavefunctionEvolutionWebgpuHamiltonianComponentsSchema: webgpuWavefunctionEvolution?.hamiltonianComponents?.schema ?? null,
    wavefunctionEvolutionWebgpuPhaseRotationRad: webgpuWavefunctionEvolution?.phaseRotationRad ?? null,
    wavefunctionEvolutionWebgpuInteriorSampleCount: webgpuWavefunctionEvolution?.interiorSampleCount ?? null,
    wavefunctionEvolutionWebgpuParity: null,
    wavefunctionEvolutionWebgpuParityOk: null,
    statisticalBridge,
    statisticalBridgeSchema: statisticalBridge?.schema || null,
    statisticalBridgeStatus: statisticalBridge?.status || (webgpuWavefunctionEvolutionError ? 'webgpu-error' : 'unavailable'),
    statisticalBridgeBackend: statisticalBridge?.backend || null,
    statisticalBridgePartitionFunctionLog: statisticalBridge?.partitionFunctionLog ?? null,
    statisticalBridgeGroundOccupation: statisticalBridge?.groundOccupation ?? null,
    statisticalBridgeExcitedOccupation: statisticalBridge?.excitedOccupation ?? null,
    statisticalBridgeFreeEnergyEv: statisticalBridge?.freeEnergyEv ?? null,
    statisticalBridgeInternalEnergyEv: statisticalBridge?.internalEnergyEv ?? null,
    statisticalBridgeHeatCapacityProxy: statisticalBridge?.heatCapacityProxy ?? null,
    statisticalBridgeEntropyProxyKb: statisticalBridge?.entropyProxyKb ?? null,
    statisticalBridgeIonizationFraction: statisticalBridge?.ionizationFraction ?? null,
    statisticalBridgeOpacityPopulationProxy: statisticalBridge?.opacityPopulationProxy ?? null,
    statisticalBridgeDegeneracyParameter: statisticalBridge?.degeneracyParameter ?? null,
    statisticalBridgeEnsemblePressurePa: statisticalBridge?.ensemblePressurePa ?? null,
    statisticalBridgeTemperatureDeltaKProxy: statisticalBridge?.sourceTerms?.temperatureDeltaKProxy ?? null,
    statisticalBridgeChargeDeltaProxy: statisticalBridge?.sourceTerms?.chargeDeltaProxy ?? null,
    statisticalBridgeThermalDampingScale: statisticalBridge?.sourceTerms?.thermalDampingScale ?? null,
    radialEigenstate: webgpuRadialEigenstate || null,
    radialEigenstateSchema: webgpuRadialEigenstate?.schema || null,
    radialEigenstateStatus: webgpuRadialEigenstate?.status || (webgpuRadialEigenstateError ? 'webgpu-error' : 'unavailable'),
    radialEigenstateEnergyEv: webgpuRadialEigenstate?.energyEv ?? null,
    radialEigenstateAnalyticEnergyEv: webgpuRadialEigenstate?.analyticEnergyEv ?? null,
    radialEigenstateEnergyErrorEv: webgpuRadialEigenstate?.energyErrorEv ?? null,
    radialEigenstateResidualRelativeL2: webgpuRadialEigenstate?.residualRelativeL2 ?? null,
    radialEigenstateMeanRadiusBohr: webgpuRadialEigenstate?.meanRadiusBohr ?? null,
    radialEigenstateGridPointCount: webgpuRadialEigenstate?.gridPointCount ?? null,
    radialEigenstateNodeCountObserved: webgpuRadialEigenstate?.radialNodeCountObserved ?? null,
    radialEigenstateNodeCountTarget: webgpuRadialEigenstate?.radialNodeCountTarget ?? null,
    radialEigenstateWebgpu: webgpuRadialEigenstate ? {
      ...webgpuRadialEigenstate,
      radialGrid: webgpuRadialEigenstate.radialGrid ? {
        ...webgpuRadialEigenstate.radialGrid,
        wavefunctionU: null,
        residualHartree: null
      } : null
    } : null,
    radialEigenstateWebgpuError: webgpuRadialEigenstateError,
    radialEigenstateWebgpuSchema: webgpuRadialEigenstate?.schema || null,
    radialEigenstateWebgpuStatus: webgpuRadialEigenstate?.status || null,
    radialEigenstateWebgpuResidualRelativeL2: webgpuRadialEigenstate?.residualRelativeL2 ?? null,
    radialEigenstateWebgpuEnergyErrorEv: webgpuRadialEigenstate?.energyErrorEv ?? null,
    activeOrbital
  };
}

class QuantumOrbitalGridWebGpuRuntime {
  constructor(stateKey) {
    this.stateKey = stateKey;
    this.device = null;
    this.evaluationPipeline = null;
    this.eigenResidualPipeline = null;
    this.wavefunctionEvolutionPipeline = null;
    this.submittedEvaluations = 0;
    this.submittedEigenResiduals = 0;
    this.submittedWavefunctionEvolutions = 0;
    this.lastError = null;
    this.deviceLossHooked = false;
  }

  async ensureDevice() {
    if (this.device) return;
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for quantum-orbital-grid worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for quantum-orbital-grid worker');
    this.device = await adapter.requestDevice();
    if (!this.deviceLossHooked) {
      this.device.lost?.then((info) => {
        this.lastError = info?.message || info?.reason || 'Quantum orbital WebGPU device lost';
        gpuDisabledReasons.set(this.stateKey, this.lastError);
      });
      this.deviceLossHooked = true;
    }
  }

  async createPipeline(shaderCode, label) {
    await this.ensureDevice();
    this.device.pushErrorScope?.('validation');
    const pipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: shaderCode, label }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Quantum orbital WebGPU ${label} validation: ${validationError.message || validationError}`);
    }
    return pipeline;
  }

  async initializeEvaluation() {
    if (this.evaluationPipeline) return;
    this.evaluationPipeline = await this.createPipeline(ORBITAL_EVALUATION_REDUCTION_SHADER, 'probability-evaluation-reduction');
  }

  async initializeEigenResidual() {
    if (this.eigenResidualPipeline) return;
    this.eigenResidualPipeline = await this.createPipeline(ORBITAL_EIGEN_RESIDUAL_SHADER, 'eigen-residual-reduction');
  }

  async initializeWavefunctionEvolution() {
    if (this.wavefunctionEvolutionPipeline) return;
    this.wavefunctionEvolutionPipeline = await this.createPipeline(ORBITAL_WAVEFUNCTION_EVOLUTION_SHADER, 'wavefunction-evolution-reduction');
  }

  makeEvaluationParams(grid, normalized) {
    return new Float32Array([
      normalized.gridSize,
      finiteNumber(grid.extentBohr),
      finiteNumber(grid.spacingBohr),
      finiteNumber(grid.zEff, normalized.element.Z),
      correctedRadialCharge(finiteNumber(grid.zEff, normalized.element.Z), normalized.principalN, normalized.angularL, normalized.options),
      normalized.principalN,
      normalized.angularL,
      normalized.magneticM,
      normalized.options.correlationMixing ? 1 : 0,
      normalized.options.relativisticSpinOrbit ? 1 : 0,
      normalized.options.screeningExchange ? 1 : 0,
      normalized.options.wavefunctionDtAtomicUnits || 0.002,
      normalized.options.electricFieldAtomicUnits || 0,
      normalized.options.electricFieldVm || 0,
      normalized.options.magneticFieldAtomicUnits || 0,
      normalized.options.magneticFieldT || 0,
      normalized.options.zeemanProjection || 0,
      normalized.options.spinProjection || 0,
      0,
      0
    ]);
  }

  async evaluate(grid, normalized) {
    await this.initializeEvaluation();
    const usage = globalThis.GPUBufferUsage;
    const mapMode = globalThis.GPUMapMode;
    if (!usage || !mapMode) throw new Error('WebGPU buffer constants unavailable for quantum-orbital-grid worker');
    const sampleCount = normalized.gridSize ** 3;
    const chunkCount = Math.ceil(sampleCount / WORKGROUP_SIZE);
    const params = this.makeEvaluationParams(grid, normalized);
    const paramBuffer = this.device.createBuffer({
      size: params.byteLength,
      usage: usage.STORAGE | usage.COPY_DST
    });
    const partialBytes = Math.max(16, chunkCount * 4 * Float32Array.BYTES_PER_ELEMENT);
    const partialBuffer = this.device.createBuffer({
      size: partialBytes,
      usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
    });
    const readBuffer = this.device.createBuffer({
      size: partialBytes,
      usage: usage.COPY_DST | usage.MAP_READ
    });
    const bindGroup = this.device.createBindGroup({
      layout: this.evaluationPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: paramBuffer } },
        { binding: 1, resource: { buffer: partialBuffer } }
      ]
    });
    this.device.queue.writeBuffer(paramBuffer, 0, params);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.evaluationPipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(chunkCount);
    pass.end();
    encoder.copyBufferToBuffer(partialBuffer, 0, readBuffer, 0, partialBytes);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await readBuffer.mapAsync(mapMode.READ);
    const mapped = readBuffer.getMappedRange();
    const partials = new Float32Array(mapped).slice();
    readBuffer.unmap();
    paramBuffer.destroy?.();
    partialBuffer.destroy?.();
    readBuffer.destroy?.();
    this.submittedEvaluations += 1;
    return {
      moments: momentsFromRawEvaluationPartials(partials, sampleCount),
      status: {
        schema: QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA,
        stateKey: this.stateKey,
        kernelMode: 'workgroup-probability-evaluation-reduction',
        evaluationMode: 'wgsl-screened-hydrogenic-density',
        reductionMode: 'webgpu-float32-orbital-evaluation-reduction',
        normalizationMode: 'gpu-self-normalized-density-moments',
        sampleCount,
        workgroupSize: WORKGROUP_SIZE,
        chunkCount,
        submittedEvaluations: this.submittedEvaluations,
        radialZ: params[4],
        options: {
          screeningExchange: Boolean(normalized.options.screeningExchange),
          relativisticSpinOrbit: Boolean(normalized.options.relativisticSpinOrbit),
          correlationMixing: Boolean(normalized.options.correlationMixing),
          electricFieldVm: normalized.options.electricFieldVm,
          electricFieldAtomicUnits: normalized.options.electricFieldAtomicUnits,
          magneticFieldT: normalized.options.magneticFieldT,
          magneticFieldAtomicUnits: normalized.options.magneticFieldAtomicUnits,
          zeemanProjection: normalized.options.zeemanProjection,
          spinProjection: normalized.options.spinProjection
        }
      }
    };
  }

  async evaluateEigenResidual(grid, normalized) {
    await this.initializeEigenResidual();
    const usage = globalThis.GPUBufferUsage;
    const mapMode = globalThis.GPUMapMode;
    if (!usage || !mapMode) throw new Error('WebGPU buffer constants unavailable for quantum-orbital-grid worker');
    const sampleCount = normalized.gridSize ** 3;
    const chunkCount = Math.ceil(sampleCount / WORKGROUP_SIZE);
    const params = this.makeEvaluationParams(grid, normalized);
    const paramBuffer = this.device.createBuffer({
      size: params.byteLength,
      usage: usage.STORAGE | usage.COPY_DST
    });
    const partialBytes = Math.max(16, chunkCount * 4 * Float32Array.BYTES_PER_ELEMENT);
    const partialBuffer = this.device.createBuffer({
      size: partialBytes,
      usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
    });
    const readBuffer = this.device.createBuffer({
      size: partialBytes,
      usage: usage.COPY_DST | usage.MAP_READ
    });
    const bindGroup = this.device.createBindGroup({
      layout: this.eigenResidualPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: paramBuffer } },
        { binding: 1, resource: { buffer: partialBuffer } }
      ]
    });
    this.device.queue.writeBuffer(paramBuffer, 0, params);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.eigenResidualPipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(chunkCount);
    pass.end();
    encoder.copyBufferToBuffer(partialBuffer, 0, readBuffer, 0, partialBytes);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await readBuffer.mapAsync(mapMode.READ);
    const mapped = readBuffer.getMappedRange();
    const partials = new Float32Array(mapped).slice();
    readBuffer.unmap();
    paramBuffer.destroy?.();
    partialBuffer.destroy?.();
    readBuffer.destroy?.();
    this.submittedEigenResiduals += 1;
    return {
      report: createEigenResidualWebGpuReport(partials, grid, normalized),
      status: {
        schema: QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA,
        stateKey: this.stateKey,
        kernelMode: 'workgroup-eigen-residual-reduction',
        evaluationMode: 'wgsl-screened-hydrogenic-wavefunction-central-difference',
        reductionMode: WEBGPU_EIGEN_RESIDUAL_BACKEND,
        sampleCount,
        workgroupSize: WORKGROUP_SIZE,
        chunkCount,
        submittedEigenResiduals: this.submittedEigenResiduals,
        radialZ: params[4],
        electricFieldVm: params[13],
        electricFieldAtomicUnits: params[12],
        magneticFieldT: params[15],
        magneticFieldAtomicUnits: params[14],
        zeemanProjection: params[16],
        spinProjection: params[17]
      }
    };
  }

  async evaluateWavefunctionEvolution(grid, normalized) {
    await this.initializeWavefunctionEvolution();
    const usage = globalThis.GPUBufferUsage;
    const mapMode = globalThis.GPUMapMode;
    if (!usage || !mapMode) throw new Error('WebGPU buffer constants unavailable for quantum-orbital-grid worker');
    const sampleCount = normalized.gridSize ** 3;
    const chunkCount = Math.ceil(sampleCount / WORKGROUP_SIZE);
    const params = this.makeEvaluationParams(grid, normalized);
    const paramBuffer = this.device.createBuffer({
      size: params.byteLength,
      usage: usage.STORAGE | usage.COPY_DST
    });
    const sampleTermBytes = Math.max(16, sampleCount * 4 * Float32Array.BYTES_PER_ELEMENT);
    const partialBytes = Math.max(16, chunkCount * 4 * Float32Array.BYTES_PER_ELEMENT);
    const sampleTermBuffer = this.device.createBuffer({
      size: sampleTermBytes,
      usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
    });
    const partialBuffer = this.device.createBuffer({
      size: partialBytes,
      usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
    });
    const fieldPartialBuffer = this.device.createBuffer({
      size: partialBytes,
      usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
    });
    const readSampleTermBuffer = this.device.createBuffer({
      size: sampleTermBytes,
      usage: usage.COPY_DST | usage.MAP_READ
    });
    const readPartialBuffer = this.device.createBuffer({
      size: partialBytes,
      usage: usage.COPY_DST | usage.MAP_READ
    });
    const readFieldPartialBuffer = this.device.createBuffer({
      size: partialBytes,
      usage: usage.COPY_DST | usage.MAP_READ
    });
    const bindGroup = this.device.createBindGroup({
      layout: this.wavefunctionEvolutionPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: paramBuffer } },
        { binding: 1, resource: { buffer: sampleTermBuffer } },
        { binding: 2, resource: { buffer: partialBuffer } },
        { binding: 3, resource: { buffer: fieldPartialBuffer } }
      ]
    });
    this.device.queue.writeBuffer(paramBuffer, 0, params);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.wavefunctionEvolutionPipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(chunkCount);
    pass.end();
    encoder.copyBufferToBuffer(sampleTermBuffer, 0, readSampleTermBuffer, 0, sampleTermBytes);
    encoder.copyBufferToBuffer(partialBuffer, 0, readPartialBuffer, 0, partialBytes);
    encoder.copyBufferToBuffer(fieldPartialBuffer, 0, readFieldPartialBuffer, 0, partialBytes);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await Promise.all([
      readSampleTermBuffer.mapAsync(mapMode.READ),
      readPartialBuffer.mapAsync(mapMode.READ),
      readFieldPartialBuffer.mapAsync(mapMode.READ)
    ]);
    const sampleTerms = new Float32Array(readSampleTermBuffer.getMappedRange()).slice();
    const partials = new Float32Array(readPartialBuffer.getMappedRange()).slice();
    const fieldPartials = new Float32Array(readFieldPartialBuffer.getMappedRange()).slice();
    readSampleTermBuffer.unmap();
    readPartialBuffer.unmap();
    readFieldPartialBuffer.unmap();
    paramBuffer.destroy?.();
    sampleTermBuffer.destroy?.();
    partialBuffer.destroy?.();
    fieldPartialBuffer.destroy?.();
    readSampleTermBuffer.destroy?.();
    readPartialBuffer.destroy?.();
    readFieldPartialBuffer.destroy?.();
    this.submittedWavefunctionEvolutions += 1;
    return {
      report: createWavefunctionEvolutionWebGpuReport(partials, sampleTerms, fieldPartials, grid, normalized),
      status: {
        schema: QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA,
        stateKey: this.stateKey,
        kernelMode: 'workgroup-wavefunction-evolution-reduction',
        evaluationMode: 'wgsl-screened-hydrogenic-wavefunction-central-difference-step',
        reductionMode: WEBGPU_WAVEFUNCTION_EVOLUTION_BACKEND,
        sampleCount,
        workgroupSize: WORKGROUP_SIZE,
        chunkCount,
        submittedWavefunctionEvolutions: this.submittedWavefunctionEvolutions,
        radialZ: params[4],
        dtAtomicUnits: params[11],
        electricFieldVm: params[13],
        electricFieldAtomicUnits: params[12],
        magneticFieldT: params[15],
        magneticFieldAtomicUnits: params[14],
        zeemanProjection: params[16],
        spinProjection: params[17]
      }
    };
  }
}

function resolvePayload(payload = {}) {
  const input = payload.input || payload;
  return {
    payload,
    input,
    stateKey: payload.stateKey || input.stateKey || input.taskId || DEFAULT_STATE_KEY,
    scope: input.scope || payload.scope || payload.solver?.warmDelta?.scope || DEFAULT_DELTA_SCOPE,
    taskId: input.taskId || payload.stateKey || input.stateKey || DEFAULT_STATE_KEY,
    emitCommitDelta: input.emitCommitDelta === true || payload.emitCommitDelta === true
  };
}

function createDeltaPayload({
  payload,
  input,
  stateKey,
  sequence,
  summary,
  diagnostics,
  backend,
  webgpuStatus,
  webgpuError,
  status = null,
  normalized = null
}) {
  return {
    schema: payload.solver?.warmDelta?.schema || QUANTUM_ORBITAL_GRID_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'quantum-orbital-grid',
    stateKey,
    backend,
    status,
    liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
    sequence,
    finiteGrid: summary,
    diagnostics,
    webgpuStatus,
    webgpuError,
    parameters: {
      elementSymbol: summary?.elementSymbol || normalized?.element?.symbol || input.elementSymbol || 'O',
      principalN: summary?.principalN ?? normalized?.principalN ?? input.principalN ?? input.n ?? 2,
      angularL: summary?.angularL ?? normalized?.angularL ?? input.angularL ?? input.l ?? 1,
      magneticM: summary?.magneticM ?? normalized?.magneticM ?? input.magneticM ?? input.m ?? 0,
      gridSize: summary?.gridSize ?? normalized?.gridSize ?? input.finiteGridSize ?? input.gridSize ?? 18,
      options: normalized?.options || input.options || null,
      electricFieldVm: summary?.wavefunctionEvolutionElectricFieldVm ?? normalized?.options?.electricFieldVm ?? 0,
      electricFieldAtomicUnits: summary?.wavefunctionEvolutionElectricFieldAtomicUnits ?? normalized?.options?.electricFieldAtomicUnits ?? 0,
      magneticFieldT: summary?.wavefunctionEvolutionMagneticFieldT ?? normalized?.options?.magneticFieldT ?? 0,
      magneticFieldAtomicUnits: summary?.wavefunctionEvolutionMagneticFieldAtomicUnits ?? normalized?.options?.magneticFieldAtomicUnits ?? 0,
      zeemanProjection: summary?.wavefunctionEvolutionZeemanProjection ?? normalized?.options?.zeemanProjection ?? 0,
      spinProjection: summary?.wavefunctionEvolutionSpinProjection ?? normalized?.options?.spinProjection ?? 0,
      ambientTemperatureK: normalized?.options?.ambientTemperatureK ?? 298.15,
      ambientPressurePa: normalized?.options?.ambientPressurePa ?? 101325
    },
    units: {
      length: 'Bohr radius',
      probability: 'normalized electron probability'
    }
  };
}

function createBlockedResult({
  resolved,
  normalized,
  sampleCount,
  reason,
  status = 'blocked-webgpu-unavailable',
  backend = 'webgpu-unavailable'
}) {
  const { payload, input, stateKey } = resolved;
  const state = states.get(stateKey) || { sequence: 0 };
  const sequence = state.sequence + 1;
  states.set(stateKey, {
    sequence,
    inputKey: normalized.inputKey,
    backend,
    status
  });
  const webgpuStatus = {
    schema: QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA,
    stateKey,
    status,
    backend,
    liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
    kernelMode: 'blocked',
    evaluationMode: 'blocked-webgpu-only-density-evaluation',
    reductionMode: 'blocked-webgpu-only-orbital-grid',
    sampleCount,
    workgroupSize: WORKGROUP_SIZE,
    fallback: false,
    reason
  };
  const diagnostics = {
    schema: 'peercompute.multiscale.quantum-orbital-grid.diagnostics.v0',
    inputKey: normalized.inputKey,
    elementSymbol: normalized.element.symbol,
    atomicNumber: normalized.element.Z,
    gridSize: normalized.gridSize,
    sampleCount,
    probabilityMass: null,
    normalizationError: null,
    meanRadiusBohr: null,
    rmsRadiusBohr: null,
    boundaryMass: null,
    reductionMode: 'blocked-webgpu-only-orbital-grid',
    parity: null,
    finiteGrid: null,
    liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY
  };
  const value = {
    ok: false,
    schema: QUANTUM_ORBITAL_GRID_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'quantum-orbital-grid',
    stateKey,
    status,
    backend,
    liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
    sequence,
    elapsedTime: sequence,
    inputKey: normalized.inputKey,
    finiteGrid: null,
    diagnostics,
    conservation: {
      probabilityMass: null,
      normalizationError: null,
      mode: 'blocked-webgpu-only-orbital-grid-evaluation',
      electronDensityAvailable: false,
      wavefunctionEvolutionAvailable: false
    },
    webgpuStatus,
    webgpuError: reason,
    parameters: {
      elementSymbol: normalized.element.symbol,
      principalN: normalized.principalN,
      angularL: normalized.angularL,
      magneticM: normalized.magneticM,
      gridSize: normalized.gridSize,
      options: normalized.options
    }
  };
  if (!resolved.emitCommitDelta) return value;
  return {
    value,
    commitDelta: {
      taskId: resolved.taskId,
      scope: resolved.scope,
      version: sequence,
      timestamp: Date.now(),
      payload: createDeltaPayload({
        payload,
        input,
        stateKey,
        sequence,
        summary: null,
        diagnostics,
        backend,
        webgpuStatus,
        webgpuError: reason,
        status,
        normalized
      })
    }
  };
}

export function resetQuantumOrbitalGrid(input = {}) {
  if (input.stateKey || input.taskId) {
    const key = input.stateKey || input.taskId;
    states.delete(key);
    gpuRuntimes.delete(key);
    gpuDisabledReasons.delete(key);
  } else {
    states.clear();
    gpuRuntimes.clear();
    gpuDisabledReasons.clear();
  }
  return {
    ok: true,
    schema: QUANTUM_ORBITAL_GRID_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepQuantumOrbitalGrid(payload = {}) {
  const resolved = resolvePayload(payload);
  const { input, stateKey } = resolved;
  const normalized = normalizeOrbitalInput(input);
  const sampleCount = normalized.gridSize ** 3;
  if (sampleCount > normalizeInteger(input.webgpuMaxSamples, QUANTUM_ORBITAL_GRID_MAX_SAMPLES, 1, 262144)) {
    throw new Error(`quantum-orbital-grid sample count ${sampleCount} exceeds configured maximum`);
  }
  const grid = createOrbitalGridMetadata(normalized);
  const backend = WEBGPU_EVALUATION_BACKEND;
  let moments = null;
  let webgpuStatus = null;
  let webgpuError = null;
  let parity = null;
  let webgpuEigenResidual = null;
  let webgpuEigenResidualError = null;
  let webgpuWavefunctionEvolution = null;
  let webgpuWavefunctionEvolutionError = null;
  let webgpuRadialEigenstate = null;
  let webgpuRadialEigenstateError = null;
  let webgpuRuntime = null;

  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  if (!wantsWebGpu) {
    return createBlockedResult({
      resolved,
      normalized,
      sampleCount,
      reason: 'quantum-orbital-grid requires WebGPU; enableWebGPU=false is blocked by webgpu-only-no-cpu-fallback policy'
    });
  }
  if (gpuDisabledReasons.has(stateKey)) {
    return createBlockedResult({
      resolved,
      normalized,
      sampleCount,
      reason: `${gpuDisabledReasons.get(stateKey)}; no CPU fallback is available for quantum-orbital-grid`
    });
  }
  try {
    webgpuRuntime = gpuRuntimes.get(stateKey);
    if (!webgpuRuntime) {
      webgpuRuntime = new QuantumOrbitalGridWebGpuRuntime(stateKey);
      gpuRuntimes.set(stateKey, webgpuRuntime);
    }
    const gpuResult = await webgpuRuntime.evaluate(grid, normalized);
    moments = gpuResult.moments;
    webgpuStatus = {
      ...gpuResult.status,
      liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
      fallback: false
    };
  } catch (error) {
    webgpuError = error instanceof Error ? error.message : String(error);
    gpuDisabledReasons.set(stateKey, webgpuError);
    return createBlockedResult({
      resolved,
      normalized,
      sampleCount,
      reason: `${webgpuError}; no CPU fallback is available for quantum-orbital-grid`,
      status: 'blocked-webgpu-execution-error',
      backend: 'webgpu-execution-error'
    });
  }
  if (webgpuRuntime && backend.startsWith('webgpu-')) {
    try {
      const residualResult = await webgpuRuntime.evaluateEigenResidual(grid, normalized);
      webgpuEigenResidual = residualResult.report;
      webgpuStatus = {
        ...(webgpuStatus || {}),
        eigenResidual: {
          ...residualResult.status,
          liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
          fallback: false
        }
      };
    } catch (error) {
      webgpuEigenResidualError = error instanceof Error ? error.message : String(error);
      webgpuStatus = webgpuStatus ? {
        ...webgpuStatus,
        eigenResidualError: webgpuEigenResidualError
      } : webgpuStatus;
    }
    try {
      const wavefunctionEvolutionResult = await webgpuRuntime.evaluateWavefunctionEvolution(grid, normalized);
      webgpuWavefunctionEvolution = wavefunctionEvolutionResult.report;
      webgpuStatus = {
        ...(webgpuStatus || {}),
        wavefunctionEvolution: {
          ...wavefunctionEvolutionResult.status,
          liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
          fallback: false
        }
      };
    } catch (error) {
      webgpuWavefunctionEvolutionError = error instanceof Error ? error.message : String(error);
      webgpuStatus = webgpuStatus ? {
        ...webgpuStatus,
        wavefunctionEvolutionError: webgpuWavefunctionEvolutionError
      } : webgpuStatus;
    }
    try {
      webgpuRadialEigenstate = await solveRadialSchrodingerEigenstateGpu({
        element: normalized.element,
        atomicNumber: normalized.element.Z,
        n: normalized.principalN,
        l: normalized.angularL,
        zEff: grid.zEff,
        options: normalized.options,
        gridPointCount: normalizeInteger(
          input.radialGridPointCount ?? input.gridPointCount,
          Math.max(192, normalized.gridSize * 12),
          96,
          768
        ),
        radialExtentBohr: input.radialExtentBohr ?? Math.max(grid.extentBohr, grid.extentBohr * 1.2),
        gpuDevice: webgpuRuntime.device
      });
      webgpuStatus = {
        ...(webgpuStatus || {}),
        radialEigenstate: {
          schema: webgpuRadialEigenstate.schema,
          backend: webgpuRadialEigenstate.backend,
          status: webgpuRadialEigenstate.status,
          kernelMode: webgpuRadialEigenstate.webgpuStatus?.kernelMode || 'webgpu-radial-hamiltonian',
          reductionMode: webgpuRadialEigenstate.webgpuStatus?.reductionMode || 'webgpu-workgroup-partials-js-final-sum',
          gridPointCount: webgpuRadialEigenstate.gridPointCount,
          workgroupSize: webgpuRadialEigenstate.webgpuStatus?.workgroupSize || null,
          partialCount: webgpuRadialEigenstate.webgpuStatus?.partialCount || null,
          liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
          fallback: false
        }
      };
    } catch (error) {
      webgpuRadialEigenstateError = error instanceof Error ? error.message : String(error);
      webgpuStatus = webgpuStatus ? {
        ...webgpuStatus,
        radialEigenstateError: webgpuRadialEigenstateError
      } : webgpuStatus;
    }
  }

  const state = states.get(stateKey) || { sequence: 0 };
  const sequence = state.sequence + 1;
  states.set(stateKey, {
    sequence,
    inputKey: normalized.inputKey,
    backend
  });
  const summary = createFiniteGridSummary({
    normalized,
    grid,
    moments,
    backend,
    webgpuStatus,
    webgpuError,
    reference: null,
    parity,
    webgpuEigenResidual,
    webgpuEigenResidualError,
    webgpuWavefunctionEvolution,
    webgpuWavefunctionEvolutionError,
    webgpuRadialEigenstate,
    webgpuRadialEigenstateError
  });
  const diagnostics = {
    schema: 'peercompute.multiscale.quantum-orbital-grid.diagnostics.v0',
    inputKey: normalized.inputKey,
    elementSymbol: normalized.element.symbol,
    atomicNumber: normalized.element.Z,
    gridSize: normalized.gridSize,
    sampleCount,
    probabilityMass: summary.probabilityMass,
    normalizationError: summary.normalizationError,
    meanRadiusBohr: summary.meanRadiusBohr,
    rmsRadiusBohr: summary.rmsRadiusBohr,
    boundaryMass: summary.boundaryMass,
    reductionMode: summary.reductionMode,
    parity,
    radialEigenstateSchema: summary.radialEigenstateSchema,
    radialEigenstateStatus: summary.radialEigenstateStatus,
    radialEigenstateEnergyEv: summary.radialEigenstateEnergyEv,
    radialEigenstateResidualRelativeL2: summary.radialEigenstateResidualRelativeL2,
    radialEigenstateWebgpuError: summary.radialEigenstateWebgpuError || null
  };
  const value = {
    ok: true,
    schema: QUANTUM_ORBITAL_GRID_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'quantum-orbital-grid',
    stateKey,
    status: 'webgpu-executed',
    backend,
    liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
    sequence,
    elapsedTime: sequence,
    inputKey: normalized.inputKey,
    finiteGrid: summary,
    diagnostics,
    conservation: {
      probabilityMass: summary.probabilityMass,
      normalizationError: summary.normalizationError,
      mode: 'webgpu-normalized-probability-grid'
    },
    webgpuStatus,
    webgpuError,
    parameters: {
      elementSymbol: normalized.element.symbol,
      principalN: normalized.principalN,
      angularL: normalized.angularL,
      magneticM: normalized.magneticM,
      gridSize: normalized.gridSize,
      options: normalized.options
    }
  };

  if (!resolved.emitCommitDelta) return value;
  return {
    value,
    commitDelta: {
      taskId: resolved.taskId,
      scope: resolved.scope,
      version: sequence,
      timestamp: Date.now(),
      payload: createDeltaPayload({
        payload,
        input,
        stateKey,
        sequence,
        summary,
        diagnostics,
        backend,
        webgpuStatus,
        webgpuError,
        status: 'webgpu-executed',
        normalized
      })
    }
  };
}

import { f32, mat3, mat3Invert, vec3 } from './math.js';

const DEFAULT_RADIUS = 0.12;

function unpackParticles(particleCloud) {
  if (Array.isArray(particleCloud)) {
    return particleCloud.map((particle) => {
      if (Array.isArray(particle) || ArrayBuffer.isView(particle)) {
        return { position: particle, radius: DEFAULT_RADIUS, mass: 1 };
      }
      return particle;
    });
  }

  const positions = particleCloud?.positions;
  if (!positions || positions.length % 3 !== 0) {
    throw new TypeError('particleCloud must be an array or provide packed positions');
  }
  const count = positions.length / 3;
  return Array.from({ length: count }, (_, index) => ({
    position: positions.subarray?.(index * 3, index * 3 + 3)
      ?? positions.slice(index * 3, index * 3 + 3),
    radius: particleCloud.radii?.[index] ?? particleCloud.radius ?? DEFAULT_RADIUS,
    mass: particleCloud.masses?.[index] ?? particleCloud.massWeights?.[index] ?? 1,
    material: particleCloud.materials?.[index] ?? null,
    tag: particleCloud.tags?.[index] ?? null,
  }));
}

function requirePositive(value, label) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a finite positive number`);
  }
  return value;
}

export function calculateParticleCloudMassProperties(particleCloud, totalMass = 1) {
  requirePositive(totalMass, 'totalMass');
  const source = unpackParticles(particleCloud);
  if (source.length === 0) {
    throw new RangeError('particleCloud must contain at least one particle');
  }

  let sourceMass = 0;
  const center = [0, 0, 0];
  for (let index = 0; index < source.length; index += 1) {
    const particle = source[index];
    const position = particle.position;
    if (!position || position.length < 3 || !Array.from(position).every(Number.isFinite)) {
      throw new TypeError(`particleCloud[${index}].position must contain three finite numbers`);
    }
    const weight = requirePositive(particle.mass ?? 1, `particleCloud[${index}].mass`);
    requirePositive(particle.radius ?? DEFAULT_RADIUS, `particleCloud[${index}].radius`);
    sourceMass += weight;
    center[0] += position[0] * weight;
    center[1] += position[1] * weight;
    center[2] += position[2] * weight;
  }
  center[0] /= sourceMass;
  center[1] /= sourceMass;
  center[2] /= sourceMass;

  const positions = new Float32Array(source.length * 3);
  const radii = new Float32Array(source.length);
  const masses = new Float32Array(source.length);
  const massFractions = new Float32Array(source.length);
  const tags = new Array(source.length);
  const materials = new Array(source.length);
  const inertia = new Float32Array(9);

  for (let index = 0; index < source.length; index += 1) {
    const particle = source[index];
    const offset = index * 3;
    const x = particle.position[0] - center[0];
    const y = particle.position[1] - center[1];
    const z = particle.position[2] - center[2];
    const radius = particle.radius ?? DEFAULT_RADIUS;
    const fraction = (particle.mass ?? 1) / sourceMass;
    const mass = totalMass * fraction;
    const sphereInertia = 0.4 * mass * radius * radius;

    positions[offset] = f32(x);
    positions[offset + 1] = f32(y);
    positions[offset + 2] = f32(z);
    radii[index] = f32(radius);
    masses[index] = f32(mass);
    massFractions[index] = f32(fraction);
    tags[index] = particle.tag ?? null;
    materials[index] = particle.material ?? null;

    inertia[0] = f32(inertia[0] + mass * (y * y + z * z) + sphereInertia);
    inertia[4] = f32(inertia[4] + mass * (x * x + z * z) + sphereInertia);
    inertia[8] = f32(inertia[8] + mass * (x * x + y * y) + sphereInertia);
    inertia[1] = f32(inertia[1] - mass * x * y);
    inertia[2] = f32(inertia[2] - mass * x * z);
    inertia[5] = f32(inertia[5] - mass * y * z);
  }
  inertia[3] = inertia[1];
  inertia[6] = inertia[2];
  inertia[7] = inertia[5];

  const inverseInertia = mat3Invert(inertia);
  if (inverseInertia.every((component) => component === 0)) {
    throw new RangeError('particleCloud produces a singular inertia tensor; use non-zero particle radii');
  }

  return Object.freeze({
    count: source.length,
    positions,
    radii,
    masses,
    massFractions,
    materials,
    tags,
    centerOfMass: vec3(center),
    inertia: mat3(inertia),
    inverseInertia: mat3(inverseInertia),
  });
}

export function createParticleCloud(particles) {
  const source = unpackParticles(particles);
  return Object.freeze({
    positions: new Float32Array(source.flatMap((particle) => Array.from(particle.position).slice(0, 3))),
    radii: new Float32Array(source.map((particle) => particle.radius ?? DEFAULT_RADIUS)),
    masses: new Float32Array(source.map((particle) => particle.mass ?? 1)),
    tags: source.map((particle) => particle.tag ?? null),
    materials: source.map((particle) => particle.material ?? null),
  });
}

export function createBoxParticleCloud({
  halfExtents = [0.5, 0.5, 0.5],
  radius = 0.12,
  spacing = radius * 1.8,
  shell = true,
  tag = null,
} = {}) {
  const counts = halfExtents.map((extent) => Math.max(2, Math.ceil((extent * 2) / spacing) + 1));
  const particles = [];
  for (let ix = 0; ix < counts[0]; ix += 1) {
    for (let iy = 0; iy < counts[1]; iy += 1) {
      for (let iz = 0; iz < counts[2]; iz += 1) {
        if (shell && ix > 0 && ix < counts[0] - 1
          && iy > 0 && iy < counts[1] - 1
          && iz > 0 && iz < counts[2] - 1) {
          continue;
        }
        particles.push({
          position: [
            -halfExtents[0] + (2 * halfExtents[0] * ix) / (counts[0] - 1),
            -halfExtents[1] + (2 * halfExtents[1] * iy) / (counts[1] - 1),
            -halfExtents[2] + (2 * halfExtents[2] * iz) / (counts[2] - 1),
          ],
          radius,
          mass: 1,
          tag,
        });
      }
    }
  }
  return createParticleCloud(particles);
}

export function createRingParticleCloud({
  radius = 0.34,
  tubeRadius = 0.07,
  segments = 18,
  axis = 'x',
  tag = 'tire',
} = {}) {
  if (!Number.isInteger(segments) || segments < 6) {
    throw new RangeError('ring segments must be an integer of at least 6');
  }
  const particles = [];
  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const cosine = Math.cos(angle) * radius;
    const sine = Math.sin(angle) * radius;
    const position = axis === 'x'
      ? [0, cosine, sine]
      : axis === 'y'
        ? [cosine, 0, sine]
        : [cosine, sine, 0];
    particles.push({ position, radius: tubeRadius, mass: 1, tag });
  }
  return createParticleCloud(particles);
}

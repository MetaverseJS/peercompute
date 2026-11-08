const F = Math.fround;
const EPSILON = 1e-8;

export function f32(value = 0) {
  return F(Number.isFinite(value) ? value : 0);
}

export function vec3(value = [0, 0, 0]) {
  return new Float32Array([
    f32(value[0]),
    f32(value[1]),
    f32(value[2]),
  ]);
}

export function quat(value = [0, 0, 0, 1]) {
  return quatNormalize(new Float32Array([
    f32(value[0]),
    f32(value[1]),
    f32(value[2]),
    f32(value[3] ?? 1),
  ]));
}

export function mat3(value = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
  return new Float32Array(Array.from({ length: 9 }, (_, index) => f32(value[index] ?? 0)));
}

export function vecAdd(a, b, out = vec3()) {
  out[0] = F(a[0] + b[0]);
  out[1] = F(a[1] + b[1]);
  out[2] = F(a[2] + b[2]);
  return out;
}

export function vecSub(a, b, out = vec3()) {
  out[0] = F(a[0] - b[0]);
  out[1] = F(a[1] - b[1]);
  out[2] = F(a[2] - b[2]);
  return out;
}

export function vecScale(a, scalar, out = vec3()) {
  out[0] = F(a[0] * scalar);
  out[1] = F(a[1] * scalar);
  out[2] = F(a[2] * scalar);
  return out;
}

export function vecMulAdd(a, b, scalar, out = vec3()) {
  out[0] = F(a[0] + b[0] * scalar);
  out[1] = F(a[1] + b[1] * scalar);
  out[2] = F(a[2] + b[2] * scalar);
  return out;
}

export function vecDot(a, b) {
  return F(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
}

export function vecCross(a, b, out = vec3()) {
  const x = a[1] * b[2] - a[2] * b[1];
  const y = a[2] * b[0] - a[0] * b[2];
  const z = a[0] * b[1] - a[1] * b[0];
  out[0] = F(x);
  out[1] = F(y);
  out[2] = F(z);
  return out;
}

export function vecLengthSquared(a) {
  return F(vecDot(a, a));
}

export function vecLength(a) {
  return F(Math.sqrt(Math.max(0, vecLengthSquared(a))));
}

export function vecNormalize(a, fallback = [1, 0, 0], out = vec3()) {
  const length = vecLength(a);
  if (length <= EPSILON) {
    out[0] = f32(fallback[0]);
    out[1] = f32(fallback[1]);
    out[2] = f32(fallback[2]);
    return out;
  }
  return vecScale(a, 1 / length, out);
}

export function vecClampLength(a, maximum, out = vec3()) {
  const length = vecLength(a);
  if (length <= maximum || length <= EPSILON) {
    out.set(a);
    return out;
  }
  return vecScale(a, maximum / length, out);
}

export function vecProjectOnPlane(a, normal, out = vec3()) {
  const projection = vecDot(a, normal);
  out[0] = F(a[0] - normal[0] * projection);
  out[1] = F(a[1] - normal[1] * projection);
  out[2] = F(a[2] - normal[2] * projection);
  return out;
}

export function quatNormalize(value, out = value) {
  const length = Math.hypot(value[0], value[1], value[2], value[3]);
  if (length <= EPSILON) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  out[0] = F(value[0] / length);
  out[1] = F(value[1] / length);
  out[2] = F(value[2] / length);
  out[3] = F(value[3] / length);
  if (out[3] < 0) {
    out[0] = F(-out[0]);
    out[1] = F(-out[1]);
    out[2] = F(-out[2]);
    out[3] = F(-out[3]);
  }
  return out;
}

export function quatMultiply(a, b, out = quat()) {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  const bx = b[0];
  const by = b[1];
  const bz = b[2];
  const bw = b[3];
  out[0] = F(aw * bx + ax * bw + ay * bz - az * by);
  out[1] = F(aw * by - ax * bz + ay * bw + az * bx);
  out[2] = F(aw * bz + ax * by - ay * bx + az * bw);
  out[3] = F(aw * bw - ax * bx - ay * by - az * bz);
  return out;
}

export function quatConjugate(value, out = quat()) {
  out[0] = F(-value[0]);
  out[1] = F(-value[1]);
  out[2] = F(-value[2]);
  out[3] = F(value[3]);
  return out;
}

export function quatRotate(value, point, out = vec3()) {
  const qx = value[0];
  const qy = value[1];
  const qz = value[2];
  const qw = value[3];
  const x = point[0];
  const y = point[1];
  const z = point[2];
  const tx = 2 * (qy * z - qz * y);
  const ty = 2 * (qz * x - qx * z);
  const tz = 2 * (qx * y - qy * x);
  out[0] = F(x + qw * tx + qy * tz - qz * ty);
  out[1] = F(y + qw * ty + qz * tx - qx * tz);
  out[2] = F(z + qw * tz + qx * ty - qy * tx);
  return out;
}

export function quatIntegrateWorld(value, angularVelocity, dt, out = quat()) {
  const omega = new Float32Array([
    angularVelocity[0],
    angularVelocity[1],
    angularVelocity[2],
    0,
  ]);
  const derivative = quatMultiply(omega, value, new Float32Array(4));
  out[0] = F(value[0] + derivative[0] * 0.5 * dt);
  out[1] = F(value[1] + derivative[1] * 0.5 * dt);
  out[2] = F(value[2] + derivative[2] * 0.5 * dt);
  out[3] = F(value[3] + derivative[3] * 0.5 * dt);
  return quatNormalize(out);
}

export function quatFromAxisAngle(axis, angle, out = quat()) {
  const normalized = vecNormalize(axis);
  const half = angle * 0.5;
  const sine = Math.sin(half);
  out[0] = F(normalized[0] * sine);
  out[1] = F(normalized[1] * sine);
  out[2] = F(normalized[2] * sine);
  out[3] = F(Math.cos(half));
  return quatNormalize(out);
}

export function quatToRotationVector(value, out = vec3()) {
  const normalized = quat(value);
  const sine = Math.hypot(normalized[0], normalized[1], normalized[2]);
  if (sine <= EPSILON) {
    out.fill(0);
    return out;
  }
  const angle = 2 * Math.atan2(sine, normalized[3]);
  const scale = angle / sine;
  out[0] = F(normalized[0] * scale);
  out[1] = F(normalized[1] * scale);
  out[2] = F(normalized[2] * scale);
  return out;
}

export function quatDeltaVector(from, to, out = vec3()) {
  const inverse = quatConjugate(from, new Float32Array(4));
  const delta = quatMultiply(to, inverse, new Float32Array(4));
  return quatToRotationVector(delta, out);
}

export function quatSlerp(a, b, alpha, out = quat()) {
  let bx = b[0];
  let by = b[1];
  let bz = b[2];
  let bw = b[3];
  let cosine = a[0] * bx + a[1] * by + a[2] * bz + a[3] * bw;
  if (cosine < 0) {
    cosine = -cosine;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (cosine > 0.9995) {
    out[0] = F(a[0] + alpha * (bx - a[0]));
    out[1] = F(a[1] + alpha * (by - a[1]));
    out[2] = F(a[2] + alpha * (bz - a[2]));
    out[3] = F(a[3] + alpha * (bw - a[3]));
    return quatNormalize(out);
  }
  const theta = Math.acos(Math.min(1, Math.max(-1, cosine)));
  const sine = Math.sin(theta);
  const weightA = Math.sin((1 - alpha) * theta) / sine;
  const weightB = Math.sin(alpha * theta) / sine;
  out[0] = F(a[0] * weightA + bx * weightB);
  out[1] = F(a[1] * weightA + by * weightB);
  out[2] = F(a[2] * weightA + bz * weightB);
  out[3] = F(a[3] * weightA + bw * weightB);
  return quatNormalize(out);
}

export function quatToMat3(value, out = mat3()) {
  const x = value[0];
  const y = value[1];
  const z = value[2];
  const w = value[3];
  const xx = x * x;
  const yy = y * y;
  const zz = z * z;
  const xy = x * y;
  const xz = x * z;
  const yz = y * z;
  const wx = w * x;
  const wy = w * y;
  const wz = w * z;
  out[0] = F(1 - 2 * (yy + zz));
  out[1] = F(2 * (xy - wz));
  out[2] = F(2 * (xz + wy));
  out[3] = F(2 * (xy + wz));
  out[4] = F(1 - 2 * (xx + zz));
  out[5] = F(2 * (yz - wx));
  out[6] = F(2 * (xz - wy));
  out[7] = F(2 * (yz + wx));
  out[8] = F(1 - 2 * (xx + yy));
  return out;
}

export function mat3MulVec(matrix, value, out = vec3()) {
  const x = value[0];
  const y = value[1];
  const z = value[2];
  out[0] = F(matrix[0] * x + matrix[1] * y + matrix[2] * z);
  out[1] = F(matrix[3] * x + matrix[4] * y + matrix[5] * z);
  out[2] = F(matrix[6] * x + matrix[7] * y + matrix[8] * z);
  return out;
}

export function mat3Transpose(value, out = mat3()) {
  out[0] = value[0];
  out[1] = value[3];
  out[2] = value[6];
  out[3] = value[1];
  out[4] = value[4];
  out[5] = value[7];
  out[6] = value[2];
  out[7] = value[5];
  out[8] = value[8];
  return out;
}

export function mat3Multiply(a, b, out = mat3()) {
  const result = new Float32Array(9);
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      result[row * 3 + column] = F(
        a[row * 3] * b[column]
        + a[row * 3 + 1] * b[column + 3]
        + a[row * 3 + 2] * b[column + 6],
      );
    }
  }
  out.set(result);
  return out;
}

export function mat3Invert(value, out = mat3()) {
  const a = value[0];
  const b = value[1];
  const c = value[2];
  const d = value[3];
  const e = value[4];
  const f = value[5];
  const g = value[6];
  const h = value[7];
  const i = value[8];
  const A = e * i - f * h;
  const B = c * h - b * i;
  const C = b * f - c * e;
  const D = f * g - d * i;
  const E = a * i - c * g;
  const Fcofactor = c * d - a * f;
  const G = d * h - e * g;
  const H = b * g - a * h;
  const I = a * e - b * d;
  const determinant = a * A + b * D + c * G;
  if (Math.abs(determinant) <= EPSILON) {
    out.fill(0);
    return out;
  }
  const inverse = 1 / determinant;
  out[0] = F(A * inverse);
  out[1] = F(B * inverse);
  out[2] = F(C * inverse);
  out[3] = F(D * inverse);
  out[4] = F(E * inverse);
  out[5] = F(Fcofactor * inverse);
  out[6] = F(G * inverse);
  out[7] = F(H * inverse);
  out[8] = F(I * inverse);
  return out;
}

// R * I * R^T. This order is important for a body-local tensor in world space.
export function rotateTensor(localTensor, orientation, out = mat3()) {
  const rotation = quatToMat3(orientation);
  const transpose = mat3Transpose(rotation);
  return mat3Multiply(mat3Multiply(rotation, localTensor), transpose, out);
}

export function finiteArray(value) {
  return value.every((component) => Number.isFinite(component));
}

export function orthogonalTangent(normal, out = vec3()) {
  const reference = Math.abs(normal[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  return vecNormalize(vecCross(reference, normal), [1, 0, 0], out);
}

export const MATH_EPSILON = EPSILON;

/**
 * Math utilities for WebGPU Physics (Vec3, Vec4, Quat, Mat3)
 */

export class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.data = new Float32Array([x, y, z]);
  }

  get x() { return this.data[0]; }
  set x(v) { this.data[0] = v; }
  get y() { return this.data[1]; }
  set y(v) { this.data[1] = v; }
  get z() { return this.data[2]; }
  set z(v) { this.data[2] = v; }

  set(x, y, z) {
    this.data[0] = x;
    this.data[1] = y;
    this.data[2] = z;
    return this;
  }

  copy(v) {
    this.data[0] = v.data[0];
    this.data[1] = v.data[1];
    this.data[2] = v.data[2];
    return this;
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  add(v) {
    this.data[0] += v.data[0];
    this.data[1] += v.data[1];
    this.data[2] += v.data[2];
    return this;
  }

  sub(v) {
    this.data[0] -= v.data[0];
    this.data[1] -= v.data[1];
    this.data[2] -= v.data[2];
    return this;
  }

  scale(s) {
    this.data[0] *= s;
    this.data[1] *= s;
    this.data[2] *= s;
    return this;
  }

  dot(v) {
    return this.data[0] * v.data[0] + this.data[1] * v.data[1] + this.data[2] * v.data[2];
  }

  cross(v) {
    const ax = this.data[0], ay = this.data[1], az = this.data[2];
    const bx = v.data[0], by = v.data[1], bz = v.data[2];
    this.data[0] = ay * bz - az * by;
    this.data[1] = az * bx - ax * bz;
    this.data[2] = ax * by - ay * bx;
    return this;
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  lengthSq() {
    return this.dot(this);
  }

  normalize() {
    const len = this.length();
    if (len > 0) this.scale(1 / len);
    return this;
  }

  static cross(a, b, out = new Vec3()) {
    out.data[0] = a.y * b.z - a.z * b.y;
    out.data[1] = a.z * b.x - a.x * b.z;
    out.data[2] = a.x * b.y - a.y * b.x;
    return out;
  }

  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
}

export class Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.data = new Float32Array([x, y, z, w]);
  }

  get x() { return this.data[0]; }
  set x(v) { this.data[0] = v; }
  get y() { return this.data[1]; }
  set y(v) { this.data[1] = v; }
  get z() { return this.data[2]; }
  set z(v) { this.data[2] = v; }
  get w() { return this.data[3]; }
  set w(v) { this.data[3] = v; }

  set(x, y, z, w) {
    this.data[0] = x;
    this.data[1] = y;
    this.data[2] = z;
    this.data[3] = w;
    return this;
  }

  copy(v) {
    this.data[0] = v.data[0];
    this.data[1] = v.data[1];
    this.data[2] = v.data[2];
    this.data[3] = v.data[3];
    return this;
  }

  clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }
}

export class Quat {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.data = new Float32Array([x, y, z, w]);
  }

  get x() { return this.data[0]; }
  set x(v) { this.data[0] = v; }
  get y() { return this.data[1]; }
  set y(v) { this.data[1] = v; }
  get z() { return this.data[2]; }
  set z(v) { this.data[2] = v; }
  get w() { return this.data[3]; }
  set w(v) { this.data[3] = v; }

  set(x, y, z, w) {
    this.data[0] = x;
    this.data[1] = y;
    this.data[2] = z;
    this.data[3] = w;
    return this;
  }

  copy(q) {
    this.data[0] = q.data[0];
    this.data[1] = q.data[1];
    this.data[2] = q.data[2];
    this.data[3] = q.data[3];
    return this;
  }

  clone() {
    return new Quat(this.x, this.y, this.z, this.w);
  }

  identity() {
    return this.set(0, 0, 0, 1);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  normalize() {
    const len = this.length();
    if (len > 0) {
      const invLen = 1 / len;
      this.data[0] *= invLen;
      this.data[1] *= invLen;
      this.data[2] *= invLen;
      this.data[3] *= invLen;
    }
    return this;
  }

  integrate(angularVelocity, dt) {
    const halfDt = dt * 0.5;
    const wx = angularVelocity.x;
    const wy = angularVelocity.y;
    const wz = angularVelocity.z;

    this.data[0] += halfDt * (wx * this.w + wy * this.z - wz * this.y);
    this.data[1] += halfDt * (wy * this.w + wz * this.x - wx * this.z);
    this.data[2] += halfDt * (wz * this.w + wx * this.y - wy * this.x);
    this.data[3] += halfDt * (-wx * this.x - wy * this.y - wz * this.z);

    return this.normalize();
  }

  applyToVec3(v, out = new Vec3()) {
    const x = v.x, y = v.y, z = v.z;
    const qx = this.x, qy = this.y, qz = this.z, qw = this.w;

    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    out.data[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out.data[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out.data[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
  }

  setFromAxisAngle(axis, angle) {
    const halfAngle = angle * 0.5;
    const s = Math.sin(halfAngle);
    this.data[0] = axis.x * s;
    this.data[1] = axis.y * s;
    this.data[2] = axis.z * s;
    this.data[3] = Math.cos(halfAngle);
    return this;
  }

  multiply(q) {
    const ax = this.x, ay = this.y, az = this.z, aw = this.w;
    const bx = q.x, by = q.y, bz = q.z, bw = q.w;

    this.data[0] = ax * bw + aw * bx + ay * bz - az * by;
    this.data[1] = ay * bw + aw * by + az * bx - ax * bz;
    this.data[2] = az * bw + aw * bz + ax * by - ay * bx;
    this.data[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }

  static slerp(a, b, t, out = new Quat()) {
    let d = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    let bx = b.x, by = b.y, bz = b.z, bw = b.w;
    if (d < 0) {
      bx = -bx; by = -by; bz = -bz; bw = -bw;
      d = -d;
    }

    if (d > 0.9995) {
      out.data[0] = a.x + t * (bx - a.x);
      out.data[1] = a.y + t * (by - a.y);
      out.data[2] = a.z + t * (bz - a.z);
      out.data[3] = a.w + t * (bw - a.w);
      return out.normalize();
    }

    const theta0 = Math.acos(d);
    const theta = theta0 * t;
    const sinTheta = Math.sin(theta);
    const sinTheta0 = Math.sin(theta0);

    const s0 = Math.cos(theta) - d * sinTheta / sinTheta0;
    const s1 = sinTheta / sinTheta0;

    out.data[0] = a.x * s0 + bx * s1;
    out.data[1] = a.y * s0 + by * s1;
    out.data[2] = a.z * s0 + bz * s1;
    out.data[3] = a.w * s0 + bw * s1;
    return out;
  }
}

export class Mat3 {
  constructor() {
    this.data = new Float32Array(9);
    this.identity();
  }

  identity() {
    this.data.fill(0);
    this.data[0] = 1;
    this.data[4] = 1;
    this.data[8] = 1;
    return this;
  }

  fromQuat(q) {
    const x = q.x, y = q.y, z = q.z, w = q.w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    // Column-major layout
    this.data[0] = 1 - (yy + zz);
    this.data[1] = xy + wz;
    this.data[2] = xz - wy;

    this.data[3] = xy - wz;
    this.data[4] = 1 - (xx + zz);
    this.data[5] = yz + wx;

    this.data[6] = xz + wy;
    this.data[7] = yz - wx;
    this.data[8] = 1 - (xx + yy);
    return this;
  }

  transpose() {
    const m = this.data;
    let tmp;
    tmp = m[1]; m[1] = m[3]; m[3] = tmp;
    tmp = m[2]; m[2] = m[6]; m[6] = tmp;
    tmp = m[5]; m[5] = m[7]; m[7] = tmp;
    return this;
  }

  multiply(b) {
    const a = this.data;
    const ae = [...a];
    const be = b.data;

    a[0] = ae[0] * be[0] + ae[3] * be[1] + ae[6] * be[2];
    a[1] = ae[1] * be[0] + ae[4] * be[1] + ae[7] * be[2];
    a[2] = ae[2] * be[0] + ae[5] * be[1] + ae[8] * be[2];

    a[3] = ae[0] * be[3] + ae[3] * be[4] + ae[6] * be[5];
    a[4] = ae[1] * be[3] + ae[4] * be[4] + ae[7] * be[5];
    a[5] = ae[2] * be[3] + ae[5] * be[4] + ae[8] * be[5];

    a[6] = ae[0] * be[6] + ae[3] * be[7] + ae[6] * be[8];
    a[7] = ae[1] * be[6] + ae[4] * be[7] + ae[7] * be[8];
    a[8] = ae[2] * be[6] + ae[5] * be[7] + ae[8] * be[8];
    return this;
  }

  applyToVec3(v, out = new Vec3()) {
    const m = this.data;
    const x = v.x, y = v.y, z = v.z;
    out.data[0] = m[0] * x + m[3] * y + m[6] * z;
    out.data[1] = m[1] * x + m[4] * y + m[7] * z;
    out.data[2] = m[2] * x + m[5] * y + m[8] * z;
    return out;
  }

  setDiagonal(v) {
    this.data.fill(0);
    this.data[0] = v.x;
    this.data[4] = v.y;
    this.data[8] = v.z;
    return this;
  }

  clone() {
    const m = new Mat3();
    m.data.set(this.data);
    return m;
  }
}

export function computeWorldInverseInertia(q, invInertia, out = new Mat3()) {
  const R = new Mat3().fromQuat(q);
  const I = new Mat3().setDiagonal(invInertia);
  const RT = R.clone().transpose();

  // invI_world = R^T * I * R
  out.data.set(RT.multiply(I).multiply(R).data);
  return out;
}

export function calculateBoxInertia(mass, extents) {
  const c = (1 / 12) * mass;
  const ex = 2 * extents.x;
  const ey = 2 * extents.y;
  const ez = 2 * extents.z;
  return new Vec3(
    c * (ey * ey + ez * ez),
    c * (ex * ex + ez * ez),
    c * (ex * ex + ey * ey)
  );
}

export function calculateCloudInertia(mass, particles) {
  // particles is array of [x,y,z]
  const particleMass = mass / particles.length;
  let Ixx = 0, Iyy = 0, Izz = 0;
  for (const p of particles) {
    const x = p[0], y = p[1], z = p[2];
    Ixx += particleMass * (y * y + z * z);
    Iyy += particleMass * (x * x + z * z);
    Izz += particleMass * (x * x + y * y);
  }
  return new Vec3(Ixx, Iyy, Izz);
}

export function calculateSphereInertia(mass, radius) {
  const i = (2 / 5) * mass * radius * radius;
  return new Vec3(i, i, i);
}

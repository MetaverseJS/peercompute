// Minimal orbit-style camera (no deps)
class OrbitCamera {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.target = opts.target || [0, 0.5, 0];
    this.radius = opts.radius || 14;
    this.minRadius = opts.minRadius || 2;
    this.maxRadius = opts.maxRadius || 800; // Increased
    this.theta = opts.theta || 0; // yaw
    this.phi = opts.phi || Math.PI / 4; // pitch
    this.rotateSpeed = opts.rotateSpeed || 0.005;
    this.zoomSpeed = opts.zoomSpeed || 0.0015;
    this.panSpeed = opts.panSpeed || 0.001;

    this._dragging = false;
    this._dragButton = 0; // 0: left, 1: middle, 2: right
    this._last = [0, 0];

    this._initEvents();
  }

  _initEvents() {
    this.canvas.addEventListener("pointerdown", (e) => {
      this._dragging = true;
      this._dragButton = e.button;
      this._last = [e.clientX, e.clientY];
      this.canvas.setPointerCapture(e.pointerId);
      e.preventDefault(); // Prevent context menu? No, need contextmenu event
    });
    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault(); // Prevent context menu on right click
    });
    this.canvas.addEventListener("pointerup", (e) => {
      this._dragging = false;
      this.canvas.releasePointerCapture(e.pointerId);
    });
    this.canvas.addEventListener("pointermove", (e) => {
      if (!this._dragging) return;
      const dx = e.clientX - this._last[0];
      const dy = e.clientY - this._last[1];
      this._last = [e.clientX, e.clientY];

      if (this._dragButton === 0) {
        // Orbit (Left click)
        this.theta -= dx * this.rotateSpeed;
        this.phi -= dy * this.rotateSpeed;
        const eps = 0.001;
        this.phi = Math.max(eps, Math.min(Math.PI - eps, this.phi));
      } else if (this._dragButton === 1 || this._dragButton === 2) {
        // Pan (Middle or Right click)
        this.pan(-dx, dy); // Drag scene
      }
    });
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const factor = Math.exp(e.deltaY * this.zoomSpeed);
      this.radius = Math.min(this.maxRadius, Math.max(this.minRadius, this.radius * factor));
    }, { passive: false });
  }

  pan(dx, dy) {
    // Compute camera basis vectors based on current angles
    // z points from target to eye
    const zx = Math.sin(this.phi) * Math.sin(this.theta);
    const zy = Math.cos(this.phi);
    const zz = Math.sin(this.phi) * Math.cos(this.theta);
    const z = [zx, zy, zz]; // Normalized because phi/theta are spherical

    // x = cross(up, z)
    const up = [0, 1, 0];
    let xx = up[1]*z[2] - up[2]*z[1];
    let xy = up[2]*z[0] - up[0]*z[2];
    let xz = up[0]*z[1] - up[1]*z[0];
    const lenX = Math.hypot(xx, xy, xz);
    if (lenX > 0.0001) {
      xx/=lenX; xy/=lenX; xz/=lenX;
    }

    // y = cross(z, x)
    let yx = z[1]*xz - z[2]*xy;
    let yy = z[2]*xx - z[0]*xz;
    let yz = z[0]*xy - z[1]*xx;

    // Pan speed scaled by radius distance
    const speed = this.panSpeed * this.radius;
    
    this.target[0] += (xx * dx + yx * dy) * speed;
    this.target[1] += (xy * dx + yy * dy) * speed;
    this.target[2] += (xz * dx + yz * dy) * speed;
  }

  setTarget(target) {
    this.target = [...target];
  }

  setRadius(radius) {
    this.radius = Math.min(this.maxRadius, Math.max(this.minRadius, radius));
  }

  getViewProj(aspect) {
    const fov = Math.PI / 4;
    const near = 0.1;
    const far = 1000;
    const f = 1 / Math.tan(fov / 2);
    const proj = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, far / (near - far), -1,
      0, 0, far * near / (near - far), 0,
    ]);

    const cx = Math.sin(this.phi) * Math.sin(this.theta) * this.radius + this.target[0];
    const cy = Math.cos(this.phi) * this.radius + this.target[1];
    const cz = Math.sin(this.phi) * Math.cos(this.theta) * this.radius + this.target[2];
    const eye = [cx, cy, cz];
    const view = this.lookAt(eye, this.target, [0, 1, 0]);
    // Note: multiplyMat4ColumnMajor(a, b) computes b * a.
    // We want proj * view, so we pass (view, proj).
    return this.multiplyMat4ColumnMajor(view, proj);
  }

  getMatrices(aspect) {
    const fov = Math.PI / 4;
    const near = 0.1;
    const far = 1000;
    const f = 1 / Math.tan(fov / 2);
    const proj = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, far / (near - far), -1,
      0, 0, far * near / (near - far), 0,
    ]);

    const cx = Math.sin(this.phi) * Math.sin(this.theta) * this.radius + this.target[0];
    const cy = Math.cos(this.phi) * this.radius + this.target[1];
    const cz = Math.sin(this.phi) * Math.cos(this.theta) * this.radius + this.target[2];
    const eye = [cx, cy, cz];
    const view = this.lookAt(eye, this.target, [0, 1, 0]);
    const viewProj = this.multiplyMat4ColumnMajor(view, proj);
    const invView = this.invertMat4(view);
    const invProj = this.invertMat4(proj);

    return {
        view,
        proj,
        viewProj,
        invView,
        invProj,
        eye
    };
  }

  lookAt(eye, target, up) {
    const z = this.normalize([
      eye[0] - target[0],
      eye[1] - target[1],
      eye[2] - target[2],
    ]);
    const x = this.normalize(this.cross(up, z));
    const y = this.cross(z, x);
    return new Float32Array([
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -this.dot(x, eye), -this.dot(y, eye), -this.dot(z, eye), 1,
    ]);
  }

  normalize(v) {
    const len = Math.hypot(v[0], v[1], v[2]);
    return len > 0 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
  }
  cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }
  dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  multiplyMat4ColumnMajor(a, b) {
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[i + j * 4] =
          a[0 + j * 4] * b[i + 0 * 4] +
          a[1 + j * 4] * b[i + 1 * 4] +
          a[2 + j * 4] * b[i + 2 * 4] +
          a[3 + j * 4] * b[i + 3 * 4];
      }
    }
    return out;
  }

  invertMat4(m) {
    const inv = new Float32Array(16);
    const det = 
      m[0] * (m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10]) +
      m[4] * (m[1] * m[11] * m[14] - m[1] * m[10] * m[15] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10]) +
      m[8] * (m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6]) +
      m[12] * (m[1] * m[7] * m[10] - m[1] * m[6] * m[11] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6]);

    if (det === 0) return m; // or identity?

    const invDet = 1.0 / det;

    inv[0] = (m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10]) * invDet;
    inv[1] = (m[1] * m[11] * m[14] - m[1] * m[10] * m[15] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10]) * invDet;
    inv[2] = (m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6]) * invDet;
    inv[3] = (m[1] * m[7] * m[10] - m[1] * m[6] * m[11] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6]) * invDet;
    inv[4] = (m[4] * m[11] * m[14] - m[4] * m[10] * m[15] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10]) * invDet;
    inv[5] = (m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10]) * invDet;
    inv[6] = (m[0] * m[7] * m[14] - m[0] * m[6] * m[15] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6]) * invDet;
    inv[7] = (m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6]) * invDet;
    inv[8] = (m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9]) * invDet;
    inv[9] = (m[0] * m[11] * m[13] - m[0] * m[9] * m[15] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9]) * invDet;
    inv[10] = (m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[5] * m[3]) * invDet;
    inv[11] = (m[0] * m[7] * m[9] - m[0] * m[5] * m[11] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[5] * m[3]) * invDet;
    inv[12] = (m[4] * m[10] * m[13] - m[4] * m[9] * m[14] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9]) * invDet;
    inv[13] = (m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9]) * invDet;
    inv[14] = (m[0] * m[6] * m[13] - m[0] * m[5] * m[14] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5]) * invDet;
    inv[15] = (m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5]) * invDet;

    return inv;
  }
}

export { OrbitCamera };

import * as Cesium from 'cesium';

const METERS_PER_DEGREE_LAT = 111320;
const DEG2RAD = Math.PI / 180;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isFiniteNumber(value) {
  return Number.isFinite(value);
}

export class WindLayer {
  constructor(viewer, canvas, { onStatus } = {}) {
    this.viewer = viewer;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onStatus = onStatus || (() => {});

    this.levels = [];
    this.grid = null;
    this.range = { minIndex: 0, maxIndex: 0 };
    this.particles = [];
    // Dense field with very long-lived particles for map-covering paths
    this.particleCount = 500;
    this.maxAge = 500;
    this.speedScale = 1000;
    // Minimal fade so long strokes persist
    this.fadeStrength = 0.1;
    // Run multiple integration steps per frame to draw long segments
    this.stepsPerFrame = 1;

    this.running = false;
    this.lastTime = 0;

    this._scratchCartesian = new Cesium.Cartesian3();
    this._scratchCanvasA = new Cesium.Cartesian2();
    this._scratchCanvasB = new Cesium.Cartesian2();
    this._scratchDiff = new Cesium.Cartesian3();

    this.resize();
    this.viewer.camera.moveStart.addEventListener(() => this.clear());
    window.addEventListener('resize', () => this.resize());
  }

  setData(levels) {
    if (!Array.isArray(levels) || levels.length === 0) {
      this.levels = [];
      this.grid = null;
      this.clear();
      this.onStatus('wind: no gridded levels found', true);
      return null;
    }

    const cleaned = levels
      .filter((lvl) => lvl && isFiniteNumber(lvl.level) && lvl.u && lvl.v)
      .sort((a, b) => b.level - a.level);

    if (cleaned.length === 0) {
      this.levels = [];
      this.grid = null;
      this.clear();
      this.onStatus('wind: no valid U/V fields', true);
      return null;
    }

    const base = cleaned[0];
    if (!base.lon || !base.lat || !base.nx || !base.ny) {
      this.levels = [];
      this.grid = null;
      this.clear();
      this.onStatus('wind: missing grid metadata', true);
      return null;
    }

    const nx = base.nx;
    const ny = base.ny;
    const lon0 = base.lon[0];
    const lon1 = base.lon[1];
    const lat0 = base.lat[0];
    const lat1 = base.lat[1];
    const lov = base.lov;

    const dx = (lon1 - lon0) / (nx - 1);
    const dy = (lat1 - lat0) / (ny - 1);

    if (!isFiniteNumber(dx) || !isFiniteNumber(dy) || dx === 0 || dy === 0) {
      this.levels = [];
      this.grid = null;
      this.clear();
      this.onStatus('wind: invalid grid step', true);
      return null;
    }

    const lonMin = Math.min(lon0, lon1);
    const lonMax = Math.max(lon0, lon1);
    const latMin = Math.min(lat0, lat1);
    const latMax = Math.max(lat0, lat1);

    this.levels = cleaned.filter((lvl) => lvl.nx === nx && lvl.ny === ny);
    this.grid = {
      nx,
      ny,
      lon0,
      lat0,
      dx,
      dy,
      lonMin,
      lonMax,
      latMin,
      latMax,
      wrapLongitude: lonMin >= 0 && lonMax > 180,
      lov
    };

    this.range = { minIndex: 0, maxIndex: this.levels.length - 1 };
    this.seedParticles();
    this.clear();
    this.onStatus(`wind: ${this.levels.length} levels ready`);
    return this.levels.map((lvl) => lvl.level);
  }

  setAltitudeRange(minIndex, maxIndex) {
    if (!this.levels.length) return;
    const min = clamp(minIndex, 0, this.levels.length - 1);
    const max = clamp(maxIndex, min, this.levels.length - 1);
    this.range = { minIndex: min, maxIndex: max };
    this.seedParticles();
    this.clear();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.renderFrame(t));
  }

  stop() {
    this.running = false;
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const { clientWidth, clientHeight } = this.canvas;
    this.canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
    this.canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const density = clientWidth * clientHeight;
    const target = Math.round(density / 160);
    this.particleCount = clamp(target, 4000, 12000);
    this.seedParticles();
    this.clear();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
  }

  renderFrame(time) {
    if (!this.running) return;
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    if (this.levels.length && this.grid) {
      this.evolve(dt);
    }

    requestAnimationFrame((t) => this.renderFrame(t));
  }

  evolve(dt) {
    const ctx = this.ctx;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    // Fade slightly each frame, then add bright strokes
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = `rgba(0, 0, 0, ${1 - this.fadeStrength})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';

    const steps = Math.max(1, Math.floor(this.stepsPerFrame));
    const subDt = dt / steps;
    for (let s = 0; s < steps; s += 1) {
      for (const particle of this.particles) {
        this.advanceParticle(particle, subDt);
      }
    }
  }

  advanceParticle(particle, dt) {
    const sample = this.sampleWind(particle.lon, particle.lat, particle.levelIndex);
    if (!sample) {
      this.respawn(particle);
      return;
    }

    const { u, v, speed, hgt } = sample;
    const mPerDegLon = METERS_PER_DEGREE_LAT * Math.cos(particle.lat * DEG2RAD);
    const dLat = (v * this.speedScale * dt) / METERS_PER_DEGREE_LAT;
    const dLon = mPerDegLon ? (u * this.speedScale * dt) / mPerDegLon : 0;
    const nextLat = particle.lat + dLat;
    const nextLon = particle.lon + dLon;

    if (!this.inBounds(nextLon, nextLat)) {
      this.respawn(particle);
      return;
    }

    const startOk = this.projectToCanvas(particle.lon, particle.lat, hgt, this._scratchCanvasA);
    const endOk = this.projectToCanvas(nextLon, nextLat, hgt, this._scratchCanvasB);

    if (startOk && endOk) {
      this.ctx.strokeStyle = this.colorForSpeed(speed);
      this.ctx.beginPath();
      this.ctx.moveTo(this._scratchCanvasA.x, this._scratchCanvasA.y);
      this.ctx.lineTo(this._scratchCanvasB.x, this._scratchCanvasB.y);
      this.ctx.stroke();
    }

    particle.lon = nextLon;
    particle.lat = nextLat;
    particle.age += 1;

    if (particle.age > particle.life) {
      this.respawn(particle);
    }
  }

  seedParticles() {
    if (!this.grid || !this.levels.length) return;
    this.particles = [];
    for (let i = 0; i < this.particleCount; i += 1) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const { lonMin, lonMax, latMin, latMax } = this.grid;
    const minIndex = this.range.minIndex;
    const maxIndex = this.range.maxIndex;
    const levelIndex = Math.floor(minIndex + Math.random() * (maxIndex - minIndex + 1));
    return {
      lon: lonMin + Math.random() * (lonMax - lonMin),
      lat: latMin + Math.random() * (latMax - latMin),
      age: Math.random() * this.maxAge,
      life: this.maxAge + Math.random() * this.maxAge,
      levelIndex
    };
  }

  respawn(particle) {
    const fresh = this.createParticle();
    particle.lon = fresh.lon;
    particle.lat = fresh.lat;
    particle.age = fresh.age;
    particle.life = fresh.life;
    particle.levelIndex = fresh.levelIndex;
  }

  sampleWind(lon, lat, levelIndex) {
    if (!this.grid || !this.levels[levelIndex]) return null;

    const { lon0, lat0, dx, dy, nx, ny, wrapLongitude, lov } = this.grid;
    let lonSample = lon;
    if (wrapLongitude && lonSample < 0) {
      lonSample += 360;
    }

    const x = (lonSample - lon0) / dx;
    const y = (lat - lat0) / dy;

    if (x < 0 || y < 0 || x >= nx - 1 || y >= ny - 1) {
      return null;
    }

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const fx = x - x0;
    const fy = y - y0;

    const level = this.levels[levelIndex];
    const uData = level.u;
    const vData = level.v;
    const hData = level.hgt;
    const idx00 = y0 * nx + x0;
    const idx10 = y0 * nx + x1;
    const idx01 = y1 * nx + x0;
    const idx11 = y1 * nx + x1;

    const u00 = uData[idx00];
    const u10 = uData[idx10];
    const u01 = uData[idx01];
    const u11 = uData[idx11];
    const v00 = vData[idx00];
    const v10 = vData[idx10];
    const v01 = vData[idx01];
    const v11 = vData[idx11];

    if (
      !isFiniteNumber(u00) ||
      !isFiniteNumber(u10) ||
      !isFiniteNumber(u01) ||
      !isFiniteNumber(u11) ||
      !isFiniteNumber(v00) ||
      !isFiniteNumber(v10) ||
      !isFiniteNumber(v01) ||
      !isFiniteNumber(v11)
    ) {
      return null;
    }

    const u0 = u00 * (1 - fx) + u10 * fx;
    const u1 = u01 * (1 - fx) + u11 * fx;
    const v0 = v00 * (1 - fx) + v10 * fx;
    const v1 = v01 * (1 - fx) + v11 * fx;
    const u = u0 * (1 - fy) + u1 * fy;
    const v = v0 * (1 - fy) + v1 * fy;

    let hgt = 0;
    if (hData) {
      const h00 = hData[idx00];
      const h10 = hData[idx10];
      const h01 = hData[idx01];
      const h11 = hData[idx11];
      if (
        isFiniteNumber(h00) &&
        isFiniteNumber(h10) &&
        isFiniteNumber(h01) &&
        isFiniteNumber(h11)
      ) {
        const h0 = h00 * (1 - fx) + h10 * fx;
        const h1 = h01 * (1 - fx) + h11 * fx;
        hgt = h0 * (1 - fy) + h1 * fy;
      }
    }

    // Rotate from grid-relative to earth-relative using polar stereographic grid convergence
    const dLon = ((lonSample - (lov ?? 0) + 540) % 360) - 180;
    const gamma = dLon * DEG2RAD;
    const cosG = Math.cos(gamma);
    const sinG = Math.sin(gamma);
    const uEarth = u * cosG - v * sinG;
    const vEarth = u * sinG + v * cosG;

    return { u: uEarth, v: vEarth, speed: Math.hypot(uEarth, vEarth), hgt };
  }

  inBounds(lon, lat) {
    const { lonMin, lonMax, latMin, latMax } = this.grid;
    return lon >= lonMin && lon <= lonMax && lat >= latMin && lat <= latMax;
  }

  projectToCanvas(lon, lat, heightMeters, out) {
    if (!this.grid) return false;
    const lonForCesium = this.grid.wrapLongitude && lon > 180 ? lon - 360 : lon;
    const h = Number.isFinite(heightMeters) ? heightMeters : 0;
    Cesium.Cartesian3.fromDegrees(lonForCesium, lat, h, Cesium.Ellipsoid.WGS84, this._scratchCartesian);

    // Horizon/occlusion cull
    const cameraPosition = this.viewer.camera.positionWC;
    const occluder = new Cesium.EllipsoidalOccluder(this.viewer.scene.globe.ellipsoid, cameraPosition);
    if (!occluder.isPointVisible(this._scratchCartesian)) {
      return false;
    }

    // Behind-camera cull
    Cesium.Cartesian3.subtract(this._scratchCartesian, cameraPosition, this._scratchDiff);
    if (Cesium.Cartesian3.dot(this._scratchDiff, this.viewer.camera.directionWC) < 0) {
      return false;
    }

    const canvasPos = this.viewer.scene.cartesianToCanvasCoordinates(this._scratchCartesian, out);
    return Boolean(canvasPos);
  }

  colorForSpeed(speed) {
    // Deep pink with slight alpha so overlaps glow
    return 'rgba(220, 40, 150, 0.95)';
  }
}

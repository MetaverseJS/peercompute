import * as THREE from 'three';
import { DEFAULT_WORLD_THEME, normalizeWorldTheme } from '../world/themes.js';

const MOON_FLOOR_SEGMENTS = 120;
const MOON_CRATER_COUNT = 36;
const MOON_CRATER_SPREAD = 4200;
const MOON_ROCK_COUNT = 90;
const JUNGLE_TREE_SPRITE_COUNT = 320;
const IRELAND_COW_SPRITE_COUNT = 28;
const TRON_TRAIL_SEGMENT_POOL = 12;
const MOON_DUST_PUFF_POOL = 20;
const PLAYER_HALF_HEIGHT = 3;
const MOON_LANDING_AIRBORNE_HEIGHT = 0.85;
const MOON_LANDING_GROUNDED_TOLERANCE = 0.35;
const MOON_LANDING_POOF_COOLDOWN = 0.22;
const PLAYER_VIDEO_FACE_LOCAL_REAR = 4;
const PLAYER_VIDEO_FACE_REMOTE_FRONT = 5;
const IRELAND_RAIN_DROP_COUNT = 480;
const IRELAND_RAIN_RADIUS = 110;
const WORLD_DECOR_STREAM_CHUNK = 140;
const WORLD_DECOR_RADIUS_BY_THEME = Object.freeze({
  moon: 620,
  jungle: 620,
  ireland: 620
});

export class TronScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.players = new Map();
    this.pendingVideoStreams = new Map();
    this.localPlayerId = null;
    this.gridSize = 1000;
    this.worldThemeId = DEFAULT_WORLD_THEME;
    this.floor = null;
    this.floorGeometry = null;
    this.skyDome = null;
    this.ambientLight = null;
    this.sunLight = null;
    this.worldDecorGroup = null;
    this._moonCraters = this._buildMoonCraterField();
    this._moonRockGeometry = null;
    this._tronTrailSegmentGeometry = null;
    this._moonDustGeometry = null;
    this.weatherFxGroup = null;
    this._irelandRain = null;
    this._worldDecorStreamKey = '';
    this._terrainNormalScratch = new THREE.Vector3();
    this._terrainForwardScratch = new THREE.Vector3();
    this._terrainRightScratch = new THREE.Vector3();
    this._terrainTangentXScratch = new THREE.Vector3();
    this._terrainTangentZScratch = new THREE.Vector3();
    this._terrainBasisScratch = new THREE.Matrix4();
    this._effectLastUpdateTime = performance.now();
    
    this.init();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000428);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 20, 30);
    this.camera.lookAt(0, 0, 0);

    // Create renderer with XR support
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true; // Enable WebXR
    this.container.appendChild(this.renderer.domElement);

    // WebXR state
    this.vrControllers = [];
    this.vrControllerGrips = [];
    this.vrMode = false;
    this.vrPlayerOffset = new THREE.Vector3();
    
    // Create camera rig for VR
    this.cameraRig = new THREE.Group();
    this.cameraRig.add(this.camera);
    this.scene.add(this.cameraRig);

    // Setup VR controllers
    this.setupVRControllers();

    // Add theme-tunable lights
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.sunLight.position.set(180, 240, 80);
    this.scene.add(this.sunLight);

    // Create themed world visuals
    this.setWorldTheme(this.worldThemeId);
    this._ensureWorldDecorGroup();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  _rand01(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
    return x - Math.floor(x);
  }

  _hashUint32(value) {
    let x = value | 0;
    x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
    x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
    return (x ^ (x >>> 16)) >>> 0;
  }

  _hash2D(ix, iz, salt = 0) {
    const mixed =
      Math.imul(ix | 0, 0x1f123bb5) ^
      Math.imul(iz | 0, 0x5f356495) ^
      Math.imul(salt | 0, 0x45d9f3b);
    return this._hashUint32(mixed);
  }

  _coordRand01(ix, iz, salt = 0) {
    return this._hash2D(ix, iz, salt) / 4294967296;
  }

  _coordRandSigned(ix, iz, salt = 0) {
    return this._coordRand01(ix, iz, salt) * 2 - 1;
  }

  _themeHasWorldDecor(themeId = this.worldThemeId) {
    return themeId === 'moon' || themeId === 'jungle' || themeId === 'ireland';
  }

  _getWorldDecorStreamRadius(themeId = this.worldThemeId) {
    return WORLD_DECOR_RADIUS_BY_THEME[themeId] || 0;
  }

  _getWorldDecorAnchorSource() {
    if (this.localPlayerId) {
      const localPlayer = this.players.get(this.localPlayerId);
      if (localPlayer) return localPlayer;
    }
    return null;
  }

  _getSkyAnchorSource() {
    return this._getWorldDecorAnchorSource() || this.camera;
  }

  _getWorldDecorBounds(themeId = this.worldThemeId) {
    const anchor = this._getWorldDecorAnchorSource();
    const anchorX = anchor ? anchor.position.x : 0;
    const anchorZ = anchor ? anchor.position.z : 0;
    const radius = this._getWorldDecorStreamRadius(themeId);
    const halfExtent = Math.max(0, this.gridSize * 0.5 - 12);

    return {
      anchorX,
      anchorZ,
      radius,
      minX: Math.max(-halfExtent, anchorX - radius),
      maxX: Math.min(halfExtent, anchorX + radius),
      minZ: Math.max(-halfExtent, anchorZ - radius),
      maxZ: Math.min(halfExtent, anchorZ + radius),
      halfExtent
    };
  }

  _getWorldDecorStreamKey(themeId = this.worldThemeId) {
    if (!this._themeHasWorldDecor(themeId)) return `${themeId}:none`;
    const anchor = this._getWorldDecorAnchorSource();
    const ax = anchor ? anchor.position.x : 0;
    const az = anchor ? anchor.position.z : 0;
    const chunkX = Math.floor(ax / WORLD_DECOR_STREAM_CHUNK);
    const chunkZ = Math.floor(az / WORLD_DECOR_STREAM_CHUNK);
    return `${themeId}:${chunkX}:${chunkZ}`;
  }

  _invalidateWorldDecorStreaming() {
    this._worldDecorStreamKey = '';
  }

  _updateWorldDecorStreaming(force = false) {
    if (!this._themeHasWorldDecor(this.worldThemeId)) return;
    const nextKey = this._getWorldDecorStreamKey(this.worldThemeId);
    if (!force && nextKey === this._worldDecorStreamKey) return;
    this._worldDecorStreamKey = nextKey;
    this._rebuildWorldDecor();
  }

  _updateSkyAnchor() {
    if (!this.skyDome) return;
    const anchorSource = this._getSkyAnchorSource();
    if (!anchorSource) return;
    const anchor = anchorSource.position || anchorSource;
    this.skyDome.position.set(anchor.x, anchor.y, anchor.z);
  }

  _sampleThemeNormal(themeId, x, z, out = this._terrainNormalScratch) {
    if (!this._themeUsesTerrain(themeId)) {
      out.set(0, 1, 0);
      return out;
    }
    const eps = 2.5;
    const hL = this._sampleThemeHeight(themeId, x - eps, z);
    const hR = this._sampleThemeHeight(themeId, x + eps, z);
    const hD = this._sampleThemeHeight(themeId, x, z - eps);
    const hU = this._sampleThemeHeight(themeId, x, z + eps);
    this._terrainTangentXScratch.set(eps * 2, hR - hL, 0);
    this._terrainTangentZScratch.set(0, hU - hD, eps * 2);
    out.crossVectors(this._terrainTangentZScratch, this._terrainTangentXScratch).normalize();
    if (!Number.isFinite(out.x) || !Number.isFinite(out.y) || !Number.isFinite(out.z) || out.lengthSq() < 0.0001) {
      out.set(0, 1, 0);
    } else if (out.y < 0) {
      out.multiplyScalar(-1);
    }
    return out;
  }

  _applyPlayerGroundContour(player, incomingY = PLAYER_HALF_HEIGHT) {
    if (!player) return;
    if (!this._themeUsesTerrain(this.worldThemeId)) {
      const yaw = player.userData.headingYaw ?? player.rotation.y;
      player.rotation.set(0, yaw, 0);
      return;
    }

    const x = player.position.x;
    const z = player.position.z;
    const terrainBaseY = this._sampleThemeHeight(this.worldThemeId, x, z) + PLAYER_HALF_HEIGHT;
    const airOffset = Math.max(0, (Number.isFinite(incomingY) ? incomingY : PLAYER_HALF_HEIGHT) - PLAYER_HALF_HEIGHT);
    player.position.y = terrainBaseY + airOffset;

    const yaw = player.userData.headingYaw ?? player.rotation.y;
    const up = this._sampleThemeNormal(this.worldThemeId, x, z, this._terrainNormalScratch);
    const forward = this._terrainForwardScratch.set(Math.sin(yaw), 0, Math.cos(yaw));
    forward.projectOnPlane(up);
    if (forward.lengthSq() < 0.0001) {
      forward.set(0, 0, 1).projectOnPlane(up);
    }
    forward.normalize();
    const right = this._terrainRightScratch.crossVectors(up, forward).normalize();
    forward.crossVectors(right, up).normalize();
    this._terrainBasisScratch.makeBasis(right, up, forward);
    player.quaternion.setFromRotationMatrix(this._terrainBasisScratch);
  }

  _applyGroundContourToAllPlayers() {
    this.players.forEach((player) => {
      this._applyPlayerGroundContour(player, player.userData.lastNetworkY ?? PLAYER_HALF_HEIGHT);
    });
  }

  _themeUsesTerrain(themeId = this.worldThemeId) {
    return themeId !== 'tron';
  }

  _themeHasMoonEffects(themeId = this.worldThemeId) {
    return themeId === 'moon';
  }

  _buildMoonCraterField() {
    const craters = [];
    for (let i = 0; i < MOON_CRATER_COUNT; i += 1) {
      const angle = this._rand01(i + 1) * Math.PI * 2;
      const radius = this._rand01(i + 17) * MOON_CRATER_SPREAD;
      const craterRadius = 28 + this._rand01(i + 53) * 150;
      const depth = 1.1 + this._rand01(i + 89) * 4.6;
      const rimHeight = 0.65 + this._rand01(i + 131) * 2.7;
      const rimOffset = 1.03 + this._rand01(i + 149) * 0.1;
      const rimWidth = 0.012 + this._rand01(i + 167) * 0.02;
      const ridgeSeed = this._rand01(i + 191) * Math.PI * 2;
      craters.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        radius: craterRadius,
        depth,
        rimHeight,
        rimOffset,
        rimWidth,
        ridgeSeed
      });
    }
    return craters;
  }

  _sampleMoonHeight(x, z) {
    const lowFreq =
      Math.sin(x * 0.0047) * 1.8 +
      Math.cos(z * 0.0052) * 1.5 +
      Math.sin((x + z) * 0.0029) * 2.3;
    const hiFreq =
      Math.sin(x * 0.031 + z * 0.017) * 0.35 +
      Math.cos(x * 0.021 - z * 0.025) * 0.28;

    let height = lowFreq + hiFreq;

    for (const crater of this._moonCraters) {
      const dx = x - crater.x;
      const dz = z - crater.z;
      const d = Math.sqrt(dx * dx + dz * dz);
      const t = d / crater.radius;
      if (t > 1.9) continue;

      if (t < 1.0) {
        const bowl = 1 - (t * t);
        height -= bowl * bowl * crater.depth;
      }

      const rimNoise =
        0.82 +
        Math.sin(Math.atan2(dz, dx) * 3.0 + crater.ridgeSeed) * 0.12 +
        Math.cos(Math.atan2(dz, dx) * 6.0 - crater.ridgeSeed * 0.7) * 0.08;
      const rimDelta = t - crater.rimOffset;
      const rim = Math.exp(-(rimDelta * rimDelta) / crater.rimWidth) * crater.rimHeight * rimNoise;
      height += rim;

      const innerRimDelta = t - (crater.rimOffset - 0.12);
      const innerRim =
        Math.exp(-(innerRimDelta * innerRimDelta) / (crater.rimWidth * 0.85)) *
        crater.rimHeight *
        0.32 *
        rimNoise;
      height += innerRim;

      if (t > 1.25 && t < 1.75) {
        const ejecta = (1.75 - t) * (t - 1.25);
        height += ejecta * 0.4 * crater.rimHeight;
      }
    }

    return height;
  }

  _sampleBeachHeight(x, z) {
    const shoreline =
      Math.sin(x * 0.0018) * 38 +
      Math.cos(x * 0.0045) * 14 +
      Math.sin(z * 0.0012) * 6;
    const coastDistance = z - shoreline;
    const gentleBase =
      Math.sin(x * 0.006) * 0.8 +
      Math.cos(z * 0.005) * 0.6;
    const duneField = Math.max(
      0,
      Math.sin(x * 0.011 + z * 0.004) * 0.9 +
      Math.cos(x * 0.007 - z * 0.009) * 0.7
    ) * (0.9 + Math.max(0, coastDistance) * 0.012);
    const berm = Math.exp(-((coastDistance - 24) * (coastDistance - 24)) / 1400) * 2.4;
    const shallowTrough = Math.exp(-((coastDistance + 28) * (coastDistance + 28)) / 1200) * -1.5;
    return gentleBase + duneField + berm + shallowTrough;
  }

  _sampleDesertHeight(x, z) {
    const ridgeDir = x * 0.007 + z * 0.003;
    const cross = x * 0.002 - z * 0.006;
    const dunes =
      Math.sin(ridgeDir) * 3.8 +
      Math.sin(ridgeDir * 1.9 + Math.sin(cross) * 0.9) * 2.2 +
      Math.cos(cross) * 1.1;
    const ripple = Math.sin(x * 0.028 + z * 0.018) * 0.4;
    return dunes + ripple;
  }

  _sampleJungleHeight(x, z) {
    const hills =
      Math.sin(x * 0.0035) * 2.8 +
      Math.cos(z * 0.0039) * 2.5 +
      Math.sin((x + z) * 0.0022) * 3.1;
    const hummocks =
      Math.sin(x * 0.012 + z * 0.009) * 0.9 +
      Math.cos(x * 0.009 - z * 0.014) * 0.7;
    const roots = Math.max(0, Math.sin(x * 0.02) * Math.cos(z * 0.023)) * 0.8;
    return hills + hummocks + roots;
  }

  _sampleHyperboreaHeight(x, z) {
    const shelf =
      Math.sin(x * 0.0024) * 2.4 +
      Math.cos(z * 0.0029) * 2.1 +
      Math.sin((x - z) * 0.0017) * 2.7;
    const glacialRidges =
      Math.abs(Math.sin(x * 0.006 + z * 0.002)) * 3.4 +
      Math.abs(Math.sin(x * 0.003 - z * 0.007)) * 1.6;
    const crust = Math.sin(x * 0.018 + z * 0.013) * 0.35;
    return shelf + glacialRidges + crust - 2.2;
  }

  _sampleIrelandHeight(x, z) {
    const rolling =
      Math.sin(x * 0.0032) * 2.4 +
      Math.cos(z * 0.0038) * 2.1 +
      Math.sin((x + z) * 0.0025) * 1.8;
    const smallerSwells =
      Math.sin(x * 0.009 + z * 0.006) * 0.75 +
      Math.cos(x * 0.007 - z * 0.010) * 0.65;
    const lowValleys = Math.max(0, Math.cos(x * 0.0043 - z * 0.0037)) * -0.6;
    return rolling + smallerSwells + lowValleys;
  }

  _sampleThemeHeight(themeId, x, z) {
    switch (themeId) {
      case 'moon':
        return this._sampleMoonHeight(x, z);
      case 'beach':
        return this._sampleBeachHeight(x, z);
      case 'desert':
        return this._sampleDesertHeight(x, z);
      case 'jungle':
        return this._sampleJungleHeight(x, z);
      case 'hyperborea':
        return this._sampleHyperboreaHeight(x, z);
      case 'ireland':
        return this._sampleIrelandHeight(x, z);
      default:
        return 0;
    }
  }

  _applyMoonTerrainDisplacement(geometry) {
    this._applyThemeTerrainDisplacement(geometry, 'moon');
  }

  _applyThemeTerrainDisplacement(geometry, themeId = this.worldThemeId) {
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const h = this._sampleThemeHeight(themeId, x, -y);
      pos.setZ(i, h);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  _ensureWorldDecorGroup() {
    if (this.worldDecorGroup) return;
    this.worldDecorGroup = new THREE.Group();
    this.worldDecorGroup.name = 'world-decor';
    this.scene.add(this.worldDecorGroup);
  }

  _clearWorldDecor() {
    if (!this.worldDecorGroup) return;
    while (this.worldDecorGroup.children.length > 0) {
      const child = this.worldDecorGroup.children[0];
      this.worldDecorGroup.remove(child);
      if (child.geometry && child.geometry !== this._moonRockGeometry && !child.isSprite) child.geometry.dispose();
      this._disposeMaterial(child.material);
    }
  }

  _buildMoonRockGeometry() {
    if (this._moonRockGeometry) return this._moonRockGeometry;
    const geometry = new THREE.DodecahedronGeometry(1, 0);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const jitter = 0.82 + this._rand01(i + 901) * 0.46;
      pos.setXYZ(i, x * jitter, y * (0.7 + this._rand01(i + 913) * 0.55), z * jitter);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    this._moonRockGeometry = geometry;
    return geometry;
  }

  _rebuildMoonDecor() {
    this._ensureWorldDecorGroup();
    this._clearWorldDecor();

    const rockGeometry = this._buildMoonRockGeometry();
    const rockMaterial = new THREE.MeshStandardMaterial({
      color: 0xa5a7ab,
      roughness: 0.97,
      metalness: 0.0
    });
    const bounds = this._getWorldDecorBounds('moon');
    const cellSize = 54;
    const cellPad = 2;
    const minCellX = Math.floor(bounds.minX / cellSize) - cellPad;
    const maxCellX = Math.ceil(bounds.maxX / cellSize) + cellPad;
    const minCellZ = Math.floor(bounds.minZ / cellSize) - cellPad;
    const maxCellZ = Math.ceil(bounds.maxZ / cellSize) + cellPad;
    const candidates = [];

    for (let ix = minCellX; ix <= maxCellX; ix += 1) {
      for (let iz = minCellZ; iz <= maxCellZ; iz += 1) {
        if (this._coordRand01(ix, iz, 101) < 0.78) continue;
        const rx = (ix + this._coordRandSigned(ix, iz, 103) * 0.42) * cellSize;
        const rz = (iz + this._coordRandSigned(ix, iz, 107) * 0.42) * cellSize;
        if (rx < bounds.minX || rx > bounds.maxX || rz < bounds.minZ || rz > bounds.maxZ) continue;
        if (Math.hypot(rx, rz) < 30) continue;
        candidates.push({ ix, iz, x: rx, z: rz });
      }
    }

    const rocks = new THREE.InstancedMesh(rockGeometry, rockMaterial, Math.max(1, candidates.length));
    rocks.castShadow = false;
    rocks.receiveShadow = true;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();
    let placed = 0;

    for (const candidate of candidates) {
      const { ix, iz, x: rx, z: rz } = candidate;
      const y = this._sampleMoonHeight(rx, rz);
      const size = 1.6 + this._coordRand01(ix, iz, 109) * 7.5;
      position.set(rx, y + size * 0.45, rz);
      rotation.set(
        this._coordRand01(ix, iz, 113) * 0.35,
        this._coordRand01(ix, iz, 127) * Math.PI * 2,
        this._coordRand01(ix, iz, 131) * 0.35
      );
      quaternion.setFromEuler(rotation);
      scale.set(
        size * (0.8 + this._coordRand01(ix, iz, 137) * 0.7),
        size * (0.5 + this._coordRand01(ix, iz, 149) * 0.9),
        size * (0.8 + this._coordRand01(ix, iz, 157) * 0.7)
      );
      matrix.compose(position, quaternion, scale);
      rocks.setMatrixAt(placed, matrix);

      const shade = 0.74 + this._coordRand01(ix, iz, 163) * 0.18;
      color.setRGB(shade, shade, shade + 0.01);
      if (rocks.setColorAt) {
        rocks.setColorAt(placed, color);
      }
      placed += 1;
    }

    rocks.count = placed;
    rocks.instanceMatrix.needsUpdate = true;
    if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true;
    this.worldDecorGroup.add(rocks);
  }

  _createSpriteTexture(width, height, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    draw(ctx, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    if ('colorSpace' in texture && 'SRGBColorSpace' in THREE) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    return texture;
  }

  _createJungleTreeSpriteTexture() {
    return this._createSpriteTexture(160, 256, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      // Shadowed trunk
      ctx.fillStyle = 'rgba(44, 28, 18, 0.9)';
      ctx.fillRect(w * 0.455, h * 0.46, w * 0.10, h * 0.53);
      ctx.fillStyle = 'rgba(77, 49, 30, 0.8)';
      ctx.fillRect(w * 0.505, h * 0.46, w * 0.04, h * 0.52);

      // Buttress roots so the base reads as planted on terrain.
      ctx.fillStyle = 'rgba(60, 38, 23, 0.82)';
      [
        [0.46, 0.99, 0.13, 0.07],
        [0.52, 0.985, 0.12, 0.06],
        [0.57, 0.992, 0.10, 0.05],
        [0.42, 0.992, 0.11, 0.05]
      ].forEach(([x, y, rx, ry]) => {
        ctx.beginPath();
        ctx.ellipse(w * x, h * y, w * rx, h * ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Vines
      ctx.strokeStyle = 'rgba(25, 60, 28, 0.45)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i += 1) {
        const x = w * (0.38 + i * 0.045);
        ctx.beginPath();
        ctx.moveTo(x, h * 0.34);
        ctx.quadraticCurveTo(x - 8 + i * 1.8, h * 0.60, x - 4, h * 0.97);
        ctx.stroke();
      }

      // Layered canopy blobs
      const blobs = [
        [0.50, 0.22, 0.26, 0.14, 'rgba(20,52,22,0.94)'],
        [0.37, 0.29, 0.22, 0.13, 'rgba(24,66,28,0.92)'],
        [0.64, 0.28, 0.23, 0.14, 'rgba(25,71,31,0.90)'],
        [0.49, 0.35, 0.28, 0.14, 'rgba(31,80,36,0.88)'],
        [0.31, 0.36, 0.18, 0.10, 'rgba(35,89,41,0.84)'],
        [0.68, 0.37, 0.19, 0.11, 'rgba(35,89,41,0.84)'],
        [0.53, 0.16, 0.16, 0.09, 'rgba(74,139,59,0.50)']
      ];
      blobs.forEach(([x, y, rx, ry, color]) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(w * x, h * y, w * rx, h * ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Leaf sparkle highlights
      for (let i = 0; i < 130; i += 1) {
        const x = (0.28 + this._rand01(i + 4101) * 0.46) * w;
        const y = (0.10 + this._rand01(i + 4139) * 0.36) * h;
        const r = 0.8 + this._rand01(i + 4177) * 1.8;
        const a = 0.08 + this._rand01(i + 4213) * 0.12;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(118, 190, 92, ${a.toFixed(3)})`;
        ctx.fill();
      }
    });
  }

  _createIrelandCowSpriteTexture() {
    return this._createSpriteTexture(160, 96, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const roundedRect = (x, y, rw, rh, r) => {
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(x, y, rw, rh, r);
          return;
        }
        const rr = Math.min(r, rw * 0.5, rh * 0.5);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.lineTo(x + rw - rr, y);
        ctx.quadraticCurveTo(x + rw, y, x + rw, y + rr);
        ctx.lineTo(x + rw, y + rh - rr);
        ctx.quadraticCurveTo(x + rw, y + rh, x + rw - rr, y + rh);
        ctx.lineTo(x + rr, y + rh);
        ctx.quadraticCurveTo(x, y + rh, x, y + rh - rr);
        ctx.lineTo(x, y + rr);
        ctx.quadraticCurveTo(x, y, x + rr, y);
        ctx.closePath();
      };

      // Ground contact shadow
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.86, w * 0.23, h * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = '#f2f2ef';
      roundedRect(w * 0.22, h * 0.42, w * 0.42, h * 0.22, 12);
      ctx.fill();

      // Head
      roundedRect(w * 0.60, h * 0.45, w * 0.15, h * 0.14, 8);
      ctx.fill();

      // Muzzle
      ctx.fillStyle = '#d9d2cc';
      roundedRect(w * 0.69, h * 0.49, w * 0.08, h * 0.08, 6);
      ctx.fill();

      // Ears/horns
      ctx.strokeStyle = '#d7c7ad';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.62, h * 0.45);
      ctx.lineTo(w * 0.60, h * 0.41);
      ctx.moveTo(w * 0.73, h * 0.45);
      ctx.lineTo(w * 0.76, h * 0.41);
      ctx.stroke();

      // Legs
      ctx.fillStyle = '#f2f2ef';
      [0.28, 0.38, 0.50, 0.60].forEach((x) => {
        ctx.fillRect(w * x, h * 0.62, w * 0.035, h * 0.20);
      });

      // Hooves
      ctx.fillStyle = '#373330';
      [0.28, 0.38, 0.50, 0.60].forEach((x) => {
        ctx.fillRect(w * x, h * 0.79, w * 0.035, h * 0.03);
      });

      // Tail
      ctx.strokeStyle = '#2d2725';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.23, h * 0.46);
      ctx.quadraticCurveTo(w * 0.17, h * 0.52, w * 0.20, h * 0.68);
      ctx.stroke();

      // Spots
      const spotColors = ['#2c2a28', '#4a3a2f', '#1f1f1f'];
      const spots = [
        [0.31, 0.47, 0.09, 0.06, 0],
        [0.46, 0.54, 0.08, 0.05, 1],
        [0.57, 0.49, 0.06, 0.04, 2],
        [0.67, 0.50, 0.05, 0.03, 0]
      ];
      spots.forEach(([x, y, rx, ry, colorIndex]) => {
        ctx.fillStyle = spotColors[colorIndex];
        ctx.beginPath();
        ctx.ellipse(w * x, h * y, w * rx, h * ry, this._rand01(x * 1000 + y * 1000) * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Eye
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(w * 0.71, h * 0.51, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  _rebuildJungleDecor() {
    this._ensureWorldDecorGroup();
    this._clearWorldDecor();
    const treeTexture = this._createJungleTreeSpriteTexture();
    const bounds = this._getWorldDecorBounds('jungle');
    const cellSize = 36;
    const minCellX = Math.floor(bounds.minX / cellSize) - 2;
    const maxCellX = Math.ceil(bounds.maxX / cellSize) + 2;
    const minCellZ = Math.floor(bounds.minZ / cellSize) - 2;
    const maxCellZ = Math.ceil(bounds.maxZ / cellSize) + 2;

    let placed = 0;
    for (let ix = minCellX; ix <= maxCellX && placed < JUNGLE_TREE_SPRITE_COUNT; ix += 1) {
      for (let iz = minCellZ; iz <= maxCellZ && placed < JUNGLE_TREE_SPRITE_COUNT; iz += 1) {
        if (this._coordRand01(ix, iz, 401) < 0.62) continue;
        const x = (ix + this._coordRandSigned(ix, iz, 409) * 0.48) * cellSize;
        const z = (iz + this._coordRandSigned(ix, iz, 421) * 0.48) * cellSize;
        if (x < bounds.minX || x > bounds.maxX || z < bounds.minZ || z > bounds.maxZ) continue;
        if (Math.hypot(x, z) < 34) continue;
        const groundY = this._sampleThemeHeight('jungle', x, z);
        const height = 36 + this._coordRand01(ix, iz, 433) * 88;
        const width = height * (0.34 + this._coordRand01(ix, iz, 439) * 0.14);
      const material = new THREE.SpriteMaterial({
        map: treeTexture,
        transparent: true,
        depthWrite: false,
        alphaTest: 0.08
      });
        const tint = 0.8 + this._coordRand01(ix, iz, 443) * 0.25;
      material.color.setRGB(0.72 * tint, 0.95 * tint, 0.72 * tint);
      const sprite = new THREE.Sprite(material);
      sprite.center.set(0.5, 0.06);
      sprite.position.set(x, groundY - 0.5, z);
      sprite.scale.set(width, height, 1);
        sprite.material.rotation = this._coordRandSigned(ix, iz, 449) * 0.1;
      this.worldDecorGroup.add(sprite);
        placed += 1;
      }
    }
  }

  _rebuildIrelandDecor() {
    this._ensureWorldDecorGroup();
    this._clearWorldDecor();
    this._rebuildIrelandPastureWalls();
    const cowTexture = this._createIrelandCowSpriteTexture();
    let cowsPlaced = 0;
    const bounds = this._getWorldDecorBounds('ireland');
    const cellSize = 74;
    const minCellX = Math.floor(bounds.minX / cellSize) - 2;
    const maxCellX = Math.ceil(bounds.maxX / cellSize) + 2;
    const minCellZ = Math.floor(bounds.minZ / cellSize) - 2;
    const maxCellZ = Math.ceil(bounds.maxZ / cellSize) + 2;

    for (let ix = minCellX; ix <= maxCellX && cowsPlaced < IRELAND_COW_SPRITE_COUNT; ix += 1) {
      for (let iz = minCellZ; iz <= maxCellZ && cowsPlaced < IRELAND_COW_SPRITE_COUNT; iz += 1) {
        if (this._coordRand01(ix, iz, 601) < 0.89) continue;
        const x = (ix + this._coordRandSigned(ix, iz, 607) * 0.46) * cellSize;
        const z = (iz + this._coordRandSigned(ix, iz, 613) * 0.46) * cellSize;
        if (x < bounds.minX || x > bounds.maxX || z < bounds.minZ || z > bounds.maxZ) continue;
        if (Math.hypot(x, z) < 24) continue;
        const groundY = this._sampleThemeHeight('ireland', x, z);
        const w = 9 + this._coordRand01(ix, iz, 617) * 7;
        const h = w * (0.52 + this._coordRand01(ix, iz, 631) * 0.12);
      const material = new THREE.SpriteMaterial({
        map: cowTexture,
        transparent: true,
        depthWrite: false,
        alphaTest: 0.08
      });
        const tint = 0.9 + this._coordRand01(ix, iz, 643) * 0.14;
      material.color.setRGB(tint, tint, tint);
      const sprite = new THREE.Sprite(material);
      sprite.center.set(0.5, 0);
      sprite.position.set(x, groundY + 0.15, z);
        const xScale = (this._coordRand01(ix, iz, 659) > 0.5 ? 1 : -1) * w;
      sprite.scale.set(xScale, h, 1);
        sprite.material.rotation = this._coordRandSigned(ix, iz, 673) * 0.03;
      this.worldDecorGroup.add(sprite);
        cowsPlaced += 1;
      }
    }
  }

  _rebuildIrelandPastureWalls() {
    const maxSegments = 720;
    const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b8a86,
      roughness: 0.98,
      metalness: 0.0
    });
    const walls = new THREE.InstancedMesh(wallGeometry, wallMaterial, maxSegments);
    walls.castShadow = false;
    walls.receiveShadow = true;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();
    const bounds = this._getWorldDecorBounds('ireland');
    const lineSpacing = 92 * 4;
    const segmentStep = 24;
    const baseSegmentLength = 18;
    const wallThickness = 1.0;
    const baseWallHeight = PLAYER_HALF_HEIGHT * 0.95;
    const spawnKeepout = 56;

    let placed = 0;
    const addWallSegment = (x, z, yaw, length, seedBase) => {
      if (placed >= maxSegments) return;
      if (x < bounds.minX || x > bounds.maxX || z < bounds.minZ || z > bounds.maxZ) return;
      if (Math.hypot(x, z) < spawnKeepout) return;

      const groundY = this._sampleThemeHeight('ireland', x, z);
      const wallHeight = baseWallHeight * (0.9 + this._rand01(seedBase + 5) * 0.28);
      position.set(x, groundY + wallHeight * 0.5 - 0.08, z);
      rotation.set(
        (this._rand01(seedBase + 11) - 0.5) * 0.02,
        yaw + (this._rand01(seedBase + 17) - 0.5) * 0.06,
        (this._rand01(seedBase + 23) - 0.5) * 0.02
      );
      quaternion.setFromEuler(rotation);
      scale.set(
        length * (0.9 + this._rand01(seedBase + 29) * 0.2),
        wallHeight,
        wallThickness * (0.9 + this._rand01(seedBase + 31) * 0.22)
      );
      matrix.compose(position, quaternion, scale);
      walls.setMatrixAt(placed, matrix);
      if (walls.setColorAt) {
        const shade = 0.74 + this._rand01(seedBase + 37) * 0.14;
        color.setRGB(shade, shade * 0.99, shade * 0.96);
        walls.setColorAt(placed, color);
      }
      placed += 1;
      return true;
    };

    const buildGridLines = (axis, axisBudget = Infinity) => {
      let axisPlaced = 0;
      const lineMin = axis === 'x'
        ? Math.floor((bounds.minZ - 20) / lineSpacing)
        : Math.floor((bounds.minX - 20) / lineSpacing);
      const lineMax = axis === 'x'
        ? Math.ceil((bounds.maxZ + 20) / lineSpacing)
        : Math.ceil((bounds.maxX + 20) / lineSpacing);

      const segMin = axis === 'x'
        ? Math.floor((bounds.minX - 20) / segmentStep)
        : Math.floor((bounds.minZ - 20) / segmentStep);
      const segMax = axis === 'x'
        ? Math.ceil((bounds.maxX + 20) / segmentStep)
        : Math.ceil((bounds.maxZ + 20) / segmentStep);

      for (let li = lineMin; li <= lineMax; li += 1) {
        if (axisPlaced >= axisBudget || placed >= maxSegments) break;
        const lineSeed = axis === 'x' ? li + 8201 : li + 9101;
        const lineCoord = li * lineSpacing + this._coordRandSigned(li, axis === 'x' ? 1 : 2, lineSeed) * 10;
        for (let si = segMin; si <= segMax; si += 1) {
          if (axisPlaced >= axisBudget || placed >= maxSegments) break;
          const t = si * segmentStep;
          const seedBase = (axis === 'x' ? 10000 : 12000) + Math.imul(li | 0, 600) + Math.imul(si | 0, 37);
          const gateBias = Math.abs(li) <= 1 ? 0.22 : 0.14;
          if (this._rand01(seedBase + 1) < gateBias) continue;

          const len = baseSegmentLength + this._rand01(seedBase + 3) * 10;
          let x;
          let z;
          let yaw;
          if (axis === 'x') {
            x = t + (this._rand01(seedBase + 7) - 0.5) * 3.0;
            z = lineCoord + (this._rand01(seedBase + 9) - 0.5) * 1.8;
            yaw = 0;
          } else {
            x = lineCoord + (this._rand01(seedBase + 7) - 0.5) * 1.8;
            z = t + (this._rand01(seedBase + 9) - 0.5) * 3.0;
            yaw = Math.PI * 0.5;
          }
          if (addWallSegment(x, z, yaw, len, seedBase)) {
            axisPlaced += 1;
          }
        }
      }
      return axisPlaced;
    };

    const axisBudget = Math.floor(maxSegments * 0.5);
    buildGridLines('x', axisBudget);
    buildGridLines('z', axisBudget);

    walls.count = placed;
    walls.instanceMatrix.needsUpdate = true;
    if (walls.instanceColor) walls.instanceColor.needsUpdate = true;
    this.worldDecorGroup.add(walls);
  }

  _rebuildWorldDecor() {
    this._ensureWorldDecorGroup();
    switch (this.worldThemeId) {
      case 'moon':
        this._rebuildMoonDecor();
        this.worldDecorGroup.visible = true;
        return;
      case 'jungle':
        this._rebuildJungleDecor();
        this.worldDecorGroup.visible = true;
        return;
      case 'ireland':
        this._rebuildIrelandDecor();
        this.worldDecorGroup.visible = true;
        return;
      default:
        break;
    }
    this._clearWorldDecor();
    this.worldDecorGroup.visible = false;
  }

  _ensureWeatherFxGroup() {
    if (this.weatherFxGroup) return;
    this.weatherFxGroup = new THREE.Group();
    this.weatherFxGroup.name = 'weather-fx';
    this.scene.add(this.weatherFxGroup);
  }

  _ensureIrelandRainFx() {
    if (this._irelandRain) return this._irelandRain;
    this._ensureWeatherFxGroup();

    const positions = new Float32Array(IRELAND_RAIN_DROP_COUNT * 3);
    const speeds = new Float32Array(IRELAND_RAIN_DROP_COUNT);
    const driftX = new Float32Array(IRELAND_RAIN_DROP_COUNT);
    const driftZ = new Float32Array(IRELAND_RAIN_DROP_COUNT);
    const grounds = new Float32Array(IRELAND_RAIN_DROP_COUNT);
    const geometry = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(positions, 3);
    geometry.setAttribute('position', positionAttr);

    const material = new THREE.PointsMaterial({
      color: 0xd7e4ee,
      size: 2.1,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      sizeAttenuation: true
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    points.visible = false;
    this.weatherFxGroup.add(points);

    this._irelandRain = {
      points,
      geometry,
      positions,
      positionAttr,
      speeds,
      driftX,
      driftZ,
      grounds,
      anchor: new THREE.Vector3(),
      initialized: false,
      active: false,
      phaseTimer: 0,
      intensity: 0,
      targetIntensity: 0
    };

    return this._irelandRain;
  }

  _respawnIrelandDrop(rain, index, anchor, spawnHigh = false) {
    const radius = Math.sqrt(Math.random()) * IRELAND_RAIN_RADIUS;
    const angle = Math.random() * Math.PI * 2;
    const x = anchor.x + Math.cos(angle) * radius;
    const z = anchor.z + Math.sin(angle) * radius;
    const groundY = this._sampleThemeHeight('ireland', x, z) + 1.2;
    const y = spawnHigh
      ? groundY + 35 + Math.random() * 70
      : groundY + 18 + Math.random() * 70;

    const i3 = index * 3;
    rain.positions[i3] = x;
    rain.positions[i3 + 1] = y;
    rain.positions[i3 + 2] = z;
    rain.speeds[index] = 34 + Math.random() * 38;
    rain.driftX[index] = -1.8 + Math.random() * 1.2;
    rain.driftZ[index] = -0.6 + Math.random() * 1.2;
    rain.grounds[index] = groundY;
  }

  _configureThemeWeather() {
    if (this.worldThemeId === 'ireland') {
      const rain = this._ensureIrelandRainFx();
      this.weatherFxGroup.visible = true;
      rain.phaseTimer = 0.5 + Math.random() * 1.4;
      rain.active = false;
      rain.intensity = 0;
      rain.targetIntensity = 0;
      return;
    }

    if (this.weatherFxGroup) {
      this.weatherFxGroup.visible = false;
    }
    if (this._irelandRain?.points) {
      this._irelandRain.points.visible = false;
      this._irelandRain.intensity = 0;
      this._irelandRain.targetIntensity = 0;
      this._irelandRain.active = false;
    }
  }

  _updateThemeWeather(dt) {
    if (this.worldThemeId !== 'ireland') return;

    const rain = this._ensureIrelandRainFx();
    const anchorSource = this.localPlayerId ? this.players.get(this.localPlayerId) : null;
    const anchorTarget = anchorSource ? anchorSource.position : this.camera.position;
    const safeDt = Math.min(Math.max(dt, 1 / 240), 0.1);

    if (!rain.initialized) {
      rain.anchor.copy(anchorTarget);
      for (let i = 0; i < IRELAND_RAIN_DROP_COUNT; i += 1) {
        this._respawnIrelandDrop(rain, i, rain.anchor, true);
      }
      rain.positionAttr.needsUpdate = true;
      rain.initialized = true;
    } else {
      rain.anchor.lerp(anchorTarget, Math.min(1, safeDt * 2.2));
    }

    rain.phaseTimer -= safeDt;
    if (rain.phaseTimer <= 0) {
      rain.active = !rain.active;
      if (rain.active) {
        rain.targetIntensity = 0.4 + Math.random() * 0.5;
        rain.phaseTimer = 2.8 + Math.random() * 5.5;
      } else {
        rain.targetIntensity = 0;
        rain.phaseTimer = 2.2 + Math.random() * 5.0;
      }
    }

    rain.intensity = THREE.MathUtils.lerp(
      rain.intensity,
      rain.targetIntensity,
      Math.min(1, safeDt * (rain.active ? 1.8 : 0.9))
    );

    if (rain.points.material) {
      rain.points.material.opacity = 0.02 + rain.intensity * 0.38;
      rain.points.material.size = 1.6 + rain.intensity * 1.8;
    }
    rain.points.visible = rain.intensity > 0.02;
    if (!rain.points.visible) return;

    const radiusSq = IRELAND_RAIN_RADIUS * IRELAND_RAIN_RADIUS * 1.65;
    const fallMultiplier = 0.7 + rain.intensity * 0.95;
    for (let i = 0; i < IRELAND_RAIN_DROP_COUNT; i += 1) {
      const i3 = i * 3;
      rain.positions[i3] += rain.driftX[i] * safeDt * (0.5 + rain.intensity);
      rain.positions[i3 + 2] += rain.driftZ[i] * safeDt * (0.4 + rain.intensity * 0.6);
      rain.positions[i3 + 1] -= rain.speeds[i] * safeDt * fallMultiplier;

      const dx = rain.positions[i3] - rain.anchor.x;
      const dz = rain.positions[i3 + 2] - rain.anchor.z;
      if (rain.positions[i3 + 1] <= rain.grounds[i] || (dx * dx + dz * dz) > radiusSq) {
        this._respawnIrelandDrop(rain, i, rain.anchor, false);
      }
    }
    rain.positionAttr.needsUpdate = true;
  }

  _disposeMaterial(material) {
    if (!material) return;
    const disposeOne = (mat) => {
      if (!mat) return;
      if (mat.map) mat.map.dispose();
      if (mat.bumpMap && mat.bumpMap !== mat.map) mat.bumpMap.dispose();
      if (mat.normalMap && mat.normalMap !== mat.map && mat.normalMap !== mat.bumpMap) mat.normalMap.dispose();
      mat.dispose?.();
    };
    if (Array.isArray(material)) {
      material.forEach(disposeOne);
      return;
    }
    disposeOne(material);
  }

  _clearFloor() {
    if (!this.floor) return;
    this.scene.remove(this.floor);
    if (this.floor.geometry) {
      this.floor.geometry.dispose();
    }
    this._disposeMaterial(this.floor.material);
    this.floor = null;
    this.floorGeometry = null;
  }

  _clearSky() {
    if (!this.skyDome) return;
    this.scene.remove(this.skyDome);
    if (this.skyDome.geometry) {
      this.skyDome.geometry.dispose();
    }
    this._disposeMaterial(this.skyDome.material);
    this.skyDome = null;
  }

  _createTronGridMaterial() {
    const gridShader = {
      vertexShader: `
        varying vec3 worldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          worldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 worldPosition;
        uniform vec3 gridColor;
        uniform vec3 backgroundColor;
        
        float getGrid(float coord, float gridSize) {
          float line = abs(fract(coord / gridSize - 0.5) - 0.5) / fwidth(coord / gridSize);
          return min(line, 1.0);
        }
        
        void main() {
          float x = getGrid(worldPosition.x, 10.0);
          float z = getGrid(worldPosition.z, 10.0);
          float grid = 1.0 - min(x, z);
          
          vec3 color = mix(backgroundColor, gridColor, grid);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        gridColor: { value: new THREE.Color(0x00ffff) },
        backgroundColor: { value: new THREE.Color(0x001040) }
      }
    };

    return new THREE.ShaderMaterial({
      vertexShader: gridShader.vertexShader,
      fragmentShader: gridShader.fragmentShader,
      uniforms: gridShader.uniforms,
      side: THREE.DoubleSide
    });
  }

  _createMoonSurfaceTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#8f8f8f';
    ctx.fillRect(0, 0, size, size);

    // Fine grain
    for (let i = 0; i < 9000; i += 1) {
      const x = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * size;
      const y = (Math.sin((i + 77) * 78.233) * 12345.6789 % 1 + 1) % 1 * size;
      const shade = 120 + ((Math.sin(i * 3.17) * 0.5 + 0.5) * 70);
      ctx.fillStyle = `rgba(${shade.toFixed(0)}, ${shade.toFixed(0)}, ${shade.toFixed(0)}, 0.18)`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Craters
    for (let i = 0; i < 140; i += 1) {
      const seedA = (Math.sin((i + 11) * 91.13) * 0.5 + 0.5);
      const seedB = (Math.sin((i + 37) * 53.71) * 0.5 + 0.5);
      const x = seedA * size;
      const y = seedB * size;
      const radius = 4 + (Math.sin((i + 5) * 17.17) * 0.5 + 0.5) * 32;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(70, 70, 70, 0.22)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x - radius * 0.12, y - radius * 0.12, radius * 0.78, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(170, 170, 170, 0.12)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(205, 205, 205, 0.12)';
      ctx.lineWidth = Math.max(1, radius * 0.08);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const repeat = Math.max(4, this.gridSize / 140);
    texture.repeat.set(repeat, repeat);
    // Keep crater/grain pattern anchored in world space as the centered floor grows.
    texture.offset.set(-repeat * 0.5, -repeat * 0.5);
    if ('colorSpace' in texture && 'SRGBColorSpace' in THREE) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    texture.needsUpdate = true;
    return texture;
  }

  _createMoonFloorMaterial() {
    const surfaceTexture = this._createMoonSurfaceTexture();
    return new THREE.MeshStandardMaterial({
      map: surfaceTexture,
      bumpMap: surfaceTexture,
      bumpScale: 0.7,
      color: 0xc6c7c9,
      roughness: 1.0,
      metalness: 0.0
    });
  }

  _finalizeCanvasTexture(canvas, repeatDivisor = 140) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(Math.max(4, this.gridSize / repeatDivisor), Math.max(4, this.gridSize / repeatDivisor));
    if ('colorSpace' in texture && 'SRGBColorSpace' in THREE) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    texture.needsUpdate = true;
    return texture;
  }

  _createThemeSurfaceTexture(themeId) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const fillNoise = (baseRgb, variance = 18, alpha = 0.18, count = 7000, dot = 2) => {
      ctx.fillStyle = `rgb(${baseRgb[0]}, ${baseRgb[1]}, ${baseRgb[2]})`;
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < count; i += 1) {
        const x = this._rand01(i * 3 + 11) * size;
        const y = this._rand01(i * 5 + 31) * size;
        const d = (this._rand01(i * 7 + 53) - 0.5) * variance;
        const r = Math.max(0, Math.min(255, baseRgb[0] + d));
        const g = Math.max(0, Math.min(255, baseRgb[1] + d));
        const b = Math.max(0, Math.min(255, baseRgb[2] + d * 0.7));
        ctx.fillStyle = `rgba(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)}, ${alpha})`;
        ctx.fillRect(x, y, dot, dot);
      }
    };

    switch (themeId) {
      case 'beach': {
        fillNoise([225, 203, 149], 26, 0.16, 7600, 2);
        for (let y = 0; y < size; y += 1) {
          const t = y / size;
          const shoreBlend = Math.exp(-((t - 0.58) * (t - 0.58)) / 0.006);
          const wet = Math.exp(-((t - 0.48) * (t - 0.48)) / 0.012);
          if (shoreBlend > 0.001) {
            ctx.fillStyle = `rgba(245, 234, 200, ${(shoreBlend * 0.2).toFixed(3)})`;
            ctx.fillRect(0, y, size, 1);
          }
          if (wet > 0.001) {
            ctx.fillStyle = `rgba(150, 133, 104, ${(wet * 0.18).toFixed(3)})`;
            ctx.fillRect(0, y, size, 1);
          }
        }
        for (let i = 0; i < 180; i += 1) {
          const x = this._rand01(i + 901) * size;
          const y = this._rand01(i + 943) * size;
          const r = 1 + this._rand01(i + 977) * 3.8;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = this._rand01(i + 1003) > 0.5 ? 'rgba(247,244,235,0.12)' : 'rgba(182,154,120,0.12)';
          ctx.fill();
        }
        return this._finalizeCanvasTexture(canvas, 120);
      }
      case 'desert': {
        fillNoise([206, 154, 86], 30, 0.16, 7800, 2);
        ctx.strokeStyle = 'rgba(238, 188, 117, 0.12)';
        for (let i = 0; i < 80; i += 1) {
          ctx.beginPath();
          for (let x = 0; x <= size; x += 8) {
            const y = (i / 80) * size + Math.sin(x * 0.04 + i * 0.7) * 3.2;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        return this._finalizeCanvasTexture(canvas, 110);
      }
      case 'jungle': {
        fillNoise([58, 96, 49], 28, 0.18, 8400, 2);
        for (let i = 0; i < 900; i += 1) {
          const x = this._rand01(i + 1201) * size;
          const y = this._rand01(i + 1237) * size;
          const w = 2 + this._rand01(i + 1271) * 5;
          const h = 1 + this._rand01(i + 1303) * 2.5;
          ctx.fillStyle = this._rand01(i + 1327) > 0.45
            ? 'rgba(92, 130, 56, 0.18)'
            : 'rgba(90, 63, 42, 0.14)';
          ctx.fillRect(x, y, w, h);
        }
        for (let i = 0; i < 120; i += 1) {
          const x = this._rand01(i + 1357) * size;
          const y = this._rand01(i + 1389) * size;
          const r = 5 + this._rand01(i + 1421) * 16;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(25, 45, 20, 0.08)';
          ctx.fill();
        }
        return this._finalizeCanvasTexture(canvas, 135);
      }
      case 'hyperborea': {
        fillNoise([182, 201, 212], 22, 0.14, 7600, 2);
        for (let i = 0; i < 160; i += 1) {
          const x = this._rand01(i + 1501) * size;
          const y = this._rand01(i + 1529) * size;
          const len = 10 + this._rand01(i + 1559) * 38;
          const angle = (this._rand01(i + 1597) - 0.5) * 0.8;
          ctx.strokeStyle = this._rand01(i + 1621) > 0.5
            ? 'rgba(230,245,255,0.12)'
            : 'rgba(120,160,190,0.12)';
          ctx.lineWidth = 1 + this._rand01(i + 1663) * 1.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
          ctx.stroke();
        }
        return this._finalizeCanvasTexture(canvas, 130);
      }
      case 'ireland': {
        fillNoise([79, 128, 61], 24, 0.18, 8200, 2);
        for (let i = 0; i < 240; i += 1) {
          const x = this._rand01(i + 1701) * size;
          const y = this._rand01(i + 1733) * size;
          const w = 12 + this._rand01(i + 1769) * 34;
          const h = 2 + this._rand01(i + 1801) * 4;
          ctx.fillStyle = this._rand01(i + 1831) > 0.6
            ? 'rgba(108,150,79,0.12)'
            : 'rgba(64,98,50,0.12)';
          ctx.fillRect(x, y, w, h);
        }
        for (let i = 0; i < 120; i += 1) {
          const x = this._rand01(i + 1867) * size;
          const y = this._rand01(i + 1901) * size;
          const w = 18 + this._rand01(i + 1931) * 40;
          ctx.strokeStyle = 'rgba(90,80,72,0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y + (this._rand01(i + 1973) - 0.5) * 4);
          ctx.stroke();
        }
        return this._finalizeCanvasTexture(canvas, 140);
      }
      case 'moon':
        return this._createMoonSurfaceTexture();
      case 'tron':
      default:
        return null;
    }
  }

  _createTerrainFloorMaterial(themeId) {
    if (themeId === 'moon') {
      return this._createMoonFloorMaterial();
    }
    const surfaceTexture = this._createThemeSurfaceTexture(themeId);
    const themeProps = {
      beach: { color: 0xf2dfb3, roughness: 0.9, metalness: 0.01, bumpScale: 0.32 },
      desert: { color: 0xe1b56f, roughness: 0.94, metalness: 0.0, bumpScale: 0.38 },
      jungle: { color: 0x45653a, roughness: 0.98, metalness: 0.0, bumpScale: 0.42 },
      hyperborea: { color: 0xcddbe2, roughness: 0.82, metalness: 0.06, bumpScale: 0.36 },
      ireland: { color: 0x5a8e48, roughness: 0.96, metalness: 0.0, bumpScale: 0.34 }
    }[themeId] || { color: 0xffffff, roughness: 1.0, metalness: 0.0, bumpScale: 0.3 };

    return new THREE.MeshStandardMaterial({
      map: surfaceTexture,
      bumpMap: surfaceTexture,
      bumpScale: themeProps.bumpScale,
      color: themeProps.color,
      roughness: themeProps.roughness,
      metalness: themeProps.metalness
    });
  }

  _createFloorMaterial(themeId = this.worldThemeId) {
    if (themeId === 'tron') {
      return this._createTronGridMaterial();
    }
    return this._createTerrainFloorMaterial(themeId);
  }

  _createSkyTexture(themeId) {
    const width = 1024;
    const height = 512;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (themeId === 'moon') {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.65, '#04070d');
      gradient.addColorStop(1, '#070707');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 1400; i += 1) {
        const x = (Math.sin((i + 1) * 13.37) * 0.5 + 0.5) * width;
        const y = (Math.sin((i + 9) * 41.17) * 0.5 + 0.5) * height;
        const r = ((Math.sin((i + 5) * 7.19) * 0.5 + 0.5) * 1.8) + 0.2;
        const alpha = 0.35 + (Math.sin(i * 2.71) * 0.5 + 0.5) * 0.55;
        const warm = 210 + Math.floor((Math.sin(i * 1.33) * 0.5 + 0.5) * 40);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${warm}, ${warm}, ${warm + 10}, ${alpha.toFixed(2)})`;
        ctx.fill();
      }
    } else if (themeId === 'beach') {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#67c7ff');
      gradient.addColorStop(0.45, '#99e4ff');
      gradient.addColorStop(0.7, '#c2f0ff');
      gradient.addColorStop(0.82, '#a8d8ff');
      gradient.addColorStop(1, '#4aa4d8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Aggressive raise: keep ocean line + palm silhouettes clearly above the scene horizon.
      const horizonY = height * 0.44;
      const sunX = width * 0.72;
      const sunY = height * 0.27;
      const sunR = height * 0.12;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 2.8);
      sunGlow.addColorStop(0, 'rgba(255,250,220,0.65)');
      sunGlow.addColorStop(0.35, 'rgba(255,215,132,0.35)');
      sunGlow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fillStyle = '#fff3bf';
      ctx.fill();

      for (let i = 0; i < 22; i += 1) {
        const cx = this._rand01(i + 2101) * width;
        const cy = this._rand01(i + 2137) * height * 0.45 + 20;
        const w = 70 + this._rand01(i + 2173) * 140;
        const h = 16 + this._rand01(i + 2209) * 26;
        ctx.fillStyle = `rgba(255,255,255,${(0.08 + this._rand01(i + 2243) * 0.12).toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, w, h, this._rand01(i + 2281) * 0.2 - 0.1, 0, Math.PI * 2);
        ctx.fill();
      }

      const ocean = ctx.createLinearGradient(0, horizonY - 8, 0, height);
      ocean.addColorStop(0, '#4ac8d1');
      ocean.addColorStop(0.18, '#1da7d8');
      ocean.addColorStop(0.55, '#0b4ea0');
      ocean.addColorStop(1, '#071d52');
      ctx.fillStyle = ocean;
      ctx.fillRect(0, horizonY, width, height - horizonY);
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.fillRect(0, horizonY - 2, width, 3);

      for (let i = 0; i < 48; i += 1) {
        const y = horizonY + 6 + i * 3.5;
        ctx.strokeStyle = `rgba(200,255,255,${(0.025 + (1 - i / 48) * 0.03).toFixed(3)})`;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 14) {
          const waveY = y + Math.sin(x * 0.02 + i * 0.8) * (1 + i * 0.02);
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(18, 62, 78, 0.75)';
      for (let i = 0; i < 6; i += 1) {
        const ix = this._rand01(i + 2333) * width;
        const iw = 50 + this._rand01(i + 2371) * 150;
        const ih = 10 + this._rand01(i + 2401) * 18;
        ctx.beginPath();
        ctx.moveTo(ix, horizonY + 2);
        ctx.quadraticCurveTo(ix + iw * 0.4, horizonY - ih, ix + iw, horizonY + 2);
        ctx.lineTo(ix + iw, horizonY + 8);
        ctx.lineTo(ix, horizonY + 8);
        ctx.closePath();
        ctx.fill();
      }

      // Palm silhouettes at edges for beach vibe
      const drawPalm = (baseX, flip = 1) => {
        const baseY = horizonY + 18;
        ctx.strokeStyle = 'rgba(10,25,25,0.9)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY + 60);
        ctx.quadraticCurveTo(baseX + 12 * flip, baseY + 8, baseX + 24 * flip, baseY - 48);
        ctx.stroke();
        for (let j = 0; j < 7; j += 1) {
          const ang = -1.4 + j * 0.45;
          const len = 30 + (j % 2) * 14;
          ctx.strokeStyle = 'rgba(15,35,28,0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(baseX + 24 * flip, baseY - 48);
          ctx.lineTo(baseX + 24 * flip + Math.cos(ang) * len * flip, baseY - 48 + Math.sin(ang) * len);
          ctx.stroke();
        }
      };
      drawPalm(50, 1);
      drawPalm(width - 50, -1);
    } else if (themeId === 'desert') {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#2a1740');
      gradient.addColorStop(0.35, '#6d2d54');
      gradient.addColorStop(0.62, '#c45a4b');
      gradient.addColorStop(0.82, '#f0b060');
      gradient.addColorStop(1, '#94644f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Aggressive raise so dune/mesa silhouettes sit clearly in the visible sky band.
      const horizonY = height * 0.46;
      const sunX = width * 0.58;
      const sunY = height * 0.34;
      const sunR = height * 0.14;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 3.2);
      sunGlow.addColorStop(0, 'rgba(255,228,170,0.5)');
      sunGlow.addColorStop(0.45, 'rgba(255,150,74,0.26)');
      sunGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR * 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd08a';
      ctx.fill();

      // Dust haze
      const haze = ctx.createLinearGradient(0, horizonY - 60, 0, horizonY + 70);
      haze.addColorStop(0, 'rgba(255,190,110,0)');
      haze.addColorStop(0.4, 'rgba(255,174,92,0.10)');
      haze.addColorStop(1, 'rgba(180,110,65,0.13)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, horizonY - 60, width, 130);

      const drawDuneLayer = (color, yBase, ampA, ampB, freqA, freqB) => {
        ctx.beginPath();
        ctx.moveTo(0, yBase + 40);
        for (let x = 0; x <= width; x += 10) {
          const nx = x / width;
          const y =
            yBase -
            Math.sin(nx * Math.PI * freqA + 0.4) * ampA -
            Math.cos(nx * Math.PI * freqB - 0.2) * ampB;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };
      drawDuneLayer('#7d4332', horizonY + 12, 18, 9, 2.4, 5.6);
      drawDuneLayer('#9b5839', horizonY + 35, 26, 12, 3.4, 6.1);
      drawDuneLayer('#b96e43', horizonY + 65, 34, 14, 4.1, 7.5);

      // Mesas/rock silhouettes
      ctx.fillStyle = 'rgba(60,25,20,0.7)';
      for (let i = 0; i < 10; i += 1) {
        const x = this._rand01(i + 2501) * width;
        const w = 30 + this._rand01(i + 2549) * 90;
        const h = 28 + this._rand01(i + 2581) * 70;
        const y = horizonY + 16 - h;
        ctx.beginPath();
        ctx.moveTo(x, horizonY + 16);
        ctx.lineTo(x + w * 0.12, y + h * 0.35);
        ctx.lineTo(x + w * 0.25, y + 8);
        ctx.lineTo(x + w * 0.72, y + 5);
        ctx.lineTo(x + w * 0.9, y + h * 0.4);
        ctx.lineTo(x + w, horizonY + 16);
        ctx.closePath();
        ctx.fill();
      }
    } else if (themeId === 'jungle') {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#193747');
      gradient.addColorStop(0.35, '#2d6f7b');
      gradient.addColorStop(0.62, '#4e8f6a');
      gradient.addColorStop(0.82, '#7ea36d');
      gradient.addColorStop(1, '#2d3e2a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Aggressive raise so jungle hills/tree line remain visible above the scene horizon.
      const horizonY = height * 0.47;
      const mist = ctx.createLinearGradient(0, horizonY - 100, 0, horizonY + 60);
      mist.addColorStop(0, 'rgba(200,255,220,0)');
      mist.addColorStop(0.45, 'rgba(170,230,185,0.07)');
      mist.addColorStop(1, 'rgba(40,70,45,0.16)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, horizonY - 100, width, 180);

      // Distant jungle hills
      ctx.beginPath();
      ctx.moveTo(0, horizonY + 20);
      for (let x = 0; x <= width; x += 10) {
        const nx = x / width;
        const hill =
          Math.sin(nx * Math.PI * 3.6 + 0.5) * 30 +
          Math.cos(nx * Math.PI * 7.7) * 14 +
          Math.sin(nx * Math.PI * 15.0 + 0.9) * 8;
        ctx.lineTo(x, horizonY - 28 - hill);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = '#203522';
      ctx.fill();

      // Mid canopy line
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const nx = x / width;
        const canopy =
          Math.sin(nx * Math.PI * 8.2 + 0.2) * 18 +
          Math.cos(nx * Math.PI * 17.4 + 0.5) * 9 +
          Math.sin(nx * Math.PI * 29.1 - 0.7) * 4;
        const y = horizonY + 6 - canopy;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(42, 90, 54, 0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dense tree silhouettes
      for (let i = 0; i < 100; i += 1) {
        const x = (i / 100) * width;
        const h = 34 + this._rand01(i + 2701) * 80;
        const w = 4 + this._rand01(i + 2737) * 10;
        const baseY = horizonY + 34;
        ctx.fillStyle = `rgba(${(12 + this._rand01(i + 2767) * 14).toFixed(0)}, ${(26 + this._rand01(i + 2801) * 25).toFixed(0)}, ${(12 + this._rand01(i + 2833) * 16).toFixed(0)}, 0.92)`;
        ctx.fillRect(x, baseY - h, w, h);
        ctx.beginPath();
        ctx.arc(x + w * 0.5, baseY - h + 10, 8 + this._rand01(i + 2879) * 18, 0, Math.PI * 2);
        ctx.arc(x + w * 0.5 + 8, baseY - h + 6, 6 + this._rand01(i + 2903) * 16, 0, Math.PI * 2);
        ctx.arc(x + w * 0.5 - 7, baseY - h + 8, 5 + this._rand01(i + 2939) * 14, 0, Math.PI * 2);
        ctx.fill();
      }

      // Full-sky canopy ceiling (dense overlapping foliage to mostly cover the sky)
      const canopyBands = [
        { yMin: 0.02, yMax: 0.22, rMin: 40, rMax: 120, alpha: 0.92, color: [12, 30, 15] },
        { yMin: 0.10, yMax: 0.38, rMin: 35, rMax: 105, alpha: 0.78, color: [15, 40, 20] },
        { yMin: 0.20, yMax: 0.55, rMin: 28, rMax: 90, alpha: 0.62, color: [20, 55, 28] }
      ];
      canopyBands.forEach((band, bandIndex) => {
        const count = 140 + bandIndex * 70;
        for (let i = 0; i < count; i += 1) {
          const seedBase = 5000 + bandIndex * 1000 + i * 7;
          const cx = this._rand01(seedBase + 3) * width;
          const cy = (band.yMin + this._rand01(seedBase + 11) * (band.yMax - band.yMin)) * height;
          const rx = band.rMin + this._rand01(seedBase + 17) * (band.rMax - band.rMin);
          const ry = rx * (0.42 + this._rand01(seedBase + 23) * 0.38);
          const rot = this._rand01(seedBase + 29) * 0.8 - 0.4;
          const alpha = (band.alpha * (0.82 + this._rand01(seedBase + 31) * 0.25)).toFixed(3);
          const tone = 0.8 + this._rand01(seedBase + 37) * 0.35;
          const [r, g, b] = band.color;
          ctx.fillStyle = `rgba(${(r * tone).toFixed(0)}, ${(g * tone).toFixed(0)}, ${(b * tone).toFixed(0)}, ${alpha})`;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Branch silhouettes crossing the sky
      ctx.strokeStyle = 'rgba(13, 18, 11, 0.75)';
      ctx.lineWidth = 6;
      for (let i = 0; i < 22; i += 1) {
        const x0 = this._rand01(i + 6201) * width;
        const y0 = this._rand01(i + 6233) * height * 0.55;
        const len = 90 + this._rand01(i + 6269) * 230;
        const dir = this._rand01(i + 6299) > 0.5 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(
          x0 + len * 0.35 * dir,
          y0 - 14 - this._rand01(i + 6337) * 34,
          x0 + len * dir,
          y0 + (this._rand01(i + 6371) - 0.5) * 24
        );
        ctx.stroke();
      }

      // Small canopy light gaps (dappled peeks)
      for (let i = 0; i < 120; i += 1) {
        const x = this._rand01(i + 6401) * width;
        const y = this._rand01(i + 6449) * height * 0.55;
        const r = 2 + this._rand01(i + 6481) * 10;
        const a = 0.015 + this._rand01(i + 6517) * 0.045;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.65, this._rand01(i + 6553) * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 255, 210, ${a.toFixed(3)})`;
        ctx.fill();
      }
    } else if (themeId === 'hyperborea') {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#030611');
      gradient.addColorStop(0.35, '#0b1733');
      gradient.addColorStop(0.62, '#1d3558');
      gradient.addColorStop(0.82, '#31557f');
      gradient.addColorStop(1, '#1e263d');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 600; i += 1) {
        const x = this._rand01(i + 3101) * width;
        const y = this._rand01(i + 3137) * height * 0.65;
        const r = 0.5 + this._rand01(i + 3169) * 1.6;
        const a = 0.12 + this._rand01(i + 3203) * 0.45;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,235,255,${a.toFixed(2)})`;
        ctx.fill();
      }

      // Aurora ribbons
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 12) {
          const nx = x / width;
          const y =
            height * (0.18 + i * 0.1) +
            Math.sin(nx * Math.PI * (2.8 + i * 0.6) + i * 0.9) * (18 + i * 8) +
            Math.cos(nx * Math.PI * (7.1 + i)) * (6 + i * 3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = i === 1
          ? 'rgba(70,255,210,0.18)'
          : 'rgba(120,230,255,0.16)';
        ctx.lineWidth = 18 - i * 4;
        ctx.stroke();
        ctx.strokeStyle = i === 1
          ? 'rgba(150,255,235,0.18)'
          : 'rgba(180,240,255,0.16)';
        ctx.lineWidth = 6 - i;
        ctx.stroke();
      }

      // Aggressive raise so the ice ridge skyline is visible in normal camera framing.
      const horizonY = height * 0.48;
      ctx.beginPath();
      ctx.moveTo(0, horizonY + 20);
      for (let x = 0; x <= width; x += 8) {
        const nx = x / width;
        const peak =
          Math.abs(Math.sin(nx * Math.PI * 7.0 + 0.3)) * 75 +
          Math.abs(Math.cos(nx * Math.PI * 14.0 - 0.2)) * 28;
        ctx.lineTo(x, horizonY + 18 - peak);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = '#0b1222';
      ctx.fill();

      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const nx = x / width;
        const peak =
          Math.abs(Math.sin(nx * Math.PI * 7.0 + 0.3)) * 75 +
          Math.abs(Math.cos(nx * Math.PI * 14.0 - 0.2)) * 28;
        const y = horizonY + 18 - peak;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(190,235,255,0.3)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      const iceHaze = ctx.createLinearGradient(0, horizonY - 20, 0, horizonY + 80);
      iceHaze.addColorStop(0, 'rgba(180,230,255,0.05)');
      iceHaze.addColorStop(0.5, 'rgba(140,190,255,0.08)');
      iceHaze.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = iceHaze;
      ctx.fillRect(0, horizonY - 20, width, 110);
    } else if (themeId === 'ireland') {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#66727d');
      gradient.addColorStop(0.35, '#7e8991');
      gradient.addColorStop(0.62, '#9ba4a8');
      gradient.addColorStop(0.82, '#a6b0ae');
      gradient.addColorStop(1, '#6d7a74');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Layered gray clouds
      for (let i = 0; i < 36; i += 1) {
        const cx = this._rand01(i + 3301) * width;
        const cy = this._rand01(i + 3337) * height * 0.52;
        const w = 100 + this._rand01(i + 3371) * 220;
        const h = 24 + this._rand01(i + 3403) * 40;
        ctx.fillStyle = `rgba(${(170 + this._rand01(i + 3433) * 35).toFixed(0)}, ${(176 + this._rand01(i + 3467) * 35).toFixed(0)}, ${(178 + this._rand01(i + 3499) * 35).toFixed(0)}, ${(0.06 + this._rand01(i + 3533) * 0.1).toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, w, h, this._rand01(i + 3571) * 0.4 - 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Raise the skyline art so it stays visible above the scene floor line/haze.
      const horizonY = height * 0.62;
      const drawHillLayer = (baseY, amp1, amp2, color) => {
        ctx.beginPath();
        ctx.moveTo(0, baseY + 20);
        for (let x = 0; x <= width; x += 8) {
          const nx = x / width;
          const y = baseY -
            Math.sin(nx * Math.PI * 3.1 + 0.4) * amp1 -
            Math.cos(nx * Math.PI * 7.4 - 0.5) * amp2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };
      drawHillLayer(horizonY - 82, 16, 7, '#80ad72');
      drawHillLayer(horizonY - 56, 20, 8, '#6f9f61');
      drawHillLayer(horizonY - 28, 24, 10, '#5a864f');
      drawHillLayer(horizonY + 6, 30, 13, '#456d43');
      drawHillLayer(horizonY + 38, 38, 16, '#2f4a31');

      // Brighter ridge highlights for green rolling skyline
      for (let i = 0; i < 4; i += 1) {
        const baseY = [horizonY - 82, horizonY - 56, horizonY - 28, horizonY + 6][i];
        const amp1 = [16, 20, 24, 30][i];
        const amp2 = [7, 8, 10, 13][i];
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const nx = x / width;
          const y = baseY -
            Math.sin(nx * Math.PI * 3.1 + 0.4) * amp1 -
            Math.cos(nx * Math.PI * 7.4 - 0.5) * amp2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = i <= 1 ? 'rgba(178,214,164,0.42)' : 'rgba(128,176,118,0.26)';
        ctx.lineWidth = i <= 1 ? 2.6 : 1.8;
        ctx.stroke();
      }

      // Atmospheric glow band to separate hills/castles from the cloud deck.
      const hillGlow = ctx.createLinearGradient(0, horizonY - 110, 0, horizonY + 10);
      hillGlow.addColorStop(0, 'rgba(210,230,210,0.06)');
      hillGlow.addColorStop(0.45, 'rgba(190,220,190,0.14)');
      hillGlow.addColorStop(1, 'rgba(140,180,140,0.00)');
      ctx.fillStyle = hillGlow;
      ctx.fillRect(0, horizonY - 110, width, 140);

      // Single distant castle silhouette along skyline
      const castleBaseY = horizonY - 62;
      const drawCastle = (x, scale = 1) => {
        const w = 52 * scale;
        const h = 66 * scale;
        const baseY = castleBaseY + (this._rand01(x + 7000) - 0.5) * 12;

        ctx.fillStyle = 'rgba(205,220,205,0.08)';
        ctx.beginPath();
        ctx.ellipse(x + w * 0.4, baseY - h * 0.75, w * 1.0, h * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(70,74,73,0.62)';
        ctx.beginPath();
        ctx.rect(x, baseY - h * 0.62, w * 0.64, h * 0.40);
        ctx.rect(x + w * 0.62, baseY - h * 0.55, w * 0.20, h * 0.33);
        ctx.fill();

        // Main keep
        ctx.fillStyle = 'rgba(46,49,49,0.92)';
        ctx.beginPath();
        ctx.rect(x + w * 0.18, baseY - h, w * 0.30, h * 0.78);
        ctx.fill();

        // Towers
        const towerXs = [x + w * 0.02, x + w * 0.52];
        towerXs.forEach((tx, idx) => {
          const tw = w * (0.16 + idx * 0.015);
          const th = h * (0.78 + idx * 0.12);
          ctx.fillStyle = 'rgba(37,40,40,0.96)';
          ctx.beginPath();
          ctx.rect(tx, baseY - th, tw, th);
          ctx.fill();

          // Battlements
          ctx.fillStyle = 'rgba(28,31,31,0.98)';
          for (let c = 0; c < 3; c += 1) {
            ctx.fillRect(tx + c * (tw / 3), baseY - th - 4 * scale, tw / 4, 4 * scale);
          }
          ctx.fillStyle = 'rgba(28,31,31,0.98)';
          ctx.fillRect(tx + tw * 0.25, baseY - th - 8 * scale, tw * 0.18, 5 * scale);
        });

        // Small flags
        ctx.strokeStyle = 'rgba(100,105,103,0.65)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.10, baseY - h * 0.90);
        ctx.lineTo(x + w * 0.10, baseY - h * 1.05);
        ctx.moveTo(x + w * 0.60, baseY - h * 1.02);
        ctx.lineTo(x + w * 0.60, baseY - h * 1.16);
        ctx.stroke();
        ctx.fillStyle = 'rgba(118,132,118,0.35)';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.10, baseY - h * 1.05);
        ctx.lineTo(x + w * 0.16, baseY - h * 1.02);
        ctx.lineTo(x + w * 0.10, baseY - h * 0.99);
        ctx.fill();

        // Thin highlight edges so the silhouette still reads at distance.
        ctx.strokeStyle = 'rgba(185,198,189,0.16)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(x, baseY - h * 0.62);
        ctx.lineTo(x + w * 0.64, baseY - h * 0.62);
        ctx.moveTo(x + w * 0.18, baseY - h);
        ctx.lineTo(x + w * 0.48, baseY - h);
        ctx.stroke();
      };

      const castleX = width * 0.66 + (this._rand01(6801) - 0.5) * 36;
      const castleScale = 0.46 + this._rand01(6839) * 0.14;
      drawCastle(castleX, castleScale);

      // Subtle hedge/stone wall lines
      for (let i = 0; i < 24; i += 1) {
        const y = horizonY + 8 + i * 6;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(80,95,82,0.07)' : 'rgba(95,106,96,0.05)';
        ctx.beginPath();
        for (let x = 0; x <= width; x += 14) {
          const jy = y + Math.sin(x * 0.02 + i * 0.5) * 1.8;
          if (x === 0) ctx.moveTo(x, jy);
          else ctx.lineTo(x, jy);
        }
        ctx.stroke();
      }

      // Faint rain streaks baked into skybox (actual intermittent rain is dynamic)
      for (let i = 0; i < 260; i += 1) {
        const x = this._rand01(i + 3607) * width;
        const y = this._rand01(i + 3643) * height * 0.72;
        const len = 8 + this._rand01(i + 3677) * 18;
        ctx.strokeStyle = `rgba(210,220,230,${(0.02 + this._rand01(i + 3719) * 0.035).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - len * 0.22, y + len);
        ctx.stroke();
      }
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#05040f');
      gradient.addColorStop(0.36, '#120a2e');
      gradient.addColorStop(0.58, '#2a0f45');
      gradient.addColorStop(0.74, '#82245b');
      gradient.addColorStop(0.84, '#ff6b3a');
      gradient.addColorStop(1, '#180814');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Raise Tron horizon/sun composition so the skyline is visible above the scene horizon.
      const horizonY = height * 0.56;
      const sunX = width * 0.5;
      const sunY = height * 0.40;
      const sunRadius = height * 0.15;

      // Sunset glow
      const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2.8);
      glow.addColorStop(0, 'rgba(255, 196, 92, 0.38)');
      glow.addColorStop(0.35, 'rgba(255, 116, 76, 0.26)');
      glow.addColorStop(0.7, 'rgba(255, 0, 120, 0.14)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Striped outrun sun
      ctx.save();
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.clip();
      const sunGradient = ctx.createLinearGradient(0, sunY - sunRadius, 0, sunY + sunRadius);
      sunGradient.addColorStop(0, '#fff4a8');
      sunGradient.addColorStop(0.35, '#ffb34d');
      sunGradient.addColorStop(0.75, '#ff5c66');
      sunGradient.addColorStop(1, '#ff2d96');
      ctx.fillStyle = sunGradient;
      ctx.fillRect(sunX - sunRadius, sunY - sunRadius, sunRadius * 2, sunRadius * 2);
      for (let i = 0; i < 8; i += 1) {
        const y = sunY - sunRadius + 8 + i * (sunRadius * 0.22);
        const bandH = 5 + i * 1.2;
        ctx.fillStyle = 'rgba(25, 5, 25, 0.42)';
        ctx.fillRect(sunX - sunRadius, y, sunRadius * 2, bandH);
      }
      ctx.restore();
      ctx.strokeStyle = 'rgba(255, 155, 110, 0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.stroke();

      // High sky stars
      for (let i = 0; i < 420; i += 1) {
        const x = this._rand01(i + 401) * width;
        const y = this._rand01(i + 433) * height * 0.5;
        const r = 0.5 + this._rand01(i + 461) * 1.2;
        const alpha = 0.15 + this._rand01(i + 487) * 0.4;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 255, 255, ${alpha.toFixed(2)})`;
        ctx.fill();
      }

      // Distant outrun mountains (back layer)
      ctx.beginPath();
      ctx.moveTo(0, horizonY + 18);
      for (let x = 0; x <= width; x += 14) {
        const nx = x / width;
        const peak =
          Math.sin(nx * Math.PI * 3.8 + 0.3) * 40 +
          Math.sin(nx * Math.PI * 9.2 + 0.9) * 20 +
          Math.cos(nx * Math.PI * 15.6 - 0.2) * 10;
        ctx.lineTo(x, horizonY - 28 - peak);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = '#150b27';
      ctx.fill();

      // Mountain neon ridge
      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const nx = x / width;
        const peak =
          Math.sin(nx * Math.PI * 3.8 + 0.3) * 40 +
          Math.sin(nx * Math.PI * 9.2 + 0.9) * 20 +
          Math.cos(nx * Math.PI * 15.6 - 0.2) * 10;
        const y = horizonY - 28 - peak;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255, 70, 175, 0.55)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Foreground mountains (darker, sharper)
      ctx.beginPath();
      ctx.moveTo(0, horizonY + 34);
      for (let x = 0; x <= width; x += 10) {
        const nx = x / width;
        const peak =
          Math.sin(nx * Math.PI * 5.4 - 0.5) * 54 +
          Math.cos(nx * Math.PI * 11.4 + 1.0) * 18 +
          Math.sin(nx * Math.PI * 23.0 + 0.2) * 8;
        ctx.lineTo(x, horizonY + 10 - peak);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = '#0a0614';
      ctx.fill();

      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const nx = x / width;
        const peak =
          Math.sin(nx * Math.PI * 5.4 - 0.5) * 54 +
          Math.cos(nx * Math.PI * 11.4 + 1.0) * 18 +
          Math.sin(nx * Math.PI * 23.0 + 0.2) * 8;
        const y = horizonY + 10 - peak;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(70, 220, 255, 0.38)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Neon city silhouette across horizon
      const skylineBase = horizonY - 4;
      for (let i = 0; i < 90; i += 1) {
        const x = (i / 90) * width;
        const w = 7 + this._rand01(i + 521) * 15;
        const h = 10 + this._rand01(i + 557) * 86;
        const y = skylineBase - h;
        ctx.fillStyle = `rgba(${(20 + this._rand01(i + 593) * 25).toFixed(0)}, ${(6 + this._rand01(i + 607) * 16).toFixed(0)}, ${(34 + this._rand01(i + 619) * 30).toFixed(0)}, 0.95)`;
        ctx.fillRect(x, y, w, h);

        // Neon roof edge
        ctx.fillStyle = this._rand01(i + 643) > 0.55 ? 'rgba(255, 70, 175, 0.55)' : 'rgba(0, 240, 255, 0.45)';
        ctx.fillRect(x, y, w, 1.5);

        // Sparse windows
        const cols = Math.max(1, Math.floor(w / 4));
        const rows = Math.max(1, Math.floor(h / 7));
        for (let cy = 0; cy < rows; cy += 1) {
          for (let cx = 0; cx < cols; cx += 1) {
            if (this._rand01(i * 100 + cy * 13 + cx * 31 + 677) < 0.76) continue;
            const wx = x + 1 + cx * (w / cols);
            const wy = y + 2 + cy * (h / rows);
            ctx.fillStyle = this._rand01(i + cy * 9 + cx * 5 + 701) > 0.5
              ? 'rgba(255, 195, 95, 0.55)'
              : 'rgba(0, 245, 255, 0.38)';
            ctx.fillRect(wx, wy, 1.4, 2.2);
          }
        }
      }

      // Horizon haze + reflected neon strip
      const haze = ctx.createLinearGradient(0, horizonY - 32, 0, horizonY + 78);
      haze.addColorStop(0, 'rgba(255, 120, 95, 0.14)');
      haze.addColorStop(0.4, 'rgba(255, 0, 150, 0.09)');
      haze.addColorStop(1, 'rgba(0, 255, 255, 0.02)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, horizonY - 32, width, 110);

      // Subtle scanlines
      for (let y = 0; y < height; y += 3) {
        ctx.fillStyle = `rgba(0, 255, 255, ${y < horizonY ? 0.007 : 0.012})`;
        ctx.fillRect(0, y, width, 1);
      }

      // Neon vertical atmospheric streaks
      for (let i = 0; i < 18; i += 1) {
        const x = this._rand01(i + 751) * width;
        const w = 1 + this._rand01(i + 769) * 2;
        const h = height * (0.22 + this._rand01(i + 787) * 0.38);
        const y = height * (0.18 + this._rand01(i + 809) * 0.3);
        const alpha = 0.03 + this._rand01(i + 827) * 0.05;
        const verticalGlow = ctx.createLinearGradient(0, y, 0, y + h);
        verticalGlow.addColorStop(0, 'rgba(0,255,255,0)');
        verticalGlow.addColorStop(0.5, `rgba(0,255,255,${alpha.toFixed(3)})`);
        verticalGlow.addColorStop(1, 'rgba(255,0,170,0)');
        ctx.fillStyle = verticalGlow;
        ctx.fillRect(x, y, w, h);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    if ('colorSpace' in texture && 'SRGBColorSpace' in THREE) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    texture.needsUpdate = true;
    return texture;
  }

  _getThemeBackgroundColor(themeId = this.worldThemeId) {
    switch (themeId) {
      case 'moon':
        return 0x020304;
      case 'beach':
        return 0x86d7ff;
      case 'desert':
        return 0x6b3d3a;
      case 'jungle':
        return 0x213c32;
      case 'hyperborea':
        return 0x071126;
      case 'ireland':
        return 0x71807a;
      case 'tron':
      default:
        return 0x000428;
    }
  }

  _rebuildSky() {
    this._clearSky();
    const skyTexture = this._createSkyTexture(this.worldThemeId);
    const skyMaterial = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });
    const skyGeometry = new THREE.SphereGeometry(4500, 32, 20);
    this.skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
    this.skyDome.renderOrder = -1;
    this.scene.add(this.skyDome);
    this._updateSkyAnchor();
    this.scene.background = new THREE.Color(this._getThemeBackgroundColor(this.worldThemeId));
  }

  _updateThemeLighting() {
    if (!this.ambientLight || !this.sunLight) return;

    switch (this.worldThemeId) {
      case 'moon':
        this.ambientLight.color.set(0xd8dde5);
        this.ambientLight.intensity = 0.42;
        this.sunLight.color.set(0xfff8ea);
        this.sunLight.intensity = 1.35;
        this.sunLight.position.set(260, 320, -120);
        this.scene.fog = new THREE.Fog(0x090a0b, 900, 5200);
        break;
      case 'beach':
        this.ambientLight.color.set(0xf4f7ff);
        this.ambientLight.intensity = 0.95;
        this.sunLight.color.set(0xfff0b2);
        this.sunLight.intensity = 1.15;
        this.sunLight.position.set(-180, 300, 120);
        this.scene.fog = new THREE.Fog(0x89d6f7, 1300, 6200);
        break;
      case 'desert':
        this.ambientLight.color.set(0xf7d7a6);
        this.ambientLight.intensity = 0.72;
        this.sunLight.color.set(0xffd39d);
        this.sunLight.intensity = 1.25;
        this.sunLight.position.set(220, 340, 40);
        this.scene.fog = new THREE.Fog(0x9f6a53, 1100, 5200);
        break;
      case 'jungle':
        this.ambientLight.color.set(0xb8d4b8);
        this.ambientLight.intensity = 0.7;
        this.sunLight.color.set(0xd8f2c6);
        this.sunLight.intensity = 0.8;
        this.sunLight.position.set(120, 260, -190);
        this.scene.fog = new THREE.Fog(0x314936, 900, 4200);
        break;
      case 'hyperborea':
        this.ambientLight.color.set(0xbfd5ea);
        this.ambientLight.intensity = 0.58;
        this.sunLight.color.set(0xe7f6ff);
        this.sunLight.intensity = 1.0;
        this.sunLight.position.set(-220, 300, -140);
        this.scene.fog = new THREE.Fog(0x0d1b34, 1000, 5400);
        break;
      case 'ireland':
        this.ambientLight.color.set(0xd7e0db);
        this.ambientLight.intensity = 0.82;
        this.sunLight.color.set(0xe8ecef);
        this.sunLight.intensity = 0.55;
        this.sunLight.position.set(-130, 250, 160);
        this.scene.fog = new THREE.Fog(0x72847d, 900, 4300);
        break;
      case 'tron':
      default:
        this.ambientLight.color.set(0xffffff);
        this.ambientLight.intensity = 1.15;
        this.sunLight.color.set(0x66ccff);
        this.sunLight.intensity = 0.35;
        this.sunLight.position.set(180, 240, 80);
        this.scene.fog = new THREE.Fog(0x000428, 1100, 5600);
        break;
    }
  }

  _rebuildFloor() {
    this._clearFloor();
    const usesTerrain = this._themeUsesTerrain(this.worldThemeId);
    const material = this._createFloorMaterial(this.worldThemeId);
    this.floorGeometry = usesTerrain
      ? new THREE.PlaneGeometry(this.gridSize, this.gridSize, MOON_FLOOR_SEGMENTS, MOON_FLOOR_SEGMENTS)
      : new THREE.PlaneGeometry(this.gridSize, this.gridSize);
    if (usesTerrain) {
      this._applyThemeTerrainDisplacement(this.floorGeometry, this.worldThemeId);
    }
    this.floor = new THREE.Mesh(this.floorGeometry, material);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = 0;
    this.scene.add(this.floor);
  }

  createGrid() {
    this._rebuildFloor();
  }

  setWorldTheme(themeId = DEFAULT_WORLD_THEME) {
    const nextTheme = normalizeWorldTheme(themeId);
    if (this.worldThemeId === nextTheme && this.floor && this.skyDome) {
      return false;
    }
    this.worldThemeId = nextTheme;
    this._invalidateWorldDecorStreaming();
    this._updateThemeLighting();
    this._rebuildSky();
    this._rebuildFloor();
    this._rebuildWorldDecor();
    this._configureThemeWeather();
    this._applyThemeToAllPlayerEffects();
    this._applyGroundContourToAllPlayers();
    this._worldDecorStreamKey = this._getWorldDecorStreamKey(this.worldThemeId);
    return true;
  }

  getWorldTheme() {
    return this.worldThemeId;
  }

  expandGrid(playerPosition) {
    // Check if player is getting close to grid edge
    const distanceFromCenter = Math.sqrt(
      playerPosition.x * playerPosition.x + 
      playerPosition.z * playerPosition.z
    );
    
    // Expand if within 30% of edge
    const expansionThreshold = this.gridSize * 0.35;
    if (distanceFromCenter > expansionThreshold) {
      // Increase size
      this.gridSize += 200;
      this._rebuildFloor();
      
      console.log('Grid expanded to size:', this.gridSize);
    }
  }

  _getTronTrailSegmentGeometry() {
    if (!this._tronTrailSegmentGeometry) {
      this._tronTrailSegmentGeometry = new THREE.BoxGeometry(2.2, 1.1, 6.5);
    }
    return this._tronTrailSegmentGeometry;
  }

  _getMoonDustGeometry() {
    if (!this._moonDustGeometry) {
      this._moonDustGeometry = new THREE.SphereGeometry(1, 6, 5);
    }
    return this._moonDustGeometry;
  }

  _createPlayerFaceMaterial(color) {
    return new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
      shininess: 100
    });
  }

  _getPlayerVideoFaceIndex(id) {
    return id === this.localPlayerId
      ? PLAYER_VIDEO_FACE_LOCAL_REAR
      : PLAYER_VIDEO_FACE_REMOTE_FRONT;
  }

  _applyPlayerVideoFaceMaterial(id) {
    const player = this.players.get(id);
    if (!player?.userData?.videoTexture) return;

    const videoTexture = player.userData.videoTexture;
    if (!Array.isArray(player.material)) {
      player.material = new THREE.MeshBasicMaterial({ map: videoTexture });
      return;
    }

    const targetFaceIndex = this._getPlayerVideoFaceIndex(id);
    const baseColor = player.userData.originalColor
      || (player.material.find((mat) => mat?.color)?.color?.clone?.() ?? new THREE.Color('#00ffff'));

    player.material = player.material.map((mat, index) => {
      const isVideoFace = mat?.map === videoTexture;

      if (index === targetFaceIndex) {
        if (isVideoFace && mat?.isMeshBasicMaterial) return mat;
        this._disposeMaterial(mat);
        return new THREE.MeshBasicMaterial({ map: videoTexture });
      }

      if (isVideoFace) {
        // Do not dispose the shared VideoTexture when demoting a previously video-mapped face.
        mat.map = null;
        mat.dispose?.();
        return this._createPlayerFaceMaterial(baseColor);
      }

      return mat;
    });
  }

  _createPlayerThemeEffects(color) {
    const effects = {
      lastPosition: null,
      lastExactPosition: null,
      moveCooldown: 0,
      trailCooldown: 0,
      dustCooldown: 0,
      landingPoofCooldown: 0,
      groundY: null,
      airborne: false,
      airborneTime: 0,
      airbornePeakY: null,
      lastVerticalSpeed: 0,
      tronSegments: [],
      moonDust: []
    };

    const trailGeometry = this._getTronTrailSegmentGeometry();
    for (let i = 0; i < TRON_TRAIL_SEGMENT_POOL; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const segment = new THREE.Mesh(trailGeometry, material);
      segment.visible = false;
      segment.renderOrder = 2;
      segment.userData = { life: 0, maxLife: 0.55 };
      this.scene.add(segment);
      effects.tronSegments.push(segment);
    }

    const dustGeometry = this._getMoonDustGeometry();
    for (let i = 0; i < MOON_DUST_PUFF_POOL; i += 1) {
      const material = new THREE.MeshStandardMaterial({
        color: 0xc7c7c7,
        transparent: true,
        opacity: 0,
        roughness: 1.0,
        metalness: 0.0,
        depthWrite: false
      });
      const puff = new THREE.Mesh(dustGeometry, material);
      puff.visible = false;
      puff.userData = {
        life: 0,
        maxLife: 0.9,
        velocity: new THREE.Vector3(),
        growth: 1,
        baseScale: 1
      };
      this.scene.add(puff);
      effects.moonDust.push(puff);
    }

    return effects;
  }

  _setPlayerTrailColor(player, color) {
    const effects = player?.userData?.themeEffects;
    if (!effects?.tronSegments) return;
    effects.tronSegments.forEach((segment) => {
      if (segment?.material?.color) {
        segment.material.color.set(color);
      }
    });
  }

  _applyThemeToPlayerEffects(player) {
    const effects = player?.userData?.themeEffects;
    if (!effects) return;
    const tronEnabled = this.worldThemeId === 'tron';
    const moonEnabled = this.worldThemeId === 'moon';
    effects.tronSegments?.forEach((segment) => {
      if (!tronEnabled) {
        segment.visible = false;
        segment.userData.life = 0;
        if (segment.material) segment.material.opacity = 0;
      }
    });
    effects.moonDust?.forEach((puff) => {
      if (!moonEnabled) {
        puff.visible = false;
        puff.userData.life = 0;
        if (puff.material) puff.material.opacity = 0;
      }
    });
  }

  _applyThemeToAllPlayerEffects() {
    this.players.forEach((player) => this._applyThemeToPlayerEffects(player));
  }

  _destroyPlayerThemeEffects(player) {
    const effects = player?.userData?.themeEffects;
    if (!effects) return;
    effects.tronSegments?.forEach((segment) => {
      this.scene.remove(segment);
      this._disposeMaterial(segment.material);
    });
    effects.moonDust?.forEach((puff) => {
      this.scene.remove(puff);
      this._disposeMaterial(puff.material);
    });
    player.userData.themeEffects = null;
  }

  _spawnTronTrail(effects, player, moveDir, speed) {
    if (this.worldThemeId !== 'tron' || speed < 1.8) return;
    if (effects.trailCooldown > 0) return;
    effects.trailCooldown = 0.035;
    const segment = effects.tronSegments.find((entry) => !entry.visible || entry.userData.life <= 0) || effects.tronSegments[0];
    if (!segment) return;

    const forward = moveDir.clone();
    if (forward.lengthSq() < 1e-6) return;
    forward.normalize();

    const pos = player.position.clone();
    pos.y += 2.1;
    segment.position.copy(pos);
    segment.lookAt(pos.clone().add(forward));
    segment.rotateY(Math.PI);

    const lengthScale = THREE.MathUtils.clamp(0.75 + speed * 0.08, 0.9, 2.6);
    segment.scale.set(1, 1, lengthScale);
    segment.visible = true;
    segment.userData.life = segment.userData.maxLife;
    if (segment.material) {
      segment.material.opacity = 0.8;
    }
  }

  _spawnMoonDust(effects, player, moveDir, speed) {
    if (this.worldThemeId !== 'moon' || speed < 1.2) return;
    if (effects.dustCooldown > 0) return;
    effects.dustCooldown = 0.05;
    const puff = effects.moonDust.find((entry) => !entry.visible || entry.userData.life <= 0) || effects.moonDust[0];
    if (!puff) return;

    const dir = moveDir.clone();
    if (dir.lengthSq() < 1e-6) return;
    dir.normalize();

    const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar((Math.random() - 0.5) * 2.2);
    const spawn = player.position.clone();
    spawn.x -= dir.x * (1.8 + Math.random() * 1.5);
    spawn.z -= dir.z * (1.8 + Math.random() * 1.5);
    spawn.add(side);
    spawn.y = player.position.y + 0.35 + Math.random() * 0.5;

    const data = puff.userData;
    puff.position.copy(spawn);
    puff.rotation.set(Math.random(), Math.random(), Math.random());
    data.velocity.set(
      -dir.x * (0.45 + Math.random() * 0.65) + side.x * 0.08,
      0.7 + Math.random() * 0.9,
      -dir.z * (0.45 + Math.random() * 0.65) + side.z * 0.08
    );
    data.maxLife = 0.5 + Math.random() * 0.5;
    data.life = data.maxLife;
    data.baseScale = 0.6 + Math.random() * 0.8;
    data.growth = 1.4 + Math.random() * 1.2;
    puff.scale.setScalar(data.baseScale);
    puff.visible = true;
    if (puff.material) {
      puff.material.opacity = 0.28;
      const c = 0.72 + Math.random() * 0.12;
      puff.material.color.setRGB(c, c, c);
    }
  }

  _getMoonDustGroundY(player, x, z) {
    const playerFootY = (player?.position?.y ?? 0) - PLAYER_HALF_HEIGHT + 0.18;
    if (this.worldThemeId !== 'moon') return playerFootY;
    const terrainY = this._sampleMoonHeight(x, z) + 0.1;
    return Math.max(playerFootY, terrainY);
  }

  _spawnMoonLandingPoof(effects, player, impactSpeed = 0) {
    if (this.worldThemeId !== 'moon') return;
    if (effects.landingPoofCooldown > 0) return;
    effects.landingPoofCooldown = MOON_LANDING_POOF_COOLDOWN;

    const center = player.position.clone();
    const burstStrength = THREE.MathUtils.clamp(impactSpeed * 0.06, 0.8, 1.9);
    const puffCount = Math.round(THREE.MathUtils.lerp(5, 9, (burstStrength - 0.8) / 1.1));

    for (let i = 0; i < puffCount; i += 1) {
      const puff = effects.moonDust.find((entry) => !entry.visible || entry.userData.life <= 0) || effects.moonDust[0];
      if (!puff) break;

      const angle = (i / puffCount) * Math.PI * 2 + Math.random() * 0.55;
      const radius = 1.6 + Math.random() * (3.5 + burstStrength * 2.5);
      const x = center.x + Math.cos(angle) * radius;
      const z = center.z + Math.sin(angle) * radius;
      const y = this._getMoonDustGroundY(player, x, z) + Math.random() * 0.45;

      const data = puff.userData;
      puff.position.set(x, y, z);
      puff.rotation.set(Math.random(), Math.random(), Math.random());
      data.velocity.set(
        Math.cos(angle) * (1.0 + Math.random() * 1.6) * burstStrength,
        0.85 + Math.random() * 0.95 * burstStrength,
        Math.sin(angle) * (1.0 + Math.random() * 1.6) * burstStrength
      );
      data.maxLife = 0.75 + Math.random() * 0.55;
      data.life = data.maxLife;
      data.baseScale = 1.2 + Math.random() * 1.4 * burstStrength;
      data.growth = 1.8 + Math.random() * 1.7;
      puff.scale.setScalar(data.baseScale);
      puff.visible = true;
      if (puff.material) {
        puff.material.opacity = 0.34;
        const c = 0.72 + Math.random() * 0.08;
        puff.material.color.setRGB(c, c, c);
      }
    }
  }

  _updatePlayerThemeEffects(dt) {
    const safeDt = Math.min(Math.max(dt, 1 / 240), 0.1);
    this.players.forEach((player) => {
      let effects = player.userData.themeEffects;
      if (!effects) {
        effects = this._createPlayerThemeEffects(player.userData.originalColor || player.material?.[0]?.color || '#00ffff');
        player.userData.themeEffects = effects;
        this._applyThemeToPlayerEffects(player);
      }

      effects.trailCooldown = Math.max(0, (effects.trailCooldown || 0) - safeDt);
      effects.dustCooldown = Math.max(0, (effects.dustCooldown || 0) - safeDt);
      effects.landingPoofCooldown = Math.max(0, (effects.landingPoofCooldown || 0) - safeDt);

      const currentPos = player.position.clone();
      if (!effects.lastPosition) {
        effects.lastPosition = currentPos;
        effects.lastExactPosition = currentPos.clone();
        effects.groundY = currentPos.y;
        effects.airbornePeakY = currentPos.y;
      }

      const moveVec = currentPos.clone().sub(effects.lastPosition);
      const exactMoveVec = currentPos.clone().sub(effects.lastExactPosition || effects.lastPosition);
      const horizontalMoveVec = moveVec.clone();
      horizontalMoveVec.y = 0;
      const speed = horizontalMoveVec.length() / Math.max(safeDt, 1e-4);
      const verticalSpeed = exactMoveVec.y / Math.max(safeDt, 1e-4);
      const heightAboveGround = currentPos.y - (effects.groundY ?? currentPos.y);
      const groundedNow =
        Math.abs(heightAboveGround) <= MOON_LANDING_GROUNDED_TOLERANCE &&
        Math.abs(verticalSpeed) < 3.2;
      const airborneNow =
        heightAboveGround > MOON_LANDING_AIRBORNE_HEIGHT ||
        (effects.airborne && heightAboveGround > 0.15);

      if (!effects.airborne && groundedNow) {
        effects.groundY = THREE.MathUtils.lerp(effects.groundY ?? currentPos.y, currentPos.y, 0.25);
      }

      if (!effects.airborne && airborneNow) {
        effects.airborne = true;
        effects.airborneTime = 0;
        effects.airbornePeakY = currentPos.y;
      } else if (effects.airborne) {
        effects.airborneTime += safeDt;
        effects.airbornePeakY = Math.max(effects.airbornePeakY ?? currentPos.y, currentPos.y);
        const dropHeight = (effects.airbornePeakY ?? currentPos.y) - (effects.groundY ?? currentPos.y);
        const landed =
          groundedNow &&
          effects.airborneTime > 0.07 &&
          dropHeight > 0.8 &&
          (verticalSpeed < -2 || effects.lastVerticalSpeed < -4);
        if (landed) {
          this._spawnMoonLandingPoof(
            effects,
            player,
            Math.max(Math.abs(verticalSpeed), Math.abs(effects.lastVerticalSpeed || 0))
          );
          effects.airborne = false;
          effects.airborneTime = 0;
          effects.groundY = currentPos.y;
          effects.airbornePeakY = currentPos.y;
        } else if (groundedNow && effects.airborneTime > 0.35 && dropHeight <= 0.8) {
          effects.airborne = false;
          effects.airborneTime = 0;
          effects.groundY = currentPos.y;
          effects.airbornePeakY = currentPos.y;
        }
      }

      if (speed > 0.01) {
        this._spawnTronTrail(effects, player, horizontalMoveVec, speed);
        this._spawnMoonDust(effects, player, horizontalMoveVec, speed);
        effects.lastPosition.copy(currentPos);
      } else {
        effects.lastPosition.lerp(currentPos, 0.2);
      }
      if (effects.lastExactPosition) {
        effects.lastExactPosition.copy(currentPos);
      }
      effects.lastVerticalSpeed = verticalSpeed;

      effects.tronSegments.forEach((segment) => {
        if (!segment.visible) return;
        segment.userData.life -= safeDt;
        if (segment.userData.life <= 0) {
          segment.visible = false;
          segment.userData.life = 0;
          if (segment.material) segment.material.opacity = 0;
          return;
        }
        const t = segment.userData.life / segment.userData.maxLife;
        if (segment.material) {
          segment.material.opacity = 0.75 * t;
        }
        segment.scale.y = 0.7 + t * 0.5;
        segment.scale.x = 0.7 + t * 0.4;
      });

      effects.moonDust.forEach((puff) => {
        if (!puff.visible) return;
        const data = puff.userData;
        data.life -= safeDt;
        if (data.life <= 0) {
          puff.visible = false;
          data.life = 0;
          if (puff.material) puff.material.opacity = 0;
          return;
        }
        const t = data.life / data.maxLife;
        data.velocity.y += 0.25 * safeDt;
        puff.position.addScaledVector(data.velocity, safeDt);
        puff.position.y += 0.15 * safeDt;
        const scale = data.baseScale * (1 + (1 - t) * data.growth);
        puff.scale.setScalar(scale);
        if (puff.material) {
          puff.material.opacity = 0.28 * t;
        }
      });
    });
  }

  createPlayer(id, color, position) {
    // Create cube for player (6x6x6 - twice as big)
    const geometry = new THREE.BoxGeometry(6, 6, 6);
    
    // Create materials array for each face
    const materials = [];
    for (let i = 0; i < 6; i++) {
      materials.push(this._createPlayerFaceMaterial(color));
    }
    
    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set(position.x, position.y, position.z);
    cube.userData.videoTexture = null;
    cube.userData.videoElement = null;
    cube.userData.headingYaw = 0;
    cube.userData.lastNetworkY = Number.isFinite(position?.y) ? position.y : PLAYER_HALF_HEIGHT;

    // Add glow effect (proportionally bigger, offset back by 1.4 units)
    const glowGeometry = new THREE.BoxGeometry(7.2, 7.2, 7.2);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    //glow.position.z = 1.4; // Offset back so front of cube sticks through
    cube.add(glow);
    cube.userData.glow = glow;

    // Add vertical light beam starting 500 units above the cube
    const beamHeight = 1000; // Very tall beam
    const beamStartOffset = 500; // Start 500 units above cube
    const beamGeometry = new THREE.CylinderGeometry(0.5, 0.5, beamHeight, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.y = beamStartOffset + (beamHeight / 2); // Start 500 units above, then center the beam
    cube.add(beam);
    cube.userData.lightBeam = beam;
    cube.userData.themeEffects = this._createPlayerThemeEffects(color);
    this._applyThemeToPlayerEffects(cube);

    this.scene.add(cube);
    this.players.set(id, cube);
    this._applyPlayerGroundContour(cube, cube.userData.lastNetworkY);
    if (this.pendingVideoStreams.has(id)) {
      const pendingStream = this.pendingVideoStreams.get(id);
      this.pendingVideoStreams.delete(id);
      this.setPlayerVideoStream(id, pendingStream);
    }

    return cube;
  }

  setPlayerVideoStream(id, stream) {
    const player = this.players.get(id);
    if (!player) {
      if (stream) {
        this.pendingVideoStreams.set(id, stream);
      }
      return;
    }
    if (!stream) {
      console.error('No stream provided for player:', id);
      return;
    }

    console.log('Setting video stream for player', id);
    console.log('Stream video tracks:', stream.getVideoTracks().length);

    // Store original color
    if (!player.userData.originalColor) {
      const firstMaterial = Array.isArray(player.material) ? player.material[0] : player.material;
      player.userData.originalColor = firstMaterial.color.clone();
    }

    // Create video element
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true; // Important for mobile
    video.muted = true; // Will control audio separately for proximity
    
    // Wait for video metadata to load before applying texture
    video.onloadedmetadata = () => {
      console.log('Video metadata loaded for', id, 'Dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      // Create video texture
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat;

      // Store references
      player.userData.videoTexture = videoTexture;
      player.userData.videoElement = video;
      this._applyPlayerVideoFaceMaterial(id);
      
      console.log('Applied video texture to player', id);
    };
    
    // Ensure video plays
    video.play().then(() => {
      console.log('Video playing for', id);
    }).catch(err => {
      console.error('Error playing video for', id, err);
    });
  }

  removePlayerVideoStream(id) {
    const player = this.players.get(id);
    if (!player) return;

    console.log('Removing video stream from player', id);

    // Stop and clean up video element
    if (player.userData.videoElement) {
      player.userData.videoElement.pause();
      player.userData.videoElement.srcObject = null;
      player.userData.videoElement = null;
    }

    // Dispose video texture
    if (player.userData.videoTexture) {
      player.userData.videoTexture.dispose();
      player.userData.videoTexture = null;
    }

    // Restore original colored materials
    if (player.userData.originalColor) {
      const materials = [];
      for (let i = 0; i < 6; i++) {
        materials.push(this._createPlayerFaceMaterial(player.userData.originalColor));
      }
      player.material = materials;
    }

    console.log('Restored original materials for player', id);
  }

  updatePlayer(id, position, rotation = null) {
    const player = this.players.get(id);
    if (player) {
      const incomingY = Number.isFinite(position?.y) ? position.y : PLAYER_HALF_HEIGHT;
      player.userData.lastNetworkY = incomingY;
      if (rotation !== null) {
        player.userData.headingYaw = rotation;
      } else if (typeof player.userData.headingYaw !== 'number') {
        player.userData.headingYaw = player.rotation.y || 0;
      }

      // For local player, use direct X/Z positioning for precise physics.
      // For remote players, lerp X/Z for network smoothing and derive Y from terrain + jump offset.
      if (id === this.localPlayerId) {
        player.position.x = position.x;
        player.position.z = position.z;
      } else {
        player.position.x = THREE.MathUtils.lerp(player.position.x, position.x, 0.2);
        player.position.z = THREE.MathUtils.lerp(player.position.z, position.z, 0.2);
      }
      
      if (!this._themeUsesTerrain(this.worldThemeId)) {
        if (id === this.localPlayerId) {
          player.position.y = incomingY;
        } else {
          player.position.y = THREE.MathUtils.lerp(player.position.y, incomingY, 0.2);
        }
        player.rotation.set(0, player.userData.headingYaw ?? 0, 0);
        return;
      }

      this._applyPlayerGroundContour(player, incomingY);
    }
  }

  removePlayer(id) {
    const player = this.players.get(id);
    if (!player) return;
    this._destroyPlayerThemeEffects(player);
    if (player.userData.nameLabel) {
      player.remove(player.userData.nameLabel);
      player.userData.nameLabel = null;
    }
    if (player.userData.glow) {
      player.remove(player.userData.glow);
      player.userData.glow = null;
    }
    if (Array.isArray(player.material)) {
      player.material.forEach((mat) => mat.dispose());
    } else if (player.material) {
      player.material.dispose();
    }
    if (player.geometry) {
      player.geometry.dispose();
    }
    this.scene.remove(player);
    this.players.delete(id);
    if (this.localPlayerId === id) {
      this.localPlayerId = null;
    }
  }

  setPlayerName(id, name) {
    const player = this.players.get(id);
    if (!player) return;

    // Remove existing name label if any
    if (player.userData.nameLabel) {
      player.remove(player.userData.nameLabel);
    }

    if (!name) return;

    // Store the name for potential color changes
    player.userData.playerName = name;
    player.userData.nameColor = player.userData.nameColor || '#ffffff';

    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;

    // Draw text
    context.fillStyle = player.userData.nameColor;
    context.font = 'Bold 32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, 128, 32);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    
    sprite.position.set(0, 8, 0); // Above the cube
    sprite.scale.set(8, 2, 1);
    
    player.add(sprite);
    player.userData.nameLabel = sprite;
  }

  setPlayerNameColor(id, color) {
    const player = this.players.get(id);
    if (!player) return;

    // Store the new color
    player.userData.nameColor = color;

    // Recreate the name label with the new color
    if (player.userData.playerName) {
      this.setPlayerName(id, player.userData.playerName);
    }
  }

  updatePlayerColor(id, color) {
    const player = this.players.get(id);
    if (!player) return;

    // Update cube materials (handle both MeshPhongMaterial and MeshBasicMaterial)
    if (Array.isArray(player.material)) {
      player.material.forEach(mat => {
        mat.color.set(color);
        if (mat.emissive) {
          mat.emissive.set(color);
        }
      });
    } else {
      player.material.color.set(color);
      if (player.material.emissive) {
        player.material.emissive.set(color);
      }
    }

    // Update glow using stored reference
    if (player.userData.glow && player.userData.glow.material) {
      player.userData.glow.material.color.set(color);
    }

    // Update light beam
    if (player.userData.lightBeam) {
      player.userData.lightBeam.material.color.set(color);
    }

    this._setPlayerTrailColor(player, color);
  }

  removePlayer(id) {
    const player = this.players.get(id);
    if (!player) return;
    this._destroyPlayerThemeEffects(player);
    if (player.userData.nameLabel) {
      this._disposeMaterial(player.userData.nameLabel.material);
      player.remove(player.userData.nameLabel);
      player.userData.nameLabel = null;
    }
    if (player.userData.glow) {
      this._disposeMaterial(player.userData.glow.material);
      if (player.userData.glow.geometry) player.userData.glow.geometry.dispose();
      player.remove(player.userData.glow);
      player.userData.glow = null;
    }
    if (player.userData.lightBeam) {
      this._disposeMaterial(player.userData.lightBeam.material);
      if (player.userData.lightBeam.geometry) player.userData.lightBeam.geometry.dispose();
      player.remove(player.userData.lightBeam);
      player.userData.lightBeam = null;
    }
    if (Array.isArray(player.material)) {
      player.material.forEach((mat) => this._disposeMaterial(mat));
    } else {
      this._disposeMaterial(player.material);
    }
    if (player.geometry) {
      player.geometry.dispose();
    }
    this.scene.remove(player);
    this.players.delete(id);
    if (this.localPlayerId === id) {
      this.localPlayerId = null;
    }
  }

  setLocalPlayer(id) {
    const previousLocalId = this.localPlayerId;
    this.localPlayerId = id;
    if (previousLocalId && previousLocalId !== id) {
      this._applyPlayerVideoFaceMaterial(previousLocalId);
    }
    if (id) {
      this._applyPlayerVideoFaceMaterial(id);
    }
    this._updateSkyAnchor();
    this._updateWorldDecorStreaming(true);
  }

  updateCamera(rotation = 0, pitch = 0, zoom = 1.0) {
    // Follow local player with rotation, pitch, and zoom
    if (this.localPlayerId) {
      const localPlayer = this.players.get(this.localPlayerId);
      if (localPlayer) {
        const baseDistance = 15; // Base camera distance
        const distance = baseDistance * zoom; // Apply zoom to distance
        const baseHeight = 10;   // Base camera height
        
        // Calculate camera position based on rotation and pitch
        // Pitch affects the vertical position and distance
        const horizontalDistance = distance * Math.cos(pitch);
        const verticalOffset = distance * Math.sin(pitch);
        
        // Use direct positioning for immediate, smooth response
        this.camera.position.set(
          localPlayer.position.x + Math.sin(rotation) * horizontalDistance,
          localPlayer.position.y + baseHeight + verticalOffset,
          localPlayer.position.z + Math.cos(rotation) * horizontalDistance
        );
        
        // Look at a point offset from the player based on pitch
        const lookAtTarget = new THREE.Vector3(
          localPlayer.position.x,
          localPlayer.position.y - Math.tan(pitch) * 5,
          localPlayer.position.z
        );
        this.camera.lookAt(lookAtTarget);
      }
    }
  }

  updateCameraVR() {
    // In VR mode, camera rig follows player in third-person view
    if (this.localPlayerId && this.vrMode) {
      const localPlayer = this.players.get(this.localPlayerId);
      if (localPlayer) {
        // Position camera rig behind and above player (third-person view)
        const distance = 15; // Same as desktop camera
        const height = 10;
        
        // Get player's rotation to position camera behind them
        const playerRotation = localPlayer.userData.headingYaw ?? localPlayer.rotation.y;
        
        // Calculate position behind player
        this.cameraRig.position.set(
          localPlayer.position.x + Math.sin(playerRotation) * distance,
          localPlayer.position.y + height,
          localPlayer.position.z + Math.cos(playerRotation) * distance
        );
        
        // Rotate rig to face player
        this.cameraRig.rotation.y = playerRotation;
      }
    }
  }

  render(rotation = 0, pitch = 0, zoom = 1.0) {
    const now = performance.now();
    const dt = (now - this._effectLastUpdateTime) / 1000;
    this._effectLastUpdateTime = now;

    if (this.vrMode) {
      this.updateCameraVR();
    } else {
      this.updateCamera(rotation, pitch, zoom);
    }
    
    // Check if grid needs expansion
    const localPlayerPos = this.getLocalPlayerPosition();
    if (localPlayerPos) {
      this.expandGrid(localPlayerPos);
    }

    this._updateWorldDecorStreaming();
    this._updateSkyAnchor();

    this._updatePlayerThemeEffects(dt);
    this._updateThemeWeather(dt);
    
    this.renderer.render(this.scene, this.camera);
  }

  setupVRControllers() {
    // Setup VR controllers
    for (let i = 0; i < 2; i++) {
      // Controller (for input)
      const controller = this.renderer.xr.getController(i);
      controller.userData.isSelecting = false;
      controller.userData.isSqueezing = false;
      
      // Add event listeners
      controller.addEventListener('selectstart', () => {
        controller.userData.isSelecting = true;
      });
      controller.addEventListener('selectend', () => {
        controller.userData.isSelecting = false;
      });
      controller.addEventListener('squeezestart', () => {
        controller.userData.isSqueezing = true;
      });
      controller.addEventListener('squeezeend', () => {
        controller.userData.isSqueezing = false;
      });
      
      // Add visual ray
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
      ]);
      const line = new THREE.Line(geometry);
      line.scale.z = 5;
      controller.add(line);
      
      this.cameraRig.add(controller);
      this.vrControllers.push(controller);
      
      // Controller grip (for visual model)
      const controllerGrip = this.renderer.xr.getControllerGrip(i);
      
      // Add simple cube as controller model
      const cubeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.15);
      const cubeMaterial = new THREE.MeshPhongMaterial({ 
        color: i === 0 ? 0xff0000 : 0x0000ff,
        emissive: i === 0 ? 0xff0000 : 0x0000ff,
        emissiveIntensity: 0.5
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      controllerGrip.add(cube);
      
      this.cameraRig.add(controllerGrip);
      this.vrControllerGrips.push(controllerGrip);
    }
  }

  getVRControllerInput() {
    if (!this.vrMode || this.vrControllers.length === 0) {
      return { movement: { x: 0, z: 0 }, rotation: 0, jump: false };
    }
    
    const input = {
      movement: { x: 0, z: 0 },
      rotation: 0,
      jump: false
    };
    
    // Get gamepad data from controllers
    const session = this.renderer.xr.getSession();
    if (session && session.inputSources) {
      for (let i = 0; i < session.inputSources.length; i++) {
        const inputSource = session.inputSources[i];
        const gamepad = inputSource.gamepad;
        
        if (gamepad) {
          // Debug: Log gamepad info (only log if there's actual input to avoid spam)
          const hasInput = gamepad.axes.some(axis => Math.abs(axis) > 0.1);
          if (hasInput && !this._lastLogTime || Date.now() - this._lastLogTime > 1000) {
            console.log(`Controller ${inputSource.handedness}:`, 
              `axes: [${gamepad.axes.map(a => a.toFixed(2)).join(', ')}]`,
              `buttons: ${gamepad.buttons.length}`);
            this._lastLogTime = Date.now();
          }
          
          if (gamepad.axes.length >= 4) {
            if (inputSource.handedness === 'left') {
              // Left controller: movement (thumbstick at axes 2,3)
              input.movement.x = gamepad.axes[2]; // Left/right
              input.movement.z = -gamepad.axes[3]; // Forward/back (inverted)
            } else if (inputSource.handedness === 'right') {
              // Right controller: rotation (thumbstick at axes 2,3)
              input.rotation = -gamepad.axes[2]; // Rotation (inverted)
            }
          }
        }
        
        // Check for button presses (jump on trigger or grip)
        const controller = this.vrControllers[i];
        if (controller && (controller.userData.isSelecting || controller.userData.isSqueezing)) {
          input.jump = true;
        }
      }
    }
    
    return input;
  }

  enterVR() {
    if (!this.renderer.xr.isPresenting) {
      this.vrMode = true;
      // Store the offset between camera and local player
      const localPlayer = this.players.get(this.localPlayerId);
      if (localPlayer) {
        this.vrPlayerOffset.copy(this.camera.position).sub(localPlayer.position);
      }
    }
  }

  exitVR() {
    this.vrMode = false;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  getLocalPlayerPosition() {
    if (this.localPlayerId) {
      const player = this.players.get(this.localPlayerId);
      if (player) {
        return {
          x: player.position.x,
          y: player.position.y,
          z: player.position.z
        };
      }
    }
    return null;
  }
}

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';

const COLORS = {
  local: 0xfff2a6,
  remote: 0xffb13b,
  ghost: 0x8a5f1f,
  relay: 0xcaf6ff,
  host: 0x00ffd4,
  root: 0xff4fb3,
  edge: 0xffb13b,
  edgeRelay: 0x00ff6a,
  edgeError: 0xff2d2d,
  pubsub: 0xcaf6ff,
  grid: 0x00ff6a,
  radiusLocal: 0xffb347
};

const hashString = (value) => {
  let hash = 0;
  const str = String(value || '');
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const buildEdgeKey = (from, to) => (from < to ? `${from}|${to}` : `${to}|${from}`);
const EDGE_BASE_RADIUS = 0.035;
const EDGE_MAX_RADIUS = 0.18;
const PULSE_WINDOW_MS = 4000;
const PUBSUB_RADIUS = 0.028;
const PUBSUB_PULSE_WINDOW_MS = 8000;
const PULSE_COLORS = {
  tx: COLORS.local,
  rx: 0x00ffd4
};
const GRID_SPACING = 6.4;
const GRID_HEIGHT = 0.5;
const CONNECTION_RADIUS = 6;
const RADIUS_RING_THICKNESS = 0.18;
const RADIUS_RING_SEGMENTS = 64;
const RADIUS_RING_ELEVATION = 0.02;
const RADIUS_SCALE = 1;
const HIERARCHICAL_RELAY_HEIGHT = 8.5;
const normalizeRenderMode = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'off' || raw === 'none' || raw === 'false' || raw === '0') return 'off';
  if (raw === 'low' || raw === 'lite' || raw === 'minimal') return 'low';
  return 'full';
};

export class NetworkVisualizer {
  constructor({ canvas, renderMode } = {}) {
    this.canvas = canvas;
    this.renderMode = normalizeRenderMode(renderMode);
    const lowPower = this.renderMode === 'low';
    const shouldRender = this.renderMode !== 'off';
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
    this.renderer = shouldRender
      ? new THREE.WebGLRenderer({
        canvas,
        antialias: !lowPower,
        alpha: true,
        powerPreference: lowPower ? 'low-power' : 'high-performance',
        precision: lowPower ? 'mediump' : 'highp'
      })
      : null;
    this.nodeMeshes = new Map();
    this.edgeMeshes = new Map();
    this.pubsubMeshes = new Map();
    this.radiusMeshes = new Map();
    this.nodeGroup = new THREE.Group();
    this.edgeGroup = new THREE.Group();
    this.radiusGroup = new THREE.Group();
    this.nodeGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    this.relayGeometry = new THREE.IcosahedronGeometry(0.65, 0);
    this.connectionRadius = CONNECTION_RADIUS;
    this.radiusScale = RADIUS_SCALE;
    this.edgeMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.edge,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    this.pubsubMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.pubsub,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    this.pulseGeometry = new THREE.SphereGeometry(0.12, 12, 12);
    this.pulseMaterials = {
      tx: new THREE.MeshBasicMaterial({
        color: PULSE_COLORS.tx,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      }),
      rx: new THREE.MeshBasicMaterial({
        color: PULSE_COLORS.rx,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      })
    };
    this.pubsubPulseMaterials = {
      tx: new THREE.MeshBasicMaterial({
        color: COLORS.pubsub,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      }),
      rx: new THREE.MeshBasicMaterial({
        color: COLORS.pubsub,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      })
    };
    this.pulseWindowMs = PULSE_WINDOW_MS;
    this.pubsubPulseWindowMs = PUBSUB_PULSE_WINDOW_MS;
    this.pulseVector = new THREE.Vector3();
    this.midpointVector = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 0.2;
    this.layoutMode = 'distributed';
    this.gridSpacing = GRID_SPACING;
    this.gridHeight = GRID_HEIGHT;
    this.radiusMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.grid,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.radiusLocalMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.radiusLocal,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.radiusGeometry = this._buildRadiusGeometry();
    this.localMetric = null;
    this.spiralAssignments = new Map();
    this.spiralCoords = [{ x: 0, z: 0 }];
    this.spiralCursor = { x: 0, z: 0, dirIndex: 0, legLength: 1, legProgress: 0, legRepeats: 0 };
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.groundPoint = new THREE.Vector3();

    this.scene.add(this.nodeGroup);
    this.nodeGroup.add(this.radiusGroup);
    this.nodeGroup.add(this.edgeGroup);

    this._initScene();
    if (shouldRender) {
      this._initControls();
      this._handleResize();
      window.addEventListener('resize', () => this._handleResize());
      this._animate();
    }
  }

  _initScene() {
    if (this.renderMode === 'off') {
      this.camera.position.set(0, 10, 16);
      this.camera.lookAt(0, 0, 0);
      return;
    }
    const gridSize = this.renderMode === 'low' ? 40 : 60;
    const baseDetail = this.renderMode === 'low' ? 40 : 60;
    const fineDetail = this.renderMode === 'low' ? 80 : 120;
    const horizonDetail = this.renderMode === 'low' ? 14 : 20;
    const gridGroup = new THREE.Group();
    const baseGrid = new THREE.GridHelper(gridSize, baseDetail, COLORS.grid, COLORS.grid);
    baseGrid.material.opacity = 0.22;
    baseGrid.material.transparent = true;

    const fineGrid = new THREE.GridHelper(gridSize, fineDetail, COLORS.grid, COLORS.grid);
    fineGrid.material.opacity = 0.06;
    fineGrid.material.transparent = true;

    const horizonGrid = new THREE.GridHelper(gridSize, horizonDetail, COLORS.grid, COLORS.grid);
    horizonGrid.material.opacity = 0.04;
    horizonGrid.material.transparent = true;
    horizonGrid.position.y = 6;

    const glowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(gridSize, gridSize),
      new THREE.MeshBasicMaterial({
        color: COLORS.grid,
        transparent: true,
        opacity: 0.04
      })
    );
    glowPlane.rotation.x = -Math.PI / 2;
    glowPlane.position.y = -0.02;

    const pillarGeometry = new THREE.BufferGeometry();
    const pillarPoints = [];
    const pillarRange = this.renderMode === 'low' ? 10 : 20;
    for (let x = -pillarRange; x <= pillarRange; x += 10) {
      for (let z = -pillarRange; z <= pillarRange; z += 10) {
        if ((Math.abs(x) + Math.abs(z)) % 20 !== 0) continue;
        pillarPoints.push(x, 0, z, x, 6, z);
      }
    }
    pillarGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pillarPoints, 3));
    const pillarMaterial = new THREE.LineBasicMaterial({
      color: COLORS.grid,
      transparent: true,
      opacity: 0.18
    });
    const pillars = new THREE.LineSegments(pillarGeometry, pillarMaterial);

    gridGroup.add(baseGrid, fineGrid, horizonGrid, glowPlane, pillars);
    this.scene.add(gridGroup);

    const ambient = new THREE.AmbientLight(0x00ff6a, 0.2);
    const key = new THREE.DirectionalLight(0x00ff6a, 0.55);
    key.position.set(6, 10, 8);
    const rim = new THREE.PointLight(0xff4fb3, 0.8, 40);
    rim.position.set(-8, 6, -6);

    this.scene.add(ambient, key, rim);

    this.camera.position.set(0, 10, 16);
    this.camera.lookAt(0, 0, 0);
  }

  _initControls() {
    if (!this.renderer) return;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = true;
    this.controls.enableZoom = true;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 45;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.6;
    this.controls.target.set(0, 0, 0);
  }

  setAutoRotate(enabled) {
    if (!this.controls) return;
    this.controls.autoRotate = Boolean(enabled);
  }

  setTopologyMode(mode) {
    const next = String(mode || '').toLowerCase();
    if (next === 'hierarchy') {
      this.layoutMode = 'hierarchical';
      return;
    }
    if (next === 'hierarchical' || next === 'distributed' || next === 'emergent') {
      this.layoutMode = next;
      return;
    }
    this.layoutMode = 'distributed';
  }

  setLocalMetric(metric) {
    if (!metric || typeof metric !== 'object') return;
    this.localMetric = {
      x: Number.isFinite(metric.x) ? metric.x : 0,
      y: Number.isFinite(metric.y) ? metric.y : 0,
      z: Number.isFinite(metric.z) ? metric.z : 0
    };
  }

  setConnectionRadius(radius) {
    if (!Number.isFinite(radius) || radius <= 0) return;
    if (this.connectionRadius === radius) return;
    this.connectionRadius = radius;
    const nextGeometry = this._buildRadiusGeometry();
    if (this.radiusGeometry) {
      this.radiusGeometry.dispose();
    }
    this.radiusGeometry = nextGeometry;
    for (const mesh of this.radiusMeshes.values()) {
      mesh.geometry = nextGeometry;
    }
  }

  _buildRadiusGeometry() {
    const spacing = this.gridSpacing || GRID_SPACING;
    const radius = Math.max(0.01, this.connectionRadius * spacing * this.radiusScale);
    const inner = Math.max(0.01, radius - RADIUS_RING_THICKNESS * 0.5);
    const outer = radius + RADIUS_RING_THICKNESS * 0.5;
    return new THREE.RingGeometry(inner, outer, RADIUS_RING_SEGMENTS);
  }

  setControlsEnabled(enabled) {
    if (!this.controls) return;
    this.controls.enabled = Boolean(enabled);
  }

  projectToGround(clientX, clientY, planeY = 0) {
    if (!this.canvas) return null;
    const rect = this.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    this.groundPlane.constant = -planeY;
    const hit = this.raycaster.ray.intersectPlane(this.groundPlane, this.groundPoint);
    return hit ? this.groundPoint.clone() : null;
  }

  worldToMetric(position) {
    if (!position) return null;
    const spacing = this.gridSpacing || GRID_SPACING;
    return {
      x: position.x / spacing,
      y: (position.y - this.gridHeight) / spacing,
      z: position.z / spacing
    };
  }

  getSpiralMetric(peerId) {
    if (!peerId) return { x: 0, y: 0, z: 0 };
    const index = this._assignSpiralIndex(peerId);
    const coord = this._getSpiralCoord(index);
    return { x: coord.x, y: 0, z: coord.z };
  }

  _handleResize() {
    if (!this.renderer) return;
    const { innerWidth, innerHeight, devicePixelRatio } = window;
    const ratioCap = this.renderMode === 'low' ? 1 : 2;
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, ratioCap));
    this.renderer.setSize(innerWidth, innerHeight);
  }

  _layoutPeers(peers, localPeerId) {
    if (this.layoutMode === 'hierarchical') {
      return this._layoutHierarchical(peers, localPeerId);
    }
    if (this.layoutMode === 'emergent') {
      return this._layoutEmergent(peers, localPeerId);
    }
    if (this.layoutMode === 'distributed') {
      return this._layoutDistributed(peers, localPeerId);
    }
    return this._layoutClassic(peers, localPeerId);
  }

  _layoutClassic(peers, localPeerId) {
    const positions = new Map();
    peers.forEach((peer) => {
      const peerId = peer.peerId;
      if (!peerId) return;
      const seed = hashString(peerId);
      const angle = (seed % 360) * (Math.PI / 180);
      if (peer.isRelay) {
        const radius = 3.5 + (seed % 5) * 0.4;
        positions.set(peerId, new THREE.Vector3(Math.cos(angle) * radius, 4.2, Math.sin(angle) * radius));
        return;
      }
      if (peerId === localPeerId) {
        positions.set(peerId, new THREE.Vector3(0, this.gridHeight, 0));
        return;
      }
      const radius = 5 + (seed % 7) * 0.7;
      positions.set(peerId, new THREE.Vector3(Math.cos(angle) * radius, this.gridHeight, Math.sin(angle) * radius));
    });
    return positions;
  }

  _layoutEmergent(peers, localPeerId) {
    return this._layoutClassic(peers, localPeerId);
  }

  _layoutDistributed(peers, localPeerId) {
    const positions = new Map();
    const activeIds = new Set(peers.map((peer) => peer?.peerId).filter(Boolean));
    for (const peerId of Array.from(this.spiralAssignments.keys())) {
      if (!activeIds.has(peerId)) {
        this.spiralAssignments.delete(peerId);
      }
    }

    peers.forEach((peer) => {
      const peerId = peer.peerId;
      if (!peerId) return;
      if (peer.isRelay) {
        const seed = hashString(peerId);
        const angle = (seed % 360) * (Math.PI / 180);
        const radius = 3.5 + (seed % 5) * 0.4;
        positions.set(peerId, new THREE.Vector3(Math.cos(angle) * radius, 4.2, Math.sin(angle) * radius));
        return;
      }
      const metric = this._readMetric(peer, localPeerId);
      if (metric) {
        positions.set(peerId, this._metricToPosition(metric));
        this.spiralAssignments.delete(peerId);
        return;
      }
      const index = this._assignSpiralIndex(peerId);
      const coord = this._getSpiralCoord(index);
      positions.set(peerId, this._gridCoordToPosition(coord.x, coord.z));
    });

    return positions;
  }

  _layoutHierarchical(peers, localPeerId) {
    const positions = new Map();
    const root = peers.find((peer) => peer?.isRoot);
    const hosts = peers.filter((peer) => peer?.isHost);
    const clients = peers.filter((peer) => peer?.isClient);
    if (!root && hosts.length === 0) {
      return this._layoutClassic(peers, localPeerId);
    }
    const relayHeight = HIERARCHICAL_RELAY_HEIGHT;
    const hostHeight = (relayHeight + this.gridHeight) * 0.5;

    if (root?.peerId) {
      positions.set(root.peerId, new THREE.Vector3(0, hostHeight, 0));
    }

    const hostRadius = Math.max(5, hosts.length * 2.4);
    const hostPositions = new Map();
    hosts.forEach((host, index) => {
      const angle = (index / Math.max(1, hosts.length)) * Math.PI * 2;
      const pos = new THREE.Vector3(Math.cos(angle) * hostRadius, hostHeight, Math.sin(angle) * hostRadius);
      positions.set(host.peerId, pos);
      hostPositions.set(host.peerId, pos);
    });

    const hostIds = hosts.map((host) => host.peerId).filter(Boolean);
    const hostCount = hostIds.length;
    if (hostCount === 0) {
      const rootPos = root?.peerId ? positions.get(root.peerId) : new THREE.Vector3(0, hostHeight, 0);
      const ringPeers = peers.filter((peer) => peer?.peerId && peer.peerId !== root?.peerId && !peer.isRelay);
      ringPeers.forEach((peer, index) => {
        const angle = (index / Math.max(1, ringPeers.length)) * Math.PI * 2;
        const radius = 5 + (index % 4) * 0.6;
        const pos = new THREE.Vector3(
          rootPos.x + Math.cos(angle) * radius,
          this.gridHeight,
          rootPos.z + Math.sin(angle) * radius
        );
        positions.set(peer.peerId, pos);
      });
      return positions;
    }
    const hostGroups = new Map(hostIds.map((id) => [id, []]));
    clients.forEach((client) => {
      if (!client?.peerId) return;
      const hostId = client.hostId || hostIds[hashString(client.peerId) % Math.max(1, hostCount)];
      if (!hostId) return;
      if (!hostGroups.has(hostId)) {
        hostGroups.set(hostId, []);
      }
      hostGroups.get(hostId).push(client);
    });

    hostGroups.forEach((group, hostId) => {
      const hostPos = hostPositions.get(hostId);
      if (!hostPos) return;
      const radius = 2.2 + Math.min(2, Math.floor(group.length / 4)) * 0.6;
      group.forEach((client, index) => {
        const angle = (index / Math.max(1, group.length)) * Math.PI * 2;
        const offset = new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        positions.set(client.peerId, new THREE.Vector3().addVectors(hostPos, offset).setY(this.gridHeight));
      });
    });

    peers.forEach((peer) => {
      if (!peer?.peerId || positions.has(peer.peerId)) return;
      if (peer.isRelay) {
        const seed = hashString(peer.peerId);
        const angle = (seed % 360) * (Math.PI / 180);
        const radius = 3.5 + (seed % 5) * 0.4;
        positions.set(peer.peerId, new THREE.Vector3(Math.cos(angle) * radius, relayHeight, Math.sin(angle) * radius));
        return;
      }
      const seed = hashString(peer.peerId);
      const angle = (seed % 360) * (Math.PI / 180);
      const radius = 6 + (seed % 5) * 0.6;
      positions.set(peer.peerId, new THREE.Vector3(Math.cos(angle) * radius, this.gridHeight, Math.sin(angle) * radius));
    });

    peers.forEach((peer) => {
      if (!peer?.peerId || !peer.isRelay) return;
      const existing = positions.get(peer.peerId);
      if (existing) {
        positions.set(peer.peerId, new THREE.Vector3(existing.x, relayHeight, existing.z));
        return;
      }
      const seed = hashString(peer.peerId);
      const angle = (seed % 360) * (Math.PI / 180);
      const radius = 3.5 + (seed % 5) * 0.4;
      positions.set(peer.peerId, new THREE.Vector3(Math.cos(angle) * radius, relayHeight, Math.sin(angle) * radius));
    });

    return positions;
  }

  _readMetric(peer, localPeerId) {
    if (!peer) return null;
    if (peer.peerId === localPeerId && this.localMetric) {
      return this.localMetric;
    }
    const metric = peer.metric;
    if (!metric || typeof metric !== 'object') return null;
    const metricInitialized = peer.metricInitialized === true;
    const x = Number.isFinite(metric.x) ? metric.x : null;
    const y = Number.isFinite(metric.y) ? metric.y : null;
    const z = Number.isFinite(metric.z) ? metric.z : null;
    if (x === null && y === null && z === null) return null;
    const normalized = { x: x ?? 0, y: y ?? 0, z: z ?? 0 };
    const isZero = normalized.x === 0 && normalized.y === 0 && normalized.z === 0;
    if (!metricInitialized && isZero) return null;
    return normalized;
  }

  _metricToPosition(metric) {
    const spacing = this.gridSpacing || GRID_SPACING;
    return new THREE.Vector3(
      (metric?.x || 0) * spacing,
      (metric?.y || 0) * spacing + this.gridHeight,
      (metric?.z || 0) * spacing
    );
  }

  _gridCoordToPosition(x, z) {
    const spacing = this.gridSpacing || GRID_SPACING;
    return new THREE.Vector3(x * spacing, this.gridHeight, z * spacing);
  }

  _assignSpiralIndex(peerId) {
    if (this.spiralAssignments.has(peerId)) {
      return this.spiralAssignments.get(peerId);
    }
    const index = this.spiralCoords.length;
    this.spiralAssignments.set(peerId, index);
    this._getSpiralCoord(index);
    return index;
  }

  _getSpiralCoord(index) {
    while (this.spiralCoords.length <= index) {
      this._advanceSpiral();
    }
    return this.spiralCoords[index];
  }

  _advanceSpiral() {
    const directions = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ];
    const { dirIndex, legLength, legProgress, legRepeats } = this.spiralCursor;
    const [dx, dz] = directions[dirIndex];
    const nextX = this.spiralCursor.x + dx;
    const nextZ = this.spiralCursor.z + dz;
    let nextProgress = legProgress + 1;
    let nextDir = dirIndex;
    let nextRepeats = legRepeats;
    let nextLeg = legLength;
    if (nextProgress >= legLength) {
      nextProgress = 0;
      nextDir = (dirIndex + 1) % directions.length;
      nextRepeats += 1;
      if (nextRepeats >= 2) {
        nextRepeats = 0;
        nextLeg += 1;
      }
    }
    this.spiralCursor = {
      x: nextX,
      z: nextZ,
      dirIndex: nextDir,
      legLength: nextLeg,
      legProgress: nextProgress,
      legRepeats: nextRepeats
    };
    this.spiralCoords.push({ x: nextX, z: nextZ });
  }

  _buildCurve(fromPos, toPos) {
    const mid = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5);
    const lift = 1.8 + fromPos.distanceTo(toPos) * 0.12;
    const ctrl1 = new THREE.Vector3().lerpVectors(fromPos, mid, 0.45).add(new THREE.Vector3(0, lift, 0));
    const ctrl2 = new THREE.Vector3().lerpVectors(toPos, mid, 0.45).add(new THREE.Vector3(0, lift, 0));

    const controlPoints = [
      new THREE.Vector4(fromPos.x, fromPos.y, fromPos.z, 1),
      new THREE.Vector4(ctrl1.x, ctrl1.y, ctrl1.z, 1),
      new THREE.Vector4(ctrl2.x, ctrl2.y, ctrl2.z, 1),
      new THREE.Vector4(toPos.x, toPos.y, toPos.z, 1)
    ];
    const knots = [0, 0, 0, 0, 1, 1, 1, 1];
    return new NURBSCurve(3, knots, controlPoints);
  }

  _getEdgeRadius(rate) {
    const kbps = Math.max(0, rate) / 1024;
    const boost = Math.log10(kbps + 1) * 0.045;
    return THREE.MathUtils.clamp(EDGE_BASE_RADIUS + boost, EDGE_BASE_RADIUS, EDGE_MAX_RADIUS);
  }

  _getPulseSpeed(rate) {
    const kbps = Math.max(0, rate) / 1024;
    const speed = 0.22 + Math.log10(kbps + 1) * 0.22;
    return THREE.MathUtils.clamp(speed, 0.22, 1.1);
  }

  _getPulseScale(rate) {
    const kbps = Math.max(0, rate) / 1024;
    const scale = 0.6 + Math.log10(kbps + 1) * 0.25;
    return THREE.MathUtils.clamp(scale, 0.6, 1.8);
  }

  _getPulseSpeedFromMsgRate(rate) {
    const messages = Math.max(0, rate);
    const speed = 0.2 + Math.log10(messages + 1) * 0.4;
    return THREE.MathUtils.clamp(speed, 0.2, 1.6);
  }

  _getPulseScaleFromMsgRate(rate) {
    const messages = Math.max(0, rate);
    const scale = 0.7 + Math.log10(messages + 1) * 0.35;
    return THREE.MathUtils.clamp(scale, 0.7, 2.0);
  }

  _updateEdgeMessageRates(edgeData, txCount, rxCount, now) {
    const sample = edgeData.countSample || {
      at: now,
      txCount: Number(txCount) || 0,
      rxCount: Number(rxCount) || 0
    };
    const elapsed = now - sample.at;
    if (elapsed > 0) {
      const nextTx = Number(txCount) || 0;
      const nextRx = Number(rxCount) || 0;
      const deltaTx = Math.max(0, nextTx - sample.txCount);
      const deltaRx = Math.max(0, nextRx - sample.rxCount);
      edgeData.txMsgRate = (deltaTx * 1000) / elapsed;
      edgeData.rxMsgRate = (deltaRx * 1000) / elapsed;
    }
    edgeData.countSample = {
      at: now,
      txCount: Number(txCount) || 0,
      rxCount: Number(rxCount) || 0
    };
  }

  _createPulse(type, materialOverride = null) {
    const material = materialOverride || (type === 'tx' ? this.pulseMaterials.tx : this.pulseMaterials.rx);
    const mesh = new THREE.Mesh(this.pulseGeometry, material);
    mesh.visible = false;
    mesh.renderOrder = 2;
    this.edgeGroup.add(mesh);
    return { mesh, progress: Math.random() };
  }

  updatePeers(peers, localPeerId, edges = null, pubsubEdges = null) {
    if (!this.renderer) return;
    const positions = this._layoutPeers(peers, localPeerId);
    const now = Date.now();
    const showRadius = this.layoutMode === 'distributed' || this.layoutMode === 'emergent';

    for (const peer of peers) {
      if (!peer.peerId) continue;
      const position = positions.get(peer.peerId);
      if (!position) continue;
      const isRelay = Boolean(peer.isRelay);
      const isRoot = Boolean(peer.isRoot);
      const isHost = Boolean(peer.isHost);
      const isLocal = peer.peerId === localPeerId;
      const isGhost = Boolean(peer.inferred);
      let mesh = this.nodeMeshes.get(peer.peerId);
      if (mesh && mesh.userData.isRelay !== isRelay) {
        this.nodeGroup.remove(mesh);
        mesh.material.dispose();
        this.nodeMeshes.delete(peer.peerId);
        mesh = null;
      }
      if (!mesh) {
        const material = new THREE.MeshStandardMaterial({
          color: isRelay ? COLORS.relay : COLORS.remote,
          emissive: isRelay ? 0x1a3240 : 0x2a1a00,
          emissiveIntensity: isRelay ? 0.85 : 0.65
        });
        const geometry = isRelay ? this.relayGeometry : this.nodeGeometry;
        mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { type: 'node', peerId: peer.peerId, isRelay, role: peer.role || null };
        this.nodeGroup.add(mesh);
        this.nodeMeshes.set(peer.peerId, mesh);
      }
      const color = isRelay
        ? COLORS.relay
        : isRoot
          ? COLORS.root
          : isHost
            ? COLORS.host
            : isGhost
              ? COLORS.ghost
              : isLocal
                ? COLORS.local
                : COLORS.remote;
      let emissive = isRelay
        ? 0x1a3240
        : isRoot
          ? 0x341627
          : isHost
            ? 0x163038
            : 0x2a1a00;
      let emissiveIntensity = isRelay ? 0.85 : isRoot ? 1.0 : isHost ? 0.8 : 0.65;
      let scale = isRoot ? 1.35 : isHost ? 1.15 : 1;
      if (isLocal && !isRelay) {
        emissive = 0xffd98a;
        emissiveIntensity = Math.max(emissiveIntensity, 1.45);
        scale *= 1.08;
      }
      mesh.material.color.set(color);
      mesh.material.emissive.set(emissive);
      mesh.material.emissiveIntensity = emissiveIntensity;
      mesh.scale.setScalar(scale);
      mesh.userData.isRelay = isRelay;
      mesh.userData.role = peer.role || null;
      mesh.position.copy(position);

      const shouldShowRadius = showRadius && !isRelay;
      const radiusMesh = this.radiusMeshes.get(peer.peerId);
      if (shouldShowRadius) {
        if (!radiusMesh) {
          const ringMaterial = isLocal ? this.radiusLocalMaterial : this.radiusMaterial;
          const ring = new THREE.Mesh(this.radiusGeometry, ringMaterial);
          ring.rotation.x = -Math.PI / 2;
          ring.renderOrder = -1;
          ring.userData = { type: 'radius', peerId: peer.peerId };
          this.radiusGroup.add(ring);
          this.radiusMeshes.set(peer.peerId, ring);
          ring.position.set(position.x, RADIUS_RING_ELEVATION, position.z);
        } else {
          radiusMesh.position.set(position.x, RADIUS_RING_ELEVATION, position.z);
          const ringMaterial = isLocal ? this.radiusLocalMaterial : this.radiusMaterial;
          if (radiusMesh.material !== ringMaterial) {
            radiusMesh.material = ringMaterial;
          }
        }
      } else if (radiusMesh) {
        this.radiusGroup.remove(radiusMesh);
        this.radiusMeshes.delete(peer.peerId);
      }
    }

    for (const peerId of Array.from(this.nodeMeshes.keys())) {
      if (!positions.has(peerId)) {
        const mesh = this.nodeMeshes.get(peerId);
        if (mesh) {
          this.nodeGroup.remove(mesh);
          mesh.material.dispose();
        }
        this.nodeMeshes.delete(peerId);
      }
    }

    if (!showRadius) {
      for (const mesh of this.radiusMeshes.values()) {
        this.radiusGroup.remove(mesh);
      }
      this.radiusMeshes.clear();
    } else {
      for (const peerId of Array.from(this.radiusMeshes.keys())) {
        if (!positions.has(peerId)) {
          const mesh = this.radiusMeshes.get(peerId);
          if (mesh) {
            this.radiusGroup.remove(mesh);
          }
          this.radiusMeshes.delete(peerId);
        }
      }
    }

    let edgeList = Array.isArray(edges) ? edges : null;
    if (!edgeList) {
      edgeList = [];
      for (const peerId of positions.keys()) {
        if (!peerId || peerId === localPeerId) continue;
        edgeList.push([localPeerId, peerId]);
      }
    }

    const nextEdges = new Set();
    for (const entry of edgeList) {
      const [from, to] = Array.isArray(entry) ? entry : [entry?.from, entry?.to];
      if (!from || !to || from === to) continue;
      const fromPos = positions.get(from);
      const toPos = positions.get(to);
      if (!fromPos || !toPos) continue;
      const edgeKey = buildEdgeKey(from, to);
      nextEdges.add(edgeKey);

      const rxBps = Number(entry?.rxBps) || 0;
      const txBps = Number(entry?.txBps) || 0;
      const rxCount = Number(entry?.rxCount) || 0;
      const txCount = Number(entry?.txCount) || 0;
      const lastRxAt = Number(entry?.lastRxAt) || null;
      const lastTxAt = Number(entry?.lastTxAt) || null;
      const via = entry?.via || null;
      const relayPeerId = entry?.relayPeerId || null;
      const errorActive = Boolean(entry?.errorActive);
      const radius = this._getEdgeRadius(rxBps + txBps);
      const curve = this._buildCurve(fromPos, toPos);
      const geometry = new THREE.TubeGeometry(curve, 48, radius, 6, false);
      const isWebRTC = via === 'webrtc';
      const edgeColor = errorActive
        ? COLORS.edgeError
        : isWebRTC
          ? COLORS.edge
          : COLORS.edgeRelay;

      let edgeData = this.edgeMeshes.get(edgeKey);
      if (!edgeData) {
        const mesh = new THREE.Mesh(geometry, this.edgeMaterial.clone());
        mesh.userData = { type: 'edge', from, to };
        this.edgeGroup.add(mesh);
        edgeData = {
          mesh,
          curve,
          from,
          to,
          radius,
          via,
          relayPeerId,
          rxBps,
          txBps,
          rxCount,
          txCount,
          errorActive,
          lastRxAt,
          lastTxAt,
          pulses: {
            tx: this._createPulse('tx'),
            rx: this._createPulse('rx')
          }
        };
        this.edgeMeshes.set(edgeKey, edgeData);
      } else {
        edgeData.mesh.geometry.dispose();
        edgeData.mesh.geometry = geometry;
        edgeData.mesh.userData = { type: 'edge', from, to };
        edgeData.curve = curve;
        edgeData.from = from;
        edgeData.to = to;
        edgeData.radius = radius;
        edgeData.via = via;
        edgeData.relayPeerId = relayPeerId;
        edgeData.rxBps = rxBps;
        edgeData.txBps = txBps;
        edgeData.rxCount = rxCount;
        edgeData.txCount = txCount;
        edgeData.errorActive = errorActive;
        edgeData.lastRxAt = lastRxAt;
        edgeData.lastTxAt = lastTxAt;
      }
      this._updateEdgeMessageRates(edgeData, txCount, rxCount, now);
      edgeData.mesh.material.color.set(edgeColor);

      const relayPos = relayPeerId ? positions.get(relayPeerId) : null;
      const isRelayed = via === 'relay' && relayPos;
      if (isRelayed) {
        curve.getPointAt(0.5, this.midpointVector);
        const relayCurve = this._buildCurve(this.midpointVector, relayPos);
        const relayRadius = Math.max(EDGE_BASE_RADIUS * 0.8, radius * 0.6);
        const relayGeometry = new THREE.TubeGeometry(relayCurve, 32, relayRadius, 6, false);
        if (!edgeData.relay) {
          const relayMesh = new THREE.Mesh(relayGeometry, this.edgeMaterial.clone());
          relayMesh.material.color.set(COLORS.edgeRelay);
          this.edgeGroup.add(relayMesh);
          edgeData.relay = {
            mesh: relayMesh,
            curve: relayCurve,
            relayPeerId
          };
        } else {
          edgeData.relay.mesh.geometry.dispose();
          edgeData.relay.mesh.geometry = relayGeometry;
          edgeData.relay.mesh.material.color.set(COLORS.edgeRelay);
          edgeData.relay.curve = relayCurve;
          edgeData.relay.relayPeerId = relayPeerId;
        }
      } else if (edgeData.relay) {
        this.edgeGroup.remove(edgeData.relay.mesh);
        edgeData.relay.mesh.geometry.dispose();
        edgeData.relay.mesh.material.dispose();
        edgeData.relay = null;
      }
    }

    for (const edgeKey of Array.from(this.edgeMeshes.keys())) {
      if (!nextEdges.has(edgeKey)) {
        const edgeData = this.edgeMeshes.get(edgeKey);
        if (edgeData) {
          this.edgeGroup.remove(edgeData.mesh);
          edgeData.mesh.geometry.dispose();
          edgeData.mesh.material.dispose();
          if (edgeData.relay?.mesh) {
            this.edgeGroup.remove(edgeData.relay.mesh);
            edgeData.relay.mesh.geometry.dispose();
            edgeData.relay.mesh.material.dispose();
          }
          if (edgeData.pulses?.tx?.mesh) {
            this.edgeGroup.remove(edgeData.pulses.tx.mesh);
          }
          if (edgeData.pulses?.rx?.mesh) {
            this.edgeGroup.remove(edgeData.pulses.rx.mesh);
          }
        }
        this.edgeMeshes.delete(edgeKey);
      }
    }

    this._syncPubsubEdges(pubsubEdges, positions);
  }

  _syncPubsubEdges(pubsubEdges, positions) {
    const edgeList = Array.isArray(pubsubEdges) ? pubsubEdges : [];
    const nextEdges = new Set();

    for (const entry of edgeList) {
      const from = entry?.from;
      const to = entry?.to;
      if (!from || !to || from === to) continue;
      const fromPos = positions.get(from);
      const toPos = positions.get(to);
      if (!fromPos || !toPos) continue;
      const edgeKey = buildEdgeKey(from, to);
      nextEdges.add(edgeKey);

      const lastTxAt = Number(entry?.lastTxAt) || null;
      const lastRxAt = Number(entry?.lastRxAt) || null;
      const txCount = Number(entry?.txCount) || 0;
      const rxCount = Number(entry?.rxCount) || 0;
      const curve = this._buildCurve(fromPos, toPos);
      const geometry = new THREE.TubeGeometry(curve, 36, PUBSUB_RADIUS, 6, false);

      let edgeData = this.pubsubMeshes.get(edgeKey);
      if (!edgeData) {
        const mesh = new THREE.Mesh(geometry, this.pubsubMaterial.clone());
        mesh.userData = { type: 'pubsub', from, to };
        this.edgeGroup.add(mesh);
        edgeData = {
          mesh,
          curve,
          from,
          to,
          lastTxAt,
          lastRxAt,
          txCount,
          rxCount,
          pulses: {
            tx: this._createPulse('tx', this.pubsubPulseMaterials.tx),
            rx: this._createPulse('rx', this.pubsubPulseMaterials.rx)
          }
        };
        this.pubsubMeshes.set(edgeKey, edgeData);
      } else {
        edgeData.mesh.geometry.dispose();
        edgeData.mesh.geometry = geometry;
        edgeData.mesh.userData = { type: 'pubsub', from, to };
        edgeData.curve = curve;
        edgeData.from = from;
        edgeData.to = to;
        edgeData.lastTxAt = lastTxAt;
        edgeData.lastRxAt = lastRxAt;
        edgeData.txCount = txCount;
        edgeData.rxCount = rxCount;
      }
      this._updateEdgeMessageRates(edgeData, txCount, rxCount, Date.now());
      edgeData.mesh.material.color.set(COLORS.pubsub);
    }

    for (const edgeKey of Array.from(this.pubsubMeshes.keys())) {
      if (!nextEdges.has(edgeKey)) {
        const edgeData = this.pubsubMeshes.get(edgeKey);
        if (edgeData) {
          this.edgeGroup.remove(edgeData.mesh);
          edgeData.mesh.geometry.dispose();
          edgeData.mesh.material.dispose();
          if (edgeData.pulses?.tx?.mesh) {
            this.edgeGroup.remove(edgeData.pulses.tx.mesh);
          }
          if (edgeData.pulses?.rx?.mesh) {
            this.edgeGroup.remove(edgeData.pulses.rx.mesh);
          }
        }
        this.pubsubMeshes.delete(edgeKey);
      }
    }
  }

  pick(clientX, clientY) {
    if (!this.renderer) return null;
    if (!this.canvas) return null;
    const rect = this.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

    const targets = [
      ...this.nodeMeshes.values(),
      ...Array.from(this.edgeMeshes.values()).map((edge) => edge.mesh)
    ];
    const hits = this.raycaster.intersectObjects(targets, true);
    if (!hits.length) return null;
    const hit = hits[0].object;
    if (!hit?.userData?.type) return null;
    return { ...hit.userData };
  }

  _animate() {
    if (!this.renderer) return;
    let lastFrame = performance.now();
    const tick = () => {
      const now = performance.now();
      const delta = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      this._updateEdgePulses(delta);
      this._updatePubsubPulses(delta);
      this.controls?.update();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(tick);
    };
    tick();
  }

  _updateEdgePulses(delta) {
    const now = Date.now();
    for (const edgeData of this.edgeMeshes.values()) {
      const curve = edgeData.curve;
      if (!curve) continue;
      const txRate = Number.isFinite(edgeData.txMsgRate) ? edgeData.txMsgRate : edgeData.txBps;
      const rxRate = Number.isFinite(edgeData.rxMsgRate) ? edgeData.rxMsgRate : edgeData.rxBps;
      const txMode = Number.isFinite(edgeData.txMsgRate) ? 'messages' : 'bytes';
      const rxMode = Number.isFinite(edgeData.rxMsgRate) ? 'messages' : 'bytes';
      this._updatePulse(edgeData.pulses?.tx, curve, delta, 1, now, edgeData.lastTxAt, txRate, null, txMode);
      this._updatePulse(edgeData.pulses?.rx, curve, delta, -1, now, edgeData.lastRxAt, rxRate, null, rxMode);
    }
  }

  _updatePubsubPulses(delta) {
    const now = Date.now();
    for (const edgeData of this.pubsubMeshes.values()) {
      const curve = edgeData.curve;
      if (!curve) continue;
      const txRate = Number.isFinite(edgeData.txMsgRate) ? edgeData.txMsgRate : 0;
      const rxRate = Number.isFinite(edgeData.rxMsgRate) ? edgeData.rxMsgRate : 0;
      this._updatePulse(edgeData.pulses?.tx, curve, delta, 1, now, edgeData.lastTxAt, txRate, this.pubsubPulseWindowMs, 'messages');
      this._updatePulse(edgeData.pulses?.rx, curve, delta, -1, now, edgeData.lastRxAt, rxRate, this.pubsubPulseWindowMs, 'messages');
    }
  }

  _updatePulse(pulse, curve, delta, direction, now, lastAt, rate, windowOverride = null, rateMode = 'bytes') {
    if (!pulse?.mesh) return;
    const windowMs = Number.isFinite(windowOverride) ? windowOverride : this.pulseWindowMs;
    const active = Number.isFinite(lastAt) && now - lastAt < windowMs;
    if (!active) {
      pulse.mesh.visible = false;
      return;
    }
    pulse.mesh.visible = true;
    const speed = rateMode === 'messages'
      ? this._getPulseSpeedFromMsgRate(rate)
      : this._getPulseSpeed(rate);
    pulse.progress = (pulse.progress + delta * speed * direction) % 1;
    if (pulse.progress < 0) {
      pulse.progress += 1;
    }
    curve.getPointAt(pulse.progress, this.pulseVector);
    pulse.mesh.position.copy(this.pulseVector);
    const scale = rateMode === 'messages'
      ? this._getPulseScaleFromMsgRate(rate)
      : this._getPulseScale(rate);
    pulse.mesh.scale.setScalar(scale);
  }
}

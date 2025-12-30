import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';

const COLORS = {
  local: 0xff4fb3,
  remote: 0x00ff6a,
  ghost: 0x008a4f,
  edge: 0x00ff6a,
  grid: 0x00ff6a
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
const PULSE_COLORS = {
  tx: COLORS.local,
  rx: 0x00ffd4
};

export class NetworkVisualizer {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.nodeMeshes = new Map();
    this.edgeMeshes = new Map();
    this.nodeGroup = new THREE.Group();
    this.edgeGroup = new THREE.Group();
    this.nodeGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    this.edgeMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.edge,
      transparent: true,
      opacity: 0.65,
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
    this.pulseWindowMs = PULSE_WINDOW_MS;
    this.pulseVector = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 0.2;

    this.scene.add(this.nodeGroup);
    this.nodeGroup.add(this.edgeGroup);

    this._initScene();
    this._initControls();
    this._handleResize();
    window.addEventListener('resize', () => this._handleResize());
    this._animate();
  }

  _initScene() {
    this.scene.fog = new THREE.Fog(0x020605, 12, 50);

    const gridGroup = new THREE.Group();
    const baseGrid = new THREE.GridHelper(60, 60, COLORS.grid, COLORS.grid);
    baseGrid.material.opacity = 0.22;
    baseGrid.material.transparent = true;

    const fineGrid = new THREE.GridHelper(60, 120, COLORS.grid, COLORS.grid);
    fineGrid.material.opacity = 0.06;
    fineGrid.material.transparent = true;

    const horizonGrid = new THREE.GridHelper(60, 20, COLORS.grid, COLORS.grid);
    horizonGrid.material.opacity = 0.04;
    horizonGrid.material.transparent = true;
    horizonGrid.position.y = 6;

    const glowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
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
    for (let x = -20; x <= 20; x += 10) {
      for (let z = -20; z <= 20; z += 10) {
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

  _handleResize() {
    const { innerWidth, innerHeight, devicePixelRatio } = window;
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    this.renderer.setSize(innerWidth, innerHeight);
  }

  _layoutPeers(peers, localPeerId) {
    const positions = new Map();
    peers.forEach((peer) => {
      const peerId = peer.peerId;
      if (!peerId) return;
      if (peerId === localPeerId) {
        positions.set(peerId, new THREE.Vector3(0, 0.5, 0));
        return;
      }
      const seed = hashString(peerId);
      const angle = (seed % 360) * (Math.PI / 180);
      const radius = 5 + (seed % 7) * 0.7;
      positions.set(peerId, new THREE.Vector3(Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius));
    });
    return positions;
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

  _createPulse(type) {
    const material = type === 'tx' ? this.pulseMaterials.tx : this.pulseMaterials.rx;
    const mesh = new THREE.Mesh(this.pulseGeometry, material);
    mesh.visible = false;
    mesh.renderOrder = 2;
    this.edgeGroup.add(mesh);
    return { mesh, progress: Math.random() };
  }

  updatePeers(peers, localPeerId, edges = null) {
    const positions = this._layoutPeers(peers, localPeerId);

    for (const peer of peers) {
      if (!peer.peerId) continue;
      const position = positions.get(peer.peerId);
      if (!position) continue;
      let mesh = this.nodeMeshes.get(peer.peerId);
      if (!mesh) {
        const material = new THREE.MeshStandardMaterial({
          color: COLORS.remote,
          emissive: 0x002a12,
          emissiveIntensity: 0.7
        });
        mesh = new THREE.Mesh(this.nodeGeometry, material);
        mesh.userData = { type: 'node', peerId: peer.peerId };
        this.nodeGroup.add(mesh);
        this.nodeMeshes.set(peer.peerId, mesh);
      }
      const color = peer.peerId === localPeerId
        ? COLORS.local
        : peer.inferred
          ? COLORS.ghost
          : COLORS.remote;
      mesh.material.color.set(color);
      mesh.position.copy(position);
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
      const lastRxAt = Number(entry?.lastRxAt) || null;
      const lastTxAt = Number(entry?.lastTxAt) || null;
      const radius = this._getEdgeRadius(rxBps + txBps);
      const curve = this._buildCurve(fromPos, toPos);
      const geometry = new THREE.TubeGeometry(curve, 48, radius, 6, false);

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
          rxBps,
          txBps,
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
        edgeData.rxBps = rxBps;
        edgeData.txBps = txBps;
        edgeData.lastRxAt = lastRxAt;
        edgeData.lastTxAt = lastTxAt;
      }
    }

    for (const edgeKey of Array.from(this.edgeMeshes.keys())) {
      if (!nextEdges.has(edgeKey)) {
        const edgeData = this.edgeMeshes.get(edgeKey);
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
        this.edgeMeshes.delete(edgeKey);
      }
    }
  }

  pick(clientX, clientY) {
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
    let lastFrame = performance.now();
    const tick = () => {
      const now = performance.now();
      const delta = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      this._updateEdgePulses(delta);
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
      this._updatePulse(edgeData.pulses?.tx, curve, delta, 1, now, edgeData.lastTxAt, edgeData.txBps);
      this._updatePulse(edgeData.pulses?.rx, curve, delta, -1, now, edgeData.lastRxAt, edgeData.rxBps);
    }
  }

  _updatePulse(pulse, curve, delta, direction, now, lastAt, rate) {
    if (!pulse?.mesh) return;
    const active = Number.isFinite(lastAt) && now - lastAt < this.pulseWindowMs;
    if (!active) {
      pulse.mesh.visible = false;
      return;
    }
    pulse.mesh.visible = true;
    const speed = this._getPulseSpeed(rate);
    pulse.progress = (pulse.progress + delta * speed * direction) % 1;
    if (pulse.progress < 0) {
      pulse.progress += 1;
    }
    curve.getPointAt(pulse.progress, this.pulseVector);
    pulse.mesh.position.copy(this.pulseVector);
    const scale = this._getPulseScale(rate);
    pulse.mesh.scale.setScalar(scale);
  }
}

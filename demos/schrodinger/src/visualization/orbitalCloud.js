import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ReactiveAtomView } from './reactiveAtomView.js';
import { createWaterPhaseGroup } from './waterPhaseView.js';

const makePointTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
};

const hexToRgb = (hex) => {
  const cleaned = hex.replace('#', '');
  const value = Number.parseInt(cleaned.length === 3 ? cleaned.split('').map((x) => x + x).join('') : cleaned, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255
  };
};

export class SchrodingerViewport {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 2000);
    this.camera.position.set(7, 5, 8);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x020403, 1);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.45;
    this.controls.enablePan = false;

    this.scene.add(new THREE.AmbientLight('#89ffcb', 0.35));
    const key = new THREE.DirectionalLight('#e9fff7', 0.85);
    key.position.set(5, 7, 3);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight('#ffcc66', 0.25);
    rim.position.set(-4, 2, -5);
    this.scene.add(rim);

    this.grid = new THREE.GridHelper(12, 24, '#18382d', '#102a22');
    this.grid.position.y = -4;
    this.scene.add(this.grid);

    this.axes = new THREE.AxesHelper(3);
    this.axes.visible = false;
    this.scene.add(this.axes);

    this.pointTexture = makePointTexture();
    this.cloud = null;
    this.nucleus = null;
    this.waterGroup = null;
    this.reactiveView = new ReactiveAtomView();
    this.scene.add(this.reactiveView.group);
    this.orbitalExtent = 8;
    this.materialVisualKey = '';
    this.mode = 'orbital';
    this.clock = new THREE.Clock();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
    this.animate();
  }

  resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setGuidesVisible(visible) {
    this.grid.visible = visible;
    this.axes.visible = visible;
  }

  setRotationEnabled(enabled) {
    this.controls.autoRotate = enabled;
  }

  setMode(mode) {
    this.mode = mode;
    if (this.cloud) this.cloud.visible = mode === 'orbital' || mode === 'wave';
    if (this.nucleus) this.nucleus.visible = mode === 'orbital' || mode === 'wave';
    if (this.waterGroup) this.waterGroup.visible = mode === 'water';
    this.reactiveView.group.visible = mode === 'reactive';
    if (mode === 'water' && this.waterGroup) this.fitMaterialCell(this.waterGroup.userData.extent || 5);
    if (mode === 'reactive') this.fitReactiveCell(this.reactiveView.simulation.extent);
    if (mode !== 'water' && mode !== 'reactive' && this.orbitalExtent) this.fitCamera(this.orbitalExtent);
  }

  setOrbital({ points, colors, element, extentBohr }) {
    if (this.cloud) {
      this.scene.remove(this.cloud);
      this.cloud.geometry.dispose();
      this.cloud.material.dispose();
    }
    if (this.nucleus) {
      this.scene.remove(this.nucleus);
      this.nucleus.geometry.dispose();
      this.nucleus.material.dispose();
    }

    const rgb = hexToRgb(element.color || '#9fffd8');
    for (let i = 0; i < colors.length; i += 3) {
      const shade = colors[i];
      colors[i] = shade * rgb.r;
      colors[i + 1] = shade * rgb.g;
      colors[i + 2] = shade * rgb.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: Math.max(0.018, Math.min(0.055, extentBohr / 260)),
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.72,
      vertexColors: true,
      map: this.pointTexture,
      alphaTest: 0.04,
      depthWrite: false
    });
    this.cloud = new THREE.Points(geometry, material);
    this.scene.add(this.cloud);
    this.orbitalExtent = extentBohr;

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(0.08, extentBohr * 0.012), 32, 24),
      new THREE.MeshStandardMaterial({
        color: element.color || '#d7fff0',
        emissive: element.color || '#0d3b30',
        emissiveIntensity: 0.15,
        roughness: 0.25
      })
    );
    this.nucleus = nucleus;
    this.scene.add(nucleus);

    this.fitCamera(extentBohr);
    this.setMode(this.mode);
  }

  setWaterPacket(packet) {
    const composition = Object.keys(packet?.state?.composition || {}).join(',');
    const visualKey = `${packet?.materialId || 'material'}:${packet?.state?.phase || 'phase'}:${composition}`;
    if (this.waterGroup && visualKey === this.materialVisualKey) {
      this.waterGroup.userData.packet = packet;
      return;
    }

    if (this.waterGroup) {
      this.scene.remove(this.waterGroup);
      this.waterGroup.traverse((item) => {
        if (item.geometry) item.geometry.dispose();
        if (item.material) item.material.dispose();
      });
    }
    this.waterGroup = createWaterPhaseGroup(packet);
    this.waterGroup.userData.packet = packet;
    this.materialVisualKey = visualKey;
    this.scene.add(this.waterGroup);
    this.setMode(this.mode);
  }

  fitCamera(extentBohr) {
    const scaled = Math.max(4, Math.min(60, extentBohr));
    const distance = Math.max(7, scaled * 0.85);
    this.camera.near = 0.01;
    this.camera.far = Math.max(200, scaled * 12);
    this.camera.position.set(distance, distance * 0.65, distance * 0.9);
    this.controls.maxDistance = Math.max(30, scaled * 3);
    this.controls.target.set(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  fitMaterialCell(extent = 5) {
    const distance = Math.max(7.5, extent * 1.8);
    this.camera.near = 0.01;
    this.camera.far = Math.max(200, extent * 18);
    this.camera.position.set(distance, distance * 0.65, distance * 0.95);
    this.controls.maxDistance = Math.max(24, extent * 5);
    this.controls.target.set(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  fitReactiveCell(extent = 5) {
    const distance = Math.max(7.5, extent * 1.85);
    this.camera.near = 0.01;
    this.camera.far = Math.max(200, extent * 18);
    this.camera.position.set(distance, distance * 0.7, distance * 0.95);
    this.controls.maxDistance = Math.max(24, extent * 5);
    this.controls.target.set(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  setReactiveEnvironment(environment) {
    this.reactiveView.setEnvironment(environment);
  }

  addReactiveAtoms(symbol, count) {
    return this.reactiveView.addAtoms(symbol, count);
  }

  addReactiveWaterRecipe(count) {
    return this.reactiveView.addWaterRecipe(count);
  }

  clearReactiveAtoms() {
    this.reactiveView.clear();
  }

  getReactiveSummary() {
    return this.reactiveView.getSummary();
  }

  getReactiveSnapshot() {
    return this.reactiveView.getSnapshot();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const dt = Math.min(0.05, this.clock.getDelta());
    if (this.waterGroup && this.mode === 'water') {
      this.waterGroup.rotation.y += 0.002;
    }
    if (this.mode === 'reactive') this.reactiveView.update(dt);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.reactiveView.dispose();
    this.renderer.dispose();
    this.container.replaceChildren();
  }
}

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createSeededRandom, SCALE_LAYERS } from '../simulation/multiscaleModel.js';
import { createMultiscaleRenderBudget } from './renderBudget.js';
import {
  createOverlayDataUpdateLedger,
  markOverlayAttributeUpdate,
  resetOverlayDataUpdateLedger,
  snapshotOverlayDataUpdateLedger
} from './overlayBufferUpdate.js';

const CAMERA_TARGETS = [
  { position: [0, 72, 138], target: [0, 0, 0] },
  { position: [0, 46, 86], target: [0, 0, 0] },
  { position: [0, 28, 54], target: [0, 0, 0] },
  { position: [0, 11, 26], target: [0, 0, 0] },
  { position: [0, 6, 16], target: [0, 1, 0] },
  { position: [0, 3.4, 9], target: [0, 0.4, 0] },
  { position: [0, 2.1, 6.2], target: [0, 0.2, 0] },
  { position: [0, 1.8, 5.4], target: [0, 0, 0] }
];

const LAYER_FRAME_RADII = [58, 38, 25, 8.8, 6.2, 4, 3.1, 3.3];
const N_BODY_OVERLAY_CAPACITY = 64;
const N_BODY_TRAIL_LENGTH = 80;
const N_BODY_VISIBLE_LAYERS = new Set(['galactic', 'solar']);
const MAXWELL_OVERLAY_CAPACITY = 1024;
const COSMOLOGY_EXPANSION_OVERLAY_CAPACITY = 2048;
const COSMOLOGY_EXPANSION_VISIBLE_LAYERS = new Set(['supergalactic']);
const MOLECULAR_DYNAMICS_OVERLAY_CAPACITY = 4096;
const MOLECULAR_DYNAMICS_BOND_CAPACITY = 1024;
const MOLECULAR_DYNAMICS_VISIBLE_LAYERS = new Set(['molecular']);
const SPH_MATERIAL_OVERLAY_CAPACITY = 1024;
const SPH_MATERIAL_VISIBLE_LAYERS = new Set(['surface', 'mpm']);
const HYDRO_ATMOSPHERE_OVERLAY_CAPACITY = 2048;
const RADIATION_OPACITY_OVERLAY_CAPACITY = 2048;
const RADIATION_OPACITY_VISIBLE_LAYERS = new Set(['surface', 'planet', 'solar']);
const STELLAR_FUSION_OVERLAY_CAPACITY = 2048;
const STELLAR_FUSION_VISIBLE_LAYERS = new Set(['solar']);
const MAGNETOSPHERE_PLASMA_OVERLAY_CAPACITY = 2048;
const MAGNETOSPHERE_PLASMA_VISIBLE_LAYERS = new Set(['solar', 'galactic']);
const PIC_PLASMA_PATCH_OVERLAY_CAPACITY = 2048;
const PIC_PLASMA_PATCH_VISIBLE_LAYERS = new Set(['solar', 'galactic']);
const RELATIVISTIC_CORRECTION_OVERLAY_CAPACITY = 2048;
const RELATIVISTIC_CORRECTION_VISIBLE_LAYERS = new Set(['solar', 'galactic', 'supergalactic']);
const COMBUSTION_PLUME_OVERLAY_CAPACITY = 2048;
const COMBUSTION_PLUME_VISIBLE_LAYERS = new Set(['surface', 'mpm']);
const RENDER_QUALITY_DEGRADE_COOLDOWN_FRAMES = 10;
const RENDER_QUALITY_RELAX_COOLDOWN_FRAMES = 60;
const RENDER_QUALITY_SEVERE_COOLDOWN_FRAMES = 4;
const SCALE_ZOOM_TRANSITION_SECONDS = 0.86;

export const MULTISCALE_VISUAL_REFERENCE_SCHEMA = 'peercompute.multiscale.visual-reference.v0';
export const SCALE_VISUAL_REFERENCE_POLICY = Object.freeze({
  supergalactic: Object.freeze({
    sourceDemo: 'universes',
    motif: 'dense luminous cosmic web, halo particles, filament links',
    scaleBand: '1',
    bottomUpPriority: 'context-shell'
  }),
  galactic: Object.freeze({
    sourceDemo: 'universes',
    motif: 'bright spiral disk, dust/gas points, glowing galactic core',
    scaleBand: '2',
    bottomUpPriority: 'context-shell'
  }),
  solar: Object.freeze({
    sourceDemo: 'universes',
    motif: 'glowing stellar body, orbit trails, local starfield',
    scaleBand: '3',
    bottomUpPriority: 'context-shell'
  }),
  planet: Object.freeze({
    sourceDemo: 'planetgen',
    motif: 'lit weather globe, atmosphere shell, cloud texture',
    scaleBand: '4',
    bottomUpPriority: 'upward-consumer'
  }),
  surface: Object.freeze({
    sourceDemo: 'planetgen + webgpuphys dynamics',
    motif: 'bounded human-scale scene with terrain, grid, water balloon, campfire, interaction volume',
    scaleBand: '5',
    bottomUpPriority: 'upward-consumer'
  }),
  mpm: Object.freeze({
    sourceDemo: 'webgpuphys MLS/MPM',
    motif: 'temperature-colored particle material inside a wire container',
    scaleBand: '6',
    bottomUpPriority: 'material-bridge'
  }),
  molecular: Object.freeze({
    sourceDemo: 'webgpuphys MLS/MPM + schrodinger',
    motif: 'bounded atom/bond patch with round species sprites and live bond overlay',
    scaleBand: '7',
    bottomUpPriority: 'base-layer'
  }),
  orbital: Object.freeze({
    sourceDemo: 'schrodinger',
    motif: 'electron probability cloud, nucleus glow, orbital guide rings',
    scaleBand: '8',
    bottomUpPriority: 'base-layer'
  })
});

export function getScaleVisualReference(layerId) {
  return SCALE_VISUAL_REFERENCE_POLICY[layerId] || null;
}

function firstFiniteOrNull(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return null;
}

function smoothStep01(value) {
  const t = Math.max(0, Math.min(1, Number(value) || 0));
  return t * t * (3 - 2 * t);
}

function createPointSpriteTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.42, 'rgba(255,255,255,0.78)');
  gradient.addColorStop(0.72, 'rgba(255,255,255,0.2)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPlanetTexture(seed = 1729, { clouds = false } = {}) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const rand = createSeededRandom(seed);
  ctx.fillStyle = clouds ? 'rgba(0,0,0,0)' : '#0d5d95';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bandCount = clouds ? 38 : 90;
  for (let i = 0; i < bandCount; i += 1) {
    const x = rand() * canvas.width;
    const y = rand() * canvas.height;
    const w = clouds ? 34 + rand() * 86 : 18 + rand() * 66;
    const h = clouds ? 4 + rand() * 12 : 10 + rand() * 36;
    const hue = clouds
      ? 205 + rand() * 35
      : rand() > 0.55 ? 126 + rand() * 26 : 42 + rand() * 36;
    const sat = clouds ? 55 + rand() * 25 : 28 + rand() * 36;
    const light = clouds ? 82 + rand() * 14 : 28 + rand() * 30;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rand() - 0.5) * 0.7);
    ctx.globalAlpha = clouds ? 0.2 + rand() * 0.42 : 0.36 + rand() * 0.38;
    ctx.fillStyle = `hsl(${hue} ${sat}% ${light}%)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export class MultiscaleScene {
  constructor({ canvas, model }) {
    this.canvas = canvas;
    this.model = model;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020409);
    this.camera = new THREE.PerspectiveCamera(58, 1, 0.01, 800);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.basePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.currentPixelRatio = this.basePixelRatio;
    this.renderQualityPendingPixelRatio = this.currentPixelRatio;
    this.renderQualityLastAppliedFrame = -Infinity;
    this.renderQualityLastAppliedReason = 'initial';
    this.renderQualityApplyCount = 0;
    this.renderer.setPixelRatio(this.currentPixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 180;
    this.clock = new THREE.Clock();
    this.pointTexture = createPointSpriteTexture();
    this.groups = new Map();
    this.dynamic = {};
    this.nbodyOverlay = null;
    this.nbodyBodies = [];
    this.nbodyTrails = [];
    this.nbodyTrailPositions = [];
    this.nbodyOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      bodyCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.maxwellOverlay = null;
    this.maxwellOverlayPositions = null;
    this.maxwellOverlayColors = null;
    this.maxwellOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      vectorCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.cosmologyExpansionOverlay = null;
    this.cosmologyExpansionOverlayPositions = null;
    this.cosmologyExpansionOverlayColors = null;
    this.cosmologyExpansionOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      sampleCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.molecularDynamicsOverlay = null;
    this.molecularDynamicsAtoms = null;
    this.molecularDynamicsBonds = null;
    this.molecularDynamicsAtomPositions = null;
    this.molecularDynamicsAtomColors = null;
    this.molecularDynamicsBondPositions = null;
    this.molecularDynamicsBondColors = null;
    this.molecularDynamicsOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      atomCount: 0,
      bondCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.sphMaterialOverlay = null;
    this.sphMaterialOverlayPositions = null;
    this.sphMaterialOverlayColors = null;
    this.sphMaterialOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      particleCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.hydroAtmosphereOverlay = null;
    this.hydroAtmosphereOverlayPositions = null;
    this.hydroAtmosphereOverlayColors = null;
    this.hydroAtmosphereOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      cellCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.radiationOpacityOverlay = null;
    this.radiationOpacityOverlayPositions = null;
    this.radiationOpacityOverlayColors = null;
    this.radiationOpacityOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      cellCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.stellarFusionOverlay = null;
    this.stellarFusionOverlayPositions = null;
    this.stellarFusionOverlayColors = null;
    this.stellarFusionOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      cellCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.magnetospherePlasmaOverlay = null;
    this.magnetospherePlasmaOverlayPositions = null;
    this.magnetospherePlasmaOverlayColors = null;
    this.magnetospherePlasmaOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      cellCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.picPlasmaPatchOverlay = null;
    this.picPlasmaPatchOverlayPositions = null;
    this.picPlasmaPatchOverlayColors = null;
    this.picPlasmaPatchOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      particleCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.relativisticCorrectionOverlay = null;
    this.relativisticCorrectionOverlayPositions = null;
    this.relativisticCorrectionOverlayColors = null;
    this.relativisticCorrectionOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      sampleCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.combustionPlumeOverlay = null;
    this.combustionPlumeOverlayPositions = null;
    this.combustionPlumeOverlayColors = null;
    this.combustionPlumeOverlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      cellCount: 0,
      visible: false,
      layerId: 'none',
      sequence: null
    };
    this.overlayStatus = {
      accepted: false,
      reason: 'waiting',
      backend: 'none',
      layerIndex: -1,
      acceptedPoints: 0,
      capacity: 0,
      sourcePoints: 0,
      visible: false
    };
    this.renderBudget = createMultiscaleRenderBudget({
      activeLayerId: this.model.activeLayer?.id || SCALE_LAYERS[this.model.layerIndex]?.id
    });
    this.renderBudgetApplications = {};
    this.overlayDataUpdateLedger = createOverlayDataUpdateLedger();
    this.renderFrame = 0;
    this.layerRevision = 0;
    this.overlayCommitFrame = 0;
    this.overlayCommitCount = 0;
    this.overlayCommitStates = {};
    this.dynamicVisualFrame = -1;
    this.dynamicVisualLayerRevision = -1;
    this.dynamicVisualUpdateCount = 0;
    this.dynamicVisualSkipCount = 0;
    this.cameraTransition = null;
    this.lastCompletedLayerId = this.model.activeLayer?.id || SCALE_LAYERS[this.model.layerIndex]?.id || 'supergalactic';

    this.scene.add(new THREE.AmbientLight(0x9fbfff, 0.65));
    const sun = new THREE.DirectionalLight(0xfff1c2, 2.4);
    sun.position.set(12, 18, 8);
    this.scene.add(sun);
    this.scene.add(this.buildReferenceStarfield());

    this.activeLayerMarker = this.buildLayerMarker();
    this.scene.add(this.activeLayerMarker);
    this.buildGroups();
    this.initializeGenericSnapshotStatus();
    this.buildNBodyOverlay();
    this.buildMaxwellOverlay();
    this.buildCosmologyExpansionOverlay();
    this.buildMolecularDynamicsOverlay();
    this.buildSphMaterialOverlay();
    this.buildHydroAtmosphereOverlay();
    this.buildRadiationOpacityOverlay();
    this.buildStellarFusionOverlay();
    this.buildMagnetospherePlasmaOverlay();
    this.buildPicPlasmaPatchOverlay();
    this.buildRelativisticCorrectionOverlay();
    this.buildCombustionPlumeOverlay();
    this.setLayer(0, true);
    this.resize();
  }

  buildGroups() {
    this.addLayerGroup('supergalactic', this.buildSupergalactic());
    this.addLayerGroup('galactic', this.buildGalaxy());
    this.addLayerGroup('solar', this.buildSolarSystem());
    this.addLayerGroup('planet', this.buildPlanet());
    this.addLayerGroup('surface', this.buildSurface());
    this.addLayerGroup('mpm', this.buildMpm());
    this.addLayerGroup('molecular', this.buildMolecular());
    this.addLayerGroup('orbital', this.buildOrbital());
  }

  addLayerGroup(id, group) {
    group.visible = false;
    group.userData.visualReference = getScaleVisualReference(id);
    this.groups.set(id, group);
    this.scene.add(group);
  }

  pointMaterialOptions(options = {}) {
    if (!this.pointTexture) return options;
    return {
      ...options,
      map: this.pointTexture,
      alphaTest: options.alphaTest ?? 0.025
    };
  }

  buildReferenceStarfield() {
    const rand = createSeededRandom(707);
    const count = 1400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cool = new THREE.Color(0x82a8ff);
    const warm = new THREE.Color(0xfff1b8);
    const color = new THREE.Color();
    for (let i = 0; i < count; i += 1) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);
      const r = 120 + rand() * 78;
      const sinPhi = Math.sin(phi);
      const dst = i * 3;
      positions[dst] = Math.cos(theta) * sinPhi * r;
      positions[dst + 1] = Math.cos(phi) * r;
      positions[dst + 2] = Math.sin(theta) * sinPhi * r;
      color.copy(cool).lerp(warm, rand() * rand());
      colors[dst] = color.r;
      colors[dst + 1] = color.g;
      colors[dst + 2] = color.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(
      geometry,
      new THREE.PointsMaterial(this.pointMaterialOptions({
        size: 0.42,
        vertexColors: true,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }))
    );
    stars.frustumCulled = false;
    return stars;
  }

  initializeGenericSnapshotStatus() {
    this.overlayStatus = {
      ...this.overlayStatus,
      accepted: false,
      reason: 'generic snapshot disabled by policy',
      acceptedPoints: 0,
      capacity: 0,
      sourcePoints: 0,
      visible: false,
      hiddenByPolicy: true,
      geometryResident: false
    };
  }

  buildNBodyOverlay() {
    const group = new THREE.Group();
    group.visible = false;
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0x54dfff,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    const bodyMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xffe68a }),
      new THREE.MeshStandardMaterial({ color: 0x60e8ff, emissive: 0x123344, roughness: 0.45 }),
      new THREE.MeshStandardMaterial({ color: 0xff7abf, emissive: 0x331122, roughness: 0.48 }),
      new THREE.MeshStandardMaterial({ color: 0x8dff8a, emissive: 0x123312, roughness: 0.5 })
    ];

    for (let i = 0; i < N_BODY_OVERLAY_CAPACITY; i += 1) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(i === 0 ? 0.42 : 0.18, 20, 10),
        bodyMaterials[Math.min(i, bodyMaterials.length - 1)]
      );
      mesh.visible = false;
      group.add(mesh);
      this.nbodyBodies.push(mesh);

      const trailArray = new Float32Array(N_BODY_TRAIL_LENGTH * 3);
      const trailGeometry = new THREE.BufferGeometry();
      trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailArray, 3));
      trailGeometry.setDrawRange(0, 0);
      const trail = new THREE.Line(trailGeometry, trailMaterial.clone());
      trail.visible = false;
      group.add(trail);
      this.nbodyTrails.push(trail);
      this.nbodyTrailPositions.push({
        values: new Float32Array(N_BODY_TRAIL_LENGTH * 3),
        orderedValues: trailArray,
        cursor: 0,
        count: 0
      });
    }

    this.nbodyOverlay = group;
    this.scene.add(group);
  }

  buildMaxwellOverlay() {
    this.maxwellOverlayPositions = new Float32Array(MAXWELL_OVERLAY_CAPACITY * 2 * 3);
    this.maxwellOverlayColors = new Float32Array(MAXWELL_OVERLAY_CAPACITY * 2 * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.maxwellOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.maxwellOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.maxwellOverlay = new THREE.LineSegments(geometry, material);
    this.maxwellOverlay.visible = false;
    this.maxwellOverlay.frustumCulled = false;
    this.scene.add(this.maxwellOverlay);
  }

  buildCosmologyExpansionOverlay() {
    this.cosmologyExpansionOverlayPositions = new Float32Array(COSMOLOGY_EXPANSION_OVERLAY_CAPACITY * 3);
    this.cosmologyExpansionOverlayColors = new Float32Array(COSMOLOGY_EXPANSION_OVERLAY_CAPACITY * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.cosmologyExpansionOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.cosmologyExpansionOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.cosmologyExpansionOverlay = new THREE.Points(geometry, material);
    this.cosmologyExpansionOverlay.visible = false;
    this.cosmologyExpansionOverlay.frustumCulled = false;
    this.scene.add(this.cosmologyExpansionOverlay);
  }

  buildMolecularDynamicsOverlay() {
    const group = new THREE.Group();
    group.visible = false;
    this.molecularDynamicsAtomPositions = new Float32Array(MOLECULAR_DYNAMICS_OVERLAY_CAPACITY * 3);
    this.molecularDynamicsAtomColors = new Float32Array(MOLECULAR_DYNAMICS_OVERLAY_CAPACITY * 3);
    this.molecularDynamicsBondPositions = new Float32Array(MOLECULAR_DYNAMICS_BOND_CAPACITY * 2 * 3);
    this.molecularDynamicsBondColors = new Float32Array(MOLECULAR_DYNAMICS_BOND_CAPACITY * 2 * 3);

    const atomGeometry = new THREE.BufferGeometry();
    atomGeometry.setAttribute('position', new THREE.BufferAttribute(this.molecularDynamicsAtomPositions, 3));
    atomGeometry.setAttribute('color', new THREE.BufferAttribute(this.molecularDynamicsAtomColors, 3));
    atomGeometry.setDrawRange(0, 0);
    const atomMaterial = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.molecularDynamicsAtoms = new THREE.Points(atomGeometry, atomMaterial);
    this.molecularDynamicsAtoms.frustumCulled = false;
    group.add(this.molecularDynamicsAtoms);

    const bondGeometry = new THREE.BufferGeometry();
    bondGeometry.setAttribute('position', new THREE.BufferAttribute(this.molecularDynamicsBondPositions, 3));
    bondGeometry.setAttribute('color', new THREE.BufferAttribute(this.molecularDynamicsBondColors, 3));
    bondGeometry.setDrawRange(0, 0);
    const bondMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.molecularDynamicsBonds = new THREE.LineSegments(bondGeometry, bondMaterial);
    this.molecularDynamicsBonds.frustumCulled = false;
    group.add(this.molecularDynamicsBonds);

    this.molecularDynamicsOverlay = group;
    this.scene.add(group);
  }

  buildSphMaterialOverlay() {
    this.sphMaterialOverlayPositions = new Float32Array(SPH_MATERIAL_OVERLAY_CAPACITY * 3);
    this.sphMaterialOverlayColors = new Float32Array(SPH_MATERIAL_OVERLAY_CAPACITY * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.sphMaterialOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.sphMaterialOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.sphMaterialOverlay = new THREE.Points(geometry, material);
    this.sphMaterialOverlay.visible = false;
    this.sphMaterialOverlay.frustumCulled = false;
    this.scene.add(this.sphMaterialOverlay);
  }

  buildHydroAtmosphereOverlay() {
    this.hydroAtmosphereOverlayPositions = new Float32Array(HYDRO_ATMOSPHERE_OVERLAY_CAPACITY * 3);
    this.hydroAtmosphereOverlayColors = new Float32Array(HYDRO_ATMOSPHERE_OVERLAY_CAPACITY * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.hydroAtmosphereOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.hydroAtmosphereOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.84,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.hydroAtmosphereOverlay = new THREE.Points(geometry, material);
    this.hydroAtmosphereOverlay.visible = false;
    this.hydroAtmosphereOverlay.frustumCulled = false;
    this.scene.add(this.hydroAtmosphereOverlay);
  }

  buildRadiationOpacityOverlay() {
    this.radiationOpacityOverlayPositions = new Float32Array(RADIATION_OPACITY_OVERLAY_CAPACITY * 3);
    this.radiationOpacityOverlayColors = new Float32Array(RADIATION_OPACITY_OVERLAY_CAPACITY * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.radiationOpacityOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.radiationOpacityOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.radiationOpacityOverlay = new THREE.Points(geometry, material);
    this.radiationOpacityOverlay.visible = false;
    this.radiationOpacityOverlay.frustumCulled = false;
    this.scene.add(this.radiationOpacityOverlay);
  }

  buildStellarFusionOverlay() {
    this.stellarFusionOverlayPositions = new Float32Array(STELLAR_FUSION_OVERLAY_CAPACITY * 3);
    this.stellarFusionOverlayColors = new Float32Array(STELLAR_FUSION_OVERLAY_CAPACITY * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.stellarFusionOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.stellarFusionOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.13,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.stellarFusionOverlay = new THREE.Points(geometry, material);
    this.stellarFusionOverlay.visible = false;
    this.stellarFusionOverlay.frustumCulled = false;
    this.scene.add(this.stellarFusionOverlay);
  }

  buildMagnetospherePlasmaOverlay() {
    this.magnetospherePlasmaOverlayPositions = new Float32Array(MAGNETOSPHERE_PLASMA_OVERLAY_CAPACITY * 3);
    this.magnetospherePlasmaOverlayColors = new Float32Array(MAGNETOSPHERE_PLASMA_OVERLAY_CAPACITY * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.magnetospherePlasmaOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.magnetospherePlasmaOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.115,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.magnetospherePlasmaOverlay = new THREE.Points(geometry, material);
    this.magnetospherePlasmaOverlay.visible = false;
    this.magnetospherePlasmaOverlay.frustumCulled = false;
    this.scene.add(this.magnetospherePlasmaOverlay);
  }

  buildPicPlasmaPatchOverlay() {
    this.picPlasmaPatchOverlayPositions = new Float32Array(PIC_PLASMA_PATCH_OVERLAY_CAPACITY * 3);
    this.picPlasmaPatchOverlayColors = new Float32Array(PIC_PLASMA_PATCH_OVERLAY_CAPACITY * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.picPlasmaPatchOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.picPlasmaPatchOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.picPlasmaPatchOverlay = new THREE.Points(geometry, material);
    this.picPlasmaPatchOverlay.visible = false;
    this.picPlasmaPatchOverlay.frustumCulled = false;
    this.scene.add(this.picPlasmaPatchOverlay);
  }

  buildRelativisticCorrectionOverlay() {
    this.relativisticCorrectionOverlayPositions = new Float32Array(RELATIVISTIC_CORRECTION_OVERLAY_CAPACITY * 3);
    this.relativisticCorrectionOverlayColors = new Float32Array(RELATIVISTIC_CORRECTION_OVERLAY_CAPACITY * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.relativisticCorrectionOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.relativisticCorrectionOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.105,
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.relativisticCorrectionOverlay = new THREE.Points(geometry, material);
    this.relativisticCorrectionOverlay.visible = false;
    this.relativisticCorrectionOverlay.frustumCulled = false;
    this.scene.add(this.relativisticCorrectionOverlay);
  }

  buildCombustionPlumeOverlay() {
    this.combustionPlumeOverlayPositions = new Float32Array(COMBUSTION_PLUME_OVERLAY_CAPACITY * 3);
    this.combustionPlumeOverlayColors = new Float32Array(COMBUSTION_PLUME_OVERLAY_CAPACITY * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.combustionPlumeOverlayPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.combustionPlumeOverlayColors, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial(this.pointMaterialOptions({
      size: 0.105,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    this.combustionPlumeOverlay = new THREE.Points(geometry, material);
    this.combustionPlumeOverlay.visible = false;
    this.combustionPlumeOverlay.frustumCulled = false;
    this.scene.add(this.combustionPlumeOverlay);
  }

  buildLayerMarker() {
    const group = new THREE.Group();
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0xff5b8d,
      transparent: true,
      opacity: 0.62,
      depthWrite: false
    });
    const axisMaterial = new THREE.LineBasicMaterial({
      color: 0x54dfff,
      transparent: true,
      opacity: 0.46,
      depthWrite: false
    });
    const makeRing = (plane) => {
      const segments = 160;
      const positions = [];
      for (let i = 0; i < segments; i += 1) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        if (plane === 'xy') positions.push(x, y, 0);
        if (plane === 'xz') positions.push(x, 0, y);
        if (plane === 'yz') positions.push(0, x, y);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      return new THREE.LineLoop(geometry, ringMaterial);
    };
    group.add(makeRing('xy'), makeRing('xz'), makeRing('yz'));
    const axes = new THREE.BufferGeometry();
    axes.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([
        -1.12, 0, 0, 1.12, 0, 0,
        0, -1.12, 0, 0, 1.12, 0,
        0, 0, -1.12, 0, 0, 1.12
      ], 3)
    );
    group.add(new THREE.LineSegments(axes, axisMaterial));
    return group;
  }

  createPointCloud({ count, radius, colorA, colorB, seed, disk = false }) {
    const rand = createSeededRandom(seed);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cA = new THREE.Color(colorA);
    const cB = new THREE.Color(colorB);
    const color = new THREE.Color();
    for (let i = 0; i < count; i += 1) {
      const t = rand();
      const angle = rand() * Math.PI * 2;
      const r = disk ? radius * Math.sqrt(rand()) : radius * Math.cbrt(rand());
      const arm = disk ? 0.76 + Math.sin(angle * 2.5 + r * 0.18) * 0.24 : 1;
      const y = disk ? (rand() - 0.5) * 1.8 * (1 - r / radius) : (rand() - 0.5) * radius * 0.75;
      positions[i * 3] = Math.cos(angle + r * 0.05) * r * arm;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle + r * 0.05) * r * arm;
      color.copy(cA).lerp(cB, t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial(this.pointMaterialOptions({
        size: disk ? 0.13 : 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: disk ? THREE.AdditiveBlending : THREE.NormalBlending
      }))
    );
  }

  buildSupergalactic() {
    const group = new THREE.Group();
    group.add(this.createPointCloud({ count: 2400, radius: 56, colorA: 0x9bb8ff, colorB: 0xffd58a, seed: 410 }));
    const haloGlow = this.createPointCloud({ count: 900, radius: 47, colorA: 0x31f4ff, colorB: 0xff56c8, seed: 411 });
    haloGlow.material.size = 0.32;
    haloGlow.material.opacity = 0.48;
    group.add(haloGlow);
    const linePositions = [];
    const rand = createSeededRandom(512);
    for (let i = 0; i < 170; i += 1) {
      const a = new THREE.Vector3((rand() - 0.5) * 110, (rand() - 0.5) * 70, (rand() - 0.5) * 110);
      const b = a.clone().add(new THREE.Vector3((rand() - 0.5) * 26, (rand() - 0.5) * 18, (rand() - 0.5) * 26));
      linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    group.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
      color: 0x7dfcff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })));
    return group;
  }

  buildGalaxy() {
    const group = new THREE.Group();
    const stars = this.createPointCloud({ count: 3600, radius: 36, colorA: 0xffec9f, colorB: 0x7ba7ff, seed: 911, disk: true });
    stars.material.size = 0.16;
    group.add(stars);
    const gas = this.createPointCloud({ count: 900, radius: 30, colorA: 0xff56c8, colorB: 0x54dfff, seed: 912, disk: true });
    gas.material.size = 0.22;
    gas.material.opacity = 0.42;
    group.add(gas);
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0xfff3ba, transparent: true, opacity: 0.9 })
    );
    group.add(core);
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(4.4, 32, 16),
      new THREE.MeshBasicMaterial({
        color: 0xffd479,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    ));
    this.dynamic.galaxy = group;
    return group;
  }

  buildSolarSystem() {
    const group = new THREE.Group();
    const localStars = this.createPointCloud({ count: 520, radius: 46, colorA: 0x7aa7ff, colorB: 0xfff0bd, seed: 833 });
    localStars.material.size = 0.18;
    localStars.material.opacity = 0.35;
    group.add(localStars);
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 36, 18),
      new THREE.MeshBasicMaterial({ color: 0xffc257 })
    );
    group.add(sun);
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(3.8, 36, 18),
      new THREE.MeshBasicMaterial({
        color: 0xff7a35,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    ));
    this.dynamic.planets = [];
    const planets = [
      { r: 6, size: 0.38, color: 0xb7a18f, speed: 0.8 },
      { r: 10, size: 0.62, color: 0x4da0ff, speed: 0.48 },
      { r: 15, size: 0.52, color: 0xe29355, speed: 0.31 },
      { r: 23, size: 1.2, color: 0xe0b56e, speed: 0.18 }
    ];
    for (const planet of planets) {
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(planet.r, 0.015, 6, 96),
        new THREE.MeshBasicMaterial({ color: 0x3eff9a, transparent: true, opacity: 0.32 })
      );
      orbit.rotation.x = Math.PI / 2;
      group.add(orbit);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.size, 24, 12),
        new THREE.MeshStandardMaterial({ color: planet.color, roughness: 0.8 })
      );
      group.add(mesh);
      this.dynamic.planets.push({ mesh, ...planet });
    }
    return group;
  }

  buildPlanet() {
    const group = new THREE.Group();
    const surfaceTexture = createPlanetTexture(1729);
    const cloudTexture = createPlanetTexture(1776, { clouds: true });
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(7, 64, 32),
      new THREE.MeshStandardMaterial({
        color: 0x5aa8cf,
        map: surfaceTexture || null,
        roughness: 0.82,
        metalness: 0.02
      })
    );
    group.add(planet);
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(7.35, 64, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: cloudTexture || null,
        transparent: true,
        opacity: 0.34,
        alphaTest: cloudTexture ? 0.03 : 0,
        depthWrite: false
      })
    );
    group.add(clouds);
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(7.62, 64, 32),
      new THREE.MeshBasicMaterial({
        color: 0x79caff,
        transparent: true,
        opacity: 0.13,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    group.add(atmosphere);
    const storm = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.12, 8, 60),
      new THREE.MeshBasicMaterial({ color: 0xdffaff, transparent: true, opacity: 0.72 })
    );
    storm.position.set(2.4, 3.4, 5.5);
    storm.rotation.set(1.0, 0.25, 0.4);
    group.add(storm);
    this.dynamic.planet = { group, clouds, storm, atmosphere };
    return group;
  }

  buildSurface() {
    const group = new THREE.Group();
    const grid = new THREE.GridHelper(24, 48, 0x74f3ff, 0x243745);
    grid.position.y = -1.18;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    group.add(grid);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 22, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x15351f, roughness: 0.92 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    group.add(ground);
    const bounds = new THREE.Mesh(
      new THREE.BoxGeometry(10, 6.2, 8),
      new THREE.MeshBasicMaterial({
        color: 0x5eff9c,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        depthWrite: false
      })
    );
    bounds.position.set(0, 1.85, 0);
    group.add(bounds);

    const balloonShell = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 48, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0x62b7ff,
        transparent: true,
        opacity: 0.34,
        roughness: 0.25,
        transmission: 0.15,
        thickness: 0.3
      })
    );
    balloonShell.position.set(-2.1, 2.7, 0);
    group.add(balloonShell);

    const water = this.createPointCloud({ count: 260, radius: 1.25, colorA: 0x2ee8ff, colorB: 0x2377ff, seed: 44 });
    water.position.copy(balloonShell.position);
    water.material.size = 0.08;
    group.add(water);

    const fire = new THREE.Group();
    fire.position.set(2.4, -1.05, 0);
    const logs = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.28, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x5f331d, roughness: 0.75 })
    );
    logs.rotation.z = 0.22;
    fire.add(logs);
    const flame = this.createPointCloud({ count: 320, radius: 1.6, colorA: 0xfff36a, colorB: 0xff3c00, seed: 99 });
    flame.material.size = 0.12;
    flame.position.y = 1.2;
    fire.add(flame);
    const heatSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.85, 32, 16),
      new THREE.MeshBasicMaterial({
        color: 0xff4536,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    heatSphere.position.y = 1.1;
    fire.add(heatSphere);
    group.add(fire);

    const steam = this.createPointCloud({ count: 180, radius: 2.1, colorA: 0xb8f5ff, colorB: 0xffffff, seed: 118 });
    steam.material.size = 0.1;
    steam.material.opacity = 0.1;
    steam.position.set(0.2, 2.4, 0);
    group.add(steam);

    this.dynamic.surface = { balloonShell, water, fire, flame, steam, heatSphere };
    return group;
  }

  buildMpm() {
    const group = new THREE.Group();
    const floor = new THREE.GridHelper(8.2, 32, 0x9aa5ad, 0x33414a);
    floor.position.y = -2.15;
    floor.material.transparent = true;
    floor.material.opacity = 0.52;
    group.add(floor);
    const points = this.createPointCloud({ count: 1250, radius: 3.05, colorA: 0x2fb6ff, colorB: 0xff6a38, seed: 812 });
    points.material.size = 0.105;
    points.material.opacity = 0.9;
    group.add(points);
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 4.2, 6.6),
      new THREE.MeshBasicMaterial({ color: 0x5eff9c, wireframe: true, transparent: true, opacity: 0.22 })
    );
    group.add(box);
    const interaction = new THREE.Mesh(
      new THREE.SphereGeometry(0.92, 28, 14),
      new THREE.MeshBasicMaterial({
        color: 0xff5544,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    interaction.position.set(1.65, 0.55, 1.2);
    group.add(interaction);
    this.dynamic.mpm = points;
    this.dynamic.mpmInteraction = interaction;
    return group;
  }

  buildMolecular() {
    const group = new THREE.Group();
    const cell = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 3.4, 3.8),
      new THREE.MeshBasicMaterial({
        color: 0x54dfff,
        wireframe: true,
        transparent: true,
        opacity: 0.16,
        depthWrite: false
      })
    );
    cell.position.set(0.85, 0.18, 0);
    group.add(cell);
    const floor = new THREE.GridHelper(6.2, 18, 0x54dfff, 0x223f47);
    floor.position.y = -1.55;
    floor.material.transparent = true;
    floor.material.opacity = 0.24;
    group.add(floor);
    const atoms = [];
    const bonds = [];
    const atomMaterial = {
      H: new THREE.MeshStandardMaterial({ color: 0xdff6ff, emissive: 0x22394a, roughness: 0.35, transparent: true }),
      O: new THREE.MeshStandardMaterial({ color: 0xff596c, emissive: 0x401019, roughness: 0.35, transparent: true }),
      C: new THREE.MeshStandardMaterial({ color: 0x363636, emissive: 0x050505, roughness: 0.55, transparent: true })
    };
    const atomDefs = [
      ['O', 0, 0, 0, 0.36],
      ['H', -0.76, 0.45, 0, 0.22],
      ['H', 0.76, 0.45, 0, 0.22],
      ['C', 2.1, 0, 0, 0.34],
      ['O', 2.78, 0.48, 0, 0.3],
      ['O', 2.78, -0.48, 0, 0.3]
    ];
    for (const [el, x, y, z, radius] of atomDefs) {
      const atom = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 12), atomMaterial[el]);
      atom.position.set(x, y, z);
      group.add(atom);
      atoms.push(atom);
    }
    const bondPairs = [[0, 1], [0, 2], [3, 4], [3, 5]];
    const bondMaterial = new THREE.MeshBasicMaterial({ color: 0x78fff0, transparent: true, opacity: 0.82 });
    for (const [a, b] of bondPairs) {
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 10), bondMaterial);
      group.add(bond);
      bonds.push({ bond, a: atoms[a], b: atoms[b] });
    }
    this.dynamic.molecular = { atoms, bonds };
    return group;
  }

  buildOrbital() {
    const group = new THREE.Group();
    const rand = createSeededRandom(730);
    const positions = new Float32Array(1700 * 3);
    const colors = new Float32Array(1700 * 3);
    const cA = new THREE.Color(0x48f3ff);
    const cB = new THREE.Color(0xff69d7);
    const color = new THREE.Color();
    for (let i = 0; i < 1700; i += 1) {
      const theta = rand() * Math.PI * 2;
      const u = rand() * 2 - 1;
      const lobe = rand() > 0.5 ? 1 : -1;
      const radial = Math.pow(rand(), 0.42) * 3.1;
      const waist = Math.sqrt(Math.max(0, 1 - u * u));
      positions[i * 3] = Math.cos(theta) * waist * radial * 0.48;
      positions[i * 3 + 1] = lobe * (0.25 + Math.abs(u) * radial);
      positions[i * 3 + 2] = Math.sin(theta) * waist * radial * 0.48;
      color.copy(cA).lerp(cB, Math.abs(u));
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    group.add(new THREE.Points(
      geometry,
      new THREE.PointsMaterial(this.pointMaterialOptions({
        size: 0.052,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }))
    ));
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 12),
      new THREE.MeshBasicMaterial({ color: 0xfff3aa })
    ));
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 28, 14),
      new THREE.MeshBasicMaterial({
        color: 0xfff3aa,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    ));
    const guide = new THREE.Group();
    for (const rot of [0, Math.PI / 2]) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.75, 0.008, 6, 96),
        new THREE.MeshBasicMaterial({ color: 0x56f5ff, transparent: true, opacity: 0.24 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = rot;
      guide.add(ring);
    }
    group.add(guide);
    this.dynamic.orbital = group;
    return group;
  }

  setLayer(index, instant = false) {
    const layer = SCALE_LAYERS[index] || SCALE_LAYERS[0];
    const previousLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const previousLayerId = previousLayer.id;
    const sameLayer = previousLayerId === layer.id;
    for (const [id, group] of this.groups) {
      group.visible = id === layer.id || (!instant && !sameLayer && id === previousLayerId);
    }
    this.model.setLayerIndex(index);
    this.layerRevision += 1;
    const target = CAMERA_TARGETS[this.model.layerIndex];
    if (instant || sameLayer) {
      this.cameraTransition = null;
      this.lastCompletedLayerId = layer.id;
      this.camera.position.fromArray(target.position);
      this.controls.target.fromArray(target.target);
      for (const [id, group] of this.groups) {
        group.visible = id === layer.id;
      }
    } else {
      this.cameraTransition = {
        schema: 'peercompute.multiscale.zoom-continuity-transition.v0',
        policy: 'camera-target-lerp-v0',
        fromLayerId: previousLayerId,
        toLayerId: layer.id,
        elapsedSeconds: 0,
        durationSeconds: SCALE_ZOOM_TRANSITION_SECONDS,
        progress: 0,
        startPosition: this.camera.position.clone(),
        endPosition: new THREE.Vector3().fromArray(target.position),
        startTarget: this.controls.target.clone(),
        endTarget: new THREE.Vector3().fromArray(target.target)
      };
    }
    this.updateActiveLayerMarker();
    this.updateNBodyOverlayVisibility();
    this.updateMaxwellOverlayVisibility();
    this.updateCosmologyExpansionOverlayVisibility();
    this.updateMolecularDynamicsOverlayVisibility();
    this.updateSphMaterialOverlayVisibility();
    this.updateHydroAtmosphereOverlayVisibility();
    this.updateRadiationOpacityOverlayVisibility();
    this.updateStellarFusionOverlayVisibility();
    this.updateMagnetospherePlasmaOverlayVisibility();
    this.updatePicPlasmaPatchOverlayVisibility();
    this.updateRelativisticCorrectionOverlayVisibility();
    this.updateCombustionPlumeOverlayVisibility();
    this.setOverlayWaiting(`waiting layer ${this.model.layerIndex + 1}`);
    if (instant) this.controls.update();
  }

  updateLayerTransition(dt) {
    if (!this.cameraTransition) return;
    const transition = this.cameraTransition;
    transition.elapsedSeconds += Math.max(0, Math.min(0.1, Number(dt) || 0));
    const linear = Math.max(0, Math.min(1, transition.elapsedSeconds / transition.durationSeconds));
    const eased = smoothStep01(linear);
    transition.progress = Number(linear.toFixed(4));
    this.camera.position.copy(transition.startPosition).lerp(transition.endPosition, eased);
    this.controls.target.copy(transition.startTarget).lerp(transition.endTarget, eased);
    if (linear >= 1) {
      this.camera.position.copy(transition.endPosition);
      this.controls.target.copy(transition.endTarget);
      this.lastCompletedLayerId = transition.toLayerId;
      for (const [id, group] of this.groups) {
        group.visible = id === transition.toLayerId;
      }
      this.cameraTransition = null;
    }
  }

  syncRenderFrame(frame = this.renderFrame) {
    const nextFrame = Math.max(0, Math.floor(Number(frame) || 0));
    if (nextFrame !== this.renderFrame || this.overlayCommitFrame !== nextFrame) {
      this.renderFrame = nextFrame;
      this.overlayCommitFrame = nextFrame;
      this.overlayCommitCount = 0;
      resetOverlayDataUpdateLedger(this.overlayDataUpdateLedger, { frame: nextFrame });
    }
  }

  setRenderBudget(input = {}, { includeApplications = false } = {}) {
    this.syncRenderFrame(input.frame);
    this.renderBudget = createMultiscaleRenderBudget({
      activeLayerId: this.model.activeLayer?.id || SCALE_LAYERS[this.model.layerIndex]?.id,
      frame: this.renderFrame,
      ...input
    });
    this.applyRenderQualityBudget();
    return this.getRenderBudgetStatus({ includeApplications });
  }

  applyRenderQualityBudget() {
    const scale = Math.max(0.35, Math.min(1, Number(this.renderBudget?.pixelRatioScale) || 1));
    const nextPixelRatio = Math.max(0.5, this.basePixelRatio * scale);
    this.renderQualityPendingPixelRatio = nextPixelRatio;
    if (Math.abs(nextPixelRatio - this.currentPixelRatio) < 0.025) return false;
    const pressure = Math.max(1, Number(this.renderBudget?.pressure) || 1);
    const isDegrade = nextPixelRatio < this.currentPixelRatio;
    const cooldownFrames = isDegrade
      ? pressure >= 4.2
        ? RENDER_QUALITY_SEVERE_COOLDOWN_FRAMES
        : RENDER_QUALITY_DEGRADE_COOLDOWN_FRAMES
      : RENDER_QUALITY_RELAX_COOLDOWN_FRAMES;
    const frame = Math.max(0, Math.floor(Number(this.renderFrame) || 0));
    const framesSinceApply = Number.isFinite(this.renderQualityLastAppliedFrame)
      ? frame - this.renderQualityLastAppliedFrame
      : Number.POSITIVE_INFINITY;
    if (framesSinceApply < cooldownFrames) return false;
    this.currentPixelRatio = nextPixelRatio;
    this.renderQualityLastAppliedFrame = frame;
    this.renderQualityLastAppliedReason = this.renderBudget?.reason || 'budget';
    this.renderQualityApplyCount += 1;
    this.renderer.setPixelRatio(this.currentPixelRatio);
    this.resize();
    return true;
  }

  getRenderBudgetStatus({ includeApplications = true } = {}) {
    const applications = Object.values(this.renderBudgetApplications || {});
    const skippedHiddenCount = applications.filter((entry) => entry?.skipped).length;
    const reusedCommitCount = applications.filter((entry) => entry?.reused).length;
    const visibleFamilyCount = applications.filter((entry) => entry?.visible).length;
    const dominantApplication = applications
      .filter((entry) => Number.isFinite(entry?.sourceCount))
      .sort((a, b) => (b.sourceCount || 0) - (a.sourceCount || 0))[0] || null;
    return {
      ...this.renderBudget,
      activeLayerId: this.model.activeLayer?.id || this.renderBudget?.activeLayerId || 'unknown',
      appliedFamilyCount: applications.length,
      skippedHiddenCount,
      reusedCommitCount,
      visibleFamilyCount,
      visibleCommitCount: this.overlayCommitCount,
      basePixelRatio: Number((this.basePixelRatio || 1).toFixed(3)),
      effectivePixelRatio: Number((this.currentPixelRatio || 1).toFixed(3)),
      pendingPixelRatio: Number((this.renderQualityPendingPixelRatio || this.currentPixelRatio || 1).toFixed(3)),
      renderQualityApplyCount: this.renderQualityApplyCount,
      renderQualityLastAppliedFrame: Number.isFinite(this.renderQualityLastAppliedFrame)
        ? this.renderQualityLastAppliedFrame
        : null,
      renderQualityLastAppliedReason: this.renderQualityLastAppliedReason,
      renderQualityFramesSinceApply: Number.isFinite(this.renderQualityLastAppliedFrame)
        ? Math.max(0, this.renderFrame - this.renderQualityLastAppliedFrame)
        : null,
      dynamicVisualUpdateCount: this.dynamicVisualUpdateCount,
      dynamicVisualSkipCount: this.dynamicVisualSkipCount,
      dynamicVisualLastFrame: this.dynamicVisualFrame,
      overlayDataUpdate: snapshotOverlayDataUpdateLedger(this.overlayDataUpdateLedger),
      dominantApplication: dominantApplication
        ? {
          family: dominantApplication.family,
          acceptedCount: dominantApplication.acceptedCount ?? 0,
          sourceCount: dominantApplication.sourceCount ?? 0,
          visible: !!dominantApplication.visible,
          skipped: !!dominantApplication.skipped,
          reason: dominantApplication.reason || 'unknown'
        }
        : null,
      ...(includeApplications ? { applications: { ...this.renderBudgetApplications } } : {})
    };
  }

  isOverlayFamilyVisible(family) {
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    if (family === 'ladderSnapshot') return false;
    if (family === 'nbody') return N_BODY_VISIBLE_LAYERS.has(activeLayer.id);
    if (family === 'maxwell') return activeLayer.id === 'galactic';
    if (family === 'cosmologyExpansion') return COSMOLOGY_EXPANSION_VISIBLE_LAYERS.has(activeLayer.id);
    if (family === 'molecularDynamics') return MOLECULAR_DYNAMICS_VISIBLE_LAYERS.has(activeLayer.id);
    if (family === 'sphMaterial') return SPH_MATERIAL_VISIBLE_LAYERS.has(activeLayer.id);
    if (family === 'hydroAtmosphere') return activeLayer.id === 'planet';
    if (family === 'radiationOpacity') return RADIATION_OPACITY_VISIBLE_LAYERS.has(activeLayer.id);
    if (family === 'stellarFusion') return STELLAR_FUSION_VISIBLE_LAYERS.has(activeLayer.id);
    if (family === 'magnetospherePlasma') return MAGNETOSPHERE_PLASMA_VISIBLE_LAYERS.has(activeLayer.id);
    if (family === 'picPlasmaPatch') return PIC_PLASMA_PATCH_VISIBLE_LAYERS.has(activeLayer.id);
    if (family === 'relativisticCorrection') return RELATIVISTIC_CORRECTION_VISIBLE_LAYERS.has(activeLayer.id);
    if (family === 'combustionPlume') return COMBUSTION_PLUME_VISIBLE_LAYERS.has(activeLayer.id);
    return false;
  }

  getOverlayRenderBudget(family, baseCapacity, sourceCount, { minVisible = 32 } = {}) {
    const base = Math.max(1, Math.floor(Number(baseCapacity) || 1));
    const source = Math.max(0, Math.floor(Number(sourceCount) || 0));
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.isOverlayFamilyVisible(family);
    const pointScale = Math.max(0.05, Math.min(1, Number(this.renderBudget?.pointScale) || 1));
    const minVisibleScale = Math.max(0.1, Math.min(1, Number(this.renderBudget?.minVisibleScale) || 1));
    const requestedMinVisible = Math.max(1, Math.floor(Number(minVisible) || 1));
    const scaledMinVisible = Math.max(1, Math.floor(requestedMinVisible * minVisibleScale));
    const minCapacity = Math.min(base, scaledMinVisible);
    const scaledCapacity = Math.max(minCapacity, Math.floor(base * pointScale));
    const targetCapacity = Math.min(base, source, scaledCapacity);
    const shouldUpdate = visible || this.renderBudget?.updateHiddenOverlays !== false;
    return {
      family,
      activeLayerId: activeLayer.id,
      visible,
      shouldUpdate,
      reason: shouldUpdate ? 'within-budget' : 'hidden-layer-skipped',
      sourceCount: source,
      baseCapacity: base,
      targetCapacity,
      stride: targetCapacity > 0 ? Math.max(1, Math.ceil(source / targetCapacity)) : 1,
      pointScale,
      minVisibleScale,
      requestedMinVisible,
      scaledMinVisible,
      commitIntervalFrames: Math.max(1, Math.floor(Number(this.renderBudget?.commitIntervalFrames) || 1)),
      maxVisibleCommitsPerFrame: Math.max(1, Math.floor(Number(this.renderBudget?.maxVisibleCommitsPerFrame) || 12)),
      frame: this.renderFrame
    };
  }

  recordOverlayBudgetApplication(family, budget, acceptedCount, details = {}) {
    const record = {
      schema: 'peercompute.multiscale.render-budget-application.v0',
      family,
      activeLayerId: budget.activeLayerId,
      visible: !!budget.visible,
      skipped: !budget.shouldUpdate,
      reason: details.reason || budget.reason,
      sourceCount: budget.sourceCount,
      baseCapacity: budget.baseCapacity,
      targetCapacity: budget.targetCapacity,
      acceptedCount: Math.max(0, Math.floor(Number(acceptedCount) || 0)),
      stride: budget.stride,
      pointScale: Number((budget.pointScale || 1).toFixed(3)),
      minVisibleScale: Number((budget.minVisibleScale || 1).toFixed(3)),
      requestedMinVisible: budget.requestedMinVisible,
      scaledMinVisible: budget.scaledMinVisible,
      updatedAt: Date.now(),
      ...details
    };
    this.renderBudgetApplications[family] = record;
    return record;
  }

  commitOverlayBudgetApplication(family, budget, acceptedCount, details = {}) {
    this.syncRenderFrame(budget.frame);
    const record = this.recordOverlayBudgetApplication(family, budget, acceptedCount, details);
    if (!record.skipped && !record.reused) {
      this.overlayCommitStates[family] = {
        accepted: record.acceptedCount > 0,
        acceptedCount: record.acceptedCount,
        activeLayerId: record.activeLayerId,
        layerRevision: this.layerRevision,
        frame: this.renderFrame,
        sequence: details.sequence ?? null
      };
      if (budget.visible) this.overlayCommitCount += 1;
    }
    return record;
  }

  getOverlayReuseDecision(family, budget, currentStatus, sequence = null) {
    if (!budget.shouldUpdate) return null;
    const interval = Math.max(1, Math.floor(Number(budget.commitIntervalFrames) || 1));
    const maxCommits = Math.max(1, Math.floor(Number(budget.maxVisibleCommitsPerFrame) || 12));
    if (interval <= 1 && (!budget.visible || this.overlayCommitCount < maxCommits)) return null;
    const last = this.overlayCommitStates[family];
    if (!currentStatus?.accepted || !last?.accepted) return null;
    if (budget.visible && currentStatus.visible === false) return null;
    if (last.activeLayerId !== budget.activeLayerId || last.layerRevision !== this.layerRevision) return null;

    const framesSinceCommit = Math.max(0, this.renderFrame - last.frame);
    const overFrameLimit = budget.visible && this.overlayCommitCount >= maxCommits;
    const belowCadence = framesSinceCommit < interval;
    if (!belowCadence && !overFrameLimit) return null;
    if (framesSinceCommit >= Math.max(interval * 2, interval + 2)) return null;

    return {
      reason: belowCadence ? 'active-overlay-cadence-reused' : 'active-overlay-frame-budget-reused',
      framesSinceCommit,
      lastCommittedFrame: last.frame,
      committedSequence: last.sequence,
      sourceSequence: sequence
    };
  }

  reuseOverlayByBudget(family, budget, currentStatus, sequence = null) {
    const decision = this.getOverlayReuseDecision(family, budget, currentStatus, sequence);
    if (!decision) return false;
    const last = this.overlayCommitStates[family];
    const record = this.recordOverlayBudgetApplication(family, budget, last.acceptedCount, {
      reason: decision.reason,
      reused: true,
      skipped: false,
      commitIntervalFrames: budget.commitIntervalFrames,
      maxVisibleCommitsPerFrame: budget.maxVisibleCommitsPerFrame,
      ...decision
    });
    currentStatus.renderBudget = record;
    currentStatus.reusedOverlayCommit = true;
    currentStatus.reusedSequence = sequence;
    return true;
  }

  skipOverlayByBudget(family, budget, setWaiting) {
    if (budget.shouldUpdate) return false;
    if (typeof setWaiting === 'function') setWaiting.call(this, `render skipped ${budget.activeLayerId}`);
    this.recordOverlayBudgetApplication(family, budget, 0);
    return true;
  }

  applyComputeSnapshot(snapshot) {
    const layerIndex = Number.isInteger(snapshot?.layerIndex) ? snapshot.layerIndex : this.model.layerIndex;
    this.setOverlayWaiting('generic snapshot disabled by policy', {
      backend: snapshot?.backend || 'policy-disabled',
      layerIndex,
      sourcePoints: Math.floor((snapshot?.positions?.length || 0) / 3),
      sequence: snapshot?.sequence ?? null
    });
    return false;
  }

  setOverlayWaiting(reason, details = {}) {
    this.overlayStatus = {
      accepted: false,
      reason,
      backend: details.backend || this.overlayStatus.backend || 'none',
      layerIndex: Number.isInteger(details.layerIndex) ? details.layerIndex : this.model.layerIndex,
      acceptedPoints: 0,
      capacity: 0,
      sourcePoints: details.sourcePoints || 0,
      visible: false,
      sequence: details.sequence ?? null,
      hiddenByPolicy: true,
      geometryResident: false
    };
  }

  getOverlayStatus() {
    return { ...this.overlayStatus };
  }

  applyNBodySolverState(result = null) {
    const state = result?.state || result;
    if (!this.nbodyOverlay || !state?.positions || !state?.masses) {
      this.setNBodyOverlayWaiting('no solver state');
      return false;
    }

    const sourceCount = Math.min(
      state.masses.length,
      Math.floor(state.positions.length / 3)
    );
    const budget = this.getOverlayRenderBudget('nbody', N_BODY_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 8
    });
    if (this.skipOverlayByBudget('nbody', budget, this.setNBodyOverlayWaiting)) return false;
    const bodyCount = budget.targetCapacity;
    if (bodyCount < 1) {
      this.setNBodyOverlayWaiting('empty solver state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('nbody', budget, this.nbodyOverlayStatus, sequence)) return true;

    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const layerScale = activeLayer.id === 'galactic' ? 8.8 : 6.4;
    for (let i = 0; i < N_BODY_OVERLAY_CAPACITY; i += 1) {
      const mesh = this.nbodyBodies[i];
      const trail = this.nbodyTrails[i];
      if (i >= bodyCount) {
        mesh.visible = false;
        trail.visible = false;
        continue;
      }

      const sourceOffset = i * 3;
      const x = Number(state.positions[sourceOffset]);
      const y = Number(state.positions[sourceOffset + 1]);
      const z = Number(state.positions[sourceOffset + 2]);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
        mesh.visible = false;
        trail.visible = false;
        continue;
      }

      const mass = Math.max(0.001, Number(state.masses[i]) || 0.001);
      const radius = i === 0 ? 0.58 : Math.min(0.38, 0.12 + Math.cbrt(mass) * 0.045);
      mesh.position.set(x * layerScale, y * layerScale * 0.35, z * layerScale);
      mesh.scale.setScalar(radius / (i === 0 ? 0.42 : 0.18));
      mesh.visible = true;
      this.updateNBodyTrail(i, mesh.position);
    }

    this.nbodyOverlayStatus = {
      accepted: true,
      reason: 'ok',
      backend: result?.backend || 'unknown',
      bodyCount,
      visible: this.updateNBodyOverlayVisibility(),
      layerId: activeLayer.id,
      sequence,
      energyDrift: result?.conservation?.relativeEnergyDrift ?? null,
      renderBudget: this.commitOverlayBudgetApplication('nbody', budget, bodyCount, {
        sequence
      })
    };
    return true;
  }

  updateNBodyTrail(index, position) {
    const trailState = this.nbodyTrailPositions[index];
    const trail = this.nbodyTrails[index];
    if (!trailState || !trail) return;
    const offset = trailState.cursor * 3;
    trailState.values[offset] = position.x;
    trailState.values[offset + 1] = position.y;
    trailState.values[offset + 2] = position.z;
    trailState.cursor = (trailState.cursor + 1) % N_BODY_TRAIL_LENGTH;
    trailState.count = Math.min(N_BODY_TRAIL_LENGTH, trailState.count + 1);

    const ordered = trailState.orderedValues || trailState.values;
    for (let i = 0; i < trailState.count; i += 1) {
      const sourceIndex = (trailState.cursor - trailState.count + i + N_BODY_TRAIL_LENGTH) % N_BODY_TRAIL_LENGTH;
      ordered[i * 3] = trailState.values[sourceIndex * 3];
      ordered[i * 3 + 1] = trailState.values[sourceIndex * 3 + 1];
      ordered[i * 3 + 2] = trailState.values[sourceIndex * 3 + 2];
    }
    const attr = trail.geometry.getAttribute('position');
    if (ordered !== attr.array) attr.array.set(ordered, 0);
    markOverlayAttributeUpdate(attr, {
      family: 'nbodyTrail',
      ledger: this.overlayDataUpdateLedger,
      count: trailState.count * 3,
      fullCount: N_BODY_TRAIL_LENGTH * 3
    });
    trail.geometry.setDrawRange(0, trailState.count);
    trail.visible = trailState.count > 1;
  }

  updateNBodyOverlayVisibility() {
    if (!this.nbodyOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.nbodyOverlayStatus.accepted && N_BODY_VISIBLE_LAYERS.has(activeLayer.id);
    this.nbodyOverlay.visible = visible;
    this.nbodyOverlayStatus.visible = visible;
    this.nbodyOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setNBodyOverlayWaiting(reason) {
    if (this.nbodyOverlay) this.nbodyOverlay.visible = false;
    this.nbodyOverlayStatus = {
      accepted: false,
      reason,
      backend: this.nbodyOverlayStatus.backend || 'none',
      bodyCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.nbodyOverlayStatus.sequence ?? null
    };
  }

  getNBodyOverlayStatus() {
    return { ...this.nbodyOverlayStatus };
  }

  applyMaxwellFieldState(result = null) {
    const state = result?.state || result;
    if (!this.maxwellOverlay || !state?.electric || !state?.magnetic || !state.width || !state.height) {
      this.setMaxwellOverlayWaiting('no field state');
      return false;
    }

    const width = Math.floor(Number(state.width));
    const height = Math.floor(Number(state.height));
    const sourceCount = width * height;
    const budget = this.getOverlayRenderBudget('maxwell', MAXWELL_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 128
    });
    if (this.skipOverlayByBudget('maxwell', budget, this.setMaxwellOverlayWaiting)) return false;
    const vectorCount = budget.targetCapacity;
    if (vectorCount < 1) {
      this.setMaxwellOverlayWaiting('empty field state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('maxwell', budget, this.maxwellOverlayStatus, sequence)) return true;

    const positions = this.maxwellOverlay.geometry.getAttribute('position');
    const colors = this.maxwellOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    let accepted = 0;
    for (let cell = 0; cell < sourceCount && accepted < vectorCount; cell += budget.stride) {
      const x = cell % width;
      const y = Math.floor(cell / width);
      const src = cell * 3;
      const ex = Number(state.electric[src]);
      const ey = Number(state.electric[src + 1]);
      const bz = Number(state.magnetic[src + 2]);
      if (!Number.isFinite(ex) || !Number.isFinite(ey) || !Number.isFinite(bz)) continue;
      const px = (x / Math.max(1, width - 1) - 0.5) * 30;
      const pz = (y / Math.max(1, height - 1) - 0.5) * 30;
      const length = Math.hypot(ex, ey);
      const scale = length > 0 ? Math.min(1.4, 0.45 + length * 4.5) / length : 0;
      const dx = ex * scale;
      const dz = ey * scale;
      const dst = accepted * 6;
      pos[dst] = px - dx * 0.5;
      pos[dst + 1] = bz * 1.8;
      pos[dst + 2] = pz - dz * 0.5;
      pos[dst + 3] = px + dx * 0.5;
      pos[dst + 4] = bz * 1.8;
      pos[dst + 5] = pz + dz * 0.5;

      const colorBase = accepted * 6;
      const heat = Math.min(1, Math.abs(bz) * 6);
      col[colorBase] = 0.25 + heat * 0.75;
      col[colorBase + 1] = 0.9 - heat * 0.35;
      col[colorBase + 2] = 1;
      col[colorBase + 3] = 1;
      col[colorBase + 4] = 0.25 + heat * 0.55;
      col[colorBase + 5] = 0.65 + heat * 0.35;
      accepted += 1;
    }

    this.maxwellOverlay.geometry.setDrawRange(0, accepted * 2);
    markOverlayAttributeUpdate(positions, {
      family: 'maxwell',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 2 * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'maxwell',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 2 * 3
    });
    this.maxwellOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty field state',
      backend: result?.backend || 'unknown',
      vectorCount: accepted,
      visible: this.updateMaxwellOverlayVisibility(),
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence,
      fieldEnergy: result?.diagnostics?.fieldEnergy ?? result?.fieldEnergy ?? null,
      renderBudget: this.commitOverlayBudgetApplication('maxwell', budget, accepted, {
        sequence
      })
    };
    return accepted > 0;
  }

  updateMaxwellOverlayVisibility() {
    if (!this.maxwellOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.maxwellOverlayStatus.accepted && activeLayer.id === 'galactic';
    this.maxwellOverlay.visible = visible;
    this.maxwellOverlayStatus.visible = visible;
    this.maxwellOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setMaxwellOverlayWaiting(reason) {
    if (this.maxwellOverlay) {
      this.maxwellOverlay.visible = false;
      this.maxwellOverlay.geometry.setDrawRange(0, 0);
    }
    this.maxwellOverlayStatus = {
      accepted: false,
      reason,
      backend: this.maxwellOverlayStatus.backend || 'none',
      vectorCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.maxwellOverlayStatus.sequence ?? null
    };
  }

  getMaxwellOverlayStatus() {
    return { ...this.maxwellOverlayStatus };
  }

  applyCosmologyExpansionState(result = null) {
    const state = result?.state || result;
    if (!this.cosmologyExpansionOverlay || !state?.positionsX || !state?.positionsY || !state?.positionsZ || !state?.densityContrast) {
      this.setCosmologyExpansionOverlayWaiting('no cosmology state');
      return false;
    }

    const sourceCount = Math.floor(Number(state.sampleCount ?? state.positionsX.length));
    const budget = this.getOverlayRenderBudget('cosmologyExpansion', COSMOLOGY_EXPANSION_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 256
    });
    if (this.skipOverlayByBudget('cosmologyExpansion', budget, this.setCosmologyExpansionOverlayWaiting)) return false;
    const sampleCount = budget.targetCapacity;
    if (sampleCount < 1) {
      this.setCosmologyExpansionOverlayWaiting('empty cosmology state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('cosmologyExpansion', budget, this.cosmologyExpansionOverlayStatus, sequence)) return true;

    const positions = this.cosmologyExpansionOverlay.geometry.getAttribute('position');
    const colors = this.cosmologyExpansionOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    const stride = budget.stride;
    const scaleFactor = Math.max(0.05, Number(state.scaleFactor || 1));
    const redshift = Math.max(0, Number(result?.diagnostics?.redshift ?? 0));
    const growth = Math.max(0, Number(result?.diagnostics?.structureGrowthProxy ?? 0));
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    let accepted = 0;

    for (let i = 0; i < sourceCount && accepted < sampleCount; i += stride) {
      const x = Number(state.positionsX[i]);
      const y = Number(state.positionsY[i]);
      const z = Number(state.positionsZ[i]);
      const density = Number(state.densityContrast[i]);
      const divergence = Number(state.velocityDivergence?.[i] ?? 0);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z) || !Number.isFinite(density)) continue;
      const dst = accepted * 3;
      const displayScale = 0.62 * Math.min(1.6, Math.sqrt(scaleFactor));
      const warp = Math.min(3.8, Math.abs(divergence) * 1.4 + redshift * 0.18);
      pos[dst] = x * displayScale;
      pos[dst + 1] = y * displayScale + Math.sin(i * 0.31 + scaleFactor) * warp;
      pos[dst + 2] = z * displayScale;

      const clump = Math.min(1, Math.max(0, density) * 0.38);
      const voidTone = Math.min(1, Math.max(0, -density) * 0.85);
      col[dst] = 0.28 + clump * 0.72 + growth * 0.08;
      col[dst + 1] = 0.48 + voidTone * 0.38 + clump * 0.25;
      col[dst + 2] = 0.98 - clump * 0.42 + redshift * 0.02;
      accepted += 1;
    }

    this.cosmologyExpansionOverlay.geometry.setDrawRange(0, accepted);
    markOverlayAttributeUpdate(positions, {
      family: 'cosmologyExpansion',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'cosmologyExpansion',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    this.cosmologyExpansionOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty cosmology state',
      backend: result?.backend || 'unknown',
      sampleCount: accepted,
      visible: false,
      layerId: activeLayer.id,
      sequence,
      scaleFactor: firstFiniteOrNull(result?.diagnostics?.scaleFactor, result?.scaleFactor),
      redshift: firstFiniteOrNull(result?.diagnostics?.redshift, result?.redshift),
      hubbleRate: firstFiniteOrNull(result?.diagnostics?.hubbleRate, result?.hubbleRate),
      filamentEnergy: firstFiniteOrNull(result?.diagnostics?.filamentEnergy, result?.filamentEnergy),
      structureGrowthProxy: firstFiniteOrNull(result?.diagnostics?.structureGrowthProxy, result?.structureGrowthProxy),
      voidFraction: firstFiniteOrNull(result?.diagnostics?.voidFraction, result?.voidFraction),
      renderBudget: this.commitOverlayBudgetApplication('cosmologyExpansion', budget, accepted, {
        sequence
      })
    };
    this.cosmologyExpansionOverlayStatus.visible = this.updateCosmologyExpansionOverlayVisibility();
    return accepted > 0;
  }

  updateCosmologyExpansionOverlayVisibility() {
    if (!this.cosmologyExpansionOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.cosmologyExpansionOverlayStatus.accepted && COSMOLOGY_EXPANSION_VISIBLE_LAYERS.has(activeLayer.id);
    this.cosmologyExpansionOverlay.visible = visible;
    this.cosmologyExpansionOverlayStatus.visible = visible;
    this.cosmologyExpansionOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setCosmologyExpansionOverlayWaiting(reason) {
    if (this.cosmologyExpansionOverlay) {
      this.cosmologyExpansionOverlay.visible = false;
      this.cosmologyExpansionOverlay.geometry.setDrawRange(0, 0);
    }
    this.cosmologyExpansionOverlayStatus = {
      accepted: false,
      reason,
      backend: this.cosmologyExpansionOverlayStatus.backend || 'none',
      sampleCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.cosmologyExpansionOverlayStatus.sequence ?? null
    };
  }

  getCosmologyExpansionOverlayStatus() {
    return { ...this.cosmologyExpansionOverlayStatus };
  }

  applyMolecularDynamicsState(result = null) {
    const state = result?.state || result;
    if (!this.molecularDynamicsOverlay || !state?.positionsX || !state?.positionsY || !state?.positionsZ || !state?.elementZ) {
      this.setMolecularDynamicsOverlayWaiting('no molecular state');
      return false;
    }

    const sourceCount = Math.floor(Number(state.atomCount ?? state.positionsX.length));
    const budget = this.getOverlayRenderBudget('molecularDynamics', MOLECULAR_DYNAMICS_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 192
    });
    if (this.skipOverlayByBudget('molecularDynamics', budget, this.setMolecularDynamicsOverlayWaiting)) return false;
    const atomCount = budget.targetCapacity;
    if (atomCount < 1) {
      this.setMolecularDynamicsOverlayWaiting('empty molecular state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('molecularDynamics', budget, this.molecularDynamicsOverlayStatus, sequence)) return true;

    const atomPositions = this.molecularDynamicsAtoms.geometry.getAttribute('position');
    const atomColors = this.molecularDynamicsAtoms.geometry.getAttribute('color');
    const atomPos = atomPositions.array;
    const atomCol = atomColors.array;
    const stride = budget.stride;
    const indexToAccepted = new Map();
    let acceptedAtoms = 0;

    for (let i = 0; i < sourceCount && acceptedAtoms < atomCount; i += stride) {
      const x = Number(state.positionsX[i]);
      const y = Number(state.positionsY[i]);
      const z = Number(state.positionsZ[i]);
      const element = Math.round(Number(state.elementZ[i]));
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z) || !Number.isFinite(element)) continue;
      const temperature = Number(state.temperatureK?.[i] ?? 294);
      const charge = Number(state.partialCharge?.[i] ?? 0);
      const heat = Math.max(0, Math.min(1, (temperature - 294) / 1800));
      const ion = Math.max(0, Math.min(1, Math.abs(charge) * 0.7));
      const dst = acceptedAtoms * 3;
      atomPos[dst] = x * 1.35;
      atomPos[dst + 1] = y * 1.35 + 0.18;
      atomPos[dst + 2] = z * 1.35;

      if (element === 1) {
        atomCol[dst] = 0.88 + heat * 0.12;
        atomCol[dst + 1] = 0.95 - ion * 0.2;
        atomCol[dst + 2] = 1;
      } else if (element === 8) {
        atomCol[dst] = 1;
        atomCol[dst + 1] = 0.24 + heat * 0.45;
        atomCol[dst + 2] = 0.28 + ion * 0.32;
      } else if (element === 6) {
        atomCol[dst] = 0.24 + heat * 0.45;
        atomCol[dst + 1] = 0.28 + heat * 0.28;
        atomCol[dst + 2] = 0.3 + ion * 0.35;
      } else if (element === 7) {
        atomCol[dst] = 0.28;
        atomCol[dst + 1] = 0.54 + heat * 0.2;
        atomCol[dst + 2] = 1;
      } else if (element === 11 || element === 19) {
        atomCol[dst] = 0.95;
        atomCol[dst + 1] = 0.72 + heat * 0.2;
        atomCol[dst + 2] = 0.3 + ion * 0.2;
      } else if (element === 17 || element === 9) {
        atomCol[dst] = 0.35 + heat * 0.2;
        atomCol[dst + 1] = 1;
        atomCol[dst + 2] = 0.42 + ion * 0.24;
      } else if (element === 26) {
        atomCol[dst] = 0.95;
        atomCol[dst + 1] = 0.46 + heat * 0.34;
        atomCol[dst + 2] = 0.28 + ion * 0.2;
      } else {
        atomCol[dst] = 0.64 + heat * 0.28;
        atomCol[dst + 1] = 0.72;
        atomCol[dst + 2] = 0.72 + ion * 0.2;
      }
      indexToAccepted.set(i, acceptedAtoms);
      acceptedAtoms += 1;
    }

    const bondPositions = this.molecularDynamicsBonds.geometry.getAttribute('position');
    const bondColors = this.molecularDynamicsBonds.geometry.getAttribute('color');
    const bondPos = bondPositions.array;
    const bondCol = bondColors.array;
    const bondSourceCount = Math.min(Number(state.bondA?.length || 0), Number(state.bondB?.length || 0));
    const bondBudget = this.getOverlayRenderBudget('molecularDynamics', MOLECULAR_DYNAMICS_BOND_CAPACITY, bondSourceCount, {
      minVisible: 96
    });
    const bondTargetCount = bondBudget.targetCapacity;
    let acceptedBonds = 0;
    for (let i = 0; i < bondSourceCount && acceptedBonds < bondTargetCount; i += bondBudget.stride) {
      const a = Math.floor(Number(state.bondA[i]));
      const b = Math.floor(Number(state.bondB[i]));
      const acceptedA = indexToAccepted.get(a);
      const acceptedB = indexToAccepted.get(b);
      if (acceptedA == null || acceptedB == null) continue;
      const order = Math.max(0, Math.min(2, Number(state.bondOrder?.[i] ?? 0)));
      const ai = acceptedA * 3;
      const bi = acceptedB * 3;
      const dst = acceptedBonds * 6;
      bondPos[dst] = atomPos[ai];
      bondPos[dst + 1] = atomPos[ai + 1];
      bondPos[dst + 2] = atomPos[ai + 2];
      bondPos[dst + 3] = atomPos[bi];
      bondPos[dst + 4] = atomPos[bi + 1];
      bondPos[dst + 5] = atomPos[bi + 2];
      const colorBase = acceptedBonds * 6;
      const strength = Math.min(1, order / 1.6);
      bondCol[colorBase] = 0.25 + strength * 0.75;
      bondCol[colorBase + 1] = 0.95;
      bondCol[colorBase + 2] = 0.82 - strength * 0.26;
      bondCol[colorBase + 3] = 0.25 + strength * 0.75;
      bondCol[colorBase + 4] = 0.95;
      bondCol[colorBase + 5] = 0.82 - strength * 0.26;
      acceptedBonds += 1;
    }

    this.molecularDynamicsAtoms.geometry.setDrawRange(0, acceptedAtoms);
    this.molecularDynamicsBonds.geometry.setDrawRange(0, acceptedBonds * 2);
    markOverlayAttributeUpdate(atomPositions, {
      family: 'molecularDynamicsAtoms',
      ledger: this.overlayDataUpdateLedger,
      count: acceptedAtoms * 3
    });
    markOverlayAttributeUpdate(atomColors, {
      family: 'molecularDynamicsAtoms',
      ledger: this.overlayDataUpdateLedger,
      count: acceptedAtoms * 3
    });
    markOverlayAttributeUpdate(bondPositions, {
      family: 'molecularDynamicsBonds',
      ledger: this.overlayDataUpdateLedger,
      count: acceptedBonds * 2 * 3
    });
    markOverlayAttributeUpdate(bondColors, {
      family: 'molecularDynamicsBonds',
      ledger: this.overlayDataUpdateLedger,
      count: acceptedBonds * 2 * 3
    });
    this.molecularDynamicsAtoms.material.size = 0.28 + Math.min(0.08, Math.max(0, Number(result?.diagnostics?.meanBondOrder ?? 0)) * 0.04);
    this.molecularDynamicsOverlayStatus = {
      accepted: acceptedAtoms > 0,
      reason: acceptedAtoms > 0 ? 'ok' : 'empty molecular state',
      backend: result?.backend || 'unknown',
      atomCount: acceptedAtoms,
      bondCount: acceptedBonds,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence,
      meanBondOrder: firstFiniteOrNull(result?.diagnostics?.meanBondOrder, result?.meanBondOrder),
      reactionProgress: firstFiniteOrNull(result?.diagnostics?.reactionProgress, result?.reactionProgress),
      heatReleaseProxy: firstFiniteOrNull(result?.diagnostics?.heatReleaseProxy, result?.heatReleaseProxy),
      meanTemperatureK: firstFiniteOrNull(result?.diagnostics?.meanTemperatureK, result?.meanTemperatureK),
      ionizationFraction: firstFiniteOrNull(result?.diagnostics?.ionizationFraction, result?.ionizationFraction),
      totalCharge: firstFiniteOrNull(result?.diagnostics?.totalCharge, result?.totalCharge),
      renderBudget: this.commitOverlayBudgetApplication('molecularDynamics', budget, acceptedAtoms, {
        sequence,
        bondSourceCount,
        bondTargetCapacity: bondTargetCount,
        bondCount: acceptedBonds
      })
    };
    this.molecularDynamicsOverlayStatus.visible = this.updateMolecularDynamicsOverlayVisibility();
    return acceptedAtoms > 0;
  }

  updateMolecularDynamicsOverlayVisibility() {
    if (!this.molecularDynamicsOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.molecularDynamicsOverlayStatus.accepted && MOLECULAR_DYNAMICS_VISIBLE_LAYERS.has(activeLayer.id);
    this.molecularDynamicsOverlay.visible = visible;
    this.molecularDynamicsOverlayStatus.visible = visible;
    this.molecularDynamicsOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setMolecularDynamicsOverlayWaiting(reason) {
    if (this.molecularDynamicsOverlay) {
      this.molecularDynamicsOverlay.visible = false;
      this.molecularDynamicsAtoms.geometry.setDrawRange(0, 0);
      this.molecularDynamicsBonds.geometry.setDrawRange(0, 0);
    }
    this.molecularDynamicsOverlayStatus = {
      accepted: false,
      reason,
      backend: this.molecularDynamicsOverlayStatus.backend || 'none',
      atomCount: 0,
      bondCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.molecularDynamicsOverlayStatus.sequence ?? null
    };
  }

  getMolecularDynamicsOverlayStatus() {
    return { ...this.molecularDynamicsOverlayStatus };
  }

  applyHydroAtmosphereState(result = null) {
    const state = result?.state || result;
    if (!this.hydroAtmosphereOverlay || !state?.columnMass || !state?.temperatureK || !state.width || !state.height) {
      this.setHydroAtmosphereOverlayWaiting('no hydro state');
      return false;
    }

    const width = Math.floor(Number(state.width));
    const height = Math.floor(Number(state.height));
    const sourceCount = width * height;
    const budget = this.getOverlayRenderBudget('hydroAtmosphere', HYDRO_ATMOSPHERE_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 256
    });
    if (this.skipOverlayByBudget('hydroAtmosphere', budget, this.setHydroAtmosphereOverlayWaiting)) return false;
    const cellCount = budget.targetCapacity;
    if (cellCount < 1) {
      this.setHydroAtmosphereOverlayWaiting('empty hydro state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('hydroAtmosphere', budget, this.hydroAtmosphereOverlayStatus, sequence)) return true;

    const positions = this.hydroAtmosphereOverlay.geometry.getAttribute('position');
    const colors = this.hydroAtmosphereOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    const stride = budget.stride;
    let accepted = 0;

    for (let cell = 0; cell < width * height && accepted < cellCount; cell += stride) {
      const x = cell % width;
      const y = Math.floor(cell / width);
      const lon = (x / Math.max(1, width)) * Math.PI * 2;
      const lat = (y / Math.max(1, height - 1) - 0.5) * Math.PI;
      const radius = 7.72 + Math.max(0, Number(state.cloudWater?.[cell] ?? 0)) * 0.55;
      const cosLat = Math.cos(lat);
      const dst = accepted * 3;
      const temperature = Number(state.temperatureK[cell] ?? 294);
      const cloud = Math.max(0, Math.min(1, Number(state.cloudWater?.[cell] ?? 0) * 2.6));
      const precip = Math.max(0, Math.min(1, Number(state.precipitation?.[cell] ?? 0) * 3.4));
      const heat = Math.max(0, Math.min(1, (temperature - 250) / 80));

      pos[dst] = Math.cos(lon) * cosLat * radius;
      pos[dst + 1] = Math.sin(lat) * radius;
      pos[dst + 2] = Math.sin(lon) * cosLat * radius;
      col[dst] = 0.32 + heat * 0.65 + precip * 0.18;
      col[dst + 1] = 0.48 + cloud * 0.5 + precip * 0.25;
      col[dst + 2] = 0.72 + cloud * 0.28;
      accepted += 1;
    }

    this.hydroAtmosphereOverlay.geometry.setDrawRange(0, accepted);
    markOverlayAttributeUpdate(positions, {
      family: 'hydroAtmosphere',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'hydroAtmosphere',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    this.hydroAtmosphereOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty hydro state',
      backend: result?.backend || 'unknown',
      cellCount: accepted,
      visible: this.updateHydroAtmosphereOverlayVisibility(),
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence,
      cloudCover: result?.diagnostics?.cloudCover ?? result?.cloudCover ?? null,
      precipitationMean: result?.diagnostics?.precipitationMean ?? result?.precipitationMean ?? null,
      maxWindMps: result?.diagnostics?.maxWindMps ?? result?.maxWindMps ?? null,
      renderBudget: this.commitOverlayBudgetApplication('hydroAtmosphere', budget, accepted, {
        sequence
      })
    };
    return accepted > 0;
  }

  updateHydroAtmosphereOverlayVisibility() {
    if (!this.hydroAtmosphereOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.hydroAtmosphereOverlayStatus.accepted && activeLayer.id === 'planet';
    this.hydroAtmosphereOverlay.visible = visible;
    this.hydroAtmosphereOverlayStatus.visible = visible;
    this.hydroAtmosphereOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setHydroAtmosphereOverlayWaiting(reason) {
    if (this.hydroAtmosphereOverlay) {
      this.hydroAtmosphereOverlay.visible = false;
      this.hydroAtmosphereOverlay.geometry.setDrawRange(0, 0);
    }
    this.hydroAtmosphereOverlayStatus = {
      accepted: false,
      reason,
      backend: this.hydroAtmosphereOverlayStatus.backend || 'none',
      cellCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.hydroAtmosphereOverlayStatus.sequence ?? null
    };
  }

  getHydroAtmosphereOverlayStatus() {
    return { ...this.hydroAtmosphereOverlayStatus };
  }

  applyRadiationOpacityState(result = null) {
    const state = result?.state || result;
    if (!this.radiationOpacityOverlay || !state?.radiationEnergy || !state?.materialTemperatureK || !state.width || !state.height) {
      this.setRadiationOpacityOverlayWaiting('no radiation state');
      return false;
    }

    const width = Math.floor(Number(state.width));
    const height = Math.floor(Number(state.height));
    const sourceCount = width * height;
    const budget = this.getOverlayRenderBudget('radiationOpacity', RADIATION_OPACITY_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 256
    });
    if (this.skipOverlayByBudget('radiationOpacity', budget, this.setRadiationOpacityOverlayWaiting)) return false;
    const cellCount = budget.targetCapacity;
    if (cellCount < 1) {
      this.setRadiationOpacityOverlayWaiting('empty radiation state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('radiationOpacity', budget, this.radiationOpacityOverlayStatus, sequence)) return true;

    const positions = this.radiationOpacityOverlay.geometry.getAttribute('position');
    const colors = this.radiationOpacityOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    const stride = budget.stride;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    let accepted = 0;

    for (let cell = 0; cell < width * height && accepted < cellCount; cell += stride) {
      const x = cell % width;
      const y = Math.floor(cell / width);
      const u = x / Math.max(1, width - 1) - 0.5;
      const v = y / Math.max(1, height - 1) - 0.5;
      const energy = Math.max(0, Number(state.radiationEnergy[cell] ?? 0));
      const temperature = Number(state.materialTemperatureK[cell] ?? 294);
      const opacity = Math.max(0, Number(state.opacity?.[cell] ?? 0));
      const heat = Math.max(0, Math.min(1, (temperature - 260) / 620));
      const glow = Math.max(0, Math.min(1, energy * 1.2));
      const dst = accepted * 3;

      if (activeLayer.id === 'planet') {
        const lon = (u + 0.5) * Math.PI * 2;
        const lat = v * Math.PI;
        const radius = 8.05 + opacity * 0.22 + glow * 0.18;
        const cosLat = Math.cos(lat);
        pos[dst] = Math.cos(lon) * cosLat * radius;
        pos[dst + 1] = Math.sin(lat) * radius;
        pos[dst + 2] = Math.sin(lon) * cosLat * radius;
      } else if (activeLayer.id === 'solar') {
        const radius = 2.6 + glow * 7.5 + opacity * 0.4;
        const angle = (u + 0.5) * Math.PI * 2;
        pos[dst] = Math.cos(angle) * radius;
        pos[dst + 1] = v * 5.5;
        pos[dst + 2] = Math.sin(angle) * radius;
      } else {
        pos[dst] = u * 9.5;
        pos[dst + 1] = -0.6 + glow * 2.8 + heat * 1.4;
        pos[dst + 2] = v * 9.5;
      }

      col[dst] = 0.75 + heat * 0.25;
      col[dst + 1] = 0.18 + glow * 0.55;
      col[dst + 2] = 0.04 + Math.min(0.55, opacity * 0.35);
      accepted += 1;
    }

    this.radiationOpacityOverlay.geometry.setDrawRange(0, accepted);
    markOverlayAttributeUpdate(positions, {
      family: 'radiationOpacity',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'radiationOpacity',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    this.radiationOpacityOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty radiation state',
      backend: result?.backend || 'unknown',
      cellCount: accepted,
      visible: false,
      layerId: activeLayer.id,
      sequence,
      opticalDepth: firstFiniteOrNull(result?.diagnostics?.opticalDepth, result?.opticalDepth, state?.diagnostics?.opticalDepth, state?.opticalDepth),
      greenhouseFactor: firstFiniteOrNull(result?.diagnostics?.greenhouseFactor, result?.greenhouseFactor, state?.diagnostics?.greenhouseFactor, state?.greenhouseFactor),
      meanTemperatureK: firstFiniteOrNull(result?.diagnostics?.meanTemperatureK, result?.meanTemperatureK, state?.diagnostics?.meanTemperatureK, state?.meanTemperatureK),
      renderBudget: this.commitOverlayBudgetApplication('radiationOpacity', budget, accepted, {
        sequence
      })
    };
    this.radiationOpacityOverlayStatus.visible = this.updateRadiationOpacityOverlayVisibility();
    return accepted > 0;
  }

  updateRadiationOpacityOverlayVisibility() {
    if (!this.radiationOpacityOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.radiationOpacityOverlayStatus.accepted && RADIATION_OPACITY_VISIBLE_LAYERS.has(activeLayer.id);
    this.radiationOpacityOverlay.visible = visible;
    this.radiationOpacityOverlayStatus.visible = visible;
    this.radiationOpacityOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setRadiationOpacityOverlayWaiting(reason) {
    if (this.radiationOpacityOverlay) {
      this.radiationOpacityOverlay.visible = false;
      this.radiationOpacityOverlay.geometry.setDrawRange(0, 0);
    }
    this.radiationOpacityOverlayStatus = {
      accepted: false,
      reason,
      backend: this.radiationOpacityOverlayStatus.backend || 'none',
      cellCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.radiationOpacityOverlayStatus.sequence ?? null
    };
  }

  getRadiationOpacityOverlayStatus() {
    return { ...this.radiationOpacityOverlayStatus };
  }

  applyStellarFusionState(result = null) {
    const state = result?.state || result;
    if (!this.stellarFusionOverlay || !state?.temperatureK || !state?.densityKgM3 || !state.width || !state.height) {
      this.setStellarFusionOverlayWaiting('no stellar-fusion state');
      return false;
    }

    const width = Math.floor(Number(state.width));
    const height = Math.floor(Number(state.height));
    const sourceCount = width * height;
    const budget = this.getOverlayRenderBudget('stellarFusion', STELLAR_FUSION_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 256
    });
    if (this.skipOverlayByBudget('stellarFusion', budget, this.setStellarFusionOverlayWaiting)) return false;
    const cellCount = budget.targetCapacity;
    if (cellCount < 1) {
      this.setStellarFusionOverlayWaiting('empty stellar-fusion state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('stellarFusion', budget, this.stellarFusionOverlayStatus, sequence)) return true;

    const positions = this.stellarFusionOverlay.geometry.getAttribute('position');
    const colors = this.stellarFusionOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    const stride = budget.stride;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    let accepted = 0;

    for (let cell = 0; cell < width * height && accepted < cellCount; cell += stride) {
      const x = cell % width;
      const y = Math.floor(cell / width);
      const u = x / Math.max(1, width - 1) - 0.5;
      const v = y / Math.max(1, height - 1) - 0.5;
      const temperature = Number(state.temperatureK[cell] ?? 5800);
      const density = Number(state.densityKgM3[cell] ?? 0);
      const rate = Math.max(0, Number(state.fusionRate?.[cell] ?? 0));
      const hydrogen = Math.max(0, Math.min(1, Number(state.hydrogenFraction?.[cell] ?? 0.7)));
      const heat = Math.max(0, Math.min(1, (temperature - 1000000) / 18000000));
      const compression = Math.max(0, Math.min(1, density / 160000));
      const radius = 0.35 + compression * 1.2 + rate * 0.22;
      const angle = (u + 0.5) * Math.PI * 2 + v * 0.8;
      const band = Math.cos(v * Math.PI * 0.9);
      const dst = accepted * 3;

      pos[dst] = Math.cos(angle) * radius * band;
      pos[dst + 1] = v * 2.4;
      pos[dst + 2] = Math.sin(angle) * radius * band;
      col[dst] = 0.65 + heat * 0.35;
      col[dst + 1] = 0.28 + rate * 0.16 + heat * 0.45;
      col[dst + 2] = 0.08 + (1 - hydrogen) * 0.38 + compression * 0.18;
      accepted += 1;
    }

    this.stellarFusionOverlay.geometry.setDrawRange(0, accepted);
    markOverlayAttributeUpdate(positions, {
      family: 'stellarFusion',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'stellarFusion',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    this.stellarFusionOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty stellar-fusion state',
      backend: result?.backend || 'unknown',
      cellCount: accepted,
      visible: false,
      layerId: activeLayer.id,
      sequence,
      coreTemperatureK: firstFiniteOrNull(result?.diagnostics?.coreTemperatureK, result?.coreTemperatureK, state?.diagnostics?.coreTemperatureK, state?.coreTemperatureK),
      fusionPowerProxy: firstFiniteOrNull(result?.diagnostics?.fusionPowerProxy, result?.fusionPowerProxy, state?.diagnostics?.fusionPowerProxy, state?.fusionPowerProxy),
      luminosityProxy: firstFiniteOrNull(result?.diagnostics?.luminosityProxy, result?.luminosityProxy, state?.diagnostics?.luminosityProxy, state?.luminosityProxy),
      meanHydrogenFraction: firstFiniteOrNull(result?.diagnostics?.meanHydrogenFraction, result?.meanHydrogenFraction, state?.diagnostics?.meanHydrogenFraction, state?.meanHydrogenFraction),
      meanHeliumFraction: firstFiniteOrNull(result?.diagnostics?.meanHeliumFraction, result?.meanHeliumFraction, state?.diagnostics?.meanHeliumFraction, state?.meanHeliumFraction),
      renderBudget: this.commitOverlayBudgetApplication('stellarFusion', budget, accepted, {
        sequence
      })
    };
    this.stellarFusionOverlayStatus.visible = this.updateStellarFusionOverlayVisibility();
    return accepted > 0;
  }

  updateStellarFusionOverlayVisibility() {
    if (!this.stellarFusionOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.stellarFusionOverlayStatus.accepted && STELLAR_FUSION_VISIBLE_LAYERS.has(activeLayer.id);
    this.stellarFusionOverlay.visible = visible;
    this.stellarFusionOverlayStatus.visible = visible;
    this.stellarFusionOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setStellarFusionOverlayWaiting(reason) {
    if (this.stellarFusionOverlay) {
      this.stellarFusionOverlay.visible = false;
      this.stellarFusionOverlay.geometry.setDrawRange(0, 0);
    }
    this.stellarFusionOverlayStatus = {
      accepted: false,
      reason,
      backend: this.stellarFusionOverlayStatus.backend || 'none',
      cellCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.stellarFusionOverlayStatus.sequence ?? null
    };
  }

  getStellarFusionOverlayStatus() {
    return { ...this.stellarFusionOverlayStatus };
  }

  applyMagnetospherePlasmaState(result = null) {
    const state = result?.state || result;
    if (!this.magnetospherePlasmaOverlay || !state?.plasmaDensity || !state?.magneticX || !state.width || !state.height) {
      this.setMagnetospherePlasmaOverlayWaiting('no magnetosphere state');
      return false;
    }

    const width = Math.floor(Number(state.width));
    const height = Math.floor(Number(state.height));
    const sourceCount = width * height;
    const budget = this.getOverlayRenderBudget('magnetospherePlasma', MAGNETOSPHERE_PLASMA_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 256
    });
    if (this.skipOverlayByBudget('magnetospherePlasma', budget, this.setMagnetospherePlasmaOverlayWaiting)) return false;
    const cellCount = budget.targetCapacity;
    if (cellCount < 1) {
      this.setMagnetospherePlasmaOverlayWaiting('empty magnetosphere state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('magnetospherePlasma', budget, this.magnetospherePlasmaOverlayStatus, sequence)) return true;

    const positions = this.magnetospherePlasmaOverlay.geometry.getAttribute('position');
    const colors = this.magnetospherePlasmaOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    const stride = budget.stride;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    let accepted = 0;

    for (let cell = 0; cell < width * height && accepted < cellCount; cell += stride) {
      const x = cell % width;
      const y = Math.floor(cell / width);
      const u = x / Math.max(1, width - 1) - 0.5;
      const v = y / Math.max(1, height - 1) - 0.5;
      const density = Math.max(0, Number(state.plasmaDensity[cell] ?? 0));
      const ion = Math.max(0, Math.min(1, Number(state.ionizationFraction?.[cell] ?? 0)));
      const bx = Number(state.magneticX[cell] ?? 0);
      const by = Number(state.magneticY[cell] ?? 0);
      const bz = Number(state.magneticZ?.[cell] ?? 0);
      const current = Math.max(0, Number(state.currentDensity?.[cell] ?? 0));
      const field = Math.min(1, Math.hypot(bx, by, bz) * 0.8 + current * 0.2);
      const sheath = Math.exp(-Math.abs(Math.hypot(u, v) - 0.28) * 8);
      const dst = accepted * 3;

      if (activeLayer.id === 'galactic') {
        pos[dst] = u * 30 + bx * 1.6;
        pos[dst + 1] = bz * 2.6 + sheath * 0.9;
        pos[dst + 2] = v * 30 + by * 1.6;
      } else {
        const angle = (u + 0.5) * Math.PI * 2 + by * 0.35;
        const radius = 3.2 + sheath * 7.8 + density * 0.18 + field * 0.7;
        pos[dst] = Math.cos(angle) * radius;
        pos[dst + 1] = v * 7.2 + bz * 0.8;
        pos[dst + 2] = Math.sin(angle) * radius;
      }

      col[dst] = 0.15 + ion * 0.45 + field * 0.25;
      col[dst + 1] = 0.55 + field * 0.35;
      col[dst + 2] = 0.82 + Math.min(0.18, sheath * 0.18);
      accepted += 1;
    }

    this.magnetospherePlasmaOverlay.geometry.setDrawRange(0, accepted);
    markOverlayAttributeUpdate(positions, {
      family: 'magnetospherePlasma',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'magnetospherePlasma',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    this.magnetospherePlasmaOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty magnetosphere state',
      backend: result?.backend || 'unknown',
      cellCount: accepted,
      visible: false,
      layerId: activeLayer.id,
      sequence,
      solarWindPressure: firstFiniteOrNull(result?.diagnostics?.solarWindPressure, result?.solarWindPressure, state?.diagnostics?.solarWindPressure),
      reconnectionRate: firstFiniteOrNull(result?.diagnostics?.reconnectionRate, result?.reconnectionRate, state?.diagnostics?.reconnectionRate),
      magnetopauseRadius: firstFiniteOrNull(result?.diagnostics?.magnetopauseRadius, result?.magnetopauseRadius, state?.diagnostics?.magnetopauseRadius),
      meanIonizationFraction: firstFiniteOrNull(result?.diagnostics?.meanIonizationFraction, result?.meanIonizationFraction, state?.diagnostics?.meanIonizationFraction),
      divergenceBProxy: firstFiniteOrNull(result?.diagnostics?.divergenceBProxy, result?.divergenceBProxy, state?.diagnostics?.divergenceBProxy),
      renderBudget: this.commitOverlayBudgetApplication('magnetospherePlasma', budget, accepted, {
        sequence
      })
    };
    this.magnetospherePlasmaOverlayStatus.visible = this.updateMagnetospherePlasmaOverlayVisibility();
    return accepted > 0;
  }

  updateMagnetospherePlasmaOverlayVisibility() {
    if (!this.magnetospherePlasmaOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.magnetospherePlasmaOverlayStatus.accepted && MAGNETOSPHERE_PLASMA_VISIBLE_LAYERS.has(activeLayer.id);
    this.magnetospherePlasmaOverlay.visible = visible;
    this.magnetospherePlasmaOverlayStatus.visible = visible;
    this.magnetospherePlasmaOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setMagnetospherePlasmaOverlayWaiting(reason) {
    if (this.magnetospherePlasmaOverlay) {
      this.magnetospherePlasmaOverlay.visible = false;
      this.magnetospherePlasmaOverlay.geometry.setDrawRange(0, 0);
    }
    this.magnetospherePlasmaOverlayStatus = {
      accepted: false,
      reason,
      backend: this.magnetospherePlasmaOverlayStatus.backend || 'none',
      cellCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.magnetospherePlasmaOverlayStatus.sequence ?? null
    };
  }

  getMagnetospherePlasmaOverlayStatus() {
    return { ...this.magnetospherePlasmaOverlayStatus };
  }

  applyPicPlasmaPatchState(result = null) {
    const state = result?.state || result;
    if (!this.picPlasmaPatchOverlay || !state?.positionsX || !state?.positionsY || !state?.charges) {
      this.setPicPlasmaPatchOverlayWaiting('no pic patch state');
      return false;
    }

    const sourceCount = Math.floor(Number(state.particleCount ?? state.positionsX.length));
    const budget = this.getOverlayRenderBudget('picPlasmaPatch', PIC_PLASMA_PATCH_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 256
    });
    if (this.skipOverlayByBudget('picPlasmaPatch', budget, this.setPicPlasmaPatchOverlayWaiting)) return false;
    const particleCount = budget.targetCapacity;
    if (particleCount < 1) {
      this.setPicPlasmaPatchOverlayWaiting('empty pic patch state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('picPlasmaPatch', budget, this.picPlasmaPatchOverlayStatus, sequence)) return true;

    const positions = this.picPlasmaPatchOverlay.geometry.getAttribute('position');
    const colors = this.picPlasmaPatchOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    const stride = budget.stride;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    let accepted = 0;

    for (let i = 0; i < sourceCount && accepted < particleCount; i += stride) {
      const x = Number(state.positionsX[i]);
      const y = Number(state.positionsY[i]);
      const vx = Number(state.velocitiesX?.[i] ?? 0);
      const vy = Number(state.velocitiesY?.[i] ?? 0);
      const charge = Number(state.charges[i]);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(charge)) continue;
      const speed = Math.min(1, Math.hypot(vx, vy));
      const electron = charge < 0;
      const dst = accepted * 3;

      if (activeLayer.id === 'galactic') {
        pos[dst] = x * 26 + vx * 3.2;
        pos[dst + 1] = (electron ? -0.7 : 0.7) + speed * 1.8;
        pos[dst + 2] = y * 20 + vy * 3.2;
      } else {
        const angle = -Math.PI * 0.22 + x * Math.PI * 0.24;
        const radius = 7.4 + y * 1.35 + speed * 0.45;
        pos[dst] = Math.cos(angle) * radius;
        pos[dst + 1] = y * 3.2 + (electron ? -0.08 : 0.08);
        pos[dst + 2] = Math.sin(angle) * radius + vy * 0.5;
      }

      if (electron) {
        col[dst] = 0.18 + speed * 0.18;
        col[dst + 1] = 0.72 + speed * 0.2;
        col[dst + 2] = 1;
      } else {
        col[dst] = 1;
        col[dst + 1] = 0.42 + speed * 0.38;
        col[dst + 2] = 0.2 + speed * 0.16;
      }
      accepted += 1;
    }

    this.picPlasmaPatchOverlay.geometry.setDrawRange(0, accepted);
    markOverlayAttributeUpdate(positions, {
      family: 'picPlasmaPatch',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'picPlasmaPatch',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    this.picPlasmaPatchOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty pic patch state',
      backend: result?.backend || 'unknown',
      particleCount: accepted,
      visible: false,
      layerId: activeLayer.id,
      sequence,
      chargeImbalance: firstFiniteOrNull(result?.diagnostics?.chargeImbalance, result?.chargeImbalance, state?.diagnostics?.chargeImbalance),
      currentDensity: firstFiniteOrNull(result?.diagnostics?.currentDensity, result?.currentDensity, state?.diagnostics?.currentDensity),
      reconnectionHeating: firstFiniteOrNull(result?.diagnostics?.reconnectionHeating, result?.reconnectionHeating, state?.diagnostics?.reconnectionHeating),
      particleEscapeFraction: firstFiniteOrNull(result?.diagnostics?.particleEscapeFraction, result?.particleEscapeFraction, state?.diagnostics?.particleEscapeFraction),
      divergenceEProxy: firstFiniteOrNull(result?.diagnostics?.divergenceEProxy, result?.divergenceEProxy, result?.conservation?.divergenceEProxy, state?.diagnostics?.divergenceEProxy),
      renderBudget: this.commitOverlayBudgetApplication('picPlasmaPatch', budget, accepted, {
        sequence
      })
    };
    this.picPlasmaPatchOverlayStatus.visible = this.updatePicPlasmaPatchOverlayVisibility();
    return accepted > 0;
  }

  updatePicPlasmaPatchOverlayVisibility() {
    if (!this.picPlasmaPatchOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.picPlasmaPatchOverlayStatus.accepted && PIC_PLASMA_PATCH_VISIBLE_LAYERS.has(activeLayer.id);
    this.picPlasmaPatchOverlay.visible = visible;
    this.picPlasmaPatchOverlayStatus.visible = visible;
    this.picPlasmaPatchOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setPicPlasmaPatchOverlayWaiting(reason) {
    if (this.picPlasmaPatchOverlay) {
      this.picPlasmaPatchOverlay.visible = false;
      this.picPlasmaPatchOverlay.geometry.setDrawRange(0, 0);
    }
    this.picPlasmaPatchOverlayStatus = {
      accepted: false,
      reason,
      backend: this.picPlasmaPatchOverlayStatus.backend || 'none',
      particleCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.picPlasmaPatchOverlayStatus.sequence ?? null
    };
  }

  getPicPlasmaPatchOverlayStatus() {
    return { ...this.picPlasmaPatchOverlayStatus };
  }

  applyRelativisticCorrectionState(result = null) {
    const state = result?.state || result;
    if (!this.relativisticCorrectionOverlay || !state?.radiiAu || !state?.speedFractionC || !state?.phase) {
      this.setRelativisticCorrectionOverlayWaiting('no relativistic state');
      return false;
    }

    const sourceCount = Math.floor(Number(state.sampleCount ?? state.radiiAu.length));
    const budget = this.getOverlayRenderBudget('relativisticCorrection', RELATIVISTIC_CORRECTION_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 256
    });
    if (this.skipOverlayByBudget('relativisticCorrection', budget, this.setRelativisticCorrectionOverlayWaiting)) return false;
    const sampleCount = budget.targetCapacity;
    if (sampleCount < 1) {
      this.setRelativisticCorrectionOverlayWaiting('empty relativistic state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('relativisticCorrection', budget, this.relativisticCorrectionOverlayStatus, sequence)) return true;

    const positions = this.relativisticCorrectionOverlay.geometry.getAttribute('position');
    const colors = this.relativisticCorrectionOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    const stride = budget.stride;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    let accepted = 0;

    for (let i = 0; i < sourceCount && accepted < sampleCount; i += stride) {
      const radiusAu = Number(state.radiiAu[i]);
      const beta = Number(state.speedFractionC[i]);
      const phase = Number(state.phase[i]);
      const timeDilation = Number(state.timeDilationFactor?.[i] ?? 1);
      const redshift = Number(state.gravitationalRedshiftProxy?.[i] ?? 0);
      const frameDragging = Number(state.frameDraggingProxy?.[i] ?? 0);
      if (!Number.isFinite(radiusAu) || !Number.isFinite(beta) || !Number.isFinite(phase)) continue;
      const dst = accepted * 3;
      const radius = activeLayer.id === 'supergalactic'
        ? 18 + Math.log1p(radiusAu) * 9
        : activeLayer.id === 'galactic'
          ? 10 + Math.log1p(radiusAu) * 6
          : 4.2 + Math.log1p(radiusAu) * 2.2;
      const warp = Math.min(2.5, redshift * 52 + frameDragging * 1.8);
      pos[dst] = Math.cos(phase) * (radius + warp);
      pos[dst + 1] = (0.5 - timeDilation) * 4 + Math.sin(phase * 2) * warp * 0.14;
      pos[dst + 2] = Math.sin(phase) * (radius - warp * 0.35);

      col[dst] = 0.45 + Math.min(0.55, redshift * 24 + beta * 0.42);
      col[dst + 1] = 0.72 + Math.min(0.24, frameDragging * 3.2);
      col[dst + 2] = 1 - Math.min(0.62, redshift * 18);
      accepted += 1;
    }

    this.relativisticCorrectionOverlay.geometry.setDrawRange(0, accepted);
    markOverlayAttributeUpdate(positions, {
      family: 'relativisticCorrection',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'relativisticCorrection',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    this.relativisticCorrectionOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty relativistic state',
      backend: result?.backend || 'unknown',
      sampleCount: accepted,
      visible: false,
      layerId: activeLayer.id,
      sequence,
      maxSpeedFractionC: firstFiniteOrNull(result?.diagnostics?.maxSpeedFractionC, result?.maxSpeedFractionC),
      meanLorentzFactor: firstFiniteOrNull(result?.diagnostics?.meanLorentzFactor, result?.meanLorentzFactor),
      meanTimeDilation: firstFiniteOrNull(result?.diagnostics?.meanTimeDilation, result?.meanTimeDilation),
      gravitationalRedshiftProxy: firstFiniteOrNull(result?.diagnostics?.gravitationalRedshiftProxy, result?.gravitationalRedshiftProxy),
      perihelionPrecessionArcsecProxy: firstFiniteOrNull(result?.diagnostics?.perihelionPrecessionArcsecProxy, result?.perihelionPrecessionArcsecProxy),
      frameDraggingProxy: firstFiniteOrNull(result?.diagnostics?.frameDraggingProxy, result?.frameDraggingProxy),
      lensingDeflectionArcsecProxy: firstFiniteOrNull(result?.diagnostics?.lensingDeflectionArcsecProxy, result?.lensingDeflectionArcsecProxy),
      renderBudget: this.commitOverlayBudgetApplication('relativisticCorrection', budget, accepted, {
        sequence
      })
    };
    this.relativisticCorrectionOverlayStatus.visible = this.updateRelativisticCorrectionOverlayVisibility();
    return accepted > 0;
  }

  updateRelativisticCorrectionOverlayVisibility() {
    if (!this.relativisticCorrectionOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.relativisticCorrectionOverlayStatus.accepted && RELATIVISTIC_CORRECTION_VISIBLE_LAYERS.has(activeLayer.id);
    this.relativisticCorrectionOverlay.visible = visible;
    this.relativisticCorrectionOverlayStatus.visible = visible;
    this.relativisticCorrectionOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setRelativisticCorrectionOverlayWaiting(reason) {
    if (this.relativisticCorrectionOverlay) {
      this.relativisticCorrectionOverlay.visible = false;
      this.relativisticCorrectionOverlay.geometry.setDrawRange(0, 0);
    }
    this.relativisticCorrectionOverlayStatus = {
      accepted: false,
      reason,
      backend: this.relativisticCorrectionOverlayStatus.backend || 'none',
      sampleCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.relativisticCorrectionOverlayStatus.sequence ?? null
    };
  }

  getRelativisticCorrectionOverlayStatus() {
    return { ...this.relativisticCorrectionOverlayStatus };
  }

  applyCombustionPlumeState(result = null) {
    const state = result?.state || result;
    if (!this.combustionPlumeOverlay || !state?.temperatureK || !state?.fuel || !state?.smoke || !state.width || !state.height) {
      this.setCombustionPlumeOverlayWaiting('no combustion state');
      return false;
    }

    const width = Math.floor(Number(state.width));
    const height = Math.floor(Number(state.height));
    const sourceCount = width * height;
    const budget = this.getOverlayRenderBudget('combustionPlume', COMBUSTION_PLUME_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 256
    });
    if (this.skipOverlayByBudget('combustionPlume', budget, this.setCombustionPlumeOverlayWaiting)) return false;
    const cellCount = budget.targetCapacity;
    if (cellCount < 1) {
      this.setCombustionPlumeOverlayWaiting('empty combustion state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('combustionPlume', budget, this.combustionPlumeOverlayStatus, sequence)) return true;

    const positions = this.combustionPlumeOverlay.geometry.getAttribute('position');
    const colors = this.combustionPlumeOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    const stride = budget.stride;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const layerScale = activeLayer.id === 'mpm' ? 0.72 : 1;
    let accepted = 0;

    for (let cell = 0; cell < width * height && accepted < cellCount; cell += stride) {
      const x = cell % width;
      const y = Math.floor(cell / width);
      const u = x / Math.max(1, width - 1) - 0.5;
      const v = y / Math.max(1, height - 1) - 0.5;
      const temperature = Number(state.temperatureK[cell] ?? 294);
      const smoke = Math.max(0, Math.min(1.4, Number(state.smoke?.[cell] ?? 0)));
      const fuel = Math.max(0, Math.min(1.4, Number(state.fuel?.[cell] ?? 0)));
      const heatRelease = Math.max(0, Number(state.heatRelease?.[cell] ?? 0));
      const windX = Math.max(-2, Math.min(2, Number(state.windX?.[cell] ?? 0)));
      const windY = Math.max(-2, Math.min(2, Number(state.windY?.[cell] ?? 0)));
      const heat = Math.max(0, Math.min(1, (temperature - 420) / 1200));
      const plumeLift = heat * 2.2 + smoke * 0.8;
      const dst = accepted * 3;

      pos[dst] = (2.4 + u * 5.8 + windX * 0.15) * layerScale;
      pos[dst + 1] = (-0.9 + plumeLift + v * 0.65 + Math.max(0, windY) * 0.08) * layerScale;
      pos[dst + 2] = v * 5.2 * layerScale;

      const smokeTint = Math.min(1, smoke * 0.9);
      const burnTint = Math.min(1, heatRelease / 2100 + heat * 0.7);
      col[dst] = 0.42 + burnTint * 0.58 + fuel * 0.05;
      col[dst + 1] = 0.16 + burnTint * 0.62 + smokeTint * 0.16;
      col[dst + 2] = 0.08 + smokeTint * 0.5;
      accepted += 1;
    }

    this.combustionPlumeOverlay.geometry.setDrawRange(0, accepted);
    markOverlayAttributeUpdate(positions, {
      family: 'combustionPlume',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'combustionPlume',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    this.combustionPlumeOverlay.material.size = activeLayer.id === 'mpm' ? 0.075 : 0.105;
    this.combustionPlumeOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty combustion state',
      backend: result?.backend || 'unknown',
      cellCount: accepted,
      visible: false,
      layerId: activeLayer.id,
      sequence,
      fireAreaFraction: firstFiniteOrNull(result?.diagnostics?.fireAreaFraction, result?.fireAreaFraction, state?.diagnostics?.fireAreaFraction, state?.fireAreaFraction),
      smokeColumn: firstFiniteOrNull(result?.diagnostics?.smokeColumn, result?.smokeColumn, state?.diagnostics?.smokeColumn, state?.smokeColumn),
      fuelRemaining: firstFiniteOrNull(result?.diagnostics?.fuelRemaining, result?.fuelRemaining, state?.diagnostics?.fuelRemaining, state?.fuelRemaining),
      maxTemperatureK: firstFiniteOrNull(result?.diagnostics?.maxTemperatureK, result?.maxTemperatureK, state?.diagnostics?.maxTemperatureK, state?.maxTemperatureK),
      smokeCentroidX: firstFiniteOrNull(result?.diagnostics?.smokeCentroidX, result?.smokeCentroidX, state?.diagnostics?.smokeCentroidX, state?.smokeCentroidX),
      smokeCentroidY: firstFiniteOrNull(result?.diagnostics?.smokeCentroidY, result?.smokeCentroidY, state?.diagnostics?.smokeCentroidY, state?.smokeCentroidY),
      plumeRise: firstFiniteOrNull(result?.diagnostics?.plumeRise, result?.plumeRise, state?.diagnostics?.plumeRise, state?.plumeRise),
      buoyancyFlux: firstFiniteOrNull(result?.diagnostics?.buoyancyFlux, result?.buoyancyFlux, state?.diagnostics?.buoyancyFlux, state?.buoyancyFlux),
      oxygenDepletion: firstFiniteOrNull(result?.diagnostics?.oxygenDepletion, result?.oxygenDepletion, state?.diagnostics?.oxygenDepletion, state?.oxygenDepletion),
      suppressionMean: firstFiniteOrNull(result?.diagnostics?.suppressionMean, result?.suppressionMean, state?.diagnostics?.suppressionMean, state?.suppressionMean),
      renderBudget: this.commitOverlayBudgetApplication('combustionPlume', budget, accepted, {
        sequence
      })
    };
    this.combustionPlumeOverlayStatus.visible = this.updateCombustionPlumeOverlayVisibility();
    return accepted > 0;
  }

  updateCombustionPlumeOverlayVisibility() {
    if (!this.combustionPlumeOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.combustionPlumeOverlayStatus.accepted && COMBUSTION_PLUME_VISIBLE_LAYERS.has(activeLayer.id);
    this.combustionPlumeOverlay.visible = visible;
    this.combustionPlumeOverlayStatus.visible = visible;
    this.combustionPlumeOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setCombustionPlumeOverlayWaiting(reason) {
    if (this.combustionPlumeOverlay) {
      this.combustionPlumeOverlay.visible = false;
      this.combustionPlumeOverlay.geometry.setDrawRange(0, 0);
    }
    this.combustionPlumeOverlayStatus = {
      accepted: false,
      reason,
      backend: this.combustionPlumeOverlayStatus.backend || 'none',
      cellCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.combustionPlumeOverlayStatus.sequence ?? null
    };
  }

  getCombustionPlumeOverlayStatus() {
    return { ...this.combustionPlumeOverlayStatus };
  }

  applySphMaterialState(result = null) {
    const state = result?.state || result;
    if (!this.sphMaterialOverlay || !state?.positions || !state?.masses) {
      this.setSphMaterialOverlayWaiting('no material state');
      return false;
    }

    const sourceCount = Math.min(
      state.masses.length,
      Math.floor(state.positions.length / 3)
    );
    const budget = this.getOverlayRenderBudget('sphMaterial', SPH_MATERIAL_OVERLAY_CAPACITY, sourceCount, {
      minVisible: 192
    });
    if (this.skipOverlayByBudget('sphMaterial', budget, this.setSphMaterialOverlayWaiting)) return false;
    const particleCount = budget.targetCapacity;
    if (particleCount < 1) {
      this.setSphMaterialOverlayWaiting('empty material state');
      return false;
    }
    const sequence = result?.sequence ?? state.sequence ?? null;
    if (this.reuseOverlayByBudget('sphMaterial', budget, this.sphMaterialOverlayStatus, sequence)) return true;

    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const positions = this.sphMaterialOverlay.geometry.getAttribute('position');
    const colors = this.sphMaterialOverlay.geometry.getAttribute('color');
    const pos = positions.array;
    const col = colors.array;
    const layerScale = activeLayer.id === 'mpm' ? 0.82 : 1;
    let accepted = 0;

    for (let i = 0; i < sourceCount && accepted < particleCount; i += budget.stride) {
      const src = i * 3;
      const x = Number(state.positions[src]);
      const y = Number(state.positions[src + 1]);
      const z = Number(state.positions[src + 2]);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) continue;
      const temperature = Number(state.temperatures?.[i] ?? 294);
      const phase = Math.max(0, Math.min(1, Number(state.phases?.[i] ?? 0)));
      const heat = Math.max(0, Math.min(1, (temperature - 294) / 520));
      const dst = accepted * 3;
      pos[dst] = x * layerScale;
      pos[dst + 1] = y * layerScale;
      pos[dst + 2] = z * layerScale;
      col[dst] = 0.15 + heat * 0.9 + phase * 0.35;
      col[dst + 1] = 0.72 + phase * 0.2;
      col[dst + 2] = 1 - heat * 0.45 + phase * 0.2;
      accepted += 1;
    }

    this.sphMaterialOverlay.geometry.setDrawRange(0, accepted);
    markOverlayAttributeUpdate(positions, {
      family: 'sphMaterial',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    markOverlayAttributeUpdate(colors, {
      family: 'sphMaterial',
      ledger: this.overlayDataUpdateLedger,
      count: accepted * 3
    });
    this.sphMaterialOverlay.material.size = activeLayer.id === 'mpm' ? 0.085 : 0.095;
    this.sphMaterialOverlayStatus = {
      accepted: accepted > 0,
      reason: accepted > 0 ? 'ok' : 'empty material state',
      backend: result?.backend || 'unknown',
      particleCount: accepted,
      visible: this.updateSphMaterialOverlayVisibility(),
      layerId: activeLayer.id,
      sequence,
      averageTemperatureK: result?.diagnostics?.averageTemperatureK ?? result?.averageTemperatureK ?? null,
      vaporFraction: result?.diagnostics?.vaporFraction ?? result?.vaporFraction ?? null,
      renderBudget: this.commitOverlayBudgetApplication('sphMaterial', budget, accepted, {
        sequence
      })
    };
    return accepted > 0;
  }

  updateSphMaterialOverlayVisibility() {
    if (!this.sphMaterialOverlay) return false;
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const visible = this.sphMaterialOverlayStatus.accepted && SPH_MATERIAL_VISIBLE_LAYERS.has(activeLayer.id);
    this.sphMaterialOverlay.visible = visible;
    this.sphMaterialOverlayStatus.visible = visible;
    this.sphMaterialOverlayStatus.layerId = activeLayer.id;
    return visible;
  }

  setSphMaterialOverlayWaiting(reason) {
    if (this.sphMaterialOverlay) {
      this.sphMaterialOverlay.visible = false;
      this.sphMaterialOverlay.geometry.setDrawRange(0, 0);
    }
    this.sphMaterialOverlayStatus = {
      accepted: false,
      reason,
      backend: this.sphMaterialOverlayStatus.backend || 'none',
      particleCount: 0,
      visible: false,
      layerId: SCALE_LAYERS[this.model.layerIndex]?.id || 'none',
      sequence: this.sphMaterialOverlayStatus.sequence ?? null
    };
  }

  getSphMaterialOverlayStatus() {
    return { ...this.sphMaterialOverlayStatus };
  }

  getVisualReferenceStatus() {
    const activeLayer = SCALE_LAYERS[this.model.layerIndex] || SCALE_LAYERS[0];
    const activeReference = getScaleVisualReference(activeLayer.id);
    return {
      schema: MULTISCALE_VISUAL_REFERENCE_SCHEMA,
      policy: 'bottom-up-existing-demo-reference-v1',
      activeLayerId: activeLayer.id,
      activeReference: activeReference ? { ...activeReference } : null,
      zoomContinuity: {
        schema: 'peercompute.multiscale.zoom-continuity.v0',
        policy: 'seamless-scale-ladder-camera-lerp-v0',
        mode: 'zoom-first-scale-navigation',
        transitionSeconds: SCALE_ZOOM_TRANSITION_SECONDS,
        previousLayerId: this.cameraTransition?.fromLayerId || this.lastCompletedLayerId,
        targetLayerId: this.cameraTransition?.toLayerId || activeLayer.id,
        active: !!this.cameraTransition,
        progress: this.cameraTransition ? this.cameraTransition.progress : 1,
        visibleLayerIds: Array.from(this.groups.entries())
          .filter(([, group]) => group.visible)
          .map(([id]) => id),
        continuityBoundary: activeReference?.bottomUpPriority || 'unknown'
      },
      scaleReferences: SCALE_LAYERS.map((layer, index) => ({
        layerId: layer.id,
        layerIndex: index,
        ...(getScaleVisualReference(layer.id) || {})
      }))
    };
  }

  updateActiveLayerMarker() {
    const radius = LAYER_FRAME_RADII[this.model.layerIndex] || 6;
    this.activeLayerMarker.scale.setScalar(radius);
  }

  resize() {
    const { clientWidth, clientHeight } = this.canvas;
    const width = Math.max(1, clientWidth);
    const height = Math.max(1, clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  update() {
    const dt = this.clock.getDelta();
    this.model.update(dt);
    const dynamicInterval = Math.max(1, Math.floor(Number(this.renderBudget?.dynamicVisualIntervalFrames) || 1));
    const layerChanged = this.dynamicVisualLayerRevision !== this.layerRevision;
    const shouldUpdateDynamicVisuals = layerChanged
      || this.dynamicVisualFrame < 0
      || this.renderFrame - this.dynamicVisualFrame >= dynamicInterval;
    if (shouldUpdateDynamicVisuals) {
      this.updateDynamicVisuals();
      this.dynamicVisualFrame = this.renderFrame;
      this.dynamicVisualLayerRevision = this.layerRevision;
      this.dynamicVisualUpdateCount += 1;
    } else {
      this.dynamicVisualSkipCount += 1;
    }
    this.updateLayerTransition(dt);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  updateDynamicVisuals() {
    const t = this.model.time;
    if (this.activeLayerMarker) {
      this.activeLayerMarker.rotation.y = t * 0.045;
      this.activeLayerMarker.rotation.z = Math.sin(t * 0.18) * 0.035;
    }
    if (this.dynamic.galaxy) this.dynamic.galaxy.rotation.y = t * 0.035;
    if (this.dynamic.planets) {
      for (const planet of this.dynamic.planets) {
        const angle = t * planet.speed;
        planet.mesh.position.set(Math.cos(angle) * planet.r, 0, Math.sin(angle) * planet.r);
      }
    }
    if (this.dynamic.planet) {
      const { planet } = this.model.state;
      this.dynamic.planet.group.rotation.y = t * 0.08;
      this.dynamic.planet.clouds.rotation.y = -t * (0.12 + planet.stormEnergy * 0.1);
      this.dynamic.planet.clouds.material.opacity = 0.12 + planet.cloudCover * 0.24;
      this.dynamic.planet.storm.scale.setScalar(0.6 + planet.stormEnergy * 0.8);
      this.dynamic.planet.atmosphere.material.opacity = 0.1 + planet.cloudCover * 0.05 + planet.stormEnergy * 0.03;
    }
    if (this.dynamic.surface) {
      const { surface, balloon } = this.model.state;
      const integrity = Math.max(0.05, balloon.membraneIntegrity);
      const shellRisk = Math.max(0, Math.min(1, balloon.membraneShell?.ruptureRisk || 0));
      this.dynamic.surface.balloonShell.scale.setScalar(balloon.ruptured ? 0.42 : 0.9 + (1 - integrity) * 0.12);
      this.dynamic.surface.balloonShell.material.opacity = balloon.ruptured ? 0.12 : 0.28 + integrity * 0.16;
      this.dynamic.surface.balloonShell.material.color.setRGB(0.35 + shellRisk * 0.55, 0.68 - shellRisk * 0.32, 1 - shellRisk * 0.28);
      this.dynamic.surface.balloonShell.material.emissive.setRGB(shellRisk * 0.22, shellRisk * 0.05, shellRisk * 0.03);
      this.dynamic.surface.water.scale.setScalar(balloon.ruptured ? 1.5 + surface.waterContact * 1.7 : 1);
      this.dynamic.surface.water.position.set(balloon.ruptured ? -0.2 : -2.1, balloon.ruptured ? -0.8 : 2.7, 0);
      this.dynamic.surface.flame.scale.set(0.6 + surface.fireIntensity * 0.8, 0.25 + surface.fireIntensity * 1.5, 0.6 + surface.fireIntensity * 0.8);
      this.dynamic.surface.flame.material.opacity = 0.12 + surface.fireIntensity * 0.85;
      this.dynamic.surface.heatSphere.scale.setScalar(0.68 + surface.fireIntensity * 0.52);
      this.dynamic.surface.heatSphere.material.opacity = 0.05 + surface.fireIntensity * 0.18;
      this.dynamic.surface.steam.material.opacity = 0.08 + balloon.steamMassKg * 4.2;
      this.dynamic.surface.steam.rotation.y = t * 0.2;
    }
    if (this.dynamic.mpm) {
      this.dynamic.mpm.rotation.y = t * 0.18;
      this.dynamic.mpm.scale.y = 0.74 + this.model.state.mpm.deformation * 0.5;
      this.dynamic.mpm.material.size = 0.055 + this.model.state.mpm.thermalEnergy * 0.06;
    }
    if (this.dynamic.mpmInteraction) {
      this.dynamic.mpmInteraction.position.x = Math.sin(t * 0.7) * 1.65;
      this.dynamic.mpmInteraction.position.z = Math.cos(t * 0.55) * 1.2;
      this.dynamic.mpmInteraction.scale.setScalar(0.75 + this.model.state.mpm.thermalEnergy * 0.55);
    }
    if (this.dynamic.molecular) {
      const liveMolecularOverlayVisible = this.molecularDynamicsOverlay?.visible === true
        && this.molecularDynamicsOverlayStatus?.accepted === true;
      for (let i = 0; i < this.dynamic.molecular.atoms.length; i += 1) {
        const atom = this.dynamic.molecular.atoms[i];
        atom.visible = !liveMolecularOverlayVisible;
        atom.position.z = Math.sin(t * 1.4 + i) * 0.08;
      }
      for (const item of this.dynamic.molecular.bonds) {
        item.bond.visible = !liveMolecularOverlayVisible;
        this.updateBond(item.bond, item.a.position, item.b.position);
      }
    }
    if (this.dynamic.orbital) this.dynamic.orbital.rotation.y = t * 0.18;
    if (this.nbodyOverlay && this.nbodyOverlay.visible && this.model.activeLayer.id === 'galactic') {
      this.nbodyOverlay.rotation.y = t * 0.018;
    } else if (this.nbodyOverlay) {
      this.nbodyOverlay.rotation.y = 0;
    }
    if (this.stellarFusionOverlay) {
      this.stellarFusionOverlay.rotation.y = this.stellarFusionOverlay.visible ? t * 0.22 : 0;
    }
    if (this.magnetospherePlasmaOverlay) {
      this.magnetospherePlasmaOverlay.rotation.y = this.magnetospherePlasmaOverlay.visible ? t * 0.11 : 0;
    }
    if (this.picPlasmaPatchOverlay) {
      this.picPlasmaPatchOverlay.rotation.y = this.picPlasmaPatchOverlay.visible ? t * 0.16 : 0;
    }
    if (this.relativisticCorrectionOverlay) {
      this.relativisticCorrectionOverlay.rotation.y = this.relativisticCorrectionOverlay.visible ? t * 0.055 : 0;
    }
    if (this.cosmologyExpansionOverlay) {
      this.cosmologyExpansionOverlay.rotation.y = this.cosmologyExpansionOverlay.visible ? t * 0.018 : 0;
    }
    if (this.molecularDynamicsOverlay) {
      this.molecularDynamicsOverlay.rotation.y = this.molecularDynamicsOverlay.visible ? t * 0.12 : 0;
    }
  }

  updateBond(mesh, start, end) {
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const direction = end.clone().sub(start);
    mesh.position.copy(midpoint);
    mesh.scale.set(1, direction.length(), 1);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  }
}

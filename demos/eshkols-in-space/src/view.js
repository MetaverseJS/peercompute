import * as THREE from 'three/webgpu';
import { attribute, instanceIndex, mix, modelViewMatrix, uniform, uv, varying, vec3, vertexIndex } from 'three/tsl';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Three r182 exposes GPU vertex allocations through its WebGPU backend.
// Keep the renderer-owned destination stable across simulation ping-pong swaps.
function createBodyVertexBuffer(renderer, initialBodies, geometry, asPoints) {
  const records = asPoints
    ? new THREE.InterleavedBuffer(initialBodies, 8)
    : new THREE.InstancedInterleavedBuffer(initialBodies, 8);
  const positions = new THREE.InterleavedBufferAttribute(records, 3, 0);
  geometry.setAttribute(asPoints ? 'position' : 'bodyPosition', positions);
  geometry.setAttribute('bodyMass', new THREE.InterleavedBufferAttribute(records, 1, 3));
  renderer.backend.createAttribute(positions);
  return renderer.backend.get(records).buffer;
}

export async function createView(canvas, scaleLabel, device) {
  const renderer = new THREE.WebGPURenderer({ canvas, device, antialias: true, alpha: true });
  await renderer.init();
  if (!renderer.backend.isWebGPUBackend || renderer.backend.device !== device) {
    renderer.dispose();
    throw new Error('The viewer requires the simulation’s WebGPU device.');
  }
  renderer.setClearColor(0x080e13, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(41, 1, 0.1, 600);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.minDistance = 2;
  controls.maxDistance = 120;
  controls.target.set(0, 0, 0);
  function recenter() {
    // Consume residual orbit/pan damping before restoring the pose.
    controls.enableDamping = false;
    controls.update();
    controls.enableDamping = true;
    const fit = Math.max(1, 1.20 / camera.aspect);
    camera.position.set(9 * fit, 16 * fit, 22 * fit);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  const grid = new THREE.Group();
  scene.add(grid);
  const segments = [];
  function segment(x1, z1, x2, z2) { segments.push(x1, -0.7, z1, x2, -0.7, z2); }
  for (const r of [5, 10, 15]) {
    for (let i = 0; i < 240; i++) {
      const a = i * Math.PI / 120;
      const b = (i + 1) * Math.PI / 120;
      segment(r * Math.cos(a), r * Math.sin(a), r * Math.cos(b), r * Math.sin(b));
    }
  }
  for (let i = 0; i < 72; i++) {
    const a = i * Math.PI / 36;
    const r = i % 6 === 0 ? 15.45 : 15.18;
    segment(15 * Math.cos(a), 15 * Math.sin(a), r * Math.cos(a), r * Math.sin(a));
  }
  segment(-16, 0, 16, 0);
  segment(0, -16, 0, 16);
  const gridGeometry = new THREE.BufferGeometry();
  gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3));
  const gridMaterial = new THREE.LineBasicMaterial({ color: 0x52686a, transparent: true, opacity: 0.23, depthWrite: false });
  const lines = new THREE.LineSegments(gridGeometry, gridMaterial);
  lines.renderOrder = -1;
  grid.add(lines);

  const focalPixels = uniform(1);
  const massScale = uniform(1);
  const pointBrightness = uniform(1);
  const bodyMass = attribute('bodyMass', 'float');
  const alive = bodyMass.greaterThan(0);
  const spritePosition = attribute('bodyPosition', 'vec3');
  const pointPosition = attribute('position', 'vec3');
  const starVariation = index => index.toFloat().mul(0.61803399).fract();

  function starTint(position, variation) {
    const radius = position.length().mul(0.1).add(variation.sub(0.5).mul(0.55));
    const inner = mix(vec3(1, 0.46, 0.18), vec3(0.93, 0.89, 0.70), radius.mul(1.4).clamp());
    return varying(mix(inner, vec3(0.32, 0.65, 0.89), radius.sub(0.50).mul(1.7).clamp()));
  }

  const variation = starVariation(instanceIndex);
  const eyeDepth = modelViewMatrix.mul(spritePosition).z.negate().max(0.1);
  const worldPerPixel = eyeDepth.div(focalPixels);
  const relativeRadius = bodyMass.max(0).mul(massScale).pow(1 / 3);
  const spread = relativeRadius.mul(0.17).min(0.9).add(0.10).mul(variation.mul(0.65).add(0.75))
    .clamp(worldPerPixel.mul(2), worldPerPixel.mul(65));

  const disc = uv().mul(2).sub(1);
  const r2 = disc.dot(disc);
  const core = r2.mul(-25).exp();
  const halo = r2.mul(-5).exp();
  const spriteMaterial = new THREE.SpriteNodeMaterial({
    depthWrite: false, transparent: true, blending: THREE.AdditiveBlending,
    positionNode: spritePosition,
    scaleNode: alive.select(spread, 0),
    colorNode: starTint(spritePosition, variation).add(vec3(core.mul(0.20))),
    opacityNode: core.mul(0.92).add(halo.mul(0.24)).mul(r2.lessThanEqual(1))
  });

  // Point primitives keep dense populations to one vertex and one pixel per slot.
  // Mass comes from the current simulation buffer, including zero in absorbed slots.
  const pointMaterial = new THREE.PointsNodeMaterial({
    depthWrite: false, transparent: true, blending: THREE.AdditiveBlending,
    alphaToCoverage: false, maskNode: alive,
    colorNode: starTint(pointPosition, starVariation(vertexIndex)),
    opacityNode: pointBrightness
  });
  let points;
  let bodyBuffer;
  function removePoints() {
    if (!points) return;
    scene.remove(points);
    points.geometry.dispose();
    // reset() can run again before Three has rendered this geometry once.
    bodyBuffer.destroy();
    points = undefined;
    bodyBuffer = undefined;
  }
  function update(source) {
    const encoder = device.createCommandEncoder({ label: 'Copy resident bodies to Three.js' });
    encoder.copyBufferToBuffer(source, 0, bodyBuffer, 0, bodyBuffer.size);
    device.queue.submit([encoder.finish()]);
  }
  function reset(bodies) {
    removePoints();
    const count = bodies.length / 8;
    const asPoints = count >= 65536;
    const geometry = asPoints ? new THREE.BufferGeometry()
      : new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(1, 1));
    if (!asPoints) geometry.instanceCount = count;
    bodyBuffer = createBodyVertexBuffer(renderer, bodies, geometry, asPoints);
    massScale.value = count / 180;
    pointBrightness.value = Math.max(0.05, Math.min(0.88, 65000 / count));
    points = asPoints ? new THREE.Points(geometry, pointMaterial) : new THREE.Mesh(geometry, spriteMaterial);
    points.frustumCulled = false;
    scene.add(points);
  }

  let height = 1;
  let lastScaleText = '';
  let lastScaleWidth = '';
  let lastLayoutKey = '';
  const embedded = document.documentElement.classList.contains('is-embedded');
  const viewportEl = embedded ? document.getElementById('viewport') : null;
  function resize() {
    const fullW = Math.max(1, canvas.clientWidth);
    const fullH = Math.max(1, canvas.clientHeight);
    let vx = 0, vy = 0, vw = fullW, vh = fullH;
    if (viewportEl) {
      const vp = viewportEl.getBoundingClientRect();
      vx = Math.max(0, Math.min(fullW - 1, Math.floor(vp.left)));
      vy = Math.max(0, Math.min(fullH - 1, Math.floor(vp.top)));
      vw = Math.max(1, Math.min(fullW - vx, Math.floor(vp.width)));
      vh = Math.max(1, Math.min(fullH - vy, Math.floor(vp.height)));
    }
    const dpr = Math.min(window.devicePixelRatio || 1, embedded ? 1.25 : 2);
    const key = `${fullW}x${fullH}:${vx},${vy},${vw}x${vh}@${dpr}`;
    if (key === lastLayoutKey) return;
    lastLayoutKey = key;
    height = vh;
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(dpr);
    renderer.setSize(fullW, fullH, false);
    if (viewportEl) {
      renderer.setViewport(vx, vy, vw, vh);
      renderer.setScissor(vx, vy, vw, vh);
      renderer.setScissorTest(true);
    } else {
      renderer.setScissorTest(false);
    }
    focalPixels.value = height * renderer.getPixelRatio() / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  if (viewportEl) observer.observe(viewportEl);
  resize();
  recenter();
  function render() {
    if (viewportEl) resize();
    controls.update();
    const pixels = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.distanceTo(controls.target));
    const choices = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
    const units = choices.find(n => n * pixels >= 39) ?? 100;
    const nextText = units + (units === 1 ? ' unit' : ' units');
    const nextWidth = Math.round(units * pixels) + 'px';
    if (nextText !== lastScaleText) {
      lastScaleText = nextText;
      scaleLabel.textContent = nextText;
    }
    if (nextWidth !== lastScaleWidth) {
      lastScaleWidth = nextWidth;
      scaleLabel.previousElementSibling.style.width = nextWidth;
    }
    renderer.render(scene, camera);
  }
  return { reset, clearBodies: removePoints, update, render, recenter, grid, dispose() {
    observer.disconnect(); controls.dispose(); gridGeometry.dispose(); gridMaterial.dispose();
    removePoints(); spriteMaterial.dispose(); pointMaterial.dispose(); renderer.dispose();
  } };
}

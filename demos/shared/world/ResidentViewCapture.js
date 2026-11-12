import * as THREE from 'three';

const unavailable = message => Object.assign(new Error(message), { code: 'ERR_WORLD_VISION_UNAVAILABLE' });
const finiteVector = value => Array.isArray(value) && value.length === 3
  && value.every(number => Number.isFinite(number) && Math.abs(number) <= 1_000_000);
const hasVideo = material => material && (Object.values(material).some(value => value?.isVideoTexture)
  || Object.values(material.uniforms ?? {}).some(value => value?.value?.isVideoTexture));

/** On-demand world pixels, independent of the player camera and DOM. This owns
 * one small target, not a renderer or an animation loop. Scene annotations and
 * video textures are omitted; a caller also supplies its private/self bodies. */
export class ResidentViewCapture {
  constructor({ renderer, scene, width = 256, height = 256, fov = 75, far = 250, now = Date.now } = {}) {
    if (!scene?.isScene || !renderer?.isWebGLRenderer || typeof renderer.readRenderTargetPixelsAsync !== 'function'
        || typeof now !== 'function') throw unavailable('This world renderer cannot capture resident vision');
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 16 || height < 16 || width > 512 || height > 512
        || !Number.isFinite(fov) || fov < 30 || fov > 120 || !Number.isFinite(far) || far < 1 || far > 1000) {
      throw new RangeError('Resident vision dimensions or viewing range are invalid');
    }
    Object.assign(this, { renderer, scene, width, height, now });
    this.camera = new THREE.PerspectiveCamera(fov, width / height, .1, far);
    this.target = new THREE.WebGLRenderTarget(width, height, { depthBuffer: true, stencilBuffer: false });
    this.target.texture.colorSpace = THREE.SRGBColorSpace;
    this.videoMaterial = new THREE.MeshBasicMaterial({ color: '#81919a', side: THREE.DoubleSide });
    this.closed = false; this.pending = false; this.released = false;
  }

  async capture({ pose, exclude = [], signal } = {}) {
    signal?.throwIfAborted();
    if (this.closed) throw unavailable('Resident vision capture is closed');
    if (this.renderer.getContext?.().isContextLost?.()) throw unavailable('Resident world rendering context was lost');
    if (this.pending) throw Object.assign(new Error('Another resident frame is being captured'), { code: 'ERR_WORLD_VISION_BUSY' });
    if (!finiteVector(pose?.position) || !finiteVector(pose?.direction)
        || Math.hypot(...pose.direction) < .000001 || !Array.isArray(exclude)
        || exclude.length > 512 || exclude.some(object => !object?.isObject3D)) throw new TypeError('Invalid resident camera pose or exclusions');
    const direction = new THREE.Vector3(...pose.direction).normalize();
    const capturedPose = { position: [...pose.position], direction: direction.toArray() };
    this.camera.position.fromArray(capturedPose.position);
    this.camera.up.set(0, Math.abs(direction.y) > .999 ? 0 : 1, Math.abs(direction.y) > .999 ? 1 : 0);
    this.camera.lookAt(this.camera.position.clone().add(direction)); this.camera.updateMatrixWorld();
    const observedAt = this.now();
    if (!Number.isSafeInteger(observedAt) || observedAt < 0) throw new TypeError('Invalid resident capture time');
    const { renderer, target, scene, width, height } = this;
    const previous = { target: renderer.getRenderTarget(), face: renderer.getActiveCubeFace(), mip: renderer.getActiveMipmapLevel(),
      viewport: renderer.getViewport(new THREE.Vector4()), scissor: renderer.getScissor(new THREE.Vector4()),
      scissorTest: renderer.getScissorTest(), xr: renderer.xr.enabled, autoClear: renderer.autoClear,
      shadows: renderer.shadowMap.autoUpdate, shadowUpdate: renderer.shadowMap.needsUpdate };
    const visibility = new Map(), materials = new Map(), pixels = new Uint8Array(width * height * 4);
    const hide = object => { if (!visibility.has(object)) visibility.set(object, object.visible); object.visible = false; };
    this.pending = true;
    try {
      // Never await while scene or renderer state belongs to this capture.
      try {
        for (const object of exclude) hide(object);
        scene.traverse(object => {
          if (object.isSprite) hide(object); // Names and speech bubbles are scene objects, not DOM.
          if (!object.material) return;
          const list = Array.isArray(object.material) ? object.material : [object.material];
          if (list.some(hasVideo)) {
            materials.set(object, object.material);
            object.material = Array.isArray(object.material)
              ? list.map(material => hasVideo(material) ? this.videoMaterial : material) : this.videoMaterial;
          }
        });
        renderer.xr.enabled = false; renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = false; renderer.autoClear = false;
        renderer.setRenderTarget(target); renderer.setViewport(0, 0, width, height); renderer.setScissorTest(false);
        renderer.clear(true, true, true); renderer.render(scene, this.camera);
      } finally {
        for (const [object, material] of materials) object.material = material;
        for (const [object, visible] of visibility) object.visible = visible;
        renderer.xr.enabled = previous.xr; renderer.shadowMap.autoUpdate = previous.shadows;
        renderer.shadowMap.needsUpdate = previous.shadowUpdate; renderer.autoClear = previous.autoClear;
        renderer.setRenderTarget(previous.target, previous.face, previous.mip);
        renderer.setViewport(previous.viewport); renderer.setScissor(previous.scissor); renderer.setScissorTest(previous.scissorTest);
      }
      await renderer.readRenderTargetPixelsAsync(target, 0, 0, width, height, pixels);
      signal?.throwIfAborted();
      if (this.closed) throw unavailable('Resident vision capture was closed');
      if (renderer.getContext?.().isContextLost?.()) throw unavailable('Resident world rendering context was lost');
      // WebGL starts at the bottom; model RGBA inputs start at the top.
      const data = new Uint8Array(pixels.length), stride = width * 4;
      for (let row = 0; row < height; row++) data.set(pixels.subarray(row * stride, (row + 1) * stride), (height - row - 1) * stride);
      return { pixels: { data, width, height, channels: 4 }, observedAt, pose: capturedPose };
    } finally {
      this.pending = false;
      if (this.closed) this.release();
    }
  }

  release() {
    if (this.released) return;
    this.target.dispose(); this.videoMaterial.dispose(); this.released = true;
  }
  dispose() { this.closed = true; if (!this.pending) this.release(); }
}

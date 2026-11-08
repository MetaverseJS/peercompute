import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export const MOTORCYCLE_MODEL_ASSET_BASE_URL = './models/akira-bike/';
export const MOTORCYCLE_MODEL_MANIFEST_SCHEMA = 'peercompute.motorcycle.model-asset.v1';
export const MOTORCYCLE_MODEL_TELEMETRY_SCHEMA = 'peercompute.motorcycle.model-resource.telemetry.v1';
export const MOTORCYCLE_MODEL_INSTANCE_TELEMETRY_SCHEMA = 'peercompute.motorcycle.model-instance.telemetry.v1';

export const MOTORCYCLE_MODEL_LOAD_LIMITS = Object.freeze({
  maximumManifestBytes: 65_536,
  maximumModelBytes: 8_000_000,
  maximumTriangles: 60_000,
  maximumMeshPrimitives: 16,
  maximumDrawCalls: 16,
  maximumMaterials: 16,
  maximumTextures: 24,
  maximumTextureDimension: 1_024,
});

const REQUIRED_OUTPUT_EXTENSIONS = Object.freeze([
  'EXT_meshopt_compression',
  'KHR_mesh_quantization',
  'KHR_texture_basisu',
]);

function clonePlain(value) {
  if (value === null || value === undefined || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(clonePlain);
  const output = {};
  for (const [key, child] of Object.entries(value)) output[key] = clonePlain(child);
  return output;
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function frozenClone(value) {
  return deepFreeze(clonePlain(value));
}

function positiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`${label} must be a positive safe integer.`);
  }
  return value;
}

function nonNegativeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${label} must be a non-negative safe integer.`);
  }
  return value;
}

function finiteNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number.`);
  }
  return value;
}

function finiteVector(value, size, label) {
  if (!Array.isArray(value) || value.length !== size) {
    throw new TypeError(`${label} must contain exactly ${size} components.`);
  }
  return value.map((component, index) => finiteNumber(component, `${label}[${index}]`));
}

function safeRelativePath(value, label, { directory = false } = {}) {
  if (typeof value !== 'string' || value.length === 0 || value.includes('\\')) {
    throw new TypeError(`${label} must be a non-empty forward-slash relative path.`);
  }
  if (value.startsWith('/') || /^[a-z][a-z\d+.-]*:/i.test(value)) {
    throw new TypeError(`${label} must not be absolute or contain a URL scheme.`);
  }
  const segments = value.split('/');
  if (segments.some((segment, index) => segment === '..'
    || segment === '.'
    || (!directory && segment.length === 0)
    || (directory && segment.length === 0 && index !== segments.length - 1))) {
    throw new TypeError(`${label} must not traverse or contain empty path segments.`);
  }
  if (directory && !value.endsWith('/')) {
    throw new TypeError(`${label} must end with a slash.`);
  }
  return value;
}

function boundedCount(value, label, maximum) {
  const count = nonNegativeInteger(value, label);
  if (count > maximum) throw new RangeError(`${label} exceeds the runtime cap of ${maximum}.`);
  return count;
}

function sha256Digest(value, label) {
  if (typeof value !== 'string' || !/^[a-f\d]{64}$/.test(value)) {
    throw new TypeError(`${label} requires a lowercase SHA-256 digest.`);
  }
  return value;
}

function normalizedLimits(overrides = {}) {
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    throw new TypeError('Motorcycle model load limits must be an object.');
  }
  const limits = {};
  for (const [key, fallback] of Object.entries(MOTORCYCLE_MODEL_LOAD_LIMITS)) {
    limits[key] = positiveInteger(overrides[key] ?? fallback, `limits.${key}`);
  }
  return Object.freeze(limits);
}

function validateRuntimeBounds(runtimeBounds, limits) {
  if (!runtimeBounds || typeof runtimeBounds !== 'object') {
    throw new TypeError('Motorcycle model manifest requires runtimeBounds.');
  }
  for (const key of Object.keys(MOTORCYCLE_MODEL_LOAD_LIMITS)) {
    const declared = positiveInteger(runtimeBounds[key], `manifest.runtimeBounds.${key}`);
    if (declared > limits[key]) {
      throw new RangeError(`manifest.runtimeBounds.${key} exceeds the loader cap of ${limits[key]}.`);
    }
  }
}

export function validateMotorcycleModelManifest(candidate, { limits: overrides } = {}) {
  const limits = normalizedLimits(overrides);
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new TypeError('Motorcycle model manifest must be an object.');
  }
  const manifest = clonePlain(candidate);
  if (manifest.schemaVersion !== MOTORCYCLE_MODEL_MANIFEST_SCHEMA) {
    throw new TypeError(`Unsupported motorcycle model manifest schema: ${manifest.schemaVersion ?? 'missing'}.`);
  }
  if (typeof manifest.id !== 'string' || manifest.id.length === 0) {
    throw new TypeError('Motorcycle model manifest requires an id.');
  }
  if (manifest.license?.spdx !== 'CC-BY-4.0'
      || manifest.license?.localRecord !== 'LICENSE.txt'
      || manifest.license?.changesDisclosedIn !== 'ATTRIBUTION.md') {
    throw new TypeError('Motorcycle model manifest must retain its CC-BY-4.0 attribution records.');
  }
  if (manifest.physicsAuthority !== 'six-body-particle-rigid' || manifest.collisionAuthority !== false) {
    throw new TypeError('Motorcycle model presentation data must not claim physics or collision authority.');
  }
  validateRuntimeBounds(manifest.runtimeBounds, limits);
  if (manifest.source?.archive?.distributedWithRuntime !== false) {
    throw new TypeError('The authenticated source archive must not be a runtime dependency.');
  }
  positiveInteger(manifest.source?.archive?.bytes, 'manifest.source.archive.bytes');
  positiveInteger(manifest.source?.scene?.bytes, 'manifest.source.scene.bytes');
  positiveInteger(manifest.source?.binary?.bytes, 'manifest.source.binary.bytes');
  sha256Digest(manifest.source?.archive?.sha256, 'manifest.source.archive.sha256');
  sha256Digest(manifest.source?.scene?.sha256, 'manifest.source.scene.sha256');
  sha256Digest(manifest.source?.binary?.sha256, 'manifest.source.binary.sha256');
  sha256Digest(manifest.source?.licenseRecordSha256, 'manifest.source.licenseRecordSha256');

  const output = manifest.output;
  if (!output || typeof output !== 'object') throw new TypeError('Motorcycle model manifest requires output metadata.');
  safeRelativePath(output.file, 'manifest.output.file');
  if (output.mimeType !== 'model/gltf-binary') throw new TypeError('Motorcycle model output must be a binary glTF.');
  positiveInteger(output.bytes, 'manifest.output.bytes');
  if (output.bytes > limits.maximumModelBytes || output.bytes > manifest.runtimeBounds.maximumModelBytes) {
    throw new RangeError('Motorcycle model output exceeds its byte cap.');
  }
  sha256Digest(output.sha256, 'manifest.output.sha256');
  boundedCount(output.triangleCount, 'manifest.output.triangleCount', Math.min(
    limits.maximumTriangles,
    manifest.runtimeBounds.maximumTriangles,
  ));
  boundedCount(output.meshPrimitiveCount, 'manifest.output.meshPrimitiveCount', Math.min(
    limits.maximumMeshPrimitives,
    manifest.runtimeBounds.maximumMeshPrimitives,
  ));
  boundedCount(output.drawCallUpperBound, 'manifest.output.drawCallUpperBound', Math.min(
    limits.maximumDrawCalls,
    manifest.runtimeBounds.maximumDrawCalls,
  ));
  boundedCount(output.materialCount, 'manifest.output.materialCount', Math.min(
    limits.maximumMaterials,
    manifest.runtimeBounds.maximumMaterials,
  ));
  boundedCount(output.textureCount, 'manifest.output.textureCount', Math.min(
    limits.maximumTextures,
    manifest.runtimeBounds.maximumTextures,
  ));
  boundedCount(output.maximumTextureDimension, 'manifest.output.maximumTextureDimension', Math.min(
    limits.maximumTextureDimension,
    manifest.runtimeBounds.maximumTextureDimension,
  ));
  nonNegativeInteger(output.compressedTexturePayloadBytes, 'manifest.output.compressedTexturePayloadBytes');
  nonNegativeInteger(output.estimatedMinimumGpuTextureBytes, 'manifest.output.estimatedMinimumGpuTextureBytes');
  if (output.compressedTexturePayloadBytes > output.bytes) {
    throw new RangeError('Compressed texture payload cannot exceed the model byte length.');
  }
  const sourceMinimum = finiteVector(
    output.sourceSpaceBounds?.minimum,
    3,
    'manifest.output.sourceSpaceBounds.minimum',
  );
  const sourceMaximum = finiteVector(
    output.sourceSpaceBounds?.maximum,
    3,
    'manifest.output.sourceSpaceBounds.maximum',
  );
  if (sourceMaximum.some((value, index) => value < sourceMinimum[index])) {
    throw new RangeError('Motorcycle model source-space bounds must be ordered.');
  }
  if (!Array.isArray(output.requiredExtensions)
      || REQUIRED_OUTPUT_EXTENSIONS.some((extension) => !output.requiredExtensions.includes(extension))) {
    throw new TypeError('Motorcycle model output is missing a required local decoder extension.');
  }

  const calibration = manifest.calibration;
  if (!calibration || typeof calibration !== 'object') {
    throw new TypeError('Motorcycle model manifest requires calibration metadata.');
  }
  finiteVector(calibration.rotationEulerRadiansXYZ, 3, 'manifest.calibration.rotationEulerRadiansXYZ');
  finiteVector(calibration.translationMeters, 3, 'manifest.calibration.translationMeters');
  finiteVector(
    calibration.presentationGroundingOffsetMeters,
    3,
    'manifest.calibration.presentationGroundingOffsetMeters',
  );
  const targetWheelMidpoint = finiteVector(
    calibration.targetWheelMidpointMeters,
    3,
    'manifest.calibration.targetWheelMidpointMeters',
  );
  const uniformScale = finiteNumber(calibration.uniformScale, 'manifest.calibration.uniformScale');
  if (uniformScale <= 0) {
    throw new RangeError('Motorcycle model calibration scale must be positive.');
  }
  if (finiteNumber(calibration.targetWheelbaseMeters, 'manifest.calibration.targetWheelbaseMeters') <= 0) {
    throw new RangeError('Motorcycle model target wheelbase must be positive.');
  }
  const physicsRollingRadius = finiteNumber(
    calibration.physicsRollingRadiusMeters,
    'manifest.calibration.physicsRollingRadiusMeters',
  );
  if (physicsRollingRadius <= 0) {
    throw new RangeError('Motorcycle model physics rolling radius must be positive.');
  }
  const physicsTireBottom = finiteNumber(
    calibration.physicsTireBottomMidpointMeters,
    'manifest.calibration.physicsTireBottomMidpointMeters',
  );
  const groundingOffset = calibration.presentationGroundingOffsetMeters;
  const calibratedMinimumY = sourceMinimum[1] * uniformScale
    + calibration.translationMeters[1]
    + groundingOffset[1];
  if (Math.abs(calibratedMinimumY - physicsTireBottom) > 1e-6) {
    throw new RangeError('Motorcycle model grounding offset must align its minimum Y with the physics tire bottom.');
  }
  if (Math.abs(targetWheelMidpoint[1] - physicsRollingRadius - physicsTireBottom) > 1e-9) {
    throw new RangeError('Motorcycle model physics tire bottom must match wheel midpoint minus rolling radius.');
  }

  const dependencies = manifest.runtimeDependencies;
  if (dependencies?.networkRequired !== false) {
    throw new TypeError('Motorcycle model runtime dependencies must be local.');
  }
  safeRelativePath(dependencies?.basisTranscoder?.path, 'manifest.runtimeDependencies.basisTranscoder.path', {
    directory: true,
  });
  for (const [name, dependency] of Object.entries({
    javascript: dependencies?.basisTranscoder?.javascript,
    wasm: dependencies?.basisTranscoder?.wasm,
  })) {
    safeRelativePath(dependency?.file, `manifest.runtimeDependencies.basisTranscoder.${name}.file`);
    positiveInteger(dependency?.bytes, `manifest.runtimeDependencies.basisTranscoder.${name}.bytes`);
    sha256Digest(dependency?.sha256, `manifest.runtimeDependencies.basisTranscoder.${name}.sha256`);
  }
  if (!Array.isArray(manifest.limitations) || manifest.limitations.length === 0) {
    throw new TypeError('Motorcycle model manifest must disclose presentation limitations.');
  }
  return frozenClone(manifest);
}

function normalizeAssetBaseUrl(value) {
  const base = String(value ?? MOTORCYCLE_MODEL_ASSET_BASE_URL);
  if (base.length === 0) throw new TypeError('Motorcycle model assetBaseUrl must not be empty.');
  return base.endsWith('/') ? base : `${base}/`;
}

function assetUrl(base, relativePath) {
  return `${base}${safeRelativePath(relativePath, 'Motorcycle model asset path')}`;
}

function contentLength(response) {
  const raw = response?.headers?.get?.('content-length');
  if (raw === null || raw === undefined || raw === '') return null;
  const length = Number(raw);
  if (!Number.isSafeInteger(length) || length < 0) throw new TypeError('Invalid Content-Length for motorcycle model asset.');
  return length;
}

async function fetchBoundedText(fetchImpl, url, maximumBytes, signal) {
  // The manifest and GLB use stable public paths. Revalidate them so a client
  // which visited an older release cannot combine stale calibration/model
  // bytes with a freshly deployed JavaScript validator. Conditional requests
  // still avoid transferring an unchanged 7.5 MB GLB.
  const response = await fetchImpl(url, { cache: 'no-cache', credentials: 'same-origin', signal });
  if (!response?.ok) throw new Error(`Motorcycle model manifest request failed (${response?.status ?? 'network'}).`);
  const declared = contentLength(response);
  if (declared !== null && declared > maximumBytes) throw new RangeError('Motorcycle model manifest exceeds its byte cap.');
  const text = await response.text();
  const bytes = new TextEncoder().encode(text).byteLength;
  if (bytes > maximumBytes) throw new RangeError('Motorcycle model manifest exceeds its byte cap.');
  return { text, bytes };
}

async function fetchBoundedBuffer(fetchImpl, url, expectedBytes, maximumBytes, signal) {
  const response = await fetchImpl(url, { cache: 'no-cache', credentials: 'same-origin', signal });
  if (!response?.ok) throw new Error(`Motorcycle model request failed (${response?.status ?? 'network'}).`);
  const declared = contentLength(response);
  if (declared !== null && declared > maximumBytes) throw new RangeError('Motorcycle model exceeds its byte cap.');
  if (declared !== null && declared !== expectedBytes) throw new Error('Motorcycle model Content-Length does not match its manifest.');
  const buffer = await response.arrayBuffer();
  if (!(buffer instanceof ArrayBuffer)) throw new TypeError('Motorcycle model response did not contain an ArrayBuffer.');
  if (buffer.byteLength > maximumBytes) throw new RangeError('Motorcycle model exceeds its byte cap.');
  if (buffer.byteLength !== expectedBytes) throw new Error('Motorcycle model byte length does not match its manifest.');
  return buffer;
}

async function sha256Hex(buffer, cryptoProvider) {
  if (!cryptoProvider?.subtle?.digest) {
    throw new Error('Web Crypto SHA-256 support is required to verify the motorcycle model.');
  }
  const digest = await cryptoProvider.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function createThreeLoaderStack({ renderer, transcoderPath, workerLimit, loadingManager }) {
  if (!renderer) throw new TypeError('A renderer is required to select KTX2 transcode support.');
  const ktx2Loader = new KTX2Loader(loadingManager);
  ktx2Loader.setTranscoderPath(transcoderPath);
  ktx2Loader.setWorkerLimit(workerLimit);
  ktx2Loader.detectSupport(renderer);
  const gltfLoader = new GLTFLoader(loadingManager);
  gltfLoader.setKTX2Loader(ktx2Loader);
  gltfLoader.setMeshoptDecoder(MeshoptDecoder);
  let disposed = false;
  return Object.freeze({
    parseAsync(buffer, baseUrl) {
      if (disposed) throw new Error('Cannot parse with a disposed motorcycle model loader.');
      return gltfLoader.parseAsync(buffer, baseUrl);
    },
    dispose() {
      if (disposed) return false;
      ktx2Loader.dispose();
      disposed = true;
      return true;
    },
  });
}

function collectDisposableResources(root) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  root?.traverse?.((object) => {
    if (object.geometry?.dispose) geometries.add(object.geometry);
    const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of sourceMaterials) {
      if (!material?.dispose) continue;
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value?.isTexture && value.dispose) textures.add(value);
      }
      for (const uniform of Object.values(material.uniforms ?? {})) {
        if (uniform?.value?.isTexture && uniform.value.dispose) textures.add(uniform.value);
      }
    }
  });
  return { geometries, materials, textures };
}

function applySinglePassMaterialPolicy(root) {
  const { materials } = collectDisposableResources(root);
  let transmissionDisabledMaterialCount = 0;
  let transparentMaterialCount = 0;
  let depthWriteDisabledMaterialCount = 0;
  let forceSinglePassMaterialCount = 0;
  for (const material of materials) {
    const transmission = Number(material.transmission ?? 0);
    if (Number.isFinite(transmission) && transmission > 0) {
      material.transmission = 0;
      material.transparent = true;
      material.depthWrite = false;
      transmissionDisabledMaterialCount += 1;
    }
    if (material.transparent === true) {
      material.forceSinglePass = true;
      material.needsUpdate = true;
      transparentMaterialCount += 1;
      forceSinglePassMaterialCount += 1;
    }
    if (material.depthWrite === false) depthWriteDisabledMaterialCount += 1;
  }
  return Object.freeze({
    schemaVersion: 'peercompute.motorcycle.model-material-policy.v1',
    renderingModel: 'single-pass-alpha-transparency',
    materialCount: materials.size,
    transmissionDisabledMaterialCount,
    transparentMaterialCount,
    depthWriteDisabledMaterialCount,
    forceSinglePassMaterialCount,
    twoPassTransparentMaterialCount: 0,
    maximumRuntimeTransparentPasses: 1,
    maximumRuntimeTransmission: 0,
    transmissionPrepass: false,
  });
}

export function disposeMotorcycleModelAssets(root) {
  const { geometries, materials, textures } = collectDisposableResources(root);
  for (const texture of textures) texture.dispose();
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
  return Object.freeze({
    geometries: geometries.size,
    materials: materials.size,
    textures: textures.size,
  });
}

function configurePresentationRoot(THREE, gltf, manifest) {
  if (typeof THREE?.Group !== 'function') throw new TypeError('Motorcycle model resource requires THREE.Group.');
  if (!gltf?.scene?.isObject3D) throw new TypeError('Motorcycle model GLB did not contain a Three.js scene.');
  if ((gltf.animations?.length ?? 0) !== manifest.output.animationCount) {
    throw new Error('Motorcycle model animation count does not match its manifest.');
  }
  const root = new THREE.Group();
  root.name = 'motorcycle-akira-presentation-root';
  root.userData = {
    kind: 'motorcycle-presentation-model',
    assetId: manifest.id,
    physicsAuthority: manifest.physicsAuthority,
    collisionAuthority: false,
    targetWheelbaseMeters: manifest.calibration.targetWheelbaseMeters,
    presentationGroundingOffsetMeters: clonePlain(
      manifest.calibration.presentationGroundingOffsetMeters,
    ),
    runtimeAxes: clonePlain(manifest.calibration.runtimeAxes),
  };
  const source = gltf.scene;
  source.name = 'motorcycle-akira-calibrated-source';
  source.position.fromArray(manifest.calibration.translationMeters);
  const groundingOffset = manifest.calibration.presentationGroundingOffsetMeters ?? [0, 0, 0];
  source.position.x += groundingOffset[0];
  source.position.y += groundingOffset[1];
  source.position.z += groundingOffset[2];
  source.rotation.fromArray(manifest.calibration.rotationEulerRadiansXYZ);
  source.scale.setScalar(manifest.calibration.uniformScale);
  source.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = false;
  });
  root.add(source);
  root.updateMatrixWorld(true);
  return root;
}

export function createMotorcycleModelResource({
  THREE,
  renderer,
  assetBaseUrl = MOTORCYCLE_MODEL_ASSET_BASE_URL,
  fetchImpl = globalThis.fetch?.bind(globalThis),
  cryptoProvider = globalThis.crypto,
  limits: limitOverrides,
  workerLimit = 2,
  loadingManager,
  loaderFactory = createThreeLoaderStack,
} = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('Motorcycle model resource requires fetch.');
  if (typeof loaderFactory !== 'function') throw new TypeError('Motorcycle model resource requires a loaderFactory.');
  if (!Number.isSafeInteger(workerLimit) || workerLimit < 1 || workerLimit > 4) {
    throw new RangeError('Motorcycle model KTX2 workerLimit must be between 1 and 4.');
  }
  const limits = normalizedLimits(limitOverrides);
  const baseUrl = normalizeAssetBaseUrl(assetBaseUrl);
  const manifestUrl = assetUrl(baseUrl, 'manifest.json');
  const abortController = new AbortController();
  const handles = new Map();
  let nextHandleId = 1;
  let status = 'idle';
  let disposed = false;
  let manifest = null;
  let manifestBytes = 0;
  let modelUrl = null;
  let modelBytes = 0;
  let masterRoot = null;
  let loaderStack = null;
  let loadPromise = null;
  let loadAttempts = 0;
  let successfulLoads = 0;
  let failedLoads = 0;
  let reusedLoads = 0;
  let handlesCreated = 0;
  let handlesReleased = 0;
  let verification = null;
  let resourceCounts = null;
  let materialPolicy = null;
  let disposal = null;
  let lastError = null;

  const telemetry = () => frozenClone({
    schemaVersion: MOTORCYCLE_MODEL_TELEMETRY_SCHEMA,
    status,
    disposed,
    assetBaseUrl: baseUrl,
    manifestUrl,
    modelUrl,
    loadAttempts,
    successfulLoads,
    failedLoads,
    reusedLoads,
    handlesCreated,
    handlesReleased,
    activeHandles: handles.size,
    manifestBytes,
    modelBytes,
    verification,
    model: manifest ? {
      id: manifest.id,
      title: manifest.title,
      author: clonePlain(manifest.author),
      license: manifest.license.spdx,
      triangleCount: manifest.output.triangleCount,
      meshPrimitiveCount: manifest.output.meshPrimitiveCount,
      drawCallUpperBound: manifest.output.drawCallUpperBound,
      materialCount: manifest.output.materialCount,
      textureCount: manifest.output.textureCount,
      maximumTextureDimension: manifest.output.maximumTextureDimension,
      compressedTexturePayloadBytes: manifest.output.compressedTexturePayloadBytes,
      estimatedMinimumGpuTextureBytes: manifest.output.estimatedMinimumGpuTextureBytes,
      gpuTextureEstimateMethod: manifest.output.gpuTextureEstimateMethod,
      physicsAuthority: manifest.physicsAuthority,
      collisionAuthority: manifest.collisionAuthority,
      limitations: clonePlain(manifest.limitations),
    } : null,
    calibration: manifest ? clonePlain(manifest.calibration) : null,
    resourceCounts,
    materialPolicy,
    limits,
    decoder: {
      meshopt: 'three/addons/libs/meshopt_decoder.module.js',
      ktx2: 'local Basis Universal transcoder',
      workerLimit,
      networkRequired: false,
    },
    disposal,
    lastError,
  });

  const ensureLoaded = async () => {
    if (disposed) throw new Error('Cannot load a disposed motorcycle model resource.');
    if (masterRoot) {
      reusedLoads += 1;
      return masterRoot;
    }
    if (loadPromise) {
      reusedLoads += 1;
      return loadPromise;
    }
    loadAttempts += 1;
    lastError = null;
    loadPromise = (async () => {
      try {
        status = 'loading-manifest';
        const manifestResponse = await fetchBoundedText(
          fetchImpl,
          manifestUrl,
          limits.maximumManifestBytes,
          abortController.signal,
        );
        manifestBytes = manifestResponse.bytes;
        let parsedManifest;
        try {
          parsedManifest = JSON.parse(manifestResponse.text);
        } catch (error) {
          throw new SyntaxError(`Invalid motorcycle model manifest JSON: ${error.message}`);
        }
        manifest = validateMotorcycleModelManifest(parsedManifest, { limits });
        if (manifestBytes > manifest.runtimeBounds.maximumManifestBytes) {
          throw new RangeError('Motorcycle model manifest exceeds its declared byte cap.');
        }
        modelUrl = assetUrl(baseUrl, manifest.output.file);
        status = 'loading-model';
        const buffer = await fetchBoundedBuffer(
          fetchImpl,
          modelUrl,
          manifest.output.bytes,
          limits.maximumModelBytes,
          abortController.signal,
        );
        modelBytes = buffer.byteLength;
        const digest = await sha256Hex(buffer, cryptoProvider);
        if (digest !== manifest.output.sha256) {
          throw new Error('Motorcycle model SHA-256 does not match its manifest.');
        }
        verification = {
          manifest: true,
          byteLength: true,
          sha256: true,
          digest,
        };
        const transcoderPath = `${baseUrl}${manifest.runtimeDependencies.basisTranscoder.path}`;
        loaderStack = loaderFactory({
          renderer,
          transcoderPath,
          workerLimit,
          loadingManager,
        });
        if (!loaderStack || typeof loaderStack.parseAsync !== 'function' || typeof loaderStack.dispose !== 'function') {
          throw new TypeError('Motorcycle model loaderFactory returned an invalid loader stack.');
        }
        const gltf = await loaderStack.parseAsync(buffer, baseUrl);
        if (disposed) {
          disposeMotorcycleModelAssets(gltf?.scene);
          throw new Error('Motorcycle model resource was disposed while loading.');
        }
        masterRoot = configurePresentationRoot(THREE, gltf, manifest);
        materialPolicy = applySinglePassMaterialPolicy(masterRoot);
        const collected = collectDisposableResources(masterRoot);
        resourceCounts = {
          geometries: collected.geometries.size,
          materials: collected.materials.size,
          textures: collected.textures.size,
        };
        successfulLoads += 1;
        status = 'ready';
        return masterRoot;
      } catch (error) {
        failedLoads += 1;
        lastError = error instanceof Error ? error.message : String(error);
        if (!masterRoot) {
          loaderStack?.dispose?.();
          loaderStack = null;
        }
        if (!disposed) status = 'error';
        throw error;
      } finally {
        if (!masterRoot) loadPromise = null;
      }
    })();
    return loadPromise;
  };

  const createInstance = async ({ visible = true } = {}) => {
    const sourceRoot = await ensureLoaded();
    if (disposed) throw new Error('Cannot create an instance from a disposed motorcycle model resource.');
    const root = sourceRoot.clone(true);
    const id = `motorcycle-model-${nextHandleId}`;
    nextHandleId += 1;
    root.name = id;
    root.visible = Boolean(visible);
    root.userData = {
      ...root.userData,
      resourceHandleId: id,
      sharedResourceOwner: true,
    };
    let released = false;
    const release = () => {
      if (released) return false;
      if (root.parent) root.parent.remove(root);
      root.clear();
      handles.delete(id);
      handlesReleased += 1;
      released = true;
      return true;
    };
    const instanceTelemetry = () => frozenClone({
      schemaVersion: MOTORCYCLE_MODEL_INSTANCE_TELEMETRY_SCHEMA,
      id,
      released,
      attached: Boolean(root.parent),
      visible: root.visible,
      assetId: manifest.id,
      physicsAuthority: manifest.physicsAuthority,
      collisionAuthority: false,
      sharedResources: true,
      targetWheelbaseMeters: manifest.calibration.targetWheelbaseMeters,
    });
    const handle = Object.freeze({
      id,
      root,
      getTelemetry: instanceTelemetry,
      release,
      dispose: release,
    });
    handles.set(id, handle);
    handlesCreated += 1;
    return handle;
  };

  const dispose = () => {
    if (disposed) return false;
    disposed = true;
    status = 'disposed';
    abortController.abort();
    for (const handle of [...handles.values()]) handle.release();
    disposal = masterRoot ? disposeMotorcycleModelAssets(masterRoot) : {
      geometries: 0,
      materials: 0,
      textures: 0,
    };
    masterRoot?.clear?.();
    masterRoot = null;
    loaderStack?.dispose?.();
    loaderStack = null;
    return true;
  };

  return Object.freeze({
    preload: async () => {
      await ensureLoaded();
      return telemetry();
    },
    createInstance,
    acquire: createInstance,
    getManifest: () => (manifest ? frozenClone(manifest) : null),
    getTelemetry: telemetry,
    getStatus: telemetry,
    dispose,
  });
}

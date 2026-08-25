import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import * as THREE from 'three';
import {
  MOTORCYCLE_MODEL_ASSET_BASE_URL,
  MOTORCYCLE_MODEL_INSTANCE_TELEMETRY_SCHEMA,
  MOTORCYCLE_MODEL_MANIFEST_SCHEMA,
  MOTORCYCLE_MODEL_TELEMETRY_SCHEMA,
  createMotorcycleModelResource,
  validateMotorcycleModelManifest,
} from '../src/render/motorcycleModel.js';

const ASSET_URL = new URL('../public/models/akira-bike/', import.meta.url);
const MANIFEST_URL = new URL('manifest.json', ASSET_URL);
const MODEL_URL = new URL('model.glb', ASSET_URL);
const LICENSE_URL = new URL('LICENSE.txt', ASSET_URL);
const ATTRIBUTION_URL = new URL('ATTRIBUTION.md', ASSET_URL);
const BASIS_JAVASCRIPT_URL = new URL('basis/basis_transcoder.js', ASSET_URL);
const BASIS_WASM_URL = new URL('basis/basis_transcoder.wasm', ASSET_URL);
const BASIS_LICENSE_URL = new URL('basis/APACHE-2.0.txt', ASSET_URL);
const LOADER_SOURCE_URL = new URL('../src/render/motorcycleModel.js', import.meta.url);

function digestHex(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function approximatelyEqual(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
}

async function readManifest() {
  return JSON.parse(await readFile(MANIFEST_URL, 'utf8'));
}

function parseGlb(buffer) {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  assert.equal(buffer.subarray(0, 4).toString('ascii'), 'glTF');
  assert.equal(view.getUint32(4, true), 2);
  assert.equal(view.getUint32(8, true), buffer.byteLength);
  let offset = 12;
  let json = null;
  let binary = null;
  while (offset < buffer.byteLength) {
    const byteLength = view.getUint32(offset, true);
    const type = view.getUint32(offset + 4, true);
    const chunk = buffer.subarray(offset + 8, offset + 8 + byteLength);
    if (type === 0x4e4f534a) json = JSON.parse(chunk.toString('utf8').trimEnd());
    if (type === 0x004e4942) binary = chunk;
    offset += 8 + byteLength;
  }
  assert.ok(json, 'GLB must contain a JSON chunk.');
  assert.ok(binary, 'GLB must contain a binary chunk.');
  return { json, binary };
}

function runtimePoint(sourcePoint, calibration) {
  const scale = calibration.uniformScale;
  const [tx, ty, tz] = calibration.translationMeters;
  return [
    sourcePoint[2] * scale + tx,
    sourcePoint[1] * scale + ty,
    -sourcePoint[0] * scale + tz,
  ];
}

test('optimized Akira asset retains exact provenance, attribution, and bounded manifest metadata', async () => {
  const [manifest, model, license, attribution, basisJavascript, basisWasm, basisLicense] = await Promise.all([
    readManifest(),
    readFile(MODEL_URL),
    readFile(LICENSE_URL),
    readFile(ATTRIBUTION_URL, 'utf8'),
    readFile(BASIS_JAVASCRIPT_URL),
    readFile(BASIS_WASM_URL),
    readFile(BASIS_LICENSE_URL, 'utf8'),
  ]);

  assert.equal(manifest.schemaVersion, MOTORCYCLE_MODEL_MANIFEST_SCHEMA);
  assert.equal(manifest.source.archive.originalDownloadName, 'akira_bike.zip');
  assert.equal(manifest.source.archive.distributedWithRuntime, false);
  assert.equal('repositoryPath' in manifest.source.archive, false);
  assert.equal(manifest.source.archive.sha256, 'b39ed00351d94c1b4ac697df76d57616bb7823d3fe258044da6a77cf6f3971fa');
  assert.equal(manifest.output.bytes, model.byteLength);
  assert.equal(manifest.output.sha256, digestHex(model));
  assert.equal(manifest.source.licenseRecordSha256, digestHex(license));
  assert.equal(manifest.license.spdx, 'CC-BY-4.0');
  assert.equal(manifest.physicsAuthority, 'six-body-particle-rigid');
  assert.equal(manifest.collisionAuthority, false);
  assert.equal(manifest.output.triangleCount <= manifest.runtimeBounds.maximumTriangles, true);
  assert.equal(manifest.output.materialCount <= manifest.runtimeBounds.maximumMaterials, true);
  assert.equal(manifest.output.textureCount <= manifest.runtimeBounds.maximumTextures, true);
  assert.equal(manifest.output.maximumTextureDimension <= manifest.runtimeBounds.maximumTextureDimension, true);
  assert.equal(manifest.output.bytes <= manifest.runtimeBounds.maximumModelBytes, true);
  assert.equal(manifest.output.compressedTexturePayloadBytes, 6_934_070);
  assert.equal(manifest.output.estimatedMinimumGpuTextureBytes, 23_243_753);
  assert.equal(manifest.runtimeDependencies.networkRequired, false);
  assert.equal(manifest.runtimeDependencies.basisTranscoder.javascript.bytes, basisJavascript.byteLength);
  assert.equal(manifest.runtimeDependencies.basisTranscoder.javascript.sha256, digestHex(basisJavascript));
  assert.equal(manifest.runtimeDependencies.basisTranscoder.wasm.bytes, basisWasm.byteLength);
  assert.equal(manifest.runtimeDependencies.basisTranscoder.wasm.sha256, digestHex(basisWasm));
  assert.match(license.toString('utf8'), /This work is based on "Akira Bike"/);
  assert.match(license.toString('utf8'), /Ryanwill679/);
  assert.match(license.toString('utf8'), /CC-BY-4\.0/);
  assert.match(attribution, /licensed under \[CC BY 4\.0\]/);
  assert.match(attribution, /Reduced the mesh from 116,412 to 58,870 triangles/);
  assert.match(attribution, /does not supply collision shapes or physics/);
  assert.match(basisLicense, /Apache License/);
  assert.doesNotThrow(() => validateMotorcycleModelManifest(manifest));
});

test('GLB contents match the manifest and require only packaged Meshopt and KTX2 support', async () => {
  const [manifest, model] = await Promise.all([readManifest(), readFile(MODEL_URL)]);
  const { json, binary } = parseGlb(model);
  assert.equal(json.asset.version, '2.0');
  assert.equal(json.asset.generator, 'glTF-Transform v4.4.2');
  assert.ok(json.buffers.length >= 1);
  assert.ok(json.buffers.every((buffer) => buffer.uri === undefined));
  assert.equal(json.images.length, manifest.output.textureCount);
  assert.equal(json.materials.length, manifest.output.materialCount);
  assert.equal(json.animations?.length ?? 0, manifest.output.animationCount);
  assert.deepEqual(
    [...json.extensionsRequired].sort(),
    [...manifest.output.requiredExtensions].sort(),
  );

  let triangleCount = 0;
  let primitiveCount = 0;
  for (const mesh of json.meshes) {
    for (const primitive of mesh.primitives) {
      assert.equal(primitive.mode ?? 4, 4);
      const indexCount = json.accessors[primitive.indices].count;
      assert.equal(indexCount % 3, 0);
      triangleCount += indexCount / 3;
      primitiveCount += 1;
    }
  }
  assert.equal(triangleCount, manifest.output.triangleCount);
  assert.equal(primitiveCount, manifest.output.meshPrimitiveCount);
  assert.equal(primitiveCount, manifest.output.drawCallUpperBound);

  let compressedTexturePayloadBytes = 0;
  for (const image of json.images) {
    assert.equal(image.mimeType, 'image/ktx2');
    assert.equal(image.uri, undefined);
    const bufferView = json.bufferViews[image.bufferView];
    const start = bufferView.byteOffset ?? 0;
    const imageBytes = binary.subarray(start, start + bufferView.byteLength);
    assert.deepEqual(
      [...imageBytes.subarray(0, 12)],
      [0xab, 0x4b, 0x54, 0x58, 0x20, 0x32, 0x30, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a],
    );
    const imageView = new DataView(imageBytes.buffer, imageBytes.byteOffset, imageBytes.byteLength);
    const width = imageView.getUint32(20, true);
    const height = imageView.getUint32(24, true);
    assert.ok(width <= manifest.output.maximumTextureDimension);
    assert.ok(height <= manifest.output.maximumTextureDimension);
    compressedTexturePayloadBytes += bufferView.byteLength;
  }
  assert.equal(compressedTexturePayloadBytes, manifest.output.compressedTexturePayloadBytes);
  for (const texture of json.textures) {
    assert.ok(texture.extensions?.KHR_texture_basisu, 'Every texture must use local KTX2 data.');
  }
});

test('calibration maps source X-length geometry to runtime +Z-forward at 1.67 m wheelbase', async () => {
  const manifest = await readManifest();
  const { calibration } = manifest;
  const front = runtimePoint(calibration.sourceWheelCenters.front, calibration);
  const rear = runtimePoint(calibration.sourceWheelCenters.rear, calibration);
  const midpoint = front.map((component, index) => (component + rear[index]) / 2);
  calibration.targetWheelMidpointMeters.forEach((target, index) => approximatelyEqual(midpoint[index], target));
  approximatelyEqual(front[2] - rear[2], 1.6699990084701584, 1e-12);
  assert.ok(front[2] > rear[2], 'Front wheel must face runtime +Z.');
  approximatelyEqual(calibration.uniformScale, 1.67 / calibration.sourceWheelbaseMeters, 1e-15);
  assert.deepEqual(calibration.runtimeAxes, { axle: '+X', up: '+Y', forward: '+Z' });
  const calibratedMinimumY = manifest.output.sourceSpaceBounds.minimum[1]
    * calibration.uniformScale
    + calibration.translationMeters[1]
    + calibration.presentationGroundingOffsetMeters[1];
  approximatelyEqual(calibratedMinimumY, calibration.physicsTireBottomMidpointMeters, 1e-12);
  approximatelyEqual(calibration.physicsRollingRadiusMeters, 0.412, 1e-12);
});

test('manifest validator rejects authority escalation, traversal, digest, and cap violations', async () => {
  const manifest = await readManifest();
  const traversal = structuredClone(manifest);
  traversal.output.file = '../remote.glb';
  assert.throws(() => validateMotorcycleModelManifest(traversal), /traverse/);

  const authority = structuredClone(manifest);
  authority.collisionAuthority = true;
  assert.throws(() => validateMotorcycleModelManifest(authority), /physics or collision authority/);

  const digest = structuredClone(manifest);
  digest.output.sha256 = 'not-a-digest';
  assert.throws(() => validateMotorcycleModelManifest(digest), /SHA-256/);

  const grounding = structuredClone(manifest);
  grounding.calibration.presentationGroundingOffsetMeters[1] = '-0.12573690675938365';
  assert.throws(() => validateMotorcycleModelManifest(grounding), /presentationGroundingOffsetMeters/);

  const floating = structuredClone(manifest);
  floating.calibration.presentationGroundingOffsetMeters[1] += 0.1;
  assert.throws(() => validateMotorcycleModelManifest(floating), /align its minimum Y/);

  assert.throws(
    () => validateMotorcycleModelManifest(manifest, { limits: { maximumTriangles: 58_000 } }),
    /maximumTriangles/,
  );
});

function responseForText(text) {
  const bytes = new TextEncoder().encode(text).byteLength;
  return {
    ok: true,
    status: 200,
    headers: { get: (name) => (name.toLowerCase() === 'content-length' ? String(bytes) : null) },
    text: async () => text,
  };
}

function responseForBuffer(buffer) {
  return {
    ok: true,
    status: 200,
    headers: { get: (name) => (name.toLowerCase() === 'content-length' ? String(buffer.byteLength) : null) },
    arrayBuffer: async () => buffer.slice(0),
  };
}

async function fixtureManifest(buffer) {
  const manifest = await readManifest();
  manifest.output.bytes = buffer.byteLength;
  manifest.output.sha256 = digestHex(Buffer.from(buffer));
  manifest.output.compressedTexturePayloadBytes = 0;
  return manifest;
}

test('resource owner shares immutable GPU assets across handles and disposes exactly once', async () => {
  const modelBuffer = Uint8Array.from([1, 3, 3, 7]).buffer;
  const manifest = await fixtureManifest(modelBuffer);
  const manifestText = JSON.stringify(manifest);
  const disposeCounts = { geometry: 0, material: 0, texture: 0, loader: 0, parse: 0 };
  const geometry = new THREE.BufferGeometry();
  geometry.dispose = () => { disposeCounts.geometry += 1; };
  const texture = new THREE.Texture();
  texture.dispose = () => { disposeCounts.texture += 1; };
  const material = new THREE.MeshPhysicalMaterial({
    map: texture,
    opacity: 0.25,
    transmission: 1,
    side: THREE.DoubleSide,
  });
  material.dispose = () => { disposeCounts.material += 1; };
  const sourceScene = new THREE.Group();
  sourceScene.add(new THREE.Mesh(geometry, material));
  const fetchImpl = async (url) => {
    if (url.endsWith('manifest.json')) return responseForText(manifestText);
    if (url.endsWith('model.glb')) return responseForBuffer(modelBuffer);
    throw new Error(`Unexpected fixture URL: ${url}`);
  };
  const loaderFactory = ({ transcoderPath, workerLimit }) => {
    assert.equal(transcoderPath, './models/akira-bike/basis/');
    assert.equal(workerLimit, 2);
    return {
      parseAsync: async (buffer, baseUrl) => {
        disposeCounts.parse += 1;
        assert.equal(buffer.byteLength, modelBuffer.byteLength);
        assert.equal(baseUrl, './models/akira-bike/');
        return { scene: sourceScene, animations: [] };
      },
      dispose: () => { disposeCounts.loader += 1; return true; },
    };
  };
  const resource = createMotorcycleModelResource({
    THREE,
    renderer: {},
    fetchImpl,
    cryptoProvider: webcrypto,
    loaderFactory,
  });

  const [first, second] = await Promise.all([
    resource.createInstance(),
    resource.createInstance({ visible: false }),
  ]);
  assert.equal(disposeCounts.parse, 1);
  assert.notEqual(first.root, second.root);
  const firstMesh = first.root.getObjectByProperty('isMesh', true);
  const secondMesh = second.root.getObjectByProperty('isMesh', true);
  assert.equal(firstMesh.geometry, secondMesh.geometry);
  assert.equal(firstMesh.material, secondMesh.material);
  const firstParent = new THREE.Group();
  const secondParent = new THREE.Group();
  firstParent.add(first.root);
  secondParent.add(second.root);
  assert.equal(first.getTelemetry().schemaVersion, MOTORCYCLE_MODEL_INSTANCE_TELEMETRY_SCHEMA);
  assert.equal(first.release(), true);
  assert.equal(first.root.parent, null);
  assert.deepEqual(disposeCounts, { geometry: 0, material: 0, texture: 0, loader: 0, parse: 1 });

  const ready = resource.getTelemetry();
  assert.equal(ready.schemaVersion, MOTORCYCLE_MODEL_TELEMETRY_SCHEMA);
  assert.equal(ready.status, 'ready');
  assert.equal(ready.activeHandles, 1);
  assert.equal(ready.successfulLoads, 1);
  assert.equal(ready.reusedLoads, 1);
  assert.deepEqual(ready.resourceCounts, { geometries: 1, materials: 1, textures: 1 });
  assert.equal(ready.model.physicsAuthority, 'six-body-particle-rigid');
  assert.equal(ready.model.collisionAuthority, false);
  assert.equal(ready.model.compressedTexturePayloadBytes, 0);
  assert.deepEqual(ready.materialPolicy, {
    schemaVersion: 'peercompute.motorcycle.model-material-policy.v1',
    renderingModel: 'single-pass-alpha-transparency',
    materialCount: 1,
    transmissionDisabledMaterialCount: 1,
    transparentMaterialCount: 1,
    depthWriteDisabledMaterialCount: 1,
    forceSinglePassMaterialCount: 1,
    twoPassTransparentMaterialCount: 0,
    maximumRuntimeTransparentPasses: 1,
    maximumRuntimeTransmission: 0,
    transmissionPrepass: false,
  });
  assert.equal(firstMesh.material.transmission, 0);
  assert.equal(firstMesh.material.opacity, 0.25);
  assert.equal(firstMesh.material.transparent, true);
  assert.equal(firstMesh.material.depthWrite, false);
  assert.equal(firstMesh.material.side, THREE.DoubleSide);
  assert.equal(firstMesh.material.forceSinglePass, true);
  assert.deepEqual(
    first.root.userData.presentationGroundingOffsetMeters,
    [0, -0.12573690675938365, 0],
  );

  assert.equal(resource.dispose(), true);
  assert.equal(second.root.parent, null);
  assert.equal(second.release(), false);
  assert.equal(resource.dispose(), false);
  assert.deepEqual(disposeCounts, { geometry: 1, material: 1, texture: 1, loader: 1, parse: 1 });
  const disposed = resource.getTelemetry();
  assert.equal(disposed.status, 'disposed');
  assert.equal(disposed.activeHandles, 0);
  assert.equal(disposed.handlesReleased, 2);
  assert.deepEqual(disposed.disposal, { geometries: 1, materials: 1, textures: 1 });
  await assert.rejects(() => resource.createInstance(), /disposed/);
});

test('resource verifies the model digest before constructing GPU loaders', async () => {
  const modelBuffer = Uint8Array.from([4, 2]).buffer;
  const manifest = await fixtureManifest(Uint8Array.from([4, 3]).buffer);
  const manifestText = JSON.stringify(manifest);
  let loaderFactoryCalls = 0;
  const resource = createMotorcycleModelResource({
    THREE,
    renderer: {},
    cryptoProvider: webcrypto,
    fetchImpl: async (url) => (url.endsWith('manifest.json')
      ? responseForText(manifestText)
      : responseForBuffer(modelBuffer)),
    loaderFactory: () => {
      loaderFactoryCalls += 1;
      throw new Error('loader must not be constructed');
    },
  });
  await assert.rejects(() => resource.createInstance(), /SHA-256/);
  assert.equal(loaderFactoryCalls, 0);
  assert.equal(resource.getTelemetry().status, 'error');
  assert.equal(resource.getTelemetry().failedLoads, 1);
  assert.equal(resource.dispose(), true);
});

test('loader source uses Three r182 GLTF, KTX2, and Meshopt locally with renderer detection', async () => {
  const source = await readFile(LOADER_SOURCE_URL, 'utf8');
  assert.equal(MOTORCYCLE_MODEL_ASSET_BASE_URL, './models/akira-bike/');
  assert.match(source, /GLTFLoader.*three\/addons\/loaders\/GLTFLoader\.js/);
  assert.match(source, /KTX2Loader.*three\/addons\/loaders\/KTX2Loader\.js/);
  assert.match(source, /MeshoptDecoder.*three\/addons\/libs\/meshopt_decoder\.module\.js/);
  assert.match(source, /ktx2Loader\.detectSupport\(renderer\)/);
  assert.match(source, /gltfLoader\.setKTX2Loader\(ktx2Loader\)/);
  assert.match(source, /gltfLoader\.setMeshoptDecoder\(MeshoptDecoder\)/);
  assert.match(source, /credentials: 'same-origin'/);
  assert.doesNotMatch(source, /https?:\/\//);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(process.cwd());

const read = (rel) => fs.readFileSync(path.join(repoRoot, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(repoRoot, rel));

test('config/relay.json exists and is referenced by dev scripts', () => {
  assert.ok(exists('config/relay.json'), 'config/relay.json missing');
  const devAll = read('scripts/dev-all.sh');
  const startDev = read('peercompute/start-dev.sh');
  assert.ok(devAll.includes('config/relay.json'), 'dev-all.sh does not load config/relay.json');
  assert.ok(startDev.includes('config/relay.json'), 'start-dev.sh does not load config/relay.json');
});

test('config/relay.json exists and build writes relay-config.json for demos', () => {
  assert.ok(exists('config/relay.json'), 'config/relay.json missing');
  assert.ok(
    exists('scripts/write-prod-relay-config.mjs'),
    'write-prod-relay-config.mjs missing'
  );
  const buildAll = read('scripts/build-all.sh');
  assert.ok(
    buildAll.includes('write-prod-relay-config.mjs'),
    'build-all.sh does not write production relay-config.json'
  );
});

test('production relay config advertises WSS plus STUN and TURN UDP/TCP', () => {
  const config = JSON.parse(read('config/relay.json'));
  assert.equal(config.relayHost, 'secretworkshop.net');
  assert.equal(config.relayProtocol, 'wss');
  assert.equal(
    config.publicHost,
    '',
    'production config must not derive coturn external-ip from a stale literal address'
  );
  assert.equal(
    config.relayConfigUrl,
    'https://secretworkshop.net/peercompute/config/relay-config.json'
  );
  assert.equal(typeof config.relayPeerId, 'string');
  assert.ok(config.relayPeerId.length > 0, 'production relay peer id missing');

  const iceServers = config.webrtc?.iceServers;
  assert.ok(Array.isArray(iceServers), 'production ICE server list missing');
  const urls = iceServers.flatMap((server) => (
    Array.isArray(server?.urls) ? server.urls : [server?.urls]
  )).filter((url) => typeof url === 'string');
  assert.ok(urls.some((url) => url.startsWith('stun:')), 'production STUN URL missing');
  assert.ok(
    urls.includes('turn:secretworkshop.net:3478?transport=udp'),
    'production TURN UDP URL missing'
  );
  assert.ok(
    urls.includes('turn:secretworkshop.net:3478?transport=tcp'),
    'production TURN TCP URL missing'
  );

  const turnServer = iceServers.find((server) => (
    (Array.isArray(server?.urls) ? server.urls : [server?.urls])
      .some((url) => typeof url === 'string' && url.startsWith('turn:'))
  ));
  assert.equal(typeof turnServer?.username, 'string', 'TURN username missing');
  assert.ok(turnServer.username.length > 0, 'TURN username empty');
  assert.equal(typeof turnServer?.credential, 'string', 'TURN credential missing');
  assert.ok(turnServer.credential.length > 0, 'TURN credential empty');
});

test('backend launcher and systemd wiring include relay + turn stack', () => {
  assert.ok(exists('scripts/pcserver.sh'), 'pcserver.sh missing');
  assert.ok(exists('scripts/start-turn-prod.sh'), 'start-turn-prod.sh missing');

  const rootPackage = read('package.json');
  assert.ok(rootPackage.includes('"backend"'), 'package.json missing backend script');
  assert.ok(rootPackage.includes('"dev:vpn-coturn"'), 'package.json missing local coturn dev launcher script');

  const relaySystemd = read('scripts/install-relay-systemd.sh');
  assert.ok(relaySystemd.includes('scripts/pcserver.sh'), 'relay systemd installer does not launch pcserver.sh');
  assert.ok(relaySystemd.includes('enable_turn="${PCSERVER_ENABLE_TURN:-1}"'), 'relay systemd installer does not default TURN service on');
  assert.ok(relaySystemd.includes('Environment=PCSERVER_ENABLE_TURN=$enable_turn'), 'relay systemd installer does not write TURN enable env');
});

test('docs index includes all demos and screenshots', () => {
  const html = read('docs/index.html');
  const requiredLinks = [
    './hyperborea/',
    './cubechat/',
    './sneakywoods/',
    './daddygo/',
    './fano-reactor/',
    './schrodinger/',
    './planetgen/',
    './wxglobe/',
    './earth/',
    './motorcycle/',
    './multiscale/',
    './universes/',
    './webgpuphys/'
  ];
  requiredLinks.forEach((href) => {
    assert.ok(html.includes(href), `docs index missing link: ${href}`);
  });
  const requiredImages = [
    './assets/hyperborea.png',
    './assets/cubechat.png',
    './assets/sneakywoods.png',
    './assets/fano-reactor.svg',
    './assets/schrodinger.svg',
    './assets/multiscale.svg',
    './assets/planetgen.png',
    './assets/wxglobe.png',
    './assets/earth.png',
    './assets/motorcycle.png',
    './assets/webgpuphys.png'
  ];
  requiredImages.forEach((src) => {
    assert.ok(html.includes(src), `docs index missing image: ${src}`);
  });
});

test('docs overview keeps expected tile order', () => {
  const html = read('docs/index.html');
  const names = [...html.matchAll(/<h2>([^<]+)<\/h2>/g)].map((match) => match[1]);
  const expected = [
    'PeerCompute (GitHub)',
    'CubeChat',
    'Universes',
    'Multiscale Ladder',
    'PlanetGen',
    'WXGlobe',
    'EarthGrid',
    'RoadVector',
    'NetViz',
    'Fano Reactor',
    'Schrodinger',
    'SneakyWoods',
    'Daddy Go!',
    'Dynamics (WebGpuPhys)',
    'MPM Visual (WebGpuPhys)',
    'PPF Contact Solver (WebGpuPhys)',
    'Hyperborea'
  ];
  assert.deepEqual(names.slice(0, expected.length), expected, 'docs overview tile order mismatch');
});

test('wxglobe release wiring is imagery-free and excludes retired weather data', () => {
  const rootPackage = JSON.parse(read('package.json'));
  const demoPackage = JSON.parse(read('demos/wxglobe/package.json'));
  const viteConfig = read('demos/wxglobe/vite.config.js');
  const indexHtml = read('demos/wxglobe/index.html');
  const main = read('demos/wxglobe/src/main.js');
  const etopoTerrain = read('demos/wxglobe/src/terrain/etopo2022.js');
  const terrariumTerrain = read('demos/wxglobe/src/terrain/terrarium.js');
  const sharedEtopoTerrain = read('packages/geo-core/src/terrain/etopo2022.js');
  const sharedTerrariumTerrain = read('packages/geo-core/src/terrain/terrarium.js');
  const runtimeSmoke = read('demos/tests/runtime-smoke.mjs');
  const devAll = read('scripts/dev-all.sh');
  const devLocalRelay = read('scripts/dev-local-relay.sh');

  assert.ok(rootPackage.workspaces.includes('demos/wxglobe'));
  assert.equal(rootPackage.scripts['dev:wxglobe'], 'npm --prefix demos/wxglobe run dev -- --host');
  assert.equal(rootPackage.scripts['build:wxglobe'], 'npm --prefix demos/wxglobe run build');
  assert.ok(rootPackage.scripts['build:demos'].includes('npm run build:wxglobe'));
  assert.match(viteConfig, /port:\s*5186/);
  assert.ok(viteConfig.includes("path.resolve(docsRoot, 'wxglobe')"));
  assert.ok(viteConfig.includes("JSON.stringify('./cesium/')"));
  assert.equal(demoPackage.dependencies.cesium, '1.144.0');
  assert.equal(demoPackage.dependencies['grib-js'], undefined);
  assert.equal(demoPackage.dependencies.netcdfjs, undefined);
  assert.ok(main.includes('baseLayer: false'));
  assert.ok(main.includes('createTopoMaterial'));
  assert.ok(main.includes('providerGeneration'));
  assert.ok(etopoTerrain.includes('@peercompute/geo-core/terrain/etopo2022'));
  assert.ok(terrariumTerrain.includes('@peercompute/geo-core/terrain/terrarium'));
  assert.ok(sharedEtopoTerrain.includes("ETOPO_2022_v1_60s_surface"));
  assert.ok(sharedEtopoTerrain.includes('ETOPO2022_MAX_LEVEL = 6'));
  assert.ok(sharedEtopoTerrain.includes('ETOPO2022_TILE_SIZE = 257'));
  assert.ok(sharedTerrariumTerrain.includes('TERRARIUM_GRID_SIZE = TERRARIUM_TILE_SIZE + 1'));
  assert.ok(sharedTerrariumTerrain.includes('maximumLoadedLevel'));
  assert.ok(indexHtml.includes('ArcticDEM terrain data DEM(s) were created'));
  assert.ok(indexHtml.includes('United States 3DEP (formerly NED)'));
  assert.ok(indexHtml.includes('id="aws-terrain-attribution"'));
  assert.ok(indexHtml.includes('NOAA Z6 // AWS Z15'));
  assert.ok(runtimeSmoke.includes('Unknown runtime smoke demo(s)'), 'runtime demo filtering must fail closed on typos');
  assert.ok(
    runtimeSmoke.includes("demo.name === 'wxglobe' && process.env.WXGLOBE_REQUIRE_LIVE_TERRAIN !== '1'"),
    'the deterministic release smoke must fixture WXGlobe terrain without masking its explicit live gate',
  );
  assert.ok(!indexHtml.includes('Weather dataset'));
  assert.ok(!exists('demos/wxglobe/src/weatherManager.js'));
  assert.ok(!exists('demos/wxglobe/src/weatherWorker.js'));
  assert.ok(!exists('demos/wxglobe/src/windLayer.js'));
  assert.ok(!exists('demos/wxglobe/wxdata_subset'));
  assert.ok(devAll.includes('demos/wxglobe/public'));
  assert.ok(devLocalRelay.includes('VITE_WXGLOBE_URL="${demo_base}:5186/"'));
});

test('wxglobe built docs include nested-path-safe Cesium runtime assets', () => {
  const builtHtml = read('docs/wxglobe/index.html');
  const requiredRuntimeAssets = [
    'docs/wxglobe/cesium/Workers/createVerticesFromHeightmap.js',
    'docs/wxglobe/cesium/ThirdParty/basis_transcoder.wasm',
    'docs/wxglobe/cesium/Assets/approximateTerrainHeights.json',
    'docs/wxglobe/cesium/Widgets/widgets.css',
    'docs/wxglobe/cesium/LICENSE.md',
    'docs/wxglobe/cesium/ThirdParty.json'
  ];
  const builtModulePath = builtHtml.match(/<script[^>]+src="\.\/(assets\/[^"?]+\.js)"/i)?.[1];

  assert.ok(!builtHtml.includes('src="/cesium/'), 'wxglobe built HTML must not use a domain-root Cesium path');
  assert.ok(!exists('docs/wxglobe/cesium/node_modules'), 'wxglobe Cesium copy must not preserve hoisted node_modules segments');
  requiredRuntimeAssets.forEach((asset) => assert.ok(exists(asset), `wxglobe built asset missing: ${asset}`));
  assert.ok(builtModulePath, 'wxglobe built HTML does not reference its hashed entry module');
  const builtModule = read(`docs/wxglobe/${builtModulePath}`);
  assert.ok(builtModule.includes('CappedHeightmapTerrainProvider'), 'wxglobe built bundle is stale: capped provider missing');
  assert.ok(builtModule.includes('maximumLoadedLevel'), 'wxglobe built bundle is stale: successful deep-tile telemetry missing');
  assert.ok(builtModule.includes('Terrain request aborted'), 'wxglobe built bundle is stale: abortable retry path missing');
});

test('earth and motorcycle production artifacts carry their real-data runtime contracts', () => {
  const earthHtml = read('docs/earth/index.html');
  const motorcycleHtml = read('docs/motorcycle/index.html');
  const earthModulePath = earthHtml.match(/<script[^>]+src="\.\/(assets\/[^"?]+\.js)"/i)?.[1];
  const motorcycleModulePath = motorcycleHtml.match(/<script[^>]+src="\.\/(assets\/[^"?]+\.js)"/i)?.[1];
  assert.ok(earthModulePath, 'EarthGrid built HTML does not reference its hashed entry module');
  assert.ok(motorcycleModulePath, 'RoadVector built HTML does not reference its hashed entry module');
  const earthModule = read(`docs/earth/${earthModulePath}`);
  const motorcycleModule = read(`docs/motorcycle/${motorcycleModulePath}`);
  assert.ok(earthModule.includes('peercompute.geo.osm-region.v1'));
  assert.ok(earthModule.includes('OpenStreetMap'));
  assert.ok(earthModule.includes('peercompute.earthgrid.actual-geometry-style.v3'), 'EarthGrid built bundle is stale: paired shoreline buffer-geometry style contract missing');
  assert.ok(earthModule.includes('peercompute.geo.shortbread-geometry-telemetry.v1'), 'EarthGrid built bundle is stale: Shortbread geometry lifecycle missing');
  assert.ok(earthModule.includes('peercompute.earthgrid.water-buffer-geometry.v2'), 'EarthGrid built bundle is stale: water buffer-geometry contract missing');
  assert.ok(earthModule.includes('flat-cesium-buffer-polygon'), 'EarthGrid built bundle is stale: flat water buffer polygon missing');
  assert.ok(earthModule.includes('bounded-terrain-sample-median-or-zero-fallback'), 'EarthGrid built bundle is stale: truthful inland-water level model missing');
  assert.ok(earthModule.includes('#0080ff'), 'EarthGrid built bundle is stale: exact blue water color missing');
  assert.ok(earthModule.includes('peercompute.geo.water-nurbs-outlines.v1'), 'EarthGrid built bundle is stale: NURBS shoreline contract missing');
  assert.ok(earthModule.includes('exact-degree-one-nurbs-polyline'), 'EarthGrid built bundle is stale: exact shoreline topology policy missing');
  assert.ok(earthModule.includes('shoreline-landline'), 'EarthGrid built bundle is stale: land-side shoreline companion category missing');
  assert.ok(earthModule.includes('global-web-mercator-tile-pixels'), 'EarthGrid built bundle is stale: land-side offset-space contract missing');
  assert.ok(earthModule.includes('#33ff73'), 'EarthGrid built bundle is stale: exact green land-side color missing');
  assert.ok(earthModule.includes('peercompute.earthgrid.source-cache.v1'), 'EarthGrid built bundle is stale: local StateManager source cache missing');
  assert.ok(earthModule.includes('peercompute.geo.cached-fetch-telemetry.v1'), 'EarthGrid built bundle is stale: backend/local cached fetch missing');
  assert.ok(earthModule.includes('peercompute.local-artifact-cache-stats.v1'), 'EarthGrid built bundle is stale: bounded local artifact cache missing');
  assert.ok(earthModule.includes('peercompute.earthgrid.terrain-nurbs-geometry.v1'), 'EarthGrid built bundle is stale: terrain contour geometry missing');
  assert.ok(earthModule.includes('actual-cesium-buffer-geometry'), 'EarthGrid built bundle is stale: Cesium buffer renderer missing');
  assert.ok(earthModule.includes('peercompute.geo.shortbread-buffer-residency.v1'), 'EarthGrid built bundle is stale: compiled buffer residency missing');
  assert.ok(earthModule.includes('bounded-compiled-buffer-lru-with-detached-inactive-residents'), 'EarthGrid built bundle is stale: view persistence contract missing');
  assert.ok(earthModule.includes('Cesium.BufferPolygonCollection/BufferPolylineCollection'), 'EarthGrid built bundle is stale: buffer backend marker missing');
  assert.ok(earthModule.includes('explicit-geodetic-heights'), 'EarthGrid built bundle is stale: physical ordering contract missing');
  assert.ok(earthModule.includes('solid-unlit-color'), 'EarthGrid built bundle is stale: solid one-pass line material missing');
  assert.ok(earthModule.includes('terrain-source-native-zero'), 'EarthGrid built bundle is stale: truthful waterline reference missing');
  assert.ok(!earthModule.includes('EarthGridWaterlineTopoOverlayMaterial'), 'EarthGrid must not retain the painted terrain shader');
  assert.ok(earthHtml.includes('WATER // 50%'), 'EarthGrid built HTML is stale: water legend missing');
  assert.ok(earthHtml.includes('LAND SIDE // GREEN COMPANION'), 'EarthGrid built HTML is stale: paired shoreline legend missing');
  assert.ok(earthHtml.includes('SOURCE CACHE'), 'EarthGrid built HTML is stale: source-cache disclosure missing');
  assert.ok(earthHtml.includes('BOUNDED Z10 DETAIL'), 'EarthGrid built HTML is stale: bounded interactive terrain LOD disclosure missing');
  assert.ok(earthModule.includes('geolocation-denied-fallback'), 'EarthGrid built bundle is stale: denied-location fallback missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.game-runtime-state.v1'));
  assert.ok(motorcycleModule.includes('surfaceContactShapes'), 'RoadVector built bundle is stale: continuous wheel support descriptors missing');
  assert.ok(motorcycleModule.includes('surfaceContactShapeA'), 'RoadVector built bundle is stale: public continuous wheel contact identity missing');
  assert.ok(motorcycleModule.includes('contactModel'), 'RoadVector built bundle is stale: compliant contact material model missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.terrain-draped-road-surface.v1'), 'RoadVector built bundle is stale: draped physical road surface missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.composite-road-terrain-collider.telemetry.v1'), 'RoadVector built bundle is stale: composite road/terrain collider missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.globe-surface-stream.v1'), 'RoadVector built bundle is stale: continuous globe stream missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.globe-surface-snapshot.v1'), 'RoadVector built bundle is stale: atomic globe snapshot missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.globe-surface-reservation.v1'), 'RoadVector built bundle is stale: stream reservation contract missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.streaming-surface-collider.telemetry.v1'), 'RoadVector built bundle is stale: streaming collision facade missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.streamed-terrain-renderer.v1'), 'RoadVector built bundle is stale: streamed Three terrain renderer missing');
  assert.ok(motorcycleModule.includes('activeSnapshotNoopCount'), 'RoadVector built bundle is stale: active stream no-op telemetry missing');
  assert.ok(motorcycleModule.includes('evaluatedContentEpoch'), 'RoadVector built bundle is stale: stream content-epoch qualification missing');
  assert.ok(motorcycleModule.includes('atomic-stream-snapshot-with-single-fallback'), 'RoadVector built bundle is stale: deterministic fallback collision policy missing');
  assert.ok(motorcycleModule.includes('wgs84-ecef-cesium-overview'), 'RoadVector built bundle is stale: WGS84/Cesium globe authority missing');
  assert.ok(motorcycleModule.includes('three-webxr-local-tangent-frame'), 'RoadVector built bundle is stale: local tangent ride renderer disclosure missing');
  assert.ok(motorcycleModule.includes('transmissionMode'), 'RoadVector built bundle is stale: explicit transmission mode missing');
  assert.ok(motorcycleModule.includes('maximumDesktopPixelRatio'), 'RoadVector built bundle is stale: desktop pixel-ratio cap missing');
  assert.ok(motorcycleModule.includes('peercompute.synthetic-road-traffic.snapshot.v1'));
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.road-race-course.v1'), 'RoadVector built bundle is stale: race contract missing');
  assert.ok(motorcycleModule.includes('motorcycle-contact-markers'), 'RoadVector built bundle is stale: contact rendering missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.model-resource.telemetry.v1'), 'RoadVector built bundle is stale: licensed model resource missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.model-material-policy.v1'), 'RoadVector built bundle is stale: model single-pass material policy missing');
  assert.ok(motorcycleModule.includes('single-pass-alpha-transparency'), 'RoadVector built bundle is stale: glass transmission prepass is not disabled');
  assert.ok(motorcycleModule.includes('forceSinglePassMaterialCount'), 'RoadVector built bundle is stale: double-sided alpha material can still render twice');
  assert.ok(motorcycleModule.includes('presentationGroundingOffsetMeters'), 'RoadVector built bundle is stale: visual tire grounding calibration missing');
  assert.ok(motorcycleModule.includes('offscreenGateCulling'), 'RoadVector built bundle is stale: race-gate frustum culling contract missing');
  assert.ok(motorcycleModule.includes('licensed-optimized-akira-model'), 'RoadVector built bundle is stale: optimized model presentation missing');
  assert.ok(motorcycleModule.includes('six-body-particle-rigid'), 'RoadVector built bundle is stale: model/physics authority separation missing');
  assert.ok(motorcycleModule.includes('transparent-terrain-with-bounded-nurbs-contours'), 'RoadVector built bundle is stale: transparent NURBS terrain missing');
  assert.ok(exists('docs/motorcycle/models/akira-bike/model.glb'), 'RoadVector optimized model GLB is missing');
  assert.ok(exists('docs/motorcycle/models/akira-bike/manifest.json'), 'RoadVector model manifest is missing');
  assert.ok(exists('docs/motorcycle/models/akira-bike/ATTRIBUTION.md'), 'RoadVector model attribution is missing');
  assert.ok(exists('docs/motorcycle/models/akira-bike/LICENSE.txt'), 'RoadVector model license is missing');
  assert.ok(exists('docs/motorcycle/models/akira-bike/basis/basis_transcoder.wasm'), 'RoadVector local KTX2 transcoder is missing');
  const motorcycleModelManifest = JSON.parse(read('docs/motorcycle/models/akira-bike/manifest.json'));
  assert.equal(motorcycleModelManifest.license?.spdx, 'CC-BY-4.0');
  assert.equal(motorcycleModelManifest.output?.bytes, 7_508_640);
  assert.equal(motorcycleModelManifest.output?.triangleCount, 58_870);
  assert.equal(motorcycleModelManifest.physicsAuthority, 'six-body-particle-rigid');
  assert.equal(motorcycleModelManifest.collisionAuthority, false);
  assert.ok(motorcycleModule.includes('xr-root-fallback'), 'RoadVector built bundle is stale: single-source XR UI fallback missing');
  assert.ok(motorcycleModule.includes('geolocation-denied-fallback'), 'RoadVector built bundle is stale: denied-location fallback missing');
  assert.ok(motorcycleModule.includes('peercompute.roadvector.hemisphere-overview.v1'), 'RoadVector built bundle is stale: hemisphere overview missing');
  assert.ok(motorcycleModule.includes('peercompute.roadvector.cesium-overview-renderer.v1'), 'RoadVector built bundle is stale: Cesium overview missing');
  assert.ok(motorcycleModule.includes('peercompute.roadvector.source-cache.v1'), 'RoadVector built bundle is stale: local StateManager source cache missing');
  assert.ok(motorcycleModule.includes('peercompute.motorcycle.terrarium-decoded-cache.v1'), 'RoadVector built bundle is stale: decoded terrain cache missing');
  assert.ok(motorcycleModule.includes('session-local-bounded-decoded-heightmap-lru'), 'RoadVector built bundle is stale: decoded terrain LRU policy missing');
  assert.ok(motorcycleModule.includes('peercompute.geo.cached-fetch-telemetry.v1'), 'RoadVector built bundle is stale: backend/local cached fetch missing');
  assert.ok(motorcycleModule.includes('CappedHeightmapTerrainProvider'), 'RoadVector built bundle is stale: Cesium terrain provider missing');
  assert.ok(motorcycleModule.includes('ERR_MOTORCYCLE_TERRAIN_TIMEOUT'), 'RoadVector built bundle is stale: bounded terrain deadline missing');
  assert.ok(motorcycleModule.includes('aws-terrarium'), 'RoadVector built bundle is stale: reliable Terrarium terrain source missing');
  assert.ok(motorcycleModule.includes('regional-major-roads-only'), 'RoadVector built bundle is stale: bounded major-road coverage missing');
  assert.ok(motorcycleModule.includes('fhwa-national-highway-system'), 'RoadVector built bundle is stale: FHWA NHS layer missing');
  assert.ok(motorcycleModule.includes('user-selected-anchor'), 'RoadVector built bundle is stale: globe click-to-start missing');
  assert.ok(motorcycleModule.includes('ERR_MOTORCYCLE_NO_USABLE_ROAD'), 'RoadVector built bundle is stale: empty-road selection guard missing');
  assert.ok(motorcycleModule.includes('fixed-red-remote-players'), 'RoadVector built bundle is stale: live-player color policy missing');
  assert.ok(motorcycleHtml.includes('RIDE THIS REGION'), 'RoadVector built HTML is stale: overview-to-ride control missing');
  assert.ok(motorcycleHtml.includes('CONTINUOUS GLOBE TERRAIN'), 'RoadVector built HTML is stale: continuous off-road globe disclosure missing');
  assert.ok(motorcycleHtml.includes('AUTOMATIC TRANSMISSION // PHYSICS RPM'), 'RoadVector built HTML is stale: automatic transmission control missing');
  assert.ok(motorcycleHtml.includes('AWS TERRAIN TILES'), 'RoadVector built HTML is stale: Terrarium attribution missing');
  assert.ok(motorcycleHtml.includes('SOURCE CACHE'), 'RoadVector built HTML is stale: source-cache disclosure missing');
  assert.ok(motorcycleModule.includes('xr-standard'));
  [
    'docs/earth/cesium/Workers/createVerticesFromHeightmap.js',
    'docs/earth/cesium/ThirdParty/basis_transcoder.wasm',
    'docs/earth/cesium/Assets/approximateTerrainHeights.json',
    'docs/earth/cesium/Widgets/widgets.css',
    'docs/earth/cesium/LICENSE.md',
    'docs/earth/cesium/ThirdParty.json',
    'docs/motorcycle/cesium/Workers/createVerticesFromHeightmap.js',
    'docs/motorcycle/cesium/ThirdParty/basis_transcoder.wasm',
    'docs/motorcycle/cesium/Assets/approximateTerrainHeights.json',
    'docs/motorcycle/cesium/Widgets/widgets.css',
    'docs/motorcycle/cesium/LICENSE.md',
    'docs/motorcycle/cesium/ThirdParty.json',
    'docs/motorcycle/licenses/NOTICE.md',
    'docs/motorcycle/licenses/three-LICENSE.txt',
    'docs/motorcycle/data/fhwa-nhs/2025.08.08/manifest.json',
    'docs/motorcycle/data/fhwa-nhs/2025.08.08/source-metadata.xml',
    'docs/motorcycle/data/fhwa-nhs/2025.08.08/tiles/5/2/9.pbf',
    'docs/motorcycle/data/fhwa-nhs/2025.08.08/tiles/5/7/12.pbf'
  ].forEach((asset) => assert.ok(exists(asset), `real-data demo built asset missing: ${asset}`));
  const highwayManifest = JSON.parse(read('docs/motorcycle/data/fhwa-nhs/2025.08.08/manifest.json'));
  assert.equal(highwayManifest.schemaVersion, 'peercompute.geo.fhwa-nhs-tile-manifest.v1');
  assert.equal(highwayManifest.source.sourceRecordCount, 492005);
  assert.equal(highwayManifest.source.archive.dbfVersion, highwayManifest.version);
  assert.equal(highwayManifest.source.archive.dbfActiveRecords, 492005);
  assert.equal(highwayManifest.source.archive.dbfDeletedRecords, 0);
  assert.equal(highwayManifest.coverage.includesAlaska, true);
  assert.equal(highwayManifest.tileCount, 1028);
  assert.ok(highwayManifest.totalTileBytes < 4 * 1024 * 1024);
  assert.ok(!earthHtml.includes('src="/cesium/'), 'EarthGrid built HTML must keep Cesium paths release-relative');
  assert.ok(!motorcycleHtml.includes('src="/cesium/'), 'RoadVector built HTML must keep Cesium paths release-relative');
  assert.ok(!exists('docs/motorcycle/cesium/node_modules'), 'RoadVector Cesium copy must not preserve hoisted node_modules segments');
  assert.ok(exists('docs/assets/earth.png'));
  assert.ok(exists('docs/assets/motorcycle.png'));
});

test('multiscale release wiring uses fixed port and docs output', () => {
  const rootPackage = JSON.parse(read('package.json'));
  const viteConfig = read('demos/multiscale/vite.config.js');
  const devAll = read('scripts/dev-all.sh');
  const devLocalRelay = read('scripts/dev-local-relay.sh');

  assert.ok(rootPackage.workspaces.includes('demos/multiscale'), 'package workspaces missing multiscale');
  assert.equal(rootPackage.scripts['dev:multiscale'], 'npm --prefix demos/multiscale run dev -- --host');
  assert.equal(rootPackage.scripts['build:multiscale'], 'npm --prefix demos/multiscale run build');
  assert.ok(rootPackage.scripts['build:demos'].includes('npm run build:multiscale'), 'build:demos missing multiscale');
  assert.match(viteConfig, /port:\s*5185/, 'multiscale Vite port changed from 5185');
  assert.ok(viteConfig.includes("path.resolve(docsRoot, 'multiscale')"), 'multiscale build output changed from docs/multiscale');
  assert.ok(devAll.includes('demos/multiscale/public'), 'dev-all missing multiscale public relay config dir');
  assert.ok(devAll.includes('docs/multiscale'), 'dev-all missing docs/multiscale relay config dir');
  assert.ok(devLocalRelay.includes('VITE_MULTISCALE_URL="${demo_base}:5185/"'), 'dev-local-relay missing multiscale overview URL');
  assert.match(devLocalRelay, /demos\/multiscale\\?" run dev/, 'dev-local-relay missing multiscale dev command');
});

test('hyperborea has settings + room UI and room directory wiring', () => {
  const html = read('demos/hyperborea/cb.html');
  assert.ok(html.includes('id="settings-menu"'), 'hyperborea settings menu missing');
  assert.ok(html.includes('id="room-list-items"'), 'hyperborea room list missing');

  const game = read('demos/hyperborea/src/game/Game.js');
  assert.ok(game.includes('RoomDirectory'), 'hyperborea RoomDirectory missing');
  assert.ok(game.includes('switchRoom'), 'hyperborea switchRoom missing');
});

test('sneakywoods has settings + room UI and room directory wiring', () => {
  const html = read('demos/sneakywoods/index.html');
  assert.ok(html.includes('id="settings-menu"'), 'sneakywoods settings menu missing');
  assert.ok(html.includes('id="roomListItems"'), 'sneakywoods room list missing');

  const main = read('demos/sneakywoods/main.js');
  assert.ok(main.includes('buildRoomId'), 'sneakywoods buildRoomId missing');
  assert.ok(main.includes('switchRoom'), 'sneakywoods switchRoom missing');
});

test('cubechat room directory module wired', () => {
  assert.ok(exists('demos/cubechat/src/p2p/roomDirectory.js'), 'cubechat roomDirectory missing');
  const main = read('demos/cubechat/src/main.js');
  assert.ok(main.includes('room-list'), 'cubechat room list UI missing');
  assert.ok(main.includes('switchRoom'), 'cubechat switchRoom missing');
});

test('daddygo has global high score sync', () => {
  const html = read('demos/daddygo/index.html');
  assert.ok(html.includes('id="global-score"'), 'daddygo global score element missing');
  const main = read('demos/daddygo/src/main.js');
  assert.ok(main.includes('NodeKernel'), 'daddygo NodeKernel usage missing');
  assert.ok(main.includes('publishHighScore'), 'daddygo publishHighScore missing');
});

test('planetgen default debug view is off', () => {
  const html = read('demos/planetgen/index.html');
  assert.ok(
    /<option value="off" selected>Off<\/option>/.test(html),
    'planetgen debug default is not off'
  );
});

test('universes generation tokens declared before use', () => {
  const main = read('demos/universes/main.js');
  const tokenIndex = main.indexOf('let universeGenerationToken');
  const fnIndex = main.indexOf('function generateUniverse');
  assert.ok(tokenIndex !== -1, 'universes token declaration missing');
  assert.ok(fnIndex !== -1, 'universes generateUniverse function missing');
  assert.ok(tokenIndex < fnIndex, 'universes token declared after generateUniverse');
});

test('root README includes relay config instructions', () => {
  const readme = read('README.md');
  assert.ok(readme.includes('config/relay.json'), 'README missing relay config section');
  assert.ok(readme.includes('npm run dev'), 'README missing npm run dev instruction');
  assert.ok(readme.includes('Fano Reactor'), 'README missing Fano Reactor mention');
  assert.ok(readme.includes('Schrodinger Materials Console'), 'README missing Schrodinger demo mention');
  assert.ok(readme.includes('Multiscale Ladder'), 'README missing Multiscale Ladder mention');
  assert.ok(readme.includes('EarthGrid'), 'README missing EarthGrid demo/backend documentation');
  assert.ok(readme.includes('RoadVector'), 'README missing RoadVector documentation');
  assert.ok(readme.includes('services/geodata'), 'README missing generic geodata service documentation');
  assert.ok(readme.includes('WebXR toolkit'), 'README missing reusable WebXR toolkit documentation');
  assert.ok(exists('demos/motorcycle/README.md'), 'RoadVector operational README missing');
  assert.ok(readme.includes('scripts/pcserver.sh'), 'README missing pcserver backend instructions');
});

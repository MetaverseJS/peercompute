import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';
import { EarthAgentLayer } from '../src/agents/EarthAgentLayer.js';

class InputHandler {
  actions = new Map();
  setInputAction(action, type) { this.actions.set(type, action); }
  destroy() { this.destroyed = true; this.actions.clear(); }
}
const descriptor = (changes = {}) => ({ key: 'peer:agent', agentId: 'agent', ownerPeerId: 'peer',
  name: 'Ada', color: '#22ff99', position: [-149.9, 61.2, 20], status: 'idle', local: true, ...changes });
function fixture(options = {}) {
  const viewer = { dataSources: new Cesium.DataSourceCollection(), renders: 0, flights: [],
    isDestroyed: () => false,
    scene: { canvas: { clientWidth: 800, clientHeight: 600 },
      globe: { pick: () => undefined, getHeight: () => undefined },
      pick: () => undefined, requestRender() { viewer.renders++; } },
    camera: { getPickRay: (pixel) => ({ pixel }),
      positionCartographic: Cesium.Cartographic.fromDegrees(-149.9, 61.2, 21_000_000),
      positionWC: Cesium.Cartesian3.fromDegrees(-149.9, 61.2, 50),
      directionWC: new Cesium.Cartesian3(0, 0, -1), upWC: new Cesium.Cartesian3(0, 1, 0),
      flyToBoundingSphere: (sphere, settings) => viewer.flights.push({ sphere, settings }) } };
  const layer = new EarthAgentLayer({ Cesium: { ...Cesium, ScreenSpaceEventHandler: InputHandler }, viewer, ...options });
  return { layer, viewer };
}
const value = (property) => property.getValue(Cesium.JulianDate.now());
const near = (left, right, epsilon = 1e-7) => assert(Math.abs(left - right) < epsilon, `${left} differs from ${right}`);

test('lazy agent data source preserves GIS collections; bodies update in place and dispose cleanly', async () => {
  const { layer, viewer } = fixture();
  const gis = new Cesium.CustomDataSource('existing-gis');
  await viewer.dataSources.add(gis);
  assert.equal(layer.getState().count, 0);
  assert.equal(viewer.dataSources.length, 1);
  layer.upsert(descriptor());
  await layer.installation;
  assert.equal(viewer.dataSources.length, 2);
  const entity = layer.source.entities.values[0];
  const coordinates = Cesium.Cartographic.fromCartesian(value(entity.position));
  near(Cesium.Math.toDegrees(coordinates.longitude), -149.9);
  near(coordinates.height, 21.5, 1e-5);
  assert.deepEqual(value(entity.box.dimensions), new Cesium.Cartesian3(2, 2, 3));
  assert.equal(value(entity.point.pixelSize), 12, 'A point remains visible in the globe overview');
  const renders = viewer.renders;
  layer.upsert(descriptor({ status: 'speaking', caption: '<script>text only</script>', position: [-149.8, 61.3, 30] }));
  assert.equal(layer.source.entities.values[0], entity);
  assert.match(value(entity.label.text), /Ada \/\/ SPEAKING\n<script>text only<\/script>/);
  assert(viewer.renders > renders);
  assert.equal(layer.remove('missing'), false);
  assert.equal(layer.remove('peer:agent'), true);
  assert.equal(layer.getState().count, 0);
  await layer.dispose(); await layer.dispose();
  assert.equal(viewer.dataSources.length, 1);
  assert.equal(viewer.dataSources.get(0), gis);
  assert.equal(layer.handler.destroyed, true);
  assert.throws(() => layer.upsert(descriptor()), /closed/);
});

test('spawn uses actual picked terrain or bounded resident height, never orbital camera altitude', async () => {
  const { layer, viewer } = fixture({ sampleHeight: () => 37 });
  let screen;
  viewer.scene.globe.pick = (ray) => { screen = ray.pixel; return Cesium.Cartesian3.fromDegrees(20, 30, 140); };
  let position = layer.getSpawnPosition();
  near(position[0], 20); near(position[1], 30); near(position[2], 140, 1e-5);
  assert.deepEqual(screen, new Cesium.Cartesian2(400, 300));
  viewer.scene.globe.pick = () => undefined;
  position = layer.getSpawnPosition();
  near(position[0], -149.9); near(position[1], 61.2); assert.equal(position[2], 37);
  layer.sampleHeight = () => NaN;
  assert.equal(layer.getSpawnPosition()[2], 0);
  layer.sampleHeight = () => { throw new Error('not resident'); };
  viewer.scene.globe.getHeight = () => 12;
  assert.equal(layer.getSpawnPosition()[2], 12);
  await layer.dispose();
});

test('picking selects only this layer’s actual entity; selection errors do not poison rendering', async () => {
  const selected = [];
  const { layer, viewer } = fixture({ onSelect: (key) => { selected.push(key); throw new Error('conversation unavailable'); } });
  layer.upsert(descriptor()); await layer.installation;
  const click = layer.handler.actions.get(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  viewer.scene.pick = () => ({ id: { id: 'earth-agent:peer:agent' } });
  click({ position: new Cesium.Cartesian2(1, 1) });
  await Promise.resolve(); assert.deepEqual(selected, []);
  viewer.scene.pick = () => ({ id: layer.source.entities.values[0] });
  click({ position: new Cesium.Cartesian2(1, 1) });
  await Promise.resolve(); await Promise.resolve();
  assert.deepEqual(selected, ['peer:agent']);
  layer.upsert(descriptor({ status: 'thinking' }));
  assert.equal(layer.getState().error, null);
  assert.match(layer.getState().selectionError, /conversation unavailable/);
  await layer.dispose();
});

test('focus and audio use the same georeferenced body in metres, with bounded context', async () => {
  const { layer, viewer } = fixture({ getWorldContext: () => ({ terrain: 'aws-terrarium', terrainStatus: 'live' }) });
  layer.upsert(descriptor());
  assert.equal(layer.focus('missing'), false);
  assert.equal(layer.focus('peer:agent'), true);
  assert.equal(viewer.flights[0].settings.offset.range, 30);
  const pose = layer.getAudioPose('peer:agent');
  assert.deepEqual(pose.listener, [0, 0, 0]);
  near(Math.hypot(...pose.source), 28.5, 1e-5);
  assert.deepEqual(pose.forward, [0, 0, -1]);
  assert.deepEqual(layer.getContext(descriptor()), { world: 'EarthGrid', terrain: 'aws-terrarium', terrainStatus: 'live',
    agent: { name: 'Ada', longitude: -149.9, latitude: 61.2, heightMeters: 20 } });
  layer.getWorldContext = () => ({ scene: viewer });
  assert.throws(() => layer.getContext(descriptor()), /bounded|plain|budget/);
  await layer.dispose();
  assert.equal(layer.getAudioPose('peer:agent'), null);
});

test('invalid and excess remote bodies never grow the renderer or accept executable appearance', async () => {
  const { layer } = fixture();
  for (const position of [[0, 91, 0], [181, 0, 0], [0, 0, Infinity], [0, 0, 100001], [0, 0], ['0', 0, 0]]) {
    assert.throws(() => layer.upsert(descriptor({ position })), /position/);
  }
  assert.throws(() => layer.upsert(descriptor({ color: 'url(javascript:bad)' })), /appearance/);
  assert.equal(layer.source, null);
  for (let i = 0; i < 64; i++) layer.upsert(descriptor({ key: `peer:${i}` }));
  assert.throws(() => layer.upsert(descriptor({ key: 'overflow' })), /limit/);
  layer.upsert(descriptor({ key: 'peer:0', status: 'thinking' }));
  assert.equal(layer.getState().count, 64);
  layer.clear(); assert.equal(layer.getState().count, 0);
  await layer.dispose();
});

test('paused bodies and UTF-8 names follow the shared public-agent contract', async () => {
  const { layer } = fixture();
  const name = 'é'.repeat(120);
  layer.upsert(descriptor({ name, status: 'paused' }));
  assert.equal(layer.getState().bodies[0].status, 'paused');
  assert.equal(value(layer.source.entities.values[0].label.text), `${name} // PAUSED`);
  assert.throws(() => layer.upsert(descriptor({ name: name + 'é' })), /appearance/);
  await layer.dispose();
});

test('close during asynchronous datasource installation removes the late source', async () => {
  const { layer, viewer } = fixture();
  let finish;
  const pending = new Promise((resolve) => { finish = resolve; });
  const sources = new Set();
  viewer.dataSources = { add: (source) => pending.then(() => sources.add(source)), remove: (source) => sources.delete(source) };
  layer.upsert(descriptor());
  let closed = false;
  const closing = layer.dispose().then(() => { closed = true; });
  await Promise.resolve(); assert.equal(closed, false);
  finish(); await closing;
  assert.equal(sources.size, 0);
  assert.equal(layer.getState().count, 0);
});

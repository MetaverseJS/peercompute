import assert from 'node:assert/strict';
import test from 'node:test';

import { createNowCoastLayer } from '../src/layers/nowcoast.js';

function capabilities(time) {
  return `<?xml version="1.0"?><WMS_Capabilities><Capability><Layer><Layer>
    <Name>alaska_base_reflectivity_mosaic</Name>
    <Dimension name="time">${time}</Dimension>
  </Layer></Layer></Capability></WMS_Capabilities>`;
}

function harness(time) {
  const providers = [];
  const layers = [];
  class WebMapServiceImageryProvider {
    constructor(options) {
      this.options = options;
      providers.push(this);
    }
  }
  class Credit {
    constructor(text, visible) {
      this.text = text;
      this.visible = visible;
    }
  }
  const imageryLayers = {
    addImageryProvider(provider) {
      const layer = { provider, alpha: 1 };
      layers.push(layer);
      return layer;
    },
    lowerToBottom() {},
    contains(layer) { return layers.includes(layer); },
    remove(layer) {
      const index = layers.indexOf(layer);
      if (index >= 0) layers.splice(index, 1);
    }
  };
  return {
    Cesium: { WebMapServiceImageryProvider, Credit },
    imageryLayers,
    providers,
    layers,
    fetchImpl: async () => new Response(capabilities(time), {
      status: 200,
      headers: { 'content-type': 'application/xml' }
    })
  };
}

test('creates imagery only for a cadence-current nowCOAST frame', async () => {
  const fixture = harness('2026-08-23T11:08:00Z');
  const weather = await createNowCoastLayer(
    fixture.Cesium,
    fixture.imageryLayers,
    'noaa-radar-alaska',
    {
      fetchImpl: fixture.fetchImpl,
      clock: () => Date.parse('2026-08-23T11:20:00Z')
    }
  );
  assert.equal(weather.freshness.status, 'current');
  assert.equal(fixture.providers.length, 1);
  assert.equal(fixture.layers.length, 1);
  weather.destroy();
  assert.equal(fixture.layers.length, 0);
});

test('fails closed without constructing imagery when the advertised frame expired', async () => {
  const fixture = harness('2026-08-23T11:08:00Z');
  await assert.rejects(
    createNowCoastLayer(
      fixture.Cesium,
      fixture.imageryLayers,
      'noaa-radar-alaska',
      {
        fetchImpl: fixture.fetchImpl,
        clock: () => Date.parse('2026-08-23T11:40:00Z')
      }
    ),
    (error) => error?.code === 'ERR_NOWCOAST_FRAME_EXPIRED'
  );
  assert.equal(fixture.providers.length, 0);
  assert.equal(fixture.layers.length, 0);
});

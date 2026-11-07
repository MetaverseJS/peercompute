import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

test('actual Cesium overview marker, near body and native picking work without hardware GPU or network services', { timeout: 90_000 }, async () => {
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  const cacheDir = await mkdtemp(join(tmpdir(), 'peercompute-earth-agents-'));
  let server, browser;
  const errors = [], external = [];
  try {
    server = await createServer({ configFile: false, root: repo, cacheDir, logLevel: 'error',
      optimizeDeps: { noDiscovery: true, entries: [], include: ['cesium'] },
      server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [repo] } },
      plugins: [{ name: 'earth-agent-fixture', configureServer(vite) {
        vite.middlewares.use('/__earth_agents', (_request, response) => {
          response.setHeader('Content-Type', 'text/html');
          response.end(`<!doctype html><link rel="icon" href="data:,">
            <link rel="stylesheet" href="/node_modules/cesium/Build/Cesium/Widgets/widgets.css">
            <style>html,body,#viewer{margin:0;width:100%;height:100%;overflow:hidden}</style>
            <div id="viewer"></div><script>window.CESIUM_BASE_URL='/node_modules/cesium/Build/Cesium/'</script>
            <script type="module" src="/__earth_agent_fixture.js"></script>`);
        });
      }, resolveId(id) { if (id === '/__earth_agent_fixture.js') return '\0earth-agent-fixture'; },
      load(id) { if (id !== '\0earth-agent-fixture') return;
        return `import * as Cesium from 'cesium';
          import { EarthAgentLayer } from '/demos/earth/src/agents/EarthAgentLayer.js';
          window.Cesium=Cesium; window.selected=[];window.frames=0;
          const viewer=window.viewer=new Cesium.Viewer('viewer',{baseLayer:false,baseLayerPicker:false,
            geocoder:false,homeButton:false,sceneModePicker:false,navigationHelpButton:false,
            animation:false,timeline:false,fullscreenButton:false,selectionIndicator:false,infoBox:false,
            terrainProvider:new Cesium.EllipsoidTerrainProvider(),requestRenderMode:true});
          viewer.scene.renderError.addEventListener((_scene,error)=>{window.renderError=String(error)});
          viewer.scene.postRender.addEventListener(()=>{window.frames++});
          viewer.camera.setView({destination:Cesium.Cartesian3.fromDegrees(-20,16,21000000),
            orientation:{heading:0,pitch:-Math.PI/2,roll:0}});
          window.layer=new EarthAgentLayer({Cesium,viewer,onSelect:key=>selected.push(key)});
          window.initialSourceCount=viewer.dataSources.length;
          layer.upsert({key:'owner:agent',agentId:'agent',ownerPeerId:'owner',name:'Earth guide',
            color:'#22ff99',position:[-20,16,0],status:'idle',local:true});
          window.bodyPixel=()=>{const entity=layer.source.entities.values[0];
            return Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene,entity.position.getValue(viewer.clock.currentTime))};
          window.ready=true;`;
      } }] });
    await server.listen();
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
      headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      external.push(new URL(route.request().url()).origin); return route.abort();
    });
    await page.goto(`${origin}/__earth_agents`);
    await page.waitForFunction(() => window.ready && window.frames > 1, null, { timeout: 45_000 });
    assert.equal(await page.evaluate(() => initialSourceCount), 0);
    await page.waitForFunction(() => {
      const pixel = bodyPixel();
      return pixel && viewer.scene.pick(pixel)?.id === layer.source.entities.values[0];
    });
    const overview = await page.evaluate(() => {
      const gl = viewer.scene.canvas.getContext('webgl2');
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      return { pixel: bodyPixel(), sources: viewer.dataSources.length,
        height: viewer.camera.positionCartographic.height,
        renderer: info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : '' };
    });
    assert.match(overview.renderer, /SwiftShader/i, 'This fixture must use software rendering');
    assert.equal(overview.sources, 1);
    assert(overview.height > 20_000_000);
    await page.mouse.click(overview.pixel.x, overview.pixel.y);
    await page.waitForFunction(() => selected.length === 1);
    assert.deepEqual(await page.evaluate(() => selected), ['owner:agent']);
    await page.evaluate(() => layer.focus('owner:agent'));
    await page.waitForFunction(() => viewer.camera.positionCartographic.height < 1000);
    await page.waitForTimeout(900);
    const near = await page.evaluate(() => ({ pixel: bodyPixel(), pose: layer.getAudioPose('owner:agent'),
      count: layer.getState().count, renderError: window.renderError ?? null }));
    assert(near.pixel.x > 0 && near.pixel.x < 800 && near.pixel.y > 0 && near.pixel.y < 600);
    assert(Math.hypot(...near.pose.source) < 100);
    assert.equal(near.renderError, null);
    await page.evaluate(async () => { await layer.dispose(); window.finalSourceCount=viewer.dataSources.length;viewer.destroy(); });
    assert.equal(await page.evaluate(() => finalSourceCount), 0);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
  } finally {
    await browser?.close(); await server?.close(); await rm(cacheDir, { recursive: true, force: true });
  }
});

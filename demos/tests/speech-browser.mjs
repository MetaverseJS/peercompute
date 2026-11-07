import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Explicit hardware acceptance. Sources must be the separately verified cache;
// the browser importer still checks each pinned digest before admitting bytes.
const repo = fileURLToPath(new URL('../../', import.meta.url));
const cache = process.env.SPEECH_CACHE || '/mnt/data2/peercompute-world-speech';
const evidence = process.env.SPEECH_EVIDENCE || path.join(cache, 'acceptance');
const profile = path.join(evidence, 'owned-profile');
const port = Number(process.env.SPEECH_PORT || 5297);
const origin = `https://127.0.0.1:${port}`;
const catalog = JSON.parse(await readFile(path.join(cache, 'catalog.json'), 'utf8'));
await mkdir(evidence, { recursive: true });
const report = { startedAt: new Date().toISOString(), phases: [], errors: [], external: [], cleanup: [] };
let server, context, page, sourceAllowed = true;
const save = () => writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2));
const html = `<!doctype html><html><body><p>Owned managed speech acceptance</p><script type="module">
import { createInferenceRuntime } from '/src/runtime.js';
import { createWorldSpeech } from '/@fs/${repo}/demos/shared/agents/speech/WorldSpeech.js';
window.events=[];
window.runtime=await createInferenceRuntime({storeName:'world-speech-acceptance',residentModelSlots:3,collectGpuEvidence:true});
await runtime.setSharing(false); await runtime.setHostInference(false);
window.speech=createWorldSpeech({runtime,collectGpuEvidence:true,sourceUrl:(entry,file)=>location.origin+'/__speech_source/'+entry.id+'/'+file.path});
window.prepare=()=>speech.prepare({onProgress:event=>{events.push(event); if(events.length>200)events.shift();}});
window.fixture=async()=>{
 const response=await fetch('/__speech_fixture'); const bytes=await response.arrayBuffer();
 const audio=new AudioContext(); try { const decoded=await audio.decodeAudioData(bytes);
 const resampler=new OfflineAudioContext(1,Math.ceil(decoded.duration*16000),16000);
 const source=resampler.createBufferSource();source.buffer=decoded;source.connect(resampler.destination);source.start();
 return new Float32Array((await resampler.startRendering()).getChannelData(0)); } finally {await audio.close();}
};
window.ready=true;
</script></body></html>`;
async function launch() {
  context = await chromium.launchPersistentContext(profile, { executablePath: '/opt/google/chrome/chrome', headless: true,
    ignoreHTTPSErrors: true, args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE',
      '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'] });
  const cdp = await context.browser().newBrowserCDPSession();
  report.gpu = (await cdp.send('SystemInfo.getInfo')).gpu;
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    report.external.push(url.origin + url.pathname); return route.abort();
  });
  page = await context.newPage();
  page.on('pageerror', (error) => report.errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') report.errors.push(message.text().slice(0, 1000)); });
  await page.goto(origin + '/__speech_acceptance');
  await page.waitForFunction(() => window.ready, null, { timeout: 90000 });
}
try {
  server = await createServer({ configFile: path.join(repo, 'demos/inference/vite.config.js'), logLevel: 'error',
    server: { host: '127.0.0.1', port, strictPort: true, hmr: false }, plugins: [{ name: 'speech-acceptance', configureServer(vite) {
      vite.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url, origin);
        if (url.pathname === '/__speech_acceptance') {
          response.setHeader('Content-Type', 'text/html'); response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); response.end(html); return;
        }
        if (url.pathname === '/__speech_fixture') {
          response.setHeader('Content-Type', 'audio/wav'); createReadStream(path.join(cache, 'jfk.wav')).pipe(response); return;
        }
        if (url.pathname.startsWith('/__speech_source/')) {
          if (!sourceAllowed) { response.statusCode = 403; response.end('Sources disabled'); return; }
          const [id, ...parts] = decodeURIComponent(url.pathname.slice('/__speech_source/'.length)).split('/');
          const file = catalog[id]?.files.find((item) => item.path === parts.join('/'));
          if (!file) { response.statusCode = 404; response.end(); return; }
          const local = path.join(cache, 'sources', id, file.path);
          const metadata = await stat(local); assert.equal(metadata.size, file.size);
          response.setHeader('Content-Length', file.size); response.setHeader('Content-Type', 'application/octet-stream');
          createReadStream(local).pipe(response); return;
        }
        next();
      });
    } }] });
  await server.listen(); await launch();
  report.load = await page.evaluate(() => prepare()); await save(); console.log('Speech models loaded', JSON.stringify(report.load));
  sourceAllowed = false;
  report.transcription = await page.evaluate(async () => speech.transcribe({ samples: await fixture(), sampleRate: 16000 }));
  assert.match(report.transcription.text.toLowerCase(), /ask not what your country can do for you/);
  assert(report.transcription.gpuDispatches > 0); console.log('ASR', report.transcription.text); await save();
  report.synthesis = await page.evaluate(async () => {
    const result = await speech.synthesize('Hello. I am your friendly world guide.');
    window.generatedPcm = result;
    const bytes = new Uint8Array(result.audio.buffer);
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((v)=>v.toString(16).padStart(2,'0')).join('');
    let energy=0,peak=0;for(const value of result.audio){energy+=value*value;peak=Math.max(peak,Math.abs(value));}
    return {...result,audio:undefined,samples:result.audio.length,rms:Math.sqrt(energy/result.audio.length),peak,hash};
  });
  assert(report.synthesis.rms > 0.001); assert(report.synthesis.gpuDispatches > 0); await save();
  const pcm = await page.evaluate(() => Array.from(new Uint8Array(generatedPcm.audio.buffer)));
  await writeFile(path.join(evidence, 'generated.f32'), Buffer.from(pcm));
  report.synthesisTranscript = await page.evaluate(async () => {
    const pcm = generatedPcm;
    const offline = new OfflineAudioContext(1, Math.floor(pcm.audio.length * 16000 / pcm.sampleRate), 16000);
    const buffer = offline.createBuffer(1, pcm.audio.length, pcm.sampleRate); buffer.copyToChannel(pcm.audio, 0);
    const source = offline.createBufferSource(); source.buffer = buffer; source.connect(offline.destination); source.start();
    return speech.transcribe({ samples: new Float32Array((await offline.startRendering()).getChannelData(0)), sampleRate: 16000 });
  });
  assert.match(report.synthesisTranscript.text.toLowerCase(), /hello.*friendly world guide/);
  report.cancel = await page.evaluate(async () => {
    const controller=new AbortController(); let started=false;
    try {await speech.synthesize('Please describe the world around me.',{signal:controller.signal,onProgress:event=>{
      if(event.type==='speech-stage'){started=true;controller.abort('Acceptance cancellation');}
    }});return {unexpectedSuccess:true};}catch(error){return {name:error.name,message:error.message,started};}
  });
  assert.equal(report.cancel.name, 'AbortError');
  report.unload = await page.evaluate(async () => { await speech.dispose();return runtime.computeManager.resourceBroker.reportPressure(); });
  assert.equal(report.unload.activeLeaseCount, 0);
  await page.evaluate(() => runtime.dispose()); await context.close(); context = null; await save();
  await launch(); report.restart = await page.evaluate(() => prepare());
  report.restartTranscript = await page.evaluate(async () => speech.transcribe({samples:await fixture(),sampleRate:16000}));
  assert.match(report.restartTranscript.text.toLowerCase(), /ask not what your country can do for you/);
  assert.equal(report.external.length, 0); assert.equal(report.errors.length, 0);
  report.passed = true;
} catch (error) {
  report.failure = { message: error.message, stack: error.stack }; report.passed = false;
  try { report.progress = await page?.evaluate(() => events); } catch {}
  process.exitCode = 1;
} finally {
  try { await page?.evaluate(async () => { await window.speech?.dispose();await window.runtime?.dispose(); }); } catch(error) { report.cleanup.push(error.message); }
  try { await context?.close(); } catch(error) { report.cleanup.push(error.message); }
  try { await server?.close(); } catch(error) { report.cleanup.push(error.message); }
  report.finishedAt = new Date().toISOString(); await save(); console.log(JSON.stringify(report,null,2));
}

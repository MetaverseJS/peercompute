import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const repo = fileURLToPath(new URL('../../', import.meta.url));
const output = process.env.SPEECH_AUDIO_EVIDENCE || '/mnt/data2/peercompute-world-speech/audio-acceptance';
await mkdir(output,{recursive:true});
let server,browser; const report={errors:[],passed:false};
try {
 server=await createServer({configFile:repo+'demos/inference/vite.config.js',logLevel:'error',server:{host:'127.0.0.1',port:5298,strictPort:true,hmr:false},plugins:[{name:'audio-check',configureServer(vite){vite.middlewares.use((req,res,next)=>{
 if(req.url!=='/__audio')return next();res.setHeader('Content-Type','text/html');res.end(`<!doctype html><button id="start">Start</button><script type="module">
 import{createWorldAudio}from'/@fs/${repo}demos/shared/agents/speech/WorldAudio.js';
 window.tracks=[];const media=navigator.mediaDevices;const native=media.getUserMedia.bind(media);media.getUserMedia=async(...args)=>{const s=await native(...args);tracks.push(...s.getTracks());return s};
 window.audio=createWorldAudio({getAudioPose:()=>({source:[2,0,0],listener:[0,0,0]})});
 document.querySelector('button').onclick=()=>audio.startRecording().then(()=>window.recording=true).catch(e=>window.error=e.message);window.ready=true;
 </script>`);
 });}}]});await server.listen();
 browser=await chromium.launch({executablePath:'/opt/google/chrome/chrome',headless:true,args:['--disable-gpu','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--use-file-for-fake-audio-capture=/mnt/data2/peercompute-world-speech/jfk.wav']});
 const page=await browser.newPage({ignoreHTTPSErrors:true});page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto('https://127.0.0.1:5298/__audio');await page.waitForFunction(()=>window.ready);await page.click('#start');await page.waitForFunction(()=>window.recording||window.error);
 assert.equal(await page.evaluate(()=>window.error),undefined);await page.waitForTimeout(1500);
 report.capture=await page.evaluate(async()=>{const a=await audio.stopRecording(),b=await audio.stopRecording();let energy=0;for(const v of a.samples)energy+=v*v;window.captured=a;return{samples:a.samples.length,sampleRate:a.sampleRate,rms:Math.sqrt(energy/a.samples.length),same:a===b,trackStates:tracks.map(t=>t.readyState)}});
 assert.equal(report.capture.sampleRate,16000);assert(report.capture.samples>=16000);assert(report.capture.rms>0.001);assert(report.capture.same);assert(report.capture.trackStates.every(s=>s==='ended'));
 report.playback=await page.evaluate(async()=>{await audio.play({audio:captured.samples.slice(0,1600),sampleRate:16000},{key:'owned-agent'});await audio.startRecording();await audio.cancelRecording();await audio.dispose();return{completed:true,trackStates:tracks.map(t=>t.readyState)}});
 assert(report.playback.trackStates.every(s=>s==='ended'));assert.equal(report.errors.length,0);report.passed=true;
}catch(error){report.failure={message:error.message,stack:error.stack};process.exitCode=1;}
finally{await browser?.close();await server?.close();await writeFile(output+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}

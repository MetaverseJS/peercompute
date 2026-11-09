import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import path from 'node:path';
import { build } from 'vite';
import { chromium } from 'playwright';

// Production modules, actual managed WebGPU and Cannon contacts. The fixed
// layouts below are browser acceptance cases, not training samples or a teacher.
// node demos/tests/world-navigation-browser.mjs
// Optional real command qualification: NAVIGATION_PHASE=model,
// NAVIGATION_MODEL_ORIGIN=https://owned-preview:5196 and NAVIGATION_MODEL_PROFILE=/explicit/owned-profile.
const phase=process.env.NAVIGATION_PHASE??'physics';assert(['physics','model','all'].includes(phase),'Invalid navigation acceptance phase');
const repo=fileURLToPath(new URL('../../',import.meta.url));
const evidence=process.env.NAVIGATION_EVIDENCE??path.join(process.env.XDG_CACHE_HOME??path.join(homedir(),'.cache'),'peercompute-resident-navigation','browser');
const fixture=path.join(evidence,'fixture'),built=path.join(evidence,'built');
const report={startedAt:new Date().toISOString(),scope:'Owned production fixture, actual managed WebGPU navigation and Cannon physics; no language model, network peers or model download in this phase.',
  pageErrors:[],consoleErrors:[],external:[],cases:[],screenshots:[],cleanupErrors:[]};
const layouts=[
  {id:'wall-end',start:[-30,0],target:[30,0],stopDistance:10,seconds:60,obstacles:[{min:[-2,-14],max:[2,14]}]},
  {id:'offset-doorway',start:[-30,14],target:[30,0],stopDistance:10,seconds:60,doorway:true,
    obstacles:[{min:[-2,-30],max:[2,-8]},{min:[-2,8],max:[2,30]}]},
  {id:'follow-doorway',start:[-30,14],target:[30,0],stopDistance:10,seconds:75,follow:true,doorway:true,
    obstacles:[{min:[-2,-30],max:[2,-8]},{min:[-2,8],max:[2,30]}]},
  {id:'near-through-wall',start:[-5,0],target:[5,0],stopDistance:10,seconds:2,probeOnly:true,
    obstacles:[{min:[-1,-22],max:[1,22]}]},
  {id:'enclosed-unreachable',start:[0,0],target:[40,0],stopDistance:10,seconds:125,unreachable:true,
    obstacles:[{min:[-12,-12],max:[-10,12]},{min:[10,-12],max:[12,12]},{min:[-10,-12],max:[10,-10]},{min:[-10,10],max:[10,12]}]}
];
const importPath=relative=>JSON.stringify(path.join(repo,relative));
const save=()=>writeFile(path.join(evidence,'report.json'),JSON.stringify(report,null,2)+'\n');
const chromeArgs=['--enable-gpu','--enable-unsafe-webgpu','--enable-features=Vulkan,VulkanFromANGLE','--use-angle=vulkan','--use-vulkan=native','--disable-vulkan-surface'];
let browser,server,page;
await mkdir(fixture,{recursive:true});
await writeFile(path.join(fixture,'index.html'),'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>Owned learned navigation acceptance</title><style>body{margin:0;background:#071722;color:#c6f7ff;font:14px monospace}canvas{display:block}#evidence{position:fixed;top:12px;left:12px;max-width:calc(100vw - 48px);padding:10px;background:#071722dc;border:1px solid #4aa8bb}</style><div id="evidence">Owned navigation acceptance</div><script type="module" src="./main.js"></script>');
await writeFile(path.join(fixture,'main.js'),`
import * as THREE from ${importPath('node_modules/three/build/three.module.js')};
import * as CANNON from ${importPath('node_modules/cannon-es/dist/cannon-es.js')};
import {ComputeManager} from ${importPath('peercompute/src/peercompute/computeManager/ComputeManager.js')};
import {createResidentMotorService} from ${importPath('demos/shared/agents/motor/ResidentMotorService.js')};
import {referenceMotorAction} from ${importPath('demos/shared/agents/motor/policyReference.js')};
import checkpoint from ${importPath('demos/shared/agents/motor/residentMotorCheckpoint.js')};
import {sampleNavigationSensors} from ${importPath('demos/shared/agents/motor/navigationSensors.js')};
import {CubeAgentLayer} from ${importPath('demos/cubechat/src/agents/CubeAgentLayer.js')};
import {PhysicsWorld} from ${importPath('demos/cubechat/src/physics/world.js')};
import {createCubeWorldUi} from ${importPath('demos/cubechat/src/ui/CubeWorldUi.js')};
const manager=new ComputeManager({requireWorkers:true,enableWorkers:true,enableWebGPU:true,minWorkers:1,targetWorkers:1,maxWorkers:2,autoScaleWorkers:false,workerBootstrapTimeoutMs:60000});
const service=createResidentMotorService({computeManager:manager});
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,1000),renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(innerWidth,innerHeight);document.body.append(renderer.domElement);scene.background=new THREE.Color('#071722');scene.add(new THREE.HemisphereLight(0xbaffff,0x303040,3));
const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0x143a35,roughness:1}));floor.rotation.x=-Math.PI/2;scene.add(floor);scene.add(new THREE.GridHelper(200,40,0x469f87,0x204b42));
const physics=new PhysicsWorld(),visitor=new THREE.Mesh(new THREE.BoxGeometry(6,6,6),new THREE.MeshStandardMaterial({color:0xffb64f}));scene.add(visitor);
const target={id:'human:owned-target',kind:'human',peerId:'owned-target',name:'Owned visitor',position:[30,3,0],velocity:[0,0,0]};let participants=[target];
const targetBody=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(3,3,3)),position:new CANNON.Vec3(30,3,0)});physics.world.addBody(targetBody);physics.bodies.set(target.peerId,targetBody);
const shell={scene,camera,floor,renderer,players:new Map([[target.peerId,visitor]]),worldThemeId:'owned-test',getGroundHeight:()=>0};
const layer=new CubeAgentLayer({scene:shell,physics,getPlayerPosition:()=>target.position,getParticipants:()=>participants});
const descriptor={key:'local:owned-body',agentId:'owned-body',ownerPeerId:'owned-target',name:'Navigation resident',position:[-30,3,0],local:true,shared:true,color:'#8fffd4',status:'idle',movement:'stationary'};
layer.upsert(descriptor);layer.setMotor(service);
const ui=createCubeWorldUi({onMovement:({key,mode})=>layer.setMovement(key,mode)});ui.setAgents([descriptor]);
const outcomes=[],colliders=[],wallMeshes=[];layer.subscribeOutcomes(event=>outcomes.push(event));
let trace,layout;
const render=()=>{visitor.position.fromArray(target.position);camera.position.set(-46,65,65);camera.lookAt(0,0,0);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.render(scene,camera);ui.setNavigationStatus(descriptor.key,layer.getResidentMotorStatus(descriptor.key));};
const reset=next=>{
 layout=next;for(const collider of colliders)physics.world.removeBody(collider);colliders.length=0;
 for(const mesh of wallMeshes){scene.remove(mesh);mesh.geometry.dispose();mesh.material.dispose();}wallMeshes.length=0;
 if(trace){scene.remove(trace);trace.geometry.dispose();trace.material.dispose();trace=null;}
 layer.remove(descriptor.key);descriptor.position=[next.start[0],3,next.start[1]];layer.upsert(descriptor);participants=[target];
 target.position=[next.target[0],3,next.target[1]];target.velocity=[0,0,0];targetBody.position.set(...target.position);targetBody.aabbNeedsUpdate=true;
 for(const box of next.obstacles){const half=box.max.map((value,i)=>(value-box.min[i])/2),center=box.max.map((value,i)=>(value+box.min[i])/2);
  const collider=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(half[0],6,half[1])),position:new CANNON.Vec3(center[0],3,center[1])});physics.world.addBody(collider);colliders.push(collider);
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(half[0]*2,12,half[1]*2),new THREE.MeshStandardMaterial({color:0x8b4c43}));mesh.position.set(center[0],3,center[1]);scene.add(mesh);wallMeshes.push(mesh);
 }outcomes.length=0;render();
};
let deliverySequence=0,deliveryJob=null;const deliverySamples=[];
// Keep the genuine worker promise/output, but simulate the 1–3 substeps a real
// render frame can execute before asynchronous GPU delivery is consumed.
const step=async()=>{
 physics.world.step(1/60);layer.afterPhysics(1/60);const pending=layer.motor.pending;if(!pending)return;
 if(deliveryJob?.job!==pending)deliveryJob={job:pending,substeps:0,after:1+(deliverySequence++%3),at:performance.now()};
 const delivery=deliveryJob;delivery.substeps++;
 if(delivery.substeps>=delivery.after){await pending.done;deliverySamples.push({substeps:delivery.substeps,wallMilliseconds:performance.now()-delivery.at});if(deliveryJob===delivery)deliveryJob=null;}
};
window.initialize=async()=>{
 if(checkpoint.schema!=='peercompute.resident-motor.v2')throw Error('Navigation acceptance requires the trained v2 checkpoint');
 await manager.initialize();const observations=[];
 for(const test of ${JSON.stringify(layouts.slice(0,3))})for(const offset of [0,3,7]){
  const position=[test.start[0]+offset,test.start[1]-offset/2],sensors=sampleNavigationSensors({position,targetPosition:test.target,obstacles:test.obstacles});
  observations.push({relativePosition:test.target.map((v,i)=>v-position[i]),velocity:[.3,-.2],targetVelocity:[0,.1],stopDistance:test.stopDistance,previousAcceleration:[.2,-.1],...sensors});
 }
 const result=await service.infer(observations.map((observation,i)=>({id:'parity-'+i,observation})));let maximumError=0;
 result.results.forEach((value,i)=>{const expected=referenceMotorAction(checkpoint.weights,observations[i]);maximumError=Math.max(maximumError,...value.acceleration.map((v,j)=>Math.abs(v-expected[j])));});
 return {schema:checkpoint.schema,policyId:checkpoint.policyId,maximumError,worker:result.worker,backend:result.backend,batches:observations.length,status:service.getStatus()};
};
window.runCase=async next=>{
 if(layer.motor.pending)await layer.motor.pending.done;
 reset(next);const requestId='navigation-'+next.id;layer.setIntent(descriptor.key,{type:next.follow?'follow':'approach',targetId:target.id,stopDistance:next.stopDistance,requestId});
 const points=[],history=[];let maximumPenetration=0,collisionSteps=0,stuckSteps=0,doorCrossings=[],previous=[...next.start],maximumSpeed=0;
 const started=performance.now(),firstDelivery=deliverySamples.length;let ticks=0,settled=0;
 for(;ticks<next.seconds*60;ticks++){
  if(next.follow&&ticks>=25*60){target.velocity=[0,0,.45];target.position[2]+=.45/60;targetBody.position.set(...target.position);targetBody.aabbNeedsUpdate=true;}
  await step();const entry=layer.entries.get(descriptor.key),body=entry.body,p=[body.position.x,body.position.z],status=layer.getResidentMotorStatus(descriptor.key);
  maximumSpeed=Math.max(maximumSpeed,Math.hypot(body.velocity.x,body.velocity.z));
  if(![...p,...body.velocity.toArray()].every(Number.isFinite))throw Error('Nonfinite navigation body');
  if(physics.world.contacts.some(contact=>(contact.bi===body&&colliders.includes(contact.bj))||(contact.bj===body&&colliders.includes(contact.bi))))collisionSteps++;
  for(const box of next.obstacles){const x=Math.min(p[0]+3-box.min[0],box.max[0]-(p[0]-3)),z=Math.min(p[1]+3-box.min[1],box.max[1]-(p[1]-3));if(x>0&&z>0)maximumPenetration=Math.max(maximumPenetration,Math.min(x,z));}
  if(previous[0]<0&&p[0]>=0)doorCrossings.push(p[1]);previous=p;
  if(Math.hypot(body.velocity.x,body.velocity.z)<.2&&status.distance>next.stopDistance+2)stuckSteps++;
  if(ticks%6===0)points.push([p[0],3.2,p[1]]);
  if(ticks%60===0){history.push({...status,atSeconds:ticks/60});render();}
  if(status.status==='arrived'&&(!next.follow||ticks>next.seconds*60-120))settled++;else settled=0;
  if(next.unreachable&&status.status==='blocked')break;
  if(!next.follow&&!next.probeOnly&&!next.unreachable&&settled>=45)break;
 }
 trace=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),new THREE.LineBasicMaterial({color:0xfff38b}));scene.add(trace);
 const status=layer.getResidentMotorStatus(descriptor.key);document.querySelector('#evidence').textContent=next.id+' · '+status.status+' · '+(ticks/60).toFixed(1)+' simulated seconds';render();
 const deliveries=deliverySamples.slice(firstDelivery),latency={count:deliveries.length,substeps:Object.fromEntries([1,2,3].map(value=>[value,deliveries.filter(item=>item.substeps===value).length])),
  maximumSubsteps:Math.max(0,...deliveries.map(item=>item.substeps)),meanWallMilliseconds:deliveries.reduce((sum,item)=>sum+item.wallMilliseconds,0)/Math.max(1,deliveries.length),maximumWallMilliseconds:Math.max(0,...deliveries.map(item=>item.wallMilliseconds))};
 return {id:next.id,status,outcomes:[...outcomes],position:layer.getPosition(descriptor.key),target:[...target.position],ticks,elapsedSeconds:ticks/60,wallMilliseconds:performance.now()-started,latency,
  collisionSeconds:collisionSteps/60,stuckSeconds:stuckSteps/60,maximumPenetration,maximumSpeed,doorCrossings,history,points,service:service.getStatus()};
};
window.lifecycle=async()=>{
 if(layer.motor.pending)await layer.motor.pending.done;
 reset({id:'lifecycle',start:[-30,0],target:[30,0],obstacles:[],stopDistance:10});
 layer.setIntent(descriptor.key,{type:'follow',targetId:target.id,requestId:'lifecycle-follow'});for(let i=0;i<120;i++)await step();
 const beforePause=layer.getPosition(descriptor.key);layer.upsert({...descriptor,position:beforePause,status:'paused'});for(let i=0;i<30;i++)await step();const paused={status:layer.getResidentMotorStatus(descriptor.key),velocity:layer.entries.get(descriptor.key).body.velocity.toArray(),before:beforePause,position:layer.getPosition(descriptor.key)};
 layer.upsert({...descriptor,position:layer.getPosition(descriptor.key),status:'idle'});participants=[];for(let i=0;i<30;i++)await step();const lost={status:layer.getResidentMotorStatus(descriptor.key),velocity:layer.entries.get(descriptor.key).body.velocity.toArray()};
 participants=[target];layer.setIntent(descriptor.key,{type:'follow',targetId:target.id});for(let i=0;i<120;i++)await step();
 layer.setIntent(descriptor.key,{type:'stop'});for(let i=0;i<30;i++)await step();const stopped={status:layer.getResidentMotorStatus(descriptor.key),velocity:layer.entries.get(descriptor.key).body.velocity.toArray()};
 return {paused,lost,stopped,outcomes:[...outcomes]};
};
window.showInspector=()=>{ui.openResidents();ui.setNavigationStatus(descriptor.key,layer.getResidentMotorStatus(descriptor.key));};
window.render=render;
window.closeOwned=async()=>{ui.dispose();layer.dispose();await service.dispose();const reservations=manager.residentWorkerAffinities.size;await manager.destroy();renderer.dispose();return{reservations,layerClosed:layer.closed,bodies:layer.entries.size};};
render();
`);
try {
 if(phase!=='model'){
  const gpu=await promisify(execFile)('nvidia-smi',['--query-gpu=name,memory.free,memory.total','--format=csv,noheader,nounits']);
  report.gpuBefore=gpu.stdout.trim();assert(report.gpuBefore.split('\n').some(line=>Number(line.split(',')[1])>=512),'At least 512 MiB free GPU memory is required');
  const workerModules=new Set();
  const bundles=await build({configFile:false,root:fixture,base:'./',logLevel:'warn',worker:{format:'es',plugins:()=>[{
    name:'record-navigation-worker-modules',generateBundle(_options,bundle){for(const chunk of Object.values(bundle))for(const name of Object.keys(chunk.modules??{}))workerModules.add(name);}
  }]},build:{outDir:built,emptyOutDir:true,assetsInlineLimit:0,rollupOptions:{input:path.join(fixture,'index.html')}}});
  const modules=[...new Set([...workerModules,...(Array.isArray(bundles)?bundles:[bundles]).flatMap(bundle=>bundle.output??[]).flatMap(chunk=>Object.keys(chunk.modules??{}))])];
  report.bundle={moduleCount:modules.length,teacherModules:modules.filter(name=>name.includes('navigationTrainingEnvironment')||name.includes('/scripts/train-')),
    checkpoint:modules.some(name=>name.endsWith('/residentMotorCheckpoint.js')),referenceForParity:modules.some(name=>name.endsWith('/policyReference.js'))};
  assert.deepEqual(report.bundle.teacherModules,[],'Offline geometry teacher is absent from the browser acceptance bundle');assert(report.bundle.checkpoint);
  server=createServer(async(req,res)=>{try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(built,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(built+path.sep))throw Error('Invalid fixture path');
    res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.wasm')?'application/wasm':file.endsWith('.css')?'text/css':'text/html');res.end(await readFile(file));
  }catch{res.statusCode=404;res.end('Not found');}});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/opt/google/chrome/chrome',headless:true,args:chromeArgs});
  const cdp=await browser.newBrowserCDPSession();report.gpu=(await cdp.send('SystemInfo.getInfo')).gpu;
  assert.match(report.gpu.auxAttributes.glRenderer,/NVIDIA|AMD|Intel/);
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route('**/*',route=>{if(new URL(route.request().url()).origin===origin)return route.continue();report.external.push(route.request().url());return route.abort();});
  page=await context.newPage();page.on('pageerror',error=>report.pageErrors.push(error.message));page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});
  await page.goto(origin);await page.waitForFunction(()=>typeof window.initialize==='function');report.parity=await page.evaluate(()=>initialize());
  assert.equal(report.parity.backend,'webgpu');assert.equal(report.parity.worker,true);assert(report.parity.maximumError<.002,JSON.stringify(report.parity));await save();
  for(const layout of layouts){
    console.log('Navigation case',layout.id);const result=await page.evaluate(layout=>runCase(layout),layout);report.cases.push(result);await save();
    assert(result.maximumPenetration<.35,layout.id+' collider penetration');
    assert(result.maximumSpeed<5.3,layout.id+' bounded speed');
    assert(result.latency.count>0&&result.latency.maximumSubsteps<=3,layout.id+' bounded real-output delivery lag');
    assert(Object.values(result.latency.substeps).every(count=>count>0),layout.id+' exercised 1–3 simulated substep delivery lag');
    assert(Number.isFinite(result.latency.meanWallMilliseconds)&&result.latency.meanWallMilliseconds>=0);
    if(layout.probeOnly)assert(!result.outcomes.some(event=>event.status==='arrived'),'Nearness through a wall is not arrival');
    else if(layout.unreachable){assert.equal(result.status.status,'blocked');assert(!result.outcomes.some(event=>event.status==='arrived'));assert(result.elapsedSeconds<=125);}
    else{assert.equal(result.status.status,'arrived',JSON.stringify({id:layout.id,status:result.status}));assert.equal(result.status.progress.targetClear,true);assert(Math.abs(result.status.distance-layout.stopDistance)<1.6);assert(result.status.progress.distanceTravelled>5);}
    if(layout.doorway)assert(result.doorCrossings.some(z=>Math.abs(z)<5),'The body physically crossed the doorway opening');
    assert.equal(result.status.backend,'webgpu');assert.equal(result.status.worker,true);assert(result.service.dispatches>0);
    const screenshot=path.join(evidence,layout.id+'-desktop.png');await page.screenshot({path:screenshot,fullPage:true});report.screenshots.push(screenshot);
  }
  await page.evaluate(()=>showInspector());await page.getByLabel('Movement details for Navigation resident',{exact:true}).click();
  const desktop=path.join(evidence,'desktop-blocked-inspector.png');await page.screenshot({path:desktop,fullPage:true});report.screenshots.push(desktop);
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>render());
  const dialog=page.getByRole('dialog',{name:'Residents',exact:true});report.mobileBounds=await dialog.evaluate(element=>{const rect=element.getBoundingClientRect();return{x:rect.x,y:rect.y,width:rect.width,height:rect.height,w:innerWidth,h:innerHeight,scrollWidth:document.documentElement.scrollWidth};});
  assert(report.mobileBounds.x>=0&&report.mobileBounds.x+report.mobileBounds.width<=390&&report.mobileBounds.scrollWidth<=390);
  const mobile=path.join(evidence,'mobile-blocked-inspector.png');await page.screenshot({path:mobile,fullPage:true});report.screenshots.push(mobile);
  report.lifecycle=await page.evaluate(()=>lifecycle());
  for(const [key,state] of Object.entries(report.lifecycle).filter(([key])=>key!=='outcomes')){assert.deepEqual(state.velocity,[0,0,0],key);assert.equal(state.status.status,key==='lost'?'target-lost':key);}
  assert(Math.hypot(...report.lifecycle.paused.position.map((value,index)=>value-report.lifecycle.paused.before[index]))<.01,'Pause holds the existing physical pose');
  assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.external,[]);
  }
  if(phase!=='physics'){
    if(page&&!page.isClosed())report.cleanup=await page.evaluate(()=>window.closeOwned?.());
    await browser?.close();browser=null;page=null;if(server)await new Promise(resolve=>server.close(resolve));server=null;
    await actualModelCommands();assert.deepEqual(report.actual.cleanupErrors,[]);assert.deepEqual(report.actual.consoleErrors,[]);
  }
  report.passed=true;
}catch(error){report.passed=false;report.error=error.stack;process.exitCode=1;}
finally{
  if(page&&!page.isClosed())try{report.cleanup=await page.evaluate(()=>window.closeOwned?.());}catch(error){report.cleanupErrors.push(error.message);}
  await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));
  if(report.cleanupErrors.length||(report.cleanup&&(report.cleanup.reservations!==0||report.cleanup.bodies!==0))){report.passed=false;process.exitCode=1;}
  report.finishedAt=new Date().toISOString();await save();console.log(JSON.stringify({passed:report.passed,evidence,error:report.error,cases:report.cases.map(item=>({id:item.id,status:item.status.status}))},null,2));
}

async function actualModelCommands(){
  const origin=process.env.NAVIGATION_MODEL_ORIGIN,profile=process.env.NAVIGATION_MODEL_PROFILE;
  assert(origin&&new URL(origin).protocol==='https:','Explicit secure owned production preview is required');
  assert(profile&&path.isAbsolute(profile)&&/owned[^/]*profile/.test(profile),'Use an explicitly owned cached browser profile');
  const gpu=await promisify(execFile)('nvidia-smi',['--query-gpu=name,memory.free,memory.total','--format=csv,noheader,nounits']);
  assert(gpu.stdout.trim().split('\n').some(line=>Number(line.split(',')[1])>=2048),'At least 2 GiB GPU memory is required before the cached Qwen probe');
  const actual=report.actual={scope:'Actual cached Qwen private commands through the production host, managed WebGPU navigation, Cannon wall, and owner stop. No language facade, HF downloads, user profiles or public room.',
    gpuBefore:gpu.stdout.trim(),profile,room:'codex-navigation-model-'+Date.now(),pageErrors:[],consoleErrors:[],httpErrors:[],blockedDownloads:[],commands:[],cleanupErrors:[]};
  const expectedCheckpoint=(await import('../shared/agents/motor/residentMotorCheckpoint.js')).default;
  assert.equal(expectedCheckpoint.schema,'peercompute.resident-motor.v2','Actual model qualification needs the newly trained navigation checkpoint');
  actual.expectedPolicyId=expectedCheckpoint.policyId;
  const context=await chromium.launchPersistentContext(profile,{executablePath:process.env.CHROME_PATH??'/opt/google/chrome/chrome',headless:true,viewport:{width:1440,height:1000},args:[...chromeArgs,'--enable-dawn-features=vulkan_enable_f16_on_nvidia']});
  let modelPage;
  try{
    await context.addInitScript(()=>{if(navigator.mediaDevices)Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:async()=>{throw new DOMException('Owned text-only navigation check','NotAllowedError');}});});
    await context.route('**/*',route=>{const host=new URL(route.request().url()).hostname;if(host==='huggingface.co'||host.endsWith('.hf.co')){actual.blockedDownloads.push(host);return route.abort();}return route.continue();});
    modelPage=await context.newPage();modelPage.setDefaultTimeout(20000);
    const cdp=await context.newCDPSession(modelPage);
    await cdp.send('Network.setBypassServiceWorker',{bypass:true});await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    modelPage.on('pageerror',error=>actual.pageErrors.push(error.message));modelPage.on('console',message=>{if(message.type()==='error')actual.consoleErrors.push(message.text().slice(0,1000));});
    modelPage.on('response',response=>{if(response.status()>=400&&response.url().startsWith(origin))actual.httpErrors.push({status:response.status(),url:new URL(response.url()).pathname});});
    assert.equal((await modelPage.goto(origin+'/?e2e=1&room='+encodeURIComponent(actual.room),{waitUntil:'domcontentloaded',timeout:60000})).status(),200);
    await modelPage.waitForFunction(()=>window.__cubechat?.worldAgents&&__cubechat.roomChat?.started,null,{timeout:90000});await modelPage.evaluate(()=>__cubechat.worldAgents.ready);
    actual.application=await modelPage.evaluate(()=>({navigationApi:typeof __cubechat.agentLayer.getResidentMotorStatus==='function',motor:__cubechat.agentLayer.getMotorStatus(),scripts:[...document.scripts].map(script=>script.src).filter(Boolean)}));
    assert.equal(actual.application.navigationApi,true,'The loaded production app exposes the new resident navigation API');
    if(await modelPage.locator('#loading').isVisible())await modelPage.locator('#loading').click();
    for(let i=0;i<5&&await modelPage.locator('dialog[open]').count();i++)await modelPage.keyboard.press('Escape');
    actual.model=await modelPage.evaluate(async()=>{const runtime=__cubechat.worldAgents.runtime;await runtime.setSharing(false);await runtime.setHostInference(false);await runtime.checkDeviceCapabilities();
      const saved=(await runtime.listStoredModels()).find(item=>item.modelId==='qwen3.5-0.8b-q4-k-m-gguf');if(!saved)throw Error('Qwen0.8B is not cached at this owned origin');
      await runtime.loadStoredModel(saved.manifestCid,{signal:AbortSignal.timeout(180000)});return{saved,status:runtime.getServiceForModel(saved.manifestCid).getStatus()};});
    assert(actual.model.status.evidence?.gpuOffload?.gpuLayers>0);await save();
    actual.setup=await modelPage.evaluate(async()=>{
      const app=__cubechat,runtime=app.worldAgents.runtime,generate=runtime.generate.bind(runtime);
      const state=window.__navigationModel={calls:[],outcomes:[],samples:[],walls:[]};
      runtime.generate=async(key,input)=>{if(!key.startsWith('local:'))throw Error('Owned navigation probe refuses peer inference');
        const call={key,prompt:input.prompt,messages:input.messages,worldContext:input.worldContext,startedAt:Date.now()};state.calls.push(call);
        try{const result=await generate(key,input);call.result=result;call.finishedAt=Date.now();return result;}catch(error){call.error=error.message;throw error;}};
      const human=app.physics.getPlayerBody(app.network.localPlayer.id);human.position.set(28,3,0);human.velocity.set(0,0,0);
      const head=await app.worldAgents.spawn({name:'Navigation command resident',goals:['Help the nearby visitor using supported movement intentions.'],localOnly:true,shared:false,initiateConversations:false,respondToWorldChat:false,movement:'stationary'});
      const body=app.worldAgents.getStatus().bodies.find(item=>item.agentId===head.agentId),entry=app.agentLayer.entries.get(body.key);app.agentLayer.place(entry,[-28,3,0]);
      const Body=entry.body.constructor,Vec=entry.body.position.constructor,Box=entry.body.shapes[0].constructor;
      const collider=new Body({type:Body.STATIC,shape:new Box(new Vec(2,6,12)),position:new Vec(0,3,0)});app.physics.world.addBody(collider);
      const visual=entry.mesh.clone(false);visual.material=Array.isArray(entry.mesh.material)?entry.mesh.material.map(material=>material.clone()):entry.mesh.material.clone();
      for(const material of Array.isArray(visual.material)?visual.material:[visual.material])material.color?.set('#8b4c43');visual.position.set(0,3,0);visual.scale.set(4/6,12/6,24/6);app.scene.scene.add(visual);state.walls.push({collider,visual});
      state.unsubscribe=app.agentLayer.subscribeOutcomes(event=>{state.outcomes.push(event);if(state.outcomes.length>100)state.outcomes.shift();});
      state.timer=setInterval(()=>{const entry=app.agentLayer.entries.get(body.key);if(!entry)return;const p=entry.body.position;
        const x=Math.min(p.x+3-(-2),2-(p.x-3)),z=Math.min(p.z+3-(-12),12-(p.z-3));
        state.samples.push({at:Date.now(),position:[p.x,p.y,p.z],penetration:x>0&&z>0?Math.min(x,z):0,status:app.agentLayer.getResidentMotorStatus(body.key)});if(state.samples.length>700)state.samples.shift();},200);
      const peerId=app.network.node.getNetworkManager().getLibp2pNode().peerId.toString();
      return{head,body,observed:app.agentLayer.observe(body.key,{requesterPeerId:peerId})};
    });
    const body=actual.setup.body;
    for(const [kind,text]of[['approach','Come closer to me, then stop nearby.'],['follow','Follow me as I move, keeping a little distance.']]){
      const command={kind,text};actual.commands.push(command);
      const prompt=modelPage.getByRole('textbox',{name:'World message',exact:true});
      if(!await prompt.isVisible()){await modelPage.locator('#scene-container canvas').focus();await modelPage.keyboard.press('Enter');}
      await modelPage.getByRole('combobox',{name:'Chat with',exact:true}).selectOption(body.key);
      await modelPage.waitForFunction(()=>!document.querySelector('textarea[aria-label="World message"]').disabled);
      const index=await modelPage.evaluate(()=>__navigationModel.calls.length);await prompt.fill(text);await prompt.press('Enter');
      await modelPage.waitForFunction(index=>__navigationModel.calls[index]?.result||__navigationModel.calls[index]?.error,index,{timeout:180000});
      command.call=await modelPage.evaluate(index=>__navigationModel.calls[index],index);assert(!command.call.error,command.call.error);
      const raw=command.call.result.text.trim(),fenced=raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);command.parsed=JSON.parse(fenced?fenced[1]:raw);
      assert.equal(command.parsed.intent?.type,kind,'Actual model chose the requested supported movement intention');
      assert.equal(command.parsed.intent.targetId,actual.setup.observed.requesterId);await save();
      if(kind==='approach'){
        await modelPage.waitForFunction(key=>['arrived','blocked','failed'].includes(__cubechat.agentLayer.getResidentMotorStatus(key)?.status),body.key,{timeout:135000});
        command.status=await modelPage.evaluate(key=>__cubechat.agentLayer.getResidentMotorStatus(key),body.key);assert.equal(command.status.status,'arrived');assert.equal(command.status.progress.targetClear,true);
      }else{
        command.before=await modelPage.evaluate(key=>__cubechat.agentLayer.getPosition(key),body.key);
        await modelPage.evaluate(()=>new Promise(resolve=>{let ticks=0;const app=__cubechat,human=app.physics.getPlayerBody(app.network.localPlayer.id),timer=setInterval(()=>{
          ticks++;human.position.set(28+ticks*.08,3,ticks*.18);human.velocity.set(.4,0,.9);human.previousPosition.copy(human.position);human.interpolatedPosition.copy(human.position);if(ticks>=60){clearInterval(timer);human.velocity.set(0,0,0);resolve();}},200);}));
        await modelPage.waitForTimeout(4000);command.after=await modelPage.evaluate(key=>({position:__cubechat.agentLayer.getPosition(key),status:__cubechat.agentLayer.getResidentMotorStatus(key)}),body.key);
        assert(Math.hypot(command.after.position[0]-command.before[0],command.after.position[2]-command.before[2])>3,'Real follow controller moved with the visitor');
        assert(command.after.status.distance<command.after.status.stopDistance+5);assert.equal(command.after.status.progress.targetClear,true);
      }
    }
    actual.result=await modelPage.evaluate(async({key,id})=>{const app=__cubechat,runtime=app.worldAgents.runtime,agents=await runtime.getAgentController(),store=runtime.stateManager.getWorldMemoryStore((agents.store.name+'-episodes').slice(0,80));
      return{calls:__navigationModel.calls,outcomes:__navigationModel.outcomes,samples:__navigationModel.samples,status:app.agentLayer.getResidentMotorStatus(key),
        episodes:await store.snapshot({agentId:id,worldId:app.worldAgents.getStatus().worldId,includePrivate:true})};},{key:body.key,id:body.agentId});
    assert(actual.result.samples.every(sample=>sample.penetration<.35),'Actual commanded body did not pass through the wall');
    assert(actual.result.episodes.some(episode=>episode.kind==='action-outcome'&&episode.source.kind==='verified-action'),'Physical action receipt persisted');
    assert.equal(actual.result.status.backend,'webgpu');assert.equal(actual.result.status.worker,true);
    assert.equal(actual.result.status.policyId,actual.expectedPolicyId,'The production worker used the same qualified policy hash as source');
    for(let i=0;i<4&&await modelPage.locator('dialog[open]').count();i++)await modelPage.keyboard.press('Escape');
    await modelPage.getByRole('button',{name:'Settings',exact:true}).click();await modelPage.getByRole('button',{name:'Residents',exact:true}).click();
    const roster=modelPage.getByRole('dialog',{name:'Residents',exact:true});await roster.getByLabel('Movement details for '+body.name,{exact:true}).click();
    await modelPage.waitForTimeout(600);
    const desktop=path.join(evidence,'actual-command-desktop.png');await modelPage.screenshot({path:desktop,fullPage:true});report.screenshots.push(desktop);
    await modelPage.setViewportSize({width:390,height:844});const mobile=path.join(evidence,'actual-command-mobile.png');await modelPage.screenshot({path:mobile,fullPage:true});report.screenshots.push(mobile);
    await roster.getByRole('combobox',{name:'Movement for '+body.name,exact:true}).selectOption('stationary');await modelPage.waitForTimeout(600);
    actual.ownerStop=await modelPage.evaluate(key=>({status:__cubechat.agentLayer.getResidentMotorStatus(key),velocity:__cubechat.agentLayer.entries.get(key).body.velocity.toArray()}),body.key);
    assert.equal(actual.ownerStop.status.status,'stopped');assert.deepEqual(actual.ownerStop.velocity,[0,0,0]);
    assert.deepEqual(actual.pageErrors,[]);assert.deepEqual(actual.httpErrors,[]);assert.deepEqual(actual.blockedDownloads,[]);actual.passed=true;
  }finally{
    if(modelPage&&!modelPage.isClosed())try{actual.finalState=await modelPage.evaluate(()=>{const state=window.__navigationModel;return state?{calls:state.calls,outcomes:state.outcomes,samples:state.samples,motor:window.__cubechat?.agentLayer?.getMotorStatus?.()}:null;});}catch(error){actual.cleanupErrors.push('Final evidence: '+error.message);}
    if(modelPage&&!modelPage.isClosed())try{await modelPage.evaluate(async()=>{const state=window.__navigationModel;if(state){clearInterval(state.timer);state.unsubscribe?.();for(const{collider,visual}of state.walls){__cubechat.physics.world.removeBody(collider);visual.removeFromParent();for(const material of Array.isArray(visual.material)?visual.material:[visual.material])material.dispose();}}await window.__cubechat?.destroy?.();});}catch(error){actual.cleanupErrors.push(error.message);}
    await context.close();await save();
  }
}

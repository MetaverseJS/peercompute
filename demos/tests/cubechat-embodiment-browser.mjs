import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {build} from 'vite';
import {chromium} from 'playwright';
// Owned local-only production fixture: real managed WebGPU motor + Cannon + scene.
const repo=fileURLToPath(new URL('../../',import.meta.url));
const evidence=process.env.CUBE_MOTOR_EVIDENCE??'/home/cos/.cache/peercompute-meet-follow-20261109/embodiment';
const fixture=path.join(evidence,'fixture'),built=path.join(evidence,'built');await mkdir(fixture,{recursive:true});
const modulePath=relative=>JSON.stringify(path.join(repo,relative));
await writeFile(path.join(fixture,'index.html'),'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><style>body{margin:0;background:#071722;color:#bffaff;font:14px monospace}canvas{display:block}#status{position:fixed;top:12px;left:12px;background:#071722dd;padding:12px;border:1px solid #7fdac4;max-width:calc(100vw - 50px)}</style><div id="status">Owned learned-motor acceptance</div><script type="module" src="./main.js"></script>');
await writeFile(path.join(fixture,'main.js'),`
import * as THREE from ${modulePath('node_modules/three/build/three.module.js')};
import * as CANNON from ${modulePath('node_modules/cannon-es/dist/cannon-es.js')};
import {ComputeManager} from ${modulePath('peercompute/src/peercompute/computeManager/ComputeManager.js')};
import {createResidentMotorService} from ${modulePath('demos/shared/agents/motor/ResidentMotorService.js')};
import {CubeAgentLayer} from ${modulePath('demos/cubechat/src/agents/CubeAgentLayer.js')};
import {PhysicsWorld} from ${modulePath('demos/cubechat/src/physics/world.js')};
const manager=new ComputeManager({requireWorkers:true,enableWorkers:true,enableWebGPU:true,minWorkers:1,targetWorkers:1,maxWorkers:2,autoScaleWorkers:false,workerBootstrapTimeoutMs:60000});
const service=createResidentMotorService({computeManager:manager});
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000),renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(innerWidth,innerHeight);document.body.append(renderer.domElement);scene.background=new THREE.Color('#071722');scene.add(new THREE.HemisphereLight(0xbaffff,0x303040,3));
const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0x143a35,roughness:1}));floor.rotation.x=-Math.PI/2;scene.add(floor);scene.add(new THREE.GridHelper(200,40,0x469f87,0x204b42));
const physics=new PhysicsWorld(),player=new THREE.Mesh(new THREE.BoxGeometry(6,6,6),new THREE.MeshStandardMaterial({color:0xffb64f}));scene.add(player);
const target={id:'human:owned-target',peerId:'owned-target',name:'Owned visitor',position:[0,3,45],velocity:[0,0,0]};let participants=[target];
const shell={scene,camera,floor,renderer,players:new Map([['owned-target',player]]),worldThemeId:'owned-test',getGroundHeight:()=>0};
const layer=new CubeAgentLayer({scene:shell,physics,getPlayerPosition:()=>target.position,getParticipants:()=>participants});
const descriptor={key:'local:owned-body',agentId:'owned-body',ownerPeerId:'owned-target',name:'Learned resident',position:[0,3,0],local:true,color:'#8fffd4',status:'idle',movement:'stationary'};
layer.upsert(descriptor);const outcomes=[];layer.subscribeOutcomes(event=>outcomes.push(event));
const render=()=>{player.position.fromArray(target.position);camera.position.set(30,38,-25);camera.lookAt(0,3,27);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);layer.captions.update();renderer.render(scene,camera);};render();
const step=async(count,move=()=>{})=>{for(let i=0;i<count;i++){move(i);physics.world.step(1/60);layer.afterPhysics(1/60);if(layer.motor.pending)await layer.motor.pending.done;if(i%60===0)render();}};
window.run=async()=>{
 await manager.initialize();layer.setMotor(service);layer.setIntent(descriptor.key,{type:'approach',targetId:target.id,requestId:'approach'});await step(900);
 const body=layer.entries.get(descriptor.key).body,approach={position:body.position.toArray(),distance:Math.hypot(body.position.x-target.position[0],body.position.z-target.position[2]),outcomes:[...outcomes]};
 layer.setIntent(descriptor.key,{type:'follow',targetId:target.id,requestId:'follow'});layer.upsert({...descriptor,status:'thinking'});
 await step(720,()=>{target.position[0]+=.5/60;target.position[2]+=.3/60;target.velocity=[.5,0,.3];});
 const follow={position:body.position.toArray(),distance:Math.hypot(body.position.x-target.position[0],body.position.z-target.position[2]),status:layer.entries.get(descriptor.key).descriptor.status};
 participants=[];await step(120);const lost={position:body.position.toArray(),velocity:body.velocity.toArray(),outcomes:[...outcomes]};
 participants=[target];target.velocity=[0,0,0];target.position=[0,3,45];layer.remove(descriptor.key);layer.upsert(descriptor);
 const wall=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(25,8,1)),position:new CANNON.Vec3(0,3,15)});physics.world.addBody(wall);
 const wallMesh=new THREE.Mesh(new THREE.BoxGeometry(50,16,2),new THREE.MeshStandardMaterial({color:0x8b4c43}));wallMesh.position.set(0,3,15);scene.add(wallMesh);
 layer.setIntent(descriptor.key,{type:'approach',targetId:target.id,requestId:'blocked'});await step(900);
 const collision={position:layer.entries.get(descriptor.key).body.position.toArray(),outcomes:[...outcomes]};
 document.querySelector('#status').textContent='Learned motor: approach '+approach.distance.toFixed(2)+' units · follow '+follow.distance.toFixed(2)+' units · collision stops at wall';
 render();return {approach,follow,lost,collision,motor:service.getStatus(),sameBody:layer.entries.size===1,observed:layer.observe(descriptor.key)};
};
window.render=render;
window.closeOwned=async()=>{layer.dispose();await service.dispose();const reservations=manager.residentWorkerAffinities.size;await manager.destroy();renderer.dispose();return {reservations,layerClosed:layer.closed,bodies:layer.entries.size};};
`);
await build({configFile:false,root:fixture,base:'./',logLevel:'warn',worker:{format:'es'},build:{outDir:built,emptyOutDir:true,assetsInlineLimit:0,rollupOptions:{input:path.join(fixture,'index.html')}}});
const report={startedAt:new Date().toISOString(),pageErrors:[],consoleErrors:[],external:[]};let browser,server,page;
try{
 server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(built,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(built+path.sep))throw Error('Bad path');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.wasm')?'application/wasm':'text/html');res.end(await readFile(file));}catch{res.statusCode=404;res.end('Not found');}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/opt/google/chrome/chrome',headless:true,args:['--enable-gpu','--enable-unsafe-webgpu','--enable-features=Vulkan,VulkanFromANGLE','--use-angle=vulkan','--use-vulkan=native','--disable-vulkan-surface']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route('**/*',route=>{if(new URL(route.request().url()).origin===origin)return route.continue();report.external.push(route.request().url());return route.abort();});
 page=await context.newPage();page.on('pageerror',e=>report.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
 await page.goto(origin);await page.waitForFunction(()=>typeof window.run==='function');report.result=await page.evaluate(()=>run());
 assert(report.result.approach.distance>=8&&report.result.approach.distance<=12,JSON.stringify(report.result.approach));
 assert(report.result.approach.position[2]>25);assert(report.result.follow.position[0]>1);assert(report.result.follow.distance<15);assert.equal(report.result.follow.status,'thinking');
 assert.deepEqual(report.result.lost.velocity,[0,0,0]);assert(report.result.lost.outcomes.some(e=>e.requestId==='follow'&&e.status==='target-lost'));
 assert(report.result.collision.position[2]<11.2);assert(report.result.collision.outcomes.some(e=>e.requestId==='blocked'&&e.status==='blocked'));
 assert.equal(report.result.sameBody,true);assert.equal(report.result.motor.backend,'webgpu');assert(report.result.motor.dispatches>100);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>{render();requestAnimationFrame(resolve);})));await page.screenshot({path:path.join(evidence,'desktop-motor-body.png'),fullPage:true});await page.setViewportSize({width:390,height:844});await page.evaluate(()=>render());await page.screenshot({path:path.join(evidence,'mobile-motor-body.png'),fullPage:true});
 assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.external,[]);report.pass=true;
}catch(error){report.failure=error.stack;report.pass=false;process.exitCode=1;}
finally{if(page&&!page.isClosed())report.cleanup=await page.evaluate(()=>window.closeOwned?.()).catch(e=>({error:e.message}));await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));report.finishedAt=new Date().toISOString();await writeFile(path.join(evidence,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}

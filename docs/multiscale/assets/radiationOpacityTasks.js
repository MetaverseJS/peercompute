const k="peercompute.multiscale.radiation-opacity.state.v0",q="peercompute.multiscale.radiation-opacity.result.v0",H="peercompute.multiscale.radiation-opacity.delta.v0",se=16384,U="multiscale:radiation-opacity:default",V="multiscale-solver-deltas";const Z=8*Float32Array.BYTES_PER_ELEMENT,C=new Map,K=new Map,x=new Map,j=`
struct Cell {
  radTemp: vec4f,
  fluxPower: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  stellarFlux: f32,
  fireIntensity: f32,
  ambientTemperatureK: f32,
  cloudCover: f32,
  sootOpacity: f32,
};

@group(0) @binding(0) var<storage, read> currentCells: array<Cell>;
@group(0) @binding(1) var<storage, read_write> nextCells: array<Cell>;
@group(0) @binding(2) var<uniform> params: Params;

fn cell_index(x: u32, y: u32, width: u32) -> u32 {
  return y * width + x;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let width = u32(params.width);
  let height = u32(params.height);
  let count = width * height;
  let index = gid.x;
  if (index >= count) {
    return;
  }

  let x = index % width;
  let y = index / width;
  let xp = (x + 1u) % width;
  let xm = (x + width - 1u) % width;
  let yp = (y + 1u) % height;
  let ym = (y + height - 1u) % height;
  let right = currentCells[cell_index(xp, y, width)];
  let left = currentCells[cell_index(xm, y, width)];
  let up = currentCells[cell_index(x, yp, width)];
  let down = currentCells[cell_index(x, ym, width)];
  let cell = currentCells[index];

  let dt = clamp(params.dt, 0.0, 1.0);
  let u = f32(x) / max(1.0, params.width - 1.0) - 0.5;
  let v = f32(y) / max(1.0, params.height - 1.0) - 0.5;
  let r2 = u * u + v * v;
  let fireSource = exp(-r2 * 26.0) * params.fireIntensity * 3.4;
  let stellarSource = params.stellarFlux * (0.06 + 0.14 * max(0.0, 1.0 - abs(v) * 1.8));

  var radiation = cell.radTemp.x;
  var temperatureK = cell.radTemp.y;
  var opacity = clamp(cell.radTemp.z * 0.965 + (0.035 + params.cloudCover * 0.16 + params.sootOpacity * 0.36) * 0.035, 0.01, 3.0);
  var source = stellarSource + fireSource;

  let laplacian = right.radTemp.x + left.radTemp.x + up.radTemp.x + down.radTemp.x - radiation * 4.0;
  let emission = pow(clamp(temperatureK / 300.0, 0.0, 8.0), 4.0) * 0.042;
  let absorbed = opacity * radiation * 0.09;
  let escape = radiation * (0.014 + opacity * 0.006);
  radiation = max(0.0, radiation + dt * (laplacian * 0.34 + source + emission - absorbed - escape));
  temperatureK = clamp(
    temperatureK + dt * (absorbed * 8.5 + fireSource * 7.5 - emission * 3.1 + (params.ambientTemperatureK - temperatureK) * 0.018),
    120.0,
    2400.0
  );

  let fluxX = -(right.radTemp.x - left.radTemp.x) * 0.5;
  let fluxY = -(up.radTemp.x - down.radTemp.x) * 0.5;
  nextCells[index].radTemp = vec4f(radiation, temperatureK, opacity, source);
  nextCells[index].fluxPower = vec4f(fluxX, fluxY, absorbed, emission);
}
`;function W(){const e=globalThis.self,t=globalThis.WorkerGlobalScope;return e&&t&&e instanceof t?"dedicated-worker":"inline"}function E(e,t,r){return Math.min(r,Math.max(t,e))}function f(e,t,r=-Number.MAX_VALUE,a=Number.MAX_VALUE){const i=Number(e);return Number.isFinite(i)?Math.min(a,Math.max(r,i)):t}function T(e,t,r=1,a=Number.MAX_SAFE_INTEGER){const i=Math.floor(Number(e));return Number.isFinite(i)?Math.min(a,Math.max(r,i)):t}function J(e=1){let t=Number(e)>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function b(e,t,r){return t*r+e}function O(e,t){return(e+t)%t}function g(e,t,r){const a=Array.from(e||[],i=>Number(i));if(a.length!==t)throw new Error(`${r} length ${a.length} does not match expected ${t}`);if(a.some(i=>!Number.isFinite(i)))throw new Error(`${r} contains non-finite values`);return a}function R(e={},t,r){return f(e[t],r)}function Q({width:e=18,height:t=10,seed:r=20260529,environment:a={},coupling:i={}}={}){const n=T(e,18,4,128),u=T(t,Math.max(4,Math.round(n/2)),4,128),c=n*u,o=J(r),s=f(a.stellarFlux,1,0,4),h=f(a.ambientTemperatureK,294,120,360),d=R(i,"fireIntensity",.2),l=R(i,"cloudCover",.45),m=R(i,"smokeFraction",R(i,"sootOpacity",.1)),p=new Array(c),v=new Array(c),w=new Array(c),A=new Array(c),S=new Array(c).fill(0),P=new Array(c).fill(0),B=new Array(c).fill(0),z=new Array(c).fill(0);for(let M=0;M<u;M+=1){const D=M/Math.max(1,u-1)-.5;for(let _=0;_<n;_+=1){const L=_/Math.max(1,n-1)-.5,y=b(_,M,n),$=L*L+D*D,G=Math.exp(-$*26)*d*3.4,Y=s*(.06+.14*Math.max(0,1-Math.abs(D)*1.8)),F=(o()-.5)*.008;A[y]=Math.max(0,Y+G),w[y]=E(.035+l*.16+m*.36+F,.01,3),p[y]=Math.max(.001,A[y]*3.2+w[y]*.12+F),v[y]=E(h+G*64+Y*28+F*120,120,2400)}}return{schema:k,sequence:0,elapsedTime:0,width:n,height:u,radiationEnergy:p,materialTemperatureK:v,opacity:w,sourceStrength:A,fluxX:S,fluxY:P,absorbedPower:B,emittedPower:z}}function X(e={}){const t=e.state||e;if(!t.radiationEnergy&&!t.materialTemperatureK)return Q(e);const r=T(t.width,18,4,128),a=T(t.height,Math.max(4,Math.round(r/2)),4,128),i=r*a;return{schema:k,sequence:T(t.sequence,0,0),elapsedTime:f(t.elapsedTime,0,0),width:r,height:a,radiationEnergy:g(t.radiationEnergy,i,"radiationEnergy"),materialTemperatureK:g(t.materialTemperatureK,i,"materialTemperatureK"),opacity:g(t.opacity||new Array(i).fill(.05),i,"opacity"),sourceStrength:g(t.sourceStrength||new Array(i).fill(0),i,"sourceStrength"),fluxX:g(t.fluxX||new Array(i).fill(0),i,"fluxX"),fluxY:g(t.fluxY||new Array(i).fill(0),i,"fluxY"),absorbedPower:g(t.absorbedPower||new Array(i).fill(0),i,"absorbedPower"),emittedPower:g(t.emittedPower||new Array(i).fill(0),i,"emittedPower")}}function I(e){return{schema:k,sequence:e.sequence,elapsedTime:e.elapsedTime,width:e.width,height:e.height,radiationEnergy:[...e.radiationEnergy],materialTemperatureK:[...e.materialTemperatureK],opacity:[...e.opacity],sourceStrength:[...e.sourceStrength],fluxX:[...e.fluxX],fluxY:[...e.fluxY],absorbedPower:[...e.absorbedPower],emittedPower:[...e.emittedPower]}}function ee(e){const t=e.width*e.height,r=new Float32Array(t*8);for(let a=0;a<t;a+=1){const i=a*8;r[i]=e.radiationEnergy[a],r[i+1]=e.materialTemperatureK[a],r[i+2]=e.opacity[a],r[i+3]=e.sourceStrength[a],r[i+4]=e.fluxX[a],r[i+5]=e.fluxY[a],r[i+6]=e.absorbedPower[a],r[i+7]=e.emittedPower[a]}return r}function te(e,t){const r=e.width*e.height;for(let a=0;a<r;a+=1){const i=a*8;e.radiationEnergy[a]=t[i],e.materialTemperatureK[a]=t[i+1],e.opacity[a]=t[i+2],e.sourceStrength[a]=t[i+3],e.fluxX[a]=t[i+4],e.fluxY[a]=t[i+5],e.absorbedPower[a]=t[i+6],e.emittedPower[a]=t[i+7]}}function N(e={}){const t=X(e),r=t.width*t.height;let a=0,i=0,n=0,u=0,c=0,o=0,s=0;for(let l=0;l<r;l+=1)a+=t.radiationEnergy[l],i+=t.absorbedPower[l],n+=t.emittedPower[l],c+=t.materialTemperatureK[l],o+=t.opacity[l],s+=t.sourceStrength[l],u=Math.max(u,Math.hypot(t.fluxX[l],t.fluxY[l]));c/=Math.max(1,r),o/=Math.max(1,r);const h=o*Math.sqrt(r),d=E(h/(1+h),0,1);return{schema:"peercompute.multiscale.radiation-opacity.diagnostics.v0",width:t.width,height:t.height,cellCount:r,totalRadiationEnergy:a,meanRadiationEnergy:a/Math.max(1,r),totalAbsorbedPower:i,totalEmittedPower:n,sourcePower:s,meanTemperatureK:c,meanOpacity:o,opticalDepth:h,greenhouseFactor:d,maxFluxMagnitude:u}}class re{constructor(t){this.stateKey=t,this.device=null,this.pipeline=null,this.currentBuffer=null,this.nextBuffer=null,this.readBuffer=null,this.paramBuffer=null,this.width=0,this.height=0,this.submittedSteps=0,this.lastError=null}async initialize(t,r){var o,s,h,d,l,m;if(this.device&&this.width===t&&this.height===r)return;const a=(o=globalThis.navigator)==null?void 0:o.gpu;if(!a)throw new Error("WebGPU unavailable for radiation-opacity worker");const i=globalThis.GPUBufferUsage;if(!i)throw new Error("GPUBufferUsage unavailable for radiation-opacity worker");const n=await a.requestAdapter({powerPreference:"high-performance"});if(!n)throw new Error("No WebGPU adapter available for radiation-opacity worker");this.device=await n.requestDevice(),this.width=t,this.height=r;const u=t*r*8*Float32Array.BYTES_PER_ELEMENT;this.currentBuffer=this.device.createBuffer({size:u,usage:i.STORAGE|i.COPY_DST}),this.nextBuffer=this.device.createBuffer({size:u,usage:i.STORAGE|i.COPY_SRC|i.COPY_DST}),this.readBuffer=this.device.createBuffer({size:u,usage:i.COPY_DST|i.MAP_READ}),this.paramBuffer=this.device.createBuffer({size:Z,usage:i.UNIFORM|i.COPY_DST}),(h=(s=this.device).pushErrorScope)==null||h.call(s,"validation"),this.pipeline=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:j}),entryPoint:"main"}});const c=await((l=(d=this.device).popErrorScope)==null?void 0:l.call(d));if(c)throw new Error(`Radiation WebGPU validation: ${c.message||c}`);(m=this.device.lost)==null||m.then(p=>{this.lastError=(p==null?void 0:p.message)||(p==null?void 0:p.reason)||"Radiation WebGPU device lost",x.set(this.stateKey,this.lastError)})}async step(t,r){var l,m;await this.initialize(t.width,t.height);const a=globalThis.GPUMapMode;if(!a)throw new Error("GPUMapMode unavailable for radiation-opacity worker");const i=ee(t),n=new Float32Array([t.width,t.height,r.dt,r.stellarFlux,r.fireIntensity,r.ambientTemperatureK,r.cloudCover,r.sootOpacity]),u=Math.ceil(t.width*t.height/64),c=this.device.createCommandEncoder(),o=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.currentBuffer}},{binding:1,resource:{buffer:this.nextBuffer}},{binding:2,resource:{buffer:this.paramBuffer}}]});this.device.queue.writeBuffer(this.currentBuffer,0,i),this.device.queue.writeBuffer(this.paramBuffer,0,n);const s=c.beginComputePass();s.setPipeline(this.pipeline),s.setBindGroup(0,o),s.dispatchWorkgroups(u),s.end(),c.copyBufferToBuffer(this.nextBuffer,0,this.readBuffer,0,i.byteLength),this.device.queue.submit([c.finish()]),await((m=(l=this.device.queue).onSubmittedWorkDone)==null?void 0:m.call(l)),await this.readBuffer.mapAsync(a.READ);const h=this.readBuffer.getMappedRange(),d=new Float32Array(h).slice();return this.readBuffer.unmap(),te(t,d),t.elapsedTime+=r.dt,this.submittedSteps+=1,{backend:"webgpu-radiation-opacity",webgpuStatus:{stateKey:this.stateKey,width:t.width,height:t.height,cellCount:t.width*t.height,submittedSteps:this.submittedSteps}}}}function ie(e={}){const t=e.environment||{},r=e.coupling||{};return{dt:f(e.dt,1/45,0,1),stellarFlux:f(t.stellarFlux??e.stellarFlux,1,0,4),fireIntensity:f(r.fireIntensity??e.fireIntensity,.2,0,2),ambientTemperatureK:f(t.ambientTemperatureK??e.ambientTemperatureK,294,120,500),cloudCover:f(r.cloudCover??e.cloudCover,.4,0,1),sootOpacity:f(r.smokeFraction??r.sootOpacity??e.sootOpacity,.08,0,2)}}function ae(e,t){const r=I(e);for(let a=0;a<e.height;a+=1)for(let i=0;i<e.width;i+=1){const n=b(i,a,e.width),u=b(O(i+1,e.width),a,e.width),c=b(O(i-1,e.width),a,e.width),o=b(i,O(a+1,e.height),e.width),s=b(i,O(a-1,e.height),e.width),h=i/Math.max(1,e.width-1)-.5,d=a/Math.max(1,e.height-1)-.5,l=h*h+d*d,m=Math.exp(-l*26)*t.fireIntensity*3.4,v=t.stellarFlux*(.06+.14*Math.max(0,1-Math.abs(d)*1.8))+m,w=E(e.opacity[n]*.965+(.035+t.cloudCover*.16+t.sootOpacity*.36)*.035,.01,3),A=e.radiationEnergy[u]+e.radiationEnergy[c]+e.radiationEnergy[o]+e.radiationEnergy[s]-e.radiationEnergy[n]*4,S=Math.pow(E(e.materialTemperatureK[n]/300,0,8),4)*.042,P=w*e.radiationEnergy[n]*.09,B=e.radiationEnergy[n]*(.014+w*.006);r.radiationEnergy[n]=Math.max(0,e.radiationEnergy[n]+t.dt*(A*.34+v+S-P-B)),r.materialTemperatureK[n]=E(e.materialTemperatureK[n]+t.dt*(P*8.5+m*7.5-S*3.1+(t.ambientTemperatureK-e.materialTemperatureK[n])*.018),120,2400),r.opacity[n]=w,r.sourceStrength[n]=v,r.fluxX[n]=-(e.radiationEnergy[u]-e.radiationEnergy[c])*.5,r.fluxY[n]=-(e.radiationEnergy[o]-e.radiationEnergy[s])*.5,r.absorbedPower[n]=P,r.emittedPower[n]=S}return r.elapsedTime+=t.dt,r}async function ne(e,{stateKey:t,input:r,options:a}){const i=e.width*e.height;if(r.enableWebGPU!==!1&&r.webgpu!==!1&&i<=T(r.webgpuMaxCells,16384,1,1048576)&&!x.has(t))try{let o=K.get(t);o||(o=new re(t),K.set(t,o));const s=await o.step(e,a);return{backend:s.backend,webgpuStatus:s.webgpuStatus,webgpuError:null}}catch(o){x.set(t,o instanceof Error?o.message:String(o))}const c=ae(e,a);return Object.assign(e,c),{backend:"cpu-radiation-opacity",webgpuStatus:null,webgpuError:x.get(t)||null}}function oe(e={}){var r,a;const t=e.input||e;return{payload:e,input:t,stateKey:e.stateKey||t.stateKey||t.taskId||U,scope:t.scope||e.scope||((a=(r=e.solver)==null?void 0:r.warmDelta)==null?void 0:a.scope)||V,taskId:t.taskId||e.stateKey||t.stateKey||U,emitCommitDelta:t.emitCommitDelta===!0||e.emitCommitDelta===!0}}function ce({payload:e,input:t,stateKey:r,state:a,diagnostics:i,conservation:n,backend:u,webgpuStatus:c,webgpuError:o}){var s,h,d;return{schema:((h=(s=e.solver)==null?void 0:s.warmDelta)==null?void 0:h.schema)||H,solverId:((d=e.solver)==null?void 0:d.id)||"radiation-opacity",stateKey:r,backend:u,sequence:a.sequence,elapsedTime:a.elapsedTime,width:a.width,height:a.height,cellCount:a.width*a.height,diagnostics:i,conservation:n,state:a,webgpuStatus:c,webgpuError:o,units:{radiationEnergy:t.radiationEnergyUnit||"reduced-J/m^3",temperature:"K",opacity:t.opacityUnit||"reduced-1/m",time:t.timeUnit||"s"}}}function le(e={}){if(e.stateKey||e.taskId){const t=e.stateKey||e.taskId;C.delete(t),K.delete(t),x.delete(t)}else C.clear(),K.clear(),x.clear();return{ok:!0,schema:q,executionContext:W()}}async function ue(e={}){var m;const t=oe(e),{input:r,stateKey:a}=t,i=r.reset===!0,n=r.state||i||!C.has(a)?X(r):I(C.get(a)),u=N(n),c=ie(r),o=await ne(n,{stateKey:a,input:r,options:c});n.sequence+=1,C.set(a,I(n));const s=N(n),h={radiationEnergyDelta:s.totalRadiationEnergy-u.totalRadiationEnergy,absorbedMinusEmitted:s.totalAbsorbedPower-s.totalEmittedPower,energyMode:"reduced-grey-radiation-opacity",note:"Reduced interactive transport; not full radiative-transfer energy conservation."},d=I(n),l={ok:!0,schema:q,executionContext:W(),solverId:((m=e.solver)==null?void 0:m.id)||"radiation-opacity",stateKey:a,backend:o.backend,sequence:d.sequence,elapsedTime:d.elapsedTime,state:d,diagnostics:s,conservation:h,webgpuStatus:o.webgpuStatus,webgpuError:o.webgpuError,parameters:c};return t.emitCommitDelta?{value:l,commitDelta:{taskId:t.taskId,scope:t.scope,version:d.sequence,timestamp:Date.now(),payload:ce({payload:e,input:r,stateKey:a,state:d,diagnostics:s,conservation:h,backend:o.backend,webgpuStatus:o.webgpuStatus,webgpuError:o.webgpuError})}}:l}export{H as RADIATION_OPACITY_DELTA_SCHEMA,q as RADIATION_OPACITY_RESULT_SCHEMA,k as RADIATION_OPACITY_STATE_SCHEMA,se as RADIATION_OPACITY_WEBGPU_MAX_CELLS,N as computeRadiationOpacityDiagnostics,Q as makeRadiationOpacityInitialState,le as resetRadiationOpacity,ue as stepRadiationOpacity};

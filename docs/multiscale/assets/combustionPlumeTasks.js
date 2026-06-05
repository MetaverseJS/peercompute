const U="peercompute.multiscale.combustion-plume.state.v0",N="peercompute.multiscale.combustion-plume.result.v0",Q="peercompute.multiscale.combustion-plume.delta.v0",de=16384,X="multiscale:combustion-plume:default",ee="multiscale-solver-deltas";const te=12*Float32Array.BYTES_PER_ELEMENT,z=64,_=new Map,W=new Map,A=new Map,re=`
struct Cell {
  thermalFuel: vec4f,
  smokeWind: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  ambientTemperatureK: f32,
  oxygenBoundary: f32,
  waterContact: f32,
  radiativeHeatFlux: f32,
  windX: f32,
  windY: f32,
  ignition: f32,
  spreadRate: f32,
  pad0: f32,
};

@group(0) @binding(0) var<storage, read> currentCells: array<Cell>;
@group(0) @binding(1) var<storage, read_write> nextCells: array<Cell>;
@group(0) @binding(2) var<uniform> params: Params;

fn cell_index(x: u32, y: u32, width: u32) -> u32 {
  return y * width + x;
}

@compute @workgroup_size(${z})
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

  let dt = clamp(params.dt, 0.0, 0.25);
  let u = f32(x) / max(1.0, params.width - 1.0) - 0.5;
  let v = f32(y) / max(1.0, params.height - 1.0) - 0.5;
  let r2 = u * u + v * v;
  let ignitionSource = exp(-r2 * 22.0) * params.ignition;

  var temperatureK = cell.thermalFuel.x;
  var fuel = clamp(cell.thermalFuel.y, 0.0, 2.0);
  var oxygen = clamp(cell.thermalFuel.z, 0.0, 1.0);
  var water = clamp(cell.thermalFuel.w, 0.0, 1.5);
  var smoke = clamp(cell.smokeWind.x, 0.0, 2.0);

  let neighborTemp = (right.thermalFuel.x + left.thermalFuel.x + up.thermalFuel.x + down.thermalFuel.x) * 0.25;
  let neighborSmoke = (right.smokeWind.x + left.smokeWind.x + up.smokeWind.x + down.smokeWind.x) * 0.25;
  let neighborOxygen = (right.thermalFuel.z + left.thermalFuel.z + up.thermalFuel.z + down.thermalFuel.z) * 0.25;
  let neighborFuel = (right.thermalFuel.y + left.thermalFuel.y + up.thermalFuel.y + down.thermalFuel.y) * 0.25;
  var windTemp = temperatureK;
  var windSmoke = smoke;
  var windOxygen = oxygen;
  if (abs(params.windY) >= abs(params.windX)) {
    if (params.windY >= 0.0) {
      windTemp = down.thermalFuel.x;
      windSmoke = down.smokeWind.x;
      windOxygen = down.thermalFuel.z;
    } else {
      windTemp = up.thermalFuel.x;
      windSmoke = up.smokeWind.x;
      windOxygen = up.thermalFuel.z;
    }
  } else {
    if (params.windX >= 0.0) {
      windTemp = left.thermalFuel.x;
      windSmoke = left.smokeWind.x;
      windOxygen = left.thermalFuel.z;
    } else {
      windTemp = right.thermalFuel.x;
      windSmoke = right.smokeWind.x;
      windOxygen = right.thermalFuel.z;
    }
  }
  let windMix = clamp(length(vec2f(params.windX, params.windY)) * dt * 0.075, 0.0, 0.28);

  fuel = fuel + (neighborFuel - fuel) * dt * 0.04;
  oxygen = oxygen + (neighborOxygen - oxygen) * dt * 0.18 + (params.oxygenBoundary - oxygen) * dt * 0.12;
  smoke = smoke + (neighborSmoke - smoke) * dt * 0.26;
  water = clamp(water + params.waterContact * dt * (0.08 + ignitionSource * 0.25) - max(temperatureK - 373.15, 0.0) * water * dt * 0.00035, 0.0, 1.5);

  let thermalActivation = clamp((temperatureK - 520.0) / 820.0, 0.0, 1.0);
  let oxygenDrive = clamp(oxygen / 0.21, 0.0, 2.0);
  let suppression = clamp(1.0 - water * 0.72, 0.0, 1.0);
  let reactionRate = clamp((thermalActivation * params.spreadRate + ignitionSource * 0.55) * oxygenDrive * fuel * suppression, 0.0, 2.2);
  let fuelBurn = min(fuel, reactionRate * dt * 0.052);
  let oxygenBurn = min(oxygen, fuelBurn * 0.64);
  let heatInput = fuelBurn * 6800.0;
  let radiativeInput = clamp(params.radiativeHeatFlux, -5000.0, 5000.0) * dt * 0.025;
  let waterCooling = water * max(temperatureK - 340.0, 0.0) * dt * 0.38;
  let ambientLoss = max(temperatureK - params.ambientTemperatureK, 0.0) * dt * 0.2;
  let thermalDiffusion = (neighborTemp - temperatureK) * dt * 0.24;
  let buoyancyMix = clamp(thermalActivation * smoke * dt * 0.18, 0.0, 0.08);

  fuel = max(0.0, fuel - fuelBurn);
  oxygen = max(0.0, oxygen - oxygenBurn);
  oxygen = clamp(oxygen + (windOxygen - oxygen) * windMix * 0.65, 0.0, 1.0);
  temperatureK = clamp(temperatureK + heatInput + radiativeInput + thermalDiffusion - waterCooling - ambientLoss, params.ambientTemperatureK, 2600.0);
  temperatureK = clamp(temperatureK + (windTemp - temperatureK) * windMix + (down.thermalFuel.x - temperatureK) * buoyancyMix * 0.35, params.ambientTemperatureK, 2600.0);
  smoke = clamp(smoke + fuelBurn * 1.35 - smoke * dt * (0.08 + water * 0.04), 0.0, 2.0);
  smoke = clamp(smoke + (windSmoke - smoke) * windMix + (down.smokeWind.x - smoke) * buoyancyMix, 0.0, 2.0);

  nextCells[index].thermalFuel = vec4f(temperatureK, fuel, oxygen, water);
  nextCells[index].smokeWind = vec4f(smoke, params.windX, params.windY, heatInput / max(dt, 0.000000001));
}
`;function q(){const t=globalThis.self,e=globalThis.WorkerGlobalScope;return t&&e&&t instanceof e?"dedicated-worker":"inline"}function m(t,e,r){return Math.min(r,Math.max(e,t))}function w(t,e,r=-Number.MAX_VALUE,n=Number.MAX_VALUE){const a=Number(t);return Number.isFinite(a)?Math.min(n,Math.max(r,a)):e}function B(t,e,r=1,n=Number.MAX_SAFE_INTEGER){const a=Math.floor(Number(t));return Number.isFinite(a)?Math.min(n,Math.max(r,a)):e}function ne(t=1){let e=Number(t)>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function R(t,e,r){return e*r+t}function D(t,e){return(t+e)%e}function T(t,e,r,n=0){const a=Array.from(t||new Array(e).fill(n),i=>Number(i));if(a.length!==e)throw new Error(`${r} length ${a.length} does not match expected ${e}`);if(a.some(i=>!Number.isFinite(i)))throw new Error(`${r} contains non-finite values`);return a}function ae({width:t=18,height:e=10,seed:r=20260529,environment:n={},coupling:a={}}={}){const i=B(t,18,4,128),s=B(e,Math.max(4,Math.round(i/2)),4,128),u=i*s,o=ne(r),l=w(n.ambientTemperatureK,294,120,600),h=m(w(n.oxygenFraction,.21),0,1),c=m(w(a.fireIntensity,.7),0,2),d=m(w(a.waterContact,0),0,1.5),g=new Array(u),b=new Array(u),K=new Array(u),E=new Array(u),S=new Array(u),k=new Array(u),p=new Array(u),M=new Array(u);for(let x=0;x<s;x+=1){const y=x/Math.max(1,s-1)-.5;for(let v=0;v<i;v+=1){const C=v/Math.max(1,i-1)-.5,f=R(v,x,i),L=C*C+y*y,O=Math.exp(-L*22)*c,F=(o()-.5)*.04;g[f]=m(l+O*520+F*90,l,2200),b[f]=m(.62+F+(1-Math.abs(y))*.16,0,1.4),K[f]=h,E[f]=m(O*.08,0,1),S[f]=m(d*Math.exp(-L*12),0,1.5),k[f]=0,p[f]=0,M[f]=.2}}return{schema:U,sequence:0,elapsedTime:0,width:i,height:s,ambientTemperatureK:l,oxygenReference:h,temperatureK:g,fuel:b,oxygenFraction:K,smoke:E,water:S,heatRelease:k,windX:p,windY:M}}function H(t={}){const e=t.state||t;if(!e.temperatureK||!e.fuel)return ae(t);const r=B(e.width,18,4,128),n=B(e.height,Math.max(4,Math.round(r/2)),4,128),a=r*n;return{schema:U,sequence:B(e.sequence,0,0),elapsedTime:w(e.elapsedTime,0,0),width:r,height:n,ambientTemperatureK:w(e.ambientTemperatureK,294,120,600),oxygenReference:m(w(e.oxygenReference,.21),.001,1),temperatureK:T(e.temperatureK,a,"temperatureK",294),fuel:T(e.fuel,a,"fuel",0),oxygenFraction:T(e.oxygenFraction,a,"oxygenFraction",.21),smoke:T(e.smoke,a,"smoke",0),water:T(e.water,a,"water",0),heatRelease:T(e.heatRelease,a,"heatRelease",0),windX:T(e.windX,a,"windX",0),windY:T(e.windY,a,"windY",0)}}function P(t){return{schema:U,sequence:t.sequence,elapsedTime:t.elapsedTime,width:t.width,height:t.height,ambientTemperatureK:t.ambientTemperatureK,oxygenReference:t.oxygenReference,temperatureK:[...t.temperatureK],fuel:[...t.fuel],oxygenFraction:[...t.oxygenFraction],smoke:[...t.smoke],water:[...t.water],heatRelease:[...t.heatRelease],windX:[...t.windX],windY:[...t.windY]}}function ie(t){const e=t.width*t.height,r=new Float32Array(e*8);for(let n=0;n<e;n+=1){const a=n*8;r[a]=t.temperatureK[n],r[a+1]=t.fuel[n],r[a+2]=t.oxygenFraction[n],r[a+3]=t.water[n],r[a+4]=t.smoke[n],r[a+5]=t.windX[n],r[a+6]=t.windY[n],r[a+7]=t.heatRelease[n]}return r}function oe(t,e){const r=t.width*t.height;for(let n=0;n<r;n+=1){const a=n*8;t.temperatureK[n]=e[a],t.fuel[n]=e[a+1],t.oxygenFraction[n]=e[a+2],t.water[n]=e[a+3],t.smoke[n]=e[a+4],t.windX[n]=e[a+5],t.windY[n]=e[a+6],t.heatRelease[n]=e[a+7]}}function ue(t={}){const e=t.environment||{},r=t.coupling||{},n=r.wind||r.hydroWind||[0,0];return{dt:w(t.dt,1/45,0,.25),ambientTemperatureK:w(e.ambientTemperatureK,294,120,600),oxygenBoundary:m(w(e.oxygenFraction,.21),0,1),waterContact:m(w(r.waterContact??r.coolingPotential,0),0,1.5),radiativeHeatFlux:w(r.radiativeHeatFlux,0,-5e3,5e3),windX:w(n[0],0,-100,100),windY:w(n[1],.2,-100,100),ignition:m(w(r.fireIntensity,.7),0,2),spreadRate:w(t.spreadRate??r.spreadRate,.62,0,4)}}function G(t={}){const e=H(t),r=e.width*e.height;let n=0,a=0,i=0,s=0,u=0,o=0,l=0,h=0,c=0,d=0,g=0,b=0;const K=w(e.ambientTemperatureK,294,120,600),E=Math.max(.001,m(w(e.oxygenReference,.21),.001,1));for(let p=0;p<r;p+=1){const M=e.temperatureK[p],x=p%e.width,y=Math.floor(p/e.width),v=x/Math.max(1,e.width-1)-.5,C=y/Math.max(1,e.height-1)-.5,f=Math.max(0,e.smoke[p]);n+=M,a=Math.max(a,M),M>650&&e.fuel[p]>.03&&(i+=1),s+=f,u+=e.fuel[p],o+=e.oxygenFraction[p],l+=e.water[p],h+=e.heatRelease[p],c+=v*f,d+=C*f,g+=f,b+=Math.max(0,M-K)*f}o/=Math.max(1,r);const S=g>1e-9?c/g:0,k=g>1e-9?d/g:0;return{schema:"peercompute.multiscale.combustion-plume.diagnostics.v0",width:e.width,height:e.height,cellCount:r,meanTemperatureK:n/Math.max(1,r),maxTemperatureK:a,fireAreaFraction:i/Math.max(1,r),smokeColumn:s/Math.max(1,r),fuelRemaining:u/Math.max(1,r),oxygenMean:o,oxygenDepletion:m(1-o/E,0,1),waterMean:l/Math.max(1,r),heatReleaseMean:h/Math.max(1,r),smokeCentroidX:S,smokeCentroidY:k,plumeRise:m(k+.5,0,1),buoyancyFlux:b/Math.max(1,r),suppressionMean:l/Math.max(1,r)}}class le{constructor(e){this.stateKey=e,this.device=null,this.pipeline=null,this.currentBuffer=null,this.nextBuffer=null,this.readBuffer=null,this.paramBuffer=null,this.width=0,this.height=0,this.submittedSteps=0,this.lastError=null}async initialize(e,r){var o,l,h,c,d,g;if(this.device&&this.width===e&&this.height===r)return;const n=(o=globalThis.navigator)==null?void 0:o.gpu;if(!n)throw new Error("WebGPU unavailable for combustion plume worker");const a=globalThis.GPUBufferUsage;if(!a)throw new Error("GPUBufferUsage unavailable for combustion plume worker");const i=await n.requestAdapter({powerPreference:"high-performance"});if(!i)throw new Error("No WebGPU adapter available for combustion plume worker");this.device=await i.requestDevice(),this.width=e,this.height=r;const s=e*r*8*Float32Array.BYTES_PER_ELEMENT;this.currentBuffer=this.device.createBuffer({size:s,usage:a.STORAGE|a.COPY_DST}),this.nextBuffer=this.device.createBuffer({size:s,usage:a.STORAGE|a.COPY_SRC}),this.readBuffer=this.device.createBuffer({size:s,usage:a.COPY_DST|a.MAP_READ}),this.paramBuffer=this.device.createBuffer({size:te,usage:a.UNIFORM|a.COPY_DST}),(h=(l=this.device).pushErrorScope)==null||h.call(l,"validation"),this.pipeline=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:re}),entryPoint:"main"}});const u=await((d=(c=this.device).popErrorScope)==null?void 0:d.call(c));if(u)throw new Error(`Combustion plume WebGPU validation: ${u.message||u}`);(g=this.device.lost)==null||g.then(b=>{this.lastError=(b==null?void 0:b.message)||(b==null?void 0:b.reason)||"Combustion plume WebGPU device lost",A.set(this.stateKey,this.lastError)})}async step(e,r){var c,d;await this.initialize(e.width,e.height);const n=globalThis.GPUMapMode;if(!n)throw new Error("GPUMapMode unavailable for combustion plume worker");const a=ie(e),i=new Float32Array([e.width,e.height,r.dt,r.ambientTemperatureK,r.oxygenBoundary,r.waterContact,r.radiativeHeatFlux,r.windX,r.windY,r.ignition,r.spreadRate,0]),s=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.currentBuffer}},{binding:1,resource:{buffer:this.nextBuffer}},{binding:2,resource:{buffer:this.paramBuffer}}]});this.device.queue.writeBuffer(this.currentBuffer,0,a),this.device.queue.writeBuffer(this.paramBuffer,0,i);const u=this.device.createCommandEncoder(),o=u.beginComputePass();o.setPipeline(this.pipeline),o.setBindGroup(0,s),o.dispatchWorkgroups(Math.ceil(e.width*e.height/z)),o.end(),u.copyBufferToBuffer(this.nextBuffer,0,this.readBuffer,0,a.byteLength),this.device.queue.submit([u.finish()]),await((d=(c=this.device.queue).onSubmittedWorkDone)==null?void 0:d.call(c)),await this.readBuffer.mapAsync(n.READ);const l=this.readBuffer.getMappedRange(),h=new Float32Array(l).slice();return this.readBuffer.unmap(),oe(e,h),e.elapsedTime+=r.dt,this.submittedSteps+=1,{backend:"webgpu-combustion-plume",webgpuStatus:{stateKey:this.stateKey,width:e.width,height:e.height,cellCount:e.width*e.height,submittedSteps:this.submittedSteps}}}}function me(t,e){const r=P(t);for(let n=0;n<t.height;n+=1)for(let a=0;a<t.width;a+=1){const i=R(a,n,t.width),s=R(D(a+1,t.width),n,t.width),u=R(D(a-1,t.width),n,t.width),o=R(a,D(n+1,t.height),t.width),l=R(a,D(n-1,t.height),t.width),h=a/Math.max(1,t.width-1)-.5,c=n/Math.max(1,t.height-1)-.5,d=Math.exp(-(h*h+c*c)*22)*e.ignition,g=(t.temperatureK[s]+t.temperatureK[u]+t.temperatureK[o]+t.temperatureK[l])*.25,b=(t.smoke[s]+t.smoke[u]+t.smoke[o]+t.smoke[l])*.25,K=(t.oxygenFraction[s]+t.oxygenFraction[u]+t.oxygenFraction[o]+t.oxygenFraction[l])*.25,E=(t.fuel[s]+t.fuel[u]+t.fuel[o]+t.fuel[l])*.25,S=Math.abs(e.windY)>=Math.abs(e.windX);let k=t.width>0?u:i;S?k=e.windY>=0?l:o:k=e.windX>=0?u:s;const p=m(Math.hypot(e.windX,e.windY)*e.dt*.075,0,.28);let M=m(t.fuel[i]+(E-t.fuel[i])*e.dt*.04,0,2),x=m(t.oxygenFraction[i]+(K-t.oxygenFraction[i])*e.dt*.18+(e.oxygenBoundary-t.oxygenFraction[i])*e.dt*.12,0,1),y=m(t.smoke[i]+(b-t.smoke[i])*e.dt*.26,0,2),v=m(t.water[i]+e.waterContact*e.dt*(.08+d*.25)-Math.max(t.temperatureK[i]-373.15,0)*t.water[i]*e.dt*35e-5,0,1.5);const C=m((t.temperatureK[i]-520)/820,0,1),f=m(x/.21,0,2),L=m(1-v*.72,0,1),O=m((C*e.spreadRate+d*.55)*f*M*L,0,2.2),F=Math.min(M,O*e.dt*.052),$=Math.min(x,F*.64),Y=F*6800,V=e.radiativeHeatFlux*e.dt*.025,j=v*Math.max(t.temperatureK[i]-340,0)*e.dt*.38,Z=Math.max(t.temperatureK[i]-e.ambientTemperatureK,0)*e.dt*.2,J=(g-t.temperatureK[i])*e.dt*.24,I=m(C*y*e.dt*.18,0,.08);M=Math.max(0,M-F),x=Math.max(0,x-$),x=m(x+(t.oxygenFraction[k]-x)*p*.65,0,1),r.temperatureK[i]=m(t.temperatureK[i]+Y+V+J-j-Z,e.ambientTemperatureK,2600),r.temperatureK[i]=m(r.temperatureK[i]+(t.temperatureK[k]-r.temperatureK[i])*p+(t.temperatureK[l]-r.temperatureK[i])*I*.35,e.ambientTemperatureK,2600),y=m(y+F*1.35-y*e.dt*(.08+v*.04),0,2),y=m(y+(t.smoke[k]-y)*p+(t.smoke[l]-y)*I,0,2),r.fuel[i]=M,r.oxygenFraction[i]=x,r.water[i]=v,r.smoke[i]=y,r.windX[i]=e.windX,r.windY[i]=e.windY,r.heatRelease[i]=Y/Math.max(e.dt,1e-9)}return r.elapsedTime+=e.dt,r}async function se(t,{stateKey:e,input:r,options:n}){const a=t.width*t.height;if(r.enableWebGPU!==!1&&r.webgpu!==!1&&a<=B(r.webgpuMaxCells,16384,1,1048576)&&!A.has(e))try{let o=W.get(e);return o||(o=new le(e),W.set(e,o)),{...await o.step(t,n),webgpuError:null}}catch(o){A.set(e,o instanceof Error?o.message:String(o))}const u=me(t,n);return Object.assign(t,u),{backend:"cpu-combustion-plume",webgpuStatus:null,webgpuError:A.get(e)||null}}function ce(t={}){var r,n;const e=t.input||t;return{payload:t,input:e,stateKey:t.stateKey||e.stateKey||e.taskId||X,scope:e.scope||t.scope||((n=(r=t.solver)==null?void 0:r.warmDelta)==null?void 0:n.scope)||ee,taskId:e.taskId||t.stateKey||e.stateKey||X,emitCommitDelta:e.emitCommitDelta===!0||t.emitCommitDelta===!0}}function he({payload:t,input:e,stateKey:r,state:n,diagnostics:a,conservation:i,backend:s,webgpuStatus:u,webgpuError:o}){var l,h,c;return{schema:((h=(l=t.solver)==null?void 0:l.warmDelta)==null?void 0:h.schema)||Q,solverId:((c=t.solver)==null?void 0:c.id)||"combustion-plume",stateKey:r,backend:s,sequence:n.sequence,elapsedTime:n.elapsedTime,width:n.width,height:n.height,cellCount:n.width*n.height,diagnostics:a,conservation:i,state:P(n),webgpuStatus:u,webgpuError:o,units:{temperature:"K",fuel:"reduced mass fraction",smoke:"reduced soot/smoke fraction",heatRelease:e.heatReleaseUnit||"reduced W/m^3"}}}function pe(t={}){if(t.stateKey||t.taskId){const e=t.stateKey||t.taskId;_.delete(e),W.delete(e),A.delete(e)}else _.clear(),W.clear(),A.clear();return{ok:!0,schema:N,executionContext:q()}}async function we(t={}){var g;const e=ce(t),{input:r,stateKey:n}=e,a=r.reset===!0,i=r.state||a||!_.has(n)?H(r):P(_.get(n)),s=ue(r);i.ambientTemperatureK=s.ambientTemperatureK,i.oxygenReference=Math.max(.001,s.oxygenBoundary);const u=G(i),o=await se(i,{stateKey:n,input:r,options:s});i.ambientTemperatureK=s.ambientTemperatureK,i.oxygenReference=Math.max(.001,s.oxygenBoundary),i.sequence+=1,_.set(n,P(i));const l=G(i),h={fuelDelta:l.fuelRemaining-u.fuelRemaining,smokeDelta:l.smokeColumn-u.smokeColumn,heatReleaseDelta:l.heatReleaseMean-u.heatReleaseMean,energyMode:"reduced-combustion-plume",note:"Reduced interactive combustion/plume tile; not closed enthalpy conservation."},c=P(i),d={ok:!0,schema:N,executionContext:q(),solverId:((g=t.solver)==null?void 0:g.id)||"combustion-plume",stateKey:n,backend:o.backend,sequence:c.sequence,elapsedTime:c.elapsedTime,state:c,diagnostics:l,conservation:h,webgpuStatus:o.webgpuStatus,webgpuError:o.webgpuError};return e.emitCommitDelta?{value:d,commitDelta:{taskId:e.taskId,scope:e.scope,version:c.sequence,timestamp:Date.now(),payload:he({payload:e.payload,input:r,stateKey:n,state:c,diagnostics:l,conservation:h,backend:d.backend,webgpuStatus:d.webgpuStatus,webgpuError:d.webgpuError})}}:d}export{Q as COMBUSTION_PLUME_DELTA_SCHEMA,N as COMBUSTION_PLUME_RESULT_SCHEMA,U as COMBUSTION_PLUME_STATE_SCHEMA,de as COMBUSTION_PLUME_WEBGPU_MAX_CELLS,G as computeCombustionPlumeDiagnostics,ae as makeCombustionPlumeInitialState,pe as resetCombustionPlume,we as stepCombustionPlume};

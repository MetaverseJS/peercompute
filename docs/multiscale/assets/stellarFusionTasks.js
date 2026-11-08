const N="peercompute.multiscale.stellar-fusion.state.v0",z="peercompute.multiscale.stellar-fusion.result.v0",Z="peercompute.multiscale.stellar-fusion.delta.v0",he=16384,q="multiscale:stellar-fusion:default",Q="multiscale-solver-deltas";const ee=12*Float32Array.BYTES_PER_ELEMENT,Y=64,D=new Map,G=new Map,C=new Map,te=`
struct Cell {
  thermo: vec4f,
  composition: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  stellarFlux: f32,
  gravityMps2: f32,
  metallicity: f32,
  coreTemperatureBias: f32,
  densityCompression: f32,
  radiationPressure: f32,
  opacity: f32,
  magneticActivity: f32,
  pad0: f32,
};

@group(0) @binding(0) var<storage, read> currentCells: array<Cell>;
@group(0) @binding(1) var<storage, read_write> nextCells: array<Cell>;
@group(0) @binding(2) var<uniform> params: Params;

fn cell_index(x: u32, y: u32, width: u32) -> u32 {
  return y * width + x;
}

@compute @workgroup_size(${Y})
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
  let r2 = u * u * 1.15 + v * v * 1.7;
  let coreWeight = exp(-r2 * 9.0);

  var temperatureK = clamp(cell.thermo.x, 4500.0, 36000000.0);
  var densityKgM3 = clamp(cell.thermo.y, 1.0, 420000.0);
  var energyDensity = max(0.0, cell.thermo.z);
  var pressurePa = max(0.0, cell.thermo.w);
  var hydrogen = clamp(cell.composition.x, 0.0, 0.95);
  var helium = clamp(cell.composition.y, 0.0, 0.98);

  let neighborTemp = (right.thermo.x + left.thermo.x + up.thermo.x + down.thermo.x) * 0.25;
  let neighborDensity = (right.thermo.y + left.thermo.y + up.thermo.y + down.thermo.y) * 0.25;
  let targetCoreTemp = 15500000.0 * (0.78 + params.coreTemperatureBias * 0.34);
  let tempNorm = clamp(temperatureK / max(1000000.0, targetCoreTemp), 0.02, 3.2);
  let densityNorm = clamp(densityKgM3 / 148000.0, 0.0, 4.0);
  let metalDamp = clamp(1.0 - params.metallicity * 1.8, 0.74, 1.06);
  let magneticBoost = 1.0 + clamp(params.magneticActivity, 0.0, 3.0) * 0.018;
  let fusionRate = clamp(
    densityNorm * hydrogen * hydrogen * pow(tempNorm, 4.0) * coreWeight
      * (0.62 + params.stellarFlux * 0.38) * metalDamp * magneticBoost,
    0.0,
    9.0
  );
  let hydrogenBurn = min(hydrogen, fusionRate * dt * 0.000016);
  let heliumGain = hydrogenBurn * 0.97;
  let neutrinoLoss = fusionRate * densityKgM3 * 0.014 * (1.0 + tempNorm * 0.08);
  let temperatureGain = fusionRate * dt * (85000.0 + params.stellarFlux * 55000.0);
  let compressionHeat = params.densityCompression * coreWeight * 4200.0 * dt;
  let radiativeTransport = (neighborTemp - temperatureK) * dt * 0.035;
  let surfaceCooling = (1.0 - coreWeight) * max(temperatureK - 5800.0, 0.0) * dt * (0.012 + params.opacity * 0.002);
  let radiationPressureCooling = params.radiationPressure * dt * 120.0;

  hydrogen = max(0.0, hydrogen - hydrogenBurn);
  helium = clamp(helium + heliumGain, 0.0, 0.98);
  densityKgM3 = clamp(
    densityKgM3
      + (neighborDensity - densityKgM3) * dt * 0.018
      + coreWeight * params.gravityMps2 * dt * (1.7 + params.densityCompression * 1.2)
      - params.radiationPressure * dt * 0.85
      - fusionRate * dt * 2.5,
    1.0,
    420000.0
  );
  temperatureK = clamp(
    temperatureK + temperatureGain + compressionHeat + radiativeTransport - surfaceCooling - radiationPressureCooling - neutrinoLoss * dt * 0.000001,
    4500.0,
    36000000.0
  );
  let meanMolecularWeight = clamp(0.5 + hydrogen * 0.74 + helium * 0.25 + params.metallicity * 0.08, 0.25, 1.4);
  pressurePa = densityKgM3 * temperatureK * 8.314 * meanMolecularWeight * 820.0;
  energyDensity = max(0.0, energyDensity + hydrogenBurn * densityKgM3 * 640000000000.0 - neutrinoLoss * dt * 14000000.0 + radiativeTransport * densityKgM3 * 0.006);

  nextCells[index].thermo = vec4f(temperatureK, densityKgM3, energyDensity, pressurePa);
  nextCells[index].composition = vec4f(hydrogen, helium, fusionRate, neutrinoLoss);
}
`;function $(){const t=globalThis.self,e=globalThis.WorkerGlobalScope;return t&&e&&t instanceof e?"dedicated-worker":"inline"}function y(t,e,r){return Math.min(r,Math.max(e,t))}function w(t,e,r=-Number.MAX_VALUE,n=Number.MAX_VALUE){const i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(r,i)):e}function P(t,e,r=1,n=Number.MAX_SAFE_INTEGER){const i=Math.floor(Number(t));return Number.isFinite(i)?Math.min(n,Math.max(r,i)):e}function re(t=1){let e=Number(t)>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function K(t,e,r){return e*r+t}function R(t,e){return(t+e)%e}function F(t,e,r,n=0){const i=Array.from(t||new Array(e).fill(n),s=>Number(s));if(i.length!==e)throw new Error(`${r} length ${i.length} does not match expected ${e}`);if(i.some(s=>!Number.isFinite(s)))throw new Error(`${r} contains non-finite values`);return i}function W(t,e,r,n){const i=t/Math.max(1,r-1)-.5,s=e/Math.max(1,n-1)-.5;return Math.exp(-(i*i*1.15+s*s*1.7)*9)}function X({temperatureK:t,densityKgM3:e,hydrogenFraction:r,coreWeight:n,options:i}){const s=155e5*(.78+i.coreTemperatureBias*.34),c=y(t/Math.max(1e6,s),.02,3.2),u=y(e/148e3,0,4),o=y(1-i.metallicity*1.8,.74,1.06),a=1+y(i.magneticActivity,0,3)*.018;return y(u*r*r*Math.pow(c,4)*n*(.62+i.stellarFlux*.38)*o*a,0,9)}function V({densityKgM3:t,temperatureK:e,hydrogenFraction:r,heliumFraction:n,metallicity:i}){const s=y(.5+r*.74+n*.25+i*.08,.25,1.4);return Math.max(0,t*e*8.314*s*820)}function ie({width:t=18,height:e=10,seed:r=20260529,environment:n={},coupling:i={}}={}){const s=P(t,18,4,128),c=P(e,Math.max(4,Math.round(s/2)),4,128),u=s*c,o=re(r),a=w(n.stellarFlux,1,.2,3),m=w(i.metallicity??n.metallicity,.013,0,.08),d=w(i.coreTemperatureBias,1,.4,1.8),f={stellarFlux:a,metallicity:m,coreTemperatureBias:d,magneticActivity:w(i.magneticActivity,0,0,3)},l=new Array(u),h=new Array(u),x=new Array(u),M=new Array(u),g=new Array(u),b=new Array(u),L=new Array(u),A=new Array(u);for(let E=0;E<c;E+=1)for(let v=0;v<s;v+=1){const p=K(v,E,s),S=W(v,E,s,c),T=(o()-.5)*.035,B=y(1-Math.sqrt((v/Math.max(1,s-1)-.5)**2+(E/Math.max(1,c-1)-.5)**2)*2.2,0,1);l[p]=y(5800+S*152e5*(.72+a*.28)+B*12e5+T*24e4,4500,36e6),h[p]=y(220+S*148e3+B*8e3+T*1200,1,42e4),x[p]=y(.704-S*.018+T*.01,.1,.92),M[p]=y(.276+S*.015-T*.004,.02,.9),b[p]=V({densityKgM3:h[p],temperatureK:l[p],hydrogenFraction:x[p],heliumFraction:M[p],metallicity:m}),g[p]=h[p]*l[p]*.012,L[p]=X({temperatureK:l[p],densityKgM3:h[p],hydrogenFraction:x[p],coreWeight:S,options:f}),A[p]=L[p]*h[p]*.014}return{schema:N,sequence:0,elapsedTime:0,width:s,height:c,temperatureK:l,densityKgM3:h,hydrogenFraction:x,heliumFraction:M,energyDensity:g,pressurePa:b,fusionRate:L,neutrinoLoss:A}}function j(t={}){const e=t.state||t;if(!e.temperatureK||!e.densityKgM3)return ie(t);const r=P(e.width,18,4,128),n=P(e.height,Math.max(4,Math.round(r/2)),4,128),i=r*n;return{schema:N,sequence:P(e.sequence,0,0),elapsedTime:w(e.elapsedTime,0,0),width:r,height:n,temperatureK:F(e.temperatureK,i,"temperatureK",5800),densityKgM3:F(e.densityKgM3,i,"densityKgM3",1e3),hydrogenFraction:F(e.hydrogenFraction,i,"hydrogenFraction",.7),heliumFraction:F(e.heliumFraction,i,"heliumFraction",.28),energyDensity:F(e.energyDensity,i,"energyDensity",0),pressurePa:F(e.pressurePa,i,"pressurePa",0),fusionRate:F(e.fusionRate,i,"fusionRate",0),neutrinoLoss:F(e.neutrinoLoss,i,"neutrinoLoss",0)}}function k(t){return{schema:N,sequence:t.sequence,elapsedTime:t.elapsedTime,width:t.width,height:t.height,temperatureK:[...t.temperatureK],densityKgM3:[...t.densityKgM3],hydrogenFraction:[...t.hydrogenFraction],heliumFraction:[...t.heliumFraction],energyDensity:[...t.energyDensity],pressurePa:[...t.pressurePa],fusionRate:[...t.fusionRate],neutrinoLoss:[...t.neutrinoLoss]}}function ne(t){const e=t.width*t.height,r=new Float32Array(e*8);for(let n=0;n<e;n+=1){const i=n*8;r[i]=t.temperatureK[n],r[i+1]=t.densityKgM3[n],r[i+2]=t.energyDensity[n],r[i+3]=t.pressurePa[n],r[i+4]=t.hydrogenFraction[n],r[i+5]=t.heliumFraction[n],r[i+6]=t.fusionRate[n],r[i+7]=t.neutrinoLoss[n]}return r}function se(t,e){const r=t.width*t.height;for(let n=0;n<r;n+=1){const i=n*8;t.temperatureK[n]=e[i],t.densityKgM3[n]=e[i+1],t.energyDensity[n]=e[i+2],t.pressurePa[n]=e[i+3],t.hydrogenFraction[n]=e[i+4],t.heliumFraction[n]=e[i+5],t.fusionRate[n]=e[i+6],t.neutrinoLoss[n]=e[i+7]}}function H(t={}){const e=j(t),r=e.width*e.height;let n=0,i=0,s=0,c=0,u=0,o=0,a=0,m=0,d=0,f=0,l=0,h=0;for(let x=0;x<e.height;x+=1)for(let M=0;M<e.width;M+=1){const g=K(M,x,e.width),b=W(M,x,e.width,e.height);n+=e.temperatureK[g],i+=e.densityKgM3[g],s+=e.hydrogenFraction[g],c+=e.heliumFraction[g],u+=e.pressurePa[g],o+=e.energyDensity[g],a+=e.fusionRate[g]*e.densityKgM3[g],m+=e.neutrinoLoss[g],d=Math.max(d,e.fusionRate[g]),f+=e.temperatureK[g]*b,l+=e.densityKgM3[g]*b,h+=b}return n/=Math.max(1,r),i/=Math.max(1,r),s/=Math.max(1,r),c/=Math.max(1,r),u/=Math.max(1,r),a/=Math.max(1,r),m/=Math.max(1,r),f/=Math.max(1e-9,h),l/=Math.max(1e-9,h),{schema:"peercompute.multiscale.stellar-fusion.diagnostics.v0",width:e.width,height:e.height,cellCount:r,meanTemperatureK:n,coreTemperatureK:f,meanDensityKgM3:i,coreDensityKgM3:l,meanHydrogenFraction:s,meanHeliumFraction:c,meanPressurePa:u,totalEnergyDensity:o,fusionPowerProxy:a,neutrinoLossProxy:m,luminosityProxy:Math.max(0,a-m*.001),meanFusionRate:a/Math.max(1,i),maxFusionRate:d}}class ae{constructor(e){this.stateKey=e,this.device=null,this.pipeline=null,this.currentBuffer=null,this.nextBuffer=null,this.readBuffer=null,this.paramBuffer=null,this.width=0,this.height=0,this.submittedSteps=0,this.lastError=null}async initialize(e,r){var o,a,m,d,f,l;if(this.device&&this.width===e&&this.height===r)return;const n=(o=globalThis.navigator)==null?void 0:o.gpu;if(!n)throw new Error("WebGPU unavailable for stellar-fusion worker");const i=globalThis.GPUBufferUsage;if(!i)throw new Error("GPUBufferUsage unavailable for stellar-fusion worker");const s=await n.requestAdapter({powerPreference:"high-performance"});if(!s)throw new Error("No WebGPU adapter available for stellar-fusion worker");this.device=await s.requestDevice(),this.width=e,this.height=r;const c=e*r*8*Float32Array.BYTES_PER_ELEMENT;this.currentBuffer=this.device.createBuffer({size:c,usage:i.STORAGE|i.COPY_DST}),this.nextBuffer=this.device.createBuffer({size:c,usage:i.STORAGE|i.COPY_SRC|i.COPY_DST}),this.readBuffer=this.device.createBuffer({size:c,usage:i.COPY_DST|i.MAP_READ}),this.paramBuffer=this.device.createBuffer({size:ee,usage:i.UNIFORM|i.COPY_DST}),(m=(a=this.device).pushErrorScope)==null||m.call(a,"validation"),this.pipeline=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:te}),entryPoint:"main"}});const u=await((f=(d=this.device).popErrorScope)==null?void 0:f.call(d));if(u)throw new Error(`Stellar fusion WebGPU validation: ${u.message||u}`);(l=this.device.lost)==null||l.then(h=>{this.lastError=(h==null?void 0:h.message)||(h==null?void 0:h.reason)||"Stellar fusion WebGPU device lost",C.set(this.stateKey,this.lastError)})}async step(e,r){var f,l;await this.initialize(e.width,e.height);const n=globalThis.GPUMapMode;if(!n)throw new Error("GPUMapMode unavailable for stellar-fusion worker");const i=ne(e),s=new Float32Array([e.width,e.height,r.dt,r.stellarFlux,r.gravityMps2,r.metallicity,r.coreTemperatureBias,r.densityCompression,r.radiationPressure,r.opacity,r.magneticActivity,0]),c=Math.ceil(e.width*e.height/Y),u=this.device.createCommandEncoder(),o=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.currentBuffer}},{binding:1,resource:{buffer:this.nextBuffer}},{binding:2,resource:{buffer:this.paramBuffer}}]});this.device.queue.writeBuffer(this.currentBuffer,0,i),this.device.queue.writeBuffer(this.paramBuffer,0,s);const a=u.beginComputePass();a.setPipeline(this.pipeline),a.setBindGroup(0,o),a.dispatchWorkgroups(c),a.end(),u.copyBufferToBuffer(this.nextBuffer,0,this.readBuffer,0,i.byteLength),this.device.queue.submit([u.finish()]),await((l=(f=this.device.queue).onSubmittedWorkDone)==null?void 0:l.call(f)),await this.readBuffer.mapAsync(n.READ);const m=this.readBuffer.getMappedRange(),d=new Float32Array(m).slice();return this.readBuffer.unmap(),se(e,d),e.elapsedTime+=r.dt,this.submittedSteps+=1,{backend:"webgpu-stellar-fusion",webgpuStatus:{stateKey:this.stateKey,width:e.width,height:e.height,cellCount:e.width*e.height,submittedSteps:this.submittedSteps}}}}function oe(t={}){const e=t.environment||{},r=t.coupling||{};return{dt:w(t.dt,1/90,0,.25),stellarFlux:w(e.stellarFlux??t.stellarFlux,1,.2,3),gravityMps2:w(e.gravityMps2??t.gravityMps2,9.8,0,28),metallicity:w(r.metallicity??e.metallicity??t.metallicity,.013,0,.08),coreTemperatureBias:w(r.coreTemperatureBias??t.coreTemperatureBias,1,.4,1.8),densityCompression:w(r.densityCompression??t.densityCompression,.35,0,2.5),radiationPressure:w(r.radiationPressure??t.radiationPressure,1,0,4),opacity:w(r.opacity??t.opacity,.08,0,3),magneticActivity:w(r.magneticActivity??t.magneticActivity,0,0,3)}}function ue(t,e){const r=k(t);for(let n=0;n<t.height;n+=1)for(let i=0;i<t.width;i+=1){const s=K(i,n,t.width),c=K(R(i+1,t.width),n,t.width),u=K(R(i-1,t.width),n,t.width),o=K(i,R(n+1,t.height),t.width),a=K(i,R(n-1,t.height),t.width),m=W(i,n,t.width,t.height),d=(t.temperatureK[c]+t.temperatureK[u]+t.temperatureK[o]+t.temperatureK[a])*.25,f=(t.densityKgM3[c]+t.densityKgM3[u]+t.densityKgM3[o]+t.densityKgM3[a])*.25,l=y(t.temperatureK[s],4500,36e6),h=y(t.densityKgM3[s],1,42e4),x=y(t.hydrogenFraction[s],0,.95),M=y(t.heliumFraction[s],0,.98),g=X({temperatureK:l,densityKgM3:h,hydrogenFraction:x,coreWeight:m,options:e}),b=155e5*(.78+e.coreTemperatureBias*.34),L=y(l/Math.max(1e6,b),.02,3.2),A=Math.min(x,g*e.dt*16e-6),E=A*.97,v=g*h*.014*(1+L*.08),p=g*e.dt*(85e3+e.stellarFlux*55e3),S=e.densityCompression*m*4200*e.dt,T=(d-l)*e.dt*.035,B=(1-m)*Math.max(l-5800,0)*e.dt*(.012+e.opacity*.002),J=e.radiationPressure*e.dt*120,U=Math.max(0,x-A),O=y(M+E,0,.98),_=y(h+(f-h)*e.dt*.018+m*e.gravityMps2*e.dt*(1.7+e.densityCompression*1.2)-e.radiationPressure*e.dt*.85-g*e.dt*2.5,1,42e4),I=y(l+p+S+T-B-J-v*e.dt*1e-6,4500,36e6);r.temperatureK[s]=I,r.densityKgM3[s]=_,r.hydrogenFraction[s]=U,r.heliumFraction[s]=O,r.fusionRate[s]=g,r.neutrinoLoss[s]=v,r.pressurePa[s]=V({densityKgM3:_,temperatureK:I,hydrogenFraction:U,heliumFraction:O,metallicity:e.metallicity}),r.energyDensity[s]=Math.max(0,t.energyDensity[s]+A*_*64e10-v*e.dt*14e6+T*_*.006)}return r.elapsedTime+=e.dt,r}async function ce(t,{stateKey:e,input:r,options:n}){const i=t.width*t.height;if(r.enableWebGPU!==!1&&r.webgpu!==!1&&i<=P(r.webgpuMaxCells,16384,1,1048576)&&!C.has(e))try{let o=G.get(e);o||(o=new ae(e),G.set(e,o));const a=await o.step(t,n);return{backend:a.backend,webgpuStatus:a.webgpuStatus,webgpuError:null}}catch(o){C.set(e,o instanceof Error?o.message:String(o))}const u=ue(t,n);return Object.assign(t,u),{backend:"cpu-stellar-fusion",webgpuStatus:null,webgpuError:C.get(e)||null}}function le(t={}){var r,n;const e=t.input||t;return{payload:t,input:e,stateKey:t.stateKey||e.stateKey||e.taskId||q,scope:e.scope||t.scope||((n=(r=t.solver)==null?void 0:r.warmDelta)==null?void 0:n.scope)||Q,taskId:e.taskId||t.stateKey||e.stateKey||q,emitCommitDelta:e.emitCommitDelta===!0||t.emitCommitDelta===!0}}function me({payload:t,input:e,stateKey:r,state:n,diagnostics:i,conservation:s,backend:c,webgpuStatus:u,webgpuError:o}){var a,m,d;return{schema:((m=(a=t.solver)==null?void 0:a.warmDelta)==null?void 0:m.schema)||Z,solverId:((d=t.solver)==null?void 0:d.id)||"stellar-fusion",stateKey:r,backend:c,sequence:n.sequence,elapsedTime:n.elapsedTime,width:n.width,height:n.height,cellCount:n.width*n.height,diagnostics:i,conservation:s,state:n,webgpuStatus:u,webgpuError:o,units:{temperature:"K",density:"kg/m^3",pressure:"Pa",composition:"mass-fraction",energyDensity:e.energyDensityUnit||"reduced-J/m^3",time:e.timeUnit||"s"}}}function de(t={}){if(t.stateKey||t.taskId){const e=t.stateKey||t.taskId;D.delete(e),G.delete(e),C.delete(e)}else D.clear(),G.clear(),C.clear();return{ok:!0,schema:z,executionContext:$()}}async function ge(t={}){var l;const e=le(t),{input:r,stateKey:n}=e,i=r.reset===!0,s=r.state||i||!D.has(n)?j(r):k(D.get(n)),c=H(s),u=oe(r),o=await ce(s,{stateKey:n,input:r,options:u});s.sequence+=1,D.set(n,k(s));const a=H(s),m={hydrogenBurnedDelta:Math.max(0,c.meanHydrogenFraction-a.meanHydrogenFraction),heliumProducedDelta:a.meanHeliumFraction-c.meanHeliumFraction,fusionEnergyDelta:a.totalEnergyDensity-c.totalEnergyDensity,neutrinoLossProxy:a.neutrinoLossProxy,energyMode:"reduced-pp-chain-plasma",note:"Reduced interactive stellar-core tile; not a validated stellar-structure or nuclear network solve."},d=k(s),f={ok:!0,schema:z,executionContext:$(),solverId:((l=t.solver)==null?void 0:l.id)||"stellar-fusion",stateKey:n,backend:o.backend,sequence:d.sequence,elapsedTime:d.elapsedTime,state:d,diagnostics:a,conservation:m,webgpuStatus:o.webgpuStatus,webgpuError:o.webgpuError};return e.emitCommitDelta?{value:f,commitDelta:{taskId:e.taskId,scope:e.scope,version:d.sequence,timestamp:Date.now(),payload:me({payload:t,input:r,stateKey:n,state:d,diagnostics:a,conservation:m,backend:o.backend,webgpuStatus:o.webgpuStatus,webgpuError:o.webgpuError})}}:f}export{Z as STELLAR_FUSION_DELTA_SCHEMA,z as STELLAR_FUSION_RESULT_SCHEMA,N as STELLAR_FUSION_STATE_SCHEMA,he as STELLAR_FUSION_WEBGPU_MAX_CELLS,H as computeStellarFusionDiagnostics,ie as makeStellarFusionInitialState,de as resetStellarFusion,ge as stepStellarFusion};

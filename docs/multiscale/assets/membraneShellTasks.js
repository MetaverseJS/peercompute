const C="peercompute.multiscale.membrane-shell.state.v0",L="peercompute.multiscale.membrane-shell.result.v0",W="peercompute.multiscale.membrane-shell.delta.v0",ee=4096,I="multiscale:membrane-shell:default",U="multiscale-solver-deltas";const O=20*Float32Array.BYTES_PER_ELEMENT,G=64,T=new Map,F=new Map,v=new Map,q=`
struct Segment {
  mechanics: vec4f,
  motion: vec4f,
};

struct Params {
  count: f32,
  dt: f32,
  internalPressurePa: f32,
  ambientPressurePa: f32,
  waterTemperatureK: f32,
  flameTemperatureK: f32,
  fireIntensity: f32,
  radiativeHeatFlux: f32,
  gravityMps2: f32,
  inputIntegrity: f32,
  ruptured: f32,
  ambientTemperatureK: f32,
  steamMassKg: f32,
  waterMassKg: f32,
  youngModulusPa: f32,
  tensileLimitPa: f32,
  waterContact: f32,
  coolingPotential: f32,
  pad0: f32,
  pad1: f32,
};

@group(0) @binding(0) var<storage, read> currentSegments: array<Segment>;
@group(0) @binding(1) var<storage, read_write> nextSegments: array<Segment>;
@group(0) @binding(2) var<uniform> params: Params;

@compute @workgroup_size(${G})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  let count = u32(params.count);
  if (index >= count) {
    return;
  }

  let segment = currentSegments[index];
  var strain = segment.mechanics.x;
  var stressPa = segment.mechanics.y;
  var temperatureK = segment.mechanics.z;
  var damage = clamp(segment.mechanics.w, 0.0, 1.0);
  var displacement = segment.motion.x;
  var velocity = segment.motion.y;

  let dt = clamp(params.dt, 0.0, 0.1);
  let angle = (f32(index) / max(1.0, params.count)) * 6.28318530718;
  let fireAim = -0.72;
  let fireExposureBase = clamp((cos(angle - fireAim) + 1.0) * 0.5, 0.0, 1.0);
  let fireExposure = fireExposureBase * fireExposureBase;
  let pressureDelta = max(0.0, params.internalPressurePa - params.ambientPressurePa);
  let steamBoost = clamp(params.steamMassKg * 2.8, 0.0, 1.8);
  let waterCooling = clamp(params.waterMassKg * 0.7 + params.waterContact * 0.8 + params.coolingPotential * 0.5, 0.0, 2.0);
  let heatFlux = params.fireIntensity * fireExposure * max(0.0, params.flameTemperatureK - temperatureK) * 0.16
    + clamp(params.radiativeHeatFlux, -5000.0, 5000.0) * fireExposure * 0.008
    + (params.waterTemperatureK - temperatureK) * 0.22
    + (params.ambientTemperatureK - temperatureK) * 0.035
    - waterCooling * max(0.0, temperatureK - params.waterTemperatureK) * 0.18;
  temperatureK = clamp(temperatureK + heatFlux * dt, params.ambientTemperatureK, 900.0);

  let thermalSoftening = clamp(1.0 - max(0.0, temperatureK - 315.0) * 0.0035, 0.12, 1.0);
  let pressureStrain = pressureDelta / max(params.tensileLimitPa * 3.1, 1.0);
  let gravitySag = max(0.0, -sin(angle)) * params.gravityMps2 * 0.0009;
  let targetStrain = clamp(pressureStrain * (1.0 + steamBoost) + gravitySag + displacement * 0.12, 0.0, 0.45);
  let stiffness = max(1.0, params.youngModulusPa * thermalSoftening * (1.0 - damage * 0.72));
  let accel = (targetStrain - strain) * 18.0 - velocity * 3.2;
  velocity = velocity + accel * dt;
  strain = clamp(strain + velocity * dt, 0.0, 0.55);
  displacement = clamp(displacement + velocity * dt, -0.18, 0.42);
  stressPa = stiffness * strain;

  let limit = max(1.0, params.tensileLimitPa * thermalSoftening * (1.0 - damage * 0.25));
  let overStress = max(0.0, stressPa / limit - 0.56);
  let thermalDamage = max(0.0, temperatureK - 320.0) * dt * (0.00011 * fireExposure + 0.000025);
  let flameDamage = params.fireIntensity * fireExposure * dt * 0.006;
  let pressureDamage = overStress * overStress * dt * 0.03;
  damage = clamp(damage + thermalDamage + flameDamage + pressureDamage, 0.0, 1.0);
  if (params.ruptured > 0.5) {
    damage = clamp(damage + dt * 0.5, 0.0, 1.0);
    stressPa = stressPa * 0.22;
    strain = max(strain, 0.18);
  }

  nextSegments[index].mechanics = vec4f(strain, stressPa, temperatureK, damage);
  nextSegments[index].motion = vec4f(displacement, velocity, heatFlux, waterCooling);
}
`;function R(){const a=globalThis.self,e=globalThis.WorkerGlobalScope;return a&&e&&a instanceof e?"dedicated-worker":"inline"}function u(a,e,t){return Math.min(t,Math.max(e,a))}function p(a,e,t=-Number.MAX_VALUE,r=Number.MAX_VALUE){const n=Number(a);return Number.isFinite(n)?Math.min(r,Math.max(t,n)):e}function _(a,e,t=1,r=Number.MAX_SAFE_INTEGER){const n=Math.floor(Number(a));return Number.isFinite(n)?Math.min(r,Math.max(t,n)):e}function H(a=1){let e=Number(a)>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function S(a,e,t,r=0){const n=Array.from(a||new Array(e).fill(r),s=>Number(s));if(n.length!==e)throw new Error(`${t} length ${n.length} does not match expected ${e}`);if(n.some(s=>!Number.isFinite(s)))throw new Error(`${t} contains non-finite values`);return n}function V(a={}){const e=a.environment||{},t=a.coupling||{};return{dt:p(a.dt,1/90,0,.1),internalPressurePa:p(t.internalPressurePa,109e3,1,1e8),ambientPressurePa:p(e.ambientPressurePa,101325,1,1e8),waterTemperatureK:p(t.waterTemperatureK,294,1,2e4),flameTemperatureK:p(t.flameTemperatureK,1060,250,4e3),fireIntensity:u(p(t.fireIntensity,.78),0,2),radiativeHeatFlux:p(t.radiativeHeatFlux,0,-5e3,5e3),gravityMps2:p(e.gravityMps2,9.8,0,100),inputIntegrity:u(p(t.membraneIntegrity,1),0,1),ruptured:t.ruptured===!0?1:0,ambientTemperatureK:p(e.ambientTemperatureK,294,1,2e4),steamMassKg:p(t.steamMassKg,0,0,100),waterMassKg:p(t.waterMassKg,.42,0,100),youngModulusPa:p(a.youngModulusPa??t.youngModulusPa,16e5,1,1e11),tensileLimitPa:p(a.tensileLimitPa??t.tensileLimitPa,22e5,1,1e12),waterContact:u(p(t.waterContact,0),0,2),coolingPotential:u(p(t.coolingPotential,0),0,2)}}function z({segmentCount:a=64,seed:e=20260529,environment:t={},coupling:r={}}={}){const n=_(a,64,8,4096),s=H(e),g=p(t.ambientTemperatureK,294,1,2e4),i=p(r.waterTemperatureK,g,1,2e4),c=Math.max(0,p(r.internalPressurePa,109e3,1,1e8)-p(t.ambientPressurePa,101325,1,1e8)),m=u(c/9e6,.001,.08),h=new Array(n),o=new Array(n),d=new Array(n),f=new Array(n),y=new Array(n),M=new Array(n),b=new Array(n),E=new Array(n);for(let l=0;l<n;l+=1){const P=l/n*Math.PI*2,x=Math.max(0,Math.cos(P+.72)),w=(s()-.5)*.012;h[l]=u(m+w*.25,0,.12),o[l]=h[l]*16e5,d[l]=u(g*.62+i*.38+x*4+(s()-.5)*1.5,g,360),f[l]=u((s()-.5)*.006,0,.02),y[l]=0,M[l]=0,b[l]=0,E[l]=0}return{schema:C,sequence:0,elapsedTime:0,segmentCount:n,membraneIntegrity:u(p(r.membraneIntegrity,1),0,1),ruptured:r.ruptured===!0,strain:h,stressPa:o,temperatureK:d,damage:f,radialDisplacement:y,radialVelocity:M,heatFluxWm2:b,coolingFactor:E}}function N(a={}){var r,n;const e=a.state||a;if(!e.strain||!e.temperatureK)return z(a);const t=_(e.segmentCount||((r=e.strain)==null?void 0:r.length),64,8,4096);return{schema:C,sequence:_(e.sequence,0,0),elapsedTime:p(e.elapsedTime,0,0),segmentCount:t,membraneIntegrity:u(p(e.membraneIntegrity,((n=a.coupling)==null?void 0:n.membraneIntegrity)??1),0,1),ruptured:e.ruptured===!0,strain:S(e.strain,t,"strain",0),stressPa:S(e.stressPa,t,"stressPa",0),temperatureK:S(e.temperatureK,t,"temperatureK",294),damage:S(e.damage,t,"damage",0),radialDisplacement:S(e.radialDisplacement,t,"radialDisplacement",0),radialVelocity:S(e.radialVelocity,t,"radialVelocity",0),heatFluxWm2:S(e.heatFluxWm2,t,"heatFluxWm2",0),coolingFactor:S(e.coolingFactor,t,"coolingFactor",0)}}function K(a){return{schema:C,sequence:a.sequence,elapsedTime:a.elapsedTime,segmentCount:a.segmentCount,membraneIntegrity:a.membraneIntegrity,ruptured:a.ruptured,strain:[...a.strain],stressPa:[...a.stressPa],temperatureK:[...a.temperatureK],damage:[...a.damage],radialDisplacement:[...a.radialDisplacement],radialVelocity:[...a.radialVelocity],heatFluxWm2:[...a.heatFluxWm2],coolingFactor:[...a.coolingFactor]}}function Y(a){const e=new Float32Array(a.segmentCount*8);for(let t=0;t<a.segmentCount;t+=1){const r=t*8;e[r]=a.strain[t],e[r+1]=a.stressPa[t],e[r+2]=a.temperatureK[t],e[r+3]=a.damage[t],e[r+4]=a.radialDisplacement[t],e[r+5]=a.radialVelocity[t],e[r+6]=a.heatFluxWm2[t],e[r+7]=a.coolingFactor[t]}return e}function X(a,e){for(let t=0;t<a.segmentCount;t+=1){const r=t*8;a.strain[t]=e[r],a.stressPa[t]=e[r+1],a.temperatureK[t]=e[r+2],a.damage[t]=e[r+3],a.radialDisplacement[t]=e[r+4],a.radialVelocity[t]=e[r+5],a.heatFluxWm2[t]=e[r+6],a.coolingFactor[t]=e[r+7]}}function B(a={}){const e=N(a);let t=0,r=0,n=0,s=0,g=0,i=0,c=0,m=0,h=0,o=0;for(let l=0;l<e.segmentCount;l+=1){const P=e.temperatureK[l],x=Math.max(0,e.stressPa[l]),w=Math.max(0,e.strain[l]),A=u(e.damage[l],0,1);t+=P,r=Math.max(r,P),n+=x,s=Math.max(s,x),g+=w,i=Math.max(i,w),c+=A,m=Math.max(m,A),h+=e.heatFluxWm2[l],o+=e.coolingFactor[l]}const d=Math.max(1,e.segmentCount);t/=d,n/=d,g/=d,c/=d,h/=d,o/=d;const f=u((r-315)/170,0,1),y=u(i/.22,0,1),M=u(s/22e5,0,1),b=u(m*.52+c*.18+f*.14+y*.1+M*.06,0,1),E=e.ruptured?Math.min(e.membraneIntegrity,.08):u(Math.min(e.membraneIntegrity,1-m*.5-c*.28-f*.06),0,1);return{schema:"peercompute.multiscale.membrane-shell.diagnostics.v0",segmentCount:e.segmentCount,membraneIntegrity:E,ruptured:e.ruptured,meanTemperatureK:t,maxTemperatureK:r,meanStressPa:n,maxStressPa:s,meanStrain:g,maxStrain:i,damageMean:c,damageMax:m,heatFluxMean:h,coolingMean:o,ruptureRisk:b,burst:e.ruptured||E<.22||b>.93}}class ${constructor(e){this.stateKey=e,this.device=null,this.pipeline=null,this.currentBuffer=null,this.nextBuffer=null,this.readBuffer=null,this.paramBuffer=null,this.segmentCount=0,this.submittedSteps=0,this.lastError=null}async initialize(e){var i,c,m,h,o,d;if(this.device&&this.segmentCount===e)return;const t=(i=globalThis.navigator)==null?void 0:i.gpu;if(!t)throw new Error("WebGPU unavailable for membrane shell worker");const r=globalThis.GPUBufferUsage;if(!r)throw new Error("GPUBufferUsage unavailable for membrane shell worker");const n=await t.requestAdapter({powerPreference:"high-performance"});if(!n)throw new Error("No WebGPU adapter available for membrane shell worker");this.device=await n.requestDevice(),this.segmentCount=e;const s=e*8*Float32Array.BYTES_PER_ELEMENT;this.currentBuffer=this.device.createBuffer({size:s,usage:r.STORAGE|r.COPY_DST}),this.nextBuffer=this.device.createBuffer({size:s,usage:r.STORAGE|r.COPY_SRC}),this.readBuffer=this.device.createBuffer({size:s,usage:r.COPY_DST|r.MAP_READ}),this.paramBuffer=this.device.createBuffer({size:O,usage:r.UNIFORM|r.COPY_DST}),(m=(c=this.device).pushErrorScope)==null||m.call(c,"validation"),this.pipeline=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:q}),entryPoint:"main"}});const g=await((o=(h=this.device).popErrorScope)==null?void 0:o.call(h));if(g)throw new Error(`Membrane shell WebGPU validation: ${g.message||g}`);(d=this.device.lost)==null||d.then(f=>{this.lastError=(f==null?void 0:f.message)||(f==null?void 0:f.reason)||"Membrane shell WebGPU device lost",v.set(this.stateKey,this.lastError)})}async step(e,t){var o,d;await this.initialize(e.segmentCount);const r=globalThis.GPUMapMode;if(!r)throw new Error("GPUMapMode unavailable for membrane shell worker");const n=Y(e),s=new Float32Array([e.segmentCount,t.dt,t.internalPressurePa,t.ambientPressurePa,t.waterTemperatureK,t.flameTemperatureK,t.fireIntensity,t.radiativeHeatFlux,t.gravityMps2,t.inputIntegrity,t.ruptured,t.ambientTemperatureK,t.steamMassKg,t.waterMassKg,t.youngModulusPa,t.tensileLimitPa,t.waterContact,t.coolingPotential,0,0]),g=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.currentBuffer}},{binding:1,resource:{buffer:this.nextBuffer}},{binding:2,resource:{buffer:this.paramBuffer}}]});this.device.queue.writeBuffer(this.currentBuffer,0,n),this.device.queue.writeBuffer(this.paramBuffer,0,s);const i=this.device.createCommandEncoder(),c=i.beginComputePass();c.setPipeline(this.pipeline),c.setBindGroup(0,g),c.dispatchWorkgroups(Math.ceil(e.segmentCount/G)),c.end(),i.copyBufferToBuffer(this.nextBuffer,0,this.readBuffer,0,n.byteLength),this.device.queue.submit([i.finish()]),await((d=(o=this.device.queue).onSubmittedWorkDone)==null?void 0:d.call(o)),await this.readBuffer.mapAsync(r.READ);const m=this.readBuffer.getMappedRange(),h=new Float32Array(m).slice();return this.readBuffer.unmap(),X(e,h),e.elapsedTime+=t.dt,this.submittedSteps+=1,{backend:"webgpu-membrane-shell",webgpuStatus:{stateKey:this.stateKey,segmentCount:e.segmentCount,submittedSteps:this.submittedSteps}}}}function j(a,e){const t=K(a);for(let r=0;r<a.segmentCount;r+=1){const n=r/Math.max(1,a.segmentCount)*Math.PI*2,s=u((Math.cos(n+.72)+1)*.5,0,1)**2,g=Math.max(0,e.internalPressurePa-e.ambientPressurePa),i=u(e.steamMassKg*2.8,0,1.8),c=u(e.waterMassKg*.7+e.waterContact*.8+e.coolingPotential*.5,0,2),m=e.fireIntensity*s*Math.max(0,e.flameTemperatureK-a.temperatureK[r])*.16+e.radiativeHeatFlux*s*.008+(e.waterTemperatureK-a.temperatureK[r])*.22+(e.ambientTemperatureK-a.temperatureK[r])*.035-c*Math.max(0,a.temperatureK[r]-e.waterTemperatureK)*.18,h=u(a.temperatureK[r]+m*e.dt,e.ambientTemperatureK,900),o=u(1-Math.max(0,h-315)*.0035,.12,1),d=g/Math.max(e.tensileLimitPa*3.1,1),f=Math.max(0,-Math.sin(n))*e.gravityMps2*9e-4,y=u(d*(1+i)+f+a.radialDisplacement[r]*.12,0,.45);let M=a.radialVelocity[r]+((y-a.strain[r])*18-a.radialVelocity[r]*3.2)*e.dt,b=u(a.strain[r]+M*e.dt,0,.55),E=u(a.radialDisplacement[r]+M*e.dt,-.18,.42),l=Math.max(1,e.youngModulusPa*o*(1-a.damage[r]*.72))*b;const P=Math.max(1,e.tensileLimitPa*o*(1-a.damage[r]*.25)),x=Math.max(0,l/P-.56),w=Math.max(0,h-320)*e.dt*(11e-5*s+25e-6),A=e.fireIntensity*s*e.dt*.006,k=x*x*e.dt*.03;let D=u(a.damage[r]+w+A+k,0,1);e.ruptured>.5&&(D=u(D+e.dt*.5,0,1),l*=.22,b=Math.max(b,.18),M*=.65,E=Math.max(E,.15)),t.strain[r]=b,t.stressPa[r]=l,t.temperatureK[r]=h,t.damage[r]=D,t.radialDisplacement[r]=E,t.radialVelocity[r]=M,t.heatFluxWm2[r]=m,t.coolingFactor[r]=c}return t.elapsedTime+=e.dt,t}async function Z(a,{stateKey:e,input:t,options:r}){if(t.enableWebGPU!==!1&&t.webgpu!==!1&&a.segmentCount<=_(t.webgpuMaxSegments,4096,8,1048576)&&!v.has(e))try{let i=F.get(e);return i||(i=new $(e),F.set(e,i)),{...await i.step(a,r),webgpuError:null}}catch(i){v.set(e,i instanceof Error?i.message:String(i))}const g=j(a,r);return Object.assign(a,g),{backend:"cpu-membrane-shell",webgpuStatus:null,webgpuError:v.get(e)||null}}function J(a={}){var t,r;const e=a.input||a;return{payload:a,input:e,stateKey:a.stateKey||e.stateKey||e.taskId||I,scope:e.scope||a.scope||((r=(t=a.solver)==null?void 0:t.warmDelta)==null?void 0:r.scope)||U,taskId:e.taskId||a.stateKey||e.stateKey||I,emitCommitDelta:e.emitCommitDelta===!0||a.emitCommitDelta===!0}}function Q({payload:a,input:e,stateKey:t,state:r,diagnostics:n,conservation:s,backend:g,webgpuStatus:i,webgpuError:c}){var m,h,o;return{schema:((h=(m=a.solver)==null?void 0:m.warmDelta)==null?void 0:h.schema)||W,solverId:((o=a.solver)==null?void 0:o.id)||"membrane-shell",stateKey:t,backend:g,sequence:r.sequence,elapsedTime:r.elapsedTime,segmentCount:r.segmentCount,diagnostics:n,conservation:s,state:K(r),webgpuStatus:i,webgpuError:c,units:{temperature:"K",stress:"Pa",strain:"1",heatFlux:e.heatFluxUnit||"reduced W/m^2"}}}function te(a={}){if(a.stateKey||a.taskId){const e=a.stateKey||a.taskId;T.delete(e),F.delete(e),v.delete(e)}else T.clear(),F.clear(),v.clear();return{ok:!0,schema:L,executionContext:R()}}async function ae(a={}){var f;const e=J(a),{input:t,stateKey:r}=e,n=t.reset===!0,s=t.state||n||!T.has(r)?N(t):K(T.get(r)),g=V(t);s.membraneIntegrity=Math.min(s.membraneIntegrity,g.inputIntegrity),s.ruptured=s.ruptured||g.ruptured>.5;const i=B(s),c=await Z(s,{stateKey:r,input:t,options:g});let m=B(s);s.membraneIntegrity=Math.min(s.membraneIntegrity,m.membraneIntegrity),m.burst&&(s.ruptured=!0,s.membraneIntegrity=Math.min(s.membraneIntegrity,.08),m=B(s)),s.sequence+=1,T.set(r,K(s));const h={strainEnergyProxyDelta:m.meanStressPa*m.meanStrain-i.meanStressPa*i.meanStrain,heatFluxMeanDelta:m.heatFluxMean-i.heatFluxMean,damageDelta:m.damageMean-i.damageMean,energyMode:"reduced-membrane-shell",note:"Reduced thin-shell membrane worker; not a validated latex material or closed fracture-energy model."},o=K(s),d={ok:!0,schema:L,executionContext:R(),solverId:((f=a.solver)==null?void 0:f.id)||"membrane-shell",stateKey:r,backend:c.backend,sequence:o.sequence,elapsedTime:o.elapsedTime,state:o,diagnostics:m,conservation:h,webgpuStatus:c.webgpuStatus,webgpuError:c.webgpuError};return e.emitCommitDelta?{value:d,commitDelta:{taskId:e.taskId,scope:e.scope,version:o.sequence,timestamp:Date.now(),payload:Q({payload:e.payload,input:t,stateKey:r,state:o,diagnostics:m,conservation:h,backend:d.backend,webgpuStatus:d.webgpuStatus,webgpuError:d.webgpuError})}}:d}export{W as MEMBRANE_SHELL_DELTA_SCHEMA,L as MEMBRANE_SHELL_RESULT_SCHEMA,C as MEMBRANE_SHELL_STATE_SCHEMA,ee as MEMBRANE_SHELL_WEBGPU_MAX_SEGMENTS,B as computeMembraneShellDiagnostics,z as makeMembraneShellInitialState,te as resetMembraneShell,ae as stepMembraneShell};

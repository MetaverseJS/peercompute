const Z="peercompute.multiscale.magnetosphere-plasma.state.v0",j="peercompute.multiscale.magnetosphere-plasma.result.v0",se="peercompute.multiscale.magnetosphere-plasma.delta.v0",Me=16384,$="multiscale:magnetosphere-plasma:default",ce="multiscale-solver-deltas";const le=12*Float32Array.BYTES_PER_ELEMENT,J=64,H=new Map,I=new Map,k=new Map,oe=`
struct Cell {
  plasma: vec4f,
  field: vec4f,
  derived: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  stellarFlux: f32,
  luminosityFactor: f32,
  radiationPressure: f32,
  maxwellFieldEnergy: f32,
  poyntingX: f32,
  poyntingY: f32,
  magneticSeed: f32,
  gravityMps2: f32,
  ambientPressurePa: f32,
};

@group(0) @binding(0) var<storage, read> currentCells: array<Cell>;
@group(0) @binding(1) var<storage, read_write> nextCells: array<Cell>;
@group(0) @binding(2) var<uniform> params: Params;

fn cell_index(x: u32, y: u32, width: u32) -> u32 {
  return y * width + x;
}

@compute @workgroup_size(${J})
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

  let dt = clamp(params.dt, 0.0, 0.2);
  let u = f32(x) / max(1.0, params.width - 1.0) - 0.5;
  let v = f32(y) / max(1.0, params.height - 1.0) - 0.5;
  let r = max(0.04, sqrt(u * u + v * v));
  let radial = vec2f(u / r, v / r);
  let sheath = exp(-abs(r - 0.28) * 9.0);

  var density = clamp(cell.plasma.x, 0.001, 16.0);
  var temperatureK = clamp(cell.plasma.y, 80.0, 4800000.0);
  var velocity = vec2f(cell.plasma.z, cell.plasma.w);
  var magnetic = vec3f(cell.field.x, cell.field.y, cell.field.z);
  var ionization = clamp(cell.field.w, 0.0, 1.0);

  let densityMix = (right.plasma.x + left.plasma.x + up.plasma.x + down.plasma.x) * 0.25;
  let tempMix = (right.plasma.y + left.plasma.y + up.plasma.y + down.plasma.y) * 0.25;
  let dPdx = (right.derived.x - left.derived.x) * 0.5;
  let dPdy = (up.derived.x - down.derived.x) * 0.5;
  let dByDx = (right.field.y - left.field.y) * 0.5;
  let dBxDy = (up.field.x - down.field.x) * 0.5;
  let dBzDx = (right.field.z - left.field.z) * 0.5;
  let dBzDy = (up.field.z - down.field.z) * 0.5;
  let current = abs(dByDx - dBxDy) + abs(dBzDx) * 0.35 + abs(dBzDy) * 0.35;

  let windDrive = radial * (params.stellarFlux * params.luminosityFactor + params.radiationPressure * 0.35) * (0.02 + sheath * 0.035);
  let lorentz = vec2f(-magnetic.y, magnetic.x) * current * (0.006 + ionization * 0.026);
  let poyntingPush = vec2f(params.poyntingX, params.poyntingY) * 0.018;
  let pressurePush = vec2f(-dPdx, -dPdy) * 0.000014 / max(0.08, density);
  velocity = (velocity + windDrive + lorentz + poyntingPush + pressurePush) * (0.988 - ionization * 0.006);

  let maxwellHeat = params.maxwellFieldEnergy * (0.018 + current * 0.012);
  let stellarHeat = params.stellarFlux * params.luminosityFactor * (45.0 + sheath * 260.0);
  let ohmicHeat = current * current * (20.0 + ionization * 95.0);
  let cooling = max(0.0, temperatureK - 4200.0) * (0.0025 + density * 0.00028);
  temperatureK = clamp(temperatureK + (tempMix - temperatureK) * dt * 0.03 + dt * (stellarHeat + maxwellHeat + ohmicHeat - cooling), 80.0, 4800000.0);
  density = clamp(density + (densityMix - density) * dt * 0.045 + sheath * params.stellarFlux * dt * 0.008 - length(velocity) * dt * 0.002, 0.001, 16.0);

  let twist = (velocity.x * radial.y - velocity.y * radial.x) * 0.018 + params.magneticSeed * 0.004;
  magnetic.x = magnetic.x + (right.field.x + left.field.x + up.field.x + down.field.x - magnetic.x * 4.0) * dt * 0.012 - velocity.y * dt * 0.01;
  magnetic.y = magnetic.y + (right.field.y + left.field.y + up.field.y + down.field.y - magnetic.y * 4.0) * dt * 0.012 + velocity.x * dt * 0.01;
  magnetic.z = magnetic.z + twist + (params.maxwellFieldEnergy * 0.006 + current * 0.004 - magnetic.z * 0.018) * dt;

  let ionTarget = clamp((temperatureK - 2400.0) / 140000.0 + params.radiationPressure * 0.04 + current * 0.02, 0.0, 1.0);
  ionization = clamp(ionization + (ionTarget - ionization) * dt * 0.12, 0.0, 1.0);
  let pressure = density * temperatureK * (0.0024 + ionization * 0.0045) + params.ambientPressurePa * 0.0000002 * density;
  let energy = density * temperatureK * 0.012 + 0.5 * dot(velocity, velocity) * density + 0.5 * dot(magnetic, magnetic);

  nextCells[index].plasma = vec4f(density, temperatureK, velocity.x, velocity.y);
  nextCells[index].field = vec4f(magnetic, ionization);
  nextCells[index].derived = vec4f(pressure, current, energy, 0.0);
}
`;function Q(){const e=globalThis.self,t=globalThis.WorkerGlobalScope;return e&&t&&e instanceof t?"dedicated-worker":"inline"}function P(e,t,n){return Math.min(n,Math.max(t,e))}function Y(e,t,n=-Number.MAX_VALUE,i=Number.MAX_VALUE){const r=Number(e);return Number.isFinite(r)?Math.min(i,Math.max(n,r)):t}function G(e,t,n=1,i=Number.MAX_SAFE_INTEGER){const r=Math.floor(Number(e));return Number.isFinite(r)?Math.min(i,Math.max(n,r)):t}function ue(e=1){let t=Number(e)>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function f(e,t,n){return t*n+e}function S(e,t){return(e+t)%t}function T(e,t,n,i=0){const r=Array.from(e||new Array(t).fill(i),a=>Number(a));if(r.length!==t)throw new Error(`${n} length ${r.length} does not match expected ${t}`);if(r.some(a=>!Number.isFinite(a)))throw new Error(`${n} contains non-finite values`);return r}function R(e={},t,n,i=-Number.MAX_VALUE,r=Number.MAX_VALUE){return Y(e[t],n,i,r)}function ee({density:e,temperatureK:t,ionization:n,ambientPressurePa:i}){return Math.max(0,e*t*(.0024+n*.0045)+i*2e-7*e)}function te(e,t,n){const i=e.width,r=e.height,a=f(S(t+1,i),n,i),u=f(S(t-1,i),n,i),c=f(t,S(n+1,r),i),s=f(t,S(n-1,r),i),o=(e.magneticY[a]-e.magneticY[u])*.5,h=(e.magneticX[c]-e.magneticX[s])*.5,m=(e.magneticZ[a]-e.magneticZ[u])*.5,g=(e.magneticZ[c]-e.magneticZ[s])*.5;return Math.abs(o-h)+Math.abs(m)*.35+Math.abs(g)*.35}function me(e,t,n){const i=e.width,r=e.height,a=f(S(t+1,i),n,i),u=f(S(t-1,i),n,i),c=f(t,S(n+1,r),i),s=f(t,S(n-1,r),i);return Math.abs((e.magneticX[a]-e.magneticX[u])*.5+(e.magneticY[c]-e.magneticY[s])*.5)}function ne({width:e=18,height:t=10,seed:n=20260529,environment:i={},coupling:r={}}={}){const a=G(e,18,4,128),u=G(t,Math.max(4,Math.round(a/2)),4,128),c=a*u,s=ue(n),o=Y(i.stellarFlux,1,.1,5),h=R(r,"stellarLuminosityFactor",1,.05,4),m=R(r,"radiationPressure",1,0,5),g=Y(i.ambientPressurePa,101325,0,1e7),M=new Array(c),y=new Array(c),E=new Array(c),D=new Array(c),C=new Array(c),x=new Array(c),w=new Array(c),L=new Array(c),_=new Array(c),z=new Array(c),p=new Array(c);for(let d=0;d<u;d+=1)for(let b=0;b<a;b+=1){const l=f(b,d,a),B=b/Math.max(1,a-1)-.5,X=d/Math.max(1,u-1)-.5,A=Math.max(.04,Math.hypot(B,X)),F=Math.exp(-Math.abs(A-.28)*9),O=P(.12/(A*A+.06),.05,2.8),K=(s()-.5)*.04,N=B/A,U=X/A;M[l]=P(.22+F*(1.4+m*.18)+K,.001,16),y[l]=P(5200+F*18e4*o*h+K*2400,80,48e5),E[l]=N*(.08+o*.09+F*.08),D[l]=U*(.08+o*.09+F*.08),C[l]=-X*O,x[l]=B*O,w[l]=O*(.2+F*.45),L[l]=P(.04+F*.34+o*.06,0,1),_[l]=ee({density:M[l],temperatureK:y[l],ionization:L[l],ambientPressurePa:g}),z[l]=0,p[l]=M[l]*y[l]*.012+.5*(E[l]*E[l]+D[l]*D[l])*M[l]+.5*(C[l]*C[l]+x[l]*x[l]+w[l]*w[l])}const v={schema:Z,sequence:0,elapsedTime:0,width:a,height:u,plasmaDensity:M,temperatureK:y,velocityX:E,velocityY:D,magneticX:C,magneticY:x,magneticZ:w,ionizationFraction:L,pressurePa:_,currentDensity:z,energyDensity:p};for(let d=0;d<u;d+=1)for(let b=0;b<a;b+=1){const l=f(b,d,a);v.currentDensity[l]=te(v,b,d)}return v}function ie(e={}){const t=e.state||e;if(!t.plasmaDensity||!t.temperatureK)return ne(e);const n=G(t.width,18,4,128),i=G(t.height,Math.max(4,Math.round(n/2)),4,128),r=n*i;return{schema:Z,sequence:G(t.sequence,0,0),elapsedTime:Y(t.elapsedTime,0,0),width:n,height:i,plasmaDensity:T(t.plasmaDensity,r,"plasmaDensity",.2),temperatureK:T(t.temperatureK,r,"temperatureK",5200),velocityX:T(t.velocityX,r,"velocityX",0),velocityY:T(t.velocityY,r,"velocityY",0),magneticX:T(t.magneticX,r,"magneticX",0),magneticY:T(t.magneticY,r,"magneticY",0),magneticZ:T(t.magneticZ,r,"magneticZ",0),ionizationFraction:T(t.ionizationFraction,r,"ionizationFraction",.1),pressurePa:T(t.pressurePa,r,"pressurePa",0),currentDensity:T(t.currentDensity,r,"currentDensity",0),energyDensity:T(t.energyDensity,r,"energyDensity",0)}}function q(e){return{schema:Z,sequence:e.sequence,elapsedTime:e.elapsedTime,width:e.width,height:e.height,plasmaDensity:[...e.plasmaDensity],temperatureK:[...e.temperatureK],velocityX:[...e.velocityX],velocityY:[...e.velocityY],magneticX:[...e.magneticX],magneticY:[...e.magneticY],magneticZ:[...e.magneticZ],ionizationFraction:[...e.ionizationFraction],pressurePa:[...e.pressurePa],currentDensity:[...e.currentDensity],energyDensity:[...e.energyDensity]}}function he(e){const t=e.width*e.height,n=new Float32Array(t*12);for(let i=0;i<t;i+=1){const r=i*12;n[r]=e.plasmaDensity[i],n[r+1]=e.temperatureK[i],n[r+2]=e.velocityX[i],n[r+3]=e.velocityY[i],n[r+4]=e.magneticX[i],n[r+5]=e.magneticY[i],n[r+6]=e.magneticZ[i],n[r+7]=e.ionizationFraction[i],n[r+8]=e.pressurePa[i],n[r+9]=e.currentDensity[i],n[r+10]=e.energyDensity[i],n[r+11]=0}return n}function de(e,t){const n=e.width*e.height;for(let i=0;i<n;i+=1){const r=i*12;e.plasmaDensity[i]=t[r],e.temperatureK[i]=t[r+1],e.velocityX[i]=t[r+2],e.velocityY[i]=t[r+3],e.magneticX[i]=t[r+4],e.magneticY[i]=t[r+5],e.magneticZ[i]=t[r+6],e.ionizationFraction[i]=t[r+7],e.pressurePa[i]=t[r+8],e.currentDensity[i]=t[r+9],e.energyDensity[i]=t[r+10]}}function V(e={}){const t=ie(e),n=t.width*t.height;let i=0,r=0,a=0,u=0,c=0,s=0,o=0,h=0,m=0,g=0,M=0,y=0;for(let _=0;_<t.height;_+=1)for(let z=0;z<t.width;z+=1){const p=f(z,_,t.width),v=z/Math.max(1,t.width-1)-.5,d=_/Math.max(1,t.height-1)-.5,b=Math.max(.04,Math.hypot(v,d)),l=Math.exp(-Math.abs(b-.28)*9),B=Math.max(0,t.plasmaDensity[p]),X=Math.hypot(t.velocityX[p],t.velocityY[p]),A=t.magneticX[p]*t.magneticX[p]+t.magneticY[p]*t.magneticY[p]+t.magneticZ[p]*t.magneticZ[p];i+=B,r+=t.temperatureK[p],a+=t.ionizationFraction[p],u+=.5*A,c+=.5*B*X*X,s+=B*t.temperatureK[p]*.012,o+=Math.abs(t.currentDensity[p]),h+=me(t,z,_),m=Math.max(m,X),g=Math.max(g,Math.abs(t.currentDensity[p])),M+=B*l,y+=l}const E=i/Math.max(1,n);r/=Math.max(1,n),a/=Math.max(1,n),o/=Math.max(1,n),h/=Math.max(1,n);const D=M/Math.max(1e-9,y),C=Math.sqrt(2*u/Math.max(1e-6,i)),x=D*m*m+r*E*8e-5,w=P(10/Math.pow(1+x*.08,1/6),2.4,10),L=P(o*a*.12+h*.04,0,4);return{schema:"peercompute.multiscale.magnetosphere-plasma.diagnostics.v0",width:t.width,height:t.height,cellCount:n,totalMass:i,meanDensity:E,meanTemperatureK:r,meanIonizationFraction:a,magneticEnergy:u,kineticEnergy:c,thermalEnergy:s,plasmaEnergy:c+s,currentSheetIntensity:o,maxCurrentDensity:g,divergenceBProxy:h,alfvenSpeed:C,maxSpeed:m,solarWindPressure:x,magnetopauseRadius:w,reconnectionRate:L}}class ge{constructor(t){this.stateKey=t,this.device=null,this.pipeline=null,this.currentBuffer=null,this.nextBuffer=null,this.readBuffer=null,this.paramBuffer=null,this.width=0,this.height=0,this.submittedSteps=0,this.lastError=null}async initialize(t,n){var s,o,h,m,g,M;if(this.device&&this.width===t&&this.height===n)return;const i=(s=globalThis.navigator)==null?void 0:s.gpu;if(!i)throw new Error("WebGPU unavailable for magnetosphere-plasma worker");const r=globalThis.GPUBufferUsage;if(!r)throw new Error("GPUBufferUsage unavailable for magnetosphere-plasma worker");const a=await i.requestAdapter({powerPreference:"high-performance"});if(!a)throw new Error("No WebGPU adapter available for magnetosphere-plasma worker");this.device=await a.requestDevice(),this.width=t,this.height=n;const u=t*n*12*Float32Array.BYTES_PER_ELEMENT;this.currentBuffer=this.device.createBuffer({size:u,usage:r.STORAGE|r.COPY_DST}),this.nextBuffer=this.device.createBuffer({size:u,usage:r.STORAGE|r.COPY_SRC|r.COPY_DST}),this.readBuffer=this.device.createBuffer({size:u,usage:r.COPY_DST|r.MAP_READ}),this.paramBuffer=this.device.createBuffer({size:le,usage:r.UNIFORM|r.COPY_DST}),(h=(o=this.device).pushErrorScope)==null||h.call(o,"validation"),this.pipeline=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:oe}),entryPoint:"main"}});const c=await((g=(m=this.device).popErrorScope)==null?void 0:g.call(m));if(c)throw new Error(`Magnetosphere plasma WebGPU validation: ${c.message||c}`);(M=this.device.lost)==null||M.then(y=>{this.lastError=(y==null?void 0:y.message)||(y==null?void 0:y.reason)||"Magnetosphere plasma WebGPU device lost",k.set(this.stateKey,this.lastError)})}async step(t,n){var m,g;await this.initialize(t.width,t.height);const i=globalThis.GPUMapMode;if(!i)throw new Error("GPUMapMode unavailable for magnetosphere-plasma worker");const r=he(t),a=new Float32Array([t.width,t.height,n.dt,n.stellarFlux,n.luminosityFactor,n.radiationPressure,n.maxwellFieldEnergy,n.poyntingX,n.poyntingY,n.magneticSeed,n.gravityMps2,n.ambientPressurePa]),u=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.currentBuffer}},{binding:1,resource:{buffer:this.nextBuffer}},{binding:2,resource:{buffer:this.paramBuffer}}]});this.device.queue.writeBuffer(this.currentBuffer,0,r),this.device.queue.writeBuffer(this.paramBuffer,0,a);const c=this.device.createCommandEncoder(),s=c.beginComputePass();s.setPipeline(this.pipeline),s.setBindGroup(0,u),s.dispatchWorkgroups(Math.ceil(t.width*t.height/J)),s.end(),c.copyBufferToBuffer(this.nextBuffer,0,this.readBuffer,0,r.byteLength),this.device.queue.submit([c.finish()]),await((g=(m=this.device.queue).onSubmittedWorkDone)==null?void 0:g.call(m)),await this.readBuffer.mapAsync(i.READ);const o=this.readBuffer.getMappedRange(),h=new Float32Array(o).slice();return this.readBuffer.unmap(),de(t,h),t.elapsedTime+=n.dt,this.submittedSteps+=1,{backend:"webgpu-magnetosphere-plasma",webgpuStatus:{stateKey:this.stateKey,width:t.width,height:t.height,cellCount:t.width*t.height,submittedSteps:this.submittedSteps}}}}function pe(e={}){const t=e.environment||{},n=e.coupling||{},i=Array.isArray(n.poyntingFlux)?n.poyntingFlux:[0,0,0];return{dt:Y(e.dt,1/80,0,.2),stellarFlux:Y(t.stellarFlux??e.stellarFlux,1,.1,5),luminosityFactor:R(n,"stellarLuminosityFactor",1,.05,4),radiationPressure:R(n,"radiationPressure",1,0,5),maxwellFieldEnergy:R(n,"maxwellFieldEnergy",0,0,8),poyntingX:Y(i[0],0,-4,4),poyntingY:Y(i[1],0,-4,4),magneticSeed:R(n,"magneticSeed",.2,-4,4),gravityMps2:Y(t.gravityMps2??e.gravityMps2,9.8,0,80),ambientPressurePa:Y(t.ambientPressurePa??e.ambientPressurePa,101325,0,1e7)}}function ye(e,t){const n=q(e);for(let i=0;i<e.height;i+=1)for(let r=0;r<e.width;r+=1){const a=f(r,i,e.width),u=f(S(r+1,e.width),i,e.width),c=f(S(r-1,e.width),i,e.width),s=f(r,S(i+1,e.height),e.width),o=f(r,S(i-1,e.height),e.width),h=r/Math.max(1,e.width-1)-.5,m=i/Math.max(1,e.height-1)-.5,g=Math.max(.04,Math.hypot(h,m)),M=h/g,y=m/g,E=Math.exp(-Math.abs(g-.28)*9),D=P(e.plasmaDensity[a],.001,16),C=P(e.temperatureK[a],80,48e5),x=P(e.ionizationFraction[a],0,1),w=te(e,r,i),L=(e.pressurePa[u]-e.pressurePa[c])*.5,_=(e.pressurePa[s]-e.pressurePa[o])*.5,z=(e.plasmaDensity[u]+e.plasmaDensity[c]+e.plasmaDensity[s]+e.plasmaDensity[o])*.25,p=(e.temperatureK[u]+e.temperatureK[c]+e.temperatureK[s]+e.temperatureK[o])*.25;let v=e.velocityX[a],d=e.velocityY[a];v+=M*(t.stellarFlux*t.luminosityFactor+t.radiationPressure*.35)*(.02+E*.035),d+=y*(t.stellarFlux*t.luminosityFactor+t.radiationPressure*.35)*(.02+E*.035),v+=-e.magneticY[a]*w*(.006+x*.026)+t.poyntingX*.018-L*14e-6/Math.max(.08,D),d+=e.magneticX[a]*w*(.006+x*.026)+t.poyntingY*.018-_*14e-6/Math.max(.08,D),v*=.988-x*.006,d*=.988-x*.006;const b=t.maxwellFieldEnergy*(.018+w*.012),l=t.stellarFlux*t.luminosityFactor*(45+E*260),B=w*w*(20+x*95),X=Math.max(0,C-4200)*(.0025+D*28e-5),A=P(C+(p-C)*t.dt*.03+t.dt*(l+b+B-X),80,48e5),F=P(D+(z-D)*t.dt*.045+E*t.stellarFlux*t.dt*.008-Math.hypot(v,d)*t.dt*.002,.001,16),O=(v*y-d*M)*.018+t.magneticSeed*.004,K=e.magneticX[a]+(e.magneticX[u]+e.magneticX[c]+e.magneticX[s]+e.magneticX[o]-e.magneticX[a]*4)*t.dt*.012-d*t.dt*.01,N=e.magneticY[a]+(e.magneticY[u]+e.magneticY[c]+e.magneticY[s]+e.magneticY[o]-e.magneticY[a]*4)*t.dt*.012+v*t.dt*.01,U=e.magneticZ[a]+O+(t.maxwellFieldEnergy*.006+w*.004-e.magneticZ[a]*.018)*t.dt,re=P((A-2400)/14e4+t.radiationPressure*.04+w*.02,0,1),W=P(x+(re-x)*t.dt*.12,0,1),ae=ee({density:F,temperatureK:A,ionization:W,ambientPressurePa:t.ambientPressurePa});n.plasmaDensity[a]=F,n.temperatureK[a]=A,n.velocityX[a]=v,n.velocityY[a]=d,n.magneticX[a]=K,n.magneticY[a]=N,n.magneticZ[a]=U,n.ionizationFraction[a]=W,n.currentDensity[a]=w,n.pressurePa[a]=ae,n.energyDensity[a]=F*A*.012+.5*(v*v+d*d)*F+.5*(K*K+N*N+U*U)}return n.elapsedTime+=t.dt,n}async function fe(e,{stateKey:t,input:n,options:i}){const r=e.width*e.height;if(n.enableWebGPU!==!1&&n.webgpu!==!1&&r<=G(n.webgpuMaxCells,16384,1,1048576)&&!k.has(t))try{let s=I.get(t);s||(s=new ge(t),I.set(t,s));const o=await s.step(e,i);return{backend:o.backend,webgpuStatus:o.webgpuStatus,webgpuError:null}}catch(s){k.set(t,s instanceof Error?s.message:String(s))}const c=ye(e,i);return Object.assign(e,c),{backend:"cpu-magnetosphere-plasma",webgpuStatus:null,webgpuError:k.get(t)||null}}function xe(e={}){var n,i;const t=e.input||e;return{payload:e,input:t,stateKey:e.stateKey||t.stateKey||t.taskId||$,scope:t.scope||e.scope||((i=(n=e.solver)==null?void 0:n.warmDelta)==null?void 0:i.scope)||ce,taskId:t.taskId||e.stateKey||t.stateKey||$,emitCommitDelta:t.emitCommitDelta===!0||e.emitCommitDelta===!0}}function we(e,t){return{massDrift:(t.totalMass-e.totalMass)/Math.max(1e-9,e.totalMass),magneticEnergyDelta:t.magneticEnergy-e.magneticEnergy,plasmaEnergyDelta:t.plasmaEnergy-e.plasmaEnergy,divergenceBProxy:t.divergenceBProxy,energyMode:"reduced-ideal-mhd-plasma"}}function ve({payload:e,input:t,stateKey:n,state:i,diagnostics:r,conservation:a,backend:u,webgpuStatus:c,webgpuError:s}){var o,h,m;return{schema:((h=(o=e.solver)==null?void 0:o.warmDelta)==null?void 0:h.schema)||se,solverId:((m=e.solver)==null?void 0:m.id)||"magnetosphere-plasma",stateKey:n,backend:u,sequence:i.sequence,elapsedTime:i.elapsedTime,width:i.width,height:i.height,cellCount:i.width*i.height,diagnostics:r,conservation:a,state:i,webgpuStatus:c,webgpuError:s,units:{plasmaDensity:t.plasmaDensityUnit||"reduced kg/m^3",temperature:"K",velocity:"reduced m/s",magneticField:"reduced T",pressure:"reduced Pa",time:t.timeUnit||"s"}}}function be(e={}){if(e.stateKey||e.taskId){const t=e.stateKey||e.taskId;H.delete(t),I.delete(t),k.delete(t)}else H.clear(),I.clear(),k.clear();return{ok:!0,schema:j,executionContext:Q()}}async function Pe(e={}){var g;const t=xe(e),{input:n,stateKey:i}=t,r=n.reset===!0,a=n.state||r||!H.has(i)?ie(n.state||ne(n)):q(H.get(i)),u=V(a),c=pe(n),s=await fe(a,{stateKey:i,input:n,options:c});a.sequence+=1,H.set(i,q(a));const o=V(a),h=we(u,o),m={ok:!0,schema:j,executionContext:Q(),solverId:((g=e.solver)==null?void 0:g.id)||"magnetosphere-plasma",stateKey:i,backend:s.backend,sequence:a.sequence,elapsedTime:a.elapsedTime,state:q(a),diagnostics:o,conservation:h,webgpuStatus:s.webgpuStatus,webgpuError:s.webgpuError};return t.emitCommitDelta?{value:m,commitDelta:{taskId:t.taskId,scope:t.scope,version:a.sequence,timestamp:Date.now(),payload:ve({payload:e,input:n,stateKey:i,state:q(a),diagnostics:o,conservation:h,backend:s.backend,webgpuStatus:s.webgpuStatus,webgpuError:s.webgpuError})}}:m}export{se as MAGNETOSPHERE_PLASMA_DELTA_SCHEMA,j as MAGNETOSPHERE_PLASMA_RESULT_SCHEMA,Z as MAGNETOSPHERE_PLASMA_STATE_SCHEMA,Me as MAGNETOSPHERE_PLASMA_WEBGPU_MAX_CELLS,V as computeMagnetosphereDiagnostics,ne as makeMagnetospherePlasmaInitialState,be as resetMagnetospherePlasma,Pe as stepMagnetospherePlasma};

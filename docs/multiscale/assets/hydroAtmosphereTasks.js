const Y="peercompute.multiscale.hydro-atmosphere.state.v0",q="peercompute.multiscale.hydro-atmosphere.result.v0",Z="peercompute.multiscale.hydro-atmosphere.delta.v0",me=16384,U="multiscale:hydro-atmosphere:default",j="multiscale-solver-deltas";const J=8*Float32Array.BYTES_PER_ELEMENT,B=new Map,H=new Map,R=new Map,Q=`
struct Cell {
  massMom: vec4f,
  moistTerrain: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  stellarFlux: f32,
  gravity: f32,
  ambientTemperatureK: f32,
  oceanHeat: f32,
  damping: f32,
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
  var mass = cell.massMom.x;
  var mx = cell.massMom.y;
  var my = cell.massMom.z;
  var temperatureK = cell.massMom.w;
  var vapor = cell.moistTerrain.x;
  var cloud = cell.moistTerrain.y;
  var precip = cell.moistTerrain.z;
  let terrain = cell.moistTerrain.w;

  let pressureRight = right.massMom.x + right.massMom.w * 0.0032 - right.moistTerrain.w * 0.09;
  let pressureLeft = left.massMom.x + left.massMom.w * 0.0032 - left.moistTerrain.w * 0.09;
  let pressureUp = up.massMom.x + up.massMom.w * 0.0032 - up.moistTerrain.w * 0.09;
  let pressureDown = down.massMom.x + down.massMom.w * 0.0032 - down.moistTerrain.w * 0.09;
  let gradX = (pressureRight - pressureLeft) * 0.5;
  let gradY = (pressureUp - pressureDown) * 0.5;
  let coriolis = (f32(y) / max(1.0, params.height - 1.0) - 0.5) * 0.08;
  let oldMx = mx;
  let oldMy = my;

  mx = (mx - gradX * dt * 0.68 + oldMy * coriolis * dt) * params.damping;
  my = (my - gradY * dt * 0.68 - oldMx * coriolis * dt) * params.damping;
  mass = clamp(
    mass - ((right.massMom.y - left.massMom.y) + (up.massMom.z - down.massMom.z)) * dt * 0.035,
    0.35,
    2.2
  );

  let neighborTemperature = (right.massMom.w + left.massMom.w + up.massMom.w + down.massMom.w) * 0.25;
  let radiativeEquilibrium = params.ambientTemperatureK - 18.0 + params.stellarFlux * 42.0 + params.oceanHeat * 16.0 - terrain * 22.0;
  temperatureK = clamp(
    temperatureK
      + (radiativeEquilibrium - temperatureK) * dt * 0.035
      + (neighborTemperature - temperatureK) * dt * 0.03
      - cloud * dt * 1.6
      - precip * dt * 2.4,
    180.0,
    340.0
  );

  let saturation = clamp(0.11 + (temperatureK - 250.0) * 0.0032, 0.06, 0.42);
  let evaporation = max(0.0, params.oceanHeat + params.stellarFlux * 0.45 - terrain * 0.65) * dt * 0.0045;
  let condensation = max(0.0, vapor - saturation) * dt * 0.72;
  let precipRate = max(0.0, cloud - 0.18) * dt * 0.38;
  vapor = clamp(vapor + evaporation - condensation + precip * dt * 0.03, 0.0, 1.2);
  cloud = clamp(cloud + condensation - precipRate, 0.0, 1.2);
  precip = clamp(precip * 0.86 + precipRate * 4.8, 0.0, 1.4);

  nextCells[index].massMom = vec4f(mass, mx, my, temperatureK);
  nextCells[index].moistTerrain = vec4f(vapor, cloud, precip, terrain);
}
`;function I(){const e=globalThis.self,t=globalThis.WorkerGlobalScope;return e&&t&&e instanceof t?"dedicated-worker":"inline"}function g(e,t,i){return Math.min(i,Math.max(t,e))}function y(e,t,i=-Number.MAX_VALUE,o=Number.MAX_VALUE){const r=Number(e);return Number.isFinite(r)?Math.min(o,Math.max(i,r)):t}function L(e,t,i=1,o=Number.MAX_SAFE_INTEGER){const r=Math.floor(Number(e));return Number.isFinite(r)?Math.min(o,Math.max(i,r)):t}function ee(e=1){let t=Number(e)>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function v(e,t,i){return t*i+e}function K(e,t){return(e+t)%t}function _(e,t,i){const o=Array.from(e||[],r=>Number(r));if(o.length!==t)throw new Error(`${i} length ${o.length} does not match expected ${t}`);if(o.some(r=>!Number.isFinite(r)))throw new Error(`${i} contains non-finite values`);return o}function N({width:e=20,height:t=10,seed:i=20260529,environment:o={},oceanHeat:r=.51}={}){const a=L(e,20,4,128),d=L(t,Math.max(4,Math.round(a/2)),4,128),m=a*d,l=ee(i),s=y(o.stellarFlux,1,.1,4),p=y(o.ambientTemperatureK,294,180,360),w=g(y(r,.51),0,1),h=new Array(m),n=new Array(m),u=new Array(m),c=new Array(m),f=new Array(m),x=new Array(m),P=new Array(m),b=new Array(m);for(let E=0;E<d;E+=1){const C=(E/Math.max(1,d-1)-.5)*Math.PI,T=Math.cos(C);for(let A=0;A<a;A+=1){const M=v(A,E,a),S=A/a*Math.PI*2,W=.5+.5*Math.sin(S*2+Math.sin(C*3)),D=(l()-.5)*.08;b[M]=g(W*.42+D,0,1),h[M]=1+Math.sin(S+C*.6)*.06+D*.4,n[M]=T*(.11+s*.035)+(l()-.5)*.025,u[M]=Math.sin(S*1.5)*.035+(l()-.5)*.02,c[M]=p-18+s*28+w*12-b[M]*18+T*8,f[M]=g(.13+w*.15+T*.05-b[M]*.045+D,.02,.7),x[M]=g(.08+f[M]*.38+Math.max(0,T)*.08+D*.5,0,.7),P[M]=g(Math.max(0,x[M]-.18)*.45,0,.5)}}return{schema:Y,sequence:0,elapsedTime:0,width:a,height:d,columnMass:h,momentumX:n,momentumY:u,temperatureK:c,waterVapor:f,cloudWater:x,precipitation:P,terrain:b}}function z(e={}){const t=e.state||e;if(!t.columnMass&&!t.temperatureK)return N(e);const i=L(t.width,20,4,128),o=L(t.height,Math.max(4,Math.round(i/2)),4,128),r=i*o;return{schema:Y,sequence:L(t.sequence,0,0),elapsedTime:y(t.elapsedTime,0,0),width:i,height:o,columnMass:_(t.columnMass,r,"columnMass"),momentumX:_(t.momentumX||new Array(r).fill(0),r,"momentumX"),momentumY:_(t.momentumY||new Array(r).fill(0),r,"momentumY"),temperatureK:_(t.temperatureK,r,"temperatureK"),waterVapor:_(t.waterVapor||new Array(r).fill(0),r,"waterVapor"),cloudWater:_(t.cloudWater||new Array(r).fill(0),r,"cloudWater"),precipitation:_(t.precipitation||new Array(r).fill(0),r,"precipitation"),terrain:_(t.terrain||new Array(r).fill(0),r,"terrain")}}function O(e){return{schema:Y,sequence:e.sequence,elapsedTime:e.elapsedTime,width:e.width,height:e.height,columnMass:[...e.columnMass],momentumX:[...e.momentumX],momentumY:[...e.momentumY],temperatureK:[...e.temperatureK],waterVapor:[...e.waterVapor],cloudWater:[...e.cloudWater],precipitation:[...e.precipitation],terrain:[...e.terrain]}}function te(e){const t=e.width*e.height,i=new Float32Array(t*8);for(let o=0;o<t;o+=1){const r=o*8;i[r]=e.columnMass[o],i[r+1]=e.momentumX[o],i[r+2]=e.momentumY[o],i[r+3]=e.temperatureK[o],i[r+4]=e.waterVapor[o],i[r+5]=e.cloudWater[o],i[r+6]=e.precipitation[o],i[r+7]=e.terrain[o]}return i}function re(e,t){const i=e.width*e.height;for(let o=0;o<i;o+=1){const r=o*8;e.columnMass[o]=t[r],e.momentumX[o]=t[r+1],e.momentumY[o]=t[r+2],e.temperatureK[o]=t[r+3],e.waterVapor[o]=t[r+4],e.cloudWater[o]=t[r+5],e.precipitation[o]=t[r+6],e.terrain[o]=t[r+7]}}class oe{constructor(t){this.stateKey=t,this.device=null,this.pipeline=null,this.currentBuffer=null,this.nextBuffer=null,this.readBuffer=null,this.paramBuffer=null,this.width=0,this.height=0,this.submittedSteps=0,this.lastError=null}async initialize(t,i){var s,p,w,h,n,u;if(this.device&&this.width===t&&this.height===i)return;const o=t*i;if(o>16384)throw new Error(`Hydro atmosphere WebGPU cell count ${o} exceeds 16384`);const r=(s=globalThis.navigator)==null?void 0:s.gpu;if(!r)throw new Error("WebGPU unavailable for hydro atmosphere worker");const a=globalThis.GPUBufferUsage;if(!a)throw new Error("GPUBufferUsage unavailable for hydro atmosphere worker");const d=await r.requestAdapter({powerPreference:"high-performance"});if(!d)throw new Error("No WebGPU adapter available for hydro atmosphere worker");this.device=await d.requestDevice(),this.width=t,this.height=i;const m=o*8*Float32Array.BYTES_PER_ELEMENT;this.currentBuffer=this.device.createBuffer({size:m,usage:a.STORAGE|a.COPY_DST}),this.nextBuffer=this.device.createBuffer({size:m,usage:a.STORAGE|a.COPY_SRC}),this.readBuffer=this.device.createBuffer({size:m,usage:a.COPY_DST|a.MAP_READ}),this.paramBuffer=this.device.createBuffer({size:J,usage:a.UNIFORM|a.COPY_DST}),(w=(p=this.device).pushErrorScope)==null||w.call(p,"validation"),this.pipeline=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:Q}),entryPoint:"main"}});const l=await((n=(h=this.device).popErrorScope)==null?void 0:n.call(h));if(l)throw new Error(`Hydro atmosphere WebGPU validation: ${l.message||l}`);(u=this.device.lost)==null||u.then(c=>{this.lastError=(c==null?void 0:c.message)||(c==null?void 0:c.reason)||"Hydro atmosphere WebGPU device lost",R.set(this.stateKey,this.lastError)})}async step(t,i={}){var u,c;await this.initialize(t.width,t.height);const o=globalThis.GPUMapMode;if(!o)throw new Error("GPUMapMode unavailable for hydro atmosphere worker");const r=i.environment||{},a=i.coupling||{},d=g(y(i.dt,.02),0,1),m=new Float32Array([t.width,t.height,d,y(r.stellarFlux,1,.1,4),y(r.gravityMps2,9.8,0,40),y(r.ambientTemperatureK,294,180,360),g(y(a.oceanHeat,.51),0,1),g(y(i.damping,.992),0,1)]),l=te(t),s=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.currentBuffer}},{binding:1,resource:{buffer:this.nextBuffer}},{binding:2,resource:{buffer:this.paramBuffer}}]});this.device.queue.writeBuffer(this.currentBuffer,0,l),this.device.queue.writeBuffer(this.paramBuffer,0,m);const p=this.device.createCommandEncoder(),w=p.beginComputePass();w.setPipeline(this.pipeline),w.setBindGroup(0,s),w.dispatchWorkgroups(Math.ceil(t.width*t.height/64)),w.end(),p.copyBufferToBuffer(this.nextBuffer,0,this.readBuffer,0,l.byteLength),this.device.queue.submit([p.finish()]),await((c=(u=this.device.queue).onSubmittedWorkDone)==null?void 0:c.call(u)),await this.readBuffer.mapAsync(o.READ);const h=this.readBuffer.getMappedRange(),n=new Float32Array(h).slice();return this.readBuffer.unmap(),re(t,n),t.elapsedTime+=d,t.sequence+=1,this.submittedSteps+=1,{backend:"webgpu-hydro-atmosphere",webgpuStatus:{stateKey:this.stateKey,width:t.width,height:t.height,submittedSteps:this.submittedSteps}}}}function G(e,t={}){const i=t.environment||{},o=t.coupling||{},r=g(y(t.dt,.02),0,1),a=y(i.stellarFlux,1,.1,4),d=y(i.ambientTemperatureK,294,180,360),m=g(y(o.oceanHeat,.51),0,1),l=g(y(t.damping,.992),0,1),s=O(e);for(let p=0;p<e.height;p+=1){const w=(p/Math.max(1,e.height-1)-.5)*.08;for(let h=0;h<e.width;h+=1){const n=v(h,p,e.width),u=v(K(h+1,e.width),p,e.width),c=v(K(h-1,e.width),p,e.width),f=v(h,K(p+1,e.height),e.width),x=v(h,K(p-1,e.height),e.width),P=e.columnMass[u]+e.temperatureK[u]*.0032-e.terrain[u]*.09,b=e.columnMass[c]+e.temperatureK[c]*.0032-e.terrain[c]*.09,E=e.columnMass[f]+e.temperatureK[f]*.0032-e.terrain[f]*.09,C=e.columnMass[x]+e.temperatureK[x]*.0032-e.terrain[x]*.09,T=(P-b)*.5,A=(E-C)*.5,M=e.momentumX[n],S=e.momentumY[n];s.momentumX[n]=(M-T*r*.68+S*w*r)*l,s.momentumY[n]=(S-A*r*.68-M*w*r)*l,s.columnMass[n]=g(e.columnMass[n]-(e.momentumX[u]-e.momentumX[c]+(e.momentumY[f]-e.momentumY[x]))*r*.035,.35,2.2);const W=(e.temperatureK[u]+e.temperatureK[c]+e.temperatureK[f]+e.temperatureK[x])*.25,D=d-18+a*42+m*16-e.terrain[n]*22;s.temperatureK[n]=g(e.temperatureK[n]+(D-e.temperatureK[n])*r*.035+(W-e.temperatureK[n])*r*.03-e.cloudWater[n]*r*1.6-e.precipitation[n]*r*2.4,180,340);const V=g(.11+(s.temperatureK[n]-250)*.0032,.06,.42),$=Math.max(0,m+a*.45-e.terrain[n]*.65)*r*.0045,k=Math.max(0,e.waterVapor[n]-V)*r*.72,F=Math.max(0,e.cloudWater[n]-.18)*r*.38;s.waterVapor[n]=g(e.waterVapor[n]+$-k+e.precipitation[n]*r*.03,0,1.2),s.cloudWater[n]=g(e.cloudWater[n]+k-F,0,1.2),s.precipitation[n]=g(e.precipitation[n]*.86+F*4.8,0,1.4)}}return s.elapsedTime+=r,s.sequence+=1,Object.assign(e,s),{backend:"cpu-hydro-atmosphere"}}function X(e={}){const t=z(e),i=t.width*t.height;let o=0,r=0,a=0,d=0,m=0,l=0,s=0,p=0;for(let u=0;u<t.height;u+=1)for(let c=0;c<t.width;c+=1){const f=v(c,u,t.width),x=Math.max(1e-6,t.columnMass[f]),P=t.momentumX[f]/x,b=t.momentumY[f]/x,E=Math.hypot(P,b),C=v(K(c+1,t.width),u,t.width),T=v(K(c-1,t.width),u,t.width),A=v(c,K(u+1,t.height),t.width),M=v(c,K(u-1,t.height),t.width),S=(t.momentumY[C]-t.momentumY[T])*.5-(t.momentumX[A]-t.momentumX[M])*.5;o+=t.columnMass[f],r+=t.waterVapor[f]+t.cloudWater[f]+t.precipitation[f],a+=.5*x*E*E,d+=t.temperatureK[f],m+=t.cloudWater[f],l+=t.precipitation[f],s=Math.max(s,E*38),p+=Math.abs(S)}const w=d/Math.max(1,i),h=g(m/Math.max(1,i)*2.8,0,1),n=l/Math.max(1,i);return{schema:"peercompute.multiscale.hydro-atmosphere.diagnostics.v0",width:t.width,height:t.height,cellCount:i,totalColumnMass:o,totalMoisture:r,kineticEnergy:a,meanTemperatureK:w,meanPressurePa:101325+(w-288)*62+(o/Math.max(1,i)-1)*18e3,cloudCover:h,precipitationMean:n,maxWindMps:s,vorticityMean:p/Math.max(1,i),stormEnergy:g(h*.5+n*1.8+Math.min(1,s/80)*.35,0,1)}}function ie(e,t){return{massDrift:t.totalColumnMass-e.totalColumnMass,moistureDrift:t.totalMoisture-e.totalMoisture,kineticEnergyDrift:t.kineticEnergy-e.kineticEnergy,energyMode:"reduced-moist-shallow-water",note:"Reduced periodic hydro tile; moisture has evaporation/precipitation source terms and is not closed."}}function ne({payload:e,stateKey:t,state:i,diagnostics:o,conservation:r,backend:a}){var d,m,l;return{schema:((m=(d=e.solver)==null?void 0:d.warmDelta)==null?void 0:m.schema)||Z,solverId:((l=e.solver)==null?void 0:l.id)||"hydro-atmosphere",stateKey:t,backend:a,sequence:i.sequence,elapsedTime:i.elapsedTime,diagnostics:o,conservation:r,state:O(i),units:{temperature:"K",pressure:"Pa",velocity:"m/s visual proxy",moisture:"reduced column fraction"}}}function ae(e={}){var i,o;const t=e.input||e;return{payload:e,input:t,stateKey:e.stateKey||t.stateKey||t.taskId||U,scope:t.scope||e.scope||((o=(i=e.solver)==null?void 0:i.warmDelta)==null?void 0:o.scope)||j,taskId:t.taskId||e.stateKey||t.stateKey||U,emitCommitDelta:t.emitCommitDelta===!0||e.emitCommitDelta===!0}}function ce(e={}){if(e.stateKey||e.taskId){const t=e.stateKey||e.taskId;B.delete(t),H.delete(t),R.delete(t)}else B.clear(),H.clear(),R.clear();return{ok:!0,schema:q,executionContext:I()}}async function se(e,t,i={}){let o=H.get(t);return o||(o=new oe(t),H.set(t,o)),o.step(e,i)}async function ue(e={}){var h;const t=ae(e),{input:i,stateKey:o}=t,r=i.reset===!0,a=i.state||r||!B.has(o)?z(i.state||N(i)):O(B.get(o)),d=X(a);let m="cpu-hydro-atmosphere",l=null;if(i.enableWebGPU!==!1&&!R.has(o))try{const n=await se(a,o,i);m=n.backend,l=n.webgpuStatus}catch(n){const u=(n==null?void 0:n.message)||String(n);R.set(o,u),G(a,i),l={fallback:!0,disabledReason:u}}else G(a,i),R.has(o)&&(l={fallback:!0,disabledReason:R.get(o)});const s=X(a),p=ie(d,s);B.set(o,O(a));const w={ok:!0,schema:q,executionContext:I(),solverId:((h=e.solver)==null?void 0:h.id)||"hydro-atmosphere",stateKey:o,backend:m,sequence:a.sequence,elapsedTime:a.elapsedTime,state:O(a),diagnostics:s,conservation:p,webgpuStatus:l};return t.emitCommitDelta?{value:w,commitDelta:{taskId:t.taskId,scope:t.scope,version:a.sequence,timestamp:Date.now(),payload:ne({payload:e,stateKey:o,state:a,diagnostics:s,conservation:p,backend:m})}}:w}export{Z as HYDRO_ATMOSPHERE_DELTA_SCHEMA,q as HYDRO_ATMOSPHERE_RESULT_SCHEMA,Y as HYDRO_ATMOSPHERE_STATE_SCHEMA,me as HYDRO_ATMOSPHERE_WEBGPU_MAX_CELLS,X as computeHydroAtmosphereDiagnostics,N as makeHydroAtmosphereInitialState,ce as resetHydroAtmosphere,ue as stepHydroAtmosphere};

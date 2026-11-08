const B="peercompute.multiscale.maxwell.state.v0",k="peercompute.multiscale.maxwell.result.v0",X="peercompute.multiscale.maxwell.delta.v0",z="multiscale:maxwell:default",K="multiscale-solver-deltas";const Y=8*Float32Array.BYTES_PER_ELEMENT,v=new Map,M=new Map,E=new Map,$=`
struct FieldCell {
  eCharge: vec4f,
  bCurrentX: vec4f,
  currentPad: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  lightSpeed: f32,
  damping: f32,
  pad0: f32,
  pad1: f32,
  pad2: f32,
};

@group(0) @binding(0) var<storage, read> currentFields: array<FieldCell>;
@group(0) @binding(1) var<storage, read_write> nextFields: array<FieldCell>;
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
  let right = cell_index(xp, y, width);
  let left = cell_index(xm, y, width);
  let up = cell_index(x, yp, width);
  let down = cell_index(x, ym, width);

  let cell = currentFields[index];
  let dt = params.dt;
  let damping = params.damping;
  let c = params.lightSpeed;
  let e = cell.eCharge.xyz;
  let b = cell.bCurrentX.xyz;
  let j = vec3f(cell.bCurrentX.w, cell.currentPad.x, cell.currentPad.y);

  let dByDx = (currentFields[right].bCurrentX.y - currentFields[left].bCurrentX.y) * 0.5;
  let dBxDy = (currentFields[up].bCurrentX.x - currentFields[down].bCurrentX.x) * 0.5;
  let curlBz = dByDx - dBxDy;
  let dEzDy = (currentFields[up].eCharge.z - currentFields[down].eCharge.z) * 0.5;
  let dEzDx = (currentFields[right].eCharge.z - currentFields[left].eCharge.z) * 0.5;
  let dEyDx = (currentFields[right].eCharge.y - currentFields[left].eCharge.y) * 0.5;
  let dExDy = (currentFields[up].eCharge.x - currentFields[down].eCharge.x) * 0.5;

  let nextE = vec3f(
    e.x + (dEzDy - j.x) * dt,
    e.y + (-dEzDx - j.y) * dt,
    e.z + (curlBz - j.z) * dt
  ) * damping;
  let nextB = vec3f(
    b.x - dEzDy * dt * c,
    b.y + dEzDx * dt * c,
    b.z - (dEyDx - dExDy) * dt * c
  ) * damping;

  nextFields[index].eCharge = vec4f(nextE, cell.eCharge.w);
  nextFields[index].bCurrentX = vec4f(nextB, cell.bCurrentX.w);
  nextFields[index].currentPad = cell.currentPad;
}
`;function R(){const e=globalThis.self,t=globalThis.WorkerGlobalScope;return e&&t&&e instanceof t?"dedicated-worker":"inline"}function T(e,t,i){return Math.min(i,Math.max(t,e))}function p(e,t,i=-Number.MAX_VALUE,c=Number.MAX_VALUE){const r=Number(e);return Number.isFinite(r)?Math.min(c,Math.max(i,r)):t}function F(e,t,i=1,c=Number.MAX_SAFE_INTEGER){const r=Math.floor(Number(e));return Number.isFinite(r)?Math.min(c,Math.max(i,r)):t}function H(e=1){let t=Number(e)>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function y(e,t,i){return t*i+e}function A(e,t){return(e+t)%t}function S(e,t,i){const c=Array.from(e||[],r=>Number(r));if(c.length!==t)throw new Error(`${i} length ${c.length} does not match expected ${t}`);if(c.some(r=>!Number.isFinite(r)))throw new Error(`${i} contains non-finite values`);return c}function G({width:e=16,height:t=16,seed:i=20260529,amplitude:c=.35}={}){const r=F(e,16,4,128),n=F(t,16,4,128),l=r*n,u=H(i),s=new Array(l*3).fill(0),o=new Array(l*3).fill(0),g=new Array(l).fill(0),m=new Array(l*3).fill(0),a=p(c,.35,0,10);for(let f=0;f<n;f+=1)for(let h=0;h<r;h+=1){const b=y(h,f,r),d=(h/r-.5)*2,w=(f/n-.5)*2,D=d*d+w*w,x=Math.exp(-D*6)*a;s[b*3]=-w*x,s[b*3+1]=d*x,o[b*3+2]=x*.65,g[b]=(u()-.5)*a*.01}return{schema:B,sequence:0,elapsedTime:0,width:r,height:n,electric:s,magnetic:o,chargeDensity:g,currentDensity:m}}function I(e={}){const t=e.state||e;if(!t.electric&&!t.magnetic)return G(e);const i=F(t.width,16,4,128),c=F(t.height,16,4,128),r=i*c;return{schema:B,sequence:F(t.sequence,0,0),elapsedTime:p(t.elapsedTime,0,0),width:i,height:c,electric:S(t.electric,r*3,"electric"),magnetic:S(t.magnetic,r*3,"magnetic"),chargeDensity:S(t.chargeDensity||new Array(r).fill(0),r,"chargeDensity"),currentDensity:S(t.currentDensity||new Array(r*3).fill(0),r*3,"currentDensity")}}function C(e){return{schema:B,sequence:e.sequence,elapsedTime:e.elapsedTime,width:e.width,height:e.height,electric:[...e.electric],magnetic:[...e.magnetic],chargeDensity:[...e.chargeDensity],currentDensity:[...e.currentDensity]}}function j(e){const t=e.width*e.height,i=new Float32Array(t*12);for(let c=0;c<t;c+=1){const r=c*3,n=c*12;i[n]=e.electric[r],i[n+1]=e.electric[r+1],i[n+2]=e.electric[r+2],i[n+3]=e.chargeDensity[c],i[n+4]=e.magnetic[r],i[n+5]=e.magnetic[r+1],i[n+6]=e.magnetic[r+2],i[n+7]=e.currentDensity[r],i[n+8]=e.currentDensity[r+1],i[n+9]=e.currentDensity[r+2],i[n+10]=0,i[n+11]=0}return i}function V(e,t){const i=e.width*e.height;for(let c=0;c<i;c+=1){const r=c*3,n=c*12;e.electric[r]=t[n],e.electric[r+1]=t[n+1],e.electric[r+2]=t[n+2],e.chargeDensity[c]=t[n+3],e.magnetic[r]=t[n+4],e.magnetic[r+1]=t[n+5],e.magnetic[r+2]=t[n+6],e.currentDensity[r]=t[n+7],e.currentDensity[r+1]=t[n+8],e.currentDensity[r+2]=t[n+9]}}class Z{constructor(t){this.stateKey=t,this.device=null,this.pipeline=null,this.currentBuffer=null,this.nextBuffer=null,this.readBuffer=null,this.paramBuffer=null,this.width=0,this.height=0,this.submittedSteps=0,this.lastError=null}async initialize(t,i){var s,o,g,m,a,f;if(this.device&&this.width===t&&this.height===i)return;const c=(s=globalThis.navigator)==null?void 0:s.gpu;if(!c)throw new Error("WebGPU unavailable for Maxwell worker");const r=globalThis.GPUBufferUsage;if(!r)throw new Error("GPUBufferUsage unavailable for Maxwell worker");const n=await c.requestAdapter({powerPreference:"high-performance"});if(!n)throw new Error("No WebGPU adapter available for Maxwell worker");this.device=await n.requestDevice(),this.width=t,this.height=i;const l=t*i*12*Float32Array.BYTES_PER_ELEMENT;this.currentBuffer=this.device.createBuffer({size:l,usage:r.STORAGE|r.COPY_DST}),this.nextBuffer=this.device.createBuffer({size:l,usage:r.STORAGE|r.COPY_SRC}),this.readBuffer=this.device.createBuffer({size:l,usage:r.COPY_DST|r.MAP_READ}),this.paramBuffer=this.device.createBuffer({size:Y,usage:r.UNIFORM|r.COPY_DST}),(g=(o=this.device).pushErrorScope)==null||g.call(o,"validation"),this.pipeline=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:$}),entryPoint:"main"}});const u=await((a=(m=this.device).popErrorScope)==null?void 0:a.call(m));if(u)throw new Error(`Maxwell WebGPU validation: ${u.message||u}`);(f=this.device.lost)==null||f.then(h=>{this.lastError=(h==null?void 0:h.message)||(h==null?void 0:h.reason)||"Maxwell WebGPU device lost",E.set(this.stateKey,this.lastError)})}async step(t,i={}){var m,a;await this.initialize(t.width,t.height);const c=globalThis.GPUMapMode;if(!c)throw new Error("GPUMapMode unavailable for Maxwell worker");const r=j(t),n=new Float32Array([t.width,t.height,T(p(i.dt,.01),0,.1),p(i.lightSpeed,1,0,10),T(p(i.damping,.996),0,1),0,0,0]),l=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.currentBuffer}},{binding:1,resource:{buffer:this.nextBuffer}},{binding:2,resource:{buffer:this.paramBuffer}}]});this.device.queue.writeBuffer(this.currentBuffer,0,r),this.device.queue.writeBuffer(this.paramBuffer,0,n);const u=this.device.createCommandEncoder(),s=u.beginComputePass();s.setPipeline(this.pipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(Math.ceil(t.width*t.height/64)),s.end(),u.copyBufferToBuffer(this.nextBuffer,0,this.readBuffer,0,r.byteLength),this.device.queue.submit([u.finish()]),await((a=(m=this.device.queue).onSubmittedWorkDone)==null?void 0:a.call(m)),await this.readBuffer.mapAsync(c.READ);const o=this.readBuffer.getMappedRange(),g=new Float32Array(o).slice();return this.readBuffer.unmap(),V(t,g),t.elapsedTime+=n[2],t.sequence+=1,this.submittedSteps+=1,{backend:"webgpu-maxwell-fdtd",webgpuStatus:{stateKey:this.stateKey,width:t.width,height:t.height,submittedSteps:this.submittedSteps}}}}function J(e={}){const t=I(e);let i=0,c=0,r=0;const n=[0,0,0],l=t.width*t.height;for(let u=0;u<l;u+=1){const s=u*3,o=t.electric[s],g=t.electric[s+1],m=t.electric[s+2],a=t.magnetic[s],f=t.magnetic[s+1],h=t.magnetic[s+2];i+=.5*(o*o+g*g+m*m),c+=.5*(a*a+f*f+h*h),r+=t.chargeDensity[u],n[0]+=g*h-m*f,n[1]+=m*a-o*h,n[2]+=o*f-g*a}return{schema:"peercompute.multiscale.maxwell.diagnostics.v0",width:t.width,height:t.height,cellCount:l,electricEnergy:i,magneticEnergy:c,fieldEnergy:i+c,netCharge:r,poyntingFlux:n.map(u=>u/Math.max(1,l))}}function Q(e,t={}){const i=T(p(t.dt,.01),0,.1),c=p(t.lightSpeed,1,0,10),r=T(p(t.damping,.996),0,1),n=e.width,l=e.height,u=[...e.electric],s=[...e.magnetic];for(let o=0;o<l;o+=1){const g=A(o+1,l),m=A(o-1,l);for(let a=0;a<n;a+=1){const f=A(a+1,n),h=A(a-1,n),d=y(a,o,n)*3,w=y(f,o,n)*3,D=y(h,o,n)*3,x=y(a,g,n)*3,_=y(a,m,n)*3,O=(e.magnetic[w+1]-e.magnetic[D+1])*.5,U=(e.magnetic[x]-e.magnetic[_])*.5,q=O-U,P=(e.electric[x+2]-e.electric[_+2])*.5,L=(e.electric[w+2]-e.electric[D+2])*.5,W=(e.electric[w+1]-e.electric[D+1])*.5,N=(e.electric[x]-e.electric[_])*.5;u[d]=(e.electric[d]+(P-e.currentDensity[d])*i)*r,u[d+1]=(e.electric[d+1]+(-L-e.currentDensity[d+1])*i)*r,u[d+2]=(e.electric[d+2]+(q-e.currentDensity[d+2])*i)*r,s[d]=(e.magnetic[d]-P*i*c)*r,s[d+1]=(e.magnetic[d+1]+L*i*c)*r,s[d+2]=(e.magnetic[d+2]-(W-N)*i*c)*r}}return e.electric=u,e.magnetic=s,e.elapsedTime+=i,e.sequence+=1,e}async function ee(e,{stateKey:t,input:i}){if(i.enableWebGPU!==!1&&i.webgpu!==!1&&!E.has(t))try{let n=M.get(t);return n||(n=new Z(t),M.set(t,n)),await n.step(e,i)}catch(n){const l=n instanceof Error?n.message:String(n);E.set(t,l)}return Q(e,i),{backend:"cpu-maxwell-fdtd",webgpuStatus:null,webgpuError:E.get(t)||null}}function te(e={}){var i,c;const t=e.input||e;return{payload:e,input:t,stateKey:e.stateKey||t.stateKey||t.taskId||z,scope:t.scope||e.scope||((c=(i=e.solver)==null?void 0:i.warmDelta)==null?void 0:c.scope)||K,taskId:t.taskId||e.stateKey||t.stateKey||z,emitCommitDelta:t.emitCommitDelta===!0||e.emitCommitDelta===!0}}function re({payload:e,stateKey:t,state:i,diagnostics:c,backend:r,webgpuStatus:n,webgpuError:l}){var u,s,o;return{schema:((s=(u=e.solver)==null?void 0:u.warmDelta)==null?void 0:s.schema)||X,solverId:((o=e.solver)==null?void 0:o.id)||"maxwell-em",stateKey:t,backend:r,sequence:i.sequence,elapsedTime:i.elapsedTime,state:C(i),diagnostics:c,webgpuStatus:n,webgpuError:l,conservation:{netCharge:c.netCharge,fieldEnergy:c.fieldEnergy,chargeAudit:"periodic-tile-reduced"},units:{electricField:"reduced V/m",magneticField:"reduced T",fieldEnergy:"reduced J"}}}function ie(e={}){if(e.stateKey||e.taskId){const t=e.stateKey||e.taskId;v.delete(t),M.delete(t),E.delete(t)}else v.clear(),M.clear(),E.clear();return{ok:!0,schema:k,executionContext:R()}}async function ne(e={}){var o;const t=te(e),{input:i,stateKey:c}=t,r=i.reset===!0,n=i.state||r||!v.has(c)?I(i.state||G(i)):C(v.get(c)),l=await ee(n,{stateKey:c,input:i});v.set(c,C(n));const u=J(n),s={ok:!0,schema:k,executionContext:R(),solverId:((o=e.solver)==null?void 0:o.id)||"maxwell-em",stateKey:c,backend:l.backend,sequence:n.sequence,elapsedTime:n.elapsedTime,state:C(n),diagnostics:u,webgpuStatus:l.webgpuStatus,webgpuError:l.webgpuError};return t.emitCommitDelta?{value:s,commitDelta:{taskId:t.taskId,scope:t.scope,version:n.sequence,timestamp:Date.now(),payload:re({payload:e,stateKey:c,state:n,diagnostics:u,backend:l.backend,webgpuStatus:l.webgpuStatus,webgpuError:l.webgpuError})}}:s}export{X as MAXWELL_FIELD_DELTA_SCHEMA,k as MAXWELL_FIELD_RESULT_SCHEMA,B as MAXWELL_FIELD_STATE_SCHEMA,J as computeMaxwellDiagnostics,G as makeMaxwellInitialState,ie as resetMaxwellFields,ne as stepMaxwellFields};

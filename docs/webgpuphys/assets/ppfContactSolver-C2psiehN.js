import{r as Ue,s as ze}from"./ModelEvidenceService-Cqouo3eH.js";import{f as Me,p as Ge,i as _e}from"./device-CB8g0LHY.js";
import{P as Ie}from"./particleRenderer-B5B5iTdk.js";import{O as Ee}from"./orbitControls-rEfmTUzB.js";const c=document.getElementById(
"canvas"),re=document.getElementById("error"),ie=document.getElementById("particleCount"),ae=document.getElementById("fp\
s"),u=document.getElementById("particleInput"),ne=document.getElementById("particleApply"),M=document.getElementById("it\
erInput"),L=document.getElementById("iterValue"),G=document.getElementById("frictionInput"),F=document.getElementById("f\
rictionValue"),oe=128,se=2e5,S=1024,x=64,r={particleCount:S,radius:.2,ghat:.08,mass:1,gravityY:-9.8,damping:.995,boxHalf:20,
forceLimit:220,stiffnessScale:.75,solverIterations:8,friction:.35,frictionEps:.001};r.particleCount=Oe();u&&(u.value=String(
r.particleCount));M&&L&&(M.value=String(r.solverIterations),L.textContent=String(r.solverIterations));G&&F&&(G.value=String(
r.friction),F.textContent=r.friction.toFixed(2));function ce(i){const a=Math.round(Number(i));return Number.isFinite(a)?
Math.min(se,Math.max(oe,a)):S}function Oe(){if(typeof window>"u")return S;const a=new URLSearchParams(window.location.search||
"").get("particles");if(!a)return S;const n=parseInt(a,10);return Number.isFinite(n)?ce(n):S}function De(i){if(typeof window>
"u")return;const a=new URL(window.location.href);a.searchParams.set("particles",String(i)),window.history.replaceState({},
"",a)}function Re(i,a,n){const s=new Float32Array(i*4),m=new Float32Array(i*4),l=Math.ceil(Math.cbrt(i)),e=n*1.6,p=Math.
min(a*2.2,e/Math.max(1,l-1)),g=p*(l-1)*.5;let t=0;for(let v=0;v<l&&t<i;v++)for(let h=0;h<l&&t<i;h++)for(let f=0;f<l&&t<i;f++){
const U=f*p-g,C=v*p-g+n*.35,_=h*p-g;s[t*4+0]=U,s[t*4+1]=C,s[t*4+2]=_,s[t*4+3]=t,m[t*4+0]=0,m[t*4+1]=0,m[t*4+2]=0,m[t*4+3]=
0,t++}return{positions:s,velocities:m}}let ue=Math.min(2,Math.max(1,window.devicePixelRatio||1));function Te(){const i=ue,
a=Math.max(1,Math.floor(c.clientWidth*i)),n=Math.max(1,Math.floor(c.clientHeight*i));return c.width!==a||c.height!==n?(c.
width=a,c.height=n,!0):!1}function Ae(i){re&&(re.textContent=i)}function le(){const i=ce(u==null?void 0:u.value);u&&(u.value=
String(i)),De(i),window.location.reload()}ne&&ne.addEventListener("click",()=>le());u&&u.addEventListener("keydown",i=>{
i.key==="Enter"&&le()});M&&L&&M.addEventListener("input",()=>{const i=Math.max(1,Math.min(32,Math.round(Number(M.value))));
r.solverIterations=i,L.textContent=String(i)});G&&F&&G.addEventListener("input",()=>{const i=Math.max(0,Math.min(1,Number(
G.value)));r.friction=i,F.textContent=i.toFixed(2)});function Le(i,a,n,s){const m=a*2+n,l=s*2,e=Math.min(262144,Math.max(
4096,Math.ceil(i*.75))),p=Math.max(1,Math.ceil(Math.cbrt(e))),g=Math.max(m*1.05,l/p),t=Math.max(1,Math.ceil(l/g)),v=t*t*
t,h=i/Math.max(1,v),f=Math.min(256,Math.max(32,Math.ceil(h*12)));return{cellSize:g,dim:[t,t,t],cellCount:v,cellCapacity:f,
min:[-s,-s,-s]}}async function Fe(){var i,a;try{let q=function(){!Te()&&z||(z&&z.destroy(),z=e.createTexture({size:[c.width,
c.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}))},Ce=function(B){o[0]=B,o[1]=r.radius,o[2]=r.ghat,
o[3]=r.mass,o[4]=r.gravityY,o[5]=r.damping,o[6]=r.boxHalf,o[7]=r.forceLimit,o[8]=r.stiffnessScale,o[9]=r.friction,o[10]=
t.cellSize,o[11]=r.frictionEps,o[12]=t.min[0],o[13]=t.min[1],o[14]=t.min[2],o[15]=0,b[16]=t.dim[0],b[17]=t.dim[1],b[18]=
t.dim[2],b[19]=t.cellCapacity,b[20]=r.particleCount,b[21]=r.solverIterations,b[22]=0,b[23]=0,e.queue.writeBuffer(O,0,V)},
Q=function(B){const $=Math.min(Math.max((B-J)*.001,0),.032);J=B;const ye=$>1e-6?1/$:0;N=N*.9+ye*.1,ae&&(ae.textContent=N.
toFixed(1)),ie&&(ie.textContent=r.particleCount),Ce($),q();const w=e.createCommandEncoder();w.copyBufferToBuffer(d[P],0,
I,0,C);const R=w.beginComputePass();R.setPipeline(X),R.setBindGroup(0,he),R.dispatchWorkgroups(Math.ceil(t.cellCount/x)),
R.end();const T=w.beginComputePass();T.setPipeline(Z),T.setBindGroup(0,be[P]),T.dispatchWorkgroups(Math.ceil(r.particleCount/
x)),T.end();for(let te=0;te<r.solverIterations;te++){const A=w.beginComputePass();A.setPipeline(k),A.setBindGroup(0,Pe[P]),
A.dispatchWorkgroups(Math.ceil(r.particleCount/x)),A.end(),P=1-P}P!==W&&(W=P,D.updateBindGroup(d[W]));const Be=p.getCurrentTexture().
createView(),ee=w.beginRenderPass({colorAttachments:[{view:Be,clearValue:{r:.02,g:.03,b:.025,a:1},loadOp:"clear",storeOp:"\
store"}],depthStencilAttachment:{view:z.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}}),we=c.
width/Math.max(1,c.height),Se=xe.getViewProj(we);D.updateViewProj(Se,r.radius),D.record(ee,r.particleCount),ee.end(),e.queue.
submit([w.finish()]),requestAnimationFrame(Q)};const n=Me(),s=await Ge({overrides:n});ue=Ue(s,null,n);const m=new URLSearchParams(
window.location.search||"").has("particles"),l=ze({kind:"count",name:"ppf-contact-particles",baseCount:S,requestedCount:m?
r.particleCount:null,minCount:oe,maxCount:se,multiple:64,strideBytes:32,buffersCount:5,workgroupSize:x,dispatchDimensions:1},
{capabilities:s,overrides:n});r.particleCount=l.count,u&&(u.max=String(l.effectiveMaxCount),u.value=String(r.particleCount));
const{device:e}=await _e({allowFallback:n.allowFallbackGpu===!0}),p=c.getContext("webgpu"),g=navigator.gpu.getPreferredCanvasFormat();
p.configure({device:e,format:g,alphaMode:"opaque"});const t=Le(r.particleCount,r.radius,r.ghat,r.boxHalf),v=Math.min(((i=
e.limits)==null?void 0:i.maxStorageBufferBindingSize)||128*1024*1024,((a=e.limits)==null?void 0:a.maxBufferSize)||256*1024*
1024),h=Math.max(8,Math.floor(v*.85/Math.max(1,t.cellCount*4)));t.cellCapacity>h&&(t.cellCapacity=h);const{positions:f,velocities:U}=Re(
r.particleCount,r.radius,r.boxHalf),C=f.byteLength,_=U.byteLength,d=[e.createBuffer({size:C,usage:GPUBufferUsage.STORAGE|
GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),e.createBuffer({size:C,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|
GPUBufferUsage.COPY_SRC})],y=[e.createBuffer({size:_,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.
COPY_SRC}),e.createBuffer({size:_,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],I=e.createBuffer(
{size:C,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});e.queue.writeBuffer(d[0],0,f),e.queue.
writeBuffer(d[1],0,f),e.queue.writeBuffer(y[0],0,U),e.queue.writeBuffer(y[1],0,U),e.queue.writeBuffer(I,0,f);const E=e.createBuffer(
{size:t.cellCount*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),Y=e.createBuffer({size:t.
cellCount*t.cellCapacity*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),j=e.createBuffer({size:4,usage:GPUBufferUsage.
STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),H=96,O=e.createBuffer({size:H,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.
COPY_DST}),fe=`
      @group(0) @binding(0) var<storage, read_write> gridCounts: array<atomic<u32>>;
      @group(0) @binding(1) var<storage, read_write> overflow: atomic<u32>;

      @compute @workgroup_size(${x})
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        if (id.x < arrayLength(&gridCounts)) {
          atomicStore(&gridCounts[id.x], 0u);
        }
        if (id.x == 0u) {
          atomicStore(&overflow, 0u);
        }
      }
    `,K=`
      struct SimParams {
        sim0: vec4<f32>,
        sim1: vec4<f32>,
        sim2: vec4<f32>,
        gridMin: vec4<f32>,
        gridDim: vec4<u32>,
        counts: vec4<u32>,
      };
    `,de=`
      ${K}

      @group(0) @binding(0) var<storage, read> positions: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> gridCounts: array<atomic<u32>>;
      @group(0) @binding(2) var<storage, read_write> gridIndices: array<u32>;
      @group(0) @binding(3) var<storage, read_write> overflow: atomic<u32>;
      @group(0) @binding(4) var<uniform> params: SimParams;

      @compute @workgroup_size(${x})
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        if (id.x >= params.counts.x) {
          return;
        }
        let pos = positions[id.x].xyz;
        let cellF = (pos - params.gridMin.xyz) / params.sim2.z;
        let cell = vec3<i32>(floor(cellF));
        let maxCell = vec3<i32>(i32(params.gridDim.x) - 1, i32(params.gridDim.y) - 1, i32(params.gridDim.z) - 1);
        let clamped = clamp(cell, vec3<i32>(0), maxCell);
        let cellIndex = u32(clamped.x) * params.gridDim.y * params.gridDim.z +
          u32(clamped.y) * params.gridDim.z +
          u32(clamped.z);
        let offset = atomicAdd(&gridCounts[cellIndex], 1u);
        if (offset < params.gridDim.w) {
          let base = cellIndex * params.gridDim.w;
          gridIndices[base + offset] = id.x;
        } else {
          atomicAdd(&overflow, 1u);
        }
      }
    `,me=`
      ${K}

      @group(0) @binding(0) var<storage, read> positionsIn: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read> velocitiesIn: array<vec4<f32>>;
      @group(0) @binding(2) var<storage, read> prevPositions: array<vec4<f32>>;
      @group(0) @binding(3) var<storage, read> gridCounts: array<u32>;
      @group(0) @binding(4) var<storage, read> gridIndices: array<u32>;
      @group(0) @binding(5) var<uniform> params: SimParams;
      @group(0) @binding(6) var<storage, read_write> positionsOut: array<vec4<f32>>;
      @group(0) @binding(7) var<storage, read_write> velocitiesOut: array<vec4<f32>>;

      fn cubic_gradient(g: f32, ghat: f32) -> f32 {
        let y = g - ghat;
        if (y < 0.0) {
          return -2.0 * y * y / ghat;
        }
        return 0.0;
      }

      fn barrier_force(g: f32, normal: vec3<f32>) -> vec3<f32> {
        if (g >= params.sim0.z) {
          return vec3(0.0);
        }
        let grad = cubic_gradient(g, params.sim0.z);
        let denom = max(g * g, 1e-5);
        let stiff = params.sim2.x * params.sim0.w / denom;
        let fmag = -grad * stiff;
        return normal * fmag;
      }

      fn friction_force(normal: vec3<f32>, contact: vec3<f32>, disp: vec3<f32>) -> vec3<f32> {
        let mu = params.sim2.y;
        let fmag = length(contact);
        if (mu <= 0.0 || fmag <= 0.0) {
          return vec3(0.0);
        }
        let tang = disp - normal * dot(disp, normal);
        let tLen = length(tang);
        if (tLen <= 1e-6) {
          return vec3(0.0);
        }
        let denom = max(params.sim2.w, tLen);
        let scale = mu * fmag / denom;
        return -tang * scale;
      }

      fn plane_contact(pos: vec3<f32>, prevPos: vec3<f32>, normal: vec3<f32>, planeD: f32) -> vec3<f32> {
        let g = dot(normal, pos) - planeD - params.sim0.y;
        if (g >= params.sim0.z) {
          return vec3(0.0);
        }
        let contact = barrier_force(g, normal);
        let disp = pos - prevPos;
        return contact + friction_force(normal, contact, disp);
      }

      fn particle_contact(
        pos: vec3<f32>,
        prevPos: vec3<f32>,
        otherPos: vec3<f32>,
        otherPrev: vec3<f32>
      ) -> vec3<f32> {
        let dir = pos - otherPos;
        let dist = length(dir);
        let g = dist - params.sim0.y * 2.0;
        if (g >= params.sim0.z) {
          return vec3(0.0);
        }
        let normal = dir / max(dist, 1e-5);
        let contact = barrier_force(g, normal);
        let disp = (pos - prevPos) - (otherPos - otherPrev);
        return contact + friction_force(normal, contact, disp);
      }

      @compute @workgroup_size(${x})
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        if (id.x >= params.counts.x) {
          return;
        }

        let posIn = positionsIn[id.x];
        var pos = posIn.xyz;
        var vel = velocitiesIn[id.x].xyz;
        let prevPos = prevPositions[id.x].xyz;

        var force = vec3<f32>(0.0, params.sim0.w * params.sim1.x, 0.0);

        force += plane_contact(pos, prevPos, vec3<f32>(1.0, 0.0, 0.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(-1.0, 0.0, 0.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(0.0, 1.0, 0.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(0.0, -1.0, 0.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(0.0, 0.0, 1.0), -params.sim1.z);
        force += plane_contact(pos, prevPos, vec3<f32>(0.0, 0.0, -1.0), -params.sim1.z);

        let cellF = (pos - params.gridMin.xyz) / params.sim2.z;
        let cell = vec3<i32>(floor(cellF));
        let maxCell = vec3<i32>(i32(params.gridDim.x) - 1, i32(params.gridDim.y) - 1, i32(params.gridDim.z) - 1);
        let baseCell = clamp(cell, vec3<i32>(0), maxCell);

        for (var dx = -1; dx <= 1; dx = dx + 1) {
          for (var dy = -1; dy <= 1; dy = dy + 1) {
            for (var dz = -1; dz <= 1; dz = dz + 1) {
              let neighbor = baseCell + vec3<i32>(dx, dy, dz);
              if (neighbor.x < 0 || neighbor.y < 0 || neighbor.z < 0 ||
                  neighbor.x > maxCell.x || neighbor.y > maxCell.y || neighbor.z > maxCell.z) {
                continue;
              }
              let cellIndex = u32(neighbor.x) * params.gridDim.y * params.gridDim.z +
                u32(neighbor.y) * params.gridDim.z +
                u32(neighbor.z);
              let count = min(gridCounts[cellIndex], params.gridDim.w);
              let base = cellIndex * params.gridDim.w;
              for (var i = 0u; i < count; i = i + 1u) {
                let otherIndex = gridIndices[base + i];
                if (otherIndex == id.x) {
                  continue;
                }
                let otherPos = positionsIn[otherIndex].xyz;
                let otherPrev = prevPositions[otherIndex].xyz;
                force += particle_contact(pos, prevPos, otherPos, otherPrev);
              }
            }
          }
        }

        let fLen = length(force);
        if (fLen > params.sim1.w) {
          force = (force / fLen) * params.sim1.w;
        }

        let iterCount = max(1u, params.counts.y);
        let dt = params.sim0.x / f32(iterCount);
        vel = vel + (force / params.sim0.w) * dt;
        vel = vel * params.sim1.y;
        pos = pos + vel * dt;
        let minPos = vec3<f32>(-params.sim1.z + params.sim0.y);
        let maxPos = vec3<f32>(params.sim1.z - params.sim0.y);
        pos = clamp(pos, minPos, maxPos);

        positionsOut[id.x] = vec4<f32>(pos, posIn.w);
        velocitiesOut[id.x] = vec4<f32>(vel, 0.0);
      }
    `,pe=e.createShaderModule({code:fe}),ge=e.createShaderModule({code:de}),ve=e.createShaderModule({code:me}),X=e.createComputePipeline(
{layout:"auto",compute:{module:pe,entryPoint:"main"}}),Z=e.createComputePipeline({layout:"auto",compute:{module:ge,entryPoint:"\
main"}}),k=e.createComputePipeline({layout:"auto",compute:{module:ve,entryPoint:"main"}}),he=e.createBindGroup({layout:X.
getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:E}},{binding:1,resource:{buffer:j}}]}),be=d.map(B=>e.createBindGroup(
{layout:Z.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:B}},{binding:1,resource:{buffer:E}},{binding:2,resource:{
buffer:Y}},{binding:3,resource:{buffer:j}},{binding:4,resource:{buffer:O}}]})),Pe=[e.createBindGroup({layout:k.getBindGroupLayout(
0),entries:[{binding:0,resource:{buffer:d[0]}},{binding:1,resource:{buffer:y[0]}},{binding:2,resource:{buffer:I}},{binding:3,
resource:{buffer:E}},{binding:4,resource:{buffer:Y}},{binding:5,resource:{buffer:O}},{binding:6,resource:{buffer:d[1]}},
{binding:7,resource:{buffer:y[1]}}]}),e.createBindGroup({layout:k.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d[1]}},
{binding:1,resource:{buffer:y[1]}},{binding:2,resource:{buffer:I}},{binding:3,resource:{buffer:E}},{binding:4,resource:{
buffer:Y}},{binding:5,resource:{buffer:O}},{binding:6,resource:{buffer:d[0]}},{binding:7,resource:{buffer:y[0]}}]})],D=new Ie(
e);D.updateBindGroup(d[0]);const xe=new Ee(c,{radius:48,target:[0,0,0]});let z=null;const V=new ArrayBuffer(H),o=new Float32Array(
V),b=new Uint32Array(V);let J=performance.now(),N=60,P=0,W=0;window.addEventListener("resize",()=>{q()}),q(),requestAnimationFrame(
Q)}catch(n){console.error(n),Ae(n.message||"Failed to start WebGPU demo")}}Fe();

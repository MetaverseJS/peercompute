import{r as X,s as J}from"./ModelEvidenceService-Cqouo3eH.js";import{f as K,p as Q,i as Z}from"./device-CB8g0LHY.js";import{
P as $}from"./particleRenderer-B5B5iTdk.js";import{O as ee}from"./orbitControls-rEfmTUzB.js";const o=document.getElementById(
"canvas"),G=document.getElementById("error"),T=document.getElementById("particleCount"),O=document.getElementById("fps"),
s=document.getElementById("particleInput"),A=document.getElementById("particleApply"),R=128,F=2e5,m=128,r={particleCount:m,
radius:.2,ghat:.08,mass:1,gravityY:-9.8,damping:.995,boxHalf:4.2,forceLimit:180,stiffnessScale:.75};r.particleCount=te();
s&&(s.value=String(r.particleCount));function z(e){const a=Math.round(Number(e));return Number.isFinite(a)?Math.min(F,Math.
max(R,a)):m}function te(){if(typeof window>"u")return m;const a=new URLSearchParams(window.location.search||"").get("par\
ticles");if(!a)return m;const n=parseInt(a,10);return Number.isFinite(n)?z(n):m}function re(e){if(typeof window>"u")return;
const a=new URL(window.location.href);a.searchParams.set("particles",String(e)),window.history.replaceState({},"",a)}function ae(e,a){
const n=new Float32Array(e*4),f=new Float32Array(e*4),t=Math.ceil(Math.cbrt(e)),u=a*2.35,y=1.6;let i=0;for(let p=0;p<t&&
i<e;p++)for(let l=0;l<t&&i<e;l++)for(let d=0;d<t&&i<e;d++){const h=(d-t*.5)*u,B=y+p*u,w=(l-t*.5)*u;n[i*4+0]=h,n[i*4+1]=B,
n[i*4+2]=w,n[i*4+3]=i,f[i*4+0]=0,f[i*4+1]=0,f[i*4+2]=0,f[i*4+3]=0,i++}return{positions:n,velocities:f}}let I=Math.min(2,
Math.max(1,window.devicePixelRatio||1));function ie(){const e=I,a=Math.max(1,Math.floor(o.clientWidth*e)),n=Math.max(1,Math.
floor(o.clientHeight*e));return o.width!==a||o.height!==n?(o.width=a,o.height=n,!0):!1}function ne(e){G&&(G.textContent=
e)}function D(){const e=z(s==null?void 0:s.value);s&&(s.value=String(e)),re(e),window.location.reload()}A&&A.addEventListener(
"click",()=>D());s&&s.addEventListener("keydown",e=>{e.key==="Enter"&&D()});async function oe(){try{let P=function(){!ie()&&
g||(g&&g.destroy(),g=t.createTexture({size:[o.width,o.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}))},
q=function(v){c[0]=v,c[1]=r.ghat,c[2]=r.radius,c[3]=r.mass,c[4]=r.gravityY,c[5]=r.damping,c[6]=r.boxHalf,c[7]=r.forceLimit,
c[8]=r.particleCount,c[9]=r.stiffnessScale,t.queue.writeBuffer(h,0,c)},M=function(v){const U=Math.min(Math.max((v-_)*.001,
0),.032);_=v;const H=U>1e-6?1/U:0;x=x*.9+H*.1,O&&(O.textContent=x.toFixed(1)),T&&(T.textContent=r.particleCount),q(U),P();
const S=t.createCommandEncoder(),b=S.beginComputePass();b.setPipeline(Y),b.setBindGroup(0,j),b.dispatchWorkgroups(Math.ceil(
r.particleCount/64)),b.end();const V=u.getCurrentTexture().createView(),L=S.beginRenderPass({colorAttachments:[{view:V,clearValue:{
r:.02,g:.03,b:.025,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:g.createView(),depthClearValue:1,depthLoadOp:"\
clear",depthStoreOp:"store"}}),N=o.width/Math.max(1,o.height),W=k.getViewProj(N);C.updateViewProj(W,r.radius),C.record(L,
r.particleCount),L.end(),t.queue.submit([S.finish()]),requestAnimationFrame(M)};const e=K(),a=await Q({overrides:e});I=X(
a,null,e);const n=new URLSearchParams(window.location.search||"").has("particles"),f=J({kind:"count",name:"ppf-cubic-bar\
rier",baseCount:m,requestedCount:n?r.particleCount:null,minCount:R,maxCount:F,multiple:64,strideBytes:32,buffersCount:2,
complexity:"O(N^2)",quadraticBaseCap:2048},{capabilities:a,overrides:e});r.particleCount=f.count,s&&(s.max=String(f.effectiveMaxCount),
s.value=String(r.particleCount));const{device:t}=await Z({allowFallback:e.allowFallbackGpu===!0}),u=o.getContext("webgpu"),
y=navigator.gpu.getPreferredCanvasFormat();u.configure({device:t,format:y,alphaMode:"opaque"});const{positions:i,velocities:p}=ae(
r.particleCount,r.radius),l=t.createBuffer({size:i.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.
COPY_SRC});t.queue.writeBuffer(l,0,i);const d=t.createBuffer({size:p.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.
COPY_DST|GPUBufferUsage.COPY_SRC});t.queue.writeBuffer(d,0,p);const h=t.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|
GPUBufferUsage.COPY_DST}),w=t.createShaderModule({code:`
      struct Params {
        dt: f32,
        ghat: f32,
        radius: f32,
        mass: f32,
        gravityY: f32,
        damping: f32,
        boxHalf: f32,
        forceLimit: f32,
        count: f32,
        stiffnessScale: f32,
        pad0: vec2<f32>,
      };

      @group(0) @binding(0) var<storage, read_write> positions: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> velocities: array<vec4<f32>>;
      @group(0) @binding(2) var<uniform> params: Params;

      fn cubic_gradient(g: f32, ghat: f32, offset: f32) -> f32 {
        let gg = g - offset;
        let y = gg - ghat;
        if (y < 0.0) {
          return -2.0 * y * y / ghat;
        }
        return 0.0;
      }

      fn barrier_force(g: f32, normal: vec3<f32>) -> vec3<f32> {
        if (g >= params.ghat) {
          return vec3(0.0);
        }
        let grad = cubic_gradient(g, params.ghat, 0.0);
        let denom = max(g * g, 1e-5);
        let stiff = params.stiffnessScale * params.mass / denom;
        let fmag = -grad * stiff;
        return normal * fmag;
      }

      fn apply_plane(pos: vec3<f32>, normal: vec3<f32>, planeD: f32) -> vec3<f32> {
        let g = dot(normal, pos) - planeD - params.radius;
        return barrier_force(g, normal);
      }

      @compute @workgroup_size(64)
      fn cs_main(@builtin(global_invocation_id) id: vec3<u32>) {
        let idx = id.x;
        let count = u32(params.count);
        if (idx >= count) {
          return;
        }

        var pos = positions[idx].xyz;
        var vel = velocities[idx].xyz;
        let idVal = positions[idx].w;

        var force = vec3<f32>(0.0, params.mass * params.gravityY, 0.0);

        force += apply_plane(pos, vec3<f32>(0.0, 1.0, 0.0), 0.0);
        force += apply_plane(pos, vec3<f32>(1.0, 0.0, 0.0), -params.boxHalf);
        force += apply_plane(pos, vec3<f32>(-1.0, 0.0, 0.0), -params.boxHalf);
        force += apply_plane(pos, vec3<f32>(0.0, 0.0, 1.0), -params.boxHalf);
        force += apply_plane(pos, vec3<f32>(0.0, 0.0, -1.0), -params.boxHalf);

        for (var j: u32 = 0u; j < count; j = j + 1u) {
          if (j == idx) {
            continue;
          }
          let other = positions[j].xyz;
          let dir = pos - other;
          let dist = length(dir);
          let g = dist - (params.radius * 2.0);
          if (g < params.ghat) {
            let normal = dir / max(dist, 1e-5);
            force += barrier_force(g, normal);
          }
        }

        let fLen = length(force);
        if (fLen > params.forceLimit) {
          force = (force / fLen) * params.forceLimit;
        }

        vel = vel + (force / params.mass) * params.dt;
        vel = vel * params.damping;
        pos = pos + vel * params.dt;

        positions[idx] = vec4<f32>(pos, idVal);
        velocities[idx] = vec4<f32>(vel, 0.0);
      }
    `}),E=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,
visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"un\
iform"}}]}),Y=t.createComputePipeline({layout:t.createPipelineLayout({bindGroupLayouts:[E]}),compute:{module:w,entryPoint:"\
cs_main"}}),j=t.createBindGroup({layout:E,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:d}},{binding:2,
resource:{buffer:h}}]}),C=new $(t);C.updateBindGroup(l);const k=new ee(o,{radius:12,target:[0,1,0]});let g=null;const c=new Float32Array(
16);let _=performance.now(),x=60;window.addEventListener("resize",()=>{P()}),P(),requestAnimationFrame(M)}catch(e){console.
error(e),ne(e.message||"Failed to start WebGPU demo")}}oe();

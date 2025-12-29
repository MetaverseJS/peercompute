import{i as D}from"./device-CAsdAK37.js";import{P as H}from"./particleRenderer-5MAhjokF.js";import{O as V}from"./orbitControls-DxPB4Vr4.js";const n=document.getElementById("canvas"),L=document.getElementById("error"),G=document.getElementById("particleCount"),M=document.getElementById("fps"),s=document.getElementById("particleInput"),T=document.getElementById("particleApply"),q=128,N=2e5,g=128,t={particleCount:g,radius:.2,ghat:.08,mass:1,gravityY:-9.8,damping:.995,boxHalf:4.2,forceLimit:180,stiffnessScale:.75};t.particleCount=k();s&&(s.value=String(t.particleCount));function A(e){const r=Math.round(Number(e));return Number.isFinite(r)?Math.min(N,Math.max(q,r)):g}function k(){if(typeof window>"u")return g;const r=new URLSearchParams(window.location.search||"").get("particles");if(!r)return g;const i=parseInt(r,10);return Number.isFinite(i)?A(i):g}function W(e){if(typeof window>"u")return;const r=new URL(window.location.href);r.searchParams.set("particles",String(e)),window.history.replaceState({},"",r)}function X(e,r){const i=new Float32Array(e*4),c=new Float32Array(e*4),f=Math.ceil(Math.cbrt(e)),u=r*2.35,h=1.6;let a=0;for(let v=0;v<f&&a<e;v++)for(let p=0;p<f&&a<e;p++)for(let l=0;l<f&&a<e;l++){const P=(l-f*.5)*u,w=h+v*u,d=(p-f*.5)*u;i[a*4+0]=P,i[a*4+1]=w,i[a*4+2]=d,i[a*4+3]=a,c[a*4+0]=0,c[a*4+1]=0,c[a*4+2]=0,c[a*4+3]=0,a++}return{positions:i,velocities:c}}function J(){const e=Math.max(1,window.devicePixelRatio||1),r=Math.floor(n.clientWidth*e),i=Math.floor(n.clientHeight*e);return n.width!==r||n.height!==i?(n.width=r,n.height=i,!0):!1}function K(e){L&&(L.textContent=e)}function O(){const e=A(s==null?void 0:s.value);s&&(s.value=String(e)),W(e),window.location.reload()}T&&T.addEventListener("click",()=>O());s&&s.addEventListener("keydown",e=>{e.key==="Enter"&&O()});async function Q(){try{let x=function(){!J()&&m||(m&&m.destroy(),m=e.createTexture({size:[n.width,n.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}))},F=function(y){o[0]=y,o[1]=t.ghat,o[2]=t.radius,o[3]=t.mass,o[4]=t.gravityY,o[5]=t.damping,o[6]=t.boxHalf,o[7]=t.forceLimit,o[8]=t.particleCount,o[9]=t.stiffnessScale,e.queue.writeBuffer(a,0,o)},E=function(y){const U=Math.min(Math.max((y-B)*.001,0),.032);B=y;const I=U>1e-6?1/U:0;C=C*.9+I*.1,M&&(M.textContent=C.toFixed(1)),G&&(G.textContent=t.particleCount),F(U),x();const S=e.createCommandEncoder(),b=S.beginComputePass();b.setPipeline(P),b.setBindGroup(0,w),b.dispatchWorkgroups(Math.ceil(t.particleCount/64)),b.end();const z=r.getCurrentTexture().createView(),_=S.beginRenderPass({colorAttachments:[{view:z,clearValue:{r:.02,g:.03,b:.025,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:m.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}}),Y=n.width/Math.max(1,n.height),j=R.getViewProj(Y);d.updateViewProj(j,t.radius),d.record(_,t.particleCount),_.end(),e.queue.submit([S.finish()]),requestAnimationFrame(E)};const{device:e}=await D(),r=n.getContext("webgpu"),i=navigator.gpu.getPreferredCanvasFormat();r.configure({device:e,format:i,alphaMode:"opaque"});const{positions:c,velocities:f}=X(t.particleCount,t.radius),u=e.createBuffer({size:c.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});e.queue.writeBuffer(u,0,c);const h=e.createBuffer({size:f.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});e.queue.writeBuffer(h,0,f);const a=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=e.createShaderModule({code:`
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
    `}),l=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),P=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:p,entryPoint:"cs_main"}}),w=e.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:h}},{binding:2,resource:{buffer:a}}]}),d=new H(e);d.updateBindGroup(u);const R=new V(n,{radius:12,target:[0,1,0]});let m=null;const o=new Float32Array(16);let B=performance.now(),C=60;window.addEventListener("resize",()=>{x()}),x(),requestAnimationFrame(E)}catch(e){console.error(e),K(e.message||"Failed to start WebGPU demo")}}Q();

import{i as R}from"./device-CAsdAK37.js";import{P as Y}from"./particleRenderer-xFdTy0S0.js";import{O as j}from"./orbitControls-7kOmSw7O.js";const a=document.getElementById("canvas"),G=document.getElementById("error"),S=document.getElementById("particleCount"),E=document.getElementById("fps"),r={particleCount:128,radius:.2,ghat:.08,mass:1,gravityY:-9.8,damping:.995,boxHalf:4.2,forceLimit:180,stiffnessScale:.75};function F(e,f){const o=new Float32Array(e*4),n=new Float32Array(e*4),s=Math.ceil(Math.cbrt(e)),c=f*2.35,g=1.6;let t=0;for(let m=0;m<s&&t<e;m++)for(let p=0;p<s&&t<e;p++)for(let u=0;u<s&&t<e;u++){const b=(u-s*.5)*c,y=g+m*c,l=(p-s*.5)*c;o[t*4+0]=b,o[t*4+1]=y,o[t*4+2]=l,o[t*4+3]=t,n[t*4+0]=0,n[t*4+1]=0,n[t*4+2]=0,n[t*4+3]=0,t++}return{positions:o,velocities:n}}function H(){const e=Math.max(1,window.devicePixelRatio||1),f=Math.floor(a.clientWidth*e),o=Math.floor(a.clientHeight*e);return a.width!==f||a.height!==o?(a.width=f,a.height=o,!0):!1}function V(e){G&&(G.textContent=e)}async function D(){try{let x=function(){!H()&&d||(d&&d.destroy(),d=e.createTexture({size:[a.width,a.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}))},O=function(h){i[0]=h,i[1]=r.ghat,i[2]=r.radius,i[3]=r.mass,i[4]=r.gravityY,i[5]=r.damping,i[6]=r.boxHalf,i[7]=r.forceLimit,i[8]=r.particleCount,i[9]=r.stiffnessScale,e.queue.writeBuffer(t,0,i)},B=function(h){const C=Math.min(Math.max((h-U)*.001,0),.032);U=h;const T=C>1e-6?1/C:0;P=P*.9+T*.1,E&&(E.textContent=P.toFixed(1)),S&&(S.textContent=r.particleCount),O(C),x();const w=e.createCommandEncoder(),v=w.beginComputePass();v.setPipeline(b),v.setBindGroup(0,y),v.dispatchWorkgroups(Math.ceil(r.particleCount/64)),v.end();const L=f.getCurrentTexture().createView(),_=w.beginRenderPass({colorAttachments:[{view:L,clearValue:{r:.02,g:.03,b:.025,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:d.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}}),z=a.width/Math.max(1,a.height),A=M.getViewProj(z);l.updateViewProj(A,r.radius),l.record(_,r.particleCount),_.end(),e.queue.submit([w.finish()]),requestAnimationFrame(B)};const{device:e}=await R(),f=a.getContext("webgpu"),o=navigator.gpu.getPreferredCanvasFormat();f.configure({device:e,format:o,alphaMode:"opaque"});const{positions:n,velocities:s}=F(r.particleCount,r.radius),c=e.createBuffer({size:n.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});e.queue.writeBuffer(c,0,n);const g=e.createBuffer({size:s.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});e.queue.writeBuffer(g,0,s);const t=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=e.createShaderModule({code:`
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
    `}),u=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),b=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:p,entryPoint:"cs_main"}}),y=e.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:g}},{binding:2,resource:{buffer:t}}]}),l=new Y(e);l.updateBindGroup(c);const M=new j(a,{radius:12,target:[0,1,0]});let d=null;const i=new Float32Array(16);let U=performance.now(),P=60;window.addEventListener("resize",()=>{x()}),x(),requestAnimationFrame(B)}catch(e){console.error(e),V(e.message||"Failed to start WebGPU demo")}}D();

import{i as ge}from"./device-CAsdAK37.js";import{P as ve}from"./particleRenderer-5MAhjokF.js";import{O as Pe}from"./orbitControls-DxPB4Vr4.js";const f=document.getElementById("canvas"),H=document.getElementById("error"),K=document.getElementById("particleCount"),X=document.getElementById("fps"),g=document.getElementById("particleInput"),Z=document.getElementById("particleApply"),w=document.getElementById("iterInput"),O=document.getElementById("iterValue"),U=document.getElementById("frictionInput"),D=document.getElementById("frictionValue"),he=128,be=2e5,S=1024,C=64,r={particleCount:S,radius:.2,ghat:.08,mass:1,gravityY:-9.8,damping:.995,boxHalf:20,forceLimit:220,stiffnessScale:.75,solverIterations:8,friction:.35,frictionEps:.001};r.particleCount=xe();g&&(g.value=String(r.particleCount));w&&O&&(w.value=String(r.solverIterations),O.textContent=String(r.solverIterations));U&&D&&(U.value=String(r.friction),D.textContent=r.friction.toFixed(2));function J(e){const a=Math.round(Number(e));return Number.isFinite(a)?Math.min(be,Math.max(he,a)):S}function xe(){if(typeof window>"u")return S;const a=new URLSearchParams(window.location.search||"").get("particles");if(!a)return S;const s=parseInt(a,10);return Number.isFinite(s)?J(s):S}function ye(e){if(typeof window>"u")return;const a=new URL(window.location.href);a.searchParams.set("particles",String(e)),window.history.replaceState({},"",a)}function Ce(e,a,s){const i=new Float32Array(e*4),c=new Float32Array(e*4),u=Math.ceil(Math.cbrt(e)),v=s*1.6,m=Math.min(a*2.2,v/Math.max(1,u-1)),n=m*(u-1)*.5;let t=0;for(let l=0;l<u&&t<e;l++)for(let d=0;d<u&&t<e;d++)for(let p=0;p<u&&t<e;p++){const z=p*m-n,G=l*m-n+s*.35,b=d*m-n;i[t*4+0]=z,i[t*4+1]=G,i[t*4+2]=b,i[t*4+3]=t,c[t*4+0]=0,c[t*4+1]=0,c[t*4+2]=0,c[t*4+3]=0,t++}return{positions:i,velocities:c}}function Be(){const e=Math.max(1,window.devicePixelRatio||1),a=Math.floor(f.clientWidth*e),s=Math.floor(f.clientHeight*e);return f.width!==a||f.height!==s?(f.width=a,f.height=s,!0):!1}function we(e){H&&(H.textContent=e)}function Q(){const e=J(g==null?void 0:g.value);g&&(g.value=String(e)),ye(e),window.location.reload()}Z&&Z.addEventListener("click",()=>Q());g&&g.addEventListener("keydown",e=>{e.key==="Enter"&&Q()});w&&O&&w.addEventListener("input",()=>{const e=Math.max(1,Math.min(32,Math.round(Number(w.value))));r.solverIterations=e,O.textContent=String(e)});U&&D&&U.addEventListener("input",()=>{const e=Math.max(0,Math.min(1,Number(U.value)));r.friction=e,D.textContent=e.toFixed(2)});function Ue(e,a,s,i){const c=a*2+s,u=i*2,v=Math.min(262144,Math.max(4096,Math.ceil(e*.75))),m=Math.max(1,Math.ceil(Math.cbrt(v))),n=Math.max(c*1.05,u/m),t=Math.max(1,Math.ceil(u/n)),l=t*t*t,d=e/Math.max(1,l),p=Math.min(256,Math.max(32,Math.ceil(d*12)));return{cellSize:n,dim:[t,t,t],cellCount:l,cellCapacity:p,min:[-i,-i,-i]}}async function Se(){try{let R=function(){!Be()&&B||(B&&B.destroy(),B=e.createTexture({size:[f.width,f.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}))},fe=function(x){o[0]=x,o[1]=r.radius,o[2]=r.ghat,o[3]=r.mass,o[4]=r.gravityY,o[5]=r.damping,o[6]=r.boxHalf,o[7]=r.forceLimit,o[8]=r.stiffnessScale,o[9]=r.friction,o[10]=i.cellSize,o[11]=r.frictionEps,o[12]=i.min[0],o[13]=i.min[1],o[14]=i.min[2],o[15]=0,P[16]=i.dim[0],P[17]=i.dim[1],P[18]=i.dim[2],P[19]=i.cellCapacity,P[20]=r.particleCount,P[21]=r.solverIterations,P[22]=0,P[23]=0,e.queue.writeBuffer(b,0,A)},W=function(x){const Y=Math.min(Math.max((x-N)*.001,0),.032);N=x;const le=Y>1e-6?1/Y:0;L=L*.9+le*.1,X&&(X.textContent=L.toFixed(1)),K&&(K.textContent=r.particleCount),fe(Y),R();const y=e.createCommandEncoder();y.copyBufferToBuffer(n[h],0,l,0,v);const I=y.beginComputePass();I.setPipeline(q),I.setBindGroup(0,oe),I.dispatchWorkgroups(Math.ceil(i.cellCount/C)),I.end();const M=y.beginComputePass();M.setPipeline(k),M.setBindGroup(0,se[h]),M.dispatchWorkgroups(Math.ceil(r.particleCount/C)),M.end();for(let j=0;j<r.solverIterations;j++){const E=y.beginComputePass();E.setPipeline(T),E.setBindGroup(0,ce[h]),E.dispatchWorkgroups(Math.ceil(r.particleCount/C)),E.end(),h=1-h}h!==F&&(F=h,_.updateBindGroup(n[F]));const de=a.getCurrentTexture().createView(),$=y.beginRenderPass({colorAttachments:[{view:de,clearValue:{r:.02,g:.03,b:.025,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:B.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}}),me=f.width/Math.max(1,f.height),pe=ue.getViewProj(me);_.updateViewProj(pe,r.radius),_.record($,r.particleCount),$.end(),e.queue.submit([y.finish()]),requestAnimationFrame(W)};const{device:e}=await ge(),a=f.getContext("webgpu"),s=navigator.gpu.getPreferredCanvasFormat();a.configure({device:e,format:s,alphaMode:"opaque"});const i=Ue(r.particleCount,r.radius,r.ghat,r.boxHalf),{positions:c,velocities:u}=Ce(r.particleCount,r.radius,r.boxHalf),v=c.byteLength,m=u.byteLength,n=[e.createBuffer({size:v,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),e.createBuffer({size:v,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],t=[e.createBuffer({size:m,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),e.createBuffer({size:m,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],l=e.createBuffer({size:v,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});e.queue.writeBuffer(n[0],0,c),e.queue.writeBuffer(n[1],0,c),e.queue.writeBuffer(t[0],0,u),e.queue.writeBuffer(t[1],0,u),e.queue.writeBuffer(l,0,c);const d=e.createBuffer({size:i.cellCount*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),p=e.createBuffer({size:i.cellCount*i.cellCapacity*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),z=e.createBuffer({size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),G=96,b=e.createBuffer({size:G,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),ee=`
      @group(0) @binding(0) var<storage, read_write> gridCounts: array<atomic<u32>>;
      @group(0) @binding(1) var<storage, read_write> overflow: atomic<u32>;

      @compute @workgroup_size(${C})
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        if (id.x < arrayLength(&gridCounts)) {
          atomicStore(&gridCounts[id.x], 0u);
        }
        if (id.x == 0u) {
          atomicStore(&overflow, 0u);
        }
      }
    `,V=`
      struct SimParams {
        sim0: vec4<f32>,
        sim1: vec4<f32>,
        sim2: vec4<f32>,
        gridMin: vec4<f32>,
        gridDim: vec4<u32>,
        counts: vec4<u32>,
      };
    `,re=`
      ${V}

      @group(0) @binding(0) var<storage, read> positions: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> gridCounts: array<atomic<u32>>;
      @group(0) @binding(2) var<storage, read_write> gridIndices: array<u32>;
      @group(0) @binding(3) var<storage, read_write> overflow: atomic<u32>;
      @group(0) @binding(4) var<uniform> params: SimParams;

      @compute @workgroup_size(${C})
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
    `,te=`
      ${V}

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

      @compute @workgroup_size(${C})
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
    `,ie=e.createShaderModule({code:ee}),ae=e.createShaderModule({code:re}),ne=e.createShaderModule({code:te}),q=e.createComputePipeline({layout:"auto",compute:{module:ie,entryPoint:"main"}}),k=e.createComputePipeline({layout:"auto",compute:{module:ae,entryPoint:"main"}}),T=e.createComputePipeline({layout:"auto",compute:{module:ne,entryPoint:"main"}}),oe=e.createBindGroup({layout:q.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:z}}]}),se=n.map(x=>e.createBindGroup({layout:k.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:z}},{binding:4,resource:{buffer:b}}]})),ce=[e.createBindGroup({layout:T.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n[0]}},{binding:1,resource:{buffer:t[0]}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}},{binding:4,resource:{buffer:p}},{binding:5,resource:{buffer:b}},{binding:6,resource:{buffer:n[1]}},{binding:7,resource:{buffer:t[1]}}]}),e.createBindGroup({layout:T.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n[1]}},{binding:1,resource:{buffer:t[1]}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}},{binding:4,resource:{buffer:p}},{binding:5,resource:{buffer:b}},{binding:6,resource:{buffer:n[0]}},{binding:7,resource:{buffer:t[0]}}]})],_=new ve(e);_.updateBindGroup(n[0]);const ue=new Pe(f,{radius:48,target:[0,0,0]});let B=null;const A=new ArrayBuffer(G),o=new Float32Array(A),P=new Uint32Array(A);let N=performance.now(),L=60,h=0,F=0;window.addEventListener("resize",()=>{R()}),R(),requestAnimationFrame(W)}catch(e){console.error(e),we(e.message||"Failed to start WebGPU demo")}}Se();

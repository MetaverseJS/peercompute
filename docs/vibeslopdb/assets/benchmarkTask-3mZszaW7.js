import{p as Pe,r as Ee}from"./computeWorker-DIEncv_E.js";const ne="peercompute.capabilities.benchmark-task.v1",A=8*1024*
1024,_e=256*1024,Ce=64*1024;function ve(){const e=globalThis.GPUBufferUsage;return{MAP_READ:e?.MAP_READ??1,COPY_SRC:e?.COPY_SRC??
4,COPY_DST:e?.COPY_DST??8,STORAGE:e?.STORAGE??128,QUERY_RESOLVE:e?.QUERY_RESOLVE??512}}function Re(){return globalThis.GPUMapMode?.
READ??1}let O=null;function x(){return typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.
now()}function ue(e){const o=[];let r=e>>>0;do{let s=r&127;r>>>=7,r!==0&&(s|=128),o.push(s)}while(r!==0);return o}function U(e){
const o=new ArrayBuffer(4);return new DataView(o).setFloat32(0,e,!0),Array.from(new Uint8Array(o))}function v(e,o){return[
e,...ue(o.length),...o]}function We(){const e=v(1,[1,96,1,127,1,125]),o=v(3,[1,0]),r=Array.from(new TextEncoder().encode(
"bench")),s=v(7,[1,r.length,...r,0,0]),i=f=>[32,2,32,3,148,67,...U(f),146,33,2],a=[2,1,127,2,125,67,...U(1),33,2,67,...U(
1.000001),33,3,2,64,3,64,32,1,32,0,78,13,1,...i(125e-6),...i(-124e-6),...i(123e-6),...i(-122e-6),32,1,65,1,106,33,1,12,0,
11,11,32,2,11],u=v(10,[1,...ue(a.length),...a]);return new Uint8Array([0,97,115,109,1,0,0,0,...e,...o,...s,...u])}function ae(e,o){
const r=e.length;let s=1;for(let i=0;i<o;i+=1)for(let a=0;a<r;a+=4){const u=e[a],f=e[a+1],p=e[a+2],g=e[a+3],l=u*1.0001+f*
.9997,h=p*1.0003-g*.9999,m=Math.sqrt(l*l+h*h+1e-6);e[a]=l/m,e[a+1]=h/m,s+=m*1e-5}return s}function ie({workSize:e=16384,
targetMs:o=20,maxMs:r=150,signal:s=null}={}){s?.throwIfAborted();const i=Math.max(1024,Math.min(262144,Math.floor(e/4)*4)),
a=new Float32Array(i);for(let d=0;d<i;d+=1)a[d]=(d%97+1)*.013;ae(a,2),s?.throwIfAborted();const u=i/4*12;let f=0,p=0;const g=x();
let l=4;for(;;){s?.throwIfAborted(),p+=ae(a,l),f+=l;const d=x()-g;if(d>=o||d>=r)break;d<o*.25&&(l=Math.min(64,l*2))}const h=Math.
max(.05,x()-g),m=f*u,t=Number((m/(h/1e3)/1e6).toFixed(2));return{ok:!0,ops:m,passes:f,durationMs:Number(h.toFixed(3)),mopsPerSec:t,
checksum:Number(p.toFixed(6))}}async function Ie({targetMs:e=20,maxMs:o=150,signal:r=null}={}){r?.throwIfAborted();const s=Pe(
globalThis);if(!s.supported)return{ok:!1,supported:!1,simdSupported:!1,reason:"WebAssembly unavailable"};try{O||(O=await WebAssembly.
compile(We())),r?.throwIfAborted();const a=(await WebAssembly.instantiate(O,{})).exports.bench;a(5e4),r?.throwIfAborted();
const u=8;let f=0,p=25e4,g=0;const l=x();for(;;){r?.throwIfAborted(),g+=a(p),f+=p;const d=x()-l;if(d>=e||d>=o)break;d<e*
.25&&(p=Math.min(4e6,p*2))}const h=Math.max(.05,x()-l),m=f*u,t=Number((m/(h/1e3)/1e6).toFixed(2));return{ok:!0,supported:!0,
simdSupported:s.simd,ops:m,iterations:f,durationMs:Number(h.toFixed(3)),mopsPerSec:t,checksum:Number(g.toFixed(6))}}catch(i){
return{ok:!1,supported:s.supported,simdSupported:s.simd,reason:String(i?.message??i).slice(0,200)}}}function Fe(e){if(!e.
length)return 0;const o=[...e].sort((s,i)=>s-i),r=Math.floor(o.length/2);return o.length%2===0?(o[r-1]+o[r])/2:o[r]}async function ce(e,o,r){
const s=e.createShaderModule({label:r,code:o});if(typeof s.getCompilationInfo=="function"){const a=(await s.getCompilationInfo()).
messages.filter(u=>u.type==="error");if(a.length>0)throw new Error(`WGSL compilation failed (${r}): ${a.map(u=>u.message).
join("; ")}`)}return s}async function Te({scope:e=globalThis,allowFallback:o=!1,bufferBytes:r=A,computeThreads:s=65536,computePasses:i=4,
bandwidthPasses:a=4,readbackPasses:u=3,timeoutMs:f=5e3,signal:p=null}={}){p?.throwIfAborted();let g=null;const l=[];let h=!1;
const m=t=>(t&&l.push(t),t);try{g=await Ee({scope:e,allowFallback:o,optionalFeatures:["timestamp-query","shader-f16"],promoteLimits:!0,
timeoutMs:f,label:"peercompute-capability-benchmark"}),p?.throwIfAborted();const{device:t,hasTimestampQuery:d,hasShaderF16:me,
limits:R,adapterInfo:pe,isFallbackAdapter:q}=g;typeof t.pushErrorScope=="function"&&(t.pushErrorScope("validation"),h=!0);
const B=d&&typeof t.createQuerySet=="function",z=Math.min(R.maxBufferSize||A,R.maxStorageBufferBindingSize||A),M=64,Y=R.
maxComputeWorkgroupsPerDimension||65535,W=Math.min(Math.max(M,Math.floor(s/M)*M),Y*M,Math.floor(z/16)),L=Math.max(1,Math.
floor(W/M)),Q=W*16,fe=await ce(t,`
      @group(0) @binding(0) var<storage, read_write> outBuf: array<vec4<f32>>;
      @compute @workgroup_size(${M})
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        let idx = gid.x;
        if (idx >= arrayLength(&outBuf)) { return; }
        var a = vec4<f32>(0.901, 0.899, 0.902, 0.898) + vec4<f32>(f32(idx & 255u) * 0.0001);
        var b = vec4<f32>(0.9993, 1.0007, 0.9991, 1.0009);
        var c = vec4<f32>(0.9505, 0.9496, 0.9503, 0.9498);
        var d = vec4<f32>(1.0002, 0.9998, 1.0004, 0.9996);
        let k = vec4<f32>(0.7501, 0.7499, 0.7502, 0.7498);
        let bias = vec4<f32>(0.125, 0.126, 0.124, 0.1255);
        for (var i = 0u; i < 64u; i = i + 1u) {
          a = fma(a, k, fma(b, vec4<f32>(0.125), bias));
          b = fma(b, k, fma(c, vec4<f32>(0.125), bias));
          c = fma(c, k, fma(d, vec4<f32>(0.125), bias));
          d = fma(d, k, fma(a, vec4<f32>(0.125), bias));
        }
        outBuf[idx] = a + b + c + d;
      }
    `,"peercompute-bench-compute"),I=await t.createComputePipelineAsync({layout:"auto",compute:{module:fe,entryPoint:"ma\
in"}}),w=ve(),K=Re(),V=m(t.createBuffer({size:Q,usage:w.STORAGE|w.COPY_SRC})),H=t.createBindGroup({layout:I.getBindGroupLayout(
0),entries:[{binding:0,resource:{buffer:V}}]}),de=Math.min(Math.max(_e,r),A,Math.floor(z/4)),le=Math.max(256,Math.min(Math.
floor(de/16),Y*M)),$=Math.floor(le/M)*M,S=$*16,j=Math.max(1,Math.floor($/M)),he=await ce(t,`
      @group(0) @binding(0) var<storage, read> srcBuf: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> dstBuf: array<vec4<f32>>;
      @compute @workgroup_size(${M})
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        let idx = gid.x;
        if (idx >= arrayLength(&srcBuf)) { return; }
        dstBuf[idx] = srcBuf[idx] * 1.0001 + vec4<f32>(0.25, 0.5, 0.75, 1.0);
      }
    `,"peercompute-bench-bandwidth"),F=await t.createComputePipelineAsync({layout:"auto",compute:{module:he,entryPoint:"\
main"}}),J=m(t.createBuffer({size:S,usage:w.STORAGE|w.COPY_DST})),X=m(t.createBuffer({size:S,usage:w.STORAGE|w.COPY_SRC})),
T=new Float32Array(1024);for(let n=0;n<T.length;n+=1)T[n]=(n+1)*.01;t.queue.writeBuffer(J,0,T);const Z=t.createBindGroup(
{layout:F.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:J}},{binding:1,resource:{buffer:X}}]});let P=null,G=null,
k=null;B&&(P=m(t.createQuerySet({type:"timestamp",count:4})),G=m(t.createBuffer({size:32,usage:w.QUERY_RESOLVE|w.COPY_SRC})),
k=m(t.createBuffer({size:32,usage:w.COPY_DST|w.MAP_READ})));{const n=t.createCommandEncoder(),b=n.beginComputePass();b.setPipeline(
I),b.setBindGroup(0,H),b.dispatchWorkgroups(L),b.end();const c=n.beginComputePass();c.setPipeline(F),c.setBindGroup(0,Z),
c.dispatchWorkgroups(j),c.end(),t.queue.submit([n.finish()]),await t.queue.onSubmittedWorkDone()}p?.throwIfAborted();const ee=Math.
max(1,Math.min(32,Math.floor(i))),te=Math.max(1,Math.min(32,Math.floor(a)));let E=0;const be=x();{const n=t.createCommandEncoder(),
b=B?{timestampWrites:{querySet:P,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}:void 0,c=n.beginComputePass(b);c.setPipeline(
I),c.setBindGroup(0,H);for(let y=0;y<ee;y+=1)c.dispatchWorkgroups(L);c.end(),t.queue.submit([n.finish()]),await t.queue.
onSubmittedWorkDone()}const xe=Math.max(.05,x()-be);p?.throwIfAborted();let _=0;const ge=x();{const n=t.createCommandEncoder(),
b=B?{timestampWrites:{querySet:P,beginningOfPassWriteIndex:2,endOfPassWriteIndex:3}}:void 0,c=n.beginComputePass(b);c.setPipeline(
F),c.setBindGroup(0,Z);for(let y=0;y<te;y+=1)c.dispatchWorkgroups(j);c.end(),B&&(n.resolveQuerySet(P,0,4,G,0),n.copyBufferToBuffer(
G,0,k,0,32)),t.queue.submit([n.finish()]),await t.queue.onSubmittedWorkDone()}const we=Math.max(.05,x()-ge);p?.throwIfAborted();
let D="queue-done";if(B)try{await k.mapAsync(K);const n=new BigInt64Array(k.getMappedRange().slice(0));k.unmap();const b=Number(
n[1]-n[0]),c=Number(n[3]-n[2]);Number.isFinite(b)&&b>0&&Number.isFinite(c)&&c>0&&(E=b/1e6,_=c/1e6,D="timestamp-query")}catch{}
D!=="timestamp-query"&&(E=xe,_=we);const N=Math.min(Ce,Q,S),C=m(t.createBuffer({size:N,usage:w.COPY_DST|w.MAP_READ})),oe=[];
let re=!1;const Me=Math.max(1,Math.min(8,Math.floor(u)));for(let n=0;n<Me;n+=1){p?.throwIfAborted();const b=x(),c=t.createCommandEncoder();
c.copyBufferToBuffer(n===0?V:X,0,C,0,N),t.queue.submit([c.finish()]),await C.mapAsync(K);const y=new Float32Array(C.getMappedRange(
0,16).slice(0));C.unmap(),oe.push(Math.max(.01,x()-b)),n===0&&(re=y.length===4&&y.every(se=>Number.isFinite(se)&&se!==0))}
if(h&&typeof t.popErrorScope=="function"){const n=await t.popErrorScope();if(h=!1,n)throw new Error(`WebGPU validation e\
rror during benchmark: ${n.message}`)}if(!re)throw new Error("WebGPU benchmark readback returned invalid or zero values");
const ye=W*4096*ee,Be=Number((ye/(E/1e3*1e9)).toFixed(2)),Se=S*2*te,ke=Number((Se/(_/1e3*1e9)).toFixed(2)),Ae=Number(Fe(
oe).toFixed(3));return{ok:!0,status:q?"fallback":"hardware",timingMethod:D,adapter:pe,isFallbackAdapter:q,hasTimestampQuery:d,
hasShaderF16:me,computeGflopsProxy:Be,memoryBandwidthGBps:ke,readbackLatencyMs:Ae,computeMs:Number(E.toFixed(3)),bandwidthMs:Number(
_.toFixed(3)),bandwidthBufferBytes:S,readbackBytes:N,verified:!0}}catch(t){return{ok:!1,status:t?.code==="ERR_GPU_FALLBA\
CK_REJECTED"?"fallback-only":"unavailable",code:t?.code||"ERR_GPU_BENCHMARK_FAILED",reason:String(t?.message??t).slice(0,
240)}}finally{h&&typeof g?.device?.popErrorScope=="function"&&await g.device.popErrorScope().catch(()=>{});for(const t of l)
try{t?.destroy?.()}catch{}g?.destroy?.()}}async function De(e={},o={}){const r=o?.signal??null,s=String(e?.mode||"all").
trim().toLowerCase(),i=x();if(s==="cpu-shard"){const f=ie({workSize:e.workSize,targetMs:e.targetMs??20,maxMs:e.maxMs??120,
signal:r});return{schema:ne,mode:s,workerId:o?.workerId??null,cpu:f}}const a=Array.isArray(e?.suites)?e.suites:s==="all"?
["cpu","wasm","gpu"]:[s],u={schema:ne,mode:s,workerId:o?.workerId??null};return a.includes("cpu")&&(o?.emitProgress?.({stage:"\
cpu",fraction:.1}),u.cpu=ie({workSize:e.cpuWorkSize,targetMs:e.cpuTargetMs??20,maxMs:e.cpuMaxMs??120,signal:r})),a.includes(
"wasm")&&(o?.emitProgress?.({stage:"wasm",fraction:.4}),u.wasm=await Ie({targetMs:e.wasmTargetMs??20,maxMs:e.wasmMaxMs??
120,signal:r})),a.includes("gpu")&&(o?.emitProgress?.({stage:"gpu",fraction:.7}),u.gpu=await Te({allowFallback:e.allowFallback===
!0,bufferBytes:e.gpuBufferBytes??A,computeThreads:e.gpuComputeThreads??65536,computePasses:e.gpuComputePasses??4,bandwidthPasses:e.
gpuBandwidthPasses??4,readbackPasses:e.gpuReadbackPasses??3,timeoutMs:e.gpuTimeoutMs??5e3,signal:r})),u.durationMs=Number(
Math.max(0,x()-i).toFixed(3)),o?.emitProgress?.({stage:"complete",fraction:1}),u}export{ne as CAPABILITY_BENCHMARK_TASK_SCHEMA,We as buildWasmBenchmarkBytes,De as default,De as runCapabilityBenchmarkTask,
ie as runCpuMicrobenchmark,Te as runGpuMicrobenchmark,Ie as runWasmMicrobenchmark};

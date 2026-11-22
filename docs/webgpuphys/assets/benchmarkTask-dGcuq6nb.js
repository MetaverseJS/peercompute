import{p as ve,r as ge}from"./computeWorker-wMIB0MwB.js";const ue="peercompute.capabilities.benchmark-task.v1",E=8*1024*
1024,Re=256*1024,We=64*1024;function Ie(){const e=globalThis.GPUBufferUsage;return{MAP_READ:(e==null?void 0:e.MAP_READ)??
1,COPY_SRC:(e==null?void 0:e.COPY_SRC)??4,COPY_DST:(e==null?void 0:e.COPY_DST)??8,STORAGE:(e==null?void 0:e.STORAGE)??128,
QUERY_RESOLVE:(e==null?void 0:e.QUERY_RESOLVE)??512}}function Fe(){var e;return((e=globalThis.GPUMapMode)==null?void 0:e.
READ)??1}let U=null;function M(){return typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.
now()}function me(e){const t=[];let o=e>>>0;do{let s=o&127;o>>>=7,o!==0&&(s|=128),t.push(s)}while(o!==0);return t}function q(e){
const t=new ArrayBuffer(4);return new DataView(t).setFloat32(0,e,!0),Array.from(new Uint8Array(t))}function R(e,t){return[
e,...me(t.length),...t]}function Te(){const e=R(1,[1,96,1,127,1,125]),t=R(3,[1,0]),o=Array.from(new TextEncoder().encode(
"bench")),s=R(7,[1,o.length,...o,0,0]),u=l=>[32,2,32,3,148,67,...q(l),146,33,2],i=[2,1,127,2,125,67,...q(1),33,2,67,...q(
1.000001),33,3,2,64,3,64,32,1,32,0,78,13,1,...u(125e-6),...u(-124e-6),...u(123e-6),...u(-122e-6),32,1,65,1,106,33,1,12,0,
11,11,32,2,11],f=R(10,[1,...me(i.length),...i]);return new Uint8Array([0,97,115,109,1,0,0,0,...e,...t,...s,...f])}function ce(e,t){
const o=e.length;let s=1;for(let u=0;u<t;u+=1)for(let i=0;i<o;i+=4){const f=e[i],l=e[i+1],a=e[i+2],c=e[i+3],m=f*1.0001+l*
.9997,h=a*1.0003-c*.9999,d=Math.sqrt(m*m+h*h+1e-6);e[i]=m/d,e[i+1]=h/d,s+=d*1e-5}return s}function pe({workSize:e=16384,
targetMs:t=20,maxMs:o=150,signal:s=null}={}){s==null||s.throwIfAborted();const u=Math.max(1024,Math.min(262144,Math.floor(
e/4)*4)),i=new Float32Array(u);for(let b=0;b<u;b+=1)i[b]=(b%97+1)*.013;ce(i,2),s==null||s.throwIfAborted();const f=u/4*12;
let l=0,a=0;const c=M();let m=4;for(;;){s==null||s.throwIfAborted(),a+=ce(i,m),l+=m;const b=M()-c;if(b>=t||b>=o)break;b<
t*.25&&(m=Math.min(64,m*2))}const h=Math.max(.05,M()-c),d=l*f,S=Number((d/(h/1e3)/1e6).toFixed(2));return{ok:!0,ops:d,passes:l,
durationMs:Number(h.toFixed(3)),mopsPerSec:S,checksum:Number(a.toFixed(6))}}async function Ge({targetMs:e=20,maxMs:t=150,
signal:o=null}={}){o==null||o.throwIfAborted();const s=ve(globalThis);if(!s.supported)return{ok:!1,supported:!1,simdSupported:!1,
reason:"WebAssembly unavailable"};try{U||(U=await WebAssembly.compile(Te())),o==null||o.throwIfAborted();const i=(await WebAssembly.
instantiate(U,{})).exports.bench;i(5e4),o==null||o.throwIfAborted();const f=8;let l=0,a=25e4,c=0;const m=M();for(;;){o==
null||o.throwIfAborted(),c+=i(a),l+=a;const b=M()-m;if(b>=e||b>=t)break;b<e*.25&&(a=Math.min(4e6,a*2))}const h=Math.max(
.05,M()-m),d=l*f,S=Number((d/(h/1e3)/1e6).toFixed(2));return{ok:!0,supported:!0,simdSupported:s.simd,ops:d,iterations:l,
durationMs:Number(h.toFixed(3)),mopsPerSec:S,checksum:Number(c.toFixed(6))}}catch(u){return{ok:!1,supported:s.supported,
simdSupported:s.simd,reason:String((u==null?void 0:u.message)??u).slice(0,200)}}}function De(e){if(!e.length)return 0;const t=[
...e].sort((s,u)=>s-u),o=Math.floor(t.length/2);return t.length%2===0?(t[o-1]+t[o])/2:t[o]}async function fe(e,t,o){const s=e.
createShaderModule({label:o,code:t});if(typeof s.getCompilationInfo=="function"){const i=(await s.getCompilationInfo()).
messages.filter(f=>f.type==="error");if(i.length>0)throw new Error(`WGSL compilation failed (${o}): ${i.map(f=>f.message).
join("; ")}`)}return s}async function Ne({scope:e=globalThis,allowFallback:t=!1,bufferBytes:o=E,computeThreads:s=65536,computePasses:u=4,
bandwidthPasses:i=4,readbackPasses:f=3,timeoutMs:l=5e3,signal:a=null}={}){var S,b,z;a==null||a.throwIfAborted();let c=null;
const m=[];let h=!1;const d=r=>(r&&m.push(r),r);try{c=await ge({scope:e,allowFallback:t,optionalFeatures:["timestamp-que\
ry","shader-f16"],promoteLimits:!0,timeoutMs:l,label:"peercompute-capability-benchmark"}),a==null||a.throwIfAborted();const{
device:r,hasTimestampQuery:Y,hasShaderF16:de,limits:W,adapterInfo:le,isFallbackAdapter:L}=c;typeof r.pushErrorScope=="fu\
nction"&&(r.pushErrorScope("validation"),h=!0);const k=Y&&typeof r.createQuerySet=="function",Q=Math.min(W.maxBufferSize||
E,W.maxStorageBufferBindingSize||E),x=64,K=W.maxComputeWorkgroupsPerDimension||65535,I=Math.min(Math.max(x,Math.floor(s/
x)*x),K*x,Math.floor(Q/16)),V=Math.max(1,Math.floor(I/x)),H=I*16,he=await fe(r,`
      @group(0) @binding(0) var<storage, read_write> outBuf: array<vec4<f32>>;
      @compute @workgroup_size(${x})
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
    `,"peercompute-bench-compute"),F=await r.createComputePipelineAsync({layout:"auto",compute:{module:he,entryPoint:"ma\
in"}}),y=Ie(),$=Fe(),j=d(r.createBuffer({size:H,usage:y.STORAGE|y.COPY_SRC})),J=r.createBindGroup({layout:F.getBindGroupLayout(
0),entries:[{binding:0,resource:{buffer:j}}]}),be=Math.min(Math.max(Re,o),E,Math.floor(Q/4)),we=Math.max(256,Math.min(Math.
floor(be/16),K*x)),X=Math.floor(we/x)*x,A=X*16,Z=Math.max(1,Math.floor(X/x)),Me=await fe(r,`
      @group(0) @binding(0) var<storage, read> srcBuf: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> dstBuf: array<vec4<f32>>;
      @compute @workgroup_size(${x})
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        let idx = gid.x;
        if (idx >= arrayLength(&srcBuf)) { return; }
        dstBuf[idx] = srcBuf[idx] * 1.0001 + vec4<f32>(0.25, 0.5, 0.75, 1.0);
      }
    `,"peercompute-bench-bandwidth"),T=await r.createComputePipelineAsync({layout:"auto",compute:{module:Me,entryPoint:"\
main"}}),ee=d(r.createBuffer({size:A,usage:y.STORAGE|y.COPY_DST})),te=d(r.createBuffer({size:A,usage:y.STORAGE|y.COPY_SRC})),
G=new Float32Array(1024);for(let n=0;n<G.length;n+=1)G[n]=(n+1)*.01;r.queue.writeBuffer(ee,0,G);const re=r.createBindGroup(
{layout:T.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:ee}},{binding:1,resource:{buffer:te}}]});let _=null,
D=null,P=null;k&&(_=d(r.createQuerySet({type:"timestamp",count:4})),D=d(r.createBuffer({size:32,usage:y.QUERY_RESOLVE|y.
COPY_SRC})),P=d(r.createBuffer({size:32,usage:y.COPY_DST|y.MAP_READ})));{const n=r.createCommandEncoder(),w=n.beginComputePass();
w.setPipeline(F),w.setBindGroup(0,J),w.dispatchWorkgroups(V),w.end();const p=n.beginComputePass();p.setPipeline(T),p.setBindGroup(
0,re),p.dispatchWorkgroups(Z),p.end(),r.queue.submit([n.finish()]),await r.queue.onSubmittedWorkDone()}a==null||a.throwIfAborted();
const oe=Math.max(1,Math.min(32,Math.floor(u))),se=Math.max(1,Math.min(32,Math.floor(i)));let C=0;const ye=M();{const n=r.
createCommandEncoder(),w=k?{timestampWrites:{querySet:_,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}:void 0,p=n.beginComputePass(
w);p.setPipeline(F),p.setBindGroup(0,J);for(let B=0;B<oe;B+=1)p.dispatchWorkgroups(V);p.end(),r.queue.submit([n.finish()]),
await r.queue.onSubmittedWorkDone()}const xe=Math.max(.05,M()-ye);a==null||a.throwIfAborted();let v=0;const Be=M();{const n=r.
createCommandEncoder(),w=k?{timestampWrites:{querySet:_,beginningOfPassWriteIndex:2,endOfPassWriteIndex:3}}:void 0,p=n.beginComputePass(
w);p.setPipeline(T),p.setBindGroup(0,re);for(let B=0;B<se;B+=1)p.dispatchWorkgroups(Z);p.end(),k&&(n.resolveQuerySet(_,0,
4,D,0),n.copyBufferToBuffer(D,0,P,0,32)),r.queue.submit([n.finish()]),await r.queue.onSubmittedWorkDone()}const Se=Math.
max(.05,M()-Be);a==null||a.throwIfAborted();let N="queue-done";if(k)try{await P.mapAsync($);const n=new BigInt64Array(P.
getMappedRange().slice(0));P.unmap();const w=Number(n[1]-n[0]),p=Number(n[3]-n[2]);Number.isFinite(w)&&w>0&&Number.isFinite(
p)&&p>0&&(C=w/1e6,v=p/1e6,N="timestamp-query")}catch{}N!=="timestamp-query"&&(C=xe,v=Se);const O=Math.min(We,H,A),g=d(r.
createBuffer({size:O,usage:y.COPY_DST|y.MAP_READ})),ae=[];let ne=!1;const ke=Math.max(1,Math.min(8,Math.floor(f)));for(let n=0;n<
ke;n+=1){a==null||a.throwIfAborted();const w=M(),p=r.createCommandEncoder();p.copyBufferToBuffer(n===0?j:te,0,g,0,O),r.queue.
submit([p.finish()]),await g.mapAsync($);const B=new Float32Array(g.getMappedRange(0,16).slice(0));g.unmap(),ae.push(Math.
max(.01,M()-w)),n===0&&(ne=B.length===4&&B.every(ie=>Number.isFinite(ie)&&ie!==0))}if(h&&typeof r.popErrorScope=="functi\
on"){const n=await r.popErrorScope();if(h=!1,n)throw new Error(`WebGPU validation error during benchmark: ${n.message}`)}
if(!ne)throw new Error("WebGPU benchmark readback returned invalid or zero values");const Ae=I*4096*oe,Pe=Number((Ae/(C/
1e3*1e9)).toFixed(2)),Ee=A*2*se,_e=Number((Ee/(v/1e3*1e9)).toFixed(2)),Ce=Number(De(ae).toFixed(3));return{ok:!0,status:L?
"fallback":"hardware",timingMethod:N,adapter:le,isFallbackAdapter:L,hasTimestampQuery:Y,hasShaderF16:de,computeGflopsProxy:Pe,
memoryBandwidthGBps:_e,readbackLatencyMs:Ce,computeMs:Number(C.toFixed(3)),bandwidthMs:Number(v.toFixed(3)),bandwidthBufferBytes:A,
readbackBytes:O,verified:!0}}catch(r){return{ok:!1,status:(r==null?void 0:r.code)==="ERR_GPU_FALLBACK_REJECTED"?"fallbac\
k-only":"unavailable",code:(r==null?void 0:r.code)||"ERR_GPU_BENCHMARK_FAILED",reason:String((r==null?void 0:r.message)??
r).slice(0,240)}}finally{h&&typeof((S=c==null?void 0:c.device)==null?void 0:S.popErrorScope)=="function"&&await c.device.
popErrorScope().catch(()=>{});for(const r of m)try{(b=r==null?void 0:r.destroy)==null||b.call(r)}catch{}(z=c==null?void 0:
c.destroy)==null||z.call(c)}}async function Ue(e={},t={}){var l,a,c,m;const o=(t==null?void 0:t.signal)??null,s=String((e==
null?void 0:e.mode)||"all").trim().toLowerCase(),u=M();if(s==="cpu-shard"){const h=pe({workSize:e.workSize,targetMs:e.targetMs??
20,maxMs:e.maxMs??120,signal:o});return{schema:ue,mode:s,workerId:(t==null?void 0:t.workerId)??null,cpu:h}}const i=Array.
isArray(e==null?void 0:e.suites)?e.suites:s==="all"?["cpu","wasm","gpu"]:[s],f={schema:ue,mode:s,workerId:(t==null?void 0:
t.workerId)??null};return i.includes("cpu")&&((l=t==null?void 0:t.emitProgress)==null||l.call(t,{stage:"cpu",fraction:.1}),
f.cpu=pe({workSize:e.cpuWorkSize,targetMs:e.cpuTargetMs??20,maxMs:e.cpuMaxMs??120,signal:o})),i.includes("wasm")&&((a=t==
null?void 0:t.emitProgress)==null||a.call(t,{stage:"wasm",fraction:.4}),f.wasm=await Ge({targetMs:e.wasmTargetMs??20,maxMs:e.
wasmMaxMs??120,signal:o})),i.includes("gpu")&&((c=t==null?void 0:t.emitProgress)==null||c.call(t,{stage:"gpu",fraction:.7}),
f.gpu=await Ne({allowFallback:e.allowFallback===!0,bufferBytes:e.gpuBufferBytes??E,computeThreads:e.gpuComputeThreads??65536,
computePasses:e.gpuComputePasses??4,bandwidthPasses:e.gpuBandwidthPasses??4,readbackPasses:e.gpuReadbackPasses??3,timeoutMs:e.
gpuTimeoutMs??5e3,signal:o})),f.durationMs=Number(Math.max(0,M()-u).toFixed(3)),(m=t==null?void 0:t.emitProgress)==null||
m.call(t,{stage:"complete",fraction:1}),f}export{ue as CAPABILITY_BENCHMARK_TASK_SCHEMA,Te as buildWasmBenchmarkBytes,Ue as default,Ue as runCapabilityBenchmarkTask,
pe as runCpuMicrobenchmark,Ne as runGpuMicrobenchmark,Ge as runWasmMicrobenchmark};

import{ao as l,aq as c,al as h}from"./main-BDHli8sO.js";import"./index-BbhYZWtV.js";const p="1.31.1",O=512*512*4,u=1024**
3;function m(t){const n=l(t),i=n.model,r=Object.values(c).find(e=>e.model.repository===i?.repository&&e.model.revision===
i?.revision&&e.model.pipeline===i?.pipeline);if(!r||i.runtime!=="onnx-diffusion"||i.runtimeVersion!==p||i.task!=="text-t\
o-image"||i.architecture!==r.model.architecture||JSON.stringify(i.modalities)!=='["text"]'||JSON.stringify(i.outputModalities)!==
'["image"]'||n.files.length!==r.files.length)throw new Error("Diffusion package is not in the trusted runtime catalog");
for(const e of["format","dtype","steps","width","height","padTokenId","weightQuantization","requiredFeatures"]){const o=(f,a)=>f&&
a&&typeof f=="object"&&typeof a=="object"?Object.keys(f).length===Object.keys(a).length&&Object.keys(f).every(d=>o(f[d],
a[d])):f===a;if(!o(i[e],r.model[e]))throw new Error(`Diffusion ${e} differs from the trusted profile`)}for(const e of r.
files){const o=n.files.find(f=>f.path===e.path);if(!o||o.size!==e.size||o.sha256!==e.sha256)throw new Error("Diffusion f\
iles differ from pinned catalog digests")}const s=n.files.reduce((e,o)=>e+o.size,0);if(!Number.isSafeInteger(s)||s>3*u)throw new Error(
"Diffusion package exceeds its admitted byte budget");return{manifest:n,trusted:r,totalBytes:s,resourcePolicy:{maxModelBytes:3*
u,minimumCpuBytes:8*u,minimumGpuBytes:8*u}}}function w(t,n){const{trusted:i}=m(n);if(t.image)throw new Error("This diffu\
sion runtime accepts text only");const r=h(t);if(r.length!==1||r[0].role!=="user")throw new Error("Diffusion requires ex\
actly one user prompt");const s=r[0].content.trim();if(!s||new TextEncoder().encode(s).length>4096)throw new Error("Diff\
usion needs a text prompt of at most 4096 bytes");const e=t.seed??crypto.getRandomValues(new Uint32Array(1))[0];if(!Number.
isSafeInteger(e)||e<0||e>4294967295)throw new Error("Diffusion seed must be uint32");const o=t.steps??i.steps;if(o!==i.steps||
(t.width??512)!==512||(t.height??512)!==512)throw new Error(`This diffusion profile requires 512×512 and ${i.steps} ste\
ps`);return{task:"text-to-image",prompt:s,messages:[{role:"user",content:s}],seed:e,steps:o,width:512,height:512}}function g(t,n=globalThis.
location?.href){if(!t||Object.keys(t).some(s=>!["mjs","wasm"].includes(s)))throw new Error("Unexpected diffusion runtime\
 assets");const i=new URL(n),r={};for(const s of["mjs","wasm"]){if(typeof t[s]!="string")throw new Error("Trusted diffus\
ion runtime assets are required");const e=new URL(t[s],i);if(e.origin!==i.origin||e.username||e.password||e.hash||!["htt\
p:","https:"].includes(e.protocol)||!new RegExp(`(?:^|/)ort-wasm-simd-threaded\\.jsep(?:-[A-Za-z0-9_-]+)?\\.${s}$`).test(
e.pathname))throw new Error("Diffusion assets must be same-origin ORT JSEP files");r[s]=e.href}return r}const x=Object.freeze(
{id:"onnx-diffusion",moduleUrl:"peercompute:diffusion-inference",validateManifest:m,validateRuntimeAssets:g,normalizeGenerationInput:w,
validateRuntimeOptions(t){if(!t||typeof t!="object"||Array.isArray(t)||Object.keys(t).length)throw new Error("Diffusion \
runtime options are fixed by the trusted model profile");return{}},terminateOnUnload:!0});export{O as DIFFUSION_IMAGE_BYTES,p as DIFFUSION_RUNTIME_VERSION,x as diffusionRuntimeDefinition,w as normalizeDiffusionInput,
m as validateDiffusionManifest,g as validateDiffusionRuntimeAssets};

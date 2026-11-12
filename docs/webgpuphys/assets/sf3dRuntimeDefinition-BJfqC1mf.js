import{f as l,S as c,c as u}from"./peercomputeDevice-CsBDVadn.js";import{validateMeshRuntimeAssets as d}from"./runtimeDefinition-B68o1qe9.js";
import"./device-B4S7QtIr.js";const S="0.1.60",a=1024**3,n=Object.freeze({maxModelBytes:3*a,minimumCpuBytes:8*a,minimumGpuBytes:8*
a}),m=(e,t)=>e===t||e&&t&&typeof e=="object"&&typeof t=="object"&&Array.isArray(e)===Array.isArray(t)&&Object.keys(e).length===
Object.keys(t).length&&Object.keys(e).every(r=>m(e[r],t[r]));function f(e){const t=l(e),r=Object.values(c).find(i=>m(i.model,
t.model));if(!r||t.files.length!==r.files.length||r.files.some(i=>!t.files.some(s=>s.path===i.path&&s.size===i.size&&s.sha256===
i.sha256)))throw new Error("SF3D model package differs from its qualified runtime catalog");const o=t.files.reduce((i,s)=>i+
s.size,0);if(!Number.isSafeInteger(o)||o>n.maxModelBytes)throw new Error("SF3D model package exceeds its byte budget");return{
manifest:t,trusted:r,totalBytes:o,resourcePolicy:n}}function g(e,t){var o,i;if(f(t),e.task!=null&&e.task!=="image-to-3d")
throw new Error("SF3D generates 3D objects from images");if(e.audio!=null)throw new Error("SF3D does not accept audio");
const r=u(e.image);if(!r)throw new Error("SF3D requires an image of one object");if((o=e.prompt)!=null&&o.trim()||(i=e.messages)!=
null&&i.length)throw new Error("SF3D requires image input; generate an image from text first");return{task:"image-to-3d",
image:r}}const w=Object.freeze({id:"webgpu-sf3d",moduleUrl:"peercompute:sf3d-inference",validateManifest:f,validateRuntimeAssets:d,
normalizeGenerationInput:g,validateRuntimeOptions(e={}){if(!e||typeof e!="object"||Array.isArray(e)||Object.keys(e).length)
throw new Error("SF3D runtime options are fixed by the qualified profile");return{}},retainArtifactBridge:!0,terminateOnUnload:!0,
terminateOnGenerationAbort:!0});export{n as SF3D_RESOURCE_POLICY,S as SF3D_RUNTIME_VERSION,g as normalizeSf3dInput,w as sf3dRuntimeDefinition,f as validateSf3dManifest};

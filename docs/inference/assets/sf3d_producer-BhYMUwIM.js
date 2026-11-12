import{c as Ft,a as q,b as je,d as cr,r as Fe,i as Wr}from"./gpu-CbAOvyLy.js";import{i as jr,l as Lr}from"./weights-C6-13gnr.js";
import{c as Ha}from"./weights-C6-13gnr.js";import{a as lr,g as Ur,d as Hr,b as Xr,c as Vr,e as Yr}from"./shader_ops-CyJowQ9K.js";
import"./sf3dModelTask-Ui3CGyyy.js";import"./modelTask-_NIxBXmo.js";import"./index-6TlIxpa6.js";import"./GgufArtifactReader-B9TIlnMA.js";
import"./main-Cvsn7onI.js";const ct=2**22,Lt=t=>Math.max(0,Math.min(255,t));function Kr(t){return t=Math.abs(t),t<1?(1.5*
t-2.5)*t*t+1:t<2?((-.5*t+2.5)*t-4)*t+2:0}function Zr(t,e){const n=t/e,o=Math.max(1,n),r=2*o;return Array.from({length:e},
(s,i)=>{const a=(i+.5)*n,c=Math.max(0,Math.trunc(a-r+.5)),l=Math.min(t,Math.trunc(a+r+.5)),d=Array.from({length:l-c},(f,p)=>Kr(
(c+p-a+.5)/o)),u=d.reduce((f,p)=>f+p,0);return{start:c,weights:d.map(f=>Math.trunc(f/u*ct+(f<0?-.5:.5)))}})}function Qr(t,e,n){
if(e===n)return t;for(let i=0;i<t.length;i+=4)for(let a=0;a<3;a++)t[i+a]=Math.round(t[i+a]*t[i+3]/255);const o=Zr(e,n),r=new Uint8Array(
n*e*4),s=new Uint8Array(n*n*4);for(let i=0;i<e;i++)for(let a=0;a<n;a++){const{start:c,weights:l}=o[a];for(let d=0;d<4;d++){
let u=ct/2;for(let f=0;f<l.length;f++)u+=t[(i*e+c+f)*4+d]*l[f];r[(i*n+a)*4+d]=Lt(Math.floor(u/ct))}}for(let i=0;i<n;i++){
const{start:a,weights:c}=o[i];for(let l=0;l<n;l++)for(let d=0;d<4;d++){let u=ct/2;for(let f=0;f<c.length;f++)u+=r[((a+f)*
n+l)*4+d]*c[f];s[(i*n+l)*4+d]=Lt(Math.floor(u/ct))}}for(let i=0;i<s.length;i+=4){const a=s[i+3];if(a&&a<255)for(let c=0;c<
3;c++)s[i+c]=Lt(Math.floor(s[i+c]*255/a))}return s}function Jr(t,e,n,o=512){if(![e,n,o].every(p=>Number.isSafeInteger(p)&&
p>0)||!(t instanceof Uint8Array||t instanceof Uint8ClampedArray)||t.length!==e*n*4)throw new TypeError("Expected positiv\
e dimensions and matching RGBA bytes");let r=e,s=n,i=-1,a=-1;for(let p=0;p<n;p++)for(let g=0;g<e;g++)t[(p*e+g)*4+3]>0&&(r=
Math.min(r,g),i=Math.max(i,g),s=Math.min(s,p),a=Math.max(a,p));if(i<0)throw new Error("Empty foreground mask");const c=Math.
max(i-r,a-s)/.85,l=Math.trunc(c);if(l<1)throw new Error("Foreground crop is empty");const d=Math.trunc((r+i-c)/2)||0,u=Math.
trunc((s+a-c)/2)||0,f=new Uint8Array(l*l*4);for(let p=Math.max(0,u);p<Math.min(n,u+l);p++){const g=Math.max(0,d),m=Math.
min(e,d+l);f.set(t.subarray((p*e+g)*4,(p*e+m)*4),((p-u)*l+g-d)*4)}return{data:Qr(f,l,o),width:o,height:o,crop:[d,u,d+l,u+
l]}}const eo=Object.freeze({condImageSize:512,bgColor:Object.freeze([.5,.5,.5]),imageMean:Object.freeze([.485,.456,.406]),
imageStd:Object.freeze([.229,.224,.225])});function Pn(t,e=3){if(t===0)return 1;if(Math.abs(t)>=e)return 0;const n=Math.
PI*t;return e*Math.sin(n)*Math.sin(n/e)/(n*n)}function to(t,e,n,o,r){const i=new Float32Array(r*o*4),a=new Float32Array(
o*n*4),c=e/o;for(let d=0;d<n;d++)for(let u=0;u<o;u++){const f=(u+.5)*c-.5,p=Math.ceil(f-3),g=Math.floor(f+3);let m=0,h=0,
w=0,b=0,y=0;for(let x=p;x<=g;x++){const k=Math.min(Math.max(x,0),e-1),R=Pn(f-x,3),E=(d*e+k)*4;m+=t[E]*R,h+=t[E+1]*R,w+=t[E+
2]*R,b+=t[E+3]*R,y+=R}const _=(d*o+u)*4;a[_]=m/y,a[_+1]=h/y,a[_+2]=w/y,a[_+3]=b/y}const l=n/r;for(let d=0;d<r;d++){const u=(d+
.5)*l-.5,f=Math.ceil(u-3),p=Math.floor(u+3);for(let g=0;g<o;g++){let m=0,h=0,w=0,b=0,y=0;for(let x=f;x<=p;x++){const k=Math.
min(Math.max(x,0),n-1),R=Pn(u-x,3),E=(k*o+g)*4;m+=a[E]*R,h+=a[E+1]*R,w+=a[E+2]*R,b+=a[E+3]*R,y+=R}const _=(d*o+g)*4;i[_]=
m/y,i[_+1]=h/y,i[_+2]=w/y,i[_+3]=b/y}}return i}function no(t,e,n,o,r,s,i){const a=to(t,e,n,o,o),c=new Float32Array(3*o*o);
for(let l=0;l<o;l++)for(let d=0;d<o;d++){const u=(l*o+d)*4,f=a[u],p=a[u+1],g=a[u+2],m=Math.max(0,Math.min(1,a[u+3])),h=r[0]*
(1-m)+f*m,w=r[1]*(1-m)+p*m,b=r[2]*(1-m)+g*m;c[0*o*o+l*o+d]=(h-s[0])/i[0],c[1*o*o+l*o+d]=(w-s[1])/i[1],c[2*o*o+l*o+d]=(b-
s[2])/i[2]}return c}const Cn=13;function Qe(t,e,n){if(!(t?.[e]instanceof ArrayBuffer))throw new Error(`${n} reply must c\
arry ${e} ArrayBuffer`);return t[e]}function Pt(t,e){for(let n=0;n<t.length;n++)if(!Number.isFinite(t[n]))throw new Error(
`${e} value non-finite at ${n}`)}function ro(t,e){const n=new Float32Array(Qe(t,"chwBuffer","preprocess"));if(n.length!==
e)throw new Error(`CHW length ${n.length} != expected ${e}`);return Pt(n,"preprocess CHW"),n}function oo(t){const e=t?.newNumVertices,
n=t?.newNumFaces;if(!Number.isSafeInteger(e)||e<=0)throw new Error(`uv-unwrap newNumVertices invalid: ${e}`);if(!Number.
isSafeInteger(n)||n<=0)throw new Error(`uv-unwrap newNumFaces invalid: ${n}`);const o=Qe(t,"faceAssignment","uv-unwrap");
if(o.byteLength%4!==0)throw new Error(`uv-unwrap faceAssignment byte length ${o.byteLength} is not a multiple of 4 (expe\
cted Int32 atlas slots)`);const r={uvs:new Float32Array(Qe(t,"uvs","uv-unwrap")),newVertices:new Float32Array(Qe(t,"newV\
ertices","uv-unwrap")),newNormals:new Float32Array(Qe(t,"newNormals","uv-unwrap")),newFaces:new Uint32Array(Qe(t,"newFac\
es","uv-unwrap")),faceAssignment:new Int32Array(o),newNumVertices:e,newNumFaces:n},s=(i,a,c)=>{if(i.length!==a)throw new Error(
`uv-unwrap ${c} length ${i.length} != ${a}`)};s(r.newVertices,e*3,"newVertices"),s(r.newNormals,e*3,"newNormals"),s(r.uvs,
e*2,"uvs"),s(r.newFaces,n*3,"newFaces"),s(r.faceAssignment,n,"faceAssignment"),Pt(r.newVertices,"uv-unwrap newVertices"),
Pt(r.newNormals,"uv-unwrap newNormals"),Pt(r.uvs,"uv-unwrap uvs");for(let i=0;i<r.newFaces.length;i++)if(r.newFaces[i]>=
e)throw new Error(`uv-unwrap face index ${r.newFaces[i]} out of range (${e} vertices) at ${i}`);for(let i=0;i<r.faceAssignment.
length;i++){const a=r.faceAssignment[i];if(a<0||a>=Cn)throw new Error(`uv-unwrap faceAssignment value ${a} out of range \
(${Cn} atlas slots) at ${i}`)}return r}function so(t,e,n,o,r,s,i){const a=Uint8Array.from(t,d=>Math.round(d*255)),c=Jr(a,
e,n,o),l=Float32Array.from(c.data,d=>d/255);return{chw:no(l,o,o,o,r,s,i),rgba:c.data}}function io(t,e){const n=ro(t,3*e*
e);if(!(t.rgbaBuffer instanceof ArrayBuffer)||t.rgbaBuffer.byteLength!==4*e*e)throw new Error("condition image reply mus\
t carry matching RGBA bytes");return{chw:n,rgba:new Uint8Array(t.rgbaBuffer)}}function He(t,e,n,{timeoutMs:o=3e4,onResult:r}){
const s=e.id;if(!s)throw new Error("callWorker: message.id is required");return new Promise((i,a)=>{let c=!1;const l=()=>{
t.removeEventListener("message",u),t.removeEventListener("error",f),t.removeEventListener("messageerror",p),clearTimeout(
g)},d=(m,h)=>{c||(c=!0,l(),m(h))},u=m=>{if(m.data?.id===s)if(m.data.ok)try{d(i,r(m.data))}catch(h){d(a,new Error(`worker\
 output invalid: ${h?.message||h}`))}else d(a,new Error(`worker failed: ${m.data?.error||"unknown error"}`))},f=m=>d(a,new Error(
`worker error: ${m?.message||"top-level worker exception"}`)),p=()=>d(a,new Error("worker messageerror: reply could not \
be deserialized"));t.addEventListener("message",u),t.addEventListener("error",f),t.addEventListener("messageerror",p);const g=setTimeout(
()=>d(a,new Error(`worker timed out after ${o}ms`)),o);try{t.postMessage(e,n)}catch(m){d(a,new Error(`worker postMessage\
 failed: ${m?.message||m}`))}})}async function Le(t,e,n){if(t?.signal?.throwIfAborted(),typeof n!="function")throw new TypeError(
"foreground scope work must be a function");return typeof t?.withForeground!="function"?await n():await t.withForeground(
e,n)}const ao=`// DINOv2 patch embedding compute shader.
// Takes an image [3, H, W] and produces (N+1, D) token embeddings:
//   N patches (tokenH x tokenW grid of 14x14 patches) + 1 CLS token.
//   Each patch is flattened (14*14*3 = 588) then linearly projected to D.
//   Position embeddings are interpolated from the pretrained (1+370, D) table.
//
// DINOv2 differences from DeiT:
//   - 14x14 patches (not 16x16)
//   - Variable spatial dimensions (not fixed 224x224)
//   - Position embedding interpolation for arbitrary token counts

struct Params {
  imgH: u32,      // image height (tokenH * 14)
  imgW: u32,      // image width (tokenW * 14)
  patchSize: u32,  // 14
  tokenH: u32,
  tokenW: u32,
  channels: u32,   // 3
  D: u32,          // model dim (1024)
  numTokens: u32,  // tokenH * tokenW + 1 (including CLS)
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> image: array<f32>;       // [3, imgH, imgW] CHW
@group(0) @binding(2) var<storage, read> projWeight: array<f32>;  // [D, 3, 14, 14] = [D, 588]
@group(0) @binding(3) var<storage, read> projBias: array<f32>;    // [D]
@group(0) @binding(4) var<storage, read> clsToken: array<f32>;    // [1, 1, D]
@group(0) @binding(5) var<storage, read> posEmbed: array<f32>;    // [1, 1+numPatchesPretrained, D]
@group(0) @binding(6) var<storage, read_write> output: array<f32>; // [numTokens, D]

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;
  let totalElements = params.numTokens * params.D;

  if (idx >= totalElements) { return; }

  let token = idx / params.D;
  let d = idx % params.D;

  var val = 0.0;

  if (token == 0u) {
    // CLS token
    val = clsToken[d];
  } else {
    // Patch embedding
    let patchIdx = token - 1u;
    let patchRow = patchIdx / params.tokenW;
    let patchCol = patchIdx % params.tokenW;
    let startY = patchRow * params.patchSize;
    let startX = patchCol * params.patchSize;

    // Conv2d-style patch projection: weight is [D, 3, 14, 14]
    val = projBias[d];
    for (var c = 0u; c < params.channels; c++) {
      for (var py = 0u; py < params.patchSize; py++) {
        for (var px = 0u; px < params.patchSize; px++) {
          let imgY = startY + py;
          let imgX = startX + px;
          // Image is CHW
          let pixelVal = image[c * params.imgH * params.imgW + imgY * params.imgW + imgX];
          // Weight is [D, C, pH, pW] → index [d, c, py, px]
          let wIdx = d * params.channels * params.patchSize * params.patchSize
                   + c * params.patchSize * params.patchSize
                   + py * params.patchSize + px;
          val += pixelVal * projWeight[wIdx];
        }
      }
    }
  }

  // Add position embedding (CLS pos is at index 0, patch pos follow)
  // For now: use position embedding directly if token count matches,
  // otherwise skip (interpolation would need a separate pass)
  val += posEmbed[idx];

  output[idx] = val;
}
`,_n=`// Layer normalization for ViT backbone.
// Each workgroup normalizes one row (token).
// Thread 0 computes mean/variance serially, then all threads normalize in parallel.
// Adapted from webgpu-samples visionTransformer with 2D dispatch support.

struct Params {
  N: u32,       // number of rows (tokens)
  D: u32,       // dimension per row
  eps: f32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> gamma: array<f32>;
@group(0) @binding(3) var<storage, read> beta: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

var<workgroup> shared_mean: f32;
var<workgroup> shared_inv_std: f32;

@compute @workgroup_size(256)
fn main(
  @builtin(workgroup_id) wg_id: vec3u,
  @builtin(local_invocation_id) local_id: vec3u,
) {
  let row = wg_id.x;
  let tid = local_id.x;
  let D = params.D;
  let base = row * D;

  if (row >= params.N) { return; }

  // Thread 0 computes mean and variance (two-pass for numerical stability).
  // The one-pass formula E[x²]-E[x]² suffers catastrophic cancellation when
  // values are large (±20 common in ViT), losing significant precision.
  if (tid == 0u) {
    var sum = 0.0;
    for (var i = 0u; i < D; i++) {
      sum += input[base + i];
    }
    let mean = sum / f32(D);
    var var_sum = 0.0;
    for (var i = 0u; i < D; i++) {
      let diff = input[base + i] - mean;
      var_sum += diff * diff;
    }
    let variance = var_sum / f32(D);
    shared_mean = mean;
    shared_inv_std = 1.0 / sqrt(variance + params.eps);
  }
  workgroupBarrier();

  let mean = shared_mean;
  let inv_std = shared_inv_std;

  // All threads normalize and apply affine transform in parallel
  for (var i = tid; i < D; i += 256u) {
    let val = input[base + i];
    output[base + i] = (val - mean) * inv_std * gamma[i] + beta[i];
  }
}
`,Ut=`// Multi-head self-attention compute shaders for DINOv2 ViT.
// Adapted from webgpu-samples visionTransformer with 2D dispatch.
//
// Three entry points:
//   computeScores: Q·K^T scaled dot product → scores
//   softmax: row-wise numerically stable softmax
//   applyAttn: scores @ V → output

struct ScoreParams {
  N: u32,        // number of tokens
  D: u32,        // model dimension
  numHeads: u32,
  headDim: u32,
  scale: f32,
  numWorkgroupsX: u32,
}

struct SoftmaxParams {
  N: u32,
  numHeads: u32,
  numWorkgroupsX: u32,
}

struct ApplyParams {
  N: u32,
  D: u32,
  numHeads: u32,
  headDim: u32,
  numWorkgroupsX: u32,
}

// --- Attention scores ---
@group(0) @binding(0) var<uniform> scoreParams: ScoreParams;
@group(0) @binding(1) var<storage, read> qBuf: array<f32>;
@group(0) @binding(2) var<storage, read> kBuf: array<f32>;
@group(0) @binding(3) var<storage, read_write> scoreBuf: array<f32>;

@compute @workgroup_size(256)
fn computeScores(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * scoreParams.numWorkgroupsX;
  let idx = linearWG * 256u + lid.x;

  let N = scoreParams.N;
  let numHeads = scoreParams.numHeads;
  let headDim = scoreParams.headDim;
  let D = scoreParams.D;
  let totalScores = numHeads * N * N;

  if (idx >= totalScores) { return; }

  let head = idx / (N * N);
  let remainder = idx % (N * N);
  let qi = remainder / N;
  let ki = remainder % N;
  let headOffset = head * headDim;

  // headDim is 64, so 4-way split gives 16-element chains.
  var d0 = 0.0;
  var d1 = 0.0;
  var d2 = 0.0;
  var d3 = 0.0;
  let qBase = qi * D + headOffset;
  let kBase = ki * D + headOffset;
  let hd4 = (headDim / 4u) * 4u;
  for (var d = 0u; d < hd4; d += 4u) {
    d0 += qBuf[qBase + d]      * kBuf[kBase + d];
    d1 += qBuf[qBase + d + 1u] * kBuf[kBase + d + 1u];
    d2 += qBuf[qBase + d + 2u] * kBuf[kBase + d + 2u];
    d3 += qBuf[qBase + d + 3u] * kBuf[kBase + d + 3u];
  }
  for (var d = hd4; d < headDim; d++) {
    d0 += qBuf[qBase + d] * kBuf[kBase + d];
  }

  scoreBuf[idx] = ((d0 + d1) + (d2 + d3)) * scoreParams.scale;
}

// --- Softmax ---
// Uses separate bind group with SoftmaxParams
@group(0) @binding(0) var<uniform> softmaxParams: SoftmaxParams;
@group(0) @binding(1) var<storage, read_write> softmaxScoreBuf: array<f32>;

@compute @workgroup_size(256)
fn softmax(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * softmaxParams.numWorkgroupsX;
  let idx = linearWG * 256u + lid.x;

  let N = softmaxParams.N;
  let totalRows = softmaxParams.numHeads * N;

  if (idx >= totalRows) { return; }

  let base = idx * N;

  // Find max
  var m = -1e30;
  for (var i = 0u; i < N; i++) {
    m = max(m, softmaxScoreBuf[base + i]);
  }

  // Exp and sum
  var s = 0.0;
  for (var i = 0u; i < N; i++) {
    let e = exp(softmaxScoreBuf[base + i] - m);
    softmaxScoreBuf[base + i] = e;
    s += e;
  }

  // Normalize
  for (var i = 0u; i < N; i++) {
    softmaxScoreBuf[base + i] = softmaxScoreBuf[base + i] / s;
  }
}

// --- Apply attention ---
@group(0) @binding(0) var<uniform> applyParams: ApplyParams;
@group(0) @binding(1) var<storage, read> applyScoreBuf: array<f32>;
@group(0) @binding(2) var<storage, read> vBuf: array<f32>;
@group(0) @binding(3) var<storage, read_write> attnOutput: array<f32>;

@compute @workgroup_size(256)
fn applyAttn(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * applyParams.numWorkgroupsX;
  let idx = linearWG * 256u + lid.x;

  let N = applyParams.N;
  let D = applyParams.D;
  let numHeads = applyParams.numHeads;
  let headDim = applyParams.headDim;

  if (idx >= N * D) { return; }

  let row = idx / D;
  let col = idx % D;
  let head = col / headDim;
  let d = col % headDim;

  // N is ~1370 tokens, 4-way split gives ~342-element chains.
  var v0 = 0.0;
  var v1 = 0.0;
  var v2 = 0.0;
  var v3 = 0.0;
  let scoreBase = head * N * N + row * N;
  let vCol = head * headDim + d;
  let n4 = (N / 4u) * 4u;
  for (var j = 0u; j < n4; j += 4u) {
    v0 += applyScoreBuf[scoreBase + j]      * vBuf[(j)      * D + vCol];
    v1 += applyScoreBuf[scoreBase + j + 1u] * vBuf[(j + 1u) * D + vCol];
    v2 += applyScoreBuf[scoreBase + j + 2u] * vBuf[(j + 2u) * D + vCol];
    v3 += applyScoreBuf[scoreBase + j + 3u] * vBuf[(j + 3u) * D + vCol];
  }
  for (var j = n4; j < N; j++) {
    v0 += applyScoreBuf[scoreBase + j] * vBuf[j * D + vCol];
  }
  attnOutput[idx] = (v0 + v1) + (v2 + v3);
}
`,qt=`// Linear projection: output = input @ weight + bias
// Adapted from webgpu-samples visionTransformer mlp.wgsl with 2D dispatch.
//
// Weight layout controlled by params.transposed:
//   transposed=1 (default): weight is [inDim, outDim], access weight[k * outDim + col]
//   transposed=0: weight is [outDim, inDim] (PyTorch native), access weight[col * inDim + k]

struct Params {
  numRows: u32,
  inDim: u32,
  outDim: u32,
  numWorkgroupsX: u32,
  transposed: u32,  // 1=transposed [inDim, outDim], 0=native [outDim, inDim]
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= params.numRows * params.outDim) { return; }

  let row = idx / params.outDim;
  let col = idx % params.outDim;

  // 4-way split accumulation for better fp32 precision on large dot products.
  var s0 = 0.0;
  var s1 = 0.0;
  var s2 = 0.0;
  var s3 = 0.0;
  let inBase = row * params.inDim;
  let len4 = (params.inDim / 4u) * 4u;

  if (params.transposed == 1u) {
    // Transposed layout: weight[k, col] = weight[k * outDim + col]
    let wBase = col;
    let stride = params.outDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * weight[(k)      * stride + wBase];
      s1 += input[inBase + k + 1u] * weight[(k + 1u) * stride + wBase];
      s2 += input[inBase + k + 2u] * weight[(k + 2u) * stride + wBase];
      s3 += input[inBase + k + 3u] * weight[(k + 3u) * stride + wBase];
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * weight[k * stride + wBase];
    }
  } else {
    // Native layout: weight[col, k] = weight[col * inDim + k]
    let wBase = col * params.inDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * weight[wBase + k];
      s1 += input[inBase + k + 1u] * weight[wBase + k + 1u];
      s2 += input[inBase + k + 2u] * weight[wBase + k + 2u];
      s3 += input[inBase + k + 3u] * weight[wBase + k + 3u];
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * weight[wBase + k];
    }
  }
  output[idx] = (s0 + s1) + (s2 + s3) + bias[col];
}
`,Mn=`// Linear projection + GELU activation: output = GELU(input @ weight + bias)
// Used for MLP fc1 in DINOv2 ViT blocks.
// NaN guard: Apple Metal may produce NaN from finite accumulations; sanitized via bitcast.

struct Params {
  numRows: u32,
  inDim: u32,
  outDim: u32,
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

fn gelu(x: f32) -> f32 {
  // GELU via erf approximation (Abramowitz & Stegun 7.1.26, max error ~1.5e-7).
  // Avoids tanh() which has precision issues on Apple Metal fast-math.
  if (x > 10.0) { return x; }
  if (x < -10.0) { return 0.0; }
  let a = x * 0.7071067811865476; // x / sqrt(2)
  let s = sign(a);
  let t_abs = abs(a);
  let p = 0.3275911;
  let t = 1.0 / (1.0 + p * t_abs);
  let t2 = t * t;
  let t3 = t2 * t;
  let t4 = t3 * t;
  let t5 = t4 * t;
  let erf_abs = 1.0 - (0.254829592 * t - 0.284496736 * t2 + 1.421413741 * t3 - 1.453152027 * t4 + 1.061405429 * t5) * ex\
p(-t_abs * t_abs);
  let erf_val = s * erf_abs;
  return 0.5 * x * (1.0 + erf_val);
}

@compute @workgroup_size(WG_SIZE)
fn main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= params.numRows * params.outDim) { return; }

  let row = idx / params.outDim;
  let col = idx % params.outDim;

  // Split accumulation (see linear.wgsl for rationale).
  var s0 = 0.0;
  var s1 = 0.0;
  var s2 = 0.0;
  var s3 = 0.0;
  let inBase = row * params.inDim;
  let wBase = col;
  let stride = params.outDim;
  let len4 = (params.inDim / 4u) * 4u;
  for (var k = 0u; k < len4; k += 4u) {
    s0 += input[inBase + k]      * weight[(k)      * stride + wBase];
    s1 += input[inBase + k + 1u] * weight[(k + 1u) * stride + wBase];
    s2 += input[inBase + k + 2u] * weight[(k + 2u) * stride + wBase];
    s3 += input[inBase + k + 3u] * weight[(k + 3u) * stride + wBase];
  }
  for (var k = len4; k < params.inDim; k++) {
    s0 += input[inBase + k] * weight[k * stride + wBase];
  }
  output[idx] = gelu((s0 + s1) + (s2 + s3) + bias[col]);
}
`,uo=`// LayerScale: element-wise multiply by learned gamma, then add residual.
// DINOv2 applies this after attention and after FFN:
//   x = x + gamma * sublayer(norm(x))
//
// This shader does: output[i] = residual[i] + gamma[i % D] * input[i]

struct Params {
  count: u32,   // total elements (N * D)
  D: u32,       // model dim (for gamma indexing)
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;      // sublayer output
@group(0) @binding(2) var<storage, read> gamma: array<f32>;       // [D] learned scale
@group(0) @binding(3) var<storage, read> residual: array<f32>;    // pre-sublayer x
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= params.count) { return; }

  let d = idx % params.D;
  output[idx] = residual[idx] + gamma[d] * input[idx];
}
`,Ht=65535,$e=256;function Oe(t){return t<=Ht?[t,1]:[Ht,Math.ceil(t/Ht)]}function Ge(t,e){return Math.ceil(t/e)}function co(t,e){
const n=t.createBuffer({size:Math.max(e.byteLength,16),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});
return new Uint8Array(n.getMappedRange()).set(new Uint8Array(e.buffer||e)),n.unmap(),n}const ue={dim:1024,numHeads:16,headDim:64,
numLayers:24,patchSize:14,mlpHiddenDim:4096,scale:1/Math.sqrt(64),eps:1e-6};class lo{constructor(e){this.device=e,this.pipelines=
{},this._uniformCache=new Map}init(){const e=this.device,n=(o,r)=>e.createComputePipeline({layout:"auto",compute:{module:e.
createShaderModule({code:o}),entryPoint:r}});this.pipelines.patchEmbed=n(ao,"main"),this.pipelines.layerNorm=n(_n,"main"),
this.pipelines.attnScores=n(Ut,"computeScores"),this.pipelines.attnSoftmax=n(Ut,"softmax"),this.pipelines.attnApply=n(Ut,
"applyAttn"),this.pipelines.linear=n(qt,"main"),this.pipelines.linearGelu=n(Mn,"main"),this.pipelines.layerScale=n(uo,"m\
ain"),this.pipelines.activation=n(lr,"activation_main"),this.pipelines.add=n(`
      @group(0) @binding(0) var<storage, read_write> dst: array<f32>;
      @group(0) @binding(1) var<storage, read> src: array<f32>;
      struct P { count: u32, numWgX: u32 }
      @group(0) @binding(2) var<uniform> p: P;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.count) { return; }
        dst[idx] = dst[idx] + src[idx];
      }
    `,"main"),this.pipelines.modulatedLN=n(`
      struct P { N: u32, D: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> input: array<f32>;
      @group(0) @binding(2) var<storage, read> gamma: array<f32>;
      @group(0) @binding(3) var<storage, read> beta: array<f32>;
      @group(0) @binding(4) var<storage, read> modulation: array<f32>;
      @group(0) @binding(5) var<storage, read_write> output: array<f32>;

      @compute @workgroup_size(1)
      fn main(@builtin(global_invocation_id) gid: vec3u) {
        let row = gid.x;
        if (row >= p.N) { return; }
        let D = p.D;
        let base = row * D;
        var sum: f32 = 0.0;
        for (var d: u32 = 0; d < D; d++) { sum += input[base + d]; }
        let mean = sum / f32(D);
        var varSum: f32 = 0.0;
        for (var d: u32 = 0; d < D; d++) { let diff = input[base + d] - mean; varSum += diff * diff; }
        let invStd = 1.0 / sqrt(varSum / f32(D) + 1e-6);
        for (var d: u32 = 0; d < D; d++) {
          let normalized = (input[base + d] - mean) * invStd;
          let ln_out = gamma[d] * normalized + beta[d];
          let scale = modulation[d];
          let shift = modulation[D + d];
          output[base + d] = (1.0 + scale) * ln_out + shift;
        }
      }
    `,"main"),this.pipelines.linearGelu=n(Mn,"main")}_cachedUniform(e){const n=new Uint8Array(e.buffer||e);let o=0;for(let i=0;i<
n.length;i++)o=o*31+n[i]|0;const r=`u_${n.length}_${o}`;if(this._uniformCache.has(r))return this._uniformCache.get(r);const s=co(
this.device,e);return this._uniformCache.set(r,s),s}encode(e,n,o,r){const s=this._setupEncode(e,n,o,r);for(let i=0;i<ue.
numLayers;i++)this._encodeBlock(e,i,s,r);return this._finalizeEncode(e,s,r)}async encodeCooperative({imageBuf:e,cameraEmbedBuf:n,
weights:o,numBlocks:r,chunkBlocks:s,driver:i,withChunkWeights:a=null,retireIntermediateBuffers:c=!1}){if(this._capturedWorkOwner)
throw Error("DINO work-buffer cleanup is quarantined");if(r!==ue.numLayers)throw new Error(`encodeCooperative numBlocks ${r}\
 must equal VIT_CONFIG.numLayers ${ue.numLayers}`);if(a!==null&&typeof a!="function")throw TypeError("withChunkWeights m\
ust be a function");let l=null,d=null;const u=[];let f,p=!1;try{for(let g=0;g<r;g+=s){const m=Math.min(g+s,r),h=g===0,w=m===
r,b=y=>i(g,m,_=>{const x=()=>{h&&(l=this._setupEncode(_,e,n,y));for(let k=g;k<m;k++)this._encodeBlock(_,k,l,y);w&&(d=this.
_finalizeEncode(_,l,y))};c?Ft(x,{ownedAllocations:u}):x()});a?await a({blockStart:g,blockEnd:m,isFirst:h,isLast:w},b):await b(
o)}if(!d)throw new Error("encodeCooperative produced no result");return d}catch(g){throw p=!0,f=g,g}finally{if(c){this._capturedWorkOwner=
{buffers:new Set(u.map(g=>g.buffer)),keep:p?null:d?.tokensBuf};try{await this.retireCapturedWorkBuffers()}catch(g){throw this.
_capturedWorkOwner&&(this._capturedWorkOwner.keep=null),p?new AggregateError([f,g],"DINO failed and work-buffer cleanup \
is unresolved",{cause:f}):g}}}}async retireCapturedWorkBuffers(){const e=this._capturedWorkOwner;if(!e)return;await this.
device.queue.onSubmittedWorkDone();const n=[];for(const o of e.buffers)if(o!==e.keep)try{o.destroy(),e.buffers.delete(o);
for(const[r,s]of Object.entries(this._dinov2Diag??{}))s===o&&delete this._dinov2Diag[r]}catch(r){n.push(r)}if(n.length)throw new AggregateError(
n,"DINO work-buffer retirement failed");this._capturedWorkOwner=null}_setupEncode(e,n,o,r){const s=this.device,i=ue.dim,
a=ue.patchSize,c=512,l=Math.floor(c/a),d=Math.floor(c/a),f=l*d+1,p=f*i,g=q(s,p*4),m=q(s,p*4),h=q(s,p*4),w=q(s,p*4),b=q(s,
p*4),y=q(s,p*4),_=q(s,ue.numHeads*f*f*4),x=q(s,p*4),k=q(s,p*4),R=q(s,f*ue.mlpHiddenDim*4),E=q(s,p*4),M=q(s,2*i*4);this._dispatchPatchEmbed(
e,n,r,g,l,d);{this._dinov2Diag||(this._dinov2Diag={});const I=q(s,p*4);e.copyBufferToBuffer(g,0,I,0,p*4),this._dinov2Diag.
patchEmbed=I}const D=q(s,768*4);return this._dispatchSiLU(e,o,D,768),{D:i,N:f,T:p,tokenH:l,tokenW:d,tokenBufA:g,tokenBufB:m,
normBuf:h,qBuf:w,kBuf:b,vBuf:y,scoreBuf:_,attnOutBuf:x,projBuf:k,hiddenBuf:R,ffnOutBuf:E,modBuf:M,siluCameraEmbedBuf:D,currentTokens:g}}_encodeBlock(e,n,o,r){
const s=this.device,{D:i,N:a,T:c,tokenBufA:l,tokenBufB:d,normBuf:u,qBuf:f,kBuf:p,vBuf:g,scoreBuf:m,attnOutBuf:h,projBuf:w,
hiddenBuf:b,ffnOutBuf:y,modBuf:_,siluCameraEmbedBuf:x}=o,k=r.blocks[n];this._dispatchLinear(e,x,_,k.norm1Mod.weight,k.norm1Mod.
bias,1,768,2*i),this._dispatchModulatedLN(e,o.currentTokens,u,k.norm1,_,a),this._dispatchLinear(e,u,f,k.attn.q.weight,k.
attn.q.bias,a,i,i),this._dispatchLinear(e,u,p,k.attn.k.weight,k.attn.k.bias,a,i,i),this._dispatchLinear(e,u,g,k.attn.v.weight,
k.attn.v.bias,a,i,i),this._dispatchAttnScores(e,f,p,m,a),this._dispatchAttnSoftmax(e,m,a),this._dispatchAttnApply(e,m,g,
h,a),this._dispatchLinear(e,h,w,k.attn.proj.weight,k.attn.proj.bias,a,i,i);const R=o.currentTokens===l?d:l;this._dispatchLayerScaleResidual(
e,w,o.currentTokens,R,k.layerScale1,c,i),o.currentTokens=R,this._dispatchLinear(e,x,_,k.norm2Mod.weight,k.norm2Mod.bias,
1,768,2*i),this._dispatchModulatedLN(e,o.currentTokens,u,k.norm2,_,a),this._dispatchLinearGelu(e,u,b,k.mlp.fc1.weight,k.
mlp.fc1.bias,a,i,ue.mlpHiddenDim),this._dispatchLinear(e,b,y,k.mlp.fc2.weight,k.mlp.fc2.bias,a,ue.mlpHiddenDim,i);const E=o.
currentTokens===l?d:l;if(this._dispatchLayerScaleResidual(e,y,o.currentTokens,E,k.layerScale2,c,i),o.currentTokens=E,n<3||
n===23){this._dinov2Diag||(this._dinov2Diag={});const M=q(s,c*4);e.copyBufferToBuffer(o.currentTokens,0,M,0,c*4),this._dinov2Diag[`\
block${n}`]=M}}_finalizeEncode(e,n,o){const{N:r,normBuf:s,tokenH:i,tokenW:a}=n;return this._dispatchLayerNorm(e,n.currentTokens,
s,o.layernorm,r),{tokensBuf:s,N:r,tokenH:i,tokenW:a}}_dispatchPatchEmbed(e,n,o,r,s,i){const a=this.device,c=ue.dim,l=ue.
patchSize,d=s*i+1,u=Ge(d*c,$e),[f,p]=Oe(u),g=512,m=this._cachedUniform(new Uint32Array([g,g,l,s,i,3,c,d,f])),h=a.createBindGroup(
{layout:this.pipelines.patchEmbed.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:n}},
{binding:2,resource:{buffer:o.patchEmbed.weight}},{binding:3,resource:{buffer:o.patchEmbed.bias}},{binding:4,resource:{buffer:o.
clsToken}},{binding:5,resource:{buffer:o.posEmbed}},{binding:6,resource:{buffer:r}}]}),w=e.beginComputePass();w.setPipeline(
this.pipelines.patchEmbed),w.setBindGroup(0,h),w.dispatchWorkgroups(f,p),w.end()}_dispatchLinear(e,n,o,r,s,i,a,c){const l=this.
device,d=Ge(i*c,$e),[u,f]=Oe(d),p=this._cachedUniform(new Uint32Array([i,a,c,u,1])),g=l.createBindGroup({layout:this.pipelines.
linear.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:n}},{binding:2,resource:{
buffer:r}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:o}}]}),m=e.beginComputePass();m.setPipeline(this.
pipelines.linear),m.setBindGroup(0,g),m.dispatchWorkgroups(u,f),m.end()}_dispatchLayerNorm(e,n,o,r,s){const i=this.device,
a=ue.dim,c=new ArrayBuffer(16),l=new DataView(c);l.setUint32(0,s,!0),l.setUint32(4,a,!0),l.setFloat32(8,ue.eps,!0);const d=this.
_cachedUniform(new Uint8Array(c)),u=i.createBindGroup({layout:this.pipelines.layerNorm.getBindGroupLayout(0),entries:[{binding:0,
resource:{buffer:d}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:r.weight}},{binding:3,resource:{buffer:r.
bias}},{binding:4,resource:{buffer:o}}]}),f=e.beginComputePass();f.setPipeline(this.pipelines.layerNorm),f.setBindGroup(
0,u),f.dispatchWorkgroups(s),f.end()}_dispatchModulatedLN(e,n,o,r,s,i){const a=this.device,c=ue.dim,l=this._cachedUniform(
new Uint32Array([i,c,0])),d=a.createBindGroup({layout:this.pipelines.modulatedLN.getBindGroupLayout(0),entries:[{binding:0,
resource:{buffer:l}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:r.weight}},{binding:3,resource:{buffer:r.
bias}},{binding:4,resource:{buffer:s}},{binding:5,resource:{buffer:o}}]}),u=e.beginComputePass();u.setPipeline(this.pipelines.
modulatedLN),u.setBindGroup(0,d),u.dispatchWorkgroups(i),u.end()}_dispatchAttnScores(e,n,o,r,s){const i=this.device,{numHeads:a,
dim:c,headDim:l,scale:d}=ue,u=a*s*s,f=Ge(u,$e),[p,g]=Oe(f),m=new ArrayBuffer(24),h=new DataView(m);h.setUint32(0,s,!0),h.
setUint32(4,c,!0),h.setUint32(8,a,!0),h.setUint32(12,l,!0),h.setFloat32(16,d,!0),h.setUint32(20,p,!0);const w=this._cachedUniform(
new Uint8Array(m)),b=i.createBindGroup({layout:this.pipelines.attnScores.getBindGroupLayout(0),entries:[{binding:0,resource:{
buffer:w}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:r}}]}),y=e.beginComputePass();
y.setPipeline(this.pipelines.attnScores),y.setBindGroup(0,b),y.dispatchWorkgroups(p,g),y.end()}_dispatchAttnSoftmax(e,n,o){
const r=ue.numHeads*o,s=Ge(r,$e),[i,a]=Oe(s),c=this._cachedUniform(new Uint32Array([o,ue.numHeads,i])),l=this.device.createBindGroup(
{layout:this.pipelines.attnSoftmax.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n}}]}),
d=e.beginComputePass();d.setPipeline(this.pipelines.attnSoftmax),d.setBindGroup(0,l),d.dispatchWorkgroups(i,a),d.end()}_dispatchAttnApply(e,n,o,r,s){
const i=ue.dim,a=Ge(s*i,$e),[c,l]=Oe(a),d=this._cachedUniform(new Uint32Array([s,i,ue.numHeads,ue.headDim,c])),u=this.device.
createBindGroup({layout:this.pipelines.attnApply.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},{binding:1,
resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:r}}]}),f=e.beginComputePass();f.setPipeline(
this.pipelines.attnApply),f.setBindGroup(0,u),f.dispatchWorkgroups(c,l),f.end()}_dispatchLayerScaleResidual(e,n,o,r,s,i,a){
const c=Ge(i,$e),[l,d]=Oe(c),u=this._cachedUniform(new Uint32Array([i,a,l])),f=this.device.createBindGroup({layout:this.
pipelines.layerScale.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:n}},{binding:2,
resource:{buffer:s}},{binding:3,resource:{buffer:o}},{binding:4,resource:{buffer:r}}]}),p=e.beginComputePass();p.setPipeline(
this.pipelines.layerScale),p.setBindGroup(0,f),p.dispatchWorkgroups(l,d),p.end()}_dispatchLinearGelu(e,n,o,r,s,i,a,c){const l=Ge(
i*c,$e),[d,u]=Oe(l),f=this._cachedUniform(new Uint32Array([i,a,c,d,1])),p=this.device.createBindGroup({layout:this.pipelines.
linearGelu.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:n}},{binding:2,resource:{
buffer:r}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:o}}]}),g=e.beginComputePass();g.setPipeline(this.
pipelines.linearGelu),g.setBindGroup(0,p),g.dispatchWorkgroups(d,u),g.end()}_dispatchSiLU(e,n,o,r){const s=Ge(r,$e),[i,a]=Oe(
s),c=this._cachedUniform(new Uint32Array([r,1,i])),l=q(this.device,4),d=this.device.createBindGroup({layout:this.pipelines.
activation.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n}},{binding:2,resource:{
buffer:l}},{binding:3,resource:{buffer:o}}]}),u=e.beginComputePass();u.setPipeline(this.pipelines.activation),u.setBindGroup(
0,d),u.dispatchWorkgroups(i,a),u.end()}}function Dn({weightType:t,loadWeight:e,weightHelper:n,activationExpression:o,activationHelpers:r},s=!1){
return`
struct LinearDims {
  input_channels: u32,
  output_channels: u32,
  total_output: u32,
  _pad0: u32,
};

@group(0) @binding(0) var<storage, read> input_values: array<f32>;
@group(0) @binding(1) var<storage, read> weight: array<${t}>;
@group(0) @binding(2) var<storage, read> bias: array<f32>;
@group(0) @binding(3) var<storage, read_write> output_values: array<f32>;
@group(0) @binding(4) var<uniform> dims: LinearDims;${s?`
struct LinearRange {
  output_start: u32,
  output_count: u32,
};
@group(0) @binding(5) var<uniform> output_range: LinearRange;`:""}

${n}${r}

fn activate(value: f32) -> f32 {
  return ${o};
}

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3<u32>,
  @builtin(num_workgroups) dispatch_grid: vec3<u32>,
) {
  ${s?`let local_index = gid.x + gid.y * dispatch_grid.x * 64u;
  if (local_index >= output_range.output_count) { return; }
  let index = output_range.output_start + local_index;`:"let index = gid.x + gid.y * dispatch_grid.x * 64u;"}
  if (index >= dims.total_output) { return; }
  let output_channel = index % dims.output_channels;
  let token = index / dims.output_channels;
  let input_base = token * dims.input_channels;
  let weight_base = output_channel * dims.input_channels;
  var sum = bias[output_channel];
  for (var channel = 0u; channel < dims.input_channels; channel = channel + 4u) {
    sum = sum + input_values[input_base + channel] * ${e("weight_base + channel")};
    sum = sum + input_values[input_base + channel + 1u] * ${e("weight_base + channel + 1u")};
    sum = sum + input_values[input_base + channel + 2u] * ${e("weight_base + channel + 2u")};
    sum = sum + input_values[input_base + channel + 3u] * ${e("weight_base + channel + 3u")};
  }
  output_values[index] = activate(sum);
}
`}function fo({weightType:t,loadWeight:e,weightHelper:n,activationFunction:o,activate:r}){return`// Linear projection: o\
utput = input @ weight + bias
// Adapted from webgpu-samples visionTransformer mlp.wgsl with 2D dispatch.
//
// Weight layout controlled by params.transposed:
//   transposed=1 (default): weight is [inDim, outDim], access ${e("k * outDim + col")}
//   transposed=0: weight is [outDim, inDim] (PyTorch native), access ${e("col * inDim + k")}

struct Params {
  numRows: u32,
  inDim: u32,
  outDim: u32,
  numWorkgroupsX: u32,
  transposed: u32,  // 1=transposed [inDim, outDim], 0=native [outDim, inDim]
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<${t}>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

${n}${o}@compute @workgroup_size(WG_SIZE)
fn main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= params.numRows * params.outDim) { return; }

  let row = idx / params.outDim;
  let col = idx % params.outDim;

  // 4-way split accumulation for better fp32 precision on large dot products.
  var s0 = 0.0;
  var s1 = 0.0;
  var s2 = 0.0;
  var s3 = 0.0;
  let inBase = row * params.inDim;
  let len4 = (params.inDim / 4u) * 4u;

  if (params.transposed == 1u) {
    // Transposed layout: ${e("k, col")} = ${e("k * outDim + col")}
    let wBase = col;
    let stride = params.outDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * ${e("(k)      * stride + wBase")};
      s1 += input[inBase + k + 1u] * ${e("(k + 1u) * stride + wBase")};
      s2 += input[inBase + k + 2u] * ${e("(k + 2u) * stride + wBase")};
      s3 += input[inBase + k + 3u] * ${e("(k + 3u) * stride + wBase")};
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * ${e("k * stride + wBase")};
    }
  } else {
    // Native layout: ${e("col, k")} = ${e("col * inDim + k")}
    let wBase = col * params.inDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * ${e("wBase + k")};
      s1 += input[inBase + k + 1u] * ${e("wBase + k + 1u")};
      s2 += input[inBase + k + 2u] * ${e("wBase + k + 2u")};
      s3 += input[inBase + k + 3u] * ${e("wBase + k + 3u")};
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * ${e("wBase + k")};
    }
  }
  output[idx] = ${r("(s0 + s1) + (s2 + s3) + bias[col]")};
}
`}function po({weightType:t,loadWeight:e,weightHelper:n,activationFunction:o,activate:r}){return`// Row-range linear pro\
jection: output[row] = input[row] @ weight + bias.
// The accumulation order and weight layout match linear.wgsl exactly.

struct Params {
  totalRows: u32,
  inDim: u32,
  outDim: u32,
  rowStart: u32,
  rowCount: u32,
  numWorkgroupsX: u32,
  transposed: u32,
  _padding: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<${t}>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

${n}${o}@compute @workgroup_size(WG_SIZE)
fn main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let localIdx = linearWG * WG_SIZE + lid.x;
  if (localIdx >= params.rowCount * params.outDim) { return; }

  let localRow = localIdx / params.outDim;
  let col = localIdx % params.outDim;
  let row = params.rowStart + localRow;
  if (row >= params.totalRows) { return; }
  let idx = row * params.outDim + col;

  var s0 = 0.0;
  var s1 = 0.0;
  var s2 = 0.0;
  var s3 = 0.0;
  let inBase = row * params.inDim;
  let len4 = (params.inDim / 4u) * 4u;

  if (params.transposed == 1u) {
    let wBase = col;
    let stride = params.outDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * ${e("(k)      * stride + wBase")};
      s1 += input[inBase + k + 1u] * ${e("(k + 1u) * stride + wBase")};
      s2 += input[inBase + k + 2u] * ${e("(k + 2u) * stride + wBase")};
      s3 += input[inBase + k + 3u] * ${e("(k + 3u) * stride + wBase")};
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * ${e("k * stride + wBase")};
    }
  } else {
    let wBase = col * params.inDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * ${e("wBase + k")};
      s1 += input[inBase + k + 1u] * ${e("wBase + k + 1u")};
      s2 += input[inBase + k + 2u] * ${e("wBase + k + 2u")};
      s3 += input[inBase + k + 3u] * ${e("wBase + k + 3u")};
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * ${e("wBase + k")};
    }
  }
  output[idx] = ${r("(s0 + s1) + (s2 + s3) + bias[col]")};
}
`}const mo=`
fn load_weight(index: u32) -> f32 {
  let pair = unpack2x16float(weight[index / 2u]);
  return pair[index % 2u];
}

`;function go({variant:t,weightStorage:e="f32",activationExpression:n="value",activationHelpers:o=""}={}){const r={sequential4:Dn,
"sequential4-range":a=>Dn(a,!0),split4:fo,"split4-range":po};if(!Object.hasOwn(r,t))throw new RangeError("unsupported li\
near variant");if(!["f32","f16-packed-u32"].includes(e))throw new RangeError("unsupported weightStorage");if(typeof n!="\
string"||!n.trim())throw new TypeError("activationExpression must be nonempty WGSL");if(typeof o!="string")throw new TypeError(
"activationHelpers must be WGSL text");const s=e==="f16-packed-u32",i=n==="value"&&o==="";return r[t]({weightType:s?"u32":
"f32",loadWeight:a=>s?`load_weight(${a})`:`weight[${a}]`,weightHelper:s?mo:"",activationExpression:n,activationHelpers:o,
activationFunction:i?"":`${o}
fn activate(value: f32) -> f32 {
  return ${n};
}

`,activate:a=>i?a:`activate(${a})`})}const fn="kaminos.webgpu-route-receipt.v0";function Ye(t){return t==null?t:JSON.parse(
JSON.stringify(t))}function dr(t){return typeof t=="string"&&t.trim().length>0}function ho(t){return Number.isFinite(t)&&
t>=0}function le(t,e,n){dr(e)||t.push(`${n} must be a non-empty string`)}function Rn(t,e,n){(!Array.isArray(e)||e.length===
0)&&t.push(`${n} must be a non-empty array`)}function bo(t){const e=t.status||(t.fallbackReason?"fallback":"real");return{
schema:fn,requestedRouteId:t.requestedRouteId,effectiveRouteId:t.effectiveRouteId,status:e,fallbackReason:t.fallbackReason||
null,backend:Ye(t.backend),model:Ye(t.model),kernel:Ye(t.kernel),inputs:Ye(t.inputs||[]),outputs:Ye(t.outputs||[]),timings:Ye(
t.timings),createdAt:t.createdAt||new Date().toISOString()}}function wo(t){const e=[];return!t||typeof t!="object"?{ok:!1,
errors:["receipt must be an object"]}:(t.schema!==fn&&e.push(`schema must be ${fn}`),le(e,t.requestedRouteId,"requestedR\
outeId"),le(e,t.effectiveRouteId,"effectiveRouteId"),le(e,t.status,"status"),!t.backend||typeof t.backend!="object"?e.push(
"backend must be an object"):(t.backend.kind!=="webgpu-local"&&e.push("backend.kind must be webgpu-local"),le(e,t.backend.
runtime,"backend.runtime")),!t.model||typeof t.model!="object"?e.push("model must be an object"):(le(e,t.model.id,"model\
.id"),le(e,t.model.revision,"model.revision"),le(e,t.model.weightsHash,"model.weightsHash"),le(e,t.model.dtype,"model.dt\
ype")),!t.kernel||typeof t.kernel!="object"?e.push("kernel must be an object"):(le(e,t.kernel.kitVersion,"kernel.kitVers\
ion"),le(e,t.kernel.profile,"kernel.profile")),Rn(e,t.inputs,"inputs"),Array.isArray(t.inputs)&&t.inputs.forEach((n,o)=>{
le(e,n?.role,`inputs[${o}].role`),le(e,n?.artifactId,`inputs[${o}].artifactId`),le(e,n?.sha256,`inputs[${o}].sha256`)}),
Rn(e,t.outputs,"outputs"),Array.isArray(t.outputs)&&t.outputs.forEach((n,o)=>{le(e,n?.role,`outputs[${o}].role`),le(e,n?.
artifactId,`outputs[${o}].artifactId`),le(e,n?.sha256,`outputs[${o}].sha256`),le(e,n?.status,`outputs[${o}].status`),(!Array.
isArray(n?.shape)||n.shape.length===0||!n.shape.every(Number.isInteger))&&e.push(`outputs[${o}].shape must be a non-empt\
y integer array`)}),!t.timings||typeof t.timings!="object"?e.push("timings must be an object"):(le(e,t.timings.source,"t\
imings.source"),ho(t.timings.totalMs)||e.push("timings.totalMs must be a finite non-negative number"),t.timings.stages!=
null&&!Array.isArray(t.timings.stages)&&e.push("timings.stages must be an array when present")),t.status==="fallback"&&!dr(
t.fallbackReason)&&e.push("fallback receipts must include fallbackReason"),{ok:e.length===0,errors:e})}const Xt=Object.freeze(
{mapRead:1,mapWrite:2,copySrc:4,copyDst:8,index:16,vertex:32,uniform:64,storage:128,indirect:256,queryResolve:512}),yo=Object.
freeze({vertex:1,fragment:2,compute:4}),ko="kaminos.webgpu-phase-resource-plan.v0",It="kaminos.webgpu-phase-resource-wor\
king-set.v0",Vt="kaminos.webgpu-phase-resource-transition.v0";function pt(t){return typeof t=="string"&&t.trim().length>
0}function De(t){if(t==null||typeof t!="object"||Object.isFrozen(t))return t;for(const e of Object.values(t))De(e);return Object.
freeze(t)}function tt(t,e,n=e,o=new Set){if(t===null)return null;if(typeof t=="string"||typeof t=="boolean")return t;if(typeof t==
"number"){if(!Number.isFinite(t)||Object.is(t,-0))throw new Error(`${e} must be JSON-compatible; invalid number at ${n}`);
return t}if(typeof t!="object")throw new Error(`${e} must be JSON-compatible; unsupported ${typeof t} at ${n}`);if(o.has(
t))throw new Error(`${e} must be JSON-compatible; cycle at ${n}`);o.add(t);try{if(Array.isArray(t)){const i=new Array(t.
length);for(let c=0;c<t.length;c+=1){const l=Object.getOwnPropertyDescriptor(t,c);if(!l||!Object.hasOwn(l,"value"))throw new Error(
`${e} must be JSON-compatible; invalid array element at ${n}[${c}]`);i[c]=tt(l.value,e,`${n}[${c}]`,o)}if(Reflect.ownKeys(
t).filter(c=>c!=="length"&&(typeof c=="symbol"||!/^(0|[1-9][0-9]*)$/.test(c))).length>0)throw new Error(`${e} must be JS\
ON-compatible; named array property at ${n}`);return i}const r=Object.getPrototypeOf(t);if(r!==Object.prototype&&r!==null)
throw new Error(`${e} must be JSON-compatible; non-plain object at ${n}`);const s={};for(const i of Reflect.ownKeys(t)){
if(typeof i=="symbol")throw new Error(`${e} must be JSON-compatible; symbol key at ${n}`);const a=Object.getOwnPropertyDescriptor(
t,i);if(!a?.enumerable||!Object.hasOwn(a,"value"))throw new Error(`${e} must be JSON-compatible; invalid property at ${n}\
.${i}`);s[i]=tt(a.value,e,`${n}.${i}`,o)}return s}finally{o.delete(t)}}function pn(t){return Array.isArray(t)?`[${t.map(
pn).join(",")}]`:t!=null&&typeof t=="object"?`{${Object.keys(t).sort().map(e=>`${JSON.stringify(e)}:${pn(t[e])}`).join("\
,")}}`:JSON.stringify(t)}function Tn(t,e){if(t==null)return[];if(!Array.isArray(t))throw new Error(`${e} must be an arra\
y`);const n=[],o=new Set;for(const r of t){if(!pt(r))throw new Error(`${e} entries must be non-empty strings`);if(o.has(
r))throw new Error(`${e} contains duplicate resource ${r}`);o.add(r),n.push(r)}return n}function fr(t){let e=0;for(const n of t)
if(e+=n.declaredBytes,!Number.isSafeInteger(e))throw new Error("phase resource declared bytes exceed the safe integer ra\
nge");return e}function vo(t={}){if(t.maxResources!=null||t.maxPhases!=null||t.maxDeclaredBytes!=null||t.retentionLimit!=
null)throw new Error("phase resource plans are uncapped; maxResources, maxPhases, maxDeclaredBytes, and retentionLimit a\
re not supported");if(!pt(t.planId))throw new Error("phase resource planId must be a non-empty string");if(!Array.isArray(
t.resources)||t.resources.length===0)throw new Error("phase resource plan resources must be a non-empty array");if(!Array.
isArray(t.phases)||t.phases.length===0)throw new Error("phase resource plan phases must be a non-empty array");const e=new Set,
n=t.resources.map((a,c)=>{if(!a||typeof a!="object"||Array.isArray(a))throw new Error(`phase resource plan resources[${c}\
] must be an object`);if(!pt(a.resourceId))throw new Error(`phase resource plan resources[${c}].resourceId must be a non\
-empty string`);if(e.has(a.resourceId))throw new Error(`duplicate phase resource ${a.resourceId}`);if(!Number.isSafeInteger(
a.declaredBytes)||a.declaredBytes<0)throw new Error(`phase resource ${a.resourceId} declaredBytes must be a non-negative\
 safe integer`);return e.add(a.resourceId),{resourceId:a.resourceId,declaredBytes:a.declaredBytes,metadata:tt(a.metadata??
null,`phase resource ${a.resourceId} metadata`)}}),o=new Set,r=t.phases.map((a,c)=>{if(!a||typeof a!="object"||Array.isArray(
a))throw new Error(`phase resource plan phases[${c}] must be an object`);if(!pt(a.phaseId))throw new Error(`phase resour\
ce plan phases[${c}].phaseId must be a non-empty string`);if(o.has(a.phaseId))throw new Error(`duplicate phase ${a.phaseId}`);
o.add(a.phaseId);const l=Tn(a.requiredResourceIds,`phase ${a.phaseId} requiredResourceIds`),d=Tn(a.prefetchResourceIds,`\
phase ${a.phaseId} prefetchResourceIds`);for(const p of[...l,...d])if(!e.has(p))throw new Error(`phase ${a.phaseId} refe\
rences unknown resource ${p}`);const u=[...l],f=new Set(u);for(const p of d)f.has(p)||(f.add(p),u.push(p));return{phaseId:a.
phaseId,requiredResourceIds:l,prefetchResourceIds:d,holdResourceIds:u,metadata:tt(a.metadata??null,`phase ${a.phaseId} m\
etadata`)}}),s={planId:t.planId,resources:n,phases:r,metadata:tt(t.metadata??null,"phase resource plan metadata")},i={schema:ko,
...s,resourceIds:n.map(a=>a.resourceId),phaseIds:r.map(a=>a.phaseId),totalDeclaredBytes:fr(n),identity:`${encodeURIComponent(
t.planId)}#${encodeURIComponent(pn(s))}`};return De(i)}function pr(t){const e=new Error(String(t?.reason||"phase resourc\
e transition aborted"));return e.name="AbortError",e}function Yt(t){if(t?.aborted)throw pr(t)}function $n(t,e){const n=t instanceof
Error?t:new Error(String(t));if(!Object.hasOwn(n,"workingSetReport"))try{if(n.workingSetReport=e,n.workingSetReport===e)
return n}catch{}const o=new Error(n.message);return o.name=n.name,o.cause=n,o.workingSetReport=e,o}function _o(t){const e=t.
lease.release();if(e!=null&&typeof e.then=="function")throw new Error(`phase resource ${t.resource.resourceId} lease rel\
ease must complete synchronously`);const n=e?.status??"released";if(n==="release-failed")throw new Error(`phase resource\
 ${t.resource.resourceId} lease release failed`);if(n==="invalidated")return{outcome:"invalidated",releaseStatus:n};if(n!==
"released"&&n!=="already-released")throw new Error(`phase resource ${t.resource.resourceId} lease release returned unsup\
ported status ${n}`);return{outcome:"released",releaseStatus:n}}function xt(t){const e=[],n=[],o=[],r=[];for(const s of[
...t].reverse())try{const i=_o(s);o.push({resourceId:s.resource.resourceId,status:i.releaseStatus}),i.outcome==="invalid\
ated"?n.push(s.resource.resourceId):e.push(s.resource.resourceId)}catch(i){r.push({resourceId:s.resource.resourceId,message:String(
i?.message||i)})}return De({status:r.length>0?"release-failed":n.length>0?"invalidated":"released",releasedResourceIds:e,
invalidatedResourceIds:n,releaseResults:o,failures:r})}function Kt(t){return new Set(t.failures.map(e=>e.resourceId))}function Io(t={}){
if(t.maxHeldResources!=null||t.maxHeldBytes!=null||t.maxTransitions!=null||t.retentionLimit!=null)throw new Error("phase\
 resource working sets are uncapped; maxHeldResources, maxHeldBytes, maxTransitions, and retentionLimit are not supporte\
d");if(!pt(t.controllerId))throw new Error("phase resource controllerId must be a non-empty string");if(typeof t.acquireResource!=
"function")throw new Error("phase resource acquireResource must be a function");if(t.residencySnapshot!=null&&typeof t.residencySnapshot!=
"function")throw new Error("phase resource residencySnapshot must be a function");const e=vo(t.plan),n=t.now??(()=>globalThis.
performance?.now?.()??Date.now());if(typeof n!="function")throw new Error("phase resource now must be a function");const o=new Map(
e.resources.map(f=>[f.resourceId,f])),r=new Map(e.phases.map(f=>[f.phaseId,f])),s={status:"active",currentPhaseId:null,held:new Map,
transitionCount:0,activeTransition:null,closedAtMs:null};function i(){if(!t.residencySnapshot)return{residency:null,residencyError:null};
try{return{residency:tt(t.residencySnapshot(),"phase resource residency snapshot"),residencyError:null}}catch(f){return{
residency:null,residencyError:{name:f?.name||"Error",message:String(f?.message||f)}}}}function a(){return[...s.held.keys()]}
function c(){return fr([...s.held.values()].map(f=>f.resource))}function l(){const f=i();return De({schema:It,controllerId:t.
controllerId,planIdentity:e.identity,status:s.status,currentPhaseId:s.currentPhaseId,heldResourceIds:a(),heldDeclaredBytes:c(),
transitionCount:s.transitionCount,activeTransition:s.activeTransition?{...s.activeTransition}:null,...f,closedAtMs:s.closedAtMs})}
async function d(f,p={}){if(s.status!=="active")throw new Error(`phase resource working set is ${s.status}`);if(s.activeTransition)
throw new Error("phase resource transition is already in progress");const g=r.get(f);if(!g)throw new Error(`unknown phas\
e resource phase ${f||"<missing>"}`);Yt(p.signal);const m=n(),h=s.currentPhaseId,w=g.holdResourceIds.filter(_=>s.held.has(
_)),b=[];let y=null;s.activeTransition={fromPhaseId:h,toPhaseId:f,startedAtMs:m};try{for(const E of g.holdResourceIds){if(s.
held.has(E))continue;Yt(p.signal),y=E;const M=o.get(E),D=g.requiredResourceIds.includes(E)?"required":"prefetch",I=await t.
acquireResource({controllerId:t.controllerId,plan:e,phaseId:f,purpose:D,resource:M,signal:p.signal});if(!I||typeof I!="o\
bject"||typeof I.release!="function")throw new Error(`phase resource ${E} acquisition must return a lease with release()`);
const O={resource:M,lease:I,purpose:D};if(b.push(O),I.resourceId!=null&&I.resourceId!==E)throw new Error(`phase resource\
 ${E} acquisition returned lease for ${I.resourceId}`);Yt(p.signal)}const _=new Set(g.holdResourceIds),x=[...s.held.values()].
filter(E=>!_.has(E.resource.resourceId)),k=xt(x);if(k.status==="release-failed"){const E=xt(b),M=new Set([...k.releasedResourceIds,
...k.invalidatedResourceIds]),D=Kt(E),I=new Map([...s.held].filter(([O])=>!M.has(O)));for(const O of b)D.has(O.resource.
resourceId)&&I.set(O.resource.resourceId,O);throw s.held=I,s.currentPhaseId=null,s.status="release-failed",$n(new Error(
"phase resource transition could not release departed resources"),De({schema:Vt,status:"release-failed",controllerId:t.controllerId,
planIdentity:e.identity,fromPhaseId:h,toPhaseId:f,startedAtMs:m,settledAtMs:n(),failedResourceId:null,failure:{name:"Err\
or",message:"phase resource transition could not release departed resources"},acquiredResourceIds:b.map(O=>O.resource.resourceId),
retainedResourceIds:w,releasedResourceIds:k.releasedResourceIds,invalidatedResourceIds:k.invalidatedResourceIds,heldResourceIds:a(),
heldDeclaredBytes:c(),...i(),cleanup:E,releaseFailures:k.failures}))}const R=new Map;for(const E of g.holdResourceIds){const M=s.
held.get(E)||b.find(D=>D.resource.resourceId===E);R.set(E,M)}return s.held=R,s.currentPhaseId=f,s.transitionCount+=1,y=null,
De({schema:Vt,status:k.status==="invalidated"?"prepared-after-invalidation":"prepared",controllerId:t.controllerId,planIdentity:e.
identity,transitionSequence:s.transitionCount,fromPhaseId:h,toPhaseId:f,startedAtMs:m,settledAtMs:n(),failedResourceId:null,
failure:null,acquiredResourceIds:b.map(E=>E.resource.resourceId),retainedResourceIds:w,releasedResourceIds:k.releasedResourceIds,
invalidatedResourceIds:k.invalidatedResourceIds,heldResourceIds:a(),heldDeclaredBytes:c(),...i(),cleanup:null})}catch(_){
if(_?.workingSetReport)throw _;const x=xt(b);if(x.status==="release-failed"){const M=Kt(x);for(const D of b)M.has(D.resource.
resourceId)&&s.held.set(D.resource.resourceId,D);s.currentPhaseId=null,s.status="release-failed"}const k=_?.name==="Abor\
tError"||p.signal?.aborted===!0,R=k&&_?.name!=="AbortError"?pr(p.signal):_,E=De({schema:Vt,status:k?"canceled":"failed",
controllerId:t.controllerId,planIdentity:e.identity,transitionSequence:s.transitionCount+1,fromPhaseId:h,toPhaseId:f,startedAtMs:m,
settledAtMs:n(),failedResourceId:y,failure:{name:R?.name||"Error",message:String(R?.message||R)},acquiredResourceIds:b.map(
M=>M.resource.resourceId),retainedResourceIds:w,releasedResourceIds:[],invalidatedResourceIds:x.invalidatedResourceIds,heldResourceIds:a(),
heldDeclaredBytes:c(),...i(),cleanup:x,workingSetStatus:s.status});throw $n(R,E)}finally{s.activeTransition=null}}function u(){
if(s.activeTransition)throw new Error("phase resource working set cannot close during an active transition");if(s.status===
"closed"||s.status==="closed-after-invalidation")return De({schema:It,controllerId:t.controllerId,status:"already-closed",
releasedResourceIds:[]});const f=xt([...s.held.values()]),p=Kt(f);return s.held=new Map([...s.held].filter(([g])=>p.has(
g))),s.currentPhaseId=null,s.status=f.status==="release-failed"?"close-failed":f.status==="invalidated"?"closed-after-in\
validation":"closed",s.closedAtMs=n(),De({schema:It,controllerId:t.controllerId,status:s.status,releasedResourceIds:f.releasedResourceIds,
invalidatedResourceIds:f.invalidatedResourceIds,failures:f.failures,heldResourceIds:a(),heldDeclaredBytes:c(),...i(),closedAtMs:s.
closedAtMs})}return Object.freeze({schema:It,controllerId:t.controllerId,plan:e,transitionToPhase:d,snapshot:l,close:u})}
const xo=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComputeInvocationsPerWorkgr\
oup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY"];function Mt(t){return t?Array.from(t).map(String).sort():[]}
function So(t){return typeof t=="string"&&t.trim().length>0}function Bo(t={}){const e={};for(const n of xo)Number.isFinite(
t[n])&&(e[n]=t[n]);return e}function Eo(t){return{kind:"webgpu-local",runtime:"browser",adapterName:t.adapterName||null,
browser:t.browser||null,requestedFeatures:Mt(t.requestedFeatures),features:t.effectiveFeatures!=null||t.features!=null?Mt(
t.effectiveFeatures||t.features):void 0,limits:Bo(t.limits),timestampQuery:t.timestampQuery||"unavailable"}}function Ao(t){
const e=[];if(!t||typeof t!="object")return{ok:!1,errors:["identity must be an object"]};if(t.kind!=="webgpu-local"&&e.push(
"kind must be webgpu-local"),t.runtime!=="browser"&&e.push("runtime must be browser"),So(t.adapterName)||e.push("adapter\
Name must be a non-empty string"),Array.isArray(t.features)||e.push("features must be an array (empty is lawful for a ze\
ro-feature device)"),(!t.limits||typeof t.limits!="object"||Object.keys(t.limits).length===0)&&e.push("limits must be a \
non-empty object"),new Set(["requested","available","unavailable","disabled"]).has(t.timestampQuery)||e.push("timestampQ\
uery has unsupported state"),t.timestampQuery==="requested"){const o=Mt(t.requestedFeatures),r=Mt(t.features);o.includes(
"timestamp-query")||e.push("timestamp-query requested state must include timestamp-query in requestedFeatures"),r.includes(
"timestamp-query")||e.push("timestamp-query requested state must include timestamp-query in features")}return{ok:e.length===
0,errors:e}}const gt="0.1.60",Po=gt;function mn(t){return typeof t=="string"&&t.trim().length>0}function Co(t){return t&&
typeof t=="object"?t:{}}function On(t,e){return mn(t)?t:e}function Mo(t){const e=[];return!t||typeof t!="object"?{ok:!1,
errors:["kernel must be an object"]}:(mn(t.kitVersion)||e.push("kernel.kitVersion must be a non-empty string"),mn(t.profile)||
e.push("kernel.profile must be a non-empty string"),t.commit!=null&&typeof t.commit!="string"&&e.push("kernel.commit mus\
t be a string or null"),{ok:e.length===0,errors:e})}function Do(t={},e={}){const n=Co(t),o={kitVersion:On(n.kitVersion,e.
defaultKitVersion||Po),profile:On(n.profile,e.defaultProfile),commit:n.commit||null};if(e.requireProfile===!0||e.validate===
!0){const r=Mo(o);if(!r.ok)throw new Error(r.errors.join("; "))}return o}const Ro=Object.freeze({cpuPreprocess:"cpu-prep\
rocess",commandEncoding:"command-encoding",queueSubmission:"queue-submission",readback:"readback",presentation:"presenta\
tion",other:"other"});new Set(Object.values(Ro));const Dt="kaminos.webgpu-staged-profile.v0";function lt(t){return typeof t==
"string"&&t.trim().length>0}function mr(t){return Math.round(t*10)/10}function To(t={}){return{schema:Dt,route:t.route||
"staged-submits",timingSource:t.timingSource||"queue-submit-wait",timestampQueryValidatedAgainstStaged:!!t.timestampQueryValidatedAgainstStaged,
requiredStages:Array.isArray(t.requiredStages)?[...t.requiredStages]:[],stages:[]}}function Zt(t,e){if(!t||typeof t!="ob\
ject")throw new Error("profile must be an object");if(!lt(e?.name))throw new Error("stage.name must be a non-empty strin\
g");if(!Number.isFinite(e.ms)||e.ms<0)throw new Error("stage.ms must be a finite non-negative number");return Array.isArray(
t.stages)||(t.stages=[]),t.stages.push({name:e.name,ms:mr(e.ms),shape:Array.isArray(e.shape)?[...e.shape]:void 0,metadata:e.
metadata?JSON.parse(JSON.stringify(e.metadata)):void 0}),t}function $o(t){if(!t||typeof t!="object")throw new Error("pro\
file must be an object");const e=Array.isArray(t.stages)?t.stages:[],n=mr(e.reduce((o,r)=>o+(Number.isFinite(r.ms)?r.ms:
0),0));return{...t,schema:t.schema||Dt,stages:e,stageNames:e.map(o=>o.name),totalMs:n}}function Oo(t){const e=[];if(!t||
typeof t!="object")return{ok:!1,errors:["profile must be an object"]};t.schema!==Dt&&e.push(`schema must be ${Dt}`),lt(t.
route)||e.push("route must be a non-empty string"),lt(t.timingSource)||e.push("timingSource must be a non-empty string"),
(!Array.isArray(t.stages)||t.stages.length===0)&&e.push("stages must be a non-empty array"),(!Number.isFinite(t.totalMs)||
t.totalMs<0)&&e.push("totalMs must be a finite non-negative number");const n=new Set;if(Array.isArray(t.stages)&&t.stages.
forEach((o,r)=>{lt(o.name)||e.push(`stages[${r}].name must be a non-empty string`),(!Number.isFinite(o.ms)||o.ms<0)&&e.push(
`stages[${r}].ms must be a finite non-negative number`),lt(o.name)&&n.add(o.name)}),Array.isArray(t.requiredStages))for(const o of t.
requiredStages)n.has(o)||e.push(`missing required stage ${o}`);return t.timingSource==="timestamp-query"&&t.timestampQueryValidatedAgainstStaged!==
!0&&e.push("timestamp-query profile must be validated against staged-submit timings"),{ok:e.length===0,errors:e}}function Go(t,e){
if(!t||typeof t!="object")throw new Error(`${e} output must be an object`);if(typeof t.artifactId!="string"||t.artifactId.
length===0)throw new Error(`${e} output must include artifactId`);if(typeof t.sha256!="string"||t.sha256.length===0)throw new Error(
`${e} output must include sha256`);if(!Array.isArray(t.shape)||t.shape.length===0)throw new Error(`${e} output must incl\
ude shape`)}function Fo(t,e){return{role:t,artifactId:e.artifactId,sha256:e.sha256,shape:Array.isArray(e.shape)?[...e.shape]:
void 0}}function qo({artifacts:t,roles:e}){if(!t||typeof t!="object")throw new Error("artifacts must be an object");if(!Array.
isArray(e)||e.length===0)throw new Error("roles must be a non-empty array");const n=[];for(const o of e){const r=o.key,s=t[r];
if(!s){if(o.required!==!1)throw new Error(`${r} output is required`);continue}Go(s,r),n.push({role:o.role,artifactId:s.artifactId,
sha256:s.sha256,shape:[...s.shape],status:s.status||"real"})}return n}function zo(t){const e=$o(t),n=Oo(e);if(!n.ok)throw new Error(
`invalid staged profile: ${n.errors.join("; ")}`);return e}function No(t){const e=Ao(t);if(!e.ok)throw new Error(`invali\
d WebGPU backend identity: ${e.errors.join("; ")}`);return t}function Wo(t){No(t.backend);const e=zo(t.profile);return bo(
{requestedRouteId:t.requestedRouteId,effectiveRouteId:t.effectiveRouteId||t.requestedRouteId,status:t.status||(t.fallbackReason?
"fallback":"real"),fallbackReason:t.fallbackReason||null,backend:t.backend,model:t.model,kernel:t.kernel,inputs:t.inputs,
outputs:t.outputs,timings:{source:e.timingSource,totalMs:e.totalMs,stages:e.stages,profile:e}})}const Ct="kaminos.webgpu\
-foreground-opportunity-interlock.v0",jo="kaminos.webgpu-foreground-opportunity-pressure.v0",Lo="kaminos.webgpu-foregrou\
nd-opportunity-receipt.v0",Gn="kaminos.webgpu-foreground-opportunity-service.v0";function nt(t){return t!=null&&typeof t==
"object"&&!Array.isArray(t)}function qe(t){return typeof t=="string"&&t.trim().length>0}function de(t){return t==null?t:
JSON.parse(JSON.stringify(t))}function _e(t){if(t==null||typeof t!="object"||Object.isFrozen(t))return t;for(const e of Object.
values(t))_e(e);return Object.freeze(t)}function Ke(t){return{name:qe(t?.name)?t.name:"Error",message:qe(t?.message)?t.message:
String(t)}}function Uo(t){if(!nt(t))throw new Error("foreground opportunity boundary must be an object");for(const e of[
"invocationId","boundaryId","dutyId","phase"])if(!qe(t[e]))throw new Error(`${e} must be a non-empty string`);if(t.position!==
"before-encode")throw new Error("foreground opportunities are serviced only at position before-encode");if(t.metadata!=null&&
!nt(t.metadata))throw new Error("foreground opportunity boundary metadata must be an object when provided");return _e({invocationId:t.
invocationId,boundaryId:t.boundaryId,dutyId:t.dutyId,phase:t.phase,position:t.position,metadata:de(t.metadata||{})})}function Qt(t,e=!1){
if(!qe(t.routeId))throw new Error("routeId must be a non-empty string");if(!e&&!qe(t.runId))throw new Error("runId must \
be a non-empty caller-owned identity");if(!t.device||typeof t.device!="object")throw new Error("device must be an object");
if(!t.queue||typeof t.queue!="object")throw new Error("queue must be an object");if(t.maxRequests!=null||t.maxReceipts!=
null||t.retention!=null&&t.retention!=="uncapped")throw new Error("foreground opportunity retention is uncapped; capped \
retention is not supported");const n=t.now||(()=>globalThis.performance?.now?.()??Date.now()),o={routeId:t.routeId,runId:e?
null:t.runId,sequence:0,serviceSequence:0,pending:[],requests:new Map,receipts:[],services:[],activeRequestCount:0,activeServiceCount:0,
queuedServiceCount:0,serviceTail:Promise.resolve(),noDemandBoundaryCount:0};function r(u,f){if(u.receipt)return u.receipt;
const p=_e({schema:Lo,routeId:o.routeId,runId:o.runId,requestId:u.requestId,requestSequence:u.sequence,status:f.status,requestedAtMs:u.
requestedAtMs,startedAtMs:f.startedAtMs??null,settledAtMs:f.settledAtMs,elapsedMs:f.startedAtMs==null?0:f.settledAtMs==null?
null:Math.max(0,f.settledAtMs-f.startedAtMs),boundary:de(f.boundary||null),metadata:de(u.metadata),result:de(f.result??null),
submissionCount:f.submissions?.filter(g=>g.submissionStatus==="queue-submit-returned").length||0,submissions:de(f.submissions||
[]),cancellation:de(f.cancellation||null),failure:de(f.failure||null),authority:"foreground-callback-and-queue-submissio\
n-observed-no-gpu-completion-or-presentation-claim"});return u.status=p.status,u.receipt=p,o.receipts.push(de(p)),u.resolveCompletion(
p),p}function s(u={}){if(!nt(u))throw new Error("foreground opportunity request must be an object");if(!qe(u.requestId))
throw new Error("requestId must be a non-empty string");if(o.requests.has(u.requestId))throw new Error(`duplicate foregr\
ound opportunity request ${u.requestId}`);if(typeof u.run!="function")throw new Error("foreground opportunity run must b\
e a function");if(u.metadata!=null&&!nt(u.metadata))throw new Error("foreground opportunity metadata must be an object w\
hen provided");o.sequence+=1;let f;const p=new Promise(h=>{f=h}),g=new AbortController,m={requestId:u.requestId,sequence:o.
sequence,requestedAtMs:n(),metadata:de(u.metadata||{}),run:u.run,status:"pending",receipt:null,resolveCompletion:f,abortController:g,
cancellationReason:null};return o.requests.set(m.requestId,m),o.pending.push(m),Object.freeze({requestId:m.requestId,completion:p,
cancel(h="foreground-opportunity-canceled"){if(m.status==="active")return m.cancellationReason=String(h),m.abortController.
abort(m.cancellationReason),_e({status:"cancellation-requested",requestId:m.requestId,reason:m.cancellationReason});if(m.
status!=="pending")return m.receipt||_e({status:m.status,requestId:m.requestId});m.abortController.abort(h);const w=r(m,
{status:"canceled-before-service",settledAtMs:n(),cancellation:{reason:String(h)}});return o.pending=o.pending.filter(b=>b!==
m),w}})}async function i(u){const f=o.pending.filter(k=>k.status==="pending");if(f.length===0)return o.noDemandBoundaryCount+=
1,_e({schema:Gn,status:"no-demand",routeId:o.routeId,runId:o.runId,boundary:u,capturedRequestCount:0,servicedRequestCount:0,
failures:[],authority:"no-foreground-demand-observed-at-safe-boundary"});const p=new Set(f);o.pending=o.pending.filter(k=>!p.
has(k)),o.serviceSequence+=1;const g=n(),m=[],h=[];let w=null;for(const k of f){if(k.status!=="pending")continue;k.status=
"active",o.activeRequestCount+=1;const R=n(),E=[];let M=null,D=null;try{M=await k.run(Object.freeze({schema:Ct,routeId:o.
routeId,runId:o.runId,requestId:k.requestId,boundary:u,device:t.device,queue:t.queue,signal:k.abortController.signal,submit(A,$={}){
if(k.status!=="active")throw new Error("foreground opportunity submission lease is not active");if(k.abortController.signal.
aborted)throw new Error("foreground opportunity was canceled before submission");if(!Array.isArray(A)||A.length===0)throw new Error(
"foreground opportunity submit requires a non-empty command buffer array");if(!nt($))throw new Error("foreground submiss\
ion input must be an object");const U=$.submissionId||`${k.requestId}:submission:${E.length+1}`;if(!qe(U))throw new Error(
"submissionId must be a non-empty string");if(E.some(te=>te.submissionId===U))throw new Error(`duplicate foreground subm\
ission ${U}`);if(typeof t.queue.submit!="function")throw new Error("queue.submit must be available");let Y;try{Y=de($.metadata||
{})}catch(te){throw new Error(`foreground submission metadata must be JSON-serializable: ${te.message}`)}const J=n();try{
t.queue.submit(A)}catch(te){throw E.push(_e({submissionId:U,submissionSequence:E.length+1,commandBufferCount:A.length,submittedAtMs:J,
returnedAtMs:n(),submissionStatus:"queue-submit-threw",metadata:Y,failure:Ke(te),authority:"queue-submit-call-failed-no-\
gpu-submission-claim"})),te}let X=null,V=null;try{X=n()}catch(te){V={phase:"foreground-submission-return-timing",error:Ke(
te)}}const F=_e({submissionId:U,submissionSequence:E.length+1,commandBufferCount:A.length,submittedAtMs:J,returnedAtMs:X,
submissionStatus:"queue-submit-returned",...V?{timingFailure:V}:{},metadata:Y,authority:"queue-submit-call-returned-no-g\
pu-completion-or-presentation-claim"});return E.push(F),F}}))}catch(A){D={phase:"foreground-callback",error:Ke(A)}}finally{
o.activeRequestCount-=1}const I=E.filter(A=>A.submissionStatus==="queue-submit-returned").length,O=k.abortController.signal.
aborted;let G=null;if(!D&&!O)try{G=de(M??null)}catch(A){D={phase:"foreground-result-serialization",error:Ke(A)}}let v=null,
P=null;try{v=n()}catch(A){w||=A,P={phase:"foreground-receipt-timing",error:Ke(A)}}const C=D||P,B=r(k,{status:O?"canceled\
-during-service":C?I>0?"failed-after-submission":"failed-before-submission":"completed",startedAtMs:R,settledAtMs:v,boundary:u,
result:G,submissions:E,cancellation:O?{reason:k.cancellationReason||String(k.abortController.signal.reason||"foreground-\
opportunity-canceled"),callbackError:D?de(D.error):null}:null,failure:O?P:C});m.push(B),C&&(!O||P)&&h.push({requestId:k.
requestId,status:B.status,failure:de(C)})}let b=null,y=null,_=null;try{b=n()}catch(k){_=k,y={phase:"foreground-service-r\
eceipt-timing",error:Ke(k)}}const x=_e({schema:Gn,status:h.length>0||y?"failed":"serviced",routeId:o.routeId,runId:o.runId,
serviceSequence:o.serviceSequence,boundary:u,startedAtMs:g,settledAtMs:b,capturedRequestCount:f.length,servicedRequestCount:m.
length,receiptIds:m.map(k=>k.requestId),failures:h,failure:y,authority:"foreground-callbacks-settled-before-next-inferen\
ce-encode-no-gpu-completion-or-presentation-claim"});if(o.services.push(de(x)),!e&&(w||y))throw w||_;return x}async function a(u={}){
const f=Uo(u),p=o.serviceTail;let g;o.serviceTail=new Promise(m=>{g=m}),o.queuedServiceCount+=1,await p,o.queuedServiceCount-=
1,o.activeServiceCount+=1;try{return await i(f)}finally{o.activeServiceCount-=1,g()}}function c(){return Object.freeze({
schema:jo,routeId:o.routeId,runId:o.runId,pendingRequestCount:o.pending.length,activeRequestCount:o.activeRequestCount,activeServiceCount:o.
activeServiceCount,queuedServiceCount:o.queuedServiceCount,authority:"live-foreground-opportunity-counters-no-history-cl\
one"})}function l(){const u=c();return _e({schema:Ct,routeId:o.routeId,runId:o.runId,retention:"uncapped",requestCount:o.
requests.size,pendingRequestCount:u.pendingRequestCount,activeRequestCount:u.activeRequestCount,activeServiceCount:u.activeServiceCount,
queuedServiceCount:u.queuedServiceCount,receiptCount:o.receipts.length,receipts:de(o.receipts),serviceCount:o.services.length,
services:de(o.services),noDemandBoundaryCount:o.noDemandBoundaryCount,authority:"foreground-opportunity-request-and-queu\
e-submit-observation-no-presentation-claim"})}function d(){const u=l();return _e({...u,status:u.pendingRequestCount===0&&
u.activeRequestCount===0&&u.activeServiceCount===0&&u.queuedServiceCount===0?"succeeded":"incomplete"})}return Object.freeze(
{schema:Ct,request:s,serviceAtBoundary:a,pressureSnapshot:c,snapshot:l,finish:d})}const Fn="kaminos.webgpu-foreground-se\
rvice.v0";function Ho(t={}){const e={...t,queue:t.queue??t.device?.queue};if(typeof e.queue?.submit!="function")throw new Error(
"queue.submit must be a function");if(e.now!=null&&typeof e.now!="function")throw new Error("now must be a function");Qt(
e,!0);const n=new Map;let o=null,r=Promise.resolve(),s=null,i=0,a=0,c=0,l=null,d=null;function u(){if(s)throw new Error(
"foreground service is disposed")}function f(w,b){const y=`${e.routeId}:foreground-service:${++i}`;return{invocationId:w??
y,boundaryId:y,dutyId:y,phase:b,position:"before-encode"}}function p(w){if(u(),o&&!o.finishing){const x=o.interlock.request(
w);return o.window?.accepting&&o.service(o.window.phase),x}if(n.has(w?.requestId))throw new Error(`duplicate foreground \
opportunity request ${w.requestId}`);const b=Qt(e,!0),y=b.request(w);n.set(y.requestId,y),y.completion.then(x=>{n.delete(
y.requestId),c+=1,l=x});const _=o?.finishing;return r=r.then(()=>_?.catch(()=>{})).then(()=>b.serviceAtBoundary(f(null,"\
foreground-idle"))).then(x=>(d=x,x)),y}function g(w,b={}){if(u(),o)throw new Error(`foreground service already has an ac\
tive run (${o.runId})`);if(!nt(b))throw new Error("foreground run options must be an object");const y=Object.hasOwn(b,"r\
outeId")?b.routeId:e.routeId,_=Qt({...e,routeId:y,runId:w}),x={runId:w,routeId:y,interlock:_,window:null,finishing:null,
tail:Promise.resolve()};o=x,a+=1;function k(){if(o!==x||x.finishing)throw new Error(`foreground run ${w} is finishing or\
 finished`);if(x.window)throw new Error("model GPU boundary is unavailable during a CPU foreground window")}function R(I){
return k(),x.tail=_.serviceAtBoundary(I),x.tail}x.service=I=>(x.tail=_.serviceAtBoundary(f(w,I)),x.tail);async function E(I,O){
if(k(),!qe(I))throw new Error("foreground window phase must be a non-empty string");if(typeof O!="function")throw new Error(
"foreground window work must be a function");x.window={phase:I,accepting:!0},x.service(I);try{return await O()}finally{x.
window.accepting=!1;try{await x.tail}finally{x.window=null}}}function M(){if(x.finishing)return x.finishing;k();let I,O;
return x.finishing=new Promise((G,v)=>{I=G,O=v}),x.service("foreground-run-finish").then(()=>{const G=_.finish();o=null,
I(G)},O),x.finishing}const D=Object.freeze({schema:Ct,request(I){if(o!==x||x.finishing)throw new Error(`foreground run ${w}\
 is finishing or finished`);return p(I)},serviceAtBoundary:R,pressureSnapshot:_.pressureSnapshot,snapshot:_.snapshot,finish:_.
finish});return r.then(()=>Object.freeze({runId:w,routeId:y,foregroundOpportunities:D,withForeground:E,finish:M}))}function m(){
return Object.freeze({schema:Fn,routeId:e.routeId,disposed:s!==null,runCount:a,activeRun:o?Object.freeze({runId:o.runId,
routeId:o.routeId,finishing:o.finishing!==null,foregroundPhase:o.window?.phase??null,pressure:o.interlock.pressureSnapshot()}):
null,outsideRunInFlightCount:n.size,outsideRunReceiptCount:c,lastOutsideRunReceipt:l,lastOutsideRunService:d})}function h(){
if(s)return s;if(o)throw new Error("finish the active run before disposing foreground service");return s=r.then(()=>{}),
s}return Object.freeze({schema:Fn,routeId:e.routeId,device:e.device,queue:e.queue,request:p,beginRun:g,snapshot:m,dispose:h})}
function Jt(t){return typeof t=="string"&&t.trim().length>0}const Xo=new Set(["module","layout"]);function Vo(){const t=new WeakMap;
let e=1;return function(o){return t.has(o)||(t.set(o,e),e+=1),t.get(o)}}function Yo(t,e){const n=new WeakSet;return JSON.
stringify(t,(o,r)=>{if(typeof r=="function")return`[Function:${r.name||"anonymous"}]`;if(!r||typeof r!="object")return r;
if(Xo.has(o))return{__gpuObjectId:e(r)};if(n.has(r))return"[Circular]";if(n.add(r),Array.isArray(r))return r;const s=Object.
keys(r);if(s.length===0)return{__objectId:e(r)};const i={};for(const a of s.sort())i[a]=r[a];return i})}function Ko(t){if(!t||
typeof t!="object")throw new Error("device must be an object");const e=new Map,n=new Map,o=Vo();return{getShaderModule(r,s,i={}){
if(!Jt(r))throw new Error("shader module label must be a non-empty string");if(!Jt(s))throw new Error("shader module cod\
e must be a non-empty string");if(typeof t.createShaderModule!="function")throw new Error("device.createShaderModule mus\
t be available");const a=`${r}\0${s}`;return e.has(a)||e.set(a,t.createShaderModule({...i,label:r,code:s})),e.get(a)},getComputePipeline(r,s){
if(!Jt(r))throw new Error("compute pipeline label must be a non-empty string");if(!s||typeof s!="object")throw new Error(
"compute pipeline descriptor must be an object");if(typeof t.createComputePipeline!="function")throw new Error("device.c\
reateComputePipeline must be available");const i=`${r}\0${Yo(s,o)}`;return n.has(i)||n.set(i,t.createComputePipeline({...s,
label:r})),n.get(i)},clear(){e.clear(),n.clear()},sizes(){return{shaderModules:e.size,computePipelines:n.size}}}}const gr="\
kaminos.webgpu-cooperative-boundary-manifest.v0",Zo=new Set(["gpu-command","cpu-work"]),Qo=new Set(["compute","copy","re\
nder","mixed"]),Jo=new Set(["cpu-preprocess","command-encoding","queue-submission","readback","presentation","other"]),es=new Set(
["after-duty","none"]),ts=new Set(["manifestId","routeId","phases","metadata"]),ns=new Set(["phaseId","boundaries","meta\
data"]),rs=new Set(["boundaryId","kind","unit","totalItems","progressWeight","commandDutyKind","hostPhase","chunking","y\
ieldPolicy","resources","metadata"]);function st(t){return t!=null&&typeof t=="object"&&!Array.isArray(t)}function os(t){
return typeof t=="string"&&t.trim().length>0}function rt(t,e){if(!os(e))throw new TypeError(`${t} must be a non-empty st\
ring`);return e}function dt(t,e){if(!Number.isSafeInteger(e)||e<=0)throw new TypeError(`${t} must be a positive safe int\
eger`);return e}function ss(t){return t==null?t:JSON.parse(JSON.stringify(t))}function hr(t){if(t==null||typeof t!="obje\
ct"||Object.isFrozen(t))return t;for(const e of Object.values(t))hr(e);return Object.freeze(t)}function it(t,e,n){for(const o of Object.
keys(t))if(!e.has(o))throw new TypeError(`${n} has unsupported field ${o}`)}function gn(t,e){if(t==null)return{};if(!st(
t))throw new TypeError(`${e} must be an object when provided`);return ss(t)}function en(t,e){if(t==null)return[];if(!Array.
isArray(t))throw new TypeError(`${e} must be an array`);const n=t.map((o,r)=>rt(`${e}[${r}]`,o));if(new Set(n).size!==n.
length)throw new TypeError(`${e} must not contain duplicate resource identities`);return n}function is(t,e){if(t==null)return{
retain:[],produce:[],release:[]};if(!st(t))throw new TypeError(`${e} must be an object when provided`);return it(t,new Set(
["retain","produce","release"]),e),{retain:en(t.retain,`${e}.retain`),produce:en(t.produce,`${e}.produce`),release:en(t.
release,`${e}.release`)}}function as(t,e,n){if(!st(t))throw new TypeError(`${n} must be an object`);if(t.mode==="fixed")
return it(t,new Set(["mode","chunkItems"]),n),{mode:"fixed",chunkItems:dt(`${n}.chunkItems`,t.chunkItems)};if(t.mode!=="\
adaptive")throw new TypeError(`${n}.mode must be fixed or adaptive`);if(e!=="gpu-command")throw new TypeError(`${n}.mode\
 adaptive is supported only for gpu-command boundaries`);it(t,new Set(["mode","initialItems","minItems","maxItems","targ\
etDurationMs","adjustmentGain"]),n);const o=dt(`${n}.initialItems`,t.initialItems),r=dt(`${n}.minItems`,t.minItems),s=dt(
`${n}.maxItems`,t.maxItems);if(s<r)throw new TypeError(`${n}.maxItems must be at least minItems`);if(o<r||o>s)throw new TypeError(
`${n}.initialItems must be within minItems and maxItems`);if(!Number.isFinite(t.targetDurationMs)||t.targetDurationMs<=0)
throw new TypeError(`${n}.targetDurationMs must be finite and greater than zero`);const i=t.adjustmentGain===void 0?1:t.
adjustmentGain;if(!Number.isFinite(i)||i<=0||i>1)throw new TypeError(`${n}.adjustmentGain must be finite, greater than z\
ero, and at most one`);return{mode:"adaptive",initialItems:o,minItems:r,maxItems:s,targetDurationMs:t.targetDurationMs,adjustmentGain:i}}
function us(t,e,n,o){const r=`phases.${e}.boundaries[${o}]`;if(!st(t))throw new TypeError(`${r} must be an object`);it(t,
rs,r);const s=rt(`${r}.boundaryId`,t.boundaryId);if(n.has(s))throw new TypeError(`duplicate boundaryId: ${s}`);if(n.add(
s),!Zo.has(t.kind))throw new TypeError(`${r}.kind must be gpu-command or cpu-work`);const i=t.totalItems==null?null:dt(`${r}\
.totalItems`,t.totalItems);if(!Number.isFinite(t.progressWeight)||t.progressWeight<=0)throw new TypeError(`${r}.progress\
Weight must be finite and greater than zero`);const a=t.yieldPolicy||"after-duty";if(!es.has(a))throw new TypeError(`${r}\
.yieldPolicy must be after-duty or none`);let c=null,l=null;if(t.kind==="gpu-command"){if(c=t.commandDutyKind||"compute",
!Qo.has(c))throw new TypeError(`${r}.commandDutyKind is unsupported`);if(t.hostPhase!=null)throw new TypeError(`${r}.hos\
tPhase belongs only to cpu-work boundaries`)}else{if(l=t.hostPhase||"other",!Jo.has(l))throw new TypeError(`${r}.hostPha\
se is unsupported`);if(t.commandDutyKind!=null)throw new TypeError(`${r}.commandDutyKind belongs only to gpu-command bou\
ndaries`)}return{boundaryId:s,kind:t.kind,unit:rt(`${r}.unit`,t.unit),totalItems:i,progressWeight:t.progressWeight,commandDutyKind:c,
hostPhase:l,chunking:as(t.chunking,t.kind,`${r}.chunking`),yieldPolicy:a,resources:is(t.resources,`${r}.resources`),metadata:gn(
t.metadata,`${r}.metadata`)}}function ut(t={}){if(!st(t))throw new TypeError("cooperative boundary manifest input must b\
e an object");it(t,ts,"cooperative boundary manifest");const e=rt("manifestId",t.manifestId),n=rt("routeId",t.routeId);if(!Array.
isArray(t.phases)||t.phases.length===0)throw new TypeError("phases must be a non-empty array");const o=new Set,r=new Set,
s=t.phases.map((i,a)=>{const c=`phases[${a}]`;if(!st(i))throw new TypeError(`${c} must be an object`);it(i,ns,c);const l=rt(
`${c}.phaseId`,i.phaseId);if(o.has(l))throw new TypeError(`duplicate phaseId: ${l}`);if(o.add(l),!Array.isArray(i.boundaries)||
i.boundaries.length===0)throw new TypeError(`${c}.boundaries must be a non-empty array`);const d=i.boundaries.map((u,f)=>us(
u,l,r,f));return{phaseId:l,progressWeight:d.reduce((u,f)=>u+f.progressWeight,0),boundaries:d,metadata:gn(i.metadata,`${c}\
.metadata`)}});return hr({schema:gr,manifestId:e,routeId:n,progressWeight:s.reduce((i,a)=>i+a.progressWeight,0),phases:s,
metadata:gn(t.metadata,"metadata")})}const qn="kaminos.webgpu-adaptive-command-duty-planner.v0",cs="kaminos.webgpu-adapt\
ive-command-duty-range.v0",zn="kaminos.webgpu-adaptive-command-duty-observation.v0",ls=new Set(["queue-work-done","gpu-t\
imestamp-query"]);function mt(t){return t!=null&&typeof t=="object"&&!Array.isArray(t)}function ht(t){return typeof t=="\
string"&&t.trim().length>0}function St(t,e){if(!Number.isSafeInteger(t)||t<=0)throw new Error(`${e} must be a positive s\
afe integer`)}function Pe(t){return t==null?t:JSON.parse(JSON.stringify(t))}function ft(t){if(t==null||typeof t!="object"||
Object.isFrozen(t))return t;for(const e of Object.values(t))ft(e);return Object.freeze(t)}function ds(t){return{name:ht(
t?.name)?t.name:"Error",message:ht(t?.message)?t.message:String(t)}}function fs(t){if(!mt(t))throw new Error("adaptive c\
ommand duty planner input must be an object");if(!ht(t.plannerId))throw new Error("plannerId must be a non-empty string");
if(!ht(t.unit))throw new Error("unit must be a non-empty string");if(St(t.totalItems,"totalItems"),St(t.initialChunkItems,
"initialChunkItems"),!Number.isFinite(t.targetDurationMs)||t.targetDurationMs<=0)throw new Error("targetDurationMs must \
be finite and greater than zero");const e=t.adjustmentGain===void 0?1:t.adjustmentGain;if(!Number.isFinite(e)||e<=0||e>1)
throw new Error("adjustmentGain must be finite, greater than zero, and at most one");if(!mt(t.bounds))throw new Error("b\
ounds must be a caller-declared object");const{minChunkItems:n,maxChunkItems:o}=t.bounds;if(St(n,"bounds.minChunkItems"),
St(o,"bounds.maxChunkItems"),o<n)throw new Error("bounds.maxChunkItems must be greater than or equal to bounds.minChunkI\
tems");if(t.initialChunkItems<n||t.initialChunkItems>o)throw new Error("initialChunkItems must be within caller-declared\
 bounds");if(t.metadata!=null&&!mt(t.metadata))throw new Error("metadata must be an object when provided");if(t.retention!=
null&&t.retention!=="uncapped")throw new Error("adaptive command duty history retention is uncapped");return{plannerId:t.
plannerId,unit:t.unit,totalItems:t.totalItems,initialChunkItems:t.initialChunkItems,targetDurationMs:t.targetDurationMs,
requestedAdjustmentGain:e,effectiveAdjustmentGain:e,bounds:{minChunkItems:n,maxChunkItems:o},metadata:Pe(t.metadata||{})}}
function ps({range:t,observedDurationMs:e,targetDurationMs:n,adjustmentGain:o,bounds:r}){let s;e===0?s=Number.POSITIVE_INFINITY:
s=n/e;const i=s**o,a=t.itemCount*s,c=t.itemCount*i;let l,d=null;return c<r.minChunkItems?(l=r.minChunkItems,d="minChunkI\
tems"):c>r.maxChunkItems?(l=r.maxChunkItems,d="maxChunkItems"):l=Math.max(r.minChunkItems,Math.min(r.maxChunkItems,Math.
round(c))),{fullGainCorrectionRatio:Number.isFinite(s)?s:null,effectiveCorrectionRatio:Number.isFinite(i)?i:null,rawChunkItems:Number.
isFinite(a)?a:null,effectiveRawChunkItems:Number.isFinite(c)?c:null,nextChunkItems:l,boundApplication:d,adjustment:l<t.plannedChunkItems?
"decrease":l>t.plannedChunkItems?"increase":"maintain"}}function ms(t={}){const e=fs(t),n={status:"active",completedItems:0,
currentChunkItems:e.initialChunkItems,pendingRange:null,ranges:[],observations:[],failure:null};function o(){return Pe({
schema:qn,plannerId:e.plannerId,unit:e.unit,status:n.status,totalItems:e.totalItems,completedItems:n.completedItems,progress:n.
completedItems/e.totalItems,initialChunkItems:e.initialChunkItems,currentChunkItems:n.currentChunkItems,targetDurationMs:e.
targetDurationMs,requestedAdjustmentGain:e.requestedAdjustmentGain,effectiveAdjustmentGain:e.effectiveAdjustmentGain,bounds:e.
bounds,metadata:e.metadata,retention:"uncapped",pendingRangeId:n.pendingRange?.rangeId||null,rangeCount:n.ranges.length,
actualRangeCount:n.status==="complete"?n.ranges.length:null,rangeCountAuthority:n.status==="complete"?"actual":"open-unt\
il-completion",ranges:n.ranges,observations:n.observations,failure:n.failure})}function r(){if(n.status==="failed")throw new Error(
"failed planner cannot produce another range");if(n.status==="complete")return null;if(n.pendingRange)throw new Error(`p\
ending range ${n.pendingRange.rangeId} must be observed or failed first`);const c=n.completedItems,l=Math.min(n.currentChunkItems,
e.totalItems-c),d=c+l,u=n.ranges.length,f=ft({schema:cs,plannerId:e.plannerId,rangeId:`${e.plannerId}:${u}`,rangeIndex:u,
rangeTotal:null,rangeCountAuthority:"actual-after-completion",unit:e.unit,itemStart:c,itemEnd:d,itemCount:l,totalItems:e.
totalItems,completedItemsBefore:c,completedItemsAfter:d,progressBefore:c/e.totalItems,progressAfter:d/e.totalItems,plannedChunkItems:n.
currentChunkItems,targetDurationMs:e.targetDurationMs,requestedAdjustmentGain:e.requestedAdjustmentGain,effectiveAdjustmentGain:e.
effectiveAdjustmentGain,bounds:Pe(e.bounds),metadata:Pe(e.metadata)});return n.pendingRange=f,n.ranges.push({...Pe(f),status:"\
pending-observation"}),f}function s(c){if(!n.pendingRange)throw new Error("adaptive command duty planner has no pending \
range");if(c!==n.pendingRange.rangeId)throw new Error(`rangeId ${c||"<missing>"} does not match pending range ${n.pendingRange.
rangeId}`);return n.pendingRange}function i(c={}){if(n.status!=="active")throw new Error(`${n.status} planner cannot acc\
ept range observations`);if(!mt(c))throw new Error("range observation must be an object");const l=s(c.rangeId);if(!ls.has(
c.timingAuthority))throw new Error("timingAuthority must be queue-work-done or gpu-timestamp-query");if(!Number.isFinite(
c.observedDurationMs)||c.observedDurationMs<0)throw new Error("observedDurationMs must be finite and non-negative");if(c.
timingAuthority==="gpu-timestamp-query"&&c.observedDurationMs<=0)throw new Error("gpu-timestamp-query observedDurationMs\
 must be greater than zero");n.completedItems=l.itemEnd;const d=n.completedItems===e.totalItems,u=d?{fullGainCorrectionRatio:null,
effectiveCorrectionRatio:null,rawChunkItems:null,effectiveRawChunkItems:null,nextChunkItems:null,boundApplication:null,adjustment:"\
complete"}:ps({range:l,observedDurationMs:c.observedDurationMs,targetDurationMs:e.targetDurationMs,adjustmentGain:e.effectiveAdjustmentGain,
bounds:e.bounds});d||(n.currentChunkItems=u.nextChunkItems),n.status=d?"complete":"active",n.pendingRange=null;const f=ft(
{schema:zn,plannerId:e.plannerId,status:d?"planner-complete":"range-observed",rangeId:l.rangeId,rangeIndex:l.rangeIndex,
timingAuthority:c.timingAuthority,observedDurationMs:c.observedDurationMs,targetDurationMs:e.targetDurationMs,requestedAdjustmentGain:e.
requestedAdjustmentGain,effectiveAdjustmentGain:e.effectiveAdjustmentGain,fullGainCorrectionRatio:u.fullGainCorrectionRatio,
effectiveCorrectionRatio:u.effectiveCorrectionRatio,observedChunkItems:l.itemCount,rawNextChunkItems:u.rawChunkItems,effectiveRawNextChunkItems:u.
effectiveRawChunkItems,nextChunkItems:u.nextChunkItems,adjustment:u.adjustment,boundApplication:u.boundApplication,completedItems:n.
completedItems,totalItems:e.totalItems,progress:n.completedItems/e.totalItems,actualRangeCount:d?n.ranges.length:null,rangeCountAuthority:d?
"actual":"open-until-completion",metadata:Pe(e.metadata)});return n.ranges[l.rangeIndex]={...n.ranges[l.rangeIndex],status:"\
observed",observedDurationMs:c.observedDurationMs,timingAuthority:c.timingAuthority},n.observations.push(Pe(f)),f}function a(c={}){
if(n.status!=="active")throw new Error(`${n.status} planner cannot fail a range`);if(!mt(c))throw new Error("range failu\
re must be an object");const l=s(c.rangeId);if(!ht(c.phase))throw new Error("range failure phase must be a non-empty str\
ing");const d=ft({rangeId:l.rangeId,rangeIndex:l.rangeIndex,phase:c.phase,error:ds(c.error)});return n.status="failed",n.
failure=Pe(d),n.pendingRange=null,n.ranges[l.rangeIndex]={...n.ranges[l.rangeIndex],status:"failed",failure:Pe(d)},ft({schema:zn,
plannerId:e.plannerId,status:"failed",completedItems:n.completedItems,totalItems:e.totalItems,requestedAdjustmentGain:e.
requestedAdjustmentGain,effectiveAdjustmentGain:e.effectiveAdjustmentGain,rangeCountAuthority:"open-at-failure",actualRangeCount:null,
failure:d,metadata:Pe(e.metadata)})}return Object.freeze({schema:qn,plannerId:e.plannerId,unit:e.unit,nextRange:r,observeRange:i,
failRange:a,snapshot:o})}const Nn="kaminos.webgpu-cooperative-execution-report.v0",gs="kaminos.webgpu-cooperative-progre\
ss.v0",hs="kaminos.webgpu-cooperative-range.v0",bs=new Set(["cooperative","disabled"]),ws=new Set(["strict-prefix","boun\
ded-prefix"]);function ys(t){return t!=null&&typeof t=="object"&&!Array.isArray(t)}function bt(t){return typeof t=="stri\
ng"&&t.trim().length>0}function ce(t){return t==null?t:JSON.parse(JSON.stringify(t))}function Je(t){if(t==null||typeof t!=
"object"||Object.isFrozen(t))return t;for(const e of Object.values(t))Je(e);return Object.freeze(t)}function Wn(t,e){if(!Number.
isSafeInteger(e)||e<=0)throw new TypeError(`${t} must be a positive safe integer`);return e}function Me(t){return{name:bt(
t?.name)?t.name:"Error",message:bt(t?.message)?t.message:String(t)}}function xe(t){const e=t();if(!Number.isFinite(e))throw new TypeError(
"cooperative execution clock returned a non-finite value");return e}function ks(t){const e=t?.reason,n=new Error(bt(e?.message)?
e.message:bt(e)?e:"cooperative execution was cancelled");return n.name="AbortError",n}function vs({plannerId:t,unit:e,totalItems:n,
chunkItems:o,metadata:r,maxPendingRanges:s=1}){const i=[];let a="active",c=0,l=0,d=[],u=null;function f(){return ce({status:a,
plannerId:t,unit:e,totalItems:n,issuedItems:c,completedItems:l,progress:l/n,maxPendingRanges:s,pendingRangeId:d[0]?.rangeId||
null,pendingRangeIds:d.map(p=>p.rangeId),pendingRangeCount:d.length,rangeCount:i.length,actualRangeCount:a==="complete"?
i.length:null,rangeCountAuthority:a==="complete"?"actual":"open-until-completion",ranges:i,failure:u})}return Object.freeze(
{nextRange(){if(a==="failed")throw new Error("failed planner cannot produce another range");if(a==="complete")return null;
if(d.length>=s)throw new Error(`pending range capacity ${s} must retire before another range is issued`);if(c===n)return null;
const p=c,g=Math.min(o,n-p),m=i.length,h=Je({schema:hs,plannerId:t,rangeId:`${t}:${m}`,rangeIndex:m,rangeTotal:null,rangeCountAuthority:"\
actual-after-completion",unit:e,itemStart:p,itemEnd:p+g,itemCount:g,totalItems:n,completedItemsBefore:p,completedItemsAfter:p+
g,progressBefore:p/n,progressAfter:(p+g)/n,plannedChunkItems:o,metadata:ce(r)});return c=h.itemEnd,d.push(h),i.push({...ce(
h),status:"pending-completion"}),h},completeRange(p,g={}){if(a!=="active"||d.length===0)throw new Error("planner has no \
active range to complete");const m=d[0];if(m.rangeId!==p)throw new Error("range does not match the oldest pending planne\
r range");return l=m.itemEnd,a=l===n?"complete":"active",d.shift(),i[m.rangeIndex]={...i[m.rangeIndex],...ce(g),status:"\
completed"},f()},failRange(p,g,m){if(a!=="active"||d.length===0)return f();const h=d.find(w=>w.rangeId===p);if(!h)throw new Error(
"range does not match a pending planner range");return u={rangeId:p,rangeIndex:h.rangeIndex,phase:g,error:Me(m)},i[h.rangeIndex]=
{...i[h.rangeIndex],status:"failed",failure:ce(u)},d=[],a="failed",f()},snapshot:f})}function _s(t,e){const n=t instanceof
Error?t:new Error(String(t));try{Object.defineProperty(n,"cooperativeExecutionReport",{value:e,configurable:!0,enumerable:!1})}catch{
n.cooperativeExecutionReport=e}return n}function zt(t={}){if(!ys(t))throw new TypeError("cooperative execution input mus\
t be an object");const e=t.runtime,n=t.manifest;if(!e||typeof e!="object")throw new TypeError("runtime must be an object");
if(n?.schema!==gr)throw new TypeError("a cooperative boundary manifest is required");if(e.routeId!==n.routeId)throw new Error(
"cooperative execution runtime route mismatch");if(typeof e.runInvocation!="function")throw new TypeError("runtime.runIn\
vocation must be available");if(!e.queue||typeof e.queue!="object")throw new TypeError("runtime.queue must be available");
if(!bt(t.invocationId))throw new TypeError("invocationId must be a non-empty caller-owned identity");const o=t.schedulingMode||
"cooperative";if(!bs.has(o))throw new TypeError("schedulingMode must be cooperative or disabled");const r=t.completionPolicy||
"strict-prefix";if(!ws.has(r))throw new TypeError("completionPolicy must be strict-prefix or bounded-prefix");if(r==="bo\
unded-prefix"&&o!=="cooperative")throw new TypeError("bounded-prefix completion requires cooperative scheduling");if(r===
"bounded-prefix"){Wn("maxInFlightGpuDuties",t.maxInFlightGpuDuties);const v=n.phases.flatMap(P=>P.boundaries).find(P=>P.
kind==="gpu-command"&&P.chunking.mode==="adaptive");if(v)throw new TypeError(`bounded-prefix completion supports fixed G\
PU boundaries only; ${v.boundaryId} is adaptive`)}else if(t.maxInFlightGpuDuties!=null)throw new TypeError("maxInFlightG\
puDuties is available only with bounded-prefix completion");const s=r==="bounded-prefix"?t.maxInFlightGpuDuties:1;if(t.onProgress!=
null&&typeof t.onProgress!="function")throw new TypeError("onProgress must be a function when provided");if(t.now!=null&&
typeof t.now!="function")throw new TypeError("now must be a function when provided");const i=t.now||(()=>globalThis.performance?.
now?.()??Date.now()),a=t.inferenceControl??null;if(a!=null&&typeof a.runDuty!="function")throw new TypeError("inferenceC\
ontrol must expose runDuty");if(a&&t.signal&&t.signal!==a.signal)throw new TypeError("inferenceControl and execution mus\
t share the same AbortSignal");const c=t.signal||a?.signal||null;if(c!=null&&typeof c.aborted!="boolean")throw new TypeError(
"signal must be an AbortSignal when provided");const l=new Map,d=new Map;for(const v of n.phases)for(const P of v.boundaries)
l.set(P.boundaryId,{phase:v,boundary:P}),d.set(P.boundaryId,{phaseId:v.phaseId,boundaryId:P.boundaryId,kind:P.kind,unit:P.
unit,status:"pending",totalItems:P.totalItems,completedItems:0,progressWeight:P.progressWeight,planner:null,controller:null,
ranges:[],failure:null});const u={status:"pending",startedAtMs:null,endedAtMs:null,failure:null,currentPhaseId:null,currentBoundaryId:null,
schedulerRevision:null,invocationScheduler:null,runCalled:!1,terminalQueueFenceObserved:!1,submittedGpuDutyCount:0,observedPrefixFenceCount:0,
unfencedSubmittedGpuDutyCount:0,gpuDuties:[],inFlightGpuDuties:[],maxObservedInFlightGpuDuties:0};function f(){if(c?.aborted)
throw ks(c)}function p(v){return v.totalItems==null?null:v.completedItems/v.totalItems}function g(){const v=n.phases.map(
U=>{const Y=U.boundaries.map(ee=>d.get(ee.boundaryId)),J=Y.every(ee=>ee.totalItems!=null),X=J?Y.reduce((ee,K)=>ee+K.totalItems,
0):null,V=Y.reduce((ee,K)=>ee+K.completedItems,0),F=J?Y.reduce((ee,K)=>ee+K.progressWeight*p(K),0):null,te=F==null?null:
F/U.progressWeight,j=new Set(Y.map(ee=>ee.status)),Z=j.has("failed")?"failed":j.has("cancelled")?"cancelled":Y.every(ee=>ee.
status==="complete")?"complete":Y.some(ee=>ee.status==="active")?"active":"pending";return{phaseId:U.phaseId,status:Z,completedItems:V,
totalItems:X,progress:te,percent:te==null?null:te*100,completedWeight:F,totalWeight:U.progressWeight}}),P=[...d.values()].
every(U=>U.totalItems!=null),C=[...d.values()].reduce((U,Y)=>U+Y.completedItems,0),B=P?[...d.values()].reduce((U,Y)=>U+Y.
totalItems,0):null,A=P?[...d.values()].reduce((U,Y)=>U+Y.progressWeight*p(Y),0):null,$=A==null?null:A/n.progressWeight;return Je(
{schema:gs,routeId:n.routeId,invocationId:t.invocationId,status:u.status,completedItems:C,totalItems:B,progress:$,percent:$==
null?null:$*100,completedWeight:A,totalWeight:n.progressWeight,currentPhaseId:u.currentPhaseId,currentBoundaryId:u.currentBoundaryId,
phases:v})}function m(v){const P=g();if(t.onProgress)try{t.onProgress(P)}catch(C){throw w(C,"progress-callback",v)}return P}
function h(){const P=[...l.values()].filter(C=>C.boundary.kind==="gpu-command").length===0?"not-applicable":u.submittedGpuDutyCount===
0?"no-gpu-duty-submitted":u.unfencedSubmittedGpuDutyCount>0?"incomplete-prefix-fence-authority":o==="cooperative"?r==="b\
ounded-prefix"?"bounded-per-gpu-duty-prefix-fence":"per-gpu-duty-prefix-fence":u.terminalQueueFenceObserved?"one-termina\
l-prefix-fence":u.observedPrefixFenceCount===u.submittedGpuDutyCount?"exceptional-per-duty-prefix-fence":"terminal-prefi\
x-fence-pending";return Je({schema:Nn,status:u.status,routeId:n.routeId,manifestId:n.manifestId,invocationId:t.invocationId,
schedulingMode:o,completionPolicy:r,maxInFlightGpuDuties:s,maxObservedInFlightGpuDuties:u.maxObservedInFlightGpuDuties,issuedGpuDutyCount:u.
gpuDuties.length,retiredGpuDutyCount:u.gpuDuties.filter(C=>C.status==="retired").length,inFlightGpuDutyCount:u.inFlightGpuDuties.
length,inFlightGpuDutyIds:u.inFlightGpuDuties.map(C=>C.dutyId),gpuDuties:ce(u.gpuDuties),schedulerRevision:u.schedulerRevision,
invocationScheduler:ce(u.invocationScheduler),queueCompletionAuthority:P,submittedGpuDutyCount:u.submittedGpuDutyCount,observedPrefixFenceCount:u.
observedPrefixFenceCount,unfencedSubmittedGpuDutyCount:u.unfencedSubmittedGpuDutyCount,retention:"uncapped",startedAtMs:u.
startedAtMs,endedAtMs:u.endedAtMs,durationMs:u.startedAtMs==null||u.endedAtMs==null?null:u.endedAtMs-u.startedAtMs,progress:g(),
boundaries:n.phases.flatMap(C=>C.boundaries.map(B=>{const A=d.get(B.boundaryId),$=A.planner?.snapshot()||null;return{phaseId:C.
phaseId,boundaryId:B.boundaryId,kind:B.kind,unit:B.unit,status:A.status,completedItems:A.completedItems,totalItems:A.totalItems,
progress:p(A),progressWeight:B.progressWeight,rangeCount:A.ranges.length,actualRangeCount:A.status==="complete"?A.ranges.
length:null,rangeCountAuthority:A.status==="complete"?"actual":"open-until-completion",ranges:ce(A.ranges),planner:ce($),
resources:ce(B.resources),failure:ce(A.failure)}})),runtimeTelemetry:{commandDuties:e.commandDuties?.snapshot?.()||null,
hostPhases:e.hostPhases?.snapshot?.()||null},failure:ce(u.failure),lastTrustworthyBoundary:ce([...d.values()].findLast(C=>C.
ranges.length>0)||null)})}function w(v,P,C=null,B={}){const A=v?.name==="AbortError",$=A?"cancelled":"failed",U=ce(B.secondaryFailures||
[]);return C&&(C.status=$,C.failure={phase:A?"cancellation":P,error:Me(v),secondaryFailures:U}),u.status=$,u.failure={phase:A?
"cancellation":P,boundaryId:C?.boundaryId||null,error:Me(v),secondaryFailures:U},u.endedAtMs=xe(i),_s(v,h())}function b(v,P){
if(!P||typeof P!="object")throw new TypeError("range must be an object");const C=v.planner?.snapshot();if(!(C?.pendingRangeIds||
(C?.pendingRangeId?[C.pendingRangeId]:[])).includes(P.rangeId))throw new Error(`range ${P.rangeId||"<missing>"} is not p\
ending for ${v.boundaryId}`)}function y(v,P,C){v.planner.completeRange(P.rangeId,C);const B=v.planner.snapshot();v.completedItems=
B.completedItems,v.ranges=B.ranges,v.status=B.status==="complete"?"complete":"active"}function _(v,P,C){v.planner.observeRange(
{rangeId:P.rangeId,timingAuthority:"queue-work-done",observedDurationMs:C});const B=v.planner.snapshot();v.completedItems=
B.completedItems,v.ranges=B.ranges,v.status=B.status==="complete"?"complete":"active"}function x(v,P,C,B){const A=v.planner?.
snapshot();(A?.pendingRangeIds||(A?.pendingRangeId?[A.pendingRangeId]:[])).includes(P?.rangeId)&&(v.boundary.chunking.mode===
"adaptive"&&o==="cooperative"?v.planner.failRange({rangeId:P.rangeId,phase:C,error:B}):v.planner.failRange(P.rangeId,C,B),
v.ranges=v.planner.snapshot().ranges)}function k(v,P,C){const B=`${t.invocationId}:${v.boundary.boundaryId}:range`;if(v.
boundary.chunking.mode==="adaptive"&&o==="cooperative")return ms({plannerId:B,unit:v.boundary.unit,totalItems:C,initialChunkItems:v.
boundary.chunking.initialItems,targetDurationMs:v.boundary.chunking.targetDurationMs,adjustmentGain:v.boundary.chunking.
adjustmentGain,bounds:{minChunkItems:v.boundary.chunking.minItems,maxChunkItems:v.boundary.chunking.maxItems},metadata:{
manifestId:n.manifestId,routeId:n.routeId,phaseId:v.phase.phaseId,boundaryId:v.boundary.boundaryId}});const A=v.boundary.
chunking.mode==="adaptive"?v.boundary.chunking.initialItems:v.boundary.chunking.chunkItems;return vs({plannerId:B,unit:v.
boundary.unit,totalItems:C,chunkItems:A,maxPendingRanges:r==="bounded-prefix"&&v.boundary.kind==="gpu-command"?s:1,metadata:{
manifestId:n.manifestId,routeId:n.routeId,phaseId:v.phase.phaseId,boundaryId:v.boundary.boundaryId}})}function R(v,P){u.
gpuDuties[v.dutyIndex]={...u.gpuDuties[v.dutyIndex],...ce(P)}}function E({boundaryId:v,boundaryState:P,range:C,encoded:B,
submittedAtMs:A,prefixFence:$}){const U=u.gpuDuties.length,Y={dutyId:C.rangeId,dutyIndex:U,boundaryState:P,range:C,encoded:B,
submittedAtMs:A,fenceOutcome:Promise.resolve($).then(()=>({ok:!0,completedAtMs:xe(i)}),J=>({ok:!1,error:J,completedAtMs:xe(
i)}))};return u.gpuDuties.push({dutyId:Y.dutyId,rangeId:C.rangeId,rangeIndex:C.rangeIndex,boundaryId:v,status:"issued",submittedAtMs:A,
retiredAtMs:null,rawQueueDurationMs:null,timingAuthority:"queue-work-done-prefix-fence-pending",failure:null}),u.inFlightGpuDuties.
push(Y),u.maxObservedInFlightGpuDuties=Math.max(u.maxObservedInFlightGpuDuties,u.inFlightGpuDuties.length),Y}async function M(){
const v=[];for(;u.inFlightGpuDuties.length>0;){const P=u.inFlightGpuDuties[0],C=await P.fenceOutcome;u.inFlightGpuDuties.
shift(),C.ok?R(P,{status:"retired-after-failure",retiredAtMs:C.completedAtMs,rawQueueDurationMs:C.completedAtMs-P.submittedAtMs,
timingAuthority:"queue-work-done"}):(R(P,{status:"failed",retiredAtMs:C.completedAtMs,rawQueueDurationMs:C.completedAtMs-
P.submittedAtMs,timingAuthority:"queue-work-done-prefix-fence-rejected",failure:Me(C.error)}),v.push({phase:"queue-compl\
etion",dutyId:P.dutyId,error:Me(C.error)}))}return v}async function D(){const v=u.inFlightGpuDuties[0];if(!v)return null;
const P=await v.fenceOutcome;if(u.inFlightGpuDuties.shift(),!P.ok){R(v,{status:"failed",retiredAtMs:P.completedAtMs,rawQueueDurationMs:P.
completedAtMs-v.submittedAtMs,timingAuthority:"queue-work-done-prefix-fence-rejected",failure:Me(P.error)}),x(v.boundaryState,
v.range,"queue-completion",P.error);const C=await M();throw w(P.error,"queue-completion",v.boundaryState,{secondaryFailures:C})}
return y(v.boundaryState,v.range,{timingAuthority:"queue-work-done",observedDurationMs:P.completedAtMs-v.submittedAtMs}),
R(v,{status:"retired",retiredAtMs:P.completedAtMs,rawQueueDurationMs:P.completedAtMs-v.submittedAtMs,timingAuthority:"qu\
eue-work-done"}),m(v.boundaryState),v}async function I(){for(;u.inFlightGpuDuties.length>0;)await D()}function O(v,P={},C){
f();const B=l.get(v);if(!B)throw new Error(`unknown cooperative boundary: ${v}`);const A=d.get(v);if(A.controller)throw new Error(
`cooperative boundary ${v} was already started`);const $=B.boundary.totalItems,U=P.totalItems??$;if(Wn(`${v}.totalItems`,
U),$!=null&&P.totalItems!=null&&P.totalItems!==$)throw new Error(`${v}.totalItems does not match the boundary manifest`);
A.totalItems=U,A.status="active",A.boundary=B.boundary,A.planner=k(B,A,U);async function Y(F){return o!=="cooperative"||
B.boundary.yieldPolicy!=="after-duty"?null:C.yieldToBrowser({reason:r==="bounded-prefix"&&B.boundary.kind==="gpu-command"?
"cooperative-boundary-duty-issued":"cooperative-boundary-duty-complete",metadata:{manifestId:n.manifestId,phaseId:B.phase.
phaseId,boundaryId:v,rangeId:F.rangeId,rangeIndex:F.rangeIndex}})}let J=Promise.resolve();async function X(){const F=J;let te;
return J=new Promise(j=>{te=j}),await F,te}const V={boundaryId:v,kind:B.boundary.kind,unit:B.boundary.unit,nextRange(){f();
const F=A.planner.nextRange();return F&&(A.ranges=A.planner.snapshot().ranges,u.currentPhaseId=B.phase.phaseId,u.currentBoundaryId=
v),F},async runGpuDuty(F,te={}){const j=await X();try{if(f(),r==="bounded-prefix"&&u.inFlightGpuDuties.some(H=>H.boundaryState!==
A)&&await I(),B.boundary.kind!=="gpu-command")throw new Error(`${v} is not a gpu-command boundary`);if(b(A,F),typeof te.
encode!="function"){const H=new TypeError("GPU duty encode must be a function");throw x(A,F,"command-encoding",H),w(H,"c\
ommand-encoding",A)}if(te.submit!=null){const H=new TypeError("GPU duty submit callbacks are unsupported; encode must re\
turn command buffers");throw x(A,F,"command-encoding",H),w(H,"command-encoding",A)}let Z={phase:B.phase.phaseId,kind:B.boundary.
commandDutyKind,metadata:{...ce(B.boundary.metadata),manifestId:n.manifestId,boundaryId:v,rangeId:F.rangeId,rangeIndex:F.
rangeIndex,itemStart:F.itemStart,itemEnd:F.itemEnd,itemCount:F.itemCount,totalItems:F.totalItems,unit:F.unit}},ee=!1,K;try{
if(o==="cooperative"){if(typeof e.prepareCommandDutyAtBoundary!="function")throw new Error("cooperative GPU duties requi\
re runtime.prepareCommandDutyAtBoundary");Z=await e.prepareCommandDutyAtBoundary(Z,C),ee=!0,f()}K=await te.encode({range:F,
commandDuty:Je(ce(Z)),schedulerInvocation:C})}catch(H){const Q=[];if(ee&&typeof e.settleCommandDuty=="function")try{e.settleCommandDuty(
Z,{status:"failed-before-encode",phase:"command-encoding",error:H})}catch(re){Q.push({phase:"scheduler-settlement",error:Me(
re)})}throw x(A,F,"command-encoding",H),w(H,"command-encoding",A,{secondaryFailures:Q})}if(ee&&typeof e.settleCommandDuty==
"function")try{e.settleCommandDuty(Z,{status:"encoded"})}catch(H){throw x(A,F,"scheduler-settlement",H),w(H,"scheduler-s\
ettlement",A)}const se=Array.isArray(K)?[...K]:[K];if(se.length===0||se.some(H=>H==null)){const H=new TypeError("GPU dut\
y encode must return command buffers");throw x(A,F,"command-encoding",H),w(H,"command-encoding",A)}const S=xe(i);let T=null,
L=!1,N=null,W=null;const z=()=>{if(typeof e.queue.onSubmittedWorkDone!="function")throw new Error("GPU duties require qu\
eue.onSubmittedWorkDone");const H=e.queue.onSubmittedWorkDone();if(H==null||typeof H.then!="function")throw new TypeError(
"queue onSubmittedWorkDone must return a Promise");return u.observedPrefixFenceCount+=1,H};try{const H=()=>{if(L)throw new Error(
"command duty recorder attempted duplicate GPU submission");N=S,e.queue.submit(se),L=!0,u.submittedGpuDutyCount+=1,N=xe(
i),o==="cooperative"&&(T=z()),r==="bounded-prefix"&&(W=E({boundaryId:v,boundaryState:A,range:F,encoded:K,submittedAtMs:N,
prefixFence:T}))};if(e.commandDuties?.measureSubmission?await e.commandDuties.measureSubmission(Z,H):H(),!L)throw new Error(
"command duty recorder did not submit GPU work");o==="cooperative"&&r==="strict-prefix"&&await T}catch(H){const Q=[];if(L&&
r==="bounded-prefix"){if(!W)try{T||(T=z()),W=E({boundaryId:v,boundaryState:A,range:F,encoded:K,submittedAtMs:N,prefixFence:T})}catch(re){
u.unfencedSubmittedGpuDutyCount+=1,Q.push({phase:"queue-prefix-drain",error:Me(re)})}throw x(A,F,"queue-submission",H),W&&
Q.push(...await M()),w(H,"queue-submission",A,{secondaryFailures:Q})}if(L)try{T||(T=z()),await T}catch(re){u.unfencedSubmittedGpuDutyCount+=
1,Q.push({phase:"queue-prefix-drain",error:Me(re)})}throw x(A,F,"queue-submission",H),w(H,"queue-submission",A,{secondaryFailures:Q})}
if(r==="bounded-prefix"){try{await Y(F)}catch(Q){x(A,F,"browser-yield",Q);const re=await M();throw w(Q,"browser-yield",A,
{secondaryFailures:re})}const H=u.inFlightGpuDuties.length>=s?await D():null;return{range:F,encoded:K,queueCompletionAuthority:"\
bounded-prefix-fence",settledRangeId:H?.range.rangeId||null}}const ne=xe(i);B.boundary.chunking.mode==="adaptive"&&o==="\
cooperative"?_(A,F,ne-S):y(A,F,{timingAuthority:o==="cooperative"?"queue-work-done":"host-submit-call-only",observedDurationMs:ne-
S});try{await Y(F)}catch(H){throw w(H,"browser-yield",A)}return m(A),{range:F,encoded:K,queueCompletionAuthority:T?"imme\
diate-prefix-fence":"terminal-prefix-fence-pending"}}finally{j()}},async runCpuDuty(F,te={}){if(f(),B.boundary.kind!=="c\
pu-work")throw new Error(`${v} is not a cpu-work boundary`);if(typeof te.work!="function")throw new TypeError("CPU duty \
work must be a function");b(A,F),r==="bounded-prefix"&&(await I(),f());const j=xe(i);try{const Z=()=>te.work({range:F,schedulerInvocation:C});
e.hostPhases&&typeof e.runHostPhase=="function"?await e.runHostPhase(B.boundary.hostPhase,Z,{detail:{manifestId:n.manifestId,
boundaryId:v,rangeId:F.rangeId,rangeIndex:F.rangeIndex,itemStart:F.itemStart,itemEnd:F.itemEnd,totalItems:F.totalItems,unit:F.
unit}}):await Z()}catch(Z){throw x(A,F,"cpu-work",Z),w(Z,"cpu-work",A)}y(A,F,{timingAuthority:"host-work-call",observedDurationMs:xe(
i)-j});try{await Y(F)}catch(Z){throw w(Z,"browser-yield",A)}return m(A),{range:F}},snapshot(){return Je(ce({phaseId:B.phase.
phaseId,boundaryId:v,status:A.status,totalItems:A.totalItems,completedItems:A.completedItems,progress:p(A),ranges:A.ranges}))}};
if(a)for(const F of["runGpuDuty","runCpuDuty"]){const te=V[F];V[F]=(...j)=>a.runDuty(()=>te(...j))}return Object.freeze(
V),A.controller=V,V}async function G(v){if(typeof v!="function")throw new TypeError("cooperative execution run requires \
a function");if(u.runCalled)throw new Error("cooperative execution can run only once");u.runCalled=!0,u.status="running",
u.startedAtMs=xe(i);try{f();const P=await e.runInvocation({invocationId:t.invocationId},async B=>(u.schedulerRevision=B.
schedulerRevision??null,u.invocationScheduler=ce(B.scheduler||null),v(Object.freeze({invocationId:t.invocationId,schedulingMode:o,
schedulerInvocation:B,startBoundary(A,$={}){return O(A,$,B)},progress:g,throwIfCancelled:f}))));r==="bounded-prefix"&&await I(),
f();const C=[...d.values()].filter(B=>B.status!=="complete").map(B=>B.boundaryId);if(C.length>0)throw new Error(`incompl\
ete cooperative boundaries: ${C.join(", ")}`);if(o==="disabled"&&[...l.values()].some(B=>B.boundary.kind==="gpu-command")){
if(typeof e.queue.onSubmittedWorkDone!="function")throw new Error("disabled scheduling A/B requires a terminal queue.onS\
ubmittedWorkDone fence");const B=e.queue.onSubmittedWorkDone();if(B==null||typeof B.then!="function")throw new TypeError(
"queue onSubmittedWorkDone must return a Promise");await B,u.terminalQueueFenceObserved=!0}return u.status="succeeded",u.
currentPhaseId=null,u.currentBoundaryId=null,u.endedAtMs=xe(i),P}catch(P){if(r==="bounded-prefix"&&u.inFlightGpuDuties.length>
0){const C=P?.cooperativeExecutionReport||null,B=C?.failure?.phase||(P?.name==="AbortError"?"cancellation":"completion"),
A=d.get(C?.failure?.boundaryId)||u.inFlightGpuDuties[0]?.boundaryState||null,$=u.inFlightGpuDuties[0];A&&$&&x(A,$.range,
B,P);const U=[...C?.failure?.secondaryFailures||[],...await M()];throw w(P,B,A,{secondaryFailures:U})}throw P?.cooperativeExecutionReport?
P:w(P,P?.name==="AbortError"?"cancellation":"completion")}}return Object.freeze({schema:Nn,routeId:n.routeId,manifestId:n.
manifestId,invocationId:t.invocationId,schedulingMode:o,completionPolicy:r,maxInFlightGpuDuties:s,run:G,progress:g,snapshot:h,
finish(){if(u.status!=="succeeded"&&u.status!=="failed"&&u.status!=="cancelled")throw new Error("cooperative execution c\
annot finish before run settles");return h()}})}globalThis.GPUBufferUsage?.MAP_READ,globalThis.GPUBufferUsage?.COPY_SRC,
globalThis.GPUBufferUsage?.COPY_DST,globalThis.GPUBufferUsage?.STORAGE,globalThis.GPUBufferUsage?.UNIFORM;const br=`
fn mlx_expm1f(x: f32) -> f32 {
  var j = fma(1.442695, x, 12582912.0);
  j = j - 12582912.0;
  let exponent = i32(j);
  let reduced = fma(j, -6.93145752e-1, x);
  var squared = reduced * reduced;
  if (x == 0.0) { squared = x; }
  var polynomial = 1.97350979e-4;
  polynomial = fma(polynomial, reduced, 1.39309070e-3);
  polynomial = fma(polynomial, reduced, 8.33343994e-3);
  polynomial = fma(polynomial, reduced, 4.16668020e-2);
  polynomial = fma(polynomial, reduced, 1.66666716e-1);
  polynomial = fma(polynomial, reduced, 4.99999970e-1);
  let base = select(reduced, reduced + 0.5, j == 1.0);
  let approximation = fma(polynomial, squared, base);
  let half = 0.5;
  let scaled = ldexp(half, exponent);
  let high = scaled - half;
  let low = (scaled - high) - half;
  var result = fma(approximation, scaled, low) + high;
  result = result + result;
  if (j == 0.0) { result = approximation; }
  if (j == 1.0) { result = approximation + approximation; }
  if (abs(x - 1.0) > 88.0) {
    let power = exp2(x);
    result = fma(power, power, -1.0);
  }
  return result;
}

fn mlx_erf(x: f32) -> f32 {
  let magnitude = abs(x);
  let squared = x * x;
  var result: f32;
  if (magnitude > 0.927734375) {
    result = fma(-1.72853470e-5, magnitude, 3.83197126e-4);
    let companion = fma(-3.88396438e-3, magnitude, 2.42546219e-2);
    result = fma(result, squared, companion);
    result = fma(result, magnitude, -1.06777877e-1);
    result = fma(result, magnitude, -6.34846687e-1);
    result = fma(result, magnitude, -1.28717512e-1);
    result = fma(result, magnitude, -magnitude);
    result = -mlx_expm1f(result);
    result = select(-abs(result), abs(result), x >= 0.0);
  } else {
    result = -5.96761703e-4;
    result = fma(result, squared, 4.99119423e-3);
    result = fma(result, squared, -2.67681349e-2);
    result = fma(result, squared, 1.12819925e-1);
    result = fma(result, squared, -3.76125336e-1);
    result = fma(result, squared, 1.28379166e-1);
    result = fma(result, x, x);
  }
  return result;
}

fn gelu_exact_approx(x: f32) -> f32 {
  if (x < -10.0) { return 0.0; }
  if (x > 10.0) { return x; }
  return 0.5 * x * (1.0 + mlx_erf(x * 0.7071067811865476));
}
`;function wt({activation:t,helpers:e="",variant:n="sequential4"}){return go({variant:n,activationExpression:t,activationHelpers:e})}
wt({activation:"value"});wt({activation:"max(value, 0.0)"});wt({activation:"gelu_exact_approx(value)",helpers:br});wt({activation:"\
value",variant:"sequential4-range"});wt({activation:"gelu_exact_approx(value)",helpers:br,variant:"sequential4-range"});
const Is=Float32Array.from({length:256},(t,e)=>Math.fround(Math.fround(e/127.5)-1));`${Array.from(Is,t=>t.toPrecision(17)).
join(", ")}`;const xs=`
struct AttentionDims {
  batch: u32,
  query_tokens: u32,
  key_tokens: u32,
  channels: u32,
  heads: u32,
  head_dim: u32,
  total_output: u32,
};`,wr=`
struct AttentionDims {
  batch: u32,
  query_tokens: u32,
  key_tokens: u32,
  channels: u32,
  heads: u32,
  head_dim: u32,
  total_output: u32,
  mask_mode: u32,
};`,Ss=`
struct TextDims {
  batch: u32,
  prompt_tokens: u32,
  hidden_size: u32,
  channels: u32,
  intermediate_size: u32,
  heads: u32,
  head_dim: u32,
  total_hidden: u32,
};`,Bs=`
struct PromptFpnDims {
  batch: u32,
  spatial_tokens: u32,
  prompt_tokens: u32,
  channels: u32,
  heads: u32,
  head_dim: u32,
  total_encoder: u32,
  total_prompt: u32,
};`,Es=`
struct BlockDims {
  batch: u32,
  height: u32,
  width: u32,
  channels: u32,
  heads: u32,
  head_dim: u32,
  window_size: u32,
  intermediate_size: u32,
  padded_height: u32,
  padded_width: u32,
  windows_per_row: u32,
  window_count: u32,
  window_tokens: u32,
  total_values: u32,
  padded_total_values: u32,
  _pad0: u32,
};`;function As(){const t=[];for(let e=0;e<64;e+=1)t.push(`var product_${e} = 0.0;`),t.push(`if (${e}u < dims.head_dim) \
{`),t.push(`  product_${e} = q_values[q_base + ${e}u] * k_values[k_base + ${e}u];`),t.push("}");for(let e=32;e>=1;e/=2)for(let n=0;n<
e;n+=1)t.push(`product_${n} = product_${n} + product_${n+e};`);return t.join(`
      `)}function Te({dimsStruct:t,dimsType:e,extraBinding:n="",outputBinding:o=3,uniformBinding:r=4,queryTokens:s,keyTokens:i,
channels:a,domainCount:c="dims.batch",qBase:l,kBase:d,vIndex:u,scoreAdjustment:f="",queryOffset:p=""}){return`${t}

@group(0) @binding(0) var<storage, read> q_values: array<f32>;
@group(0) @binding(1) var<storage, read> k_values: array<f32>;
@group(0) @binding(2) var<storage, read> v_values: array<f32>;
${n}
@group(0) @binding(${o}) var<storage, read_write> output_values: array<f32>;
@group(0) @binding(${r}) var<uniform> dims: ${e};

var<workgroup> scores: array<f32, 64>;
var<workgroup> old_scales: array<f32, 64>;
var<workgroup> token_scales: array<f32, 64>;
var<workgroup> state: array<f32, 2>;

@compute @workgroup_size(64)
fn main(
  @builtin(local_invocation_index) dimension: u32,
  @builtin(workgroup_id) workgroup: vec3<u32>,
) {
  let query = workgroup.x${p};
  let head = workgroup.y;
  let batch = workgroup.z;
  if (
    dims.head_dim > 64u ||
    query >= ${s} ||
    head >= dims.heads ||
    batch >= ${c}
  ) { return; }

  let head_offset = head * dims.head_dim;
  let q_base = ${l};
  let scale = inverseSqrt(f32(dims.head_dim));
  var accumulator = 0.0;

  if (dimension == 0u) {
    state[0] = -3.402823e38;
    state[1] = 0.0;
  }
  workgroupBarrier();

  // Each lane scores one key. Keep the original reduction tree and token-order
  // recurrence, but synchronize once per tile instead of per key/dimension.
  for (var tile_start = 0u; tile_start < ${i}; tile_start = tile_start + 64u) {
    let tile_count = min(64u, ${i} - tile_start);
    let token = tile_start + dimension;
    if (dimension < tile_count) {
      let k_base = ${d};
      ${As()}
      var score = product_0 * scale;
      ${f}
      scores[dimension] = score;
    }
    workgroupBarrier();

    if (dimension == 0u) {
      for (var offset = 0u; offset < tile_count; offset = offset + 1u) {
        let next_max = max(state[0], scores[offset]);
        old_scales[offset] = exp(state[0] - next_max);
        token_scales[offset] = exp(scores[offset] - next_max);
        state[0] = next_max;
        state[1] = state[1] * old_scales[offset] + token_scales[offset];
      }
    }
    workgroupBarrier();

    if (dimension < dims.head_dim) {
      for (var offset = 0u; offset < tile_count; offset = offset + 1u) {
        let token = tile_start + offset;
        accumulator = accumulator * old_scales[offset] + token_scales[offset] * v_values[${u}];
      }
    }
    workgroupBarrier();
  }

  if (dimension < dims.head_dim) {
    output_values[${l} + dimension] = accumulator / state[1];
  }
}`}const yt={dimsStruct:xs,dimsType:"AttentionDims",queryTokens:"dims.query_tokens",keyTokens:"dims.key_tokens",channels:"\
dims.channels",qBase:"(batch * dims.query_tokens + query) * dims.channels + head_offset",kBase:"(batch * dims.key_tokens\
 + token) * dims.channels + head_offset",vIndex:"(batch * dims.key_tokens + token) * dims.channels + head_offset + dimen\
sion"};Te(yt);Te({...yt,extraBinding:`
struct QueryRange { query_offset: u32, };
@group(0) @binding(5) var<uniform> query_range: QueryRange;`,queryOffset:" + query_range.query_offset"});Te({...yt,extraBinding:"\
@group(0) @binding(3) var<storage, read> key_mask: array<f32>;",outputBinding:4,uniformBinding:5,scoreAdjustment:`if (ke\
y_mask[batch * dims.key_tokens + token] <= 0.0) {
        score = score - 1000000000.0;
      }`});Te({...yt,dimsStruct:wr,extraBinding:"@group(0) @binding(3) var<storage, read> key_mask: array<f32>;",outputBinding:4,
uniformBinding:5,scoreAdjustment:`if (dims.mask_mode == 1u && key_mask[batch * dims.key_tokens + token] <= 0.0) {
        score = score - 1000000000.0;
      }`});Te({...yt,dimsStruct:wr,extraBinding:"@group(0) @binding(3) var<storage, read> bias_values: array<f32>;",outputBinding:4,
uniformBinding:5,scoreAdjustment:"score = score + bias_values[((batch * dims.heads + head) * dims.query_tokens + query) \
* dims.key_tokens + token];"});Te({dimsStruct:Ss,dimsType:"TextDims",extraBinding:"@group(0) @binding(3) var<storage, re\
ad> prompt_mask: array<f32>;",outputBinding:4,uniformBinding:5,queryTokens:"dims.prompt_tokens",keyTokens:"dims.prompt_t\
okens",channels:"dims.hidden_size",qBase:"(batch * dims.prompt_tokens + query) * dims.hidden_size + head_offset",kBase:"\
(batch * dims.prompt_tokens + token) * dims.hidden_size + head_offset",vIndex:"(batch * dims.prompt_tokens + token) * di\
ms.hidden_size + head_offset + dimension",scoreAdjustment:`if (token > query || prompt_mask[batch * dims.prompt_tokens +\
 token] <= 0.0) {
        score = -1000000000.0;
      }`});Te({dimsStruct:Bs,dimsType:"PromptFpnDims",extraBinding:"@group(0) @binding(3) var<storage, read> prompt_mask\
: array<f32>;",outputBinding:4,uniformBinding:5,queryTokens:"dims.spatial_tokens",keyTokens:"dims.prompt_tokens",channels:"\
dims.channels",qBase:"(batch * dims.spatial_tokens + query) * dims.channels + head_offset",kBase:"(batch * dims.prompt_t\
okens + token) * dims.channels + head_offset",vIndex:"(batch * dims.prompt_tokens + token) * dims.channels + head_offset\
 + dimension",scoreAdjustment:`if (prompt_mask[batch * dims.prompt_tokens + token] <= 0.0) {
        score = score - 1000000000.0;
      }`});const yr={dimsStruct:Es,dimsType:"BlockDims",queryTokens:"dims.window_tokens",keyTokens:"dims.window_tokens",
channels:"dims.channels",domainCount:"dims.batch * dims.window_count",qBase:"(batch * dims.window_tokens + query) * dims\
.channels + head_offset",kBase:"(batch * dims.window_tokens + token) * dims.channels + head_offset",vIndex:"(batch * dim\
s.window_tokens + token) * dims.channels + head_offset + dimension"};Te(yr);Te({...yr,extraBinding:`
struct QueryRange { query_offset: u32, };
@group(0) @binding(5) var<uniform> query_range: QueryRange;`,queryOffset:" + query_range.query_offset"});Object.freeze([
["M","u32"],["N","u32"],["K","u32"],["alpha","f32"],["a_off","u32"],["a_sm","u32"],["a_sk","u32"],["a_sb","u32"],["b_off",
"u32"],["b_sk","u32"],["b_sn","u32"],["b_sb","u32"],["c_off","u32"],["c_sm","u32"],["c_sn","u32"],["c_sb","u32"],["pad_t\
op","u32"],["pad_left","u32"],["n_base","u32"],["z1","u32"]].map(([t,e])=>Object.freeze({name:t,type:e})));const Ps=["lo\
ad-image-fpn-neck-tensors","fpn-neck-transpose-conv-0-scale0","fpn-neck-gelu-0","fpn-neck-transpose-conv-0-scale1","fpn-\
neck-proj1-0","fpn-neck-proj2-0","fpn-neck-transpose-conv-1","fpn-neck-proj1-1","fpn-neck-proj2-1","fpn-neck-proj1-2","f\
pn-neck-proj2-2","fpn-neck-maxpool-3","fpn-neck-proj1-3","fpn-neck-proj2-3","readback-fpn-neck-features"];Ps.filter(t=>!t.
endsWith("-3"));const Cs=["load-memory-encoder-tensors","memory-mask-resample","memory-mask-downsample-0","memory-mask-d\
ownsample-0-layernorm","memory-mask-downsample-0-gelu","memory-mask-downsample-1","memory-mask-downsample-1-layernorm","\
memory-mask-downsample-1-gelu","memory-mask-downsample-2","memory-mask-downsample-2-layernorm","memory-mask-downsample-2\
-gelu","memory-mask-downsample-3","memory-mask-downsample-3-layernorm","memory-mask-downsample-3-gelu","memory-mask-fina\
l-projection","memory-feature-projection","memory-feature-mask-add","memory-fuser-0-depthwise","memory-fuser-0-layernorm",
"memory-fuser-0-pointwise-1-gelu","memory-fuser-0-pointwise-2-scale-residual","memory-fuser-1-depthwise","memory-fuser-1\
-layernorm","memory-fuser-1-pointwise-1-gelu","memory-fuser-1-pointwise-2-scale-residual","memory-no-object-spatial-add",
"memory-position-encoding","readback-memory-encoder-features"];Object.freeze({layout:"B,H,W,C",sourceLayout:"B,C,H,W",maskLogitsLayout:"\
B,M,H,W",maskChannels:"multiplex mask channels followed by multiplex conditioning channels",requiredStages:Cs,bufferUsage:Xt.
storage|Xt.copyDst|Xt.copySrc,shaderVisibility:yo.compute});const tn=Object.freeze({modelId:"facebook/sam3.1",modelRevision:"\
daa63191845a41281374e725f4c9e51c7a824460",checkpointSha256:"sha256:0567debeec80ba4ac6369540c6c248025283cb3ff2b92827509e5\
7e2b3541cb6",sourceRepository:"facebookresearch/sam3",sourceCommit:"5dd401d1c5c1d5c3eedff06d41b77af824517619"});Object.freeze(
{manifestSchema:"kaminos.sam31-two-image-ingress-meta-packet.v0",receiptSchema:"kaminos.sam31-two-image-ingress-meta-ref\
erence-receipt.v0",boundary:"sam31-two-distinct-raw-images-to-interactive-propagation-backbone-features",modelId:"facebo\
ok/sam3.1",modelRevision:tn.modelRevision,checkpointSha256:tn.checkpointSha256,sourceCommit:tn.sourceCommit,routeIds:Object.
freeze(["sam3.image-preprocess.phase-program.webgpu-local.v0","sam3.image-patch-embed.phase-program.webgpu-local.v0","sa\
m3.image-vit-prefix.phase-program.webgpu-local.v0","sam3.image-vit-block-stack.phase-program.webgpu-local.v0","sam3.1.in\
teractive-neck.phase-program.webgpu-local.v0","sam3.1.image-propagation-neck.phase-program.webgpu-local.v0","sam3.1.deco\
der-high-resolution-projection.phase-program.webgpu-local.v0"])});const Ms=Object.freeze({batch:1,multiplexCount:16,queryHeight:2,
queryWidth:2,queryTokens:4,memorySpatialTokens:4,numObjPtrTokens:16,memoryTokens:20,channels:256,maskHeight:8,maskWidth:8,
sourceImageHeight:28,sourceImageWidth:28,sourceMaskHeight:32,sourceMaskWidth:32,promptMaskHeight:8,promptMaskWidth:8,decoderMaskHeight:8,
decoderMaskWidth:8,memoryInputMaskHeight:8,memoryInputMaskWidth:8});Object.freeze({...Ms,memoryInputMaskHeight:32,memoryInputMaskWidth:32});
const Ue="sf3d.image-to-mesh.webgpu-local.v0",Ds="stabilityai/stable-fast-3d",Rs=[{key:"meshGlb",role:"mesh-glb",required:!0},
{key:"albedoTexture",role:"albedo-texture",required:!0},{key:"normalMap",role:"normal-map",required:!0},{key:"meshObj",role:"\
mesh-obj",required:!1}];function Ts(t){if(!t||typeof t!="object")throw new Error("input must be an object");if(!t.input?.
artifactId||!t.input?.sha256)throw new Error("input image artifactId and sha256 are required");if(!t.outputs?.meshGlb)throw new Error(
"meshGlb output is required");if(!t.outputs?.albedoTexture)throw new Error("albedoTexture output is required");if(!t.outputs?.
normalMap)throw new Error("normalMap output is required");return Wo({requestedRouteId:Ue,effectiveRouteId:t.effectiveRouteId||
Ue,status:t.status||(t.fallbackReason?"fallback":"real"),fallbackReason:t.fallbackReason||null,backend:t.backend,model:{
id:Ds,revision:t.model?.revision,weightsHash:t.model?.weightsHash,dtype:t.model?.dtype||"fp16"},kernel:Do(t.kernel,{requireProfile:!0}),
inputs:[Fo("source-image",t.input)],outputs:qo({artifacts:t.outputs,roles:Rs}),profile:t.profile})}const Xe="sf3d.image-\
to-mesh.webgpu-local.v0",$s="sf3d.dino-encoder-cooperative-boundaries.v0",kr="dino-vit-blocks";function Os(t,e=1){if(!Number.
isSafeInteger(t)||t<=0)throw new TypeError("numBlocks must be a positive safe integer");if(!Number.isSafeInteger(e)||e<=
0)throw new TypeError("chunkBlocks must be a positive safe integer");return ut({manifestId:$s,routeId:Xe,phases:[{phaseId:"\
dinov2-tokenizer",boundaries:[{boundaryId:kr,kind:"gpu-command",unit:"vit-block",totalItems:t,progressWeight:t,commandDutyKind:"\
compute",chunking:{mode:"fixed",chunkItems:e},yieldPolicy:"after-duty",resources:{retain:["dinov2.weights"],produce:["di\
nov2.tokens"],release:[]}}]}],metadata:{source:"sf3d-webgpu-cooperative-dino-uptake"}})}function Nt(t,e={}){const n=()=>globalThis.
performance?.now?.()??Date.now(),o=e.foregroundOpportunities??null;if(o!=null){for(const a of["serviceAtBoundary","snaps\
hot"])if(typeof o[a]!="function")throw new Error(`foregroundOpportunities must expose ${a}()`)}let r=0;const s=a=>a.pendingRequestCount>
0||a.activeRequestCount>0||a.activeServiceCount>0||a.queuedServiceCount>0;return{routeId:Xe,runtimeLabel:"sf3d-webgpu-co\
operative-dino",queue:{submit(a){t.queue.submit(a)},async onSubmittedWorkDone(){const a=n(),c=await t.queue.onSubmittedWorkDone(),
l=n();return typeof e.onQueueFenceResolved=="function"&&await e.onQueueFenceResolved({startedAtMs:a,completedAtMs:l,queueWaitMs:l-
a}),c}},hostPhases:{snapshot(){return{status:"not-instrumented",phase:"dinov2-tokenizer"}}},commandDuties:{async measureSubmission(a,c){
return c()}},foregroundOpportunities:o,async prepareCommandDutyAtBoundary(a,c=null){if(!o)return a;const l=typeof o.pressureSnapshot==
"function"?o.pressureSnapshot():o.snapshot();if(!s(l))return a;const d=c?.invocationId;if(typeof d!="string"||!d.trim())
throw new Error("foreground opportunity service requires an active invocation identity");r+=1;const u=await o.serviceAtBoundary(
{invocationId:d,boundaryId:`${d}:foreground-boundary:${r}`,dutyId:a?.dutyId||`${d}:command-duty:${r}`,phase:a?.phase||"s\
f3d-cooperative-duty",position:"before-encode",metadata:{runtimeLabel:"sf3d-webgpu-cooperative",schedulerRevision:c.schedulerRevision??
null}}),f={...a,metadata:{...a?.metadata||{},foregroundOpportunityService:u}};if(u.status==="failed"){const p=u.failures?.[0];
throw new Error(p?.failure?.error?.message||"foreground opportunity failed")}return f},settleCommandDuty(){},async runInvocation({
invocationId:a},c){return c({invocationId:a,schedulerRevision:null,scheduler:{mode:"cooperative",yieldMs:0,waitForSubmittedWorkDone:!0,
phaseChunkSize:{}},async yieldToBrowser(){const l=n();await Gs();const d=n(),u={reason:"cooperative-boundary-duty-comple\
te",elapsedMs:d-l};return typeof e.onBrowserYield=="function"&&await e.onBrowserYield({startedAtMs:l,completedAtMs:d,elapsedMs:d-
l}),u}})}}}function Gs(){return typeof MessageChannel=="function"?new Promise(t=>{const e=new MessageChannel;e.port1.onmessage=
()=>{e.port1.close(),t()},e.port2.postMessage(null)}):new Promise(t=>setTimeout(t,0))}async function Fs(t){const{device:e,
tokenizer:n,imageBuf:o,cameraEmbedBuf:r,weights:s,numBlocks:i,chunkBlocks:a=1,schedulingMode:c="cooperative",onProgress:l,
signal:d,invocationId:u=`sf3d:dino:${c}`}=t;if(t.withChunkWeights!=null&&c!=="cooperative")throw Error("phase weight res\
idency requires cooperative queue-prefix fences");const f=Os(i,a),p=Nt(e,{foregroundOpportunities:t.foregroundOpportunities??
null}),g=zt({runtime:p,manifest:f,invocationId:u,schedulingMode:c,onProgress:l,signal:d});let m=null;return await g.run(
async h=>{m=await qs(h,{encodeChunk:({blockStart:w,blockEnd:b,encodeInto:y})=>{const _=e.createCommandEncoder({label:`di\
no-blocks-${w}-${b}`});return y(_),_.finish()},encodeTokenizer:w=>n.encodeCooperative({imageBuf:o,cameraEmbedBuf:r,weights:s,
numBlocks:i,chunkBlocks:a,driver:w,withChunkWeights:t.withChunkWeights??null,retireIntermediateBuffers:t.retireIntermediateBuffers===
!0})})}),{result:m,report:g.finish()}}async function qs(t,e){const{encodeChunk:n,encodeTokenizer:o}=e,r=t.startBoundary(
kr),i=await o(async(a,c,l)=>{const d=r.nextRange();if(!d)throw new Error(`cooperative DINO boundary exhausted ranges bef\
ore block ${a}`);await r.runGpuDuty(d,{encode(){return n({blockStart:a,blockEnd:c,encodeInto:l})}})});if(r.nextRange()!=
null)throw new Error("cooperative DINO boundary left ranges unconsumed");return i}const zs=`// Row-range linear projecti\
on: output[row] = input[row] @ weight + bias.
// The accumulation order and weight layout match linear.wgsl exactly.

struct Params {
  totalRows: u32,
  inDim: u32,
  outDim: u32,
  rowStart: u32,
  rowCount: u32,
  numWorkgroupsX: u32,
  transposed: u32,
  _padding: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let localIdx = linearWG * WG_SIZE + lid.x;
  if (localIdx >= params.rowCount * params.outDim) { return; }

  let localRow = localIdx / params.outDim;
  let col = localIdx % params.outDim;
  let row = params.rowStart + localRow;
  if (row >= params.totalRows) { return; }
  let idx = row * params.outDim + col;

  var s0 = 0.0;
  var s1 = 0.0;
  var s2 = 0.0;
  var s3 = 0.0;
  let inBase = row * params.inDim;
  let len4 = (params.inDim / 4u) * 4u;

  if (params.transposed == 1u) {
    let wBase = col;
    let stride = params.outDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * weight[(k)      * stride + wBase];
      s1 += input[inBase + k + 1u] * weight[(k + 1u) * stride + wBase];
      s2 += input[inBase + k + 2u] * weight[(k + 2u) * stride + wBase];
      s3 += input[inBase + k + 3u] * weight[(k + 3u) * stride + wBase];
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * weight[k * stride + wBase];
    }
  } else {
    let wBase = col * params.inDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * weight[wBase + k];
      s1 += input[inBase + k + 1u] * weight[wBase + k + 1u];
      s2 += input[inBase + k + 2u] * weight[wBase + k + 2u];
      s3 += input[inBase + k + 3u] * weight[wBase + k + 3u];
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * weight[wBase + k];
    }
  }
  output[idx] = (s0 + s1) + (s2 + s3) + bias[col];
}
`,Ns=`/**
 * Cross-attention compute shader.
 *
 * Computes attention where Q comes from one sequence and K,V from another.
 * Used in SF3D's FuseBlock (fuse triplane ↔ image tokens) and
 * BasicBlock's attn2 (cross-attend latents to encoder hidden states).
 *
 * Three entry points matching the self-attention pattern:
 *   - computeCrossScores: Q·K^T with scaling
 *   - softmaxCross: row-wise softmax (same as self-attention)
 *   - applyCrossAttn: scores @ V
 */

struct Params {
  N_q: u32,     // query sequence length
  N_kv: u32,    // key/value sequence length
  D: u32,       // head dimension
  numHeads: u32,
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> Q: array<f32>;       // [N_q, numHeads, D]
@group(0) @binding(2) var<storage, read> K: array<f32>;       // [N_kv, numHeads, D]
@group(0) @binding(3) var<storage, read> V: array<f32>;       // [N_kv, numHeads, D]
@group(0) @binding(4) var<storage, read_write> scores: array<f32>; // [numHeads, N_q, N_kv]
@group(0) @binding(5) var<storage, read_write> output: array<f32>; // [N_q, numHeads, D]

const WG_SIZE: u32 = 256;

/**
 * Compute cross-attention scores: score[h, qi, ki] = Q[qi, h, :] · K[ki, h, :] / sqrt(D)
 */
@compute @workgroup_size(WG_SIZE)
fn computeCrossScores(@builtin(global_invocation_id) gid: vec3<u32>,
                      @builtin(workgroup_id) wgid: vec3<u32>,
                      @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let totalScores = params.numHeads * params.N_q * params.N_kv;
  if (idx >= totalScores) { return; }

  let h = idx / (params.N_q * params.N_kv);
  let rem = idx % (params.N_q * params.N_kv);
  let qi = rem / params.N_kv;
  let ki = rem % params.N_kv;

  let D = params.D;
  let scale = 1.0 / sqrt(f32(D));

  // Q layout: [N_q, numHeads, D] → Q[qi * numHeads * D + h * D + d]
  // K layout: [N_kv, numHeads, D] → K[ki * numHeads * D + h * D + d]
  let qBase = qi * params.numHeads * D + h * D;
  let kBase = ki * params.numHeads * D + h * D;

  // 4-way split accumulation
  var s0: f32 = 0.0; var s1: f32 = 0.0;
  var s2: f32 = 0.0; var s3: f32 = 0.0;
  let steps = D / 4u;
  for (var i: u32 = 0u; i < steps; i++) {
    let d = i * 4u;
    s0 += Q[qBase + d]     * K[kBase + d];
    s1 += Q[qBase + d + 1] * K[kBase + d + 1];
    s2 += Q[qBase + d + 2] * K[kBase + d + 2];
    s3 += Q[qBase + d + 3] * K[kBase + d + 3];
  }
  // Handle remainder
  let rem_start = steps * 4u;
  var s_rem: f32 = 0.0;
  for (var d = rem_start; d < D; d++) {
    s_rem += Q[qBase + d] * K[kBase + d];
  }

  let dot = ((s0 + s1) + (s2 + s3)) + s_rem;

  // scores layout: [numHeads, N_q, N_kv]
  scores[h * params.N_q * params.N_kv + qi * params.N_kv + ki] = dot * scale;
}

/**
 * Row-wise softmax over KV dimension.
 * One thread per (head, query) row.
 */
@compute @workgroup_size(WG_SIZE)
fn softmaxCross(@builtin(global_invocation_id) gid: vec3<u32>,
                @builtin(workgroup_id) wgid: vec3<u32>,
                @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let totalRows = params.numHeads * params.N_q;
  if (idx >= totalRows) { return; }

  let base = idx * params.N_kv;

  // Find max
  var maxVal: f32 = scores[base];
  for (var i: u32 = 1u; i < params.N_kv; i++) {
    maxVal = max(maxVal, scores[base + i]);
  }

  // Exp and sum
  var sumExp: f32 = 0.0;
  for (var i: u32 = 0u; i < params.N_kv; i++) {
    let e = exp(scores[base + i] - maxVal);
    scores[base + i] = e;
    sumExp += e;
  }

  // Normalize
  let invSum = 1.0 / sumExp;
  for (var i: u32 = 0u; i < params.N_kv; i++) {
    scores[base + i] *= invSum;
  }
}

/**
 * Apply cross-attention: output[qi, h, d] = sum_ki scores[h, qi, ki] * V[ki, h, d]
 */
@compute @workgroup_size(WG_SIZE)
fn applyCrossAttn(@builtin(global_invocation_id) gid: vec3<u32>,
                  @builtin(workgroup_id) wgid: vec3<u32>,
                  @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let totalOut = params.N_q * params.numHeads * params.D;
  if (idx >= totalOut) { return; }

  let qi = idx / (params.numHeads * params.D);
  let rem = idx % (params.numHeads * params.D);
  let h = rem / params.D;
  let d = rem % params.D;

  let scoreBase = h * params.N_q * params.N_kv + qi * params.N_kv;

  // 4-way accumulation over KV positions
  var s0: f32 = 0.0; var s1: f32 = 0.0;
  var s2: f32 = 0.0; var s3: f32 = 0.0;
  let steps = params.N_kv / 4u;
  for (var i: u32 = 0u; i < steps; i++) {
    let ki = i * 4u;
    // V layout: [N_kv, numHeads, D]
    s0 += scores[scoreBase + ki]     * V[(ki)     * params.numHeads * params.D + h * params.D + d];
    s1 += scores[scoreBase + ki + 1] * V[(ki + 1) * params.numHeads * params.D + h * params.D + d];
    s2 += scores[scoreBase + ki + 2] * V[(ki + 2) * params.numHeads * params.D + h * params.D + d];
    s3 += scores[scoreBase + ki + 3] * V[(ki + 3) * params.numHeads * params.D + h * params.D + d];
  }
  let rem_start = steps * 4u;
  var s_rem: f32 = 0.0;
  for (var ki = rem_start; ki < params.N_kv; ki++) {
    s_rem += scores[scoreBase + ki] * V[ki * params.numHeads * params.D + h * params.D + d];
  }

  output[qi * params.numHeads * params.D + h * params.D + d] = ((s0 + s1) + (s2 + s3)) + s_rem;
}
`,Ws=`/**
 * GEGLU activation shader.
 *
 * GEGLU(x, W) = chunk(x @ W, 2)[0] * GELU(chunk(x @ W, 2)[1])
 *
 * Input: result of linear projection [N, 2*innerDim]
 * Output: [N, innerDim]
 *
 * The projection produces two halves: hidden_states and gate.
 * Output = hidden_states * GELU(gate)
 */

struct Params {
  N: u32,         // sequence length
  innerDim: u32,  // output dimension (half of input)
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;  // [N, 2*innerDim]
@group(0) @binding(2) var<storage, read_write> output: array<f32>; // [N, innerDim]

const WG_SIZE: u32 = 256;

fn gelu(x: f32) -> f32 {
  // Exact GELU via erf approximation (Abramowitz & Stegun 7.1.26)
  if (x > 10.0) { return x; }
  if (x < -10.0) { return 0.0; }
  let a = x * 0.7071067811865476; // x / sqrt(2)
  let abs_a = abs(a);
  let t = 1.0 / (1.0 + 0.3275911 * abs_a);
  let poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  var erf_val = 1.0 - poly * exp(-abs_a * abs_a);
  if (a < 0.0) { erf_val = -erf_val; }
  return 0.5 * x * (1.0 + erf_val);
}

@compute @workgroup_size(WG_SIZE)
fn geglu_main(@builtin(global_invocation_id) gid: vec3<u32>,
              @builtin(workgroup_id) wgid: vec3<u32>,
              @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let total = params.N * params.innerDim;
  if (idx >= total) { return; }

  let row = idx / params.innerDim;
  let col = idx % params.innerDim;

  let doubleInnerDim = params.innerDim * 2u;
  // First half: hidden_states
  let hidden = input[row * doubleInnerDim + col];
  // Second half: gate
  let gate = input[row * doubleInnerDim + params.innerDim + col];

  output[idx] = hidden * gelu(gate);
}
`,ve=256,nn=65535;function Se(t){return t<=nn?[t,1]:[nn,Math.ceil(t/nn)]}function pe(t,e){return Math.ceil(t/e)}const oe={
dim:1024,numHeads:16,headDim:64,numBlocks:4,numBasicBlocks:3,numLatents:1792,planeSize:96,triplaneTokens:288*96,gegluInnerDim:4096,
eps:1e-5},Ne=Object.freeze(["setup",...Array.from({length:oe.numBlocks},(t,e)=>[`block-${e}-fuse-in`,...Array.from({length:oe.
numBasicBlocks},(n,o)=>`block-${e}-basic-${o}`),`block-${e}-fuse-out`]).flat(),"final"]);function et(t,e,n){if(!Number.isSafeInteger(
t)||t<=0)throw new TypeError("totalRows must be a positive safe integer");if(!Number.isSafeInteger(e)||e<0)throw new TypeError(
"rowStart must be a non-negative safe integer");if(!Number.isSafeInteger(n)||n<=0)throw new TypeError("rowCount must be \
a positive safe integer");const o=e+n;if(!Number.isSafeInteger(o)||o>t)throw new RangeError(`linear row range ${e}-${o} \
exceeds totalRows ${t}`);return Object.freeze({totalRows:t,rowStart:e,rowCount:n,rowEnd:o})}function js(t,e){if(!Number.
isSafeInteger(e)||e<=0)throw new TypeError("rowsPerDuty must be a positive safe integer");et(t,0,Math.min(t,e));const n=[];
for(let o=0;o<t;o+=e){const r=et(t,o,Math.min(e,t-o));n.push(Object.freeze({rangeIndex:n.length,...r}))}return Object.freeze(
n)}function In(t,e={}){if(!Number.isSafeInteger(t)||t<=0)throw new TypeError("N_img must be a positive safe integer");const n=e.
linearRowsPerDuty??128,o=e.attentionRowsPerDuty??128,r=e.residentFFN??!1;if(typeof r!="boolean")throw TypeError("residen\
tFFN must be boolean");if(!Number.isSafeInteger(n)||n<=0)throw new TypeError("linearRowsPerDuty must be a positive safe \
integer");if(!Number.isSafeInteger(o)||o<=0)throw new TypeError("attentionRowsPerDuty must be a positive safe integer");
const s=[],i=f=>{s.push(Object.freeze({dutyIndex:s.length,dutyId:f.dutyId,...f}))},a=(f,p)=>{for(let g=0;g<p;g++)i({dutyId:`${f}\
-tile-${g}`,kind:"attention-tile",ownerId:f,tileIndex:g,tileCount:p})},c=(f,p,g,m)=>{for(const h of m)i({dutyId:`${f}-ra\
nge-${h.rangeIndex}`,kind:p,ownerId:f,block:g,direction:"out",rangeIndex:h.rangeIndex,rangeCount:m.length,totalRows:h.totalRows,
rowStart:h.rowStart,rowCount:h.rowCount,rowEnd:h.rowEnd})},l=pe(t+oe.numLatents,o),d=pe(oe.triplaneTokens,o),u=js(oe.triplaneTokens,
n);i({dutyId:"setup",kind:"setup"});for(let f=0;f<oe.numBlocks;f++){const p=`block-${f}-fuse-in`;i({dutyId:`${p}-prepare`,
kind:"fuse-prepare",block:f,direction:"in"}),a(p,l),i({dutyId:`${p}-finish`,kind:"fuse-finish",block:f,direction:"in"});
for(let m=0;m<oe.numBasicBlocks;m++){const h=`block-${f}-basic-${m}`,w=`${h}-self`,b=`${h}-cross`;i({dutyId:`${w}-prepar\
e`,kind:"basic-self-prepare",block:f,basic:m}),a(w,l),i({dutyId:`${b}-prepare`,kind:"basic-cross-prepare",block:f,basic:m}),
a(b,l),i({dutyId:`${h}-finish`,kind:"basic-finish",block:f,basic:m})}const g=`block-${f}-fuse-out`;i({dutyId:`${g}-prepa\
re`,kind:"fuse-prepare",block:f,direction:"out"}),a(g,d),c(`${g}-attention-projection`,"fuse-attention-linear-range",f,u),
i({dutyId:`${g}-residual-norm`,kind:"fuse-residual-norm",block:f,direction:"out"}),r?c(`${g}-ffn-projection`,"fuse-resid\
ent-ffn-range",f,u):(c(`${g}-geglu-expansion`,"fuse-geglu-linear-range",f,u),i({dutyId:`${g}-geglu-activate`,kind:"fuse-\
geglu-activate",block:f,direction:"out"}),c(`${g}-ffn-projection`,"fuse-ffn-linear-range",f,u)),i({dutyId:`${g}-final-re\
sidual`,kind:"fuse-final-residual",block:f,direction:"out"})}return i({dutyId:"final",kind:"final"}),Object.freeze(s)}class Ls{constructor(e){
this.device=e,this.pipelines={},this._uniformCache=new Map}init(){const e=this.device,n=(d,u)=>e.createComputePipeline({
layout:"auto",compute:{module:e.createShaderModule({code:d}),entryPoint:u}});this.pipelines.linear=n(qt,"main"),this.pipelines.
linearRange=n(zs,"main"),this.pipelines.layerNorm=n(_n,"main");const o=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.
COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,
visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{
type:"read-only-storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.
COMPUTE,buffer:{type:"storage"}}]}),r=e.createPipelineLayout({bindGroupLayouts:[o]});this._crossAttnLayout=o;const s=e.createShaderModule(
{code:Ns}),i=d=>e.createComputePipeline({layout:r,compute:{module:s,entryPoint:d}});this.pipelines.crossAttnScores=i("co\
mputeCrossScores"),this.pipelines.crossAttnSoftmax=i("softmaxCross"),this.pipelines.crossAttnApply=i("applyCrossAttn"),this.
pipelines.geglu=n(Ws,"geglu_main");const a=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,
buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.
COMPUTE,buffer:{type:"read-only-storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},
{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{
type:"storage"}}]}),c=e.createPipelineLayout({bindGroupLayouts:[a]});this._gnLayout=a;const l=e.createShaderModule({code:Ur});
this.pipelines.gnStats=e.createComputePipeline({layout:c,compute:{module:l,entryPoint:"groupnorm_stats"}}),this.pipelines.
gnNorm=e.createComputePipeline({layout:c,compute:{module:l,entryPoint:"groupnorm_normalize"}}),this.pipelines.add=n(`
      @group(0) @binding(0) var<storage, read_write> dst: array<f32>;
      @group(0) @binding(1) var<storage, read> src: array<f32>;
      struct P { count: u32, numWgX: u32 }
      @group(0) @binding(2) var<uniform> p: P;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.count) { return; }
        dst[idx] = dst[idx] + src[idx];
      }
    `,"main"),this.pipelines.concat=n(`
      @group(0) @binding(0) var<storage, read> a: array<f32>;
      @group(0) @binding(1) var<storage, read> b: array<f32>;
      @group(0) @binding(2) var<storage, read_write> out: array<f32>;
      struct P { sizeA: u32, sizeB: u32, numWgX: u32 }
      @group(0) @binding(3) var<uniform> p: P;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        let total = p.sizeA + p.sizeB;
        if (idx >= total) { return; }
        if (idx < p.sizeA) { out[idx] = a[idx]; }
        else { out[idx] = b[idx - p.sizeA]; }
      }
    `,"main")}_cachedUniform(e){if(this._failedUniforms?.size)throw Error("two-stream uniform cleanup is quarantined");const n=new Uint8Array(
e.buffer||e);let o=0;for(let i=0;i<n.length;i++)o=o*31+n[i]|0;const r=`u_${n.length}_${o}`;if(this._uniformCache.has(r))
return this._uniformCache.get(r);const s=this.device.createBuffer({size:Math.max(n.byteLength,16),usage:GPUBufferUsage.UNIFORM|
GPUBufferUsage.COPY_DST,mappedAtCreation:!0});try{new Uint8Array(s.getMappedRange()).set(n),s.unmap()}catch(i){try{s.destroy()}catch(a){
throw(this._failedUniforms??=new Set).add(s),new AggregateError([i,a],"uniform initialization failed and retirement is u\
nresolved",{cause:i})}throw i}return this._uniformCache.set(r,s),s}forward(e,n,o,r){const s=this.createForwardState(n,o,
r);for(let i=0;i<Ne.length;i++)this.dispatchForwardStage(e,s,i);return this.getForwardResult(s)}createForwardState(e,n,o){
if(!Number.isSafeInteger(n)||n<=0)throw new TypeError("N_img must be a positive safe integer");return this._diagnosticBuffers=
{},{imageTokensBuf:e,N_img:n,weights:o,N_latent:n+oe.numLatents,currentLatent:null,currentTriplane:null,nextStageIndex:0,
finePlan:null,nextFineDutyIndex:0,activeOperation:null,result:null}}createAttentionForwardState(e,n,o,r={}){const s=r.reuseDeadTriplaneStorage??
!1,i=r.reuseAttentionResidualStorage??!1,a=r.reuseAttentionQueryStorage===void 0?!1:r.reuseAttentionQueryStorage;if(typeof a!=
"boolean"||a&&r.residentFFN!==!0)throw TypeError("attention query storage reuse requires explicit resident FFN");const c=r.
reuseTokenizerSetupStorage??!1;if(typeof c!="boolean"||c&&(r.residentFFN!==!0||r.rematerializeTokenizerEmbedding!==!0))throw TypeError(
"tokenizer setup reuse requires explicit resident FFN and canonical rematerialization");if(typeof s!="boolean"||s&&r.residentFFN!==
!0)throw TypeError("dead-triplane reuse requires explicit resident FFN");if(typeof i!="boolean"||i&&(!s||r.residentFFN!==
!0))throw TypeError("attention residual reuse requires explicit resident FFN and dead-triplane reuse");const l=this.createForwardState(
e,n,o);l.finePlan=In(n,r),l.residentFFN=r.residentFFN??!1,l.ffnRowsPerTile=r.linearRowsPerDuty??128,l.attentionRowsPerDuty=
r.attentionRowsPerDuty??128,l.reuseDeadTriplaneStorage=s,l.reuseAttentionResidualStorage=i,l.reuseAttentionQueryStorage=
a;const d=r.reuseAttentionProjectionStorage??!1;if(typeof d!="boolean"||d&&(!a||!i||!s))throw TypeError("attention proje\
ction row reuse requires owned query, residual and dead-triplane reuse");return l.reuseAttentionProjectionStorage=d,l.reuseTokenizerSetupStorage=
c,l.rematerializeTokenizerEmbedding=r.rematerializeTokenizerEmbedding??!1,l}dispatchForwardStage(e,n,o){if(!Number.isSafeInteger(
o)||o<0||o>=Ne.length)throw new RangeError(`invalid two-stream stage index ${o}`);if(o!==n.nextStageIndex)throw new Error(
`two-stream stage ${o} is out of order; expected ${n.nextStageIndex}`);if(o===0)this._dispatchForwardSetup(e,n);else if(o===
Ne.length-1)this._dispatchForwardFinal(e,n);else{const r=o-1,s=oe.numBasicBlocks+2,i=Math.floor(r/s),a=r%s;this._dispatchForwardBlockStage(
e,n,i,a)}return n.nextStageIndex++,n}getForwardResult(e){const n=e.nextStageIndex===Ne.length,o=e.finePlan!=null&&e.nextFineDutyIndex===
e.finePlan.length;if(!n&&!o||e.result==null){const r=e.finePlan==null?`${e.nextStageIndex}/${Ne.length}`:`${e.nextFineDutyIndex}\
/${e.finePlan.length}`;throw new Error(`two-stream forward is incomplete at stage ${r}`)}return e.result}dispatchAttentionForwardDuty(e,n,o){
if(n.finePlan==null)throw new Error("two-stream attention-duty state has no fine plan");if(o!==n.nextFineDutyIndex)throw new Error(
`two-stream attention duty ${o} is out of order; expected ${n.nextFineDutyIndex}`);const r=n.finePlan[o];if(!r)throw new RangeError(
`invalid two-stream attention duty ${o}`);switch(r.kind){case"setup":this._dispatchForwardSetup(e,n);break;case"fuse-pre\
pare":this._dispatchFineFusePrepare(e,n,r);break;case"attention-tile":this._dispatchFineAttentionTile(e,n,r);break;case"\
fuse-finish":this._dispatchFineFuseFinish(e,n,r);break;case"fuse-attention-linear-range":this._dispatchFineFuseAttentionLinearRange(
e,n,r);break;case"fuse-residual-norm":this._dispatchFineFuseResidualNorm(e,n,r);break;case"fuse-geglu-linear-range":this.
_dispatchFineFuseGEGLULinearRange(e,n,r);break;case"fuse-geglu-activate":this._dispatchFineFuseGEGLUActivate(e,n,r);break;case"\
fuse-ffn-linear-range":this._dispatchFineFuseFFNLinearRange(e,n,r);break;case"fuse-resident-ffn-range":this._dispatchFineFuseResidentFFNRange(
e,n,r);break;case"fuse-final-residual":this._dispatchFineFuseFinalResidual(e,n,r);break;case"basic-self-prepare":this._dispatchFineBasicSelfPrepare(
e,n,r);break;case"basic-cross-prepare":this._dispatchFineBasicCrossPrepare(e,n,r);break;case"basic-finish":this._dispatchFineBasicFinish(
e,n,r);break;case"final":if(n.activeOperation!=null)throw new Error(`cannot finalize with active ${n.activeOperation.ownerId}`);
this._dispatchForwardFinal(e,n);break;default:throw new Error(`unknown two-stream attention duty kind ${r.kind}`)}return n.
nextFineDutyIndex++,r}_requireFineOperation(e,n,o){const r=e.activeOperation;if(r?.kind!==n||r.ownerId!==o)throw new Error(
`two-stream duty ${o} requires active ${n}; got ${r?.kind??"none"}:${r?.ownerId??"none"}`);return r}_dispatchFineFusePrepare(e,n,o){
if(n.activeOperation!=null)throw new Error(`cannot prepare ${o.dutyId} with active ${n.activeOperation.ownerId}`);const r=oe.
dim,s=oe.triplaneTokens,i=n.weights.mainBlocks[o.block],a=o.direction==="in",c=a?n.currentLatent:n.currentTriplane,l=a?n.
currentTriplane:n.currentLatent,d=a?n.N_latent:s,u=a?s:n.N_latent,f=a?i.fuseBlockIn:i.fuseBlockOut,p=q(this.device,d*r*4);
this._dispatchLayerNorm(e,c,p,f.normZ1,d,r);let g=l;f.normX&&(g=q(this.device,u*r*4),this._dispatchLayerNorm(e,l,g,f.normX,
u,r));const m=`block-${o.block}-fuse-${o.direction}`;n.activeOperation={kind:"fuse",ownerId:m,block:o.block,direction:o.
direction,zBuf:c,weights:f,N_z:d,D:r,attention:this._createAttentionState(e,p,g,f.attn,d,u,r,n.attentionRowsPerDuty,n.reuseAttentionQueryStorage)}}_dispatchFineAttentionTile(e,n,o){
const r=n.activeOperation;if(!r||r.ownerId!==o.ownerId)throw new Error(`attention tile ${o.dutyId} requires active ${o.ownerId}\
; got ${r?.ownerId??"none"}`);if(r.attention.tileCount!==o.tileCount)throw new Error(`attention tile count changed for ${o.
ownerId}: ${r.attention.tileCount} != ${o.tileCount}`);this._dispatchAttentionTile(e,r.attention,o.tileIndex)}_dispatchFineFuseFinish(e,n,o){
const r=`block-${o.block}-fuse-${o.direction}`,s=this._requireFineOperation(n,"fuse",r),i=this._finishAttention(e,s.attention),
a=q(this.device,s.N_z*s.D*4);e.copyBufferToBuffer(s.zBuf,0,a,0,s.N_z*s.D*4),this._dispatchAdd(e,a,i,s.N_z*s.D);const c=q(
this.device,s.N_z*s.D*4);this._dispatchLayerNorm(e,a,c,s.weights.normZ2,s.N_z,s.D);const l=this._dispatchGEGLUFFN(e,c,s.
weights.ff,s.N_z,s.D,{rowsPerTile:n.residentFFN?n.ffnRowsPerTile:null}),d=q(this.device,s.N_z*s.D*4);e.copyBufferToBuffer(
a,0,d,0,s.N_z*s.D*4),this._dispatchAdd(e,d,l,s.N_z*s.D),o.direction==="in"?n.currentLatent=d:(n.currentTriplane=d,this._diagnosticBuffers[`\
block${o.block}_latent`]=n.currentLatent,this._diagnosticBuffers[`block${o.block}_triplane`]=n.currentTriplane),n.activeOperation=
null}_requireFineFuseOut(e,n){const o=`block-${n.block}-fuse-out`;return this._requireFineOperation(e,"fuse",o)}_validateFineLinearRange(e,n,o){
if(n.ownerId!==o.ownerId)throw Error("linear projection owner changed");if(n.rangeIndex!==o.nextRangeIndex||n.rangeCount!==
o.rangeCount||n.totalRows!==e.N_z)throw Error("linear projection range order changed");const r=et(e.N_z,n.rowStart,n.rowCount);
if(n.rowStart!==o.nextRowStart||n.rowEnd!==r.rowEnd)throw Error("linear projection rows are not contiguous");return r}_dispatchFineLinearRange(e,n,o,r,s,i,a,c,l,d,u=null){
if(o.ownerId!==r.ownerId)throw new Error(`linear duty ${o.dutyId} owner changed: ${o.ownerId} != ${r.ownerId}`);if(o.rangeIndex!==
r.nextRangeIndex||o.rangeCount!==r.rangeCount||o.totalRows!==n.N_z)throw new Error(`linear duty ${o.dutyId} is out of ra\
nge order; expected ${r.nextRangeIndex}/${r.rangeCount} over ${n.N_z} rows`);const f=et(n.N_z,o.rowStart,o.rowCount);if(o.
rowStart!==r.nextRowStart||o.rowEnd!==f.rowEnd)throw new Error(`linear duty ${o.dutyId} is not contiguous; expected row ${r.
nextRowStart}, got ${o.rowStart}-${o.rowEnd}`);if(u){if(!Number.isSafeInteger(u.capacity)||u.capacity<f.rowCount||u.input.
size!==u.capacity*l*4||u.output.size!==u.capacity*d*4||new Set([u.input,u.output,s,a,c]).size!==5||s!==i)throw Error("ex\
act disjoint projection row caches and owned output alias required");e.copyBufferToBuffer(s,f.rowStart*l*4,u.input,0,f.rowCount*
l*4),this._dispatchLinearRange(e,u.input,u.output,a,c,u.capacity,l,d,0,f.rowCount),e.copyBufferToBuffer(u.output,0,i,f.rowStart*
d*4,f.rowCount*d*4)}else this._dispatchLinearRange(e,s,i,a,c,n.N_z,l,d,o.rowStart,o.rowCount);r.nextRangeIndex++,r.nextRowStart=
f.rowEnd}_dispatchFineFuseAttentionLinearRange(e,n,o){const r=this._requireFineFuseOut(n,o);if(r.attention.nextTileIndex!==
r.attention.tileCount)throw new Error(`attention projection started before all tiles completed for ${r.ownerId}`);const s=n.
reuseAttentionProjectionStorage??!1;if(typeof s!="boolean")throw Error("exact projection row reuse mode required");const i=r.
attention.attnOutBuf;if(s){const c=this._residentWorkOwner?.buffers,l=r.N_z*r.D*4;if(!n.residentFFN||!n.reuseAttentionQueryStorage||
!n.reuseAttentionResidualStorage||!n.reuseDeadTriplaneStorage||!c?.has(i)||!c.has(r.zBuf)||i!==r.attention.qBuf||i===r.zBuf||
i.size!==l||!Number.isSafeInteger(n.ffnRowsPerTile)||n.ffnRowsPerTile<=0)throw Error("owned complete attention query bac\
king and projection reuse prerequisites required");this._validateFineLinearRange(r,o,r.attentionProjection??{ownerId:`${r.
ownerId}-attention-projection`,nextRangeIndex:0,nextRowStart:0,rangeCount:o.rangeCount})}if(!r.attentionProjection&&(r.attentionProjection=
{ownerId:`${r.ownerId}-attention-projection`,nextRangeIndex:0,nextRowStart:0,rangeCount:o.rangeCount,output:s?i:q(this.device,
r.N_z*r.D*4),reuseAttentionProjectionStorage:s},s)){const c=r.attentionProjection.rowCache={capacity:n.ffnRowsPerTile};c.
input=q(this.device,c.capacity*r.D*4),c.output=q(this.device,c.capacity*r.D*4)}const a=r.attentionProjection;if(a.reuseAttentionProjectionStorage!==
s)throw Error("projection row reuse changed during an active phase");this._dispatchFineLinearRange(e,r,o,a,r.attention.attnOutBuf,
a.output,r.attention.attnWeights.proj.weight,r.attention.attnWeights.proj.bias,r.D,r.D,a.rowCache??null)}_markFineAttentionProjectionReusable(e,n){
const o=this._requireFineFuseOut(e,n),r=o.attentionProjection,s=this._residentWorkOwner?.buffers,i=o.N_z*o.D*4,a=r?.rowCache;
if(!e.reuseAttentionProjectionStorage||!r?.reuseAttentionProjectionStorage||n.kind!=="fuse-attention-linear-range"||n.rangeIndex!==
n.rangeCount-1||e.nextFineDutyIndex!==n.dutyIndex+1||r.nextRangeIndex!==r.rangeCount||r.nextRowStart!==o.N_z||r.output!==
o.attention?.attnOutBuf||r.output!==o.attention.qBuf||r.output===o.zBuf||r.output.size!==i||!s?.has(r.output)||!s.has(a?.
input)||!s.has(a?.output))throw Error("owned complete projection row prefix required");return r.completedPrefix={buffer:r.
output,afterDutyIndex:n.dutyIndex},{block:n.block,afterDutyIndex:n.dutyIndex,bytes:i,totalRows:o.N_z,rowCapacity:a.capacity,
scratchBytes:a.input.size+a.output.size,source:"owned-attention-result-after-each-complete-row-last-read"}}_dispatchFineFuseResidualNorm(e,n,o){
const r=this._requireFineFuseOut(n,o),s=r.attentionProjection;if(!s||s.nextRangeIndex!==s.rangeCount||s.nextRowStart!==r.
N_z)throw new Error(`attention projection is incomplete for ${r.ownerId}`);const i=r.N_z*r.D*4;let a=s.output;if(n.reuseAttentionResidualStorage){
const c=r.reusableAttentionResidualStorage,l=this._residentWorkOwner?.buffers;if(!c||c.buffer!==s.output||c.afterDutyIndex!==
o.dutyIndex-1||!l?.has(s.output)||!l.has(r.zBuf)||s.output.size!==i||r.zBuf.size!==i||s.output===r.zBuf)throw Error("own\
ed attention projection residual reuse prefix/storage identity required");r.z1Buf=s.output,a=r.zBuf}else r.z1Buf=q(this.
device,i),e.copyBufferToBuffer(r.zBuf,0,r.z1Buf,0,i);this._dispatchAdd(e,r.z1Buf,a,r.N_z*r.D),r.z2NormBuf=q(this.device,
i),this._dispatchLayerNorm(e,r.z1Buf,r.z2NormBuf,r.weights.normZ2,r.N_z,r.D),n.residentFFN&&(r.attention=null,r.attentionProjection=
null)}_markFineAttentionResidualReusable(e,n){const o=this._requireFineFuseOut(e,n),r=o.attentionProjection,s=o.N_z*o.D*
4,i=this._residentWorkOwner?.buffers;if(!e.reuseAttentionResidualStorage||!e.reuseDeadTriplaneStorage||!e.residentFFN||n.
kind!=="fuse-attention-linear-range"||n.rangeIndex!==n.rangeCount-1||e.nextFineDutyIndex!==n.dutyIndex+1||!r||r.nextRangeIndex!==
r.rangeCount||r.nextRowStart!==o.N_z||!i?.has(r.output)||!i.has(o.zBuf)||r.output.size!==s||o.zBuf.size!==s||r.output===
o.zBuf||r.output===o.attention?.attnOutBuf&&(!e.reuseAttentionProjectionStorage||r.completedPrefix?.buffer!==r.output||r.
completedPrefix.afterDutyIndex!==n.dutyIndex))throw Error("owned completed attention projection prefix required for resi\
dual reuse");return o.reusableAttentionResidualStorage={buffer:r.output,afterDutyIndex:n.dutyIndex},{block:n.block,afterDutyIndex:n.
dutyIndex,bytes:s,source:"owned-projected-attention-after-gpu-prefix"}}_dispatchFineFuseGEGLULinearRange(e,n,o){const r=this.
_requireFineFuseOut(n,o);if(!r.z2NormBuf)throw new Error(`GEGLU expansion started before residual norm for ${r.ownerId}`);
const s=oe.gegluInnerDim;r.gegluExpansion||(r.gegluExpansion={ownerId:`${r.ownerId}-geglu-expansion`,nextRangeIndex:0,nextRowStart:0,
rangeCount:o.rangeCount,output:q(this.device,r.N_z*2*s*4)});const i=r.gegluExpansion;this._dispatchFineLinearRange(e,r,o,
i,r.z2NormBuf,i.output,r.weights.ff.geglu.weight,r.weights.ff.geglu.bias,r.D,2*s)}_dispatchFineFuseGEGLUActivate(e,n,o){
const r=this._requireFineFuseOut(n,o),s=r.gegluExpansion;if(!s||s.nextRangeIndex!==s.rangeCount||s.nextRowStart!==r.N_z)
throw new Error(`GEGLU expansion is incomplete for ${r.ownerId}`);r.gegluOutput=q(this.device,r.N_z*oe.gegluInnerDim*4),
this._dispatchGEGLUActivation(e,s.output,r.gegluOutput,r.N_z,oe.gegluInnerDim)}_dispatchFineFuseFFNLinearRange(e,n,o){const r=this.
_requireFineFuseOut(n,o);if(!r.gegluOutput)throw new Error(`FFN projection started before GEGLU activation for ${r.ownerId}`);
r.ffnProjection||(r.ffnProjection={ownerId:`${r.ownerId}-ffn-projection`,nextRangeIndex:0,nextRowStart:0,rangeCount:o.rangeCount,
output:q(this.device,r.N_z*r.D*4)});const s=r.ffnProjection;this._dispatchFineLinearRange(e,r,o,s,r.gegluOutput,s.output,
r.weights.ff.proj.weight,r.weights.ff.proj.bias,oe.gegluInnerDim,r.D)}_dispatchFineFuseFinalResidual(e,n,o){const r=this.
_requireFineFuseOut(n,o),s=r.ffnProjection;if(!s||s.nextRangeIndex!==s.rangeCount||s.nextRowStart!==r.N_z)throw new Error(
`FFN projection is incomplete for ${r.ownerId}`);const i=r.N_z*r.D*4;let a;if(n.reuseDeadTriplaneStorage){if(this._requireReusableFineFuseStorage(
r),s.output!==r.zBuf)throw Error("owned reuse FFN output identity changed");a=r.z1Buf}else a=q(this.device,i),e.copyBufferToBuffer(
r.z1Buf,0,a,0,i);this._dispatchAdd(e,a,s.output,r.N_z*r.D),n.currentTriplane=a,this._diagnosticBuffers[`block${o.block}_\
latent`]=n.currentLatent,this._diagnosticBuffers[`block${o.block}_triplane`]=n.currentTriplane,n.activeOperation=null}_markFineFuseStorageReusable(e,n){
const o=this._requireFineFuseOut(e,n);if(!e.reuseDeadTriplaneStorage||!e.residentFFN||n.kind!=="fuse-residual-norm"||e.nextFineDutyIndex!==
n.dutyIndex+1||o.zBuf!==e.currentTriplane||o.attention!==null||o.attentionProjection!==null||o.ffnProjection)throw Error(
"owned dead-triplane reuse requires completed residual/norm prefix");const r=o.N_z*o.D*4,s=this._residentWorkOwner?.buffers;
if(!s?.has(o.zBuf)||!s.has(o.z1Buf)||!s.has(o.z2NormBuf)||o.zBuf.size!==r||o.z1Buf.size!==r||o.z2NormBuf.size!==r||new Set(
[o.zBuf,o.z1Buf,o.z2NormBuf]).size!==3)throw Error("owned distinct complete buffers required for dead-triplane reuse");return o.
reusableTriplaneStorage={buffer:o.zBuf,afterDutyIndex:n.dutyIndex},{block:n.block,afterDutyIndex:n.dutyIndex,bytes:r,source:"\
owned-work-inventory-after-gpu-prefix"}}_requireReusableFineFuseStorage(e){const n=e.reusableTriplaneStorage,o=this._residentWorkOwner?.
buffers;if(!n||n.buffer!==e.zBuf||!Number.isSafeInteger(n.afterDutyIndex)||!o?.has(e.zBuf)||!o.has(e.z1Buf)||!o.has(e.z2NormBuf)||
e.zBuf.size!==e.N_z*e.D*4||new Set([e.zBuf,e.z1Buf,e.z2NormBuf]).size!==3)throw Error("owned dead-triplane reuse prefix/\
storage identity required");return n.buffer}_dispatchFineFuseResidentFFNRange(e,n,o){const r=this._requireFineFuseOut(n,
o);if(!n.residentFFN||!r.z2NormBuf)throw Error("resident FFN requires completed residual norm");let s=r.ffnProjection;const i=et(
r.N_z,o.rowStart,o.rowCount);if(o.ownerId!==`${r.ownerId}-ffn-projection`||o.rangeIndex!==(s?.nextRangeIndex??0)||o.rowStart!==
(s?.nextRowStart??0)||o.rowEnd!==i.rowEnd||o.totalRows!==r.N_z||o.rangeCount!==Math.ceil(r.N_z/n.ffnRowsPerTile)||o.rowCount!==
Math.min(n.ffnRowsPerTile,r.N_z-o.rowStart))throw Error("resident FFN duty is not the complete contiguous row plan");let a;
if(!s&&n.reuseDeadTriplaneStorage&&(a=this._requireReusableFineFuseStorage(r),r.reusableTriplaneStorage.afterDutyIndex!==
o.dutyIndex-1))throw Error("owned reuse requires the immediately completed residual/norm prefix");s||(s=r.ffnProjection=
{ownerId:o.ownerId,nextRangeIndex:0,nextRowStart:0,rangeCount:o.rangeCount,output:a??q(this.device,r.N_z*r.D*4),scratch:this.
_createFFNScratch(Math.min(n.ffnRowsPerTile,r.N_z),r.D)}),this._dispatchFFNRow(e,r.z2NormBuf,s.output,s.scratch,r.weights.
ff,o.rowStart,o.rowCount,r.D),s.nextRangeIndex++,s.nextRowStart=i.rowEnd}_dispatchFineBasicSelfPrepare(e,n,o){if(n.activeOperation!=
null)throw new Error(`cannot prepare ${o.dutyId} with active ${n.activeOperation.ownerId}`);const r=oe.dim,s=n.weights.mainBlocks[o.
block].transformerBlocks[o.basic],i=q(this.device,n.N_latent*r*4);this._dispatchLayerNorm(e,n.currentLatent,i,s.norm1,n.
N_latent,r),n.activeOperation={kind:"basic-self",ownerId:`block-${o.block}-basic-${o.basic}-self`,block:o.block,basic:o.
basic,zBuf:n.currentLatent,weights:s,D:r,attention:this._createAttentionState(e,i,i,s.attn1,n.N_latent,n.N_latent,r,n.attentionRowsPerDuty,
n.reuseAttentionQueryStorage)}}_dispatchFineBasicCrossPrepare(e,n,o){const r=`block-${o.block}-basic-${o.basic}-self`,s=this.
_requireFineOperation(n,"basic-self",r),i=this._finishAttention(e,s.attention),a=q(this.device,n.N_latent*s.D*4);e.copyBufferToBuffer(
s.zBuf,0,a,0,n.N_latent*s.D*4),this._dispatchAdd(e,a,i,n.N_latent*s.D);const c=q(this.device,n.N_latent*s.D*4);this._dispatchLayerNorm(
e,a,c,s.weights.norm2,n.N_latent,s.D),s.kind="basic-cross",s.ownerId=`block-${o.block}-basic-${o.basic}-cross`,s.z1Buf=a,
s.attention=this._createAttentionState(e,c,n.imageTokensBuf,s.weights.attn2,n.N_latent,n.N_img,s.D,n.attentionRowsPerDuty,
n.reuseAttentionQueryStorage)}_dispatchFineBasicFinish(e,n,o){const r=`block-${o.block}-basic-${o.basic}-cross`,s=this._requireFineOperation(
n,"basic-cross",r),i=this._finishAttention(e,s.attention),a=q(this.device,n.N_latent*s.D*4);e.copyBufferToBuffer(s.z1Buf,
0,a,0,n.N_latent*s.D*4),this._dispatchAdd(e,a,i,n.N_latent*s.D);const c=q(this.device,n.N_latent*s.D*4);this._dispatchLayerNorm(
e,a,c,s.weights.norm3,n.N_latent,s.D);const l=this._dispatchGEGLUFFN(e,c,s.weights.ff,n.N_latent,s.D,{rowsPerTile:n.residentFFN?
n.ffnRowsPerTile:null}),d=q(this.device,n.N_latent*s.D*4);e.copyBufferToBuffer(a,0,d,0,n.N_latent*s.D*4),this._dispatchAdd(
e,d,l,n.N_latent*s.D),n.currentLatent=d,n.activeOperation=null}_dispatchForwardSetup(e,n){const o=this.device,r=oe.dim,s=oe.
triplaneTokens,i=oe.numLatents,{imageTokensBuf:a,N_img:c,weights:l}=n,d=n.reuseTokenizerSetupStorage??!1,u=s*r*4;if(typeof d!=
"boolean")throw TypeError("explicit boolean tokenizer setup reuse required");if(d&&(!n.residentFFN||n.rematerializeTokenizerEmbedding!==
!0||n.nextFineDutyIndex!==0||!Array.isArray(this._residentWorkOwner?.allocations)||!this._residentAdapterOwner?.allocations?.
some(x=>x.buffer===l.tokenizer_embeddings_buf&&x.size===u)||l.tokenizer_embeddings_buf?.size!==u||!(l.tokenizer_embeddings_buf.
usage&GPUBufferUsage.STORAGE)||l.tokenizer_embeddings_buf===a||l.tokenizer_embeddings_buf===l.latentInit))throw Error("o\
wned initial tokenizer setup storage and canonical rematerialization required");const f=this._dispatchGroupNorm(e,l.tokenizer_embeddings_buf,
l.normTriplane,r,s,32),p=d?l.tokenizer_embeddings_buf:q(o,u);this._dispatchTranspose(e,f,p,r,s);const g=d?f:q(o,u);this.
_dispatchLinear(e,p,g,l.projTriplane.weight,l.projTriplane.bias,s,r,r);const m=q(o,c*r*4);this._dispatchLayerNorm(e,a,m,
l.normImage,c,r);const h=q(o,c*r*4);this._dispatchLinear(e,m,h,l.projImage.weight,l.projImage.bias,c,r,r);const w=q(o,i*
r*4);this._dispatchLayerNorm(e,l.latentInit,w,l.normLatent,i,r);const b=q(o,i*r*4);this._dispatchLinear(e,w,b,l.projLatent.
weight,l.projLatent.bias,i,r,r);const y=n.N_latent,_=q(o,y*r*4);this._dispatchConcat(e,h,b,_,c*r,i*r),n.currentLatent=_,
n.currentTriplane=g,d||Object.assign(this._diagnosticBuffers,{gnOutBuf:f,triPermBuf:p}),d&&(delete this._diagnosticBuffers.
gnOutBuf,delete this._diagnosticBuffers.triPermBuf,n.tokenizerSetupStorageReuse={status:"encoded",bytesPerBuffer:u,reusedTriplaneBuffers:2,
newTriplaneBuffers:1,source:"owned-tokenizer-after-groupnorm-read; owned-groupnorm-after-transpose-read"}),Object.assign(
this._diagnosticBuffers,{triProjBuf:g,imgProjBuf:h,latentProjBuf:b,latentBuf:_})}_dispatchForwardBlockStage(e,n,o,r){const s=oe.
dim,i=oe.triplaneTokens,a=n.weights.mainBlocks[o];if(r===0){n.currentLatent=this._dispatchFuseBlock(e,n.currentLatent,n.
currentTriplane,a.fuseBlockIn,n.N_latent,i,s);return}if(r<=oe.numBasicBlocks){const c=r-1;n.currentLatent=this._dispatchBasicBlock(
e,n.currentLatent,n.imageTokensBuf,a.transformerBlocks[c],n.N_latent,n.N_img,s);return}n.currentTriplane=this._dispatchFuseBlock(
e,n.currentTriplane,n.currentLatent,a.fuseBlockOut,i,n.N_latent,s),this._diagnosticBuffers[`block${o}_latent`]=n.currentLatent,
this._diagnosticBuffers[`block${o}_triplane`]=n.currentTriplane}_dispatchForwardFinal(e,n){const o=this.device,r=oe.dim,
s=oe.triplaneTokens,i=q(o,s*r*4);this._dispatchLinear(e,n.currentTriplane,i,n.weights.projOut.weight,n.weights.projOut.bias,
s,r,r);const a=q(o,r*s*4);this._dispatchTranspose(e,i,a,s,r),this._dispatchAdd(e,a,n.weights.tokenizer_embeddings_buf,r*
s),this._diagnosticBuffers.projOutBuf=i,this._diagnosticBuffers.projOutPermBuf=a,this._diagnosticBuffers.rearrangedEmb=n.
weights.tokenizer_embeddings_buf,n.result={buffer:a,C:r,N:s,planeSize:oe.planeSize}}_dispatchFuseBlock(e,n,o,r,s,i,a){const c=this.
device,l=q(c,s*a*4);this._dispatchLayerNorm(e,n,l,r.normZ1,s,a);let d=o;r.normX&&(d=q(c,i*a*4),this._dispatchLayerNorm(e,
o,d,r.normX,i,a));const u=this._dispatchCrossAttention(e,l,d,r.attn,s,i,a),f=q(c,s*a*4);e.copyBufferToBuffer(n,0,f,0,s*a*
4),this._dispatchAdd(e,f,u,s*a);const p=q(c,s*a*4);this._dispatchLayerNorm(e,f,p,r.normZ2,s,a);const g=this._dispatchGEGLUFFN(
e,p,r.ff,s,a),m=q(c,s*a*4);return e.copyBufferToBuffer(f,0,m,0,s*a*4),this._dispatchAdd(e,m,g,s*a),m}_dispatchBasicBlock(e,n,o,r,s,i,a){
const c=this.device,l=q(c,s*a*4);this._dispatchLayerNorm(e,n,l,r.norm1,s,a);const d=this._dispatchSelfAttention(e,l,r.attn1,
s,a),u=q(c,s*a*4);e.copyBufferToBuffer(n,0,u,0,s*a*4),this._dispatchAdd(e,u,d,s*a);const f=q(c,s*a*4);this._dispatchLayerNorm(
e,u,f,r.norm2,s,a);const p=this._dispatchCrossAttention(e,f,o,r.attn2,s,i,a),g=q(c,s*a*4);e.copyBufferToBuffer(u,0,g,0,s*
a*4),this._dispatchAdd(e,g,p,s*a);const m=q(c,s*a*4);this._dispatchLayerNorm(e,g,m,r.norm3,s,a);const h=this._dispatchGEGLUFFN(
e,m,r.ff,s,a),w=q(c,s*a*4);return e.copyBufferToBuffer(g,0,w,0,s*a*4),this._dispatchAdd(e,w,h,s*a),w}_createAttentionState(e,n,o,r,s,i,a,c=128,l=!1){
if(typeof l!="boolean")throw TypeError("attention query storage reuse requires a boolean");if(!Number.isSafeInteger(c)||
c<=0)throw TypeError("attentionRowsPerDuty must be a positive safe integer");const d=this.device,u=oe.numHeads,f=q(d,s*a*
4),p=q(d,i*a*4),g=q(d,i*a*4);this._dispatchLinearNoBias(e,n,f,r.wq,s,a,a),this._dispatchLinearNoBias(e,o,p,r.wk,i,a,a),this.
_dispatchLinearNoBias(e,o,g,r.wv,i,a,a);const m=u*c*i*4,h=q(d,m),w=q(d,c*a*4),b=l?f:q(d,s*a*4);return{attnWeights:r,N_q:s,
N_kv:i,D:a,numHeads:u,headDim:oe.headDim,tileQCapacity:c,tileCount:pe(s,c),nextTileIndex:0,qBuf:f,kBuf:p,vBuf:g,scoreBuf:h,
tileAttnOutBuf:w,attnOutBuf:b,reuseAttentionQueryStorage:l}}_dispatchAttentionTile(e,n,o){if(o!==n.nextTileIndex)throw new Error(
`attention tile ${o} is out of order; expected ${n.nextTileIndex}`);if(o<0||o>=n.tileCount)throw new RangeError(`invalid\
 attention tile ${o}/${n.tileCount}`);const r=this.device,{N_q:s,N_kv:i,D:a,numHeads:c,headDim:l,tileQCapacity:d,qBuf:u,
kBuf:f,vBuf:p,scoreBuf:g,tileAttnOutBuf:m,attnOutBuf:h}=n,w=o*d,b=Math.min(d,s-w),y=w*a*4,_=c*b*i*4,x=b*a*4;{const k=pe(
c*b*i,ve),[R,E]=Se(k),M=this._cachedUniform(new Uint32Array([b,i,l,c,R])),D=r.createBindGroup({layout:this._crossAttnLayout,
entries:[{binding:0,resource:{buffer:M}},{binding:1,resource:{buffer:u,offset:y,size:x}},{binding:2,resource:{buffer:f}},
{binding:3,resource:{buffer:p}},{binding:4,resource:{buffer:g,size:_}},{binding:5,resource:{buffer:m,size:x}}]}),I=e.beginComputePass();
I.setPipeline(this.pipelines.crossAttnScores),I.setBindGroup(0,D),I.dispatchWorkgroups(R,E),I.end()}{const k=pe(c*b,ve),
[R,E]=Se(k),M=this._cachedUniform(new Uint32Array([b,i,l,c,R])),D=r.createBindGroup({layout:this._crossAttnLayout,entries:[
{binding:0,resource:{buffer:M}},{binding:1,resource:{buffer:u,offset:y,size:x}},{binding:2,resource:{buffer:f}},{binding:3,
resource:{buffer:p}},{binding:4,resource:{buffer:g,size:_}},{binding:5,resource:{buffer:m,size:x}}]}),I=e.beginComputePass();
I.setPipeline(this.pipelines.crossAttnSoftmax),I.setBindGroup(0,D),I.dispatchWorkgroups(R,E),I.end()}{const k=pe(b*c*l,ve),
[R,E]=Se(k),M=this._cachedUniform(new Uint32Array([b,i,l,c,R])),D=r.createBindGroup({layout:this._crossAttnLayout,entries:[
{binding:0,resource:{buffer:M}},{binding:1,resource:{buffer:u,offset:y,size:x}},{binding:2,resource:{buffer:f}},{binding:3,
resource:{buffer:p}},{binding:4,resource:{buffer:g,size:_}},{binding:5,resource:{buffer:m,size:x}}]}),I=e.beginComputePass();
I.setPipeline(this.pipelines.crossAttnApply),I.setBindGroup(0,D),I.dispatchWorkgroups(R,E),I.end()}e.copyBufferToBuffer(
m,0,h,y,x),n.nextTileIndex++}_finishAttention(e,n){if(n.nextTileIndex!==n.tileCount)throw new Error(`attention is incomp\
lete at tile ${n.nextTileIndex}/${n.tileCount}`);const o=q(this.device,n.N_q*n.D*4);return this._dispatchLinear(e,n.attnOutBuf,
o,n.attnWeights.proj.weight,n.attnWeights.proj.bias,n.N_q,n.D,n.D),o}_dispatchCrossAttention(e,n,o,r,s,i,a){const c=this.
_createAttentionState(e,n,o,r,s,i,a);for(let l=0;l<c.tileCount;l++)this._dispatchAttentionTile(e,c,l);return this._finishAttention(
e,c)}_dispatchSelfAttention(e,n,o,r,s){return this._dispatchCrossAttention(e,n,n,o,r,r,s)}_createFFNScratch(e,n){return{
input:q(this.device,e*n*4),expanded:q(this.device,e*2*oe.gegluInnerDim*4),activated:q(this.device,e*oe.gegluInnerDim*4),
projected:q(this.device,e*n*4)}}_dispatchFFNRow(e,n,o,r,s,i,a,c){const l=oe.gegluInnerDim;e.copyBufferToBuffer(n,i*c*4,r.
input,0,a*c*4),this._dispatchLinear(e,r.input,r.expanded,s.geglu.weight,s.geglu.bias,a,c,2*l),this._dispatchGEGLUActivation(
e,r.expanded,r.activated,a,l),this._dispatchLinear(e,r.activated,r.projected,s.proj.weight,s.proj.bias,a,l,c),e.copyBufferToBuffer(
r.projected,0,o,i*c*4,a*c*4)}_dispatchGEGLUFFN(e,n,o,r,s,{rowsPerTile:i=null}={}){const a=this.device,c=oe.gegluInnerDim;
if(i!==null){if(!Number.isSafeInteger(i)||i<=0)throw TypeError("rowsPerTile must be a positive safe integer");if(!Number.
isSafeInteger(r)||r<=0||!Number.isSafeInteger(s)||s<=0)throw TypeError("complete positive FFN dimensions required");const f=Math.
min(i,r),p=q(a,r*s*4),g=this._createFFNScratch(f,s);for(let m=0;m<r;m+=f){const h=Math.min(f,r-m);this._dispatchFFNRow(e,
n,p,g,o,m,h,s)}return p}const l=q(a,r*2*c*4);this._dispatchLinear(e,n,l,o.geglu.weight,o.geglu.bias,r,s,2*c);const d=q(a,
r*c*4);this._dispatchGEGLUActivation(e,l,d,r,c);const u=q(a,r*s*4);return this._dispatchLinear(e,d,u,o.proj.weight,o.proj.
bias,r,c,s),u}_dispatchGEGLUActivation(e,n,o,r,s){const i=pe(r*s,ve),[a,c]=Se(i),l=this._cachedUniform(new Uint32Array([
r,s,a])),d=this.device.createBindGroup({layout:this.pipelines.geglu.getBindGroupLayout(0),entries:[{binding:0,resource:{
buffer:l}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}}]}),u=e.beginComputePass();u.setPipeline(this.
pipelines.geglu),u.setBindGroup(0,d),u.dispatchWorkgroups(a,c),u.end()}_dispatchLinear(e,n,o,r,s,i,a,c){const l=pe(i*c,ve),
[d,u]=Se(l),f=this._cachedUniform(new Uint32Array([i,a,c,d,1])),p=this.device.createBindGroup({layout:this.pipelines.linear.
getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:r}},
{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:o}}]}),g=e.beginComputePass();g.setPipeline(this.pipelines.linear),
g.setBindGroup(0,p),g.dispatchWorkgroups(d,u),g.end()}_dispatchLinearRange(e,n,o,r,s,i,a,c,l,d){const u=et(i,l,d),f=pe(u.
rowCount*c,ve),[p,g]=Se(f),m=this._cachedUniform(new Uint32Array([u.totalRows,a,c,u.rowStart,u.rowCount,p,1,0])),h=this.
device.createBindGroup({layout:this.pipelines.linearRange.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:m}},
{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:r}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:o}}]}),
w=e.beginComputePass();w.setPipeline(this.pipelines.linearRange),w.setBindGroup(0,h),w.dispatchWorkgroups(p,g),w.end()}_dispatchLinearNoBias(e,n,o,r,s,i,a){
(!this._zeroBias||this._zeroBiasSize<a)&&(this._zeroBiasSize=a,this._zeroBias=je(this.device,new Float32Array(a))),this.
_dispatchLinear(e,n,o,r,this._zeroBias,s,i,a)}_dispatchLayerNorm(e,n,o,r,s,i){const a=new ArrayBuffer(16),c=new DataView(
a);c.setUint32(0,s,!0),c.setUint32(4,i,!0),c.setFloat32(8,oe.eps,!0);const l=this._cachedUniform(new Uint8Array(a)),d=this.
device.createBindGroup({layout:this.pipelines.layerNorm.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:l}},{
binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:r.weight}},{binding:3,resource:{buffer:r.bias}},{binding:4,resource:{
buffer:o}}]}),u=e.beginComputePass();u.setPipeline(this.pipelines.layerNorm),u.setBindGroup(0,d),u.dispatchWorkgroups(s),
u.end()}_dispatchGroupNorm(e,n,o,r,s,i){const a=this.device,c=r*s,l=pe(c,ve),[d,u]=Se(l),f=new ArrayBuffer(24),p=new Uint32Array(
f),g=new Float32Array(f);p[0]=r,p[1]=1,p[2]=s,p[3]=i,g[4]=oe.eps,p[5]=d;const m=this._cachedUniform(new Uint8Array(f)),h=q(
a,i*2*4),w=q(a,c*4),b=a.createBindGroup({layout:this._gnLayout,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{
buffer:n}},{binding:2,resource:{buffer:o.weight}},{binding:3,resource:{buffer:o.bias}},{binding:4,resource:{buffer:w}},{
binding:5,resource:{buffer:h}}]});let y=e.beginComputePass();y.setPipeline(this.pipelines.gnStats),y.setBindGroup(0,b),y.
dispatchWorkgroups(pe(i,ve)),y.end();const _=a.createBindGroup({layout:this._gnLayout,entries:[{binding:0,resource:{buffer:m}},
{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o.weight}},{binding:3,resource:{buffer:o.bias}},{binding:4,resource:{
buffer:w}},{binding:5,resource:{buffer:h}}]});return y=e.beginComputePass(),y.setPipeline(this.pipelines.gnNorm),y.setBindGroup(
0,_),y.dispatchWorkgroups(d,u),y.end(),w}_dispatchTranspose(e,n,o,r,s){this.pipelines.transpose2d||(this.pipelines.transpose2d=
this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:`
              struct P { rows: u32, cols: u32, numWgX: u32 }
              @group(0) @binding(0) var<uniform> p: P;
              @group(0) @binding(1) var<storage, read> input: array<f32>;
              @group(0) @binding(2) var<storage, read_write> output: array<f32>;
              @compute @workgroup_size(256)
              fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
                let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
                if (idx >= p.rows * p.cols) { return; }
                let r = idx / p.cols;
                let c = idx % p.cols;
                output[c * p.rows + r] = input[r * p.cols + c];
              }
            `}),entryPoint:"main"}}));const i=r*s,a=pe(i,ve),[c,l]=Se(a),d=this._cachedUniform(new Uint32Array([r,s,c])),
u=this.device.createBindGroup({layout:this.pipelines.transpose2d.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},
{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}}]}),f=e.beginComputePass();f.setPipeline(this.pipelines.transpose2d),
f.setBindGroup(0,u),f.dispatchWorkgroups(c,l),f.end()}_dispatchAdd(e,n,o,r){const s=pe(r,ve),[i,a]=Se(s),c=this._cachedUniform(
new Uint32Array([r,i])),l=this.device.createBindGroup({layout:this.pipelines.add.getBindGroupLayout(0),entries:[{binding:0,
resource:{buffer:n}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:c}}]}),d=e.beginComputePass();d.setPipeline(
this.pipelines.add),d.setBindGroup(0,l),d.dispatchWorkgroups(i,a),d.end()}_dispatchConcat(e,n,o,r,s,i){const a=s+i,c=pe(
a,ve),[l,d]=Se(c),u=this._cachedUniform(new Uint32Array([s,i,l])),f=this.device.createBindGroup({layout:this.pipelines.concat.
getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:r}},
{binding:3,resource:{buffer:u}}]}),p=e.beginComputePass();p.setPipeline(this.pipelines.concat),p.setBindGroup(0,f),p.dispatchWorkgroups(
l,d),p.end()}}const Us="sf3d.two-stream-cooperative-boundaries.v0",vr="two-stream-stages",Hs="sf3d.two-stream-attention-\
cooperative-boundaries.v0",_r="two-stream-attention-duties",Rt=Ne.length;function Xs(t={}){const{dutyGranularity:e="stag\
e",N_img:n,linearRowsPerDuty:o=128,attentionRowsPerDuty:r=128,residentFFN:s=!1,reuseDeadTriplaneStorage:i=!1,reuseAttentionResidualStorage:a=!1,
reuseAttentionQueryStorage:c=!1,reuseAttentionProjectionStorage:l=!1,reuseTokenizerSetupStorage:d=!1}=t;if(!["stage","at\
tention-tile"].includes(e))throw new RangeError(`unknown two-stream duty granularity ${e}`);const u=e==="attention-tile"?
In(n,{linearRowsPerDuty:o,attentionRowsPerDuty:r,residentFFN:s}):null,f=u?_r:vr,p=u?.length??Rt;return ut({manifestId:u?
Hs:Us,routeId:Xe,phases:[{phaseId:"two-stream-backbone",boundaries:[{boundaryId:f,kind:"gpu-command",unit:u?"two-stream-\
attention-duty":"two-stream-stage",totalItems:p,progressWeight:p,commandDutyKind:"compute",chunking:{mode:"fixed",chunkItems:1},
yieldPolicy:"after-duty",resources:{retain:["dinov2.tokens","triplane.low-resolution","two-stream.weights","two-stream.i\
ntermediates"],produce:["two-stream.triplane-features"],release:[]}}]}],metadata:{source:"sf3d-webgpu-cooperative-two-st\
ream",dutyGranularity:e,linearRowsPerDuty:u?o:null,attentionRowsPerDuty:u?r:null,residentFFN:s,reuseDeadTriplaneStorage:i,
reuseAttentionResidualStorage:a,reuseAttentionQueryStorage:c,reuseAttentionProjectionStorage:l,reuseTokenizerSetupStorage:d}})}
async function Vs(t,e){const{encodeStage:n,now:o=()=>globalThis.performance?.now?.()??Date.now()}=e;if(e.submitStage!=null)
throw new TypeError("submitStage is unsupported: the kit owns queue.submit (>=0.1.41); encodeStage must return the comma\
nd buffer");const r=t.startBoundary(vr),s=[];for(let i=0;i<Rt;i++){const a=r.nextRange();if(!a)throw new Error(`cooperat\
ive two-stream exhausted ranges before stage ${i}`);if(a.itemStart!==i||a.itemEnd!==i+1)throw new Error(`cooperative two\
-stream range ${a.itemStart}-${a.itemEnd} does not match stage ${i}`);const c=Ne[i],l={stageIndex:i,stageId:c,dutyStartedAtMs:o(),
encodeStartedAtMs:null,encodeCompletedAtMs:null,submitStartedAtMs:null,submitCompletedAtMs:null,dutyCompletedAtMs:null,encodeMs:null,
submitMs:null,dutyMs:null};await r.runGpuDuty(a,{encode(){l.encodeStartedAtMs=o();const d=n({stageIndex:i,stageId:c,range:a});
return l.encodeCompletedAtMs=o(),l.encodeMs=l.encodeCompletedAtMs-l.encodeStartedAtMs,d}}),l.dutyCompletedAtMs=o(),l.dutyMs=
l.dutyCompletedAtMs-l.dutyStartedAtMs,s.push(Object.freeze(l))}if(r.nextRange()!=null)throw new Error("cooperative two-s\
tream left ranges unconsumed");return{completedDuties:s.length,totalDuties:Rt,telemetry:Object.freeze(s)}}async function Ys(t,e){
const{plan:n,encodeDuty:o,now:r=()=>globalThis.performance?.now?.()??Date.now()}=e;if(e.submitDuty!=null)throw new TypeError(
"submitDuty is unsupported: the kit owns queue.submit (>=0.1.41); encodeDuty must return the command buffer");const s=t.
startBoundary(_r),i=[],a=async c=>{await e.beforeDuty?.(c);const l=s.nextRange();if(!l)throw new Error(`cooperative two-\
stream attention exhausted ranges before duty ${c.dutyIndex}`);if(l.itemStart!==c.dutyIndex||l.itemEnd!==c.dutyIndex+1)throw new Error(
`cooperative two-stream attention range ${l.itemStart}-${l.itemEnd} does not match duty ${c.dutyIndex}`);const d={dutyIndex:c.
dutyIndex,dutyId:c.dutyId,kind:c.kind,ownerId:c.ownerId??null,tileIndex:c.tileIndex??null,tileCount:c.tileCount??null,rangeIndex:c.
rangeIndex??null,rangeCount:c.rangeCount??null,rowStart:c.rowStart??null,rowCount:c.rowCount??null,rowEnd:c.rowEnd??null,
dutyStartedAtMs:r(),encodeStartedAtMs:null,encodeCompletedAtMs:null,submitStartedAtMs:null,submitCompletedAtMs:null,dutyCompletedAtMs:null,
encodeMs:null,submitMs:null,dutyMs:null};await s.runGpuDuty(l,{encode(){d.encodeStartedAtMs=r();const u=o({duty:c,range:l});
return d.encodeCompletedAtMs=r(),d.encodeMs=d.encodeCompletedAtMs-d.encodeStartedAtMs,u}}),d.dutyCompletedAtMs=r(),d.dutyMs=
d.dutyCompletedAtMs-d.dutyStartedAtMs,i.push(Object.freeze(d)),await e.afterDuty?.(c)};for(const c of Ks(n)){const l=async()=>{
for(const d of c.duties)await a(d)};e.withDutyGroup?await e.withDutyGroup(c,l):await l()}if(s.nextRange()!=null)throw new Error(
"cooperative two-stream attention left ranges unconsumed");return{completedDuties:i.length,totalDuties:n.length,telemetry:Object.
freeze(i)}}function Ks(t){const e=[];for(const n of t){const o=n.kind==="setup"||n.kind==="final"?n.kind:n.basic!=null?`\
block-${n.block}-basic-${n.basic}`:n.kind==="attention-tile"?n.ownerId.replace(/-(self|cross)$/,""):`block-${n.block}-fu\
se-${n.direction}`;e.at(-1)?.stageId!==o&&e.push({stageId:o,duties:[]}),e.at(-1).duties.push(n)}return e}async function jn(t,e=new Set){
const n=t._residentWorkOwner;if(!n&&!t._failedUniforms?.size)return;if(n){for(const r of n.allocations)n.buffers.add(r.buffer);
n.allocations.length=0}await t.device.queue.onSubmittedWorkDone();const o=[];for(const r of t._failedUniforms??[])try{r.
destroy(),t._failedUniforms.delete(r)}catch(s){o.push(s)}for(const r of n?.buffers??[])if(!e.has(r))try{r.destroy(),n.buffers.
delete(r),t._zeroBias===r&&(t._zeroBias=null,t._zeroBiasSize=0);for(const[s,i]of Object.entries(t._diagnosticBuffers??{}))
i===r&&delete t._diagnosticBuffers[s]}catch(s){o.push(s)}if(o.length)throw new AggregateError(o,"two-stream work retirem\
ent failed");(!n||n.buffers.size===0)&&(t._residentWorkOwner=null)}function Zs(t,e){const n=new Set,o=new Set,r=e._residentWorkOwner.
buffers,s=i=>{if(!(!i||typeof i!="object"||o.has(i))){if(o.add(i),r.has(i)){n.add(i);return}for(const[a,c]of Object.entries(
i))a!=="weights"&&a!=="attnWeights"&&s(c)}};for(const i of[t.currentLatent,t.currentTriplane,t.activeOperation,t.result,
e._zeroBias])s(i);return n}async function Qs(t){const{device:e,backbone:n,imageTokensBuf:o,N_img:r,weights:s,schedulingMode:i="\
cooperative",dutyGranularity:a="stage",linearRowsPerDuty:c=128,attentionRowsPerDuty:l=128,residentFFN:d=!1,retireIntermediateBuffers:u=!1,
reuseDeadTriplaneStorage:f=!1,reuseAttentionResidualStorage:p=!1,reuseAttentionQueryStorage:g=!1,reuseAttentionProjectionStorage:m=!1,
reuseTokenizerSetupStorage:h=!1,rematerializeTokenizerEmbedding:w=!1,withGroupWeights:b=null,onProgress:y,signal:_,invocationId:x=`\
sf3d:two-stream:${i}`}=t;if(!["stage","attention-tile"].includes(a))throw new RangeError(`unknown two-stream duty granul\
arity ${a}`);if((d||u||b)&&a!=="attention-tile")throw TypeError("resident lifetimes require the exact attention-tile pla\
n");if(typeof f!="boolean"||f&&(!d||!u||a!=="attention-tile"))throw TypeError("dead-triplane reuse requires explicit res\
ident FFN and owned work retirement");if(typeof p!="boolean"||p&&!f)throw TypeError("attention residual reuse requires e\
xplicit owned dead-triplane reuse");if(typeof g!="boolean"||g&&(!d||!u||a!=="attention-tile"))throw TypeError("attention\
 query storage reuse requires owned resident attention duties");if(typeof m!="boolean"||m&&(!g||!p))throw TypeError("att\
ention projection row reuse requires owned query and residual reuse");if(b!==null&&typeof b!="function")throw TypeError(
"withGroupWeights must be a function");if(typeof h!="boolean"||h&&(!d||!u||!b||!w||a!=="attention-tile"))throw TypeError(
"tokenizer setup reuse requires owned resident work and canonical rematerialization");if(n._residentWorkOwner||n._failedUniforms?.
size)throw Error("two-stream work cleanup is quarantined");const k=a==="attention-tile"?In(r,{linearRowsPerDuty:c,attentionRowsPerDuty:l,
residentFFN:d}):null,R=()=>globalThis.performance?.now?.()??Date.now(),E=[],M=[];let D=null;const I=Nt(e,{foregroundOpportunities:t.
foregroundOpportunities??null,onQueueFenceResolved(V){E.push(Object.freeze({...D,...V}))},onBrowserYield(V){M.push(Object.
freeze({...D,...V}))}}),O=zt({runtime:I,manifest:Xs({dutyGranularity:a,N_img:r,linearRowsPerDuty:c,attentionRowsPerDuty:l,
residentFFN:d,reuseDeadTriplaneStorage:f,reuseAttentionResidualStorage:p,reuseAttentionQueryStorage:g,reuseAttentionProjectionStorage:m,
reuseTokenizerSetupStorage:h}),invocationId:x,schedulingMode:i,onProgress:y,signal:_}),G=k?n.createAttentionForwardState(
o,r,s,{linearRowsPerDuty:c,attentionRowsPerDuty:l,residentFFN:d,reuseDeadTriplaneStorage:f,reuseAttentionResidualStorage:p,
reuseAttentionQueryStorage:g,reuseAttentionProjectionStorage:m,reuseTokenizerSetupStorage:h,rematerializeTokenizerEmbedding:w}):
n.createForwardState(o,r,s);let v=[];if(k&&JSON.stringify(G.finePlan)!==JSON.stringify(k))throw Error("backbone effectiv\
e plan differs from declared cooperative plan");if(k&&(G.reuseAttentionQueryStorage??!1)!==g)throw Error("backbone effec\
tive attention query reuse differs from requested configuration");if(k&&(G.reuseAttentionProjectionStorage??!1)!==m)throw Error(
"backbone effective attention projection row reuse differs from requested configuration");const P=u?{allocations:[],buffers:new Set}:
null;P&&(n._residentWorkOwner=P);let C=!1,B,A=!1;const $=[],U=[],Y=[];let J=null;const X=V=>P?Ft(V,{ownedAllocations:P.allocations}).
value:V();try{await O.run(async F=>{v=(k?await Ys(F,{plan:k,now:R,beforeDuty:t.onBeforeDuty?j=>t.onBeforeDuty(j,G):null,
withDutyGroup:b?async(j,Z)=>b(j,async ee=>(G.weights=ee,Z())):null,async afterDuty(j){if(P){for(const Z of P.allocations)
P.buffers.add(Z.buffer);P.allocations.length=0,h&&j.kind==="setup"&&(J={...G.tokenizerSetupStorageReuse,status:"complete\
d-prefix",afterDutyIndex:j.dutyIndex}),m&&j.kind==="fuse-attention-linear-range"&&j.rangeIndex===j.rangeCount-1&&Y.push(
n._markFineAttentionProjectionReusable(G,j)),p&&j.kind==="fuse-attention-linear-range"&&j.rangeIndex===j.rangeCount-1&&U.
push(n._markFineAttentionResidualReusable(G,j)),f&&j.kind==="fuse-residual-norm"&&$.push(n._markFineFuseStorageReusable(
G,j)),await jn(n,Zs(G,n))}await t.onAfterDuty?.(j,G)},encodeDuty({duty:j}){D={dutyIndex:j.dutyIndex,dutyId:j.dutyId,kind:j.
kind,ownerId:j.ownerId??null,tileIndex:j.tileIndex??null,tileCount:j.tileCount??null,rangeIndex:j.rangeIndex??null,rangeCount:j.
rangeCount??null,rowStart:j.rowStart??null,rowCount:j.rowCount??null,rowEnd:j.rowEnd??null};const Z=e.createCommandEncoder(
{label:`two-stream-${j.dutyIndex}-${j.dutyId}`});return X(()=>n.dispatchAttentionForwardDuty(Z,G,j.dutyIndex)),Z.finish()}}):
await Vs(F,{now:R,encodeStage({stageIndex:j,stageId:Z}){D={stageIndex:j,stageId:Z};const ee=e.createCommandEncoder({label:`\
two-stream-${j}-${Z}`});return n.dispatchForwardStage(ee,G,j),ee.finish()}})).telemetry}),D=null;const V=n.getForwardResult(
G);return C=!0,{result:V,report:Object.freeze({...O.finish(),adapterTelemetry:Object.freeze({dutyGranularity:a,residentFFN:d,
reuseDeadTriplaneStorage:f,storageReuse:Object.freeze($),reuseAttentionResidualStorage:p,reuseAttentionQueryStorage:G.reuseAttentionQueryStorage??
!1,reuseAttentionProjectionStorage:G.reuseAttentionProjectionStorage??!1,attentionProjectionReuse:Object.freeze(Y),attentionResidualReuse:Object.
freeze(U),reuseTokenizerSetupStorage:h,tokenizerSetupStorageReuse:J,linearRowsPerDuty:k?c:null,attentionRowsPerDuty:k?l:
null,declaredDutyCount:k?.length??Rt,stageDuties:Object.freeze(v),queueFences:Object.freeze(E),browserYields:Object.freeze(
M)})})}}catch(V){throw A=!0,B=V,V}finally{if(P)try{await jn(n,C?new Set([G.result?.buffer]):new Set),n._residentWorkOwner=
null}catch(V){throw A?new AggregateError([B,V],"two-stream failed and cleanup is unresolved",{cause:B}):V}}}const Js=`
              struct P { Np: u32, C: u32, H: u32, W: u32, numWgX: u32 }
              @group(0) @binding(0) var<uniform> p: P;
              @group(0) @binding(1) var<storage, read> src: array<f32>;
              @group(0) @binding(2) var<storage, read_write> dst: array<f32>;
              @compute @workgroup_size(256)
              fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
                let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
                let total = p.Np * p.C * p.H * p.W;
                if (idx >= total) { return; }
                // idx iterates over destination [C, Np*H*W]
                let c = idx / (p.Np * p.H * p.W);
                let s = idx % (p.Np * p.H * p.W);
                let plane = s / (p.H * p.W);
                let hw = s % (p.H * p.W);
                // source layout: [Np, C, H, W]
                let srcIdx = plane * p.C * p.H * p.W + c * p.H * p.W + hw;
                dst[idx] = src[srcIdx];
              }
            `;function ei(t,e,n,o){if(o?.size!==28311552*4)throw Error("complete tokenizer embedding dimensions required");
n._rearrangePipeline||(n._rearrangePipeline=e.createComputePipeline({layout:"auto",compute:{module:e.createShaderModule(
{code:Js}),entryPoint:"main"}}));const l=Math.ceil(28311552/256),d=Math.min(l,65535),u=Math.ceil(l/65535),f=je(e,new Uint32Array(
[3,1024,96,96,d]),GPUBufferUsage.UNIFORM,"tokenizer-rearrange-uniform"),p=q(e,28311552*4),g=e.createBindGroup({layout:n.
_rearrangePipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:o}},{binding:2,
resource:{buffer:p}}]}),m=t.beginComputePass();return m.setPipeline(n._rearrangePipeline),m.setBindGroup(0,g),m.dispatchWorkgroups(
d,u),m.end(),p}const Ce={inChannels:1024,outChannels:40,scaleFactor:4,convLayers:4,planeSize:96,lastConvOut:640},be=Object.
freeze(["gather","conv-0-relu","conv-1-relu","conv-2-relu","conv-3","pixel-shuffle-copy"]),hn=Object.freeze([Ce.inChannels,
Ce.inChannels,Ce.inChannels,Ce.lastConvOut]);function Ir(t){const{outChannels:e,scaleFactor:n,planeSize:o}=Ce,r=o*n,s=o*
n,i=e*r*s;return{buffer:q(t,3*i*4),C:e,H:r,W:s,numPlanes:3}}function xr(t,e,n,o,r,s){const i=bn(t,n,o,r,s);for(let a=0;a<
be.length;a++)Tt(t,e,i,a)}function bn(t,e,n,o,r){if(!Number.isSafeInteger(r)||r<0||r>=3)throw new RangeError("postproces\
sor plane must be an integer in [0, 3)");if(!t||!e||!n||!o?.buffer)throw new TypeError("postprocessor plane state requir\
es device, input, weights, and output");if(!Array.isArray(n.convLayers)||n.convLayers.length!==Ce.convLayers)throw new RangeError(
`postprocessor requires exactly ${Ce.convLayers} convolution layers`);return{device:t,triplanesBuf:e,weights:n,output:o,
plane:r,nextStageIndex:0,channelStage:null,current:null,complete:!1}}function ti(t,e,n,o){if(t!==n?.device)throw new Error(
"postprocessor plane state belongs to a different GPUDevice");if(!o||o.plane!==n.plane)throw new Error(`postprocessor ch\
annel duty belongs to plane ${o?.plane}`);if(o.kind==="gather"){if(o.stageIndex!==0||n.nextStageIndex!==0||n.channelStage)
throw new Error(`postprocessor plane ${n.plane} expected gather stage 0`);return Tt(t,e,n,0)}if(o.kind==="pixel-shuffle-\
copy"){if(o.stageIndex!==5||n.nextStageIndex!==5||n.channelStage)throw new Error(`postprocessor plane ${n.plane} expecte\
d PixelShuffle stage 5`);return Tt(t,e,n,5)}if(o.kind!=="conv-range")throw new Error(`unsupported postprocessor channel \
duty kind ${o.kind}`);if(!Number.isSafeInteger(o.stageIndex)||o.stageIndex<1||o.stageIndex>4||o.stageIndex!==n.nextStageIndex)
throw new Error(`postprocessor plane ${n.plane} expected stage ${n.nextStageIndex}, got ${o.stageIndex}`);const r=o.stageIndex-
1,s=hn[r],i=r===Ce.convLayers-1;if(o.layerIndex!==r||o.totalChannels!==s||!Number.isSafeInteger(o.rangeIndex)||!Number.isSafeInteger(
o.rangeCount)||o.rangeCount<=0||!Number.isSafeInteger(o.channelStart)||!Number.isSafeInteger(o.channelCount)||o.channelCount<=
0||o.channelEnd!==o.channelStart+o.channelCount||o.channelEnd>s)throw new Error(`invalid postprocessor channel duty for ${o.
stageId}`);if(!n.channelStage){if(o.rangeIndex!==0||o.channelStart!==0)throw new Error(`postprocessor ${o.stageId} must \
begin at output channel 0`);const d=n.current;if(!d?.buffer)throw new Error(`postprocessor ${o.stageId} has no input buf\
fer`);const u=Math.floor((d.outH+2-3)/1)+1,f=Math.floor((d.outW+2-3)/1)+1,p=q(t,s*u*f*4);n.channelStage={layerIndex:r,stageIndex:o.
stageIndex,stageId:o.stageId,rangeCount:o.rangeCount,nextRangeIndex:0,nextChannelStart:0,input:d,outputBuffer:p,outC:s,outH:u,
outW:f}}const a=n.channelStage;if(a.layerIndex!==r||a.stageIndex!==o.stageIndex||a.stageId!==o.stageId||a.rangeCount!==o.
rangeCount||o.rangeIndex!==a.nextRangeIndex||o.channelStart!==a.nextChannelStart)throw new Error(`postprocessor ${o.stageId}\
 expected range ${a.nextRangeIndex} at channel ${a.nextChannelStart}`);Hr(t,e,a.input.buffer,n.weights.convLayers[r].weight,
n.weights.convLayers[r].bias,a.outputBuffer,{inC:a.input.outC,inH:a.input.outH,inW:a.input.outW,outC:s,kH:3,kW:3,padH:1,
padW:1,strideH:1,strideW:1,applyRelu:!i,resourceContext:n.resourceContext},{channelStart:o.channelStart,channelCount:o.channelCount}),
a.nextRangeIndex++,a.nextChannelStart=o.channelEnd;const c=a.nextRangeIndex===a.rangeCount,l=a.nextChannelStart===s;if(c!==
l)throw new Error(`postprocessor ${o.stageId} range count disagrees with channel coverage`);return c&&(n.current={buffer:a.
outputBuffer,outC:s,outH:a.outH,outW:a.outW},n.channelStage=null,n.nextStageIndex++),{plane:n.plane,stageIndex:o.stageIndex,
stageId:o.stageId,rangeIndex:o.rangeIndex,rangeCount:o.rangeCount,channelStart:o.channelStart,channelEnd:o.channelEnd,complete:n.
complete}}function Tt(t,e,n,o){if(t!==n?.device)throw new Error("postprocessor plane state belongs to a different GPUDev\
ice");if(!Number.isSafeInteger(o)||o<0||o>=be.length)throw new RangeError(`postprocessor stage must be an integer in [0,\
 ${be.length})`);if(o!==n.nextStageIndex)throw new Error(`postprocessor plane ${n.plane} expected stage ${n.nextStageIndex}\
, got ${o}`);const{inChannels:r,scaleFactor:s,planeSize:i,lastConvOut:a}=Ce,c=i*i,l=r*c;if(o===0){const d=q(t,l*4);ri(t,
e,n.triplanesBuf,d,r,i*i*3,n.plane*c,c,n.resourceContext),n.current={buffer:d,outC:r,outH:i,outW:i}}else if(o<=4){const d=o-
1,u=d===Ce.convLayers-1,f=u?a:r,p=Xr(t,e,n.current.buffer,n.weights.convLayers[d].weight,n.weights.convLayers[d].bias,{inC:n.
current.outC,inH:n.current.outH,inW:n.current.outW,outC:f,kH:3,kW:3,padH:1,padW:1,strideH:1,strideW:1});if(u)n.current={
buffer:p.buffer,outC:f,outH:p.outH,outW:p.outW};else{const g=Vr(t,e,p.buffer,null,f*p.outH*p.outW,0);n.current={buffer:g,
outC:f,outH:p.outH,outW:p.outW}}}else{const d=Yr(t,e,n.current.buffer,{inC:a,inH:i,inW:i,scaleFactor:s,resourceContext:n.
resourceContext}),u=n.output.C*n.output.H*n.output.W,f=n.plane*u*4;e.copyBufferToBuffer(d.buffer,0,n.output.buffer,f,u*4),
n.complete=!0}return n.nextStageIndex++,{plane:n.plane,stageIndex:o,stageId:be[o],complete:n.complete}}function ni(t,e,n,o){
const r=Ir(t);for(let s=0;s<r.numPlanes;s++)xr(t,e,n,o,r,s);return r}let Ln=null;function ri(t,e,n,o,r,s,i,a,c=null){if(c&&
(c.device!==t||!(c.pipelines instanceof Map)))throw new Error("gather resource context belongs to another device");let l=c?
c.pipelines.get("gather"):Ln;l||(l=t.createComputePipeline({layout:"auto",compute:{module:t.createShaderModule({code:`
            struct P { numChannels: u32, totalSpatial: u32, spatialOffset: u32, spatialSize: u32, numWgX: u32 }
            @group(0) @binding(0) var<uniform> p: P;
            @group(0) @binding(1) var<storage, read> src: array<f32>;
            @group(0) @binding(2) var<storage, read_write> dst: array<f32>;
            @compute @workgroup_size(256)
            fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
              let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
              let total = p.numChannels * p.spatialSize;
              if (idx >= total) { return; }
              let c = idx / p.spatialSize;
              let s = idx % p.spatialSize;
              dst[c * p.spatialSize + s] = src[c * p.totalSpatial + p.spatialOffset + s];
            }
          `}),entryPoint:"main"}}),c?c.pipelines.set("gather",l):Ln=l);const d=r*a,u=Math.ceil(d/256),f=Math.min(u,65535),
p=Math.ceil(u/65535),g=cr(t,new Uint32Array([r,s,i,a,f]),"post-processor-gather-uniform"),m=t.createBindGroup({layout:l.
getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}}]}),
h=e.beginComputePass();h.setPipeline(l),h.setBindGroup(0,m),h.dispatchWorkgroups(f,p),h.end()}const oi="sf3d.post-proces\
sor-cooperative-boundaries.v0",Sr="post-processor-triplane-planes",ot=3,si="sf3d.post-processor-layer-cooperative-bounda\
ries.v0",Br="post-processor-triplane-stages",ii="sf3d.post-processor-channel-cooperative-boundaries.v0",Er="post-process\
or-triplane-channel-ranges",$t=ot*be.length;function Ar(t){const e=[];for(let o=0;o<ot;o++){e.push({plane:o,kind:"gather",
stageIndex:0,stageId:be[0]});for(let r=0;r<hn.length;r++){const s=hn[r],i=Math.ceil(s/t);for(let a=0;a<i;a++){const c=a*
t,l=Math.min(s,c+t);e.push({plane:o,kind:"conv-range",stageIndex:r+1,stageId:be[r+1],layerIndex:r,rangeIndex:a,rangeCount:i,
channelStart:c,channelCount:l-c,channelEnd:l,totalChannels:s})}}e.push({plane:o,kind:"pixel-shuffle-copy",stageIndex:be.
length-1,stageId:be.at(-1)})}const n=e.length;return Object.freeze({channelsPerDuty:t,duties:Object.freeze(e.map((o,r)=>Object.
freeze({...o,dutyIndex:r,totalDuties:n,channelsPerDuty:t})))})}function Pr(t){if(!Number.isSafeInteger(t)||t<=0)throw new TypeError(
"channelsPerDuty must be a positive safe integer");return Ar(t)}function ai(t){if(!t||!Number.isSafeInteger(t.channelsPerDuty)||
t.channelsPerDuty<=0||!Array.isArray(t.duties))throw new TypeError("invalid postprocessor channel duty plan");const e=Ar(
t.channelsPerDuty);if(t.duties.length!==e.duties.length)throw new Error("postprocessor channel duty plan has the wrong d\
uty count");for(let n=0;n<e.duties.length;n++){const o=t.duties[n],r=e.duties[n];for(const s of Object.keys(r))if(o?.[s]!==
r[s])throw new Error(`postprocessor channel duty plan mismatch at duty ${n} field ${s}`)}return e}function ui(t=ot){if(!Number.
isSafeInteger(t)||t<=0)throw new TypeError("numPlanes must be a positive safe integer");if(t!==ot)throw new RangeError(`\
SF3D postprocessor must declare exactly ${ot} planes`);return ut({manifestId:oi,routeId:Xe,phases:[{phaseId:"triplane-po\
st-processor",boundaries:[{boundaryId:Sr,kind:"gpu-command",unit:"triplane-plane",totalItems:t,progressWeight:t,commandDutyKind:"\
compute",chunking:{mode:"fixed",chunkItems:1},yieldPolicy:"after-duty",resources:{retain:["triplane.low-resolution","pos\
t-processor.weights"],produce:["triplane.high-resolution"],release:[]}}]}],metadata:{source:"sf3d-webgpu-cooperative-pos\
t-processor"}})}function ci(){return ut({manifestId:si,routeId:Xe,phases:[{phaseId:"triplane-post-processor",boundaries:[
{boundaryId:Br,kind:"gpu-command",unit:"post-processor-stage",totalItems:$t,progressWeight:$t,commandDutyKind:"compute",
chunking:{mode:"fixed",chunkItems:1},yieldPolicy:"after-duty",resources:{retain:["triplane.low-resolution","post-process\
or.weights","post-processor.intermediates"],produce:["triplane.high-resolution"],release:[]}}]}],metadata:{source:"sf3d-\
webgpu-cooperative-post-processor-layers"}})}function li(t){const e=Pr(t);return ut({manifestId:ii,routeId:Xe,phases:[{phaseId:"\
triplane-post-processor",boundaries:[{boundaryId:Er,kind:"gpu-command",unit:"post-processor-channel-duty",totalItems:e.duties.
length,progressWeight:e.duties.length,commandDutyKind:"compute",chunking:{mode:"fixed",chunkItems:1},yieldPolicy:"after-\
duty",resources:{retain:["triplane.low-resolution","post-processor.weights","post-processor.intermediates"],produce:["tr\
iplane.high-resolution"],release:[]},metadata:{channelsPerDuty:t}}]}],metadata:{source:"sf3d-webgpu-cooperative-post-pro\
cessor-channels",channelsPerDuty:t}})}async function di(t,e){const{numPlanes:n=ot,encodePlane:o}=e,r=t.startBoundary(Sr);
let s=0;for(let i=0;i<n;i++){const a=r.nextRange();if(!a)throw new Error(`cooperative postprocessor exhausted ranges bef\
ore plane ${i}`);if(a.itemStart!==i||a.itemEnd!==i+1)throw new Error(`cooperative postprocessor range ${a.itemStart}-${a.
itemEnd} does not match plane ${i}`);await r.runGpuDuty(a,{encode:()=>o({plane:i,range:a})}),s++}if(r.nextRange()!=null)
throw new Error("cooperative postprocessor left ranges unconsumed");return{completedPlanes:s,totalPlanes:n}}async function fi(t,e){
const{encodeStage:n,now:o=()=>globalThis.performance?.now?.()??Date.now()}=e,r=t.startBoundary(Br),s=[];for(let i=0;i<$t;i++){
const a=r.nextRange();if(!a)throw new Error(`cooperative postprocessor exhausted ranges before duty ${i}`);if(a.itemStart!==
i||a.itemEnd!==i+1)throw new Error(`cooperative postprocessor range ${a.itemStart}-${a.itemEnd} does not match duty ${i}`);
const c=Math.floor(i/be.length),l=i%be.length,d=be[l],u={dutyIndex:i,plane:c,stageIndex:l,stageId:d,dutyStartedAtMs:o(),
encodeStartedAtMs:null,encodeCompletedAtMs:null,submitStartedAtMs:null,submitCompletedAtMs:null,dutyCompletedAtMs:null,encodeMs:null,
submitMs:null,dutyMs:null};await r.runGpuDuty(a,{encode:()=>{u.encodeStartedAtMs=o();const f=n({dutyIndex:i,plane:c,stageIndex:l,
stageId:d,range:a});return u.encodeCompletedAtMs=o(),u.encodeMs=u.encodeCompletedAtMs-u.encodeStartedAtMs,f}}),u.dutyCompletedAtMs=
o(),u.dutyMs=u.dutyCompletedAtMs-u.dutyStartedAtMs,s.push(Object.freeze(u))}if(r.nextRange()!=null)throw new Error("coop\
erative postprocessor left ranges unconsumed");return{completedDuties:s.length,totalDuties:$t,telemetry:Object.freeze(s)}}
async function pi(t,e){const{plan:n,encodeDuty:o,now:r=()=>globalThis.performance?.now?.()??Date.now()}=e,s=ai(n);for(const l of[
"beforeDuty","afterDuty","withDutyGroup"])if(e[l]!=null&&typeof e[l]!="function")throw new TypeError(l+" must be a funct\
ion");const i=t.startBoundary(Er),a=[],c=async l=>{await e.beforeDuty?.(l);const d=i.nextRange();if(!d)throw new Error(`\
cooperative postprocessor exhausted ranges before channel duty ${l.dutyIndex}`);if(d.itemStart!==l.dutyIndex||d.itemEnd!==
l.dutyIndex+1)throw new Error(`cooperative postprocessor range ${d.itemStart}-${d.itemEnd} does not match channel duty ${l.
dutyIndex}`);const u={...l,dutyStartedAtMs:r(),encodeStartedAtMs:null,encodeCompletedAtMs:null,submitStartedAtMs:null,submitCompletedAtMs:null,
dutyCompletedAtMs:null,encodeMs:null,submitMs:null,dutyMs:null};await i.runGpuDuty(d,{encode:()=>{u.encodeStartedAtMs=r();
const f=o(l,d);return u.encodeCompletedAtMs=r(),u.encodeMs=u.encodeCompletedAtMs-u.encodeStartedAtMs,f}}),u.dutyCompletedAtMs=
r(),u.dutyMs=u.dutyCompletedAtMs-u.dutyStartedAtMs,a.push(Object.freeze(u)),await e.afterDuty?.(l)};for(let l=0;l<s.duties.
length;){const d=s.duties[l];let u=l+1;for(;u<s.duties.length&&s.duties[u].plane===d.plane&&s.duties[u].stageIndex===d.stageIndex;)
u++;const f=Object.freeze({plane:d.plane,stageIndex:d.stageIndex,stageId:d.stageId,kind:d.kind,layerIndex:d.layerIndex??
null,duties:Object.freeze(s.duties.slice(l,u))});let p=!1,g=!1;const m=async()=>{if(p)throw new Error("postprocessor dut\
y group may execute exactly once");p=!0;for(const h of f.duties)await c(h);g=!0};if(e.withDutyGroup?await e.withDutyGroup(
f,m):await m(),!g)throw new Error("postprocessor duty group did not execute completely");l=u}if(i.nextRange()!=null)throw new Error(
"cooperative postprocessor left channel ranges unconsumed");return{completedDuties:a.length,totalDuties:s.duties.length,
telemetry:Object.freeze(a)}}async function mi(t){const{device:e,triplanesBuf:n,weights:o,schedulingMode:r="cooperative",
dutyGranularity:s="plane",channelsPerDuty:i=16,onProgress:a,signal:c,invocationId:l=`sf3d:post-processor:${r}`,completionPolicy:d="\
strict-prefix",maxInFlightGpuDuties:u=null}=t,f=t.residentWork??null,p=t.withGroupWeights??null;if(f||p||t.onBeforeDuty||
t.onAfterDuty){if(s!=="channel-range"||r!=="cooperative"||d!=="strict-prefix")throw new Error("resident postprocessor ho\
oks require cooperative strict-prefix channel-range execution");for(const I of["onBeforeDuty","onAfterDuty","withGroupWe\
ights"])if(t[I]!=null&&typeof t[I]!="function")throw new TypeError(I+" must be a function")}if(f&&(f.device!==e||f._postProcessorWorkOwner))
throw new Error("postprocessor work device mismatch or cleanup is quarantined");if(f&&typeof t.onBeforeDuty!="function")
throw new TypeError("resident postprocessor requires a fresh pre-allocation observer");if(!["plane","layer","channel-ran\
ge"].includes(s))throw new RangeError(`unsupported postprocessor duty granularity: ${s}`);if(!Number.isSafeInteger(i)||i<=
0)throw new TypeError("channelsPerDuty must be a positive safe integer");if(!["strict-prefix","bounded-prefix"].includes(
d))throw new RangeError(`completionPolicy must be strict-prefix or bounded-prefix; got ${d}`);if(d==="bounded-prefix"){if(s!==
"channel-range")throw new RangeError(`bounded-prefix completion is only supported for channel-range duties; got ${s}`);if(r!==
"cooperative")throw new RangeError("bounded-prefix completion requires cooperative scheduling");if(!Number.isSafeInteger(
u)||u<=0)throw new TypeError("bounded-prefix completion requires a positive maxInFlightGpuDuties")}else if(u!=null)throw new TypeError(
"maxInFlightGpuDuties is available only with bounded-prefix completion");const g=s==="channel-range"?Pr(i):null,m=s==="c\
hannel-range"?li(i):s==="layer"?ci():ui(),h=[],w=[],b=Nt(e,{foregroundOpportunities:t.foregroundOpportunities??null,onQueueFenceResolved:I=>h.
push(Object.freeze({...I})),onBrowserYield:I=>w.push(Object.freeze({...I}))}),y=zt({runtime:b,manifest:m,invocationId:l,
schedulingMode:r,onProgress:a,signal:c,completionPolicy:d,...d==="bounded-prefix"?{maxInFlightGpuDuties:u}:{}}),_=f?{allocations:[],
buffers:new Set,resourceContext:{device:e,pipelines:new Map}}:null;_&&(f._postProcessorWorkOwner=_);const x=I=>_?Ft(I,{ownedAllocations:_.
allocations}).value:I();let k,R=!1,E=!1,M,D=[];try{t.onBeforeDuty&&await t.onBeforeDuty({kind:"output-allocation",workGpuBytes:70778880,
plane:null,dutyIndex:null},null),k=x(()=>Ir(e)),await y.run(async O=>{if(s==="channel-range"){const G=Array(k.numPlanes).
fill(null),v=C=>(G[C]||(G[C]=bn(e,n,o,k,C),_&&(G[C].resourceContext=_.resourceContext)),G[C]);D=(await pi(O,{plan:g,beforeDuty:t.
onBeforeDuty?C=>t.onBeforeDuty({...C,...gi(C)},v(C.plane)):null,withDutyGroup:p?async(C,B)=>p(C,async A=>{const $=v(C.plane);
$.weights=A;try{return await B()}finally{$.weights={convLayers:[null,null,null,null]}}}):null,async afterDuty(C){const B=v(
C.plane);if(_){const A=new Set([k.buffer]);B.complete||(B.current?.buffer&&A.add(B.current.buffer),B.channelStage&&(A.add(
B.channelStage.input.buffer),A.add(B.channelStage.outputBuffer))),await Un(f,A)}await t.onAfterDuty?.(C,B)},encodeDuty(C){
const B=v(C.plane),A=e.createCommandEncoder({label:`post-processor-plane-${C.plane}-${C.stageId}`+(C.kind==="conv-range"?
`-${C.rangeIndex}`:"")});return x(()=>ti(e,A,B,C)),A.finish()}})).telemetry;return}if(s==="layer"){const G=Array(k.numPlanes).
fill(null);D=(await fi(O,{encodeStage({plane:P,stageIndex:C,stageId:B}){G[P]||(G[P]=bn(e,n,o,k,P));const A=e.createCommandEncoder(
{label:`post-processor-plane-${P}-${B}`});return Tt(e,A,G[P],C),A.finish()}})).telemetry;return}await di(O,{numPlanes:k.
numPlanes,encodePlane({plane:G}){const v=e.createCommandEncoder({label:`post-processor-plane-${G}`});return xr(e,v,n,o,k,
G),v.finish()}})});const I=y.finish();return R=!0,{result:k,report:Object.freeze({...I,adapterTelemetry:Object.freeze({dutyGranularity:s,
residentWork:!!_,channelsPerDuty:s==="channel-range"?i:null,stageDuties:Object.freeze(D),queueFences:Object.freeze(h),browserYields:Object.
freeze(w)})})}}catch(I){throw E=!0,M=I,I}finally{if(_)try{await Un(f,R?new Set([k.buffer]):new Set),R&&_.buffers.delete(
k.buffer),f._postProcessorWorkOwner=null}catch(I){throw E?new AggregateError([M,I],"postprocessor failed and cleanup is \
unresolved",{cause:M}):I}}}function gi(t){if(t.kind==="gather")return{workGpuBytes:1024*96*96*4+20};if(t.kind==="pixel-s\
huffle-copy")return{workGpuBytes:40*384*384*4+24};if(t.kind==="conv-range")return{workGpuBytes:(t.rangeIndex===0?t.totalChannels*
96*96*4:0)+64};throw new Error("exact postprocessor duty required")}async function Un(t,e=new Set){const n=t._postProcessorWorkOwner;
if(!n)return;for(const r of n.allocations)n.buffers.add(r.buffer);n.allocations.length=0,await t.device.queue.onSubmittedWorkDone();
const o=[];for(const r of n.buffers)if(!e.has(r))try{r.destroy(),n.buffers.delete(r)}catch(s){o.push(s)}if(o.length)throw new AggregateError(
o,"postprocessor work retirement failed")}const hi=`/**
 * Grid sample (bilinear) compute shader.
 *
 * Implements torch.nn.functional.grid_sample with:
 *   - mode='bilinear'
 *   - align_corners=True
 *   - padding_mode='zeros' (out-of-bound → 0)
 *
 * Used for SF3D's triplane query: sample features from 3 planes at
 * arbitrary 2D coordinates derived from 3D positions.
 *
 * Input feature map: [C, H, W]
 * Grid coordinates: [N, 2] (normalized [-1, 1])
 * Output: [N, C]
 */

struct Params {
  C: u32,    // channels
  H: u32,    // input height
  W: u32,    // input width
  N: u32,    // number of sample points
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;   // [C, H, W]
@group(0) @binding(2) var<storage, read> grid: array<f32>;    // [N, 2] (x, y in [-1, 1])
@group(0) @binding(3) var<storage, read_write> output: array<f32>; // [N, C]

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn grid_sample_main(@builtin(global_invocation_id) gid: vec3<u32>,
                    @builtin(workgroup_id) wgid: vec3<u32>,
                    @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let total = params.N * params.C;
  if (idx >= total) { return; }

  let n = idx / params.C;
  let c = idx % params.C;

  // Grid coordinates in [-1, 1], align_corners=True:
  // pixel = (grid + 1) / 2 * (size - 1)
  let gx = grid[n * 2];
  let gy = grid[n * 2 + 1];

  let px = (gx + 1.0) * 0.5 * f32(params.W - 1);
  let py = (gy + 1.0) * 0.5 * f32(params.H - 1);

  let x0 = i32(floor(px));
  let y0 = i32(floor(py));
  let x1 = x0 + 1;
  let y1 = y0 + 1;

  let fx = px - f32(x0);
  let fy = py - f32(y0);

  let H = i32(params.H);
  let W = i32(params.W);

  // Sample 4 corners with bounds checking (zeros padding)
  var v00: f32 = 0.0;
  var v01: f32 = 0.0;
  var v10: f32 = 0.0;
  var v11: f32 = 0.0;

  if (x0 >= 0 && x0 < W && y0 >= 0 && y0 < H) {
    v00 = input[c * params.H * params.W + u32(y0) * params.W + u32(x0)];
  }
  if (x1 >= 0 && x1 < W && y0 >= 0 && y0 < H) {
    v01 = input[c * params.H * params.W + u32(y0) * params.W + u32(x1)];
  }
  if (x0 >= 0 && x0 < W && y1 >= 0 && y1 < H) {
    v10 = input[c * params.H * params.W + u32(y1) * params.W + u32(x0)];
  }
  if (x1 >= 0 && x1 < W && y1 >= 0 && y1 < H) {
    v11 = input[c * params.H * params.W + u32(y1) * params.W + u32(x1)];
  }

  // Bilinear interpolation
  let top = v00 * (1.0 - fx) + v01 * fx;
  let bot = v10 * (1.0 - fx) + v11 * fx;
  let result = top * (1.0 - fy) + bot * fy;

  // Output layout: [N, C]
  output[n * params.C + c] = result;
}
`,Be=256,rn=65535;function Ee(t){return t<=rn?[t,1]:[rn,Math.ceil(t/rn)]}function Ae(t,e){return Math.ceil(t/e)}const on={
inChannels:120,nNeurons:64,planeChannels:40,radius:.87};class bi{constructor(e){this.device=e,this.pipelines={},this._uniformCache=
new Map,this._slotProvider=null}_alloc(e,n){return this._slotProvider?this._slotProvider.acquire(e,n):q(this.device,n,0,
e)}init(){const e=this.device,n=(o,r)=>e.createComputePipeline({layout:"auto",compute:{module:e.createShaderModule({code:o}),
entryPoint:r}});this.pipelines.gridSample=n(hi,"grid_sample_main"),this.pipelines.linear=n(qt,"main"),this.pipelines.activation=
n(lr,"activation_main"),this.pipelines.concatPlanes=n(`
      struct P { N: u32, C: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> plane0: array<f32>;
      @group(0) @binding(2) var<storage, read> plane1: array<f32>;
      @group(0) @binding(3) var<storage, read> plane2: array<f32>;
      @group(0) @binding(4) var<storage, read_write> output: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        let total = p.N * p.C * 3u;
        if (idx >= total) { return; }
        let n = idx / (p.C * 3u);
        let rem = idx % (p.C * 3u);
        let planeIdx = rem / p.C;
        let c = rem % p.C;
        let srcIdx = n * p.C + c;
        switch planeIdx {
          case 0u: { output[idx] = plane0[srcIdx]; }
          case 1u: { output[idx] = plane1[srcIdx]; }
          case 2u: { output[idx] = plane2[srcIdx]; }
          default: {}
        }
      }
    `,"main"),this.pipelines.truncExp=n(`
      struct P { count: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> input: array<f32>;
      @group(0) @binding(2) var<storage, read_write> output: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.count) { return; }
        output[idx] = exp(input[idx]);
      }
    `,"main"),this.pipelines.sigmoid=n(`
      struct P { count: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> input: array<f32>;
      @group(0) @binding(2) var<storage, read_write> output: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.count) { return; }
        output[idx] = 1.0 / (1.0 + exp(-input[idx]));
      }
    `,"main"),this.pipelines.normalize3=n(`
      struct P { N: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> input: array<f32>;
      @group(0) @binding(2) var<storage, read_write> output: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.N) { return; }
        let base = idx * 3u;
        let x = input[base]; let y = input[base + 1]; let z = input[base + 2];
        let len = sqrt(x*x + y*y + z*z) + 1e-8;
        output[base] = x / len;
        output[base + 1] = y / len;
        output[base + 2] = z / len;
      }
    `,"main"),this.pipelines.addBias=n(`
      struct P { count: u32, bias: f32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read_write> data: array<f32>;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.count) { return; }
        data[idx] = data[idx] + p.bias;
      }
    `,"main")}_cachedUniform(e){const n=new Uint8Array(e.buffer||e);let o=0;for(let i=0;i<n.length;i++)o=o*31+n[i]|0;const r=`\
td_${n.length}_${o}`;if(this._uniformCache.has(r))return this._uniformCache.get(r);let s;return this._residentQueryWorkOwner?
s=cr(this.device,n,r):(s=this.device.createBuffer({size:Math.max(n.byteLength,16),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.
COPY_DST,mappedAtCreation:!0}),new Uint8Array(s.getMappedRange()).set(n),s.unmap()),this._uniformCache.set(r,s),s}decode(e,n,o,r,s,i){
this.device;const a=on.planeChannels,c=384,l=384,d=on.radius,u=this._dispatchScalePositions(e,n,r,d,"scaledPos"),f=this.
_dispatchExtractGrid(e,u,r,0,1,"grid:XY"),p=this._dispatchExtractGrid(e,u,r,0,2,"grid:XZ"),g=this._dispatchExtractGrid(e,
u,r,1,2,"grid:YZ"),m=a*c*l*4,h=this._dispatchGridSample(e,o,0,f,a,c,l,r,"sampled:XY"),w=this._dispatchGridSample(e,o,m,p,
a,c,l,r,"sampled:XZ"),b=this._dispatchGridSample(e,o,m*2,g,a,c,l,r,"sampled:YZ"),y=this._dispatchConcatPlanes(e,h,w,b,r,
a,"concatFeatures"),_={},x=i||["density","features","perturb_normal","vertex_offset"];for(const k of x){const R=s.heads[k];
_[k]=this._dispatchMLPHead(e,y,R,r,k)}return _}_dispatchScalePositions(e,n,o,r,s="scaledPos"){this.pipelines.scalePos||(this.
pipelines.scalePos=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:`\

              struct P { count: u32, invRadius: f32, numWgX: u32 }
              @group(0) @binding(0) var<uniform> p: P;
              @group(0) @binding(1) var<storage, read> input: array<f32>;
              @group(0) @binding(2) var<storage, read_write> output: array<f32>;
              @compute @workgroup_size(256)
              fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
                let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
                if (idx >= p.count) { return; }
                output[idx] = input[idx] * p.invRadius;
              }
            `}),entryPoint:"main"}}));const i=o*3,a=Ae(i,Be),[c,l]=Ee(a),d=new ArrayBuffer(12),u=new Uint32Array(d),f=new Float32Array(
d);u[0]=i,f[1]=1/r,u[2]=c;const p=this._cachedUniform(new Uint8Array(d)),g=this._alloc(s,i*4),m=this.device.createBindGroup(
{layout:this.pipelines.scalePos.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:n}},
{binding:2,resource:{buffer:g}}]}),h=e.beginComputePass();return h.setPipeline(this.pipelines.scalePos),h.setBindGroup(0,
m),h.dispatchWorkgroups(c,l),h.end(),g}_dispatchExtractGrid(e,n,o,r,s,i="grid"){this.pipelines.extractGrid||(this.pipelines.
extractGrid=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:`
              struct P { N: u32, dim0: u32, dim1: u32, numWgX: u32 }
              @group(0) @binding(0) var<uniform> p: P;
              @group(0) @binding(1) var<storage, read> positions: array<f32>;
              @group(0) @binding(2) var<storage, read_write> grid: array<f32>;
              @compute @workgroup_size(256)
              fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
                let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
                if (idx >= p.N) { return; }
                grid[idx * 2] = positions[idx * 3 + p.dim0];
                grid[idx * 2 + 1] = positions[idx * 3 + p.dim1];
              }
            `}),entryPoint:"main"}}));const a=Ae(o,Be),[c,l]=Ee(a),d=this._cachedUniform(new Uint32Array([o,r,s,c])),u=this.
_alloc(i,o*2*4),f=this.device.createBindGroup({layout:this.pipelines.extractGrid.getBindGroupLayout(0),entries:[{binding:0,
resource:{buffer:d}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:u}}]}),p=e.beginComputePass();return p.
setPipeline(this.pipelines.extractGrid),p.setBindGroup(0,f),p.dispatchWorkgroups(c,l),p.end(),u}_dispatchGridSample(e,n,o,r,s,i,a,c,l="\
sampled"){const d=Ae(c*s,Be),[u,f]=Ee(d),p=this._cachedUniform(new Uint32Array([s,i,a,c,u])),g=this._alloc(l,c*s*4),m=this.
device.createBindGroup({layout:this.pipelines.gridSample.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p}},
{binding:1,resource:{buffer:n,offset:o,size:s*i*a*4}},{binding:2,resource:{buffer:r}},{binding:3,resource:{buffer:g}}]}),
h=e.beginComputePass();return h.setPipeline(this.pipelines.gridSample),h.setBindGroup(0,m),h.dispatchWorkgroups(u,f),h.end(),
g}_dispatchConcatPlanes(e,n,o,r,s,i,a="concatFeatures"){const c=s*i*3,l=Ae(c,Be),[d,u]=Ee(l),f=this._cachedUniform(new Uint32Array(
[s,i,d])),p=this._alloc(a,c*4),g=this.device.createBindGroup({layout:this.pipelines.concatPlanes.getBindGroupLayout(0),entries:[
{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:r}},
{binding:4,resource:{buffer:p}}]}),m=e.beginComputePass();return m.setPipeline(this.pipelines.concatPlanes),m.setBindGroup(
0,g),m.dispatchWorkgroups(d,u),m.end(),p}_dispatchMLPHead(e,n,o,r,s){const{inChannels:i,nNeurons:a}=on,l={density:1,features:3,
perturb_normal:3,vertex_offset:3}[s];let d=n,u=i;const f=`head:${s}`;for(let h=0;h<o.length-1;h++){const w=o[h],b=this._alloc(
`${f}:lin:${h}`,r*a*4);this._dispatchLinear(e,d,b,w.weight,w.bias,r,u,a),d=this._dispatchSiLU(e,b,r*a,`${f}:silu:${h}`),
u=a}const p=o[o.length-1],g=this._alloc(`${f}:rawOut`,r*l*4);this._dispatchLinear(e,d,g,p.weight,p.bias,r,u,l);let m=g;return s===
"density"?(this._dispatchAddBias(e,m,r*l,-1),m=this._dispatchTruncExp(e,m,r*l,`${f}:truncExp`)):s==="features"?m=this._dispatchSigmoid(
e,m,r*l,`${f}:sigmoid`):s==="perturb_normal"&&(m=this._dispatchNormalize3(e,m,r,`${f}:normalize3`)),m}_dispatchLinear(e,n,o,r,s,i,a,c){
const l=Ae(i*c,Be),[d,u]=Ee(l),f=this._cachedUniform(new Uint32Array([i,a,c,d,1])),p=this.device.createBindGroup({layout:this.
pipelines.linear.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:n}},{binding:2,
resource:{buffer:r}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:o}}]}),g=e.beginComputePass();g.setPipeline(
this.pipelines.linear),g.setBindGroup(0,p),g.dispatchWorkgroups(d,u),g.end()}_dispatchSiLU(e,n,o,r="silu"){const s=Ae(o,
Be),[i,a]=Ee(s),c=this._cachedUniform(new Uint32Array([o,1,i])),l=this._alloc(r+":dummy",4),d=this._alloc(r,o*4),u=this.
device.createBindGroup({layout:this.pipelines.activation.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},
{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}}]}),f=e.beginComputePass();
return f.setPipeline(this.pipelines.activation),f.setBindGroup(0,u),f.dispatchWorkgroups(i,a),f.end(),d}_dispatchTruncExp(e,n,o,r="\
truncExp"){const s=Ae(o,Be),[i,a]=Ee(s),c=this._cachedUniform(new Uint32Array([o,i])),l=this._alloc(r,o*4),d=this.device.
createBindGroup({layout:this.pipelines.truncExp.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},{binding:1,
resource:{buffer:n}},{binding:2,resource:{buffer:l}}]}),u=e.beginComputePass();return u.setPipeline(this.pipelines.truncExp),
u.setBindGroup(0,d),u.dispatchWorkgroups(i,a),u.end(),l}_dispatchSigmoid(e,n,o,r="sigmoid"){const s=Ae(o,Be),[i,a]=Ee(s),
c=this._cachedUniform(new Uint32Array([o,i])),l=this._alloc(r,o*4),d=this.device.createBindGroup({layout:this.pipelines.
sigmoid.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n}},{binding:2,resource:{
buffer:l}}]}),u=e.beginComputePass();return u.setPipeline(this.pipelines.sigmoid),u.setBindGroup(0,d),u.dispatchWorkgroups(
i,a),u.end(),l}_dispatchNormalize3(e,n,o,r="normalize3"){const s=Ae(o,Be),[i,a]=Ee(s),c=this._cachedUniform(new Uint32Array(
[o,i])),l=this._alloc(r,o*3*4),d=this.device.createBindGroup({layout:this.pipelines.normalize3.getBindGroupLayout(0),entries:[
{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:l}}]}),u=e.beginComputePass();
return u.setPipeline(this.pipelines.normalize3),u.setBindGroup(0,d),u.dispatchWorkgroups(i,a),u.end(),l}_dispatchAddBias(e,n,o,r){
const s=Ae(o,Be),[i,a]=Ee(s),c=new ArrayBuffer(12),l=new Uint32Array(c),d=new Float32Array(c);l[0]=o,d[1]=r,l[2]=i;const u=this.
_cachedUniform(new Uint8Array(c)),f=this.device.createBindGroup({layout:this.pipelines.addBias.getBindGroupLayout(0),entries:[
{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:n}}]}),p=e.beginComputePass();p.setPipeline(this.pipelines.addBias),
p.setBindGroup(0,f),p.dispatchWorkgroups(i,a),p.end()}}const wi=[[-1,-1,-1,-1,-1,-1],[1,0,2,-1,-1,-1],[4,0,3,-1,-1,-1],[
1,4,2,1,3,4],[3,1,5,-1,-1,-1],[2,3,0,2,5,3],[1,4,0,1,5,4],[4,2,5,-1,-1,-1],[4,5,2,-1,-1,-1],[4,1,0,4,5,1],[3,2,0,3,5,2],
[1,3,5,-1,-1,-1],[4,1,2,4,3,1],[3,0,4,-1,-1,-1],[2,0,1,-1,-1,-1],[-1,-1,-1,-1,-1,-1]],yi=[0,1,1,2,1,2,2,1,1,2,2,1,2,1,1,
0],Hn=[0,1,0,2,0,3,1,2,1,3,2,3],ki="./",vi=_i(ki,import.meta.url,!1);new URL("tets/",vi).href;function _i(t,e,n=!1){const o=String(
t);if(!o||o.startsWith(".")){if(n)return new URL("/",e);const r=new URL("./",e);return r.pathname.endsWith("/assets/")?new URL(
"../",r):r}return new URL(o,e)}function Ii(t,e,n,o=null,r=160){const s=t.length/3,i=n.length/4;let a;if(o){const y=1.74/
r;a=new Float32Array(s*3);for(let _=0;_<s*3;_++)a[_]=t[_]+y*Math.tanh(o[_])}else a=t;const c=new Uint8Array(s);for(let y=0;y<
s;y++)c[y]=e[y]>0?1:0;const l=[];for(let y=0;y<i;y++){const _=y*4,x=c[n[_]]+c[n[_+1]]+c[n[_+2]]+c[n[_+3]];x>0&&x<4&&l.push(
y)}const d=new Map,u=[],f=new Int32Array(l.length*6);for(let y=0;y<l.length;y++){const x=l[y]*4;for(let k=0;k<6;k++){let R=n[x+
Hn[k*2]],E=n[x+Hn[k*2+1]];if(R>E){const I=R;R=E,E=I}const M=`${R},${E}`;let D;d.has(M)?D=d.get(M):(D=u.length,d.set(M,D),
u.push([R,E])),f[y*6+k]=D}}const p=[],g=new Int32Array(u.length).fill(-1);let m=0;for(let y=0;y<u.length;y++){const[_,x]=u[y];
c[_]!==c[x]&&(g[y]=m++,p.push(y))}const h=new Float32Array(m*3);for(const y of p){const[_,x]=u[y],k=e[_],R=e[x],E=k-R,M=E!==
0?k/E:.5,D=g[y]*3;for(let I=0;I<3;I++)h[D+I]=a[_*3+I]*(1-M)+a[x*3+I]*M}const w=[];for(let y=0;y<l.length;y++){const x=l[y]*
4;let k=0;for(let M=0;M<4;M++)c[n[x+M]]&&(k|=1<<M);const R=yi[k],E=wi[k];for(let M=0;M<R;M++){const D=g[f[y*6+E[M*3]]],I=g[f[y*
6+E[M*3+1]]],O=g[f[y*6+E[M*3+2]]];D>=0&&I>=0&&O>=0&&w.push(D,I,O)}}const b=new Uint32Array(w);return{vertices:h,faces:b,
numVertices:m,numFaces:b.length/3}}function xi(t,e,n){const[o,r]=e,[s,i]=n,a=(n[1]-n[0])/(r-o),c=n[0]-o*a,l=new Float32Array(
t.length);for(let d=0;d<t.length;d++)l[d]=t[d]*a+c;return l}function Si(t){const e=t?.numVertices,n=t?.numFaces;if(!Number.
isSafeInteger(e)||e<=0)throw new Error(`marching-tet reply numVertices invalid: ${e}`);if(!Number.isSafeInteger(n)||n<=0)
throw new Error(`marching-tet reply numFaces invalid: ${n}`);if(!(t.vertices instanceof ArrayBuffer)||!(t.faces instanceof
ArrayBuffer))throw new Error("marching-tet reply must carry vertices and faces ArrayBuffers");const o=new Float32Array(t.
vertices),r=new Uint32Array(t.faces);if(o.length!==e*3)throw new Error(`marching-tet vertices length ${o.length} != ${e*
3}`);if(r.length!==n*3)throw new Error(`marching-tet faces length ${r.length} != ${n*3}`);for(let s=0;s<o.length;s++)if(!Number.
isFinite(o[s]))throw new Error(`marching-tet vertex value non-finite at ${s}`);for(let s=0;s<r.length;s++)if(r[s]>=e)throw new Error(
`marching-tet face index ${r[s]} out of range at ${s}`);return{vertices:o,faces:r,numVertices:e,numFaces:n}}async function Bi(t,{
sdf:e,vertexOffsets:n,bbox:o,resolution:r},{timeoutMs:s=3e4}={}){if(!(e instanceof Float32Array))throw new TypeError("sd\
f must be a Float32Array");if(n!=null&&!(n instanceof Float32Array))throw new TypeError("vertexOffsets must be a Float32\
Array or null");const i=e.slice().buffer,a=n?n.slice().buffer:null,c=a?[i,a]:[i];return await He(t,{id:`marching-tet-${Math.
random().toString(36).slice(2)}`,sdf:i,vertexOffsets:a,bbox:o,resolution:r},c,{timeoutMs:s,onResult:Si})}const he={...eo,
numEncoderLayers:24,isosurfaceResolution:160,isosurfaceThreshold:10,radius:.87,defaultFovDeg:40,defaultDistance:1.6};function Ei(t){
const e=t.width,n=t.height,o=t.data;if(!(o instanceof Uint8Array||o instanceof Uint8ClampedArray)||!Number.isSafeInteger(
e)||!Number.isSafeInteger(n)||e<1||n<1||o.length!==e*n*4)throw new Error("SF3D requires validated RGBA pixels");const r=new Float32Array(
e*n*4);for(let s=0;s<o.length;s++)r[s]=o[s]/255;return{srcFloat:r,srcW:e,srcH:n}}async function Ai(t,e={}){const n=he.condImageSize,
{srcFloat:o,srcW:r,srcH:s}=Ei(t),i=he.bgColor,a=he.imageMean,c=he.imageStd,l=e.preprocessWorker;if(l){const d=`pp-${Math.
random().toString(36).slice(2)}`;return await He(l,{srcBuffer:o.buffer,srcW:r,srcH:s,size:n,bg:i,imageMean:a,imageStd:c,
id:d},[o.buffer],{timeoutMs:e.workerTimeoutMs||3e4,onResult:u=>io(u,n)})}return so(o,r,s,n,i,a,c)}function Pi(){const t=new Float32Array(
[0,0,1,he.defaultDistance,1,0,0,0,0,1,0,0,0,0,0,1]),e=he.defaultFovDeg*Math.PI/180,n=.5/Math.tan(e/2),o=new Float32Array(
[n,0,.5,0,n,.5,0,0,1]),r=new Float32Array(25);return r.set(t,0),r.set(o,16),r}function Ci(t){const e=new lo(t);e.init();
const n=new Ls(t);n.init();const o=new bi(t);return o.init(),{imageTokenizer:e,twoStream:n,triplaneDecoder:o}}async function Mi(t,e,n,o,r,s={}){
const i=K=>{r&&r(K),console.log(K)},a={};let c;const l=s.cooperativeDino===!0,d=s.dinoSchedulingMode==="disabled"?"disab\
led":"cooperative",u=Number.isSafeInteger(s.dinoChunkBlocks)&&s.dinoChunkBlocks>0?s.dinoChunkBlocks:1,f=s.cooperativePostProcessor===
!0,p=s.cooperativeTwoStream===!0,g=s.twoStreamSchedulingMode==="disabled"?"disabled":"cooperative",m=s.twoStreamDutyGranularity??
"stage";if(!["stage","attention-tile"].includes(m))throw new RangeError(`twoStreamDutyGranularity must be stage or atten\
tion-tile, got ${m}`);const h=s.twoStreamLinearRowsPerDuty??128;if(!Number.isSafeInteger(h)||h<=0)throw new TypeError(`t\
woStreamLinearRowsPerDuty must be a positive safe integer, got ${h}`);const w=s.postProcessorSchedulingMode==="disabled"?
"disabled":"cooperative",b=s.postProcessorDutyGranularity??"plane";if(!["plane","layer","channel-range"].includes(b))throw new RangeError(
`postProcessorDutyGranularity must be plane, layer, or channel-range, got ${b}`);const y=s.postProcessorCompletionPolicy??
"strict-prefix",_=s.postProcessorMaxInFlightGpuDuties??null,x=s.postProcessorChannelsPerDuty??16;if(!Number.isSafeInteger(
x)||x<=0)throw new TypeError(`postProcessorChannelsPerDuty must be a positive safe integer, got ${x}`);const k={};let R=null;
const E=Array.isArray(s.recordStageSpans)?s.recordStageSpans:null,M=(K,se)=>{E&&E.push({name:K,start:se,end:performance.
now()})};c=performance.now(),i("Preprocessing image...");const D=await Le(s,s.preprocessWorker?"image-preprocess-worker":
"image-preprocess",()=>Ai(o,{preprocessWorker:s.preprocessWorker,workerTimeoutMs:s.workerTimeoutMs})),I=je(t,D.chw);i("C\
omputing camera embedding...");const O=Pi(),G=je(t,O),v=t.createCommandEncoder(),P=q(t,768*4);Di(t,v,e,G,P,n.cameraEmbedder.
weight,n.cameraEmbedder.bias,1,25,768),t.queue.submit([v.finish()]),a["image-preprocess"]=performance.now()-c,M("image-p\
reprocess",c),c=performance.now();let C;if(l){i(`Running DINOv2 backbone (cooperative, ${d}, chunk=${u})...`);const{result:K,
report:se}=await Fs({device:t,foregroundOpportunities:s.foregroundOpportunities??null,tokenizer:e.imageTokenizer,imageBuf:I,
cameraEmbedBuf:P,weights:n.imageTokenizer,numBlocks:he.numEncoderLayers,chunkBlocks:u,schedulingMode:d,retireIntermediateBuffers:!0,
signal:s.signal,onProgress:S=>{S.percent!=null&&i(`DINOv2 blocks ${S.completedItems}/${S.totalItems} (${S.percent.toFixed(
0)}%)`)}});C=K,k["dinov2-tokenizer"]=se}else{i("Running DINOv2 backbone...");const K=t.createCommandEncoder();C=e.imageTokenizer.
encode(K,I,P,n.imageTokenizer),t.queue.submit([K.finish()])}if(s.captureDinoPayload){const K=await Fe(t,C.tokensBuf,C.N*
1024*4);R={shape:{N:C.N,dim:1024},length:K.length,tokens:Float32Array.from(K)}}if(a["dinov2-tokenizer"]=performance.now()-
c,M("dinov2-tokenizer",c),await s.retirePhase?.("dinov2-tokenizer",[C.tokensBuf,P]),c=performance.now(),i("Running two-s\
tream backbone..."),!n.backbone._rearrangedEmbeddings){const K=t.createCommandEncoder();n.backbone._rearrangedEmbeddings=
ei(K,t,e,n.tokenizer.embeddings),t.queue.submit([K.finish()])}n.backbone.tokenizer_embeddings_buf=n.backbone._rearrangedEmbeddings;
let B;if(p){i(`Running two-stream backbone (cooperative, ${g}, ${m})...`);const{result:K,report:se}=await Qs({device:t,foregroundOpportunities:s.
foregroundOpportunities??null,backbone:e.twoStream,imageTokensBuf:C.tokensBuf,N_img:C.N,weights:n.backbone,schedulingMode:g,
dutyGranularity:m,linearRowsPerDuty:h,retireIntermediateBuffers:!0,signal:s.signal,onProgress:S=>{S.percent!=null&&i(`Tw\
o-stream duties ${S.completedItems}/${S.totalItems} (${S.percent.toFixed(0)}%)`)}});B=K,k["two-stream-backbone"]=se}else{
const K=t.createCommandEncoder();B=e.twoStream.forward(K,C.tokensBuf,C.N,n.backbone),t.queue.submit([K.finish()])}a["two\
-stream-backbone"]=performance.now()-c,M("two-stream-backbone",c),await s.retirePhase?.("two-stream-backbone",[B.buffer,
P]),c=performance.now();let A;if(f){const K=b==="plane"?"planes":"duties";i(`Running post-processor (cooperative, ${w}, ${b}\
)...`);const{result:se,report:S}=await mi({device:t,foregroundOpportunities:s.foregroundOpportunities??null,triplanesBuf:B.
buffer,weights:n.postProcessor,schedulingMode:w,dutyGranularity:b,channelsPerDuty:x,completionPolicy:y,maxInFlightGpuDuties:_,
signal:s.signal,onProgress:T=>{T.percent!=null&&i(`Post-processor ${K} ${T.completedItems}/${T.totalItems} (${T.percent.
toFixed(0)}%)`)}});A=se,k["post-processor"]=S}else{i("Running post-processor...");const K=t.createCommandEncoder();A=ni(
t,K,B.buffer,n.postProcessor),t.queue.submit([K.finish()]),await t.queue.onSubmittedWorkDone()}M("post-processor",c),await s.
retirePhase?.("post-processor",[A.buffer,P]),i("Querying triplane and decoding...");const $=s.tetData;if(!$?.gridVertices||
!$?.indices)throw new Error("SF3D requires artifact-backed tet data");i(`Loaded tet grid: ${$.numVertices} vertices, ${$.
numTets??"worker-owned"} tets`);const U=[-.87,he.radius],Y=xi($.gridVertices,[0,1],U),J=je(t,Y),X=t.createCommandEncoder(),
V=e.triplaneDecoder.decode(X,J,A.buffer,$.numVertices,n.decoder,["density","vertex_offset"]);t.queue.submit([X.finish()]),
i("Reading back SDF values...");const F=await Fe(t,V.density,$.numVertices*4),te=new Float32Array(F);for(let K=0;K<te.length;K++)
te[K]-=he.isosurfaceThreshold;const j=await Fe(t,V.vertex_offset,$.numVertices*3*4),Z=new Float32Array(j);a["triplane-de\
code"]=performance.now()-c,M("triplane-decode",c),c=performance.now(),i("Extracting mesh...");const ee=await Le(s,s.marchingTetWorker?
"marching-tet-worker":"marching-tet",()=>s.marchingTetWorker?Bi(s.marchingTetWorker,{sdf:te,vertexOffsets:Z,bbox:U,resolution:he.
isosurfaceResolution},{timeoutMs:s.workerTimeoutMs}):Ii(Y,te,$.indices,Z,he.isosurfaceResolution));return i(`Mesh extrac\
ted: ${ee.numVertices} vertices, ${ee.numFaces} faces`),a["marching-tet"]=performance.now()-c,M("marching-tet",c),await s.
retirePhase?.("marching-tet",[A.buffer,P]),{vertices:ee.vertices,faces:ee.faces,numVertices:ee.numVertices,numFaces:ee.numFaces,
_conditionRgba:D.rgba,_triplanesBuf:A.buffer,_triplaneDecoder:e.triplaneDecoder,_decoderWeights:n.decoder,_stageTimings:a,
_cooperativeReports:k,_dinoPayload:R,_sdf:te,_isosurfaceThreshold:he.isosurfaceThreshold,_vertexOffsets:Z,_gridPositions:Y,
_cameraEmbedBuf:P}}function Di(t,e,n,o,r,s,i,a,c,l){n.imageTokenizer._dispatchLinear(e,o,r,s,i,a,c,l)}const Re=768,Ot=32,
We=224,Ri=(We/Ot)**2,at=Ri+1,wn=3*Ot*Ot,Ti=Object.freeze([.48145466,.4578275,.40821073]),$i=Object.freeze([.26862954,.26130258,
.27577711]),sn=Object.freeze({conv1W:"image_estimator.model.visual.conv1.weight",classEmb:"image_estimator.model.visual.\
class_embedding",posEmb:"image_estimator.model.visual.positional_embedding"});function Cr(t){const e=t._rawGetCPU(sn.conv1W),
n=t._rawGetCPU(sn.classEmb),o=t._rawGetCPU(sn.posEmb);return xn({conv1W:e,classEmb:n,posEmb:o})}function xn({conv1W:t,classEmb:e,
posEmb:n}){if(!(t instanceof Float32Array)||t.length!==Re*wn)throw new Error(`clip conv1 weight must be Float32Array[${Re*
wn}], got ${t?.length}`);if(!(e instanceof Float32Array)||e.length!==Re)throw new Error(`clip class embedding must be Fl\
oat32Array[${Re}], got ${e?.length}`);if(!(n instanceof Float32Array)||n.length!==at*Re)throw new Error(`clip positional\
 embedding must be Float32Array[${at*Re}], got ${n?.length}`);return{conv1W:t,classEmb:e,posEmb:n}}function Oi(t,e,n){const o=e*
n;if(t.length!==o*4)throw new Error(`clip input must be ${o*4} RGBA bytes for ${e}x${n}, got ${t.length}`);const r=new Float32Array(
o*4);for(let s=0;s<t.length;s++)r[s]=t[s]/255;for(let s=0;s<o;s++){const i=r[s*4+3];r[s*4]=(r[s*4]*i+.5*(1-i))*i,r[s*4+1]=
(r[s*4+1]*i+.5*(1-i))*i,r[s*4+2]=(r[s*4+2]*i+.5*(1-i))*i}return r}function Gi(t,e,n){let o=t,r=e,s=n;const i=We,a=new Float32Array(
3*i*i);for(let c=0;c<i;c++)for(let l=0;l<i;l++){const d=Math.max(0,(l+.5)*(r/i)-.5),u=Math.max(0,(c+.5)*(s/i)-.5),f=Math.
floor(d),p=Math.floor(u),g=Math.min(f+1,r-1),m=Math.min(p+1,s-1),h=d-f,w=u-p;for(let b=0;b<3;b++){const y=o[(p*r+f)*4+b]*
(1-h)*(1-w)+o[(p*r+g)*4+b]*h*(1-w)+o[(m*r+f)*4+b]*(1-h)*w+o[(m*r+g)*4+b]*h*w;a[b*i*i+c*i+l]=(y-Ti[b])/$i[b]}}return a}function Fi(t,{
conv1W:e,classEmb:n,posEmb:o}){if(!(t instanceof Float32Array)||t.length!==3*We*We)throw new Error(`clip image must be F\
loat32Array[${3*We*We}], got ${t?.length}`);const r=Re,s=Ot,i=We,a=wn,c=new Float32Array(at*r);for(let l=0;l<r;l++)c[l]=
n[l];for(let l=0;l<7;l++)for(let d=0;d<7;d++){const u=l*7+d;for(let f=0;f<r;f++){let p=0;for(let g=0;g<3;g++)for(let m=0;m<
s;m++)for(let h=0;h<s;h++)p+=t[g*i*i+(l*s+m)*i+(d*s+h)]*e[f*a+g*s*s+m*s+h];c[(u+1)*r+f]=p}}for(let l=0;l<at*r;l++)c[l]+=
o[l];return c}function qi(t,e,n,o){const r=xn(o),s=Oi(t,e,n),i=Gi(s,e,n);return Fi(i,r)}function Mr(t){if(!(t instanceof
Float32Array)||t.length!==at*Re)throw new Error(`clip embeddings must be Float32Array[${at*Re}], got ${t?.length}`);for(let e=0;e<
t.length;e++)if(!Number.isFinite(t[e]))throw new Error(`clip embeddings contain a non-finite value at ${e}`);return t}const Wt=768,
Bt=12,ze=64,an=3072,Dr=12,Sn=50,un=512,zi=256,Et=new WeakMap,Xn=new WeakMap;function Ni(){return{linear:"bundled:linear",
layernorm:"bundled:layernorm"}}async function Wi(){return Object.freeze({linear:qt,layernorm:_n})}async function Vn(t,e,n){
try{t.pushErrorScope("validation")}catch(a){throw new Error(`CLIP shader validation scope setup failed for ${n}: ${a?.message||
a}`,{cause:a})}let o=null,r=null;try{const a=t.createShaderModule({code:e,label:`SF3D CLIP ${n}`});if(typeof a.getCompilationInfo==
"function"){const l=((await a.getCompilationInfo()).messages||[]).filter(d=>d.type==="error");if(l.length){const d=l.map(
u=>`${u.lineNum||"?"}:${u.linePos||"?"} ${u.message}`).join("; ");throw new Error(`CLIP shader compilation failed for ${n}\
: ${d}`)}}o=t.createComputePipeline({layout:"auto",compute:{module:a,entryPoint:"main"}})}catch(a){r=a}let s=null,i=null;
try{s=await t.popErrorScope()}catch(a){i=a}if(r||i){const a=[r?`operation failed: ${r.message||r}`:null,i?`validation sc\
ope pop failed: ${i.message||i}`:null].filter(Boolean).join("; ");throw new Error(`CLIP shader pipeline failed for ${n}:\
 ${a}`,{cause:r||i})}if(s)throw new Error(`CLIP shader validation failed for ${n}: ${s.message||s}`);return o}function kt(t,e){
return Math.ceil(t/e)}function ji(t){return t<=65535?[t,1]:[65535,kt(t,65535)]}async function Li(t){let e=Et.get(t);return e||
(e=(async()=>{const n=Ni(),o=await Wi();return{linear:await Vn(t,o.linear,n.linear),layernorm:await Vn(t,o.layernorm,n.layernorm)}})(),
Et.set(t,e),e.catch(()=>{Et.get(t)===e&&Et.delete(t)})),e}function Ui(t,e){e._assertActive?.(t);let n=Xn.get(t);if(n||(n=
new WeakMap,Xn.set(t,n)),n.has(e))return n.get(e);const o={},r=s=>e._rawGet(s);o.lnPre={weight:r("image_estimator.model.\
visual.ln_pre.weight"),bias:r("image_estimator.model.visual.ln_pre.bias")},o.lnPost={weight:r("image_estimator.model.vis\
ual.ln_post.weight"),bias:r("image_estimator.model.visual.ln_post.bias")},o.blocks=[];for(let s=0;s<Dr;s++){const i=`ima\
ge_estimator.model.visual.transformer.resblocks.${s}`;o.blocks.push({ln1:{weight:r(`${i}.ln_1.weight`),bias:r(`${i}.ln_1\
.bias`)},ln2:{weight:r(`${i}.ln_2.weight`),bias:r(`${i}.ln_2.bias`)},qkv:{weight:r(`${i}.attn.in_proj_weight`),bias:r(`${i}\
.attn.in_proj_bias`)},outProj:{weight:r(`${i}.attn.out_proj.weight`),bias:r(`${i}.attn.out_proj.bias`)},fc:{weight:r(`${i}\
.mlp.c_fc.weight`),bias:r(`${i}.mlp.c_fc.bias`)},proj:{weight:r(`${i}.mlp.c_proj.weight`),bias:r(`${i}.mlp.c_proj.bias`)}})}
return n.set(e,o),o}async function Hi(t,e,n,o,r,s={}){r._assertActive?.(t);const i=await Li(t),a=Ui(t,r),c=s.clipPrepWorker?
await Le(s,"clip-prep-worker",()=>Yi(s.clipPrepWorker,e,n,o,r,{timeoutMs:s.workerTimeoutMs})):Mr(qi(e,n,o,Cr(r))),l=await Ki(
t,c,r,i,a),d=Qn(l,r,"roughness"),u=Qn(l,r,"metallic");return console.log(`CLIP material estimation: roughness=${d.toFixed(
3)}, metallic=${u.toFixed(3)}`),{roughness:d,metallic:u,prepOffloaded:!!s.clipPrepWorker}}const Yn=new WeakMap;function Bn(t){
let e=Yn.get(t);return e||(e={tail:Promise.resolve(),weightIdentity:null,owners:new Map},Yn.set(t,e)),e}function Rr(t,e){
const n=t.tail.catch(()=>{}).then(e);return t.tail=n,n}function Xi(t,e){if(!t)return;const n=Bn(t);n.owners.set(e,(n.owners.
get(e)||0)+1)}async function Vi(t,e,{timeoutMs:n=3e4}={}){if(!t)return;const o=Bn(t),r=o.owners.get(e)||0;return r>1?o.owners.
set(e,r-1):o.owners.delete(e),Rr(o,async()=>{o.weightIdentity!==e||o.owners.has(e)||(o.weightIdentity=null,await He(t,{type:"\
reset",id:`clip-reset-${Math.random().toString(36).slice(2)}`},[],{timeoutMs:n,onResult:s=>{if(s.reset!==!0)throw new Error(
"clip prep reset not acknowledged");return!0}}))})}async function Yi(t,e,n,o,r,{timeoutMs:s=3e4}={}){const i=Bn(t);return Rr(
i,async()=>{if(i.weightIdentity!==r){const l=r&&typeof r._rawGetCPU=="function"?Cr(r):xn(r),d=l.conv1W.slice().buffer,u=l.
classEmb.slice().buffer,f=l.posEmb.slice().buffer;try{await He(t,{type:"init",id:`clip-init-${Math.random().toString(36).
slice(2)}`,conv1W:d,classEmb:u,posEmb:f},[d,u,f],{timeoutMs:s,onResult:p=>{if(p.initialized!==!0)throw new Error("clip p\
rep init not acknowledged");return!0}}),i.weightIdentity=r}catch(p){throw i.weightIdentity=null,p}}const c=(e instanceof
Uint8ClampedArray||e instanceof Uint8Array?e:new Uint8ClampedArray(e)).slice().buffer;return await He(t,{id:`clip-prep-${Math.
random().toString(36).slice(2)}`,rgba:c,width:n,height:o},[c],{timeoutMs:s,onResult:l=>Mr(new Float32Array(l.embeddings))})})}
const Kn=new WeakMap;function En(t,e,n){let o=Kn.get(t);o||(o=Ko(t),Kn.set(t,o));const r=o.getShaderModule(e,n);return o.
getComputePipeline(e,{layout:"auto",compute:{module:r,entryPoint:"main"}})}async function Ki(t,e,n,o,r){const s=Sn,i=Wt;
let a=je(t,new Float32Array(e)),c=t.createCommandEncoder();a=Gt(c,t,a,s,i,r.lnPre,o);for(let u=0;u<Dr;u++)a=Zi(c,t,a,r.blocks[u],
o);a=Gt(c,t,a,s,i,r.lnPost,o),t.queue.submit([c.finish()]),await t.queue.onSubmittedWorkDone();const l=await Fe(t,a,s*i*
4);l.slice(0,i);const d=n._rawGetCPU("image_estimator.model.visual.proj");return Qi(l,d)}function Zi(t,e,n,o,r,s){const i=Sn,
a=Wt,c=Gt(t,e,n,i,a,o.ln1,r),l=At(t,e,c,i,a,3*a,o.qkv,!1,r),d=ea(t,e,l,i),u=At(t,e,d,i,a,a,o.outProj,!0,r),f=Zn(t,e,n,u,
i*a),p=Gt(t,e,f,i,a,o.ln2,r),g=At(t,e,p,i,a,an,o.fc,!0,r),m=Ji(t,e,g,i*an),h=At(t,e,m,i,an,a,o.proj,!0,r);return Zn(t,e,
f,h,i*a)}function Qi(t,e){const n=Wt;if(!(t instanceof Float32Array)||t.length!==Sn*n||!(e instanceof Float32Array)||e.length!==
un*n)throw TypeError("complete canonical CLIP projection shape required");const o=t.subarray(0,n),r=new Float32Array(un);
for(let s=0;s<un;s++){let i=0;for(let a=0;a<n;a++)i+=o[a]*e[s*n+a];r[s]=i}return r}function At(t,e,n,o,r,s,i,a,c){const l=kt(
o*s,zi),[d,u]=ji(l),f=e.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.residentOwner?.allocations.
push({buffer:f,size:32}),e.queue.writeBuffer(f,0,new Uint32Array([o,r,s,d,a?1:0]));const p=q(e,o*s*4),g=e.createBindGroup(
{layout:c.linear.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:n}},{binding:2,
resource:{buffer:i.weight}},{binding:3,resource:{buffer:i.bias}},{binding:4,resource:{buffer:p}}]}),m=t.beginComputePass();
return m.setPipeline(c.linear),m.setBindGroup(0,g),m.dispatchWorkgroups(d,u),m.end(),p}function Gt(t,e,n,o,r,s,i){const a=new ArrayBuffer(
16),c=new DataView(a);c.setUint32(0,o,!0),c.setUint32(4,r,!0),c.setFloat32(8,1e-5,!0);const l=e.createBuffer({size:16,usage:GPUBufferUsage.
UNIFORM|GPUBufferUsage.COPY_DST});i.residentOwner?.allocations.push({buffer:l,size:16}),e.queue.writeBuffer(l,0,new Uint8Array(
a));const d=q(e,o*r*4),u=e.createBindGroup({layout:i.layernorm.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:l}},
{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:s.weight}},{binding:3,resource:{buffer:s.bias}},{binding:4,resource:{
buffer:d}}]}),f=t.beginComputePass();return f.setPipeline(i.layernorm),f.setBindGroup(0,u),f.dispatchWorkgroups(o),f.end(),
d}function Zn(t,e,n,o,r){const s=`
    @group(0) @binding(0) var<storage, read> a: array<f32>;
    @group(0) @binding(1) var<storage, read> b: array<f32>;
    @group(0) @binding(2) var<storage, read_write> out: array<f32>;
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let i = gid.x;
      if (i >= ${r}u) { return; }
      out[i] = a[i] + b[i];
    }
  `,i=En(e,"sf3d.clip.add",s),a=q(e,r*4),c=e.createBindGroup({layout:i.getBindGroupLayout(0),entries:[{binding:0,resource:{
buffer:n}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:a}}]}),l=t.beginComputePass();return l.setPipeline(
i),l.setBindGroup(0,c),l.dispatchWorkgroups(kt(r,256)),l.end(),a}function Ji(t,e,n,o){const r=`
    @group(0) @binding(0) var<storage, read> inp: array<f32>;
    @group(0) @binding(1) var<storage, read_write> out: array<f32>;
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let i = gid.x;
      if (i >= ${o}u) { return; }
      let x = inp[i];
      // Exact GELU: x * 0.5 * (1 + erf(x / sqrt(2)))
      // WGSL doesn't have erf, use Abramowitz & Stegun approximation
      let t = 1.0 / (1.0 + 0.3275911 * abs(x * 0.7071067811865476));
      let erf_approx = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.25482959\
2) * t * exp(-x * x * 0.5);
      let erf_val = select(-erf_approx, erf_approx, x >= 0.0);
      out[i] = x * 0.5 * (1.0 + erf_val);
    }
  `,s=En(e,"sf3d.clip.gelu",r),i=q(e,o*4),a=e.createBindGroup({layout:s.getBindGroupLayout(0),entries:[{binding:0,resource:{
buffer:n}},{binding:1,resource:{buffer:i}}]}),c=t.beginComputePass();return c.setPipeline(s),c.setBindGroup(0,a),c.dispatchWorkgroups(
kt(o,256)),c.end(),i}function ea(t,e,n,o){const r=Wt,s=1/Math.sqrt(ze),i=`
    @group(0) @binding(0) var<storage, read> qkv: array<f32>;
    @group(0) @binding(1) var<storage, read_write> output: array<f32>;
    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      if (idx >= ${o*Bt}u) { return; }
      let qi = idx / ${Bt}u;
      let h = idx % ${Bt}u;
      var scores: array<f32, ${o}>;
      var maxS: f32 = -1e30;
      for (var ki: u32 = 0u; ki < ${o}u; ki++) {
        var s: f32 = 0.0;
        for (var d: u32 = 0u; d < ${ze}u; d++) {
          s += qkv[qi * ${3*r}u + h * ${ze}u + d]
             * qkv[ki * ${3*r}u + ${r}u + h * ${ze}u + d];
        }
        s *= ${s};
        scores[ki] = s;
        maxS = max(maxS, s);
      }
      var sumE: f32 = 0.0;
      for (var ki: u32 = 0u; ki < ${o}u; ki++) {
        scores[ki] = exp(scores[ki] - maxS);
        sumE += scores[ki];
      }
      let inv = 1.0 / sumE;
      for (var d: u32 = 0u; d < ${ze}u; d++) {
        var val: f32 = 0.0;
        for (var ki: u32 = 0u; ki < ${o}u; ki++) {
          val += scores[ki] * inv * qkv[ki * ${3*r}u + ${2*r}u + h * ${ze}u + d];
        }
        output[qi * ${r}u + h * ${ze}u + d] = val;
      }
    }
  `,a=En(e,"sf3d.clip.fused-attention",i),c=q(e,o*r*4),l=e.createBindGroup({layout:a.getBindGroupLayout(0),entries:[{binding:0,
resource:{buffer:n}},{binding:1,resource:{buffer:c}}]}),d=t.beginComputePass();return d.setPipeline(a),d.setBindGroup(0,
l),d.dispatchWorkgroups(kt(o*Bt,64)),d.end(),c}function Qn(t,e,n){const o=`image_estimator.heads.${n}`,r=1,s=u=>e._rawGetCPU(
u);let i=new Float32Array(t);for(const u of["0.0","0.2","0.4"])i=cn(i,s(`${o}.${u}.weight`),s(`${o}.${u}.bias`));let a=yn(
cn(i,s(`${o}.1.0.weight`),s(`${o}.1.0.bias`)),s(`${o}.1.2.weight`),s(`${o}.1.2.bias`)),c=yn(cn(i,s(`${o}.2.0.weight`),s(
`${o}.2.0.bias`)),s(`${o}.2.2.weight`),s(`${o}.2.2.bias`));const l=Jn(a[0]+r),d=Jn(c[0]+r);return l<=1||d<=1?l/(l+d):Math.
max(0,Math.min(1,(l-1)/(l+d-2)))}function yn(t,e,n){const o=t.length,r=n.length,s=new Float32Array(r);for(let i=0;i<r;i++){
let a=n[i];for(let c=0;c<o;c++)a+=t[c]*e[c*r+i];s[i]=a}return s}function cn(t,e,n){const o=yn(t,e,n);for(let r=0;r<o.length;r++)
o[r]<0&&(o[r]=0);return o}function Jn(t){return t>20?t:Math.log(1+Math.exp(t))}function er(t,e,n,o=6){const r=new Uint8Array(
e);for(let s=0;s<o;s++){const i=[];for(let a=0;a<n;a++)for(let c=0;c<n;c++){const l=a*n+c;if(r[l])continue;let d=0,u=0,f=0,
p=0;const g=[[c-1,a],[c+1,a],[c,a-1],[c,a+1]];for(const[m,h]of g){if(m<0||m>=n||h<0||h>=n)continue;const w=h*n+m;r[w]&&(d+=
t[w*4],u+=t[w*4+1],f+=t[w*4+2],p++)}p>0&&i.push({idx:l,r:Math.round(d/p),g:Math.round(u/p),b:Math.round(f/p)})}for(const a of i)
t[a.idx*4]=a.r,t[a.idx*4+1]=a.g,t[a.idx*4+2]=a.b,t[a.idx*4+3]=255,r[a.idx]=1;if(i.length===0)break}}function ta({featuresCPU:t,
normalsCPU:e,occupiedIndices:n,tbnData:o,mask:r,resolution:s,numOccupied:i,dilationScratch:a=null}){const c=new Uint8Array(
s*s*4);for(let u=0;u<i;u++){const f=n[u];c[f*4]=Math.max(0,Math.min(255,Math.round(t[u*3]*255))),c[f*4+1]=Math.max(0,Math.
min(255,Math.round(t[u*3+1]*255))),c[f*4+2]=Math.max(0,Math.min(255,Math.round(t[u*3+2]*255))),c[f*4+3]=255}const l=new Uint8Array(
s*s*4);for(let u=0;u<s*s;u++)l[u*4+2]=255,l[u*4+3]=255;for(let u=0;u<i;u++){const f=n[u],p=f*9,g=e[u*3],m=e[u*3+1],h=e[u*
3+2],w=o[p],b=o[p+1],y=o[p+2],_=o[p+3],x=o[p+4],k=o[p+5],R=o[p+6],E=o[p+7],M=o[p+8],D=w*g+b*m+y*h,I=_*g+x*m+k*h,O=R*g+E*
m+M*h,G=Math.max(0,Math.min(255,Math.round((D*.5+.5)*255))),v=Math.max(0,Math.min(255,Math.round((I*.5+.5)*255))),P=Math.
max(0,Math.min(255,Math.round((O*.5+.5)*255)));l[f*4]=G,l[f*4+1]=v,l[f*4+2]=P,l[f*4+3]=255}const d=Math.max(1,Math.round(
s/150));return a?(tr(c,r,s,d,a),tr(l,r,s,d,a)):(er(c,r,s,d),er(l,r,s,d)),{albedo:c,normalMap:l}}function tr(t,e,n,o,r){const s=n*
n,{workMask:i,indices:a,rgb:c}=r;if(i.length!==s||a.length!==s||c.length!==3*s||e.length!==s||t.length!==4*s)throw Error(
"complete dilation backing shape mismatch");i.set(e);for(let l=0;l<o;l++){let d=0;for(let u=0;u<n;u++)for(let f=0;f<n;f++){
const p=u*n+f;if(i[p])continue;let g=0,m=0,h=0,w=0;for(let b=0;b<4;b++){const y=f+(b===0?-1:b===1?1:0),_=u+(b===2?-1:b===
3?1:0);if(y<0||y>=n||_<0||_>=n)continue;const x=_*n+y;i[x]&&(g+=t[4*x],m+=t[4*x+1],h+=t[4*x+2],w++)}w&&(a[d]=p,c[3*d]=Math.
round(g/w),c[3*d+1]=Math.round(m/w),c[3*d+2]=Math.round(h/w),d++)}for(let u=0;u<d;u++){const f=a[u];t[4*f]=c[3*u],t[4*f+
1]=c[3*u+1],t[4*f+2]=c[3*u+2],t[4*f+3]=255,i[f]=1}if(!d)break}}function na(t,e,n,o,r=.87,s=!1){const i=ca(t,n),a=new Float32Array(
n*3);for(let S=0;S<n;S++){const T=t[S*3],L=t[S*3+1],N=t[S*3+2];a[S*3]=i[0]*T+i[1]*L+i[2]*N,a[S*3+1]=i[3]*T+i[4]*L+i[5]*N,
a[S*3+2]=i[6]*T+i[7]*L+i[8]*N}const c=new Float32Array(n*3),l=new Uint8Array(o);for(let S=0;S<o;S++){const T=e[S*3],L=e[S*
3+1],N=e[S*3+2],W=a[T*3],z=a[T*3+1],ne=a[T*3+2],H=a[L*3],Q=a[L*3+1],re=a[L*3+2],ie=a[N*3],ae=a[N*3+1],ge=a[N*3+2],me=H-W,
we=Q-z,ye=re-ne,Ie=ie-W,ke=ae-z,fe=ge-ne;let vt=we*fe-ye*ke,_t=ye*Ie-me*fe,jt=me*ke-we*Ie;for(const Ve of[T,L,N])c[Ve*3]+=
vt,c[Ve*3+1]+=_t,c[Ve*3+2]+=jt}for(let S=0;S<n;S++){const T=c[S*3],L=c[S*3+1],N=c[S*3+2],W=Math.sqrt(T*T+L*L+N*N)||1;c[S*
3]/=W,c[S*3+1]/=W,c[S*3+2]/=W}for(let S=0;S<o;S++){const T=e[S*3],L=e[S*3+1],N=e[S*3+2],W=c[T*3]+c[L*3]+c[N*3],z=c[T*3+1]+
c[L*3+1]+c[N*3+1],ne=c[T*3+2]+c[L*3+2]+c[N*3+2],H=Math.abs(W),Q=Math.abs(z),re=Math.abs(ne);H>=Q&&H>=re?l[S]=W>0?0:1:Q>=
H&&Q>=re?l[S]=z>0?2:3:l[S]=ne>0?4:5}let d=[1/0,1/0,1/0],u=[-1/0,-1/0,-1/0];for(let S=0;S<n;S++)for(let T=0;T<3;T++){const L=a[S*
3+T];L<d[T]&&(d[T]=L),L>u[T]&&(u[T]=L)}const f=[u[0]-d[0]||1,u[1]-d[1]||1,u[2]-d[2]||1],p=new Float32Array(n*3);for(let S=0;S<
n;S++)for(let T=0;T<3;T++)p[S*3+T]=(a[S*3+T]-d[T])/f[T]*2-1;const g=[0,0,1,1,2,2],m=[!0,!1,!0,!1,!0,!1],h=new Float32Array(
o*3),w=new Float32Array(o*3),b=new Float32Array(o);for(let S=0;S<o;S++){const T=l[S],L=g[T];let N=0;for(let W=0;W<3;W++){
const z=e[S*3+W];let ne,H;T<=1?(ne=p[z*3+1],H=-p[z*3+2]):T<=3?(ne=p[z*3],H=-p[z*3+2]):T===4?(ne=p[z*3],H=p[z*3+1]):(ne=p[z*
3],H=-p[z*3+1]),h[S*3+W]=Math.max(0,Math.min(1,(ne+1)*.5)),w[S*3+W]=Math.max(0,Math.min(1,(H+1)*.5)),N+=a[z*3+L]}b[S]=N/
3}la(a,c,e,h,w,l,n,o);const y=new Int32Array(o);for(let S=0;S<o;S++)y[S]=l[S];nr(o,y,h,w,b,m,0,s),nr(o,y,h,w,b,m,6,s);for(let S=6;S<
12;S++){let T=1/0,L=-1/0,N=1/0,W=-1/0,z=0;for(let Q=0;Q<o;Q++)if(y[Q]===S){z++;for(let re=0;re<3;re++){const ie=h[Q*3+re],
ae=w[Q*3+re];ie<T&&(T=ie),ie>L&&(L=ie),ae<N&&(N=ae),ae>W&&(W=ae)}}if(z===0)continue;const ne=Math.max(L-T,.5),H=Math.max(
W-N,.5);for(let Q=0;Q<o;Q++)if(y[Q]===S)for(let re=0;re<3;re++)h[Q*3+re]=(h[Q*3+re]-T)/ne,w[Q*3+re]=(w[Q*3+re]-N)/H}const _=new Float32Array(
n*3);for(let S=0;S<o;S++){const T=e[S*3],L=e[S*3+1],N=e[S*3+2],W=t[L*3]-t[T*3],z=t[L*3+1]-t[T*3+1],ne=t[L*3+2]-t[T*3+2],
H=t[N*3]-t[T*3],Q=t[N*3+1]-t[T*3+1],re=t[N*3+2]-t[T*3+2],ie=z*re-ne*Q,ae=ne*H-W*re,ge=W*Q-z*H;for(const me of[T,L,N])_[me*
3]+=ie,_[me*3+1]+=ae,_[me*3+2]+=ge}for(let S=0;S<n;S++){const T=_[S*3],L=_[S*3+1],N=_[S*3+2],W=Math.sqrt(T*T+L*L+N*N)||1;
_[S*3]/=W,_[S*3+1]/=W,_[S*3+2]/=W}const x=o*3,k=o,R=new Float32Array(x*3),E=new Float32Array(x*3),M=new Uint32Array(k*3),
D=new Float32Array(x*2);for(let S=0;S<o;S++)for(let T=0;T<3;T++){const L=e[S*3+T],N=S*3+T;R[N*3]=t[L*3],R[N*3+1]=t[L*3+1],
R[N*3+2]=t[L*3+2],E[N*3]=_[L*3],E[N*3+1]=_[L*3+1],E[N*3+2]=_[L*3+2],M[S*3+T]=N}const I=.005,O=[0,1,2,0,1,2],G=[0,0,0,1,1,
1],v=[];for(let S=0;S<o;S++)y[S]>=12&&v.push(S);const P=.5,C=1/3,B=.5,A=2/3;let $=1,U=1;if(v.length>0){const S=P/C,T=Math.
sqrt(v.length/S);$=Math.max(1,Math.ceil(S*T)),U=Math.max(1,Math.ceil(v.length/$))}const Y=P/$,J=C/U,X=new Map;for(let S=0;S<
v.length;S++)X.set(v[S],S);for(let S=0;S<o;S++){const T=y[S],L=Math.floor(T/6),N=T%6,W=O[N],z=G[N];let ne,H,Q,re;if(L===
0)Q=1/3,re=1/3,ne=Q*W,H=re*z;else if(L===1)Q=1/6,re=1/6,ne=Q*W,H=2/3+re*z;else{Q=Y,re=J;const ie=X.get(S)||0,ae=ie%$,ge=Math.
floor(ie/$);ne=B+ae*Q,H=A+ge*re}for(let ie=0;ie<3;ie++){const ae=S*3+ie;let ge=h[ae],me=w[ae];if(L>=2){const we=h[S*3],ye=h[S*
3+1],Ie=h[S*3+2],ke=w[S*3],fe=w[S*3+1],vt=w[S*3+2],_t=Math.min(we,ye,Ie),jt=Math.max(we,ye,Ie),Ve=Math.min(ke,fe,vt),qr=Math.
max(ke,fe,vt),zr=jt-_t||1,Nr=qr-Ve||1,An=Math.min(Q,re)*1.5;ge=(ge-_t)/Math.max(zr,An),me=(me-Ve)/Math.max(Nr,An)}D[ae*2]=
ne+I+ge*(Q-2*I),D[ae*2+1]=H+I+me*(re-2*I)}}let V=0,F=0;const te=[];for(let S=0;S<o;S++){const T=D[S*6],L=D[S*6+1],N=D[S*
6+2],W=D[S*6+3],z=D[S*6+4],ne=D[S*6+5],H=Math.abs((N-T)*(ne-L)-(z-T)*(W-L))*.5;H<1e-10&&(V++,te.length<10&&te.push({f:S,
tier:Math.floor(y[S]/6),ai:y[S],area:H,u0:T,v0:L,u1:N,v1:W,u2:z,v2:ne})),(T<0||T>1||L<0||L>1||N<0||N>1||W<0||W>1||z<0||z>
1||ne<0||ne>1)&&F++}console.log(`UV diagnostics: degenerate=${V}, out-of-bounds=${F}, total=${o}`),te.length>0&&console.
log(`Sample degenerate faces: ${JSON.stringify(te.slice(0,5))}`);let j=0;const Z=[];for(let S=0;S<o;S++){const T=Math.floor(
D[S*6]*1024),L=Math.floor(D[S*6+1]*1024),N=Math.floor(D[S*6+2]*1024),W=Math.floor(D[S*6+3]*1024),z=Math.floor(D[S*6+4]*1024),
ne=Math.floor(D[S*6+5]*1024);T===N&&N===z&&L===W&&W===ne&&(j++,Z.length<5&&Z.push({f:S,tier:Math.floor(y[S]/6),ai:y[S]}))}
console.log(`Faces mapping to single texel at 1024: ${j} (these get 0 rasterized texels)`);let ee=0,K=0;for(let S=0;S<o;S++){
const T=Math.floor(y[S]/6);if(T===0)continue;const L=D[S*6],N=D[S*6+1],W=D[S*6+2],z=D[S*6+3],ne=D[S*6+4],H=D[S*6+5];Math.
abs((W-L)*(H-N)-(ne-L)*(z-N))*.5*1024*1024<1&&(T===1?ee++:K++)}console.log(`Sub-texel faces: secondary=${ee}, remaining=${K}`),
Z.length>0&&console.log(`Sample same-texel faces: ${JSON.stringify(Z)}`);const se=[0,0,0];for(let S=0;S<o;S++){const T=Math.
min(Math.floor(y[S]/6),2);se[T]++}return console.log(`Atlas tiers: primary=${se[0]}, secondary=${se[1]}, remaining=${se[2]}\
, total=${o}`),{uvs:D,newVertices:R,newNormals:E,newFaces:M,newNumVertices:x,newNumFaces:k,faceAssignment:y}}function nr(t,e,n,o,r,s,i,a=!1){
for(let c=i;c<i+6;c++){const l=[];for(let b=0;b<t;b++)e[b]===c&&l.push(b);if(l.length<2)continue;const d=c%6,u=s[d],f=l.
map(b=>({f:b,u0:n[b*3],v0:o[b*3],u1:n[b*3+1],v1:o[b*3+1],u2:n[b*3+2],v2:o[b*3+2],minU:Math.min(n[b*3],n[b*3+1],n[b*3+2]),
maxU:Math.max(n[b*3],n[b*3+1],n[b*3+2]),minV:Math.min(o[b*3],o[b*3+1],o[b*3+2]),maxV:Math.max(o[b*3],o[b*3+1],o[b*3+2])})),
p=kn(f),g=new Set,m=a?null:[],h=new Set;for(const b of f){if(g.has(b.f))continue;const y=vn(p,b);for(const _ of y)if(!(_.
f===b.f||g.has(_.f))&&ra(b,_)){const x=Math.min(b.f,_.f),k=Math.max(b.f,_.f);a?h.add(u?r[x]>=r[k]?x:k:r[x]<=r[k]?x:k):m.
push([x,k])}}const w=new Set;for(const[b,y]of m??[]){const _=b*t+y;if(w.has(_))continue;w.add(_);let x;u?x=r[b]>=r[y]?b:
y:x=r[b]<=r[y]?b:y,h.add(x)}for(const b of h)e[b]=Math.min(e[b]+6,12),g.add(b)}}function kn(t){if(t.length<=4)return{tris:t,
left:null,right:null};let e=1/0,n=-1/0,o=1/0,r=-1/0;for(const d of t)d.minU<e&&(e=d.minU),d.maxU>n&&(n=d.maxU),d.minV<o&&
(o=d.minV),d.maxV>r&&(r=d.maxV);const s=n-e,i=r-o,a=s>=i?"u":"v",c=t.slice().sort((d,u)=>{const f=a==="u"?d.minU+d.maxU:
d.minV+d.maxV,p=a==="u"?u.minU+u.maxU:u.minV+u.maxV;return f-p}),l=c.length>>1;return{tris:null,minU:e,maxU:n,minV:o,maxV:r,
left:kn(c.slice(0,l)),right:kn(c.slice(l))}}function vn(t,e){if(t.tris){const r=[];for(const s of t.tris)s.maxU>=e.minU&&
s.minU<=e.maxU&&s.maxV>=e.minV&&s.minV<=e.maxV&&r.push(s);return r}if(t.maxU<e.minU||t.minU>e.maxU||t.maxV<e.minV||t.minV>
e.maxV)return[];const n=vn(t.left,e),o=vn(t.right,e);return n.concat(o)}function ra(t,e){return oa(t.u0,t.v0,t.u1,t.v1,t.
u2,t.v2,e.u0,e.v0,e.u1,e.v1,e.u2,e.v2)>1e-10}function oa(t,e,n,o,r,s,i,a,c,l,d,u){let f=[[i,a],[c,l],[d,u]];const p=[[t,
e],[n,o],[r,s]];for(let m=0;m<3;m++){if(f.length===0)return 0;const[h,w]=p[m],[b,y]=p[(m+1)%3],_=[];for(let x=0;x<f.length;x++){
const[k,R]=f[x],[E,M]=f[(x+1)%f.length],D=(b-h)*(R-w)-(y-w)*(k-h),I=(b-h)*(M-w)-(y-w)*(E-h);D>=0?(_.push([k,R]),I<0&&_.push(
rr(k,R,E,M,h,w,b,y))):I>=0&&_.push(rr(k,R,E,M,h,w,b,y))}f=_}if(f.length<3)return 0;let g=0;for(let m=0;m<f.length;m++){const[
h,w]=f[m],[b,y]=f[(m+1)%f.length];g+=h*y-b*w}return Math.abs(g)*.5}function rr(t,e,n,o,r,s,i,a){const c=(t-n)*(s-a)-(e-o)*
(r-i);if(Math.abs(c)<1e-15)return[(t+n)*.5,(e+o)*.5];const l=((t-r)*(s-a)-(e-s)*(r-i))/c;return[t+l*(n-t),e+l*(o-e)]}function sa(t,e,n,o,r=1024,s=null){
const i=new Float32Array(r*r*3),a=new Uint8Array(r*r),c=new Float32Array(r*r*9);for(let l=0;l<o;l++){const d=n[l*3],u=n[l*
3+1],f=n[l*3+2],p=t[d*2],g=t[d*2+1],m=t[u*2],h=t[u*2+1],w=t[f*2],b=t[f*2+1],y=e[d*3],_=e[d*3+1],x=e[d*3+2],k=e[u*3],R=e[u*
3+1],E=e[u*3+2],M=e[f*3],D=e[f*3+1],I=e[f*3+2],O=k-y,G=R-_,v=E-x,P=M-y,C=D-_,B=I-x,A=m-p,$=h-g,U=w-p,Y=b-g;let J=G*B-v*C,
X=v*P-O*B,V=O*C-G*P,F=Math.sqrt(J*J+X*X+V*V)||1;J/=F,X/=F,V/=F;const te=A*Y-$*U;let j,Z,ee,K,se,S;if(Math.abs(te)>1e-10){
const ie=1/te;j=(O*Y-P*$)*ie,Z=(G*Y-C*$)*ie,ee=(v*Y-B*$)*ie}else j=1,Z=0,ee=0,Math.abs(J)>.9&&(j=0,Z=1);const T=j*J+Z*X+
ee*V;j-=T*J,Z-=T*X,ee-=T*V;let L=Math.sqrt(j*j+Z*Z+ee*ee)||1;j/=L,Z/=L,ee/=L,K=X*ee-V*Z,se=V*j-J*ee,S=J*Z-X*j;let N=Math.
sqrt(K*K+se*se+S*S)||1;K/=N,se/=N,S/=N;const W=Math.max(0,Math.floor(Math.min(p,m,w)*r)),z=Math.min(r-1,Math.ceil(Math.max(
p,m,w)*r)),ne=Math.max(0,Math.floor(Math.min(g,h,b)*r)),H=Math.min(r-1,Math.ceil(Math.max(g,h,b)*r)),Q=(h-b)*(p-w)+(w-m)*
(g-b);if(Math.abs(Q)<1e-10)continue;const re=1/Q;for(let ie=ne;ie<=H;ie++)for(let ae=W;ae<=z;ae++){const ge=(ae+.5)/r,me=(ie+
.5)/r,we=((h-b)*(ge-w)+(w-m)*(me-b))*re,ye=((b-g)*(ge-w)+(p-w)*(me-b))*re,Ie=1-we-ye;if(we>=-.001&&ye>=-.001&&Ie>=-.001){
const ke=ie*r+ae;a[ke]=1,i[ke*3]=we*y+ye*k+Ie*M,i[ke*3+1]=we*_+ye*R+Ie*D,i[ke*3+2]=we*x+ye*E+Ie*I;const fe=ke*9;c[fe]=j,
c[fe+1]=Z,c[fe+2]=ee,c[fe+3]=K,c[fe+4]=se,c[fe+5]=S,c[fe+6]=J,c[fe+7]=X,c[fe+8]=V}}}for(let l=0;l<o;l++){const d=n[l*3],
u=n[l*3+1],f=n[l*3+2],p=t[d*2],g=t[d*2+1],m=t[u*2],h=t[u*2+1],w=t[f*2],b=t[f*2+1];if(Math.abs((m-p)*(b-g)-(w-p)*(h-g))*.5*
r*r>=1)continue;const _=e[d*3],x=e[d*3+1],k=e[d*3+2],R=e[u*3],E=e[u*3+1],M=e[u*3+2],D=e[f*3],I=e[f*3+1],O=e[f*3+2],G=(_+
R+D)/3,v=(x+E+I)/3,P=(k+M+O)/3,C=R-_,B=E-x,A=M-k,$=D-_,U=I-x,Y=O-k;let J=B*Y-A*U,X=A*$-C*Y,V=C*U-B*$;const F=Math.sqrt(J*
J+X*X+V*V)||1;J/=F,X/=F,V/=F;let te=1,j=0,Z=0;Math.abs(J)>.9&&(te=0,j=1);const ee=te*J+j*X+Z*V;te-=ee*J,j-=ee*X,Z-=ee*V;
const K=Math.sqrt(te*te+j*j+Z*Z)||1;te/=K,j/=K,Z/=K;const se=X*Z-V*j,S=V*te-J*Z,T=J*j-X*te,L=new Set;for(const[N,W]of[[p,
g],[m,h],[w,b],[(p+m+w)/3,(g+h+b)/3]]){const z=Math.min(r-1,Math.max(0,Math.floor(N*r))),ne=Math.min(r-1,Math.max(0,Math.
floor(W*r)));L.add(ne*r+z)}for(const N of L){if(a[N])continue;a[N]=1,i[N*3]=G,i[N*3+1]=v,i[N*3+2]=P;const W=N*9;c[W]=te,
c[W+1]=j,c[W+2]=Z,c[W+3]=se,c[W+4]=S,c[W+5]=T,c[W+6]=J,c[W+7]=X,c[W+8]=V}}return{positions3D:i,mask:a,tbnData:c}}async function ia(t,e,n,o,r,s,i={}){
const a=async(g,m)=>{const h=m-g,w=r.subarray(g*3,m*3),b=performance.now(),{value:y,allocations:_}=Ft(()=>{const x=je(t,
w),k=t.createCommandEncoder({label:`texel-decode-${g}-${m}`}),R=e.decode(k,x,n,h,o,["features","perturb_normal"]);return{
encoder:k,decoded:R,count:h}});return{...y,hostEncodeMs:performance.now()-b,scratchResources:_}},c=new Float32Array(s*3),
l=new Float32Array(s*3);if(typeof i.cooperativeBatch=="function"){const g=e._slotProvider;i.arena&&(e._slotProvider=i.arena);
const m=q(t,s*3*4),h=q(t,s*3*4);try{await i.cooperativeBatch(s,async(_,x)=>{const{encoder:k,decoded:R,count:E,hostEncodeMs:M,
scratchResources:D}=await a(_,x);return k.copyBufferToBuffer(R.features,0,m,_*3*4,E*3*4),k.copyBufferToBuffer(R.perturb_normal,
0,h,_*3*4,E*3*4),{encode:()=>k.finish(),submit:I=>t.queue.submit([I]),hostEncodeMs:M,scratchResources:D}});const w=performance.
now();let b,y;try{b=await Fe(t,m,s*3*4),y=await Fe(t,h,s*3*4)}finally{m.destroy(),h.destroy()}if(i.telemetry){const _=performance.
now();i.telemetry.readbackMs=_-w,i.telemetry.readbackInterval={startMs:w,endMs:_},i.telemetry.aggregateOutputBytes=s*3*4*
2,i.telemetry.aggregateOutputsRetired=!0}return c.set(b.subarray(0,s*3)),l.set(y.subarray(0,s*3)),{featuresCPU:c,normalsCPU:l}}finally{
e._slotProvider=g}}const{encoder:d,decoded:u}=await a(0,s);t.queue.submit([d.finish()]),await t.queue.onSubmittedWorkDone();
const f=await Fe(t,u.features,s*3*4),p=await Fe(t,u.perturb_normal,s*3*4);return c.set(f.subarray(0,s*3)),l.set(p.subarray(
0,s*3)),{featuresCPU:c,normalsCPU:l}}async function aa(t,e,n,o,r,s,i,a=1024,c={}){const l=performance.now(),d=[];for(let k=0;k<
a*a;k++)s[k]&&d.push(k);const u=d.length;console.log(`Texture bake: ${u} occupied texels out of ${a*a}`);const f=new Uint8Array(
a*a*4);if(u===0)return{albedo:f,normalMap:new Uint8Array(f)};const p=new Float32Array(u*3);for(let k=0;k<u;k++){const R=d[k];
p[k*3]=r[R*3],p[k*3+1]=r[R*3+1],p[k*3+2]=r[R*3+2]}if(c.telemetry){const k=performance.now();c.telemetry.cpuPrepMs=k-l,c.
telemetry.cpuPrepInterval={startMs:l,endMs:k}}const{featuresCPU:g,normalsCPU:m}=await ia(t,e,n,o,p,u,c),h=performance.now();
let w,b,y=null;const _={featuresCPU:g,normalsCPU:m,occupiedIndices:d,tbnData:i,mask:s,resolution:a,numOccupied:u};if(c.materializeWorker){
const k=c.materializeWorker,R=`mat-${Math.random().toString(36).slice(2)}`,E=g.slice().buffer,M=m.slice().buffer,D=(d instanceof
Uint32Array?d:Uint32Array.from(d)).slice().buffer,I=i.slice().buffer,O=s.slice().buffer,G=performance.now(),v=await Le(c,
"texture-materialize-worker",()=>He(k,{featuresBuf:E,normalsBuf:M,occupiedBuf:D,tbnBuf:I,maskBuf:O,resolution:a,numOccupied:u,
id:R},[E,M,D,I,O],{timeoutMs:c.workerTimeoutMs||6e4,onResult:P=>{const C=new Uint8Array(P.albedo),B=new Uint8Array(P.normalMap),
A=a*a*4;if(C.length!==A||B.length!==A)throw new Error(`materialize output size ${C.length}/${B.length} != ${A}`);return{
albedo:C,normalMap:B}}}));w=v.albedo,b=v.normalMap,y=performance.now()-G}else{const k=ta(_);w=k.albedo,b=k.normalMap}const x=performance.
now();return c.telemetry&&(c.telemetry.cpuMaterializationMs=x-h,c.telemetry.cpuMaterializationInterval={startMs:h,endMs:x},
c.telemetry.materializationOffloaded=!!c.materializeWorker,c.telemetry.materializationWorkerTransferMs=y),{albedo:w,normalMap:b}}
async function ua(t,e,n,o,r,s,i,a,c=1024,l=.5,d=0,u={}){if(i===0||a===0)throw new Error("Cannot export empty mesh as GLB");
await u.onBeforeCpuAllocation?.("glb-transforms",24*i+12*a);const f=new Float32Array(i*3);for(let z=0;z<i;z++){const ne=t[z*
3],H=t[z*3+1],Q=t[z*3+2],re=ne,ie=Q,ae=-H;f[z*3]=ae,f[z*3+1]=ie,f[z*3+2]=-re}const p=new Uint32Array(a*3);for(let z=0;z<
a;z++)p[z*3]=n[z*3],p[z*3+1]=n[z*3+2],p[z*3+2]=n[z*3+1];const g=new Float32Array(i*3);for(let z=0;z<i;z++){const ne=e[z*
3],H=e[z*3+1],Q=e[z*3+2];g[z*3]=H,g[z*3+1]=-Q,g[z*3+2]=ne}await u.onBeforeCpuAllocation?.("glb-albedo-image-data",4*c*c);
const m=await or(r,c);if(!m)throw new Error("Failed to encode albedo texture as JPEG");await u.onBeforeCpuAllocation?.("\
glb-albedo-encoded",m.size);const h=new Uint8Array(await m.arrayBuffer());let w=null;if(s){await u.onBeforeCpuAllocation?.(
"glb-normal-image-data",4*c*c);const z=await or(s,c,.95);z&&(await u.onBeforeCpuAllocation?.("glb-normal-encoded",z.size),
w=new Uint8Array(await z.arrayBuffer()))}if(u.requireNormalTexture&&!w)throw Error("complete learned normal texture enco\
de required");let b=1/0,y=1/0,_=1/0,x=-1/0,k=-1/0,R=-1/0;for(let z=0;z<i;z++){const ne=f[z*3],H=f[z*3+1],Q=f[z*3+2];ne<b&&
(b=ne),ne>x&&(x=ne),H<y&&(y=H),H>k&&(k=H),Q<_&&(_=Q),Q>R&&(R=Q)}const E=z=>z+3&-4,M=new Uint8Array(f.buffer,f.byteOffset,
f.byteLength),D=new Uint8Array(g.buffer,g.byteOffset,g.byteLength),I=new Uint8Array(p.buffer,p.byteOffset,p.byteLength),
O=new Uint8Array(o.buffer,o.byteOffset,o.byteLength),G=E(M.byteLength),v=E(D.byteLength),P=E(I.byteLength),C=E(O.byteLength),
B=E(h.byteLength),A=w?E(w.byteLength):0,$=G+v+P+C+B+A;let U=0;const Y=[{buffer:0,byteOffset:U,byteLength:M.byteLength,target:34962},
{buffer:0,byteOffset:U+=G,byteLength:D.byteLength,target:34962},{buffer:0,byteOffset:U+=v,byteLength:I.byteLength,target:34963},
{buffer:0,byteOffset:U+=P,byteLength:O.byteLength,target:34962},{buffer:0,byteOffset:U+=C,byteLength:h.byteLength}],J=4;
let X=-1;w&&(X=Y.length,Y.push({buffer:0,byteOffset:U+=B,byteLength:w.byteLength}));const V=[{bufferView:0,componentType:5126,
count:i,type:"VEC3",min:[b,y,_],max:[x,k,R]},{bufferView:1,componentType:5126,count:i,type:"VEC3"},{bufferView:2,componentType:5125,
count:a*3,type:"SCALAR"},{bufferView:3,componentType:5126,count:i,type:"VEC2"}],F=[{bufferView:J,mimeType:"image/jpeg"}],
te=[{source:0,sampler:0}];w&&(F.push({bufferView:X,mimeType:"image/jpeg"}),te.push({source:1,sampler:0}));const j={pbrMetallicRoughness:{
baseColorTexture:{index:0},roughnessFactor:l,metallicFactor:d}};w&&(j.normalTexture={index:1});const ee=JSON.stringify({
asset:{version:"2.0",generator:"SF3D-WebGPU"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{
POSITION:0,NORMAL:1,TEXCOORD_0:3},indices:2,material:0}]}],materials:[j],textures:te,images:F,samplers:[{magFilter:9729,
minFilter:9729}],accessors:V,bufferViews:Y,buffers:[{byteLength:$}]});if(u.onBeforeCpuAllocation){if(/[^\x00-\x7f]/.test(
ee))throw Error("GLB authored JSON UTF8 demand changed");await u.onBeforeCpuAllocation("glb-json",ee.length)}const K=new TextEncoder().
encode(ee),se=E(K.byteLength),S=20+se+8+$;await u.onBeforeCpuAllocation?.("glb-complete-buffer",S);const T=new ArrayBuffer(
S),L=new DataView(T),N=new Uint8Array(T);L.setUint32(0,1179937895,!0),L.setUint32(4,2,!0),L.setUint32(8,S,!0);let W=12;L.
setUint32(W,se,!0),L.setUint32(W+4,1313821514,!0),W+=8,N.set(K,W);for(let z=K.byteLength;z<se;z++)N[W+z]=32;return W+=se,
L.setUint32(W,$,!0),L.setUint32(W+4,5130562,!0),W+=8,N.set(M,W),W+=G,N.set(D,W),W+=v,N.set(I,W),W+=P,N.set(O,W),W+=C,N.set(
h,W),W+=B,w&&N.set(w,W),T}function ca(t,e){let n=0,o=0,r=0;for(let I=0;I<e;I++)n+=t[I*3],o+=t[I*3+1],r+=t[I*3+2];n/=e,o/=
e,r/=e;let s=0,i=0,a=0,c=0,l=0,d=0;for(let I=0;I<e;I++){const O=t[I*3]-n,G=t[I*3+1]-o,v=t[I*3+2]-r;s+=O*O,i+=O*G,a+=O*v,
c+=G*G,l+=G*v,d+=v*v}const u=[s,i,a,i,c,l,a,l,d],f=[1,0,0,0,1,0,0,0,1];for(let I=0;I<50;I++){let O=0,G=0,v=1;for(let X=0;X<
3;X++)for(let V=X+1;V<3;V++){const F=Math.abs(u[X*3+V]);F>O&&(O=F,G=X,v=V)}if(O<1e-12)break;const P=u[G*3+G],C=u[v*3+v],
B=u[G*3+v],A=(C-P)/(2*B),$=Math.sign(A)/(Math.abs(A)+Math.sqrt(1+A*A)),U=1/Math.sqrt(1+$*$),Y=$*U,J=u.slice();J[G*3+G]=U*
U*P-2*Y*U*B+Y*Y*C,J[v*3+v]=Y*Y*P+2*Y*U*B+U*U*C,J[G*3+v]=0,J[v*3+G]=0;for(let X=0;X<3;X++){if(X===G||X===v)continue;const V=u[X*
3+G],F=u[X*3+v];J[X*3+G]=U*V-Y*F,J[G*3+X]=J[X*3+G],J[X*3+v]=Y*V+U*F,J[v*3+X]=J[X*3+v]}for(let X=0;X<9;X++)u[X]=J[X];for(let X=0;X<
3;X++){const V=f[X*3+G],F=f[X*3+v];f[X*3+G]=U*V-Y*F,f[X*3+v]=Y*V+U*F}}const p=[u[0],u[4],u[8]],g=[0,1,2].sort((I,O)=>p[O]-
p[I]);let m=[f[0+g[0]],f[3+g[0]],f[6+g[0]]],h=[f[0+g[1]],f[3+g[1]],f[6+g[1]]],w=Math.sqrt(m[0]**2+m[1]**2+m[2]**2)||1;m=
m.map(I=>I/w);const b=h[0]*m[0]+h[1]*m[1]+h[2]*m[2];h=h.map((I,O)=>I-b*m[O]),w=Math.sqrt(h[0]**2+h[1]**2+h[2]**2)||1,h=h.
map(I=>I/w);let y=[m[1]*h[2]-m[2]*h[1],m[2]*h[0]-m[0]*h[2],m[0]*h[1]-m[1]*h[0]];w=Math.sqrt(y[0]**2+y[1]**2+y[2]**2)||1,
y=y.map(I=>I/w);let _=ln(m),x=ln(h),k=ln(y);if(new Set([_,x,k]).size!==3){const I=new Set([0,1,2]);let O=1;for(;new Set(
[_,x,k]).size!==3;){const G=[...I].filter(v=>![_,x,k].includes(v))[0];if(O===1?k=G:O===2&&(x=G),O++,O>3)break}}const E=new Float32Array(
9),M=[m,h,y],D=[_,x,k];for(let I=0;I<3;I++)E[D[I]*3+0]=M[I][0],E[D[I]*3+1]=M[I][1],E[D[I]*3+2]=M[I][2];return E}function ln(t){
const e=Math.abs(t[0]),n=Math.abs(t[1]),o=Math.abs(t[2]);return e>=n&&e>=o?0:n>=e&&n>=o?1:2}function la(t,e,n,o,r,s,i,a){
const c=new Float32Array(i*3),l=new Float32Array(i*3);for(let u=0;u<a;u++){const f=n[u*3],p=n[u*3+1],g=n[u*3+2],m=t[p*3]-
t[f*3],h=t[p*3+1]-t[f*3+1],w=t[p*3+2]-t[f*3+2],b=t[g*3]-t[f*3],y=t[g*3+1]-t[f*3+1],_=t[g*3+2]-t[f*3+2],x=o[u*3+1]-o[u*3],
k=r[u*3+1]-r[u*3],R=o[u*3+2]-o[u*3],E=r[u*3+2]-r[u*3],M=m*E-b*k,D=h*E-y*k,I=w*E-_*k,O=Math.max(x*E-k*R,1e-6),G=M/O,v=D/O,
P=I/O;for(const C of[f,p,g])c[C*3]+=G,c[C*3+1]+=v,c[C*3+2]+=P,l[C*3]+=1,l[C*3+1]+=1,l[C*3+2]+=1}for(let u=0;u<i;u++){const f=l[u*
3]||1;let p=c[u*3]/f,g=c[u*3+1]/f,m=c[u*3+2]/f,h=Math.sqrt(p*p+g*g+m*m)||1;p/=h,g/=h,m/=h;const w=e[u*3],b=e[u*3+1],y=e[u*
3+2],_=p*w+g*b+m*y;p-=_*w,g-=_*b,m-=_*y,h=Math.sqrt(p*p+g*g+m*m)||1,c[u*3]=p/h,c[u*3+1]=g/h,c[u*3+2]=m/h}const d=new Float32Array(
i*3);for(let u=0;u<i;u++){const f=e[u*3],p=e[u*3+1],g=e[u*3+2],m=-t[u*3+1],h=t[u*3],w=0,b=h*g-w*p,y=w*f-m*g,_=m*p-h*f;let x=p*
_-g*y,k=g*b-f*_,R=f*y-p*b;const E=Math.sqrt(x*x+k*k+R*R)||1;d[u*3]=x/E,d[u*3+1]=k/E,d[u*3+2]=R/E}for(let u=0;u<6;u++){let f=0,
p=0,g=0,m=0,h=0,w=0,b=0;for(let B=0;B<a;B++)if(s[B]===u)for(let A=0;A<3;A++){const $=n[B*3+A];f+=c[$*3],p+=c[$*3+1],g+=c[$*
3+2],m+=d[$*3],h+=d[$*3+1],w+=d[$*3+2],b++}if(b===0)continue;const y=f/b,_=p/b,x=g/b,k=m/b,R=h/b,E=w/b,M=y*k+_*R+x*E,D=y*
R-_*k,I=Math.atan2(D,M),O=Math.cos(I),G=Math.sin(I);for(let B=0;B<a;B++)if(s[B]===u)for(let A=0;A<3;A++){const $=B*3+A,U=o[$]*
2-1,Y=r[$]*2-1;o[$]=O*U-G*Y,r[$]=G*U+O*Y}let v=1/0,P=-1/0;for(let B=0;B<a;B++)if(s[B]===u)for(let A=0;A<3;A++){const $=B*
3+A;o[$]<v&&(v=o[$]),o[$]>P&&(P=o[$]),r[$]<v&&(v=r[$]),r[$]>P&&(P=r[$])}const C=P-v||1;for(let B=0;B<a;B++)if(s[B]===u)for(let A=0;A<
3;A++){const $=B*3+A;o[$]=(o[$]-v)/C,r[$]=(r[$]-v)/C}}}function or(t,e,n=.92){if(typeof OffscreenCanvas!="function")throw new Error(
"SF3D texture encoding requires OffscreenCanvas");const o=new OffscreenCanvas(e,e),r=o.getContext("2d");if(!r)throw new Error(
"SF3D texture canvas is unavailable");const s=r.createImageData(e,e);return s.data.set(t),r.putImageData(s,0,0),o.convertToBlob(
{type:"image/jpeg",quality:n})}const Tr=Object.freeze([{slotKey:"scaledPos",perTexelBytes:12,baseBytes:0},{slotKey:"grid\
:XY",perTexelBytes:8,baseBytes:0},{slotKey:"grid:XZ",perTexelBytes:8,baseBytes:0},{slotKey:"grid:YZ",perTexelBytes:8,baseBytes:0},
{slotKey:"sampled:XY",perTexelBytes:160,baseBytes:0},{slotKey:"sampled:XZ",perTexelBytes:160,baseBytes:0},{slotKey:"samp\
led:YZ",perTexelBytes:160,baseBytes:0},{slotKey:"concatFeatures",perTexelBytes:480,baseBytes:0},{slotKey:"head:features:\
lin:0",perTexelBytes:256,baseBytes:0},{slotKey:"head:features:silu:0:dummy",perTexelBytes:0,baseBytes:4},{slotKey:"head:\
features:silu:0",perTexelBytes:256,baseBytes:0},{slotKey:"head:features:lin:1",perTexelBytes:256,baseBytes:0},{slotKey:"\
head:features:silu:1:dummy",perTexelBytes:0,baseBytes:4},{slotKey:"head:features:silu:1",perTexelBytes:256,baseBytes:0},
{slotKey:"head:features:lin:2",perTexelBytes:256,baseBytes:0},{slotKey:"head:features:silu:2:dummy",perTexelBytes:0,baseBytes:4},
{slotKey:"head:features:silu:2",perTexelBytes:256,baseBytes:0},{slotKey:"head:features:rawOut",perTexelBytes:12,baseBytes:0},
{slotKey:"head:features:sigmoid",perTexelBytes:12,baseBytes:0},{slotKey:"head:perturb_normal:lin:0",perTexelBytes:256,baseBytes:0},
{slotKey:"head:perturb_normal:silu:0:dummy",perTexelBytes:0,baseBytes:4},{slotKey:"head:perturb_normal:silu:0",perTexelBytes:256,
baseBytes:0},{slotKey:"head:perturb_normal:lin:1",perTexelBytes:256,baseBytes:0},{slotKey:"head:perturb_normal:silu:1:du\
mmy",perTexelBytes:0,baseBytes:4},{slotKey:"head:perturb_normal:silu:1",perTexelBytes:256,baseBytes:0},{slotKey:"head:pe\
rturb_normal:lin:2",perTexelBytes:256,baseBytes:0},{slotKey:"head:perturb_normal:silu:2:dummy",perTexelBytes:0,baseBytes:4},
{slotKey:"head:perturb_normal:silu:2",perTexelBytes:256,baseBytes:0},{slotKey:"head:perturb_normal:rawOut",perTexelBytes:12,
baseBytes:0},{slotKey:"head:perturb_normal:normalize3",perTexelBytes:12,baseBytes:0}]),da=t=>Math.ceil(t/4)*4,$r=(t,e)=>da(
t.baseBytes+t.perTexelBytes*e);function fa(t,e=Tr){return e.reduce((n,o)=>n+$r(o,t),0)}function pa(t,{maxBatch:e,slotGraph:n=Tr}){
if(!Number.isSafeInteger(e)||e<=0)throw new TypeError("maxBatch must be a positive safe integer");const o=new Map;let r=0;
for(const a of n){const c=$r(a,e),l=q(t,c,0,`arena:${a.slotKey}`);o.set(a.slotKey,{buffer:l,capacity:c,perTexelBytes:a.perTexelBytes,
baseBytes:a.baseBytes}),r+=c}let s=!1,i=0;return{slotCount:o.size,totalBytes:r,maxBatch:e,acquire(a,c){if(s)throw new Error(
"decoder scratch arena is destroyed");const l=o.get(a);if(!l)throw new Error(`decoder arena has no slot "${a}" (slot gra\
ph mismatch)`);if(c>l.capacity)throw new Error(`decoder arena slot "${a}" overflow: need ${c} > capacity ${l.capacity} (\
maxBatch ${e})`);return i++,l.buffer},snapshot(){return{slotCount:o.size,totalBytes:r,maxBatch:e,acquireCount:i,destroyed:s}},
destroy(){if(s)return{retired:0};let a=0;for(const c of o.values())try{c.buffer.destroy(),a++}catch{}return o.clear(),s=
!0,{retired:a}}}}const ma="sf3d.texture-bake-cooperative-boundaries.v0",Or="texture-bake-texel-batches",sr="sf3d.decoder\
-scratch-arena";async function ga(t,{maxBatch:e,signal:n},o){const r=fa(e);let s=null;const i=Io({controllerId:"sf3d.tex\
ture-bake.decoder-arena",plan:{planId:"sf3d.texture-bake.decoder-arena.v0",resources:[{resourceId:sr,declaredBytes:r}],phases:[
{phaseId:"texture-bake",requiredResourceIds:[sr]}]},acquireResource:({resource:a})=>(s=pa(t,{maxBatch:e}),{resourceId:a.
resourceId,value:s,release:()=>(s.destroy().retired>=0,"released")}),residencySnapshot:()=>s?s.snapshot():{slotCount:0,totalBytes:0}});
try{return await i.transitionToPhase("texture-bake",{signal:n}),await o(s,i.snapshot())}finally{i.close()}}function ha(t,e){
if(!Number.isSafeInteger(t)||t<=0)throw new TypeError("numOccupied must be a positive safe integer");if(!Number.isSafeInteger(
e)||e<=0)throw new TypeError("batchTexels must be a positive safe integer");return ut({manifestId:ma,routeId:Xe,phases:[
{phaseId:"texture-bake",boundaries:[{boundaryId:Or,kind:"gpu-command",unit:"texel-batch",totalItems:t,progressWeight:t,commandDutyKind:"\
compute",chunking:{mode:"fixed",chunkItems:e},yieldPolicy:"after-duty",resources:{retain:["triplane.features","decoder.w\
eights"],produce:["texture.albedo","texture.normal"],release:[]}}]}],metadata:{source:"sf3d-webgpu-cooperative-texture-b\
ake"}})}function ba(t,e={}){const{batchTexels:n=16384,schedulingMode:o="cooperative",onProgress:r,signal:s,invocationId:i=`\
sf3d:texture-bake:${o}`,onBrowserYield:a}=e;return async function(l,d){const u=()=>globalThis.performance?.now?.()??Date.
now(),f=Math.min(n,l),p=ha(l,f),g=[],m=[],h=[],w={allocatedCount:0,allocatedBytes:0,retiredCount:0,retiredBytes:0,activeCount:0,
activeBytes:0};let b=null;const y=[],_=[],x=(E,M)=>{const D=u();let I=0,O=0;for(;E.length>0;){const v=E[0];if(!v||typeof v.
buffer?.destroy!="function")throw new TypeError("scratch resource must expose buffer.destroy()");v.buffer.destroy(),E.shift(),
I+=v.size,O+=1,w.retiredCount+=1,w.retiredBytes+=v.size,w.activeCount-=1,w.activeBytes-=v.size}const G=u();return h.push(
{reason:M,retiredCount:O,retiredBytes:I,interval:{startMs:D,endMs:G}}),{retiredCount:O,retiredBytes:I,interval:{startMs:D,
endMs:G}}},k=Nt(t,{foregroundOpportunities:e.foregroundOpportunities??null,async onQueueFenceResolved(E){const M=x(_,"qu\
eue-prefix-resolved");m.push({rangeIndex:b?.rangeIndex??null,itemStart:b?.itemStart??null,itemEnd:b?.itemEnd??null,queueWaitMs:E.
queueWaitMs,queueInterval:{startMs:E.startedAtMs,endMs:E.completedAtMs},retirementMs:M.interval.endMs-M.interval.startMs,
retirementInterval:M.interval,retiredCount:M.retiredCount,retiredBytes:M.retiredBytes})},async onBrowserYield(E){b&&(b.browserYieldMs+=
E.elapsedMs,b.browserYieldIntervals.push({startMs:E.startedAtMs,endMs:E.completedAtMs})),typeof a=="function"&&await a(E)}}),
R=zt({runtime:k,manifest:p,invocationId:i,schedulingMode:o,onProgress:r,signal:s});try{await R.run(async E=>{const M=E.startBoundary(
Or);let D;for(;(D=M.nextRange())!=null;){const I=D.itemStart,O=D.itemEnd,G=u(),v=await d(I,O),P=Array.isArray(v.scratchResources)?
v.scratchResources:[];for(const $ of P)if(!Number.isFinite($?.size)||$.size<0)throw new TypeError("scratch resource size\
 must be a non-negative finite number");const C=P.reduce(($,U)=>$+U.size,0);y.push(...P),w.allocatedCount+=P.length,w.allocatedBytes+=
C,w.activeCount+=P.length,w.activeBytes+=C;const B={rangeIndex:D.rangeIndex,itemStart:I,itemEnd:O,itemCount:D.itemCount,
modelEncodeMs:Number.isFinite(v.hostEncodeMs)?v.hostEncodeMs:null,hostEncodeMs:0,dutyLifecycleMs:0,dutyWallMs:0,browserYieldMs:0,
prepareEncodeInterval:{startMs:G,endMs:G},submitInterval:null,dutyLifecycleInterval:{startMs:0,endMs:0},browserYieldIntervals:[],
scratchAllocatedCount:P.length,scratchAllocatedBytes:C};b=B;const A=u();B.dutyLifecycleInterval.startMs=A;try{await M.runGpuDuty(
D,{encode:()=>{const $=u();try{const U=v.encode();return _.push(...y),y.length=0,U}finally{B.prepareEncodeInterval.endMs=
u(),B.hostEncodeMs=B.prepareEncodeInterval.endMs-B.prepareEncodeInterval.startMs,B.submitInterval={startMs:$,endMs:u()}}}})}finally{
B.dutyLifecycleInterval.endMs=u(),B.dutyLifecycleMs=B.dutyLifecycleInterval.endMs-B.dutyLifecycleInterval.startMs,B.dutyWallMs=
B.dutyLifecycleMs,g.push(B),b=null}}})}catch(E){const M={unsubmitted:null,recoveryFence:null,submitted:null};try{if(y.length>
0&&(M.unsubmitted=x(y,"failure-before-submit")),_.length>0){const D=u();let I=null;try{await t.queue.onSubmittedWorkDone()}catch(O){
I=O}M.recoveryFence={startMs:D,endMs:u(),status:I?"rejected-device-unavailable":"resolved",error:I?.message??null},M.submitted=
x(_,I?"device-unavailable-after-recovery-fence":"terminal-recovery-fence")}}catch(D){M.error=D.message}throw E.textureBakeCleanup=
Object.freeze(M),E}if(y.length!==0||_.length!==0||w.activeCount!==0||w.activeBytes!==0)throw new Error("texture-bake scr\
atch resources remained active after queue completion");return Object.freeze({...R.finish(),textureBakeTelemetry:Object.
freeze({schema:"sf3d.texture-bake-duty-telemetry.v1",ranges:Object.freeze(g.map(E=>Object.freeze({...E}))),queueFences:Object.
freeze(m.map(E=>Object.freeze({...E}))),cleanupEvents:Object.freeze(h.map(E=>Object.freeze({...E}))),scratch:Object.freeze(
{...w})})})}}const ir=512,dn=1024;async function wa(t,e,n,o,r,s){if(!r)return na(t,e,n,o);const i=t.slice().buffer,a=e.slice().
buffer,c=`uv-${Math.random().toString(36).slice(2)}`;return await He(r,{vertices:i,faces:a,numVertices:n,numFaces:o,id:c},
[i,a],{timeoutMs:s||3e4,onResult:l=>oo(l)})}async function ya(t,e,n,o,r={},s){const i=M=>{r.signal?.throwIfAborted(),s&&
s(M)},a=performance.now(),c=[],l=(M,D,I)=>c.push({name:M,start:D,end:I}),d=async(M,D)=>{i(M);const I=performance.now(),O=await D();
return r.signal?.throwIfAborted(),l(M,I,performance.now()),O},u=await Mi(t,e,n,o,i,{...r,recordStageSpans:c});i("clip-ma\
terial-estimate");const f=performance.now(),p=u._conditionRgba,{roughness:g,metallic:m}=await Hi(t,p,ir,ir,n,{clipPrepWorker:r.
clipPrepWorker,workerTimeoutMs:r.workerTimeoutMs,withForeground:r.withForeground});l("clip-material-estimate",f,performance.
now()),await r.retirePhase?.("clip-material-estimate",[u._triplanesBuf]);const h=await d("uv-unwrap",()=>Le(r,r.uvUnwrapWorker?
"uv-unwrap-worker":"uv-unwrap",()=>wa(u.vertices,u.faces,u.numVertices,u.numFaces,r.uvUnwrapWorker,r.workerTimeoutMs))),
w=await d("uv-rasterize",()=>Le(r,"uv-rasterize",()=>sa(h.uvs,h.newVertices,h.newFaces,h.newNumFaces,dn,h.faceAssignment)));
let b=null;const y={};if(r.cooperativeBake){const M={},D=ba(t,{foregroundOpportunities:r.foregroundOpportunities??null,batchTexels:r.
bakeBatchTexels||16384,schedulingMode:r.bakeSchedulingMode==="disabled"?"disabled":"cooperative",onProgress:I=>{I.percent!=
null&&i(`Texture bake ${I.completedItems}/${I.totalItems} (${I.percent.toFixed(0)}%)`)}});y.cooperativeBatch=async(I,O)=>{
b=await D(I,O)},y.telemetry=M,y.finalizeTelemetry=()=>M}r.materializeWorker&&(y.materializeWorker=r.materializeWorker,y.
workerTimeoutMs=r.workerTimeoutMs),y.withForeground=r.withForeground;const _=()=>aa(t,u._triplaneDecoder,u._triplanesBuf,
u._decoderWeights,w.positions3D,w.mask,w.tbnData,dn,y);let x=null;const k=await d("texture-bake",async()=>{if(r.decoderArena&&
r.cooperativeBake){const M=r.bakeBatchTexels||16384;return await ga(t,{maxBatch:M},async(D,I)=>{y.arena=D,x=I;const O=await _();
return x=D.snapshot(),O})}return _()});await r.retirePhase?.("texture-bake",[]),b&&y.finalizeTelemetry&&(b=Object.freeze(
{...b,textureBakeTelemetry:Object.freeze({...b.textureBakeTelemetry,phases:Object.freeze({...y.finalizeTelemetry()})})}));
const R=await d("glb-export",()=>Le(r,"glb-export",()=>ua(h.newVertices,h.newNormals,h.newFaces,h.uvs,k.albedo,k.normalMap,
h.newNumVertices,h.newNumFaces,dn,g,m,{requireNormalTexture:!0}))),E=Object.freeze({preprocess:r.preprocessWorker?"worke\
r":"main",clipPrep:r.clipPrepWorker?"worker":"main",marchingTet:r.marchingTetWorker?"worker":"main",uvUnwrap:r.uvUnwrapWorker?
"worker":"main",materialize:r.materializeWorker?"worker":"main"});return{stageSpans:c,glb:R,numVertices:u.numVertices,numFaces:u.
numFaces,vertices:u.vertices,faces:u.faces,offloads:E,uvNumVertices:h.newNumVertices,uvNumFaces:h.newNumFaces,roughness:g,
metallic:m,cooperativeReports:{...u._cooperativeReports||{},...b?{"texture-bake":b}:{}},arenaSnapshot:x,dinoPayload:u._dinoPayload||
null,sdf:u._sdf,isosurfaceThreshold:u._isosurfaceThreshold,stageTimings:u._stageTimings||{},totalMs:performance.now()-a}}
const ka=Object.freeze({cooperativeDino:!0,dinoSchedulingMode:"cooperative",dinoChunkBlocks:1,cooperativeTwoStream:!0,twoStreamSchedulingMode:"\
cooperative",twoStreamDutyGranularity:"attention-tile",twoStreamLinearRowsPerDuty:256,cooperativePostProcessor:!0,postProcessorSchedulingMode:"\
cooperative",postProcessorDutyGranularity:"channel-range",postProcessorChannelsPerDuty:16,postProcessorCompletionPolicy:"\
bounded-prefix",postProcessorMaxInFlightGpuDuties:2,cooperativeBake:!0,bakeSchedulingMode:"cooperative",bakeBatchTexels:4096,
decoderArena:!0,workerTimeoutMs:12e4}),Gr=Object.freeze({preprocessWorker:"./preprocess_worker.js",clipPrepWorker:"./cli\
p_prep_worker.js",marchingTetWorker:"./marching_tet_worker.js",uvUnwrapWorker:"./uv_unwrap_worker.js",materializeWorker:"\
./materialize_worker.js"});function va(){return Object.freeze({})}function _a(){throw new Error("PeerCompute owns SF3D w\
orker lifetime; pass workers:{}")}function Ia(t){for(const e of Object.values(t||{}))try{e.terminate()}catch{}}function xa({
workers:t={},overrides:e={}}={}){for(const n of Object.keys(t))if(!(n in Gr))throw new Error(`unknown product route work\
er role: ${n}`);return Object.freeze({...ka,...t,...e})}function Sa(t){return Object.freeze({cooperativeDino:t.cooperativeDino===
!0&&t.dinoSchedulingMode!=="disabled",cooperativeTwoStream:t.cooperativeTwoStream===!0&&t.twoStreamSchedulingMode!=="dis\
abled",twoStreamDutyGranularity:t.cooperativeTwoStream===!0?t.twoStreamDutyGranularity??"stage":null,cooperativePostProcessor:t.
cooperativePostProcessor===!0&&t.postProcessorSchedulingMode!=="disabled",postProcessorDutyGranularity:t.cooperativePostProcessor===
!0?t.postProcessorDutyGranularity??"plane":null,postProcessorCompletionPolicy:t.cooperativePostProcessor===!0?t.postProcessorCompletionPolicy??
"strict-prefix":null,cooperativeBake:t.cooperativeBake===!0&&t.bakeSchedulingMode!=="disabled",bakeBatchTexels:t.cooperativeBake===
!0?t.bakeBatchTexels??16384:null,decoderArena:t.decoderArena===!0&&t.cooperativeBake===!0,workers:Object.freeze(Object.fromEntries(
Object.keys(Gr).map(e=>[e,!!t[e]])))})}function Ba({release:t}){if(typeof t!="function")throw new Error("release must be\
 a function");const e={activeRunId:null,disposed:!1,releaseStarted:!1,quarantined:!1,quarantineReason:void 0};let n,o;const r=new Promise(
(i,a)=>{n=i,o=a});r.catch(()=>{});const s=()=>(e.releaseStarted||(e.releaseStarted=!0,Promise.resolve().then(()=>t()).then(
()=>n(Object.freeze({status:"released"})),i=>o(i))),r);return Object.freeze({get activeRunId(){return e.activeRunId},get disposed(){
return e.disposed},get quarantined(){return e.quarantined},beginRun(i){if(e.quarantined)throw new Error("sf3d producer i\
s quarantined after failed foreground finish",{cause:e.quarantineReason});if(e.disposed)throw new Error("sf3d producer i\
s disposed");if(e.activeRunId!=null)throw new Error(`sf3d producer already has an active run (${e.activeRunId})`);e.activeRunId=
i},endRun(i){if(e.activeRunId!==i)throw new Error(`${i} is not the active run (${e.activeRunId??"none"})`);return e.activeRunId=
null,e.quarantined?"quarantined":e.disposed?(s(),"release-started"):"idle"},quarantine(i,a){if(e.activeRunId!==i)throw new Error(
`${i} is not the active run (${e.activeRunId??"none"})`);e.quarantined||(e.quarantined=!0,e.quarantineReason=a,o(a))},assertAcceptingRequests(){
if(e.disposed)throw new Error("sf3d producer is disposed")},dispose(){return e.disposed?Object.freeze({status:"already-d\
isposed",completion:r}):(e.disposed=!0,e.quarantined?Object.freeze({status:"quarantined",completion:r}):e.activeRunId!=null?
Object.freeze({status:"deferred-until-run-ends",runId:e.activeRunId,completion:r}):(s(),Object.freeze({status:"releasing",
completion:r})))}})}async function Ea({lifecycle:t,foreground:e,runId:n,buildOptions:o}){if(typeof n!="string"||!n.trim())
throw new Error("runId must be a non-empty string");if(typeof o!="function")throw new Error("buildOptions must be a func\
tion");const r=o();t.beginRun(n);let s;try{s=await e.beginRun(n)}catch(c){throw t.endRun(n),c}const i=Object.freeze({...r,
foregroundOpportunities:s.foregroundOpportunities,withForeground:s.withForeground});let a=null;return Object.freeze({runId:n,
options:i,foregroundRun:s,async release(){return a||(a=(async()=>{try{return await s.finish()}catch(c){throw t.quarantine(
n,c),c}finally{t.endRun(n)}})(),a)}})}const Aa="sf3d.producer.v0",Pa="sf3d.producer-run-identity.v0";function Ca(t,e=globalThis.
location?.href??null){if(typeof t!="string"||!t)throw new Error("weightsUrl must be a non-empty string");try{return new URL(
t,e??void 0).href}catch{return t}}function Ma(t){if(typeof t?.dispose=="function")return t.dispose();let e=0;const n=new Set,
o=r=>{if(!(!r||typeof r!="object"||n.has(r))&&(n.add(r),!(ArrayBuffer.isView(r)||r instanceof ArrayBuffer))){if(typeof r.
destroy=="function"){r.destroy(),e+=1;return}for(const s of Object.values(r))o(s)}};return o(t),e}async function ar({foreground:t,
retainedClipPrepWorker:e,routeWorkers:n,modelWeights:o,ownsWorkers:r,ownsWeights:s}){const i=[],a=async c=>{try{await c()}catch(l){
i.push(l)}};if(t&&await t.dispose(),e&&await a(()=>Vi(n.clipPrepWorker,o)),r&&n&&await a(()=>Ia(n)),s&&await a(()=>Ma(o)),
i.length===1)throw i[0];if(i.length>1)throw new AggregateError(i,"SF3D producer cleanup encountered multiple failures")}
function Fr({runId:t,routeId:e,startedAtMs:n,finishedAtMs:o,deviceInjected:r,commit:s,kitVersion:i}){return Object.freeze(
{schema:Pa,runId:t,routeId:e,timeOrigin:globalThis.performance?.timeOrigin??null,clock:"performance.now",startedAtMs:n,finishedAtMs:o,
durationMs:o-n,deviceTopology:r?"host-injected-device":"producer-owned-device",producerCommit:s,kitVersion:i})}async function ur({
prepared:t,pipelineFailed:e,pipelineError:n,runId:o,lastProgress:r,startedAtMs:s,deviceInjected:i,commit:a}){let c=null,
l=!1,d;try{c=await t.release()}catch(g){l=!0,d=g}if(!e&&!l)return c;const u=e&&l?new AggregateError([n,d],"SF3D inferenc\
e and foreground finish both failed",{cause:n}):e?n:d,f=Object.freeze({runId:o,lastProgress:r,foregroundOpportunityReport:c,
inferenceCompleted:!e,identity:Fr({runId:o,routeId:Ue,startedAtMs:s,finishedAtMs:performance.now(),deviceInjected:i,commit:a,
kitVersion:gt})});let p=u instanceof Error?u:new Error("SF3D run failed with non-Error reason",{cause:u});throw Object.isExtensible(
p)||(p=new Error(p.message,{cause:p})),p.sf3dRun=f,p}const Da=Object.freeze(["image-preprocess","dinov2-tokenizer","two-\
stream-backbone","triplane-decode","marching-tet","texture-bake","glb-export"]),Ze=1024;async function Ra(t,e){let n=t?.
info??e.adapterInfo??null;!n&&t?.requestAdapterInfo&&(n=await t.requestAdapterInfo()),n=n||{};const o=t?.limits??e.limits,
r=[...t?.features??e.features??[]];return{identity:Eo({adapterName:n.description||n.device||"unknown",browser:globalThis.
navigator?.userAgent??"unknown",requestedFeatures:r,effectiveFeatures:r,limits:{maxBufferSize:o.maxBufferSize,maxStorageBufferBindingSize:o.
maxStorageBufferBindingSize,maxComputeInvocationsPerWorkgroup:o.maxComputeInvocationsPerWorkgroup},timestampQuery:r.includes(
"timestamp-query")?"available":"unavailable"}),info:n,limits:o,features:r}}function Ta({backend:t,image:e,result:n,commit:o}){
const r=To({route:Ue,timingSource:"performance-now-wall-clock",requiredStages:[...Da]}),s=n.stageTimings||{};for(const l of[
"image-preprocess","dinov2-tokenizer","two-stream-backbone","triplane-decode","marching-tet"])Zt(r,{name:l,ms:s[l]||0});
const i=l=>{const d=(n.stageSpans||[]).find(u=>u.name===l);return d?d.end-d.start:0};Zt(r,{name:"texture-bake",ms:i("tex\
ture-bake")}),Zt(r,{name:"glb-export",ms:i("glb-export")});const a=e.naturalWidth||e.width,c=e.naturalHeight||e.height;return Ts(
{input:{artifactId:`source-image:${a}x${c}`,sha256:"not-computed",shape:[c,a,4]},outputs:{meshGlb:{artifactId:`mesh-glb:${n.
numVertices}v-${n.numFaces}f`,sha256:"not-computed",shape:[n.glb.byteLength]},albedoTexture:{artifactId:`albedo-texture:${Ze}`,
sha256:"not-computed",shape:[Ze,Ze,4]},normalMap:{artifactId:`normal-map:${Ze}`,sha256:"not-computed",shape:[Ze,Ze,4]}},
backend:t.identity,model:{revision:"v1.0.0-webgpu",weightsHash:"not-computed"},kernel:{kitVersion:gt,profile:"dinov2-two\
-stream-triplane-marching-tet-texture-bake",commit:o},profile:r})}async function ja({device:t=null,adapter:e=null,weights:n=null,
weightsUrl:o="weights.bin",workers:r=null,onWeightsProgress:s=null,memoryBudget:i=null,expectedWeightBytes:a=void 0,weightLoadingMode:c="\
whole-file",expectedSourceETag:l=void 0,commit:d=typeof __COMMIT_HASH__<"u"?__COMMIT_HASH__:"dev"}={}){if(i&&!jr(i))throw new TypeError(
"authenticated loader budget required");if(i&&n!=null)throw new Error("injected weights are unaccounted by the loader bu\
dget");i&&t!=null&&i.assertDeviceAcquiredHere(t);const u=await Wr(t?{device:t,adapter:e}:{}),f=u.device,p=()=>{i&&!u.injected&&
(f.destroy(),i.restore())};if(i&&!u.injected)try{i.bindOwnedDevice(f)}catch(M){throw f.destroy(),M}const g=n==null;let m,
h;try{h=await Ra(u.adapter,f),m=n??await Lr(f,o,s||void 0,{memoryBudget:i,expectedWeightBytes:a,loadingMode:c,expectedSourceETag:l})}catch(M){
try{p()}catch(D){throw new AggregateError([M,D],"SF3D budgeted loading and device cleanup failed",{cause:M})}throw M}m._assertActive?.(
f);const w=Object.freeze({weightsSource:g?"loaded-by-producer":"injected-by-host",weightsUrl:g?Ca(o):null,weightsSha256:"\
not-computed",workerModuleUrls:va(),workersSource:r==null?"created-by-producer":"injected-by-host"}),b=r==null;let y,_,x,
k=!1;try{y=Ci(f),_=r??_a(),_?.clipPrepWorker&&(Xi(_.clipPrepWorker,m),k=!0),x=Ho({routeId:Ue,device:f,queue:f.queue})}catch(M){
const D=[M];try{await ar({foreground:x,retainedClipPrepWorker:k,routeWorkers:_,modelWeights:m,ownsWorkers:b,ownsWeights:g})}catch(I){
D.push(I)}try{p()}catch(I){D.push(I)}throw D.length>1?new AggregateError(D,"SF3D producer initialization and cleanup fai\
led",{cause:M}):M}let R=0;const E=Ba({async release(){await ar({foreground:x,retainedClipPrepWorker:k,routeWorkers:_,modelWeights:m,
ownsWorkers:b,ownsWeights:g}),p()}});return Object.freeze({schema:Aa,routeId:Ue,kitVersion:gt,device:f,adapter:u.adapter,
deviceInjected:u.injected,weights:m,pipelines:y,workers:_,backend:h.identity,resources:w,adapterInfo:h.info,adapterLimits:h.
limits,adapterFeatures:Object.freeze([...h.features]),get activeRunId(){return E.activeRunId},get disposed(){return E.disposed},
get quarantined(){return E.quarantined},requestForegroundOpportunity(M){return E.assertAcceptingRequests(),x.request(M)},
foregroundSnapshot(){return x.snapshot()},async run(M,{runId:D=null,onProgress:I=null,routeOverrides:O={},signal:G=null}={}){
if(M==null)throw new Error("sf3d run requires an image (HTMLImageElement/ImageBitmap-like)");if(G?.aborted)throw new Error(
"sf3d run aborted before start");R+=1;const v=D??`sf3d-run-${R}`,P=await Ea({lifecycle:E,foreground:x,runId:v,buildOptions:()=>xa(
{workers:_,overrides:O})}),{options:C}=P;let B,A=null,$=null;const U=performance.now(),Y=F=>{G?.throwIfAborted(),$=String(
F),I&&I(F)};try{B=await ya(f,y,m,M,{...C,signal:G},Y)}catch(F){await ur({prepared:P,pipelineFailed:!0,pipelineError:F,runId:v,
lastProgress:$,startedAtMs:U,deviceInjected:u.injected,commit:d})}A=await ur({prepared:P,pipelineFailed:!1,runId:v,lastProgress:$,
startedAtMs:U,deviceInjected:u.injected,commit:d});const J=performance.now(),X=Ta({backend:h,image:M,result:B,commit:d}),
V=wo(X);return Object.freeze({schema:"sf3d.producer-run-result.v0",runId:v,identity:Fr({runId:v,routeId:Ue,startedAtMs:U,
finishedAtMs:J,deviceInjected:u.injected,commit:d,kitVersion:gt}),resources:w,glb:B.glb,receipt:X,receiptValidation:V,routeOptions:Sa(
C),offloads:B.offloads,cooperativeReports:B.cooperativeReports,stageSpans:B.stageSpans,stageTimings:B.stageTimings,totalMs:B.
totalMs,foregroundOpportunityReport:A,numVertices:B.numVertices,numFaces:B.numFaces,uvNumVertices:B.uvNumVertices,uvNumFaces:B.
uvNumFaces,vertices:B.vertices,faces:B.faces,roughness:B.roughness,metallic:B.metallic,sdf:B.sdf,isosurfaceThreshold:B.isosurfaceThreshold,
arenaSnapshot:B.arenaSnapshot,dinoPayload:B.dinoPayload})},dispose(){return E.dispose()}})}export{Pa as SF3D_PRODUCER_RUN_IDENTITY_SCHEMA,Aa as SF3D_PRODUCER_SCHEMA,Da as SF3D_REQUIRED_RECEIPT_STAGES,Fr as buildRunIdentity,
Ha as createLoaderMemoryBudget,ja as createSf3dProducer,ur as finishProducerRunWithEvidence,Ma as releaseLoadedWeights,ar as releaseProducerResources,
Ca as resolveWeightsUrl};

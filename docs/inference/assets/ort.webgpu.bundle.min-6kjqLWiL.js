/*!
 * ONNX Runtime Web v1.31.1
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var fn=Object.defineProperty,Ul=Object.getOwnPropertyDescriptor,Pl=Object.getOwnPropertyNames,$l=Object.prototype.hasOwnProperty,
kl=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(n,i)=>(typeof require<"u"?require:n)[i]}):r)(function(r){
if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')}),
G=(r,n,i)=>()=>{if(i)throw i[0];try{return r&&(n=r(r=0)),n}catch(f){throw i=[f],f}},Ut=(r,n)=>{for(var i in n)fn(r,i,{get:n[i],
enumerable:!0})},Nl=(r,n,i,f)=>{if(n&&typeof n=="object"||typeof n=="function")for(let u of Pl(n))!$l.call(r,u)&&u!==i&&
fn(r,u,{get:()=>n[u],enumerable:!(f=Ul(n,u))||f.enumerable});return r},er=r=>Nl(fn({},"__esModule",{value:!0}),r),mt,Ne,
Pr,bt,$r,xi,Ei,ln=G(()=>{"use strict";mt=new Map,Ne=[],Pr=new WeakMap,bt=(r,n,i)=>{if(n&&typeof n.init=="function"&&typeof n.
createInferenceSessionHandler=="function"){let f=mt.get(r);if(f===void 0)mt.set(r,{backend:n,priority:i});else{if(f.priority>
i)return;if(f.priority===i&&f.backend!==n)throw new Error(`cannot register backend "${r}" using priority ${i}`)}if(i>=0){
let u=Ne.indexOf(r);u!==-1&&Ne.splice(u,1);for(let p=0;p<Ne.length;p++)if(mt.get(Ne[p]).priority<=i){Ne.splice(p,0,r);return}
Ne.push(r)}return}throw new TypeError("not a valid backend")},$r=async r=>{let n=mt.get(r);if(!n)return"backend not foun\
d.";if(n.initialized)return n.backend;if(n.aborted)return n.error;{let i=!!n.initPromise;try{if(!i){let f=n.backend,u=Pr.
get(f);n.initPromise=u?u.then(async()=>f.init(r),async()=>f.init(r)):f.init(r),Pr.set(f,n.initPromise)}return await n.initPromise,
n.initialized=!0,n.backend}catch(f){return i||(n.error=`${f}`,n.aborted=!0),n.error}finally{delete n.initPromise}}},xi=async r=>{
let n=r.executionProviders||[],i=n.map(g=>typeof g=="string"?g:g.name),f=i.length===0?Ne:i,u,p=[],w=new Set;for(let g of f){
let x=await $r(g);typeof x=="string"?p.push({name:g,err:x}):(u||(u=x),u===x&&w.add(g))}if(!u)throw new Error(`no availab\
le backend found. ERR: ${p.map(g=>`[${g.name}] ${g.err}`).join(", ")}`);for(let{name:g,err:x}of p)i.includes(g)&&console.
warn(`removing requested execution provider "${g}" from session options because it is not available: ${x}`);let d=n.filter(
g=>w.has(typeof g=="string"?g:g.name));return[u,new Proxy(r,{get:(g,x)=>x==="executionProviders"?d:Reflect.get(g,x)})]},
Ei=async()=>{let r=[];for(let i of Ne){if(typeof mt.get(i).backend.createLoraAdapterHandler!="function")continue;let f=await $r(
i);if(typeof f!="string")return f;r.push({name:i,err:f})}let n=r.length===0?"":` ERR: ${r.map(i=>`[${i.name}] ${i.err}`).
join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${n}`)}}),_l=G(()=>{"use strict";ln()}),Ai,Dl=G(
()=>{"use strict";Ai="1.31.1"}),kr,oe,Ci=G(()=>{"use strict";Dl(),kr="warning",oe={wasm:{},webgl:{},webgpu:{},versions:{
common:Ai},set logLevel(r){if(r!==void 0){if(typeof r!="string"||["verbose","info","warning","error","fatal"].indexOf(r)===
-1)throw new Error(`Unsupported logging level: ${r}`);kr=r}},get logLevel(){return kr}},Object.defineProperty(oe,"logLev\
el",{enumerable:!0})}),ee,Gl=G(()=>{"use strict";Ci(),ee=oe}),nn,Nr,Fe,Ve,at,ot,cn=G(()=>{"use strict";Ci(),nn=(r,n)=>{(typeof oe.
trace>"u"?!oe.wasm.trace:!oe.trace)||console.timeStamp(`${r}::ORT::${n}`)},Nr=(r,n)=>{let i=new Error().stack?.split(/\r\n|\r|\n/g)||
[],f=!1;for(let u=0;u<i.length;u++){if(f&&!i[u].includes("TRACE_FUNC")){let p=`FUNC_${r}::${i[u].trim().split(" ")[1]}`;
n&&(p+=`::${n}`),nn("CPU",p);return}i[u].includes("TRACE_FUNC")&&(f=!0)}},Fe=r=>{(typeof oe.trace>"u"?!oe.wasm.trace:!oe.
trace)||Nr("BEGIN",r)},Ve=r=>{(typeof oe.trace>"u"?!oe.wasm.trace:!oe.trace)||Nr("END",r)},at=r=>{(typeof oe.trace>"u"?!oe.
wasm.trace:!oe.trace)||console.time(`ORT::${r}`)},ot=r=>{(typeof oe.trace>"u"?!oe.wasm.trace:!oe.trace)||console.timeEnd(
`ORT::${r}`)}}),dn,Si=G(()=>{"use strict";ln(),cn(),dn=class Oi{constructor(n,i){this.backend=n,this.handler=i}static async create(n){
if(Fe(),typeof n!="string"&&!(n instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'b\
uffer'.");let i=await Ei(),f=await i.createLoraAdapterHandler(n);return Ve(),new Oi(i,f)}async release(){return this.handler.
dispose()}}}),Ii,Bi,Wl=G(()=>{"use strict";Ii=(r,n)=>{let i=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(
1,1);i.width=r.dims[3],i.height=r.dims[2];let f=i.getContext("2d");if(f!=null){let u,p;n?.tensorLayout!==void 0&&n.tensorLayout===
"NHWC"?(u=r.dims[2],p=r.dims[3]):(u=r.dims[3],p=r.dims[2]);let w=n?.format!==void 0?n.format:"RGB",d=n?.norm,g,x;d===void 0||
d.mean===void 0?g=[255,255,255,255]:typeof d.mean=="number"?g=[d.mean,d.mean,d.mean,d.mean]:(g=[d.mean[0],d.mean[1],d.mean[2],
0],d.mean[3]!==void 0&&(g[3]=d.mean[3])),d===void 0||d.bias===void 0?x=[0,0,0,0]:typeof d.bias=="number"?x=[d.bias,d.bias,
d.bias,d.bias]:(x=[d.bias[0],d.bias[1],d.bias[2],0],d.bias[3]!==void 0&&(x[3]=d.bias[3]));let v=p*u,T=0,E=v,A=v*2,L=-1;w===
"RGBA"?(T=0,E=v,A=v*2,L=v*3):w==="RGB"?(T=0,E=v,A=v*2):w==="RBG"&&(T=0,A=v,E=v*2);for(let N=0;N<p;N++)for(let H=0;H<u;H++){
let B=(r.data[T++]-x[0])*g[0],O=(r.data[E++]-x[1])*g[1],q=(r.data[A++]-x[2])*g[2],U=L===-1?255:(r.data[L++]-x[3])*g[3];f.
fillStyle="rgba("+B+","+O+","+q+","+U+")",f.fillRect(H,N,1,1)}if("toDataURL"in i)return i.toDataURL();throw new Error("t\
oDataURL is not supported")}else throw new Error("Can not access image data")},Bi=(r,n)=>{let i=typeof document<"u"?document.
createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),f;if(i!=null){let u,p,w;n?.tensorLayout!==
void 0&&n.tensorLayout==="NHWC"?(u=r.dims[2],p=r.dims[1],w=r.dims[3]):(u=r.dims[3],p=r.dims[2],w=r.dims[1]);let d=n!==void 0&&
n.format!==void 0?n.format:"RGB",g=n?.norm,x,v;g===void 0||g.mean===void 0?x=[255,255,255,255]:typeof g.mean=="number"?x=
[g.mean,g.mean,g.mean,g.mean]:(x=[g.mean[0],g.mean[1],g.mean[2],255],g.mean[3]!==void 0&&(x[3]=g.mean[3])),g===void 0||g.
bias===void 0?v=[0,0,0,0]:typeof g.bias=="number"?v=[g.bias,g.bias,g.bias,g.bias]:(v=[g.bias[0],g.bias[1],g.bias[2],0],g.
bias[3]!==void 0&&(v[3]=g.bias[3]));let T=p*u;if(n!==void 0&&(n.format!==void 0&&w===4&&n.format!=="RGBA"||w===3&&n.format!==
"RGB"&&n.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let E=4,A=0,L=1,N=2,H=3,B=0,O=T,
q=T*2,U=-1;d==="RGBA"?(B=0,O=T,q=T*2,U=T*3):d==="RGB"?(B=0,O=T,q=T*2):d==="RBG"&&(B=0,q=T,O=T*2),f=i.createImageData(u,p);
for(let W=0;W<p*u;A+=E,L+=E,N+=E,H+=E,W++)f.data[A]=(r.data[B++]-v[0])*x[0],f.data[L]=(r.data[O++]-v[1])*x[1],f.data[N]=
(r.data[q++]-v[2])*x[2],f.data[H]=U===-1?255:(r.data[U++]-v[3])*x[3]}else throw new Error("Can not access image data");return f}}),
Yt,Li,Ri,Mi,Ui,Pi,Fl=G(()=>{"use strict";pn(),Yt=(r,n)=>{if(r===void 0)throw new Error("Image buffer must be defined");if(n.
height===void 0||n.width===void 0)throw new Error("Image height and width must be defined");if(n.tensorLayout==="NHWC")throw new Error(
"NHWC Tensor layout is not supported yet");let{height:i,width:f}=n,u=n.norm??{mean:255,bias:0},p,w;typeof u.mean=="numbe\
r"?p=[u.mean,u.mean,u.mean,u.mean]:p=[u.mean[0],u.mean[1],u.mean[2],u.mean[3]??255],typeof u.bias=="number"?w=[u.bias,u.
bias,u.bias,u.bias]:w=[u.bias[0],u.bias[1],u.bias[2],u.bias[3]??0];let d=n.format!==void 0?n.format:"RGBA",g=n.tensorFormat!==
void 0&&n.tensorFormat!==void 0?n.tensorFormat:"RGB",x=i*f,v=g==="RGBA"?new Float32Array(x*4):new Float32Array(x*3),T=4,
E=0,A=1,L=2,N=3,H=0,B=x,O=x*2,q=-1;d==="RGB"&&(T=3,E=0,A=1,L=2,N=-1),g==="RGBA"?q=x*3:g==="RBG"?(H=0,O=x,B=x*2):g==="BGR"&&
(O=0,B=x,H=x*2);for(let U=0;U<x;U++,E+=T,L+=T,A+=T,N+=T)v[H++]=(r[E]+w[0])/p[0],v[B++]=(r[A]+w[1])/p[1],v[O++]=(r[L]+w[2])/
p[2],q!==-1&&N!==-1&&(v[q++]=(r[N]+w[3])/p[3]);return g==="RGBA"?new me("float32",v,[1,4,i,f]):new me("float32",v,[1,3,i,
f])},Li=async(r,n)=>{let i=typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement,f=typeof ImageData<"u"&&r instanceof
ImageData,u=typeof ImageBitmap<"u"&&r instanceof ImageBitmap,p=typeof r=="string",w,d=n??{},g=()=>{if(typeof document<"u")
return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("C\
anvas is not supported")},x=v=>typeof HTMLCanvasElement<"u"&&v instanceof HTMLCanvasElement||v instanceof OffscreenCanvas?
v.getContext("2d"):null;if(i){let v=g();v.width=r.width,v.height=r.height;let T=x(v);if(T!=null){let E=r.height,A=r.width;
if(n!==void 0&&n.resizedHeight!==void 0&&n.resizedWidth!==void 0&&(E=n.resizedHeight,A=n.resizedWidth),n!==void 0){if(d=
n,n.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");d.tensorFormat=
"RGBA",d.height=E,d.width=A}else d.tensorFormat="RGBA",d.height=E,d.width=A;T.drawImage(r,0,0),w=T.getImageData(0,0,A,E).
data}else throw new Error("Can not access image data")}else if(f){let v,T;if(n!==void 0&&n.resizedWidth!==void 0&&n.resizedHeight!==
void 0?(v=n.resizedHeight,T=n.resizedWidth):(v=r.height,T=r.width),n!==void 0&&(d=n),d.format="RGBA",d.height=v,d.width=
T,n!==void 0){let E=g();E.width=T,E.height=v;let A=x(E);if(A!=null)A.putImageData(r,0,0),w=A.getImageData(0,0,T,v).data;else
throw new Error("Can not access image data")}else w=r.data}else if(u){if(n===void 0)throw new Error("Please provide imag\
e config with format for Imagebitmap");let v=g();v.width=r.width,v.height=r.height;let T=x(v);if(T!=null){let E=r.height,
A=r.width;return T.drawImage(r,0,0,A,E),w=T.getImageData(0,0,A,E).data,d.height=E,d.width=A,Yt(w,d)}else throw new Error(
"Can not access image data")}else{if(p)return new Promise((v,T)=>{let E=g(),A=x(E);if(!r||!A)return T();let L=new Image;
L.crossOrigin="Anonymous",L.src=r,L.onload=()=>{E.width=L.width,E.height=L.height,A.drawImage(L,0,0,E.width,E.height);let N=A.
getImageData(0,0,E.width,E.height);d.height=E.height,d.width=E.width,v(Yt(N.data,d))}});throw new Error("Input data prov\
ided is not supported - aborted tensor creation")}if(w!==void 0)return Yt(w,d);throw new Error("Input data provided is n\
ot supported - aborted tensor creation")},Ri=(r,n)=>{let{width:i,height:f,download:u,dispose:p}=n,w=[1,f,i,4];return new me(
{location:"texture",type:"float32",texture:r,dims:w,download:u,dispose:p})},Mi=(r,n)=>{let{dataType:i,dims:f,download:u,
dispose:p}=n;return new me({location:"gpu-buffer",type:i??"float32",gpuBuffer:r,dims:f,download:u,dispose:p})},Ui=(r,n)=>{
let{dataType:i,dims:f,download:u,dispose:p}=n;return new me({location:"ml-tensor",type:i??"float32",mlTensor:r,dims:f,download:u,
dispose:p})},Pi=(r,n,i)=>new me({location:"cpu-pinned",type:r,data:n,dims:i??[n.length]})}),rt,Rt,_r,$i,Vl=G(()=>{"use s\
trict";rt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],
["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),
Rt=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],
[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),_r=!1,$i=()=>{if(!_r){_r=!0;let r=typeof BigInt64Array<
"u"&&BigInt64Array.from,n=typeof BigUint64Array<"u"&&BigUint64Array.from,i=globalThis.Float16Array,f=typeof i<"u"&&i.from;
r&&(rt.set("int64",BigInt64Array),Rt.set(BigInt64Array,"int64")),n&&(rt.set("uint64",BigUint64Array),Rt.set(BigUint64Array,
"uint64")),f?(rt.set("float16",i),Rt.set(i,"float16")):rt.set("float16",Uint16Array)}}}),ki,Ni,zl=G(()=>{"use strict";pn(),
ki=r=>{let n=1;for(let i=0;i<r.length;i++){let f=r[i];if(typeof f!="number"||!Number.isSafeInteger(f))throw new TypeError(
`dims[${i}] must be an integer, got: ${f}`);if(f<0)throw new RangeError(`dims[${i}] must be a non-negative integer, got:\
 ${f}`);n*=f}return n},Ni=(r,n)=>{switch(r.location){case"cpu":return new me(r.type,r.data,n);case"cpu-pinned":return new me(
{location:"cpu-pinned",data:r.data,type:r.type,dims:n});case"texture":return new me({location:"texture",texture:r.texture,
type:r.type,dims:n});case"gpu-buffer":return new me({location:"gpu-buffer",gpuBuffer:r.gpuBuffer,type:r.type,dims:n});case"\
ml-tensor":return new me({location:"ml-tensor",mlTensor:r.mlTensor,type:r.type,dims:n});default:throw new Error(`tensorR\
eshape: tensor location ${r.location} is not supported`)}}}),me,pn=G(()=>{"use strict";Wl(),Fl(),Vl(),zl(),me=class{constructor(r,n,i){
$i();let f,u;if(typeof r=="object"&&"location"in r)switch(this.dataLocation=r.location,f=r.type,u=r.dims,r.location){case"\
cpu-pinned":{let w=rt.get(f);if(!w)throw new TypeError(`unsupported type "${f}" to create tensor from pinned buffer`);if(!(r.
data instanceof w))throw new TypeError(`buffer should be of type ${w.name}`);this.cpuData=r.data;break}case"texture":{if(f!==
"float32")throw new TypeError(`unsupported type "${f}" to create tensor from texture`);this.gpuTextureData=r.texture,this.
downloader=r.download,this.disposer=r.dispose;break}case"gpu-buffer":{if(f!=="float32"&&f!=="float16"&&f!=="int32"&&f!==
"int64"&&f!=="uint32"&&f!=="uint8"&&f!=="bool"&&f!=="uint4"&&f!=="int4")throw new TypeError(`unsupported type "${f}" to \
create tensor from gpu buffer`);this.gpuBufferData=r.gpuBuffer,this.downloader=r.download,this.disposer=r.dispose;break}case"\
ml-tensor":{if(f!=="float32"&&f!=="float16"&&f!=="int32"&&f!=="int64"&&f!=="uint32"&&f!=="uint64"&&f!=="int8"&&f!=="uint\
8"&&f!=="bool"&&f!=="uint4"&&f!=="int4")throw new TypeError(`unsupported type "${f}" to create tensor from MLTensor`);this.
mlTensorData=r.mlTensor,this.downloader=r.download,this.disposer=r.dispose;break}default:throw new Error(`Tensor constru\
ctor: unsupported location '${this.dataLocation}'`)}else{let w,d;if(typeof r=="string")if(f=r,d=i,r==="string"){if(!Array.
isArray(n))throw new TypeError("A string tensor's data must be a string array.");w=n}else{let g=rt.get(r);if(g===void 0)
throw new TypeError(`Unsupported tensor type: ${r}.`);if(Array.isArray(n)){if(r==="float16"&&g===Uint16Array||r==="uint4"||
r==="int4")throw new TypeError(`Creating a ${r} tensor from number array is not supported. Please use ${g.name} as data.`);
r==="uint64"||r==="int64"?w=g.from(n,BigInt):w=g.from(n)}else if(n instanceof g)w=n;else if(n instanceof Uint8ClampedArray)
if(r==="uint8")w=Uint8Array.from(n);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(r===
"float16"&&n instanceof Uint16Array&&g!==Uint16Array)w=new globalThis.Float16Array(n.buffer,n.byteOffset,n.length);else throw new TypeError(
`A ${f} tensor's data must be type of ${g}`)}else if(d=n,Array.isArray(r)){if(r.length===0)throw new TypeError("Tensor t\
ype cannot be inferred from an empty array.");let g=typeof r[0];if(g==="string")f="string",w=r;else if(g==="boolean")f="\
bool",w=Uint8Array.from(r);else throw new TypeError(`Invalid element type of data array: ${g}.`)}else if(r instanceof Uint8ClampedArray)
f="uint8",w=Uint8Array.from(r);else{let g=Rt.get(r.constructor);if(g===void 0)throw new TypeError(`Unsupported type for \
tensor data: ${r.constructor}.`);f=g,w=r}if(d===void 0)d=[w.length];else if(!Array.isArray(d))throw new TypeError("A ten\
sor's dims must be a number array");u=d,this.cpuData=w,this.dataLocation="cpu"}let p=ki(u);if(this.cpuData&&p!==this.cpuData.
length&&!((f==="uint4"||f==="int4")&&Math.ceil(p/2)===this.cpuData.length))throw new Error(`Tensor's size(${p}) does not\
 match data length(${this.cpuData.length}).`);this.type=f,this.dims=u,this.size=p}static async fromImage(r,n){return Li(
r,n)}static fromTexture(r,n){return Ri(r,n)}static fromGpuBuffer(r,n){return Mi(r,n)}static fromMLTensor(r,n){return Ui(
r,n)}static fromPinnedBuffer(r,n,i){return Pi(r,n,i)}toDataURL(r){return Ii(this,r)}toImageData(r){return Bi(this,r)}get data(){
if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU\
, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.
dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL\
 texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The da\
ta is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)
throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(r){switch(this.ensureValid(),
this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.
downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)
throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let n=await this.downloader();return this.
downloader=void 0,this.dataLocation="cpu",this.cpuData=n,r&&this.disposer&&(this.disposer(),this.disposer=void 0),n}finally{
this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.
isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),
this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,
this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tens\
or is disposed.")}reshape(r){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tens\
or that owns GPU resource.");return Ni(this,r)}}}),Le,_i=G(()=>{"use strict";pn(),Le=me}),Di,jl=G(()=>{"use strict";ln(),
Si(),_i(),cn(),Di=class Gi{constructor(n,i){this.handler=n,this.backend=i}async run(n,i,f){Fe(),at("InferenceSession.run");
let u={},p={};if(typeof n!="object"||n===null||n instanceof Le||Array.isArray(n))throw new TypeError("'feeds' must be an\
 object that use input names as keys and OnnxValue as corresponding values.");let w=!0;if(typeof i=="object"){if(i===null)
throw new TypeError("Unexpected argument[1]: cannot be null.");if(i instanceof Le)throw new TypeError("'fetches' cannot \
be a Tensor");if(Array.isArray(i)){if(i.length===0)throw new TypeError("'fetches' cannot be an empty array.");w=!1;for(let v of i){
if(typeof v!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(
v)===-1)throw new RangeError(`'fetches' contains invalid output name: ${v}.`);u[v]=null}if(typeof f=="object"&&f!==null)
p=f;else if(typeof f<"u")throw new TypeError("'options' must be an object.")}else{let v=!1,T=Object.getOwnPropertyNames(
i);for(let E of this.outputNames)if(T.indexOf(E)!==-1){let A=i[E];(A===null||A instanceof Le)&&(v=!0,w=!1,u[E]=A)}if(v){
if(typeof f=="object"&&f!==null)p=f;else if(typeof f<"u")throw new TypeError("'options' must be an object.")}else p=i}}else if(typeof i<
"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let v of this.inputNames)if(typeof n[v]>
"u")throw new Error(`input '${v}' is missing in 'feeds'.`);if(w)for(let v of this.outputNames)u[v]=null;let d;if(p.activeLoraAdapters!==
void 0){if(!Array.isArray(p.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");d=p.activeLoraAdapters.
map(v=>{if(!(v instanceof dn))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(v.
backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return v.handler})}
let g=await this.handler.run(n,u,p,d),x={};for(let v in g)if(Object.hasOwnProperty.call(g,v)){let T=g[v];T instanceof Le?
x[v]=T:x[v]=new Le(T.type,T.data,T.dims)}return ot("InferenceSession.run"),Ve(),x}async release(){return this.handler.dispose()}static async create(n,i,f,u){
Fe(),at("InferenceSession.create");let p,w={};if(typeof n=="string"){if(p=n,typeof i=="object"&&i!==null)w=i;else if(typeof i<
"u")throw new TypeError("'options' must be an object.")}else if(n instanceof Uint8Array){if(p=n,typeof i=="object"&&i!==
null)w=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else if(n instanceof ArrayBuffer||typeof SharedArrayBuffer<
"u"&&n instanceof SharedArrayBuffer){let v=n,T=0,E=n.byteLength;if(typeof i=="object"&&i!==null)w=i;else if(typeof i=="n\
umber"){if(T=i,!Number.isSafeInteger(T))throw new RangeError("'byteOffset' must be an integer.");if(T<0||T>=v.byteLength)
throw new RangeError(`'byteOffset' is out of range [0, ${v.byteLength}).`);if(E=n.byteLength-T,typeof f=="number"){if(E=
f,!Number.isSafeInteger(E))throw new RangeError("'byteLength' must be an integer.");if(E<=0||T+E>v.byteLength)throw new RangeError(
`'byteLength' is out of range (0, ${v.byteLength-T}].`);if(typeof u=="object"&&u!==null)w=u;else if(typeof u<"u")throw new TypeError(
"'options' must be an object.")}else if(typeof f<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof i<
"u")throw new TypeError("'options' must be an object.");p=new Uint8Array(v,T,E)}else throw new TypeError("Unexpected arg\
ument[0]: must be 'path' or 'buffer'.");let[d,g]=await xi(w),x=await d.createInferenceSessionHandler(p,g);return ot("Inf\
erenceSession.create"),Ve(),new Gi(x,d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){
return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.
inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Wi,Hl=G(()=>{"use strict";jl(),Wi=Di}),Fi,ql=G(
()=>{"use strict";Si(),Fi=dn}),Yl=G(()=>{"use strict"}),Zl=G(()=>{"use strict"}),Xl=G(()=>{"use strict"}),Ql=G(()=>{"use\
 strict"}),Vi={};Ut(Vi,{InferenceSession:()=>Wi,LoraAdapter:()=>Fi,TRACE:()=>nn,TRACE_EVENT_BEGIN:()=>at,TRACE_EVENT_END:()=>ot,
TRACE_FUNC_BEGIN:()=>Fe,TRACE_FUNC_END:()=>Ve,Tensor:()=>Le,env:()=>ee,registerBackend:()=>bt});var ze=G(()=>{"use stric\
t";_l(),Gl(),Hl(),ql(),_i(),Yl(),Zl(),cn(),Xl(),Ql()}),hn=G(()=>{"use strict"}),zi={};Ut(zi,{default:()=>ji});var Dr,Gr,
ji,Jl=G(()=>{"use strict";ss(),it(),mn(),Dr="ort-wasm-proxy-worker",Gr=globalThis.self?.name===Dr,Gr&&(self.onmessage=r=>{
let{type:n,in:i}=r.data;try{switch(n){case"init-wasm":gn(i.wasm).then(()=>{Tn(i).then(()=>{postMessage({type:n})},f=>{postMessage(
{type:n,err:f})})},f=>{postMessage({type:n,err:f})});break;case"init-ep":{let{epName:f,env:u}=i;xn(u,f).then(()=>{postMessage(
{type:n})},p=>{postMessage({type:n,err:p})});break}case"copy-from":{let{buffer:f}=i,u=nr(f);postMessage({type:n,out:u});
break}case"create":{let{model:f,options:u}=i;En(f,u).then(p=>{postMessage({type:n,out:p})},p=>{postMessage({type:n,err:p})});
break}case"release":An(i),postMessage({type:n});break;case"run":{let{sessionId:f,inputIndices:u,inputs:p,outputIndices:w,
options:d}=i;Cn(f,u,p,w,new Array(w.length).fill(null),d).then(g=>{g.some(x=>x[3]!=="cpu")?postMessage({type:n,err:"Prox\
y does not support non-cpu tensor location."}):postMessage({type:n,out:g},On([...p,...g]))},g=>{postMessage({type:n,err:g})});
break}case"end-profiling":Sn(i),postMessage({type:n});break;default:}}catch(f){postMessage({type:n,err:f})}}),ji=Gr?null:
r=>new Worker(r??pe,{type:"module",name:Dr})}),Hi={};Ut(Hi,{default:()=>qi});async function Ho(r={}){var n=r,i=!!globalThis.
window,f=!!globalThis.WorkerGlobalScope,u=f&&self.name?.startsWith("em-pthread");n.mountExternalData=(e,t)=>{e.startsWith(
"./")&&(e=e.substring(2)),(n.md||(n.md=new Map)).set(e,t)},n.unmountExternalData=()=>{delete n.md,delete n.af,delete n.$e,
delete n.bf},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let p=()=>{
let e=t=>(...a)=>{let o=Se;return a=t(...a),Se!=o?new Promise((s,l)=>{mr={resolve:s,reject:l}}):a};(t=>{for(let a of t)n[a]=
e(n[a])})("_OrtAppendExecutionProvider _OrtAppendExecutionProviderV2 _OrtCreateSession _OrtRun _OrtRunWithBinding _OrtBi\
ndInput".split(" ")),typeof jsepRunAsync<"u"&&(n._OrtRun=jsepRunAsync(n._OrtRun),n._OrtRunWithBinding=jsepRunAsync(n._OrtRunWithBinding)),
p=void 0};n.asyncInit=()=>{p?.()};var w,d,g=(e,t)=>{throw t},x=import.meta.url,v="";if(i||f){try{v=new URL(".",x).href}catch{}
f&&(d=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.
response)}),w=async e=>{if(X(e))return new Promise((a,o)=>{var s=new XMLHttpRequest;s.open("GET",e,!0),s.responseType="a\
rraybuffer",s.onload=()=>{s.status==200||s.status==0&&s.response?a(s.response):o(s.status)},s.onerror=o,s.send(null)});var t=await fetch(
e,{credentials:"same-origin"});if(t.ok)return t.arrayBuffer();throw Error(t.status+" : "+t.url)}}var T,E,A,L,N,H,B=console.
log.bind(console),O=console.error.bind(console),q=B,U=O,W=!1,X=e=>e.startsWith("file://");function c(){De.buffer!=Q.buffer&&
fe()}if(u){let e=function(t){try{var a=t.data,o=a.gd;if(o==="load"){let s=[];self.onmessage=l=>s.push(l),H=()=>{postMessage(
{gd:"loaded"});for(let l of s)e(l);self.onmessage=e};for(let l of a.Ce)n[l]&&!n[l].proxy||(n[l]=(...m)=>{postMessage({gd:"\
callHandler",Be:l,args:m})},l=="print"&&(q=n[l]),l=="printErr"&&(U=n[l]));De=a.Ue,fe(),E=a.Ve,He(),qt()}else if(o==="run"){
(function(s){var l=(c(),b)[s+52>>>2>>>0];s=(c(),b)[s+56>>>2>>>0],Ja(l,l-s),P(l)})(a.cd),Or(a.cd,0,0,1,0,0),Mn(),dr(a.cd),
J||(Ua(),J=!0);try{xs(a.He,a.rd)}catch(s){if(s!="unwind")throw s}}else a.target!=="setimmediate"&&(o==="checkMailbox"?J&&
Nt():o&&(U(`worker: received unknown command ${o}`),U(a)))}catch(s){throw qa(),s}};var J=!1;self.onunhandledrejection=t=>{
throw t.reason||t},self.onmessage=e}var Q,te,Re,Ae,I,b,ae,be,M,ue,je,Z=!1;function fe(){var e=De.buffer;n.HEAP8=Q=new Int8Array(
e),Re=new Int16Array(e),n.HEAPU8=te=new Uint8Array(e),Ae=new Uint16Array(e),n.HEAP32=I=new Int32Array(e),n.HEAPU32=b=new Uint32Array(
e),ae=new Float32Array(e),be=new Float64Array(e),M=new BigInt64Array(e),ue=new BigUint64Array(e)}function re(){Z=!0,u?H():
ke.ic()}function K(e){throw U(e="Aborted("+e+")"),W=!0,e=new WebAssembly.RuntimeError(e+". Build with -sASSERTIONS for m\
ore info."),N?.(e),e}function st(){return{a:{qa:jf,f:Es,E:As,j:Cs,p:Ss,l:Os,fa:Is,b:Bs,da:Ls,hc:_n,r:Rs,ea:Fn,Wa:Vn,dc:zn,
fc:jn,Xa:Hn,Ua:qn,Na:Yn,Ta:Zn,oa:Xn,ec:Qn,bc:Jn,Va:Kn,cc:ea,ab:Ms,Da:Us,Yb:Ps,Wb:ks,Ca:_s,O:Ds,K:Gs,Xb:Ws,ka:Ys,Zb:Zs,Qa:Xs,
$b:Js,Ga:Ks,Ub:eu,Ea:tu,Pa:dr,Za:ru,V:iu,n:cu,c:lr,sb:du,w:pu,N:hu,B:mu,k:gu,o:ua,tb:wu,J:yu,T:bu,g:vu,u:Tu,m:xu,i:Eu,Ka:Au,
La:Cu,Ma:Su,Ia:da,Ja:pa,Vb:ha,cb:Iu,$a:Lu,U:Ru,rb:Mu,Fa:Uu,_a:Bu,Z:Pu,Ya:$u,ac:ku,I:Ou,fb:Nu,$:_u,pa:Ft,_b:Gu,eb:Du,db:Wu,
nb:ef,A:tf,sa:rf,ra:nf,pb:af,_:of,v:sf,mb:uf,lb:ff,kb:lf,ob:cf,ib:df,hb:pf,gb:hf,Ra:Ca,Sa,gc:or,Y:Oa,Ha:Ia,ma:Ba,Oa:La,la:Ra,
Hb:Ll,va:Al,Ib:Bl,wa:El,H:ll,e:Zf,s:qf,x:Hf,D:il,Kb:vl,W:bl,z:Kf,xa:Tl,ba:Cl,ha:yl,Lb:wl,Ba:Qf,za:dl,Nb:hl,ya:gl,Ob:pl,ua:Il,
ca:xl,d:Yf,C:Jf,q:Xf,Gb:Rl,t:tl,y:ul,F:el,G:rl,L:fl,Pb:cl,R:Sl,ia:ol,aa:Ol,Rb:al,Aa:nl,Mb:ml,Qb:sl,h:gf,a:De,bb:qe,Jb:wf,
X:yf,M:bf,na:vf,Fb:Tf,ja:xf,S:Ef,Cb:Af,Db:Cf,xb:Sf,yb:Of,P:If,zb:Bf,Ab:Lf,ta:Rf,Tb:Mf,qb:Uf,Q:Pf,jb:$f,Eb:kf,ub:Nf,vb:Df,
wb:Gf,ga:Wf,Bb:Ff,Sb:Vf}}}async function He(){function e(o,s){var l=ke=o.exports;o={};for(let[m,h]of Object.entries(l))typeof h==
"function"?(l=nu(h),o[m]=l):o[m]=h;return ke=o,ke=(function(){var m=ke,h=C=>S=>C(S)>>>0,y=C=>()=>C()>>>0;return(m=Object.
assign({},m)).jc=h(m.jc),m.Uc=y(m.Uc),m.Wc=h(m.Wc),m.Id=(C=>(S,k)=>C(S,k)>>>0)(m.Id),m.Nd=h(m.Nd),m.Od=y(m.Od),m.Sd=h(m.
Sd),m})(),Ln.push(ke.zd),Ma=(o=ke).jc,Ua=o.kc,n._OrtInit=o.lc,n._OrtGetLastError=o.mc,n._OrtCreateSessionOptions=o.nc,n.
_OrtAppendExecutionProvider=o.oc,n._OrtGetEpDevices=o.pc,n._OrtEpDevice_EpName=o.qc,n._OrtAppendExecutionProviderV2=o.rc,
n._OrtAddFreeDimensionOverride=o.sc,n._OrtAddSessionConfigEntry=o.tc,n._OrtReleaseSessionOptions=o.uc,n._OrtCreateSession=
o.vc,n._OrtReleaseSession=o.wc,n._OrtGetInputOutputCount=o.xc,n._OrtGetInputOutputMetadata=o.yc,n._OrtFree=o.zc,n._OrtCreateTensor=
o.Ac,n._OrtGetTensorData=o.Bc,n._OrtReleaseTensor=o.Cc,n._OrtCreateLoraAdapter=o.Dc,n._OrtReleaseLoraAdapter=o.Ec,n._OrtCreateRunOptions=
o.Fc,n._OrtAddRunConfigEntry=o.Gc,n._OrtRunOptionsAddActiveLoraAdapter=o.Hc,n._OrtReleaseRunOptions=o.Ic,n._OrtCreateBinding=
o.Jc,n._OrtBindInput=o.Kc,n._OrtBindOutput=o.Lc,n._OrtClearBoundOutputs=o.Mc,n._OrtReleaseBinding=o.Nc,n._OrtRunWithBinding=
o.Oc,n._OrtRun=o.Pc,n._OrtEndProfiling=o.Qc,Pa=n._OrtCreateWebGpuInstance=o.Rc,n._wgpuCreateInstance=o.Sc,Tr=n._OrtGetWebGpuDevice=
o.Tc,jt=o.Uc,we=n._free=o.Vc,Qe=n._malloc=o.Wc,$a=n._wgpuBufferRelease=o.Xc,ka=o.Yc,Na=o.Zc,_a=o._c,Da=o.$c,Ga=o.ad,Wa=o.
dd,Fa=o.ed,Va=o.od,za=o.pd,ja=o.qd,xr=o.sd,Er=o.td,Ar=o.ud,Cr=o.vd,Et=o.wd,Sr=o.xd,Ha=o.yd,Or=o.Bd,qa=o.Cd,Ya=o.Dd,Za=o.
Ed,Ir=o.Fd,Xa=o.Gd,Qa=o.Hd,Br=o.Id,D=o.Jd,At=o.Kd,Ja=o.Ld,P=o.Md,Ht=o.Nd,$=o.Od,Ka=o.Pd,Lr=o.Qd,eo=o.Rd,to=o.Sd,ro=o.Td,
Rr=o.Ud,no=o.Vd,ao=o.Wd,oo=o.Xd,io=o.Yd,so=o.Zd,uo=o._d,fo=o.$d,lo=o.ae,co=o.be,po=o.ce,ho=o.de,mo=o.ee,go=o.fe,wo=o.ge,
yo=o.he,bo=o.ie,vo=o.je,To=o.ke,xo=o.le,Eo=o.me,Ao=o.oe,Co=o.pe,So=o.qe,Oo=o.re,Io=o.se,Bo=o.te,Lo=o.ue,Ro=o.Ie,Mo=o.Je,
Uo=o.Ke,Po=o.Le,$o=o.Me,ko=o.Ne,No=o.Oe,_o=o.Pe,Do=o.Qe,Go=o.Re,Wo=o.Te,Fo=o.vf,Vo=o.wf,zo=o.xf,jo=o.yf,E=s,ke}var t,a=st();
return n.instantiateWasm?new Promise(o=>{n.instantiateWasm(a,(s,l)=>{o(e(s,l))})}):u?e(new WebAssembly.Instance(E,st()),
E):(je??=n.locateFile?n.locateFile?n.locateFile("ort-wasm-simd-threaded.asyncify.wasm",v):v+"ort-wasm-simd-threaded.asyn\
cify.wasm":new URL(""+new URL("ort-wasm-simd-threaded.asyncify-AkdHdxrx.wasm",import.meta.url).href,import.meta.url).href,
t=await(async function(o){var s=je;if(!T&&!X(s))try{var l=fetch(s,{credentials:"same-origin"});return await WebAssembly.
instantiateStreaming(l,o)}catch(m){U(`wasm streaming compile failed: ${m}`),U("falling back to ArrayBuffer instantiation")}
return(async function(m,h){try{var y=await(async function(C){if(!T)try{var S=await w(C);return new Uint8Array(S)}catch{}
if(C==je&&T)C=new Uint8Array(T);else{if(!d)throw"both async and sync fetching of the wasm failed";C=d(C)}return C})(m);return await WebAssembly.
instantiate(y,h)}catch(C){U(`failed to asynchronously prepare wasm: ${C}`),K(C)}})(s,o)})(a),e(t.instance,t.module))}class ut{name="\
ExitStatus";constructor(t){this.message=`Program terminated with exit(${t})`,this.status=t}}var Pt=e=>{e.terminate(),e.onmessage=
()=>{}},ve=[],de=0,Te=null,ne=e=>{_e.length==0&&(Pn(),Un(_e[0]));var t=_e.pop();if(!t)return 6;Tt.push(t),Ye[e.cd]=t,t.cd=
e.cd;var a={gd:"run",He:e.Ge,rd:e.rd,cd:e.cd};return t.postMessage(a,e.we),0},_=0,V=(e,t,...a)=>{var o,s=16*a.length,l=$(),
m=Ht(s),h=m>>>3;for(o of a)typeof o=="bigint"?((c(),M)[h++>>>0]=1n,(c(),M)[h++>>>0]=o):((c(),M)[h++>>>0]=0n,(c(),be)[h++>>>
0]=o);return e=Ya(e,0,s,m,t),P(l),e};function qe(e){if(u)return V(0,1,e);if(A=e,!(0<_)){for(var t of Tt)Pt(t);for(t of _e)
Pt(t);_e=[],Tt=[],Ye={},W=!0}g(0,new ut(e))}function ft(e){if(u)return V(1,0,e);or(e)}var or=e=>{if(A=e,u)throw ft(e),"u\
nwind";qe(e)},_e=[],Tt=[],Ln=[],Ye={},Rn=e=>{var t=e.cd;delete Ye[t],_e.push(e),Tt.splice(Tt.indexOf(e),1),e.cd=0,Za(t)};
function Mn(){Ln.forEach(e=>e())}var Un=e=>new Promise(t=>{e.onmessage=s=>{var l=s.data;if(s=l.gd,l.nd&&l.nd!=jt()){var m=Ye[l.
nd];m?m.postMessage(l,l.we):U(`Internal error! Worker sent a message "${s}" to target pthread ${l.nd}, but that thread n\
o longer exists!`)}else s==="checkMailbox"?Nt():s==="spawnThread"?ne(l):s==="cleanupThread"?le(()=>{Rn(Ye[l.Se])}):s==="\
loaded"?(e.loaded=!0,t(e)):l.target==="setimmediate"?e.postMessage(l):s==="uncaughtException"?e.onerror(l.error):s==="ca\
llHandler"?n[l.Be](...l.args):s&&U(`worker sent an unknown command ${s}`)},e.onerror=s=>{throw U(`worker sent an error! ${s.
filename}:${s.lineno}: ${s.message}`),s};var a,o=[];for(a of[])n.propertyIsEnumerable(a)&&o.push(a);e.postMessage({gd:"l\
oad",Ce:o,Ue:De,Ve:E})});function Pn(){var e=new Worker((()=>{let t=URL;return import.meta.url>"file:"&&import.meta.url<
"file;"?new t("ort.webgpu.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pt\
hread",name:"em-pthread"});_e.push(e)}var De,xs=(e,t)=>{_=0,e=Rr(e,t),0<_?A=e:Ir(e)},$t=[],kt=0,ie=e=>-9007199254740992>
e||9007199254740992<e?NaN:Number(e);function Es(e){var t=new ir(e>>>=0);return(c(),Q)[t.hd+12>>>0]==0&&($n(t,!0),kt--),kn(
t,!1),$t.push(t),to(e)}var lt=0,As=()=>{D(0,0);var e=$t.pop();Ka(e.Ad),lt=0};function $n(e,t){t=t?1:0,(c(),Q)[e.hd+12>>>
0]=t}function kn(e,t){t=t?1:0,(c(),Q)[e.hd+13>>>0]=t}class ir{constructor(t){this.Ad=t,this.hd=t-24}}var sr=e=>{var t=lt;
if(!t)return At(0),0;var a=new ir(t);(c(),b)[a.hd+16>>>2>>>0]=t;var o=(c(),b)[a.hd+4>>>2>>>0];if(!o)return At(0),t;for(var s of e){
if(s===0||s===o)break;if(eo(s,o,a.hd+16))return At(s),t}return At(o),t};function Cs(){return sr([])}function Ss(e){return sr(
[e>>>0])}function Os(e,t,a,o){return sr([e>>>0,t>>>0,a>>>0,o>>>0])}var Is=()=>{var e=$t.pop();e||K("no exception to thro\
w");var t=e.Ad;throw(c(),Q)[e.hd+13>>>0]==0&&($t.push(e),kn(e,!0),$n(e,!1),kt++),Lr(t),lt=t};function Bs(e,t,a){var o=new ir(
e>>>=0);throw t>>>=0,a>>>=0,(c(),b)[o.hd+16>>>2>>>0]=0,(c(),b)[o.hd+4>>>2>>>0]=t,(c(),b)[o.hd+8>>>2>>>0]=a,Lr(e),kt++,lt=
e}var Ls=()=>kt;function Nn(e,t,a,o){return u?V(2,1,e,t,a,o):_n(e,t,a,o)}function _n(e,t,a,o){if(e>>>=0,t>>>=0,a>>>=0,o>>>=
0,!globalThis.SharedArrayBuffer)return 6;var s=[];return u&&s.length===0?Nn(e,t,a,o):(e={Ge:a,cd:e,rd:o,we:s},u?(e.gd="s\
pawnThread",postMessage(e,s),0):ne(e))}function Rs(e){throw lt||=e>>>0,lt}var Dn=globalThis.TextDecoder&&new TextDecoder,
Gn=(e,t,a,o)=>{if(a=t+a,o)return a;for(;e[t]&&!(t>=a);)++t;return t},Wn=(e,t=0,a,o)=>{if(16<(a=Gn(e,t>>>=0,a,o))-t&&e.buffer&&
Dn)return Dn.decode(e.buffer instanceof ArrayBuffer?e.subarray(t,a):e.slice(t,a));for(o="";t<a;){var s=e[t++];if(128&s){
var l=63&e[t++];if((224&s)==192)o+=String.fromCharCode((31&s)<<6|l);else{var m=63&e[t++];65536>(s=(240&s)==224?(15&s)<<12|
l<<6|m:(7&s)<<18|l<<12|m<<6|63&e[t++])?o+=String.fromCharCode(s):(s-=65536,o+=String.fromCharCode(55296|s>>10,56320|1023&
s))}}else o+=String.fromCharCode(s)}return o},ct=(e,t,a)=>(e>>>=0)?Wn((c(),te),e,t,a):"";function Fn(e,t,a){return u?V(3,
1,e,t,a):0}function Vn(e,t){if(u)return V(4,1,e,t)}function zn(e,t){if(u)return V(5,1,e,t)}function jn(e,t,a){if(u)return V(
6,1,e,t,a)}function Hn(e,t,a){return u?V(7,1,e,t,a):0}function qn(e,t){if(u)return V(8,1,e,t)}function Yn(e,t,a){if(u)return V(
9,1,e,t,a)}function Zn(e,t,a,o){if(u)return V(10,1,e,t,a,o)}function Xn(e,t,a,o){if(u)return V(11,1,e,t,a,o)}function Qn(e,t,a,o){
if(u)return V(12,1,e,t,a,o)}function Jn(e){if(u)return V(13,1,e)}function Kn(e,t){if(u)return V(14,1,e,t)}function ea(e,t,a){
if(u)return V(15,1,e,t,a)}var Ms=()=>K(""),Ce=e=>{e>>>=0;for(var t="";;){var a=(c(),te)[e++>>>0];if(!a)return t;t+=String.
fromCharCode(a)}},ur={},fr={},dt=class extends Error{constructor(e){super(e),this.name="BindingError"}};function Me(e,t,a={}){
return(function(o,s,l={}){var m=s.name;if(!o)throw new dt(`type "${m}" must have a positive integer typeid pointer`);if(fr.
hasOwnProperty(o)){if(l.De)return;throw new dt(`Cannot register type '${m}' twice`)}fr[o]=s,ur.hasOwnProperty(o)&&(s=ur[o],
delete ur[o],s.forEach(h=>h()))})(e,t,a)}var ta=(e,t,a)=>{switch(t){case 1:return a?o=>(c(),Q)[o>>>0]:o=>(c(),te)[o>>>0];case 2:
return a?o=>(c(),Re)[o>>>1>>>0]:o=>(c(),Ae)[o>>>1>>>0];case 4:return a?o=>(c(),I)[o>>>2>>>0]:o=>(c(),b)[o>>>2>>>0];case 8:
return a?o=>(c(),M)[o>>>3>>>0]:o=>(c(),ue)[o>>>3>>>0];default:throw new TypeError(`invalid integer width (${t}): ${e}`)}};
function Us(e,t,a,o,s){e>>>=0,a>>>=0,t=Ce(t>>>0);let l=m=>m;if(o=o===0n){let m=8*a;l=h=>BigInt.asUintN(m,h),s=l(s)}Me(e,
{name:t,bd:l,kd:(m,h)=>(typeof h=="number"&&(h=BigInt(h)),h),jd:ta(t,a,!o),ld:null})}function Ps(e,t,a,o){Me(e>>>=0,{name:t=
Ce(t>>>0),bd:function(s){return!!s},kd:function(s,l){return l?a:o},jd:function(s){return this.bd((c(),te)[s>>>0])},ld:null})}
var ra=[],Ze=[0,1,,1,null,1,!0,1,!1,1];function lr(e){9<(e>>>=0)&&--Ze[e+1]===0&&(Ze[e]=void 0,ra.push(e))}var ge=e=>{if(!e)
throw new dt(`Cannot use deleted val. handle = ${e}`);return Ze[e]},xe=e=>{switch(e){case void 0:return 2;case null:return 4;case!0:
return 6;case!1:return 8;default:let t=ra.pop()||Ze.length;return Ze[t]=e,Ze[t+1]=1,t}};function cr(e){return this.bd((c(),
b)[e>>>2>>>0])}var $s={name:"emscripten::val",bd:e=>{var t=ge(e);return lr(e),t},kd:(e,t)=>xe(t),jd:cr,ld:null};function ks(e){
return Me(e>>>0,$s)}var Ns=(e,t)=>{switch(t){case 4:return function(a){return this.bd((c(),ae)[a>>>2>>>0])};case 8:return function(a){
return this.bd((c(),be)[a>>>3>>>0])};default:throw new TypeError(`invalid float width (${t}): ${e}`)}};function _s(e,t,a){
a>>>=0,Me(e>>>=0,{name:t=Ce(t>>>0),bd:o=>o,kd:(o,s)=>s,jd:Ns(t,a),ld:null})}function Ds(e,t,a,o,s){e>>>=0,a>>>=0,t=Ce(t>>>
0);let l=h=>h;if(o===0){var m=32-8*a;l=h=>h<<m>>>m,s=l(s)}Me(e,{name:t,bd:l,kd:(h,y)=>y,jd:ta(t,a,o!==0),ld:null})}function Gs(e,t,a){
function o(l){var m=(c(),b)[l>>>2>>>0];return l=(c(),b)[l+4>>>2>>>0],new s((c(),Q).buffer,l,m)}var s=[Int8Array,Uint8Array,
Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][t];Me(e>>>=0,{name:a=
Ce(a>>>0),bd:o,jd:o},{De:!0})}var Ue=(e,t,a)=>{var o=(c(),te);if(t>>>=0,0<a){var s=t;a=t+a-1;for(var l=0;l<e.length;++l){
var m=e.codePointAt(l);if(127>=m){if(t>=a)break;o[t++>>>0]=m}else if(2047>=m){if(t+1>=a)break;o[t++>>>0]=192|m>>6,o[t++>>>
0]=128|63&m}else if(65535>=m){if(t+2>=a)break;o[t++>>>0]=224|m>>12,o[t++>>>0]=128|m>>6&63,o[t++>>>0]=128|63&m}else{if(t+
3>=a)break;o[t++>>>0]=240|m>>18,o[t++>>>0]=128|m>>12&63,o[t++>>>0]=128|m>>6&63,o[t++>>>0]=128|63&m,l++}}o[t>>>0]=0,e=t-s}else
e=0;return e},Pe=e=>{for(var t=0,a=0;a<e.length;++a){var o=e.charCodeAt(a);127>=o?t++:2047>=o?t+=2:55296<=o&&57343>=o?(t+=
4,++a):t+=3}return t};function Ws(e,t){Me(e>>>=0,{name:t=Ce(t>>>0),bd(a){var o=(c(),b)[a>>>2>>>0];return o=ct(a+4,o,!0),
we(a),o},kd(a,o){o instanceof ArrayBuffer&&(o=new Uint8Array(o));var s=typeof o=="string";if(!(s||ArrayBuffer.isView(o)&&
o.BYTES_PER_ELEMENT==1))throw new dt("Cannot pass non-string to std::string");var l=s?Pe(o):o.length,m=Qe(4+l+1),h=m+4;return(c(),
b)[m>>>2>>>0]=l,s?Ue(o,h,l+1):(c(),te).set(o,h>>>0),a!==null&&a.push(we,m),m},jd:cr,ld(a){we(a)}})}var na=globalThis.TextDecoder?
new TextDecoder("utf-16le"):void 0,Fs=(e,t,a)=>{if(e>>>=1,16<(t=Gn((c(),Ae),e,t/2,a))-e&&na)return na.decode((c(),Ae).slice(
e,t));for(a="";e<t;++e){var o=(c(),Ae)[e>>>0];a+=String.fromCharCode(o)}return a},Vs=(e,t,a)=>{if(a??=2147483647,2>a)return 0;
var o=t;a=(a-=2)<2*e.length?a/2:e.length;for(var s=0;s<a;++s){var l=e.charCodeAt(s);(c(),Re)[t>>>1>>>0]=l,t+=2}return(c(),
Re)[t>>>1>>>0]=0,t-o},zs=e=>2*e.length,js=(e,t,a)=>{var o="";e>>>=2;for(var s=0;!(s>=t/4);s++){var l=(c(),b)[e+s>>>0];if(!l&&
!a)break;o+=String.fromCodePoint(l)}return o},Hs=(e,t,a)=>{if(t>>>=0,a??=2147483647,4>a)return 0;var o=t;a=o+a-4;for(var s=0;s<
e.length;++s){var l=e.codePointAt(s);if(65535<l&&s++,(c(),I)[t>>>2>>>0]=l,(t+=4)+4>a)break}return(c(),I)[t>>>2>>>0]=0,t-
o},qs=e=>{for(var t=0,a=0;a<e.length;++a)65535<e.codePointAt(a)&&a++,t+=4;return t};function Ys(e,t,a){if(e>>>=0,t>>>=0,
a=Ce(a>>>=0),t===2)var o=Fs,s=Vs,l=zs;else o=js,s=Hs,l=qs;Me(e,{name:a,bd:m=>{var h=(c(),b)[m>>>2>>>0];return h=o(m+4,h*
t,!0),we(m),h},kd:(m,h)=>{if(typeof h!="string")throw new dt(`Cannot pass non-string to C++ string type ${a}`);var y=l(h),
C=Qe(4+y+t);return(c(),b)[C>>>2>>>0]=y/t,s(h,C+4,y+t),m!==null&&m.push(we,C),C},jd:cr,ld(m){we(m)}})}function Zs(e,t){Me(
e>>>=0,{Ee:!0,name:t=Ce(t>>>0),bd:()=>{},kd:()=>{}})}function Xs(e){Or(e>>>0,!f,1,!i,131072,!1),Mn()}var le=e=>{if(!W)try{
if(e(),!(0<_))try{u?jt()&&Ir(A):or(A)}catch(t){t instanceof ut||t=="unwind"||g(0,t)}}catch(t){t instanceof ut||t=="unwin\
d"||g(0,t)}},Qs=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||
[])[2]);function dr(e){e>>>=0,Qs||(Atomics.waitAsync((c(),I),e>>>2,e).value.then(Nt),e+=128,Atomics.store((c(),I),e>>>2,
1))}var Nt=()=>le(()=>{var e=jt();e&&(dr(e),Qa())});function Js(e,t){(e>>>=0)==t>>>0?setTimeout(Nt):u?postMessage({nd:e,
gd:"checkMailbox"}):(e=Ye[e])&&e.postMessage({gd:"checkMailbox"})}var pr=[];function Ks(e,t,a,o,s){for(t>>>=0,s>>>=0,pr.
length=0,a=s>>>3,o=s+o>>>3;a<o;){var l;l=(c(),M)[a++>>>0]?(c(),M)[a++>>>0]:(c(),be)[a++>>>0],pr.push(l)}return(t?Mr[t]:zf[e])(
...pr)}var eu=()=>{_=0};function tu(e){e>>>=0,u?postMessage({gd:"cleanupThread",Se:e}):Rn(Ye[e])}function ru(e){}var _t=e=>{
try{e()}catch(t){K(t)}};function nu(e){var t=(...a)=>{Dt.push(e);try{return e(...a)}finally{W||(Dt.pop(),Se&&Ge===1&&Dt.
length===0&&(Ge=0,_+=1,_t(Vo),typeof Fibers<"u"&&Fibers.df()))}};return ia.set(e,t),t}var Ge=0,Se=null,aa=0,Dt=[],hr=new Map,
oa=new Map,ia=new Map,au=0,mr=null,ou=[],sa=e=>(function(t){if(!W){if(Ge===0){var a=!1,o=!1;t((s=0)=>{if(!W&&(aa=s,a=!0,
o)){Ge=2,_t(()=>zo(Se)),typeof MainLoop<"u"&&MainLoop.Ae&&MainLoop.resume(),s=!1;try{var l=(function(){var y=(c(),I)[Se+
8>>>2>>>0];return y=oa.get(y),y=ia.get(y),--_,y()})()}catch(y){l=y,s=!0}var m=!1;if(!Se){var h=mr;h&&(mr=null,(s?h.reject:
h.resolve)(l),m=!0)}if(s&&!m)throw l}}),o=!0,a||(Ge=1,Se=(function(){var s=Qe(65548),l=s+12;if((c(),b)[s>>>2>>>0]=l,(c(),
b)[s+4>>>2>>>0]=l+65536,l=Dt[0],!hr.has(l)){var m=au++;hr.set(l,m),oa.set(m,l)}return l=hr.get(l),(c(),I)[s+8>>>2>>>0]=l,
s})(),typeof MainLoop<"u"&&MainLoop.Ae&&MainLoop.pause(),_t(()=>Fo(Se)))}else Ge===2?(Ge=0,_t(jo),we(Se),Se=null,ou.forEach(
le)):K(`invalid state: ${Ge}`);return aa}})(t=>{e().then(t)});function iu(e){return e>>>=0,sa(async()=>{var t=await ge(e);
return xe(t)})}var gr=[],su=e=>{var t=gr.length;return gr.push(e),t},uu=(e,t)=>{for(var a=Array(e),o=0;o<e;++o){var s=o,
l=(c(),b)[t+4*o>>>2>>>0],m=fr[l];if(m===void 0)throw e=`parameter ${o}`,l=Ma(l),t=Ce(l),we(l),new dt(`${e} has unknown t\
ype ${t}`);a[s]=m}return a},fu=(e,t,a)=>{var o=[];return e=e(o,a),o.length&&((c(),b)[t>>>2>>>0]=xe(o)),e},lu={},Gt=e=>{var t=lu[e];
return t===void 0?Ce(e):t};function cu(e,t,a){var[o,...s]=uu(e,t>>>0);t=o.kd.bind(o);var l=s.map(y=>y.jd.bind(y));e--;var m={
toValue:ge};switch(e=l.map((y,C)=>{var S=`argFromPtr${C}`;return m[S]=y,`${S}(args${C?"+"+8*C:""})`}),a){case 0:var h="t\
oValue(handle)";break;case 2:h="new (toValue(handle))";break;case 3:h="";break;case 1:m.getStringOrSymbol=Gt,h="toValue(\
handle)[getStringOrSymbol(methodName)]"}return h+=`(${e})`,o.Ee||(m.toReturnWire=t,m.emval_returnValue=fu,h=`return emva\
l_returnValue(toReturnWire, destructorsRef, ${h})`),h=`return function (handle, methodName, destructorsRef, args) {
  ${h}
  }`,a=new Function(Object.keys(m),h)(...Object.values(m)),h=`methodCaller<(${s.map(y=>y.name)}) => ${o.name}>`,su(Object.
defineProperty(a,"name",{value:h}))}function du(e,t){return t>>>=0,(e=ge(e>>>0))==ge(t)}function pu(e){return(e>>>=0)?(e=
Gt(e),xe(globalThis[e])):xe(globalThis)}function hu(e){return e=Gt(e>>>0),xe(n[e])}function mu(e,t){return t>>>=0,e=ge(e>>>
0),t=ge(t),xe(e[t])}function gu(e){9<(e>>>=0)&&(Ze[e+1]+=1)}function ua(e,t,a,o,s){return gr[e>>>0](t>>>0,a>>>0,o>>>0,s>>>
0)}function wu(e,t,a,o,s){return ua(e>>>0,t>>>0,a>>>0,o>>>0,s>>>0)}function yu(){return xe([])}function bu(e){e=ge(e>>>0);
for(var t=Array(e.length),a=0;a<e.length;a++)t[a]=e[a];return xe(t)}function vu(e){return xe(Gt(e>>>0))}function Tu(){return xe(
{})}function xu(e){for(var t=ge(e>>>=0);t.length;){var a=t.pop();t.pop()(a)}lr(e)}function Eu(e,t,a){t>>>=0,a>>>=0,e=ge(
e>>>0),t=ge(t),a=ge(a),e[t]=a}function Au(e,t){e=ie(e),t>>>=0,e=new Date(1e3*e),(c(),I)[t>>>2>>>0]=e.getUTCSeconds(),(c(),
I)[t+4>>>2>>>0]=e.getUTCMinutes(),(c(),I)[t+8>>>2>>>0]=e.getUTCHours(),(c(),I)[t+12>>>2>>>0]=e.getUTCDate(),(c(),I)[t+16>>>
2>>>0]=e.getUTCMonth(),(c(),I)[t+20>>>2>>>0]=e.getUTCFullYear()-1900,(c(),I)[t+24>>>2>>>0]=e.getUTCDay(),e=(e.getTime()-
Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(c(),I)[t+28>>>2>>>0]=e}var fa=e=>e%4==0&&(e%100!=0||e%400==0),la=[0,31,
60,91,121,152,182,213,244,274,305,335],ca=[0,31,59,90,120,151,181,212,243,273,304,334];function Cu(e,t){e=ie(e),t>>>=0,e=
new Date(1e3*e),(c(),I)[t>>>2>>>0]=e.getSeconds(),(c(),I)[t+4>>>2>>>0]=e.getMinutes(),(c(),I)[t+8>>>2>>>0]=e.getHours(),
(c(),I)[t+12>>>2>>>0]=e.getDate(),(c(),I)[t+16>>>2>>>0]=e.getMonth(),(c(),I)[t+20>>>2>>>0]=e.getFullYear()-1900,(c(),I)[t+
24>>>2>>>0]=e.getDay();var a=(fa(e.getFullYear())?la:ca)[e.getMonth()]+e.getDate()-1|0;(c(),I)[t+28>>>2>>>0]=a,(c(),I)[t+
36>>>2>>>0]=-60*e.getTimezoneOffset(),a=new Date(e.getFullYear(),6,1).getTimezoneOffset();var o=new Date(e.getFullYear(),
0,1).getTimezoneOffset();e=0|(a!=o&&e.getTimezoneOffset()==Math.min(o,a)),(c(),I)[t+32>>>2>>>0]=e}function Su(e){e>>>=0;
var t=new Date((c(),I)[e+20>>>2>>>0]+1900,(c(),I)[e+16>>>2>>>0],(c(),I)[e+12>>>2>>>0],(c(),I)[e+8>>>2>>>0],(c(),I)[e+4>>>
2>>>0],(c(),I)[e>>>2>>>0],0),a=(c(),I)[e+32>>>2>>>0],o=t.getTimezoneOffset(),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
l=new Date(t.getFullYear(),0,1).getTimezoneOffset(),m=Math.min(l,s);return 0>a?(c(),I)[e+32>>>2>>>0]=+(s!=l&&m==o):0<a!=
(m==o)&&(s=Math.max(l,s),t.setTime(t.getTime()+6e4*((0<a?m:s)-o))),(c(),I)[e+24>>>2>>>0]=t.getDay(),a=(fa(t.getFullYear())?
la:ca)[t.getMonth()]+t.getDate()-1|0,(c(),I)[e+28>>>2>>>0]=a,(c(),I)[e>>>2>>>0]=t.getSeconds(),(c(),I)[e+4>>>2>>>0]=t.getMinutes(),
(c(),I)[e+8>>>2>>>0]=t.getHours(),(c(),I)[e+12>>>2>>>0]=t.getDate(),(c(),I)[e+16>>>2>>>0]=t.getMonth(),(c(),I)[e+20>>>2>>>
0]=t.getYear(),e=t.getTime(),BigInt(isNaN(e)?-1:e/1e3)}function da(e,t,a,o,s,l,m){return u?V(16,1,e,t,a,o,s,l,m):-52}function pa(e,t,a,o,s,l){
if(u)return V(17,1,e,t,a,o,s,l)}var xt={},Ou=()=>performance.timeOrigin+performance.now();function ha(e,t){if(u)return V(
18,1,e,t);if(xt[e]&&(clearTimeout(xt[e].id),delete xt[e]),!t)return 0;var a=setTimeout(()=>{delete xt[e],le(()=>Xa(e,performance.
timeOrigin+performance.now()))},t);return xt[e]={id:a,cf:t},0}function Iu(e,t,a,o){e>>>=0,t>>>=0,a>>>=0,o>>>=0;var s=new Date().
getFullYear(),l=new Date(s,0,1).getTimezoneOffset();s=new Date(s,6,1).getTimezoneOffset();var m=Math.max(l,s);(c(),b)[e>>>
2>>>0]=60*m,(c(),I)[t>>>2>>>0]=+(l!=s),e=(t=h=>{var y=Math.abs(h);return`UTC${0<=h?"-":"+"}${String(Math.floor(y/60)).padStart(
2,"0")}${String(y%60).padStart(2,"0")}`})(l),t=t(s),s<l?(Ue(e,a,17),Ue(t,o,17)):(Ue(e,o,17),Ue(t,a,17))}var Bu=()=>Date.
now();function Lu(e,t,a){return a>>>=0,0<=e&&3>=e?(e===0?e=Date.now():e=performance.timeOrigin+performance.now(),e=Math.
round(1e6*e),(c(),M)[a>>>3>>>0]=BigInt(e),0):28}var wr=[],ma=(e,t)=>{wr.length=0;for(var a;a=(c(),te)[e++>>>0];){var o=a!=
105;t+=(o&=a!=112)&&t%8?4:0,wr.push(a==112?(c(),b)[t>>>2>>>0]:a==106?(c(),M)[t>>>3>>>0]:a==105?(c(),I)[t>>>2>>>0]:(c(),be)[t>>>
3>>>0]),t+=o?8:4}return wr};function Ru(e,t,a){return e>>>=0,t=ma(t>>>0,a>>>0),Mr[e](...t)}function Mu(e,t,a){return e>>>=
0,t=ma(t>>>0,a>>>0),Mr[e](...t)}var Uu=()=>{};function Pu(e,t){return U(ct(e>>>0,t>>>0))}var $u=()=>{throw _+=1,"unwind"};
function ku(){return 4294901760}var Nu=()=>1,_u=()=>navigator.hardwareConcurrency,Xe={},ga=e=>{var t=Pe(e)+1,a=Qe(t);return a&&
Ue(e,a,t),a},Wt=e=>{var t;return(t=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(e))?+t[1]:(t=/:(\d+):\d+(?:\)|$)/.exec(e))?
2147483648|+t[1]:0},wa=e=>{for(var t of e)(e=Wt(t))&&(Xe[e]=t)};function Du(){var e=Error().stack.toString().split(`
`);return e[0]=="Error"&&e.shift(),wa(e),Xe.ne=Wt(e[3]),Xe.Fe=e,Xe.ne}function Ft(e){if(!(e=Xe[e>>>0]))return 0;var t;if(t=
/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(e))e=t[1];else if(t=/^\s+at (.*) \(.*\)$/.exec(e))e=t[1];else{if(!(t=/^(.+?)@/.exec(
e)))return 0;e=t[1]}return we(Ft.ve??0),Ft.ve=ga(e),Ft.ve}function Gu(e){e>>>=0;var t=(c(),te).length;if(e<=t||4294901760<
e)return!1;for(var a=1;4>=a;a*=2){var o=t*(1+.2/a);o=Math.min(o,e+100663296);e:{o=(Math.min(4294901760,65536*Math.ceil(Math.
max(e,o)/65536))-De.buffer.byteLength+65535)/65536|0;try{De.grow(o),fe();var s=1;break e}catch{}s=void 0}if(s)return!0}return!1}
function Wu(e,t,a){if(e>>>=0,t>>>=0,Xe.ne==e)var o=Xe.Fe;else(o=Error().stack.toString().split(`
`))[0]=="Error"&&o.shift(),wa(o);for(var s=3;o[s]&&Wt(o[s])!=e;)++s;for(e=0;e<a&&o[e+s];++e)(c(),I)[t+4*e>>>2>>>0]=Wt(o[e+
s]);return e}var Oe=e=>{var t=Pe(e)+1,a=Ht(t);return Ue(e,a,t),a},pt=e=>(c(),b)[e>>>2>>>0]+4294967296*(c(),I)[e+4>>>2>>>
0],se=[],ya=(e,t)=>{se[e>>>0]=t},$e=[],Vt=[],ht=(e,t)=>{Vt[e]=new Promise(a=>t.finally(()=>a(e)))},R=e=>{if(e)return se[e>>>
0]},yr=(e,t)=>{for(e=(c(),b)[e>>>2>>>0];e;e=(c(),b)[e>>>2>>>0])t[(c(),I)[e+4>>>2>>>0]](e)},zt=(e,t,a)=>{(c(),b)[e>>>2>>>
0]=t,(c(),b)[e+4>>>2>>>0]=a},ba=e=>{var t=(c(),b)[e>>>2>>>0];return e=(c(),b)[e+4>>>2>>>0],ct(t,e)},Ee=e=>{var t=(c(),b)[e>>>
2>>>0];return e=(c(),b)[e+4>>>2>>>0],t?ct(t,e):e===0?"":void 0},Fu=e=>{var t=Ee(e+4),a=(a=(c(),b)[e+12>>>2>>>0])?R(a):"a\
uto";if(e+=16){var o=R((c(),b)[e+4>>>2>>>0]),s=(c(),b)[e+16>>>2>>>0],l=(c(),b)[e+20>>>2>>>0];if(s){for(var m={},h=0;h<s;++h){
var y=l+24*h;m[ba(y+4)]=(c(),be)[y+16>>>3>>>0]}s=m}else s=void 0;e={module:o,constants:s,entryPoint:Ee(e+8)}}else e=void 0;
return{label:t,layout:a,compute:e}},va=(e,t)=>{function a(l,m,h,y=0){l=e[l]??y,(c(),b)[m+h>>>2>>>0]=l}function o(l,m,h,y=0){
m+=h,l=e[l]??y,(c(),b)[m>>>2>>>0]=l,y=(c(),b)[m>>>2>>>0],(c(),b)[m+4>>>2>>>0]=(l-y)/4294967296}var s=(c(),b)[t>>>2>>>0];
a("maxTextureDimension1D",t,4),a("maxTextureDimension2D",t,8),a("maxTextureDimension3D",t,12),a("maxTextureArrayLayers",
t,16),a("maxBindGroups",t,20),a("maxBindGroupsPlusVertexBuffers",t,24),a("maxBindingsPerBindGroup",t,28),a("maxDynamicUn\
iformBuffersPerPipelineLayout",t,32),a("maxDynamicStorageBuffersPerPipelineLayout",t,36),a("maxSampledTexturesPerShaderS\
tage",t,40),a("maxSamplersPerShaderStage",t,44),a("maxStorageBuffersPerShaderStage",t,48),a("maxStorageTexturesPerShader\
Stage",t,52),a("maxUniformBuffersPerShaderStage",t,56),a("minUniformBufferOffsetAlignment",t,80),a("minStorageBufferOffs\
etAlignment",t,84),o("maxUniformBufferBindingSize",t,64),o("maxStorageBufferBindingSize",t,72),a("maxVertexBuffers",t,88),
o("maxBufferSize",t,96),a("maxVertexAttributes",t,104),a("maxVertexBufferArrayStride",t,108),a("maxInterStageShaderVaria\
bles",t,112),a("maxColorAttachments",t,116),a("maxColorAttachmentBytesPerSample",t,120),a("maxComputeWorkgroupStorageSiz\
e",t,124),a("maxComputeInvocationsPerWorkgroup",t,128),a("maxComputeWorkgroupSizeX",t,132),a("maxComputeWorkgroupSizeY",
t,136),a("maxComputeWorkgroupSizeZ",t,140),a("maxComputeWorkgroupsPerDimension",t,144),a("maxImmediateSize",t,148),s!==0&&
(c(),a("maxStorageBuffersInVertexStage",s,8,e.maxStorageBuffersPerShaderStage),a("maxStorageBuffersInFragmentStage",s,16,
e.maxStorageBuffersPerShaderStage),a("maxStorageTexturesInVertexStage",s,12,e.maxStorageTexturesPerShaderStage),a("maxSt\
orageTexturesInFragmentStage",s,20,e.maxStorageTexturesPerShaderStage))},Vu=(e,t)=>{(c(),b)[t+52>>>2>>>0]=e.subgroupMinSize,
(c(),b)[t+56>>>2>>>0]=e.subgroupMaxSize;var a=ga(e.vendor+e.architecture+e.device+e.description),o=Pe(e.vendor);zt(t+4,a,
o),a+=o,o=Pe(e.architecture),zt(t+12,a,o),a+=o,o=Pe(e.device),zt(t+20,a,o),a+=o,o=Pe(e.description),zt(t+28,a,o),a+=o,(c(),
I)[t+36>>>2>>>0]=2,a=e.isFallbackAdapter?3:4,(c(),I)[t+40>>>2>>>0]=a,(c(),b)[t+44>>>2>>>0]=0,(c(),b)[t+48>>>2>>>0]=0,yr(
t,{327739:s=>{let l=0,m=0;if(e.subgroupMatrixConfigs){l=e.subgroupMatrixConfigs.length,m=Qe(20*l);for(let[h,y]of e.subgroupMatrixConfigs.
entries()){let C=m+20*h,S=xa.indexOf(y.componentType),k=xa.indexOf(y.resultComponentType);(c(),I)[C>>>2>>>0]=S,(c(),I)[C+
4>>>2>>>0]=k,(c(),b)[C+8>>>2>>>0]=y.M,(c(),b)[C+12>>>2>>>0]=y.N,(c(),b)[C+16>>>2>>>0]=y.K}}(c(),b)[s+12>>>2>>>0]=m,(c(),
b)[s+8>>>2>>>0]=l}})},zu=[,,"uniform","storage","read-only-storage"],ju=[,"validation","out-of-memory","internal"],Hu=[,
"compatibility","core"],Ta={1:"core-features-and-limits",2:"depth-clip-control",3:"depth32float-stencil8",4:"texture-com\
pression-bc",5:"texture-compression-bc-sliced-3d",6:"texture-compression-etc2",7:"texture-compression-astc",8:"texture-c\
ompression-astc-sliced-3d",9:"timestamp-query",10:"indirect-first-instance",11:"shader-f16",12:"rg11b10ufloat-renderable",
13:"bgra8unorm-storage",14:"float32-filterable",15:"float32-blendable",16:"clip-distances",17:"dual-source-blending",18:"\
subgroups",19:"texture-formats-tier1",20:"texture-formats-tier2",21:"primitive-index",22:"texture-component-swizzle",23:"\
subgroup-size-control",327692:"chromium-experimental-unorm16-texture-formats",327729:"chromium-experimental-multi-draw-i\
ndirect",327732:"chromium-experimental-subgroup-matrix"},qu=[,"low-power","high-performance"],Yu=[,"occlusion","timestam\
p"],Zu=[,,"filtering","non-filtering","comparison"],Xu=[,,"write-only","read-only","read-write"],xa=[,"f32","f16","u32",
"i32","u8","i8"],Qu=[,"r8unorm","r8snorm","r8uint","r8sint","r16unorm","r16snorm","r16uint","r16sint","r16float","rg8uno\
rm","rg8snorm","rg8uint","rg8sint","r32float","r32uint","r32sint","rg16unorm","rg16snorm","rg16uint","rg16sint","rg16flo\
at","rgba8unorm","rgba8unorm-srgb","rgba8snorm","rgba8uint","rgba8sint","bgra8unorm","bgra8unorm-srgb","rgb10a2uint","rg\
b10a2unorm","rg11b10ufloat","rgb9e5ufloat","rg32float","rg32uint","rg32sint","rgba16unorm","rgba16snorm","rgba16uint","r\
gba16sint","rgba16float","rgba32float","rgba32uint","rgba32sint","stencil8","depth16unorm","depth24plus","depth24plus-st\
encil8","depth32float","depth32float-stencil8","bc1-rgba-unorm","bc1-rgba-unorm-srgb","bc2-rgba-unorm","bc2-rgba-unorm-s\
rgb","bc3-rgba-unorm","bc3-rgba-unorm-srgb","bc4-r-unorm","bc4-r-snorm","bc5-rg-unorm","bc5-rg-snorm","bc6h-rgb-ufloat",
"bc6h-rgb-float","bc7-rgba-unorm","bc7-rgba-unorm-srgb","etc2-rgb8unorm","etc2-rgb8unorm-srgb","etc2-rgb8a1unorm","etc2-\
rgb8a1unorm-srgb","etc2-rgba8unorm","etc2-rgba8unorm-srgb","eac-r11unorm","eac-r11snorm","eac-rg11unorm","eac-rg11snorm",
"astc-4x4-unorm","astc-4x4-unorm-srgb","astc-5x4-unorm","astc-5x4-unorm-srgb","astc-5x5-unorm","astc-5x5-unorm-srgb","as\
tc-6x5-unorm","astc-6x5-unorm-srgb","astc-6x6-unorm","astc-6x6-unorm-srgb","astc-8x5-unorm","astc-8x5-unorm-srgb","astc-\
8x6-unorm","astc-8x6-unorm-srgb","astc-8x8-unorm","astc-8x8-unorm-srgb","astc-10x5-unorm","astc-10x5-unorm-srgb","astc-1\
0x6-unorm","astc-10x6-unorm-srgb","astc-10x8-unorm","astc-10x8-unorm-srgb","astc-10x10-unorm","astc-10x10-unorm-srgb","a\
stc-12x10-unorm","astc-12x10-unorm-srgb","astc-12x12-unorm","astc-12x12-unorm-srgb"],Ju=[,,"float","unfilterable-float",
"depth","sint","uint"],Ea=[,"1d","2d","2d-array","cube","cube-array","3d"],Ku={undefined:1,unknown:1,destroyed:2};function ef(e,t,a,o,s,l){
t=ie(t),a=ie(a),o>>>=0,s>>>=0,l>>>=0;var m=R(e>>>0);if(e={},l){var h=(c(),b)[l+12>>>2>>>0];if(h){var y=(c(),b)[l+16>>>2>>>
0];e.requiredFeatures=Array.from((c(),b).subarray(y>>>2>>>0,y+4*h>>>2>>>0),S=>Ta[S])}if(h=(c(),b)[l+20>>>2>>>0]){let S=function(F,Y,Je,Ct=!1){
Y+=Je,(Y=(c(),b)[Y>>>2>>>0])==4294967295||Ct&&Y==0||(C[F]=Y)},k=function(F,Y,Je){Y+=Je,Je=(c(),b)[Y>>>2>>>0];var Ct=(c(),
b)[Y+4>>>2>>>0];Je==4294967295&&Ct==4294967295||(C[F]=pt(Y))};y=(c(),b)[h>>>2>>>0];var C={};S("maxTextureDimension1D",h,
4),S("maxTextureDimension2D",h,8),S("maxTextureDimension3D",h,12),S("maxTextureArrayLayers",h,16),S("maxBindGroups",h,20),
S("maxBindGroupsPlusVertexBuffers",h,24),S("maxBindingsPerBindGroup",h,28),S("maxDynamicUniformBuffersPerPipelineLayout",
h,32),S("maxDynamicStorageBuffersPerPipelineLayout",h,36),S("maxSampledTexturesPerShaderStage",h,40),S("maxSamplersPerSh\
aderStage",h,44),S("maxStorageBuffersPerShaderStage",h,48),S("maxStorageTexturesPerShaderStage",h,52),S("maxUniformBuffe\
rsPerShaderStage",h,56),S("minUniformBufferOffsetAlignment",h,80),S("minStorageBufferOffsetAlignment",h,84),k("maxUnifor\
mBufferBindingSize",h,64),k("maxStorageBufferBindingSize",h,72),S("maxVertexBuffers",h,88),k("maxBufferSize",h,96),S("ma\
xVertexAttributes",h,104),S("maxVertexBufferArrayStride",h,108),S("maxInterStageShaderVariables",h,112),S("maxColorAttac\
hments",h,116),S("maxColorAttachmentBytesPerSample",h,120),S("maxComputeWorkgroupStorageSize",h,124),S("maxComputeInvoca\
tionsPerWorkgroup",h,128),S("maxComputeWorkgroupSizeX",h,132),S("maxComputeWorkgroupSizeY",h,136),S("maxComputeWorkgroup\
SizeZ",h,140),S("maxComputeWorkgroupsPerDimension",h,144),S("maxImmediateSize",h,148,!0),y!==0&&(c(),"maxStorageBuffersI\
nVertexStage"in GPUSupportedLimits.prototype&&(S("maxStorageBuffersInVertexStage",y,8),S("maxStorageTexturesInVertexStag\
e",y,12),S("maxStorageBuffersInFragmentStage",y,16),S("maxStorageTexturesInFragmentStage",y,20))),e.requiredLimits=C}(h=
(c(),b)[l+24>>>2>>>0])&&(h={label:Ee(h+4)},e.defaultQueue=h),e.label=Ee(l+4)}_+=1,ht(t,m.requestDevice(e).then(S=>{--_,le(
()=>{se[s>>>0]=S.queue,se[o>>>0]=S,_+=1,ht(a,S.lost.then(k=>{le(()=>{S.onuncapturederror=()=>{};var F=$(),Y=Oe(k.message);
Er(a,Ku[k.reason],Y),P(F)}),--_})),S.onuncapturederror=k=>{var F=5;k.error instanceof GPUValidationError?F=2:k.error instanceof
GPUOutOfMemoryError?F=3:k.error instanceof GPUInternalError&&(F=4);var Y=$();k=Oe(k.error.message),Ha(o,F,k),P(Y)},"adap\
terInfo"in S||(S.adapterInfo=m.info),Sr(t,1,o,0)})},S=>{--_,le(()=>{var k=$(),F=Oe(S.message);Sr(t,3,o,F),a&&Er(a,4,F),P(
k)})}))}function tf(e){var t=R(e>>>=0),a=$e[e];if(a){for(var o=0;o<a.length;++o)a[o]();delete $e[e]}t.destroy()}function rf(e,t,a){
a>>>=0;var o=R(e>>>=0);a==4294967295&&(a=void 0);try{var s=o.getMappedRange(t>>>0,a)}catch{return 0}var l=Br(16,s.byteLength);
return(c(),te).set(new Uint8Array(s),l>>>0),$e[e].push(()=>we(l)),l}function nf(e,t,a){a>>>=0;var o=R(e>>>=0);a==4294967295&&
(a=void 0);try{var s=o.getMappedRange(t>>>0,a)}catch{return 0}var l=Br(16,s.byteLength);return(c(),te).fill(0,l,s.byteLength),
$e[e].push(()=>{new Uint8Array(s).set((c(),te).subarray(l>>>0,l+s.byteLength>>>0)),we(l)}),l}function af(e,t,a,o,s){e>>>=
0,t=ie(t),a=ie(a),s>>>=0;var l=R(e);$e[e]=[],s==4294967295&&(s=void 0),_+=1,ht(t,l.mapAsync(a,o>>>0,s).then(()=>{--_,le(
()=>{Ar(t,1,0)})},m=>{--_,le(()=>{$();var h=Oe(m.message);Ar(t,m.name==="AbortError"?4:m.name==="OperationError"?3:0,h),
delete $e[e]})}))}function of(e){var t=R(e>>>=0),a=$e[e];if(a){for(var o=0;o<a.length;++o)a[o]();delete $e[e],t.unmap()}}
function sf(e){delete se[e>>>0]}function uf(e,t,a){e>>>=0,t>>>=0,a>>>=0;var o=!!(c(),b)[t+32>>>2>>>0];t={label:Ee(t+4),usage:(c(),
b)[t+16>>>2>>>0],size:pt(t+24),mappedAtCreation:o},e=R(e);try{var s=e.createBuffer(t)}catch{return!1}return se[a>>>0]=s,
o&&($e[a]=[]),!0}function ff(e,t,a,o){e>>>=0,t=ie(t),o>>>=0,a=Fu(a>>>0),e=R(e),_+=1,ht(t,e.createComputePipelineAsync(a).
then(s=>{--_,le(()=>{se[o>>>0]=s,xr(t,1,o,0)})},s=>{--_,le(()=>{var l=$(),m=Oe(s.message);xr(t,s.reason==="validation"?3:
s.reason==="internal"?4:0,o,m),P(l)})}))}function lf(e,t,a){e>>>=0,t>>>=0,a>>>=0;var o=(c(),b)[t>>>2>>>0],s=(c(),I)[o+4>>>
2>>>0];t={label:Ee(t+4),code:""},s===2&&(t.code=ba(o+8)),e=R(e).createShaderModule(t),se[a>>>0]=e}var cf=e=>{(e=R(e)).onuncapturederror=
null,e.destroy()};function df(e,t){t=ie(t),e=R(e>>>0),_+=1,ht(t,e.popErrorScope().then(a=>{--_,le(()=>{var o=5;a?a instanceof
GPUValidationError?o=2:a instanceof GPUOutOfMemoryError?o=3:a instanceof GPUInternalError&&(o=4):o=1;var s=$(),l=a?Oe(a.
message):0;Cr(t,1,o,l),P(s)})},a=>{--_,le(()=>{var o=$(),s=Oe(a.message);Cr(t,1,5,s),P(o)})}))}function pf(e,t,a,o){if(t=
ie(t),o>>>=0,a>>>=0){var s={featureLevel:Hu[(c(),I)[a+4>>>2>>>0]],powerPreference:qu[(c(),I)[a+8>>>2>>>0]],forceFallbackAdapter:!!(c(),
b)[a+12>>>2>>>0]};(e=(c(),b)[a>>>2>>>0])!==0&&(c(),s.ff=!!(c(),b)[e+8>>>2>>>0])}"gpu"in navigator?(_+=1,ht(t,navigator.gpu.
requestAdapter(s).then(l=>{--_,le(()=>{if(l)se[o>>>0]=l,Et(t,1,o,0);else{var m=$(),h=Oe("WebGPU not available on this br\
owser (requestAdapter returned null)");Et(t,3,o,h),P(m)}})},l=>{--_,le(()=>{var m=$(),h=Oe(l.message);Et(t,4,o,h),P(m)})}))):
(s=$(),e=Oe("WebGPU not available on this browser (navigator.gpu is not available)"),Et(t,3,o,e),P(s))}function hf(e,t,a){
return e>>>=0,t>>>=0,a>>>=0,sa(async()=>{var o=[];if(a){var s=(c(),I)[a>>>2>>>0];o.length=t+1,o[t]=new Promise(h=>setTimeout(
h,s,0))}else o.length=t;for(var l=0;l<t;++l){var m=pt(e+8*l);if(!(m in Vt))return m;o[l]=Vt[m]}return o=await Promise.race(
o),delete Vt[o],o})}var br,vr={},Aa=()=>{if(!br){var e,t={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/hom\
e/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(e in vr)vr[e]===
void 0?delete t[e]:t[e]=vr[e];var a=[];for(e in t)a.push(`${e}=${t[e]}`);br=a}return br};function Ca(e,t){if(u)return V(
19,1,e,t);e>>>=0,t>>>=0;var a,o=0,s=0;for(a of Aa()){var l=t+o;(c(),b)[e+s>>>2>>>0]=l,o+=Ue(a,l,1/0)+1,s+=4}return 0}function Sa(e,t){
if(u)return V(20,1,e,t);e>>>=0,t>>>=0;var a=Aa();for(var o of((c(),b)[e>>>2>>>0]=a.length,e=0,a))e+=Pe(o)+1;return(c(),b)[t>>>
2>>>0]=e,0}function Oa(e){return u?V(21,1,e):52}function Ia(e,t,a,o,s){return u?V(22,1,e,t,a,o,s):52}function Ba(e,t,a,o){
return u?V(23,1,e,t,a,o):52}function La(e,t,a,o){return u?V(24,1,e,t,a,o):70}var mf=[null,[],[]];function Ra(e,t,a,o){if(u)
return V(25,1,e,t,a,o);t>>>=0,a>>>=0,o>>>=0;for(var s=0,l=0;l<a;l++){var m=(c(),b)[t>>>2>>>0],h=(c(),b)[t+4>>>2>>>0];t+=
8;for(var y=0;y<h;y++){var C=e,S=(c(),te)[m+y>>>0],k=mf[C];S===0||S===10?((C===1?q:U)(Wn(k)),k.length=0):k.push(S)}s+=h}
return(c(),b)[o>>>2>>>0]=s,0}function gf(e){return e>>>0}function wf(e,t){return va(R(e>>>0).limits,t>>>0),1}function yf(e,t){
return R(e>>>0).features.has(Ta[t])}function bf(e){return BigInt(R(e>>>0).size)}function vf(e){return BigInt(R(e>>>0).usage)}
function Tf(e,t){if(e>>>=0,t>>>=0){var a=Ee(t+4);a={label:a,timestampWrites:t=(t=(c(),b)[t+12>>>2>>>0])!==0?{querySet:R(
(c(),b)[t+4>>>2>>>0]),beginningOfPassWriteIndex:(c(),b)[t+8>>>2>>>0],endOfPassWriteIndex:(c(),b)[t+12>>>2>>>0]}:void 0}}
return t=R(e),e=Ga(0),a=t.beginComputePass(a),se[e>>>0]=a,e}function xf(e,t,a,o){a=ie(a),(o=ie(o))==-1&&(o=void 0),(e=R(
e>>>0)).clearBuffer(R(t>>>0),a,o)}function Ef(e,t,a,o,s,l){a=ie(a),s=ie(s),l=ie(l),R(e>>>0).copyBufferToBuffer(R(t>>>0),
a,R(o>>>0),s,l)}function Af(e){var t=R(e>>>0);return e=_a(0),t=t.finish(),se[e>>>0]=t,e}function Cf(e,t,a,o,s,l){l=ie(l),
R(e>>>0).resolveQuerySet(R(t>>>0),a,o,R(s>>>0),l)}function Sf(e,t,a,o){R(e>>>0).dispatchWorkgroups(t,a,o)}function Of(e,t,a){
a=ie(a),R(e>>>0).dispatchWorkgroupsIndirect(R(t>>>0),a)}function If(e){R(e>>>0).end()}function Bf(e,t,a,o,s){o>>>=0,s>>>=
0,e=R(e>>>0),a=R(a>>>0),o==0?e.setBindGroup(t,a):e.setBindGroup(t,a,(c(),b),s>>>2,o)}function Lf(e,t){R(e>>>0).setPipeline(
R(t>>>0))}function Rf(e,t,a){R(e>>>0).ef(R(t>>>0),a)}function Mf(e,t){function a(s){var l=(c(),b)[s+8>>>2>>>0],m=(c(),b)[s+
32>>>2>>>0],h=(c(),b)[s+36>>>2>>>0],y=0;return yr(s,{14:C=>{y=(c(),b)[C+8>>>2>>>0]}}),l?((m=pt(s+24))==-1&&(m=void 0),l=
{buffer:R(l),offset:pt(s+16),size:m}):l=R(m||h||y),{binding:(c(),b)[s+4>>>2>>>0],resource:l}}e>>>=0,t={label:Ee((t>>>=0)+
4),layout:R((c(),b)[t+12>>>2>>>0]),entries:(function(s,l){for(var m=[],h=0;h<s;++h)m.push(a(l+40*h));return m})((c(),b)[t+
16>>>2>>>0],(c(),b)[t+20>>>2>>>0])},e=R(e);var o=ka(0);return ya(o,e.createBindGroup(t)),o}function Uf(e,t){function a(y){
var C=(c(),b)[y+4>>>2>>>0];if(C)return{type:zu[C],hasDynamicOffset:!!(c(),b)[y+8>>>2>>>0],minBindingSize:pt(y+16)}}function o(y){
if(y=(c(),b)[y+4>>>2>>>0])return{type:Zu[y]}}function s(y){var C=(c(),b)[y+4>>>2>>>0];if(C)return{sampleType:Ju[C],viewDimension:Ea[(c(),
I)[y+8>>>2>>>0]],multisampled:!!(c(),b)[y+12>>>2>>>0]}}function l(y){var C=(c(),b)[y+4>>>2>>>0];if(C)return{access:Xu[C],
format:Qu[(c(),I)[y+8>>>2>>>0]],viewDimension:Ea[(c(),I)[y+12>>>2>>>0]]}}function m(y){var C={binding:(c(),b)[y+4>>>2>>>
0],visibility:(c(),b)[y+8>>>2>>>0],buffer:a(y+24),sampler:o(y+48),texture:s(y+56),storageTexture:l(y+72)};return yr(y,{13:()=>{
C.externalTexture={}}}),C}e>>>=0,t={label:Ee((t>>>=0)+4),entries:(function(y,C){for(var S=[],k=0;k<y;++k)S.push(m(C+88*k));
return S})((c(),b)[t+12>>>2>>>0],(c(),b)[t+16>>>2>>>0])},e=R(e);var h=Na(0);return ya(h,e.createBindGroupLayout(t)),h}function Pf(e,t){
var a;return e>>>=0,(t>>>=0)&&(a={label:Ee(t+4)}),t=R(e),e=Da(0),a=t.createCommandEncoder(a),se[e>>>0]=a,e}function $f(e,t){
e>>>=0,t>>>=0;for(var a=(c(),b)[t+12>>>2>>>0],o=(c(),b)[t+16>>>2>>>0],s=[],l=0;l<a;++l)s.push(R((c(),b)[o+4*l>>>2>>>0]));
return t={label:Ee(t+4),bindGroupLayouts:s,immediateSize:(c(),b)[t+20>>>2>>>0]},a=R(e),e=Wa(0),t=a.createPipelineLayout(
t),se[e>>>0]=t,e}function kf(e,t){e>>>=0,t>>>=0,t={type:Yu[(c(),I)[t+12>>>2>>>0]],count:(c(),b)[t+16>>>2>>>0]};var a=R(e);
return e=Fa(0),t=a.createQuerySet(t),se[e>>>0]=t,e}function Nf(e,t){return Vu(R(e>>>0).adapterInfo,t>>>0),1}var _f={"cor\
e-features-and-limits":1,"depth-clip-control":2,"depth32float-stencil8":3,"texture-compression-bc":4,"texture-compressio\
n-bc-sliced-3d":5,"texture-compression-etc2":6,"texture-compression-astc":7,"texture-compression-astc-sliced-3d":8,"time\
stamp-query":9,"indirect-first-instance":10,"shader-f16":11,"rg11b10ufloat-renderable":12,"bgra8unorm-storage":13,"float\
32-filterable":14,"float32-blendable":15,"clip-distances":16,"dual-source-blending":17,subgroups:18,"texture-formats-tie\
r1":19,"texture-formats-tier2":20,"primitive-index":21,"texture-component-swizzle":22,"subgroup-size-control":23,"chromi\
um-experimental-unorm16-texture-formats":327692,"chromium-experimental-multi-draw-indirect":327729,"chromium-experimenta\
l-subgroup-matrix":327732};function Df(e,t){t>>>=0;var a=R(e>>>0);e=Qe(4*a.features.size);var o=0,s=0;for(let l of a.features)
0<=(a=_f[l])&&((c(),I)[e+o>>>2>>>0]=a,o+=4,s++);(c(),b)[t+4>>>2>>>0]=e,(c(),b)[t>>>2>>>0]=s}function Gf(e,t){return va(R(
e>>>0).limits,t>>>0),1}function Wf(e,t){R(e>>>0).pushErrorScope(ju[t])}function Ff(e,t,a){t>>>=0,a>>>=0,e=R(e>>>0),t=Array.
from((c(),I).subarray(a>>>2>>>0,a+4*t>>>2>>>0),o=>R(o)),e.submit(t)}function Vf(e,t,a,o,s){a=ie(a),o>>>=0,s>>>=0,e=R(e>>>
0),t=R(t>>>0),o=(c(),te).subarray(o>>>0,o+s>>>0),e.writeBuffer(t,a,o,0,s)}u||(function(){for(var e=n.numThreads-1;e--;)Pn();
ve.push(async()=>{var t=(async function(){if(!u)return Promise.all(_e.map(Un))})();de++,await t,--de==0&&Te&&(t=Te,Te=null,
t())})})(),u||(De=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),fe()),n.wasmBinary&&(T=n.wasmBinary),n.stackSave=
()=>$(),n.stackRestore=e=>P(e),n.stackAlloc=e=>Ht(e),n.setValue=function(e,t,a="i8"){switch(a.endsWith("*")&&(a="*"),a){case"\
i1":case"i8":(c(),Q)[e>>>0]=t;break;case"i16":(c(),Re)[e>>>1>>>0]=t;break;case"i32":(c(),I)[e>>>2>>>0]=t;break;case"i64":
(c(),M)[e>>>3>>>0]=BigInt(t);break;case"float":(c(),ae)[e>>>2>>>0]=t;break;case"double":(c(),be)[e>>>3>>>0]=t;break;case"\
*":(c(),b)[e>>>2>>>0]=t;break;default:K(`invalid type for setValue: ${a}`)}},n.getValue=function(e,t="i8"){switch(t.endsWith(
"*")&&(t="*"),t){case"i1":case"i8":return(c(),Q)[e>>>0];case"i16":return(c(),Re)[e>>>1>>>0];case"i32":return(c(),I)[e>>>
2>>>0];case"i64":return(c(),M)[e>>>3>>>0];case"float":return(c(),ae)[e>>>2>>>0];case"double":return(c(),be)[e>>>3>>>0];case"\
*":return(c(),b)[e>>>2>>>0];default:K(`invalid type for getValue: ${t}`)}},n.UTF8ToString=ct,n.stringToUTF8=Ue,n.lengthBytesUTF8=
Pe;var Ma,Ua,Pa,Tr,jt,we,Qe,$a,ka,Na,_a,Da,Ga,Wa,Fa,Va,za,ja,xr,Er,Ar,Cr,Et,Sr,Ha,Or,qa,Ya,Za,Ir,Xa,Qa,Br,D,At,Ja,P,Ht,$,
Ka,Lr,eo,to,ro,Rr,no,ao,oo,io,so,uo,fo,lo,co,po,ho,mo,go,wo,yo,bo,vo,To,xo,Eo,Ao,Co,So,Oo,Io,Bo,Lo,Ro,Mo,Uo,Po,$o,ko,No,
_o,Do,Go,Wo,Fo,Vo,zo,jo,ke,zf=[qe,ft,Nn,Fn,Vn,zn,jn,Hn,qn,Yn,Zn,Xn,Qn,Jn,Kn,ea,da,pa,ha,Ca,Sa,Oa,Ia,Ba,La,Ra],Mr={1428092:(e,t,a,o,s)=>{
if(n===void 0||!n.md)return 1;if((e=ct(Number(e>>>0))).startsWith("./")&&(e=e.substring(2)),!(e=n.md.get(e)))return 2;if(t=
Number(t>>>0),a=Number(a>>>0),o=Number(o>>>0),t+a>e.byteLength)return 3;try{let l=e.subarray(t,t+a);switch(s){case 0:(c(),
te).set(l,o>>>0);break;case 1:n.xe?n.xe(o,l):n.Ze(o,l);break;default:return 4}return 0}catch{return 4}},1428916:()=>typeof navigator<
"u"&&navigator.gpu?1:0,1428988:(e,t,a)=>{n.ze(e,(c(),te).subarray(t>>>0,t+a>>>0))},1429052:()=>n.Xe(),1429094:e=>{n.ye(e)},
1429131:()=>typeof wasmOffsetConverter<"u"};function jf(){return typeof wasmOffsetConverter<"u"}function Hf(e,t,a,o){var s=$();
try{return po(e,t,a,o)}catch(l){if(P(s),l!==l+0)throw l;D(1,0)}}function qf(e,t,a){var o=$();try{return lo(e,t,a)}catch(s){
if(P(o),s!==s+0)throw s;D(1,0)}}function Yf(e){var t=$();try{so(e)}catch(a){if(P(t),a!==a+0)throw a;D(1,0)}}function Zf(e,t){
var a=$();try{return Rr(e,t)}catch(o){if(P(a),o!==o+0)throw o;D(1,0)}}function Xf(e,t,a){var o=$();try{ro(e,t,a)}catch(s){
if(P(o),s!==s+0)throw s;D(1,0)}}function Qf(e,t,a,o){var s=$();try{return yo(e,t,a,o)}catch(l){if(P(s),l!==l+0)throw l;D(
1,0)}}function Jf(e,t){var a=$();try{ho(e,t)}catch(o){if(P(a),o!==o+0)throw o;D(1,0)}}function Kf(e,t,a,o,s,l,m){var h=$();
try{return fo(e,t,a,o,s,l,m)}catch(y){if(P(h),y!==y+0)throw y;D(1,0)}}function el(e,t,a,o,s,l){var m=$();try{no(e,t,a,o,
s,l)}catch(h){if(P(m),h!==h+0)throw h;D(1,0)}}function tl(e,t,a,o){var s=$();try{oo(e,t,a,o)}catch(l){if(P(s),l!==l+0)throw l;
D(1,0)}}function rl(e,t,a,o,s,l,m){var h=$();try{go(e,t,a,o,s,l,m)}catch(y){if(P(h),y!==y+0)throw y;D(1,0)}}function nl(e,t,a,o,s,l,m){
var h=$();try{wo(e,t,a,o,s,l,m)}catch(y){if(P(h),y!==y+0)throw y;D(1,0)}}function al(e,t,a,o,s,l,m,h){var y=$();try{Oo(e,
t,a,o,s,l,m,h)}catch(C){if(P(y),C!==C+0)throw C;D(1,0)}}function ol(e,t,a,o,s,l,m,h,y,C,S,k){var F=$();try{bo(e,t,a,o,s,
l,m,h,y,C,S,k)}catch(Y){if(P(F),Y!==Y+0)throw Y;D(1,0)}}function il(e,t,a,o,s){var l=$();try{return mo(e,t,a,o,s)}catch(m){
if(P(l),m!==m+0)throw m;D(1,0)}}function sl(e,t,a,o,s,l){var m=$();try{Io(e,t,a,o,s,l)}catch(h){if(P(m),h!==h+0)throw h;
D(1,0)}}function ul(e,t,a,o,s){var l=$();try{uo(e,t,a,o,s)}catch(m){if(P(l),m!==m+0)throw m;D(1,0)}}function fl(e,t,a,o,s,l,m,h){
var y=$();try{co(e,t,a,o,s,l,m,h)}catch(C){if(P(y),C!==C+0)throw C;D(1,0)}}function ll(e){var t=$();try{return Bo(e)}catch(a){
if(P(t),a!==a+0)throw a;D(1,0)}}function cl(e,t,a,o,s,l,m,h,y){var C=$();try{ao(e,t,a,o,s,l,m,h,y)}catch(S){if(P(C),S!==
S+0)throw S;D(1,0)}}function dl(e,t,a){var o=$();try{return io(e,t,a)}catch(s){if(P(o),s!==s+0)throw s;D(1,0)}}function pl(e,t){
var a=$();try{return Go(e,t)}catch(o){if(P(a),o!==o+0)throw o;return D(1,0),0n}}function hl(e,t,a,o){var s=$();try{return Lo(
e,t,a,o)}catch(l){if(P(s),l!==l+0)throw l;D(1,0)}}function ml(e,t,a,o,s,l,m){var h=$();try{Wo(e,t,a,o,s,l,m)}catch(y){if(P(
h),y!==y+0)throw y;D(1,0)}}function gl(e){var t=$();try{return vo(e)}catch(a){if(P(t),a!==a+0)throw a;return D(1,0),0n}}
function wl(e,t,a,o,s){var l=$();try{return Ro(e,t,a,o,s)}catch(m){if(P(l),m!==m+0)throw m;D(1,0)}}function yl(e,t,a,o,s,l){
var m=$();try{return Mo(e,t,a,o,s,l)}catch(h){if(P(m),h!==h+0)throw h;D(1,0)}}function bl(e,t,a,o,s,l){var m=$();try{return Co(
e,t,a,o,s,l)}catch(h){if(P(m),h!==h+0)throw h;D(1,0)}}function vl(e,t,a,o,s,l){var m=$();try{return Uo(e,t,a,o,s,l)}catch(h){
if(P(m),h!==h+0)throw h;D(1,0)}}function Tl(e,t,a,o,s,l,m,h){var y=$();try{return So(e,t,a,o,s,l,m,h)}catch(C){if(P(y),C!==
C+0)throw C;D(1,0)}}function xl(e,t,a,o,s){var l=$();try{return Po(e,t,a,o,s)}catch(m){if(P(l),m!==m+0)throw m;return D(
1,0),0n}}function El(e,t,a,o){var s=$();try{return $o(e,t,a,o)}catch(l){if(P(s),l!==l+0)throw l;D(1,0)}}function Al(e,t,a,o){
var s=$();try{return ko(e,t,a,o)}catch(l){if(P(s),l!==l+0)throw l;D(1,0)}}function Cl(e,t,a,o,s,l,m,h,y,C,S,k){var F=$();
try{return No(e,t,a,o,s,l,m,h,y,C,S,k)}catch(Y){if(P(F),Y!==Y+0)throw Y;D(1,0)}}function Sl(e,t,a,o,s,l,m,h,y,C,S){var k=$();
try{_o(e,t,a,o,s,l,m,h,y,C,S)}catch(F){if(P(k),F!==F+0)throw F;D(1,0)}}function Ol(e,t,a,o,s,l,m,h,y,C,S,k,F,Y,Je,Ct){var Ml=$();
try{Do(e,t,a,o,s,l,m,h,y,C,S,k,F,Y,Je,Ct)}catch(Ur){if(P(Ml),Ur!==Ur+0)throw Ur;D(1,0)}}function Il(e,t,a){var o=$();try{
return xo(e,t,a)}catch(s){if(P(o),s!==s+0)throw s;return D(1,0),0n}}function Bl(e,t,a){var o=$();try{return To(e,t,a)}catch(s){
if(P(o),s!==s+0)throw s;D(1,0)}}function Ll(e,t,a){var o=$();try{return Eo(e,t,a)}catch(s){if(P(o),s!==s+0)throw s;D(1,0)}}
function Rl(e,t,a,o){var s=$();try{Ao(e,t,a,o)}catch(l){if(P(s),l!==l+0)throw l;D(1,0)}}function qt(){if(0<de)Te=qt;else if(u)
L?.(n),re();else{for(var e=ve;0<e.length;)e.shift()(n);0<de?Te=qt:(n.calledRun=!0,W||(re(),L?.(n)))}}return u||(ke=await He(),
qt()),n.PTR_SIZE=4,n.webgpuInit=e=>{let t=new WeakMap,a,o,s=1;n.webgpuRegisterDevice=h=>{if(o!==void 0)throw Error("anot\
her WebGPU EP inference session is being created.");if(h){var y=t.get(h);if(!y){let C=((S,k=0)=>{var F=ja(k);return k=za(
k,F),se[F>>>0]=S.queue,se[k>>>0]=S,k})(h,y=Pa());y=[s++,y,C],t.set(h,y)}return a=h,o=y[0],y}a=void 0,o=0};let l=new Map;
n.webgpuOnCreateSession=h=>{if(o!==void 0){var y=o;if(o=void 0,h){let C=Tr(y);l.set(h,C),y===0&&e(a??R(C))}a=void 0}},n.
webgpuOnReleaseSession=h=>{l.delete(h)};let m=Symbol("gpuBufferMetadata");n.webgpuRegisterBuffer=(h,y,C)=>{if(C)return h[m]=
[C,NaN],C;if(C=h[m])return C[1]++,C[0];if((y=l.get(y))===void 0)throw Error("Invalid session handle passed to webgpuRegi\
sterBuffer");return y=((S,k=0)=>(S.mapState==="unmapped"||K(),k=Va(k),se[k>>>0]=S,k))(h,y),h[m]=[y,1],y},n.webgpuUnregisterBuffer=
h=>{let y=h[m];if(!y)throw Error("Buffer is not registered");y[1]--,y[1]===0&&($a(y[0]),delete h[m])},n.webgpuGetBuffer=
h=>R(h),n.webgpuCreateDownloader=(h,y,C)=>{if((C=l.get(C))===void 0)throw Error("Invalid session handle passed to webgpu\
RegisterBuffer");let S=R(C),k=16*Math.ceil(Number(y)/16);return async()=>{let F=S.createBuffer({size:k,usage:9});try{let Y=S.
createCommandEncoder();return Y.copyBufferToBuffer(h,0,F,0,k),S.queue.submit([Y.finish()]),await F.mapAsync(GPUMapMode.READ),
F.getMappedRange().slice(0,y)}finally{F.destroy()}}},n.xe=(h,y)=>{var C=y.buffer;let S=y.byteOffset,k=y.byteLength;if(y=
16*Math.ceil(Number(k)/16),h=R(h),!a){var F=Tr(o);a=R(F)}let Y=(F=a.createBuffer({mappedAtCreation:!0,size:y,usage:6})).
getMappedRange();new Uint8Array(Y).set(new Uint8Array(C,S,k)),F.unmap(),(C=a.createCommandEncoder()).copyBufferToBuffer(
F,0,h,0,y),a.queue.submit([C.finish()]),F.destroy()}},n.webnnInit=e=>{let t=e[0];[n.Xe,n.ye,n.webnnEnsureTensor,n.ze,n.webnnDownloadTensor,
n.We,n.webnnEnableTraceEvent]=e.slice(1),n.webnnReleaseTensorId=n.ye,n.webnnUploadTensor=n.ze,n.webnnRegisterMLContext=n.
We,n.webnnOnRunStart=a=>t.onRunStart(a),n.webnnOnRunEnd=t.onRunEnd.bind(t),n.webnnOnReleaseSession=a=>{t.onReleaseSession(
a)},n.webnnCreateMLTensorDownloader=(a,o)=>t.createMLTensorDownloader(a,o),n.webnnRegisterMLTensor=(a,o,s,l)=>t.registerMLTensor(
a,o,s,l),n.webnnCreateMLContext=a=>t.createMLContext(a),n.webnnRegisterGraphInput=t.registerGraphInput.bind(t),n.webnnIsGraphInput=
t.isGraphInput.bind(t),n.webnnRegisterGraphOutput=t.registerGraphOutput.bind(t),n.webnnIsGraphOutput=t.isGraphOutput.bind(
t),n.webnnCreateTemporaryTensor=t.createTemporaryTensor.bind(t),n.webnnIsGraphInputOutputTypeSupported=t.isGraphInputOutputTypeSupported.
bind(t)},Z?n:new Promise((e,t)=>{L=e,N=t})}var qi,qo,Kl=G(()=>{"use strict";qi=Ho,qo=globalThis.self?.name?.startsWith("\
em-pthread"),qo&&Ho()}),Wr,an,Yo,pe,Yi,Zt,Zo,Xo,Fr,Qo,Vr,Zi,zr,Xi,mn=G(()=>{"use strict";hn(),Wr=typeof location>"u"?void 0:
location.origin,an=import.meta.url>"file:"&&import.meta.url<"file;",Yo=()=>{if(an){let r=URL;return new URL(new r("ort.w\
ebgpu.bundle.min.mjs",import.meta.url).href,Wr).href}return import.meta.url},pe=Yo(),Yi=()=>{if(pe&&!pe.startsWith("blob\
:"))return pe.substring(0,pe.lastIndexOf("/")+1)},Zt=(r,n)=>{try{let i=n??pe;return(i?new URL(r,i):new URL(r)).origin===
Wr}catch{return!1}},Zo=(r,n)=>{let i=n??pe;try{return(i?new URL(r,i):new URL(r)).href}catch{return}},Xo=(r,n)=>`${n??"./"}${r}`,
Fr=async r=>{let n=await(await fetch(r,{credentials:"same-origin"})).blob();return URL.createObjectURL(n)},Qo=async r=>(await import(r)).
default,Vr=(Jl(),er(zi)).default,Zi=async()=>{if(!pe)throw new Error("Failed to load proxy worker: cannot determine the \
script source URL.");if(Zt(pe))return[void 0,Vr()];let r=await Fr(pe);return[r,Vr(r)]},zr=(Kl(),er(Hi)).default,Xi=async(r,n,i,f)=>{
let u=zr&&!(r||n);if(u)if(pe)u=Zt(pe)||f&&!i;else if(f&&!i)u=!0;else throw new Error("cannot determine the script source\
 URL.");if(u)return[void 0,zr];{let p="ort-wasm-simd-threaded.asyncify.mjs",w=r??Zo(p,n),d=i&&w&&!Zt(w,n),g=d?await Fr(w):
w??Xo(p,n);return[d?g:void 0,await Qo(g)]}}}),jr,Xt,St,Hr,Jo,Ko,ei,gn,j,it=G(()=>{"use strict";mn(),Xt=!1,St=!1,Hr=!1,Jo=
()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(
new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,
11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Ko=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,
1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},
ei=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,
253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},gn=async r=>{if(Xt)return Promise.resolve();if(St)throw new Error(
"multiple calls to 'initializeWebAssembly()' detected.");if(Hr)throw new Error("previous call to 'initializeWebAssembly(\
)' failed.");St=!0;let n=r.initTimeout,i=r.numThreads;if(r.simd!==!1){if(r.simd==="relaxed"){if(!ei())throw new Error("R\
elaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Ko())throw new Error("WebAssembly SIMD i\
s not supported in the current environment.")}let f=Jo();i>1&&!f&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn(
"env.wasm.numThreads is set to "+i+", but this will not work unless you enable crossOriginIsolated mode. See https://web\
.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the cu\
rrent environment. Falling back to single-threading."),r.numThreads=i=1);let u=r.wasmPaths,p=typeof u=="string"?u:void 0,
w=u?.mjs,d=w?.href??w,g=u?.wasm,x=g?.href??g,v=r.wasmBinary,[T,E]=await Xi(d,p,i>1,!!v||!!x),A=!1,L=[];if(n>0&&L.push(new Promise(
N=>{setTimeout(()=>{A=!0,N()},n)})),L.push(new Promise((N,H)=>{let B={numThreads:i};if(v)B.wasmBinary=v,B.locateFile=O=>O;else if(x||
p)B.locateFile=O=>x??p+O;else if(d&&d.indexOf("blob:")!==0)B.locateFile=O=>new URL(O,d).href;else if(T){let O=Yi();O&&(B.
locateFile=q=>O+q)}E(B).then(O=>{St=!1,Xt=!0,jr=O,N(),T&&URL.revokeObjectURL(T)},O=>{St=!1,Hr=!0,H(O)})})),await Promise.
race(L),A)throw new Error(`WebAssembly backend initializing failed due to timeout: ${n}ms`)},j=()=>{if(Xt&&jr)return jr;
throw new Error("WebAssembly is not initialized yet.")}}),he,tr,z,wn=G(()=>{"use strict";it(),he=(r,n)=>{let i=j(),f=i.lengthBytesUTF8(
r)+1,u=i._malloc(f);return i.stringToUTF8(r,u,f),n.push(u),u},tr=(r,n,i,f)=>{if(typeof r=="object"&&r!==null){if(i.has(r))
throw new Error("Circular reference in options");i.add(r)}Object.entries(r).forEach(([u,p])=>{let w=n?n+u:u;if(typeof p==
"object")tr(p,w+".",i,f);else if(typeof p=="string"||typeof p=="number")f(w,p.toString());else if(typeof p=="boolean")f(
w,p?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof p}`)})},z=r=>{let n=j(),i=n.stackSave();try{
let f=n.PTR_SIZE,u=n.stackAlloc(2*f);n._OrtGetLastError(u,u+f);let p=Number(n.getValue(u,f===4?"i32":"i64")),w=n.getValue(
u+f,"*"),d=w?n.UTF8ToString(w):"";throw new Error(`${r} ERROR_CODE: ${p}, ERROR_MESSAGE: ${d}`)}finally{n.stackRestore(i)}}}),
Qi,ec=G(()=>{"use strict";it(),wn(),Qi=(r,n)=>{let i=j(),f=0,u=[],p=r||{};try{if(r?.logSeverityLevel===void 0)p.logSeverityLevel=
2;else if(typeof r.logSeverityLevel!="number"||!Number.isInteger(r.logSeverityLevel)||r.logSeverityLevel<0||r.logSeverityLevel>
4)throw new Error(`log severity level is not valid: ${r.logSeverityLevel}`);if(r?.logVerbosityLevel===void 0)p.logVerbosityLevel=
0;else if(typeof r.logVerbosityLevel!="number"||!Number.isInteger(r.logVerbosityLevel))throw new Error(`log verbosity le\
vel is not valid: ${r.logVerbosityLevel}`);r?.terminate===void 0&&(p.terminate=!1);let w=0;r?.tag!==void 0&&(w=he(r.tag,
u)),f=i._OrtCreateRunOptions(p.logSeverityLevel,p.logVerbosityLevel,!!p.terminate,w),f===0&&z("Can't create run options."),
r?.extra!==void 0&&tr(r.extra,"",new WeakSet,(d,g)=>{let x=he(d,u),v=he(g,u);i._OrtAddRunConfigEntry(f,x,v)!==0&&z(`Can'\
t set a run config entry: ${d} - ${g}.`)});for(let d of n)i._OrtRunOptionsAddActiveLoraAdapter(f,d)!==0&&z("Can't add an\
 active LoRA adapter.");return[f,u]}catch(w){throw f!==0&&i._OrtReleaseRunOptions(f),u.forEach(d=>i._free(d)),w}}}),ti,ri,
ni,gt,Ie,ai,oi,ii,Ji,tc=G(()=>{"use strict";it(),wn(),ti=r=>{switch(r){case"disabled":return 0;case"basic":return 1;case"\
extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization lev\
el: ${r}`)}},ri=r=>{switch(r){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported exe\
cution mode: ${r}`)}},ni=r=>{r.extra||(r.extra={}),r.extra.session||(r.extra.session={});let n=r.extra.session;n.use_ort_model_bytes_directly||
(n.use_ort_model_bytes_directly="1"),r.executionProviders&&r.executionProviders.some(i=>(typeof i=="string"?i:i.name)===
"webgpu")&&(r.enableMemPattern=!1)},gt=(r,n,i,f)=>{let u=he(n,f),p=he(i,f);j()._OrtAddSessionConfigEntry(r,u,p)!==0&&z(`\
Can't set a session config entry: ${n} - ${i}.`)},Ie=(r,n,i,f)=>{let u=he(n,f),p=he(i,f);r.push([u,p])},ai=9,oi=()=>{let r=j(),
n=r.stackSave();try{let i=r.stackAlloc(r.PTR_SIZE),f=r.stackAlloc(r.PTR_SIZE),u=r._OrtGetEpDevices(i,f);if(u===ai)return;
u!==0&&z("Can't get execution provider devices.");let p=Number(r.getValue(i,"*")),w=Number(r.getValue(f,"*")),d=new Map;
for(let g=0;g<w;g++){let x=Number(r.getValue(p+g*r.PTR_SIZE,"*")),v=r.UTF8ToString(r._OrtEpDevice_EpName(x)),T=d.get(v);
T?T.push(x):d.set(v,[x])}return d}finally{r.stackRestore(n)}},ii=async(r,n,i)=>{let f=n.executionProviders;for(let u of f){
let p=typeof u=="string"?u:u.name,w=[],d;switch(p){case"webnn":if(p="WEBNN",gt(r,"session.disable_quant_qdq","1",i),gt(r,
"session.disable_qdq_constant_folding","1",i),typeof u!="string"){let E=u?.deviceType;E&&gt(r,"deviceType",E,i)}break;case"\
webgpu":{p="WebGPU";let E=oi();if(E!==void 0&&(p="WebGpuExecutionProvider",d=E.get(p),d===void 0)){let N=[...E.keys()].join(
", ")||"(none)";throw new Error(`no execution provider device is registered for: ${p}. registered: ${N}.`)}let A;if(typeof u!=
"string"){let N=u;if(N.device)if(typeof GPUDevice<"u"&&N.device instanceof GPUDevice)A=N.device;else throw new Error("In\
valid GPU device set in WebGPU EP options.");let{enableGraphCapture:H}=n;if(typeof H=="boolean"&&H&&Ie(w,"enableGraphCap\
ture","1",i),typeof N.preferredLayout=="string"&&Ie(w,"preferredLayout",N.preferredLayout,i),N.forceCpuNodeNames){let B=Array.
isArray(N.forceCpuNodeNames)?N.forceCpuNodeNames:[N.forceCpuNodeNames];Ie(w,"forceCpuNodeNames",B.join(`
`),i)}N.validationMode&&Ie(w,"validationMode",N.validationMode,i),typeof N.enableMatmulFp32Accumulation=="boolean"&&Ie(w,
"enableMatmulFp32Accumulation",N.enableMatmulFp32Accumulation?"1":"0",i);for(let B of["storageBufferCacheMode","uniformB\
ufferCacheMode","queryResolveBufferCacheMode","defaultBufferCacheMode"]){let O=N[B];if(O){if(O!=="disabled"&&O!=="lazyRe\
lease"&&O!=="simple"&&O!=="bucket")throw new Error(`${B} must be one of 'disabled', 'lazyRelease', 'simple' or 'bucket':\
 ${O}`);Ie(w,B,O,i)}}}let L=j().webgpuRegisterDevice(A);if(L){let[N,H,B]=L;Ie(w,"deviceId",N.toString(),i),Ie(w,"webgpuI\
nstance",H.toString(),i),Ie(w,"webgpuDevice",B.toString(),i)}}break;case"wasm":case"cpu":continue;default:throw new Error(
`not supported execution provider: ${p}`)}let g=w.length,x=0,v=0;if(g>0){x=j()._malloc(g*j().PTR_SIZE),i.push(x),v=j()._malloc(
g*j().PTR_SIZE),i.push(v);for(let E=0;E<g;E++)j().setValue(x+E*j().PTR_SIZE,w[E][0],"*"),j().setValue(v+E*j().PTR_SIZE,w[E][1],
"*")}let T;if(d!==void 0){let E=j()._malloc(j().PTR_SIZE);i.push(E),j().setValue(E,d[0],"*"),T=await j()._OrtAppendExecutionProviderV2(
r,E,1,x,v,g)}else{let E=he(p,i);T=await j()._OrtAppendExecutionProvider(r,E,x,v,g)}T!==0&&z(`Can't append execution prov\
ider: ${p}.`)}},Ji=async r=>{let n=j(),i=0,f=[],u=r||{};ni(u);try{let p=ti(u.graphOptimizationLevel??"all"),w=ri(u.executionMode??
"sequential"),d=typeof u.logId=="string"?he(u.logId,f):0,g=u.logSeverityLevel??2;if(!Number.isInteger(g)||g<0||g>4)throw new Error(
`log severity level is not valid: ${g}`);let x=u.logVerbosityLevel??0;if(!Number.isInteger(x)||x<0||x>4)throw new Error(
`log verbosity level is not valid: ${x}`);let v=typeof u.optimizedModelFilePath=="string"?he(u.optimizedModelFilePath,f):
0;if(i=n._OrtCreateSessionOptions(p,!!u.enableCpuMemArena,!!u.enableMemPattern,w,!!u.enableProfiling,0,d,g,x,v),i===0&&z(
"Can't create session options."),u.executionProviders&&await ii(i,u,f),u.enableGraphCapture!==void 0){if(typeof u.enableGraphCapture!=
"boolean")throw new Error(`enableGraphCapture must be a boolean value: ${u.enableGraphCapture}`);gt(i,"enableGraphCaptur\
e",u.enableGraphCapture.toString(),f)}if(u.freeDimensionOverrides)for(let[T,E]of Object.entries(u.freeDimensionOverrides)){
if(typeof T!="string")throw new Error(`free dimension override name must be a string: ${T}`);if(typeof E!="number"||!Number.
isInteger(E)||E<0)throw new Error(`free dimension override value must be a non-negative integer: ${E}`);let A=he(T,f);n.
_OrtAddFreeDimensionOverride(i,A,E)!==0&&z(`Can't set a free dimension override: ${T} - ${E}.`)}return u.extra!==void 0&&
tr(u.extra,"",new WeakSet,(T,E)=>{gt(i,T,E,f)}),[i,f]}catch(p){throw i!==0&&n._OrtReleaseSessionOptions(i)!==0&&z("Can't\
 release session options."),f.forEach(w=>n._free(w)),p}}}),nt,Kt,yt,Mt,rr,yn,bn,on,vt=G(()=>{"use strict";nt=r=>{switch(r){case"\
int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"\
uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int6\
4":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data \
type: ${r}`)}},Kt=r=>{switch(r){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:
return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"\
float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:
throw new Error(`unsupported data type: ${r}`)}},yt=(r,n)=>{let i=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,
.5][r],f=typeof n=="number"?n:n.reduce((u,p)=>u*p,1);return i>0?Math.ceil(f*i):void 0},Mt=r=>{switch(r){case"float16":return typeof Float16Array<
"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"\
uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"\
float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:
throw new Error(`unsupported type: ${r}`)}},rr=r=>{switch(r){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"\
error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${r}`)}},yn=r=>r==="float32"||r===
"float16"||r==="int32"||r==="int64"||r==="uint32"||r==="uint8"||r==="bool"||r==="uint4"||r==="int4",bn=r=>r==="float32"||
r==="float16"||r==="int32"||r==="int64"||r==="uint32"||r==="uint64"||r==="int8"||r==="uint8"||r==="bool"||r==="uint4"||r===
"int4",on=r=>{switch(r){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu\
-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${r}`)}}}),ar,vn=G(()=>{"\
use strict";hn(),ar=async r=>{if(typeof r=="string"){let n=await fetch(r);if(!n.ok)throw new Error(`failed to load exter\
nal data file: ${r}`);let i=n.headers.get("Content-Length"),f=i?parseInt(i,10):0;if(f<1073741824)return new Uint8Array(await n.
arrayBuffer());{if(!n.body)throw new Error(`failed to load external data file: ${r}, no response body.`);let u=n.body.getReader(),
p;try{p=new ArrayBuffer(f)}catch(d){if(d instanceof RangeError){let g=Math.ceil(f/65536);p=new WebAssembly.Memory({initial:g,
maximum:g}).buffer}else throw d}let w=0;for(;;){let{done:d,value:g}=await u.read();if(d)break;let x=g.byteLength;new Uint8Array(
p,w,x).set(g),w+=x}return new Uint8Array(p,0,f)}}else return r instanceof Blob?new Uint8Array(await r.arrayBuffer()):r instanceof
Uint8Array?r:new Uint8Array(r)}}),Ki,rc=G(()=>{"use strict";vt(),Ki=(r,n)=>new(Mt(n))(r)}),si,ui,fi,li,es,ci,ce,ts=G(()=>{
"use strict";vt(),si=["V","I","W","E","F"],ui=(r,n)=>{console.log(`[${si[r]},${new Date().toISOString()}]${n}`)},es=(r,n)=>{
fi=r,li=n},ci=(r,n)=>{let i=rr(r),f=rr(fi);i>=f&&ui(i,typeof n=="function"?n():n)},ce=(...r)=>{li&&ci(...r)}}),qr,di,Yr,
pi,Zr,hi,Xr,Qr,Jr,mi,rs,nc=G(()=>{"use strict";vt(),ts(),qr=new Map([["float32",32],["float16",16],["int32",32],["uint32",
32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),di=(r,n)=>{if(n==="int32")return r;let i=qr.
get(n);if(!i)throw new Error(`WebNN backend does not support data type: ${n}`);let f=i/8;if(r.byteLength%f!==0)throw new Error(
`Invalid Uint8Array length - must be a multiple of ${f}.`);let u=r.byteLength/f,p=new(Mt(n))(r.buffer,r.byteOffset,u);switch(n){case"\
int64":case"uint64":{let w=new Int32Array(u);for(let d=0;d<u;d++){let g=p[d];if(g>2147483647n||g<-2147483648n)throw new Error(
"Can not convert int64 data to int32 - value out of range.");w[d]=Number(g)}return new Uint8Array(w.buffer)}case"int8":case"\
uint8":case"uint32":{if(n==="uint32"&&p.some(d=>d>2147483647))throw new Error("Can not convert uint32 data to int32 - va\
lue out of range.");let w=Int32Array.from(p,Number);return new Uint8Array(w.buffer)}default:throw new Error(`Unsupported\
 data conversion from ${n} to 'int32'`)}},Yr=(r,n)=>{if(n==="int32")return r;if(r.byteLength%4!==0)throw new Error("Inva\
lid Uint8Array length - must be a multiple of 4 (int32).");let i=r.byteLength/4,f=new Int32Array(r.buffer,r.byteOffset,i);
switch(n){case"int64":{let u=BigInt64Array.from(f,BigInt);return new Uint8Array(u.buffer)}case"uint64":{if(f.some(p=>p<0))
throw new Error("Can not convert int32 data to uin64 - negative value found.");let u=BigUint64Array.from(f,BigInt);return new Uint8Array(
u.buffer)}case"int8":{if(f.some(p=>p<-128||p>127))throw new Error("Can not convert int32 data to int8 - value out of ran\
ge.");let u=Int8Array.from(f,Number);return new Uint8Array(u.buffer)}case"uint8":{if(f.some(u=>u<0||u>255))throw new Error(
"Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(f,Number)}case"uint32":{if(f.some(p=>p<
0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let u=Uint32Array.from(f,Number);return new Uint8Array(
u.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${n}`)}},pi=1,Zr=()=>pi++,hi=new Map([["i\
nt8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Xr=(r,n)=>{let i=qr.get(r);if(!i)throw new Error(
`WebNN backend does not support data type: ${r}`);return n.length>0?Math.ceil(n.reduce((f,u)=>f*u)*i/8):0},Qr=class{constructor(r){
this.isDataConverted=!1;let{sessionId:n,context:i,tensor:f,dataType:u,shape:p,fallbackDataType:w}=r;this.sessionId=n,this.
mlContext=i,this.mlTensor=f,this.dataType=u,this.tensorShape=p,this.fallbackDataType=w}get tensor(){return this.mlTensor}get type(){
return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){
return Xr(this.dataType,this.tensorShape)}destroy(){ce("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(r){
this.mlContext.writeTensor(this.mlTensor,r)}async read(r){if(this.fallbackDataType){let n=await this.mlContext.readTensor(
this.mlTensor),i=Yr(new Uint8Array(n),this.dataType);if(r){(r instanceof ArrayBuffer?new Uint8Array(r):new Uint8Array(r.
buffer,r.byteOffset,r.byteLength)).set(i);return}else return new Uint8Array(i).buffer}else return r?this.mlContext.readTensor(
this.mlTensor,r):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(r,n,i){return this.mlContext===r&&this.dataType===
n&&this.tensorShape.length===i.length&&this.tensorShape.every((f,u)=>f===i[u])}setIsDataConverted(r){this.isDataConverted=
r}},Jr=class{constructor(r,n){this.tensorManager=r,this.wrapper=n}get tensorWrapper(){return this.wrapper}releaseTensor(){
this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(r,n,i,f){
let u=this.tensorManager.getMLContext(r),p=this.tensorManager.getMLOpSupportLimits(r),w;if(!p?.input.dataTypes.includes(
n)){if(w=hi.get(n),!w||!p?.input.dataTypes.includes(w))throw new Error(`WebNN backend does not support data type: ${n}`);
ce("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${n} to ${w}`)}if(this.wrapper){if(this.wrapper.
canReuseTensor(u,n,i))return this.wrapper.tensor;if(f){if(this.wrapper.byteLength!==Xr(n,i))throw new Error("Unable to c\
opy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.
releaseTensor(this.wrapper)}let d=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=
await this.tensorManager.getCachedTensor(r,n,i,d,!0,!0,w),f&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.
activeUpload=void 0),this.wrapper.tensor}upload(r){let n=r;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.
fallbackType==="int32")n=di(r,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported f\
allback data type: ${this.wrapper.fallbackType}`);if(r.byteLength===this.wrapper.byteLength){this.wrapper.write(n);return}else
ce("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.
activeUpload.set(n):this.activeUpload=new Uint8Array(n)}async download(r){if(this.activeUpload){let n=this.wrapper?.isDataConverted?
Yr(this.activeUpload,this.wrapper?.type):this.activeUpload;if(r){r instanceof ArrayBuffer?new Uint8Array(r).set(n):new Uint8Array(
r.buffer,r.byteOffset,r.byteLength).set(n);return}else return n.buffer}if(!this.wrapper)throw new Error("Tensor has not \
been created.");return r?this.wrapper.read(r):this.wrapper.read()}},mi=class{constructor(r){this.backend=r,this.tensorTrackersById=
new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(r){let n=this.backend.getMLContext(r);if(!n)throw new Error(
"MLContext not found for session.");return n}getMLOpSupportLimits(r){return this.backend.getMLOpSupportLimits(r)}reserveTensorId(){
let r=Zr();return this.tensorTrackersById.set(r,new Jr(this)),r}releaseTensorId(r){let n=this.tensorTrackersById.get(r);
n&&(this.tensorTrackersById.delete(r),n.tensorWrapper&&this.releaseTensor(n.tensorWrapper))}async ensureTensor(r,n,i,f,u){
ce("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${n}, dataType: ${i}, shape: ${f}, copyOld: ${u}}`);let p=this.
tensorTrackersById.get(n);if(!p)throw new Error("Tensor not found.");return p.ensureTensor(r,i,f,u)}upload(r,n){let i=this.
tensorTrackersById.get(r);if(!i)throw new Error("Tensor not found.");i.upload(n)}async download(r,n){ce("verbose",()=>`[\
WebNN] TensorManager.download {tensorId: ${r}, dstBuffer: ${n?.byteLength}}`);let i=this.tensorTrackersById.get(r);if(!i)
throw new Error("Tensor not found.");return i.download(n)}releaseTensorsForSession(r){for(let n of this.freeTensors)n.sessionId===
r&&n.destroy();this.freeTensors=this.freeTensors.filter(n=>n.sessionId!==r)}registerTensor(r,n,i,f){let u=this.getMLContext(
r),p=Zr(),w=new Qr({sessionId:r,context:u,tensor:n,dataType:i,shape:f});return this.tensorTrackersById.set(p,new Jr(this,
w)),this.externalTensors.add(w),p}async getCachedTensor(r,n,i,f,u,p,w){let d=this.getMLContext(r);for(let[x,v]of this.freeTensors.
entries())if(v.canReuseTensor(d,n,i)){ce("verbose",()=>`[WebNN] Reusing tensor {dataType: ${n}, ${w?`fallbackDataType: ${w}\
,`:""} shape: ${i}`);let T=this.freeTensors.splice(x,1)[0];return T.sessionId=r,T}ce("verbose",()=>`[WebNN] MLContext.cr\
eateTensor {dataType: ${n}, ${w?`fallbackDataType: ${w},`:""} shape: ${i}}`);let g=await d.createTensor({dataType:w??n,shape:i,
dimensions:i,usage:f,writable:u,readable:p});return new Qr({sessionId:r,context:d,tensor:g,dataType:n,shape:i,fallbackDataType:w})}releaseTensor(r){
this.externalTensors.has(r)&&this.externalTensors.delete(r),this.freeTensors.push(r)}},rs=(...r)=>new mi(...r)}),ns={};Ut(
ns,{WebNNBackend:()=>as});var Ot,gi,as,ac=G(()=>{"use strict";vt(),it(),rc(),nc(),ts(),Ot=new Map([[1,"float32"],[10,"fl\
oat16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),
gi=(r,n)=>{if(r===n)return!0;if(r===void 0||n===void 0)return!1;let i=Object.keys(r).sort(),f=Object.keys(n).sort();return i.
length===f.length&&i.every((u,p)=>u===f[p]&&r[u]===n[u])},as=class{constructor(r){this.tensorManager=rs(this),this.mlContextBySessionId=
new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=
new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=
new Map,es(r.logLevel,!!r.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active sess\
ion");return this.activeSessionId}onRunStart(r){ce("verbose",()=>`[WebNN] onRunStart {sessionId: ${r}}`),this.activeSessionId=
r}onRunEnd(r){ce("verbose",()=>`[WebNN] onRunEnd {sessionId: ${r}}`);let n=this.temporarySessionTensorIds.get(r);if(n){for(let i of n)
ce("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${i}}`),this.tensorManager.releaseTensorId(i);this.temporarySessionTensorIds.
delete(r),this.activeSessionId=void 0}}async createMLContext(r){if(r instanceof GPUDevice){let i=this.mlContextCache.findIndex(
f=>f.gpuDevice===r);if(i!==-1)return this.mlContextCache[i].mlContext;{let f=await navigator.ml.createContext(r);return this.
mlContextCache.push({gpuDevice:r,mlContext:f}),f}}else if(r===void 0){let i=this.mlContextCache.findIndex(f=>f.options===
void 0&&f.gpuDevice===void 0);if(i!==-1)return this.mlContextCache[i].mlContext;{let f=await navigator.ml.createContext();
return this.mlContextCache.push({mlContext:f}),f}}let n=this.mlContextCache.findIndex(i=>gi(i.options,r));if(n!==-1)return this.
mlContextCache[n].mlContext;{let i=await navigator.ml.createContext(r);return this.mlContextCache.push({options:r,mlContext:i}),
i}}registerMLContext(r,n){this.mlContextBySessionId.set(r,n);let i=this.sessionIdsByMLContext.get(n);i||(i=new Set,this.
sessionIdsByMLContext.set(n,i)),i.add(r),this.mlOpSupportLimitsBySessionId.has(r)||this.mlOpSupportLimitsBySessionId.set(
r,n.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(r,this.temporaryGraphInputs),this.
temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(r,this.temporaryGraphOutputs),
this.temporaryGraphOutputs=[])}onReleaseSession(r){this.sessionGraphInputs.delete(r),this.sessionGraphOutputs.delete(r);
let n=this.mlContextBySessionId.get(r);if(!n)return;this.tensorManager.releaseTensorsForSession(r),this.mlContextBySessionId.
delete(r),this.mlOpSupportLimitsBySessionId.delete(r);let i=this.sessionIdsByMLContext.get(n);if(i.delete(r),i.size===0){
this.sessionIdsByMLContext.delete(n);let f=this.mlContextCache.findIndex(u=>u.mlContext===n);f!==-1&&this.mlContextCache.
splice(f,1)}}getMLContext(r){return this.mlContextBySessionId.get(r)}getMLOpSupportLimits(r){return this.mlOpSupportLimitsBySessionId.
get(r)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(r){ce("verbose",()=>`[WebNN] releas\
eTensorId {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r)}async ensureTensor(r,n,i,f,u){let p=Ot.get(i);if(!p)throw new Error(
`Unsupported ONNX data type: ${i}`);return this.tensorManager.ensureTensor(r??this.currentSessionId,n,p,f,u)}async createTemporaryTensor(r,n,i){
ce("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${n}, shape: ${i}}`);let f=Ot.get(n);if(!f)throw new Error(
`Unsupported ONNX data type: ${n}`);let u=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(r,u,
f,i,!1);let p=this.temporarySessionTensorIds.get(r);return p?p.push(u):this.temporarySessionTensorIds.set(r,[u]),u}uploadTensor(r,n){
if(!j().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");
ce("verbose",()=>`[WebNN] uploadTensor {tensorId: ${r}, data: ${n.byteLength}}`),this.tensorManager.upload(r,n)}async downloadTensor(r,n){
return this.tensorManager.download(r,n)}createMLTensorDownloader(r,n){return async()=>{let i=await this.tensorManager.download(
r);return Ki(i,n)}}registerMLTensor(r,n,i,f){let u=Ot.get(i);if(!u)throw new Error(`Unsupported ONNX data type: ${i}`);let p=this.
tensorManager.registerTensor(r,n,u,f);return ce("verbose",()=>`[WebNN] registerMLTensor {tensor: ${n}, dataType: ${u}, d\
imensions: ${f}} -> {tensorId: ${p}}`),p}registerGraphInput(r){this.temporaryGraphInputs.push(r)}registerGraphOutput(r){
this.temporaryGraphOutputs.push(r)}isGraphInput(r,n){let i=this.sessionGraphInputs.get(r);return i?i.includes(n):!1}isGraphOutput(r,n){
let i=this.sessionGraphOutputs.get(r);return i?i.includes(n):!1}isGraphInputOutputTypeSupported(r,n,i=!0){let f=Ot.get(nt(
n)),u=this.mlOpSupportLimitsBySessionId.get(r);return typeof f>"u"?!1:i?!!u?.input.dataTypes.includes(f):!!u?.output.dataTypes.
includes(f)}flush(){}}}),wi,Tn,xn,We,yi,Kr,nr,En,An,It,bi,Ke,os,is,en,Cn,Sn,On,ss=G(()=>{"use strict";ze(),ec(),tc(),vt(),
it(),wn(),vn(),wi=(r,n)=>{j()._OrtInit(r,n)!==0&&z("Can't initialize onnxruntime.")},Tn=async r=>{wi(r.wasm.numThreads,rr(
r.logLevel))},xn=async(r,n)=>{j().asyncInit?.();let i=r.webgpu.adapter;if(n==="webgpu"){if(typeof navigator>"u"||!navigator.
gpu)throw new Error("WebGPU is not supported in current environment");if(i){if(typeof i.limits!="object"||typeof i.features!=
"object"||typeof i.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must b\
e a GPUAdapter object.")}else{let f=r.webgpu.powerPreference;if(f!==void 0&&f!=="low-power"&&f!=="high-performance")throw new Error(
`Invalid powerPreference setting: "${f}"`);let u=r.webgpu.forceFallbackAdapter;if(u!==void 0&&typeof u!="boolean")throw new Error(
`Invalid forceFallbackAdapter setting: "${u}"`);if(i=await navigator.gpu.requestAdapter({powerPreference:f,forceFallbackAdapter:u}),
!i)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chr\
ome.')}}if(n==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environ\
ment");if(n==="webgpu"&&j().webgpuInit(f=>{r.webgpu.device=f}),n==="webnn"){let f=new(ac(),er(ns)).WebNNBackend(r);j().webnnInit(
[f,()=>f.reserveTensorId(),u=>f.releaseTensorId(u),async(u,p,w,d,g)=>f.ensureTensor(u,p,w,d,g),(u,p)=>{f.uploadTensor(u,
p)},async(u,p)=>f.downloadTensor(u,p),(u,p)=>f.registerMLContext(u,p),!!r.trace])}},We=new Map,yi=r=>{let n=j(),i=n.stackSave();
try{let f=n.PTR_SIZE,u=n.stackAlloc(2*f);n._OrtGetInputOutputCount(r,u,u+f)!==0&&z("Can't get session input/output count\
.");let p=f===4?"i32":"i64";return[Number(n.getValue(u,p)),Number(n.getValue(u+f,p))]}finally{n.stackRestore(i)}},Kr=(r,n)=>{
let i=j(),f=i.stackSave(),u=0;try{let p=i.PTR_SIZE,w=i.stackAlloc(2*p);i._OrtGetInputOutputMetadata(r,n,w,w+p)!==0&&z("C\
an't get session input/output metadata.");let d=Number(i.getValue(w,"*"));u=Number(i.getValue(w+p,"*"));let g=i.HEAP32[u/
4];if(g===0)return[d,0];let x=i.HEAPU32[u/4+1],v=[];for(let T=0;T<x;T++){let E=Number(i.getValue(u+8+T*p,"*"));v.push(E!==
0?i.UTF8ToString(E):Number(i.getValue(u+8+(T+x)*p,"*")))}return[d,g,v]}finally{i.stackRestore(f),u!==0&&i._OrtFree(u)}},
nr=r=>{let n=j(),i=n._malloc(r.byteLength);if(i===0)throw new Error(`Can't create a session. failed to allocate a buffer\
 of size ${r.byteLength}.`);return n.HEAPU8.set(r,i),[i,r.byteLength]},En=async(r,n)=>{let i,f,u=j();Array.isArray(r)?[i,
f]=r:r.buffer===u.HEAPU8.buffer?[i,f]=[r.byteOffset,r.byteLength]:[i,f]=nr(r);let p=0,w=0,d=0,g=[],x=[],v=[];try{if([w,g]=
await Ji(n),n?.externalData&&u.mountExternalData){let U=[];for(let W of n.externalData){let X=typeof W=="string"?W:W.path,
c=typeof W=="string"?W:W.data;U.push(ar(c).then(J=>{u.mountExternalData(X,J)}))}await Promise.all(U)}for(let U of n?.executionProviders??
[])if((typeof U=="string"?U:U.name)==="webnn"){if(u.shouldTransferToMLTensor=!1,typeof U!="string"){let W=U,X=W?.context,
c=W?.gpuDevice,J=W?.deviceType,Q=W?.powerPreference;X?u.currentContext=X:c?u.currentContext=await u.webnnCreateMLContext(
c):u.currentContext=await u.webnnCreateMLContext({deviceType:J,powerPreference:Q})}else u.currentContext=await u.webnnCreateMLContext();
break}p=await u._OrtCreateSession(i,f,w),u.webgpuOnCreateSession?.(p),p===0&&z("Can't create a session."),u.jsepOnCreateSession?.(),
u.currentContext&&(u.webnnRegisterMLContext(p,u.currentContext),u.currentContext=void 0,u.shouldTransferToMLTensor=!0);let[
T,E]=yi(p),A=!!n?.enableGraphCapture,L=[],N=[],H=[],B=[],O=[];for(let U=0;U<T;U++){let[W,X,c]=Kr(p,U);W===0&&z("Can't ge\
t an input name."),x.push(W);let J=u.UTF8ToString(W);L.push(J),H.push(X===0?{name:J,isTensor:!1}:{name:J,isTensor:!0,type:Kt(
X),shape:c})}for(let U=0;U<E;U++){let[W,X,c]=Kr(p,U+T);W===0&&z("Can't get an output name."),v.push(W);let J=u.UTF8ToString(
W);N.push(J),B.push(X===0?{name:J,isTensor:!1}:{name:J,isTensor:!0,type:Kt(X),shape:c});{if(A&&n?.preferredOutputLocation===
void 0){O.push("gpu-buffer");continue}let Q=typeof n?.preferredOutputLocation=="string"?n.preferredOutputLocation:n?.preferredOutputLocation?.[J]??
"cpu",te=u.webnnIsGraphOutput;if(Q==="cpu"&&te&&te(p,J)){O.push("ml-tensor-cpu-output");continue}if(Q!=="cpu"&&Q!=="cpu-\
pinned"&&Q!=="gpu-buffer"&&Q!=="ml-tensor")throw new Error(`Not supported preferred output location: ${Q}.`);if(A&&Q!=="\
gpu-buffer")throw new Error(`Not supported preferred output location: ${Q}. Only 'gpu-buffer' location is supported when\
 enableGraphCapture is true.`);O.push(Q)}}let q=null;return O.some(U=>U==="gpu-buffer"||U==="ml-tensor"||U==="ml-tensor-\
cpu-output")&&(d=u._OrtCreateBinding(p),d===0&&z("Can't create IO binding."),q={handle:d,outputPreferredLocations:O,outputPreferredLocationsEncoded:O.
map(U=>U==="ml-tensor-cpu-output"?"ml-tensor":U).map(U=>on(U))}),We.set(p,[p,x,v,q,A,!1]),[p,L,N,H,B]}catch(T){throw x.forEach(
E=>u._OrtFree(E)),v.forEach(E=>u._OrtFree(E)),d!==0&&u._OrtReleaseBinding(d)!==0&&z("Can't release IO binding."),p!==0&&
u._OrtReleaseSession(p)!==0&&z("Can't release session."),T}finally{u._free(i),w!==0&&u._OrtReleaseSessionOptions(w)!==0&&
z("Can't release session options."),g.forEach(T=>u._free(T)),u.unmountExternalData?.()}},An=r=>{let n=j(),i=We.get(r);if(!i)
throw new Error(`cannot release session. invalid session id: ${r}`);let[f,u,p,w,d]=i;w&&(d&&n._OrtClearBoundOutputs(w.handle)!==
0&&z("Can't clear bound outputs."),n._OrtReleaseBinding(w.handle)!==0&&z("Can't release IO binding.")),n.jsepOnReleaseSession?.(
r),n.webnnOnReleaseSession?.(r),n.webgpuOnReleaseSession?.(r),u.forEach(g=>n._OrtFree(g)),p.forEach(g=>n._OrtFree(g)),n.
_OrtReleaseSession(f)!==0&&z("Can't release session."),We.delete(r)},It=new Map,bi=1,Ke=new Map,os=r=>{let n=j(),i=n._malloc(
r.byteLength);if(i===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${r.byteLength}\
.`);try{n.HEAPU8.set(r,i);let f=n._OrtCreateLoraAdapter(i,r.byteLength);f===0&&z("Can't create a LoRA adapter.");let u=bi++;
return It.set(u,f),u}finally{n._free(i)}},is=r=>{let n=j(),i=It.get(r);if(i===void 0)throw new Error(`cannot release LoR\
A adapter. invalid adapter id: ${r}`);if(Ke.has(r))throw new Error(`cannot release LoRA adapter. the adapter is used by \
a run in progress. adapter id: ${r}`);n._OrtReleaseLoraAdapter(i)!==0&&z("Can't release LoRA adapter."),It.delete(r)},en=
async(r,n,i,f,u,p,w=!1)=>{if(!r){n.push(0);return}let d=j(),g=d.PTR_SIZE,x=r[0],v=r[1],T=r[3],E=T,A,L;if(x==="string"&&(T===
"gpu-buffer"||T==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(w&&T!=="gpu-buffer")throw new Error(
`External buffer must be provided for input/output index ${p} when enableGraphCapture is true.`);if(T==="gpu-buffer"){let B=r[2].
gpuBuffer;L=yt(nt(x),v);{let O=d.webgpuRegisterBuffer;if(!O)throw new Error('Tensor location "gpu-buffer" is not support\
ed without using WebGPU.');A=O(B,f)}}else if(T==="ml-tensor"){let B=r[2].mlTensor;L=yt(nt(x),v);let O=d.webnnRegisterMLTensor;
if(!O)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');A=O(f,B,nt(x),v)}else{let B=r[2];
if(Array.isArray(B)){L=g*B.length,A=d._malloc(L),i.push(A);for(let O=0;O<B.length;O++){if(typeof B[O]!="string")throw new TypeError(
`tensor data at index ${O} is not a string`);d.setValue(A+O*g,he(B[O],i),"*")}}else{let O=d.webnnIsGraphInput,q=d.webnnIsGraphOutput;
if(x!=="string"&&O&&q){let U=d.UTF8ToString(u);if(O(f,U)||q(f,U)){let W=nt(x);L=yt(W,v),E="ml-tensor";let X=d.webnnCreateTemporaryTensor,
c=d.webnnUploadTensor;if(!X||!c)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let J=await X(
f,W,v);c(J,new Uint8Array(B.buffer,B.byteOffset,B.byteLength)),A=J}else L=B.byteLength,A=d._malloc(L),i.push(A),d.HEAPU8.
set(new Uint8Array(B.buffer,B.byteOffset,L),A)}else L=B.byteLength,A=d._malloc(L),i.push(A),d.HEAPU8.set(new Uint8Array(
B.buffer,B.byteOffset,L),A)}}let N=d.stackSave(),H=d.stackAlloc(4*v.length);try{v.forEach((O,q)=>d.setValue(H+q*g,O,g===
4?"i32":"i64"));let B=d._OrtCreateTensor(nt(x),A,L,H,v.length,on(E));B===0&&z(`Can't create tensor for input/output. ses\
sion=${f}, index=${p}.`),n.push(B)}finally{d.stackRestore(N)}},Cn=async(r,n,i,f,u,p,w=[])=>{let d=j(),g=d.PTR_SIZE,x=We.
get(r);if(!x)throw new Error(`cannot run inference. invalid session id: ${r}`);let v=x[0],T=x[1],E=x[2],A=x[3],L=x[4],N=x[5],
H=[];if(w.length>0){if(A)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when \
an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let b of w){let ae=It.
get(b);if(ae===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${b}`);H.push(ae)}}let B=n.length,
O=f.length,q=0,U=[],W=[],X=[],c=[],J=[],Q=d.stackSave(),te=d.stackAlloc(B*g),Re=d.stackAlloc(B*g),Ae=d.stackAlloc(O*g),I=d.
stackAlloc(O*g);try{for(let M of w)Ke.set(M,(Ke.get(M)??0)+1);[q,U]=Qi(p,H),at("wasm prepareInputOutputTensor");for(let M=0;M<
B;M++)await en(i[M],W,c,r,T[n[M]],n[M],L);for(let M=0;M<O;M++)await en(u[M],X,c,r,E[f[M]],B+f[M],L);ot("wasm prepareInpu\
tOutputTensor");for(let M=0;M<B;M++)d.setValue(te+M*g,W[M],"*"),d.setValue(Re+M*g,T[n[M]],"*");for(let M=0;M<O;M++)d.setValue(
Ae+M*g,X[M],"*"),d.setValue(I+M*g,E[f[M]],"*");if(A&&!N){let{handle:M,outputPreferredLocations:ue,outputPreferredLocationsEncoded:je}=A;
if(T.length!==B)throw new Error(`input count from feeds (${B}) is expected to be always equal to model's input count (${T.
length}).`);at("wasm bindInputsOutputs");for(let Z=0;Z<B;Z++){let fe=n[Z];await d._OrtBindInput(M,T[fe],W[Z])!==0&&z(`Ca\
n't bind input[${Z}] for session=${r}.`)}for(let Z=0;Z<O;Z++){let fe=f[Z];u[Z]?.[3]?(J.push(X[Z]),d._OrtBindOutput(M,E[fe],
X[Z],0)!==0&&z(`Can't bind pre-allocated output[${Z}] for session=${r}.`)):d._OrtBindOutput(M,E[fe],0,je[fe])!==0&&z(`Ca\
n't bind output[${Z}] to ${ue[Z]} for session=${r}.`)}ot("wasm bindInputsOutputs"),We.set(r,[v,T,E,A,L,!0])}d.jsepOnRunStart?.(
v),d.webnnOnRunStart?.(v);let b;A?b=await d._OrtRunWithBinding(v,A.handle,O,Ae,q):b=await d._OrtRun(v,Re,te,B,I,O,Ae,q),
b!==0&&z("failed to call OrtRun().");let ae=[],be=[];at("wasm ProcessOutputTensor");for(let M=0;M<O;M++){let ue=Number(d.
getValue(Ae+M*g,"*"));if(ue===X[M]||J.includes(X[M])){ae.push(u[M]),ue!==X[M]&&d._OrtReleaseTensor(ue)!==0&&z("Can't rel\
ease tensor.");continue}let je=d.stackSave(),Z=d.stackAlloc(4*g),fe=!1,re,K=0;try{d._OrtGetTensorData(ue,Z,Z+g,Z+2*g,Z+3*
g)!==0&&z(`Can't access output tensor data on index ${M}.`);let st=g===4?"i32":"i64",He=Number(d.getValue(Z,st));K=d.getValue(
Z+g,"*");let ut=d.getValue(Z+g*2,"*"),Pt=Number(d.getValue(Z+g*3,st)),ve=[];for(let ne=0;ne<Pt;ne++)ve.push(Number(d.getValue(
ut+ne*g,st)));d._OrtFree(ut)!==0&&z("Can't free memory for tensor dims.");let de=ve.reduce((ne,_)=>ne*_,1);re=Kt(He);let Te=A?.
outputPreferredLocations[f[M]];if(re==="string"){if(Te==="gpu-buffer"||Te==="ml-tensor")throw new Error("String tensor i\
s not supported on GPU.");let ne=[];for(let _=0;_<de;_++){let V=d.getValue(K+_*g,"*"),qe=d.getValue(K+(_+1)*g,"*"),ft=_===
de-1?void 0:qe-V;ne.push(d.UTF8ToString(V,ft))}ae.push([re,ve,ne,"cpu"])}else if(Te==="gpu-buffer"&&de>0){let ne=d.webgpuGetBuffer;
if(!ne)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let _=ne(K),V=yt(He,de);
if(V===void 0||!yn(re))throw new Error(`Unsupported data type: ${re}`);fe=!0;{d.webgpuRegisterBuffer(_,r,K);let qe=d.webgpuCreateDownloader(
_,V,r);ae.push([re,ve,{gpuBuffer:_,download:async()=>{let ft=await qe();return new(Mt(re))(ft)},dispose:()=>{d._OrtReleaseTensor(
ue)!==0&&z("Can't release tensor.")}},"gpu-buffer"])}}else if(Te==="ml-tensor"&&de>0){let ne=d.webnnEnsureTensor,_=d.webnnIsGraphInputOutputTypeSupported;
if(!ne||!_)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(yt(He,de)===void 0||
!bn(re))throw new Error(`Unsupported data type: ${re}`);if(!_(r,re,!1))throw new Error(`preferredLocation "ml-tensor" fo\
r ${re} output is not supported by current WebNN Context.`);let V=await ne(r,K,He,ve,!1);fe=!0,ae.push([re,ve,{mlTensor:V,
download:d.webnnCreateMLTensorDownloader(K,re),dispose:()=>{d.webnnReleaseTensorId(K),d._OrtReleaseTensor(ue)}},"ml-tens\
or"])}else if(Te==="ml-tensor-cpu-output"&&de>0){let ne=d.webnnCreateMLTensorDownloader(K,re)(),_=ae.length;fe=!0,be.push(
(async()=>{let V=[_,await ne];return d.webnnReleaseTensorId(K),d._OrtReleaseTensor(ue),V})()),ae.push([re,ve,[],"cpu"])}else{
let ne=Mt(re),_=new ne(de);new Uint8Array(_.buffer,_.byteOffset,_.byteLength).set(d.HEAPU8.subarray(K,K+_.byteLength)),ae.
push([re,ve,_,"cpu"])}}finally{d.stackRestore(je),re==="string"&&K&&d._free(K),fe||d._OrtReleaseTensor(ue)}}A&&!L&&(d._OrtClearBoundOutputs(
A.handle)!==0&&z("Can't clear bound outputs."),We.set(r,[v,T,E,A,L,!1]));for(let[M,ue]of await Promise.all(be))ae[M][2]=
ue;return ot("wasm ProcessOutputTensor"),ae}finally{d.webnnOnRunEnd?.(v),d.stackRestore(Q),i.forEach(b=>{b&&b[3]==="gpu-\
buffer"&&d.webgpuUnregisterBuffer(b[2].gpuBuffer)}),u.forEach(b=>{b&&b[3]==="gpu-buffer"&&d.webgpuUnregisterBuffer(b[2].
gpuBuffer)}),W.forEach(b=>d._OrtReleaseTensor(b)),X.forEach(b=>d._OrtReleaseTensor(b)),c.forEach(b=>d._free(b)),q!==0&&d.
_OrtReleaseRunOptions(q),U.forEach(b=>d._free(b));for(let b of w){let ae=Ke.get(b)-1;ae===0?Ke.delete(b):Ke.set(b,ae)}}},
Sn=r=>{let n=j(),i=We.get(r);if(!i)throw new Error("invalid session id");let f=i[0],u=n._OrtEndProfiling(f);u===0&&z("Ca\
n't get an profile file name."),n._OrtFree(u)},On=r=>{let n=[];for(let i of r){let f=i[2];!Array.isArray(f)&&"buffer"in f&&
n.push(f.buffer)}return n}}),Be,ye,wt,Bt,Lt,Qt,tn,Jt,et,tt,vi,us,fs,ls,cs,ds,ps,hs,ms,gs,In=G(()=>{"use strict";ze(),ss(),
it(),mn(),vn(),Be=()=>!!ee.wasm.proxy&&typeof document<"u",wt=!1,Bt=!1,Lt=!1,Jt=new Map,et=(r,n)=>{let i=Jt.get(r);i?i.push(
n):Jt.set(r,[n])},tt=()=>{if(wt||!Bt||Lt||!ye)throw new Error("worker not ready")},vi=r=>{switch(r.data.type){case"init-\
wasm":wt=!1,r.data.err?(Lt=!0,tn[1](r.data.err)):(Bt=!0,tn[0]()),Qt&&(URL.revokeObjectURL(Qt),Qt=void 0);break;case"init\
-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let n=Jt.get(r.data.type);r.data.err?n.shift()[1](
r.data.err):n.shift()[0](r.data.out);break}default:}},us=async()=>{if(!Bt){if(wt)throw new Error("multiple calls to 'ini\
tWasm()' detected.");if(Lt)throw new Error("previous call to 'initWasm()' failed.");if(wt=!0,Be())return new Promise((r,n)=>{
ye?.terminate(),Zi().then(([i,f])=>{try{ye=f,ye.onerror=p=>n(p),ye.onmessage=vi,tn=[r,n];let u={type:"init-wasm",in:ee};
!u.in.wasm.wasmPaths&&(i||an)&&(u.in.wasm.wasmPaths={wasm:new URL(""+new URL("ort-wasm-simd-threaded.asyncify-AkdHdxrx.w\
asm",import.meta.url).href,import.meta.url).href}),ye.postMessage(u),Qt=i}catch(u){n(u)}},n)});try{await gn(ee.wasm),await Tn(
ee),Bt=!0}catch(r){throw Lt=!0,r}finally{wt=!1}}},fs=async r=>{if(Be())return tt(),new Promise((n,i)=>{et("init-ep",[n,i]);
let f={type:"init-ep",in:{epName:r,env:ee}};ye.postMessage(f)});await xn(ee,r)},ls=async r=>Be()?(tt(),new Promise((n,i)=>{
et("copy-from",[n,i]);let f={type:"copy-from",in:{buffer:r}};ye.postMessage(f,[r.buffer])})):nr(r),cs=async(r,n)=>{if(Be()){
if(n?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return tt(),
new Promise((i,f)=>{et("create",[i,f]);let u={type:"create",in:{model:r,options:{...n}}},p=[];r instanceof Uint8Array&&p.
push(r.buffer),ye.postMessage(u,p)})}else return En(r,n)},ds=async r=>{if(Be())return tt(),new Promise((n,i)=>{et("relea\
se",[n,i]);let f={type:"release",in:r};ye.postMessage(f)});An(r)},ps=async r=>{if(Be())throw new Error("LoRA adapter is \
not supported for proxy.");let n=typeof r=="string"?await ar(r):r;return os(n)},hs=async r=>{if(Be())throw new Error("Lo\
RA adapter is not supported for proxy.");is(r)},ms=async(r,n,i,f,u,p,w)=>{if(Be()){if(w.length>0)throw new Error("LoRA a\
dapter is not supported for proxy.");if(i.some(d=>d[3]!=="cpu"))throw new Error("input tensor on GPU is not supported fo\
r proxy.");if(u.some(d=>d))throw new Error("pre-allocated output tensor is not supported for proxy.");return tt(),new Promise(
(d,g)=>{et("run",[d,g]);let x=i,v={type:"run",in:{sessionId:r,inputIndices:n,inputs:x,outputIndices:f,options:p}};ye.postMessage(
v,On(x))})}else return Cn(r,n,i,f,u,p,w)},gs=async r=>{if(Be())return tt(),new Promise((n,i)=>{et("end-profiling",[n,i]);
let f={type:"end-profiling",in:r};ye.postMessage(f)});Sn(r)}}),Bn,ws=G(()=>{"use strict";ze(),In(),Bn=class{async loadAdapter(r){
Fe(),this.adapterId=await ps(r),Ve()}async dispose(){return hs(this.adapterId)}}}),rn,Ti,ys,oc=G(()=>{"use strict";ze(),
ws(),In(),vt(),hn(),vn(),rn=(r,n)=>{switch(r.location){case"cpu":return[r.type,r.dims,r.data,"cpu"];case"gpu-buffer":return[
r.type,r.dims,{gpuBuffer:r.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[r.type,r.dims,{mlTensor:r.mlTensor},"ml-tenso\
r"];default:throw new Error(`invalid data location: ${r.location} for ${n()}`)}},Ti=r=>{switch(r[3]){case"cpu":return new Le(
r[0],r[2],r[1]);case"gpu-buffer":{let n=r[0];if(!yn(n))throw new Error(`not supported data type: ${n} for deserializing \
GPU tensor`);let{gpuBuffer:i,download:f,dispose:u}=r[2];return Le.fromGpuBuffer(i,{dataType:n,dims:r[1],download:f,dispose:u})}case"\
ml-tensor":{let n=r[0];if(!bn(n))throw new Error(`not supported data type: ${n} for deserializing MLTensor tensor`);let{
mlTensor:i,download:f,dispose:u}=r[2];return Le.fromMLTensor(i,{dataType:n,dims:r[1],download:f,dispose:u})}default:throw new Error(
`invalid data location: ${r[3]}`)}},ys=class{async fetchModelAndCopyToWasmMemory(r){return ls(await ar(r))}async loadModel(r,n){
Fe();let i;typeof r=="string"?i=await this.fetchModelAndCopyToWasmMemory(r):i=r,[this.sessionId,this.inputNames,this.outputNames,
this.inputMetadata,this.outputMetadata]=await cs(i,n),Ve()}async dispose(){return ds(this.sessionId)}async run(r,n,i,f=[]){
Fe();let u=f.map(A=>{if(!(A instanceof Bn))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return A.
adapterId}),p=[],w=[];Object.entries(r).forEach(A=>{let L=A[0],N=A[1],H=this.inputNames.indexOf(L);if(H===-1)throw new Error(
`invalid input '${L}'`);p.push(N),w.push(H)});let d=[],g=[];Object.entries(n).forEach(A=>{let L=A[0],N=A[1],H=this.outputNames.
indexOf(L);if(H===-1)throw new Error(`invalid output '${L}'`);d.push(N),g.push(H)});let x=p.map((A,L)=>rn(A,()=>`input "${this.
inputNames[w[L]]}"`)),v=d.map((A,L)=>A?rn(A,()=>`output "${this.outputNames[g[L]]}"`):null),T=await ms(this.sessionId,w,
x,g,v,i,u),E={};for(let A=0;A<T.length;A++)E[this.outputNames[g[A]]]=d[A]??Ti(T[A]);return Ve(),E}startProfiling(){}endProfiling(){
gs(this.sessionId)}}}),bs,ic=G(()=>{"use strict";bs=r=>{if(r?.epContextDataRead)throw new Error('session option "epConte\
xtDataRead" is not supported by ONNX Runtime Web')}}),vs={};Ut(vs,{OnnxruntimeWebAssemblyBackend:()=>un,initializeFlags:()=>sn,
wasmBackend:()=>Ts});var sn,un,Ts,sc=G(()=>{"use strict";ze(),ws(),In(),oc(),ic(),sn=()=>{(typeof ee.wasm.initTimeout!="\
number"||ee.wasm.initTimeout<0)&&(ee.wasm.initTimeout=0);let r=ee.wasm.simd;if(typeof r!="boolean"&&r!==void 0&&r!=="fix\
ed"&&r!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${r}". Reset it to \`false\` and igno\
re SIMD feature checking.`),ee.wasm.simd=!1),typeof ee.wasm.proxy!="boolean"&&(ee.wasm.proxy=!1),typeof ee.wasm.trace!="\
boolean"&&(ee.wasm.trace=!1),typeof ee.wasm.numThreads!="number"||!Number.isInteger(ee.wasm.numThreads)||ee.wasm.numThreads<=
0)if(typeof self<"u"&&!self.crossOriginIsolated)ee.wasm.numThreads=1;else{let n=typeof navigator>"u"?kl("node:os").cpus().
length:navigator.hardwareConcurrency;ee.wasm.numThreads=Math.min(4,Math.ceil((n||1)/2))}},un=class{async init(r){sn(),await us(),
await fs(r)}async createInferenceSessionHandler(r,n){bs(n);let i=new ys;return await i.loadModel(r,n),i}async createLoraAdapterHandler(r){
let n=new Bn;return await n.loadAdapter(r),n}},Ts=new un});ze();ze();ze();var uc="1.31.1",fc=Vi;{let r=(sc(),er(vs)).wasmBackend;
bt("webgpu",r,5),bt("webnn",r,5),bt("cpu",r,10),bt("wasm",r,10)}Object.defineProperty(ee.versions,"web",{value:uc,enumerable:!0});export{Wi as InferenceSession,Fi as LoraAdapter,nn as TRACE,at as TRACE_EVENT_BEGIN,ot as TRACE_EVENT_END,Fe as TRACE_FUNC_BEGIN,
Ve as TRACE_FUNC_END,Le as Tensor,fc as default,ee as env,bt as registerBackend};

/*!
 * ONNX Runtime Web v1.31.0-dev.20260914-8d85527a0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Ii=Object.defineProperty,N0=Object.getOwnPropertyDescriptor,D0=Object.getOwnPropertyNames,z0=Object.prototype.hasOwnProperty,
B0=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){
if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),
ge=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(s){throw r=[s],s}},dn=(e,t)=>{for(var r in t)Ii(e,r,{get:t[r],
enumerable:!0})},R0=(e,t,r,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of D0(t))!z0.call(e,n)&&n!==r&&
Ii(e,n,{get:()=>t[n],enumerable:!(s=N0(t,n))||s.enumerable});return e},oa=e=>R0(Ii({},"__esModule",{value:!0}),e),Qs,gr,
qr,Zh,z_,B_=ge(()=>{"use strict";Qs=new Map,gr=[],qr=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler==
"function"){let s=Qs.get(e);if(s===void 0)Qs.set(e,{backend:t,priority:r});else{if(s.priority>r)return;if(s.priority===r&&
s.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=gr.indexOf(e);n!==-1&&
gr.splice(n,1);for(let a=0;a<gr.length;a++)if(Qs.get(gr[a]).priority<=r){gr.splice(a,0,e);return}gr.push(e)}return}throw new TypeError(
"not a valid backend")},Zh=async e=>{let t=Qs.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;
if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.
initialized=!0,t.backend}catch(s){return r||(t.error=`${s}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},z_=async e=>{
let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),s=r.length===0?gr:r,n,a=[],o=new Set;for(let l of s){
let c=await Zh(l);typeof c=="string"?a.push({name:l,err:c}):(n||(n=c),n===c&&o.add(l))}if(!n)throw new Error(`no availab\
le backend found. ERR: ${a.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:c}of a)r.includes(l)&&console.
warn(`removing requested execution provider "${l}" from session options because it is not available: ${c}`);let i=t.filter(
l=>o.has(typeof l=="string"?l:l.name));return[n,new Proxy(e,{get:(l,c)=>c==="executionProviders"?i:Reflect.get(l,c)})]}}),
$0=ge(()=>{"use strict";B_()}),R_,G0=ge(()=>{"use strict";R_="1.31.0-dev.20260911-2a43ec07e"}),Po,Je,$_=ge(()=>{"use str\
ict";G0(),Po="warning",Je={wasm:{},webgl:{},webgpu:{},versions:{common:R_},set logLevel(e){if(e!==void 0){if(typeof e!="\
string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);
Po=e}},get logLevel(){return Po}},Object.defineProperty(Je,"logLevel",{enumerable:!0})}),ze,V0=ge(()=>{"use strict";$_(),
ze=Je}),G_,V_,U0=ge(()=>{"use strict";G_=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(
1,1);r.width=e.dims[3],r.height=e.dims[2];let s=r.getContext("2d");if(s!=null){let n,a;t?.tensorLayout!==void 0&&t.tensorLayout===
"NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);let o=t?.format!==void 0?t.format:"RGB",i=t?.norm,l,c;i===void 0||
i.mean===void 0?l=[255,255,255,255]:typeof i.mean=="number"?l=[i.mean,i.mean,i.mean,i.mean]:(l=[i.mean[0],i.mean[1],i.mean[2],
0],i.mean[3]!==void 0&&(l[3]=i.mean[3])),i===void 0||i.bias===void 0?c=[0,0,0,0]:typeof i.bias=="number"?c=[i.bias,i.bias,
i.bias,i.bias]:(c=[i.bias[0],i.bias[1],i.bias[2],0],i.bias[3]!==void 0&&(c[3]=i.bias[3]));let d=a*n,h=0,_=d,p=d*2,w=-1;o===
"RGBA"?(h=0,_=d,p=d*2,w=d*3):o==="RGB"?(h=0,_=d,p=d*2):o==="RBG"&&(h=0,p=d,_=d*2);for(let v=0;v<a;v++)for(let y=0;y<n;y++){
let b=(e.data[h++]-c[0])*l[0],k=(e.data[_++]-c[1])*l[1],A=(e.data[p++]-c[2])*l[2],E=w===-1?255:(e.data[w++]-c[3])*l[3];s.
fillStyle="rgba("+b+","+k+","+A+","+E+")",s.fillRect(y,v,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("t\
oDataURL is not supported")}else throw new Error("Can not access image data")},V_=(e,t)=>{let r=typeof document<"u"?document.
createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),s;if(r!=null){let n,a,o;t?.tensorLayout!==
void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],o=e.dims[3]):(n=e.dims[3],a=e.dims[2],o=e.dims[1]);let i=t!==void 0&&
t.format!==void 0?t.format:"RGB",l=t?.norm,c,d;l===void 0||l.mean===void 0?c=[255,255,255,255]:typeof l.mean=="number"?c=
[l.mean,l.mean,l.mean,l.mean]:(c=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(c[3]=l.mean[3])),l===void 0||l.
bias===void 0?d=[0,0,0,0]:typeof l.bias=="number"?d=[l.bias,l.bias,l.bias,l.bias]:(d=[l.bias[0],l.bias[1],l.bias[2],0],l.
bias[3]!==void 0&&(d[3]=l.bias[3]));let h=a*n;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!=="RGBA"||o===3&&t.format!==
"RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let _=4,p=0,w=1,v=2,y=3,b=0,k=h,
A=h*2,E=-1;i==="RGBA"?(b=0,k=h,A=h*2,E=h*3):i==="RGB"?(b=0,k=h,A=h*2):i==="RBG"&&(b=0,A=h,k=h*2),s=r.createImageData(n,a);
for(let C=0;C<a*n;p+=_,w+=_,v+=_,y+=_,C++)s.data[p]=(e.data[b++]-d[0])*c[0],s.data[w]=(e.data[k++]-d[1])*c[1],s.data[v]=
(e.data[A++]-d[2])*c[2],s.data[y]=E===-1?255:(e.data[E++]-d[3])*c[3]}else throw new Error("Can not access image data");return s}}),
Un,U_,j_,q_,W_,H_,j0=ge(()=>{"use strict";Li(),Un=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");
if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NH\
WC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:s}=t,n=t.norm??{mean:255,bias:0},a,o;typeof n.
mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?
o=[n.bias,n.bias,n.bias,n.bias]:o=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let i=t.format!==void 0?t.format:"RGBA",l=t.
tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",c=r*s,d=l==="RGBA"?new Float32Array(c*4):new Float32Array(
c*3),h=4,_=0,p=1,w=2,v=3,y=0,b=c,k=c*2,A=-1;i==="RGB"&&(h=3,_=0,p=1,w=2,v=-1),l==="RGBA"?A=c*3:l==="RBG"?(y=0,k=c,b=c*2):
l==="BGR"&&(k=0,b=c,y=c*2);for(let E=0;E<c;E++,_+=h,w+=h,p+=h,v+=h)d[y++]=(e[_]+o[0])/a[0],d[b++]=(e[p]+o[1])/a[1],d[k++]=
(e[w]+o[2])/a[2],A!==-1&&v!==-1&&(d[A++]=(e[v]+o[3])/a[3]);return l==="RGBA"?new yt("float32",d,[1,4,r,s]):new yt("float\
32",d,[1,3,r,s])},U_=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,s=typeof ImageData<"u"&&
e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",o,i=t??{},l=()=>{if(typeof document<
"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error(
"Canvas is not supported")},c=d=>typeof HTMLCanvasElement<"u"&&d instanceof HTMLCanvasElement||d instanceof OffscreenCanvas?
d.getContext("2d"):null;if(r){let d=l();d.width=e.width,d.height=e.height;let h=c(d);if(h!=null){let _=e.height,p=e.width;
if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(_=t.resizedHeight,p=t.resizedWidth),t!==void 0){if(i=
t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");i.tensorFormat=
"RGBA",i.height=_,i.width=p}else i.tensorFormat="RGBA",i.height=_,i.width=p;h.drawImage(e,0,0),o=h.getImageData(0,0,p,_).
data}else throw new Error("Can not access image data")}else if(s){let d,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==
void 0?(d=t.resizedHeight,h=t.resizedWidth):(d=e.height,h=e.width),t!==void 0&&(i=t),i.format="RGBA",i.height=d,i.width=
h,t!==void 0){let _=l();_.width=h,_.height=d;let p=c(_);if(p!=null)p.putImageData(e,0,0),o=p.getImageData(0,0,h,d).data;else
throw new Error("Can not access image data")}else o=e.data}else if(n){if(t===void 0)throw new Error("Please provide imag\
e config with format for Imagebitmap");let d=l();d.width=e.width,d.height=e.height;let h=c(d);if(h!=null){let _=e.height,
p=e.width;return h.drawImage(e,0,0,p,_),o=h.getImageData(0,0,p,_).data,i.height=_,i.width=p,Un(o,i)}else throw new Error(
"Can not access image data")}else{if(a)return new Promise((d,h)=>{let _=l(),p=c(_);if(!e||!p)return h();let w=new Image;
w.crossOrigin="Anonymous",w.src=e,w.onload=()=>{_.width=w.width,_.height=w.height,p.drawImage(w,0,0,_.width,_.height);let v=p.
getImageData(0,0,_.width,_.height);i.height=_.height,i.width=_.width,d(Un(v.data,i))}});throw new Error("Input data prov\
ided is not supported - aborted tensor creation")}if(o!==void 0)return Un(o,i);throw new Error("Input data provided is n\
ot supported - aborted tensor creation")},j_=(e,t)=>{let{width:r,height:s,download:n,dispose:a}=t,o=[1,s,r,4];return new yt(
{location:"texture",type:"float32",texture:e,dims:o,download:n,dispose:a})},q_=(e,t)=>{let{dataType:r,dims:s,download:n,
dispose:a}=t;return new yt({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:s,download:n,dispose:a})},W_=(e,t)=>{
let{dataType:r,dims:s,download:n,dispose:a}=t;return new yt({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:s,download:n,
dispose:a})},H_=(e,t,r)=>new yt({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Vr,Zs,Fo,Q_,q0=ge(()=>{"use \
strict";Vr=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],
["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),
Zs=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],
[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Fo=!1,Q_=()=>{if(!Fo){Fo=!0;let e=typeof BigInt64Array<
"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,s=typeof r<"u"&&r.from;
e&&(Vr.set("int64",BigInt64Array),Zs.set(BigInt64Array,"int64")),t&&(Vr.set("uint64",BigUint64Array),Zs.set(BigUint64Array,
"uint64")),s?(Vr.set("float16",r),Zs.set(r,"float16")):Vr.set("float16",Uint16Array)}}}),X_,Y_,W0=ge(()=>{"use strict";Li(),
X_=e=>{let t=1;for(let r=0;r<e.length;r++){let s=e[r];if(typeof s!="number"||!Number.isSafeInteger(s))throw new TypeError(
`dims[${r}] must be an integer, got: ${s}`);if(s<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got:\
 ${s}`);t*=s}return t},Y_=(e,t)=>{switch(e.location){case"cpu":return new yt(e.type,e.data,t);case"cpu-pinned":return new yt(
{location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new yt({location:"texture",texture:e.texture,
type:e.type,dims:t});case"gpu-buffer":return new yt({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"\
ml-tensor":return new yt({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorR\
eshape: tensor location ${e.location} is not supported`)}}}),yt,Li=ge(()=>{"use strict";U0(),j0(),q0(),W0(),yt=class{constructor(e,t,r){
Q_();let s,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,s=e.type,n=e.dims,e.location){case"\
cpu-pinned":{let o=Vr.get(s);if(!o)throw new TypeError(`unsupported type "${s}" to create tensor from pinned buffer`);if(!(e.
data instanceof o))throw new TypeError(`buffer should be of type ${o.name}`);this.cpuData=e.data;break}case"texture":{if(s!==
"float32")throw new TypeError(`unsupported type "${s}" to create tensor from texture`);this.gpuTextureData=e.texture,this.
downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(s!=="float32"&&s!=="float16"&&s!=="int32"&&s!==
"int64"&&s!=="uint32"&&s!=="uint8"&&s!=="bool"&&s!=="uint4"&&s!=="int4")throw new TypeError(`unsupported type "${s}" to \
create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"\
ml-tensor":{if(s!=="float32"&&s!=="float16"&&s!=="int32"&&s!=="int64"&&s!=="uint32"&&s!=="uint64"&&s!=="int8"&&s!=="uint\
8"&&s!=="bool"&&s!=="uint4"&&s!=="int4")throw new TypeError(`unsupported type "${s}" to create tensor from MLTensor`);this.
mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constru\
ctor: unsupported location '${this.dataLocation}'`)}else{let o,i;if(typeof e=="string")if(s=e,i=r,e==="string"){if(!Array.
isArray(t))throw new TypeError("A string tensor's data must be a string array.");o=t}else{let l=Vr.get(e);if(l===void 0)
throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||
e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);
e==="uint64"||e==="int64"?o=l.from(t,BigInt):o=l.from(t)}else if(t instanceof l)o=t;else if(t instanceof Uint8ClampedArray)
if(e==="uint8")o=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e===
"float16"&&t instanceof Uint16Array&&l!==Uint16Array)o=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(
`A ${s} tensor's data must be type of ${l}`)}else if(i=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor t\
ype cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")s="string",o=e;else if(l==="boolean")s="\
bool",o=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)
s="uint8",o=Uint8Array.from(e);else{let l=Zs.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for \
tensor data: ${e.constructor}.`);s=l,o=e}if(i===void 0)i=[o.length];else if(!Array.isArray(i))throw new TypeError("A ten\
sor's dims must be a number array");n=i,this.cpuData=o,this.dataLocation="cpu"}let a=X_(n);if(this.cpuData&&a!==this.cpuData.
length&&!((s==="uint4"||s==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not\
 match data length(${this.cpuData.length}).`);this.type=s,this.dims=n,this.size=a}static async fromImage(e,t){return U_(
e,t)}static fromTexture(e,t){return j_(e,t)}static fromGpuBuffer(e,t){return q_(e,t)}static fromMLTensor(e,t){return W_(
e,t)}static fromPinnedBuffer(e,t,r){return H_(e,t,r)}toDataURL(e){return G_(this,e)}toImageData(e){return V_(this,e)}get data(){
if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU\
, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.
dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL\
 texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The da\
ta is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)
throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),
this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.
downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)
throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.
downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{
this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.
isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),
this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,
this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tens\
or is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tens\
or that owns GPU resource.");return Y_(this,e)}}}),Lt,K_=ge(()=>{"use strict";Li(),Lt=yt}),ia,Io,Hr,Qr,Er,Ar,J_=ge(()=>{
"use strict";$_(),ia=(e,t)=>{(typeof Je.trace>"u"?!Je.wasm.trace:!Je.trace)||console.timeStamp(`${e}::ORT::${t}`)},Io=(e,t)=>{
let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],s=!1;for(let n=0;n<r.length;n++){if(s&&!r[n].includes("TRACE_FUNC")){let a=`\
FUNC_${e}::${r[n].trim().split(" ")[1]}`;t&&(a+=`::${t}`),ia("CPU",a);return}r[n].includes("TRACE_FUNC")&&(s=!0)}},Hr=e=>{
(typeof Je.trace>"u"?!Je.wasm.trace:!Je.trace)||Io("BEGIN",e)},Qr=e=>{(typeof Je.trace>"u"?!Je.wasm.trace:!Je.trace)||Io(
"END",e)},Er=e=>{(typeof Je.trace>"u"?!Je.wasm.trace:!Je.trace)||console.time(`ORT::${e}`)},Ar=e=>{(typeof Je.trace>"u"?
!Je.wasm.trace:!Je.trace)||console.timeEnd(`ORT::${e}`)}}),Z_,H0=ge(()=>{"use strict";B_(),K_(),J_(),Z_=class ep{constructor(t){
this.handler=t}async run(t,r,s){Hr(),Er("InferenceSession.run");let n={},a={};if(typeof t!="object"||t===null||t instanceof
Lt||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corres\
ponding values.");let o=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be nul\
l.");if(r instanceof Lt)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError(
"'fetches' cannot be an empty array.");o=!1;for(let c of r){if(typeof c!="string")throw new TypeError("'fetches' must be\
 a string array or an object.");if(this.outputNames.indexOf(c)===-1)throw new RangeError(`'fetches' contains invalid out\
put name: ${c}.`);n[c]=null}if(typeof s=="object"&&s!==null)a=s;else if(typeof s<"u")throw new TypeError("'options' must\
 be an object.")}else{let c=!1,d=Object.getOwnPropertyNames(r);for(let h of this.outputNames)if(d.indexOf(h)!==-1){let _=r[h];
(_===null||_ instanceof Lt)&&(c=!0,o=!1,n[h]=_)}if(c){if(typeof s=="object"&&s!==null)a=s;else if(typeof s<"u")throw new TypeError(
"'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fet\
ches' or 'options'.");for(let c of this.inputNames)if(typeof t[c]>"u")throw new Error(`input '${c}' is missing in 'feeds\
'.`);if(o)for(let c of this.outputNames)n[c]=null;let i=await this.handler.run(t,n,a),l={};for(let c in i)if(Object.hasOwnProperty.
call(i,c)){let d=i[c];d instanceof Lt?l[c]=d:l[c]=new Lt(d.type,d.data,d.dims)}return Ar("InferenceSession.run"),Qr(),l}async release(){
return this.handler.dispose()}static async create(t,r,s,n){Hr(),Er("InferenceSession.create");let a,o={};if(typeof t=="s\
tring"){if(a=t,typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof
Uint8Array){if(a=t,typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an objec\
t.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let d=t,h=0,_=t.byteLength;
if(typeof r=="object"&&r!==null)o=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'b\
yteOffset' must be an integer.");if(h<0||h>=d.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${d.byteLength}\
).`);if(_=t.byteLength-h,typeof s=="number"){if(_=s,!Number.isSafeInteger(_))throw new RangeError("'byteLength' must be \
an integer.");if(_<=0||h+_>d.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${d.byteLength-h}].`);if(typeof n==
"object"&&n!==null)o=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof s<"u")throw new TypeError(
"'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(
d,h,_)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[i,l]=await z_(o),c=await i.createInferenceSessionHandler(
a,l);return Ar("InferenceSession.create"),Qr(),new ep(c)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.
handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){
return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Oi,Q0=ge(()=>{"use strict";
H0(),Oi=Z_}),X0=ge(()=>{"use strict"}),Y0=ge(()=>{"use strict"}),K0=ge(()=>{"use strict"}),J0=ge(()=>{"use strict"}),tp={};
dn(tp,{InferenceSession:()=>Oi,TRACE:()=>ia,TRACE_EVENT_BEGIN:()=>Er,TRACE_EVENT_END:()=>Ar,TRACE_FUNC_BEGIN:()=>Hr,TRACE_FUNC_END:()=>Qr,
Tensor:()=>Lt,env:()=>ze,registerBackend:()=>qr});var Xr=ge(()=>{"use strict";$0(),V0(),Q0(),K_(),X0(),Y0(),J_(),K0(),J0()}),
Ni=ge(()=>{"use strict"}),rp={};dn(rp,{default:()=>sp});var Lo,Oo,sp,Z0=ge(()=>{"use strict";wp(),Yr(),Di(),Lo="ort-wasm\
-proxy-worker",Oo=globalThis.self?.name===Lo,Oo&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-was\
m":zi(r.wasm).then(()=>{Vi(r).then(()=>{postMessage({type:t})},s=>{postMessage({type:t,err:s})})},s=>{postMessage({type:t,
err:s})});break;case"init-ep":{let{epName:s,env:n}=r;Ui(n,s).then(()=>{postMessage({type:t})},a=>{postMessage({type:t,err:a})});
break}case"copy-from":{let{buffer:s}=r,n=ua(s);postMessage({type:t,out:n});break}case"create":{let{model:s,options:n}=r;
ji(s,n).then(a=>{postMessage({type:t,out:a})},a=>{postMessage({type:t,err:a})});break}case"release":qi(r),postMessage({type:t});
break;case"run":{let{sessionId:s,inputIndices:n,inputs:a,outputIndices:o,options:i}=r;Wi(s,n,a,o,new Array(o.length).fill(
null),i).then(l=>{l.some(c=>c[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage(
{type:t,out:l},Qi([...a,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":Hi(r),postMessage({type:t});
break;default:}}catch(s){postMessage({type:t,err:s})}}),sp=Oo?null:e=>new Worker(e??gt,{type:"module",name:Lo})}),np={};
dn(np,{default:()=>ap});async function ef(e={}){var t=e,r=!!globalThis.window,s=!!globalThis.WorkerGlobalScope,n=s&&self.
name?.startsWith("em-pthread");t.mountExternalData=(u,f)=>{u.startsWith("./")&&(u=u.substring(2)),(t.ed||(t.ed=new Map)).
set(u,f)},t.unmountExternalData=()=>{delete t.ed,delete t.Te,delete t.Se,delete t.Ue},globalThis.SharedArrayBuffer??new WebAssembly.
Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let a=()=>{let u=f=>(...m)=>{let g=Ht;return m=f(...m),Ht!=g?
new Promise((x,T)=>{uo={resolve:x,reject:T}}):m};(()=>{for(let f of["_OrtAppendExecutionProvider","_OrtCreateSession","_\
OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[f]=u(t[f])})(),typeof jsepRunAsync<"u"&&(t._OrtRun=jsepRunAsync(t._OrtRun),
t._OrtRunWithBinding=jsepRunAsync(t._OrtRunWithBinding)),a=void 0};t.asyncInit=()=>{a?.()};var o,i,l=(u,f)=>{throw f},c=import.meta.
url,d="";if(r||s){try{d=new URL(".",c).href}catch{}s&&(i=u=>{var f=new XMLHttpRequest;return f.open("GET",u,!1),f.responseType=
"arraybuffer",f.send(null),new Uint8Array(f.response)}),o=async u=>{if(N(u))return new Promise((m,g)=>{var x=new XMLHttpRequest;
x.open("GET",u,!0),x.responseType="arraybuffer",x.onload=()=>{x.status==200||x.status==0&&x.response?m(x.response):g(x.status)},
x.onerror=g,x.send(null)});var f=await fetch(u,{credentials:"same-origin"});if(f.ok)return f.arrayBuffer();throw Error(f.
status+" : "+f.url)}}var h,_,p,w,v,y,b=console.log.bind(console),k=console.error.bind(console),A=b,E=k,C=!1,N=u=>u.startsWith(
"file://");function M(){pr.buffer!=R.buffer&&O()}if(n){let u=function(f){try{var m=f.data,g=m.$c;if(g==="load"){let x=[];
self.onmessage=T=>x.push(T),y=()=>{postMessage({$c:"loaded"});for(let T of x)u(T);self.onmessage=u};for(let T of m.ue)t[T]&&
!t[T].proxy||(t[T]=(...P)=>{postMessage({$c:"callHandler",te:T,args:P})},T=="print"&&(A=t[T]),T=="printErr"&&(E=t[T]));pr=
m.Me,O(),_=m.Ne,qe(),Vn()}else if(g==="run"){(function(x){var T=(M(),I)[x+52>>>2>>>0];x=(M(),I)[x+56>>>2>>>0],ih(T,T-x),
ee(T)})(m.Xc),xo(m.Xc,0,0,1,0,0),Gu(),io(m.Xc),$||(Vd(),$=!0);try{Ev(m.ze,m.kd)}catch(x){if(x!="unwind")throw x}}else m.
target!=="setimmediate"&&(g==="checkMailbox"?$&&In():g&&(E(`worker: received unknown command ${g}`),E(m)))}catch(x){throw rh(),
x}};var $=!1;self.onunhandledrejection=f=>{throw f.reason||f},self.onmessage=u}var R,j,Y,Q,z,I,U,X,ce,Z,se,L=!1;function O(){
var u=pr.buffer;t.HEAP8=R=new Int8Array(u),Y=new Int16Array(u),t.HEAPU8=j=new Uint8Array(u),Q=new Uint16Array(u),t.HEAP32=
z=new Int32Array(u),t.HEAPU32=I=new Uint32Array(u),U=new Float32Array(u),X=new Float64Array(u),ce=new BigInt64Array(u),Z=
new BigUint64Array(u)}function V(){L=!0,n?y():ir.hc()}function ne(u){throw E(u="Aborted("+u+")"),C=!0,u=new WebAssembly.
RuntimeError(u+". Build with -sASSERTIONS for more info."),v?.(u),u}function ae(){return{a:{qa:Qb,f:Av,K:Cv,k:Sv,p:Pv,l:Fv,
fa:Iv,b:Lv,da:Ov,gc:Hu,q:Nv,ea:Ku,Ua:Ju,cc:Zu,ec:ed,Va:td,Sa:rd,La:sd,Ra:nd,oa:ad,dc:od,ac:id,Ta:ld,bc:cd,_a:Dv,Ba:zv,Xb:Bv,
Vb:$v,Aa:Vv,O:Uv,J:jv,Wb:qv,ka:Jv,Yb:Zv,Oa:ey,_b:ry,Ea:sy,Tb:ny,Ca:ay,Na:io,Xa:oy,U:uy,n:py,c:ao,qb:my,w:gy,N:wy,A:vy,j:yy,
o:gd,rb:by,H:My,T:xy,g:ky,u:Ty,m:Ey,i:Ay,Ia:Cy,Ja:Sy,Ka:Py,Ga:bd,Ha:Md,Ub:xd,ab:Iy,Za:Oy,Z:Ny,pb:Dy,Da:zy,Ya:Ly,X:By,Wa:Ry,
$b:$y,G:Fy,db:Gy,_:Vy,pa:zn,Zb:jy,cb:Uy,bb:qy,lb:nb,z:ab,sa:ob,ra:ib,nb:lb,Y:cb,v:ub,kb:db,jb:hb,ib:fb,mb:_b,gb:pb,fb:mb,
eb:gb,Pa:Od,Qa:Nd,fc:ts,W:Dd,Fa:zd,ma:Bd,Ma:Rd,la:$d,Fb:I0,va:E0,Gb:F0,wa:T0,E:h0,e:Jb,r:Yb,x:Xb,C:l0,Ib:M0,ca:b0,D:t0,xa:x0,
aa:A0,ha:y0,Jb:v0,Kb:w0,za:_0,Lb:m0,ya:g0,Mb:p0,ua:P0,ba:k0,d:Kb,B:e0,s:Zb,Eb:L0,t:s0,y:u0,F:r0,I:n0,L:d0,Nb:f0,R:C0,ia:i0,
$:S0,Pb:o0,Rb:a0,Ob:c0,h:vb,a:pr,$a:es,Hb:yb,V:bb,M:Mb,na:xb,Db:kb,ja:Tb,S:Eb,Ab,Bb:Cb,vb:Sb,wb:Pb,P:Fb,xb:Ib,yb:Lb,ta:Ob,
Sb:Nb,ob:Db,Q:zb,hb:Bb,Cb:Rb,sb:$b,tb:Vb,ub:Ub,ga:jb,zb:qb,Qb:Wb}}}async function qe(){function u(g,x){var T=ir=g.exports;
g={};for(let[P,S]of Object.entries(T))typeof S=="function"?(T=iy(S),g[P]=T):g[P]=S;return ir=g,ir=(function(){var P=ir,S=q=>H=>q(
H)>>>0,D=q=>()=>q()>>>0;return(P=Object.assign({},P)).ic=S(P.ic),P.Nc=D(P.Nc),P.Pc=S(P.Pc),P.Bd=(q=>(H,re)=>q(H,re)>>>0)(
P.Bd),P.Gd=S(P.Gd),P.Hd=D(P.Hd),P.Ld=S(P.Ld),P})(),Ru.push(ir.sd),Gd=(g=ir).ic,Vd=g.jc,t._OrtInit=g.kc,t._OrtGetLastError=
g.lc,t._OrtCreateSessionOptions=g.mc,t._OrtAppendExecutionProvider=g.nc,t._OrtAddFreeDimensionOverride=g.oc,t._OrtAddSessionConfigEntry=
g.pc,t._OrtReleaseSessionOptions=g.qc,t._OrtCreateSession=g.rc,t._OrtReleaseSession=g.sc,t._OrtGetInputOutputCount=g.tc,
t._OrtGetInputOutputMetadata=g.uc,t._OrtFree=g.vc,t._OrtCreateTensor=g.wc,t._OrtGetTensorData=g.xc,t._OrtReleaseTensor=g.
yc,t._OrtCreateRunOptions=g.zc,t._OrtAddRunConfigEntry=g.Ac,t._OrtReleaseRunOptions=g.Bc,t._OrtCreateBinding=g.Cc,t._OrtBindInput=
g.Dc,t._OrtBindOutput=g.Ec,t._OrtClearBoundOutputs=g.Fc,t._OrtReleaseBinding=g.Gc,t._OrtRunWithBinding=g.Hc,t._OrtRun=g.
Ic,t._OrtEndProfiling=g.Jc,Ud=t._OrtCreateWebGpuInstance=g.Kc,t._wgpuCreateInstance=g.Lc,go=t._OrtGetWebGpuDevice=g.Mc,$n=
g.Nc,kt=t._free=g.Oc,Nr=t._malloc=g.Pc,jd=t._wgpuBufferRelease=g.Qc,qd=g.Rc,Wd=g.Sc,Hd=g.Tc,Qd=g.Uc,Xd=g.Vc,Yd=g.Yc,Kd=g.
Zc,Jd=g.hd,Zd=g.id,eh=g.jd,wo=g.ld,vo=g.md,yo=g.nd,bo=g.od,qs=g.pd,Mo=g.qd,th=g.rd,xo=g.ud,rh=g.vd,sh=g.wd,nh=g.xd,ko=g.
yd,ah=g.zd,oh=g.Ad,To=g.Bd,_e=g.Cd,Ws=g.Dd,ih=g.Ed,ee=g.Fd,Gn=g.Gd,te=g.Hd,lh=g.Id,Eo=g.Jd,ch=g.Kd,uh=g.Ld,dh=g.Md,Ao=g.
Nd,hh=g.Od,fh=g.Pd,_h=g.Qd,ph=g.Rd,mh=g.Sd,gh=g.Td,wh=g.Ud,vh=g.Vd,yh=g.Wd,bh=g.Xd,Mh=g.Yd,xh=g.Zd,kh=g._d,Th=g.$d,Eh=g.
ae,Ah=g.be,Ch=g.ce,Sh=g.de,Ph=g.fe,Fh=g.ge,Ih=g.he,Lh=g.ie,Oh=g.je,Nh=g.ke,Dh=g.le,zh=g.me,Bh=g.Ae,Rh=g.Be,$h=g.Ce,Gh=g.
De,Vh=g.Ee,Uh=g.Fe,jh=g.Ge,qh=g.He,Wh=g.Ie,Hh=g.Je,Qh=g.Ke,Xh=g.nf,Yh=g.of,Kh=g.pf,Jh=g.qf,_=x,ir}var f,m=ae();return t.
instantiateWasm?new Promise(g=>{t.instantiateWasm(m,(x,T)=>{g(u(x,T))})}):n?u(new WebAssembly.Instance(_,ae()),_):(se??=
t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.asyncify.wasm",d):d+"ort-wasm-simd-threaded.asyncify.wasm":
new URL("/peercompute/assets/runtime/ort-wasm-simd-threaded.asyncify-CxOG5pUO.wasm",import.meta.url).href,f=await(async function(g){
var x=se;if(!h&&!N(x))try{var T=fetch(x,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(T,g)}catch(P){
E(`wasm streaming compile failed: ${P}`),E("falling back to ArrayBuffer instantiation")}return(async function(P,S){try{var D=await(async function(q){
if(!h)try{var H=await o(q);return new Uint8Array(H)}catch{}if(q==se&&h)q=new Uint8Array(h);else{if(!i)throw"both async a\
nd sync fetching of the wasm failed";q=i(q)}return q})(P);return await WebAssembly.instantiate(D,S)}catch(q){E(`failed t\
o asynchronously prepare wasm: ${q}`),ne(q)}})(x,g)})(m),u(f.instance,f.module))}class Ee{name="ExitStatus";constructor(f){
this.message=`Program terminated with exit(${f})`,this.status=f}}var Ae=u=>{u.terminate(),u.onmessage=()=>{}},$e=[],Fe=0,
ye=null,it=u=>{_r.length==0&&(Uu(),Vu(_r[0]));var f=_r.pop();if(!f)return 6;Us.push(f),Ir[u.Xc]=f,f.Xc=u.Xc;var m={$c:"r\
un",ze:u.ye,kd:u.kd,Xc:u.Xc};return f.postMessage(m,u.oe),0},be=0,Me=(u,f,...m)=>{var g,x=16*m.length,T=te(),P=Gn(x),S=P>>>
3;for(g of m)typeof g=="bigint"?((M(),ce)[S++>>>0]=1n,(M(),ce)[S++>>>0]=g):((M(),ce)[S++>>>0]=0n,(M(),X)[S++>>>0]=g);return u=
sh(u,0,x,P,f),ee(T),u};function es(u){if(n)return Me(0,1,u);if(p=u,!(0<be)){for(var f of Us)Ae(f);for(f of _r)Ae(f);_r=[],
Us=[],Ir={},C=!0}l(0,new Ee(u))}function Vs(u){if(n)return Me(1,0,u);ts(u)}var ts=u=>{if(p=u,n)throw Vs(u),"unwind";es(u)},
_r=[],Us=[],Ru=[],Ir={},$u=u=>{var f=u.Xc;delete Ir[f],_r.push(u),Us.splice(Us.indexOf(u),1),u.Xc=0,nh(f)};function Gu(){
Ru.forEach(u=>u())}var Vu=u=>new Promise(f=>{u.onmessage=x=>{var T=x.data;if(x=T.$c,T.gd&&T.gd!=$n()){var P=Ir[T.gd];P?P.
postMessage(T,T.oe):E(`Internal error! Worker sent a message "${x}" to target pthread ${T.gd}, but that thread no longer\
 exists!`)}else x==="checkMailbox"?In():x==="spawnThread"?it(T):x==="cleanupThread"?dt(()=>{$u(Ir[T.Le])}):x==="loaded"?
(u.loaded=!0,f(u)):T.target==="setimmediate"?u.postMessage(T):x==="uncaughtException"?u.onerror(T.error):x==="callHandle\
r"?t[T.te](...T.args):x&&E(`worker sent an unknown command ${x}`)},u.onerror=x=>{throw E(`worker sent an error! ${x.filename}\
:${x.lineno}: ${x.message}`),x};var m,g=[];for(m of[])t.propertyIsEnumerable(m)&&g.push(m);u.postMessage({$c:"load",ue:g,
Me:pr,Ne:_})});function Uu(){var u=new Worker((()=>{let f=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new f(
"ort.webgpu.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"e\
m-pthread"});_r.push(u)}var pr,Ev=(u,f)=>{be=0,u=Ao(u,f),0<be?p=u:ko(u)},Pn=[],Fn=0,et=u=>-9007199254740992>u||9007199254740992<
u?NaN:Number(u);function Av(u){var f=new to(u>>>=0);return(M(),R)[f.ad+12>>>0]==0&&(ju(f,!0),Fn--),qu(f,!1),Pn.push(f),uh(
u)}var rs=0,Cv=()=>{_e(0,0);var u=Pn.pop();lh(u.td),rs=0};function ju(u,f){f=f?1:0,(M(),R)[u.ad+12>>>0]=f}function qu(u,f){
f=f?1:0,(M(),R)[u.ad+13>>>0]=f}class to{constructor(f){this.td=f,this.ad=f-24}}var ro=u=>{var f=rs;if(!f)return Ws(0),0;
var m=new to(f);(M(),I)[m.ad+16>>>2>>>0]=f;var g=(M(),I)[m.ad+4>>>2>>>0];if(!g)return Ws(0),f;for(var x of u){if(x===0||
x===g)break;if(ch(x,g,m.ad+16))return Ws(x),f}return Ws(g),f};function Sv(){return ro([])}function Pv(u){return ro([u>>>
0])}function Fv(u,f,m,g){return ro([u>>>0,f>>>0,m>>>0,g>>>0])}var Iv=()=>{var u=Pn.pop();u||ne("no exception to throw");
var f=u.td;throw(M(),R)[u.ad+13>>>0]==0&&(Pn.push(u),qu(u,!0),ju(u,!1),Fn++),Eo(f),rs=f};function Lv(u,f,m){var g=new to(
u>>>=0);throw f>>>=0,m>>>=0,(M(),I)[g.ad+16>>>2>>>0]=0,(M(),I)[g.ad+4>>>2>>>0]=f,(M(),I)[g.ad+8>>>2>>>0]=m,Eo(u),Fn++,rs=
u}var Ov=()=>Fn;function Wu(u,f,m,g){return n?Me(2,1,u,f,m,g):Hu(u,f,m,g)}function Hu(u,f,m,g){if(u>>>=0,f>>>=0,m>>>=0,g>>>=
0,!globalThis.SharedArrayBuffer)return 6;var x=[];return n&&x.length===0?Wu(u,f,m,g):(u={ye:m,Xc:u,kd:g,oe:x},n?(u.$c="s\
pawnThread",postMessage(u,x),0):it(u))}function Nv(u){throw rs||=u>>>0,rs}var Qu=globalThis.TextDecoder&&new TextDecoder,
Xu=(u,f,m,g)=>{if(m=f+m,g)return m;for(;u[f]&&!(f>=m);)++f;return f},Yu=(u,f=0,m,g)=>{if(16<(m=Xu(u,f>>>=0,m,g))-f&&u.buffer&&
Qu)return Qu.decode(u.buffer instanceof ArrayBuffer?u.subarray(f,m):u.slice(f,m));for(g="";f<m;){var x=u[f++];if(128&x){
var T=63&u[f++];if((224&x)==192)g+=String.fromCharCode((31&x)<<6|T);else{var P=63&u[f++];65536>(x=(240&x)==224?(15&x)<<12|
T<<6|P:(7&x)<<18|T<<12|P<<6|63&u[f++])?g+=String.fromCharCode(x):(x-=65536,g+=String.fromCharCode(55296|x>>10,56320|1023&
x))}}else g+=String.fromCharCode(x)}return g},ss=(u,f,m)=>(u>>>=0)?Yu((M(),j),u,f,m):"";function Ku(u,f,m){return n?Me(3,
1,u,f,m):0}function Ju(u,f){if(n)return Me(4,1,u,f)}function Zu(u,f){if(n)return Me(5,1,u,f)}function ed(u,f,m){if(n)return Me(
6,1,u,f,m)}function td(u,f,m){return n?Me(7,1,u,f,m):0}function rd(u,f){if(n)return Me(8,1,u,f)}function sd(u,f,m){if(n)
return Me(9,1,u,f,m)}function nd(u,f,m,g){if(n)return Me(10,1,u,f,m,g)}function ad(u,f,m,g){if(n)return Me(11,1,u,f,m,g)}
function od(u,f,m,g){if(n)return Me(12,1,u,f,m,g)}function id(u){if(n)return Me(13,1,u)}function ld(u,f){if(n)return Me(
14,1,u,f)}function cd(u,f,m){if(n)return Me(15,1,u,f,m)}var Dv=()=>ne(""),Wt=u=>{u>>>=0;for(var f="";;){var m=(M(),j)[u++>>>
0];if(!m)return f;f+=String.fromCharCode(m)}},so={},no={},ns=class extends Error{constructor(u){super(u),this.name="Bind\
ingError"}};function sr(u,f,m={}){return(function(g,x,T={}){var P=x.name;if(!g)throw new ns(`type "${P}" must have a pos\
itive integer typeid pointer`);if(no.hasOwnProperty(g)){if(T.ve)return;throw new ns(`Cannot register type '${P}' twice`)}
no[g]=x,so.hasOwnProperty(g)&&(x=so[g],delete so[g],x.forEach(S=>S()))})(u,f,m)}var ud=(u,f,m)=>{switch(f){case 1:return m?
g=>(M(),R)[g>>>0]:g=>(M(),j)[g>>>0];case 2:return m?g=>(M(),Y)[g>>>1>>>0]:g=>(M(),Q)[g>>>1>>>0];case 4:return m?g=>(M(),
z)[g>>>2>>>0]:g=>(M(),I)[g>>>2>>>0];case 8:return m?g=>(M(),ce)[g>>>3>>>0]:g=>(M(),Z)[g>>>3>>>0];default:throw new TypeError(
`invalid integer width (${f}): ${u}`)}};function zv(u,f,m,g,x){u>>>=0,m>>>=0,f=Wt(f>>>0);let T=P=>P;if(g=g===0n){let P=8*
m;T=S=>BigInt.asUintN(P,S),x=T(x)}sr(u,{name:f,Wc:T,cd:(P,S)=>(typeof S=="number"&&(S=BigInt(S)),S),bd:ud(f,m,!g),dd:null})}
function Bv(u,f,m,g){sr(u>>>=0,{name:f=Wt(f>>>0),Wc:function(x){return!!x},cd:function(x,T){return T?m:g},bd:function(x){
return this.Wc((M(),j)[x>>>0])},dd:null})}var dd=[],Lr=[0,1,,1,null,1,!0,1,!1,1];function ao(u){9<(u>>>=0)&&--Lr[u+1]===
0&&(Lr[u]=void 0,dd.push(u))}var xt=u=>{if(!u)throw new ns(`Cannot use deleted val. handle = ${u}`);return Lr[u]},Pt=u=>{
switch(u){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let f=dd.pop()||Lr.length;return Lr[f]=
u,Lr[f+1]=1,f}};function oo(u){return this.Wc((M(),I)[u>>>2>>>0])}var Rv={name:"emscripten::val",Wc:u=>{var f=xt(u);return ao(
u),f},cd:(u,f)=>Pt(f),bd:oo,dd:null};function $v(u){return sr(u>>>0,Rv)}var Gv=(u,f)=>{switch(f){case 4:return function(m){
return this.Wc((M(),U)[m>>>2>>>0])};case 8:return function(m){return this.Wc((M(),X)[m>>>3>>>0])};default:throw new TypeError(
`invalid float width (${f}): ${u}`)}};function Vv(u,f,m){m>>>=0,sr(u>>>=0,{name:f=Wt(f>>>0),Wc:g=>g,cd:(g,x)=>x,bd:Gv(f,
m),dd:null})}function Uv(u,f,m,g,x){u>>>=0,m>>>=0,f=Wt(f>>>0);let T=S=>S;if(g===0){var P=32-8*m;T=S=>S<<P>>>P,x=T(x)}sr(
u,{name:f,Wc:T,cd:(S,D)=>D,bd:ud(f,m,g!==0),dd:null})}function jv(u,f,m){function g(T){var P=(M(),I)[T>>>2>>>0];return T=
(M(),I)[T+4>>>2>>>0],new x((M(),R).buffer,T,P)}var x=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,
Float32Array,Float64Array,BigInt64Array,BigUint64Array][f];sr(u>>>=0,{name:m=Wt(m>>>0),Wc:g,bd:g},{ve:!0})}var nr=(u,f,m)=>{
var g=(M(),j);if(f>>>=0,0<m){var x=f;m=f+m-1;for(var T=0;T<u.length;++T){var P=u.codePointAt(T);if(127>=P){if(f>=m)break;
g[f++>>>0]=P}else if(2047>=P){if(f+1>=m)break;g[f++>>>0]=192|P>>6,g[f++>>>0]=128|63&P}else if(65535>=P){if(f+2>=m)break;
g[f++>>>0]=224|P>>12,g[f++>>>0]=128|P>>6&63,g[f++>>>0]=128|63&P}else{if(f+3>=m)break;g[f++>>>0]=240|P>>18,g[f++>>>0]=128|
P>>12&63,g[f++>>>0]=128|P>>6&63,g[f++>>>0]=128|63&P,T++}}g[f>>>0]=0,u=f-x}else u=0;return u},ar=u=>{for(var f=0,m=0;m<u.
length;++m){var g=u.charCodeAt(m);127>=g?f++:2047>=g?f+=2:55296<=g&&57343>=g?(f+=4,++m):f+=3}return f};function qv(u,f){
sr(u>>>=0,{name:f=Wt(f>>>0),Wc(m){var g=(M(),I)[m>>>2>>>0];return g=ss(m+4,g,!0),kt(m),g},cd(m,g){g instanceof ArrayBuffer&&
(g=new Uint8Array(g));var x=typeof g=="string";if(!(x||ArrayBuffer.isView(g)&&g.BYTES_PER_ELEMENT==1))throw new ns("Cann\
ot pass non-string to std::string");var T=x?ar(g):g.length,P=Nr(4+T+1),S=P+4;return(M(),I)[P>>>2>>>0]=T,x?nr(g,S,T+1):(M(),
j).set(g,S>>>0),m!==null&&m.push(kt,P),P},bd:oo,dd(m){kt(m)}})}var hd=globalThis.TextDecoder?new TextDecoder("utf-16le"):
void 0,Wv=(u,f,m)=>{if(u>>>=1,16<(f=Xu((M(),Q),u,f/2,m))-u&&hd)return hd.decode((M(),Q).slice(u,f));for(m="";u<f;++u){var g=(M(),
Q)[u>>>0];m+=String.fromCharCode(g)}return m},Hv=(u,f,m)=>{if(m??=2147483647,2>m)return 0;var g=f;m=(m-=2)<2*u.length?m/
2:u.length;for(var x=0;x<m;++x){var T=u.charCodeAt(x);(M(),Y)[f>>>1>>>0]=T,f+=2}return(M(),Y)[f>>>1>>>0]=0,f-g},Qv=u=>2*
u.length,Xv=(u,f,m)=>{var g="";u>>>=2;for(var x=0;!(x>=f/4);x++){var T=(M(),I)[u+x>>>0];if(!T&&!m)break;g+=String.fromCodePoint(
T)}return g},Yv=(u,f,m)=>{if(f>>>=0,m??=2147483647,4>m)return 0;var g=f;m=g+m-4;for(var x=0;x<u.length;++x){var T=u.codePointAt(
x);if(65535<T&&x++,(M(),z)[f>>>2>>>0]=T,(f+=4)+4>m)break}return(M(),z)[f>>>2>>>0]=0,f-g},Kv=u=>{for(var f=0,m=0;m<u.length;++m)
65535<u.codePointAt(m)&&m++,f+=4;return f};function Jv(u,f,m){if(u>>>=0,f>>>=0,m=Wt(m>>>=0),f===2)var g=Wv,x=Hv,T=Qv;else
g=Xv,x=Yv,T=Kv;sr(u,{name:m,Wc:P=>{var S=(M(),I)[P>>>2>>>0];return S=g(P+4,S*f,!0),kt(P),S},cd:(P,S)=>{if(typeof S!="str\
ing")throw new ns(`Cannot pass non-string to C++ string type ${m}`);var D=T(S),q=Nr(4+D+f);return(M(),I)[q>>>2>>>0]=D/f,
x(S,q+4,D+f),P!==null&&P.push(kt,q),q},bd:oo,dd(P){kt(P)}})}function Zv(u,f){sr(u>>>=0,{we:!0,name:f=Wt(f>>>0),Wc:()=>{},
cd:()=>{}})}function ey(u){xo(u>>>0,!s,1,!r,131072,!1),Gu()}var dt=u=>{if(!C)try{if(u(),!(0<be))try{n?$n()&&ko(p):ts(p)}catch(f){
f instanceof Ee||f=="unwind"||l(0,f)}}catch(f){f instanceof Ee||f=="unwind"||l(0,f)}},ty=!Atomics.waitAsync||globalThis.
navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function io(u){u>>>=0,ty||
(Atomics.waitAsync((M(),z),u>>>2,u).value.then(In),u+=128,Atomics.store((M(),z),u>>>2,1))}var In=()=>dt(()=>{var u=$n();
u&&(io(u),oh())});function ry(u,f){(u>>>=0)==f>>>0?setTimeout(In):n?postMessage({gd:u,$c:"checkMailbox"}):(u=Ir[u])&&u.postMessage(
{$c:"checkMailbox"})}var lo=[];function sy(u,f,m,g,x){for(f>>>=0,x>>>=0,lo.length=0,m=x>>>3,g=x+g>>>3;m<g;){var T;T=(M(),
ce)[m++>>>0]?(M(),ce)[m++>>>0]:(M(),X)[m++>>>0],lo.push(T)}return(f?Co[f]:Hb[u])(...lo)}var ny=()=>{be=0};function ay(u){
u>>>=0,n?postMessage({$c:"cleanupThread",Le:u}):$u(Ir[u])}function oy(u){}var Ln=u=>{try{u()}catch(f){ne(f)}};function iy(u){
var f=(...m)=>{On.push(u);try{return u(...m)}finally{C||(On.pop(),Ht&&mr===1&&On.length===0&&(mr=0,be+=1,Ln(Yh),typeof Fibers<
"u"&&Fibers.We()))}};return pd.set(u,f),f}var mr=0,Ht=null,fd=0,On=[],co=new Map,_d=new Map,pd=new Map,ly=0,uo=null,cy=[],
md=u=>(function(f){if(!C){if(mr===0){var m=!1,g=!1;f((x=0)=>{if(!C&&(fd=x,m=!0,g)){mr=2,Ln(()=>Kh(Ht)),typeof MainLoop<"\
u"&&MainLoop.se&&MainLoop.resume(),x=!1;try{var T=(function(){var D=(M(),z)[Ht+8>>>2>>>0];return D=_d.get(D),D=pd.get(D),
--be,D()})()}catch(D){T=D,x=!0}var P=!1;if(!Ht){var S=uo;S&&(uo=null,(x?S.reject:S.resolve)(T),P=!0)}if(x&&!P)throw T}}),
g=!0,m||(mr=1,Ht=(function(){var x=Nr(65548),T=x+12;if((M(),I)[x>>>2>>>0]=T,(M(),I)[x+4>>>2>>>0]=T+65536,T=On[0],!co.has(
T)){var P=ly++;co.set(T,P),_d.set(P,T)}return T=co.get(T),(M(),z)[x+8>>>2>>>0]=T,x})(),typeof MainLoop<"u"&&MainLoop.se&&
MainLoop.pause(),Ln(()=>Xh(Ht)))}else mr===2?(mr=0,Ln(Jh),kt(Ht),Ht=null,cy.forEach(dt)):ne(`invalid state: ${mr}`);return fd}})(
f=>{u().then(f)});function uy(u){return u>>>=0,md(async()=>{var f=await xt(u);return Pt(f)})}var ho=[],dy=u=>{var f=ho.length;
return ho.push(u),f},hy=(u,f)=>{for(var m=Array(u),g=0;g<u;++g){var x=g,T=(M(),I)[f+4*g>>>2>>>0],P=no[T];if(P===void 0)throw u=
`parameter ${g}`,T=Gd(T),f=Wt(T),kt(T),new ns(`${u} has unknown type ${f}`);m[x]=P}return m},fy=(u,f,m)=>{var g=[];return u=
u(g,m),g.length&&((M(),I)[f>>>2>>>0]=Pt(g)),u},_y={},Nn=u=>{var f=_y[u];return f===void 0?Wt(u):f};function py(u,f,m){var[
g,...x]=hy(u,f>>>0);f=g.cd.bind(g);var T=x.map(D=>D.bd.bind(D));u--;var P={toValue:xt};switch(u=T.map((D,q)=>{var H=`arg\
FromPtr${q}`;return P[H]=D,`${H}(args${q?"+"+8*q:""})`}),m){case 0:var S="toValue(handle)";break;case 2:S="new (toValue(\
handle))";break;case 3:S="";break;case 1:P.getStringOrSymbol=Nn,S="toValue(handle)[getStringOrSymbol(methodName)]"}return S+=
`(${u})`,g.we||(P.toReturnWire=f,P.emval_returnValue=fy,S=`return emval_returnValue(toReturnWire, destructorsRef, ${S})`),
S=`return function (handle, methodName, destructorsRef, args) {
  ${S}
  }`,m=new Function(Object.keys(P),S)(...Object.values(P)),S=`methodCaller<(${x.map(D=>D.name)}) => ${g.name}>`,dy(Object.
defineProperty(m,"name",{value:S}))}function my(u,f){return f>>>=0,(u=xt(u>>>0))==xt(f)}function gy(u){return(u>>>=0)?(u=
Nn(u),Pt(globalThis[u])):Pt(globalThis)}function wy(u){return u=Nn(u>>>0),Pt(t[u])}function vy(u,f){return f>>>=0,u=xt(u>>>
0),f=xt(f),Pt(u[f])}function yy(u){9<(u>>>=0)&&(Lr[u+1]+=1)}function gd(u,f,m,g,x){return ho[u>>>0](f>>>0,m>>>0,g>>>0,x>>>
0)}function by(u,f,m,g,x){return gd(u>>>0,f>>>0,m>>>0,g>>>0,x>>>0)}function My(){return Pt([])}function xy(u){u=xt(u>>>0);
for(var f=Array(u.length),m=0;m<u.length;m++)f[m]=u[m];return Pt(f)}function ky(u){return Pt(Nn(u>>>0))}function Ty(){return Pt(
{})}function Ey(u){for(var f=xt(u>>>=0);f.length;){var m=f.pop();f.pop()(m)}ao(u)}function Ay(u,f,m){f>>>=0,m>>>=0,u=xt(
u>>>0),f=xt(f),m=xt(m),u[f]=m}function Cy(u,f){u=et(u),f>>>=0,u=new Date(1e3*u),(M(),z)[f>>>2>>>0]=u.getUTCSeconds(),(M(),
z)[f+4>>>2>>>0]=u.getUTCMinutes(),(M(),z)[f+8>>>2>>>0]=u.getUTCHours(),(M(),z)[f+12>>>2>>>0]=u.getUTCDate(),(M(),z)[f+16>>>
2>>>0]=u.getUTCMonth(),(M(),z)[f+20>>>2>>>0]=u.getUTCFullYear()-1900,(M(),z)[f+24>>>2>>>0]=u.getUTCDay(),u=(u.getTime()-
Date.UTC(u.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(M(),z)[f+28>>>2>>>0]=u}var wd=u=>u%4==0&&(u%100!=0||u%400==0),vd=[0,31,
60,91,121,152,182,213,244,274,305,335],yd=[0,31,59,90,120,151,181,212,243,273,304,334];function Sy(u,f){u=et(u),f>>>=0,u=
new Date(1e3*u),(M(),z)[f>>>2>>>0]=u.getSeconds(),(M(),z)[f+4>>>2>>>0]=u.getMinutes(),(M(),z)[f+8>>>2>>>0]=u.getHours(),
(M(),z)[f+12>>>2>>>0]=u.getDate(),(M(),z)[f+16>>>2>>>0]=u.getMonth(),(M(),z)[f+20>>>2>>>0]=u.getFullYear()-1900,(M(),z)[f+
24>>>2>>>0]=u.getDay();var m=(wd(u.getFullYear())?vd:yd)[u.getMonth()]+u.getDate()-1|0;(M(),z)[f+28>>>2>>>0]=m,(M(),z)[f+
36>>>2>>>0]=-60*u.getTimezoneOffset(),m=new Date(u.getFullYear(),6,1).getTimezoneOffset();var g=new Date(u.getFullYear(),
0,1).getTimezoneOffset();u=0|(m!=g&&u.getTimezoneOffset()==Math.min(g,m)),(M(),z)[f+32>>>2>>>0]=u}function Py(u){u>>>=0;
var f=new Date((M(),z)[u+20>>>2>>>0]+1900,(M(),z)[u+16>>>2>>>0],(M(),z)[u+12>>>2>>>0],(M(),z)[u+8>>>2>>>0],(M(),z)[u+4>>>
2>>>0],(M(),z)[u>>>2>>>0],0),m=(M(),z)[u+32>>>2>>>0],g=f.getTimezoneOffset(),x=new Date(f.getFullYear(),6,1).getTimezoneOffset(),
T=new Date(f.getFullYear(),0,1).getTimezoneOffset(),P=Math.min(T,x);return 0>m?(M(),z)[u+32>>>2>>>0]=+(x!=T&&P==g):0<m!=
(P==g)&&(x=Math.max(T,x),f.setTime(f.getTime()+6e4*((0<m?P:x)-g))),(M(),z)[u+24>>>2>>>0]=f.getDay(),m=(wd(f.getFullYear())?
vd:yd)[f.getMonth()]+f.getDate()-1|0,(M(),z)[u+28>>>2>>>0]=m,(M(),z)[u>>>2>>>0]=f.getSeconds(),(M(),z)[u+4>>>2>>>0]=f.getMinutes(),
(M(),z)[u+8>>>2>>>0]=f.getHours(),(M(),z)[u+12>>>2>>>0]=f.getDate(),(M(),z)[u+16>>>2>>>0]=f.getMonth(),(M(),z)[u+20>>>2>>>
0]=f.getYear(),u=f.getTime(),BigInt(isNaN(u)?-1:u/1e3)}function bd(u,f,m,g,x,T,P){return n?Me(16,1,u,f,m,g,x,T,P):-52}function Md(u,f,m,g,x,T){
if(n)return Me(17,1,u,f,m,g,x,T)}var js={},Fy=()=>performance.timeOrigin+performance.now();function xd(u,f){if(n)return Me(
18,1,u,f);if(js[u]&&(clearTimeout(js[u].id),delete js[u]),!f)return 0;var m=setTimeout(()=>{delete js[u],dt(()=>ah(u,performance.
timeOrigin+performance.now()))},f);return js[u]={id:m,Ve:f},0}function Iy(u,f,m,g){u>>>=0,f>>>=0,m>>>=0,g>>>=0;var x=new Date().
getFullYear(),T=new Date(x,0,1).getTimezoneOffset();x=new Date(x,6,1).getTimezoneOffset();var P=Math.max(T,x);(M(),I)[u>>>
2>>>0]=60*P,(M(),z)[f>>>2>>>0]=+(T!=x),u=(f=S=>{var D=Math.abs(S);return`UTC${0<=S?"-":"+"}${String(Math.floor(D/60)).padStart(
2,"0")}${String(D%60).padStart(2,"0")}`})(T),f=f(x),x<T?(nr(u,m,17),nr(f,g,17)):(nr(u,g,17),nr(f,m,17))}var Ly=()=>Date.
now();function Oy(u,f,m){return m>>>=0,0<=u&&3>=u?(u===0?u=Date.now():u=performance.timeOrigin+performance.now(),u=Math.
round(1e6*u),(M(),ce)[m>>>3>>>0]=BigInt(u),0):28}var fo=[],kd=(u,f)=>{fo.length=0;for(var m;m=(M(),j)[u++>>>0];){var g=m!=
105;f+=(g&=m!=112)&&f%8?4:0,fo.push(m==112?(M(),I)[f>>>2>>>0]:m==106?(M(),ce)[f>>>3>>>0]:m==105?(M(),z)[f>>>2>>>0]:(M(),
X)[f>>>3>>>0]),f+=g?8:4}return fo};function Ny(u,f,m){return u>>>=0,f=kd(f>>>0,m>>>0),Co[u](...f)}function Dy(u,f,m){return u>>>=
0,f=kd(f>>>0,m>>>0),Co[u](...f)}var zy=()=>{};function By(u,f){return E(ss(u>>>0,f>>>0))}var Ry=()=>{throw be+=1,"unwind"};
function $y(){return 4294901760}var Gy=()=>1,Vy=()=>navigator.hardwareConcurrency,Or={},Td=u=>{var f=ar(u)+1,m=Nr(f);return m&&
nr(u,m,f),m},Dn=u=>{var f;return(f=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(u))?+f[1]:(f=/:(\d+):\d+(?:\)|$)/.exec(u))?
2147483648|+f[1]:0},Ed=u=>{for(var f of u)(u=Dn(f))&&(Or[u]=f)};function Uy(){var u=Error().stack.toString().split(`
`);return u[0]=="Error"&&u.shift(),Ed(u),Or.ee=Dn(u[3]),Or.xe=u,Or.ee}function zn(u){if(!(u=Or[u>>>0]))return 0;var f;if(f=
/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(u))u=f[1];else if(f=/^\s+at (.*) \(.*\)$/.exec(u))u=f[1];else{if(!(f=/^(.+?)@/.exec(
u)))return 0;u=f[1]}return kt(zn.ne??0),zn.ne=Td(u),zn.ne}function jy(u){u>>>=0;var f=(M(),j).length;if(u<=f||4294901760<
u)return!1;for(var m=1;4>=m;m*=2){var g=f*(1+.2/m);g=Math.min(g,u+100663296);e:{g=(Math.min(4294901760,65536*Math.ceil(Math.
max(u,g)/65536))-pr.buffer.byteLength+65535)/65536|0;try{pr.grow(g),O();var x=1;break e}catch{}x=void 0}if(x)return!0}return!1}
function qy(u,f,m){if(u>>>=0,f>>>=0,Or.ee==u)var g=Or.xe;else(g=Error().stack.toString().split(`
`))[0]=="Error"&&g.shift(),Ed(g);for(var x=3;g[x]&&Dn(g[x])!=u;)++x;for(u=0;u<m&&g[u+x];++u)(M(),z)[f+4*u>>>2>>>0]=Dn(g[u+
x]);return u}var Qt=u=>{var f=ar(u)+1,m=Gn(f);return nr(u,m,f),m},as=u=>(M(),I)[u>>>2>>>0]+4294967296*(M(),z)[u+4>>>2>>>
0],tt=[],Ad=(u,f)=>{tt[u>>>0]=f},or=[],Bn=[],os=(u,f)=>{Bn[u]=new Promise(m=>f.finally(()=>m(u)))},J=u=>{if(u)return tt[u>>>
0]},_o=(u,f)=>{for(u=(M(),I)[u>>>2>>>0];u;u=(M(),I)[u>>>2>>>0])f[(M(),z)[u+4>>>2>>>0]](u)},Rn=(u,f,m)=>{(M(),I)[u>>>2>>>
0]=f,(M(),I)[u+4>>>2>>>0]=m},Cd=u=>{var f=(M(),I)[u>>>2>>>0];return u=(M(),I)[u+4>>>2>>>0],ss(f,u)},Ft=u=>{var f=(M(),I)[u>>>
2>>>0];return u=(M(),I)[u+4>>>2>>>0],f?ss(f,u):u===0?"":void 0},Wy=u=>{var f=Ft(u+4),m=(m=(M(),I)[u+12>>>2>>>0])?J(m):"a\
uto";if(u+=16){var g=J((M(),I)[u+4>>>2>>>0]),x=(M(),I)[u+16>>>2>>>0],T=(M(),I)[u+20>>>2>>>0];if(x){for(var P={},S=0;S<x;++S){
var D=T+24*S;P[Cd(D+4)]=(M(),X)[D+16>>>3>>>0]}x=P}else x=void 0;u={module:g,constants:x,entryPoint:Ft(u+8)}}else u=void 0;
return{label:f,layout:m,compute:u}},Sd=(u,f)=>{function m(T,P,S,D=0){T=u[T]??D,(M(),I)[P+S>>>2>>>0]=T}function g(T,P,S,D=0){
P+=S,T=u[T]??D,(M(),I)[P>>>2>>>0]=T,D=(M(),I)[P>>>2>>>0],(M(),I)[P+4>>>2>>>0]=(T-D)/4294967296}var x=(M(),I)[f>>>2>>>0];
m("maxTextureDimension1D",f,4),m("maxTextureDimension2D",f,8),m("maxTextureDimension3D",f,12),m("maxTextureArrayLayers",
f,16),m("maxBindGroups",f,20),m("maxBindGroupsPlusVertexBuffers",f,24),m("maxBindingsPerBindGroup",f,28),m("maxDynamicUn\
iformBuffersPerPipelineLayout",f,32),m("maxDynamicStorageBuffersPerPipelineLayout",f,36),m("maxSampledTexturesPerShaderS\
tage",f,40),m("maxSamplersPerShaderStage",f,44),m("maxStorageBuffersPerShaderStage",f,48),m("maxStorageTexturesPerShader\
Stage",f,52),m("maxUniformBuffersPerShaderStage",f,56),m("minUniformBufferOffsetAlignment",f,80),m("minStorageBufferOffs\
etAlignment",f,84),g("maxUniformBufferBindingSize",f,64),g("maxStorageBufferBindingSize",f,72),m("maxVertexBuffers",f,88),
g("maxBufferSize",f,96),m("maxVertexAttributes",f,104),m("maxVertexBufferArrayStride",f,108),m("maxInterStageShaderVaria\
bles",f,112),m("maxColorAttachments",f,116),m("maxColorAttachmentBytesPerSample",f,120),m("maxComputeWorkgroupStorageSiz\
e",f,124),m("maxComputeInvocationsPerWorkgroup",f,128),m("maxComputeWorkgroupSizeX",f,132),m("maxComputeWorkgroupSizeY",
f,136),m("maxComputeWorkgroupSizeZ",f,140),m("maxComputeWorkgroupsPerDimension",f,144),m("maxImmediateSize",f,148),x!==0&&
(M(),m("maxStorageBuffersInVertexStage",x,8,u.maxStorageBuffersPerShaderStage),m("maxStorageBuffersInFragmentStage",x,16,
u.maxStorageBuffersPerShaderStage),m("maxStorageTexturesInVertexStage",x,12,u.maxStorageTexturesPerShaderStage),m("maxSt\
orageTexturesInFragmentStage",x,20,u.maxStorageTexturesPerShaderStage))},Hy=(u,f)=>{(M(),I)[f+52>>>2>>>0]=u.subgroupMinSize,
(M(),I)[f+56>>>2>>>0]=u.subgroupMaxSize;var m=Td(u.vendor+u.architecture+u.device+u.description),g=ar(u.vendor);Rn(f+4,m,
g),m+=g,g=ar(u.architecture),Rn(f+12,m,g),m+=g,g=ar(u.device),Rn(f+20,m,g),m+=g,g=ar(u.description),Rn(f+28,m,g),m+=g,(M(),
z)[f+36>>>2>>>0]=2,m=u.isFallbackAdapter?3:4,(M(),z)[f+40>>>2>>>0]=m,(M(),I)[f+44>>>2>>>0]=0,(M(),I)[f+48>>>2>>>0]=0,_o(
f,{327739:x=>{let T=0,P=0;if(u.subgroupMatrixConfigs){T=u.subgroupMatrixConfigs.length,P=Nr(20*T);for(let[S,D]of u.subgroupMatrixConfigs.
entries()){let q=P+20*S,H=Fd.indexOf(D.componentType),re=Fd.indexOf(D.resultComponentType);(M(),z)[q>>>2>>>0]=H,(M(),z)[q+
4>>>2>>>0]=re,(M(),I)[q+8>>>2>>>0]=D.M,(M(),I)[q+12>>>2>>>0]=D.N,(M(),I)[q+16>>>2>>>0]=D.K}}(M(),I)[x+12>>>2>>>0]=P,(M(),
I)[x+8>>>2>>>0]=T}})},Qy=[,,"uniform","storage","read-only-storage"],Xy=[,"validation","out-of-memory","internal"],Yy=[,
"compatibility","core"],Pd={1:"core-features-and-limits",2:"depth-clip-control",3:"depth32float-stencil8",4:"texture-com\
pression-bc",5:"texture-compression-bc-sliced-3d",6:"texture-compression-etc2",7:"texture-compression-astc",8:"texture-c\
ompression-astc-sliced-3d",9:"timestamp-query",10:"indirect-first-instance",11:"shader-f16",12:"rg11b10ufloat-renderable",
13:"bgra8unorm-storage",14:"float32-filterable",15:"float32-blendable",16:"clip-distances",17:"dual-source-blending",18:"\
subgroups",19:"texture-formats-tier1",20:"texture-formats-tier2",21:"primitive-index",22:"texture-component-swizzle",23:"\
subgroup-size-control",327692:"chromium-experimental-unorm16-texture-formats",327729:"chromium-experimental-multi-draw-i\
ndirect",327732:"chromium-experimental-subgroup-matrix"},Ky=[,"low-power","high-performance"],Jy=[,"occlusion","timestam\
p"],Zy=[,,"filtering","non-filtering","comparison"],eb=[,,"write-only","read-only","read-write"],Fd=[,"f32","f16","u32",
"i32","u8","i8"],tb=[,"r8unorm","r8snorm","r8uint","r8sint","r16unorm","r16snorm","r16uint","r16sint","r16float","rg8uno\
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
stc-12x10-unorm","astc-12x10-unorm-srgb","astc-12x12-unorm","astc-12x12-unorm-srgb"],rb=[,,"float","unfilterable-float",
"depth","sint","uint"],Id=[,"1d","2d","2d-array","cube","cube-array","3d"],sb={undefined:1,unknown:1,destroyed:2};function nb(u,f,m,g,x,T){
f=et(f),m=et(m),g>>>=0,x>>>=0,T>>>=0;var P=J(u>>>0);if(u={},T){var S=(M(),I)[T+12>>>2>>>0];if(S){var D=(M(),I)[T+16>>>2>>>
0];u.requiredFeatures=Array.from((M(),I).subarray(D>>>2>>>0,D+4*S>>>2>>>0),H=>Pd[H])}if(S=(M(),I)[T+20>>>2>>>0]){let H=function(me,Ie,Dr,Hs=!1){
Ie+=Dr,(Ie=(M(),I)[Ie>>>2>>>0])==4294967295||Hs&&Ie==0||(q[me]=Ie)},re=function(me,Ie,Dr){Ie+=Dr,Dr=(M(),I)[Ie>>>2>>>0];
var Hs=(M(),I)[Ie+4>>>2>>>0];Dr==4294967295&&Hs==4294967295||(q[me]=as(Ie))};D=(M(),I)[S>>>2>>>0];var q={};H("maxTexture\
Dimension1D",S,4),H("maxTextureDimension2D",S,8),H("maxTextureDimension3D",S,12),H("maxTextureArrayLayers",S,16),H("maxB\
indGroups",S,20),H("maxBindGroupsPlusVertexBuffers",S,24),H("maxBindingsPerBindGroup",S,28),H("maxDynamicUniformBuffersP\
erPipelineLayout",S,32),H("maxDynamicStorageBuffersPerPipelineLayout",S,36),H("maxSampledTexturesPerShaderStage",S,40),H(
"maxSamplersPerShaderStage",S,44),H("maxStorageBuffersPerShaderStage",S,48),H("maxStorageTexturesPerShaderStage",S,52),H(
"maxUniformBuffersPerShaderStage",S,56),H("minUniformBufferOffsetAlignment",S,80),H("minStorageBufferOffsetAlignment",S,
84),re("maxUniformBufferBindingSize",S,64),re("maxStorageBufferBindingSize",S,72),H("maxVertexBuffers",S,88),re("maxBuff\
erSize",S,96),H("maxVertexAttributes",S,104),H("maxVertexBufferArrayStride",S,108),H("maxInterStageShaderVariables",S,112),
H("maxColorAttachments",S,116),H("maxColorAttachmentBytesPerSample",S,120),H("maxComputeWorkgroupStorageSize",S,124),H("\
maxComputeInvocationsPerWorkgroup",S,128),H("maxComputeWorkgroupSizeX",S,132),H("maxComputeWorkgroupSizeY",S,136),H("max\
ComputeWorkgroupSizeZ",S,140),H("maxComputeWorkgroupsPerDimension",S,144),H("maxImmediateSize",S,148,!0),D!==0&&(M(),"ma\
xStorageBuffersInVertexStage"in GPUSupportedLimits.prototype&&(H("maxStorageBuffersInVertexStage",D,8),H("maxStorageText\
uresInVertexStage",D,12),H("maxStorageBuffersInFragmentStage",D,16),H("maxStorageTexturesInFragmentStage",D,20))),u.requiredLimits=
q}(S=(M(),I)[T+24>>>2>>>0])&&(S={label:Ft(S+4)},u.defaultQueue=S),u.label=Ft(T+4)}be+=1,os(f,P.requestDevice(u).then(H=>{
--be,dt(()=>{tt[x>>>0]=H.queue,tt[g>>>0]=H,be+=1,os(m,H.lost.then(re=>{dt(()=>{H.onuncapturederror=()=>{};var me=te(),Ie=Qt(
re.message);vo(m,sb[re.reason],Ie),ee(me)}),--be})),H.onuncapturederror=re=>{var me=5;re.error instanceof GPUValidationError?
me=2:re.error instanceof GPUOutOfMemoryError?me=3:re.error instanceof GPUInternalError&&(me=4);var Ie=te();re=Qt(re.error.
message),th(g,me,re),ee(Ie)},"adapterInfo"in H||(H.adapterInfo=P.info),Mo(f,1,g,0)})},H=>{--be,dt(()=>{var re=te(),me=Qt(
H.message);Mo(f,3,g,me),m&&vo(m,4,me),ee(re)})}))}function ab(u){var f=J(u>>>=0),m=or[u];if(m){for(var g=0;g<m.length;++g)
m[g]();delete or[u]}f.destroy()}function ob(u,f,m){m>>>=0;var g=J(u>>>=0);m==4294967295&&(m=void 0);try{var x=g.getMappedRange(
f>>>0,m)}catch{return 0}var T=To(16,x.byteLength);return(M(),j).set(new Uint8Array(x),T>>>0),or[u].push(()=>kt(T)),T}function ib(u,f,m){
m>>>=0;var g=J(u>>>=0);m==4294967295&&(m=void 0);try{var x=g.getMappedRange(f>>>0,m)}catch{return 0}var T=To(16,x.byteLength);
return(M(),j).fill(0,T,x.byteLength),or[u].push(()=>{new Uint8Array(x).set((M(),j).subarray(T>>>0,T+x.byteLength>>>0)),kt(
T)}),T}function lb(u,f,m,g,x){u>>>=0,f=et(f),m=et(m),x>>>=0;var T=J(u);or[u]=[],x==4294967295&&(x=void 0),be+=1,os(f,T.mapAsync(
m,g>>>0,x).then(()=>{--be,dt(()=>{yo(f,1,0)})},P=>{--be,dt(()=>{te();var S=Qt(P.message);yo(f,P.name==="AbortError"?4:P.
name==="OperationError"?3:0,S),delete or[u]})}))}function cb(u){var f=J(u>>>=0),m=or[u];if(m){for(var g=0;g<m.length;++g)
m[g]();delete or[u],f.unmap()}}function ub(u){delete tt[u>>>0]}function db(u,f,m){u>>>=0,f>>>=0,m>>>=0;var g=!!(M(),I)[f+
32>>>2>>>0];f={label:Ft(f+4),usage:(M(),I)[f+16>>>2>>>0],size:as(f+24),mappedAtCreation:g},u=J(u);try{var x=u.createBuffer(
f)}catch{return!1}return tt[m>>>0]=x,g&&(or[m]=[]),!0}function hb(u,f,m,g){u>>>=0,f=et(f),g>>>=0,m=Wy(m>>>0),u=J(u),be+=
1,os(f,u.createComputePipelineAsync(m).then(x=>{--be,dt(()=>{tt[g>>>0]=x,wo(f,1,g,0)})},x=>{--be,dt(()=>{var T=te(),P=Qt(
x.message);wo(f,x.reason==="validation"?3:x.reason==="internal"?4:0,g,P),ee(T)})}))}function fb(u,f,m){u>>>=0,f>>>=0,m>>>=
0;var g=(M(),I)[f>>>2>>>0],x=(M(),z)[g+4>>>2>>>0];f={label:Ft(f+4),code:""},x===2&&(f.code=Cd(g+8)),u=J(u).createShaderModule(
f),tt[m>>>0]=u}var _b=u=>{(u=J(u)).onuncapturederror=null,u.destroy()};function pb(u,f){f=et(f),u=J(u>>>0),be+=1,os(f,u.
popErrorScope().then(m=>{--be,dt(()=>{var g=5;m?m instanceof GPUValidationError?g=2:m instanceof GPUOutOfMemoryError?g=3:
m instanceof GPUInternalError&&(g=4):g=1;var x=te(),T=m?Qt(m.message):0;bo(f,1,g,T),ee(x)})},m=>{--be,dt(()=>{var g=te(),
x=Qt(m.message);bo(f,1,5,x),ee(g)})}))}function mb(u,f,m,g){if(f=et(f),g>>>=0,m>>>=0){var x={featureLevel:Yy[(M(),z)[m+4>>>
2>>>0]],powerPreference:Ky[(M(),z)[m+8>>>2>>>0]],forceFallbackAdapter:!!(M(),I)[m+12>>>2>>>0]};(u=(M(),I)[m>>>2>>>0])!==
0&&(M(),x.Ye=!!(M(),I)[u+8>>>2>>>0])}"gpu"in navigator?(be+=1,os(f,navigator.gpu.requestAdapter(x).then(T=>{--be,dt(()=>{
if(T)tt[g>>>0]=T,qs(f,1,g,0);else{var P=te(),S=Qt("WebGPU not available on this browser (requestAdapter returned null)");
qs(f,3,g,S),ee(P)}})},T=>{--be,dt(()=>{var P=te(),S=Qt(T.message);qs(f,4,g,S),ee(P)})}))):(x=te(),u=Qt("WebGPU not avail\
able on this browser (navigator.gpu is not available)"),qs(f,3,g,u),ee(x))}function gb(u,f,m){return u>>>=0,f>>>=0,m>>>=
0,md(async()=>{var g=[];if(m){var x=(M(),z)[m>>>2>>>0];g.length=f+1,g[f]=new Promise(S=>setTimeout(S,x,0))}else g.length=
f;for(var T=0;T<f;++T){var P=as(u+8*T);if(!(P in Bn))return P;g[T]=Bn[P]}return g=await Promise.race(g),delete Bn[g],g})}
var po,mo={},Ld=()=>{if(!po){var u,f={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.
navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(u in mo)mo[u]===void 0?delete f[u]:f[u]=mo[u];
var m=[];for(u in f)m.push(`${u}=${f[u]}`);po=m}return po};function Od(u,f){if(n)return Me(19,1,u,f);u>>>=0,f>>>=0;var m,
g=0,x=0;for(m of Ld()){var T=f+g;(M(),I)[u+x>>>2>>>0]=T,g+=nr(m,T,1/0)+1,x+=4}return 0}function Nd(u,f){if(n)return Me(20,
1,u,f);u>>>=0,f>>>=0;var m=Ld();for(var g of((M(),I)[u>>>2>>>0]=m.length,u=0,m))u+=ar(g)+1;return(M(),I)[f>>>2>>>0]=u,0}
function Dd(u){return n?Me(21,1,u):52}function zd(u,f,m,g,x){return n?Me(22,1,u,f,m,g,x):52}function Bd(u,f,m,g){return n?
Me(23,1,u,f,m,g):52}function Rd(u,f,m,g){return n?Me(24,1,u,f,m,g):70}var wb=[null,[],[]];function $d(u,f,m,g){if(n)return Me(
25,1,u,f,m,g);f>>>=0,m>>>=0,g>>>=0;for(var x=0,T=0;T<m;T++){var P=(M(),I)[f>>>2>>>0],S=(M(),I)[f+4>>>2>>>0];f+=8;for(var D=0;D<
S;D++){var q=u,H=(M(),j)[P+D>>>0],re=wb[q];H===0||H===10?((q===1?A:E)(Yu(re)),re.length=0):re.push(H)}x+=S}return(M(),I)[g>>>
2>>>0]=x,0}function vb(u){return u>>>0}function yb(u,f){return Sd(J(u>>>0).limits,f>>>0),1}function bb(u,f){return J(u>>>
0).features.has(Pd[f])}function Mb(u){return BigInt(J(u>>>0).size)}function xb(u){return BigInt(J(u>>>0).usage)}function kb(u,f){
if(u>>>=0,f>>>=0){var m=Ft(f+4);m={label:m,timestampWrites:f=(f=(M(),I)[f+12>>>2>>>0])!==0?{querySet:J((M(),I)[f+4>>>2>>>
0]),beginningOfPassWriteIndex:(M(),I)[f+8>>>2>>>0],endOfPassWriteIndex:(M(),I)[f+12>>>2>>>0]}:void 0}}return f=J(u),u=Xd(
0),m=f.beginComputePass(m),tt[u>>>0]=m,u}function Tb(u,f,m,g){m=et(m),(g=et(g))==-1&&(g=void 0),(u=J(u>>>0)).clearBuffer(
J(f>>>0),m,g)}function Eb(u,f,m,g,x,T){m=et(m),x=et(x),T=et(T),J(u>>>0).copyBufferToBuffer(J(f>>>0),m,J(g>>>0),x,T)}function Ab(u){
var f=J(u>>>0);return u=Hd(0),f=f.finish(),tt[u>>>0]=f,u}function Cb(u,f,m,g,x,T){T=et(T),J(u>>>0).resolveQuerySet(J(f>>>
0),m,g,J(x>>>0),T)}function Sb(u,f,m,g){J(u>>>0).dispatchWorkgroups(f,m,g)}function Pb(u,f,m){m=et(m),J(u>>>0).dispatchWorkgroupsIndirect(
J(f>>>0),m)}function Fb(u){J(u>>>0).end()}function Ib(u,f,m,g,x){g>>>=0,x>>>=0,u=J(u>>>0),m=J(m>>>0),g==0?u.setBindGroup(
f,m):u.setBindGroup(f,m,(M(),I),x>>>2,g)}function Lb(u,f){J(u>>>0).setPipeline(J(f>>>0))}function Ob(u,f,m){J(u>>>0).Xe(
J(f>>>0),m)}function Nb(u,f){function m(x){var T=(M(),I)[x+8>>>2>>>0],P=(M(),I)[x+32>>>2>>>0],S=(M(),I)[x+36>>>2>>>0],D=0;
return _o(x,{14:q=>{D=(M(),I)[q+8>>>2>>>0]}}),T?((P=as(x+24))==-1&&(P=void 0),T={buffer:J(T),offset:as(x+16),size:P}):T=
J(P||S||D),{binding:(M(),I)[x+4>>>2>>>0],resource:T}}u>>>=0,f={label:Ft((f>>>=0)+4),layout:J((M(),I)[f+12>>>2>>>0]),entries:(function(x,T){
for(var P=[],S=0;S<x;++S)P.push(m(T+40*S));return P})((M(),I)[f+16>>>2>>>0],(M(),I)[f+20>>>2>>>0])},u=J(u);var g=qd(0);return Ad(
g,u.createBindGroup(f)),g}function Db(u,f){function m(D){var q=(M(),I)[D+4>>>2>>>0];if(q)return{type:Qy[q],hasDynamicOffset:!!(M(),
I)[D+8>>>2>>>0],minBindingSize:as(D+16)}}function g(D){if(D=(M(),I)[D+4>>>2>>>0])return{type:Zy[D]}}function x(D){var q=(M(),
I)[D+4>>>2>>>0];if(q)return{sampleType:rb[q],viewDimension:Id[(M(),z)[D+8>>>2>>>0]],multisampled:!!(M(),I)[D+12>>>2>>>0]}}
function T(D){var q=(M(),I)[D+4>>>2>>>0];if(q)return{access:eb[q],format:tb[(M(),z)[D+8>>>2>>>0]],viewDimension:Id[(M(),
z)[D+12>>>2>>>0]]}}function P(D){var q={binding:(M(),I)[D+4>>>2>>>0],visibility:(M(),I)[D+8>>>2>>>0],buffer:m(D+24),sampler:g(
D+48),texture:x(D+56),storageTexture:T(D+72)};return _o(D,{13:()=>{q.externalTexture={}}}),q}u>>>=0,f={label:Ft((f>>>=0)+
4),entries:(function(D,q){for(var H=[],re=0;re<D;++re)H.push(P(q+88*re));return H})((M(),I)[f+12>>>2>>>0],(M(),I)[f+16>>>
2>>>0])},u=J(u);var S=Wd(0);return Ad(S,u.createBindGroupLayout(f)),S}function zb(u,f){var m;return u>>>=0,(f>>>=0)&&(m=
{label:Ft(f+4)}),f=J(u),u=Qd(0),m=f.createCommandEncoder(m),tt[u>>>0]=m,u}function Bb(u,f){u>>>=0,f>>>=0;for(var m=(M(),
I)[f+12>>>2>>>0],g=(M(),I)[f+16>>>2>>>0],x=[],T=0;T<m;++T)x.push(J((M(),I)[g+4*T>>>2>>>0]));return f={label:Ft(f+4),bindGroupLayouts:x,
immediateSize:(M(),I)[f+20>>>2>>>0]},m=J(u),u=Yd(0),f=m.createPipelineLayout(f),tt[u>>>0]=f,u}function Rb(u,f){u>>>=0,f>>>=
0,f={type:Jy[(M(),z)[f+12>>>2>>>0]],count:(M(),I)[f+16>>>2>>>0]};var m=J(u);return u=Kd(0),f=m.createQuerySet(f),tt[u>>>
0]=f,u}function $b(u,f){return Hy(J(u>>>0).adapterInfo,f>>>0),1}var Gb={"core-features-and-limits":1,"depth-clip-control":2,
"depth32float-stencil8":3,"texture-compression-bc":4,"texture-compression-bc-sliced-3d":5,"texture-compression-etc2":6,"\
texture-compression-astc":7,"texture-compression-astc-sliced-3d":8,"timestamp-query":9,"indirect-first-instance":10,"sha\
der-f16":11,"rg11b10ufloat-renderable":12,"bgra8unorm-storage":13,"float32-filterable":14,"float32-blendable":15,"clip-d\
istances":16,"dual-source-blending":17,subgroups:18,"texture-formats-tier1":19,"texture-formats-tier2":20,"primitive-ind\
ex":21,"texture-component-swizzle":22,"subgroup-size-control":23,"chromium-experimental-unorm16-texture-formats":327692,
"chromium-experimental-multi-draw-indirect":327729,"chromium-experimental-subgroup-matrix":327732};function Vb(u,f){f>>>=
0;var m=J(u>>>0);u=Nr(4*m.features.size);var g=0,x=0;for(let T of m.features)0<=(m=Gb[T])&&((M(),z)[u+g>>>2>>>0]=m,g+=4,
x++);(M(),I)[f+4>>>2>>>0]=u,(M(),I)[f>>>2>>>0]=x}function Ub(u,f){return Sd(J(u>>>0).limits,f>>>0),1}function jb(u,f){J(
u>>>0).pushErrorScope(Xy[f])}function qb(u,f,m){f>>>=0,m>>>=0,u=J(u>>>0),f=Array.from((M(),z).subarray(m>>>2>>>0,m+4*f>>>
2>>>0),g=>J(g)),u.submit(f)}function Wb(u,f,m,g,x){m=et(m),g>>>=0,x>>>=0,u=J(u>>>0),f=J(f>>>0),g=(M(),j).subarray(g>>>0,
g+x>>>0),u.writeBuffer(f,m,g,0,x)}n||(function(){for(var u=t.numThreads-1;u--;)Uu();$e.push(async()=>{var f=(async function(){
if(!n)return Promise.all(_r.map(Vu))})();Fe++,await f,--Fe==0&&ye&&(f=ye,ye=null,f())})})(),n||(pr=new WebAssembly.Memory(
{initial:256,maximum:65536,shared:!0}),O()),t.wasmBinary&&(h=t.wasmBinary),t.stackSave=()=>te(),t.stackRestore=u=>ee(u),
t.stackAlloc=u=>Gn(u),t.setValue=function(u,f,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":(M(),R)[u>>>0]=
f;break;case"i16":(M(),Y)[u>>>1>>>0]=f;break;case"i32":(M(),z)[u>>>2>>>0]=f;break;case"i64":(M(),ce)[u>>>3>>>0]=BigInt(f);
break;case"float":(M(),U)[u>>>2>>>0]=f;break;case"double":(M(),X)[u>>>3>>>0]=f;break;case"*":(M(),I)[u>>>2>>>0]=f;break;default:
ne(`invalid type for setValue: ${m}`)}},t.getValue=function(u,f="i8"){switch(f.endsWith("*")&&(f="*"),f){case"i1":case"i\
8":return(M(),R)[u>>>0];case"i16":return(M(),Y)[u>>>1>>>0];case"i32":return(M(),z)[u>>>2>>>0];case"i64":return(M(),ce)[u>>>
3>>>0];case"float":return(M(),U)[u>>>2>>>0];case"double":return(M(),X)[u>>>3>>>0];case"*":return(M(),I)[u>>>2>>>0];default:
ne(`invalid type for getValue: ${f}`)}},t.UTF8ToString=ss,t.stringToUTF8=nr,t.lengthBytesUTF8=ar;var Gd,Vd,Ud,go,$n,kt,Nr,
jd,qd,Wd,Hd,Qd,Xd,Yd,Kd,Jd,Zd,eh,wo,vo,yo,bo,qs,Mo,th,xo,rh,sh,nh,ko,ah,oh,To,_e,Ws,ih,ee,Gn,te,lh,Eo,ch,uh,dh,Ao,hh,fh,
_h,ph,mh,gh,wh,vh,yh,bh,Mh,xh,kh,Th,Eh,Ah,Ch,Sh,Ph,Fh,Ih,Lh,Oh,Nh,Dh,zh,Bh,Rh,$h,Gh,Vh,Uh,jh,qh,Wh,Hh,Qh,Xh,Yh,Kh,Jh,ir,
Hb=[es,Vs,Wu,Ku,Ju,Zu,ed,td,rd,sd,nd,ad,od,id,ld,cd,bd,Md,xd,Od,Nd,Dd,zd,Bd,Rd,$d],Co={1280444:(u,f,m,g,x)=>{if(t===void 0||
!t.ed)return 1;if((u=ss(Number(u>>>0))).startsWith("./")&&(u=u.substring(2)),!(u=t.ed.get(u)))return 2;if(f=Number(f>>>0),
m=Number(m>>>0),g=Number(g>>>0),f+m>u.byteLength)return 3;try{let T=u.subarray(f,f+m);switch(x){case 0:(M(),j).set(T,g>>>
0);break;case 1:t.pe?t.pe(g,T):t.Re(g,T);break;default:return 4}return 0}catch{return 4}},1281268:(u,f,m)=>{t.re(u,(M(),
j).subarray(f>>>0,f+m>>>0))},1281332:()=>t.Pe(),1281374:u=>{t.qe(u)},1281411:()=>typeof wasmOffsetConverter<"u"};function Qb(){
return typeof wasmOffsetConverter<"u"}function Xb(u,f,m,g){var x=te();try{return vh(u,f,m,g)}catch(T){if(ee(x),T!==T+0)throw T;
_e(1,0)}}function Yb(u,f,m){var g=te();try{return mh(u,f,m)}catch(x){if(ee(g),x!==x+0)throw x;_e(1,0)}}function Kb(u){var f=te();
try{hh(u)}catch(m){if(ee(f),m!==m+0)throw m;_e(1,0)}}function Jb(u,f){var m=te();try{return Ao(u,f)}catch(g){if(ee(m),g!==
g+0)throw g;_e(1,0)}}function Zb(u,f,m){var g=te();try{dh(u,f,m)}catch(x){if(ee(g),x!==x+0)throw x;_e(1,0)}}function e0(u,f){
var m=te();try{yh(u,f)}catch(g){if(ee(m),g!==g+0)throw g;_e(1,0)}}function t0(u,f,m,g,x,T,P){var S=te();try{return ph(u,
f,m,g,x,T,P)}catch(D){if(ee(S),D!==D+0)throw D;_e(1,0)}}function r0(u,f,m,g,x,T){var P=te();try{fh(u,f,m,g,x,T)}catch(S){
if(ee(P),S!==S+0)throw S;_e(1,0)}}function s0(u,f,m,g){var x=te();try{wh(u,f,m,g)}catch(T){if(ee(x),T!==T+0)throw T;_e(1,
0)}}function n0(u,f,m,g,x,T,P){var S=te();try{Mh(u,f,m,g,x,T,P)}catch(D){if(ee(S),D!==D+0)throw D;_e(1,0)}}function a0(u,f,m,g,x,T,P){
var S=te();try{xh(u,f,m,g,x,T,P)}catch(D){if(ee(S),D!==D+0)throw D;_e(1,0)}}function o0(u,f,m,g,x,T,P,S){var D=te();try{
Lh(u,f,m,g,x,T,P,S)}catch(q){if(ee(D),q!==q+0)throw q;_e(1,0)}}function i0(u,f,m,g,x,T,P,S,D,q,H,re){var me=te();try{kh(
u,f,m,g,x,T,P,S,D,q,H,re)}catch(Ie){if(ee(me),Ie!==Ie+0)throw Ie;_e(1,0)}}function l0(u,f,m,g,x){var T=te();try{return bh(
u,f,m,g,x)}catch(P){if(ee(T),P!==P+0)throw P;_e(1,0)}}function c0(u,f,m,g,x,T){var P=te();try{Oh(u,f,m,g,x,T)}catch(S){if(ee(
P),S!==S+0)throw S;_e(1,0)}}function u0(u,f,m,g,x){var T=te();try{_h(u,f,m,g,x)}catch(P){if(ee(T),P!==P+0)throw P;_e(1,0)}}
function d0(u,f,m,g,x,T,P,S){var D=te();try{gh(u,f,m,g,x,T,P,S)}catch(q){if(ee(D),q!==q+0)throw q;_e(1,0)}}function h0(u){
var f=te();try{return Nh(u)}catch(m){if(ee(f),m!==m+0)throw m;_e(1,0)}}function f0(u,f,m,g,x,T,P,S,D){var q=te();try{Eh(
u,f,m,g,x,T,P,S,D)}catch(H){if(ee(q),H!==H+0)throw H;_e(1,0)}}function _0(u,f,m){var g=te();try{return Dh(u,f,m)}catch(x){
if(ee(g),x!==x+0)throw x;_e(1,0)}}function p0(u,f){var m=te();try{return Qh(u,f)}catch(g){if(ee(m),g!==g+0)throw g;return _e(
1,0),0n}}function m0(u,f,m,g){var x=te();try{return zh(u,f,m,g)}catch(T){if(ee(x),T!==T+0)throw T;_e(1,0)}}function g0(u){
var f=te();try{return Th(u)}catch(m){if(ee(f),m!==m+0)throw m;return _e(1,0),0n}}function w0(u,f,m,g){var x=te();try{return Bh(
u,f,m,g)}catch(T){if(ee(x),T!==T+0)throw T;_e(1,0)}}function v0(u,f,m,g,x){var T=te();try{return Rh(u,f,m,g,x)}catch(P){
if(ee(T),P!==P+0)throw P;_e(1,0)}}function y0(u,f,m,g,x,T){var P=te();try{return $h(u,f,m,g,x,T)}catch(S){if(ee(P),S!==S+
0)throw S;_e(1,0)}}function b0(u,f,m,g,x,T){var P=te();try{return Fh(u,f,m,g,x,T)}catch(S){if(ee(P),S!==S+0)throw S;_e(1,
0)}}function M0(u,f,m,g,x,T){var P=te();try{return Gh(u,f,m,g,x,T)}catch(S){if(ee(P),S!==S+0)throw S;_e(1,0)}}function x0(u,f,m,g,x,T,P,S){
var D=te();try{return Ih(u,f,m,g,x,T,P,S)}catch(q){if(ee(D),q!==q+0)throw q;_e(1,0)}}function k0(u,f,m,g,x){var T=te();try{
return Vh(u,f,m,g,x)}catch(P){if(ee(T),P!==P+0)throw P;return _e(1,0),0n}}function T0(u,f,m,g){var x=te();try{return Uh(
u,f,m,g)}catch(T){if(ee(x),T!==T+0)throw T;_e(1,0)}}function E0(u,f,m,g){var x=te();try{return jh(u,f,m,g)}catch(T){if(ee(
x),T!==T+0)throw T;_e(1,0)}}function A0(u,f,m,g,x,T,P,S,D,q,H,re){var me=te();try{return qh(u,f,m,g,x,T,P,S,D,q,H,re)}catch(Ie){
if(ee(me),Ie!==Ie+0)throw Ie;_e(1,0)}}function C0(u,f,m,g,x,T,P,S,D,q,H){var re=te();try{Wh(u,f,m,g,x,T,P,S,D,q,H)}catch(me){
if(ee(re),me!==me+0)throw me;_e(1,0)}}function S0(u,f,m,g,x,T,P,S,D,q,H,re,me,Ie,Dr,Hs){var O0=te();try{Hh(u,f,m,g,x,T,P,
S,D,q,H,re,me,Ie,Dr,Hs)}catch(So){if(ee(O0),So!==So+0)throw So;_e(1,0)}}function P0(u,f,m){var g=te();try{return Ch(u,f,
m)}catch(x){if(ee(g),x!==x+0)throw x;return _e(1,0),0n}}function F0(u,f,m){var g=te();try{return Ah(u,f,m)}catch(x){if(ee(
g),x!==x+0)throw x;_e(1,0)}}function I0(u,f,m){var g=te();try{return Sh(u,f,m)}catch(x){if(ee(g),x!==x+0)throw x;_e(1,0)}}
function L0(u,f,m,g){var x=te();try{Ph(u,f,m,g)}catch(T){if(ee(x),T!==T+0)throw T;_e(1,0)}}function Vn(){if(0<Fe)ye=Vn;else if(n)
w?.(t),V();else{for(var u=$e;0<u.length;)u.shift()(t);0<Fe?ye=Vn:(t.calledRun=!0,C||(V(),w?.(t)))}}return n||(ir=await qe(),
Vn()),t.PTR_SIZE=4,t.webgpuInit=u=>{let f=new WeakMap,m,g,x=1;t.webgpuRegisterDevice=S=>{if(g!==void 0)throw Error("anot\
her WebGPU EP inference session is being created.");if(S){var D=f.get(S);if(!D){let q=((H,re=0)=>{var me=eh(re);return re=
Zd(re,me),tt[me>>>0]=H.queue,tt[re>>>0]=H,re})(S,D=Ud());D=[x++,D,q],f.set(S,D)}return m=S,g=D[0],D}m=void 0,g=0};let T=new Map;
t.webgpuOnCreateSession=S=>{if(g!==void 0){var D=g;if(g=void 0,S){let q=go(D);T.set(S,q),D===0&&u(m??J(q))}m=void 0}},t.
webgpuOnReleaseSession=S=>{T.delete(S)};let P=Symbol("gpuBufferMetadata");t.webgpuRegisterBuffer=(S,D,q)=>{if(q)return S[P]=
[q,NaN],q;if(q=S[P])return q[1]++,q[0];if((D=T.get(D))===void 0)throw Error("Invalid session handle passed to webgpuRegi\
sterBuffer");return D=((H,re=0)=>(H.mapState==="unmapped"||ne(),re=Jd(re),tt[re>>>0]=H,re))(S,D),S[P]=[D,1],D},t.webgpuUnregisterBuffer=
S=>{let D=S[P];if(!D)throw Error("Buffer is not registered");D[1]--,D[1]===0&&(jd(D[0]),delete S[P])},t.webgpuGetBuffer=
S=>J(S),t.webgpuCreateDownloader=(S,D,q)=>{if((q=T.get(q))===void 0)throw Error("Invalid session handle passed to webgpu\
RegisterBuffer");let H=J(q),re=16*Math.ceil(Number(D)/16);return async()=>{let me=H.createBuffer({size:re,usage:9});try{
let Ie=H.createCommandEncoder();return Ie.copyBufferToBuffer(S,0,me,0,re),H.queue.submit([Ie.finish()]),await me.mapAsync(
GPUMapMode.READ),me.getMappedRange().slice(0,D)}finally{me.destroy()}}},t.pe=(S,D)=>{var q=D.buffer;let H=D.byteOffset,re=D.
byteLength;if(D=16*Math.ceil(Number(re)/16),S=J(S),!m){var me=go(g);m=J(me)}let Ie=(me=m.createBuffer({mappedAtCreation:!0,
size:D,usage:6})).getMappedRange();new Uint8Array(Ie).set(new Uint8Array(q,H,re)),me.unmap(),(q=m.createCommandEncoder()).
copyBufferToBuffer(me,0,S,0,D),m.queue.submit([q.finish()]),me.destroy()}},t.webnnInit=u=>{let f=u[0];[t.Pe,t.qe,t.webnnEnsureTensor,
t.re,t.webnnDownloadTensor,t.Oe,t.webnnEnableTraceEvent]=u.slice(1),t.webnnReleaseTensorId=t.qe,t.webnnUploadTensor=t.re,
t.webnnRegisterMLContext=t.Oe,t.webnnOnRunStart=m=>f.onRunStart(m),t.webnnOnRunEnd=f.onRunEnd.bind(f),t.webnnOnReleaseSession=
m=>{f.onReleaseSession(m)},t.webnnCreateMLTensorDownloader=(m,g)=>f.createMLTensorDownloader(m,g),t.webnnRegisterMLTensor=
(m,g,x,T)=>f.registerMLTensor(m,g,x,T),t.webnnCreateMLContext=m=>f.createMLContext(m),t.webnnRegisterGraphInput=f.registerGraphInput.
bind(f),t.webnnIsGraphInput=f.isGraphInput.bind(f),t.webnnRegisterGraphOutput=f.registerGraphOutput.bind(f),t.webnnIsGraphOutput=
f.isGraphOutput.bind(f),t.webnnCreateTemporaryTensor=f.createTemporaryTensor.bind(f),t.webnnIsGraphInputOutputTypeSupported=
f.isGraphInputOutputTypeSupported.bind(f)},L?t:new Promise((u,f)=>{w=u,v=f})}var ap,tf,eM=ge(()=>{"use strict";ap=ef,tf=
globalThis.self?.name?.startsWith("em-pthread"),tf&&ef()}),No,fi,rf,gt,op,jn,sf,nf,Do,af,zo,ip,Bo,lp,Di=ge(()=>{"use str\
ict";Ni(),No=typeof location>"u"?void 0:location.origin,fi=import.meta.url>"file:"&&import.meta.url<"file;",rf=()=>{if(fi){
let e=URL;return new URL(new e("ort.webgpu.bundle.min.mjs",import.meta.url).href,No).href}return import.meta.url},gt=rf(),
op=()=>{if(gt&&!gt.startsWith("blob:"))return gt.substring(0,gt.lastIndexOf("/")+1)},jn=(e,t)=>{try{let r=t??gt;return(r?
new URL(e,r):new URL(e)).origin===No}catch{return!1}},sf=(e,t)=>{let r=t??gt;try{return(r?new URL(e,r):new URL(e)).href}catch{
return}},nf=(e,t)=>`${t??"./"}${e}`,Do=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.
createObjectURL(t)},af=async e=>(await import(e)).default,zo=(Z0(),oa(rp)).default,ip=async()=>{if(!gt)throw new Error("\
Failed to load proxy worker: cannot determine the script source URL.");if(jn(gt))return[void 0,zo()];let e=await Do(gt);
return[e,zo(e)]},Bo=(eM(),oa(np)).default,lp=async(e,t,r,s)=>{let n=Bo&&!(e||t);if(n)if(gt)n=jn(gt)||s&&!r;else if(s&&!r)
n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,Bo];{let a="ort-wasm-simd-thread\
ed.asyncify.mjs",o=e??sf(a,t),i=r&&o&&!jn(o,t),l=i?await Do(o):o??nf(a,t);return[i?l:void 0,await af(l)]}}}),Ro,qn,Xs,$o,
of,lf,cf,zi,Le,Yr=ge(()=>{"use strict";Di(),qn=!1,Xs=!1,$o=!1,of=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<
"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,
1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},lf=()=>{try{return WebAssembly.
validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},cf=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,
0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},zi=async e=>{
if(qn)return Promise.resolve();if(Xs)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if($o)throw new Error(
"previous call to 'initializeWebAssembly()' failed.");Xs=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd===
"relaxed"){if(!cf())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!lf())
throw new Error("WebAssembly SIMD is not supported in the current environment.")}let s=of();r>1&&!s&&(typeof self<"u"&&!self.
crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOr\
iginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-th\
reading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,
a=typeof n=="string"?n:void 0,o=n?.mjs,i=o?.href??o,l=n?.wasm,c=l?.href??l,d=e.wasmBinary,[h,_]=await lp(i,a,r>1,!!d||!!c),
p=!1,w=[];if(t>0&&w.push(new Promise(v=>{setTimeout(()=>{p=!0,v()},t)})),w.push(new Promise((v,y)=>{let b={numThreads:r};
if(d)b.wasmBinary=d,b.locateFile=k=>k;else if(c||a)b.locateFile=k=>c??a+k;else if(i&&i.indexOf("blob:")!==0)b.locateFile=
k=>new URL(k,i).href;else if(h){let k=op();k&&(b.locateFile=A=>k+A)}_(b).then(k=>{Xs=!1,qn=!0,Ro=k,v(),h&&URL.revokeObjectURL(
h)},k=>{Xs=!1,$o=!0,y(k)})})),await Promise.race(w),p)throw new Error(`WebAssembly backend initializing failed due to ti\
meout: ${t}ms`)},Le=()=>{if(qn&&Ro)return Ro;throw new Error("WebAssembly is not initialized yet.")}}),wt,la,xe,Bi=ge(()=>{
"use strict";Yr(),wt=(e,t)=>{let r=Le(),s=r.lengthBytesUTF8(e)+1,n=r._malloc(s);return r.stringToUTF8(e,n,s),t.push(n),n},
la=(e,t,r,s)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.
entries(e).forEach(([n,a])=>{let o=t?t+n:n;if(typeof a=="object")la(a,o+".",r,s);else if(typeof a=="string"||typeof a=="\
number")s(o,a.toString());else if(typeof a=="boolean")s(o,a?"1":"0");else throw new Error(`Can't handle extra config typ\
e: ${typeof a}`)})},xe=e=>{let t=Le(),r=t.stackSave();try{let s=t.PTR_SIZE,n=t.stackAlloc(2*s);t._OrtGetLastError(n,n+s);
let a=Number(t.getValue(n,s===4?"i32":"i64")),o=t.getValue(n+s,"*"),i=o?t.UTF8ToString(o):"";throw new Error(`${e} ERROR\
_CODE: ${a}, ERROR_MESSAGE: ${i}`)}finally{t.stackRestore(r)}}}),cp,tM=ge(()=>{"use strict";Yr(),Bi(),cp=e=>{let t=Le(),
r=0,s=[],n=e||{};try{if(e?.logSeverityLevel===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.
isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not val\
id: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="\
number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);
e?.terminate===void 0&&(n.terminate=!1);let a=0;return e?.tag!==void 0&&(a=wt(e.tag,s)),r=t._OrtCreateRunOptions(n.logSeverityLevel,
n.logVerbosityLevel,!!n.terminate,a),r===0&&xe("Can't create run options."),e?.extra!==void 0&&la(e.extra,"",new WeakSet,
(o,i)=>{let l=wt(o,s),c=wt(i,s);t._OrtAddRunConfigEntry(r,l,c)!==0&&xe(`Can't set a run config entry: ${o} - ${i}.`)}),[
r,s]}catch(a){throw r!==0&&t._OrtReleaseRunOptions(r),s.forEach(o=>t._free(o)),a}}}),uf,df,hf,is,Xt,ff,up,rM=ge(()=>{"us\
e strict";Yr(),Bi(),uf=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"\
all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},df=e=>{switch(e){case"sequential":
return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},hf=e=>{e.extra||(e.extra=
{}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly=
"1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},
is=(e,t,r,s)=>{let n=wt(t,s),a=wt(r,s);Le()._OrtAddSessionConfigEntry(e,n,a)!==0&&xe(`Can't set a session config entry: ${t}\
 - ${r}.`)},Xt=(e,t,r,s)=>{let n=wt(t,s),a=wt(r,s);e.push([n,a])},ff=async(e,t,r)=>{let s=t.executionProviders;for(let n of s){
let a=typeof n=="string"?n:n.name,o=[];switch(a){case"webnn":if(a="WEBNN",is(e,"session.disable_quant_qdq","1",r),is(e,"\
session.disable_qdq_constant_folding","1",r),typeof n!="string"){let h=n?.deviceType;h&&is(e,"deviceType",h,r)}break;case"\
webgpu":{a="WebGPU";let h;if(typeof n!="string"){let p=n;if(p.device)if(typeof GPUDevice<"u"&&p.device instanceof GPUDevice)
h=p.device;else throw new Error("Invalid GPU device set in WebGPU EP options.");let{enableGraphCapture:w}=t;if(typeof w==
"boolean"&&w&&Xt(o,"enableGraphCapture","1",r),typeof p.preferredLayout=="string"&&Xt(o,"preferredLayout",p.preferredLayout,
r),p.forceCpuNodeNames){let v=Array.isArray(p.forceCpuNodeNames)?p.forceCpuNodeNames:[p.forceCpuNodeNames];Xt(o,"forceCp\
uNodeNames",v.join(`
`),r)}p.validationMode&&Xt(o,"validationMode",p.validationMode,r),typeof p.enableMatmulFp32Accumulation=="boolean"&&Xt(o,
"enableMatmulFp32Accumulation",p.enableMatmulFp32Accumulation?"1":"0",r);for(let v of["storageBufferCacheMode","uniformB\
ufferCacheMode","queryResolveBufferCacheMode","defaultBufferCacheMode"]){let y=p[v];if(y){if(y!=="disabled"&&y!=="lazyRe\
lease"&&y!=="simple"&&y!=="bucket")throw new Error(`${v} must be one of 'disabled', 'lazyRelease', 'simple' or 'bucket':\
 ${y}`);Xt(o,v,y,r)}}}let _=Le().webgpuRegisterDevice(h);if(_){let[p,w,v]=_;Xt(o,"deviceId",p.toString(),r),Xt(o,"webgpu\
Instance",w.toString(),r),Xt(o,"webgpuDevice",v.toString(),r)}}break;case"wasm":case"cpu":continue;default:throw new Error(
`not supported execution provider: ${a}`)}let i=wt(a,r),l=o.length,c=0,d=0;if(l>0){c=Le()._malloc(l*Le().PTR_SIZE),r.push(
c),d=Le()._malloc(l*Le().PTR_SIZE),r.push(d);for(let h=0;h<l;h++)Le().setValue(c+h*Le().PTR_SIZE,o[h][0],"*"),Le().setValue(
d+h*Le().PTR_SIZE,o[h][1],"*")}await Le()._OrtAppendExecutionProvider(e,i,c,d,l)!==0&&xe(`Can't append execution provide\
r: ${a}.`)}},up=async e=>{let t=Le(),r=0,s=[],n=e||{};hf(n);try{let a=uf(n.graphOptimizationLevel??"all"),o=df(n.executionMode??
"sequential"),i=typeof n.logId=="string"?wt(n.logId,s):0,l=n.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(
`log severity level is not valid: ${l}`);let c=n.logVerbosityLevel??0;if(!Number.isInteger(c)||c<0||c>4)throw new Error(
`log verbosity level is not valid: ${c}`);let d=typeof n.optimizedModelFilePath=="string"?wt(n.optimizedModelFilePath,s):
0;if(r=t._OrtCreateSessionOptions(a,!!n.enableCpuMemArena,!!n.enableMemPattern,o,!!n.enableProfiling,0,i,l,c,d),r===0&&xe(
"Can't create session options."),n.executionProviders&&await ff(r,n,s),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!=
"boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);is(r,"enableGraphCaptur\
e",n.enableGraphCapture.toString(),s)}if(n.freeDimensionOverrides)for(let[h,_]of Object.entries(n.freeDimensionOverrides)){
if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof _!="number"||!Number.
isInteger(_)||_<0)throw new Error(`free dimension override value must be a non-negative integer: ${_}`);let p=wt(h,s);t.
_OrtAddFreeDimensionOverride(r,p,_)!==0&&xe(`Can't set a free dimension override: ${h} - ${_}.`)}return n.extra!==void 0&&
la(n.extra,"",new WeakSet,(h,_)=>{is(r,h,_,s)}),[r,s]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&xe("Can'\
t release session options."),s.forEach(o=>t._free(o)),a}}}),Ur,ta,fs,sn,ca,Ri,$i,_i,ks=ge(()=>{"use strict";Ur=e=>{switch(e){case"\
int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"\
uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int6\
4":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data \
type: ${e}`)}},ta=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:
return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"\
float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:
throw new Error(`unsupported data type: ${e}`)}},fs=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,
.5][e],s=typeof t=="number"?t:t.reduce((n,a)=>n*a,1);return r>0?Math.ceil(s*r):void 0},sn=e=>{switch(e){case"float16":return typeof Float16Array<
"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"\
uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"\
float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:
throw new Error(`unsupported type: ${e}`)}},ca=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"\
error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Ri=e=>e==="float32"||e===
"float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",$i=e=>e==="float32"||
e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e===
"int4",_i=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu\
-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Gi,dp=ge(()=>{
"use strict";Ni(),Gi=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load exte\
rnal data file: ${e}`);let r=t.headers.get("Content-Length"),s=r?parseInt(r,10):0;if(s<1073741824)return new Uint8Array(
await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.
body.getReader(),a;try{a=new ArrayBuffer(s)}catch(i){if(i instanceof RangeError){let l=Math.ceil(s/65536);a=new WebAssembly.
Memory({initial:l,maximum:l}).buffer}else throw i}let o=0;for(;;){let{done:i,value:l}=await n.read();if(i)break;let c=l.
byteLength;new Uint8Array(a,o,c).set(l),o+=c}return new Uint8Array(a,0,s)}}else return e instanceof Blob?new Uint8Array(
await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),hp,sM=ge(()=>{"use strict";ks(),hp=(e,t)=>new(sn(t))(
e)}),_f,pf,mf,gf,fp,wf,ht,_p=ge(()=>{"use strict";ks(),_f=["V","I","W","E","F"],pf=(e,t)=>{console.log(`[${_f[e]},${new Date().
toISOString()}]${t}`)},fp=(e,t)=>{mf=e,gf=t},wf=(e,t)=>{let r=ca(e),s=ca(mf);r>=s&&pf(r,typeof t=="function"?t():t)},ht=
(...e)=>{gf&&wf(...e)}}),Go,vf,Vo,yf,Uo,bf,jo,qo,Wo,Mf,pp,nM=ge(()=>{"use strict";ks(),_p(),Go=new Map([["float32",32],[
"float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),vf=(e,t)=>{
if(t==="int32")return e;let r=Go.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let s=r/
8;if(e.byteLength%s!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${s}.`);let n=e.byteLength/s,
a=new(sn(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let o=new Int32Array(n);for(let i=0;i<n;i++){let l=a[i];
if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");o[i]=Number(
l)}return new Uint8Array(o.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(i=>i>2147483647))throw new Error(
"Can not convert uint32 data to int32 - value out of range.");let o=Int32Array.from(a,Number);return new Uint8Array(o.buffer)}default:
throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Vo=(e,t)=>{if(t==="int32")return e;if(e.byteLength%
4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,s=new Int32Array(
e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(s,BigInt);return new Uint8Array(n.buffer)}case"\
uint64":{if(s.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.
from(s,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(s.some(a=>a<-128||a>127))throw new Error("Can not convert \
int32 data to int8 - value out of range.");let n=Int8Array.from(s,Number);return new Uint8Array(n.buffer)}case"uint8":{if(s.
some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(
s,Number)}case"uint32":{if(s.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");
let n=Uint32Array.from(s,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion fr\
om 'int32' to ${t}`)}},yf=1,Uo=()=>yf++,bf=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int3\
2"]]),jo=(e,t)=>{let r=Go.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>
0?Math.ceil(t.reduce((s,n)=>s*n)*r/8):0},qo=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:s,
dataType:n,shape:a,fallbackDataType:o}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=s,this.dataType=n,this.tensorShape=
a,this.fallbackDataType=o}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.
fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return jo(this.dataType,this.tensorShape)}destroy(){
ht("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,
e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Vo(new Uint8Array(t),this.
dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else
return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.
mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.
every((s,n)=>s===r[n])}setIsDataConverted(e){this.isDataConverted=e}},Wo=class{constructor(e,t){this.tensorManager=e,this.
wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(
this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,s){let n=this.tensorManager.getMLContext(e),a=this.tensorManager.
getMLOpSupportLimits(e),o;if(!a?.input.dataTypes.includes(t)){if(o=bf.get(t),!o||!a?.input.dataTypes.includes(o))throw new Error(
`WebNN backend does not support data type: ${t}`);ht("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataT\
ype from ${t} to ${o}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(s){if(this.
wrapper.byteLength!==jo(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(
await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let i=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.
READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,i,!0,!0,o),s&&this.activeUpload&&
(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){
if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=vf(e,this.wrapper.type),this.wrapper.setIsDataConverted(
!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.
byteLength){this.wrapper.write(t);return}else ht("verbose",()=>"Data size does not match tensor size. Releasing tensor."),
this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.
activeUpload){let t=this.wrapper?.isDataConverted?Vo(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof
ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}
if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Mf=
class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){
let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){
return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=Uo();return this.tensorTrackersById.set(e,new Wo(this)),
e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(
t.tensorWrapper))}async ensureTensor(e,t,r,s,n){ht("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, da\
taType: ${r}, shape: ${s}, copyOld: ${n}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found\
.");return a.ensureTensor(e,r,s,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not fo\
und.");r.upload(t)}async download(e,t){ht("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.
byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){
for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,s){
let n=this.getMLContext(e),a=Uo(),o=new qo({sessionId:e,context:n,tensor:t,dataType:r,shape:s});return this.tensorTrackersById.
set(a,new Wo(this,o)),this.externalTensors.add(o),a}async getCachedTensor(e,t,r,s,n,a,o){let i=this.getMLContext(e);for(let[
c,d]of this.freeTensors.entries())if(d.canReuseTensor(i,t,r)){ht("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${o?
`fallbackDataType: ${o},`:""} shape: ${r}`);let h=this.freeTensors.splice(c,1)[0];return h.sessionId=e,h}ht("verbose",()=>`\
[WebNN] MLContext.createTensor {dataType: ${t}, ${o?`fallbackDataType: ${o},`:""} shape: ${r}}`);let l=await i.createTensor(
{dataType:o??t,shape:r,dimensions:r,usage:s,writable:n,readable:a});return new qo({sessionId:e,context:i,tensor:l,dataType:t,
shape:r,fallbackDataType:o})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.
push(e)}},pp=(...e)=>new Mf(...e)}),mp={};dn(mp,{WebNNBackend:()=>gp});var Ys,xf,gp,aM=ge(()=>{"use strict";ks(),Yr(),sM(),
nM(),_p(),Ys=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"\
uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),xf=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.
keys(e).sort(),s=Object.keys(t).sort();return r.length===s.length&&r.every((n,a)=>n===s[a]&&e[n]===t[n])},gp=class{constructor(e){
this.tensorManager=pp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],
this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=
[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,fp(e.logLevel,!!e.debug)}get currentSessionId(){
if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ht("verb\
ose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ht("verbose",()=>`[WebNN] onRunEnd {\
sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ht("verbose",()=>`[WebNN] releasing \
temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.
activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(s=>s.gpuDevice===
e);if(r!==-1)return this.mlContextCache[r].mlContext;{let s=await navigator.ml.createContext(e);return this.mlContextCache.
push({gpuDevice:e,mlContext:s}),s}}else if(e===void 0){let r=this.mlContextCache.findIndex(s=>s.options===void 0&&s.gpuDevice===
void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let s=await navigator.ml.createContext();return this.mlContextCache.
push({mlContext:s}),s}}let t=this.mlContextCache.findIndex(r=>xf(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;
{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){
this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(
t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.
temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.
temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){
this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;
this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(
e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let s=this.mlContextCache.
findIndex(n=>n.mlContext===t);s!==-1&&this.mlContextCache.splice(s,1)}}getMLContext(e){return this.mlContextBySessionId.
get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.
reserveTensorId()}releaseTensorId(e){ht("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(
e)}async ensureTensor(e,t,r,s,n){let a=Ys.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.
ensureTensor(e??this.currentSessionId,t,a,s,n)}async createTemporaryTensor(e,t,r){ht("verbose",()=>`[WebNN] createTempor\
aryTensor {onnxDataType: ${t}, shape: ${r}}`);let s=Ys.get(t);if(!s)throw new Error(`Unsupported ONNX data type: ${t}`);
let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,s,r,!1);let a=this.temporarySessionTensorIds.
get(e);return a?a.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!Le().shouldTransferToMLTensor)
throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ht("verbose",()=>`[WebNN] uplo\
adTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.
tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return hp(
r,t)}}registerMLTensor(e,t,r,s){let n=Ys.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.
registerTensor(e,t,n,s);return ht("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${s}\
} -> {tensorId: ${a}}`),a}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.
push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.
get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let s=Ys.get(Ur(t)),n=this.mlOpSupportLimitsBySessionId.
get(e);return typeof s>"u"?!1:r?!!n?.input.dataTypes.includes(s):!!n?.output.dataTypes.includes(s)}flush(){}}}),kf,Vi,Ui,
wr,Tf,Ho,ua,ji,qi,Qo,Wi,Hi,Qi,wp=ge(()=>{"use strict";Xr(),tM(),rM(),ks(),Yr(),Bi(),dp(),kf=(e,t)=>{Le()._OrtInit(e,t)!==
0&&xe("Can't initialize onnxruntime.")},Vi=async e=>{kf(e.wasm.numThreads,ca(e.logLevel))},Ui=async(e,t)=>{Le().asyncInit?.();
let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported\
 in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="func\
tion")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let s=e.webgpu.
powerPreference;if(s!==void 0&&s!=="low-power"&&s!=="high-performance")throw new Error(`Invalid powerPreference setting:\
 "${s}"`);let n=e.webgpu.forceFallbackAdapter;if(n!==void 0&&typeof n!="boolean")throw new Error(`Invalid forceFallbackA\
dapter setting: "${n}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:s,forceFallbackAdapter:n}),!r)throw new Error(
'Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="web\
nn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");if(t==="webg\
pu"&&Le().webgpuInit(s=>{e.webgpu.device=s}),t==="webnn"){let s=new(aM(),oa(mp)).WebNNBackend(e);Le().webnnInit([s,()=>s.
reserveTensorId(),n=>s.releaseTensorId(n),async(n,a,o,i,l)=>s.ensureTensor(n,a,o,i,l),(n,a)=>{s.uploadTensor(n,a)},async(n,a)=>s.
downloadTensor(n,a),(n,a)=>s.registerMLContext(n,a),!!e.trace])}},wr=new Map,Tf=e=>{let t=Le(),r=t.stackSave();try{let s=t.
PTR_SIZE,n=t.stackAlloc(2*s);t._OrtGetInputOutputCount(e,n,n+s)!==0&&xe("Can't get session input/output count.");let a=s===
4?"i32":"i64";return[Number(t.getValue(n,a)),Number(t.getValue(n+s,a))]}finally{t.stackRestore(r)}},Ho=(e,t)=>{let r=Le(),
s=r.stackSave(),n=0;try{let a=r.PTR_SIZE,o=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,o,o+a)!==0&&xe("Can't get \
session input/output metadata.");let i=Number(r.getValue(o,"*"));n=Number(r.getValue(o+a,"*"));let l=r.HEAP32[n/4];if(l===
0)return[i,0];let c=r.HEAPU32[n/4+1],d=[];for(let h=0;h<c;h++){let _=Number(r.getValue(n+8+h*a,"*"));d.push(_!==0?r.UTF8ToString(
_):Number(r.getValue(n+8+(h+c)*a,"*")))}return[i,l,d]}finally{r.stackRestore(s),n!==0&&r._OrtFree(n)}},ua=e=>{let t=Le(),
r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}\
.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},ji=async(e,t)=>{let r,s,n=Le();Array.isArray(e)?[r,s]=e:e.buffer===n.HEAPU8.
buffer?[r,s]=[e.byteOffset,e.byteLength]:[r,s]=ua(e);let a=0,o=0,i=0,l=[],c=[],d=[];try{if([o,l]=await up(t),t?.externalData&&
n.mountExternalData){let E=[];for(let C of t.externalData){let N=typeof C=="string"?C:C.path,M=typeof C=="string"?C:C.data;
E.push(Gi(M).then($=>{n.mountExternalData(N,$)}))}await Promise.all(E)}for(let E of t?.executionProviders??[])if((typeof E==
"string"?E:E.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof E!="string"){let C=E,N=C?.context,M=C?.gpuDevice,$=C?.
deviceType,R=C?.powerPreference;N?n.currentContext=N:M?n.currentContext=await n.webnnCreateMLContext(M):n.currentContext=
await n.webnnCreateMLContext({deviceType:$,powerPreference:R})}else n.currentContext=await n.webnnCreateMLContext();break}
a=await n._OrtCreateSession(r,s,o),n.webgpuOnCreateSession?.(a),a===0&&xe("Can't create a session."),n.jsepOnCreateSession?.(),
n.currentContext&&(n.webnnRegisterMLContext(a,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[
h,_]=Tf(a),p=!!t?.enableGraphCapture,w=[],v=[],y=[],b=[],k=[];for(let E=0;E<h;E++){let[C,N,M]=Ho(a,E);C===0&&xe("Can't g\
et an input name."),c.push(C);let $=n.UTF8ToString(C);w.push($),y.push(N===0?{name:$,isTensor:!1}:{name:$,isTensor:!0,type:ta(
N),shape:M})}for(let E=0;E<_;E++){let[C,N,M]=Ho(a,E+h);C===0&&xe("Can't get an output name."),d.push(C);let $=n.UTF8ToString(
C);v.push($),b.push(N===0?{name:$,isTensor:!1}:{name:$,isTensor:!0,type:ta(N),shape:M});{if(p&&t?.preferredOutputLocation===
void 0){k.push("gpu-buffer");continue}let R=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[$]??
"cpu",j=n.webnnIsGraphOutput;if(R==="cpu"&&j&&j(a,$)){k.push("ml-tensor-cpu-output");continue}if(R!=="cpu"&&R!=="cpu-pin\
ned"&&R!=="gpu-buffer"&&R!=="ml-tensor")throw new Error(`Not supported preferred output location: ${R}.`);if(p&&R!=="gpu\
-buffer")throw new Error(`Not supported preferred output location: ${R}. Only 'gpu-buffer' location is supported when en\
ableGraphCapture is true.`);k.push(R)}}let A=null;return k.some(E=>E==="gpu-buffer"||E==="ml-tensor"||E==="ml-tensor-cpu\
-output")&&(i=n._OrtCreateBinding(a),i===0&&xe("Can't create IO binding."),A={handle:i,outputPreferredLocations:k,outputPreferredLocationsEncoded:k.
map(E=>E==="ml-tensor-cpu-output"?"ml-tensor":E).map(E=>_i(E))}),wr.set(a,[a,c,d,A,p,!1]),[a,w,v,y,b]}catch(h){throw c.forEach(
_=>n._OrtFree(_)),d.forEach(_=>n._OrtFree(_)),i!==0&&n._OrtReleaseBinding(i)!==0&&xe("Can't release IO binding."),a!==0&&
n._OrtReleaseSession(a)!==0&&xe("Can't release session."),h}finally{n._free(r),o!==0&&n._OrtReleaseSessionOptions(o)!==0&&
xe("Can't release session options."),l.forEach(h=>n._free(h)),n.unmountExternalData?.()}},qi=e=>{let t=Le(),r=wr.get(e);
if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[s,n,a,o,i]=r;o&&(i&&t._OrtClearBoundOutputs(
o.handle)!==0&&xe("Can't clear bound outputs."),t._OrtReleaseBinding(o.handle)!==0&&xe("Can't release IO binding.")),t.jsepOnReleaseSession?.(
e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),n.forEach(l=>t._OrtFree(l)),a.forEach(l=>t._OrtFree(l)),t.
_OrtReleaseSession(s)!==0&&xe("Can't release session."),wr.delete(e)},Qo=async(e,t,r,s,n,a,o=!1)=>{if(!e){t.push(0);return}
let i=Le(),l=i.PTR_SIZE,c=e[0],d=e[1],h=e[3],_=h,p,w;if(c==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error(
"String tensor is not supported on GPU.");if(o&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for i\
nput/output index ${a} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let b=e[2].gpuBuffer;w=fs(Ur(c),d);{let k=i.
webgpuRegisterBuffer;if(!k)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');p=k(b,
s)}}else if(h==="ml-tensor"){let b=e[2].mlTensor;w=fs(Ur(c),d);let k=i.webnnRegisterMLTensor;if(!k)throw new Error('Tens\
or location "ml-tensor" is not supported without using WebNN.');p=k(s,b,Ur(c),d)}else{let b=e[2];if(Array.isArray(b)){w=
l*b.length,p=i._malloc(w),r.push(p);for(let k=0;k<b.length;k++){if(typeof b[k]!="string")throw new TypeError(`tensor dat\
a at index ${k} is not a string`);i.setValue(p+k*l,wt(b[k],r),"*")}}else{let k=i.webnnIsGraphInput,A=i.webnnIsGraphOutput;
if(c!=="string"&&k&&A){let E=i.UTF8ToString(n);if(k(s,E)||A(s,E)){let C=Ur(c);w=fs(C,d),_="ml-tensor";let N=i.webnnCreateTemporaryTensor,
M=i.webnnUploadTensor;if(!N||!M)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let $=await N(
s,C,d);M($,new Uint8Array(b.buffer,b.byteOffset,b.byteLength)),p=$}else w=b.byteLength,p=i._malloc(w),r.push(p),i.HEAPU8.
set(new Uint8Array(b.buffer,b.byteOffset,w),p)}else w=b.byteLength,p=i._malloc(w),r.push(p),i.HEAPU8.set(new Uint8Array(
b.buffer,b.byteOffset,w),p)}}let v=i.stackSave(),y=i.stackAlloc(4*d.length);try{d.forEach((k,A)=>i.setValue(y+A*l,k,l===
4?"i32":"i64"));let b=i._OrtCreateTensor(Ur(c),p,w,y,d.length,_i(_));b===0&&xe(`Can't create tensor for input/output. se\
ssion=${s}, index=${a}.`),t.push(b)}finally{i.stackRestore(v)}},Wi=async(e,t,r,s,n,a)=>{let o=Le(),i=o.PTR_SIZE,l=wr.get(
e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let c=l[0],d=l[1],h=l[2],_=l[3],p=l[4],w=l[5],
v=t.length,y=s.length,b=0,k=[],A=[],E=[],C=[],N=[],M=o.stackSave(),$=o.stackAlloc(v*i),R=o.stackAlloc(v*i),j=o.stackAlloc(
y*i),Y=o.stackAlloc(y*i);try{[b,k]=cp(a),Er("wasm prepareInputOutputTensor");for(let U=0;U<v;U++)await Qo(r[U],A,C,e,d[t[U]],
t[U],p);for(let U=0;U<y;U++)await Qo(n[U],E,C,e,h[s[U]],v+s[U],p);Ar("wasm prepareInputOutputTensor");for(let U=0;U<v;U++)
o.setValue($+U*i,A[U],"*"),o.setValue(R+U*i,d[t[U]],"*");for(let U=0;U<y;U++)o.setValue(j+U*i,E[U],"*"),o.setValue(Y+U*i,
h[s[U]],"*");if(_&&!w){let{handle:U,outputPreferredLocations:X,outputPreferredLocationsEncoded:ce}=_;if(d.length!==v)throw new Error(
`input count from feeds (${v}) is expected to be always equal to model's input count (${d.length}).`);Er("wasm bindInput\
sOutputs");for(let Z=0;Z<v;Z++){let se=t[Z];await o._OrtBindInput(U,d[se],A[Z])!==0&&xe(`Can't bind input[${Z}] for sess\
ion=${e}.`)}for(let Z=0;Z<y;Z++){let se=s[Z];n[Z]?.[3]?(N.push(E[Z]),o._OrtBindOutput(U,h[se],E[Z],0)!==0&&xe(`Can't bin\
d pre-allocated output[${Z}] for session=${e}.`)):o._OrtBindOutput(U,h[se],0,ce[se])!==0&&xe(`Can't bind output[${Z}] to\
 ${X[Z]} for session=${e}.`)}Ar("wasm bindInputsOutputs"),wr.set(e,[c,d,h,_,p,!0])}o.jsepOnRunStart?.(c),o.webnnOnRunStart?.(
c);let Q;_?Q=await o._OrtRunWithBinding(c,_.handle,y,j,b):Q=await o._OrtRun(c,R,$,v,Y,y,j,b),Q!==0&&xe("failed to call O\
rtRun().");let z=[],I=[];Er("wasm ProcessOutputTensor");for(let U=0;U<y;U++){let X=Number(o.getValue(j+U*i,"*"));if(X===
E[U]||N.includes(E[U])){z.push(n[U]),X!==E[U]&&o._OrtReleaseTensor(X)!==0&&xe("Can't release tensor.");continue}let ce=o.
stackSave(),Z=o.stackAlloc(4*i),se=!1,L,O=0;try{o._OrtGetTensorData(X,Z,Z+i,Z+2*i,Z+3*i)!==0&&xe(`Can't access output te\
nsor data on index ${U}.`);let V=i===4?"i32":"i64",ne=Number(o.getValue(Z,V));O=o.getValue(Z+i,"*");let ae=o.getValue(Z+
i*2,"*"),qe=Number(o.getValue(Z+i*3,V)),Ee=[];for(let Fe=0;Fe<qe;Fe++)Ee.push(Number(o.getValue(ae+Fe*i,V)));o._OrtFree(
ae)!==0&&xe("Can't free memory for tensor dims.");let Ae=Ee.reduce((Fe,ye)=>Fe*ye,1);L=ta(ne);let $e=_?.outputPreferredLocations[s[U]];
if(L==="string"){if($e==="gpu-buffer"||$e==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Fe=[];
for(let ye=0;ye<Ae;ye++){let it=o.getValue(O+ye*i,"*"),be=o.getValue(O+(ye+1)*i,"*"),Me=ye===Ae-1?void 0:be-it;Fe.push(o.
UTF8ToString(it,Me))}z.push([L,Ee,Fe,"cpu"])}else if($e==="gpu-buffer"&&Ae>0){let Fe=o.webgpuGetBuffer;if(!Fe)throw new Error(
'preferredLocation "gpu-buffer" is not supported without using WebGPU.');let ye=Fe(O),it=fs(ne,Ae);if(it===void 0||!Ri(L))
throw new Error(`Unsupported data type: ${L}`);se=!0;{o.webgpuRegisterBuffer(ye,e,O);let be=o.webgpuCreateDownloader(ye,
it,e);z.push([L,Ee,{gpuBuffer:ye,download:async()=>{let Me=await be();return new(sn(L))(Me)},dispose:()=>{o._OrtReleaseTensor(
X)!==0&&xe("Can't release tensor.")}},"gpu-buffer"])}}else if($e==="ml-tensor"&&Ae>0){let Fe=o.webnnEnsureTensor,ye=o.webnnIsGraphInputOutputTypeSupported;
if(!Fe||!ye)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(fs(ne,Ae)===void 0||
!$i(L))throw new Error(`Unsupported data type: ${L}`);if(!ye(e,L,!1))throw new Error(`preferredLocation "ml-tensor" for ${L}\
 output is not supported by current WebNN Context.`);let it=await Fe(e,O,ne,Ee,!1);se=!0,z.push([L,Ee,{mlTensor:it,download:o.
webnnCreateMLTensorDownloader(O,L),dispose:()=>{o.webnnReleaseTensorId(O),o._OrtReleaseTensor(X)}},"ml-tensor"])}else if($e===
"ml-tensor-cpu-output"&&Ae>0){let Fe=o.webnnCreateMLTensorDownloader(O,L)(),ye=z.length;se=!0,I.push((async()=>{let it=[
ye,await Fe];return o.webnnReleaseTensorId(O),o._OrtReleaseTensor(X),it})()),z.push([L,Ee,[],"cpu"])}else{let Fe=sn(L),ye=new Fe(
Ae);new Uint8Array(ye.buffer,ye.byteOffset,ye.byteLength).set(o.HEAPU8.subarray(O,O+ye.byteLength)),z.push([L,Ee,ye,"cpu"])}}finally{
o.stackRestore(ce),L==="string"&&O&&o._free(O),se||o._OrtReleaseTensor(X)}}_&&!p&&(o._OrtClearBoundOutputs(_.handle)!==0&&
xe("Can't clear bound outputs."),wr.set(e,[c,d,h,_,p,!1]));for(let[U,X]of await Promise.all(I))z[U][2]=X;return Ar("wasm\
 ProcessOutputTensor"),z}finally{o.webnnOnRunEnd?.(c),o.stackRestore(M),r.forEach(Q=>{Q&&Q[3]==="gpu-buffer"&&o.webgpuUnregisterBuffer(
Q[2].gpuBuffer)}),n.forEach(Q=>{Q&&Q[3]==="gpu-buffer"&&o.webgpuUnregisterBuffer(Q[2].gpuBuffer)}),A.forEach(Q=>o._OrtReleaseTensor(
Q)),E.forEach(Q=>o._OrtReleaseTensor(Q)),C.forEach(Q=>o._free(Q)),b!==0&&o._OrtReleaseRunOptions(b),k.forEach(Q=>o._free(
Q))}},Hi=e=>{let t=Le(),r=wr.get(e);if(!r)throw new Error("invalid session id");let s=r[0],n=t._OrtEndProfiling(s);n===0&&
xe("Can't get an profile file name."),t._OrtFree(n)},Qi=e=>{let t=[];for(let r of e){let s=r[2];!Array.isArray(s)&&"buff\
er"in s&&t.push(s.buffer)}return t}}),vr,Tt,ls,Ks,Js,Wn,Xo,Hn,zr,Br,Ef,vp,yp,bp,Mp,xp,kp,Tp,Ep=ge(()=>{"use strict";Xr(),
wp(),Yr(),Di(),vr=()=>!!ze.wasm.proxy&&typeof document<"u",ls=!1,Ks=!1,Js=!1,Hn=new Map,zr=(e,t)=>{let r=Hn.get(e);r?r.push(
t):Hn.set(e,[t])},Br=()=>{if(ls||!Ks||Js||!Tt)throw new Error("worker not ready")},Ef=e=>{switch(e.data.type){case"init-\
wasm":ls=!1,e.data.err?(Js=!0,Xo[1](e.data.err)):(Ks=!0,Xo[0]()),Wn&&(URL.revokeObjectURL(Wn),Wn=void 0);break;case"init\
-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Hn.get(e.data.type);e.data.err?t.shift()[1](
e.data.err):t.shift()[0](e.data.out);break}default:}},vp=async()=>{if(!Ks){if(ls)throw new Error("multiple calls to 'ini\
tWasm()' detected.");if(Js)throw new Error("previous call to 'initWasm()' failed.");if(ls=!0,vr())return new Promise((e,t)=>{
Tt?.terminate(),ip().then(([r,s])=>{try{Tt=s,Tt.onerror=a=>t(a),Tt.onmessage=Ef,Xo=[e,t];let n={type:"init-wasm",in:ze};
!n.in.wasm.wasmPaths&&(r||fi)&&(n.in.wasm.wasmPaths={wasm:new URL("/peercompute/assets/runtime/ort-wasm-simd-threaded.as\
yncify-CxOG5pUO.wasm",import.meta.url).href}),Tt.postMessage(n),Wn=r}catch(n){t(n)}},t)});try{await zi(ze.wasm),await Vi(
ze),Ks=!0}catch(e){throw Js=!0,e}finally{ls=!1}}},yp=async e=>{if(vr())return Br(),new Promise((t,r)=>{zr("init-ep",[t,r]);
let s={type:"init-ep",in:{epName:e,env:ze}};Tt.postMessage(s)});await Ui(ze,e)},bp=async e=>vr()?(Br(),new Promise((t,r)=>{
zr("copy-from",[t,r]);let s={type:"copy-from",in:{buffer:e}};Tt.postMessage(s,[e.buffer])})):ua(e),Mp=async(e,t)=>{if(vr()){
if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Br(),
new Promise((r,s)=>{zr("create",[r,s]);let n={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.
push(e.buffer),Tt.postMessage(n,a)})}else return ji(e,t)},xp=async e=>{if(vr())return Br(),new Promise((t,r)=>{zr("relea\
se",[t,r]);let s={type:"release",in:e};Tt.postMessage(s)});qi(e)},kp=async(e,t,r,s,n,a)=>{if(vr()){if(r.some(o=>o[3]!=="\
cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(o=>o))throw new Error("pre-allocated \
output tensor is not supported for proxy.");return Br(),new Promise((o,i)=>{zr("run",[o,i]);let l=r,c={type:"run",in:{sessionId:e,
inputIndices:t,inputs:l,outputIndices:s,options:a}};Tt.postMessage(c,Qi(l))})}else return Wi(e,t,r,s,n,a)},Tp=async e=>{
if(vr())return Br(),new Promise((t,r)=>{zr("end-profiling",[t,r]);let s={type:"end-profiling",in:e};Tt.postMessage(s)});
Hi(e)}}),Yo,Af,Ap,oM=ge(()=>{"use strict";Xr(),Ep(),ks(),Ni(),dp(),Yo=(e,t)=>{switch(e.location){case"cpu":return[e.type,
e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[
e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},
Af=e=>{switch(e[3]){case"cpu":return new Lt(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Ri(t))throw new Error(`not \
supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:s,dispose:n}=e[2];return Lt.fromGpuBuffer(
r,{dataType:t,dims:e[1],download:s,dispose:n})}case"ml-tensor":{let t=e[0];if(!$i(t))throw new Error(`not supported data\
 type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:s,dispose:n}=e[2];return Lt.fromMLTensor(r,{dataType:t,
dims:e[1],download:s,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},Ap=class{async fetchModelAndCopyToWasmMemory(e){
return bp(await Gi(e))}async loadModel(e,t){Hr();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):
r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Mp(r,t),Qr()}async dispose(){
return xp(this.sessionId)}async run(e,t,r){Hr();let s=[],n=[];Object.entries(e).forEach(h=>{let _=h[0],p=h[1],w=this.inputNames.
indexOf(_);if(w===-1)throw new Error(`invalid input '${_}'`);s.push(p),n.push(w)});let a=[],o=[];Object.entries(t).forEach(
h=>{let _=h[0],p=h[1],w=this.outputNames.indexOf(_);if(w===-1)throw new Error(`invalid output '${_}'`);a.push(p),o.push(
w)});let i=s.map((h,_)=>Yo(h,()=>`input "${this.inputNames[n[_]]}"`)),l=a.map((h,_)=>h?Yo(h,()=>`output "${this.outputNames[o[_]]}\
"`):null),c=await kp(this.sessionId,n,i,o,l,r),d={};for(let h=0;h<c.length;h++)d[this.outputNames[o[h]]]=a[h]??Af(c[h]);
return Qr(),d}startProfiling(){}endProfiling(){Tp(this.sessionId)}}}),Cp={};dn(Cp,{OnnxruntimeWebAssemblyBackend:()=>mi,
initializeFlags:()=>pi,wasmBackend:()=>Sp});var pi,mi,Sp,iM=ge(()=>{"use strict";Xr(),Ep(),oM(),pi=()=>{(typeof ze.wasm.
initTimeout!="number"||ze.wasm.initTimeout<0)&&(ze.wasm.initTimeout=0);let e=ze.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&
e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` \
and ignore SIMD feature checking.`),ze.wasm.simd=!1),typeof ze.wasm.proxy!="boolean"&&(ze.wasm.proxy=!1),typeof ze.wasm.
trace!="boolean"&&(ze.wasm.trace=!1),typeof ze.wasm.numThreads!="number"||!Number.isInteger(ze.wasm.numThreads)||ze.wasm.
numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ze.wasm.numThreads=1;else{let t=typeof navigator>"u"?B0("nod\
e:os").cpus().length:navigator.hardwareConcurrency;ze.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},mi=class{async init(e){
pi(),await vp(),await yp(e)}async createInferenceSessionHandler(e,t){let r=new Ap;return await r.loadModel(e,t),r}},Sp=new mi});
Xr();Xr();Xr();var lM="1.31.0-dev.20260914-8d85527a0",cM=tp;{let e=(iM(),oa(Cp)).wasmBackend;qr("webgpu",e,5),qr("webnn",
e,5),qr("cpu",e,10),qr("wasm",e,10)}Object.defineProperty(ze.versions,"web",{value:lM,enumerable:!0});var uM=Object.freeze(
{__proto__:null,get InferenceSession(){return Oi},get TRACE(){return ia},get TRACE_EVENT_BEGIN(){return Er},get TRACE_EVENT_END(){
return Ar},get TRACE_FUNC_BEGIN(){return Hr},get TRACE_FUNC_END(){return Qr},get Tensor(){return Lt},default:cM,get env(){
return ze},get registerBackend(){return qr}});const dM=(e,t)=>{const r=typeof document<"u"?document.createElement("canva\
s"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];const s=r.getContext("2d");if(s!=null){let n,a;t?.tensorLayout!==
void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);const o=t?.format!==void 0?t.format:
"RGB",i=t?.norm;let l,c;i===void 0||i.mean===void 0?l=[255,255,255,255]:typeof i.mean=="number"?l=[i.mean,i.mean,i.mean,
i.mean]:(l=[i.mean[0],i.mean[1],i.mean[2],0],i.mean[3]!==void 0&&(l[3]=i.mean[3])),i===void 0||i.bias===void 0?c=[0,0,0,
0]:typeof i.bias=="number"?c=[i.bias,i.bias,i.bias,i.bias]:(c=[i.bias[0],i.bias[1],i.bias[2],0],i.bias[3]!==void 0&&(c[3]=
i.bias[3]));const d=a*n;let h=0,_=d,p=d*2,w=-1;o==="RGBA"?(h=0,_=d,p=d*2,w=d*3):o==="RGB"?(h=0,_=d,p=d*2):o==="RBG"&&(h=
0,p=d,_=d*2);for(let v=0;v<a;v++)for(let y=0;y<n;y++){const b=(e.data[h++]-c[0])*l[0],k=(e.data[_++]-c[1])*l[1],A=(e.data[p++]-
c[2])*l[2],E=w===-1?255:(e.data[w++]-c[3])*l[3];s.fillStyle="rgba("+b+","+k+","+A+","+E+")",s.fillRect(y,v,1,1)}if("toDa\
taURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image\
 data")},hM=(e,t)=>{const r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,
1).getContext("2d");let s;if(r!=null){let n,a,o;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],
o=e.dims[3]):(n=e.dims[3],a=e.dims[2],o=e.dims[1]);const i=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm;let c,
d;l===void 0||l.mean===void 0?c=[255,255,255,255]:typeof l.mean=="number"?c=[l.mean,l.mean,l.mean,l.mean]:(c=[l.mean[0],
l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(c[3]=l.mean[3])),l===void 0||l.bias===void 0?d=[0,0,0,0]:typeof l.bias=="n\
umber"?d=[l.bias,l.bias,l.bias,l.bias]:(d=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(d[3]=l.bias[3]));const h=a*
n;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!=="RGBA"||o===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error(
"Tensor format doesn't match input tensor dims");const _=4;let p=0,w=1,v=2,y=3,b=0,k=h,A=h*2,E=-1;i==="RGBA"?(b=0,k=h,A=
h*2,E=h*3):i==="RGB"?(b=0,k=h,A=h*2):i==="RBG"&&(b=0,A=h,k=h*2),s=r.createImageData(n,a);for(let C=0;C<a*n;p+=_,w+=_,v+=
_,y+=_,C++)s.data[p]=(e.data[b++]-d[0])*c[0],s.data[w]=(e.data[k++]-d[1])*c[1],s.data[v]=(e.data[A++]-d[2])*c[2],s.data[y]=
E===-1?255:(e.data[E++]-d[3])*c[3]}else throw new Error("Can not access image data");return s},Ko=(e,t)=>{if(e===void 0)
throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and\
 width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");const{height:r,
width:s}=t,n=t.norm??{mean:255,bias:0};let a,o;typeof n.mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],
n.mean[2],n.mean[3]??255],typeof n.bias=="number"?o=[n.bias,n.bias,n.bias,n.bias]:o=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??
0];const i=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",c=r*
s,d=l==="RGBA"?new Float32Array(c*4):new Float32Array(c*3);let h=4,_=0,p=1,w=2,v=3,y=0,b=c,k=c*2,A=-1;i==="RGB"&&(h=3,_=
0,p=1,w=2,v=-1),l==="RGBA"?A=c*3:l==="RBG"?(y=0,k=c,b=c*2):l==="BGR"&&(k=0,b=c,y=c*2);for(let C=0;C<c;C++,_+=h,w+=h,p+=h,
v+=h)d[y++]=(e[_]+o[0])/a[0],d[b++]=(e[p]+o[1])/a[1],d[k++]=(e[w]+o[2])/a[2],A!==-1&&v!==-1&&(d[A++]=(e[v]+o[3])/a[3]);return l===
"RGBA"?new At("float32",d,[1,4,r,s]):new At("float32",d,[1,3,r,s])},fM=async(e,t)=>{const r=typeof HTMLImageElement<"u"&&
e instanceof HTMLImageElement,s=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,
a=typeof e=="string";let o,i=t??{};const l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<
"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},c=d=>typeof HTMLCanvasElement<"u"&&d instanceof
HTMLCanvasElement||d instanceof OffscreenCanvas?d.getContext("2d"):null;if(r){const d=l();d.width=e.width,d.height=e.height;
const h=c(d);if(h!=null){let _=e.height,p=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(_=t.
resizedHeight,p=t.resizedWidth),t!==void 0){if(i=t,t.tensorFormat!==void 0)throw new Error("Image input config format mu\
st be RGBA for HTMLImageElement");i.tensorFormat="RGBA",i.height=_,i.width=p}else i.tensorFormat="RGBA",i.height=_,i.width=
p;h.drawImage(e,0,0),o=h.getImageData(0,0,p,_).data}else throw new Error("Can not access image data")}else if(s){let d,h;
if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(d=t.resizedHeight,h=t.resizedWidth):(d=e.height,h=e.width),
t!==void 0&&(i=t),i.format="RGBA",i.height=d,i.width=h,t!==void 0){const _=l();_.width=h,_.height=d;const p=c(_);if(p!=null)
p.putImageData(e,0,0),o=p.getImageData(0,0,h,d).data;else throw new Error("Can not access image data")}else o=e.data}else if(n){
if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");const d=l();d.width=e.width,d.height=
e.height;const h=c(d);if(h!=null){const _=e.height,p=e.width;return h.drawImage(e,0,0,p,_),o=h.getImageData(0,0,p,_).data,
i.height=_,i.width=p,Ko(o,i)}else throw new Error("Can not access image data")}else{if(a)return new Promise((d,h)=>{const _=l(),
p=c(_);if(!e||!p)return h();const w=new Image;w.crossOrigin="Anonymous",w.src=e,w.onload=()=>{_.width=w.width,_.height=w.
height,p.drawImage(w,0,0,_.width,_.height);const v=p.getImageData(0,0,_.width,_.height);i.height=_.height,i.width=_.width,
d(Ko(v.data,i))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(o!==void 0)return Ko(
o,i);throw new Error("Input data provided is not supported - aborted tensor creation")},_M=(e,t)=>{const{width:r,height:s,
download:n,dispose:a}=t,o=[1,s,r,4];return new At({location:"texture",type:"float32",texture:e,dims:o,download:n,dispose:a})},
pM=(e,t)=>{const{dataType:r,dims:s,download:n,dispose:a}=t;return new At({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,
dims:s,download:n,dispose:a})},mM=(e,t)=>{const{dataType:r,dims:s,download:n,dispose:a}=t;return new At({location:"ml-te\
nsor",type:r??"float32",mlTensor:e,dims:s,download:n,dispose:a})},gM=(e,t,r)=>new At({location:"cpu-pinned",type:e,data:t,
dims:r??[t.length]}),ps=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],
["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],
["uint4",Uint8Array]]),ra=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],
[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]);let Cf=!1;const wM=()=>{if(!Cf){
Cf=!0;const e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.
Float16Array,s=typeof r<"u"&&r.from;e&&(ps.set("int64",BigInt64Array),ra.set(BigInt64Array,"int64")),t&&(ps.set("uint64",
BigUint64Array),ra.set(BigUint64Array,"uint64")),s?(ps.set("float16",r),ra.set(r,"float16")):ps.set("float16",Uint16Array)}},
vM=e=>{let t=1;for(let r=0;r<e.length;r++){const s=e[r];if(typeof s!="number"||!Number.isSafeInteger(s))throw new TypeError(
`dims[${r}] must be an integer, got: ${s}`);if(s<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got:\
 ${s}`);t*=s}return t},yM=(e,t)=>{switch(e.location){case"cpu":return new At(e.type,e.data,t);case"cpu-pinned":return new At(
{location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new At({location:"texture",texture:e.texture,
type:e.type,dims:t});case"gpu-buffer":return new At({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"\
ml-tensor":return new At({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorR\
eshape: tensor location ${e.location} is not supported`)}};let At=class{constructor(t,r,s){wM();let n,a;if(typeof t=="ob\
ject"&&"location"in t)switch(this.dataLocation=t.location,n=t.type,a=t.dims,t.location){case"cpu-pinned":{const i=ps.get(
n);if(!i)throw new TypeError(`unsupported type "${n}" to create tensor from pinned buffer`);if(!(t.data instanceof i))throw new TypeError(
`buffer should be of type ${i.name}`);this.cpuData=t.data;break}case"texture":{if(n!=="float32")throw new TypeError(`uns\
upported type "${n}" to create tensor from texture`);this.gpuTextureData=t.texture,this.downloader=t.download,this.disposer=
t.dispose;break}case"gpu-buffer":{if(n!=="float32"&&n!=="float16"&&n!=="int32"&&n!=="int64"&&n!=="uint32"&&n!=="uint8"&&
n!=="bool"&&n!=="uint4"&&n!=="int4")throw new TypeError(`unsupported type "${n}" to create tensor from gpu buffer`);this.
gpuBufferData=t.gpuBuffer,this.downloader=t.download,this.disposer=t.dispose;break}case"ml-tensor":{if(n!=="float32"&&n!==
"float16"&&n!=="int32"&&n!=="int64"&&n!=="uint32"&&n!=="uint64"&&n!=="int8"&&n!=="uint8"&&n!=="bool"&&n!=="uint4"&&n!=="\
int4")throw new TypeError(`unsupported type "${n}" to create tensor from MLTensor`);this.mlTensorData=t.mlTensor,this.downloader=
t.download,this.disposer=t.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}\
'`)}else{let i,l;if(typeof t=="string")if(n=t,l=s,t==="string"){if(!Array.isArray(r))throw new TypeError("A string tenso\
r's data must be a string array.");i=r}else{const c=ps.get(t);if(c===void 0)throw new TypeError(`Unsupported tensor type\
: ${t}.`);if(Array.isArray(r)){if(t==="float16"&&c===Uint16Array||t==="uint4"||t==="int4")throw new TypeError(`Creating \
a ${t} tensor from number array is not supported. Please use ${c.name} as data.`);t==="uint64"||t==="int64"?i=c.from(r,BigInt):
i=c.from(r)}else if(r instanceof c)i=r;else if(r instanceof Uint8ClampedArray)if(t==="uint8")i=Uint8Array.from(r);else throw new TypeError(
"A Uint8ClampedArray tensor's data must be type of uint8");else if(t==="float16"&&r instanceof Uint16Array&&c!==Uint16Array)
i=new globalThis.Float16Array(r.buffer,r.byteOffset,r.length);else throw new TypeError(`A ${n} tensor's data must be typ\
e of ${c}`)}else if(l=r,Array.isArray(t)){if(t.length===0)throw new TypeError("Tensor type cannot be inferred from an em\
pty array.");const c=typeof t[0];if(c==="string")n="string",i=t;else if(c==="boolean")n="bool",i=Uint8Array.from(t);else
throw new TypeError(`Invalid element type of data array: ${c}.`)}else if(t instanceof Uint8ClampedArray)n="uint8",i=Uint8Array.
from(t);else{const c=ra.get(t.constructor);if(c===void 0)throw new TypeError(`Unsupported type for tensor data: ${t.constructor}\
.`);n=c,i=t}if(l===void 0)l=[i.length];else if(!Array.isArray(l))throw new TypeError("A tensor's dims must be a number a\
rray");a=l,this.cpuData=i,this.dataLocation="cpu"}const o=vM(a);if(this.cpuData&&o!==this.cpuData.length&&!((n==="uint4"||
n==="int4")&&Math.ceil(o/2)===this.cpuData.length))throw new Error(`Tensor's size(${o}) does not match data length(${this.
cpuData.length}).`);this.type=n,this.dims=a,this.size=o}static async fromImage(t,r){return fM(t,r)}static fromTexture(t,r){
return _M(t,r)}static fromGpuBuffer(t,r){return pM(t,r)}static fromMLTensor(t,r){return mM(t,r)}static fromPinnedBuffer(t,r,s){
return gM(t,r,s)}toDataURL(t){return dM(this,t)}toImageData(t){return hM(this,t)}get data(){if(this.ensureValid(),!this.
cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBu\
ffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){
if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){
if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){
if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(t){
switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"\
ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.
isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;const r=await this.downloader();
return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=r,t&&this.disposer&&(this.disposer(),this.disposer=void 0),
r}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){
if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=
void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=
void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("T\
he tensor is disposed.")}reshape(t){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape\
 a tensor that owns GPU resource.");return yM(this,t)}};const bM=At;var Jo={},MM=Object.defineProperty,hn=(e,t)=>{for(var r in t)
MM(e,r,{get:t[r],enumerable:!0})},bt={},Jt={},xM={},kM="4.3.2",Xi=typeof self<"u",vs=!Lp(bt),Pp=!Lp(Jt),da=Xi&&"caches"in
self,TM=typeof globalThis.Deno<"u",Ea=TM&&da&&!vs,Fp=typeof process<"u",Ip=Fp&&process?.release?.name==="node"&&!Ea,Yi=typeof window<
"u"&&typeof window.document<"u",Ki=Xi&&["DedicatedWorkerGlobalScope","ServiceWorkerGlobalScope","SharedWorkerGlobalScope"].
includes(self.constructor?.name),EM=Yi||Ki||Ea,AM=Ip||typeof navigator<"u"&&"gpu"in navigator,CM=typeof navigator<"u"&&"\
ml"in navigator,SM=typeof crypto<"u"&&typeof crypto.getRandomValues=="function",PM=typeof chrome<"u"&&typeof chrome.runtime<
"u"&&typeof chrome.runtime.id=="string",FM=typeof ServiceWorkerGlobalScope<"u"&&Xi&&self instanceof ServiceWorkerGlobalScope,
IM=()=>{if(typeof navigator>"u")return!1;const e=navigator.userAgent;if(!((navigator.vendor||"").indexOf("Apple")>-1&&!e.
match(/CriOS|FxiOS|EdgiOS|OPiOS|mercury|brave/i)&&!e.includes("Chrome")&&!e.includes("Android")))return!1;const r=e.match(
/Version\/(\d+)/);return r?parseInt(r[1],10)<26:!1},LM=IM(),fe=Object.freeze({IS_BROWSER_ENV:Yi,IS_WEBWORKER_ENV:Ki,IS_WEB_ENV:EM,
IS_SERVICE_WORKER_ENV:FM,IS_DENO_WEB_RUNTIME:Ea,IS_WEB_CACHE_AVAILABLE:da,IS_WEBGPU_AVAILABLE:AM,IS_WEBNN_AVAILABLE:CM,IS_SAFARI_BELOW_26:LM,
IS_PROCESS_AVAILABLE:Fp,IS_NODE_ENV:Ip,IS_FS_AVAILABLE:vs,IS_PATH_AVAILABLE:Pp,IS_CRYPTO_AVAILABLE:SM,IS_CHROME_AVAILABLE:PM}),
Ji=vs&&Pp,ha="./";if(Ji){const e=import.meta.url;e?ha=Jt.dirname(Jt.dirname(xM.fileURLToPath(e))):typeof __dirname<"u"&&
(ha=Jt.dirname(__dirname))}var OM=Ji?Jt.join(ha,"/.cache/"):null,Sf="/models/",NM=Ji?Jt.join(ha,Sf):Sf,DM=typeof globalThis.
fetch=="function"?globalThis.fetch.bind(globalThis):void 0,Nt=Object.freeze({DEBUG:10,INFO:20,WARNING:30,ERROR:40,NONE:50}),
Pf=Nt.WARNING,we={version:kM,backends:{onnx:{}},get logLevel(){return Pf},set logLevel(e){Pf=e,we.backends.onnx?.setLogLevel?.(
e)},allowRemoteModels:!0,remoteHost:"https://huggingface.co/",remotePathTemplate:"{model}/resolve/{revision}/",allowLocalModels:!(Yi||
Ki||Ea),localModelPath:NM,useFS:vs,useBrowserCache:da,useFSCache:vs,cacheDir:OM,useCustomCache:!1,customCache:null,useWasmCache:da||
vs,cacheKey:"transformers-cache",experimental_useCrossOriginStorage:!1,fetch:DM};function Lp(e){return Object.keys(e).length===
0}var ft=class{constructor(){let e=function(...t){return e._call(...t)};return Object.setPrototypeOf(e,new.target.prototype)}_call(...e){
throw Error("Must implement _call method in subclass")}};function kr(e,t){e&&e(t)}var fa=class extends ft{constructor(e,t){
super(),this.callback=e,this.files_loading=t,this.loads=new Map}_call(e){if(e.status==="progress"){this.files_loading[e.
file]={loaded:e.loaded,total:e.total};const t=Object.values(this.files_loading).reduce((n,a)=>n+a.loaded,0),r=Object.values(
this.files_loading).reduce((n,a)=>n+a.total,0),s=r>0?t/r*100:0;this.callback({status:"progress_total",name:e.name,progress:s,
loaded:t,total:r,files:structuredClone(this.files_loading)})}this.callback(e)}};function zM(e){return Number.isInteger(e)||
typeof e=="bigint"}function Ff(e){return e==null||e===-1}function If(e){const t=[];let r=e;for(;Array.isArray(r);)t.push(
r.length),r=r[0];return t}function Dt(...e){return Array.prototype.concat.apply([],e)}function BM(...e){return e.reduce(
(t,r)=>t.flatMap(s=>r.map(n=>[s,n])))}function _a(e,t){return Math.abs((e+t)%(2*t)-t)}function Ze(e,t){return Object.assign(
{},...t.map(r=>{if(e[r]!==void 0)return{[r]:e[r]}}))}function RM(e,t){let r=0;for(const s of e)s===t&&++r;return r}var de={
error(...e){we.logLevel<=Nt.ERROR&&console.error(...e)},warn(...e){we.logLevel<=Nt.WARNING&&console.warn(...e)},info(...e){
we.logLevel<=Nt.INFO&&console.log(...e)},debug(...e){we.logLevel<=Nt.DEBUG&&console.log(...e)},log(...e){this.info(...e)}},
$M=class{constructor(e){this.trie=this._build_trie(e)}_build_trie(e){const t=Object.create(null);for(const r of e){let s=t;
for(let n=0;n<r.length;++n){const a=r[n];s=s[a]??=Object.create(null)}s.end=r}return t}split(e){const t=[],r=e.length;let s=0,
n=0;for(;n<r;){let a=this.trie,o=null,i=n;for(;i<r&&(a=a[e[i]]);)a.end&&(o=a.end),++i;o?(n>s&&t.push(e.slice(s,n)),t.push(
o),n+=o.length,s=n):++n}return s<r&&t.push(e.slice(s)),t}},Lf=$M,GM=class{constructor(e){this.content=e.content,this.id=
e.id,this.single_word=e.single_word??!1,this.lstrip=e.lstrip??!1,this.rstrip=e.rstrip??!1,this.special=e.special??!1,this.
normalized=e.normalized??!this.special}},VM=GM,Op=(e,t)=>{try{return new RegExp(e,t)}catch(r){if(!(r instanceof SyntaxError))
throw r;const s=new Map,n=e.replace(/(\\[pP])\{([^}=]+)\}/g,(a,o,i,l)=>{let c=0;for(let h=l-1;h>=0&&e[h]==="\\";--h)++c;
if(c%2===1)return a;let d=s.get(i);if(d===void 0){try{new RegExp(`\\p{${i}}`,"u"),d=i}catch{d=`Script=${i}`}s.set(i,d)}return`${o}\
{${d}}`});if(n===e)throw r;try{return new RegExp(n,t)}catch{throw r}}},Zi=e=>e.replace(/ \./g,".").replace(/ \?/g,"?").replace(
/ \!/g,"!").replace(/ ,/g,",").replace(/ \' /g,"'").replace(/ n't/g,"n't").replace(/ 'm/g,"'m").replace(/ 's/g,"'s").replace(
/ 've/g,"'ve").replace(/ 're/g,"'re"),Aa=(e,t=!0)=>{if(e.Regex!==void 0){const r=ax(rx(e.Regex));return Op(r,"gu")}else if(e.
String!==void 0){const r=ox(e.String);return new RegExp(t?r:`(${r})`,"gu")}else return console.warn("Unknown pattern typ\
e:",e),null},xs="\\p{Alphabetic}\\p{M}\\p{Nd}\\p{Pc}",Np=`${xs}\\u00B2\\u00B3\\u00B9\\u00BC-\\u00BE`,Zt=`[${Np}]`,Dp=`[^${Np}\
]`,UM=`(?:(?<!${Zt})(?=${Zt})|(?<=${Zt})(?!${Zt}))`,jM=`(?:(?<!${Zt})(?!${Zt})|(?<=${Zt})(?=${Zt}))`,qM="(?:(?<![\\s\\S])|\
(?<=\\n))",WM="(?:(?=\\n)|(?![\\s\\S]))",nn="0-9A-Fa-f",HM=new Map([["A","(?<![\\s\\S])"],["z","(?![\\s\\S])"],["Z","(?=\
\\n?(?![\\s\\S]))"],["h",`[${nn}]`],["H",`[^${nn}]`],["w",Zt],["W",Dp],["d","\\p{Nd}"],["D","\\P{Nd}"],["s","\\p{White_Sp\
ace}"],["S","\\P{White_Space}"],["b",UM],["B",jM],["a","\\x07"],["e","\\x1B"]]),QM=new Map([["h",nn],["w",xs],["d","\\p{N\
d}"],["D","\\P{Nd}"],["s","\\p{White_Space}"],["S","\\P{White_Space}"],["a","\\x07"],["e","\\x1B"]]),XM=new Map([["W",`[\
^${xs}]`],["H",`[^${nn}]`]]),zp=new Map([[`
`,"\\n"],["\r","\\r"],["	","\\t"],["\f","\\f"],["\v","\\v"]]),YM=new Map([["alpha","\\p{Alphabetic}"],["alnum","\\p{Alpha\
betic}\\p{Nd}"],["digit","\\p{Nd}"],["lower","\\p{Lowercase}"],["upper","\\p{Uppercase}"],["space","\\p{White_Space}"],[
"blank","\\t\\p{Zs}"],["punct","\\p{P}\\p{S}"],["cntrl","\\p{Cc}"],["word",xs],["xdigit",nn]]),Bp="^$\\.*+?()[]{}|/",KM=/^\(\?(?:<[=!]|<[A-Za-z_][A-Za-z0-9_]*>|[:=!>])/,
Rp=/^\\([pPxu])\{([^}]*)\}/,JM=/^\{(\d+(?:,\d*)?|,\d+)\}/,ZM=/^\[:(\^?)(\p{Alphabetic}+):\]/u,ex=/^\[:\^:\]/,tx=/^\[(?:\.[^\]]*\.\]|=[^\]]*=\])/,
$p=/^(?:\\x[0-9A-Fa-f]{2}|\\u[0-9A-Fa-f]{4}|\\c[A-Za-z])/,Gp=e=>e>="A"&&e<="Z"||e>="a"&&e<="z",pa=(e,t)=>String.fromCodePoint(
e.codePointAt(t)),Of=e=>{if(!/^[0-9A-Fa-f]{1,8}$/.test(e))return null;const t=Number.parseInt(e,16);if(t>127)return null;
const r=String.fromCharCode(t);return Gp(r)?`[${r.toLowerCase()}${r.toUpperCase()}]`:null},rx=e=>e.replace(/\[\^\(\\s\|\[([^\]]+)\]\)\]/g,
"[^()|\\s$1]"),Vp="[\\s\\S]",Nf=256,Df=()=>({fragment:"",alternatives:[],tail:null,contains_complex_set:!1}),el=e=>{throw new SyntaxError(
`Unsupported range with a set-valued character-class operand at index ${e}`)},ma=(e,t,r,s=!0)=>{e.tail==="range"&&el(r),
e.alternatives.push(t),e.tail="set",e.contains_complex_set=e.contains_complex_set||s},Tr=(e,t,r=!1,s=-1)=>{if(r&&e.tail===
"range"&&el(s),e.tail==="range"){e.fragment+=t,e.tail="complete_range";return}e.fragment+=t,e.tail=r?"set":"scalar",e.contains_complex_set=
e.contains_complex_set||r},sx=(e,t,r)=>{const s=Rp.exec(e.slice(t));if(s){const[_,p,w]=s;if(p==="P"&&w==="Word")ma(r,`[^${xs}\
]`,t);else{const v=p==="x"?`\\u{${w}}`:p==="p"&&w==="Word"?xs:_;Tr(r,v,p==="p"||p==="P",t)}return t+_.length}const n=$p.
exec(e.slice(t));if(n)return Tr(r,n[0]),t+n[0].length;if(t+1>=e.length)throw new SyntaxError(`Unterminated escape in cha\
racter class at index ${t}`);const a=pa(e,t+1),o=t+1+a.length,i=zp.get(a);if(i!==void 0)return Tr(r,i),o;const l=XM.get(
a);if(l!==void 0)return ma(r,l,t),o;const c=QM.get(a);let d,h=!1;return c!==void 0?(d=c,h=a!=="a"&&a!=="e"):/[A-Za-z0-9]/.
test(a)?d=`\\${a}`:Bp.includes(a)||a==="-"?d=`\\${a}`:d=a,Tr(r,d,h,t),o},Up=e=>e.length===1?e[0]:`(?:(?=(?:${e.join("|")}\
))${Vp})`,zf=e=>{const t=e.fragment.length===0?e.alternatives:[`[${e.fragment}]`,...e.alternatives];return Up(t)},nx=e=>{
const t=Op(`^(?:${e})$`,"u");let r="";for(let s=0;s<26;++s){const n=String.fromCharCode(65+s),a=String.fromCharCode(97+s),
o=t.test(n),i=t.test(a);o!==i&&(r+=o?a:n)}return r},jp=(e,t,r,s=!0,n=1)=>{if(n>Nf)throw new SyntaxError(`Maximum charact\
er-class nesting depth of ${Nf} exceeded at index ${t}`);let a=t+1;const o=e[a]==="^";o&&++a;const i=a,l=[Df()];let c=l[0],
d=!1;for(;a<e.length;){const h=pa(e,a);if(h==="\\"){a=sx(e,a,c);continue}if(h==="]"){if(a===i){Tr(c,"\\]"),++a;continue}
if(c.tail===null)throw l.length>1?new SyntaxError(`Malformed character-class intersection with an empty operand at index\
 ${a}`):new SyntaxError(`Empty character class at index ${t}`);const _=l.some(k=>k.contains_complex_set);if(o&&l.length>
1&&d)throw new SyntaxError(`Unsupported outer-negated character-class intersection with a nested negated class containin\
g a Unicode property, POSIX class, or shorthand at index ${t}`);const p=zf(l[0]);let w=p;if(l.length>1){let k="";for(let A=1;A<
l.length;++A)k+=`(?=${zf(l[A])})`;w=`(?:${k}${p})`}const v=l.length===1&&c.alternatives.length===0;let y=c.fragment;if(r&&
s){const k=nx(w);k.length>0&&(v?(y+=k,w=`[${y}]`):w=Up([w,`[${k}]`]))}return{atom:o?v?`[^${y}]`:`(?:(?!${w})${Vp})`:w,end:a+
1,negated:o,contains_complex_set:_,contains_nested_negated_complex_set:d}}if(e.startsWith("&&",a)){if(c.tail===null)throw new SyntaxError(
`Malformed character-class intersection with an empty operand at index ${a}`);c=Df(),l.push(c),a+=2;continue}if(h==="["){
const _=e.slice(a);if(ex.test(_))throw new SyntaxError(`Malformed empty negated POSIX character class at index ${a}`);const p=ZM.
exec(_);if(p){const[,v,y]=p,b=YM.get(y);if(b===void 0)throw new SyntaxError(`Unsupported POSIX character class "${y}" at\
 index ${a}`);if(r&&v&&(y==="lower"||y==="upper"))throw new SyntaxError(`Unsupported negated POSIX ${y} class inside an \
inline case-insensitive group`);v?ma(c,`[^${b}]`,a):Tr(c,b,!0,a),a+=p[0].length;continue}if(tx.test(_))throw new SyntaxError(
`Unsupported POSIX collating or equivalence bracket expression at index ${a}`);const w=jp(e,a,r,!1,n+1);ma(c,w.atom,a,w.
contains_complex_set),d||=w.contains_nested_negated_complex_set||w.negated&&w.contains_complex_set,a=w.end;continue}if(h===
"-"){const _=e[a+1]==="]"||e.startsWith("&&",a+1);c.tail==="set"&&!_&&el(a),c.tail===null||c.tail==="range"||c.tail==="c\
omplete_range"||_?Tr(c,"\\-"):(c.fragment+="-",c.tail="range"),++a;continue}Tr(c,h==="^"&&c.fragment.length===0?"\\^":h),
a+=h.length}throw new SyntaxError(`${l.length>1?"Unterminated character-class intersection":"Unterminated character clas\
s"} at index ${t}`)},ax=e=>{let t="",r=-1,s=!1,n=!1;const a=[],o=i=>{r=t.length,t+=i,s=!1};for(let i=0;i<e.length;){const l=pa(
e,i);if(l==="\\"){const c=Rp.exec(e.slice(i));if(c){const[v,y,b]=c;let k=v;if(y==="x"){const A=`\\u{${b}}`;k=n?Of(b)??A:
A}else b==="Word"&&(k=y==="p"?Zt:Dp);o(k),i+=v.length;continue}const d=$p.exec(e.slice(i));if(d){const v=d[0],y=n&&v[1]!==
"c"?Of(v.slice(2))??v:v;o(y),i+=v.length;continue}if(i+1>=e.length){t+=l;break}const h=pa(e,i+1);if(i+=1+h.length,h==="G")
continue;const _=zp.get(h);if(_!==void 0){o(_);continue}const p=HM.get(h);let w;p!==void 0?w=p:/[A-Za-z0-9]/.test(h)?w=`\
\\${h}`:Bp.includes(h)?w=`\\${h}`:w=h,o(w);continue}switch(l){case"[":{const c=jp(e,i,n);o(c.atom),i=c.end;continue}case"\
]":o("\\]"),++i;continue;case".":o("[^\\n]"),++i;continue;case"^":o(qM),++i;continue;case"$":o(WM),++i;continue;case"(":{
const c=e.startsWith("(?i:",i),d=c?"(?i:":KM.exec(e.slice(i))?.[0]??"(",h=c||d==="(?>"?"(?:":d;a.push([t.length,n]),c&&(n=
!0),t+=h,s=!1,i+=d.length;continue}case")":t+=l,[r,n]=a.pop()??[-1,!1],s=!1,++i;continue;case"|":t+=l,r=-1,s=!1,++i;continue;case"\
{":{const c=JM.exec(e.slice(i));if(!c||r<0){o("\\{"),++i;continue}const d=c[1].startsWith(",")?`0${c[1]}`:c[1];i+=c[0].length;
const h=e[i];h==="+"||h==="*"?(t=`${t.slice(0,r)}(?:${t.slice(r)}{${d}})${h}`,++i):t+=`{${d}}`,s=!0;continue}case"}":o("\
\\}"),++i;continue;case"+":if(s){++i;continue}t+=l,s=!0,++i;continue;case"*":case"?":t+=l,s=!0,++i;continue;default:o(n&&
Gp(l)?`[${l.toLowerCase()}${l.toUpperCase()}]`:l),i+=l.length;continue}}return t},ox=e=>e.replace(/[.*+?^${}()|[\]\\]/g,
"\\$&"),ix=(e,t,r)=>{const s=[];let n=0;for(;n<e.length;){if(s.push(e[n]),(t.get(e[n])??r)!==r){++n;continue}for(;++n<e.
length&&(t.get(e[n])??r)===r;)t.get(s.at(-1))!==r&&(s[s.length-1]+=e[n])}return s},lx=e=>e>=19968&&e<=40959||e>=13312&&e<=
19903||e>=131072&&e<=173791||e>=173824&&e<=177983||e>=177984&&e<=178207||e>=178208&&e<=183983||e>=63744&&e<=64255||e>=194560&&
e<=195103,cx=e=>Number.isInteger(e)||typeof e=="bigint",ux=e=>{let t=0;for(const r of e)++t;return t},dx=e=>qp(e.toLowerCase()),
zt=(...e)=>Array.prototype.concat.apply([],e),tl=e=>new Map(Object.entries(e)),hx=(e,t)=>{const r=[];let s=0;for(const n of e.
matchAll(t)){const a=n[0];s<n.index&&r.push(e.slice(s,n.index)),a.length>0&&r.push(a),s=n.index+a.length}return s<e.length&&
r.push(e.slice(s)),r},qp=e=>e.replace(/\p{M}/gu,""),Bf=(e,t,r=[])=>{if(!e||Array.isArray(e)||typeof e!="object")return`${t}\
 must be a valid object`;for(const s of r)if(!(s in e))return`${t} must contain a "${s}" property`;return null},fx=e=>e.
match(/\S+/g)||[],_x=class{constructor(){const e=function(...t){return e._call(...t)};return Object.setPrototypeOf(e,new.target.
prototype)}},fn=_x,px=class extends fn{constructor(e){super(),this.config=e}_call(e){return this.normalize(e)}},hr=px,mx=class extends hr{tokenize_chinese_chars(e){
const t=[];for(let r=0;r<e.length;++r){const s=e[r],n=s.charCodeAt(0);lx(n)?(t.push(" "),t.push(s),t.push(" ")):t.push(s)}
return t.join("")}strip_accents(e){return e.normalize("NFD").replace(/\p{Mn}/gu,"")}is_control(e){switch(e){case"	":case`\

`:case"\r":return!1;default:return/^\p{Cc}|\p{Cf}|\p{Co}|\p{Cs}$/u.test(e)}}clean_text(e){const t=[];for(const r of e){const s=r.
charCodeAt(0);s===0||s===65533||this.is_control(r)||(/^\s$/.test(r)?t.push(" "):t.push(r))}return t.join("")}normalize(e){
return this.config.clean_text&&(e=this.clean_text(e)),this.config.handle_chinese_chars&&(e=this.tokenize_chinese_chars(e)),
this.config.lowercase?(e=e.toLowerCase(),this.config.strip_accents!==!1&&(e=this.strip_accents(e))):this.config.strip_accents&&
(e=this.strip_accents(e)),e}},gx=mx,wx=class extends hr{constructor(e){super(e),this.charsmap=e.precompiled_charsmap??null}normalize(e){
return e=e.replace(/[\u0001-\u0008\u000B\u000E-\u001F\u007F\u008F\u009F]/gm,""),e=e.replace(/[\u0009\u000A\u000C\u000D\u00A0\u1680\u2000-\u200F\u2028\u2029\u202F\u205F\u2581\u3000\uFEFF\uFFFD]/gm,
" "),e.includes("～")?e=e.split("～").map(r=>r.normalize("NFKC")).join("～"):e=e.normalize("NFKC"),e}},vx=wx,yx=class extends hr{constructor(e){
super(e),this.normalizers=(e.normalizers??[]).map(t=>Wp(t))}normalize(e){return this.normalizers.reduce((t,r)=>r?r.normalize(
t):t,e)}},bx=yx,Mx=class extends hr{constructor(e){super(e),this.pattern=Aa(this.config.pattern??{})}normalize(e){return this.
pattern===null?e:e.replaceAll(this.pattern,this.config.content??"")}},xx=Mx,kx=class extends hr{constructor(){super(...arguments),
this.form="NFC"}normalize(e){return e=e.normalize(this.form),e}},Ca=kx,Tx=class extends Ca{constructor(){super(...arguments),
this.form="NFC"}},Ex=Tx,Ax=class extends Ca{constructor(){super(...arguments),this.form="NFD"}},Cx=Ax,Sx=class extends Ca{constructor(){
super(...arguments),this.form="NFKC"}},Px=Sx,Fx=class extends Ca{constructor(){super(...arguments),this.form="NFKD"}},Ix=Fx,
Lx=class extends hr{normalize(e){return this.config.strip_left&&this.config.strip_right?e=e.trim():(this.config.strip_left&&
(e=e.trimStart()),this.config.strip_right&&(e=e.trimEnd())),e}},Ox=Lx,Nx=class extends hr{normalize(e){return qp(e)}},Dx=Nx,
zx=class extends hr{normalize(e){return e.toLowerCase()}},Bx=zx,Rx=class extends hr{normalize(e){return e=this.config.prepend+
e,e}},$x=Rx;function Gx(e){if(e===null)return null;switch(e.type){case"BertNormalizer":return new gx(e);case"Precompiled":
return new vx(e);case"Sequence":return new bx(e);case"Replace":return new xx(e);case"NFC":return new Ex(e);case"NFD":return new Cx(
e);case"NFKC":return new Px(e);case"NFKD":return new Ix(e);case"Strip":return new Ox(e);case"StripAccents":return new Dx(
e);case"Lowercase":return new Bx(e);case"Prepend":return new $x(e);default:throw new Error(`Unknown Normalizer type: ${e.
type}`)}}var Wp=Gx,Vx=class extends fn{pre_tokenize(e,t){return(Array.isArray(e)?e.map(r=>this.pre_tokenize_text(r,t)):this.
pre_tokenize_text(e,t)).flat()}_call(e,t){return this.pre_tokenize(e,t)}},Gt=Vx,Hp=(()=>{const e=[...Array.from({length:94},
(n,a)=>a+33),...Array.from({length:12},(n,a)=>a+161),...Array.from({length:82},(n,a)=>a+174)],t=e.slice();let r=0;for(let n=0;n<
256;++n)e.includes(n)||(e.push(n),t.push(256+r),r+=1);const s=t.map(n=>String.fromCharCode(n));return Object.fromEntries(
e.map((n,a)=>[n,s[a]]))})(),Ux=e=>Object.fromEntries(Object.entries(e).map(([t,r])=>[r,t])),jx=Ux(Hp),ga="\\p{P}\\u0021-\\u\
002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E",qx=class extends Gt{constructor(e){super(),this.config=e,this.add_prefix_space=
this.config.add_prefix_space??!1,this.trim_offsets=this.config.trim_offsets??!1,this.use_regex=this.config.use_regex??!0,
this.pattern=/'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu,this.byte_encoder=Hp,this.text_encoder=
new TextEncoder}pre_tokenize_text(e,t){return this.add_prefix_space&&!e.startsWith(" ")&&(e=" "+e),(this.use_regex?e.match(
this.pattern)||[]:[e]).map(s=>Array.from(this.text_encoder.encode(s),n=>this.byte_encoder[n]).join(""))}},Wx=qx,Hx=class extends Gt{pre_tokenize_text(e,t){
return e.match(/\w+|[^\w\s]+/g)||[]}},Qx=Hx,Xx=class extends Gt{constructor(e){super(),this.replacement=e.replacement??"\
▁",this.str_rep=e.str_rep||this.replacement,this.prepend_scheme=e.prepend_scheme??"always"}pre_tokenize_text(e,t){const{
section_index:r=void 0}=t??{};let s=e.replaceAll(" ",this.str_rep);return!s.startsWith(this.replacement)&&(this.prepend_scheme===
"always"||this.prepend_scheme==="first"&&r===0)&&(s=this.str_rep+s),[s]}},Yx=Xx,Kx=class extends Gt{constructor(e){super(),
this.config=e,this.pattern=Aa(this.config.pattern??{},this.config.invert??!0)}pre_tokenize_text(e){return this.pattern===
null?[]:this.config.invert?(e.match(this.pattern)||[]).filter(t=>t):this.config.behavior?.toLowerCase()==="removed"?e.split(
this.pattern).filter(t=>t):hx(e,this.pattern)}},Jx=Kx,Zx=class extends Gt{constructor(e){super(),this.config=e,this.pattern=
new RegExp(`[^${ga}]+|[${ga}]+`,"gu")}pre_tokenize_text(e){return e.match(this.pattern)||[]}},e1=Zx,t1=class extends Gt{constructor(e){
super(),this.config=e;const t=`[^\\d]+|\\d${this.config.individual_digits?"":"+"}`;this.pattern=new RegExp(t,"gu")}pre_tokenize_text(e){
return e.match(this.pattern)||[]}},r1=t1,s1=class extends Gt{constructor(){super(),this.pattern=new RegExp(`[^\\s${ga}]+\
|[${ga}]`,"gu")}pre_tokenize_text(e,t){return e.trim().match(this.pattern)||[]}},n1=s1,a1=class extends Gt{constructor(e){
super(),this.config=e,this.pattern=Aa(this.config.pattern??{}),this.content=this.config.content??""}pre_tokenize_text(e){
return this.pattern===null?[e]:[e.replaceAll(this.pattern,this.config.content??"")]}},o1=a1,i1=class extends Gt{constructor(e){
super(),this.tokenizers=(e.pretokenizers??[]).map(t=>Qp(t))}pre_tokenize_text(e,t){return this.tokenizers.reduce((r,s)=>s?
s.pre_tokenize(r,t):r,[e])}},l1=i1,c1=class extends Gt{pre_tokenize_text(e){return fx(e)}},u1=c1,d1=class extends Gt{constructor(e){
super(),this.config=e,this._length=e.length}pre_tokenize_text(e){const t=[];for(let r=0;r<e.length;r+=this._length)t.push(
e.slice(r,r+this._length));return t}},h1=d1;function f1(e){if(e===null)return null;switch(e.type){case"BertPreTokenizer":
return new n1;case"Sequence":return new l1(e);case"Whitespace":return new Qx;case"WhitespaceSplit":return new u1;case"Me\
taspace":return new Yx(e);case"ByteLevel":return new Wx(e);case"Split":return new Jx(e);case"Punctuation":return new e1(
e);case"Digits":return new r1(e);case"Replace":return new o1(e);case"FixedLength":return new h1(e);default:throw new Error(
`Unknown PreTokenizer type: ${e.type}`)}}var Qp=f1,_1=class extends fn{constructor(e){super(),this.config=e,this.vocab=[],
this.tokens_to_ids=new Map,this.unk_token_id=void 0,this.unk_token=void 0,this.end_of_word_suffix=void 0,this.fuse_unk=this.
config.fuse_unk??!1}_call(e){let t=this.encode(e);return this.fuse_unk&&(t=ix(t,this.tokens_to_ids,this.unk_token_id)),t}},
Sa=_1,p1=class extends Sa{constructor(e){super(e),this.max_input_chars_per_word=100,this.tokens_to_ids=tl(e.vocab),this.
unk_token_id=this.tokens_to_ids.get(e.unk_token),this.unk_token=e.unk_token,this.max_input_chars_per_word=e.max_input_chars_per_word??
100,this.vocab=new Array(this.tokens_to_ids.size);for(const[t,r]of this.tokens_to_ids)this.vocab[r]=t}encode(e){const t=[];
for(const r of e){const s=[...r];if(s.length>this.max_input_chars_per_word){t.push(this.unk_token);continue}let n=!1,a=0;
const o=[];for(;a<s.length;){let i=s.length,l=null;for(;a<i;){let c=s.slice(a,i).join("");if(a>0&&(c=this.config.continuing_subword_prefix+
c),this.tokens_to_ids.has(c)){l=c;break}--i}if(l===null){n=!0;break}o.push(l),a=i}n?t.push(this.unk_token):t.push(...o)}
return t}},Rf=p1,$f=class Xp{constructor(t,r){this.is_leaf=t,this.children=r}static default(){return new Xp(!1,new Map)}},
m1=class{constructor(){this.root=$f.default()}extend(e){for(const t of e)this.push(t)}push(e){let t=this.root;for(const r of e){
let s=t.children.get(r);s===void 0&&(s=$f.default(),t.children.set(r,s)),t=s}t.is_leaf=!0}*common_prefix_search(e,t=0){let r=this.
root;if(r===void 0)return;let s="";for(let n=t;n<e.length;++n){const a=e[n];if(s+=a,r=r.children.get(a),r===void 0)return;
r.is_leaf&&(yield s)}}},g1=m1,Zo=class Yp{constructor(t,r,s,n,a){this.token_id=t,this.node_id=r,this.pos=s,this.length=n,
this.score=a,this.prev=null,this.backtrace_score=0}clone(){const t=new Yp(this.token_id,this.node_id,this.pos,this.length,
this.score);return t.prev=this.prev,t.backtrace_score=this.backtrace_score,t}},w1=class{constructor(e,t,r){this.chars=Array.
from(e),this.len=this.chars.length,this.bos_token_id=t,this.eos_token_id=r,this.nodes=[],this.begin_nodes=Array.from({length:this.
len+1},()=>[]),this.end_nodes=Array.from({length:this.len+1},()=>[]);const s=new Zo(this.bos_token_id??0,0,0,0,0),n=new Zo(
this.eos_token_id??0,1,this.len,0,0);this.nodes.push(s.clone()),this.nodes.push(n.clone()),this.begin_nodes[this.len].push(
n),this.end_nodes[0].push(s)}insert(e,t,r,s){const n=this.nodes.length,a=new Zo(s,n,e,t,r);this.begin_nodes[e].push(a),this.
end_nodes[e+t].push(a),this.nodes.push(a)}viterbi(){const e=this.len;let t=0;for(;t<=e;){if(this.begin_nodes[t].length==
0)return[];for(let o of this.begin_nodes[t]){o.prev=null;let i=0,l=null;for(let c of this.end_nodes[t]){const d=c.backtrace_score+
o.score;(l===null||d>i)&&(l=c.clone(),i=d)}if(l!==null)o.prev=l,o.backtrace_score=i;else return[]}++t}const r=[],n=this.
begin_nodes[e][0].prev;if(n===null)return[];let a=n.clone();for(;a.prev!==null;)r.push(a.clone()),a=a.clone().prev.clone();
return r.reverse(),r}piece(e){return this.chars.slice(e.pos,e.pos+e.length).join("")}tokens(){return this.viterbi().map(
t=>this.piece(t))}token_ids(){return this.viterbi().map(t=>t.token_id)}},v1=w1;function y1(e){if(e.length===0)throw new Error(
"Array must not be empty");let t=e[0],r=0;for(let s=1;s<e.length;++s)e[s]<t&&(t=e[s],r=s);return[t,r]}var b1=class extends Sa{constructor(e,t){
super(e);const r=e.vocab.length;this.vocab=new Array(r),this.scores=new Array(r);for(let s=0;s<r;++s)[this.vocab[s],this.
scores[s]]=e.vocab[s];this.unk_token_id=e.unk_id,this.unk_token=this.vocab[e.unk_id],this.tokens_to_ids=new Map(this.vocab.
map((s,n)=>[s,n])),this.bos_token=" ",this.bos_token_id=this.tokens_to_ids.get(this.bos_token),this.eos_token=t,this.eos_token_id=
this.tokens_to_ids.get(this.eos_token),this.unk_token=this.vocab[this.unk_token_id],this.min_score=y1(this.scores)[0],this.
unk_score=this.min_score-10,this.scores[this.unk_token_id]=this.unk_score,this.trie=new g1,this.trie.extend(this.vocab),
this.fuse_unk=!0}populate_nodes(e){const t=e.chars,r=1;let s=0;for(;s<t.length;){let n=!1;const a=this.trie.common_prefix_search(
t,s);for(const o of a){const i=this.tokens_to_ids.get(o),l=this.scores[i],c=ux(o);e.insert(s,c,l,i),!n&&c===r&&(n=!0)}n||
e.insert(s,r,this.unk_score,this.unk_token_id),s+=r}}tokenize(e){const t=new v1(e,this.bos_token_id,this.eos_token_id);return this.
populate_nodes(t),t.tokens()}encode(e){const t=[];for(const r of e){const s=this.tokenize(r);t.push(...s)}return t}},Gf=b1,
M1=class{constructor(e=(r,s)=>r>s,t=1/0){this._heap=[],this._comparator=e,this._max_size=t}get size(){return this._heap.
length}is_empty(){return this.size===0}peek(){return this._heap[0]}push(...e){return this.extend(e)}extend(e){for(const t of e)
if(this.size<this._max_size)this._heap.push(t),this._sift_up();else{const r=this._smallest();this._comparator(t,this._heap[r])&&
(this._heap[r]=t,this._sift_up_from(r))}return this.size}pop(){const e=this.peek(),t=this.size-1;return t>0&&this._swap(
0,t),this._heap.pop(),this._sift_down(),e}replace(e){const t=this.peek();return this._heap[0]=e,this._sift_down(),t}_parent(e){
return(e+1>>>1)-1}_left(e){return(e<<1)+1}_right(e){return e+1<<1}_greater(e,t){return this._comparator(this._heap[e],this.
_heap[t])}_swap(e,t){const r=this._heap[e];this._heap[e]=this._heap[t],this._heap[t]=r}_sift_up(){this._sift_up_from(this.
size-1)}_sift_up_from(e){for(;e>0&&this._greater(e,this._parent(e));)this._swap(e,this._parent(e)),e=this._parent(e)}_sift_down(){
let e=0;for(;this._left(e)<this.size&&this._greater(this._left(e),e)||this._right(e)<this.size&&this._greater(this._right(
e),e);){const t=this._right(e)<this.size&&this._greater(this._right(e),this._left(e))?this._right(e):this._left(e);this.
_swap(e,t),e=t}}_smallest(){return 2**Math.floor(Math.log2(this.size))-1}},x1=M1,k1=class{constructor(e){this.capacity=e,
this.cache=new Map}get(e){if(!this.cache.has(e))return;const t=this.cache.get(e);return this.cache.delete(e),this.cache.
set(e,t),t}put(e,t){this.cache.has(e)&&this.cache.delete(e),this.cache.set(e,t),this.cache.size>this.capacity&&this.cache.
delete(this.cache.keys().next().value)}clear(){this.cache.clear()}},T1=k1,E1=class extends Sa{constructor(e){super(e),this.
tokens_to_ids=tl(e.vocab),this.unk_token_id=this.tokens_to_ids.get(e.unk_token),this.unk_token=e.unk_token,this.vocab=new Array(
this.tokens_to_ids.size);for(const[r,s]of this.tokens_to_ids)this.vocab[s]=r;const t=Array.isArray(e.merges[0]);this.merges=
t?e.merges:e.merges.map(r=>r.split(" ",2)),this.bpe_ranks=new Map(this.merges.map((r,s)=>[JSON.stringify(r),s])),this.end_of_word_suffix=
e.end_of_word_suffix,this.continuing_subword_suffix=e.continuing_subword_suffix??null,this.byte_fallback=this.config.byte_fallback??
!1,this.byte_fallback&&(this.text_encoder=new TextEncoder),this.ignore_merges=this.config.ignore_merges??!1,this.max_length_to_cache=
256,this.cache_capacity=1e4,this.cache=new T1(this.cache_capacity)}clear_cache(){this.cache.clear()}bpe(e){if(e.length===
0)return[];const t=this.cache.get(e);if(t!==void 0)return t;const r=Array.from(e);this.end_of_word_suffix&&(r[r.length-1]+=
this.end_of_word_suffix);let s=[];if(r.length>1){const n=new x1((i,l)=>i.score<l.score);let a={token:r[0],bias:0,prev:null,
next:null},o=a;for(let i=1;i<r.length;++i){const l={bias:i/r.length,token:r[i],prev:o,next:null};o.next=l,this.add_node(
n,o),o=l}for(;!n.is_empty();){const i=n.pop();if(i.deleted||!i.next||i.next.deleted)continue;if(i.deleted=!0,i.next.deleted=
!0,i.prev){const c={...i.prev};i.prev.deleted=!0,i.prev=c,c.prev?c.prev.next=c:a=c}const l={token:i.token+i.next.token,bias:i.
bias,prev:i.prev,next:i.next.next};l.prev?(l.prev.next=l,this.add_node(n,l.prev)):a=l,l.next&&(l.next.prev=l,this.add_node(
n,l))}for(let i=a;i!==null;i=i.next)s.push(i.token)}else s=r;if(this.continuing_subword_suffix)for(let n=0;n<s.length-1;++n)
s[n]+=this.continuing_subword_suffix;return e.length<this.max_length_to_cache&&this.cache.put(e,s),s}add_node(e,t){const r=this.
bpe_ranks.get(JSON.stringify([t.token,t.next.token]));r!==void 0&&(t.score=r+t.bias,e.push(t))}encode(e){const t=[];for(const r of e){
if(this.ignore_merges&&this.tokens_to_ids.has(r)){t.push(r);continue}const s=this.bpe(r);for(const n of s)if(this.tokens_to_ids.
has(n))t.push(n);else if(this.byte_fallback){const a=Array.from(this.text_encoder.encode(n)).map(o=>`<0x${o.toString(16).
toUpperCase().padStart(2,"0")}>`);a.every(o=>this.tokens_to_ids.has(o))?t.push(...a):this.unk_token!=null&&t.push(this.unk_token)}else
this.unk_token!=null&&t.push(this.unk_token)}return t}},Vf=E1,A1=class extends Sa{constructor(e,t){super(e);const r=e.vocab;
this.tokens_to_ids=tl(t.target_lang?r[t.target_lang]:r),this.bos_token=t.bos_token,this.bos_token_id=this.tokens_to_ids.
get(this.bos_token),this.eos_token=t.eos_token,this.eos_token_id=this.tokens_to_ids.get(this.eos_token),this.pad_token=t.
pad_token,this.pad_token_id=this.tokens_to_ids.get(this.pad_token),this.unk_token=t.unk_token,this.unk_token_id=this.tokens_to_ids.
get(this.unk_token),this.vocab=new Array(this.tokens_to_ids.size);for(const[s,n]of this.tokens_to_ids)this.vocab[n]=s}encode(e){
return e}},C1=A1;function S1(e,t){switch(e.type){case"WordPiece":return new Rf(e);case"Unigram":return new Gf(e,t.eos_token);case"\
BPE":return new Vf(e);default:if(e.vocab)return Array.isArray(e.vocab)?new Gf(e,t.eos_token):Object.hasOwn(e,"continuing\
_subword_prefix")&&Object.hasOwn(e,"unk_token")?Object.hasOwn(e,"merges")?new Vf(e):new Rf(e):new C1(e,{target_lang:t.target_lang,
bos_token:t.bos_token,eos_token:t.eos_token,pad_token:t.pad_token,unk_token:t.unk_token});throw new Error(`Unknown Token\
izerModel type: ${e?.type}`)}}var P1=S1,F1=class extends fn{constructor(e){super(),this.config=e}_call(e,...t){return this.
post_process(e,...t)}},_n=F1,I1=class extends _n{post_process(e,t=null,r=!0){const s=t===null?this.config.single:this.config.
pair;let n=[],a=[];for(const o of s)"SpecialToken"in o?r&&(n.push(o.SpecialToken.id),a.push(o.SpecialToken.type_id)):"Se\
quence"in o&&(o.Sequence.id==="A"?(n=zt(n,e),a=zt(a,new Array(e.length).fill(o.Sequence.type_id))):o.Sequence.id==="B"&&
(n=zt(n,t),a=zt(a,new Array(t.length).fill(o.Sequence.type_id))));return{tokens:n,token_type_ids:a}}},L1=I1,O1=class extends _n{post_process(e,t=null){
return{tokens:e,tokens_pair:t}}},N1=O1,D1=class extends _n{constructor(e){super(e),this.sep=e.sep,this.cls=e.cls}post_process(e,t=null,r=!0){
r&&(e=zt([this.cls[0]],e,[this.sep[0]]));let s=new Array(e.length).fill(0);if(t){const n=[],a=r?[this.sep[0]]:[];e=zt(e,
n,t,a),s=zt(s,new Array(t.length+n.length+a.length).fill(1))}return{tokens:e,token_type_ids:s}}},z1=D1,B1=class extends _n{constructor(e){
super(e),this.sep=e.sep,this.cls=e.cls}post_process(e,t,r=!0){r&&(e=zt([this.cls[0]],e,[this.sep[0]]));let s=new Array(e.
length).fill(0);if(t){const n=r?[this.sep[0]]:[],a=r?[this.sep[0]]:[];e=zt(e,n,t,a),s=zt(s,new Array(t.length+n.length+a.
length).fill(1))}return{tokens:e,token_type_ids:s}}},R1=B1,$1=class extends _n{constructor(e){super(e),this.processors=(e.
processors??[]).map(t=>Kp(t))}post_process(e,t=null,r=!0){let s={tokens:e,tokens_pair:t};for(const n of this.processors)
s=n.post_process(s.tokens,s.tokens_pair,r);return s}},G1=$1;function V1(e){if(e===null)return null;switch(e.type){case"T\
emplateProcessing":return new L1(e);case"ByteLevel":return new N1(e);case"BertProcessing":return new z1(e);case"RobertaP\
rocessing":return new R1(e);case"Sequence":return new G1(e);default:throw new Error(`Unknown PostProcessor type: ${e.type}`)}}
var Kp=V1,U1=class extends fn{constructor(e){super(),this.config=e,this.added_tokens=[],this.end_of_word_suffix=null,this.
trim_offsets="trim_offsets"in e?e.trim_offsets:!1}_call(e){return this.decode(e)}decode(e){return this.decode_chain(e).join(
"")}},Vt=U1,j1=class extends Vt{constructor(e){super(e),this.byte_decoder=jx,this.text_decoder=new TextDecoder("utf-8",{
fatal:!1,ignoreBOM:!0}),this.end_of_word_suffix=null}convert_tokens_to_string(e){const t=e.join(""),r=new Uint8Array([...t].
map(s=>this.byte_decoder[s]));return this.text_decoder.decode(r)}decode_chain(e){const t=[];let r=[];for(const s of e)this.
added_tokens.find(n=>n.content===s)!==void 0?(r.length>0&&(t.push(this.convert_tokens_to_string(r)),r=[]),t.push(s)):r.push(
s);return r.length>0&&t.push(this.convert_tokens_to_string(r)),t}},q1=j1,W1=class extends Vt{constructor(e){super(e),this.
cleanup=e.cleanup}decode_chain(e){return e.map((t,r)=>{if(r!==0){const s=this.config.prefix;s&&t.startsWith(s)?t=t.replace(
s,""):t=" "+t}return this.cleanup&&(t=Zi(t)),t})}},H1=W1,Q1=class extends Vt{constructor(e){super(e),this.replacement=e.
replacement??"▁"}decode_chain(e){const t=[];for(let r=0;r<e.length;++r){let s=e[r].replaceAll(this.replacement," ");r==
0&&s.startsWith(" ")&&(s=s.substring(1)),t.push(s)}return t}},X1=Q1,Y1=class extends Vt{constructor(e){super(e),this.suffix=
e.suffix??""}decode_chain(e){return e.map((t,r)=>t.replaceAll(this.suffix,r===e.length-1?"":" "))}},K1=Y1,J1=class extends Vt{constructor(e){
super(e),this.pad_token=e.pad_token??"",this.word_delimiter_token=e.word_delimiter_token??"",this.cleanup=e.cleanup}convert_tokens_to_string(e){
if(e.length===0)return"";const t=[e[0]];for(let n=1;n<e.length;++n)e[n]!==t.at(-1)&&t.push(e[n]);let s=t.filter(n=>n!==this.
pad_token).join("");return this.cleanup&&(s=Zi(s).replaceAll(this.word_delimiter_token," ").trim()),s}decode_chain(e){return[
this.convert_tokens_to_string(e)]}},Z1=J1,ek=class extends Vt{constructor(e){super(e),this.decoders=(e.decoders??[]).map(
t=>Jp(t))}decode_chain(e){return this.decoders.reduce((t,r)=>r.decode_chain(t),e)}},tk=ek,rk=class extends Vt{constructor(e){
super(e),this.pattern=Aa(this.config.pattern)}decode_chain(e){const t=this.config.content??"",r=this.pattern;return r===
null?e:e.map(s=>s.replaceAll(r,t))}},sk=rk,nk=class extends Vt{decode_chain(e){return[e.join("")]}},ak=nk,ok=class extends Vt{constructor(e){
super(e),this.content=e.content??"",this.start=e.start??0,this.stop=e.stop??0}decode_chain(e){return e.map(t=>{let r=0;for(let n=0;n<
this.start&&t[n]===this.content;++n){r=n+1;continue}let s=t.length;for(let n=0;n<this.stop;++n){const a=t.length-n-1;if(t[a]===
this.content){s=a;continue}else break}return t.slice(r,s)})}},ik=ok,lk=class extends Vt{constructor(e){super(e),this.text_decoder=
new TextDecoder}decode_chain(e){const t=[];let r=[];for(const s of e){let n=null;if(s.length===6&&s.startsWith("<0x")&&s.
endsWith(">")){const a=parseInt(s.slice(3,5),16);isNaN(a)||(n=a)}if(n!==null)r.push(n);else{if(r.length>0){const a=this.
text_decoder.decode(Uint8Array.from(r));t.push(a),r=[]}t.push(s)}}if(r.length>0){const s=this.text_decoder.decode(Uint8Array.
from(r));t.push(s),r=[]}return t}},ck=lk;function uk(e){if(e===null)return null;switch(e.type){case"ByteLevel":return new q1(
e);case"WordPiece":return new H1(e);case"Metaspace":return new X1(e);case"BPEDecoder":return new K1(e);case"CTC":return new Z1(
e);case"Sequence":return new tk(e);case"Replace":return new sk(e);case"Fuse":return new ak(e);case"Strip":return new ik(
e);case"ByteFallback":return new ck(e);default:throw new Error(`Unknown Decoder type: ${e.type}`)}}var Jp=uk,dk=class{constructor(e,t){
const r=Bf(e,"Tokenizer",["model","decoder","post_processor","pre_tokenizer","normalizer"]);if(r)throw new Error(r);const s=Bf(
t,"Config");if(s)throw new Error(s);this.tokenizer=e,this.config=t,this.normalizer=Wp(this.tokenizer.normalizer),this.pre_tokenizer=
Qp(this.tokenizer.pre_tokenizer),this.model=P1(this.tokenizer.model,this.config),this.post_processor=Kp(this.tokenizer.post_processor),
this.decoder=Jp(this.tokenizer.decoder),this.special_tokens=[],this.all_special_ids=[],this.added_tokens=[];const n=[],a=[];
this.added_tokens_map=new Map;for(const o of this.tokenizer.added_tokens){const i=new VM(o);if(this.added_tokens.push(i),
this.model.tokens_to_ids.set(i.content,i.id),this.model.vocab[i.id]=i.content,i.special&&(this.special_tokens.push(i.content),
this.all_special_ids.push(i.id)),this.added_tokens_map.set(i.content,i),i.normalized&&this.normalizer!==null){const l=this.
normalizer(i.content);a.push(l),this.added_tokens_map.set(l,i)}else n.push(i.content)}(this.config.additional_special_tokens??
[]).forEach(o=>{this.special_tokens.includes(o)||this.special_tokens.push(o)}),this.decoder&&(this.decoder.added_tokens=
this.added_tokens,this.decoder.end_of_word_suffix=this.model.end_of_word_suffix),this.splitter_unnormalized=new Lf(n),this.
splitter_normalized=new Lf(a),this.remove_space=this.config.remove_space,this.clean_up_tokenization_spaces=this.config.clean_up_tokenization_spaces??
!0,this.do_lowercase_and_remove_accent=this.config.do_lowercase_and_remove_accent??!1}encode(e,{text_pair:t=null,add_special_tokens:r=!0,
return_token_type_ids:s=null}={}){const{tokens:n,token_type_ids:a}=this.tokenize_helper(e,{text_pair:t,add_special_tokens:r}),
o=n.map(l=>this.added_tokens_map.get(l)?.id??this.model.tokens_to_ids.get(l)??this.model.unk_token_id),i={ids:o,tokens:n,
attention_mask:new Array(o.length).fill(1)};return s&&a&&(i.token_type_ids=a),i}decode(e,t={}){if(!Array.isArray(e)||e.length===
0||!cx(e[0]))throw Error("token_ids must be a non-empty array of integers.");let r=e.map(n=>this.model.vocab[Number(n)]??
this.model.unk_token);t.skip_special_tokens&&(r=r.filter(n=>!this.special_tokens.includes(n)));let s=this.decoder?this.decoder(
r):r.join(" ");return this.decoder&&this.decoder.end_of_word_suffix&&(s=s.replaceAll(this.decoder.end_of_word_suffix," "),
t.skip_special_tokens&&(s=s.trim())),(t.clean_up_tokenization_spaces??this.clean_up_tokenization_spaces)&&(s=Zi(s)),s}tokenize(e,{
text_pair:t=null,add_special_tokens:r=!1}={}){return this.tokenize_helper(e,{text_pair:t,add_special_tokens:r}).tokens}encode_text(e){
if(e===null)return null;const t=this.splitter_unnormalized.split(e);return t.forEach((r,s)=>{const n=this.added_tokens_map.
get(r);n&&(n.lstrip&&s>0&&(t[s-1]=t[s-1].trimEnd()),n.rstrip&&s<t.length-1&&(t[s+1]=t[s+1].trimStart()))}),t.flatMap((r,s)=>{
if(r.length===0)return[];if(this.added_tokens_map.has(r))return[r];if(this.remove_space===!0&&(r=r.trim().split(/\s+/).join(
" ")),this.do_lowercase_and_remove_accent&&(r=dx(r)),this.normalizer!==null&&(r=this.normalizer(r)),r.length===0)return[];
const n=this.splitter_normalized.split(r);return n.forEach((a,o)=>{const i=this.added_tokens_map.get(a);i&&(i.lstrip&&o>
0&&(n[o-1]=n[o-1].trimEnd()),i.rstrip&&o<n.length-1&&(n[o+1]=n[o+1].trimStart()))}),n.flatMap(a=>{if(a.length===0)return[];
if(this.added_tokens_map.has(a))return[a];const o=this.pre_tokenizer!==null?this.pre_tokenizer(a,{section_index:s}):[a];
return this.model(o)})})}tokenize_helper(e,{text_pair:t=null,add_special_tokens:r=!0}){const s=this.encode_text(e),n=this.
encode_text(t||null);return this.post_processor?this.post_processor(s,n,r):{tokens:zt(s??[],n??[])}}token_to_id(e){return this.
model.tokens_to_ids.get(e)}id_to_token(e){return this.model.vocab[e]}get_added_tokens_decoder(){const e=new Map;for(const t of this.
added_tokens)e.set(t.id,t);return e}get_vocab(e=!0){const t=new Map;for(let r=0;r<this.model.vocab.length;++r){const s=this.
model.vocab[r];(e||!this.added_tokens_map.has(s))&&t.set(s,r)}return t}},hk=dk,fk=Object.defineProperty,_k=(e,t,r)=>t in
e?fk(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,pk=(e,t,r)=>(_k(e,t+"",r),r),B=Object.freeze({Text:"\
Text",NumericLiteral:"NumericLiteral",StringLiteral:"StringLiteral",Identifier:"Identifier",Equals:"Equals",OpenParen:"O\
penParen",CloseParen:"CloseParen",OpenStatement:"OpenStatement",CloseStatement:"CloseStatement",OpenExpression:"OpenExpr\
ession",CloseExpression:"CloseExpression",OpenSquareBracket:"OpenSquareBracket",CloseSquareBracket:"CloseSquareBracket",
OpenCurlyBracket:"OpenCurlyBracket",CloseCurlyBracket:"CloseCurlyBracket",Comma:"Comma",Dot:"Dot",Colon:"Colon",Pipe:"Pi\
pe",CallOperator:"CallOperator",AdditiveBinaryOperator:"AdditiveBinaryOperator",MultiplicativeBinaryOperator:"Multiplica\
tiveBinaryOperator",ExponentiationBinaryOperator:"ExponentiationBinaryOperator",ComparisonBinaryOperator:"ComparisonBina\
ryOperator",UnaryOperator:"UnaryOperator",Comment:"Comment"}),Et=class{constructor(e,t){this.value=e,this.type=t}};function Uf(e){
return/\w/.test(e)}function Rr(e){return/[0-9]/.test(e)}function jf(e){return/\s/.test(e)}var mk=[["{%",B.OpenStatement],
["%}",B.CloseStatement],["{{",B.OpenExpression],["}}",B.CloseExpression],["(",B.OpenParen],[")",B.CloseParen],["{",B.OpenCurlyBracket],
["}",B.CloseCurlyBracket],["[",B.OpenSquareBracket],["]",B.CloseSquareBracket],[",",B.Comma],[".",B.Dot],[":",B.Colon],[
"|",B.Pipe],["<=",B.ComparisonBinaryOperator],[">=",B.ComparisonBinaryOperator],["==",B.ComparisonBinaryOperator],["!=",
B.ComparisonBinaryOperator],["<",B.ComparisonBinaryOperator],[">",B.ComparisonBinaryOperator],["+",B.AdditiveBinaryOperator],
["-",B.AdditiveBinaryOperator],["~",B.AdditiveBinaryOperator],["**",B.ExponentiationBinaryOperator],["*",B.MultiplicativeBinaryOperator],
["//",B.MultiplicativeBinaryOperator],["/",B.MultiplicativeBinaryOperator],["%",B.MultiplicativeBinaryOperator],["=",B.Equals]],
gk=new Map([["n",`
`],["t","	"],["r","\r"],["b","\b"],["f","\f"],["v","\v"],["'","'"],['"','"'],["\\","\\"]]);function wk(e,t={}){return e.
endsWith(`
`)&&(e=e.slice(0,-1)),t.lstrip_blocks&&(e=e.replace(/^[ \t]*({[#%-])/gm,"$1")),t.trim_blocks&&(e=e.replace(/([#%-]})\n/g,
"$1")),e.replace(/(\s*){%(-?)\s*(?:end)?generation\s*(-?)%}(\s*)/gs,(r,s,n,a,o)=>(n?"":s)+(a?"":o))}function vk(e,t={}){
const r=[],s=wk(e,t);let n=0,a=0;const o=c=>{let d="";for(;c(s[n]);){if(s[n]==="\\"){if(++n,n>=s.length)throw new SyntaxError(
"Unexpected end of input");const h=s[n++],_=gk.get(h);if(_===void 0)throw new SyntaxError(`Unexpected escaped character:\
 ${h}`);d+=_;continue}if(d+=s[n++],n>=s.length)throw new SyntaxError("Unexpected end of input")}return d},i=()=>{const c=r.
at(-1);c&&c.type===B.Text&&(c.value=c.value.trimEnd(),c.value===""&&r.pop())},l=()=>{for(;n<s.length&&jf(s[n]);)++n};e:for(;n<
s.length;){const c=r.at(-1)?.type;if(c===void 0||c===B.CloseStatement||c===B.CloseExpression||c===B.Comment){let h="";for(;n<
s.length&&!(s[n]==="{"&&(s[n+1]==="%"||s[n+1]==="{"||s[n+1]==="#"));)h+=s[n++];if(h.length>0){r.push(new Et(h,B.Text));continue}}
if(s[n]==="{"&&s[n+1]==="#"){n+=2;const h=s[n]==="-";h&&++n;let _="";for(;s[n]!=="#"||s[n+1]!=="}";){if(n+2>=s.length)throw new SyntaxError(
"Missing end of comment tag");_+=s[n++]}const p=_.endsWith("-");p&&(_=_.slice(0,-1)),h&&i(),r.push(new Et(_,B.Comment)),
n+=2,p&&l();continue}if(s.slice(n,n+3)==="{%-"){i(),r.push(new Et("{%",B.OpenStatement)),n+=3;continue}if(s.slice(n,n+3)===
"{{-"){i(),r.push(new Et("{{",B.OpenExpression)),a=0,n+=3;continue}if(o(jf),s.slice(n,n+3)==="-%}"){r.push(new Et("%}",B.
CloseStatement)),n+=3,l();continue}if(s.slice(n,n+3)==="-}}"){r.push(new Et("}}",B.CloseExpression)),n+=3,l();continue}const d=s[n];
if(d==="-"||d==="+"){const h=r.at(-1)?.type;if(h===B.Text||h===void 0)throw new SyntaxError(`Unexpected character: ${d}`);
switch(h){case B.Identifier:case B.NumericLiteral:case B.StringLiteral:case B.CloseParen:case B.CloseSquareBracket:break;default:{
++n;let _=o(Rr);if(_.length>0&&s[n]==="."&&Rr(s[n+1])){++n;const p=o(Rr);_=`${_}.${p}`}r.push(new Et(`${d}${_}`,_.length>
0?B.NumericLiteral:B.UnaryOperator));continue}}}for(const[h,_]of mk){if(h==="}}"&&a>0)continue;if(s.slice(n,n+h.length)===
h){r.push(new Et(h,_)),_===B.OpenExpression?a=0:_===B.OpenCurlyBracket?++a:_===B.CloseCurlyBracket&&--a,n+=h.length;continue e}}
if(d==="'"||d==='"'){++n;const h=o(_=>_!==d);r.push(new Et(h,B.StringLiteral)),++n;continue}if(Rr(d)){let h=o(Rr);if(r.at(
-1)?.type!==B.Dot&&s[n]==="."&&Rr(s[n+1])){++n;const _=o(Rr);h=`${h}.${_}`}r.push(new Et(h,B.NumericLiteral));continue}if(Uf(
d)){const h=o(Uf);r.push(new Et(h,B.Identifier));continue}throw new SyntaxError(`Unexpected character: ${d}`)}return r}var Ct=class{type="\
Statement"},yk=class extends Ct{constructor(e){super(),this.body=e}type="Program"},bk=class extends Ct{constructor(e,t,r){
super(),this.test=e,this.body=t,this.alternate=r}type="If"},Mk=class extends Ct{constructor(e,t,r,s){super(),this.loopvar=
e,this.iterable=t,this.body=r,this.defaultBlock=s}type="For"},xk=class extends Ct{type="Break"},kk=class extends Ct{type="\
Continue"},Tk=class extends Ct{constructor(e,t,r){super(),this.assignee=e,this.value=t,this.body=r}type="Set"},Ek=class extends Ct{constructor(e,t,r){
super(),this.name=e,this.args=t,this.body=r}type="Macro"},Ak=class extends Ct{constructor(e){super(),this.value=e}type="\
Comment"},pt=class extends Ct{type="Expression"},Ck=class extends pt{constructor(e,t,r){super(),this.object=e,this.property=
t,this.computed=r}type="MemberExpression"},qf=class extends pt{constructor(e,t){super(),this.callee=e,this.args=t}type="\
CallExpression"},yr=class extends pt{constructor(e){super(),this.value=e}type="Identifier"},Ts=class extends pt{constructor(e){
super(),this.value=e}type="Literal"},Sk=class extends Ts{type="IntegerLiteral"},Pk=class extends Ts{type="FloatLiteral"},
Wf=class extends Ts{type="StringLiteral"},Fk=class extends Ts{type="ArrayLiteral"},Hf=class extends Ts{type="TupleLitera\
l"},Ik=class extends Ts{type="ObjectLiteral"},cs=class extends pt{constructor(e,t,r){super(),this.operator=e,this.left=t,
this.right=r}type="BinaryExpression"},Lk=class extends pt{constructor(e,t){super(),this.operand=e,this.filter=t}type="Fi\
lterExpression"},Ok=class extends Ct{constructor(e,t){super(),this.filter=e,this.body=t}type="FilterStatement"},Nk=class extends pt{constructor(e,t){
super(),this.lhs=e,this.test=t}type="SelectExpression"},Dk=class extends pt{constructor(e,t,r){super(),this.operand=e,this.
negate=t,this.test=r}type="TestExpression"},Qf=class extends pt{constructor(e,t){super(),this.operator=e,this.argument=t}type="\
UnaryExpression"},zk=class extends pt{constructor(e=void 0,t=void 0,r=void 0){super(),this.start=e,this.stop=t,this.step=
r}type="SliceExpression"},ei=class extends pt{constructor(e,t){super(),this.key=e,this.value=t}type="KeywordArgumentExpr\
ession"},Bk=class extends pt{constructor(e){super(),this.argument=e}type="SpreadExpression"},Rk=class extends pt{constructor(e){
super(),this.argument=e}type="KeywordSpreadExpression"},$k=class extends Ct{constructor(e,t,r){super(),this.call=e,this.
callerArgs=t,this.body=r}type="CallStatement"},Gk=class extends pt{constructor(e,t,r){super(),this.condition=e,this.trueExpr=
t,this.falseExpr=r}type="Ternary"};function Vk(e){const t=new yk([]);let r=0;function s(L,O){const V=e[r++];if(!V||V.type!==
L)throw new Error(`Parser Error: ${O}. ${V.type} !== ${L}.`);return V}function n(L){if(!l(L))throw new SyntaxError(`Expe\
cted ${L}`);++r}function a(){switch(e[r].type){case B.Comment:return new Ak(e[r++].value);case B.Text:return c();case B.
OpenStatement:return d();case B.OpenExpression:return h();default:throw new SyntaxError(`Unexpected token type: ${e[r].type}`)}}
function o(...L){return r+L.length<=e.length&&L.every((O,V)=>O===e[r+V].type)}function i(...L){return e[r]?.type===B.OpenStatement&&
e[r+1]?.type===B.Identifier&&L.includes(e[r+1]?.value)}function l(...L){return r+L.length<=e.length&&L.every((O,V)=>e[r+
V].type==="Identifier"&&O===e[r+V].value)}function c(){return new Wf(s(B.Text,"Expected text token").value)}function d(){
if(s(B.OpenStatement,"Expected opening statement token"),e[r].type!==B.Identifier)throw new SyntaxError(`Unknown stateme\
nt, got ${e[r].type}`);const L=e[r].value;let O;switch(L){case"set":++r,O=_();break;case"if":++r,O=p(),s(B.OpenStatement,
"Expected {% token"),n("endif"),s(B.CloseStatement,"Expected %} token");break;case"macro":++r,O=w(),s(B.OpenStatement,"E\
xpected {% token"),n("endmacro"),s(B.CloseStatement,"Expected %} token");break;case"for":++r,O=y(),s(B.OpenStatement,"Ex\
pected {% token"),n("endfor"),s(B.CloseStatement,"Expected %} token");break;case"call":{++r;let V=null;o(B.OpenParen)&&(V=
j("parameters"));const ne=se();if(ne.type!=="Identifier")throw new SyntaxError("Expected identifier following call state\
ment");const ae=j("call");s(B.CloseStatement,"Expected closing statement token");const qe=[];for(;!i("endcall");)qe.push(
a());s(B.OpenStatement,"Expected '{%'"),n("endcall"),s(B.CloseStatement,"Expected closing statement token");const Ee=new qf(
ne,ae);O=new $k(Ee,V,qe);break}case"break":++r,s(B.CloseStatement,"Expected closing statement token"),O=new xk;break;case"\
continue":++r,s(B.CloseStatement,"Expected closing statement token"),O=new kk;break;case"filter":{++r;let V=se();V instanceof
yr&&o(B.OpenParen)&&(V=R(V)),s(B.CloseStatement,"Expected closing statement token");const ne=[];for(;!i("endfilter");)ne.
push(a());s(B.OpenStatement,"Expected '{%'"),n("endfilter"),s(B.CloseStatement,"Expected '%}'"),O=new Ok(V,ne);break}default:
throw new SyntaxError(`Unknown statement type: ${L}`)}return O}function h(){s(B.OpenExpression,"Expected opening express\
ion token");const L=b();return s(B.CloseExpression,"Expected closing expression token"),L}function _(){const L=v();let O=null;
const V=[];if(o(B.Equals))++r,O=v();else{for(s(B.CloseStatement,"Expected %} token");!i("endset");)V.push(a());s(B.OpenStatement,
"Expected {% token"),n("endset")}return s(B.CloseStatement,"Expected closing statement token"),new Tk(L,O,V)}function p(){
const L=b();s(B.CloseStatement,"Expected closing statement token");const O=[],V=[];for(;!i("elif","else","endif");)O.push(
a());if(i("elif")){++r,++r;const ne=p();V.push(ne)}else if(i("else"))for(++r,++r,s(B.CloseStatement,"Expected closing st\
atement token");!i("endif");)V.push(a());return new bk(L,O,V)}function w(){const L=se();if(L.type!=="Identifier")throw new SyntaxError(
"Expected identifier following macro statement");const O=j("parameters");s(B.CloseStatement,"Expected closing statement \
token");const V=[];for(;!i("endmacro");)V.push(a());return new Ek(L,O,V)}function v(L=!1){const O=L?se:b,V=[O()],ne=o(B.
Comma);for(;ne&&(++r,V.push(O()),!!o(B.Comma)););return ne?new Hf(V):V[0]}function y(){const L=v(!0);if(!(L instanceof yr||
L instanceof Hf))throw new SyntaxError(`Expected identifier/tuple for the loop variable, got ${L.type} instead`);if(!l("\
in"))throw new SyntaxError("Expected `in` keyword following loop variable");++r;const O=b();s(B.CloseStatement,"Expected\
 closing statement token");const V=[];for(;!i("endfor","else");)V.push(a());const ne=[];if(i("else"))for(++r,++r,s(B.CloseStatement,
"Expected closing statement token");!i("endfor");)ne.push(a());return new Mk(L,O,V,ne)}function b(){return k()}function k(){
const L=A();if(l("if")){++r;const O=A();if(l("else")){++r;const V=k();return new Gk(O,L,V)}else return new Nk(L,O)}return L}
function A(){let L=E();for(;l("or");){const O=e[r];++r;const V=E();L=new cs(O,L,V)}return L}function E(){let L=C();for(;l(
"and");){const O=e[r];++r;const V=C();L=new cs(O,L,V)}return L}function C(){let L;for(;l("not");){const O=e[r];++r;const V=C();
L=new Qf(O,V)}return L??N()}function N(){let L=M();for(;;){let O;if(l("not","in"))O=new Et("not in",B.Identifier),r+=2;else if(l(
"in"))O=e[r++];else if(o(B.ComparisonBinaryOperator))O=e[r++];else break;const V=M();L=new cs(O,L,V)}return L}function M(){
let L=I();for(;o(B.AdditiveBinaryOperator);){const O=e[r];++r;const V=I();L=new cs(O,L,V)}return L}function $(){const L=z(
se());return o(B.OpenParen)?R(L):L}function R(L){let O=new qf(L,j("call"));return O=z(O),o(B.OpenParen)&&(O=R(O)),O}function j(L){
s(B.OpenParen,"Expected opening parenthesis for arguments list");const O=Y(L);return s(B.CloseParen,"Expected closing pa\
renthesis for arguments list"),O}function Y(L){const O=[],V=new Set;let ne=!1,ae=!1;for(;!o(B.CloseParen);){const qe=o(B.
ExponentiationBinaryOperator),Ee=o(B.MultiplicativeBinaryOperator)&&e[r].value==="*";if(L==="parameters"&&(qe||Ee))throw new SyntaxError(
"Argument unpacking is not allowed in parameter declarations");if(qe){if(++r,O.push(new Rk(b())),o(B.Comma)&&++r,!o(B.CloseParen))
throw new SyntaxError("Expected closing parenthesis: `**` must be applied to the final argument");break}let Ae;if(Ee){if(ae)
throw new SyntaxError("Only one `*` argument unpacking is allowed");ae=!0,++r;const $e=b();Ae=new Bk($e)}else{if(Ae=b(),
o(B.Equals)){if(++r,!(Ae instanceof yr))throw new SyntaxError(L==="parameters"?"Expected identifier for parameter declar\
ation":"Expected identifier for keyword argument");const $e=b();Ae=new ei(Ae,$e)}if(L==="parameters"){if(!(Ae instanceof
yr||Ae instanceof ei))throw new SyntaxError("Expected identifier for parameter declaration");const $e=Ae instanceof yr?Ae.
value:Ae.key.value;if(V.has($e))throw new SyntaxError(`Duplicate parameter name: ${$e}`);V.add($e)}if(Ae instanceof ei)ne=
!0;else{if(ne)throw new SyntaxError(L==="call"?"Positional arguments must come before keyword arguments":"Non-default ar\
gument follows default argument");if(ae)throw new SyntaxError("Positional arguments must not follow `*` argument unpacki\
ng")}}O.push(Ae),o(B.Comma)&&++r}return O}function Q(){const L=[];let O=!1;for(;!o(B.CloseSquareBracket);)o(B.Colon)?(L.
push(void 0),++r,O=!0):(L.push(b()),o(B.Colon)&&(++r,O=!0));if(L.length===0)throw new SyntaxError("Expected at least one\
 argument for member/slice expression");if(O){if(L.length>3)throw new SyntaxError("Expected 0-3 arguments for slice expr\
ession");return new zk(...L)}return L[0]}function z(L){for(;o(B.Dot)||o(B.OpenSquareBracket);){const O=e[r];++r;let V;const ne=O.
type===B.OpenSquareBracket;if(ne)V=Q(),s(B.CloseSquareBracket,"Expected closing square bracket");else if(V=se(),V.type!==
"Identifier"&&V.type!=="IntegerLiteral")throw new SyntaxError("Expected identifier or integer following dot operator");L=
new Ck(L,V,ne)}return L}function I(){let L=U();for(;o(B.MultiplicativeBinaryOperator);){const O=e[r++],V=U();L=new cs(O,
L,V)}return L}function U(){let L=X();for(;o(B.ExponentiationBinaryOperator);){const O=e[r++],V=X();L=new cs(O,L,V)}return L}
function X(){let L=ce();for(;l("is");){++r;const O=l("not");O&&++r;const V=se();if(!(V instanceof yr))throw new SyntaxError(
"Expected identifier for the test");L=new Dk(L,O,V)}return L}function ce(){let L=Z();for(;o(B.Pipe);){++r;let O=se();if(!(O instanceof
yr))throw new SyntaxError("Expected identifier for the filter");o(B.OpenParen)&&(O=R(O)),L=new Lk(L,O)}return L}function Z(){
const L=e[r];if(L&&(L.type===B.UnaryOperator||L.type===B.AdditiveBinaryOperator)&&(L.value==="-"||L.value==="+")){const O=e[r++],
V=Z();return new Qf(O,V)}return $()}function se(){const L=e[r++];switch(L.type){case B.NumericLiteral:{const O=L.value;return O.
includes(".")?new Pk(Number(O)):new Sk(Number(O))}case B.StringLiteral:{let O=L.value;for(;o(B.StringLiteral);)O+=e[r++].
value;return new Wf(O)}case B.Identifier:return new yr(L.value);case B.OpenParen:{const O=v();return s(B.CloseParen,"Exp\
ected closing parenthesis, got ${tokens[current].type} instead."),O}case B.OpenSquareBracket:{const O=[];for(;!o(B.CloseSquareBracket);)
O.push(b()),o(B.Comma)&&++r;return++r,new Fk(O)}case B.OpenCurlyBracket:{const O=new Map;for(;!o(B.CloseCurlyBracket);){
const V=b();s(B.Colon,"Expected colon between key and value in object literal");const ne=b();O.set(V,ne),o(B.Comma)&&++r}
return++r,new Ik(O)}default:throw new SyntaxError(`Unexpected token: ${L.type}`)}}for(;r<e.length;)t.body.push(a());return t}
function Uk(e,t,r=1){if(t===void 0&&(t=e,e=0),r===0)throw new Error("range() step must not be zero");const s=[];if(r>0)for(let n=e;n<
t;n+=r)s.push(n);else for(let n=e;n>t;n+=r)s.push(n);return s}function Xf(e,t,r,s=1){const n=Math.sign(s);n>=0?(t=(t??=0)<
0?Math.max(e.length+t,0):Math.min(t,e.length),r=(r??=e.length)<0?Math.max(e.length+r,0):Math.min(r,e.length)):(t=(t??=e.
length-1)<0?Math.max(e.length+t,-1):Math.min(t,e.length-1),r=(r??=-1)<-1?Math.max(e.length+r,-1):Math.min(r,e.length-1));
const a=[];for(let o=t;n*o<n*r;o+=s)a.push(e[o]);return a}function jk(e){return e.replace(/\b\w/g,t=>t.toUpperCase())}function qk(e){
return Wk(new Date,e)}function Wk(e,t){const r=new Intl.DateTimeFormat(void 0,{month:"long"}),s=new Intl.DateTimeFormat(
void 0,{month:"short"}),n=a=>a<10?"0"+a:a.toString();return t.replace(/%[YmdbBHM%]/g,a=>{switch(a){case"%Y":return e.getFullYear().
toString();case"%m":return n(e.getMonth()+1);case"%d":return n(e.getDate());case"%b":return s.format(e);case"%B":return r.
format(e);case"%H":return n(e.getHours());case"%M":return n(e.getMinutes());case"%%":return"%";default:return a}})}function Hk(e){
return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Qk(e,t,r,s){if(s===0)return e;let n=s==null||s<0?1/0:s;const a=t.
length===0?new RegExp("(?=)","gu"):new RegExp(Hk(t),"gu");return e.replaceAll(a,o=>n>0?(--n,r):o)}var Yf=class extends Error{},
Kf=class extends Error{},Xk=new Map,Ut=class{type="RuntimeValue";value;get builtins(){return Xk}constructor(e=void 0){this.
value=e}__bool__(){return new oe(!!this.value)}toString(){return String(this.value)}},le=class extends Ut{type="IntegerV\
alue"},Ce=class extends Ut{type="FloatValue";toString(){return Object.is(this.value,-0)?"-0.0":this.value%1===0?this.value.
toFixed(1):this.value.toString()}},K=class extends Ut{type="StringValue";_builtins;get builtins(){return this._builtins??=
new Map([["upper",new De(()=>new K(this.value.toUpperCase()))],["lower",new De(()=>new K(this.value.toLowerCase()))],["s\
trip",new De(()=>new K(this.value.trim()))],["title",new De(()=>new K(jk(this.value)))],["capitalize",new De(()=>new K(this.
value.charAt(0).toUpperCase()+this.value.slice(1)))],["length",new le(this.value.length)],["rstrip",new De(()=>new K(this.
value.trimEnd()))],["lstrip",new De(()=>new K(this.value.trimStart()))],["startswith",new De(e=>{if(e.length===0)throw new Error(
"startswith() requires at least one argument");const t=e[0];if(t instanceof K)return new oe(this.value.startsWith(t.value));
if(t instanceof pe){for(const r of t.value){if(!(r instanceof K))throw new Error("startswith() tuple elements must be st\
rings");if(this.value.startsWith(r.value))return new oe(!0)}return new oe(!1)}throw new Error("startswith() argument mus\
t be a string or tuple of strings")})],["endswith",new De(e=>{if(e.length===0)throw new Error("endswith() requires at le\
ast one argument");const t=e[0];if(t instanceof K)return new oe(this.value.endsWith(t.value));if(t instanceof pe){for(const r of t.
value){if(!(r instanceof K))throw new Error("endswith() tuple elements must be strings");if(this.value.endsWith(r.value))
return new oe(!0)}return new oe(!1)}throw new Error("endswith() argument must be a string or tuple of strings")})],["spl\
it",new De(e=>{const t=e[0]??new Be;if(!(t instanceof K||t instanceof Be))throw new Error("sep argument must be a string\
 or null");const r=e[1]??new le(-1);if(!(r instanceof le))throw new Error("maxsplit argument must be a number");let s=[];
if(t instanceof Be){const n=this.value.trimStart();for(const{0:a,index:o}of n.matchAll(/\S+/g)){if(r.value!==-1&&s.length>=
r.value&&o!==void 0){s.push(a+n.slice(o+a.length));break}s.push(a)}}else{if(t.value==="")throw new Error("empty separato\
r");s=this.value.split(t.value),r.value!==-1&&s.length>r.value&&s.push(s.splice(r.value).join(t.value))}return new pe(s.
map(n=>new K(n)))})],["replace",new De(e=>{if(e.length<2)throw new Error("replace() requires at least two arguments");const t=e[0],
r=e[1];if(!(t instanceof K&&r instanceof K))throw new Error("replace() arguments must be strings");let s;if(e.length>2?e[2].
type==="KeywordArgumentsValue"?s=e[2].value.get("count")??new Be:s=e[2]:s=new Be,!(s instanceof le||s instanceof Be))throw new Error(
"replace() count argument must be a number or null");return new K(Qk(this.value,t.value,r.value,s.value))})]])}},oe=class extends Ut{type="\
BooleanValue"},Yk=/[\x7f-\uffff]/g;function Jf(e){return e.replace(Yk,t=>"\\u"+t.charCodeAt(0).toString(16).padStart(4,"\
0"))}function Cr(e,t={},r=0,s=!0){const{indent:n=null,ensureAscii:a=!1,separators:o=null,sortKeys:i=!1}=t;let l,c;switch(o?
[l,c]=o:n?(l=",",c=": "):(l=", ",c=": "),e.type){case"NullValue":return"null";case"UndefinedValue":return s?"null":"unde\
fined";case"IntegerValue":case"FloatValue":case"BooleanValue":return JSON.stringify(e.value);case"StringValue":{let d=JSON.
stringify(e.value);return a&&(d=Jf(d)),d}case"ArrayValue":case"NamespaceValue":case"ObjectValue":{const d=n?" ".repeat(n):
"",h=`
`+d.repeat(r),_=h+d;if(e.type==="ArrayValue"){const p=e.value.map(w=>Cr(w,t,r+1,s));return n?`[${_}${p.join(`${l}${_}`)}${h}\
]`:`[${p.join(l)}]`}else{let p=Array.from(e.value.entries());i&&(p=p.sort(([v],[y])=>v.localeCompare(y)));const w=p.map(
([v,y])=>{let b=JSON.stringify(v);a&&(b=Jf(b));const k=`${b}${c}${Cr(y,t,r+1,s)}`;return n?`${_}${k}`:k});return n?`{${w.
join(l)}${h}}`:`{${w.join(l)}}`}}default:throw new Error(`Cannot convert to JSON: ${e.type}`)}}var lt=class extends Ut{type="\
ObjectValue";_builtins;__bool__(){return new oe(this.value.size>0)}get builtins(){return this._builtins??=new Map([["get",
new De(([e,t])=>{if(!(e instanceof K))throw new Error(`Object key must be a string: got ${e.type}`);return this.value.get(
e.value)??t??new Be})],["items",new De(()=>this.items())],["keys",new De(()=>this.keys())],["values",new De(()=>this.values())],
["dictsort",new De(e=>{let t=new Map;const r=e.filter(i=>i instanceof jr?(t=i.value,!1):!0),s=r.at(0)??t.get("case_sensi\
tive")??new oe(!1);if(!(s instanceof oe))throw new Error("case_sensitive must be a boolean");const n=r.at(1)??t.get("by")??
new K("key");if(!(n instanceof K))throw new Error("by must be a string");if(!["key","value"].includes(n.value))throw new Error(
"by must be either 'key' or 'value'");const a=r.at(2)??t.get("reverse")??new oe(!1);if(!(a instanceof oe))throw new Error(
"reverse must be a boolean");const o=Array.from(this.value.entries()).map(([i,l])=>new pe([new K(i),l])).sort((i,l)=>{const c=n.
value==="key"?0:1,d=i.value[c],h=l.value[c],_=gi(d,h,s.value);return a.value?-_:_});return new pe(o)})]])}items(){return new pe(
Array.from(this.value.entries()).map(([e,t])=>new pe([new K(e),t])))}keys(){return new pe(Array.from(this.value.keys()).
map(e=>new K(e)))}values(){return new pe(Array.from(this.value.values()))}toString(){return Cr(this,{},0,!1)}},jr=class extends lt{type="\
KeywordArgumentsValue"},rl=class extends Ut{type="NamespaceValue";toString(){return Cr(this,{},0,!1)}},pe=class extends Ut{type="\
ArrayValue";_builtins;get builtins(){return this._builtins??=new Map([["length",new le(this.value.length)]])}__bool__(){
return new oe(this.value.length>0)}toString(){return Cr(this,{},0,!1)}},Zf=class extends pe{type="TupleValue"},De=class extends Ut{type="\
FunctionValue"},Be=class extends Ut{type="NullValue"},Ne=class extends Ut{type="UndefinedValue"};function Kk(e){let t;if(e instanceof
pe?t=e.value:e instanceof K&&(t=Array.from(e.value,n=>new K(n))),!t||t.length!==2)throw new Error("namespace expected an\
 object or an iterable of [key, value] pairs");const[r,s]=t;if(!(r instanceof K))throw new Error("namespace keys must be\
 strings");return[r,s]}var Zp=class{constructor(e){this.parent=e}variables=new Map([["namespace",new De(e=>{const t=e.slice();
let r;if(t.at(-1)instanceof jr&&(r=t.pop()),t.length>1)throw new Error(`namespace expected at most 1 argument, got ${t.length}`);
const s=new Map;if(t.length===1){const n=t[0];if(n instanceof lt)for(const[a,o]of n.value)s.set(a,o);else if(n instanceof
pe)for(const a of n.value){const[o,i]=Kk(a);s.set(o.value,i)}else throw new Error(`'${n.type}' object is not iterable`)}
if(r)for(const[n,a]of r.value)s.set(n,a);return new rl(s)})]]);tests=Zp.TESTS;set(e,t){return this.declareVariable(e,na(
t))}declareVariable(e,t){if(this.variables.has(e))throw new SyntaxError(`Variable already declared: ${e}`);return this.variables.
set(e,t),t}setVariable(e,t){return this.variables.set(e,t),t}resolve(e){if(this.variables.has(e))return this;if(this.parent)
return this.parent.resolve(e);throw new Error(`Unknown variable: ${e}`)}lookupVariable(e){try{return this.resolve(e).variables.
get(e)??new Ne}catch{return new Ne}}},Mr=Zp;pk(Mr,"TESTS",new Map([["boolean",e=>e.type==="BooleanValue"],["callable",e=>e instanceof
De],["odd",e=>{if(!(e instanceof le))throw new Error(`cannot odd on ${e.type}`);return e.value%2!==0}],["even",e=>{if(!(e instanceof
le))throw new Error(`cannot even on ${e.type}`);return e.value%2===0}],["false",e=>e.type==="BooleanValue"&&!e.value],["\
true",e=>e.type==="BooleanValue"&&e.value],["none",e=>e.type==="NullValue"],["string",e=>e.type==="StringValue"],["numbe\
r",e=>e instanceof le||e instanceof Ce],["integer",e=>e instanceof le],["iterable",e=>e.type==="ArrayValue"||e.type==="S\
tringValue"],["mapping",e=>e instanceof lt],["sequence",e=>e instanceof pe||e instanceof lt||e instanceof K],["lower",e=>{
const t=e.value;return e.type==="StringValue"&&t===t.toLowerCase()}],["upper",e=>{const t=e.value;return e.type==="Strin\
gValue"&&t===t.toUpperCase()}],["none",e=>e.type==="NullValue"],["defined",e=>e.type!=="UndefinedValue"],["undefined",e=>e.
type==="UndefinedValue"],["equalto",(e,t)=>e.value===t.value],["eq",(e,t)=>e.value===t.value]]));function Jk(e){e.set("f\
alse",!1),e.set("true",!0),e.set("none",null),e.set("raise_exception",t=>{throw new Error(t)}),e.set("range",Uk),e.set("\
strftime_now",qk),e.set("True",!0),e.set("False",!1),e.set("None",null)}function sa(e){return e instanceof lt||e instanceof
rl}function wa(e){return e instanceof le||e instanceof Ce||e instanceof oe}function va(e){return e instanceof oe?Number(
e.value):e.value}function e_(e,t){const r=t.split(".");let s=e;for(const n of r)if(sa(s))s=s.value.get(n)??new Ne;else if(s instanceof
pe){const a=parseInt(n,10);if(!isNaN(a)&&a>=0&&a<s.value.length)s=s.value[a];else return new Ne}else return new Ne;return s}
function gi(e,t,r=!1){if(e instanceof Be&&t instanceof Be)return 0;if(e instanceof Be||t instanceof Be)throw new Error(`\
Cannot compare ${e.type} with ${t.type}`);if(e instanceof Ne&&t instanceof Ne)return 0;if(e instanceof Ne||t instanceof Ne)
throw new Error(`Cannot compare ${e.type} with ${t.type}`);if(wa(e)&&wa(t)){const s=va(e),n=va(t);return s<n?-1:s>n?1:0}
if(e.type!==t.type)throw new Error(`Cannot compare different types: ${e.type} and ${t.type}`);switch(e.type){case"String\
Value":{let s=e.value,n=t.value;return r||(s=s.toLowerCase(),n=n.toLowerCase()),s<n?-1:s>n?1:0}default:throw new Error(`\
Cannot compare type: ${e.type}`)}}function wi(e){if(e.type==="Identifier")return{name:e.value};const t=e;return{name:t.key.
value,defaultValue:t.value}}function t_(e){return e==="kwargs"||e==="varargs"}function r_(e,t){const r=new Set,s=new Set,
n=d=>{t_(d)&&r.add(d)},a=d=>{if(d.type==="Identifier")n(d.value);else if(d.type==="TupleLiteral")for(const h of d.value)
a(h)},o=d=>{n(wi(d).name)},i=d=>{for(const h of d){const _=wi(h);_.defaultValue&&c(_.defaultValue)}},l=d=>{d.type==="Cal\
lExpression"&&c(d.args)},c=d=>{if(Array.isArray(d)){for(const h of d)c(h);return}if(d instanceof Map){for(const[h,_]of d)
c(h),c(_);return}if(d instanceof Ct)switch(d.type){case"For":{const h=d;if(a(h.loopvar),h.iterable.type==="SelectExpress\
ion"){const _=h.iterable;c(_.lhs),c(h.body),c(h.defaultBlock),c(_.test);return}c(h.iterable),c(h.body),c(h.defaultBlock);
return}case"Set":{const h=d;a(h.assignee),c(h.value),c(h.body);return}case"Macro":{const h=d;for(const _ of h.args)o(_);
i(h.args),c(h.body);return}case"CallStatement":{const h=d;c(h.call);for(const _ of h.callerArgs??[])o(_);i(h.callerArgs??
[]),c(h.body);return}case"FilterStatement":{const h=d;c(h.body),l(h.filter);return}case"Identifier":{const h=d.value;t_(
h)&&!r.has(h)&&s.add(h);return}case"MemberExpression":{const h=d;c(h.object),h.computed&&c(h.property);return}case"Filte\
rExpression":{const h=d;c(h.operand),l(h.filter);return}case"TestExpression":c(d.operand);return;case"SelectExpression":{
const h=d;c(h.test),c(h.lhs);return}case"KeywordArgumentExpression":c(d.value);return;default:for(const h of Object.values(
d))c(h)}};for(const d of e)o(d);return c(t),s}var Zk=class{global;constructor(e){this.global=e??new Mr}run(e){return this.
evaluate(e,this.global)}evaluateBinaryExpression(e,t){const r=this.evaluate(e.left,t);switch(e.operator.value){case"and":
return r.__bool__().value?this.evaluate(e.right,t):r;case"or":return r.__bool__().value?r:this.evaluate(e.right,t)}const s=this.
evaluate(e.right,t);switch(e.operator.value){case"==":return new oe(r.value==s.value);case"!=":return new oe(r.value!=s.
value)}if(r instanceof Ne||s instanceof Ne){if(s instanceof Ne&&["in","not in"].includes(e.operator.value))return new oe(
e.operator.value==="not in");throw new Error(`Cannot perform operation ${e.operator.value} on undefined values`)}else{if(r instanceof
Be||s instanceof Be)throw new Error("Cannot perform operation on null values");if(e.operator.value==="~")return new K(r.
value.toString()+s.value.toString());if(e.operator.value==="**"&&wa(r)&&wa(s)){const n=va(r),a=va(s);if(n===0&&a<0)throw new Error(
"0.0 cannot be raised to a negative power");const o=n**a;if(!Number.isFinite(o))throw new Error("Exponentiation result i\
s not a finite real number");return r instanceof Ce||s instanceof Ce||a<0?new Ce(o):new le(o)}else if((r instanceof le||
r instanceof Ce)&&(s instanceof le||s instanceof Ce)){const n=r.value,a=s.value;switch(e.operator.value){case"+":case"-":case"\
*":{const o=e.operator.value==="+"?n+a:e.operator.value==="-"?n-a:n*a;return r instanceof Ce||s instanceof Ce?new Ce(o):
new le(o)}case"/":return new Ce(n/a);case"//":{const o=Math.floor(n/a);return r instanceof Ce||s instanceof Ce?new Ce(o):
new le(o)}case"%":{const o=n%a;return r instanceof Ce||s instanceof Ce?new Ce(o):new le(o)}case"<":return new oe(n<a);case"\
>":return new oe(n>a);case">=":return new oe(n>=a);case"<=":return new oe(n<=a)}}else if(r instanceof pe&&s instanceof pe)
switch(e.operator.value){case"+":return new pe(r.value.concat(s.value))}else if(s instanceof pe){const n=s.value.find(a=>a.
value===r.value)!==void 0;switch(e.operator.value){case"in":return new oe(n);case"not in":return new oe(!n)}}}if(r instanceof
K||s instanceof K)switch(e.operator.value){case"+":return new K(r.value.toString()+s.value.toString())}if(r instanceof K&&
s instanceof K)switch(e.operator.value){case"in":return new oe(s.value.includes(r.value));case"not in":return new oe(!s.
value.includes(r.value))}if(r instanceof K&&s instanceof lt)switch(e.operator.value){case"in":return new oe(s.value.has(
r.value));case"not in":return new oe(!s.value.has(r.value))}throw new SyntaxError(`Unknown operator "${e.operator.value}\
" between ${r.type} and ${s.type}`)}evaluateArguments(e,t){const r=[],s=new Map,n=(a,o)=>{if(s.has(a))throw new Error(`G\
ot multiple values for keyword argument '${a}'`);s.set(a,o)};for(const a of e)if(a.type==="SpreadExpression"){const o=a,
i=this.evaluate(o.argument,t);if(!(i instanceof pe))throw new Error(`Cannot unpack non-iterable type: ${i.type}`);for(const l of i.
value)r.push(l)}else a.type!=="KeywordArgumentExpression"&&a.type!=="KeywordSpreadExpression"&&r.push(this.evaluate(a,t));
for(const a of e)if(a.type==="KeywordArgumentExpression"){const o=a;n(o.key.value,this.evaluate(o.value,t))}else if(a.type===
"KeywordSpreadExpression"){const o=a,i=this.evaluate(o.argument,t);if(!(i instanceof lt))throw new Error(`Argument after\
 ** must be a mapping, not ${i.type}`);for(const[l,c]of i.value)n(l,c)}return[r,s]}applyFilter(e,t,r){if(t.type==="Ident\
ifier"){const s=t;if(s.value==="safe")return e;if(s.value==="tojson")return new K(Cr(e,{}));if(e instanceof pe)switch(s.
value){case"list":return e;case"first":return e.value[0];case"last":return e.value[e.value.length-1];case"length":return new le(
e.value.length);case"reverse":return new pe(e.value.slice().reverse());case"sort":return new pe(e.value.slice().sort((n,a)=>gi(
n,a,!1)));case"join":return new K(e.value.map(n=>n.value).join(""));case"string":return new K(Cr(e,{},0,!1));case"unique":{
const n=new Set,a=[];for(const o of e.value)n.has(o.value)||(n.add(o.value),a.push(o));return new pe(a)}default:throw new Error(
`Unknown ArrayValue filter: ${s.value}`)}else if(e instanceof K)switch(s.value){case"length":case"upper":case"lower":case"\
title":case"capitalize":{const n=e.builtins.get(s.value);if(n instanceof De)return n.value([],r);if(n instanceof le)return n;
throw new Error(`Unknown StringValue filter: ${s.value}`)}case"trim":return new K(e.value.trim());case"indent":return new K(
e.value.split(`
`).map((n,a)=>a===0||n.length===0?n:"    "+n).join(`
`));case"join":case"string":return e;case"int":{const n=parseInt(e.value,10);return new le(isNaN(n)?0:n)}case"float":{const n=parseFloat(
e.value);return new Ce(isNaN(n)?0:n)}default:throw new Error(`Unknown StringValue filter: ${s.value}`)}else if(e instanceof
le||e instanceof Ce)switch(s.value){case"abs":return e instanceof le?new le(Math.abs(e.value)):new Ce(Math.abs(e.value));case"\
int":return new le(Math.floor(e.value));case"float":return new Ce(e.value);case"string":return new K(e.toString());default:
throw new Error(`Unknown NumericValue filter: ${s.value}`)}else if(e instanceof lt)switch(s.value){case"items":return new pe(
Array.from(e.value.entries()).map(([n,a])=>new pe([new K(n),a])));case"length":return new le(e.value.size);default:{const n=e.
builtins.get(s.value);if(n)return n instanceof De?n.value([],r):n;throw new Error(`Unknown ObjectValue filter: ${s.value}`)}}else if(e instanceof
oe)switch(s.value){case"bool":return new oe(e.value);case"int":return new le(e.value?1:0);case"float":return new Ce(e.value?
1:0);case"string":return new K(e.value?"true":"false");default:throw new Error(`Unknown BooleanValue filter: ${s.value}`)}
throw new Error(`Cannot apply filter "${s.value}" to type: ${e.type}`)}else if(t.type==="CallExpression"){const s=t;if(s.
callee.type!=="Identifier")throw new Error(`Unknown filter: ${s.callee.type}`);const n=s.callee.value;if(n==="tojson"){const[
,a]=this.evaluateArguments(s.args,r),o=a.get("indent")??new Be;if(!(o instanceof le||o instanceof Be))throw new Error("I\
f set, indent must be a number");const i=a.get("ensure_ascii")??new oe(!1);if(!(i instanceof oe))throw new Error("If set\
, ensure_ascii must be a boolean");const l=a.get("sort_keys")??new oe(!1);if(!(l instanceof oe))throw new Error("If set,\
 sort_keys must be a boolean");const c=a.get("separators")??new Be;let d=null;if(c instanceof pe||c instanceof Zf){if(c.
value.length!==2)throw new Error("separators must be a tuple of two strings");const[h,_]=c.value;if(!(h instanceof K)||!(_ instanceof
K))throw new Error("separators must be a tuple of two strings");d=[h.value,_.value]}else if(!(c instanceof Be))throw new Error(
"If set, separators must be a tuple of two strings");return new K(Cr(e,{indent:o.value,ensureAscii:i.value,sortKeys:l.value,
separators:d}))}else if(n==="join"){let a;if(e instanceof K)a=Array.from(e.value);else if(e instanceof pe)a=e.value.map(
c=>c.value);else throw new Error(`Cannot apply filter "${n}" to type: ${e.type}`);const[o,i]=this.evaluateArguments(s.args,
r),l=o.at(0)??i.get("separator")??new K("");if(!(l instanceof K))throw new Error("separator must be a string");return new K(
a.join(l.value))}else if(n==="int"||n==="float"){const[a,o]=this.evaluateArguments(s.args,r),i=a.at(0)??o.get("default")??
(n==="int"?new le(0):new Ce(0));if(e instanceof K){const l=n==="int"?parseInt(e.value,10):parseFloat(e.value);return isNaN(
l)?i:n==="int"?new le(l):new Ce(l)}else{if(e instanceof le||e instanceof Ce)return e;if(e instanceof oe)return n==="int"?
new le(e.value?1:0):new Ce(e.value?1:0);throw new Error(`Cannot apply filter "${n}" to type: ${e.type}`)}}else if(n==="d\
efault"){const[a,o]=this.evaluateArguments(s.args,r),i=a[0]??new K(""),l=a[1]??o.get("boolean")??new oe(!1);if(!(l instanceof
oe))throw new Error("`default` filter flag must be a boolean");return e instanceof Ne||l.value&&!e.__bool__().value?i:e}
if(e instanceof pe){switch(n){case"sort":{const[a,o]=this.evaluateArguments(s.args,r),i=a.at(0)??o.get("reverse")??new oe(
!1);if(!(i instanceof oe))throw new Error("reverse must be a boolean");const l=a.at(1)??o.get("case_sensitive")??new oe(
!1);if(!(l instanceof oe))throw new Error("case_sensitive must be a boolean");const c=a.at(2)??o.get("attribute")??new Be;
if(!(c instanceof K||c instanceof le||c instanceof Be))throw new Error("attribute must be a string, integer, or null");const d=h=>{
if(c instanceof Be)return h;const _=c instanceof le?String(c.value):c.value;return e_(h,_)};return new pe(e.value.slice().
sort((h,_)=>{const p=d(h),w=d(_),v=gi(p,w,l.value);return i.value?-v:v}))}case"selectattr":case"rejectattr":{const a=n===
"selectattr";if(e.value.some(h=>!sa(h)))throw new Error(`\`${n}\` can only be applied to array of objects`);if(s.args.some(
h=>h.type!=="StringLiteral"))throw new Error(`arguments of \`${n}\` must be strings`);const[o,i,l]=s.args.map(h=>this.evaluate(
h,r));let c;if(i){const h=r.tests.get(i.value);if(!h)throw new Error(`Unknown test: ${i.value}`);c=h}else c=(...h)=>h[0].
__bool__().value;const d=e.value.filter(h=>{const _=h.value.get(o.value),p=_?c(_,l):!1;return a?p:!p});return new pe(d)}case"\
map":{const[,a]=this.evaluateArguments(s.args,r);if(a.has("attribute")){const o=a.get("attribute");if(!(o instanceof K))
throw new Error("attribute must be a string");const i=a.get("default"),l=e.value.map(c=>{if(!sa(c))throw new Error("item\
s in map must be an object");const d=e_(c,o.value);return d instanceof Ne?i??new Ne:d});return new pe(l)}else throw new Error(
"`map` expressions without `attribute` set are not currently supported.")}}throw new Error(`Unknown ArrayValue filter: ${n}`)}else if(e instanceof
K){switch(n){case"indent":{const[a,o]=this.evaluateArguments(s.args,r),i=a.at(0)??o.get("width")??new le(4);if(!(i instanceof
le))throw new Error("width must be a number");const l=a.at(1)??o.get("first")??new oe(!1),c=a.at(2)??o.get("blank")??new oe(
!1),d=e.value.split(`
`),h=" ".repeat(i.value),_=d.map((p,w)=>!l.value&&w===0||!c.value&&p.length===0?p:h+p);return new K(_.join(`
`))}case"replace":{const a=e.builtins.get("replace");if(!(a instanceof De))throw new Error("replace filter not available");
const[o,i]=this.evaluateArguments(s.args,r);return a.value([...o,new jr(i)],r)}}throw new Error(`Unknown StringValue fil\
ter: ${n}`)}else if(e instanceof lt){const a=e.builtins.get(n);if(a&&a instanceof De){const[o,i]=this.evaluateArguments(
s.args,r);return i.size>0&&o.push(new jr(i)),a.value(o,r)}throw new Error(`Unknown ObjectValue filter: ${n}`)}else throw new Error(
`Cannot apply filter "${n}" to type: ${e.type}`)}throw new Error(`Unknown filter: ${t.type}`)}evaluateFilterExpression(e,t){
const r=this.evaluate(e.operand,t);return this.applyFilter(r,e.filter,t)}evaluateTestExpression(e,t){const r=this.evaluate(
e.operand,t),s=t.tests.get(e.test.value);if(!s)throw new Error(`Unknown test: ${e.test.value}`);const n=s(r);return new oe(
e.negate?!n:n)}evaluateSelectExpression(e,t){return this.evaluate(e.test,t).__bool__().value?this.evaluate(e.lhs,t):new Ne}evaluateUnaryExpression(e,t){
const r=this.evaluate(e.argument,t);switch(e.operator.value){case"not":return new oe(!r.value);case"+":case"-":{const s=e.
operator.value==="-"?-1:1;if(r instanceof le||r instanceof Ce||r instanceof oe){const n=r instanceof oe?r.value?1:0:r.value,
a=s*n;return r instanceof Ce?new Ce(a):new le(a)}throw new SyntaxError(`Unknown operator "${e.operator.value}" for ${r.type}`)}default:
throw new SyntaxError(`Unknown operator: ${e.operator.value}`)}}evaluateTernaryExpression(e,t){return this.evaluate(e.condition,
t).__bool__().value?this.evaluate(e.trueExpr,t):this.evaluate(e.falseExpr,t)}evalProgram(e,t){return this.evaluateBlock(
e.body,t)}evaluateBlock(e,t){let r="";for(const s of e){const n=this.evaluate(s,t);n.type!=="NullValue"&&n.type!=="Undef\
inedValue"&&(r+=n.toString())}return new K(r)}evaluateIdentifier(e,t){return t.lookupVariable(e.value)}evaluateCallExpression(e,t){
const[r,s]=this.evaluateArguments(e.args,t);s.size>0&&r.push(new jr(s));const n=this.evaluate(e.callee,t);if(n.type!=="F\
unctionValue")throw new Error(`Cannot call something that is not a function: got ${n.type}`);return n.value(r,t)}evaluateSliceExpression(e,t,r){
if(!(e instanceof pe||e instanceof K))throw new Error("Slice object must be an array or string");const s=this.evaluate(t.
start,r),n=this.evaluate(t.stop,r),a=this.evaluate(t.step,r);if(!(s instanceof le||s instanceof Ne))throw new Error("Sli\
ce start must be numeric or undefined");if(!(n instanceof le||n instanceof Ne))throw new Error("Slice stop must be numer\
ic or undefined");if(!(a instanceof le||a instanceof Ne))throw new Error("Slice step must be numeric or undefined");return e instanceof
pe?new pe(Xf(e.value,s.value,n.value,a.value)):new K(Xf(Array.from(e.value),s.value,n.value,a.value).join(""))}evaluateMemberExpression(e,t){
const r=this.evaluate(e.object,t);let s;if(e.computed){if(e.property.type==="SliceExpression")return this.evaluateSliceExpression(
r,e.property,t);s=this.evaluate(e.property,t)}else e.property.type==="IntegerLiteral"?s=new le(e.property.value):s=new K(
e.property.value);let n;if(sa(r)){if(!(s instanceof K))throw new Error(`Cannot access property with non-string: got ${s.
type}`);n=r.value.get(s.value)??(r instanceof lt?r.builtins.get(s.value):void 0)}else if(r instanceof pe||r instanceof K)
if(s instanceof le)n=r.value.at(s.value),r instanceof K&&(n=new K(r.value.at(s.value)));else if(s instanceof K)n=r.builtins.
get(s.value);else throw new Error(`Cannot access property with non-string/non-number: got ${s.type}`);else{if(!(s instanceof
K))throw new Error(`Cannot access property with non-string: got ${s.type}`);n=r.builtins.get(s.value)}return n instanceof
Ut?n:new Ne}evaluateSet(e,t){const r=e.value?this.evaluate(e.value,t):this.evaluateBlock(e.body,t);if(e.assignee.type===
"Identifier"){const s=e.assignee.value;t.setVariable(s,r)}else if(e.assignee.type==="TupleLiteral"){const s=e.assignee;if(!(r instanceof
pe))throw new Error(`Cannot unpack non-iterable type in set: ${r.type}`);const n=r.value;if(n.length!==s.value.length)throw new Error(
`Too ${s.value.length>n.length?"few":"many"} items to unpack in set`);for(let a=0;a<s.value.length;++a){const o=s.value[a];
if(o.type!=="Identifier")throw new Error(`Cannot unpack to non-identifier in set: ${o.type}`);t.setVariable(o.value,n[a])}}else if(e.
assignee.type==="MemberExpression"){const s=e.assignee,n=this.evaluate(s.object,t);if(!(n instanceof rl))throw new Error(
"cannot assign attribute on non-namespace object");if(s.property.type!=="Identifier")throw new Error("Cannot assign to m\
ember with non-identifier property");n.value.set(s.property.value,r)}else throw new Error(`Invalid LHS inside assignment\
 expression: ${JSON.stringify(e.assignee)}`);return new Be}evaluateIf(e,t){const r=this.evaluate(e.test,t);return this.evaluateBlock(
r.__bool__().value?e.body:e.alternate,t)}evaluateFor(e,t){const r=new Mr(t);let s,n;if(e.iterable.type==="SelectExpressi\
on"){const c=e.iterable;n=this.evaluate(c.lhs,r),s=c.test}else n=this.evaluate(e.iterable,r);if(!(n instanceof pe||n instanceof
lt))throw new Error(`Expected iterable or object type in for loop: got ${n.type}`);n instanceof lt&&(n=n.keys());const a=[],
o=[];for(let c=0;c<n.value.length;++c){const d=new Mr(r),h=n.value[c];let _;if(e.loopvar.type==="Identifier")_=p=>p.setVariable(
e.loopvar.value,h);else if(e.loopvar.type==="TupleLiteral"){const p=e.loopvar;if(h.type!=="ArrayValue")throw new Error(`\
Cannot unpack non-iterable type: ${h.type}`);const w=h;if(p.value.length!==w.value.length)throw new Error(`Too ${p.value.
length>w.value.length?"few":"many"} items to unpack`);_=v=>{for(let y=0;y<p.value.length;++y){if(p.value[y].type!=="Iden\
tifier")throw new Error(`Cannot unpack non-identifier type: ${p.value[y].type}`);v.setVariable(p.value[y].value,w.value[y])}}}else
throw new Error(`Invalid loop variable(s): ${e.loopvar.type}`);s&&(_(d),!this.evaluate(s,d).__bool__().value)||(a.push(h),
o.push(_))}let i="",l=!0;for(let c=0;c<a.length;++c){const d=new Map([["index",new le(c+1)],["index0",new le(c)],["revin\
dex",new le(a.length-c)],["revindex0",new le(a.length-c-1)],["first",new oe(c===0)],["last",new oe(c===a.length-1)],["le\
ngth",new le(a.length)],["previtem",c>0?a[c-1]:new Ne],["nextitem",c<a.length-1?a[c+1]:new Ne]]);r.setVariable("loop",new lt(
d)),o[c](r);try{const h=this.evaluateBlock(e.body,r);i+=h.value}catch(h){if(h instanceof Kf)continue;if(h instanceof Yf)
break;throw h}l=!1}if(l){const c=this.evaluateBlock(e.defaultBlock,r);i+=c.value}return new K(i)}bindMacroArguments(e,t,r,s,n){
const a=s.slice();let o=new Map;a.at(-1)instanceof jr&&(o=new Map(a.pop().value));const i=[];for(let l=0;l<t.length;++l){
const{name:c,defaultValue:d}=wi(t[l]);let h=a[l];h===void 0&&o.has(c)&&(h=o.get(c),o.delete(c)),h===void 0&&d!==void 0&&
i.push([c,d]),n.setVariable(c,h??new Ne)}if(r.has("kwargs"))n.setVariable("kwargs",new lt(o));else if(o.size>0)throw new Error(
`macro ${e} takes no keyword argument '${o.keys().next().value}'`);if(r.has("varargs"))n.setVariable("varargs",new pe(a.
slice(t.length)));else if(a.length>t.length)throw new Error(`macro ${e} takes not more than ${t.length} argument(s)`);for(const[
l,c]of i)n.setVariable(l,this.evaluate(c,n))}evaluateMacro(e,t){const r=r_(e.args,e.body);return t.setVariable(e.name.value,
new De((s,n)=>{const a=new Mr(n);return this.bindMacroArguments(`'${e.name.value}'`,e.args,r,s,a),this.evaluateBlock(e.body,
a)})),new Be}evaluateCallStatement(e,t){const r=e.callerArgs??[],s=r_(r,e.body),n=new De(c=>{const d=new Mr(t);return this.
bindMacroArguments("None",r,s,c,d),this.evaluateBlock(e.body,d)}),[a,o]=this.evaluateArguments(e.call.args,t);a.push(new jr(
o));const i=this.evaluate(e.call.callee,t);if(i.type!=="FunctionValue")throw new Error(`Cannot call something that is no\
t a function: got ${i.type}`);const l=new Mr(t);return l.setVariable("caller",n),i.value(a,l)}evaluateFilterStatement(e,t){
const r=this.evaluateBlock(e.body,t);return this.applyFilter(r,e.filter,t)}evaluate(e,t){if(!e)return new Ne;switch(e.type){case"\
Program":return this.evalProgram(e,t);case"Set":return this.evaluateSet(e,t);case"If":return this.evaluateIf(e,t);case"F\
or":return this.evaluateFor(e,t);case"Macro":return this.evaluateMacro(e,t);case"CallStatement":return this.evaluateCallStatement(
e,t);case"Break":throw new Yf;case"Continue":throw new Kf;case"IntegerLiteral":return new le(e.value);case"FloatLiteral":
return new Ce(e.value);case"StringLiteral":return new K(e.value);case"ArrayLiteral":return new pe(e.value.map(r=>this.evaluate(
r,t)));case"TupleLiteral":return new Zf(e.value.map(r=>this.evaluate(r,t)));case"ObjectLiteral":{const r=new Map;for(const[
s,n]of e.value){const a=this.evaluate(s,t);if(!(a instanceof K))throw new Error(`Object keys must be strings: got ${a.type}`);
r.set(a.value,this.evaluate(n,t))}return new lt(r)}case"Identifier":return this.evaluateIdentifier(e,t);case"CallExpress\
ion":return this.evaluateCallExpression(e,t);case"MemberExpression":return this.evaluateMemberExpression(e,t);case"Unary\
Expression":return this.evaluateUnaryExpression(e,t);case"BinaryExpression":return this.evaluateBinaryExpression(e,t);case"\
FilterExpression":return this.evaluateFilterExpression(e,t);case"FilterStatement":return this.evaluateFilterStatement(e,
t);case"TestExpression":return this.evaluateTestExpression(e,t);case"SelectExpression":return this.evaluateSelectExpression(
e,t);case"Ternary":return this.evaluateTernaryExpression(e,t);case"Comment":return new Be;default:throw new SyntaxError(
`Unknown node type: ${e.type}`)}}};function na(e){switch(typeof e){case"number":return Number.isInteger(e)?new le(e):new Ce(
e);case"string":return new K(e);case"boolean":return new oe(e);case"undefined":return new Ne;case"object":return e===null?
new Be:Array.isArray(e)?new pe(e.map(na)):new lt(new Map(Object.entries(e).map(([t,r])=>[t,na(r)])));case"function":return new De(
(t,r)=>{const s=e(...t.map(n=>n.value))??null;return na(s)});default:throw new Error(`Cannot convert to runtime value: ${e}`)}}
var Ke=`
`,eT="{%- ",tT=" -%}",Ge=Object.freeze({CONDITIONAL:0,LOGICAL_OR:1,LOGICAL_AND:2,LOGICAL_NOT:3,COMPARISON:4,ADDITIVE:5,MULTIPLICATIVE:6,
EXPONENTIATION:7,TEST:8,FILTER:9,UNARY_SIGN:10,ATOM:11});function em(e){switch(e.operator.type){case"ExponentiationBinar\
yOperator":return Ge.EXPONENTIATION;case"MultiplicativeBinaryOperator":return Ge.MULTIPLICATIVE;case"AdditiveBinaryOpera\
tor":return Ge.ADDITIVE;case"ComparisonBinaryOperator":return Ge.COMPARISON;case"Identifier":return e.operator.value==="\
and"?Ge.LOGICAL_AND:e.operator.value==="in"||e.operator.value==="not in"?Ge.COMPARISON:Ge.LOGICAL_OR}return Ge.LOGICAL_OR}
function tm(e){switch(e.type){case"SelectExpression":case"Ternary":return Ge.CONDITIONAL;case"BinaryExpression":return em(
e);case"UnaryExpression":return e.operator.value==="not"?Ge.LOGICAL_NOT:Ge.UNARY_SIGN;case"TestExpression":return Ge.TEST;case"\
FilterExpression":return Ge.FILTER;default:return Ge.ATOM}}function It(e,t){const r=Re(e);return tm(e)<t?`(${r})`:r}function rT(e,t="\
	"){const r=typeof t=="number"?" ".repeat(t):t;return Bt(e.body,0,r).replace(/\n$/,"")}function rt(...e){return eT+e.join(
" ")+tT}function Bt(e,t,r){return e.map(s=>sT(s,t,r)).join(Ke)}function ya(e){return e.map(t=>Re(t)).join(", ")}function sT(e,t,r){
const s=r.repeat(t);switch(e.type){case"Program":return Bt(e.body,t,r);case"If":return nT(e,t,r);case"For":return aT(e,t,
r);case"Set":return oT(e,t,r);case"Macro":return iT(e,t,r);case"Break":return s+rt("break");case"Continue":return s+rt("\
continue");case"CallStatement":return lT(e,t,r);case"FilterStatement":return cT(e,t,r);case"Comment":return s+"{# "+e.value+
" #}";default:return s+"{{- "+Re(e)+" -}}"}}function nT(e,t,r){const s=r.repeat(t),n=[];let a=e;for(;a&&(n.push({test:a.
test,body:a.body}),a.alternate.length===1&&a.alternate[0].type==="If");)a=a.alternate[0];let o=s+rt("if",Re(n[0].test))+
Ke+Bt(n[0].body,t+1,r);for(let i=1;i<n.length;++i)o+=Ke+s+rt("elif",Re(n[i].test))+Ke+Bt(n[i].body,t+1,r);return a&&a.alternate.
length>0&&(o+=Ke+s+rt("else")+Ke+Bt(a.alternate,t+1,r)),o+=Ke+s+rt("endif"),o}function aT(e,t,r){const s=r.repeat(t);let n="";
if(e.iterable.type==="SelectExpression"){const o=e.iterable;n=`${Re(o.lhs)} if ${Re(o.test)}`}else n=Re(e.iterable);let a=s+
rt("for",Re(e.loopvar),"in",n)+Ke+Bt(e.body,t+1,r);return e.defaultBlock.length>0&&(a+=Ke+s+rt("else")+Ke+Bt(e.defaultBlock,
t+1,r)),a+=Ke+s+rt("endfor"),a}function oT(e,t,r){const s=r.repeat(t),n=Re(e.assignee),a=e.value?Re(e.value):"",o=s+rt("\
set",`${n}${e.value?" = "+a:""}`);return e.body.length===0?o:o+Ke+Bt(e.body,t+1,r)+Ke+s+rt("endset")}function iT(e,t,r){
const s=r.repeat(t),n=ya(e.args);return s+rt("macro",`${e.name.value}(${n})`)+Ke+Bt(e.body,t+1,r)+Ke+s+rt("endmacro")}function lT(e,t,r){
const s=r.repeat(t),n=e.callerArgs&&e.callerArgs.length>0?`(${ya(e.callerArgs)})`:"",a=Re(e.call);let o=s+rt(`call${n}`,
a)+Ke;return o+=Bt(e.body,t+1,r)+Ke,o+=s+rt("endcall"),o}function cT(e,t,r){const s=r.repeat(t),n=e.filter.type==="Ident\
ifier"?e.filter.value:Re(e.filter);let a=s+rt("filter",n)+Ke;return a+=Bt(e.body,t+1,r)+Ke,a+=s+rt("endfilter"),a}function Re(e){
switch(e.type){case"SpreadExpression":return`*${Re(e.argument)}`;case"KeywordSpreadExpression":return`**${Re(e.argument)}`;case"\
Identifier":return e.value;case"IntegerLiteral":return`${e.value}`;case"FloatLiteral":{const t=e.value;return Object.is(
t,-0)?"-0.0":t%1===0?t.toFixed(1):t.toString()}case"StringLiteral":return JSON.stringify(e.value);case"BinaryExpression":{
const t=e,r=em(t),s=It(t.left,r),n=It(t.right,r+1);return`${s} ${t.operator.value} ${n}`}case"UnaryExpression":{const t=e,
r=t.argument.type==="UnaryExpression"?tm(t):Ge.ATOM;return t.operator.value+(t.operator.value==="not"?" ":"")+It(t.argument,
r)}case"CallExpression":{const t=e,r=ya(t.args);return`${Re(t.callee)}(${r})`}case"MemberExpression":{const t=e,r=It(t.object,
Ge.ATOM);let s=Re(t.property);return!t.computed&&t.property.type!=="Identifier"&&t.property.type!=="IntegerLiteral"&&(s=
`(${s})`),t.computed?`${r}[${s}]`:`${r}.${s}`}case"FilterExpression":{const t=e,r=It(t.operand,Ge.FILTER);return t.filter.
type==="CallExpression"?`${r} | ${Re(t.filter)}`:`${r} | ${t.filter.value}`}case"SelectExpression":{const t=e;return`${It(
t.lhs,Ge.LOGICAL_OR)} if ${It(t.test,Ge.LOGICAL_OR)}`}case"TestExpression":{const t=e;return`${It(t.operand,Ge.TEST)} is${t.
negate?" not":""} ${t.test.value}`}case"ArrayLiteral":case"TupleLiteral":{const t=ya(e.value),r=e.type==="ArrayLiteral"?
"[]":"()";return`${r[0]}${t}${r[1]}`}case"ObjectLiteral":return`{${Array.from(e.value.entries()).map(([r,s])=>`${Re(r)}:\
 ${Re(s)}`).join(", ")}}`;case"SliceExpression":{const t=e,r=t.start?Re(t.start):"",s=t.stop?Re(t.stop):"",n=t.step?`:${Re(
t.step)}`:"";return`${r}:${s}${n}`}case"KeywordArgumentExpression":{const t=e;return`${t.key.value}=${Re(t.value)}`}case"\
Ternary":{const t=e;return`${It(t.trueExpr,Ge.LOGICAL_OR)} if ${It(t.condition,Ge.LOGICAL_OR)} else ${It(t.falseExpr,Ge.
CONDITIONAL)}`}default:throw new Error(`Unknown expression type: ${e.type}`)}}var uT=class{parsed;constructor(e){const t=vk(
e,{lstrip_blocks:!0,trim_blocks:!0});this.parsed=Vk(t)}render(e){const t=new Mr;if(Jk(t),e)for(const[n,a]of Object.entries(
e))t.set(n,a);return new Zk(t).run(this.parsed).value}format(e){return rT(this.parsed,e?.indent||"	")}},dT={txt:"text/pl\
ain",html:"text/html",css:"text/css",js:"text/javascript",json:"application/json",png:"image/png",jpg:"image/jpeg",jpeg:"\
image/jpeg",gif:"image/gif"},ba=class rm{constructor(t){if(this.filePath=t,this.headers=new Headers,this.exists=bt.existsSync(
t),this.exists){this.status=200,this.statusText="OK";let r=bt.statSync(t);this.headers.set("content-length",r.size.toString()),
this.updateContentType();const s=bt.createReadStream(t);this.body=new ReadableStream({start(n){s.on("data",a=>n.enqueue(
a)),s.on("end",()=>n.close()),s.on("error",a=>n.error(a))},cancel(){s.destroy()}})}else this.status=404,this.statusText=
"Not Found",this.body=null}updateContentType(){const t=this.filePath.toString().split(".").pop().toLowerCase();this.headers.
set("content-type",dT[t]??"application/octet-stream")}clone(){let t=new rm(this.filePath);return t.exists=this.exists,t.
status=this.status,t.statusText=this.statusText,t.headers=new Headers(this.headers),t}async arrayBuffer(){return(await bt.
promises.readFile(this.filePath)).buffer}async blob(){const t=await bt.promises.readFile(this.filePath);return new Blob(
[t],{type:this.headers.get("content-type")})}async text(){return await bt.promises.readFile(this.filePath,"utf8")}async json(){
return JSON.parse(await this.text())}},Pa=class{constructor(e){this._mt=new Uint32Array(624),this._idx=625,this._gauss_next=
null,this._random_fn=this.random.bind(this),this.seed(e)}seed(e){if(e==null)if(fe.IS_CRYPTO_AVAILABLE){const o=new Uint32Array(
1);crypto.getRandomValues(o),e=o[0]}else e=Date.now()>>>0;Number.isSafeInteger(e)&&(e=Math.abs(e));const t=this._mt,r=(o,i)=>Math.
imul(o,i)>>>0,s=[];for(let o=e||0;o>0;o=Math.floor(o/4294967296))s.push(o&4294967295);s.length||s.push(0),t[0]=19650218;
for(let o=1;o<624;++o)t[o]=r(1812433253,t[o-1]^t[o-1]>>>30)+o>>>0;let n=1,a=0;for(let o=Math.max(624,s.length);o>0;--o,++n,
++a)n>=624&&(t[0]=t[623],n=1),a>=s.length&&(a=0),t[n]=(t[n]^r(t[n-1]^t[n-1]>>>30,1664525))+s[a]+a>>>0;for(let o=623;o>0;--o,
++n)n>=624&&(t[0]=t[623],n=1),t[n]=(t[n]^r(t[n-1]^t[n-1]>>>30,1566083941))-n>>>0;t[0]=2147483648,this._idx=624,this._gauss_next=
null}_int32(){const e=this._mt;if(this._idx>=624){for(let r=0;r<624;++r){const s=e[r]&2147483648|e[(r+1)%624]&2147483647;
e[r]=(e[(r+397)%624]^s>>>1^(s&1?2567483615:0))>>>0}this._idx=0}let t=e[this._idx++];return t^=t>>>11,t^=t<<7&2636928640,
t^=t<<15&4022730752,t^=t>>>18,t>>>0}random(){return((this._int32()>>>5)*67108864+(this._int32()>>>6))/9007199254740992}gauss(e=0,t=1){
let r=this._gauss_next;if(this._gauss_next=null,r===null){const s=this.random()*2*Math.PI,n=Math.sqrt(-2*Math.log(1-this.
random()));r=Math.cos(s)*n,this._gauss_next=Math.sin(s)*n}return e+r*t}shuffle(e){for(let t=e.length-1;t>0;--t){const r=32-
Math.clz32(t+1);let s=this._int32()>>>32-r;for(;s>t;)s=this._int32()>>>32-r;const n=e[t];e[t]=e[s],e[s]=n}}choices(e,t){
return e[sm(this._random_fn,t)]}};function sm(e,t){let r=0;for(let n=0;n<t.length;++n)r+=t[n];let s=e()*r;for(let n=0;n<
t.length;++n)if(s-=t[n],s<0)return n;return t.length-1}var Yt=new Pa,Fa=Object.freeze({Random:Pa,seed:Yt.seed.bind(Yt),random:Yt.
random.bind(Yt),gauss:Yt.gauss.bind(Yt),shuffle:Yt.shuffle.bind(Yt),choices:Yt.choices.bind(Yt)}),hT=e=>sm(Fa.random,e),
fT=new Pa,nm=class{constructor(e){this.path=e}async match(e){let t=Jt.join(this.path,e),r=new ba(t);if(r.exists)return r}async put(e,t,r=void 0){
const s=Jt.join(this.path,e),n=fe.IS_PROCESS_AVAILABLE?process.pid:Date.now(),a=fT._int32().toString(36),o=s+`.tmp.${n}.${a}`;
try{const i=t.headers.get("Content-Length"),l=parseInt(i??"0");let c=0;await bt.promises.mkdir(Jt.dirname(s),{recursive:!0});
const d=bt.createWriteStream(o),h=t.body.getReader();for(;;){const{done:_,value:p}=await h.read();if(_)break;await new Promise(
(v,y)=>{d.write(p,b=>{if(b){y(b);return}v()})}),c+=p.length;const w=l?c/l*100:0;r?.({progress:w,loaded:c,total:l})}await new Promise(
(_,p)=>{d.close(w=>w?p(w):_())}),await bt.promises.rename(o,s)}catch(i){try{await bt.promises.unlink(o)}catch{}throw i}}async delete(e){
let t=Jt.join(this.path,e);try{return await bt.promises.unlink(t),!0}catch{return!1}}},_T={400:"Bad request error occurr\
ed while trying to load file",401:"Unauthorized access to file",403:"Forbidden access to file",404:"Could not locate fil\
e",408:"Request timeout error occurred while trying to load file",500:"Internal server error error occurred while trying\
 to load file",502:"Bad gateway error occurred while trying to load file",503:"Service unavailable error occurred while \
trying to load file",504:"Gateway timeout error occurred while trying to load file"},s_=100,pT=/^(\b[\w\-.]+\b\/)?\b[\w\-.]{1,96}\b$/;
function Qn(...e){return e=e.map((t,r)=>(r&&(t=t.replace(new RegExp("^/"),"")),r!==e.length-1&&(t=t.replace(new RegExp("\
/$"),"")),t)),e.join("/")}function Kr(e,t=null,r=null){let s;try{s=new URL(e)}catch{return!1}return!(t&&!t.includes(s.protocol)||
r&&!r.includes(s.hostname))}function mT(e){return!(!pT.test(e)||e.includes("..")||e.includes("--")||e.endsWith(".git")||
e.endsWith(".ipynb"))}function sl(e,t={},...r){return JSON.stringify([e,t.revision??"main",t.cache_dir??null,t.local_files_only??
!1,...r])}var vi=class extends Error{constructor(e,{status:t=null}={}){super(e),this.name="ModelFileNotFoundError",this.
status=t}},gT=new Set([401,403,404]);function am(e,t,r){if(!r)return null;const n=`${_T[e]??`Error (${e}) occurred while\
 trying to load file`}: "${t}".`;throw gT.has(e)?new vi(n,{status:e}):Error(n)}async function wT(e,t,r){const s=e.headers.
get("Content-Length");let n=s?parseInt(s,10):r??0;s===null&&!r&&de.warn("Unable to determine content-length from respons\
e headers. Will expand buffer when needed.");let a=new Uint8Array(n),o=0;const i=e.body.getReader();async function l(){const{
done:c,value:d}=await i.read();if(c)return;const h=o+d.length;if(h>n){n=h;const p=new Uint8Array(n);p.set(a),a=p}a.set(d,
o),o=h;const _=o/n*100;return t({progress:_,loaded:o,total:n}),l()}return await l(),a}function n_(e){return Kr(e,["blob:"])}
function yi(e,{allowUnresolved:t=!1}={}){let r;if(typeof location<"u"&&location.href)r=location.href;else if(typeof import.meta<
"u"&&import.meta.url)r=import.meta.url;else return e;try{return new URL(e,r).href}catch(s){if(!t)throw s;return e}}var om="\
SHA-256",vT="experimental_transformers-hash-cache",a_=e=>({algorithm:om,value:e}),o_=class{#t=null;_getHashCache=()=>(this.#t??=
caches.open(vT),this.#t);static isAvailable=()=>typeof navigator<"u"&&"crossOriginStorage"in navigator;match=async e=>{const t=await this.
_getFileHash(e);if(t)try{const s=await(await navigator.crossOriginStorage.requestFileHandle(a_(t))).getFile();return new Response(
s,{headers:{"Content-Length":String(s.size)}})}catch{return}};put=async(e,t)=>{const r=await this._getFileHash(e);if(r){
const s=await t.blob();await this._storeBlobInCOS(s,r)}else this._processAndStore(e,t.body)};_storeBlobInCOS=async(e,t)=>{
const s=await(await navigator.crossOriginStorage.requestFileHandle(a_(t),{create:!0,origins:"*"})).createWritable();await s.
write(e),await s.close()};_processAndStore=async(e,t)=>{try{const r=[];for await(const a of t)r.push(a);const s=new Blob(
r),n=await this._getBlobHash(s);await this._storeBlobInCOS(s,n);try{await(await this._getHashCache()).put(e,new Response(
n))}catch{}}catch{}};delete=async e=>{try{return await(await this._getHashCache()).delete(e)}catch{return!1}};_getFileHash=async e=>{
try{const t=await this._getHashCache(),r=await t.match(e);if(r)return r.text();const s=await this._getLfsFileHash(e);return s?
(await t.put(e,new Response(s)),s):null}catch{return null}};_getLfsFileHash=async e=>{if(!e.includes("/resolve/"))return null;
const t=e.replace("/resolve/","/raw/");try{const s=(await fetch(t).then(n=>n.text())).match(/^oid sha256:([0-9a-f]+)$/m);
return s?s[1]:null}catch{return null}};_getBlobHash=async e=>{const t=await e.arrayBuffer(),r=await crypto.subtle.digest(
om,t);return Array.from(new Uint8Array(r)).map(n=>n.toString(16).padStart(2,"0")).join("")}};async function Es(e=null){let t=null;
if(we.useCustomCache){if(!we.customCache)throw Error("`env.useCustomCache=true`, but `env.customCache` is not defined.");
if(!we.customCache.match||!we.customCache.put)throw new Error("`env.customCache` must be an object which implements the \
`match` and `put` functions of the Web Cache API. For more information, see https://developer.mozilla.org/en-US/docs/Web\
/API/Cache");t=we.customCache}if(!t&&we.experimental_useCrossOriginStorage&&o_.isAvailable()&&(t=new o_),!t&&we.useBrowserCache){
if(typeof caches>"u")throw Error("Browser cache is not available in this environment.");try{t=await caches.open(we.cacheKey)}catch(r){
de.warn("An error occurred while opening the browser cache:",r)}}if(!t&&we.useFSCache){if(!fe.IS_FS_AVAILABLE)throw Error(
"File System Cache is not available in this environment.");t=new nm(e??we.cacheDir)}return t}async function yT(e,...t){for(let r of t)
try{let s=await e.match(r);if(s)return s}catch{continue}}var bT=class{#t;#e;constructor(e){this.#t=e,this.#e=new Map}get(e){
if(!this.#e.has(e))return;const t=this.#e.get(e);return this.#e.delete(e),this.#e.set(e,t),t}put(e,t){this.#e.has(e)&&this.#e.
delete(e),this.#e.set(e,t),this.#e.size>this.#t&&this.#e.delete(this.#e.keys().next().value)}delete(e){return this.#e.delete(
e)}clear(){this.#e.clear()}},MT=100,ti=new bT(MT);function im(e,t){const r=ti.get(e);if(r!==void 0)return r;const s=t().
then(n=>n,n=>(ti.delete(e),Promise.reject(n)));return ti.put(e,s),s}async function xT(e){if(!Kr(e,["http:","https:"]))return null;
const t=lm(e);return t.set("Range","bytes=0-0"),we.fetch(e,{method:"GET",headers:t,cache:"no-store"})}function Jr(e,t,r={}){
const s=sl(e,r,t);return im(s,()=>kT(e,t,r))}async function kT(e,t,r){const s=await Es(r?.cache_dir),{localPath:n,remoteURL:a,
proposedCacheKey:o,validModelId:i}=pn(e,t,r,s),l=await mn(s,n,o);if(l!==void 0&&typeof l!="string"){const c=l.headers.get(
"content-length"),d=l.headers.get("content-type");return{exists:!0,size:c?parseInt(c,10):void 0,contentType:d||void 0,fromCache:!0}}
if(we.allowLocalModels&&!Kr(n,["http:","https:"]))try{const d=await an(n);if(typeof d!="string"&&d.status!==404){const h=d.
headers.get("content-length"),_=d.headers.get("content-type");return{exists:!0,size:h?parseInt(h,10):void 0,contentType:_||
void 0,fromCache:!1}}}catch{}if(we.allowRemoteModels&&!r.local_files_only&&i){const c=await xT(a);if(c&&c.status>=200&&c.
status<300){let d;const h=c.headers.get("content-type");if(c.status===206){const _=c.headers.get("content-range");if(_){
const p=_.match(/bytes \d+-\d+\/(\d+)/);p&&(d=parseInt(p[1],10))}}else if(c.status===200)try{await c.body?.cancel()}catch{}
if(d===void 0){const _=c.headers.get("content-length");d=_?parseInt(_,10):void 0}return{exists:!0,size:d,contentType:h||
void 0,fromCache:!1}}c&&c.status!==404&&c.status!==416&&am(c.status,a,!0)}return{exists:!1,fromCache:!1}}async function an(e){
return we.useFS&&!Kr(e,["http:","https:","blob:"])?new ba(e instanceof URL?e.protocol==="file:"?e.pathname:e.toString():
e):we.fetch(e,{headers:lm(e)})}function lm(e){const t=typeof process<"u"&&process?.release?.name==="node",r=new Headers;
if(t){const s=!!Jo?.TESTING_REMOTELY,n=we.version;if(r.set("User-Agent",`transformers.js/${n}; is_ci/${s};`),Kr(e,["http\
:","https:"],["huggingface.co","hf.co"])){const o=Jo?.HF_TOKEN??Jo?.HF_ACCESS_TOKEN;o&&r.set("Authorization",`Bearer ${o}`)}}
return r}function pn(e,t,r={},s=null){const n=r.revision??"main",a=Qn(e,t),o=mT(e),i=o?Qn(we.localModelPath,a):a,l=Qn(we.
remoteHost,we.remotePathTemplate.replaceAll("{model}",e).replaceAll("{revision}",encodeURIComponent(n)),t),c=s instanceof
nm?n==="main"?a:Qn(e,n,t):l;return{requestURL:a,localPath:i,remoteURL:l,proposedCacheKey:c,validModelId:o}}async function mn(e,t,r){
if(e)return await yT(e,t,r)}async function TT(e,t,r,s,n,a,o={}){if(await r.match(s)===void 0&&!(typeof Cache<"u"&&r instanceof
Cache&&!Kr(yi(s,{allowUnresolved:!0}),["http:","https:"])))if(a){if(typeof n!="string"){const i=new Headers(n.headers);i.
set("content-length",a.byteLength.toString()),await r.put(s,new Response(a,{headers:i})).catch(l=>{de.warn(`Unable to ad\
d response to browser cache: ${l}.`)})}}else{const i=o.progress_callback?l=>kr(o.progress_callback,{status:"progress",name:e,
file:t,...l}):void 0;await r.put(s,n,i)}}async function ET(e,t,r=!0,s={},n=!1,a=null){const{requestURL:o,localPath:i,remoteURL:l,
proposedCacheKey:c,validModelId:d}=pn(e,t,s,a);let h,_=!1,p;p=await mn(a,i,c);const w=p!==void 0;if(w)h=c;else{if(we.allowLocalModels)
if(Kr(o,["http:","https:"])){if(s.local_files_only)throw new Error(`\`local_files_only=true\`, but attempted to load a rem\
ote file from: ${o}.`);if(!we.allowRemoteModels)throw new Error(`\`env.allowRemoteModels=false\`, but attempted to load a \
remote file from: ${o}.`)}else try{p=await an(i),h=i}catch(k){de.warn(`Unable to load from local path "${i}": "${k}"`)}if(p===
void 0||typeof p!="string"&&p.status===404){if(s.local_files_only||!we.allowRemoteModels){if(r)throw new vi(`\`local_file\
s_only=true\` or \`env.allowRemoteModels=false\` and file was not found locally at "${i}".`);return null}if(!d)throw new vi(
`Local file missing at "${i}" and download aborted due to invalid model ID "${e}".`);if(p=await an(l),p.status!==200)return am(
p.status,l,r);h=c}_=a&&typeof Response<"u"&&p instanceof Response&&p.status===200}kr(s.progress_callback,{status:"downlo\
ad",name:e,file:t});let v;if(!(fe.IS_NODE_ENV&&n)){let b;if(typeof p!="string")if(!s.progress_callback)b=new Uint8Array(
await p.arrayBuffer());else if(w&&typeof navigator<"u"&&/firefox/i.test(navigator.userAgent))b=new Uint8Array(await p.arrayBuffer()),
kr(s.progress_callback,{status:"progress",name:e,file:t,progress:100,loaded:b.length,total:b.length});else{let k;const A=p.
headers.get("content-length");if(A)k=parseInt(A,10);else try{const E=await Jr(e,t,s);E.size&&(k=E.size)}catch{}b=await wT(
p,E=>{kr(s.progress_callback,{status:"progress",name:e,file:t,...E})},k)}v=b}if(_&&h&&typeof p!="string"&&await TT(e,t,a,
h,p,v,s),fe.IS_NODE_ENV&&n&&s.progress_callback&&typeof p!="string"){const b=parseInt(p.headers.get("content-length"),10)||
0;kr(s.progress_callback,{status:"progress",name:e,file:t,progress:100,loaded:b,total:b})}if(kr(s.progress_callback,{status:"\
done",name:e,file:t}),v){if(!fe.IS_NODE_ENV&&n)throw new Error("Cannot return path in a browser environment.");return v}
if(p instanceof ba)return p.filePath;const y=await a?.match(h);if(y instanceof ba)return y.filePath;if(y instanceof Response)
return new Uint8Array(await y.arrayBuffer());if(typeof y=="string")return y;throw new Error("Unable to get model file pa\
th or buffer.")}var ri=new Map;async function Ma(e,t,r=!0,s={},n=!1){if(!we.allowLocalModels){if(s.local_files_only)throw Error(
"Invalid configuration detected: local models are disabled (`env.allowLocalModels=false`) but you have requested to only\
 use local models (`local_files_only=true`).");if(!we.allowRemoteModels)throw Error("Invalid configuration detected: bot\
h local and remote models are disabled. Fix by setting `env.allowLocalModels` or `env.allowRemoteModels` to `true`.")}const a=sl(
e,s,t,r,n),{progress_callback:o}=s,i=o instanceof fa?o.loads:ri;let l=i.get(a);return l||(kr(o,{status:"initiate",name:e,
file:t}),l=Es(s.cache_dir).then(c=>ET(e,t,r,s,n,c)),i===ri&&(l=l.finally(()=>ri.delete(a))),i.set(a,l)),await l}async function nl(e,t,r=!0,s={}){
const n=await Ma(e,t,r,s,!1);return n===null?null:new TextDecoder("utf-8").decode(n)}async function tr(e,t,r=!0,s={}){const n=await nl(
e,t,r,s);return n===null?{}:JSON.parse(n)}function AT(e,[t,r,s],[n,a],o="bilinear",i=!1){const l=a/s,c=n/r,d=new e.constructor(
n*a*t),h=r*s,_=n*a;for(let p=0;p<n;++p)for(let w=0;w<a;++w){const v=p*a+w,y=(w+.5)/l-.5,b=(p+.5)/c-.5;let k=Math.floor(y),
A=Math.floor(b);const E=Math.min(k+1,s-1),C=Math.min(A+1,r-1);k=Math.max(k,0),A=Math.max(A,0);const N=y-k,M=b-A,$=(1-N)*
(1-M),R=N*(1-M),j=(1-N)*M,Y=N*M,Q=A*s,z=C*s,I=Q+k,U=Q+E,X=z+k,ce=z+E;for(let Z=0;Z<t;++Z){const se=Z*h;d[Z*_+v]=$*e[se+I]+
R*e[se+U]+j*e[se+X]+Y*e[se+ce]}}return d}function CT(e,t,r){const s=new Array(r.length),n=new Array(r.length);for(let i=r.
length-1,l=1;i>=0;--i)n[i]=l,s[i]=t[r[i]],l*=s[i];const a=r.map((i,l)=>n[r.indexOf(l)]),o=new e.constructor(e.length);for(let i=0;i<
e.length;++i){let l=0;for(let c=t.length-1,d=i;c>=0;--c)l+=d%t[c]*a[c],d=Math.floor(d/t[c]);o[l]=e[i]}return[o,s]}function st(e){
const t=We(e)[0],r=e.map(a=>Math.exp(a-t)),s=r.reduce((a,o)=>a+o,0);return r.map(a=>a/s)}function ST(e){const t=We(e)[0];
let r=0;for(let a=0;a<e.length;++a)r+=Math.exp(e[a]-t);const s=Math.log(r);return e.map(a=>a-t-s)}function PT(e,t){let r=0;
for(let s=0;s<e.length;++s)r+=e[s]*t[s];return r}function oz(e,t){const r=PT(e,t),s=i_(e),n=i_(t);return r/(s*n)}function i_(e){
return Math.sqrt(e.reduce((t,r)=>t+r*r,0))}function bi(e){if(e.length===0)throw Error("Array must not be empty");let t=e[0],
r=0;for(let s=1;s<e.length;++s)e[s]<t&&(t=e[s],r=s);return[t,r]}function We(e){if(e.length===0)throw Error("Array must n\
ot be empty");let t=e[0],r=0;for(let s=1;s<e.length;++s)e[s]>t&&(t=e[s],r=s);return[t,r]}function cm(e){return e>0&&(e&e-
1)===0}var um=class{constructor(e){if(this.size=e|0,this.size<=1||!cm(this.size))throw new Error("FFT size must be a pow\
er of two larger than 1");this._csize=e<<1,this.table=new Float64Array(this.size*2);for(let r=0;r<this.table.length;r+=2){
const s=Math.PI*r/this.size;this.table[r]=Math.cos(s),this.table[r+1]=-Math.sin(s)}let t=0;for(let r=1;this.size>r;r<<=1)
++t;this._width=t%2===0?t-1:t,this._bitrev=new Int32Array(1<<this._width);for(let r=0;r<this._bitrev.length;++r){this._bitrev[r]=
0;for(let s=0;s<this._width;s+=2){const n=this._width-s-2;this._bitrev[r]|=(r>>>s&3)<<n}}}createComplexArray(){return new Float64Array(
this._csize)}fromComplexArray(e,t){const r=t||new Array(e.length>>>1);for(let s=0;s<e.length;s+=2)r[s>>>1]=e[s];return r}toComplexArray(e,t){
const r=t||this.createComplexArray();for(let s=0;s<r.length;s+=2)r[s]=e[s>>>1],r[s+1]=0;return r}transform(e,t){if(e===t)
throw new Error("Input and output buffers must be different");this._transform4(e,t,1)}realTransform(e,t){if(e===t)throw new Error(
"Input and output buffers must be different");this._realTransform4(e,t,1)}inverseTransform(e,t){if(e===t)throw new Error(
"Input and output buffers must be different");this._transform4(e,t,-1);for(let r=0;r<e.length;++r)e[r]/=this.size}_transform4(e,t,r){
const s=this._csize;let a=1<<this._width,o=s/a<<1,i,l;const c=this._bitrev;if(o===4)for(i=0,l=0;i<s;i+=o,++l){const h=c[l];
this._singleTransform2(t,e,i,h,a)}else for(i=0,l=0;i<s;i+=o,++l){const h=c[l];this._singleTransform4(t,e,i,h,a,r)}const d=this.
table;for(a>>=2;a>=2;a>>=2){o=s/a<<1;const h=o>>>2;for(i=0;i<s;i+=o){const _=i+h-1;for(let p=i,w=0;p<_;p+=2,w+=a){const v=p,
y=v+h,b=y+h,k=b+h,A=e[v],E=e[v+1],C=e[y],N=e[y+1],M=e[b],$=e[b+1],R=e[k],j=e[k+1],Y=d[w],Q=r*d[w+1],z=C*Y-N*Q,I=C*Q+N*Y,
U=d[2*w],X=r*d[2*w+1],ce=M*U-$*X,Z=M*X+$*U,se=d[3*w],L=r*d[3*w+1],O=R*se-j*L,V=R*L+j*se,ne=A+ce,ae=E+Z,qe=A-ce,Ee=E-Z,Ae=z+
O,$e=I+V,Fe=r*(z-O),ye=r*(I-V);e[v]=ne+Ae,e[v+1]=ae+$e,e[y]=qe+ye,e[y+1]=Ee-Fe,e[b]=ne-Ae,e[b+1]=ae-$e,e[k]=qe-ye,e[k+1]=
Ee+Fe}}}}_singleTransform2(e,t,r,s,n){const a=e[s],o=e[s+1],i=e[s+n],l=e[s+n+1];t[r]=a+i,t[r+1]=o+l,t[r+2]=a-i,t[r+3]=o-
l}_singleTransform4(e,t,r,s,n,a){const o=n*2,i=n*3,l=e[s],c=e[s+1],d=e[s+n],h=e[s+n+1],_=e[s+o],p=e[s+o+1],w=e[s+i],v=e[s+
i+1],y=l+_,b=c+p,k=l-_,A=c-p,E=d+w,C=h+v,N=a*(d-w),M=a*(h-v);t[r]=y+E,t[r+1]=b+C,t[r+2]=k+M,t[r+3]=A-N,t[r+4]=y-E,t[r+5]=
b-C,t[r+6]=k-M,t[r+7]=A+N}_realTransform4(e,t,r){const s=this._csize;let a=1<<this._width,o=s/a<<1,i,l;const c=this._bitrev;
if(o===4)for(i=0,l=0;i<s;i+=o,++l){const _=c[l];this._singleRealTransform2(t,e,i,_>>>1,a>>>1)}else for(i=0,l=0;i<s;i+=o,
++l){const _=c[l];this._singleRealTransform4(t,e,i,_>>>1,a>>>1,r)}const d=this.table;for(a>>=2;a>=2;a>>=2){o=s/a<<1;const _=o>>>
1,p=_>>>1,w=p>>>1;for(i=0;i<s;i+=o)for(let v=0,y=0;v<=w;v+=2,y+=a){const b=i+v,k=b+p,A=k+p,E=A+p,C=e[b],N=e[b+1],M=e[k],
$=e[k+1],R=e[A],j=e[A+1],Y=e[E],Q=e[E+1],z=C,I=N,U=d[y],X=r*d[y+1],ce=M*U-$*X,Z=M*X+$*U,se=d[2*y],L=r*d[2*y+1],O=R*se-j*
L,V=R*L+j*se,ne=d[3*y],ae=r*d[3*y+1],qe=Y*ne-Q*ae,Ee=Y*ae+Q*ne,Ae=z+O,$e=I+V,Fe=z-O,ye=I-V,it=ce+qe,be=Z+Ee,Me=r*(ce-qe),
es=r*(Z-Ee);if(e[b]=Ae+it,e[b+1]=$e+be,e[k]=Fe+es,e[k+1]=ye-Me,v===0){e[A]=Ae-it,e[A+1]=$e-be;continue}if(v===w)continue;
const Vs=i+p-v,ts=i+_-v;e[Vs]=Fe-r*es,e[Vs+1]=-ye-r*Me,e[ts]=Ae-r*it,e[ts+1]=-$e+r*be}}const h=s>>>1;for(let _=2;_<h;_+=
2)e[s-_]=e[_],e[s-_+1]=-e[_+1]}_singleRealTransform2(e,t,r,s,n){const a=e[s],o=e[s+n];t[r]=a+o,t[r+1]=0,t[r+2]=a-o,t[r+3]=
0}_singleRealTransform4(e,t,r,s,n,a){const o=n*2,i=n*3,l=e[s],c=e[s+n],d=e[s+o],h=e[s+i],_=l+d,p=l-d,w=c+h,v=a*(c-h);t[r]=
_+w,t[r+1]=0,t[r+2]=p,t[r+3]=-v,t[r+4]=_-w,t[r+5]=0,t[r+6]=p,t[r+7]=v}},FT=class{constructor(e){const t=2*(e-1),r=2*(2*e-
1),s=2**Math.ceil(Math.log2(r));this.bufferSize=s,this._a=t;const n=new Float64Array(r),a=new Float64Array(s);this._chirpBuffer=
new Float64Array(s),this._buffer1=new Float64Array(s),this._buffer2=new Float64Array(s),this._outBuffer1=new Float64Array(
s),this._outBuffer2=new Float64Array(s);const o=-2*Math.PI/e,i=Math.cos(o),l=Math.sin(o);for(let c=0;c<r>>1;++c){const d=(c+
1-e)**2/2,h=Math.sqrt(i**2+l**2)**d,_=d*Math.atan2(l,i),p=2*c;n[p]=h*Math.cos(_),n[p+1]=h*Math.sin(_),a[p]=n[p],a[p+1]=-n[p+
1]}this._slicedChirpBuffer=n.subarray(t,r),this._f=new um(s>>1),this._f.transform(this._chirpBuffer,a)}_transform(e,t,r){
const s=this._buffer1,n=this._buffer2,a=this._outBuffer1,o=this._outBuffer2,i=this._chirpBuffer,l=this._slicedChirpBuffer,
c=this._a;if(r)for(let d=0;d<l.length;d+=2){const h=d+1,_=d>>1,p=t[_];s[d]=p*l[d],s[h]=p*l[h]}else for(let d=0;d<l.length;d+=
2){const h=d+1;s[d]=t[d]*l[d]-t[h]*l[h],s[h]=t[d]*l[h]+t[h]*l[d]}this._f.transform(a,s);for(let d=0;d<i.length;d+=2){const h=d+
1;n[d]=a[d]*i[d]-a[h]*i[h],n[h]=a[d]*i[h]+a[h]*i[d]}this._f.inverseTransform(o,n);for(let d=0;d<o.length;d+=2){const h=o[d+
c],_=o[d+c+1],p=l[d],w=l[d+1];e[d]=h*p-_*w,e[d+1]=h*w+_*p}}transform(e,t){this._transform(e,t,!1)}realTransform(e,t){this.
_transform(e,t,!0)}},IT=class{constructor(e){this.fft_length=e,this.isPowerOfTwo=cm(e),this.isPowerOfTwo?(this.fft=new um(
e),this.outputBufferSize=2*e):(this.fft=new FT(e),this.outputBufferSize=this.fft.bufferSize)}realTransform(e,t){this.fft.
realTransform(e,t)}transform(e,t){this.fft.transform(e,t)}};function LT(e,t){if(t%2===0||t<=0)throw new Error("Window si\
ze must be a positive odd number");const r=new e.constructor(e.length),s=new e.constructor(t),n=Math.floor(t/2);for(let a=0;a<
e.length;++a){let o=0;for(let i=-n;i<=n;++i){let l=a+i;l<0?l=Math.abs(l):l>=e.length&&(l=2*(e.length-1)-l),s[o++]=e[l]}s.
sort(),r[a]=s[n]}return r}function en(e,t){const r=Math.pow(10,t);return Math.round(e*r)/r}function OT(e){const t=Math.round(
e);return Math.abs(e)%1===.5?t%2===0?t:t-1:t}function NT(e){const t=e.length,r=e[0].length,s=[t+1,r+1],n=Array.from({length:s[0]},
()=>Array(s[1]).fill(1/0));n[0][0]=0;const a=Array.from({length:s[0]},()=>Array(s[1]).fill(-1));for(let d=1;d<s[1];++d)for(let h=1;h<
s[0];++h){const _=n[h-1][d-1],p=n[h-1][d],w=n[h][d-1];let v,y;_<p&&_<w?(v=_,y=0):p<_&&p<w?(v=p,y=1):(v=w,y=2),n[h][d]=e[h-
1][d-1]+v,a[h][d]=y}for(let d=0;d<s[1];++d)a[0][d]=2;for(let d=0;d<s[0];++d)a[d][0]=1;let o=t,i=r,l=[],c=[];for(;o>0||i>
0;)switch(l.push(o-1),c.push(i-1),a[o][i]){case 0:--o,--i;break;case 1:--o;break;case 2:--i;break;default:throw new Error(
`Internal error in dynamic time warping. Unexpected trace[${o}, ${i}]. Please file a bug report.`)}return l.reverse(),c.
reverse(),[l,c]}var DT=(function(){let e=null;return function(t){if(!e){e=new Float32Array(65536);const a=new ArrayBuffer(
4),o=new Uint32Array(a),i=new Float32Array(a);for(let l=0;l<e.length;++l){let c=0;const d=(l&32768)<<16,h=(l&31744)>>10;
let _=l&1023;if(h===31)c=d|2139095040|_<<13;else if(h===0)if(_===0)c=d;else{let p=113;for(;(_&1024)===0;)_<<=1,--p;_&=-1025,
c=d|p<<23|_<<13}else c=d|h+112<<23|_<<13;o[0]=c,e[l]=i[0]}}const r=t.length,s=e,n=new Float32Array(r);for(let a=0;a<r;++a)
n[a]=s[t[a]];return n}})(),zT={};async function dm(e){const t=e.split("/").pop();let r;try{if(r=await Es(),r){const n=await r.
match(e);if(n)return n}}catch(n){de.warn(`Failed to load ${t} from cache:`,n)}const s=await we.fetch(e);if(!s.ok)throw new Error(
`Failed to fetch ${t}: ${s.status} ${s.statusText}`);if(r)try{await r.put(e,s.clone())}catch(n){de.warn(`Failed to cache\
 ${t}:`,n)}return s}async function BT(e){const t=await dm(e);if(!t||typeof t=="string")return null;try{return await t.arrayBuffer()}catch(r){
return de.warn("Failed to read WASM binary:",r),null}}async function RT(e){if(fe.IS_SERVICE_WORKER_ENV||fe.IS_CHROME_AVAILABLE)
return e;const t=await dm(e);if(!t||typeof t=="string")return null;try{let r=await t.text();r=r.replaceAll("globalThis.p\
rocess?.versions?.node","false");const s=new Blob([r],{type:"text/javascript"});return URL.createObjectURL(s)}catch(r){return de.
warn("Failed to read WASM factory:",r),null}}var $T=Object.freeze({auto:null,gpu:null,cpu:"cpu",wasm:"wasm",webgpu:"webg\
pu",cuda:"cuda",dml:"dml",coreml:"coreml",webnn:{name:"webnn",deviceType:"cpu"},"webnn-npu":{name:"webnn",deviceType:"np\
u"},"webnn-gpu":{name:"webnn",deviceType:"gpu"},"webnn-cpu":{name:"webnn",deviceType:"cpu"}});function hm(e){return e<=Nt.
DEBUG?0:e<=Nt.INFO?2:e<=Nt.WARNING||e<=Nt.ERROR?3:4}var GT={0:"verbose",1:"info",2:"warning",3:"error",4:"fatal"},vt=[],
Mi,ys,l_=Symbol.for("onnxruntime");if(l_ in globalThis)ys=globalThis[l_];else if(fe.IS_NODE_ENV){switch(ys=zT,process.platform){case"\
win32":vt.push("dml");break;case"linux":process.arch==="x64"&&vt.push("cuda");break;case"darwin":vt.push("coreml");break}
vt.push("webgpu"),vt.push("cpu"),Mi=["cpu"]}else ys=uM,fe.IS_WEBNN_AVAILABLE&&vt.push("webnn-npu","webnn-gpu","webnn-cpu",
"webnn"),fe.IS_WEBGPU_AVAILABLE&&vt.push("webgpu"),vt.push("wasm"),Mi=["wasm"];function VT(){return[...vt]}var UT=ys.InferenceSession;
function jT(e=null){if(!e)return Mi;switch(e){case"auto":return vt;case"gpu":return vt.filter(t=>["webgpu","cuda","dml",
"webnn-gpu"].includes(t))}if(vt.includes(e))return[$T[e]??e];throw new Error(`Unsupported device: "${e}". Should be one \
of: ${vt.join(", ")}.`)}var c_=Promise.resolve(),us=null;async function qT(){if(us)return us;if(!(we.useWasmCache&&typeof Ye?.
wasm?.wasmPaths=="object"&&Ye?.wasm?.wasmPaths?.wasm&&Ye?.wasm?.wasmPaths?.mjs)){if(fe.IS_DENO_WEB_RUNTIME)throw new Error(
"env.useWasmCache=false is not supported in Deno's web runtime. Remove the useWasmCache override.");return us=Promise.resolve(),
us}return us=(async()=>{const t=Ye.wasm.wasmPaths;let r=!1;await Promise.all([t.wasm&&!n_(t.wasm)?(async()=>{try{const s=await BT(
yi(t.wasm));s&&(Ye.wasm.wasmBinary=s,r=!0)}catch(s){de.warn("Failed to pre-load WASM binary:",s)}})():Promise.resolve(),
t.mjs&&!n_(t.mjs)?(async()=>{try{const s=await RT(yi(t.mjs));s&&(Ye.wasm.wasmPaths.mjs=s)}catch(s){de.warn("Failed to pr\
e-load WASM factory:",s)}})():Promise.resolve()]),r||(Ye.wasm.wasmPaths.mjs=t.mjs)})(),us}async function fm(e,t,r){await qT();
const s=hm(we.logLevel??Nt.WARNING),n=()=>UT.create(e,{logSeverityLevel:s,...t}),a=await(fe.IS_WEB_ENV?c_=c_.then(n):n());
return a.config=r,a}var u_=Promise.resolve();async function _m(e,t){const r=()=>e.run(t);return fe.IS_WEB_ENV?u_=u_.then(
r):r()}function pm(e){return e instanceof ys.Tensor}var Ye=ys?.env;function al(){return Ye?.wasm?.proxy}if(Ye){let e=function(t){
const r=hm(t);Ye.logLevel=GT[r]};if(Ye.wasm){if(!(typeof ServiceWorkerGlobalScope<"u"&&self instanceof ServiceWorkerGlobalScope)&&
Ye.versions?.web&&!Ye.wasm.wasmPaths){const t=`https://cdn.jsdelivr.net/npm/onnxruntime-web@${Ye.versions.web}/dist/`;let r="\
.asyncify";fe.IS_SAFARI_BELOW_26&&!fe.IS_WEBGPU_AVAILABLE&&(r=""),Ye.wasm.wasmPaths={mjs:`${t}ort-wasm-simd-threaded${r}\
.mjs`,wasm:`${t}ort-wasm-simd-threaded${r}.wasm`}}Ye.wasm.proxy=!1}Ye.webgpu&&(Ye.webgpu.powerPreference="high-performan\
ce"),e(we.logLevel??Nt.WARNING),we.backends.onnx={...Ye,setLogLevel:e,getSupportedDevices:VT}}var br=async(e,t,r)=>{const s=await fm(
new Uint8Array(e),t);return(async n=>{const a=al(),o=Object.fromEntries(Object.entries(n).map(([l,c])=>[l,(a?c.clone():c).
ort_tensor])),i=await _m(s,o);return Array.isArray(r)?r.map(l=>new G(i[l])):new G(i[r])})},Wr=class{static session_options={};static get nearest_interpolate_4d(){
return this._nearest_interpolate_4d||(this._nearest_interpolate_4d=br([8,10,18,0,58,129,1,10,41,10,1,120,10,0,10,0,10,1,
115,18,1,121,34,6,82,101,115,105,122,101,42,18,10,4,109,111,100,101,34,7,110,101,97,114,101,115,116,160,1,3,18,1,114,90,
31,10,1,120,18,26,10,24,8,1,18,20,10,3,18,1,98,10,3,18,1,99,10,3,18,1,104,10,3,18,1,119,90,15,10,1,115,18,10,10,8,8,7,18,
4,10,2,8,4,98,31,10,1,121,18,26,10,24,8,1,18,20,10,3,18,1,98,10,3,18,1,99,10,3,18,1,104,10,3,18,1,119,66,2,16,21],this.session_options,
"y")),this._nearest_interpolate_4d}static get bilinear_interpolate_4d(){return this._bilinear_interpolate_4d||(this._bilinear_interpolate_4d=
br([8,9,18,0,58,128,1,10,40,10,1,120,10,0,10,0,10,1,115,18,1,121,34,6,82,101,115,105,122,101,42,17,10,4,109,111,100,101,
34,6,108,105,110,101,97,114,160,1,3,18,1,114,90,31,10,1,120,18,26,10,24,8,1,18,20,10,3,18,1,98,10,3,18,1,99,10,3,18,1,104,
10,3,18,1,119,90,15,10,1,115,18,10,10,8,8,7,18,4,10,2,8,4,98,31,10,1,121,18,26,10,24,8,1,18,20,10,3,18,1,98,10,3,18,1,99,
10,3,18,1,104,10,3,18,1,119,66,2,16,20],this.session_options,"y")),this._bilinear_interpolate_4d}static get bicubic_interpolate_4d(){
return this._bicubic_interpolate_4d||(this._bicubic_interpolate_4d=br([8,9,18,0,58,127,10,39,10,1,120,10,0,10,0,10,1,115,
18,1,121,34,6,82,101,115,105,122,101,42,16,10,4,109,111,100,101,34,5,99,117,98,105,99,160,1,3,18,1,114,90,31,10,1,120,18,
26,10,24,8,1,18,20,10,3,18,1,98,10,3,18,1,99,10,3,18,1,104,10,3,18,1,119,90,15,10,1,115,18,10,10,8,8,7,18,4,10,2,8,4,98,
31,10,1,121,18,26,10,24,8,1,18,20,10,3,18,1,98,10,3,18,1,99,10,3,18,1,104,10,3,18,1,119,66,2,16,20],this.session_options,
"y")),this._bicubic_interpolate_4d}static get matmul(){return this._matmul||(this._matmul=br([8,9,18,0,58,55,10,17,10,1,
97,10,1,98,18,1,99,34,6,77,97,116,77,117,108,18,1,114,90,9,10,1,97,18,4,10,2,8,1,90,9,10,1,98,18,4,10,2,8,1,98,9,10,1,99,
18,4,10,2,8,1,66,2,16,20],this.session_options,"c")),this._matmul}static get stft(){return this._stft||(this._stft=br([8,
7,18,0,58,148,1,10,38,10,1,115,10,1,106,10,1,119,10,1,108,18,1,111,34,4,83,84,70,84,42,15,10,8,111,110,101,115,105,100,101,
100,24,1,160,1,2,18,1,115,90,26,10,1,115,18,21,10,19,8,1,18,15,10,3,18,1,98,10,3,18,1,115,10,3,18,1,99,90,11,10,1,106,18,
6,10,4,8,7,18,0,90,16,10,1,119,18,11,10,9,8,1,18,5,10,3,18,1,119,90,11,10,1,108,18,6,10,4,8,7,18,0,98,31,10,1,111,18,26,
10,24,8,1,18,20,10,3,18,1,98,10,3,18,1,102,10,3,18,1,100,10,3,18,1,99,66,2,16,17],this.session_options,"o")),this._stft}static get rfft(){
return this._rfft||(this._rfft=br([8,9,58,93,10,33,10,1,120,10,0,10,1,97,18,1,121,34,3,68,70,84,42,15,10,8,111,110,101,115,
105,100,101,100,24,1,160,1,2,18,1,100,90,19,10,1,120,18,14,10,12,8,1,18,8,10,0,10,0,10,2,8,1,90,11,10,1,97,18,6,10,4,8,7,
18,0,98,19,10,1,121,18,14,10,12,8,1,18,8,10,0,10,0,10,2,8,2,66,2,16,20],this.session_options,"y")),this._rfft}static get top_k(){
return this._top_k||(this._top_k=br([8,10,18,0,58,73,10,18,10,1,120,10,1,107,18,1,118,18,1,105,34,4,84,111,112,75,18,1,116,
90,9,10,1,120,18,4,10,2,8,1,90,15,10,1,107,18,10,10,8,8,7,18,4,10,2,8,1,98,9,10,1,118,18,4,10,2,8,1,98,9,10,1,105,18,4,10,
2,8,7,66,2,16,21],this.session_options,["v","i"])),this._top_k}static get slice(){return this._slice||(this._slice=br([8,
7,18,0,58,96,10,25,10,1,120,10,1,115,10,1,101,10,1,97,10,1,116,18,1,121,34,5,83,108,105,99,101,18,1,114,90,9,10,1,120,18,
4,10,2,8,1,90,9,10,1,115,18,4,10,2,8,7,90,9,10,1,101,18,4,10,2,8,7,90,9,10,1,97,18,4,10,2,8,7,90,9,10,1,116,18,4,10,2,8,
7,98,9,10,1,121,18,4,10,2,8,1,66,2,16,13],this.session_options,"y")),this._slice}},WT=Object.freeze({auto:"auto",gpu:"gp\
u",cpu:"cpu",wasm:"wasm",webgpu:"webgpu",cuda:"cuda",dml:"dml",coreml:"coreml",webnn:"webnn","webnn-npu":"webnn-npu","we\
bnn-gpu":"webnn-gpu","webnn-cpu":"webnn-cpu"}),si=fe.IS_NODE_ENV?"cpu":"wasm";function mm(e,t,{warn:r}={}){return e?typeof e==
"string"?e:e.hasOwnProperty(t)?e[t]:(r&&r(`device not specified for "${t}". Using the default device (${si}).`),si):si}var HT=(function(){
let e;return async function(){if(e===void 0)if(!fe.IS_WEBGPU_AVAILABLE)e=!1;else try{e=(await navigator.gpu.requestAdapter()).
features.has("shader-f16")}catch{e=!1}return e}})(),Qe=Object.freeze({auto:"auto",fp32:"fp32",fp16:"fp16",q8:"q8",int8:"\
int8",uint8:"uint8",q4:"q4",bnb4:"bnb4",q4f16:"q4f16",q2:"q2",q2f16:"q2f16",q1:"q1",q1f16:"q1f16"}),d_=Qe.fp32,h_=Object.
freeze({[WT.wasm]:Qe.q8}),on=Object.freeze({[Qe.fp32]:"",[Qe.fp16]:"_fp16",[Qe.int8]:"_int8",[Qe.uint8]:"_uint8",[Qe.q8]:"\
_quantized",[Qe.q4]:"_q4",[Qe.q2]:"_q2",[Qe.q1]:"_q1",[Qe.q4f16]:"_q4f16",[Qe.q2f16]:"_q2f16",[Qe.q1f16]:"_q1f16",[Qe.bnb4]:"\
_bnb4"});function gm(e,t,r,{configDtype:s=null,warn:n}={}){let a,o=!1;e&&typeof e!="string"?e.hasOwnProperty(t)?a=e[t]:(a=
null,o=!0):a=e;let i;if(a===Qe.auto){if(s){const l=typeof s=="string"?s:s?.[t];if(l&&l!==Qe.auto&&Qe.hasOwnProperty(l))return l}
i=h_[r]??d_}else a&&Qe.hasOwnProperty(a)?i=a:i=h_[r]??d_;return o&&n&&n(`dtype not specified for "${t}". Using the defau\
lt dtype (${i}) for this device (${r}).`),i}var ln=Object.freeze({float32:Float32Array,float16:typeof Float16Array<"u"?Float16Array:
Uint16Array,float64:Float64Array,string:Array,int8:Int8Array,uint8:Uint8Array,int16:Int16Array,uint16:Uint16Array,int32:Int32Array,
uint32:Uint32Array,int64:BigInt64Array,uint64:BigUint64Array,bool:Uint8Array,uint4:Uint8Array,int4:Int8Array}),G=class Ue{get dims(){
return this.ort_tensor.dims}set dims(t){this.ort_tensor.dims=t}get type(){return this.ort_tensor.type}get data(){return this.
ort_tensor.data}get size(){return this.ort_tensor.size}get location(){return this.ort_tensor.location}ort_tensor;constructor(...t){
return pm(t[0])?this.ort_tensor=t[0]:this.ort_tensor=new bM(t[0],t[1],t[2]),new Proxy(this,{get:(r,s)=>{if(typeof s=="st\
ring"){let n=Number(s);if(Number.isInteger(n))return r._getitem(n)}return r[s]},set:(r,s,n)=>r[s]=n})}dispose(){this.ort_tensor.
dispose()}*[Symbol.iterator](){const[t,...r]=this.dims;if(r.length>0){const s=r.reduce((n,a)=>n*a);for(let n=0;n<t;++n)yield this.
_subarray(n,s,r)}else yield*this.data}_getitem(t){const[r,...s]=this.dims;if(t=Ot(t,r),s.length>0){const n=s.reduce((a,o)=>a*
o);return this._subarray(t,n,s)}else return new Ue(this.type,[this.data[t]],s)}_subarray(t,r,s){const n=t*r,a=(t+1)*r,o="\
subarray"in this.data?this.data.subarray(n,a):this.data.slice(n,a);return new Ue(this.type,o,s)}item(){const t=this.data;
if(t.length!==1)throw new Error(`a Tensor with ${t.length} elements cannot be converted to Scalar`);return t[0]}tolist(){
return QT(this.data,this.dims)}sigmoid(){return this.clone().sigmoid_()}sigmoid_(){const t=this.data;for(let r=0;r<t.length;++r)
t[r]=1/(1+Math.exp(-t[r]));return this}map(t){return this.clone().map_(t)}map_(t){const r=this.data;for(let s=0;s<r.length;++s)
r[s]=t(r[s],s,r);return this}mul(t){return this.clone().mul_(t)}mul_(t){const r=this.data;for(let s=0;s<r.length;++s)r[s]*=
t;return this}div(t){return this.clone().div_(t)}div_(t){const r=this.data;for(let s=0;s<r.length;++s)r[s]/=t;return this}add(t){
return this.clone().add_(t)}add_(t){const r=this.data;for(let s=0;s<r.length;++s)r[s]+=t;return this}sub(t){return this.
clone().sub_(t)}sub_(t){const r=this.data;for(let s=0;s<r.length;++s)r[s]-=t;return this}remainder(t){return this.clone().
remainder_(t)}remainder_(t){const r=this.data,n=r instanceof BigInt64Array||r instanceof BigUint64Array?BigInt(t):Number(
t);if((n===0||n===0n)&&(this.type.includes("int")||this.type==="bool"))throw new RangeError("Division by zero");if(n<0&&
(this.type.startsWith("uint")||this.type==="bool"))throw new RangeError("Negative divisors are not supported for unsigne\
d or boolean tensors");for(let a=0;a<r.length;++a){const o=r[a]%n,i=o<0&&n>0||o>0&&n<0;r[a]=i?o+n:o}return this}clone(){
return new Ue(this.type,this.data.slice(),this.dims.slice())}slice(...t){const r=[],s=[];for(let d=0;d<this.dims.length;++d){
let h=t[d];if(h==null)s.push([0,this.dims[d]]),r.push(this.dims[d]);else if(typeof h=="number")h=Ot(h,this.dims[d],d),s.
push([h,h+1]);else if(Array.isArray(h)&&h.length===2){let[_,p]=h;if(_=_===null?0:Ot(_,this.dims[d],d,!1),p=p===null?this.
dims[d]:Ot(p,this.dims[d],d,!1),_>p)throw new Error(`Invalid slice: ${h}`);const w=[Math.max(_,0),Math.min(p,this.dims[d])];
s.push(w),r.push(w[1]-w[0])}else throw new Error(`Invalid slice: ${h}`)}const n=s.map(([d,h])=>h-d),a=n.reduce((d,h)=>d*
h),o=this.data,i=new o.constructor(a),l=this.stride();let c=!0;for(let d=1;d<n.length;++d)if(s[d][0]!==0||s[d][1]!==this.
dims[d]){c=!1;break}if(c){const d=s[0][0]*l[0],h=s[0][1]*l[0];if(ArrayBuffer.isView(o))i.set(o.subarray(d,h));else if(Array.
isArray(o)){const _=o.slice(d,h);for(let p=0;p<_.length;++p)i[p]=_[p]}else throw new Error("Unsupported data type for sl\
icing")}else for(let d=0;d<a;++d){let h=0;for(let _=n.length-1,p=d;_>=0;--_){const w=n[_];h+=(p%w+s[_][0])*l[_],p=Math.floor(
p/w)}i[d]=o[h]}return new Ue(this.type,i,r)}permute(...t){return XT(this,t)}transpose(...t){return this.permute(...t)}sum(t=null,r=!1){
return this.norm(1,t,r)}norm(t="fro",r=null,s=!1){if(t==="fro")t=2;else if(typeof t=="string")throw Error(`Unsupported n\
orm: ${t}`);const n=this.data,a=n instanceof BigInt64Array||n instanceof BigUint64Array;if(a&&t!==1)throw Error(`Expecte\
d a floating point tensor as input. Got ${this.type}`);let o,i;if(a?(o=(h,_)=>h+_,i=0n):(o=(h,_)=>h+_**t,i=0),r===null){
let h=n.reduce(o,i);return t!==1&&(h=h**(1/t)),new Ue(this.type,[h],[])}const[l,c,d]=rn(o,this,r,s);if(t!==1)for(let h=0;h<
c.length;++h)c[h]=c[h]**(1/t);return new Ue(l,c,d)}normalize_(t=2,r=1){r=Ot(r,this.dims.length);const s=this.norm(t,r,!0),
n=this.data,a=s.data;for(let o=0;o<n.length;++o){let i=0;for(let l=this.dims.length-1,c=o,d=1;l>=0;--l){const h=this.dims[l];
if(l!==r){const _=c%h;i+=_*d,d*=this.dims[l]}c=Math.floor(c/h)}n[o]/=a[i]}return this}normalize(t=2,r=1){return this.clone().
normalize_(t,r)}stride(){return ni(this.dims)}squeeze(t=null){return new Ue(this.type,this.data,f_(this.dims,t))}squeeze_(t=null){
return this.dims=f_(this.dims,t),this}unsqueeze(t){return new Ue(this.type,this.data,__(this.dims,t))}unsqueeze_(t){return this.
dims=__(this.dims,t),this}flatten_(t=0,r=-1){r=(r+this.dims.length)%this.dims.length;let s=this.dims.slice(0,t),n=this.dims.
slice(t,r+1),a=this.dims.slice(r+1);return this.dims=[...s,n.reduce((o,i)=>o*i,1),...a],this}flatten(t=0,r=-1){return this.
clone().flatten_(t,r)}view(...t){let r=-1;for(let n=0;n<t.length;++n)if(t[n]===-1){if(r!==-1)throw new Error("Only one d\
imension can be inferred");r=n}const s=this.data;if(r!==-1){const n=t.reduce((a,o,i)=>i!==r?a*o:a,1);t[r]=s.length/n}return new Ue(
this.type,s,t)}neg_(){const t=this.data;for(let r=0;r<t.length;++r)t[r]=-t[r];return this}neg(){return this.clone().neg_()}gt(t){
const r=new Uint8Array(this.data.length),s=this.data;for(let n=0;n<s.length;++n)r[n]=s[n]>t?1:0;return new Ue("bool",r,this.
dims)}lt(t){const r=new Uint8Array(this.data.length),s=this.data;for(let n=0;n<s.length;++n)r[n]=s[n]<t?1:0;return new Ue(
"bool",r,this.dims)}clamp_(t,r){const s=this.data;for(let n=0;n<s.length;++n)s[n]=Math.min(Math.max(s[n],t),r);return this}clamp(t,r){
return this.clone().clamp_(t,r)}round_(){const t=this.data;for(let r=0;r<t.length;++r)t[r]=Math.round(t[r]);return this}round(){
return this.clone().round_()}mean(t=null,r=!1){return ol(this,t,r)}min(t=null,r=!1){if(t===null){const o=bi(this.data)[0];
return new Ue(this.type,[o],[])}const[s,n,a]=rn((o,i)=>Math.min(o,i),this,t,r,1/0);return new Ue(s,n,a)}max(t=null,r=!1){
if(t===null){const o=We(this.data)[0];return new Ue(this.type,[o],[])}const[s,n,a]=rn((o,i)=>Math.max(o,i),this,t,r,-1/0);
return new Ue(s,n,a)}argmin(t=null,r=!1){if(t!==null)throw new Error("`dim !== null` not yet implemented.");const s=bi(this.
data)[1];return new Ue("int64",[BigInt(s)],[])}argmax(t=null,r=!1){if(t!==null)throw new Error("`dim !== null` not yet i\
mplemented.");const s=We(this.data)[1];return new Ue("int64",[BigInt(s)],[])}repeat(...t){if(t.length<this.dims.length)throw new Error(
`Number of dimensions of repeat dims (${t.length}) cannot be smaller than number of dimensions of tensor (${this.dims.length}\
)`);if(t.every(d=>d===1)){if(t.length===this.dims.length)return this.clone();const d=t.length-this.dims.length,h=Array(d).
fill(1).concat(this.dims);return new Ue(this.type,this.data.slice(),h)}const r=t.length-this.dims.length,s=Array(r).fill(
1).concat(this.dims),n=s.map((d,h)=>d*t[h]),a=n.reduce((d,h)=>d*h,1),o=this.data,i=new o.constructor(a),l=ni(s),c=ni(n);
for(let d=0;d<a;++d){let h=d,_=0;for(let p=0;p<n.length;++p){const w=Math.floor(h/c[p]);h=h%c[p];const v=w%s[p];_+=v*l[p]}
i[d]=o[_]}return new Ue(this.type,i,n)}tile(...t){if(t.length<this.dims.length){const r=this.dims.length-t.length;t=Array(
r).fill(1).concat(t)}return this.repeat(...t)}to(t){if(this.type===t)return this;if(!ln.hasOwnProperty(t))throw new Error(
`Unsupported type: ${t}`);let r;const s=["int64","uint64"].includes(this.type),n=["int64","uint64"].includes(t);if(s&&!n)
r=Number;else if(!s&&n)["float16","float32","float64"].includes(this.type)?r=a=>BigInt(Math.floor(a)):r=BigInt;else if(this.
type==="float16"&&t=="float32"&&this.data instanceof Uint16Array)return new Ue(t,DT(this.data),this.dims);return new Ue(
t,ln[t].from(this.data,r),this.dims)}};function QT(e,t){const r=e.length,s=t.length===0?1:t.reduce((a,o)=>a*o);if(r!==s)
throw Error(`cannot reshape array of size ${r} into shape (${t})`);let n=e;for(let a=t.length-1;a>=0;a--)n=n.reduce((o,i)=>{
let l=o[o.length-1];return l.length<t[a]?l.push(i):o.push([i]),o},[[]]);return n[0]}function XT(e,t){const[r,s]=CT(e.data,
e.dims,t);return new G(e.type,r,s)}function wm(e,[t,r],s="bilinear",n=!1){const a=e.dims.at(-3)??1,o=e.dims.at(-2),i=e.dims.
at(-1),l=AT(e.data,[a,o,i],[t,r],s,n);return new G(e.type,l,[a,t,r])}async function Rt(e,{size:t=null,mode:r="bilinear"}={}){
if(e.dims.length!==4)throw new Error("`interpolate_4d` currently only supports 4D input.");if(!t)throw new Error("`inter\
polate_4d` requires a `size` argument.");let s;if(t.length===2)s=[...e.dims.slice(0,2),...t];else if(t.length===3)s=[e.dims[0],
...t];else if(t.length===4)s=t;else throw new Error("`size` must be of length 2, 3, or 4.");let n;if(r==="nearest")n=await Wr.
nearest_interpolate_4d;else if(r==="bilinear")n=await Wr.bilinear_interpolate_4d;else if(r==="bicubic")n=await Wr.bicubic_interpolate_4d;else
throw new Error(`Unsupported mode: ${r}`);const a=new G("int64",new BigInt64Array(s.map(BigInt)),[s.length]);return await n(
{x:e,s:a})}async function YT(e,t){return await(await Wr.matmul)({a:e,b:t})}async function iz(e,t){const r=Ot(Number(t.item()),
e.dims.length);return await(await Wr.rfft)({x:e.unsqueeze(-1),a:new G("int64",[BigInt(r)],[])})}async function As(e,t){const r=await Wr.
top_k;return t==null?t=e.dims.at(-1):t=Math.min(t,e.dims.at(-1)),await r({x:e,k:new G("int64",[BigInt(t)],[1])})}var Xn=e=>new G(
"int64",e,[e.length]);async function vm(e,t,r,s,n){return await(await Wr.slice)({x:e,s:Xn(t),e:Xn(r),a:Xn(s),t:Xn(n??new Array(
s.length).fill(1))})}function KT(e,t){const r=e.data,s=t.data,n=[e.dims[0],e.dims[2]],a=new r.constructor(n[0]*n[1]),[o,
i,l]=e.dims;let c=0;for(let d=0;d<o;++d){const h=d*l*i;for(let _=0;_<l;++_){let p=0,w=0;const v=d*i,y=h+_;for(let k=0;k<
i;++k){const A=Number(s[v+k]);w+=A,p+=r[y+k*l]*A}const b=p/w;a[c++]=b}}return new G(e.type,a,n)}function lz(e,t,{eps:r=1e-5}={}){
if(e.dims.length!==2)throw new Error("`layer_norm` currently only supports 2D input.");const[s,n]=e.dims;if(t.length!==1&&
t[0]!==n)throw new Error("`normalized_shape` must be a 1D array with shape `[input.dims[1]]`.");const[a,o]=ym(e,1,0,!0),
i=a.data,l=o.data,c=e.data,d=new c.constructor(c.length);for(let h=0;h<s;++h){const _=h*n;for(let p=0;p<n;++p){const w=_+
p;d[w]=(c[w]-l[h])/(i[h]+r)}}return new G(e.type,d,e.dims)}function f_(e,t){return e=e.slice(),t===null?e=e.filter(r=>r!==
1):typeof t=="number"?e[t]===1&&e.splice(t,1):Array.isArray(t)&&(e=e.filter((r,s)=>r!==1||!t.includes(s))),e}function __(e,t){
return t=Ot(t,e.length+1),e=e.slice(),e.splice(t,0,1),e}function Ot(e,t,r=null,s=!0){if(e<-t||e>=t){if(s)throw new Error(
`IndexError: index ${e} is out of bounds for dimension${r===null?"":" "+r} with size ${t}`);return e<-t?0:t}return e<0&&
(e=(e%t+t)%t),e}function Oe(e,t=0){t=Ot(t,e[0].dims.length);const r=e[0].dims.slice();r[t]=e.reduce((o,i)=>o+i.dims[t],0);
const s=r.reduce((o,i)=>o*i,1),n=new e[0].data.constructor(s),a=e[0].type;if(t===0){let o=0;for(const i of e){const l=i.
data;n.set(l,o),o+=l.length}}else{let o=0;for(let i=0;i<e.length;++i){const{data:l,dims:c}=e[i];for(let d=0;d<l.length;++d){
let h=0;for(let _=c.length-1,p=d,w=1;_>=0;--_){const v=c[_];let y=p%v;_===t&&(y+=o),h+=y*w,w*=r[_],p=Math.floor(p/v)}n[h]=
l[d]}o+=c[t]}}return new G(a,n,r)}function ur(e,t=0){return Oe(e.map(r=>r.unsqueeze(t)),t)}function rn(e,t,r,s=!1,n=null){
const a=t.data,o=t.dims;r=Ot(r,o.length);const i=o.slice();i[r]=1;const l=new a.constructor(a.length/o[r]);n!==null&&l.fill(
n);for(let c=0;c<a.length;++c){let d=0;for(let h=o.length-1,_=c,p=1;h>=0;--h){const w=o[h];if(h!==r){const v=_%w;d+=v*p,
p*=i[h]}_=Math.floor(_/w)}l[d]=e(l[d],a[c],c,d)}return s||i.splice(r,1),[t.type,l,i]}function ym(e,t=null,r=1,s=!1){const n=e.
data,a=e.dims;if(t===null){const p=n.reduce((b,k)=>b+k,0)/n.length,w=Math.sqrt(n.reduce((b,k)=>b+(k-p)**2,0)/(n.length-r)),
v=new G(e.type,[p],[]);return[new G(e.type,[w],[]),v]}t=Ot(t,a.length);const o=ol(e,t,s),i=o.data,[l,c,d]=rn((_,p,w,v)=>_+
(p-i[v])**2,e,t,s);for(let _=0;_<c.length;++_)c[_]=Math.sqrt(c[_]/(a[t]-r));return[new G(l,c,d),o]}function ol(e,t=null,r=!1){
const s=e.dims,n=e.data;if(t===null){const l=n.reduce((c,d)=>c+d,0);return new G(e.type,[l/n.length],[])}t=Ot(t,s.length);
const[a,o,i]=rn((l,c)=>l+c,e,t,r);if(s[t]!==1)for(let l=0;l<o.length;++l)o[l]/=s[t];return new G(a,o,i)}function ni(e){const t=new Array(
e.length);for(let r=e.length-1,s=1;r>=0;--r)t[r]=s,s*=e[r];return t}function il(e,t,r,s){const n=e.reduce((a,o)=>a*o,1);
return new G(r,new s(n).fill(t),e)}function ct(e,t){let r,s;if(typeof t=="number")r="float32",s=Float32Array;else if(typeof t==
"bigint")r="int64",s=BigInt64Array;else if(typeof t=="boolean")r="bool",s=Uint8Array;else throw new Error(`Unsupported d\
ata type: ${typeof t}`);return il(e,t,r,s)}function xi(e,t){return ct(e.dims,t)}function _t(e){return il(e,1n,"int64",BigInt64Array)}
function ll(e){return _t(e.dims)}function bm(e){return il(e,0n,"int64",BigInt64Array)}function cl(e){return bm(e.dims)}function cz(e){
const t=e.reduce((r,s)=>r*s,1);return new G("float32",Float32Array.from({length:t},()=>Fa.random()),e)}function JT(e){const t=e.
reduce((r,s)=>r*s,1);return new G("float32",Float32Array.from({length:t},()=>Fa.gauss()),e)}function ZT(e,t){if(e.dims.length!==
2)throw new Error("The tensor must have 2 dimensions");if(e.dims.at(-1)%8!==0)throw new Error("The last dimension of the\
 tensor must be a multiple of 8");if(!["binary","ubinary"].includes(t))throw new Error("The precision must be either 'bi\
nary' or 'ubinary'");const r=t==="binary",s=r?"int8":"uint8",n=r?Int8Array:Uint8Array,a=e.data,o=new n(a.length/8);for(let i=0;i<
a.length;++i){const l=a[i]>0?1:0,c=Math.floor(i/8),d=i%8;o[c]|=l<<7-d,r&&d===0&&(o[c]-=128)}return new G(s,o,[e.dims[0],
e.dims[1]/8])}async function ul(e){if(!e)throw new Error("modelId is required for get_tokenizer_files");return(await Jr(
e,"tokenizer_config.json",{})).exists?["tokenizer.json","tokenizer_config.json"]:[]}async function Mm(e,t){const r=await ul(
e);return await Promise.all(r.map(s=>tr(e,s,!0,t)))}function dl(e){const t=e.dims;switch(t.length){case 1:return e.tolist();case 2:
if(t[0]!==1)throw new Error("Unable to decode tensor with `batch size !== 1`. Use `tokenizer.batch_decode(...)` for batc\
hed inputs.");return e.tolist()[0];default:throw new Error(`Expected tensor to have 1-2 dimensions, got ${t.length}.`)}}
var eE=["bos_token","eos_token","unk_token","sep_token","pad_token","cls_token","mask_token"];function tE(e,t,r,s){for(const n of Object.
keys(e)){const a=t-e[n].length,o=r(n),i=new Array(a).fill(o);e[n]=s==="right"?Dt(e[n],i):Dt(i,e[n])}}function rE(e,t){for(const r of Object.
keys(e))e[r].length=t}function $r(e,...t){for(const r of t){if(!Object.hasOwn(e,r))continue;const s=e[r];if(s)if(typeof s==
"object"){if(s.__type==="AddedToken")return s.content;throw Error(`Unknown token: ${s}`)}else return s}return null}function sE(e){
const t=[];for(const r of e.get_added_tokens_decoder().values())r.special&&t.push(r);return t}var ue=class extends ft{return_token_type_ids=!1;padding_side="\
right";constructor(e,t){if(super(),this._tokenizerJSON=e,this._tokenizerConfig=t,this._tokenizer=new hk(e,t),this.config=
t,this.padding_side=t.padding_side??this.padding_side,this.mask_token=$r(t,"mask_token"),this.mask_token_id=this._tokenizer.
token_to_id(this.mask_token),this.pad_token=$r(t,"pad_token","eos_token"),this.pad_token_id=this._tokenizer.token_to_id(
this.pad_token),this.sep_token=$r(t,"sep_token"),this.sep_token_id=this._tokenizer.token_to_id(this.sep_token),this.unk_token=
$r(t,"unk_token"),this.unk_token_id=this._tokenizer.token_to_id(this.unk_token),this.bos_token=$r(t,"bos_token"),this.bos_token_id=
this._tokenizer.token_to_id(this.bos_token),this.eos_token=$r(t,"eos_token"),this.eos_token_id=this._tokenizer.token_to_id(
this.eos_token),this.chat_template=t.chat_template??null,Array.isArray(this.chat_template)){const s=Object.create(null);
for(const{name:n,template:a}of this.chat_template){if(typeof n!="string"||typeof a!="string")throw new Error('Chat templ\
ate must be a list of objects with "name" and "template" properties');s[n]=a}this.chat_template=s}this._compiled_template_cache=
new Map;const r=sE(this._tokenizer);this.all_special_ids=r.map(s=>s.id),this.all_special_tokens=r.map(s=>s.content)}static async from_pretrained(e,{
progress_callback:t=null,config:r=null,cache_dir:s=null,local_files_only:n=!1,revision:a="main"}={}){const o=await Mm(e,
{progress_callback:t,config:r,cache_dir:s,local_files_only:n,revision:a});return new this(...o)}get_vocab(){return this.
_tokenizer.get_vocab()}get model_max_length(){return this._tokenizerConfig.model_max_length??1/0}get add_eos_token(){return this.
_tokenizerConfig.add_eos_token}get add_bos_token(){return this._tokenizerConfig.add_bos_token}convert_tokens_to_ids(e){return typeof e==
"string"?this._tokenizer.token_to_id(e):e.map(t=>this._tokenizer.token_to_id(t))}_call(e,t={}){const{text_pair:r=null,add_special_tokens:s=!0,
padding:n=!1,return_token_type_ids:a=null}=t;let{truncation:o=null,max_length:i=null}=t;const l=t.return_tensor??!0,c=Array.
isArray(e);let d;if(c){if(e.length===0)throw Error("text array must be non-empty");if(r!==null){if(Array.isArray(r)){if(e.
length!==r.length)throw Error("text and text_pair must have the same length")}else throw Error("text_pair must also be a\
n array");d=e.map((_,p)=>this._encode_plus(_,{text_pair:r[p],add_special_tokens:s,return_token_type_ids:a}))}else d=e.map(
_=>this._encode_plus(_,{add_special_tokens:s,return_token_type_ids:a}))}else{if(e==null)throw Error("text may not be nul\
l or undefined");if(Array.isArray(r))throw Error("When specifying `text_pair`, since `text` is a string, `text_pair` mus\
t also be a string (i.e., not an array).");d=[this._encode_plus(e,{text_pair:r,add_special_tokens:s,return_token_type_ids:a})]}
if(i===null?i=this.model_max_length:o===null&&(n===!0?(de.warn("`max_length` is ignored when `padding: true` and there i\
s no truncation strategy. To pad to max length, use `padding: 'max_length'`."),i=this.model_max_length):n===!1&&(de.warn(
"Truncation was not explicitly activated but `max_length` is provided a specific value, please use `truncation: true` to\
 explicitly truncate examples to max length."),o=!0)),n===!0&&(i=Math.min(We(d.map(_=>_.input_ids.length))[0],i??1/0)),i=
Math.min(i,this.model_max_length??1/0),n||o)for(let _=0;_<d.length;++_)d[_].input_ids.length!==i&&(d[_].input_ids.length>
i?o&&rE(d[_],i):n&&tE(d[_],i,p=>p==="input_ids"?this.pad_token_id:0,this.padding_side));const h={};if(l){if(!(n&&o)&&d.some(
p=>{for(const w of Object.keys(p))if(p[w].length!==d[0][w]?.length)return!0;return!1}))throw Error("Unable to create ten\
sor, you should probably activate truncation and/or padding with 'padding=true' and 'truncation=true' to have batched te\
nsors with the same length.");const _=[d.length,d[0].input_ids.length];for(const p of Object.keys(d[0]))h[p]=new G("int6\
4",BigInt64Array.from(d.flatMap(w=>w[p]).map(BigInt)),_)}else{for(const _ of Object.keys(d[0]))h[_]=d.map(p=>p[_]);if(!c)
for(const _ of Object.keys(h))h[_]=h[_][0]}return h}_encode_text(e){return e===null?null:this._tokenizer.encode(e).tokens}_encode_plus(e,{
text_pair:t=null,add_special_tokens:r=!0,return_token_type_ids:s=null}={}){const{ids:n,attention_mask:a,token_type_ids:o}=this.
_tokenizer.encode(e,{text_pair:t,add_special_tokens:r,return_token_type_ids:s??this.return_token_type_ids});return{input_ids:n,
attention_mask:a,...o?{token_type_ids:o}:{}}}tokenize(e,{pair:t=null,add_special_tokens:r=!1}={}){return this._tokenizer.
tokenize(e,{text_pair:t,add_special_tokens:r})}encode(e,{text_pair:t=null,add_special_tokens:r=!0,return_token_type_ids:s=null}={}){
return this._tokenizer.encode(e,{text_pair:t,add_special_tokens:r,return_token_type_ids:s}).ids}batch_decode(e,t={}){return e instanceof
G&&(e=e.tolist()),e.map(r=>this.decode(r,t))}decode(e,t={}){if(e instanceof G&&(e=dl(e)),!Array.isArray(e)||e.length===0||
!zM(e[0]))throw Error("token_ids must be a non-empty array of integers.");return this.decode_single(e,t)}decode_single(e,{
skip_special_tokens:t=!1,clean_up_tokenization_spaces:r=null}){return this._tokenizer.decode(e,{skip_special_tokens:t,clean_up_tokenization_spaces:r})}get_chat_template({
chat_template:e=null,tools:t=null}={}){if(this.chat_template&&typeof this.chat_template=="object"){const r=this.chat_template;
if(e!==null&&Object.hasOwn(r,e))e=r[e];else if(e===null)if(t!==null&&"tool_use"in r)e=r.tool_use;else if("default"in r)e=
r.default;else throw Error(`This model has multiple chat templates with no default specified! Please either pass a chat \
template or the name of the template you wish to use to the 'chat_template' argument. Available template names are ${Object.
keys(r).sort()}.`)}else if(e===null)if(this.chat_template)e=this.chat_template;else throw Error("Cannot use apply_chat_t\
emplate() because tokenizer.chat_template is not set and no template argument was passed! For information about writing \
templates and setting the tokenizer.chat_template attribute, please see the documentation at https://huggingface.co/docs\
/transformers/main/en/chat_templating");return e}apply_chat_template(e,t={}){let{tools:r=null,documents:s=null,chat_template:n=null,
add_generation_prompt:a=!1,tokenize:o=!0,padding:i=!1,truncation:l=!1,max_length:c=null,return_tensor:d=!0,return_dict:h=!0,
tokenizer_kwargs:_={},...p}=t;if(n=this.get_chat_template({chat_template:n,tools:r}),typeof n!="string")throw Error(`cha\
t_template must be a string, but got ${typeof n}`);let w=this._compiled_template_cache.get(n);w===void 0&&(w=new uT(n),this.
_compiled_template_cache.set(n,w));const v=Object.create(null);for(const b of eE){const k=$r(this.config,b);k&&(v[b]=k)}
const y=w.render({messages:e,add_generation_prompt:a,tools:r,documents:s,...v,...p});if(o){const b=this._call(y,{add_special_tokens:!1,
padding:i,truncation:l,max_length:c,return_tensor:d,..._});return h?b:b.input_ids}return y}};function hl(e,t,r,s){if(!("\
language_codes"in e)||!Array.isArray(e.language_codes))throw new Error("Tokenizer must have `language_codes` attribute s\
et and it should be an array of language ids.");if(!("languageRegex"in e)||!(e.languageRegex instanceof RegExp))throw new Error(
"Tokenizer must have `languageRegex` attribute set and it should be a regular expression.");if(!("lang_to_token"in e)||typeof e.
lang_to_token!="function")throw new Error("Tokenizer must have `lang_to_token` attribute set and it should be a function\
.");const n=s.src_lang,a=s.tgt_lang;if(!e.language_codes.includes(a))throw new Error(`Target language code "${a}" is not\
 valid. Must be one of: {${e.language_codes.join(", ")}}`);if(n!==void 0){if(!e.language_codes.includes(n))throw new Error(
`Source language code "${n}" is not valid. Must be one of: {${e.language_codes.join(", ")}}`);const o=e._tokenizer.post_processor?.
config;if(o&&"single"in o){for(const i of o.single)if("SpecialToken"in i&&e.languageRegex.test(i.SpecialToken.id)){i.SpecialToken.
id=e.lang_to_token(n);break}}}return s.forced_bos_token_id=e._tokenizer.token_to_id(e.lang_to_token(a)),e._call(t,r)}var xm={};
hn(xm,{AlbertTokenizer:()=>nE,AutoTokenizer:()=>ke,BartTokenizer:()=>aE,BertTokenizer:()=>oE,BlenderbotSmallTokenizer:()=>iE,
BlenderbotTokenizer:()=>lE,BloomTokenizer:()=>cE,CLIPTokenizer:()=>dE,CamembertTokenizer:()=>uE,CodeGenTokenizer:()=>fE,
CodeLlamaTokenizer:()=>hE,CohereAsrTokenizer:()=>pE,CohereTokenizer:()=>_E,ConvBertTokenizer:()=>mE,DebertaTokenizer:()=>wE,
DebertaV2Tokenizer:()=>gE,DistilBertTokenizer:()=>vE,ElectraTokenizer:()=>yE,EsmTokenizer:()=>bE,FalconTokenizer:()=>ME,
GPT2Tokenizer:()=>TE,GPTNeoXTokenizer:()=>kE,GemmaTokenizer:()=>xE,HerbertTokenizer:()=>EE,LlamaTokenizer:()=>AE,M2M100Tokenizer:()=>CE,
MBart50Tokenizer:()=>PE,MBartTokenizer:()=>km,MPNetTokenizer:()=>LE,MarianTokenizer:()=>SE,MgpstrTokenizer:()=>FE,MobileBertTokenizer:()=>IE,
NllbTokenizer:()=>OE,NougatTokenizer:()=>NE,PreTrainedTokenizer:()=>ue,Qwen2Tokenizer:()=>DE,RoFormerTokenizer:()=>BE,RobertaTokenizer:()=>zE,
SiglipTokenizer:()=>RE,SpeechT5Tokenizer:()=>$E,SqueezeBertTokenizer:()=>GE,T5Tokenizer:()=>VE,TokenizersBackend:()=>ue,
VitsTokenizer:()=>jE,Wav2Vec2CTCTokenizer:()=>qE,WhisperTokenizer:()=>YE,XLMRobertaTokenizer:()=>KE,XLMTokenizer:()=>JE});
var nE=class extends ue{return_token_type_ids=!0},aE=class extends ue{},oE=class extends ue{return_token_type_ids=!0},iE=class extends ue{},
lE=class extends ue{},cE=class extends ue{},uE=class extends ue{},dE=class extends ue{},hE=class extends ue{},fE=class extends ue{},
_E=class extends ue{},pE=class extends ue{},mE=class extends ue{return_token_type_ids=!0},gE=class extends ue{return_token_type_ids=!0},
wE=class extends ue{return_token_type_ids=!0},vE=class extends ue{},yE=class extends ue{return_token_type_ids=!0},bE=class extends ue{},
ME=class extends ue{},xE=class extends ue{},kE=class extends ue{},TE=class extends ue{},EE=class extends ue{return_token_type_ids=!0},
AE=class extends ue{padding_side="left"},CE=class extends ue{constructor(e,t){super(e,t),this.languageRegex=/^__[a-z]{2,3}__$/,
this.language_codes=this.all_special_tokens.filter(r=>this.languageRegex.test(r)).map(r=>r.slice(2,-2)),this.lang_to_token=
r=>`__${r}__`}_build_translation_inputs(e,t,r){return hl(this,e,t,r)}},SE=class extends ue{constructor(e,t){super(e,t),this.
languageRegex=/^(>>\w+<<)\s*/g,this.supported_language_codes=Array.from(this.get_vocab().keys()).filter(r=>this.languageRegex.
test(r)),de.warn('WARNING: `MarianTokenizer` is not yet supported by Hugging Face\'s "fast" tokenizers library. Therefore\
, you may experience slightly inaccurate results.')}_encode_text(e){if(e===null)return null;const[t,...r]=e.trim().split(
this.languageRegex);if(r.length===0)return super._encode_text(t);if(r.length===2){const[s,n]=r;return this.supported_language_codes.
includes(s)||de.warn(`Unsupported language code "${s}" detected, which may lead to unexpected behavior. Should be one of\
: ${JSON.stringify(this.supported_language_codes)}`),Dt([s],super._encode_text(n))}}},km=class extends ue{constructor(e,t){
super(e,t),this.languageRegex=/^[a-z]{2}_[A-Z]{2}$/,this.language_codes=this.all_special_tokens.filter(r=>this.languageRegex.
test(r)).map(r=>r),this.lang_to_token=r=>r}_build_translation_inputs(e,t,r){return hl(this,e,t,r)}},PE=class extends km{},
FE=class extends ue{},IE=class extends ue{return_token_type_ids=!0},LE=class extends ue{},OE=class extends ue{constructor(e,t){
super(e,t),this.languageRegex=/^[a-z]{3}_[A-Z][a-z]{3}$/,this.language_codes=this.all_special_tokens.filter(r=>this.languageRegex.
test(r)),this.lang_to_token=r=>r}_build_translation_inputs(e,t,r){return hl(this,e,t,r)}},NE=class extends ue{},DE=class extends ue{},
zE=class extends ue{},BE=class extends ue{return_token_type_ids=!0},RE=class extends ue{},$E=class extends ue{},GE=class extends ue{return_token_type_ids=!0},
VE=class extends ue{},UE=class extends Vt{decode_chain(e){let t="";for(let r=1;r<e.length;r+=2)t+=e[r];return[t]}},jE=class extends ue{constructor(e,t){
super(e,t),this._tokenizer.decoder=new UE({type:"VitsDecoder"})}},qE=class extends ue{},Tm=[["en","english"],["zh","chin\
ese"],["de","german"],["es","spanish"],["ru","russian"],["ko","korean"],["fr","french"],["ja","japanese"],["pt","portugu\
ese"],["tr","turkish"],["pl","polish"],["ca","catalan"],["nl","dutch"],["ar","arabic"],["sv","swedish"],["it","italian"],
["id","indonesian"],["hi","hindi"],["fi","finnish"],["vi","vietnamese"],["he","hebrew"],["uk","ukrainian"],["el","greek"],
["ms","malay"],["cs","czech"],["ro","romanian"],["da","danish"],["hu","hungarian"],["ta","tamil"],["no","norwegian"],["t\
h","thai"],["ur","urdu"],["hr","croatian"],["bg","bulgarian"],["lt","lithuanian"],["la","latin"],["mi","maori"],["ml","m\
alayalam"],["cy","welsh"],["sk","slovak"],["te","telugu"],["fa","persian"],["lv","latvian"],["bn","bengali"],["sr","serb\
ian"],["az","azerbaijani"],["sl","slovenian"],["kn","kannada"],["et","estonian"],["mk","macedonian"],["br","breton"],["e\
u","basque"],["is","icelandic"],["hy","armenian"],["ne","nepali"],["mn","mongolian"],["bs","bosnian"],["kk","kazakh"],["\
sq","albanian"],["sw","swahili"],["gl","galician"],["mr","marathi"],["pa","punjabi"],["si","sinhala"],["km","khmer"],["s\
n","shona"],["yo","yoruba"],["so","somali"],["af","afrikaans"],["oc","occitan"],["ka","georgian"],["be","belarusian"],["\
tg","tajik"],["sd","sindhi"],["gu","gujarati"],["am","amharic"],["yi","yiddish"],["lo","lao"],["uz","uzbek"],["fo","faro\
ese"],["ht","haitian creole"],["ps","pashto"],["tk","turkmen"],["nn","nynorsk"],["mt","maltese"],["sa","sanskrit"],["lb",
"luxembourgish"],["my","myanmar"],["bo","tibetan"],["tl","tagalog"],["mg","malagasy"],["as","assamese"],["tt","tatar"],[
"haw","hawaiian"],["ln","lingala"],["ha","hausa"],["ba","bashkir"],["jw","javanese"],["su","sundanese"]],aa=new Map(Tm),
WE=new Map([...Tm.map(([e,t])=>[t,e]),["burmese","my"],["valencian","ca"],["flemish","nl"],["haitian","ht"],["letzeburge\
sch","lb"],["pushto","ps"],["panjabi","pa"],["moldavian","ro"],["moldovan","ro"],["sinhalese","si"],["castilian","es"]]);
function HE(e){e=e.toLowerCase();let t=WE.get(e);if(t===void 0){const r=e.match(/^<\|([a-z]{2})\|>$/);if(r&&(e=r[1]),aa.
has(e))t=e;else{const n=e.length===2?aa.keys():aa.values();throw new Error(`Language "${e}" is not supported. Must be on\
e of: ${JSON.stringify(Array.from(n))}`)}}return t}var QE="\\p{P}\\u0021-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E",
p_=new RegExp(`^[${QE}]+$`,"gu"),XE=.1,YE=class extends ue{get timestamp_begin(){return this._tokenizer.token_to_id("<|n\
otimestamps|>")+1}_decode_asr(e,{return_timestamps:t=!1,return_language:r=!1,time_precision:s=null,force_full_sequences:n=!0}={}){
if(s===null)throw Error("Must specify time_precision");let a=null;const o=t==="word";function i(){return{language:a,timestamp:[
null,null],text:""}}const l=[];let c=i(),d=0;const h=this.timestamp_begin,p=h+1500;let w=[],v=[],y=!1,b=null;const k=new Set(
this.all_special_ids);for(const C of e){const N=C.tokens,M=o?C.token_timestamps:null;let $=null,R=h;if("stride"in C){const[
Q,z,I]=C.stride;if(d-=z,b=Q-I,z&&(R=z/s+h),I)for(let U=N.length-1;U>=0;--U){const X=Number(N[U]);if(X>=h){if($!==null&&(X-
h)*s<b)break;$=X}}}let j=[],Y=[];for(let Q=0;Q<N.length;++Q){const z=Number(N[Q]);if(k.has(z)){const I=this.decode([z]),
U=aa.get(I.slice(2,-2));if(U!==void 0){if(a!==null&&U!==a&&!t){w.push(j);const X=this.findLongestCommonSequence(w)[0],ce=this.
decode(X);c.text=ce,l.push(c),w=[],j=[],c=i()}a=c.language=U}}else if(z>=h&&z<=p){const I=(z-h)*s+d,U=en(I,2);if($!==null&&
z>=$)y=!0;else if(y||w.length>0&&z<R)y=!1;else if(c.timestamp[0]===null)c.timestamp[0]=U;else if(U!==c.timestamp[0]){c.timestamp[1]=
U,w.push(j),o&&v.push(Y);const[X,ce]=this.findLongestCommonSequence(w,v),Z=this.decode(X);if(c.text=Z,o&&(c.words=this.collateWordTimestamps(
X,ce,a),c.words.length>0&&c.timestamp[1]!==null))for(const se of c.words)se.timestamp[1]>c.timestamp[1]&&c.timestamp[1]>=
se.timestamp[0]&&(se.timestamp[1]=c.timestamp[1]);l.push(c),w=[],j=[],v=[],Y=[],c=i()}}else if(j.push(z),o){let I=en(M[Q]+
d,2),U;if(Q+1<M.length){U=en(M[Q+1]+d,2);const X=this.decode([z]);p_.test(X)&&(U=en(Math.min(I+s,U),2))}else U=null;Y.push(
[I,U])}}if("stride"in C){const[Q,z,I]=C.stride;d+=Q-I}j.length>0?(w.push(j),o&&v.push(Y)):w.every(Q=>Q.length===0)&&(c=i(),
w=[],j=[],v=[],Y=[])}if(w.length>0){if(n&&t)throw new Error("Whisper did not predict an ending timestamp, which can happ\
en if audio is cut off in the middle of a word. Also make sure WhisperTimeStampLogitsProcessor was used during generatio\
n.");const[C,N]=this.findLongestCommonSequence(w,v),M=this.decode(C);c.text=M,o&&(c.words=this.collateWordTimestamps(C,N,
a)),l.push(c)}let A=Object.create(null);const E=l.map(C=>C.text).join("");if(t||r){for(let C=0;C<l.length;++C){const N=l[C];
t||delete N.timestamp,r||delete N.language}if(o){const C=[];for(const N of l)for(const M of N.words)C.push(M);A={chunks:C}}else
A={chunks:l}}return[E,A]}findLongestCommonSequence(e,t=null){let r=e[0],s=r.length,n=[];const a=Array.isArray(t)&&t.length>
0;let o=a?[]:null,i=a?t[0]:null;for(let l=1;l<e.length;++l){const c=e[l];let d=0,h=[s,s,0,0];const _=c.length;for(let A=1;A<
s+_;++A){const E=Math.max(0,s-A),C=Math.min(s,s+_-A),N=r.slice(E,C),M=Math.max(0,A-s),$=Math.min(_,A),R=c.slice(M,$);if(N.
length!==R.length)throw new Error("There is a bug within whisper `decode_asr` function, please report it. Dropping to pr\
event bad inference.");let j;a?j=N.filter((z,I)=>z===R[I]&&i[E+I][0]-XE<=t[l][M+I][0]).length:j=N.filter((z,I)=>z===R[I]).
length;const Y=A/1e4,Q=j/A+Y;j>1&&Q>d&&(d=Q,h=[E,C,M,$])}const[p,w,v,y]=h,b=Math.floor((w+p)/2);let k=Math.floor((y+v)/2);
if(a&&d===0&&s>0){const A=i[s-1][0],E=t[l].findIndex(C=>C[0]>=A);k=E===-1?c.length:E}n.push(...r.slice(0,b)),r=c.slice(k),
s=r.length,a&&(o.push(...i.slice(0,b)),i=t[l].slice(k))}return n.push(...r),a?(o.push(...i),[n,o]):[n,[]]}collateWordTimestamps(e,t,r){
const[s,n,a]=this.combineTokensIntoWords(e,r),o=[];for(let i=0;i<s.length;++i){const l=a[i];o.push({text:s[i],timestamp:[
t[l.at(0)][0],t[l.at(-1)][1]]})}return o}combineTokensIntoWords(e,t,r=`"'“¡¿([{-`,s=`"'.。,，!！?？:：”)]}、`){
t=t??"english";let n,a,o;return["chinese","japanese","thai","lao","myanmar"].includes(t)?[n,a,o]=this.splitTokensOnUnicode(
e):[n,a,o]=this.splitTokensOnSpaces(e),this.mergePunctuations(n,a,o,r,s)}decode(e,t){let r;return t?.decode_with_timestamps?
(e instanceof G&&(e=dl(e)),r=this.decodeWithTimestamps(e,t)):r=super.decode(e,t),r}decodeWithTimestamps(e,t){const r=t?.
time_precision??.02,s=this.all_special_ids.at(-1)+1;let n=[[]];for(let a of e)if(a=Number(a),a>=s){const o=((a-s)*r).toFixed(
2);n.push(`<|${o}|>`),n.push([])}else n[n.length-1].push(a);return n=n.map(a=>typeof a=="string"?a:super.decode(a,t)),n.
join("")}splitTokensOnUnicode(e){const t=this.decode(e,{decode_with_timestamps:!0}),r="�",s=[],n=[],a=[];let o=[],i=[],
l=0;for(let c=0;c<e.length;++c){const d=e[c];o.push(d),i.push(c);const h=this.decode(o,{decode_with_timestamps:!0});(!h.
includes(r)||t[l+h.indexOf(r)]===r)&&(s.push(h),n.push(o),a.push(i),o=[],i=[],l+=h.length)}return[s,n,a]}splitTokensOnSpaces(e){
const[t,r,s]=this.splitTokensOnUnicode(e),n=[],a=[],o=[];for(let i=0;i<t.length;++i){const l=t[i],c=r[i],d=s[i],h=c[0]>=
this._tokenizer.token_to_id("<|endoftext|>"),_=l.startsWith(" "),p=l.trim(),w=p_.test(p);if(h||_||w||n.length===0)n.push(
l),a.push(c),o.push(d);else{const v=n.length-1;n[v]+=l,a[v].push(...c),o[v].push(...d)}}return[n,a,o]}mergePunctuations(e,t,r,s,n){
const a=structuredClone(e),o=structuredClone(t),i=structuredClone(r);let l=a.length-2,c=a.length-1;for(;l>=0;)a[l].startsWith(
" ")&&s.includes(a[l].trim())?(a[c]=a[l]+a[c],o[c]=Dt(o[l],o[c]),i[c]=Dt(i[l],i[c]),a[l]="",o[l]=[],i[l]=[]):c=l,--l;for(l=
0,c=1;c<a.length;)!a[l].endsWith(" ")&&n.includes(a[c])?(a[l]+=a[c],o[l]=Dt(o[l],o[c]),i[l]=Dt(i[l],i[c]),a[c]="",o[c]=[],
i[c]=[]):l=c,++c;return[a.filter(d=>d),o.filter(d=>d.length>0),i.filter(d=>d.length>0)]}},KE=class extends ue{},JE=class extends ue{return_token_type_ids=!0;constructor(e,t){
super(e,t),de.warn('WARNING: `XLMTokenizer` is not yet supported by Hugging Face\'s "fast" tokenizers library. Therefore,\
 you may experience slightly inaccurate results.')}},ke=class{static async from_pretrained(e,{progress_callback:t=null,config:r=null,
cache_dir:s=null,local_files_only:n=!1,revision:a="main"}={}){const[o,i]=await Mm(e,{progress_callback:t,config:r,cache_dir:s,
local_files_only:n,revision:a}),l=i.tokenizer_class?.replace(/Fast$/,"")??"PreTrainedTokenizer";let c=xm[l];return c||(de.
warn(`Unknown tokenizer class "${l}", attempting to construct from base class.`),c=ue),new c(o,i)}},Ia="https://github.c\
om/huggingface/transformers.js/issues/new/choose",Em="preprocessor_config.json",cn="preprocessor_config.json",Am="proces\
sor_config.json",Cm="chat_template.jinja",Te=class extends ft{static classes=["image_processor_class","tokenizer_class",
"feature_extractor_class"];static uses_processor_config=!1;static uses_chat_template_file=!1;constructor(e,t,r){super(),
this.config=e,this.components=t,this.chat_template=r}get image_processor(){return this.components.image_processor}get tokenizer(){
return this.components.tokenizer}get feature_extractor(){return this.components.feature_extractor}apply_chat_template(e,t={}){
if(!this.tokenizer)throw new Error("Unable to apply chat template without a tokenizer.");return this.tokenizer.apply_chat_template(
e,{tokenize:!1,chat_template:this.chat_template??void 0,...t})}batch_decode(...e){if(!this.tokenizer)throw new Error("Un\
able to decode without a tokenizer.");return this.tokenizer.batch_decode(...e)}decode(...e){if(!this.tokenizer)throw new Error(
"Unable to decode without a tokenizer.");return this.tokenizer.decode(...e)}async _call(e,...t){for(const r of[this.image_processor,
this.feature_extractor,this.tokenizer])if(r)return r(e,...t);throw new Error("No image processor, feature extractor, or \
tokenizer found.")}static async from_pretrained(e,t={}){const[r,s,n]=await Promise.all([this.uses_processor_config?tr(e,
Am,!0,t):{},Promise.all(this.classes.filter(a=>a in this).map(async a=>{const o=await this[a].from_pretrained(e,t);return[
a.replace(/_class$/,""),o]})).then(Object.fromEntries),this.uses_chat_template_file?nl(e,Cm,!0,t):null]);return new this(
r,s,n)}},ki={};hn(ki,{ChatterboxProcessor:()=>A2,CohereAsrProcessor:()=>S2,EmbeddingGemma2Processor:()=>N2,EmbeddingGemma2VideoProcessor:()=>$m,
Florence2Processor:()=>LA,Gemma3Processor:()=>OA,Gemma3nProcessor:()=>NA,Gemma4Processor:()=>Rm,Glm46VProcessor:()=>DA,GraniteSpeechProcessor:()=>zA,
GroundingDinoProcessor:()=>RA,Idefics3Processor:()=>M_,JinaCLIPProcessor:()=>jA,Lfm2VlProcessor:()=>qA,Lfm3VlProcessor:()=>WA,
LlavaProcessor:()=>HA,MgpstrProcessor:()=>QA,MoonshineProcessor:()=>XA,OwlViTProcessor:()=>YA,PaliGemmaProcessor:()=>JA,
Phi3VProcessor:()=>eC,PixtralProcessor:()=>tC,Processor:()=>Te,PyAnnoteProcessor:()=>rC,Qwen2VLProcessor:()=>yl,Qwen2_5_VLProcessor:()=>ag,
Qwen3VLProcessor:()=>sC,Sam2Processor:()=>ig,Sam2VideoProcessor:()=>nC,SamProcessor:()=>og,SmolVLMProcessor:()=>M_,SpeechT5Processor:()=>aC,
UltravoxProcessor:()=>oC,VLChatProcessor:()=>UA,VoxtralProcessor:()=>uC,VoxtralRealtimeProcessor:()=>fC,Wav2Vec2Processor:()=>_C,
Wav2Vec2ProcessorWithLM:()=>pC,WhisperProcessor:()=>mC});var ut=class extends ft{constructor(e){super(),this.config=e}static async from_pretrained(e,t={}){
const r=await tr(e,Em,!0,t);return new this(r)}};function nt(e,t){if(!(e instanceof Float32Array||e instanceof Float64Array))
throw new Error(`${t} expects input to be a Float32Array or a Float64Array, but got ${e?.constructor?.name??typeof e} in\
stead. If using the feature extractor directly, remember to use \`load_audio(url, sampling_rate)\` to obtain the raw audio\
 data of the file/url.`)}var fl={};hn(fl,{ASTFeatureExtractor:()=>f2,ChatterboxFeatureExtractor:()=>_2,ClapFeatureExtractor:()=>p2,
CohereAsrFeatureExtractor:()=>g2,DacFeatureExtractor:()=>Om,EncodecFeatureExtractor:()=>Im,FeatureExtractor:()=>ut,Gemma3nAudioFeatureExtractor:()=>Nm,
Gemma4AudioFeatureExtractor:()=>Dm,GraniteSpeechFeatureExtractor:()=>w2,MoonshineFeatureExtractor:()=>v2,ParakeetFeatureExtractor:()=>Lm,
PyAnnoteFeatureExtractor:()=>zm,SeamlessM4TFeatureExtractor:()=>y2,SnacFeatureExtractor:()=>b2,SpeechT5FeatureExtractor:()=>M2,
VoxtralRealtimeFeatureExtractor:()=>T2,Wav2Vec2FeatureExtractor:()=>x2,WeSpeakerFeatureExtractor:()=>k2,WhisperFeatureExtractor:()=>E2});
var ZE=()=>{},e2=ZE;async function Sm(e,t){if(fe.IS_BROWSER_ENV){if(fe.IS_WEBWORKER_ENV)throw new Error("Unable to save \
a file from a Web Worker.");const r=URL.createObjectURL(t),s=document.createElement("a");s.href=r,s.download=e,s.click(),
s.remove(),URL.revokeObjectURL(r)}else if(fe.IS_FS_AVAILABLE)t.stream(),bt.createWriteStream(e),await e2();else throw new Error(
"Unable to save because filesystem is disabled in this environment.")}async function t2(e,t){if(typeof AudioContext>"u")
throw Error("Unable to load audio from path/URL since `AudioContext` is not available in your environment. Instead, audi\
o data should be passed directly to the pipeline/processor. For more information and some example code, see https://hugg\
ingface.co/docs/transformers.js/guides/node-audio-processing.");const r=await(await an(e)).arrayBuffer(),s=new AudioContext(
{sampleRate:t});typeof t>"u"&&de.warn(`No sampling rate provided, using default of ${s.sampleRate}Hz.`);const n=await s.
decodeAudioData(r);let a;if(n.numberOfChannels===2){const o=Math.sqrt(2),i=n.getChannelData(0),l=n.getChannelData(1);a=new Float32Array(
i.length);for(let c=0;c<n.length;++c)a[c]=o*(i[c]+l[c])/2}else a=n.getChannelData(0);return a}async function r2(e,t){return await t2(
e,t)}function Pm(e,t){if(e<1)return new Float64Array;if(e===1)return new Float64Array([1]);const r=1-t,s=2*Math.PI/(e-1),
n=new Float64Array(e);for(let a=0;a<e;++a)n[a]=t-r*Math.cos(a*s);return n}function m_(e){return Pm(e,.5)}function s2(e){
return Pm(e,.54)}var n2={htk:e=>2595*Math.log10(1+e/700),kaldi:e=>1127*Math.log(1+e/700),slaney:(e,t=1e3,r=15,s=27/Math.
log(6.4))=>e>=t?r+Math.log(e/t)*s:3*e/200};function ai(e,t="htk"){const r=n2[t];if(!r)throw new Error('mel_scale should \
be one of "htk", "slaney" or "kaldi".');return typeof e=="number"?r(e):e.map(s=>r(s))}var a2={htk:e=>700*(10**(e/2595)-1),
kaldi:e=>700*(Math.exp(e/1127)-1),slaney:(e,t=1e3,r=15,s=Math.log(6.4)/27)=>e>=r?t*Math.exp(s*(e-r)):200*e/3};function o2(e,t="\
htk"){const r=a2[t];if(!r)throw new Error('mel_scale should be one of "htk", "slaney" or "kaldi".');return typeof e=="nu\
mber"?r(e):e.map(s=>r(s))}function i2(e,t){const r=Float64Array.from({length:t.length-1},(o,i)=>t[i+1]-t[i]),s=Array.from(
{length:e.length},()=>new Array(t.length));for(let o=0;o<e.length;++o){const i=s[o];for(let l=0;l<t.length;++l)i[l]=t[l]-
e[o]}const n=t.length-2,a=Array.from({length:n},()=>new Array(e.length));for(let o=0;o<e.length;++o){const i=s[o];for(let l=0;l<
n;++l){const c=-i[l]/r[l],d=i[l+2]/r[l+1];a[l][o]=Math.max(0,Math.min(c,d))}}return a}function g_(e,t,r){const s=(t-e)/(r-
1);return Float64Array.from({length:r},(n,a)=>e+s*a)}function er(e,t,r,s,n,a=null,o="htk",i=!1){if(a!==null&&a!=="slaney")
throw new Error('norm must be one of null or "slaney"');if(e<2)throw new Error(`Require num_frequency_bins: ${e} >= 2`);
if(r>s)throw new Error(`Require min_frequency: ${r} <= max_frequency: ${s}`);const l=ai(r,o),c=ai(s,o),d=g_(l,c,t+2);let h=o2(
d,o),_;if(i){const w=n/((e-1)*2);_=ai(Float64Array.from({length:e},(v,y)=>y*w),o),h=d}else _=g_(0,Math.floor(n/2),e);const p=i2(
_,h);if(a!==null&&a==="slaney")for(let w=0;w<t;++w){const v=p[w],y=2/(h[w+2]-h[w]);for(let b=0;b<e;++b)v[b]*=y}return p}
function l2(e,t,r){const s=new e.constructor(e.length+t+r),n=e.length-1;for(let a=0;a<e.length;++a)s[t+a]=e[a];for(let a=1;a<=
t;++a)s[t-a]=e[_a(a,n)];for(let a=1;a<=r;++a)s[n+t+a]=e[_a(n-a,n)];return s}function Fm(e,t,r,s,n){if(r<=0)throw new Error(
"reference must be greater than zero");if(s<=0)throw new Error("min_value must be greater than zero");r=Math.max(s,r);const a=Math.
log10(r);for(let o=0;o<e.length;++o)e[o]=t*Math.log10(Math.max(s,e[o])-a);if(n!==null){if(n<=0)throw new Error("db_range\
 must be greater than zero");const o=We(e)[0]-n;for(let i=0;i<e.length;++i)e[i]=Math.max(e[i],o)}return e}function c2(e,t=1,r=1e-5,s=null){
return Fm(e,20,t,r,s)}function u2(e,t=1,r=1e-10,s=null){return Fm(e,10,t,r,s)}async function rr(e,t,r,s,{fft_length:n=null,
power:a=1,center:o=!0,pad_mode:i="reflect",onesided:l=!0,preemphasis:c=null,preemphasis_htk_flavor:d=!0,mel_filters:h=null,
mel_floor:_=1e-10,log_mel:p=null,max_log_mel:w=null,reference:v=1,min_value:y=1e-10,db_range:b=null,remove_dc_offset:k=null,
min_num_frames:A=null,max_num_frames:E=null,do_pad:C=!0,transpose:N=!1,mel_offset:M=0,mel_floor_mode:$="clamp"}={}){const R=t.
length;if(n===null&&(n=r),r>n)throw Error(`frame_length (${r}) may not be larger than fft_length (${n})`);if(R!==r)throw new Error(
`Length of the window (${R}) must equal frame_length (${r})`);if(s<=0)throw new Error("hop_length must be greater than z\
ero");if(a===null&&h!==null)throw new Error("You have provided `mel_filters` but `power` is `None`. Mel spectrogram comp\
utation is not yet supported for complex-valued spectrogram. Specify `power` to fix this issue.");if(!d)throw new Error(
"`preemphasis_htk_flavor=false` is not currently supported.");if(o){const O=Math.floor(r/2);switch(i){case"reflect":{e=l2(
e,O,O);break}case"constant":{const V=new e.constructor(e.length+2*O);V.set(e,O),e=V;break}case"semicausal":{const V=new e.
constructor(e.length+O);V.set(e,O),e=V;break}default:throw new Error(`pad_mode="${i}" not implemented yet.`)}}let j=Math.
floor(1+Math.floor((e.length-r)/s));A!==null&&j<A&&(j=A);const Y=l?Math.floor(n/2)+1:n;let Q=j,z=j;E!==null&&(E>j?C&&(z=
E):z=Q=E);const I=new IT(n),U=new Float64Array(n),X=new Float64Array(I.outputBufferSize),ce=new Float32Array(Y*z);for(let O=0;O<
Q;++O){const V=O*s,ne=Math.min(e.length-V,r);ne!==r&&U.fill(0,0,r);for(let ae=0;ae<ne;++ae)U[ae]=e[V+ae];if(k){let ae=0;
for(let Ee=0;Ee<ne;++Ee)ae+=U[Ee];const qe=ae/ne;for(let Ee=0;Ee<ne;++Ee)U[Ee]-=qe}if(c!==null){for(let ae=ne-1;ae>=1;--ae)
U[ae]-=c*U[ae-1];U[0]*=1-c}for(let ae=0;ae<t.length;++ae)U[ae]*=t[ae];I.realTransform(X,U);for(let ae=0;ae<Y;++ae){const qe=ae<<
1;ce[ae*z+O]=X[qe]**2+X[qe+1]**2}}if(a!==null&&a!==2){const O=a/2;for(let V=0;V<ce.length;++V)ce[V]**=O}const Z=h.length;
let se=await YT(new G("float32",h.flat(),[Z,Y]),new G("float32",ce,[Y,z]));N&&(se=se.transpose(1,0));const L=se.data;if($===
"add")for(let O=0;O<L.length;++O)L[O]=M+L[O]+_;else for(let O=0;O<L.length;++O)L[O]=M+Math.max(_,L[O]);if(a!==null&&p!==
null){const O=Math.min(L.length,Q*Z);switch(p){case"log":for(let V=0;V<O;++V)L[V]=Math.log(L[V]);break;case"log10":for(let V=0;V<
O;++V)L[V]=Math.log10(L[V]);break;case"log10_max_norm":{for(let ae=0;ae<O;++ae)L[ae]=Math.log10(L[ae]);const ne=(w??We(L)[0])-
8;for(let ae=0;ae<O;++ae)L[ae]=(Math.max(L[ae],ne)+4)/4;break}case"dB":if(a===1)c2(L,v,y,b);else if(a===2)u2(L,v,y,b);else
throw new Error(`Cannot use log_mel option '${p}' with power ${a}`);break;default:throw new Error(`log_mel must be one o\
f null, 'log', 'log10', 'log10_max_norm', or 'dB'. Got '${p}'`)}}return se}function fr(e,t,{periodic:r=!0,frame_length:s=null,
center:n=!0}={}){const a=r?e+1:e;let o;switch(t){case"boxcar":o=new Float64Array(a).fill(1);break;case"hann":case"hann_w\
indow":o=m_(a);break;case"hamming":o=s2(a);break;case"povey":o=m_(a).map(c=>Math.pow(c,.85));break;default:throw new Error(
`Unknown window type ${t}.`)}if(r&&(o=o.subarray(0,e)),s===null||e===s)return o;if(e>s)throw new Error(`Length of the wi\
ndow (${e}) may not be larger than frame_length (${s})`);const i=new Float64Array(s),l=n?Math.floor((s-e)/2):0;return i.
set(o,l),i}function d2(e,t){const r=e.reduce((a,o)=>a+o.length,0),s=new ArrayBuffer(44),n=new DataView(s);return Yn(n,0,
"RIFF"),n.setUint32(4,36+r*4,!0),Yn(n,8,"WAVE"),Yn(n,12,"fmt "),n.setUint32(16,16,!0),n.setUint16(20,3,!0),n.setUint16(22,
1,!0),n.setUint32(24,t,!0),n.setUint32(28,t*4,!0),n.setUint16(32,4,!0),n.setUint16(34,32,!0),Yn(n,36,"data"),n.setUint32(
40,r*4,!0),new Blob([s,...e.map(a=>a.buffer instanceof ArrayBuffer?new Uint8Array(a.buffer,a.byteOffset,a.byteLength):a.
slice())],{type:"audio/wav"})}function Yn(e,t,r){for(let s=0;s<r.length;++s)e.setUint8(t+s,r.charCodeAt(s))}var h2=class{constructor(e,t){
this.audio=e,this.sampling_rate=t}get data(){if(Array.isArray(this.audio)){if(this.audio.length===0)return new Float32Array(
0);if(this.audio.length===1)return this.audio[0];const e=this.audio.reduce((s,n)=>s+n.length,0),t=new Float32Array(e);let r=0;
for(const s of this.audio)t.set(s,r),r+=s.length;return t}else return this.audio}toBlob(){let e=this.audio;return e instanceof
Float32Array&&(e=[e]),d2(e,this.sampling_rate)}async save(e){return Sm(e,this.toBlob())}},f2=class extends ut{constructor(e){
super(e);const t=this.config.sampling_rate,r=er(257,this.config.num_mel_bins,20,Math.floor(t/2),t,null,"kaldi",!0);this.
mel_filters=r,this.window=fr(400,"hann",{periodic:!1}),this.mean=this.config.mean,this.std=this.config.std}async _extract_fbank_features(e,t){
return rr(e,this.window,400,160,{fft_length:512,power:2,center:!1,preemphasis:.97,mel_filters:this.mel_filters,log_mel:"\
log",mel_floor:1192092955078125e-22,remove_dc_offset:!0,max_num_frames:t,transpose:!0})}async _call(e){nt(e,"ASTFeatureE\
xtractor");const t=await this._extract_fbank_features(e,this.config.max_length);if(this.config.do_normalize){const r=this.
std*2,s=t.data;for(let n=0;n<s.length;++n)s[n]=(s[n]-this.mean)/r}return{input_values:t.unsqueeze_(0)}}},Im=class extends ut{async _call(e){
nt(e,"EncodecFeatureExtractor"),e instanceof Float64Array&&(e=new Float32Array(e));const t=this.config.feature_size;if(e.
length%t!==0)throw new Error(`The length of the audio data must be a multiple of the number of channels (${t}).`);const r=[
1,t,e.length/t];return{input_values:new G("float32",e,r)}}},_2=class extends ut{async _call(e){nt(e,"ChatterboxFeatureEx\
tractor"),e instanceof Float64Array&&(e=new Float32Array(e));const t=[1,e.length];return{input_values:new G("float32",e,
t)}}},p2=class extends ut{constructor(e){super(e),this.mel_filters=er(this.config.nb_frequency_bins,this.config.feature_size,
this.config.frequency_min,this.config.frequency_max,this.config.sampling_rate,null,"htk"),this.mel_filters_slaney=er(this.
config.nb_frequency_bins,this.config.feature_size,this.config.frequency_min,this.config.frequency_max,this.config.sampling_rate,
"slaney","slaney"),this.window=fr(this.config.fft_window_size,"hann")}async _get_input_mel(e,t,r,s){let n;const a=e.length-
t;if(a>0)if(r==="rand_trunc"){const o=Math.floor(Fa.random()*(a+1));e=e.subarray(o,o+t),n=await this._extract_fbank_features(
e,this.mel_filters_slaney,this.config.nb_max_samples)}else throw new Error(`Truncation strategy "${r}" not implemented`);else{
if(a<0){let o=new Float64Array(t);if(o.set(e),s==="repeat")for(let i=e.length;i<t;i+=e.length)o.set(e.subarray(0,Math.min(
e.length,t-i)),i);else if(s==="repeatpad")for(let i=e.length;i<-a;i+=e.length)o.set(e,i);e=o}if(r==="fusion")throw new Error(
`Truncation strategy "${r}" not implemented`);n=await this._extract_fbank_features(e,this.mel_filters_slaney,this.config.
nb_max_samples)}return n.unsqueeze_(0)}async _extract_fbank_features(e,t,r=null){return rr(e,this.window,this.config.fft_window_size,
this.config.hop_length,{power:2,mel_filters:t,log_mel:"dB",max_num_frames:r,do_pad:!1,transpose:!0})}async _call(e,{max_length:t=null}={}){
return nt(e,"ClapFeatureExtractor"),{input_features:(await this._get_input_mel(e,t??this.config.nb_max_samples,this.config.
truncation,this.config.padding)).unsqueeze_(0)}}},m2=1e-5,Lm=class extends ut{constructor(e){super(e),this.config.mel_filters??=
er(Math.floor(1+this.config.n_fft/2),this.config.feature_size,0,this.config.sampling_rate/2,this.config.sampling_rate,"s\
laney","slaney");const t=fr(this.config.win_length,"hann",{periodic:!1});this.window=new Float64Array(this.config.n_fft);
const r=Math.floor((this.config.n_fft-this.config.win_length)/2);this.window.set(t,r)}async _extract_fbank_features(e){const t=this.
config.preemphasis;e=new Float64Array(e);for(let s=e.length-1;s>=1;--s)e[s]-=t*e[s-1];return await rr(e,this.window,this.
window.length,this.config.hop_length,{fft_length:this.config.n_fft,power:2,mel_filters:this.config.mel_filters,log_mel:"\
log",mel_floor:-1/0,pad_mode:"constant",center:!0,transpose:!0,mel_offset:2**-24})}async _call(e){nt(e,"ParakeetFeatureE\
xtractor");const t=await this._extract_fbank_features(e),r=Math.floor((e.length+Math.floor(this.config.n_fft/2)*2-this.config.
n_fft)/this.config.hop_length),s=t.data;s.fill(0,r*t.dims[1]);const[n,a]=t.dims,o=new Float64Array(a),i=new Float64Array(
a);for(let d=0;d<r;++d){const h=d*a;for(let _=0;_<a;++_){const p=s[h+_];o[_]+=p,i[_]+=p*p}}const l=r>1?r-1:1;for(let d=0;d<
a;++d){const h=o[d]/r,_=(i[d]-r*h*h)/l,w=1/(Math.sqrt(_)+m2);for(let v=0;v<r;++v){const y=v*a+d;s[y]=(s[y]-h)*w}}const c=new BigInt64Array(
n);return c.fill(1n,0,r),{input_features:t.unsqueeze_(0),attention_mask:new G("int64",c,[1,n])}}},g2=class extends Lm{_apply_dither(e){
const t=this.config.dither??0;if(t<=0)return e;const r=new Pa(e.length);for(let s=0;s<e.length;++s)e[s]+=t*r.gauss();return e}split_audio(e){
const t=this.config.max_audio_clip_s??35,r=this.config.overlap_chunk_second??5,s=this.config.min_energy_window_samples??
1600,n=this.config.sampling_rate,a=Math.max(1,Math.round(t*n)),o=Math.max(1,Math.round(r*n));if(e.length<=a)return[e];const i=[];
let l=0;const c=e.length;for(;l<c;){if(l+a>=c){i.push(e.slice(l,c));break}const d=Math.max(l,l+a-o),h=Math.min(l+a,c);let _;
h<=d?_=l+a:_=this._find_split_point_energy(e,d,h,s),_=Math.max(l+1,Math.min(_,c)),i.push(e.slice(l,_)),l=_}return i}_find_split_point_energy(e,t,r,s){
const n=r-t;if(n<=s)return Math.floor((t+r)/2);let a=1/0,o=t;const i=n-s;for(let l=0;l<=i;l+=s){let c=0;for(let d=0;d<s;++d){
const h=e[t+l+d];c+=h*h}c=Math.sqrt(c/s),c<a&&(a=c,o=t+l)}return o}async _call(e){nt(e,"CohereAsrFeatureExtractor");const t=new Float64Array(
e);return this._apply_dither(t),super._call(t)}},Om=class extends Im{},Nm=class extends ut{constructor(e){super(e);const{
fft_length:t,feature_size:r,min_frequency:s,max_frequency:n,sampling_rate:a,frame_length:o}=this.config,i=er(Math.floor(
1+t/2),r,s,n,a,null,"htk",!1);this.mel_filters=i,this.window=fr(o,"hann")}async _extract_fbank_features(e,t){return rr(e,
this.window,this.config.frame_length,this.config.hop_length,{fft_length:this.config.fft_length,center:!1,onesided:!0,preemphasis:this.
config.preemphasis,preemphasis_htk_flavor:this.config.preemphasis_htk_flavor,mel_filters:this.mel_filters,log_mel:"log",
mel_floor:this.config.mel_floor,remove_dc_offset:!1,transpose:!0})}async _call(e,{max_length:t=48e4,truncation:r=!0,padding:s=!0,
pad_to_multiple_of:n=128}={}){if(nt(e,"Gemma3nAudioFeatureExtractor"),r&&e.length>t&&(e=e.slice(0,t)),s&&e.length%n!==0){
const i=n-e.length%n,l=new Float64Array(e.length+i);l.set(e),this.config.padding_value!==0&&l.fill(this.config.padding_value,
e.length),e=l}const a=await this._extract_fbank_features(e,this.config.max_length),o=ct([1,a.dims[0]],!0);return{input_features:a.
unsqueeze_(0),input_features_mask:o}}},Dm=class extends Nm{async _extract_fbank_features(e,t){const{frame_length:r,hop_length:s,
fft_length:n}=this.config,a=Math.floor(r/2),o=Math.floor((e.length+a-(r+1))/s)+1;return rr(e,this.window,r,s,{fft_length:n,
center:!0,pad_mode:"semicausal",onesided:!0,preemphasis:this.config.preemphasis,preemphasis_htk_flavor:this.config.preemphasis_htk_flavor,
mel_filters:this.mel_filters,log_mel:"log",mel_floor:this.config.mel_floor,mel_floor_mode:"add",remove_dc_offset:!1,transpose:!0,
max_num_frames:o})}async _call(e,t={}){nt(e,"Gemma4AudioFeatureExtractor");const r=e.length,s=await super._call(e,t),{input_features:n}=s,
[,a,o]=n.dims,{frame_length:i,hop_length:l}=this.config,c=Math.floor(i/2),d=i+1,h=new Uint8Array(r+c+(t.pad_to_multiple_of??
128));h.fill(1,c,c+r);const _=new Uint8Array(a);for(let w=0;w<a;++w)_[w]=h[w*l+d-1]?1:0;const p=n.data;for(let w=0;w<a;++w)
_[w]||p.fill(0,w*o,(w+1)*o);return s.input_features_mask=new G("bool",_,[1,a]),s}},w2=class extends ut{constructor(e){super(
e);const{n_fft:t,win_length:r,n_mels:s,sample_rate:n}=e.melspec_kwargs;this.mel_filters=er(Math.floor(1+t/2),s,0,n/2,n,null,
"htk");const a=fr(r,"hann");this.window=new Float64Array(t);const o=Math.floor((t-r)/2);this.window.set(a,o)}async _call(e){
nt(e,"GraniteSpeechFeatureExtractor");const{n_fft:t,hop_length:r,n_mels:s}=this.config.melspec_kwargs,n=Math.floor(e.length/
r)+1,a=n-n%2;return{input_features:(await rr(e,this.window,t,r,{power:2,mel_filters:this.mel_filters,log_mel:"log10_max_\
norm",transpose:!0,max_num_frames:a,do_pad:!1})).view(-1,2*s).unsqueeze_(0)}}},v2=class extends ut{async _call(e){nt(e,"\
MoonshineFeatureExtractor"),e instanceof Float64Array&&(e=new Float32Array(e));const t=[1,e.length];return{input_values:new G(
"float32",e,t)}}},zm=class extends ut{async _call(e){nt(e,"PyAnnoteFeatureExtractor"),e instanceof Float64Array&&(e=new Float32Array(
e));const t=[1,1,e.length];return{input_values:new G("float32",e,t)}}samples_to_frames(e){return(e-this.config.offset)/this.
config.step}post_process_speaker_diarization(e,t){const r=t/this.samples_to_frames(t)/this.config.sampling_rate,s=[];for(const n of e.
tolist()){const a=[];let o=-1;for(let i=0;i<n.length;++i){const l=st(n[i]),[c,d]=We(l),[h,_]=[i,i+1];d!==o?(o=d,a.push({
id:d,start:h,end:_,score:c})):(a.at(-1).end=_,a.at(-1).score+=c)}s.push(a.map(({id:i,start:l,end:c,score:d})=>({id:i,start:l*
r,end:c*r,confidence:d/(c-l)})))}return s}},y2=class extends ut{constructor(e){super(e);const t=this.config.sampling_rate,
r=er(257,this.config.num_mel_bins,20,Math.floor(t/2),t,null,"kaldi",!0);this.mel_filters=r,this.window=fr(400,"povey",{periodic:!1})}async _extract_fbank_features(e,t){
return e=e.map(r=>r*32768),rr(e,this.window,400,160,{fft_length:512,power:2,center:!1,preemphasis:.97,mel_filters:this.mel_filters,
log_mel:"log",mel_floor:1192092955078125e-22,remove_dc_offset:!0,max_num_frames:t,transpose:!0})}async _call(e,{padding:t=!0,
pad_to_multiple_of:r=2,do_normalize_per_mel_bins:s=!0,return_attention_mask:n=!0}={}){nt(e,"SeamlessM4TFeatureExtractor");
let a=await this._extract_fbank_features(e,this.config.max_length);if(s){const[p,w]=a.dims,v=a.data;for(let y=0;y<w;++y){
let b=0;for(let C=0;C<p;++C)b+=v[C*w+y];const k=b/p;let A=0;for(let C=0;C<p;++C)A+=(v[C*w+y]-k)**2;A/=p-1;const E=Math.sqrt(
A+1e-7);for(let C=0;C<p;++C){const N=C*w+y;v[N]=(v[N]-k)/E}}}let o;if(t){const[p,w]=a.dims,v=a.data,y=p%r;if(y>0){const b=new Float32Array(
w*(p+y));b.set(v),b.fill(this.config.padding_value,v.length);const k=p+y;a=new G(a.type,b,[k,w]),n&&(o=new G("int64",new BigInt64Array(
k),[1,k]),o.data.fill(1n,0,p))}}const[i,l]=a.dims,c=this.config.stride;if(i%c!==0)throw new Error(`The number of frames \
(${i}) must be a multiple of the stride (${c}).`);const h=a.view(1,Math.floor(i/c),l*c),_={input_features:h};if(n){const p=h.
dims[1],w=new BigInt64Array(p);if(o){const v=o.data;for(let y=1,b=0;y<i;y+=c,++b)w[b]=v[y]}else w.fill(1n);_.attention_mask=
new G("int64",w,[1,p])}return _}},b2=class extends Om{},M2=class extends ut{},x2=class extends ut{_zero_mean_unit_var_norm(e){
const r=e.reduce((n,a)=>n+a,0)/e.length,s=e.reduce((n,a)=>n+(a-r)**2,0)/e.length;return e.map(n=>(n-r)/Math.sqrt(s+1e-7))}async _call(e){
nt(e,"Wav2Vec2FeatureExtractor"),e instanceof Float64Array&&(e=new Float32Array(e));let t=e;this.config.do_normalize&&(t=
this._zero_mean_unit_var_norm(t));const r=[1,t.length];return{input_values:new G("float32",t,r),attention_mask:new G("in\
t64",new BigInt64Array(t.length).fill(1n),r)}}},k2=class extends ut{constructor(e){super(e);const t=this.config.sampling_rate,
r=er(257,this.config.num_mel_bins,20,Math.floor(t/2),t,null,"kaldi",!0);this.mel_filters=r,this.window=fr(400,"hamming",
{periodic:!1}),this.min_num_frames=this.config.min_num_frames}async _extract_fbank_features(e){return e=e.map(t=>t*32768),
rr(e,this.window,400,160,{fft_length:512,power:2,center:!1,preemphasis:.97,mel_filters:this.mel_filters,log_mel:"log",mel_floor:1192092955078125e-22,
remove_dc_offset:!0,transpose:!0,min_num_frames:this.min_num_frames})}async _call(e){nt(e,"WeSpeakerFeatureExtractor");const t=(await this.
_extract_fbank_features(e)).unsqueeze_(0);if(this.config.fbank_centering_span===null){const r=t.mean(1).data,s=t.data,[n,
a,o]=t.dims;for(let i=0;i<n;++i){const l=i*a*o,c=i*o;for(let d=0;d<a;++d){const h=l+d*o;for(let _=0;_<o;++_)s[h+_]-=r[c+
_]}}}return{input_features:t}}},T2=class extends ut{constructor(e){super(e),this.config.mel_filters??=er(Math.floor(1+this.
config.n_fft/2),this.config.feature_size,0,8e3,this.config.sampling_rate,"slaney","slaney"),this.window=fr(this.config.n_fft,
"hann")}async _extract_fbank_features(e,{center:t=!0}={}){const{n_fft:r,hop_length:s,mel_filters:n,global_log_mel_max:a}=this.
config,o=Math.floor(t?e.length/s:(e.length-r)/s);return await rr(e,this.window,r,s,{power:2,mel_filters:n,log_mel:"log10\
_max_norm",max_log_mel:a,center:t,max_num_frames:o,do_pad:!1})}async _call(e,{center:t=!0}={}){return nt(e,"VoxtralRealt\
imeFeatureExtractor"),{input_features:(await this._extract_fbank_features(e,{center:t})).unsqueeze_(0)}}},E2=class extends ut{constructor(e){
super(e),this.config.mel_filters??=er(Math.floor(1+this.config.n_fft/2),this.config.feature_size,0,8e3,this.config.sampling_rate,
"slaney","slaney"),this.window=fr(this.config.n_fft,"hann")}async _extract_fbank_features(e){return await rr(e,this.window,
this.config.n_fft,this.config.hop_length,{power:2,mel_filters:this.config.mel_filters,log_mel:"log10_max_norm",max_num_frames:Math.
min(Math.floor(e.length/this.config.hop_length),this.config.nb_max_frames)})}async _call(e,{max_length:t=null}={}){nt(e,
"WhisperFeatureExtractor");let r;const s=t??this.config.n_samples;return e.length>s?(e.length>this.config.n_samples&&de.
warn("Attempting to extract features for audio longer than 30 seconds. If using a pipeline to extract transcript from a \
long audio clip, remember to specify `chunk_length_s` and/or `stride_length_s`."),r=e.slice(0,s)):(r=new Float32Array(s),
r.set(e)),{input_features:(await this._extract_fbank_features(r)).unsqueeze_(0)}}},St=class{static async from_pretrained(e,t={}){
const r=await tr(e,Em,!0,t),s=r.feature_extractor_type,n=fl[s];if(!n)throw new Error(`Unknown feature_extractor_type: '${s}\
'. Please report this at ${Ia}.`);return new n(r)}},A2=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e,t=null){
const r=this.tokenizer(e),s=t?await this.feature_extractor(t):{};return{...r,...s}}},C2=new Set(["ja","zh"]),S2=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!0;get_decoder_prompt_ids(e="\
en"){const t=["▁","<|startofcontext|>","<|startoftranscript|>","<|emo:undefined|>",`<|${e}|>`,`<|${e}|>`,"<|pnc|>","<|\
noitn|>","<|notimestamp|>","<|nodiarize|>"];return this.tokenizer.convert_tokens_to_ids(t)}static join_chunks(e,t="en"){
const r=e.filter(a=>a&&a.trim());if(r.length===0)return"";const s=C2.has(t)?"":" ";return[r[0].trimEnd(),...r.slice(1).map(
a=>a.trim())].join(s)}async _call(e){return await this.feature_extractor(e)}},Ti={},Gr,Bm,xr;if(fe.IS_WEB_ENV)Gr=(e,t)=>{
if(!self.OffscreenCanvas)throw new Error("OffscreenCanvas not supported by this environment.");return new self.OffscreenCanvas(
e,t)},xr=self.createImageBitmap,Bm=self.ImageData;else if(Ti)xr=async e=>{const r=(await e.metadata()).channels,{data:s,
info:n}=await e.rotate().raw().toBuffer({resolveWithObject:!0}),a=new Mt(new Uint8ClampedArray(s),n.width,n.height,n.channels);
return r!==void 0&&r!==n.channels&&a.convert(r),a};else throw new Error("Unable to load image processing library.");var P2={
0:"nearest",1:"lanczos",2:"bilinear",3:"bicubic",4:"box",5:"hamming"},F2=new Map([["png","image/png"],["jpg","image/jpeg"],
["jpeg","image/jpeg"],["gif","image/gif"]]),Mt=class Kt{constructor(t,r,s,n){this.data=t,this.width=r,this.height=s,this.
channels=n}get size(){return[this.width,this.height]}static async read(t){if(t instanceof Kt)return t;if(typeof t=="stri\
ng"||t instanceof URL)return await this.fromURL(t);if(t instanceof Blob)return await this.fromBlob(t);if(typeof HTMLCanvasElement<
"u"&&t instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&t instanceof OffscreenCanvas)return this.fromCanvas(t);
throw new Error(`Unsupported input type: ${typeof t}`)}static fromCanvas(t){if(!fe.IS_WEB_ENV)throw new Error("fromCanva\
s() is only supported in browser environments.");const s=t.getContext("2d").getImageData(0,0,t.width,t.height).data;return new Kt(
s,t.width,t.height,4)}static async fromURL(t){const r=await an(t);if(r.status!==200)throw new Error(`Unable to read imag\
e from "${t}" (${r.status} ${r.statusText})`);const s=await r.blob();return this.fromBlob(s)}static async fromBlob(t){if(fe.
IS_WEB_ENV){const r=await xr(t),s=Gr(r.width,r.height).getContext("2d");return s.drawImage(r,0,0),new this(s.getImageData(
0,0,r.width,r.height).data,r.width,r.height,4)}else{const r=Ti(await t.arrayBuffer());return await xr(r)}}static fromTensor(t,r="\
CHW"){if(t.dims.length!==3)throw new Error(`Tensor should have 3 dimensions, but has ${t.dims.length} dimensions.`);if(r===
"CHW")t=t.permute(1,2,0);else if(r!=="HWC")throw new Error(`Unsupported channel format: ${r}`);if(!(t.data instanceof Uint8ClampedArray||
t.data instanceof Uint8Array))throw new Error(`Unsupported tensor type: ${t.type}`);switch(t.dims[2]){case 1:case 2:case 3:case 4:
return new Kt(t.data,t.dims[1],t.dims[0],t.dims[2]);default:throw new Error(`Unsupported number of channels: ${t.dims[2]}`)}}grayscale(){
if(this.channels===1)return this;const t=new Uint8ClampedArray(this.width*this.height*1);switch(this.channels){case 3:case 4:
for(let r=0,s=0;r<this.data.length;r+=this.channels){const n=this.data[r],a=this.data[r+1],o=this.data[r+2];t[s++]=Math.
round(.2989*n+.587*a+.114*o)}break;default:throw new Error(`Conversion failed due to unsupported number of channels: ${this.
channels}`)}return this._update(t,this.width,this.height,1)}rgb(){if(this.channels===3)return this;const t=new Uint8ClampedArray(
this.width*this.height*3);switch(this.channels){case 1:for(let r=0,s=0;r<this.data.length;++r)t[s++]=this.data[r],t[s++]=
this.data[r],t[s++]=this.data[r];break;case 4:for(let r=0,s=0;r<this.data.length;r+=4)t[s++]=this.data[r],t[s++]=this.data[r+
1],t[s++]=this.data[r+2];break;default:throw new Error(`Conversion failed due to unsupported number of channels: ${this.
channels}`)}return this._update(t,this.width,this.height,3)}rgba(){if(this.channels===4)return this;const t=new Uint8ClampedArray(
this.width*this.height*4);switch(this.channels){case 1:for(let r=0,s=0;r<this.data.length;++r)t[s++]=this.data[r],t[s++]=
this.data[r],t[s++]=this.data[r],t[s++]=255;break;case 3:for(let r=0,s=0;r<this.data.length;r+=3)t[s++]=this.data[r],t[s++]=
this.data[r+1],t[s++]=this.data[r+2],t[s++]=255;break;default:throw new Error(`Conversion failed due to unsupported numb\
er of channels: ${this.channels}`)}return this._update(t,this.width,this.height,4)}putAlpha(t){if(t.width!==this.width||
t.height!==this.height)throw new Error(`Expected mask size to be ${this.width}x${this.height}, but got ${t.width}x${t.height}`);
if(t.channels!==1)throw new Error(`Expected mask to have 1 channel, but got ${t.channels}`);const r=this.data,s=t.data,n=this.
width*this.height;if(this.channels===3){const a=new Uint8ClampedArray(n*4);for(let o=0,i=0,l=0;o<n;++o)a[l++]=r[i++],a[l++]=
r[i++],a[l++]=r[i++],a[l++]=s[o];return this._update(a,this.width,this.height,4)}else if(this.channels===4){for(let a=0;a<
n;++a)r[4*a+3]=s[a];return this}throw new Error(`Expected image to have 3 or 4 channels, but got ${this.channels}`)}async resize(t,r,{
resample:s=2}={}){if(this.width===t&&this.height===r)return this;let n=P2[s]??s;const a=Ff(t),o=Ff(r);if(a&&o)return this;
if(a?t=r/this.height*this.width:o&&(r=t/this.width*this.height),fe.IS_WEB_ENV){const i=this.channels,l=this.toCanvas(),c=Gr(
t,r).getContext("2d");return c.drawImage(l,0,0,t,r),new Kt(c.getImageData(0,0,t,r).data,t,r,4).convert(i)}else{let i=this.
toSharp();switch(n){case"box":case"hamming":(n==="box"||n==="hamming")&&(de.warn(`Resampling method ${n} is not yet supp\
orted. Using bilinear instead.`),n="bilinear");case"nearest":case"bilinear":case"bicubic":i=i.affine([t/this.width,0,0,r/
this.height],{interpolator:n});break;case"lanczos":i=i.resize({width:t,height:r,fit:"fill",kernel:"lanczos3"});break;default:
throw new Error(`Resampling method ${n} is not supported.`)}return await xr(i)}}async pad([t,r,s,n]){if(t=Math.max(t,0),
r=Math.max(r,0),s=Math.max(s,0),n=Math.max(n,0),t===0&&r===0&&s===0&&n===0)return this;if(fe.IS_WEB_ENV){const a=this.channels,
o=this.toCanvas(),i=this.width+t+r,l=this.height+s+n,c=Gr(i,l).getContext("2d");return c.drawImage(o,0,0,this.width,this.
height,t,s,this.width,this.height),new Kt(c.getImageData(0,0,i,l).data,i,l,4).convert(a)}else{const a=this.toSharp().extend(
{left:t,right:r,top:s,bottom:n});return await xr(a)}}async crop([t,r,s,n]){if(t=Math.max(t,0),r=Math.max(r,0),s=Math.min(
s,this.width-1),n=Math.min(n,this.height-1),t===0&&r===0&&s===this.width-1&&n===this.height-1)return this;const a=s-t+1,
o=n-r+1;if(fe.IS_WEB_ENV){const i=this.channels,l=this.toCanvas(),c=Gr(a,o).getContext("2d");return c.drawImage(l,t,r,a,
o,0,0,a,o),new Kt(c.getImageData(0,0,a,o).data,a,o,4).convert(i)}else{const i=this.toSharp().extract({left:t,top:r,width:a,
height:o});return await xr(i)}}async center_crop(t,r){if(this.width===t&&this.height===r)return this;const s=(this.width-
t)/2,n=(this.height-r)/2;if(fe.IS_WEB_ENV){const a=this.channels,o=this.toCanvas(),i=Gr(t,r).getContext("2d");let l=0,c=0,
d=0,h=0;return s>=0?l=s:d=-s,n>=0?c=n:h=-n,i.drawImage(o,l,c,t,r,d,h,t,r),new Kt(i.getImageData(0,0,t,r).data,t,r,4).convert(
a)}else{let a=this.toSharp();if(s>=0&&n>=0)a=a.extract({left:Math.floor(s),top:Math.floor(n),width:t,height:r});else if(s<=
0&&n<=0){const o=Math.floor(-n),i=Math.floor(-s);a=a.extend({top:o,left:i,right:t-this.width-i,bottom:r-this.height-o})}else{
let o=[0,0],i=0;n<0?(o[0]=Math.floor(-n),o[1]=r-this.height-o[0]):i=Math.floor(n);let l=[0,0],c=0;s<0?(l[0]=Math.floor(-s),
l[1]=t-this.width-l[0]):c=Math.floor(s),a=a.extend({top:o[0],bottom:o[1],left:l[0],right:l[1]}).extract({left:c,top:i,width:t,
height:r})}return await xr(a)}}async toBlob(t="image/png",r=1){if(!fe.IS_WEB_ENV)throw new Error("toBlob() is only suppo\
rted in browser environments.");return await this.toCanvas().convertToBlob({type:t,quality:r})}toTensor(t="CHW"){let r=new G(
"uint8",new Uint8Array(this.data),[this.height,this.width,this.channels]);if(t!=="HWC")if(t==="CHW")r=r.permute(2,0,1);else
throw new Error(`Unsupported channel format: ${t}`);return r}toCanvas(){if(!fe.IS_WEB_ENV)throw new Error("toCanvas() is\
 only supported in browser environments.");const t=this.clone().rgba(),r=Gr(t.width,t.height),s=new Bm(t.data,t.width,t.
height);return r.getContext("2d").putImageData(s,0,0),r}split(){const{data:t,width:r,height:s,channels:n}=this,a=t.constructor,
o=t.length/n,i=Array.from({length:n},()=>new a(o));for(let l=0;l<o;++l){const c=n*l;for(let d=0;d<n;++d)i[d][l]=t[c+d]}return i.
map(l=>new Kt(l,r,s,1))}_update(t,r,s,n=null){return this.data=t,this.width=r,this.height=s,n!==null&&(this.channels=n),
this}clone(){return new Kt(this.data.slice(),this.width,this.height,this.channels)}convert(t){if(this.channels===t)return this;
switch(t){case 1:this.grayscale();break;case 3:this.rgb();break;case 4:this.rgba();break;default:throw new Error(`Conver\
sion failed due to unsupported number of channels: ${this.channels}`)}return this}async save(t){if(fe.IS_WEB_ENV){if(fe.
IS_WEBWORKER_ENV)throw new Error("Unable to save an image from a Web Worker.");const r=t.split(".").pop().toLowerCase(),
s=F2.get(r)??"image/png",n=await this.toBlob(s);return Sm(t,n)}else if(fe.IS_FS_AVAILABLE)await this.toSharp().toFile(t);else
throw new Error("Unable to save the image because filesystem is disabled in this environment.")}toSharp(){if(fe.IS_WEB_ENV)
throw new Error("toSharp() is only supported in server-side environments.");return Ti(this.data,{raw:{width:this.width,height:this.
height,channels:this.channels}})}},uz=Mt.read.bind(Mt);function I2(e,t,r,s,n){const a=s*r**2,o=Math.sqrt(a/(e*t)),i=n*r;
let l=Math.floor(o*e/i)*i,c=Math.floor(o*t/i)*i;if(l===0&&c===0)throw new Error(`Attempting to resize to a 0 x 0 image. \
Resized height should be divisible by \`pooling_kernel_size * patch_size\`=${i}.`);const d=Math.floor(s/n**2)*i;return l===
0?(l=i,c=Math.min(Math.floor(t/e)*i,d)):c===0&&(c=i,l=Math.min(Math.floor(e/t)*i,d)),[l,c]}function L2(e,t,r,s,n,a,o){const i=Math.
floor(t/n),l=Math.floor(r/n),c=i*l,d=n*n*s,h=new Float32Array(a*d);let _=0;for(let v=0;v<i;++v)for(let y=0;y<l;++y)for(let b=0;b<
n;++b){const k=(v*n+b)*r*s+y*n*s;for(let A=0;A<n;++A){const E=k+A*s;for(let C=0;C<s;++C)h[_++]=e[E+C]}}const p=new BigInt64Array(
a*2).fill(-1n);let w=0;for(let v=0;v<i;++v)for(let y=0;y<l;++y)p[w++]=BigInt(y),p[w++]=BigInt(v);return{patches:new G("f\
loat32",h,[a,d]),positions:new G("int64",p,[a,2]),num_soft_tokens:Math.floor(c/o**2)}}var _l=class extends ft{constructor(e){
super(),this.config=e,this.patch_size=e.patch_size??16,this.max_soft_tokens=e.max_soft_tokens??280,this.pooling_kernel_size=
e.pooling_kernel_size??3,this.resample=e.resample??3,this.rescale_factor=e.rescale_factor??1/255,this.do_rescale=e.do_rescale??
!0,this.do_resize=e.do_resize??!0,this.do_convert_rgb=e.do_convert_rgb??!0}async _call(e){Array.isArray(e)||(e=[e]);const{
patch_size:t,pooling_kernel_size:r}=this,s=this.max_soft_tokens*r**2,n=[],a=[],o=[];for(let i of e){if(this.do_convert_rgb&&
(i=i.rgb()),this.do_resize){const[_,p]=I2(i.height,i.width,t,s,r);(_!==i.height||p!==i.width)&&(i=await i.resize(p,_,{resample:this.
resample}))}const l=Float32Array.from(i.data);if(this.do_rescale)for(let _=0;_<l.length;++_)l[_]*=this.rescale_factor;const{
patches:c,positions:d,num_soft_tokens:h}=L2(l,i.height,i.width,i.channels,t,s,r);n.push(c),a.push(d),o.push(h)}return{pixel_values:ur(
n,0),image_position_ids:ur(a,0),num_soft_tokens_per_image:o}}},Rm=class extends Te{static uses_processor_config=!0;static uses_chat_template_file=!0;constructor(e,t,r){
super(e,t,r),this.audio_ms_per_token=this.config.audio_ms_per_token??40,this.audio_seq_length=this.config.audio_seq_length??
750,this.image_seq_length=this.config.image_seq_length??280;const{audio_token:s,boa_token:n,eoa_token:a,image_token:o,boi_token:i,
eoi_token:l}=this.tokenizer.config;this.audio_token=s,this.boa_token=n,this.eoa_token=a,this.image_token=o,this.boi_token=
i,this.eoi_token=l}static async from_pretrained(e,t={}){const[r,s,n]=await Promise.all([tr(e,Am,!0,t),ke.from_pretrained(
e,t),nl(e,Cm,!1,t)]),a={tokenizer:s};return r.image_processor&&(a.image_processor=new _l(r.image_processor)),r.feature_extractor&&
(a.feature_extractor=new Dm(r.feature_extractor)),new this(r,a,n)}_compute_audio_num_tokens(e,t){const r=Math.round(t*20/
1e3),s=Math.round(t*10/1e3),n=Math.floor(r/2);let a=Math.floor((e+n-r-1)/s)+1;if(a<=0)return 0;for(let o=0;o<2;++o)a=Math.
floor((a-1)/2)+1;return Math.min(a,this.audio_seq_length)}async _call(e,t=null,r=null,s={}){typeof e=="string"&&(e=[e]);
let n;if(t){n=await this.image_processor(t,s);const o=n.num_soft_tokens_per_image;let i=0;e=e.map(l=>l.replaceAll(this.image_token,
()=>`

${this.boi_token}${this.image_token.repeat(o[i++])}${this.eoi_token}

`))}let a;if(r){const o=Array.isArray(r)?r:[r];a=await this.feature_extractor(o[0],s);const i=this.feature_extractor.config.
sampling_rate??16e3;let l=0;e=e.map(c=>c.replaceAll(this.audio_token,()=>`

${this.boa_token}${this.audio_token.repeat(this._compute_audio_num_tokens(o[l++].length,i))}${this.eoa_token}

`))}return{...this.tokenizer(e,s),...n,...a}}},$m=class extends ft{constructor(e){super(),this.config=e,this.frame_processor=
new _l(e),this.max_frames=e.max_frames??32,this.overflow_strategy=e.overflow_strategy??"uniform"}sample_frames(e){const t=e.
length,{max_frames:r}=this;if(t<=r)return e;if(this.overflow_strategy==="truncate")return e.slice(0,r);const s=r>1?(t-1)/
(r-1):0;return Array.from({length:r},(n,a)=>e[a>0&&a===r-1?t-1:Math.floor(a*s)])}async _call(e){Array.isArray(e)||(e=[e]);
const t=e.map(o=>this.sample_frames(o.frames.map(i=>i.image))),{pixel_values:r,image_position_ids:s,num_soft_tokens_per_image:n}=await this.
frame_processor(t.flat());let a=0;return{pixel_values_videos:r,video_position_ids:s,num_frames_per_video:t.map(o=>o.length),
num_soft_tokens_per_video:t.map(o=>n[(a+=o.length)-1])}}};function oi(e,t){return Array.isArray(e)?e.every(r=>Array.isArray(
r))?e:t?[e]:e.map(r=>[r]):[[e]]}function O2(e,t,r){let s=0;if(e=e.map(n=>n.replaceAll(t,()=>r[s++]??"")),s!==r.length)throw new Error(
`Found ${s} ${t} tokens in the text, but ${r.length} inputs were passed.`);return e}var N2=class extends Rm{constructor(e,t,r){
super(e,t,r),this.video_token=this.tokenizer.config.video_token,this.video_processor=e.video_processor&&new $m(e.video_processor)}async _call(e,t=null,r=null,s=null,n={}){
const a=[[this.image_token,t&&oi(t,!0)],[this.video_token,s&&oi(s,!1)],[this.audio_token,r&&oi(r,!1)]];if(e==null){const E=a.
filter(([,N])=>N),C=E[0]?.[1].length;if(E.some(([,N])=>N.length!==C))throw new Error("Received a different number of sam\
ples per modality.");e=Array.from({length:C},(N,M)=>E.flatMap(([$,R])=>Array(R[M].length).fill($)).join(" "))}else typeof e==
"string"&&(e=[e]);const[o,i,l]=a.map(([,E])=>E?.flat()),c=o&&await this.image_processor(o),d=i&&await this.video_processor(
i),h=l&&await this._process_audio(l),{image_token:_,video_token:p,audio_token:w,boi_token:v,eoi_token:y,boa_token:b,eoa_token:k}=this,
A={[_]:c?.num_soft_tokens_per_image.map(E=>v+_.repeat(E)+y),[p]:d?.num_soft_tokens_per_video.map((E,C)=>(v+p.repeat(E)+y).
repeat(d.num_frames_per_video[C])),[w]:h?.num_soft_tokens_per_audio.map(E=>b+w.repeat(E)+k)};for(const[E,C]of Object.entries(
A))e=O2(e,E,C??[]);return{...this.tokenizer(e,{padding:!0,...n}),...c,...d,...h}}async _process_audio(e){const t=[];for(const o of e)
t.push(await this.feature_extractor(o));const r=Math.max(...t.map(o=>o.input_features.dims[1])),s=t[0].input_features.dims[2],
n=new Float32Array(e.length*r*s),a=new Uint8Array(e.length*r);return t.forEach((o,i)=>{n.set(o.input_features.data,i*r*s),
a.set(o.input_features_mask.data,i*r)}),{input_features:new G("float32",n,[e.length,r,s]),input_features_mask:new G("boo\
l",a,[e.length,r]),num_soft_tokens_per_audio:t.map(({input_features_mask:{data:o}})=>{let i=0;for(let l=0;l<o.length;l+=
4)i+=Number(o[l]);return i})}}};function w_(e,t,r=0,s=null){const n=e/t;let a=OT(n)*t;return s!==null&&a>s&&(a=Math.floor(
n)*t),a<r&&(a=Math.ceil(n)*t),a}function v_([e,t],r){return[Math.max(Math.floor(e/r),1)*r,Math.max(Math.floor(t/r),1)*r]}
function Gm([e,t,r,s]){return[e-r/2,t-s/2,e+r/2,t+s/2]}function La(e,t=.5,r=null,s=!1){const n=e.logits,a=e.pred_boxes,[
o,i,l]=n.dims;if(r!==null&&r.length!==o)throw Error("Make sure that you pass in as many target sizes as the batch dimens\
ion of the logits");let c=[];for(let d=0;d<o;++d){let h=r!==null?r[d]:null,_={boxes:[],classes:[],scores:[]},p=n[d],w=a[d];
for(let v=0;v<i;++v){let y=p[v],b=[],k;if(s){k=y.sigmoid().data;for(let A=0;A<k.length;++A)k[A]>t&&b.push(A)}else{let A=We(
y.data)[1];if(A===l-1||(k=st(y.data),k[A]<t))continue;b.push(A)}for(const A of b){let E=w[v].data;E=Gm(E),h!==null&&(E=E.
map((C,N)=>C*h[(N+1)%2])),_.boxes.push(E),_.classes.push(A),_.scores.push(k[A])}}c.push(_)}return c}function Vm(e,t=null){
const r=e.logits,s=r.dims[0];if(t!==null&&t.length!==s)throw Error("Make sure that you pass in as many target sizes as t\
he batch dimension of the logits");const n=[];for(let a=0;a<s;++a){const o=t!==null?t[a]:null;let i=r[a];o!==null&&(i=wm(
i,o,"bilinear",!1));const[l,c]=o??i.dims.slice(-2),d=new G("int32",new Int32Array(l*c),[l,c]),h=i[0].data,_=d.data;for(let v=1;v<
i.dims[0];++v){const y=i[v].data;for(let b=0;b<y.length;++b)y[b]>h[b]&&(h[b]=y[b],_[b]=v)}const p=new Array(i.dims[0]);for(let v=0;v<
_.length;++v){const y=_[v];p[y]=y}const w=p.filter(v=>v!==void 0);n.push({segmentation:d,labels:w})}return n}function D2(e,t,r,s){
const n=[],a=[],o=[];for(let i=0;i<e.dims[0];++i){const l=e[i],c=t[i],d=We(l.data)[1];if(d===s)continue;const _=st(l.data)[d];
_>r&&(n.push(c),a.push(_),o.push(d))}return[n,a,o]}function z2(e,t,r,s=.5,n=.8){const a=[];let o=0,i=0;const l=t[r].data;
for(let d=0;d<e.length;++d)e[d]===r&&(a.push(d),++o),l[d]>=s&&++i;let c=o>0&&i>0;return c&&(c=o/i>n),[c,a]}function B2(e,t,r,s,n,a=null,o=null){
const[i,l]=o??e[0].dims,c=new G("int32",new Int32Array(i*l),[i,l]),d=[];if(o!==null)for(let v=0;v<e.length;++v)e[v]=wm(e[v],
o,"bilinear",!1);const h=new Int32Array(e[0].data.length),_=new Float32Array(e[0].data.length);for(let v=0;v<e.length;++v){
let y=t[v];const b=e[v].data;for(let k=0;k<b.length;++k)b[k]*=y,b[k]>_[k]&&(h[k]=v,_[k]=b[k])}let p=0;const w=c.data;for(let v=0;v<
r.length;++v){const y=r[v],[b,k]=z2(h,e,v,s,n);if(b){++p;for(const A of k)w[A]=p;d.push({id:p,label_id:y,score:t[v]})}}return[
c,d]}function pl(e,t,r=28,s=3136,n=784*1280,a=1){if(e<r||t<r){const l=Math.max(r/e,r/t);e=Math.round(e*l),t=Math.round(t*
l)}if(Math.max(e,t)/Math.min(e,t)>200)throw new Error(`absolute aspect ratio must be smaller than 200, got ${Math.max(e,
t)/Math.min(e,t)}`);let o=Math.round(e/r)*r,i=Math.round(t/r)*r;if(a*o*i>n){const l=Math.sqrt(a*e*t/n);o=Math.max(r,Math.
floor(e/l/r)*r),i=Math.max(r,Math.floor(t/l/r)*r)}else if(a*o*i<s){const l=Math.sqrt(s/(a*e*t));o=Math.ceil(e*l/r)*r,i=Math.
ceil(t*l/r)*r}return[i,o]}function Um(e,t=.5,r=.5,s=.8,n=null,a=null){n===null&&(de.warn("`label_ids_to_fuse` unset. No \
instance will be fused."),n=new Set);const o=e.class_queries_logits??e.logits,l=(e.masks_queries_logits??e.pred_masks).sigmoid();
let[c,d,h]=o.dims;if(h-=1,a!==null&&a.length!==c)throw Error("Make sure that you pass in as many target sizes as the bat\
ch dimension of the logits");let _=[];for(let p=0;p<c;++p){let w=a!==null?a[p]:null,v=o[p],y=l[p],[b,k,A]=D2(v,y,t,h);if(A.
length===0){let[N,M]=w??y.dims.slice(-2),$=new G("int32",new Int32Array(N*M).fill(-1),[N,M]);_.push({segmentation:$,segments_info:[]});
continue}let[E,C]=B2(b,k,A,r,s,n,w);_.push({segmentation:E,segments_info:C})}return _}function jm(e,t=.5,r=null){throw new Error(
"`post_process_instance_segmentation` is not yet implemented.")}var he=class extends ft{constructor(e){super(),this.image_mean=
e.image_mean??e.mean,this.image_std=e.image_std??e.std,this.resample=e.resample??2,this.do_rescale=e.do_rescale??!0,this.
rescale_factor=e.rescale_factor??1/255,this.do_normalize=e.do_normalize,this.do_thumbnail=e.do_thumbnail,this.size=e.size??
e.image_size,this.do_resize=e.do_resize??this.size!==void 0,this.size_divisibility=e.size_divisibility??e.size_divisor,this.
do_center_crop=e.do_center_crop,this.crop_size=e.crop_size,this.do_convert_rgb=e.do_convert_rgb??!0,this.do_crop_margin=
e.do_crop_margin,this.pad_size=e.pad_size,this.do_pad=e.do_pad,this.min_pixels=e.min_pixels,this.max_pixels=e.max_pixels,
this.do_pad&&!this.pad_size&&!this.size_divisibility&&this.size&&this.size.width!==void 0&&this.size.height!==void 0&&(this.
pad_size=this.size),this.do_flip_channel_order=e.do_flip_channel_order??!1,this.config=e}async thumbnail(e,t,r=2){const s=e.
height,n=e.width,a=t.height,o=t.width;let i=Math.min(s,a),l=Math.min(n,o);return i===s&&l===n?e:(s>n?l=Math.floor(n*i/s):
n>s&&(i=Math.floor(s*l/n)),await e.resize(l,i,{resample:r}))}async crop_margin(e,t=200){const r=e.clone().grayscale(),s=bi(
r.data)[0],a=We(r.data)[0]-s;if(a===0)return e;const o=t/255;let i=r.width,l=r.height,c=0,d=0;const h=r.data;for(let _=0;_<
r.height;++_){const p=_*r.width;for(let w=0;w<r.width;++w)(h[p+w]-s)/a<o&&(i=Math.min(i,w),l=Math.min(l,_),c=Math.max(c,
w),d=Math.max(d,_))}return e=await e.crop([i,l,c,d]),e}pad_image(e,t,r,{mode:s="constant",center:n=!1,constant_values:a=0}={}){
const[o,i,l]=t;let c,d;if(typeof r=="number"?(c=r,d=r):r==="square"?c=d=Math.max(o,i):(c=r.width,d=r.height),c!==i||d!==
o){const h=new Float32Array(c*d*l);if(Array.isArray(a))for(let w=0;w<h.length;++w)h[w]=a[w%l];else a!==0&&h.fill(a);const[
_,p]=n?[Math.floor((c-i)/2),Math.floor((d-o)/2)]:[0,0];for(let w=0;w<o;++w){const v=(w+p)*c,y=w*i;for(let b=0;b<i;++b){const k=(v+
b+_)*l,A=(y+b)*l;for(let E=0;E<l;++E)h[k+E]=e[A+E]}}if(s==="symmetric"){if(n)throw new Error("`center` padding is not su\
pported when `mode` is set to `symmetric`.");const w=o-1,v=i-1;for(let y=0;y<d;++y){const b=y*c,k=_a(y,w)*i;for(let A=0;A<
c;++A){if(y<o&&A<i)continue;const E=(b+A)*l,C=(k+_a(A,v))*l;for(let N=0;N<l;++N)h[E+N]=e[C+N]}}}e=h,t=[d,c,l]}return[e,t]}rescale(e){
for(let t=0;t<e.length;++t)e[t]=this.rescale_factor*e[t]}get_resize_output_image_size(e,t){const[r,s]=e.size;let n,a;if(this.
do_thumbnail){const{height:o,width:i}=t;n=Math.min(o,i)}else Number.isInteger(t)?(n=t,a=this.config.max_size??n):t!==void 0&&
(n=t.shortest_edge,a=t.longest_edge);if(n!==void 0||a!==void 0){const o=n===void 0?1:Math.max(n/r,n/s),i=r*o,l=s*o,c=a===
void 0?1:Math.min(a/i,a/l);let d=Math.floor(Number((i*c).toFixed(2))),h=Math.floor(Number((l*c).toFixed(2)));return this.
size_divisibility!==void 0&&([d,h]=v_([d,h],this.size_divisibility)),[d,h]}else if(t!==void 0&&t.width!==void 0&&t.height!==
void 0){let o=t.width,i=t.height;if(this.config.keep_aspect_ratio&&this.config.ensure_multiple_of){let l=i/s,c=o/r;Math.
abs(1-c)<Math.abs(1-l)?l=c:c=l,i=w_(l*s,this.config.ensure_multiple_of),o=w_(c*r,this.config.ensure_multiple_of)}return[
o,i]}else{if(this.size_divisibility!==void 0)return v_([r,s],this.size_divisibility);throw new Error(`Could not resize i\
mage due to unsupported \`this.size\` option in config: ${JSON.stringify(t)}`)}}async resize(e){const[t,r]=this.get_resize_output_image_size(
e,this.size);return await e.resize(t,r,{resample:this.resample})}async preprocess(e,{do_normalize:t=null,do_pad:r=null,do_convert_rgb:s=null,
do_convert_grayscale:n=null,do_flip_channel_order:a=null}={}){this.do_crop_margin&&(e=await this.crop_margin(e));const[o,
i]=e.size;if(s??this.do_convert_rgb?e=e.rgb():n&&(e=e.grayscale()),this.do_resize&&(e=await this.resize(e)),this.do_thumbnail&&
(e=await this.thumbnail(e,this.size,this.resample)),this.do_center_crop){let _,p;Number.isInteger(this.crop_size)?(_=this.
crop_size,p=this.crop_size):(_=this.crop_size.width,p=this.crop_size.height),e=await e.center_crop(_,p)}const l=[e.height,
e.width];let c=Float32Array.from(e.data),d=[e.height,e.width,e.channels];if(this.do_rescale&&this.rescale(c),t??this.do_normalize){
let _=this.image_mean;Array.isArray(this.image_mean)||(_=new Array(e.channels).fill(_));let p=this.image_std;if(Array.isArray(
this.image_std)||(p=new Array(e.channels).fill(p)),_.length!==e.channels||p.length!==e.channels)throw new Error(`When se\
t to arrays, the length of \`image_mean\` (${_.length}) and \`image_std\` (${p.length}) must match the number of channel\
s in the image (${e.channels}).`);for(let w=0;w<c.length;w+=e.channels)for(let v=0;v<e.channels;++v)c[w+v]=(c[w+v]-_[v])/
p[v]}if(r??this.do_pad){if(this.pad_size)[c,d]=this.pad_image(c,[e.height,e.width,e.channels],this.pad_size);else if(this.
size_divisibility){const _=Math.ceil(d[1]/this.size_divisibility)*this.size_divisibility,p=Math.ceil(d[0]/this.size_divisibility)*
this.size_divisibility;[c,d]=this.pad_image(c,d,{width:_,height:p})}}if(a??this.do_flip_channel_order){if(d[2]!==3)throw new Error(
"Flipping channel order is only supported for RGB images.");for(let _=0;_<c.length;_+=3){const p=c[_];c[_]=c[_+2],c[_+2]=
p}}const h=new G("float32",c,d).permute(2,0,1);return{original_size:[i,o],reshaped_input_size:l,pixel_values:h}}async _call(e,...t){
Array.isArray(e)||(e=[e]);const r=await Promise.all(e.map(n=>this.preprocess(n)));return{pixel_values:ur(r.map(n=>n.pixel_values),
0),original_sizes:r.map(n=>n.original_size),reshaped_input_sizes:r.map(n=>n.reshaped_input_size)}}static async from_pretrained(e,t={}){
const r=await tr(e,cn,!0,t);return new this(r)}},xa={};hn(xa,{BeitFeatureExtractor:()=>R2,BitImageProcessor:()=>$2,CHMv2ImageProcessor:()=>V2,
CLIPFeatureExtractor:()=>U2,CLIPImageProcessor:()=>qm,ChineseCLIPFeatureExtractor:()=>G2,ConvNextFeatureExtractor:()=>j2,
ConvNextImageProcessor:()=>Wm,DINOv3ViTImageProcessor:()=>H2,DPTFeatureExtractor:()=>X2,DPTImageProcessor:()=>Xm,DeiTFeatureExtractor:()=>q2,
DeiTImageProcessor:()=>Hm,DetrFeatureExtractor:()=>W2,DetrImageProcessor:()=>Qm,DonutFeatureExtractor:()=>Q2,DonutImageProcessor:()=>ml,
EfficientNetImageProcessor:()=>Y2,GLPNFeatureExtractor:()=>Z2,Gemma3ImageProcessor:()=>K2,Gemma4ImageProcessor:()=>_l,Glm46VImageProcessor:()=>J2,
GroundingDinoImageProcessor:()=>eA,Idefics3ImageProcessor:()=>y_,ImageFeatureExtractor:()=>he,ImageProcessor:()=>he,JinaCLIPImageProcessor:()=>rA,
Lfm2VlImageProcessor:()=>iA,Lfm3VlImageProcessor:()=>lA,LlavaOnevisionImageProcessor:()=>cA,Mask2FormerImageProcessor:()=>dA,
MaskFormerFeatureExtractor:()=>uA,MaskFormerImageProcessor:()=>wl,MobileNetV1FeatureExtractor:()=>hA,MobileNetV1ImageProcessor:()=>Ym,
MobileNetV2FeatureExtractor:()=>fA,MobileNetV2ImageProcessor:()=>Km,MobileNetV3FeatureExtractor:()=>_A,MobileNetV3ImageProcessor:()=>Jm,
MobileNetV4FeatureExtractor:()=>pA,MobileNetV4ImageProcessor:()=>Zm,MobileViTFeatureExtractor:()=>mA,MobileViTImageProcessor:()=>eg,
NougatImageProcessor:()=>gA,OwlViTFeatureExtractor:()=>wA,OwlViTImageProcessor:()=>vl,Owlv2ImageProcessor:()=>vA,Phi3VImageProcessor:()=>bA,
PixtralImageProcessor:()=>MA,PvtImageProcessor:()=>xA,Qwen2VLImageProcessor:()=>gl,RTDetrImageProcessor:()=>kA,Sam2ImageProcessor:()=>ci,
Sam3ImageProcessor:()=>ci,SamImageProcessor:()=>ci,SapiensFeatureExtractor:()=>TA,SapiensImageProcessor:()=>tg,SegformerFeatureExtractor:()=>EA,
SegformerImageProcessor:()=>rg,SiglipImageProcessor:()=>AA,SmolVLMImageProcessor:()=>y_,Swin2SRImageProcessor:()=>CA,VLMImageProcessor:()=>tA,
ViTFeatureExtractor:()=>SA,ViTImageProcessor:()=>sg,VitMatteImageProcessor:()=>PA,VitPoseImageProcessor:()=>FA,YolosFeatureExtractor:()=>IA,
YolosImageProcessor:()=>ng});var R2=class extends he{},$2=class extends he{},G2=class extends he{},V2=class extends he{},
qm=class extends he{},U2=class extends qm{},Wm=class extends he{constructor(e){super(e),this.crop_pct=this.config.crop_pct??
224/256}async resize(e){const t=this.size?.shortest_edge;if(t===void 0)throw new Error("Size dictionary must contain 'sh\
ortest_edge' key.");if(t<384){const r=Math.floor(t/this.crop_pct),[s,n]=this.get_resize_output_image_size(e,{shortest_edge:r});
e=await e.resize(s,n,{resample:this.resample}),e=await e.center_crop(t,t)}else e=await e.resize(t,t,{resample:this.resample});
return e}},j2=class extends Wm{},Hm=class extends he{},q2=class extends Hm{},Qm=class extends he{async _call(e){const t=await super.
_call(e),r=[t.pixel_values.dims[0],64,64],s=ct(r,1n);return{...t,pixel_mask:s}}post_process_object_detection(...e){return La(
...e)}post_process_panoptic_segmentation(...e){return Um(...e)}post_process_instance_segmentation(...e){return jm(...e)}},
W2=class extends Qm{},H2=class extends he{},ml=class extends he{pad_image(e,t,r,s={}){const[n,a,o]=t;let i=this.image_mean;
Array.isArray(this.image_mean)||(i=new Array(o).fill(i));let l=this.image_std;Array.isArray(l)||(l=new Array(o).fill(i));
const c=i.map((d,h)=>-d/l[h]);return super.pad_image(e,t,r,{center:!0,constant_values:c,...s})}},Q2=class extends ml{},Xm=class extends he{},
X2=class extends Xm{},Y2=class extends he{constructor(e){super(e),this.include_top=this.config.include_top??!0,this.include_top&&
(this.image_std=this.image_std.map(t=>t*t))}},K2=class extends he{},gl=class extends he{constructor(e){super(e),this.min_pixels=
e.min_pixels??e.size?.shortest_edge,this.max_pixels=e.max_pixels??e.size?.longest_edge,this.patch_size=e.patch_size,this.
merge_size=e.merge_size}get_resize_output_image_size(e,t){const r=this.patch_size*this.merge_size;return pl(e.height,e.width,
r,this.min_pixels,this.max_pixels)}async _call(e,...t){const{pixel_values:r,original_sizes:s,reshaped_input_sizes:n}=await super.
_call(e,...t);let a=r;const{temporal_patch_size:o,merge_size:i,patch_size:l}=this.config;a.dims[0]===1&&(a=Oe(Array.from(
{length:o},()=>a),0));const c=a.dims[0]/o,d=a.dims[1],h=Math.floor(a.dims[2]/l),_=Math.floor(a.dims[3]/l),p=a.view(c,o,d,
Math.floor(h/i),i,l,Math.floor(_/i),i,l).permute(0,3,6,4,7,2,1,5,8).view(c*h*_,d*o*l*l),w=new G("int64",[c,h,_],[1,3]);return{
pixel_values:p,image_grid_thw:w,original_sizes:s,reshaped_input_sizes:n}}},J2=class extends gl{get_resize_output_image_size(e,t){
const r=this.patch_size*this.merge_size,s=this.config.temporal_patch_size??2;return pl(e.height,e.width,r,this.min_pixels,
this.max_pixels,s)}},Z2=class extends he{},eA=class extends he{async _call(e){const t=await super._call(e),r=t.pixel_values.
dims,s=_t([r[0],r[2],r[3]]);return{...t,pixel_mask:s}}},y_=class extends he{constructor(e){super(e),this.do_image_splitting=
e.do_image_splitting??!0,this.max_image_size=e.max_image_size}get_resize_for_vision_encoder(e,t){let[r,s]=e.dims.slice(-2);
const n=s/r;return s>=r?(s=Math.ceil(s/t)*t,r=Math.floor(s/n),r=Math.ceil(r/t)*t):(r=Math.ceil(r/t)*t,s=Math.floor(r*n),
s=Math.ceil(s/t)*t),{height:r,width:s}}async _call(e,{do_image_splitting:t=null,return_row_col_info:r=!1}={}){let s;if(!Array.
isArray(e))s=[[e]];else{if(e.length===0||!e[0])throw new Error("No images provided.");Array.isArray(e[0])?s=e:s=[e]}let n=[],
a=[],o=[];const i=[],l=[];for(const y of s){let b=await Promise.all(y.map(E=>this.preprocess(E)));i.push(...b.map(E=>E.original_size)),
l.push(...b.map(E=>E.reshaped_input_size)),b.forEach(E=>E.pixel_values.unsqueeze_(0));const{longest_edge:k}=this.max_image_size;
let A;if(t??this.do_image_splitting){let E=new Array(b.length),C=new Array(b.length);A=await Promise.all(b.map(async(N,M)=>{
const $=this.get_resize_for_vision_encoder(N.pixel_values,k),R=await Rt(N.pixel_values,{size:[$.height,$.width]}),{frames:j,
num_splits_h:Y,num_splits_w:Q}=await this.split_image(R,this.max_image_size);return E[M]=Y,C[M]=Q,Oe(j,0)})),a.push(E),o.
push(C)}else{const E=[k,k];A=await Promise.all(b.map(C=>Rt(C.pixel_values,{size:E}))),a.push(new Array(b.length).fill(0)),
o.push(new Array(b.length).fill(0))}n.push(Oe(A,0))}const c=n.length,[d,h,_,p]=n[0].dims;let w,v;if(c===1)w=n[0].unsqueeze_(
0),v=ct([c,d,_,p],!0);else{const y=Math.max(...n.map(A=>A.dims.at(0)));v=ct([c,y,_,p],!0);const b=v.data,k=y*_*p;for(let A=0;A<
c;++A){const E=n[A].dims[0];if(E<y){n[A]=Oe([n[A],ct([y-E,h,_,p],0)],0);const C=A*k+E*_*p,N=(A+1)*k;b.fill(!1,C,N)}}w=ur(
n,0)}return{pixel_values:w,pixel_attention_mask:v,original_sizes:i,reshaped_input_sizes:l,...r?{rows:a,cols:o}:{}}}async split_image(e,{
longest_edge:t}){const r=t,s=t,n=[],[a,o]=e.dims.slice(-2);let i=0,l=0;if(a>r||o>s){i=Math.ceil(a/r),l=Math.ceil(o/s);const c=Math.
ceil(a/i),d=Math.ceil(o/l);for(let p=0;p<i;++p)for(let w=0;w<l;++w){let v,y,b,k;p===i-1?(y=a-c,k=a):(y=p*c,k=(p+1)*c),w===
l-1?(v=o-d,b=o):(v=w*d,b=(w+1)*d);const C=await vm(e,[y,v],[k,b],[2,3]);n.push(C)}const h=r,_=s;(a!==h||o!==_)&&(e=await Rt(
e,{size:[h,_]}))}return n.push(e),{frames:n,num_splits_h:i,num_splits_w:l}}},tA=class extends he{constructor(e){super({do_pad:!0,
pad_size:{width:e.image_size,height:e.image_size},...e}),this.constant_values=this.config.background_color.map(t=>t*this.
rescale_factor)}pad_image(e,t,r,s){return super.pad_image(e,t,r,{constant_values:this.constant_values,center:!0,...s})}},
rA=class extends he{constructor(e){const{resize_mode:t,fill_color:r,interpolation:s,size:n,...a}=e,o=t==="squash"?{width:n,
height:n}:t==="shortest"?{shortest_edge:n}:{longest_edge:n},i=s==="bicubic"?3:2;super({...a,size:o,resample:i,do_center_crop:!0,
crop_size:n,do_normalize:!0})}};function b_(e,t){return Math.round(e/t)*t}function sA(e,t,r,s,n){let a=1/0,o=[1,1];const i=r*
s;for(const l of t){const c=Math.abs(e-l[0]/l[1]);c<a?(a=c,o=l):c===a&&i>.5*n*n*l[0]*l[1]&&(o=l)}return o}function nA(e,t){
const r=[],s=new Set;for(let n=e;n<=t;++n)for(let a=1;a<=n;++a)for(let o=1;o<=n;++o){const i=a*o;if(i>=e&&i<=t){const l=a<<
16|o;s.has(l)||(s.add(l),r.push([a,o]))}}return r.sort((n,a)=>n[0]*n[1]-a[0]*a[1])}function aA(e,t){const[r,s,n,a]=e.dims,
o=Math.floor(n/t),i=Math.floor(a/t),l=t*t*s,c=e.data,d=new Float32Array(r*o*i*l),h=n*a;for(let _=0;_<r;++_){const p=_*s*
h,w=_*o*i*l;for(let v=0;v<o;++v)for(let y=0;y<i;++y){let b=w+(v*i+y)*l;for(let k=0;k<t;++k){const A=(v*t+k)*a+y*t;for(let E=0;E<
t;++E){const C=A+E;for(let N=0;N<s;++N)d[b++]=c[p+N*h+C]}}}}return new G("float32",d,[r,o*i,l])}function oA(e,t){const[,
r,s]=e.dims,n=new BigInt64Array(t);n.fill(1n,0,r);let a=e;if(r<t){const o=new Float32Array(t*s);o.set(e.data),a=new G("f\
loat32",o,[1,t,s])}return{padded:a,mask:new G("int64",n,[t])}}var iA=class extends he{constructor(e){super(e),this.downsample_factor=
e.downsample_factor??2,this.do_image_splitting=e.do_image_splitting??!0,this.min_tiles=e.min_tiles??2,this.max_tiles=e.max_tiles??
10,this.use_thumbnail=e.use_thumbnail??!0,this.min_image_tokens=e.min_image_tokens??64,this.max_image_tokens=e.max_image_tokens??
256,this.encoder_patch_size=e.encoder_patch_size??e.patch_size??16,this.tile_size=e.tile_size??512,this.max_pixels_tolerance=
e.max_pixels_tolerance??2,this.return_row_col_info=e.return_row_col_info??!1;const t=this.max_image_tokens*this.downsample_factor**
2,r=this.do_image_splitting?(this.tile_size/this.encoder_patch_size)**2:0;this.max_num_patches=Math.max(t,r)}_is_image_too_large(e,t){
const r=this.encoder_patch_size*this.downsample_factor,s=Math.max(this.encoder_patch_size,b_(e,r)),n=Math.max(this.encoder_patch_size,
b_(t,r));return s*n>this.max_image_tokens*(this.encoder_patch_size*this.downsample_factor)**2*this.max_pixels_tolerance}_get_grid_layout(e,t){
const r=nA(this.min_tiles,this.max_tiles),[s,n]=sA(t/e,r,t,e,this.tile_size);return{grid_width:s,grid_height:n,target_width:this.
tile_size*s,target_height:this.tile_size*n}}async _call(e,{return_row_col_info:t=null}={}){let r;Array.isArray(e)?Array.
isArray(e[0])?r=e:r=[e]:r=[[e]];const s=[],n=[],a=[],o=[],i=[],l=[];for(const d of r){const h=await Promise.all(d.map(_=>this.
preprocess(_,{do_pad:!1})));for(const{pixel_values:_}of h){const[,p,w]=_.dims,v=_.unsqueeze_(0),y=this.encoder_patch_size*
this.downsample_factor,b=y**2,[k,A]=pl(Math.max(y,p),Math.max(y,w),y,this.min_image_tokens*b,this.max_image_tokens*b).map(
R=>Math.max(y,R));let E,C=1,N=1;const M=this._is_image_too_large(p,w),$=this.do_image_splitting&&!(this.min_tiles===1&&this.
max_tiles===1);if(M&&$){const{grid_width:R,grid_height:j,target_width:Y,target_height:Q}=this._get_grid_layout(p,w);C=j,
N=R;const z=await Rt(v,{size:[Q,Y]});E=[];for(let I=0;I<j;++I)for(let U=0;U<R;++U){const X=I*this.tile_size,ce=U*this.tile_size;
E.push(z.slice(null,null,[X,X+this.tile_size],[ce,ce+this.tile_size]))}this.use_thumbnail&&R*j!==1&&E.push(await Rt(v,{size:[
A,k]}))}else E=[await Rt(v,{size:[A,k]})];for(const R of E){const[,,j,Y]=R.dims,Q=aA(R,this.encoder_patch_size),{padded:z,
mask:I}=oA(Q,this.max_num_patches);s.push(z),n.push(I),a.push([Math.floor(j/this.encoder_patch_size),Math.floor(Y/this.encoder_patch_size)])}
o.push(C),i.push(N),l.push([A,k])}}const c={pixel_values:Oe(s,0),pixel_attention_mask:ur(n,0),spatial_shapes:new G("int6\
4",BigInt64Array.from(a.flat(),BigInt),[a.length,2])};return(t??this.return_row_col_info)&&(c.image_rows=o,c.image_cols=
i,c.image_sizes=l),c}},lA=class extends gl{async _call(e,...t){Array.isArray(e)||(e=[e]);const r=await Promise.all(e.map(
s=>super._call(s,...t)));return{pixel_values:Oe(r.map(s=>s.pixel_values),0),image_grid_thw:Oe(r.map(s=>s.image_grid_thw),
0),original_sizes:r.flatMap(s=>s.original_sizes),reshaped_input_sizes:r.flatMap(s=>s.reshaped_input_sizes)}}},cA=class extends he{},
wl=class extends he{post_process_panoptic_segmentation(...e){return Um(...e)}post_process_instance_segmentation(...e){return jm(
...e)}},uA=class extends wl{},dA=class extends wl{},Ym=class extends he{},hA=class extends Ym{},Km=class extends he{},fA=class extends Km{},
Jm=class extends he{},_A=class extends Jm{},Zm=class extends he{},pA=class extends Zm{},eg=class extends he{},mA=class extends eg{},
gA=class extends ml{},vl=class extends he{post_process_object_detection(...e){return La(...e)}},wA=class extends vl{},vA=class extends vl{},
mt=336,yA=[2,3],{ceil:ii,floor:ds,sqrt:li}=Math,bA=class extends he{constructor(e){super({...e,do_normalize:!0,do_pad:!0,
pad_size:"custom",do_convert_rgb:!0,do_resize:!0}),this._num_crops=e.num_crops}calc_num_image_tokens_from_image_size(e,t){
const{num_img_tokens:r}=this.config;return ds((ds(t/mt)*ds(e/mt)+1)*r+1+(ds(t/mt)+1)*li(r))}get_resize_output_image_size(e,t){
const r=this._num_crops,[s,n]=e.size;let a=s/n,o=1;for(;o*Math.ceil(o/a)<=r;)o+=1;o-=1;const i=Math.floor(o*336),l=Math.
floor(i/a);return[i,l]}pad_image(e,t,r,s={}){const[n,a]=t,o=mt*ii(n/mt),i=mt*ii(a/mt),l=[1,1,1].map((c,d)=>(c-this.image_mean[d])/
this.image_std[d]);return super.pad_image(e,t,{width:i,height:o},{center:!0,constant_values:l,...s})}async _call(e,{num_crops:t=null}={}){
if(this._num_crops=t??=this.config.num_crops,t<4||li(t)%1!==0)throw new Error("num_crops must be a square number >= 4");
Array.isArray(e)||(e=[e]);const r=e.length,s=await Promise.all(e.map(h=>this.preprocess(h))),n=s.map(h=>h.original_size),
a=s.map(h=>h.reshaped_input_size),o=[];for(const{pixel_values:h}of s){h.unsqueeze_(0);const[_,p]=h.dims.slice(-2),w=await Rt(
h,{size:[mt,mt],mode:"bicubic"});if(t>0){const v=[],y=li(t),b=ds(p/y),k=ds(_/y);for(let E=0;E<y;++E)for(let C=0;C<y;++C){
let N,M,$,R;E===y-1?(M=_-k,R=_):(M=E*k,R=(E+1)*k),C===y-1?(N=p-b,$=p):(N=C*b,$=(C+1)*b);const Q=await vm(h,[M,N],[R,$],yA);
v.push(Q)}const A=await Rt(Oe(v,0),{size:[mt,mt],mode:"bicubic"});o.push(Oe([w,A],0))}else o.push(w)}const i=ur(o,0),l=a.
map(h=>h.map(_=>mt*ii(_/mt))),c=new G("int64",l.flat(),[r,2]),d=l.map(([h,_])=>this.calc_num_image_tokens_from_image_size(
_,h));return{pixel_values:i,original_sizes:n,reshaped_input_sizes:a,image_sizes:c,num_img_tokens:d}}},MA=class extends he{get_resize_output_image_size(e,t){
const{longest_edge:r}=t;if(r===void 0)throw new Error("size must contain 'longest_edge'");const[s,n]=e.size,a=Math.max(s,
n)/r;let o=s,i=n;a>1&&(o=Math.floor(s/a),i=Math.floor(n/a));const{patch_size:l,spatial_merge_size:c}=this.config;if(!c)throw new Error(
"config must contain 'spatial_merge_size'");const d=l*c,h=Math.floor((o-1)/d)+1,_=Math.floor((i-1)/d)+1;return[h*d,_*d]}},
xA=class extends he{},kA=class extends he{post_process_object_detection(...e){return La(...e)}},ci=class extends he{reshape_input_points(e,t,r,s=!1){
e=structuredClone(e);let n=If(e);if(n.length===3)s||(n=[1,...n]),e=[e];else if(n.length!==4)throw Error("The input_point\
s must be a 4D tensor of shape `batch_size`, `point_batch_size`, `nb_points_per_image`, `2`.");for(let a=0;a<e.length;++a){
const[o,i]=t[a],[l,c]=r[a],d=[c/i,l/o];for(let h=0;h<e[a].length;++h)for(let _=0;_<e[a][h].length;++_)for(let p=0;p<e[a][h][_].
length;++p)e[a][h][_][p]*=d[p%2]}return new G("float32",Float32Array.from(e.flat(1/0)),n)}add_input_labels(e,t){let r=If(
e);if(r.length===2)r=[1,...r],e=[e];else if(r.length!==3)throw Error("The input_points must be a 4D tensor of shape `bat\
ch_size`, `point_batch_size`, `nb_points_per_image`, `2`.");if(r.some((s,n)=>s!==t.dims[n]))throw Error(`The first ${r.length}\
 dimensions of 'input_points' and 'input_labels' must be the same.`);return new G("int64",e.flat(1/0).map(BigInt),r)}async _call(e,{
input_points:t=null,input_labels:r=null,input_boxes:s=null}={}){const n=await super._call(e);if(t&&(n.input_points=this.
reshape_input_points(t,n.original_sizes,n.reshaped_input_sizes)),r){if(!n.input_points)throw Error("`input_points` must \
be provided if `input_labels` are provided.");n.input_labels=this.add_input_labels(r,n.input_points)}return s&&(n.input_boxes=
this.reshape_input_points(s,n.original_sizes,n.reshaped_input_sizes,!0)),n}async post_process_masks(e,t,r,{mask_threshold:s=0,
binarize:n=!0,pad_size:a=null}={}){const o=[];a=a??this.pad_size??this.size;const i=[a.height,a.width];for(let l=0;l<t.length;++l){
const c=t[l],d=r[l];let h=await Rt(e[l],{mode:"bilinear",size:i});if(h=h.slice(null,null,[0,d[0]],[0,d[1]]),h=await Rt(h,
{mode:"bilinear",size:c}),n){const _=h.data,p=new Uint8Array(_.length);for(let w=0;w<_.length;++w)_[w]>s&&(p[w]=1);h=new G(
"bool",p,h.dims)}o.push(h)}return o}generate_crop_boxes(e,t,{crop_n_layers:r=0,overlap_ratio:s=512/1500,points_per_crop:n=32,
crop_n_points_downscale_factor:a=1}={}){}},tg=class extends he{post_process_semantic_segmentation(...e){return Vm(...e)}},
TA=class extends tg{},rg=class extends he{post_process_semantic_segmentation(...e){return Vm(...e)}},EA=class extends rg{},
AA=class extends he{},CA=class extends he{pad_image(e,t,r,s={}){const[n,a,o]=t;return super.pad_image(e,t,{width:a+(r-a%
r)%r,height:n+(r-n%r)%r},{mode:"symmetric",center:!1,constant_values:-1,...s})}},sg=class extends he{},SA=class extends sg{},
PA=class extends he{async _call(e,t){Array.isArray(e)||(e=[e]),Array.isArray(t)||(t=[t]);const r=await Promise.all(e.map(
a=>this.preprocess(a))),s=await Promise.all(t.map(a=>this.preprocess(a,{do_normalize:!1,do_convert_rgb:!1,do_convert_grayscale:!0})));
return{pixel_values:ur(r.map((a,o)=>Oe([a.pixel_values,s[o].pixel_values],0)),0),original_sizes:r.map(a=>a.original_size),
reshaped_input_sizes:r.map(a=>a.reshaped_input_size)}}},FA=class extends he{post_process_pose_estimation(e,t,{threshold:r=null}={}){
const s=e.tolist(),[n,a,o,i]=e.dims,l=[];for(let c=0;c<n;++c){const d=s[c],h=t[c],_=[];for(let p=0;p<h.length;++p){const w=h[p],
v=[],y=[],b=[],k=w.at(-2)/i,A=w.at(-1)/o;for(let E=0;E<d.length;++E){let[C,N]=[0,0],M=0,$=-1/0;const R=d[E];for(let Y=0;Y<
R.length;++Y){const Q=R[Y];for(let z=0;z<Q.length;++z){const I=Q[z];M+=I,$=Math.max($,I),C+=(z+.5)*I,N+=Y*I}}if(r!=null&&
$<r)continue;const j=[k*C/M,A*N/M];v.push(j),b.push(E),y.push($)}_.push({bbox:w,scores:y,labels:b,keypoints:v})}l.push(_)}
return l}},ng=class extends he{post_process_object_detection(...e){return La(...e)}},IA=class extends ng{},at=class{static async from_pretrained(e,t={}){
const r=await tr(e,cn,!0,t),s=r.image_processor_type??r.feature_extractor_type;let n=xa[s?.replace(/Fast$/,"")];return n||
(s!==void 0&&de.warn(`Image processor type '${s}' not found, assuming base ImageProcessor. Please report this at ${Ia}.`),
n=he),new n(r)}},LA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;constructor(e,t,r){super(
e,t,r);const{tasks_answer_post_processing_type:s,task_prompts_without_inputs:n,task_prompts_with_input:a}=this.image_processor.
config;this.tasks_answer_post_processing_type=new Map(Object.entries(s??{})),this.task_prompts_without_inputs=new Map(Object.
entries(n??{})),this.task_prompts_with_input=new Map(Object.entries(a??{})),this.regexes={quad_boxes:/(.+?)<loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)>/gm,
bboxes:/([^<]+)?<loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)>/gm},this.size_per_bin=1e3}construct_prompts(e){typeof e=="s\
tring"&&(e=[e]);const t=[];for(const r of e)if(this.task_prompts_without_inputs.has(r))t.push(this.task_prompts_without_inputs.
get(r));else{for(const[s,n]of this.task_prompts_with_input)if(r.includes(s)){t.push(n.replaceAll("{input}",r).replaceAll(
s,""));break}t.length!==e.length&&t.push(r)}return t}post_process_generation(e,t,r){const s=this.tasks_answer_post_processing_type.
get(t)??"pure_text";e=e.replaceAll("<s>","").replaceAll("</s>","");let n;switch(s){case"pure_text":n=e;break;case"descri\
ption_with_bboxes":case"bboxes":case"phrase_grounding":case"ocr":const a=s==="ocr"?"quad_boxes":"bboxes",o=e.matchAll(this.
regexes[a]),i=[],l=[];for(const[c,d,...h]of o)i.push(d?d.trim():i.at(-1)??""),l.push(h.map((_,p)=>(Number(_)+.5)/this.size_per_bin*
r[p%2]));n={labels:i,[a]:l};break;default:throw new Error(`Task "${t}" (of type "${s}") not yet implemented.`)}return{[t]:n}}async _call(e,t=null,r={}){
if(!e&&!t)throw new Error("Either text or images must be provided");const s=await this.image_processor(e,r),n=t?this.tokenizer(
this.construct_prompts(t),r):{};return{...s,...n}}},OA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;static uses_processor_config=!0;static uses_chat_template_file=!0;constructor(e,t,r){
super(e,t,r),this.image_seq_length=this.config.image_seq_length;const{boi_token:s,image_token:n,eoi_token:a}=this.tokenizer.
config;this.boi_token=s,this.image_token=n,this.eoi_token=a;const o=n.repeat(this.image_seq_length);this.full_image_sequence=
`

${s}${o}${a}

`}async _call(e,t=null,r={}){typeof e=="string"&&(e=[e]);let s;return t&&(s=await this.image_processor(t,r),e=e.map(a=>a.
replaceAll(this.boi_token,this.full_image_sequence))),{...this.tokenizer(e,r),...s}}},NA=class extends Te{static image_processor_class=at;static feature_extractor_class=St;static tokenizer_class=ke;static uses_processor_config=!0;static uses_chat_template_file=!0;constructor(e,t,r){
super(e,t,r),this.audio_seq_length=this.config.audio_seq_length,this.image_seq_length=this.config.image_seq_length;const{
audio_token_id:s,boa_token:n,audio_token:a,eoa_token:o,image_token_id:i,boi_token:l,image_token:c,eoi_token:d}=this.tokenizer.
config;this.audio_token_id=s,this.boa_token=n,this.audio_token=a;const h=a.repeat(this.audio_seq_length);this.full_audio_sequence=
`

${n}${h}${o}

`,this.image_token_id=i,this.boi_token=l,this.image_token=c;const _=c.repeat(this.image_seq_length);this.full_image_sequence=
`

${l}${_}${d}

`}async _call(e,t=null,r=null,s={}){typeof e=="string"&&(e=[e]);let n;r&&(n=await this.feature_extractor(r,s),e=e.map(i=>i.
replaceAll(this.audio_token,this.full_audio_sequence)));let a;return t&&(a=await this.image_processor(t,s),e=e.map(i=>i.
replaceAll(this.image_token,this.full_image_sequence))),{...this.tokenizer(e,s),...a,...n}}},yl=class extends Te{static image_processor_class=at;static tokenizer_class=ke;static image_token="\
<|image_pad|>";async _call(e,t=null,...r){Array.isArray(e)||(e=[e]);let s,n;if(t&&(s=await this.image_processor(t),n=s.image_grid_thw),
n){let o=this.image_processor.config.merge_size**2,i=0;const l=this.constructor.image_token,c=n.tolist();e=e.map(d=>{for(;d.
includes(l);){const h=Number(c[i++].reduce((_,p)=>_*p,1n));d=d.replace(l,"<|placeholder|>".repeat(Math.floor(h/o)))}return d.
replaceAll("<|placeholder|>",l)})}return{...this.tokenizer(e),...s}}},DA=class extends yl{static image_token="<|image|>"},
zA=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!0;_get_num_audio_features(e){
const{hop_length:t}=this.feature_extractor.config.melspec_kwargs,{projector_window_size:r,projector_downsample_rate:s}=this.
feature_extractor.config,n=Math.floor(r/s),a=Math.floor(e/t)+1,o=Math.floor(a/2);return Math.ceil(o/r)*n}async _call(e,t=null,r={}){
if(Array.isArray(e))throw new Error("Batched inputs are not supported yet.");let s={};if(t){const{input_features:a}=await this.
feature_extractor(t);s.input_features=a;const o=this._get_num_audio_features(t.length),i=new Uint8Array(o).fill(1);s.input_features_mask=
new G("bool",i,[1,o]);const l=this.config.audio_token??"<|audio|>";if(!e.includes(l))throw new Error(`The input text doe\
s not contain the audio token ${l}.`);e=e.replaceAll(l,l.repeat(o))}return{...this.tokenizer(e,{add_special_tokens:!1,...r}),
...s}}};function BA(e,t){const s=e.dims.at(-1)-1,n=e.tolist();n.fill(!1,0,1),n.fill(!1,s);const a=t.tolist();return n.map(
(o,i)=>o?i:null).filter(o=>o!==null).map(o=>a[o])}var RA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;async _call(e,t,r={}){
const s=e?await this.image_processor(e,r):{};return{...t?this.tokenizer(t,r):{},...s}}post_process_grounded_object_detection(e,t,{
box_threshold:r=.25,text_threshold:s=.25,target_sizes:n=null}={}){const{logits:a,pred_boxes:o}=e,i=a.dims[0];if(n!==null&&
n.length!==i)throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits");const l=a.
dims.at(1),c=a.sigmoid(),d=c.max(-1).tolist(),h=o.tolist().map(p=>p.map(w=>Gm(w))),_=[];for(let p=0;p<i;++p){const w=n!==
null?n[p]:null;w!==null&&(h[p]=h[p].map(A=>A.map((E,C)=>E*w[(C+1)%2])));const v=d[p],y=[],b=[],k=[];for(let A=0;A<l;++A){
const E=v[A];if(E<=r)continue;const C=h[p][A],N=c[p][A];y.push(E),k.push(C);const M=BA(N.gt(s),t[p]);b.push(M)}_.push({scores:y,
boxes:k,labels:this.batch_decode(b)})}return _}};function $A(e,t,r,s,n,a){let o="";for(let i=0;i<t;++i){for(let l=0;l<r;++l)
o+=s+`<row_${i+1}_col_${l+1}>`+n.repeat(e);o+=`
`}return o+=`
${s}${a}`+n.repeat(e)+`${s}`,o}function GA(e,t,r,s){return`${t}${s}`+r.repeat(e)+`${t}`}function VA(e,t,r,s,n,a){return e===
0&&t===0?GA(r,s,n,a):$A(r,e,t,s,n,a)}var M_=class extends Te{static image_processor_class=at;static tokenizer_class=ke;static uses_processor_config=!0;fake_image_token="\
<fake_token_around_image>";image_token="<image>";global_img_token="<global-img>";async _call(e,t=null,r={}){r.return_row_col_info??=
!0;let s;t&&(s=await this.image_processor(t,r)),Array.isArray(e)||(e=[e]);const n=s.rows??[new Array(e.length).fill(0)],
a=s.cols??[new Array(e.length).fill(0)],o=this.config.image_seq_len,i=[],l=[];for(let d=0;d<e.length;++d){const h=e[d],_=n[d],
p=a[d];i.push(RM(h,this.image_token));const w=_.map((b,k)=>VA(b,p[k],o,this.fake_image_token,this.image_token,this.global_img_token)),
v=h.split(this.image_token);if(v.length===0)throw new Error("The image token should be present in the text.");let y=v[0];
for(let b=0;b<w.length;++b)y+=w[b]+v[b+1];l.push(y)}return{...this.tokenizer(l),...s}}},UA=class extends Te{static image_processor_class=at;static tokenizer_class=ke;static uses_processor_config=!0;constructor(e,t,r){
super(e,t,r),this.image_tag=this.config.image_tag,this.image_start_tag=this.config.image_start_tag,this.image_end_tag=this.
config.image_end_tag,this.num_image_tokens=this.config.num_image_tokens}async _call(e,{images:t=null,chat_template:r="de\
fault"}={}){t?Array.isArray(t)||(t=[t]):t=await Promise.all(e.filter(v=>v.images).flatMap(v=>v.images).map(v=>Mt.read(v)));
const s=this.tokenizer,n=s.apply_chat_template(e,{tokenize:!1,add_generation_prompt:!0,chat_template:r}),a=v=>s.encode(v,
{add_special_tokens:!1}),o=n.split(this.image_tag),i=o.length-1;if(t.length!==i)throw new Error(`Number of images provid\
ed (${t.length}) does not match number of "${this.image_tag}" image tags (${i})`);const[l,c,d]=s.convert_tokens_to_ids([
this.image_tag,this.image_start_tag,this.image_end_tag]);let h=a(o[0]),_=new Array(h.length).fill(!1);for(let v=1;v<o.length;++v){
const y=new Array(this.num_image_tokens).fill(l),b=a(o[v]);h=Dt(h,[c],y,[d],b);const k=new Array(this.num_image_tokens).
fill(!0);_=Dt(_,[!1],k,[!1],new Array(b.length).fill(!1))}const p=[1,h.length],w={input_ids:new G("int64",h,p),attention_mask:new G(
"int64",new Array(h.length).fill(1),p),images_seq_mask:new G("bool",_,p),images_emb_mask:new G("bool",new Array(i*this.num_image_tokens).
fill(!0),[1,i,this.num_image_tokens])};if(t&&t.length>0){const v=await this.image_processor(t);return v.pixel_values.unsqueeze_(
0),{...w,...v}}return w}},jA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;async _call(e=null,t=null,r={}){
if(!e&&!t)throw new Error("Either text or images must be provided");const s=e?this.tokenizer(e,r):{},n=t?await this.image_processor(
t,r):{};return{...s,...n}}},qA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;async _call(e,t=null,r={}){
const{image_rows:s,image_cols:n,image_sizes:a,...o}=await this.image_processor(e,{...r,return_row_col_info:!0});if(t){const i=this.
config.image_token??"<image>",{tile_size:l=512,downsample_factor:c=2,encoder_patch_size:d=16,use_thumbnail:h=!0}=this.image_processor.
config,_=k=>Math.ceil(Math.floor(k/d)/c),p=_(l)**2,w=this.config.image_start_token??"<|image_start|>",v=this.config.image_end_token??
"<|image_end|>",y=this.config.image_thumbnail??"<|img_thumbnail|>";Array.isArray(t)||(t=[t]);let b=0;t=t.map(k=>{const A=k.
split(i);return A[0]+A.slice(1).map(E=>{const C=b++,[N,M]=a[C],$=s[C],R=n[C],j=_(N)*_(M);let Y=w;if($>1||R>1){const Q=i.
repeat(p);for(let z=0;z<$;++z)for(let I=0;I<R;++I)Y+=`<|img_row_${z+1}_col_${I+1}|>`+Q;h&&(Y+=y+i.repeat(j))}else Y+=i.repeat(
j);return Y+v+E}).join("")})}return{...o,...t?this.tokenizer(t,r):{}}}},WA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;async _call(e,t=null,r={}){
const s=e?await this.image_processor(e,r):{};if(t!==null){Array.isArray(t)||(t=[t]);const n=this.tokenizer.config.image_token??
"<|image|>",a=s.image_grid_thw?.tolist()??[],o=t.reduce((c,d)=>c+d.split(n).length-1,0);if(o!==a.length)throw new Error(
`Found ${o} ${n} tokens in the text but received ${a.length} images.`);const i=this.image_processor.config.merge_size;let l=0;
t=t.map(c=>c.replaceAll(n,()=>{const d=Number(a[l++].reduce((h,_)=>h*_,1n));return n.repeat(d/i**2)}))}return{...s,...t!==
null?this.tokenizer(t,r):{}}}},HA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;static uses_processor_config=!0;async _call(e,t=null,r={}){
const s=await this.image_processor(e,r);if(t){const[a,o]=s.pixel_values.dims.slice(-2),{image_token:i,patch_size:l,num_additional_image_tokens:c}=this.
config,d=Math.floor(a/l)*Math.floor(o/l)+c;t=structuredClone(t),Array.isArray(t)||(t=[t]);for(let h=0;h<t.length;++h)t[h]=
t[h].replace(i,i.repeat(d))}const n=t?this.tokenizer(t,r):{};return{...s,...n}}},x_={char:["char_decode",1],bpe:["bpe_de\
code",2],wp:["wp_decode",102]},QA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;get char_tokenizer(){
return this.components.char_tokenizer}get bpe_tokenizer(){return this.components.bpe_tokenizer}get wp_tokenizer(){return this.
components.wp_tokenizer}_decode_helper(e,t){if(!x_.hasOwnProperty(t))throw new Error(`Format ${t} is not supported.`);const[
r,s]=x_[t],n=this[r].bind(this),[a,o]=e.dims,i=[],l=[],c=e.tolist();for(let h=0;h<a;++h){const _=c[h],p=[],w=[];for(let y=1;y<
o;++y){const[b,k]=We(st(_[y]));if(w.push(b),k==s)break;p.push(k)}const v=w.length>0?w.reduce((y,b)=>y*b,1):0;l.push(p),i.
push(v)}return[n(l),i]}char_decode(e){return this.char_tokenizer.batch_decode(e).map(t=>t.replaceAll(" ",""))}bpe_decode(e){
return this.bpe_tokenizer.batch_decode(e)}wp_decode(e){return this.wp_tokenizer.batch_decode(e).map(t=>t.replaceAll(" ",
""))}batch_decode([e,t,r]){const[s,n]=this._decode_helper(e,"char"),[a,o]=this._decode_helper(t,"bpe"),[i,l]=this._decode_helper(
r,"wp"),c=[],d=[];for(let h=0;h<s.length;++h){const[_,p]=We([n[h],o[h],l[h]]);c.push([s[h],a[h],i[h]][p]),d.push(_)}return{
generated_text:c,scores:d,char_preds:s,bpe_preds:a,wp_preds:i}}static async from_pretrained(...e){const t=await super.from_pretrained(
...e),r=await ke.from_pretrained("Xenova/gpt2"),s=await ke.from_pretrained("Xenova/bert-base-uncased");return t.components=
{image_processor:t.image_processor,char_tokenizer:t.tokenizer,bpe_tokenizer:r,wp_tokenizer:s},t}async _call(e,t=null){const r=await this.
image_processor(e);return t&&(r.labels=this.tokenizer(t).input_ids),r}},XA=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},YA=class extends Te{static tokenizer_class=ke;static image_processor_class=at},
hs="<image>";function KA(e,t,r,s,n){return`${s.repeat(r*n)}${t}${e}
`}var JA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;static uses_processor_config=!1;async _call(e,t=null,r={}){
t||(de.warn("You are using PaliGemma without a text prefix. It will perform as a picture-captioning model."),t=""),Array.
isArray(e)||(e=[e]),Array.isArray(t)||(t=[t]);const s=this.tokenizer.bos_token,n=this.image_processor.config.image_seq_length;
let a;t.some(l=>l.includes(hs))?a=t.map(l=>{const c=l.replaceAll(hs,hs.repeat(n)),d=c.lastIndexOf(hs),h=d===-1?0:d+hs.length;
return c.slice(0,h)+s+c.slice(h)+`
`}):(de.warn("You are passing both `text` and `images` to `PaliGemmaProcessor`. The processor expects special image toke\
ns in the text, as many tokens as there are images per each text. It is recommended to add `<image>` tokens in the very \
beginning of your text. For this call, we will infer how many images each text has and add special tokens."),a=t.map(l=>KA(
l,s,n,hs,e.length)));const o=this.tokenizer(a,r);return{...await this.image_processor(e,r),...o}}},k_="<|image|>",ZA=/<\|image_\d+\|>/g,
eC=class extends Te{static image_processor_class=at;static tokenizer_class=ke;async _call(e,t=null,{padding:r=!0,truncation:s=!0,
num_crops:n=null}={}){Array.isArray(e)||(e=[e]);let a,o;if(t){o=await this.image_processor(t,{num_crops:n});const{num_img_tokens:i}=o,
l=e.map((d,h)=>d.split(ZA).join(k_.repeat(i[h])));a=this.tokenizer(l,{padding:r,truncation:s});const c=this.tokenizer._tokenizer.
token_to_id(k_);a.input_ids.map_(d=>d==c?-d:d)}else a=this.tokenizer(e);return{...a,...o}}},tC=class extends Te{static tokenizer_class=ke;static image_processor_class=at;static uses_processor_config=!0;async _call(e,t=null,r={}){
const s=await this.image_processor(e,r);if(t){const[a,o]=s.pixel_values.dims.slice(-2),{image_token:i,image_break_token:l,
image_end_token:c,patch_size:d,spatial_merge_size:h}=this.config,_=d*h,p=Math.floor(a/_),w=Math.floor(o/_);t=structuredClone(
t),Array.isArray(t)||(t=[t]);for(let v=0;v<t.length;++v){const y=i.repeat(w),b=y+l,k=y+c,A=b.repeat(p-1)+k;t[v]=t[v].replace(
i,A)}}const n=t?this.tokenizer(t,r):{};return{...s,...n}}},rC=class extends Te{static feature_extractor_class=zm;async _call(e){
return await this.feature_extractor(e)}post_process_speaker_diarization(...e){return this.feature_extractor.post_process_speaker_diarization(
...e)}get sampling_rate(){return this.feature_extractor.config.sampling_rate}},ag=class extends yl{},sC=class extends ag{},
og=class extends Te{static image_processor_class=at;async _call(...e){return await this.image_processor(...e)}post_process_masks(...e){
return this.image_processor.post_process_masks(...e)}reshape_input_points(...e){return this.image_processor.reshape_input_points(
...e)}},ig=class extends og{},nC=class extends ig{},aC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},oC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!0;async _call(e,t=null,r={}){
if(Array.isArray(e))throw new Error("Batched inputs are not supported yet.");let s={};if(t){const a=t.length,{input_features:o}=await this.
feature_extractor(t,{...r,max_length:a}),i=Math.round(a/this.config.encoder_ds_factor+1e-4),l=1+Math.ceil(i/this.config.
stack_factor);s.audio_token_len=[l],s.audio_values=o;const c=this.config.audio_placeholder;if(!e.includes(c))throw new Error(
`The input text does not contain the image token ${c}.`);e=e.replaceAll(c,c.repeat(l))}return{...this.tokenizer(e,{add_special_tokens:!1,
...r}),...s}}},Kn="[AUDIO]",iC="[BEGIN_AUDIO]",lC=375;function cC(e,t){const r=[];for(let s=0;s<e.length;s+=t)r.push(e.subarray(
s,Math.min(s+t,e.length)));return r}var uC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!1;async _call(e,t=null,r={}){
if(Array.isArray(e))throw new Error("Batched inputs are not supported yet.");const s={};if(t){if(!e.includes(Kn))throw new Error(
`The input text does not contain the audio token ${Kn}.`);Array.isArray(t)||(t=[t]);const a=e.split(Kn),o=a.length-1;if(o!==
t.length)throw new Error(`The number of audio inputs (${t.length}) does not match the number of audio tokens in the text\
 (${o}).`);const i=this.feature_extractor.config.n_samples,l=t.map(p=>cC(p,i)),c=l.map(p=>p.length),d=l.flat(),h=(await Promise.
all(d.map(p=>this.feature_extractor(p,r)))).map(p=>p.input_features);s.audio_values=h.length>1?Oe(h,0):h[0];let _=a[0];for(let p=0;p<
c.length;++p){_+=iC;for(let w=0;w<c[p];++w)_+=Kn.repeat(lC);_+=a[p+1]}e=_}return{...this.tokenizer(e,{add_special_tokens:!1,
...r}),...s}}},T_=32,ui=6,Jn=8,dC=10,hC=32,fC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!1;get num_mel_frames_first_audio_chunk(){
return(ui+1)*Jn}get num_samples_first_audio_chunk(){const{hop_length:e,n_fft:t}=this.feature_extractor.config;return(this.
num_mel_frames_first_audio_chunk-1)*e+Math.floor(t/2)}get num_samples_per_audio_chunk(){const{hop_length:e,n_fft:t}=this.
feature_extractor.config;return Jn*e+t}get num_right_pad_tokens(){return ui+1+dC}get audio_length_per_tok(){return Jn}get raw_audio_length_per_tok(){
return Jn*this.feature_extractor.config.hop_length}async _call(e,{is_streaming:t=!1,is_first_audio_chunk:r=!0}={}){if(nt(
e,"VoxtralRealtimeProcessor"),!t&&!r)throw new Error("In non-streaming mode (`is_streaming=false`), `is_first_audio_chun\
k` must be `true`.");if(r)if(t){const s=T_*this.raw_audio_length_per_tok,n=new Float32Array(s+e.length);n.set(e,s);const a=await this.
feature_extractor(n,{center:!0}),i=1+(T_+ui),l=new BigInt64Array(i).fill(BigInt(hC));return l[0]=1n,{input_ids:new G("in\
t64",l,[1,i]),...a}}else{const s=this.num_right_pad_tokens*this.raw_audio_length_per_tok,n=new Float32Array(e.length+s);
return n.set(e),await this.feature_extractor(n,{center:!0})}else return await this.feature_extractor(e,{center:!1})}},_C=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},pC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},mC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},gC=class{static async from_pretrained(e,t={}){const r=await tr(e,cn,!0,t),{image_processor_type:s,
feature_extractor_type:n,processor_class:a}=r;if(a&&ki[a])return ki[a].from_pretrained(e,t);if(!s&&!n)throw new Error("N\
o `image_processor_type` or `feature_extractor_type` found in the config.");const o={};if(s){const l=xa[s.replace(/Fast$/,
"")];if(!l)throw new Error(`Unknown image_processor_type: '${s}'.`);o.image_processor=new l(r)}if(n){const l=xa[n];if(l)
o.image_processor=new l(r);else{const c=fl[n];if(!c)throw new Error(`Unknown feature_extractor_type: '${n}'.`);o.feature_extractor=
new c(r)}}const i={};return new Te(i,o,null)}};async function wC(e,t){return await tr(e,"config.json",!0,t)}function _s(e){
const t={};let r={};switch(e.model_type){case"llava":case"paligemma":case"gemma3":case"florence2":case"llava_onevision":case"\
idefics3":case"granite_speech":case"ultravox":case"voxtral":case"voxtral_realtime":case"smolvlm":case"gemma3n":case"gemm\
a4":case"lfm2_vl":case"lfm3_vl":case"chatterbox":case"lighton_ocr":case"glm_ocr":case"mistral3":case"qwen2_5_vl":case"qw\
en3_vl":case"qwen3_vl_moe":r=_s(e.text_config);break;case"moondream1":r=_s(e.phi_config);break;case"musicgen":r=_s(e.decoder);
break;case"multi_modality":r=_s(e.language_config);break;case"gpt2":case"gptj":case"jais":case"codegen":case"gpt_bigcode":
t.num_heads="n_head",t.num_layers="n_layer",t.hidden_size="n_embd";break;case"gpt_neox":case"stablelm":case"opt":case"fa\
lcon":case"modernbert-decoder":t.num_heads="num_attention_heads",t.num_layers="num_hidden_layers",t.hidden_size="hidden_\
size";break;case"gpt_oss":case"llama":case"llama4_text":case"nanochat":case"apertus":case"arcee":case"afmoe":case"lfm2":case"\
lfm2_moe":case"lfm3":case"smollm3":case"olmo":case"olmo2":case"olmo3":case"mobilellm":case"granite":case"granitemoehybri\
d":case"cohere":case"cohere2":case"mistral":case"voxtral_realtime_text":case"voxtral_realtime_encoder":case"starcoder2":case"\
qwen2":case"qwen2_moe":case"qwen2_vl":case"qwen2_vl_text":case"qwen2_5_vl_text":case"qwen3_moe":case"qwen3_vl_text":case"\
qwen3_vl_moe_text":case"phi":case"phi3":case"phi3_v":case"llava_qwen2":t.num_heads="num_key_value_heads",t.num_layers="n\
um_hidden_layers",t.hidden_size="hidden_size",t.num_attention_heads="num_attention_heads",t.dim_kv="head_dim";break;case"\
qwen3":case"solar_open":case"glm_ocr_text":case"gemma":case"gemma2":case"vaultgemma":case"gemma3_text":case"gemma3n_text":case"\
gemma4_text":case"glm":case"helium":case"ernie4_5":case"hunyuan_v1_dense":case"falcon_h1":case"nemotron_h":case"ministra\
l":case"ministral3":t.num_heads="num_key_value_heads",t.num_layers="num_hidden_layers",t.dim_kv="head_dim";break;case"op\
enelm":t.num_heads="num_kv_heads",t.num_layers="num_transformer_layers",t.dim_kv="head_dim";break;case"gpt_neo":case"don\
ut-swin":t.num_heads="num_heads",t.num_layers="num_layers",t.hidden_size="hidden_size";break;case"bloom":t.num_heads="n_\
head",t.num_layers="n_layer",t.hidden_size="hidden_size";break;case"mpt":t.num_heads="n_heads",t.num_layers="n_layers",t.
hidden_size="d_model";break;case"exaone":t.num_heads="num_key_value_heads",t.num_layers="num_layers",t.dim_kv="head_dim",
t.num_attention_heads="num_attention_heads";break;case"youtu":case"deepseek_v3":case"deepseek_v4":case"glm_moe_dsa":case"\
mistral4":t.num_heads="num_key_value_heads",t.num_layers="num_hidden_layers",t.dim_kv=e.model_type==="deepseek_v4"?"head\
_dim":"qk_head_dim",t.num_attention_heads="num_attention_heads";break;case"zaya":t.num_heads="num_key_value_heads",t.num_layers=
"num_hidden_layers",t.hidden_size="hidden_size",t.dim_kv="head_dim",t.num_attention_heads="num_attention_heads";break;case"\
hrm_text":t.num_heads="num_key_value_heads",t.num_layers="num_hidden_layers",t.hidden_size="hidden_size",t.dim_kv="head_\
dim",t.num_attention_heads="num_attention_heads";break;case"t5":case"mt5":case"longt5":t.num_decoder_layers="num_decoder\
_layers",t.num_decoder_heads="num_heads",t.decoder_dim_kv="d_kv",t.num_encoder_layers="num_layers",t.num_encoder_heads="\
num_heads",t.encoder_dim_kv="d_kv";break;case"bart":case"mbart":case"marian":case"whisper":case"lite-whisper":case"m2m_1\
00":case"blenderbot":case"blenderbot-small":case"florence2_language":t.num_decoder_layers="decoder_layers",t.num_decoder_heads=
"decoder_attention_heads",t.decoder_hidden_size="d_model",t.num_encoder_layers="encoder_layers",t.num_encoder_heads="enc\
oder_attention_heads",t.encoder_hidden_size="d_model";break;case"speecht5":t.num_decoder_layers="decoder_layers",t.num_decoder_heads=
"decoder_attention_heads",t.decoder_hidden_size="hidden_size",t.num_encoder_layers="encoder_layers",t.num_encoder_heads=
"encoder_attention_heads",t.encoder_hidden_size="hidden_size";break;case"trocr":t.num_encoder_layers=t.num_decoder_layers=
"decoder_layers",t.num_encoder_heads=t.num_decoder_heads="decoder_attention_heads",t.encoder_hidden_size=t.decoder_hidden_size=
"d_model";break;case"musicgen_decoder":t.num_encoder_layers=t.num_decoder_layers="num_hidden_layers",t.num_encoder_heads=
t.num_decoder_heads="num_attention_heads",t.encoder_hidden_size=t.decoder_hidden_size="hidden_size";break;case"moonshine":
t.num_decoder_layers="decoder_num_hidden_layers",t.num_decoder_heads="decoder_num_key_value_heads",t.num_encoder_layers=
"encoder_num_hidden_layers",t.num_encoder_heads="encoder_num_key_value_heads",t.encoder_hidden_size=t.decoder_hidden_size=
"hidden_size";break;case"cohere_asr":t.num_decoder_layers="num_hidden_layers",t.num_decoder_heads="num_key_value_heads",
t.decoder_hidden_size="hidden_size",t.decoder_dim_kv="head_dim";const{num_hidden_layers:n,num_attention_heads:a,hidden_size:o}=e.
encoder_config;r={num_encoder_layers:n,num_encoder_heads:a,encoder_hidden_size:o,encoder_dim_kv:e.head_dim};break;case"v\
ision-encoder-decoder":const i=_s(e.decoder),l="num_decoder_layers"in i,c=Ze(e,["model_type","is_encoder_decoder"]);return l?
(c.num_decoder_layers=i.num_decoder_layers,c.num_decoder_heads=i.num_decoder_heads,c.decoder_hidden_size=i.decoder_hidden_size,
c.num_encoder_layers=i.num_encoder_layers,c.num_encoder_heads=i.num_encoder_heads,c.encoder_hidden_size=i.encoder_hidden_size):
(c.num_layers=i.num_layers,c.num_heads=i.num_heads,c.hidden_size=i.hidden_size),c}const s={...r,...Ze(e,["model_type","m\
ulti_query","is_encoder_decoder"])};for(const n in t)s[n]=e[t[n]];return s}function Oa(e,t){e instanceof Ei||(e=new Ei(e));
const r=t?.prefix??"past_key_values",s=r==="present"?"present":"past",n=new Set;if(["lfm2","lfm2_moe","lfm3"].includes(e.
model_type)){const{layer_types:a}=e;for(let o=0;o<a.length;++o)if(a[o]==="full_attention"||a[o]==="sliding_attention")n.
add(`${r}.${o}.key`),n.add(`${r}.${o}.value`);else if(a[o]==="conv")n.add(`${s}_conv.${o}`);else throw new Error(`Unsupp\
orted layer type: ${a[o]}`);return n}else if(["granitemoehybrid","falcon_h1","nemotron_h"].includes(e.model_type)){const a=e,
o=a.layer_types??a.layers_block_type,i=a.num_hidden_layers??o?.length;for(let l=0;l<i;++l)(!o||o[l]==="mamba")&&(n.add(`${s}\
_conv.${l}`),n.add(`${s}_ssm.${l}`)),(!o||o[l]==="attention")&&(n.add(`${r}.${l}.key`),n.add(`${r}.${l}.value`));return n}else if([
"qwen3_next","qwen3_5_text","qwen3_5_moe_text","olmo_hybrid"].includes(e.model_type)){const{layer_types:a}=e;for(let o=0;o<
a.length;++o)if(a[o]==="full_attention")n.add(`${r}.${o}.key`),n.add(`${r}.${o}.value`);else if(a[o]==="linear_attention")
e.model_type==="olmo_hybrid"?(n.add(`${s}_conv.${o}.key`),n.add(`${s}_conv.${o}.value`),n.add(`${s}_conv.${o}.query`)):n.
add(`${s}_conv.${o}`),n.add(`${s}_recurrent.${o}`);else throw new Error(`Unsupported layer type: ${a[o]}`);return n}else if([
"gemma4","gemma4_text"].includes(e.model_type)){const a=e.model_type==="gemma4"?e.text_config:e,o=a.num_hidden_layers,i=a.
num_kv_shared_layers??0,l=o-i;for(let c=0;c<l;++c)n.add(`${r}.${c}.key`),n.add(`${r}.${c}.value`);return n}else if(e.model_type===
"deepseek_v4"){const{layer_types:a,num_hidden_layers:o}=e;for(let i=0;i<o;++i){n.add(`${r}.${i}.key`),n.add(`${r}.${i}.v\
alue`);const l=a[i];if(l==="compressed_sparse_attention")n.add(`${s}_compressor.${i}.kv`),n.add(`${s}_compressor.${i}.ga\
te`),n.add(`${s}_indexer.${i}.kv`),n.add(`${s}_indexer.${i}.gate`);else if(l==="heavily_compressed_attention")n.add(`${s}\
_compressor.${i}.kv`),n.add(`${s}_compressor.${i}.gate`);else if(l&&l!=="sliding_attention")throw new Error(`Unsupported\
 layer type: ${l}`)}return n}else if(e.model_type==="zaya"){const{num_hidden_layers:a,cca_time1:o}=e,i=o??1;for(let l=0;l<
a;l+=i)n.add(`${r}.${l}.key`),n.add(`${r}.${l}.value`),n.add(`${r}.${l}.conv_state`),n.add(`${r}.${l}.shift_state`);return n}else if([
"lfm2_vl","lfm3_vl","qwen3_5","qwen3_5_moe","voxtral_realtime"].includes(e.model_type)){let a;return e.model_type==="vox\
tral_realtime"&&t?.session_name==="audio_encoder"?a=e.audio_config:a=e.text_config,Oa(a,t)}return vC(e,{prefix:r})}function vC(e,{
prefix:t="past_key_values"}={}){const r=new Set,s=e.normalized_config;if(s.is_encoder_decoder&&"num_encoder_heads"in s&&
"num_decoder_heads"in s)for(let n=0;n<s.num_decoder_layers;++n)r.add(`${t}.${n}.encoder.key`),r.add(`${t}.${n}.encoder.v\
alue`),r.add(`${t}.${n}.decoder.key`),r.add(`${t}.${n}.decoder.value`);else if(s.multi_query)for(let n=0;n<s.num_layers;++n)
r.add(`${t}.${n}.key_value`);else for(let n=0;n<s.num_layers;++n)r.add(`${t}.${n}.key`),r.add(`${t}.${n}.value`);return r}
var Ei=class Ai{model_type=null;is_encoder_decoder=!1;max_position_embeddings;"transformers.js_config";constructor(t){Object.
assign(this,t),this.normalized_config=_s(this)}static async from_pretrained(t,{progress_callback:r=null,config:s=null,cache_dir:n=null,
local_files_only:a=!1,revision:o="main"}={}){s&&!(s instanceof Ai)&&(s=new Ai(s));const i=s??await wC(t,{progress_callback:r,
config:s,cache_dir:n,local_files_only:a,revision:o});return new this(i)}},un=class{static async from_pretrained(...e){return Ei.
from_pretrained(...e)}};function lg(e,t,r){return e?typeof e=="object"&&e!==null?e.hasOwnProperty(t)?+e[t]:e.hasOwnProperty(
r)?+e[r]:0:+e:0}function cg(e,t){const r=[];for(let s=0;s<t;++s)r.push(`${e}_data${s===0?"":"_"+s}`);return r}async function yC(e,t,r,s){
const n=`${t}${s}.onnx`,a=`${r.subfolder??""}/${n}`;return await Ma(e,a,!0,r,fe.IS_NODE_ENV)}async function bC(e,t,r,s,n,a={}){
const o=`${t}${r}.onnx`,i=fe.IS_NODE_ENV;let l=[];const c=lg(n,o,t);if(c>0){if(c>s_)throw new Error(`The number of exter\
nal data chunks (${c}) exceeds the maximum allowed value (${s_}).`);const d=cg(o,c);for(const h of d){const _=`${s.subfolder??
""}/${h}`;l.push(Ma(e,_,!0,s,i).then(p=>p instanceof Uint8Array?{path:h,data:p}:h))}}else a.externalData!==void 0&&(l=a.
externalData.map(async d=>{if(typeof d.data=="string"){const h=await Ma(e,d.data,!0,s);return{...d,data:h}}return d}));return Promise.
all(l)}async function MC(e,t,r,s=!1,n=void 0){let a=r.config?.["transformers.js_config"]??{};const o=mm(r.device??a.device,
t,{warn:k=>de.info(k)}),i=jT(o),l=a.device_config??{};l.hasOwnProperty(o)&&(a={...a,...l[o]});const c=gm(r.dtype??a.dtype,
t,o,{configDtype:a.dtype,warn:k=>de.info(k)});if(on.hasOwnProperty(c)){if(o==="webgpu"&&!fe.IS_NODE_ENV&&c===Qe.fp16&&!await HT())
throw new Error(`The device (${o}) does not support fp16.`)}else throw new Error(`Invalid dtype: ${c}. Should be one of:\
 ${Object.keys(Qe).join(", ")}`);const d=on[c],h={...r.session_options};h.executionProviders??=i;const _=a.free_dimension_overrides;
_?h.freeDimensionOverrides??=_:o.startsWith("webnn")&&!h.freeDimensionOverrides&&de.warn(`WebNN does not currently suppo\
rt dynamic shapes and requires 'free_dimension_overrides' to be set in config.json, preferably as a field within config[\
"transformers.js_config"]["device_config"]["${o}"]. When 'free_dimension_overrides' is not set, you may experience signi\
ficant performance degradation.`);const p=yC(e,t,r,d),w=r.use_external_data_format??a.use_external_data_format,v=await bC(
e,t,d,r,w,h);if(v.length>0&&(!fe.IS_NODE_ENV||v.some(k=>typeof k!="string"))&&(h.externalData=v),s&&o==="webgpu"){const k=Oa(
r.config,{prefix:"present",session_name:n});if(k.size>0&&!al()){const A={};for(const E of k)A[E]="gpu-buffer";h.preferredOutputLocation=
A}}return{buffer_or_path:await p,session_options:h,session_config:{dtype:c,device:o}}}async function xC(e,t,r,s=void 0){
return Object.fromEntries(await Promise.all(Object.keys(t).map(async n=>{const a=s?.[n]??!1,{buffer_or_path:o,session_options:i,
session_config:l}=await MC(e,t[n],r,a,n),c=await fm(o,i,l);return[n,c]})))}function ug(e){for(let t in e)pm(e[t])?e[t]=new G(
e[t]):typeof e[t]=="object"&&ug(e[t]);return e}async function ve(e,t){const r=kC(e,t);try{const s=Object.fromEntries(Object.
entries(r).map(([a,o])=>{const i=o.ort_tensor;return fe.IS_NODE_ENV&&typeof Float16Array<"u"&&i.cpuData instanceof Float16Array&&
(i.cpuData=new Uint16Array(i.cpuData.buffer)),[a,i]})),n=await _m(e,s);return ug(n)}catch(s){const n=Object.fromEntries(
Object.entries(r).map(([a,o])=>{const i={type:o.type,dims:o.dims,location:o.location};return i.location!=="gpu-buffer"&&
(i.data=o.data),[a,i]}));throw de.error(`An error occurred during model execution: "${s}".`),de.error("Inputs given to m\
odel:",n),s}}function kC(e,t){const r=Object.create(null),s=[];for(const o of e.inputNames){const i=t[o];if(!(i instanceof
G)){s.push(o);continue}r[o]=al()?i.clone():i}if(s.length>0)throw new Error(`An error occurred during model execution: "M\
issing the following inputs: ${s.join(", ")}.`);const n=Object.keys(t).length,a=e.inputNames.length;if(n>a){let o=Object.
keys(t).filter(i=>!e.inputNames.includes(i));de.warn(`WARNING: Too many inputs were provided (${n} > ${a}). The followin\
g inputs will be ignored: "${o.join(", ")}".`)}return r}var Ve=class{},TC=class extends Ve{constructor({last_hidden_state:e,
hidden_states:t=null,attentions:r=null}){super(),this.last_hidden_state=e,this.hidden_states=t,this.attentions=r}},ie=class extends Ve{constructor({
logits:e,...t}){super(),this.logits=e;const r=Object.values(t);r.length>0&&(this.attentions=r)}},He=class extends Ve{constructor({
logits:e}){super(),this.logits=e}},Xe=class extends Ve{constructor({logits:e}){super(),this.logits=e}},ot=class extends Ve{constructor({
start_logits:e,end_logits:t}){super(),this.start_logits=e,this.end_logits=t}},Pr=class extends Ve{constructor({logits:e}){
super(),this.logits=e}},EC=class extends Ve{constructor({logits:e,past_key_values:t}){super(),this.logits=e,this.past_key_values=
t}},AC=class extends Ve{constructor({logits:e,past_key_values:t,encoder_outputs:r,decoder_attentions:s=null,cross_attentions:n=null}){
super(),this.logits=e,this.past_key_values=t,this.encoder_outputs=r,this.decoder_attentions=s,this.cross_attentions=n}},
dg=class extends Ve{constructor({alphas:e}){super(),this.alphas=e}},jt=class extends ft{_call(e,t){throw Error("`_call` \
should be implemented in a subclass")}},bl=class extends ft{_call(e,t){throw Error("`_call` should be implemented in a s\
ubclass")}},Ci=class extends ft{constructor(){super(),this.processors=[]}push(e){this.processors.push(e)}extend(e){this.
processors.push(...e)}_call(e,t){let r=t;for(const s of this.processors)r=s(e,r);return r}[Symbol.iterator](){return this.
processors.values()}},CC=class extends jt{constructor(e){super(),this.bos_token_id=e}_call(e,t){for(let r=0;r<e.length;++r)
if(e[r].length===1){const s=t[r].data;s.fill(-1/0),s[this.bos_token_id]=0}return t}},SC=class extends jt{constructor(e,t){
super(),this.max_length=e,this.eos_token_id=Array.isArray(t)?t:[t]}_call(e,t){for(let r=0;r<e.length;++r)if(e[r].length===
this.max_length-1){const s=t[r].data;s.fill(-1/0);for(const n of this.eos_token_id)s[n]=0}return t}},PC=class extends jt{constructor(e){
super(),this.suppress_tokens=e}_call(e,t){for(let r=0;r<e.length;++r){const s=t[r].data;for(const n of this.suppress_tokens)
s[n]=-1/0}return t}},hg=class extends jt{constructor(e,t){super(),this.begin_suppress_tokens=e,this.begin_index=t}_call(e,t){
for(let r=0;r<e.length;++r)if(e[r].length===this.begin_index){const s=t[r].data;for(const n of this.begin_suppress_tokens)
s[n]=-1/0}return t}},FC=class extends jt{constructor(e,t){super(),this.eos_token_id=Array.isArray(e.eos_token_id)?e.eos_token_id[0]:
e.eos_token_id,this.no_timestamps_token_id=e.no_timestamps_token_id,this.timestamp_begin=this.no_timestamps_token_id+1,this.
begin_index=t.length,t.at(-1)===this.no_timestamps_token_id&&(this.begin_index-=1),this.max_initial_timestamp_index=e.max_initial_timestamp_index}_call(e,t){
for(let r=0;r<e.length;++r){const s=t[r].data;if(s[this.no_timestamps_token_id]=-1/0,e[r].length===this.begin_index){s.subarray(
0,this.timestamp_begin).fill(-1/0);continue}const n=e[r].slice(this.begin_index),a=n.length>=1&&n[n.length-1]>=this.timestamp_begin,
o=n.length<2||n[n.length-2]>=this.timestamp_begin;if(a&&(o?s.subarray(this.timestamp_begin).fill(-1/0):s.subarray(0,this.
eos_token_id).fill(-1/0)),e[r].length===this.begin_index&&this.max_initial_timestamp_index!==null){const d=this.timestamp_begin+
this.max_initial_timestamp_index;s.subarray(d+1).fill(-1/0)}const i=ST(s),l=Math.log(i.subarray(this.timestamp_begin).map(
Math.exp).reduce((d,h)=>d+h)),c=We(i.subarray(0,this.timestamp_begin))[0];l>c&&s.subarray(0,this.timestamp_begin).fill(-1/0)}
return t}},IC=class extends jt{constructor(e){super(),this.no_repeat_ngram_size=e}getNgrams(e){const t=e.length,r=[];for(let n=0;n<
t+1-this.no_repeat_ngram_size;++n){const a=[];for(let o=0;o<this.no_repeat_ngram_size;++o)a.push(e[n+o]);r.push(a.map(Number))}
const s=new Map;for(const n of r){const a=n.slice(0,n.length-1),o=JSON.stringify(a),i=s.get(o)??[];i.push(n[n.length-1]),
s.set(o,i)}return s}getGeneratedNgrams(e,t){const r=t.slice(t.length+1-this.no_repeat_ngram_size,t.length);return e.get(
JSON.stringify(r.map(Number)))??[]}calcBannedNgramTokens(e){const t=[];if(e.length+1<this.no_repeat_ngram_size)return t;
{const r=this.getNgrams(e);return this.getGeneratedNgrams(r,e)}}_call(e,t){for(let r=0;r<e.length;++r){const s=t[r].data,
n=this.calcBannedNgramTokens(e[r]);for(const a of n)s[a]=-1/0}return t}},LC=class extends jt{constructor(e){super(),this.
penalty=e}_call(e,t){for(let r=0;r<e.length;++r){const s=t[r].data;for(const n of new Set(e[r])){const a=Number(n);s[a]<
0?s[a]*=this.penalty:s[a]/=this.penalty}}return t}},OC=class extends jt{constructor(e,t){super(),this.min_length=e,this.
eos_token_id=Array.isArray(t)?t:[t]}_call(e,t){for(let r=0;r<e.length;++r)if(e[r].length<this.min_length){const s=t[r].data;
for(const n of this.eos_token_id)s[n]=-1/0}return t}},NC=class extends jt{constructor(e,t,r){super(),this.prompt_length_to_skip=
e,this.min_new_tokens=t,this.eos_token_id=Array.isArray(r)?r:[r]}_call(e,t){for(let r=0;r<e.length;++r)if(e[r].length-this.
prompt_length_to_skip<this.min_new_tokens){const n=t[r].data;for(const a of this.eos_token_id)n[a]=-1/0}return t}},DC=class extends jt{constructor(e,t){
super(),this.bad_words_ids=e,this.eos_token_id=Array.isArray(t)?t:[t]}_call(e,t){for(let r=0;r<e.length;++r){const s=t[r].
data,n=e[r];for(const a of this.bad_words_ids){if(n.length<a.length-1)continue;let o=!0;for(let i=1;i<=a.length-1;++i)if(a.
at(-i-1)!=n.at(-i)){o=!1;break}o&&(s[a.at(-1)]=-1/0)}}return t}},zC=class extends jt{constructor(e){if(super(),e<=1)throw new Error(
`Require guidance scale >1 to use the classifier-free guidance processor, got guidance scale ${e}.`);this.guidance_scale=
e}_call(e,t){if(t.dims[0]!==2*e.length)throw new Error(`Logits should have twice the batch size of the input ids, the fi\
rst half of batches corresponding to the conditional inputs, and the second half of batches corresponding to the uncondi\
tional inputs. Got batch size ${t.dims[0]} for the logits and ${e.length} for the input ids.`);const r=e.length,s=t.slice(
[0,r],null),n=t.slice([r,t.dims[0]],null);for(let a=0;a<n.data.length;++a)n.data[a]+=(s.data[a]-n.data[a])*this.guidance_scale;
return n}},BC=class extends bl{constructor(e){super(),this.temperature=e}_call(e,t){const r=t.data;for(let s=0;s<r.length;++s)
r[s]/=this.temperature;return t}},dz=class extends bl{constructor(e,{filter_value:t=-1/0,min_tokens_to_keep:r=1}={}){if(super(),
e<0||e>1)throw new Error(`\`top_p\` must be a float > 0 and < 1, but is ${e}`);if(!Number.isInteger(r)||r<1)throw new Error(
`\`min_tokens_to_keep\` must be a positive integer, but is ${r}`);this.top_p=e,this.filter_value=t,this.min_tokens_to_keep=
r}},hz=class extends bl{constructor(e,{filter_value:t=-1/0,min_tokens_to_keep:r=1}={}){if(super(),!Number.isInteger(e)||
e<0)throw new Error(`\`top_k\` must be a positive integer, but is ${e}`);this.top_k=Math.max(e,r),this.filter_value=t}},
fg=class{max_length=20;max_new_tokens=null;min_length=0;min_new_tokens=null;early_stopping=!1;max_time=null;do_sample=!1;num_beams=1;num_beam_groups=1;penalty_alpha=null;use_cache=!0;temperature=1;top_k=50;top_p=1;typical_p=1;epsilon_cutoff=0;eta_cutoff=0;diversity_penalty=0;repetition_penalty=1;encoder_repetition_penalty=1;length_penalty=1;no_repeat_ngram_size=0;bad_words_ids=null;force_words_ids=null;renormalize_logits=!1;constraints=null;forced_bos_token_id=null;forced_eos_token_id=null;remove_invalid_values=!1;exponential_decay_length_penalty=null;suppress_tokens=null;streamer=null;begin_suppress_tokens=null;forced_decoder_ids=null;guidance_scale=null;num_return_sequences=1;output_attentions=!1;output_hidden_states=!1;output_scores=!1;return_dict_in_generate=!1;pad_token_id=null;bos_token_id=null;eos_token_id=null;encoder_no_repeat_ngram_size=0;decoder_start_token_id=null;generation_kwargs={};constructor(e){
Object.assign(this,Ze(e,Object.getOwnPropertyNames(this)))}},gn=class extends ft{_call(e,t){throw Error("StoppingCriteri\
a needs to be subclassed")}},_g=class pg extends ft{constructor(){super(),this.criteria=[]}push(t){this.criteria.push(t)}extend(t){
t instanceof pg?t=t.criteria:t instanceof gn&&(t=[t]),this.criteria.push(...t)}_call(t,r){const s=new Array(t.length).fill(
!1);for(const n of this.criteria){const a=n(t,r);for(let o=0;o<s.length;++o)s[o]||=a[o]}return s}[Symbol.iterator](){return this.
criteria.values()}},RC=class extends gn{constructor(e,t=null){super(),this.max_length=e,this.max_position_embeddings=t}_call(e){
return e.map(t=>t.length>=this.max_length)}},$C=class extends gn{constructor(e){super(),Array.isArray(e)||(e=[e]),this.eos_token_id=
e}_call(e,t){return e.map(r=>{const s=r.at(-1);return this.eos_token_id.some(n=>s==n)})}},fz=class extends gn{constructor(){
super(),this.interrupted=!1}interrupt(){this.interrupted=!0}reset(){this.interrupted=!1}_call(e,t){return new Array(e.length).
fill(this.interrupted)}},Na=class extends ft{constructor(e){super(),this.generation_config=e}async _call(e){return this.
sample(e)}async sample(e){throw Error("sample should be implemented in subclasses.")}getLogits(e,t){let r=e.dims.at(-1),
s=e.data;if(t===-1)s=s.slice(-r);else{let n=t*r;s=s.slice(n,n+r)}return s}randomSelect(e){return hT(e)}static getSampler(e){
if(e.do_sample)return new VC(e);if(e.num_beams>1)return new UC(e);if(e.num_return_sequences>1)throw Error(`num_return_se\
quences has to be 1 when doing greedy search, but is ${e.num_return_sequences}.`);return new GC(e)}},GC=class extends Na{async sample(e){
const t=We(e.data)[1];return[[BigInt(t),0]]}},VC=class extends Na{async sample(e){let t=e.dims.at(-1);this.generation_config.
top_k>0&&(t=Math.min(this.generation_config.top_k,t));const[r,s]=await As(e,t),n=st(r.data);return Array.from({length:this.
generation_config.num_beams},()=>{const a=this.randomSelect(n);return[s.data[a],Math.log(n[a])]})}},UC=class extends Na{async sample(e){
let t=e.dims.at(-1);this.generation_config.top_k>0&&(t=Math.min(this.generation_config.top_k,t));const[r,s]=await As(e,t),
n=st(r.data);return Array.from({length:this.generation_config.num_beams},(a,o)=>[s.data[o],Math.log(n[o])])}},jC=class{constructor(e){
if(e)for(const t in e){if(t in this)throw new TypeError(`Key "${t}" conflicts with an existing property on DynamicCache`);
const r=e[t];if(!(r instanceof G))throw new TypeError(`Expected a Tensor for key "${t}", got ${typeof r}`);this[t]=r}}get_seq_length(){
const e=this;if(Object.keys(e).length===0)return 0;for(const t in e)if(t.startsWith("past_key_values."))return e[t].dims.
at(-2);throw new Error("Unable to determine sequence length from the cache.")}update(e){for(const t in e){const r=this[t],
s=e[t];r&&r!==s&&r.location==="gpu-buffer"&&r.dispose(),this[t]=s}}async dispose(){const e=[];for(const t of Object.values(
this))t.location==="gpu-buffer"&&e.push(t.dispose());await Promise.all(e)}},Ml=jC,W={EncoderOnly:0,EncoderDecoder:1,Seq2Seq:2,
Vision2Seq:3,DecoderOnly:4,DecoderOnlyWithoutHead:5,MaskGeneration:6,ImageTextToText:7,Musicgen:8,MultiModality:9,Phi3V:10,
AudioTextToText:11,AutoEncoder:12,ImageAudioTextToText:13,Supertonic:14,Chatterbox:15,VoxtralRealtime:16,MultimodalEncoder:17},
lr={[W.DecoderOnly]:{sessions:(e,t)=>({model:t.model_file_name??"model"}),cache_sessions:{model:!0},optional_configs:{generation_config:"\
generation_config.json"}},[W.DecoderOnlyWithoutHead]:{sessions:(e,t)=>({model:t.model_file_name??"model"})},[W.Seq2Seq]:{
sessions:()=>({model:"encoder_model",decoder_model_merged:"decoder_model_merged"}),cache_sessions:{decoder_model_merged:!0},
optional_configs:{generation_config:"generation_config.json"}},[W.Vision2Seq]:{sessions:()=>({model:"encoder_model",decoder_model_merged:"\
decoder_model_merged"}),cache_sessions:{decoder_model_merged:!0},optional_configs:{generation_config:"generation_config.\
json"}},[W.Musicgen]:{sessions:()=>({model:"text_encoder",decoder_model_merged:"decoder_model_merged",encodec_decode:"en\
codec_decode"}),cache_sessions:{decoder_model_merged:!0},optional_configs:{generation_config:"generation_config.json"}},
[W.EncoderDecoder]:{sessions:()=>({model:"encoder_model",decoder_model_merged:"decoder_model_merged"}),cache_sessions:{decoder_model_merged:!0}},
[W.MaskGeneration]:{sessions:()=>({model:"vision_encoder",prompt_encoder_mask_decoder:"prompt_encoder_mask_decoder"})},[W.
ImageTextToText]:{text_only_sessions:{embed_tokens:"embed_tokens",decoder_model_merged:"decoder_model_merged"},sessions:(e,t,r)=>{
const s={...lr[W.ImageTextToText].text_only_sessions};return r||(s.vision_encoder="vision_encoder"),e.is_encoder_decoder&&
(s.model="encoder_model"),s},cache_sessions:{decoder_model_merged:!0},optional_configs:{generation_config:"generation_co\
nfig.json"}},[W.AudioTextToText]:{text_only_sessions:{embed_tokens:"embed_tokens",decoder_model_merged:"decoder_model_me\
rged"},sessions:(e,t,r)=>{const s={...lr[W.AudioTextToText].text_only_sessions};return r||(s.audio_encoder="audio_encode\
r"),s},cache_sessions:{decoder_model_merged:!0},optional_configs:{generation_config:"generation_config.json"}},[W.ImageAudioTextToText]:{
text_only_sessions:{embed_tokens:"embed_tokens",decoder_model_merged:"decoder_model_merged"},sessions:(e,t,r)=>{const s={
...lr[W.ImageAudioTextToText].text_only_sessions};return r||(s.audio_encoder="audio_encoder",s.vision_encoder="vision_en\
coder"),s},cache_sessions:{decoder_model_merged:!0},optional_configs:{generation_config:"generation_config.json"}},[W.Phi3V]:{
sessions:()=>({prepare_inputs_embeds:"prepare_inputs_embeds",model:"model",vision_encoder:"vision_encoder"}),cache_sessions:{
model:!0},optional_configs:{generation_config:"generation_config.json"}},[W.MultiModality]:{sessions:()=>({prepare_inputs_embeds:"\
prepare_inputs_embeds",model:"language_model",lm_head:"lm_head",gen_head:"gen_head",gen_img_embeds:"gen_img_embeds",image_decode:"\
image_decode"}),cache_sessions:{model:!0},optional_configs:{generation_config:"generation_config.json"}},[W.AutoEncoder]:{
sessions:()=>({encoder_model:"encoder_model",decoder_model:"decoder_model"})},[W.Supertonic]:{sessions:()=>({text_encoder:"\
text_encoder",latent_denoiser:"latent_denoiser",voice_decoder:"voice_decoder"})},[W.Chatterbox]:{sessions:()=>({embed_tokens:"\
embed_tokens",speech_encoder:"speech_encoder",model:"language_model",conditional_decoder:"conditional_decoder"}),cache_sessions:{
model:!0},optional_configs:{generation_config:"generation_config.json"}},[W.VoxtralRealtime]:{text_only_sessions:{embed_tokens:"\
embed_tokens",decoder_model_merged:"decoder_model_merged"},sessions:(e,t,r)=>{const s={...lr[W.VoxtralRealtime].text_only_sessions};
return r||(s.audio_encoder="audio_encoder"),s},cache_sessions:{decoder_model_merged:!0,audio_encoder:!0},optional_configs:{
generation_config:"generation_config.json"}},[W.MultimodalEncoder]:{sessions:(e,t)=>({model:t.model_file_name??"model",...e.
vision_config&&{vision_encoder:"vision_encoder"},...e.audio_config&&{audio_encoder:"audio_encoder"}})},default:{sessions:(e,t)=>({
model:t.model_file_name??"model"})}};function qC(e){return lr[e]?.text_only_sessions??null}function mg(e,t,r={}){const s=lr[e]??
lr.default;return{sessions:s.sessions(t,r,r.textOnly??!1),cache_sessions:s.cache_sessions,optional_configs:s.optional_configs}}
function xl(e,{warn:t=!0}={}){const r=e.architectures||[];for(const s of r){const n=cr.get(s);if(n!==void 0)return n}if(e.
model_type){const s=cr.get(e.model_type);if(s!==void 0)return s;for(const n of Object.values(ms))if(n.has(e.model_type)){
const a=cr.get(n.get(e.model_type));if(a!==void 0)return a}}if(t){const s=r.length>0?r.join(", "):"(none)";de.warn(`[res\
olve_model_type] Architecture(s) not found in MODEL_TYPE_MAPPING: [${s}] for model type '${e.model_type}'. Falling back \
to EncoderOnly (single model.onnx file). If you encounter issues, please report at: ${Ia}`)}return W.EncoderOnly}function kl(e,{
config:t=null,cache_dir:r=null,local_files_only:s=!1,revision:n="main"}={}){if(t!==null)return un.from_pretrained(e,{config:t,
cache_dir:r,local_files_only:s,revision:n});const a=sl(e,{cache_dir:r,local_files_only:s,revision:n});return im(a,()=>un.
from_pretrained(e,{config:t,cache_dir:r,local_files_only:s,revision:n}))}async function Tl(e,{config:t=null,dtype:r=null,
device:s=null,model_file_name:n=null}={}){t=await kl(e,{config:t});const a=["config.json"],o=t["transformers.js_config"]??
{},i=o.use_external_data_format,l="onnx",c=s??o.device;let d=r??o.dtype;const h=xl(t),_=(v,y=null)=>{y=y??v;const b=mm(c,
v),k=gm(d,v,b),A=on[k]??"",E=`${y}${A}.onnx`,C=`${l}/${E}`;a.push(C);const N=lg(i,E,v);for(const M of cg(E,N)){const $=`${l}\
/${M}`;a.push($)}},{sessions:p,optional_configs:w}=mg(h,t,{model_file_name:n});for(const[v,y]of Object.entries(p))_(v,y);
if(w)for(const v of Object.values(w))a.push(v);return a}var ms=null;function WC(e){ms=e}function Si(e){if(e instanceof G)
return e;if(e.length===0)throw Error("items must be non-empty");if(Array.isArray(e[0])){if(e.some(t=>t.length!==e[0].length))
throw Error("Unable to create tensor, you should probably activate truncation and/or padding with 'padding=True' and/or \
'truncation=True' to have batched tensors with the same length.");return new G("int64",BigInt64Array.from(e.flat().map(t=>BigInt(
t))),[e.length,e[0].length])}else return new G("int64",BigInt64Array.from(e.map(t=>BigInt(t))),[1,e.length])}function gg(e){
return new G("bool",[e],[1])}var E_={[W.DecoderOnly]:{can_generate:!0,forward:dr,prepare_inputs:Ms},[W.DecoderOnlyWithoutHead]:{
can_generate:!1,forward:dr,prepare_inputs:Ms},[W.Seq2Seq]:{can_generate:!0,forward:Zn,prepare_inputs:ka},[W.Vision2Seq]:{
can_generate:!0,forward:Zn,prepare_inputs:ka},[W.Musicgen]:{can_generate:!0,forward:Zn},[W.EncoderDecoder]:{can_generate:!1,
forward:Zn},[W.ImageTextToText]:{can_generate:!0,forward:YC,prepare_inputs:ea},[W.AudioTextToText]:{can_generate:!0,forward:XC,
prepare_inputs:ea},[W.ImageAudioTextToText]:{can_generate:!0,prepare_inputs:ea},[W.Phi3V]:{can_generate:!0,prepare_inputs:ea},
[W.MultiModality]:{can_generate:!0},[W.AutoEncoder]:{can_generate:!1,forward:HC},[W.Chatterbox]:{can_generate:!0,forward:Sr},
[W.VoxtralRealtime]:{can_generate:!0,prepare_inputs:Ms},default:{can_generate:!1,forward:Sr}};function A_(e,t){let r=cr.
get(e),s=!1;const n=t?.architectures?.[0];if(n&&n!==e&&e?.endsWith("ForCausalLM")&&n.endsWith("ForConditionalGeneration")){
const i=cr.get(n);i!==void 0&&(r=i,s=!0)}const a=E_[r]??E_.default,o=lr[r]??lr.default;return{typeConfig:{...a,...o},textOnly:s,
modelType:r}}var cr=new Map,El=new Map,bs=new Map,F=class extends ft{main_input_name="input_ids";forward_params=["input_\
ids","attention_mask"];_return_dict_in_generate_keys=null;constructor(e,t,r){super(),this.config=e,this.sessions=t,this.
configs=r;const s=bs.get(this.constructor),{typeConfig:n}=A_(s,e);this.can_generate=n.can_generate,this._forward=n.forward,
this._prepare_inputs_for_generation=n.prepare_inputs,this.can_generate&&this.forward_params.push("past_key_values"),this.
custom_config=this.config["transformers.js_config"]??{}}async dispose(){const e=[];for(const t of Object.values(this.sessions))
e.push(t.release?.());return await Promise.all(e)}static async from_pretrained(e,{progress_callback:t=null,config:r=null,
cache_dir:s=null,local_files_only:n=!1,revision:a="main",model_file_name:o=null,subfolder:i="onnx",device:l=null,dtype:c=null,
use_external_data_format:d=null,session_options:h={}}={}){const _={progress_callback:t,config:r,cache_dir:s,local_files_only:n,
revision:a,model_file_name:o,subfolder:i,device:l,dtype:c,use_external_data_format:d,session_options:h},p=bs.get(this);r=
_.config=await un.from_pretrained(e,_);const{typeConfig:w,textOnly:v,modelType:y}=A_(p,r);if(y===void 0){const E=p??r?.model_type;
E!=="custom"&&de.warn(`Model type for '${E}' not found, assuming encoder-only architecture. Please report this at ${Ia}.`)}
if(t&&!(t instanceof fa)){const E={};try{const C=await Tl(e,{config:r,dtype:c,device:l,model_file_name:o});(await Promise.
all(C.map(M=>Jr(e,M,_)))).forEach((M,$)=>{if(M.exists){const R=C[$]==="config.json";E[C[$]]={loaded:R?M.size??0:0,total:M.
size??0}}})}catch(C){de.warn(`Unable to fetch model file metadata for total progress tracking: ${C}`)}Object.keys(E).length>
0&&(_.progress_callback=new fa(t,E))}const b=w.sessions(r,_,v),k=[xC(e,b,_,w.cache_sessions)];w.optional_configs&&k.push(
JC(e,w.optional_configs,_));const A=await Promise.all(k);return new this(r,...A)}async _call(e){return await this.forward(
e)}async forward(e){return await this._forward(this,e)}get generation_config(){return this.configs?.generation_config??null}_get_logits_processor(e,t,r=null){
const s=new Ci;if(e.repetition_penalty!==null&&e.repetition_penalty!==1&&s.push(new LC(e.repetition_penalty)),e.no_repeat_ngram_size!==
null&&e.no_repeat_ngram_size>0&&s.push(new IC(e.no_repeat_ngram_size)),e.bad_words_ids!==null&&s.push(new DC(e.bad_words_ids,
e.eos_token_id)),e.min_length!==null&&e.eos_token_id!==null&&e.min_length>0&&s.push(new OC(e.min_length,e.eos_token_id)),
e.min_new_tokens!==null&&e.eos_token_id!==null&&e.min_new_tokens>0&&s.push(new NC(t,e.min_new_tokens,e.eos_token_id)),e.
forced_bos_token_id!==null&&s.push(new CC(e.forced_bos_token_id)),e.forced_eos_token_id!==null&&s.push(new SC(e.max_length,
e.forced_eos_token_id)),e.suppress_tokens!==null&&s.push(new PC(e.suppress_tokens)),e.begin_suppress_tokens!==null){const n=t>
1||e.forced_bos_token_id===null?t:t+1;s.push(new hg(e.begin_suppress_tokens,n))}return e.guidance_scale!==null&&e.guidance_scale>
1&&s.push(new zC(e.guidance_scale)),e.temperature===0&&e.do_sample&&(de.warn("`do_sample` changed to false because `temp\
erature: 0` implies greedy sampling (always selecting the most likely token), which is incompatible with `do_sample: tru\
e`."),e.do_sample=!1),e.do_sample&&e.temperature!==null&&e.temperature!==1&&s.push(new BC(e.temperature)),r!==null&&s.extend(
r),s}_prepare_generation_config(e,t,r=fg){const s={...this.config};for(const a of["decoder","generator","text_config"])a in
s&&Object.assign(s,s[a]);const n=new r(s);return Object.assign(n,this.generation_config??{}),e&&Object.assign(n,e),t&&Object.
assign(n,Ze(t,Object.getOwnPropertyNames(n))),n}_get_stopping_criteria(e,t=null){const r=new _g;return e.max_length!==null&&
r.push(new RC(e.max_length,this.config.max_position_embeddings??null)),e.eos_token_id!==null&&r.push(new $C(e.eos_token_id)),
t&&r.extend(t),r}_validate_model_class(){if(!this.can_generate){const e=[ms.MODEL_FOR_CAUSAL_LM_MAPPING_NAMES,ms.MODEL_FOR_VISION_2_SEQ_MAPPING_NAMES,
ms.MODEL_FOR_SEQ_TO_SEQ_CAUSAL_LM_MAPPING_NAMES,ms.MODEL_FOR_SPEECH_SEQ_2_SEQ_MAPPING_NAMES].filter(Boolean),t=bs.get(this.
constructor),r=new Set,s=this.config.model_type;for(const a of e){const o=a?.get(s);o&&r.add(o)}let n=`The current model\
 class (${t}) is not compatible with \`.generate()\`, as it doesn't have a language model head.`;throw r.size>0&&(n+=` P\
lease use the following class instead: ${[...r].join(", ")}`),Error(n)}}prepare_inputs_for_generation(...e){if(!this._prepare_inputs_for_generation)
throw new Error("prepare_inputs_for_generation is not implemented for this model.");return this._prepare_inputs_for_generation(
this,...e)}_update_model_kwargs_for_generation({generated_input_ids:e,outputs:t,model_inputs:r,is_encoder_decoder:s}){return r.
past_key_values=Pi(t,r.past_key_values),r.input_ids=new G("int64",e.flat(),[e.length,1]),s?"decoder_attention_mask"in r&&
(r.decoder_attention_mask=Oe([r.decoder_attention_mask,_t([r.decoder_attention_mask.dims[0],1])],1)):r.attention_mask=Oe(
[r.attention_mask,_t([r.attention_mask.dims[0],1])],1),r.position_ids=null,r}_prepare_model_inputs({inputs:e,bos_token_id:t,
model_kwargs:r}){const s=Ze(r,this.forward_params),n=this.main_input_name;if(n in s){if(e)throw new Error("`inputs`: {in\
puts}` were passed alongside {input_name} which is not allowed. Make sure to either pass {inputs} or {input_name}=...")}else
s[n]=e;return{inputs_tensor:s[n],model_inputs:s,model_input_name:n}}async _prepare_encoder_decoder_kwargs_for_generation({
inputs_tensor:e,model_inputs:t,model_input_name:r,generation_config:s}){if(this.sessions.model.inputNames.includes("inpu\
ts_embeds")&&!t.inputs_embeds&&"_prepare_inputs_embeds"in this){const{input_ids:a,pixel_values:o,attention_mask:i,...l}=t,
c=await this._prepare_inputs_embeds(t);t={...l,...Ze(c,["inputs_embeds","attention_mask"])}}let{last_hidden_state:n}=await Sr(
this,t);if(s.guidance_scale!==null&&s.guidance_scale>1)n=Oe([n,xi(n,0)],0),"attention_mask"in t&&(t.attention_mask=Oe([t.
attention_mask,cl(t.attention_mask)],0));else if(t.decoder_input_ids){const a=Si(t.decoder_input_ids).dims[0];if(a!==n.dims[0]){
if(n.dims[0]!==1)throw new Error(`The encoder outputs have a different batch size (${n.dims[0]}) than the decoder inputs\
 (${a}).`);n=Oe(Array.from({length:a},()=>n),0)}}return t.encoder_outputs=n,t}_prepare_decoder_input_ids_for_generation({
batch_size:e,model_input_name:t,model_kwargs:r,decoder_start_token_id:s,bos_token_id:n,generation_config:a}){let{decoder_input_ids:o,
...i}=r;if(!(o instanceof G)){if(o)Array.isArray(o[0])||(o=Array.from({length:e},()=>o));else if(s??=n,this.config.model_type===
"musicgen")o=Array.from({length:e*this.config.decoder.num_codebooks},()=>[s]);else if(Array.isArray(s)){if(s.length!==e)
throw new Error(`\`decoder_start_token_id\` expected to have length ${e} but got ${s.length}`);o=s}else o=Array.from({length:e},
()=>[s]);o=Si(o)}return i.decoder_attention_mask=ll(o),{input_ids:o,model_inputs:i}}async generate({inputs:e=null,generation_config:t=null,
logits_processor:r=null,stopping_criteria:s=null,streamer:n=null,...a}){this._validate_model_class(),t=this._prepare_generation_config(
t,a);let{inputs_tensor:o,model_inputs:i,model_input_name:l}=this._prepare_model_inputs({inputs:e,model_kwargs:a});const c=this.
config.is_encoder_decoder;c&&("encoder_outputs"in i||(i=await this._prepare_encoder_decoder_kwargs_for_generation({inputs_tensor:o,
model_inputs:i,model_input_name:l,generation_config:t})));let d;c?{input_ids:d,model_inputs:i}=this._prepare_decoder_input_ids_for_generation(
{batch_size:i[l].dims.at(0),model_input_name:l,model_kwargs:i,decoder_start_token_id:t.decoder_start_token_id,bos_token_id:t.
bos_token_id,generation_config:t}):d=i[l];let h=d.dims.at(-1);t.max_new_tokens!==null&&(t.max_length=h+t.max_new_tokens);
const _=this._get_logits_processor(t,h,r),p=this._get_stopping_criteria(t,s),w=i[l].dims.at(0),v=Na.getSampler(t),y=new Array(
w).fill(0),b=d.tolist();n&&n.put(b);let k,A={},E={};for(;;){if(i=this.prepare_inputs_for_generation(b,i,t),k=await this.
forward(i),t.return_dict_in_generate)if(t.output_attentions){const z=QC(k);for(const I in z)I in A||(A[I]=[]),A[I].push(
z[I])}else this._return_dict_in_generate_keys&&Object.assign(E,Ze(k,this._return_dict_in_generate_keys));const R=k.logits.
slice(null,-1,null).to("float32"),j=_(b,R),Y=[];for(let z=0;z<j.dims.at(0);++z){const I=j[z],U=await v(I);for(const[X,ce]of U){
const Z=BigInt(X);y[z]+=ce,b[z].push(Z),Y.push([Z]);break}}if(n&&n.put(Y),p(b).every(z=>z))break;i=this._update_model_kwargs_for_generation(
{generated_input_ids:Y,outputs:k,model_inputs:i,is_encoder_decoder:c})}n&&n.end();const C=new G("int64",b.flat(),[b.length,
b[0].length]),N=Pi(k,i.past_key_values),M=new Set(Object.values(N));for(const R of Object.values(k))R.location==="gpu-bu\
ffer"&&!M.has(R)&&R.dispose();return"past_key_values"in a||t.return_dict_in_generate||await N.dispose(),t.return_dict_in_generate?
{sequences:C,past_key_values:N,...A,...E}:C}async _encode_input(e,t,r){if(!Object.hasOwn(this.sessions,e))throw new Error(
`Model does not have a ${e} session.`);const s=this.sessions[e];return(await ve(s,Ze(t,s.inputNames)))[r]}async encode_image(e){
return this._encode_input("vision_encoder",e,"image_features")}async encode_text(e){return this._encode_input("embed_tok\
ens",e,"inputs_embeds")}async encode_audio(e){return this._encode_input("audio_encoder",e,"audio_features")}};async function Zn(e,t){
let{encoder_outputs:r,input_ids:s,decoder_input_ids:n,decoder_attention_mask:a,...o}=t;if(!r){const i=Ze(t,e.sessions.model.
inputNames);r=(await Sr(e,i)).last_hidden_state}return o.input_ids=n,o.encoder_hidden_states=r,e.sessions.decoder_model_merged.
inputNames.includes("encoder_attention_mask")&&(o.encoder_attention_mask=t.attention_mask),a&&!o.attention_mask&&(o.attention_mask=
a),await dr(e,o,!0)}async function Sr(e,t){const r=e.sessions.model,s=Ze(t,r.inputNames);if(r.inputNames.includes("input\
s_embeds")&&!s.inputs_embeds){if(!t.input_ids)throw new Error("Both `input_ids` and `inputs_embeds` are missing in the m\
odel inputs.");s.inputs_embeds=await e.encode_text({input_ids:t.input_ids})}if(r.inputNames.includes("token_type_ids")&&
!s.token_type_ids){if(!s.input_ids)throw new Error("Both `input_ids` and `token_type_ids` are missing in the model input\
s.");s.token_type_ids=cl(s.input_ids)}if(r.inputNames.includes("pixel_mask")&&!s.pixel_mask){if(!s.pixel_values)throw new Error(
"Both `pixel_values` and `pixel_mask` are missing in the model inputs.");const n=s.pixel_values.dims;s.pixel_mask=_t([n[0],
n[2],n[3]])}return await ve(r,s)}async function HC(e,t){const r=await e.encode(t);return await e.decode(r)}function Pi(e,t){
const r=Object.create(null);for(const s in e)if(s.startsWith("present")){const n=s.replace("present_ssm","past_ssm").replace(
"present_conv","past_conv").replace("present_recurrent","past_recurrent").replace("present_compressor","past_compressor").
replace("present_indexer","past_indexer").replace("present","past_key_values");s.includes("encoder")&&t?r[n]=t[n]:r[n]=e[s]}
return t?(t.update(r),t):new Ml(r)}function QC(e){const t={};for(const r of["cross_attentions","encoder_attentions","dec\
oder_attentions"])for(const s in e)s.startsWith(r)&&(r in t||(t[r]=[]),t[r].push(e[s]));return t}function wg(e,t){return e.
map(r=>typeof r=="number"?r:t[r]??0)}function Al(e,t,r){if(r&&Object.keys(r).length>0)return Object.assign(t,r),r;const s=e.
sessions.decoder_model_merged??e.sessions.model,n=(t[e.main_input_name]??t.attention_mask)?.dims?.[0]??1,a=Oa(e.config),
o=e.config?.normalized_config?.num_heads,i={batch_size:n};typeof o=="number"&&(i["batch_size x num_heads"]=n*o);const l=Object.
create(null);for(const c of s.inputMetadata){if(!a.has(c.name))continue;const d=wg(c.shape,i),h=d.reduce((w,v)=>w*v,1),_=ln[c.
type],p=new G(c.type,new _(h),d);t[c.name]=p,l[c.name]=p}return r?(r.update(l),r):new Ml(l)}function wn(e,t,r){if(t.num_logits_to_keep)
return;(e.sessions.decoder_model_merged??e.sessions.model)?.inputNames.includes("num_logits_to_keep")&&(t.num_logits_to_keep=
new G("int64",[r],[]))}async function dr(e,t,r=!1){const s=e.sessions[r?"decoder_model_merged":"model"],{past_key_values:n,
...a}=t;if(s.inputNames.includes("use_cache_branch")&&(a.use_cache_branch=gg(n!=null&&Object.keys(n).length>0)),s.inputNames.
includes("position_ids")&&a.attention_mask&&!a.position_ids){const i=["paligemma","gemma3_text","gemma3"].includes(e.config.
model_type)?1:0;a.position_ids=KC(a,n,i)}wn(e,a,0n),Al(e,a,n);const o=Ze(a,s.inputNames);return await ve(s,o)}async function vg(e,{
encode_function:t,merge_function:r,modality_input_names:s,modality_output_name:n,input_ids:a=null,attention_mask:o=null,
position_ids:i=null,inputs_embeds:l=null,past_key_values:c=null,generation_config:d=null,logits_processor:h=null,num_logits_to_keep:_=null,
...p}){if(!l){l=await e.encode_text({input_ids:a,...p});const v=Ze(p,s);if(Object.keys(v).length>0){if(a.dims[1]!==1){const y=await t(
{...v,...p});({inputs_embeds:l,attention_mask:o}=r({[n]:y,inputs_embeds:l,input_ids:a,attention_mask:o}))}else if(c&&a.dims[1]===
1){const y=a.dims[1],b=c.get_seq_length();o=Oe([_t([a.dims[0],b]),o.slice(null,[o.dims[1]-y,o.dims[1]])],1)}}}if(!i&&["q\
wen2_vl","qwen2_vl_text","qwen2_5_vl","qwen2_5_vl_text","qwen3_vl","qwen3_vl_text","qwen3_vl_moe","qwen3_vl_moe_text","q\
wen3_5","qwen3_5_text","qwen3_5_moe","qwen3_5_moe_text","glm_ocr","glm_ocr_text"].includes(e.config.model_type)){const{image_grid_thw:v,
video_grid_thw:y}=p;[i]=e.get_rope_index(a,v,y,o)}return await dr(e,{inputs_embeds:l,past_key_values:c,attention_mask:o,
position_ids:i,generation_config:d,logits_processor:h,num_logits_to_keep:_},!0)}async function XC(e,t){return await vg(e,
{...t,modality_input_names:["audio_values","input_features"],modality_output_name:"audio_features",encode_function:e.encode_audio.
bind(e),merge_function:e._merge_input_ids_with_audio_features.bind(e)})}async function YC(e,t){return await vg(e,{...t,modality_input_names:[
"pixel_values"],modality_output_name:"image_features",encode_function:e.encode_image.bind(e),merge_function:e._merge_input_ids_with_image_features.
bind(e)})}function yg(e,t=0){const[r,s]=e.dims,n=e.data,a=new BigInt64Array(n.length);for(let o=0;o<r;++o){const i=o*s;let l=BigInt(
t);for(let c=0;c<s;++c){const d=i+c;n[d]===0n?a[d]=BigInt(1):(a[d]=l,l+=n[d])}}return{data:a,dims:e.dims}}function KC(e,t=null,r=0){
const{input_ids:s,inputs_embeds:n,attention_mask:a}=e,{data:o,dims:i}=yg(a,r);let l=new G("int64",o,i);if(t){const c=-(s??
n).dims.at(1);l=l.slice(null,[c,null])}return l}function Ms(e,t,r,s){const n=r.past_key_values?r.past_key_values.get_seq_length():
0;if(wn(e,r,1n),!r.attention_mask){let a;for(const o of["input_ids","inputs_embeds","position_ids"])if(r[o]){a=r[o].dims;
break}if(!a)throw new Error("attention_mask is not provided, and unable to infer its shape from model inputs.");r.attention_mask=
_t([a[0],n+a[1]])}if(r.past_key_values){const{input_ids:a,attention_mask:o}=r;o&&o.dims[1]>a.dims[1]||n<a.dims[1]&&(r.input_ids=
a.slice(null,[n,null]))}return r}function ka(e,t,r,s){return r.past_key_values&&(t=t.map(n=>[n.at(-1)])),wn(e,r,1n),{...r,
decoder_input_ids:Si(t)}}function ea(e,...t){return e.config.is_encoder_decoder?ka(e,...t):Ms(e,...t)}function bg({modality_token_id:e,
inputs_embeds:t,modality_features:r,input_ids:s,attention_mask:n}){const a=s.tolist().map(c=>c.reduce((d,h,_)=>(h==e&&d.
push(_),d),[])),o=a.reduce((c,d)=>c+d.length,0),i=r.dims[0];if(o!==i)throw new Error(`Number of tokens and features do n\
ot match: tokens: ${o}, features ${i}`);let l=0;for(let c=0;c<a.length;++c){const d=a[c],h=t[c];for(let _=0;_<d.length;++_)
h[d[_]].data.set(r[l++].data)}return{inputs_embeds:t,attention_mask:n}}function Cl({image_token_id:e,inputs_embeds:t,image_features:r,
input_ids:s,attention_mask:n}){return bg({modality_token_id:e,inputs_embeds:t,modality_features:r,input_ids:s,attention_mask:n})}
function Mg({audio_token_id:e,inputs_embeds:t,audio_features:r,input_ids:s,attention_mask:n}){return bg({modality_token_id:e,
inputs_embeds:t,modality_features:r,input_ids:s,attention_mask:n})}async function JC(e,t,r){return Object.fromEntries(await Promise.
all(Object.keys(t).map(async s=>{const n=await tr(e,t[s],!1,r);return[s,n]})))}var Sl={};hn(Sl,{ASTForAudioClassification:()=>uS,
ASTModel:()=>cS,ASTPreTrainedModel:()=>Ll,AfmoeForCausalLM:()=>oS,AfmoeModel:()=>aS,AfmoePreTrainedModel:()=>Fl,AlbertForMaskedLM:()=>rS,
AlbertForQuestionAnswering:()=>tS,AlbertForSequenceClassification:()=>eS,AlbertModel:()=>ZC,AlbertPreTrainedModel:()=>vn,
ApertusForCausalLM:()=>nS,ApertusModel:()=>sS,ApertusPreTrainedModel:()=>Pl,ArceeForCausalLM:()=>lS,ArceeModel:()=>iS,ArceePreTrainedModel:()=>Il,
BartForConditionalGeneration:()=>hS,BartForSequenceClassification:()=>fS,BartModel:()=>dS,BartPretrainedModel:()=>Da,BaseModelOutput:()=>TC,
BeitForImageClassification:()=>pS,BeitModel:()=>_S,BeitPreTrainedModel:()=>Ol,BertForMaskedLM:()=>gS,BertForQuestionAnswering:()=>yS,
BertForSequenceClassification:()=>wS,BertForTokenClassification:()=>vS,BertModel:()=>mS,BertPreTrainedModel:()=>Cs,BlenderbotForConditionalGeneration:()=>MS,
BlenderbotModel:()=>bS,BlenderbotPreTrainedModel:()=>Nl,BlenderbotSmallForConditionalGeneration:()=>kS,BlenderbotSmallModel:()=>xS,
BlenderbotSmallPreTrainedModel:()=>Dl,BloomForCausalLM:()=>ES,BloomModel:()=>TS,BloomPreTrainedModel:()=>zl,CHMv2ForDepthEstimation:()=>OS,
CHMv2PreTrainedModel:()=>Eg,CLIPModel:()=>DS,CLIPPreTrainedModel:()=>Zr,CLIPSegForImageSegmentation:()=>GS,CLIPSegModel:()=>$S,
CLIPSegPreTrainedModel:()=>Bl,CLIPTextModel:()=>zS,CLIPTextModelWithProjection:()=>Sg,CLIPVisionModel:()=>BS,CLIPVisionModelWithProjection:()=>RS,
CamembertForMaskedLM:()=>CS,CamembertForQuestionAnswering:()=>FS,CamembertForSequenceClassification:()=>SS,CamembertForTokenClassification:()=>PS,
CamembertModel:()=>AS,CamembertPreTrainedModel:()=>Ss,CausalLMOutput:()=>Pr,CausalLMOutputWithPast:()=>EC,ChatterboxModel:()=>kg,
ChatterboxPreTrainedModel:()=>xg,ChineseCLIPModel:()=>LS,ChineseCLIPPreTrainedModel:()=>Tg,ClapAudioModelWithProjection:()=>Cg,
ClapModel:()=>NS,ClapPreTrainedModel:()=>za,ClapTextModelWithProjection:()=>Ag,CodeGenForCausalLM:()=>US,CodeGenModel:()=>VS,
CodeGenPreTrainedModel:()=>Rl,Cohere2ForCausalLM:()=>HS,Cohere2Model:()=>WS,Cohere2PreTrainedModel:()=>Gl,CohereAsrForConditionalGeneration:()=>XS,
CohereAsrModel:()=>QS,CohereAsrPreTrainedModel:()=>Vl,CohereForCausalLM:()=>qS,CohereModel:()=>jS,CoherePreTrainedModel:()=>$l,
ConvBertForMaskedLM:()=>KS,ConvBertForQuestionAnswering:()=>eP,ConvBertForSequenceClassification:()=>JS,ConvBertForTokenClassification:()=>ZS,
ConvBertModel:()=>YS,ConvBertPreTrainedModel:()=>Ps,ConvNextForImageClassification:()=>rP,ConvNextModel:()=>tP,ConvNextPreTrainedModel:()=>Ul,
ConvNextV2ForImageClassification:()=>nP,ConvNextV2Model:()=>sP,ConvNextV2PreTrainedModel:()=>jl,DFineForObjectDetection:()=>lP,
DFineModel:()=>iP,DFinePreTrainedModel:()=>Wl,DINOv3ConvNextModel:()=>DP,DINOv3ConvNextPreTrainedModel:()=>Bg,DINOv3ViTModel:()=>zP,
DINOv3ViTPreTrainedModel:()=>Rg,DPTForDepthEstimation:()=>qP,DPTModel:()=>jP,DPTPreTrainedModel:()=>Zl,DacDecoderModel:()=>Lg,
DacDecoderOutput:()=>Fg,DacEncoderModel:()=>Ig,DacEncoderOutput:()=>Pg,DacModel:()=>cP,DacPreTrainedModel:()=>Ba,DebertaForMaskedLM:()=>dP,
DebertaForQuestionAnswering:()=>_P,DebertaForSequenceClassification:()=>hP,DebertaForTokenClassification:()=>fP,DebertaModel:()=>uP,
DebertaPreTrainedModel:()=>Fs,DebertaV2ForMaskedLM:()=>yP,DebertaV2ForQuestionAnswering:()=>xP,DebertaV2ForSequenceClassification:()=>bP,
DebertaV2ForTokenClassification:()=>MP,DebertaV2Model:()=>vP,DebertaV2PreTrainedModel:()=>Is,DecisionTransformerModel:()=>kP,
DecisionTransformerPreTrainedModel:()=>Og,DeepseekV3ForCausalLM:()=>mP,DeepseekV3Model:()=>pP,DeepseekV3PreTrainedModel:()=>Hl,
DeepseekV4ForCausalLM:()=>wP,DeepseekV4Model:()=>gP,DeepseekV4PreTrainedModel:()=>Ql,DeiTForImageClassification:()=>EP,DeiTModel:()=>TP,
DeiTPreTrainedModel:()=>Xl,DepthAnythingForDepthEstimation:()=>AP,DepthAnythingPreTrainedModel:()=>Ng,DepthProForDepthEstimation:()=>CP,
DepthProPreTrainedModel:()=>Dg,DetrForObjectDetection:()=>PP,DetrForSegmentation:()=>FP,DetrModel:()=>SP,DetrObjectDetectionOutput:()=>Yl,
DetrPreTrainedModel:()=>Ra,DetrSegmentationOutput:()=>zg,Dinov2ForImageClassification:()=>LP,Dinov2Model:()=>IP,Dinov2PreTrainedModel:()=>Kl,
Dinov2WithRegistersForImageClassification:()=>NP,Dinov2WithRegistersModel:()=>OP,Dinov2WithRegistersPreTrainedModel:()=>Jl,
DistilBertForMaskedLM:()=>VP,DistilBertForQuestionAnswering:()=>GP,DistilBertForSequenceClassification:()=>RP,DistilBertForTokenClassification:()=>$P,
DistilBertModel:()=>BP,DistilBertPreTrainedModel:()=>Ls,DonutSwinModel:()=>UP,DonutSwinPreTrainedModel:()=>$g,EdgeTamModel:()=>hN,
EfficientNetForImageClassification:()=>HP,EfficientNetModel:()=>WP,EfficientNetPreTrainedModel:()=>ec,ElectraForMaskedLM:()=>XP,
ElectraForQuestionAnswering:()=>JP,ElectraForSequenceClassification:()=>YP,ElectraForTokenClassification:()=>KP,ElectraModel:()=>QP,
ElectraPreTrainedModel:()=>Os,EmbeddingGemma2Model:()=>Vg,EmbeddingGemma2PreTrainedModel:()=>Gg,Ernie4_5ForCausalLM:()=>eF,
Ernie4_5Model:()=>ZP,Ernie4_5PretrainedModel:()=>tc,EsmForMaskedLM:()=>rF,EsmForSequenceClassification:()=>sF,EsmForTokenClassification:()=>nF,
EsmModel:()=>tF,EsmPreTrainedModel:()=>bn,EuroBertForMaskedLM:()=>oF,EuroBertForSequenceClassification:()=>iF,EuroBertForTokenClassification:()=>lF,
EuroBertModel:()=>aF,EuroBertPreTrainedModel:()=>Mn,ExaoneForCausalLM:()=>uF,ExaoneModel:()=>cF,ExaonePreTrainedModel:()=>rc,
FalconForCausalLM:()=>hF,FalconH1ForCausalLM:()=>_F,FalconH1Model:()=>fF,FalconH1PreTrainedModel:()=>nc,FalconModel:()=>dF,
FalconPreTrainedModel:()=>sc,FastViTForImageClassification:()=>mF,FastViTModel:()=>pF,FastViTPreTrainedModel:()=>ac,Florence2ForConditionalGeneration:()=>gF,
Florence2PreTrainedModel:()=>Ug,GLPNForDepthEstimation:()=>OF,GLPNModel:()=>LF,GLPNPreTrainedModel:()=>fc,GPT2LMHeadModel:()=>jF,
GPT2Model:()=>UF,GPT2PreTrainedModel:()=>wc,GPTBigCodeForCausalLM:()=>DF,GPTBigCodeModel:()=>NF,GPTBigCodePreTrainedModel:()=>_c,
GPTJForCausalLM:()=>WF,GPTJModel:()=>qF,GPTJPreTrainedModel:()=>vc,GPTNeoForCausalLM:()=>BF,GPTNeoModel:()=>zF,GPTNeoPreTrainedModel:()=>pc,
GPTNeoXForCausalLM:()=>$F,GPTNeoXModel:()=>RF,GPTNeoXPreTrainedModel:()=>mc,Gemma2ForCausalLM:()=>bF,Gemma2Model:()=>yF,
Gemma2PreTrainedModel:()=>ic,Gemma3ForCausalLM:()=>TF,Gemma3ForConditionalGeneration:()=>Wg,Gemma3Model:()=>kF,Gemma3PreTrainedModel:()=>qg,
Gemma3nForCausalLM:()=>EF,Gemma3nForConditionalGeneration:()=>$a,Gemma3nPreTrainedModel:()=>Hg,Gemma4ForCausalLM:()=>AF,
Gemma4ForConditionalGeneration:()=>lc,GemmaForCausalLM:()=>vF,GemmaModel:()=>wF,GemmaPreTrainedModel:()=>oc,GlmForCausalLM:()=>SF,
GlmModel:()=>CF,GlmMoeDsaForCausalLM:()=>FF,GlmMoeDsaModel:()=>PF,GlmMoeDsaPreTrainedModel:()=>uc,GlmOcrForConditionalGeneration:()=>IF,
GlmPreTrainedModel:()=>cc,GptOssForCausalLM:()=>VF,GptOssModel:()=>GF,GptOssPreTrainedModel:()=>gc,GraniteForCausalLM:()=>QF,
GraniteModel:()=>HF,GraniteMoeHybridForCausalLM:()=>YF,GraniteMoeHybridModel:()=>XF,GraniteMoeHybridPreTrainedModel:()=>bc,
GranitePreTrainedModel:()=>yc,GraniteSpeechForConditionalGeneration:()=>KF,GroundingDinoForObjectDetection:()=>JF,GroundingDinoPreTrainedModel:()=>Jg,
GroupViTModel:()=>ZF,GroupViTPreTrainedModel:()=>Zg,HeliumForCausalLM:()=>tI,HeliumModel:()=>eI,HeliumPreTrainedModel:()=>xc,
HieraForImageClassification:()=>sI,HieraModel:()=>rI,HieraPreTrainedModel:()=>kc,HrmTextForCausalLM:()=>aI,HrmTextModel:()=>nI,
HrmTextPreTrainedModel:()=>Tc,HubertForCTC:()=>hI,HubertForSequenceClassification:()=>fI,HubertModel:()=>dI,HubertPreTrainedModel:()=>uI,
HunYuanDenseV1ForCausalLM:()=>pI,HunYuanDenseV1Model:()=>_I,HunYuanDenseV1PreTrainedModel:()=>Ec,IJepaForImageClassification:()=>gI,
IJepaModel:()=>mI,IJepaPreTrainedModel:()=>Ac,Idefics3ForConditionalGeneration:()=>ew,ImageMattingOutput:()=>dg,JAISLMHeadModel:()=>vI,
JAISModel:()=>wI,JAISPreTrainedModel:()=>Cc,JinaCLIPModel:()=>yI,JinaCLIPPreTrainedModel:()=>Ga,JinaCLIPTextModel:()=>tw,
JinaCLIPVisionModel:()=>bI,Lfm2ForCausalLM:()=>xI,Lfm2Model:()=>MI,Lfm2MoeForCausalLM:()=>EI,Lfm2MoeModel:()=>TI,Lfm2MoePreTrainedModel:()=>Pc,
Lfm2PreTrainedModel:()=>Sc,Lfm2VlForConditionalGeneration:()=>AI,Lfm3ForCausalLM:()=>SI,Lfm3Model:()=>CI,Lfm3PreTrainedModel:()=>Fc,
Lfm3VlForConditionalGeneration:()=>PI,LightOnOcrForConditionalGeneration:()=>kI,LiteWhisperForConditionalGeneration:()=>L3,
Llama4ForCausalLM:()=>LI,Llama4PreTrainedModel:()=>rw,LlamaForCausalLM:()=>II,LlamaModel:()=>FI,LlamaPreTrainedModel:()=>Ic,
LlavaForConditionalGeneration:()=>$t,LlavaOnevisionForConditionalGeneration:()=>$t,LlavaPreTrainedModel:()=>jg,LlavaQwen2ForCausalLM:()=>xF,
LongT5ForConditionalGeneration:()=>NI,LongT5Model:()=>OI,LongT5PreTrainedModel:()=>Lc,M2M100ForConditionalGeneration:()=>zI,
M2M100Model:()=>DI,M2M100PreTrainedModel:()=>Oc,MBartForCausalLM:()=>qI,MBartForConditionalGeneration:()=>UI,MBartForSequenceClassification:()=>jI,
MBartModel:()=>VI,MBartPreTrainedModel:()=>xn,MPNetForMaskedLM:()=>DL,MPNetForQuestionAnswering:()=>RL,MPNetForSequenceClassification:()=>zL,
MPNetForTokenClassification:()=>BL,MPNetModel:()=>NL,MPNetPreTrainedModel:()=>Ns,MT5ForConditionalGeneration:()=>UL,MT5Model:()=>VL,
MT5PreTrainedModel:()=>Hc,MarianMTModel:()=>RI,MarianModel:()=>BI,MarianPreTrainedModel:()=>Nc,MaskFormerForInstanceSegmentation:()=>GI,
MaskFormerModel:()=>$I,MaskFormerPreTrainedModel:()=>Dc,MaskedLMOutput:()=>Xe,Metric3DForDepthEstimation:()=>WI,Metric3DPreTrainedModel:()=>sw,
Metric3Dv2ForDepthEstimation:()=>HI,Metric3Dv2PreTrainedModel:()=>nw,MgpstrForSceneTextRecognition:()=>QI,MgpstrModelOutput:()=>aw,
MgpstrPreTrainedModel:()=>ow,MimiDecoderModel:()=>uw,MimiDecoderOutput:()=>lw,MimiEncoderModel:()=>cw,MimiEncoderOutput:()=>iw,
MimiModel:()=>XI,MimiPreTrainedModel:()=>Va,Ministral3ForCausalLM:()=>ZI,Ministral3Model:()=>JI,Ministral3PreTrainedModel:()=>Bc,
MinistralForCausalLM:()=>KI,MinistralModel:()=>YI,MinistralPreTrainedModel:()=>zc,Mistral3ForConditionalGeneration:()=>rL,
Mistral4ForCausalLM:()=>nL,Mistral4Model:()=>sL,Mistral4PreTrainedModel:()=>$c,MistralForCausalLM:()=>tL,MistralModel:()=>eL,
MistralPreTrainedModel:()=>Rc,MobileBertForMaskedLM:()=>oL,MobileBertForQuestionAnswering:()=>lL,MobileBertForSequenceClassification:()=>iL,
MobileBertModel:()=>aL,MobileBertPreTrainedModel:()=>kn,MobileLLMForCausalLM:()=>uL,MobileLLMModel:()=>cL,MobileLLMPreTrainedModel:()=>Gc,
MobileNetV1ForImageClassification:()=>hL,MobileNetV1ForSemanticSegmentation:()=>fL,MobileNetV1Model:()=>dL,MobileNetV1PreTrainedModel:()=>Ua,
MobileNetV2ForImageClassification:()=>pL,MobileNetV2ForSemanticSegmentation:()=>mL,MobileNetV2Model:()=>_L,MobileNetV2PreTrainedModel:()=>ja,
MobileNetV3ForImageClassification:()=>wL,MobileNetV3ForSemanticSegmentation:()=>vL,MobileNetV3Model:()=>gL,MobileNetV3PreTrainedModel:()=>qa,
MobileNetV4ForImageClassification:()=>bL,MobileNetV4ForSemanticSegmentation:()=>ML,MobileNetV4Model:()=>yL,MobileNetV4PreTrainedModel:()=>Wa,
MobileViTForImageClassification:()=>kL,MobileViTModel:()=>xL,MobileViTPreTrainedModel:()=>Vc,MobileViTV2ForImageClassification:()=>EL,
MobileViTV2Model:()=>TL,MobileViTV2PreTrainedModel:()=>Uc,ModelOutput:()=>Ve,ModernBertDecoderForCausalLM:()=>IL,ModernBertDecoderModel:()=>FL,
ModernBertDecoderPreTrainedModel:()=>jc,ModernBertForMaskedLM:()=>CL,ModernBertForSequenceClassification:()=>SL,ModernBertForTokenClassification:()=>PL,
ModernBertModel:()=>AL,ModernBertPreTrainedModel:()=>Tn,Moondream1ForConditionalGeneration:()=>MF,MoonshineForConditionalGeneration:()=>OL,
MoonshineModel:()=>LL,MoonshinePreTrainedModel:()=>qc,MptForCausalLM:()=>GL,MptModel:()=>$L,MptPreTrainedModel:()=>Wc,MultiModalityCausalLM:()=>jL,
MultiModalityPreTrainedModel:()=>dw,MusicgenForCausalLM:()=>WL,MusicgenForConditionalGeneration:()=>hw,MusicgenModel:()=>qL,
MusicgenPreTrainedModel:()=>Qc,NanoChatForCausalLM:()=>QL,NanoChatModel:()=>HL,NanoChatPreTrainedModel:()=>Xc,NemotronHForCausalLM:()=>YL,
NemotronHModel:()=>XL,NemotronHPreTrainedModel:()=>Yc,NeoBertForMaskedLM:()=>JL,NeoBertForQuestionAnswering:()=>tO,NeoBertForSequenceClassification:()=>ZL,
NeoBertForTokenClassification:()=>eO,NeoBertModel:()=>KL,NeoBertPreTrainedModel:()=>Ds,NomicBertModel:()=>rO,NomicBertPreTrainedModel:()=>fw,
OPTForCausalLM:()=>mO,OPTModel:()=>pO,OPTPreTrainedModel:()=>su,Olmo2ForCausalLM:()=>oO,Olmo2Model:()=>aO,Olmo2PreTrainedModel:()=>Jc,
Olmo3ForCausalLM:()=>lO,Olmo3Model:()=>iO,Olmo3PreTrainedModel:()=>Zc,OlmoForCausalLM:()=>nO,OlmoHybridForCausalLM:()=>uO,
OlmoHybridModel:()=>cO,OlmoHybridPreTrainedModel:()=>eu,OlmoModel:()=>sO,OlmoPreTrainedModel:()=>Kc,OpenAIPrivacyFilterForTokenClassification:()=>hO,
OpenAIPrivacyFilterModel:()=>dO,OpenAIPrivacyFilterPreTrainedModel:()=>tu,OpenELMForCausalLM:()=>_O,OpenELMModel:()=>fO,
OpenELMPreTrainedModel:()=>ru,OwlViTForObjectDetection:()=>yO,OwlViTModel:()=>vO,OwlViTPreTrainedModel:()=>au,Owlv2ForObjectDetection:()=>wO,
Owlv2Model:()=>gO,Owlv2PreTrainedModel:()=>nu,PaliGemmaForConditionalGeneration:()=>bO,ParakeetForCTC:()=>MO,ParakeetPreTrainedModel:()=>_w,
PatchTSMixerForPrediction:()=>kO,PatchTSMixerModel:()=>xO,PatchTSMixerPreTrainedModel:()=>ou,PatchTSTForPrediction:()=>EO,
PatchTSTModel:()=>TO,PatchTSTPreTrainedModel:()=>iu,Phi3ForCausalLM:()=>PO,Phi3Model:()=>SO,Phi3PreTrainedModel:()=>cu,Phi3VForCausalLM:()=>mw,
Phi3VPreTrainedModel:()=>pw,PhiForCausalLM:()=>CO,PhiModel:()=>AO,PhiPreTrainedModel:()=>lu,PreTrainedModel:()=>F,PvtForImageClassification:()=>IO,
PvtModel:()=>FO,PvtPreTrainedModel:()=>uu,PyAnnoteForAudioFrameClassification:()=>OO,PyAnnoteModel:()=>LO,PyAnnotePreTrainedModel:()=>du,
QuestionAnsweringModelOutput:()=>ot,Qwen2ForCausalLM:()=>DO,Qwen2Model:()=>NO,Qwen2MoeForCausalLM:()=>BO,Qwen2MoeModel:()=>zO,
Qwen2MoePreTrainedModel:()=>fu,Qwen2PreTrainedModel:()=>hu,Qwen2VLForCausalLM:()=>Xg,Qwen2VLForConditionalGeneration:()=>dc,
Qwen2VLPreTrainedModel:()=>Qg,Qwen2_5_VLForCausalLM:()=>Yg,Qwen2_5_VLForConditionalGeneration:()=>hc,Qwen3ForCausalLM:()=>$O,
Qwen3Model:()=>RO,Qwen3MoeForCausalLM:()=>VO,Qwen3MoeModel:()=>GO,Qwen3MoePreTrainedModel:()=>pu,Qwen3NextForCausalLM:()=>jO,
Qwen3NextModel:()=>UO,Qwen3NextPreTrainedModel:()=>mu,Qwen3PreTrainedModel:()=>_u,Qwen3VLForCausalLM:()=>gw,Qwen3VLForConditionalGeneration:()=>gu,
Qwen3VLMoeForCausalLM:()=>WO,Qwen3VLMoeForConditionalGeneration:()=>qO,Qwen3_5ForCausalLM:()=>ww,Qwen3_5ForConditionalGeneration:()=>wu,
Qwen3_5MoeForCausalLM:()=>QO,Qwen3_5MoeForConditionalGeneration:()=>HO,RFDetrForObjectDetection:()=>JO,RFDetrModel:()=>KO,
RFDetrObjectDetectionOutput:()=>vw,RFDetrPreTrainedModel:()=>yu,RTDetrForObjectDetection:()=>oP,RTDetrModel:()=>aP,RTDetrObjectDetectionOutput:()=>yn,
RTDetrPreTrainedModel:()=>ql,RTDetrV2ForObjectDetection:()=>uN,RTDetrV2Model:()=>cN,RTDetrV2ObjectDetectionOutput:()=>yw,
RTDetrV2PreTrainedModel:()=>bu,ResNetForImageClassification:()=>YO,ResNetModel:()=>XO,ResNetPreTrainedModel:()=>vu,RoFormerForMaskedLM:()=>aN,
RoFormerForQuestionAnswering:()=>lN,RoFormerForSequenceClassification:()=>oN,RoFormerForTokenClassification:()=>iN,RoFormerModel:()=>nN,
RoFormerPreTrainedModel:()=>Bs,RobertaForMaskedLM:()=>eN,RobertaForQuestionAnswering:()=>sN,RobertaForSequenceClassification:()=>tN,
RobertaForTokenClassification:()=>rN,RobertaModel:()=>ZO,RobertaPreTrainedModel:()=>zs,Sam2ImageSegmentationOutput:()=>xw,
Sam2Model:()=>Mu,Sam2PreTrainedModel:()=>kw,Sam3TrackerModel:()=>fN,SamImageSegmentationOutput:()=>bw,SamModel:()=>dN,SamPreTrainedModel:()=>Mw,
SapiensForDepthEstimation:()=>pN,SapiensForNormalEstimation:()=>mN,SapiensForSemanticSegmentation:()=>_N,SapiensPreTrainedModel:()=>Ha,
SegformerForImageClassification:()=>wN,SegformerForSemanticSegmentation:()=>vN,SegformerModel:()=>gN,SegformerPreTrainedModel:()=>Qa,
Seq2SeqLMOutput:()=>AC,SequenceClassifierOutput:()=>ie,SiglipModel:()=>yN,SiglipPreTrainedModel:()=>xu,SiglipTextModel:()=>Tw,
SiglipVisionModel:()=>bN,SmolLM3ForCausalLM:()=>xN,SmolLM3Model:()=>MN,SmolLM3PreTrainedModel:()=>ku,SmolVLMForConditionalGeneration:()=>kN,
SnacDecoderModel:()=>Aw,SnacEncoderModel:()=>Ew,SnacModel:()=>TN,SnacPreTrainedModel:()=>Xa,SolarOpenForCausalLM:()=>AN,
SolarOpenModel:()=>EN,SolarOpenPreTrainedModel:()=>Tu,SpeechT5ForSpeechToText:()=>SN,SpeechT5ForTextToSpeech:()=>PN,SpeechT5HifiGan:()=>FN,
SpeechT5Model:()=>CN,SpeechT5PreTrainedModel:()=>Ya,SqueezeBertForMaskedLM:()=>LN,SqueezeBertForQuestionAnswering:()=>NN,
SqueezeBertForSequenceClassification:()=>ON,SqueezeBertModel:()=>IN,SqueezeBertPreTrainedModel:()=>En,StableLmForCausalLM:()=>zN,
StableLmModel:()=>DN,StableLmPreTrainedModel:()=>Eu,Starcoder2ForCausalLM:()=>RN,Starcoder2Model:()=>BN,Starcoder2PreTrainedModel:()=>Au,
StyleTextToSpeech2Model:()=>$N,StyleTextToSpeech2PreTrainedModel:()=>Cw,SupertonicForConditionalGeneration:()=>Pw,SupertonicPreTrainedModel:()=>Sw,
Swin2SRForImageSuperResolution:()=>qN,Swin2SRModel:()=>jN,Swin2SRPreTrainedModel:()=>Cu,SwinForImageClassification:()=>VN,
SwinForSemanticSegmentation:()=>UN,SwinModel:()=>GN,SwinPreTrainedModel:()=>Ka,T5ForConditionalGeneration:()=>HN,T5Model:()=>WN,
T5PreTrainedModel:()=>Su,TableTransformerForObjectDetection:()=>XN,TableTransformerModel:()=>QN,TableTransformerObjectDetectionOutput:()=>Fw,
TableTransformerPreTrainedModel:()=>Pu,TokenClassifierOutput:()=>He,TrOCRForCausalLM:()=>YN,TrOCRPreTrainedModel:()=>Iw,
UltravoxModel:()=>Mc,UltravoxPreTrainedModel:()=>Kg,UniSpeechForCTC:()=>JN,UniSpeechForSequenceClassification:()=>ZN,UniSpeechModel:()=>KN,
UniSpeechPreTrainedModel:()=>Ja,UniSpeechSatForAudioFrameClassification:()=>s3,UniSpeechSatForCTC:()=>t3,UniSpeechSatForSequenceClassification:()=>r3,
UniSpeechSatModel:()=>e3,UniSpeechSatPreTrainedModel:()=>An,VaultGemmaForCausalLM:()=>a3,VaultGemmaModel:()=>n3,VaultGemmaPreTrainedModel:()=>Fu,
ViTForImageClassification:()=>l3,ViTMAEModel:()=>c3,ViTMAEPreTrainedModel:()=>Lw,ViTMSNForImageClassification:()=>d3,ViTMSNModel:()=>u3,
ViTMSNPreTrainedModel:()=>Lu,ViTModel:()=>i3,ViTPreTrainedModel:()=>Iu,VisionEncoderDecoderModel:()=>o3,VitMatteForImageMatting:()=>h3,
VitMattePreTrainedModel:()=>Ow,VitPoseForPoseEstimation:()=>f3,VitPosePreTrainedModel:()=>Nw,VitsModel:()=>_3,VitsModelOutput:()=>Dw,
VitsPreTrainedModel:()=>zw,VoxtralForConditionalGeneration:()=>p3,VoxtralRealtimeForConditionalGeneration:()=>Rw,VoxtralRealtimePreTrainedModel:()=>Bw,
Wav2Vec2BertForCTC:()=>x3,Wav2Vec2BertForSequenceClassification:()=>k3,Wav2Vec2BertModel:()=>M3,Wav2Vec2BertPreTrainedModel:()=>Za,
Wav2Vec2ForAudioFrameClassification:()=>cI,Wav2Vec2ForCTC:()=>iI,Wav2Vec2ForSequenceClassification:()=>lI,Wav2Vec2Model:()=>oI,
Wav2Vec2PreTrainedModel:()=>Fr,WavLMForAudioFrameClassification:()=>S3,WavLMForCTC:()=>E3,WavLMForSequenceClassification:()=>A3,
WavLMForXVector:()=>C3,WavLMModel:()=>T3,WavLMPreTrainedModel:()=>Rs,WeSpeakerResNetModel:()=>P3,WeSpeakerResNetPreTrainedModel:()=>Gw,
WhisperForConditionalGeneration:()=>Vw,WhisperModel:()=>I3,WhisperPreTrainedModel:()=>Ou,XLMForQuestionAnswering:()=>B3,
XLMForSequenceClassification:()=>D3,XLMForTokenClassification:()=>z3,XLMModel:()=>O3,XLMPreTrainedModel:()=>$s,XLMRobertaForMaskedLM:()=>$3,
XLMRobertaForQuestionAnswering:()=>U3,XLMRobertaForSequenceClassification:()=>G3,XLMRobertaForTokenClassification:()=>V3,
XLMRobertaModel:()=>R3,XLMRobertaPreTrainedModel:()=>Gs,XLMWithLMHeadModel:()=>N3,XVectorOutput:()=>$w,YolosForObjectDetection:()=>q3,
YolosModel:()=>j3,YolosObjectDetectionOutput:()=>Uw,YolosPreTrainedModel:()=>Nu,YoutuForCausalLM:()=>H3,YoutuModel:()=>W3,
YoutuPreTrainedModel:()=>Du,ZayaForCausalLM:()=>X3,ZayaModel:()=>Q3,ZayaPreTrainedModel:()=>zu});var vn=class extends F{},
ZC=class extends vn{},eS=class extends vn{async _call(e){return new ie(await super._call(e))}},tS=class extends vn{async _call(e){
return new ot(await super._call(e))}},rS=class extends vn{async _call(e){return new Xe(await super._call(e))}},Pl=class extends F{},
sS=class extends Pl{},nS=class extends Pl{},Fl=class extends F{},aS=class extends Fl{},oS=class extends Fl{},Il=class extends F{},
iS=class extends Il{},lS=class extends Il{},Ll=class extends F{},cS=class extends Ll{},uS=class extends Ll{},Da=class extends F{},
dS=class extends Da{},hS=class extends Da{},fS=class extends Da{async _call(e){return new ie(await super._call(e))}},Ol=class extends F{},
_S=class extends Ol{},pS=class extends Ol{async _call(e){return new ie(await super._call(e))}},Cs=class extends F{},mS=class extends Cs{},
gS=class extends Cs{async _call(e){return new Xe(await super._call(e))}},wS=class extends Cs{async _call(e){return new ie(
await super._call(e))}},vS=class extends Cs{async _call(e){return new He(await super._call(e))}},yS=class extends Cs{async _call(e){
return new ot(await super._call(e))}},Nl=class extends F{},bS=class extends Nl{},MS=class extends Nl{},Dl=class extends F{},
xS=class extends Dl{},kS=class extends Dl{},zl=class extends F{},TS=class extends zl{},ES=class extends zl{},Ss=class extends F{},
AS=class extends Ss{},CS=class extends Ss{async _call(e){return new Xe(await super._call(e))}},SS=class extends Ss{async _call(e){
return new ie(await super._call(e))}},PS=class extends Ss{async _call(e){return new He(await super._call(e))}},FS=class extends Ss{async _call(e){
return new ot(await super._call(e))}},IS=4299n,C_=6561n,xg=class extends F{forward_params=["input_ids","inputs_embeds","\
attention_mask","position_ids","audio_values","exaggeration","audio_features","audio_tokens","speaker_embeddings","speak\
er_features","past_key_values"];main_input_name="input_ids";_return_dict_in_generate_keys=["audio_tokens","speaker_embed\
dings","speaker_features"]},kg=class extends xg{async encode_speech(e){return ve(this.sessions.speech_encoder,{audio_values:e})}async forward({
input_ids:e=null,attention_mask:t=null,audio_values:r=null,exaggeration:s=null,position_ids:n=null,inputs_embeds:a=null,
past_key_values:o=null,generation_config:i=null,logits_processor:l=null,num_logits_to_keep:c=null,audio_features:d=null,
audio_tokens:h=null,speaker_embeddings:_=null,speaker_features:p=null,...w}){let v;if(!a){const b=this.sessions.embed_tokens.
inputNames,k={input_ids:e};if(b.includes("exaggeration")){if(!(s instanceof G)){const A=e.dims[0];if(s==null)s=ct([A],.5);else if(typeof s==
"number")s=ct([A],s);else if(Array.isArray(s))s=new G("float32",s,[A]);else throw new Error("Unsupported type for `exagg\
eration` input")}k.exaggeration=s}if(b.includes("position_ids")&&(k.position_ids=n),{inputs_embeds:a}=await ve(this.sessions.
embed_tokens,k),d&&h&&_&&p&&(v={audio_features:d,audio_tokens:h,speaker_embeddings:_,speaker_features:p}),v||r)v??=await this.
encode_speech(r),a=Oe([v.audio_features,a],1),t=_t([a.dims[0],a.dims[1]]);else{const A=a.dims[1];if(!o||A!==1)throw new Error(
"Incorrect state encountered during generation.");const E=o.get_seq_length();t=_t([a.dims[0],E+A])}}return{...await dr(this,
{inputs_embeds:a,past_key_values:o,attention_mask:t,generation_config:i,logits_processor:l,num_logits_to_keep:c},!1),...v}}prepare_inputs_for_generation(e,t,r){
if(!t.position_ids&&this.sessions.embed_tokens.inputNames.includes("position_ids"))if(t.input_ids.dims[1]===1){const s=Array.
from({length:e.length},(n,a)=>e[a].length-e[a].findLastIndex(o=>o==C_)-1);t.position_ids=new G("int64",s,[e.length,1])}else{
const n=t.input_ids.tolist().map(a=>{let o=0;return a.map(i=>i>=C_?0:o++)});t.position_ids=new G("int64",n.flat(),t.input_ids.
dims)}return t.input_ids.dims[1]===1&&(delete t.audio_values,delete t.audio_features,delete t.audio_tokens,delete t.speaker_embeddings,
delete t.speaker_features),Ms(this,e,t)}async generate(e){const t=e.past_key_values,{sequences:r,audio_tokens:s,speaker_embeddings:n,
speaker_features:a,past_key_values:o}=await super.generate({...e,return_dict_in_generate:!0});try{const i=r.slice(null,[
e.input_ids.dims[1],-1]),l=ct([i.dims[0],3],IS),c=Oe([s,i,l],1),{waveform:d}=await ve(this.sessions.conditional_decoder,
{speech_tokens:c,speaker_features:a,speaker_embeddings:n});return d}finally{o!==t&&await o?.dispose()}}},Tg=class extends F{},
LS=class extends Tg{},Eg=class extends F{},OS=class extends Eg{},za=class extends F{},NS=class extends za{},Ag=class extends za{static async from_pretrained(e,t={}){
return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??"text_model"})}},Cg=class extends za{static async from_pretrained(e,t={}){
return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??"audio_model"})}},Zr=class extends F{},DS=class extends Zr{},
zS=class extends Zr{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??
"text_model"})}},Sg=class extends Zr{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.
model_file_name??"text_model"})}},BS=class extends Zr{static async from_pretrained(e,t={}){return super.from_pretrained(
e,{...t,model_file_name:t.model_file_name??"vision_model"})}},RS=class extends Zr{static async from_pretrained(e,t={}){return super.
from_pretrained(e,{...t,model_file_name:t.model_file_name??"vision_model"})}},Bl=class extends F{},$S=class extends Bl{},
GS=class extends Bl{},Rl=class extends F{},VS=class extends Rl{},US=class extends Rl{},$l=class extends F{},jS=class extends $l{},
qS=class extends $l{},Gl=class extends F{},WS=class extends Gl{},HS=class extends Gl{},Vl=class extends F{requires_attention_mask=!1;main_input_name="\
input_features";forward_params=["input_features","decoder_input_ids","decoder_attention_mask","past_key_values"]},QS=class extends Vl{},
XS=class extends Vl{},Ps=class extends F{},YS=class extends Ps{},KS=class extends Ps{async _call(e){return new Xe(await super.
_call(e))}},JS=class extends Ps{async _call(e){return new ie(await super._call(e))}},ZS=class extends Ps{async _call(e){
return new He(await super._call(e))}},eP=class extends Ps{async _call(e){return new ot(await super._call(e))}},Ul=class extends F{},
tP=class extends Ul{},rP=class extends Ul{async _call(e){return new ie(await super._call(e))}},jl=class extends F{},sP=class extends jl{},
nP=class extends jl{async _call(e){return new ie(await super._call(e))}},ql=class extends F{},aP=class extends ql{},oP=class extends ql{async _call(e){
return new yn(await super._call(e))}},yn=class extends Ve{constructor({logits:e,pred_boxes:t}){super(),this.logits=e,this.
pred_boxes=t}},Wl=class extends F{},iP=class extends Wl{},lP=class extends Wl{async _call(e){return new yn(await super._call(
e))}},Pg=class extends Ve{constructor({audio_codes:e}){super(),this.audio_codes=e}},Fg=class extends Ve{constructor({audio_values:e}){
super(),this.audio_values=e}},Ba=class extends F{main_input_name="input_values";forward_params=["input_values"]},cP=class extends Ba{async encode(e){
return new Pg(await ve(this.sessions.encoder_model,e))}async decode(e){return new Fg(await ve(this.sessions.decoder_model,
e))}},Ig=class extends Ba{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??
"encoder_model"})}},Lg=class extends Ba{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.
model_file_name??"decoder_model"})}},Fs=class extends F{},uP=class extends Fs{},dP=class extends Fs{async _call(e){return new Xe(
await super._call(e))}},hP=class extends Fs{async _call(e){return new ie(await super._call(e))}},fP=class extends Fs{async _call(e){
return new He(await super._call(e))}},_P=class extends Fs{async _call(e){return new ot(await super._call(e))}},Hl=class extends F{},
pP=class extends Hl{},mP=class extends Hl{},Ql=class extends F{},gP=class extends Ql{},wP=class extends Ql{},Is=class extends F{},
vP=class extends Is{},yP=class extends Is{async _call(e){return new Xe(await super._call(e))}},bP=class extends Is{async _call(e){
return new ie(await super._call(e))}},MP=class extends Is{async _call(e){return new He(await super._call(e))}},xP=class extends Is{async _call(e){
return new ot(await super._call(e))}},Og=class extends F{},kP=class extends Og{},Xl=class extends F{},TP=class extends Xl{},
EP=class extends Xl{async _call(e){return new ie(await super._call(e))}},Ng=class extends F{},AP=class extends Ng{},Dg=class extends F{},
CP=class extends Dg{},Ra=class extends F{},SP=class extends Ra{},PP=class extends Ra{async _call(e){return new Yl(await super.
_call(e))}},FP=class extends Ra{async _call(e){return new zg(await super._call(e))}},Yl=class extends Ve{constructor({logits:e,
pred_boxes:t}){super(),this.logits=e,this.pred_boxes=t}},zg=class extends Ve{constructor({logits:e,pred_boxes:t,pred_masks:r}){
super(),this.logits=e,this.pred_boxes=t,this.pred_masks=r}},Kl=class extends F{},IP=class extends Kl{},LP=class extends Kl{async _call(e){
return new ie(await super._call(e))}},Jl=class extends F{},OP=class extends Jl{},NP=class extends Jl{async _call(e){return new ie(
await super._call(e))}},Bg=class extends F{},DP=class extends Bg{},Rg=class extends F{},zP=class extends Rg{},Ls=class extends F{},
BP=class extends Ls{},RP=class extends Ls{async _call(e){return new ie(await super._call(e))}},$P=class extends Ls{async _call(e){
return new He(await super._call(e))}},GP=class extends Ls{async _call(e){return new ot(await super._call(e))}},VP=class extends Ls{async _call(e){
return new Xe(await super._call(e))}},$g=class extends F{},UP=class extends $g{},Zl=class extends F{},jP=class extends Zl{},
qP=class extends Zl{},ec=class extends F{},WP=class extends ec{},HP=class extends ec{async _call(e){return new ie(await super.
_call(e))}},Os=class extends F{},QP=class extends Os{},XP=class extends Os{async _call(e){return new Xe(await super._call(
e))}},YP=class extends Os{async _call(e){return new ie(await super._call(e))}},KP=class extends Os{async _call(e){return new He(
await super._call(e))}},JP=class extends Os{async _call(e){return new ot(await super._call(e))}},Gg=class extends F{},Vg=class extends Gg{async forward({
input_ids:e,attention_mask:t,pixel_values:r=null,image_position_ids:s=null,pixel_values_videos:n=null,video_position_ids:a=null,
input_features:o=null,input_features_mask:i=null}){const l={image_features:r&&await this.encode_image({pixel_values:r,pixel_position_ids:s}),
video_features:n&&await this.encode_image({pixel_values:n,pixel_position_ids:a}),audio_features:o&&await this.encode_audio(
{input_features:o,input_features_mask:i})},{image_token_id:c,video_token_id:d,audio_token_id:h,text_config:_}=this.config,
p={image:c,video:d,audio:h};for(const[w,v]of Object.entries(p)){const y=`${w}_features`;l[y]??=new G("float32",new Float32Array(
0),[0,_.hidden_size]);let b=0;for(const k of e.data)Number(k)===v&&++b;if(b!==l[y].dims[0])throw new Error(`The number o\
f ${w} tokens (${b}) and ${w} features (${l[y].dims[0]}) do not match.`)}return await ve(this.sessions.model,{input_ids:e,
attention_mask:t,...l})}},tc=class extends F{},ZP=class extends tc{},eF=class extends tc{},bn=class extends F{},tF=class extends bn{},
rF=class extends bn{async _call(e){return new Xe(await super._call(e))}},sF=class extends bn{async _call(e){return new ie(
await super._call(e))}},nF=class extends bn{async _call(e){return new He(await super._call(e))}},Mn=class extends F{},aF=class extends Mn{},
oF=class extends Mn{async _call(e){return new Xe(await super._call(e))}},iF=class extends Mn{async _call(e){return new ie(
await super._call(e))}},lF=class extends Mn{async _call(e){return new He(await super._call(e))}},rc=class extends F{},cF=class extends rc{},
uF=class extends rc{},sc=class extends F{},dF=class extends sc{},hF=class extends sc{},nc=class extends F{},fF=class extends nc{},
_F=class extends nc{},ac=class extends F{},pF=class extends ac{},mF=class extends ac{async _call(e){return new ie(await super.
_call(e))}},Ug=class extends F{forward_params=["input_ids","inputs_embeds","attention_mask","pixel_values","encoder_outp\
uts","decoder_input_ids","decoder_inputs_embeds","decoder_attention_mask","past_key_values"];main_input_name="inputs_emb\
eds"},gF=class extends Ug{_merge_input_ids_with_image_features({inputs_embeds:e,image_features:t,input_ids:r,attention_mask:s}){
return{inputs_embeds:Oe([t,e],1),attention_mask:Oe([_t(t.dims.slice(0,2)),s],1)}}async _prepare_inputs_embeds({input_ids:e,
pixel_values:t,inputs_embeds:r,attention_mask:s}){if(!e&&!t)throw new Error("Either `input_ids` or `pixel_values` should\
 be provided.");let n,a;return e&&(n=await this.encode_text({input_ids:e})),t&&(a=await this.encode_image({pixel_values:t})),
n&&a?{inputs_embeds:r,attention_mask:s}=this._merge_input_ids_with_image_features({inputs_embeds:n,image_features:a,input_ids:e,
attention_mask:s}):r=n||a,{inputs_embeds:r,attention_mask:s}}async forward({input_ids:e,pixel_values:t,attention_mask:r,
decoder_input_ids:s,decoder_attention_mask:n,encoder_outputs:a,past_key_values:o,inputs_embeds:i,decoder_inputs_embeds:l,
num_logits_to_keep:c=null}){if(i||({inputs_embeds:i,attention_mask:r}=await this._prepare_inputs_embeds({input_ids:e,pixel_values:t,
inputs_embeds:i,attention_mask:r})),!a){let{last_hidden_state:h}=await Sr(this,{inputs_embeds:i,attention_mask:r});a=h}if(!l){
if(!s)throw new Error("Either `decoder_input_ids` or `decoder_inputs_embeds` should be provided.");l=await this.encode_text(
{input_ids:s})}return await dr(this,{inputs_embeds:l,attention_mask:n,encoder_attention_mask:r,encoder_hidden_states:a,past_key_values:o,
num_logits_to_keep:c},!0)}},oc=class extends F{},wF=class extends oc{},vF=class extends oc{},ic=class extends F{},yF=class extends ic{},
bF=class extends ic{},jg=class extends F{forward_params=["input_ids","attention_mask","pixel_values","position_ids","pas\
t_key_values"]},$t=class extends jg{_merge_input_ids_with_image_features(e){const t=e.image_features.dims.at(-1),r=e.image_features.
view(-1,t);return Cl({image_token_id:this.config.image_token_index??this.config.image_token_id,...e,image_features:r})}},
MF=class extends $t{},xF=class extends $t{},qg=class extends F{},kF=class extends qg{},Wg=class extends $t{},TF=class extends Wg{},
Hg=class extends F{forward_params=["input_ids","attention_mask","inputs_embeds","per_layer_inputs","position_ids","pixel\
_values","input_features","input_features_mask","past_key_values"]},$a=class extends Hg{async forward({input_ids:e=null,
attention_mask:t=null,pixel_values:r=null,input_features:s=null,input_features_mask:n=null,position_ids:a=null,inputs_embeds:o=null,
per_layer_inputs:i=null,past_key_values:l=null,generation_config:c=null,logits_processor:d=null,num_logits_to_keep:h=null,
..._}){if((!o||!i)&&({inputs_embeds:o,per_layer_inputs:i}=await ve(this.sessions.embed_tokens,{input_ids:e}),e.dims[1]!==
1)){if(r){const{image_features:w}=await this._encode_vision({pixel_values:r,..._});({inputs_embeds:o,attention_mask:t}=this.
_merge_input_ids_with_image_features({image_features:w,inputs_embeds:o,input_ids:e,attention_mask:t}))}if(s){const{audio_features:w}=await ve(
this.sessions.audio_encoder,{input_features:s,input_features_mask:n});({inputs_embeds:o,attention_mask:t}=this._merge_input_ids_with_audio_features(
{audio_features:w,inputs_embeds:o,input_ids:e,attention_mask:t}))}}return await dr(this,{inputs_embeds:o,per_layer_inputs:i,
past_key_values:l,attention_mask:t,position_ids:a,generation_config:c,logits_processor:d,num_logits_to_keep:h},!0)}_encode_vision(e){
return ve(this.sessions.vision_encoder,{pixel_values:e.pixel_values})}_merge_input_ids_with_image_features(e){const t=e.
image_features.dims.at(-1),r=e.image_features.view(-1,t);return Cl({image_token_id:this.config.image_token_id,...e,image_features:r})}_merge_input_ids_with_audio_features(e){
const t=e.audio_features.dims.at(-1),r=e.audio_features.view(-1,t);return Mg({audio_token_id:this.config.audio_token_id,
...e,audio_features:r})}},EF=class extends $a{},lc=class extends $a{forward_params=["input_ids","attention_mask","inputs\
_embeds","per_layer_inputs","position_ids","pixel_values","image_position_ids","input_features","input_features_mask","p\
ast_key_values"];_encode_vision(e){return ve(this.sessions.vision_encoder,{pixel_values:e.pixel_values,pixel_position_ids:e.
image_position_ids})}},AF=class extends lc{},cc=class extends F{},CF=class extends cc{},SF=class extends cc{},uc=class extends F{},
PF=class extends uc{},FF=class extends uc{},Qg=class extends F{forward_params=["input_ids","attention_mask","position_id\
s","past_key_values","pixel_values","image_grid_thw"]},dc=class extends Qg{image_grid_thw_name="grid_thw";_get_text_only_rope_index(e,t){
if(t){const{data:r,dims:s}=yg(t),n=BigInt64Array.from({length:3*r.length},(o,i)=>r[i%r.length]),a=Array.from({length:s[0]},
(o,i)=>We(r.subarray(s[1]*i,s[1]*(i+1)))[0]+1n+BigInt(s[1]));return[new G("int64",n,[3,...s]),new G("int64",a,[a.length,
1])]}else{const[r,s]=e.dims,n=BigInt64Array.from({length:3*r*s},(a,o)=>BigInt(Math.floor(o%s/r)));return[new G("int64",n,
[3,...e.dims]),bm([r,1])]}}_reorder_and_write_positions(e,t,r,s){const n=e.reduce((l,c)=>l+c.length,0),a=new Array(n);let o=0;
for(let l=0;l<3;++l)for(const c of e){const d=c.length/3;for(let h=l*d;h<(l+1)*d;++h)a[o++]=c[h]}let i=0;for(let l=0;l<t.
length;++l)if(t[l]==1){for(let c=0;c<3;++c)r[c][s][l]=a[c*n/3+i];++i}return a}_get_multimodal_rope_positions({filtered_ids:e,
image_grid_thw_list:t,video_grid_thw_list:r,spatial_merge_size:s,state:n}){const{image_token_id:a,video_token_id:o,vision_start_token_id:i}=this.
config,l=e,d=l.reduce((b,k,A)=>(k==i&&b.push(A),b),[]).map(b=>l[b+1]),h=d.filter(b=>b==a).length,_=d.filter(b=>b==o).length,
p=[];let w=0,v=h,y=_;for(let b=0;b<d.length;++b){const k=l.findIndex((L,O)=>O>w&&L==a),A=l.findIndex((L,O)=>O>w&&L==o),E=v>
0&&k!==-1?k:l.length+1,C=y>0&&A!==-1?A:l.length+1;let N,M,$,R;E<C?([M,$,R]=t[n.image_index],++n.image_index,--v,N=E):([M,
$,R]=r[n.video_index],++n.video_index,--y,N=C);const[j,Y,Q]=[Number(M),Math.floor(Number($)/s),Math.floor(Number(R)/s)],
z=N-w,I=p.length>0?We(p.at(-1))[0]+1:0;p.push(Array.from({length:3*z},(L,O)=>I+O%z));const U=z+I,X=j*Y*Q,ce=Array.from({
length:X},(L,O)=>U+Math.floor(O/(Y*Q))),Z=Array.from({length:X},(L,O)=>U+Math.floor(O/Q)%Y),se=Array.from({length:X},(L,O)=>U+
O%Q);p.push([ce,Z,se].flat()),w=N+X}if(w<l.length){const b=p.length>0?We(p.at(-1))[0]+1:0,k=l.length-w;p.push(Array.from(
{length:3*k},(A,E)=>b+E%k))}return p}get_rope_index(e,t,r,s){const{vision_config:n}=this.config,a=n.spatial_merge_size??
2;if(t||r){const o=e.tolist();s||(s=ll(e));const i=s.tolist(),l=Array.from({length:3},()=>Array.from({length:e.dims[0]},
()=>Array.from({length:e.dims[1]},()=>0))),c=t?t.tolist():[],d=r?r.tolist():[],h={image_index:0,video_index:0},_=[];for(let p=0;p<
o.length;++p){const w=o[p].filter((b,k)=>i[p][k]==1),v=this._get_multimodal_rope_positions({filtered_ids:w,image_grid_thw_list:c,
video_grid_thw_list:d,spatial_merge_size:a,state:h}),y=this._reorder_and_write_positions(v,i[p],l,p);_.push(We(y)[0]+1-o[p].
length)}return[new G("int64",l.flat(1/0),[3,e.dims[0],e.dims[1]]),new G("int64",_,[_.length,1])]}else return this._get_text_only_rope_index(
e,s)}async encode_image({pixel_values:e,image_grid_thw:t}){return(await ve(this.sessions.vision_encoder,{pixel_values:e,
[this.image_grid_thw_name]:t})).image_features}_merge_input_ids_with_image_features(e){return Cl({image_token_id:this.config.
image_token_id,...e})}prepare_inputs_for_generation(e,t,r){if(wn(this,t,1n),!t.attention_mask||t.position_ids||!(this.sessions.
decoder_model_merged??this.sessions.model).inputNames.includes("position_ids"))return t;if(!t.past_key_values)[t.position_ids,
t.rope_deltas]=this.get_rope_index(t.input_ids,t.image_grid_thw,t.video_grid_thw,t.attention_mask);else{t.pixel_values=null;
const n=t.past_key_values.get_seq_length();if(n<t.input_ids.dims[1]){const[a,o]=this.get_rope_index(t.input_ids,t.image_grid_thw,
t.video_grid_thw,t.attention_mask);t.rope_deltas=o,t.position_ids=a.slice(null,null,[n,null]),t.input_ids=t.input_ids.slice(
null,[n,null])}else{t.rope_deltas||([,t.rope_deltas]=this.get_rope_index(t.input_ids,t.image_grid_thw,t.video_grid_thw,t.
attention_mask));const a=BigInt(n),o=t.rope_deltas.map(i=>a+i);t.position_ids=ur([o,o,o],0)}}return t}},Xg=class extends dc{},
hc=class extends dc{image_grid_thw_name="image_grid_thw"},Yg=class extends Xg{image_grid_thw_name="image_grid_thw"},IF=class extends hc{get_vision_position_ids(e,t,r,s){
const n=Math.floor(t[0]/r),a=Math.floor(t[1]/s),o=Math.floor(t[2]/s),i=a*o*n,l=Array.from({length:i},()=>e),c=Array.from(
{length:i},(h,_)=>e+Math.floor(_/(o*n))),d=Array.from({length:i},(h,_)=>e+_%o);return[...l,...c,...d]}_get_multimodal_rope_positions({
filtered_ids:e,image_grid_thw_list:t,video_grid_thw_list:r,spatial_merge_size:s,state:n}){const{image_token_id:a}=this.config,
o=[];let i=0,l=e[0]==a?1:0;for(let h=1;h<=e.length;++h){const _=h<e.length?e[h]==a?1:0:-1;_!==l&&(o.push([l,i,h]),i=h,l=
_)}let c=0;const d=[];for(const[h,_,p]of o)if(h===0){const w=p-_;d.push(Array.from({length:3*w},(v,y)=>c+y%w)),c+=w}else{
const w=t[n.image_index++].map(Number),v=w[0];d.push(this.get_vision_position_ids(c,w,v,s)),c+=Math.max(w[1],w[2])/s}return d}},
fc=class extends F{},LF=class extends fc{},OF=class extends fc{},_c=class extends F{},NF=class extends _c{},DF=class extends _c{},
pc=class extends F{},zF=class extends pc{},BF=class extends pc{},mc=class extends F{},RF=class extends mc{},$F=class extends mc{},
gc=class extends F{},GF=class extends gc{},VF=class extends gc{},wc=class extends F{},UF=class extends wc{},jF=class extends wc{},
vc=class extends F{},qF=class extends vc{},WF=class extends vc{},yc=class extends F{},HF=class extends yc{},QF=class extends yc{},
bc=class extends F{},XF=class extends bc{},YF=class extends bc{},Kg=class extends F{forward_params=["input_ids","attenti\
on_mask","position_ids","audio_values","past_key_values"]},Mc=class extends Kg{_merge_input_ids_with_audio_features(e){const t=e.
audio_features.dims.at(-1),r=e.audio_features.view(-1,t);return Mg({audio_token_id:this.config.ignore_index??this.config.
audio_token_id??this.config.audio_token_index,...e,audio_features:r})}},KF=class extends Mc{forward_params=["input_ids",
"attention_mask","input_features","past_key_values"]},Jg=class extends F{},JF=class extends Jg{},Zg=class extends F{},ZF=class extends Zg{},
xc=class extends F{},eI=class extends xc{},tI=class extends xc{},kc=class extends F{},rI=class extends kc{},sI=class extends kc{async _call(e){
return new ie(await super._call(e))}},Tc=class extends F{},nI=class extends Tc{},aI=class extends Tc{forward_params=["in\
put_ids","attention_mask","token_type_ids","past_key_values"];prepare_inputs_for_generation(e,t,r){const s=Ms(this,e,t);
return s.token_type_ids=(s.past_key_values?cl:ll)(s.input_ids),s}},Fr=class extends F{},oI=class extends Fr{},iI=class extends Fr{async _call(e){
return new Pr(await super._call(e))}},lI=class extends Fr{async _call(e){return new ie(await super._call(e))}},cI=class extends Fr{async _call(e){
return new He(await super._call(e))}},uI=class extends F{},dI=class extends Fr{},hI=class extends Fr{async _call(e){return new Pr(
await super._call(e))}},fI=class extends Fr{async _call(e){return new ie(await super._call(e))}},Ec=class extends F{},_I=class extends Ec{},
pI=class extends Ec{},ew=class extends $t{forward_params=["input_ids","attention_mask","pixel_values","pixel_attention_m\
ask","position_ids","past_key_values"]},Ac=class extends F{},mI=class extends Ac{},gI=class extends Ac{async _call(e){return new ie(
await super._call(e))}},Cc=class extends F{},wI=class extends Cc{},vI=class extends Cc{},Ga=class extends F{},yI=class extends Ga{async forward(e){
const t=!e.input_ids,r=!e.pixel_values;if(t&&r)throw new Error("Either `input_ids` or `pixel_values` should be provided.");
if(t&&(e.input_ids=_t([e.pixel_values.dims[0],1])),r){const{image_size:l}=this.config.vision_config;e.pixel_values=ct([0,
3,l,l],0)}const{text_embeddings:s,image_embeddings:n,l2norm_text_embeddings:a,l2norm_image_embeddings:o}=await super.forward(
e),i={};return t||(i.text_embeddings=s,i.l2norm_text_embeddings=a),r||(i.image_embeddings=n,i.l2norm_image_embeddings=o),
i}},tw=class extends Ga{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??
"text_model"})}},bI=class extends Ga{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.
model_file_name??"vision_model"})}},Sc=class extends F{},MI=class extends Sc{},xI=class extends Sc{},kI=class extends $t{},
Pc=class extends F{},TI=class extends Pc{},EI=class extends Pc{},AI=class extends $t{forward_params=["input_ids","attent\
ion_mask","pixel_values","pixel_attention_mask","spatial_shapes","position_ids","past_key_values"]},Fc=class extends F{},
CI=class extends Fc{},SI=class extends Fc{},PI=class extends $t{forward_params=["input_ids","attention_mask","pixel_valu\
es","image_grid_thw","position_ids","past_key_values"]},Ic=class extends F{},FI=class extends Ic{},II=class extends Ic{},
rw=class extends F{},LI=class extends rw{},Lc=class extends F{},OI=class extends Lc{},NI=class extends Lc{},Oc=class extends F{},
DI=class extends Oc{},zI=class extends Oc{},Nc=class extends F{},BI=class extends Nc{},RI=class extends Nc{},Dc=class extends F{},
$I=class extends Dc{},GI=class extends Dc{},xn=class extends F{},VI=class extends xn{},UI=class extends xn{},jI=class extends xn{async _call(e){
return new ie(await super._call(e))}},qI=class extends xn{},sw=class extends F{},WI=class extends sw{},nw=class extends F{},
HI=class extends nw{},aw=class extends Ve{constructor({char_logits:e,bpe_logits:t,wp_logits:r}){super(),this.char_logits=
e,this.bpe_logits=t,this.wp_logits=r}get logits(){return[this.char_logits,this.bpe_logits,this.wp_logits]}},ow=class extends F{},
QI=class extends ow{async _call(e){return new aw(await super._call(e))}},iw=class extends Ve{constructor({audio_codes:e}){
super(),this.audio_codes=e}},lw=class extends Ve{constructor({audio_values:e}){super(),this.audio_values=e}},Va=class extends F{main_input_name="\
input_values";forward_params=["input_values"]},XI=class extends Va{async encode(e){return new iw(await ve(this.sessions.
encoder_model,e))}async decode(e){return new lw(await ve(this.sessions.decoder_model,e))}},cw=class extends Va{static async from_pretrained(e,t={}){
return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??"encoder_model"})}},uw=class extends Va{static async from_pretrained(e,t={}){
return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??"decoder_model"})}},zc=class extends F{},YI=class extends zc{},
KI=class extends zc{},Bc=class extends F{},JI=class extends Bc{},ZI=class extends Bc{},Rc=class extends F{},eL=class extends Rc{},
tL=class extends Rc{},rL=class extends $t{},$c=class extends F{},sL=class extends $c{},nL=class extends $c{},kn=class extends F{},
aL=class extends kn{},oL=class extends kn{async _call(e){return new Xe(await super._call(e))}},iL=class extends kn{async _call(e){
return new ie(await super._call(e))}},lL=class extends kn{async _call(e){return new ot(await super._call(e))}},Gc=class extends F{},
cL=class extends Gc{},uL=class extends Gc{},Ua=class extends F{},dL=class extends Ua{},hL=class extends Ua{async _call(e){
return new ie(await super._call(e))}},fL=class extends Ua{},ja=class extends F{},_L=class extends ja{},pL=class extends ja{async _call(e){
return new ie(await super._call(e))}},mL=class extends ja{},qa=class extends F{},gL=class extends qa{},wL=class extends qa{async _call(e){
return new ie(await super._call(e))}},vL=class extends qa{},Wa=class extends F{},yL=class extends Wa{},bL=class extends Wa{async _call(e){
return new ie(await super._call(e))}},ML=class extends Wa{},Vc=class extends F{},xL=class extends Vc{},kL=class extends Vc{async _call(e){
return new ie(await super._call(e))}},Uc=class extends F{},TL=class extends Uc{},EL=class extends Uc{async _call(e){return new ie(
await super._call(e))}},Tn=class extends F{},AL=class extends Tn{},CL=class extends Tn{async _call(e){return new Xe(await super.
_call(e))}},SL=class extends Tn{async _call(e){return new ie(await super._call(e))}},PL=class extends Tn{async _call(e){
return new He(await super._call(e))}},jc=class extends F{},FL=class extends jc{},IL=class extends jc{},qc=class extends F{requires_attention_mask=!1;main_input_name="\
input_values";forward_params=["input_values","decoder_input_ids","past_key_values"]},LL=class extends qc{},OL=class extends qc{},
Ns=class extends F{},NL=class extends Ns{},DL=class extends Ns{async _call(e){return new Xe(await super._call(e))}},zL=class extends Ns{async _call(e){
return new ie(await super._call(e))}},BL=class extends Ns{async _call(e){return new He(await super._call(e))}},RL=class extends Ns{async _call(e){
return new ot(await super._call(e))}},Wc=class extends F{},$L=class extends Wc{},GL=class extends Wc{},Hc=class extends F{},
VL=class extends Hc{},UL=class extends Hc{},dw=class extends F{},jL=class extends dw{forward_params=["input_ids","pixel_\
values","images_seq_mask","images_emb_mask","attention_mask","position_ids","past_key_values"];constructor(...e){super(...e),
this._generation_mode="text"}async forward(e){const t=this._generation_mode??"text";let r;if(t==="text"||!e.past_key_values){
const i=this.sessions.prepare_inputs_embeds,l=Ze(e,i.inputNames);r=await ve(i,l)}else{const i=this.sessions.gen_img_embeds,
l=Ze({image_ids:e.input_ids},i.inputNames);r=await ve(i,l)}const s={...e,...r},n=await dr(this,s),a=this.sessions[t==="t\
ext"?"lm_head":"gen_head"];if(!a)throw new Error(`Unable to find "${a}" generation head`);const o=await ve(a,Ze(n,a.inputNames));
return{...r,...n,...o}}prepare_inputs_for_generation(e,t,r){const s=!!t.past_key_values;return wn(this,t,1n),r.guidance_scale!==
null&&r.guidance_scale>1&&(s?t.input_ids=Oe([t.input_ids,t.input_ids],0):(t.input_ids=Oe([t.input_ids,xi(t.input_ids,BigInt(
r.pad_token_id))],0),t.attention_mask=Oe([t.attention_mask,xi(t.attention_mask,0n)],0))),(s||!t.pixel_values)&&(t.pixel_values=
ct([0,0,3,384,384],1)),s&&(t.images_seq_mask=new G("bool",new Array(1).fill(!0).fill(!1,0,1),[1,1]),t.images_emb_mask=new G(
"bool",new Array(0).fill(!1),[1,1,0])),t}async generate(e){return this._generation_mode="text",super.generate(e)}async generate_images(e){
this._generation_mode="image";const t=(e.inputs??e[this.main_input_name]).dims[1],s=(await super.generate(e)).slice(null,
[t,null]),n=this.sessions.image_decode,{decoded_image:a}=await ve(n,{generated_tokens:s}),o=a.add_(1).mul_(255/2).clamp_(
0,255).to("uint8"),i=[];for(const l of o){const c=Mt.fromTensor(l);i.push(c)}return i}},Qc=class extends F{},qL=class extends Qc{},
WL=class extends Qc{},hw=class extends F{forward_params=["input_ids","attention_mask","encoder_outputs","decoder_input_i\
ds","decoder_attention_mask","past_key_values"];_apply_and_filter_by_delay_pattern_mask(e){const[t,r]=e.dims,s=this.config.
decoder.num_codebooks,n=r-s;let a=0;for(let l=0;l<e.size;++l){if(e.data[l]==this.config.decoder.pad_token_id)continue;const c=l%
r,d=Math.floor(l/r)%s,h=c-d;h>0&&h<=n&&(e.data[a++]=e.data[l])}const o=Math.floor(t/s),i=a/(o*s);return new G(e.type,e.data.
slice(0,a),[o,s,i])}prepare_inputs_for_generation(e,t,r){const s=BigInt(this.config.decoder.pad_token_id);let n=structuredClone(
e);for(let a=0;a<n.length;++a)for(let o=0;o<n[a].length;++o)a%this.config.decoder.num_codebooks>=o&&(n[a][o]=s);return r.
guidance_scale!==null&&r.guidance_scale>1&&(n=n.concat(n)),ka(this,n,t)}async generate(e){const t=await super.generate(e),
r=this._apply_and_filter_by_delay_pattern_mask(t).unsqueeze_(0),{audio_values:s}=await ve(this.sessions.encodec_decode,{
audio_codes:r});return s}},Xc=class extends F{},HL=class extends Xc{},QL=class extends Xc{},Yc=class extends F{},XL=class extends Yc{},
YL=class extends Yc{},Ds=class extends F{},KL=class extends Ds{},JL=class extends Ds{async _call(e){return new Xe(await super.
_call(e))}},ZL=class extends Ds{async _call(e){return new ie(await super._call(e))}},eO=class extends Ds{async _call(e){
return new He(await super._call(e))}},tO=class extends Ds{async _call(e){return new ot(await super._call(e))}},fw=class extends F{},
rO=class extends fw{},Kc=class extends F{},sO=class extends Kc{},nO=class extends Kc{},Jc=class extends F{},aO=class extends Jc{},
oO=class extends Jc{},Zc=class extends F{},iO=class extends Zc{},lO=class extends Zc{},eu=class extends F{},cO=class extends eu{},
uO=class extends eu{},tu=class extends F{},dO=class extends tu{},hO=class extends tu{async _call(e){return new ie(await super.
_call(e))}},ru=class extends F{},fO=class extends ru{},_O=class extends ru{},su=class extends F{},pO=class extends su{},
mO=class extends su{},nu=class extends F{},gO=class extends nu{},wO=class extends nu{},au=class extends F{},vO=class extends au{},
yO=class extends au{},bO=class extends $t{},_w=class extends F{},MO=class extends _w{async _call(e){return new Pr(await super.
_call(e))}},ou=class extends F{},xO=class extends ou{},kO=class extends ou{},iu=class extends F{},TO=class extends iu{},
EO=class extends iu{},lu=class extends F{},AO=class extends lu{},CO=class extends lu{},cu=class extends F{},SO=class extends cu{},
PO=class extends cu{},pw=class extends F{forward_params=["input_ids","inputs_embeds","attention_mask","position_ids","pi\
xel_values","image_sizes","past_key_values"]},mw=class extends pw{async forward({input_ids:e=null,attention_mask:t=null,
pixel_values:r=null,image_sizes:s=null,position_ids:n=null,inputs_embeds:a=null,past_key_values:o=null,generation_config:i=null,
logits_processor:l=null,num_logits_to_keep:c=null,...d}){if(!a){let _;if(r&&e.dims[1]!==1){if(!s)throw new Error("`image\
_sizes` must be provided when `pixel_values` is provided.");({image_features:_}=await ve(this.sessions.vision_encoder,{pixel_values:r,
image_sizes:s}))}else{const p=this.config.normalized_config.hidden_size;_=new G("float32",[],[0,p])}({inputs_embeds:a}=await ve(
this.sessions.prepare_inputs_embeds,{input_ids:e,image_features:_}))}return await dr(this,{inputs_embeds:a,past_key_values:o,
attention_mask:t,position_ids:n,generation_config:i,logits_processor:l,num_logits_to_keep:c},!1)}},uu=class extends F{},
FO=class extends uu{},IO=class extends uu{async _call(e){return new ie(await super._call(e))}},du=class extends F{},LO=class extends du{},
OO=class extends du{async _call(e){return new He(await super._call(e))}},hu=class extends F{},NO=class extends hu{},DO=class extends hu{},
fu=class extends F{},zO=class extends fu{},BO=class extends fu{},_u=class extends F{},RO=class extends _u{},$O=class extends _u{},
pu=class extends F{},GO=class extends pu{},VO=class extends pu{},mu=class extends F{},UO=class extends mu{},jO=class extends mu{},
gu=class extends hc{},gw=class extends Yg{},qO=class extends gu{},WO=class extends gw{},wu=class extends gu{},ww=class extends wu{},
HO=class extends wu{},QO=class extends ww{},vu=class extends F{},XO=class extends vu{},YO=class extends vu{async _call(e){
return new ie(await super._call(e))}},yu=class extends F{},KO=class extends yu{},JO=class extends yu{async _call(e){return new vw(
await super._call(e))}},vw=class extends yn{},zs=class extends F{},ZO=class extends zs{},eN=class extends zs{async _call(e){
return new Xe(await super._call(e))}},tN=class extends zs{async _call(e){return new ie(await super._call(e))}},rN=class extends zs{async _call(e){
return new He(await super._call(e))}},sN=class extends zs{async _call(e){return new ot(await super._call(e))}},Bs=class extends F{},
nN=class extends Bs{},aN=class extends Bs{async _call(e){return new Xe(await super._call(e))}},oN=class extends Bs{async _call(e){
return new ie(await super._call(e))}},iN=class extends Bs{async _call(e){return new He(await super._call(e))}},lN=class extends Bs{async _call(e){
return new ot(await super._call(e))}},bu=class extends F{},cN=class extends bu{},uN=class extends bu{async _call(e){return new yw(
await super._call(e))}},yw=class extends yn{},bw=class extends Ve{constructor({iou_scores:e,pred_masks:t}){super(),this.
iou_scores=e,this.pred_masks=t}},Mw=class extends F{},dN=class extends Mw{async get_image_embeddings({pixel_values:e}){return await Sr(
this,{pixel_values:e})}async forward(e){!e.image_embeddings||!e.image_positional_embeddings?e={...e,...await this.get_image_embeddings(
e)}:e={...e},e.input_labels??=_t(e.input_points.dims.slice(0,-1));const t={image_embeddings:e.image_embeddings,image_positional_embeddings:e.
image_positional_embeddings};return e.input_points&&(t.input_points=e.input_points),e.input_labels&&(t.input_labels=e.input_labels),
e.input_boxes&&(t.input_boxes=e.input_boxes),await ve(this.sessions.prompt_encoder_mask_decoder,t)}async _call(e){return new bw(
await super._call(e))}},xw=class extends Ve{constructor({iou_scores:e,pred_masks:t,object_score_logits:r}){super(),this.
iou_scores=e,this.pred_masks=t,this.object_score_logits=r}},kw=class extends F{},Mu=class extends kw{async get_image_embeddings({
pixel_values:e}){return await Sr(this,{pixel_values:e})}async forward(e){const{num_feature_levels:t}=this.config.vision_config;
if(Array.from({length:t},(a,o)=>`image_embeddings.${o}`).some(a=>!e[a])?e={...e,...await this.get_image_embeddings(e)}:e=
{...e},e.input_points){if(e.input_boxes&&e.input_boxes.dims[1]!==1)throw new Error("When both `input_points` and `input_\
boxes` are provided, the number of boxes per image must be 1.");const a=e.input_points.dims;e.input_labels??=_t(a.slice(
0,-1)),e.input_boxes??=ct([a[0],0,4],0)}else if(e.input_boxes){const a=e.input_boxes.dims;e.input_labels=ct([a[0],a[1],0],
-1n),e.input_points=ct([a[0],1,0,2],0)}else throw new Error("At least one of `input_points` or `input_boxes` must be pro\
vided.");const s=this.sessions.prompt_encoder_mask_decoder,n=Ze(e,s.inputNames);return await ve(s,n)}async _call(e){return new xw(
await super._call(e))}},hN=class extends Mu{},fN=class extends Mu{},Ha=class extends F{},_N=class extends Ha{},pN=class extends Ha{},
mN=class extends Ha{},Qa=class extends F{},gN=class extends Qa{},wN=class extends Qa{},vN=class extends Qa{},xu=class extends F{},
yN=class extends xu{},Tw=class extends xu{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.
model_file_name??"text_model"})}},bN=class extends Zr{static async from_pretrained(e,t={}){return super.from_pretrained(
e,{...t,model_file_name:t.model_file_name??"vision_model"})}},ku=class extends F{},MN=class extends ku{},xN=class extends ku{},
kN=class extends ew{},Xa=class extends F{main_input_name="input_values";forward_params=["input_values"]},TN=class extends Xa{async encode(e){
return await ve(this.sessions.encoder_model,e)}async decode(e){return await ve(this.sessions.decoder_model,e)}},Ew=class extends Xa{static async from_pretrained(e,t={}){
return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??"encoder_model"})}},Aw=class extends Xa{static async from_pretrained(e,t={}){
return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??"decoder_model"})}},Tu=class extends F{},EN=class extends Tu{},
AN=class extends Tu{},Ya=class extends F{},CN=class extends Ya{},SN=class extends Ya{},PN=class extends Ya{async generate_speech(e,t,{
threshold:r=.5,minlenratio:s=0,maxlenratio:n=20,vocoder:a=null}={}){const o={input_ids:e},{encoder_outputs:i,encoder_attention_mask:l}=await Sr(
this,o),c=i.dims[1]/this.config.reduction_factor,d=Math.floor(c*n),h=Math.floor(c*s),_=this.config.num_mel_bins;let p=[],
w=null,v=null,y=0;for(;;){++y;const A=gg(!!v);let E;v?E=v.output_sequence_out:E=new G("float32",new Float32Array(_),[1,1,
_]);let C={use_cache_branch:A,output_sequence:E,encoder_attention_mask:l,speaker_embeddings:t,encoder_hidden_states:i};Al(
this,C,w),v=await ve(this.sessions.decoder_model_merged,C),w=Pi(v,w);const{prob:N,spectrum:M}=v;if(p.push(M),y>=h&&(Array.
from(N.data).filter($=>$>=r).length>0||y>=d))break}const b=Oe(p),{waveform:k}=await ve(a.sessions.model,{spectrogram:b});
return{spectrogram:b,waveform:k}}},FN=class extends F{main_input_name="spectrogram"},En=class extends F{},IN=class extends En{},
LN=class extends En{async _call(e){return new Xe(await super._call(e))}},ON=class extends En{async _call(e){return new ie(
await super._call(e))}},NN=class extends En{async _call(e){return new ot(await super._call(e))}},Eu=class extends F{},DN=class extends Eu{},
zN=class extends Eu{},Au=class extends F{},BN=class extends Au{},RN=class extends Au{},Cw=class extends F{},$N=class extends Cw{},
Sw=class extends F{},Pw=class extends Sw{async generate_speech({input_ids:e,attention_mask:t,style:r,num_inference_steps:s=5,
speed:n=1.05}){const{sampling_rate:a,chunk_compress_factor:o,base_chunk_size:i,latent_dim:l}=this.config,{last_hidden_state:c,
durations:d}=await ve(this.sessions.text_encoder,{input_ids:e,attention_mask:t,style:r}),h=d.div(n).mul_(a),_=i*o,p=h.data,
w=Int32Array.from(p,R=>Math.ceil(R/_)),v=Math.max(...w),y=e.dims[0],b=new BigInt64Array(y*v);for(let R=0;R<y;++R)b.fill(
1n,R*v,R*v+w[R]);const k=new G("int64",b,[y,v]),A=l*o,E=A*v;let C=JT([y,A,v]);const N=C.data;for(let R=0;R<y;++R)if(w[R]!==
v)for(let j=0;j<A;++j)N.fill(0,R*E+j*v+w[R],R*E+(j+1)*v);const M=ct([y],s);for(let R=0;R<s;++R){const j=ct([y],R);({denoised_latents:C}=
await ve(this.sessions.latent_denoiser,{style:r,noisy_latents:C,latent_mask:k,encoder_outputs:c,attention_mask:t,timestep:j,
num_inference_steps:M}))}const{waveform:$}=await ve(this.sessions.voice_decoder,{latents:C});return{waveform:$,durations:h}}},
Ka=class extends F{},GN=class extends Ka{},VN=class extends Ka{async _call(e){return new ie(await super._call(e))}},UN=class extends Ka{},
Cu=class extends F{},jN=class extends Cu{},qN=class extends Cu{},Su=class extends F{forward_params=["input_ids","attenti\
on_mask","encoder_outputs","decoder_input_ids","decoder_attention_mask","past_key_values"]},WN=class extends Su{},HN=class extends Su{},
Pu=class extends F{},QN=class extends Pu{},XN=class extends Pu{async _call(e){return new Fw(await super._call(e))}},Fw=class extends Yl{},
Iw=class extends F{},YN=class extends Iw{},Ja=class extends F{},KN=class extends Ja{},JN=class extends Ja{async _call(e){
return new Pr(await super._call(e))}},ZN=class extends Ja{async _call(e){return new ie(await super._call(e))}},An=class extends F{},
e3=class extends An{},t3=class extends An{async _call(e){return new Pr(await super._call(e))}},r3=class extends An{async _call(e){
return new ie(await super._call(e))}},s3=class extends An{async _call(e){return new He(await super._call(e))}},Fu=class extends F{},
n3=class extends Fu{},a3=class extends Fu{},o3=class extends F{main_input_name="pixel_values";forward_params=["pixel_val\
ues","decoder_input_ids","encoder_hidden_states","past_key_values"]},Iu=class extends F{},i3=class extends Iu{},l3=class extends Iu{async _call(e){
return new ie(await super._call(e))}},Lw=class extends F{},c3=class extends Lw{},Lu=class extends F{},u3=class extends Lu{},
d3=class extends Lu{async _call(e){return new ie(await super._call(e))}},Ow=class extends F{},h3=class extends Ow{async _call(e){
return new dg(await super._call(e))}},Nw=class extends F{},f3=class extends Nw{},Dw=class extends Ve{constructor({waveform:e,
spectrogram:t}){super(),this.waveform=e,this.spectrogram=t}},zw=class extends F{},_3=class extends zw{async _call(e){return new Dw(
await super._call(e))}},p3=class extends Mc{},S_=2,m3=1,di=new WeakMap;function g3(e,t){const{text_config:r,audio_config:s}=e.
config,n=e.sessions.audio_encoder,{num_mel_bins:a,hidden_size:o}=s,i=a+o,l=new Ml,c=Oa(s),d={batch_size:1};let h="float3\
2";for(const v of n.inputMetadata){if(v.name==="past_padding_cache"){h=v.type;continue}if(!c.has(v.name))continue;const y=wg(
v.shape,d),b=y.reduce((A,E)=>A*E,1),k=ln[v.type];l[v.name]=new G(v.type,new k(b),y)}const _=ln[h],p=new G(h,new _(i*S_),
[1,i,S_]),w=t[Symbol.asyncIterator]?.()??t[Symbol.iterator]?.();if(!w)throw new Error("input_features must be iterable o\
r async iterable");return{encoder_session:n,enc_kv_cache:l,enc_padding_cache:p,enc_past_seq_len:0,audio_embed_queue:[],audio_embed_total_tokens:0,
audio_queue_offset:0,audio_consumed:0,stream_exhausted:!1,chunks_iter:w,text_hidden_size:r.hidden_size}}async function w3(e,t){
const r=t.dims[2],s=Math.floor((m3+r-3)/2)+1,n=new G("int64",BigInt64Array.from({length:s},(d,h)=>BigInt(e.enc_past_seq_len+
h)),[1,s]),a=e.enc_past_seq_len+s,o=_t([1,a]),{audio_embeds:i,present_padding_cache:l,...c}=await ve(e.encoder_session,{
input_features:t,attention_mask:o,position_ids:n,past_padding_cache:e.enc_padding_cache,...e.enc_kv_cache});e.enc_padding_cache.
location==="gpu-buffer"&&e.enc_padding_cache.dispose(),e.enc_padding_cache=l;for(const d in c)if(d.startsWith("present.")){
const h=d.replace("present","past_key_values"),_=e.enc_kv_cache[h];_?.location==="gpu-buffer"&&_.dispose(),e.enc_kv_cache[h]=
c[d]}return e.enc_past_seq_len=a,i}async function v3(e,t){for(;e.audio_embed_total_tokens<t&&!e.stream_exhausted;){const r=await e.
chunks_iter.next();if(r.done){e.stream_exhausted=!0;break}const s=await w3(e,r.value);e.audio_embed_queue.push({data:s.data,
tokens:s.dims[1]}),e.audio_embed_total_tokens+=s.dims[1]}}function y3(e,t,r){if(e.audio_embed_queue.length===0)return;const s=t.
data;let n=0,a=r;for(;a>0&&e.audio_embed_queue.length>0;){const o=e.audio_embed_queue[0],i=o.tokens-e.audio_queue_offset,
l=Math.min(a,i),c=e.audio_queue_offset*e.text_hidden_size;for(let d=0;d<l*e.text_hidden_size;++d)s[n*e.text_hidden_size+
d]+=o.data[c+d];n+=l,a-=l,e.audio_queue_offset+=l,e.audio_queue_offset>=o.tokens&&(e.audio_embed_queue.shift(),e.audio_queue_offset=
0)}e.audio_consumed+=r-a}var b3=class extends gn{constructor(e){super(),this._s=e}_call(e){const t=this._s.stream_exhausted&&
this._s.audio_embed_queue.length===0;return e.map(()=>t)}},Bw=class extends F{forward_params=["input_ids","attention_mas\
k","position_ids","past_key_values"]},Rw=class extends Bw{async forward({input_ids:e,past_key_values:t,...r}){const s=e.
dims[1],n=di.get(this);n&&await v3(n,n.audio_consumed+s);const{inputs_embeds:a}=await ve(this.sessions.embed_tokens,{input_ids:e});
n&&y3(n,a,s);const o={inputs_embeds:a,...r};Al(this,o,t);const i=this.sessions.decoder_model_merged,l=Ze(o,i.inputNames);
return await ve(i,l)}async generate({input_features:e,stopping_criteria:t,...r}){if(!e)throw new Error("input_features (\
generator/iterable) must be provided");const s=g3(this,e);di.set(this,s);const n=new _g;n.push(new b3(s)),t&&n.extend(t);
try{return await super.generate({...r,stopping_criteria:n})}finally{s.enc_kv_cache.dispose(),di.delete(this)}}},Za=class extends F{},
M3=class extends Za{},x3=class extends Za{async _call(e){return new Pr(await super._call(e))}},k3=class extends Za{async _call(e){
return new ie(await super._call(e))}},$w=class extends Ve{constructor({logits:e,embeddings:t}){super(),this.logits=e,this.
embeddings=t}},Rs=class extends F{},T3=class extends Rs{},E3=class extends Rs{async _call(e){return new Pr(await super._call(
e))}},A3=class extends Rs{async _call(e){return new ie(await super._call(e))}},C3=class extends Rs{async _call(e){return new $w(
await super._call(e))}},S3=class extends Rs{async _call(e){return new He(await super._call(e))}},Gw=class extends F{},P3=class extends Gw{},
F3=class extends fg{return_timestamps=null;return_token_timestamps=null;num_frames=null;alignment_heads=null;task=null;language=null;no_timestamps_token_id=null;prompt_ids=null;is_multilingual=null;lang_to_id=null;task_to_id=null;max_initial_timestamp_index=1},
Ou=class extends F{requires_attention_mask=!1;main_input_name="input_features";forward_params=["input_features","attenti\
on_mask","decoder_input_ids","decoder_attention_mask","past_key_values"]},I3=class extends Ou{},Vw=class extends Ou{_prepare_generation_config(e,t){
return super._prepare_generation_config(e,t,F3)}_retrieve_init_tokens(e){const t=[e.decoder_start_token_id];let r=e.language;
const s=e.task;if(e.is_multilingual){r||(de.warn("No language specified - defaulting to English (en)."),r="en");const a=`\
<|${HE(r)}|>`;t.push(e.lang_to_id[a]),t.push(e.task_to_id[s??"transcribe"])}else if(r||s)throw new Error("Cannot specify\
 `task` or `language` for an English-only model. If the model is intended to be multilingual, pass `is_multilingual=true\
` to generate, or update the generation config.");return!e.return_timestamps&&e.no_timestamps_token_id&&t.at(-1)!==e.no_timestamps_token_id?
t.push(e.no_timestamps_token_id):e.return_timestamps&&t.at(-1)===e.no_timestamps_token_id&&(de.warn("<|notimestamps|> pr\
ompt token is removed from generation_config since `return_timestamps` is set to `true`."),t.pop()),t.filter(n=>n!=null)}async generate({
inputs:e=null,generation_config:t=null,logits_processor:r=null,stopping_criteria:s=null,...n}){t=this._prepare_generation_config(
t,n);const a=n.decoder_input_ids instanceof G?dl(n.decoder_input_ids):n.decoder_input_ids??this._retrieve_init_tokens(t);
if(t.return_timestamps&&(r??=new Ci,r.push(new FC(t,a))),t.begin_suppress_tokens&&(r??=new Ci,r.push(new hg(t.begin_suppress_tokens,
a.length))),t.return_token_timestamps){if(!t.alignment_heads)throw new Error("Model generation config has no `alignment_\
heads`, token-level timestamps not available. See https://gist.github.com/hollance/42e32852f24243b748ae6bc1f985b13a on h\
ow to add this property to the generation config.");t.task==="translate"&&de.warn("Token-level timestamps may not be rel\
iable for task 'translate'."),t.output_attentions=!0,t.return_dict_in_generate=!0}if(t.return_timestamps&&!n.max_new_tokens)
return this._generate_with_seek({inputs:e,generation_config:t,logits_processor:r,init_tokens:a,kwargs:n});const o=await super.
generate({inputs:e,generation_config:t,logits_processor:r,decoder_input_ids:a,...n});return t.return_token_timestamps&&(o.
token_timestamps=this._extract_token_timestamps(o,t.alignment_heads,t.num_frames,.02,a.length)),o}async _generate_with_seek({
inputs:e,generation_config:t,logits_processor:r,init_tokens:s,kwargs:n}){const a=t.no_timestamps_token_id+1,o=Array.isArray(
t.eos_token_id)?t.eos_token_id[0]:t.eos_token_id,i=t.return_token_timestamps,l=e,c=l.dims[2],d=2,h=this.config.max_source_positions,
_=d*h;let p=0;const w=[],v=[];for(;p<c;){const b=Math.min(p+_,c),k=l.slice(null,null,[p,b]);let A;const E=k.dims[2];if(E<
_){const X=l.dims[1],ce=new Float32Array(X*_),Z=k.data;for(let se=0;se<X;++se)ce.set(Z.subarray(se*E,(se+1)*E),se*_);A=new G(
"float32",ce,[1,X,_])}else A=k;if(r)for(const X of r)"begin_index"in X&&(X.begin_index=s.length);const C=await super.generate(
{inputs:A,generation_config:t,logits_processor:r,decoder_input_ids:s,...n}),M=(i?C.sequences:C)[0].tolist().map(Number).
slice(s.length);let $;if(i){C.token_timestamps=this._extract_token_timestamps(C,t.alignment_heads,Math.floor((b-p)/d),.02,
s.length);const X=p/d*.02;$=C.token_timestamps[0].tolist().slice(s.length).map(ce=>ce+X)}if(M.length>0&&M.at(-1)===o&&M.
pop(),M.length===0)break;const R=M.map(X=>X>=a),j=M.length>=2&&R[M.length-1]&&!R[M.length-2],Y=[];for(let X=0;X<M.length-
1;++X)R[X]&&R[X+1]&&Y.push(X+1);let Q,z=M.length;if(Y.length>0)if(j)Q=b-p;else{const X=Y.at(-1);Q=(M[X-1]-a)*d,z=X}else Q=
b-p;const I=Math.floor(p/d),U=a+1500;for(let X=0;X<z;++X)M[X]>=a&&(M[X]=Math.min(M[X]+I,U));w.push(...M.slice(0,z)),$&&v.
push(...$.slice(0,z)),p+=Q}w.push(o);const y=[...s,...w];if(i){const b=new G("int64",y.map(BigInt),[1,y.length]),k=[...new Array(
s.length).fill(0),...v,0],A=new G("float32",new Float32Array(k),[1,k.length]);return{sequences:b,token_timestamps:A}}return new G(
"int64",y.map(BigInt),[1,y.length])}_extract_token_timestamps(e,t,r=null,s=.02,n=0){if(!e.cross_attentions)throw new Error(
"Model outputs must contain cross attentions to extract timestamps. This is most likely because the model was not export\
ed with `output_attentions=True`.");r==null&&de.warn("`num_frames` has not been set, meaning the entire audio will be an\
alyzed. This may lead to inaccurate token-level timestamps for short audios (< 30 seconds).");let a=this.config.median_filter_width;
a===void 0&&(de.warn("Model config has no `median_filter_width`, using default value of 7."),a=7);const o=e.cross_attentions,
i=Array.from({length:this.config.decoder_layers},(y,b)=>Oe(o.map(k=>k[b]),2)),l=ur(t.map(([y,b])=>{if(y>=i.length)throw new Error(
`Layer index ${y} is out of bounds for cross attentions (length ${i.length}).`);return r?i[y].slice(null,b,null,[0,r]):i[y].
slice(null,b)})).permute(1,0,2,3),[c,d]=ym(l,-2,0,!0),h=l.clone();for(let y=0;y<h.dims[0];++y){const b=h[y];for(let k=0;k<
b.dims[0];++k){const A=b[k],E=c[y][k][0].data,C=d[y][k][0].data;for(let N=0;N<A.dims[0];++N){let M=A[N].data;for(let $=0;$<
M.length;++$)M[$]=(M[$]-C[$])/E[$];M.set(LT(M,a))}}}const _=n>0?h.slice(null,null,[n,h.dims[2]],null):h,p=[ol(_,1)],w=e.
sequences.dims,v=new G("float32",new Float32Array(w[0]*w[1]),w);for(let y=0;y<w[0];++y){const b=p[y].neg().squeeze_(0),[
k,A]=NT(b.tolist()),E=Array.from({length:k.length-1},($,R)=>k[R+1]-k[R]),C=Dt([1],E).map($=>!!$),N=[];for(let $=0;$<C.length;++$)
C[$]&&N.push(A[$]*s);const M=new Array(n).fill(0);M.push(...N),N.length>0&&M.push(N.at(-1)),v[y].data.set(M)}return v}},
L3=class extends Vw{},$s=class extends F{},O3=class extends $s{},N3=class extends $s{async _call(e){return new Xe(await super.
_call(e))}},D3=class extends $s{async _call(e){return new ie(await super._call(e))}},z3=class extends $s{async _call(e){
return new He(await super._call(e))}},B3=class extends $s{async _call(e){return new ot(await super._call(e))}},Gs=class extends F{},
R3=class extends Gs{},$3=class extends Gs{async _call(e){return new Xe(await super._call(e))}},G3=class extends Gs{async _call(e){
return new ie(await super._call(e))}},V3=class extends Gs{async _call(e){return new He(await super._call(e))}},U3=class extends Gs{async _call(e){
return new ot(await super._call(e))}},Nu=class extends F{},j3=class extends Nu{},q3=class extends Nu{async _call(e){return new Uw(
await super._call(e))}},Uw=class extends Ve{constructor({logits:e,pred_boxes:t}){super(),this.logits=e,this.pred_boxes=t}},
Du=class extends F{},W3=class extends Du{},H3=class extends Du{},zu=class extends F{},Q3=class extends zu{},X3=class extends zu{},
Y3=new Map([["bert","BertModel"],["eurobert","EuroBertModel"],["neobert","NeoBertModel"],["modernbert","ModernBertModel"],
["nomic_bert","NomicBertModel"],["roformer","RoFormerModel"],["electra","ElectraModel"],["esm","EsmModel"],["convbert","\
ConvBertModel"],["camembert","CamembertModel"],["deberta","DebertaModel"],["deberta-v2","DebertaV2Model"],["mpnet","MPNe\
tModel"],["albert","AlbertModel"],["distilbert","DistilBertModel"],["roberta","RobertaModel"],["xlm","XLMModel"],["xlm-r\
oberta","XLMRobertaModel"],["clap","ClapModel"],["clip","CLIPModel"],["clipseg","CLIPSegModel"],["chinese_clip","Chinese\
CLIPModel"],["siglip","SiglipModel"],["jina_clip","JinaCLIPModel"],["mobilebert","MobileBertModel"],["squeezebert","Sque\
ezeBertModel"],["wav2vec2","Wav2Vec2Model"],["wav2vec2-bert","Wav2Vec2BertModel"],["unispeech","UniSpeechModel"],["unisp\
eech-sat","UniSpeechSatModel"],["hubert","HubertModel"],["wavlm","WavLMModel"],["audio-spectrogram-transformer","ASTMode\
l"],["vits","VitsModel"],["pyannote","PyAnnoteModel"],["wespeaker-resnet","WeSpeakerResNetModel"],["detr","DetrModel"],[
"rt_detr","RTDetrModel"],["rt_detr_v2","RTDetrV2Model"],["rf_detr","RFDetrModel"],["d_fine","DFineModel"],["table-transf\
ormer","TableTransformerModel"],["vit","ViTModel"],["ijepa","IJepaModel"],["pvt","PvtModel"],["vit_msn","ViTMSNModel"],[
"vit_mae","ViTMAEModel"],["groupvit","GroupViTModel"],["fastvit","FastViTModel"],["mobilevit","MobileViTModel"],["mobile\
vitv2","MobileViTV2Model"],["owlvit","OwlViTModel"],["owlv2","Owlv2Model"],["beit","BeitModel"],["deit","DeiTModel"],["h\
iera","HieraModel"],["convnext","ConvNextModel"],["convnextv2","ConvNextV2Model"],["dinov2","Dinov2Model"],["dinov2_with\
_registers","Dinov2WithRegistersModel"],["dinov3_vit","DINOv3ViTModel"],["dinov3_convnext","DINOv3ConvNextModel"],["resn\
et","ResNetModel"],["swin","SwinModel"],["swin2sr","Swin2SRModel"],["donut-swin","DonutSwinModel"],["yolos","YolosModel"],
["dpt","DPTModel"],["glpn","GLPNModel"],["hifigan","SpeechT5HifiGan"],["efficientnet","EfficientNetModel"],["decision_tr\
ansformer","DecisionTransformerModel"],["patchtst","PatchTSTModel"],["patchtsmixer","PatchTSMixerModel"],["mobilenet_v1",
"MobileNetV1Model"],["mobilenet_v2","MobileNetV2Model"],["mobilenet_v3","MobileNetV3Model"],["mobilenet_v4","MobileNetV4\
Model"],["maskformer","MaskFormerModel"],["mgp-str","MgpstrForSceneTextRecognition"],["style_text_to_speech_2","StyleTex\
tToSpeech2Model"],["openai_privacy_filter","OpenAIPrivacyFilterModel"],["embedding_gemma2","EmbeddingGemma2Model"]]),K3=new Map(
[["t5","T5Model"],["longt5","LongT5Model"],["mt5","MT5Model"],["bart","BartModel"],["mbart","MBartModel"],["marian","Mar\
ianModel"],["whisper","WhisperModel"],["cohere_asr","CohereAsrModel"],["m2m_100","M2M100Model"],["blenderbot","Blenderbo\
tModel"],["blenderbot-small","BlenderbotSmallModel"]]),J3=new Map([["mimi","MimiModel"],["dac","DacModel"],["snac","Snac\
Model"]]),Z3=new Map([["bloom","BloomModel"],["jais","JAISModel"],["gpt2","GPT2Model"],["gpt_oss","GptOssModel"],["gptj",
"GPTJModel"],["gpt_bigcode","GPTBigCodeModel"],["gpt_neo","GPTNeoModel"],["gpt_neox","GPTNeoXModel"],["codegen","CodeGen\
Model"],["llama","LlamaModel"],["apertus","ApertusModel"],["nanochat","NanoChatModel"],["arcee","ArceeModel"],["afmoe","\
AfmoeModel"],["lfm2","Lfm2Model"],["lfm2_moe","Lfm2MoeModel"],["lfm3","Lfm3Model"],["smollm3","SmolLM3Model"],["exaone",
"ExaoneModel"],["olmo","OlmoModel"],["olmo2","Olmo2Model"],["olmo3","Olmo3Model"],["olmo_hybrid","OlmoHybridModel"],["mo\
bilellm","MobileLLMModel"],["granite","GraniteModel"],["granitemoehybrid","GraniteMoeHybridModel"],["cohere","CohereMode\
l"],["cohere2","Cohere2Model"],["gemma","GemmaModel"],["gemma2","Gemma2Model"],["vaultgemma","VaultGemmaModel"],["gemma3\
_text","Gemma3Model"],["helium","HeliumModel"],["glm","GlmModel"],["glm_moe_dsa","GlmMoeDsaModel"],["openelm","OpenELMMo\
del"],["qwen2","Qwen2Model"],["qwen2_moe","Qwen2MoeModel"],["qwen3","Qwen3Model"],["qwen3_moe","Qwen3MoeModel"],["qwen3_\
next","Qwen3NextModel"],["phi","PhiModel"],["phi3","Phi3Model"],["mpt","MptModel"],["opt","OPTModel"],["mistral","Mistra\
lModel"],["mistral4","Mistral4Model"],["ministral","MinistralModel"],["ministral3","Ministral3Model"],["ernie4_5","Ernie\
4_5ForCausalLM"],["starcoder2","Starcoder2Model"],["deepseek_v3","DeepseekV3Model"],["deepseek_v4","DeepseekV4Model"],["\
falcon","FalconModel"],["falcon_h1","FalconH1Model"],["nemotron_h","NemotronHModel"],["solar_open","SolarOpenModel"],["s\
tablelm","StableLmModel"],["modernbert-decoder","ModernBertDecoderModel"],["hunyuan_v1_dense","HunYuanDenseV1Model"],["y\
outu","YoutuModel"],["zaya","ZayaModel"],["hrm_text","HrmTextModel"]]),jw=new Map([["speecht5","SpeechT5ForSpeechToText"],
["whisper","WhisperForConditionalGeneration"],["lite-whisper","LiteWhisperForConditionalGeneration"],["moonshine","Moons\
hineForConditionalGeneration"],["cohere_asr","CohereAsrForConditionalGeneration"]]),qw=new Map([["speecht5","SpeechT5For\
TextToSpeech"]]),Ww=new Map([["vits","VitsModel"],["musicgen","MusicgenForConditionalGeneration"],["supertonic","Superto\
nicForConditionalGeneration"]]),Hw=new Map([["bert","BertForSequenceClassification"],["eurobert","EuroBertForSequenceCla\
ssification"],["neobert","NeoBertForSequenceClassification"],["modernbert","ModernBertForSequenceClassification"],["rofo\
rmer","RoFormerForSequenceClassification"],["electra","ElectraForSequenceClassification"],["esm","EsmForSequenceClassifi\
cation"],["convbert","ConvBertForSequenceClassification"],["camembert","CamembertForSequenceClassification"],["deberta",
"DebertaForSequenceClassification"],["deberta-v2","DebertaV2ForSequenceClassification"],["mpnet","MPNetForSequenceClassi\
fication"],["albert","AlbertForSequenceClassification"],["distilbert","DistilBertForSequenceClassification"],["roberta",
"RobertaForSequenceClassification"],["xlm","XLMForSequenceClassification"],["xlm-roberta","XLMRobertaForSequenceClassifi\
cation"],["bart","BartForSequenceClassification"],["mbart","MBartForSequenceClassification"],["mobilebert","MobileBertFo\
rSequenceClassification"],["squeezebert","SqueezeBertForSequenceClassification"]]),Qw=new Map([["bert","BertForTokenClas\
sification"],["eurobert","EuroBertForTokenClassification"],["neobert","NeoBertForTokenClassification"],["modernbert","Mo\
dernBertForTokenClassification"],["roformer","RoFormerForTokenClassification"],["electra","ElectraForTokenClassification"],
["esm","EsmForTokenClassification"],["convbert","ConvBertForTokenClassification"],["camembert","CamembertForTokenClassif\
ication"],["deberta","DebertaForTokenClassification"],["deberta-v2","DebertaV2ForTokenClassification"],["mpnet","MPNetFo\
rTokenClassification"],["distilbert","DistilBertForTokenClassification"],["roberta","RobertaForTokenClassification"],["x\
lm","XLMForTokenClassification"],["xlm-roberta","XLMRobertaForTokenClassification"],["openai_privacy_filter","OpenAIPriv\
acyFilterForTokenClassification"]]),Xw=new Map([["t5","T5ForConditionalGeneration"],["longt5","LongT5ForConditionalGener\
ation"],["mt5","MT5ForConditionalGeneration"],["bart","BartForConditionalGeneration"],["mbart","MBartForConditionalGener\
ation"],["marian","MarianMTModel"],["m2m_100","M2M100ForConditionalGeneration"],["blenderbot","BlenderbotForConditionalG\
eneration"],["blenderbot-small","BlenderbotSmallForConditionalGeneration"]]),Yw=new Map([["bloom","BloomForCausalLM"],["\
gpt2","GPT2LMHeadModel"],["gpt_oss","GptOssForCausalLM"],["jais","JAISLMHeadModel"],["gptj","GPTJForCausalLM"],["gpt_big\
code","GPTBigCodeForCausalLM"],["gpt_neo","GPTNeoForCausalLM"],["gpt_neox","GPTNeoXForCausalLM"],["codegen","CodeGenForC\
ausalLM"],["llama","LlamaForCausalLM"],["nanochat","NanoChatForCausalLM"],["apertus","ApertusForCausalLM"],["llama4_text",
"Llama4ForCausalLM"],["arcee","ArceeForCausalLM"],["afmoe","AfmoeForCausalLM"],["lfm2","Lfm2ForCausalLM"],["lfm2_moe","L\
fm2MoeForCausalLM"],["lfm3","Lfm3ForCausalLM"],["smollm3","SmolLM3ForCausalLM"],["exaone","ExaoneForCausalLM"],["olmo","\
OlmoForCausalLM"],["olmo2","Olmo2ForCausalLM"],["olmo3","Olmo3ForCausalLM"],["olmo_hybrid","OlmoHybridForCausalLM"],["mo\
bilellm","MobileLLMForCausalLM"],["granite","GraniteForCausalLM"],["granitemoehybrid","GraniteMoeHybridForCausalLM"],["c\
ohere","CohereForCausalLM"],["cohere2","Cohere2ForCausalLM"],["gemma","GemmaForCausalLM"],["gemma2","Gemma2ForCausalLM"],
["vaultgemma","VaultGemmaForCausalLM"],["gemma3_text","Gemma3ForCausalLM"],["gemma3","Gemma3ForCausalLM"],["helium","Hel\
iumForCausalLM"],["glm","GlmForCausalLM"],["glm_moe_dsa","GlmMoeDsaForCausalLM"],["openelm","OpenELMForCausalLM"],["qwen\
2","Qwen2ForCausalLM"],["qwen2_moe","Qwen2MoeForCausalLM"],["qwen3","Qwen3ForCausalLM"],["qwen3_moe","Qwen3MoeForCausalL\
M"],["qwen3_next","Qwen3NextForCausalLM"],["qwen2_vl","Qwen2VLForCausalLM"],["qwen2_5_vl","Qwen2_5_VLForCausalLM"],["qwe\
n3_vl","Qwen3VLForCausalLM"],["qwen3_vl_moe","Qwen3VLMoeForCausalLM"],["qwen3_5","Qwen3_5ForCausalLM"],["qwen3_5_text","\
Qwen3_5ForCausalLM"],["qwen3_5_moe","Qwen3_5MoeForCausalLM"],["gemma3n","Gemma3nForCausalLM"],["gemma4","Gemma4ForCausal\
LM"],["phi","PhiForCausalLM"],["phi3","Phi3ForCausalLM"],["mpt","MptForCausalLM"],["opt","OPTForCausalLM"],["mbart","MBa\
rtForCausalLM"],["mistral","MistralForCausalLM"],["mistral4","Mistral4ForCausalLM"],["ministral","MinistralForCausalLM"],
["ministral3","Ministral3ForCausalLM"],["ernie4_5","Ernie4_5ForCausalLM"],["starcoder2","Starcoder2ForCausalLM"],["deeps\
eek_v3","DeepseekV3ForCausalLM"],["deepseek_v4","DeepseekV4ForCausalLM"],["falcon","FalconForCausalLM"],["falcon_h1","Fa\
lconH1ForCausalLM"],["nemotron_h","NemotronHForCausalLM"],["trocr","TrOCRForCausalLM"],["solar_open","SolarOpenForCausal\
LM"],["stablelm","StableLmForCausalLM"],["modernbert-decoder","ModernBertDecoderForCausalLM"],["hunyuan_v1_dense","HunYu\
anDenseV1ForCausalLM"],["youtu","YoutuForCausalLM"],["zaya","ZayaForCausalLM"],["hrm_text","HrmTextForCausalLM"],["phi3_\
v","Phi3VForCausalLM"]]),eD=new Map([["multi_modality","MultiModalityCausalLM"]]),Kw=new Map([["bert","BertForMaskedLM"],
["eurobert","EuroBertForMaskedLM"],["neobert","NeoBertForMaskedLM"],["modernbert","ModernBertForMaskedLM"],["roformer","\
RoFormerForMaskedLM"],["electra","ElectraForMaskedLM"],["esm","EsmForMaskedLM"],["convbert","ConvBertForMaskedLM"],["cam\
embert","CamembertForMaskedLM"],["deberta","DebertaForMaskedLM"],["deberta-v2","DebertaV2ForMaskedLM"],["mpnet","MPNetFo\
rMaskedLM"],["albert","AlbertForMaskedLM"],["distilbert","DistilBertForMaskedLM"],["roberta","RobertaForMaskedLM"],["xlm",
"XLMWithLMHeadModel"],["xlm-roberta","XLMRobertaForMaskedLM"],["mobilebert","MobileBertForMaskedLM"],["squeezebert","Squ\
eezeBertForMaskedLM"]]),Jw=new Map([["bert","BertForQuestionAnswering"],["neobert","NeoBertForQuestionAnswering"],["rofo\
rmer","RoFormerForQuestionAnswering"],["electra","ElectraForQuestionAnswering"],["convbert","ConvBertForQuestionAnswerin\
g"],["camembert","CamembertForQuestionAnswering"],["deberta","DebertaForQuestionAnswering"],["deberta-v2","DebertaV2ForQ\
uestionAnswering"],["mpnet","MPNetForQuestionAnswering"],["albert","AlbertForQuestionAnswering"],["distilbert","DistilBe\
rtForQuestionAnswering"],["roberta","RobertaForQuestionAnswering"],["xlm","XLMForQuestionAnswering"],["xlm-roberta","XLM\
RobertaForQuestionAnswering"],["mobilebert","MobileBertForQuestionAnswering"],["squeezebert","SqueezeBertForQuestionAnsw\
ering"]]),Zw=new Map([["vision-encoder-decoder","VisionEncoderDecoderModel"],["idefics3","Idefics3ForConditionalGenerati\
on"],["smolvlm","SmolVLMForConditionalGeneration"]]),ev=new Map([["llava","LlavaForConditionalGeneration"],["llava_onevi\
sion","LlavaOnevisionForConditionalGeneration"],["moondream1","Moondream1ForConditionalGeneration"],["florence2","Floren\
ce2ForConditionalGeneration"],["qwen2_vl","Qwen2VLForConditionalGeneration"],["qwen2_5_vl","Qwen2_5_VLForConditionalGene\
ration"],["qwen3_vl","Qwen3VLForConditionalGeneration"],["qwen3_vl_moe","Qwen3VLMoeForConditionalGeneration"],["qwen3_5",
"Qwen3_5ForConditionalGeneration"],["qwen3_5_moe","Qwen3_5MoeForConditionalGeneration"],["lfm2_vl","Lfm2VlForConditional\
Generation"],["lfm3_vl","Lfm3VlForConditionalGeneration"],["idefics3","Idefics3ForConditionalGeneration"],["smolvlm","Sm\
olVLMForConditionalGeneration"],["paligemma","PaliGemmaForConditionalGeneration"],["llava_qwen2","LlavaQwen2ForCausalLM"],
["gemma3","Gemma3ForConditionalGeneration"],["gemma3n","Gemma3nForConditionalGeneration"],["gemma4","Gemma4ForConditiona\
lGeneration"],["mistral3","Mistral3ForConditionalGeneration"],["lighton_ocr","LightOnOcrForConditionalGeneration"],["glm\
_ocr","GlmOcrForConditionalGeneration"]]),tv=new Map([["granite_speech","GraniteSpeechForConditionalGeneration"],["ultra\
vox","UltravoxModel"],["voxtral","VoxtralForConditionalGeneration"],["voxtral_realtime","VoxtralRealtimeForConditionalGe\
neration"]]),tD=new Map([["vision-encoder-decoder","VisionEncoderDecoderModel"]]),rv=new Map([["vit","ViTForImageClassif\
ication"],["ijepa","IJepaForImageClassification"],["pvt","PvtForImageClassification"],["vit_msn","ViTMSNForImageClassifi\
cation"],["fastvit","FastViTForImageClassification"],["mobilevit","MobileViTForImageClassification"],["mobilevitv2","Mob\
ileViTV2ForImageClassification"],["beit","BeitForImageClassification"],["deit","DeiTForImageClassification"],["hiera","H\
ieraForImageClassification"],["convnext","ConvNextForImageClassification"],["convnextv2","ConvNextV2ForImageClassificati\
on"],["dinov2","Dinov2ForImageClassification"],["dinov2_with_registers","Dinov2WithRegistersForImageClassification"],["r\
esnet","ResNetForImageClassification"],["swin","SwinForImageClassification"],["segformer","SegformerForImageClassificati\
on"],["efficientnet","EfficientNetForImageClassification"],["mobilenet_v1","MobileNetV1ForImageClassification"],["mobile\
net_v2","MobileNetV2ForImageClassification"],["mobilenet_v3","MobileNetV3ForImageClassification"],["mobilenet_v4","Mobil\
eNetV4ForImageClassification"]]),sv=new Map([["detr","DetrForObjectDetection"],["rt_detr","RTDetrForObjectDetection"],["\
rt_detr_v2","RTDetrV2ForObjectDetection"],["rf_detr","RFDetrForObjectDetection"],["d_fine","DFineForObjectDetection"],["\
table-transformer","TableTransformerForObjectDetection"],["yolos","YolosForObjectDetection"]]),nv=new Map([["owlvit","Ow\
lViTForObjectDetection"],["owlv2","Owlv2ForObjectDetection"],["grounding-dino","GroundingDinoForObjectDetection"]]),gs=new Map(
[["detr","DetrForSegmentation"],["clipseg","CLIPSegForImageSegmentation"]]),av=new Map([["segformer","SegformerForSemant\
icSegmentation"],["sapiens","SapiensForSemanticSegmentation"],["swin","SwinForSemanticSegmentation"],["mobilenet_v1","Mo\
bileNetV1ForSemanticSegmentation"],["mobilenet_v2","MobileNetV2ForSemanticSegmentation"],["mobilenet_v3","MobileNetV3For\
SemanticSegmentation"],["mobilenet_v4","MobileNetV4ForSemanticSegmentation"]]),ov=new Map([["detr","DetrForSegmentation"],
["maskformer","MaskFormerForInstanceSegmentation"]]),iv=new Map([["sam","SamModel"],["sam2","Sam2Model"],["edgetam","Edg\
eTamModel"],["sam3_tracker","Sam3TrackerModel"]]),lv=new Map([["wav2vec2","Wav2Vec2ForCTC"],["wav2vec2-bert","Wav2Vec2Be\
rtForCTC"],["unispeech","UniSpeechForCTC"],["unispeech-sat","UniSpeechSatForCTC"],["wavlm","WavLMForCTC"],["hubert","Hub\
ertForCTC"],["parakeet_ctc","ParakeetForCTC"]]),cv=new Map([["wav2vec2","Wav2Vec2ForSequenceClassification"],["wav2vec2-\
bert","Wav2Vec2BertForSequenceClassification"],["unispeech","UniSpeechForSequenceClassification"],["unispeech-sat","UniS\
peechSatForSequenceClassification"],["wavlm","WavLMForSequenceClassification"],["hubert","HubertForSequenceClassificatio\
n"],["audio-spectrogram-transformer","ASTForAudioClassification"]]),uv=new Map([["wavlm","WavLMForXVector"]]),dv=new Map(
[["unispeech-sat","UniSpeechSatForAudioFrameClassification"],["wavlm","WavLMForAudioFrameClassification"],["wav2vec2","W\
av2Vec2ForAudioFrameClassification"],["pyannote","PyAnnoteForAudioFrameClassification"]]),hv=new Map([["vitmatte","VitMa\
tteForImageMatting"]]),rD=new Map([["patchtst","PatchTSTForPrediction"],["patchtsmixer","PatchTSMixerForPrediction"]]),fv=new Map(
[["swin2sr","Swin2SRForImageSuperResolution"]]),_v=new Map([["chmv2","CHMv2ForDepthEstimation"],["dpt","DPTForDepthEstim\
ation"],["depth_anything","DepthAnythingForDepthEstimation"],["glpn","GLPNForDepthEstimation"],["sapiens","SapiensForDep\
thEstimation"],["depth_pro","DepthProForDepthEstimation"],["metric3d","Metric3DForDepthEstimation"],["metric3dv2","Metri\
c3Dv2ForDepthEstimation"]]),pv=new Map([["sapiens","SapiensForNormalEstimation"]]),mv=new Map([["vitpose","VitPoseForPos\
eEstimation"]]),gv=new Map([["clip","CLIPVisionModelWithProjection"],["siglip","SiglipVisionModel"],["jina_clip","JinaCL\
IPVisionModel"]]),wv=[[Y3,W.EncoderOnly],[K3,W.EncoderDecoder],[Z3,W.DecoderOnlyWithoutHead],[J3,W.AutoEncoder],[Hw,W.EncoderOnly],
[Qw,W.EncoderOnly],[Xw,W.Seq2Seq],[jw,W.Seq2Seq],[Yw,W.DecoderOnly],[eD,W.MultiModality],[Kw,W.EncoderOnly],[Jw,W.EncoderOnly],
[Zw,W.Vision2Seq],[ev,W.ImageTextToText],[tv,W.AudioTextToText],[rv,W.EncoderOnly],[gs,W.EncoderOnly],[ov,W.EncoderOnly],
[av,W.EncoderOnly],[hv,W.EncoderOnly],[rD,W.EncoderOnly],[fv,W.EncoderOnly],[_v,W.EncoderOnly],[pv,W.EncoderOnly],[mv,W.
EncoderOnly],[sv,W.EncoderOnly],[nv,W.EncoderOnly],[iv,W.MaskGeneration],[lv,W.EncoderOnly],[cv,W.EncoderOnly],[qw,W.Seq2Seq],
[Ww,W.EncoderOnly],[uv,W.EncoderOnly],[dv,W.EncoderOnly],[gv,W.EncoderOnly]];for(const[e,t]of wv)for(const r of e.values()){
cr.set(r,t);const s=Sl[r];bs.set(s,r),El.set(r,s)}var sD=[["MusicgenForConditionalGeneration",hw,W.Musicgen],["Phi3VForC\
ausalLM",mw,W.Phi3V],["CLIPTextModelWithProjection",Sg,W.EncoderOnly],["SiglipTextModel",Tw,W.EncoderOnly],["JinaCLIPTex\
tModel",tw,W.EncoderOnly],["ClapTextModelWithProjection",Ag,W.EncoderOnly],["ClapAudioModelWithProjection",Cg,W.EncoderOnly],
["DacEncoderModel",Ig,W.EncoderOnly],["DacDecoderModel",Lg,W.EncoderOnly],["MimiEncoderModel",cw,W.EncoderOnly],["MimiDe\
coderModel",uw,W.EncoderOnly],["SnacEncoderModel",Ew,W.EncoderOnly],["SnacDecoderModel",Aw,W.EncoderOnly],["Gemma3nForCo\
nditionalGeneration",$a,W.ImageAudioTextToText],["Gemma4ForConditionalGeneration",lc,W.ImageAudioTextToText],["Supertoni\
cForConditionalGeneration",Pw,W.Supertonic],["ChatterboxModel",kg,W.Chatterbox],["EmbeddingGemma2Model",Vg,W.MultimodalEncoder],
["VoxtralRealtimeForConditionalGeneration",Rw,W.VoxtralRealtime]];for(const[e,t,r]of sD)cr.set(e,r),bs.set(t,e),El.set(e,
t);var vv=new Map([["modnet",gs],["birefnet",gs],["isnet",gs],["ben",gs]]);for(const[e,t]of vv.entries())t.set(e,"PreTra\
inedModel"),cr.set(e,W.EncoderOnly),El.set(e,F);var nD=new Set(vv.keys());cr.set("PreTrainedModel",W.EncoderOnly);bs.set(
F,"PreTrainedModel");var Se={MODEL_FOR_SEQUENCE_CLASSIFICATION_MAPPING_NAMES:Hw,MODEL_FOR_TOKEN_CLASSIFICATION_MAPPING_NAMES:Qw,
MODEL_FOR_TEXT_TO_SPECTROGRAM_MAPPING_NAMES:qw,MODEL_FOR_TEXT_TO_WAVEFORM_MAPPING_NAMES:Ww,MODEL_FOR_MASKED_LM_MAPPING_NAMES:Kw,
MODEL_FOR_QUESTION_ANSWERING_MAPPING_NAMES:Jw,MODEL_FOR_IMAGE_CLASSIFICATION_MAPPING_NAMES:rv,MODEL_FOR_IMAGE_SEGMENTATION_MAPPING_NAMES:gs,
MODEL_FOR_SEMANTIC_SEGMENTATION_MAPPING_NAMES:av,MODEL_FOR_UNIVERSAL_SEGMENTATION_MAPPING_NAMES:ov,MODEL_FOR_OBJECT_DETECTION_MAPPING_NAMES:sv,
MODEL_FOR_ZERO_SHOT_OBJECT_DETECTION_MAPPING_NAMES:nv,MODEL_FOR_MASK_GENERATION_MAPPING_NAMES:iv,MODEL_FOR_CTC_MAPPING_NAMES:lv,
MODEL_FOR_AUDIO_CLASSIFICATION_MAPPING_NAMES:cv,MODEL_FOR_AUDIO_XVECTOR_MAPPING_NAMES:uv,MODEL_FOR_AUDIO_FRAME_CLASSIFICATION_MAPPING_NAMES:dv,
MODEL_FOR_DOCUMENT_QUESTION_ANSWERING_MAPPING_NAMES:tD,MODEL_FOR_IMAGE_MATTING_MAPPING_NAMES:hv,MODEL_FOR_IMAGE_TO_IMAGE_MAPPING_NAMES:fv,
MODEL_FOR_DEPTH_ESTIMATION_MAPPING_NAMES:_v,MODEL_FOR_NORMAL_ESTIMATION_MAPPING_NAMES:pv,MODEL_FOR_POSE_ESTIMATION_MAPPING_NAMES:mv,
MODEL_FOR_IMAGE_FEATURE_EXTRACTION_MAPPING_NAMES:gv,MODEL_FOR_IMAGE_TEXT_TO_TEXT_MAPPING_NAMES:ev,MODEL_FOR_AUDIO_TEXT_TO_TEXT_MAPPING_NAMES:tv,
MODEL_FOR_SEQ_TO_SEQ_CAUSAL_LM_MAPPING_NAMES:Xw,MODEL_FOR_SPEECH_SEQ_2_SEQ_MAPPING_NAMES:jw,MODEL_FOR_CAUSAL_LM_MAPPING_NAMES:Yw,
MODEL_FOR_VISION_2_SEQ_MAPPING_NAMES:Zw};WC(Se);var Pe=class{static MODEL_CLASS_MAPPINGS=null;static BASE_IF_FAIL=!1;static supports(e){
if(!this.MODEL_CLASS_MAPPINGS)return!1;for(const t of this.MODEL_CLASS_MAPPINGS)if(t.has(e))return!0;return this.BASE_IF_FAIL}static async from_pretrained(e,{
progress_callback:t=null,config:r=null,cache_dir:s=null,local_files_only:n=!1,revision:a="main",model_file_name:o=null,subfolder:i="\
onnx",device:l=null,dtype:c=null,use_external_data_format:d=null,session_options:h={}}={}){const _={progress_callback:t,
config:r,cache_dir:s,local_files_only:n,revision:a,model_file_name:o,subfolder:i,device:l,dtype:c,use_external_data_format:d,
session_options:h};if(_.config=await un.from_pretrained(e,_),!this.MODEL_CLASS_MAPPINGS)throw new Error("`MODEL_CLASS_MA\
PPINGS` not implemented for this type of `AutoClass`: "+this.name);const{model_type:p}=_.config;for(const w of this.MODEL_CLASS_MAPPINGS){
let v=w.get(p);if(!v){for(const y of w.values())if(y[0]===p){v=y;break}if(!v)continue}return await Sl[v].from_pretrained(
e,_)}if(this.BASE_IF_FAIL)return nD.has(p)||de.warn(`Unknown model class "${p}", attempting to construct from base class\
.`),await F.from_pretrained(e,_);throw Error(`Unsupported model type: ${p}`)}},tn=class extends Pe{static MODEL_CLASS_MAPPINGS=wv.
map(e=>e[0]);static BASE_IF_FAIL=!0},P_=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_SEQUENCE_CLASSIFICATION_MAPPING_NAMES]},
aD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_TOKEN_CLASSIFICATION_MAPPING_NAMES]},hi=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_SEQ_TO_SEQ_CAUSAL_LM_MAPPING_NAMES]},oD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_SPEECH_SEQ_2_SEQ_MAPPING_NAMES]},
iD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_TEXT_TO_SPECTROGRAM_MAPPING_NAMES]},lD=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_TEXT_TO_WAVEFORM_MAPPING_NAMES]},cD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_CAUSAL_LM_MAPPING_NAMES]},
uD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_MASKED_LM_MAPPING_NAMES]},dD=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_QUESTION_ANSWERING_MAPPING_NAMES]},hD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_VISION_2_SEQ_MAPPING_NAMES]},
fD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_IMAGE_CLASSIFICATION_MAPPING_NAMES]},F_=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_IMAGE_SEGMENTATION_MAPPING_NAMES]},I_=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_SEMANTIC_SEGMENTATION_MAPPING_NAMES]},
L_=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_UNIVERSAL_SEGMENTATION_MAPPING_NAMES]},_D=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_OBJECT_DETECTION_MAPPING_NAMES]},pD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_ZERO_SHOT_OBJECT_DETECTION_MAPPING_NAMES]},
_z=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_MASK_GENERATION_MAPPING_NAMES]},mD=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_CTC_MAPPING_NAMES]},gD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_AUDIO_CLASSIFICATION_MAPPING_NAMES]},
pz=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_AUDIO_XVECTOR_MAPPING_NAMES]},mz=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_AUDIO_FRAME_CLASSIFICATION_MAPPING_NAMES]},wD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_DOCUMENT_QUESTION_ANSWERING_MAPPING_NAMES]},
gz=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_IMAGE_MATTING_MAPPING_NAMES]},vD=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_IMAGE_TO_IMAGE_MAPPING_NAMES]},yD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_DEPTH_ESTIMATION_MAPPING_NAMES]},
wz=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_NORMAL_ESTIMATION_MAPPING_NAMES]},vz=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_POSE_ESTIMATION_MAPPING_NAMES]},bD=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_IMAGE_FEATURE_EXTRACTION_MAPPING_NAMES]},
yz=class extends Pe{static MODEL_CLASS_MAPPINGS=[Se.MODEL_FOR_IMAGE_TEXT_TO_TEXT_MAPPING_NAMES]},bz=class extends Pe{static MODEL_CLASS_MAPPINGS=[
Se.MODEL_FOR_AUDIO_TEXT_TO_TEXT_MAPPING_NAMES]};async function qt(e){return Array.isArray(e)||(e=[e]),await Promise.all(
e.map(t=>Mt.read(t)))}async function ws(e,t){return Array.isArray(e)||(e=[e]),await Promise.all(e.map(r=>typeof r=="stri\
ng"||r instanceof URL?r2(r,t):r instanceof Float64Array?new Float32Array(r):r))}function Fi(e,t){t&&(e=e.map(o=>o|0));const[
r,s,n,a]=e;return{xmin:r,ymin:s,xmax:n,ymax:a}}var je=class extends ft{constructor({task:e,model:t,tokenizer:r=null,processor:s=null}){
super(),this.task=e,this.model=t,this.tokenizer=r,this.processor=s}async dispose(){await this.model.dispose()}},MD=class extends je{async _call(e,{
top_k:t=1}={}){const r=this.tokenizer(e,{padding:!0,truncation:!0}),s=await this.model(r),{problem_type:n,id2label:a}=this.
model.config,o=n==="multi_label_classification"?l=>l.sigmoid():l=>new G("float32",st(l.data),l.dims),i=[];for(const l of s.
logits){const c=o(l),d=await As(c,t),h=d[0].tolist(),p=d[1].tolist().map((w,v)=>({label:a?a[w]:`LABEL_${w}`,score:h[v]}));
t===1?i.push(...p):i.push(p)}return Array.isArray(e)||t===1?i:i[0]}},xD=class extends je{async _call(e,{ignore_labels:t=[
"O"],aggregation_strategy:r="none"}={}){if(r!=="none"&&r!=="simple")throw new Error(`Invalid aggregation_strategy: "${r}\
". Must be one of "none" or "simple".`);const s=Array.isArray(e),n=this.tokenizer(s?e:[e],{padding:!0,truncation:!0}),o=(await this.
model(n)).logits,i=this.model.config.id2label,l=[];for(let c=0;c<o.dims[0];++c){const d=n.input_ids[c].tolist(),h=o[c],_=[];
for(let p=0;p<h.dims[0];++p){const w=h[p],v=We(w.data)[1],y=i?i[v]:`LABEL_${v}`;if(t.includes(y))continue;const b=this.tokenizer.
decode([d[p]],{skip_special_tokens:!0});if(b==="")continue;const k=st(w.data);_.push({entity:y,score:k[v],index:p,word:b})}
l.push(r==="simple"?TD(_,d,this.tokenizer):_)}return s?l:l[0]}};function kD(e){const t=e[0];return e[1]==="-"&&(t==="B"||
t==="I"||t==="E"||t==="S")?[t,e.slice(2)]:["I",e]}function TD(e,t,r){const s=[];let n=null;for(let a=0;a<e.length;++a){const[
o,i]=kD(e[a].entity);n===i&&o!=="B"&&o!=="S"?(s[s.length-1].end=a+1,o==="E"&&(n=null)):(s.push({tag:i,start:a,end:a+1}),
n=o==="S"?null:i)}return s.map(({tag:a,start:o,end:i})=>{let l=0;const c=[];for(let d=o;d<i;++d)l+=e[d].score,c.push(t[e[d].
index]);return{entity_group:a,score:l/(i-o),word:r.decode(c,{skip_special_tokens:!0})}})}var ED=class extends je{async _call(e,t,{
top_k:r=1}={}){const s=this.tokenizer(e,{text_pair:t,padding:!0,truncation:!0}),n=Array.isArray(e),{start_logits:a,end_logits:o}=await this.
model(s),i=s.input_ids.tolist(),l=s.attention_mask.tolist(),{all_special_ids:c,sep_token_id:d}=this.tokenizer,h=[];for(let _=0;_<
a.dims[0];++_){const p=i[_],w=p.findIndex(C=>C==d),v=a[_].tolist(),y=o[_].tolist();for(let C=1;C<v.length;++C)(l[_]==0||
C<=w||c.findIndex(N=>N==p[C])!==-1)&&(v[C]=-1/0,y[C]=-1/0);const b=st(v).map((C,N)=>[C,N]),k=st(y).map((C,N)=>[C,N]);b[0][0]=
0,k[0][0]=0;const A=BM(b,k).filter(C=>C[0][1]<=C[1][1]).map(C=>[C[0][1],C[1][1],C[0][0]*C[1][0]]).sort((C,N)=>N[2]-C[2]),
E=[];for(let C=0;C<Math.min(A.length,r);++C){const[N,M,$]=A[C],R=p.slice(N,M+1),j=this.tokenizer.decode(R,{skip_special_tokens:!0});
E.push({answer:j,score:$})}r===1?h.push(...E):h.push(E)}return n?h:h[0]}},AD=class extends je{async _call(e,{top_k:t=5}={}){
const{mask_token_id:r,mask_token:s}=this.tokenizer,n=this.tokenizer(e,{padding:!0,truncation:!0}),{logits:a}=await this.
model(n),o=[],i=n.input_ids.tolist();for(let l=0;l<i.length;++l){const c=i[l],d=c.findIndex(v=>v==r);if(d===-1)throw Error(
`Mask token (${s}) not found in text.`);const h=a[l][d],_=await As(new G("float32",st(h.data),h.dims),t),p=_[0].tolist(),
w=_[1].tolist();o.push(w.map((v,y)=>{const b=c.slice();return b[d]=v,{score:p[y],token:Number(v),token_str:this.tokenizer.
decode([v]),sequence:this.tokenizer.decode(b,{skip_special_tokens:!0})}}))}return Array.isArray(e)?o:o[0]}},Bu=class extends je{_default_generation_config={
max_new_tokens:256};_key="generated_text";async _call(e,t={}){Array.isArray(e)||(e=[e]),this.model.config.prefix&&(e=e.map(
i=>this.model.config.prefix+i));const r=this.model.config.task_specific_params;r&&r[this.task]&&r[this.task].prefix&&(e=
e.map(i=>r[this.task].prefix+i));const s=this.tokenizer,n={padding:!0,truncation:!0};let a;this.task==="translation"&&"_\
build_translation_inputs"in s?a=s._build_translation_inputs(e,n,t):a=s(e,n);const o=await this.model.generate({...a,...this.
_default_generation_config,...t});return s.batch_decode(o,{skip_special_tokens:!0}).map(i=>({[this._key]:i}))}},CD=class extends Bu{_key="\
summary_text"},SD=class extends Bu{_key="translation_text"};function O_(e){return Array.isArray(e)&&e.every(t=>"role"in t&&
"content"in t)}var PD=class extends je{_default_generation_config={max_new_tokens:256};async _call(e,t={}){const{add_special_tokens:r,
return_full_text:s,tools:n,documents:a,chat_template:o,tokenizer_encode_kwargs:i,...l}=t;let c=!1,d=!1,h=r??(this.tokenizer.
add_bos_token||this.tokenizer.add_eos_token)??!1,_=i,p;if(typeof e=="string")p=e=[e];else if(Array.isArray(e)&&e.every(E=>typeof E==
"string"))c=!0,p=e;else{if(O_(e))e=[e];else if(Array.isArray(e)&&e.every(O_))c=!0;else throw new Error("Input must be a \
string, an array of strings, a Chat, or an array of Chats");d=!0;const E={tokenize:!1,add_generation_prompt:!0,...Ze({tools:n,
documents:a,chat_template:o},["tools","documents","chat_template"]),..._};p=e.map(C=>this.tokenizer.apply_chat_template(
C,E)),h=!1,_=void 0}const w=d?!1:s??!0;this.tokenizer.padding_side="left";const v=this.tokenizer(p,{add_special_tokens:h,
padding:!0,truncation:!0,..._}),y=await this.model.generate({...v,...this._default_generation_config,...l}),b=this.tokenizer.
batch_decode(y,{skip_special_tokens:!0});let k;!w&&v.input_ids.dims.at(-1)>0&&(k=this.tokenizer.batch_decode(v.input_ids,
{skip_special_tokens:!0}).map(E=>E.length));const A=Array.from({length:e.length},E=>[]);for(let E=0;E<b.length;++E){const C=Math.
floor(E/y.dims[0]*e.length);k&&(b[E]=b[E].slice(k[C])),A[C].push({generated_text:d?[...e[C],{role:"assistant",content:b[E]}]:
b[E]})}return!c&&A.length===1?A[0]:A}},FD=class extends je{constructor(e){super(e),this.label2id=Object.fromEntries(Object.
entries(this.model.config.label2id).map(([t,r])=>[t.toLowerCase(),r])),this.entailment_id=this.label2id.entailment,this.
entailment_id===void 0&&(de.warn("Could not find 'entailment' in label2id mapping. Using 2 as entailment_id."),this.entailment_id=
2),this.contradiction_id=this.label2id.contradiction??this.label2id.not_entailment,this.contradiction_id===void 0&&(de.warn(
"Could not find 'contradiction' in label2id mapping. Using 0 as contradiction_id."),this.contradiction_id=0)}async _call(e,t,{
hypothesis_template:r="This example is {}.",multi_label:s=!1}={}){const n=Array.isArray(e);n||(e=[e]),Array.isArray(t)||
(t=[t]);const a=t.map(l=>r.replace("{}",l)),o=s||t.length===1,i=[];for(const l of e){const c=[];for(const _ of a){const p=this.
tokenizer(l,{text_pair:_,padding:!0,truncation:!0}),w=await this.model(p);o?c.push([w.logits.data[this.contradiction_id],
w.logits.data[this.entailment_id]]):c.push(w.logits.data[this.entailment_id])}const h=(o?c.map(_=>st(_)[1]):st(c)).map((_,p)=>[
_,p]).sort((_,p)=>p[0]-_[0]);i.push({sequence:l,labels:h.map(_=>t[_[1]]),scores:h.map(_=>_[0])})}return n?i:i[0]}},ID=class extends je{async _call(e,{
top_k:t=5}={}){const r=this.processor.feature_extractor.config.sampling_rate,s=await ws(e,r),n=this.model.config.id2label,
a=[];for(const o of s){const i=await this.processor(o),c=(await this.model(i)).logits[0],d=await As(new G("float32",st(c.
data),c.dims),t),h=d[0].tolist(),p=d[1].tolist().map((w,v)=>({label:n?n[w]:`LABEL_${w}`,score:h[v]}));a.push(p)}return Array.
isArray(e)?a:a[0]}},LD=class extends je{async _call(e,t,{hypothesis_template:r="This is a sound of {}."}={}){const s=!Array.
isArray(e);s&&(e=[e]);const n=t.map(c=>r.replace("{}",c)),a=this.tokenizer(n,{padding:!0,truncation:!0}),o=this.processor.
feature_extractor.config.sampling_rate,i=await ws(e,o),l=[];for(const c of i){const d=await this.processor(c),h=await this.
model({...a,...d}),_=st(h.logits_per_audio.data);l.push([..._].map((p,w)=>({score:p,label:t[w]})))}return s?l[0]:l}},OD=class extends je{_default_generation_config={};async _call(e,t={}){
switch(t={...this._default_generation_config,...t},this.model.config.model_type){case"whisper":case"lite-whisper":return this.
_call_whisper(e,t);case"wav2vec2":case"wav2vec2-bert":case"unispeech":case"unispeech-sat":case"hubert":case"parakeet_ctc":
return this._call_wav2vec2(e,t);case"moonshine":return this._call_moonshine(e,t);case"cohere_asr":return this._call_cohere_asr(
e,t);default:throw new Error(`AutomaticSpeechRecognitionPipeline does not support model type '${this.model.config.model_type}\
'.`)}}async _call_wav2vec2(e,t){t.language&&de.warn('`language` parameter is not yet supported for `wav2vec2` models, de\
faulting to "English".'),t.task&&de.warn('`task` parameter is not yet supported for `wav2vec2` models, defaulting to "tr\
anscribe".');const r=!Array.isArray(e),s=r?[e]:e,n=this.processor.feature_extractor.config.sampling_rate,a=await ws(s,n),
o=[];for(const i of a){const l=await this.processor(i),d=(await this.model(l)).logits[0],h=[];for(const p of d)h.push(We(
p.data)[1]);const _=this.tokenizer.decode(h,{skip_special_tokens:!0}).trim();o.push({text:_})}return r?o[0]:o}async _call_whisper(e,t){
const r=t.return_timestamps??!1,s=t.chunk_length_s??0,n=t.force_full_sequences??!1;let a=t.stride_length_s??null;const o={
...t};r==="word"&&(o.return_token_timestamps=!0,o.return_timestamps=!0);const i=!Array.isArray(e),l=i?[e]:e,c=this.processor.
feature_extractor.config,d=c.chunk_length/this.model.config.max_source_positions,h=c.hop_length,_=c.sampling_rate,p=await ws(
l,_),w=[];for(const v of p){let y=[];if(s>0){if(a===null)a=s/6;else if(s<=a)throw Error("`chunk_length_s` must be larger\
 than `stride_length_s`.");const A=_*s,E=_*a,C=A-2*E;let N=0;for(;;){const M=N+A,$=v.subarray(N,M),R=await this.processor(
$),j=N===0,Y=M>=v.length;if(y.push({stride:[$.length,j?0:E,Y?0:E],input_features:R.input_features,is_last:Y}),Y)break;N+=
C}}else y=[{stride:[v.length,0,0],input_features:(await this.processor(v)).input_features,is_last:!0}];for(const A of y){
o.num_frames=Math.floor(A.stride[0]/h);const E=await this.model.generate({inputs:A.input_features,...o});if(r==="word"){
const C=E.sequences.tolist()[0],N=E.token_timestamps.tolist()[0],M=this.tokenizer.timestamp_begin,$=Math.max(C.findIndex(
R=>Number(R)>=M),0);A.tokens=C.slice($),A.token_timestamps=N.slice($).map(R=>en(R,2))}else A.tokens=E[0].tolist();A.stride=
A.stride.map(C=>C/_)}const[b,k]=this.tokenizer._decode_asr(y,{time_precision:d,return_timestamps:r,force_full_sequences:n});
w.push({text:b,...k})}return i?w[0]:w}async _call_moonshine(e,t){const r=!Array.isArray(e),s=r?[e]:e,n=this.processor.feature_extractor.
config.sampling_rate,a=await ws(s,n),o=[];for(const i of a){const l=await this.processor(i),c=Math.floor(i.length/n)*6,d=await this.
model.generate({max_new_tokens:c,...t,...l}),h=this.tokenizer.batch_decode(d,{skip_special_tokens:!0})[0];o.push({text:h})}
return r?o[0]:o}async _call_cohere_asr(e,t){const r=!Array.isArray(e),s=r?[e]:e,n=this.processor.feature_extractor,a=n.config.
sampling_rate,o=await ws(s,a),i=t.language??"en",l=this.processor.get_decoder_prompt_ids(i),c=[];for(const d of o){const h=n.
split_audio(d),_=[];for(const w of h){const v=await this.processor(w),y=await this.model.generate({...v,decoder_input_ids:l,
...t}),b=this.tokenizer.decode(y[0].tolist(),{skip_special_tokens:!0}).trim();_.push(b)}const p=this.processor.constructor.
join_chunks(_,i);c.push({text:p})}return r?c[0]:c}},ND=class extends je{DEFAULT_VOCODER_ID="Xenova/speecht5_hifigan";constructor(e){
super(e),this.vocoder=e.vocoder??null}async _prepare_speaker_embeddings(e,t){if((typeof e=="string"||e instanceof URL)&&
(e=new Float32Array(await(await we.fetch(e)).arrayBuffer())),e instanceof Float32Array)e=new G("float32",e,[e.length]);else if(!(e instanceof
G))throw new Error("Speaker embeddings must be a `Tensor`, `Float32Array`, `string`, or `URL`.");if(t>1){if(e.dims[0]===
1)e=e.repeat(t,1);else if(e.dims[0]!==t)throw new Error(`Expected speaker embeddings batch size to be 1 or ${t}, but got\
 ${e.dims[0]}.`)}return e}_postprocess_waveform(e,t,r,s=null){const n=t.data,[a,o]=t.dims,i=s?s.data:null,l=[];for(let c=0;c<
a;++c){const d=i?Math.min(Math.ceil(i[c]),o):o,h=c*o;l.push(new h2(n.slice(h,h+d),r))}return Array.isArray(e)?l:l[0]}async _call(e,t){
return this.processor?this._call_text_to_spectrogram(e,t):this.model.config.model_type==="supertonic"?this._call_supertonic(
e,t):this._call_text_to_waveform(e)}async _call_supertonic(e,{speaker_embeddings:t,num_inference_steps:r,speed:s}){if(!t)
throw new Error("Speaker embeddings must be provided for Supertonic models.");const{sampling_rate:n,style_dim:a}=this.model.
config,o=this.tokenizer(e,{padding:!0,truncation:!0}),i=o.input_ids.dims[0];t=await this._prepare_speaker_embeddings(t,i),
t=t.view(i,-1,a);const{waveform:l,durations:c}=await this.model.generate_speech({...o,style:t,num_inference_steps:r,speed:s});
return this._postprocess_waveform(e,l,n,c)}async _call_text_to_waveform(e){const t=this.tokenizer(e,{padding:!0,truncation:!0}),
{waveform:r}=await this.model(t),s=this.model.config.sampling_rate;return this._postprocess_waveform(e,r,s)}async _call_text_to_spectrogram(e,{
speaker_embeddings:t}){this.vocoder||(de.info("No vocoder specified, using default HifiGan vocoder."),this.vocoder=await tn.
from_pretrained(this.DEFAULT_VOCODER_ID,{dtype:"fp32"}));const{input_ids:r}=this.tokenizer(e,{padding:!0,truncation:!0}),
s=r.dims[0];t=await this._prepare_speaker_embeddings(t,s),t=t.view(s,-1);const{waveform:n}=await this.model.generate_speech(
r,t,{vocoder:this.vocoder}),a=this.processor.feature_extractor.config.sampling_rate;return this._postprocess_waveform(e,
n,a)}},DD=class extends je{async _call(e,t={}){const r=Array.isArray(e),s=await qt(e),{pixel_values:n}=await this.processor(
s),a=[];for(const o of n){o.dims=[1,...o.dims];const i=await this.model.generate({inputs:o,...t}),l=this.tokenizer.batch_decode(
i,{skip_special_tokens:!0}).map(c=>({generated_text:c.trim()}));a.push(l)}return r?a:a[0]}},zD=class extends je{async _call(e,{
top_k:t=5}={}){const r=await qt(e),{pixel_values:s}=await this.processor(r),n=await this.model({pixel_values:s}),{id2label:a}=this.
model.config,o=[];for(const i of n.logits){const l=await As(new G("float32",st(i.data),i.dims),t),c=l[0].tolist(),h=l[1].
tolist().map((_,p)=>({label:a?a[_]:`LABEL_${_}`,score:c[p]}));o.push(h)}return Array.isArray(e)?o:o[0]}},N_={panoptic:"p\
ost_process_panoptic_segmentation",instance:"post_process_instance_segmentation",semantic:"post_process_semantic_segment\
ation"},yv=class extends je{async _call(e,{threshold:t=.5,mask_threshold:r=.5,overlap_mask_area_threshold:s=.8,label_ids_to_fuse:n=null,
target_sizes:a=null,subtask:o=null}={}){if(Array.isArray(e)&&e.length!==1)throw Error("Image segmentation pipeline curre\
ntly only supports a batch size of 1.");const l=await qt(e),c=l.map(b=>[b.height,b.width]),d=await this.processor(l),{inputNames:h,
outputNames:_}=this.model.sessions.model;if(!h.includes("pixel_values")){if(h.length!==1)throw Error(`Expected a single \
input name, but got ${h.length} inputs: ${h}.`);const b=h[0];if(b in d)throw Error(`Input name ${b} already exists in th\
e inputs.`);d[b]=d.pixel_values}const p=await this.model(d);let w=null;if(o!==null)w=N_[o];else if(this.processor.image_processor){
for(const[b,k]of Object.entries(N_))if(k in this.processor.image_processor){w=this.processor.image_processor[k].bind(this.
processor.image_processor),o=b;break}}const v=this.model.config.id2label,y=[];if(o)if(o==="panoptic"||o==="instance"){const b=w(
p,t,r,s,n,a??c)[0],k=b.segmentation;for(const A of b.segments_info){const E=new Uint8ClampedArray(k.data.length);for(let N=0;N<
k.data.length;++N)k.data[N]===A.id&&(E[N]=255);const C=new Mt(E,k.dims[1],k.dims[0],1);y.push({score:A.score,label:v[A.label_id],
mask:C})}}else if(o==="semantic"){const{segmentation:b,labels:k}=w(p,a??c)[0];for(const A of k){const E=new Uint8ClampedArray(
b.data.length);for(let N=0;N<b.data.length;++N)b.data[N]===A&&(E[N]=255);const C=new Mt(E,b.dims[1],b.dims[0],1);y.push(
{score:null,label:v[A],mask:C})}}else throw Error(`Subtask ${o} not supported.`);else{const k=p[_[0]];for(let A=0;A<c.length;++A){
const E=c[A],C=k[A];C.data.some(M=>M<-1e-5||M>1+1e-5)&&C.sigmoid_();const N=await Mt.fromTensor(C.mul_(255).to("uint8")).
resize(E[1],E[0]);y.push({label:null,score:null,mask:N})}}return y}},BD=class extends yv{async _call(e,t={}){const r=await qt(
e),s=await super._call(e,t),n=r.map((a,o)=>{const i=a.clone();return i.putAlpha(s[o].mask),i});return Array.isArray(e)?n:
n[0]}},RD=class extends je{async _call(e,t,{hypothesis_template:r="This is a photo of {}"}={}){const s=Array.isArray(e),
n=await qt(e),a=t.map(h=>r.replace("{}",h)),o=this.tokenizer(a,{padding:this.model.config.model_type==="siglip"?"max_len\
gth":!0,truncation:!0}),{pixel_values:i}=await this.processor(n),l=await this.model({...o,pixel_values:i}),c=this.model.
config.model_type==="siglip"?h=>h.sigmoid().data:h=>st(h.data),d=[];for(const h of l.logits_per_image){const p=[...c(h)].
map((w,v)=>({score:w,label:t[v]}));p.sort((w,v)=>v.score-w.score),d.push(p)}return s?d:d[0]}},$D=class extends je{async _call(e,{
threshold:t=.9,percentage:r=!1}={}){const s=Array.isArray(e);if(s&&e.length!==1)throw Error("Object detection pipeline c\
urrently only supports a batch size of 1.");const n=await qt(e),a=r?null:n.map(_=>[_.height,_.width]),{pixel_values:o,pixel_mask:i}=await this.
processor(n),l=await this.model({pixel_values:o,pixel_mask:i}),c=this.processor.image_processor.post_process_object_detection(
l,t,a),{id2label:d}=this.model.config,h=c.map(_=>_.boxes.map((p,w)=>({score:_.scores[w],label:d[_.classes[w]],box:Fi(p,!r)})));
return s?h:h[0]}},GD=class extends je{async _call(e,t,{threshold:r=.1,top_k:s=null,percentage:n=!1}={}){const a=Array.isArray(
e),o=await qt(e),i=this.tokenizer(t,{padding:!0,truncation:!0}),l=await this.processor(o),c=[];for(let d=0;d<o.length;++d){
const h=o[d],_=n?null:[[h.height,h.width]],p=l.pixel_values[d].unsqueeze_(0),w=await this.model({...i,pixel_values:p});let v;
if("post_process_grounded_object_detection"in this.processor){const y=this.processor.post_process_grounded_object_detection(
w,i.input_ids,{box_threshold:r,text_threshold:r,target_sizes:_})[0];v=y.boxes.map((b,k)=>({score:y.scores[k],label:y.labels[k],
box:Fi(b,!n)}))}else{const y=this.processor.image_processor.post_process_object_detection(w,r,_,!0)[0];v=y.boxes.map((b,k)=>({
score:y.scores[k],label:t[y.classes[k]],box:Fi(b,!n)}))}v.sort((y,b)=>b.score-y.score),s!==null&&(v=v.slice(0,s)),c.push(
v)}return a?c:c[0]}},VD=class extends je{_default_generation_config={max_new_tokens:256};async _call(e,t,r={}){if(Array.
isArray(e)){if(e.length!==1)throw Error("Document Question Answering pipeline currently only supports a batch size of 1.");
e=e[0]}const s=(await qt(e))[0],{pixel_values:n}=await this.processor(s),a=`<s_docvqa><s_question>${t}</s_question><s_an\
swer>`,o=this.tokenizer(a,{add_special_tokens:!1,padding:!0,truncation:!0}).input_ids,i=await this.model.generate({inputs:n,
max_length:this.model.config.decoder.max_position_embeddings,decoder_input_ids:o,...this._default_generation_config,...r}),
c=this.tokenizer.batch_decode(i)[0].match(/<s_answer>(.*?)<\/s_answer>/);let d=null;return c&&c.length>=2&&(d=c[1].trim()),
[{answer:d}]}},UD=class extends je{async _call(e){const t=await qt(e),r=await this.processor(t),s=await this.model(r),n=[];
for(const a of s.reconstruction){const o=a.squeeze().clamp_(0,1).mul_(255).round_().to("uint8");n.push(Mt.fromTensor(o))}
return Array.isArray(e)?n:n[0]}},jD=class extends je{async _call(e){const t=await qt(e),r=await this.processor(t),{predicted_depth:s}=await this.
model(r),n=[];for(let a=0;a<t.length;++a){const o=s[a],[i,l]=o.dims.slice(-2),[c,d]=t[a].size,h=(await Rt(o.view(1,1,i,l),
{size:[d,c],mode:"bilinear"})).view(d,c),_=h.min().item(),p=h.max().item(),w=h.sub(_).div_(p-_).mul_(255).to("uint8").unsqueeze(
0),v=Mt.fromTensor(w);n.push({predicted_depth:h,depth:v})}return Array.isArray(e)?n:n[0]}},qD=class extends je{async _call(e,{
pooling:t="none",normalize:r=!1,quantize:s=!1,precision:n="binary"}={}){const a=this.tokenizer(e,{padding:!0,truncation:!0}),
o=await this.model(a);let i=o.last_hidden_state??o.logits??o.token_embeddings;switch(t){case"none":break;case"mean":i=KT(
i,a.attention_mask);break;case"first_token":case"cls":i=i.slice(null,0);break;case"last_token":case"eos":i=i.slice(null,
-1);break;default:throw Error(`Pooling method '${t}' not supported.`)}return r&&(i=i.normalize(2,-1)),s&&(i=ZT(i,n)),i}},
WD=class extends je{async _call(e,{pool:t=null}={}){const r=await qt(e),{pixel_values:s}=await this.processor(r),n=await this.
model({pixel_values:s});let a;if(t){if(!("pooler_output"in n))throw Error("No pooled output was returned. Make sure the \
model has a 'pooler' layer when using the 'pool' option.");a=n.pooler_output}else a=n.last_hidden_state??n.logits??n.image_embeds;
return a}},Ta=Object.freeze({"text-classification":{pipeline:MD,model:P_,default:{model:"Xenova/distilbert-base-uncased-\
finetuned-sst-2-english"},type:"text"},"token-classification":{pipeline:xD,model:aD,default:{model:"Xenova/bert-base-mul\
tilingual-cased-ner-hrl"},type:"text"},"question-answering":{pipeline:ED,model:dD,default:{model:"Xenova/distilbert-base\
-cased-distilled-squad"},type:"text"},"fill-mask":{pipeline:AD,model:uD,default:{model:"onnx-community/ettin-encoder-32m\
-ONNX",dtype:"fp32"},type:"text"},summarization:{pipeline:CD,model:hi,default:{model:"Xenova/distilbart-cnn-6-6"},type:"\
text"},translation:{pipeline:SD,model:hi,default:{model:"Xenova/t5-small"},type:"text"},"text2text-generation":{pipeline:Bu,
model:hi,default:{model:"Xenova/flan-t5-small"},type:"text"},"text-generation":{pipeline:PD,model:cD,default:{model:"onn\
x-community/Qwen3-0.6B-ONNX",dtype:"q4"},type:"text"},"zero-shot-classification":{pipeline:FD,model:P_,default:{model:"X\
enova/distilbert-base-uncased-mnli"},type:"text"},"audio-classification":{pipeline:ID,model:gD,default:{model:"Xenova/wa\
v2vec2-base-superb-ks"},type:"audio"},"zero-shot-audio-classification":{pipeline:LD,model:tn,default:{model:"Xenova/clap\
-htsat-unfused"},type:"multimodal"},"automatic-speech-recognition":{pipeline:OD,model:[oD,mD],default:{model:"Xenova/whi\
sper-tiny.en"},type:"multimodal"},"text-to-audio":{pipeline:ND,model:[lD,iD],default:{model:"onnx-community/Supertonic-T\
TS-ONNX",dtype:"fp32"},type:"text"},"image-to-text":{pipeline:DD,model:hD,default:{model:"Xenova/vit-gpt2-image-captioni\
ng"},type:"multimodal"},"image-classification":{pipeline:zD,model:fD,default:{model:"Xenova/vit-base-patch16-224"},type:"\
multimodal"},"image-segmentation":{pipeline:yv,model:[F_,I_,L_],default:{model:"Xenova/detr-resnet-50-panoptic"},type:"m\
ultimodal"},"background-removal":{pipeline:BD,model:[F_,I_,L_],default:{model:"Xenova/modnet"},type:"image"},"zero-shot-\
image-classification":{pipeline:RD,model:tn,default:{model:"Xenova/clip-vit-base-patch32"},type:"multimodal"},"object-de\
tection":{pipeline:$D,model:_D,default:{model:"Xenova/detr-resnet-50"},type:"multimodal"},"zero-shot-object-detection":{
pipeline:GD,model:pD,default:{model:"Xenova/owlvit-base-patch32"},type:"multimodal"},"document-question-answering":{pipeline:VD,
model:wD,default:{model:"Xenova/donut-base-finetuned-docvqa"},type:"multimodal"},"image-to-image":{pipeline:UD,model:vD,
default:{model:"Xenova/swin2SR-classical-sr-x2-64"},type:"image"},"depth-estimation":{pipeline:jD,model:yD,default:{model:"\
onnx-community/depth-anything-v2-small"},type:"image"},"feature-extraction":{pipeline:qD,model:tn,default:{model:"onnx-c\
ommunity/all-MiniLM-L6-v2-ONNX",dtype:"fp32"},type:"text"},"image-feature-extraction":{pipeline:WD,model:[bD,tn],default:{
model:"onnx-community/dinov3-vits16-pretrain-lvd1689m-ONNX",dtype:"fp32"},type:"image"}}),bv=Object.freeze({"sentiment-a\
nalysis":"text-classification",ner:"token-classification",asr:"automatic-speech-recognition","text-to-speech":"text-to-a\
udio",embeddings:"feature-extraction"});async function Mv(e){if(!e)throw new Error("modelId is required");return(await Jr(
e,cn,{})).exists?[cn]:[]}async function Cn(e,{config:t=null,dtype:r=null,device:s=null,model_file_name:n=null,include_tokenizer:a=!0,
include_processor:o=!0}={}){const i=await Tl(e,{config:t,dtype:r,device:s,model_file_name:n});if(a){const l=await ul(e);
i.push(...l)}if(o){const l=await Mv(e);i.push(...l)}return i}async function Sn(e,t,r={}){e=bv[e]??e;const s=Ta[e];if(!s)
throw new Error(`Unsupported pipeline task: ${e}. Must be one of [${Object.keys(Ta).join(", ")}]`);const{type:n}=s,i=await Cn(
t,{...r,include_tokenizer:n!=="audio"&&n!=="image",include_processor:n!=="text"});if(e==="text-generation"){const l=await kl(
t,r),c=xl(l),d=qC(c);if(d){const h=Object.values(d).map(_=>`onnx/${_}`);return i.filter(_=>!_.startsWith("onnx/")||h.some(
p=>_.startsWith(p)))}}return i}async function Mz(e,t=null,{progress_callback:r=null,config:s=null,cache_dir:n=null,local_files_only:a=!1,
revision:o="main",device:i=null,dtype:l=null,subfolder:c="onnx",use_external_data_format:d=null,model_file_name:h=null,session_options:_={}}={}){
e=bv[e]??e;const p=Ta[e.split("_",1)[0]];if(!p)throw Error(`Unsupported pipeline: ${e}. Must be one of [${Object.keys(Ta)}\
]`);t||(t=p.default.model,de.info(`No model specified. Using default model: "${t}".`),!l&&p.default.dtype&&(l=p.default.
dtype));const w=await Sn(e,t,{device:i,dtype:l});let v={};if(r)try{(await Promise.all(w.map(async Y=>Jr(t,Y)))).forEach(
(Y,Q)=>{Y.exists&&(v[w[Q]]={loaded:0,total:Y.size??0})})}catch(j){de.warn(`Unable to fetch model file metadata for total\
 progress tracking: ${j}`)}const y={progress_callback:r?new fa(r,v):void 0,config:s,cache_dir:n,local_files_only:a,revision:o,
device:i,dtype:l,subfolder:c,use_external_data_format:d,model_file_name:h,session_options:_},b=w.includes("tokenizer.jso\
n"),k=w.includes("preprocessor_config.json"),A=p.model;let E;if(Array.isArray(A)){const j=s??await un.from_pretrained(t,
y),{model_type:Y}=j,Q=A.find(z=>z.supports(Y));if(!Q)throw Error(`Unsupported model type "${Y}" for task "${e}". None of\
 the candidate model classes support this type.`);E=Q.from_pretrained(t,{...y,config:j})}else E=A.from_pretrained(t,y);const[
C,N,M]=await Promise.all([b?ke.from_pretrained(t,y):null,k?gC.from_pretrained(t,y):null,E]),$={task:e,model:M};C&&($.tokenizer=
C),N&&($.processor=N),kr(r,{status:"ready",task:e,model:t});const R=p.pipeline;return new R($)}var HD=e=>e>=19968&&e<=40959||
e>=13312&&e<=19903||e>=131072&&e<=173791||e>=173824&&e<=177983||e>=177984&&e<=178207||e>=178208&&e<=183983||e>=63744&&e<=
64255||e>=194560&&e<=195103,QD=class{put(e){throw Error("Not implemented")}end(){throw Error("Not implemented")}},D_=fe.
IS_PROCESS_AVAILABLE?e=>process.stdout.write(e):e=>console.log(e),XD=class extends QD{constructor(e,{skip_prompt:t=!1,callback_function:r=null,
token_callback_function:s=null,skip_special_tokens:n=!0,decode_kwargs:a={},...o}={}){super(),this.tokenizer=e,this.skip_prompt=
t,this.callback_function=r??D_,this.token_callback_function=s,this.decode_kwargs={skip_special_tokens:n,...a,...o},this.
token_cache=[],this.print_len=0,this.next_tokens_are_prompt=!0,this.special_ids=new Set(this.tokenizer.all_special_ids.map(
BigInt))}put(e){if(e.length>1)throw Error("TextStreamer only supports batch size of 1");const t=this.next_tokens_are_prompt;
if(t&&(this.next_tokens_are_prompt=!1,this.skip_prompt))return;const r=e[0];if(this.token_callback_function?.(r),r.length===
1&&this.special_ids.has(r[0])){if(this.decode_kwargs.skip_special_tokens)return;if(this.token_cache.length>0){const i=this.
tokenizer.decode(this.token_cache,this.decode_kwargs).slice(this.print_len);this.on_finalized_text(i,!1),this.token_cache=
[],this.print_len=0}const a=this.tokenizer.decode(r,this.decode_kwargs);this.on_finalized_text(a,!1);return}this.token_cache=
Dt(this.token_cache,r);const s=this.tokenizer.decode(this.token_cache,this.decode_kwargs);let n;t||s.endsWith(`
`)?(n=s.slice(this.print_len),this.token_cache=[],this.print_len=0):s.length>0&&HD(s.charCodeAt(s.length-1))?(n=s.slice(
this.print_len),this.print_len+=n.length):(n=s.slice(this.print_len,s.lastIndexOf(" ")+1),this.print_len+=n.length),this.
on_finalized_text(n,!1)}end(){let e;this.token_cache.length>0?(e=this.tokenizer.decode(this.token_cache,this.decode_kwargs).
slice(this.print_len),this.token_cache=[],this.print_len=0):e="",this.next_tokens_are_prompt=!0,this.on_finalized_text(e,
!0)}on_finalized_text(e,t){e.length>0&&this.callback_function?.(e),t&&this.callback_function===D_&&fe.IS_PROCESS_AVAILABLE&&
this.callback_function?.(`
`)}},xz=class extends XD{constructor(e,{skip_prompt:t=!1,callback_function:r=null,token_callback_function:s=null,on_chunk_start:n=null,
on_chunk_end:a=null,on_finalize:o=null,time_precision:i=.02,skip_special_tokens:l=!0,decode_kwargs:c={}}={}){super(e,{skip_prompt:t,
skip_special_tokens:l,callback_function:r,token_callback_function:s,decode_kwargs:c}),this.timestamp_begin=e.timestamp_begin,
this.on_chunk_start=n,this.on_chunk_end=a,this.on_finalize=o,this.time_precision=i,this.waiting_for_timestamp=!1}put(e){
if(e.length>1)throw Error("WhisperTextStreamer only supports batch size of 1");const t=e[0];if(t.length===1){const r=Number(
t[0])-this.timestamp_begin;if(r>=0){const s=r*this.time_precision;this.waiting_for_timestamp?this.on_chunk_end?.(s):this.
on_chunk_start?.(s),this.waiting_for_timestamp=!this.waiting_for_timestamp,this.token_callback_function?.(t);return}}return super.
put(e)}end(){super.end(),this.on_finalize?.()}},xv=class{constructor(e,t){this.image=e,this.timestamp=t}},YD=class{constructor(e,t){
e.length>0&&e[0]instanceof Mt&&(e=e.map((r,s)=>new xv(r,(s+1)/(e.length+1)*t))),this.frames=e,this.duration=t}get width(){
return this.frames[0].image.width}get height(){return this.frames[0].image.height}get fps(){return this.frames.length/this.
duration}};async function kz(e,{num_frames:t=null,fps:r=null}={}){if(!fe.IS_BROWSER_ENV)throw new Error("`load_video` is\
 currently only supported in browser environments.");if(t==null&&r==null)throw new Error("Either num_frames or fps must \
be provided.");const s=[],n=document.createElement("video");if(n.crossOrigin="anonymous",n.muted=!0,typeof e=="string")n.
src=e;else if(e instanceof Blob)n.src=URL.createObjectURL(e);else if(e instanceof HTMLVideoElement)n.src=e.src;else throw new Error(
"Invalid URL or video element provided.");if(await new Promise(h=>n.onloadedmetadata=h),n.seekable.start(0)===n.seekable.
end(0)){const _=await(await we.fetch(n.src)).blob();n.src=URL.createObjectURL(_),await new Promise(p=>n.onloadedmetadata=
p)}const a=n.duration;let o,i;t!=null?(o=t,i=t===1?0:a/(t-1)):(i=1/r,o=Math.floor(a/i));let l=[];for(let h=0;h<o;++h)l.push(
t===1?a/2:h*i);const c=document.createElement("canvas");c.width=n.videoWidth,c.height=n.videoHeight;const d=c.getContext(
"2d",{willReadFrequently:!0});for(const h of l){n.currentTime=h,await new Promise(v=>{n.onseeked=v}),d.drawImage(n,0,0,c.
width,c.height);const _=d.getImageData(0,0,c.width,c.height),p=new Mt(_.data,c.width,c.height,4),w=new xv(p,h);s.push(w)}
return n.remove(),new YD(s,a)}async function eo(e,t,r={}){const s=await Es(r?.cache_dir);if(!s)return{allCached:!1,files:t.
map(o=>({file:o,cached:!1}))};const n=await Promise.all(t.map(async a=>{const{localPath:o,proposedCacheKey:i}=pn(e,a,r,s),
l=await mn(s,o,i);return{file:a,cached:!!l}}));return{allCached:n.every(a=>a.cached),files:n}}async function kv(e,t,r={}){
const s=await Es(r?.cache_dir);if(!s)return!1;const{localPath:n,proposedCacheKey:a}=pn(e,t,r,s);return!!await mn(s,n,a)}
async function KD(e,t={}){if(!e)throw new Error("modelId is required");if(!await kv(e,"config.json",t))return!1;const r=await Cn(
e,t);return(await eo(e,r,t)).allCached}async function JD(e,t={}){if(!e)throw new Error("modelId is required");const r=await Cn(
e,t);return await eo(e,r,t)}async function ZD(e,t,r={}){if(!e)throw new Error("task is required");if(!t)throw new Error(
"modelId is required");if(!await kv(t,"config.json",r))return!1;const s=await Sn(e,t,r);return(await eo(t,s,r)).allCached}
async function ez(e,t,r={}){if(!e)throw new Error("task is required");if(!t)throw new Error("modelId is required");const s=await Sn(
e,t,r);return await eo(t,s,r)}async function Tv(e,t,r={}){const s=await Es(r?.cache_dir);if(!s)return{filesDeleted:0,filesCached:0,
files:t.map(a=>({file:a,deleted:!1,wasCached:!1}))};if(!s.delete)throw new Error("Cache does not support delete operatio\
n");const n=await Promise.all(t.map(async a=>{const{localPath:o,proposedCacheKey:i}=pn(e,a,r,s),c=!!await mn(s,o,i);let d=!1;
if(c){const h=await s.delete(i),_=!h&&i!==o?await s.delete(o):!1;d=h||_}return{file:a,deleted:d,wasCached:c}}));return{filesDeleted:n.
filter(a=>a.deleted).length,filesCached:n.filter(a=>a.wasCached).length,files:n}}async function tz(e,t={}){if(!e)throw new Error(
"modelId is required");const r=await Cn(e,t);return await Tv(e,r,t)}async function rz(e,t,r={}){if(!e)throw new Error("t\
ask is required");if(!t)throw new Error("modelId is required");const s=await Sn(e,t,r);return await Tv(t,s,r)}var sz=Object.
keys(on);async function nz(e,{config:t=null,model_file_name:r=null,revision:s="main",cache_dir:n=null,local_files_only:a=!1}={}){
t=await kl(e,{config:t,cache_dir:n,local_files_only:a,revision:s});const o="onnx",i=xl(t),{sessions:l}=mg(i,t,{model_file_name:r}),
c=Object.values(l),d={revision:s,cache_dir:n,local_files_only:a};return(await Promise.all(sz.map(async _=>{const p=on[_]??
"",w=await Promise.all(c.map(async v=>{const y=`${o}/${v}${p}.onnx`;return(await Jr(e,y,d)).exists}));return{dtype:_,available:w.
every(Boolean)}}))).filter(_=>_.available).map(_=>_.dtype)}var Tz=class{static async get_files(e,t={}){return Cn(e,t)}static async get_pipeline_files(e,t,r={}){
return Sn(e,t,r)}static async get_model_files(e,t={}){return Tl(e,t)}static async get_tokenizer_files(e){return ul(e)}static async get_processor_files(e){
return Mv(e)}static async get_available_dtypes(e,t={}){return nz(e,t)}static async is_cached(e,t={}){return KD(e,t)}static async is_cached_files(e,t={}){
return JD(e,t)}static async is_pipeline_cached(e,t,r={}){return ZD(e,t,r)}static async is_pipeline_cached_files(e,t,r={}){
return ez(e,t,r)}static async get_file_metadata(e,t,r={}){return Jr(e,t,r)}static async clear_cache(e,t={}){return tz(e,
t)}static async clear_pipeline_cache(e,t,r={}){return rz(e,t,r)}};export{f2 as ASTFeatureExtractor,uS as ASTForAudioClassification,cS as ASTModel,Ll as ASTPreTrainedModel,oS as AfmoeForCausalLM,
aS as AfmoeModel,Fl as AfmoePreTrainedModel,rS as AlbertForMaskedLM,tS as AlbertForQuestionAnswering,eS as AlbertForSequenceClassification,
ZC as AlbertModel,vn as AlbertPreTrainedModel,nE as AlbertTokenizer,nS as ApertusForCausalLM,sS as ApertusModel,Pl as ApertusPreTrainedModel,
lS as ArceeForCausalLM,iS as ArceeModel,Il as ArceePreTrainedModel,ID as AudioClassificationPipeline,un as AutoConfig,St as AutoFeatureExtractor,
at as AutoImageProcessor,tn as AutoModel,gD as AutoModelForAudioClassification,mz as AutoModelForAudioFrameClassification,
bz as AutoModelForAudioTextToText,mD as AutoModelForCTC,cD as AutoModelForCausalLM,yD as AutoModelForDepthEstimation,wD as AutoModelForDocumentQuestionAnswering,
fD as AutoModelForImageClassification,bD as AutoModelForImageFeatureExtraction,gz as AutoModelForImageMatting,F_ as AutoModelForImageSegmentation,
yz as AutoModelForImageTextToText,vD as AutoModelForImageToImage,_z as AutoModelForMaskGeneration,uD as AutoModelForMaskedLM,
wz as AutoModelForNormalEstimation,_D as AutoModelForObjectDetection,vz as AutoModelForPoseEstimation,dD as AutoModelForQuestionAnswering,
I_ as AutoModelForSemanticSegmentation,hi as AutoModelForSeq2SeqLM,P_ as AutoModelForSequenceClassification,oD as AutoModelForSpeechSeq2Seq,
iD as AutoModelForTextToSpectrogram,lD as AutoModelForTextToWaveform,aD as AutoModelForTokenClassification,L_ as AutoModelForUniversalSegmentation,
hD as AutoModelForVision2Seq,pz as AutoModelForXVector,pD as AutoModelForZeroShotObjectDetection,gC as AutoProcessor,ke as AutoTokenizer,
OD as AutomaticSpeechRecognitionPipeline,BD as BackgroundRemovalPipeline,hS as BartForConditionalGeneration,fS as BartForSequenceClassification,
dS as BartModel,Da as BartPretrainedModel,aE as BartTokenizer,TC as BaseModelOutput,QD as BaseStreamer,R2 as BeitFeatureExtractor,
pS as BeitForImageClassification,_S as BeitModel,Ol as BeitPreTrainedModel,gS as BertForMaskedLM,yS as BertForQuestionAnswering,
wS as BertForSequenceClassification,vS as BertForTokenClassification,mS as BertModel,Cs as BertPreTrainedModel,oE as BertTokenizer,
$2 as BitImageProcessor,MS as BlenderbotForConditionalGeneration,bS as BlenderbotModel,Nl as BlenderbotPreTrainedModel,kS as BlenderbotSmallForConditionalGeneration,
xS as BlenderbotSmallModel,Dl as BlenderbotSmallPreTrainedModel,iE as BlenderbotSmallTokenizer,lE as BlenderbotTokenizer,
ES as BloomForCausalLM,TS as BloomModel,zl as BloomPreTrainedModel,cE as BloomTokenizer,OS as CHMv2ForDepthEstimation,V2 as CHMv2ImageProcessor,
Eg as CHMv2PreTrainedModel,U2 as CLIPFeatureExtractor,qm as CLIPImageProcessor,DS as CLIPModel,Zr as CLIPPreTrainedModel,
GS as CLIPSegForImageSegmentation,$S as CLIPSegModel,Bl as CLIPSegPreTrainedModel,zS as CLIPTextModel,Sg as CLIPTextModelWithProjection,
dE as CLIPTokenizer,BS as CLIPVisionModel,RS as CLIPVisionModelWithProjection,CS as CamembertForMaskedLM,FS as CamembertForQuestionAnswering,
SS as CamembertForSequenceClassification,PS as CamembertForTokenClassification,AS as CamembertModel,Ss as CamembertPreTrainedModel,
uE as CamembertTokenizer,Pr as CausalLMOutput,EC as CausalLMOutputWithPast,_2 as ChatterboxFeatureExtractor,kg as ChatterboxModel,
xg as ChatterboxPreTrainedModel,A2 as ChatterboxProcessor,G2 as ChineseCLIPFeatureExtractor,LS as ChineseCLIPModel,Tg as ChineseCLIPPreTrainedModel,
Cg as ClapAudioModelWithProjection,p2 as ClapFeatureExtractor,NS as ClapModel,za as ClapPreTrainedModel,Ag as ClapTextModelWithProjection,
zC as ClassifierFreeGuidanceLogitsProcessor,US as CodeGenForCausalLM,VS as CodeGenModel,Rl as CodeGenPreTrainedModel,fE as CodeGenTokenizer,
hE as CodeLlamaTokenizer,HS as Cohere2ForCausalLM,WS as Cohere2Model,Gl as Cohere2PreTrainedModel,g2 as CohereAsrFeatureExtractor,
XS as CohereAsrForConditionalGeneration,QS as CohereAsrModel,Vl as CohereAsrPreTrainedModel,S2 as CohereAsrProcessor,pE as CohereAsrTokenizer,
qS as CohereForCausalLM,jS as CohereModel,$l as CoherePreTrainedModel,_E as CohereTokenizer,KS as ConvBertForMaskedLM,eP as ConvBertForQuestionAnswering,
JS as ConvBertForSequenceClassification,ZS as ConvBertForTokenClassification,YS as ConvBertModel,Ps as ConvBertPreTrainedModel,
mE as ConvBertTokenizer,j2 as ConvNextFeatureExtractor,rP as ConvNextForImageClassification,Wm as ConvNextImageProcessor,
tP as ConvNextModel,Ul as ConvNextPreTrainedModel,nP as ConvNextV2ForImageClassification,sP as ConvNextV2Model,jl as ConvNextV2PreTrainedModel,
lP as DFineForObjectDetection,iP as DFineModel,Wl as DFinePreTrainedModel,DP as DINOv3ConvNextModel,Bg as DINOv3ConvNextPreTrainedModel,
H2 as DINOv3ViTImageProcessor,zP as DINOv3ViTModel,Rg as DINOv3ViTPreTrainedModel,X2 as DPTFeatureExtractor,qP as DPTForDepthEstimation,
Xm as DPTImageProcessor,jP as DPTModel,Zl as DPTPreTrainedModel,Lg as DacDecoderModel,Fg as DacDecoderOutput,Ig as DacEncoderModel,
Pg as DacEncoderOutput,Om as DacFeatureExtractor,cP as DacModel,Ba as DacPreTrainedModel,dP as DebertaForMaskedLM,_P as DebertaForQuestionAnswering,
hP as DebertaForSequenceClassification,fP as DebertaForTokenClassification,uP as DebertaModel,Fs as DebertaPreTrainedModel,
wE as DebertaTokenizer,yP as DebertaV2ForMaskedLM,xP as DebertaV2ForQuestionAnswering,bP as DebertaV2ForSequenceClassification,
MP as DebertaV2ForTokenClassification,vP as DebertaV2Model,Is as DebertaV2PreTrainedModel,gE as DebertaV2Tokenizer,kP as DecisionTransformerModel,
Og as DecisionTransformerPreTrainedModel,mP as DeepseekV3ForCausalLM,pP as DeepseekV3Model,Hl as DeepseekV3PreTrainedModel,
wP as DeepseekV4ForCausalLM,gP as DeepseekV4Model,Ql as DeepseekV4PreTrainedModel,q2 as DeiTFeatureExtractor,EP as DeiTForImageClassification,
Hm as DeiTImageProcessor,TP as DeiTModel,Xl as DeiTPreTrainedModel,AP as DepthAnythingForDepthEstimation,Ng as DepthAnythingPreTrainedModel,
jD as DepthEstimationPipeline,CP as DepthProForDepthEstimation,Dg as DepthProPreTrainedModel,W2 as DetrFeatureExtractor,
PP as DetrForObjectDetection,FP as DetrForSegmentation,Qm as DetrImageProcessor,SP as DetrModel,Yl as DetrObjectDetectionOutput,
Ra as DetrPreTrainedModel,zg as DetrSegmentationOutput,LP as Dinov2ForImageClassification,IP as Dinov2Model,Kl as Dinov2PreTrainedModel,
NP as Dinov2WithRegistersForImageClassification,OP as Dinov2WithRegistersModel,Jl as Dinov2WithRegistersPreTrainedModel,
VP as DistilBertForMaskedLM,GP as DistilBertForQuestionAnswering,RP as DistilBertForSequenceClassification,$P as DistilBertForTokenClassification,
BP as DistilBertModel,Ls as DistilBertPreTrainedModel,vE as DistilBertTokenizer,VD as DocumentQuestionAnsweringPipeline,
Q2 as DonutFeatureExtractor,ml as DonutImageProcessor,UP as DonutSwinModel,$g as DonutSwinPreTrainedModel,Ml as DynamicCache,
hN as EdgeTamModel,HP as EfficientNetForImageClassification,Y2 as EfficientNetImageProcessor,WP as EfficientNetModel,ec as EfficientNetPreTrainedModel,
XP as ElectraForMaskedLM,JP as ElectraForQuestionAnswering,YP as ElectraForSequenceClassification,KP as ElectraForTokenClassification,
QP as ElectraModel,Os as ElectraPreTrainedModel,yE as ElectraTokenizer,Vg as EmbeddingGemma2Model,Gg as EmbeddingGemma2PreTrainedModel,
N2 as EmbeddingGemma2Processor,$m as EmbeddingGemma2VideoProcessor,Im as EncodecFeatureExtractor,$C as EosTokenCriteria,
eF as Ernie4_5ForCausalLM,ZP as Ernie4_5Model,tc as Ernie4_5PretrainedModel,rF as EsmForMaskedLM,sF as EsmForSequenceClassification,
nF as EsmForTokenClassification,tF as EsmModel,bn as EsmPreTrainedModel,bE as EsmTokenizer,oF as EuroBertForMaskedLM,iF as EuroBertForSequenceClassification,
lF as EuroBertForTokenClassification,aF as EuroBertModel,Mn as EuroBertPreTrainedModel,uF as ExaoneForCausalLM,cF as ExaoneModel,
rc as ExaonePreTrainedModel,hF as FalconForCausalLM,_F as FalconH1ForCausalLM,fF as FalconH1Model,nc as FalconH1PreTrainedModel,
dF as FalconModel,sc as FalconPreTrainedModel,ME as FalconTokenizer,mF as FastViTForImageClassification,pF as FastViTModel,
ac as FastViTPreTrainedModel,qD as FeatureExtractionPipeline,ut as FeatureExtractor,AD as FillMaskPipeline,gF as Florence2ForConditionalGeneration,
Ug as Florence2PreTrainedModel,LA as Florence2Processor,CC as ForcedBOSTokenLogitsProcessor,SC as ForcedEOSTokenLogitsProcessor,
Z2 as GLPNFeatureExtractor,OF as GLPNForDepthEstimation,LF as GLPNModel,fc as GLPNPreTrainedModel,jF as GPT2LMHeadModel,
UF as GPT2Model,wc as GPT2PreTrainedModel,TE as GPT2Tokenizer,DF as GPTBigCodeForCausalLM,NF as GPTBigCodeModel,_c as GPTBigCodePreTrainedModel,
WF as GPTJForCausalLM,qF as GPTJModel,vc as GPTJPreTrainedModel,BF as GPTNeoForCausalLM,zF as GPTNeoModel,pc as GPTNeoPreTrainedModel,
$F as GPTNeoXForCausalLM,RF as GPTNeoXModel,mc as GPTNeoXPreTrainedModel,kE as GPTNeoXTokenizer,bF as Gemma2ForCausalLM,
yF as Gemma2Model,ic as Gemma2PreTrainedModel,TF as Gemma3ForCausalLM,Wg as Gemma3ForConditionalGeneration,K2 as Gemma3ImageProcessor,
kF as Gemma3Model,qg as Gemma3PreTrainedModel,OA as Gemma3Processor,Nm as Gemma3nAudioFeatureExtractor,EF as Gemma3nForCausalLM,
$a as Gemma3nForConditionalGeneration,Hg as Gemma3nPreTrainedModel,NA as Gemma3nProcessor,Dm as Gemma4AudioFeatureExtractor,
AF as Gemma4ForCausalLM,lc as Gemma4ForConditionalGeneration,_l as Gemma4ImageProcessor,Rm as Gemma4Processor,vF as GemmaForCausalLM,
wF as GemmaModel,oc as GemmaPreTrainedModel,xE as GemmaTokenizer,fg as GenerationConfig,J2 as Glm46VImageProcessor,DA as Glm46VProcessor,
SF as GlmForCausalLM,CF as GlmModel,FF as GlmMoeDsaForCausalLM,PF as GlmMoeDsaModel,uc as GlmMoeDsaPreTrainedModel,IF as GlmOcrForConditionalGeneration,
cc as GlmPreTrainedModel,VF as GptOssForCausalLM,GF as GptOssModel,gc as GptOssPreTrainedModel,QF as GraniteForCausalLM,
HF as GraniteModel,YF as GraniteMoeHybridForCausalLM,XF as GraniteMoeHybridModel,bc as GraniteMoeHybridPreTrainedModel,yc as GranitePreTrainedModel,
w2 as GraniteSpeechFeatureExtractor,KF as GraniteSpeechForConditionalGeneration,zA as GraniteSpeechProcessor,JF as GroundingDinoForObjectDetection,
eA as GroundingDinoImageProcessor,Jg as GroundingDinoPreTrainedModel,RA as GroundingDinoProcessor,ZF as GroupViTModel,Zg as GroupViTPreTrainedModel,
tI as HeliumForCausalLM,eI as HeliumModel,xc as HeliumPreTrainedModel,EE as HerbertTokenizer,sI as HieraForImageClassification,
rI as HieraModel,kc as HieraPreTrainedModel,aI as HrmTextForCausalLM,nI as HrmTextModel,Tc as HrmTextPreTrainedModel,hI as HubertForCTC,
fI as HubertForSequenceClassification,dI as HubertModel,uI as HubertPreTrainedModel,pI as HunYuanDenseV1ForCausalLM,_I as HunYuanDenseV1Model,
Ec as HunYuanDenseV1PreTrainedModel,gI as IJepaForImageClassification,mI as IJepaModel,Ac as IJepaPreTrainedModel,ew as Idefics3ForConditionalGeneration,
y_ as Idefics3ImageProcessor,M_ as Idefics3Processor,zD as ImageClassificationPipeline,WD as ImageFeatureExtractionPipeline,
he as ImageFeatureExtractor,dg as ImageMattingOutput,he as ImageProcessor,yv as ImageSegmentationPipeline,UD as ImageToImagePipeline,
DD as ImageToTextPipeline,fz as InterruptableStoppingCriteria,vI as JAISLMHeadModel,wI as JAISModel,Cc as JAISPreTrainedModel,
rA as JinaCLIPImageProcessor,yI as JinaCLIPModel,Ga as JinaCLIPPreTrainedModel,jA as JinaCLIPProcessor,tw as JinaCLIPTextModel,
bI as JinaCLIPVisionModel,xI as Lfm2ForCausalLM,MI as Lfm2Model,EI as Lfm2MoeForCausalLM,TI as Lfm2MoeModel,Pc as Lfm2MoePreTrainedModel,
Sc as Lfm2PreTrainedModel,AI as Lfm2VlForConditionalGeneration,iA as Lfm2VlImageProcessor,qA as Lfm2VlProcessor,SI as Lfm3ForCausalLM,
CI as Lfm3Model,Fc as Lfm3PreTrainedModel,PI as Lfm3VlForConditionalGeneration,lA as Lfm3VlImageProcessor,WA as Lfm3VlProcessor,
kI as LightOnOcrForConditionalGeneration,L3 as LiteWhisperForConditionalGeneration,LI as Llama4ForCausalLM,rw as Llama4PreTrainedModel,
II as LlamaForCausalLM,FI as LlamaModel,Ic as LlamaPreTrainedModel,AE as LlamaTokenizer,$t as LlavaForConditionalGeneration,
$t as LlavaOnevisionForConditionalGeneration,cA as LlavaOnevisionImageProcessor,jg as LlavaPreTrainedModel,HA as LlavaProcessor,
xF as LlavaQwen2ForCausalLM,Nt as LogLevel,jt as LogitsProcessor,Ci as LogitsProcessorList,bl as LogitsWarper,NI as LongT5ForConditionalGeneration,
OI as LongT5Model,Lc as LongT5PreTrainedModel,zI as M2M100ForConditionalGeneration,DI as M2M100Model,Oc as M2M100PreTrainedModel,
CE as M2M100Tokenizer,PE as MBart50Tokenizer,qI as MBartForCausalLM,UI as MBartForConditionalGeneration,jI as MBartForSequenceClassification,
VI as MBartModel,xn as MBartPreTrainedModel,km as MBartTokenizer,DL as MPNetForMaskedLM,RL as MPNetForQuestionAnswering,
zL as MPNetForSequenceClassification,BL as MPNetForTokenClassification,NL as MPNetModel,Ns as MPNetPreTrainedModel,LE as MPNetTokenizer,
UL as MT5ForConditionalGeneration,VL as MT5Model,Hc as MT5PreTrainedModel,RI as MarianMTModel,BI as MarianModel,Nc as MarianPreTrainedModel,
SE as MarianTokenizer,dA as Mask2FormerImageProcessor,uA as MaskFormerFeatureExtractor,GI as MaskFormerForInstanceSegmentation,
wl as MaskFormerImageProcessor,$I as MaskFormerModel,Dc as MaskFormerPreTrainedModel,Xe as MaskedLMOutput,RC as MaxLengthCriteria,
WI as Metric3DForDepthEstimation,sw as Metric3DPreTrainedModel,HI as Metric3Dv2ForDepthEstimation,nw as Metric3Dv2PreTrainedModel,
QI as MgpstrForSceneTextRecognition,aw as MgpstrModelOutput,ow as MgpstrPreTrainedModel,QA as MgpstrProcessor,FE as MgpstrTokenizer,
uw as MimiDecoderModel,lw as MimiDecoderOutput,cw as MimiEncoderModel,iw as MimiEncoderOutput,XI as MimiModel,Va as MimiPreTrainedModel,
OC as MinLengthLogitsProcessor,NC as MinNewTokensLengthLogitsProcessor,ZI as Ministral3ForCausalLM,JI as Ministral3Model,
Bc as Ministral3PreTrainedModel,KI as MinistralForCausalLM,YI as MinistralModel,zc as MinistralPreTrainedModel,rL as Mistral3ForConditionalGeneration,
nL as Mistral4ForCausalLM,sL as Mistral4Model,$c as Mistral4PreTrainedModel,tL as MistralForCausalLM,eL as MistralModel,
Rc as MistralPreTrainedModel,oL as MobileBertForMaskedLM,lL as MobileBertForQuestionAnswering,iL as MobileBertForSequenceClassification,
aL as MobileBertModel,kn as MobileBertPreTrainedModel,IE as MobileBertTokenizer,uL as MobileLLMForCausalLM,cL as MobileLLMModel,
Gc as MobileLLMPreTrainedModel,hA as MobileNetV1FeatureExtractor,hL as MobileNetV1ForImageClassification,fL as MobileNetV1ForSemanticSegmentation,
Ym as MobileNetV1ImageProcessor,dL as MobileNetV1Model,Ua as MobileNetV1PreTrainedModel,fA as MobileNetV2FeatureExtractor,
pL as MobileNetV2ForImageClassification,mL as MobileNetV2ForSemanticSegmentation,Km as MobileNetV2ImageProcessor,_L as MobileNetV2Model,
ja as MobileNetV2PreTrainedModel,_A as MobileNetV3FeatureExtractor,wL as MobileNetV3ForImageClassification,vL as MobileNetV3ForSemanticSegmentation,
Jm as MobileNetV3ImageProcessor,gL as MobileNetV3Model,qa as MobileNetV3PreTrainedModel,pA as MobileNetV4FeatureExtractor,
bL as MobileNetV4ForImageClassification,ML as MobileNetV4ForSemanticSegmentation,Zm as MobileNetV4ImageProcessor,yL as MobileNetV4Model,
Wa as MobileNetV4PreTrainedModel,mA as MobileViTFeatureExtractor,kL as MobileViTForImageClassification,eg as MobileViTImageProcessor,
xL as MobileViTModel,Vc as MobileViTPreTrainedModel,EL as MobileViTV2ForImageClassification,TL as MobileViTV2Model,Uc as MobileViTV2PreTrainedModel,
vi as ModelFileNotFoundError,Ve as ModelOutput,Tz as ModelRegistry,IL as ModernBertDecoderForCausalLM,FL as ModernBertDecoderModel,
jc as ModernBertDecoderPreTrainedModel,CL as ModernBertForMaskedLM,SL as ModernBertForSequenceClassification,PL as ModernBertForTokenClassification,
AL as ModernBertModel,Tn as ModernBertPreTrainedModel,MF as Moondream1ForConditionalGeneration,v2 as MoonshineFeatureExtractor,
OL as MoonshineForConditionalGeneration,LL as MoonshineModel,qc as MoonshinePreTrainedModel,XA as MoonshineProcessor,GL as MptForCausalLM,
$L as MptModel,Wc as MptPreTrainedModel,jL as MultiModalityCausalLM,dw as MultiModalityPreTrainedModel,WL as MusicgenForCausalLM,
hw as MusicgenForConditionalGeneration,qL as MusicgenModel,Qc as MusicgenPreTrainedModel,QL as NanoChatForCausalLM,HL as NanoChatModel,
Xc as NanoChatPreTrainedModel,YL as NemotronHForCausalLM,XL as NemotronHModel,Yc as NemotronHPreTrainedModel,JL as NeoBertForMaskedLM,
tO as NeoBertForQuestionAnswering,ZL as NeoBertForSequenceClassification,eO as NeoBertForTokenClassification,KL as NeoBertModel,
Ds as NeoBertPreTrainedModel,OE as NllbTokenizer,DC as NoBadWordsLogitsProcessor,IC as NoRepeatNGramLogitsProcessor,rO as NomicBertModel,
fw as NomicBertPreTrainedModel,gA as NougatImageProcessor,NE as NougatTokenizer,mO as OPTForCausalLM,pO as OPTModel,su as OPTPreTrainedModel,
$D as ObjectDetectionPipeline,oO as Olmo2ForCausalLM,aO as Olmo2Model,Jc as Olmo2PreTrainedModel,lO as Olmo3ForCausalLM,
iO as Olmo3Model,Zc as Olmo3PreTrainedModel,nO as OlmoForCausalLM,uO as OlmoHybridForCausalLM,cO as OlmoHybridModel,eu as OlmoHybridPreTrainedModel,
sO as OlmoModel,Kc as OlmoPreTrainedModel,hO as OpenAIPrivacyFilterForTokenClassification,dO as OpenAIPrivacyFilterModel,
tu as OpenAIPrivacyFilterPreTrainedModel,_O as OpenELMForCausalLM,fO as OpenELMModel,ru as OpenELMPreTrainedModel,wA as OwlViTFeatureExtractor,
yO as OwlViTForObjectDetection,vl as OwlViTImageProcessor,vO as OwlViTModel,au as OwlViTPreTrainedModel,YA as OwlViTProcessor,
wO as Owlv2ForObjectDetection,vA as Owlv2ImageProcessor,gO as Owlv2Model,nu as Owlv2PreTrainedModel,bO as PaliGemmaForConditionalGeneration,
JA as PaliGemmaProcessor,Lm as ParakeetFeatureExtractor,MO as ParakeetForCTC,_w as ParakeetPreTrainedModel,kO as PatchTSMixerForPrediction,
xO as PatchTSMixerModel,ou as PatchTSMixerPreTrainedModel,EO as PatchTSTForPrediction,TO as PatchTSTModel,iu as PatchTSTPreTrainedModel,
PO as Phi3ForCausalLM,SO as Phi3Model,cu as Phi3PreTrainedModel,mw as Phi3VForCausalLM,bA as Phi3VImageProcessor,pw as Phi3VPreTrainedModel,
eC as Phi3VProcessor,CO as PhiForCausalLM,AO as PhiModel,lu as PhiPreTrainedModel,MA as PixtralImageProcessor,tC as PixtralProcessor,
F as PreTrainedModel,ue as PreTrainedTokenizer,Ei as PretrainedConfig,Te as Processor,IO as PvtForImageClassification,xA as PvtImageProcessor,
FO as PvtModel,uu as PvtPreTrainedModel,zm as PyAnnoteFeatureExtractor,OO as PyAnnoteForAudioFrameClassification,LO as PyAnnoteModel,
du as PyAnnotePreTrainedModel,rC as PyAnnoteProcessor,ot as QuestionAnsweringModelOutput,ED as QuestionAnsweringPipeline,
DO as Qwen2ForCausalLM,NO as Qwen2Model,BO as Qwen2MoeForCausalLM,zO as Qwen2MoeModel,fu as Qwen2MoePreTrainedModel,hu as Qwen2PreTrainedModel,
DE as Qwen2Tokenizer,Xg as Qwen2VLForCausalLM,dc as Qwen2VLForConditionalGeneration,gl as Qwen2VLImageProcessor,Qg as Qwen2VLPreTrainedModel,
yl as Qwen2VLProcessor,Yg as Qwen2_5_VLForCausalLM,hc as Qwen2_5_VLForConditionalGeneration,ag as Qwen2_5_VLProcessor,$O as Qwen3ForCausalLM,
RO as Qwen3Model,VO as Qwen3MoeForCausalLM,GO as Qwen3MoeModel,pu as Qwen3MoePreTrainedModel,jO as Qwen3NextForCausalLM,
UO as Qwen3NextModel,mu as Qwen3NextPreTrainedModel,_u as Qwen3PreTrainedModel,gw as Qwen3VLForCausalLM,gu as Qwen3VLForConditionalGeneration,
WO as Qwen3VLMoeForCausalLM,qO as Qwen3VLMoeForConditionalGeneration,sC as Qwen3VLProcessor,ww as Qwen3_5ForCausalLM,wu as Qwen3_5ForConditionalGeneration,
QO as Qwen3_5MoeForCausalLM,HO as Qwen3_5MoeForConditionalGeneration,JO as RFDetrForObjectDetection,KO as RFDetrModel,vw as RFDetrObjectDetectionOutput,
yu as RFDetrPreTrainedModel,oP as RTDetrForObjectDetection,kA as RTDetrImageProcessor,aP as RTDetrModel,yn as RTDetrObjectDetectionOutput,
ql as RTDetrPreTrainedModel,uN as RTDetrV2ForObjectDetection,cN as RTDetrV2Model,yw as RTDetrV2ObjectDetectionOutput,bu as RTDetrV2PreTrainedModel,
h2 as RawAudio,Mt as RawImage,YD as RawVideo,xv as RawVideoFrame,LC as RepetitionPenaltyLogitsProcessor,YO as ResNetForImageClassification,
XO as ResNetModel,vu as ResNetPreTrainedModel,aN as RoFormerForMaskedLM,lN as RoFormerForQuestionAnswering,oN as RoFormerForSequenceClassification,
iN as RoFormerForTokenClassification,nN as RoFormerModel,Bs as RoFormerPreTrainedModel,BE as RoFormerTokenizer,eN as RobertaForMaskedLM,
sN as RobertaForQuestionAnswering,tN as RobertaForSequenceClassification,rN as RobertaForTokenClassification,ZO as RobertaModel,
zs as RobertaPreTrainedModel,zE as RobertaTokenizer,ci as Sam2ImageProcessor,xw as Sam2ImageSegmentationOutput,Mu as Sam2Model,
kw as Sam2PreTrainedModel,ig as Sam2Processor,nC as Sam2VideoProcessor,ci as Sam3ImageProcessor,fN as Sam3TrackerModel,ci as SamImageProcessor,
bw as SamImageSegmentationOutput,dN as SamModel,Mw as SamPreTrainedModel,og as SamProcessor,TA as SapiensFeatureExtractor,
pN as SapiensForDepthEstimation,mN as SapiensForNormalEstimation,_N as SapiensForSemanticSegmentation,tg as SapiensImageProcessor,
Ha as SapiensPreTrainedModel,y2 as SeamlessM4TFeatureExtractor,EA as SegformerFeatureExtractor,wN as SegformerForImageClassification,
vN as SegformerForSemanticSegmentation,rg as SegformerImageProcessor,gN as SegformerModel,Qa as SegformerPreTrainedModel,
AC as Seq2SeqLMOutput,ie as SequenceClassifierOutput,AA as SiglipImageProcessor,yN as SiglipModel,xu as SiglipPreTrainedModel,
Tw as SiglipTextModel,RE as SiglipTokenizer,bN as SiglipVisionModel,xN as SmolLM3ForCausalLM,MN as SmolLM3Model,ku as SmolLM3PreTrainedModel,
kN as SmolVLMForConditionalGeneration,y_ as SmolVLMImageProcessor,M_ as SmolVLMProcessor,Aw as SnacDecoderModel,Ew as SnacEncoderModel,
b2 as SnacFeatureExtractor,TN as SnacModel,Xa as SnacPreTrainedModel,AN as SolarOpenForCausalLM,EN as SolarOpenModel,Tu as SolarOpenPreTrainedModel,
M2 as SpeechT5FeatureExtractor,SN as SpeechT5ForSpeechToText,PN as SpeechT5ForTextToSpeech,FN as SpeechT5HifiGan,CN as SpeechT5Model,
Ya as SpeechT5PreTrainedModel,aC as SpeechT5Processor,$E as SpeechT5Tokenizer,LN as SqueezeBertForMaskedLM,NN as SqueezeBertForQuestionAnswering,
ON as SqueezeBertForSequenceClassification,IN as SqueezeBertModel,En as SqueezeBertPreTrainedModel,GE as SqueezeBertTokenizer,
zN as StableLmForCausalLM,DN as StableLmModel,Eu as StableLmPreTrainedModel,RN as Starcoder2ForCausalLM,BN as Starcoder2Model,
Au as Starcoder2PreTrainedModel,gn as StoppingCriteria,_g as StoppingCriteriaList,$N as StyleTextToSpeech2Model,Cw as StyleTextToSpeech2PreTrainedModel,
CD as SummarizationPipeline,Pw as SupertonicForConditionalGeneration,Sw as SupertonicPreTrainedModel,hg as SuppressTokensAtBeginLogitsProcessor,
PC as SuppressTokensLogitsProcessor,qN as Swin2SRForImageSuperResolution,CA as Swin2SRImageProcessor,jN as Swin2SRModel,
Cu as Swin2SRPreTrainedModel,VN as SwinForImageClassification,UN as SwinForSemanticSegmentation,GN as SwinModel,Ka as SwinPreTrainedModel,
HN as T5ForConditionalGeneration,WN as T5Model,Su as T5PreTrainedModel,VE as T5Tokenizer,XN as TableTransformerForObjectDetection,
QN as TableTransformerModel,Fw as TableTransformerObjectDetectionOutput,Pu as TableTransformerPreTrainedModel,BC as TemperatureLogitsWarper,
G as Tensor,Bu as Text2TextGenerationPipeline,MD as TextClassificationPipeline,PD as TextGenerationPipeline,XD as TextStreamer,
ND as TextToAudioPipeline,xD as TokenClassificationPipeline,He as TokenClassifierOutput,ue as TokenizersBackend,hz as TopKLogitsWarper,
dz as TopPLogitsWarper,YN as TrOCRForCausalLM,Iw as TrOCRPreTrainedModel,SD as TranslationPipeline,Mc as UltravoxModel,Kg as UltravoxPreTrainedModel,
oC as UltravoxProcessor,JN as UniSpeechForCTC,ZN as UniSpeechForSequenceClassification,KN as UniSpeechModel,Ja as UniSpeechPreTrainedModel,
s3 as UniSpeechSatForAudioFrameClassification,t3 as UniSpeechSatForCTC,r3 as UniSpeechSatForSequenceClassification,e3 as UniSpeechSatModel,
An as UniSpeechSatPreTrainedModel,UA as VLChatProcessor,tA as VLMImageProcessor,a3 as VaultGemmaForCausalLM,n3 as VaultGemmaModel,
Fu as VaultGemmaPreTrainedModel,SA as ViTFeatureExtractor,l3 as ViTForImageClassification,sg as ViTImageProcessor,c3 as ViTMAEModel,
Lw as ViTMAEPreTrainedModel,d3 as ViTMSNForImageClassification,u3 as ViTMSNModel,Lu as ViTMSNPreTrainedModel,i3 as ViTModel,
Iu as ViTPreTrainedModel,o3 as VisionEncoderDecoderModel,h3 as VitMatteForImageMatting,PA as VitMatteImageProcessor,Ow as VitMattePreTrainedModel,
f3 as VitPoseForPoseEstimation,FA as VitPoseImageProcessor,Nw as VitPosePreTrainedModel,_3 as VitsModel,Dw as VitsModelOutput,
zw as VitsPreTrainedModel,jE as VitsTokenizer,p3 as VoxtralForConditionalGeneration,uC as VoxtralProcessor,T2 as VoxtralRealtimeFeatureExtractor,
Rw as VoxtralRealtimeForConditionalGeneration,Bw as VoxtralRealtimePreTrainedModel,fC as VoxtralRealtimeProcessor,x3 as Wav2Vec2BertForCTC,
k3 as Wav2Vec2BertForSequenceClassification,M3 as Wav2Vec2BertModel,Za as Wav2Vec2BertPreTrainedModel,qE as Wav2Vec2CTCTokenizer,
x2 as Wav2Vec2FeatureExtractor,cI as Wav2Vec2ForAudioFrameClassification,iI as Wav2Vec2ForCTC,lI as Wav2Vec2ForSequenceClassification,
oI as Wav2Vec2Model,Fr as Wav2Vec2PreTrainedModel,_C as Wav2Vec2Processor,pC as Wav2Vec2ProcessorWithLM,S3 as WavLMForAudioFrameClassification,
E3 as WavLMForCTC,A3 as WavLMForSequenceClassification,C3 as WavLMForXVector,T3 as WavLMModel,Rs as WavLMPreTrainedModel,
k2 as WeSpeakerFeatureExtractor,P3 as WeSpeakerResNetModel,Gw as WeSpeakerResNetPreTrainedModel,E2 as WhisperFeatureExtractor,
Vw as WhisperForConditionalGeneration,I3 as WhisperModel,Ou as WhisperPreTrainedModel,mC as WhisperProcessor,xz as WhisperTextStreamer,
FC as WhisperTimeStampLogitsProcessor,YE as WhisperTokenizer,B3 as XLMForQuestionAnswering,D3 as XLMForSequenceClassification,
z3 as XLMForTokenClassification,O3 as XLMModel,$s as XLMPreTrainedModel,$3 as XLMRobertaForMaskedLM,U3 as XLMRobertaForQuestionAnswering,
G3 as XLMRobertaForSequenceClassification,V3 as XLMRobertaForTokenClassification,R3 as XLMRobertaModel,Gs as XLMRobertaPreTrainedModel,
KE as XLMRobertaTokenizer,JE as XLMTokenizer,N3 as XLMWithLMHeadModel,$w as XVectorOutput,IA as YolosFeatureExtractor,q3 as YolosForObjectDetection,
ng as YolosImageProcessor,j3 as YolosModel,Uw as YolosObjectDetectionOutput,Nu as YolosPreTrainedModel,H3 as YoutuForCausalLM,
W3 as YoutuModel,Du as YoutuPreTrainedModel,X3 as ZayaForCausalLM,Q3 as ZayaModel,zu as ZayaPreTrainedModel,LD as ZeroShotAudioClassificationPipeline,
FD as ZeroShotClassificationPipeline,RD as ZeroShotImageClassificationPipeline,GD as ZeroShotObjectDetectionPipeline,Oe as cat,
oz as cos_sim,PT as dot,we as env,ct as full,xi as full_like,wm as interpolate,Rt as interpolate_4d,lz as layer_norm,t2 as load_audio,
uz as load_image,kz as load_video,ST as log_softmax,YT as matmul,ol as mean,KT as mean_pooling,_t as ones,ll as ones_like,
XT as permute,Mz as pipeline,ZT as quantize_embeddings,cz as rand,JT as randn,Fa as random,r2 as read_audio,iz as rfft,vm as slice,
st as softmax,ur as stack,ym as std_mean,As as topk,bm as zeros,cl as zeros_like};

/*!
 * ONNX Runtime Web v1.31.0-dev.20260914-8d85527a0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Ii=Object.defineProperty,N0=Object.getOwnPropertyDescriptor,D0=Object.getOwnPropertyNames,z0=Object.prototype.hasOwnProperty,
B0=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){
if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),
ge=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(n){throw r=[n],n}},ds=(e,t)=>{for(var r in t)Ii(e,r,{get:t[r],
enumerable:!0})},R0=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of D0(t))!z0.call(e,s)&&s!==r&&
Ii(e,s,{get:()=>t[s],enumerable:!(n=N0(t,s))||n.enumerable});return e},oa=e=>R0(Ii({},"__esModule",{value:!0}),e),Xn,gr,
qr,Zh,z_,B_=ge(()=>{"use strict";Xn=new Map,gr=[],qr=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler==
"function"){let n=Xn.get(e);if(n===void 0)Xn.set(e,{backend:t,priority:r});else{if(n.priority>r)return;if(n.priority===r&&
n.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let s=gr.indexOf(e);s!==-1&&
gr.splice(s,1);for(let a=0;a<gr.length;a++)if(Xn.get(gr[a]).priority<=r){gr.splice(a,0,e);return}gr.push(e)}return}throw new TypeError(
"not a valid backend")},Zh=async e=>{let t=Xn.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;
if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.
initialized=!0,t.backend}catch(n){return r||(t.error=`${n}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},z_=async e=>{
let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),n=r.length===0?gr:r,s,a=[],o=new Set;for(let l of n){
let c=await Zh(l);typeof c=="string"?a.push({name:l,err:c}):(s||(s=c),s===c&&o.add(l))}if(!s)throw new Error(`no availab\
le backend found. ERR: ${a.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:c}of a)r.includes(l)&&console.
warn(`removing requested execution provider "${l}" from session options because it is not available: ${c}`);let i=t.filter(
l=>o.has(typeof l=="string"?l:l.name));return[s,new Proxy(e,{get:(l,c)=>c==="executionProviders"?i:Reflect.get(l,c)})]}}),
$0=ge(()=>{"use strict";B_()}),R_,G0=ge(()=>{"use strict";R_="1.31.0-dev.20260911-2a43ec07e"}),Po,Je,$_=ge(()=>{"use str\
ict";G0(),Po="warning",Je={wasm:{},webgl:{},webgpu:{},versions:{common:R_},set logLevel(e){if(e!==void 0){if(typeof e!="\
string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);
Po=e}},get logLevel(){return Po}},Object.defineProperty(Je,"logLevel",{enumerable:!0})}),ze,V0=ge(()=>{"use strict";$_(),
ze=Je}),G_,V_,U0=ge(()=>{"use strict";G_=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(
1,1);r.width=e.dims[3],r.height=e.dims[2];let n=r.getContext("2d");if(n!=null){let s,a;t?.tensorLayout!==void 0&&t.tensorLayout===
"NHWC"?(s=e.dims[2],a=e.dims[3]):(s=e.dims[3],a=e.dims[2]);let o=t?.format!==void 0?t.format:"RGB",i=t?.norm,l,c;i===void 0||
i.mean===void 0?l=[255,255,255,255]:typeof i.mean=="number"?l=[i.mean,i.mean,i.mean,i.mean]:(l=[i.mean[0],i.mean[1],i.mean[2],
0],i.mean[3]!==void 0&&(l[3]=i.mean[3])),i===void 0||i.bias===void 0?c=[0,0,0,0]:typeof i.bias=="number"?c=[i.bias,i.bias,
i.bias,i.bias]:(c=[i.bias[0],i.bias[1],i.bias[2],0],i.bias[3]!==void 0&&(c[3]=i.bias[3]));let d=a*s,h=0,_=d,p=d*2,w=-1;o===
"RGBA"?(h=0,_=d,p=d*2,w=d*3):o==="RGB"?(h=0,_=d,p=d*2):o==="RBG"&&(h=0,p=d,_=d*2);for(let v=0;v<a;v++)for(let y=0;y<s;y++){
let b=(e.data[h++]-c[0])*l[0],k=(e.data[_++]-c[1])*l[1],A=(e.data[p++]-c[2])*l[2],E=w===-1?255:(e.data[w++]-c[3])*l[3];n.
fillStyle="rgba("+b+","+k+","+A+","+E+")",n.fillRect(y,v,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("t\
oDataURL is not supported")}else throw new Error("Can not access image data")},V_=(e,t)=>{let r=typeof document<"u"?document.
createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),n;if(r!=null){let s,a,o;t?.tensorLayout!==
void 0&&t.tensorLayout==="NHWC"?(s=e.dims[2],a=e.dims[1],o=e.dims[3]):(s=e.dims[3],a=e.dims[2],o=e.dims[1]);let i=t!==void 0&&
t.format!==void 0?t.format:"RGB",l=t?.norm,c,d;l===void 0||l.mean===void 0?c=[255,255,255,255]:typeof l.mean=="number"?c=
[l.mean,l.mean,l.mean,l.mean]:(c=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(c[3]=l.mean[3])),l===void 0||l.
bias===void 0?d=[0,0,0,0]:typeof l.bias=="number"?d=[l.bias,l.bias,l.bias,l.bias]:(d=[l.bias[0],l.bias[1],l.bias[2],0],l.
bias[3]!==void 0&&(d[3]=l.bias[3]));let h=a*s;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!=="RGBA"||o===3&&t.format!==
"RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let _=4,p=0,w=1,v=2,y=3,b=0,k=h,
A=h*2,E=-1;i==="RGBA"?(b=0,k=h,A=h*2,E=h*3):i==="RGB"?(b=0,k=h,A=h*2):i==="RBG"&&(b=0,A=h,k=h*2),n=r.createImageData(s,a);
for(let C=0;C<a*s;p+=_,w+=_,v+=_,y+=_,C++)n.data[p]=(e.data[b++]-d[0])*c[0],n.data[w]=(e.data[k++]-d[1])*c[1],n.data[v]=
(e.data[A++]-d[2])*c[2],n.data[y]=E===-1?255:(e.data[E++]-d[3])*c[3]}else throw new Error("Can not access image data");return n}}),
Us,U_,j_,q_,W_,H_,j0=ge(()=>{"use strict";Li(),Us=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");
if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NH\
WC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:n}=t,s=t.norm??{mean:255,bias:0},a,o;typeof s.
mean=="number"?a=[s.mean,s.mean,s.mean,s.mean]:a=[s.mean[0],s.mean[1],s.mean[2],s.mean[3]??255],typeof s.bias=="number"?
o=[s.bias,s.bias,s.bias,s.bias]:o=[s.bias[0],s.bias[1],s.bias[2],s.bias[3]??0];let i=t.format!==void 0?t.format:"RGBA",l=t.
tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",c=r*n,d=l==="RGBA"?new Float32Array(c*4):new Float32Array(
c*3),h=4,_=0,p=1,w=2,v=3,y=0,b=c,k=c*2,A=-1;i==="RGB"&&(h=3,_=0,p=1,w=2,v=-1),l==="RGBA"?A=c*3:l==="RBG"?(y=0,k=c,b=c*2):
l==="BGR"&&(k=0,b=c,y=c*2);for(let E=0;E<c;E++,_+=h,w+=h,p+=h,v+=h)d[y++]=(e[_]+o[0])/a[0],d[b++]=(e[p]+o[1])/a[1],d[k++]=
(e[w]+o[2])/a[2],A!==-1&&v!==-1&&(d[A++]=(e[v]+o[3])/a[3]);return l==="RGBA"?new yt("float32",d,[1,4,r,n]):new yt("float\
32",d,[1,3,r,n])},U_=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,n=typeof ImageData<"u"&&
e instanceof ImageData,s=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",o,i=t??{},l=()=>{if(typeof document<
"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error(
"Canvas is not supported")},c=d=>typeof HTMLCanvasElement<"u"&&d instanceof HTMLCanvasElement||d instanceof OffscreenCanvas?
d.getContext("2d"):null;if(r){let d=l();d.width=e.width,d.height=e.height;let h=c(d);if(h!=null){let _=e.height,p=e.width;
if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(_=t.resizedHeight,p=t.resizedWidth),t!==void 0){if(i=
t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");i.tensorFormat=
"RGBA",i.height=_,i.width=p}else i.tensorFormat="RGBA",i.height=_,i.width=p;h.drawImage(e,0,0),o=h.getImageData(0,0,p,_).
data}else throw new Error("Can not access image data")}else if(n){let d,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==
void 0?(d=t.resizedHeight,h=t.resizedWidth):(d=e.height,h=e.width),t!==void 0&&(i=t),i.format="RGBA",i.height=d,i.width=
h,t!==void 0){let _=l();_.width=h,_.height=d;let p=c(_);if(p!=null)p.putImageData(e,0,0),o=p.getImageData(0,0,h,d).data;else
throw new Error("Can not access image data")}else o=e.data}else if(s){if(t===void 0)throw new Error("Please provide imag\
e config with format for Imagebitmap");let d=l();d.width=e.width,d.height=e.height;let h=c(d);if(h!=null){let _=e.height,
p=e.width;return h.drawImage(e,0,0,p,_),o=h.getImageData(0,0,p,_).data,i.height=_,i.width=p,Us(o,i)}else throw new Error(
"Can not access image data")}else{if(a)return new Promise((d,h)=>{let _=l(),p=c(_);if(!e||!p)return h();let w=new Image;
w.crossOrigin="Anonymous",w.src=e,w.onload=()=>{_.width=w.width,_.height=w.height,p.drawImage(w,0,0,_.width,_.height);let v=p.
getImageData(0,0,_.width,_.height);i.height=_.height,i.width=_.width,d(Us(v.data,i))}});throw new Error("Input data prov\
ided is not supported - aborted tensor creation")}if(o!==void 0)return Us(o,i);throw new Error("Input data provided is n\
ot supported - aborted tensor creation")},j_=(e,t)=>{let{width:r,height:n,download:s,dispose:a}=t,o=[1,n,r,4];return new yt(
{location:"texture",type:"float32",texture:e,dims:o,download:s,dispose:a})},q_=(e,t)=>{let{dataType:r,dims:n,download:s,
dispose:a}=t;return new yt({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:n,download:s,dispose:a})},W_=(e,t)=>{
let{dataType:r,dims:n,download:s,dispose:a}=t;return new yt({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:n,download:s,
dispose:a})},H_=(e,t,r)=>new yt({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Vr,es,Fo,Q_,q0=ge(()=>{"use \
strict";Vr=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],
["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),
es=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],
[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Fo=!1,Q_=()=>{if(!Fo){Fo=!0;let e=typeof BigInt64Array<
"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,n=typeof r<"u"&&r.from;
e&&(Vr.set("int64",BigInt64Array),es.set(BigInt64Array,"int64")),t&&(Vr.set("uint64",BigUint64Array),es.set(BigUint64Array,
"uint64")),n?(Vr.set("float16",r),es.set(r,"float16")):Vr.set("float16",Uint16Array)}}}),X_,Y_,W0=ge(()=>{"use strict";Li(),
X_=e=>{let t=1;for(let r=0;r<e.length;r++){let n=e[r];if(typeof n!="number"||!Number.isSafeInteger(n))throw new TypeError(
`dims[${r}] must be an integer, got: ${n}`);if(n<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got:\
 ${n}`);t*=n}return t},Y_=(e,t)=>{switch(e.location){case"cpu":return new yt(e.type,e.data,t);case"cpu-pinned":return new yt(
{location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new yt({location:"texture",texture:e.texture,
type:e.type,dims:t});case"gpu-buffer":return new yt({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"\
ml-tensor":return new yt({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorR\
eshape: tensor location ${e.location} is not supported`)}}}),yt,Li=ge(()=>{"use strict";U0(),j0(),q0(),W0(),yt=class{constructor(e,t,r){
Q_();let n,s;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,n=e.type,s=e.dims,e.location){case"\
cpu-pinned":{let o=Vr.get(n);if(!o)throw new TypeError(`unsupported type "${n}" to create tensor from pinned buffer`);if(!(e.
data instanceof o))throw new TypeError(`buffer should be of type ${o.name}`);this.cpuData=e.data;break}case"texture":{if(n!==
"float32")throw new TypeError(`unsupported type "${n}" to create tensor from texture`);this.gpuTextureData=e.texture,this.
downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(n!=="float32"&&n!=="float16"&&n!=="int32"&&n!==
"int64"&&n!=="uint32"&&n!=="uint8"&&n!=="bool"&&n!=="uint4"&&n!=="int4")throw new TypeError(`unsupported type "${n}" to \
create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"\
ml-tensor":{if(n!=="float32"&&n!=="float16"&&n!=="int32"&&n!=="int64"&&n!=="uint32"&&n!=="uint64"&&n!=="int8"&&n!=="uint\
8"&&n!=="bool"&&n!=="uint4"&&n!=="int4")throw new TypeError(`unsupported type "${n}" to create tensor from MLTensor`);this.
mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constru\
ctor: unsupported location '${this.dataLocation}'`)}else{let o,i;if(typeof e=="string")if(n=e,i=r,e==="string"){if(!Array.
isArray(t))throw new TypeError("A string tensor's data must be a string array.");o=t}else{let l=Vr.get(e);if(l===void 0)
throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||
e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);
e==="uint64"||e==="int64"?o=l.from(t,BigInt):o=l.from(t)}else if(t instanceof l)o=t;else if(t instanceof Uint8ClampedArray)
if(e==="uint8")o=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e===
"float16"&&t instanceof Uint16Array&&l!==Uint16Array)o=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(
`A ${n} tensor's data must be type of ${l}`)}else if(i=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor t\
ype cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")n="string",o=e;else if(l==="boolean")n="\
bool",o=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)
n="uint8",o=Uint8Array.from(e);else{let l=es.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for \
tensor data: ${e.constructor}.`);n=l,o=e}if(i===void 0)i=[o.length];else if(!Array.isArray(i))throw new TypeError("A ten\
sor's dims must be a number array");s=i,this.cpuData=o,this.dataLocation="cpu"}let a=X_(s);if(this.cpuData&&a!==this.cpuData.
length&&!((n==="uint4"||n==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not\
 match data length(${this.cpuData.length}).`);this.type=n,this.dims=s,this.size=a}static async fromImage(e,t){return U_(
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
let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],n=!1;for(let s=0;s<r.length;s++){if(n&&!r[s].includes("TRACE_FUNC")){let a=`\
FUNC_${e}::${r[s].trim().split(" ")[1]}`;t&&(a+=`::${t}`),ia("CPU",a);return}r[s].includes("TRACE_FUNC")&&(n=!0)}},Hr=e=>{
(typeof Je.trace>"u"?!Je.wasm.trace:!Je.trace)||Io("BEGIN",e)},Qr=e=>{(typeof Je.trace>"u"?!Je.wasm.trace:!Je.trace)||Io(
"END",e)},Er=e=>{(typeof Je.trace>"u"?!Je.wasm.trace:!Je.trace)||console.time(`ORT::${e}`)},Ar=e=>{(typeof Je.trace>"u"?
!Je.wasm.trace:!Je.trace)||console.timeEnd(`ORT::${e}`)}}),Z_,H0=ge(()=>{"use strict";B_(),K_(),J_(),Z_=class ep{constructor(t){
this.handler=t}async run(t,r,n){Hr(),Er("InferenceSession.run");let s={},a={};if(typeof t!="object"||t===null||t instanceof
Lt||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corres\
ponding values.");let o=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be nul\
l.");if(r instanceof Lt)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError(
"'fetches' cannot be an empty array.");o=!1;for(let c of r){if(typeof c!="string")throw new TypeError("'fetches' must be\
 a string array or an object.");if(this.outputNames.indexOf(c)===-1)throw new RangeError(`'fetches' contains invalid out\
put name: ${c}.`);s[c]=null}if(typeof n=="object"&&n!==null)a=n;else if(typeof n<"u")throw new TypeError("'options' must\
 be an object.")}else{let c=!1,d=Object.getOwnPropertyNames(r);for(let h of this.outputNames)if(d.indexOf(h)!==-1){let _=r[h];
(_===null||_ instanceof Lt)&&(c=!0,o=!1,s[h]=_)}if(c){if(typeof n=="object"&&n!==null)a=n;else if(typeof n<"u")throw new TypeError(
"'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fet\
ches' or 'options'.");for(let c of this.inputNames)if(typeof t[c]>"u")throw new Error(`input '${c}' is missing in 'feeds\
'.`);if(o)for(let c of this.outputNames)s[c]=null;let i=await this.handler.run(t,s,a),l={};for(let c in i)if(Object.hasOwnProperty.
call(i,c)){let d=i[c];d instanceof Lt?l[c]=d:l[c]=new Lt(d.type,d.data,d.dims)}return Ar("InferenceSession.run"),Qr(),l}async release(){
return this.handler.dispose()}static async create(t,r,n,s){Hr(),Er("InferenceSession.create");let a,o={};if(typeof t=="s\
tring"){if(a=t,typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof
Uint8Array){if(a=t,typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an objec\
t.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let d=t,h=0,_=t.byteLength;
if(typeof r=="object"&&r!==null)o=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'b\
yteOffset' must be an integer.");if(h<0||h>=d.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${d.byteLength}\
).`);if(_=t.byteLength-h,typeof n=="number"){if(_=n,!Number.isSafeInteger(_))throw new RangeError("'byteLength' must be \
an integer.");if(_<=0||h+_>d.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${d.byteLength-h}].`);if(typeof s==
"object"&&s!==null)o=s;else if(typeof s<"u")throw new TypeError("'options' must be an object.")}else if(typeof n<"u")throw new TypeError(
"'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(
d,h,_)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[i,l]=await z_(o),c=await i.createInferenceSessionHandler(
a,l);return Ar("InferenceSession.create"),Qr(),new ep(c)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.
handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){
return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Oi,Q0=ge(()=>{"use strict";
H0(),Oi=Z_}),X0=ge(()=>{"use strict"}),Y0=ge(()=>{"use strict"}),K0=ge(()=>{"use strict"}),J0=ge(()=>{"use strict"}),tp={};
ds(tp,{InferenceSession:()=>Oi,TRACE:()=>ia,TRACE_EVENT_BEGIN:()=>Er,TRACE_EVENT_END:()=>Ar,TRACE_FUNC_BEGIN:()=>Hr,TRACE_FUNC_END:()=>Qr,
Tensor:()=>Lt,env:()=>ze,registerBackend:()=>qr});var Xr=ge(()=>{"use strict";$0(),V0(),Q0(),K_(),X0(),Y0(),J_(),K0(),J0()}),
Ni=ge(()=>{"use strict"}),rp={};ds(rp,{default:()=>np});var Lo,Oo,np,Z0=ge(()=>{"use strict";wp(),Yr(),Di(),Lo="ort-wasm\
-proxy-worker",Oo=globalThis.self?.name===Lo,Oo&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-was\
m":zi(r.wasm).then(()=>{Vi(r).then(()=>{postMessage({type:t})},n=>{postMessage({type:t,err:n})})},n=>{postMessage({type:t,
err:n})});break;case"init-ep":{let{epName:n,env:s}=r;Ui(s,n).then(()=>{postMessage({type:t})},a=>{postMessage({type:t,err:a})});
break}case"copy-from":{let{buffer:n}=r,s=ua(n);postMessage({type:t,out:s});break}case"create":{let{model:n,options:s}=r;
ji(n,s).then(a=>{postMessage({type:t,out:a})},a=>{postMessage({type:t,err:a})});break}case"release":qi(r),postMessage({type:t});
break;case"run":{let{sessionId:n,inputIndices:s,inputs:a,outputIndices:o,options:i}=r;Wi(n,s,a,o,new Array(o.length).fill(
null),i).then(l=>{l.some(c=>c[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage(
{type:t,out:l},Qi([...a,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":Hi(r),postMessage({type:t});
break;default:}}catch(n){postMessage({type:t,err:n})}}),np=Oo?null:e=>new Worker(e??gt,{type:"module",name:Lo})}),sp={};
ds(sp,{default:()=>ap});async function ef(e={}){var t=e,r=!!globalThis.window,n=!!globalThis.WorkerGlobalScope,s=n&&self.
name?.startsWith("em-pthread");t.mountExternalData=(u,f)=>{u.startsWith("./")&&(u=u.substring(2)),(t.ed||(t.ed=new Map)).
set(u,f)},t.unmountExternalData=()=>{delete t.ed,delete t.Te,delete t.Se,delete t.Ue},globalThis.SharedArrayBuffer??new WebAssembly.
Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let a=()=>{let u=f=>(...m)=>{let g=Ht;return m=f(...m),Ht!=g?
new Promise((x,T)=>{uo={resolve:x,reject:T}}):m};(()=>{for(let f of["_OrtAppendExecutionProvider","_OrtCreateSession","_\
OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[f]=u(t[f])})(),typeof jsepRunAsync<"u"&&(t._OrtRun=jsepRunAsync(t._OrtRun),
t._OrtRunWithBinding=jsepRunAsync(t._OrtRunWithBinding)),a=void 0};t.asyncInit=()=>{a?.()};var o,i,l=(u,f)=>{throw f},c=import.meta.
url,d="";if(r||n){try{d=new URL(".",c).href}catch{}n&&(i=u=>{var f=new XMLHttpRequest;return f.open("GET",u,!1),f.responseType=
"arraybuffer",f.send(null),new Uint8Array(f.response)}),o=async u=>{if(N(u))return new Promise((m,g)=>{var x=new XMLHttpRequest;
x.open("GET",u,!0),x.responseType="arraybuffer",x.onload=()=>{x.status==200||x.status==0&&x.response?m(x.response):g(x.status)},
x.onerror=g,x.send(null)});var f=await fetch(u,{credentials:"same-origin"});if(f.ok)return f.arrayBuffer();throw Error(f.
status+" : "+f.url)}}var h,_,p,w,v,y,b=console.log.bind(console),k=console.error.bind(console),A=b,E=k,C=!1,N=u=>u.startsWith(
"file://");function M(){pr.buffer!=R.buffer&&O()}if(s){let u=function(f){try{var m=f.data,g=m.$c;if(g==="load"){let x=[];
self.onmessage=T=>x.push(T),y=()=>{postMessage({$c:"loaded"});for(let T of x)u(T);self.onmessage=u};for(let T of m.ue)t[T]&&
!t[T].proxy||(t[T]=(...P)=>{postMessage({$c:"callHandler",te:T,args:P})},T=="print"&&(A=t[T]),T=="printErr"&&(E=t[T]));pr=
m.Me,O(),_=m.Ne,qe(),Vs()}else if(g==="run"){(function(x){var T=(M(),I)[x+52>>>2>>>0];x=(M(),I)[x+56>>>2>>>0],ih(T,T-x),
ee(T)})(m.Xc),xo(m.Xc,0,0,1,0,0),Gu(),io(m.Xc),$||(Vd(),$=!0);try{Ev(m.ze,m.kd)}catch(x){if(x!="unwind")throw x}}else m.
target!=="setimmediate"&&(g==="checkMailbox"?$&&Is():g&&(E(`worker: received unknown command ${g}`),E(m)))}catch(x){throw rh(),
x}};var $=!1;self.onunhandledrejection=f=>{throw f.reason||f},self.onmessage=u}var R,j,Y,Q,z,I,U,X,ce,Z,ne,L=!1;function O(){
var u=pr.buffer;t.HEAP8=R=new Int8Array(u),Y=new Int16Array(u),t.HEAPU8=j=new Uint8Array(u),Q=new Uint16Array(u),t.HEAP32=
z=new Int32Array(u),t.HEAPU32=I=new Uint32Array(u),U=new Float32Array(u),X=new Float64Array(u),ce=new BigInt64Array(u),Z=
new BigUint64Array(u)}function V(){L=!0,s?y():ir.hc()}function se(u){throw E(u="Aborted("+u+")"),C=!0,u=new WebAssembly.
RuntimeError(u+". Build with -sASSERTIONS for more info."),v?.(u),u}function ae(){return{a:{qa:Qb,f:Av,K:Cv,k:Sv,p:Pv,l:Fv,
fa:Iv,b:Lv,da:Ov,gc:Hu,q:Nv,ea:Ku,Ua:Ju,cc:Zu,ec:ed,Va:td,Sa:rd,La:nd,Ra:sd,oa:ad,dc:od,ac:id,Ta:ld,bc:cd,_a:Dv,Ba:zv,Xb:Bv,
Vb:$v,Aa:Vv,O:Uv,J:jv,Wb:qv,ka:Jv,Yb:Zv,Oa:ey,_b:ry,Ea:ny,Tb:sy,Ca:ay,Na:io,Xa:oy,U:uy,n:py,c:ao,qb:my,w:gy,N:wy,A:vy,j:yy,
o:gd,rb:by,H:My,T:xy,g:ky,u:Ty,m:Ey,i:Ay,Ia:Cy,Ja:Sy,Ka:Py,Ga:bd,Ha:Md,Ub:xd,ab:Iy,Za:Oy,Z:Ny,pb:Dy,Da:zy,Ya:Ly,X:By,Wa:Ry,
$b:$y,G:Fy,db:Gy,_:Vy,pa:zs,Zb:jy,cb:Uy,bb:qy,lb:sb,z:ab,sa:ob,ra:ib,nb:lb,Y:cb,v:ub,kb:db,jb:hb,ib:fb,mb:_b,gb:pb,fb:mb,
eb:gb,Pa:Od,Qa:Nd,fc:tn,W:Dd,Fa:zd,ma:Bd,Ma:Rd,la:$d,Fb:I0,va:E0,Gb:F0,wa:T0,E:h0,e:Jb,r:Yb,x:Xb,C:l0,Ib:M0,ca:b0,D:t0,xa:x0,
aa:A0,ha:y0,Jb:v0,Kb:w0,za:_0,Lb:m0,ya:g0,Mb:p0,ua:P0,ba:k0,d:Kb,B:e0,s:Zb,Eb:L0,t:n0,y:u0,F:r0,I:s0,L:d0,Nb:f0,R:C0,ia:i0,
$:S0,Pb:o0,Rb:a0,Ob:c0,h:vb,a:pr,$a:en,Hb:yb,V:bb,M:Mb,na:xb,Db:kb,ja:Tb,S:Eb,Ab,Bb:Cb,vb:Sb,wb:Pb,P:Fb,xb:Ib,yb:Lb,ta:Ob,
Sb:Nb,ob:Db,Q:zb,hb:Bb,Cb:Rb,sb:$b,tb:Vb,ub:Ub,ga:jb,zb:qb,Qb:Wb}}}async function qe(){function u(g,x){var T=ir=g.exports;
g={};for(let[P,S]of Object.entries(T))typeof S=="function"?(T=iy(S),g[P]=T):g[P]=S;return ir=g,ir=(function(){var P=ir,S=q=>H=>q(
H)>>>0,D=q=>()=>q()>>>0;return(P=Object.assign({},P)).ic=S(P.ic),P.Nc=D(P.Nc),P.Pc=S(P.Pc),P.Bd=(q=>(H,re)=>q(H,re)>>>0)(
P.Bd),P.Gd=S(P.Gd),P.Hd=D(P.Hd),P.Ld=S(P.Ld),P})(),Ru.push(ir.sd),Gd=(g=ir).ic,Vd=g.jc,t._OrtInit=g.kc,t._OrtGetLastError=
g.lc,t._OrtCreateSessionOptions=g.mc,t._OrtAppendExecutionProvider=g.nc,t._OrtAddFreeDimensionOverride=g.oc,t._OrtAddSessionConfigEntry=
g.pc,t._OrtReleaseSessionOptions=g.qc,t._OrtCreateSession=g.rc,t._OrtReleaseSession=g.sc,t._OrtGetInputOutputCount=g.tc,
t._OrtGetInputOutputMetadata=g.uc,t._OrtFree=g.vc,t._OrtCreateTensor=g.wc,t._OrtGetTensorData=g.xc,t._OrtReleaseTensor=g.
yc,t._OrtCreateRunOptions=g.zc,t._OrtAddRunConfigEntry=g.Ac,t._OrtReleaseRunOptions=g.Bc,t._OrtCreateBinding=g.Cc,t._OrtBindInput=
g.Dc,t._OrtBindOutput=g.Ec,t._OrtClearBoundOutputs=g.Fc,t._OrtReleaseBinding=g.Gc,t._OrtRunWithBinding=g.Hc,t._OrtRun=g.
Ic,t._OrtEndProfiling=g.Jc,Ud=t._OrtCreateWebGpuInstance=g.Kc,t._wgpuCreateInstance=g.Lc,go=t._OrtGetWebGpuDevice=g.Mc,$s=
g.Nc,kt=t._free=g.Oc,Nr=t._malloc=g.Pc,jd=t._wgpuBufferRelease=g.Qc,qd=g.Rc,Wd=g.Sc,Hd=g.Tc,Qd=g.Uc,Xd=g.Vc,Yd=g.Yc,Kd=g.
Zc,Jd=g.hd,Zd=g.id,eh=g.jd,wo=g.ld,vo=g.md,yo=g.nd,bo=g.od,Wn=g.pd,Mo=g.qd,th=g.rd,xo=g.ud,rh=g.vd,nh=g.wd,sh=g.xd,ko=g.
yd,ah=g.zd,oh=g.Ad,To=g.Bd,_e=g.Cd,Hn=g.Dd,ih=g.Ed,ee=g.Fd,Gs=g.Gd,te=g.Hd,lh=g.Id,Eo=g.Jd,ch=g.Kd,uh=g.Ld,dh=g.Md,Ao=g.
Nd,hh=g.Od,fh=g.Pd,_h=g.Qd,ph=g.Rd,mh=g.Sd,gh=g.Td,wh=g.Ud,vh=g.Vd,yh=g.Wd,bh=g.Xd,Mh=g.Yd,xh=g.Zd,kh=g._d,Th=g.$d,Eh=g.
ae,Ah=g.be,Ch=g.ce,Sh=g.de,Ph=g.fe,Fh=g.ge,Ih=g.he,Lh=g.ie,Oh=g.je,Nh=g.ke,Dh=g.le,zh=g.me,Bh=g.Ae,Rh=g.Be,$h=g.Ce,Gh=g.
De,Vh=g.Ee,Uh=g.Fe,jh=g.Ge,qh=g.He,Wh=g.Ie,Hh=g.Je,Qh=g.Ke,Xh=g.nf,Yh=g.of,Kh=g.pf,Jh=g.qf,_=x,ir}var f,m=ae();return t.
instantiateWasm?new Promise(g=>{t.instantiateWasm(m,(x,T)=>{g(u(x,T))})}):s?u(new WebAssembly.Instance(_,ae()),_):(ne??=
t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.asyncify.wasm",d):d+"ort-wasm-simd-threaded.asyncify.wasm":
new URL(""+new URL("ort-wasm-simd-threaded.asyncify-CxOG5pUO.wasm",import.meta.url).href,import.meta.url).href,f=await(async function(g){
var x=ne;if(!h&&!N(x))try{var T=fetch(x,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(T,g)}catch(P){
E(`wasm streaming compile failed: ${P}`),E("falling back to ArrayBuffer instantiation")}return(async function(P,S){try{var D=await(async function(q){
if(!h)try{var H=await o(q);return new Uint8Array(H)}catch{}if(q==ne&&h)q=new Uint8Array(h);else{if(!i)throw"both async a\
nd sync fetching of the wasm failed";q=i(q)}return q})(P);return await WebAssembly.instantiate(D,S)}catch(q){E(`failed t\
o asynchronously prepare wasm: ${q}`),se(q)}})(x,g)})(m),u(f.instance,f.module))}class Ee{name="ExitStatus";constructor(f){
this.message=`Program terminated with exit(${f})`,this.status=f}}var Ae=u=>{u.terminate(),u.onmessage=()=>{}},$e=[],Fe=0,
ye=null,it=u=>{_r.length==0&&(Uu(),Vu(_r[0]));var f=_r.pop();if(!f)return 6;jn.push(f),Ir[u.Xc]=f,f.Xc=u.Xc;var m={$c:"r\
un",ze:u.ye,kd:u.kd,Xc:u.Xc};return f.postMessage(m,u.oe),0},be=0,Me=(u,f,...m)=>{var g,x=16*m.length,T=te(),P=Gs(x),S=P>>>
3;for(g of m)typeof g=="bigint"?((M(),ce)[S++>>>0]=1n,(M(),ce)[S++>>>0]=g):((M(),ce)[S++>>>0]=0n,(M(),X)[S++>>>0]=g);return u=
nh(u,0,x,P,f),ee(T),u};function en(u){if(s)return Me(0,1,u);if(p=u,!(0<be)){for(var f of jn)Ae(f);for(f of _r)Ae(f);_r=[],
jn=[],Ir={},C=!0}l(0,new Ee(u))}function Un(u){if(s)return Me(1,0,u);tn(u)}var tn=u=>{if(p=u,s)throw Un(u),"unwind";en(u)},
_r=[],jn=[],Ru=[],Ir={},$u=u=>{var f=u.Xc;delete Ir[f],_r.push(u),jn.splice(jn.indexOf(u),1),u.Xc=0,sh(f)};function Gu(){
Ru.forEach(u=>u())}var Vu=u=>new Promise(f=>{u.onmessage=x=>{var T=x.data;if(x=T.$c,T.gd&&T.gd!=$s()){var P=Ir[T.gd];P?P.
postMessage(T,T.oe):E(`Internal error! Worker sent a message "${x}" to target pthread ${T.gd}, but that thread no longer\
 exists!`)}else x==="checkMailbox"?Is():x==="spawnThread"?it(T):x==="cleanupThread"?dt(()=>{$u(Ir[T.Le])}):x==="loaded"?
(u.loaded=!0,f(u)):T.target==="setimmediate"?u.postMessage(T):x==="uncaughtException"?u.onerror(T.error):x==="callHandle\
r"?t[T.te](...T.args):x&&E(`worker sent an unknown command ${x}`)},u.onerror=x=>{throw E(`worker sent an error! ${x.filename}\
:${x.lineno}: ${x.message}`),x};var m,g=[];for(m of[])t.propertyIsEnumerable(m)&&g.push(m);u.postMessage({$c:"load",ue:g,
Me:pr,Ne:_})});function Uu(){var u=new Worker((()=>{let f=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new f(
"ort.webgpu.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"e\
m-pthread"});_r.push(u)}var pr,Ev=(u,f)=>{be=0,u=Ao(u,f),0<be?p=u:ko(u)},Ps=[],Fs=0,et=u=>-9007199254740992>u||9007199254740992<
u?NaN:Number(u);function Av(u){var f=new to(u>>>=0);return(M(),R)[f.ad+12>>>0]==0&&(ju(f,!0),Fs--),qu(f,!1),Ps.push(f),uh(
u)}var rn=0,Cv=()=>{_e(0,0);var u=Ps.pop();lh(u.td),rn=0};function ju(u,f){f=f?1:0,(M(),R)[u.ad+12>>>0]=f}function qu(u,f){
f=f?1:0,(M(),R)[u.ad+13>>>0]=f}class to{constructor(f){this.td=f,this.ad=f-24}}var ro=u=>{var f=rn;if(!f)return Hn(0),0;
var m=new to(f);(M(),I)[m.ad+16>>>2>>>0]=f;var g=(M(),I)[m.ad+4>>>2>>>0];if(!g)return Hn(0),f;for(var x of u){if(x===0||
x===g)break;if(ch(x,g,m.ad+16))return Hn(x),f}return Hn(g),f};function Sv(){return ro([])}function Pv(u){return ro([u>>>
0])}function Fv(u,f,m,g){return ro([u>>>0,f>>>0,m>>>0,g>>>0])}var Iv=()=>{var u=Ps.pop();u||se("no exception to throw");
var f=u.td;throw(M(),R)[u.ad+13>>>0]==0&&(Ps.push(u),qu(u,!0),ju(u,!1),Fs++),Eo(f),rn=f};function Lv(u,f,m){var g=new to(
u>>>=0);throw f>>>=0,m>>>=0,(M(),I)[g.ad+16>>>2>>>0]=0,(M(),I)[g.ad+4>>>2>>>0]=f,(M(),I)[g.ad+8>>>2>>>0]=m,Eo(u),Fs++,rn=
u}var Ov=()=>Fs;function Wu(u,f,m,g){return s?Me(2,1,u,f,m,g):Hu(u,f,m,g)}function Hu(u,f,m,g){if(u>>>=0,f>>>=0,m>>>=0,g>>>=
0,!globalThis.SharedArrayBuffer)return 6;var x=[];return s&&x.length===0?Wu(u,f,m,g):(u={ye:m,Xc:u,kd:g,oe:x},s?(u.$c="s\
pawnThread",postMessage(u,x),0):it(u))}function Nv(u){throw rn||=u>>>0,rn}var Qu=globalThis.TextDecoder&&new TextDecoder,
Xu=(u,f,m,g)=>{if(m=f+m,g)return m;for(;u[f]&&!(f>=m);)++f;return f},Yu=(u,f=0,m,g)=>{if(16<(m=Xu(u,f>>>=0,m,g))-f&&u.buffer&&
Qu)return Qu.decode(u.buffer instanceof ArrayBuffer?u.subarray(f,m):u.slice(f,m));for(g="";f<m;){var x=u[f++];if(128&x){
var T=63&u[f++];if((224&x)==192)g+=String.fromCharCode((31&x)<<6|T);else{var P=63&u[f++];65536>(x=(240&x)==224?(15&x)<<12|
T<<6|P:(7&x)<<18|T<<12|P<<6|63&u[f++])?g+=String.fromCharCode(x):(x-=65536,g+=String.fromCharCode(55296|x>>10,56320|1023&
x))}}else g+=String.fromCharCode(x)}return g},nn=(u,f,m)=>(u>>>=0)?Yu((M(),j),u,f,m):"";function Ku(u,f,m){return s?Me(3,
1,u,f,m):0}function Ju(u,f){if(s)return Me(4,1,u,f)}function Zu(u,f){if(s)return Me(5,1,u,f)}function ed(u,f,m){if(s)return Me(
6,1,u,f,m)}function td(u,f,m){return s?Me(7,1,u,f,m):0}function rd(u,f){if(s)return Me(8,1,u,f)}function nd(u,f,m){if(s)
return Me(9,1,u,f,m)}function sd(u,f,m,g){if(s)return Me(10,1,u,f,m,g)}function ad(u,f,m,g){if(s)return Me(11,1,u,f,m,g)}
function od(u,f,m,g){if(s)return Me(12,1,u,f,m,g)}function id(u){if(s)return Me(13,1,u)}function ld(u,f){if(s)return Me(
14,1,u,f)}function cd(u,f,m){if(s)return Me(15,1,u,f,m)}var Dv=()=>se(""),Wt=u=>{u>>>=0;for(var f="";;){var m=(M(),j)[u++>>>
0];if(!m)return f;f+=String.fromCharCode(m)}},no={},so={},sn=class extends Error{constructor(u){super(u),this.name="Bind\
ingError"}};function nr(u,f,m={}){return(function(g,x,T={}){var P=x.name;if(!g)throw new sn(`type "${P}" must have a pos\
itive integer typeid pointer`);if(so.hasOwnProperty(g)){if(T.ve)return;throw new sn(`Cannot register type '${P}' twice`)}
so[g]=x,no.hasOwnProperty(g)&&(x=no[g],delete no[g],x.forEach(S=>S()))})(u,f,m)}var ud=(u,f,m)=>{switch(f){case 1:return m?
g=>(M(),R)[g>>>0]:g=>(M(),j)[g>>>0];case 2:return m?g=>(M(),Y)[g>>>1>>>0]:g=>(M(),Q)[g>>>1>>>0];case 4:return m?g=>(M(),
z)[g>>>2>>>0]:g=>(M(),I)[g>>>2>>>0];case 8:return m?g=>(M(),ce)[g>>>3>>>0]:g=>(M(),Z)[g>>>3>>>0];default:throw new TypeError(
`invalid integer width (${f}): ${u}`)}};function zv(u,f,m,g,x){u>>>=0,m>>>=0,f=Wt(f>>>0);let T=P=>P;if(g=g===0n){let P=8*
m;T=S=>BigInt.asUintN(P,S),x=T(x)}nr(u,{name:f,Wc:T,cd:(P,S)=>(typeof S=="number"&&(S=BigInt(S)),S),bd:ud(f,m,!g),dd:null})}
function Bv(u,f,m,g){nr(u>>>=0,{name:f=Wt(f>>>0),Wc:function(x){return!!x},cd:function(x,T){return T?m:g},bd:function(x){
return this.Wc((M(),j)[x>>>0])},dd:null})}var dd=[],Lr=[0,1,,1,null,1,!0,1,!1,1];function ao(u){9<(u>>>=0)&&--Lr[u+1]===
0&&(Lr[u]=void 0,dd.push(u))}var xt=u=>{if(!u)throw new sn(`Cannot use deleted val. handle = ${u}`);return Lr[u]},Pt=u=>{
switch(u){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let f=dd.pop()||Lr.length;return Lr[f]=
u,Lr[f+1]=1,f}};function oo(u){return this.Wc((M(),I)[u>>>2>>>0])}var Rv={name:"emscripten::val",Wc:u=>{var f=xt(u);return ao(
u),f},cd:(u,f)=>Pt(f),bd:oo,dd:null};function $v(u){return nr(u>>>0,Rv)}var Gv=(u,f)=>{switch(f){case 4:return function(m){
return this.Wc((M(),U)[m>>>2>>>0])};case 8:return function(m){return this.Wc((M(),X)[m>>>3>>>0])};default:throw new TypeError(
`invalid float width (${f}): ${u}`)}};function Vv(u,f,m){m>>>=0,nr(u>>>=0,{name:f=Wt(f>>>0),Wc:g=>g,cd:(g,x)=>x,bd:Gv(f,
m),dd:null})}function Uv(u,f,m,g,x){u>>>=0,m>>>=0,f=Wt(f>>>0);let T=S=>S;if(g===0){var P=32-8*m;T=S=>S<<P>>>P,x=T(x)}nr(
u,{name:f,Wc:T,cd:(S,D)=>D,bd:ud(f,m,g!==0),dd:null})}function jv(u,f,m){function g(T){var P=(M(),I)[T>>>2>>>0];return T=
(M(),I)[T+4>>>2>>>0],new x((M(),R).buffer,T,P)}var x=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,
Float32Array,Float64Array,BigInt64Array,BigUint64Array][f];nr(u>>>=0,{name:m=Wt(m>>>0),Wc:g,bd:g},{ve:!0})}var sr=(u,f,m)=>{
var g=(M(),j);if(f>>>=0,0<m){var x=f;m=f+m-1;for(var T=0;T<u.length;++T){var P=u.codePointAt(T);if(127>=P){if(f>=m)break;
g[f++>>>0]=P}else if(2047>=P){if(f+1>=m)break;g[f++>>>0]=192|P>>6,g[f++>>>0]=128|63&P}else if(65535>=P){if(f+2>=m)break;
g[f++>>>0]=224|P>>12,g[f++>>>0]=128|P>>6&63,g[f++>>>0]=128|63&P}else{if(f+3>=m)break;g[f++>>>0]=240|P>>18,g[f++>>>0]=128|
P>>12&63,g[f++>>>0]=128|P>>6&63,g[f++>>>0]=128|63&P,T++}}g[f>>>0]=0,u=f-x}else u=0;return u},ar=u=>{for(var f=0,m=0;m<u.
length;++m){var g=u.charCodeAt(m);127>=g?f++:2047>=g?f+=2:55296<=g&&57343>=g?(f+=4,++m):f+=3}return f};function qv(u,f){
nr(u>>>=0,{name:f=Wt(f>>>0),Wc(m){var g=(M(),I)[m>>>2>>>0];return g=nn(m+4,g,!0),kt(m),g},cd(m,g){g instanceof ArrayBuffer&&
(g=new Uint8Array(g));var x=typeof g=="string";if(!(x||ArrayBuffer.isView(g)&&g.BYTES_PER_ELEMENT==1))throw new sn("Cann\
ot pass non-string to std::string");var T=x?ar(g):g.length,P=Nr(4+T+1),S=P+4;return(M(),I)[P>>>2>>>0]=T,x?sr(g,S,T+1):(M(),
j).set(g,S>>>0),m!==null&&m.push(kt,P),P},bd:oo,dd(m){kt(m)}})}var hd=globalThis.TextDecoder?new TextDecoder("utf-16le"):
void 0,Wv=(u,f,m)=>{if(u>>>=1,16<(f=Xu((M(),Q),u,f/2,m))-u&&hd)return hd.decode((M(),Q).slice(u,f));for(m="";u<f;++u){var g=(M(),
Q)[u>>>0];m+=String.fromCharCode(g)}return m},Hv=(u,f,m)=>{if(m??=2147483647,2>m)return 0;var g=f;m=(m-=2)<2*u.length?m/
2:u.length;for(var x=0;x<m;++x){var T=u.charCodeAt(x);(M(),Y)[f>>>1>>>0]=T,f+=2}return(M(),Y)[f>>>1>>>0]=0,f-g},Qv=u=>2*
u.length,Xv=(u,f,m)=>{var g="";u>>>=2;for(var x=0;!(x>=f/4);x++){var T=(M(),I)[u+x>>>0];if(!T&&!m)break;g+=String.fromCodePoint(
T)}return g},Yv=(u,f,m)=>{if(f>>>=0,m??=2147483647,4>m)return 0;var g=f;m=g+m-4;for(var x=0;x<u.length;++x){var T=u.codePointAt(
x);if(65535<T&&x++,(M(),z)[f>>>2>>>0]=T,(f+=4)+4>m)break}return(M(),z)[f>>>2>>>0]=0,f-g},Kv=u=>{for(var f=0,m=0;m<u.length;++m)
65535<u.codePointAt(m)&&m++,f+=4;return f};function Jv(u,f,m){if(u>>>=0,f>>>=0,m=Wt(m>>>=0),f===2)var g=Wv,x=Hv,T=Qv;else
g=Xv,x=Yv,T=Kv;nr(u,{name:m,Wc:P=>{var S=(M(),I)[P>>>2>>>0];return S=g(P+4,S*f,!0),kt(P),S},cd:(P,S)=>{if(typeof S!="str\
ing")throw new sn(`Cannot pass non-string to C++ string type ${m}`);var D=T(S),q=Nr(4+D+f);return(M(),I)[q>>>2>>>0]=D/f,
x(S,q+4,D+f),P!==null&&P.push(kt,q),q},bd:oo,dd(P){kt(P)}})}function Zv(u,f){nr(u>>>=0,{we:!0,name:f=Wt(f>>>0),Wc:()=>{},
cd:()=>{}})}function ey(u){xo(u>>>0,!n,1,!r,131072,!1),Gu()}var dt=u=>{if(!C)try{if(u(),!(0<be))try{s?$s()&&ko(p):tn(p)}catch(f){
f instanceof Ee||f=="unwind"||l(0,f)}}catch(f){f instanceof Ee||f=="unwind"||l(0,f)}},ty=!Atomics.waitAsync||globalThis.
navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function io(u){u>>>=0,ty||
(Atomics.waitAsync((M(),z),u>>>2,u).value.then(Is),u+=128,Atomics.store((M(),z),u>>>2,1))}var Is=()=>dt(()=>{var u=$s();
u&&(io(u),oh())});function ry(u,f){(u>>>=0)==f>>>0?setTimeout(Is):s?postMessage({gd:u,$c:"checkMailbox"}):(u=Ir[u])&&u.postMessage(
{$c:"checkMailbox"})}var lo=[];function ny(u,f,m,g,x){for(f>>>=0,x>>>=0,lo.length=0,m=x>>>3,g=x+g>>>3;m<g;){var T;T=(M(),
ce)[m++>>>0]?(M(),ce)[m++>>>0]:(M(),X)[m++>>>0],lo.push(T)}return(f?Co[f]:Hb[u])(...lo)}var sy=()=>{be=0};function ay(u){
u>>>=0,s?postMessage({$c:"cleanupThread",Le:u}):$u(Ir[u])}function oy(u){}var Ls=u=>{try{u()}catch(f){se(f)}};function iy(u){
var f=(...m)=>{Os.push(u);try{return u(...m)}finally{C||(Os.pop(),Ht&&mr===1&&Os.length===0&&(mr=0,be+=1,Ls(Yh),typeof Fibers<
"u"&&Fibers.We()))}};return pd.set(u,f),f}var mr=0,Ht=null,fd=0,Os=[],co=new Map,_d=new Map,pd=new Map,ly=0,uo=null,cy=[],
md=u=>(function(f){if(!C){if(mr===0){var m=!1,g=!1;f((x=0)=>{if(!C&&(fd=x,m=!0,g)){mr=2,Ls(()=>Kh(Ht)),typeof MainLoop<"\
u"&&MainLoop.se&&MainLoop.resume(),x=!1;try{var T=(function(){var D=(M(),z)[Ht+8>>>2>>>0];return D=_d.get(D),D=pd.get(D),
--be,D()})()}catch(D){T=D,x=!0}var P=!1;if(!Ht){var S=uo;S&&(uo=null,(x?S.reject:S.resolve)(T),P=!0)}if(x&&!P)throw T}}),
g=!0,m||(mr=1,Ht=(function(){var x=Nr(65548),T=x+12;if((M(),I)[x>>>2>>>0]=T,(M(),I)[x+4>>>2>>>0]=T+65536,T=Os[0],!co.has(
T)){var P=ly++;co.set(T,P),_d.set(P,T)}return T=co.get(T),(M(),z)[x+8>>>2>>>0]=T,x})(),typeof MainLoop<"u"&&MainLoop.se&&
MainLoop.pause(),Ls(()=>Xh(Ht)))}else mr===2?(mr=0,Ls(Jh),kt(Ht),Ht=null,cy.forEach(dt)):se(`invalid state: ${mr}`);return fd}})(
f=>{u().then(f)});function uy(u){return u>>>=0,md(async()=>{var f=await xt(u);return Pt(f)})}var ho=[],dy=u=>{var f=ho.length;
return ho.push(u),f},hy=(u,f)=>{for(var m=Array(u),g=0;g<u;++g){var x=g,T=(M(),I)[f+4*g>>>2>>>0],P=so[T];if(P===void 0)throw u=
`parameter ${g}`,T=Gd(T),f=Wt(T),kt(T),new sn(`${u} has unknown type ${f}`);m[x]=P}return m},fy=(u,f,m)=>{var g=[];return u=
u(g,m),g.length&&((M(),I)[f>>>2>>>0]=Pt(g)),u},_y={},Ns=u=>{var f=_y[u];return f===void 0?Wt(u):f};function py(u,f,m){var[
g,...x]=hy(u,f>>>0);f=g.cd.bind(g);var T=x.map(D=>D.bd.bind(D));u--;var P={toValue:xt};switch(u=T.map((D,q)=>{var H=`arg\
FromPtr${q}`;return P[H]=D,`${H}(args${q?"+"+8*q:""})`}),m){case 0:var S="toValue(handle)";break;case 2:S="new (toValue(\
handle))";break;case 3:S="";break;case 1:P.getStringOrSymbol=Ns,S="toValue(handle)[getStringOrSymbol(methodName)]"}return S+=
`(${u})`,g.we||(P.toReturnWire=f,P.emval_returnValue=fy,S=`return emval_returnValue(toReturnWire, destructorsRef, ${S})`),
S=`return function (handle, methodName, destructorsRef, args) {
  ${S}
  }`,m=new Function(Object.keys(P),S)(...Object.values(P)),S=`methodCaller<(${x.map(D=>D.name)}) => ${g.name}>`,dy(Object.
defineProperty(m,"name",{value:S}))}function my(u,f){return f>>>=0,(u=xt(u>>>0))==xt(f)}function gy(u){return(u>>>=0)?(u=
Ns(u),Pt(globalThis[u])):Pt(globalThis)}function wy(u){return u=Ns(u>>>0),Pt(t[u])}function vy(u,f){return f>>>=0,u=xt(u>>>
0),f=xt(f),Pt(u[f])}function yy(u){9<(u>>>=0)&&(Lr[u+1]+=1)}function gd(u,f,m,g,x){return ho[u>>>0](f>>>0,m>>>0,g>>>0,x>>>
0)}function by(u,f,m,g,x){return gd(u>>>0,f>>>0,m>>>0,g>>>0,x>>>0)}function My(){return Pt([])}function xy(u){u=xt(u>>>0);
for(var f=Array(u.length),m=0;m<u.length;m++)f[m]=u[m];return Pt(f)}function ky(u){return Pt(Ns(u>>>0))}function Ty(){return Pt(
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
0]=f.getYear(),u=f.getTime(),BigInt(isNaN(u)?-1:u/1e3)}function bd(u,f,m,g,x,T,P){return s?Me(16,1,u,f,m,g,x,T,P):-52}function Md(u,f,m,g,x,T){
if(s)return Me(17,1,u,f,m,g,x,T)}var qn={},Fy=()=>performance.timeOrigin+performance.now();function xd(u,f){if(s)return Me(
18,1,u,f);if(qn[u]&&(clearTimeout(qn[u].id),delete qn[u]),!f)return 0;var m=setTimeout(()=>{delete qn[u],dt(()=>ah(u,performance.
timeOrigin+performance.now()))},f);return qn[u]={id:m,Ve:f},0}function Iy(u,f,m,g){u>>>=0,f>>>=0,m>>>=0,g>>>=0;var x=new Date().
getFullYear(),T=new Date(x,0,1).getTimezoneOffset();x=new Date(x,6,1).getTimezoneOffset();var P=Math.max(T,x);(M(),I)[u>>>
2>>>0]=60*P,(M(),z)[f>>>2>>>0]=+(T!=x),u=(f=S=>{var D=Math.abs(S);return`UTC${0<=S?"-":"+"}${String(Math.floor(D/60)).padStart(
2,"0")}${String(D%60).padStart(2,"0")}`})(T),f=f(x),x<T?(sr(u,m,17),sr(f,g,17)):(sr(u,g,17),sr(f,m,17))}var Ly=()=>Date.
now();function Oy(u,f,m){return m>>>=0,0<=u&&3>=u?(u===0?u=Date.now():u=performance.timeOrigin+performance.now(),u=Math.
round(1e6*u),(M(),ce)[m>>>3>>>0]=BigInt(u),0):28}var fo=[],kd=(u,f)=>{fo.length=0;for(var m;m=(M(),j)[u++>>>0];){var g=m!=
105;f+=(g&=m!=112)&&f%8?4:0,fo.push(m==112?(M(),I)[f>>>2>>>0]:m==106?(M(),ce)[f>>>3>>>0]:m==105?(M(),z)[f>>>2>>>0]:(M(),
X)[f>>>3>>>0]),f+=g?8:4}return fo};function Ny(u,f,m){return u>>>=0,f=kd(f>>>0,m>>>0),Co[u](...f)}function Dy(u,f,m){return u>>>=
0,f=kd(f>>>0,m>>>0),Co[u](...f)}var zy=()=>{};function By(u,f){return E(nn(u>>>0,f>>>0))}var Ry=()=>{throw be+=1,"unwind"};
function $y(){return 4294901760}var Gy=()=>1,Vy=()=>navigator.hardwareConcurrency,Or={},Td=u=>{var f=ar(u)+1,m=Nr(f);return m&&
sr(u,m,f),m},Ds=u=>{var f;return(f=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(u))?+f[1]:(f=/:(\d+):\d+(?:\)|$)/.exec(u))?
2147483648|+f[1]:0},Ed=u=>{for(var f of u)(u=Ds(f))&&(Or[u]=f)};function Uy(){var u=Error().stack.toString().split(`
`);return u[0]=="Error"&&u.shift(),Ed(u),Or.ee=Ds(u[3]),Or.xe=u,Or.ee}function zs(u){if(!(u=Or[u>>>0]))return 0;var f;if(f=
/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(u))u=f[1];else if(f=/^\s+at (.*) \(.*\)$/.exec(u))u=f[1];else{if(!(f=/^(.+?)@/.exec(
u)))return 0;u=f[1]}return kt(zs.ne??0),zs.ne=Td(u),zs.ne}function jy(u){u>>>=0;var f=(M(),j).length;if(u<=f||4294901760<
u)return!1;for(var m=1;4>=m;m*=2){var g=f*(1+.2/m);g=Math.min(g,u+100663296);e:{g=(Math.min(4294901760,65536*Math.ceil(Math.
max(u,g)/65536))-pr.buffer.byteLength+65535)/65536|0;try{pr.grow(g),O();var x=1;break e}catch{}x=void 0}if(x)return!0}return!1}
function qy(u,f,m){if(u>>>=0,f>>>=0,Or.ee==u)var g=Or.xe;else(g=Error().stack.toString().split(`
`))[0]=="Error"&&g.shift(),Ed(g);for(var x=3;g[x]&&Ds(g[x])!=u;)++x;for(u=0;u<m&&g[u+x];++u)(M(),z)[f+4*u>>>2>>>0]=Ds(g[u+
x]);return u}var Qt=u=>{var f=ar(u)+1,m=Gs(f);return sr(u,m,f),m},an=u=>(M(),I)[u>>>2>>>0]+4294967296*(M(),z)[u+4>>>2>>>
0],tt=[],Ad=(u,f)=>{tt[u>>>0]=f},or=[],Bs=[],on=(u,f)=>{Bs[u]=new Promise(m=>f.finally(()=>m(u)))},J=u=>{if(u)return tt[u>>>
0]},_o=(u,f)=>{for(u=(M(),I)[u>>>2>>>0];u;u=(M(),I)[u>>>2>>>0])f[(M(),z)[u+4>>>2>>>0]](u)},Rs=(u,f,m)=>{(M(),I)[u>>>2>>>
0]=f,(M(),I)[u+4>>>2>>>0]=m},Cd=u=>{var f=(M(),I)[u>>>2>>>0];return u=(M(),I)[u+4>>>2>>>0],nn(f,u)},Ft=u=>{var f=(M(),I)[u>>>
2>>>0];return u=(M(),I)[u+4>>>2>>>0],f?nn(f,u):u===0?"":void 0},Wy=u=>{var f=Ft(u+4),m=(m=(M(),I)[u+12>>>2>>>0])?J(m):"a\
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
(M(),I)[f+56>>>2>>>0]=u.subgroupMaxSize;var m=Td(u.vendor+u.architecture+u.device+u.description),g=ar(u.vendor);Rs(f+4,m,
g),m+=g,g=ar(u.architecture),Rs(f+12,m,g),m+=g,g=ar(u.device),Rs(f+20,m,g),m+=g,g=ar(u.description),Rs(f+28,m,g),m+=g,(M(),
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
"depth","sint","uint"],Id=[,"1d","2d","2d-array","cube","cube-array","3d"],nb={undefined:1,unknown:1,destroyed:2};function sb(u,f,m,g,x,T){
f=et(f),m=et(m),g>>>=0,x>>>=0,T>>>=0;var P=J(u>>>0);if(u={},T){var S=(M(),I)[T+12>>>2>>>0];if(S){var D=(M(),I)[T+16>>>2>>>
0];u.requiredFeatures=Array.from((M(),I).subarray(D>>>2>>>0,D+4*S>>>2>>>0),H=>Pd[H])}if(S=(M(),I)[T+20>>>2>>>0]){let H=function(me,Ie,Dr,Qn=!1){
Ie+=Dr,(Ie=(M(),I)[Ie>>>2>>>0])==4294967295||Qn&&Ie==0||(q[me]=Ie)},re=function(me,Ie,Dr){Ie+=Dr,Dr=(M(),I)[Ie>>>2>>>0];
var Qn=(M(),I)[Ie+4>>>2>>>0];Dr==4294967295&&Qn==4294967295||(q[me]=an(Ie))};D=(M(),I)[S>>>2>>>0];var q={};H("maxTexture\
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
q}(S=(M(),I)[T+24>>>2>>>0])&&(S={label:Ft(S+4)},u.defaultQueue=S),u.label=Ft(T+4)}be+=1,on(f,P.requestDevice(u).then(H=>{
--be,dt(()=>{tt[x>>>0]=H.queue,tt[g>>>0]=H,be+=1,on(m,H.lost.then(re=>{dt(()=>{H.onuncapturederror=()=>{};var me=te(),Ie=Qt(
re.message);vo(m,nb[re.reason],Ie),ee(me)}),--be})),H.onuncapturederror=re=>{var me=5;re.error instanceof GPUValidationError?
me=2:re.error instanceof GPUOutOfMemoryError?me=3:re.error instanceof GPUInternalError&&(me=4);var Ie=te();re=Qt(re.error.
message),th(g,me,re),ee(Ie)},"adapterInfo"in H||(H.adapterInfo=P.info),Mo(f,1,g,0)})},H=>{--be,dt(()=>{var re=te(),me=Qt(
H.message);Mo(f,3,g,me),m&&vo(m,4,me),ee(re)})}))}function ab(u){var f=J(u>>>=0),m=or[u];if(m){for(var g=0;g<m.length;++g)
m[g]();delete or[u]}f.destroy()}function ob(u,f,m){m>>>=0;var g=J(u>>>=0);m==4294967295&&(m=void 0);try{var x=g.getMappedRange(
f>>>0,m)}catch{return 0}var T=To(16,x.byteLength);return(M(),j).set(new Uint8Array(x),T>>>0),or[u].push(()=>kt(T)),T}function ib(u,f,m){
m>>>=0;var g=J(u>>>=0);m==4294967295&&(m=void 0);try{var x=g.getMappedRange(f>>>0,m)}catch{return 0}var T=To(16,x.byteLength);
return(M(),j).fill(0,T,x.byteLength),or[u].push(()=>{new Uint8Array(x).set((M(),j).subarray(T>>>0,T+x.byteLength>>>0)),kt(
T)}),T}function lb(u,f,m,g,x){u>>>=0,f=et(f),m=et(m),x>>>=0;var T=J(u);or[u]=[],x==4294967295&&(x=void 0),be+=1,on(f,T.mapAsync(
m,g>>>0,x).then(()=>{--be,dt(()=>{yo(f,1,0)})},P=>{--be,dt(()=>{te();var S=Qt(P.message);yo(f,P.name==="AbortError"?4:P.
name==="OperationError"?3:0,S),delete or[u]})}))}function cb(u){var f=J(u>>>=0),m=or[u];if(m){for(var g=0;g<m.length;++g)
m[g]();delete or[u],f.unmap()}}function ub(u){delete tt[u>>>0]}function db(u,f,m){u>>>=0,f>>>=0,m>>>=0;var g=!!(M(),I)[f+
32>>>2>>>0];f={label:Ft(f+4),usage:(M(),I)[f+16>>>2>>>0],size:an(f+24),mappedAtCreation:g},u=J(u);try{var x=u.createBuffer(
f)}catch{return!1}return tt[m>>>0]=x,g&&(or[m]=[]),!0}function hb(u,f,m,g){u>>>=0,f=et(f),g>>>=0,m=Wy(m>>>0),u=J(u),be+=
1,on(f,u.createComputePipelineAsync(m).then(x=>{--be,dt(()=>{tt[g>>>0]=x,wo(f,1,g,0)})},x=>{--be,dt(()=>{var T=te(),P=Qt(
x.message);wo(f,x.reason==="validation"?3:x.reason==="internal"?4:0,g,P),ee(T)})}))}function fb(u,f,m){u>>>=0,f>>>=0,m>>>=
0;var g=(M(),I)[f>>>2>>>0],x=(M(),z)[g+4>>>2>>>0];f={label:Ft(f+4),code:""},x===2&&(f.code=Cd(g+8)),u=J(u).createShaderModule(
f),tt[m>>>0]=u}var _b=u=>{(u=J(u)).onuncapturederror=null,u.destroy()};function pb(u,f){f=et(f),u=J(u>>>0),be+=1,on(f,u.
popErrorScope().then(m=>{--be,dt(()=>{var g=5;m?m instanceof GPUValidationError?g=2:m instanceof GPUOutOfMemoryError?g=3:
m instanceof GPUInternalError&&(g=4):g=1;var x=te(),T=m?Qt(m.message):0;bo(f,1,g,T),ee(x)})},m=>{--be,dt(()=>{var g=te(),
x=Qt(m.message);bo(f,1,5,x),ee(g)})}))}function mb(u,f,m,g){if(f=et(f),g>>>=0,m>>>=0){var x={featureLevel:Yy[(M(),z)[m+4>>>
2>>>0]],powerPreference:Ky[(M(),z)[m+8>>>2>>>0]],forceFallbackAdapter:!!(M(),I)[m+12>>>2>>>0]};(u=(M(),I)[m>>>2>>>0])!==
0&&(M(),x.Ye=!!(M(),I)[u+8>>>2>>>0])}"gpu"in navigator?(be+=1,on(f,navigator.gpu.requestAdapter(x).then(T=>{--be,dt(()=>{
if(T)tt[g>>>0]=T,Wn(f,1,g,0);else{var P=te(),S=Qt("WebGPU not available on this browser (requestAdapter returned null)");
Wn(f,3,g,S),ee(P)}})},T=>{--be,dt(()=>{var P=te(),S=Qt(T.message);Wn(f,4,g,S),ee(P)})}))):(x=te(),u=Qt("WebGPU not avail\
able on this browser (navigator.gpu is not available)"),Wn(f,3,g,u),ee(x))}function gb(u,f,m){return u>>>=0,f>>>=0,m>>>=
0,md(async()=>{var g=[];if(m){var x=(M(),z)[m>>>2>>>0];g.length=f+1,g[f]=new Promise(S=>setTimeout(S,x,0))}else g.length=
f;for(var T=0;T<f;++T){var P=an(u+8*T);if(!(P in Bs))return P;g[T]=Bs[P]}return g=await Promise.race(g),delete Bs[g],g})}
var po,mo={},Ld=()=>{if(!po){var u,f={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.
navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(u in mo)mo[u]===void 0?delete f[u]:f[u]=mo[u];
var m=[];for(u in f)m.push(`${u}=${f[u]}`);po=m}return po};function Od(u,f){if(s)return Me(19,1,u,f);u>>>=0,f>>>=0;var m,
g=0,x=0;for(m of Ld()){var T=f+g;(M(),I)[u+x>>>2>>>0]=T,g+=sr(m,T,1/0)+1,x+=4}return 0}function Nd(u,f){if(s)return Me(20,
1,u,f);u>>>=0,f>>>=0;var m=Ld();for(var g of((M(),I)[u>>>2>>>0]=m.length,u=0,m))u+=ar(g)+1;return(M(),I)[f>>>2>>>0]=u,0}
function Dd(u){return s?Me(21,1,u):52}function zd(u,f,m,g,x){return s?Me(22,1,u,f,m,g,x):52}function Bd(u,f,m,g){return s?
Me(23,1,u,f,m,g):52}function Rd(u,f,m,g){return s?Me(24,1,u,f,m,g):70}var wb=[null,[],[]];function $d(u,f,m,g){if(s)return Me(
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
return _o(x,{14:q=>{D=(M(),I)[q+8>>>2>>>0]}}),T?((P=an(x+24))==-1&&(P=void 0),T={buffer:J(T),offset:an(x+16),size:P}):T=
J(P||S||D),{binding:(M(),I)[x+4>>>2>>>0],resource:T}}u>>>=0,f={label:Ft((f>>>=0)+4),layout:J((M(),I)[f+12>>>2>>>0]),entries:(function(x,T){
for(var P=[],S=0;S<x;++S)P.push(m(T+40*S));return P})((M(),I)[f+16>>>2>>>0],(M(),I)[f+20>>>2>>>0])},u=J(u);var g=qd(0);return Ad(
g,u.createBindGroup(f)),g}function Db(u,f){function m(D){var q=(M(),I)[D+4>>>2>>>0];if(q)return{type:Qy[q],hasDynamicOffset:!!(M(),
I)[D+8>>>2>>>0],minBindingSize:an(D+16)}}function g(D){if(D=(M(),I)[D+4>>>2>>>0])return{type:Zy[D]}}function x(D){var q=(M(),
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
g+x>>>0),u.writeBuffer(f,m,g,0,x)}s||(function(){for(var u=t.numThreads-1;u--;)Uu();$e.push(async()=>{var f=(async function(){
if(!s)return Promise.all(_r.map(Vu))})();Fe++,await f,--Fe==0&&ye&&(f=ye,ye=null,f())})})(),s||(pr=new WebAssembly.Memory(
{initial:256,maximum:65536,shared:!0}),O()),t.wasmBinary&&(h=t.wasmBinary),t.stackSave=()=>te(),t.stackRestore=u=>ee(u),
t.stackAlloc=u=>Gs(u),t.setValue=function(u,f,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":(M(),R)[u>>>0]=
f;break;case"i16":(M(),Y)[u>>>1>>>0]=f;break;case"i32":(M(),z)[u>>>2>>>0]=f;break;case"i64":(M(),ce)[u>>>3>>>0]=BigInt(f);
break;case"float":(M(),U)[u>>>2>>>0]=f;break;case"double":(M(),X)[u>>>3>>>0]=f;break;case"*":(M(),I)[u>>>2>>>0]=f;break;default:
se(`invalid type for setValue: ${m}`)}},t.getValue=function(u,f="i8"){switch(f.endsWith("*")&&(f="*"),f){case"i1":case"i\
8":return(M(),R)[u>>>0];case"i16":return(M(),Y)[u>>>1>>>0];case"i32":return(M(),z)[u>>>2>>>0];case"i64":return(M(),ce)[u>>>
3>>>0];case"float":return(M(),U)[u>>>2>>>0];case"double":return(M(),X)[u>>>3>>>0];case"*":return(M(),I)[u>>>2>>>0];default:
se(`invalid type for getValue: ${f}`)}},t.UTF8ToString=nn,t.stringToUTF8=sr,t.lengthBytesUTF8=ar;var Gd,Vd,Ud,go,$s,kt,Nr,
jd,qd,Wd,Hd,Qd,Xd,Yd,Kd,Jd,Zd,eh,wo,vo,yo,bo,Wn,Mo,th,xo,rh,nh,sh,ko,ah,oh,To,_e,Hn,ih,ee,Gs,te,lh,Eo,ch,uh,dh,Ao,hh,fh,
_h,ph,mh,gh,wh,vh,yh,bh,Mh,xh,kh,Th,Eh,Ah,Ch,Sh,Ph,Fh,Ih,Lh,Oh,Nh,Dh,zh,Bh,Rh,$h,Gh,Vh,Uh,jh,qh,Wh,Hh,Qh,Xh,Yh,Kh,Jh,ir,
Hb=[en,Un,Wu,Ku,Ju,Zu,ed,td,rd,nd,sd,ad,od,id,ld,cd,bd,Md,xd,Od,Nd,Dd,zd,Bd,Rd,$d],Co={1280444:(u,f,m,g,x)=>{if(t===void 0||
!t.ed)return 1;if((u=nn(Number(u>>>0))).startsWith("./")&&(u=u.substring(2)),!(u=t.ed.get(u)))return 2;if(f=Number(f>>>0),
m=Number(m>>>0),g=Number(g>>>0),f+m>u.byteLength)return 3;try{let T=u.subarray(f,f+m);switch(x){case 0:(M(),j).set(T,g>>>
0);break;case 1:t.pe?t.pe(g,T):t.Re(g,T);break;default:return 4}return 0}catch{return 4}},1281268:(u,f,m)=>{t.re(u,(M(),
j).subarray(f>>>0,f+m>>>0))},1281332:()=>t.Pe(),1281374:u=>{t.qe(u)},1281411:()=>typeof wasmOffsetConverter<"u"};function Qb(){
return typeof wasmOffsetConverter<"u"}function Xb(u,f,m,g){var x=te();try{return vh(u,f,m,g)}catch(T){if(ee(x),T!==T+0)throw T;
_e(1,0)}}function Yb(u,f,m){var g=te();try{return mh(u,f,m)}catch(x){if(ee(g),x!==x+0)throw x;_e(1,0)}}function Kb(u){var f=te();
try{hh(u)}catch(m){if(ee(f),m!==m+0)throw m;_e(1,0)}}function Jb(u,f){var m=te();try{return Ao(u,f)}catch(g){if(ee(m),g!==
g+0)throw g;_e(1,0)}}function Zb(u,f,m){var g=te();try{dh(u,f,m)}catch(x){if(ee(g),x!==x+0)throw x;_e(1,0)}}function e0(u,f){
var m=te();try{yh(u,f)}catch(g){if(ee(m),g!==g+0)throw g;_e(1,0)}}function t0(u,f,m,g,x,T,P){var S=te();try{return ph(u,
f,m,g,x,T,P)}catch(D){if(ee(S),D!==D+0)throw D;_e(1,0)}}function r0(u,f,m,g,x,T){var P=te();try{fh(u,f,m,g,x,T)}catch(S){
if(ee(P),S!==S+0)throw S;_e(1,0)}}function n0(u,f,m,g){var x=te();try{wh(u,f,m,g)}catch(T){if(ee(x),T!==T+0)throw T;_e(1,
0)}}function s0(u,f,m,g,x,T,P){var S=te();try{Mh(u,f,m,g,x,T,P)}catch(D){if(ee(S),D!==D+0)throw D;_e(1,0)}}function a0(u,f,m,g,x,T,P){
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
if(ee(re),me!==me+0)throw me;_e(1,0)}}function S0(u,f,m,g,x,T,P,S,D,q,H,re,me,Ie,Dr,Qn){var O0=te();try{Hh(u,f,m,g,x,T,P,
S,D,q,H,re,me,Ie,Dr,Qn)}catch(So){if(ee(O0),So!==So+0)throw So;_e(1,0)}}function P0(u,f,m){var g=te();try{return Ch(u,f,
m)}catch(x){if(ee(g),x!==x+0)throw x;return _e(1,0),0n}}function F0(u,f,m){var g=te();try{return Ah(u,f,m)}catch(x){if(ee(
g),x!==x+0)throw x;_e(1,0)}}function I0(u,f,m){var g=te();try{return Sh(u,f,m)}catch(x){if(ee(g),x!==x+0)throw x;_e(1,0)}}
function L0(u,f,m,g){var x=te();try{Ph(u,f,m,g)}catch(T){if(ee(x),T!==T+0)throw T;_e(1,0)}}function Vs(){if(0<Fe)ye=Vs;else if(s)
w?.(t),V();else{for(var u=$e;0<u.length;)u.shift()(t);0<Fe?ye=Vs:(t.calledRun=!0,C||(V(),w?.(t)))}}return s||(ir=await qe(),
Vs()),t.PTR_SIZE=4,t.webgpuInit=u=>{let f=new WeakMap,m,g,x=1;t.webgpuRegisterDevice=S=>{if(g!==void 0)throw Error("anot\
her WebGPU EP inference session is being created.");if(S){var D=f.get(S);if(!D){let q=((H,re=0)=>{var me=eh(re);return re=
Zd(re,me),tt[me>>>0]=H.queue,tt[re>>>0]=H,re})(S,D=Ud());D=[x++,D,q],f.set(S,D)}return m=S,g=D[0],D}m=void 0,g=0};let T=new Map;
t.webgpuOnCreateSession=S=>{if(g!==void 0){var D=g;if(g=void 0,S){let q=go(D);T.set(S,q),D===0&&u(m??J(q))}m=void 0}},t.
webgpuOnReleaseSession=S=>{T.delete(S)};let P=Symbol("gpuBufferMetadata");t.webgpuRegisterBuffer=(S,D,q)=>{if(q)return S[P]=
[q,NaN],q;if(q=S[P])return q[1]++,q[0];if((D=T.get(D))===void 0)throw Error("Invalid session handle passed to webgpuRegi\
sterBuffer");return D=((H,re=0)=>(H.mapState==="unmapped"||se(),re=Jd(re),tt[re>>>0]=H,re))(S,D),S[P]=[D,1],D},t.webgpuUnregisterBuffer=
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
globalThis.self?.name?.startsWith("em-pthread"),tf&&ef()}),No,fi,rf,gt,op,js,nf,sf,Do,af,zo,ip,Bo,lp,Di=ge(()=>{"use str\
ict";Ni(),No=typeof location>"u"?void 0:location.origin,fi=import.meta.url>"file:"&&import.meta.url<"file;",rf=()=>{if(fi){
let e=URL;return new URL(new e("ort.webgpu.bundle.min.mjs",import.meta.url).href,No).href}return import.meta.url},gt=rf(),
op=()=>{if(gt&&!gt.startsWith("blob:"))return gt.substring(0,gt.lastIndexOf("/")+1)},js=(e,t)=>{try{let r=t??gt;return(r?
new URL(e,r):new URL(e)).origin===No}catch{return!1}},nf=(e,t)=>{let r=t??gt;try{return(r?new URL(e,r):new URL(e)).href}catch{
return}},sf=(e,t)=>`${t??"./"}${e}`,Do=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.
createObjectURL(t)},af=async e=>(await import(e)).default,zo=(Z0(),oa(rp)).default,ip=async()=>{if(!gt)throw new Error("\
Failed to load proxy worker: cannot determine the script source URL.");if(js(gt))return[void 0,zo()];let e=await Do(gt);
return[e,zo(e)]},Bo=(eM(),oa(sp)).default,lp=async(e,t,r,n)=>{let s=Bo&&!(e||t);if(s)if(gt)s=js(gt)||n&&!r;else if(n&&!r)
s=!0;else throw new Error("cannot determine the script source URL.");if(s)return[void 0,Bo];{let a="ort-wasm-simd-thread\
ed.asyncify.mjs",o=e??nf(a,t),i=r&&o&&!js(o,t),l=i?await Do(o):o??sf(a,t);return[i?l:void 0,await af(l)]}}}),Ro,qs,Yn,$o,
of,lf,cf,zi,Le,Yr=ge(()=>{"use strict";Di(),qs=!1,Yn=!1,$o=!1,of=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<
"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,
1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},lf=()=>{try{return WebAssembly.
validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},cf=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,
0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},zi=async e=>{
if(qs)return Promise.resolve();if(Yn)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if($o)throw new Error(
"previous call to 'initializeWebAssembly()' failed.");Yn=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd===
"relaxed"){if(!cf())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!lf())
throw new Error("WebAssembly SIMD is not supported in the current environment.")}let n=of();r>1&&!n&&(typeof self<"u"&&!self.
crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOr\
iginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-th\
reading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let s=e.wasmPaths,
a=typeof s=="string"?s:void 0,o=s?.mjs,i=o?.href??o,l=s?.wasm,c=l?.href??l,d=e.wasmBinary,[h,_]=await lp(i,a,r>1,!!d||!!c),
p=!1,w=[];if(t>0&&w.push(new Promise(v=>{setTimeout(()=>{p=!0,v()},t)})),w.push(new Promise((v,y)=>{let b={numThreads:r};
if(d)b.wasmBinary=d,b.locateFile=k=>k;else if(c||a)b.locateFile=k=>c??a+k;else if(i&&i.indexOf("blob:")!==0)b.locateFile=
k=>new URL(k,i).href;else if(h){let k=op();k&&(b.locateFile=A=>k+A)}_(b).then(k=>{Yn=!1,qs=!0,Ro=k,v(),h&&URL.revokeObjectURL(
h)},k=>{Yn=!1,$o=!0,y(k)})})),await Promise.race(w),p)throw new Error(`WebAssembly backend initializing failed due to ti\
meout: ${t}ms`)},Le=()=>{if(qs&&Ro)return Ro;throw new Error("WebAssembly is not initialized yet.")}}),wt,la,xe,Bi=ge(()=>{
"use strict";Yr(),wt=(e,t)=>{let r=Le(),n=r.lengthBytesUTF8(e)+1,s=r._malloc(n);return r.stringToUTF8(e,s,n),t.push(s),s},
la=(e,t,r,n)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.
entries(e).forEach(([s,a])=>{let o=t?t+s:s;if(typeof a=="object")la(a,o+".",r,n);else if(typeof a=="string"||typeof a=="\
number")n(o,a.toString());else if(typeof a=="boolean")n(o,a?"1":"0");else throw new Error(`Can't handle extra config typ\
e: ${typeof a}`)})},xe=e=>{let t=Le(),r=t.stackSave();try{let n=t.PTR_SIZE,s=t.stackAlloc(2*n);t._OrtGetLastError(s,s+n);
let a=Number(t.getValue(s,n===4?"i32":"i64")),o=t.getValue(s+n,"*"),i=o?t.UTF8ToString(o):"";throw new Error(`${e} ERROR\
_CODE: ${a}, ERROR_MESSAGE: ${i}`)}finally{t.stackRestore(r)}}}),cp,tM=ge(()=>{"use strict";Yr(),Bi(),cp=e=>{let t=Le(),
r=0,n=[],s=e||{};try{if(e?.logSeverityLevel===void 0)s.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.
isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not val\
id: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)s.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="\
number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);
e?.terminate===void 0&&(s.terminate=!1);let a=0;return e?.tag!==void 0&&(a=wt(e.tag,n)),r=t._OrtCreateRunOptions(s.logSeverityLevel,
s.logVerbosityLevel,!!s.terminate,a),r===0&&xe("Can't create run options."),e?.extra!==void 0&&la(e.extra,"",new WeakSet,
(o,i)=>{let l=wt(o,n),c=wt(i,n);t._OrtAddRunConfigEntry(r,l,c)!==0&&xe(`Can't set a run config entry: ${o} - ${i}.`)}),[
r,n]}catch(a){throw r!==0&&t._OrtReleaseRunOptions(r),n.forEach(o=>t._free(o)),a}}}),uf,df,hf,ln,Xt,ff,up,rM=ge(()=>{"us\
e strict";Yr(),Bi(),uf=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"\
all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},df=e=>{switch(e){case"sequential":
return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},hf=e=>{e.extra||(e.extra=
{}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly=
"1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},
ln=(e,t,r,n)=>{let s=wt(t,n),a=wt(r,n);Le()._OrtAddSessionConfigEntry(e,s,a)!==0&&xe(`Can't set a session config entry: ${t}\
 - ${r}.`)},Xt=(e,t,r,n)=>{let s=wt(t,n),a=wt(r,n);e.push([s,a])},ff=async(e,t,r)=>{let n=t.executionProviders;for(let s of n){
let a=typeof s=="string"?s:s.name,o=[];switch(a){case"webnn":if(a="WEBNN",ln(e,"session.disable_quant_qdq","1",r),ln(e,"\
session.disable_qdq_constant_folding","1",r),typeof s!="string"){let h=s?.deviceType;h&&ln(e,"deviceType",h,r)}break;case"\
webgpu":{a="WebGPU";let h;if(typeof s!="string"){let p=s;if(p.device)if(typeof GPUDevice<"u"&&p.device instanceof GPUDevice)
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
r: ${a}.`)}},up=async e=>{let t=Le(),r=0,n=[],s=e||{};hf(s);try{let a=uf(s.graphOptimizationLevel??"all"),o=df(s.executionMode??
"sequential"),i=typeof s.logId=="string"?wt(s.logId,n):0,l=s.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(
`log severity level is not valid: ${l}`);let c=s.logVerbosityLevel??0;if(!Number.isInteger(c)||c<0||c>4)throw new Error(
`log verbosity level is not valid: ${c}`);let d=typeof s.optimizedModelFilePath=="string"?wt(s.optimizedModelFilePath,n):
0;if(r=t._OrtCreateSessionOptions(a,!!s.enableCpuMemArena,!!s.enableMemPattern,o,!!s.enableProfiling,0,i,l,c,d),r===0&&xe(
"Can't create session options."),s.executionProviders&&await ff(r,s,n),s.enableGraphCapture!==void 0){if(typeof s.enableGraphCapture!=
"boolean")throw new Error(`enableGraphCapture must be a boolean value: ${s.enableGraphCapture}`);ln(r,"enableGraphCaptur\
e",s.enableGraphCapture.toString(),n)}if(s.freeDimensionOverrides)for(let[h,_]of Object.entries(s.freeDimensionOverrides)){
if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof _!="number"||!Number.
isInteger(_)||_<0)throw new Error(`free dimension override value must be a non-negative integer: ${_}`);let p=wt(h,n);t.
_OrtAddFreeDimensionOverride(r,p,_)!==0&&xe(`Can't set a free dimension override: ${h} - ${_}.`)}return s.extra!==void 0&&
la(s.extra,"",new WeakSet,(h,_)=>{ln(r,h,_,n)}),[r,n]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&xe("Can'\
t release session options."),n.forEach(o=>t._free(o)),a}}}),Ur,ta,_n,ss,ca,Ri,$i,_i,Tn=ge(()=>{"use strict";Ur=e=>{switch(e){case"\
int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"\
uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int6\
4":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data \
type: ${e}`)}},ta=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:
return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"\
float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:
throw new Error(`unsupported data type: ${e}`)}},_n=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,
.5][e],n=typeof t=="number"?t:t.reduce((s,a)=>s*a,1);return r>0?Math.ceil(n*r):void 0},ss=e=>{switch(e){case"float16":return typeof Float16Array<
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
rnal data file: ${e}`);let r=t.headers.get("Content-Length"),n=r?parseInt(r,10):0;if(n<1073741824)return new Uint8Array(
await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let s=t.
body.getReader(),a;try{a=new ArrayBuffer(n)}catch(i){if(i instanceof RangeError){let l=Math.ceil(n/65536);a=new WebAssembly.
Memory({initial:l,maximum:l}).buffer}else throw i}let o=0;for(;;){let{done:i,value:l}=await s.read();if(i)break;let c=l.
byteLength;new Uint8Array(a,o,c).set(l),o+=c}return new Uint8Array(a,0,n)}}else return e instanceof Blob?new Uint8Array(
await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),hp,nM=ge(()=>{"use strict";Tn(),hp=(e,t)=>new(ss(t))(
e)}),_f,pf,mf,gf,fp,wf,ht,_p=ge(()=>{"use strict";Tn(),_f=["V","I","W","E","F"],pf=(e,t)=>{console.log(`[${_f[e]},${new Date().
toISOString()}]${t}`)},fp=(e,t)=>{mf=e,gf=t},wf=(e,t)=>{let r=ca(e),n=ca(mf);r>=n&&pf(r,typeof t=="function"?t():t)},ht=
(...e)=>{gf&&wf(...e)}}),Go,vf,Vo,yf,Uo,bf,jo,qo,Wo,Mf,pp,sM=ge(()=>{"use strict";Tn(),_p(),Go=new Map([["float32",32],[
"float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),vf=(e,t)=>{
if(t==="int32")return e;let r=Go.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let n=r/
8;if(e.byteLength%n!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${n}.`);let s=e.byteLength/n,
a=new(ss(t))(e.buffer,e.byteOffset,s);switch(t){case"int64":case"uint64":{let o=new Int32Array(s);for(let i=0;i<s;i++){let l=a[i];
if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");o[i]=Number(
l)}return new Uint8Array(o.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(i=>i>2147483647))throw new Error(
"Can not convert uint32 data to int32 - value out of range.");let o=Int32Array.from(a,Number);return new Uint8Array(o.buffer)}default:
throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Vo=(e,t)=>{if(t==="int32")return e;if(e.byteLength%
4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,n=new Int32Array(
e.buffer,e.byteOffset,r);switch(t){case"int64":{let s=BigInt64Array.from(n,BigInt);return new Uint8Array(s.buffer)}case"\
uint64":{if(n.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let s=BigUint64Array.
from(n,BigInt);return new Uint8Array(s.buffer)}case"int8":{if(n.some(a=>a<-128||a>127))throw new Error("Can not convert \
int32 data to int8 - value out of range.");let s=Int8Array.from(n,Number);return new Uint8Array(s.buffer)}case"uint8":{if(n.
some(s=>s<0||s>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(
n,Number)}case"uint32":{if(n.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");
let s=Uint32Array.from(n,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion fr\
om 'int32' to ${t}`)}},yf=1,Uo=()=>yf++,bf=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int3\
2"]]),jo=(e,t)=>{let r=Go.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>
0?Math.ceil(t.reduce((n,s)=>n*s)*r/8):0},qo=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:n,
dataType:s,shape:a,fallbackDataType:o}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=n,this.dataType=s,this.tensorShape=
a,this.fallbackDataType=o}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.
fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return jo(this.dataType,this.tensorShape)}destroy(){
ht("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,
e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Vo(new Uint8Array(t),this.
dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else
return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.
mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.
every((n,s)=>n===r[s])}setIsDataConverted(e){this.isDataConverted=e}},Wo=class{constructor(e,t){this.tensorManager=e,this.
wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(
this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,n){let s=this.tensorManager.getMLContext(e),a=this.tensorManager.
getMLOpSupportLimits(e),o;if(!a?.input.dataTypes.includes(t)){if(o=bf.get(t),!o||!a?.input.dataTypes.includes(o))throw new Error(
`WebNN backend does not support data type: ${t}`);ht("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataT\
ype from ${t} to ${o}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(s,t,r))return this.wrapper.tensor;if(n){if(this.
wrapper.byteLength!==jo(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(
await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let i=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.
READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,i,!0,!0,o),n&&this.activeUpload&&
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
t.tensorWrapper))}async ensureTensor(e,t,r,n,s){ht("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, da\
taType: ${r}, shape: ${n}, copyOld: ${s}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found\
.");return a.ensureTensor(e,r,n,s)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not fo\
und.");r.upload(t)}async download(e,t){ht("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.
byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){
for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,n){
let s=this.getMLContext(e),a=Uo(),o=new qo({sessionId:e,context:s,tensor:t,dataType:r,shape:n});return this.tensorTrackersById.
set(a,new Wo(this,o)),this.externalTensors.add(o),a}async getCachedTensor(e,t,r,n,s,a,o){let i=this.getMLContext(e);for(let[
c,d]of this.freeTensors.entries())if(d.canReuseTensor(i,t,r)){ht("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${o?
`fallbackDataType: ${o},`:""} shape: ${r}`);let h=this.freeTensors.splice(c,1)[0];return h.sessionId=e,h}ht("verbose",()=>`\
[WebNN] MLContext.createTensor {dataType: ${t}, ${o?`fallbackDataType: ${o},`:""} shape: ${r}}`);let l=await i.createTensor(
{dataType:o??t,shape:r,dimensions:r,usage:n,writable:s,readable:a});return new qo({sessionId:e,context:i,tensor:l,dataType:t,
shape:r,fallbackDataType:o})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.
push(e)}},pp=(...e)=>new Mf(...e)}),mp={};ds(mp,{WebNNBackend:()=>gp});var Kn,xf,gp,aM=ge(()=>{"use strict";Tn(),Yr(),nM(),
sM(),_p(),Kn=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"\
uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),xf=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.
keys(e).sort(),n=Object.keys(t).sort();return r.length===n.length&&r.every((s,a)=>s===n[a]&&e[s]===t[s])},gp=class{constructor(e){
this.tensorManager=pp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],
this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=
[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,fp(e.logLevel,!!e.debug)}get currentSessionId(){
if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ht("verb\
ose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ht("verbose",()=>`[WebNN] onRunEnd {\
sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ht("verbose",()=>`[WebNN] releasing \
temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.
activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(n=>n.gpuDevice===
e);if(r!==-1)return this.mlContextCache[r].mlContext;{let n=await navigator.ml.createContext(e);return this.mlContextCache.
push({gpuDevice:e,mlContext:n}),n}}else if(e===void 0){let r=this.mlContextCache.findIndex(n=>n.options===void 0&&n.gpuDevice===
void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let n=await navigator.ml.createContext();return this.mlContextCache.
push({mlContext:n}),n}}let t=this.mlContextCache.findIndex(r=>xf(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;
{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){
this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(
t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.
temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.
temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){
this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;
this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(
e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let n=this.mlContextCache.
findIndex(s=>s.mlContext===t);n!==-1&&this.mlContextCache.splice(n,1)}}getMLContext(e){return this.mlContextBySessionId.
get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.
reserveTensorId()}releaseTensorId(e){ht("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(
e)}async ensureTensor(e,t,r,n,s){let a=Kn.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.
ensureTensor(e??this.currentSessionId,t,a,n,s)}async createTemporaryTensor(e,t,r){ht("verbose",()=>`[WebNN] createTempor\
aryTensor {onnxDataType: ${t}, shape: ${r}}`);let n=Kn.get(t);if(!n)throw new Error(`Unsupported ONNX data type: ${t}`);
let s=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,s,n,r,!1);let a=this.temporarySessionTensorIds.
get(e);return a?a.push(s):this.temporarySessionTensorIds.set(e,[s]),s}uploadTensor(e,t){if(!Le().shouldTransferToMLTensor)
throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ht("verbose",()=>`[WebNN] uplo\
adTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.
tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return hp(
r,t)}}registerMLTensor(e,t,r,n){let s=Kn.get(r);if(!s)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.
registerTensor(e,t,s,n);return ht("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${s}, dimensions: ${n}\
} -> {tensorId: ${a}}`),a}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.
push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.
get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let n=Kn.get(Ur(t)),s=this.mlOpSupportLimitsBySessionId.
get(e);return typeof n>"u"?!1:r?!!s?.input.dataTypes.includes(n):!!s?.output.dataTypes.includes(n)}flush(){}}}),kf,Vi,Ui,
wr,Tf,Ho,ua,ji,qi,Qo,Wi,Hi,Qi,wp=ge(()=>{"use strict";Xr(),tM(),rM(),Tn(),Yr(),Bi(),dp(),kf=(e,t)=>{Le()._OrtInit(e,t)!==
0&&xe("Can't initialize onnxruntime.")},Vi=async e=>{kf(e.wasm.numThreads,ca(e.logLevel))},Ui=async(e,t)=>{Le().asyncInit?.();
let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported\
 in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="func\
tion")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let n=e.webgpu.
powerPreference;if(n!==void 0&&n!=="low-power"&&n!=="high-performance")throw new Error(`Invalid powerPreference setting:\
 "${n}"`);let s=e.webgpu.forceFallbackAdapter;if(s!==void 0&&typeof s!="boolean")throw new Error(`Invalid forceFallbackA\
dapter setting: "${s}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:n,forceFallbackAdapter:s}),!r)throw new Error(
'Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="web\
nn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");if(t==="webg\
pu"&&Le().webgpuInit(n=>{e.webgpu.device=n}),t==="webnn"){let n=new(aM(),oa(mp)).WebNNBackend(e);Le().webnnInit([n,()=>n.
reserveTensorId(),s=>n.releaseTensorId(s),async(s,a,o,i,l)=>n.ensureTensor(s,a,o,i,l),(s,a)=>{n.uploadTensor(s,a)},async(s,a)=>n.
downloadTensor(s,a),(s,a)=>n.registerMLContext(s,a),!!e.trace])}},wr=new Map,Tf=e=>{let t=Le(),r=t.stackSave();try{let n=t.
PTR_SIZE,s=t.stackAlloc(2*n);t._OrtGetInputOutputCount(e,s,s+n)!==0&&xe("Can't get session input/output count.");let a=n===
4?"i32":"i64";return[Number(t.getValue(s,a)),Number(t.getValue(s+n,a))]}finally{t.stackRestore(r)}},Ho=(e,t)=>{let r=Le(),
n=r.stackSave(),s=0;try{let a=r.PTR_SIZE,o=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,o,o+a)!==0&&xe("Can't get \
session input/output metadata.");let i=Number(r.getValue(o,"*"));s=Number(r.getValue(o+a,"*"));let l=r.HEAP32[s/4];if(l===
0)return[i,0];let c=r.HEAPU32[s/4+1],d=[];for(let h=0;h<c;h++){let _=Number(r.getValue(s+8+h*a,"*"));d.push(_!==0?r.UTF8ToString(
_):Number(r.getValue(s+8+(h+c)*a,"*")))}return[i,l,d]}finally{r.stackRestore(n),s!==0&&r._OrtFree(s)}},ua=e=>{let t=Le(),
r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}\
.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},ji=async(e,t)=>{let r,n,s=Le();Array.isArray(e)?[r,n]=e:e.buffer===s.HEAPU8.
buffer?[r,n]=[e.byteOffset,e.byteLength]:[r,n]=ua(e);let a=0,o=0,i=0,l=[],c=[],d=[];try{if([o,l]=await up(t),t?.externalData&&
s.mountExternalData){let E=[];for(let C of t.externalData){let N=typeof C=="string"?C:C.path,M=typeof C=="string"?C:C.data;
E.push(Gi(M).then($=>{s.mountExternalData(N,$)}))}await Promise.all(E)}for(let E of t?.executionProviders??[])if((typeof E==
"string"?E:E.name)==="webnn"){if(s.shouldTransferToMLTensor=!1,typeof E!="string"){let C=E,N=C?.context,M=C?.gpuDevice,$=C?.
deviceType,R=C?.powerPreference;N?s.currentContext=N:M?s.currentContext=await s.webnnCreateMLContext(M):s.currentContext=
await s.webnnCreateMLContext({deviceType:$,powerPreference:R})}else s.currentContext=await s.webnnCreateMLContext();break}
a=await s._OrtCreateSession(r,n,o),s.webgpuOnCreateSession?.(a),a===0&&xe("Can't create a session."),s.jsepOnCreateSession?.(),
s.currentContext&&(s.webnnRegisterMLContext(a,s.currentContext),s.currentContext=void 0,s.shouldTransferToMLTensor=!0);let[
h,_]=Tf(a),p=!!t?.enableGraphCapture,w=[],v=[],y=[],b=[],k=[];for(let E=0;E<h;E++){let[C,N,M]=Ho(a,E);C===0&&xe("Can't g\
et an input name."),c.push(C);let $=s.UTF8ToString(C);w.push($),y.push(N===0?{name:$,isTensor:!1}:{name:$,isTensor:!0,type:ta(
N),shape:M})}for(let E=0;E<_;E++){let[C,N,M]=Ho(a,E+h);C===0&&xe("Can't get an output name."),d.push(C);let $=s.UTF8ToString(
C);v.push($),b.push(N===0?{name:$,isTensor:!1}:{name:$,isTensor:!0,type:ta(N),shape:M});{if(p&&t?.preferredOutputLocation===
void 0){k.push("gpu-buffer");continue}let R=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[$]??
"cpu",j=s.webnnIsGraphOutput;if(R==="cpu"&&j&&j(a,$)){k.push("ml-tensor-cpu-output");continue}if(R!=="cpu"&&R!=="cpu-pin\
ned"&&R!=="gpu-buffer"&&R!=="ml-tensor")throw new Error(`Not supported preferred output location: ${R}.`);if(p&&R!=="gpu\
-buffer")throw new Error(`Not supported preferred output location: ${R}. Only 'gpu-buffer' location is supported when en\
ableGraphCapture is true.`);k.push(R)}}let A=null;return k.some(E=>E==="gpu-buffer"||E==="ml-tensor"||E==="ml-tensor-cpu\
-output")&&(i=s._OrtCreateBinding(a),i===0&&xe("Can't create IO binding."),A={handle:i,outputPreferredLocations:k,outputPreferredLocationsEncoded:k.
map(E=>E==="ml-tensor-cpu-output"?"ml-tensor":E).map(E=>_i(E))}),wr.set(a,[a,c,d,A,p,!1]),[a,w,v,y,b]}catch(h){throw c.forEach(
_=>s._OrtFree(_)),d.forEach(_=>s._OrtFree(_)),i!==0&&s._OrtReleaseBinding(i)!==0&&xe("Can't release IO binding."),a!==0&&
s._OrtReleaseSession(a)!==0&&xe("Can't release session."),h}finally{s._free(r),o!==0&&s._OrtReleaseSessionOptions(o)!==0&&
xe("Can't release session options."),l.forEach(h=>s._free(h)),s.unmountExternalData?.()}},qi=e=>{let t=Le(),r=wr.get(e);
if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[n,s,a,o,i]=r;o&&(i&&t._OrtClearBoundOutputs(
o.handle)!==0&&xe("Can't clear bound outputs."),t._OrtReleaseBinding(o.handle)!==0&&xe("Can't release IO binding.")),t.jsepOnReleaseSession?.(
e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),s.forEach(l=>t._OrtFree(l)),a.forEach(l=>t._OrtFree(l)),t.
_OrtReleaseSession(n)!==0&&xe("Can't release session."),wr.delete(e)},Qo=async(e,t,r,n,s,a,o=!1)=>{if(!e){t.push(0);return}
let i=Le(),l=i.PTR_SIZE,c=e[0],d=e[1],h=e[3],_=h,p,w;if(c==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error(
"String tensor is not supported on GPU.");if(o&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for i\
nput/output index ${a} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let b=e[2].gpuBuffer;w=_n(Ur(c),d);{let k=i.
webgpuRegisterBuffer;if(!k)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');p=k(b,
n)}}else if(h==="ml-tensor"){let b=e[2].mlTensor;w=_n(Ur(c),d);let k=i.webnnRegisterMLTensor;if(!k)throw new Error('Tens\
or location "ml-tensor" is not supported without using WebNN.');p=k(n,b,Ur(c),d)}else{let b=e[2];if(Array.isArray(b)){w=
l*b.length,p=i._malloc(w),r.push(p);for(let k=0;k<b.length;k++){if(typeof b[k]!="string")throw new TypeError(`tensor dat\
a at index ${k} is not a string`);i.setValue(p+k*l,wt(b[k],r),"*")}}else{let k=i.webnnIsGraphInput,A=i.webnnIsGraphOutput;
if(c!=="string"&&k&&A){let E=i.UTF8ToString(s);if(k(n,E)||A(n,E)){let C=Ur(c);w=_n(C,d),_="ml-tensor";let N=i.webnnCreateTemporaryTensor,
M=i.webnnUploadTensor;if(!N||!M)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let $=await N(
n,C,d);M($,new Uint8Array(b.buffer,b.byteOffset,b.byteLength)),p=$}else w=b.byteLength,p=i._malloc(w),r.push(p),i.HEAPU8.
set(new Uint8Array(b.buffer,b.byteOffset,w),p)}else w=b.byteLength,p=i._malloc(w),r.push(p),i.HEAPU8.set(new Uint8Array(
b.buffer,b.byteOffset,w),p)}}let v=i.stackSave(),y=i.stackAlloc(4*d.length);try{d.forEach((k,A)=>i.setValue(y+A*l,k,l===
4?"i32":"i64"));let b=i._OrtCreateTensor(Ur(c),p,w,y,d.length,_i(_));b===0&&xe(`Can't create tensor for input/output. se\
ssion=${n}, index=${a}.`),t.push(b)}finally{i.stackRestore(v)}},Wi=async(e,t,r,n,s,a)=>{let o=Le(),i=o.PTR_SIZE,l=wr.get(
e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let c=l[0],d=l[1],h=l[2],_=l[3],p=l[4],w=l[5],
v=t.length,y=n.length,b=0,k=[],A=[],E=[],C=[],N=[],M=o.stackSave(),$=o.stackAlloc(v*i),R=o.stackAlloc(v*i),j=o.stackAlloc(
y*i),Y=o.stackAlloc(y*i);try{[b,k]=cp(a),Er("wasm prepareInputOutputTensor");for(let U=0;U<v;U++)await Qo(r[U],A,C,e,d[t[U]],
t[U],p);for(let U=0;U<y;U++)await Qo(s[U],E,C,e,h[n[U]],v+n[U],p);Ar("wasm prepareInputOutputTensor");for(let U=0;U<v;U++)
o.setValue($+U*i,A[U],"*"),o.setValue(R+U*i,d[t[U]],"*");for(let U=0;U<y;U++)o.setValue(j+U*i,E[U],"*"),o.setValue(Y+U*i,
h[n[U]],"*");if(_&&!w){let{handle:U,outputPreferredLocations:X,outputPreferredLocationsEncoded:ce}=_;if(d.length!==v)throw new Error(
`input count from feeds (${v}) is expected to be always equal to model's input count (${d.length}).`);Er("wasm bindInput\
sOutputs");for(let Z=0;Z<v;Z++){let ne=t[Z];await o._OrtBindInput(U,d[ne],A[Z])!==0&&xe(`Can't bind input[${Z}] for sess\
ion=${e}.`)}for(let Z=0;Z<y;Z++){let ne=n[Z];s[Z]?.[3]?(N.push(E[Z]),o._OrtBindOutput(U,h[ne],E[Z],0)!==0&&xe(`Can't bin\
d pre-allocated output[${Z}] for session=${e}.`)):o._OrtBindOutput(U,h[ne],0,ce[ne])!==0&&xe(`Can't bind output[${Z}] to\
 ${X[Z]} for session=${e}.`)}Ar("wasm bindInputsOutputs"),wr.set(e,[c,d,h,_,p,!0])}o.jsepOnRunStart?.(c),o.webnnOnRunStart?.(
c);let Q;_?Q=await o._OrtRunWithBinding(c,_.handle,y,j,b):Q=await o._OrtRun(c,R,$,v,Y,y,j,b),Q!==0&&xe("failed to call O\
rtRun().");let z=[],I=[];Er("wasm ProcessOutputTensor");for(let U=0;U<y;U++){let X=Number(o.getValue(j+U*i,"*"));if(X===
E[U]||N.includes(E[U])){z.push(s[U]),X!==E[U]&&o._OrtReleaseTensor(X)!==0&&xe("Can't release tensor.");continue}let ce=o.
stackSave(),Z=o.stackAlloc(4*i),ne=!1,L,O=0;try{o._OrtGetTensorData(X,Z,Z+i,Z+2*i,Z+3*i)!==0&&xe(`Can't access output te\
nsor data on index ${U}.`);let V=i===4?"i32":"i64",se=Number(o.getValue(Z,V));O=o.getValue(Z+i,"*");let ae=o.getValue(Z+
i*2,"*"),qe=Number(o.getValue(Z+i*3,V)),Ee=[];for(let Fe=0;Fe<qe;Fe++)Ee.push(Number(o.getValue(ae+Fe*i,V)));o._OrtFree(
ae)!==0&&xe("Can't free memory for tensor dims.");let Ae=Ee.reduce((Fe,ye)=>Fe*ye,1);L=ta(se);let $e=_?.outputPreferredLocations[n[U]];
if(L==="string"){if($e==="gpu-buffer"||$e==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Fe=[];
for(let ye=0;ye<Ae;ye++){let it=o.getValue(O+ye*i,"*"),be=o.getValue(O+(ye+1)*i,"*"),Me=ye===Ae-1?void 0:be-it;Fe.push(o.
UTF8ToString(it,Me))}z.push([L,Ee,Fe,"cpu"])}else if($e==="gpu-buffer"&&Ae>0){let Fe=o.webgpuGetBuffer;if(!Fe)throw new Error(
'preferredLocation "gpu-buffer" is not supported without using WebGPU.');let ye=Fe(O),it=_n(se,Ae);if(it===void 0||!Ri(L))
throw new Error(`Unsupported data type: ${L}`);ne=!0;{o.webgpuRegisterBuffer(ye,e,O);let be=o.webgpuCreateDownloader(ye,
it,e);z.push([L,Ee,{gpuBuffer:ye,download:async()=>{let Me=await be();return new(ss(L))(Me)},dispose:()=>{o._OrtReleaseTensor(
X)!==0&&xe("Can't release tensor.")}},"gpu-buffer"])}}else if($e==="ml-tensor"&&Ae>0){let Fe=o.webnnEnsureTensor,ye=o.webnnIsGraphInputOutputTypeSupported;
if(!Fe||!ye)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(_n(se,Ae)===void 0||
!$i(L))throw new Error(`Unsupported data type: ${L}`);if(!ye(e,L,!1))throw new Error(`preferredLocation "ml-tensor" for ${L}\
 output is not supported by current WebNN Context.`);let it=await Fe(e,O,se,Ee,!1);ne=!0,z.push([L,Ee,{mlTensor:it,download:o.
webnnCreateMLTensorDownloader(O,L),dispose:()=>{o.webnnReleaseTensorId(O),o._OrtReleaseTensor(X)}},"ml-tensor"])}else if($e===
"ml-tensor-cpu-output"&&Ae>0){let Fe=o.webnnCreateMLTensorDownloader(O,L)(),ye=z.length;ne=!0,I.push((async()=>{let it=[
ye,await Fe];return o.webnnReleaseTensorId(O),o._OrtReleaseTensor(X),it})()),z.push([L,Ee,[],"cpu"])}else{let Fe=ss(L),ye=new Fe(
Ae);new Uint8Array(ye.buffer,ye.byteOffset,ye.byteLength).set(o.HEAPU8.subarray(O,O+ye.byteLength)),z.push([L,Ee,ye,"cpu"])}}finally{
o.stackRestore(ce),L==="string"&&O&&o._free(O),ne||o._OrtReleaseTensor(X)}}_&&!p&&(o._OrtClearBoundOutputs(_.handle)!==0&&
xe("Can't clear bound outputs."),wr.set(e,[c,d,h,_,p,!1]));for(let[U,X]of await Promise.all(I))z[U][2]=X;return Ar("wasm\
 ProcessOutputTensor"),z}finally{o.webnnOnRunEnd?.(c),o.stackRestore(M),r.forEach(Q=>{Q&&Q[3]==="gpu-buffer"&&o.webgpuUnregisterBuffer(
Q[2].gpuBuffer)}),s.forEach(Q=>{Q&&Q[3]==="gpu-buffer"&&o.webgpuUnregisterBuffer(Q[2].gpuBuffer)}),A.forEach(Q=>o._OrtReleaseTensor(
Q)),E.forEach(Q=>o._OrtReleaseTensor(Q)),C.forEach(Q=>o._free(Q)),b!==0&&o._OrtReleaseRunOptions(b),k.forEach(Q=>o._free(
Q))}},Hi=e=>{let t=Le(),r=wr.get(e);if(!r)throw new Error("invalid session id");let n=r[0],s=t._OrtEndProfiling(n);s===0&&
xe("Can't get an profile file name."),t._OrtFree(s)},Qi=e=>{let t=[];for(let r of e){let n=r[2];!Array.isArray(n)&&"buff\
er"in n&&t.push(n.buffer)}return t}}),vr,Tt,cn,Jn,Zn,Ws,Xo,Hs,zr,Br,Ef,vp,yp,bp,Mp,xp,kp,Tp,Ep=ge(()=>{"use strict";Xr(),
wp(),Yr(),Di(),vr=()=>!!ze.wasm.proxy&&typeof document<"u",cn=!1,Jn=!1,Zn=!1,Hs=new Map,zr=(e,t)=>{let r=Hs.get(e);r?r.push(
t):Hs.set(e,[t])},Br=()=>{if(cn||!Jn||Zn||!Tt)throw new Error("worker not ready")},Ef=e=>{switch(e.data.type){case"init-\
wasm":cn=!1,e.data.err?(Zn=!0,Xo[1](e.data.err)):(Jn=!0,Xo[0]()),Ws&&(URL.revokeObjectURL(Ws),Ws=void 0);break;case"init\
-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Hs.get(e.data.type);e.data.err?t.shift()[1](
e.data.err):t.shift()[0](e.data.out);break}default:}},vp=async()=>{if(!Jn){if(cn)throw new Error("multiple calls to 'ini\
tWasm()' detected.");if(Zn)throw new Error("previous call to 'initWasm()' failed.");if(cn=!0,vr())return new Promise((e,t)=>{
Tt?.terminate(),ip().then(([r,n])=>{try{Tt=n,Tt.onerror=a=>t(a),Tt.onmessage=Ef,Xo=[e,t];let s={type:"init-wasm",in:ze};
!s.in.wasm.wasmPaths&&(r||fi)&&(s.in.wasm.wasmPaths={wasm:new URL(""+new URL("ort-wasm-simd-threaded.asyncify-CxOG5pUO.w\
asm",import.meta.url).href,import.meta.url).href}),Tt.postMessage(s),Ws=r}catch(s){t(s)}},t)});try{await zi(ze.wasm),await Vi(
ze),Jn=!0}catch(e){throw Zn=!0,e}finally{cn=!1}}},yp=async e=>{if(vr())return Br(),new Promise((t,r)=>{zr("init-ep",[t,r]);
let n={type:"init-ep",in:{epName:e,env:ze}};Tt.postMessage(n)});await Ui(ze,e)},bp=async e=>vr()?(Br(),new Promise((t,r)=>{
zr("copy-from",[t,r]);let n={type:"copy-from",in:{buffer:e}};Tt.postMessage(n,[e.buffer])})):ua(e),Mp=async(e,t)=>{if(vr()){
if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Br(),
new Promise((r,n)=>{zr("create",[r,n]);let s={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.
push(e.buffer),Tt.postMessage(s,a)})}else return ji(e,t)},xp=async e=>{if(vr())return Br(),new Promise((t,r)=>{zr("relea\
se",[t,r]);let n={type:"release",in:e};Tt.postMessage(n)});qi(e)},kp=async(e,t,r,n,s,a)=>{if(vr()){if(r.some(o=>o[3]!=="\
cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(s.some(o=>o))throw new Error("pre-allocated \
output tensor is not supported for proxy.");return Br(),new Promise((o,i)=>{zr("run",[o,i]);let l=r,c={type:"run",in:{sessionId:e,
inputIndices:t,inputs:l,outputIndices:n,options:a}};Tt.postMessage(c,Qi(l))})}else return Wi(e,t,r,n,s,a)},Tp=async e=>{
if(vr())return Br(),new Promise((t,r)=>{zr("end-profiling",[t,r]);let n={type:"end-profiling",in:e};Tt.postMessage(n)});
Hi(e)}}),Yo,Af,Ap,oM=ge(()=>{"use strict";Xr(),Ep(),Tn(),Ni(),dp(),Yo=(e,t)=>{switch(e.location){case"cpu":return[e.type,
e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[
e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},
Af=e=>{switch(e[3]){case"cpu":return new Lt(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Ri(t))throw new Error(`not \
supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:n,dispose:s}=e[2];return Lt.fromGpuBuffer(
r,{dataType:t,dims:e[1],download:n,dispose:s})}case"ml-tensor":{let t=e[0];if(!$i(t))throw new Error(`not supported data\
 type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:n,dispose:s}=e[2];return Lt.fromMLTensor(r,{dataType:t,
dims:e[1],download:n,dispose:s})}default:throw new Error(`invalid data location: ${e[3]}`)}},Ap=class{async fetchModelAndCopyToWasmMemory(e){
return bp(await Gi(e))}async loadModel(e,t){Hr();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):
r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Mp(r,t),Qr()}async dispose(){
return xp(this.sessionId)}async run(e,t,r){Hr();let n=[],s=[];Object.entries(e).forEach(h=>{let _=h[0],p=h[1],w=this.inputNames.
indexOf(_);if(w===-1)throw new Error(`invalid input '${_}'`);n.push(p),s.push(w)});let a=[],o=[];Object.entries(t).forEach(
h=>{let _=h[0],p=h[1],w=this.outputNames.indexOf(_);if(w===-1)throw new Error(`invalid output '${_}'`);a.push(p),o.push(
w)});let i=n.map((h,_)=>Yo(h,()=>`input "${this.inputNames[s[_]]}"`)),l=a.map((h,_)=>h?Yo(h,()=>`output "${this.outputNames[o[_]]}\
"`):null),c=await kp(this.sessionId,s,i,o,l,r),d={};for(let h=0;h<c.length;h++)d[this.outputNames[o[h]]]=a[h]??Af(c[h]);
return Qr(),d}startProfiling(){}endProfiling(){Tp(this.sessionId)}}}),Cp={};ds(Cp,{OnnxruntimeWebAssemblyBackend:()=>mi,
initializeFlags:()=>pi,wasmBackend:()=>Sp});var pi,mi,Sp,iM=ge(()=>{"use strict";Xr(),Ep(),oM(),pi=()=>{(typeof ze.wasm.
initTimeout!="number"||ze.wasm.initTimeout<0)&&(ze.wasm.initTimeout=0);let e=ze.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&
e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` \
and ignore SIMD feature checking.`),ze.wasm.simd=!1),typeof ze.wasm.proxy!="boolean"&&(ze.wasm.proxy=!1),typeof ze.wasm.
trace!="boolean"&&(ze.wasm.trace=!1),typeof ze.wasm.numThreads!="number"||!Number.isInteger(ze.wasm.numThreads)||ze.wasm.
numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ze.wasm.numThreads=1;else{let t=typeof navigator>"u"?B0("nod\
e:os").cpus().length:navigator.hardwareConcurrency;ze.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},mi=class{async init(e){
pi(),await vp(),await yp(e)}async createInferenceSessionHandler(e,t){let r=new Ap;return await r.loadModel(e,t),r}},Sp=new mi});
Xr();Xr();Xr();var lM="1.31.0-dev.20260914-8d85527a0",cM=tp;{let e=(iM(),oa(Cp)).wasmBackend;qr("webgpu",e,5),qr("webnn",
e,5),qr("cpu",e,10),qr("wasm",e,10)}Object.defineProperty(ze.versions,"web",{value:lM,enumerable:!0});const uM=Object.freeze(
Object.defineProperty({__proto__:null,get InferenceSession(){return Oi},get TRACE(){return ia},get TRACE_EVENT_BEGIN(){return Er},
get TRACE_EVENT_END(){return Ar},get TRACE_FUNC_BEGIN(){return Hr},get TRACE_FUNC_END(){return Qr},get Tensor(){return Lt},
default:cM,get env(){return ze},get registerBackend(){return qr}},Symbol.toStringTag,{value:"Module"})),dM=(e,t)=>{const r=typeof document<
"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];const n=r.getContext(
"2d");if(n!=null){let s,a;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(s=e.dims[2],a=e.dims[3]):(s=e.dims[3],a=e.dims[2]);
const o=t?.format!==void 0?t.format:"RGB",i=t?.norm;let l,c;i===void 0||i.mean===void 0?l=[255,255,255,255]:typeof i.mean==
"number"?l=[i.mean,i.mean,i.mean,i.mean]:(l=[i.mean[0],i.mean[1],i.mean[2],0],i.mean[3]!==void 0&&(l[3]=i.mean[3])),i===
void 0||i.bias===void 0?c=[0,0,0,0]:typeof i.bias=="number"?c=[i.bias,i.bias,i.bias,i.bias]:(c=[i.bias[0],i.bias[1],i.bias[2],
0],i.bias[3]!==void 0&&(c[3]=i.bias[3]));const d=a*s;let h=0,_=d,p=d*2,w=-1;o==="RGBA"?(h=0,_=d,p=d*2,w=d*3):o==="RGB"?(h=
0,_=d,p=d*2):o==="RBG"&&(h=0,p=d,_=d*2);for(let v=0;v<a;v++)for(let y=0;y<s;y++){const b=(e.data[h++]-c[0])*l[0],k=(e.data[_++]-
c[1])*l[1],A=(e.data[p++]-c[2])*l[2],E=w===-1?255:(e.data[w++]-c[3])*l[3];n.fillStyle="rgba("+b+","+k+","+A+","+E+")",n.
fillRect(y,v,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error(
"Can not access image data")},hM=(e,t)=>{const r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(
1,1).getContext("2d");let n;if(r!=null){let s,a,o;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(s=e.dims[2],a=e.dims[1],
o=e.dims[3]):(s=e.dims[3],a=e.dims[2],o=e.dims[1]);const i=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm;let c,
d;l===void 0||l.mean===void 0?c=[255,255,255,255]:typeof l.mean=="number"?c=[l.mean,l.mean,l.mean,l.mean]:(c=[l.mean[0],
l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(c[3]=l.mean[3])),l===void 0||l.bias===void 0?d=[0,0,0,0]:typeof l.bias=="n\
umber"?d=[l.bias,l.bias,l.bias,l.bias]:(d=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(d[3]=l.bias[3]));const h=a*
s;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!=="RGBA"||o===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error(
"Tensor format doesn't match input tensor dims");const _=4;let p=0,w=1,v=2,y=3,b=0,k=h,A=h*2,E=-1;i==="RGBA"?(b=0,k=h,A=
h*2,E=h*3):i==="RGB"?(b=0,k=h,A=h*2):i==="RBG"&&(b=0,A=h,k=h*2),n=r.createImageData(s,a);for(let C=0;C<a*s;p+=_,w+=_,v+=
_,y+=_,C++)n.data[p]=(e.data[b++]-d[0])*c[0],n.data[w]=(e.data[k++]-d[1])*c[1],n.data[v]=(e.data[A++]-d[2])*c[2],n.data[y]=
E===-1?255:(e.data[E++]-d[3])*c[3]}else throw new Error("Can not access image data");return n},Ko=(e,t)=>{if(e===void 0)
throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and\
 width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");const{height:r,
width:n}=t,s=t.norm??{mean:255,bias:0};let a,o;typeof s.mean=="number"?a=[s.mean,s.mean,s.mean,s.mean]:a=[s.mean[0],s.mean[1],
s.mean[2],s.mean[3]??255],typeof s.bias=="number"?o=[s.bias,s.bias,s.bias,s.bias]:o=[s.bias[0],s.bias[1],s.bias[2],s.bias[3]??
0];const i=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",c=r*
n,d=l==="RGBA"?new Float32Array(c*4):new Float32Array(c*3);let h=4,_=0,p=1,w=2,v=3,y=0,b=c,k=c*2,A=-1;i==="RGB"&&(h=3,_=
0,p=1,w=2,v=-1),l==="RGBA"?A=c*3:l==="RBG"?(y=0,k=c,b=c*2):l==="BGR"&&(k=0,b=c,y=c*2);for(let C=0;C<c;C++,_+=h,w+=h,p+=h,
v+=h)d[y++]=(e[_]+o[0])/a[0],d[b++]=(e[p]+o[1])/a[1],d[k++]=(e[w]+o[2])/a[2],A!==-1&&v!==-1&&(d[A++]=(e[v]+o[3])/a[3]);return l===
"RGBA"?new At("float32",d,[1,4,r,n]):new At("float32",d,[1,3,r,n])},fM=async(e,t)=>{const r=typeof HTMLImageElement<"u"&&
e instanceof HTMLImageElement,n=typeof ImageData<"u"&&e instanceof ImageData,s=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,
a=typeof e=="string";let o,i=t??{};const l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<
"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},c=d=>typeof HTMLCanvasElement<"u"&&d instanceof
HTMLCanvasElement||d instanceof OffscreenCanvas?d.getContext("2d"):null;if(r){const d=l();d.width=e.width,d.height=e.height;
const h=c(d);if(h!=null){let _=e.height,p=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(_=t.
resizedHeight,p=t.resizedWidth),t!==void 0){if(i=t,t.tensorFormat!==void 0)throw new Error("Image input config format mu\
st be RGBA for HTMLImageElement");i.tensorFormat="RGBA",i.height=_,i.width=p}else i.tensorFormat="RGBA",i.height=_,i.width=
p;h.drawImage(e,0,0),o=h.getImageData(0,0,p,_).data}else throw new Error("Can not access image data")}else if(n){let d,h;
if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(d=t.resizedHeight,h=t.resizedWidth):(d=e.height,h=e.width),
t!==void 0&&(i=t),i.format="RGBA",i.height=d,i.width=h,t!==void 0){const _=l();_.width=h,_.height=d;const p=c(_);if(p!=null)
p.putImageData(e,0,0),o=p.getImageData(0,0,h,d).data;else throw new Error("Can not access image data")}else o=e.data}else if(s){
if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");const d=l();d.width=e.width,d.height=
e.height;const h=c(d);if(h!=null){const _=e.height,p=e.width;return h.drawImage(e,0,0,p,_),o=h.getImageData(0,0,p,_).data,
i.height=_,i.width=p,Ko(o,i)}else throw new Error("Can not access image data")}else{if(a)return new Promise((d,h)=>{const _=l(),
p=c(_);if(!e||!p)return h();const w=new Image;w.crossOrigin="Anonymous",w.src=e,w.onload=()=>{_.width=w.width,_.height=w.
height,p.drawImage(w,0,0,_.width,_.height);const v=p.getImageData(0,0,_.width,_.height);i.height=_.height,i.width=_.width,
d(Ko(v.data,i))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(o!==void 0)return Ko(
o,i);throw new Error("Input data provided is not supported - aborted tensor creation")},_M=(e,t)=>{const{width:r,height:n,
download:s,dispose:a}=t,o=[1,n,r,4];return new At({location:"texture",type:"float32",texture:e,dims:o,download:s,dispose:a})},
pM=(e,t)=>{const{dataType:r,dims:n,download:s,dispose:a}=t;return new At({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,
dims:n,download:s,dispose:a})},mM=(e,t)=>{const{dataType:r,dims:n,download:s,dispose:a}=t;return new At({location:"ml-te\
nsor",type:r??"float32",mlTensor:e,dims:n,download:s,dispose:a})},gM=(e,t,r)=>new At({location:"cpu-pinned",type:e,data:t,
dims:r??[t.length]}),mn=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],
["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],
["uint4",Uint8Array]]),ra=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],
[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]);let Cf=!1;const wM=()=>{if(!Cf){
Cf=!0;const e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.
Float16Array,n=typeof r<"u"&&r.from;e&&(mn.set("int64",BigInt64Array),ra.set(BigInt64Array,"int64")),t&&(mn.set("uint64",
BigUint64Array),ra.set(BigUint64Array,"uint64")),n?(mn.set("float16",r),ra.set(r,"float16")):mn.set("float16",Uint16Array)}},
vM=e=>{let t=1;for(let r=0;r<e.length;r++){const n=e[r];if(typeof n!="number"||!Number.isSafeInteger(n))throw new TypeError(
`dims[${r}] must be an integer, got: ${n}`);if(n<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got:\
 ${n}`);t*=n}return t},yM=(e,t)=>{switch(e.location){case"cpu":return new At(e.type,e.data,t);case"cpu-pinned":return new At(
{location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new At({location:"texture",texture:e.texture,
type:e.type,dims:t});case"gpu-buffer":return new At({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"\
ml-tensor":return new At({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorR\
eshape: tensor location ${e.location} is not supported`)}};let At=class{constructor(t,r,n){wM();let s,a;if(typeof t=="ob\
ject"&&"location"in t)switch(this.dataLocation=t.location,s=t.type,a=t.dims,t.location){case"cpu-pinned":{const i=mn.get(
s);if(!i)throw new TypeError(`unsupported type "${s}" to create tensor from pinned buffer`);if(!(t.data instanceof i))throw new TypeError(
`buffer should be of type ${i.name}`);this.cpuData=t.data;break}case"texture":{if(s!=="float32")throw new TypeError(`uns\
upported type "${s}" to create tensor from texture`);this.gpuTextureData=t.texture,this.downloader=t.download,this.disposer=
t.dispose;break}case"gpu-buffer":{if(s!=="float32"&&s!=="float16"&&s!=="int32"&&s!=="int64"&&s!=="uint32"&&s!=="uint8"&&
s!=="bool"&&s!=="uint4"&&s!=="int4")throw new TypeError(`unsupported type "${s}" to create tensor from gpu buffer`);this.
gpuBufferData=t.gpuBuffer,this.downloader=t.download,this.disposer=t.dispose;break}case"ml-tensor":{if(s!=="float32"&&s!==
"float16"&&s!=="int32"&&s!=="int64"&&s!=="uint32"&&s!=="uint64"&&s!=="int8"&&s!=="uint8"&&s!=="bool"&&s!=="uint4"&&s!=="\
int4")throw new TypeError(`unsupported type "${s}" to create tensor from MLTensor`);this.mlTensorData=t.mlTensor,this.downloader=
t.download,this.disposer=t.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}\
'`)}else{let i,l;if(typeof t=="string")if(s=t,l=n,t==="string"){if(!Array.isArray(r))throw new TypeError("A string tenso\
r's data must be a string array.");i=r}else{const c=mn.get(t);if(c===void 0)throw new TypeError(`Unsupported tensor type\
: ${t}.`);if(Array.isArray(r)){if(t==="float16"&&c===Uint16Array||t==="uint4"||t==="int4")throw new TypeError(`Creating \
a ${t} tensor from number array is not supported. Please use ${c.name} as data.`);t==="uint64"||t==="int64"?i=c.from(r,BigInt):
i=c.from(r)}else if(r instanceof c)i=r;else if(r instanceof Uint8ClampedArray)if(t==="uint8")i=Uint8Array.from(r);else throw new TypeError(
"A Uint8ClampedArray tensor's data must be type of uint8");else if(t==="float16"&&r instanceof Uint16Array&&c!==Uint16Array)
i=new globalThis.Float16Array(r.buffer,r.byteOffset,r.length);else throw new TypeError(`A ${s} tensor's data must be typ\
e of ${c}`)}else if(l=r,Array.isArray(t)){if(t.length===0)throw new TypeError("Tensor type cannot be inferred from an em\
pty array.");const c=typeof t[0];if(c==="string")s="string",i=t;else if(c==="boolean")s="bool",i=Uint8Array.from(t);else
throw new TypeError(`Invalid element type of data array: ${c}.`)}else if(t instanceof Uint8ClampedArray)s="uint8",i=Uint8Array.
from(t);else{const c=ra.get(t.constructor);if(c===void 0)throw new TypeError(`Unsupported type for tensor data: ${t.constructor}\
.`);s=c,i=t}if(l===void 0)l=[i.length];else if(!Array.isArray(l))throw new TypeError("A tensor's dims must be a number a\
rray");a=l,this.cpuData=i,this.dataLocation="cpu"}const o=vM(a);if(this.cpuData&&o!==this.cpuData.length&&!((s==="uint4"||
s==="int4")&&Math.ceil(o/2)===this.cpuData.length))throw new Error(`Tensor's size(${o}) does not match data length(${this.
cpuData.length}).`);this.type=s,this.dims=a,this.size=o}static async fromImage(t,r){return fM(t,r)}static fromTexture(t,r){
return _M(t,r)}static fromGpuBuffer(t,r){return pM(t,r)}static fromMLTensor(t,r){return mM(t,r)}static fromPinnedBuffer(t,r,n){
return gM(t,r,n)}toDataURL(t){return dM(this,t)}toImageData(t){return hM(this,t)}get data(){if(this.ensureValid(),!this.
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
 a tensor that owns GPU resource.");return yM(this,t)}};const bM=At;var Jo={},MM=Object.defineProperty,hs=(e,t)=>{for(var r in t)
MM(e,r,{get:t[r],enumerable:!0})},bt={},Jt={},xM={},kM="4.3.2",Xi=typeof self<"u",yn=!Lp(bt),Pp=!Lp(Jt),da=Xi&&"caches"in
self,TM=typeof globalThis.Deno<"u",Ea=TM&&da&&!yn,Fp=typeof process<"u",Ip=Fp&&process?.release?.name==="node"&&!Ea,Yi=typeof window<
"u"&&typeof window.document<"u",Ki=Xi&&["DedicatedWorkerGlobalScope","ServiceWorkerGlobalScope","SharedWorkerGlobalScope"].
includes(self.constructor?.name),EM=Yi||Ki||Ea,AM=Ip||typeof navigator<"u"&&"gpu"in navigator,CM=typeof navigator<"u"&&"\
ml"in navigator,SM=typeof crypto<"u"&&typeof crypto.getRandomValues=="function",PM=typeof chrome<"u"&&typeof chrome.runtime<
"u"&&typeof chrome.runtime.id=="string",FM=typeof ServiceWorkerGlobalScope<"u"&&Xi&&self instanceof ServiceWorkerGlobalScope,
IM=()=>{if(typeof navigator>"u")return!1;const e=navigator.userAgent;if(!((navigator.vendor||"").indexOf("Apple")>-1&&!e.
match(/CriOS|FxiOS|EdgiOS|OPiOS|mercury|brave/i)&&!e.includes("Chrome")&&!e.includes("Android")))return!1;const r=e.match(
/Version\/(\d+)/);return r?parseInt(r[1],10)<26:!1},LM=IM(),fe=Object.freeze({IS_BROWSER_ENV:Yi,IS_WEBWORKER_ENV:Ki,IS_WEB_ENV:EM,
IS_SERVICE_WORKER_ENV:FM,IS_DENO_WEB_RUNTIME:Ea,IS_WEB_CACHE_AVAILABLE:da,IS_WEBGPU_AVAILABLE:AM,IS_WEBNN_AVAILABLE:CM,IS_SAFARI_BELOW_26:LM,
IS_PROCESS_AVAILABLE:Fp,IS_NODE_ENV:Ip,IS_FS_AVAILABLE:yn,IS_PATH_AVAILABLE:Pp,IS_CRYPTO_AVAILABLE:SM,IS_CHROME_AVAILABLE:PM}),
Ji=yn&&Pp,ha="./";if(Ji){const e=import.meta.url;e?ha=Jt.dirname(Jt.dirname(xM.fileURLToPath(e))):typeof __dirname<"u"&&
(ha=Jt.dirname(__dirname))}var OM=Ji?Jt.join(ha,"/.cache/"):null,Sf="/models/",NM=Ji?Jt.join(ha,Sf):Sf,DM=typeof globalThis.
fetch=="function"?globalThis.fetch.bind(globalThis):void 0,Nt=Object.freeze({DEBUG:10,INFO:20,WARNING:30,ERROR:40,NONE:50}),
Pf=Nt.WARNING,we={version:kM,backends:{onnx:{}},get logLevel(){return Pf},set logLevel(e){Pf=e,we.backends.onnx?.setLogLevel?.(
e)},allowRemoteModels:!0,remoteHost:"https://huggingface.co/",remotePathTemplate:"{model}/resolve/{revision}/",allowLocalModels:!(Yi||
Ki||Ea),localModelPath:NM,useFS:yn,useBrowserCache:da,useFSCache:yn,cacheDir:OM,useCustomCache:!1,customCache:null,useWasmCache:da||
yn,cacheKey:"transformers-cache",experimental_useCrossOriginStorage:!1,fetch:DM};function Lp(e){return Object.keys(e).length===
0}var ft=class{constructor(){let e=function(...t){return e._call(...t)};return Object.setPrototypeOf(e,new.target.prototype)}_call(...e){
throw Error("Must implement _call method in subclass")}};function kr(e,t){e&&e(t)}var fa=class extends ft{constructor(e,t){
super(),this.callback=e,this.files_loading=t,this.loads=new Map}_call(e){if(e.status==="progress"){this.files_loading[e.
file]={loaded:e.loaded,total:e.total};const t=Object.values(this.files_loading).reduce((s,a)=>s+a.loaded,0),r=Object.values(
this.files_loading).reduce((s,a)=>s+a.total,0),n=r>0?t/r*100:0;this.callback({status:"progress_total",name:e.name,progress:n,
loaded:t,total:r,files:structuredClone(this.files_loading)})}this.callback(e)}};function zM(e){return Number.isInteger(e)||
typeof e=="bigint"}function Ff(e){return e==null||e===-1}function If(e){const t=[];let r=e;for(;Array.isArray(r);)t.push(
r.length),r=r[0];return t}function Dt(...e){return Array.prototype.concat.apply([],e)}function BM(...e){return e.reduce(
(t,r)=>t.flatMap(n=>r.map(s=>[n,s])))}function _a(e,t){return Math.abs((e+t)%(2*t)-t)}function Ze(e,t){return Object.assign(
{},...t.map(r=>{if(e[r]!==void 0)return{[r]:e[r]}}))}function RM(e,t){let r=0;for(const n of e)n===t&&++r;return r}var de={
error(...e){we.logLevel<=Nt.ERROR&&console.error(...e)},warn(...e){we.logLevel<=Nt.WARNING&&console.warn(...e)},info(...e){
we.logLevel<=Nt.INFO&&console.log(...e)},debug(...e){we.logLevel<=Nt.DEBUG&&console.log(...e)},log(...e){this.info(...e)}},
$M=class{constructor(e){this.trie=this._build_trie(e)}_build_trie(e){const t=Object.create(null);for(const r of e){let n=t;
for(let s=0;s<r.length;++s){const a=r[s];n=n[a]??=Object.create(null)}n.end=r}return t}split(e){const t=[],r=e.length;let n=0,
s=0;for(;s<r;){let a=this.trie,o=null,i=s;for(;i<r&&(a=a[e[i]]);)a.end&&(o=a.end),++i;o?(s>n&&t.push(e.slice(n,s)),t.push(
o),s+=o.length,n=s):++s}return n<r&&t.push(e.slice(n)),t}},Lf=$M,GM=class{constructor(e){this.content=e.content,this.id=
e.id,this.single_word=e.single_word??!1,this.lstrip=e.lstrip??!1,this.rstrip=e.rstrip??!1,this.special=e.special??!1,this.
normalized=e.normalized??!this.special}},VM=GM,Op=(e,t)=>{try{return new RegExp(e,t)}catch(r){if(!(r instanceof SyntaxError))
throw r;const n=new Map,s=e.replace(/(\\[pP])\{([^}=]+)\}/g,(a,o,i,l)=>{let c=0;for(let h=l-1;h>=0&&e[h]==="\\";--h)++c;
if(c%2===1)return a;let d=n.get(i);if(d===void 0){try{new RegExp(`\\p{${i}}`,"u"),d=i}catch{d=`Script=${i}`}n.set(i,d)}return`${o}\
{${d}}`});if(s===e)throw r;try{return new RegExp(s,t)}catch{throw r}}},Zi=e=>e.replace(/ \./g,".").replace(/ \?/g,"?").replace(
/ \!/g,"!").replace(/ ,/g,",").replace(/ \' /g,"'").replace(/ n't/g,"n't").replace(/ 'm/g,"'m").replace(/ 's/g,"'s").replace(
/ 've/g,"'ve").replace(/ 're/g,"'re"),Aa=(e,t=!0)=>{if(e.Regex!==void 0){const r=ax(rx(e.Regex));return Op(r,"gu")}else if(e.
String!==void 0){const r=ox(e.String);return new RegExp(t?r:`(${r})`,"gu")}else return console.warn("Unknown pattern typ\
e:",e),null},kn="\\p{Alphabetic}\\p{M}\\p{Nd}\\p{Pc}",Np=`${kn}\\u00B2\\u00B3\\u00B9\\u00BC-\\u00BE`,Zt=`[${Np}]`,Dp=`[^${Np}\
]`,UM=`(?:(?<!${Zt})(?=${Zt})|(?<=${Zt})(?!${Zt}))`,jM=`(?:(?<!${Zt})(?!${Zt})|(?<=${Zt})(?=${Zt}))`,qM="(?:(?<![\\s\\S])|\
(?<=\\n))",WM="(?:(?=\\n)|(?![\\s\\S]))",as="0-9A-Fa-f",HM=new Map([["A","(?<![\\s\\S])"],["z","(?![\\s\\S])"],["Z","(?=\
\\n?(?![\\s\\S]))"],["h",`[${as}]`],["H",`[^${as}]`],["w",Zt],["W",Dp],["d","\\p{Nd}"],["D","\\P{Nd}"],["s","\\p{White_Sp\
ace}"],["S","\\P{White_Space}"],["b",UM],["B",jM],["a","\\x07"],["e","\\x1B"]]),QM=new Map([["h",as],["w",kn],["d","\\p{N\
d}"],["D","\\P{Nd}"],["s","\\p{White_Space}"],["S","\\P{White_Space}"],["a","\\x07"],["e","\\x1B"]]),XM=new Map([["W",`[\
^${kn}]`],["H",`[^${as}]`]]),zp=new Map([[`
`,"\\n"],["\r","\\r"],["	","\\t"],["\f","\\f"],["\v","\\v"]]),YM=new Map([["alpha","\\p{Alphabetic}"],["alnum","\\p{Alpha\
betic}\\p{Nd}"],["digit","\\p{Nd}"],["lower","\\p{Lowercase}"],["upper","\\p{Uppercase}"],["space","\\p{White_Space}"],[
"blank","\\t\\p{Zs}"],["punct","\\p{P}\\p{S}"],["cntrl","\\p{Cc}"],["word",kn],["xdigit",as]]),Bp="^$\\.*+?()[]{}|/",KM=/^\(\?(?:<[=!]|<[A-Za-z_][A-Za-z0-9_]*>|[:=!>])/,
Rp=/^\\([pPxu])\{([^}]*)\}/,JM=/^\{(\d+(?:,\d*)?|,\d+)\}/,ZM=/^\[:(\^?)(\p{Alphabetic}+):\]/u,ex=/^\[:\^:\]/,tx=/^\[(?:\.[^\]]*\.\]|=[^\]]*=\])/,
$p=/^(?:\\x[0-9A-Fa-f]{2}|\\u[0-9A-Fa-f]{4}|\\c[A-Za-z])/,Gp=e=>e>="A"&&e<="Z"||e>="a"&&e<="z",pa=(e,t)=>String.fromCodePoint(
e.codePointAt(t)),Of=e=>{if(!/^[0-9A-Fa-f]{1,8}$/.test(e))return null;const t=Number.parseInt(e,16);if(t>127)return null;
const r=String.fromCharCode(t);return Gp(r)?`[${r.toLowerCase()}${r.toUpperCase()}]`:null},rx=e=>e.replace(/\[\^\(\\s\|\[([^\]]+)\]\)\]/g,
"[^()|\\s$1]"),Vp="[\\s\\S]",Nf=256,Df=()=>({fragment:"",alternatives:[],tail:null,contains_complex_set:!1}),el=e=>{throw new SyntaxError(
`Unsupported range with a set-valued character-class operand at index ${e}`)},ma=(e,t,r,n=!0)=>{e.tail==="range"&&el(r),
e.alternatives.push(t),e.tail="set",e.contains_complex_set=e.contains_complex_set||n},Tr=(e,t,r=!1,n=-1)=>{if(r&&e.tail===
"range"&&el(n),e.tail==="range"){e.fragment+=t,e.tail="complete_range";return}e.fragment+=t,e.tail=r?"set":"scalar",e.contains_complex_set=
e.contains_complex_set||r},nx=(e,t,r)=>{const n=Rp.exec(e.slice(t));if(n){const[_,p,w]=n;if(p==="P"&&w==="Word")ma(r,`[^${kn}\
]`,t);else{const v=p==="x"?`\\u{${w}}`:p==="p"&&w==="Word"?kn:_;Tr(r,v,p==="p"||p==="P",t)}return t+_.length}const s=$p.
exec(e.slice(t));if(s)return Tr(r,s[0]),t+s[0].length;if(t+1>=e.length)throw new SyntaxError(`Unterminated escape in cha\
racter class at index ${t}`);const a=pa(e,t+1),o=t+1+a.length,i=zp.get(a);if(i!==void 0)return Tr(r,i),o;const l=XM.get(
a);if(l!==void 0)return ma(r,l,t),o;const c=QM.get(a);let d,h=!1;return c!==void 0?(d=c,h=a!=="a"&&a!=="e"):/[A-Za-z0-9]/.
test(a)?d=`\\${a}`:Bp.includes(a)||a==="-"?d=`\\${a}`:d=a,Tr(r,d,h,t),o},Up=e=>e.length===1?e[0]:`(?:(?=(?:${e.join("|")}\
))${Vp})`,zf=e=>{const t=e.fragment.length===0?e.alternatives:[`[${e.fragment}]`,...e.alternatives];return Up(t)},sx=e=>{
const t=Op(`^(?:${e})$`,"u");let r="";for(let n=0;n<26;++n){const s=String.fromCharCode(65+n),a=String.fromCharCode(97+n),
o=t.test(s),i=t.test(a);o!==i&&(r+=o?a:s)}return r},jp=(e,t,r,n=!0,s=1)=>{if(s>Nf)throw new SyntaxError(`Maximum charact\
er-class nesting depth of ${Nf} exceeded at index ${t}`);let a=t+1;const o=e[a]==="^";o&&++a;const i=a,l=[Df()];let c=l[0],
d=!1;for(;a<e.length;){const h=pa(e,a);if(h==="\\"){a=nx(e,a,c);continue}if(h==="]"){if(a===i){Tr(c,"\\]"),++a;continue}
if(c.tail===null)throw l.length>1?new SyntaxError(`Malformed character-class intersection with an empty operand at index\
 ${a}`):new SyntaxError(`Empty character class at index ${t}`);const _=l.some(k=>k.contains_complex_set);if(o&&l.length>
1&&d)throw new SyntaxError(`Unsupported outer-negated character-class intersection with a nested negated class containin\
g a Unicode property, POSIX class, or shorthand at index ${t}`);const p=zf(l[0]);let w=p;if(l.length>1){let k="";for(let A=1;A<
l.length;++A)k+=`(?=${zf(l[A])})`;w=`(?:${k}${p})`}const v=l.length===1&&c.alternatives.length===0;let y=c.fragment;if(r&&
n){const k=sx(w);k.length>0&&(v?(y+=k,w=`[${y}]`):w=Up([w,`[${k}]`]))}return{atom:o?v?`[^${y}]`:`(?:(?!${w})${Vp})`:w,end:a+
1,negated:o,contains_complex_set:_,contains_nested_negated_complex_set:d}}if(e.startsWith("&&",a)){if(c.tail===null)throw new SyntaxError(
`Malformed character-class intersection with an empty operand at index ${a}`);c=Df(),l.push(c),a+=2;continue}if(h==="["){
const _=e.slice(a);if(ex.test(_))throw new SyntaxError(`Malformed empty negated POSIX character class at index ${a}`);const p=ZM.
exec(_);if(p){const[,v,y]=p,b=YM.get(y);if(b===void 0)throw new SyntaxError(`Unsupported POSIX character class "${y}" at\
 index ${a}`);if(r&&v&&(y==="lower"||y==="upper"))throw new SyntaxError(`Unsupported negated POSIX ${y} class inside an \
inline case-insensitive group`);v?ma(c,`[^${b}]`,a):Tr(c,b,!0,a),a+=p[0].length;continue}if(tx.test(_))throw new SyntaxError(
`Unsupported POSIX collating or equivalence bracket expression at index ${a}`);const w=jp(e,a,r,!1,s+1);ma(c,w.atom,a,w.
contains_complex_set),d||=w.contains_nested_negated_complex_set||w.negated&&w.contains_complex_set,a=w.end;continue}if(h===
"-"){const _=e[a+1]==="]"||e.startsWith("&&",a+1);c.tail==="set"&&!_&&el(a),c.tail===null||c.tail==="range"||c.tail==="c\
omplete_range"||_?Tr(c,"\\-"):(c.fragment+="-",c.tail="range"),++a;continue}Tr(c,h==="^"&&c.fragment.length===0?"\\^":h),
a+=h.length}throw new SyntaxError(`${l.length>1?"Unterminated character-class intersection":"Unterminated character clas\
s"} at index ${t}`)},ax=e=>{let t="",r=-1,n=!1,s=!1;const a=[],o=i=>{r=t.length,t+=i,n=!1};for(let i=0;i<e.length;){const l=pa(
e,i);if(l==="\\"){const c=Rp.exec(e.slice(i));if(c){const[v,y,b]=c;let k=v;if(y==="x"){const A=`\\u{${b}}`;k=s?Of(b)??A:
A}else b==="Word"&&(k=y==="p"?Zt:Dp);o(k),i+=v.length;continue}const d=$p.exec(e.slice(i));if(d){const v=d[0],y=s&&v[1]!==
"c"?Of(v.slice(2))??v:v;o(y),i+=v.length;continue}if(i+1>=e.length){t+=l;break}const h=pa(e,i+1);if(i+=1+h.length,h==="G")
continue;const _=zp.get(h);if(_!==void 0){o(_);continue}const p=HM.get(h);let w;p!==void 0?w=p:/[A-Za-z0-9]/.test(h)?w=`\
\\${h}`:Bp.includes(h)?w=`\\${h}`:w=h,o(w);continue}switch(l){case"[":{const c=jp(e,i,s);o(c.atom),i=c.end;continue}case"\
]":o("\\]"),++i;continue;case".":o("[^\\n]"),++i;continue;case"^":o(qM),++i;continue;case"$":o(WM),++i;continue;case"(":{
const c=e.startsWith("(?i:",i),d=c?"(?i:":KM.exec(e.slice(i))?.[0]??"(",h=c||d==="(?>"?"(?:":d;a.push([t.length,s]),c&&(s=
!0),t+=h,n=!1,i+=d.length;continue}case")":t+=l,[r,s]=a.pop()??[-1,!1],n=!1,++i;continue;case"|":t+=l,r=-1,n=!1,++i;continue;case"\
{":{const c=JM.exec(e.slice(i));if(!c||r<0){o("\\{"),++i;continue}const d=c[1].startsWith(",")?`0${c[1]}`:c[1];i+=c[0].length;
const h=e[i];h==="+"||h==="*"?(t=`${t.slice(0,r)}(?:${t.slice(r)}{${d}})${h}`,++i):t+=`{${d}}`,n=!0;continue}case"}":o("\
\\}"),++i;continue;case"+":if(n){++i;continue}t+=l,n=!0,++i;continue;case"*":case"?":t+=l,n=!0,++i;continue;default:o(s&&
Gp(l)?`[${l.toLowerCase()}${l.toUpperCase()}]`:l),i+=l.length;continue}}return t},ox=e=>e.replace(/[.*+?^${}()|[\]\\]/g,
"\\$&"),ix=(e,t,r)=>{const n=[];let s=0;for(;s<e.length;){if(n.push(e[s]),(t.get(e[s])??r)!==r){++s;continue}for(;++s<e.
length&&(t.get(e[s])??r)===r;)t.get(n.at(-1))!==r&&(n[n.length-1]+=e[s])}return n},lx=e=>e>=19968&&e<=40959||e>=13312&&e<=
19903||e>=131072&&e<=173791||e>=173824&&e<=177983||e>=177984&&e<=178207||e>=178208&&e<=183983||e>=63744&&e<=64255||e>=194560&&
e<=195103,cx=e=>Number.isInteger(e)||typeof e=="bigint",ux=e=>{let t=0;for(const r of e)++t;return t},dx=e=>qp(e.toLowerCase()),
zt=(...e)=>Array.prototype.concat.apply([],e),tl=e=>new Map(Object.entries(e)),hx=(e,t)=>{const r=[];let n=0;for(const s of e.
matchAll(t)){const a=s[0];n<s.index&&r.push(e.slice(n,s.index)),a.length>0&&r.push(a),n=s.index+a.length}return n<e.length&&
r.push(e.slice(n)),r},qp=e=>e.replace(/\p{M}/gu,""),Bf=(e,t,r=[])=>{if(!e||Array.isArray(e)||typeof e!="object")return`${t}\
 must be a valid object`;for(const n of r)if(!(n in e))return`${t} must contain a "${n}" property`;return null},fx=e=>e.
match(/\S+/g)||[],_x=class{constructor(){const e=function(...t){return e._call(...t)};return Object.setPrototypeOf(e,new.target.
prototype)}},fs=_x,px=class extends fs{constructor(e){super(),this.config=e}_call(e){return this.normalize(e)}},hr=px,mx=class extends hr{tokenize_chinese_chars(e){
const t=[];for(let r=0;r<e.length;++r){const n=e[r],s=n.charCodeAt(0);lx(s)?(t.push(" "),t.push(n),t.push(" ")):t.push(n)}
return t.join("")}strip_accents(e){return e.normalize("NFD").replace(/\p{Mn}/gu,"")}is_control(e){switch(e){case"	":case`\

`:case"\r":return!1;default:return/^\p{Cc}|\p{Cf}|\p{Co}|\p{Cs}$/u.test(e)}}clean_text(e){const t=[];for(const r of e){const n=r.
charCodeAt(0);n===0||n===65533||this.is_control(r)||(/^\s$/.test(r)?t.push(" "):t.push(r))}return t.join("")}normalize(e){
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
type}`)}}var Wp=Gx,Vx=class extends fs{pre_tokenize(e,t){return(Array.isArray(e)?e.map(r=>this.pre_tokenize_text(r,t)):this.
pre_tokenize_text(e,t)).flat()}_call(e,t){return this.pre_tokenize(e,t)}},Gt=Vx,Hp=(()=>{const e=[...Array.from({length:94},
(s,a)=>a+33),...Array.from({length:12},(s,a)=>a+161),...Array.from({length:82},(s,a)=>a+174)],t=e.slice();let r=0;for(let s=0;s<
256;++s)e.includes(s)||(e.push(s),t.push(256+r),r+=1);const n=t.map(s=>String.fromCharCode(s));return Object.fromEntries(
e.map((s,a)=>[s,n[a]]))})(),Ux=e=>Object.fromEntries(Object.entries(e).map(([t,r])=>[r,t])),jx=Ux(Hp),ga="\\p{P}\\u0021-\\u\
002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E",qx=class extends Gt{constructor(e){super(),this.config=e,this.add_prefix_space=
this.config.add_prefix_space??!1,this.trim_offsets=this.config.trim_offsets??!1,this.use_regex=this.config.use_regex??!0,
this.pattern=/'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu,this.byte_encoder=Hp,this.text_encoder=
new TextEncoder}pre_tokenize_text(e,t){return this.add_prefix_space&&!e.startsWith(" ")&&(e=" "+e),(this.use_regex?e.match(
this.pattern)||[]:[e]).map(n=>Array.from(this.text_encoder.encode(n),s=>this.byte_encoder[s]).join(""))}},Wx=qx,Hx=class extends Gt{pre_tokenize_text(e,t){
return e.match(/\w+|[^\w\s]+/g)||[]}},Qx=Hx,Xx=class extends Gt{constructor(e){super(),this.replacement=e.replacement??"\
▁",this.str_rep=e.str_rep||this.replacement,this.prepend_scheme=e.prepend_scheme??"always"}pre_tokenize_text(e,t){const{
section_index:r=void 0}=t??{};let n=e.replaceAll(" ",this.str_rep);return!n.startsWith(this.replacement)&&(this.prepend_scheme===
"always"||this.prepend_scheme==="first"&&r===0)&&(n=this.str_rep+n),[n]}},Yx=Xx,Kx=class extends Gt{constructor(e){super(),
this.config=e,this.pattern=Aa(this.config.pattern??{},this.config.invert??!0)}pre_tokenize_text(e){return this.pattern===
null?[]:this.config.invert?(e.match(this.pattern)||[]).filter(t=>t):this.config.behavior?.toLowerCase()==="removed"?e.split(
this.pattern).filter(t=>t):hx(e,this.pattern)}},Jx=Kx,Zx=class extends Gt{constructor(e){super(),this.config=e,this.pattern=
new RegExp(`[^${ga}]+|[${ga}]+`,"gu")}pre_tokenize_text(e){return e.match(this.pattern)||[]}},e1=Zx,t1=class extends Gt{constructor(e){
super(),this.config=e;const t=`[^\\d]+|\\d${this.config.individual_digits?"":"+"}`;this.pattern=new RegExp(t,"gu")}pre_tokenize_text(e){
return e.match(this.pattern)||[]}},r1=t1,n1=class extends Gt{constructor(){super(),this.pattern=new RegExp(`[^\\s${ga}]+\
|[${ga}]`,"gu")}pre_tokenize_text(e,t){return e.trim().match(this.pattern)||[]}},s1=n1,a1=class extends Gt{constructor(e){
super(),this.config=e,this.pattern=Aa(this.config.pattern??{}),this.content=this.config.content??""}pre_tokenize_text(e){
return this.pattern===null?[e]:[e.replaceAll(this.pattern,this.config.content??"")]}},o1=a1,i1=class extends Gt{constructor(e){
super(),this.tokenizers=(e.pretokenizers??[]).map(t=>Qp(t))}pre_tokenize_text(e,t){return this.tokenizers.reduce((r,n)=>n?
n.pre_tokenize(r,t):r,[e])}},l1=i1,c1=class extends Gt{pre_tokenize_text(e){return fx(e)}},u1=c1,d1=class extends Gt{constructor(e){
super(),this.config=e,this._length=e.length}pre_tokenize_text(e){const t=[];for(let r=0;r<e.length;r+=this._length)t.push(
e.slice(r,r+this._length));return t}},h1=d1;function f1(e){if(e===null)return null;switch(e.type){case"BertPreTokenizer":
return new s1;case"Sequence":return new l1(e);case"Whitespace":return new Qx;case"WhitespaceSplit":return new u1;case"Me\
taspace":return new Yx(e);case"ByteLevel":return new Wx(e);case"Split":return new Jx(e);case"Punctuation":return new e1(
e);case"Digits":return new r1(e);case"Replace":return new o1(e);case"FixedLength":return new h1(e);default:throw new Error(
`Unknown PreTokenizer type: ${e.type}`)}}var Qp=f1,_1=class extends fs{constructor(e){super(),this.config=e,this.vocab=[],
this.tokens_to_ids=new Map,this.unk_token_id=void 0,this.unk_token=void 0,this.end_of_word_suffix=void 0,this.fuse_unk=this.
config.fuse_unk??!1}_call(e){let t=this.encode(e);return this.fuse_unk&&(t=ix(t,this.tokens_to_ids,this.unk_token_id)),t}},
Sa=_1,p1=class extends Sa{constructor(e){super(e),this.max_input_chars_per_word=100,this.tokens_to_ids=tl(e.vocab),this.
unk_token_id=this.tokens_to_ids.get(e.unk_token),this.unk_token=e.unk_token,this.max_input_chars_per_word=e.max_input_chars_per_word??
100,this.vocab=new Array(this.tokens_to_ids.size);for(const[t,r]of this.tokens_to_ids)this.vocab[r]=t}encode(e){const t=[];
for(const r of e){const n=[...r];if(n.length>this.max_input_chars_per_word){t.push(this.unk_token);continue}let s=!1,a=0;
const o=[];for(;a<n.length;){let i=n.length,l=null;for(;a<i;){let c=n.slice(a,i).join("");if(a>0&&(c=this.config.continuing_subword_prefix+
c),this.tokens_to_ids.has(c)){l=c;break}--i}if(l===null){s=!0;break}o.push(l),a=i}s?t.push(this.unk_token):t.push(...o)}
return t}},Rf=p1,$f=class Xp{constructor(t,r){this.is_leaf=t,this.children=r}static default(){return new Xp(!1,new Map)}},
m1=class{constructor(){this.root=$f.default()}extend(e){for(const t of e)this.push(t)}push(e){let t=this.root;for(const r of e){
let n=t.children.get(r);n===void 0&&(n=$f.default(),t.children.set(r,n)),t=n}t.is_leaf=!0}*common_prefix_search(e,t=0){let r=this.
root;if(r===void 0)return;let n="";for(let s=t;s<e.length;++s){const a=e[s];if(n+=a,r=r.children.get(a),r===void 0)return;
r.is_leaf&&(yield n)}}},g1=m1,Zo=class Yp{constructor(t,r,n,s,a){this.token_id=t,this.node_id=r,this.pos=n,this.length=s,
this.score=a,this.prev=null,this.backtrace_score=0}clone(){const t=new Yp(this.token_id,this.node_id,this.pos,this.length,
this.score);return t.prev=this.prev,t.backtrace_score=this.backtrace_score,t}},w1=class{constructor(e,t,r){this.chars=Array.
from(e),this.len=this.chars.length,this.bos_token_id=t,this.eos_token_id=r,this.nodes=[],this.begin_nodes=Array.from({length:this.
len+1},()=>[]),this.end_nodes=Array.from({length:this.len+1},()=>[]);const n=new Zo(this.bos_token_id??0,0,0,0,0),s=new Zo(
this.eos_token_id??0,1,this.len,0,0);this.nodes.push(n.clone()),this.nodes.push(s.clone()),this.begin_nodes[this.len].push(
s),this.end_nodes[0].push(n)}insert(e,t,r,n){const s=this.nodes.length,a=new Zo(n,s,e,t,r);this.begin_nodes[e].push(a),this.
end_nodes[e+t].push(a),this.nodes.push(a)}viterbi(){const e=this.len;let t=0;for(;t<=e;){if(this.begin_nodes[t].length==
0)return[];for(let o of this.begin_nodes[t]){o.prev=null;let i=0,l=null;for(let c of this.end_nodes[t]){const d=c.backtrace_score+
o.score;(l===null||d>i)&&(l=c.clone(),i=d)}if(l!==null)o.prev=l,o.backtrace_score=i;else return[]}++t}const r=[],s=this.
begin_nodes[e][0].prev;if(s===null)return[];let a=s.clone();for(;a.prev!==null;)r.push(a.clone()),a=a.clone().prev.clone();
return r.reverse(),r}piece(e){return this.chars.slice(e.pos,e.pos+e.length).join("")}tokens(){return this.viterbi().map(
t=>this.piece(t))}token_ids(){return this.viterbi().map(t=>t.token_id)}},v1=w1;function y1(e){if(e.length===0)throw new Error(
"Array must not be empty");let t=e[0],r=0;for(let n=1;n<e.length;++n)e[n]<t&&(t=e[n],r=n);return[t,r]}var b1=class extends Sa{constructor(e,t){
super(e);const r=e.vocab.length;this.vocab=new Array(r),this.scores=new Array(r);for(let n=0;n<r;++n)[this.vocab[n],this.
scores[n]]=e.vocab[n];this.unk_token_id=e.unk_id,this.unk_token=this.vocab[e.unk_id],this.tokens_to_ids=new Map(this.vocab.
map((n,s)=>[n,s])),this.bos_token=" ",this.bos_token_id=this.tokens_to_ids.get(this.bos_token),this.eos_token=t,this.eos_token_id=
this.tokens_to_ids.get(this.eos_token),this.unk_token=this.vocab[this.unk_token_id],this.min_score=y1(this.scores)[0],this.
unk_score=this.min_score-10,this.scores[this.unk_token_id]=this.unk_score,this.trie=new g1,this.trie.extend(this.vocab),
this.fuse_unk=!0}populate_nodes(e){const t=e.chars,r=1;let n=0;for(;n<t.length;){let s=!1;const a=this.trie.common_prefix_search(
t,n);for(const o of a){const i=this.tokens_to_ids.get(o),l=this.scores[i],c=ux(o);e.insert(n,c,l,i),!s&&c===r&&(s=!0)}s||
e.insert(n,r,this.unk_score,this.unk_token_id),n+=r}}tokenize(e){const t=new v1(e,this.bos_token_id,this.eos_token_id);return this.
populate_nodes(t),t.tokens()}encode(e){const t=[];for(const r of e){const n=this.tokenize(r);t.push(...n)}return t}},Gf=b1,
M1=class{constructor(e=(r,n)=>r>n,t=1/0){this._heap=[],this._comparator=e,this._max_size=t}get size(){return this._heap.
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
this.tokens_to_ids.size);for(const[r,n]of this.tokens_to_ids)this.vocab[n]=r;const t=Array.isArray(e.merges[0]);this.merges=
t?e.merges:e.merges.map(r=>r.split(" ",2)),this.bpe_ranks=new Map(this.merges.map((r,n)=>[JSON.stringify(r),n])),this.end_of_word_suffix=
e.end_of_word_suffix,this.continuing_subword_suffix=e.continuing_subword_suffix??null,this.byte_fallback=this.config.byte_fallback??
!1,this.byte_fallback&&(this.text_encoder=new TextEncoder),this.ignore_merges=this.config.ignore_merges??!1,this.max_length_to_cache=
256,this.cache_capacity=1e4,this.cache=new T1(this.cache_capacity)}clear_cache(){this.cache.clear()}bpe(e){if(e.length===
0)return[];const t=this.cache.get(e);if(t!==void 0)return t;const r=Array.from(e);this.end_of_word_suffix&&(r[r.length-1]+=
this.end_of_word_suffix);let n=[];if(r.length>1){const s=new x1((i,l)=>i.score<l.score);let a={token:r[0],bias:0,prev:null,
next:null},o=a;for(let i=1;i<r.length;++i){const l={bias:i/r.length,token:r[i],prev:o,next:null};o.next=l,this.add_node(
s,o),o=l}for(;!s.is_empty();){const i=s.pop();if(i.deleted||!i.next||i.next.deleted)continue;if(i.deleted=!0,i.next.deleted=
!0,i.prev){const c={...i.prev};i.prev.deleted=!0,i.prev=c,c.prev?c.prev.next=c:a=c}const l={token:i.token+i.next.token,bias:i.
bias,prev:i.prev,next:i.next.next};l.prev?(l.prev.next=l,this.add_node(s,l.prev)):a=l,l.next&&(l.next.prev=l,this.add_node(
s,l))}for(let i=a;i!==null;i=i.next)n.push(i.token)}else n=r;if(this.continuing_subword_suffix)for(let s=0;s<n.length-1;++s)
n[s]+=this.continuing_subword_suffix;return e.length<this.max_length_to_cache&&this.cache.put(e,n),n}add_node(e,t){const r=this.
bpe_ranks.get(JSON.stringify([t.token,t.next.token]));r!==void 0&&(t.score=r+t.bias,e.push(t))}encode(e){const t=[];for(const r of e){
if(this.ignore_merges&&this.tokens_to_ids.has(r)){t.push(r);continue}const n=this.bpe(r);for(const s of n)if(this.tokens_to_ids.
has(s))t.push(s);else if(this.byte_fallback){const a=Array.from(this.text_encoder.encode(s)).map(o=>`<0x${o.toString(16).
toUpperCase().padStart(2,"0")}>`);a.every(o=>this.tokens_to_ids.has(o))?t.push(...a):this.unk_token!=null&&t.push(this.unk_token)}else
this.unk_token!=null&&t.push(this.unk_token)}return t}},Vf=E1,A1=class extends Sa{constructor(e,t){super(e);const r=e.vocab;
this.tokens_to_ids=tl(t.target_lang?r[t.target_lang]:r),this.bos_token=t.bos_token,this.bos_token_id=this.tokens_to_ids.
get(this.bos_token),this.eos_token=t.eos_token,this.eos_token_id=this.tokens_to_ids.get(this.eos_token),this.pad_token=t.
pad_token,this.pad_token_id=this.tokens_to_ids.get(this.pad_token),this.unk_token=t.unk_token,this.unk_token_id=this.tokens_to_ids.
get(this.unk_token),this.vocab=new Array(this.tokens_to_ids.size);for(const[n,s]of this.tokens_to_ids)this.vocab[s]=n}encode(e){
return e}},C1=A1;function S1(e,t){switch(e.type){case"WordPiece":return new Rf(e);case"Unigram":return new Gf(e,t.eos_token);case"\
BPE":return new Vf(e);default:if(e.vocab)return Array.isArray(e.vocab)?new Gf(e,t.eos_token):Object.hasOwn(e,"continuing\
_subword_prefix")&&Object.hasOwn(e,"unk_token")?Object.hasOwn(e,"merges")?new Vf(e):new Rf(e):new C1(e,{target_lang:t.target_lang,
bos_token:t.bos_token,eos_token:t.eos_token,pad_token:t.pad_token,unk_token:t.unk_token});throw new Error(`Unknown Token\
izerModel type: ${e?.type}`)}}var P1=S1,F1=class extends fs{constructor(e){super(),this.config=e}_call(e,...t){return this.
post_process(e,...t)}},_s=F1,I1=class extends _s{post_process(e,t=null,r=!0){const n=t===null?this.config.single:this.config.
pair;let s=[],a=[];for(const o of n)"SpecialToken"in o?r&&(s.push(o.SpecialToken.id),a.push(o.SpecialToken.type_id)):"Se\
quence"in o&&(o.Sequence.id==="A"?(s=zt(s,e),a=zt(a,new Array(e.length).fill(o.Sequence.type_id))):o.Sequence.id==="B"&&
(s=zt(s,t),a=zt(a,new Array(t.length).fill(o.Sequence.type_id))));return{tokens:s,token_type_ids:a}}},L1=I1,O1=class extends _s{post_process(e,t=null){
return{tokens:e,tokens_pair:t}}},N1=O1,D1=class extends _s{constructor(e){super(e),this.sep=e.sep,this.cls=e.cls}post_process(e,t=null,r=!0){
r&&(e=zt([this.cls[0]],e,[this.sep[0]]));let n=new Array(e.length).fill(0);if(t){const s=[],a=r?[this.sep[0]]:[];e=zt(e,
s,t,a),n=zt(n,new Array(t.length+s.length+a.length).fill(1))}return{tokens:e,token_type_ids:n}}},z1=D1,B1=class extends _s{constructor(e){
super(e),this.sep=e.sep,this.cls=e.cls}post_process(e,t,r=!0){r&&(e=zt([this.cls[0]],e,[this.sep[0]]));let n=new Array(e.
length).fill(0);if(t){const s=r?[this.sep[0]]:[],a=r?[this.sep[0]]:[];e=zt(e,s,t,a),n=zt(n,new Array(t.length+s.length+a.
length).fill(1))}return{tokens:e,token_type_ids:n}}},R1=B1,$1=class extends _s{constructor(e){super(e),this.processors=(e.
processors??[]).map(t=>Kp(t))}post_process(e,t=null,r=!0){let n={tokens:e,tokens_pair:t};for(const s of this.processors)
n=s.post_process(n.tokens,n.tokens_pair,r);return n}},G1=$1;function V1(e){if(e===null)return null;switch(e.type){case"T\
emplateProcessing":return new L1(e);case"ByteLevel":return new N1(e);case"BertProcessing":return new z1(e);case"RobertaP\
rocessing":return new R1(e);case"Sequence":return new G1(e);default:throw new Error(`Unknown PostProcessor type: ${e.type}`)}}
var Kp=V1,U1=class extends fs{constructor(e){super(),this.config=e,this.added_tokens=[],this.end_of_word_suffix=null,this.
trim_offsets="trim_offsets"in e?e.trim_offsets:!1}_call(e){return this.decode(e)}decode(e){return this.decode_chain(e).join(
"")}},Vt=U1,j1=class extends Vt{constructor(e){super(e),this.byte_decoder=jx,this.text_decoder=new TextDecoder("utf-8",{
fatal:!1,ignoreBOM:!0}),this.end_of_word_suffix=null}convert_tokens_to_string(e){const t=e.join(""),r=new Uint8Array([...t].
map(n=>this.byte_decoder[n]));return this.text_decoder.decode(r)}decode_chain(e){const t=[];let r=[];for(const n of e)this.
added_tokens.find(s=>s.content===n)!==void 0?(r.length>0&&(t.push(this.convert_tokens_to_string(r)),r=[]),t.push(n)):r.push(
n);return r.length>0&&t.push(this.convert_tokens_to_string(r)),t}},q1=j1,W1=class extends Vt{constructor(e){super(e),this.
cleanup=e.cleanup}decode_chain(e){return e.map((t,r)=>{if(r!==0){const n=this.config.prefix;n&&t.startsWith(n)?t=t.replace(
n,""):t=" "+t}return this.cleanup&&(t=Zi(t)),t})}},H1=W1,Q1=class extends Vt{constructor(e){super(e),this.replacement=e.
replacement??"▁"}decode_chain(e){const t=[];for(let r=0;r<e.length;++r){let n=e[r].replaceAll(this.replacement," ");r==
0&&n.startsWith(" ")&&(n=n.substring(1)),t.push(n)}return t}},X1=Q1,Y1=class extends Vt{constructor(e){super(e),this.suffix=
e.suffix??""}decode_chain(e){return e.map((t,r)=>t.replaceAll(this.suffix,r===e.length-1?"":" "))}},K1=Y1,J1=class extends Vt{constructor(e){
super(e),this.pad_token=e.pad_token??"",this.word_delimiter_token=e.word_delimiter_token??"",this.cleanup=e.cleanup}convert_tokens_to_string(e){
if(e.length===0)return"";const t=[e[0]];for(let s=1;s<e.length;++s)e[s]!==t.at(-1)&&t.push(e[s]);let n=t.filter(s=>s!==this.
pad_token).join("");return this.cleanup&&(n=Zi(n).replaceAll(this.word_delimiter_token," ").trim()),n}decode_chain(e){return[
this.convert_tokens_to_string(e)]}},Z1=J1,ek=class extends Vt{constructor(e){super(e),this.decoders=(e.decoders??[]).map(
t=>Jp(t))}decode_chain(e){return this.decoders.reduce((t,r)=>r.decode_chain(t),e)}},tk=ek,rk=class extends Vt{constructor(e){
super(e),this.pattern=Aa(this.config.pattern)}decode_chain(e){const t=this.config.content??"",r=this.pattern;return r===
null?e:e.map(n=>n.replaceAll(r,t))}},nk=rk,sk=class extends Vt{decode_chain(e){return[e.join("")]}},ak=sk,ok=class extends Vt{constructor(e){
super(e),this.content=e.content??"",this.start=e.start??0,this.stop=e.stop??0}decode_chain(e){return e.map(t=>{let r=0;for(let s=0;s<
this.start&&t[s]===this.content;++s){r=s+1;continue}let n=t.length;for(let s=0;s<this.stop;++s){const a=t.length-s-1;if(t[a]===
this.content){n=a;continue}else break}return t.slice(r,n)})}},ik=ok,lk=class extends Vt{constructor(e){super(e),this.text_decoder=
new TextDecoder}decode_chain(e){const t=[];let r=[];for(const n of e){let s=null;if(n.length===6&&n.startsWith("<0x")&&n.
endsWith(">")){const a=parseInt(n.slice(3,5),16);isNaN(a)||(s=a)}if(s!==null)r.push(s);else{if(r.length>0){const a=this.
text_decoder.decode(Uint8Array.from(r));t.push(a),r=[]}t.push(n)}}if(r.length>0){const n=this.text_decoder.decode(Uint8Array.
from(r));t.push(n),r=[]}return t}},ck=lk;function uk(e){if(e===null)return null;switch(e.type){case"ByteLevel":return new q1(
e);case"WordPiece":return new H1(e);case"Metaspace":return new X1(e);case"BPEDecoder":return new K1(e);case"CTC":return new Z1(
e);case"Sequence":return new tk(e);case"Replace":return new nk(e);case"Fuse":return new ak(e);case"Strip":return new ik(
e);case"ByteFallback":return new ck(e);default:throw new Error(`Unknown Decoder type: ${e.type}`)}}var Jp=uk,dk=class{constructor(e,t){
const r=Bf(e,"Tokenizer",["model","decoder","post_processor","pre_tokenizer","normalizer"]);if(r)throw new Error(r);const n=Bf(
t,"Config");if(n)throw new Error(n);this.tokenizer=e,this.config=t,this.normalizer=Wp(this.tokenizer.normalizer),this.pre_tokenizer=
Qp(this.tokenizer.pre_tokenizer),this.model=P1(this.tokenizer.model,this.config),this.post_processor=Kp(this.tokenizer.post_processor),
this.decoder=Jp(this.tokenizer.decoder),this.special_tokens=[],this.all_special_ids=[],this.added_tokens=[];const s=[],a=[];
this.added_tokens_map=new Map;for(const o of this.tokenizer.added_tokens){const i=new VM(o);if(this.added_tokens.push(i),
this.model.tokens_to_ids.set(i.content,i.id),this.model.vocab[i.id]=i.content,i.special&&(this.special_tokens.push(i.content),
this.all_special_ids.push(i.id)),this.added_tokens_map.set(i.content,i),i.normalized&&this.normalizer!==null){const l=this.
normalizer(i.content);a.push(l),this.added_tokens_map.set(l,i)}else s.push(i.content)}(this.config.additional_special_tokens??
[]).forEach(o=>{this.special_tokens.includes(o)||this.special_tokens.push(o)}),this.decoder&&(this.decoder.added_tokens=
this.added_tokens,this.decoder.end_of_word_suffix=this.model.end_of_word_suffix),this.splitter_unnormalized=new Lf(s),this.
splitter_normalized=new Lf(a),this.remove_space=this.config.remove_space,this.clean_up_tokenization_spaces=this.config.clean_up_tokenization_spaces??
!0,this.do_lowercase_and_remove_accent=this.config.do_lowercase_and_remove_accent??!1}encode(e,{text_pair:t=null,add_special_tokens:r=!0,
return_token_type_ids:n=null}={}){const{tokens:s,token_type_ids:a}=this.tokenize_helper(e,{text_pair:t,add_special_tokens:r}),
o=s.map(l=>this.added_tokens_map.get(l)?.id??this.model.tokens_to_ids.get(l)??this.model.unk_token_id),i={ids:o,tokens:s,
attention_mask:new Array(o.length).fill(1)};return n&&a&&(i.token_type_ids=a),i}decode(e,t={}){if(!Array.isArray(e)||e.length===
0||!cx(e[0]))throw Error("token_ids must be a non-empty array of integers.");let r=e.map(s=>this.model.vocab[Number(s)]??
this.model.unk_token);t.skip_special_tokens&&(r=r.filter(s=>!this.special_tokens.includes(s)));let n=this.decoder?this.decoder(
r):r.join(" ");return this.decoder&&this.decoder.end_of_word_suffix&&(n=n.replaceAll(this.decoder.end_of_word_suffix," "),
t.skip_special_tokens&&(n=n.trim())),(t.clean_up_tokenization_spaces??this.clean_up_tokenization_spaces)&&(n=Zi(n)),n}tokenize(e,{
text_pair:t=null,add_special_tokens:r=!1}={}){return this.tokenize_helper(e,{text_pair:t,add_special_tokens:r}).tokens}encode_text(e){
if(e===null)return null;const t=this.splitter_unnormalized.split(e);return t.forEach((r,n)=>{const s=this.added_tokens_map.
get(r);s&&(s.lstrip&&n>0&&(t[n-1]=t[n-1].trimEnd()),s.rstrip&&n<t.length-1&&(t[n+1]=t[n+1].trimStart()))}),t.flatMap((r,n)=>{
if(r.length===0)return[];if(this.added_tokens_map.has(r))return[r];if(this.remove_space===!0&&(r=r.trim().split(/\s+/).join(
" ")),this.do_lowercase_and_remove_accent&&(r=dx(r)),this.normalizer!==null&&(r=this.normalizer(r)),r.length===0)return[];
const s=this.splitter_normalized.split(r);return s.forEach((a,o)=>{const i=this.added_tokens_map.get(a);i&&(i.lstrip&&o>
0&&(s[o-1]=s[o-1].trimEnd()),i.rstrip&&o<s.length-1&&(s[o+1]=s[o+1].trimStart()))}),s.flatMap(a=>{if(a.length===0)return[];
if(this.added_tokens_map.has(a))return[a];const o=this.pre_tokenizer!==null?this.pre_tokenizer(a,{section_index:n}):[a];
return this.model(o)})})}tokenize_helper(e,{text_pair:t=null,add_special_tokens:r=!0}){const n=this.encode_text(e),s=this.
encode_text(t||null);return this.post_processor?this.post_processor(n,s,r):{tokens:zt(n??[],s??[])}}token_to_id(e){return this.
model.tokens_to_ids.get(e)}id_to_token(e){return this.model.vocab[e]}get_added_tokens_decoder(){const e=new Map;for(const t of this.
added_tokens)e.set(t.id,t);return e}get_vocab(e=!0){const t=new Map;for(let r=0;r<this.model.vocab.length;++r){const n=this.
model.vocab[r];(e||!this.added_tokens_map.has(n))&&t.set(n,r)}return t}},hk=dk,fk=Object.defineProperty,_k=(e,t,r)=>t in
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
"$1")),e.replace(/(\s*){%(-?)\s*(?:end)?generation\s*(-?)%}(\s*)/gs,(r,n,s,a,o)=>(s?"":n)+(a?"":o))}function vk(e,t={}){
const r=[],n=wk(e,t);let s=0,a=0;const o=c=>{let d="";for(;c(n[s]);){if(n[s]==="\\"){if(++s,s>=n.length)throw new SyntaxError(
"Unexpected end of input");const h=n[s++],_=gk.get(h);if(_===void 0)throw new SyntaxError(`Unexpected escaped character:\
 ${h}`);d+=_;continue}if(d+=n[s++],s>=n.length)throw new SyntaxError("Unexpected end of input")}return d},i=()=>{const c=r.
at(-1);c&&c.type===B.Text&&(c.value=c.value.trimEnd(),c.value===""&&r.pop())},l=()=>{for(;s<n.length&&jf(n[s]);)++s};e:for(;s<
n.length;){const c=r.at(-1)?.type;if(c===void 0||c===B.CloseStatement||c===B.CloseExpression||c===B.Comment){let h="";for(;s<
n.length&&!(n[s]==="{"&&(n[s+1]==="%"||n[s+1]==="{"||n[s+1]==="#"));)h+=n[s++];if(h.length>0){r.push(new Et(h,B.Text));continue}}
if(n[s]==="{"&&n[s+1]==="#"){s+=2;const h=n[s]==="-";h&&++s;let _="";for(;n[s]!=="#"||n[s+1]!=="}";){if(s+2>=n.length)throw new SyntaxError(
"Missing end of comment tag");_+=n[s++]}const p=_.endsWith("-");p&&(_=_.slice(0,-1)),h&&i(),r.push(new Et(_,B.Comment)),
s+=2,p&&l();continue}if(n.slice(s,s+3)==="{%-"){i(),r.push(new Et("{%",B.OpenStatement)),s+=3;continue}if(n.slice(s,s+3)===
"{{-"){i(),r.push(new Et("{{",B.OpenExpression)),a=0,s+=3;continue}if(o(jf),n.slice(s,s+3)==="-%}"){r.push(new Et("%}",B.
CloseStatement)),s+=3,l();continue}if(n.slice(s,s+3)==="-}}"){r.push(new Et("}}",B.CloseExpression)),s+=3,l();continue}const d=n[s];
if(d==="-"||d==="+"){const h=r.at(-1)?.type;if(h===B.Text||h===void 0)throw new SyntaxError(`Unexpected character: ${d}`);
switch(h){case B.Identifier:case B.NumericLiteral:case B.StringLiteral:case B.CloseParen:case B.CloseSquareBracket:break;default:{
++s;let _=o(Rr);if(_.length>0&&n[s]==="."&&Rr(n[s+1])){++s;const p=o(Rr);_=`${_}.${p}`}r.push(new Et(`${d}${_}`,_.length>
0?B.NumericLiteral:B.UnaryOperator));continue}}}for(const[h,_]of mk){if(h==="}}"&&a>0)continue;if(n.slice(s,s+h.length)===
h){r.push(new Et(h,_)),_===B.OpenExpression?a=0:_===B.OpenCurlyBracket?++a:_===B.CloseCurlyBracket&&--a,s+=h.length;continue e}}
if(d==="'"||d==='"'){++s;const h=o(_=>_!==d);r.push(new Et(h,B.StringLiteral)),++s;continue}if(Rr(d)){let h=o(Rr);if(r.at(
-1)?.type!==B.Dot&&n[s]==="."&&Rr(n[s+1])){++s;const _=o(Rr);h=`${h}.${_}`}r.push(new Et(h,B.NumericLiteral));continue}if(Uf(
d)){const h=o(Uf);r.push(new Et(h,B.Identifier));continue}throw new SyntaxError(`Unexpected character: ${d}`)}return r}var Ct=class{type="\
Statement"},yk=class extends Ct{constructor(e){super(),this.body=e}type="Program"},bk=class extends Ct{constructor(e,t,r){
super(),this.test=e,this.body=t,this.alternate=r}type="If"},Mk=class extends Ct{constructor(e,t,r,n){super(),this.loopvar=
e,this.iterable=t,this.body=r,this.defaultBlock=n}type="For"},xk=class extends Ct{type="Break"},kk=class extends Ct{type="\
Continue"},Tk=class extends Ct{constructor(e,t,r){super(),this.assignee=e,this.value=t,this.body=r}type="Set"},Ek=class extends Ct{constructor(e,t,r){
super(),this.name=e,this.args=t,this.body=r}type="Macro"},Ak=class extends Ct{constructor(e){super(),this.value=e}type="\
Comment"},pt=class extends Ct{type="Expression"},Ck=class extends pt{constructor(e,t,r){super(),this.object=e,this.property=
t,this.computed=r}type="MemberExpression"},qf=class extends pt{constructor(e,t){super(),this.callee=e,this.args=t}type="\
CallExpression"},yr=class extends pt{constructor(e){super(),this.value=e}type="Identifier"},En=class extends pt{constructor(e){
super(),this.value=e}type="Literal"},Sk=class extends En{type="IntegerLiteral"},Pk=class extends En{type="FloatLiteral"},
Wf=class extends En{type="StringLiteral"},Fk=class extends En{type="ArrayLiteral"},Hf=class extends En{type="TupleLitera\
l"},Ik=class extends En{type="ObjectLiteral"},un=class extends pt{constructor(e,t,r){super(),this.operator=e,this.left=t,
this.right=r}type="BinaryExpression"},Lk=class extends pt{constructor(e,t){super(),this.operand=e,this.filter=t}type="Fi\
lterExpression"},Ok=class extends Ct{constructor(e,t){super(),this.filter=e,this.body=t}type="FilterStatement"},Nk=class extends pt{constructor(e,t){
super(),this.lhs=e,this.test=t}type="SelectExpression"},Dk=class extends pt{constructor(e,t,r){super(),this.operand=e,this.
negate=t,this.test=r}type="TestExpression"},Qf=class extends pt{constructor(e,t){super(),this.operator=e,this.argument=t}type="\
UnaryExpression"},zk=class extends pt{constructor(e=void 0,t=void 0,r=void 0){super(),this.start=e,this.stop=t,this.step=
r}type="SliceExpression"},ei=class extends pt{constructor(e,t){super(),this.key=e,this.value=t}type="KeywordArgumentExpr\
ession"},Bk=class extends pt{constructor(e){super(),this.argument=e}type="SpreadExpression"},Rk=class extends pt{constructor(e){
super(),this.argument=e}type="KeywordSpreadExpression"},$k=class extends Ct{constructor(e,t,r){super(),this.call=e,this.
callerArgs=t,this.body=r}type="CallStatement"},Gk=class extends pt{constructor(e,t,r){super(),this.condition=e,this.trueExpr=
t,this.falseExpr=r}type="Ternary"};function Vk(e){const t=new yk([]);let r=0;function n(L,O){const V=e[r++];if(!V||V.type!==
L)throw new Error(`Parser Error: ${O}. ${V.type} !== ${L}.`);return V}function s(L){if(!l(L))throw new SyntaxError(`Expe\
cted ${L}`);++r}function a(){switch(e[r].type){case B.Comment:return new Ak(e[r++].value);case B.Text:return c();case B.
OpenStatement:return d();case B.OpenExpression:return h();default:throw new SyntaxError(`Unexpected token type: ${e[r].type}`)}}
function o(...L){return r+L.length<=e.length&&L.every((O,V)=>O===e[r+V].type)}function i(...L){return e[r]?.type===B.OpenStatement&&
e[r+1]?.type===B.Identifier&&L.includes(e[r+1]?.value)}function l(...L){return r+L.length<=e.length&&L.every((O,V)=>e[r+
V].type==="Identifier"&&O===e[r+V].value)}function c(){return new Wf(n(B.Text,"Expected text token").value)}function d(){
if(n(B.OpenStatement,"Expected opening statement token"),e[r].type!==B.Identifier)throw new SyntaxError(`Unknown stateme\
nt, got ${e[r].type}`);const L=e[r].value;let O;switch(L){case"set":++r,O=_();break;case"if":++r,O=p(),n(B.OpenStatement,
"Expected {% token"),s("endif"),n(B.CloseStatement,"Expected %} token");break;case"macro":++r,O=w(),n(B.OpenStatement,"E\
xpected {% token"),s("endmacro"),n(B.CloseStatement,"Expected %} token");break;case"for":++r,O=y(),n(B.OpenStatement,"Ex\
pected {% token"),s("endfor"),n(B.CloseStatement,"Expected %} token");break;case"call":{++r;let V=null;o(B.OpenParen)&&(V=
j("parameters"));const se=ne();if(se.type!=="Identifier")throw new SyntaxError("Expected identifier following call state\
ment");const ae=j("call");n(B.CloseStatement,"Expected closing statement token");const qe=[];for(;!i("endcall");)qe.push(
a());n(B.OpenStatement,"Expected '{%'"),s("endcall"),n(B.CloseStatement,"Expected closing statement token");const Ee=new qf(
se,ae);O=new $k(Ee,V,qe);break}case"break":++r,n(B.CloseStatement,"Expected closing statement token"),O=new xk;break;case"\
continue":++r,n(B.CloseStatement,"Expected closing statement token"),O=new kk;break;case"filter":{++r;let V=ne();V instanceof
yr&&o(B.OpenParen)&&(V=R(V)),n(B.CloseStatement,"Expected closing statement token");const se=[];for(;!i("endfilter");)se.
push(a());n(B.OpenStatement,"Expected '{%'"),s("endfilter"),n(B.CloseStatement,"Expected '%}'"),O=new Ok(V,se);break}default:
throw new SyntaxError(`Unknown statement type: ${L}`)}return O}function h(){n(B.OpenExpression,"Expected opening express\
ion token");const L=b();return n(B.CloseExpression,"Expected closing expression token"),L}function _(){const L=v();let O=null;
const V=[];if(o(B.Equals))++r,O=v();else{for(n(B.CloseStatement,"Expected %} token");!i("endset");)V.push(a());n(B.OpenStatement,
"Expected {% token"),s("endset")}return n(B.CloseStatement,"Expected closing statement token"),new Tk(L,O,V)}function p(){
const L=b();n(B.CloseStatement,"Expected closing statement token");const O=[],V=[];for(;!i("elif","else","endif");)O.push(
a());if(i("elif")){++r,++r;const se=p();V.push(se)}else if(i("else"))for(++r,++r,n(B.CloseStatement,"Expected closing st\
atement token");!i("endif");)V.push(a());return new bk(L,O,V)}function w(){const L=ne();if(L.type!=="Identifier")throw new SyntaxError(
"Expected identifier following macro statement");const O=j("parameters");n(B.CloseStatement,"Expected closing statement \
token");const V=[];for(;!i("endmacro");)V.push(a());return new Ek(L,O,V)}function v(L=!1){const O=L?ne:b,V=[O()],se=o(B.
Comma);for(;se&&(++r,V.push(O()),!!o(B.Comma)););return se?new Hf(V):V[0]}function y(){const L=v(!0);if(!(L instanceof yr||
L instanceof Hf))throw new SyntaxError(`Expected identifier/tuple for the loop variable, got ${L.type} instead`);if(!l("\
in"))throw new SyntaxError("Expected `in` keyword following loop variable");++r;const O=b();n(B.CloseStatement,"Expected\
 closing statement token");const V=[];for(;!i("endfor","else");)V.push(a());const se=[];if(i("else"))for(++r,++r,n(B.CloseStatement,
"Expected closing statement token");!i("endfor");)se.push(a());return new Mk(L,O,V,se)}function b(){return k()}function k(){
const L=A();if(l("if")){++r;const O=A();if(l("else")){++r;const V=k();return new Gk(O,L,V)}else return new Nk(L,O)}return L}
function A(){let L=E();for(;l("or");){const O=e[r];++r;const V=E();L=new un(O,L,V)}return L}function E(){let L=C();for(;l(
"and");){const O=e[r];++r;const V=C();L=new un(O,L,V)}return L}function C(){let L;for(;l("not");){const O=e[r];++r;const V=C();
L=new Qf(O,V)}return L??N()}function N(){let L=M();for(;;){let O;if(l("not","in"))O=new Et("not in",B.Identifier),r+=2;else if(l(
"in"))O=e[r++];else if(o(B.ComparisonBinaryOperator))O=e[r++];else break;const V=M();L=new un(O,L,V)}return L}function M(){
let L=I();for(;o(B.AdditiveBinaryOperator);){const O=e[r];++r;const V=I();L=new un(O,L,V)}return L}function $(){const L=z(
ne());return o(B.OpenParen)?R(L):L}function R(L){let O=new qf(L,j("call"));return O=z(O),o(B.OpenParen)&&(O=R(O)),O}function j(L){
n(B.OpenParen,"Expected opening parenthesis for arguments list");const O=Y(L);return n(B.CloseParen,"Expected closing pa\
renthesis for arguments list"),O}function Y(L){const O=[],V=new Set;let se=!1,ae=!1;for(;!o(B.CloseParen);){const qe=o(B.
ExponentiationBinaryOperator),Ee=o(B.MultiplicativeBinaryOperator)&&e[r].value==="*";if(L==="parameters"&&(qe||Ee))throw new SyntaxError(
"Argument unpacking is not allowed in parameter declarations");if(qe){if(++r,O.push(new Rk(b())),o(B.Comma)&&++r,!o(B.CloseParen))
throw new SyntaxError("Expected closing parenthesis: `**` must be applied to the final argument");break}let Ae;if(Ee){if(ae)
throw new SyntaxError("Only one `*` argument unpacking is allowed");ae=!0,++r;const $e=b();Ae=new Bk($e)}else{if(Ae=b(),
o(B.Equals)){if(++r,!(Ae instanceof yr))throw new SyntaxError(L==="parameters"?"Expected identifier for parameter declar\
ation":"Expected identifier for keyword argument");const $e=b();Ae=new ei(Ae,$e)}if(L==="parameters"){if(!(Ae instanceof
yr||Ae instanceof ei))throw new SyntaxError("Expected identifier for parameter declaration");const $e=Ae instanceof yr?Ae.
value:Ae.key.value;if(V.has($e))throw new SyntaxError(`Duplicate parameter name: ${$e}`);V.add($e)}if(Ae instanceof ei)se=
!0;else{if(se)throw new SyntaxError(L==="call"?"Positional arguments must come before keyword arguments":"Non-default ar\
gument follows default argument");if(ae)throw new SyntaxError("Positional arguments must not follow `*` argument unpacki\
ng")}}O.push(Ae),o(B.Comma)&&++r}return O}function Q(){const L=[];let O=!1;for(;!o(B.CloseSquareBracket);)o(B.Colon)?(L.
push(void 0),++r,O=!0):(L.push(b()),o(B.Colon)&&(++r,O=!0));if(L.length===0)throw new SyntaxError("Expected at least one\
 argument for member/slice expression");if(O){if(L.length>3)throw new SyntaxError("Expected 0-3 arguments for slice expr\
ession");return new zk(...L)}return L[0]}function z(L){for(;o(B.Dot)||o(B.OpenSquareBracket);){const O=e[r];++r;let V;const se=O.
type===B.OpenSquareBracket;if(se)V=Q(),n(B.CloseSquareBracket,"Expected closing square bracket");else if(V=ne(),V.type!==
"Identifier"&&V.type!=="IntegerLiteral")throw new SyntaxError("Expected identifier or integer following dot operator");L=
new Ck(L,V,se)}return L}function I(){let L=U();for(;o(B.MultiplicativeBinaryOperator);){const O=e[r++],V=U();L=new un(O,
L,V)}return L}function U(){let L=X();for(;o(B.ExponentiationBinaryOperator);){const O=e[r++],V=X();L=new un(O,L,V)}return L}
function X(){let L=ce();for(;l("is");){++r;const O=l("not");O&&++r;const V=ne();if(!(V instanceof yr))throw new SyntaxError(
"Expected identifier for the test");L=new Dk(L,O,V)}return L}function ce(){let L=Z();for(;o(B.Pipe);){++r;let O=ne();if(!(O instanceof
yr))throw new SyntaxError("Expected identifier for the filter");o(B.OpenParen)&&(O=R(O)),L=new Lk(L,O)}return L}function Z(){
const L=e[r];if(L&&(L.type===B.UnaryOperator||L.type===B.AdditiveBinaryOperator)&&(L.value==="-"||L.value==="+")){const O=e[r++],
V=Z();return new Qf(O,V)}return $()}function ne(){const L=e[r++];switch(L.type){case B.NumericLiteral:{const O=L.value;return O.
includes(".")?new Pk(Number(O)):new Sk(Number(O))}case B.StringLiteral:{let O=L.value;for(;o(B.StringLiteral);)O+=e[r++].
value;return new Wf(O)}case B.Identifier:return new yr(L.value);case B.OpenParen:{const O=v();return n(B.CloseParen,"Exp\
ected closing parenthesis, got ${tokens[current].type} instead."),O}case B.OpenSquareBracket:{const O=[];for(;!o(B.CloseSquareBracket);)
O.push(b()),o(B.Comma)&&++r;return++r,new Fk(O)}case B.OpenCurlyBracket:{const O=new Map;for(;!o(B.CloseCurlyBracket);){
const V=b();n(B.Colon,"Expected colon between key and value in object literal");const se=b();O.set(V,se),o(B.Comma)&&++r}
return++r,new Ik(O)}default:throw new SyntaxError(`Unexpected token: ${L.type}`)}}for(;r<e.length;)t.body.push(a());return t}
function Uk(e,t,r=1){if(t===void 0&&(t=e,e=0),r===0)throw new Error("range() step must not be zero");const n=[];if(r>0)for(let s=e;s<
t;s+=r)n.push(s);else for(let s=e;s>t;s+=r)n.push(s);return n}function Xf(e,t,r,n=1){const s=Math.sign(n);s>=0?(t=(t??=0)<
0?Math.max(e.length+t,0):Math.min(t,e.length),r=(r??=e.length)<0?Math.max(e.length+r,0):Math.min(r,e.length)):(t=(t??=e.
length-1)<0?Math.max(e.length+t,-1):Math.min(t,e.length-1),r=(r??=-1)<-1?Math.max(e.length+r,-1):Math.min(r,e.length-1));
const a=[];for(let o=t;s*o<s*r;o+=n)a.push(e[o]);return a}function jk(e){return e.replace(/\b\w/g,t=>t.toUpperCase())}function qk(e){
return Wk(new Date,e)}function Wk(e,t){const r=new Intl.DateTimeFormat(void 0,{month:"long"}),n=new Intl.DateTimeFormat(
void 0,{month:"short"}),s=a=>a<10?"0"+a:a.toString();return t.replace(/%[YmdbBHM%]/g,a=>{switch(a){case"%Y":return e.getFullYear().
toString();case"%m":return s(e.getMonth()+1);case"%d":return s(e.getDate());case"%b":return n.format(e);case"%B":return r.
format(e);case"%H":return s(e.getHours());case"%M":return s(e.getMinutes());case"%%":return"%";default:return a}})}function Hk(e){
return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Qk(e,t,r,n){if(n===0)return e;let s=n==null||n<0?1/0:n;const a=t.
length===0?new RegExp("(?=)","gu"):new RegExp(Hk(t),"gu");return e.replaceAll(a,o=>s>0?(--s,r):o)}var Yf=class extends Error{},
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
 or null");const r=e[1]??new le(-1);if(!(r instanceof le))throw new Error("maxsplit argument must be a number");let n=[];
if(t instanceof Be){const s=this.value.trimStart();for(const{0:a,index:o}of s.matchAll(/\S+/g)){if(r.value!==-1&&n.length>=
r.value&&o!==void 0){n.push(a+s.slice(o+a.length));break}n.push(a)}}else{if(t.value==="")throw new Error("empty separato\
r");n=this.value.split(t.value),r.value!==-1&&n.length>r.value&&n.push(n.splice(r.value).join(t.value))}return new pe(n.
map(s=>new K(s)))})],["replace",new De(e=>{if(e.length<2)throw new Error("replace() requires at least two arguments");const t=e[0],
r=e[1];if(!(t instanceof K&&r instanceof K))throw new Error("replace() arguments must be strings");let n;if(e.length>2?e[2].
type==="KeywordArgumentsValue"?n=e[2].value.get("count")??new Be:n=e[2]:n=new Be,!(n instanceof le||n instanceof Be))throw new Error(
"replace() count argument must be a number or null");return new K(Qk(this.value,t.value,r.value,n.value))})]])}},oe=class extends Ut{type="\
BooleanValue"},Yk=/[\x7f-\uffff]/g;function Jf(e){return e.replace(Yk,t=>"\\u"+t.charCodeAt(0).toString(16).padStart(4,"\
0"))}function Cr(e,t={},r=0,n=!0){const{indent:s=null,ensureAscii:a=!1,separators:o=null,sortKeys:i=!1}=t;let l,c;switch(o?
[l,c]=o:s?(l=",",c=": "):(l=", ",c=": "),e.type){case"NullValue":return"null";case"UndefinedValue":return n?"null":"unde\
fined";case"IntegerValue":case"FloatValue":case"BooleanValue":return JSON.stringify(e.value);case"StringValue":{let d=JSON.
stringify(e.value);return a&&(d=Jf(d)),d}case"ArrayValue":case"NamespaceValue":case"ObjectValue":{const d=s?" ".repeat(s):
"",h=`
`+d.repeat(r),_=h+d;if(e.type==="ArrayValue"){const p=e.value.map(w=>Cr(w,t,r+1,n));return s?`[${_}${p.join(`${l}${_}`)}${h}\
]`:`[${p.join(l)}]`}else{let p=Array.from(e.value.entries());i&&(p=p.sort(([v],[y])=>v.localeCompare(y)));const w=p.map(
([v,y])=>{let b=JSON.stringify(v);a&&(b=Jf(b));const k=`${b}${c}${Cr(y,t,r+1,n)}`;return s?`${_}${k}`:k});return s?`{${w.
join(l)}${h}}`:`{${w.join(l)}}`}}default:throw new Error(`Cannot convert to JSON: ${e.type}`)}}var lt=class extends Ut{type="\
ObjectValue";_builtins;__bool__(){return new oe(this.value.size>0)}get builtins(){return this._builtins??=new Map([["get",
new De(([e,t])=>{if(!(e instanceof K))throw new Error(`Object key must be a string: got ${e.type}`);return this.value.get(
e.value)??t??new Be})],["items",new De(()=>this.items())],["keys",new De(()=>this.keys())],["values",new De(()=>this.values())],
["dictsort",new De(e=>{let t=new Map;const r=e.filter(i=>i instanceof jr?(t=i.value,!1):!0),n=r.at(0)??t.get("case_sensi\
tive")??new oe(!1);if(!(n instanceof oe))throw new Error("case_sensitive must be a boolean");const s=r.at(1)??t.get("by")??
new K("key");if(!(s instanceof K))throw new Error("by must be a string");if(!["key","value"].includes(s.value))throw new Error(
"by must be either 'key' or 'value'");const a=r.at(2)??t.get("reverse")??new oe(!1);if(!(a instanceof oe))throw new Error(
"reverse must be a boolean");const o=Array.from(this.value.entries()).map(([i,l])=>new pe([new K(i),l])).sort((i,l)=>{const c=s.
value==="key"?0:1,d=i.value[c],h=l.value[c],_=gi(d,h,n.value);return a.value?-_:_});return new pe(o)})]])}items(){return new pe(
Array.from(this.value.entries()).map(([e,t])=>new pe([new K(e),t])))}keys(){return new pe(Array.from(this.value.keys()).
map(e=>new K(e)))}values(){return new pe(Array.from(this.value.values()))}toString(){return Cr(this,{},0,!1)}},jr=class extends lt{type="\
KeywordArgumentsValue"},rl=class extends Ut{type="NamespaceValue";toString(){return Cr(this,{},0,!1)}},pe=class extends Ut{type="\
ArrayValue";_builtins;get builtins(){return this._builtins??=new Map([["length",new le(this.value.length)]])}__bool__(){
return new oe(this.value.length>0)}toString(){return Cr(this,{},0,!1)}},Zf=class extends pe{type="TupleValue"},De=class extends Ut{type="\
FunctionValue"},Be=class extends Ut{type="NullValue"},Ne=class extends Ut{type="UndefinedValue"};function Kk(e){let t;if(e instanceof
pe?t=e.value:e instanceof K&&(t=Array.from(e.value,s=>new K(s))),!t||t.length!==2)throw new Error("namespace expected an\
 object or an iterable of [key, value] pairs");const[r,n]=t;if(!(r instanceof K))throw new Error("namespace keys must be\
 strings");return[r,n]}var Zp=class{constructor(e){this.parent=e}variables=new Map([["namespace",new De(e=>{const t=e.slice();
let r;if(t.at(-1)instanceof jr&&(r=t.pop()),t.length>1)throw new Error(`namespace expected at most 1 argument, got ${t.length}`);
const n=new Map;if(t.length===1){const s=t[0];if(s instanceof lt)for(const[a,o]of s.value)n.set(a,o);else if(s instanceof
pe)for(const a of s.value){const[o,i]=Kk(a);n.set(o.value,i)}else throw new Error(`'${s.type}' object is not iterable`)}
if(r)for(const[s,a]of r.value)n.set(s,a);return new rl(n)})]]);tests=Zp.TESTS;set(e,t){return this.declareVariable(e,sa(
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
strftime_now",qk),e.set("True",!0),e.set("False",!1),e.set("None",null)}function na(e){return e instanceof lt||e instanceof
rl}function wa(e){return e instanceof le||e instanceof Ce||e instanceof oe}function va(e){return e instanceof oe?Number(
e.value):e.value}function e_(e,t){const r=t.split(".");let n=e;for(const s of r)if(na(n))n=n.value.get(s)??new Ne;else if(n instanceof
pe){const a=parseInt(s,10);if(!isNaN(a)&&a>=0&&a<n.value.length)n=n.value[a];else return new Ne}else return new Ne;return n}
function gi(e,t,r=!1){if(e instanceof Be&&t instanceof Be)return 0;if(e instanceof Be||t instanceof Be)throw new Error(`\
Cannot compare ${e.type} with ${t.type}`);if(e instanceof Ne&&t instanceof Ne)return 0;if(e instanceof Ne||t instanceof Ne)
throw new Error(`Cannot compare ${e.type} with ${t.type}`);if(wa(e)&&wa(t)){const n=va(e),s=va(t);return n<s?-1:n>s?1:0}
if(e.type!==t.type)throw new Error(`Cannot compare different types: ${e.type} and ${t.type}`);switch(e.type){case"String\
Value":{let n=e.value,s=t.value;return r||(n=n.toLowerCase(),s=s.toLowerCase()),n<s?-1:n>s?1:0}default:throw new Error(`\
Cannot compare type: ${e.type}`)}}function wi(e){if(e.type==="Identifier")return{name:e.value};const t=e;return{name:t.key.
value,defaultValue:t.value}}function t_(e){return e==="kwargs"||e==="varargs"}function r_(e,t){const r=new Set,n=new Set,
s=d=>{t_(d)&&r.add(d)},a=d=>{if(d.type==="Identifier")s(d.value);else if(d.type==="TupleLiteral")for(const h of d.value)
a(h)},o=d=>{s(wi(d).name)},i=d=>{for(const h of d){const _=wi(h);_.defaultValue&&c(_.defaultValue)}},l=d=>{d.type==="Cal\
lExpression"&&c(d.args)},c=d=>{if(Array.isArray(d)){for(const h of d)c(h);return}if(d instanceof Map){for(const[h,_]of d)
c(h),c(_);return}if(d instanceof Ct)switch(d.type){case"For":{const h=d;if(a(h.loopvar),h.iterable.type==="SelectExpress\
ion"){const _=h.iterable;c(_.lhs),c(h.body),c(h.defaultBlock),c(_.test);return}c(h.iterable),c(h.body),c(h.defaultBlock);
return}case"Set":{const h=d;a(h.assignee),c(h.value),c(h.body);return}case"Macro":{const h=d;for(const _ of h.args)o(_);
i(h.args),c(h.body);return}case"CallStatement":{const h=d;c(h.call);for(const _ of h.callerArgs??[])o(_);i(h.callerArgs??
[]),c(h.body);return}case"FilterStatement":{const h=d;c(h.body),l(h.filter);return}case"Identifier":{const h=d.value;t_(
h)&&!r.has(h)&&n.add(h);return}case"MemberExpression":{const h=d;c(h.object),h.computed&&c(h.property);return}case"Filte\
rExpression":{const h=d;c(h.operand),l(h.filter);return}case"TestExpression":c(d.operand);return;case"SelectExpression":{
const h=d;c(h.test),c(h.lhs);return}case"KeywordArgumentExpression":c(d.value);return;default:for(const h of Object.values(
d))c(h)}};for(const d of e)o(d);return c(t),n}var Zk=class{global;constructor(e){this.global=e??new Mr}run(e){return this.
evaluate(e,this.global)}evaluateBinaryExpression(e,t){const r=this.evaluate(e.left,t);switch(e.operator.value){case"and":
return r.__bool__().value?this.evaluate(e.right,t):r;case"or":return r.__bool__().value?r:this.evaluate(e.right,t)}const n=this.
evaluate(e.right,t);switch(e.operator.value){case"==":return new oe(r.value==n.value);case"!=":return new oe(r.value!=n.
value)}if(r instanceof Ne||n instanceof Ne){if(n instanceof Ne&&["in","not in"].includes(e.operator.value))return new oe(
e.operator.value==="not in");throw new Error(`Cannot perform operation ${e.operator.value} on undefined values`)}else{if(r instanceof
Be||n instanceof Be)throw new Error("Cannot perform operation on null values");if(e.operator.value==="~")return new K(r.
value.toString()+n.value.toString());if(e.operator.value==="**"&&wa(r)&&wa(n)){const s=va(r),a=va(n);if(s===0&&a<0)throw new Error(
"0.0 cannot be raised to a negative power");const o=s**a;if(!Number.isFinite(o))throw new Error("Exponentiation result i\
s not a finite real number");return r instanceof Ce||n instanceof Ce||a<0?new Ce(o):new le(o)}else if((r instanceof le||
r instanceof Ce)&&(n instanceof le||n instanceof Ce)){const s=r.value,a=n.value;switch(e.operator.value){case"+":case"-":case"\
*":{const o=e.operator.value==="+"?s+a:e.operator.value==="-"?s-a:s*a;return r instanceof Ce||n instanceof Ce?new Ce(o):
new le(o)}case"/":return new Ce(s/a);case"//":{const o=Math.floor(s/a);return r instanceof Ce||n instanceof Ce?new Ce(o):
new le(o)}case"%":{const o=s%a;return r instanceof Ce||n instanceof Ce?new Ce(o):new le(o)}case"<":return new oe(s<a);case"\
>":return new oe(s>a);case">=":return new oe(s>=a);case"<=":return new oe(s<=a)}}else if(r instanceof pe&&n instanceof pe)
switch(e.operator.value){case"+":return new pe(r.value.concat(n.value))}else if(n instanceof pe){const s=n.value.find(a=>a.
value===r.value)!==void 0;switch(e.operator.value){case"in":return new oe(s);case"not in":return new oe(!s)}}}if(r instanceof
K||n instanceof K)switch(e.operator.value){case"+":return new K(r.value.toString()+n.value.toString())}if(r instanceof K&&
n instanceof K)switch(e.operator.value){case"in":return new oe(n.value.includes(r.value));case"not in":return new oe(!n.
value.includes(r.value))}if(r instanceof K&&n instanceof lt)switch(e.operator.value){case"in":return new oe(n.value.has(
r.value));case"not in":return new oe(!n.value.has(r.value))}throw new SyntaxError(`Unknown operator "${e.operator.value}\
" between ${r.type} and ${n.type}`)}evaluateArguments(e,t){const r=[],n=new Map,s=(a,o)=>{if(n.has(a))throw new Error(`G\
ot multiple values for keyword argument '${a}'`);n.set(a,o)};for(const a of e)if(a.type==="SpreadExpression"){const o=a,
i=this.evaluate(o.argument,t);if(!(i instanceof pe))throw new Error(`Cannot unpack non-iterable type: ${i.type}`);for(const l of i.
value)r.push(l)}else a.type!=="KeywordArgumentExpression"&&a.type!=="KeywordSpreadExpression"&&r.push(this.evaluate(a,t));
for(const a of e)if(a.type==="KeywordArgumentExpression"){const o=a;s(o.key.value,this.evaluate(o.value,t))}else if(a.type===
"KeywordSpreadExpression"){const o=a,i=this.evaluate(o.argument,t);if(!(i instanceof lt))throw new Error(`Argument after\
 ** must be a mapping, not ${i.type}`);for(const[l,c]of i.value)s(l,c)}return[r,n]}applyFilter(e,t,r){if(t.type==="Ident\
ifier"){const n=t;if(n.value==="safe")return e;if(n.value==="tojson")return new K(Cr(e,{}));if(e instanceof pe)switch(n.
value){case"list":return e;case"first":return e.value[0];case"last":return e.value[e.value.length-1];case"length":return new le(
e.value.length);case"reverse":return new pe(e.value.slice().reverse());case"sort":return new pe(e.value.slice().sort((s,a)=>gi(
s,a,!1)));case"join":return new K(e.value.map(s=>s.value).join(""));case"string":return new K(Cr(e,{},0,!1));case"unique":{
const s=new Set,a=[];for(const o of e.value)s.has(o.value)||(s.add(o.value),a.push(o));return new pe(a)}default:throw new Error(
`Unknown ArrayValue filter: ${n.value}`)}else if(e instanceof K)switch(n.value){case"length":case"upper":case"lower":case"\
title":case"capitalize":{const s=e.builtins.get(n.value);if(s instanceof De)return s.value([],r);if(s instanceof le)return s;
throw new Error(`Unknown StringValue filter: ${n.value}`)}case"trim":return new K(e.value.trim());case"indent":return new K(
e.value.split(`
`).map((s,a)=>a===0||s.length===0?s:"    "+s).join(`
`));case"join":case"string":return e;case"int":{const s=parseInt(e.value,10);return new le(isNaN(s)?0:s)}case"float":{const s=parseFloat(
e.value);return new Ce(isNaN(s)?0:s)}default:throw new Error(`Unknown StringValue filter: ${n.value}`)}else if(e instanceof
le||e instanceof Ce)switch(n.value){case"abs":return e instanceof le?new le(Math.abs(e.value)):new Ce(Math.abs(e.value));case"\
int":return new le(Math.floor(e.value));case"float":return new Ce(e.value);case"string":return new K(e.toString());default:
throw new Error(`Unknown NumericValue filter: ${n.value}`)}else if(e instanceof lt)switch(n.value){case"items":return new pe(
Array.from(e.value.entries()).map(([s,a])=>new pe([new K(s),a])));case"length":return new le(e.value.size);default:{const s=e.
builtins.get(n.value);if(s)return s instanceof De?s.value([],r):s;throw new Error(`Unknown ObjectValue filter: ${n.value}`)}}else if(e instanceof
oe)switch(n.value){case"bool":return new oe(e.value);case"int":return new le(e.value?1:0);case"float":return new Ce(e.value?
1:0);case"string":return new K(e.value?"true":"false");default:throw new Error(`Unknown BooleanValue filter: ${n.value}`)}
throw new Error(`Cannot apply filter "${n.value}" to type: ${e.type}`)}else if(t.type==="CallExpression"){const n=t;if(n.
callee.type!=="Identifier")throw new Error(`Unknown filter: ${n.callee.type}`);const s=n.callee.value;if(s==="tojson"){const[
,a]=this.evaluateArguments(n.args,r),o=a.get("indent")??new Be;if(!(o instanceof le||o instanceof Be))throw new Error("I\
f set, indent must be a number");const i=a.get("ensure_ascii")??new oe(!1);if(!(i instanceof oe))throw new Error("If set\
, ensure_ascii must be a boolean");const l=a.get("sort_keys")??new oe(!1);if(!(l instanceof oe))throw new Error("If set,\
 sort_keys must be a boolean");const c=a.get("separators")??new Be;let d=null;if(c instanceof pe||c instanceof Zf){if(c.
value.length!==2)throw new Error("separators must be a tuple of two strings");const[h,_]=c.value;if(!(h instanceof K)||!(_ instanceof
K))throw new Error("separators must be a tuple of two strings");d=[h.value,_.value]}else if(!(c instanceof Be))throw new Error(
"If set, separators must be a tuple of two strings");return new K(Cr(e,{indent:o.value,ensureAscii:i.value,sortKeys:l.value,
separators:d}))}else if(s==="join"){let a;if(e instanceof K)a=Array.from(e.value);else if(e instanceof pe)a=e.value.map(
c=>c.value);else throw new Error(`Cannot apply filter "${s}" to type: ${e.type}`);const[o,i]=this.evaluateArguments(n.args,
r),l=o.at(0)??i.get("separator")??new K("");if(!(l instanceof K))throw new Error("separator must be a string");return new K(
a.join(l.value))}else if(s==="int"||s==="float"){const[a,o]=this.evaluateArguments(n.args,r),i=a.at(0)??o.get("default")??
(s==="int"?new le(0):new Ce(0));if(e instanceof K){const l=s==="int"?parseInt(e.value,10):parseFloat(e.value);return isNaN(
l)?i:s==="int"?new le(l):new Ce(l)}else{if(e instanceof le||e instanceof Ce)return e;if(e instanceof oe)return s==="int"?
new le(e.value?1:0):new Ce(e.value?1:0);throw new Error(`Cannot apply filter "${s}" to type: ${e.type}`)}}else if(s==="d\
efault"){const[a,o]=this.evaluateArguments(n.args,r),i=a[0]??new K(""),l=a[1]??o.get("boolean")??new oe(!1);if(!(l instanceof
oe))throw new Error("`default` filter flag must be a boolean");return e instanceof Ne||l.value&&!e.__bool__().value?i:e}
if(e instanceof pe){switch(s){case"sort":{const[a,o]=this.evaluateArguments(n.args,r),i=a.at(0)??o.get("reverse")??new oe(
!1);if(!(i instanceof oe))throw new Error("reverse must be a boolean");const l=a.at(1)??o.get("case_sensitive")??new oe(
!1);if(!(l instanceof oe))throw new Error("case_sensitive must be a boolean");const c=a.at(2)??o.get("attribute")??new Be;
if(!(c instanceof K||c instanceof le||c instanceof Be))throw new Error("attribute must be a string, integer, or null");const d=h=>{
if(c instanceof Be)return h;const _=c instanceof le?String(c.value):c.value;return e_(h,_)};return new pe(e.value.slice().
sort((h,_)=>{const p=d(h),w=d(_),v=gi(p,w,l.value);return i.value?-v:v}))}case"selectattr":case"rejectattr":{const a=s===
"selectattr";if(e.value.some(h=>!na(h)))throw new Error(`\`${s}\` can only be applied to array of objects`);if(n.args.some(
h=>h.type!=="StringLiteral"))throw new Error(`arguments of \`${s}\` must be strings`);const[o,i,l]=n.args.map(h=>this.evaluate(
h,r));let c;if(i){const h=r.tests.get(i.value);if(!h)throw new Error(`Unknown test: ${i.value}`);c=h}else c=(...h)=>h[0].
__bool__().value;const d=e.value.filter(h=>{const _=h.value.get(o.value),p=_?c(_,l):!1;return a?p:!p});return new pe(d)}case"\
map":{const[,a]=this.evaluateArguments(n.args,r);if(a.has("attribute")){const o=a.get("attribute");if(!(o instanceof K))
throw new Error("attribute must be a string");const i=a.get("default"),l=e.value.map(c=>{if(!na(c))throw new Error("item\
s in map must be an object");const d=e_(c,o.value);return d instanceof Ne?i??new Ne:d});return new pe(l)}else throw new Error(
"`map` expressions without `attribute` set are not currently supported.")}}throw new Error(`Unknown ArrayValue filter: ${s}`)}else if(e instanceof
K){switch(s){case"indent":{const[a,o]=this.evaluateArguments(n.args,r),i=a.at(0)??o.get("width")??new le(4);if(!(i instanceof
le))throw new Error("width must be a number");const l=a.at(1)??o.get("first")??new oe(!1),c=a.at(2)??o.get("blank")??new oe(
!1),d=e.value.split(`
`),h=" ".repeat(i.value),_=d.map((p,w)=>!l.value&&w===0||!c.value&&p.length===0?p:h+p);return new K(_.join(`
`))}case"replace":{const a=e.builtins.get("replace");if(!(a instanceof De))throw new Error("replace filter not available");
const[o,i]=this.evaluateArguments(n.args,r);return a.value([...o,new jr(i)],r)}}throw new Error(`Unknown StringValue fil\
ter: ${s}`)}else if(e instanceof lt){const a=e.builtins.get(s);if(a&&a instanceof De){const[o,i]=this.evaluateArguments(
n.args,r);return i.size>0&&o.push(new jr(i)),a.value(o,r)}throw new Error(`Unknown ObjectValue filter: ${s}`)}else throw new Error(
`Cannot apply filter "${s}" to type: ${e.type}`)}throw new Error(`Unknown filter: ${t.type}`)}evaluateFilterExpression(e,t){
const r=this.evaluate(e.operand,t);return this.applyFilter(r,e.filter,t)}evaluateTestExpression(e,t){const r=this.evaluate(
e.operand,t),n=t.tests.get(e.test.value);if(!n)throw new Error(`Unknown test: ${e.test.value}`);const s=n(r);return new oe(
e.negate?!s:s)}evaluateSelectExpression(e,t){return this.evaluate(e.test,t).__bool__().value?this.evaluate(e.lhs,t):new Ne}evaluateUnaryExpression(e,t){
const r=this.evaluate(e.argument,t);switch(e.operator.value){case"not":return new oe(!r.value);case"+":case"-":{const n=e.
operator.value==="-"?-1:1;if(r instanceof le||r instanceof Ce||r instanceof oe){const s=r instanceof oe?r.value?1:0:r.value,
a=n*s;return r instanceof Ce?new Ce(a):new le(a)}throw new SyntaxError(`Unknown operator "${e.operator.value}" for ${r.type}`)}default:
throw new SyntaxError(`Unknown operator: ${e.operator.value}`)}}evaluateTernaryExpression(e,t){return this.evaluate(e.condition,
t).__bool__().value?this.evaluate(e.trueExpr,t):this.evaluate(e.falseExpr,t)}evalProgram(e,t){return this.evaluateBlock(
e.body,t)}evaluateBlock(e,t){let r="";for(const n of e){const s=this.evaluate(n,t);s.type!=="NullValue"&&s.type!=="Undef\
inedValue"&&(r+=s.toString())}return new K(r)}evaluateIdentifier(e,t){return t.lookupVariable(e.value)}evaluateCallExpression(e,t){
const[r,n]=this.evaluateArguments(e.args,t);n.size>0&&r.push(new jr(n));const s=this.evaluate(e.callee,t);if(s.type!=="F\
unctionValue")throw new Error(`Cannot call something that is not a function: got ${s.type}`);return s.value(r,t)}evaluateSliceExpression(e,t,r){
if(!(e instanceof pe||e instanceof K))throw new Error("Slice object must be an array or string");const n=this.evaluate(t.
start,r),s=this.evaluate(t.stop,r),a=this.evaluate(t.step,r);if(!(n instanceof le||n instanceof Ne))throw new Error("Sli\
ce start must be numeric or undefined");if(!(s instanceof le||s instanceof Ne))throw new Error("Slice stop must be numer\
ic or undefined");if(!(a instanceof le||a instanceof Ne))throw new Error("Slice step must be numeric or undefined");return e instanceof
pe?new pe(Xf(e.value,n.value,s.value,a.value)):new K(Xf(Array.from(e.value),n.value,s.value,a.value).join(""))}evaluateMemberExpression(e,t){
const r=this.evaluate(e.object,t);let n;if(e.computed){if(e.property.type==="SliceExpression")return this.evaluateSliceExpression(
r,e.property,t);n=this.evaluate(e.property,t)}else e.property.type==="IntegerLiteral"?n=new le(e.property.value):n=new K(
e.property.value);let s;if(na(r)){if(!(n instanceof K))throw new Error(`Cannot access property with non-string: got ${n.
type}`);s=r.value.get(n.value)??(r instanceof lt?r.builtins.get(n.value):void 0)}else if(r instanceof pe||r instanceof K)
if(n instanceof le)s=r.value.at(n.value),r instanceof K&&(s=new K(r.value.at(n.value)));else if(n instanceof K)s=r.builtins.
get(n.value);else throw new Error(`Cannot access property with non-string/non-number: got ${n.type}`);else{if(!(n instanceof
K))throw new Error(`Cannot access property with non-string: got ${n.type}`);s=r.builtins.get(n.value)}return s instanceof
Ut?s:new Ne}evaluateSet(e,t){const r=e.value?this.evaluate(e.value,t):this.evaluateBlock(e.body,t);if(e.assignee.type===
"Identifier"){const n=e.assignee.value;t.setVariable(n,r)}else if(e.assignee.type==="TupleLiteral"){const n=e.assignee;if(!(r instanceof
pe))throw new Error(`Cannot unpack non-iterable type in set: ${r.type}`);const s=r.value;if(s.length!==n.value.length)throw new Error(
`Too ${n.value.length>s.length?"few":"many"} items to unpack in set`);for(let a=0;a<n.value.length;++a){const o=n.value[a];
if(o.type!=="Identifier")throw new Error(`Cannot unpack to non-identifier in set: ${o.type}`);t.setVariable(o.value,s[a])}}else if(e.
assignee.type==="MemberExpression"){const n=e.assignee,s=this.evaluate(n.object,t);if(!(s instanceof rl))throw new Error(
"cannot assign attribute on non-namespace object");if(n.property.type!=="Identifier")throw new Error("Cannot assign to m\
ember with non-identifier property");s.value.set(n.property.value,r)}else throw new Error(`Invalid LHS inside assignment\
 expression: ${JSON.stringify(e.assignee)}`);return new Be}evaluateIf(e,t){const r=this.evaluate(e.test,t);return this.evaluateBlock(
r.__bool__().value?e.body:e.alternate,t)}evaluateFor(e,t){const r=new Mr(t);let n,s;if(e.iterable.type==="SelectExpressi\
on"){const c=e.iterable;s=this.evaluate(c.lhs,r),n=c.test}else s=this.evaluate(e.iterable,r);if(!(s instanceof pe||s instanceof
lt))throw new Error(`Expected iterable or object type in for loop: got ${s.type}`);s instanceof lt&&(s=s.keys());const a=[],
o=[];for(let c=0;c<s.value.length;++c){const d=new Mr(r),h=s.value[c];let _;if(e.loopvar.type==="Identifier")_=p=>p.setVariable(
e.loopvar.value,h);else if(e.loopvar.type==="TupleLiteral"){const p=e.loopvar;if(h.type!=="ArrayValue")throw new Error(`\
Cannot unpack non-iterable type: ${h.type}`);const w=h;if(p.value.length!==w.value.length)throw new Error(`Too ${p.value.
length>w.value.length?"few":"many"} items to unpack`);_=v=>{for(let y=0;y<p.value.length;++y){if(p.value[y].type!=="Iden\
tifier")throw new Error(`Cannot unpack non-identifier type: ${p.value[y].type}`);v.setVariable(p.value[y].value,w.value[y])}}}else
throw new Error(`Invalid loop variable(s): ${e.loopvar.type}`);n&&(_(d),!this.evaluate(n,d).__bool__().value)||(a.push(h),
o.push(_))}let i="",l=!0;for(let c=0;c<a.length;++c){const d=new Map([["index",new le(c+1)],["index0",new le(c)],["revin\
dex",new le(a.length-c)],["revindex0",new le(a.length-c-1)],["first",new oe(c===0)],["last",new oe(c===a.length-1)],["le\
ngth",new le(a.length)],["previtem",c>0?a[c-1]:new Ne],["nextitem",c<a.length-1?a[c+1]:new Ne]]);r.setVariable("loop",new lt(
d)),o[c](r);try{const h=this.evaluateBlock(e.body,r);i+=h.value}catch(h){if(h instanceof Kf)continue;if(h instanceof Yf)
break;throw h}l=!1}if(l){const c=this.evaluateBlock(e.defaultBlock,r);i+=c.value}return new K(i)}bindMacroArguments(e,t,r,n,s){
const a=n.slice();let o=new Map;a.at(-1)instanceof jr&&(o=new Map(a.pop().value));const i=[];for(let l=0;l<t.length;++l){
const{name:c,defaultValue:d}=wi(t[l]);let h=a[l];h===void 0&&o.has(c)&&(h=o.get(c),o.delete(c)),h===void 0&&d!==void 0&&
i.push([c,d]),s.setVariable(c,h??new Ne)}if(r.has("kwargs"))s.setVariable("kwargs",new lt(o));else if(o.size>0)throw new Error(
`macro ${e} takes no keyword argument '${o.keys().next().value}'`);if(r.has("varargs"))s.setVariable("varargs",new pe(a.
slice(t.length)));else if(a.length>t.length)throw new Error(`macro ${e} takes not more than ${t.length} argument(s)`);for(const[
l,c]of i)s.setVariable(l,this.evaluate(c,s))}evaluateMacro(e,t){const r=r_(e.args,e.body);return t.setVariable(e.name.value,
new De((n,s)=>{const a=new Mr(s);return this.bindMacroArguments(`'${e.name.value}'`,e.args,r,n,a),this.evaluateBlock(e.body,
a)})),new Be}evaluateCallStatement(e,t){const r=e.callerArgs??[],n=r_(r,e.body),s=new De(c=>{const d=new Mr(t);return this.
bindMacroArguments("None",r,n,c,d),this.evaluateBlock(e.body,d)}),[a,o]=this.evaluateArguments(e.call.args,t);a.push(new jr(
o));const i=this.evaluate(e.call.callee,t);if(i.type!=="FunctionValue")throw new Error(`Cannot call something that is no\
t a function: got ${i.type}`);const l=new Mr(t);return l.setVariable("caller",s),i.value(a,l)}evaluateFilterStatement(e,t){
const r=this.evaluateBlock(e.body,t);return this.applyFilter(r,e.filter,t)}evaluate(e,t){if(!e)return new Ne;switch(e.type){case"\
Program":return this.evalProgram(e,t);case"Set":return this.evaluateSet(e,t);case"If":return this.evaluateIf(e,t);case"F\
or":return this.evaluateFor(e,t);case"Macro":return this.evaluateMacro(e,t);case"CallStatement":return this.evaluateCallStatement(
e,t);case"Break":throw new Yf;case"Continue":throw new Kf;case"IntegerLiteral":return new le(e.value);case"FloatLiteral":
return new Ce(e.value);case"StringLiteral":return new K(e.value);case"ArrayLiteral":return new pe(e.value.map(r=>this.evaluate(
r,t)));case"TupleLiteral":return new Zf(e.value.map(r=>this.evaluate(r,t)));case"ObjectLiteral":{const r=new Map;for(const[
n,s]of e.value){const a=this.evaluate(n,t);if(!(a instanceof K))throw new Error(`Object keys must be strings: got ${a.type}`);
r.set(a.value,this.evaluate(s,t))}return new lt(r)}case"Identifier":return this.evaluateIdentifier(e,t);case"CallExpress\
ion":return this.evaluateCallExpression(e,t);case"MemberExpression":return this.evaluateMemberExpression(e,t);case"Unary\
Expression":return this.evaluateUnaryExpression(e,t);case"BinaryExpression":return this.evaluateBinaryExpression(e,t);case"\
FilterExpression":return this.evaluateFilterExpression(e,t);case"FilterStatement":return this.evaluateFilterStatement(e,
t);case"TestExpression":return this.evaluateTestExpression(e,t);case"SelectExpression":return this.evaluateSelectExpression(
e,t);case"Ternary":return this.evaluateTernaryExpression(e,t);case"Comment":return new Be;default:throw new SyntaxError(
`Unknown node type: ${e.type}`)}}};function sa(e){switch(typeof e){case"number":return Number.isInteger(e)?new le(e):new Ce(
e);case"string":return new K(e);case"boolean":return new oe(e);case"undefined":return new Ne;case"object":return e===null?
new Be:Array.isArray(e)?new pe(e.map(sa)):new lt(new Map(Object.entries(e).map(([t,r])=>[t,sa(r)])));case"function":return new De(
(t,r)=>{const n=e(...t.map(s=>s.value))??null;return sa(n)});default:throw new Error(`Cannot convert to runtime value: ${e}`)}}
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
" ")+tT}function Bt(e,t,r){return e.map(n=>nT(n,t,r)).join(Ke)}function ya(e){return e.map(t=>Re(t)).join(", ")}function nT(e,t,r){
const n=r.repeat(t);switch(e.type){case"Program":return Bt(e.body,t,r);case"If":return sT(e,t,r);case"For":return aT(e,t,
r);case"Set":return oT(e,t,r);case"Macro":return iT(e,t,r);case"Break":return n+rt("break");case"Continue":return n+rt("\
continue");case"CallStatement":return lT(e,t,r);case"FilterStatement":return cT(e,t,r);case"Comment":return n+"{# "+e.value+
" #}";default:return n+"{{- "+Re(e)+" -}}"}}function sT(e,t,r){const n=r.repeat(t),s=[];let a=e;for(;a&&(s.push({test:a.
test,body:a.body}),a.alternate.length===1&&a.alternate[0].type==="If");)a=a.alternate[0];let o=n+rt("if",Re(s[0].test))+
Ke+Bt(s[0].body,t+1,r);for(let i=1;i<s.length;++i)o+=Ke+n+rt("elif",Re(s[i].test))+Ke+Bt(s[i].body,t+1,r);return a&&a.alternate.
length>0&&(o+=Ke+n+rt("else")+Ke+Bt(a.alternate,t+1,r)),o+=Ke+n+rt("endif"),o}function aT(e,t,r){const n=r.repeat(t);let s="";
if(e.iterable.type==="SelectExpression"){const o=e.iterable;s=`${Re(o.lhs)} if ${Re(o.test)}`}else s=Re(e.iterable);let a=n+
rt("for",Re(e.loopvar),"in",s)+Ke+Bt(e.body,t+1,r);return e.defaultBlock.length>0&&(a+=Ke+n+rt("else")+Ke+Bt(e.defaultBlock,
t+1,r)),a+=Ke+n+rt("endfor"),a}function oT(e,t,r){const n=r.repeat(t),s=Re(e.assignee),a=e.value?Re(e.value):"",o=n+rt("\
set",`${s}${e.value?" = "+a:""}`);return e.body.length===0?o:o+Ke+Bt(e.body,t+1,r)+Ke+n+rt("endset")}function iT(e,t,r){
const n=r.repeat(t),s=ya(e.args);return n+rt("macro",`${e.name.value}(${s})`)+Ke+Bt(e.body,t+1,r)+Ke+n+rt("endmacro")}function lT(e,t,r){
const n=r.repeat(t),s=e.callerArgs&&e.callerArgs.length>0?`(${ya(e.callerArgs)})`:"",a=Re(e.call);let o=n+rt(`call${s}`,
a)+Ke;return o+=Bt(e.body,t+1,r)+Ke,o+=n+rt("endcall"),o}function cT(e,t,r){const n=r.repeat(t),s=e.filter.type==="Ident\
ifier"?e.filter.value:Re(e.filter);let a=n+rt("filter",s)+Ke;return a+=Bt(e.body,t+1,r)+Ke,a+=n+rt("endfilter"),a}function Re(e){
switch(e.type){case"SpreadExpression":return`*${Re(e.argument)}`;case"KeywordSpreadExpression":return`**${Re(e.argument)}`;case"\
Identifier":return e.value;case"IntegerLiteral":return`${e.value}`;case"FloatLiteral":{const t=e.value;return Object.is(
t,-0)?"-0.0":t%1===0?t.toFixed(1):t.toString()}case"StringLiteral":return JSON.stringify(e.value);case"BinaryExpression":{
const t=e,r=em(t),n=It(t.left,r),s=It(t.right,r+1);return`${n} ${t.operator.value} ${s}`}case"UnaryExpression":{const t=e,
r=t.argument.type==="UnaryExpression"?tm(t):Ge.ATOM;return t.operator.value+(t.operator.value==="not"?" ":"")+It(t.argument,
r)}case"CallExpression":{const t=e,r=ya(t.args);return`${Re(t.callee)}(${r})`}case"MemberExpression":{const t=e,r=It(t.object,
Ge.ATOM);let n=Re(t.property);return!t.computed&&t.property.type!=="Identifier"&&t.property.type!=="IntegerLiteral"&&(n=
`(${n})`),t.computed?`${r}[${n}]`:`${r}.${n}`}case"FilterExpression":{const t=e,r=It(t.operand,Ge.FILTER);return t.filter.
type==="CallExpression"?`${r} | ${Re(t.filter)}`:`${r} | ${t.filter.value}`}case"SelectExpression":{const t=e;return`${It(
t.lhs,Ge.LOGICAL_OR)} if ${It(t.test,Ge.LOGICAL_OR)}`}case"TestExpression":{const t=e;return`${It(t.operand,Ge.TEST)} is${t.
negate?" not":""} ${t.test.value}`}case"ArrayLiteral":case"TupleLiteral":{const t=ya(e.value),r=e.type==="ArrayLiteral"?
"[]":"()";return`${r[0]}${t}${r[1]}`}case"ObjectLiteral":return`{${Array.from(e.value.entries()).map(([r,n])=>`${Re(r)}:\
 ${Re(n)}`).join(", ")}}`;case"SliceExpression":{const t=e,r=t.start?Re(t.start):"",n=t.stop?Re(t.stop):"",s=t.step?`:${Re(
t.step)}`:"";return`${r}:${n}${s}`}case"KeywordArgumentExpression":{const t=e;return`${t.key.value}=${Re(t.value)}`}case"\
Ternary":{const t=e;return`${It(t.trueExpr,Ge.LOGICAL_OR)} if ${It(t.condition,Ge.LOGICAL_OR)} else ${It(t.falseExpr,Ge.
CONDITIONAL)}`}default:throw new Error(`Unknown expression type: ${e.type}`)}}var uT=class{parsed;constructor(e){const t=vk(
e,{lstrip_blocks:!0,trim_blocks:!0});this.parsed=Vk(t)}render(e){const t=new Mr;if(Jk(t),e)for(const[s,a]of Object.entries(
e))t.set(s,a);return new Zk(t).run(this.parsed).value}format(e){return rT(this.parsed,e?.indent||"	")}},dT={txt:"text/pl\
ain",html:"text/html",css:"text/css",js:"text/javascript",json:"application/json",png:"image/png",jpg:"image/jpeg",jpeg:"\
image/jpeg",gif:"image/gif"},ba=class rm{constructor(t){if(this.filePath=t,this.headers=new Headers,this.exists=bt.existsSync(
t),this.exists){this.status=200,this.statusText="OK";let r=bt.statSync(t);this.headers.set("content-length",r.size.toString()),
this.updateContentType();const n=bt.createReadStream(t);this.body=new ReadableStream({start(s){n.on("data",a=>s.enqueue(
a)),n.on("end",()=>s.close()),n.on("error",a=>s.error(a))},cancel(){n.destroy()}})}else this.status=404,this.statusText=
"Not Found",this.body=null}updateContentType(){const t=this.filePath.toString().split(".").pop().toLowerCase();this.headers.
set("content-type",dT[t]??"application/octet-stream")}clone(){let t=new rm(this.filePath);return t.exists=this.exists,t.
status=this.status,t.statusText=this.statusText,t.headers=new Headers(this.headers),t}async arrayBuffer(){return(await bt.
promises.readFile(this.filePath)).buffer}async blob(){const t=await bt.promises.readFile(this.filePath);return new Blob(
[t],{type:this.headers.get("content-type")})}async text(){return await bt.promises.readFile(this.filePath,"utf8")}async json(){
return JSON.parse(await this.text())}},Pa=class{constructor(e){this._mt=new Uint32Array(624),this._idx=625,this._gauss_next=
null,this._random_fn=this.random.bind(this),this.seed(e)}seed(e){if(e==null)if(fe.IS_CRYPTO_AVAILABLE){const o=new Uint32Array(
1);crypto.getRandomValues(o),e=o[0]}else e=Date.now()>>>0;Number.isSafeInteger(e)&&(e=Math.abs(e));const t=this._mt,r=(o,i)=>Math.
imul(o,i)>>>0,n=[];for(let o=e||0;o>0;o=Math.floor(o/4294967296))n.push(o&4294967295);n.length||n.push(0),t[0]=19650218;
for(let o=1;o<624;++o)t[o]=r(1812433253,t[o-1]^t[o-1]>>>30)+o>>>0;let s=1,a=0;for(let o=Math.max(624,n.length);o>0;--o,++s,
++a)s>=624&&(t[0]=t[623],s=1),a>=n.length&&(a=0),t[s]=(t[s]^r(t[s-1]^t[s-1]>>>30,1664525))+n[a]+a>>>0;for(let o=623;o>0;--o,
++s)s>=624&&(t[0]=t[623],s=1),t[s]=(t[s]^r(t[s-1]^t[s-1]>>>30,1566083941))-s>>>0;t[0]=2147483648,this._idx=624,this._gauss_next=
null}_int32(){const e=this._mt;if(this._idx>=624){for(let r=0;r<624;++r){const n=e[r]&2147483648|e[(r+1)%624]&2147483647;
e[r]=(e[(r+397)%624]^n>>>1^(n&1?2567483615:0))>>>0}this._idx=0}let t=e[this._idx++];return t^=t>>>11,t^=t<<7&2636928640,
t^=t<<15&4022730752,t^=t>>>18,t>>>0}random(){return((this._int32()>>>5)*67108864+(this._int32()>>>6))/9007199254740992}gauss(e=0,t=1){
let r=this._gauss_next;if(this._gauss_next=null,r===null){const n=this.random()*2*Math.PI,s=Math.sqrt(-2*Math.log(1-this.
random()));r=Math.cos(n)*s,this._gauss_next=Math.sin(n)*s}return e+r*t}shuffle(e){for(let t=e.length-1;t>0;--t){const r=32-
Math.clz32(t+1);let n=this._int32()>>>32-r;for(;n>t;)n=this._int32()>>>32-r;const s=e[t];e[t]=e[n],e[n]=s}}choices(e,t){
return e[nm(this._random_fn,t)]}};function nm(e,t){let r=0;for(let s=0;s<t.length;++s)r+=t[s];let n=e()*r;for(let s=0;s<
t.length;++s)if(n-=t[s],n<0)return s;return t.length-1}var Yt=new Pa,Fa=Object.freeze({Random:Pa,seed:Yt.seed.bind(Yt),random:Yt.
random.bind(Yt),gauss:Yt.gauss.bind(Yt),shuffle:Yt.shuffle.bind(Yt),choices:Yt.choices.bind(Yt)}),hT=e=>nm(Fa.random,e),
fT=new Pa,sm=class{constructor(e){this.path=e}async match(e){let t=Jt.join(this.path,e),r=new ba(t);if(r.exists)return r}async put(e,t,r=void 0){
const n=Jt.join(this.path,e),s=fe.IS_PROCESS_AVAILABLE?process.pid:Date.now(),a=fT._int32().toString(36),o=n+`.tmp.${s}.${a}`;
try{const i=t.headers.get("Content-Length"),l=parseInt(i??"0");let c=0;await bt.promises.mkdir(Jt.dirname(n),{recursive:!0});
const d=bt.createWriteStream(o),h=t.body.getReader();for(;;){const{done:_,value:p}=await h.read();if(_)break;await new Promise(
(v,y)=>{d.write(p,b=>{if(b){y(b);return}v()})}),c+=p.length;const w=l?c/l*100:0;r?.({progress:w,loaded:c,total:l})}await new Promise(
(_,p)=>{d.close(w=>w?p(w):_())}),await bt.promises.rename(o,n)}catch(i){try{await bt.promises.unlink(o)}catch{}throw i}}async delete(e){
let t=Jt.join(this.path,e);try{return await bt.promises.unlink(t),!0}catch{return!1}}},_T={400:"Bad request error occurr\
ed while trying to load file",401:"Unauthorized access to file",403:"Forbidden access to file",404:"Could not locate fil\
e",408:"Request timeout error occurred while trying to load file",500:"Internal server error error occurred while trying\
 to load file",502:"Bad gateway error occurred while trying to load file",503:"Service unavailable error occurred while \
trying to load file",504:"Gateway timeout error occurred while trying to load file"},n_=100,pT=/^(\b[\w\-.]+\b\/)?\b[\w\-.]{1,96}\b$/;
function Qs(...e){return e=e.map((t,r)=>(r&&(t=t.replace(new RegExp("^/"),"")),r!==e.length-1&&(t=t.replace(new RegExp("\
/$"),"")),t)),e.join("/")}function Kr(e,t=null,r=null){let n;try{n=new URL(e)}catch{return!1}return!(t&&!t.includes(n.protocol)||
r&&!r.includes(n.hostname))}function mT(e){return!(!pT.test(e)||e.includes("..")||e.includes("--")||e.endsWith(".git")||
e.endsWith(".ipynb"))}function nl(e,t={},...r){return JSON.stringify([e,t.revision??"main",t.cache_dir??null,t.local_files_only??
!1,...r])}var vi=class extends Error{constructor(e,{status:t=null}={}){super(e),this.name="ModelFileNotFoundError",this.
status=t}},gT=new Set([401,403,404]);function am(e,t,r){if(!r)return null;const s=`${_T[e]??`Error (${e}) occurred while\
 trying to load file`}: "${t}".`;throw gT.has(e)?new vi(s,{status:e}):Error(s)}async function wT(e,t,r){const n=e.headers.
get("Content-Length");let s=n?parseInt(n,10):r??0;n===null&&!r&&de.warn("Unable to determine content-length from respons\
e headers. Will expand buffer when needed.");let a=new Uint8Array(s),o=0;const i=e.body.getReader();async function l(){const{
done:c,value:d}=await i.read();if(c)return;const h=o+d.length;if(h>s){s=h;const p=new Uint8Array(s);p.set(a),a=p}a.set(d,
o),o=h;const _=o/s*100;return t({progress:_,loaded:o,total:s}),l()}return await l(),a}function s_(e){return Kr(e,["blob:"])}
function yi(e,{allowUnresolved:t=!1}={}){let r;if(typeof location<"u"&&location.href)r=location.href;else if(typeof import.meta<
"u"&&import.meta.url)r=import.meta.url;else return e;try{return new URL(e,r).href}catch(n){if(!t)throw n;return e}}var om="\
SHA-256",vT="experimental_transformers-hash-cache",a_=e=>({algorithm:om,value:e}),o_=class{#t=null;_getHashCache=()=>(this.#t??=
caches.open(vT),this.#t);static isAvailable=()=>typeof navigator<"u"&&"crossOriginStorage"in navigator;match=async e=>{const t=await this.
_getFileHash(e);if(t)try{const n=await(await navigator.crossOriginStorage.requestFileHandle(a_(t))).getFile();return new Response(
n,{headers:{"Content-Length":String(n.size)}})}catch{return}};put=async(e,t)=>{const r=await this._getFileHash(e);if(r){
const n=await t.blob();await this._storeBlobInCOS(n,r)}else this._processAndStore(e,t.body)};_storeBlobInCOS=async(e,t)=>{
const n=await(await navigator.crossOriginStorage.requestFileHandle(a_(t),{create:!0,origins:"*"})).createWritable();await n.
write(e),await n.close()};_processAndStore=async(e,t)=>{try{const r=[];for await(const a of t)r.push(a);const n=new Blob(
r),s=await this._getBlobHash(n);await this._storeBlobInCOS(n,s);try{await(await this._getHashCache()).put(e,new Response(
s))}catch{}}catch{}};delete=async e=>{try{return await(await this._getHashCache()).delete(e)}catch{return!1}};_getFileHash=async e=>{
try{const t=await this._getHashCache(),r=await t.match(e);if(r)return r.text();const n=await this._getLfsFileHash(e);return n?
(await t.put(e,new Response(n)),n):null}catch{return null}};_getLfsFileHash=async e=>{if(!e.includes("/resolve/"))return null;
const t=e.replace("/resolve/","/raw/");try{const n=(await fetch(t).then(s=>s.text())).match(/^oid sha256:([0-9a-f]+)$/m);
return n?n[1]:null}catch{return null}};_getBlobHash=async e=>{const t=await e.arrayBuffer(),r=await crypto.subtle.digest(
om,t);return Array.from(new Uint8Array(r)).map(s=>s.toString(16).padStart(2,"0")).join("")}};async function An(e=null){let t=null;
if(we.useCustomCache){if(!we.customCache)throw Error("`env.useCustomCache=true`, but `env.customCache` is not defined.");
if(!we.customCache.match||!we.customCache.put)throw new Error("`env.customCache` must be an object which implements the \
`match` and `put` functions of the Web Cache API. For more information, see https://developer.mozilla.org/en-US/docs/Web\
/API/Cache");t=we.customCache}if(!t&&we.experimental_useCrossOriginStorage&&o_.isAvailable()&&(t=new o_),!t&&we.useBrowserCache){
if(typeof caches>"u")throw Error("Browser cache is not available in this environment.");try{t=await caches.open(we.cacheKey)}catch(r){
de.warn("An error occurred while opening the browser cache:",r)}}if(!t&&we.useFSCache){if(!fe.IS_FS_AVAILABLE)throw Error(
"File System Cache is not available in this environment.");t=new sm(e??we.cacheDir)}return t}async function yT(e,...t){for(let r of t)
try{let n=await e.match(r);if(n)return n}catch{continue}}var bT=class{#t;#e;constructor(e){this.#t=e,this.#e=new Map}get(e){
if(!this.#e.has(e))return;const t=this.#e.get(e);return this.#e.delete(e),this.#e.set(e,t),t}put(e,t){this.#e.has(e)&&this.#e.
delete(e),this.#e.set(e,t),this.#e.size>this.#t&&this.#e.delete(this.#e.keys().next().value)}delete(e){return this.#e.delete(
e)}clear(){this.#e.clear()}},MT=100,ti=new bT(MT);function im(e,t){const r=ti.get(e);if(r!==void 0)return r;const n=t().
then(s=>s,s=>(ti.delete(e),Promise.reject(s)));return ti.put(e,n),n}async function xT(e){if(!Kr(e,["http:","https:"]))return null;
const t=lm(e);return t.set("Range","bytes=0-0"),we.fetch(e,{method:"GET",headers:t,cache:"no-store"})}function Jr(e,t,r={}){
const n=nl(e,r,t);return im(n,()=>kT(e,t,r))}async function kT(e,t,r){const n=await An(r?.cache_dir),{localPath:s,remoteURL:a,
proposedCacheKey:o,validModelId:i}=ps(e,t,r,n),l=await ms(n,s,o);if(l!==void 0&&typeof l!="string"){const c=l.headers.get(
"content-length"),d=l.headers.get("content-type");return{exists:!0,size:c?parseInt(c,10):void 0,contentType:d||void 0,fromCache:!0}}
if(we.allowLocalModels&&!Kr(s,["http:","https:"]))try{const d=await os(s);if(typeof d!="string"&&d.status!==404){const h=d.
headers.get("content-length"),_=d.headers.get("content-type");return{exists:!0,size:h?parseInt(h,10):void 0,contentType:_||
void 0,fromCache:!1}}}catch{}if(we.allowRemoteModels&&!r.local_files_only&&i){const c=await xT(a);if(c&&c.status>=200&&c.
status<300){let d;const h=c.headers.get("content-type");if(c.status===206){const _=c.headers.get("content-range");if(_){
const p=_.match(/bytes \d+-\d+\/(\d+)/);p&&(d=parseInt(p[1],10))}}else if(c.status===200)try{await c.body?.cancel()}catch{}
if(d===void 0){const _=c.headers.get("content-length");d=_?parseInt(_,10):void 0}return{exists:!0,size:d,contentType:h||
void 0,fromCache:!1}}c&&c.status!==404&&c.status!==416&&am(c.status,a,!0)}return{exists:!1,fromCache:!1}}async function os(e){
return we.useFS&&!Kr(e,["http:","https:","blob:"])?new ba(e instanceof URL?e.protocol==="file:"?e.pathname:e.toString():
e):we.fetch(e,{headers:lm(e)})}function lm(e){const t=typeof process<"u"&&process?.release?.name==="node",r=new Headers;
if(t){const n=!!Jo?.TESTING_REMOTELY,s=we.version;if(r.set("User-Agent",`transformers.js/${s}; is_ci/${n};`),Kr(e,["http\
:","https:"],["huggingface.co","hf.co"])){const o=Jo?.HF_TOKEN??Jo?.HF_ACCESS_TOKEN;o&&r.set("Authorization",`Bearer ${o}`)}}
return r}function ps(e,t,r={},n=null){const s=r.revision??"main",a=Qs(e,t),o=mT(e),i=o?Qs(we.localModelPath,a):a,l=Qs(we.
remoteHost,we.remotePathTemplate.replaceAll("{model}",e).replaceAll("{revision}",encodeURIComponent(s)),t),c=n instanceof
sm?s==="main"?a:Qs(e,s,t):l;return{requestURL:a,localPath:i,remoteURL:l,proposedCacheKey:c,validModelId:o}}async function ms(e,t,r){
if(e)return await yT(e,t,r)}async function TT(e,t,r,n,s,a,o={}){if(await r.match(n)===void 0&&!(typeof Cache<"u"&&r instanceof
Cache&&!Kr(yi(n,{allowUnresolved:!0}),["http:","https:"])))if(a){if(typeof s!="string"){const i=new Headers(s.headers);i.
set("content-length",a.byteLength.toString()),await r.put(n,new Response(a,{headers:i})).catch(l=>{de.warn(`Unable to ad\
d response to browser cache: ${l}.`)})}}else{const i=o.progress_callback?l=>kr(o.progress_callback,{status:"progress",name:e,
file:t,...l}):void 0;await r.put(n,s,i)}}async function ET(e,t,r=!0,n={},s=!1,a=null){const{requestURL:o,localPath:i,remoteURL:l,
proposedCacheKey:c,validModelId:d}=ps(e,t,n,a);let h,_=!1,p;p=await ms(a,i,c);const w=p!==void 0;if(w)h=c;else{if(we.allowLocalModels)
if(Kr(o,["http:","https:"])){if(n.local_files_only)throw new Error(`\`local_files_only=true\`, but attempted to load a rem\
ote file from: ${o}.`);if(!we.allowRemoteModels)throw new Error(`\`env.allowRemoteModels=false\`, but attempted to load a \
remote file from: ${o}.`)}else try{p=await os(i),h=i}catch(k){de.warn(`Unable to load from local path "${i}": "${k}"`)}if(p===
void 0||typeof p!="string"&&p.status===404){if(n.local_files_only||!we.allowRemoteModels){if(r)throw new vi(`\`local_file\
s_only=true\` or \`env.allowRemoteModels=false\` and file was not found locally at "${i}".`);return null}if(!d)throw new vi(
`Local file missing at "${i}" and download aborted due to invalid model ID "${e}".`);if(p=await os(l),p.status!==200)return am(
p.status,l,r);h=c}_=a&&typeof Response<"u"&&p instanceof Response&&p.status===200}kr(n.progress_callback,{status:"downlo\
ad",name:e,file:t});let v;if(!(fe.IS_NODE_ENV&&s)){let b;if(typeof p!="string")if(!n.progress_callback)b=new Uint8Array(
await p.arrayBuffer());else if(w&&typeof navigator<"u"&&/firefox/i.test(navigator.userAgent))b=new Uint8Array(await p.arrayBuffer()),
kr(n.progress_callback,{status:"progress",name:e,file:t,progress:100,loaded:b.length,total:b.length});else{let k;const A=p.
headers.get("content-length");if(A)k=parseInt(A,10);else try{const E=await Jr(e,t,n);E.size&&(k=E.size)}catch{}b=await wT(
p,E=>{kr(n.progress_callback,{status:"progress",name:e,file:t,...E})},k)}v=b}if(_&&h&&typeof p!="string"&&await TT(e,t,a,
h,p,v,n),fe.IS_NODE_ENV&&s&&n.progress_callback&&typeof p!="string"){const b=parseInt(p.headers.get("content-length"),10)||
0;kr(n.progress_callback,{status:"progress",name:e,file:t,progress:100,loaded:b,total:b})}if(kr(n.progress_callback,{status:"\
done",name:e,file:t}),v){if(!fe.IS_NODE_ENV&&s)throw new Error("Cannot return path in a browser environment.");return v}
if(p instanceof ba)return p.filePath;const y=await a?.match(h);if(y instanceof ba)return y.filePath;if(y instanceof Response)
return new Uint8Array(await y.arrayBuffer());if(typeof y=="string")return y;throw new Error("Unable to get model file pa\
th or buffer.")}var ri=new Map;async function Ma(e,t,r=!0,n={},s=!1){if(!we.allowLocalModels){if(n.local_files_only)throw Error(
"Invalid configuration detected: local models are disabled (`env.allowLocalModels=false`) but you have requested to only\
 use local models (`local_files_only=true`).");if(!we.allowRemoteModels)throw Error("Invalid configuration detected: bot\
h local and remote models are disabled. Fix by setting `env.allowLocalModels` or `env.allowRemoteModels` to `true`.")}const a=nl(
e,n,t,r,s),{progress_callback:o}=n,i=o instanceof fa?o.loads:ri;let l=i.get(a);return l||(kr(o,{status:"initiate",name:e,
file:t}),l=An(n.cache_dir).then(c=>ET(e,t,r,n,s,c)),i===ri&&(l=l.finally(()=>ri.delete(a))),i.set(a,l)),await l}async function sl(e,t,r=!0,n={}){
const s=await Ma(e,t,r,n,!1);return s===null?null:new TextDecoder("utf-8").decode(s)}async function tr(e,t,r=!0,n={}){const s=await sl(
e,t,r,n);return s===null?{}:JSON.parse(s)}function AT(e,[t,r,n],[s,a],o="bilinear",i=!1){const l=a/n,c=s/r,d=new e.constructor(
s*a*t),h=r*n,_=s*a;for(let p=0;p<s;++p)for(let w=0;w<a;++w){const v=p*a+w,y=(w+.5)/l-.5,b=(p+.5)/c-.5;let k=Math.floor(y),
A=Math.floor(b);const E=Math.min(k+1,n-1),C=Math.min(A+1,r-1);k=Math.max(k,0),A=Math.max(A,0);const N=y-k,M=b-A,$=(1-N)*
(1-M),R=N*(1-M),j=(1-N)*M,Y=N*M,Q=A*n,z=C*n,I=Q+k,U=Q+E,X=z+k,ce=z+E;for(let Z=0;Z<t;++Z){const ne=Z*h;d[Z*_+v]=$*e[ne+I]+
R*e[ne+U]+j*e[ne+X]+Y*e[ne+ce]}}return d}function CT(e,t,r){const n=new Array(r.length),s=new Array(r.length);for(let i=r.
length-1,l=1;i>=0;--i)s[i]=l,n[i]=t[r[i]],l*=n[i];const a=r.map((i,l)=>s[r.indexOf(l)]),o=new e.constructor(e.length);for(let i=0;i<
e.length;++i){let l=0;for(let c=t.length-1,d=i;c>=0;--c)l+=d%t[c]*a[c],d=Math.floor(d/t[c]);o[l]=e[i]}return[o,n]}function nt(e){
const t=We(e)[0],r=e.map(a=>Math.exp(a-t)),n=r.reduce((a,o)=>a+o,0);return r.map(a=>a/n)}function ST(e){const t=We(e)[0];
let r=0;for(let a=0;a<e.length;++a)r+=Math.exp(e[a]-t);const n=Math.log(r);return e.map(a=>a-t-n)}function PT(e,t){let r=0;
for(let n=0;n<e.length;++n)r+=e[n]*t[n];return r}function oz(e,t){const r=PT(e,t),n=i_(e),s=i_(t);return r/(n*s)}function i_(e){
return Math.sqrt(e.reduce((t,r)=>t+r*r,0))}function bi(e){if(e.length===0)throw Error("Array must not be empty");let t=e[0],
r=0;for(let n=1;n<e.length;++n)e[n]<t&&(t=e[n],r=n);return[t,r]}function We(e){if(e.length===0)throw Error("Array must n\
ot be empty");let t=e[0],r=0;for(let n=1;n<e.length;++n)e[n]>t&&(t=e[n],r=n);return[t,r]}function cm(e){return e>0&&(e&e-
1)===0}var um=class{constructor(e){if(this.size=e|0,this.size<=1||!cm(this.size))throw new Error("FFT size must be a pow\
er of two larger than 1");this._csize=e<<1,this.table=new Float64Array(this.size*2);for(let r=0;r<this.table.length;r+=2){
const n=Math.PI*r/this.size;this.table[r]=Math.cos(n),this.table[r+1]=-Math.sin(n)}let t=0;for(let r=1;this.size>r;r<<=1)
++t;this._width=t%2===0?t-1:t,this._bitrev=new Int32Array(1<<this._width);for(let r=0;r<this._bitrev.length;++r){this._bitrev[r]=
0;for(let n=0;n<this._width;n+=2){const s=this._width-n-2;this._bitrev[r]|=(r>>>n&3)<<s}}}createComplexArray(){return new Float64Array(
this._csize)}fromComplexArray(e,t){const r=t||new Array(e.length>>>1);for(let n=0;n<e.length;n+=2)r[n>>>1]=e[n];return r}toComplexArray(e,t){
const r=t||this.createComplexArray();for(let n=0;n<r.length;n+=2)r[n]=e[n>>>1],r[n+1]=0;return r}transform(e,t){if(e===t)
throw new Error("Input and output buffers must be different");this._transform4(e,t,1)}realTransform(e,t){if(e===t)throw new Error(
"Input and output buffers must be different");this._realTransform4(e,t,1)}inverseTransform(e,t){if(e===t)throw new Error(
"Input and output buffers must be different");this._transform4(e,t,-1);for(let r=0;r<e.length;++r)e[r]/=this.size}_transform4(e,t,r){
const n=this._csize;let a=1<<this._width,o=n/a<<1,i,l;const c=this._bitrev;if(o===4)for(i=0,l=0;i<n;i+=o,++l){const h=c[l];
this._singleTransform2(t,e,i,h,a)}else for(i=0,l=0;i<n;i+=o,++l){const h=c[l];this._singleTransform4(t,e,i,h,a,r)}const d=this.
table;for(a>>=2;a>=2;a>>=2){o=n/a<<1;const h=o>>>2;for(i=0;i<n;i+=o){const _=i+h-1;for(let p=i,w=0;p<_;p+=2,w+=a){const v=p,
y=v+h,b=y+h,k=b+h,A=e[v],E=e[v+1],C=e[y],N=e[y+1],M=e[b],$=e[b+1],R=e[k],j=e[k+1],Y=d[w],Q=r*d[w+1],z=C*Y-N*Q,I=C*Q+N*Y,
U=d[2*w],X=r*d[2*w+1],ce=M*U-$*X,Z=M*X+$*U,ne=d[3*w],L=r*d[3*w+1],O=R*ne-j*L,V=R*L+j*ne,se=A+ce,ae=E+Z,qe=A-ce,Ee=E-Z,Ae=z+
O,$e=I+V,Fe=r*(z-O),ye=r*(I-V);e[v]=se+Ae,e[v+1]=ae+$e,e[y]=qe+ye,e[y+1]=Ee-Fe,e[b]=se-Ae,e[b+1]=ae-$e,e[k]=qe-ye,e[k+1]=
Ee+Fe}}}}_singleTransform2(e,t,r,n,s){const a=e[n],o=e[n+1],i=e[n+s],l=e[n+s+1];t[r]=a+i,t[r+1]=o+l,t[r+2]=a-i,t[r+3]=o-
l}_singleTransform4(e,t,r,n,s,a){const o=s*2,i=s*3,l=e[n],c=e[n+1],d=e[n+s],h=e[n+s+1],_=e[n+o],p=e[n+o+1],w=e[n+i],v=e[n+
i+1],y=l+_,b=c+p,k=l-_,A=c-p,E=d+w,C=h+v,N=a*(d-w),M=a*(h-v);t[r]=y+E,t[r+1]=b+C,t[r+2]=k+M,t[r+3]=A-N,t[r+4]=y-E,t[r+5]=
b-C,t[r+6]=k-M,t[r+7]=A+N}_realTransform4(e,t,r){const n=this._csize;let a=1<<this._width,o=n/a<<1,i,l;const c=this._bitrev;
if(o===4)for(i=0,l=0;i<n;i+=o,++l){const _=c[l];this._singleRealTransform2(t,e,i,_>>>1,a>>>1)}else for(i=0,l=0;i<n;i+=o,
++l){const _=c[l];this._singleRealTransform4(t,e,i,_>>>1,a>>>1,r)}const d=this.table;for(a>>=2;a>=2;a>>=2){o=n/a<<1;const _=o>>>
1,p=_>>>1,w=p>>>1;for(i=0;i<n;i+=o)for(let v=0,y=0;v<=w;v+=2,y+=a){const b=i+v,k=b+p,A=k+p,E=A+p,C=e[b],N=e[b+1],M=e[k],
$=e[k+1],R=e[A],j=e[A+1],Y=e[E],Q=e[E+1],z=C,I=N,U=d[y],X=r*d[y+1],ce=M*U-$*X,Z=M*X+$*U,ne=d[2*y],L=r*d[2*y+1],O=R*ne-j*
L,V=R*L+j*ne,se=d[3*y],ae=r*d[3*y+1],qe=Y*se-Q*ae,Ee=Y*ae+Q*se,Ae=z+O,$e=I+V,Fe=z-O,ye=I-V,it=ce+qe,be=Z+Ee,Me=r*(ce-qe),
en=r*(Z-Ee);if(e[b]=Ae+it,e[b+1]=$e+be,e[k]=Fe+en,e[k+1]=ye-Me,v===0){e[A]=Ae-it,e[A+1]=$e-be;continue}if(v===w)continue;
const Un=i+p-v,tn=i+_-v;e[Un]=Fe-r*en,e[Un+1]=-ye-r*Me,e[tn]=Ae-r*it,e[tn+1]=-$e+r*be}}const h=n>>>1;for(let _=2;_<h;_+=
2)e[n-_]=e[_],e[n-_+1]=-e[_+1]}_singleRealTransform2(e,t,r,n,s){const a=e[n],o=e[n+s];t[r]=a+o,t[r+1]=0,t[r+2]=a-o,t[r+3]=
0}_singleRealTransform4(e,t,r,n,s,a){const o=s*2,i=s*3,l=e[n],c=e[n+s],d=e[n+o],h=e[n+i],_=l+d,p=l-d,w=c+h,v=a*(c-h);t[r]=
_+w,t[r+1]=0,t[r+2]=p,t[r+3]=-v,t[r+4]=_-w,t[r+5]=0,t[r+6]=p,t[r+7]=v}},FT=class{constructor(e){const t=2*(e-1),r=2*(2*e-
1),n=2**Math.ceil(Math.log2(r));this.bufferSize=n,this._a=t;const s=new Float64Array(r),a=new Float64Array(n);this._chirpBuffer=
new Float64Array(n),this._buffer1=new Float64Array(n),this._buffer2=new Float64Array(n),this._outBuffer1=new Float64Array(
n),this._outBuffer2=new Float64Array(n);const o=-2*Math.PI/e,i=Math.cos(o),l=Math.sin(o);for(let c=0;c<r>>1;++c){const d=(c+
1-e)**2/2,h=Math.sqrt(i**2+l**2)**d,_=d*Math.atan2(l,i),p=2*c;s[p]=h*Math.cos(_),s[p+1]=h*Math.sin(_),a[p]=s[p],a[p+1]=-s[p+
1]}this._slicedChirpBuffer=s.subarray(t,r),this._f=new um(n>>1),this._f.transform(this._chirpBuffer,a)}_transform(e,t,r){
const n=this._buffer1,s=this._buffer2,a=this._outBuffer1,o=this._outBuffer2,i=this._chirpBuffer,l=this._slicedChirpBuffer,
c=this._a;if(r)for(let d=0;d<l.length;d+=2){const h=d+1,_=d>>1,p=t[_];n[d]=p*l[d],n[h]=p*l[h]}else for(let d=0;d<l.length;d+=
2){const h=d+1;n[d]=t[d]*l[d]-t[h]*l[h],n[h]=t[d]*l[h]+t[h]*l[d]}this._f.transform(a,n);for(let d=0;d<i.length;d+=2){const h=d+
1;s[d]=a[d]*i[d]-a[h]*i[h],s[h]=a[d]*i[h]+a[h]*i[d]}this._f.inverseTransform(o,s);for(let d=0;d<o.length;d+=2){const h=o[d+
c],_=o[d+c+1],p=l[d],w=l[d+1];e[d]=h*p-_*w,e[d+1]=h*w+_*p}}transform(e,t){this._transform(e,t,!1)}realTransform(e,t){this.
_transform(e,t,!0)}},IT=class{constructor(e){this.fft_length=e,this.isPowerOfTwo=cm(e),this.isPowerOfTwo?(this.fft=new um(
e),this.outputBufferSize=2*e):(this.fft=new FT(e),this.outputBufferSize=this.fft.bufferSize)}realTransform(e,t){this.fft.
realTransform(e,t)}transform(e,t){this.fft.transform(e,t)}};function LT(e,t){if(t%2===0||t<=0)throw new Error("Window si\
ze must be a positive odd number");const r=new e.constructor(e.length),n=new e.constructor(t),s=Math.floor(t/2);for(let a=0;a<
e.length;++a){let o=0;for(let i=-s;i<=s;++i){let l=a+i;l<0?l=Math.abs(l):l>=e.length&&(l=2*(e.length-1)-l),n[o++]=e[l]}n.
sort(),r[a]=n[s]}return r}function ts(e,t){const r=Math.pow(10,t);return Math.round(e*r)/r}function OT(e){const t=Math.round(
e);return Math.abs(e)%1===.5?t%2===0?t:t-1:t}function NT(e){const t=e.length,r=e[0].length,n=[t+1,r+1],s=Array.from({length:n[0]},
()=>Array(n[1]).fill(1/0));s[0][0]=0;const a=Array.from({length:n[0]},()=>Array(n[1]).fill(-1));for(let d=1;d<n[1];++d)for(let h=1;h<
n[0];++h){const _=s[h-1][d-1],p=s[h-1][d],w=s[h][d-1];let v,y;_<p&&_<w?(v=_,y=0):p<_&&p<w?(v=p,y=1):(v=w,y=2),s[h][d]=e[h-
1][d-1]+v,a[h][d]=y}for(let d=0;d<n[1];++d)a[0][d]=2;for(let d=0;d<n[0];++d)a[d][0]=1;let o=t,i=r,l=[],c=[];for(;o>0||i>
0;)switch(l.push(o-1),c.push(i-1),a[o][i]){case 0:--o,--i;break;case 1:--o;break;case 2:--i;break;default:throw new Error(
`Internal error in dynamic time warping. Unexpected trace[${o}, ${i}]. Please file a bug report.`)}return l.reverse(),c.
reverse(),[l,c]}var DT=(function(){let e=null;return function(t){if(!e){e=new Float32Array(65536);const a=new ArrayBuffer(
4),o=new Uint32Array(a),i=new Float32Array(a);for(let l=0;l<e.length;++l){let c=0;const d=(l&32768)<<16,h=(l&31744)>>10;
let _=l&1023;if(h===31)c=d|2139095040|_<<13;else if(h===0)if(_===0)c=d;else{let p=113;for(;(_&1024)===0;)_<<=1,--p;_&=-1025,
c=d|p<<23|_<<13}else c=d|h+112<<23|_<<13;o[0]=c,e[l]=i[0]}}const r=t.length,n=e,s=new Float32Array(r);for(let a=0;a<r;++a)
s[a]=n[t[a]];return s}})(),zT={};async function dm(e){const t=e.split("/").pop();let r;try{if(r=await An(),r){const s=await r.
match(e);if(s)return s}}catch(s){de.warn(`Failed to load ${t} from cache:`,s)}const n=await we.fetch(e);if(!n.ok)throw new Error(
`Failed to fetch ${t}: ${n.status} ${n.statusText}`);if(r)try{await r.put(e,n.clone())}catch(s){de.warn(`Failed to cache\
 ${t}:`,s)}return n}async function BT(e){const t=await dm(e);if(!t||typeof t=="string")return null;try{return await t.arrayBuffer()}catch(r){
return de.warn("Failed to read WASM binary:",r),null}}async function RT(e){if(fe.IS_SERVICE_WORKER_ENV||fe.IS_CHROME_AVAILABLE)
return e;const t=await dm(e);if(!t||typeof t=="string")return null;try{let r=await t.text();r=r.replaceAll("globalThis.p\
rocess?.versions?.node","false");const n=new Blob([r],{type:"text/javascript"});return URL.createObjectURL(n)}catch(r){return de.
warn("Failed to read WASM factory:",r),null}}var $T=Object.freeze({auto:null,gpu:null,cpu:"cpu",wasm:"wasm",webgpu:"webg\
pu",cuda:"cuda",dml:"dml",coreml:"coreml",webnn:{name:"webnn",deviceType:"cpu"},"webnn-npu":{name:"webnn",deviceType:"np\
u"},"webnn-gpu":{name:"webnn",deviceType:"gpu"},"webnn-cpu":{name:"webnn",deviceType:"cpu"}});function hm(e){return e<=Nt.
DEBUG?0:e<=Nt.INFO?2:e<=Nt.WARNING||e<=Nt.ERROR?3:4}var GT={0:"verbose",1:"info",2:"warning",3:"error",4:"fatal"},vt=[],
Mi,bn,l_=Symbol.for("onnxruntime");if(l_ in globalThis)bn=globalThis[l_];else if(fe.IS_NODE_ENV){switch(bn=zT,process.platform){case"\
win32":vt.push("dml");break;case"linux":process.arch==="x64"&&vt.push("cuda");break;case"darwin":vt.push("coreml");break}
vt.push("webgpu"),vt.push("cpu"),Mi=["cpu"]}else bn=uM,fe.IS_WEBNN_AVAILABLE&&vt.push("webnn-npu","webnn-gpu","webnn-cpu",
"webnn"),fe.IS_WEBGPU_AVAILABLE&&vt.push("webgpu"),vt.push("wasm"),Mi=["wasm"];function VT(){return[...vt]}var UT=bn.InferenceSession;
function jT(e=null){if(!e)return Mi;switch(e){case"auto":return vt;case"gpu":return vt.filter(t=>["webgpu","cuda","dml",
"webnn-gpu"].includes(t))}if(vt.includes(e))return[$T[e]??e];throw new Error(`Unsupported device: "${e}". Should be one \
of: ${vt.join(", ")}.`)}var c_=Promise.resolve(),dn=null;async function qT(){if(dn)return dn;if(!(we.useWasmCache&&typeof Ye?.
wasm?.wasmPaths=="object"&&Ye?.wasm?.wasmPaths?.wasm&&Ye?.wasm?.wasmPaths?.mjs)){if(fe.IS_DENO_WEB_RUNTIME)throw new Error(
"env.useWasmCache=false is not supported in Deno's web runtime. Remove the useWasmCache override.");return dn=Promise.resolve(),
dn}return dn=(async()=>{const t=Ye.wasm.wasmPaths;let r=!1;await Promise.all([t.wasm&&!s_(t.wasm)?(async()=>{try{const n=await BT(
yi(t.wasm));n&&(Ye.wasm.wasmBinary=n,r=!0)}catch(n){de.warn("Failed to pre-load WASM binary:",n)}})():Promise.resolve(),
t.mjs&&!s_(t.mjs)?(async()=>{try{const n=await RT(yi(t.mjs));n&&(Ye.wasm.wasmPaths.mjs=n)}catch(n){de.warn("Failed to pr\
e-load WASM factory:",n)}})():Promise.resolve()]),r||(Ye.wasm.wasmPaths.mjs=t.mjs)})(),dn}async function fm(e,t,r){await qT();
const n=hm(we.logLevel??Nt.WARNING),s=()=>UT.create(e,{logSeverityLevel:n,...t}),a=await(fe.IS_WEB_ENV?c_=c_.then(s):s());
return a.config=r,a}var u_=Promise.resolve();async function _m(e,t){const r=()=>e.run(t);return fe.IS_WEB_ENV?u_=u_.then(
r):r()}function pm(e){return e instanceof bn.Tensor}var Ye=bn?.env;function al(){return Ye?.wasm?.proxy}if(Ye){let e=function(t){
const r=hm(t);Ye.logLevel=GT[r]};if(Ye.wasm){if(!(typeof ServiceWorkerGlobalScope<"u"&&self instanceof ServiceWorkerGlobalScope)&&
Ye.versions?.web&&!Ye.wasm.wasmPaths){const t=`https://cdn.jsdelivr.net/npm/onnxruntime-web@${Ye.versions.web}/dist/`;let r="\
.asyncify";fe.IS_SAFARI_BELOW_26&&!fe.IS_WEBGPU_AVAILABLE&&(r=""),Ye.wasm.wasmPaths={mjs:`${t}ort-wasm-simd-threaded${r}\
.mjs`,wasm:`${t}ort-wasm-simd-threaded${r}.wasm`}}Ye.wasm.proxy=!1}Ye.webgpu&&(Ye.webgpu.powerPreference="high-performan\
ce"),e(we.logLevel??Nt.WARNING),we.backends.onnx={...Ye,setLogLevel:e,getSupportedDevices:VT}}var br=async(e,t,r)=>{const n=await fm(
new Uint8Array(e),t);return(async s=>{const a=al(),o=Object.fromEntries(Object.entries(s).map(([l,c])=>[l,(a?c.clone():c).
ort_tensor])),i=await _m(n,o);return Array.isArray(r)?r.map(l=>new G(i[l])):new G(i[r])})},Wr=class{static session_options={};static get nearest_interpolate_4d(){
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
bnn-gpu":"webnn-gpu","webnn-cpu":"webnn-cpu"}),ni=fe.IS_NODE_ENV?"cpu":"wasm";function mm(e,t,{warn:r}={}){return e?typeof e==
"string"?e:e.hasOwnProperty(t)?e[t]:(r&&r(`device not specified for "${t}". Using the default device (${ni}).`),ni):ni}var HT=(function(){
let e;return async function(){if(e===void 0)if(!fe.IS_WEBGPU_AVAILABLE)e=!1;else try{e=(await navigator.gpu.requestAdapter()).
features.has("shader-f16")}catch{e=!1}return e}})(),Qe=Object.freeze({auto:"auto",fp32:"fp32",fp16:"fp16",q8:"q8",int8:"\
int8",uint8:"uint8",q4:"q4",bnb4:"bnb4",q4f16:"q4f16",q2:"q2",q2f16:"q2f16",q1:"q1",q1f16:"q1f16"}),d_=Qe.fp32,h_=Object.
freeze({[WT.wasm]:Qe.q8}),is=Object.freeze({[Qe.fp32]:"",[Qe.fp16]:"_fp16",[Qe.int8]:"_int8",[Qe.uint8]:"_uint8",[Qe.q8]:"\
_quantized",[Qe.q4]:"_q4",[Qe.q2]:"_q2",[Qe.q1]:"_q1",[Qe.q4f16]:"_q4f16",[Qe.q2f16]:"_q2f16",[Qe.q1f16]:"_q1f16",[Qe.bnb4]:"\
_bnb4"});function gm(e,t,r,{configDtype:n=null,warn:s}={}){let a,o=!1;e&&typeof e!="string"?e.hasOwnProperty(t)?a=e[t]:(a=
null,o=!0):a=e;let i;if(a===Qe.auto){if(n){const l=typeof n=="string"?n:n?.[t];if(l&&l!==Qe.auto&&Qe.hasOwnProperty(l))return l}
i=h_[r]??d_}else a&&Qe.hasOwnProperty(a)?i=a:i=h_[r]??d_;return o&&s&&s(`dtype not specified for "${t}". Using the defau\
lt dtype (${i}) for this device (${r}).`),i}var ls=Object.freeze({float32:Float32Array,float16:typeof Float16Array<"u"?Float16Array:
Uint16Array,float64:Float64Array,string:Array,int8:Int8Array,uint8:Uint8Array,int16:Int16Array,uint16:Uint16Array,int32:Int32Array,
uint32:Uint32Array,int64:BigInt64Array,uint64:BigUint64Array,bool:Uint8Array,uint4:Uint8Array,int4:Int8Array}),G=class Ue{get dims(){
return this.ort_tensor.dims}set dims(t){this.ort_tensor.dims=t}get type(){return this.ort_tensor.type}get data(){return this.
ort_tensor.data}get size(){return this.ort_tensor.size}get location(){return this.ort_tensor.location}ort_tensor;constructor(...t){
return pm(t[0])?this.ort_tensor=t[0]:this.ort_tensor=new bM(t[0],t[1],t[2]),new Proxy(this,{get:(r,n)=>{if(typeof n=="st\
ring"){let s=Number(n);if(Number.isInteger(s))return r._getitem(s)}return r[n]},set:(r,n,s)=>r[n]=s})}dispose(){this.ort_tensor.
dispose()}*[Symbol.iterator](){const[t,...r]=this.dims;if(r.length>0){const n=r.reduce((s,a)=>s*a);for(let s=0;s<t;++s)yield this.
_subarray(s,n,r)}else yield*this.data}_getitem(t){const[r,...n]=this.dims;if(t=Ot(t,r),n.length>0){const s=n.reduce((a,o)=>a*
o);return this._subarray(t,s,n)}else return new Ue(this.type,[this.data[t]],n)}_subarray(t,r,n){const s=t*r,a=(t+1)*r,o="\
subarray"in this.data?this.data.subarray(s,a):this.data.slice(s,a);return new Ue(this.type,o,n)}item(){const t=this.data;
if(t.length!==1)throw new Error(`a Tensor with ${t.length} elements cannot be converted to Scalar`);return t[0]}tolist(){
return QT(this.data,this.dims)}sigmoid(){return this.clone().sigmoid_()}sigmoid_(){const t=this.data;for(let r=0;r<t.length;++r)
t[r]=1/(1+Math.exp(-t[r]));return this}map(t){return this.clone().map_(t)}map_(t){const r=this.data;for(let n=0;n<r.length;++n)
r[n]=t(r[n],n,r);return this}mul(t){return this.clone().mul_(t)}mul_(t){const r=this.data;for(let n=0;n<r.length;++n)r[n]*=
t;return this}div(t){return this.clone().div_(t)}div_(t){const r=this.data;for(let n=0;n<r.length;++n)r[n]/=t;return this}add(t){
return this.clone().add_(t)}add_(t){const r=this.data;for(let n=0;n<r.length;++n)r[n]+=t;return this}sub(t){return this.
clone().sub_(t)}sub_(t){const r=this.data;for(let n=0;n<r.length;++n)r[n]-=t;return this}remainder(t){return this.clone().
remainder_(t)}remainder_(t){const r=this.data,s=r instanceof BigInt64Array||r instanceof BigUint64Array?BigInt(t):Number(
t);if((s===0||s===0n)&&(this.type.includes("int")||this.type==="bool"))throw new RangeError("Division by zero");if(s<0&&
(this.type.startsWith("uint")||this.type==="bool"))throw new RangeError("Negative divisors are not supported for unsigne\
d or boolean tensors");for(let a=0;a<r.length;++a){const o=r[a]%s,i=o<0&&s>0||o>0&&s<0;r[a]=i?o+s:o}return this}clone(){
return new Ue(this.type,this.data.slice(),this.dims.slice())}slice(...t){const r=[],n=[];for(let d=0;d<this.dims.length;++d){
let h=t[d];if(h==null)n.push([0,this.dims[d]]),r.push(this.dims[d]);else if(typeof h=="number")h=Ot(h,this.dims[d],d),n.
push([h,h+1]);else if(Array.isArray(h)&&h.length===2){let[_,p]=h;if(_=_===null?0:Ot(_,this.dims[d],d,!1),p=p===null?this.
dims[d]:Ot(p,this.dims[d],d,!1),_>p)throw new Error(`Invalid slice: ${h}`);const w=[Math.max(_,0),Math.min(p,this.dims[d])];
n.push(w),r.push(w[1]-w[0])}else throw new Error(`Invalid slice: ${h}`)}const s=n.map(([d,h])=>h-d),a=s.reduce((d,h)=>d*
h),o=this.data,i=new o.constructor(a),l=this.stride();let c=!0;for(let d=1;d<s.length;++d)if(n[d][0]!==0||n[d][1]!==this.
dims[d]){c=!1;break}if(c){const d=n[0][0]*l[0],h=n[0][1]*l[0];if(ArrayBuffer.isView(o))i.set(o.subarray(d,h));else if(Array.
isArray(o)){const _=o.slice(d,h);for(let p=0;p<_.length;++p)i[p]=_[p]}else throw new Error("Unsupported data type for sl\
icing")}else for(let d=0;d<a;++d){let h=0;for(let _=s.length-1,p=d;_>=0;--_){const w=s[_];h+=(p%w+n[_][0])*l[_],p=Math.floor(
p/w)}i[d]=o[h]}return new Ue(this.type,i,r)}permute(...t){return XT(this,t)}transpose(...t){return this.permute(...t)}sum(t=null,r=!1){
return this.norm(1,t,r)}norm(t="fro",r=null,n=!1){if(t==="fro")t=2;else if(typeof t=="string")throw Error(`Unsupported n\
orm: ${t}`);const s=this.data,a=s instanceof BigInt64Array||s instanceof BigUint64Array;if(a&&t!==1)throw Error(`Expecte\
d a floating point tensor as input. Got ${this.type}`);let o,i;if(a?(o=(h,_)=>h+_,i=0n):(o=(h,_)=>h+_**t,i=0),r===null){
let h=s.reduce(o,i);return t!==1&&(h=h**(1/t)),new Ue(this.type,[h],[])}const[l,c,d]=ns(o,this,r,n);if(t!==1)for(let h=0;h<
c.length;++h)c[h]=c[h]**(1/t);return new Ue(l,c,d)}normalize_(t=2,r=1){r=Ot(r,this.dims.length);const n=this.norm(t,r,!0),
s=this.data,a=n.data;for(let o=0;o<s.length;++o){let i=0;for(let l=this.dims.length-1,c=o,d=1;l>=0;--l){const h=this.dims[l];
if(l!==r){const _=c%h;i+=_*d,d*=this.dims[l]}c=Math.floor(c/h)}s[o]/=a[i]}return this}normalize(t=2,r=1){return this.clone().
normalize_(t,r)}stride(){return si(this.dims)}squeeze(t=null){return new Ue(this.type,this.data,f_(this.dims,t))}squeeze_(t=null){
return this.dims=f_(this.dims,t),this}unsqueeze(t){return new Ue(this.type,this.data,__(this.dims,t))}unsqueeze_(t){return this.
dims=__(this.dims,t),this}flatten_(t=0,r=-1){r=(r+this.dims.length)%this.dims.length;let n=this.dims.slice(0,t),s=this.dims.
slice(t,r+1),a=this.dims.slice(r+1);return this.dims=[...n,s.reduce((o,i)=>o*i,1),...a],this}flatten(t=0,r=-1){return this.
clone().flatten_(t,r)}view(...t){let r=-1;for(let s=0;s<t.length;++s)if(t[s]===-1){if(r!==-1)throw new Error("Only one d\
imension can be inferred");r=s}const n=this.data;if(r!==-1){const s=t.reduce((a,o,i)=>i!==r?a*o:a,1);t[r]=n.length/s}return new Ue(
this.type,n,t)}neg_(){const t=this.data;for(let r=0;r<t.length;++r)t[r]=-t[r];return this}neg(){return this.clone().neg_()}gt(t){
const r=new Uint8Array(this.data.length),n=this.data;for(let s=0;s<n.length;++s)r[s]=n[s]>t?1:0;return new Ue("bool",r,this.
dims)}lt(t){const r=new Uint8Array(this.data.length),n=this.data;for(let s=0;s<n.length;++s)r[s]=n[s]<t?1:0;return new Ue(
"bool",r,this.dims)}clamp_(t,r){const n=this.data;for(let s=0;s<n.length;++s)n[s]=Math.min(Math.max(n[s],t),r);return this}clamp(t,r){
return this.clone().clamp_(t,r)}round_(){const t=this.data;for(let r=0;r<t.length;++r)t[r]=Math.round(t[r]);return this}round(){
return this.clone().round_()}mean(t=null,r=!1){return ol(this,t,r)}min(t=null,r=!1){if(t===null){const o=bi(this.data)[0];
return new Ue(this.type,[o],[])}const[n,s,a]=ns((o,i)=>Math.min(o,i),this,t,r,1/0);return new Ue(n,s,a)}max(t=null,r=!1){
if(t===null){const o=We(this.data)[0];return new Ue(this.type,[o],[])}const[n,s,a]=ns((o,i)=>Math.max(o,i),this,t,r,-1/0);
return new Ue(n,s,a)}argmin(t=null,r=!1){if(t!==null)throw new Error("`dim !== null` not yet implemented.");const n=bi(this.
data)[1];return new Ue("int64",[BigInt(n)],[])}argmax(t=null,r=!1){if(t!==null)throw new Error("`dim !== null` not yet i\
mplemented.");const n=We(this.data)[1];return new Ue("int64",[BigInt(n)],[])}repeat(...t){if(t.length<this.dims.length)throw new Error(
`Number of dimensions of repeat dims (${t.length}) cannot be smaller than number of dimensions of tensor (${this.dims.length}\
)`);if(t.every(d=>d===1)){if(t.length===this.dims.length)return this.clone();const d=t.length-this.dims.length,h=Array(d).
fill(1).concat(this.dims);return new Ue(this.type,this.data.slice(),h)}const r=t.length-this.dims.length,n=Array(r).fill(
1).concat(this.dims),s=n.map((d,h)=>d*t[h]),a=s.reduce((d,h)=>d*h,1),o=this.data,i=new o.constructor(a),l=si(n),c=si(s);
for(let d=0;d<a;++d){let h=d,_=0;for(let p=0;p<s.length;++p){const w=Math.floor(h/c[p]);h=h%c[p];const v=w%n[p];_+=v*l[p]}
i[d]=o[_]}return new Ue(this.type,i,s)}tile(...t){if(t.length<this.dims.length){const r=this.dims.length-t.length;t=Array(
r).fill(1).concat(t)}return this.repeat(...t)}to(t){if(this.type===t)return this;if(!ls.hasOwnProperty(t))throw new Error(
`Unsupported type: ${t}`);let r;const n=["int64","uint64"].includes(this.type),s=["int64","uint64"].includes(t);if(n&&!s)
r=Number;else if(!n&&s)["float16","float32","float64"].includes(this.type)?r=a=>BigInt(Math.floor(a)):r=BigInt;else if(this.
type==="float16"&&t=="float32"&&this.data instanceof Uint16Array)return new Ue(t,DT(this.data),this.dims);return new Ue(
t,ls[t].from(this.data,r),this.dims)}};function QT(e,t){const r=e.length,n=t.length===0?1:t.reduce((a,o)=>a*o);if(r!==n)
throw Error(`cannot reshape array of size ${r} into shape (${t})`);let s=e;for(let a=t.length-1;a>=0;a--)s=s.reduce((o,i)=>{
let l=o[o.length-1];return l.length<t[a]?l.push(i):o.push([i]),o},[[]]);return s[0]}function XT(e,t){const[r,n]=CT(e.data,
e.dims,t);return new G(e.type,r,n)}function wm(e,[t,r],n="bilinear",s=!1){const a=e.dims.at(-3)??1,o=e.dims.at(-2),i=e.dims.
at(-1),l=AT(e.data,[a,o,i],[t,r],n,s);return new G(e.type,l,[a,t,r])}async function Rt(e,{size:t=null,mode:r="bilinear"}={}){
if(e.dims.length!==4)throw new Error("`interpolate_4d` currently only supports 4D input.");if(!t)throw new Error("`inter\
polate_4d` requires a `size` argument.");let n;if(t.length===2)n=[...e.dims.slice(0,2),...t];else if(t.length===3)n=[e.dims[0],
...t];else if(t.length===4)n=t;else throw new Error("`size` must be of length 2, 3, or 4.");let s;if(r==="nearest")s=await Wr.
nearest_interpolate_4d;else if(r==="bilinear")s=await Wr.bilinear_interpolate_4d;else if(r==="bicubic")s=await Wr.bicubic_interpolate_4d;else
throw new Error(`Unsupported mode: ${r}`);const a=new G("int64",new BigInt64Array(n.map(BigInt)),[n.length]);return await s(
{x:e,s:a})}async function YT(e,t){return await(await Wr.matmul)({a:e,b:t})}async function iz(e,t){const r=Ot(Number(t.item()),
e.dims.length);return await(await Wr.rfft)({x:e.unsqueeze(-1),a:new G("int64",[BigInt(r)],[])})}async function Cn(e,t){const r=await Wr.
top_k;return t==null?t=e.dims.at(-1):t=Math.min(t,e.dims.at(-1)),await r({x:e,k:new G("int64",[BigInt(t)],[1])})}var Xs=e=>new G(
"int64",e,[e.length]);async function vm(e,t,r,n,s){return await(await Wr.slice)({x:e,s:Xs(t),e:Xs(r),a:Xs(n),t:Xs(s??new Array(
n.length).fill(1))})}function KT(e,t){const r=e.data,n=t.data,s=[e.dims[0],e.dims[2]],a=new r.constructor(s[0]*s[1]),[o,
i,l]=e.dims;let c=0;for(let d=0;d<o;++d){const h=d*l*i;for(let _=0;_<l;++_){let p=0,w=0;const v=d*i,y=h+_;for(let k=0;k<
i;++k){const A=Number(n[v+k]);w+=A,p+=r[y+k*l]*A}const b=p/w;a[c++]=b}}return new G(e.type,a,s)}function lz(e,t,{eps:r=1e-5}={}){
if(e.dims.length!==2)throw new Error("`layer_norm` currently only supports 2D input.");const[n,s]=e.dims;if(t.length!==1&&
t[0]!==s)throw new Error("`normalized_shape` must be a 1D array with shape `[input.dims[1]]`.");const[a,o]=ym(e,1,0,!0),
i=a.data,l=o.data,c=e.data,d=new c.constructor(c.length);for(let h=0;h<n;++h){const _=h*s;for(let p=0;p<s;++p){const w=_+
p;d[w]=(c[w]-l[h])/(i[h]+r)}}return new G(e.type,d,e.dims)}function f_(e,t){return e=e.slice(),t===null?e=e.filter(r=>r!==
1):typeof t=="number"?e[t]===1&&e.splice(t,1):Array.isArray(t)&&(e=e.filter((r,n)=>r!==1||!t.includes(n))),e}function __(e,t){
return t=Ot(t,e.length+1),e=e.slice(),e.splice(t,0,1),e}function Ot(e,t,r=null,n=!0){if(e<-t||e>=t){if(n)throw new Error(
`IndexError: index ${e} is out of bounds for dimension${r===null?"":" "+r} with size ${t}`);return e<-t?0:t}return e<0&&
(e=(e%t+t)%t),e}function Oe(e,t=0){t=Ot(t,e[0].dims.length);const r=e[0].dims.slice();r[t]=e.reduce((o,i)=>o+i.dims[t],0);
const n=r.reduce((o,i)=>o*i,1),s=new e[0].data.constructor(n),a=e[0].type;if(t===0){let o=0;for(const i of e){const l=i.
data;s.set(l,o),o+=l.length}}else{let o=0;for(let i=0;i<e.length;++i){const{data:l,dims:c}=e[i];for(let d=0;d<l.length;++d){
let h=0;for(let _=c.length-1,p=d,w=1;_>=0;--_){const v=c[_];let y=p%v;_===t&&(y+=o),h+=y*w,w*=r[_],p=Math.floor(p/v)}s[h]=
l[d]}o+=c[t]}}return new G(a,s,r)}function ur(e,t=0){return Oe(e.map(r=>r.unsqueeze(t)),t)}function ns(e,t,r,n=!1,s=null){
const a=t.data,o=t.dims;r=Ot(r,o.length);const i=o.slice();i[r]=1;const l=new a.constructor(a.length/o[r]);s!==null&&l.fill(
s);for(let c=0;c<a.length;++c){let d=0;for(let h=o.length-1,_=c,p=1;h>=0;--h){const w=o[h];if(h!==r){const v=_%w;d+=v*p,
p*=i[h]}_=Math.floor(_/w)}l[d]=e(l[d],a[c],c,d)}return n||i.splice(r,1),[t.type,l,i]}function ym(e,t=null,r=1,n=!1){const s=e.
data,a=e.dims;if(t===null){const p=s.reduce((b,k)=>b+k,0)/s.length,w=Math.sqrt(s.reduce((b,k)=>b+(k-p)**2,0)/(s.length-r)),
v=new G(e.type,[p],[]);return[new G(e.type,[w],[]),v]}t=Ot(t,a.length);const o=ol(e,t,n),i=o.data,[l,c,d]=ns((_,p,w,v)=>_+
(p-i[v])**2,e,t,n);for(let _=0;_<c.length;++_)c[_]=Math.sqrt(c[_]/(a[t]-r));return[new G(l,c,d),o]}function ol(e,t=null,r=!1){
const n=e.dims,s=e.data;if(t===null){const l=s.reduce((c,d)=>c+d,0);return new G(e.type,[l/s.length],[])}t=Ot(t,n.length);
const[a,o,i]=ns((l,c)=>l+c,e,t,r);if(n[t]!==1)for(let l=0;l<o.length;++l)o[l]/=n[t];return new G(a,o,i)}function si(e){const t=new Array(
e.length);for(let r=e.length-1,n=1;r>=0;--r)t[r]=n,n*=e[r];return t}function il(e,t,r,n){const s=e.reduce((a,o)=>a*o,1);
return new G(r,new n(s).fill(t),e)}function ct(e,t){let r,n;if(typeof t=="number")r="float32",n=Float32Array;else if(typeof t==
"bigint")r="int64",n=BigInt64Array;else if(typeof t=="boolean")r="bool",n=Uint8Array;else throw new Error(`Unsupported d\
ata type: ${typeof t}`);return il(e,t,r,n)}function xi(e,t){return ct(e.dims,t)}function _t(e){return il(e,1n,"int64",BigInt64Array)}
function ll(e){return _t(e.dims)}function bm(e){return il(e,0n,"int64",BigInt64Array)}function cl(e){return bm(e.dims)}function cz(e){
const t=e.reduce((r,n)=>r*n,1);return new G("float32",Float32Array.from({length:t},()=>Fa.random()),e)}function JT(e){const t=e.
reduce((r,n)=>r*n,1);return new G("float32",Float32Array.from({length:t},()=>Fa.gauss()),e)}function ZT(e,t){if(e.dims.length!==
2)throw new Error("The tensor must have 2 dimensions");if(e.dims.at(-1)%8!==0)throw new Error("The last dimension of the\
 tensor must be a multiple of 8");if(!["binary","ubinary"].includes(t))throw new Error("The precision must be either 'bi\
nary' or 'ubinary'");const r=t==="binary",n=r?"int8":"uint8",s=r?Int8Array:Uint8Array,a=e.data,o=new s(a.length/8);for(let i=0;i<
a.length;++i){const l=a[i]>0?1:0,c=Math.floor(i/8),d=i%8;o[c]|=l<<7-d,r&&d===0&&(o[c]-=128)}return new G(n,o,[e.dims[0],
e.dims[1]/8])}async function ul(e){if(!e)throw new Error("modelId is required for get_tokenizer_files");return(await Jr(
e,"tokenizer_config.json",{})).exists?["tokenizer.json","tokenizer_config.json"]:[]}async function Mm(e,t){const r=await ul(
e);return await Promise.all(r.map(n=>tr(e,n,!0,t)))}function dl(e){const t=e.dims;switch(t.length){case 1:return e.tolist();case 2:
if(t[0]!==1)throw new Error("Unable to decode tensor with `batch size !== 1`. Use `tokenizer.batch_decode(...)` for batc\
hed inputs.");return e.tolist()[0];default:throw new Error(`Expected tensor to have 1-2 dimensions, got ${t.length}.`)}}
var eE=["bos_token","eos_token","unk_token","sep_token","pad_token","cls_token","mask_token"];function tE(e,t,r,n){for(const s of Object.
keys(e)){const a=t-e[s].length,o=r(s),i=new Array(a).fill(o);e[s]=n==="right"?Dt(e[s],i):Dt(i,e[s])}}function rE(e,t){for(const r of Object.
keys(e))e[r].length=t}function $r(e,...t){for(const r of t){if(!Object.hasOwn(e,r))continue;const n=e[r];if(n)if(typeof n==
"object"){if(n.__type==="AddedToken")return n.content;throw Error(`Unknown token: ${n}`)}else return n}return null}function nE(e){
const t=[];for(const r of e.get_added_tokens_decoder().values())r.special&&t.push(r);return t}var ue=class extends ft{return_token_type_ids=!1;padding_side="\
right";constructor(e,t){if(super(),this._tokenizerJSON=e,this._tokenizerConfig=t,this._tokenizer=new hk(e,t),this.config=
t,this.padding_side=t.padding_side??this.padding_side,this.mask_token=$r(t,"mask_token"),this.mask_token_id=this._tokenizer.
token_to_id(this.mask_token),this.pad_token=$r(t,"pad_token","eos_token"),this.pad_token_id=this._tokenizer.token_to_id(
this.pad_token),this.sep_token=$r(t,"sep_token"),this.sep_token_id=this._tokenizer.token_to_id(this.sep_token),this.unk_token=
$r(t,"unk_token"),this.unk_token_id=this._tokenizer.token_to_id(this.unk_token),this.bos_token=$r(t,"bos_token"),this.bos_token_id=
this._tokenizer.token_to_id(this.bos_token),this.eos_token=$r(t,"eos_token"),this.eos_token_id=this._tokenizer.token_to_id(
this.eos_token),this.chat_template=t.chat_template??null,Array.isArray(this.chat_template)){const n=Object.create(null);
for(const{name:s,template:a}of this.chat_template){if(typeof s!="string"||typeof a!="string")throw new Error('Chat templ\
ate must be a list of objects with "name" and "template" properties');n[s]=a}this.chat_template=n}this._compiled_template_cache=
new Map;const r=nE(this._tokenizer);this.all_special_ids=r.map(n=>n.id),this.all_special_tokens=r.map(n=>n.content)}static async from_pretrained(e,{
progress_callback:t=null,config:r=null,cache_dir:n=null,local_files_only:s=!1,revision:a="main"}={}){const o=await Mm(e,
{progress_callback:t,config:r,cache_dir:n,local_files_only:s,revision:a});return new this(...o)}get_vocab(){return this.
_tokenizer.get_vocab()}get model_max_length(){return this._tokenizerConfig.model_max_length??1/0}get add_eos_token(){return this.
_tokenizerConfig.add_eos_token}get add_bos_token(){return this._tokenizerConfig.add_bos_token}convert_tokens_to_ids(e){return typeof e==
"string"?this._tokenizer.token_to_id(e):e.map(t=>this._tokenizer.token_to_id(t))}_call(e,t={}){const{text_pair:r=null,add_special_tokens:n=!0,
padding:s=!1,return_token_type_ids:a=null}=t;let{truncation:o=null,max_length:i=null}=t;const l=t.return_tensor??!0,c=Array.
isArray(e);let d;if(c){if(e.length===0)throw Error("text array must be non-empty");if(r!==null){if(Array.isArray(r)){if(e.
length!==r.length)throw Error("text and text_pair must have the same length")}else throw Error("text_pair must also be a\
n array");d=e.map((_,p)=>this._encode_plus(_,{text_pair:r[p],add_special_tokens:n,return_token_type_ids:a}))}else d=e.map(
_=>this._encode_plus(_,{add_special_tokens:n,return_token_type_ids:a}))}else{if(e==null)throw Error("text may not be nul\
l or undefined");if(Array.isArray(r))throw Error("When specifying `text_pair`, since `text` is a string, `text_pair` mus\
t also be a string (i.e., not an array).");d=[this._encode_plus(e,{text_pair:r,add_special_tokens:n,return_token_type_ids:a})]}
if(i===null?i=this.model_max_length:o===null&&(s===!0?(de.warn("`max_length` is ignored when `padding: true` and there i\
s no truncation strategy. To pad to max length, use `padding: 'max_length'`."),i=this.model_max_length):s===!1&&(de.warn(
"Truncation was not explicitly activated but `max_length` is provided a specific value, please use `truncation: true` to\
 explicitly truncate examples to max length."),o=!0)),s===!0&&(i=Math.min(We(d.map(_=>_.input_ids.length))[0],i??1/0)),i=
Math.min(i,this.model_max_length??1/0),s||o)for(let _=0;_<d.length;++_)d[_].input_ids.length!==i&&(d[_].input_ids.length>
i?o&&rE(d[_],i):s&&tE(d[_],i,p=>p==="input_ids"?this.pad_token_id:0,this.padding_side));const h={};if(l){if(!(s&&o)&&d.some(
p=>{for(const w of Object.keys(p))if(p[w].length!==d[0][w]?.length)return!0;return!1}))throw Error("Unable to create ten\
sor, you should probably activate truncation and/or padding with 'padding=true' and 'truncation=true' to have batched te\
nsors with the same length.");const _=[d.length,d[0].input_ids.length];for(const p of Object.keys(d[0]))h[p]=new G("int6\
4",BigInt64Array.from(d.flatMap(w=>w[p]).map(BigInt)),_)}else{for(const _ of Object.keys(d[0]))h[_]=d.map(p=>p[_]);if(!c)
for(const _ of Object.keys(h))h[_]=h[_][0]}return h}_encode_text(e){return e===null?null:this._tokenizer.encode(e).tokens}_encode_plus(e,{
text_pair:t=null,add_special_tokens:r=!0,return_token_type_ids:n=null}={}){const{ids:s,attention_mask:a,token_type_ids:o}=this.
_tokenizer.encode(e,{text_pair:t,add_special_tokens:r,return_token_type_ids:n??this.return_token_type_ids});return{input_ids:s,
attention_mask:a,...o?{token_type_ids:o}:{}}}tokenize(e,{pair:t=null,add_special_tokens:r=!1}={}){return this._tokenizer.
tokenize(e,{text_pair:t,add_special_tokens:r})}encode(e,{text_pair:t=null,add_special_tokens:r=!0,return_token_type_ids:n=null}={}){
return this._tokenizer.encode(e,{text_pair:t,add_special_tokens:r,return_token_type_ids:n}).ids}batch_decode(e,t={}){return e instanceof
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
/transformers/main/en/chat_templating");return e}apply_chat_template(e,t={}){let{tools:r=null,documents:n=null,chat_template:s=null,
add_generation_prompt:a=!1,tokenize:o=!0,padding:i=!1,truncation:l=!1,max_length:c=null,return_tensor:d=!0,return_dict:h=!0,
tokenizer_kwargs:_={},...p}=t;if(s=this.get_chat_template({chat_template:s,tools:r}),typeof s!="string")throw Error(`cha\
t_template must be a string, but got ${typeof s}`);let w=this._compiled_template_cache.get(s);w===void 0&&(w=new uT(s),this.
_compiled_template_cache.set(s,w));const v=Object.create(null);for(const b of eE){const k=$r(this.config,b);k&&(v[b]=k)}
const y=w.render({messages:e,add_generation_prompt:a,tools:r,documents:n,...v,...p});if(o){const b=this._call(y,{add_special_tokens:!1,
padding:i,truncation:l,max_length:c,return_tensor:d,..._});return h?b:b.input_ids}return y}};function hl(e,t,r,n){if(!("\
language_codes"in e)||!Array.isArray(e.language_codes))throw new Error("Tokenizer must have `language_codes` attribute s\
et and it should be an array of language ids.");if(!("languageRegex"in e)||!(e.languageRegex instanceof RegExp))throw new Error(
"Tokenizer must have `languageRegex` attribute set and it should be a regular expression.");if(!("lang_to_token"in e)||typeof e.
lang_to_token!="function")throw new Error("Tokenizer must have `lang_to_token` attribute set and it should be a function\
.");const s=n.src_lang,a=n.tgt_lang;if(!e.language_codes.includes(a))throw new Error(`Target language code "${a}" is not\
 valid. Must be one of: {${e.language_codes.join(", ")}}`);if(s!==void 0){if(!e.language_codes.includes(s))throw new Error(
`Source language code "${s}" is not valid. Must be one of: {${e.language_codes.join(", ")}}`);const o=e._tokenizer.post_processor?.
config;if(o&&"single"in o){for(const i of o.single)if("SpecialToken"in i&&e.languageRegex.test(i.SpecialToken.id)){i.SpecialToken.
id=e.lang_to_token(s);break}}}return n.forced_bos_token_id=e._tokenizer.token_to_id(e.lang_to_token(a)),e._call(t,r)}var xm={};
hs(xm,{AlbertTokenizer:()=>sE,AutoTokenizer:()=>ke,BartTokenizer:()=>aE,BertTokenizer:()=>oE,BlenderbotSmallTokenizer:()=>iE,
BlenderbotTokenizer:()=>lE,BloomTokenizer:()=>cE,CLIPTokenizer:()=>dE,CamembertTokenizer:()=>uE,CodeGenTokenizer:()=>fE,
CodeLlamaTokenizer:()=>hE,CohereAsrTokenizer:()=>pE,CohereTokenizer:()=>_E,ConvBertTokenizer:()=>mE,DebertaTokenizer:()=>wE,
DebertaV2Tokenizer:()=>gE,DistilBertTokenizer:()=>vE,ElectraTokenizer:()=>yE,EsmTokenizer:()=>bE,FalconTokenizer:()=>ME,
GPT2Tokenizer:()=>TE,GPTNeoXTokenizer:()=>kE,GemmaTokenizer:()=>xE,HerbertTokenizer:()=>EE,LlamaTokenizer:()=>AE,M2M100Tokenizer:()=>CE,
MBart50Tokenizer:()=>PE,MBartTokenizer:()=>km,MPNetTokenizer:()=>LE,MarianTokenizer:()=>SE,MgpstrTokenizer:()=>FE,MobileBertTokenizer:()=>IE,
NllbTokenizer:()=>OE,NougatTokenizer:()=>NE,PreTrainedTokenizer:()=>ue,Qwen2Tokenizer:()=>DE,RoFormerTokenizer:()=>BE,RobertaTokenizer:()=>zE,
SiglipTokenizer:()=>RE,SpeechT5Tokenizer:()=>$E,SqueezeBertTokenizer:()=>GE,T5Tokenizer:()=>VE,TokenizersBackend:()=>ue,
VitsTokenizer:()=>jE,Wav2Vec2CTCTokenizer:()=>qE,WhisperTokenizer:()=>YE,XLMRobertaTokenizer:()=>KE,XLMTokenizer:()=>JE});
var sE=class extends ue{return_token_type_ids=!0},aE=class extends ue{},oE=class extends ue{return_token_type_ids=!0},iE=class extends ue{},
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
this.languageRegex);if(r.length===0)return super._encode_text(t);if(r.length===2){const[n,s]=r;return this.supported_language_codes.
includes(n)||de.warn(`Unsupported language code "${n}" detected, which may lead to unexpected behavior. Should be one of\
: ${JSON.stringify(this.supported_language_codes)}`),Dt([n],super._encode_text(s))}}},km=class extends ue{constructor(e,t){
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
has(e))t=e;else{const s=e.length===2?aa.keys():aa.values();throw new Error(`Language "${e}" is not supported. Must be on\
e of: ${JSON.stringify(Array.from(s))}`)}}return t}var QE="\\p{P}\\u0021-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E",
p_=new RegExp(`^[${QE}]+$`,"gu"),XE=.1,YE=class extends ue{get timestamp_begin(){return this._tokenizer.token_to_id("<|n\
otimestamps|>")+1}_decode_asr(e,{return_timestamps:t=!1,return_language:r=!1,time_precision:n=null,force_full_sequences:s=!0}={}){
if(n===null)throw Error("Must specify time_precision");let a=null;const o=t==="word";function i(){return{language:a,timestamp:[
null,null],text:""}}const l=[];let c=i(),d=0;const h=this.timestamp_begin,p=h+1500;let w=[],v=[],y=!1,b=null;const k=new Set(
this.all_special_ids);for(const C of e){const N=C.tokens,M=o?C.token_timestamps:null;let $=null,R=h;if("stride"in C){const[
Q,z,I]=C.stride;if(d-=z,b=Q-I,z&&(R=z/n+h),I)for(let U=N.length-1;U>=0;--U){const X=Number(N[U]);if(X>=h){if($!==null&&(X-
h)*n<b)break;$=X}}}let j=[],Y=[];for(let Q=0;Q<N.length;++Q){const z=Number(N[Q]);if(k.has(z)){const I=this.decode([z]),
U=aa.get(I.slice(2,-2));if(U!==void 0){if(a!==null&&U!==a&&!t){w.push(j);const X=this.findLongestCommonSequence(w)[0],ce=this.
decode(X);c.text=ce,l.push(c),w=[],j=[],c=i()}a=c.language=U}}else if(z>=h&&z<=p){const I=(z-h)*n+d,U=ts(I,2);if($!==null&&
z>=$)y=!0;else if(y||w.length>0&&z<R)y=!1;else if(c.timestamp[0]===null)c.timestamp[0]=U;else if(U!==c.timestamp[0]){c.timestamp[1]=
U,w.push(j),o&&v.push(Y);const[X,ce]=this.findLongestCommonSequence(w,v),Z=this.decode(X);if(c.text=Z,o&&(c.words=this.collateWordTimestamps(
X,ce,a),c.words.length>0&&c.timestamp[1]!==null))for(const ne of c.words)ne.timestamp[1]>c.timestamp[1]&&c.timestamp[1]>=
ne.timestamp[0]&&(ne.timestamp[1]=c.timestamp[1]);l.push(c),w=[],j=[],v=[],Y=[],c=i()}}else if(j.push(z),o){let I=ts(M[Q]+
d,2),U;if(Q+1<M.length){U=ts(M[Q+1]+d,2);const X=this.decode([z]);p_.test(X)&&(U=ts(Math.min(I+n,U),2))}else U=null;Y.push(
[I,U])}}if("stride"in C){const[Q,z,I]=C.stride;d+=Q-I}j.length>0?(w.push(j),o&&v.push(Y)):w.every(Q=>Q.length===0)&&(c=i(),
w=[],j=[],v=[],Y=[])}if(w.length>0){if(s&&t)throw new Error("Whisper did not predict an ending timestamp, which can happ\
en if audio is cut off in the middle of a word. Also make sure WhisperTimeStampLogitsProcessor was used during generatio\
n.");const[C,N]=this.findLongestCommonSequence(w,v),M=this.decode(C);c.text=M,o&&(c.words=this.collateWordTimestamps(C,N,
a)),l.push(c)}let A=Object.create(null);const E=l.map(C=>C.text).join("");if(t||r){for(let C=0;C<l.length;++C){const N=l[C];
t||delete N.timestamp,r||delete N.language}if(o){const C=[];for(const N of l)for(const M of N.words)C.push(M);A={chunks:C}}else
A={chunks:l}}return[E,A]}findLongestCommonSequence(e,t=null){let r=e[0],n=r.length,s=[];const a=Array.isArray(t)&&t.length>
0;let o=a?[]:null,i=a?t[0]:null;for(let l=1;l<e.length;++l){const c=e[l];let d=0,h=[n,n,0,0];const _=c.length;for(let A=1;A<
n+_;++A){const E=Math.max(0,n-A),C=Math.min(n,n+_-A),N=r.slice(E,C),M=Math.max(0,A-n),$=Math.min(_,A),R=c.slice(M,$);if(N.
length!==R.length)throw new Error("There is a bug within whisper `decode_asr` function, please report it. Dropping to pr\
event bad inference.");let j;a?j=N.filter((z,I)=>z===R[I]&&i[E+I][0]-XE<=t[l][M+I][0]).length:j=N.filter((z,I)=>z===R[I]).
length;const Y=A/1e4,Q=j/A+Y;j>1&&Q>d&&(d=Q,h=[E,C,M,$])}const[p,w,v,y]=h,b=Math.floor((w+p)/2);let k=Math.floor((y+v)/2);
if(a&&d===0&&n>0){const A=i[n-1][0],E=t[l].findIndex(C=>C[0]>=A);k=E===-1?c.length:E}s.push(...r.slice(0,b)),r=c.slice(k),
n=r.length,a&&(o.push(...i.slice(0,b)),i=t[l].slice(k))}return s.push(...r),a?(o.push(...i),[s,o]):[s,[]]}collateWordTimestamps(e,t,r){
const[n,s,a]=this.combineTokensIntoWords(e,r),o=[];for(let i=0;i<n.length;++i){const l=a[i];o.push({text:n[i],timestamp:[
t[l.at(0)][0],t[l.at(-1)][1]]})}return o}combineTokensIntoWords(e,t,r=`"'“¡¿([{-`,n=`"'.。,，!！?？:：”)]}、`){
t=t??"english";let s,a,o;return["chinese","japanese","thai","lao","myanmar"].includes(t)?[s,a,o]=this.splitTokensOnUnicode(
e):[s,a,o]=this.splitTokensOnSpaces(e),this.mergePunctuations(s,a,o,r,n)}decode(e,t){let r;return t?.decode_with_timestamps?
(e instanceof G&&(e=dl(e)),r=this.decodeWithTimestamps(e,t)):r=super.decode(e,t),r}decodeWithTimestamps(e,t){const r=t?.
time_precision??.02,n=this.all_special_ids.at(-1)+1;let s=[[]];for(let a of e)if(a=Number(a),a>=n){const o=((a-n)*r).toFixed(
2);s.push(`<|${o}|>`),s.push([])}else s[s.length-1].push(a);return s=s.map(a=>typeof a=="string"?a:super.decode(a,t)),s.
join("")}splitTokensOnUnicode(e){const t=this.decode(e,{decode_with_timestamps:!0}),r="�",n=[],s=[],a=[];let o=[],i=[],
l=0;for(let c=0;c<e.length;++c){const d=e[c];o.push(d),i.push(c);const h=this.decode(o,{decode_with_timestamps:!0});(!h.
includes(r)||t[l+h.indexOf(r)]===r)&&(n.push(h),s.push(o),a.push(i),o=[],i=[],l+=h.length)}return[n,s,a]}splitTokensOnSpaces(e){
const[t,r,n]=this.splitTokensOnUnicode(e),s=[],a=[],o=[];for(let i=0;i<t.length;++i){const l=t[i],c=r[i],d=n[i],h=c[0]>=
this._tokenizer.token_to_id("<|endoftext|>"),_=l.startsWith(" "),p=l.trim(),w=p_.test(p);if(h||_||w||s.length===0)s.push(
l),a.push(c),o.push(d);else{const v=s.length-1;s[v]+=l,a[v].push(...c),o[v].push(...d)}}return[s,a,o]}mergePunctuations(e,t,r,n,s){
const a=structuredClone(e),o=structuredClone(t),i=structuredClone(r);let l=a.length-2,c=a.length-1;for(;l>=0;)a[l].startsWith(
" ")&&n.includes(a[l].trim())?(a[c]=a[l]+a[c],o[c]=Dt(o[l],o[c]),i[c]=Dt(i[l],i[c]),a[l]="",o[l]=[],i[l]=[]):c=l,--l;for(l=
0,c=1;c<a.length;)!a[l].endsWith(" ")&&s.includes(a[c])?(a[l]+=a[c],o[l]=Dt(o[l],o[c]),i[l]=Dt(i[l],i[c]),a[c]="",o[c]=[],
i[c]=[]):l=c,++c;return[a.filter(d=>d),o.filter(d=>d.length>0),i.filter(d=>d.length>0)]}},KE=class extends ue{},JE=class extends ue{return_token_type_ids=!0;constructor(e,t){
super(e,t),de.warn('WARNING: `XLMTokenizer` is not yet supported by Hugging Face\'s "fast" tokenizers library. Therefore,\
 you may experience slightly inaccurate results.')}},ke=class{static async from_pretrained(e,{progress_callback:t=null,config:r=null,
cache_dir:n=null,local_files_only:s=!1,revision:a="main"}={}){const[o,i]=await Mm(e,{progress_callback:t,config:r,cache_dir:n,
local_files_only:s,revision:a}),l=i.tokenizer_class?.replace(/Fast$/,"")??"PreTrainedTokenizer";let c=xm[l];return c||(de.
warn(`Unknown tokenizer class "${l}", attempting to construct from base class.`),c=ue),new c(o,i)}},Ia="https://github.c\
om/huggingface/transformers.js/issues/new/choose",Em="preprocessor_config.json",cs="preprocessor_config.json",Am="proces\
sor_config.json",Cm="chat_template.jinja",Te=class extends ft{static classes=["image_processor_class","tokenizer_class",
"feature_extractor_class"];static uses_processor_config=!1;static uses_chat_template_file=!1;constructor(e,t,r){super(),
this.config=e,this.components=t,this.chat_template=r}get image_processor(){return this.components.image_processor}get tokenizer(){
return this.components.tokenizer}get feature_extractor(){return this.components.feature_extractor}apply_chat_template(e,t={}){
if(!this.tokenizer)throw new Error("Unable to apply chat template without a tokenizer.");return this.tokenizer.apply_chat_template(
e,{tokenize:!1,chat_template:this.chat_template??void 0,...t})}batch_decode(...e){if(!this.tokenizer)throw new Error("Un\
able to decode without a tokenizer.");return this.tokenizer.batch_decode(...e)}decode(...e){if(!this.tokenizer)throw new Error(
"Unable to decode without a tokenizer.");return this.tokenizer.decode(...e)}async _call(e,...t){for(const r of[this.image_processor,
this.feature_extractor,this.tokenizer])if(r)return r(e,...t);throw new Error("No image processor, feature extractor, or \
tokenizer found.")}static async from_pretrained(e,t={}){const[r,n,s]=await Promise.all([this.uses_processor_config?tr(e,
Am,!0,t):{},Promise.all(this.classes.filter(a=>a in this).map(async a=>{const o=await this[a].from_pretrained(e,t);return[
a.replace(/_class$/,""),o]})).then(Object.fromEntries),this.uses_chat_template_file?sl(e,Cm,!0,t):null]);return new this(
r,n,s)}},ki={};hs(ki,{ChatterboxProcessor:()=>A2,CohereAsrProcessor:()=>S2,EmbeddingGemma2Processor:()=>N2,EmbeddingGemma2VideoProcessor:()=>$m,
Florence2Processor:()=>LA,Gemma3Processor:()=>OA,Gemma3nProcessor:()=>NA,Gemma4Processor:()=>Rm,Glm46VProcessor:()=>DA,GraniteSpeechProcessor:()=>zA,
GroundingDinoProcessor:()=>RA,Idefics3Processor:()=>M_,JinaCLIPProcessor:()=>jA,Lfm2VlProcessor:()=>qA,Lfm3VlProcessor:()=>WA,
LlavaProcessor:()=>HA,MgpstrProcessor:()=>QA,MoonshineProcessor:()=>XA,OwlViTProcessor:()=>YA,PaliGemmaProcessor:()=>JA,
Phi3VProcessor:()=>eC,PixtralProcessor:()=>tC,Processor:()=>Te,PyAnnoteProcessor:()=>rC,Qwen2VLProcessor:()=>yl,Qwen2_5_VLProcessor:()=>ag,
Qwen3VLProcessor:()=>nC,Sam2Processor:()=>ig,Sam2VideoProcessor:()=>sC,SamProcessor:()=>og,SmolVLMProcessor:()=>M_,SpeechT5Processor:()=>aC,
UltravoxProcessor:()=>oC,VLChatProcessor:()=>UA,VoxtralProcessor:()=>uC,VoxtralRealtimeProcessor:()=>fC,Wav2Vec2Processor:()=>_C,
Wav2Vec2ProcessorWithLM:()=>pC,WhisperProcessor:()=>mC});var ut=class extends ft{constructor(e){super(),this.config=e}static async from_pretrained(e,t={}){
const r=await tr(e,Em,!0,t);return new this(r)}};function st(e,t){if(!(e instanceof Float32Array||e instanceof Float64Array))
throw new Error(`${t} expects input to be a Float32Array or a Float64Array, but got ${e?.constructor?.name??typeof e} in\
stead. If using the feature extractor directly, remember to use \`load_audio(url, sampling_rate)\` to obtain the raw audio\
 data of the file/url.`)}var fl={};hs(fl,{ASTFeatureExtractor:()=>f2,ChatterboxFeatureExtractor:()=>_2,ClapFeatureExtractor:()=>p2,
CohereAsrFeatureExtractor:()=>g2,DacFeatureExtractor:()=>Om,EncodecFeatureExtractor:()=>Im,FeatureExtractor:()=>ut,Gemma3nAudioFeatureExtractor:()=>Nm,
Gemma4AudioFeatureExtractor:()=>Dm,GraniteSpeechFeatureExtractor:()=>w2,MoonshineFeatureExtractor:()=>v2,ParakeetFeatureExtractor:()=>Lm,
PyAnnoteFeatureExtractor:()=>zm,SeamlessM4TFeatureExtractor:()=>y2,SnacFeatureExtractor:()=>b2,SpeechT5FeatureExtractor:()=>M2,
VoxtralRealtimeFeatureExtractor:()=>T2,Wav2Vec2FeatureExtractor:()=>x2,WeSpeakerFeatureExtractor:()=>k2,WhisperFeatureExtractor:()=>E2});
var ZE=()=>{},e2=ZE;async function Sm(e,t){if(fe.IS_BROWSER_ENV){if(fe.IS_WEBWORKER_ENV)throw new Error("Unable to save \
a file from a Web Worker.");const r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=e,n.click(),
n.remove(),URL.revokeObjectURL(r)}else if(fe.IS_FS_AVAILABLE)t.stream(),bt.createWriteStream(e),await e2();else throw new Error(
"Unable to save because filesystem is disabled in this environment.")}async function t2(e,t){if(typeof AudioContext>"u")
throw Error("Unable to load audio from path/URL since `AudioContext` is not available in your environment. Instead, audi\
o data should be passed directly to the pipeline/processor. For more information and some example code, see https://hugg\
ingface.co/docs/transformers.js/guides/node-audio-processing.");const r=await(await os(e)).arrayBuffer(),n=new AudioContext(
{sampleRate:t});typeof t>"u"&&de.warn(`No sampling rate provided, using default of ${n.sampleRate}Hz.`);const s=await n.
decodeAudioData(r);let a;if(s.numberOfChannels===2){const o=Math.sqrt(2),i=s.getChannelData(0),l=s.getChannelData(1);a=new Float32Array(
i.length);for(let c=0;c<s.length;++c)a[c]=o*(i[c]+l[c])/2}else a=s.getChannelData(0);return a}async function r2(e,t){return await t2(
e,t)}function Pm(e,t){if(e<1)return new Float64Array;if(e===1)return new Float64Array([1]);const r=1-t,n=2*Math.PI/(e-1),
s=new Float64Array(e);for(let a=0;a<e;++a)s[a]=t-r*Math.cos(a*n);return s}function m_(e){return Pm(e,.5)}function n2(e){
return Pm(e,.54)}var s2={htk:e=>2595*Math.log10(1+e/700),kaldi:e=>1127*Math.log(1+e/700),slaney:(e,t=1e3,r=15,n=27/Math.
log(6.4))=>e>=t?r+Math.log(e/t)*n:3*e/200};function ai(e,t="htk"){const r=s2[t];if(!r)throw new Error('mel_scale should \
be one of "htk", "slaney" or "kaldi".');return typeof e=="number"?r(e):e.map(n=>r(n))}var a2={htk:e=>700*(10**(e/2595)-1),
kaldi:e=>700*(Math.exp(e/1127)-1),slaney:(e,t=1e3,r=15,n=Math.log(6.4)/27)=>e>=r?t*Math.exp(n*(e-r)):200*e/3};function o2(e,t="\
htk"){const r=a2[t];if(!r)throw new Error('mel_scale should be one of "htk", "slaney" or "kaldi".');return typeof e=="nu\
mber"?r(e):e.map(n=>r(n))}function i2(e,t){const r=Float64Array.from({length:t.length-1},(o,i)=>t[i+1]-t[i]),n=Array.from(
{length:e.length},()=>new Array(t.length));for(let o=0;o<e.length;++o){const i=n[o];for(let l=0;l<t.length;++l)i[l]=t[l]-
e[o]}const s=t.length-2,a=Array.from({length:s},()=>new Array(e.length));for(let o=0;o<e.length;++o){const i=n[o];for(let l=0;l<
s;++l){const c=-i[l]/r[l],d=i[l+2]/r[l+1];a[l][o]=Math.max(0,Math.min(c,d))}}return a}function g_(e,t,r){const n=(t-e)/(r-
1);return Float64Array.from({length:r},(s,a)=>e+n*a)}function er(e,t,r,n,s,a=null,o="htk",i=!1){if(a!==null&&a!=="slaney")
throw new Error('norm must be one of null or "slaney"');if(e<2)throw new Error(`Require num_frequency_bins: ${e} >= 2`);
if(r>n)throw new Error(`Require min_frequency: ${r} <= max_frequency: ${n}`);const l=ai(r,o),c=ai(n,o),d=g_(l,c,t+2);let h=o2(
d,o),_;if(i){const w=s/((e-1)*2);_=ai(Float64Array.from({length:e},(v,y)=>y*w),o),h=d}else _=g_(0,Math.floor(s/2),e);const p=i2(
_,h);if(a!==null&&a==="slaney")for(let w=0;w<t;++w){const v=p[w],y=2/(h[w+2]-h[w]);for(let b=0;b<e;++b)v[b]*=y}return p}
function l2(e,t,r){const n=new e.constructor(e.length+t+r),s=e.length-1;for(let a=0;a<e.length;++a)n[t+a]=e[a];for(let a=1;a<=
t;++a)n[t-a]=e[_a(a,s)];for(let a=1;a<=r;++a)n[s+t+a]=e[_a(s-a,s)];return n}function Fm(e,t,r,n,s){if(r<=0)throw new Error(
"reference must be greater than zero");if(n<=0)throw new Error("min_value must be greater than zero");r=Math.max(n,r);const a=Math.
log10(r);for(let o=0;o<e.length;++o)e[o]=t*Math.log10(Math.max(n,e[o])-a);if(s!==null){if(s<=0)throw new Error("db_range\
 must be greater than zero");const o=We(e)[0]-s;for(let i=0;i<e.length;++i)e[i]=Math.max(e[i],o)}return e}function c2(e,t=1,r=1e-5,n=null){
return Fm(e,20,t,r,n)}function u2(e,t=1,r=1e-10,n=null){return Fm(e,10,t,r,n)}async function rr(e,t,r,n,{fft_length:s=null,
power:a=1,center:o=!0,pad_mode:i="reflect",onesided:l=!0,preemphasis:c=null,preemphasis_htk_flavor:d=!0,mel_filters:h=null,
mel_floor:_=1e-10,log_mel:p=null,max_log_mel:w=null,reference:v=1,min_value:y=1e-10,db_range:b=null,remove_dc_offset:k=null,
min_num_frames:A=null,max_num_frames:E=null,do_pad:C=!0,transpose:N=!1,mel_offset:M=0,mel_floor_mode:$="clamp"}={}){const R=t.
length;if(s===null&&(s=r),r>s)throw Error(`frame_length (${r}) may not be larger than fft_length (${s})`);if(R!==r)throw new Error(
`Length of the window (${R}) must equal frame_length (${r})`);if(n<=0)throw new Error("hop_length must be greater than z\
ero");if(a===null&&h!==null)throw new Error("You have provided `mel_filters` but `power` is `None`. Mel spectrogram comp\
utation is not yet supported for complex-valued spectrogram. Specify `power` to fix this issue.");if(!d)throw new Error(
"`preemphasis_htk_flavor=false` is not currently supported.");if(o){const O=Math.floor(r/2);switch(i){case"reflect":{e=l2(
e,O,O);break}case"constant":{const V=new e.constructor(e.length+2*O);V.set(e,O),e=V;break}case"semicausal":{const V=new e.
constructor(e.length+O);V.set(e,O),e=V;break}default:throw new Error(`pad_mode="${i}" not implemented yet.`)}}let j=Math.
floor(1+Math.floor((e.length-r)/n));A!==null&&j<A&&(j=A);const Y=l?Math.floor(s/2)+1:s;let Q=j,z=j;E!==null&&(E>j?C&&(z=
E):z=Q=E);const I=new IT(s),U=new Float64Array(s),X=new Float64Array(I.outputBufferSize),ce=new Float32Array(Y*z);for(let O=0;O<
Q;++O){const V=O*n,se=Math.min(e.length-V,r);se!==r&&U.fill(0,0,r);for(let ae=0;ae<se;++ae)U[ae]=e[V+ae];if(k){let ae=0;
for(let Ee=0;Ee<se;++Ee)ae+=U[Ee];const qe=ae/se;for(let Ee=0;Ee<se;++Ee)U[Ee]-=qe}if(c!==null){for(let ae=se-1;ae>=1;--ae)
U[ae]-=c*U[ae-1];U[0]*=1-c}for(let ae=0;ae<t.length;++ae)U[ae]*=t[ae];I.realTransform(X,U);for(let ae=0;ae<Y;++ae){const qe=ae<<
1;ce[ae*z+O]=X[qe]**2+X[qe+1]**2}}if(a!==null&&a!==2){const O=a/2;for(let V=0;V<ce.length;++V)ce[V]**=O}const Z=h.length;
let ne=await YT(new G("float32",h.flat(),[Z,Y]),new G("float32",ce,[Y,z]));N&&(ne=ne.transpose(1,0));const L=ne.data;if($===
"add")for(let O=0;O<L.length;++O)L[O]=M+L[O]+_;else for(let O=0;O<L.length;++O)L[O]=M+Math.max(_,L[O]);if(a!==null&&p!==
null){const O=Math.min(L.length,Q*Z);switch(p){case"log":for(let V=0;V<O;++V)L[V]=Math.log(L[V]);break;case"log10":for(let V=0;V<
O;++V)L[V]=Math.log10(L[V]);break;case"log10_max_norm":{for(let ae=0;ae<O;++ae)L[ae]=Math.log10(L[ae]);const se=(w??We(L)[0])-
8;for(let ae=0;ae<O;++ae)L[ae]=(Math.max(L[ae],se)+4)/4;break}case"dB":if(a===1)c2(L,v,y,b);else if(a===2)u2(L,v,y,b);else
throw new Error(`Cannot use log_mel option '${p}' with power ${a}`);break;default:throw new Error(`log_mel must be one o\
f null, 'log', 'log10', 'log10_max_norm', or 'dB'. Got '${p}'`)}}return ne}function fr(e,t,{periodic:r=!0,frame_length:n=null,
center:s=!0}={}){const a=r?e+1:e;let o;switch(t){case"boxcar":o=new Float64Array(a).fill(1);break;case"hann":case"hann_w\
indow":o=m_(a);break;case"hamming":o=n2(a);break;case"povey":o=m_(a).map(c=>Math.pow(c,.85));break;default:throw new Error(
`Unknown window type ${t}.`)}if(r&&(o=o.subarray(0,e)),n===null||e===n)return o;if(e>n)throw new Error(`Length of the wi\
ndow (${e}) may not be larger than frame_length (${n})`);const i=new Float64Array(n),l=s?Math.floor((n-e)/2):0;return i.
set(o,l),i}function d2(e,t){const r=e.reduce((a,o)=>a+o.length,0),n=new ArrayBuffer(44),s=new DataView(n);return Ys(s,0,
"RIFF"),s.setUint32(4,36+r*4,!0),Ys(s,8,"WAVE"),Ys(s,12,"fmt "),s.setUint32(16,16,!0),s.setUint16(20,3,!0),s.setUint16(22,
1,!0),s.setUint32(24,t,!0),s.setUint32(28,t*4,!0),s.setUint16(32,4,!0),s.setUint16(34,32,!0),Ys(s,36,"data"),s.setUint32(
40,r*4,!0),new Blob([n,...e.map(a=>a.buffer instanceof ArrayBuffer?new Uint8Array(a.buffer,a.byteOffset,a.byteLength):a.
slice())],{type:"audio/wav"})}function Ys(e,t,r){for(let n=0;n<r.length;++n)e.setUint8(t+n,r.charCodeAt(n))}var h2=class{constructor(e,t){
this.audio=e,this.sampling_rate=t}get data(){if(Array.isArray(this.audio)){if(this.audio.length===0)return new Float32Array(
0);if(this.audio.length===1)return this.audio[0];const e=this.audio.reduce((n,s)=>n+s.length,0),t=new Float32Array(e);let r=0;
for(const n of this.audio)t.set(n,r),r+=n.length;return t}else return this.audio}toBlob(){let e=this.audio;return e instanceof
Float32Array&&(e=[e]),d2(e,this.sampling_rate)}async save(e){return Sm(e,this.toBlob())}},f2=class extends ut{constructor(e){
super(e);const t=this.config.sampling_rate,r=er(257,this.config.num_mel_bins,20,Math.floor(t/2),t,null,"kaldi",!0);this.
mel_filters=r,this.window=fr(400,"hann",{periodic:!1}),this.mean=this.config.mean,this.std=this.config.std}async _extract_fbank_features(e,t){
return rr(e,this.window,400,160,{fft_length:512,power:2,center:!1,preemphasis:.97,mel_filters:this.mel_filters,log_mel:"\
log",mel_floor:1192092955078125e-22,remove_dc_offset:!0,max_num_frames:t,transpose:!0})}async _call(e){st(e,"ASTFeatureE\
xtractor");const t=await this._extract_fbank_features(e,this.config.max_length);if(this.config.do_normalize){const r=this.
std*2,n=t.data;for(let s=0;s<n.length;++s)n[s]=(n[s]-this.mean)/r}return{input_values:t.unsqueeze_(0)}}},Im=class extends ut{async _call(e){
st(e,"EncodecFeatureExtractor"),e instanceof Float64Array&&(e=new Float32Array(e));const t=this.config.feature_size;if(e.
length%t!==0)throw new Error(`The length of the audio data must be a multiple of the number of channels (${t}).`);const r=[
1,t,e.length/t];return{input_values:new G("float32",e,r)}}},_2=class extends ut{async _call(e){st(e,"ChatterboxFeatureEx\
tractor"),e instanceof Float64Array&&(e=new Float32Array(e));const t=[1,e.length];return{input_values:new G("float32",e,
t)}}},p2=class extends ut{constructor(e){super(e),this.mel_filters=er(this.config.nb_frequency_bins,this.config.feature_size,
this.config.frequency_min,this.config.frequency_max,this.config.sampling_rate,null,"htk"),this.mel_filters_slaney=er(this.
config.nb_frequency_bins,this.config.feature_size,this.config.frequency_min,this.config.frequency_max,this.config.sampling_rate,
"slaney","slaney"),this.window=fr(this.config.fft_window_size,"hann")}async _get_input_mel(e,t,r,n){let s;const a=e.length-
t;if(a>0)if(r==="rand_trunc"){const o=Math.floor(Fa.random()*(a+1));e=e.subarray(o,o+t),s=await this._extract_fbank_features(
e,this.mel_filters_slaney,this.config.nb_max_samples)}else throw new Error(`Truncation strategy "${r}" not implemented`);else{
if(a<0){let o=new Float64Array(t);if(o.set(e),n==="repeat")for(let i=e.length;i<t;i+=e.length)o.set(e.subarray(0,Math.min(
e.length,t-i)),i);else if(n==="repeatpad")for(let i=e.length;i<-a;i+=e.length)o.set(e,i);e=o}if(r==="fusion")throw new Error(
`Truncation strategy "${r}" not implemented`);s=await this._extract_fbank_features(e,this.mel_filters_slaney,this.config.
nb_max_samples)}return s.unsqueeze_(0)}async _extract_fbank_features(e,t,r=null){return rr(e,this.window,this.config.fft_window_size,
this.config.hop_length,{power:2,mel_filters:t,log_mel:"dB",max_num_frames:r,do_pad:!1,transpose:!0})}async _call(e,{max_length:t=null}={}){
return st(e,"ClapFeatureExtractor"),{input_features:(await this._get_input_mel(e,t??this.config.nb_max_samples,this.config.
truncation,this.config.padding)).unsqueeze_(0)}}},m2=1e-5,Lm=class extends ut{constructor(e){super(e),this.config.mel_filters??=
er(Math.floor(1+this.config.n_fft/2),this.config.feature_size,0,this.config.sampling_rate/2,this.config.sampling_rate,"s\
laney","slaney");const t=fr(this.config.win_length,"hann",{periodic:!1});this.window=new Float64Array(this.config.n_fft);
const r=Math.floor((this.config.n_fft-this.config.win_length)/2);this.window.set(t,r)}async _extract_fbank_features(e){const t=this.
config.preemphasis;e=new Float64Array(e);for(let n=e.length-1;n>=1;--n)e[n]-=t*e[n-1];return await rr(e,this.window,this.
window.length,this.config.hop_length,{fft_length:this.config.n_fft,power:2,mel_filters:this.config.mel_filters,log_mel:"\
log",mel_floor:-1/0,pad_mode:"constant",center:!0,transpose:!0,mel_offset:2**-24})}async _call(e){st(e,"ParakeetFeatureE\
xtractor");const t=await this._extract_fbank_features(e),r=Math.floor((e.length+Math.floor(this.config.n_fft/2)*2-this.config.
n_fft)/this.config.hop_length),n=t.data;n.fill(0,r*t.dims[1]);const[s,a]=t.dims,o=new Float64Array(a),i=new Float64Array(
a);for(let d=0;d<r;++d){const h=d*a;for(let _=0;_<a;++_){const p=n[h+_];o[_]+=p,i[_]+=p*p}}const l=r>1?r-1:1;for(let d=0;d<
a;++d){const h=o[d]/r,_=(i[d]-r*h*h)/l,w=1/(Math.sqrt(_)+m2);for(let v=0;v<r;++v){const y=v*a+d;n[y]=(n[y]-h)*w}}const c=new BigInt64Array(
s);return c.fill(1n,0,r),{input_features:t.unsqueeze_(0),attention_mask:new G("int64",c,[1,s])}}},g2=class extends Lm{_apply_dither(e){
const t=this.config.dither??0;if(t<=0)return e;const r=new Pa(e.length);for(let n=0;n<e.length;++n)e[n]+=t*r.gauss();return e}split_audio(e){
const t=this.config.max_audio_clip_s??35,r=this.config.overlap_chunk_second??5,n=this.config.min_energy_window_samples??
1600,s=this.config.sampling_rate,a=Math.max(1,Math.round(t*s)),o=Math.max(1,Math.round(r*s));if(e.length<=a)return[e];const i=[];
let l=0;const c=e.length;for(;l<c;){if(l+a>=c){i.push(e.slice(l,c));break}const d=Math.max(l,l+a-o),h=Math.min(l+a,c);let _;
h<=d?_=l+a:_=this._find_split_point_energy(e,d,h,n),_=Math.max(l+1,Math.min(_,c)),i.push(e.slice(l,_)),l=_}return i}_find_split_point_energy(e,t,r,n){
const s=r-t;if(s<=n)return Math.floor((t+r)/2);let a=1/0,o=t;const i=s-n;for(let l=0;l<=i;l+=n){let c=0;for(let d=0;d<n;++d){
const h=e[t+l+d];c+=h*h}c=Math.sqrt(c/n),c<a&&(a=c,o=t+l)}return o}async _call(e){st(e,"CohereAsrFeatureExtractor");const t=new Float64Array(
e);return this._apply_dither(t),super._call(t)}},Om=class extends Im{},Nm=class extends ut{constructor(e){super(e);const{
fft_length:t,feature_size:r,min_frequency:n,max_frequency:s,sampling_rate:a,frame_length:o}=this.config,i=er(Math.floor(
1+t/2),r,n,s,a,null,"htk",!1);this.mel_filters=i,this.window=fr(o,"hann")}async _extract_fbank_features(e,t){return rr(e,
this.window,this.config.frame_length,this.config.hop_length,{fft_length:this.config.fft_length,center:!1,onesided:!0,preemphasis:this.
config.preemphasis,preemphasis_htk_flavor:this.config.preemphasis_htk_flavor,mel_filters:this.mel_filters,log_mel:"log",
mel_floor:this.config.mel_floor,remove_dc_offset:!1,transpose:!0})}async _call(e,{max_length:t=48e4,truncation:r=!0,padding:n=!0,
pad_to_multiple_of:s=128}={}){if(st(e,"Gemma3nAudioFeatureExtractor"),r&&e.length>t&&(e=e.slice(0,t)),n&&e.length%s!==0){
const i=s-e.length%s,l=new Float64Array(e.length+i);l.set(e),this.config.padding_value!==0&&l.fill(this.config.padding_value,
e.length),e=l}const a=await this._extract_fbank_features(e,this.config.max_length),o=ct([1,a.dims[0]],!0);return{input_features:a.
unsqueeze_(0),input_features_mask:o}}},Dm=class extends Nm{async _extract_fbank_features(e,t){const{frame_length:r,hop_length:n,
fft_length:s}=this.config,a=Math.floor(r/2),o=Math.floor((e.length+a-(r+1))/n)+1;return rr(e,this.window,r,n,{fft_length:s,
center:!0,pad_mode:"semicausal",onesided:!0,preemphasis:this.config.preemphasis,preemphasis_htk_flavor:this.config.preemphasis_htk_flavor,
mel_filters:this.mel_filters,log_mel:"log",mel_floor:this.config.mel_floor,mel_floor_mode:"add",remove_dc_offset:!1,transpose:!0,
max_num_frames:o})}async _call(e,t={}){st(e,"Gemma4AudioFeatureExtractor");const r=e.length,n=await super._call(e,t),{input_features:s}=n,
[,a,o]=s.dims,{frame_length:i,hop_length:l}=this.config,c=Math.floor(i/2),d=i+1,h=new Uint8Array(r+c+(t.pad_to_multiple_of??
128));h.fill(1,c,c+r);const _=new Uint8Array(a);for(let w=0;w<a;++w)_[w]=h[w*l+d-1]?1:0;const p=s.data;for(let w=0;w<a;++w)
_[w]||p.fill(0,w*o,(w+1)*o);return n.input_features_mask=new G("bool",_,[1,a]),n}},w2=class extends ut{constructor(e){super(
e);const{n_fft:t,win_length:r,n_mels:n,sample_rate:s}=e.melspec_kwargs;this.mel_filters=er(Math.floor(1+t/2),n,0,s/2,s,null,
"htk");const a=fr(r,"hann");this.window=new Float64Array(t);const o=Math.floor((t-r)/2);this.window.set(a,o)}async _call(e){
st(e,"GraniteSpeechFeatureExtractor");const{n_fft:t,hop_length:r,n_mels:n}=this.config.melspec_kwargs,s=Math.floor(e.length/
r)+1,a=s-s%2;return{input_features:(await rr(e,this.window,t,r,{power:2,mel_filters:this.mel_filters,log_mel:"log10_max_\
norm",transpose:!0,max_num_frames:a,do_pad:!1})).view(-1,2*n).unsqueeze_(0)}}},v2=class extends ut{async _call(e){st(e,"\
MoonshineFeatureExtractor"),e instanceof Float64Array&&(e=new Float32Array(e));const t=[1,e.length];return{input_values:new G(
"float32",e,t)}}},zm=class extends ut{async _call(e){st(e,"PyAnnoteFeatureExtractor"),e instanceof Float64Array&&(e=new Float32Array(
e));const t=[1,1,e.length];return{input_values:new G("float32",e,t)}}samples_to_frames(e){return(e-this.config.offset)/this.
config.step}post_process_speaker_diarization(e,t){const r=t/this.samples_to_frames(t)/this.config.sampling_rate,n=[];for(const s of e.
tolist()){const a=[];let o=-1;for(let i=0;i<s.length;++i){const l=nt(s[i]),[c,d]=We(l),[h,_]=[i,i+1];d!==o?(o=d,a.push({
id:d,start:h,end:_,score:c})):(a.at(-1).end=_,a.at(-1).score+=c)}n.push(a.map(({id:i,start:l,end:c,score:d})=>({id:i,start:l*
r,end:c*r,confidence:d/(c-l)})))}return n}},y2=class extends ut{constructor(e){super(e);const t=this.config.sampling_rate,
r=er(257,this.config.num_mel_bins,20,Math.floor(t/2),t,null,"kaldi",!0);this.mel_filters=r,this.window=fr(400,"povey",{periodic:!1})}async _extract_fbank_features(e,t){
return e=e.map(r=>r*32768),rr(e,this.window,400,160,{fft_length:512,power:2,center:!1,preemphasis:.97,mel_filters:this.mel_filters,
log_mel:"log",mel_floor:1192092955078125e-22,remove_dc_offset:!0,max_num_frames:t,transpose:!0})}async _call(e,{padding:t=!0,
pad_to_multiple_of:r=2,do_normalize_per_mel_bins:n=!0,return_attention_mask:s=!0}={}){st(e,"SeamlessM4TFeatureExtractor");
let a=await this._extract_fbank_features(e,this.config.max_length);if(n){const[p,w]=a.dims,v=a.data;for(let y=0;y<w;++y){
let b=0;for(let C=0;C<p;++C)b+=v[C*w+y];const k=b/p;let A=0;for(let C=0;C<p;++C)A+=(v[C*w+y]-k)**2;A/=p-1;const E=Math.sqrt(
A+1e-7);for(let C=0;C<p;++C){const N=C*w+y;v[N]=(v[N]-k)/E}}}let o;if(t){const[p,w]=a.dims,v=a.data,y=p%r;if(y>0){const b=new Float32Array(
w*(p+y));b.set(v),b.fill(this.config.padding_value,v.length);const k=p+y;a=new G(a.type,b,[k,w]),s&&(o=new G("int64",new BigInt64Array(
k),[1,k]),o.data.fill(1n,0,p))}}const[i,l]=a.dims,c=this.config.stride;if(i%c!==0)throw new Error(`The number of frames \
(${i}) must be a multiple of the stride (${c}).`);const h=a.view(1,Math.floor(i/c),l*c),_={input_features:h};if(s){const p=h.
dims[1],w=new BigInt64Array(p);if(o){const v=o.data;for(let y=1,b=0;y<i;y+=c,++b)w[b]=v[y]}else w.fill(1n);_.attention_mask=
new G("int64",w,[1,p])}return _}},b2=class extends Om{},M2=class extends ut{},x2=class extends ut{_zero_mean_unit_var_norm(e){
const r=e.reduce((s,a)=>s+a,0)/e.length,n=e.reduce((s,a)=>s+(a-r)**2,0)/e.length;return e.map(s=>(s-r)/Math.sqrt(n+1e-7))}async _call(e){
st(e,"Wav2Vec2FeatureExtractor"),e instanceof Float64Array&&(e=new Float32Array(e));let t=e;this.config.do_normalize&&(t=
this._zero_mean_unit_var_norm(t));const r=[1,t.length];return{input_values:new G("float32",t,r),attention_mask:new G("in\
t64",new BigInt64Array(t.length).fill(1n),r)}}},k2=class extends ut{constructor(e){super(e);const t=this.config.sampling_rate,
r=er(257,this.config.num_mel_bins,20,Math.floor(t/2),t,null,"kaldi",!0);this.mel_filters=r,this.window=fr(400,"hamming",
{periodic:!1}),this.min_num_frames=this.config.min_num_frames}async _extract_fbank_features(e){return e=e.map(t=>t*32768),
rr(e,this.window,400,160,{fft_length:512,power:2,center:!1,preemphasis:.97,mel_filters:this.mel_filters,log_mel:"log",mel_floor:1192092955078125e-22,
remove_dc_offset:!0,transpose:!0,min_num_frames:this.min_num_frames})}async _call(e){st(e,"WeSpeakerFeatureExtractor");const t=(await this.
_extract_fbank_features(e)).unsqueeze_(0);if(this.config.fbank_centering_span===null){const r=t.mean(1).data,n=t.data,[s,
a,o]=t.dims;for(let i=0;i<s;++i){const l=i*a*o,c=i*o;for(let d=0;d<a;++d){const h=l+d*o;for(let _=0;_<o;++_)n[h+_]-=r[c+
_]}}}return{input_features:t}}},T2=class extends ut{constructor(e){super(e),this.config.mel_filters??=er(Math.floor(1+this.
config.n_fft/2),this.config.feature_size,0,8e3,this.config.sampling_rate,"slaney","slaney"),this.window=fr(this.config.n_fft,
"hann")}async _extract_fbank_features(e,{center:t=!0}={}){const{n_fft:r,hop_length:n,mel_filters:s,global_log_mel_max:a}=this.
config,o=Math.floor(t?e.length/n:(e.length-r)/n);return await rr(e,this.window,r,n,{power:2,mel_filters:s,log_mel:"log10\
_max_norm",max_log_mel:a,center:t,max_num_frames:o,do_pad:!1})}async _call(e,{center:t=!0}={}){return st(e,"VoxtralRealt\
imeFeatureExtractor"),{input_features:(await this._extract_fbank_features(e,{center:t})).unsqueeze_(0)}}},E2=class extends ut{constructor(e){
super(e),this.config.mel_filters??=er(Math.floor(1+this.config.n_fft/2),this.config.feature_size,0,8e3,this.config.sampling_rate,
"slaney","slaney"),this.window=fr(this.config.n_fft,"hann")}async _extract_fbank_features(e){return await rr(e,this.window,
this.config.n_fft,this.config.hop_length,{power:2,mel_filters:this.config.mel_filters,log_mel:"log10_max_norm",max_num_frames:Math.
min(Math.floor(e.length/this.config.hop_length),this.config.nb_max_frames)})}async _call(e,{max_length:t=null}={}){st(e,
"WhisperFeatureExtractor");let r;const n=t??this.config.n_samples;return e.length>n?(e.length>this.config.n_samples&&de.
warn("Attempting to extract features for audio longer than 30 seconds. If using a pipeline to extract transcript from a \
long audio clip, remember to specify `chunk_length_s` and/or `stride_length_s`."),r=e.slice(0,n)):(r=new Float32Array(n),
r.set(e)),{input_features:(await this._extract_fbank_features(r)).unsqueeze_(0)}}},St=class{static async from_pretrained(e,t={}){
const r=await tr(e,Em,!0,t),n=r.feature_extractor_type,s=fl[n];if(!s)throw new Error(`Unknown feature_extractor_type: '${n}\
'. Please report this at ${Ia}.`);return new s(r)}},A2=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e,t=null){
const r=this.tokenizer(e),n=t?await this.feature_extractor(t):{};return{...r,...n}}},C2=new Set(["ja","zh"]),S2=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!0;get_decoder_prompt_ids(e="\
en"){const t=["▁","<|startofcontext|>","<|startoftranscript|>","<|emo:undefined|>",`<|${e}|>`,`<|${e}|>`,"<|pnc|>","<|\
noitn|>","<|notimestamp|>","<|nodiarize|>"];return this.tokenizer.convert_tokens_to_ids(t)}static join_chunks(e,t="en"){
const r=e.filter(a=>a&&a.trim());if(r.length===0)return"";const n=C2.has(t)?"":" ";return[r[0].trimEnd(),...r.slice(1).map(
a=>a.trim())].join(n)}async _call(e){return await this.feature_extractor(e)}},Ti={},Gr,Bm,xr;if(fe.IS_WEB_ENV)Gr=(e,t)=>{
if(!self.OffscreenCanvas)throw new Error("OffscreenCanvas not supported by this environment.");return new self.OffscreenCanvas(
e,t)},xr=self.createImageBitmap,Bm=self.ImageData;else if(Ti)xr=async e=>{const r=(await e.metadata()).channels,{data:n,
info:s}=await e.rotate().raw().toBuffer({resolveWithObject:!0}),a=new Mt(new Uint8ClampedArray(n),s.width,s.height,s.channels);
return r!==void 0&&r!==s.channels&&a.convert(r),a};else throw new Error("Unable to load image processing library.");var P2={
0:"nearest",1:"lanczos",2:"bilinear",3:"bicubic",4:"box",5:"hamming"},F2=new Map([["png","image/png"],["jpg","image/jpeg"],
["jpeg","image/jpeg"],["gif","image/gif"]]),Mt=class Kt{constructor(t,r,n,s){this.data=t,this.width=r,this.height=n,this.
channels=s}get size(){return[this.width,this.height]}static async read(t){if(t instanceof Kt)return t;if(typeof t=="stri\
ng"||t instanceof URL)return await this.fromURL(t);if(t instanceof Blob)return await this.fromBlob(t);if(typeof HTMLCanvasElement<
"u"&&t instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&t instanceof OffscreenCanvas)return this.fromCanvas(t);
throw new Error(`Unsupported input type: ${typeof t}`)}static fromCanvas(t){if(!fe.IS_WEB_ENV)throw new Error("fromCanva\
s() is only supported in browser environments.");const n=t.getContext("2d").getImageData(0,0,t.width,t.height).data;return new Kt(
n,t.width,t.height,4)}static async fromURL(t){const r=await os(t);if(r.status!==200)throw new Error(`Unable to read imag\
e from "${t}" (${r.status} ${r.statusText})`);const n=await r.blob();return this.fromBlob(n)}static async fromBlob(t){if(fe.
IS_WEB_ENV){const r=await xr(t),n=Gr(r.width,r.height).getContext("2d");return n.drawImage(r,0,0),new this(n.getImageData(
0,0,r.width,r.height).data,r.width,r.height,4)}else{const r=Ti(await t.arrayBuffer());return await xr(r)}}static fromTensor(t,r="\
CHW"){if(t.dims.length!==3)throw new Error(`Tensor should have 3 dimensions, but has ${t.dims.length} dimensions.`);if(r===
"CHW")t=t.permute(1,2,0);else if(r!=="HWC")throw new Error(`Unsupported channel format: ${r}`);if(!(t.data instanceof Uint8ClampedArray||
t.data instanceof Uint8Array))throw new Error(`Unsupported tensor type: ${t.type}`);switch(t.dims[2]){case 1:case 2:case 3:case 4:
return new Kt(t.data,t.dims[1],t.dims[0],t.dims[2]);default:throw new Error(`Unsupported number of channels: ${t.dims[2]}`)}}grayscale(){
if(this.channels===1)return this;const t=new Uint8ClampedArray(this.width*this.height*1);switch(this.channels){case 3:case 4:
for(let r=0,n=0;r<this.data.length;r+=this.channels){const s=this.data[r],a=this.data[r+1],o=this.data[r+2];t[n++]=Math.
round(.2989*s+.587*a+.114*o)}break;default:throw new Error(`Conversion failed due to unsupported number of channels: ${this.
channels}`)}return this._update(t,this.width,this.height,1)}rgb(){if(this.channels===3)return this;const t=new Uint8ClampedArray(
this.width*this.height*3);switch(this.channels){case 1:for(let r=0,n=0;r<this.data.length;++r)t[n++]=this.data[r],t[n++]=
this.data[r],t[n++]=this.data[r];break;case 4:for(let r=0,n=0;r<this.data.length;r+=4)t[n++]=this.data[r],t[n++]=this.data[r+
1],t[n++]=this.data[r+2];break;default:throw new Error(`Conversion failed due to unsupported number of channels: ${this.
channels}`)}return this._update(t,this.width,this.height,3)}rgba(){if(this.channels===4)return this;const t=new Uint8ClampedArray(
this.width*this.height*4);switch(this.channels){case 1:for(let r=0,n=0;r<this.data.length;++r)t[n++]=this.data[r],t[n++]=
this.data[r],t[n++]=this.data[r],t[n++]=255;break;case 3:for(let r=0,n=0;r<this.data.length;r+=3)t[n++]=this.data[r],t[n++]=
this.data[r+1],t[n++]=this.data[r+2],t[n++]=255;break;default:throw new Error(`Conversion failed due to unsupported numb\
er of channels: ${this.channels}`)}return this._update(t,this.width,this.height,4)}putAlpha(t){if(t.width!==this.width||
t.height!==this.height)throw new Error(`Expected mask size to be ${this.width}x${this.height}, but got ${t.width}x${t.height}`);
if(t.channels!==1)throw new Error(`Expected mask to have 1 channel, but got ${t.channels}`);const r=this.data,n=t.data,s=this.
width*this.height;if(this.channels===3){const a=new Uint8ClampedArray(s*4);for(let o=0,i=0,l=0;o<s;++o)a[l++]=r[i++],a[l++]=
r[i++],a[l++]=r[i++],a[l++]=n[o];return this._update(a,this.width,this.height,4)}else if(this.channels===4){for(let a=0;a<
s;++a)r[4*a+3]=n[a];return this}throw new Error(`Expected image to have 3 or 4 channels, but got ${this.channels}`)}async resize(t,r,{
resample:n=2}={}){if(this.width===t&&this.height===r)return this;let s=P2[n]??n;const a=Ff(t),o=Ff(r);if(a&&o)return this;
if(a?t=r/this.height*this.width:o&&(r=t/this.width*this.height),fe.IS_WEB_ENV){const i=this.channels,l=this.toCanvas(),c=Gr(
t,r).getContext("2d");return c.drawImage(l,0,0,t,r),new Kt(c.getImageData(0,0,t,r).data,t,r,4).convert(i)}else{let i=this.
toSharp();switch(s){case"box":case"hamming":(s==="box"||s==="hamming")&&(de.warn(`Resampling method ${s} is not yet supp\
orted. Using bilinear instead.`),s="bilinear");case"nearest":case"bilinear":case"bicubic":i=i.affine([t/this.width,0,0,r/
this.height],{interpolator:s});break;case"lanczos":i=i.resize({width:t,height:r,fit:"fill",kernel:"lanczos3"});break;default:
throw new Error(`Resampling method ${s} is not supported.`)}return await xr(i)}}async pad([t,r,n,s]){if(t=Math.max(t,0),
r=Math.max(r,0),n=Math.max(n,0),s=Math.max(s,0),t===0&&r===0&&n===0&&s===0)return this;if(fe.IS_WEB_ENV){const a=this.channels,
o=this.toCanvas(),i=this.width+t+r,l=this.height+n+s,c=Gr(i,l).getContext("2d");return c.drawImage(o,0,0,this.width,this.
height,t,n,this.width,this.height),new Kt(c.getImageData(0,0,i,l).data,i,l,4).convert(a)}else{const a=this.toSharp().extend(
{left:t,right:r,top:n,bottom:s});return await xr(a)}}async crop([t,r,n,s]){if(t=Math.max(t,0),r=Math.max(r,0),n=Math.min(
n,this.width-1),s=Math.min(s,this.height-1),t===0&&r===0&&n===this.width-1&&s===this.height-1)return this;const a=n-t+1,
o=s-r+1;if(fe.IS_WEB_ENV){const i=this.channels,l=this.toCanvas(),c=Gr(a,o).getContext("2d");return c.drawImage(l,t,r,a,
o,0,0,a,o),new Kt(c.getImageData(0,0,a,o).data,a,o,4).convert(i)}else{const i=this.toSharp().extract({left:t,top:r,width:a,
height:o});return await xr(i)}}async center_crop(t,r){if(this.width===t&&this.height===r)return this;const n=(this.width-
t)/2,s=(this.height-r)/2;if(fe.IS_WEB_ENV){const a=this.channels,o=this.toCanvas(),i=Gr(t,r).getContext("2d");let l=0,c=0,
d=0,h=0;return n>=0?l=n:d=-n,s>=0?c=s:h=-s,i.drawImage(o,l,c,t,r,d,h,t,r),new Kt(i.getImageData(0,0,t,r).data,t,r,4).convert(
a)}else{let a=this.toSharp();if(n>=0&&s>=0)a=a.extract({left:Math.floor(n),top:Math.floor(s),width:t,height:r});else if(n<=
0&&s<=0){const o=Math.floor(-s),i=Math.floor(-n);a=a.extend({top:o,left:i,right:t-this.width-i,bottom:r-this.height-o})}else{
let o=[0,0],i=0;s<0?(o[0]=Math.floor(-s),o[1]=r-this.height-o[0]):i=Math.floor(s);let l=[0,0],c=0;n<0?(l[0]=Math.floor(-n),
l[1]=t-this.width-l[0]):c=Math.floor(n),a=a.extend({top:o[0],bottom:o[1],left:l[0],right:l[1]}).extract({left:c,top:i,width:t,
height:r})}return await xr(a)}}async toBlob(t="image/png",r=1){if(!fe.IS_WEB_ENV)throw new Error("toBlob() is only suppo\
rted in browser environments.");return await this.toCanvas().convertToBlob({type:t,quality:r})}toTensor(t="CHW"){let r=new G(
"uint8",new Uint8Array(this.data),[this.height,this.width,this.channels]);if(t!=="HWC")if(t==="CHW")r=r.permute(2,0,1);else
throw new Error(`Unsupported channel format: ${t}`);return r}toCanvas(){if(!fe.IS_WEB_ENV)throw new Error("toCanvas() is\
 only supported in browser environments.");const t=this.clone().rgba(),r=Gr(t.width,t.height),n=new Bm(t.data,t.width,t.
height);return r.getContext("2d").putImageData(n,0,0),r}split(){const{data:t,width:r,height:n,channels:s}=this,a=t.constructor,
o=t.length/s,i=Array.from({length:s},()=>new a(o));for(let l=0;l<o;++l){const c=s*l;for(let d=0;d<s;++d)i[d][l]=t[c+d]}return i.
map(l=>new Kt(l,r,n,1))}_update(t,r,n,s=null){return this.data=t,this.width=r,this.height=n,s!==null&&(this.channels=s),
this}clone(){return new Kt(this.data.slice(),this.width,this.height,this.channels)}convert(t){if(this.channels===t)return this;
switch(t){case 1:this.grayscale();break;case 3:this.rgb();break;case 4:this.rgba();break;default:throw new Error(`Conver\
sion failed due to unsupported number of channels: ${this.channels}`)}return this}async save(t){if(fe.IS_WEB_ENV){if(fe.
IS_WEBWORKER_ENV)throw new Error("Unable to save an image from a Web Worker.");const r=t.split(".").pop().toLowerCase(),
n=F2.get(r)??"image/png",s=await this.toBlob(n);return Sm(t,s)}else if(fe.IS_FS_AVAILABLE)await this.toSharp().toFile(t);else
throw new Error("Unable to save the image because filesystem is disabled in this environment.")}toSharp(){if(fe.IS_WEB_ENV)
throw new Error("toSharp() is only supported in server-side environments.");return Ti(this.data,{raw:{width:this.width,height:this.
height,channels:this.channels}})}},uz=Mt.read.bind(Mt);function I2(e,t,r,n,s){const a=n*r**2,o=Math.sqrt(a/(e*t)),i=s*r;
let l=Math.floor(o*e/i)*i,c=Math.floor(o*t/i)*i;if(l===0&&c===0)throw new Error(`Attempting to resize to a 0 x 0 image. \
Resized height should be divisible by \`pooling_kernel_size * patch_size\`=${i}.`);const d=Math.floor(n/s**2)*i;return l===
0?(l=i,c=Math.min(Math.floor(t/e)*i,d)):c===0&&(c=i,l=Math.min(Math.floor(e/t)*i,d)),[l,c]}function L2(e,t,r,n,s,a,o){const i=Math.
floor(t/s),l=Math.floor(r/s),c=i*l,d=s*s*n,h=new Float32Array(a*d);let _=0;for(let v=0;v<i;++v)for(let y=0;y<l;++y)for(let b=0;b<
s;++b){const k=(v*s+b)*r*n+y*s*n;for(let A=0;A<s;++A){const E=k+A*n;for(let C=0;C<n;++C)h[_++]=e[E+C]}}const p=new BigInt64Array(
a*2).fill(-1n);let w=0;for(let v=0;v<i;++v)for(let y=0;y<l;++y)p[w++]=BigInt(y),p[w++]=BigInt(v);return{patches:new G("f\
loat32",h,[a,d]),positions:new G("int64",p,[a,2]),num_soft_tokens:Math.floor(c/o**2)}}var _l=class extends ft{constructor(e){
super(),this.config=e,this.patch_size=e.patch_size??16,this.max_soft_tokens=e.max_soft_tokens??280,this.pooling_kernel_size=
e.pooling_kernel_size??3,this.resample=e.resample??3,this.rescale_factor=e.rescale_factor??1/255,this.do_rescale=e.do_rescale??
!0,this.do_resize=e.do_resize??!0,this.do_convert_rgb=e.do_convert_rgb??!0}async _call(e){Array.isArray(e)||(e=[e]);const{
patch_size:t,pooling_kernel_size:r}=this,n=this.max_soft_tokens*r**2,s=[],a=[],o=[];for(let i of e){if(this.do_convert_rgb&&
(i=i.rgb()),this.do_resize){const[_,p]=I2(i.height,i.width,t,n,r);(_!==i.height||p!==i.width)&&(i=await i.resize(p,_,{resample:this.
resample}))}const l=Float32Array.from(i.data);if(this.do_rescale)for(let _=0;_<l.length;++_)l[_]*=this.rescale_factor;const{
patches:c,positions:d,num_soft_tokens:h}=L2(l,i.height,i.width,i.channels,t,n,r);s.push(c),a.push(d),o.push(h)}return{pixel_values:ur(
s,0),image_position_ids:ur(a,0),num_soft_tokens_per_image:o}}},Rm=class extends Te{static uses_processor_config=!0;static uses_chat_template_file=!0;constructor(e,t,r){
super(e,t,r),this.audio_ms_per_token=this.config.audio_ms_per_token??40,this.audio_seq_length=this.config.audio_seq_length??
750,this.image_seq_length=this.config.image_seq_length??280;const{audio_token:n,boa_token:s,eoa_token:a,image_token:o,boi_token:i,
eoi_token:l}=this.tokenizer.config;this.audio_token=n,this.boa_token=s,this.eoa_token=a,this.image_token=o,this.boi_token=
i,this.eoi_token=l}static async from_pretrained(e,t={}){const[r,n,s]=await Promise.all([tr(e,Am,!0,t),ke.from_pretrained(
e,t),sl(e,Cm,!1,t)]),a={tokenizer:n};return r.image_processor&&(a.image_processor=new _l(r.image_processor)),r.feature_extractor&&
(a.feature_extractor=new Dm(r.feature_extractor)),new this(r,a,s)}_compute_audio_num_tokens(e,t){const r=Math.round(t*20/
1e3),n=Math.round(t*10/1e3),s=Math.floor(r/2);let a=Math.floor((e+s-r-1)/n)+1;if(a<=0)return 0;for(let o=0;o<2;++o)a=Math.
floor((a-1)/2)+1;return Math.min(a,this.audio_seq_length)}async _call(e,t=null,r=null,n={}){typeof e=="string"&&(e=[e]);
let s;if(t){s=await this.image_processor(t,n);const o=s.num_soft_tokens_per_image;let i=0;e=e.map(l=>l.replaceAll(this.image_token,
()=>`

${this.boi_token}${this.image_token.repeat(o[i++])}${this.eoi_token}

`))}let a;if(r){const o=Array.isArray(r)?r:[r];a=await this.feature_extractor(o[0],n);const i=this.feature_extractor.config.
sampling_rate??16e3;let l=0;e=e.map(c=>c.replaceAll(this.audio_token,()=>`

${this.boa_token}${this.audio_token.repeat(this._compute_audio_num_tokens(o[l++].length,i))}${this.eoa_token}

`))}return{...this.tokenizer(e,n),...s,...a}}},$m=class extends ft{constructor(e){super(),this.config=e,this.frame_processor=
new _l(e),this.max_frames=e.max_frames??32,this.overflow_strategy=e.overflow_strategy??"uniform"}sample_frames(e){const t=e.
length,{max_frames:r}=this;if(t<=r)return e;if(this.overflow_strategy==="truncate")return e.slice(0,r);const n=r>1?(t-1)/
(r-1):0;return Array.from({length:r},(s,a)=>e[a>0&&a===r-1?t-1:Math.floor(a*n)])}async _call(e){Array.isArray(e)||(e=[e]);
const t=e.map(o=>this.sample_frames(o.frames.map(i=>i.image))),{pixel_values:r,image_position_ids:n,num_soft_tokens_per_image:s}=await this.
frame_processor(t.flat());let a=0;return{pixel_values_videos:r,video_position_ids:n,num_frames_per_video:t.map(o=>o.length),
num_soft_tokens_per_video:t.map(o=>s[(a+=o.length)-1])}}};function oi(e,t){return Array.isArray(e)?e.every(r=>Array.isArray(
r))?e:t?[e]:e.map(r=>[r]):[[e]]}function O2(e,t,r){let n=0;if(e=e.map(s=>s.replaceAll(t,()=>r[n++]??"")),n!==r.length)throw new Error(
`Found ${n} ${t} tokens in the text, but ${r.length} inputs were passed.`);return e}var N2=class extends Rm{constructor(e,t,r){
super(e,t,r),this.video_token=this.tokenizer.config.video_token,this.video_processor=e.video_processor&&new $m(e.video_processor)}async _call(e,t=null,r=null,n=null,s={}){
const a=[[this.image_token,t&&oi(t,!0)],[this.video_token,n&&oi(n,!1)],[this.audio_token,r&&oi(r,!1)]];if(e==null){const E=a.
filter(([,N])=>N),C=E[0]?.[1].length;if(E.some(([,N])=>N.length!==C))throw new Error("Received a different number of sam\
ples per modality.");e=Array.from({length:C},(N,M)=>E.flatMap(([$,R])=>Array(R[M].length).fill($)).join(" "))}else typeof e==
"string"&&(e=[e]);const[o,i,l]=a.map(([,E])=>E?.flat()),c=o&&await this.image_processor(o),d=i&&await this.video_processor(
i),h=l&&await this._process_audio(l),{image_token:_,video_token:p,audio_token:w,boi_token:v,eoi_token:y,boa_token:b,eoa_token:k}=this,
A={[_]:c?.num_soft_tokens_per_image.map(E=>v+_.repeat(E)+y),[p]:d?.num_soft_tokens_per_video.map((E,C)=>(v+p.repeat(E)+y).
repeat(d.num_frames_per_video[C])),[w]:h?.num_soft_tokens_per_audio.map(E=>b+w.repeat(E)+k)};for(const[E,C]of Object.entries(
A))e=O2(e,E,C??[]);return{...this.tokenizer(e,{padding:!0,...s}),...c,...d,...h}}async _process_audio(e){const t=[];for(const o of e)
t.push(await this.feature_extractor(o));const r=Math.max(...t.map(o=>o.input_features.dims[1])),n=t[0].input_features.dims[2],
s=new Float32Array(e.length*r*n),a=new Uint8Array(e.length*r);return t.forEach((o,i)=>{s.set(o.input_features.data,i*r*n),
a.set(o.input_features_mask.data,i*r)}),{input_features:new G("float32",s,[e.length,r,n]),input_features_mask:new G("boo\
l",a,[e.length,r]),num_soft_tokens_per_audio:t.map(({input_features_mask:{data:o}})=>{let i=0;for(let l=0;l<o.length;l+=
4)i+=Number(o[l]);return i})}}};function w_(e,t,r=0,n=null){const s=e/t;let a=OT(s)*t;return n!==null&&a>n&&(a=Math.floor(
s)*t),a<r&&(a=Math.ceil(s)*t),a}function v_([e,t],r){return[Math.max(Math.floor(e/r),1)*r,Math.max(Math.floor(t/r),1)*r]}
function Gm([e,t,r,n]){return[e-r/2,t-n/2,e+r/2,t+n/2]}function La(e,t=.5,r=null,n=!1){const s=e.logits,a=e.pred_boxes,[
o,i,l]=s.dims;if(r!==null&&r.length!==o)throw Error("Make sure that you pass in as many target sizes as the batch dimens\
ion of the logits");let c=[];for(let d=0;d<o;++d){let h=r!==null?r[d]:null,_={boxes:[],classes:[],scores:[]},p=s[d],w=a[d];
for(let v=0;v<i;++v){let y=p[v],b=[],k;if(n){k=y.sigmoid().data;for(let A=0;A<k.length;++A)k[A]>t&&b.push(A)}else{let A=We(
y.data)[1];if(A===l-1||(k=nt(y.data),k[A]<t))continue;b.push(A)}for(const A of b){let E=w[v].data;E=Gm(E),h!==null&&(E=E.
map((C,N)=>C*h[(N+1)%2])),_.boxes.push(E),_.classes.push(A),_.scores.push(k[A])}}c.push(_)}return c}function Vm(e,t=null){
const r=e.logits,n=r.dims[0];if(t!==null&&t.length!==n)throw Error("Make sure that you pass in as many target sizes as t\
he batch dimension of the logits");const s=[];for(let a=0;a<n;++a){const o=t!==null?t[a]:null;let i=r[a];o!==null&&(i=wm(
i,o,"bilinear",!1));const[l,c]=o??i.dims.slice(-2),d=new G("int32",new Int32Array(l*c),[l,c]),h=i[0].data,_=d.data;for(let v=1;v<
i.dims[0];++v){const y=i[v].data;for(let b=0;b<y.length;++b)y[b]>h[b]&&(h[b]=y[b],_[b]=v)}const p=new Array(i.dims[0]);for(let v=0;v<
_.length;++v){const y=_[v];p[y]=y}const w=p.filter(v=>v!==void 0);s.push({segmentation:d,labels:w})}return s}function D2(e,t,r,n){
const s=[],a=[],o=[];for(let i=0;i<e.dims[0];++i){const l=e[i],c=t[i],d=We(l.data)[1];if(d===n)continue;const _=nt(l.data)[d];
_>r&&(s.push(c),a.push(_),o.push(d))}return[s,a,o]}function z2(e,t,r,n=.5,s=.8){const a=[];let o=0,i=0;const l=t[r].data;
for(let d=0;d<e.length;++d)e[d]===r&&(a.push(d),++o),l[d]>=n&&++i;let c=o>0&&i>0;return c&&(c=o/i>s),[c,a]}function B2(e,t,r,n,s,a=null,o=null){
const[i,l]=o??e[0].dims,c=new G("int32",new Int32Array(i*l),[i,l]),d=[];if(o!==null)for(let v=0;v<e.length;++v)e[v]=wm(e[v],
o,"bilinear",!1);const h=new Int32Array(e[0].data.length),_=new Float32Array(e[0].data.length);for(let v=0;v<e.length;++v){
let y=t[v];const b=e[v].data;for(let k=0;k<b.length;++k)b[k]*=y,b[k]>_[k]&&(h[k]=v,_[k]=b[k])}let p=0;const w=c.data;for(let v=0;v<
r.length;++v){const y=r[v],[b,k]=z2(h,e,v,n,s);if(b){++p;for(const A of k)w[A]=p;d.push({id:p,label_id:y,score:t[v]})}}return[
c,d]}function pl(e,t,r=28,n=3136,s=784*1280,a=1){if(e<r||t<r){const l=Math.max(r/e,r/t);e=Math.round(e*l),t=Math.round(t*
l)}if(Math.max(e,t)/Math.min(e,t)>200)throw new Error(`absolute aspect ratio must be smaller than 200, got ${Math.max(e,
t)/Math.min(e,t)}`);let o=Math.round(e/r)*r,i=Math.round(t/r)*r;if(a*o*i>s){const l=Math.sqrt(a*e*t/s);o=Math.max(r,Math.
floor(e/l/r)*r),i=Math.max(r,Math.floor(t/l/r)*r)}else if(a*o*i<n){const l=Math.sqrt(n/(a*e*t));o=Math.ceil(e*l/r)*r,i=Math.
ceil(t*l/r)*r}return[i,o]}function Um(e,t=.5,r=.5,n=.8,s=null,a=null){s===null&&(de.warn("`label_ids_to_fuse` unset. No \
instance will be fused."),s=new Set);const o=e.class_queries_logits??e.logits,l=(e.masks_queries_logits??e.pred_masks).sigmoid();
let[c,d,h]=o.dims;if(h-=1,a!==null&&a.length!==c)throw Error("Make sure that you pass in as many target sizes as the bat\
ch dimension of the logits");let _=[];for(let p=0;p<c;++p){let w=a!==null?a[p]:null,v=o[p],y=l[p],[b,k,A]=D2(v,y,t,h);if(A.
length===0){let[N,M]=w??y.dims.slice(-2),$=new G("int32",new Int32Array(N*M).fill(-1),[N,M]);_.push({segmentation:$,segments_info:[]});
continue}let[E,C]=B2(b,k,A,r,n,s,w);_.push({segmentation:E,segments_info:C})}return _}function jm(e,t=.5,r=null){throw new Error(
"`post_process_instance_segmentation` is not yet implemented.")}var he=class extends ft{constructor(e){super(),this.image_mean=
e.image_mean??e.mean,this.image_std=e.image_std??e.std,this.resample=e.resample??2,this.do_rescale=e.do_rescale??!0,this.
rescale_factor=e.rescale_factor??1/255,this.do_normalize=e.do_normalize,this.do_thumbnail=e.do_thumbnail,this.size=e.size??
e.image_size,this.do_resize=e.do_resize??this.size!==void 0,this.size_divisibility=e.size_divisibility??e.size_divisor,this.
do_center_crop=e.do_center_crop,this.crop_size=e.crop_size,this.do_convert_rgb=e.do_convert_rgb??!0,this.do_crop_margin=
e.do_crop_margin,this.pad_size=e.pad_size,this.do_pad=e.do_pad,this.min_pixels=e.min_pixels,this.max_pixels=e.max_pixels,
this.do_pad&&!this.pad_size&&!this.size_divisibility&&this.size&&this.size.width!==void 0&&this.size.height!==void 0&&(this.
pad_size=this.size),this.do_flip_channel_order=e.do_flip_channel_order??!1,this.config=e}async thumbnail(e,t,r=2){const n=e.
height,s=e.width,a=t.height,o=t.width;let i=Math.min(n,a),l=Math.min(s,o);return i===n&&l===s?e:(n>s?l=Math.floor(s*i/n):
s>n&&(i=Math.floor(n*l/s)),await e.resize(l,i,{resample:r}))}async crop_margin(e,t=200){const r=e.clone().grayscale(),n=bi(
r.data)[0],a=We(r.data)[0]-n;if(a===0)return e;const o=t/255;let i=r.width,l=r.height,c=0,d=0;const h=r.data;for(let _=0;_<
r.height;++_){const p=_*r.width;for(let w=0;w<r.width;++w)(h[p+w]-n)/a<o&&(i=Math.min(i,w),l=Math.min(l,_),c=Math.max(c,
w),d=Math.max(d,_))}return e=await e.crop([i,l,c,d]),e}pad_image(e,t,r,{mode:n="constant",center:s=!1,constant_values:a=0}={}){
const[o,i,l]=t;let c,d;if(typeof r=="number"?(c=r,d=r):r==="square"?c=d=Math.max(o,i):(c=r.width,d=r.height),c!==i||d!==
o){const h=new Float32Array(c*d*l);if(Array.isArray(a))for(let w=0;w<h.length;++w)h[w]=a[w%l];else a!==0&&h.fill(a);const[
_,p]=s?[Math.floor((c-i)/2),Math.floor((d-o)/2)]:[0,0];for(let w=0;w<o;++w){const v=(w+p)*c,y=w*i;for(let b=0;b<i;++b){const k=(v+
b+_)*l,A=(y+b)*l;for(let E=0;E<l;++E)h[k+E]=e[A+E]}}if(n==="symmetric"){if(s)throw new Error("`center` padding is not su\
pported when `mode` is set to `symmetric`.");const w=o-1,v=i-1;for(let y=0;y<d;++y){const b=y*c,k=_a(y,w)*i;for(let A=0;A<
c;++A){if(y<o&&A<i)continue;const E=(b+A)*l,C=(k+_a(A,v))*l;for(let N=0;N<l;++N)h[E+N]=e[C+N]}}}e=h,t=[d,c,l]}return[e,t]}rescale(e){
for(let t=0;t<e.length;++t)e[t]=this.rescale_factor*e[t]}get_resize_output_image_size(e,t){const[r,n]=e.size;let s,a;if(this.
do_thumbnail){const{height:o,width:i}=t;s=Math.min(o,i)}else Number.isInteger(t)?(s=t,a=this.config.max_size??s):t!==void 0&&
(s=t.shortest_edge,a=t.longest_edge);if(s!==void 0||a!==void 0){const o=s===void 0?1:Math.max(s/r,s/n),i=r*o,l=n*o,c=a===
void 0?1:Math.min(a/i,a/l);let d=Math.floor(Number((i*c).toFixed(2))),h=Math.floor(Number((l*c).toFixed(2)));return this.
size_divisibility!==void 0&&([d,h]=v_([d,h],this.size_divisibility)),[d,h]}else if(t!==void 0&&t.width!==void 0&&t.height!==
void 0){let o=t.width,i=t.height;if(this.config.keep_aspect_ratio&&this.config.ensure_multiple_of){let l=i/n,c=o/r;Math.
abs(1-c)<Math.abs(1-l)?l=c:c=l,i=w_(l*n,this.config.ensure_multiple_of),o=w_(c*r,this.config.ensure_multiple_of)}return[
o,i]}else{if(this.size_divisibility!==void 0)return v_([r,n],this.size_divisibility);throw new Error(`Could not resize i\
mage due to unsupported \`this.size\` option in config: ${JSON.stringify(t)}`)}}async resize(e){const[t,r]=this.get_resize_output_image_size(
e,this.size);return await e.resize(t,r,{resample:this.resample})}async preprocess(e,{do_normalize:t=null,do_pad:r=null,do_convert_rgb:n=null,
do_convert_grayscale:s=null,do_flip_channel_order:a=null}={}){this.do_crop_margin&&(e=await this.crop_margin(e));const[o,
i]=e.size;if(n??this.do_convert_rgb?e=e.rgb():s&&(e=e.grayscale()),this.do_resize&&(e=await this.resize(e)),this.do_thumbnail&&
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
Array.isArray(e)||(e=[e]);const r=await Promise.all(e.map(s=>this.preprocess(s)));return{pixel_values:ur(r.map(s=>s.pixel_values),
0),original_sizes:r.map(s=>s.original_size),reshaped_input_sizes:r.map(s=>s.reshaped_input_size)}}static async from_pretrained(e,t={}){
const r=await tr(e,cs,!0,t);return new this(r)}},xa={};hs(xa,{BeitFeatureExtractor:()=>R2,BitImageProcessor:()=>$2,CHMv2ImageProcessor:()=>V2,
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
ViTFeatureExtractor:()=>SA,ViTImageProcessor:()=>ng,VitMatteImageProcessor:()=>PA,VitPoseImageProcessor:()=>FA,YolosFeatureExtractor:()=>IA,
YolosImageProcessor:()=>sg});var R2=class extends he{},$2=class extends he{},G2=class extends he{},V2=class extends he{},
qm=class extends he{},U2=class extends qm{},Wm=class extends he{constructor(e){super(e),this.crop_pct=this.config.crop_pct??
224/256}async resize(e){const t=this.size?.shortest_edge;if(t===void 0)throw new Error("Size dictionary must contain 'sh\
ortest_edge' key.");if(t<384){const r=Math.floor(t/this.crop_pct),[n,s]=this.get_resize_output_image_size(e,{shortest_edge:r});
e=await e.resize(n,s,{resample:this.resample}),e=await e.center_crop(t,t)}else e=await e.resize(t,t,{resample:this.resample});
return e}},j2=class extends Wm{},Hm=class extends he{},q2=class extends Hm{},Qm=class extends he{async _call(e){const t=await super.
_call(e),r=[t.pixel_values.dims[0],64,64],n=ct(r,1n);return{...t,pixel_mask:n}}post_process_object_detection(...e){return La(
...e)}post_process_panoptic_segmentation(...e){return Um(...e)}post_process_instance_segmentation(...e){return jm(...e)}},
W2=class extends Qm{},H2=class extends he{},ml=class extends he{pad_image(e,t,r,n={}){const[s,a,o]=t;let i=this.image_mean;
Array.isArray(this.image_mean)||(i=new Array(o).fill(i));let l=this.image_std;Array.isArray(l)||(l=new Array(o).fill(i));
const c=i.map((d,h)=>-d/l[h]);return super.pad_image(e,t,r,{center:!0,constant_values:c,...n})}},Q2=class extends ml{},Xm=class extends he{},
X2=class extends Xm{},Y2=class extends he{constructor(e){super(e),this.include_top=this.config.include_top??!0,this.include_top&&
(this.image_std=this.image_std.map(t=>t*t))}},K2=class extends he{},gl=class extends he{constructor(e){super(e),this.min_pixels=
e.min_pixels??e.size?.shortest_edge,this.max_pixels=e.max_pixels??e.size?.longest_edge,this.patch_size=e.patch_size,this.
merge_size=e.merge_size}get_resize_output_image_size(e,t){const r=this.patch_size*this.merge_size;return pl(e.height,e.width,
r,this.min_pixels,this.max_pixels)}async _call(e,...t){const{pixel_values:r,original_sizes:n,reshaped_input_sizes:s}=await super.
_call(e,...t);let a=r;const{temporal_patch_size:o,merge_size:i,patch_size:l}=this.config;a.dims[0]===1&&(a=Oe(Array.from(
{length:o},()=>a),0));const c=a.dims[0]/o,d=a.dims[1],h=Math.floor(a.dims[2]/l),_=Math.floor(a.dims[3]/l),p=a.view(c,o,d,
Math.floor(h/i),i,l,Math.floor(_/i),i,l).permute(0,3,6,4,7,2,1,5,8).view(c*h*_,d*o*l*l),w=new G("int64",[c,h,_],[1,3]);return{
pixel_values:p,image_grid_thw:w,original_sizes:n,reshaped_input_sizes:s}}},J2=class extends gl{get_resize_output_image_size(e,t){
const r=this.patch_size*this.merge_size,n=this.config.temporal_patch_size??2;return pl(e.height,e.width,r,this.min_pixels,
this.max_pixels,n)}},Z2=class extends he{},eA=class extends he{async _call(e){const t=await super._call(e),r=t.pixel_values.
dims,n=_t([r[0],r[2],r[3]]);return{...t,pixel_mask:n}}},y_=class extends he{constructor(e){super(e),this.do_image_splitting=
e.do_image_splitting??!0,this.max_image_size=e.max_image_size}get_resize_for_vision_encoder(e,t){let[r,n]=e.dims.slice(-2);
const s=n/r;return n>=r?(n=Math.ceil(n/t)*t,r=Math.floor(n/s),r=Math.ceil(r/t)*t):(r=Math.ceil(r/t)*t,n=Math.floor(r*s),
n=Math.ceil(n/t)*t),{height:r,width:n}}async _call(e,{do_image_splitting:t=null,return_row_col_info:r=!1}={}){let n;if(!Array.
isArray(e))n=[[e]];else{if(e.length===0||!e[0])throw new Error("No images provided.");Array.isArray(e[0])?n=e:n=[e]}let s=[],
a=[],o=[];const i=[],l=[];for(const y of n){let b=await Promise.all(y.map(E=>this.preprocess(E)));i.push(...b.map(E=>E.original_size)),
l.push(...b.map(E=>E.reshaped_input_size)),b.forEach(E=>E.pixel_values.unsqueeze_(0));const{longest_edge:k}=this.max_image_size;
let A;if(t??this.do_image_splitting){let E=new Array(b.length),C=new Array(b.length);A=await Promise.all(b.map(async(N,M)=>{
const $=this.get_resize_for_vision_encoder(N.pixel_values,k),R=await Rt(N.pixel_values,{size:[$.height,$.width]}),{frames:j,
num_splits_h:Y,num_splits_w:Q}=await this.split_image(R,this.max_image_size);return E[M]=Y,C[M]=Q,Oe(j,0)})),a.push(E),o.
push(C)}else{const E=[k,k];A=await Promise.all(b.map(C=>Rt(C.pixel_values,{size:E}))),a.push(new Array(b.length).fill(0)),
o.push(new Array(b.length).fill(0))}s.push(Oe(A,0))}const c=s.length,[d,h,_,p]=s[0].dims;let w,v;if(c===1)w=s[0].unsqueeze_(
0),v=ct([c,d,_,p],!0);else{const y=Math.max(...s.map(A=>A.dims.at(0)));v=ct([c,y,_,p],!0);const b=v.data,k=y*_*p;for(let A=0;A<
c;++A){const E=s[A].dims[0];if(E<y){s[A]=Oe([s[A],ct([y-E,h,_,p],0)],0);const C=A*k+E*_*p,N=(A+1)*k;b.fill(!1,C,N)}}w=ur(
s,0)}return{pixel_values:w,pixel_attention_mask:v,original_sizes:i,reshaped_input_sizes:l,...r?{rows:a,cols:o}:{}}}async split_image(e,{
longest_edge:t}){const r=t,n=t,s=[],[a,o]=e.dims.slice(-2);let i=0,l=0;if(a>r||o>n){i=Math.ceil(a/r),l=Math.ceil(o/n);const c=Math.
ceil(a/i),d=Math.ceil(o/l);for(let p=0;p<i;++p)for(let w=0;w<l;++w){let v,y,b,k;p===i-1?(y=a-c,k=a):(y=p*c,k=(p+1)*c),w===
l-1?(v=o-d,b=o):(v=w*d,b=(w+1)*d);const C=await vm(e,[y,v],[k,b],[2,3]);s.push(C)}const h=r,_=n;(a!==h||o!==_)&&(e=await Rt(
e,{size:[h,_]}))}return s.push(e),{frames:s,num_splits_h:i,num_splits_w:l}}},tA=class extends he{constructor(e){super({do_pad:!0,
pad_size:{width:e.image_size,height:e.image_size},...e}),this.constant_values=this.config.background_color.map(t=>t*this.
rescale_factor)}pad_image(e,t,r,n){return super.pad_image(e,t,r,{constant_values:this.constant_values,center:!0,...n})}},
rA=class extends he{constructor(e){const{resize_mode:t,fill_color:r,interpolation:n,size:s,...a}=e,o=t==="squash"?{width:s,
height:s}:t==="shortest"?{shortest_edge:s}:{longest_edge:s},i=n==="bicubic"?3:2;super({...a,size:o,resample:i,do_center_crop:!0,
crop_size:s,do_normalize:!0})}};function b_(e,t){return Math.round(e/t)*t}function nA(e,t,r,n,s){let a=1/0,o=[1,1];const i=r*
n;for(const l of t){const c=Math.abs(e-l[0]/l[1]);c<a?(a=c,o=l):c===a&&i>.5*s*s*l[0]*l[1]&&(o=l)}return o}function sA(e,t){
const r=[],n=new Set;for(let s=e;s<=t;++s)for(let a=1;a<=s;++a)for(let o=1;o<=s;++o){const i=a*o;if(i>=e&&i<=t){const l=a<<
16|o;n.has(l)||(n.add(l),r.push([a,o]))}}return r.sort((s,a)=>s[0]*s[1]-a[0]*a[1])}function aA(e,t){const[r,n,s,a]=e.dims,
o=Math.floor(s/t),i=Math.floor(a/t),l=t*t*n,c=e.data,d=new Float32Array(r*o*i*l),h=s*a;for(let _=0;_<r;++_){const p=_*n*
h,w=_*o*i*l;for(let v=0;v<o;++v)for(let y=0;y<i;++y){let b=w+(v*i+y)*l;for(let k=0;k<t;++k){const A=(v*t+k)*a+y*t;for(let E=0;E<
t;++E){const C=A+E;for(let N=0;N<n;++N)d[b++]=c[p+N*h+C]}}}}return new G("float32",d,[r,o*i,l])}function oA(e,t){const[,
r,n]=e.dims,s=new BigInt64Array(t);s.fill(1n,0,r);let a=e;if(r<t){const o=new Float32Array(t*n);o.set(e.data),a=new G("f\
loat32",o,[1,t,n])}return{padded:a,mask:new G("int64",s,[t])}}var iA=class extends he{constructor(e){super(e),this.downsample_factor=
e.downsample_factor??2,this.do_image_splitting=e.do_image_splitting??!0,this.min_tiles=e.min_tiles??2,this.max_tiles=e.max_tiles??
10,this.use_thumbnail=e.use_thumbnail??!0,this.min_image_tokens=e.min_image_tokens??64,this.max_image_tokens=e.max_image_tokens??
256,this.encoder_patch_size=e.encoder_patch_size??e.patch_size??16,this.tile_size=e.tile_size??512,this.max_pixels_tolerance=
e.max_pixels_tolerance??2,this.return_row_col_info=e.return_row_col_info??!1;const t=this.max_image_tokens*this.downsample_factor**
2,r=this.do_image_splitting?(this.tile_size/this.encoder_patch_size)**2:0;this.max_num_patches=Math.max(t,r)}_is_image_too_large(e,t){
const r=this.encoder_patch_size*this.downsample_factor,n=Math.max(this.encoder_patch_size,b_(e,r)),s=Math.max(this.encoder_patch_size,
b_(t,r));return n*s>this.max_image_tokens*(this.encoder_patch_size*this.downsample_factor)**2*this.max_pixels_tolerance}_get_grid_layout(e,t){
const r=sA(this.min_tiles,this.max_tiles),[n,s]=nA(t/e,r,t,e,this.tile_size);return{grid_width:n,grid_height:s,target_width:this.
tile_size*n,target_height:this.tile_size*s}}async _call(e,{return_row_col_info:t=null}={}){let r;Array.isArray(e)?Array.
isArray(e[0])?r=e:r=[e]:r=[[e]];const n=[],s=[],a=[],o=[],i=[],l=[];for(const d of r){const h=await Promise.all(d.map(_=>this.
preprocess(_,{do_pad:!1})));for(const{pixel_values:_}of h){const[,p,w]=_.dims,v=_.unsqueeze_(0),y=this.encoder_patch_size*
this.downsample_factor,b=y**2,[k,A]=pl(Math.max(y,p),Math.max(y,w),y,this.min_image_tokens*b,this.max_image_tokens*b).map(
R=>Math.max(y,R));let E,C=1,N=1;const M=this._is_image_too_large(p,w),$=this.do_image_splitting&&!(this.min_tiles===1&&this.
max_tiles===1);if(M&&$){const{grid_width:R,grid_height:j,target_width:Y,target_height:Q}=this._get_grid_layout(p,w);C=j,
N=R;const z=await Rt(v,{size:[Q,Y]});E=[];for(let I=0;I<j;++I)for(let U=0;U<R;++U){const X=I*this.tile_size,ce=U*this.tile_size;
E.push(z.slice(null,null,[X,X+this.tile_size],[ce,ce+this.tile_size]))}this.use_thumbnail&&R*j!==1&&E.push(await Rt(v,{size:[
A,k]}))}else E=[await Rt(v,{size:[A,k]})];for(const R of E){const[,,j,Y]=R.dims,Q=aA(R,this.encoder_patch_size),{padded:z,
mask:I}=oA(Q,this.max_num_patches);n.push(z),s.push(I),a.push([Math.floor(j/this.encoder_patch_size),Math.floor(Y/this.encoder_patch_size)])}
o.push(C),i.push(N),l.push([A,k])}}const c={pixel_values:Oe(n,0),pixel_attention_mask:ur(s,0),spatial_shapes:new G("int6\
4",BigInt64Array.from(a.flat(),BigInt),[a.length,2])};return(t??this.return_row_col_info)&&(c.image_rows=o,c.image_cols=
i,c.image_sizes=l),c}},lA=class extends gl{async _call(e,...t){Array.isArray(e)||(e=[e]);const r=await Promise.all(e.map(
n=>super._call(n,...t)));return{pixel_values:Oe(r.map(n=>n.pixel_values),0),image_grid_thw:Oe(r.map(n=>n.image_grid_thw),
0),original_sizes:r.flatMap(n=>n.original_sizes),reshaped_input_sizes:r.flatMap(n=>n.reshaped_input_sizes)}}},cA=class extends he{},
wl=class extends he{post_process_panoptic_segmentation(...e){return Um(...e)}post_process_instance_segmentation(...e){return jm(
...e)}},uA=class extends wl{},dA=class extends wl{},Ym=class extends he{},hA=class extends Ym{},Km=class extends he{},fA=class extends Km{},
Jm=class extends he{},_A=class extends Jm{},Zm=class extends he{},pA=class extends Zm{},eg=class extends he{},mA=class extends eg{},
gA=class extends ml{},vl=class extends he{post_process_object_detection(...e){return La(...e)}},wA=class extends vl{},vA=class extends vl{},
mt=336,yA=[2,3],{ceil:ii,floor:hn,sqrt:li}=Math,bA=class extends he{constructor(e){super({...e,do_normalize:!0,do_pad:!0,
pad_size:"custom",do_convert_rgb:!0,do_resize:!0}),this._num_crops=e.num_crops}calc_num_image_tokens_from_image_size(e,t){
const{num_img_tokens:r}=this.config;return hn((hn(t/mt)*hn(e/mt)+1)*r+1+(hn(t/mt)+1)*li(r))}get_resize_output_image_size(e,t){
const r=this._num_crops,[n,s]=e.size;let a=n/s,o=1;for(;o*Math.ceil(o/a)<=r;)o+=1;o-=1;const i=Math.floor(o*336),l=Math.
floor(i/a);return[i,l]}pad_image(e,t,r,n={}){const[s,a]=t,o=mt*ii(s/mt),i=mt*ii(a/mt),l=[1,1,1].map((c,d)=>(c-this.image_mean[d])/
this.image_std[d]);return super.pad_image(e,t,{width:i,height:o},{center:!0,constant_values:l,...n})}async _call(e,{num_crops:t=null}={}){
if(this._num_crops=t??=this.config.num_crops,t<4||li(t)%1!==0)throw new Error("num_crops must be a square number >= 4");
Array.isArray(e)||(e=[e]);const r=e.length,n=await Promise.all(e.map(h=>this.preprocess(h))),s=n.map(h=>h.original_size),
a=n.map(h=>h.reshaped_input_size),o=[];for(const{pixel_values:h}of n){h.unsqueeze_(0);const[_,p]=h.dims.slice(-2),w=await Rt(
h,{size:[mt,mt],mode:"bicubic"});if(t>0){const v=[],y=li(t),b=hn(p/y),k=hn(_/y);for(let E=0;E<y;++E)for(let C=0;C<y;++C){
let N,M,$,R;E===y-1?(M=_-k,R=_):(M=E*k,R=(E+1)*k),C===y-1?(N=p-b,$=p):(N=C*b,$=(C+1)*b);const Q=await vm(h,[M,N],[R,$],yA);
v.push(Q)}const A=await Rt(Oe(v,0),{size:[mt,mt],mode:"bicubic"});o.push(Oe([w,A],0))}else o.push(w)}const i=ur(o,0),l=a.
map(h=>h.map(_=>mt*ii(_/mt))),c=new G("int64",l.flat(),[r,2]),d=l.map(([h,_])=>this.calc_num_image_tokens_from_image_size(
_,h));return{pixel_values:i,original_sizes:s,reshaped_input_sizes:a,image_sizes:c,num_img_tokens:d}}},MA=class extends he{get_resize_output_image_size(e,t){
const{longest_edge:r}=t;if(r===void 0)throw new Error("size must contain 'longest_edge'");const[n,s]=e.size,a=Math.max(n,
s)/r;let o=n,i=s;a>1&&(o=Math.floor(n/a),i=Math.floor(s/a));const{patch_size:l,spatial_merge_size:c}=this.config;if(!c)throw new Error(
"config must contain 'spatial_merge_size'");const d=l*c,h=Math.floor((o-1)/d)+1,_=Math.floor((i-1)/d)+1;return[h*d,_*d]}},
xA=class extends he{},kA=class extends he{post_process_object_detection(...e){return La(...e)}},ci=class extends he{reshape_input_points(e,t,r,n=!1){
e=structuredClone(e);let s=If(e);if(s.length===3)n||(s=[1,...s]),e=[e];else if(s.length!==4)throw Error("The input_point\
s must be a 4D tensor of shape `batch_size`, `point_batch_size`, `nb_points_per_image`, `2`.");for(let a=0;a<e.length;++a){
const[o,i]=t[a],[l,c]=r[a],d=[c/i,l/o];for(let h=0;h<e[a].length;++h)for(let _=0;_<e[a][h].length;++_)for(let p=0;p<e[a][h][_].
length;++p)e[a][h][_][p]*=d[p%2]}return new G("float32",Float32Array.from(e.flat(1/0)),s)}add_input_labels(e,t){let r=If(
e);if(r.length===2)r=[1,...r],e=[e];else if(r.length!==3)throw Error("The input_points must be a 4D tensor of shape `bat\
ch_size`, `point_batch_size`, `nb_points_per_image`, `2`.");if(r.some((n,s)=>n!==t.dims[s]))throw Error(`The first ${r.length}\
 dimensions of 'input_points' and 'input_labels' must be the same.`);return new G("int64",e.flat(1/0).map(BigInt),r)}async _call(e,{
input_points:t=null,input_labels:r=null,input_boxes:n=null}={}){const s=await super._call(e);if(t&&(s.input_points=this.
reshape_input_points(t,s.original_sizes,s.reshaped_input_sizes)),r){if(!s.input_points)throw Error("`input_points` must \
be provided if `input_labels` are provided.");s.input_labels=this.add_input_labels(r,s.input_points)}return n&&(s.input_boxes=
this.reshape_input_points(n,s.original_sizes,s.reshaped_input_sizes,!0)),s}async post_process_masks(e,t,r,{mask_threshold:n=0,
binarize:s=!0,pad_size:a=null}={}){const o=[];a=a??this.pad_size??this.size;const i=[a.height,a.width];for(let l=0;l<t.length;++l){
const c=t[l],d=r[l];let h=await Rt(e[l],{mode:"bilinear",size:i});if(h=h.slice(null,null,[0,d[0]],[0,d[1]]),h=await Rt(h,
{mode:"bilinear",size:c}),s){const _=h.data,p=new Uint8Array(_.length);for(let w=0;w<_.length;++w)_[w]>n&&(p[w]=1);h=new G(
"bool",p,h.dims)}o.push(h)}return o}generate_crop_boxes(e,t,{crop_n_layers:r=0,overlap_ratio:n=512/1500,points_per_crop:s=32,
crop_n_points_downscale_factor:a=1}={}){}},tg=class extends he{post_process_semantic_segmentation(...e){return Vm(...e)}},
TA=class extends tg{},rg=class extends he{post_process_semantic_segmentation(...e){return Vm(...e)}},EA=class extends rg{},
AA=class extends he{},CA=class extends he{pad_image(e,t,r,n={}){const[s,a,o]=t;return super.pad_image(e,t,{width:a+(r-a%
r)%r,height:s+(r-s%r)%r},{mode:"symmetric",center:!1,constant_values:-1,...n})}},ng=class extends he{},SA=class extends ng{},
PA=class extends he{async _call(e,t){Array.isArray(e)||(e=[e]),Array.isArray(t)||(t=[t]);const r=await Promise.all(e.map(
a=>this.preprocess(a))),n=await Promise.all(t.map(a=>this.preprocess(a,{do_normalize:!1,do_convert_rgb:!1,do_convert_grayscale:!0})));
return{pixel_values:ur(r.map((a,o)=>Oe([a.pixel_values,n[o].pixel_values],0)),0),original_sizes:r.map(a=>a.original_size),
reshaped_input_sizes:r.map(a=>a.reshaped_input_size)}}},FA=class extends he{post_process_pose_estimation(e,t,{threshold:r=null}={}){
const n=e.tolist(),[s,a,o,i]=e.dims,l=[];for(let c=0;c<s;++c){const d=n[c],h=t[c],_=[];for(let p=0;p<h.length;++p){const w=h[p],
v=[],y=[],b=[],k=w.at(-2)/i,A=w.at(-1)/o;for(let E=0;E<d.length;++E){let[C,N]=[0,0],M=0,$=-1/0;const R=d[E];for(let Y=0;Y<
R.length;++Y){const Q=R[Y];for(let z=0;z<Q.length;++z){const I=Q[z];M+=I,$=Math.max($,I),C+=(z+.5)*I,N+=Y*I}}if(r!=null&&
$<r)continue;const j=[k*C/M,A*N/M];v.push(j),b.push(E),y.push($)}_.push({bbox:w,scores:y,labels:b,keypoints:v})}l.push(_)}
return l}},sg=class extends he{post_process_object_detection(...e){return La(...e)}},IA=class extends sg{},at=class{static async from_pretrained(e,t={}){
const r=await tr(e,cs,!0,t),n=r.image_processor_type??r.feature_extractor_type;let s=xa[n?.replace(/Fast$/,"")];return s||
(n!==void 0&&de.warn(`Image processor type '${n}' not found, assuming base ImageProcessor. Please report this at ${Ia}.`),
s=he),new s(r)}},LA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;constructor(e,t,r){super(
e,t,r);const{tasks_answer_post_processing_type:n,task_prompts_without_inputs:s,task_prompts_with_input:a}=this.image_processor.
config;this.tasks_answer_post_processing_type=new Map(Object.entries(n??{})),this.task_prompts_without_inputs=new Map(Object.
entries(s??{})),this.task_prompts_with_input=new Map(Object.entries(a??{})),this.regexes={quad_boxes:/(.+?)<loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)>/gm,
bboxes:/([^<]+)?<loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)>/gm},this.size_per_bin=1e3}construct_prompts(e){typeof e=="s\
tring"&&(e=[e]);const t=[];for(const r of e)if(this.task_prompts_without_inputs.has(r))t.push(this.task_prompts_without_inputs.
get(r));else{for(const[n,s]of this.task_prompts_with_input)if(r.includes(n)){t.push(s.replaceAll("{input}",r).replaceAll(
n,""));break}t.length!==e.length&&t.push(r)}return t}post_process_generation(e,t,r){const n=this.tasks_answer_post_processing_type.
get(t)??"pure_text";e=e.replaceAll("<s>","").replaceAll("</s>","");let s;switch(n){case"pure_text":s=e;break;case"descri\
ption_with_bboxes":case"bboxes":case"phrase_grounding":case"ocr":const a=n==="ocr"?"quad_boxes":"bboxes",o=e.matchAll(this.
regexes[a]),i=[],l=[];for(const[c,d,...h]of o)i.push(d?d.trim():i.at(-1)??""),l.push(h.map((_,p)=>(Number(_)+.5)/this.size_per_bin*
r[p%2]));s={labels:i,[a]:l};break;default:throw new Error(`Task "${t}" (of type "${n}") not yet implemented.`)}return{[t]:s}}async _call(e,t=null,r={}){
if(!e&&!t)throw new Error("Either text or images must be provided");const n=await this.image_processor(e,r),s=t?this.tokenizer(
this.construct_prompts(t),r):{};return{...n,...s}}},OA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;static uses_processor_config=!0;static uses_chat_template_file=!0;constructor(e,t,r){
super(e,t,r),this.image_seq_length=this.config.image_seq_length;const{boi_token:n,image_token:s,eoi_token:a}=this.tokenizer.
config;this.boi_token=n,this.image_token=s,this.eoi_token=a;const o=s.repeat(this.image_seq_length);this.full_image_sequence=
`

${n}${o}${a}

`}async _call(e,t=null,r={}){typeof e=="string"&&(e=[e]);let n;return t&&(n=await this.image_processor(t,r),e=e.map(a=>a.
replaceAll(this.boi_token,this.full_image_sequence))),{...this.tokenizer(e,r),...n}}},NA=class extends Te{static image_processor_class=at;static feature_extractor_class=St;static tokenizer_class=ke;static uses_processor_config=!0;static uses_chat_template_file=!0;constructor(e,t,r){
super(e,t,r),this.audio_seq_length=this.config.audio_seq_length,this.image_seq_length=this.config.image_seq_length;const{
audio_token_id:n,boa_token:s,audio_token:a,eoa_token:o,image_token_id:i,boi_token:l,image_token:c,eoi_token:d}=this.tokenizer.
config;this.audio_token_id=n,this.boa_token=s,this.audio_token=a;const h=a.repeat(this.audio_seq_length);this.full_audio_sequence=
`

${s}${h}${o}

`,this.image_token_id=i,this.boi_token=l,this.image_token=c;const _=c.repeat(this.image_seq_length);this.full_image_sequence=
`

${l}${_}${d}

`}async _call(e,t=null,r=null,n={}){typeof e=="string"&&(e=[e]);let s;r&&(s=await this.feature_extractor(r,n),e=e.map(i=>i.
replaceAll(this.audio_token,this.full_audio_sequence)));let a;return t&&(a=await this.image_processor(t,n),e=e.map(i=>i.
replaceAll(this.image_token,this.full_image_sequence))),{...this.tokenizer(e,n),...a,...s}}},yl=class extends Te{static image_processor_class=at;static tokenizer_class=ke;static image_token="\
<|image_pad|>";async _call(e,t=null,...r){Array.isArray(e)||(e=[e]);let n,s;if(t&&(n=await this.image_processor(t),s=n.image_grid_thw),
s){let o=this.image_processor.config.merge_size**2,i=0;const l=this.constructor.image_token,c=s.tolist();e=e.map(d=>{for(;d.
includes(l);){const h=Number(c[i++].reduce((_,p)=>_*p,1n));d=d.replace(l,"<|placeholder|>".repeat(Math.floor(h/o)))}return d.
replaceAll("<|placeholder|>",l)})}return{...this.tokenizer(e),...n}}},DA=class extends yl{static image_token="<|image|>"},
zA=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!0;_get_num_audio_features(e){
const{hop_length:t}=this.feature_extractor.config.melspec_kwargs,{projector_window_size:r,projector_downsample_rate:n}=this.
feature_extractor.config,s=Math.floor(r/n),a=Math.floor(e/t)+1,o=Math.floor(a/2);return Math.ceil(o/r)*s}async _call(e,t=null,r={}){
if(Array.isArray(e))throw new Error("Batched inputs are not supported yet.");let n={};if(t){const{input_features:a}=await this.
feature_extractor(t);n.input_features=a;const o=this._get_num_audio_features(t.length),i=new Uint8Array(o).fill(1);n.input_features_mask=
new G("bool",i,[1,o]);const l=this.config.audio_token??"<|audio|>";if(!e.includes(l))throw new Error(`The input text doe\
s not contain the audio token ${l}.`);e=e.replaceAll(l,l.repeat(o))}return{...this.tokenizer(e,{add_special_tokens:!1,...r}),
...n}}};function BA(e,t){const n=e.dims.at(-1)-1,s=e.tolist();s.fill(!1,0,1),s.fill(!1,n);const a=t.tolist();return s.map(
(o,i)=>o?i:null).filter(o=>o!==null).map(o=>a[o])}var RA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;async _call(e,t,r={}){
const n=e?await this.image_processor(e,r):{};return{...t?this.tokenizer(t,r):{},...n}}post_process_grounded_object_detection(e,t,{
box_threshold:r=.25,text_threshold:n=.25,target_sizes:s=null}={}){const{logits:a,pred_boxes:o}=e,i=a.dims[0];if(s!==null&&
s.length!==i)throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits");const l=a.
dims.at(1),c=a.sigmoid(),d=c.max(-1).tolist(),h=o.tolist().map(p=>p.map(w=>Gm(w))),_=[];for(let p=0;p<i;++p){const w=s!==
null?s[p]:null;w!==null&&(h[p]=h[p].map(A=>A.map((E,C)=>E*w[(C+1)%2])));const v=d[p],y=[],b=[],k=[];for(let A=0;A<l;++A){
const E=v[A];if(E<=r)continue;const C=h[p][A],N=c[p][A];y.push(E),k.push(C);const M=BA(N.gt(n),t[p]);b.push(M)}_.push({scores:y,
boxes:k,labels:this.batch_decode(b)})}return _}};function $A(e,t,r,n,s,a){let o="";for(let i=0;i<t;++i){for(let l=0;l<r;++l)
o+=n+`<row_${i+1}_col_${l+1}>`+s.repeat(e);o+=`
`}return o+=`
${n}${a}`+s.repeat(e)+`${n}`,o}function GA(e,t,r,n){return`${t}${n}`+r.repeat(e)+`${t}`}function VA(e,t,r,n,s,a){return e===
0&&t===0?GA(r,n,s,a):$A(r,e,t,n,s,a)}var M_=class extends Te{static image_processor_class=at;static tokenizer_class=ke;static uses_processor_config=!0;fake_image_token="\
<fake_token_around_image>";image_token="<image>";global_img_token="<global-img>";async _call(e,t=null,r={}){r.return_row_col_info??=
!0;let n;t&&(n=await this.image_processor(t,r)),Array.isArray(e)||(e=[e]);const s=n.rows??[new Array(e.length).fill(0)],
a=n.cols??[new Array(e.length).fill(0)],o=this.config.image_seq_len,i=[],l=[];for(let d=0;d<e.length;++d){const h=e[d],_=s[d],
p=a[d];i.push(RM(h,this.image_token));const w=_.map((b,k)=>VA(b,p[k],o,this.fake_image_token,this.image_token,this.global_img_token)),
v=h.split(this.image_token);if(v.length===0)throw new Error("The image token should be present in the text.");let y=v[0];
for(let b=0;b<w.length;++b)y+=w[b]+v[b+1];l.push(y)}return{...this.tokenizer(l),...n}}},UA=class extends Te{static image_processor_class=at;static tokenizer_class=ke;static uses_processor_config=!0;constructor(e,t,r){
super(e,t,r),this.image_tag=this.config.image_tag,this.image_start_tag=this.config.image_start_tag,this.image_end_tag=this.
config.image_end_tag,this.num_image_tokens=this.config.num_image_tokens}async _call(e,{images:t=null,chat_template:r="de\
fault"}={}){t?Array.isArray(t)||(t=[t]):t=await Promise.all(e.filter(v=>v.images).flatMap(v=>v.images).map(v=>Mt.read(v)));
const n=this.tokenizer,s=n.apply_chat_template(e,{tokenize:!1,add_generation_prompt:!0,chat_template:r}),a=v=>n.encode(v,
{add_special_tokens:!1}),o=s.split(this.image_tag),i=o.length-1;if(t.length!==i)throw new Error(`Number of images provid\
ed (${t.length}) does not match number of "${this.image_tag}" image tags (${i})`);const[l,c,d]=n.convert_tokens_to_ids([
this.image_tag,this.image_start_tag,this.image_end_tag]);let h=a(o[0]),_=new Array(h.length).fill(!1);for(let v=1;v<o.length;++v){
const y=new Array(this.num_image_tokens).fill(l),b=a(o[v]);h=Dt(h,[c],y,[d],b);const k=new Array(this.num_image_tokens).
fill(!0);_=Dt(_,[!1],k,[!1],new Array(b.length).fill(!1))}const p=[1,h.length],w={input_ids:new G("int64",h,p),attention_mask:new G(
"int64",new Array(h.length).fill(1),p),images_seq_mask:new G("bool",_,p),images_emb_mask:new G("bool",new Array(i*this.num_image_tokens).
fill(!0),[1,i,this.num_image_tokens])};if(t&&t.length>0){const v=await this.image_processor(t);return v.pixel_values.unsqueeze_(
0),{...w,...v}}return w}},jA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;async _call(e=null,t=null,r={}){
if(!e&&!t)throw new Error("Either text or images must be provided");const n=e?this.tokenizer(e,r):{},s=t?await this.image_processor(
t,r):{};return{...n,...s}}},qA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;async _call(e,t=null,r={}){
const{image_rows:n,image_cols:s,image_sizes:a,...o}=await this.image_processor(e,{...r,return_row_col_info:!0});if(t){const i=this.
config.image_token??"<image>",{tile_size:l=512,downsample_factor:c=2,encoder_patch_size:d=16,use_thumbnail:h=!0}=this.image_processor.
config,_=k=>Math.ceil(Math.floor(k/d)/c),p=_(l)**2,w=this.config.image_start_token??"<|image_start|>",v=this.config.image_end_token??
"<|image_end|>",y=this.config.image_thumbnail??"<|img_thumbnail|>";Array.isArray(t)||(t=[t]);let b=0;t=t.map(k=>{const A=k.
split(i);return A[0]+A.slice(1).map(E=>{const C=b++,[N,M]=a[C],$=n[C],R=s[C],j=_(N)*_(M);let Y=w;if($>1||R>1){const Q=i.
repeat(p);for(let z=0;z<$;++z)for(let I=0;I<R;++I)Y+=`<|img_row_${z+1}_col_${I+1}|>`+Q;h&&(Y+=y+i.repeat(j))}else Y+=i.repeat(
j);return Y+v+E}).join("")})}return{...o,...t?this.tokenizer(t,r):{}}}},WA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;async _call(e,t=null,r={}){
const n=e?await this.image_processor(e,r):{};if(t!==null){Array.isArray(t)||(t=[t]);const s=this.tokenizer.config.image_token??
"<|image|>",a=n.image_grid_thw?.tolist()??[],o=t.reduce((c,d)=>c+d.split(s).length-1,0);if(o!==a.length)throw new Error(
`Found ${o} ${s} tokens in the text but received ${a.length} images.`);const i=this.image_processor.config.merge_size;let l=0;
t=t.map(c=>c.replaceAll(s,()=>{const d=Number(a[l++].reduce((h,_)=>h*_,1n));return s.repeat(d/i**2)}))}return{...n,...t!==
null?this.tokenizer(t,r):{}}}},HA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;static uses_processor_config=!0;async _call(e,t=null,r={}){
const n=await this.image_processor(e,r);if(t){const[a,o]=n.pixel_values.dims.slice(-2),{image_token:i,patch_size:l,num_additional_image_tokens:c}=this.
config,d=Math.floor(a/l)*Math.floor(o/l)+c;t=structuredClone(t),Array.isArray(t)||(t=[t]);for(let h=0;h<t.length;++h)t[h]=
t[h].replace(i,i.repeat(d))}const s=t?this.tokenizer(t,r):{};return{...n,...s}}},x_={char:["char_decode",1],bpe:["bpe_de\
code",2],wp:["wp_decode",102]},QA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;get char_tokenizer(){
return this.components.char_tokenizer}get bpe_tokenizer(){return this.components.bpe_tokenizer}get wp_tokenizer(){return this.
components.wp_tokenizer}_decode_helper(e,t){if(!x_.hasOwnProperty(t))throw new Error(`Format ${t} is not supported.`);const[
r,n]=x_[t],s=this[r].bind(this),[a,o]=e.dims,i=[],l=[],c=e.tolist();for(let h=0;h<a;++h){const _=c[h],p=[],w=[];for(let y=1;y<
o;++y){const[b,k]=We(nt(_[y]));if(w.push(b),k==n)break;p.push(k)}const v=w.length>0?w.reduce((y,b)=>y*b,1):0;l.push(p),i.
push(v)}return[s(l),i]}char_decode(e){return this.char_tokenizer.batch_decode(e).map(t=>t.replaceAll(" ",""))}bpe_decode(e){
return this.bpe_tokenizer.batch_decode(e)}wp_decode(e){return this.wp_tokenizer.batch_decode(e).map(t=>t.replaceAll(" ",
""))}batch_decode([e,t,r]){const[n,s]=this._decode_helper(e,"char"),[a,o]=this._decode_helper(t,"bpe"),[i,l]=this._decode_helper(
r,"wp"),c=[],d=[];for(let h=0;h<n.length;++h){const[_,p]=We([s[h],o[h],l[h]]);c.push([n[h],a[h],i[h]][p]),d.push(_)}return{
generated_text:c,scores:d,char_preds:n,bpe_preds:a,wp_preds:i}}static async from_pretrained(...e){const t=await super.from_pretrained(
...e),r=await ke.from_pretrained("Xenova/gpt2"),n=await ke.from_pretrained("Xenova/bert-base-uncased");return t.components=
{image_processor:t.image_processor,char_tokenizer:t.tokenizer,bpe_tokenizer:r,wp_tokenizer:n},t}async _call(e,t=null){const r=await this.
image_processor(e);return t&&(r.labels=this.tokenizer(t).input_ids),r}},XA=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},YA=class extends Te{static tokenizer_class=ke;static image_processor_class=at},
fn="<image>";function KA(e,t,r,n,s){return`${n.repeat(r*s)}${t}${e}
`}var JA=class extends Te{static tokenizer_class=ke;static image_processor_class=at;static uses_processor_config=!1;async _call(e,t=null,r={}){
t||(de.warn("You are using PaliGemma without a text prefix. It will perform as a picture-captioning model."),t=""),Array.
isArray(e)||(e=[e]),Array.isArray(t)||(t=[t]);const n=this.tokenizer.bos_token,s=this.image_processor.config.image_seq_length;
let a;t.some(l=>l.includes(fn))?a=t.map(l=>{const c=l.replaceAll(fn,fn.repeat(s)),d=c.lastIndexOf(fn),h=d===-1?0:d+fn.length;
return c.slice(0,h)+n+c.slice(h)+`
`}):(de.warn("You are passing both `text` and `images` to `PaliGemmaProcessor`. The processor expects special image toke\
ns in the text, as many tokens as there are images per each text. It is recommended to add `<image>` tokens in the very \
beginning of your text. For this call, we will infer how many images each text has and add special tokens."),a=t.map(l=>KA(
l,n,s,fn,e.length)));const o=this.tokenizer(a,r);return{...await this.image_processor(e,r),...o}}},k_="<|image|>",ZA=/<\|image_\d+\|>/g,
eC=class extends Te{static image_processor_class=at;static tokenizer_class=ke;async _call(e,t=null,{padding:r=!0,truncation:n=!0,
num_crops:s=null}={}){Array.isArray(e)||(e=[e]);let a,o;if(t){o=await this.image_processor(t,{num_crops:s});const{num_img_tokens:i}=o,
l=e.map((d,h)=>d.split(ZA).join(k_.repeat(i[h])));a=this.tokenizer(l,{padding:r,truncation:n});const c=this.tokenizer._tokenizer.
token_to_id(k_);a.input_ids.map_(d=>d==c?-d:d)}else a=this.tokenizer(e);return{...a,...o}}},tC=class extends Te{static tokenizer_class=ke;static image_processor_class=at;static uses_processor_config=!0;async _call(e,t=null,r={}){
const n=await this.image_processor(e,r);if(t){const[a,o]=n.pixel_values.dims.slice(-2),{image_token:i,image_break_token:l,
image_end_token:c,patch_size:d,spatial_merge_size:h}=this.config,_=d*h,p=Math.floor(a/_),w=Math.floor(o/_);t=structuredClone(
t),Array.isArray(t)||(t=[t]);for(let v=0;v<t.length;++v){const y=i.repeat(w),b=y+l,k=y+c,A=b.repeat(p-1)+k;t[v]=t[v].replace(
i,A)}}const s=t?this.tokenizer(t,r):{};return{...n,...s}}},rC=class extends Te{static feature_extractor_class=zm;async _call(e){
return await this.feature_extractor(e)}post_process_speaker_diarization(...e){return this.feature_extractor.post_process_speaker_diarization(
...e)}get sampling_rate(){return this.feature_extractor.config.sampling_rate}},ag=class extends yl{},nC=class extends ag{},
og=class extends Te{static image_processor_class=at;async _call(...e){return await this.image_processor(...e)}post_process_masks(...e){
return this.image_processor.post_process_masks(...e)}reshape_input_points(...e){return this.image_processor.reshape_input_points(
...e)}},ig=class extends og{},sC=class extends ig{},aC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},oC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!0;async _call(e,t=null,r={}){
if(Array.isArray(e))throw new Error("Batched inputs are not supported yet.");let n={};if(t){const a=t.length,{input_features:o}=await this.
feature_extractor(t,{...r,max_length:a}),i=Math.round(a/this.config.encoder_ds_factor+1e-4),l=1+Math.ceil(i/this.config.
stack_factor);n.audio_token_len=[l],n.audio_values=o;const c=this.config.audio_placeholder;if(!e.includes(c))throw new Error(
`The input text does not contain the image token ${c}.`);e=e.replaceAll(c,c.repeat(l))}return{...this.tokenizer(e,{add_special_tokens:!1,
...r}),...n}}},Ks="[AUDIO]",iC="[BEGIN_AUDIO]",lC=375;function cC(e,t){const r=[];for(let n=0;n<e.length;n+=t)r.push(e.subarray(
n,Math.min(n+t,e.length)));return r}var uC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!1;async _call(e,t=null,r={}){
if(Array.isArray(e))throw new Error("Batched inputs are not supported yet.");const n={};if(t){if(!e.includes(Ks))throw new Error(
`The input text does not contain the audio token ${Ks}.`);Array.isArray(t)||(t=[t]);const a=e.split(Ks),o=a.length-1;if(o!==
t.length)throw new Error(`The number of audio inputs (${t.length}) does not match the number of audio tokens in the text\
 (${o}).`);const i=this.feature_extractor.config.n_samples,l=t.map(p=>cC(p,i)),c=l.map(p=>p.length),d=l.flat(),h=(await Promise.
all(d.map(p=>this.feature_extractor(p,r)))).map(p=>p.input_features);n.audio_values=h.length>1?Oe(h,0):h[0];let _=a[0];for(let p=0;p<
c.length;++p){_+=iC;for(let w=0;w<c[p];++w)_+=Ks.repeat(lC);_+=a[p+1]}e=_}return{...this.tokenizer(e,{add_special_tokens:!1,
...r}),...n}}},T_=32,ui=6,Js=8,dC=10,hC=32,fC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;static uses_processor_config=!1;get num_mel_frames_first_audio_chunk(){
return(ui+1)*Js}get num_samples_first_audio_chunk(){const{hop_length:e,n_fft:t}=this.feature_extractor.config;return(this.
num_mel_frames_first_audio_chunk-1)*e+Math.floor(t/2)}get num_samples_per_audio_chunk(){const{hop_length:e,n_fft:t}=this.
feature_extractor.config;return Js*e+t}get num_right_pad_tokens(){return ui+1+dC}get audio_length_per_tok(){return Js}get raw_audio_length_per_tok(){
return Js*this.feature_extractor.config.hop_length}async _call(e,{is_streaming:t=!1,is_first_audio_chunk:r=!0}={}){if(st(
e,"VoxtralRealtimeProcessor"),!t&&!r)throw new Error("In non-streaming mode (`is_streaming=false`), `is_first_audio_chun\
k` must be `true`.");if(r)if(t){const n=T_*this.raw_audio_length_per_tok,s=new Float32Array(n+e.length);s.set(e,n);const a=await this.
feature_extractor(s,{center:!0}),i=1+(T_+ui),l=new BigInt64Array(i).fill(BigInt(hC));return l[0]=1n,{input_ids:new G("in\
t64",l,[1,i]),...a}}else{const n=this.num_right_pad_tokens*this.raw_audio_length_per_tok,s=new Float32Array(e.length+n);
return s.set(e),await this.feature_extractor(s,{center:!0})}else return await this.feature_extractor(e,{center:!1})}},_C=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},pC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},mC=class extends Te{static tokenizer_class=ke;static feature_extractor_class=St;async _call(e){
return await this.feature_extractor(e)}},gC=class{static async from_pretrained(e,t={}){const r=await tr(e,cs,!0,t),{image_processor_type:n,
feature_extractor_type:s,processor_class:a}=r;if(a&&ki[a])return ki[a].from_pretrained(e,t);if(!n&&!s)throw new Error("N\
o `image_processor_type` or `feature_extractor_type` found in the config.");const o={};if(n){const l=xa[n.replace(/Fast$/,
"")];if(!l)throw new Error(`Unknown image_processor_type: '${n}'.`);o.image_processor=new l(r)}if(s){const l=xa[s];if(l)
o.image_processor=new l(r);else{const c=fl[s];if(!c)throw new Error(`Unknown feature_extractor_type: '${s}'.`);o.feature_extractor=
new c(r)}}const i={};return new Te(i,o,null)}};async function wC(e,t){return await tr(e,"config.json",!0,t)}function pn(e){
const t={};let r={};switch(e.model_type){case"llava":case"paligemma":case"gemma3":case"florence2":case"llava_onevision":case"\
idefics3":case"granite_speech":case"ultravox":case"voxtral":case"voxtral_realtime":case"smolvlm":case"gemma3n":case"gemm\
a4":case"lfm2_vl":case"lfm3_vl":case"chatterbox":case"lighton_ocr":case"glm_ocr":case"mistral3":case"qwen2_5_vl":case"qw\
en3_vl":case"qwen3_vl_moe":r=pn(e.text_config);break;case"moondream1":r=pn(e.phi_config);break;case"musicgen":r=pn(e.decoder);
break;case"multi_modality":r=pn(e.language_config);break;case"gpt2":case"gptj":case"jais":case"codegen":case"gpt_bigcode":
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
t.decoder_hidden_size="hidden_size",t.decoder_dim_kv="head_dim";const{num_hidden_layers:s,num_attention_heads:a,hidden_size:o}=e.
encoder_config;r={num_encoder_layers:s,num_encoder_heads:a,encoder_hidden_size:o,encoder_dim_kv:e.head_dim};break;case"v\
ision-encoder-decoder":const i=pn(e.decoder),l="num_decoder_layers"in i,c=Ze(e,["model_type","is_encoder_decoder"]);return l?
(c.num_decoder_layers=i.num_decoder_layers,c.num_decoder_heads=i.num_decoder_heads,c.decoder_hidden_size=i.decoder_hidden_size,
c.num_encoder_layers=i.num_encoder_layers,c.num_encoder_heads=i.num_encoder_heads,c.encoder_hidden_size=i.encoder_hidden_size):
(c.num_layers=i.num_layers,c.num_heads=i.num_heads,c.hidden_size=i.hidden_size),c}const n={...r,...Ze(e,["model_type","m\
ulti_query","is_encoder_decoder"])};for(const s in t)n[s]=e[t[s]];return n}function Oa(e,t){e instanceof Ei||(e=new Ei(e));
const r=t?.prefix??"past_key_values",n=r==="present"?"present":"past",s=new Set;if(["lfm2","lfm2_moe","lfm3"].includes(e.
model_type)){const{layer_types:a}=e;for(let o=0;o<a.length;++o)if(a[o]==="full_attention"||a[o]==="sliding_attention")s.
add(`${r}.${o}.key`),s.add(`${r}.${o}.value`);else if(a[o]==="conv")s.add(`${n}_conv.${o}`);else throw new Error(`Unsupp\
orted layer type: ${a[o]}`);return s}else if(["granitemoehybrid","falcon_h1","nemotron_h"].includes(e.model_type)){const a=e,
o=a.layer_types??a.layers_block_type,i=a.num_hidden_layers??o?.length;for(let l=0;l<i;++l)(!o||o[l]==="mamba")&&(s.add(`${n}\
_conv.${l}`),s.add(`${n}_ssm.${l}`)),(!o||o[l]==="attention")&&(s.add(`${r}.${l}.key`),s.add(`${r}.${l}.value`));return s}else if([
"qwen3_next","qwen3_5_text","qwen3_5_moe_text","olmo_hybrid"].includes(e.model_type)){const{layer_types:a}=e;for(let o=0;o<
a.length;++o)if(a[o]==="full_attention")s.add(`${r}.${o}.key`),s.add(`${r}.${o}.value`);else if(a[o]==="linear_attention")
e.model_type==="olmo_hybrid"?(s.add(`${n}_conv.${o}.key`),s.add(`${n}_conv.${o}.value`),s.add(`${n}_conv.${o}.query`)):s.
add(`${n}_conv.${o}`),s.add(`${n}_recurrent.${o}`);else throw new Error(`Unsupported layer type: ${a[o]}`);return s}else if([
"gemma4","gemma4_text"].includes(e.model_type)){const a=e.model_type==="gemma4"?e.text_config:e,o=a.num_hidden_layers,i=a.
num_kv_shared_layers??0,l=o-i;for(let c=0;c<l;++c)s.add(`${r}.${c}.key`),s.add(`${r}.${c}.value`);return s}else if(e.model_type===
"deepseek_v4"){const{layer_types:a,num_hidden_layers:o}=e;for(let i=0;i<o;++i){s.add(`${r}.${i}.key`),s.add(`${r}.${i}.v\
alue`);const l=a[i];if(l==="compressed_sparse_attention")s.add(`${n}_compressor.${i}.kv`),s.add(`${n}_compressor.${i}.ga\
te`),s.add(`${n}_indexer.${i}.kv`),s.add(`${n}_indexer.${i}.gate`);else if(l==="heavily_compressed_attention")s.add(`${n}\
_compressor.${i}.kv`),s.add(`${n}_compressor.${i}.gate`);else if(l&&l!=="sliding_attention")throw new Error(`Unsupported\
 layer type: ${l}`)}return s}else if(e.model_type==="zaya"){const{num_hidden_layers:a,cca_time1:o}=e,i=o??1;for(let l=0;l<
a;l+=i)s.add(`${r}.${l}.key`),s.add(`${r}.${l}.value`),s.add(`${r}.${l}.conv_state`),s.add(`${r}.${l}.shift_state`);return s}else if([
"lfm2_vl","lfm3_vl","qwen3_5","qwen3_5_moe","voxtral_realtime"].includes(e.model_type)){let a;return e.model_type==="vox\
tral_realtime"&&t?.session_name==="audio_encoder"?a=e.audio_config:a=e.text_config,Oa(a,t)}return vC(e,{prefix:r})}function vC(e,{
prefix:t="past_key_values"}={}){const r=new Set,n=e.normalized_config;if(n.is_encoder_decoder&&"num_encoder_heads"in n&&
"num_decoder_heads"in n)for(let s=0;s<n.num_decoder_layers;++s)r.add(`${t}.${s}.encoder.key`),r.add(`${t}.${s}.encoder.v\
alue`),r.add(`${t}.${s}.decoder.key`),r.add(`${t}.${s}.decoder.value`);else if(n.multi_query)for(let s=0;s<n.num_layers;++s)
r.add(`${t}.${s}.key_value`);else for(let s=0;s<n.num_layers;++s)r.add(`${t}.${s}.key`),r.add(`${t}.${s}.value`);return r}
var Ei=class Ai{model_type=null;is_encoder_decoder=!1;max_position_embeddings;"transformers.js_config";constructor(t){Object.
assign(this,t),this.normalized_config=pn(this)}static async from_pretrained(t,{progress_callback:r=null,config:n=null,cache_dir:s=null,
local_files_only:a=!1,revision:o="main"}={}){n&&!(n instanceof Ai)&&(n=new Ai(n));const i=n??await wC(t,{progress_callback:r,
config:n,cache_dir:s,local_files_only:a,revision:o});return new this(i)}},us=class{static async from_pretrained(...e){return Ei.
from_pretrained(...e)}};function lg(e,t,r){return e?typeof e=="object"&&e!==null?e.hasOwnProperty(t)?+e[t]:e.hasOwnProperty(
r)?+e[r]:0:+e:0}function cg(e,t){const r=[];for(let n=0;n<t;++n)r.push(`${e}_data${n===0?"":"_"+n}`);return r}async function yC(e,t,r,n){
const s=`${t}${n}.onnx`,a=`${r.subfolder??""}/${s}`;return await Ma(e,a,!0,r,fe.IS_NODE_ENV)}async function bC(e,t,r,n,s,a={}){
const o=`${t}${r}.onnx`,i=fe.IS_NODE_ENV;let l=[];const c=lg(s,o,t);if(c>0){if(c>n_)throw new Error(`The number of exter\
nal data chunks (${c}) exceeds the maximum allowed value (${n_}).`);const d=cg(o,c);for(const h of d){const _=`${n.subfolder??
""}/${h}`;l.push(Ma(e,_,!0,n,i).then(p=>p instanceof Uint8Array?{path:h,data:p}:h))}}else a.externalData!==void 0&&(l=a.
externalData.map(async d=>{if(typeof d.data=="string"){const h=await Ma(e,d.data,!0,n);return{...d,data:h}}return d}));return Promise.
all(l)}async function MC(e,t,r,n=!1,s=void 0){let a=r.config?.["transformers.js_config"]??{};const o=mm(r.device??a.device,
t,{warn:k=>de.info(k)}),i=jT(o),l=a.device_config??{};l.hasOwnProperty(o)&&(a={...a,...l[o]});const c=gm(r.dtype??a.dtype,
t,o,{configDtype:a.dtype,warn:k=>de.info(k)});if(is.hasOwnProperty(c)){if(o==="webgpu"&&!fe.IS_NODE_ENV&&c===Qe.fp16&&!await HT())
throw new Error(`The device (${o}) does not support fp16.`)}else throw new Error(`Invalid dtype: ${c}. Should be one of:\
 ${Object.keys(Qe).join(", ")}`);const d=is[c],h={...r.session_options};h.executionProviders??=i;const _=a.free_dimension_overrides;
_?h.freeDimensionOverrides??=_:o.startsWith("webnn")&&!h.freeDimensionOverrides&&de.warn(`WebNN does not currently suppo\
rt dynamic shapes and requires 'free_dimension_overrides' to be set in config.json, preferably as a field within config[\
"transformers.js_config"]["device_config"]["${o}"]. When 'free_dimension_overrides' is not set, you may experience signi\
ficant performance degradation.`);const p=yC(e,t,r,d),w=r.use_external_data_format??a.use_external_data_format,v=await bC(
e,t,d,r,w,h);if(v.length>0&&(!fe.IS_NODE_ENV||v.some(k=>typeof k!="string"))&&(h.externalData=v),n&&o==="webgpu"){const k=Oa(
r.config,{prefix:"present",session_name:s});if(k.size>0&&!al()){const A={};for(const E of k)A[E]="gpu-buffer";h.preferredOutputLocation=
A}}return{buffer_or_path:await p,session_options:h,session_config:{dtype:c,device:o}}}async function xC(e,t,r,n=void 0){
return Object.fromEntries(await Promise.all(Object.keys(t).map(async s=>{const a=n?.[s]??!1,{buffer_or_path:o,session_options:i,
session_config:l}=await MC(e,t[s],r,a,s),c=await fm(o,i,l);return[s,c]})))}function ug(e){for(let t in e)pm(e[t])?e[t]=new G(
e[t]):typeof e[t]=="object"&&ug(e[t]);return e}async function ve(e,t){const r=kC(e,t);try{const n=Object.fromEntries(Object.
entries(r).map(([a,o])=>{const i=o.ort_tensor;return fe.IS_NODE_ENV&&typeof Float16Array<"u"&&i.cpuData instanceof Float16Array&&
(i.cpuData=new Uint16Array(i.cpuData.buffer)),[a,i]})),s=await _m(e,n);return ug(s)}catch(n){const s=Object.fromEntries(
Object.entries(r).map(([a,o])=>{const i={type:o.type,dims:o.dims,location:o.location};return i.location!=="gpu-buffer"&&
(i.data=o.data),[a,i]}));throw de.error(`An error occurred during model execution: "${n}".`),de.error("Inputs given to m\
odel:",s),n}}function kC(e,t){const r=Object.create(null),n=[];for(const o of e.inputNames){const i=t[o];if(!(i instanceof
G)){n.push(o);continue}r[o]=al()?i.clone():i}if(n.length>0)throw new Error(`An error occurred during model execution: "M\
issing the following inputs: ${n.join(", ")}.`);const s=Object.keys(t).length,a=e.inputNames.length;if(s>a){let o=Object.
keys(t).filter(i=>!e.inputNames.includes(i));de.warn(`WARNING: Too many inputs were provided (${s} > ${a}). The followin\
g inputs will be ignored: "${o.join(", ")}".`)}return r}var Ve=class{},TC=class extends Ve{constructor({last_hidden_state:e,
hidden_states:t=null,attentions:r=null}){super(),this.last_hidden_state=e,this.hidden_states=t,this.attentions=r}},ie=class extends Ve{constructor({
logits:e,...t}){super(),this.logits=e;const r=Object.values(t);r.length>0&&(this.attentions=r)}},He=class extends Ve{constructor({
logits:e}){super(),this.logits=e}},Xe=class extends Ve{constructor({logits:e}){super(),this.logits=e}},ot=class extends Ve{constructor({
start_logits:e,end_logits:t}){super(),this.start_logits=e,this.end_logits=t}},Pr=class extends Ve{constructor({logits:e}){
super(),this.logits=e}},EC=class extends Ve{constructor({logits:e,past_key_values:t}){super(),this.logits=e,this.past_key_values=
t}},AC=class extends Ve{constructor({logits:e,past_key_values:t,encoder_outputs:r,decoder_attentions:n=null,cross_attentions:s=null}){
super(),this.logits=e,this.past_key_values=t,this.encoder_outputs=r,this.decoder_attentions=n,this.cross_attentions=s}},
dg=class extends Ve{constructor({alphas:e}){super(),this.alphas=e}},jt=class extends ft{_call(e,t){throw Error("`_call` \
should be implemented in a subclass")}},bl=class extends ft{_call(e,t){throw Error("`_call` should be implemented in a s\
ubclass")}},Ci=class extends ft{constructor(){super(),this.processors=[]}push(e){this.processors.push(e)}extend(e){this.
processors.push(...e)}_call(e,t){let r=t;for(const n of this.processors)r=n(e,r);return r}[Symbol.iterator](){return this.
processors.values()}},CC=class extends jt{constructor(e){super(),this.bos_token_id=e}_call(e,t){for(let r=0;r<e.length;++r)
if(e[r].length===1){const n=t[r].data;n.fill(-1/0),n[this.bos_token_id]=0}return t}},SC=class extends jt{constructor(e,t){
super(),this.max_length=e,this.eos_token_id=Array.isArray(t)?t:[t]}_call(e,t){for(let r=0;r<e.length;++r)if(e[r].length===
this.max_length-1){const n=t[r].data;n.fill(-1/0);for(const s of this.eos_token_id)n[s]=0}return t}},PC=class extends jt{constructor(e){
super(),this.suppress_tokens=e}_call(e,t){for(let r=0;r<e.length;++r){const n=t[r].data;for(const s of this.suppress_tokens)
n[s]=-1/0}return t}},hg=class extends jt{constructor(e,t){super(),this.begin_suppress_tokens=e,this.begin_index=t}_call(e,t){
for(let r=0;r<e.length;++r)if(e[r].length===this.begin_index){const n=t[r].data;for(const s of this.begin_suppress_tokens)
n[s]=-1/0}return t}},FC=class extends jt{constructor(e,t){super(),this.eos_token_id=Array.isArray(e.eos_token_id)?e.eos_token_id[0]:
e.eos_token_id,this.no_timestamps_token_id=e.no_timestamps_token_id,this.timestamp_begin=this.no_timestamps_token_id+1,this.
begin_index=t.length,t.at(-1)===this.no_timestamps_token_id&&(this.begin_index-=1),this.max_initial_timestamp_index=e.max_initial_timestamp_index}_call(e,t){
for(let r=0;r<e.length;++r){const n=t[r].data;if(n[this.no_timestamps_token_id]=-1/0,e[r].length===this.begin_index){n.subarray(
0,this.timestamp_begin).fill(-1/0);continue}const s=e[r].slice(this.begin_index),a=s.length>=1&&s[s.length-1]>=this.timestamp_begin,
o=s.length<2||s[s.length-2]>=this.timestamp_begin;if(a&&(o?n.subarray(this.timestamp_begin).fill(-1/0):n.subarray(0,this.
eos_token_id).fill(-1/0)),e[r].length===this.begin_index&&this.max_initial_timestamp_index!==null){const d=this.timestamp_begin+
this.max_initial_timestamp_index;n.subarray(d+1).fill(-1/0)}const i=ST(n),l=Math.log(i.subarray(this.timestamp_begin).map(
Math.exp).reduce((d,h)=>d+h)),c=We(i.subarray(0,this.timestamp_begin))[0];l>c&&n.subarray(0,this.timestamp_begin).fill(-1/0)}
return t}},IC=class extends jt{constructor(e){super(),this.no_repeat_ngram_size=e}getNgrams(e){const t=e.length,r=[];for(let s=0;s<
t+1-this.no_repeat_ngram_size;++s){const a=[];for(let o=0;o<this.no_repeat_ngram_size;++o)a.push(e[s+o]);r.push(a.map(Number))}
const n=new Map;for(const s of r){const a=s.slice(0,s.length-1),o=JSON.stringify(a),i=n.get(o)??[];i.push(s[s.length-1]),
n.set(o,i)}return n}getGeneratedNgrams(e,t){const r=t.slice(t.length+1-this.no_repeat_ngram_size,t.length);return e.get(
JSON.stringify(r.map(Number)))??[]}calcBannedNgramTokens(e){const t=[];if(e.length+1<this.no_repeat_ngram_size)return t;
{const r=this.getNgrams(e);return this.getGeneratedNgrams(r,e)}}_call(e,t){for(let r=0;r<e.length;++r){const n=t[r].data,
s=this.calcBannedNgramTokens(e[r]);for(const a of s)n[a]=-1/0}return t}},LC=class extends jt{constructor(e){super(),this.
penalty=e}_call(e,t){for(let r=0;r<e.length;++r){const n=t[r].data;for(const s of new Set(e[r])){const a=Number(s);n[a]<
0?n[a]*=this.penalty:n[a]/=this.penalty}}return t}},OC=class extends jt{constructor(e,t){super(),this.min_length=e,this.
eos_token_id=Array.isArray(t)?t:[t]}_call(e,t){for(let r=0;r<e.length;++r)if(e[r].length<this.min_length){const n=t[r].data;
for(const s of this.eos_token_id)n[s]=-1/0}return t}},NC=class extends jt{constructor(e,t,r){super(),this.prompt_length_to_skip=
e,this.min_new_tokens=t,this.eos_token_id=Array.isArray(r)?r:[r]}_call(e,t){for(let r=0;r<e.length;++r)if(e[r].length-this.
prompt_length_to_skip<this.min_new_tokens){const s=t[r].data;for(const a of this.eos_token_id)s[a]=-1/0}return t}},DC=class extends jt{constructor(e,t){
super(),this.bad_words_ids=e,this.eos_token_id=Array.isArray(t)?t:[t]}_call(e,t){for(let r=0;r<e.length;++r){const n=t[r].
data,s=e[r];for(const a of this.bad_words_ids){if(s.length<a.length-1)continue;let o=!0;for(let i=1;i<=a.length-1;++i)if(a.
at(-i-1)!=s.at(-i)){o=!1;break}o&&(n[a.at(-1)]=-1/0)}}return t}},zC=class extends jt{constructor(e){if(super(),e<=1)throw new Error(
`Require guidance scale >1 to use the classifier-free guidance processor, got guidance scale ${e}.`);this.guidance_scale=
e}_call(e,t){if(t.dims[0]!==2*e.length)throw new Error(`Logits should have twice the batch size of the input ids, the fi\
rst half of batches corresponding to the conditional inputs, and the second half of batches corresponding to the uncondi\
tional inputs. Got batch size ${t.dims[0]} for the logits and ${e.length} for the input ids.`);const r=e.length,n=t.slice(
[0,r],null),s=t.slice([r,t.dims[0]],null);for(let a=0;a<s.data.length;++a)s.data[a]+=(n.data[a]-s.data[a])*this.guidance_scale;
return s}},BC=class extends bl{constructor(e){super(),this.temperature=e}_call(e,t){const r=t.data;for(let n=0;n<r.length;++n)
r[n]/=this.temperature;return t}},dz=class extends bl{constructor(e,{filter_value:t=-1/0,min_tokens_to_keep:r=1}={}){if(super(),
e<0||e>1)throw new Error(`\`top_p\` must be a float > 0 and < 1, but is ${e}`);if(!Number.isInteger(r)||r<1)throw new Error(
`\`min_tokens_to_keep\` must be a positive integer, but is ${r}`);this.top_p=e,this.filter_value=t,this.min_tokens_to_keep=
r}},hz=class extends bl{constructor(e,{filter_value:t=-1/0,min_tokens_to_keep:r=1}={}){if(super(),!Number.isInteger(e)||
e<0)throw new Error(`\`top_k\` must be a positive integer, but is ${e}`);this.top_k=Math.max(e,r),this.filter_value=t}},
fg=class{max_length=20;max_new_tokens=null;min_length=0;min_new_tokens=null;early_stopping=!1;max_time=null;do_sample=!1;num_beams=1;num_beam_groups=1;penalty_alpha=null;use_cache=!0;temperature=1;top_k=50;top_p=1;typical_p=1;epsilon_cutoff=0;eta_cutoff=0;diversity_penalty=0;repetition_penalty=1;encoder_repetition_penalty=1;length_penalty=1;no_repeat_ngram_size=0;bad_words_ids=null;force_words_ids=null;renormalize_logits=!1;constraints=null;forced_bos_token_id=null;forced_eos_token_id=null;remove_invalid_values=!1;exponential_decay_length_penalty=null;suppress_tokens=null;streamer=null;begin_suppress_tokens=null;forced_decoder_ids=null;guidance_scale=null;num_return_sequences=1;output_attentions=!1;output_hidden_states=!1;output_scores=!1;return_dict_in_generate=!1;pad_token_id=null;bos_token_id=null;eos_token_id=null;encoder_no_repeat_ngram_size=0;decoder_start_token_id=null;generation_kwargs={};constructor(e){
Object.assign(this,Ze(e,Object.getOwnPropertyNames(this)))}},gs=class extends ft{_call(e,t){throw Error("StoppingCriteri\
a needs to be subclassed")}},_g=class pg extends ft{constructor(){super(),this.criteria=[]}push(t){this.criteria.push(t)}extend(t){
t instanceof pg?t=t.criteria:t instanceof gs&&(t=[t]),this.criteria.push(...t)}_call(t,r){const n=new Array(t.length).fill(
!1);for(const s of this.criteria){const a=s(t,r);for(let o=0;o<n.length;++o)n[o]||=a[o]}return n}[Symbol.iterator](){return this.
criteria.values()}},RC=class extends gs{constructor(e,t=null){super(),this.max_length=e,this.max_position_embeddings=t}_call(e){
return e.map(t=>t.length>=this.max_length)}},$C=class extends gs{constructor(e){super(),Array.isArray(e)||(e=[e]),this.eos_token_id=
e}_call(e,t){return e.map(r=>{const n=r.at(-1);return this.eos_token_id.some(s=>n==s)})}},fz=class extends gs{constructor(){
super(),this.interrupted=!1}interrupt(){this.interrupted=!0}reset(){this.interrupted=!1}_call(e,t){return new Array(e.length).
fill(this.interrupted)}},Na=class extends ft{constructor(e){super(),this.generation_config=e}async _call(e){return this.
sample(e)}async sample(e){throw Error("sample should be implemented in subclasses.")}getLogits(e,t){let r=e.dims.at(-1),
n=e.data;if(t===-1)n=n.slice(-r);else{let s=t*r;n=n.slice(s,s+r)}return n}randomSelect(e){return hT(e)}static getSampler(e){
if(e.do_sample)return new VC(e);if(e.num_beams>1)return new UC(e);if(e.num_return_sequences>1)throw Error(`num_return_se\
quences has to be 1 when doing greedy search, but is ${e.num_return_sequences}.`);return new GC(e)}},GC=class extends Na{async sample(e){
const t=We(e.data)[1];return[[BigInt(t),0]]}},VC=class extends Na{async sample(e){let t=e.dims.at(-1);this.generation_config.
top_k>0&&(t=Math.min(this.generation_config.top_k,t));const[r,n]=await Cn(e,t),s=nt(r.data);return Array.from({length:this.
generation_config.num_beams},()=>{const a=this.randomSelect(s);return[n.data[a],Math.log(s[a])]})}},UC=class extends Na{async sample(e){
let t=e.dims.at(-1);this.generation_config.top_k>0&&(t=Math.min(this.generation_config.top_k,t));const[r,n]=await Cn(e,t),
s=nt(r.data);return Array.from({length:this.generation_config.num_beams},(a,o)=>[n.data[o],Math.log(s[o])])}},jC=class{constructor(e){
if(e)for(const t in e){if(t in this)throw new TypeError(`Key "${t}" conflicts with an existing property on DynamicCache`);
const r=e[t];if(!(r instanceof G))throw new TypeError(`Expected a Tensor for key "${t}", got ${typeof r}`);this[t]=r}}get_seq_length(){
const e=this;if(Object.keys(e).length===0)return 0;for(const t in e)if(t.startsWith("past_key_values."))return e[t].dims.
at(-2);throw new Error("Unable to determine sequence length from the cache.")}update(e){for(const t in e){const r=this[t],
n=e[t];r&&r!==n&&r.location==="gpu-buffer"&&r.dispose(),this[t]=n}}async dispose(){const e=[];for(const t of Object.values(
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
const n={...lr[W.ImageTextToText].text_only_sessions};return r||(n.vision_encoder="vision_encoder"),e.is_encoder_decoder&&
(n.model="encoder_model"),n},cache_sessions:{decoder_model_merged:!0},optional_configs:{generation_config:"generation_co\
nfig.json"}},[W.AudioTextToText]:{text_only_sessions:{embed_tokens:"embed_tokens",decoder_model_merged:"decoder_model_me\
rged"},sessions:(e,t,r)=>{const n={...lr[W.AudioTextToText].text_only_sessions};return r||(n.audio_encoder="audio_encode\
r"),n},cache_sessions:{decoder_model_merged:!0},optional_configs:{generation_config:"generation_config.json"}},[W.ImageAudioTextToText]:{
text_only_sessions:{embed_tokens:"embed_tokens",decoder_model_merged:"decoder_model_merged"},sessions:(e,t,r)=>{const n={
...lr[W.ImageAudioTextToText].text_only_sessions};return r||(n.audio_encoder="audio_encoder",n.vision_encoder="vision_en\
coder"),n},cache_sessions:{decoder_model_merged:!0},optional_configs:{generation_config:"generation_config.json"}},[W.Phi3V]:{
sessions:()=>({prepare_inputs_embeds:"prepare_inputs_embeds",model:"model",vision_encoder:"vision_encoder"}),cache_sessions:{
model:!0},optional_configs:{generation_config:"generation_config.json"}},[W.MultiModality]:{sessions:()=>({prepare_inputs_embeds:"\
prepare_inputs_embeds",model:"language_model",lm_head:"lm_head",gen_head:"gen_head",gen_img_embeds:"gen_img_embeds",image_decode:"\
image_decode"}),cache_sessions:{model:!0},optional_configs:{generation_config:"generation_config.json"}},[W.AutoEncoder]:{
sessions:()=>({encoder_model:"encoder_model",decoder_model:"decoder_model"})},[W.Supertonic]:{sessions:()=>({text_encoder:"\
text_encoder",latent_denoiser:"latent_denoiser",voice_decoder:"voice_decoder"})},[W.Chatterbox]:{sessions:()=>({embed_tokens:"\
embed_tokens",speech_encoder:"speech_encoder",model:"language_model",conditional_decoder:"conditional_decoder"}),cache_sessions:{
model:!0},optional_configs:{generation_config:"generation_config.json"}},[W.VoxtralRealtime]:{text_only_sessions:{embed_tokens:"\
embed_tokens",decoder_model_merged:"decoder_model_merged"},sessions:(e,t,r)=>{const n={...lr[W.VoxtralRealtime].text_only_sessions};
return r||(n.audio_encoder="audio_encoder"),n},cache_sessions:{decoder_model_merged:!0,audio_encoder:!0},optional_configs:{
generation_config:"generation_config.json"}},[W.MultimodalEncoder]:{sessions:(e,t)=>({model:t.model_file_name??"model",...e.
vision_config&&{vision_encoder:"vision_encoder"},...e.audio_config&&{audio_encoder:"audio_encoder"}})},default:{sessions:(e,t)=>({
model:t.model_file_name??"model"})}};function qC(e){return lr[e]?.text_only_sessions??null}function mg(e,t,r={}){const n=lr[e]??
lr.default;return{sessions:n.sessions(t,r,r.textOnly??!1),cache_sessions:n.cache_sessions,optional_configs:n.optional_configs}}
function xl(e,{warn:t=!0}={}){const r=e.architectures||[];for(const n of r){const s=cr.get(n);if(s!==void 0)return s}if(e.
model_type){const n=cr.get(e.model_type);if(n!==void 0)return n;for(const s of Object.values(gn))if(s.has(e.model_type)){
const a=cr.get(s.get(e.model_type));if(a!==void 0)return a}}if(t){const n=r.length>0?r.join(", "):"(none)";de.warn(`[res\
olve_model_type] Architecture(s) not found in MODEL_TYPE_MAPPING: [${n}] for model type '${e.model_type}'. Falling back \
to EncoderOnly (single model.onnx file). If you encounter issues, please report at: ${Ia}`)}return W.EncoderOnly}function kl(e,{
config:t=null,cache_dir:r=null,local_files_only:n=!1,revision:s="main"}={}){if(t!==null)return us.from_pretrained(e,{config:t,
cache_dir:r,local_files_only:n,revision:s});const a=nl(e,{cache_dir:r,local_files_only:n,revision:s});return im(a,()=>us.
from_pretrained(e,{config:t,cache_dir:r,local_files_only:n,revision:s}))}async function Tl(e,{config:t=null,dtype:r=null,
device:n=null,model_file_name:s=null}={}){t=await kl(e,{config:t});const a=["config.json"],o=t["transformers.js_config"]??
{},i=o.use_external_data_format,l="onnx",c=n??o.device;let d=r??o.dtype;const h=xl(t),_=(v,y=null)=>{y=y??v;const b=mm(c,
v),k=gm(d,v,b),A=is[k]??"",E=`${y}${A}.onnx`,C=`${l}/${E}`;a.push(C);const N=lg(i,E,v);for(const M of cg(E,N)){const $=`${l}\
/${M}`;a.push($)}},{sessions:p,optional_configs:w}=mg(h,t,{model_file_name:s});for(const[v,y]of Object.entries(p))_(v,y);
if(w)for(const v of Object.values(w))a.push(v);return a}var gn=null;function WC(e){gn=e}function Si(e){if(e instanceof G)
return e;if(e.length===0)throw Error("items must be non-empty");if(Array.isArray(e[0])){if(e.some(t=>t.length!==e[0].length))
throw Error("Unable to create tensor, you should probably activate truncation and/or padding with 'padding=True' and/or \
'truncation=True' to have batched tensors with the same length.");return new G("int64",BigInt64Array.from(e.flat().map(t=>BigInt(
t))),[e.length,e[0].length])}else return new G("int64",BigInt64Array.from(e.map(t=>BigInt(t))),[1,e.length])}function gg(e){
return new G("bool",[e],[1])}var E_={[W.DecoderOnly]:{can_generate:!0,forward:dr,prepare_inputs:xn},[W.DecoderOnlyWithoutHead]:{
can_generate:!1,forward:dr,prepare_inputs:xn},[W.Seq2Seq]:{can_generate:!0,forward:Zs,prepare_inputs:ka},[W.Vision2Seq]:{
can_generate:!0,forward:Zs,prepare_inputs:ka},[W.Musicgen]:{can_generate:!0,forward:Zs},[W.EncoderDecoder]:{can_generate:!1,
forward:Zs},[W.ImageTextToText]:{can_generate:!0,forward:YC,prepare_inputs:ea},[W.AudioTextToText]:{can_generate:!0,forward:XC,
prepare_inputs:ea},[W.ImageAudioTextToText]:{can_generate:!0,prepare_inputs:ea},[W.Phi3V]:{can_generate:!0,prepare_inputs:ea},
[W.MultiModality]:{can_generate:!0},[W.AutoEncoder]:{can_generate:!1,forward:HC},[W.Chatterbox]:{can_generate:!0,forward:Sr},
[W.VoxtralRealtime]:{can_generate:!0,prepare_inputs:xn},default:{can_generate:!1,forward:Sr}};function A_(e,t){let r=cr.
get(e),n=!1;const s=t?.architectures?.[0];if(s&&s!==e&&e?.endsWith("ForCausalLM")&&s.endsWith("ForConditionalGeneration")){
const i=cr.get(s);i!==void 0&&(r=i,n=!0)}const a=E_[r]??E_.default,o=lr[r]??lr.default;return{typeConfig:{...a,...o},textOnly:n,
modelType:r}}var cr=new Map,El=new Map,Mn=new Map,F=class extends ft{main_input_name="input_ids";forward_params=["input_\
ids","attention_mask"];_return_dict_in_generate_keys=null;constructor(e,t,r){super(),this.config=e,this.sessions=t,this.
configs=r;const n=Mn.get(this.constructor),{typeConfig:s}=A_(n,e);this.can_generate=s.can_generate,this._forward=s.forward,
this._prepare_inputs_for_generation=s.prepare_inputs,this.can_generate&&this.forward_params.push("past_key_values"),this.
custom_config=this.config["transformers.js_config"]??{}}async dispose(){const e=[];for(const t of Object.values(this.sessions))
e.push(t.release?.());return await Promise.all(e)}static async from_pretrained(e,{progress_callback:t=null,config:r=null,
cache_dir:n=null,local_files_only:s=!1,revision:a="main",model_file_name:o=null,subfolder:i="onnx",device:l=null,dtype:c=null,
use_external_data_format:d=null,session_options:h={}}={}){const _={progress_callback:t,config:r,cache_dir:n,local_files_only:s,
revision:a,model_file_name:o,subfolder:i,device:l,dtype:c,use_external_data_format:d,session_options:h},p=Mn.get(this);r=
_.config=await us.from_pretrained(e,_);const{typeConfig:w,textOnly:v,modelType:y}=A_(p,r);if(y===void 0){const E=p??r?.model_type;
E!=="custom"&&de.warn(`Model type for '${E}' not found, assuming encoder-only architecture. Please report this at ${Ia}.`)}
if(t&&!(t instanceof fa)){const E={};try{const C=await Tl(e,{config:r,dtype:c,device:l,model_file_name:o});(await Promise.
all(C.map(M=>Jr(e,M,_)))).forEach((M,$)=>{if(M.exists){const R=C[$]==="config.json";E[C[$]]={loaded:R?M.size??0:0,total:M.
size??0}}})}catch(C){de.warn(`Unable to fetch model file metadata for total progress tracking: ${C}`)}Object.keys(E).length>
0&&(_.progress_callback=new fa(t,E))}const b=w.sessions(r,_,v),k=[xC(e,b,_,w.cache_sessions)];w.optional_configs&&k.push(
JC(e,w.optional_configs,_));const A=await Promise.all(k);return new this(r,...A)}async _call(e){return await this.forward(
e)}async forward(e){return await this._forward(this,e)}get generation_config(){return this.configs?.generation_config??null}_get_logits_processor(e,t,r=null){
const n=new Ci;if(e.repetition_penalty!==null&&e.repetition_penalty!==1&&n.push(new LC(e.repetition_penalty)),e.no_repeat_ngram_size!==
null&&e.no_repeat_ngram_size>0&&n.push(new IC(e.no_repeat_ngram_size)),e.bad_words_ids!==null&&n.push(new DC(e.bad_words_ids,
e.eos_token_id)),e.min_length!==null&&e.eos_token_id!==null&&e.min_length>0&&n.push(new OC(e.min_length,e.eos_token_id)),
e.min_new_tokens!==null&&e.eos_token_id!==null&&e.min_new_tokens>0&&n.push(new NC(t,e.min_new_tokens,e.eos_token_id)),e.
forced_bos_token_id!==null&&n.push(new CC(e.forced_bos_token_id)),e.forced_eos_token_id!==null&&n.push(new SC(e.max_length,
e.forced_eos_token_id)),e.suppress_tokens!==null&&n.push(new PC(e.suppress_tokens)),e.begin_suppress_tokens!==null){const s=t>
1||e.forced_bos_token_id===null?t:t+1;n.push(new hg(e.begin_suppress_tokens,s))}return e.guidance_scale!==null&&e.guidance_scale>
1&&n.push(new zC(e.guidance_scale)),e.temperature===0&&e.do_sample&&(de.warn("`do_sample` changed to false because `temp\
erature: 0` implies greedy sampling (always selecting the most likely token), which is incompatible with `do_sample: tru\
e`."),e.do_sample=!1),e.do_sample&&e.temperature!==null&&e.temperature!==1&&n.push(new BC(e.temperature)),r!==null&&n.extend(
r),n}_prepare_generation_config(e,t,r=fg){const n={...this.config};for(const a of["decoder","generator","text_config"])a in
n&&Object.assign(n,n[a]);const s=new r(n);return Object.assign(s,this.generation_config??{}),e&&Object.assign(s,e),t&&Object.
assign(s,Ze(t,Object.getOwnPropertyNames(s))),s}_get_stopping_criteria(e,t=null){const r=new _g;return e.max_length!==null&&
r.push(new RC(e.max_length,this.config.max_position_embeddings??null)),e.eos_token_id!==null&&r.push(new $C(e.eos_token_id)),
t&&r.extend(t),r}_validate_model_class(){if(!this.can_generate){const e=[gn.MODEL_FOR_CAUSAL_LM_MAPPING_NAMES,gn.MODEL_FOR_VISION_2_SEQ_MAPPING_NAMES,
gn.MODEL_FOR_SEQ_TO_SEQ_CAUSAL_LM_MAPPING_NAMES,gn.MODEL_FOR_SPEECH_SEQ_2_SEQ_MAPPING_NAMES].filter(Boolean),t=Mn.get(this.
constructor),r=new Set,n=this.config.model_type;for(const a of e){const o=a?.get(n);o&&r.add(o)}let s=`The current model\
 class (${t}) is not compatible with \`.generate()\`, as it doesn't have a language model head.`;throw r.size>0&&(s+=` P\
lease use the following class instead: ${[...r].join(", ")}`),Error(s)}}prepare_inputs_for_generation(...e){if(!this._prepare_inputs_for_generation)
throw new Error("prepare_inputs_for_generation is not implemented for this model.");return this._prepare_inputs_for_generation(
this,...e)}_update_model_kwargs_for_generation({generated_input_ids:e,outputs:t,model_inputs:r,is_encoder_decoder:n}){return r.
past_key_values=Pi(t,r.past_key_values),r.input_ids=new G("int64",e.flat(),[e.length,1]),n?"decoder_attention_mask"in r&&
(r.decoder_attention_mask=Oe([r.decoder_attention_mask,_t([r.decoder_attention_mask.dims[0],1])],1)):r.attention_mask=Oe(
[r.attention_mask,_t([r.attention_mask.dims[0],1])],1),r.position_ids=null,r}_prepare_model_inputs({inputs:e,bos_token_id:t,
model_kwargs:r}){const n=Ze(r,this.forward_params),s=this.main_input_name;if(s in n){if(e)throw new Error("`inputs`: {in\
puts}` were passed alongside {input_name} which is not allowed. Make sure to either pass {inputs} or {input_name}=...")}else
n[s]=e;return{inputs_tensor:n[s],model_inputs:n,model_input_name:s}}async _prepare_encoder_decoder_kwargs_for_generation({
inputs_tensor:e,model_inputs:t,model_input_name:r,generation_config:n}){if(this.sessions.model.inputNames.includes("inpu\
ts_embeds")&&!t.inputs_embeds&&"_prepare_inputs_embeds"in this){const{input_ids:a,pixel_values:o,attention_mask:i,...l}=t,
c=await this._prepare_inputs_embeds(t);t={...l,...Ze(c,["inputs_embeds","attention_mask"])}}let{last_hidden_state:s}=await Sr(
this,t);if(n.guidance_scale!==null&&n.guidance_scale>1)s=Oe([s,xi(s,0)],0),"attention_mask"in t&&(t.attention_mask=Oe([t.
attention_mask,cl(t.attention_mask)],0));else if(t.decoder_input_ids){const a=Si(t.decoder_input_ids).dims[0];if(a!==s.dims[0]){
if(s.dims[0]!==1)throw new Error(`The encoder outputs have a different batch size (${s.dims[0]}) than the decoder inputs\
 (${a}).`);s=Oe(Array.from({length:a},()=>s),0)}}return t.encoder_outputs=s,t}_prepare_decoder_input_ids_for_generation({
batch_size:e,model_input_name:t,model_kwargs:r,decoder_start_token_id:n,bos_token_id:s,generation_config:a}){let{decoder_input_ids:o,
...i}=r;if(!(o instanceof G)){if(o)Array.isArray(o[0])||(o=Array.from({length:e},()=>o));else if(n??=s,this.config.model_type===
"musicgen")o=Array.from({length:e*this.config.decoder.num_codebooks},()=>[n]);else if(Array.isArray(n)){if(n.length!==e)
throw new Error(`\`decoder_start_token_id\` expected to have length ${e} but got ${n.length}`);o=n}else o=Array.from({length:e},
()=>[n]);o=Si(o)}return i.decoder_attention_mask=ll(o),{input_ids:o,model_inputs:i}}async generate({inputs:e=null,generation_config:t=null,
logits_processor:r=null,stopping_criteria:n=null,streamer:s=null,...a}){this._validate_model_class(),t=this._prepare_generation_config(
t,a);let{inputs_tensor:o,model_inputs:i,model_input_name:l}=this._prepare_model_inputs({inputs:e,model_kwargs:a});const c=this.
config.is_encoder_decoder;c&&("encoder_outputs"in i||(i=await this._prepare_encoder_decoder_kwargs_for_generation({inputs_tensor:o,
model_inputs:i,model_input_name:l,generation_config:t})));let d;c?{input_ids:d,model_inputs:i}=this._prepare_decoder_input_ids_for_generation(
{batch_size:i[l].dims.at(0),model_input_name:l,model_kwargs:i,decoder_start_token_id:t.decoder_start_token_id,bos_token_id:t.
bos_token_id,generation_config:t}):d=i[l];let h=d.dims.at(-1);t.max_new_tokens!==null&&(t.max_length=h+t.max_new_tokens);
const _=this._get_logits_processor(t,h,r),p=this._get_stopping_criteria(t,n),w=i[l].dims.at(0),v=Na.getSampler(t),y=new Array(
w).fill(0),b=d.tolist();s&&s.put(b);let k,A={},E={};for(;;){if(i=this.prepare_inputs_for_generation(b,i,t),k=await this.
forward(i),t.return_dict_in_generate)if(t.output_attentions){const z=QC(k);for(const I in z)I in A||(A[I]=[]),A[I].push(
z[I])}else this._return_dict_in_generate_keys&&Object.assign(E,Ze(k,this._return_dict_in_generate_keys));const R=k.logits.
slice(null,-1,null).to("float32"),j=_(b,R),Y=[];for(let z=0;z<j.dims.at(0);++z){const I=j[z],U=await v(I);for(const[X,ce]of U){
const Z=BigInt(X);y[z]+=ce,b[z].push(Z),Y.push([Z]);break}}if(s&&s.put(Y),p(b).every(z=>z))break;i=this._update_model_kwargs_for_generation(
{generated_input_ids:Y,outputs:k,model_inputs:i,is_encoder_decoder:c})}s&&s.end();const C=new G("int64",b.flat(),[b.length,
b[0].length]),N=Pi(k,i.past_key_values),M=new Set(Object.values(N));for(const R of Object.values(k))R.location==="gpu-bu\
ffer"&&!M.has(R)&&R.dispose();return"past_key_values"in a||t.return_dict_in_generate||await N.dispose(),t.return_dict_in_generate?
{sequences:C,past_key_values:N,...A,...E}:C}async _encode_input(e,t,r){if(!Object.hasOwn(this.sessions,e))throw new Error(
`Model does not have a ${e} session.`);const n=this.sessions[e];return(await ve(n,Ze(t,n.inputNames)))[r]}async encode_image(e){
return this._encode_input("vision_encoder",e,"image_features")}async encode_text(e){return this._encode_input("embed_tok\
ens",e,"inputs_embeds")}async encode_audio(e){return this._encode_input("audio_encoder",e,"audio_features")}};async function Zs(e,t){
let{encoder_outputs:r,input_ids:n,decoder_input_ids:s,decoder_attention_mask:a,...o}=t;if(!r){const i=Ze(t,e.sessions.model.
inputNames);r=(await Sr(e,i)).last_hidden_state}return o.input_ids=s,o.encoder_hidden_states=r,e.sessions.decoder_model_merged.
inputNames.includes("encoder_attention_mask")&&(o.encoder_attention_mask=t.attention_mask),a&&!o.attention_mask&&(o.attention_mask=
a),await dr(e,o,!0)}async function Sr(e,t){const r=e.sessions.model,n=Ze(t,r.inputNames);if(r.inputNames.includes("input\
s_embeds")&&!n.inputs_embeds){if(!t.input_ids)throw new Error("Both `input_ids` and `inputs_embeds` are missing in the m\
odel inputs.");n.inputs_embeds=await e.encode_text({input_ids:t.input_ids})}if(r.inputNames.includes("token_type_ids")&&
!n.token_type_ids){if(!n.input_ids)throw new Error("Both `input_ids` and `token_type_ids` are missing in the model input\
s.");n.token_type_ids=cl(n.input_ids)}if(r.inputNames.includes("pixel_mask")&&!n.pixel_mask){if(!n.pixel_values)throw new Error(
"Both `pixel_values` and `pixel_mask` are missing in the model inputs.");const s=n.pixel_values.dims;n.pixel_mask=_t([s[0],
s[2],s[3]])}return await ve(r,n)}async function HC(e,t){const r=await e.encode(t);return await e.decode(r)}function Pi(e,t){
const r=Object.create(null);for(const n in e)if(n.startsWith("present")){const s=n.replace("present_ssm","past_ssm").replace(
"present_conv","past_conv").replace("present_recurrent","past_recurrent").replace("present_compressor","past_compressor").
replace("present_indexer","past_indexer").replace("present","past_key_values");n.includes("encoder")&&t?r[s]=t[s]:r[s]=e[n]}
return t?(t.update(r),t):new Ml(r)}function QC(e){const t={};for(const r of["cross_attentions","encoder_attentions","dec\
oder_attentions"])for(const n in e)n.startsWith(r)&&(r in t||(t[r]=[]),t[r].push(e[n]));return t}function wg(e,t){return e.
map(r=>typeof r=="number"?r:t[r]??0)}function Al(e,t,r){if(r&&Object.keys(r).length>0)return Object.assign(t,r),r;const n=e.
sessions.decoder_model_merged??e.sessions.model,s=(t[e.main_input_name]??t.attention_mask)?.dims?.[0]??1,a=Oa(e.config),
o=e.config?.normalized_config?.num_heads,i={batch_size:s};typeof o=="number"&&(i["batch_size x num_heads"]=s*o);const l=Object.
create(null);for(const c of n.inputMetadata){if(!a.has(c.name))continue;const d=wg(c.shape,i),h=d.reduce((w,v)=>w*v,1),_=ls[c.
type],p=new G(c.type,new _(h),d);t[c.name]=p,l[c.name]=p}return r?(r.update(l),r):new Ml(l)}function ws(e,t,r){if(t.num_logits_to_keep)
return;(e.sessions.decoder_model_merged??e.sessions.model)?.inputNames.includes("num_logits_to_keep")&&(t.num_logits_to_keep=
new G("int64",[r],[]))}async function dr(e,t,r=!1){const n=e.sessions[r?"decoder_model_merged":"model"],{past_key_values:s,
...a}=t;if(n.inputNames.includes("use_cache_branch")&&(a.use_cache_branch=gg(s!=null&&Object.keys(s).length>0)),n.inputNames.
includes("position_ids")&&a.attention_mask&&!a.position_ids){const i=["paligemma","gemma3_text","gemma3"].includes(e.config.
model_type)?1:0;a.position_ids=KC(a,s,i)}ws(e,a,0n),Al(e,a,s);const o=Ze(a,n.inputNames);return await ve(n,o)}async function vg(e,{
encode_function:t,merge_function:r,modality_input_names:n,modality_output_name:s,input_ids:a=null,attention_mask:o=null,
position_ids:i=null,inputs_embeds:l=null,past_key_values:c=null,generation_config:d=null,logits_processor:h=null,num_logits_to_keep:_=null,
...p}){if(!l){l=await e.encode_text({input_ids:a,...p});const v=Ze(p,n);if(Object.keys(v).length>0){if(a.dims[1]!==1){const y=await t(
{...v,...p});({inputs_embeds:l,attention_mask:o}=r({[s]:y,inputs_embeds:l,input_ids:a,attention_mask:o}))}else if(c&&a.dims[1]===
1){const y=a.dims[1],b=c.get_seq_length();o=Oe([_t([a.dims[0],b]),o.slice(null,[o.dims[1]-y,o.dims[1]])],1)}}}if(!i&&["q\
wen2_vl","qwen2_vl_text","qwen2_5_vl","qwen2_5_vl_text","qwen3_vl","qwen3_vl_text","qwen3_vl_moe","qwen3_vl_moe_text","q\
wen3_5","qwen3_5_text","qwen3_5_moe","qwen3_5_moe_text","glm_ocr","glm_ocr_text"].includes(e.config.model_type)){const{image_grid_thw:v,
video_grid_thw:y}=p;[i]=e.get_rope_index(a,v,y,o)}return await dr(e,{inputs_embeds:l,past_key_values:c,attention_mask:o,
position_ids:i,generation_config:d,logits_processor:h,num_logits_to_keep:_},!0)}async function XC(e,t){return await vg(e,
{...t,modality_input_names:["audio_values","input_features"],modality_output_name:"audio_features",encode_function:e.encode_audio.
bind(e),merge_function:e._merge_input_ids_with_audio_features.bind(e)})}async function YC(e,t){return await vg(e,{...t,modality_input_names:[
"pixel_values"],modality_output_name:"image_features",encode_function:e.encode_image.bind(e),merge_function:e._merge_input_ids_with_image_features.
bind(e)})}function yg(e,t=0){const[r,n]=e.dims,s=e.data,a=new BigInt64Array(s.length);for(let o=0;o<r;++o){const i=o*n;let l=BigInt(
t);for(let c=0;c<n;++c){const d=i+c;s[d]===0n?a[d]=BigInt(1):(a[d]=l,l+=s[d])}}return{data:a,dims:e.dims}}function KC(e,t=null,r=0){
const{input_ids:n,inputs_embeds:s,attention_mask:a}=e,{data:o,dims:i}=yg(a,r);let l=new G("int64",o,i);if(t){const c=-(n??
s).dims.at(1);l=l.slice(null,[c,null])}return l}function xn(e,t,r,n){const s=r.past_key_values?r.past_key_values.get_seq_length():
0;if(ws(e,r,1n),!r.attention_mask){let a;for(const o of["input_ids","inputs_embeds","position_ids"])if(r[o]){a=r[o].dims;
break}if(!a)throw new Error("attention_mask is not provided, and unable to infer its shape from model inputs.");r.attention_mask=
_t([a[0],s+a[1]])}if(r.past_key_values){const{input_ids:a,attention_mask:o}=r;o&&o.dims[1]>a.dims[1]||s<a.dims[1]&&(r.input_ids=
a.slice(null,[s,null]))}return r}function ka(e,t,r,n){return r.past_key_values&&(t=t.map(s=>[s.at(-1)])),ws(e,r,1n),{...r,
decoder_input_ids:Si(t)}}function ea(e,...t){return e.config.is_encoder_decoder?ka(e,...t):xn(e,...t)}function bg({modality_token_id:e,
inputs_embeds:t,modality_features:r,input_ids:n,attention_mask:s}){const a=n.tolist().map(c=>c.reduce((d,h,_)=>(h==e&&d.
push(_),d),[])),o=a.reduce((c,d)=>c+d.length,0),i=r.dims[0];if(o!==i)throw new Error(`Number of tokens and features do n\
ot match: tokens: ${o}, features ${i}`);let l=0;for(let c=0;c<a.length;++c){const d=a[c],h=t[c];for(let _=0;_<d.length;++_)
h[d[_]].data.set(r[l++].data)}return{inputs_embeds:t,attention_mask:s}}function Cl({image_token_id:e,inputs_embeds:t,image_features:r,
input_ids:n,attention_mask:s}){return bg({modality_token_id:e,inputs_embeds:t,modality_features:r,input_ids:n,attention_mask:s})}
function Mg({audio_token_id:e,inputs_embeds:t,audio_features:r,input_ids:n,attention_mask:s}){return bg({modality_token_id:e,
inputs_embeds:t,modality_features:r,input_ids:n,attention_mask:s})}async function JC(e,t,r){return Object.fromEntries(await Promise.
all(Object.keys(t).map(async n=>{const s=await tr(e,t[n],!1,r);return[n,s]})))}var Sl={};hs(Sl,{ASTForAudioClassification:()=>uS,
ASTModel:()=>cS,ASTPreTrainedModel:()=>Ll,AfmoeForCausalLM:()=>oS,AfmoeModel:()=>aS,AfmoePreTrainedModel:()=>Fl,AlbertForMaskedLM:()=>rS,
AlbertForQuestionAnswering:()=>tS,AlbertForSequenceClassification:()=>eS,AlbertModel:()=>ZC,AlbertPreTrainedModel:()=>vs,
ApertusForCausalLM:()=>sS,ApertusModel:()=>nS,ApertusPreTrainedModel:()=>Pl,ArceeForCausalLM:()=>lS,ArceeModel:()=>iS,ArceePreTrainedModel:()=>Il,
BartForConditionalGeneration:()=>hS,BartForSequenceClassification:()=>fS,BartModel:()=>dS,BartPretrainedModel:()=>Da,BaseModelOutput:()=>TC,
BeitForImageClassification:()=>pS,BeitModel:()=>_S,BeitPreTrainedModel:()=>Ol,BertForMaskedLM:()=>gS,BertForQuestionAnswering:()=>yS,
BertForSequenceClassification:()=>wS,BertForTokenClassification:()=>vS,BertModel:()=>mS,BertPreTrainedModel:()=>Sn,BlenderbotForConditionalGeneration:()=>MS,
BlenderbotModel:()=>bS,BlenderbotPreTrainedModel:()=>Nl,BlenderbotSmallForConditionalGeneration:()=>kS,BlenderbotSmallModel:()=>xS,
BlenderbotSmallPreTrainedModel:()=>Dl,BloomForCausalLM:()=>ES,BloomModel:()=>TS,BloomPreTrainedModel:()=>zl,CHMv2ForDepthEstimation:()=>OS,
CHMv2PreTrainedModel:()=>Eg,CLIPModel:()=>DS,CLIPPreTrainedModel:()=>Zr,CLIPSegForImageSegmentation:()=>GS,CLIPSegModel:()=>$S,
CLIPSegPreTrainedModel:()=>Bl,CLIPTextModel:()=>zS,CLIPTextModelWithProjection:()=>Sg,CLIPVisionModel:()=>BS,CLIPVisionModelWithProjection:()=>RS,
CamembertForMaskedLM:()=>CS,CamembertForQuestionAnswering:()=>FS,CamembertForSequenceClassification:()=>SS,CamembertForTokenClassification:()=>PS,
CamembertModel:()=>AS,CamembertPreTrainedModel:()=>Pn,CausalLMOutput:()=>Pr,CausalLMOutputWithPast:()=>EC,ChatterboxModel:()=>kg,
ChatterboxPreTrainedModel:()=>xg,ChineseCLIPModel:()=>LS,ChineseCLIPPreTrainedModel:()=>Tg,ClapAudioModelWithProjection:()=>Cg,
ClapModel:()=>NS,ClapPreTrainedModel:()=>za,ClapTextModelWithProjection:()=>Ag,CodeGenForCausalLM:()=>US,CodeGenModel:()=>VS,
CodeGenPreTrainedModel:()=>Rl,Cohere2ForCausalLM:()=>HS,Cohere2Model:()=>WS,Cohere2PreTrainedModel:()=>Gl,CohereAsrForConditionalGeneration:()=>XS,
CohereAsrModel:()=>QS,CohereAsrPreTrainedModel:()=>Vl,CohereForCausalLM:()=>qS,CohereModel:()=>jS,CoherePreTrainedModel:()=>$l,
ConvBertForMaskedLM:()=>KS,ConvBertForQuestionAnswering:()=>eP,ConvBertForSequenceClassification:()=>JS,ConvBertForTokenClassification:()=>ZS,
ConvBertModel:()=>YS,ConvBertPreTrainedModel:()=>Fn,ConvNextForImageClassification:()=>rP,ConvNextModel:()=>tP,ConvNextPreTrainedModel:()=>Ul,
ConvNextV2ForImageClassification:()=>sP,ConvNextV2Model:()=>nP,ConvNextV2PreTrainedModel:()=>jl,DFineForObjectDetection:()=>lP,
DFineModel:()=>iP,DFinePreTrainedModel:()=>Wl,DINOv3ConvNextModel:()=>DP,DINOv3ConvNextPreTrainedModel:()=>Bg,DINOv3ViTModel:()=>zP,
DINOv3ViTPreTrainedModel:()=>Rg,DPTForDepthEstimation:()=>qP,DPTModel:()=>jP,DPTPreTrainedModel:()=>Zl,DacDecoderModel:()=>Lg,
DacDecoderOutput:()=>Fg,DacEncoderModel:()=>Ig,DacEncoderOutput:()=>Pg,DacModel:()=>cP,DacPreTrainedModel:()=>Ba,DebertaForMaskedLM:()=>dP,
DebertaForQuestionAnswering:()=>_P,DebertaForSequenceClassification:()=>hP,DebertaForTokenClassification:()=>fP,DebertaModel:()=>uP,
DebertaPreTrainedModel:()=>In,DebertaV2ForMaskedLM:()=>yP,DebertaV2ForQuestionAnswering:()=>xP,DebertaV2ForSequenceClassification:()=>bP,
DebertaV2ForTokenClassification:()=>MP,DebertaV2Model:()=>vP,DebertaV2PreTrainedModel:()=>Ln,DecisionTransformerModel:()=>kP,
DecisionTransformerPreTrainedModel:()=>Og,DeepseekV3ForCausalLM:()=>mP,DeepseekV3Model:()=>pP,DeepseekV3PreTrainedModel:()=>Hl,
DeepseekV4ForCausalLM:()=>wP,DeepseekV4Model:()=>gP,DeepseekV4PreTrainedModel:()=>Ql,DeiTForImageClassification:()=>EP,DeiTModel:()=>TP,
DeiTPreTrainedModel:()=>Xl,DepthAnythingForDepthEstimation:()=>AP,DepthAnythingPreTrainedModel:()=>Ng,DepthProForDepthEstimation:()=>CP,
DepthProPreTrainedModel:()=>Dg,DetrForObjectDetection:()=>PP,DetrForSegmentation:()=>FP,DetrModel:()=>SP,DetrObjectDetectionOutput:()=>Yl,
DetrPreTrainedModel:()=>Ra,DetrSegmentationOutput:()=>zg,Dinov2ForImageClassification:()=>LP,Dinov2Model:()=>IP,Dinov2PreTrainedModel:()=>Kl,
Dinov2WithRegistersForImageClassification:()=>NP,Dinov2WithRegistersModel:()=>OP,Dinov2WithRegistersPreTrainedModel:()=>Jl,
DistilBertForMaskedLM:()=>VP,DistilBertForQuestionAnswering:()=>GP,DistilBertForSequenceClassification:()=>RP,DistilBertForTokenClassification:()=>$P,
DistilBertModel:()=>BP,DistilBertPreTrainedModel:()=>On,DonutSwinModel:()=>UP,DonutSwinPreTrainedModel:()=>$g,EdgeTamModel:()=>hN,
EfficientNetForImageClassification:()=>HP,EfficientNetModel:()=>WP,EfficientNetPreTrainedModel:()=>ec,ElectraForMaskedLM:()=>XP,
ElectraForQuestionAnswering:()=>JP,ElectraForSequenceClassification:()=>YP,ElectraForTokenClassification:()=>KP,ElectraModel:()=>QP,
ElectraPreTrainedModel:()=>Nn,EmbeddingGemma2Model:()=>Vg,EmbeddingGemma2PreTrainedModel:()=>Gg,Ernie4_5ForCausalLM:()=>eF,
Ernie4_5Model:()=>ZP,Ernie4_5PretrainedModel:()=>tc,EsmForMaskedLM:()=>rF,EsmForSequenceClassification:()=>nF,EsmForTokenClassification:()=>sF,
EsmModel:()=>tF,EsmPreTrainedModel:()=>bs,EuroBertForMaskedLM:()=>oF,EuroBertForSequenceClassification:()=>iF,EuroBertForTokenClassification:()=>lF,
EuroBertModel:()=>aF,EuroBertPreTrainedModel:()=>Ms,ExaoneForCausalLM:()=>uF,ExaoneModel:()=>cF,ExaonePreTrainedModel:()=>rc,
FalconForCausalLM:()=>hF,FalconH1ForCausalLM:()=>_F,FalconH1Model:()=>fF,FalconH1PreTrainedModel:()=>sc,FalconModel:()=>dF,
FalconPreTrainedModel:()=>nc,FastViTForImageClassification:()=>mF,FastViTModel:()=>pF,FastViTPreTrainedModel:()=>ac,Florence2ForConditionalGeneration:()=>gF,
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
HieraForImageClassification:()=>nI,HieraModel:()=>rI,HieraPreTrainedModel:()=>kc,HrmTextForCausalLM:()=>aI,HrmTextModel:()=>sI,
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
MBartModel:()=>VI,MBartPreTrainedModel:()=>xs,MPNetForMaskedLM:()=>DL,MPNetForQuestionAnswering:()=>RL,MPNetForSequenceClassification:()=>zL,
MPNetForTokenClassification:()=>BL,MPNetModel:()=>NL,MPNetPreTrainedModel:()=>Dn,MT5ForConditionalGeneration:()=>UL,MT5Model:()=>VL,
MT5PreTrainedModel:()=>Hc,MarianMTModel:()=>RI,MarianModel:()=>BI,MarianPreTrainedModel:()=>Nc,MaskFormerForInstanceSegmentation:()=>GI,
MaskFormerModel:()=>$I,MaskFormerPreTrainedModel:()=>Dc,MaskedLMOutput:()=>Xe,Metric3DForDepthEstimation:()=>WI,Metric3DPreTrainedModel:()=>nw,
Metric3Dv2ForDepthEstimation:()=>HI,Metric3Dv2PreTrainedModel:()=>sw,MgpstrForSceneTextRecognition:()=>QI,MgpstrModelOutput:()=>aw,
MgpstrPreTrainedModel:()=>ow,MimiDecoderModel:()=>uw,MimiDecoderOutput:()=>lw,MimiEncoderModel:()=>cw,MimiEncoderOutput:()=>iw,
MimiModel:()=>XI,MimiPreTrainedModel:()=>Va,Ministral3ForCausalLM:()=>ZI,Ministral3Model:()=>JI,Ministral3PreTrainedModel:()=>Bc,
MinistralForCausalLM:()=>KI,MinistralModel:()=>YI,MinistralPreTrainedModel:()=>zc,Mistral3ForConditionalGeneration:()=>rL,
Mistral4ForCausalLM:()=>sL,Mistral4Model:()=>nL,Mistral4PreTrainedModel:()=>$c,MistralForCausalLM:()=>tL,MistralModel:()=>eL,
MistralPreTrainedModel:()=>Rc,MobileBertForMaskedLM:()=>oL,MobileBertForQuestionAnswering:()=>lL,MobileBertForSequenceClassification:()=>iL,
MobileBertModel:()=>aL,MobileBertPreTrainedModel:()=>ks,MobileLLMForCausalLM:()=>uL,MobileLLMModel:()=>cL,MobileLLMPreTrainedModel:()=>Gc,
MobileNetV1ForImageClassification:()=>hL,MobileNetV1ForSemanticSegmentation:()=>fL,MobileNetV1Model:()=>dL,MobileNetV1PreTrainedModel:()=>Ua,
MobileNetV2ForImageClassification:()=>pL,MobileNetV2ForSemanticSegmentation:()=>mL,MobileNetV2Model:()=>_L,MobileNetV2PreTrainedModel:()=>ja,
MobileNetV3ForImageClassification:()=>wL,MobileNetV3ForSemanticSegmentation:()=>vL,MobileNetV3Model:()=>gL,MobileNetV3PreTrainedModel:()=>qa,
MobileNetV4ForImageClassification:()=>bL,MobileNetV4ForSemanticSegmentation:()=>ML,MobileNetV4Model:()=>yL,MobileNetV4PreTrainedModel:()=>Wa,
MobileViTForImageClassification:()=>kL,MobileViTModel:()=>xL,MobileViTPreTrainedModel:()=>Vc,MobileViTV2ForImageClassification:()=>EL,
MobileViTV2Model:()=>TL,MobileViTV2PreTrainedModel:()=>Uc,ModelOutput:()=>Ve,ModernBertDecoderForCausalLM:()=>IL,ModernBertDecoderModel:()=>FL,
ModernBertDecoderPreTrainedModel:()=>jc,ModernBertForMaskedLM:()=>CL,ModernBertForSequenceClassification:()=>SL,ModernBertForTokenClassification:()=>PL,
ModernBertModel:()=>AL,ModernBertPreTrainedModel:()=>Ts,Moondream1ForConditionalGeneration:()=>MF,MoonshineForConditionalGeneration:()=>OL,
MoonshineModel:()=>LL,MoonshinePreTrainedModel:()=>qc,MptForCausalLM:()=>GL,MptModel:()=>$L,MptPreTrainedModel:()=>Wc,MultiModalityCausalLM:()=>jL,
MultiModalityPreTrainedModel:()=>dw,MusicgenForCausalLM:()=>WL,MusicgenForConditionalGeneration:()=>hw,MusicgenModel:()=>qL,
MusicgenPreTrainedModel:()=>Qc,NanoChatForCausalLM:()=>QL,NanoChatModel:()=>HL,NanoChatPreTrainedModel:()=>Xc,NemotronHForCausalLM:()=>YL,
NemotronHModel:()=>XL,NemotronHPreTrainedModel:()=>Yc,NeoBertForMaskedLM:()=>JL,NeoBertForQuestionAnswering:()=>tO,NeoBertForSequenceClassification:()=>ZL,
NeoBertForTokenClassification:()=>eO,NeoBertModel:()=>KL,NeoBertPreTrainedModel:()=>zn,NomicBertModel:()=>rO,NomicBertPreTrainedModel:()=>fw,
OPTForCausalLM:()=>mO,OPTModel:()=>pO,OPTPreTrainedModel:()=>nu,Olmo2ForCausalLM:()=>oO,Olmo2Model:()=>aO,Olmo2PreTrainedModel:()=>Jc,
Olmo3ForCausalLM:()=>lO,Olmo3Model:()=>iO,Olmo3PreTrainedModel:()=>Zc,OlmoForCausalLM:()=>sO,OlmoHybridForCausalLM:()=>uO,
OlmoHybridModel:()=>cO,OlmoHybridPreTrainedModel:()=>eu,OlmoModel:()=>nO,OlmoPreTrainedModel:()=>Kc,OpenAIPrivacyFilterForTokenClassification:()=>hO,
OpenAIPrivacyFilterModel:()=>dO,OpenAIPrivacyFilterPreTrainedModel:()=>tu,OpenELMForCausalLM:()=>_O,OpenELMModel:()=>fO,
OpenELMPreTrainedModel:()=>ru,OwlViTForObjectDetection:()=>yO,OwlViTModel:()=>vO,OwlViTPreTrainedModel:()=>au,Owlv2ForObjectDetection:()=>wO,
Owlv2Model:()=>gO,Owlv2PreTrainedModel:()=>su,PaliGemmaForConditionalGeneration:()=>bO,ParakeetForCTC:()=>MO,ParakeetPreTrainedModel:()=>_w,
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
RFDetrObjectDetectionOutput:()=>vw,RFDetrPreTrainedModel:()=>yu,RTDetrForObjectDetection:()=>oP,RTDetrModel:()=>aP,RTDetrObjectDetectionOutput:()=>ys,
RTDetrPreTrainedModel:()=>ql,RTDetrV2ForObjectDetection:()=>uN,RTDetrV2Model:()=>cN,RTDetrV2ObjectDetectionOutput:()=>yw,
RTDetrV2PreTrainedModel:()=>bu,ResNetForImageClassification:()=>YO,ResNetModel:()=>XO,ResNetPreTrainedModel:()=>vu,RoFormerForMaskedLM:()=>aN,
RoFormerForQuestionAnswering:()=>lN,RoFormerForSequenceClassification:()=>oN,RoFormerForTokenClassification:()=>iN,RoFormerModel:()=>sN,
RoFormerPreTrainedModel:()=>Rn,RobertaForMaskedLM:()=>eN,RobertaForQuestionAnswering:()=>nN,RobertaForSequenceClassification:()=>tN,
RobertaForTokenClassification:()=>rN,RobertaModel:()=>ZO,RobertaPreTrainedModel:()=>Bn,Sam2ImageSegmentationOutput:()=>xw,
Sam2Model:()=>Mu,Sam2PreTrainedModel:()=>kw,Sam3TrackerModel:()=>fN,SamImageSegmentationOutput:()=>bw,SamModel:()=>dN,SamPreTrainedModel:()=>Mw,
SapiensForDepthEstimation:()=>pN,SapiensForNormalEstimation:()=>mN,SapiensForSemanticSegmentation:()=>_N,SapiensPreTrainedModel:()=>Ha,
SegformerForImageClassification:()=>wN,SegformerForSemanticSegmentation:()=>vN,SegformerModel:()=>gN,SegformerPreTrainedModel:()=>Qa,
Seq2SeqLMOutput:()=>AC,SequenceClassifierOutput:()=>ie,SiglipModel:()=>yN,SiglipPreTrainedModel:()=>xu,SiglipTextModel:()=>Tw,
SiglipVisionModel:()=>bN,SmolLM3ForCausalLM:()=>xN,SmolLM3Model:()=>MN,SmolLM3PreTrainedModel:()=>ku,SmolVLMForConditionalGeneration:()=>kN,
SnacDecoderModel:()=>Aw,SnacEncoderModel:()=>Ew,SnacModel:()=>TN,SnacPreTrainedModel:()=>Xa,SolarOpenForCausalLM:()=>AN,
SolarOpenModel:()=>EN,SolarOpenPreTrainedModel:()=>Tu,SpeechT5ForSpeechToText:()=>SN,SpeechT5ForTextToSpeech:()=>PN,SpeechT5HifiGan:()=>FN,
SpeechT5Model:()=>CN,SpeechT5PreTrainedModel:()=>Ya,SqueezeBertForMaskedLM:()=>LN,SqueezeBertForQuestionAnswering:()=>NN,
SqueezeBertForSequenceClassification:()=>ON,SqueezeBertModel:()=>IN,SqueezeBertPreTrainedModel:()=>Es,StableLmForCausalLM:()=>zN,
StableLmModel:()=>DN,StableLmPreTrainedModel:()=>Eu,Starcoder2ForCausalLM:()=>RN,Starcoder2Model:()=>BN,Starcoder2PreTrainedModel:()=>Au,
StyleTextToSpeech2Model:()=>$N,StyleTextToSpeech2PreTrainedModel:()=>Cw,SupertonicForConditionalGeneration:()=>Pw,SupertonicPreTrainedModel:()=>Sw,
Swin2SRForImageSuperResolution:()=>qN,Swin2SRModel:()=>jN,Swin2SRPreTrainedModel:()=>Cu,SwinForImageClassification:()=>VN,
SwinForSemanticSegmentation:()=>UN,SwinModel:()=>GN,SwinPreTrainedModel:()=>Ka,T5ForConditionalGeneration:()=>HN,T5Model:()=>WN,
T5PreTrainedModel:()=>Su,TableTransformerForObjectDetection:()=>XN,TableTransformerModel:()=>QN,TableTransformerObjectDetectionOutput:()=>Fw,
TableTransformerPreTrainedModel:()=>Pu,TokenClassifierOutput:()=>He,TrOCRForCausalLM:()=>YN,TrOCRPreTrainedModel:()=>Iw,
UltravoxModel:()=>Mc,UltravoxPreTrainedModel:()=>Kg,UniSpeechForCTC:()=>JN,UniSpeechForSequenceClassification:()=>ZN,UniSpeechModel:()=>KN,
UniSpeechPreTrainedModel:()=>Ja,UniSpeechSatForAudioFrameClassification:()=>n3,UniSpeechSatForCTC:()=>t3,UniSpeechSatForSequenceClassification:()=>r3,
UniSpeechSatModel:()=>e3,UniSpeechSatPreTrainedModel:()=>As,VaultGemmaForCausalLM:()=>a3,VaultGemmaModel:()=>s3,VaultGemmaPreTrainedModel:()=>Fu,
ViTForImageClassification:()=>l3,ViTMAEModel:()=>c3,ViTMAEPreTrainedModel:()=>Lw,ViTMSNForImageClassification:()=>d3,ViTMSNModel:()=>u3,
ViTMSNPreTrainedModel:()=>Lu,ViTModel:()=>i3,ViTPreTrainedModel:()=>Iu,VisionEncoderDecoderModel:()=>o3,VitMatteForImageMatting:()=>h3,
VitMattePreTrainedModel:()=>Ow,VitPoseForPoseEstimation:()=>f3,VitPosePreTrainedModel:()=>Nw,VitsModel:()=>_3,VitsModelOutput:()=>Dw,
VitsPreTrainedModel:()=>zw,VoxtralForConditionalGeneration:()=>p3,VoxtralRealtimeForConditionalGeneration:()=>Rw,VoxtralRealtimePreTrainedModel:()=>Bw,
Wav2Vec2BertForCTC:()=>x3,Wav2Vec2BertForSequenceClassification:()=>k3,Wav2Vec2BertModel:()=>M3,Wav2Vec2BertPreTrainedModel:()=>Za,
Wav2Vec2ForAudioFrameClassification:()=>cI,Wav2Vec2ForCTC:()=>iI,Wav2Vec2ForSequenceClassification:()=>lI,Wav2Vec2Model:()=>oI,
Wav2Vec2PreTrainedModel:()=>Fr,WavLMForAudioFrameClassification:()=>S3,WavLMForCTC:()=>E3,WavLMForSequenceClassification:()=>A3,
WavLMForXVector:()=>C3,WavLMModel:()=>T3,WavLMPreTrainedModel:()=>$n,WeSpeakerResNetModel:()=>P3,WeSpeakerResNetPreTrainedModel:()=>Gw,
WhisperForConditionalGeneration:()=>Vw,WhisperModel:()=>I3,WhisperPreTrainedModel:()=>Ou,XLMForQuestionAnswering:()=>B3,
XLMForSequenceClassification:()=>D3,XLMForTokenClassification:()=>z3,XLMModel:()=>O3,XLMPreTrainedModel:()=>Gn,XLMRobertaForMaskedLM:()=>$3,
XLMRobertaForQuestionAnswering:()=>U3,XLMRobertaForSequenceClassification:()=>G3,XLMRobertaForTokenClassification:()=>V3,
XLMRobertaModel:()=>R3,XLMRobertaPreTrainedModel:()=>Vn,XLMWithLMHeadModel:()=>N3,XVectorOutput:()=>$w,YolosForObjectDetection:()=>q3,
YolosModel:()=>j3,YolosObjectDetectionOutput:()=>Uw,YolosPreTrainedModel:()=>Nu,YoutuForCausalLM:()=>H3,YoutuModel:()=>W3,
YoutuPreTrainedModel:()=>Du,ZayaForCausalLM:()=>X3,ZayaModel:()=>Q3,ZayaPreTrainedModel:()=>zu});var vs=class extends F{},
ZC=class extends vs{},eS=class extends vs{async _call(e){return new ie(await super._call(e))}},tS=class extends vs{async _call(e){
return new ot(await super._call(e))}},rS=class extends vs{async _call(e){return new Xe(await super._call(e))}},Pl=class extends F{},
nS=class extends Pl{},sS=class extends Pl{},Fl=class extends F{},aS=class extends Fl{},oS=class extends Fl{},Il=class extends F{},
iS=class extends Il{},lS=class extends Il{},Ll=class extends F{},cS=class extends Ll{},uS=class extends Ll{},Da=class extends F{},
dS=class extends Da{},hS=class extends Da{},fS=class extends Da{async _call(e){return new ie(await super._call(e))}},Ol=class extends F{},
_S=class extends Ol{},pS=class extends Ol{async _call(e){return new ie(await super._call(e))}},Sn=class extends F{},mS=class extends Sn{},
gS=class extends Sn{async _call(e){return new Xe(await super._call(e))}},wS=class extends Sn{async _call(e){return new ie(
await super._call(e))}},vS=class extends Sn{async _call(e){return new He(await super._call(e))}},yS=class extends Sn{async _call(e){
return new ot(await super._call(e))}},Nl=class extends F{},bS=class extends Nl{},MS=class extends Nl{},Dl=class extends F{},
xS=class extends Dl{},kS=class extends Dl{},zl=class extends F{},TS=class extends zl{},ES=class extends zl{},Pn=class extends F{},
AS=class extends Pn{},CS=class extends Pn{async _call(e){return new Xe(await super._call(e))}},SS=class extends Pn{async _call(e){
return new ie(await super._call(e))}},PS=class extends Pn{async _call(e){return new He(await super._call(e))}},FS=class extends Pn{async _call(e){
return new ot(await super._call(e))}},IS=4299n,C_=6561n,xg=class extends F{forward_params=["input_ids","inputs_embeds","\
attention_mask","position_ids","audio_values","exaggeration","audio_features","audio_tokens","speaker_embeddings","speak\
er_features","past_key_values"];main_input_name="input_ids";_return_dict_in_generate_keys=["audio_tokens","speaker_embed\
dings","speaker_features"]},kg=class extends xg{async encode_speech(e){return ve(this.sessions.speech_encoder,{audio_values:e})}async forward({
input_ids:e=null,attention_mask:t=null,audio_values:r=null,exaggeration:n=null,position_ids:s=null,inputs_embeds:a=null,
past_key_values:o=null,generation_config:i=null,logits_processor:l=null,num_logits_to_keep:c=null,audio_features:d=null,
audio_tokens:h=null,speaker_embeddings:_=null,speaker_features:p=null,...w}){let v;if(!a){const b=this.sessions.embed_tokens.
inputNames,k={input_ids:e};if(b.includes("exaggeration")){if(!(n instanceof G)){const A=e.dims[0];if(n==null)n=ct([A],.5);else if(typeof n==
"number")n=ct([A],n);else if(Array.isArray(n))n=new G("float32",n,[A]);else throw new Error("Unsupported type for `exagg\
eration` input")}k.exaggeration=n}if(b.includes("position_ids")&&(k.position_ids=s),{inputs_embeds:a}=await ve(this.sessions.
embed_tokens,k),d&&h&&_&&p&&(v={audio_features:d,audio_tokens:h,speaker_embeddings:_,speaker_features:p}),v||r)v??=await this.
encode_speech(r),a=Oe([v.audio_features,a],1),t=_t([a.dims[0],a.dims[1]]);else{const A=a.dims[1];if(!o||A!==1)throw new Error(
"Incorrect state encountered during generation.");const E=o.get_seq_length();t=_t([a.dims[0],E+A])}}return{...await dr(this,
{inputs_embeds:a,past_key_values:o,attention_mask:t,generation_config:i,logits_processor:l,num_logits_to_keep:c},!1),...v}}prepare_inputs_for_generation(e,t,r){
if(!t.position_ids&&this.sessions.embed_tokens.inputNames.includes("position_ids"))if(t.input_ids.dims[1]===1){const n=Array.
from({length:e.length},(s,a)=>e[a].length-e[a].findLastIndex(o=>o==C_)-1);t.position_ids=new G("int64",n,[e.length,1])}else{
const s=t.input_ids.tolist().map(a=>{let o=0;return a.map(i=>i>=C_?0:o++)});t.position_ids=new G("int64",s.flat(),t.input_ids.
dims)}return t.input_ids.dims[1]===1&&(delete t.audio_values,delete t.audio_features,delete t.audio_tokens,delete t.speaker_embeddings,
delete t.speaker_features),xn(this,e,t)}async generate(e){const t=e.past_key_values,{sequences:r,audio_tokens:n,speaker_embeddings:s,
speaker_features:a,past_key_values:o}=await super.generate({...e,return_dict_in_generate:!0});try{const i=r.slice(null,[
e.input_ids.dims[1],-1]),l=ct([i.dims[0],3],IS),c=Oe([n,i,l],1),{waveform:d}=await ve(this.sessions.conditional_decoder,
{speech_tokens:c,speaker_features:a,speaker_embeddings:s});return d}finally{o!==t&&await o?.dispose()}}},Tg=class extends F{},
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
XS=class extends Vl{},Fn=class extends F{},YS=class extends Fn{},KS=class extends Fn{async _call(e){return new Xe(await super.
_call(e))}},JS=class extends Fn{async _call(e){return new ie(await super._call(e))}},ZS=class extends Fn{async _call(e){
return new He(await super._call(e))}},eP=class extends Fn{async _call(e){return new ot(await super._call(e))}},Ul=class extends F{},
tP=class extends Ul{},rP=class extends Ul{async _call(e){return new ie(await super._call(e))}},jl=class extends F{},nP=class extends jl{},
sP=class extends jl{async _call(e){return new ie(await super._call(e))}},ql=class extends F{},aP=class extends ql{},oP=class extends ql{async _call(e){
return new ys(await super._call(e))}},ys=class extends Ve{constructor({logits:e,pred_boxes:t}){super(),this.logits=e,this.
pred_boxes=t}},Wl=class extends F{},iP=class extends Wl{},lP=class extends Wl{async _call(e){return new ys(await super._call(
e))}},Pg=class extends Ve{constructor({audio_codes:e}){super(),this.audio_codes=e}},Fg=class extends Ve{constructor({audio_values:e}){
super(),this.audio_values=e}},Ba=class extends F{main_input_name="input_values";forward_params=["input_values"]},cP=class extends Ba{async encode(e){
return new Pg(await ve(this.sessions.encoder_model,e))}async decode(e){return new Fg(await ve(this.sessions.decoder_model,
e))}},Ig=class extends Ba{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??
"encoder_model"})}},Lg=class extends Ba{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.
model_file_name??"decoder_model"})}},In=class extends F{},uP=class extends In{},dP=class extends In{async _call(e){return new Xe(
await super._call(e))}},hP=class extends In{async _call(e){return new ie(await super._call(e))}},fP=class extends In{async _call(e){
return new He(await super._call(e))}},_P=class extends In{async _call(e){return new ot(await super._call(e))}},Hl=class extends F{},
pP=class extends Hl{},mP=class extends Hl{},Ql=class extends F{},gP=class extends Ql{},wP=class extends Ql{},Ln=class extends F{},
vP=class extends Ln{},yP=class extends Ln{async _call(e){return new Xe(await super._call(e))}},bP=class extends Ln{async _call(e){
return new ie(await super._call(e))}},MP=class extends Ln{async _call(e){return new He(await super._call(e))}},xP=class extends Ln{async _call(e){
return new ot(await super._call(e))}},Og=class extends F{},kP=class extends Og{},Xl=class extends F{},TP=class extends Xl{},
EP=class extends Xl{async _call(e){return new ie(await super._call(e))}},Ng=class extends F{},AP=class extends Ng{},Dg=class extends F{},
CP=class extends Dg{},Ra=class extends F{},SP=class extends Ra{},PP=class extends Ra{async _call(e){return new Yl(await super.
_call(e))}},FP=class extends Ra{async _call(e){return new zg(await super._call(e))}},Yl=class extends Ve{constructor({logits:e,
pred_boxes:t}){super(),this.logits=e,this.pred_boxes=t}},zg=class extends Ve{constructor({logits:e,pred_boxes:t,pred_masks:r}){
super(),this.logits=e,this.pred_boxes=t,this.pred_masks=r}},Kl=class extends F{},IP=class extends Kl{},LP=class extends Kl{async _call(e){
return new ie(await super._call(e))}},Jl=class extends F{},OP=class extends Jl{},NP=class extends Jl{async _call(e){return new ie(
await super._call(e))}},Bg=class extends F{},DP=class extends Bg{},Rg=class extends F{},zP=class extends Rg{},On=class extends F{},
BP=class extends On{},RP=class extends On{async _call(e){return new ie(await super._call(e))}},$P=class extends On{async _call(e){
return new He(await super._call(e))}},GP=class extends On{async _call(e){return new ot(await super._call(e))}},VP=class extends On{async _call(e){
return new Xe(await super._call(e))}},$g=class extends F{},UP=class extends $g{},Zl=class extends F{},jP=class extends Zl{},
qP=class extends Zl{},ec=class extends F{},WP=class extends ec{},HP=class extends ec{async _call(e){return new ie(await super.
_call(e))}},Nn=class extends F{},QP=class extends Nn{},XP=class extends Nn{async _call(e){return new Xe(await super._call(
e))}},YP=class extends Nn{async _call(e){return new ie(await super._call(e))}},KP=class extends Nn{async _call(e){return new He(
await super._call(e))}},JP=class extends Nn{async _call(e){return new ot(await super._call(e))}},Gg=class extends F{},Vg=class extends Gg{async forward({
input_ids:e,attention_mask:t,pixel_values:r=null,image_position_ids:n=null,pixel_values_videos:s=null,video_position_ids:a=null,
input_features:o=null,input_features_mask:i=null}){const l={image_features:r&&await this.encode_image({pixel_values:r,pixel_position_ids:n}),
video_features:s&&await this.encode_image({pixel_values:s,pixel_position_ids:a}),audio_features:o&&await this.encode_audio(
{input_features:o,input_features_mask:i})},{image_token_id:c,video_token_id:d,audio_token_id:h,text_config:_}=this.config,
p={image:c,video:d,audio:h};for(const[w,v]of Object.entries(p)){const y=`${w}_features`;l[y]??=new G("float32",new Float32Array(
0),[0,_.hidden_size]);let b=0;for(const k of e.data)Number(k)===v&&++b;if(b!==l[y].dims[0])throw new Error(`The number o\
f ${w} tokens (${b}) and ${w} features (${l[y].dims[0]}) do not match.`)}return await ve(this.sessions.model,{input_ids:e,
attention_mask:t,...l})}},tc=class extends F{},ZP=class extends tc{},eF=class extends tc{},bs=class extends F{},tF=class extends bs{},
rF=class extends bs{async _call(e){return new Xe(await super._call(e))}},nF=class extends bs{async _call(e){return new ie(
await super._call(e))}},sF=class extends bs{async _call(e){return new He(await super._call(e))}},Ms=class extends F{},aF=class extends Ms{},
oF=class extends Ms{async _call(e){return new Xe(await super._call(e))}},iF=class extends Ms{async _call(e){return new ie(
await super._call(e))}},lF=class extends Ms{async _call(e){return new He(await super._call(e))}},rc=class extends F{},cF=class extends rc{},
uF=class extends rc{},nc=class extends F{},dF=class extends nc{},hF=class extends nc{},sc=class extends F{},fF=class extends sc{},
_F=class extends sc{},ac=class extends F{},pF=class extends ac{},mF=class extends ac{async _call(e){return new ie(await super.
_call(e))}},Ug=class extends F{forward_params=["input_ids","inputs_embeds","attention_mask","pixel_values","encoder_outp\
uts","decoder_input_ids","decoder_inputs_embeds","decoder_attention_mask","past_key_values"];main_input_name="inputs_emb\
eds"},gF=class extends Ug{_merge_input_ids_with_image_features({inputs_embeds:e,image_features:t,input_ids:r,attention_mask:n}){
return{inputs_embeds:Oe([t,e],1),attention_mask:Oe([_t(t.dims.slice(0,2)),n],1)}}async _prepare_inputs_embeds({input_ids:e,
pixel_values:t,inputs_embeds:r,attention_mask:n}){if(!e&&!t)throw new Error("Either `input_ids` or `pixel_values` should\
 be provided.");let s,a;return e&&(s=await this.encode_text({input_ids:e})),t&&(a=await this.encode_image({pixel_values:t})),
s&&a?{inputs_embeds:r,attention_mask:n}=this._merge_input_ids_with_image_features({inputs_embeds:s,image_features:a,input_ids:e,
attention_mask:n}):r=s||a,{inputs_embeds:r,attention_mask:n}}async forward({input_ids:e,pixel_values:t,attention_mask:r,
decoder_input_ids:n,decoder_attention_mask:s,encoder_outputs:a,past_key_values:o,inputs_embeds:i,decoder_inputs_embeds:l,
num_logits_to_keep:c=null}){if(i||({inputs_embeds:i,attention_mask:r}=await this._prepare_inputs_embeds({input_ids:e,pixel_values:t,
inputs_embeds:i,attention_mask:r})),!a){let{last_hidden_state:h}=await Sr(this,{inputs_embeds:i,attention_mask:r});a=h}if(!l){
if(!n)throw new Error("Either `decoder_input_ids` or `decoder_inputs_embeds` should be provided.");l=await this.encode_text(
{input_ids:n})}return await dr(this,{inputs_embeds:l,attention_mask:s,encoder_attention_mask:r,encoder_hidden_states:a,past_key_values:o,
num_logits_to_keep:c},!0)}},oc=class extends F{},wF=class extends oc{},vF=class extends oc{},ic=class extends F{},yF=class extends ic{},
bF=class extends ic{},jg=class extends F{forward_params=["input_ids","attention_mask","pixel_values","position_ids","pas\
t_key_values"]},$t=class extends jg{_merge_input_ids_with_image_features(e){const t=e.image_features.dims.at(-1),r=e.image_features.
view(-1,t);return Cl({image_token_id:this.config.image_token_index??this.config.image_token_id,...e,image_features:r})}},
MF=class extends $t{},xF=class extends $t{},qg=class extends F{},kF=class extends qg{},Wg=class extends $t{},TF=class extends Wg{},
Hg=class extends F{forward_params=["input_ids","attention_mask","inputs_embeds","per_layer_inputs","position_ids","pixel\
_values","input_features","input_features_mask","past_key_values"]},$a=class extends Hg{async forward({input_ids:e=null,
attention_mask:t=null,pixel_values:r=null,input_features:n=null,input_features_mask:s=null,position_ids:a=null,inputs_embeds:o=null,
per_layer_inputs:i=null,past_key_values:l=null,generation_config:c=null,logits_processor:d=null,num_logits_to_keep:h=null,
..._}){if((!o||!i)&&({inputs_embeds:o,per_layer_inputs:i}=await ve(this.sessions.embed_tokens,{input_ids:e}),e.dims[1]!==
1)){if(r){const{image_features:w}=await this._encode_vision({pixel_values:r,..._});({inputs_embeds:o,attention_mask:t}=this.
_merge_input_ids_with_image_features({image_features:w,inputs_embeds:o,input_ids:e,attention_mask:t}))}if(n){const{audio_features:w}=await ve(
this.sessions.audio_encoder,{input_features:n,input_features_mask:s});({inputs_embeds:o,attention_mask:t}=this._merge_input_ids_with_audio_features(
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
if(t){const{data:r,dims:n}=yg(t),s=BigInt64Array.from({length:3*r.length},(o,i)=>r[i%r.length]),a=Array.from({length:n[0]},
(o,i)=>We(r.subarray(n[1]*i,n[1]*(i+1)))[0]+1n+BigInt(n[1]));return[new G("int64",s,[3,...n]),new G("int64",a,[a.length,
1])]}else{const[r,n]=e.dims,s=BigInt64Array.from({length:3*r*n},(a,o)=>BigInt(Math.floor(o%n/r)));return[new G("int64",s,
[3,...e.dims]),bm([r,1])]}}_reorder_and_write_positions(e,t,r,n){const s=e.reduce((l,c)=>l+c.length,0),a=new Array(s);let o=0;
for(let l=0;l<3;++l)for(const c of e){const d=c.length/3;for(let h=l*d;h<(l+1)*d;++h)a[o++]=c[h]}let i=0;for(let l=0;l<t.
length;++l)if(t[l]==1){for(let c=0;c<3;++c)r[c][n][l]=a[c*s/3+i];++i}return a}_get_multimodal_rope_positions({filtered_ids:e,
image_grid_thw_list:t,video_grid_thw_list:r,spatial_merge_size:n,state:s}){const{image_token_id:a,video_token_id:o,vision_start_token_id:i}=this.
config,l=e,d=l.reduce((b,k,A)=>(k==i&&b.push(A),b),[]).map(b=>l[b+1]),h=d.filter(b=>b==a).length,_=d.filter(b=>b==o).length,
p=[];let w=0,v=h,y=_;for(let b=0;b<d.length;++b){const k=l.findIndex((L,O)=>O>w&&L==a),A=l.findIndex((L,O)=>O>w&&L==o),E=v>
0&&k!==-1?k:l.length+1,C=y>0&&A!==-1?A:l.length+1;let N,M,$,R;E<C?([M,$,R]=t[s.image_index],++s.image_index,--v,N=E):([M,
$,R]=r[s.video_index],++s.video_index,--y,N=C);const[j,Y,Q]=[Number(M),Math.floor(Number($)/n),Math.floor(Number(R)/n)],
z=N-w,I=p.length>0?We(p.at(-1))[0]+1:0;p.push(Array.from({length:3*z},(L,O)=>I+O%z));const U=z+I,X=j*Y*Q,ce=Array.from({
length:X},(L,O)=>U+Math.floor(O/(Y*Q))),Z=Array.from({length:X},(L,O)=>U+Math.floor(O/Q)%Y),ne=Array.from({length:X},(L,O)=>U+
O%Q);p.push([ce,Z,ne].flat()),w=N+X}if(w<l.length){const b=p.length>0?We(p.at(-1))[0]+1:0,k=l.length-w;p.push(Array.from(
{length:3*k},(A,E)=>b+E%k))}return p}get_rope_index(e,t,r,n){const{vision_config:s}=this.config,a=s.spatial_merge_size??
2;if(t||r){const o=e.tolist();n||(n=ll(e));const i=n.tolist(),l=Array.from({length:3},()=>Array.from({length:e.dims[0]},
()=>Array.from({length:e.dims[1]},()=>0))),c=t?t.tolist():[],d=r?r.tolist():[],h={image_index:0,video_index:0},_=[];for(let p=0;p<
o.length;++p){const w=o[p].filter((b,k)=>i[p][k]==1),v=this._get_multimodal_rope_positions({filtered_ids:w,image_grid_thw_list:c,
video_grid_thw_list:d,spatial_merge_size:a,state:h}),y=this._reorder_and_write_positions(v,i[p],l,p);_.push(We(y)[0]+1-o[p].
length)}return[new G("int64",l.flat(1/0),[3,e.dims[0],e.dims[1]]),new G("int64",_,[_.length,1])]}else return this._get_text_only_rope_index(
e,n)}async encode_image({pixel_values:e,image_grid_thw:t}){return(await ve(this.sessions.vision_encoder,{pixel_values:e,
[this.image_grid_thw_name]:t})).image_features}_merge_input_ids_with_image_features(e){return Cl({image_token_id:this.config.
image_token_id,...e})}prepare_inputs_for_generation(e,t,r){if(ws(this,t,1n),!t.attention_mask||t.position_ids||!(this.sessions.
decoder_model_merged??this.sessions.model).inputNames.includes("position_ids"))return t;if(!t.past_key_values)[t.position_ids,
t.rope_deltas]=this.get_rope_index(t.input_ids,t.image_grid_thw,t.video_grid_thw,t.attention_mask);else{t.pixel_values=null;
const s=t.past_key_values.get_seq_length();if(s<t.input_ids.dims[1]){const[a,o]=this.get_rope_index(t.input_ids,t.image_grid_thw,
t.video_grid_thw,t.attention_mask);t.rope_deltas=o,t.position_ids=a.slice(null,null,[s,null]),t.input_ids=t.input_ids.slice(
null,[s,null])}else{t.rope_deltas||([,t.rope_deltas]=this.get_rope_index(t.input_ids,t.image_grid_thw,t.video_grid_thw,t.
attention_mask));const a=BigInt(s),o=t.rope_deltas.map(i=>a+i);t.position_ids=ur([o,o,o],0)}}return t}},Xg=class extends dc{},
hc=class extends dc{image_grid_thw_name="image_grid_thw"},Yg=class extends Xg{image_grid_thw_name="image_grid_thw"},IF=class extends hc{get_vision_position_ids(e,t,r,n){
const s=Math.floor(t[0]/r),a=Math.floor(t[1]/n),o=Math.floor(t[2]/n),i=a*o*s,l=Array.from({length:i},()=>e),c=Array.from(
{length:i},(h,_)=>e+Math.floor(_/(o*s))),d=Array.from({length:i},(h,_)=>e+_%o);return[...l,...c,...d]}_get_multimodal_rope_positions({
filtered_ids:e,image_grid_thw_list:t,video_grid_thw_list:r,spatial_merge_size:n,state:s}){const{image_token_id:a}=this.config,
o=[];let i=0,l=e[0]==a?1:0;for(let h=1;h<=e.length;++h){const _=h<e.length?e[h]==a?1:0:-1;_!==l&&(o.push([l,i,h]),i=h,l=
_)}let c=0;const d=[];for(const[h,_,p]of o)if(h===0){const w=p-_;d.push(Array.from({length:3*w},(v,y)=>c+y%w)),c+=w}else{
const w=t[s.image_index++].map(Number),v=w[0];d.push(this.get_vision_position_ids(c,w,v,n)),c+=Math.max(w[1],w[2])/n}return d}},
fc=class extends F{},LF=class extends fc{},OF=class extends fc{},_c=class extends F{},NF=class extends _c{},DF=class extends _c{},
pc=class extends F{},zF=class extends pc{},BF=class extends pc{},mc=class extends F{},RF=class extends mc{},$F=class extends mc{},
gc=class extends F{},GF=class extends gc{},VF=class extends gc{},wc=class extends F{},UF=class extends wc{},jF=class extends wc{},
vc=class extends F{},qF=class extends vc{},WF=class extends vc{},yc=class extends F{},HF=class extends yc{},QF=class extends yc{},
bc=class extends F{},XF=class extends bc{},YF=class extends bc{},Kg=class extends F{forward_params=["input_ids","attenti\
on_mask","position_ids","audio_values","past_key_values"]},Mc=class extends Kg{_merge_input_ids_with_audio_features(e){const t=e.
audio_features.dims.at(-1),r=e.audio_features.view(-1,t);return Mg({audio_token_id:this.config.ignore_index??this.config.
audio_token_id??this.config.audio_token_index,...e,audio_features:r})}},KF=class extends Mc{forward_params=["input_ids",
"attention_mask","input_features","past_key_values"]},Jg=class extends F{},JF=class extends Jg{},Zg=class extends F{},ZF=class extends Zg{},
xc=class extends F{},eI=class extends xc{},tI=class extends xc{},kc=class extends F{},rI=class extends kc{},nI=class extends kc{async _call(e){
return new ie(await super._call(e))}},Tc=class extends F{},sI=class extends Tc{},aI=class extends Tc{forward_params=["in\
put_ids","attention_mask","token_type_ids","past_key_values"];prepare_inputs_for_generation(e,t,r){const n=xn(this,e,t);
return n.token_type_ids=(n.past_key_values?cl:ll)(n.input_ids),n}},Fr=class extends F{},oI=class extends Fr{},iI=class extends Fr{async _call(e){
return new Pr(await super._call(e))}},lI=class extends Fr{async _call(e){return new ie(await super._call(e))}},cI=class extends Fr{async _call(e){
return new He(await super._call(e))}},uI=class extends F{},dI=class extends Fr{},hI=class extends Fr{async _call(e){return new Pr(
await super._call(e))}},fI=class extends Fr{async _call(e){return new ie(await super._call(e))}},Ec=class extends F{},_I=class extends Ec{},
pI=class extends Ec{},ew=class extends $t{forward_params=["input_ids","attention_mask","pixel_values","pixel_attention_m\
ask","position_ids","past_key_values"]},Ac=class extends F{},mI=class extends Ac{},gI=class extends Ac{async _call(e){return new ie(
await super._call(e))}},Cc=class extends F{},wI=class extends Cc{},vI=class extends Cc{},Ga=class extends F{},yI=class extends Ga{async forward(e){
const t=!e.input_ids,r=!e.pixel_values;if(t&&r)throw new Error("Either `input_ids` or `pixel_values` should be provided.");
if(t&&(e.input_ids=_t([e.pixel_values.dims[0],1])),r){const{image_size:l}=this.config.vision_config;e.pixel_values=ct([0,
3,l,l],0)}const{text_embeddings:n,image_embeddings:s,l2norm_text_embeddings:a,l2norm_image_embeddings:o}=await super.forward(
e),i={};return t||(i.text_embeddings=n,i.l2norm_text_embeddings=a),r||(i.image_embeddings=s,i.l2norm_image_embeddings=o),
i}},tw=class extends Ga{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??
"text_model"})}},bI=class extends Ga{static async from_pretrained(e,t={}){return super.from_pretrained(e,{...t,model_file_name:t.
model_file_name??"vision_model"})}},Sc=class extends F{},MI=class extends Sc{},xI=class extends Sc{},kI=class extends $t{},
Pc=class extends F{},TI=class extends Pc{},EI=class extends Pc{},AI=class extends $t{forward_params=["input_ids","attent\
ion_mask","pixel_values","pixel_attention_mask","spatial_shapes","position_ids","past_key_values"]},Fc=class extends F{},
CI=class extends Fc{},SI=class extends Fc{},PI=class extends $t{forward_params=["input_ids","attention_mask","pixel_valu\
es","image_grid_thw","position_ids","past_key_values"]},Ic=class extends F{},FI=class extends Ic{},II=class extends Ic{},
rw=class extends F{},LI=class extends rw{},Lc=class extends F{},OI=class extends Lc{},NI=class extends Lc{},Oc=class extends F{},
DI=class extends Oc{},zI=class extends Oc{},Nc=class extends F{},BI=class extends Nc{},RI=class extends Nc{},Dc=class extends F{},
$I=class extends Dc{},GI=class extends Dc{},xs=class extends F{},VI=class extends xs{},UI=class extends xs{},jI=class extends xs{async _call(e){
return new ie(await super._call(e))}},qI=class extends xs{},nw=class extends F{},WI=class extends nw{},sw=class extends F{},
HI=class extends sw{},aw=class extends Ve{constructor({char_logits:e,bpe_logits:t,wp_logits:r}){super(),this.char_logits=
e,this.bpe_logits=t,this.wp_logits=r}get logits(){return[this.char_logits,this.bpe_logits,this.wp_logits]}},ow=class extends F{},
QI=class extends ow{async _call(e){return new aw(await super._call(e))}},iw=class extends Ve{constructor({audio_codes:e}){
super(),this.audio_codes=e}},lw=class extends Ve{constructor({audio_values:e}){super(),this.audio_values=e}},Va=class extends F{main_input_name="\
input_values";forward_params=["input_values"]},XI=class extends Va{async encode(e){return new iw(await ve(this.sessions.
encoder_model,e))}async decode(e){return new lw(await ve(this.sessions.decoder_model,e))}},cw=class extends Va{static async from_pretrained(e,t={}){
return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??"encoder_model"})}},uw=class extends Va{static async from_pretrained(e,t={}){
return super.from_pretrained(e,{...t,model_file_name:t.model_file_name??"decoder_model"})}},zc=class extends F{},YI=class extends zc{},
KI=class extends zc{},Bc=class extends F{},JI=class extends Bc{},ZI=class extends Bc{},Rc=class extends F{},eL=class extends Rc{},
tL=class extends Rc{},rL=class extends $t{},$c=class extends F{},nL=class extends $c{},sL=class extends $c{},ks=class extends F{},
aL=class extends ks{},oL=class extends ks{async _call(e){return new Xe(await super._call(e))}},iL=class extends ks{async _call(e){
return new ie(await super._call(e))}},lL=class extends ks{async _call(e){return new ot(await super._call(e))}},Gc=class extends F{},
cL=class extends Gc{},uL=class extends Gc{},Ua=class extends F{},dL=class extends Ua{},hL=class extends Ua{async _call(e){
return new ie(await super._call(e))}},fL=class extends Ua{},ja=class extends F{},_L=class extends ja{},pL=class extends ja{async _call(e){
return new ie(await super._call(e))}},mL=class extends ja{},qa=class extends F{},gL=class extends qa{},wL=class extends qa{async _call(e){
return new ie(await super._call(e))}},vL=class extends qa{},Wa=class extends F{},yL=class extends Wa{},bL=class extends Wa{async _call(e){
return new ie(await super._call(e))}},ML=class extends Wa{},Vc=class extends F{},xL=class extends Vc{},kL=class extends Vc{async _call(e){
return new ie(await super._call(e))}},Uc=class extends F{},TL=class extends Uc{},EL=class extends Uc{async _call(e){return new ie(
await super._call(e))}},Ts=class extends F{},AL=class extends Ts{},CL=class extends Ts{async _call(e){return new Xe(await super.
_call(e))}},SL=class extends Ts{async _call(e){return new ie(await super._call(e))}},PL=class extends Ts{async _call(e){
return new He(await super._call(e))}},jc=class extends F{},FL=class extends jc{},IL=class extends jc{},qc=class extends F{requires_attention_mask=!1;main_input_name="\
input_values";forward_params=["input_values","decoder_input_ids","past_key_values"]},LL=class extends qc{},OL=class extends qc{},
Dn=class extends F{},NL=class extends Dn{},DL=class extends Dn{async _call(e){return new Xe(await super._call(e))}},zL=class extends Dn{async _call(e){
return new ie(await super._call(e))}},BL=class extends Dn{async _call(e){return new He(await super._call(e))}},RL=class extends Dn{async _call(e){
return new ot(await super._call(e))}},Wc=class extends F{},$L=class extends Wc{},GL=class extends Wc{},Hc=class extends F{},
VL=class extends Hc{},UL=class extends Hc{},dw=class extends F{},jL=class extends dw{forward_params=["input_ids","pixel_\
values","images_seq_mask","images_emb_mask","attention_mask","position_ids","past_key_values"];constructor(...e){super(...e),
this._generation_mode="text"}async forward(e){const t=this._generation_mode??"text";let r;if(t==="text"||!e.past_key_values){
const i=this.sessions.prepare_inputs_embeds,l=Ze(e,i.inputNames);r=await ve(i,l)}else{const i=this.sessions.gen_img_embeds,
l=Ze({image_ids:e.input_ids},i.inputNames);r=await ve(i,l)}const n={...e,...r},s=await dr(this,n),a=this.sessions[t==="t\
ext"?"lm_head":"gen_head"];if(!a)throw new Error(`Unable to find "${a}" generation head`);const o=await ve(a,Ze(s,a.inputNames));
return{...r,...s,...o}}prepare_inputs_for_generation(e,t,r){const n=!!t.past_key_values;return ws(this,t,1n),r.guidance_scale!==
null&&r.guidance_scale>1&&(n?t.input_ids=Oe([t.input_ids,t.input_ids],0):(t.input_ids=Oe([t.input_ids,xi(t.input_ids,BigInt(
r.pad_token_id))],0),t.attention_mask=Oe([t.attention_mask,xi(t.attention_mask,0n)],0))),(n||!t.pixel_values)&&(t.pixel_values=
ct([0,0,3,384,384],1)),n&&(t.images_seq_mask=new G("bool",new Array(1).fill(!0).fill(!1,0,1),[1,1]),t.images_emb_mask=new G(
"bool",new Array(0).fill(!1),[1,1,0])),t}async generate(e){return this._generation_mode="text",super.generate(e)}async generate_images(e){
this._generation_mode="image";const t=(e.inputs??e[this.main_input_name]).dims[1],n=(await super.generate(e)).slice(null,
[t,null]),s=this.sessions.image_decode,{decoded_image:a}=await ve(s,{generated_tokens:n}),o=a.add_(1).mul_(255/2).clamp_(
0,255).to("uint8"),i=[];for(const l of o){const c=Mt.fromTensor(l);i.push(c)}return i}},Qc=class extends F{},qL=class extends Qc{},
WL=class extends Qc{},hw=class extends F{forward_params=["input_ids","attention_mask","encoder_outputs","decoder_input_i\
ds","decoder_attention_mask","past_key_values"];_apply_and_filter_by_delay_pattern_mask(e){const[t,r]=e.dims,n=this.config.
decoder.num_codebooks,s=r-n;let a=0;for(let l=0;l<e.size;++l){if(e.data[l]==this.config.decoder.pad_token_id)continue;const c=l%
r,d=Math.floor(l/r)%n,h=c-d;h>0&&h<=s&&(e.data[a++]=e.data[l])}const o=Math.floor(t/n),i=a/(o*n);return new G(e.type,e.data.
slice(0,a),[o,n,i])}prepare_inputs_for_generation(e,t,r){const n=BigInt(this.config.decoder.pad_token_id);let s=structuredClone(
e);for(let a=0;a<s.length;++a)for(let o=0;o<s[a].length;++o)a%this.config.decoder.num_codebooks>=o&&(s[a][o]=n);return r.
guidance_scale!==null&&r.guidance_scale>1&&(s=s.concat(s)),ka(this,s,t)}async generate(e){const t=await super.generate(e),
r=this._apply_and_filter_by_delay_pattern_mask(t).unsqueeze_(0),{audio_values:n}=await ve(this.sessions.encodec_decode,{
audio_codes:r});return n}},Xc=class extends F{},HL=class extends Xc{},QL=class extends Xc{},Yc=class extends F{},XL=class extends Yc{},
YL=class extends Yc{},zn=class extends F{},KL=class extends zn{},JL=class extends zn{async _call(e){return new Xe(await super.
_call(e))}},ZL=class extends zn{async _call(e){return new ie(await super._call(e))}},eO=class extends zn{async _call(e){
return new He(await super._call(e))}},tO=class extends zn{async _call(e){return new ot(await super._call(e))}},fw=class extends F{},
rO=class extends fw{},Kc=class extends F{},nO=class extends Kc{},sO=class extends Kc{},Jc=class extends F{},aO=class extends Jc{},
oO=class extends Jc{},Zc=class extends F{},iO=class extends Zc{},lO=class extends Zc{},eu=class extends F{},cO=class extends eu{},
uO=class extends eu{},tu=class extends F{},dO=class extends tu{},hO=class extends tu{async _call(e){return new ie(await super.
_call(e))}},ru=class extends F{},fO=class extends ru{},_O=class extends ru{},nu=class extends F{},pO=class extends nu{},
mO=class extends nu{},su=class extends F{},gO=class extends su{},wO=class extends su{},au=class extends F{},vO=class extends au{},
yO=class extends au{},bO=class extends $t{},_w=class extends F{},MO=class extends _w{async _call(e){return new Pr(await super.
_call(e))}},ou=class extends F{},xO=class extends ou{},kO=class extends ou{},iu=class extends F{},TO=class extends iu{},
EO=class extends iu{},lu=class extends F{},AO=class extends lu{},CO=class extends lu{},cu=class extends F{},SO=class extends cu{},
PO=class extends cu{},pw=class extends F{forward_params=["input_ids","inputs_embeds","attention_mask","position_ids","pi\
xel_values","image_sizes","past_key_values"]},mw=class extends pw{async forward({input_ids:e=null,attention_mask:t=null,
pixel_values:r=null,image_sizes:n=null,position_ids:s=null,inputs_embeds:a=null,past_key_values:o=null,generation_config:i=null,
logits_processor:l=null,num_logits_to_keep:c=null,...d}){if(!a){let _;if(r&&e.dims[1]!==1){if(!n)throw new Error("`image\
_sizes` must be provided when `pixel_values` is provided.");({image_features:_}=await ve(this.sessions.vision_encoder,{pixel_values:r,
image_sizes:n}))}else{const p=this.config.normalized_config.hidden_size;_=new G("float32",[],[0,p])}({inputs_embeds:a}=await ve(
this.sessions.prepare_inputs_embeds,{input_ids:e,image_features:_}))}return await dr(this,{inputs_embeds:a,past_key_values:o,
attention_mask:t,position_ids:s,generation_config:i,logits_processor:l,num_logits_to_keep:c},!1)}},uu=class extends F{},
FO=class extends uu{},IO=class extends uu{async _call(e){return new ie(await super._call(e))}},du=class extends F{},LO=class extends du{},
OO=class extends du{async _call(e){return new He(await super._call(e))}},hu=class extends F{},NO=class extends hu{},DO=class extends hu{},
fu=class extends F{},zO=class extends fu{},BO=class extends fu{},_u=class extends F{},RO=class extends _u{},$O=class extends _u{},
pu=class extends F{},GO=class extends pu{},VO=class extends pu{},mu=class extends F{},UO=class extends mu{},jO=class extends mu{},
gu=class extends hc{},gw=class extends Yg{},qO=class extends gu{},WO=class extends gw{},wu=class extends gu{},ww=class extends wu{},
HO=class extends wu{},QO=class extends ww{},vu=class extends F{},XO=class extends vu{},YO=class extends vu{async _call(e){
return new ie(await super._call(e))}},yu=class extends F{},KO=class extends yu{},JO=class extends yu{async _call(e){return new vw(
await super._call(e))}},vw=class extends ys{},Bn=class extends F{},ZO=class extends Bn{},eN=class extends Bn{async _call(e){
return new Xe(await super._call(e))}},tN=class extends Bn{async _call(e){return new ie(await super._call(e))}},rN=class extends Bn{async _call(e){
return new He(await super._call(e))}},nN=class extends Bn{async _call(e){return new ot(await super._call(e))}},Rn=class extends F{},
sN=class extends Rn{},aN=class extends Rn{async _call(e){return new Xe(await super._call(e))}},oN=class extends Rn{async _call(e){
return new ie(await super._call(e))}},iN=class extends Rn{async _call(e){return new He(await super._call(e))}},lN=class extends Rn{async _call(e){
return new ot(await super._call(e))}},bu=class extends F{},cN=class extends bu{},uN=class extends bu{async _call(e){return new yw(
await super._call(e))}},yw=class extends ys{},bw=class extends Ve{constructor({iou_scores:e,pred_masks:t}){super(),this.
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
vided.");const n=this.sessions.prompt_encoder_mask_decoder,s=Ze(e,n.inputNames);return await ve(n,s)}async _call(e){return new xw(
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
threshold:r=.5,minlenratio:n=0,maxlenratio:s=20,vocoder:a=null}={}){const o={input_ids:e},{encoder_outputs:i,encoder_attention_mask:l}=await Sr(
this,o),c=i.dims[1]/this.config.reduction_factor,d=Math.floor(c*s),h=Math.floor(c*n),_=this.config.num_mel_bins;let p=[],
w=null,v=null,y=0;for(;;){++y;const A=gg(!!v);let E;v?E=v.output_sequence_out:E=new G("float32",new Float32Array(_),[1,1,
_]);let C={use_cache_branch:A,output_sequence:E,encoder_attention_mask:l,speaker_embeddings:t,encoder_hidden_states:i};Al(
this,C,w),v=await ve(this.sessions.decoder_model_merged,C),w=Pi(v,w);const{prob:N,spectrum:M}=v;if(p.push(M),y>=h&&(Array.
from(N.data).filter($=>$>=r).length>0||y>=d))break}const b=Oe(p),{waveform:k}=await ve(a.sessions.model,{spectrogram:b});
return{spectrogram:b,waveform:k}}},FN=class extends F{main_input_name="spectrogram"},Es=class extends F{},IN=class extends Es{},
LN=class extends Es{async _call(e){return new Xe(await super._call(e))}},ON=class extends Es{async _call(e){return new ie(
await super._call(e))}},NN=class extends Es{async _call(e){return new ot(await super._call(e))}},Eu=class extends F{},DN=class extends Eu{},
zN=class extends Eu{},Au=class extends F{},BN=class extends Au{},RN=class extends Au{},Cw=class extends F{},$N=class extends Cw{},
Sw=class extends F{},Pw=class extends Sw{async generate_speech({input_ids:e,attention_mask:t,style:r,num_inference_steps:n=5,
speed:s=1.05}){const{sampling_rate:a,chunk_compress_factor:o,base_chunk_size:i,latent_dim:l}=this.config,{last_hidden_state:c,
durations:d}=await ve(this.sessions.text_encoder,{input_ids:e,attention_mask:t,style:r}),h=d.div(s).mul_(a),_=i*o,p=h.data,
w=Int32Array.from(p,R=>Math.ceil(R/_)),v=Math.max(...w),y=e.dims[0],b=new BigInt64Array(y*v);for(let R=0;R<y;++R)b.fill(
1n,R*v,R*v+w[R]);const k=new G("int64",b,[y,v]),A=l*o,E=A*v;let C=JT([y,A,v]);const N=C.data;for(let R=0;R<y;++R)if(w[R]!==
v)for(let j=0;j<A;++j)N.fill(0,R*E+j*v+w[R],R*E+(j+1)*v);const M=ct([y],n);for(let R=0;R<n;++R){const j=ct([y],R);({denoised_latents:C}=
await ve(this.sessions.latent_denoiser,{style:r,noisy_latents:C,latent_mask:k,encoder_outputs:c,attention_mask:t,timestep:j,
num_inference_steps:M}))}const{waveform:$}=await ve(this.sessions.voice_decoder,{latents:C});return{waveform:$,durations:h}}},
Ka=class extends F{},GN=class extends Ka{},VN=class extends Ka{async _call(e){return new ie(await super._call(e))}},UN=class extends Ka{},
Cu=class extends F{},jN=class extends Cu{},qN=class extends Cu{},Su=class extends F{forward_params=["input_ids","attenti\
on_mask","encoder_outputs","decoder_input_ids","decoder_attention_mask","past_key_values"]},WN=class extends Su{},HN=class extends Su{},
Pu=class extends F{},QN=class extends Pu{},XN=class extends Pu{async _call(e){return new Fw(await super._call(e))}},Fw=class extends Yl{},
Iw=class extends F{},YN=class extends Iw{},Ja=class extends F{},KN=class extends Ja{},JN=class extends Ja{async _call(e){
return new Pr(await super._call(e))}},ZN=class extends Ja{async _call(e){return new ie(await super._call(e))}},As=class extends F{},
e3=class extends As{},t3=class extends As{async _call(e){return new Pr(await super._call(e))}},r3=class extends As{async _call(e){
return new ie(await super._call(e))}},n3=class extends As{async _call(e){return new He(await super._call(e))}},Fu=class extends F{},
s3=class extends Fu{},a3=class extends Fu{},o3=class extends F{main_input_name="pixel_values";forward_params=["pixel_val\
ues","decoder_input_ids","encoder_hidden_states","past_key_values"]},Iu=class extends F{},i3=class extends Iu{},l3=class extends Iu{async _call(e){
return new ie(await super._call(e))}},Lw=class extends F{},c3=class extends Lw{},Lu=class extends F{},u3=class extends Lu{},
d3=class extends Lu{async _call(e){return new ie(await super._call(e))}},Ow=class extends F{},h3=class extends Ow{async _call(e){
return new dg(await super._call(e))}},Nw=class extends F{},f3=class extends Nw{},Dw=class extends Ve{constructor({waveform:e,
spectrogram:t}){super(),this.waveform=e,this.spectrogram=t}},zw=class extends F{},_3=class extends zw{async _call(e){return new Dw(
await super._call(e))}},p3=class extends Mc{},S_=2,m3=1,di=new WeakMap;function g3(e,t){const{text_config:r,audio_config:n}=e.
config,s=e.sessions.audio_encoder,{num_mel_bins:a,hidden_size:o}=n,i=a+o,l=new Ml,c=Oa(n),d={batch_size:1};let h="float3\
2";for(const v of s.inputMetadata){if(v.name==="past_padding_cache"){h=v.type;continue}if(!c.has(v.name))continue;const y=wg(
v.shape,d),b=y.reduce((A,E)=>A*E,1),k=ls[v.type];l[v.name]=new G(v.type,new k(b),y)}const _=ls[h],p=new G(h,new _(i*S_),
[1,i,S_]),w=t[Symbol.asyncIterator]?.()??t[Symbol.iterator]?.();if(!w)throw new Error("input_features must be iterable o\
r async iterable");return{encoder_session:s,enc_kv_cache:l,enc_padding_cache:p,enc_past_seq_len:0,audio_embed_queue:[],audio_embed_total_tokens:0,
audio_queue_offset:0,audio_consumed:0,stream_exhausted:!1,chunks_iter:w,text_hidden_size:r.hidden_size}}async function w3(e,t){
const r=t.dims[2],n=Math.floor((m3+r-3)/2)+1,s=new G("int64",BigInt64Array.from({length:n},(d,h)=>BigInt(e.enc_past_seq_len+
h)),[1,n]),a=e.enc_past_seq_len+n,o=_t([1,a]),{audio_embeds:i,present_padding_cache:l,...c}=await ve(e.encoder_session,{
input_features:t,attention_mask:o,position_ids:s,past_padding_cache:e.enc_padding_cache,...e.enc_kv_cache});e.enc_padding_cache.
location==="gpu-buffer"&&e.enc_padding_cache.dispose(),e.enc_padding_cache=l;for(const d in c)if(d.startsWith("present.")){
const h=d.replace("present","past_key_values"),_=e.enc_kv_cache[h];_?.location==="gpu-buffer"&&_.dispose(),e.enc_kv_cache[h]=
c[d]}return e.enc_past_seq_len=a,i}async function v3(e,t){for(;e.audio_embed_total_tokens<t&&!e.stream_exhausted;){const r=await e.
chunks_iter.next();if(r.done){e.stream_exhausted=!0;break}const n=await w3(e,r.value);e.audio_embed_queue.push({data:n.data,
tokens:n.dims[1]}),e.audio_embed_total_tokens+=n.dims[1]}}function y3(e,t,r){if(e.audio_embed_queue.length===0)return;const n=t.
data;let s=0,a=r;for(;a>0&&e.audio_embed_queue.length>0;){const o=e.audio_embed_queue[0],i=o.tokens-e.audio_queue_offset,
l=Math.min(a,i),c=e.audio_queue_offset*e.text_hidden_size;for(let d=0;d<l*e.text_hidden_size;++d)n[s*e.text_hidden_size+
d]+=o.data[c+d];s+=l,a-=l,e.audio_queue_offset+=l,e.audio_queue_offset>=o.tokens&&(e.audio_embed_queue.shift(),e.audio_queue_offset=
0)}e.audio_consumed+=r-a}var b3=class extends gs{constructor(e){super(),this._s=e}_call(e){const t=this._s.stream_exhausted&&
this._s.audio_embed_queue.length===0;return e.map(()=>t)}},Bw=class extends F{forward_params=["input_ids","attention_mas\
k","position_ids","past_key_values"]},Rw=class extends Bw{async forward({input_ids:e,past_key_values:t,...r}){const n=e.
dims[1],s=di.get(this);s&&await v3(s,s.audio_consumed+n);const{inputs_embeds:a}=await ve(this.sessions.embed_tokens,{input_ids:e});
s&&y3(s,a,n);const o={inputs_embeds:a,...r};Al(this,o,t);const i=this.sessions.decoder_model_merged,l=Ze(o,i.inputNames);
return await ve(i,l)}async generate({input_features:e,stopping_criteria:t,...r}){if(!e)throw new Error("input_features (\
generator/iterable) must be provided");const n=g3(this,e);di.set(this,n);const s=new _g;s.push(new b3(n)),t&&s.extend(t);
try{return await super.generate({...r,stopping_criteria:s})}finally{n.enc_kv_cache.dispose(),di.delete(this)}}},Za=class extends F{},
M3=class extends Za{},x3=class extends Za{async _call(e){return new Pr(await super._call(e))}},k3=class extends Za{async _call(e){
return new ie(await super._call(e))}},$w=class extends Ve{constructor({logits:e,embeddings:t}){super(),this.logits=e,this.
embeddings=t}},$n=class extends F{},T3=class extends $n{},E3=class extends $n{async _call(e){return new Pr(await super._call(
e))}},A3=class extends $n{async _call(e){return new ie(await super._call(e))}},C3=class extends $n{async _call(e){return new $w(
await super._call(e))}},S3=class extends $n{async _call(e){return new He(await super._call(e))}},Gw=class extends F{},P3=class extends Gw{},
F3=class extends fg{return_timestamps=null;return_token_timestamps=null;num_frames=null;alignment_heads=null;task=null;language=null;no_timestamps_token_id=null;prompt_ids=null;is_multilingual=null;lang_to_id=null;task_to_id=null;max_initial_timestamp_index=1},
Ou=class extends F{requires_attention_mask=!1;main_input_name="input_features";forward_params=["input_features","attenti\
on_mask","decoder_input_ids","decoder_attention_mask","past_key_values"]},I3=class extends Ou{},Vw=class extends Ou{_prepare_generation_config(e,t){
return super._prepare_generation_config(e,t,F3)}_retrieve_init_tokens(e){const t=[e.decoder_start_token_id];let r=e.language;
const n=e.task;if(e.is_multilingual){r||(de.warn("No language specified - defaulting to English (en)."),r="en");const a=`\
<|${HE(r)}|>`;t.push(e.lang_to_id[a]),t.push(e.task_to_id[n??"transcribe"])}else if(r||n)throw new Error("Cannot specify\
 `task` or `language` for an English-only model. If the model is intended to be multilingual, pass `is_multilingual=true\
` to generate, or update the generation config.");return!e.return_timestamps&&e.no_timestamps_token_id&&t.at(-1)!==e.no_timestamps_token_id?
t.push(e.no_timestamps_token_id):e.return_timestamps&&t.at(-1)===e.no_timestamps_token_id&&(de.warn("<|notimestamps|> pr\
ompt token is removed from generation_config since `return_timestamps` is set to `true`."),t.pop()),t.filter(s=>s!=null)}async generate({
inputs:e=null,generation_config:t=null,logits_processor:r=null,stopping_criteria:n=null,...s}){t=this._prepare_generation_config(
t,s);const a=s.decoder_input_ids instanceof G?dl(s.decoder_input_ids):s.decoder_input_ids??this._retrieve_init_tokens(t);
if(t.return_timestamps&&(r??=new Ci,r.push(new FC(t,a))),t.begin_suppress_tokens&&(r??=new Ci,r.push(new hg(t.begin_suppress_tokens,
a.length))),t.return_token_timestamps){if(!t.alignment_heads)throw new Error("Model generation config has no `alignment_\
heads`, token-level timestamps not available. See https://gist.github.com/hollance/42e32852f24243b748ae6bc1f985b13a on h\
ow to add this property to the generation config.");t.task==="translate"&&de.warn("Token-level timestamps may not be rel\
iable for task 'translate'."),t.output_attentions=!0,t.return_dict_in_generate=!0}if(t.return_timestamps&&!s.max_new_tokens)
return this._generate_with_seek({inputs:e,generation_config:t,logits_processor:r,init_tokens:a,kwargs:s});const o=await super.
generate({inputs:e,generation_config:t,logits_processor:r,decoder_input_ids:a,...s});return t.return_token_timestamps&&(o.
token_timestamps=this._extract_token_timestamps(o,t.alignment_heads,t.num_frames,.02,a.length)),o}async _generate_with_seek({
inputs:e,generation_config:t,logits_processor:r,init_tokens:n,kwargs:s}){const a=t.no_timestamps_token_id+1,o=Array.isArray(
t.eos_token_id)?t.eos_token_id[0]:t.eos_token_id,i=t.return_token_timestamps,l=e,c=l.dims[2],d=2,h=this.config.max_source_positions,
_=d*h;let p=0;const w=[],v=[];for(;p<c;){const b=Math.min(p+_,c),k=l.slice(null,null,[p,b]);let A;const E=k.dims[2];if(E<
_){const X=l.dims[1],ce=new Float32Array(X*_),Z=k.data;for(let ne=0;ne<X;++ne)ce.set(Z.subarray(ne*E,(ne+1)*E),ne*_);A=new G(
"float32",ce,[1,X,_])}else A=k;if(r)for(const X of r)"begin_index"in X&&(X.begin_index=n.length);const C=await super.generate(
{inputs:A,generation_config:t,logits_processor:r,decoder_input_ids:n,...s}),M=(i?C.sequences:C)[0].tolist().map(Number).
slice(n.length);let $;if(i){C.token_timestamps=this._extract_token_timestamps(C,t.alignment_heads,Math.floor((b-p)/d),.02,
n.length);const X=p/d*.02;$=C.token_timestamps[0].tolist().slice(n.length).map(ce=>ce+X)}if(M.length>0&&M.at(-1)===o&&M.
pop(),M.length===0)break;const R=M.map(X=>X>=a),j=M.length>=2&&R[M.length-1]&&!R[M.length-2],Y=[];for(let X=0;X<M.length-
1;++X)R[X]&&R[X+1]&&Y.push(X+1);let Q,z=M.length;if(Y.length>0)if(j)Q=b-p;else{const X=Y.at(-1);Q=(M[X-1]-a)*d,z=X}else Q=
b-p;const I=Math.floor(p/d),U=a+1500;for(let X=0;X<z;++X)M[X]>=a&&(M[X]=Math.min(M[X]+I,U));w.push(...M.slice(0,z)),$&&v.
push(...$.slice(0,z)),p+=Q}w.push(o);const y=[...n,...w];if(i){const b=new G("int64",y.map(BigInt),[1,y.length]),k=[...new Array(
n.length).fill(0),...v,0],A=new G("float32",new Float32Array(k),[1,k.length]);return{sequences:b,token_timestamps:A}}return new G(
"int64",y.map(BigInt),[1,y.length])}_extract_token_timestamps(e,t,r=null,n=.02,s=0){if(!e.cross_attentions)throw new Error(
"Model outputs must contain cross attentions to extract timestamps. This is most likely because the model was not export\
ed with `output_attentions=True`.");r==null&&de.warn("`num_frames` has not been set, meaning the entire audio will be an\
alyzed. This may lead to inaccurate token-level timestamps for short audios (< 30 seconds).");let a=this.config.median_filter_width;
a===void 0&&(de.warn("Model config has no `median_filter_width`, using default value of 7."),a=7);const o=e.cross_attentions,
i=Array.from({length:this.config.decoder_layers},(y,b)=>Oe(o.map(k=>k[b]),2)),l=ur(t.map(([y,b])=>{if(y>=i.length)throw new Error(
`Layer index ${y} is out of bounds for cross attentions (length ${i.length}).`);return r?i[y].slice(null,b,null,[0,r]):i[y].
slice(null,b)})).permute(1,0,2,3),[c,d]=ym(l,-2,0,!0),h=l.clone();for(let y=0;y<h.dims[0];++y){const b=h[y];for(let k=0;k<
b.dims[0];++k){const A=b[k],E=c[y][k][0].data,C=d[y][k][0].data;for(let N=0;N<A.dims[0];++N){let M=A[N].data;for(let $=0;$<
M.length;++$)M[$]=(M[$]-C[$])/E[$];M.set(LT(M,a))}}}const _=s>0?h.slice(null,null,[s,h.dims[2]],null):h,p=[ol(_,1)],w=e.
sequences.dims,v=new G("float32",new Float32Array(w[0]*w[1]),w);for(let y=0;y<w[0];++y){const b=p[y].neg().squeeze_(0),[
k,A]=NT(b.tolist()),E=Array.from({length:k.length-1},($,R)=>k[R+1]-k[R]),C=Dt([1],E).map($=>!!$),N=[];for(let $=0;$<C.length;++$)
C[$]&&N.push(A[$]*n);const M=new Array(s).fill(0);M.push(...N),N.length>0&&M.push(N.at(-1)),v[y].data.set(M)}return v}},
L3=class extends Vw{},Gn=class extends F{},O3=class extends Gn{},N3=class extends Gn{async _call(e){return new Xe(await super.
_call(e))}},D3=class extends Gn{async _call(e){return new ie(await super._call(e))}},z3=class extends Gn{async _call(e){
return new He(await super._call(e))}},B3=class extends Gn{async _call(e){return new ot(await super._call(e))}},Vn=class extends F{},
R3=class extends Vn{},$3=class extends Vn{async _call(e){return new Xe(await super._call(e))}},G3=class extends Vn{async _call(e){
return new ie(await super._call(e))}},V3=class extends Vn{async _call(e){return new He(await super._call(e))}},U3=class extends Vn{async _call(e){
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
eNetV4ForImageClassification"]]),nv=new Map([["detr","DetrForObjectDetection"],["rt_detr","RTDetrForObjectDetection"],["\
rt_detr_v2","RTDetrV2ForObjectDetection"],["rf_detr","RFDetrForObjectDetection"],["d_fine","DFineForObjectDetection"],["\
table-transformer","TableTransformerForObjectDetection"],["yolos","YolosForObjectDetection"]]),sv=new Map([["owlvit","Ow\
lViTForObjectDetection"],["owlv2","Owlv2ForObjectDetection"],["grounding-dino","GroundingDinoForObjectDetection"]]),wn=new Map(
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
[Zw,W.Vision2Seq],[ev,W.ImageTextToText],[tv,W.AudioTextToText],[rv,W.EncoderOnly],[wn,W.EncoderOnly],[ov,W.EncoderOnly],
[av,W.EncoderOnly],[hv,W.EncoderOnly],[rD,W.EncoderOnly],[fv,W.EncoderOnly],[_v,W.EncoderOnly],[pv,W.EncoderOnly],[mv,W.
EncoderOnly],[nv,W.EncoderOnly],[sv,W.EncoderOnly],[iv,W.MaskGeneration],[lv,W.EncoderOnly],[cv,W.EncoderOnly],[qw,W.Seq2Seq],
[Ww,W.EncoderOnly],[uv,W.EncoderOnly],[dv,W.EncoderOnly],[gv,W.EncoderOnly]];for(const[e,t]of wv)for(const r of e.values()){
cr.set(r,t);const n=Sl[r];Mn.set(n,r),El.set(r,n)}var nD=[["MusicgenForConditionalGeneration",hw,W.Musicgen],["Phi3VForC\
ausalLM",mw,W.Phi3V],["CLIPTextModelWithProjection",Sg,W.EncoderOnly],["SiglipTextModel",Tw,W.EncoderOnly],["JinaCLIPTex\
tModel",tw,W.EncoderOnly],["ClapTextModelWithProjection",Ag,W.EncoderOnly],["ClapAudioModelWithProjection",Cg,W.EncoderOnly],
["DacEncoderModel",Ig,W.EncoderOnly],["DacDecoderModel",Lg,W.EncoderOnly],["MimiEncoderModel",cw,W.EncoderOnly],["MimiDe\
coderModel",uw,W.EncoderOnly],["SnacEncoderModel",Ew,W.EncoderOnly],["SnacDecoderModel",Aw,W.EncoderOnly],["Gemma3nForCo\
nditionalGeneration",$a,W.ImageAudioTextToText],["Gemma4ForConditionalGeneration",lc,W.ImageAudioTextToText],["Supertoni\
cForConditionalGeneration",Pw,W.Supertonic],["ChatterboxModel",kg,W.Chatterbox],["EmbeddingGemma2Model",Vg,W.MultimodalEncoder],
["VoxtralRealtimeForConditionalGeneration",Rw,W.VoxtralRealtime]];for(const[e,t,r]of nD)cr.set(e,r),Mn.set(t,e),El.set(e,
t);var vv=new Map([["modnet",wn],["birefnet",wn],["isnet",wn],["ben",wn]]);for(const[e,t]of vv.entries())t.set(e,"PreTra\
inedModel"),cr.set(e,W.EncoderOnly),El.set(e,F);var sD=new Set(vv.keys());cr.set("PreTrainedModel",W.EncoderOnly);Mn.set(
F,"PreTrainedModel");var Se={MODEL_FOR_SEQUENCE_CLASSIFICATION_MAPPING_NAMES:Hw,MODEL_FOR_TOKEN_CLASSIFICATION_MAPPING_NAMES:Qw,
MODEL_FOR_TEXT_TO_SPECTROGRAM_MAPPING_NAMES:qw,MODEL_FOR_TEXT_TO_WAVEFORM_MAPPING_NAMES:Ww,MODEL_FOR_MASKED_LM_MAPPING_NAMES:Kw,
MODEL_FOR_QUESTION_ANSWERING_MAPPING_NAMES:Jw,MODEL_FOR_IMAGE_CLASSIFICATION_MAPPING_NAMES:rv,MODEL_FOR_IMAGE_SEGMENTATION_MAPPING_NAMES:wn,
MODEL_FOR_SEMANTIC_SEGMENTATION_MAPPING_NAMES:av,MODEL_FOR_UNIVERSAL_SEGMENTATION_MAPPING_NAMES:ov,MODEL_FOR_OBJECT_DETECTION_MAPPING_NAMES:nv,
MODEL_FOR_ZERO_SHOT_OBJECT_DETECTION_MAPPING_NAMES:sv,MODEL_FOR_MASK_GENERATION_MAPPING_NAMES:iv,MODEL_FOR_CTC_MAPPING_NAMES:lv,
MODEL_FOR_AUDIO_CLASSIFICATION_MAPPING_NAMES:cv,MODEL_FOR_AUDIO_XVECTOR_MAPPING_NAMES:uv,MODEL_FOR_AUDIO_FRAME_CLASSIFICATION_MAPPING_NAMES:dv,
MODEL_FOR_DOCUMENT_QUESTION_ANSWERING_MAPPING_NAMES:tD,MODEL_FOR_IMAGE_MATTING_MAPPING_NAMES:hv,MODEL_FOR_IMAGE_TO_IMAGE_MAPPING_NAMES:fv,
MODEL_FOR_DEPTH_ESTIMATION_MAPPING_NAMES:_v,MODEL_FOR_NORMAL_ESTIMATION_MAPPING_NAMES:pv,MODEL_FOR_POSE_ESTIMATION_MAPPING_NAMES:mv,
MODEL_FOR_IMAGE_FEATURE_EXTRACTION_MAPPING_NAMES:gv,MODEL_FOR_IMAGE_TEXT_TO_TEXT_MAPPING_NAMES:ev,MODEL_FOR_AUDIO_TEXT_TO_TEXT_MAPPING_NAMES:tv,
MODEL_FOR_SEQ_TO_SEQ_CAUSAL_LM_MAPPING_NAMES:Xw,MODEL_FOR_SPEECH_SEQ_2_SEQ_MAPPING_NAMES:jw,MODEL_FOR_CAUSAL_LM_MAPPING_NAMES:Yw,
MODEL_FOR_VISION_2_SEQ_MAPPING_NAMES:Zw};WC(Se);var Pe=class{static MODEL_CLASS_MAPPINGS=null;static BASE_IF_FAIL=!1;static supports(e){
if(!this.MODEL_CLASS_MAPPINGS)return!1;for(const t of this.MODEL_CLASS_MAPPINGS)if(t.has(e))return!0;return this.BASE_IF_FAIL}static async from_pretrained(e,{
progress_callback:t=null,config:r=null,cache_dir:n=null,local_files_only:s=!1,revision:a="main",model_file_name:o=null,subfolder:i="\
onnx",device:l=null,dtype:c=null,use_external_data_format:d=null,session_options:h={}}={}){const _={progress_callback:t,
config:r,cache_dir:n,local_files_only:s,revision:a,model_file_name:o,subfolder:i,device:l,dtype:c,use_external_data_format:d,
session_options:h};if(_.config=await us.from_pretrained(e,_),!this.MODEL_CLASS_MAPPINGS)throw new Error("`MODEL_CLASS_MA\
PPINGS` not implemented for this type of `AutoClass`: "+this.name);const{model_type:p}=_.config;for(const w of this.MODEL_CLASS_MAPPINGS){
let v=w.get(p);if(!v){for(const y of w.values())if(y[0]===p){v=y;break}if(!v)continue}return await Sl[v].from_pretrained(
e,_)}if(this.BASE_IF_FAIL)return sD.has(p)||de.warn(`Unknown model class "${p}", attempting to construct from base class\
.`),await F.from_pretrained(e,_);throw Error(`Unsupported model type: ${p}`)}},rs=class extends Pe{static MODEL_CLASS_MAPPINGS=wv.
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
e.map(t=>Mt.read(t)))}async function vn(e,t){return Array.isArray(e)||(e=[e]),await Promise.all(e.map(r=>typeof r=="stri\
ng"||r instanceof URL?r2(r,t):r instanceof Float64Array?new Float32Array(r):r))}function Fi(e,t){t&&(e=e.map(o=>o|0));const[
r,n,s,a]=e;return{xmin:r,ymin:n,xmax:s,ymax:a}}var je=class extends ft{constructor({task:e,model:t,tokenizer:r=null,processor:n=null}){
super(),this.task=e,this.model=t,this.tokenizer=r,this.processor=n}async dispose(){await this.model.dispose()}},MD=class extends je{async _call(e,{
top_k:t=1}={}){const r=this.tokenizer(e,{padding:!0,truncation:!0}),n=await this.model(r),{problem_type:s,id2label:a}=this.
model.config,o=s==="multi_label_classification"?l=>l.sigmoid():l=>new G("float32",nt(l.data),l.dims),i=[];for(const l of n.
logits){const c=o(l),d=await Cn(c,t),h=d[0].tolist(),p=d[1].tolist().map((w,v)=>({label:a?a[w]:`LABEL_${w}`,score:h[v]}));
t===1?i.push(...p):i.push(p)}return Array.isArray(e)||t===1?i:i[0]}},xD=class extends je{async _call(e,{ignore_labels:t=[
"O"],aggregation_strategy:r="none"}={}){if(r!=="none"&&r!=="simple")throw new Error(`Invalid aggregation_strategy: "${r}\
". Must be one of "none" or "simple".`);const n=Array.isArray(e),s=this.tokenizer(n?e:[e],{padding:!0,truncation:!0}),o=(await this.
model(s)).logits,i=this.model.config.id2label,l=[];for(let c=0;c<o.dims[0];++c){const d=s.input_ids[c].tolist(),h=o[c],_=[];
for(let p=0;p<h.dims[0];++p){const w=h[p],v=We(w.data)[1],y=i?i[v]:`LABEL_${v}`;if(t.includes(y))continue;const b=this.tokenizer.
decode([d[p]],{skip_special_tokens:!0});if(b==="")continue;const k=nt(w.data);_.push({entity:y,score:k[v],index:p,word:b})}
l.push(r==="simple"?TD(_,d,this.tokenizer):_)}return n?l:l[0]}};function kD(e){const t=e[0];return e[1]==="-"&&(t==="B"||
t==="I"||t==="E"||t==="S")?[t,e.slice(2)]:["I",e]}function TD(e,t,r){const n=[];let s=null;for(let a=0;a<e.length;++a){const[
o,i]=kD(e[a].entity);s===i&&o!=="B"&&o!=="S"?(n[n.length-1].end=a+1,o==="E"&&(s=null)):(n.push({tag:i,start:a,end:a+1}),
s=o==="S"?null:i)}return n.map(({tag:a,start:o,end:i})=>{let l=0;const c=[];for(let d=o;d<i;++d)l+=e[d].score,c.push(t[e[d].
index]);return{entity_group:a,score:l/(i-o),word:r.decode(c,{skip_special_tokens:!0})}})}var ED=class extends je{async _call(e,t,{
top_k:r=1}={}){const n=this.tokenizer(e,{text_pair:t,padding:!0,truncation:!0}),s=Array.isArray(e),{start_logits:a,end_logits:o}=await this.
model(n),i=n.input_ids.tolist(),l=n.attention_mask.tolist(),{all_special_ids:c,sep_token_id:d}=this.tokenizer,h=[];for(let _=0;_<
a.dims[0];++_){const p=i[_],w=p.findIndex(C=>C==d),v=a[_].tolist(),y=o[_].tolist();for(let C=1;C<v.length;++C)(l[_]==0||
C<=w||c.findIndex(N=>N==p[C])!==-1)&&(v[C]=-1/0,y[C]=-1/0);const b=nt(v).map((C,N)=>[C,N]),k=nt(y).map((C,N)=>[C,N]);b[0][0]=
0,k[0][0]=0;const A=BM(b,k).filter(C=>C[0][1]<=C[1][1]).map(C=>[C[0][1],C[1][1],C[0][0]*C[1][0]]).sort((C,N)=>N[2]-C[2]),
E=[];for(let C=0;C<Math.min(A.length,r);++C){const[N,M,$]=A[C],R=p.slice(N,M+1),j=this.tokenizer.decode(R,{skip_special_tokens:!0});
E.push({answer:j,score:$})}r===1?h.push(...E):h.push(E)}return s?h:h[0]}},AD=class extends je{async _call(e,{top_k:t=5}={}){
const{mask_token_id:r,mask_token:n}=this.tokenizer,s=this.tokenizer(e,{padding:!0,truncation:!0}),{logits:a}=await this.
model(s),o=[],i=s.input_ids.tolist();for(let l=0;l<i.length;++l){const c=i[l],d=c.findIndex(v=>v==r);if(d===-1)throw Error(
`Mask token (${n}) not found in text.`);const h=a[l][d],_=await Cn(new G("float32",nt(h.data),h.dims),t),p=_[0].tolist(),
w=_[1].tolist();o.push(w.map((v,y)=>{const b=c.slice();return b[d]=v,{score:p[y],token:Number(v),token_str:this.tokenizer.
decode([v]),sequence:this.tokenizer.decode(b,{skip_special_tokens:!0})}}))}return Array.isArray(e)?o:o[0]}},Bu=class extends je{_default_generation_config={
max_new_tokens:256};_key="generated_text";async _call(e,t={}){Array.isArray(e)||(e=[e]),this.model.config.prefix&&(e=e.map(
i=>this.model.config.prefix+i));const r=this.model.config.task_specific_params;r&&r[this.task]&&r[this.task].prefix&&(e=
e.map(i=>r[this.task].prefix+i));const n=this.tokenizer,s={padding:!0,truncation:!0};let a;this.task==="translation"&&"_\
build_translation_inputs"in n?a=n._build_translation_inputs(e,s,t):a=n(e,s);const o=await this.model.generate({...a,...this.
_default_generation_config,...t});return n.batch_decode(o,{skip_special_tokens:!0}).map(i=>({[this._key]:i}))}},CD=class extends Bu{_key="\
summary_text"},SD=class extends Bu{_key="translation_text"};function O_(e){return Array.isArray(e)&&e.every(t=>"role"in t&&
"content"in t)}var PD=class extends je{_default_generation_config={max_new_tokens:256};async _call(e,t={}){const{add_special_tokens:r,
return_full_text:n,tools:s,documents:a,chat_template:o,tokenizer_encode_kwargs:i,...l}=t;let c=!1,d=!1,h=r??(this.tokenizer.
add_bos_token||this.tokenizer.add_eos_token)??!1,_=i,p;if(typeof e=="string")p=e=[e];else if(Array.isArray(e)&&e.every(E=>typeof E==
"string"))c=!0,p=e;else{if(O_(e))e=[e];else if(Array.isArray(e)&&e.every(O_))c=!0;else throw new Error("Input must be a \
string, an array of strings, a Chat, or an array of Chats");d=!0;const E={tokenize:!1,add_generation_prompt:!0,...Ze({tools:s,
documents:a,chat_template:o},["tools","documents","chat_template"]),..._};p=e.map(C=>this.tokenizer.apply_chat_template(
C,E)),h=!1,_=void 0}const w=d?!1:n??!0;this.tokenizer.padding_side="left";const v=this.tokenizer(p,{add_special_tokens:h,
padding:!0,truncation:!0,..._}),y=await this.model.generate({...v,...this._default_generation_config,...l}),b=this.tokenizer.
batch_decode(y,{skip_special_tokens:!0});let k;!w&&v.input_ids.dims.at(-1)>0&&(k=this.tokenizer.batch_decode(v.input_ids,
{skip_special_tokens:!0}).map(E=>E.length));const A=Array.from({length:e.length},E=>[]);for(let E=0;E<b.length;++E){const C=Math.
floor(E/y.dims[0]*e.length);k&&(b[E]=b[E].slice(k[C])),A[C].push({generated_text:d?[...e[C],{role:"assistant",content:b[E]}]:
b[E]})}return!c&&A.length===1?A[0]:A}},FD=class extends je{constructor(e){super(e),this.label2id=Object.fromEntries(Object.
entries(this.model.config.label2id).map(([t,r])=>[t.toLowerCase(),r])),this.entailment_id=this.label2id.entailment,this.
entailment_id===void 0&&(de.warn("Could not find 'entailment' in label2id mapping. Using 2 as entailment_id."),this.entailment_id=
2),this.contradiction_id=this.label2id.contradiction??this.label2id.not_entailment,this.contradiction_id===void 0&&(de.warn(
"Could not find 'contradiction' in label2id mapping. Using 0 as contradiction_id."),this.contradiction_id=0)}async _call(e,t,{
hypothesis_template:r="This example is {}.",multi_label:n=!1}={}){const s=Array.isArray(e);s||(e=[e]),Array.isArray(t)||
(t=[t]);const a=t.map(l=>r.replace("{}",l)),o=n||t.length===1,i=[];for(const l of e){const c=[];for(const _ of a){const p=this.
tokenizer(l,{text_pair:_,padding:!0,truncation:!0}),w=await this.model(p);o?c.push([w.logits.data[this.contradiction_id],
w.logits.data[this.entailment_id]]):c.push(w.logits.data[this.entailment_id])}const h=(o?c.map(_=>nt(_)[1]):nt(c)).map((_,p)=>[
_,p]).sort((_,p)=>p[0]-_[0]);i.push({sequence:l,labels:h.map(_=>t[_[1]]),scores:h.map(_=>_[0])})}return s?i:i[0]}},ID=class extends je{async _call(e,{
top_k:t=5}={}){const r=this.processor.feature_extractor.config.sampling_rate,n=await vn(e,r),s=this.model.config.id2label,
a=[];for(const o of n){const i=await this.processor(o),c=(await this.model(i)).logits[0],d=await Cn(new G("float32",nt(c.
data),c.dims),t),h=d[0].tolist(),p=d[1].tolist().map((w,v)=>({label:s?s[w]:`LABEL_${w}`,score:h[v]}));a.push(p)}return Array.
isArray(e)?a:a[0]}},LD=class extends je{async _call(e,t,{hypothesis_template:r="This is a sound of {}."}={}){const n=!Array.
isArray(e);n&&(e=[e]);const s=t.map(c=>r.replace("{}",c)),a=this.tokenizer(s,{padding:!0,truncation:!0}),o=this.processor.
feature_extractor.config.sampling_rate,i=await vn(e,o),l=[];for(const c of i){const d=await this.processor(c),h=await this.
model({...a,...d}),_=nt(h.logits_per_audio.data);l.push([..._].map((p,w)=>({score:p,label:t[w]})))}return n?l[0]:l}},OD=class extends je{_default_generation_config={};async _call(e,t={}){
switch(t={...this._default_generation_config,...t},this.model.config.model_type){case"whisper":case"lite-whisper":return this.
_call_whisper(e,t);case"wav2vec2":case"wav2vec2-bert":case"unispeech":case"unispeech-sat":case"hubert":case"parakeet_ctc":
return this._call_wav2vec2(e,t);case"moonshine":return this._call_moonshine(e,t);case"cohere_asr":return this._call_cohere_asr(
e,t);default:throw new Error(`AutomaticSpeechRecognitionPipeline does not support model type '${this.model.config.model_type}\
'.`)}}async _call_wav2vec2(e,t){t.language&&de.warn('`language` parameter is not yet supported for `wav2vec2` models, de\
faulting to "English".'),t.task&&de.warn('`task` parameter is not yet supported for `wav2vec2` models, defaulting to "tr\
anscribe".');const r=!Array.isArray(e),n=r?[e]:e,s=this.processor.feature_extractor.config.sampling_rate,a=await vn(n,s),
o=[];for(const i of a){const l=await this.processor(i),d=(await this.model(l)).logits[0],h=[];for(const p of d)h.push(We(
p.data)[1]);const _=this.tokenizer.decode(h,{skip_special_tokens:!0}).trim();o.push({text:_})}return r?o[0]:o}async _call_whisper(e,t){
const r=t.return_timestamps??!1,n=t.chunk_length_s??0,s=t.force_full_sequences??!1;let a=t.stride_length_s??null;const o={
...t};r==="word"&&(o.return_token_timestamps=!0,o.return_timestamps=!0);const i=!Array.isArray(e),l=i?[e]:e,c=this.processor.
feature_extractor.config,d=c.chunk_length/this.model.config.max_source_positions,h=c.hop_length,_=c.sampling_rate,p=await vn(
l,_),w=[];for(const v of p){let y=[];if(n>0){if(a===null)a=n/6;else if(n<=a)throw Error("`chunk_length_s` must be larger\
 than `stride_length_s`.");const A=_*n,E=_*a,C=A-2*E;let N=0;for(;;){const M=N+A,$=v.subarray(N,M),R=await this.processor(
$),j=N===0,Y=M>=v.length;if(y.push({stride:[$.length,j?0:E,Y?0:E],input_features:R.input_features,is_last:Y}),Y)break;N+=
C}}else y=[{stride:[v.length,0,0],input_features:(await this.processor(v)).input_features,is_last:!0}];for(const A of y){
o.num_frames=Math.floor(A.stride[0]/h);const E=await this.model.generate({inputs:A.input_features,...o});if(r==="word"){
const C=E.sequences.tolist()[0],N=E.token_timestamps.tolist()[0],M=this.tokenizer.timestamp_begin,$=Math.max(C.findIndex(
R=>Number(R)>=M),0);A.tokens=C.slice($),A.token_timestamps=N.slice($).map(R=>ts(R,2))}else A.tokens=E[0].tolist();A.stride=
A.stride.map(C=>C/_)}const[b,k]=this.tokenizer._decode_asr(y,{time_precision:d,return_timestamps:r,force_full_sequences:s});
w.push({text:b,...k})}return i?w[0]:w}async _call_moonshine(e,t){const r=!Array.isArray(e),n=r?[e]:e,s=this.processor.feature_extractor.
config.sampling_rate,a=await vn(n,s),o=[];for(const i of a){const l=await this.processor(i),c=Math.floor(i.length/s)*6,d=await this.
model.generate({max_new_tokens:c,...t,...l}),h=this.tokenizer.batch_decode(d,{skip_special_tokens:!0})[0];o.push({text:h})}
return r?o[0]:o}async _call_cohere_asr(e,t){const r=!Array.isArray(e),n=r?[e]:e,s=this.processor.feature_extractor,a=s.config.
sampling_rate,o=await vn(n,a),i=t.language??"en",l=this.processor.get_decoder_prompt_ids(i),c=[];for(const d of o){const h=s.
split_audio(d),_=[];for(const w of h){const v=await this.processor(w),y=await this.model.generate({...v,decoder_input_ids:l,
...t}),b=this.tokenizer.decode(y[0].tolist(),{skip_special_tokens:!0}).trim();_.push(b)}const p=this.processor.constructor.
join_chunks(_,i);c.push({text:p})}return r?c[0]:c}},ND=class extends je{DEFAULT_VOCODER_ID="Xenova/speecht5_hifigan";constructor(e){
super(e),this.vocoder=e.vocoder??null}async _prepare_speaker_embeddings(e,t){if((typeof e=="string"||e instanceof URL)&&
(e=new Float32Array(await(await we.fetch(e)).arrayBuffer())),e instanceof Float32Array)e=new G("float32",e,[e.length]);else if(!(e instanceof
G))throw new Error("Speaker embeddings must be a `Tensor`, `Float32Array`, `string`, or `URL`.");if(t>1){if(e.dims[0]===
1)e=e.repeat(t,1);else if(e.dims[0]!==t)throw new Error(`Expected speaker embeddings batch size to be 1 or ${t}, but got\
 ${e.dims[0]}.`)}return e}_postprocess_waveform(e,t,r,n=null){const s=t.data,[a,o]=t.dims,i=n?n.data:null,l=[];for(let c=0;c<
a;++c){const d=i?Math.min(Math.ceil(i[c]),o):o,h=c*o;l.push(new h2(s.slice(h,h+d),r))}return Array.isArray(e)?l:l[0]}async _call(e,t){
return this.processor?this._call_text_to_spectrogram(e,t):this.model.config.model_type==="supertonic"?this._call_supertonic(
e,t):this._call_text_to_waveform(e)}async _call_supertonic(e,{speaker_embeddings:t,num_inference_steps:r,speed:n}){if(!t)
throw new Error("Speaker embeddings must be provided for Supertonic models.");const{sampling_rate:s,style_dim:a}=this.model.
config,o=this.tokenizer(e,{padding:!0,truncation:!0}),i=o.input_ids.dims[0];t=await this._prepare_speaker_embeddings(t,i),
t=t.view(i,-1,a);const{waveform:l,durations:c}=await this.model.generate_speech({...o,style:t,num_inference_steps:r,speed:n});
return this._postprocess_waveform(e,l,s,c)}async _call_text_to_waveform(e){const t=this.tokenizer(e,{padding:!0,truncation:!0}),
{waveform:r}=await this.model(t),n=this.model.config.sampling_rate;return this._postprocess_waveform(e,r,n)}async _call_text_to_spectrogram(e,{
speaker_embeddings:t}){this.vocoder||(de.info("No vocoder specified, using default HifiGan vocoder."),this.vocoder=await rs.
from_pretrained(this.DEFAULT_VOCODER_ID,{dtype:"fp32"}));const{input_ids:r}=this.tokenizer(e,{padding:!0,truncation:!0}),
n=r.dims[0];t=await this._prepare_speaker_embeddings(t,n),t=t.view(n,-1);const{waveform:s}=await this.model.generate_speech(
r,t,{vocoder:this.vocoder}),a=this.processor.feature_extractor.config.sampling_rate;return this._postprocess_waveform(e,
s,a)}},DD=class extends je{async _call(e,t={}){const r=Array.isArray(e),n=await qt(e),{pixel_values:s}=await this.processor(
n),a=[];for(const o of s){o.dims=[1,...o.dims];const i=await this.model.generate({inputs:o,...t}),l=this.tokenizer.batch_decode(
i,{skip_special_tokens:!0}).map(c=>({generated_text:c.trim()}));a.push(l)}return r?a:a[0]}},zD=class extends je{async _call(e,{
top_k:t=5}={}){const r=await qt(e),{pixel_values:n}=await this.processor(r),s=await this.model({pixel_values:n}),{id2label:a}=this.
model.config,o=[];for(const i of s.logits){const l=await Cn(new G("float32",nt(i.data),i.dims),t),c=l[0].tolist(),h=l[1].
tolist().map((_,p)=>({label:a?a[_]:`LABEL_${_}`,score:c[p]}));o.push(h)}return Array.isArray(e)?o:o[0]}},N_={panoptic:"p\
ost_process_panoptic_segmentation",instance:"post_process_instance_segmentation",semantic:"post_process_semantic_segment\
ation"},yv=class extends je{async _call(e,{threshold:t=.5,mask_threshold:r=.5,overlap_mask_area_threshold:n=.8,label_ids_to_fuse:s=null,
target_sizes:a=null,subtask:o=null}={}){if(Array.isArray(e)&&e.length!==1)throw Error("Image segmentation pipeline curre\
ntly only supports a batch size of 1.");const l=await qt(e),c=l.map(b=>[b.height,b.width]),d=await this.processor(l),{inputNames:h,
outputNames:_}=this.model.sessions.model;if(!h.includes("pixel_values")){if(h.length!==1)throw Error(`Expected a single \
input name, but got ${h.length} inputs: ${h}.`);const b=h[0];if(b in d)throw Error(`Input name ${b} already exists in th\
e inputs.`);d[b]=d.pixel_values}const p=await this.model(d);let w=null;if(o!==null)w=N_[o];else if(this.processor.image_processor){
for(const[b,k]of Object.entries(N_))if(k in this.processor.image_processor){w=this.processor.image_processor[k].bind(this.
processor.image_processor),o=b;break}}const v=this.model.config.id2label,y=[];if(o)if(o==="panoptic"||o==="instance"){const b=w(
p,t,r,n,s,a??c)[0],k=b.segmentation;for(const A of b.segments_info){const E=new Uint8ClampedArray(k.data.length);for(let N=0;N<
k.data.length;++N)k.data[N]===A.id&&(E[N]=255);const C=new Mt(E,k.dims[1],k.dims[0],1);y.push({score:A.score,label:v[A.label_id],
mask:C})}}else if(o==="semantic"){const{segmentation:b,labels:k}=w(p,a??c)[0];for(const A of k){const E=new Uint8ClampedArray(
b.data.length);for(let N=0;N<b.data.length;++N)b.data[N]===A&&(E[N]=255);const C=new Mt(E,b.dims[1],b.dims[0],1);y.push(
{score:null,label:v[A],mask:C})}}else throw Error(`Subtask ${o} not supported.`);else{const k=p[_[0]];for(let A=0;A<c.length;++A){
const E=c[A],C=k[A];C.data.some(M=>M<-1e-5||M>1+1e-5)&&C.sigmoid_();const N=await Mt.fromTensor(C.mul_(255).to("uint8")).
resize(E[1],E[0]);y.push({label:null,score:null,mask:N})}}return y}},BD=class extends yv{async _call(e,t={}){const r=await qt(
e),n=await super._call(e,t),s=r.map((a,o)=>{const i=a.clone();return i.putAlpha(n[o].mask),i});return Array.isArray(e)?s:
s[0]}},RD=class extends je{async _call(e,t,{hypothesis_template:r="This is a photo of {}"}={}){const n=Array.isArray(e),
s=await qt(e),a=t.map(h=>r.replace("{}",h)),o=this.tokenizer(a,{padding:this.model.config.model_type==="siglip"?"max_len\
gth":!0,truncation:!0}),{pixel_values:i}=await this.processor(s),l=await this.model({...o,pixel_values:i}),c=this.model.
config.model_type==="siglip"?h=>h.sigmoid().data:h=>nt(h.data),d=[];for(const h of l.logits_per_image){const p=[...c(h)].
map((w,v)=>({score:w,label:t[v]}));p.sort((w,v)=>v.score-w.score),d.push(p)}return n?d:d[0]}},$D=class extends je{async _call(e,{
threshold:t=.9,percentage:r=!1}={}){const n=Array.isArray(e);if(n&&e.length!==1)throw Error("Object detection pipeline c\
urrently only supports a batch size of 1.");const s=await qt(e),a=r?null:s.map(_=>[_.height,_.width]),{pixel_values:o,pixel_mask:i}=await this.
processor(s),l=await this.model({pixel_values:o,pixel_mask:i}),c=this.processor.image_processor.post_process_object_detection(
l,t,a),{id2label:d}=this.model.config,h=c.map(_=>_.boxes.map((p,w)=>({score:_.scores[w],label:d[_.classes[w]],box:Fi(p,!r)})));
return n?h:h[0]}},GD=class extends je{async _call(e,t,{threshold:r=.1,top_k:n=null,percentage:s=!1}={}){const a=Array.isArray(
e),o=await qt(e),i=this.tokenizer(t,{padding:!0,truncation:!0}),l=await this.processor(o),c=[];for(let d=0;d<o.length;++d){
const h=o[d],_=s?null:[[h.height,h.width]],p=l.pixel_values[d].unsqueeze_(0),w=await this.model({...i,pixel_values:p});let v;
if("post_process_grounded_object_detection"in this.processor){const y=this.processor.post_process_grounded_object_detection(
w,i.input_ids,{box_threshold:r,text_threshold:r,target_sizes:_})[0];v=y.boxes.map((b,k)=>({score:y.scores[k],label:y.labels[k],
box:Fi(b,!s)}))}else{const y=this.processor.image_processor.post_process_object_detection(w,r,_,!0)[0];v=y.boxes.map((b,k)=>({
score:y.scores[k],label:t[y.classes[k]],box:Fi(b,!s)}))}v.sort((y,b)=>b.score-y.score),n!==null&&(v=v.slice(0,n)),c.push(
v)}return a?c:c[0]}},VD=class extends je{_default_generation_config={max_new_tokens:256};async _call(e,t,r={}){if(Array.
isArray(e)){if(e.length!==1)throw Error("Document Question Answering pipeline currently only supports a batch size of 1.");
e=e[0]}const n=(await qt(e))[0],{pixel_values:s}=await this.processor(n),a=`<s_docvqa><s_question>${t}</s_question><s_an\
swer>`,o=this.tokenizer(a,{add_special_tokens:!1,padding:!0,truncation:!0}).input_ids,i=await this.model.generate({inputs:s,
max_length:this.model.config.decoder.max_position_embeddings,decoder_input_ids:o,...this._default_generation_config,...r}),
c=this.tokenizer.batch_decode(i)[0].match(/<s_answer>(.*?)<\/s_answer>/);let d=null;return c&&c.length>=2&&(d=c[1].trim()),
[{answer:d}]}},UD=class extends je{async _call(e){const t=await qt(e),r=await this.processor(t),n=await this.model(r),s=[];
for(const a of n.reconstruction){const o=a.squeeze().clamp_(0,1).mul_(255).round_().to("uint8");s.push(Mt.fromTensor(o))}
return Array.isArray(e)?s:s[0]}},jD=class extends je{async _call(e){const t=await qt(e),r=await this.processor(t),{predicted_depth:n}=await this.
model(r),s=[];for(let a=0;a<t.length;++a){const o=n[a],[i,l]=o.dims.slice(-2),[c,d]=t[a].size,h=(await Rt(o.view(1,1,i,l),
{size:[d,c],mode:"bilinear"})).view(d,c),_=h.min().item(),p=h.max().item(),w=h.sub(_).div_(p-_).mul_(255).to("uint8").unsqueeze(
0),v=Mt.fromTensor(w);s.push({predicted_depth:h,depth:v})}return Array.isArray(e)?s:s[0]}},qD=class extends je{async _call(e,{
pooling:t="none",normalize:r=!1,quantize:n=!1,precision:s="binary"}={}){const a=this.tokenizer(e,{padding:!0,truncation:!0}),
o=await this.model(a);let i=o.last_hidden_state??o.logits??o.token_embeddings;switch(t){case"none":break;case"mean":i=KT(
i,a.attention_mask);break;case"first_token":case"cls":i=i.slice(null,0);break;case"last_token":case"eos":i=i.slice(null,
-1);break;default:throw Error(`Pooling method '${t}' not supported.`)}return r&&(i=i.normalize(2,-1)),n&&(i=ZT(i,s)),i}},
WD=class extends je{async _call(e,{pool:t=null}={}){const r=await qt(e),{pixel_values:n}=await this.processor(r),s=await this.
model({pixel_values:n});let a;if(t){if(!("pooler_output"in s))throw Error("No pooled output was returned. Make sure the \
model has a 'pooler' layer when using the 'pool' option.");a=s.pooler_output}else a=s.last_hidden_state??s.logits??s.image_embeds;
return a}},Ta=Object.freeze({"text-classification":{pipeline:MD,model:P_,default:{model:"Xenova/distilbert-base-uncased-\
finetuned-sst-2-english"},type:"text"},"token-classification":{pipeline:xD,model:aD,default:{model:"Xenova/bert-base-mul\
tilingual-cased-ner-hrl"},type:"text"},"question-answering":{pipeline:ED,model:dD,default:{model:"Xenova/distilbert-base\
-cased-distilled-squad"},type:"text"},"fill-mask":{pipeline:AD,model:uD,default:{model:"onnx-community/ettin-encoder-32m\
-ONNX",dtype:"fp32"},type:"text"},summarization:{pipeline:CD,model:hi,default:{model:"Xenova/distilbart-cnn-6-6"},type:"\
text"},translation:{pipeline:SD,model:hi,default:{model:"Xenova/t5-small"},type:"text"},"text2text-generation":{pipeline:Bu,
model:hi,default:{model:"Xenova/flan-t5-small"},type:"text"},"text-generation":{pipeline:PD,model:cD,default:{model:"onn\
x-community/Qwen3-0.6B-ONNX",dtype:"q4"},type:"text"},"zero-shot-classification":{pipeline:FD,model:P_,default:{model:"X\
enova/distilbert-base-uncased-mnli"},type:"text"},"audio-classification":{pipeline:ID,model:gD,default:{model:"Xenova/wa\
v2vec2-base-superb-ks"},type:"audio"},"zero-shot-audio-classification":{pipeline:LD,model:rs,default:{model:"Xenova/clap\
-htsat-unfused"},type:"multimodal"},"automatic-speech-recognition":{pipeline:OD,model:[oD,mD],default:{model:"Xenova/whi\
sper-tiny.en"},type:"multimodal"},"text-to-audio":{pipeline:ND,model:[lD,iD],default:{model:"onnx-community/Supertonic-T\
TS-ONNX",dtype:"fp32"},type:"text"},"image-to-text":{pipeline:DD,model:hD,default:{model:"Xenova/vit-gpt2-image-captioni\
ng"},type:"multimodal"},"image-classification":{pipeline:zD,model:fD,default:{model:"Xenova/vit-base-patch16-224"},type:"\
multimodal"},"image-segmentation":{pipeline:yv,model:[F_,I_,L_],default:{model:"Xenova/detr-resnet-50-panoptic"},type:"m\
ultimodal"},"background-removal":{pipeline:BD,model:[F_,I_,L_],default:{model:"Xenova/modnet"},type:"image"},"zero-shot-\
image-classification":{pipeline:RD,model:rs,default:{model:"Xenova/clip-vit-base-patch32"},type:"multimodal"},"object-de\
tection":{pipeline:$D,model:_D,default:{model:"Xenova/detr-resnet-50"},type:"multimodal"},"zero-shot-object-detection":{
pipeline:GD,model:pD,default:{model:"Xenova/owlvit-base-patch32"},type:"multimodal"},"document-question-answering":{pipeline:VD,
model:wD,default:{model:"Xenova/donut-base-finetuned-docvqa"},type:"multimodal"},"image-to-image":{pipeline:UD,model:vD,
default:{model:"Xenova/swin2SR-classical-sr-x2-64"},type:"image"},"depth-estimation":{pipeline:jD,model:yD,default:{model:"\
onnx-community/depth-anything-v2-small"},type:"image"},"feature-extraction":{pipeline:qD,model:rs,default:{model:"onnx-c\
ommunity/all-MiniLM-L6-v2-ONNX",dtype:"fp32"},type:"text"},"image-feature-extraction":{pipeline:WD,model:[bD,rs],default:{
model:"onnx-community/dinov3-vits16-pretrain-lvd1689m-ONNX",dtype:"fp32"},type:"image"}}),bv=Object.freeze({"sentiment-a\
nalysis":"text-classification",ner:"token-classification",asr:"automatic-speech-recognition","text-to-speech":"text-to-a\
udio",embeddings:"feature-extraction"});async function Mv(e){if(!e)throw new Error("modelId is required");return(await Jr(
e,cs,{})).exists?[cs]:[]}async function Cs(e,{config:t=null,dtype:r=null,device:n=null,model_file_name:s=null,include_tokenizer:a=!0,
include_processor:o=!0}={}){const i=await Tl(e,{config:t,dtype:r,device:n,model_file_name:s});if(a){const l=await ul(e);
i.push(...l)}if(o){const l=await Mv(e);i.push(...l)}return i}async function Ss(e,t,r={}){e=bv[e]??e;const n=Ta[e];if(!n)
throw new Error(`Unsupported pipeline task: ${e}. Must be one of [${Object.keys(Ta).join(", ")}]`);const{type:s}=n,i=await Cs(
t,{...r,include_tokenizer:s!=="audio"&&s!=="image",include_processor:s!=="text"});if(e==="text-generation"){const l=await kl(
t,r),c=xl(l),d=qC(c);if(d){const h=Object.values(d).map(_=>`onnx/${_}`);return i.filter(_=>!_.startsWith("onnx/")||h.some(
p=>_.startsWith(p)))}}return i}async function Mz(e,t=null,{progress_callback:r=null,config:n=null,cache_dir:s=null,local_files_only:a=!1,
revision:o="main",device:i=null,dtype:l=null,subfolder:c="onnx",use_external_data_format:d=null,model_file_name:h=null,session_options:_={}}={}){
e=bv[e]??e;const p=Ta[e.split("_",1)[0]];if(!p)throw Error(`Unsupported pipeline: ${e}. Must be one of [${Object.keys(Ta)}\
]`);t||(t=p.default.model,de.info(`No model specified. Using default model: "${t}".`),!l&&p.default.dtype&&(l=p.default.
dtype));const w=await Ss(e,t,{device:i,dtype:l});let v={};if(r)try{(await Promise.all(w.map(async Y=>Jr(t,Y)))).forEach(
(Y,Q)=>{Y.exists&&(v[w[Q]]={loaded:0,total:Y.size??0})})}catch(j){de.warn(`Unable to fetch model file metadata for total\
 progress tracking: ${j}`)}const y={progress_callback:r?new fa(r,v):void 0,config:n,cache_dir:s,local_files_only:a,revision:o,
device:i,dtype:l,subfolder:c,use_external_data_format:d,model_file_name:h,session_options:_},b=w.includes("tokenizer.jso\
n"),k=w.includes("preprocessor_config.json"),A=p.model;let E;if(Array.isArray(A)){const j=n??await us.from_pretrained(t,
y),{model_type:Y}=j,Q=A.find(z=>z.supports(Y));if(!Q)throw Error(`Unsupported model type "${Y}" for task "${e}". None of\
 the candidate model classes support this type.`);E=Q.from_pretrained(t,{...y,config:j})}else E=A.from_pretrained(t,y);const[
C,N,M]=await Promise.all([b?ke.from_pretrained(t,y):null,k?gC.from_pretrained(t,y):null,E]),$={task:e,model:M};C&&($.tokenizer=
C),N&&($.processor=N),kr(r,{status:"ready",task:e,model:t});const R=p.pipeline;return new R($)}var HD=e=>e>=19968&&e<=40959||
e>=13312&&e<=19903||e>=131072&&e<=173791||e>=173824&&e<=177983||e>=177984&&e<=178207||e>=178208&&e<=183983||e>=63744&&e<=
64255||e>=194560&&e<=195103,QD=class{put(e){throw Error("Not implemented")}end(){throw Error("Not implemented")}},D_=fe.
IS_PROCESS_AVAILABLE?e=>process.stdout.write(e):e=>console.log(e),XD=class extends QD{constructor(e,{skip_prompt:t=!1,callback_function:r=null,
token_callback_function:n=null,skip_special_tokens:s=!0,decode_kwargs:a={},...o}={}){super(),this.tokenizer=e,this.skip_prompt=
t,this.callback_function=r??D_,this.token_callback_function=n,this.decode_kwargs={skip_special_tokens:s,...a,...o},this.
token_cache=[],this.print_len=0,this.next_tokens_are_prompt=!0,this.special_ids=new Set(this.tokenizer.all_special_ids.map(
BigInt))}put(e){if(e.length>1)throw Error("TextStreamer only supports batch size of 1");const t=this.next_tokens_are_prompt;
if(t&&(this.next_tokens_are_prompt=!1,this.skip_prompt))return;const r=e[0];if(this.token_callback_function?.(r),r.length===
1&&this.special_ids.has(r[0])){if(this.decode_kwargs.skip_special_tokens)return;if(this.token_cache.length>0){const i=this.
tokenizer.decode(this.token_cache,this.decode_kwargs).slice(this.print_len);this.on_finalized_text(i,!1),this.token_cache=
[],this.print_len=0}const a=this.tokenizer.decode(r,this.decode_kwargs);this.on_finalized_text(a,!1);return}this.token_cache=
Dt(this.token_cache,r);const n=this.tokenizer.decode(this.token_cache,this.decode_kwargs);let s;t||n.endsWith(`
`)?(s=n.slice(this.print_len),this.token_cache=[],this.print_len=0):n.length>0&&HD(n.charCodeAt(n.length-1))?(s=n.slice(
this.print_len),this.print_len+=s.length):(s=n.slice(this.print_len,n.lastIndexOf(" ")+1),this.print_len+=s.length),this.
on_finalized_text(s,!1)}end(){let e;this.token_cache.length>0?(e=this.tokenizer.decode(this.token_cache,this.decode_kwargs).
slice(this.print_len),this.token_cache=[],this.print_len=0):e="",this.next_tokens_are_prompt=!0,this.on_finalized_text(e,
!0)}on_finalized_text(e,t){e.length>0&&this.callback_function?.(e),t&&this.callback_function===D_&&fe.IS_PROCESS_AVAILABLE&&
this.callback_function?.(`
`)}},xz=class extends XD{constructor(e,{skip_prompt:t=!1,callback_function:r=null,token_callback_function:n=null,on_chunk_start:s=null,
on_chunk_end:a=null,on_finalize:o=null,time_precision:i=.02,skip_special_tokens:l=!0,decode_kwargs:c={}}={}){super(e,{skip_prompt:t,
skip_special_tokens:l,callback_function:r,token_callback_function:n,decode_kwargs:c}),this.timestamp_begin=e.timestamp_begin,
this.on_chunk_start=s,this.on_chunk_end=a,this.on_finalize=o,this.time_precision=i,this.waiting_for_timestamp=!1}put(e){
if(e.length>1)throw Error("WhisperTextStreamer only supports batch size of 1");const t=e[0];if(t.length===1){const r=Number(
t[0])-this.timestamp_begin;if(r>=0){const n=r*this.time_precision;this.waiting_for_timestamp?this.on_chunk_end?.(n):this.
on_chunk_start?.(n),this.waiting_for_timestamp=!this.waiting_for_timestamp,this.token_callback_function?.(t);return}}return super.
put(e)}end(){super.end(),this.on_finalize?.()}},xv=class{constructor(e,t){this.image=e,this.timestamp=t}},YD=class{constructor(e,t){
e.length>0&&e[0]instanceof Mt&&(e=e.map((r,n)=>new xv(r,(n+1)/(e.length+1)*t))),this.frames=e,this.duration=t}get width(){
return this.frames[0].image.width}get height(){return this.frames[0].image.height}get fps(){return this.frames.length/this.
duration}};async function kz(e,{num_frames:t=null,fps:r=null}={}){if(!fe.IS_BROWSER_ENV)throw new Error("`load_video` is\
 currently only supported in browser environments.");if(t==null&&r==null)throw new Error("Either num_frames or fps must \
be provided.");const n=[],s=document.createElement("video");if(s.crossOrigin="anonymous",s.muted=!0,typeof e=="string")s.
src=e;else if(e instanceof Blob)s.src=URL.createObjectURL(e);else if(e instanceof HTMLVideoElement)s.src=e.src;else throw new Error(
"Invalid URL or video element provided.");if(await new Promise(h=>s.onloadedmetadata=h),s.seekable.start(0)===s.seekable.
end(0)){const _=await(await we.fetch(s.src)).blob();s.src=URL.createObjectURL(_),await new Promise(p=>s.onloadedmetadata=
p)}const a=s.duration;let o,i;t!=null?(o=t,i=t===1?0:a/(t-1)):(i=1/r,o=Math.floor(a/i));let l=[];for(let h=0;h<o;++h)l.push(
t===1?a/2:h*i);const c=document.createElement("canvas");c.width=s.videoWidth,c.height=s.videoHeight;const d=c.getContext(
"2d",{willReadFrequently:!0});for(const h of l){s.currentTime=h,await new Promise(v=>{s.onseeked=v}),d.drawImage(s,0,0,c.
width,c.height);const _=d.getImageData(0,0,c.width,c.height),p=new Mt(_.data,c.width,c.height,4),w=new xv(p,h);n.push(w)}
return s.remove(),new YD(n,a)}async function eo(e,t,r={}){const n=await An(r?.cache_dir);if(!n)return{allCached:!1,files:t.
map(o=>({file:o,cached:!1}))};const s=await Promise.all(t.map(async a=>{const{localPath:o,proposedCacheKey:i}=ps(e,a,r,n),
l=await ms(n,o,i);return{file:a,cached:!!l}}));return{allCached:s.every(a=>a.cached),files:s}}async function kv(e,t,r={}){
const n=await An(r?.cache_dir);if(!n)return!1;const{localPath:s,proposedCacheKey:a}=ps(e,t,r,n);return!!await ms(n,s,a)}
async function KD(e,t={}){if(!e)throw new Error("modelId is required");if(!await kv(e,"config.json",t))return!1;const r=await Cs(
e,t);return(await eo(e,r,t)).allCached}async function JD(e,t={}){if(!e)throw new Error("modelId is required");const r=await Cs(
e,t);return await eo(e,r,t)}async function ZD(e,t,r={}){if(!e)throw new Error("task is required");if(!t)throw new Error(
"modelId is required");if(!await kv(t,"config.json",r))return!1;const n=await Ss(e,t,r);return(await eo(t,n,r)).allCached}
async function ez(e,t,r={}){if(!e)throw new Error("task is required");if(!t)throw new Error("modelId is required");const n=await Ss(
e,t,r);return await eo(t,n,r)}async function Tv(e,t,r={}){const n=await An(r?.cache_dir);if(!n)return{filesDeleted:0,filesCached:0,
files:t.map(a=>({file:a,deleted:!1,wasCached:!1}))};if(!n.delete)throw new Error("Cache does not support delete operatio\
n");const s=await Promise.all(t.map(async a=>{const{localPath:o,proposedCacheKey:i}=ps(e,a,r,n),c=!!await ms(n,o,i);let d=!1;
if(c){const h=await n.delete(i),_=!h&&i!==o?await n.delete(o):!1;d=h||_}return{file:a,deleted:d,wasCached:c}}));return{filesDeleted:s.
filter(a=>a.deleted).length,filesCached:s.filter(a=>a.wasCached).length,files:s}}async function tz(e,t={}){if(!e)throw new Error(
"modelId is required");const r=await Cs(e,t);return await Tv(e,r,t)}async function rz(e,t,r={}){if(!e)throw new Error("t\
ask is required");if(!t)throw new Error("modelId is required");const n=await Ss(e,t,r);return await Tv(t,n,r)}var nz=Object.
keys(is);async function sz(e,{config:t=null,model_file_name:r=null,revision:n="main",cache_dir:s=null,local_files_only:a=!1}={}){
t=await kl(e,{config:t,cache_dir:s,local_files_only:a,revision:n});const o="onnx",i=xl(t),{sessions:l}=mg(i,t,{model_file_name:r}),
c=Object.values(l),d={revision:n,cache_dir:s,local_files_only:a};return(await Promise.all(nz.map(async _=>{const p=is[_]??
"",w=await Promise.all(c.map(async v=>{const y=`${o}/${v}${p}.onnx`;return(await Jr(e,y,d)).exists}));return{dtype:_,available:w.
every(Boolean)}}))).filter(_=>_.available).map(_=>_.dtype)}var Tz=class{static async get_files(e,t={}){return Cs(e,t)}static async get_pipeline_files(e,t,r={}){
return Ss(e,t,r)}static async get_model_files(e,t={}){return Tl(e,t)}static async get_tokenizer_files(e){return ul(e)}static async get_processor_files(e){
return Mv(e)}static async get_available_dtypes(e,t={}){return sz(e,t)}static async is_cached(e,t={}){return KD(e,t)}static async is_cached_files(e,t={}){
return JD(e,t)}static async is_pipeline_cached(e,t,r={}){return ZD(e,t,r)}static async is_pipeline_cached_files(e,t,r={}){
return ez(e,t,r)}static async get_file_metadata(e,t,r={}){return Jr(e,t,r)}static async clear_cache(e,t={}){return tz(e,
t)}static async clear_pipeline_cache(e,t,r={}){return rz(e,t,r)}};export{f2 as ASTFeatureExtractor,uS as ASTForAudioClassification,cS as ASTModel,Ll as ASTPreTrainedModel,oS as AfmoeForCausalLM,
aS as AfmoeModel,Fl as AfmoePreTrainedModel,rS as AlbertForMaskedLM,tS as AlbertForQuestionAnswering,eS as AlbertForSequenceClassification,
ZC as AlbertModel,vs as AlbertPreTrainedModel,sE as AlbertTokenizer,sS as ApertusForCausalLM,nS as ApertusModel,Pl as ApertusPreTrainedModel,
lS as ArceeForCausalLM,iS as ArceeModel,Il as ArceePreTrainedModel,ID as AudioClassificationPipeline,us as AutoConfig,St as AutoFeatureExtractor,
at as AutoImageProcessor,rs as AutoModel,gD as AutoModelForAudioClassification,mz as AutoModelForAudioFrameClassification,
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
wS as BertForSequenceClassification,vS as BertForTokenClassification,mS as BertModel,Sn as BertPreTrainedModel,oE as BertTokenizer,
$2 as BitImageProcessor,MS as BlenderbotForConditionalGeneration,bS as BlenderbotModel,Nl as BlenderbotPreTrainedModel,kS as BlenderbotSmallForConditionalGeneration,
xS as BlenderbotSmallModel,Dl as BlenderbotSmallPreTrainedModel,iE as BlenderbotSmallTokenizer,lE as BlenderbotTokenizer,
ES as BloomForCausalLM,TS as BloomModel,zl as BloomPreTrainedModel,cE as BloomTokenizer,OS as CHMv2ForDepthEstimation,V2 as CHMv2ImageProcessor,
Eg as CHMv2PreTrainedModel,U2 as CLIPFeatureExtractor,qm as CLIPImageProcessor,DS as CLIPModel,Zr as CLIPPreTrainedModel,
GS as CLIPSegForImageSegmentation,$S as CLIPSegModel,Bl as CLIPSegPreTrainedModel,zS as CLIPTextModel,Sg as CLIPTextModelWithProjection,
dE as CLIPTokenizer,BS as CLIPVisionModel,RS as CLIPVisionModelWithProjection,CS as CamembertForMaskedLM,FS as CamembertForQuestionAnswering,
SS as CamembertForSequenceClassification,PS as CamembertForTokenClassification,AS as CamembertModel,Pn as CamembertPreTrainedModel,
uE as CamembertTokenizer,Pr as CausalLMOutput,EC as CausalLMOutputWithPast,_2 as ChatterboxFeatureExtractor,kg as ChatterboxModel,
xg as ChatterboxPreTrainedModel,A2 as ChatterboxProcessor,G2 as ChineseCLIPFeatureExtractor,LS as ChineseCLIPModel,Tg as ChineseCLIPPreTrainedModel,
Cg as ClapAudioModelWithProjection,p2 as ClapFeatureExtractor,NS as ClapModel,za as ClapPreTrainedModel,Ag as ClapTextModelWithProjection,
zC as ClassifierFreeGuidanceLogitsProcessor,US as CodeGenForCausalLM,VS as CodeGenModel,Rl as CodeGenPreTrainedModel,fE as CodeGenTokenizer,
hE as CodeLlamaTokenizer,HS as Cohere2ForCausalLM,WS as Cohere2Model,Gl as Cohere2PreTrainedModel,g2 as CohereAsrFeatureExtractor,
XS as CohereAsrForConditionalGeneration,QS as CohereAsrModel,Vl as CohereAsrPreTrainedModel,S2 as CohereAsrProcessor,pE as CohereAsrTokenizer,
qS as CohereForCausalLM,jS as CohereModel,$l as CoherePreTrainedModel,_E as CohereTokenizer,KS as ConvBertForMaskedLM,eP as ConvBertForQuestionAnswering,
JS as ConvBertForSequenceClassification,ZS as ConvBertForTokenClassification,YS as ConvBertModel,Fn as ConvBertPreTrainedModel,
mE as ConvBertTokenizer,j2 as ConvNextFeatureExtractor,rP as ConvNextForImageClassification,Wm as ConvNextImageProcessor,
tP as ConvNextModel,Ul as ConvNextPreTrainedModel,sP as ConvNextV2ForImageClassification,nP as ConvNextV2Model,jl as ConvNextV2PreTrainedModel,
lP as DFineForObjectDetection,iP as DFineModel,Wl as DFinePreTrainedModel,DP as DINOv3ConvNextModel,Bg as DINOv3ConvNextPreTrainedModel,
H2 as DINOv3ViTImageProcessor,zP as DINOv3ViTModel,Rg as DINOv3ViTPreTrainedModel,X2 as DPTFeatureExtractor,qP as DPTForDepthEstimation,
Xm as DPTImageProcessor,jP as DPTModel,Zl as DPTPreTrainedModel,Lg as DacDecoderModel,Fg as DacDecoderOutput,Ig as DacEncoderModel,
Pg as DacEncoderOutput,Om as DacFeatureExtractor,cP as DacModel,Ba as DacPreTrainedModel,dP as DebertaForMaskedLM,_P as DebertaForQuestionAnswering,
hP as DebertaForSequenceClassification,fP as DebertaForTokenClassification,uP as DebertaModel,In as DebertaPreTrainedModel,
wE as DebertaTokenizer,yP as DebertaV2ForMaskedLM,xP as DebertaV2ForQuestionAnswering,bP as DebertaV2ForSequenceClassification,
MP as DebertaV2ForTokenClassification,vP as DebertaV2Model,Ln as DebertaV2PreTrainedModel,gE as DebertaV2Tokenizer,kP as DecisionTransformerModel,
Og as DecisionTransformerPreTrainedModel,mP as DeepseekV3ForCausalLM,pP as DeepseekV3Model,Hl as DeepseekV3PreTrainedModel,
wP as DeepseekV4ForCausalLM,gP as DeepseekV4Model,Ql as DeepseekV4PreTrainedModel,q2 as DeiTFeatureExtractor,EP as DeiTForImageClassification,
Hm as DeiTImageProcessor,TP as DeiTModel,Xl as DeiTPreTrainedModel,AP as DepthAnythingForDepthEstimation,Ng as DepthAnythingPreTrainedModel,
jD as DepthEstimationPipeline,CP as DepthProForDepthEstimation,Dg as DepthProPreTrainedModel,W2 as DetrFeatureExtractor,
PP as DetrForObjectDetection,FP as DetrForSegmentation,Qm as DetrImageProcessor,SP as DetrModel,Yl as DetrObjectDetectionOutput,
Ra as DetrPreTrainedModel,zg as DetrSegmentationOutput,LP as Dinov2ForImageClassification,IP as Dinov2Model,Kl as Dinov2PreTrainedModel,
NP as Dinov2WithRegistersForImageClassification,OP as Dinov2WithRegistersModel,Jl as Dinov2WithRegistersPreTrainedModel,
VP as DistilBertForMaskedLM,GP as DistilBertForQuestionAnswering,RP as DistilBertForSequenceClassification,$P as DistilBertForTokenClassification,
BP as DistilBertModel,On as DistilBertPreTrainedModel,vE as DistilBertTokenizer,VD as DocumentQuestionAnsweringPipeline,
Q2 as DonutFeatureExtractor,ml as DonutImageProcessor,UP as DonutSwinModel,$g as DonutSwinPreTrainedModel,Ml as DynamicCache,
hN as EdgeTamModel,HP as EfficientNetForImageClassification,Y2 as EfficientNetImageProcessor,WP as EfficientNetModel,ec as EfficientNetPreTrainedModel,
XP as ElectraForMaskedLM,JP as ElectraForQuestionAnswering,YP as ElectraForSequenceClassification,KP as ElectraForTokenClassification,
QP as ElectraModel,Nn as ElectraPreTrainedModel,yE as ElectraTokenizer,Vg as EmbeddingGemma2Model,Gg as EmbeddingGemma2PreTrainedModel,
N2 as EmbeddingGemma2Processor,$m as EmbeddingGemma2VideoProcessor,Im as EncodecFeatureExtractor,$C as EosTokenCriteria,
eF as Ernie4_5ForCausalLM,ZP as Ernie4_5Model,tc as Ernie4_5PretrainedModel,rF as EsmForMaskedLM,nF as EsmForSequenceClassification,
sF as EsmForTokenClassification,tF as EsmModel,bs as EsmPreTrainedModel,bE as EsmTokenizer,oF as EuroBertForMaskedLM,iF as EuroBertForSequenceClassification,
lF as EuroBertForTokenClassification,aF as EuroBertModel,Ms as EuroBertPreTrainedModel,uF as ExaoneForCausalLM,cF as ExaoneModel,
rc as ExaonePreTrainedModel,hF as FalconForCausalLM,_F as FalconH1ForCausalLM,fF as FalconH1Model,sc as FalconH1PreTrainedModel,
dF as FalconModel,nc as FalconPreTrainedModel,ME as FalconTokenizer,mF as FastViTForImageClassification,pF as FastViTModel,
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
tI as HeliumForCausalLM,eI as HeliumModel,xc as HeliumPreTrainedModel,EE as HerbertTokenizer,nI as HieraForImageClassification,
rI as HieraModel,kc as HieraPreTrainedModel,aI as HrmTextForCausalLM,sI as HrmTextModel,Tc as HrmTextPreTrainedModel,hI as HubertForCTC,
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
VI as MBartModel,xs as MBartPreTrainedModel,km as MBartTokenizer,DL as MPNetForMaskedLM,RL as MPNetForQuestionAnswering,
zL as MPNetForSequenceClassification,BL as MPNetForTokenClassification,NL as MPNetModel,Dn as MPNetPreTrainedModel,LE as MPNetTokenizer,
UL as MT5ForConditionalGeneration,VL as MT5Model,Hc as MT5PreTrainedModel,RI as MarianMTModel,BI as MarianModel,Nc as MarianPreTrainedModel,
SE as MarianTokenizer,dA as Mask2FormerImageProcessor,uA as MaskFormerFeatureExtractor,GI as MaskFormerForInstanceSegmentation,
wl as MaskFormerImageProcessor,$I as MaskFormerModel,Dc as MaskFormerPreTrainedModel,Xe as MaskedLMOutput,RC as MaxLengthCriteria,
WI as Metric3DForDepthEstimation,nw as Metric3DPreTrainedModel,HI as Metric3Dv2ForDepthEstimation,sw as Metric3Dv2PreTrainedModel,
QI as MgpstrForSceneTextRecognition,aw as MgpstrModelOutput,ow as MgpstrPreTrainedModel,QA as MgpstrProcessor,FE as MgpstrTokenizer,
uw as MimiDecoderModel,lw as MimiDecoderOutput,cw as MimiEncoderModel,iw as MimiEncoderOutput,XI as MimiModel,Va as MimiPreTrainedModel,
OC as MinLengthLogitsProcessor,NC as MinNewTokensLengthLogitsProcessor,ZI as Ministral3ForCausalLM,JI as Ministral3Model,
Bc as Ministral3PreTrainedModel,KI as MinistralForCausalLM,YI as MinistralModel,zc as MinistralPreTrainedModel,rL as Mistral3ForConditionalGeneration,
sL as Mistral4ForCausalLM,nL as Mistral4Model,$c as Mistral4PreTrainedModel,tL as MistralForCausalLM,eL as MistralModel,
Rc as MistralPreTrainedModel,oL as MobileBertForMaskedLM,lL as MobileBertForQuestionAnswering,iL as MobileBertForSequenceClassification,
aL as MobileBertModel,ks as MobileBertPreTrainedModel,IE as MobileBertTokenizer,uL as MobileLLMForCausalLM,cL as MobileLLMModel,
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
AL as ModernBertModel,Ts as ModernBertPreTrainedModel,MF as Moondream1ForConditionalGeneration,v2 as MoonshineFeatureExtractor,
OL as MoonshineForConditionalGeneration,LL as MoonshineModel,qc as MoonshinePreTrainedModel,XA as MoonshineProcessor,GL as MptForCausalLM,
$L as MptModel,Wc as MptPreTrainedModel,jL as MultiModalityCausalLM,dw as MultiModalityPreTrainedModel,WL as MusicgenForCausalLM,
hw as MusicgenForConditionalGeneration,qL as MusicgenModel,Qc as MusicgenPreTrainedModel,QL as NanoChatForCausalLM,HL as NanoChatModel,
Xc as NanoChatPreTrainedModel,YL as NemotronHForCausalLM,XL as NemotronHModel,Yc as NemotronHPreTrainedModel,JL as NeoBertForMaskedLM,
tO as NeoBertForQuestionAnswering,ZL as NeoBertForSequenceClassification,eO as NeoBertForTokenClassification,KL as NeoBertModel,
zn as NeoBertPreTrainedModel,OE as NllbTokenizer,DC as NoBadWordsLogitsProcessor,IC as NoRepeatNGramLogitsProcessor,rO as NomicBertModel,
fw as NomicBertPreTrainedModel,gA as NougatImageProcessor,NE as NougatTokenizer,mO as OPTForCausalLM,pO as OPTModel,nu as OPTPreTrainedModel,
$D as ObjectDetectionPipeline,oO as Olmo2ForCausalLM,aO as Olmo2Model,Jc as Olmo2PreTrainedModel,lO as Olmo3ForCausalLM,
iO as Olmo3Model,Zc as Olmo3PreTrainedModel,sO as OlmoForCausalLM,uO as OlmoHybridForCausalLM,cO as OlmoHybridModel,eu as OlmoHybridPreTrainedModel,
nO as OlmoModel,Kc as OlmoPreTrainedModel,hO as OpenAIPrivacyFilterForTokenClassification,dO as OpenAIPrivacyFilterModel,
tu as OpenAIPrivacyFilterPreTrainedModel,_O as OpenELMForCausalLM,fO as OpenELMModel,ru as OpenELMPreTrainedModel,wA as OwlViTFeatureExtractor,
yO as OwlViTForObjectDetection,vl as OwlViTImageProcessor,vO as OwlViTModel,au as OwlViTPreTrainedModel,YA as OwlViTProcessor,
wO as Owlv2ForObjectDetection,vA as Owlv2ImageProcessor,gO as Owlv2Model,su as Owlv2PreTrainedModel,bO as PaliGemmaForConditionalGeneration,
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
WO as Qwen3VLMoeForCausalLM,qO as Qwen3VLMoeForConditionalGeneration,nC as Qwen3VLProcessor,ww as Qwen3_5ForCausalLM,wu as Qwen3_5ForConditionalGeneration,
QO as Qwen3_5MoeForCausalLM,HO as Qwen3_5MoeForConditionalGeneration,JO as RFDetrForObjectDetection,KO as RFDetrModel,vw as RFDetrObjectDetectionOutput,
yu as RFDetrPreTrainedModel,oP as RTDetrForObjectDetection,kA as RTDetrImageProcessor,aP as RTDetrModel,ys as RTDetrObjectDetectionOutput,
ql as RTDetrPreTrainedModel,uN as RTDetrV2ForObjectDetection,cN as RTDetrV2Model,yw as RTDetrV2ObjectDetectionOutput,bu as RTDetrV2PreTrainedModel,
h2 as RawAudio,Mt as RawImage,YD as RawVideo,xv as RawVideoFrame,LC as RepetitionPenaltyLogitsProcessor,YO as ResNetForImageClassification,
XO as ResNetModel,vu as ResNetPreTrainedModel,aN as RoFormerForMaskedLM,lN as RoFormerForQuestionAnswering,oN as RoFormerForSequenceClassification,
iN as RoFormerForTokenClassification,sN as RoFormerModel,Rn as RoFormerPreTrainedModel,BE as RoFormerTokenizer,eN as RobertaForMaskedLM,
nN as RobertaForQuestionAnswering,tN as RobertaForSequenceClassification,rN as RobertaForTokenClassification,ZO as RobertaModel,
Bn as RobertaPreTrainedModel,zE as RobertaTokenizer,ci as Sam2ImageProcessor,xw as Sam2ImageSegmentationOutput,Mu as Sam2Model,
kw as Sam2PreTrainedModel,ig as Sam2Processor,sC as Sam2VideoProcessor,ci as Sam3ImageProcessor,fN as Sam3TrackerModel,ci as SamImageProcessor,
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
ON as SqueezeBertForSequenceClassification,IN as SqueezeBertModel,Es as SqueezeBertPreTrainedModel,GE as SqueezeBertTokenizer,
zN as StableLmForCausalLM,DN as StableLmModel,Eu as StableLmPreTrainedModel,RN as Starcoder2ForCausalLM,BN as Starcoder2Model,
Au as Starcoder2PreTrainedModel,gs as StoppingCriteria,_g as StoppingCriteriaList,$N as StyleTextToSpeech2Model,Cw as StyleTextToSpeech2PreTrainedModel,
CD as SummarizationPipeline,Pw as SupertonicForConditionalGeneration,Sw as SupertonicPreTrainedModel,hg as SuppressTokensAtBeginLogitsProcessor,
PC as SuppressTokensLogitsProcessor,qN as Swin2SRForImageSuperResolution,CA as Swin2SRImageProcessor,jN as Swin2SRModel,
Cu as Swin2SRPreTrainedModel,VN as SwinForImageClassification,UN as SwinForSemanticSegmentation,GN as SwinModel,Ka as SwinPreTrainedModel,
HN as T5ForConditionalGeneration,WN as T5Model,Su as T5PreTrainedModel,VE as T5Tokenizer,XN as TableTransformerForObjectDetection,
QN as TableTransformerModel,Fw as TableTransformerObjectDetectionOutput,Pu as TableTransformerPreTrainedModel,BC as TemperatureLogitsWarper,
G as Tensor,Bu as Text2TextGenerationPipeline,MD as TextClassificationPipeline,PD as TextGenerationPipeline,XD as TextStreamer,
ND as TextToAudioPipeline,xD as TokenClassificationPipeline,He as TokenClassifierOutput,ue as TokenizersBackend,hz as TopKLogitsWarper,
dz as TopPLogitsWarper,YN as TrOCRForCausalLM,Iw as TrOCRPreTrainedModel,SD as TranslationPipeline,Mc as UltravoxModel,Kg as UltravoxPreTrainedModel,
oC as UltravoxProcessor,JN as UniSpeechForCTC,ZN as UniSpeechForSequenceClassification,KN as UniSpeechModel,Ja as UniSpeechPreTrainedModel,
n3 as UniSpeechSatForAudioFrameClassification,t3 as UniSpeechSatForCTC,r3 as UniSpeechSatForSequenceClassification,e3 as UniSpeechSatModel,
As as UniSpeechSatPreTrainedModel,UA as VLChatProcessor,tA as VLMImageProcessor,a3 as VaultGemmaForCausalLM,s3 as VaultGemmaModel,
Fu as VaultGemmaPreTrainedModel,SA as ViTFeatureExtractor,l3 as ViTForImageClassification,ng as ViTImageProcessor,c3 as ViTMAEModel,
Lw as ViTMAEPreTrainedModel,d3 as ViTMSNForImageClassification,u3 as ViTMSNModel,Lu as ViTMSNPreTrainedModel,i3 as ViTModel,
Iu as ViTPreTrainedModel,o3 as VisionEncoderDecoderModel,h3 as VitMatteForImageMatting,PA as VitMatteImageProcessor,Ow as VitMattePreTrainedModel,
f3 as VitPoseForPoseEstimation,FA as VitPoseImageProcessor,Nw as VitPosePreTrainedModel,_3 as VitsModel,Dw as VitsModelOutput,
zw as VitsPreTrainedModel,jE as VitsTokenizer,p3 as VoxtralForConditionalGeneration,uC as VoxtralProcessor,T2 as VoxtralRealtimeFeatureExtractor,
Rw as VoxtralRealtimeForConditionalGeneration,Bw as VoxtralRealtimePreTrainedModel,fC as VoxtralRealtimeProcessor,x3 as Wav2Vec2BertForCTC,
k3 as Wav2Vec2BertForSequenceClassification,M3 as Wav2Vec2BertModel,Za as Wav2Vec2BertPreTrainedModel,qE as Wav2Vec2CTCTokenizer,
x2 as Wav2Vec2FeatureExtractor,cI as Wav2Vec2ForAudioFrameClassification,iI as Wav2Vec2ForCTC,lI as Wav2Vec2ForSequenceClassification,
oI as Wav2Vec2Model,Fr as Wav2Vec2PreTrainedModel,_C as Wav2Vec2Processor,pC as Wav2Vec2ProcessorWithLM,S3 as WavLMForAudioFrameClassification,
E3 as WavLMForCTC,A3 as WavLMForSequenceClassification,C3 as WavLMForXVector,T3 as WavLMModel,$n as WavLMPreTrainedModel,
k2 as WeSpeakerFeatureExtractor,P3 as WeSpeakerResNetModel,Gw as WeSpeakerResNetPreTrainedModel,E2 as WhisperFeatureExtractor,
Vw as WhisperForConditionalGeneration,I3 as WhisperModel,Ou as WhisperPreTrainedModel,mC as WhisperProcessor,xz as WhisperTextStreamer,
FC as WhisperTimeStampLogitsProcessor,YE as WhisperTokenizer,B3 as XLMForQuestionAnswering,D3 as XLMForSequenceClassification,
z3 as XLMForTokenClassification,O3 as XLMModel,Gn as XLMPreTrainedModel,$3 as XLMRobertaForMaskedLM,U3 as XLMRobertaForQuestionAnswering,
G3 as XLMRobertaForSequenceClassification,V3 as XLMRobertaForTokenClassification,R3 as XLMRobertaModel,Vn as XLMRobertaPreTrainedModel,
KE as XLMRobertaTokenizer,JE as XLMTokenizer,N3 as XLMWithLMHeadModel,$w as XVectorOutput,IA as YolosFeatureExtractor,q3 as YolosForObjectDetection,
sg as YolosImageProcessor,j3 as YolosModel,Uw as YolosObjectDetectionOutput,Nu as YolosPreTrainedModel,H3 as YoutuForCausalLM,
W3 as YoutuModel,Du as YoutuPreTrainedModel,X3 as ZayaForCausalLM,Q3 as ZayaModel,zu as ZayaPreTrainedModel,LD as ZeroShotAudioClassificationPipeline,
FD as ZeroShotClassificationPipeline,RD as ZeroShotImageClassificationPipeline,GD as ZeroShotObjectDetectionPipeline,Oe as cat,
oz as cos_sim,PT as dot,we as env,ct as full,xi as full_like,wm as interpolate,Rt as interpolate_4d,lz as layer_norm,t2 as load_audio,
uz as load_image,kz as load_video,ST as log_softmax,YT as matmul,ol as mean,KT as mean_pooling,_t as ones,ll as ones_like,
XT as permute,Mz as pipeline,ZT as quantize_embeddings,cz as rand,JT as randn,Fa as random,r2 as read_audio,iz as rfft,vm as slice,
nt as softmax,ur as stack,ym as std_mean,Cn as topk,bm as zeros,cl as zeros_like};
